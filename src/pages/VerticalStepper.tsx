import Box from '@mui/material/Box';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import StepContent from '@mui/material/StepContent';
import Typography from '@mui/material/Typography';

import { useMove } from "../components/hooks/useAccountInfo";
import { constants } from 'ethers';
import { useState } from 'react';

import { Choice } from "../components/Choice"
import { Opponent } from "../components/Opponent"
import { Wager } from "../components/Wager"
import { Commit } from "../components/Commit"
import { GameInfo } from '../components/GameInfo'
import { Result } from "../components/Result"

const steps = [
  {
    label: 'Commit a move',
    description: `Let's play`,
  },
  {
    label: 'Reveal the move',
    description:
      `Let's reveal`,
  },
  {
    label: 'Check the result',
    description: `Let's check`,
  },
];

export function VerticalStepper() {
  const [activeStep, setActiveStep] = useState(0)
  
  const [,
    ,
    opponent,
    notRevealed,
    ,
    ,
    ,
    ,
    oppNotRevealed,
    ] = useMove()

  if (opponent) {
    if ((activeStep !== 0) && (opponent === constants.AddressZero)) setActiveStep(0)
    if ((activeStep !== 1) && (opponent !== constants.AddressZero) && (notRevealed || oppNotRevealed)) setActiveStep(1)
    if ((activeStep !== 2) && (opponent !== constants.AddressZero) && !notRevealed && !oppNotRevealed) setActiveStep(2)
  }
    


  return (
    <Box>
      <Stepper activeStep={activeStep} orientation="vertical">

        {/********** Commit a move ***************/}
        <Step key="1">
          <StepLabel>
            {steps[0].label}
          </StepLabel>
          <StepContent>
            <Typography>{steps[0].description}</Typography>
            <Box sx={{ mb: 2 }}>
              <div>
                <Opponent />
                <Wager />
                <Choice />
                <Commit />
              </div>
            </Box>
          </StepContent>
        </Step>

        {/********** Reveal the move ***************/}
        <Step key="2">
          <StepLabel>
            {steps[1].label}
          </StepLabel>
          <StepContent>
            <Typography>{steps[1].description}</Typography>
            <Box sx={{ mb: 2 }}>
              <div>
                <GameInfo />
              </div>
            </Box>
          </StepContent>
        </Step>

        {/********** Check the result ***************/}
        <Step key="3">
          <StepLabel>
            {steps[2].label}
          </StepLabel>
          <StepContent>
            <Typography>{steps[2].description}</Typography>
            <Box sx={{ mb: 2 }}>
              <div>
                <GameInfo />
                <Result />
              </div>
            </Box>
          </StepContent>
        </Step>
      </Stepper>
    </Box>
  );
}
