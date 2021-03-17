import React from 'react';
import ReactDOM from 'react-dom';
import { startApiHubMockedServer } from 'layer7-apihub-mock';

import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import data from './data.json';

const { ENABLE_MOCK, MOCK_SERVER_INDICATOR_LINK } = global.APIHUB_CONFIG;

export const shouldEnableMock = (enableMock = ENABLE_MOCK) =>
    enableMock === 'true' || enableMock === true;

if (!shouldEnableMock(ENABLE_MOCK)) {
    ReactDOM.render(<App />, document.getElementById('root'));
} else {
    console.log('Starting the mocked server');
    startApiHubMockedServer({
        data,
        runningIndicatorLink: MOCK_SERVER_INDICATOR_LINK,
    }).then(() => ReactDOM.render(<App />, document.getElementById('root')));
}

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
