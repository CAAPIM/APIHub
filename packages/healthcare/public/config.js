(function() {
    console.log('Cargando configuración de DESA');

    window.APIHUB_CONFIG = {
        PAGE_TITLE: '(2DESA) Mapfre APIHub',
        APIHUB_URL: 'https://developerdesa.mapfre.net/',
        TENANT_NAME: 'developerdesa',
		ORIGIN_HUB_NAME: 'APIHub-Mapfre',
        ENABLE_MOCK: false,
        MOCK_SERVER_INDICATOR_LINK:
            'https://github.com/CAAPIM/APIHub/blob/master/packages/layer7-apihub-mock/README.md',   
		USE_BRANDING_THEME: true, // Use the branding theme from PAPI
		USE_BRANDING_ICONS: true, // Use the branding favicon from PAPI
    };
})();
