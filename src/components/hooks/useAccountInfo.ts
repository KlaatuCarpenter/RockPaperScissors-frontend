import networkMapping from "../../build/deployments/map.json";
import { constants, utils } from "ethers";
import Game from "../../build/contracts/Game.json";
import { useEthers, useContractCall, useContractCalls } from "@usedapp/core";

export function useBalance() {

    const { chainId, account } = useEthers()
    const { abi } = Game;
    const gameAddress = chainId
        ? networkMapping[80001]
        : constants.AddressZero;

    const gameInterface = new utils.Interface(abi);

    const [balance] =
        useContractCall(
            gameAddress && account && {
                abi: gameInterface,
                address: gameAddress,
                method: "balance",
                args: [account],
            }) ?? [];

    return [balance];
};

export function useMove() {
    const { account, chainId } = useEthers()
    const { abi } = Game;
    const gameAddress = chainId ? networkMapping[80001] : constants.AddressZero;

    const gameInterface = new utils.Interface(abi);

    const [move,
        wager,
        timeStamp,
        opponent,
        notRevealed,
        choice] =
        useContractCall(
            gameAddress && {
                abi: gameInterface,
                address: gameAddress,
                method: "moves",
                args: [account],
            }) ?? [];

    const [oppMove,
        oppWager,
        oppTimeStamp,
        oppOpponent,
        oppNotRevealed,
        oppChoice] = useContractCall(
            gameAddress && {
                abi: gameInterface,
                address: gameAddress,
                method: "moves",
                args: [opponent],
            }) ?? [];


    return [move,
        wager,
        opponent,
        notRevealed,
        choice,
        oppMove,
        oppWager,
        oppOpponent,
        oppNotRevealed,
        oppChoice];
}