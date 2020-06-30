import React, { useState } from 'react';
import {
    Button,
    Divider,
    List,
    ListItem,
    makeStyles,
    Snackbar,
    Tooltip,
    Typography,
} from '@material-ui/core';
import CheckBoxOutlineBlankIcon from '@material-ui/icons/CheckBoxOutlineBlank';
import CheckBoxIcon from '@material-ui/icons/CheckBox';
import Alert from '@material-ui/lab/Alert';
import { useTranslate } from 'react-admin';

export const AuthSchemeList = props => {
    const { authSchemes, onClick } = props;
    const classes = useStyles(props);
    const [selectedScheme, setSelectedScheme] = useState();
    const translate = useTranslate();

    const onSelectScheme = scheme => {
        if (!scheme.credsReqd) {
            window.location = scheme.url;
            return;
        }

        if (selectedScheme && selectedScheme.uuid === scheme.uuid) {
            setSelectedScheme(null);
            onClick(null);
        } else {
            setSelectedScheme(scheme);
            onClick(scheme);
        }
    };

    return (
        <div className={classes.root}>
            <Snackbar
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
                open={!!selectedScheme}
            >
                <Alert elevation={6} variant="outlined" severity="info">
                    {selectedScheme
                        ? `${translate(
                              'apihub.login.notifications.selected_scheme'
                          )} ${selectedScheme.name}`
                        : null}
                </Alert>
            </Snackbar>
            <Divider variant="middle" />
            <Typography className={classes.divider} variant="body1">
                or
            </Typography>
            <Typography variant="body1">
                {translate('apihub.login.actions.sign_in_with')}
            </Typography>
            <List>
                {authSchemes.map((scheme, i) => (
                    <ListItem key={scheme.name} disableGutters>
                        <Tooltip
                            key={i}
                            title={scheme.description}
                            placement="right-start"
                        >
                            <Button
                                variant="outlined"
                                startIcon={
                                    selectedScheme &&
                                    selectedScheme.uuid === scheme.uuid ? (
                                        <CheckBoxIcon />
                                    ) : (
                                        <CheckBoxOutlineBlankIcon />
                                    )
                                }
                                className={classes.listButton}
                                onClick={() => onSelectScheme(scheme)}
                            >
                                {scheme.name}
                            </Button>
                        </Tooltip>
                    </ListItem>
                ))}
            </List>
        </div>
    );
};

const useStyles = makeStyles(
    theme => ({
        root: {
            marginTop: theme.spacing(3),
        },
        listButton: {
            width: '100%',
            justifyContent: 'start',
        },
        divider: {
            marginTop: '-13px',
            marginBottom: theme.spacing(2),
            margin: '0 auto',
            width: '20px',
            textAlign: 'center',
            backgroundColor: theme.palette.background.default,
        },
    }),
    {
        name: 'Layer7LoginAuthSchemeList',
    }
);
