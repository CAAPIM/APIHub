// Copyright © 2025 Broadcom Inc. and its subsidiaries. All Rights Reserved.
import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormHelperText from '@mui/material/FormHelperText';
import FormGroup from '@mui/material/FormGroup';
import Switch from '@mui/material/Switch';
import { makeStyles } from 'tss-react/mui';
import {
    InputHelperText,
    FieldTitle,
    useInput,
    useResourceContext,
} from 'react-admin';
import { isValidElement } from 'react';

const ToggleSwitchInput = ({
    format,
    label,
    fullWidth,
    helperText,
    onBlur,
    onChange,
    onFocus,
    options = {},
    disabled,
    parse,
    source,
    validate,
    ...rest
}) => {
    let resource = useResourceContext();
    if (rest.resource != null) {
        resource = rest.resource;
    }
    const {
        id,
        field: { onChange: finalFormOnChange, value },
        fieldState: { error, isTouched },
        isRequired,
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
        event => {
            finalFormOnChange(event.target.checked);
        },
        [finalFormOnChange]
    );

    return (
        <FormGroup {...rest}>
            <FormControlLabel
                control={
                    <Switch
                        id={id}
                        onChange={handleChange}
                        disabled={disabled}
                        className={classes.checkbox}
                        checked={value}
                        {...options}
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
                    touched={isTouched}
                    error={error?.message}
                    helperText={helperText}
                />
            </FormHelperText>
        </FormGroup>
    );
};

ToggleSwitchInput.propTypes = {
    label: PropTypes.any,
    options: PropTypes.shape(Switch.propTypes),
    disabled: PropTypes.bool,
};

export default ToggleSwitchInput;

const useStyles = makeStyles()({
    checkbox: {
        alignSelf: 'center',
        paddingTop: '2',
    },
});
