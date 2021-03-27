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

const userFilterOptions = createFilterOptions({
    matchFrom: 'any',
    stringify: option => option.firstName + ' ' + option.lastName + ' ' + option.username,
}); //Filter options to search for users to potentially block. 

const useStyles = makeStyles(() => ({
    topGrid: {
        marginTop: 100,
    },
    topMarg: {
        marginTop: 20,
        textAlign: 'center',
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
                url: `https://www.geocities.cc/api/get/threads/${props.user.uniqueUserId}`,
            }).then(response => {
                props.dispatch({type: 'user/updateUser', payload: response.data.user});
                props.dispatch({type: 'ThemeChange', payload: response.data.user.profileTheme});
                setUsers(response.data.users);
                setThreads(response.data.threads);
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
                url: 'https://www.geocities.cc/api/add/dm',
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
                setThreads(response.data.threads);
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
                        {threads ? 'Messages' : 'No messages'}
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
                                                    src={`https://www.geocities.cc/api/get-photo/${option.avatar}`}
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