import React, { useEffect, useState } from "react"
import { Box } from "@mui/system";
import "../pages/style.css"
import LoadingButton from '@mui/lab/LoadingButton';
import { ethers } from "ethers"
import { playersChoice, playersOpponent, ChoiceObserver, OpponentObserver, playersWager, WagerObserver } from './Move/PlayersMove'
import { initTransaction } from "../helpers/initTransaction";
import { useEthers } from "@usedapp/core";


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
        if (!chainId) {
            setLoading(false)
            console.log("Connection error. No chainId.")
            throw "Connection error"
        } 
        if (!account) {
            setLoading(false)
            console.log("No account connected")
            throw "No account connected"
        } 
        const gameContract = await initTransaction(chainId)
        const randomSalt = ethers.utils.randomBytes(32)
        const secretSalt = ethers.utils.hexlify(randomSalt)
        console.log(secretSalt)
        const blindedMove = ethers.utils.solidityKeccak256(["uint8", "bytes32"], [choice, secretSalt])
        try {
            await gameContract.move(blindedMove, wager, opponent)
        } catch(err) {
            console.log(err)
        }

        /// Store the move specification in local storage.
        /// It will be needed to reveal and prevent user from trying to commit without reveal.
        
        const accountMove = JSON.stringify({ choice: choice, secret: secretSalt, revealed: false })
        localStorage.setItem(account, accountMove)
        setLoading(false);
    }


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
        </Box>
    );
}