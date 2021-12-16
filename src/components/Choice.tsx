import React, { useEffect, useState } from "react"
import rock from "../media/rock.png";
import paper from "../media/paper.png";
import scissors from "../media/scissors.png";
import "../pages/style.css"
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import ButtonBase from '@mui/material/ButtonBase';
import { playersChoice, ChoiceObserver } from './Move/PlayersMove'
import { Button } from "@mui/material";
import Stack from '@mui/material/Stack';

export const images = [
    {
        url: rock,
        title: 'Rock',
        width: '25%',
        choiceNo: 1,
    },
    {
        url: paper,
        title: 'Paper',
        width: '25%',
        choiceNo: 2,

    },
    {
        url: scissors,
        title: 'Scissors',
        width: '25%',
        choiceNo: 3,
    }

]

const ImageButton = styled(ButtonBase)(({ theme }) => ({
    position: 'relative',
    height: 270,
    '&:hover, &.Mui-focusVisible': {
        zIndex: 1,
        '& .MuiImageBackdrop-root': {
            opacity: 0.15,
        },
        '& .MuiImageMarked-root': {
            opacity: 0,
        },
        '& .MuiTypography-root': {
            border: '4px solid currentColor',
        },
    },
}));


export function Choice() {

    const [choice, setChoice] = useState<number>(0)

    const onChoiceUpdated: ChoiceObserver = (choice: number) => {
        setChoice(choice)
    }

    useEffect(() => {
        playersChoice.attach(onChoiceUpdated)
    }, [])

    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault()
        const choiceToSet = event.currentTarget.id
        playersChoice.update(Number(choiceToSet))
    }



    return (
        <Box sx={{ display: 'flex', flexWrap: 'wrap', minWidth: 300, justifyContent: 'space-evenly' }} px={3} py={1}>
            
            {images.map((image) => (
                <div className="choice">
                    {choice === image.choiceNo ? (
                        <>
                            <img src={image.url} alt={image.title} className="image" style={{ opacity: 0.3 }}></img>
                            <div className="middle" style={{ opacity: 1 }}>
                                <Button variant="contained" id={image.choiceNo.toString()} key={image.choiceNo} onClick={handleClick} >{image.title}</Button>
                            </div>
                        </>
                    ) : (
                        <>
                            <img src={image.url} alt={image.title} className="image"></img>
                            <div className="middle">
                                <Button variant="outlined" id={image.choiceNo.toString()} key={image.choiceNo} onClick={handleClick} >{image.title}</Button>
                            </div>
                        </>
                    )}

                </div>
            ))}
            
        </Box>
    );
}

