import React from 'react';
import { linkToRecord } from 'ra-core';
import { Link } from 'react-router-dom';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import Tooltip from '@material-ui/core/Tooltip';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';

import { MarkdownView } from '../ui';
import { ApplicationStatus } from './ApplicationStatus';

export const ApplicationCard = ({ basePath, record, canCRUD }) => {
    const classes = useStyles();

    return (
        <Card className={classes.root}>
            <CardHeader
                className={classes.header}
                component={Link}
                to={linkToRecord(basePath, record && record.id, 'show')}
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
                        <ApplicationStatus record={record} variant="caption" />
                    </div>
                }
            />
            {record.description && (
                <CardContent
                    className={classes.content}
                    component={Link}
                    to={linkToRecord(basePath, record && record.id, 'show')}
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

const useStyles = makeStyles(
    theme => ({
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
    }),
    {
        name: 'Layer7ApplicationCard',
    }
);
