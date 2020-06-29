import { applications as defaultApplications } from 'layer7-apihub';

import { ApplicationShow } from './ApplicationShow';

export const applications = {
    ...defaultApplications,
    show: ApplicationShow,
};
