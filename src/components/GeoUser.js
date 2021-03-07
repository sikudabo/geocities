import React, { useState, useEffect, useLayoutEffect, useRef}  from 'react';
import { useHistory, useParams } from 'react-router-dom';
import Grid from '@material-ui/core/Grid';
import Avatar from '@material-ui/core/Avatar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import { connect } from 'react-redux';
import axios from 'axios';
import * as _ from 'underscore';
import swal from 'sweetalert';
import { makeStyles } from '@material-ui/core/styles';
import Hidden from '@material-ui/core/Hidden';
import Icon from '@mdi/react';
import { mdiCheckBold, mdiPencil, mdiClose, mdiCamera, mdiVideo, mdiTwitter, mdiInstagram, mdiYoutube } from '@mdi/js';
import Paper from '@material-ui/core/Paper';
import PropTypes from 'prop-types';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Divider from '@material-ui/core/Divider';
import Link from '@material-ui/core/Link';
import Backdrop from '@material-ui/core/Backdrop';
import CircularProgress from '@material-ui/core/CircularProgress';
import GeoUserPostsCard from './GeoUserPostsCard';
import NonUserPostsCard from './NonUserPostsCard';

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

function GeoUser(props) {
    const [geoUser, setGeoUser] = useState(null);
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
            backgroundColor: geoUser ? geoUser.profileTheme : 'rgb(0, 20, 60)',
            color: 'rgb(255, 255, 255)',
            marginTop: 40,
        },
        input: {
            display: 'none',
        },
    }));
    const classes = useStyles(); //Custom styling. 
    const params = useParams();
    const history = useHistory();
    const [isFollowing, setIsFollowing] = useState(false); //This will disable a button if the user is following or unfollowing a user.
    const [curTab, setCurTab] = useState(0); //The tab that should display. 
    const [isFollowingRequest, setIsFollowingRequest] = useState(false); //Variable and setter that will disable follow button if the user sends a request on a private profile. 
    const [communities, setCommunities] = useState([]); //Variable and setter for the users' list of communites
    
    useEffect(() => {
        if(props.mainUser === null) {
            //Call the API to get a public profile view for a user who is not logged in.
            return axios({
                method: 'GET',
                url: `http://10.162.4.11:3001/api/get/public/geo/user/${params.uniqueUserId}`,
            }).then(response => {
                if(response.data.geoUser) {
                    //If we were able to get a user, set post and theme globally, and the local geoUser state.
                    props.dispatch({type: 'visitorPosts/updatePosts', payload: response.data.posts});
                    props.dispatch({type: 'ThemeChange', payload: response.data.geoUser.profileTheme});
                    setGeoUser(response.data.geoUser); //Set the local geoUser state variable.
                    setCommunities(response.data.communities);
                }
                else {
                    swal(
                        'Uh Oh!',
                        'We could not find that user! Their profile might not exist.',
                        'error',
                    );

                    
                }
            }).catch(err => {
                console.log(err.message);
                swal(
                    'Uh Oh!',
                    'There was an error finding that user! Please try again.',
                    'error',
                );
            });
        }
        else if(props.mainUser !== null) {
            return axios({
                method: 'GET',
                url: `http://10.162.4.11:3001/api/get/geo/user/${params.uniqueUserId}/${props.mainUser.uniqueUserId}`,
            }).then(response => {
                if(response.data.geoUser && response.data.mainUser) {
                    if(response.data.geoUser.uniqueUserId === props.mainUser.uniqueUserId) {
                        history.push('/profile');
                    }
                    else {
                        if(response.data.geoUser.blockList.includes(response.data.mainUser.uniqueUserId)) {
                            swal(
                                'Uh Oh!',
                                'This user has blocked you!',
                                'error',
                            );
                            history.goBack(1);
                        }
                        else {
                            props.dispatch({type: 'user/updateUser', payload: response.data.mainUser});
                            props.dispatch({type: 'ThemeChange', payload: response.data.geoUser.profileTheme});
                            props.dispatch({type: 'visitorPosts/updatePosts', payload: response.data.posts});
                            setGeoUser(response.data.geoUser);
                            setCommunities(response.data.communities);
                        }
                    }
                }
                else {
                    swal(
                        'Uh Oh!',
                        'Could not find that GeoCities user!',
                        'error',
                    );
                    history.goBack(1);
                }
            }).catch(err => {
                console.log(err.message);
                swal(
                    'Uh Oh!',
                    'There was an error getting that users profile! Please try again.',
                    'error',
                );
                history.goBack(1);
            });
        }
    }, []);

    function followUser() {
        setIsFollowing(true);
        let data = JSON.stringify({
            uniqueUserId: geoUser.uniqueUserId,
            uniqueFollowerId: props.mainUser.uniqueUserId,
            username: props.mainUser.username,
            followUsername: geoUser.username,
        });

        return axios({
            method: 'POST',
            url: 'http://10.162.4.11:3001/api/follow/user',
            data: data,
            headers: {
                'Content-Type': 'application/json',
            },
        }).then(response => {
            swal(
                'Great!',
                'Successfully followed this user!',
                'success',
            );
            setGeoUser(response.data.geoUser);
            setIsFollowing(false);
        }).catch(err => {
            console.log(err.message);
            swal(
                'Uh Oh!',
                'There was an error following that user! Please try again.',
                'error',
            );
            setIsFollowing(false);
        });
    }

    function unfollowUser() {
        setIsFollowing(true);
        let data = {
            uniqueUserId: geoUser.uniqueUserId,
            uniqueUnfollowerId: props.mainUser.uniqueUserId,
            username: props.mainUser.username,
            unfollowUsername: geoUser.username,
        };

        return axios({
            method: 'POST',
            url: 'http://10.162.4.11:3001/api/unfollow/user',
            data: data,
            headers: {
                'Content-Type': 'application/json',
            },
        }).then(response => {
            swal(
                'Great!',
                'Successfully unfollowed user!',
                'success',
            );
            setGeoUser(response.data.geoUser);
            setIsFollowing(false);
        }).catch(err => {
            console.log(err.message);
            swal(
                'Uh Oh!',
                'There was an error unfollowing that user! Please try again.',
                'error',
            );
            setIsFollowing(false);
        });
    }

    function followUserRequest() {
        //This function will send a follow request to the geoUser. 
        setIsFollowing(true);
        setIsFollowingRequest(true);
        let data = {
            followerUsername: props.mainUser.username,
            followerUniqueUserId: props.mainUser.uniqueUserId,
            username: geoUser.username,
            uniqueUserId: geoUser.uniqueUserId,
        };

        return axios({
            method: 'POST',
            url: 'http://10.162.4.11:3001/api/follow/user/request',
            data: data,
            headers: {
                'Content-Type': 'application/json',
            },
        }).then(response => {
            if(response.data === 'duplicate') {
                swal(
                    'Uh Oh!',
                    'You already sent this user a follow request!',
                    'error',
                );
                setIsFollowing(false);
                setIsFollowingRequest(false);
            }
            else {
                swal(
                    'Great!',
                    'Successfully sent follow request!',
                    'success',
                );
                setIsFollowing(false);
                setGeoUser(response.data.geoUser);
            }
        }).catch(err => {
            console.log(err.message);
            swal(
                'Uh Oh!',
                'There was an error sending that follow request! Please try again.',
                'success',
            );
            setIsFollowing(false);
            setIsFollowingRequest(false);
        });
    }

    function findFollowers() {
        //This function will handle finding the followers for a specific geoUser. 
        history.push(`/geouser/followers/${geoUser.uniqueUserId}`);
    }

    function findFollowing() {
        history.push(`/geouser/following/${geoUser.uniqueUserId}`);
    }

    return (
        <div>
            {/* Below is the conditional rendering if the geoUser object is not null */}
            {geoUser !== null &&
                <Grid 
                    container 
                    className={classes.root} 
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
                            {/* Below is the avatar that will display 128x128 pixels on small screen devices */}
                            <Hidden 
                                mdUp  
                            >
                                <Avatar 
                                    src={`http://10.162.4.11:3001/api/get-photo/${geoUser.avatar}`} 
                                    className={classes.profileAvatar} 
                                    title={`${geoUser.username}`} 
                                    alt={`${geoUser.username}`} 
                                />
                            </Hidden>
                            {/* Below is the avatar that will display on medium and large screen devices at 168x168 pixels*/}
                            <Hidden 
                                smDown 
                            >
                                <Avatar 
                                    src={`http://10.162.4.11:3001/api/get-photo/${geoUser.avatar}`}
                                    title={`${geoUser.username}`}
                                    alt={`${geoUser.username}`}
                                    className={classes.profileAvatarLg} 
                                />
                            </Hidden>
                        </Grid>
                    </Grid>
                    {/* End of the top Grid that displays the avatar. Below is the Grid to display the username in a Typography component */}
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
                            {geoUser.username}
                        </Typography>
                        {geoUser.isVerified &&
                        <Typography 
                            variant='body1'
                            component='p' 
                            style={{
                                margin: 'auto',
                                textAlign: 'center',
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
                    {/* End of the username and verified check display. Below is the Grid to display following followers and Karma.*/}
                    <Grid 
                        container 
                        item 
                        xs={12}
                        spacing={1}
                        className={classes.statsInfo} 
                    >
                        <Grid 
                            item 
                            xs={4} 
                            style={{
                                cursor: 'pointer'
                            }}
                            onClick={(props.mainUser !== null && geoUser.followers.length > 0) ? findFollowers : e => console.log('No Followers')}
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
                                {geoUser.followers.length}
                            </Typography>
                        </Grid>
                        <Grid 
                            item 
                            xs={4} 
                            style={{
                                cursor: 'pointer',
                            }}
                            onClick={(props.mainUser !== null && geoUser.following.length > 0) ? findFollowing : e => console.log('The user is not following anyone')}
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
                                {geoUser.following.length}
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
                                {geoUser.karma}
                            </Typography>
                        </Grid>
                    </Grid>
                    {/* End of the statsInfo Grid */}
                    {/* Below is the Grid to display the geoUsers' first and last name */}
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
                            {geoUser.firstName} {geoUser.lastName}
                        </Typography>
                    </Grid>
                    {/* End of the Grid to display the first and last name */}
                    {/* Begin the Grid to display the GeoUsers bio */}
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
                            {geoUser.bio}
                        </Typography>
                    </Grid>
                    {/* End of the Grid that displays the geoUsers' bio*/}
                    {/* Below we will add a follow or unfollow button if the main user is active. This button 
                        will not exist if the main user is not active. Instead, we should add a button that 
                        takes someone visiting this page to the sign up page. If the mainUser is not null, 
                        they will get the follow Button if they don't follow the user and an unfollow button 
                        if they do follow the user. This button will only conditionally render if the mainUser 
                        object is not null.*/
                    }
                    {props.mainUser !== null &&
                        <Grid 
                            item 
                            xs={12}
                            style={{
                                margin: 'auto',
                                textAlign: 'center',
                                marginTop: 20,
                            }}
                        >
                            {/* Below create a condition if we have a user that is not following a user already, and the profile is public so the user doesn't have to send a follow request. */}
                            {(!_.find(geoUser.followers, follower => follower.uniqueUserId === props.mainUser.uniqueUserId) && geoUser.profilePrivacy === 'public') &&
                                <Button 
                                    color='primary'   
                                    variant='contained' 
                                    onClick={followUser}
                                    disabled={isFollowing} 
                                >
                                    {isFollowing ? <CircularProgress /> : 'Follow'}
                                </Button>
                            }
                            {/* Below create a condition if we have a user that is not following a user already, and the profile is private so the user must send a follow request */}
                            {(!_.find(geoUser.followers, follower => follower.uniqueUserId === props.mainUser.uniqueUserId) && geoUser.profilePrivacy === 'private') &&
                                <div>
                                    <Button 
                                        color='primary' 
                                        variant='contained' 
                                        onClick={followUserRequest}
                                        disabled={isFollowingRequest || _.find(geoUser.notifications, notification => notification.uniqueSenderId === props.mainUser.uniqueUserId && notification.type === 'follower request')}
                                    >
                                        {isFollowing ? <CircularProgress /> : 'Follow'}
                                    </Button>
                                    <Typography 
                                        variant='h6' 
                                        component='h6' 
                                        align='center' 
                                        style={{
                                            marginTop: 20,
                                        }}
                                    >
                                        This profile is private
                                    </Typography>
                                </div>
                            }
                            {/* Below is the condition to add the unfollow button if a mainUser is in the list of a geoUsers' followers */}
                            {_.find(geoUser.followers, follower => follower.uniqueUserId === props.mainUser.uniqueUserId) &&
                                <Button 
                                    color='primary' 
                                    variant='contained' 
                                    onClick={unfollowUser}
                                    disabled={isFollowing} 
                                >
                                    {isFollowing ? <CircularProgress /> : 'Unfollow'}
                                </Button>
                            }
                            {/* End of condition to add the unfollow button */}
                        </Grid>
                    }
                    {/*This will display a sign up button if the page visitor is not logged in */}
                    {props.mainUser === null &&
                        <Grid 
                            xs={12}
                            item 
                            style={{
                                margin: 'auto',
                                textAlign: 'center',
                                marginTop: 20,
                            }}
                        >
                            <Button 
                                color='primary'
                                onClick={e => history.push('/')}
                            >
                                Sign up or log in
                            </Button>
                        </Grid>
                    }
                    {/* End of the Button to handle following or unfollowing a user */}
                    {/* Below I need to handle conditions in which the rest of the page will either 
                        display or not display depending on if the mainUser is following or not following the 
                        user. I also need to consider if the geoUser has a public or private account. I must 
                        also handle cases in which someone who is not logged in can either visit an account 
                        or not visit an account. *
                    */}
                    {props.mainUser !== null &&
                        <div 
                            style={{
                                width: '100%',
                                padding: 0,
                            }}
                        >
                            {/* If the geoUser either has a public profile, or the mainUser follows the Geo User, add the tabs and posts section */}
                            {/* Below is the section for tabs within a Grid */}
                            {(geoUser.profilePrivacy === 'public' || _.find(geoUser.followers, follower => follower.uniqueUserId === props.mainUser.uniqueUserId)) &&
                                <div>
                                    <Grid 
                                        xs={12}
                                        item 
                                    >
                                        <Paper 
                                            className={classes.paper} 
                                        >
                                            <Tabs 
                                                value={curTab} 
                                                onChange={(e, newValue) => setCurTab(newValue)} 
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
                                            index={0}
                                            value={curTab} 
                                        >
                                            {/* If condition for if the user has no posts. */}
                                            {props.posts.length < 1 &&
                                                <Typography 
                                                    variant='h6' 
                                                    component='h6' 
                                                    align='center' 
                                                >
                                                    No posts 
                                                </Typography>
                                            }
                                            {/*End of if condition if user has no posts. Now, put the posts content below if the user has posts */}
                                            {props.posts.length > 0 &&
                                                <div>
                                                    {props.posts.map((post, index) => (
                                                        <div 
                                                            style={{
                                                                textAlign: 'left',
                                                            }}
                                                            key={index} 
                                                        >
                                                            <GeoUserPostsCard 
                                                                post={post}
                                                                user={geoUser}
                                                                id={post.uniquePostId} 
                                                                setter={setGeoUser}
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
                                        <TabPanel 
                                            index={1}
                                            value={curTab} 
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
                                                    About {geoUser.firstName}
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
                                                                    {geoUser.firstName} {geoUser.lastName}
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
                                                                        href={`mailto:${geoUser.email}`}
                                                                        style={{
                                                                            textAlign: 'center',
                                                                        }}
                                                                    >
                                                                        {geoUser.email}
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
                                                                    {geoUser.birthdate}
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
                                                                    {new Date(geoUser.dateCreated).getMonth() + 1}/{new Date(geoUser.dateCreated).getDate()}/{new Date(geoUser.dateCreated).getFullYear()}
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
                                                                    {geoUser.city}, {geoUser.userState}
                                                                </Typography>
                                                            }
                                                        />
                                                    </ListItem>
                                                    <Divider />
                                                    <div>
                                                        {geoUser.college !== 'None' &&
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
                                                                            {geoUser.college}
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
                                                        {geoUser.interests.map((interest, index) => (
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
                                                    {/* Now create the condition to see if there are any communities */}
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
                                                                                src={`http://10.162.4.11:3001/api/get-photo/${community.avatar}`}
                                                                                title={`${community.name} avatar`}
                                                                                alt={`${community.name} avatar`}
                                                                            />
                                                                        </ListItemAvatar>
                                                                        <ListItemText 
                                                                            primary={
                                                                                <div 
                                                                                    zeroMinWidth 
                                                                                >
                                                                                    <Typography 
                                                                                        variant='h6' 
                                                                                        component='h6' 
                                                                                        noWrap 
                                                                                    >
                                                                                        {community.name}
                                                                                    </Typography>
                                                                                </div>
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
                                                    <div>
                                                        {geoUser.twitterHandle &&
                                                            <div>
                                                                <ListItem 
                                                                    alignItems='start' 
                                                                >
                                                                    <ListItemIcon>
                                                                        <Icon 
                                                                            path={mdiTwitter}
                                                                            size={1} 
                                                                            title={'Twitter handld'}
                                                                            aria-label='Twitter handle icon' 
                                                                        />
                                                                    </ListItemIcon>
                                                                    <ListItemText 
                                                                        primary={
                                                                            <Link 
                                                                                component='a' 
                                                                                href={`https://www.twitter.com/${geoUser.twitterHandle}`}
                                                                                color='primary' 
                                                                                rel='external' 
                                                                                title='Twitter handle'
                                                                            >
                                                                                {geoUser.twitterHandle}
                                                                            </Link>
                                                                        }
                                                                    />
                                                                </ListItem>
                                                                <Divider />
                                                            </div>
                                                        }
                                                    </div>
                                                    {geoUser.instaHandle &&
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
                                                                            href={`https://www.instagram.com/${geoUser.instaHandle}`}
                                                                            rel='external'
                                                                            aria-label='Instagram profile link' 
                                                                        >
                                                                            {geoUser.instaHandle}
                                                                        </Link>
                                                                    }
                                                                />
                                                            </ListItem>
                                                            <Divider />
                                                        </div>
                                                    }
                                                    {geoUser.youtubeChannel &&
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
                                                                            href={geoUser.youtubeChannel}
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
                                            index={2} 
                                            value={curTab} 
                                        >
                                            Events 
                                        </TabPanel>
                                    </Grid>
                                </div>
                            }
                        </div>
                    }
                    {/* This will conditionally render if the mainUser is null, meaining a user is not logged in.*/}
                    {/* Below will will return a Typography saying the profile is private if the visitor is not logged in and the profile is private */}
                    {(props.mainUser === null && geoUser.profilePrivacy === 'private') &&
                        <Grid 
                            item 
                            xs={12} 
                            style={{
                                marginTop: 20,
                            }}
                        >
                            <Typography 
                                variant='h6' 
                                component='h6' 
                                align='center' 
                            >
                                Private profile
                            </Typography>
                        </Grid>
                    }
                    {/*End of privacy notice if the user is not logged in */}
                    {/* Below show the tabs and profile page if the profile is public */}
                    {(props.mainUser === null && geoUser.profilePrivacy === 'public') &&
                        <div 
                            style={{
                                width: '100%',
                                padding: 0
                            }}
                        >
                            <Grid 
                                xs={12}
                                item 
                            >
                                <Paper 
                                    className={classes.paper} 
                                >
                                    <Tabs 
                                        value={curTab} 
                                        onChange={(e, newValue) => setCurTab(newValue)} 
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
                                    index={0}
                                    value={curTab} 
                                >
                                    {/* If condition for if the user has no posts. */}
                                    {props.posts.length < 1 &&
                                        <Typography 
                                            variant='h6' 
                                            component='h6' 
                                            align='center' 
                                        >
                                            No posts 
                                        </Typography>
                                    }
                                    {/* End of if condition if the user has no posts */}
                                    {/* Now begin the if condition to iterate through all posts if the geoUser has at least one post */}
                                    {props.posts.length > 0 &&
                                        <div>
                                            {props.posts.map((post, index) => (
                                                <div 
                                                    style={{
                                                        textAlign: 'left',
                                                    }}
                                                    key={index} 
                                                >
                                                    <NonUserPostsCard
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
                                {/* End of the first tab panel that contains posts */}
                                {/* Begin the tab panel for the "about" section */}
                                <TabPanel 
                                    index={1}
                                    value={curTab} 
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
                                            About {geoUser.firstName}
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
                                                            {geoUser.firstName} {geoUser.lastName}
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
                                                                href={`mailto:${geoUser.email}`}
                                                                style={{
                                                                    textAlign: 'center',
                                                                }}
                                                            >
                                                                {geoUser.email}
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
                                                            {geoUser.birthdate}
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
                                                            {new Date(geoUser.dateCreated).getMonth() + 1}/{new Date(geoUser.dateCreated).getDate()}/{new Date(geoUser.dateCreated).getFullYear()}
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
                                                            {geoUser.city}, {geoUser.userState}
                                                        </Typography>
                                                    }
                                                />
                                            </ListItem>
                                            <Divider />
                                            <div>
                                                {geoUser.college !== 'None' &&
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
                                                                    {geoUser.college}
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
                                                {geoUser.interests.map((interest, index) => (
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
                                                            key={index} 
                                                            elevation={3} 
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
                                                                        src={`http://10.162.4.11:3001/api/get-photo/${community.avatar}`}
                                                                        alt={`${community.name} avatar`}
                                                                        title={`${community.name} avatar`}
                                                                    />
                                                                </ListItemAvatar>
                                                                <ListItemText 
                                                                    primary={
                                                                        <div 
                                                                            zeroMinWidth 
                                                                        >
                                                                            <Typography 
                                                                                variant='h6' 
                                                                                component='h6' 
                                                                                noWrap 
                                                                            >
                                                                                {community.name}
                                                                            </Typography>
                                                                        </div>
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
                                            <div>
                                                {geoUser.twitterHandle &&
                                                    <div>
                                                        <ListItem 
                                                            alignItems='start' 
                                                        >
                                                            <ListItemIcon>
                                                                <Icon 
                                                                    path={mdiTwitter}
                                                                    size={1} 
                                                                    title={'Twitter handld'}
                                                                    aria-label='Twitter handle icon' 
                                                                />
                                                            </ListItemIcon>
                                                            <ListItemText 
                                                                primary={
                                                                    <Link 
                                                                        component='a' 
                                                                        href={`https://www.twitter.com/${geoUser.twitterHandle}`}
                                                                        color='primary' 
                                                                        rel='external' 
                                                                        title='Twitter handle'
                                                                    >
                                                                        {geoUser.twitterHandle}
                                                                    </Link>
                                                                }
                                                            />
                                                        </ListItem>
                                                        <Divider />
                                                    </div>
                                                }
                                            </div>
                                            {geoUser.instaHandle &&
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
                                                                    href={`https://www.instagram.com/${geoUser.instaHandle}`}
                                                                    rel='external'
                                                                    aria-label='Instagram profile link' 
                                                                >
                                                                    {geoUser.instaHandle}
                                                                </Link>
                                                            }
                                                        />
                                                    </ListItem>
                                                    <Divider />
                                                </div>
                                            }
                                            {geoUser.youtubeChannel &&
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
                                                                    href={geoUser.youtubeChannel}
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
                                {/* End of the tab panel for the "about" section */}
                                {/* Begin the tab panel for the "events" section */}
                                <TabPanel 
                                    index={2} 
                                    value={curTab} 
                                >
                                    Events 
                                </TabPanel>
                            </Grid>
                        </div>
                    }
                    {/* End of the profile page view for a user who is not logged in and is viewing a public profile page */}
                </Grid>
            }
            {/* End of conditional rendering if the geoUser object is not null */}
            {geoUser === null &&
                <Backdrop 
                    open={true} 
                >
                    <CircularProgress 
                        color='primary' 
                    />
                </Backdrop>
            }
        </div>
    );
}



function mapStateToProps(state) {
    return {
        mainUser: state.userReducer.user,
        primary: state.userThemeReducer.primary,
        posts: state.visitorPostsReducer.posts,
    }
}

export default connect(mapStateToProps)(GeoUser);