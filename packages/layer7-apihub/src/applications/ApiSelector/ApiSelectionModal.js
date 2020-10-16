import * as React from 'react';
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography,
} from '@material-ui/core';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import { useDataProvider, useTranslate } from 'ra-core';
import { LoadingIndicator } from 'react-admin';
import { ApiSelectionModalTaC } from './ApiSelectionModalTaC';
import { TruncatedTextField } from '../../ui';
import { useLayer7Notify } from '../../useLayer7Notify';

export function ApiSelectionModal(props) {
    const { api, onConfirm, onCancel, apiPlansEnabled, orgUuid } = props;
    const [apiPlans, setApiPlans] = React.useState([]);
    const [selectedApiPlan, setSelectedApiPlan] = React.useState();
    const [isLoaded, setIsLoaded] = React.useState(false);
    const [apiEula, setApiEula] = React.useState();
    const classes = useStyles(props);
    const dataProvider = useDataProvider();
    const translate = useTranslate();
    const notify = useLayer7Notify();

    React.useEffect(() => {
        async function fetchApiPlans() {
            const { data } = await dataProvider.getApiPlansByApi(
                'apiPlans',
                {
                    apiId: api.id,
                    orgUuid: orgUuid,
                },
                {
                    onFailure: error => notify(error),
                }
            );

            setApiPlans(data);
            setIsLoaded(true);
        }

        async function fetchApiEula() {
            const { data } = await dataProvider.getOne(
                'apiEulas',
                {
                    id: api.apiEulaUuid,
                },
                {
                    onFailure: error => notify(error),
                }
            );

            setApiEula(data);
        }

        if (api) {
            if (apiPlansEnabled) {
                fetchApiPlans();
            } else {
                setIsLoaded(true);
            }

            fetchApiEula();
        }
    }, [JSON.stringify(api)]); // eslint-disable-line

    const onClose = () => {
        setApiPlans([]);
        setSelectedApiPlan(undefined);
        setApiEula(undefined);
        setIsLoaded(false);
        onCancel();
    };

    const onAPIConfirm = () => {
        api.apiPlan = selectedApiPlan;
        setApiPlans([]);
        setSelectedApiPlan(undefined);
        setApiEula(undefined);
        setIsLoaded(false);
        onConfirm();
    };

    return (
        <Dialog
            fullWidth
            maxWidth="md"
            open={!!api}
            onClose={onClose}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
        >
            {!isLoaded && !apiEula && <LoadingIndicator />}
            {isLoaded && !!api ? (
                <>
                    <DialogTitle id="alert-dialog-title">
                        {api.name} v{api.version}
                    </DialogTitle>
                    {selectedApiPlan && (
                        <TableContainer className={classes.planSummaryTable}>
                            <Table
                                size="small"
                                stickyHeader
                                aria-label="sticky table"
                            >
                                <TableBody>
                                    <TableRow>
                                        <StyledTableCell
                                            component="th"
                                            scope="row"
                                        >
                                            {selectedApiPlan.name}
                                        </StyledTableCell>
                                        <StyledTableCell align="left">
                                            <TruncatedTextField
                                                record={selectedApiPlan}
                                                source="description"
                                            />
                                        </StyledTableCell>
                                        <StyledTableCell align="left">
                                            {selectedApiPlan.rateLimit}
                                        </StyledTableCell>
                                        <StyledTableCell align="left">
                                            {selectedApiPlan.quota}
                                        </StyledTableCell>
                                        <StyledTableCell align="left">
                                            {selectedApiPlan.quotaInterval}
                                        </StyledTableCell>
                                    </TableRow>
                                </TableBody>
                            </Table>
                        </TableContainer>
                    )}
                    {apiPlans.length === 0 || selectedApiPlan ? (
                        <DialogContent>
                            <ApiSelectionModalTaC content={apiEula?.Content} />
                        </DialogContent>
                    ) : null}
                    {apiPlans && apiPlans.length > 0 && !selectedApiPlan ? (
                        <DialogContent>
                            <Typography className={classes.heading}>
                                {translate('apihub.actions.select_an_api_plan')}
                            </Typography>
                            <TableContainer className={classes.container}>
                                <Table
                                    className={classes.table}
                                    size="small"
                                    stickyHeader
                                    aria-label="sticky table"
                                >
                                    <TableHead>
                                        <TableRow>
                                            <StyledTableCell align="left">
                                                {translate(
                                                    'resources.apiPlans.fields.name'
                                                )}
                                            </StyledTableCell>
                                            <StyledTableCell align="left">
                                                {translate(
                                                    'resources.apiPlans.fields.description'
                                                )}
                                            </StyledTableCell>
                                            <StyledTableCell align="left">
                                                {translate(
                                                    'resources.apiPlans.fields.rate_limit'
                                                )}
                                            </StyledTableCell>
                                            <StyledTableCell align="left">
                                                {translate(
                                                    'resources.apiPlans.fields.quota'
                                                )}
                                            </StyledTableCell>
                                            <StyledTableCell align="left">
                                                {translate(
                                                    'resources.apiPlans.fields.quota_interval'
                                                )}
                                            </StyledTableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {apiPlans.map(row => (
                                            <TableRow
                                                key={row.uuid}
                                                hover
                                                onClick={() =>
                                                    setSelectedApiPlan(row)
                                                }
                                            >
                                                <StyledTableCell
                                                    component="th"
                                                    scope="row"
                                                >
                                                    {row.name}
                                                </StyledTableCell>
                                                <StyledTableCell align="left">
                                                    <TruncatedTextField
                                                        record={row}
                                                        source="description"
                                                    />
                                                </StyledTableCell>
                                                <StyledTableCell align="left">
                                                    {row.rateLimit}
                                                </StyledTableCell>
                                                <StyledTableCell align="left">
                                                    {row.quota}
                                                </StyledTableCell>
                                                <StyledTableCell align="left">
                                                    {row.quotaInterval}
                                                </StyledTableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </DialogContent>
                    ) : null}
                    <DialogActions>
                        <Button onClick={onClose} color="primary">
                            {translate('ra.action.cancel')}
                        </Button>
                        <Button
                            onClick={onAPIConfirm}
                            color="primary"
                            autoFocus
                            disabled={
                                !isLoaded ||
                                (isLoaded &&
                                    apiPlans.length > 0 &&
                                    !selectedApiPlan)
                            }
                        >
                            {translate(
                                'resources.applications.actions.accept_terms_and_conditions'
                            )}
                        </Button>
                    </DialogActions>
                </>
            ) : null}
        </Dialog>
    );
}

const StyledTableCell = withStyles(theme => ({
    head: {
        fontSize: theme.typography.body1,
        fontWeight: '600',
        whiteSpace: 'nowrap',
    },
    body: {
        fontSize: theme.typography.body1,
        fontWeight: '500',
    },
}))(TableCell);

const useStyles = makeStyles(
    theme => ({
        heading: {
            fontSize: theme.typography.pxToRem(14),
            fontWeight: theme.typography.fontWeightBold,
            color: theme.palette.grey[600],
            marginBottom: theme.spacing(3),
        },
        planSummaryTable: {
            marginLeft: theme.spacing(1),
            width: '97%',
        },
        table: {
            minWidth: '100%',
        },
        container: {
            maxHeight: '100%',
        },
    }),
    {
        name: 'Layer7ApplicationApiPlansList',
    }
);
