import React from "react"
import { Box } from "@mui/system";
import TextField from '@mui/material/TextField';
import "../pages/style.css"
import LoadingButton from '@mui/lab/LoadingButton';

export function Commit() {


    return (
        <Box p={3} m={3}>
          <LoadingButton fullWidth variant="outlined" />
        </Box>
      );
}