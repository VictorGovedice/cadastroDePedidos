import React from 'react';

const Input = ({ placeholder, leftIcon, ...rest }) => (
    <div>
        {leftIcon && <span>{leftIcon}</span>}
        <input placeholder={placeholder} {...rest} />
    </div>
);

export { Input };