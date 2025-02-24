import * as React from 'react';
import { useGetList, useGetOne } from 'ra-core';
import { SimpleForm } from 'react-admin';
import { CustomFieldInput, ApiSelector } from 'layer7-apihub';

export function TestPage() {
    const [formValues, setFormValues] = React.useState();

    const { ids, data, loaded } = useGetList(
        'customFields',
        undefined,
        undefined,
        {
            EntityType: 'APPLICATION',
            Status: 'ENABLED',
        }
    );
    const { data: apiEula } = useGetOne(
        'apiEulas',
        'c9406345-eb76-11e3-b0cd-000nosaj86a8'
    );

    if (!loaded) {
        return null;
    }

    const handleSubmit = values => {
        setFormValues(values);
    };

    return (
        <>
            <SimpleForm basePath="/applications" resource="applications">
                <ApiSelector source="selected" />
            </SimpleForm>
            <SimpleForm resource="Application" save={handleSubmit}>
                {ids.map(id => (
                    <CustomFieldInput key={id} customField={data[id]} />
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
