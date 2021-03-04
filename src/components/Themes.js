import React from 'react';
import Button from '@material-ui/core/Button';
import { ThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import { connect } from 'react-redux';

function Themes(props) {
    const theme = createMuiTheme({
        palette: {
            primary: {
                main: 'rgb(0, 0, 72)',
            },
            type: props.theme,
        },
    });

    return (
        <ThemeProvider 
            theme={theme} 
        >
            <CssBaseline />
            <Button 
                color='primary' 
            >
                Primary 
            </Button>
            <Button>
                Default 
            </Button>
        </ThemeProvider>
    )
}

function mapStateToProps(state) {
    return {
        theme: state.themeReducer.theme,
    };
}

export default connect(mapStateToProps)(Themes);