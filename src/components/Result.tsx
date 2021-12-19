import { LoadingButton } from "@mui/lab";
import { Box } from "@mui/system";
import React, { useEffect, useState } from "react";
import { useEthers } from "@usedapp/core"
import { getGameEndedEvents, initTransaction, waitForTransaction } from "../helpers/initTransaction"
import { Button } from "@mui/material";

import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import Slide from '@mui/material/Slide';
import { TransitionProps } from '@mui/material/transitions';
import { constants } from "ethers"

import Snackbar from '@mui/material/Snackbar';
import { Alert } from "../helpers/Alert"

const Transition = React.forwardRef(function Transition(
    props: TransitionProps & {
        children: React.ReactElement<any, any>;
    },
    ref: React.Ref<unknown>,
) {
    return <Slide direction="up" ref={ref} {...props} />;
});

export function Result() {

    const { account, chainId } = useEthers()

    const [loading, setLoading] = useState(false)
    const [finished, setFinished] = useState(false)
    const [winner, setWinner] = useState(constants.AddressZero)
    const [errorMessage, setErrorMessage] = useState("")
    const [openAlert, setOpenAlert] = useState(false)

    ///************** Check if the player did not just finished the game. ****************/
    /// If he/she did then show the information about the result
    const checkGame = async () => {
        if (account) {
            const saved = localStorage.getItem(account)
            if (saved !== "false") {
                const gameEndedEvents = await getGameEndedEvents(account)
                if (gameEndedEvents?.length > 0) setWinner(gameEndedEvents[0]?.args?.winner)
                setFinished(true)
                console.log(winner)
                console.log(gameEndedEvents)
            }
        }
    }

    useEffect(() => {
        checkGame()
    })

    ///************** Result function *******************/
    const getResult = async () => {
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
            const tx = await gameContract.result()
            await waitForTransaction(tx.hash, chainId)
            const gameEndedEvents = await getGameEndedEvents(account)
            if (gameEndedEvents?.length > 0) setWinner(gameEndedEvents[0]?.args?.winner)
            localStorage.setItem(account, "true")
            setFinished(true)
        } catch (err) {
            setErrorMessage("Transaction failed")
            console.log(err)
            setOpenAlert(true)
        }
        setLoading(false)
    }

    const handleClose = () => {
        if (account) {
            localStorage.setItem(account, "false")
            setFinished(false)
        }
    }

    ///********** Snackbar with error information *************/
    const handleCloseAlert = (event?: React.SyntheticEvent | Event, reason?: string) => {
        if (reason === 'clickaway') {
            return;
        }
        setOpenAlert(false);
    };


    return (
        <Box display="flex" className="justify-content-center" pt={1}>
            <LoadingButton
                onClick={getResult}
                loading={loading}
                variant="contained"
            >
                Get the result
            </LoadingButton>
            <Dialog
                open={finished}
                TransitionComponent={Transition}
                keepMounted
                onClose={handleClose}
                aria-describedby="result-dialog-slide-description"
            >
                <DialogContent>
                    <DialogContentText id="alert-dialog-slide-description">
                        {winner === account ? (
                            <h1>You win!</h1>
                        ) : (
                            winner === constants.AddressZero ? (
                                <h1>It is a draw.</h1>
                            ) : (
                                <h1>You lose.</h1>
                            )
                        )}
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Cool. Play again.</Button>
                </DialogActions>
            </Dialog>
            <Snackbar open={openAlert} autoHideDuration={6000} onClose={handleCloseAlert}>
                <Alert onClose={handleClose} severity="error" sx={{ width: '100%' }}>
                    {errorMessage}
                </Alert>
            </Snackbar>
        </Box >
    )
}