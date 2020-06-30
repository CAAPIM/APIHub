import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormGroup from '@material-ui/core/FormGroup';
import Checkbox from '@material-ui/core/Checkbox';
import { FieldTitle, useInput } from 'ra-core';
import { makeStyles } from '@material-ui/core/styles';

import { InputHelperText, InputPropTypes } from 'react-admin';
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
        input: { onChange: finalFormOnChange, type, value, ...inputProps },
        isRequired,
        meta: { error, touched },
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

    const classes = useStyles();

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
                        color="primary"
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
                    touched={touched}
                    error={error}
                    helperText={helperText}
                />
            </FormHelperText>
        </FormGroup>
    );
};

CheckboxInput.propTypes = {
    ...InputPropTypes,
    label: PropTypes.any,
    options: PropTypes.shape(Checkbox.propTypes),
    disabled: PropTypes.bool,
};

CheckboxInput.defaultProps = {
    options: {},
};

export default CheckboxInput;

const useStyles = makeStyles({
    checkbox: {
        alignSelf: 'flex-start',
        paddingTop: 0,
    },
});
