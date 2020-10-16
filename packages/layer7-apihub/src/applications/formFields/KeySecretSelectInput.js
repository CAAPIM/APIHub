import React, { useState, useEffect } from 'react';
import { useQuery, required, RadioButtonGroupInput } from 'react-admin';
import { useTranslate } from 'ra-core';
import { makeStyles } from '@material-ui/core/styles';
import get from 'lodash/get';

const useSelectInputStyles = makeStyles({
    input: {
        width: '100%',
    },
});

export const KeySecretSelectInput = () => {
    const [allowHashedSecret, setAllowHashedSecret] = useState(false);
    const [allowPlainTextSecret, setAllowPlainTextSecret] = useState(false);
    const translate = useTranslate();
    const { data, error, loading } = useQuery({
        type: 'getSecretHashMetadata',
        resource: 'applications',
        payload: {},
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
    const classes = useSelectInputStyles();

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
