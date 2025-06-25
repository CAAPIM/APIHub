// Copyright © 2025 Broadcom Inc. and its subsidiaries. All Rights Reserved.
const wp = require('@cypress/webpack-preprocessor');
const task = require('cypress-skip-and-only-ui/task');

module.exports = on => {
    const options = {
        webpackOptions: require('../webpack.config'),
    };

    on('before:browser:launch', (browser = {}, launchOptions) => {
        if (browser.name === 'chrome') {
            launchOptions.args.push(
                '--disable-blink-features=RootLayerScrolling',
                '--disable-gpu',
                '--proxy-bypass-list=<-loopback>',
                '--lang=en'
            );
        }
    });

    on('file:preprocessor', wp(options));

    on('task', task);
};
