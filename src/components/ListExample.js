import React from 'react';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemText from '@material-ui/core/ListItemText';
import Avatar from '@material-ui/core/Avatar';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import Simeon from '../site-images/simeon.jpg';
import Meghan from '../site-images/meghan.jpg';
import IuFootball from '../site-images/iu_football.png';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
    list: {
        padding: theme.spacing(2),
        margin: 'auto',
        maxWidth: 345,
    },
}));

const ListItemLink = function(props) {
    return (
        <ListItem 
            component='a' 
            {...props} 
            button
        />
    );
}

const people = [
    {
        img: Simeon,
        heading: 'Brunch the weekend?',
        name: 'Simeon Ikudabo',
        msg: 'I was wondering if you would be interested in getting some brunch over the...',
    },
    {
        img: Meghan,
        heading: 'Acquisition',
        name: 'Meghan Gulvas',
        msg: 'Facebook contacted us about an acquisition. I want to explain the legal...',
    },
    {
        img: IuFootball,
        heading: 'Purdue',
        name: 'Michael Penix',
        msg: 'Hey bro. You know this is a major week. Why? Because it is the Purdue...',
    },
];

export default function ListExample() {
    const classes = useStyles();

    return (
        <div>
            <List 
                className={classes.list} 
            >
                {people.map((person, index) => {
                    return (
                        <div 
                            key={index.toString()} 
                        >
                            <ListItemLink
                                href='https://www.excite.social'
                            >
                                <ListItemAvatar>
                                    <Avatar 
                                        src={person.img}
                                        alt={person.name} 
                                    />
                                </ListItemAvatar>
                                <ListItemText 
                                    primary={
                                        <Typography 
                                            varaint='overline' 
                                        >
                                            {person.heading}
                                        </Typography>
                                    }
                                    secondary={
                                        <React.Fragment>
                                            <Typography 
                                                variant='caption' 
                                                component='p' 
                                                style={{
                                                    fontWeight: 'bold',
                                                }}
                                            >
                                                {person.name}
                                            </Typography>
                                            <Typography 
                                                varaint='caption'
                                                color='textSecondar' 
                                            >
                                                - {person.msg}
                                            </Typography>
                                        </React.Fragment>
                                    }
                                />
                            </ListItemLink>
                            {index < people.length - 1 && 
                                <Divider /> 
                            }
                        </div>
                    );
                })}
            </List>
        </div>
    );
}

