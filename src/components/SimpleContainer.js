import React from 'react';
import Container from '@material-ui/core/Container';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import { connect } from 'react-redux';

const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
    },
}));

function SimpleContainer(props) {
    const classes = useStyles();

    return (
        <Container 
            maxWidth='xl'
            className={classes.root} 
            fixed 
        >
            <Box 
                mx="auto" 
            >
                <Typography 
                    variant='h5'
                    component='h5' 
                >
                    Hello, world!
                </Typography>
            </Box>
            <Box 
                mx="auto"
            >
                {props.user && 
                    <Typography 
                        vairant='body1' 
                        component='p' 
                    >
                        The user is {props.user.username}
                    </Typography>
                }
            </Box>
        </Container>
    );
}

function mapStateToProps(state) {
    return {
        user: state.userReducer.user,
    };
}

export default connect(mapStateToProps)(SimpleContainer);