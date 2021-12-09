import React from "react"
import { Box } from "@mui/system";
import TextField from '@mui/material/TextField';
import "../pages/style.css"


export function Opponent() {


    return (
        <Box p={3} m={3}>
          <TextField fullWidth label="Address of opponent" id="opponent" />
        </Box>
      );
}