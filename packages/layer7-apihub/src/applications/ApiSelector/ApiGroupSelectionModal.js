// Copyright © 2025 Broadcom Inc. and its subsidiaries. All Rights Reserved.
import React, { useState, useEffect } from 'react';
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
} from '@mui/material';
import { makeStyles } from 'tss-react/mui';
import { useDataProvider, useTranslate } from 'react-admin';
import { ApiSelectionModalTaC } from './ApiSelectionModalTaC';
import { useLayer7Notify } from '../../useLayer7Notify';
import { useMutation } from '@tanstack/react-query';

export function ApiGroupSelectionModal(props) {
    const { apiGroup, onConfirm, onCancel, orgUuid } = props;
    const [apiGroupEula, setApiGroupEula] = useState();
    const dataProvider = useDataProvider();
    const translate = useTranslate();
    const notify = useLayer7Notify();
    const { mutateAsync } = useMutation({
        mutationFn: ({ apiGroupId, filter }) =>
            dataProvider.getApiGroupEula('apiGroups', {
                apiGroupId,
                filter,
            }),
    });

    useEffect(() => {
        async function fetchApiGroupEula() {
            const { data } = await mutateAsync(
                {
                    apiGroupId: apiGroup.id,
                    filter: { OrganizationUuid: orgUuid },
                },
                {
                    onError: error => notify(error),
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
                    <Button onClick={onCancel}>
                        {translate('ra.action.cancel')}
                    </Button>
                    <Button onClick={onConfirm} autoFocus>
                        {translate(
                            'resources.applications.actions.accept_terms_and_conditions'
                        )}
                    </Button>
                </DialogActions>
            </>
        </Dialog>
    );
}

const useStyles = makeStyles({ name: 'Layer7ApplicationApiPlansList' })(
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
    })
);
