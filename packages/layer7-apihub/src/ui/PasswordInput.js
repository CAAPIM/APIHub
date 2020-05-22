import React, { useState } from 'react';
import { TextInput } from 'react-admin';
import { useTranslate } from 'ra-core';
import { InfoOutlined, Visibility, VisibilityOff } from '@material-ui/icons';
import { makeStyles, IconButton, InputAdornment } from '@material-ui/core';

import { HtmlTooltip } from './HtmlTooltip';

export const PasswordInput = ({ title, ...props }) => {
    const [passwordVisible, setPasswordVisible] = usePasswordVisibility();
    const translate = useTranslate();
    const classes = useStyles(props);

    return (
        <TextInput
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
                            >
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
        />
    );
};

export const usePasswordVisibility = initialValue => {
    const [visible, setVisible] = useState(initialValue);

    const toggleVisibility = () => {
        setVisible(!visible);
    };

    return [visible, toggleVisibility];
};

const useStyles = makeStyles({
    tootip: {
        cursor: 'pointer',
    },
});
