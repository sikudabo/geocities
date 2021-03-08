import React, { useState, useEffect, useRef } from 'react';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Avatar from '@material-ui/core/Avatar';
import Backdrop from '@material-ui/core/Backdrop';
import CircularProgress from '@material-ui/core/CircularProgress';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Divider from '@material-ui/core/Divider';
import Button from '@material-ui/core/Button';
import axios from 'axios';
import swal from 'sweetalert';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Hidden from '@material-ui/core/Hidden';
import * as _ from 'underscore';
import { connect } from 'react-redux';
import { useHistory, useParams } from 'react-router-dom'; 
import { makeStyles } from '@material-ui/core/styles';
import IconButton from '@material-ui/core/IconButton';
import Icon from '@mdi/react';
import { mdiClose, mdiCamera, mdiVideo } from '@mdi/js';
import PropTypes from 'prop-types';
import { ValidatorForm, TextValidator } from 'react-material-ui-form-validator';
import CommunityPostsCard from './CommunityPostsCard';
import NonUserCommunityPostsCard from './NonUserCommunityPostsCard';
import Resizer from 'react-image-file-resizer';
import TextField from '@material-ui/core/TextField';
import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import ChevronDownIcon from '@material-ui/icons/ExpandMore';

function TabPanel(props) {
    //This component will serve as the panel for each individual tab.
    const { children, value, index, ...other } = props;

    return (
        <div 
            role='tabpanel'
            hidden={index !== value} 
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
                    xs
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
}

function a11yProps(index) {
    return {
        id: `tab-${index}`,
        'aria-controls': `tabpanel-${index}`,
    };
}


function Community(props) {
    const [community, setCommunity] = useState(null); //This variable and setter will manipulate community.
    const useStyles = makeStyles(() => ({
        root: {
            marginTop: 100,
        },
        centerContent: {
            margin: 'auto',
            textAlign: 'center',
        },
        nameGrid: {
            margin: 'auto',
            textAlign: 'center',
            marginTop: 20,
        },
        avatarLg: {
            height: 168,
            width: 168,
            margin: 'auto',
        },
        avatarSm: {
            height: 128,
            width: 128,
            margin: 'auto',
        },
        paper: {
            backgroundColor: community !== null ? community.communityTheme : 'rgb(0, 20, 60)',
        },
        closeIcon: {
            color: 'rgb(255, 255, 255)',
        },
        input: {
            display: 'none',
        },
    }));
    const classes = useStyles(); //Custom styles for the component. 
    const history = useHistory(); //Window history API.
    const params = useParams(); //Access url parameters. 
    const textFormRef = useRef(null); //Ref for validator form when we upload posts.
    const linkFormRef = useRef(null);
    const [joinSending, setJoinSending] = useState(false); //Will disable the button while we send a join or request join to the server.
    const [postDialog, setPostDialog] = useState(false); //Will open and close the dialog to make a post.
    const [curTab, setTab] = useState(0); //Sets the current tab in post upload dialog. 
    const [curTab2, setTab2] = useState(0); //For the second tab that displays posts, about (and settings if the user is not null and the uniqueUserId matches the mainUser, for moderation)
    const [textPost, setTextPost] = useState(''); //Value for text post. 
    const [textPostTitle, setTextPostTitle] = useState(''); //Value for title.
    const [photoPost, setPhotoPost] = useState(null); //Value for photo upload. 
    const [photoPostTitle, setPhotoPostTitle] = useState(''); //Value for photo post title. 
    const [videoPost, setVideoPost] = useState(null); //Value for video post. 
    const [videoPostTitle, setVideoPostTitle] = useState(''); //Video post title. 
    const [linkPost, setLinkPost] = useState(''); //Value for the link in a link post. 
    const [linkPostTitle, setLinkPostTitle] = useState(''); //Value for link post title. 
    const [posting, setPosting] = useState(false); //Will handle disabling buttons and bars when a post is being sent to the server.
    const [uploadPhoto, setUploadPhoto] = useState(null); //Will control any photo post photo that we upload to the server. 
    const [photoCaption, setPhotoCaption] = useState('');//Variable and setter for a caption for a photo upload. 
    const [photoUploading, setPhotoUploading] = useState(false); //Used to alter functionality when the photo post is being uploaded to the server. 
    const [uploadVideo, setUploadVideo] = useState(null); //Variable and setter for a video to be uploaded 
    const [videoUploading, setVideoUploading] = useState(null); //Variable and setter to disable button while video is uploading. 
    const [videoCaption, setVideoCaption] = useState(null); //Variable and setter for the caption for a video post. 
    const [postLink, setPostLink] = useState(''); //This variable will store the link post link. 
    const [editTitleText, setEditTitleText] = useState(''); //Variable and setter to change the community title in settings. 
    const [makingEdit, setMakingEdit] = useState(false); //Will disable buttons when we make an edit. 
    const regularExpressions = {
        urlRegex: /^(?:(?:(?:https?|ftp):)?\/\/)(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:[/?#]\S*)?$/i,
    }; //This will store the regular expressions to make sure link posts have valid url's. 


    useEffect(() => {
        //Add validation rules 
        ValidatorForm.addValidationRule('titleLength', v => {
            if(v.length > 75) {
                return false;
            }
            else {
                return true;
            }
        });

        //Rule for text or caption to be 3,000 characters or less. 
        ValidatorForm.addValidationRule('textLength', v => {
            if(v.length > 3000) {
                return false;
            }
            else {
                return true;
            }
        });

        //Validation rule to ensure textPost and linkPost are not empty. 
        ValidatorForm.addValidationRule('requiredText', v => {
            if(v.trim() === '') {
                return false;
            }
            else {
                return true;
            }
        });

        //Validation rule will ensure links are valid 
        ValidatorForm.addValidationRule('validLink', v => {
            if(!regularExpressions.urlRegex.test(v)) {
                return false;
            }
            else {
                return true;
            }
        });

        //First we need to fetch the community with axios. 
        if(true) {
            return axios({
                method: 'GET',
                url: `http://10.162.4.11:3001/api/fetch/community/${params.communityName}`,
            }).then(response => {
                if(response.data.community) {
                    setCommunity(response.data.community);
                    props.dispatch({type: 'ThemeChange', payload: response.data.community.communityTheme}); //Update the theme to match the community theme.
                    props.dispatch({type: 'visitorPosts/updatePosts', payload: response.data.posts}); //Update the posts to match what a visitor viewing these posts will see.
                    //Now determine if the mainUser is in the blockList, and re-route to the previous page if they are. 
                    if(props.mainUser !== null) {
                        if(_.find(response.data.community.blockList, person => person.uniqueUserId === props.mainUser.uniqueUserId)) {
                            swal(
                                'Uh Oh!',
                                'You are blocked from this community!',
                                'error',
                            );
                            history.goBack(1);
                        }
                    }
                }
                else {
                    swal(
                        'Uh Oh!',
                        'We could not find that community!',
                        'error',
                    );
                    history.goBack(1);
                }
            }).catch(err => {
                console.log(err.message);
                swal(
                    'Uh Oh!',
                    'There was an error finding that community! Please try again.',
                    'error',
                );
                history.goBack(1);
            });
        }
    }, []);

    function publicJoin() {
        //Function that will enable a member to join a public community. 
        let data = JSON.stringify({
            username: props.mainUser.username,
            uniqueUserId: props.mainUser.uniqueUserId,
            name: community.name,
        });

        return axios({
            method: 'POST',
            url: 'http://10.162.4.11:3001/api/public/join/community',
            data: data,
            headers: {
                'Content-Type': 'application/json',
            },
        }).then(response => {
            if(response.data.result === 'success') {
                swal(
                    'Great!',
                    'Successfully joined community!',
                    'success',
                );
                setJoinSending(false);
                setCommunity(response.data.community);
            }
            else {
                swal(
                    'Uh Oh!',
                    'There was an error with joining this community! Please try again',
                    'error',
                );
                setJoinSending(false);
            }
        }).catch(err => {
            console.log(err.message);
            swal(
                'Uh Oh!',
                'There was an error joining this community! Please try again',
                'error',
            );
            setJoinSending(false);
        });
    }

    function privateJoinRequest() {
        //This function will handle sending a join notification to the moderator. 
        setJoinSending(true);
        let data = JSON.stringify({
            uniqueUserId: props.mainUser.uniqueUserId,
            username: props.mainUser.username,
            moderatorUniqueUserId: community.moderator.uniqueUserId,
            name: community.name,
        });

        return axios({
            method: 'POST',
            url: 'http://10.162.4.11:3001/api/community/join/request',
            data: data,
            headers: {
                'Content-Type': 'application/json',
            },
        }).then(response => {
            if(response.data === 'duplicate') {
                swal(
                    'Uh Oh!',
                    'You have already sent a request to join this community!',
                    'error',
                );
                setJoinSending(false);
            }
            else {
                swal(
                    'Great!',
                    'Community join request sent!',
                    'success',
                );
                setJoinSending(false);
            }
        }).catch(err => {
            console.log(err.message);
            swal(
                'Uh Oh!',
                'There was an error sending a request to join this community! Please try again.',
                'error',
            );
            setJoinSending(false);
        });
    }

    async function sendTextPost() {
        //Function that will handle uploading a text post to the server. 
        setPosting(true); 
        let isValid = textFormRef.current.isFormValid();
        if(!isValid) {
            swal(
                'Uh Oh!',
                'Make sure the form is filled out properly',
                'error',
            );
            setPosting(false);
            return false;
        }
        else {
            let date = new Date();
            let months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'];
            let month = months[date.getMonth()];
            let day = date.getDate();
            let year = date.getFullYear();
            let dateString = `${month} ${day}, ${year}`;
            let data = JSON.stringify({
                text: textPost,
                title: textPostTitle,
                uniqueUserId: props.mainUser.uniqueUserId,
                username: props.mainUser.username,
                community: community.name,
                type: 'text',
                dateString: dateString,
                uniquePostId: Date.now() + props.mainUser.username + 'textpost' + 'info' + community.name,
                context: 'community',
                privacy: community.communityPrivacy,
                link: postLink ? postLink : '',
                textType: 'link',
            });

            return axios({
                method: 'post',
                url: 'http://10.162.4.11:3001/api/add/community/text/post',
                data: data,
                headers: {
                    'Content-Type': 'application/json',
                },
            }).then(response => {
                if(response.data.result === 'success') {
                    props.dispatch({type: 'visitorPosts/updatePosts', payload: response.data.posts});
                    swal(
                        'Great!',
                        'Successfully uploaded text post!',
                        'success',
                    );
                    setTextPost('');
                    setTextPostTitle('');
                    setPosting(false);
                    setPostDialog(false);
                }
                else {
                    swal(
                        'Uh Oh!',
                        'There was an error sending that text post!',
                        'error',
                    );
                    setPosting(false);
                }
            }).catch(err => {
                console.log(err.message);
                swal(
                    'Uh Oh!',
                    'There was an error sending that text post! Please try again.',
                    'error',
                );
                setPosting(false);
            });
        }
    }

    function sendLinkPost() {
        //This function will handle sending a post with a link URL to the server.
        setPosting(true); 
        let isValid = linkFormRef.current.isFormValid();

        if(!regularExpressions.urlRegex.test(postLink)) {
            swal(
                'Uh Oh!',
                'You must enter a valid URL to create a link post',
                'error',
            ); 
            setPosting(false);
            return false;
        }

        else if(textPostTitle === '') {
            swal(
                'Uh Oh!',
                'You must enter a title for all link posts.',
                'error',
            );
            setPosting(false);
            return false;
        }

        else if(!isValid) {
            swal(
                'Uh Oh!',
                'Make sure the form is filled out properly',
                'error',
            );
            setPosting(false);
            return false;
        }
        else {
            let date = new Date();
            let months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'];
            let month = months[date.getMonth()];
            let day = date.getDate();
            let year = date.getFullYear();
            let dateString = `${month} ${day}, ${year}`;
            let data = JSON.stringify({
                text: '',
                title: textPostTitle,
                link: postLink,
                uniqueUserId: props.mainUser.uniqueUserId,
                username: props.mainUser.username,
                community: community.name,
                type: 'link',
                dateString: dateString,
                uniquePostId: Date.now() + props.mainUser.username + 'textpost' + 'info' + community.name,
                context: 'community',
                privacy: community.communityPrivacy,
            });

            return axios({
                method: 'post',
                url: 'http://10.162.4.11:3001/api/add/community/text/post',
                data: data,
                headers: {
                    'Content-Type': 'application/json',
                },
            }).then(response => {
                if(response.data.result === 'success') {
                    props.dispatch({type: 'visitorPosts/updatePosts', payload: response.data.posts});
                    swal(
                        'Great!',
                        'Successfully uploaded link post!',
                        'success',
                    );
                    setTextPost('');
                    setTextPostTitle('');
                    setPosting(false);
                    setPostDialog(false);
                }
                else {
                    swal(
                        'Uh Oh!',
                        'There was an error sending that link post!',
                        'error',
                    );
                    setPosting(false);
                }
            }).catch(err => {
                console.log(err.message);
                swal(
                    'Uh Oh!',
                    'There was an error sending that link post! Please try again.',
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
        //This function will handle passing a photo that is uploaded to the resizer function to rersize the photo
        let file = e.target.files[0];
        let resizedPhoto = await resizerFunction(file);
        setUploadPhoto(resizedPhoto);
    }

    function handlePhotoUpload() {
        //Function that will handle sending an uploaded photo to the server after resizing it.
        //Might need to make some edits here since the photo will be community-based
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
            fd.append('uniqueUserId', props.mainUser.uniqueUserId);
            fd.append('uniquePostId', Date.now() + props.mainUser.username + 'photoupload' + props.mainUser.uniqueUserId);
            fd.append('username', props.mainUser.username);
            fd.append('dateString', dateString);
            fd.append('type', 'photo');
            fd.append('context', 'community');
            fd.append('link', `http://192.168.0.9:3000/profile#${Date.now()}${props.mainUser.username}photoupload${props.mainUser.uniqueUserId}`);
            fd.append('community', community.name); //Name of the community that this post belongs to. 
            fd.append('title', '');
            fd.append('privacy', community.communityPrivacy);
            fd.append('text', '');

            return axios({
                method: 'POST',
                url: 'http://10.162.4.11:3001/api/upload/photo',
                data: fd,
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            }).then(response => {
                if(response.data.posts) {
                    props.dispatch({type: 'visitorPosts/updatePosts', payload: response.data.posts});
                    swal(
                        'Great!',
                        'Successfully uploaded photo!',
                        'success',
                    );
                    setPhotoCaption('');
                    setUploadPhoto(null);
                    setPostDialog(false);
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
            fd.append('uniqueUserId', props.mainUser.uniqueUserId);
            fd.append('uniquePostId', Date.now() + props.mainUser.username + 'videoupload' + props.mainUser.uniqueUserId);
            fd.append('username', props.mainUser.username);
            fd.append('dateString', dateString);
            fd.append('type', 'video');
            fd.append('context', 'community');
            fd.append('link', `http://192.168.0.9:3000/profile#${Date.now()}${props.mainUser.username}videoupload${props.mainUser.uniqueUserId}`);
            fd.append('community', community.name);
            fd.append('communityPost', true);
            fd.append('title', '');
            fd.append('privacy', community.communityPrivacy);
            fd.append('text', '');

            return axios({
                method: 'POST',
                url: 'http://10.162.4.11:3001/api/upload/photo',
                data: fd,
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            }).then(response => {
                if(response.data.posts) {
                    props.dispatch({type: 'visitorPosts/updatePosts', payload: response.data.posts});
                    swal(
                        'Great!',
                        'Successfully uploaded video!',
                        'success',
                    );
                    setVideoCaption('');
                    setUploadVideo(null);
                    setPostDialog(false);
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

    function leaveCommunity() {
        //This function will remove a member from a community if they are within it. 
        setJoinSending(true);
        let data = JSON.stringify({
            username: props.mainUser.username,
            uniqueUserId: props.mainUser.uniqueUserId,
            name: community.name,
        });

        return axios({
            method: 'POST',
            url: 'http://10.162.4.11:3001/api/leave/community',
            data: data,
            headers: {
                'Content-Type': 'application/json',
            },
        }).then(response => {
            if(response.data.result === 'success') {
                swal(
                    'Great!',
                    'You have successfully left this community',
                    'success',
                );
                setCommunity(response.data.community);
                setJoinSending(false);
            }
            else {
                swal(
                    'Uh Oh!',
                    'There was an error leaving this community! Please try again.',
                    'error',
                );
                setJoinSending(false);
            }
        }).catch(err => {
            console.log(err.message);
            swal(
                'Uh Oh!',
                'There was an error leaving this community! Please try again.',
                'error',
            );
            setJoinSending(false);
        });
    }

    function updateTitle() {
        //This function will call the server to update a community title. 
        if(editTitleText.length < 10) {
            swal(
                'Uh Oh!',
                'The title of the community must be at least 10 characters long!',
                'error',
            );
            return false;
        }
        else if(editTitleText.length > 75) {
            swal(
                'Uh Oh!',
                'The community title cannot be more than 75 characters long',
                'error',
            );
            return false;
        }
        else {
            let data = {
                community: community.name,
                title: editTitleText,
            };

            return axios({
                method: 'POST',
                url: 'http://10.162.4.11:3001/api/update/community/title',
                data: data,
                headers: {
                    'Content-Type': 'application/json',
                },
            }).then(response => {
                setMakingEdit(false);
                setEditTitleText('');
                setCommunity(response.data.community);
                swal(
                    'Great!',
                    'Successfully udated community.',
                    'success',
                );
            }).catch(err => {
                setMakingEdit(false);
                swal(
                    'Uh Oh!',
                    'There was an error editing the community title',
                    'error',
                );
            })
        }
    }

    if(community !== null) {
        return (
            <Grid 
                className={classes.root} 
                container 
            >
                <Grid 
                    item 
                    xs={12} 
                    className={classes.centerContent} 
                >
                    <Hidden 
                        smDown 
                    >
                        <Avatar 
                            className={classes.avatarLg} 
                            src={`http://10.162.4.11:3001/api/get-photo/${community.avatar}`}
                            alt={`${community.name} avatar`}
                            title={`${community.name} avatar`}
                            variant='square'
                        />
                    </Hidden>
                    <Hidden 
                        mdUp 
                    >
                        <Avatar 
                            src={`http://10.162.4.11:3001/api/get-photo/${community.avatar}`}
                            className={classes.avatarSm} 
                            title={`${community.name} avatar`}
                            alt={`${community.name} avatar`}
                            variant='square'
                        />
                    </Hidden>
                </Grid>
                {/* The grid below will store the name of the community */}
                <Grid 
                    item 
                    xs={12} 
                    className={classes.nameGrid} 
                >
                    <Typography 
                        variant='h6' 
                        component='h6' 
                        align='center' 
                    >
                        {community.name}
                    </Typography>
                </Grid>
                {/* End of the grid to display the community name */}
                {/* Below is the Grid to display the title of the community */}
                <Grid 
                    item 
                    xs={12}
                    className={classes.nameGrid} 
                >
                    <Typography 
                        variant='body1' 
                        component='p'
                        justify='left' 
                    >
                        {community.title}
                    </Typography>
                </Grid>
                {/* End of the Grid to display the title of the community */}
                {/* Now create a button for the user if they are logged in, not a member, and the community is public */}
                <Grid 
                    item 
                    xs={12}
                    style={{
                        margin: 'auto',
                        textAlign: 'center',
                        marginTop: 20,
                    }}
                >
                    {/* Button if the user is logged in, not a member, and the community is public */}
                    {(props.mainUser !== null && !_.find(community.members, member => member.uniqueUserId === props.mainUser.uniqueUserId) && community.communityPrivacy === 'public' && community.moderator.uniqueUserId !== props.mainUser.uniqueUserId) &&
                        <Button 
                            color='primary' 
                            variant='contained' 
                            onClick={publicJoin}
                            disabled={joinSending}
                        >
                            {joinSending ? <CircularProgress color='primary' /> : 'join'}
                        </Button>
                    }
                    {/* Below is the Button if the user is logged in, not a member, and the community is private */}
                    {(props.mainUser !== null && !_.find(community.members, member => member.uniqueUserId === props.mainUser.uniqueUserId) && community.communityPrivacy === 'private' && community.moderator.uniqueUserId !== props.mainUser.uniqueUserid) &&
                        <Button 
                            color='primary' 
                            variant='contained' 
                            onClick={privateJoinRequest}
                            disabled={joinSending}
                        >
                            {joinSending ? <CircularProgress color='primary' /> : 'join'}
                        </Button>
                    }
                    {(props.mainUser !== null && _.find(community.members, member => member.uniqueUserId === props.mainUser.uniqueUserId) && community.moderator.uniqueUserId !==  props.mainUser.uniqueUserId) &&
                        <Button 
                            color='primary'
                            variant='outlined' 
                            onClick={leaveCommunity}
                            disabled={joinSending}
                        >
                            {joinSending ? <CircularProgress color='primary' /> : 'leave'}
                        </Button>
                    }
                    {/* Below, we will add a button to route someone who is not signed up or logged in to the sign up page */}
                    {props.mainUser === null &&
                        <Button 
                            color='primary' 
                            onClick={e => history.push('/')}
                        >
                            Sign up or log in!
                        </Button>
                    }
                    {(props.mainUser === null && community.communityPrivacy === 'private') &&
                        <Grid 
                            item 
                            xs={12} 
                        >
                            <Typography 
                                variant='h6' 
                                component='h6' 
                                align='center' 
                            >
                                This community is private
                            </Typography>
                        </Grid>
                    }
                    {(props.mainUser !== null && !_.find(community.members, member => member.uniqueUserId === props.mainUser.uniqueUserId) && community.communityPrivacy === 'private') && 
                        <Grid 
                            item 
                            xs={12} 
                        >
                            <Typography 
                                variant='h6' 
                                component='h6' 
                                align='center' 
                            >
                                This community is private
                            </Typography>
                        </Grid>
                    }
                    {/*Now I will have two buttons in two grids for members of the community to either chat or post content to the community */}
                    {(props.mainUser !== null && _.find(community.members, member => member.uniqueUserId === props.mainUser.uniqueUserId)) &&
                        <div>
                            <Grid 
                                item 
                                xs={12} 
                                style={{
                                    marginTop: 20,
                                    marginBottom: 20,
                                }}
                            >
                                <Button 
                                    variant='contained' 
                                    color='primary' 
                                    style={{
                                        margin: 'auto',
                                    }}
                                    onClick={e => history.push(`/community/chat/${community.name}`)}
                                >
                                    Chat 
                                </Button>
                            </Grid>
                            <Grid 
                                item 
                                xs={12} 
                            >
                                <Button 
                                    color='primary' 
                                    variant='outlined' 
                                    onClick={e => setPostDialog(true)}
                                >
                                    Post 
                                </Button>
                            </Grid>
                        </div>
                    }
                    {/* This is the end of the two Grids for a the chat Button and the Post button */}
                    {/*Below create the Dialog that will open when the user tries to make a post. Only show when a user is part of the community */}
                </Grid>
                {(props.mainUser !== null && _.find(community.members, member => member.uniqueUserId === props.mainUser.uniqueUserId)) &&
                    <Grid 
                        item 
                        xs={12} 
                    >
                        <Dialog 
                            open={postDialog} 
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
                                        onClick={() => setPostDialog(false)}
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
                                        <Tab 
                                            {...a11yProps(3)}
                                            label='Link'
                                            disabled={posting} 
                                        />
                                    </Tabs>
                                </AppBar>
                                <TabPanel 
                                    index={0}
                                    value={curTab}
                                >
                                    <ValidatorForm
                                        ref={textFormRef} 
                                        onSubmit={e => e.preventDefault()}
                                    >
                                        <Typography 
                                            variant='body1' 
                                            component='small' 
                                            color={textPostTitle.length > 75 ? 'error' : 'default'}
                                            align='center' 
                                        >
                                            {textPostTitle.length}/75
                                        </Typography>
                                        <TextValidator 
                                            label='Post title'
                                            placeholder='Enter a title for your post of 75 characters or less'
                                            value={textPostTitle}
                                            onChange={e => setTextPostTitle(e.target.value)}
                                            helperText='Enter a title for this text post'
                                            validators={['titleLength']}
                                            errorMessages={['Title can only be up to 75 characters']}
                                            InputLabelProps={{
                                                shrink: true,
                                            }}
                                            color='primary'
                                            variant='outlined'
                                            fullWidth
                                        />
                                        <Typography 
                                            style={{
                                                marginTop: 30,
                                            }}
                                            variant='body1' 
                                            component='small'
                                            color={textPost.length > 3000 ? 'error' : 'default'}
                                            align='center' 
                                        >
                                            {textPost.length}/3000
                                        </Typography>
                                        <TextValidator 
                                            label='Text post'
                                            placeholder='Share a text post!'
                                            value={textPost}
                                            onChange={e => setTextPost(e.target.value)}
                                            helperText='Enter a text post of up to 3,000 characters long!'
                                            validators={['requiredText', 'textLength']}
                                            errorMessages={['Must enter some text!', 'Text post cannot be more than 3,000 characters long!']}
                                            variant='outlined' 
                                            InputLabelProps={{
                                                shrink: true,
                                            }}
                                            color='primary' 
                                            variant='outlined' 
                                            rows={3}
                                            multiline 
                                            required 
                                            fullWidth 
                                        />
                                        <Button 
                                            variant='contained' 
                                            color='primary' 
                                            onClick={sendTextPost}
                                            disabled={posting}
                                        >
                                            {posting ? <CircularProgress color='primary' /> : 'Upload'}
                                        </Button>
                                    </ValidatorForm>
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
                                <TabPanel 
                                    index={3}
                                    value={curTab}
                                >
                                    <ValidatorForm
                                        ref={linkFormRef} 
                                        onSubmit={e => e.preventDefault()}
                                    >
                                        <Typography 
                                            variant='body1' 
                                            component='small' 
                                            color={textPostTitle.length > 75 ? 'error' : 'default'}
                                            align='center' 
                                        >
                                            {textPostTitle.length}/75
                                        </Typography>
                                        <TextValidator 
                                            label='Post title'
                                            placeholder='Enter a title for your post of 75 characters or less'
                                            value={textPostTitle}
                                            onChange={e => setTextPostTitle(e.target.value)}
                                            helperText='Enter a title for this text post'
                                            validators={['requiredText', 'titleLength']}
                                            errorMessages={['Must enter a title for all link posts', 'Title can only be up to 75 characters']}
                                            InputLabelProps={{
                                                shrink: true,
                                            }}
                                            color='primary'
                                            variant='outlined'
                                            fullWidth
                                        />
                                        <br></br>
                                        <TextValidator 
                                            label='Link'
                                            placeholder='Share a valid link!'
                                            value={postLink}
                                            onChange={e => setPostLink(e.target.value)}
                                            helperText='Enter a valid url link.'
                                            validators={['requiredText', 'validLink']}
                                            errorMessages={['Must enter a link!', 'The link that you enter must be formatted properly!']}
                                            variant='outlined' 
                                            InputLabelProps={{
                                                shrink: true,
                                            }}
                                            color='primary' 
                                            variant='outlined'
                                            required 
                                            fullWidth 
                                        />
                                        <Button 
                                            variant='contained' 
                                            color='primary' 
                                            onClick={sendLinkPost}
                                            disabled={posting}
                                        >
                                            {posting ? <CircularProgress color='primary' /> : 'Upload'}
                                        </Button>
                                    </ValidatorForm>
                                </TabPanel>
                            </DialogContent>
                        </Dialog>
                    </Grid>
                }
                {/*End of the Grid for the dialog box for posts if the user is logged in and a member of the community */}
                {/* Below add the tabpanel for posts, about, and settings (only render settings if moderator is visiting page) */}
                {(community.communityPrivacy === 'public' || (props.mainUser !== null && _.find(community.members, member => member.uniqueUserId === props.mainUser.uniqueUserId))) &&
                    <Grid 
                        item 
                        xs={12} 
                    >
                        <Paper 
                            className={classes.paper}
                            style={{
                                marginTop: 10,
                            }}
                        >
                            <Tabs 
                                value={curTab2} 
                                onChange={(e, newVal) => setTab2(newVal)}
                                centered
                                style={{
                                    color: 'rgb(255, 255, 255)',
                                }}
                            >
                                <Tab 
                                    label='Posts' 
                                    {...a11yProps(0)} 
                                />
                                <Tab 
                                    label='About' 
                                    {...a11yProps(1)} 
                                />
                                {(props.mainUser !== null && community.moderator.uniqueUserId === props.mainUser.uniqueUserId) &&
                                    <Tab 
                                        label='Settings' 
                                        {...a11yProps(2)} 
                                    />
                                }
                            </Tabs>
                        </Paper>
                        {/* Now begin the tab for posts. Have the CommunityPostsCard ONLY for users who are logged in */}
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
                                            {props.mainUser !== null &&       
                                                <CommunityPostsCard
                                                    post={post}
                                                    id={post.uniquePostId}
                                                    moderator={props.mainUser.uniqueUserId === community.moderator.uniqueUserId}
                                                />
                                            }
                                            {props.mainUser === null &&
                                                <NonUserCommunityPostsCard 
                                                    post={post}
                                                    id={post.uniquePostId}
                                                />
                                            }
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
                        {/* This is the end of the tab for posts. Now, we need a tab for the about section of the community*/}
                        <TabPanel 
                            value={1}
                            index={curTab2} 
                        >
                            <div 
                                style={{
                                    margin: 'auto',
                                    maxWidth: 600,
                                    textAlign: 'center',
                                }}
                            >
                                <List>
                                    {/* First list item that shows the community moderator */}
                                    <ListItem
                                        style={{
                                            cursor: 'pointer',
                                        }}
                                        onClick={e => history.push(`/geouser/${community.moderator.uniqueUserId}`)}
                                        alignItems='flex-start'
                                    >
                                        <ListItemAvatar>
                                            <Avatar 
                                                src={`http://10.162.4.11:3001/api/get/avatar/by/id/${community.moderator.uniqueUserId}`}
                                                title={`${community.moderator.username}`}
                                                alt={`${community.moderator.username}`} 
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
                                                        Moderator 
                                                    </Typography>
                                                    <Typography 
                                                        variant='subtitle1' 
                                                        component='span' 
                                                        color='textSecondary'
                                                    >
                                                        {community.moderator.username}
                                                    </Typography>
                                                </div>
                                            }
                                        />
                                    </ListItem>
                                    <Divider />
                                    {/* End of the community moderator list item */}
                                    {/* Begin the community description section */} 
                                    <ListItem>
                                        <div>
                                            <Typography 
                                                variant='h6'
                                                component='h6' 
                                                align='center' 
                                            >
                                                Description
                                            </Typography>
                                            <br></br>
                                            <Typography 
                                                variant='body1' 
                                                component='p' 
                                            >
                                                {community.description}
                                            </Typography>
                                        </div>
                                    </ListItem>
                                    <Divider />
                                    {/* End of the section for the community description */}
                                    {/* Begin the ListItem for the number of members in the community */}
                                    <ListItem>
                                        <ListItemText 
                                            primary={
                                                <div>
                                                    <Typography 
                                                        variant='body1' 
                                                        component='p'
                                                        align='center' 
                                                    >
                                                        {community.members.length} members 
                                                    </Typography>
                                                </div>
                                            }
                                        />
                                    </ListItem>
                                    <Divider />
                                    {/* End of ListItem showing the number of users in a community */}
                                    {/* Begin the section showing a list of topics within the community */}
                                    <Typography 
                                        variant='h6' 
                                        component='h6' 
                                        align='center' 
                                    >
                                        Topics
                                    </Typography>
                                    <List>
                                        {community.topics.map((topic, index) => (
                                            <ListItem 
                                                key={index.toString()} 
                                                alignItems='flexStart' 
                                            >
                                                <ListItemText 
                                                    primary={
                                                        <div>
                                                            <Typography 
                                                                variant='body1' 
                                                                component='p'
                                                                align='center' 
                                                            >
                                                                {topic}
                                                            </Typography>
                                                        </div>
                                                    }
                                                />
                                            </ListItem>
                                        ))}
                                    </List>
                                    {/* End of the section for the community topics */}
                                </List>
                                {/* End of the list, but add community rules below */}
                                {community.rules.length > 0 &&
                                    <div>
                                        <Divider />
                                        <Typography 
                                            variant='h6' 
                                            component='h6' 
                                            align='center' 
                                        >
                                            Rules 
                                        </Typography>
                                        {community.rules.map((item, index) => (
                                            <div 
                                                key={index} 
                                            >
                                                <Accordion>
                                                    <AccordionSummary
                                                        expandIcon={<ChevronDownIcon />}
                                                    >
                                                        {item.rule}
                                                    </AccordionSummary>
                                                    <AccordionDetails>
                                                        <Typography 
                                                            variant='body1' 
                                                            component='p' 
                                                        >
                                                            {item.reason}
                                                        </Typography>
                                                    </AccordionDetails>
                                                </Accordion>
                                            </div>
                                        ))}
                                    </div>
                                }
                            </div>
                        </TabPanel>
                        {/* This is the end of the tab panel for the about section. Now it is time to add the  tab panel for the settings, which only the moderator can see. */}
                        {props.mainUser.uniqueUserId === community.moderator.uniqueUserId &&
                            <TabPanel 
                                value={2} 
                                index={curTab2} 
                            >
                                <div>
                                    <Typography 
                                        variant='h4' 
                                        component='h4'
                                        align='center' 
                                    >
                                        Settings 
                                    </Typography>
                                </div>
                                <Divider />
                                <div>
                                    <Typography 
                                        variant='subtitle2' 
                                        component='small' 
                                        color={(editTitleText.length < 10 || editTitleText.length > 75) ? 'error' : 'default'}
                                        align='center'
                                    >
                                        {editTitleText.length}/75
                                    </Typography>
                                    <TextField 
                                        variant='outlined' 
                                        color='primary' 
                                        label='Community title' 
                                        helperText='Change the community title. Must be between 10 and 75 characters long' 
                                        placeholder={community.title}
                                        value={editTitleText} 
                                        onChange={e => setEditTitleText(e.target.value)} 
                                        InputLabelProps={{
                                            shrink: true,
                                        }}
                                        fullWidth 
                                    />
                                    <Button 
                                        variant='contained' 
                                        color='primary' 
                                        onClick={updateTitle}
                                        disabled={makingEdit}
                                    >
                                        {makingEdit ? <CircularProgress /> : 'Update title'}
                                    </Button>
                                </div>
                            </TabPanel>
                        }
                    </Grid>
                }
                {/* End of the Grid for the main sections of the community page */}
            </Grid>
        );
    }
    else {
        //If the community is null, simply return a Backdrop with a CircularProgress inside 
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
        posts: state.visitorPostsReducer.posts,
    };
}

export default connect(mapStateToProps)(Community);