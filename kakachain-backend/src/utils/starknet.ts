import { readFileSync} from "fs"
import { RpcProvider, Account, ec, transaction, stark, hash, Contract } from "starknet"
import { NFT_CONTRACT_ADDRESS } from "./constants";
import BN from "bn.js";

export const mintERC721 = async (providerRPC: RpcProvider, to: string, tokenID: number)=> {
    const starkKeyPair = ec.getKeyPair(
        "0x00c1cf1490de1352865301bb8705143f3ef938f97fdf892f1090dcb5ac7bcd1d"
    );
    const address = "0x2"

    const nonce = await providerRPC.getNonceForAddress(address);
    const chainId = await providerRPC.getChainId();

    const calldata = transaction.fromCallsToExecuteCalldata([
        {
          contractAddress: NFT_CONTRACT_ADDRESS,
          entrypoint: "mint",
          calldata: stark.compileCalldata({
            to,
            tokenId: {
              type: "struct",
              low: `${tokenID}`,
              high: "0",
            },
          }),
        },
      ]);

      const maxFee = "0x11111111111";
      const version = "0x1";
      const txnHash = hash.calculateTransactionHash(
        address,
        version,
        calldata,
        maxFee,
        chainId,
        nonce
      );
      const signature = ec.sign(starkKeyPair, txnHash);
      const invocationCall = {
        signature,
        contractAddress: address,
        calldata,
      };
    
      const invocationDetails = {
        maxFee,
        nonce,
        version,
      };
    
      // if estimating fees passes without failures, the txn should go through
      const estimateFee = await providerRPC.getEstimateFee(
        invocationCall,
        invocationDetails
      );
      console.log("Estimate fee - ", estimateFee);
    
      const tx = await providerRPC.invokeFunction(invocationCall, invocationDetails);
      await providerRPC.waitForTransaction(tx.transaction_hash);

    return {
        tx_hash: tx.transaction_hash
    }
}

export const getERC721Owner = async (providerRPC: RpcProvider, tokenID: string) => {
    const d = readFileSync("./src/abis/erc721.json");
    const {abi} = JSON.parse(d.toString());
    const contract = new Contract(abi, NFT_CONTRACT_ADDRESS, providerRPC);

    return (await contract.call("ownerOf", [[tokenID,"0x0"]]))[0] as BN;
}