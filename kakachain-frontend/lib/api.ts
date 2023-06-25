import { API_URL } from "./constants";

const axios = require('axios');

export const getHeaderData = async() => {
    const res = await Promise.all([getCurrentPrompt(), getCurrentBlock(), getTotatMints()]);
    return {
        currentPrompt: res[0].prompt,
        currentBlock: res[1],
        totalMints: res[2],
    }
}

export const getCurrentPrompt = async () => {

let config = {
  method: 'get',
  maxBodyLength: Infinity,
  url: API_URL + "/current_prompt",
  headers: { }
};

const {data}= await axios.request(config);
return data;
}


export const getCurrentBlock = async () => {

let config = {
  method: 'get',
  maxBodyLength: Infinity,
  url: API_URL + "/current_block",
  headers: { }
};

const {data}= await axios.request(config);
return data;
}

export const getTotatMints = async () => {
let config = {
  method: 'get',
  maxBodyLength: Infinity,
  url: API_URL + "/total_mints",
  headers: { }
};

const {data}= await axios.request(config);
return data;
}

export const getRecent6Mints = async () => {
    const mints = await getMints();
    console.log("ksa;ld", mints)
    if(mints){
        if(mints.length < 6){
            return mints;
        }
        return mints.slice(mints.length-6, mints.length);
    }

    return [];
}

export const getMints = async () => {
let config = {
  method: 'get',
  maxBodyLength: Infinity,
  url: API_URL + "/list_mints",
  headers: { }
};

const {data}= await axios.request(config);
return data;
}
