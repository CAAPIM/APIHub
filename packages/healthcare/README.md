# Healthcare App [Deprecated]

> **_Note:_** The Healthcare app is now deprecated. It will no longer be actively maintained and will not receive new features or updates, including bug fixes. This deprecation is part of our ongoing efforts to improve the repository and streamline functionality.

The Healthcare app demonstrates a customization of [the Layer7 API Hub Library](../layer7-apihub/README.md). This app uses [the Layer7 API Hub mock server](../layer7-apihub-mock) as the backend server.

The Healthcare app is built on top of [Create React App (CRA)](https://create-react-app.dev/).

## Available User Roles

The following user roles are available in this app:

- Portal Admin

  - login: `portalAdmin`
  - password: `Password@1`
- API Owner

  - login: `apiOwner`
  - password: `Password@1`
  - Org Publisher
  - login: `orgPublisher`
  - password: `Password@1`
- Org Admin

  - login: `Publisher`
  - password: `Password@1`
- Developer

  - login: `user`
  - password: `Password@1`

## Customize the Healthcare App

The Healthcare App leverages the customization mechanisms provided by its underlying libraries:

- [MaterialUI](https://material-ui.com/customization/theming/)
- [react-admin](https://marmelab.com/react-admin/Theming.html)
- [Layer7 API Hub](../layer7-apihub/README.md)

Each library builds on top of the previous.

### Theming

The theming process is comprised of customizing the design tokens (colors, fonts, spacing, etc.) and customizing the components styles.

The custom [theme file](../src/theme.js) applies the changes. For the design tokens, you customize the color palette and the typography. For the components styles, you leverage the [global theme override mechanism](https://material-ui.com/customization/components/#global-theme-override).

The global theme references specific components by its style name (such as `MuiButton` for MaterialUI buttons) and override parts of its styles. You can override most of the components provided by the underlying libraries. The libraries use a convention for their style names:

- `Mui[ComponentName]` for MaterialUI components
- `Ra[ComponentName]` for react-admin components
- `Layer7[ComponentName]` for Layer7 API Hub components

### Default Components Replacements

The Healthcare app includes redesigned default API Hub pages. Customizing the theme has limited options. To implement a completely different layout, provide your own components. In the Healthcare app, a custom [Application Details View](./src/applications/CustomApplicationShow) is provided as an example.

The following authentication-related pages also differ in the Healthcare app from the default API Hub pages:

- [Login](./src/authentication/CustomLoginPage.js)
- [Reset Password](./src/authentication/CustomResetPasswordPage.js)
- [New Password](./src/authentication/CustomNewPasswordPage.js)
- [Sign Up](./src/authentication/CustomSignUpPage.js)
- [Account Setup](./src/authentication/CustomAccountSetupPage.js)

### Custom Pages

The Healthcare app implements a [landing page](./src/LandingPage/index.js) and a [dashboard](./src/homepage/HomePage.js) by leveraging react-admin's [custom routes mechanism](https://marmelab.com/react-admin/Admin.html#customroutes). React-admin shows the [dashboard](https://marmelab.com/react-admin/Admin.html#dashboard) by handling the root path. The landing page is displayed, which redirects authenticated users to the dashboard. This dashboard is added back as another custom route on the `/dashboard` path.
