import React, { useEffect, useState } from "react"
import { Box } from "@mui/system";
import "../pages/style.css"
import LoadingButton from '@mui/lab/LoadingButton';
import { ethers } from "ethers"
import { playersChoice, playersOpponent, ChoiceObserver, OpponentObserver, playersWager, WagerObserver } from './Move/PlayersMove'
import { initTransaction, waitForTransaction } from "../helpers/initTransaction";
import { useEthers } from "@usedapp/core";

import Snackbar from '@mui/material/Snackbar';
import { Alert } from "../helpers/Alert"

export function Commit() {

    const { chainId, account } = useEthers()

    const [choice, setChoice] = useState(0)
    const [opponent, setOpponent] = useState(ethers.constants.AddressZero)
    const [loading, setLoading] = useState(false)
    const [wager, setWager] = useState(ethers.BigNumber.from(0))
    const [openAlert, setOpenAlert] = useState(false)
    const [errorMessage, setErrorMessage] = useState("")


    /// Check state from other components
    const onChoiceUpdated: ChoiceObserver = (_choice) => { setChoice(_choice) }
    const onOpponentUpdated: OpponentObserver = (_opponent) => { setOpponent(_opponent) }
    const onWagerUpdated: WagerObserver = (_wager) => { setWager(_wager) }

    useEffect(() => {
        playersChoice.attach(onChoiceUpdated)
        playersOpponent.attach(onOpponentUpdated)
        playersWager.attach(onWagerUpdated)
    }, [])

    /// Send transaction to commit a move
    const commitMove = async () => {
        setLoading(true)
        if (!chainId) {
            setLoading(false)
            setErrorMessage("Connection with blockchain failed")
            setOpenAlert(true)
            throw errorMessage
        }
        if (!account) {
            setLoading(false)
            setErrorMessage("No account connected")
            setOpenAlert(true)
            throw errorMessage
        }
        const gameContract = await initTransaction(chainId)
        const randomSalt = ethers.utils.randomBytes(32)
        const secretSalt = ethers.utils.hexlify(randomSalt)
        const blindedMove = ethers.utils.solidityKeccak256(["uint8", "bytes32"], [choice, secretSalt])
        try {
            const tx = await gameContract.move(blindedMove, wager, opponent)
            /// Store the move specification in local storage.
            /// It will be needed to reveal and prevent user from trying to commit without reveal.
            const accountMove = JSON.stringify({ choice: choice, secret: secretSalt, revealed: false })
            localStorage.setItem(account, accountMove)
            const txReceipt = await waitForTransaction(tx.hash, chainId)
            console.log(txReceipt)
        } catch (err) {
            setErrorMessage("Transaction failed")
            console.log(err)
            setOpenAlert(true)
        }

        setLoading(false);
    }


    ///********** Snackbar with error information *************/
    const handleClose = (event?: React.SyntheticEvent | Event, reason?: string) => {
        if (reason === 'clickaway') {
            return;
        }
        setOpenAlert(false);
    };


    return (
        <Box display="flex" className="justify-content-center" pt={1}>
            <Box>
                <LoadingButton
                    onClick={commitMove}
                    loading={loading}
                    variant="contained"
                >
                    Commit Move
                </LoadingButton>
            </Box>
            <Snackbar open={openAlert} autoHideDuration={6000} onClose={handleClose}>
                <Alert onClose={handleClose} severity="error" sx={{ width: '100%' }}>
                    {errorMessage}
                </Alert>
            </Snackbar>
        </Box>
    );
}