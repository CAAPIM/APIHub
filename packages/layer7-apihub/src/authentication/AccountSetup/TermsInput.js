// Copyright © 2025 Broadcom Inc. and its subsidiaries. All Rights Reserved.
import React, { useState, useCallback } from 'react';
import { Link, InputHelperText, useInput, useTranslate } from 'react-admin';
import {
    FormGroup,
    FormControlLabel,
    FormHelperText,
    Checkbox,
    Typography,
} from '@mui/material';

import { TermsDialog } from './TermsDialog';

export const TermsInput = ({ helperText, ...rest }) => {
    const {
        field: { onChange, value, ...inputProps },
        fieldState: { error, isTouched },
    } = useInput({
        ...rest,
    });

    const handleChange = useCallback(
        (_, value) => {
            onChange(value);
        },
        [onChange]
    );

    return (
        <FormGroup>
            <FormControlLabel
                control={<Checkbox onChange={handleChange} {...inputProps} />}
                label={<TermsLabel />}
                labelPlacement="end"
            />
            <FormHelperText error={!!error}>
                <InputHelperText
                    touched={isTouched}
                    error={error?.message}
                    helperText={helperText}
                />
            </FormHelperText>
        </FormGroup>
    );
};

export const TermsLabel = () => {
    const translate = useTranslate();
    const [isOpen, setIsOpen] = useState();

    const handleOpen = event => {
        event.preventDefault();
        setIsOpen(true);
    };

    const handleClose = () => {
        setIsOpen(false);
    };

    return (
        <>
            <Typography variant="body1">
                {translate(
                    'apihub.account_setup.terms_of_use.terms_of_use_acknowledgement'
                )}
                <Link to="#" onClick={handleOpen}>
                    {translate(
                        'apihub.account_setup.terms_of_use.terms_of_use'
                    )}
                </Link>
            </Typography>
            {isOpen === true && (
                <TermsDialog open={isOpen} onClose={handleClose} />
            )}
        </>
    );
};
