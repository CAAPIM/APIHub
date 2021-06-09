import React from 'react';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import Dialog from '@material-ui/core/Dialog';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';

export const LoadingDialog = ({ title, content, open = false, ...rest }) => {
    const classes = useStyles(rest);

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

const useStyles = makeStyles(
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
    {
        name: 'Layer7LoadingDialog',
    }
);
