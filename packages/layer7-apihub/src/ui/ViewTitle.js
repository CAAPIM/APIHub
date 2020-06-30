import React from 'react';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';

export const ViewTitle = props => {
    const classes = useStyles();

    return (
        <div className={classes.root}>
            <Typography
                id="react-admin-title"
                variant="h5"
                component="h2"
                color="inherit"
                className={classes.title}
                {...props}
            />
        </div>
    );
};

const useStyles = makeStyles(
    theme => ({
        root: {
            marginTop: theme.spacing(3),
            marginBottom: theme.spacing(),
        },
        title: {
            fontWeight: theme.typography.fontWeightMedium,
            textTransform: 'capitalize',
            color: theme.palette.getContrastText(
                theme.palette.background.default
            ),
        },
    }),
    {
        name: 'Layer7ViewTitle',
    }
);
