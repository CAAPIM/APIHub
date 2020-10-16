import { documents as defaultDocuments } from 'layer7-apihub';
import { DocumentList } from './DocumentList';

export const documents = {
    ...defaultDocuments,
    list: DocumentList,
};
