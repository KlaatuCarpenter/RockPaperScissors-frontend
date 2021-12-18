import { ConnectButton } from "../components/ConnectButton"
import { VerticalStepper } from "./VerticalStepper"
import './style.css';
import { Container, Box } from "@mui/material";

export default function Home() {
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