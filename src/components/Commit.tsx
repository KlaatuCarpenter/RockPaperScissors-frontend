import { useEffect, useState } from "react"
import { Box } from "@mui/system";
import "../pages/style.css"
import LoadingButton from '@mui/lab/LoadingButton';
import { ethers } from "ethers"
import { playersChoice, playersOpponent, ChoiceObserver, OpponentObserver, playersWager, WagerObserver } from './Move/PlayersMove'
import { initTransaction, waitForTransaction } from "../helpers/initTransaction";
import { useEthers } from "@usedapp/core";


export function Commit() {

    const { chainId, account } = useEthers()

    const [choice, setChoice] = useState(0)
    const [opponent, setOpponent] = useState(ethers.constants.AddressZero)
    const [loading, setLoading] = useState(false)
    const [wager, setWager] = useState(ethers.BigNumber.from(0))

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
        const blindedMove = ethers.utils.solidityKeccak256(["uint8", "bytes32"], [choice, secretSalt])
        try {
            const tx = await gameContract.move(blindedMove, wager, opponent)
            const txReceipt = await waitForTransaction(tx.hash, chainId)
            console.log(txReceipt)
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