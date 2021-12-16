import { LoadingButton } from "@mui/lab";
import { Box } from "@mui/system";
import { useState, useEffect } from "react";
import { useEthers } from "@usedapp/core"
import { initTransaction } from "../helpers/initTransaction"
import { ethers, constants } from "ethers";
import { Button } from "@mui/material";

import Game from "../build/contracts/Game.json";
import networkMapping from "../build/deployments/map.json";

import { contractInstance, getAlchemyProvider } from "../helpers/initTransaction"

import { gameFinished, GameObserver } from './Move/PlayersMove'

export function Result() {

    const { account, chainId } = useEthers()

    const [loading, setLoading] = useState(false)
    const [finished, setFinished] = useState(false)

    const onGameStatusUpdated: GameObserver = (finished) => { setFinished(finished) }

    useEffect(() => { gameFinished.attach(onGameStatusUpdated) }, [])

    const getResult = async () => {
        if (!account) throw "No account connected"
        const playersMove = localStorage.getItem(account)
        if (!chainId) throw "Connection error"
        setLoading(true)
        const gameContract = await initTransaction(chainId)

        try {
            gameContract.result()
        } catch (err) {
            throw err
        }
        setLoading(false)
        gameFinished.update(true)
    }



    return (
        <Box display="flex" className="justify-content-center" pt={1}>
            <LoadingButton
                onClick={getResult}
                loading={loading}
                variant="contained"
            >
                Get the result
            </LoadingButton>
        </Box>
    )
}