import React from 'react';
import { useTranslate, useGetList } from 'react-admin';
import { CardGrid } from 'layer7-apihub';
import { makeStyles } from '@material-ui/core/styles';
import CircularProgress from '@material-ui/core/CircularProgress';
import Typography from '@material-ui/core/Typography';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import { Link } from 'react-router-dom';

import { stringify } from 'query-string';

import healthcareAdminImage from './healthcare-admin.png';
import medicalSuppliesImage from './medical-supplies.png';
import patientsImage from './patients.png';
import pharmacyImage from './pharmacy.png';

export const HomePageApiGroups = props => {
    const classes = useStyles(props);
    const translate = useTranslate();

    const { ids, data, loaded, error } = useGetList('apiGroups');

    if (error) {
        return (
            <Typography variant="body2" color="error">
                {translate('ra.page.error')}
            </Typography>
        );
    }

    return (
        <div className={classes.root}>
            <Typography className={classes.title} variant="h2" color="primary">
                API Groups
            </Typography>
            <Typography className={classes.subtitle} variant="subtitle1">
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
                    <ApiGroupCard />
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
    subtitle: {},
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
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: '150px',
        borderRadius: '5px',
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
    coverImage: {
        maxHeight: '60px',
    },
    text: {
        width: '100px',
        padding: theme.spacing(0, 2),
    },
    chevron: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: `100%`,
        width: `32px`,
        padding: theme.spacing(0, 1),
        backgroundColor: theme.palette.grey[100],
    },
}));

const getApiGroupsImageFromName = name => {
    switch (name) {
        case 'Patients':
            return patientsImage;
        case 'Pharmacy':
            return pharmacyImage;
        case 'Medical Supplies':
            return medicalSuppliesImage;
        case 'Healthcare Admin':
            return healthcareAdminImage;
        default:
            return null;
    }
};

const ApiGroupCard = ({ record }) => {
    const classes = useApiGroupCardStyles();

    if (!record) {
        return null;
    }

    const image = getApiGroupsImageFromName(record.name);
    const url = {
        pathname: '/apis',
        search: stringify({
            filter: JSON.stringify({
                apiGroup: record.id,
            }),
        }),
    };

    return (
        <Link className={classes.root} to={url}>
            <Card className={classes.card}>
                <CardContent className={classes.content}>
                    <div className={classes.cover}>
                        {image && (
                            <img
                                className={classes.coverImage}
                                src={image}
                                alt={`${record.name} icon`}
                            />
                        )}
                    </div>
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
        </Link>
    );
};
