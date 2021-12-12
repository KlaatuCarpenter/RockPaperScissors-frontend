
import networkMapping from "../build/deployments/map.json";
import { constants, ethers } from "ethers";
import Game from "../build/contracts/Game.json";
import { IndexType } from "typescript";


declare let window: any;

export const initTransaction = async (chainId: number) => {
  
  const { abi } = Game;
  const gameAddress = chainId
    ? networkMapping[80001]
    : constants.AddressZero;



  const provider = new ethers.providers.Web3Provider(window.ethereum);
  await provider.send("eth_requestAccounts", []);
  const signer = await provider.getSigner();
  const gameContract = new ethers.Contract(
    gameAddress,
    abi,
    signer
  );

  return gameContract;
};