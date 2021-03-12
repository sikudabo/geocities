import React, { useEffect} from 'react';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemText from '@material-ui/core/ListItemText';
import Avatar from '@material-ui/core/Avatar';
import Typography from '@material-ui/core/Typography';
import { connect } from 'react-redux';
import { useHistory } from 'react-router-dom';
import swal from 'sweetalert';
import { makeStyles } from '@material-ui/core/styles';
import Backdrop from '@material-ui/core/Backdrop';
import CircularProgress from '@material-ui/core/CircularProgress';

const useStyles = makeStyles(() => ({
    root: {
        marginTop: 100,
    },
    headerContainer: {
        margin: 'auto',
    },
    paper: {
        margin: 'auto',
        maxWidth: 450,
    },
}));

function Following(props) {
    const history = useHistory();
    const classes = useStyles();

    useEffect(() => {
        if(props.mainUser === null) {
            swal(
                'Uh Oh!',
                'You must be logged in to view who you are following!',
                'error',
            );
            history.push('/');
        }
        else {
            props.dispatch({type: 'ThemeChange', payload: props.mainUser.profileTheme});//Update theme
        }
    }, []);

    if(props.mainUser !== null) {
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
                    >
                        Following
                    </Typography>
                </Grid>
                <Grid 
                    item 
                    xs={12} 
                    style={{
                        marginTop: 20,
                    }}
                >
                    <List>
                        {props.mainUser.following.map((user, index) => (
                            <div
                                key={index} 
                                style={{
                                    marginBottom: 20,
                                }}
                            >
                                <Paper 
                                    key={index} 
                                    elevation={3} 
                                    className={classes.paper}
                                >
                                    <ListItem 
                                        alignItems='flex-start' 
                                        button
                                        onClick={e => history.push(`/geouser/${user.uniqueUserId}`)}
                                    >
                                        <ListItemAvatar>
                                            <Avatar 
                                                src={`http://192.168.0.17:3001/api/get/avatar/by/id/${user.uniqueUserId}`}
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
                            </div>
                        ))}
                    </List>
                </Grid>
            </Grid>
        );
    }
    else {
        <Backdrop 
            open={true} 
        >
            <CircularProgress 
                color='primary' 
            />
        </Backdrop>
    }
}

function mapStateToProps(state) {
    return {
        mainUser: state.userReducer.user,
        primary: state.userThemeReducer.primary,
    };
}

export default connect(mapStateToProps)(Following);