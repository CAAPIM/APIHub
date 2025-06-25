// Copyright © 2025 Broadcom Inc. and its subsidiaries. All Rights Reserved.
import React from 'react';
import { List as RaList, Pagination } from 'react-admin';

import { ViewTitle } from './ViewTitle';

/**
 * A List component which displays the react-admin list with the title above.
 *
 * @param {*} props The react-admin list properties
 * @param {string} props.resource The resource to fetch.
 * @param {int} props.perPage The perPage option, default to 12.
 *
 */

const PER_PAGE_OPTIONS = [12, 24, 48];
const PER_PAGE_DEFAULT = 12;

export const List = ({ className, children, ...props }) => {
    return (
        <div className={className}>
            <ViewTitle />
            <RaList
                perPage={PER_PAGE_DEFAULT}
                pagination={
                    <Pagination rowsPerPageOptions={PER_PAGE_OPTIONS} />
                }
                {...props}
            >
                {children}
            </RaList>
        </div>
    );
};
