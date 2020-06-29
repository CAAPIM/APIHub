import { ApplicationList } from './ApplicationList';
import { ApplicationShow } from './ApplicationShow';
import { IconApps } from '../ui/icons';

export const applications = {
    icon: IconApps,
    list: ApplicationList,
    show: ApplicationShow,
};

export * from './ApplicationList';
export * from './ApplicationShow';
export * from './ApplicationCard';
export * from './ApplicationDetailsOverviewEditor';
export * from './ApplicationDetailsOverviewField';
export * from './ApplicationKeyClient';
export * from './ApplicationKeySecret';
export * from './ApplicationStatus';
export * from './isApplicationPending';
