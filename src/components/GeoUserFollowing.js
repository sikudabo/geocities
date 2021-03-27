import React, { useEffect, useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import swal from 'sweetalert';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Avatar from '@material-ui/core/Avatar';
import ListItemText from '@material-ui/core/ListItemText';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import { connect } from 'react-redux';
import Backdrop from '@material-ui/core/Backdrop';
import CircularProgress from '@material-ui/core/CircularProgress';
import axios from 'axios';

const useStyles = makeStyles(() => ({
    root: {
        marginTop: 100,
    },
    list: {
        maxWidth: 450,
        margin: 'auto',
    },
}));

function GeoUserFollowing(props) {
    const classes = useStyles();
    const history = useHistory();
    const params = useParams();
    const [geoUser, setGeoUser] = useState(null);

    useEffect(() => {
        if(props.mainUser === null) {
            swal(
                'Uh Oh!',
                'You must be logged in to view who that user is following!',
                'error',
            );

            history.push('/');
        }
        else {
            return axios({
                method: 'GET',
                url: `https://www.geocities.cc/api/get/geo/followers/${params.uniqueUserId}`,
            }).then(response => {
                if(response.data.geoUser) {
                    setGeoUser(response.data.geoUser);
                    props.dispatch({type: 'ThemeChange', payload: props.mainUser.profileTheme});
                }
                else {
                    swal(
                        'Uh Oh!',
                        'Could not find who that user is following!',
                        'error',
                    );
                    history.goBack(1);
                }
            }).catch(err => {
                console.log(err.message);
                swal(
                    'Uh Oh!',
                    'There was an error finding who that user follows!',
                    'error',
                );
                history.goBack(1);
            });
        }
    });

    if(geoUser !== null && props.mainUser !== null) {
        return (
            <Grid 
                container 
                className={classes.root} 
            >
                <Grid 
                    item 
                    xs={12} 
                >
                    <Typography 
                        variant='h6' 
                        component='h6' 
                        align='center' 
                        style={{
                            marginBottom: 20,
                        }}
                    >
                        Users {geoUser.username} follows
                    </Typography>
                </Grid>
                <Grid 
                    item 
                    xs={12} 
                >
                    <List 
                        className={classes.list}
                    >
                        {geoUser.following.map((user, index) => (
                            <Paper 
                                elevation={3} 
                                key={index} 
                                style={{
                                    marginBottom: 20,
                                }}
                            >
                                <ListItem 
                                    alignItems='flex-start' 
                                    style={{
                                        cursor: 'pointer',
                                    }}
                                    onClick={e => history.push(`/geouser/${user.uniqueUserId}`)}
                                >
                                    <ListItemAvatar>
                                        <Avatar 
                                            src={`https://www.geocities.cc/api/get/avatar/by/id/${user.uniqueUserId}`}
                                            alt={`${user.username}`}
                                            title={`${user.username}`} 
                                        />
                                    </ListItemAvatar>
                                    <ListItemText 
                                        primary={
                                            <Typography 
                                                variant='h6' 
                                                component='h6' 
                                            >
                                                {user.username}
                                            </Typography>
                                        }
                                    />
                                </ListItem>
                            </Paper>
                        ))}
                    </List>
                </Grid>
            </Grid>
        )
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
        )
    }

}

function mapStateToProps(state) {
    return {
        mainUser: state.userReducer.user,
        primary: state.userThemeReducer.primary,
    };
}

export default connect(mapStateToProps)(GeoUserFollowing);