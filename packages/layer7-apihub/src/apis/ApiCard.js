// Copyright © 2025 Broadcom Inc. and its subsidiaries. All Rights Reserved.
import React from 'react';
import { Link } from 'react-router-dom';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardContent from '@mui/material/CardContent';
import { TopToolbar, useRecordContext } from 'react-admin';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import { makeStyles } from 'tss-react/mui';
import AppsIcon from '@mui/icons-material/Apps';
import TimeIcon from '@mui/icons-material/AccessTime';
import EventIcon from '@mui/icons-material/Event';
import { format } from 'date-fns';

import { MarkdownView, Stats, StatsText } from '../ui';
import { TagsField } from './TagsField';
import { ApiStatus } from './ApiStatus';
import { useTranslate, useCreatePath } from 'react-admin';

export const ApiCard = () => {
    const { classes } = useStyles();
    const translate = useTranslate();
    const createPath = useCreatePath();
    const record = useRecordContext();
    const formattedDate =
        record && record.modifyTs ? format(record.modifyTs, 'MM-DD-YYYY') : '';
    return (
        <Card
            className={classes.root}
            component={Link}
            to={createPath({
                resource: 'apis',
                id: record.id,
                type: 'show',
            })}
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
                subheader={
                    <>
                        <div className={classes.subheader}>
                            <ApiStatus variant="caption" />
                            <Divider
                                orientation="vertical"
                                className={classes.divider}
                            />
                            <Typography
                                variant="caption"
                                color="textSecondary"
                                className={classes.ssgServiceType}
                            >
                                {record.ssgServiceType}
                            </Typography>
                            <Divider
                                orientation="vertical"
                                className={classes.divider}
                            />
                            <Tooltip title={record.version}>
                                <Typography
                                    variant="caption"
                                    color="textSecondary"
                                    noWrap
                                >
                                    {translate(
                                        'resources.apis.list.cards.fields.version',
                                        {
                                            version: record.version,
                                        }
                                    )}
                                </Typography>
                            </Tooltip>
                        </div>
                    </>
                }
            />
            <CardContent className={classes.content}>
                <Tooltip title={record.description || ''}>
                    <MarkdownView
                        className={classes.description}
                        value={record.description}
                    />
                </Tooltip>
            </CardContent>
            <TopToolbar className={classes.footer}>
                <Grid container alignItems="center" className={classes.tags}>
                    <TagsField source="tags" className={classes.tag} />
                </Grid>
                <Grid container alignItems="center" className={classes.stats}>
                    <Grid item>
                        <Stats
                            icon={<AppsIcon />}
                            title={translate(
                                'resources.apis.list.cards.fields.applications_long',
                                {
                                    smart_count: record.applicationUsage || 0,
                                }
                            )}
                        >
                            <StatsText>
                                {translate(
                                    'resources.apis.list.cards.fields.applications',
                                    {
                                        smart_count:
                                            record.applicationUsage || 0,
                                    }
                                )}
                            </StatsText>
                        </Stats>
                    </Grid>
                    <Grid item>
                        <Stats
                            icon={<TimeIcon />}
                            title={translate(
                                'resources.apis.list.cards.fields.averageLatency_long',
                                {
                                    smart_count: record.averageLatency || 0,
                                }
                            )}
                        >
                            <StatsText>
                                {translate(
                                    'resources.apis.list.cards.fields.averageLatency',
                                    {
                                        ms: record.averageLatency || 0,
                                    }
                                )}
                            </StatsText>
                        </Stats>
                    </Grid>
                    {formattedDate && (
                        <Grid item>
                            <Stats
                                icon={<EventIcon />}
                                title={translate(
                                    'resources.apis.list.cards.fields.updated',
                                    {
                                        date: formattedDate,
                                    }
                                )}
                            >
                                <StatsText>{formattedDate}</StatsText>
                            </Stats>
                        </Grid>
                    )}
                </Grid>
            </TopToolbar>
        </Card>
    );
};

const useStyles = makeStyles()(
    theme => ({
        root: {
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            cursor: 'pointer',
            textDecoration: 'none',
        },
        content: {
            display: 'flex',
            flexDirection: 'column',
            flex: 1,
        },
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
            maxWidth: '100%',
        },
        subheader: {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-start',
            fontFamily: theme.typography.body2.fontFamily,
            fontSize: theme.typography.caption.fontSize,
            padding: theme.spacing(1, 0),
        },
        footer: {
            display: 'flex',
            flexDirection: 'column',
            flex: 0,
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
        ssgServiceType: {
            fontWeight: theme.typography.fontWeightBold,
        },
        divider: {
            marginLeft: theme.spacing(),
            marginRight: theme.spacing(),
            minHeight: theme.spacing(2),
        },
        contentDivider: {
            width: '100%',
            marginBottom: theme.spacing(),
            marginTop: 0,
        },
        stats: {
            marginTop: 'auto',
        },
        tags: {
            borderTopStyle: 'solid',
            borderTopWidth: '1px',
            borderTopColor: theme.palette.grey[400],
            minHeight: theme.spacing(4),
            marginBottom: theme.spacing(1),
        },
        tag: {
            borderRadius: theme.spacing(0.5),
            fontWeight: theme.typography.fontWeightBold,
            '& + &': {
                marginLeft: theme.spacing(0.5),
            },
        },
    }),
    {
        name: 'Layer7ApiCard',
    }
);
