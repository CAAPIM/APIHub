import { textToHtml } from './HtmlTooltip';

describe('HtmlTooltip', () => {
    describe('textToHtml', () => {
        test('should replace \n by <br />', () => {
            const expectedResult = 'hello<br />how are you?';
            const result = textToHtml('hello\nhow are you?');

            expect(result).toEqual(expectedResult);
        });

        test('should replace all \n by <br />', () => {
            const expectedResult =
                'hello<br />how are you?<br />fine<br />and you?';
            const result = textToHtml('hello\nhow are you?\nfine\nand you?');

            expect(result).toEqual(expectedResult);
        });

        test('should replace all interpolate strings by <br />', () => {
            const expectedResult =
                'hello<br />how are you?<br />fine<br />and you?';
            const result = textToHtml(`hello
how are you?
fine
and you?`);

            expect(result).toEqual(expectedResult);
        });
    });
});
