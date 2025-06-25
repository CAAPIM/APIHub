// Copyright © 2025 Broadcom Inc. and its subsidiaries. All Rights Reserved.
import * as React from 'react';
import { makeStyles } from 'tss-react/mui';
import { withStyles } from 'tss-react/mui';
import { useTranslate } from 'react-admin';
import MuiExpansionPanel from '@mui/material/Accordion';
import MuiExpansionPanelSummary from '@mui/material/AccordionSummary';
import MuiExpansionPanelDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

const Accordion = withStyles(MuiExpansionPanel, theme => ({
    root: {
        width: '100%',
        border: 'none',
        borderBottom: `1px solid ${theme.palette.grey[200]}`,
        boxShadow: 'none',
        '&:not(:last-child)': {
            borderBottom: 0,
        },
        '&:before': {
            display: 'none',
        },
        '&$expanded': {
            margin: 'auto',
        },
    },
    expanded: {},
}));

const AccordionSummary = withStyles(MuiExpansionPanelSummary, theme => ({
    root: {
        borderBottom: `1px solid ${theme.palette.grey[200]}`,
        marginBottom: -1,
        minHeight: 56,
        '&$expanded': {
            minHeight: 56,
        },
        padding: 0,
    },
    content: {
        display: 'block',
        '&$expanded': {
            margin: '12px 0',
        },
    },
    expanded: {},
}));

const AccordionDetails = withStyles(MuiExpansionPanelDetails, theme => ({
    root: {
        padding: theme.spacing(0, 0, 0),
        border: 'none',
    },
}));

export default function CollapsiblePanel(props) {
    const { classes } = useStyles();
    const { children, label, labelComponent, ...rest } = props;
    const translate = useTranslate();
    return (
        <Accordion {...rest}>
            <AccordionSummary
                className={classes.expansionPanelSummary}
                expandIcon={
                    <ExpandMoreIcon className={classes.expandMoreIconSummary} />
                }
                aria-controls="appoverviewpanel-content"
            >
                <span className={classes.label}>
                    {
                        translate(label, {
                            _: label,
                        }) /* set default to label variable if translation fails */
                    }
                </span>
                {labelComponent}
            </AccordionSummary>
            <AccordionDetails className={classes.expansionPanelDetails}>
                {children}
            </AccordionDetails>
        </Accordion>
    );
}

const useStyles = makeStyles({ name: 'Layer7ApiSelector' })(theme => ({
    root: {},
    expandMoreIconSummary: {
        color: theme.palette.primary.main || '#333333',
    },
    expansionPanelSummary: {
        padding: 0,
        '& > div': {
            margin: `${theme.spacing(1)} 0 !important`,
        },
    },
    expansionPanelDetails: {
        display: 'block',
        marginBottom: theme.spacing(1),
        marginLeft: theme.spacing(3),
        fontSize: '1rem',
    },
    label: {
        color: theme.palette.primary.main || '#333333',
        fontFamily: theme.typography.textHub,
        fontWeight: theme.typography.fontWeightBold,
        fontSize: '21px',
        lineHeight: '22px',
        margin: theme.spacing(1, 0, 1, 0),
        transform: 'unset',
    },
}));
