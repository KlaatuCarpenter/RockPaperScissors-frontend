import { LoadingButton } from "@mui/lab";
import { Box } from "@mui/system";
import React, { useEffect, useState } from "react";
import { useEthers } from "@usedapp/core"
import { initTransaction, waitForTransaction } from "../helpers/initTransaction"
import { Button } from "@mui/material";

import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Slide from '@mui/material/Slide';
import { TransitionProps } from '@mui/material/transitions';

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

    useEffect(() => {
        if (account) {
            const saved = localStorage.getItem(account)
            if (saved === "true")
                setFinished(true)
        }
    }, [])

    const getResult = async () => {
        if (!account) throw "No account connected"
        if (!chainId) throw "Connection error"
        setLoading(true)
        const gameContract = await initTransaction(chainId)

        try {
            const tx = await gameContract.result()
            const txReceipt = await waitForTransaction(tx.hash, chainId)
            console.log(txReceipt)

            localStorage.setItem(account, "true")
            setFinished(true)
            // txReceipt.events.find(event => event.event === "GameEnded")
            // const winner = event.args[0]

        } catch (err) {
            throw err
        }
        setLoading(false)
    }

    const handleClose = () => {
        if (account) {
            localStorage.setItem(account, "false")
            setFinished(false)
        }
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
            <Dialog
                open={finished}
                TransitionComponent={Transition}
                keepMounted
                onClose={handleClose}
                aria-describedby="result-dialog-slide-description"
            >
                <DialogTitle>{"Use Google's location service?"}</DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-slide-description">
                        Let Google help apps determine location. This means sending anonymous
                        location data to Google, even when no apps are running.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Cool</Button>
                </DialogActions>
            </Dialog>
        </Box>
    )
}