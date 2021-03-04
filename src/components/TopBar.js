import React, { useState } from 'react';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import Icon from '@mdi/react';
import { mdiChevronLeft, mdiMagnify, mdiHeartOutline } from '@mdi/js';
import { connect } from 'react-redux';
import { Link, useHistory } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import SvgIcon from '@material-ui/core/SvgIcon';
import Avatar from '@material-ui/core/Avatar';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import Switch from '@material-ui/core/Switch';
import Divider from '@material-ui/core/Divider';

const useStyles = makeStyles(() => ({
    link: {
        color: 'rgb(255, 255, 255)',
        textDecoration: 'none',
    },
    linkMarg: {
        color: 'rgb(255, 255, 255)',
        textDecoration: 'none',
        marginLeft: 10,
    },
}));

function TopBar(props) {
    const history = useHistory();
    const classes = useStyles();
    const [anchorEl, setAnchorEl] = useState(null);
    const [dark, setMode] = useState(false);

    function changeAnchorEl(e) {
        setAnchorEl(e.currentTarget);
    }

    function menuClose() {
        setAnchorEl(null);
    }

    function handleThemeChange(e) {
    
        if(e.target.checked) {
            setMode(true);
            props.dispatch({type: 'theme/dark'});
        }
        else {
            setMode(false);
            props.dispatch({type: 'theme/light'});
        }
    }

    function handleLogOut() {
        props.dispatch({type: 'user/updateUser', payload: null});
        props.dispatch({type: 'ThemeChange', payload: 'rgb(0, 20, 60)'});
        props.dispatch({type: 'userPosts/updatePosts', payload: []});
        props.dispatch({type: 'visitorPosts/updatePosts', payload: []});
        props.dispatch({type: 'theme/light'});
        setMode(false);
        history.push('/');
    }
    
    return (
        <AppBar 
            color='primary' 
            position='fixed' 
            style={{
                marginBottom: 100,
            }}
        >
            <Toolbar>
                <IconButton 
                    className={classes.link}
                    onClick={() => history.goBack(1)}
                >
                    <Icon 
                        path={mdiChevronLeft} 
                        size={1} 
                        title='Back button' 
                        aria-label='Back button' 
                    />
                </IconButton>
                <SvgIcon  
                    className={classes.linkMarg}
                >
                    <path d="M 10.050781 0.222656 C 9.261719 0.355469 8.6875 0.765625 8.472656 1.363281 C 8.402344 1.558594 8.394531 1.902344 8.449219 2.085938 C 8.621094 2.644531 9.289062 3.136719 9.988281 3.226562 C 10.082031 3.234375 10.347656 3.246094 10.574219 3.242188 C 11.0625 3.238281 11.152344 3.257812 11.332031 3.414062 C 11.5 3.5625 11.566406 3.738281 11.585938 4.046875 C 11.589844 4.179688 11.585938 4.332031 11.574219 4.386719 L 11.550781 4.480469 L 11.214844 4.503906 C 8.734375 4.695312 6.742188 5.953125 5.914062 7.84375 C 5.265625 9.324219 5.53125 11.039062 6.597656 12.300781 C 6.824219 12.570312 7.167969 12.90625 7.351562 13.035156 C 7.410156 13.078125 7.460938 13.117188 7.460938 13.121094 C 7.460938 13.125 7.359375 13.179688 7.230469 13.238281 C 6.515625 13.582031 5.902344 14.085938 5.648438 14.535156 C 5.445312 14.898438 5.371094 15.320312 5.460938 15.632812 C 5.617188 16.203125 6.226562 16.734375 7.144531 17.109375 C 7.308594 17.175781 7.433594 17.230469 7.425781 17.234375 C 7.421875 17.238281 7.292969 17.285156 7.140625 17.339844 C 5.796875 17.804688 4.949219 18.566406 4.664062 19.566406 C 4.582031 19.851562 4.574219 20.457031 4.648438 20.691406 C 4.828125 21.277344 5.1875 21.757812 5.785156 22.230469 C 6.644531 22.902344 7.910156 23.375 9.476562 23.597656 C 10.308594 23.71875 10.734375 23.746094 11.914062 23.746094 C 12.980469 23.746094 13.308594 23.734375 14.046875 23.664062 C 14.910156 23.578125 15.722656 23.4375 16.425781 23.253906 C 18.523438 22.695312 19.863281 21.703125 20.296875 20.386719 C 20.414062 20.035156 20.433594 19.890625 20.433594 19.449219 C 20.433594 19.085938 20.421875 18.996094 20.371094 18.808594 C 20.210938 18.242188 19.941406 17.851562 19.417969 17.445312 C 18.839844 16.992188 18.0625 16.664062 17.011719 16.4375 C 15.882812 16.1875 14.839844 16.105469 12.277344 16.074219 C 10.996094 16.058594 10.128906 16.042969 9.957031 16.03125 C 9.875 16.027344 9.707031 16.019531 9.578125 16.011719 C 8.390625 15.945312 7.71875 15.707031 7.449219 15.261719 C 7.375 15.144531 7.367188 15.101562 7.367188 14.945312 C 7.367188 14.78125 7.375 14.753906 7.464844 14.609375 C 7.519531 14.523438 7.617188 14.40625 7.679688 14.347656 C 7.832031 14.210938 8.136719 14.023438 8.386719 13.914062 L 8.59375 13.824219 L 8.691406 13.871094 C 8.949219 13.996094 9.578125 14.21875 9.902344 14.300781 C 12.304688 14.929688 14.867188 14.4375 16.605469 13.019531 C 18.023438 11.859375 18.652344 10.246094 18.296875 8.664062 C 18.117188 7.855469 17.640625 7.050781 16.949219 6.378906 C 16.722656 6.15625 16.144531 5.714844 15.871094 5.550781 C 15.1875 5.144531 14.410156 4.835938 13.644531 4.660156 C 13.386719 4.601562 12.800781 4.511719 12.683594 4.511719 C 12.628906 4.511719 12.582031 4.503906 12.570312 4.492188 C 12.5625 4.480469 12.578125 4.363281 12.609375 4.234375 C 12.699219 3.8125 12.734375 3.5 12.734375 3.003906 C 12.730469 2.464844 12.691406 2.203125 12.558594 1.796875 C 12.273438 0.953125 11.609375 0.386719 10.734375 0.242188 C 10.574219 0.214844 10.175781 0.203125 10.050781 0.222656 Z M 12.519531 6.125 C 14.375 6.332031 15.828125 7.410156 16.210938 8.871094 C 16.265625 9.058594 16.273438 9.167969 16.273438 9.519531 C 16.273438 9.882812 16.265625 9.972656 16.210938 10.183594 C 15.96875 11.101562 15.3125 11.871094 14.34375 12.378906 C 13.535156 12.804688 12.53125 13.011719 11.59375 12.945312 C 10.949219 12.898438 10.546875 12.8125 9.96875 12.585938 C 8.765625 12.117188 7.933594 11.265625 7.640625 10.203125 C 7.5625 9.90625 7.554688 9.183594 7.632812 8.886719 C 8.003906 7.429688 9.464844 6.335938 11.308594 6.125 C 11.636719 6.089844 12.191406 6.085938 12.519531 6.125 Z M 9.394531 17.675781 C 9.945312 17.738281 10.980469 17.777344 12.8125 17.816406 C 14.164062 17.84375 14.667969 17.863281 15.253906 17.933594 C 15.9375 18.007812 16.398438 18.109375 16.84375 18.269531 C 17.6875 18.574219 18.121094 19.050781 18.121094 19.660156 C 18.121094 20.058594 17.925781 20.394531 17.492188 20.726562 C 16.746094 21.304688 15.425781 21.6875 13.632812 21.855469 C 13.140625 21.902344 11.339844 21.910156 10.894531 21.867188 C 9.703125 21.753906 8.859375 21.570312 8.21875 21.285156 C 7.699219 21.054688 7.308594 20.742188 7.121094 20.414062 C 6.972656 20.148438 6.929688 19.777344 7.015625 19.460938 C 7.191406 18.816406 7.855469 18.191406 8.832031 17.746094 C 8.953125 17.691406 9.066406 17.644531 9.082031 17.644531 C 9.097656 17.644531 9.238281 17.660156 9.394531 17.675781 Z M 9.394531 17.675781" />
                    <path d="M 11.617188 8.546875 C 11.261719 8.625 10.957031 8.828125 10.792969 9.101562 C 10.691406 9.261719 10.691406 9.269531 10.691406 9.527344 C 10.691406 9.792969 10.691406 9.792969 10.796875 9.960938 C 11.070312 10.394531 11.644531 10.617188 12.242188 10.519531 C 12.75 10.433594 13.160156 10.082031 13.238281 9.667969 C 13.328125 9.171875 12.929688 8.691406 12.320312 8.550781 C 12.144531 8.511719 11.792969 8.507812 11.617188 8.546875 Z M 11.617188 8.546875 "/>
                </SvgIcon>
                {props.mainUser !== null &&
                    <Link 
                        className={classes.linkMarg}
                        to='/notifications'
                    >
                        <IconButton 
                            className={classes.link} 
                            aria-label='Notification button'
                        >
                            <Icon 
                                path={mdiHeartOutline}
                                size={1}
                                title='Notifications icon'
                                aria-label='Notifications icon' 
                            />
                        </IconButton>
                    </Link>
                }
                {props.mainUser !== null &&
                    <Link 
                        
                        to='/geocities/search' 
                    >
                        <IconButton
                            className={classes.link}
                        >
                            <Icon 
                                path={mdiMagnify} 
                                size={1} 
                                title='Search Icon' 
                                aria-label='Search' 
                            />
                        </IconButton>
                    </Link>
                }
                {props.mainUser !== null &&
                    <div>
                        <Avatar 
                            src={`http://192.168.0.9:3001/api/get-photo/${props.mainUser.avatar}`}
                            title={`${props.mainUser.username}`}
                            alt={`${props.mainUser.username}`}
                            style={{
                                cursor: 'pointer',
                            }}
                            onClick={changeAnchorEl}
                        />
                        <Menu 
                            open={anchorEl !== null}
                            anchorEl={anchorEl}
                            onClose={menuClose}
                            keepMounted 
                        >
                            <MenuItem
                                onClick={e => history.push('/profile')} 
                            >
                                Profile
                            </MenuItem>
                            <Divider />
                            <MenuItem 
                                onClick={e => history.push('/build/community')}
                            >
                                Build community
                            </MenuItem>
                            <Divider />
                            <MenuItem
                                onClick={handleLogOut} 
                            >
                                Log Out
                            </MenuItem>
                        </Menu>
                    </div>
                }
                <div 
                    style={{
                        marginLeft: 10,
                    }}
                >
                    <Typography 
                        variant='body1'
                        component='body1' 
                        style={{
                            color: 'rgb(255, 255, 255)',
                        }}
                    >
                        {dark ? 'light mode' : 'dark mode'}
                    </Typography>
                    <Switch 
                        checked={dark}
                        value={dark}
                        onChange={handleThemeChange}
                    />
                </div>
            </Toolbar>
        </AppBar>
    );
}

function mapStateToProps(state) {
    return {
        mainUser: state.userReducer.user,
        primary: state.userThemeReducer.primary,
        posts: state.userPostsReducer.posts,
        visitorPosts: state.visitorPostsReducer.posts,
        theme: state.themeReducer.theme,
    };
}

export default connect(mapStateToProps)(TopBar);