import { getUserOrganizations } from './getUserOrganizations';

describe('getUserOrganizations', () => {
    test('should convert the organizations from the user context to a more readable version', () => {
        const userContext = {
            activeOrgUuid: 'covfefe-fr51',
            accessibleOrgs: {
                'Portal Covfefe': 'covfefe-fr51',
                Chell: 'GLaDOS-17',
            },
        };

        const result = getUserOrganizations(userContext);

        expect(result).toEqual({
            hasAccessibleOrgs: true,
            accessibleOrgs: [
                {
                    uuid: 'covfefe-fr51',
                    name: 'Portal Covfefe',
                },
                {
                    uuid: 'GLaDOS-17',
                    name: 'Chell',
                },
            ],
            activeOrg: {
                uuid: 'covfefe-fr51',
                name: 'Portal Covfefe',
            },
        });
    });

    test('should manage the case when there is no accessible organizations', () => {
        const userContext = {
            activeOrgUuid: '',
            accessibleOrgs: {},
        };

        const result = getUserOrganizations(userContext);

        expect(result).toEqual({
            hasAccessibleOrgs: false,
            accessibleOrgs: [],
            activeOrg: undefined,
        });
    });
});
