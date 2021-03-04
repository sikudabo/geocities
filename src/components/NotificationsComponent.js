import React, { useState, useEffect } from 'react';
import Grid from '@material-ui/core/Grid';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemText from '@material-ui/core/ListItemText';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import Icon from '@mdi/react';
import { mdiCheckBold, mdiClose } from '@mdi/js';
import { connect } from 'react-redux';
import Backdrop from '@material-ui/core/Backdrop';
import CircularProgress from '@material-ui/core/CircularProgress';
import { useHistory } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import swal from 'sweetalert';
import axios from 'axios';
import Avatar from '@material-ui/core/Avatar';
import Paper from '@material-ui/core/Paper';

const useStyles = makeStyles(() => ({
    root: {
        marginTop: 100,
    },
    item: {
        margin: 'auto',
    },
    list: {
        margin: 'auto',
        maxWidth: 700,
    },
}));

function NotificationsComponent(props) {
    const [deletingNotification, setDeletingNotification] = useState(false); //Backdrop when we want to delete notification.
    const history = useHistory();
    const classes = useStyles();
    
    useEffect(() => {
        if(props.mainUser === null) {
            history.push('/');
        }
        else {
            return axios({
                method: 'GET',
                url: `https://www.geocities.cc/api/grab/user/${props.mainUser.uniqueUserId}`
            }).then(response => {
                props.dispatch({type: 'user/updateUser', payload: response.data.user});
                props.dispatch({type: 'ThemeChange', payload: response.data.user.profileTheme});
            }).catch(err => {
                console.log(err.message);
                swal(
                    'Uh Oh!',
                    'There was an error gathering your notifications! Please try again',
                    'error',
                );
                history.goBack(1);
            });
        }
    }, []);

    function utcToDateString(utc) {
        let date = new Date(utc);
        let months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'];
        let month = months[date.getMonth()];
        let day = date.getDate();
        let year = date.getFullYear();
        return month + ' ' + day + ', ' + year;
    }

    function deleteNotification(uniqueNotificationId, link) {
        setDeletingNotification(true);
        let data = JSON.stringify({
            uniqueUserId: props.mainUser.uniqueUserId,
            uniqueNotificationId: uniqueNotificationId,
            link: link,
        });

        return axios({
            method: 'POST',
            url: 'https://www.geocities.cc/api/delete/notification',
            data: data,
            headers: {
                'Content-Type': 'application/json',
            },
        }).then(response => {
            setDeletingNotification(false);
            props.dispatch({type: 'user/updateUser', payload: response.data.user});
            swal(
                'Great!',
                'Notification successfully deleted!',
                'success',
            );
            if(response.data.link !== '') {
                history.push(response.data.link);
            }
        }).catch(err => {
            setDeletingNotification(false);
            console.log(err.message);
            swal(
                'Uh Oh!',
                'There was an error deleting that notification!',
                'error',
            );
        });
    }

    function acceptRejectFollow(followerUsername, followerUniqueUserId, uniqueNotificationId, accept) {
        setDeletingNotification(true);
        let data = JSON.stringify({
            followerUsername: followerUsername,
            followerUniqueUserId: followerUniqueUserId,
            uniqueNotificationId: uniqueNotificationId,
            accept: accept,
            username: props.mainUser.username,
            uniqueUserId: props.mainUser.uniqueUserId,
        });

        return axios({
            method: 'POST',
            url: 'https://www.geocities.cc/api/follow/request/choice',
            data: data,
            headers: {
                'Content-Type': 'application/json',
            },
        }).then(response => {
            props.dispatch({type: 'user/updateUser', payload: response.data.user});
            if(response.data.accept === true) {
                swal(
                    'Great!',
                    'Successfully accepted that follow request!',
                    'success',
                );
                setDeletingNotification(false);
            }
            else {
                swal(
                    'Great!',
                    'Successfully rejected that follow request!',
                    'success',
                );
                setDeletingNotification(false);
            }
        }).catch(err => {
            console.log(err.message);
            swal(
                'Uh Oh!',
                'There was an error accepting or rejecting that follow request!',
                'error',
            );
            setDeletingNotification(false);
        });
    }

    function acceptRejectJoinRequest(username, uniqueUserId, community, uniqueNotificationId, acceptReject) {
        //This function will handle acception or rejecting a community join request. 
        setDeletingNotification(true);
        let data = JSON.stringify({
            uniqueUserId: uniqueUserId,
            username: username,
            name: community,
            uniqueNotificationId: uniqueNotificationId,
            acceptReject: acceptReject,
            moderatorUniqueUserId: props.mainUser.uniqueUserId,
            moderatorUsername: props.mainUser.username,
        });

        return axios({
            method: 'POST',
            url: 'https://www.geocities.cc/api/accept/reject/community/join',
            data: data,
            headers: {
                'Content-Type': 'application/json',
            },
        }).then(response => {
            if(response.data.acceptReject === true) {
                swal(
                    'Great!',
                    'Successfully accepted that community join request!',
                    'success',
                );
                props.dispatch({type: 'user/updateUser', payload: response.data.user});
                setDeletingNotification(false);
            }
            else if(response.data.acceptReject === false) {
                swal(
                    'Great!',
                    'Successfully denied that community join request!',
                    'success',
                );
                props.dispatch({type: 'user/updateUser', payload: response.data.user});
                setDeletingNotification(false);
            }
            else {
                swal(
                    'Uh oh!',
                    'There was an accepting or rejection that community join request!',
                    'error',
                );
                setDeletingNotification(false);
            }
        }).catch(err => {
            console.log(err.message);
            swal(
                'Uh Oh!',
                'There was an error accepting or rejection that community join request!',
                'error',
            );

            setDeletingNotification(false);
        });
    }

    if(props.mainUser !== null) {
        return (
            <Grid 
                container 
                className={classes.root}
            >
                <Backdrop 
                    open={deletingNotification} 
                >
                    <CircularProgress 
                        color='primary' 
                    />
                </Backdrop>
                {props.mainUser.notifications.length > 0 &&
                    <Grid 
                        item 
                        xs={12} 
                    >
                        <List
                            className={classes.list} 
                        >
                            {props.mainUser.notifications.map((notification, index) => (
                                <div 
                                    key={index.toString()} 
                                >
                                    {notification.type === 'post comment' &&
                                        <Paper
                                            elevation={3}
                                        >
                                            <ListItem 
                                                style={{
                                                    cursor: 'pointer',
                                                    marginBottom: 20,
                                                }}
                                                onClick={e => deleteNotification(notification.uniqueNotificationId, notification.link)}
                                            >
                                                <ListItemAvatar>
                                                    <Avatar 
                                                        src={`https://www.geocities.cc/api/get/avatar/by/id/${notification.uniqueSenderId}`}
                                                        alt={`${notification.sender}`}
                                                        title={`${notification.sender}`}
                                                    />
                                                </ListItemAvatar>
                                                <ListItemText 
                                                    primary={
                                                        <Typography 
                                                            variant='h6' 
                                                            component='h6' 
                                                            align='center' 
                                                        >
                                                            {utcToDateString(notification.date)}
                                                        </Typography>
                                                    }
                                                    secondary={
                                                        <Typography 
                                                            variant='body1' 
                                                            component='p' 
                                                            align='center' 
                                                        >
                                                            {notification.msg}
                                                        </Typography>
                                                    }
                                                />
                                            </ListItem>
                                        </Paper>
                                    }
                                    {notification.type === 'post like' &&
                                        <Paper
                                            elevation={3}
                                        >
                                            <ListItem 
                                                style={{
                                                    cursor: 'pointer',
                                                    marginBottom: 20,
                                                }}
                                                onClick={e => deleteNotification(notification.uniqueNotificationId, notification.link)}
                                            >
                                                <ListItemAvatar>
                                                    <Avatar 
                                                        src={`https://www.geocities.cc/api/get/avatar/by/id/${notification.uniqueSenderId}`}
                                                        alt={`${notification.sender}`}
                                                        title={`${notification.sender}`}
                                                    />
                                                </ListItemAvatar>
                                                <ListItemText 
                                                    primary={
                                                        <Typography 
                                                            variant='h6' 
                                                            component='h6' 
                                                            align='center' 
                                                        >
                                                            {utcToDateString(notification.date)}
                                                        </Typography>
                                                    }
                                                    secondary={
                                                        <Typography 
                                                            variant='body1' 
                                                            component='p' 
                                                            align='center' 
                                                        >
                                                            {notification.msg}
                                                        </Typography>
                                                    }
                                                />
                                            </ListItem>
                                        </Paper>
                                    }
                                    {notification.type === 'join accepted' &&
                                        <Paper
                                            elevation={3}
                                        >
                                            <ListItem 
                                                style={{
                                                    cursor: 'pointer',
                                                    marginBottom: 20,
                                                }}
                                                onClick={e => deleteNotification(notification.uniqueNotificationId, notification.link)}
                                            >
                                                <ListItemAvatar>
                                                    <Avatar 
                                                        src={`https://www.geocities.cc/api/get/avatar/by/community/name/${notification.community}`}
                                                        alt={`${notification.sender}`}
                                                        title={`${notification.sender}`}
                                                    />
                                                </ListItemAvatar>
                                                <ListItemText 
                                                    primary={
                                                        <Typography 
                                                            variant='h6' 
                                                            component='h6' 
                                                            align='center' 
                                                        >
                                                            {utcToDateString(notification.date)}
                                                        </Typography>
                                                    }
                                                    secondary={
                                                        <Typography 
                                                            variant='body1' 
                                                            component='p' 
                                                            align='center' 
                                                        >
                                                            {notification.msg}
                                                        </Typography>
                                                    }
                                                />
                                            </ListItem>
                                        </Paper>
                                    }
                                    {notification.type === 'new follower' &&
                                        <Paper
                                            elevation={3}
                                        >
                                            <ListItem 
                                                style={{
                                                    cursor: 'pointer',
                                                    marginBottom: 20,
                                                }}
                                                onClick={e => deleteNotification(notification.uniqueNotificationId, notification.link)}
                                            >
                                                <ListItemAvatar>
                                                    <Avatar 
                                                        src={`https://www.geocities.cc/api/get/avatar/by/id/${notification.uniqueSenderId}`}
                                                        alt={`${notification.sender}`}
                                                        title={`${notification.sender}`}
                                                    />
                                                </ListItemAvatar>
                                                <ListItemText 
                                                    primary={
                                                        <Typography 
                                                            variant='h6' 
                                                            component='h6' 
                                                            align='center' 
                                                        >
                                                            {utcToDateString(notification.date)}
                                                        </Typography>
                                                    }
                                                    secondary={
                                                        <Typography 
                                                            variant='body1' 
                                                            component='p' 
                                                            align='center' 
                                                        >
                                                            {notification.msg}
                                                        </Typography>
                                                    }
                                                />
                                            </ListItem>
                                        </Paper>
                                    }
                                    {notification.type === 'comment like' &&
                                        <Paper
                                            elevation={3}
                                        >
                                            <ListItem 
                                                style={{
                                                    cursor: 'pointer',
                                                    marginBottom: 20,
                                                }}
                                                onClick={e => deleteNotification(notification.uniqueNotificationId, notification.link)}
                                            >
                                                <ListItemAvatar>
                                                    <Avatar 
                                                        src={`https://www.geocities.cc/api/get/avatar/by/id/${notification.uniqueSenderId}`}
                                                        alt={`${notification.sender}`}
                                                        title={`${notification.sender}`}
                                                    />
                                                </ListItemAvatar>
                                                <ListItemText 
                                                    primary={
                                                        <Typography 
                                                            variant='h6' 
                                                            component='h6' 
                                                            align='center' 
                                                        >
                                                            {utcToDateString(notification.date)}
                                                        </Typography>
                                                    }
                                                    secondary={
                                                        <Typography 
                                                            variant='body1' 
                                                            component='p' 
                                                            align='center' 
                                                        >
                                                            {notification.msg}
                                                        </Typography>
                                                    }
                                                />
                                            </ListItem>
                                        </Paper>
                                    }
                                    {notification.type === 'follower request' &&
                                        <Paper
                                            elevation={3}
                                            style={{
                                                marginBottom: 20,
                                            }}
                                        >
                                            <ListItem
                                            >
                                                <ListItemAvatar>
                                                    <Avatar 
                                                        src={`https://www.geocities.cc/api/get/avatar/by/id/${notification.uniqueSenderId}`}
                                                        alt={`${notification.sender}`}
                                                        title={`${notification.sender}`}
                                                        style={{
                                                            cursor: 'pointer',
                                                        }}
                                                        onClick={e => history.push(`/geouser/${notification.uniqueSenderId}`)}
                                                    />
                                                </ListItemAvatar>
                                                <ListItemText 
                                                    primary={
                                                        <Typography 
                                                            variant='h6' 
                                                            component='h6' 
                                                            align='center' 
                                                        >
                                                            {utcToDateString(notification.date)}
                                                        </Typography>
                                                    }
                                                    secondary={
                                                        <Typography 
                                                            variant='body1' 
                                                            component='p' 
                                                            align='center' 
                                                        >
                                                            {notification.msg}
                                                        </Typography>
                                                    }
                                                />
                                            </ListItem>
                                            <IconButton 
                                                style={{
                                                    color: 'rgb(0, 128, 0)',
                                                }}
                                                aria-label='Accept follower request button'
                                                disabled={deletingNotification}
                                                onClick={e => acceptRejectFollow(notification.sender, notification.uniqueSenderId, notification.uniqueNotificationId, true)}
                                            >
                                                <Icon 
                                                    path={mdiCheckBold} 
                                                    size={1}
                                                    title="Acccept follow request" 
                                                    aria-label='Follow request accept icon' 
                                                />
                                            </IconButton>
                                            <IconButton 
                                                style={{
                                                    color: 'rgb(255, 0, 0)'
                                                }}
                                                aria-label='Deny request button'
                                                disabled={deletingNotification}
                                                onClick={e => acceptRejectFollow(notification.sender, notification.uniqueSenderId, notification.uniqueNotificationId, false)}
                                            >
                                                <Icon 
                                                    path={mdiClose} 
                                                    size={1}
                                                    title='Deny request icon'
                                                    aria-label='Deny request icon' 
                                                />
                                            </IconButton>
                                        </Paper>  
                                    }
                                    {/* Below is the notification type for a "community join request" */}
                                    {notification.type === 'community join request' &&
                                        <Paper
                                            elevation={3}
                                            style={{
                                                marginBottom: 20,
                                            }}
                                        >
                                            <ListItem
                                            >
                                                <ListItemAvatar>
                                                    <Avatar 
                                                        src={`https://www.geocities.cc/api/get/avatar/by/id/${notification.uniqueSenderId}`}
                                                        alt={`${notification.sender}`}
                                                        title={`${notification.sender}`}
                                                        style={{
                                                            cursor: 'pointer',
                                                        }}
                                                        onClick={e => history.push(`/geouser/${notification.uniqueSenderId}`)}
                                                    />
                                                </ListItemAvatar>
                                                <ListItemText 
                                                    primary={
                                                        <Typography 
                                                            variant='h6' 
                                                            component='h6' 
                                                            align='center' 
                                                        >
                                                            {utcToDateString(notification.date)}
                                                        </Typography>
                                                    }
                                                    secondary={
                                                        <Typography 
                                                            variant='body1' 
                                                            component='p' 
                                                            align='center' 
                                                        >
                                                            {notification.msg}
                                                        </Typography>
                                                    }
                                                />
                                            </ListItem>
                                            <IconButton 
                                                style={{
                                                    color: 'rgb(0, 128, 0)',
                                                }}
                                                aria-label='Accept communityJoin request button'
                                                disabled={deletingNotification}
                                                onClick={e => acceptRejectJoinRequest(notification.sender, notification.uniqueSenderId, notification.community, notification.uniqueNotificationId, true)}
                                            >
                                                <Icon 
                                                    path={mdiCheckBold} 
                                                    size={1}
                                                    title="Acccept follow request" 
                                                    aria-label='Follow request accept icon' 
                                                />
                                            </IconButton>
                                            <IconButton 
                                                style={{
                                                    color: 'rgb(255, 0, 0)'
                                                }}
                                                aria-label='Deny request button'
                                                disabled={deletingNotification}
                                                onClick={e => acceptRejectJoinRequest(notification.sender, notification.uniqueSenderId, notification.community, notification.uniqueNotificationId, false)}
                                            >
                                                <Icon 
                                                    path={mdiClose} 
                                                    size={1}
                                                    title='Deny request icon'
                                                    aria-label='Deny request icon' 
                                                />
                                            </IconButton>
                                        </Paper> 
                                    }
                                    {notification.type === 'accept follow request' &&
                                        <Paper
                                            elevation={3}
                                        >
                                            <ListItem 
                                                style={{
                                                    cursor: 'pointer',
                                                    marginBottom: 20,
                                                }}
                                                onClick={e => deleteNotification(notification.uniqueNotificationId, notification.link)}
                                            >
                                                <ListItemAvatar>
                                                    <Avatar 
                                                        src={`https://www.geocities.cc/api/get/avatar/by/id/${notification.uniqueSenderId}`}
                                                        alt={`${notification.sender}`}
                                                        title={`${notification.sender}`}
                                                    />
                                                </ListItemAvatar>
                                                <ListItemText 
                                                    primary={
                                                        <Typography 
                                                            variant='h6' 
                                                            component='h6' 
                                                            align='center' 
                                                        >
                                                            {utcToDateString(notification.date)}
                                                        </Typography>
                                                    }
                                                    secondary={
                                                        <Typography 
                                                            variant='body1' 
                                                            component='p' 
                                                            align='center' 
                                                        >
                                                            {notification.msg}
                                                        </Typography>
                                                    }
                                                />
                                            </ListItem>
                                        </Paper>
                                    }
                                </div>
                            ))}
                        </List>
                    </Grid>
                }
                {props.mainUser.notifications.length < 1 &&
                   <Grid 
                        item
                        xs={12} 
                        style={{
                            textAlign: 'center',
                        }}
                    >
                         <Typography 
                            variant='h6' 
                            component='h6' 
                            align='center' 
                        >
                            No Notifications
                        </Typography>
                    </Grid>
                }
            </Grid>
        );
    }
    else {
        return (
            <Backdrop
                open={true} 
            >
                <CircularProgress color='primary' />
            </Backdrop>
        );
    }
}

function mapStateToProps(state) {
    return {
        mainUser: state.userReducer.user,
        primary: state.userThemeReducer.primary,
    };
}

export default connect(mapStateToProps)(NotificationsComponent);