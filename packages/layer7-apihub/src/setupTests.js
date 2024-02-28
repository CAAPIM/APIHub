// mocking modules @uiw/react-markdown-editor and @uiw/react-markdown-preview
// as loading them is throwing an error 'Uncaught TypeError: _interopRequireDefault is not a function'.
// Couldn't find the cause behind that, so commented out test cases.
// We can try uncommenting tests when we upgrade to newer node version as that installs newer dependencies
jest.mock('@uiw/react-markdown-editor', () => {
    return jest.requireActual('@material-ui/core/Checkbox');
});

jest.mock('@uiw/react-markdown-preview', () => {
    return jest.requireActual('@material-ui/core/Checkbox');
});
