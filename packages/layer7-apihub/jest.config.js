const { jest: jestConfig } = require('kcd-scripts/config');

module.exports = Object.assign(jestConfig, {
    coverageThreshold: {
        global: {
            branches: 0,
            functions: 0,
            lines: 0,
            statements: 0,
        },
    },
    moduleNameMapper: {
        '\\.(css|less|scss)$': 'identity-obj-proxy',
    },
    setupFiles: [
        './src/setupTests.js',
    ],
    testTimeout: 10000,
    testMatch: ['/**/*.test.(js|jsx|ts|tsx)'],
    transformIgnorePatterns: ['node_modules/(?!(@material-ui/lab/esm)/)'],
});