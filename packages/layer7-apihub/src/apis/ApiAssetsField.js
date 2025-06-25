// Copyright © 2025 Broadcom Inc. and its subsidiaries. All Rights Reserved.
import React, { forwardRef } from 'react';
import { useTranslate, useGetManyReference } from 'react-admin';
import LinearProgress from '@mui/material/LinearProgress';
import Typography from '@mui/material/Typography';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import Link from '@mui/material/Link';
import Button from '@mui/material/Button';
import { makeStyles } from 'tss-react/mui';
import get from 'lodash/get';
import { useApiHub } from '../ApiHubContext';
import { useRecordContext } from 'react-admin';

export const ApiAssetsField = props => {
    const translate = useTranslate();
    const { classes } = useStyles();
    let record = useRecordContext();
    if (props.record != null) {
        record = props.record;
    }

    const { data, isLoading, error } = useGetManyReference('assets', {
        target: 'id',
        id: record.id,
    });

    if (isLoading) {
        return <LinearProgress />;
    }

    if (error) {
        return (
            <Typography variant="body1" className={classes.error} {...props}>
                {translate('ra.page.error')}
            </Typography>
        );
    }

    if (!data) {
        return (
            <Typography variant="body1" {...props}>
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

    return <AssetsList record={record} links={links} {...props} />;
};

export const AssetsList = ({ record, links, ...rest }) => {
    const { urlWithTenant } = useApiHub();
    const { apiServiceType, publishedByPortal } = record;

    const isGatewayPublishedSoapApi =
        apiServiceType === 'SOAP' && !publishedByPortal;
    return (
        <>
            <List {...rest}>
                {links.length > 0 &&
                    links.map(link => (
                        <ListItem key={link.id} disableGutters>
                            <Link
                                type={link.type}
                                href={
                                    isGatewayPublishedSoapApi
                                        ? `${link.href}`
                                        : `${urlWithTenant}${link.href}`
                                }
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

const DownloadButton = forwardRef((props, ref) => (
    <Button variant="outlined" ref={ref} {...props} />
));

const useStyles = makeStyles({ name: 'Layer7ApiAssetsField' })(theme => ({
    error: {
        color: theme.palette.error.main,
        marginBottom: theme.spacing(),
    },
}));
