import { Box } from "@mui/system"
import { useState, useEffect } from "react"
import { ethers } from "ethers"
import { useEthers } from "@usedapp/core"
import LoadingButton from '@mui/lab/LoadingButton'
import { initTransaction, waitForTransaction } from "../helpers/initTransaction"

export function Reveal() {

    const { chainId, account } = useEthers()

    const [loading, setLoading] = useState(false)
    const [revealed, setRevealed] = useState<boolean>(false)
    const [secret, setSecret] = useState(ethers.constants.HashZero)
    const [choice, setChoice] = useState(0)

    /// Load players move from local storage into state
    const getPlayersMove = async () => {
        let success = false
        if (!account) throw "No account connected"
        const playersMove = localStorage.getItem(account)
        if (!playersMove) throw "No Move"
        const parsedPlayersMove = await JSON.parse(playersMove)
        setRevealed(parsedPlayersMove["revealed"])
        setSecret(parsedPlayersMove["secret"])
        setChoice(parsedPlayersMove["choice"])
        if (secret === parsedPlayersMove["secret"] &&
        revealed === parsedPlayersMove["revealed"] &&
        choice === parsedPlayersMove["choice"]) {
            success = true    
        }
        return success
    }

    useEffect(() => {
        getPlayersMove()
    },[account])

    /// Send reveal transaction
    const revealMove = async () => {
        console.log(secret)
        if (!account) throw "No account connected"
        if (!getPlayersMove()) throw "Error with local storage"
        if (!chainId) throw "Connection error"
        setLoading(true)
        const gameContract = await initTransaction(chainId)
        try {
            const tx = await gameContract.reveal(choice, secret)
            const txReceipt = await waitForTransaction(tx.hash, chainId)
            console.log(txReceipt)
        } catch (err) {
            throw err
        }
        setLoading(false)
    }

    return (
        <Box display="flex" pt={1}>
            <LoadingButton
                onClick={revealMove}
                loading={loading}
                variant="contained"
            >
                Reveal Move
            </LoadingButton>
        </Box>
    )
}