import { Choice } from "../components/Choice"
import { Commit } from "../components/Commit"
import { ConnectButton } from "../components/ConnectButton"
import { Opponent } from "../components/Opponent"
import { Reveal } from "../components/Reveal"
import { Wager } from "../components/Wager"
import { GameInfo } from "../components/GameInfo"
import { Result } from "../components/Result"
import { Deposit } from "../components/Deposit"
import { Withdraw } from "../components/Withdraw"
import { VerticalStepper } from "./VerticalStepper"

import './style.css';
import { Container, Box } from "@mui/material";
import { useEthers } from "@usedapp/core"

export default function Home() {
    const { account, chainId } = useEthers()
    return (
        <Box className="home">
            <Container fixed>
                <ConnectButton />
                <Box>
                    <VerticalStepper />
                </Box>
            </Container>
        </Box>
    )
}