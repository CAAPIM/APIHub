import React, { forwardRef } from 'react';
import { useTranslate, useGetManyReference } from 'ra-core';
import LinearProgress from '@material-ui/core/LinearProgress';
import Typography from '@material-ui/core/Typography';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import Link from '@material-ui/core/Link';
import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';
import get from 'lodash/get';
import { useApiHub } from '../ApiHubContext';

const useStyles = makeStyles(theme => ({
    error: {
        color: theme.palette.error.main,
        marginBottom: theme.spacing(),
    },
}));

const DownloadButton = forwardRef((props, ref) => (
    <Button variant="outlined" color="primary" ref={ref} {...props} />
));

const DownloadFilesButton = ({ id }) => {
    const translate = useTranslate();
    const { urlWithTenant } = useApiHub();

    const href = `${urlWithTenant}/api-management/1.0/apis/${id}/assets/archive`;
    const label = translate('resources.apis.overview.actions.download_assets');
    return (
        <Link
            component={DownloadButton}
            href={href}
            download="assets.zip"
            aria-label={label}
        >
            {label}
        </Link>
    );
};

export const ApiAssetsField = props => {
    const translate = useTranslate();
    const classes = useStyles(props);
    const { record, ...rest } = props;

    const { data, loaded, error } = useGetManyReference(
        'assets',
        'id',
        record.id,
        undefined,
        undefined,
        undefined,
        'apis'
    );

    if (!loaded) {
        return <LinearProgress />;
    }

    if (error) {
        return (
            <Typography variant="body1" className={classes.error} {...rest}>
                {translate('ra.page.error')}
            </Typography>
        );
    }

    if (!data) {
        return (
            <Typography variant="body1" {...rest}>
                {translate('resources.apis.overview.notifications.no_assets')}
            </Typography>
        );
    }

    const links = Object.keys(data).map(key => {
        const { id, name, type, links } = data[key];
        return {
            id,
            name,
            type: type,
            href: get(links, '[0].href', null),
            rel: get(links, '[0].rel', null),
        };
    });

    return <AssetsList record={record} links={links} {...rest} />;
};

export const AssetsList = ({ record, links, ...rest }) => {
    const { urlWithTenant } = useApiHub();

    return (
        <>
            <List {...rest}>
                {links.length > 0 &&
                    links.map(link => (
                        <ListItem key={link.id} disableGutters>
                            <Link
                                type={link.type}
                                href={`${urlWithTenant}${link.href}`}
                                download={link.name}
                            >
                                {link.name}
                            </Link>
                        </ListItem>
                    ))}
            </List>
            {links.length > 1 ? <DownloadFilesButton id={record.id} /> : null}
        </>
    );
};
