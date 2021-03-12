import React, { useState, useEffect } from 'react';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Icon from '@mdi/react';
import { mdiAccount } from '@mdi/js';
import TextField from '@material-ui/core/TextField';
import InputAdornment from '@material-ui/core/InputAdornment';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Autocomplete, { createFilterOptions } from '@material-ui/lab/Autocomplete';
import { makeStyles } from '@material-ui/core/styles';
import { connect } from 'react-redux';
import { useHistory } from 'react-router-dom';
import ListItem from '@material-ui/core/ListItem';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Avatar from '@material-ui/core/Avatar';
import ListItemText from '@material-ui/core/ListItemText';
import axios from 'axios';
import swal from 'sweetalert';

const userFilterOptions = createFilterOptions({
    matchFrom: 'any',
    stringify: option => option.firstName + ' ' + option.lastName + ' ' + option.username,
});

const communityFilterOptions = createFilterOptions({
    matchFrom: 'any',
    stringify: option => option.name,
});

const useStyles = makeStyles(() => ({
    root: {
        marginTop: 100,
    },
    card: {
        maxWidth: 450,
        margin: 'auto',
    }
}));

function GeoCitiesSearch(props) {
    const classes = useStyles();
    const history = useHistory();
    const [searchUser, setSearchUser] = useState(null);
    const [searchCommunity, setSearchCommunity] = useState(null);
    const [users, setUsers] = useState([]);
    const [communities, setCommunities] = useState([]);
    const [val, setVal] = useState('');
    const myUsers = [
        'Simeon',
    ]

    useEffect(() => {
        //If the user is not logged in, return to the log in/sign up page. 
        if(props.mainUser === null) {
            history.push('/');
        }
        else {
            return axios({
                method: 'GET',
                url: `http://192.168.0.17:3001/api/fetch/users/${props.mainUser.uniqueUserId}`,
            }).then(response => {
                if(response.data.users.length > 0) {
                    setUsers(response.data.users);
                    setCommunities(response.data.communities);
                    //Update the profile theme once the users return.
                    props.dispatch({type: 'ThemeChange', payload: props.mainUser.profileTheme});
                }
                else {
                    swal(
                        'Uh Oh!',
                        'We could not find any users to search.',
                        'error',
                    );
                }
            }).catch(err => {
                console.log(err.message);
                swal(
                    'Uh Oh!',
                    'There was an error getting the data to search from the server! Please try again.',
                    'error',
                );
                history.goBack(1);
            });
        }
    }, []);

    return (
        <Grid 
            className={classes.root} 
            container 
        >
            <Card 
                className={classes.card} 
            >
                <CardContent>
                    <Typography 
                        variant='h6' 
                        component='h6' 
                        align='center'
                        style={{
                            marginBottom: 20,
                        }}
                    >
                        Search for users or communities 
                    </Typography>
                    {users.length > 0 &&
                        <Autocomplete 
                            value={searchUser}
                            filterOptions={userFilterOptions}
                            onChange={(e, newVal) => setSearchUser(newVal)}
                            options={users}
                            getOptionLabel={option => option.firstName + ' ' + option.lastName}
                            renderOption={option => (
                                <ListItem 
                                    alignItems='flex-start' 
                                    style={{
                                        cursor: 'pointer',
                                    }}
                                    onClick={() => history.push(`/geouser/${option.uniqueUserId}`)}
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
                                    placeholder='Search users'
                                    helperText='Search for a GeoCities user'
                                    InputLabelProps={{
                                        shrink: true,
                                    }}
                                    fullWidth 
                                    required 
                                />
                            )}
                        />
                    }
                    <div 
                        style={{
                            marginTop: 20,
                        }}
                    />
                    {communities.length > 0 &&
                        <Autocomplete 
                            value={searchCommunity}
                            onChange={(e, newVal) => setSearchCommunity(newVal)}
                            options={communities}
                            getOptionSelected={(option, value) => option.name === value || option.title === value || option.topics.includes(value)}
                            getOptionLabel={option => option.name}
                            renderOption={option => (
                                <ListItem 
                                    alignItems='flex-start' 
                                    style={{
                                        cursor: 'pointer',
                                    }}
                                    onClick={e => history.push(`/community/${option.name}`)}
                                >
                                    <ListItemAvatar>
                                        <Avatar 
                                            src={`http://192.168.0.17:3001/api/get-photo/${option.avatar}`}
                                            alt={`${option.name} avatar`}
                                            title={`${option.name} avatar`} 
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
                                                    {option.name}
                                                </Typography>
                                            </Grid>
                                        }
                                        secondary={
                                            <Typography 
                                                    component='small'
                                                    color='textSecondary'
                                                >
                                                    {option.title}
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
                                    label='Search communities' 
                                    placeholder='Search communities'
                                    helperText='Search for a GeoCities community'
                                    InputLabelProps={{
                                        shrink: true,
                                    }}
                                    fullWidth 
                                    required 
                                />
                            )}
                        />
                    }
                </CardContent>
            </Card>
        </Grid>
    );
}

function mapStateToProps(state) {
    return {
        mainUser: state.userReducer.user,
        theme: state.userThemeReducer.primary,
    };
}

export default connect(mapStateToProps)(GeoCitiesSearch);

