import React, { useState, useEffect } from 'react';
import FormControl from '@material-ui/core/FormControl';
import FormHelperText from '@material-ui/core/FormHelperText';
import InputLabel from '@material-ui/core/InputLabel';
import NativeSelect from '@material-ui/core/NativeSelect';

export default function SelectExample() {
    const [selected, setSelected] = useState([]);

    function handleChange(e) {
        setSelected(e.target.value);
    }

    return (
        <FormControl>
            <InputLabel 
                htmlFor='select' 
            >
                Age 
            </InputLabel>
            <NativeSelect 
                value={selected} 
                onChange={handleChange} 
                multiple
                color='primary'
                id='select'
            >
                <option 
                    value={20} 
                >
                    20
                </option>
                <option 
                    value={30} 
                >
                    30
                </option>
                <option 
                    value={40} 
                >
                    40
                </option>
            </NativeSelect>
            <FormHelperText>
                Select an age range 
            </FormHelperText>
        </FormControl>
    );
}