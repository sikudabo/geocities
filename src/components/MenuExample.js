import React, { useState } from 'react';
import Button from '@material-ui/core/Button';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
    container: {
        padding: theme.spacing(2),
        textAlign: 'center',
    },
}));

export default function MenuExample() {
    const classes = useStyles();
    const [anchorEl, setAnchorEl] = useState(null);

    function handleClick(e) {
        setAnchorEl(e.currentTarget);
    }

    function handleClose() {
        setAnchorEl(null);
    }

    return (
        <div 
            className={classes.container} 
        >
            <Button 
                variant='outlined'
                color='primary' 
                onClick={handleClick} 
            >
                Open Menu
            </Button>
            <Menu 
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleClose}
            >
                <MenuItem 
                    onClick={handleClose} 
                >
                    Feed
                </MenuItem>
                <MenuItem 
                    onClick={handleClose} 
                >
                    Followers 
                </MenuItem>
                <MenuItem 
                    onClick={handleClose} 
                >
                    Communities
                </MenuItem>
            </Menu>
        </div>
    );
}