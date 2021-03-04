import React from 'react';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import { ThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import purple from '@material-ui/core/colors/purple';
import green from '@material-ui/core/colors/green';

const theme = createMuiTheme({
    palette: {
        primary: {
            main: purple[900],
        },
        waygo: {
            main: green[900],
        },
    },
});

export default function TextFieldExample() {
    return (
        <ThemeProvider 
            theme={theme} 
        >
            <Grid 
                container 
            >
                <Grid 
                    item 
                    xs 
                >
                    <TextField
                        label='TextField' 
                        placeholder='Username'
                        helperText='Enter your username' 
                        variant='outlined'
                        color='waygo'
                        fullWidth 
                    />
                </Grid>
            </Grid>
        </ThemeProvider>
    );
}