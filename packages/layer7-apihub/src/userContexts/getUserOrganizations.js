import get from 'lodash/get';

/**
 * Get the organizations details from the user context.
 *
 * @param {object} userContext The user context
 */
export const getUserOrganizations = userContext => {
    const activeOrgUuid = get(userContext, 'activeOrgUuid', null);
    const organizations = get(userContext, 'accessibleOrgs', {});

    const orgsUuids = Object.values(organizations);

    const accessibleOrgs = Object.keys(organizations).reduce(
        (listAccessibleOrgs, organizationName, index) => {
            const org = {
                uuid: orgsUuids[index],
                name: organizationName,
            };
            listAccessibleOrgs.push(org);
            return listAccessibleOrgs;
        },
        []
    );

    const activeOrg = accessibleOrgs.find(org => org.uuid === activeOrgUuid);
    const hasAccessibleOrgs = accessibleOrgs.length > 0;

    return { hasAccessibleOrgs, accessibleOrgs, activeOrg };
};
