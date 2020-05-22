import {
    checkSpecialCharacters,
    checkUnicity,
    slugifyURI,
} from './DocumentCreateForm';

describe('DocumentCreateForm', () => {
    describe('checkSpecialCharacters', () => {
        test('should return a validate function', () => {
            const validate = checkSpecialCharacters();

            expect(validate).toBeInstanceOf(Function);
        });

        test('should return nothing if the value does not contain special characters', () => {
            const URI = 'Working-URI_';
            const validate = checkSpecialCharacters();

            expect(validate(URI)).toBeUndefined();
        });

        test('should return an error message if the value contains at least one special character', () => {
            const URI = 'NOT%Working-URI_';
            const validate = checkSpecialCharacters();

            expect(validate(URI)).toEqual(
                'resources.apis.documentation.validation.error_no_special_characters'
            );
        });
    });

    describe('checkUnicity', () => {
        test('should return a validate function', () => {
            const validate = checkUnicity();

            expect(validate).toBeInstanceOf(Function);
        });

        test('should return nothing if the value is unique', () => {
            const navtitles = ['a-value', 'another-value'];
            const value = 'my-unique-value';
            const validate = checkUnicity(navtitles);

            expect(validate(value)).toBeUndefined();
        });

        test('should return an error message if the value is not unique', () => {
            const navtitles = [
                'a-value',
                'another-value',
                'my-NOT-unique-value',
            ];
            const value = 'my-not-unique-value';
            const validate = checkUnicity(navtitles);

            expect(validate(value)).toEqual(
                'resources.apis.documentation.validation.error_navtitle_not_unique'
            );
        });
    });

    describe('slugifyURI', () => {
        test('should not change the text case', () => {
            const URI = 'My-URI';
            const expectedURI = 'My-URI';

            expect(slugifyURI(URI)).toEqual(expectedURI);
        });

        test('should keep underscores', () => {
            const URI = '_my_uri_';
            const expectedURI = '_my_uri_';

            expect(slugifyURI(URI)).toEqual(expectedURI);
        });

        test('should replace spaces', () => {
            const URI = 'my uri';
            const expectedURI = 'my-uri';

            expect(slugifyURI(URI)).toEqual(expectedURI);
        });

        test.each([
            'à',
            'é',
            '!',
            '@',
            '#',
            '$',
            '%',
            '^',
            '&',
            '*',
            '(',
            ')',
            '=',
            '+',
            '/',
            '.',
            ';',
            "'",
        ])('should replace %s by one underscore', specialChar => {
            const URI = `my-uri${specialChar}is-cool`;
            const expectedURI = 'my-uri_is-cool';

            expect(slugifyURI(URI)).toEqual(expectedURI);
        });
    });

    test('should replace all special characters', () => {
        const URI = 'my#uri&is#cool';
        const expectedURI = 'my_uri_is_cool';

        expect(slugifyURI(URI)).toEqual(expectedURI);
    });
});
