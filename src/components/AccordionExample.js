import React, { useState } from 'react';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

export default function AccordionExample() {
    const [checked, setChecked] = useState(false);

    function handleChange(e) {
        setChecked(e.target.checked);
    }

    return (
        <div>
            {[0, 1, 2].map((item, index) => {
                return (
                    <Accordion 
                        key={index.toString()}
                    >
                        <AccordionSummary 
                            expandIcon={<ExpandMoreIcon />} 
                        >
                            <FormControlLabel 
                                label='Please agree to the terms of service before continuing' 
                                onChange={e => {e.stopPropagation(); handleChange(e)}}
                                onFocus={e => e.stopPropagation()} 
                                checked={checked}
                                control={<Checkbox color='primary' />} 
                                labelPlacement='start'
                            />
                        </AccordionSummary>
                        <AccordionDetails>
                            <Typography 
                                variant='body1' 
                                component='p' 
                                color='textSecondary' 
                            >
                                You agree that we can harvest your data and share it with anyone we want. 
                                You lose the right to handle any of your own data. We control this data and 
                                we can use it however we want. We will continously sell your data so that we 
                                can get rich.
                            </Typography>
                        </AccordionDetails>
                    </Accordion>
                );
            })}
        </div>
    );
}