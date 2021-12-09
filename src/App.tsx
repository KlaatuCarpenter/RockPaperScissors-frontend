import React from 'react';
import './App.css';
import Home from './pages/Home';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { brown } from '@mui/material/colors';
import { DAppProvider, Mumbai } from "@usedapp/core";
import dotenv from 'dotenv';
dotenv.config();

const MUMBAI_RPC_URL = process.env.MUMBAI_RPC_URL || "https://polygon-mumbai.alchemyapi.io/v2/your-api-key"

const config = {
  networks: [Mumbai],
  readOnlyChainId: Mumbai.chainId,
  readOnlyUrls: {
    [Mumbai.chainId]: MUMBAI_RPC_URL,
  },
  notifications: {
    expirationPeriod: 1000,
    checkInterval: 1000,
  },
}

const theme = createTheme({
  palette: {
    primary: {
      main: brown[900],
    },
  },
});

function App() {

  return (
    <DAppProvider config={config}>
      <ThemeProvider theme={theme}>
        <Home />
      </ThemeProvider>
    </DAppProvider>
  );
}

export default App;
