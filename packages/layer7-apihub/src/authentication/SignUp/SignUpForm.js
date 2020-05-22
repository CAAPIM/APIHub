import React, { useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
    required,
    SimpleForm,
    TextInput,
    useNotify,
    useTranslate,
} from 'react-admin';
import { CRUD_CREATE, useCreate } from 'ra-core';
import { makeStyles, Link, Typography } from '@material-ui/core';
import { SignUpToolbar } from './SignUpToolbar';
import { ConfirmSlider } from '../../ui';

const useStyles = makeStyles(theme => ({
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
        margin: '-15px 0 20px 0',
        width: '50%',
    },
    thumb: {
        height: 38,
        width: '100%',
        backgroundColor: theme.palette.grey[500],
        color: theme.palette.grey[800],
        borderRadius: 2,
        marginTop: -2,
        marginLeft: 0,
        '&:focus, &:hover, &$active': {
            boxShadow: 'inherit',
        },
        '&:hover': {
            backgroundColor: theme.palette.grey[300],
        },
        '&$disabled': {
            height: 38,
            width: '100%',
            backgroundColor: theme.palette.success.dark,
            color: theme.palette.common.white,
            borderRadius: 2,
            marginTop: -2,
            marginLeft: 0,
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
        color: theme.palette.error.main,
    },
    confirmSliderHeader: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'baseline',
    },
}));

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
    ...rest
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
                    classes={{ colorTextPrimary: classes.colorAlert }}
                >
                    {translate(
                        'resources.registrations.notifications.confirmation_required'
                    )}
                </Typography>
            )}
        </div>
    );
};

const SignUpConfirmation = props => {
    const translate = useTranslate();
    return (
        <>
            <Typography variant="h2">
                {translate(
                    'resources.registrations.notifications.confirmation_title'
                )}
            </Typography>
            <Typography variant="body2" align="center">
                {translate(
                    'resources.registrations.notifications.confirmation'
                )}
            </Typography>
            <Typography variant="body1" align="center">
                <Link component={RouterLink} to="/login">
                    {translate(
                        'resources.registrations.actions.return_to_homepage'
                    )}
                </Link>
            </Typography>
        </>
    );
};

export const SignUpForm = props => {
    const notify = useNotify();
    const classes = useStyles(props);
    const {
        title,
        form,
        colorAlert,
        colorTextSecondary,
        confirmSliderHeader,
        ...sliderClasses
    } = classes;
    const translate = useTranslate();
    const validateField = required();
    const [formConfirmed, setFormConfirmed] = useState(false);
    const [showSliderAlert, setShowSliderAlert] = useState(false);
    const [formSubmitted, setFormSubmitted] = useState(false);
    const [sliderLabelColor, setSliderLabelColor] = useState('textPrimary');
    const [create, { loading, error }] = useCreate('registrations');

    const submit = data => {
        const { EmailConfirmation, ...registration } = data;

        if (!formConfirmed) {
            setShowSliderAlert(true);
            return;
        }

        create(
            {
                payload: {
                    FormField: '',
                    Uuid: '{{GENERATED_GUID}}',
                    OrganizationName: '',
                    OrganizationDescription: '',
                    ...registration,
                },
            },
            {
                action: CRUD_CREATE,
                onSuccess: ({ data }) => {
                    notify(
                        'resources.registrations.notifications.create_success'
                    );
                    setFormSubmitted(true);
                },
                onFailure: () => {
                    notify(
                        'resources.registrations.notifications.create_error'
                    );
                },
            }
        );
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

    const validateEmailConfirmation = registration => {
        const errors = {};

        if (registration.email !== registration.emailConfirmation) {
            const errorMessage = [
                translate(
                    'resources.registrations.notifications.email_confirmation_error'
                ),
            ];
            errors.emailConfirmation = errorMessage;
        }

        return errors;
    };

    if (formSubmitted) {
        return <SignUpConfirmation />;
    } else {
        return (
            <>
                <SimpleForm
                    className={classes.form}
                    save={submit}
                    toolbar={<SignUpToolbar />}
                    validate={validateEmailConfirmation}
                    redirect={false}
                >
                    <TextInput
                        source="Email"
                        type="email"
                        label="resources.registrations.fields.email"
                        variant="outlined"
                        fullWidth
                        validate={validateField}
                    />
                    <TextInput
                        source="EmailConfirmation"
                        type="email"
                        label="resources.registrations.fields.email_confirmation"
                        variant="outlined"
                        fullWidth
                        validate={validateField}
                    />
                    <TextInput
                        source="OrganizationName"
                        type="text"
                        label="resources.registrations.fields.organization"
                        variant="outlined"
                        fullWidth
                    />
                    <TextInput
                        source="OrganizationDescription"
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
                            ThumbComponent={ConfirmSliderThumb}
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
    }
};
