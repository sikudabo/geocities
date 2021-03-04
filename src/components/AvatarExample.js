import React from 'react';
import Avatar from '@material-ui/core/Avatar';
import AvatarGroup from '@material-ui/lab/AvatarGroup';
import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/core/styles';
import Simeon from '../site-images/simeon.jpg';
import Meghan from '../site-images/meghan.jpg';
import Dat from '../site-images/dat.jpg';
import Jessica from '../site-images/jessica.jpg';
import Marcoleno from '../site-images/marcoleno.jpg';

const useStyles = makeStyles((theme) => ({
    root: {
        textAlign: 'center',
        padding: theme.spacing(2),
    },
    avatar: {
        backgroundColor: theme.palette.text.success,
        color: 'rgb(255, 255, 255)',
    },
}));

const avatars = [
    Simeon,
    Meghan,
    Dat,
    Jessica,
    Marcoleno,
];

const letters = [
    'h',
    't',
    'k',
];

export default function AvatarExample() {
    const classes = useStyles();

    return (
        <div 
            className={classes.root} 
        >
            <Grid 
                container 
                xl 
                spacing={2}
            >
                {letters.map((letter, index) => {
                    return (
                        <Grid 
                            item 
                            key={index.toString()}
                            xs={12}
                            sm={12}
                            md={6} 
                            lg={4}
                            xl={4} 
                        >
                            <Avatar 
                                className={classes.avatar}
                                variant='square'
                            >
                                {letter}
                            </Avatar>
                        </Grid>
                    );
                })}
            </Grid>
        </div>
    );
}