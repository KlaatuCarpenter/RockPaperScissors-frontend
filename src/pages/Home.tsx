import React from "react";
import { ConnectButton } from "../components/ConnectButton";
import { Choice } from "../components/Choice";
import { Opponent } from "../components/Opponent";
import { Commit } from "../components/Commit"
import './style.css';
import { Container, Box } from "@mui/material";

export default function Home() {
    return (
        <Box className="home">
            <Container fixed>
                <ConnectButton />
                <Opponent />
                <Choice />
                <Commit />
            </Container>
        </Box>
    )
}