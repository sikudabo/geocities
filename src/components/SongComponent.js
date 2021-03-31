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
import { useParams, useHistory } from 'react-router-dom';
import swal from 'sweetalert';
import Backdrop from '@material-ui/core/Backdrop';
import CircularProgress from '@material-ui/core/CircularProgress';
import * as SoundCloudAudio from 'soundcloud-audio';

const songs = [
    {
        song: 'Complete',
        artist: 'Itro',
        cover: Itro,
        id: 'https://api.soundcloud.com/tracks/306743131/stream',
    },
    {
        song: 'Out my business',
        artist: 'Wave',
        cover: WaveDelux,
        id: 'https://api.soundcloud.com/tracks/870656128/stream'
    },
    {
        song: 'No Weakness',
        artist: 'Rod Wave',
        cover: WaveDelux,
        id: 'https://api.soundcloud.com/tracks/788582575/stream'
    },
    {
        song: 'Dreams',
        artist: 'BenSound',
        cover: BenSound,
        id: 'https://api.soundcloud.com/tracks/636856149/stream'
    },
    {
        song: 'Alive',
        artist: 'Itro',
        cover: Alive,
        id: 'https://api.soundcloud.com/tracks/215684434/stream'
    },
    {
        song: "When You're Around",
        artist: 'MotionCity SoundTrack',
        cover: MotionCity,
        id: 'https://api.soundcloud.com/tracks/232952206/stream'
    },
    {
        song: 'Where',
        artist: 'Itro',
        cover: Where,
        id: 'https://api.soundcloud.com/tracks/271094296/stream'
    },
    {
        song: 'Alright',
        artist: 'Skindred',
        cover: RiotRock,
        id: 'https://api.soundcloud.com/tracks/769382284/stream'
    },
];

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


function SongComponent(props) {
    const classes = useStyles();
    const params = useParams();
    const history = useHistory();
    const [myTrack, setTrack] = useState(null);
    const scAudio = new SoundCloudAudio('aba2c7918a43ab0cc467124cfc00a9c7');
    const [playing, setPlaying] = useState(false);
    const [count, setCount] = useState(0);
    let arr = [0, 1, 2, 3, 4, 5, 6];

    useEffect(() => {
        if(props.user !== null) {
            props.dispatch({type: 'ThemeChange', payload: props.user.profileTheme});
        }
        else {
            props.dispatch({type: 'ThemeChange', payload: 'rgb(0, 20, 60)'});
        }

        if(!arr.includes(parseInt(params.song))) {
            swal(
                'Uh Oh!',
                'We could not find that song!',
                'error',
            );
            history.goBack(1);
        }
        else {
            setTrack(songs[params.song]);
        }

    }, []);

    function playMusic() {
        //This function will handle the playing of the song. 
        if(count === 0) {
            scAudio.play({
                streamUrl: myTrack.id,
              });
            setPlaying(true);
            setCount(1);
        }
        else {
            scAudio.stop();
        }
    }

    function pauseMusic() {
        //This function will pause the song.
        scAudio.pause();
        setPlaying(false);
    }

    if(myTrack === null) {
        return (
            <Backdrop
                open={true}
            >
                <CircularProgress 
                    color='primary' 
                />
            </Backdrop>
        );
    }
    else {
        return (
            <Grid 
                container 
                className={classes.grid} 
            >
                <Grid 
                    item 
                    xs={12} 
                >
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
                                    {myTrack.song}
                                </Typography>
                                <Typography 
                                    variant='subtitle1' 
                                    component='p' 
                                    color='textSecondary' 
                                >
                                    {myTrack.artist}
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
                                    {playing === false ? <PlayIcon onClick={playMusic} /> : <PauseIcon onClick={pauseMusic} />}
                                </IconButton>
                                <IconButton 
                                    aria-label='next' 
                                >
                                    <SkipNextIcon />
                                </IconButton>
                            </div>
                        </div>
                        <CardMedia 
                            image={myTrack.cover} 
                            className={classes.cover}
                            title={myTrack.artist} 
                            alt={myTrack.artist}
                        />
                    </Card>
                </Grid>
            </Grid>
        );
    }
}

function mapStateToProps(state) {
    return {
        user: state.userReducer.user,
        primary: state.userThemeReducer.primary,
    };
}

export default connect(mapStateToProps)(SongComponent);