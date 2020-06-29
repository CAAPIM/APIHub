import { fetchUtils } from 'ra-core';

export function getFetchJson(originHubName) {
    return (url, options = {}) => {
        if (!options.headers) {
            options.headers = new Headers({ Accept: 'application/json' });
        }

        options.headers.set('Origin-Hub-Name', originHubName);
        options.credentials = options.credentials || 'include';

        return fetchUtils.fetchJson(url, options);
    };
}
