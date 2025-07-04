// Copyright © 2025 Broadcom Inc. and its subsidiaries. All Rights Reserved.
import React, { useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
    email,
    required,
    SimpleForm,
    TextInput,
    useTranslate,
} from 'react-admin';
import { Link, Typography } from '@mui/material';
import { makeStyles } from 'tss-react/mui';
import isEmpty from 'lodash/isEmpty';
import { SignUpToolbar } from './SignUpToolbar';
import { ConfirmSlider } from '../../ui';
import { getErrorMessage } from '../../useLayer7Notify';

export const SignUpForm = props => {
    const { classes } = useStyles(props);
    const { onSubmit = () => {}, toolbarProps, serverError } = props;
    let showError = false;
    const {
        title,
        form,
        colorAlert,
        colorTextSecondary,
        confirmSliderHeader,
        ...sliderClasses
    } = classes;
    const translate = useTranslate();
    const [formConfirmed, setFormConfirmed] = useState(false);
    const [showSliderAlert, setShowSliderAlert] = useState(false);
    const [sliderLabelColor, setSliderLabelColor] = useState('textPrimary');
    const submit = data => {
        const { EmailConfirmation, ...registration } = data;

        if (!formConfirmed) {
            setShowSliderAlert(true);
            return;
        }

        onSubmit(registration);
    };

    const sliderChange = (event, value) => {
        if (value === 100) {
            setFormConfirmed(true);
            setSliderLabelColor('textSecondary');
            setShowSliderAlert(false);
        } else {
            setFormConfirmed(false);
        }
    };

    const validate = () => {
        if (!isEmpty(serverError) && !showError) {
            const { error } = serverError;
            const message = getErrorMessage(error);
            showError = true;
            return {
                OrganizationName: message,
            };
        }
    };

    return (
        <>
            <SimpleForm
                sanitizeEmptyValues={true}
                className={classes.form}
                onSubmit={submit}
                toolbar={<SignUpToolbar {...toolbarProps} />}
                validate={validate}
            >
                <TextInput
                    source="email"
                    type="email"
                    label="resources.registrations.fields.email"
                    variant="outlined"
                    fullWidth
                    validate={ValidateEmail}
                />
                <TextInput
                    source="emailConfirmation"
                    type="email"
                    label="resources.registrations.fields.email_confirmation"
                    variant="outlined"
                    fullWidth
                    validate={ValidateEmailConfirmation}
                />
                <TextInput
                    source="organizationName"
                    type="text"
                    label="resources.registrations.fields.organization"
                    variant="outlined"
                    fullWidth
                />
                <TextInput
                    source="organizationDescription"
                    type="text"
                    label="resources.registrations.fields.organization_description"
                    variant="outlined"
                    fullWidth
                    multiline
                />
                <>
                    <ConfirmSliderHeader
                        classes={classes}
                        sliderLabelColor={sliderLabelColor}
                        showAlert={showSliderAlert}
                    />
                    <ConfirmSlider
                        confirmed={formConfirmed}
                        classes={sliderClasses}
                        onChange={sliderChange}
                        slotProps={{
                            Thumb: ConfirmSliderThumb,
                        }}
                    />
                </>
            </SimpleForm>

            <Typography variant="body1" align="center">
                <Link component={RouterLink} to="/login">
                    {translate('resources.registrations.actions.login')}
                </Link>
            </Typography>
        </>
    );
};

const ValidateEmail = [required(), email()];
const ValidateEmailConfirmation = [
    required(),
    email(),
    validateAreEqual('email', 'emailConfirmation'),
];

export function validateAreEqual(
    field1,
    field2,
    message = 'resources.registrations.notifications.email_confirmation_error'
) {
    return (value, allValues) => {
        return allValues[field1] === allValues[field2] ? undefined : message;
    };
}

const ConfirmSliderThumb = props => {
    const translate = useTranslate();
    return (
        <Typography variant="body2" align="center" {...props}>
            {props.confirmed
                ? translate('resources.registrations.slider.confirmed')
                : translate('resources.registrations.slider.unconfirmed')}
        </Typography>
    );
};

const ConfirmSliderHeader = ({
    classes,
    showAlert,
    sliderLabelColor,
    ...props
}) => {
    const translate = useTranslate();
    return (
        <div className={classes.confirmSliderHeader}>
            <Typography
                gutterBottom
                color={sliderLabelColor}
                classes={{
                    colorTextSecondary: classes.colorTextSecondary,
                }}
            >
                {translate('resources.registrations.fields.robot')}
            </Typography>
            {showAlert && (
                <Typography
                    variant="caption"
                    gutterBottom
                    color="textPrimary"
                    classes={{ root: classes.colorAlert }}
                >
                    {translate(
                        'resources.registrations.notifications.confirmation_required'
                    )}
                </Typography>
            )}
        </div>
    );
};

const useStyles = makeStyles({ name: 'Layer7SignUpForm' })(theme => ({
    form: {
        '& >:first-child': {
            padding: 0,
        },
    },
    title: {
        fontSize: theme.typography.fontSize * 2,
        marginBottom: theme.spacing(6),
        color: theme.palette.getContrastText(theme.palette.background.default),
    },
    root: {
        margin: '5px 0 20px 0',
        width: '50%',
    },
    thumb: {
        height: 38,
        width: '100%',
        backgroundColor: theme.palette.grey[500],
        color: theme.palette.grey[800],
        borderRadius: 2,
        marginTop: -2,
        marginLeft: 60,
        '&:focus, &:hover, &$active': {
            boxShadow: 'inherit',
        },
        '&:hover': {
            backgroundColor: theme.palette.grey[300],
        },
        '&.Mui-disabled': {
            height: 38,
            width: '100%',
            backgroundColor: theme.palette.success.dark,
            color: theme.palette.common.white,
            borderRadius: 2,
            marginTop: -2,
        },
    },
    rail: {
        height: 34,
        borderRadius: 2,
        width: '200%',
    },
    track: {
        height: 34,
        borderRadius: 2,
    },
    disabled: {},
    colorTextSecondary: {
        color: theme.palette.success.dark,
    },
    colorAlert: {
        paddingLeft: 5,
        color: theme.palette.error.main,
    },
    confirmSliderHeader: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'baseline',
    },
}));
