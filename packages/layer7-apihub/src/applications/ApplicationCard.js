// Copyright © 2025 Broadcom Inc. and its subsidiaries. All Rights Reserved.
import React from 'react';
import { Link } from 'react-router-dom';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardContent from '@mui/material/CardContent';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import { makeStyles } from 'tss-react/mui';

import { MarkdownView } from '../ui';
import { ApplicationStatus } from './ApplicationStatus';
import { useCreatePath, useRecordContext } from 'react-admin';

export const ApplicationCard = () => {
    const { classes } = useStyles();
    const createPath = useCreatePath();
    const record = useRecordContext();

    return (
        <Card className={classes.root}>
            <CardHeader
                className={classes.header}
                component={Link}
                to={createPath({
                    resource: 'applications',
                    id: record.id,
                    type: 'show',
                })}
                title={
                    <Tooltip title={record.name}>
                        <Typography
                            variant="h5"
                            display="block"
                            className={classes.title}
                            noWrap
                        >
                            {record.name}
                        </Typography>
                    </Tooltip>
                }
                disableTypography
                subheader={
                    <div className={classes.subheader}>
                        <ApplicationStatus variant="caption" />
                    </div>
                }
            />
            {record.description && (
                <CardContent
                    className={classes.content}
                    component={Link}
                    to={createPath({
                        resource: 'applications',
                        id: record.id,
                        type: 'show',
                    })}
                >
                    <Tooltip title={record.description || ''}>
                        <MarkdownView
                            className={classes.description}
                            value={record.description}
                        />
                    </Tooltip>
                </CardContent>
            )}
        </Card>
    );
};

const useStyles = makeStyles({ name: 'Layer7ApplicationCard' })(theme => ({
    root: {
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        textDecoration: 'none',
    },
    content: {
        display: 'flex',
        flexDirection: 'column',
        flex: 1,
        textDecoration: 'none',
    },
    header: {
        borderBottomColor: theme.palette.divider,
        borderBottomWidth: 1,
        borderBottomStyle: 'solid',
        textDecoration: 'none',
    },
    title: {
        fontFamily: theme.typography.subtitle2.fontFamily,
        fontSize: theme.typography.subtitle2.fontSize,
        fontWeight: theme.typography.fontWeightBold,
        wordBreak: 'break-word',
        maxWidth: '100%',
        textDecoration: 'none',
        color: theme.palette.text.primary,
    },
    subheader: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-start',
        fontFamily: theme.typography.body2.fontFamily,
        fontSize: theme.typography.caption.fontSize,
        padding: theme.spacing(1, 0),
    },
    description: {
        flex: 1,
        overflow: 'hidden',
        // NOTE: We use some deprecated CSS props here but they are still well supported.
        // Besides, a new draft specification exists https://www.w3.org/TR/css-overflow-3/#propdef--webkit-line-clamp
        lineClamp: 3,
        boxOrient: 'vertical',
        display: '-webkit-box',
    },
}));
