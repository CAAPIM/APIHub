import React from 'react';
import { useQuery } from 'react-admin';
import { useTranslate, linkToRecord } from 'ra-core';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Link from '@material-ui/core/Link';
import { Link as RouterLink } from 'react-router-dom';

import MuiExpansionPanel from '@material-ui/core/ExpansionPanel';
import MuiExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import MuiExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

const getAppApis = (allApis, selectedApis) =>
    allApis.filter(api => selectedApis.includes(api.id));

const ExpansionPanel = withStyles(theme => ({
    root: {
        width: '100%',
        border: `1px solid ${theme.palette.grey[500]}`,
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
        backgroundColor: theme.palette.background.default,
        borderBottom: `1px solid ${theme.palette.grey[500]}`,
        marginBottom: -1,
        minHeight: 56,
        '&$expanded': {
            minHeight: 56,
        },
    },
    content: {
        '&$expanded': {
            margin: '12px 0',
        },
    },
    expanded: {},
}))(MuiExpansionPanelSummary);

const ExpansionPanelDetails = withStyles(theme => ({
    root: {
        padding: theme.spacing(1, 0, 0),
    },
}))(MuiExpansionPanelDetails);

const StyledTableCell = withStyles(theme => ({
    head: {
        fontSize: theme.typography.body1,
        fontWeight: '600',
    },
    body: {
        fontSize: theme.typography.body1,
        fontWeight: '500',
        maxWidth: '33%',
    },
}))(TableCell);

const useStyles = makeStyles(theme => ({
    root: {
        width: '100%',
    },
    table: {
        minWidth: '100%',
    },
    container: {
        maxHeight: '100%',
    },
    heading: {
        fontSize: theme.typography.pxToRem(15),
        fontWeight: theme.typography.fontWeightBold,
        textTransform: 'uppercase',
        color: theme.palette.grey[600],
        marginLeft: theme.spacing(1),
        marginRight: theme.spacing(1),
    },
}));

export const ApplicationApisList = ({ apis }) => {
    const classes = useStyles();
    const translate = useTranslate();

    const { data = [] } = useQuery({
        type: 'getApis',
        resource: 'apis',
    });

    const appApis = apis ? getAppApis(data, apis) : [];

    return (
        <ExpansionPanel square>
            <ExpansionPanelSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="apilistpanel-content"
                id="apilistpanel-header"
            >
                <Typography variant="subtitle1" className={classes.heading}>
                    {translate('resources.applications.fields.apisIncluded')} (
                    {appApis.length})
                </Typography>
            </ExpansionPanelSummary>
            <ExpansionPanelDetails>
                <TableContainer className={classes.container}>
                    <Table
                        className={classes.table}
                        size="small"
                        stickyHeader
                        aria-label="sticky table"
                    >
                        <TableHead className={classes.tableHeader}>
                            <TableRow>
                                <StyledTableCell>
                                    {translate(`resources.apis.name`, {
                                        smart_count: 1,
                                    })}
                                </StyledTableCell>
                                <StyledTableCell align="center">
                                    {translate('resources.apis.fields.version')}
                                </StyledTableCell>
                                <StyledTableCell align="left">
                                    {translate(
                                        'resources.apis.fields.description'
                                    )}
                                </StyledTableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {appApis &&
                                appApis.map(row => (
                                    <TableRow key={row.id}>
                                        <StyledTableCell
                                            component="th"
                                            scope="row"
                                        >
                                            <Link
                                                component={RouterLink}
                                                to={linkToRecord(
                                                    '/apis',
                                                    row && row.id,
                                                    'show'
                                                )}
                                            >
                                                {row.name}
                                            </Link>
                                        </StyledTableCell>
                                        <StyledTableCell align="center">
                                            {row.version}
                                        </StyledTableCell>
                                        <StyledTableCell
                                            align="left"
                                            style={{
                                                maxWidth: '30%',
                                                textOverflow: 'ellipsis',
                                            }}
                                        >
                                            {row.description}
                                        </StyledTableCell>
                                    </TableRow>
                                ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </ExpansionPanelDetails>
        </ExpansionPanel>
    );
};
