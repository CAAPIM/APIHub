import React from 'react';
import get from 'lodash/get';

import { Documentation as BaseDocumentation } from '../documentation';

export const ApiDocumentation = props => {
    const { record } = props;

    return <BaseDocumentation {...props} entityUuid={get(record, 'id')} />;
};
