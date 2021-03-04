import React from 'react';
import ButtonGroup from '@material-ui/core/ButtonGroup';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';

const numbers = [
    'one',
    'two',
    'three',
];

export default function BgExample() {
    return (
        <Grid 
            container 
        >
            <Grid 
                item 
                xs={12} 
            >
                <ButtonGroup 
                    color='primary' 
                    aria-label='buttons grouped' 
                >
                    {numbers.map((num, index) => {
                        return (
                            <Button 
                                key={index.toString()} 
                                aria-label='button' 
                            >
                                {num}
                            </Button>
                        )
                    })}
                </ButtonGroup>
            </Grid>
            <Grid 
                item 
                xs={12} 
            >
                <ButtonGroup 
                    aria-label='buttons grouped' 
                    color='primary' 
                    variant='contained' 
                    disableElevation
                >
                    {numbers.map((num, index) => {
                        return (
                            <Button 
                                key={index.toString()} 
                                aria-label='button' 
                            >
                                {num}
                            </Button>
                        )
                    })}
                </ButtonGroup>
            </Grid>
            <Grid 
                item 
                xs={12} 
            >
                <ButtonGroup 
                    variant='text'
                    color='primary' 
                    aria-label='buttons grouped' 
                >
                    {numbers.map((num, index) => {
                        return (
                            <Button 
                                key={index.toString()}
                                aria-label='button'
                            >
                                {num}
                            </Button>
                        )
                    })}
                </ButtonGroup>
            </Grid>
        </Grid>
    );
}