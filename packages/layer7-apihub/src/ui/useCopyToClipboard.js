import { useNotify } from 'react-admin';
import get from 'lodash/get';

export const useCopyToClipboard = ({
    successMessage = '',
    errorMessage = '',
} = {}) => {
    const notify = useNotify();

    async function copyToClipboard(event) {
        if (!navigator || !navigator.clipboard) {
            // Error message 'Copy to clipboard not supported'
            return;
        }
        const textToCopy = get(event, 'currentTarget.value', '');
        try {
            await navigator.clipboard.writeText(textToCopy);
            notify(successMessage);
            // Success message 'Copied to clipboard!'
        } catch (err) {
            notify(errorMessage);
        }
    }

    return copyToClipboard;
};
