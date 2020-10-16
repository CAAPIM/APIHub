import { apis as defaultApis } from 'layer7-apihub';
import { ApiList } from './ApiList';

export const apis = {
    ...defaultApis,
    list: ApiList,
};
