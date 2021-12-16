
import networkMapping from "../build/deployments/map.json";
import { constants, ethers, providers } from "ethers";
import Game from "../build/contracts/Game.json";
import { useEthers } from "@usedapp/core"


declare let window: any;

export const initTransaction = async (chainId: number) => {
  
  const { abi } = Game;
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

export const contractInstance = async (chainId: number) => {
  const MUMBAI_RPC_URL = process.env.REACT_APP_MUMBAI_RPC_URL || "https://polygon-mumbai.alchemyapi.io/v2/your-api-key"
  const provider = new providers.JsonRpcProvider(MUMBAI_RPC_URL)
  const signer = provider.getSigner();
  const { abi } = Game;
  const gameAddress = chainId ? networkMapping[80001] : constants.AddressZero;
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