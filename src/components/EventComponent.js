import React, { useState, useEffect } from 'react';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardMedia from '@material-ui/core/CardMedia';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import Avatar from '@material-ui/core/Avatar';
import Typography from '@material-ui/core/Typography';
import Collapse from '@material-ui/core/Collapse';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import Icon from '@mdi/react';
import { mdiThumbUp, mdiThumbUpOutline, mdiChevronDown, mdiChevronUp, mdiDelete, mdiUsers, mdiAccountGroupOutline as GroupOutline } from '@mdi/js';
import { makeStyles } from '@material-ui/core/styles';
import axios from 'axios';
import * as _ from 'underscore';
import { connect } from 'react-redux';
import swal from 'sweetalert';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemText from '@material-ui/core/ListItemText';
import { useHistory } from 'react-router-dom';
import CircularProgress from '@material-ui/core/CircularProgress';
import Paper from '@material-ui/core/Paper';
import Divider from '@material-ui/core/Divider';

const useStyles = makeStyles((theme) => ({
    card: {
        maxWidth: 600,
        margin: 'auto',
        padding: theme.spacing(2),
        backgroundColor: theme.palette.background.paper,
    },
    media: {
        height: 0,
        padding: '56.25%',
    },
    image: {
        maxWidth: '100%',
        maxHeight: '100%',
    },
}));

function EventComponent(props) {
    const classes = useStyles();
    const history = useHistory();
    const [expanded, setExpanded] = useState(false);
    const [btnUnlike, setBtnUnlike] = useState(false); //Variable and setter for disabling a Button when we interact with the server.
    const [btnAttending, setBtnAttending] = useState(false);
    const [eventDeleting, setEventDeleting] = useState(false);

    useEffect(() => {
        //First, if the user is logged in, update the state primary color. 
        if(props.user !== null) {
            props.dispatch({type: 'ThemeChange', payload: props.user.profileTheme});
        }
    }, []);

    function unLikeEvent() {
        //This function will be responsible for unliking an event.
        setBtnUnlike(true);
    
        let data = JSON.stringify({
            uniqueEventId: props.event.uniqueEventId,
            uniqueUserId: props.user.uniqueUserId,
        });
    
        return axios({
            method: 'POST',
            url: 'http://192.168.0.17:3001/api/unlike/event',
            data: data,
            headers: {
                'Content-Type': 'application/json',
            },
        }).then(response => {
            swal(
                'Great!',
                'You successfully unliked that post!',
                'success',
            );
            props.setEvents([...response.data.events]);
            setBtnUnlike(false);
        }).catch(err => {
            console.log(err.message);
            swal(
                'Uh Oh!',
                'There was an error unliking that event! Pleaase try again',
                'error',
            );
            setBtnUnlike(false);
        });
    }

    function likeEvent() {
        //This function will handle liking a post. 
        setBtnUnlike(true);

        let data = JSON.stringify({
            uniqueUserId: props.user.uniqueUserId,
            username: props.user.username,
            uniqueEventId: props.event.uniqueEventId,
        });

        return axios({
            method: 'POST',
            url: 'http://192.168.0.17:3001/api/like/event',
            data: data,
            headers: {
                'Content-Type': 'application/json',
            },
        }).then(response => {
            swal(
                'Great!',
                'You successfully liked that event!',
                'success',
            );
            setBtnUnlike(false);
            props.setEvents([...response.data.events]);
        }).catch(err => {
            console.log(err.message);
            swal(
                'Uh Oh!',
                'There was an error with liking that post!',
                'error',
            );
            setBtnUnlike(false);
        });
    }

    function attendEvent() {
        //This function will enable a user to attend an event. 
        setBtnAttending(true);

        let data = JSON.stringify({
            uniqueUserId: props.user.uniqueUserId,
            username: props.user.username,
            uniqueEventId: props.event.uniqueEventId,
        });

        return axios({
            method: 'POST',
            url: 'http://192.168.0.17:3001/api/attend/event',
            data: data,
            headers: {
                'Content-Type': 'application/json',
            },
        }).then(response => {
            swal(
                'Great!',
                'You are now attending that event!',
                'success',
            );
            setBtnAttending(false);
            props.setEvents([...response.data.events]);
        }).catch(err => {
            console.log(err.message);
            swal(
                'Uh Oh!',
                'There was an error attending that event! Please try again.',
                'error',
            );
            setBtnAttending(false);
        });
    }

    function unAttendEvent() {
        //This function will enable a user to unAttend an event. 
        setBtnAttending(true); 

        let data = JSON.stringify({
            uniqueEventId: props.event.uniqueEventId,
            uniqueUserId: props.user.uniqueUserId,
        });

        return axios({
            method: 'POST',
            url:'http://192.168.0.17:3001/api/unattend/event',
            data: data,
            headers: {
                'Content-Type': 'application/json',
            },
        }).then(response => {
            swal(
                'Great!',
                'You successfully unattended that event!',
                'success',
            );
            props.setEvents([...response.data.events]);
            setBtnAttending(false);
        }).catch(err => {
            console.log(err.message);
            swal(
                'Uh Oh!',
                'There was an error unattending that event!',
                'error',
            );
            setBtnAttending(false);
        });
    }

    function deleteEvent() {
        //This function will be responsible for deleting an event. 
        setEventDeleting(true);

        let data = JSON.stringify({
            uniqueEventId: props.event.uniqueEventId,
            file: props.event.src,
        });

        return axios({
            method: 'POST',
            url: 'http://192.168.0.17:3001/api/delete/event',
            data: data,
            headers: {
                'Content-Type': 'application/json',
            },
        }).then(response => {
            swal(
                'Great!',
                'You successfully deleted that event!',
                'success',
            );
            props.setEvents([...response.data.events]);
            setEventDeleting(false);
        }).catch(err => {
            console.log(err.message);
            swal(
                'Uh Oh!',
                'There was an error deleting that event! Please try again.',
                'error',
            );
            setEventDeleting(false);
        });
    }

    return (
        <Card 
            className={classes.card} 
            id={`${props.event.uniqueEventId}`}
            style={{
                marginBottom: 20,
            }}
        >
            <CardHeader 
                title={
                    <Typography 
                        variant='h6' 
                        component='h6' 
                    >
                        {props.event.username}
                    </Typography>
                }
                avatar={
                    <Avatar 
                        src={`http://192.168.0.17:3001/api/get/avatar/by/id/${props.event.uniqueUserId}`}
                        alt={`${props.event.username}`}
                        title={`${props.event.username}`} 
                        style={{
                            cursor: 'pointer',
                        }}
                        onClick={e => history.push(`/geouser/${props.event.uniqueUserId}`)}
                    />
                }
            />
             <div>
                {true &&
                    <CardMedia 
                        component='img'
                        src={`http://192.168.0.17:3001/api/get-photo/${props.event.src}`}
                        title={`Post by ${props.event.username}`}
                        alt='GeoCities'
                    />
                }
            </div>
            <CardContent>
                <Typography 
                    variant='h6' 
                    component='h6' 
                    align='left' 
                >
                    {props.event.title} 
                </Typography>
                <br />
                <Typography 
                    variant='subtitle1' 
                    component='span' 
                    align='left'
                >
                    When: {props.event.dateString} at {props.event.timeString}
                </Typography>
                <br />
                <Typography 
                    variant='body1' 
                    component='p' 
                    align='left' 
                    style={{
                        marginTop: 30,
                    }}
                >
                    {props.event.description} 
                </Typography>
            </CardContent>
            {props.user !== null &&
                <CardActions>
                    <IconButton  
                        color='primary'
                        disabled={btnUnlike}
                        onClick={_.find(props.event.likes, like => like.uniqueUserId === props.user.uniqueUserId) ? unLikeEvent : likeEvent}
                    >
        
                        {btnUnlike ? <CircularProgress /> : (
                            <Icon
                                path={_.find(props.event.likes, like => like.uniqueUserId === props.user.uniqueUserId) ? mdiThumbUp : mdiThumbUpOutline}
                                size={1} 
                                title='Like or unlike event'
                            />
                        )}
                        {props.event.likes.length > 0 &&
                            <small>
                                {props.event.likes.length} 
                            </small>
                        }
                    </IconButton>
                    <IconButton 
                        color='primary' 
                        onClick={e => setExpanded(!expanded)}
                    >
                        <Icon 
                            path={GroupOutline} 
                            size={1}
                            title='How many attending' 
                        />
                        {props.event.attending.length} attending 
                    </IconButton>
                    <Button 
                        color='primary' 
                        onClick={_.find(props.event.attending, attender => attender.uniqueUserId === props.user.uniqueUserId) ? unAttendEvent : attendEvent}
                        disabled={btnAttending}
                    >
                        {props.user.uniqueUserId !== props.event.uniqueUserId &&
                            <div>
                                {_.find(props.event.attending, attender => attender.uniqueUserId === props.user.uniqueUserId) ? 'unattend' : 'attend'}
                            </div>
                        }
                    </Button>
                    {props.user.uniqueUserId === props.event.uniqueUserId &&
                        <IconButton 
                            color='primary'
                            disabed={eventDeleting}
                            onClick={deleteEvent}
                        >
                            {eventDeleting ? <CircularProgress /> : (
                                <Icon 
                                    path={mdiDelete} 
                                    size={1} 
                                    title='Delete event' 
                                />
                            )}
                        </IconButton>
                    }
                </CardActions>
            }
            <Collapse 
                in={expanded} 
            >
                <Divider /> 
                {props.event.attending.map((attender, index) => (
                    <Paper 
                        key={index.toString()} 
                        elevation={3} 
                        style={{
                            marginBottom: index < props.event.attending.length - 1 ? 10 : 0,
                        }}
                    >
                        <ListItem 
                            alignItems='flex-start' 
                        >
                            <ListItemAvatar>
                                <Avatar 
                                    src={`http://192.168.0.17:3001/api/get/avatar/by/id/${attender.uniqueUserId}`}
                                    title={`${attender.username}`}
                                    alt={`${attender.username}`} 
                                    style={{
                                        cursor: 'pointer',
                                    }}
                                    onClick={e => history.push(`/geouser/${attender.uniqueUserId}`)}
                                /> 
                            </ListItemAvatar>
                            <ListItemText 
                                primary={
                                    <Typography 
                                        variant='h6' 
                                        component='h6' 
                                    >
                                        {attender.username} 
                                    </Typography>
                                }
                            />
                        </ListItem>
                    </Paper>
                ))}
            </Collapse>
        </Card>
    );
}

function mapStateToProps(state) {
    return {
        user: state.userReducer.user,
        primary: state.themeReducer.theme,
    };
}

export default connect(mapStateToProps)(EventComponent);