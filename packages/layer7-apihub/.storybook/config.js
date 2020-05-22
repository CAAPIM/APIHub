import React from 'react';
import { addDecorator } from '@storybook/react';
import { ThemeProvider } from '@material-ui/styles';
import { createMuiTheme } from '@material-ui/core/styles';

import { theme } from '../src/theme';

addDecorator(storyFn => <ThemeProvider theme={createMuiTheme(theme)}>{storyFn()}</ThemeProvider>);