import * as React from 'react';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import { Labeled } from 'react-admin';
import MuiExpansionPanel from '@material-ui/core/ExpansionPanel';
import MuiExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import MuiExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

const ExpansionPanel = withStyles(theme => ({
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
}))(MuiExpansionPanel);

const ExpansionPanelSummary = withStyles(theme => ({
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
}))(MuiExpansionPanelSummary);

const ExpansionPanelDetails = withStyles(theme => ({
    root: {
        padding: theme.spacing(0, 0, 0),
        border: 'none',
    },
}))(MuiExpansionPanelDetails);

export default function CollapsiblePanel(props) {
    const classes = useStyles();
    const contentLabelClasses = useContentStyles();
    const { children, label, labelComponent, ...rest } = props;
    return (
        <ExpansionPanel {...rest}>
            <ExpansionPanelSummary
                className={classes.expansionPanelSummary}
                expandIcon={
                    <ExpandMoreIcon className={classes.expandMoreIconSummary} />
                }
                aria-controls="appoverviewpanel-content"
            >
                <Labeled
                    // On <Labeled />, this will translate in a correct `for` attribute on the label
                    id="overview"
                    label={label}
                    classes={contentLabelClasses}
                    className={classes.mainField}
                />
                {labelComponent}
            </ExpansionPanelSummary>
            <ExpansionPanelDetails className={classes.expansionPanelDetails}>
                {children}
            </ExpansionPanelDetails>
        </ExpansionPanel>
    );
}

const useStyles = makeStyles(
    theme => ({
        root: {},
        expandMoreIconSummary: {
            color: theme.palette.primary.main || '#333333',
        },
        expansionPanelSummary: {
            padding: 0,
            '& > div': {
                margin: `${theme.spacing(1)}px 0 !important`,
            },
        },
        expansionPanelDetails: {
            display: 'block',
            marginBottom: theme.spacing(1),
            marginLeft: theme.spacing(3),
            fontSize: '1rem',
        },
    }),
    {
        name: 'Layer7ApiSelector',
    }
);

const useContentStyles = makeStyles(theme => ({
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
