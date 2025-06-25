// Copyright © 2025 Broadcom Inc. and its subsidiaries. All Rights Reserved.
import React from 'react';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import Tooltip from '@mui/material/Tooltip';
import ViewListIcon from '@mui/icons-material/ViewList';
import ViewModuleIcon from '@mui/icons-material/ViewModule';
import { useTranslate } from 'react-admin';

import {
    useListDisplay,
    LIST_DISPLAY_CARDS,
    LIST_DISPLAY_DATAGRID,
} from './ListDisplayContext';

export const ListDisplayButton = props => {
    const [display, setDisplay] = useListDisplay();

    const handleChange = (event, value) => {
        setDisplay(value);
    };

    return (
        <ToggleButtonGroup
            exclusive
            onChange={handleChange}
            value={display}
            size="small"
            {...props}
        >
            <ToggleButtonWithTooltip
                label="apihub.actions.view_as_cards"
                value={LIST_DISPLAY_CARDS}
            >
                <ViewModuleIcon />
            </ToggleButtonWithTooltip>
            <ToggleButtonWithTooltip
                label="apihub.actions.view_as_list"
                value={LIST_DISPLAY_DATAGRID}
            >
                <ViewListIcon />
            </ToggleButtonWithTooltip>
        </ToggleButtonGroup>
    );
};

const ToggleButtonWithTooltip = ({ label, title = label, ...props }) => {
    const translate = useTranslate();

    const translatedLabel = translate(label, { _: label });
    const translatedTitle = translate(title, { _: title });

    return (
        <Tooltip title={translatedTitle}>
            <ToggleButton aria-label={translatedLabel} {...props} />
        </Tooltip>
    );
};
