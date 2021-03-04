import React, { useState } from 'react';
import Button from '@material-ui/core/Button';
import Backdrop from '@material-ui/core/Backdrop';
import CircularProgress from '@material-ui/core/CircularProgress';
import Typography from '@material-ui/core/Typography';

export default function BackdropExample() {
    const [open, setOpen] = useState(false);

    function handleOpen() {
        setOpen(!open);
    }

    return (
        <div>
            <Backdrop 
                open={open} 
            >
                <CircularProgress 
                    color='primary' 
                />
                <Typography 
                    variant='body1' 
                    component='p' 
                >
                    Loading...
                </Typography>
            </Backdrop>
            <Button 
                onClick={handleOpen} 
                color='primary' 
                variant='outlined' 
            >
                Open backdrop
            </Button>
        </div>
    );
}