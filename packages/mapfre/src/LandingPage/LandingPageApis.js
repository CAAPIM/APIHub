import React from 'react';
import { useTranslate, useGetList } from 'react-admin';
import { CardGrid } from 'layer7-apihub';
import { makeStyles } from '@material-ui/core/styles';
import CircularProgress from '@material-ui/core/CircularProgress';
import Typography from '@material-ui/core/Typography';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardHeader from '@material-ui/core/CardHeader';
import CardActions from '@material-ui/core/CardActions';
import Tooltip from '@material-ui/core/Tooltip';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import ArrowForwardIosIcon from '@material-ui/icons/ArrowForwardIos';
import { Link } from 'react-router-dom';

import { stringify } from 'query-string';

export const LandingPageApis = props => {
    const classes = useStyles(props);
    const translate = useTranslate();

    const { ids, data, loaded, error } = useGetList(
        'apis',
        { page: 1, perPage: 12 },
        { field: 'createTs', order: 'DESC' },
        {
            q: '',
        }
    );

    if (error) {
        return (
            <Typography variant="body2" color="error">
                {translate('ra.page.error')}
            </Typography>
        );
    }

    return (
        <div className={classes.root}>
            <Typography className={classes.title} variant="h2">
                APIs
            </Typography>
            <Typography className={classes.subtitle} variant="subtitle2">
                Explore the developer tools we offer.
            </Typography>
            {!loaded ? (
                <CircularProgress color="primary" />
            ) : (
                <CardGrid
                    ids={ids}
                    data={data}
                    loaded={loaded}
                    classes={{ root: classes.cardGrid }}
                >
                    <ApiLandingCard />
                </CardGrid>
            )}
        </div>
    );
};

const useStyles = makeStyles(theme => ({
    root: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
        padding: theme.spacing(10, 0, 2),
    },
    title: {
        fontSize: '2rem',
    },
    subtitle: {
        color: theme.palette.colorContrast,
    },
    cardGrid: {
        width: '100%',
        padding: theme.spacing(4, 0),
    },
}));

const useApiGroupCardStyles = makeStyles(theme => ({
    root: {
        textDecoration: 'none',
    },
    card: {
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        cursor: 'pointer',
    },
    content: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        width: `200px`,
    },
    cover: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100px',
        padding: theme.spacing(0, 2),
    },
    text: {
        width: '100px',
        padding: theme.spacing(0, 2),
    },
    chevron: {
        //ÚLTIMA DE ELLOS
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: `100%`,
        width: `32px`,
        padding: theme.spacing(0, 1),
        backgroundColor: theme.palette.grey[100],
    },
    header: {
        // PRIMERA DE LO NUEVO
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
    content: {
        display: 'flex',
        flexDirection: 'column',
        flex: 1,
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
    footer: {
        display: 'flex',
        flexDirection: 'column',
        flex: 0,
    },
    button: {
        color: theme.palette.primary.main,
    },
    illustration: {
        marginLeft: 'auto',
        marginRight: 'auto',
        display: 'block',
        width: '100%',
    },
}));

const ApiLandingCard = ({ record }) => {
    const classes = useApiGroupCardStyles();

    if (!record) {
        return null;
    }

    const url = {
        pathname: `/apis/${record.id}/show`,
    };

    return (
        <Link className={classes.root} to={url}>
            <Card className={classes.card}>
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
                />
                <CardContent className={classes.content}>
                    {record.image ? (
                        <div>
                            <img
                                src={`./${record.image}`}
                                alt={`${record.name} image`}
                                className={classes.illustration}
                            />
                        </div>
                    ) : null}
                    <p className={classes.description}>{record.description}</p>
                </CardContent>
                <CardActions className={classes.footer}>
                    <Grid container alignItems="center">
                        <Button
                            size="small"
                            color="primary"
                            className={classes.button}
                            startIcon={<ArrowForwardIosIcon />}
                        >
                            More Information
                        </Button>
                    </Grid>
                </CardActions>
            </Card>
        </Link>
    );
};

/*
<Card className={classes.card}>
                <CardContent className={classes.content}>
                    <div className={classes.cover}></div>
                    <Typography
                        className={classes.text}
                        variant="h6"
                        color="primary"
                    >
                        {record.name}
                    </Typography>
                </CardContent>
                <div className={classes.chevron}>
                    <ChevronRightIcon />
                </div>
            </Card>
 */
