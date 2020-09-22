import React from 'react';
import Link from '@material-ui/core/Link';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core';

import { BrandLogo } from '../ui';

export const Footer = ({ withLogo = true, ...rest }) => {
    const classes = useStyles(rest);

    return (
        <footer className={classes.root}>
            {withLogo && <BrandLogo className={classes.logo} />}
            <Typography className={classes.company}>
                ©2020 Mapfre Name
            </Typography>
            <Link className={classes.link} variant="body1">
                Cookies
            </Link>
            <Link className={classes.link} variant="body1">
                Privacy
            </Link>
            <Link className={classes.link} variant="body1">
                Terms and Conditions
            </Link>
        </footer>
    );
};

const useStyles = makeStyles(
    theme => ({
        root: {
            background: `#c02524`,
            display: 'flex',
            paddingTop: theme.spacing(8),
            paddingBottom: theme.spacing(4),
            alignItems: 'center',
        },
        logo: {
            fill: theme.palette.common.white,
            marginRight: theme.spacing(1),
        },
        company: {
            fontWeight: theme.typography.fontWeightBold,
            flexGrow: 1,
        },
        link: {
            color: theme.palette.common.white,
            fontWeight: theme.typography.fontWeightBold,
            '& + &': {
                marginLeft: theme.spacing(2),
                marginRight: theme.spacing(1),
            },
        },
    }),
    {
        name: 'HealthcareFooter',
    }
);
