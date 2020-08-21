import React from 'react';
import { useTranslate, linkToRecord } from 'ra-core';
import { Link } from 'react-router-dom';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import Divider from '@material-ui/core/Divider';
import Grid from '@material-ui/core/Grid';
import Tooltip from '@material-ui/core/Tooltip';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import AppsIcon from '@material-ui/icons/Apps';
import TimeIcon from '@material-ui/icons/AccessTime';
import EventIcon from '@material-ui/icons/Event';
import Button from '@material-ui/core/Button';
import format from 'date-fns/format';
import { ApiOverviewImage } from './ApiOverviewImage'

import { MarkdownView, Stats, StatsText } from '../ui';
import { TagsField } from './TagsField';
import { ApiStatus } from './ApiStatus';

export const ApiCard = ({ basePath, record }) => {
    const classes = useStyles();
    const translate = useTranslate();
    const formattedDate =
        record && record.modifyTs ? format(record.modifyTs, 'P') : '';
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
                subheader={
                    <>
                        <div className={classes.subheader}>
                            <ApiStatus record={record} variant="caption" />
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
                {record.image ? (
                    <ApiOverviewImage image={record.image} name={record.name} maxHeight="56px"/>
                ) : null}
                <Tooltip title={record.description || ''}>
                    <MarkdownView
                        className={classes.description}
                        value={record.description}
                    />
                </Tooltip>
            </CardContent>
            <CardActions className={classes.footer}>
                <Grid container alignItems="center" className={classes.tags}>
                    <TagsField
                        record={record}
                        source="tags"
                        className={classes.tag}
                    />
                </Grid>
                <Grid container alignItems="center" className={classes.stats}>
                    <Button size="small" color="primary" className={classes.button}>
                        More Information
                    </Button>
                </Grid>
            </CardActions>
        </Card>
    );
};

const useStyles = makeStyles(
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
        button: {
            color: theme.palette.colorContrast,
        }
    }),
    {
        name: 'Layer7ApiCard',
    }
);
