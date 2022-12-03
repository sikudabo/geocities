import React, { useEffect, useState } from 'react';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import IconButton from '@material-ui/core/IconButton';
import SkipPreviousIcon from '@material-ui/icons/SkipPrevious';
import SkipNextIcon from '@material-ui/icons/SkipNext';
import PlayIcon from '@material-ui/icons/PlayArrow';
import PauseIcon from '@material-ui/icons/Pause';
import { makeStyles } from '@material-ui/core/styles';
import { connect } from 'react-redux';
import WaveDelux from '../site-images/wave_delux.jpeg';
import Itro from '../site-images/itro.jpg';
import BenSound from '../site-images/BenSound.jpeg';
import Alive from '../site-images/Alive.jpeg';
import Where from '../site-images/Where.jpeg';
import MotionCity from '../site-images/MotionCity.jpeg';
import RiotRock from '../site-images/RiotRock.jpeg';
import Ghetto from '../site-images/ghetto.jpeg';
import WeWereSharksCover from '../site-images/we_were_sharks_cover.jpeg';
import HateMe from '../site-images/hate_me.jpeg';
import JurassicPark from '../site-images/jurassic_park.jpg';
import { useHistory } from 'react-router-dom';

const useStyles = makeStyles((theme) => ({
    root: {
        display: 'flex',
        maxWidth: 450,
        margin: 'auto',
    },
    grid: {
        marginTop: 100,
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

const songs = [
    {
        song: 'Complete',
        artist: 'Itro',
        cover: Itro,
    },
    {
        song: 'Out my business',
        artist: 'Wave',
        cover: WaveDelux,
    },
    {
        song: 'No Weakness',
        artist: 'Rod Wave',
        cover: WaveDelux,
    },
    {
        song: 'Dreams',
        artist: 'BenSound',
        cover: BenSound,
    },
    {
        song: 'Alive',
        artist: 'Itro',
        cover: Alive,
    },
    {
        song: "When You're Around",
        artist: 'MotionCity SoundTrack',
        cover: MotionCity,
    },
    {
        song: 'Where',
        artist: 'Itro',
        cover: Where,
    },
    {
        song: 'Alright',
        artist: 'Skindred',
        cover: RiotRock,
    },
    {
        song: 'Abandoned',
        artist: 'Rod Wave',
        cover: Ghetto,
    },
    {
        song: 'Poison',
        artist: 'Rod Wave',
        cover: Ghetto,
    },
    {
        song: 'Counted Steps',
        artist: 'Rod Wave',
        cover: Ghetto,
    },
    {
        song: 'Shameless',
        artist: 'We were sharks',
        cover: WeWereSharksCover,
    },
    {
        song: 'Jurassic Park',
        artist: 'Stand Atlantic',
        cover: JurassicPark,
    },
    {
        song: 'Hate me (sometimes)',
        artist: 'Stand Atlantic',
        cover: HateMe,
    },
];

function MusicComponent(props) {
    const classes = useStyles();
    const history = useHistory();

    useEffect(() => {
        if(props.user !== null) {
            props.dispatch({type: 'ThemeChange', payload: props.user.profileTheme});
        }
        else {
            props.dispatch({type: 'ThemeChange', payload: 'rgb(0, 20, 60)'});
        }
    }, []);

    return (
        <Grid 
            className={classes.grid}
            container 
        >
            <Grid 
                item 
                xs={12} 
            >
                <Typography 
                    variant='h6' 
                    component='h6'
                    align='center' 
                >
                    GeoCities music 
                </Typography>
            </Grid>
            <Grid 
                item 
                xs={12} 
                style={{
                    marginTop: 50,
                }}
            >
                {songs.map((song, index) => (
                    <div 
                        key={index.toString()} 
                    >
                        <Card 
                            className={classes.root} 
                            style={{
                                marginBottom: index < songs.length - 1 ? 20 : 0,
                                cursor: 'pointer',
                            }}
                            onClick={e => history.push(`/geocities/song/${index}`)}
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
                                        {song.song}
                                    </Typography>
                                    <Typography 
                                        variant='subtitle1' 
                                        component='p' 
                                        color='textSecondary' 
                                    >
                                        {song.artist}
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
                                        <PlayIcon />
                                    </IconButton>
                                    <IconButton 
                                        aria-label='next' 
                                    >
                                        <SkipNextIcon />
                                    </IconButton>
                                </div>
                            </div>
                            <CardMedia 
                                image={song.cover} 
                                className={classes.cover}
                                title={song.artist} 
                                alt={song.artist}
                            />
                        </Card>
                    </div>
                ))}
            </Grid>
        </Grid>
    );
}

function mapStateToProps(state) {
    return {
        user: state.userReducer.user,
        primary: state.userThemeReducer.primary,
    };
}

export default connect(mapStateToProps)(MusicComponent);