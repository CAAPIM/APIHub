import React from 'react';
import { Show as RaShow } from 'react-admin';
import { ViewTitle } from './ViewTitle';

export const Show = ({ className, ...props }) => (
    <div className={className}>
        <ViewTitle />
        <RaShow {...props} />
    </div>
);
