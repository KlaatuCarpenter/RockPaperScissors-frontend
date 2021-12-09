import React from "react"
import Button from '@mui/material/Button';
import { shortenIfAddress, useEthers } from '@usedapp/core';
import { Box } from "@mui/system";
import { styled } from '@mui/material/styles';
import '../pages/style.css';

const AccountButton = styled(Button)({
    fontcolor: 'white',
    pointerEvents: 'none',
});

export function ConnectButton() {
    const { activateBrowserWallet, account } = useEthers()
    const formatAddress = () => {
        return shortenIfAddress(account)
    }

    return (
        <Box display="flex" className="justify-content-end">
            {!account && <Button variant="contained" onClick={() => activateBrowserWallet()}> Connect </Button>}
            {account && <AccountButton variant="contained">Account: {formatAddress()}</AccountButton>}
        </Box>
    )
}

