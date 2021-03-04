import React, { useState } from 'react';
import BottomNavigation from '@material-ui/core/BottomNavigation';
import BottomNavigationAction from '@material-ui/core/BottomNavigationAction';
import RestoreIcon from '@material-ui/icons/Restore';
import FavoriteIcon from '@material-ui/icons/Favorite';
import RoomIcon from '@material-ui/icons/Room';

export default function BottomNavigationExample() {
    const [value, setValue] = useState(0);

    function handleChange(event, newValue) {
        setValue(newValue);
    }

    return (
        <BottomNavigation 
            value={value} 
            onChange={handleChange} 
            showLabels 
        >
            <BottomNavigationAction 
                label='recents' 
                icon={<RestoreIcon />} 
            />
            <BottomNavigationAction 
                label='likes' 
                icon={<FavoriteIcon />} 
            />
            <BottomNavigationAction 
                label='nearby' 
                icon={<RoomIcon />} 
            />
        </BottomNavigation>
    );
}