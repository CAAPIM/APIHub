// Copyright © 2025 Broadcom Inc. and its subsidiaries. All Rights Reserved.
import get from 'lodash/get';
import isEmpty from 'lodash/isEmpty';
import { useNotify } from 'react-admin';

export const getErrorMessage = error => {
    const message =
        get(error, 'body.userErrorMessage', '') ||
        get(error, 'body.error.message.value');
    const validationErrorCheck1 = get(error, 'body.validationErrors', {});
    const validationErrorCheck2 = get(
        error,
        'body.error.detail.validationErrors',
        {}
    );
    const validationErrors = !isEmpty(validationErrorCheck1)
        ? validationErrorCheck1
        : validationErrorCheck2;

    if (!validationErrors || Object.keys(validationErrors).length === 0) {
        return message;
    }

    const validationMessages = Object.keys(validationErrors)
        .map(
            validationField =>
                get(validationErrors, `${validationField}.error`, '') ||
                get(validationErrors, `${validationField}.localizedMessage`, '')
        )
        .join(' ');

    return `${validationMessages}`;
};

export const useLayer7Notify = () => {
    const notify = useNotify();

    return (message, type = 'info', messageArgs, undoable = false) => {
        if (typeof message === 'object') {
            const errorMessage = getErrorMessage(message);

            notify(errorMessage, { type: 'error' });
        } else {
            notify(message, { type, messageArgs, undoable });
        }
    };
};
