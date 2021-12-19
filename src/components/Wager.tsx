import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Input from '@mui/material/Input';
import FormHelperText from '@mui/material/FormHelperText';
import { Box } from "@mui/system";
import Snackbar from '@mui/material/Snackbar';
import { Alert } from "../helpers/Alert"

import { BigNumber } from '@ethersproject/bignumber';
import React, { useState, useEffect } from "react";
import { ethers } from 'ethers';

import { playersWager, WagerObserver } from './Move/PlayersMove';
import "../pages/style.css";


export function Wager() {
    const [wager, setWager] = useState<BigNumber>(ethers.BigNumber.from(0))
    const [isWagerValid, setIsWagerValid] = useState<string>('Input the wager you want to play, possibly 0')
    const [errorMessage, setErrorMessage] = useState("")
    const [openAlert, setOpenAlert] = useState(false)

    const onWagerUpdated: WagerObserver = (_wager) => {
        setWager(_wager)
    }

    useEffect(() => {
        playersWager.attach(onWagerUpdated)
    }, [])

    const handleChange = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        const data = new FormData(event.currentTarget as HTMLFormElement);
        try {
            const _wager = data.get("wager")
            const wagerToSet = ethers.utils.parseEther(String(_wager))
            if (wagerToSet.lt(ethers.BigNumber.from(0))) {
                setErrorMessage("Wager cannot be less than 0!")
                setOpenAlert(true)
                throw errorMessage
            }
            playersWager.update(wagerToSet)
            setIsWagerValid(('Input the wager you want to play, possibly 0'))
        } catch (err) {
            setIsWagerValid("Wager should be a positive number...")
        }
    }

    ///********** Snackbar with error information *************/
    const handleClose = (event?: React.SyntheticEvent | Event, reason?: string) => {
        if (reason === 'clickaway') {
            return;
        }
        setOpenAlert(false);
    };

    return (
        <Box px={3} py={1} display="flex" className="justify-content-center">
            <FormControl sx={{ width: '100%' }}>
                <form onChange={handleChange}>
                    <InputLabel htmlFor="wager">{isWagerValid}</InputLabel>
                    <Input fullWidth name="wager" id="wager" aria-describedby="Input a wager to play" />
                    <FormHelperText>Wager: {ethers.utils.formatEther(wager)} MATIC</FormHelperText>
                </form>
            </FormControl>
            <Snackbar open={openAlert} autoHideDuration={6000} onClose={handleClose}>
                <Alert onClose={handleClose} severity="error" sx={{ width: '100%' }}>
                    {errorMessage}
                </Alert>
            </Snackbar>
        </Box>
    );

}


