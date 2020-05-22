import React from 'react';
import { Edit as RaEdit } from 'react-admin';
import { ViewTitle } from './ViewTitle';

export const Edit = props => (
    <>
        <ViewTitle />
        <RaEdit {...props} />
    </>
);
