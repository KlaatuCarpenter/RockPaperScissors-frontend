import { LoadingButton } from "@mui/lab";
import { Box } from "@mui/system";
import { useState } from "react";
import { useEthers } from "@usedapp/core"
import { initTransaction } from "../helpers/initTransaction"

export function Withdraw() {

    const { account, chainId } = useEthers()

    const [loading, setLoading] = useState(false)

    const handleWithdraw = async () => {
        if (!account) throw "No account connected"
        if (!chainId) throw "Connection error"
        setLoading(true)
        const gameContract = await initTransaction(chainId)
        try {
            gameContract.withdraw()
        } catch (err) {
            console.log(err)
        }
        setLoading(false)
    }

    return (
        <Box textAlign={"center"}>
                    <LoadingButton
                        loading={loading}
                        onClick={handleWithdraw}
                    >
                        Withdraw
                    </LoadingButton>
        </Box >
    )
}