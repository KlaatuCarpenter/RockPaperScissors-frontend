import React, { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import StepContent from '@mui/material/StepContent';
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import { useBalance, useMove } from "../components/hooks/useAccountInfo";
import { utils, constants, providers, ethers } from 'ethers';
import { useEthers } from "@usedapp/core"

import { Choice } from "../components/Choice"
import { Opponent } from "../components/Opponent"
import { Wager } from "../components/Wager"
import { Commit } from "../components/Commit"
import { GameInfo } from '../components/GameInfo'
import { Reveal } from '../components/Reveal'
import { Result } from "../components/Result"
import { ShowResult } from "../components/ShowResult"

import { contractInstance, getAlchemyProvider } from "../helpers/initTransaction"
import { gameFinished, GameObserver } from '../components/Move/PlayersMove'


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
  const { account, chainId } = useEthers()
  const [activeStep, setActiveStep] = useState(0)
  
  const [move,
    wager,
    opponent,
    notRevealed,
    choice,
    oppMove,
    oppWager,
    oppOpponent,
    oppNotRevealed,
    oppChoice] = useMove()

  if (opponent) {
    if ((activeStep !== 0) && (opponent === constants.AddressZero)) setActiveStep(0)
    if ((activeStep !== 1) && (opponent !== constants.AddressZero) && (notRevealed || oppNotRevealed)) setActiveStep(1)
    if ((activeStep !== 2) && (opponent !== constants.AddressZero) && !notRevealed && !oppNotRevealed) setActiveStep(2)
  }

 console.log(activeStep)

  return (
    <Box>
      {/* <ShowResult /> */}
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
