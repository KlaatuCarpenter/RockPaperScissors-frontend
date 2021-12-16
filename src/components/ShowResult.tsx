import React, { useState, useEffect } from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Slide from '@mui/material/Slide';
import { TransitionProps } from '@mui/material/transitions';

import { gameFinished, GameObserver } from '../components/Move/PlayersMove'
import { useBalance, useMove } from "../components/hooks/useAccountInfo";
import { useEthers } from "@usedapp/core"

import { contractInstance, getAlchemyProvider } from "../helpers/initTransaction"



const Transition = React.forwardRef(function Transition(
    props: TransitionProps & {
        children: React.ReactElement<any, any>;
    },
    ref: React.Ref<unknown>,
) {
    return <Slide direction="up" ref={ref} {...props} />;
});

export function ShowResult() {
    const { account, chainId } = useEthers()
    const [finished, setFinished] = useState(false)

    const onGameStatusUpdated: GameObserver = (finished) => { setFinished(finished) }

    useEffect(() => { gameFinished.attach(onGameStatusUpdated) }, [])
    useEffect(() => { getEvents() }, [])

    const [move,
        wager,
        opponent,
        notRevealed,
        choice,
        oppMove,
        oppWager,
        oppOpponent,
        oppNotRevealed,
        oppChoice] = useMove()

    ///********* */

    const getEvents = async () => {
        if (!chainId) throw "Network error"
        const contract = await contractInstance(chainId)
        const provider = await getAlchemyProvider()
        const filter = contract.filters.GameEnded()
        const latestBlock = await provider.getBlockNumber()
        const fromBlock = latestBlock - 1000  /// 1000 block is the Alchemy provider limit in Mumbai
        const events = await contract.queryFilter(filter, fromBlock)
        console.log(filter)
        console.log(events)
    }
    console.log(finished)

    ////*********** */

    const handleClose = () => { setFinished(false) }

    return (
        <div>
            <Button onClick={getEvents}>Show events</Button>
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
        </div>
    );
}