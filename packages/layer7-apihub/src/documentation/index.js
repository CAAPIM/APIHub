// Copyright © 2025 Broadcom Inc. and its subsidiaries. All Rights Reserved.
import React from 'react';
import { DocumentList } from './DocumentList';
import { IconApps } from '../ui/icons';

export const documents = {
    icon: <IconApps />,
    list: <DocumentList />,
};

export * from './DocumentList';
export * from './DocumentTitle';
export * from './Documentation';
export * from './useMarkdownContent';
