import React from 'react';
import { Button, SaveButton, Toolbar, useTranslate } from 'react-admin';
import { useForm } from 'react-final-form';
import { ValidationError } from 'ra-core';
import { makeStyles } from '@material-ui/core';
import Typography from '@material-ui/core/Typography';
import CircularProgress from '@material-ui/core/CircularProgress';
import get from 'lodash/get';

export const LoginToolbar = props => {
    const { loading = false, error = null, handleCancel,
        saveBtnAdditionalText, saveLabel, showCancelBtn, ...rest
    } = props;

    const classes = useStyles(rest);

    const { button } = props;
    const color = get(button, 'color', 'primary');
    const variant = get(button, 'variant', 'outlined');
    const size = get(button, 'size', 'small');

    const renderCancelBtn = () => {
        const form = useForm();
        const clickHandler = () => {
            form.reset();
            handleCancel();
        };
        return (<Button
            className={classes.cancelBtn}
            color="primary"
            label="resources.applications.actions.cancel"
            variant="outlined"
            onClick={clickHandler}
        />);
    };

    return (
        <>
            {error ? (
                <Typography
                    variant="body1"
                    color="error"
                    className={classes.error}
                >
                    <ValidationError error={error} />
                </Typography>
            ) : null}
            <Toolbar className={classes.toolbar} {...rest}>
                <SaveButton
                    icon={
                        loading ? (
                            <CircularProgress
                                className={classes.circularProgress}
                                size={15}
                            />
                        ) : (
                            <span />
                        )
                    }
                    label={saveLabel}
                    disabled={loading}
                    color={color}
                    variant={variant}
                    size={size}
                />
                {saveBtnAdditionalText &&
                <div className={classes.additionalBtnText}>
                    <Typography variant="colorPrimary">{saveBtnAdditionalText}</Typography>
                </div>}
                {showCancelBtn && renderCancelBtn()}
            </Toolbar>
        </>
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
        },
        additionalBtnText: {
            fontHeight: 16,
            lineHeight: '21px',
            textAlign: 'center',
        },
        cancelBtn: {
            marginTop: 20,
        },
        circularProgress: {
            color: theme.palette.grey[500],
        },
    }),
    {
        name: 'Layer7LoginToolbar',
    }
);
