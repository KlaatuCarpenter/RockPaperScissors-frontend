import { Box } from "@mui/system";
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Input from '@mui/material/Input';
import FormHelperText from '@mui/material/FormHelperText';
import Snackbar from '@mui/material/Snackbar';
import { Alert } from "../helpers/Alert";

import { playersOpponent, OpponentObserver } from './Move/PlayersMove';
import React, { useState, useEffect } from "react";
import { ethers } from 'ethers';
import { shortenIfAddress, useEthers } from '@usedapp/core';

import "../pages/style.css"

export function Opponent() {

    const { account } = useEthers()

    const [opponent, setOpponent] = useState<string>(ethers.constants.AddressZero)
    const [addressIsValid, setAddressIsValid] = useState<string>('Input an address of a player you want to play with')
    const [errorMessage, setErrorMessage] = useState("")
    const [openAlert, setOpenAlert] = useState(false)

    /// Share the state with other observers - components
    const onOpponentUpdated: OpponentObserver = (opponent: string) => { setOpponent(opponent) }
    useEffect(() => {
        playersOpponent.attach(onOpponentUpdated)
    }, [])

    /// If the user changes reset the opponent
    useEffect(() => {
        setOpponent(ethers.constants.AddressZero)
    }, [account])

    const handleChange = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        const data = new FormData(event.currentTarget as HTMLFormElement);
        try {
            const opponentToSet = data.get("opponent")
            ethers.utils.getAddress(String(opponentToSet))
            playersOpponent.update(String(opponentToSet))
            if (opponentToSet === account) {
                setErrorMessage("It is not possible to play with yourself")
                setOpenAlert(true)
                throw errorMessage
            }
            setAddressIsValid("Opponent's address is valid")
        } catch (err) {
            setAddressIsValid("Input valid opponent's address...")
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
                    <InputLabel htmlFor="opponent">{addressIsValid}</InputLabel>
                    <Input fullWidth name="opponent" id="opponent" aria-describedby="Input an address of an opponent" />
                    <FormHelperText>Opponent: {shortenIfAddress(opponent)}</FormHelperText>
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