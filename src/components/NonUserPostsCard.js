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

export default function NonUserPostsCard(props) {
    const classes = useStyles();
    const history = useHistory();
    const [expanded, setExpanded] = useState(false); //Variable and setter for comments section to display.
    const [anchorEl, setAnchorEl] = useState(null); //Anchor element for menu with the link to the Card post.

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

    function handleUserPush(uniqueUserId) {
        //Route that handles pushing to a new user when the avatar is clicked within comments. 
        history.push(`/geouser/${uniqueUserId}`);
        history.go(0);
    }

    return (
        <Card 
            className={classes.card}
            id={`${props.post.uniquePostId}`}
        >
            <CardHeader 
                title={
                    <Typography 
                        variant='h6' 
                        component='h6'
                    >
                        {props.post.username}
                    </Typography>
                }
                subheader={
                    <Typography 
                        variant='subtitle1'
                        component='span'
                        color='textSecondary' 
                    >
                        {timeDifference(props.post.utcTime, props.post.dateString)}
                    </Typography>
                }
                avatar={
                    <Avatar 
                        src={`http://192.168.0.17:3001/api/get/avatar/by/id/${props.post.uniqueUserId}`}
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
                                    value={`localhost:3000/geouser/${props.post.uniqueUserId}#${props.post.uniquePostId}`}
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
                        component='img'
                        src={`http://192.168.0.17:3001/api/get-photo/${props.post.src}`}
                        title={`Post by ${props.post.username}`}
                        alt='GeoCities photo post'
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
                    {props.post.type === 'text' &&
                        <Typography 
                            variant='body2' 
                            component='p' 
                        >
                            {props.post.text}
                        </Typography>
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
                >
                    <Icon  
                        path={mdiThumbUpOutline}
                        size={1} 
                        title='Post like button'
                        aria-label='Post like button'
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
                        path={mdiCommentOutline} 
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
                                                <IconButton 
                                                    color='primary'
                                                >
                                                    <Icon 
                                                        path={mdiThumbUpOutline} 
                                                        size={1}  
                                                        title='Comment like button' 
                                                        aria-label='Comment like button' 
                                                    /> 
                                                    {comment.likes.length > 0 &&
                                                        <Typography 
                                                            variant='body1' 
                                                            component='p' 
                                                        >
                                                            {comment.likes.length}
                                                        </Typography>
                                                    }
                                                </IconButton>
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