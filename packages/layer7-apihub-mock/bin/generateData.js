#!/usr/bin/env node

/**
 * This CLI generate fake data for use with mocking server.
 *
 * @example <caption>Generating data at the default location.</caption>
 * // Run the following command at the workspace root
 * ./packages/layer7-apihub-mock/bin/generateData.js
 *
 * @example <caption>Generating data at a custom location.</caption>
 * // Run the following command at the workspace root
 * ./packages/layer7-apihub-mock/bin/generateData.js ~/data.json
 */
const fs = require('fs');
const path = require('path');
const parseArgs = require('minimist');

const { generateData } = require('../src/data');

const args = parseArgs(process.argv.slice(2));
const json = generateData();
const output =
    args._.length > 0
        ? args._[0]
        : path.resolve(__dirname, '../src/defaultData.json');

fs.writeFileSync(output, JSON.stringify(json, null, 4));
