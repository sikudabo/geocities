import React, { useState, useEffect } from 'react';
import Grid from '@material-ui/core/Grid';
import FormControl from '@material-ui/core/FormControl'
import InputLabel from '@material-ui/core/InputLabel';
import Switch from '@material-ui/core/Switch';
import { connect } from 'react-redux';

function SwitchExample(props) {
    const [mode, setMode] = useState(false);

    useEffect(() => {
        console.log(props);
    }, []);

    useEffect(() => {
        console.log(mode);
    }, [mode]);

    function changeMode(e) {
        if(e.target.value === false) {
            console.log(mode);
            setMode(!mode);
            props.dispatch({type: 'theme/dark'});
        }
        else {
            console.log(e.target);
            console.log(mode);
            setMode(!mode);
            props.dispatch({type: 'theme/light'});
        }
    }

    return (
        <Grid 
            container 
        >
            <Grid 
                item 
                xs={12} 
            >
                <FormControl>
                    <InputLabel 
                        htmlFor='switch' 
                    >
                        {mode ? 'light mode' : 'dark mode'}
                    </InputLabel>
                    <Switch 
                        value={mode}
                        onChange={changeMode} 
                        color='primary' 
                        id='switch'
                        checked={mode}
                    />
                </FormControl>
            </Grid>
        </Grid>
    );
}

function mapStateToProps(state) {
    return {
        theme: state.themeReducer.theme,
    };
}

export default connect(mapStateToProps)(SwitchExample);