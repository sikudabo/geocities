import React, { useState } from 'react';
import PropTypes from 'prop-types';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab'; 
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography'; 
import PhoneIcon from '@material-ui/icons/Phone'; 
import FavoriteIcon from '@material-ui/icons/Favorite'; 
import PersonIcon from '@material-ui/icons/AccountCircle';
import { makeStyles } from '@material-ui/core/styles'; 

const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
        backgroundColor: theme.palette.background.paper,
    },
}));

function TabPanel(props) {
    const { children, value, index, ...other } = props;

    return (
        <div 
            role='tabpanel' 
            hidden={value !== index} 
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
        >
            {value === index && 
                <Box 
                    p={2} 
                >
                    <Typography>
                        {children}
                    </Typography>
                </Box>
            }
        </div>
    );
}

TabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.any.isRequired,
    value: PropTypes.any.isRequired,
};

function a11yProps(index) {
    return {
        id: `simple-tab-${index}`,
        'aria-controls': `simple-tabpanel-${index}`,
    };
}

export default function TabsExample() {
    const classes = useStyles();
    const [value, setValue] = useState(0);

    function handleChange(event, newValue) {
        setValue(newValue);
    }

    return (
        <div 
            className={classes.root} 
        >
            <AppBar 
                position='sticky' 
                color='primary' 
                dense 
            >
                <Tabs 
                    value={value} 
                    onChange={handleChange} 
                    variant='fullWidth' 
                >
                    <Tab 
                        label='recents' 
                        icon={
                            <PhoneIcon />
                        }
                        {...a11yProps(0)} 
                    />
                    <Tab 
                        label='favorites' 
                        icon={
                            <FavoriteIcon />
                        }
                        {...a11yProps(1)} 
                    />
                    <Tab 
                        label='nearby' 
                        icon={
                            <PersonIcon />
                        }
                        {...a11yProps(2)} 
                    />
                </Tabs>
            </AppBar>
            <TabPanel 
                index={0} 
                value={value} 
            >
                Recent phone calls.
            </TabPanel>
            <TabPanel 
                index={1}
                value={value} 
            >
                You have some likes!
            </TabPanel>
            <TabPanel 
                index={2}
                value={value} 
            >
                Here are people nearby.
            </TabPanel>
        </div>
    );
}
