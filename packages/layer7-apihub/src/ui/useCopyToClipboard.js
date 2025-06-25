// Copyright © 2025 Broadcom Inc. and its subsidiaries. All Rights Reserved.
import get from 'lodash/get';

import { useLayer7Notify } from '../useLayer7Notify';

export const useCopyToClipboard = ({
    successMessage = '',
    errorMessage = '',
} = {}) => {
    const notify = useLayer7Notify();

    async function copyToClipboard(event) {
        if (!navigator || !navigator.clipboard) {
            console.warning('Copy to clipboard not supported');
            return;
        }
        const textToCopy = get(event, 'currentTarget.value', '');
        try {
            await navigator.clipboard.writeText(textToCopy);
            if (successMessage) {
                notify(successMessage);
            }
        } catch (error) {
            notify(errorMessage || error, 'error');
        }
    }

    return copyToClipboard;
};
