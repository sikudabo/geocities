import React, { useState } from 'react';
import Checkbox from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
export default function CheckboxExample() {
    const [checked, setChecked] = useState(false);

    function handleChange(e) {
        setChecked(e.target.checked);
    }

    return (
        <Grid 
            container 
        >
            <Grid 
                item 
                xs={12} 
            >
                {checked &&
                    <Typography 
                        variant='body1'
                        component='p' 
                    >
                        I am checked 
                    </Typography>
                }
            </Grid>
            <Grid 
                item 
                xs={12} 
            >
                <FormControlLabel 
                    label='Agree to terms and conditions'
                    required 
                    control={
                        <Checkbox 
                            color='primary'
                        />
                    }
                    name='terms' 
                    value={checked}
                    onChange={handleChange}
                    labelPlacement='start'
                    required 
                />
            </Grid>
        </Grid>
    );
}