import React from 'react';
import { SaveButton, Toolbar } from 'react-admin';
import { makeStyles } from '@material-ui/core';
import get from 'lodash/get';

/**
 * The Reset Password Toolbar displaying the submit button
 *
 * @param {string} button.color The color of the submit button
 * @param {string} button.variant The variant of the submit button
 * @param {string} button.size The size of the submit button
 *
 */
export const ResetPasswordToolbar = props => {
    const classes = useStyles(props);

    const { button } = props;
    const color = get(button, 'color', 'primary');
    const variant = get(button, 'variant', 'outlined');
    const size = get(button, 'size', 'small');

    return (
        <Toolbar className={classes.toolbar} {...props}>
            <SaveButton
                className={classes.submit}
                icon={<span />}
                label="apihub.reset_password.actions.submit"
                color={color}
                variant={variant}
                size={size}
            />
        </Toolbar>
    );
};

const useStyles = makeStyles(
    theme => ({
        toolbar: {
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'stretch',
            flexBasis: '100%',
            backgroundColor: 'transparent',
            padding: 0,
            marginTop: theme.spacing(2),
        },
        submit: {},
    }),
    {
        name: 'Layer7ResetPasswordToolbar',
    }
);
