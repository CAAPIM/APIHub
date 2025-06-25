// Copyright © 2025 Broadcom Inc. and its subsidiaries. All Rights Reserved.
import React from 'react';
import { Button, SaveButton, Toolbar, ValidationError } from 'react-admin';
import { useFormContext } from 'react-hook-form';
import { makeStyles } from 'tss-react/mui';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';
import get from 'lodash/get';

export const LoginToolbar = props => {
    const {
        loading = false,
        error = null,
        handleCancel,
        saveBtnAdditionalText,
        saveLabel,
        showCancelBtn,
        ...rest
    } = props;

    const { classes } = useStyles(rest);

    const { button } = props;
    const color = get(button, 'color', 'primary');
    const variant = get(button, 'variant', 'outlined');
    const size = get(button, 'size', 'small');
    const form = useFormContext();


    const renderCancelBtn = () => {
        const clickHandler = () => {
            form.reset();
            handleCancel();
        };
        return (
            <Button
                className={classes.cancelBtn}
                label="resources.applications.actions.cancel"
                variant="outlined"
                onClick={clickHandler}
            />
        );
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
                {saveBtnAdditionalText && (
                    <div className={classes.additionalBtnText}>
                        <Typography variant="colorPrimary">
                            {saveBtnAdditionalText}
                        </Typography>
                    </div>
                )}
                {showCancelBtn && renderCancelBtn()}
            </Toolbar>
        </>
    );
};

const useStyles = makeStyles({ name: 'Layer7LoginToolbar' })(
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
    })
);
