import React from 'react';
import Button from '@material-ui/core/Button';

export const AddDocumentButton = ({ document, onClick, ...rest }) => {
    const handleAddNewDocument = () => {
        onClick(document);
    };

    return <Button onClick={handleAddNewDocument} {...rest}></Button>;
};
