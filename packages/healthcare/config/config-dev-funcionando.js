(function() {
    console.log('Loading dev config');

    window.APIHUB_CONFIG = {
        PAGE_TITLE: '(dev) Healthcare',
        APIHUB_URL: 'https://apim.dev.ca.com',
        TENANT_NAME: 'apim',
        ENABLE_MOCK: true,
        MOCK_SERVER_INDICATOR_LINK:
            'https://github.com/CAAPIM/APIHub/blob/master/packages/layer7-apihub-mock/README.md',
    };
})();
