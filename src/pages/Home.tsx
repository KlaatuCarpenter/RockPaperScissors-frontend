import { ConnectButton } from "../components/ConnectButton"
import { VerticalStepper } from "./VerticalStepper"
import './style.css';
import { Container, Box } from "@mui/material";
import { Terminate } from "../components/Terminate";

export default function Home() {
    return (
        <Box className="home">
            <Container fixed>
                <ConnectButton />
                <VerticalStepper />
                <Terminate />
            </Container>
        </Box>
    )
}