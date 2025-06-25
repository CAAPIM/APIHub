// Copyright © 2025 Broadcom Inc. and its subsidiaries. All Rights Reserved.
import React, { useState } from 'react';
import { SaveButton, SimpleForm, useGetList, useGetOne } from 'react-admin';
import { CustomFieldInput, ApiSelector } from 'layer7-apihub';
import Toolbar from '@mui/material/Toolbar';

export function TestPage() {
    const [formValues, setFormValues] = useState();

    const { data, isSuccess } = useGetList('customFields', {
        meta: {
            entityType: 'APPLICATION',
            status: 'ENABLED',
        },
    });
    const { data: apiEula } = useGetOne('apiEulas', {
        id: 'c9406345-eb76-11e3-b0cd-000nosaj86a8',
    });

    const handleSubmit = values => {
        setFormValues(values);
    };
    if (!isSuccess) {
        return null;
    }
    return (
        <>
            <SimpleForm
                basePath="/applications"
                resource="applications"
                sanitizeEmptyValues={true}
                toolbar={<EditToolbar />}
            >
                <ApiSelector source="selected" />
            </SimpleForm>
            <SimpleForm
                resource="Application"
                save={handleSubmit}
                sanitizeEmptyValues={true}
                toolbar={<EditToolbar />}
            >
                {data.map(customField => (
                    <CustomFieldInput
                        key={customField.id}
                        customField={customField}
                    />
                ))}
            </SimpleForm>
            <p>{formValues ? JSON.stringify(formValues, null, 4) : null}</p>
            <h2>ApiEula</h2>
            <p
                dangerouslySetInnerHTML={{
                    __html: apiEula ? apiEula.content : null,
                }}
            />
        </>
    );
}

const EditToolbar = () => (
    <Toolbar>
        <SaveButton />
    </Toolbar>
);
