// Copyright © 2025 Broadcom Inc. and its subsidiaries. All Rights Reserved.
import React, { useMemo } from 'react';
import { Datagrid as RaDatagrid } from 'react-admin';
import { useTheme } from '@mui/material/styles';

import { makeStyles } from 'tss-react/mui';

export const Datagrid = props => {
    const theme = useTheme();
    const { classes } = useStyles(props);

    // HACK: For some reason, the header cells loses their styles when dynamically
    // changing the theme. Passing a new key when changing the theme fixes that
    const key = useMemo(() => Math.random(), [theme]); // eslint-disable-line

    return <RaDatagrid key={key} classes={classes} {...props} />;
};

const computeDatagridPadding = (theme, props) =>
    props && props.size === 'small'
        ? `${theme.spacing(0.5)} ${theme.spacing(3)}`
        : `${theme.spacing(1)} ${theme.spacing(3)}`;

const useStyles = makeStyles({ name: 'Layer7SelectedItem' })(theme => ({
    headerCell: {
        backgroundColor: theme.palette.action.selected,
        fontWeight: theme.typography.fontWeightBold,
        textTransform: 'uppercase',
    },
    rowCell: {
        padding: props => computeDatagridPadding(theme, props),
    },
}));
