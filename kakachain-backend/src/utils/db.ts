import path, { resolve } from "path"
import loki, {Collection} from "lokijs"
import { readFileSync } from "fs";
import { cwd } from "process";

export  type CurrentPrompt= {
    prompt: string,
    imgURL: string,
    generated: boolean,
    minted: boolean,
    tokenID: number
  };

export type Mint = {
    prompt: string,
    imgURL: string,
    tokenID: string,
    blockNumber: string,
    txnHash: string,
}

export const createNewMintObj = (mintObj:{
    prompt: string,
    imgURL: string,
    tokenID: string ,
    blockNumber: string,
    txnHash: string,
}): Mint => {
    return mintObj
}

export const newCurrentPrompt = (prompt: string, tokenID: number): CurrentPrompt => {
    return {
      prompt,
      imgURL: "",
      generated:false,
      minted: false,
      tokenID
    }
}

export const collections = {
    "prompts": "prompts",
    "currentPrompt": "currentPrompt",
    "mints": "mints"
}

const getAllRecords = (c: Collection) => {
    const records = c.where((obj) => true);
    return records;
}

export const getDB = (filePath: string) => { 
    const db = new loki(filePath, {autosave:true, autoload:true});
    
    Object.keys(collections).forEach((c)=>{
        
        const n = collections[c];

        if(!db.getCollection(n)){
                db.addCollection(n);
                if(n === collections.prompts) {
	const promptsFile = readFileSync(resolve(cwd(), "./db/prompts.json"));
	const prompts = JSON.parse(promptsFile.toString());
	initDBWithPropmpts(db, prompts);
                }
            }
    })

    return db;
}

export const addNewPrompts = (db: loki, prompts: Array<string>) => 
{
    const promptCollection = db.getCollection(collections.prompts);
    prompts.forEach((prompt) => {
        promptCollection.insert({prompt});
    });
}

export const getTotalPromptsLeft = (db: loki) => {
    const promptCollection = db.getCollection(collections.prompts);
    return promptCollection.count();
}

export const getNextPrompt = (db: loki) => 
{
    const promptCollection = db.getCollection(collections.prompts);
    const totalPromptsLeft = promptCollection.count();

    if(totalPromptsLeft === 0){
        return null;
    }

    return getAllRecords(promptCollection)[0];
}

export const totalPromptsLeft = (db: loki) => {
    const promptCollection = db.getCollection(collections.prompts);
    return promptCollection.count();
}

export const removePrompt = (db: loki, p: Collection) => {
    const promptCollection = db.getCollection(collections.prompts);
    promptCollection.remove(p)
    db.saveDatabase();
}

export const initDBWithPropmpts = (db: loki, prompts:  Array<string>) => {
    const promptCollection = db.getCollection(collections.prompts);

    prompts.forEach((prompt) => {
        promptCollection.insert({prompt});
    })
}

export const addNewMint = (db: loki, mint: Mint) => {
    const mintCollection = db.getCollection(collections.mints);
    mintCollection.insert(mint);
    db.saveDatabase();
    return mint;
}

export const listMints = (db: loki): Array<Mint> => {
    const mintCollection = db.getCollection(collections.mints);
    return getAllRecords(mintCollection);
}

export const addCurrentPrompt = (db:loki, currentPrompt: CurrentPrompt) => {
    const currentPromptCollection = db.getCollection(collections.currentPrompt);
    currentPromptCollection.clear();
    currentPromptCollection.insert(currentPrompt);
    db.saveDatabase();
    return currentPrompt; 
}

export const getCurrentPrompt = (db:loki): CurrentPrompt| null => {
    const currentPromptCollection = db.getCollection(collections.currentPrompt);
    const currentPrompt = getAllRecords(currentPromptCollection)[0];
    return currentPrompt;
}

export const updateCurrentPrompt = (db:loki, currentPrompt: CurrentPrompt) => {
    const currentPromptCollection = db.getCollection(collections.currentPrompt);
    currentPromptCollection.update(currentPrompt);
}