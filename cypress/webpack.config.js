// Copyright © 2025 Broadcom Inc. and its subsidiaries. All Rights Reserved.
module.exports = {
    resolve: {
        extensions: ['.js'],
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: [/node_modules/],
            },
        ],
    },
};
