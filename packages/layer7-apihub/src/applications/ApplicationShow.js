import React from 'react';

import { Show } from '../ui';
import { ApplicationDetails } from './ApplicationDetails';
import { Status } from './Status';

const ApplicationTitle = ({ record }) => {
    if (!record) {
        return null;
    }

    return (
        <div>
            <div>{record ? record.name : ''}</div>
            <Status record={record} />
        </div>
    );
};

export const ApplicationShow = ({ permissions, id, ...rest }) => {
    return (
        <Show title={<ApplicationTitle />} id={id} {...rest}>
            <ApplicationDetails />
        </Show>
    );
};
