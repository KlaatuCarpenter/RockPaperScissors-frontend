import { Box, Grid } from "@mui/material";
import { useEthers, shortenIfAddress } from "@usedapp/core";
import { useMove } from "./hooks/useAccountInfo";

import { images } from "./Choice"
import { Reveal } from "./Reveal"

import "../pages/style.css"

export function GameInfo() {
    const { account } = useEthers()

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

    const oppChoiceImg = images.find(element => element.choiceNo === oppChoice)
    const choiceImg = images.find(element => element.choiceNo === choice)

    return (
        <Box>
            <Grid container>
                {/* <p> Account balance: {balance?.toString()}</p> */}
                {move && <Grid item xs={12} md={6} display="flex" flexDirection="column" justifyContent="top-center">

                    <h3>Your move:</h3>
                    {
                        notRevealed ? (
                            <Reveal />
                        ) : (
                            choiceImg && <img src={choiceImg.url} alt={choiceImg.title} className="image" style={{ width: '50%' }}></img>

                        )
                    }
                    <p> You placed a bet: {wager.toString()}</p>

                </Grid>}
                {oppMove && <Grid item xs={12} md={6}>
                    <h3>Your oppoonent's move:</h3>
                    {account === oppOpponent ? (
                        <>
                            {
                                oppNotRevealed ? (
                                    <>
                                        <p>Challenge accepted by {shortenIfAddress(opponent)}.</p>
                                        <p>Your opponent did not reveal his move yet.</p>
                                    </>
                                ) : (
                                    oppChoiceImg && <img src={oppChoiceImg.url} alt={oppChoiceImg.title} className="image" style={{ width: '50%' }}></img>

                                )
                            }
                            <p>Your opponent placed a bet: {oppWager.toString()}</p>
                        </>
                    ) : (
                        <p>Challenge do not accepted yet.</p>
                    )}


                </Grid>}
            </Grid>
        </Box>
    )
}