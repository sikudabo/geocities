import React, { useState } from 'react';
import Grid from '@material-ui/core/Grid';
import Radio from '@material-ui/core/Radio';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(() => ({
    myFlex: {
        display: 'flex',
    },
}));

export default function RadioExample() {
    const classes = useStyles();
    const [selectedValue, setSelectedValue] = useState(null);

    function handleChange(e) {
        setSelectedValue(e.target.value);
    }

    return (
        <Grid 
            container 
        >
            <Grid 
                item 
                xs={12} 
            >
                <Typography 
                    variant='body1'
                    component='p' 
                >
                    Selected value: {selectedValue}
                </Typography>
            </Grid>
            <Grid 
                item 
                xs={12} 
                className={classes.myFlex} 
            >
                <Radio 
                    checked={selectedValue === 'a'}
                    value='a' 
                    aria-label='a' 
                    onChange={handleChange} 
                    color='primary' 
                    label='a'
                />
                <Radio 
                    checked={selectedValue === 'b'} 
                    value='b' 
                    aria-label='b' 
                    onChange={handleChange} 
                    color='primary' 
                />
                <Radio 
                    value='c'
                    checked={selectedValue === 'c'} 
                    aria-label='c'
                    onChange={handleChange}
                    color='primary' 
                />
            </Grid>
        </Grid>
    );
}