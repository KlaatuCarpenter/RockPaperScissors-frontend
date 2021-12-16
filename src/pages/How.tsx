
import { ConnectButton } from "../components/ConnectButton"

import './style.css';
import { Container, Box } from "@mui/material";
import { useEthers } from "@usedapp/core"

export default function Home() {
    const { account, chainId } = useEthers()
    return (
        <Box className="home">
            <Container fixed>
                <ConnectButton />
           
            </Container>
        </Box>
    )
}