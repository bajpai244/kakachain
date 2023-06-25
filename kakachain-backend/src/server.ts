import express from 'express'
import bodyParser from 'body-parser'
import loki from "lokijs"

import { addCurrentPrompt, addNewMint, addNewPrompts, createNewMintObj, getCurrentPrompt, getNextPrompt, listMints, newCurrentPrompt, removePrompt, totalPromptsLeft, updateCurrentPrompt } from"./utils/db"
import { TNL } from 'tnl-midjourney-api';
import { getMessageType } from './utils/tnl';
import { RpcProvider } from 'starknet';
import { getERC721Owner, mintERC721 } from './utils/starknet';

const jsonParser = bodyParser.json();

const app = express()
const port = 3000

export const startServer = async (db: loki, tnlClient: TNL, strkClient: RpcProvider) => {


// Middleware to enable CORS
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', '*');
  next();
});

app.get('/status', (_, res) => {
  res.send('healthy')
})

app.get("/unsolved_prompts", (_, res) => {
})

app.post("/webhook" , jsonParser, async (req, res)=> {
    console.log("recieved payload =>",req.body)
   
    if(req.body){
     const messageType = getMessageType(req.body.buttons);
     if(messageType === "prompt_result") {
       console.log("recieved prompt result, upscaling");
       const  {success, messageId}= await tnlClient.button("U1", req.body.buttonMessageId); 

       // TODO: handleError
       if(!success) {
          console.error("Upscaling failed");
          res.send("Upscaling failed");
          return;
       }
       console.log("Upscaling successful, messageID:", messageId);
     }
     else if(messageType === "upscaled_result" ){
        console.log("recieved upscaled result, minting")
        const currentPrompt = getCurrentPrompt(db);
        if(currentPrompt.generated){
          return;
        }

        const imgURL = req.body.imageUrl;
        currentPrompt.imgURL = imgURL;
        currentPrompt.generated = true;

        console.log("Upscaled image URL:", imgURL);

        // Do the ERC721 minting here
       const {tx_hash} = await mintERC721(strkClient,"0xab", currentPrompt.tokenID);
       const owner = await getERC721Owner(strkClient, `${currentPrompt.tokenID}`);

       // TODO: check if owner will be falsy if not set in starknet js
       if(owner){
       console.log(`mint successful, tokenID: ${currentPrompt.tokenID}, owner: ${owner}`, );
       
       const mintObj = createNewMintObj({
        prompt: req.body.content,
        imgURL,
        tokenID: `${currentPrompt.tokenID}`,
        blockNumber:"dummy",
        txnHash: tx_hash
       })

      addNewMint(db,mintObj);
      console.log("mintObj added to db, mintObj:", mintObj);

      currentPrompt.minted = true;
      updateCurrentPrompt(db, currentPrompt);
      console.log("currentPrompt updated, currentPrompt:", currentPrompt);   
    }
       else {
        console.error("token not set yet, owner:", owner);
       }
     }
    }
})

app.post("/mintNext", jsonParser, async (req, res) => {
  if(req.headers.api_key !== process.env.API_KEY){
    res.status(401).send("unauthorized");
    return;
  }

  const currentPrompt = getCurrentPrompt(db);

    if(currentPrompt) {
      // 5 mins and no response? prob make another call to describe
      if(!currentPrompt.generated) {
        await tnlClient.imagine(currentPrompt.prompt);
        res.send("prompt not generated yet, retrying");
        return;
      }
      // 5 mins and no response? prob make another call to describe
      if(!currentPrompt.minted) {
        await tnlClient.imagine(currentPrompt.prompt);
        res.send("prompt not minted yet, retrying");
        return;
      }
    }  

    const nextPrompt = getNextPrompt(db)    
    if(nextPrompt === null) {
      res.send("No prompts left");
      return;
    }
    console.log("next prompt set, total prompts left:", totalPromptsLeft(db));
    
    const newCurPrompt = newCurrentPrompt(nextPrompt.prompt, currentPrompt? currentPrompt.tokenID + 1 : 0);
    addCurrentPrompt(db, newCurPrompt);

    const {success, messageId} = await tnlClient.imagine(nextPrompt.prompt);
    if(success){
      removePrompt(db,nextPrompt);
      console.log("prompt sent to imagine, message_id:", messageId);
    }

    res.send(`image requested, message_id: ${messageId}`);
})

app.post("/add_prompts",jsonParser,(req, res)=>{
  if(req.headers.api_key !== process.env.API_KEY){
    res.status(401).send("unauthorized");
    return;
  }

  try{
  const prompts = req.body.prompts;
  if(prompts.length){
    addNewPrompts(db, prompts);
  }
  res.send("prompts added");
  }
  catch(e){
    res.status(400).send("bad request");
  }

})

app.get("/list_mints", (req, res) => {
  res.send(listMints(db));
})

app.get("/current_prompt", (req, res) => {
  res.send(getCurrentPrompt(db));
})

app.get("/total_prompts_left", (req, res) => {
  res.send(`${totalPromptsLeft(db)}`);
})

app.get("/total_mints", (req, res) => {
  const totalMints = listMints(db);
  res.send(`${totalMints ? totalMints.length : 0}`);
})

app.get("/current_block",async (req, res)=>{
  const {block_number} = await strkClient.getBlock();
  res.send(`${block_number}`);
})

app.listen(port, () => {
  console.log(`Kaka-chain service listening on port ${port}`)
})
}