import theme from '../theme.json';

export function getTheme(database) {
    return (schema, request) => {
        return theme;
    };
}
