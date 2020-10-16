import React from 'react';
import { Create as RaCreate } from 'react-admin';
import { ViewTitle } from './ViewTitle';

export const Create = props => (
    <>
        <ViewTitle />
        <RaCreate {...props} />
    </>
);
