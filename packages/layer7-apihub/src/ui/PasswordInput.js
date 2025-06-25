// Copyright © 2025 Broadcom Inc. and its subsidiaries. All Rights Reserved.
import React, { useState } from 'react';
import { TextInput, useTranslate } from 'react-admin';
import { InfoOutlined, Visibility, VisibilityOff } from '@mui/icons-material';
import { IconButton, InputAdornment } from '@mui/material';

import { makeStyles } from 'tss-react/mui';

import { HtmlTooltip } from './HtmlTooltip';

export const PasswordInput = ({ title, ...props }) => {
    const [passwordVisible, setPasswordVisible] = usePasswordVisibility();
    const translate = useTranslate();
    const { classes } = useStyles();

    return (
        (<TextInput
            type={passwordVisible ? 'text' : 'password'}
            variant="outlined"
            InputProps={{
                endAdornment: (
                    <InputAdornment position="end">
                        <>
                            <IconButton
                                aria-label={translate(
                                    passwordVisible
                                        ? 'ra.input.password.toggle_visible'
                                        : 'ra.input.password.toggle_hidden'
                                )}
                                onClick={setPasswordVisible}
                                size="large">
                                {passwordVisible ? (
                                    <VisibilityOff />
                                ) : (
                                    <Visibility />
                                )}
                            </IconButton>
                            {title ? (
                                <HtmlTooltip
                                    className={classes.tootip}
                                    title={translate(title)}
                                    placement="right"
                                    arrow
                                >
                                    <InfoOutlined />
                                </HtmlTooltip>
                            ) : null}
                        </>
                    </InputAdornment>
                ),
            }}
            {...props}
        />)
    );
};

export const usePasswordVisibility = initialValue => {
    const [visible, setVisible] = useState(initialValue);

    const toggleVisibility = () => {
        setVisible(!visible);
    };

    return [visible, toggleVisibility];
};

const useStyles = makeStyles()(
    {
        tootip: {
            cursor: 'pointer',
        },
    },
    {
        name: 'Layer7PasswordInput',
    }
);
