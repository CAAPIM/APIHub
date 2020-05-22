import React from 'react';
import { linkToRecord } from 'ra-core';
import { Link } from 'react-router-dom';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import Tooltip from '@material-ui/core/Tooltip';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';

import { Status } from './Status';

const useStyles = makeStyles(theme => ({
    root: {
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        cursor: 'pointer',
        textDecoration: 'none',
    },
    content: { display: 'flex', flexDirection: 'column', flex: 1 },
    header: {
        borderBottomColor: theme.palette.divider,
        borderBottomWidth: 1,
        borderBottomStyle: 'solid',
    },
    title: {
        fontFamily: theme.typography.subtitle2.fontFamily,
        fontSize: theme.typography.subtitle2.fontSize,
        fontWeight: theme.typography.fontWeightBold,
        wordBreak: 'break-word',
        maxWidth: 300,
        marginBottom: theme.spacing(),
    },
    divider: {
        marginLeft: theme.spacing(),
        marginRight: theme.spacing(),
        minHeight: theme.spacing(2),
    },
}));

export const ApplicationCard = ({ basePath, record }) => {
    const classes = useStyles();

    return (
        <Card
            className={classes.root}
            component={Link}
            to={linkToRecord(basePath, record && record.id, 'show')}
        >
            <CardHeader
                className={classes.header}
                title={
                    <Tooltip title={record.name}>
                        <Typography
                            variant="h5"
                            component="span"
                            display="block"
                            className={classes.title}
                            noWrap
                        >
                            {record.name}
                        </Typography>
                    </Tooltip>
                }
                disableTypography
                subheader={<Status record={record} variant="caption" />}
            />
        </Card>
    );
};
