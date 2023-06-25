import {RpcProvider} from 'starknet'

export const getRPCProvider = () => { 
    const providerRPC = new RpcProvider({
        nodeUrl: `${process.env.STRKN_RPC_URL}`,
        retries: 3,
      }); // substrate node

      return providerRPC;
}