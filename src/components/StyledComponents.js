import React from 'react';
import Button from '@material-ui/core/Button';
import { styled } from '@material-ui/core/styles';

const MyButton = styled(Button)({
    background: 'linear-gradient(45deg, rgb(0, 0, 72) 40%, rgb(226, 12, 70))',
    border: 0,
    borderRadius: 3,
    color: 'white',
    fontWeight: 'bold',
});

export default function StyledComponents() {
    return (
        <MyButton>
            Press
        </MyButton>
    );
}