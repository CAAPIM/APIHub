import React, { cloneElement } from 'react';
import classNames from 'classnames';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Tooltip from '@material-ui/core/Tooltip';
import Typography from '@material-ui/core/Typography';

export const Stats = ({ children, icon, title, ...rest }) => {
    const classes = useStyles(rest);

    return (
        <Tooltip title={title}>
            <Grid container alignItems="center" className={classes.root}>
                {cloneElement(icon, {
                    className: classNames(classes.icon, icon.className),
                })}
                {children}
            </Grid>
        </Tooltip>
    );
};

export const StatsText = ({ children, ...rest }) => {
    const classes = useStyles(rest);
    return (
        <Typography
            variant="caption"
            color="textSecondary"
            className={classes.text}
        >
            {children}
        </Typography>
    );
};

const useStyles = makeStyles(
    theme => ({
        root: {
            marginRight: theme.spacing(2),
            width: 'auto',
        },
        icon: {
            marginRight: theme.spacing(),
        },
        text: {},
    }),
    {
        name: 'Layer7Stats',
    }
);
