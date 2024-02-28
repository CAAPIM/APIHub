import React, { useState } from 'react';
import { Button } from 'react-admin';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import { useTranslate } from 'ra-core';
import { AuthenticationLayout } from '../AuthenticationLayout';
import { WarningIcon } from './Icons';
import queryString from 'query-string';
import { useHistory, useLocation } from 'react-router-dom';
import get from 'lodash/get';
import { useApiHub } from '../../ApiHubContext';

export const SAMLLoginConfirm = props => {
    const translate = useTranslate();
    const classes = useStyles(props);
    const location = useLocation();
    const { url: portalURL } = useApiHub();
    let history = useHistory();

    const getRedirectUrl = () => {
        const queryParam = queryString.parse(location.search);
        return get(queryParam, 'redirectUrl');
    };
    const navigateToHome = () => {
        history.goBack();
    };
    const reAuthenticate = () => {
        let redirectUrl = getRedirectUrl();
        if (redirectUrl && redirectUrl.includes('?token=')) {
            redirectUrl = `${redirectUrl}&terminateExistingSessions=true`;
        } else {
            redirectUrl = `${redirectUrl}?terminateExistingSessions=true`;
        }
        const queryParam = queryString.parse(location.search);
        const fromUrl = get(queryParam, 'fromUrl');
        if (fromUrl) {
            redirectUrl = `${redirectUrl}&fromUrl=${encodeURIComponent(
                fromUrl
            )}`;
        }
        if (redirectUrl.startsWith('/')) {
            window.location.href = `${portalURL}${redirectUrl}`;
        } else {
            window.location.href = redirectUrl;
        }
    };

    return (
        <>
            <div>
                <div className={classes.multi_sessions_title_wrapper}>
                    <div className={classes.warning_icon}>
                        <WarningIcon />
                    </div>
                    <Typography
                        variant="h3"
                        color="textPrimary"
                        className={classes.multi_sessions_title}
                    >
                        {translate('apihub.login.multiple_sessions_title')}
                    </Typography>
                </div>
                <div className={classes.multi_sessions_text}>
                    {translate('apihub.login.multiple_sessions_text')}
                </div>
                <Button
                    className={classes.btn}
                    color="primary"
                    label="apihub.login.actions.multi_session_sign_in"
                    variant="contained"
                    onClick={reAuthenticate}
                />
                <div className={classes.additionalBtnText}>
                    <Typography variant="colorPrimary">
                        {translate(
                            'apihub.login.actions.multi_session_sign_in_additional_text'
                        )}
                    </Typography>
                </div>
                <Button
                    className={classes.btn}
                    color="primary"
                    label="resources.applications.actions.cancel"
                    variant="outlined"
                    onClick={navigateToHome}
                />
            </div>
        </>
    );
};

export const SAMLLoginConfirmPage = props => (
    <AuthenticationLayout {...props}>
        <SAMLLoginConfirm />
    </AuthenticationLayout>
);

const useStyles = makeStyles(theme => ({
    additionalBtnText: {
        marginBottom: 8,
        marginTop: 4,
        textAlign: 'center',
    },
    btn: {
        height: 40,
        marginTop: 16,
        width: '100%',
    },
    multi_sessions_title: {
        fontSize: 22,
        fontWeight: 700,
        marginBottom: 10,
        marginLeft: 10,
        marginTop: 4,
        textAlign: 'center',
    },
    multi_sessions_title_wrapper: {
        marginTop: 18,
    },
    multi_sessions_text: {
        fontFamily: theme.typography.body1.fontFamily,
        fontSize: 14,
        marginBottom: 16,
        textAlign: 'center',
        width: 300,
    },
    warning_icon: {
        textAlign: 'center',
    },
}));
