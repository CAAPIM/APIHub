// Copyright © 2025 Broadcom Inc. and its subsidiaries. All Rights Reserved.
import React from 'react';
import { Show as RaShow } from 'react-admin';
import { ViewTitle } from './ViewTitle';

export const Show = ({ className, children, ...props }) => (
    <div className={className}>
        <ViewTitle />
        <RaShow {...props}>{children}</RaShow>
    </div>
);
