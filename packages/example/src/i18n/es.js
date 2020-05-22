import { mergeTranslations } from 'react-admin';
import { spanishMessages } from 'layer7-apihub';

export default mergeTranslations(spanishMessages, {
    example: {
        action: {
            toggle_dark_mode: 'Cambiar el modo de oscuridad',
        },
    },
});
