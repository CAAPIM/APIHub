import React from 'react';
import { DocumentList as DefaultDocumentList } from 'layer7-apihub';

import { DocumentTitle } from './DocumentTitle';

export const DocumentList = props => {
    return <DefaultDocumentList title={<DocumentTitle />} {...props} />;
};
