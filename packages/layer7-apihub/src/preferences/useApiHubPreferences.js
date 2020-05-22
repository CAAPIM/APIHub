import { useLocalStorage } from '@rehooks/local-storage';

const DEFAULT_STORAGE_KEY = '@layer7/preferences';

/**
 * An hook to get, write or delete a preference.
 * The preferences will be synchronized between all the browser tabs
 * that share same localstorage.
 *
 * @param {string} preferenceName The preference name
 * @param {*} defaultPreference the default preference (is case there isn't)
 *
 * @example <caption>Simple usage</caption>
 *
 * const MyComponent = () => {
 *     const [customPreference, writeCustomPreference] = useApiHubPreference(
 *         'custom',
 *         'default value'
 *     );
 *
 *     console.log(customPreference); // 1st render: shows "default value", 2nd render: shows 'hello'
 *
 *     const handleClick = () => {
 *         writeCustomPreference('hello'); // Triggers an update of the useApiHubPreference hook
 *     };
 *
 *     return <button onClick={handleClick} />;
 * };
 *
 */
export const useApiHubPreference = (preferenceName, defaultPreference) => {
    return useLocalStorage(
        `${DEFAULT_STORAGE_KEY}/${preferenceName}`,
        defaultPreference
    );
};

/**
 * A method to get a preference from the localstorage. Be careful, it's not a hook.
 * The preference will NOT be synchronized every time the preference is updated in the localstorage.
 *
 * Use it only to get an initial preference.
 *
 * @param {string} preferenceName The preference name
 * @param {*} defaultPreference the default preference (is case there isn't)
 *
 */
export const readApiHubPreference = (preferenceName, defaultPreference) => {
    return (
        localStorage.getItem(`${DEFAULT_STORAGE_KEY}/${preferenceName}`) ||
        defaultPreference
    );
};

/**
 * A method to write a preference in the localstorage. Be careful, it's not a hook.
 * The new preference will NOT be synchronized.
 *
 * Use it only to set an initial preference.
 *
 * @param {string} preferenceName The preference name
 * @param {*} newPreference the new preference to save
 *
 */
export const writeApiHubPreference = (preferenceName, newPreference) => {
    localStorage.setItem(
        `${DEFAULT_STORAGE_KEY}/${preferenceName}`,
        newPreference
    );
};
