import React from 'react';
import { Layout } from 'react-admin';
import { ApiHubAppBar } from './ApiHubAppBar';
import { ApiHubMenu } from './ApiHubMenu';
import { useSelector } from 'react-redux';

/**
 * The ApiHub Layout used in the ApiHub Admin.
 *
 * @param {*} appBar The AppBar component
 * @param {*} sidebar The Sidebar component
 * @param {*} menu The Menu component
 * @param {*} rest The other Layout properties
 */
export const ApiHubLayout = ({
    appBar = ApiHubAppBar,
    menu = ApiHubMenu,
    ...rest
}) => {

  // In order to let the components use Redux-based dataProvider
    // hooks like useGetOne, we must wait for the resource registration before
    // displaying the dashboard.
    // This fix should be reverted after the release of React Admin v3.6.3.
    const resourcesAreRegistered = useSelector(
        state => Object.keys(state.admin.resources).length > 0
    );

    if (!resourcesAreRegistered) {
        return null;
    }

    return <Layout appBar={appBar} menu={menu} {...rest} />;
};
