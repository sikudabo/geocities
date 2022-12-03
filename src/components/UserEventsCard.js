import React from 'react';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardMedia from '@material-ui/core/CardMedia';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import Typography from '@material-ui/core/Typography';
import { useHistory } from 'react-router-dom';
import { HashLink as Link } from 'react-router-hash-link';
import Button from '@material-ui/core/Button';
import Avatar from '@material-ui/core/Avatar';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
    card: {
        maxWidth: 600,
        margin: 'auto',
        padding: theme.spacing(2),
        backgroundColor: theme.palette.background.paper,
    },
    media: {
        height: 0,
        padding: '56.25%',
    },
    image: {
        maxWidth: '100%',
        maxHeight: '100%',
    },
    basicLink: {
        textDecoration: 'none',
    }
}));

export default function UserEventsCard(props) {
    const classes = useStyles();
    const history = useHistory();

    return (
        <Card 
            variant='outlined' 
            className={classes.card}
        >
            <CardHeader 
                title={
                    <Typography 
                        variant='h6' 
                        component='h6' 
                        style={{
                            cursor: 'pointer',
                        }}
                    >
                        {props.username}
                    </Typography>
                }
                subheader={
                    <div>
                        <Typography 
                            variant='subtitle1' 
                            component='span' 
                            color='textSecondary' 
                        >
                            {props.dateString}
                        </Typography>
                    </div>
                }
                avatar={
                    <Avatar 
                        src={`https://www.geocities.cc/api/get/avatar/by/id/${props.uniqueUserId}`}
                        alt={`${props.username}`}
                        title={`${props.username}`} 
                        style={{
                            cursor: 'pointer',
                        }}
                    />
                }
            />
             <CardMedia 
                component='img'
                src={`https://www.geocities.cc/api/get-photo/${props.src}`}
                title={`Post by ${props.username}`}
                alt='GeoCities Event'
            />
            <CardContent>
                <Typography 
                    variant='h6' 
                    component='h6' 
                    align='left' 
                >
                    {props.title} 
                </Typography>
                <br />
                <Typography 
                    variant='body1' 
                    component='p' 
                    align='left' 
                    style={{
                        marginTop: 30,
                    }}
                >
                    {props.description} 
                </Typography>
            </CardContent>
            <CardActions>
            <Link
                className={classes.basicLink}
                to={`/geocities/events#$${props.uniqueEventId}`}
            >
                <Button 
                    color='primary' 
                >
                    Go event
                </Button>
            </Link>
            </CardActions>
        </Card>
    );
}
