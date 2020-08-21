import React from 'react';
import { email, required, FormWithRedirect, TextInput } from 'react-admin';
import { validateAreEqual } from 'layer7-apihub';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Link from '@material-ui/core/Link';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import { Link as RouterLink } from 'react-router-dom';
import CheckboxInput from '../ui/CheckboxInput';

export const SignUpForm = props => {
    const classes = useStyles(props);

    const submit = data => {
        const { EmailConfirmation, ...registration } = data;

        props.onSubmit(registration);
    };

    return (
        <FormWithRedirect
            save={submit}
            render={({ handleSubmit, handleSubmitWithRedirect }) => (
                <form className={classes.form} onSubmit={handleSubmit}>
                    <div className={classes.root}>
                        <CardContent
                            component="fieldset"
                            className={classes.fieldset}
                        >
                            <Typography
                                component="legend"
                                variant="h6"
                                color="primary"
                                className={classes.fieldsetHeader}
                            >
                                Account Information
                            </Typography>
                            <hr />
                            <TextInput
                                source="firstName"
                                type="text"
                                label="First Name"
                                variant="filled"
                                fullWidth
                                validate={required()}
                                className={classes.topFieldSetElement}
                            />
                            <TextInput
                                source="lastName"
                                type="text"
                                label="Last Name"
                                variant="filled"
                                fullWidth
                                validate={required()}
                            />
                            <TextInput
                                source="Email"
                                type="email"
                                variant="filled"
                                fullWidth
                                validate={ValidateEmail}
                            />
                            <TextInput
                                source="EmailConfirmation"
                                type="email"
                                variant="filled"
                                fullWidth
                                validate={ValidateEmailConfirmation}
                            />
                        </CardContent>
                        <CardContent
                            component="fieldset"
                            className={classes.fieldset}
                        >
                            <Typography
                                component="legend"
                                variant="h6"
                                color="primary"
                                className={classes.fieldsetHeader}
                            >
                                Organization Description
                            </Typography>
                            <hr />
                            <Typography
                                className={classes.topFieldSetElement}
                                gutterBottom
                            >
                                Describe your organization to help us set up
                                your account.
                            </Typography>
                            <TextInput
                                source="organization"
                                type="text"
                                label="Company Name"
                                variant="filled"
                                fullWidth
                                validate={required()}
                            />
                            <TextInput
                                source="organization_description"
                                type="text"
                                label=""
                                aria-label="Organization description"
                                variant="filled"
                                fullWidth
                                multiline
                                rows={6}
                                placeholder="Please describe what your application will do"
                            />
                        </CardContent>
                        <CardContent
                            component="fieldset"
                            className={classes.fieldset}
                        >
                            <Typography
                                component="legend"
                                variant="h6"
                                color="primary"
                                className={classes.fieldsetHeader}
                            >
                                Terms and Conditions
                            </Typography>
                            <hr />
                            <CheckboxInput
                                source="termsAndConditions"
                                label={
                                    <Typography>
                                        I have read and agree to the{' '}
                                        <Link>Terms of Use</Link> and{' '}
                                        <Link>Privacy Notice</Link>.
                                    </Typography>
                                }
                            />
                            <CheckboxInput
                                source="newsLetter"
                                label={
                                    <Typography>
                                        Click here to receive emails and other
                                        updates about new APIs & technologies
                                        and best practices for building
                                        applications using our APIs.
                                    </Typography>
                                }
                            />
                        </CardContent>
                    </div>
                    <CardActions className={classes.actions}>
                        <Typography>
                            Already have an account?{' '}
                            <Link
                                className={classes.loginLink}
                                component={RouterLink}
                                to="/login"
                            >
                                Login here.
                            </Link>
                        </Typography>
                        <Button
                            type="submit"
                            variant="contained"
                            color="secondary"
                            className={classes.submit}
                            onClick={handleSubmitWithRedirect}
                        >
                            Register
                        </Button>
                    </CardActions>
                </form>
            )}
        />
    );
};

const ValidateEmail = [required(), email()];
const ValidateEmailConfirmation = [
    required(),
    email(),
    validateAreEqual('Email', 'EmailConfirmation'),
];

const useStyles = makeStyles(theme => ({
    title: {
        fontSize: theme.typography.fontSize * 2,
        marginBottom: theme.spacing(6),
        color: theme.palette.getContrastText(theme.palette.background.default),
    },
    root: {
        display: 'flex',
        padding: theme.spacing(5, 2, 1),
    },
    fieldset: {
        border: 'none',
        display: 'flex',
        flexDirection: 'column',
        width: 'calc(100%/3)',
        paddingLeft: theme.spacing(4),
        paddingRight: theme.spacing(4),
        marginTop: theme.spacing(-8),
        marginBottom: theme.spacing(2),
        '& + &': {
            borderLeftStyle: 'solid',
            borderLeftColor: theme.palette.grey[300],
            borderLeftWidth: 1,
        },
        '& legend': {
            marginTop: theme.spacing(4),
            marginBottom: theme.spacing(3),
            float: 'left',
        },
        '& hr': {
            width: '100%',
            height: '1px',
            backgroundColor: theme.palette.grey[300],
            border: 'none',
            marginBottom: theme.spacing(4),
        },
    },
    fieldsetHeader: {
        paddingTop: theme.spacing(8),
    },
    topFieldSetElement: {
        marginTop: 'auto',
    },
    actions: {
        display: 'flex',
        paddingBottom: theme.spacing(6),
        paddingTop: theme.spacing(6),
        paddingLeft: theme.spacing(4),
        paddingRight: theme.spacing(4),
        backgroundColor: theme.palette.grey[300],
        justifyContent: 'space-between',
    },
    submit: {
        borderRadius: theme.spacing(4),
        fontWeight: 'bold',
        fontSize: '1.1rem',
        paddingTop: theme.spacing(2),
        paddingBottom: theme.spacing(2),
        paddingLeft: theme.spacing(6),
        paddingRight: theme.spacing(6),
        textTransform: 'unset',
    },
    loginLink: {
        fontWeight: 'bold',
    },
}));
