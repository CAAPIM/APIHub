// Copyright © 2025 Broadcom Inc. and its subsidiaries. All Rights Reserved.
import React, { useState, useEffect } from 'react';
import { required, RadioButtonGroupInput, useDataProvider, useTranslate } from 'react-admin';
import { makeStyles } from 'tss-react/mui';
import get from 'lodash/get';
import { useQuery } from '@tanstack/react-query';

const useSelectInputStyles = makeStyles()({
    input: {
        width: '100%',
    },
});

export const KeySecretSelectInput = () => {
    const [allowHashedSecret, setAllowHashedSecret] = useState(false);
    const [allowPlainTextSecret, setAllowPlainTextSecret] = useState(false);
    const translate = useTranslate();
    const dataProvider = useDataProvider();
    // const { data, error, loading } = useQuery({
    //     type: 'getSecretHashMetadata',
    //     resource: 'applications',
    //     payload: {},
    // });
    const { data, error, loading } = useQuery({
        queryKey: ['applications', 'getSecretHashMetadata'],
        queryFn: () => dataProvider.getSecretHashMetadata('applications'),
    });
    useEffect(() => {
        if (error) {
            setAllowHashedSecret(false);
            setAllowPlainTextSecret(false);
        } else if (data && data.value) {
            const isPlainTextAllowed = get(
                JSON.parse(data.value),
                'plaintextAllowed'
            );
            setAllowHashedSecret(true);
            setAllowPlainTextSecret(isPlainTextAllowed);
        } else {
            setAllowHashedSecret(false);
            setAllowPlainTextSecret(true);
        }
    }, [data, error]);
    const { classes } = useSelectInputStyles();

    const choices = [
        ...(allowPlainTextSecret
            ? [
                  {
                      id: 'plaintext',
                      name: translate(
                          'resources.applications.actions.plainTextSecret'
                      ),
                      checked: true,
                  },
              ]
            : []),
        ...(allowHashedSecret
            ? [
                  {
                      id: 'hashedsecret',
                      name: translate(
                          'resources.applications.actions.hashedSecret'
                      ),
                  },
              ]
            : []),
    ];

    if (loading || (!allowPlainTextSecret && !allowHashedSecret)) {
        return null;
    }
    return (
        <RadioButtonGroupInput
            source="sharedSecret"
            label="resources.applications.fields.sharedSecretFormat"
            className={classes.input}
            choices={choices}
            validate={required()}
        />
    );
};
