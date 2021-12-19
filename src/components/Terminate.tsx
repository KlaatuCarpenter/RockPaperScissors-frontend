import { LoadingButton } from "@mui/lab";
import { Box } from "@mui/system";
import { Snackbar } from '@mui/material';
import { Alert } from "../helpers/Alert";

import { useState } from "react";
import { useEthers } from "@usedapp/core";
import { initTransaction, waitForTransaction } from "../helpers/initTransaction";

export function Terminate() {

    const { account, chainId } = useEthers()

    const [loading, setLoading] = useState(false)
    const [errorMessage, setErrorMessage] = useState("")
    const [openAlert, setOpenAlert] = useState(false)

    const handleTermination = async () => {
        if (!account) {
            setErrorMessage("No account connected")
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
            const tx = await gameContract.terminateGame()
            await waitForTransaction(tx.hash, chainId)
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
        <Box textAlign={"center"}>
            <LoadingButton
                loading={loading}
                onClick={handleTermination}
            >
                Terminate the game
            </LoadingButton>
            <Snackbar open={openAlert} autoHideDuration={6000} onClose={handleClose}>
                <Alert onClose={handleClose} severity="error" sx={{ width: '100%' }}>
                    {errorMessage}
                </Alert>
            </Snackbar>
        </Box >
    )
}