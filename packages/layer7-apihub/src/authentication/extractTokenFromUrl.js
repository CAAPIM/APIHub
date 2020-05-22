const TokenUrlRegExp = /.*#token\/(.+)/;

export const extractTokenFromUrl = url => {
    const matches = TokenUrlRegExp.exec(url);

    if (matches && matches.length > 1) {
        return matches[1];
    }

    return null;
};
