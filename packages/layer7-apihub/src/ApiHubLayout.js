import React from 'react';
import { Layout } from 'react-admin';
import { ApiHubAppBar } from './ApiHubAppBar';
import { ApiHubMenu } from './ApiHubMenu';

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
    return <Layout appBar={appBar} menu={menu} {...rest} />;
};
