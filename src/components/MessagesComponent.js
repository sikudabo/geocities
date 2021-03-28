import React, { useState, useEffect } from 'react';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import { connect } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import Backdrop from '@material-ui/core/Backdrop';
import CircularProgress from '@material-ui/core/CircularProgress';
import axios from 'axios';
import swal from 'sweetalert';
import { useHistory } from 'react-router-dom';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import AppBar from '@material-ui/core/AppBar';
import Icon from '@mdi/react';
import { mdiClose } from '@mdi/js';
import TextField from '@material-ui/core/TextField';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Avatar from '@material-ui/core/Avatar';
import Autocomplete, { createFilterOptions } from '@material-ui/lab/Autocomplete';
import Paper from '@material-ui/core/Paper';
import * as _ from 'underscore';

const userFilterOptions = createFilterOptions({
    matchFrom: 'any',
    stringify: option => option.firstName + ' ' + option.lastName + ' ' + option.username,
}); //Filter options to search for users to message

const useStyles = makeStyles(() => ({
    topGrid: {
        marginTop: 100,
    },
    topMarg: {
        marginTop: 20,
        textAlign: 'center',
    },
    paper: {
        maxWidth: 600,
        cursor: 'pointer',
        margin: 'auto',
    },
}));

function MessagesComponent(props) {
    const classes = useStyles(); //Custom classes.
    const history = useHistory(); //Manipulate window location
    const [threads, setThreads] = useState([]);//Variable and setter for the list of threads. 
    const [openDialog, setOpenDialog] = useState(false); //Variable and setter for the compose message dialog
    const [users, setUsers] = useState([]); //Variable and setter for each user to search.
    const [msgTarget, setMsgTarget] = useState(null); //Variable and setter for the GeoUser we want to send a message to
    const [msg, setMsg] = useState(''); //Variable and setter for a DM message we want to send to the user.
    const [msgSending, setMsgSending] = useState(false); //Variable and setter to trigger when a message is sending

    useEffect(() => {
        if(props.user === null) {
            swal(
                'Uh Oh!',
                'You must be logged in to access messages!',
                'error',
            );

            history.push('/');
        }
        else {
            //Grab threads and all GeoUsers.
            return axios({
                method: 'GET',
                url: `http://192.168.0.17:3001/api/get/threads/${props.user.uniqueUserId}`,
            }).then(response => {
                props.dispatch({type: 'user/updateUser', payload: response.data.user});
                props.dispatch({type: 'ThemeChange', payload: response.data.user.profileTheme});
                setUsers(response.data.users);
                //Create an if condition to only set thread if there are any for the user. 
                if(response.data.threads) {
                    //setThreads(response.data.threads);
                    //setThreads(elements => [...elements, response.data.threads]);
                    setThreads([...response.data.threads]);
                }
            }).catch(err => {
                console.log(err.message);
                swal(
                    'Uh Oh!',
                    'There was an error retreiving your message threads',
                    'error',
                );
                history.goBack(1);
            });
        }
    }, []);

    function sendMsg() {
        //This function will be responsible for sending a message to the server. 
        setMsgSending(true);

        if(msg.trim().length < 1) {
            swal(
                'Uh Oh!',
                'You must enter a message to send!',
                'error',
            );
            setMsgSending(false);
            return false;
        }
        else if(msgTarget === null) {
            swal(
                'Uh Oh!',
                'You must select a user to send a message to!',
                'error',
            );
            setMsgSending(false);
            return false;
        }
        else {
            let months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'];
            const date = new Date();
            const month = months[date.getMonth()];
            const day = date.getDate();
            const year = date.getFullYear();

            let data = JSON.stringify({
                senderUniqueUserId: props.user.uniqueUserId,
                receiverUniqueUserId: msgTarget.uniqueUserId,
                senderUsername: props.user.username,
                receiverUsername: msgTarget.username,
                msg: msg,
                dateString: `${month} ${day}, ${year}`,
                utcTime: Date.now(),
                uniqueMessageId: Date.now() + props.user.uniqueUserId + Date.now() + msgTarget.uniqueUserId,
                freshMsg: true,
                targetThread: '',
            });

            return axios({
                method: 'POST',
                url: 'http://192.168.0.17:3001/api/add/dm',
                data: data,
                headers: {
                    'Content-Type': 'application/json',
                },
            }).then(response => {
                swal(
                    'Great!',
                    'You successfully sent that message!',
                    'success',
                );
                //setThreads(response.data.threads);
                setThreads([...response.data.threads]);
                console.log(response.data.threads);
                setUsers(response.data.users);
                setMsgTarget(null);
                setMsg(null);
                setOpenDialog(false);
                setMsgSending(false);
            }).catch(err => {
                console.log(err.message);
                swal(
                    'Uh Oh!',
                    'There was an error sending that message! Please try again.',
                    'error',
                );
                setMsgSending(false);
            });
        }
    }

    function findId(firstId, secondId) {
        //This function will return the userId of the user who is not the "mainUser"
        if(firstId === props.user.uniqueUserId) {
            return secondId;
        }
        else {
            return firstId;
        }
    }

    function findUsername(firstUsername, secondUsername) {
        //This function will return the username that does not match the mainUser username.
        if(props.user.username === firstUsername) {
            return secondUsername;
        }
        else {
            return firstUsername;
        }
    }

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

    if(props.user !== null) {
        return(
            <Grid 
                container   
                className={classes.topGrid} 
            >
                <Grid 
                    xs={12} 
                    item 
                >
                    <Typography 
                        variant='h4'
                        component='h4'
                        align='center' 
                    >
                        {threads.length > 0 ? 'Messages' : 'No messages'}
                    </Typography>
                </Grid>
                <Grid 
                    item
                    xs={12} 
                    className={classes.topMarg}
                >
                    <Button 
                        color='primary' 
                        variant='contained' 
                        onClick={e => setOpenDialog(!openDialog)}
                    >
                        Compose +
                    </Button>
                    <Dialog 
                        open={openDialog} 
                        fullScreen
                    >
                        <DialogContent>
                            <AppBar 
                                color='primary'
                            >
                                <Icon 
                                    path={mdiClose} 
                                    size={1} 
                                    aria-label='Close dialog' 
                                    title='Close' 
                                    onClick={e => setOpenDialog(false)}
                                    style={{
                                        cursor: 'pointer',
                                        color: 'rgb(255, 255, 255)'
                                    }}
                                />
                                <Typography 
                                    variant='h4' 
                                    component='h4' 
                                    style={{
                                        margin: 'auto',
                                        color: 'rgb(255, 255, 255)',
                                    }}
                                >
                                    Create message
                                </Typography>
                            </AppBar>
                            <Grid 
                                item 
                                xs={12} 
                                style={{
                                    marginTop: 100,
                                }}
                            >
                                <Autocomplete 
                                    value={msgTarget}
                                    filterOptions={userFilterOptions}
                                    options={users}
                                    getOptionLabel={option => option.firstName + ' ' + option.lastName}
                                    renderOption={option => (
                                        <ListItem 
                                            alignItems='flex-start' 
                                            onClick={() => setMsgTarget(option)}
                                        >
                                            <ListItemAvatar>
                                                <Avatar 
                                                    src={`http://192.168.0.17:3001/api/get-photo/${option.avatar}`}
                                                    alt={`${option.username}`}
                                                    title={`${option.username}`} 
                                                />
                                            </ListItemAvatar>
                                            <ListItemText 
                                                primary={
                                                    <Typography 
                                                        variant='h6' 
                                                        component='h6' 
                                                    >
                                                        {option.username}
                                                    </Typography>
                                                }
                                                secondary={
                                                    <Typography 
                                                        component='small'
                                                        color='textSecondary' 
                                                    >
                                                        {option.firstName} {option.lastName}
                                                    </Typography>
                                                }
                                            />
                                        </ListItem>
                                    )}
                                    renderInput={params => (
                                        <TextField 
                                            {...params} 
                                            color='primary'
                                            variant='outlined' 
                                            label='Search users' 
                                            placeholder='To'
                                            helperText='Select a user to send a message to'
                                            InputLabelProps={{
                                                shrink: true,
                                            }}
                                            fullWidth 
                                            required 
                                        />
                                    )}
                                />
                            </Grid>
                            <Grid 
                                item 
                                xs={12} 
                                style={{
                                    marginTop: 20,
                                }}
                            >
                                <TextField 
                                    value={msg} 
                                    onChange={e => setMsg(e.target.value)}
                                    label='Enter message' 
                                    placeholder="What's on your mind?"
                                    helperText='Enter a message to send to a user' 
                                    inputLabelProps={{
                                        shrink: true,
                                    }}
                                    rows={4} 
                                    variant='outlined'
                                    fullWidth 
                                    multiline
                                />
                                <Button 
                                    style={{
                                        marginTop: 40,
                                    }}
                                    color='primary' 
                                    variant='contained' 
                                    disabled={msgSending}
                                    onClick={sendMsg}
                                    fullWidth
                                >
                                    {msgSending ? <CircularProgress /> : 'Send'}
                                </Button>
                            </Grid>
                        </DialogContent>
                    </Dialog>
                </Grid>
                {/* End of the Grid with the Button and Dialog inside. Now start Grid with messages threads */}
                <Grid 
                    style={{
                        marginTop: 30,
                        textAlign: 'center',
                    }}
                    item 
                    xs={12} 
                >
                    {threads.length > 0 &&
                        <div>
                            {threads.map((thread, index) => (
                                <Paper 
                                    key={index.toString()}
                                    elevation={3} 
                                    style={{
                                        marginBottom: index < threads.length - 1 ? 20 : 0,
                                    }}
                                    className={classes.paper}
                                    onClick={e => history.push(`/thread/${thread.uniqueThreadId}`)}
                                >
                                    <ListItem 
                                        alignItems='flex-start' 
                                    >
                                        <ListItemAvatar>
                                            <Avatar 
                                                src={`http://192.168.0.17:3001/api/get/avatar/by/id/${findId(thread.uniqueUserIds[0], thread.uniqueUserIds[1])}`}
                                                alt='Geo User' 
                                                title='User avatar' 
                                            />
                                        </ListItemAvatar>
                                        <ListItemText 
                                            primary={
                                                <div>
                                                    <Typography 
                                                        variant='h6' 
                                                        component='h6' 
                                                    >
                                                        {findUsername(thread.usernames[0], thread.usernames[1])}
                                                    </Typography>
                                                    <Typography 
                                                        variant='subtitle2' 
                                                        component='span' 
                                                        color='textSecondary' 
                                                    >
                                                        {timeDifference(thread.messages[thread.messages.length - 1].utcTime, thread.messages[thread.messages.length - 1].dateString)}
                                                    </Typography>
                                                </div>
                                            }
                                            secondary={
                                                <Grid 
                                                    item 
                                                    zeroMinWidth 
                                                >
                                                    <Typography 
                                                        variant='body1' 
                                                        component='p' 
                                                        color='default'
                                                        noWrap 
                                                    >
                                                        {thread.messages[thread.messages.length - 1].msg}
                                                    </Typography>
                                                </Grid>
                                            }
                                        />
                                    </ListItem>
                                </Paper>
                            ))}
                        </div>
                    }
                </Grid>
            </Grid>
        );
    }
    else {
        return(
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

export default connect(mapStateToProps)(MessagesComponent);