import React, { useEffect, useState } from 'react';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import SkipPreviousIcon from '@material-ui/icons/SkipPrevious';
import SkipNextIcon from '@material-ui/icons/SkipNext';
import PlayIcon from '@material-ui/icons/PlayArrow';
import PauseIcon from '@material-ui/icons/Pause';
import { makeStyles } from '@material-ui/core/styles';
import Itro from '../site-images/itro.jpg';
import * as SoundCloudAudio from 'soundcloud-audio';

const useStyles = makeStyles((theme) => ({
    root: {
        display: 'flex',
        maxWidth: 450,
        margin: 'auto',
    },
    details: {
        display: 'flex',
        flexDirection: 'column',
    },
    content: {
        flex: '1 0 auto',
    },
    cover: {
        width: '100%',
    },
    controls: {
        display: 'flex',
        alignItems: 'center',
        paddingLeft: theme.spacing(1),
        paddingBottom: theme.spacing(1),
    },
    playIcon: {
        height: 38,
        width: 38,
    },
}));

export default function CardExample() {
    const classes = useStyles(); 
    const [paused, setPaused] = useState(true);
    const [counter, setCount] = useState(1);
    const scAudio = new SoundCloudAudio('aba2c7918a43ab0cc467124cfc00a9c7');
    var myAudio;

    function alterCount() {
        if(counter < 2) {
            setCount(2);
        }
        else {
            return;
        }
    }

    function playMusic() {
        alterCount();
        if(counter === 1) {
            scAudio.resolve('https://api.soundcloud.com/tracks/306743131/stream', function(track) {
                scAudio.play();
                setPaused(false);
            });
        }
        else {
            setPaused(false);
        }
    }

    function pauseMusic() {
        setPaused(true);
        scAudio.pause();
    }

    return (
        <Card 
            className={classes.root} 
        >
            <div 
                className={classes.details} 
            >
                <CardContent 
                    className={classes.content} 
                >
                    <Typography 
                        component='h5' 
                        variant='h5' 
                    >
                        Complete 
                    </Typography>
                    <Typography 
                        variant='subtitle1' 
                        component='p' 
                        color='textSecondary' 
                    >
                        Itro 
                    </Typography>
                </CardContent>
                <div 
                    className={classes.controls} 
                >
                    <IconButton 
                        aria-label='previous' 
                    >
                        <SkipPreviousIcon />
                    </IconButton>
                    <IconButton 
                        aria-label='play'
                    >
                        {paused ? <PlayIcon onClick={playMusic} /> : <PauseIcon onClick={pauseMusic} />}
                    </IconButton>
                    <IconButton 
                        aria-label='next' 
                    >
                        <SkipNextIcon />
                    </IconButton>
                </div>
            </div>
            <CardMedia 
                image={Itro} 
                className={classes.cover}
                title='Itro' 
                alt='Itro' 
            />
        </Card>
    );
}

    