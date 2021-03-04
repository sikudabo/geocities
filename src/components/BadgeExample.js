import React, { useState } from 'react';
import Grid from '@material-ui/core/Grid';
import ButtonGroup from '@material-ui/core/ButtonGroup';
import Button from '@material-ui/core/Button';
import Switch from '@material-ui/core/Switch';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Badge from '@material-ui/core/Badge';
import MailIcon from '@material-ui/icons/Mail';
import AddIcon from '@material-ui/icons/Add';
import MinusIcon from '@material-ui/icons/Remove';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(() => ({
    container: {
        marginTop: 20,
        textAlign: 'center',
    },
}));

export default function BadgeExample() {
    const classes = useStyles();
    const [count, setCount] = useState(0);
    const [visibility, setVisibility] = useState(false);

    function handleChange() {
        setVisibility(!visibility);
    }

    function handleCount(what) {
        if(what === 'add') {
            setCount(count + 1);
        }
        else if(what === 'subtract') {
            setCount(count - 1);
        }
    }

    return (
        <Grid 
            container 
            className={classes.container} 
        >
            <Grid 
                item 
                container 
                xs={12} 
                spacing={2}
            >
                <Grid
                    item 
                    xs 
                >
                    <Badge 
                        badgeContent={count} 
                        color='primary' 
                    >
                        <MailIcon />
                    </Badge>
                </Grid>
                <Grid 
                    item 
                    xs 
                >
                    <ButtonGroup
                        variant='outlined'
                        color='primary' 
                        orientation='vertical'
                    >
                        <Button 
                            onClick={() => handleCount('subtract')} 
                        >
                            <MinusIcon />
                        </Button>
                        <Button 
                            onClick={() => handleCount('add')} 
                        >
                            <AddIcon />
                        </Button>
                    </ButtonGroup>
                </Grid>
            </Grid>
            <Grid 
                item 
                container 
                xs={12} 
                spacing={2}
            >
                <Grid 
                    item 
                    xs 
                >
                    <Badge 
                        invisible={!visibility}
                        color='primary'
                        variant='dot' 
                    >
                        <MailIcon />
                    </Badge>
                </Grid>
                <Grid 
                    item 
                    xs 
                >
                    <FormControlLabel 
                        label={visibility ? 'Switch off' : 'Switch on'}
                        labelPlacement='end' 
                        control={<Switch color='primary' checked={visibility} />}
                        onChange={handleChange} 
                    />
                </Grid>
            </Grid>
        </Grid>
    );
}