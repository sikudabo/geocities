import React from 'react';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Avatar from '@material-ui/core/Avatar';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
    paper: {
        maxWidth: 345,
        margin: 'auto',
        padding: theme.spacing(2),
        marginTop: 10,
    },
}));

export default function GridExample() {
    const classes = useStyles();

    return (
        <div>
            <Paper 
                className={classes.paper} 
            >
                <Grid 
                    container
                    wrap='nowrap' 
                    spacing={1}
                >
                    <Grid 
                        item 
                        xs={2}
                    >
                        <Avatar>
                            K
                        </Avatar>
                    </Grid>
                    <Grid 
                        item 
                        xs 
                        zeroMinWidth 
                    >
                        <Typography 
                            variant='body1'
                            component='p' 
                            noWrap 
                        >
                            This is text about Kendall Jenner that should be 
                            truncated. That means that it should not role off of 
                            this paper component. It should just truncate and be gone 
                            and stuff.
                        </Typography>
                    </Grid>
                </Grid>
            </Paper>
            <Paper 
                className={classes.paper} 
                elevation={3} 
            >
                <Grid 
                    container 
                    wrap='nowrap' 
                    spacing={1}
                >
                    <Grid 
                        item 
                        xs={2} 
                    >
                        <Avatar>
                            K
                        </Avatar>
                    </Grid>
                    <Grid 
                        item 
                    >
                        <Typography 
                            variant='body1' 
                            component='p' 
                            noWrap 
                        >
                            This is text about Kendall Jenner that should not wrap, but since we 
                            ommitted the zeroMinWidth prop, it will hang off the page.
                        </Typography>
                    </Grid>
                </Grid>
            </Paper>
            <Paper 
                className={classes.paper} 
                elevation={3} 
            >
                <Grid 
                    container 
                    wrap='nowrap' 
                    spacing={1}
                >
                    <Grid 
                        item 
                        xs={2} 
                    >
                        <Avatar>
                            K 
                        </Avatar>
                    </Grid>
                    <Grid 
                        item 
                    >
                        <Typography>
                            This is text about Kendall Jenner that should wrap. That means it should 
                            enter a new line so that it can appear in the paper, but remain 
                            contained within the paper component.
                        </Typography>
                    </Grid>
                </Grid>
            </Paper>
        </div>
    )
}