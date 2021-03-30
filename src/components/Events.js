import React, { useState, useEffect } from 'react';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { connect } from 'react-redux';
import axios from 'axios';
import swal from 'sweetalert';
import { useHistory } from 'react-router-dom';
import EventComponent from './EventComponent';
import { makeStyles } from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';

const useStyles = makeStyles(() => ({
    topGrid: {
        marginTop: 100,
    },
}));

function Events(props) {
    const [events, setEvents] = useState([]); //Variable and setter for all events on the page. 
    const history = useHistory();
    const classes = useStyles();

    useEffect(() => {
        //First, check to see if the user is logged in and update the theme. 
        if(props.user !== null) {
            props.dispatch({type: 'ThemeChange', payload: props.user.profileTheme});
        }
        if(true) {
            return axios({
                method: 'GET',
                url: 'http://192.168.0.17:3001/api/fetch/events',
            }).then(response => {
                setEvents([...response.data.events]);
            }).catch(err => {
                console.log(err.message);
                swal(
                    'Uh Oh!',
                    'There was an error retreiving the events! Please try again.',
                    'error',
                );
                history.goBack(1);
            });
        }
    }, []);

    if(props.user !== null) {
        return (
            <Grid 
                container
                className={classes.topGrid}
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
                        GeoCities events! 
                    </Typography>
                </Grid>
                {events.length < 1 &&
                    <Grid 
                        item 
                        xs={12} 
                        style={{
                            marginTop: 30,
                        }}
                    >
                        <Typography 
                            variant='body1' 
                            component='p' 
                            align='center' 
                        >
                            No events posted yet!
                        </Typography>
                    </Grid>
                }
                {events.length > 0 &&
                    <Grid 
                        item 
                        xs={12} 
                    >
                        {events.map((event, index) => (
                            <div 
                                style={{
                                    textAlign: 'center',
                                    margin: 'auto',
                                }}
                                key={index.toString()}
                            >
                                <Box 
                                    mx='auto'
                                >
                                    <EventComponent 
                                        event={event}
                                        setEvents={setEvents}
                                    />
                                </Box>
                            </div>
                        ))}
                    </Grid>
                }
            </Grid>
        );
    }
    else {
        return (
            <Grid 
                container 
                className={classes.topGrid} 
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
                        GeoCities events!
                    </Typography>
                </Grid>
            </Grid>
        );
    }
}

function mapStateToProps(state) {
    return {
        user: state.userReducer.user,
        primary: state.themeReducer.theme,
    };
}

export default connect(mapStateToProps)(Events);