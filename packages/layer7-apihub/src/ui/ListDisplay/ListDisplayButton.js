import React from 'react';
import ToggleButton from '@material-ui/lab/ToggleButton';
import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup';
import Tooltip from '@material-ui/core/Tooltip';
import ViewListIcon from '@material-ui/icons/ViewList';
import ViewModuleIcon from '@material-ui/icons/ViewModule';
import { useTranslate } from 'ra-core';

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
