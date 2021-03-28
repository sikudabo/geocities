import React, { useState, useEffect, useRef } from 'react';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import axios from 'axios';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import ListItem from '@material-ui/core/ListItem';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemText from '@material-ui/core/ListItemText';
import Avatar from '@material-ui/core/Avatar';
import swal from 'sweetalert';
import { connect } from 'react-redux';
import { useHistory, useParams } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import Backdrop from '@material-ui/core/Backdrop';
import CircularProgress from '@material-ui/core/CircularProgress';
import InputAdornment from '@material-ui/core/InputAdornment';
import IconButton from '@material-ui/core/IconButton';
import Icon from '@mdi/react';
import { mdiSend, mdiDelete } from '@mdi/js';

const useStyles = makeStyles(() => ({
    topMarg: {
        marginTop: 100,
    },
    paper: {
        maxWidth: 600,
        margin: 'auto',
    },
}));

function ThreadComponent(props) {
    const classes = useStyles();
    const params = useParams();
    const history = useHistory();
    const gridRef = useRef();
}