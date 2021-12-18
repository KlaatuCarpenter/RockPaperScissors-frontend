
import networkMapping from "../build/deployments/map.json";
import { constants, ethers, providers } from "ethers";
import Game from "../build/contracts/Game.json";

declare let window: any;
const { abi } = Game;


export const initTransaction = async (chainId: number) => {
  const gameAddress = chainId ? networkMapping[80001] : constants.AddressZero;

  const provider = new ethers.providers.Web3Provider(window.ethereum);
  await provider.send("eth_requestAccounts", []);
  const signer = provider.getSigner();
  const gameContract = new ethers.Contract(
    gameAddress,
    abi,
    signer
  );

  return gameContract;
};

export const getProvider = async (chainId: number) => {
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  return provider
}

export const contractInstanceMumbai = async () => {
  const MUMBAI_RPC_URL = process.env.REACT_APP_MUMBAI_RPC_URL || "https://polygon-mumbai.alchemyapi.io/v2/your-api-key"
  const provider = new providers.JsonRpcProvider(MUMBAI_RPC_URL)
  const signer = provider.getSigner();
  const gameAddress = networkMapping[80001]
  const contract = new ethers.Contract(
    gameAddress,
    abi,
    signer
  )
  return contract
}

export const getAlchemyProvider = async () => {
  const MUMBAI_RPC_URL = process.env.REACT_APP_MUMBAI_RPC_URL || "https://polygon-mumbai.alchemyapi.io/v2/your-api-key"
  const provider = new providers.JsonRpcProvider(MUMBAI_RPC_URL)
  return provider
}

export const waitForTransaction = async (txHash: string, chainId: number) => {
  const provider = await getProvider(chainId)
  const expectedBlockTime = 1000;
  const sleep = (milliseconds: number) => {
    return new Promise(resolve => setTimeout(resolve, milliseconds))
  }
  let txReceipt = null
  while (txReceipt == null) { // Waiting expectedBlockTime until the transaction is mined
    txReceipt = await provider.getTransactionReceipt(txHash)
    await sleep(expectedBlockTime)
  }
  return txReceipt
}


export const getGameEndedEvents = async (playerAddress: string) => {
  const contract = await contractInstanceMumbai()
  const provider = await getAlchemyProvider()

  const filter = contract.filters.GameEnded(null, playerAddress)
  const latestBlock = await provider.getBlockNumber()
  const fromBlock = latestBlock - 1000  /// 1000 block is the Alchemy provider limit in Mumbai
  const events = await contract.queryFilter(filter, fromBlock)
  console.log(filter)
  console.log(events)

  return events

}