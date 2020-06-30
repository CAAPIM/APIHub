import React from 'react';
import { TextField } from 'react-admin';
import { makeStyles } from '@material-ui/core/styles';
import Tooltip from '@material-ui/core/Tooltip';
import get from 'lodash/get';

export const TruncatedTextField = props => {
    const classes = useStyles();
    const value = get(props.record, props.source);

    return (
        <Tooltip title={value || ''}>
            <TextField className={classes.root} {...props} />
        </Tooltip>
    );
};

const useStyles = makeStyles(
    theme => ({
        root: {
            display: 'inline-block',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            maxWidth: '15vw',
            [theme.breakpoints.up('lg')]: {
                maxWidth: '10vw',
            },
        },
    }),
    {
        name: 'Layer7TruncatedTextField',
    }
);
