import { isPublisher } from './isPublisher';

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
