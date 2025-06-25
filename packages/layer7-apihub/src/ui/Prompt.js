// Copyright © 2025 Broadcom Inc. and its subsidiaries. All Rights Reserved.
import React from 'react';
import { useBlocker } from 'react-router-dom';

export const Prompt = ({ when, message }) => {
    useBlocker(() => {
        if (when) {
            return !window.confirm(message);
        }
        return false;
    }, [when]);

    return <div key={when} />;
};
