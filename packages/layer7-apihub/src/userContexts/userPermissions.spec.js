// Copyright © 2025 Broadcom Inc. and its subsidiaries. All Rights Reserved.
import { isPortalAdmin, isPublisher, isOrgBoundUser } from './userPermissions';

describe('userPermissions', () => {
    describe('isPortalAdmin', () => {
        test('should true if the user is a portal admin', () => {
            const userContext = {
                userDetails: {
                    portalAdmin: true,
                },
            };

            const result = isPortalAdmin(userContext);

            expect(result).toBe(true);
        });

        test('should false otherwise', () => {
            const userContext = {
                userDetails: {
                    portalAdmin: false,
                },
            };

            const result = isPortalAdmin(userContext);

            expect(result).toBe(false);
        });
    });

    describe('isPublisher', () => {
        test('should true if the user is a portal admin', () => {
            const userContext = {
                userDetails: {
                    portalAdmin: true,
                    apiOwner: false,
                    orgPublisher: false,
                },
            };

            const result = isPublisher(userContext);

            expect(result).toBe(true);
        });

        test('should true if the user is an api owner', () => {
            const userContext = {
                userDetails: {
                    portalAdmin: false,
                    apiOwner: true,
                    orgPublisher: false,
                },
            };

            const result = isPublisher(userContext);

            expect(result).toBe(true);
        });

        test('should true if the user is an org publisher', () => {
            const userContext = {
                userDetails: {
                    portalAdmin: false,
                    apiOwner: false,
                    orgPublisher: true,
                },
            };

            const result = isPublisher(userContext);

            expect(result).toBe(true);
        });

        test('should false otherwise', () => {
            const userContext = {
                userDetails: {
                    portalAdmin: false,
                    apiOwner: false,
                    orgPublisher: false,
                },
            };

            const result = isPublisher(userContext);

            expect(result).toBe(false);
        });
    });

    describe('isOrgBoundUser', () => {
        test('should true if the user is an org publisher', () => {
            const userContext = {
                userDetails: {
                    orgPublisher: true,
                    orgAdmin: false,
                    developer: false,
                },
            };

            const result = isOrgBoundUser(userContext);

            expect(result).toBe(true);
        });

        test('should true if the user is an org admin', () => {
            const userContext = {
                userDetails: {
                    orgPublisher: false,
                    orgAdmin: true,
                    developer: false,
                },
            };

            const result = isOrgBoundUser(userContext);

            expect(result).toBe(true);
        });

        test('should true if the user is a developer', () => {
            const userContext = {
                userDetails: {
                    orgPublisher: false,
                    orgAdmin: false,
                    developer: true,
                },
            };

            const result = isOrgBoundUser(userContext);

            expect(result).toBe(true);
        });

        test('should false otherwise', () => {
            const userContext = {
                userDetails: {
                    portalAdmin: false,
                    apiOwner: false,
                    orgPublisher: false,
                },
            };

            const result = isOrgBoundUser(userContext);

            expect(result).toBe(false);
        });
    });
});
