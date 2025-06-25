// Copyright © 2025 Broadcom Inc. and its subsidiaries. All Rights Reserved.
import React from 'react';
import { useTranslate } from 'react-admin';
import { makeStyles } from 'tss-react/mui';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListSubheader from '@mui/material/ListSubheader';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Tooltip from '@mui/material/Tooltip';
import Divider from '@mui/material/Divider';
import CheckIcon from '@mui/icons-material/Check';

import { getUserOrganizations } from '.';

export const UserOrganizationSwitcher = ({
    userContext,
    onChangeUserContext,
    ...props
}) => {
    const { classes } = useStyles(props);
    const translate = useTranslate();

    const {
        hasAccessibleOrgs,
        accessibleOrgs,
        activeOrg,
    } = getUserOrganizations(userContext);

    return hasAccessibleOrgs ? (
        <>
            <List compnent="div" className={classes.root}>
                <ListSubheader className={classes.item}>
                    {translate('resources.userContexts.accessibleOrgs.title', {
                        smart_count: accessibleOrgs.length || 0,
                    })}
                </ListSubheader>
                {accessibleOrgs.map(({ uuid, name }) => {
                    const isActiveOrg = uuid === activeOrg.uuid;

                    return (
                        <Tooltip key={uuid} title={name}>
                            <ListItem
                                className={classes.item}
                                aria-label={translate(
                                    isActiveOrg
                                        ? 'resources.userContexts.activeOrgUuid.status.active'
                                        : 'resources.userContexts.activeOrgUuid.status.not_active'
                                )}
                                onClick={() =>
                                    onChangeUserContext({
                                        activeOrgUuid: uuid,
                                    })
                                }
                                button={!isActiveOrg}
                            >
                                <ListItemText
                                    className={classes.itemText}
                                    primary={name}
                                    primaryTypographyProps={{
                                        variant: 'subtitle1',
                                        className: classes.truncatedText,
                                    }}
                                />
                                {isActiveOrg && (
                                    <ListItemIcon className={classes.icon}>
                                        <CheckIcon />
                                    </ListItemIcon>
                                )}
                            </ListItem>
                        </Tooltip>
                    );
                })}
            </List>
            <Divider className={classes.divider} />
        </>
    ) : null;
};

const useStyles = makeStyles({ name: 'Layer7UserOrganizationSwitcher' })(
    theme => ({
        root: {
            padding: `0px 0px ${theme.spacing()}px 0px`,
        },
        item: {
            color: theme.palette.text.secondary,
        },
        itemText: {
            display: 'block',
            marginTop: '0px',
            marginBottom: '0px',
            maxWidth: '300px',
            [theme.breakpoints.up('lg')]: {
                maxWidth: '250px',
            },
        },
        truncatedText: {
            display: 'inline-block',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            maxWidth: '300px',
            [theme.breakpoints.up('lg')]: {
                maxWidth: '250px',
            },
        },
        secondaryText: {
            fontSize: theme.typography.caption.fontSize,
        },
        icon: {
            marginLeft: theme.spacing(2),
            minWidth: theme.spacing(3),
            color: theme.palette.success.main,
        },
        divider: {
            marginBottom: theme.spacing(),
        },
    })
);
