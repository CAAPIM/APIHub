import React from 'react';
import { ApiCard } from 'layer7-apihub';
import { useQuery } from 'react-admin';
import { makeStyles } from '@material-ui/core/styles';
import Carousel from 'react-material-ui-carousel';

export const ApplicationApisList = ({ apis, ...rest }) => {
    const classes = useStyles(rest);
    const carouselClasses = useCarouselStyles(rest);

    const { data = [] } = useQuery({
        type: 'getApis',
        resource: 'apis',
    });

    const appApis = apis ? getAppApis(data, apis) : [];

    if (!appApis || appApis.length === 0) {
        return null;
    }

    return (
        <Carousel
            className={classes.root}
            classes={carouselClasses}
            autoPlay={false}
        >
            {appApis.map(api => (
                <ApiCard key={api.uuid} record={api} />
            ))}
        </Carousel>
    );
};

const getAppApis = (allApis, selectedApis) =>
    allApis.filter(api => selectedApis.includes(api.id));

const useStyles = makeStyles(
    theme => ({
        root: {
            margin: theme.spacing(2, 1),
        },
    }),
    {
        name: 'HealthcareApplicationApisList',
    }
);

const useCarouselStyles = makeStyles(
    theme => ({
        root: {},
        buttonWrapper: {
            '&:hover': {
                '& $button': {
                    backgroundColor: theme.palette.primary.dark,
                    filter: 'brightness(100%)',
                    opacity: '1 !important',
                },
            },
        },
        button: {
            backgroundColor: `${theme.palette.primary.main} !important`,
            color: theme.palette.common.white,
            '&:hover': {
                opacity: 1,
            },
        },
        buttonVisible: {
            opacity: 1,
        },
        buttonHidden: {
            opacity: 0,
        },
        next: {},
        prev: {},
    }),
    {
        name: 'HealthcareApplicationApisCarousel',
    }
);
