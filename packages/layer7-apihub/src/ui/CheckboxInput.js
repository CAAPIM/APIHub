// Copyright © 2025 Broadcom Inc. and its subsidiaries. All Rights Reserved.
import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormHelperText from '@mui/material/FormHelperText';
import FormGroup from '@mui/material/FormGroup';
import Checkbox from '@mui/material/Checkbox';
import { makeStyles } from 'tss-react/mui';
import { InputHelperText, FieldTitle, useInput } from 'react-admin';
import { isValidElement } from 'react';

const CheckboxInput = ({
    format,
    label,
    fullWidth,
    helperText,
    onBlur,
    onChange,
    onFocus,
    options,
    disabled,
    parse,
    resource,
    source,
    validate,
    ...rest
}) => {
    const {
        id,
        field: { onChange: finalFormOnChange, ...inputProps },
        isRequired,
        fieldState: { error },
    } = useInput({
        format,
        onBlur,
        onChange,
        onFocus,
        parse,
        resource,
        source,
        type: 'checkbox',
        validate,
        ...rest,
    });

    const { classes } = useStyles();

    const handleChange = useCallback(
        (event, value) => {
            finalFormOnChange(value);
        },
        [finalFormOnChange]
    );

    return (
        <FormGroup {...rest}>
            <FormControlLabel
                control={
                    <Checkbox
                        id={id}
                        onChange={handleChange}
                        {...inputProps}
                        {...options}
                        disabled={disabled}
                        className={classes.checkbox}
                    />
                }
                label={
                    isValidElement(label) ? (
                        label
                    ) : (
                        <FieldTitle
                            label={label}
                            source={source}
                            resource={resource}
                            isRequired={isRequired}
                        />
                    )
                }
            />
            <FormHelperText error={!!error}>
                <InputHelperText
                    error={error?.message}
                    helperText={helperText}
                />
            </FormHelperText>
        </FormGroup>
    );
};

CheckboxInput.propTypes = {
    label: PropTypes.any,
    options: PropTypes.shape(Checkbox.propTypes),
    disabled: PropTypes.bool,
};

CheckboxInput.defaultProps = {
    options: {},
};

export default CheckboxInput;

const useStyles = makeStyles()({
    checkbox: {
        alignSelf: 'center',
        paddingTop: '2',
    },
});
