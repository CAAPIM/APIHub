import * as React from 'react';
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Typography,
} from '@material-ui/core';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import { useDataProvider, useTranslate } from 'ra-core';
import { ApiSelectionModalTaC } from './ApiSelectionModalTaC';
import { useLayer7Notify } from '../../useLayer7Notify';

export function ApiGroupSelectionModal(props) {
    const { apiGroup, onConfirm, onCancel, orgUuid } = props;
    const [apiGroupEula, setApiGroupEula] = React.useState();
    const dataProvider = useDataProvider();
    const translate = useTranslate();
    const notify = useLayer7Notify();
    const classes = useStyles(props);

    React.useEffect(() => {
        async function fetchApiGroupEula() {
            const { data } = await dataProvider.getApiGroupEula(
                'apiGroups',
                {
                    apiGroupId: apiGroup.id,
                    filter: { OrganizationUuid: orgUuid },
                },
                {
                    onFailure: error => notify(error),
                }
            );

            setApiGroupEula(data);
        }

        if (apiGroup) {
            fetchApiGroupEula();
        }
    }, [JSON.stringify(apiGroup)]); // eslint-disable-line

    return (
        <Dialog
            fullWidth
            maxWidth="md"
            open={!!apiGroup}
            onClose={onCancel}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
        >
            <>
                <DialogTitle id="alert-dialog-title">
                    {apiGroup?.name} ({apiGroup?.apis?.length})
                </DialogTitle>
                <DialogContent>
                    <ApiSelectionModalTaC content={apiGroupEula?.content} />
                </DialogContent>
                <DialogActions>
                    <Button onClick={onCancel} color="primary">
                        {translate('ra.action.cancel')}
                    </Button>
                    <Button onClick={onConfirm} color="primary" autoFocus>
                        {translate(
                            'resources.applications.actions.accept_terms_and_conditions'
                        )}
                    </Button>
                </DialogActions>
            </>
        </Dialog>
    );
}

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
