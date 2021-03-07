import React, { useState, useEffect, useRef } from 'react';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import Avatar from '@material-ui/core/Avatar';
import Backdrop from '@material-ui/core/Backdrop';
import CircularProgress from '@material-ui/core/CircularProgress';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemText from '@material-ui/core/ListItemText';
import swal from 'sweetalert';
import Divider from '@material-ui/core/Divider';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';
import io from 'socket.io-client';
import { connect } from 'react-redux';
import { useHistory, useParams } from 'react-router-dom';
import axios from 'axios';
import * as _ from 'underscore';

const useStyles = makeStyles(() => ({
    listItem: {
        maxWidth: 600,
        margin: 'auto',
    },
    avatarLg: {
        height: 168,
        width: 168,
        margin: 'auto',
    }
}));

function CommunityChat(props) {
    const classes = useStyles(); //Custom component classes. 
    const [community, setCommunity]= useState(null); //Variable and setter for the community we are in.
    const socket = io('http://10.162.4.11:3001/'); //Socket that connects to the server IP. 
    const [msg, setMsg] = useState(''); //The message that could be sent to the server for another chat. 
    const params = useParams();
    const history = useHistory();

    useEffect(() => {
        if(props.mainUser) {
            return axios({
                method: 'GET',
                url: `http://10.162.4.11:3001/api/fetch/community/${params.communityName}`,
            }).then(response => {
                let inCommunity = _.find(response.data.community.members, member => member.uniqueUserId === props.mainUser.uniqueUserId);
                if(response.data.community === null) {
                    swal(
                        'Uh Oh!',
                        'We could not find that communities chatroom!',
                        'error',
                    );
                    history.goBack(1);
                }
                else if(_.find(response.data.community.blockList, person => person.uniqueUserId === props.mainUser.uniqueUserId)) {
                    swal(
                        'Uh Oh!',
                        'You are blocked from this community!',
                        'error',
                    );
                    history.goBack(1);
                }
                else if(!inCommunity){
                    swal(
                        'Uh Oh',
                        'You must be a member of this community to join the community chatroom',
                        'error',
                    );
                    history.goBack(1);
                }
                else {
                    setCommunity(response.data.community); //Set the community in the local state variable to this community. 
                    props.dispatch({type: 'ThemeChange', payload: response.data.community.communityTheme}); //Change the theme to match the community theme.
                    //Below we will get the socket to join the room
                    //We emit the joinRoom action and send the username and room name to the server.
                    socket.emit('joinRoom', {
                        username: props.mainUser.username,
                        room: response.data.community.name,
                    });

                    //Below add the listener for IF the user joins the room. 
                    socket.on('userJoined', data => {
                    let message = data.username + ' Joined the chat!';
                    alert(message);
        });
                }
            }).catch(err => {
                console.log(err.message);
                swal(
                    'Uh Oh!',
                    'There was an error joining the chatroom!',
                    'error',
                );
                history.goBack(1);
            });
        }
        else {
            swal(
                'Uh Oh!',
                'You must be logged in to join a chatroom!',
                'error',
            );
            history.goBack(1);
        }

    }, []);

    if(props.mainUser !== null && community !== null) {
        return (
            <Grid 
                container 
                style={{
                    marginTop: 100,
                }}
            >
                <Grid 
                    item 
                    xs={12} 
                    style={{
                        textAlign: 'center',
                    }}
                >
                    <Avatar 
                        variant='square'
                        className={classes.avatarLg}
                        alt={`${community.name} avatar`}
                        title={`${community.name} avatar`}
                        src={`http://10.162.4.11:3001/api/get-photo/${community.avatar}`}
                    />
                    <Typography 
                        variant='body1'
                        component='small'
                        align='center'
                        style={{
                            fontWeight: 'bold',
                            textAlign: 'center',
                            margin: 'auto',
                        }}
                    >
                        {community.chatRoom.community} chat
                    </Typography>
                </Grid>
            </Grid>
        );
    }
    else {
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
}

function mapStateToProps(state) {
    return {
        mainUser: state.userReducer.user,
        primary: state.userThemeReducer.primary,
    };
}

export default connect(mapStateToProps)(CommunityChat);