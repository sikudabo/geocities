import React, { useState, useRef, useEffect } from 'react';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardMedia from '@material-ui/core/CardMedia';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import Avatar from '@material-ui/core/Avatar';
import Typography from '@material-ui/core/Typography';
import Collapse from '@material-ui/core/Collapse';
import { ValidatorForm, TextValidator } from 'react-material-ui-form-validator';
import Button from '@material-ui/core/Button';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import CircularProgress from '@material-ui/core/CircularProgress';
import Icon from '@mdi/react';
import { mdiThumbUp, mdiThumbUpOutline, mdiComment, mdiCommentOutline, mdiChevronDown, mdiChevronUp, mdiDelete, mdiSend, mdiDotsVertical } from '@mdi/js';
import { makeStyles } from '@material-ui/core/styles';
import axios from 'axios';
import * as _ from 'underscore';
import { connect } from 'react-redux';
import swal from 'sweetalert';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemText from '@material-ui/core/ListItemText';
import Plyr from 'react-plyr';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import TextField from '@material-ui/core/TextField';
import { useHistory } from 'react-router-dom';
import Grid from '@material-ui/core/Grid';

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

function GeoUserPostsCard(props) {
    const classes = useStyles(); //Custom styles for the component
    const formRef = useRef(null); //Ref for the validator form
    const [expanded, setExpanded] = useState(false); //This expands the comments. 
    const [comment, setComment] = useState(''); //This variable holds the comment.
    const [commentSending, setCommentSending] = useState(false); //This variable will disable the comment button.
    const [likeSending, setLikeSending] = useState(false); //This variable will disable the like button.
    const [commentDeleting, setCommentDeleting] = useState(false); //This variable and setter will handle disabling the delete button while a comment is being deleted.
    const [commentLiking, setCommentLiking] = useState(false); //This variable and setter will handle disabling the comment like Button when the comment is being liked or unliked.
    const [deletingPost, setDeletingPost] = useState(false); //Variable and setter that will disable the delete button on a post while the server is deleting the post.
    const [anchorEl, setAnchorEl] = useState(null); //The anchor element for a menu item within a Card Post.
    const history = useHistory();

    useEffect(() => {
        //Add the validation rule so that a comment is not empty. 
        ValidatorForm.addValidationRule('notEmpty', v => {
            if(v.length < 1) {
                return false;
            }
            else {
                return true;
            }
        });
    }, []);

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

    function changeAnchorEl(e) {
        //Function that will handle altering the anchorEl on menu open 
        setAnchorEl(e.currentTarget);
    }

    function handleMenuClose() {
        //This will handle closing the share button menu.
        setAnchorEl(null);
    }

    function handleLike() {
        //This function will handle liking a post when a mainUser visits a geoUsers' page. 
        setLikeSending(true);
        let likeType;
        if(props.post.likes.includes(props.mainUser.uniqueUserId)) {
            likeType = 'unlike';
        }
        else if(!props.post.likes.includes(props.mainUser.uniqueUserId)) {
            likeType = 'like';
        }
        let data = {
            uniqueLikerId: props.mainUser.uniqueUserId,
            uniquePostId: props.post.uniquePostId,
            uniqueUserId: props.post.uniqueUserId,
            username: props.mainUser.username,
            likeType: likeType,
            communityPost: true,
            communityName: props.post.community,
        };

        return axios({
            method: 'POST',
            url: 'http://192.168.0.17:3001/api/handle/geo/post/like',
            data: data,
            headers: {
                'Content-Type': 'application/json',
            },
        }).then(response => {
            props.dispatch({type: 'visitorPosts/updatePosts', payload: response.data.posts}); //Update the posts. 
            if(response.data.likeType === 'like') {
                swal(
                    'Great!',
                    'Post was successfully liked!',
                    'success',
                );
                setLikeSending(false);
            }
            else {
                swal(
                    'Great!',
                    'Post was successfully unliked!',
                    'success',
                );
                setLikeSending(false);
            }
        }).catch(err => {
            console.log(err.message);
            swal(
                'Uh Oh!',
                'There was an error liking or unliking that post!',
                'error',
            );
            setLikeSending(false);
        });
    }

    function deletePost() {
        //This function will handle deleting a post from the database. 
        setDeletingPost(true);

        let data = JSON.stringify({
            uniqueUserId: props.mainUser.uniqueUserId,
            uniquePostId: props.post.uniquePostId,
            community: props.post.community,
            communityPost: true,
        });

        return axios({
            method: 'POST',
            url: 'http://192.168.0.17:3001/api/delete/post',
            data: data,
            headers: {
                'Content-Type': 'application/json',
            },
        }).then(response => {
            if(response.data.user) {
                props.dispatch({type: 'visitorPosts/updatePosts', payload: response.data.posts});
                swal(
                    'Great!',
                    'Post succcessfully deleted',
                    'success',
                );
                setDeletingPost(false);
            }
            else {
                swal(
                    'Uh Oh!',
                    'There was an error deleting that post!',
                    'error',
                );
                setDeletingPost(false);
            }
        }).catch(err => {
            console.log(err.message);

            swal(
                'Uh Oh!',
                'There was an error deleting that post!',
                'error',
            );

            setDeletingPost(false);
        });
    }

    function deleteMediaPost() {
        //This function will handle deleting a post from the database. 
        setDeletingPost(true);

        let data = JSON.stringify({
            uniqueUserId: props.mainUser.uniqueUserId,
            uniquePostId: props.post.uniquePostId,
            filename: props.post.src,
            community: props.post.community,
            communityPost: true,
        });

        return axios({
            method: 'POST',
            url: 'http://192.168.0.17:3001/api/delete/media/post',
            data: data,
            headers: {
                'Content-Type': 'application/json',
            },
        }).then(response => {
            if(response.data.user) {
                props.dispatch({type: 'visitorPosts/updatePosts', payload: response.data.posts});
                swal(
                    'Great!',
                    'Post succcessfully deleted',
                    'success',
                );
                setDeletingPost(false);
            }
            else {
                swal(
                    'Uh Oh!',
                    'There was an error deleting that post!',
                    'error',
                );
                setDeletingPost(false);
            }
        }).catch(err => {
            console.log(err.message);

            swal(
                'Uh Oh!',
                'There was an error deleting that post!',
                'error',
            );

            setDeletingPost(false);
        });
    }

    async function sendComment() {
        setCommentSending(true);
        let formValid = await formRef.current.isFormValid();
        if(!formValid) {
            swal(
                'Uh Oh!',
                'You must enter some text to send that comment!',
                'error',
            );
            setCommentSending(false);
            return false;
        }
        else {
            let date = new Date();
            let months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'];
            let month = months[date.getMonth()];
            let day = date.getDate();
            let year = date.getFullYear();

            let data = {
                uniqueCommentId: Date.now() + 'comment' + props.mainUser.uniqueUserId + props.mainUser.username + Date.now(),
                uniqueUserId: props.mainUser.uniqueUserId,
                username: props.mainUser.username,
                dateString: `${month} ${day}, ${year}`,
                text: comment,
                uniquePosterId: props.post.uniqueUserId,
                uniquePostId: props.post.uniquePostId,
                communityPost: true,
                communityName: props.post.community,
            };

            return axios({
                method: 'POST',
                url: 'http://192.168.0.17:3001/api/add/geo/comment',
                data: data,
                headers: {
                    'Content-Type': 'application/json',
                }
            }).then(response => {
                props.dispatch({type: 'visitorPosts/updatePosts', payload: response.data.posts});
                swal(
                    'Great!',
                    'Successfully posted comment!',
                    'success',
                );
                setCommentSending(false);
                setComment('');
            }).catch(err => {
                console.log(err.message);
                swal(
                    'Uh Oh!',
                    'There was an error sending that comment! Please try again.',
                    'error',
                );
                setCommentSending(false);
            });
        }
    }

    function deleteComment(uniqueCommentId) {
        setCommentDeleting(true); 

        let data = {
            uniquePostId: props.post.uniquePostId,
            commentId: uniqueCommentId,
            uniquePosterId: props.post.uniqueUserId,
            community: props.post.community,
            communityPost: true,
        };

        return axios({
            method: 'POST',
            url: 'http://192.168.0.17:3001/api/delete/comment',
            data: data,
            headers: {
                'Content-Type': 'application/json',
            },
        }).then(response => {
            props.dispatch({type: 'visitorPosts/updatePosts', payload: response.data.posts});
            swal(
                'Great!',
                'Comment successfully deleted!',
                'success',
            );
            setCommentDeleting(false);
        }).catch(err => {
            console.log(err.message);
            swal(
                'Uh Oh!',
                'There was an error deleting that comment!',
                'error',
            );
            setCommentDeleting(false);
        });
    }

    function handleUserPush(uniqueUserId) {
        //Route that handles pushing to a new user when the avatar is clicked within comments. 
        history.push(`/geouser/${uniqueUserId}`);
        history.go(0);
    }

    function handleCommentLike(uniqueCommentId, uniqueCommenterId, isLiked) {
        setCommentLiking(true); 
        let likeType;
        if(isLiked) {
            likeType = 'unlike';
        }
        else {
            likeType = 'like';
        }

        let data = {
            likeType: likeType,
            commentId: uniqueCommentId,
            uniqueCommenterId: uniqueCommenterId,
            uniquePostPosterId: props.post.uniqueUserId,
            uniqueLikerId: props.mainUser.uniqueUserId,
            username: props.mainUser.username,
            postType: 'personal',
            uniquePostId: props.post.uniquePostId,
            community: props.post.community,
            communityPost: true,
        };

        return axios({
            method: 'POST',
            url: 'http://192.168.0.17:3001/api/handle/geo/comment/like',
            data: data,
            headers: {
                'Content-Type': 'application/json',
            },
        }).then(response => {
            console.log('Here are the posts');
            console.log(response.data.posts);
            props.dispatch({type: 'visitorPosts/updatePosts', payload: response.data.posts});
            if(response.data.likeType === 'like') {
                swal(
                    'Great!',
                    'Comment successfully liked!',
                    'success',
                );
                setCommentLiking(false);
            }
            else {
                swal(
                    'Great!',
                    'Comment successfully unliked!',
                    'success',
                );
                setCommentLiking(false);
            }
        }).catch(err => {
            console.log(err.message);
            swal(
                'Uh Oh!',
                'There was an error liking or unliking that comment! Please try again.',
                'error',
            );
            setCommentLiking(false);
        });
    }

    return (
        <Card 
            className={classes.card}
            id={`${props.post.uniquePostId}`}
        >
            <CardHeader 
                title={
                    <Grid 
                        item 
                        xs={12}
                        zeroMinWidth 
                    >
                        <Typography 
                            variant='subtitle1'
                            component='small'
                            noWrap
                            style={{
                                fontWeight: 'bold',
                                fontSize: 12,
                            }}
                        >
                            {props.post.community}
                        </Typography>
                    </Grid>
                }
                subheader={
                    <React.Fragment>
                        <Typography 
                            variant='subtitle1'
                            component='span'
                            color='textSecondary' 
                        >
                            {timeDifference(props.post.utcTime, props.post.dateString)}
                        </Typography>
                        <br />
                        <Typography 
                            variant='subtitle2' 
                            component='small' 
                            color='textSecondary'  
                            style={{
                                cursor: 'pointer',
                            }}
                            onClick={e => history.push(`/geouser/${props.post.uniqueUserId}`)}
                        >
                            {props.post.username}
                        </Typography>
                    </React.Fragment>
                }
                avatar={
                    <Avatar 
                        src={`http://192.168.0.17:3001/api/get/avatar/by/community/name/${props.post.community}`}
                        title={`${props.post.username}`}
                        alt={`${props.post.username}`}
                    />
                }
                action={
                    <div>
                        <IconButton>
                            <Icon 
                                path={mdiDotsVertical} 
                                size={1} 
                                title='Share button' 
                                aria-label='Share button' 
                                onClick={changeAnchorEl}
                            />
                        </IconButton>
                        <Menu 
                            open={Boolean(anchorEl)}
                            anchorEl={anchorEl}
                            keepMounted 
                            onClose={handleMenuClose}
                        >
                            <MenuItem>
                                <TextField 
                                    label='Post link' 
                                    color='primary' 
                                    value={`http://192.168.0.9:3000/community/${props.post.community}#${props.post.uniquePostId}`}
                                    readonly 
                                />
                            </MenuItem>
                        </Menu>
                    </div>
                }
            />
            <div>
                {props.post.type === 'photo' &&
                    <CardMedia 
                        className={classes.media}
                        image={`http://192.168.0.17:3001/api/get-photo/${props.post.src}`}
                        title={`Post by ${props.post.username}`}
                        alt='GeoCities photo post'
                    />
                }
                {props.post.type === 'link' && 
                    <CardMedia
                        image={props.post.linkImage}
                        title={`Post by ${props.post.username}`}
                        alt='GeoCities link post'
                        className={classes.media}
                    />
                }
            </div>
            <div>
                {props.post.type === 'video' &&
                    <CardContent>
                        <Plyr 
                            playsinline={true}
                            playsInline
                            type='video'
                            sources={[
                                {
                                    src: `http://192.168.0.17:3001/api/get-video/${props.post.src}`,
                                }
                            ]}
                            fullscreen={{
                                enable: true,
                                fallback: true,
                                iosNative: false,
                            }}
                        />
                    </CardContent>
                }
            </div>
            <CardContent>
                <div>
                    {props.post.title &&
                        <Typography 
                            variant='h3' 
                            component='h3' 
                            align='center'
                        >
                            {props.post.title}
                        </Typography>
                    }
                    {props.post.type === 'text' &&
                        <Typography 
                            variant='body2' 
                            component='p' 
                        >
                            {props.post.text}
                        </Typography>
                    }
                    {props.post.type === 'link' &&
                        <div>
                            <a 
                                href={props.post.link} 
                                style={{
                                    textAlign: 'center',
                                }}
                            >
                                Link
                            </a>
                            <Typography 
                                variant='body2' 
                                component='p' 
                            >
                                {props.post.linkDescription}
                            </Typography>

                        </div>
                    }   
                </div>
                <div>
                    {(props.post.type === 'photo' || props.post.type === 'video') && 
                        <Typography 
                            variant='body2' 
                            component='p' 
                        >
                            {props.post.caption}
                        </Typography>
                    }
                </div>
            </CardContent>
            <CardActions>
                <IconButton 
                    color='primary'
                    disabled={likeSending}
                >
                    <Icon  
                        path={props.post.likes.includes(props.mainUser.uniqueUserId) ? mdiThumbUp : mdiThumbUpOutline}
                        size={1} 
                        title='Post like button'
                        aria-label='Post like button'
                        onClick={handleLike}
                    />
                    <div>
                        {props.post.likes.length > 0 &&
                            <Typography 
                                variant='body1' 
                                component='p' 
                            >
                                {props.post.likes.length}
                            </Typography>
                        }
                    </div>
                </IconButton>
                <IconButton 
                    color='primary'
                    onClick={() => setExpanded(!expanded)}
                >
                    <Icon 
                        path={_.find(props.post.comments, comment => comment.uniqueUserId === props.mainUser.uniqueUserId) ? mdiComment : mdiCommentOutline} 
                        size={1}
                        title='Comment button' 
                        aria-label='Comment button' 
                    />
                    <div>
                        {props.post.comments.length > 0 &&
                            <Typography 
                                variant='body1' 
                                component='p' 
                            >
                                {props.post.comments.length}
                            </Typography>
                        }
                    </div>
                </IconButton>
                <div>
                    {(props.post.uniqueUserId === props.mainUser.uniqueUserId || props.moderator === true) && (props.post.type === 'text' || props.post.type === 'link') &&
                        <IconButton 
                            color='primary' 
                            onClick={deletePost}
                            disabled={deletingPost}
                        >
                            {deletingPost ? <CircularProgress color='primary' /> : <Icon path={mdiDelete} size={1} title='Post delete button' aria-label='Post delete button' />}
                        </IconButton>
                    }
                    {(props.post.uniqueUserId === props.mainUser.uniqueUserId || props.moderator === true) && (props.post.type === 'photo' || props.post.type === 'video') &&
                        <IconButton 
                        color='primary' 
                        onClick={deleteMediaPost}
                        disabled={deletingPost}
                        >
                            {deletingPost ? <CircularProgress color='primary' /> : <Icon path={mdiDelete} size={1} title='Post delete button' aria-label='Post delete button' />}
                        </IconButton>
                    }
                </div>
                <IconButton 
                    style={{
                        marginLeft: 'auto' 
                    }}
                    onClick={() => setExpanded(!expanded)}
                >
                    <Icon 
                        path={expanded ? mdiChevronUp : mdiChevronDown} 
                        size={1}
                        title={expanded ? 'Expand less' : 'Expand more'} 
                        aria-label={expanded ? 'Expand less' : 'Expand more'} 
                    />
                </IconButton>
            </CardActions>
            <Collapse 
                in={expanded} 
            >
                <Divider />
                <CardContent>
                    <ValidatorForm 
                        ref={formRef} 
                        onSubmit={e => e.preventDefault()} 
                    >
                        <TextValidator 
                            label='Comment' 
                            placeholder='Add a comment...' 
                            variant='outlined' 
                            color='primary' 
                            helperText='Add a comment' 
                            value={comment} 
                            onChange={e => setComment(e.target.value)} 
                            validators={['notEmpty']}
                            errorMessages={['You must enter some text to send a comment!']}
                            InputLabelProps={{
                                shrink: true,
                            }}
                            rows={4}
                            multiline 
                            fullWidth 
                        />
                        <Button 
                            color='primary' 
                            variant='outlined' 
                            startIcon={
                                <Icon 
                                    path={mdiSend} 
                                    size={1} 
                                    title='Send icon' 
                                />
                            }
                            aria-label='Send comment button' 
                            disabled={commentSending}
                            onClick={sendComment}
                        >
                            {commentSending ? <CircularProgress color='primary' /> : 'Send'}
                        </Button>
                    </ValidatorForm>
                    <Divider />
                    <div 
                        style={{
                            marginTop: 10,
                        }}
                    >
                        {props.post.comments.length > 0 &&
                            <div>
                                {props.post.comments.map((comment, index) => (
                                    <div
                                        key={index} 
                                    >
                                        <ListItem 
                                            id={`${comment.uniqueCommentId}`}
                                            alignItems='flex-start'
                                        >
                                            <ListItemAvatar>
                                                <Avatar 
                                                    src={`http://192.168.0.17:3001/api/get/avatar/by/id/${comment.uniqueUserId}`}
                                                    title={`${comment.username}`}
                                                    alt={`${comment.username}`} 
                                                    onClick={e => handleUserPush(comment.uniqueUserId)}
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
                                                            {comment.username}
                                                        </Typography>
                                                        <Typography 
                                                            variant='subtitle1' 
                                                            component='span' 
                                                            color='textSecondary'
                                                        >
                                                            {timeDifference(comment.utcTime, comment.dateString)}
                                                        </Typography>
                                                    </div>
                                                }
                                                secondary={
                                                    <Typography 
                                                        variant='body2' 
                                                        component='p' 
                                                    >
                                                        {comment.text}
                                                    </Typography>
                                                }
                                            />
                                            <div>
                                                {(props.mainUser.uniqueUserId === comment.uniqueUserId || props.moderator === true) &&
                                                    <IconButton 
                                                        color='primary'
                                                        onClick={() => deleteComment(comment.uniqueCommentId)}
                                                        disabled={commentDeleting}
                                                    >
                                                        {commentDeleting ? <CircularProgress color='primary' /> : <Icon path={mdiDelete} size={1} title='Delete comment button' aria-label='Delete comment button' />}
                                                    </IconButton>
                                                }
                                            </div>
                                            <div>
                                                {props.mainUser !== null &&
                                                    <IconButton 
                                                        color='primary' 
                                                        disabled={commentLiking}
                                                        onClick={() => handleCommentLike(comment.uniqueCommentId, comment.uniqueUserId, comment.likes.includes(props.mainUser.uniqueUserId))}
                                                    >
                                                        {!comment.likes.includes(props.mainUser.uniqueUserId) ? <Icon path={mdiThumbUpOutline} size={1}  title='Comment like button' aria-label='Comment like button' /> : <Icon path={mdiThumbUp} size={1} title='Comment like button' aria-label='Comment like button' />}
                                                        {comment.likes.length > 0 &&
                                                            <Typography 
                                                                variant='body1' 
                                                                component='p' 
                                                            >
                                                                {comment.likes.length}
                                                            </Typography>
                                                        }
                                                    </IconButton>
                                                }
                                            </div>
                                        </ListItem>
                                        {index < props.post.comments.length - 1 &&
                                            <Divider />
                                        }
                                    </div>
                                ))}
                            </div>
                        }
                    </div>
                </CardContent>
            </Collapse>
        </Card>
    );
}

function mapStateToProps(state) {
    return {
        mainUser: state.userReducer.user,
        posts: state.visitorPostsReducer.posts,
    };
}

export default connect(mapStateToProps)(GeoUserPostsCard);