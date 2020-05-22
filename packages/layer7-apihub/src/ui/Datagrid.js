import React, { useMemo } from 'react';
import { Datagrid as RaDatagrid } from 'react-admin';
import { makeStyles, useTheme } from '@material-ui/core/styles';

const computeDatagridPadding = (theme, props) =>
    props && props.size === 'small'
        ? `${theme.spacing(0.5)}px ${theme.spacing(3)}px`
        : `${theme.spacing(1)}px ${theme.spacing(3)}px`;

const useStyles = makeStyles(theme => ({
    headerCell: {
        backgroundColor: theme.palette.action.selected,
        fontWeight: theme.typography.fontWeightBold,
        textTransform: 'uppercase',
    },
    rowCell: {
        padding: props => computeDatagridPadding(theme, props),
    },
}));

export const Datagrid = props => {
    const theme = useTheme();
    const classes = useStyles(props);

    // HACK: For some reason, the header cells loses their styles when dynamically
    // changing the theme. Passing a new key when changing the theme fixes that
    const key = useMemo(() => Math.random(), [theme]); // eslint-disable-line

    return <RaDatagrid key={key} classes={classes} {...props} />;
};
