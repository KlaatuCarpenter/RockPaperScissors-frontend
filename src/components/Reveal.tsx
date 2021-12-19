import { Box } from "@mui/system"
import { useState, useEffect } from "react"
import { ethers } from "ethers"
import { useEthers } from "@usedapp/core"
import LoadingButton from '@mui/lab/LoadingButton'
import { initTransaction, waitForTransaction } from "../helpers/initTransaction"

import Snackbar from '@mui/material/Snackbar'
import { Alert } from "../helpers/Alert"

export function Reveal() {

    const { chainId, account } = useEthers()

    const [loading, setLoading] = useState(false)
    const [revealed, setRevealed] = useState<boolean>(false)
    const [secret, setSecret] = useState(ethers.constants.HashZero)
    const [choice, setChoice] = useState(0)
    const [errorMessage, setErrorMessage] = useState("")
    const [openAlert, setOpenAlert] = useState(false)

    /// Load players move from local storage into state
    const getPlayersMove = async () => {
        let success = false
        if (!account) {
            setErrorMessage("No account connected")
            setOpenAlert(true)
            throw errorMessage
        }
        const playersMove = localStorage.getItem(account)
        if (!playersMove) {
            setErrorMessage("Error in loading move from local storage")
            throw errorMessage
        }
        const parsedPlayersMove = await JSON.parse(playersMove)
        setRevealed(parsedPlayersMove["revealed"])
        setSecret(parsedPlayersMove["secret"])
        setChoice(parsedPlayersMove["choice"])
        if (secret === parsedPlayersMove["secret"] &&
            revealed === parsedPlayersMove["revealed"] &&
            choice === parsedPlayersMove["choice"]) {
            success = true
        }
        if (!success) {
            setErrorMessage("Error in loading move from local storage")
            throw errorMessage
        }
        return success
    }

    useEffect(() => {
        getPlayersMove()
    }, [account])

    /// Send reveal transaction
    const revealMove = async () => {
        console.log(secret)
        if (!account) {
            setErrorMessage("No account connected")
            setOpenAlert(true)
            throw errorMessage
        }
        if (!getPlayersMove()) {
            setErrorMessage("Error in loading move from local storage")
            setOpenAlert(true)
            throw errorMessage
        }
        if (!chainId) {
            setLoading(false)
            setErrorMessage("Connection with blockchain failed")
            setOpenAlert(true)
            throw errorMessage
        }
        setLoading(true)
        try {
            const gameContract = await initTransaction(chainId)
            const tx = await gameContract.reveal(choice, secret)
            const txReceipt = await waitForTransaction(tx.hash, chainId)
            console.log(txReceipt)
        } catch (err) {
            setErrorMessage("Transaction failed")
            console.log(err)
            setOpenAlert(true)
        }
        setLoading(false)
    }

    ///********** Snackbar with error information *************/
    const handleClose = (event?: React.SyntheticEvent | Event, reason?: string) => {
        if (reason === 'clickaway') {
            return;
        }
        setOpenAlert(false);
    };

    return (
        <Box display="flex" pt={1}>
            <LoadingButton
                onClick={revealMove}
                loading={loading}
                variant="contained"
            >
                Reveal Move
            </LoadingButton>
            <Snackbar open={openAlert} autoHideDuration={6000} onClose={handleClose}>
                <Alert onClose={handleClose} severity="error" sx={{ width: '100%' }}>
                    {errorMessage}
                </Alert>
            </Snackbar>
        </Box>
    )
}