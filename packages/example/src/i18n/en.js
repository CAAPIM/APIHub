import { mergeTranslations } from 'react-admin';
import { englishMessages } from 'layer7-apihub';

export default mergeTranslations(englishMessages, {
    example: {
        action: {
            toggle_dark_mode: 'Toggle dark mode',
        },
    },
});
