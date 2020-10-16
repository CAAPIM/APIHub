import { mergeTranslations } from 'react-admin';
import { italianMessages } from 'layer7-apihub';

export default mergeTranslations(italianMessages, {
    example: {
        action: {
            toggle_dark_mode: 'Attivare la modalità oscura',
        },
    },
});
