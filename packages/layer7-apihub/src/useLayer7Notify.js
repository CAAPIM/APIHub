import get from 'lodash/get';
import { useNotify } from 'ra-core';

export const getErrorMessage = error => {
    const message =
        get(error, 'body.userErrorMessage', '') ||
        get(error, 'body.error.message.value');
    const validationErrors = get(error, 'body.validationErrors', {});

    if (!validationErrors || Object.keys(validationErrors).length === 0) {
        return message;
    }

    const validationMessages = Object.keys(validationErrors)
        .map(validationField =>
            get(validationErrors, `${validationField}.localizedMessage`, '')
        )
        .join(' ');

    return `${message} ${validationMessages}`;
};

export const useLayer7Notify = () => {
    const notify = useNotify();

    return (message, type = 'info', messageArgs, undoable = false) => {
        if (typeof message === 'object') {
            const errorMessage = getErrorMessage(message);

            notify(errorMessage, 'error');
            return;
        }

        notify(message, type, messageArgs, undoable);
    };
};
