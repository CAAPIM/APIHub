// Copyright © 2025 Broadcom Inc. and its subsidiaries. All Rights Reserved.
import { fetchUtils } from 'react-admin';

export function getFetchJson(originHubName) {
    return (url, options = {}) => {
        if (!options.headers) {
            options.headers = new Headers({ Accept: 'application/json' });
        }

        options.headers.set('Content-Type', 'application/json; charset=UTF-8');
        options.headers.set('Origin-Hub-Name', originHubName);
        options.credentials = options.credentials || 'include';

        return fetchUtils.fetchJson(url, options);
    };
}
