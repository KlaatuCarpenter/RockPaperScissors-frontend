import { LoadingButton } from "@mui/lab";
import { Box } from "@mui/system";
import { useState } from "react";
import { useEthers } from "@usedapp/core"
import { initTransaction } from "../helpers/initTransaction"

import Snackbar from '@mui/material/Snackbar';
import { Alert } from "../helpers/Alert"

export function Withdraw() {

    const { account, chainId } = useEthers()

    const [loading, setLoading] = useState(false)
    const [errorMessage, setErrorMessage] = useState("")
    const [openAlert, setOpenAlert] = useState(false)

    const handleWithdraw = async () => {
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
            gameContract.withdraw()
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
                onClick={handleWithdraw}
            >
                Withdraw
            </LoadingButton>
            <Snackbar open={openAlert} autoHideDuration={6000} onClose={handleClose}>
                <Alert onClose={handleClose} severity="error" sx={{ width: '100%' }}>
                    {errorMessage}
                </Alert>
            </Snackbar>
        </Box >
    )
}