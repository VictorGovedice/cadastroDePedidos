import React from 'react';
import { ButtonContainer } from './styles';

const Button = ({ title, variant, type, onClick }) => (
    <ButtonContainer variant={variant} type={type} onClick={onClick}>
        {title}
    </ButtonContainer>
);

export { Button };
