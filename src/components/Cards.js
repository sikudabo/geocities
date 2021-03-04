import React from 'react';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import PlayIcon from '@material-ui/icons/PlayArrow';
import SkipPrevIcon from '@material-ui/icons/SkipPrevious';
import SkipNextIcon from '@material-ui/icons/SkipNext';
import { makeStyles } from '@material-ui/core/styles';
import Uzi from '../site-images/uzi.jpg';

const useStyles = makeStyles((theme) => ({
    card: {
        maxWidth: 500,
        margin: 'auto',
        display: 'flex',
    },
    details: {
        display: 'flex',
        flexDirection: 'column',
    },
    content: {
        flex: '1 0 auto',
    },
    controls: {
        display: 'flex',
        alignItems: 'center',
        paddingLeft: theme.spacing(2),
        paddingTop: theme.spacing(2),
    },
    cover: {
        width: '100%',
    },
    playIcon: {
        height: 38,
        width: 38,
    },
}));

export default function Cards() {
    const classes = useStyles();

    return (
        <Card 
            className={classes.card} 
        >
            <div 
                className={classes.details} 
            >
                <CardContent 
                    className={classes.content} 
                >
                    <Typography 
                        variant='h6' 
                        component='h6' 
                    >
                        Daville 
                    </Typography>
                    <Typography 
                        variant='subtitle1'
                        component='span' 
                    >
                        Lil Uzi
                    </Typography>
                </CardContent>
                <div 
                    className={classes.controls} 
                >
                    <IconButton>
                        <SkipPrevIcon />
                    </IconButton>
                    <IconButton 
                        className={classes.playIcon} 
                    >
                        <PlayIcon />
                    </IconButton>
                    <IconButton>
                        <SkipNextIcon />
                    </IconButton>
                </div>
            </div>
            <CardMedia 
                className={classes.cover} 
                image={Uzi}
                title="Lil Uzi and K Gibbs" 
                alt="Lil Uzi and K Gibbs" 
            />
        </Card>
    );
}