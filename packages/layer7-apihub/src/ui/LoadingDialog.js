// Copyright © 2025 Broadcom Inc. and its subsidiaries. All Rights Reserved.
import React from 'react';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Dialog from '@mui/material/Dialog';
import Typography from '@mui/material/Typography';
import { makeStyles } from 'tss-react/mui';

export const LoadingDialog = ({ title, content, open = false, ...rest }) => {
    const { classes } = useStyles(rest);

    return (
        <Dialog
            maxWidth="xs"
            aria-labelledby="message-dialog-title"
            open={open}
            {...rest}
        >
            <DialogTitle id="message-dialog-title">{title}</DialogTitle>
            <DialogContent className={classes.root}>
                <Typography variant="body1">{content}</Typography>
                <CircularProgress className={classes.progress} />
            </DialogContent>
        </Dialog>
    );
};

const useStyles = makeStyles({ name: 'Layer7LoadingDialog' })(
    theme => ({
        root: {
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
        },
        progress: {
            marginTop: theme.spacing(3),
            marginBottom: theme.spacing(3),
        },
    }),
);
