import React, { useState, useCallback } from 'react';
import { Link, InputHelperText, useInput, useTranslate } from 'react-admin';
import {
    FormGroup,
    FormControlLabel,
    FormHelperText,
    Checkbox,
    Typography,
} from '@material-ui/core';

import { TermsDialog } from './TermsDialog';

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
                {translate('apihub.account_setup.terms_of_use_acknowledgement')}
                <Link to="#" onClick={handleOpen}>
                    {translate('apihub.account_setup.terms_of_use')}
                </Link>
            </Typography>
            {isOpen === true && (
                <TermsDialog open={isOpen} onClose={handleClose} />
            )}
        </>
    );
};

export const TermsInput = ({ helperText, ...rest }) => {
    const {
        input: { onChange, type, value, ...inputProps },
        meta: { error, touched },
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
                control={
                    <Checkbox
                        color="primary"
                        onChange={handleChange}
                        {...inputProps}
                    />
                }
                label={<TermsLabel />}
                labelPlacement="end"
            />
            <FormHelperText error={!!error}>
                <InputHelperText
                    touched={touched}
                    error={error}
                    helperText={helperText}
                />
            </FormHelperText>
        </FormGroup>
    );
};
