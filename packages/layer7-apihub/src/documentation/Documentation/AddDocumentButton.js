// Copyright © 2025 Broadcom Inc. and its subsidiaries. All Rights Reserved.
import React from 'react';
import Button from '@mui/material/Button';

export const AddDocumentButton = ({ document, onClick, ...rest }) => {
    const handleAddNewDocument = () => {
        onClick(document);
    };

    return <Button onClick={handleAddNewDocument} {...rest}></Button>;
};
