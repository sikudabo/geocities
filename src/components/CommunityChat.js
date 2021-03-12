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
import { makeStyles } from '@material-ui/core/styles';
import useSocket from 'use-socket.io-client';
import { connect } from 'react-redux';
import { useHistory, useParams } from 'react-router-dom';
import axios from 'axios';
import * as _ from 'underscore';
import {NotificationContainer, NotificationManager} from 'react-notifications'; //A module that is more similar to vue-notifications to notify a user when someone has joined or left the chatroom.
import './react-notifications/dist/react-notifications.css';
import InputAdornment from '@material-ui/core/InputAdornment';
import IconButton from '@material-ui/core/IconButton';
import Icon from '@mdi/react';
import { mdiSend, mdiDelete } from '@mdi/js';

const useStyles = makeStyles(() => ({
    listItem: {
        maxWidth: 600,
        margin: 'auto',
    },
    list: {
        maxWidth: 600,
        margin: 'auto',
    },
    avatarLg: {
        height: 168,
        width: 168,
        margin: 'auto',
    },
}));

function CommunityChat(props) {
    const classes = useStyles(); //Custom component classes. 
    const [community, setCommunity]= useState(null); //Variable and setter for the community we are in.
    const [socket] = useSocket('http://192.168.0.17:3001/'); //useSocket hook to maintain a connection.
    const [chatMsg, setChatMsg] = useState(''); //The message that could be sent to the server for another chat. 
    const params = useParams();
    const history = useHistory();
    const gridRef = useRef(null);
    const [msgDeleting, setMsgDeleting] = useState(false); //Variable and setter to handle when the message is deleting. 

    useEffect(() => {
        if(props.mainUser) {
            return axios({
                method: 'GET',
                url: `http://192.168.0.17:3001/api/fetch/community/${params.communityName}`,
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
                    
                    //Below, we must connect the socket. 
                    socket.connect();
                    
                    //Below, immediately scroll to the botom of the messages list. 
                    if(gridRef.current) {
                        window.scrollTo({
                            behavior: 'smooth',
                            top: gridRef.current.offsetTop,
                        });
                    }

                    //Below we will get the socket to join the room
                    //We emit the joinRoom action and send the username and room name to the server.
                    socket.emit('joinRoom', {
                        username: props.mainUser.username,
                        room: response.data.community.name,
                    });

                    //Below add the listener for IF the user joins the room. 
                    socket.on('userJoined', data => {
                        let message = data.username + ' Joined the chat!';
                        NotificationManager.info(message, 'New user joined', 5000);
                    });

                    //Below will handle a new message being sent to the community chatroom. 
                    socket.on('newMsg', data => {
                        setCommunity(data);
                        if(gridRef.current) {
                            window.scrollTo({
                                behavior: 'smooth',
                                top: gridRef.current.offsetTop,
                            });
                        }
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

    function handleUserPush(uniqueUserId) {
        //Route that handles pushing to a new user when the avatar is clicked within the chat messages. 
        history.push(`/geouser/${uniqueUserId}`);
        history.go(0);
    }

    function timeDifference(date2, dateString) {
        //This function will return whether or not we display something like "2 hrs ago" "20 min ago" or the date string for a post
        let date1 = Date.now();
        let difference = date1 - date2;
        let daysDifference = Math.floor(difference/1000/60/60/24);
        let hoursDifference = Math.floor(difference/1000/60/60);
        let minutesDifference = Math.floor(difference/1000/60);
        let secondsDifference = Math.floor(difference/1000);
        if(daysDifference > 0) {
            return dateString;
        }
        else if(hoursDifference > 0 && hoursDifference < 23) {
            return `${hoursDifference} hr ago`;
        }
        else if(minutesDifference > 0 && minutesDifference < 60) {
            return `${minutesDifference} min ago`;
        }
        else if(minutesDifference === 0) {
            return `${secondsDifference} secs ago`
        }
        else {
            return dateString;
        }
    }

    function sendMsg() {
        //This function will be responsible for sending a chat message to the server socket. 
        if(chatMsg.trim() === '') {
            swal(
                'Uh Oh!',
                'You must enter a message to send to the community chatroom!',
                'error',
            );
            return false;
        }
        else {
            let months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'];
            let date = new Date();
            let month = months[date.getMonth()];
            let year = date.getFullYear();
            let day = date.getDate();
            let dateString = `${month} ${day}, ${year}`;
            let data = {
                username: props.mainUser.username,
                uniqueUserId: props.mainUser.uniqueUserId,
                utcTime: new Date().getTime(),
                dateString: dateString,
                uniqueMessageId: Date.now() + dateString + props.mainUser.username + props.mainUser.uniqueUserId,
                community: community.name,
                room: community.name + 'chatroom',
                text: chatMsg,
            };

            socket.emit('sendMsg', data);
            setChatMsg('');
        }
    }

    function deleteMsg(uniqueMessageId) {
        setMsgDeleting(true); 
        let data = {
            uniqueMessageId: uniqueMessageId,
            community: community.name,
        };

        return axios({
            method: 'POST',
            url: 'http://192.168.0.17:3001/api/delete/chat/msg',
            data: data,
            headers: {
                'Content-Type': 'application/json',
            },
        }).then(response => {
            setCommunity(response.data.community);
            setMsgDeleting(false);
        }).catch(err => {
            console.log(err.message);
            swal(
                'Uh Oh!',
                'There was an error deleting that message from the chatroom!',
                'error',
            );
            setMsgDeleting(false);
        });
    }

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
                >
                    <NotificationContainer />
                </Grid>
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
                        src={`http://192.168.0.17:3001/api/get-photo/${community.avatar}`}
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
                {/* This is where the Grid should be for the messages section. This will be above the Grid for the TextField and Button to send messages */}
                <Grid 
                    item 
                    xs={12} 
                    style={{
                        marginTop: 50,
                    }}
                >
                    {community.chatRoom.messages.length < 1 &&
                        <div 
                            style={{
                                textAlign: 'centter',
                            }}
                        >
                            <Typography 
                                variant='h6'
                                component='h6'
                                align='center' 
                            >
                                No messages!
                            </Typography>
                        </div>
                    }
                    {community.chatRoom.messages.length > 0 &&
                        <List 
                            className={classes.list}
                        >
                            {community.chatRoom.messages.map((msg, index) => (
                                <div>
                                    <ListItem 
                                        className={classes.listItem} 
                                        alignItems='flex-start'
                                        key={index.toString()}
                                    >
                                        <ListItemAvatar>
                                            <Avatar 
                                                src={`http://192.168.0.17:3001/api/get/avatar/by/id/${msg.uniqueUserId}`}
                                                title={`${msg.username}`}
                                                alt={`${msg.username}`} 
                                                onClick={e => handleUserPush(msg.uniqueUserId)}
                                                style={{
                                                    cursor: 'pointer',
                                                }}
                                            />
                                        </ListItemAvatar>
                                        <ListItemText 
                                            primary={
                                                <div>
                                                    <Typography 
                                                        variant='h6' 
                                                        component='h6' 
                                                    >
                                                        {msg.username}
                                                    </Typography>
                                                    <Typography 
                                                        variant='subtitle1' 
                                                        component='span' 
                                                        color='textSecondary'
                                                    >
                                                        {timeDifference(msg.utcTime, msg.dateString)}
                                                    </Typography>
                                                </div>
                                            }
                                            secondary={
                                                <Typography 
                                                    variant='body2' 
                                                    component='p' 
                                                >
                                                    {msg.text}
                                                </Typography>
                                            }
                                        />
                                        <div>
                                            {(props.mainUser.uniqueUserId === msg.uniqueUserId || community.moderator.uniqueUserId === props.mainUser.uniqueUserId) &&
                                                <IconButton 
                                                    color='primary'
                                                    onClick={() => deleteMsg(msg.uniqueMessageId)}
                                                    disabled={msgDeleting}
                                                >
                                                    {msgDeleting ? <CircularProgress color='primary' /> : <Icon path={mdiDelete} size={1} title='Delete comment button' aria-label='Delete comment button' />}
                                                </IconButton>
                                            }
                                        </div>
                                    </ListItem>
                                    {index < community.chatRoom.messages.length - 1 &&
                                        <Divider />
                                    }
                                </div>
                            ))}
                        </List>
                    }
                </Grid>
                {/* This Div will serve as a dummy to scroll to */} 
                <div 
                    ref={gridRef}
                >

                </div>
                {/* This is the end of the Grid for the messages section. Now we need a Grid or a div for the TextField and Button to send messages */}
                <Grid 
                    item
                    container 
                    xs={12}
                    style={{
                        marginTop: 10,
                    }}
                    ref={gridRef}
                >
                    <Grid 
                        item 
                        xs={12}
                    >
                        <TextField 
                            value={chatMsg}
                            onChange={e => setChatMsg(e.target.value)}
                            variant='outlined'
                            color='primary' 
                            label='Chat message'
                            placeholder='Send a message...'
                            InputLabelProps={{
                                shrink: true,
                            }}
                            InputProps={{
                                endAdornment: (
                                  <InputAdornment position='end'>
                                    <IconButton
                                      aria-label='Message send button'
                                      color='primary'
                                      onClick={sendMsg}
                                    >
                                        <Icon 
                                            path={mdiSend}
                                            size={2}
                                        />
                                    </IconButton>
                                  </InputAdornment>
                                ),
                              }}
                            fullWidth
                        />
                    </Grid>
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