// Copyright © 2025 Broadcom Inc. and its subsidiaries. All Rights Reserved.
import React from 'react';
import { Edit as RaEdit } from 'react-admin';
import { ViewTitle } from './ViewTitle';

export const Edit = ({ children, ...props }) => (
    <>
        <ViewTitle />
        <RaEdit {...props}>{children}</RaEdit>
    </>
);
