// Copyright © 2025 Broadcom Inc. and its subsidiaries. All Rights Reserved.
const TokenUrlRegExp = /.*[#|%23]token\/(.+)/;

export const extractTokenFromUrl = url => {
    const matches = TokenUrlRegExp.exec(url);

    if (matches && matches.length > 1) {
        return matches[1];
    }

    return null;
};
