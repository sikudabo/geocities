import React from 'react';
import Grid from '@material-ui/core/Grid';
import Fab from '@material-ui/core/Fab';
import ArrowUpIcon from '@material-ui/icons/ArrowUpward';
import AddIcon from '@material-ui/icons/Add';
import EditIcon from '@material-ui/icons/Edit';
import FavoriteIcon from '@material-ui/icons/Favorite';

export default function Buttons() {
    return (
        <Grid 
            container 
        >
            <Grid 
                item
                xs={3}
            >
                <Fab 
                    variant='extended' 
                >
                    <ArrowUpIcon />
                    Navigation
                </Fab>
            </Grid>
            <Grid 
                item 
                xs={3} 
            >
                <Fab 
                    color='primary' 
                    size='small'
                >
                    <AddIcon />
                </Fab>
            </Grid>
            <Grid 
                item 
                xs={3} 
            >
                <Fab 
                    color='secondary' 
                    size='large'
                    variant='round'
                >
                    <EditIcon />
                </Fab>
            </Grid>
            <Grid 
                item
                xs={3} 
            >
                <Fab 
                    disabled 
                >
                    <FavoriteIcon />
                </Fab>
            </Grid>
        </Grid>
    );
}