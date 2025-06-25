// Copyright © 2025 Broadcom Inc. and its subsidiaries. All Rights Reserved.
import React from 'react';
import { Slider } from '@mui/material';

export const ConfirmSlider = ({
    classes,
    confirmed = false,
    onChange = () => {},
    ...props
}) => {
    return (
        <Slider
            disabled={confirmed}
            classes={classes}
            onChange={onChange}
            {...props}
        />
    );
};
