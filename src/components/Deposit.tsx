import { LoadingButton } from "@mui/lab";
import { Box } from "@mui/system";
import { useState } from "react";
import { useEthers } from "@usedapp/core"
import { initTransaction } from "../helpers/initTransaction"
import FormControl from '@mui/material/FormControl'
import { utils } from "ethers"
import Button from '@mui/material/Button';

import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputAdornment from '@mui/material/InputAdornment';

import Snackbar from '@mui/material/Snackbar'
import { Alert } from "../helpers/Alert"

export function Deposit() {

    const { account, chainId } = useEthers()

    const [loading, setLoading] = useState(false)
    const [open, setOpen] = useState(false)
    const [errorMessage, setErrorMessage] = useState("")
    const [openAlert, setOpenAlert] = useState(false)

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };


    const handleDeposit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()
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
        const data = new FormData(event.currentTarget);
        const amount = utils.parseEther(String(data.get("amount")))
        setLoading(true)

        try {
            const gameContract = await initTransaction(chainId)
            gameContract.deposit({ value: amount })
        } catch (err) {
            setErrorMessage("Transaction failed")
            console.log(err)
            setOpenAlert(true)
        }
        setLoading(false)
        setOpen(false)
    }

    ///********** Snackbar with error information *************/
    const handleCloseAlert = (event?: React.SyntheticEvent | Event, reason?: string) => {
        if (reason === 'clickaway') {
            return;
        }
        setOpenAlert(false);
    };

    return (
        <Box display="flex" className="justify-content-center">
            <Button variant="contained" onClick={handleClickOpen}>Add Deposit</Button>
            <Dialog open={open} onClose={handleClose}>
                <form onSubmit={handleDeposit}>
                    <DialogTitle>Deposit</DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            To deposit funds to smart contract, please enter the amount here and sign the transaction with metamask.
                        </DialogContentText>
                        <FormControl fullWidth>
                            <OutlinedInput
                                id="outlined-adornment-amount"
                                startAdornment={<InputAdornment position="start">MATIC</InputAdornment>}
                                fullWidth
                                label="Amount"
                                name="amount"
                            />
                        </FormControl>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleClose}>Cancel</Button>
                        <LoadingButton type="submit" loading={loading}>Transfer</LoadingButton>
                    </DialogActions>
                </form>
            </Dialog>
            <Snackbar open={openAlert} autoHideDuration={6000} onClose={handleCloseAlert}>
                <Alert onClose={handleClose} severity="error" sx={{ width: '100%' }}>
                    {errorMessage}
                </Alert>
            </Snackbar>
        </Box >
    )
}