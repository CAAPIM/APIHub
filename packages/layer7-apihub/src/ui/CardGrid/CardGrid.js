import React, { cloneElement, useCallback } from 'react';
import { useHistory } from 'react-router-dom';
import { linkToRecord } from 'ra-core';
import MuiGrid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/core/styles';

export const LoadingCardGrid = ({ nbItems = 10, spacing = 2, ...rest }) => {
    const classes = useStyles(rest);
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
    basePath,
    children,
    data,
    ids,
    resource,
    rowClick,
    spacing = 2,
    ...rest
}) => {
    const classes = useStyles(rest);

    return (
        <div className={classes.root}>
            <MuiGrid className={classes.gridList} container spacing={spacing}>
                {ids.map(id => (
                    <CardGridItem
                        key={id}
                        id={id}
                        basePath={basePath}
                        record={data[id]}
                        resource={resource}
                        rowClick={rowClick}
                    >
                        {children}
                    </CardGridItem>
                ))}
            </MuiGrid>
        </div>
    );
};

export const CardGrid = ({ loaded, ...props }) =>
    loaded ? <LoadedCardGrid {...props} /> : <LoadingCardGrid {...props} />;

export const CardGridItem = ({
    basePath,
    children,
    id,
    record,
    resource,
    rowClick,
    xsSize = 12,
    smSize = 6,
    mdSize = 4,
    lgSize = 3,
    xlSize = 3,
    ...props
}) => {
    const history = useHistory();

    const handleClick = useCallback(
        async event => {
            if (!rowClick) return;
            event.persist();

            const effect =
                typeof rowClick === 'function'
                    ? await rowClick(id, basePath, record)
                    : rowClick;
            switch (effect) {
                case 'edit':
                    history.push(linkToRecord(basePath, id));
                    return;
                case 'show':
                    history.push(linkToRecord(basePath, id, 'show'));
                    return;
                default:
                    if (effect) history.push(effect);
                    return;
            }
        },
        [basePath, history, id, record, rowClick]
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
            {cloneElement(children, {
                basePath,
                id,
                record,
                resource,
            })}
        </MuiGrid>
    );
};

const useStyles = makeStyles(
    theme => ({
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
    }),
    {
        name: 'Layer7CardGrid',
    }
);

const times = (nbChildren, fn) =>
    Array.from({ length: nbChildren }, (_, key) => fn(key));
