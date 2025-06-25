// Copyright © 2025 Broadcom Inc. and its subsidiaries. All Rights Reserved.
import React, { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    useListContext,
    useCreatePath,
    RecordContextProvider,
    useRecordContext,
} from 'react-admin';
import MuiGrid from '@mui/material/Grid';
import { makeStyles } from 'tss-react/mui';

export const LoadingCardGrid = ({ nbItems = 10, spacing = 2, ...rest }) => {
    const { classes } = useStyles(rest);
    return (
        <div className={classes.root}>
            <MuiGrid container className={classes.gridList} spacing={spacing}>
                {times(nbItems, key => (
                    <MuiGrid item key={key}>
                        <div className={classes.placeholder} />
                    </MuiGrid>
                ))}
            </MuiGrid>
        </div>
    );
};

export const LoadedCardGrid = ({
    children,
    rowClick,
    spacing = 2,
    ...rest
}) => {
    const { classes } = useStyles(rest);
    const { data } = useListContext();

    return (
        <div className={classes.root}>
            <MuiGrid className={classes.gridList} container spacing={spacing}>
                {data.map(record => (
                    <RecordContextProvider key={record.id} value={record}>
                        <CardGridItem key={record.id} rowClick={rowClick}>
                            {children}
                        </CardGridItem>
                    </RecordContextProvider>
                ))}
            </MuiGrid>
        </div>
    );
};

export const CardGrid = props => {
    const { isLoading } = useListContext();
    return isLoading ? (
        <LoadingCardGrid {...props} />
    ) : (
        <LoadedCardGrid {...props} />
    );
};

export const CardGridItem = ({
    children,
    rowClick,
    xsSize = 12,
    smSize = 6,
    mdSize = 4,
    lgSize = 3,
    xlSize = 3,
    ...props
}) => {
    const navigate = useNavigate();
    const createPath = useCreatePath();
    const { resource } = useListContext();
    const record = useRecordContext();
    const { id } = record;

    const handleClick = useCallback(
        async event => {
            if (!rowClick) return;
            event.persist();

            const effect =
                typeof rowClick === 'function'
                    ? await rowClick(id, resource, record)
                    : rowClick;
            switch (effect) {
                case 'edit':
                    navigate(
                        createPath({
                            resource,
                            id,
                            type: 'edit',
                        })
                    );
                    return;
                case 'show':
                    navigate(
                        createPath({
                            resource,
                            id,
                            type: 'show',
                        })
                    );
                    return;
                default:
                    if (effect) navigate(effect);
                    return;
            }
        },
        [rowClick, id, resource, record, navigate, createPath]
    );

    return (
        <MuiGrid
            item
            onClick={handleClick}
            xs={xsSize}
            sm={smSize}
            md={mdSize}
            lg={lgSize}
            xl={xlSize}
            {...props}
        >
            {children}
        </MuiGrid>
    );
};

const useStyles = makeStyles({ name: 'Layer7CardGrid' })(theme => ({
    root: {
        margin: '-2px',
    },
    gridList: {
        width: '100%',
        marginTop: 0,
        marginBottom: 0,
        marginLeft: -theme.spacing(),
        marginRight: -theme.spacing(),
    },
    placeholder: {
        backgroundColor: theme.palette.grey[300],
        height: '100%',
    },
}));

const times = (nbChildren, fn) =>
    Array.from({ length: nbChildren }, (_, key) => fn(key));
