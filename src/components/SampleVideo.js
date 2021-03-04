import React from 'react';
import { DefaultPlayer as Video } from 'react-html5video';
import '../styles/styles.css';
import Plyr from 'react-plyr';
import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import { makeStyles } from '@material-ui/core/styles';
import Simeon from '../site-images/simeon.jpg';
import Broadcast from '../site-images/broadcast.mp4';

const useStyles = makeStyles((theme) => ({
    card: {
        maxWidth: 450,
        margin: 'auto',
    },
}));

export default function() {
    const source = require('../site-images/broadcast.mp4');
    const classes = useStyles();
    
    return (
        <Grid 
            container 
        >
            <Card 
                className={classes.card} 
            >
                <CardContent>
                    {/*<Video 
                        controls={['PlayPause', 'Seek', 'Time', 'Volume', 'Fullscreen']}
                        playsInline
                    >
                        <source 
                            src={Broadcast} 
                            type='video/mp4' 
                        />
                    </Video>*/}
                    <Plyr 
                        type='video' 
                        sources={[
                            {
                                src: Broadcast,
                                type: 'video/mp4',
                            }
                        ]}
                    />
                </CardContent>
            </Card>
        </Grid>
    );
}