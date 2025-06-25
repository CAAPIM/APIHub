// Copyright © 2025 Broadcom Inc. and its subsidiaries. All Rights Reserved.
import React from 'react';
import get from 'lodash/get';
import {
    useTranslate,
    useGetManyReference,
    useRecordContext,
} from 'react-admin';
import { makeStyles } from 'tss-react/mui';
import Chip from '@mui/material/Chip';
import LinearProgress from '@mui/material/LinearProgress';
import Typography from '@mui/material/Typography';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import TabScrollButton from '@mui/material/TabScrollButton';

export const TagsField = props => {
    const {
        className,
        source,
        color = 'primary',
        variant = 'outlined',
        size = 'small',
    } = props;

    const { classes, cx } = useStyles(props);
    let record = useRecordContext();
    if (props.record != null) {
        record = props.record;
    }
    const tags = get(record, source, []);

    return (
        <Tabs
            variant="scrollable"
            className={classes.root}
            scrollButtons
            ScrollButtonComponent={TagsFieldScrollButton}
            component="ul"
            value={false}
            allowScrollButtonsMobile
        >
            {tags.map(tag => (
                <Tab
                    key={tag}
                    className={classes.tab}
                    disableFocusRipple
                    disableRipple
                    component="li"
                    value={tag}
                    label={
                        <Chip
                            label={tag}
                            className={cx(classes.tag, className)}
                            variant={variant}
                            size={size}
                        />
                    }
                />
            ))}
        </Tabs>
    );
};

export const AsyncTagsField = props => {
    const { variant = 'outlined', color = 'primary', ...rest } = props;
    let record = useRecordContext();
    if (props.record != null) {
        record = props.record;
    }
    const translate = useTranslate();
    const { classes } = useStyles(props);
    const { data, isLoading, error } = useGetManyReference('tags', {
        target: 'id',
        id: record.id,
    });

    if (isLoading) {
        return <LinearProgress />;
    }

    if (error) {
        return (
            <Typography variant="body2" className={classes.error} {...rest}>
                {translate('ra.page.error')}
            </Typography>
        );
    }

    const tags = data ? Object.keys(data).map(key => data[key]) : [];

    return (
        <ul {...rest}>
            {tags.map(tag => (
                <Chip
                    component="li"
                    key={tag.id}
                    label={tag.name}
                    className={classes.tag}
                    variant={variant}
                />
            ))}
        </ul>
    );
};

export const TagsFieldScrollButton = props => {
    const { onClick, ...rest } = props;
    const handleClick = event => {
        event.preventDefault();
        event.stopPropagation();
        onClick(event);
    };

    return (
        <TabScrollButton
            data-layer7-test="tags-scroll-button"
            onClick={handleClick}
            {...rest}
        />
    );
};

const useStyles = makeStyles({ name: 'Layer7ApiTags' })(theme => ({
    root: {
        margin: 0,
        padding: 0,
        maxWidth: 300,
        minHeight: 'unset',
        position: 'relative',
    },
    tab: {
        minHeight: 'unset',
        minWidth: 'unset',
        maxWidth: 'unset',
        paddingBottom: 0,
        paddingTop: 0,
        paddingLeft: theme.spacing(0.5),
        paddingRight: theme.spacing(0.5),
    },
    tag: {
        borderRadius: theme.spacing(0.5),
        backgroundColor: 'transparent',
        border: '1px solid',
        '& + &': {
            marginLeft: theme.spacing(),
        },
        color: theme.palette.primary.light,
    },
    error: {
        color: theme.palette.error.main,
        marginBottom: theme.spacing(),
    },
}));
