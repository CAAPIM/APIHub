# Layer7 API Hub - Remote Hosting with NodeJs

**Prerequisite:**
- Create an SSL Ceritifcate and place it in the sslcert folder
`eg. openssl x509 -req -sha256 -days 365 -in server.csr -signkey server.key -out server.crt`
- add `local.portal.ca.com` to `/etc/hosts` file

**Steps:**
- unzip the required apihub jar in the `apihub-jar` folder
- update the config.js for the above
- `npm install`
- `npm start`
- access the env. using `https://local.portal.ca.com`