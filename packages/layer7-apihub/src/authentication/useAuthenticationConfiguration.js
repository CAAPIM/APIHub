import { useEffect, useState } from 'react';
import { useApiHub } from '../ApiHubContext';

const DEFAULT_SIGNUP_ENABLED = false;
const DEFAULT_SIMPLE_CREDENTIALS_ENABLED = false;
const DEFAULT_SSO_ENABLED = false;
const DEFAULT_TERMS_OF_USE = `
By clicking "I Accept the Terms and Conditions" you, on behalf of your employer or contracted entity, agree that your use and access to the CA API Management SaaS Portal Application Programmable Interface ("PAPI") will be subject to and governed by this CA API Policy (the "Policy"). You must be authorized to use the CA API Management SaaS Portal by CA or an authorized CA Partner. If you do not, or cannot agree to the Policy, you must not use or access the PAPI. Your continued use of the PAPI constitutes acceptance of any changes to the Policy. Under the Policy, "CA", "we" or "us" means CA Inc., with offices located at 520 Madison Avenue, New York, NY 10022, and its subsidiaries and affiliates.

I. CA makes the PAPI available to provide programmatic access to CA's API Management SaaS Solution. CA reserves the right to discontinue, change, or version the PAPI at any time, in its sole discretion, and makes no guarantees or warranties that the software, scripts or programmatic routines will continue to operate following any changes. CA shall have no liability to you or any third party any downtime, changes or withdrawal of the PAPI. Where possible, we will take commercially reasonable efforts to provide you advanced notice of any changes. CA retains all rights in and to its intellectual property, including but not limited to, the PAPI, software, tools, data materials, information and derivatives or modifications thereof. CA reserves all rights not expressly granted in this Policy.

II. In order to access the PAPI you may be required to provide certain information, you agree that all information is current and accurate. You agree to inform CA of any changes. You may only access and use the PAPI in accordance with the technical documentation supplied by CA. CA may set limits and restrictions around acceptable use of the PAPI. You agree that you will not attempt to disable or circumvent these limitations.

III. You agree that you will not:
a) Sublicense the PAPI to any third party. You further agree that you will not create an API that functions in a substantially similar way to the PAPI and offer it for use to third parties.
b) Perform or take any actions that will introduce any viruses, worms, defects, Trojan horses, malware or have the effect of disabling, interfering, disrupting or impairing the CA product or services.
c) Except where prohibited by law, reverse engineer or decompile any source code through the PAPI or any related CA product or service.
d) Use the PAPI to process or store any sensitive, personal or confidential information.
e) Use the PAPI, directly or indirectly, to benchmark or create a product or service that is substantially similar to the CA API Management SaaS Portal.
f) Remove, alter or obscure any CA marks.
g) Do the following with the PAPI content:
a. Change, alter or misrepresent directly or indirectly the source or ownership in any way
b. Copy, translate, modify, create derivative works, publicly display or sublicense to any third party.
c. Perform any mechanism to keep permanent copies of content or keep content longer than permitted in the cache header.

IV. EXCEPT AS EXPRESSLY STATED HEREIN, CA DOES NOT MAKE ANY REPRESENTATIONS OR WARRANTIES ABOUT THE PAPI. SPECIFICALLY, ITS FUNCTIONALITY, RELIABILITY, AVAILABILITY OR ABILITY TO MEET YOUR SPECIFIC NEEDS OR REQUIREMENTS. THE PAPI IS PROVIDED ON AN "AS-IS" BASIS. EXCEPT WHERE PROHIBITED BY LAW, CA DISCLAIMS THE IMPLIED WARRANTY OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NON-INFRINGEMENT. CA, ITS SUPPLIERS, DISTRIBUTORS AND LICENSORS, WILL NOT BE RESPONSIBLE FOR LOST PROFITS, REVENUES OR DATA; OR INDIRECT, SPECIAL, CONSEQUENTIAL, EXEMPLARY OR PUNITIVE DAMAGES, EVEN IF ADVISED IN ADVANCE OF THE POSSIBLE OF SUCH DAMAGES. TO THE EXTENT PERMITTED BY LAW, THE TOTAL LIABILITY OF CA, ITS SUPPLIERS AND DISTRIBUTORS, FOR ANY CLAIM ARISING FROM OR RELATED TO THE POLICY IS LIMITED TO 100.00 USD.

V. You may discontinue using the PAPI at any time. In the event of termination or expiration by you or CA, Sections III, IV and VI will survive.

VI. The governing law and venue for any disputes or claims arising out of or related to the PAPI will be governed by the terms of your agreement with CA for use of the CA API Management SaaS Portal.`;

export const fetchAuthenticationConfiguration = async url => {
    const response = await fetch(`${url}/admin/cmsSettings`);

    if (response.status < 200 || response.status >= 300) {
        throw new Error(response.statusText);
    }

    const json = await response.json();

    return {
        signUpEnabled: json.REGISTRATION_REQUEST_WORKFLOW === 'ENABLED',
        simpleCredentialsEnabled: json.REGISTRATION_STATUS === 'ENABLED',
        ssoEnabled: json.SSO_ENABLED === 'true',
        termsOfUse: json.REGISTRATION_TERMS_OF_USE || '',
    };
};

export const useAuthenticationConfiguration = (
    signUpEnabled = DEFAULT_SIGNUP_ENABLED,
    simpleCredentialsEnabled = DEFAULT_SIMPLE_CREDENTIALS_ENABLED,
    ssoEnabled = DEFAULT_SSO_ENABLED,
    termsOfUse = DEFAULT_TERMS_OF_USE
) => {
    const { url } = useApiHub();

    const [configuration, setConfiguration] = useState({
        signUpEnabled,
        simpleCredentialsEnabled,
        ssoEnabled,
        termsOfUse,
    });

    useEffect(() => {
        fetchAuthenticationConfiguration(url).then(setConfiguration);
    }, [url]);

    return configuration;
};
