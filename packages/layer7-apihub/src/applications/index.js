// Copyright © 2025 Broadcom Inc. and its subsidiaries. All Rights Reserved.
import { ApplicationList } from './ApplicationList';
import { ApplicationShow } from './ApplicationShow';
import { ApplicationCreate } from './ApplicationCreate';
import { ApplicationEdit } from './ApplicationEdit';
import { IconApps } from '../ui/icons';

export const applications = {
    icon: IconApps,
    list: ApplicationList,
    show: ApplicationShow,
    create: ApplicationCreate,
    edit: ApplicationEdit,
};
export * from './ApiSelector';
export * from './ApplicationList';
export * from './ApplicationShow';
export * from './ApplicationCard';
export * from './ApplicationDetailsOverviewEditor';
export * from './ApplicationDetailsOverviewField';
export * from './ApplicationKeyClient';
export * from './ApplicationKeySecret';
export * from './ApplicationStatus';
export * from './isApplicationPending';
export * from './ApplicationCreate';
export * from './ApplicationEdit';
