import React from 'react';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(theme => ({
    root: {
        fontWeight: theme.typography.fontWeightMedium,
        textTransform: 'capitalize',
        marginTop: theme.spacing(3),
        marginBottom: theme.spacing(),
        color: theme.palette.getContrastText(theme.palette.background.default),
    },
}));

export const ViewTitle = props => {
    const classes = useStyles();

    return (
        <>
            <Typography
                id="react-admin-title"
                variant="h5"
                component="h2"
                color="inherit"
                className={classes.root}
                {...props}
            />
        </>
    );
};
