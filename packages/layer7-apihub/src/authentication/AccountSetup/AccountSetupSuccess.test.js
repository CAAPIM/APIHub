import React from 'react';
import { renderWithRedux } from 'ra-core';

import { AccountSetupSuccess } from './AccountSetupSuccess';

describe('AccountSetupSuccess', () => {
  it('renders a success notification', () => {
      const { getByText } = renderWithRedux(<AccountSetupSuccess />);

      expect(getByText('apihub.account_setup.notifications.success')).not.toBeNull();
  });
});
