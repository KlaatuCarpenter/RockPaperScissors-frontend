import React, { useEffect, useState } from "react"
import { Box } from "@mui/system";
import "../pages/style.css"
import LoadingButton from '@mui/lab/LoadingButton';
import { ethers } from "ethers"
import { playersChoice, playersOpponent, ChoiceObserver, OpponentObserver, playersWager, WagerObserver } from './Move/PlayersMove'
import { initTransaction } from "../helpers/initTransaction";
import { useEthers } from "@usedapp/core";
import { randomBytes } from "crypto";


export function Commit() {

    const { chainId, account } = useEthers()

    const [choice, setChoice] = useState(0)
    const [opponent, setOpponent] = useState(ethers.constants.AddressZero)
    const [loading, setLoading] = useState(false)
    const [disabled, setDisabled] = useState(true)
    const [wager, setWager] = useState(ethers.BigNumber.from(0))
    const [revealed, setRevealed] = useState<boolean>(true)

    /// Check state from other components
    const onChoiceUpdated: ChoiceObserver = (_choice) => { setChoice(_choice) }
    const onOpponentUpdated: OpponentObserver = (_opponent) => { setOpponent(_opponent) }
    const onWagerUpdated: WagerObserver = (_wager) => { setWager(_wager) }

    useEffect(() => {
        playersChoice.attach(onChoiceUpdated)
        playersOpponent.attach(onOpponentUpdated)
        playersWager.attach(onWagerUpdated)
    }, [])

    /// Check if the player already sent a move and if it is revealed       
    useEffect(() => {
        setRevealed(true)
        if (account) {
            const playersMove = (localStorage.getItem(account))
            if (playersMove) {
                const parsedPlayersMove = JSON.parse(playersMove)
                setRevealed(parsedPlayersMove["revealed"])
            }
        }
    }, [account])

    /// Switch commit button disabled/enabled
    useEffect(() => {
        if (choice !== 0 && opponent !== ethers.constants.AddressZero && revealed) {
            setDisabled(false)
        }
    }, [choice, opponent])

    /// Send transaction to commit a move
    const commitMove = async () => {
        setLoading(true)
        if (!chainId) throw "Connection error"
        if (!account) throw "No account connected"
        const gameContract = await initTransaction(chainId)

        const secretSalt = randomBytes(32)
        const blindedMove = ethers.utils.solidityKeccak256(["uint8", "bytes32"], [choice, secretSalt])
        await gameContract.move(blindedMove, wager, opponent)

        /// Store the move specification in local storage.
        /// It will be needed to reveal and prevent user from trying to commit without reveal.
        const accountMove = JSON.stringify({ choice: choice, secret: secretSalt, revealed: false })
        localStorage.setItem(account, accountMove)
        console.log(localStorage.getItem(account))
        setLoading(false);
    }


    return (
        <Box display="flex" p={3} m={3} className="justify-content-center">
            <Box>
                <LoadingButton
                    onClick={commitMove}
                    loading={loading}
                    variant="contained"
                    disabled={disabled}
                >
                    Commit Move
                </LoadingButton>
            </Box>
            {revealed 
            ? (<></>) 
            : (
                <Box>
                    <p>It is not possible to commit. Reveal first.</p>
                </Box>
            )}
        </Box>
    );
}