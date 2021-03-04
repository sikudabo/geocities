import React, { useState } from 'react';
import Rating from '@material-ui/lab/Rating';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
        textAlign: 'center',
    },
}));

export default function RatingExample() {
    const classes = useStyles();
    const [rating, setRating] = useState(1);

    function handleChange(e, newValue) {
        setRating(newValue);
    }

    return (
        <div 
            className={classes.root} 
        >
            <Typography 
                variant='body1' 
                color='textSecondary' 
            >
                The rating is: {rating}
            </Typography>
            <Rating 
                color='primary' 
                value={rating}
                onChange={handleChange} 
                label='Rate this community' 
            />
        </div>
    );
}