// Copyright © 2025 Broadcom Inc. and its subsidiaries. All Rights Reserved.
import { mergeTranslations } from 'react-admin';
import { frenchMessages } from 'layer7-apihub';

export default mergeTranslations(frenchMessages, {
    example: {
        action: {
            toggle_dark_mode: 'Basculer le mode sombre',
        },
    },
});
