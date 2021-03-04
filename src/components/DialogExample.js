import React, { useState } from 'react';
import Grid from '@material-ui/core/Grid';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar'; 
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Divider from '@material-ui/core/Divider';
import CloseIcon from '@material-ui/icons/Close';

export default function DialogExample() {
    const [open, setOpen] = useState(false);

    function handleChange() {
        setOpen(!open);
    }

    function handleClose() {
        setOpen(false);
    }

    return (
        <Grid 
            container
        >
            <Grid 
                item 
                xs={12} 
            >
                <Button 
                    color='primary' 
                    variant='outlined' 
                    onClick={handleChange} 
                >
                    Open Dialog 
                </Button>
                <Dialog 
                    open={open} 
                    fullScreen
                    onClose={handleClose}
                >
                    <DialogContent>
                        <AppBar
                            color='primary' 
                            position='sticky'
                        >
                            <Toolbar>
                                <IconButton
                                    onClick={handleClose} 
                                    style={{
                                        color: 'rgb(255, 255, 255)'
                                    }}
                                >
                                    <CloseIcon />
                                </IconButton>
                                <Typography>
                                    Sound 
                                </Typography>
                                <Button 
                                    style={{
                                        marginLeft: 'auto',
                                        color: 'rgb(255, 255, 255)'
                                    }}
                                    size='small'
                                >
                                    Save
                                </Button>
                            </Toolbar>
                        </AppBar>
                        <List>
                            <ListItem>
                                <ListItemText 
                                    primary='Phone Rington' 
                                    secondary='Titania' 
                                />
                            </ListItem>
                            <Divider />
                            <ListItem>
                                <ListItemText 
                                    primary='Default notification rington' 
                                    secondary='(Itro) Complete' 
                                />
                            </ListItem>
                        </List>
                    </DialogContent>
                </Dialog>
            </Grid>
        </Grid>
    );
}