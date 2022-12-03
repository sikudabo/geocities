import React, { useState, useEffect, useRef } from 'react';
import Grid from '@material-ui/core/Grid';
import Avatar from '@material-ui/core/Avatar';
import Typography from '@material-ui/core/Typography';
import { connect } from 'react-redux';
import axios from 'axios';
import { useHistory } from 'react-router-dom';
import swal from 'sweetalert';
import { makeStyles } from '@material-ui/core/styles';
import Hidden from '@material-ui/core/Hidden';
import Box from '@material-ui/core/Box';
import Icon from '@mdi/react';
import { mdiCheckBold, mdiPencil, mdiClose, mdiCamera, mdiVideo, mdiTwitter, mdiInstagram, mdiYoutube } from '@mdi/js';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import AppBar from '@material-ui/core/AppBar';
import Paper from '@material-ui/core/Paper';
import Tab from '@material-ui/core/Tab';
import Tabs from '@material-ui/core/Tabs';
import PropTypes from 'prop-types';
import TextField from '@material-ui/core/TextField';
import Backdrop from '@material-ui/core/Backdrop';
import CircularProgress from '@material-ui/core/CircularProgress';
import UserPostsCard from './UserPostsCard';
import Resizer from 'react-image-file-resizer';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Divider from '@material-ui/core/Divider';
import Link from '@material-ui/core/Link';
import UserEventsCard from './UserEventsCard';

function TabPanel(props) {
    //This component will serve as the panel for each individual tab
    const { children, value, index, ...other } = props;

    return (
        <div 
            hidden={value !== index}
            role='tabpanel' 
            id={`tabpanel-${index}`}
            aria-label={`tab-${index}`}
            aria-labelledby={`tab-${index}`}
            {...other}
            style={{
                marginTop: 100,
            }}
        >
            {value === index && 
                <Grid 
                    item 
                    xs={12} 
                    style={{
                        textAlign: 'center',
                    }}
                >
                    {children}
                </Grid>
            }
        </div>
    );
}

TabPanel.propTypes = {
    children: PropTypes.node,
    value: PropTypes.any.isRequired,
    index: PropTypes.any.isRequired,
};

function a11yProps(index) {
    return {
        id: `tab-${index}`,
        'aria-controls': `tabpanel-${index}`,
    };
}



function ProfilePage(props) {
    const history = useHistory(); //The history API to access the brower history. 
    if(props.user === null) {
        history.push('/');
    }
    const useStyles = makeStyles((theme) => ({
        root: {
            marginTop: 100,
        },
        profileAvatar: {
            height: 128,
            width: 128,
            margin: 'auto',
        },
        profileAvatarLg: {
            height: 168,
            width: 168,
            margin: 'auto',
        },
        usernameDisplay: {
            marginTop: 40,
            margin: 'auto',
        },
        statsInfo: {
            marginTop: 40,
            textAlign: 'center',
        },
        paper: {
            backgroundColor: props.user ? props.user.profileTheme : 'rgb(0, 20, 60)',
            color: 'rgb(255, 255, 255)',
            marginTop: 40,
        },
        input: {
            display: 'none',
        },
    }));
    const classes = useStyles(); //Custom styling.
    const [openDialog, setOpenDialog] = useState(false); //Variable and setter to open and close dialog.
    const [curTab, setTab] = useState(0); //Variable and setter to control proper tab.
    const [curTab2, setTab2] = useState(0);
    const [textPost, setTextPost] = useState(''); //Variable and setter for text post control
    const [posting, setPosting] = useState(false); //Hides dialog AppBar and tabs when a post is posting to the server
    const [posts, setPosts] = useState([]); //Personal profile posts for the user. 
    const [uploadPhoto, setUploadPhoto] = useState(null); // Variable and setter for a photo to be uploaded
    const [photoUploading, setPhotoUploading] = useState(null); //Variable and setter to disable button while photo is uploading.
    const [photoCaption, setPhotoCaption] = useState(''); //Variable and setter for a caption associated with a photo upload.
    const [uploadVideo, setUploadVideo] = useState(null); //Variable and setter for a video to be uploaded 
    const [videoUploading, setVideoUploading] = useState(null); //Variable and setter to disable button while video is uploading. 
    const [videoCaption, setVideoCaption] = useState(null); //Variable and setter for the caption for a video post. 
    const [user, setUser] = useState(props.user);
    const [communities, setCommunities] = useState([]); //This will be an array of communities a user belongs to.
    const [events, setEvents] = useState([]); //Events the user has created
    useEffect(() => {
        //First, if the user doesn't exist in state, re-route to the login page.
        if(props.user === null) {
            history.push('/');
            return;
        }
        else if(props.user) {
            //Else, we make an axios call to request the user (an updated version of the user)
            //props.dispatch({type: 'ThemeChange', payload: props.user.profileTheme});
            return axios({
                method: 'GET',
                url: `https://www.geocities.cc/api/grab/user/${props.user.uniqueUserId}`,
            }).then(response => {
                if(response.data.user) {
                    props.dispatch({type: 'user/updateUser', payload: response.data.user});
                    props.dispatch({type: 'ThemeChange', payload: response.data.user.profileTheme});
                    props.dispatch({type: 'userPosts/updatePosts', payload: response.data.posts});
                    setCommunities(response.data.communities);
                    setEvents(response.data.events);
                }
                else if(response.data === 'user not found') {
                    swal(
                        'Uh Oh!',
                        'We could not find your profile!',
                        'error',
                    );
                    history.push('/');
                }
            }).catch(err => {
                console.log(err.message);
                swal(
                    'Uh Oh!',
                    'There was an error retreiving your profile. Please try again!',
                    'error',
                );
                history.push('/');
            });
        }
    }, []);

    useEffect(() => {
        //If the user is ever null, get back to the log in page. 
        if(user === null) {
            history.push('/');
        }
    }, [user]);

    function handleTextPost() {
        //Function that handles submitting a text post to the server. 
        setPosting(true);
        if(!textPost) {
            swal(
                'Uh Oh!',
                'You must enter some text',
                'error',
            );

            setPosting(false);
        }
        else {
            let months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'];
            let date = new Date();
            let year = date.getFullYear();
            let month = months[date.getMonth()];
            let day = date.getDate();

            let data = JSON.stringify({
                uniquePostId: Date.now() + props.user.uniqueUserId + props.user.username,
                uniqueUserId: props.user.uniqueUserId,
                username: props.user.username,
                type: 'text', 
                context: 'personal',
                text: textPost,
                dateString: `${month} ${day}, ${year}`,
                link: '',
                title: '',
                community: '',
                caption: '',
                src: '',
                privacy: props.user.profilePrivacy,
            });

            return axios({
                method: 'POST',
                url: 'https://www.geocities.cc/api/upload/text/link/post',
                data: data,
                headers: {
                    'Content-Type': 'application/json',
                },
            }).then(response => {
                if(response.data.posts) {
                    swal(
                        'Great!',
                        'Post was successfully uploaded!',
                        'success',
                    );
                    setPosting(false);
                    setTextPost('');
                    setOpenDialog(false);
                    console.log(response.data.posts);
                    //setPosts(posts => [response.data.posts[0], ...posts]);
                    //Maybe altering the code to just push a new value to the array will work?
                    props.dispatch({type: 'userPosts/updatePosts', payload: response.data.posts});
                }
                else {
                    swal(
                        'Uh Oh!',
                        'There was an error uploading that post! Please try again.',
                        'error',
                    )
                    setPosting(false);
                }
            }).catch(err => {
                console.log(err.message);
                swal(
                    'Uh Oh!',
                    'There was an error uploading that post! Please try again.',
                    'error',
                );
                setPosting(false);
            });
        }
    }

    function resizerFunction(file) {
        //This is a wrapper for the file resizer 
        return new Promise(resolve => {
            Resizer.imageFileResizer(
                file,
                600,
                600,
                'JPEG',
                100,
                0,
                uri => {
                    resolve(uri);
                },
                'blob',
            );
        });
    }

    async function handlePhotoChange(e) {
        let file = e.target.files[0];
        let resizedPhoto = await resizerFunction(file);
        setUploadPhoto(resizedPhoto);
    }

    function handlePhotoUpload() {
        //Function that will handle sending an uploaded photo to the server after resizing it.
        setPhotoUploading(true);

        if(!uploadPhoto) {
            swal(
                'Uh Oh!',
                'You must select a photo to upload!',
                'error',
            );
            setPhotoUploading(false);
        }
        else {
            let data = new Date();
            let months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'];
            let month = months[data.getMonth()];
            let day = data.getDate();
            let year = data.getFullYear();
            let dateString = `${month} ${day}, ${year}`;
            let fd = new FormData();
            fd.append('photo', uploadPhoto, 'photo.jpg');
            fd.append('caption', photoCaption);
            fd.append('uniqueUserId', props.user.uniqueUserId);
            fd.append('uniquePostId', Date.now() + props.user.username + 'photoupload' + props.user.uniqueUserId);
            fd.append('username', props.user.username);
            fd.append('dateString', dateString);
            fd.append('type', 'photo');
            fd.append('context', 'personal');
            fd.append('link', `https://www.geocities.cc/profile#${Date.now()}${props.user.username}photoupload${props.user.uniqueUserId}`);
            fd.append('community', '');
            fd.append('title', '');
            fd.append('privacy', props.user.profilePrivacy);
            fd.append('text', '');

            return axios({
                method: 'POST',
                url: 'https://www.geocities.cc/api/upload/photo',
                data: fd,
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            }).then(response => {
                if(response.data.posts) {
                    props.dispatch({type: 'userPosts/updatePosts', payload: response.data.posts});
                    swal(
                        'Great!',
                        'Successfully uploaded photo!',
                        'success',
                    );
                    setPhotoCaption('');
                    setUploadPhoto(null);
                    setOpenDialog(false);
                    setPhotoUploading(false);
                }
                else {
                    swal(
                        'Uh Oh!',
                        'There was an error uploading that photo!',
                        'error',
                    );
                    setPhotoUploading(false);
                }
            }).catch(err => {
                console.log(err.message);
                swal(
                    'Uh Oh!',
                    'There was an error uploading that photo!',
                    'error',
                );
                setPhotoUploading(false);
            });
        }
    }

    function handleVideoChange(e) {
        //This function will handle setting the uploadVideo variable to the valua of the file. 
        setUploadVideo(e.target.files[0]);
    }

    function handleVideoUpload() {
        //Function that will handle sending an uploaded video to the server.
        setVideoUploading(true);

        if(!uploadVideo) {
            swal(
                'Uh Oh!',
                'You must select a video to upload!',
                'error',
            );
            setVideoUploading(false);
        }
        else {
            let data = new Date();
            let months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'];
            let month = months[data.getMonth()];
            let day = data.getDate();
            let year = data.getFullYear();
            let dateString = `${month} ${day}, ${year}`;
            let ext = uploadVideo.name.split('.').pop().toString(); //This will get the extension name of the video 
            ext = 'video.' + ext;
            let fd = new FormData();
            fd.append('photo', uploadVideo, ext); //Keep the name "photo" for the server upload although it is technically a video!
            fd.append('caption', videoCaption);
            fd.append('uniqueUserId', props.user.uniqueUserId);
            fd.append('uniquePostId', Date.now() + props.user.username + 'videoupload' + props.user.uniqueUserId);
            fd.append('username', props.user.username);
            fd.append('dateString', dateString);
            fd.append('type', 'video');
            fd.append('context', 'personal');
            fd.append('link', `https://www.geocities.cc/profile#${Date.now()}${props.user.username}videoupload${props.user.uniqueUserId}`);
            fd.append('community', '');
            fd.append('title', '');
            fd.append('privacy', props.user.profilePrivacy);
            fd.append('text', '');

            return axios({
                method: 'POST',
                url: 'https://www.geocities.cc/api/upload/photo',
                data: fd,
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            }).then(response => {
                if(response.data.posts) {
                    props.dispatch({type: 'userPosts/updatePosts', payload: response.data.posts});
                    swal(
                        'Great!',
                        'Successfully uploaded video!',
                        'success',
                    );
                    setVideoCaption('');
                    setUploadVideo(null);
                    setOpenDialog(false);
                    setVideoUploading(false);
                }
                else {
                    swal(
                        'Uh Oh!',
                        'There was an error uploading that video!',
                        'error',
                    );
                    setVideoUploading(false);
                }
            }).catch(err => {
                console.log(err.message);
                swal(
                    'Uh Oh!',
                    'There was an error uploading that video!',
                    'error',
                );
                setVideoUploading(false);
            });
        }
    }

    function findFollowers() {
        //This function will enable us to go to a page and find all of a users followers. 
        history.push('/followers');
    }

    function findFollowing() {
        //This function will enable us to go to a page and find all users a user is following. 
        history.push('/following');
    }

    if(props.user) {
        return (
            <Grid 
                className={classes.root}
                container 
            >
                <Grid 
                    item 
                    container 
                    xs={12}
                >
                    <Grid 
                        item 
                        xs={12}
                    >
                        {/* Below is the avatar for xs and sm screens at 128x128 pixels */}
                        <Hidden 
                            mdUp 
                        >
                            <Avatar 
                                className={classes.profileAvatar} 
                                src={`https://www.geocities.cc/api/get-photo/${props.user.avatar}`} 
                                title={`${props.user.username}`} 
                                alt={`${props.user.username}`} 
                            />
                        </Hidden>
                        {/* Below will be the avatar for medium screen and up devices */ }
                        <Hidden 
                            smDown 
                        >
                            <Avatar 
                                className={classes.profileAvatarLg}
                                src={`https://www.geocities.cc/api/get-photo/${props.user.avatar}`} 
                                title={`${props.user.username}`} 
                                alt={`${props.user.username}`} 
                            />
                        </Hidden>
                    </Grid>
                </Grid>
                <Grid 
                    item 
                    xs={12} 
                >
                    <Typography 
                        variant='h4' 
                        component='h4' 
                        align='center'
                        className={classes.usernameDisplay} 
                    >
                        {props.user.username}
                    </Typography>
                    {props.user.isVerified &&
                        <Typography 
                            variant='body1'
                            component='p' 
                            style={{
                                margin: 'auto',
                                textAlign:'center',
                                marginTop: 10,
                            }}
                        >
                            <Icon 
                                path={mdiCheckBold} 
                                size={1} 
                                title='Verified' 
                                style={{
                                    color: 'rgb(0, 128, 0)'
                                }}
                            /> Verified 
                        </Typography>
                    }
                </Grid>
                {/* Below will be the Grid to display Followers, Following, and Karma */}
                <Grid 
                    item 
                    container 
                    xs={12} 
                    spacing={1}
                    className={classes.statsInfo}
                >
                    <Grid 
                        item 
                        xs={4} 
                        style={{
                            cursor: 'pointer',
                        }}
                        onClick={props.user.followers.length > 0 ? findFollowers: e => console.log('No Followers')}
                    >
                        <Typography 
                            variant='h6' 
                            component='h6' 
                        >
                            Followers 
                        </Typography>
                        <Typography 
                            variant='body1' 
                            component='p'
                        >
                            {props.user.followers.length}
                        </Typography>
                    </Grid>
                    <Grid 
                        item 
                        xs={4} 
                        style={{
                            cursor: 'pointer'
                        }}
                        onClick={props.user.following.length > 0 ? findFollowing : e => console.log('Not following any users')}
                    >
                        <Typography 
                            variant='h6' 
                            component='h6' 
                        >
                            Following 
                        </Typography>
                        <Typography 
                            variant='body1' 
                            component='p' 
                        >
                            {props.user.following.length}
                        </Typography>
                    </Grid>
                    <Grid 
                        item 
                        xs={4} 
                    >
                        <Typography 
                            variant='h6' 
                            component='h6' 
                        >
                            Karma 
                        </Typography>
                        <Typography 
                            variant='body1' 
                            component='p' 
                        >
                            {props.user.karma}
                        </Typography>
                    </Grid>
                </Grid>
                {/* End of the Grid for Followers, Following, and Karma */}
                {/* Below is the Grid to display the users' first and last name */}
                <Grid 
                    item 
                    xs={12} 
                    style={{
                        textAlign: 'center',
                    }}
                >
                    <Typography 
                        variant='body1' 
                        component='p' 
                        style={{
                            fontWeight: 'bold',
                            marginTop: 30,
                        }}
                    >
                        {props.user.firstName} {props.user.lastName}
                    </Typography>
                </Grid>
                {/* End of the Grid to display the users first and last name */}
                {/* Below is the Grid that stores the users BIO */}
                <Grid 
                    item 
                    xs={12} 
                    style={{
                        marginTop: 40,
                        textAlign: 'center',
                    }}
                >
                    <Typography 
                        variant='body2' 
                        component='small' 
                        justify='left'
                        align='left'
                    >
                        {props.user.bio}
                    </Typography>
                </Grid>
                {/* This is the end of the Grid for the bio.*/ }
                {/* Below is the grid to display the Button that opens the Dialog for the form for posts */}
                <Grid 
                    item 
                    xs={12}
                    style={{
                        textAlign: 'center',
                        marginTop: 40,
                    }}
                >
                    <Button 
                        color='primary' 
                        variant='outlined'  
                        size='large'
                        onClick={() => setOpenDialog(true)}
                        startIcon={
                            <Icon 
                                path={mdiPencil} 
                                size={1} 
                                title='Post Icon' 
                            />
                        }
                    >
                        Post 
                    </Button>
                </Grid>
                {/* The Grid below will store the Dialog and its' content */}
                <Grid 
                    item 
                    xs={12} 
                >
                    <Dialog 
                        open={openDialog} 
                        fullScreen
                    >
                        <DialogContent>
                            <AppBar 
                                color='primary'
                                hidden={posting}
                            >
                                <Icon 
                                    path={mdiClose} 
                                    size={1} 
                                    title='Dialog close' 
                                    style={{
                                        cursor: 'pointer'
                                    }}
                                    onClick={() => setOpenDialog(false)}
                                />
                                <Tabs 
                                    value={curTab}
                                    onChange={(e, newVal) => setTab(newVal)} 
                                    centered
                                >
                                    <Tab 
                                        {...a11yProps(0)} 
                                        label='Text' 
                                        disabled={posting}
                                    />
                                    <Tab 
                                        {...a11yProps(1)} 
                                        label='Photo' 
                                        disabled={posting}
                                    />
                                    <Tab 
                                        {...a11yProps(2)}
                                        label='Video' 
                                        disabled={posting}
                                    />
                                </Tabs>
                            </AppBar>
                            <TabPanel 
                                index={0}
                                value={curTab}
                            >
                                <TextField 
                                    label='Text Post' 
                                    placeholder='Post a status!' 
                                    color='primary'
                                    variant='outlined' 
                                    InputLabelProps={{
                                        shrink: true,
                                    }}
                                    aria-label='Text Post Field' 
                                    rows={4} 
                                    onChange={e => setTextPost(e.target.value)}
                                    value={textPost} 
                                    helperText='Enter a status update!' 
                                    multiline
                                    fullWidth 
                                    disabled={posting}
                                />
                                <Button 
                                    style={{
                                        marginTop: 20,
                                    }}
                                    color='primary' 
                                    variant='outlined' 
                                    disabled={posting}
                                    onClick={handleTextPost}
                                >
                                    {posting ? <CircularProgress /> : 'post'}
                                </Button>
                            </TabPanel>
                            <TabPanel 
                                index={1} 
                                value={curTab} 
                            >
                                <Typography 
                                    variant='h6' 
                                    component='h6' 
                                >
                                    Post a photo
                                </Typography>
                                <label 
                                    html-for='photoPost' 
                                >
                                    <input 
                                        className={classes.input}
                                        type='file'
                                        accept='image/jpg, image/jpeg, image/png' 
                                        id='photoPost'
                                        name='photoPost' 
                                        onChange={handlePhotoChange} 
                                        required 
                                    />
                                    <Button 
                                        variant='contained' 
                                        color='primary' 
                                        component='span' 
                                        aria-label='Photo picker button'
                                    >
                                        <Icon 
                                            path={mdiCamera} 
                                            size={1} 
                                            title='Photo upload icon' 
                                            aria-label='Photo upload icon' 
                                        />
                                    </Button>
                                </label>
                                <br/>
                                <TextField 
                                    label='Caption'
                                    placeholder='Enter a caption for your photo' 
                                    variant='outlined' 
                                    color='primary' 
                                    value={photoCaption} 
                                    onChange={e => setPhotoCaption(e.target.value)} 
                                    InputLabelProps={{
                                        shrink: true,
                                    }}
                                    rows={4}
                                    multiline
                                    required
                                    style={{
                                        marginTop: 40,
                                    }}
                                    fullWidth
                                />
                                <br/>
                                <Button 
                                    style={{
                                        marginTop: 30,
                                    }}
                                    color='primary' 
                                    variant='outlined' 
                                    onClick={handlePhotoUpload}
                                    disabled={photoUploading}
                                >
                                    {photoUploading ? <CircularProgress color='primary' /> : 'Upload Photo'}
                                </Button>
                            </TabPanel>
                            <TabPanel 
                                index={2} 
                                value={curTab} 
                            >
                                <Typography 
                                    variant='h6' 
                                    component='h6' 
                                >
                                    Post a video
                                </Typography>
                                <label 
                                    html-for='videoPost' 
                                >
                                    <input 
                                        className={classes.input}
                                        type='file'
                                        accept='video/mp4, video/mov'
                                        id='videoPost'
                                        name='videoPost' 
                                        onChange={handleVideoChange} 
                                        required 
                                    />
                                    <Button 
                                        variant='contained' 
                                        color='primary' 
                                        component='span' 
                                        aria-label='Video picker button'
                                    >
                                        <Icon 
                                            path={mdiVideo} 
                                            size={1} 
                                            title='Video upload icon' 
                                            aria-label='Video upload icon' 
                                        />
                                    </Button>
                                </label>
                                <br/>
                                <TextField 
                                    label='Caption'
                                    placeholder='Enter a caption for your video' 
                                    variant='outlined' 
                                    color='primary' 
                                    value={videoCaption} 
                                    onChange={e => setVideoCaption(e.target.value)} 
                                    InputLabelProps={{
                                        shrink: true,
                                    }}
                                    rows={4}
                                    multiline
                                    required
                                    style={{
                                        marginTop: 40,
                                    }}
                                    fullWidth
                                />
                                <br/>
                                <Button 
                                    style={{
                                        marginTop: 30,
                                    }}
                                    color='primary' 
                                    variant='outlined' 
                                    onClick={handleVideoUpload}
                                    disabled={videoUploading}
                                >
                                    {videoUploading ? <CircularProgress color='primary' /> : 'Upload Video'}
                                </Button>
                            </TabPanel>
                        </DialogContent>
                    </Dialog>
                </Grid>
                {/* Below will begin the tab panels for the posts, about, and events tabs */}
                <Grid 
                    item 
                    xs={12} 
                >
                    <Paper 
                        className={classes.paper}
                    >
                        <Tabs 
                            value={curTab2} 
                            onChange={(e, newVal) => setTab2(newVal)}
                            centered
                        >
                            <Tab 
                                label='Posts' 
                                {...a11yProps(0)} 
                            />
                            <Tab 
                                label='About' 
                                {...a11yProps(1)} 
                            />
                            <Tab 
                                label='Events' 
                                {...a11yProps(2)} 
                            />
                        </Tabs>
                    </Paper>
                    <Grid 
                        item 
                        xs={12}
                    />
                    <TabPanel 
                        value={0} 
                        index={curTab2} 
                    >
                        {props.posts.length < 1 && 
                            <Typography 
                                variant='h6' 
                                component='h6' 
                                align='center' 
                            >
                                No posts 
                            </Typography>
                        }
                        {props.posts.length > 0 && 
                            <div>
                                {props.posts.map((post, index) => (
                                    <div 
                                        style={{
                                            textAlign: 'left',
                                        }}
                                        key={index}
                                    >
                                        <UserPostsCard 
                                            user={props.user} 
                                            post={post}
                                            id={post.uniquePostId}
                                        />
                                        {index < props.posts.length - 1 &&
                                            <div 
                                                style={{
                                                    marginBottom: 20,
                                                }}
                                            />
                                        }
                                    </div>
                                ))}
                            </div>
                        }
                    </TabPanel>
                    {/*End of the TabPanel for posts. Begin the TabPanel for the "about" section of the page */}
                    <TabPanel 
                        value={1} 
                        index={curTab2} 
                    >
                        <Grid 
                            item 
                            xs={12} 
                        >
                            <Typography 
                                variant='h4' 
                                component='h4' 
                                align='center' 
                            >
                                About {props.user.firstName}
                            </Typography>
                            <List 
                                style={{
                                    margin: 'auto',
                                    maxWidth: 450,
                                    marginTop: 20,
                                }}
                            >
                                <ListItem 
                                    alignItems='center' 
                                >
                                    <ListItemText 
                                        primary={
                                            <Typography 
                                                variant='h6' 
                                                component='h6' 
                                                align='center'
                                            >
                                                Name 
                                            </Typography>
                                        }
                                        secondary={
                                            <Typography 
                                                variant='body1' 
                                                component='p' 
                                                align='center'
                                            >
                                                {props.user.firstName} {props.user.lastName}
                                            </Typography>
                                        }
                                    />
                                </ListItem>
                                <Divider />
                                <ListItem 
                                    alignItems='center' 
                                >
                                    <ListItemText 
                                        primary={
                                            <Typography 
                                                variant='h6' 
                                                component='h6' 
                                                align='center' 
                                            >
                                                Email
                                            </Typography>
                                        }
                                        secondary={
                                            <div
                                                style={{
                                                    textAlign: 'center'
                                                }}
                                            >
                                                <Link 
                                                    component='a'
                                                    color='primary' 
                                                    href={`mailto:${props.user.email}`}
                                                    style={{
                                                        textAlign: 'center',
                                                    }}
                                                >
                                                    {props.user.email}
                                                </Link>
                                            </div>
                                        }
                                    />
                                </ListItem>
                                <Divider />
                                <ListItem 
                                    alignItems='center' 
                                >
                                    <ListItemText 
                                        primary={
                                            <Typography 
                                                variant='h6' 
                                                component='h6' 
                                                align='center' 
                                            >
                                                Birthdate 
                                            </Typography>
                                        }
                                        secondary={
                                            <Typography 
                                                variant='body1' 
                                                component='p' 
                                                align='center' 
                                            >
                                                {props.user.birthdate}
                                            </Typography>
                                        }
                                    />
                                </ListItem>
                                <Divider />
                                <ListItem 
                                    alignItems='center' 
                                >
                                    <ListItemText 
                                        primary={
                                            <Typography 
                                                variant='h6' 
                                                component='h6' 
                                                align='center' 
                                            >
                                                Profile created on
                                            </Typography>
                                        }
                                        secondary={
                                            <Typography 
                                                variant='body1' 
                                                component='p' 
                                                align='center'
                                            >
                                                {new Date(props.user.dateCreated).getMonth() + 1}/{new Date(props.user.dateCreated).getDate()}/{new Date(props.user.dateCreated).getFullYear()}
                                            </Typography>
                                        }
                                    />
                                </ListItem>
                                <Divider />
                                <ListItem 
                                    alignItems='center' 
                                >
                                    <ListItemText 
                                        primary={
                                            <Typography 
                                                variant='h6' 
                                                component='h6' 
                                                align='center' 
                                            >
                                                Location
                                            </Typography>
                                        }
                                        secondary={
                                            <Typography 
                                                variant='body1' 
                                                component='p' 
                                                align='center' 
                                            >
                                                {props.user.city}, {props.user.userState}
                                            </Typography>
                                        }
                                    />
                                </ListItem>
                                <Divider />
                                <div>
                                    {props.user.college !== 'None' &&
                                        <ListItem 
                                            alignItems='center' 
                                        >
                                            <ListItemText 
                                                primary={
                                                    <Typography 
                                                        variant='h6' 
                                                        component='h6' 
                                                        align='center' 
                                                    >
                                                        College 
                                                    </Typography>
                                                }
                                                secondary={
                                                    <Typography 
                                                        variant='body1' 
                                                        component='p' 
                                                        align='center' 
                                                    >
                                                        {props.user.college}
                                                    </Typography>
                                                }
                                            />
                                        </ListItem>
                                    }
                                </div>
                                <Divider />
                                <Typography 
                                    variant='h6' 
                                    component='h6' 
                                    align='center' 
                                >
                                    Interests
                                </Typography>
                                <List>
                                    {props.user.interests.map((interest, index) => (
                                        <ListItem 
                                            alignItems='center' 
                                            key={index} 
                                        >
                                            <ListItemText 
                                                secondary={
                                                    <Typography 
                                                        variant='body1' 
                                                        component='p'
                                                        align='center' 
                                                    >
                                                        {interest}
                                                    </Typography>
                                                }
                                            />
                                        </ListItem>
                                    ))}
                                </List>
                                <Divider />
                                {communities.length > 0 &&
                                    <div>
                                        <Typography 
                                            variant='h6' 
                                            component='h6' 
                                        >
                                            Communities
                                        </Typography>
                                        {communities.map((community, index) => (
                                            <Paper
                                                elevation={3}
                                                key={index} 
                                                style={{
                                                    marginBottom: index < communities.length - 1 ? 20 : 0,
                                                    cursor: 'pointer',
                                                }}
                                                onClick={e => history.push(`/community/${community.name}`)}
                                            >
                                                <ListItem 
                                                    alignItems='flex-start' 
                                                >
                                                    <ListItemAvatar>
                                                        <Avatar 
                                                            src={`https://www.geocities.cc/api/get-photo/${community.avatar}`}
                                                            alt={`${community.name} avatar`}
                                                            title={`${community.name} avatar`}
                                                        />
                                                    </ListItemAvatar>
                                                    <ListItemText 
                                                        primary={
                                                            <Grid 
                                                                item
                                                                xs={12}
                                                                zeroMinWidth 
                                                            >
                                                                <Typography 
                                                                    variant='h6' 
                                                                    component='h6' 
                                                                    noWrap 
                                                                >
                                                                    {community.name}
                                                                </Typography>
                                                            </Grid>
                                                        }
                                                        secondary={
                                                            <Typography 
                                                                variant='body1' 
                                                                component='p' 
                                                            >
                                                                {community.title}
                                                            </Typography>
                                                        }
                                                    />
                                                </ListItem>
                                            </Paper>
                                        ))}
                                    </div>
                                }
                                <Divider />
                                <div
                                    style={{
                                        marginTop: 10,
                                    }}
                                >
                                    {props.user.twitterHandle &&
                                        <div>
                                            <ListItem 
                                                alignItems='start' 
                                            >
                                                <ListItemIcon>
                                                    <Icon 
                                                        path={mdiTwitter}
                                                        size={1} 
                                                        title={'Twitter handle'}
                                                        aria-label='Twitter handle icon' 
                                                    />
                                                </ListItemIcon>
                                                <ListItemText 
                                                    primary={
                                                        <Link 
                                                            component='a' 
                                                            href={`https://www.twitter.com/${props.user.twitterHandle}`}
                                                            color='primary' 
                                                            rel='external' 
                                                            title='Twitter handle'
                                                        >
                                                            {props.user.twitterHandle}
                                                        </Link>
                                                    }
                                                />
                                            </ListItem>
                                            <Divider />
                                        </div>
                                    }
                                </div>
                                {props.user.instaHandle &&
                                    <div>
                                        <ListItem 
                                            alignItems='start' 
                                        >
                                            <ListItemIcon>
                                                <Icon 
                                                    path={mdiInstagram} 
                                                    size={1} 
                                                    title='Instagram handle' 
                                                    aria-label='Instagram handle icon' 
                                                />
                                            </ListItemIcon>
                                            <ListItemText 
                                                primary={
                                                    <Link 
                                                        component='a' 
                                                        color='primary' 
                                                        href={`https://www.instagram.com/${props.user.instaHandle}`}
                                                        rel='external'
                                                        aria-label='Instagram profile link' 
                                                    >
                                                        {props.user.instaHandle}
                                                    </Link>
                                                }
                                            />
                                        </ListItem>
                                        <Divider />
                                    </div>
                                }
                                {props.user.youtubeChannel &&
                                    <div>
                                        <ListItem 
                                            alignItems='center' 
                                        >
                                            <ListItemIcon>
                                                <Icon 
                                                    path={mdiYoutube} 
                                                    size={1}
                                                    title='Youtube channel' 
                                                    aria-label='Youtube channel icon'
                                                />
                                            </ListItemIcon>
                                            <ListItemText 
                                                primary={
                                                    <Link 
                                                        component='a' 
                                                        color='primary' 
                                                        href={props.user.youtubeChannel}
                                                        rel='external'
                                                        aria-label='Youtube channel link' 
                                                    >
                                                        Youtube link
                                                    </Link>
                                                }
                                            />
                                        </ListItem>
                                        <Divider />
                                    </div>
                                }
                            </List>
                        </Grid>
                    </TabPanel>
                    <TabPanel 
                        value={2} 
                        index={curTab2} 
                    >
                        {(events !== null && events.length < 1) &&
                            <Typography 
                                component='h6'
                                variant='h6' 
                                align='center' 
                            >
                                No events
                            </Typography>
                        }
                        {(events !== null && events.length > 0) &&
                            <div>
                                {events.map((event, index) => (
                                    <UserEventsCard 
                                        key={index.toString()}
                                        username={event.username}
                                        dateString={event.dateString}
                                        uniqueUserId={event.uniqueUserId}
                                        src={event.src}
                                        title={event.title}
                                        description={event.description}
                                        uniqueEventId={event.uniqueEventId} 
                                    />
                                ))}
                            </div>
                        }
                    </TabPanel>
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
        posts: state.userPostsReducer.posts,
    };
}

export default connect(mapStateToProps)(ProfilePage);