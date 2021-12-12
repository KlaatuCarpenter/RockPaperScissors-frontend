import React, { useState, useEffect } from "react"
import { Box } from "@mui/system"
import "../pages/style.css"
import { playersOpponent, OpponentObserver } from './Move/PlayersMove'
import { ethers } from 'ethers'
import FormControl from '@mui/material/FormControl'
import InputLabel from '@mui/material/InputLabel'
import Input from '@mui/material/Input';
import FormHelperText from '@mui/material/FormHelperText';
import { shortenIfAddress, useEthers } from '@usedapp/core';

export function Opponent() {

    const [opponent, setOpponent] = useState<string>(ethers.constants.AddressZero)
    const [addressIsValid, setAddressIsValid] = useState<string>('Input an address of a player you want to play with')

    const onOpponentUpdated: OpponentObserver = (opponent: string) => {
        setOpponent(opponent)
    }

    useEffect(() => {
        playersOpponent.attach(onOpponentUpdated)
    }, [])

    const formatAddress = () => {
        return shortenIfAddress(opponent)
    }


    const handleChange = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        const data = new FormData(event.currentTarget as HTMLFormElement);
        try {
            const opponentToSet = data.get("opponent")
            ethers.utils.getAddress(String(opponentToSet))
            playersOpponent.update(String(opponentToSet))
            setAddressIsValid("Opponent's address is valid")
        } catch(err) {
            setAddressIsValid("Input valid opponent's address...")
        }
    }

    return (
        <Box px={3} py={1} display="flex" className="justify-content-center">
            <FormControl sx={{ width: '100%' }}>
                <form onChange={handleChange}>
                    <InputLabel htmlFor="opponent">{addressIsValid}</InputLabel>
                    <Input fullWidth name="opponent" id="opponent" aria-describedby="Input an address of an opponent" />
                    <FormHelperText>Opponent: {formatAddress()}</FormHelperText>
                </form>
            </FormControl>
        </Box>
    );
}