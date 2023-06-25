import {TNL, TNLTypes} from "tnl-midjourney-api"
import {sleep} from "./time"

type MessageType = "prompt_result" | "upscaled_result" | "other"

// note: messageID of the button
export const upscale  = async (tnlClient: TNL, btnType: TNLTypes.ButtonTypes ,msgID: string) => {
    await tnlClient.button(btnType,msgID)
}

export const upscaleAll = async (tnlClient: TNL, msgID: string) => {
    const btnTypes: Array<TNLTypes.ButtonTypes> = ["U1", "U2", "U3", "U4"];
    
    for(let btnType of btnTypes){
        await upscale(tnlClient, btnType, msgID)
        await sleep();
    }

}

export const generatePrompt = async (tnlClient: TNL, prompt: string) => {
    const {success, messageId} =  await tnlClient.imagine(prompt)
    
    // TODO: handleError
    if(!success) { 
        throw new Error("Prompt generation failed")
    }
    return messageId;
}

export const getMessageType = (buttonField: Array<string>): MessageType => {
    if(buttonField.includes("U1")) {
        return "prompt_result"
    }
    else if(buttonField.includes("Web")) {
    return "upscaled_result"
    }
    
    return "other"
}