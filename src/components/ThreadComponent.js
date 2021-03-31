import React, { useState, useEffect, useRef } from 'react';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import axios from 'axios';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import ListItem from '@material-ui/core/ListItem';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import Avatar from '@material-ui/core/Avatar';
import swal from 'sweetalert';
import { connect } from 'react-redux';
import { useHistory, useParams } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import Backdrop from '@material-ui/core/Backdrop';
import CircularProgress from '@material-ui/core/CircularProgress';
import InputAdornment from '@material-ui/core/InputAdornment';
import IconButton from '@material-ui/core/IconButton';
import Icon from '@mdi/react';
import { mdiSend, mdiDelete } from '@mdi/js';

const useStyles = makeStyles(() => ({
    topMarg: {
        marginTop: 100,
    },
    paper: {
        maxWidth: 600,
        margin: 'auto',
    },
    formMarg: {
        marginTop: 40,
    }
}));

function ThreadComponent(props) {
    const classes = useStyles();
    const params = useParams();
    const history = useHistory();
    const gridRef = useRef();
    const [msg, setMsg] = useState(''); //Variable and setter for the chat message we send.
    const [msgDeleting, setMsgDeleting] = useState(false); //Variable and setter to disable buttons when msg is sending or deleting.
    const [thread, setThread] = useState(null); //Variable and setter for the message thread we receive from the server.

    useEffect(() => {
        //First check to see if the user is null. Go to login page if they are. 
        if(props.user === null) {
            swal(
                'Uh Oh!',
                'You must be logged in to view a message thread!',
                'error',
            );
            history.push('/');
        }
        else {
            return axios({
                method: 'GET',
                url: `https://www.geocities.cc/api/grab/thread/${params.uniqueThreadId}/${props.user.uniqueUserId}`,
            }).then(response => {
                if(response.data === 'no thread') {
                    swal(
                        'Uh Oh!',
                        'That message thread cannot be found!',
                        'error',
                    );
                    history.goBack(1);
                }
                else {
                    props.dispatch({type: 'user/updateUser', payload: response.data.user});
                    props.dispatch({type: 'ThemeChange', payload: response.data.user.profileTheme});
                    setThread(response.data.thread);
                    if(gridRef.current) {
                        window.scrollTo({
                            behavior: 'smooth',
                            top: gridRef.current.offsetTop,
                        });
                    }
                }
            });
        }
    }, []);

    function timeDifference(date2, dateString) {
        //This function will return whether or not we display something like "2 hrs ago" "20 min ago" or the date string for a thread
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

    function getReceiverUniqueUserId() {
        //Function that will determine the receiver of the message in the thread and return their ID.
        if(thread.uniqueUserIds[0] === props.user.uniqueUserId) {
            return thread.uniqueUserIds[1];
        }
        else {
            return thread.uniqueUserIds[0];
        }
    }

    function getReceiverUsername() {
        //Function that will determine the receiver of the message in the thread and return their ID.
        if(thread.usernames[0] === props.user.username) {
            return thread.usernames[1];
        }
        else {
            return thread.usernames[0];
        }
    }

    function sendMsg() {
        //This function will be responsible for sending a message to the server. 
        setMsgDeleting(true);

        if(msg.trim().length < 1) {
            swal(
                'Uh Oh!',
                'You must enter a message!',
                'error',
            )
            setMsgDeleting(false);
            return false;
        }
        else {
            let months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'];
            let date = new Date();
            let month = months[date.getMonth()];
            let day = date.getDate();
            let year = date.getFullYear();
            let dateString = `${month} ${day}, ${year}`;
            let data = JSON.stringify({
                senderUniqueUserId: props.user.uniqueUserId,
                receiverUniqueUserId: getReceiverUniqueUserId(),
                senderUsername: props.user.username,
                receiverUername: getReceiverUsername(),
                dateString: dateString,
                utcTime: Date.now(),
                msg: msg,
                uniqueMessageId: 'message' + Date.now() + props.user.uniqueUserId + thread.uniqueThreadId,
                freshMsg: false,
                uniqueThreadId: thread.uniqueThreadId,
            });

            return axios({
                method:'POST',
                url: 'https://www.geocities.cc/api/add/dm',
                data: data,
                headers: {
                    'Content-Type': 'application/json',
                },
            }).then(response => {
                swal(
                    'Great!',
                    'You successfully sent that message!',
                    'success'
                )
                setThread(response.data.thread);
                if(gridRef.current) {
                    window.scrollTo({
                        behavior: 'smooth',
                        top: gridRef.current.offsetTop,
                    });
                }
                setMsgDeleting(false);
                setMsg('');
            }).catch(err => {
                console.log(err.message);
                swal(
                    'Uh Oh!',
                    'There was an error sending that message! Please try again.',
                    'error',
                );
                setMsgDeleting(false);
            });
        }
    }

    function deleteMsg(uniqueMessageId) {
        //This function will handle deleting a message from the thread. 
        setMsgDeleting(true);

        let data = JSON.stringify({
            uniqueThreadId: thread.uniqueThreadId,
            uniqueMessageId: uniqueMessageId,
        });

        return axios({
            method: 'POST',
            url: 'https://www.geocities.cc/api/delete/dm',
            data: data,
            headers: {
                'Content-Type': 'application/json',
            },
        }).then(response => {
            swal(
                'Great!',
                'You successfully deleted that direct message!',
                'success',
            );
            setThread(response.data.thread);
            setMsgDeleting(false);
            if(gridRef.current) {
                window.scrollTo({
                    behavior: 'smooth',
                    top: gridRef.current.offsetTop,
                });
            }
        }).catch(err => {
            console.log(err.message);
            swal(
                'Uh Oh!',
                'There was an error deleting that message! Please try again.',
                'error',
            );
            setMsgDeleting(false);
        });
    }

    if(props.user !== null) {
        return (
            <Grid 
                container 
                className={classes.topMarg} 
            >
                <Grid 
                    item 
                    xs={12}
                >
                    {(thread !== null && thread.messages.length > 0) &&
                        <div>
                            {thread.messages.map((message, index) => (
                                <Paper 
                                    key={index.toString()} 
                                    elevation={3} 
                                    className={classes.paper} 
                                    style={{
                                        marginBottom: index < thread.messages.length - 1 ? 20 : 0,
                                    }}
                                >
                                    <ListItem 
                                        alignItems='flex-start' 
                                    >
                                        <ListItemAvatar>
                                            <Avatar 
                                                src={`https://www.geocities.cc/api/get/avatar/by/id/${message.senderUniqueUserId}`}
                                                alt={`${message.senderUsername}`}
                                                title={`${message.senderUsername}`} 
                                                onClick={e => history.push(`/geouser/${message.senderUniqueUserId}`)} 
                                            />
                                        </ListItemAvatar>
                                        <ListItemText 
                                            primary={
                                                <div>
                                                    <Typography 
                                                        variant='h6' 
                                                        component='h6' 
                                                    >
                                                        {message.senderUsername}
                                                    </Typography>
                                                    <Typography 
                                                        variant='subtitle2' 
                                                        component='span' 
                                                        color='textSecondary' 
                                                    >
                                                        {timeDifference(message.utcTime, message.dateString)}
                                                    </Typography>
                                                </div>
                                            }
                                            secondary={
                                                <Typography 
                                                    variant='body1' 
                                                    component='p'
                                                >
                                                    {message.msg}
                                                </Typography>
                                            }
                                        />
                                        {props.user.uniqueUserId === message.senderUniqueUserId &&
                                            <ListItemSecondaryAction>
                                                <IconButton 
                                                    color='primary'
                                                    onClick={e => deleteMsg(message.uniqueMessageId)}
                                                >
                                                    <Icon 
                                                        path={mdiDelete} 
                                                        size={1} 
                                                        title='Message delete' 
                                                        aria-label='Message delete' 
                                                    />
                                                </IconButton>
                                            </ListItemSecondaryAction>
                                        }
                                    </ListItem>
                                </Paper>
                            ))}
                        </div>
                    }
                </Grid>
                {/* End of the messages Grid. Now add a GridRef for sliding purposes */} 
                {/* Now, add the Grid for the TextField to send messages */} 
                <Grid 
                    item 
                    xs={12} 
                    className={classes.formMarg} 
                    ref={gridRef}
                >
                    <TextField 
                        label='Message' 
                        value={msg} 
                        onChange={e => setMsg(e.target.value)} 
                        color='primary' 
                        variant='outlined' 
                        placeholder='Send message...' 
                        helperText='Send a message to this user' 
                        inputLabelProps={{
                            shrink: true,
                        }}
                        InputProps={{
                            endAdornment: (
                              <InputAdornment position='end'>
                                <IconButton
                                  aria-label='Message send button'
                                  color='primary'
                                  disabled={msgDeleting}
                                  onClick={sendMsg}
                                >
                                    {msgDeleting ? <CircularProgress /> : (
                                        <Icon 
                                            path={mdiSend}
                                            size={2}
                                        />
                                    )}
                                </IconButton>
                              </InputAdornment>
                            ),
                          }}
                        multiline
                        rows={4} 
                        fullWidth
                    />
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
        user: state.userReducer.user,
        primary: state.userThemeReducer.primary,
    };
}

export default connect(mapStateToProps)(ThreadComponent);