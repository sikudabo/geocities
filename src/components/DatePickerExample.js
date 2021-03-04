import React from 'react';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(() => ({
    textField: {
        width: '100%',
    },
}));

export default function DatePickerExample() {
    const classes = useStyles();
    
    return (
        <Grid 
            container 
        >
            <Grid 
                item 
                xs={12} 
            >
                <TextField 
                    className={classes.textField} 
                    defaultValue='10:07'
                    type='time' 
                    label='Time'
                    InputLabelProps={{
                        shrink: true,
                    }}
                    inputProps={{
                        step: 300,
                    }} 
                />
            </Grid>
        </Grid>
    )
}
