import React  from 'react';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';
import { connect } from 'react-redux';
import counterDecrement from '../actions/counterDecrement';
import counterIncrement from '../actions/countIncrement';

const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
        padding: theme.spacing(2),
        textAlign: 'center',
    },
}));

function Counter(props) {
    const classes = useStyles();

    function increment() {
        props.dispatch(counterIncrement);
    }

    function decrement() {
        props.dispatch(counterDecrement);
    }

    return (
        <Container 
            maxWidth='xl'
            className={classes.root}
        >
            <Grid 
                container 
            >
                <Grid 
                    item 
                    xs={12} 
                >
                    <Typography 
                        variant='h5'
                        component='h5'
                        color='textSecondary' 
                    >
                        {props.value}
                    </Typography>
                </Grid>
            </Grid>
            <Grid 
                container 
                spacing={2}
            >
                <Grid 
                    item 
                    xs={6}
                >
                    <Button 
                        variant='outlined'
                        color='primary' 
                        onClick={increment} 
                    >
                        +
                    </Button>
                </Grid>
                <Grid 
                    item 
                    xs={6} 
                >
                    <Button 
                        variant='outlined'
                        color='secondary' 
                        onClick={decrement} 
                    >
                        -
                    </Button>
                </Grid>
            </Grid>
        </Container>
    );
}

function mapStateToProps(state) {
    return {
        value: state.counterReducer.value,
    };
}

export default connect(mapStateToProps)(Counter);