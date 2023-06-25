import {resolve} from "path"

import {config} from "dotenv"
import { startServer } from "./server";
import { getRPCProvider } from "./utils"
import { getERC721Owner, mintERC721 } from "./utils/starknet";
import { getDB, getNextPrompt, initDBWithPropmpts } from "./utils/db";
import { cwd } from "process";
import { TNL } from "tnl-midjourney-api";

const main = async () => {

	config();

	const db = getDB(resolve(cwd(),"./db/kakachain.json"));
	const tnlClient = new TNL(process.env.TNL_API_KEY);
	const providerRPC =  getRPCProvider();

	await startServer(db, tnlClient, providerRPC);

	// const block = await providerRPC.getBlockHashAndNumber();
	// console.log(block);

	// // await mintERC721(providerRPC,"0x8",3);

	// console.log(await getERC721Owner(providerRPC, "0x3"));
}

main()