import React, { useEffect, useState } from "react"
import rock from "../media/rock.png";
import paper from "../media/paper.png";
import scissors from "../media/scissors.png";
import "../pages/style.css"
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import ButtonBase from '@mui/material/ButtonBase';
import Typography from '@mui/material/Typography';
import { playersChoice, ChoiceObserver } from './Move/PlayersMove'

const images = [
    {
        url: rock,
        title: 'Rock',
        width: '25%',
        choiceNo: '1',
    },
    {
        url: paper,
        title: 'Paper',
        width: '25%',
        choiceNo: '2',

    },
    {
        url: scissors,
        title: 'Scissors',
        width: '25%',
        choiceNo: '3',
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

const ImageSrc = styled('span')({
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
});

const Image = styled('span')(({ theme }) => ({
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: theme.palette.common.white,
}));

const ImageBackdrop = styled('span')(({ theme }) => ({
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    backgroundColor: theme.palette.common.black,
    opacity: 0.3,
    transition: theme.transitions.create('opacity'),
}));

const ImageMarked = styled('span')(({ theme }) => ({
    height: 3,
    width: 40,
    backgroundColor: theme.palette.common.white,
    position: 'absolute',
    bottom: -2,
    left: 'calc(50% - 20px)',
    transition: theme.transitions.create('opacity'),
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
        <Box sx={{ display: 'flex', flexWrap: 'wrap', minWidth: 300, justifyContent: 'space-around' }} px={3} py={1}>
            {images.map((image) => (
                    <ImageButton
                        focusRipple
                        id={image.choiceNo}
                        key={image.title}
                        style={{
                            width: image.width,
                        }}
                        onClick={handleClick}
                    >
                        <ImageSrc style={{ backgroundImage: `url(${image.url})` }} />
                        {(choice === Number(image.choiceNo)) ? (<></>) : (<ImageBackdrop className="MuiImageBackdrop-root" />)}
                        <Image>
                            <Typography
                                component="span"
                                variant="subtitle1"
                                color="inherit"
                                sx={{
                                    position: 'relative',
                                    p: 4,
                                    pt: 2,
                                    pb: (theme) => `calc(${theme.spacing(1)} + 6px)`,
                                }}
                            >
                                {image.title}
                                {(choice === Number(image.choiceNo)) ? (<ImageMarked className="MuiImageMarked-root" />) : (<></>)}
                            </Typography>

                        </Image>
                    </ImageButton>
            ))}
        </Box>
    );
}

