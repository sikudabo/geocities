import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { HashLink as Link } from 'react-router-hash-link';
import swal from 'sweetalert';
import axios from 'axios';
import { connect } from 'react-redux';
import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardMedia from '@material-ui/core/CardMedia';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import Button from '@material-ui/core/Button';
import Avatar from '@material-ui/core/Avatar';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Backdrop from '@material-ui/core/Backdrop';
import CircularProgress from '@material-ui/core/CircularProgress';
import IconButton from '@material-ui/core/IconButton';
import Icon from '@mdi/react';
import { mdiThumbUp, mdiComment } from '@mdi/js';
import * as _ from 'underscore';
import Plyr from 'react-plyr';

const useStyles = makeStyles(() => ({
    grid: {
        marginTop: 100,
    },
    card: {
        maxWidth: 600,
        margin: 'auto',
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

function Feed(props) {
    const classes = useStyles();
    const history = useHistory();
    const [posts, setPosts] = useState([]);

    useEffect(() => {
        if(props.user !== null) {
            return axios({
                method: 'GET', 
                url: `https://www.geocities.cc/api/get/user/feed/posts/${props.user.uniqueUserId}`,
            }).then(response => {
                props.dispatch({type: 'ThemeChange', payload: props.user.profileTheme});
                setPosts([...response.data.posts]);
            }).catch(err => {
                console.log(err.message);
                swal(
                    'Uh Oh!',
                    'There was an error rectrieving posts for the feed! Please try again.',
                    'error',
                );
                history.goBack(1);
            });
        }
        else {
            return axios({
                method: 'GET',
                url: 'https://www.geocities.cc/api/get/nonuser/feed/posts',
            }).then(response => {
                props.dispatch({type: 'ThemeChange', payload: 'rgb(0, 20, 60)'});
                setPosts([...response.data.posts]);
            }).catch(err => {
                console.log(err.message);
                swal(
                    'Uh Oh!',
                    'There was an error retreiving the posts for the feed! Please try again.',
                    'error',
                );
                history.goBack(1);
            });
        }
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

    if(props.user !== null) {
        if(posts.length > 0) {
            return (
                <Grid 
                    className={classes.grid} 
                    container
                >
                    <Grid 
                        item 
                        xs={12} 
                    >
                        {posts.map((post, index) => (
                            <div 
                                key={index.toString()}
                            >
                                {!_.find(post.blockList, blocked => blocked.uniqueUserId === props.user.uniqueUserId) &&
                                    <Card 
                                        variant='outlined' 
                                        className={classes.card}
                                        key={index.toString()}
                                        style={{
                                            marginBottom: index < posts.length - 1 ? 20 : 0,
                                        }}
                                    >
                                        <CardHeader 
                                            title={
                                                <Typography 
                                                    variant='h6' 
                                                    component='h6' 
                                                    style={{
                                                        cursor: 'pointer',
                                                    }}
                                                    onClick={e => post.context === 'personal' ? history.push(`geouser/${post.uniqueUserId}`) : history.push(`/community/${post.community}`)}
                                                >
                                                    {post.context === 'personal' ? post.username : post.community}
                                                </Typography>
                                            }
                                            subheader={
                                                <div>
                                                    <Typography 
                                                        variant='subtitle1' 
                                                        component='span' 
                                                        color='textSecondary' 
                                                    >
                                                        {timeDifference(post.utcTime, post.dateString)}
                                                    </Typography>
                                                    <br />
                                                    {post.context === 'community' ? (
                                                        <Typography 
                                                            variant='subtitle2' 
                                                            component='span' 
                                                            color='textSecondary' 
                                                            style={{
                                                                cursor: 'pointer',
                                                            }}
                                                            onClick={e => history.push(`/geouser/${post.uniqueUserId}`)}
                                                        >
                                                            {post.username}
                                                        </Typography>
                                                    ) : ''}
                                                </div>
                                            }
                                            avatar={
                                                <Avatar 
                                                    src={post.context === 'personal' ? `https://www.geocities.cc/api/get/avatar/by/id/${post.uniqueUserId}` : `https://www.geocities.cc/api/get/avatar/by/community/name/${post.community}`}
                                                    alt={`${post.username}`}
                                                    title={`${post.username}`} 
                                                    style={{
                                                        cursor: 'pointer',
                                                    }}
                                                    onClick={e => post.context === 'personal' ? history.push(`/geouser/${post.uniqueUserId}`) : history.push(`/community/${post.community}`)}
                                                />
                                            }
                                        />
                                        {post.title &&
                                            <Typography 
                                                variant='h3' 
                                                component='h3' 
                                                align='center'
                                            >
                                                {post.title}
                                            </Typography>
                                        }
                                        <div>
                                            {post.type === 'photo' &&
                                                <CardMedia 
                                                    className={classes.media}
                                                    image={`https://www.geocities.cc/api/get-photo/${post.src}`}
                                                    title={`Post by ${post.username}`}
                                                    alt='GeoCities photo post'
                                                />
                                            }
                                            {post.type === 'link' && 
                                                <CardMedia
                                                    image={post.linkImage}
                                                    title={`Post by ${post.username}`}
                                                    alt='GeoCities link post'
                                                    className={classes.media}
                                                />
                                            }
                                        </div>
                                        <div>
                                            {post.type === 'video' &&
                                                <CardContent>
                                                    <Plyr 
                                                        playsinline={true}
                                                        playsInline
                                                        type='video'
                                                        sources={[
                                                            {
                                                                src: `https://www.geocities.cc/api/get-video/${post.src}`,
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
                                        <div>
                                            {post.type === 'text' &&
                                                <Typography 
                                                    variant='body2' 
                                                    component='p' 
                                                >
                                                    {post.text}
                                                </Typography>
                                            }
                                        </div>
                                        <div>
                                            {post.caption &&
                                                <Typography 
                                                    variant='body1' 
                                                    component='p' 
                                                >
                                                    {post.caption}
                                                </Typography>
                                            }
                                        </div>
                                        <CardActions>
                                            <IconButton 
                                                color='primary' 
                                            >
                                                <Icon
                                                    path={mdiThumbUp} 
                                                    size={1} 
                                                    title='Like button' 
                                                /> 
                                                {post.likes.length}
                                            </IconButton>
                                            <IconButton 
                                                color='primary' 
                                            >
                                                <Icon
                                                    path={mdiComment} 
                                                    size={1} 
                                                    title='Comment button' 
                                                />
                                                {post.comments.length}
                                            </IconButton>
                                            <Link 
                                                to={post.context === 'community' ? `/community/${post.community}#${post.uniquePostId}` : `/geouser/${post.uniqueUserId}#${post.uniquePostId}`}
                                            >
                                                <Button 
                                                    color='primary' 
                                                >
                                                    Go to post
                                                </Button>
                                            </Link>
                                         
                                        </CardActions>
                                    </Card>
                                }
                            </div>

                        ))}
                    </Grid>
                </Grid>
            );
        }
        else {
            return (
                <Grid 
                    container 
                    className={classes.grid}
                >
                    <Grid 
                        item 
                        xs={12} 
                    >
                        <Typography 
                            variant='h6' 
                            component='h6' 
                            align='center' 
                        >
                            No posts in feed!
                        </Typography>
                    </Grid>
                </Grid>
            );
        }
    }
    else {
        if(posts.length > 0) {
            return (
                <Grid 
                    className={classes.grid} 
                    container 
                >
                    <Grid 
                        item 
                        xs={12} 
                    >
                        {posts.map((post, index) => (
                            <Card 
                                variant='outlined' 
                                className={classes.card}
                                key={index.toString()}
                                id={post.uniquePostId}
                                style={{
                                    marginBottom: index < posts.length - 1 ? 20 : 0,
                                }}
                            >
                                <CardHeader 
                                    title={
                                        <Typography 
                                            variant='h6' 
                                            component='h6' 
                                            style={{
                                                cursor: 'pointer',
                                            }}
                                            onClick={e => post.context === 'personal' ? history.push(`geouser/${post.uniqueUserId}`) : history.push(`/community/${post.community}`)}
                                        >
                                            {post.context === 'personal' ? post.username : post.community}
                                        </Typography>
                                    }
                                    subheader={
                                        <div>
                                            <Typography 
                                                variant='subtitle1' 
                                                component='span' 
                                                color='textSecondary' 
                                            >
                                                {timeDifference(post.utcTime, post.dateString)}
                                            </Typography>
                                            {post.context === 'community' ? (
                                                <Typography 
                                                    variant='subtitle2' 
                                                    component='span' 
                                                    color='textSecondary' 
                                                    style={{
                                                        cursor: 'pointer',
                                                    }}
                                                    onClick={e => history.push(`/geouser/${post.uniqueUserId}`)}
                                                >
                                                    {post.username}
                                                </Typography>
                                            ) : ''}
                                        </div>
                                    }
                                    avatar={
                                        <Avatar 
                                            src={post.context === 'personal' ? `https://www.geocities.cc/api/get/avatar/by/id/${post.uniqueUserId}` : `https://www.geocities.cc/api/get/avatar/by/community/name/${post.community}`}
                                            alt={`${post.username}`}
                                            title={`${post.username}`} 
                                            style={{
                                                cursor: 'pointer',
                                            }}
                                            onClick={e => post.context === 'personal' ? history.push(`/geouser/${post.uniqueUserId}`) : history.push(`/community/${post.community}`)}
                                        />
                                    }
                                />
                                {post.title &&
                                    <Typography 
                                        variant='h3' 
                                        component='h3' 
                                        align='center'
                                    >
                                        {post.title}
                                    </Typography>
                                }
                                <div>
                                    {post.type === 'photo' &&
                                        <CardMedia 
                                            className={classes.media}
                                            image={`https://www.geocities.cc/api/get-photo/${post.src}`}
                                            title={`Post by ${post.username}`}
                                            alt='GeoCities photo post'
                                        />
                                    }
                                    {post.type === 'link' && 
                                        <CardMedia
                                            image={post.linkImage}
                                            title={`Post by ${post.username}`}
                                            alt='GeoCities link post'
                                            className={classes.media}
                                        />
                                    }
                                </div>
                                <div>
                                    {post.type === 'video' &&
                                        <CardContent>
                                            <Plyr 
                                                playsinline={true}
                                                playsInline
                                                type='video'
                                                sources={[
                                                    {
                                                        src: `https://www.geocities.cc/api/get-video/${post.src}`,
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
                                <div>
                                    {post.type === 'text' &&
                                        <Typography 
                                            variant='body2' 
                                            component='p' 
                                        >
                                            {post.text}
                                        </Typography>
                                    }
                                </div>
                                <CardActions>
                                    <IconButton 
                                        color='primary' 
                                    >
                                        <Icon
                                            path={mdiThumbUp} 
                                            size={1} 
                                            title='Like button' 
                                        /> 
                                        {post.likes.length}
                                    </IconButton>
                                    <IconButton 
                                        color='primary' 
                                    >
                                        <Icon
                                            path={mdiComment} 
                                            size={1} 
                                            title='Comment button' 
                                        />
                                        {post.comments.length}
                                    </IconButton>
                                        Go to post 
                                        <Link 
                                            to={post.context === 'community' ? `/community/${post.community}#${post.uniquePostId}` : `/geouser/${post.uniqueUserId}#${post.uniquePostId}`}
                                        >
                                            <Button 
                                                color='primary' 
                                            >
                                                Go to post
                                            </Button>
                                        </Link>
                                </CardActions>
                            </Card>
                        ))}
                    </Grid>
                </Grid>
            );
        }
        else {
            return (
                <Grid 
                    container 
                    className={classes.grid} 
                >
                    <Grid 
                        item 
                        xs={12} 
                    >
                        <Typography 
                            variant='h6' 
                            component='h6' 
                            align='center' 
                        >
                            No posts in feed!
                        </Typography>
                    </Grid>
                </Grid>

            );
        }
    }
}

function mapStateToProps(state) {
    return {
        user: state.userReducer.user,
        primary: state.themeReducer.theme,
    };
}

export default connect(mapStateToProps)(Feed);