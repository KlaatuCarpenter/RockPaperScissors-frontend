import React from "react"
import Button from '@mui/material/Button';
import { shortenIfAddress, useEthers } from '@usedapp/core';
import { Box } from "@mui/system";
import { styled } from '@mui/material/styles';
import '../pages/style.css';
import { Deposit } from "./Deposit"
import { Withdraw } from "./Withdraw";
import { useBalance, useMove } from "./hooks/useAccountInfo";
import { utils } from "ethers"

const AccountButton = styled(Button)({
    fontcolor: 'white',
    pointerEvents: 'none',
});

export function ConnectButton() {
    const { activateBrowserWallet, account } = useEthers()

    const balanceBN = useBalance()
    const balance = balanceBN.toString()

    return (
        <Box display="flex" justifyContent="space-between">
            <Deposit />
            <div className="justify-content-center">
                Deposit: {balance ? (utils.formatEther(balance)) : ("0")} MATIC <Withdraw />
            </div>
            {!account && <Button variant="contained" onClick={() => activateBrowserWallet()}> Connect </Button>}
            {account && <AccountButton variant="contained">Account: {shortenIfAddress(account)}</AccountButton>}
        </Box>
    )
}

