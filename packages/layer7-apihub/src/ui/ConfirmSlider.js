import React from 'react';
import { Slider } from '@material-ui/core';

export const ConfirmSlider = ({
    classes,
    confirmed = false,
    onChange = () => {},
    ...rest
}) => {
    return (
        <Slider
            disabled={confirmed}
            classes={classes}
            onChange={onChange}
            {...rest}
        />
    );
};
