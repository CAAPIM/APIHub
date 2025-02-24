// Copyright © 2024 Broadcom Inc. and its subsidiaries. All Rights Reserved.
import { mergeTranslations } from 'react-admin';
import raMessages from 'ra-language-english';

const apiHubMessages = {
    ra: {
        ...raMessages,
        page: {
            dashboard: 'Home',
        },
        action: {
            add_filter: 'Add Filter',
            show: 'Show',
            edit: 'Edit',
            bulk_actions: '1 item selected |||| %{smart_count} items selected',
            loading: 'Loading...',
        },
        actions: {
            ...raMessages.actions,
            open_sidebar: 'Open the menu',
            close_sidebar: 'Close the menu',
        },
        navigation: {
            ...raMessages.navigation,
            page_rows_per_page: 'Items per page:',
            next: 'Next',
            prev: 'Prev',
        },
        auth: {
            logout: 'Logout',
        },
    },
    apihub: {
        login: {
            title: 'Sign In To API Hub',
            multiple_sessions_title: 'Multiple sessions detected',
            multiple_sessions_text:
                'An active session already exists for this account. Proceeding will terminate all other sessions for this account.',
            fields: {
                username: 'Username',
                password: 'Password',
            },
            actions: {
                multi_session_sign_in: 'PROCEED',
                multi_session_sign_in_additional_text:
                    'OTHER SESSIONS WILL TERMINATE',
                sign_in: 'Sign in',
                sign_in_with: 'Sign in with',
                sign_up_title: 'New to API Hub?',
                sign_up: 'Create an API Hub Account',
                forgot_password: 'Forgot password?',
            },
            notifications: {
                invalid_credentials:
                    'Invalid credentials. Please try again or use the forgot password link below',
                multi_session_invalid_credentials:
                    'Invalid credentials. Please try again',
                selected_scheme: 'Signing in with',
                local_logins_disabled:
                    'Direct login is disabled. You can choose an authentication method from the list below. Contact your administrator for more information.',
            },
        },
        account_setup: {
            title: 'Complete And Activate Account',
            fields: {
                firstname: 'First Name',
                lastname: 'Last Name',
                email: 'Email',
                username: 'Username',
                password: 'Password',
                confirm_password: 'Confirm Password',
            },
            actions: {
                submit: 'Activate Your Account',
                open_login_page: 'Go to Sign In',
            },
            validation: {
                error_password_match: 'The passwords do not match',
                error_username_not_unique: 'This username is not unique',
                tooltip_username: 'Minimum 6 characters\nMaximum 60 characters',
                tooltip_password:
                    'Password requirements:\n- Minimum 8 characters\n- Maximum 60 characters\n- At least one lowercase character\n- At least one uppercase character\n- At least one number\n- At least one special character: !@#$%^&*',
                tooltip_password_confirm: 'Repeat your password',
            },
            notifications: {
                prepare: 'Preparing form...',
                invalid_request: 'Your account cannot be set up.',
                success: 'Your account has been successfully set up.',
            },
            terms_of_use: {
                terms_of_use_acknowledgement: 'I have read and accept the ',
                terms_of_use: 'Terms of Use',
                terms_of_use_validation: 'Accept our terms and conditions',
                terms_of_use_dialog: {
                    title: 'Terms of Use',
                    close: 'Close',
                },
            },
        },
        reset_password: {
            title: 'Reset Password',
            fields: {
                username: 'Username',
            },
            actions: {
                submit: 'Submit',
            },
            form_details: {
                instructions: 'Enter your username',
                description: 'We will email a link to reset your password.',
            },
            notifications: {
                local_logins_disabled:
                    'Password cannot be reset if local logins are disabled',
            },
        },
        reset_password_confirm: {
            title: 'Reset Password Request Sent',
            actions: {
                open_login_page: 'Go to Sign In',
            },
            form_details: {
                instructions: 'Check your email.',
                description:
                    'Click the link in your email to reset your password.',
            },
        },
        new_password: {
            title: 'Create New Password',
            fields: {
                current_password: 'Current Password',
                password: 'Password',
                confirm_password: 'Confirm Password',
            },
            actions: {
                change_password: 'Change password',
                open_login_page: 'Go to Sign In',
            },
            validation: {
                error_password_match: 'The passwords do not match',
                tooltip_password:
                    'Password requirements:\n- Minimum 8 characters\n- Maximum 60 characters\n- At least one lowercase character\n- At least one uppercase character\n- At least one number\n- At least one special character: !@#$%^&*',
                tooltip_password_confirm: 'Repeat your password',
            },
            notifications: {
                confirmation:
                    'Your password has been reset. Use your new password to log in.',
                verifying_token: 'Verifying your password reset request...',
                invalid_token:
                    'Cannot create a new password: your token is invalid.',
            },
        },
        menu: {
            user_details: {
                full_name: '%{last_name} %{first_name}',
            },
        },
        homepage: {
            placeholder_empty_content:
                'The Home page content has not been provided yet. Portal Admins can click Create to add content.',
        },
        actions: {
            view_as_cards: 'Display as cards',
            view_as_list: 'Display as list',
            tree_drop_before: 'Before %{title}',
            tree_drop_after: 'After %{title}',
            select_an_api_plan: 'Select an API Plan (Required)',
        },
        validation: {
            password: {
                at_least_one_lowercase_character:
                    'At least one lowercase character',
                at_least_one_uppercase_character:
                    'At least one uppercase character',
                at_least_one_number: 'At least one number',
                at_least_one_special_character:
                    'At least one special character: !@#$%^&*',
                no_other_characters_accepted:
                    'Only alpha numeric and !@#$%^&*- allowed',
            },
        },
        markdown_editor: {
            fonts: {
                bold: 'Bold',
                italic: 'Italic',
                strikethrough: 'Strikethrough',
                unordered: 'Unordered List',
                order: 'Ordered List',
                quote: 'Quote',
                hr: 'Line Break',
                inlinecode: 'Inline Code',
                code: 'Block Code',
            },
        },
        terms_and_conditions: {
            api_label:
                'By clicking Select API, I accept the Terms and Conditions',
            api_group_label:
                'By clicking Select API Group, I accept the Terms and Conditions',
        },
    },
    resources: {
        apis: {
            name: 'API |||| APIs',
            fields: {
                name: 'Name',
                portalStatus: 'State',
                accessStatus: 'Access',
                apiServiceType: 'Type',
                ssgServiceType: 'Type',
                createTs: 'Created',
                modifyTs: 'Modified',
                version: 'Version',
                versionShort: 'V',
                description: 'Description',
                privateDescription: 'Private Description',
                tags: 'Tags',
                applicationUsage: 'Applications',
                assets: 'Assets',
                apiLocation: 'API Location',
                apiGroup: 'API Group',
            },
            portalStatus: {
                enabled: 'Enabled',
                disabled: 'Disabled',
                deprecated: 'Deprecated',
                unpublished: 'Unpublished',
                incomplete: 'Incomplete',
                new: 'Unpublished',
            },
            accessStatus: {
                public: 'Public',
                private: 'Private',
            },
            last_update: {
                fields: {
                    updated: 'Modified %{date}',
                },
            },
            list: {
                cards: {
                    fields: {
                        updated: 'Modified %{date}',
                        version: 'v%{version}',
                        applications: '%{smart_count} app(s)',
                        applications_long:
                            '1 application using this API |||| %{smart_count} applications using this API',
                        averageLatency: '%{ms} ms',
                        averageLatency_long: 'Average latency past 7 days',
                    },
                },
                sort: {
                    name: {
                        asc: 'API name: A-Z',
                        desc: 'API name: Z-A',
                    },
                    createTs: {
                        asc: 'Date created: old to new',
                        desc: 'Date created: new to old',
                    },
                    modifyTs: {
                        asc: 'Date modified: old to new',
                        desc: 'Date modified: new to old',
                    },
                },
                filters: {
                    search: 'Search by name or description',
                },
            },
            overview: {
                title: 'Overview',
                fields: {
                    version: 'v%{version}',
                },
                actions: {
                    download_assets: 'Download Assets',
                },
                notifications: {
                    no_assets: 'No assets associated with this API.',
                },
            },
            specification: {
                title: 'Specs',
                fields: {
                    select_application_label: 'Apps being used',
                },
                actions: {
                    select_application:
                        'Select application to use its default key.',
                    search_or_select_application:
                        'Search or Select Application',
                    select_api_key: 'Select API Key',
                },
            },
            documentation: {
                title: 'Documentation',
            },
        },
        apiGroups: {
            name: 'API Group |||| API Groups',
            short_name: 'Group |||| Groups',
            fields: {
                name: 'Name',
            },
        },
        apiPlans: {
            name: 'API Plan |||| API Plans',
            fields: {
                name: 'Name',
                description: 'Description',
                rate_limit: 'Rate Limit',
                quota: 'Quota',
                quota_interval: 'Quota Interval',
                second: 'second',
                day: 'day',
                month: 'month',
            },
        },
        applications: {
            name: 'Application |||| Applications',
            fields: {
                name: 'Name',
                apiKey: 'API Key:',
                apiKeyName: 'API Key',
                keySecret: 'Shared Secret:',
                apiKeyClientID: 'API Key / Client ID',
                apisIncluded: 'APIs Included',
                apis: 'APIs',
                authentication: 'Authentication',
                authMethod: 'Auth Method',
                authprovider: 'Auth Provider',
                description: 'Description',
                day: 'day',
                days: 'days',
                encrypted: 'Encrypted',
                expiryDate: 'Expiry Date',
                sharedSecretClientSecret: 'Shared Secret / Client Secret',
                oauthType: 'OAuth Type',
                oauthCallbackUrl: 'OAuth Callback URL',
                oauthScope: 'OAuth Scope',
                overview: 'Overview',
                status: 'State',
                apiGroups: 'API Groups',
                apiGroup: 'API Group',
                organization: 'Organization',
                applicationInformation: 'Application Information',
                customField: 'Custom Fields',
                details: 'Details',
                noCustomFields: 'No available custom fields',
                noApplications: 'No available applications',
                apiManagement: 'API Management',
                authCredentials: 'Authentication & Credentials',
                callbackUrl: 'Callback/Redirect URL(s)',
                scope: 'Scope',
                type: 'Type',
                secretType: 'Secret Type',
                none: 'None',
                public: 'Public',
                confidential: 'Confidential',
                hashed: 'Hashed',
                plain: 'Plain Text',
                sharedSecretFormat: 'Shared Secret Format',
                selectOrganization: 'Select organization',
                apiPlan: 'API Plan',
                quota: 'Quota',
                rateLimit: 'Rate Limit',
                termsOfUseApi:
                    'By clicking Add API, I accept Terms and Conditions',
                actions: 'Actions',
                default: 'Default',
                apisCount: 'APIs: %{count}',
                apiGroupsCount: 'API Groups: %{count}',
                certificateName: 'Name',
                certificate: 'Certificate',
                shaThumbPrint: 'SHA-256 Thumbprint',
                subjectDomain: 'Subject Domain',
                notValidAfter: 'Not valid after (%{zone})',
                certificates: 'Certificates',
                authMethodCertificate: 'Client Certificate',
                authMethodNone: 'None',
                authMethodSecret: 'Client ID & Secret',
                notAvailableAuthMethod: 'Not Available',
                deferredClientId: 'Client ID will be available after registration.',
                clientMetadata: 'Client Metadata',
                clientDefinitionName: 'Client Definition Name',
                clientDefinitionDescription: 'Description',
            },
            actions: {
                generateSecret: 'Generate New Secret',
                copyNewSecret: 'Copy New Secret',
                plainTextSecret: 'Plain text secret',
                hashedSecret: 'Hashed secret',
                cancel: 'Cancel',
                publish: 'Publish',
                save: 'Save',
                addApplication: 'Add Application',
                addCertificate: 'Add Certificate',
                createApplication: 'Create Application',
                deleteApplication: 'Delete Application',
                deleting_title: 'Deleting Application',
                select_api: 'Select API',
                addApi: 'Add API',
                addApiGroup: 'Add API Group',
                searchByApiTitle: 'Search',
                filterByTag: 'Filter by tag',
                accept_terms_and_conditions: 'I Accept the Terms & Conditions',
                edit: 'Edit',
                delete: 'Delete',
                force_delete: 'Force Delete',
                no: 'No',
                yes: 'Yes',
                submitForApproval: 'Submit for approval',
                uploadCertificate: 'Upload Certificate',
                confirm: 'Confirm',
                submitDelete: 'Submit Delete',
            },
            validation: {
                error_application_name_not_unique:
                    'This application name is not unique',
                callback_url_caption: 'Use comma separated values',
                scope_caption: 'Use space separated values',
                application_name_caption: 'Use unique name 50 characters (max)',
                apikey_caption:
                    'The key must be unique. Maximum length is 255 characters.',
                apikey_name_caption:
                    'The key name must be unique to this application. Maximum length is 255 characters.',
                apikey_name_empty_error: 'Name cannot be empty',
                certificate_name_caption: 'Must be unique per application.',
                certificate_file_input_caption:
                    'All application keys certificates will redeploy.',
                clientDefintion_json: 'Valid json required, 5000 maximum.',
            },
            status: {
                enabled: 'Enabled',
                disabled: 'Disabled',
                deprecated: 'Deprecated',
                expired: 'Expired',
                delete_failed: 'Delete Failed',
                pending_registration: 'Pending Registration',
                incomplete: 'Incomplete',
                unpublished: 'Unpublished',
                rejected: 'Rejected',
                application_pending_approval: 'Pending Approval',
                edit_application_pending_approval: 'Pending Approval',
                delete_application_pending_approval: 'Pending Approval',
                apis_help_text:
                    'At least 1 API (or API Group) is required to publish an application.',
                create_apis_help_text:
                    'Save required before APIs can be added. At least 1 API (or API Group) is required to publish an application.',
                api_keys_help_text:
                    'At least 1 API Key is required to publish an application.',
                add_certificates_help_text:
                    'Save required before certificates can be added.',
                create_api_keys_help_text:
                    'Save required before keys can be created. At least 1 API Key is required to publish an application.',
                partial_lock:
                    'Part(s) of this section are locked pending the approval of a previous edit.',
                complete_lock:
                    'This section is locked pending the approval of a previous edit.',
                certificate_submission:
                    'The certificate will be submitted as a request and will be available upon approval.',
            },
            list: {
                sort: {
                    name: {
                        asc: 'Application Name: A-Z',
                        desc: 'Application Name: Z-A',
                    },
                },
            },
            notifications: {
                configuration: 'Configuration',
                copy_success: 'Copied to Clipboard successfully',
                copy_error: 'Copy to Clipboard failed',
                generate_secret_warning_1:
                    'Generating a new secret changes the API key and voids the current API key.',
                generate_secret_warning_2:
                    'This breaks access for anyone using the current API key. Share and use the newly generated secret with developers coding their application that uses the APIs.',
                hashed_secret_generated_message:
                    'Copy this shared secret. It will not be shown again.',
                secret_generated_heading: 'New Secret Generated',
                secret_generated_heading_error:
                    'An error occurred while generating the secret',
                secret_generated_message:
                    'Text secret will only be visible during the current browser session and will be hashed after the page has been refreshed.',
                oauth_client_secret_generated_message:
                    'Secret will only be visible during the current browser session.',
                copy_secret_now: 'Copy the shared secret now',
                copy_to_clipboard: 'Copy to Clipboard',
                edit_overview: 'Edit overview',
                empty_overview: 'No value',
                create_success: 'Application successfully created.',
                key_create_request_success: 'API Key create request submitted.',
                oauth_client_create_request_success: 'OAuth Client create request submitted.',
                key_create_success: 'API Key created successfully.',
                oauth_client_create_success: 'OAuth Client created successfully.',
                create_error:
                    'An error occurred while creating the application.',
                edit_request_success: 'Application update request submitted.',
                edit_success: 'Application successfully updated.',
                edit_error: 'An error occurred while updating the application.',
                delete_success: 'Application successfully deleted.',
                delete_key_success: 'Application key successfully deleted.',
                delete_request_success:
                    'Application delete requested successfully.',
                delete_error:
                    'An error occurred while deleting the application.',
                publish_request_success:
                    'Application publish request submitted.',
                publish_success: 'Application successfully published.',
                unsaved_changes: 'Unsaved Changes',
                unsaved_changes_content:
                    'This section contains unsaved changes. Do you wish to leave this section without saving the changes?',
                certificate_upload_request_success:
                    'Upload Certificate Request submitted successfully.',
                certificate_upload_request_failure:
                    'Upload Certificate Request failed.',
                certificate_upload_success:
                    'Successfully uploaded Certificate.',
                certificate_upload_failure: 'Failed to upload certificate.',
                certificate_delete_failure: 'Failed to delete certificate.',
                certificate_delete_success: 'Successfully Deleted Certificate.',
                certificate_delete_request_failure:
                    'Delete Certificate request failed.',
                certificate_delete_request_success:
                    'Delete Certificate request submitted successfully.',
            },
            confirm_delete:
                'You are about to delete this application. Are you sure?',
            deleting_content:
                'Undeploying keys and deleting application. This may take several minutes.',
            proxy_check_alert:
                'Unable to connect to all key stores where the application has deployed keys. This will likely result with an incomplete deletion, where some keys will remain on some key stores. They will have to be removed from the key store directly. There will be an option to force delete the application record from portal.',
            publish_help_text:
                'A complete appllication with at least 1 API and 1 Key can be published and its key(s) deployed to proxies.',
        },
        apikeys: {
            confirm_delete:
                'You are about to delete this API-Key. Are you sure?',
            confirm_delete_oauth_client:
                'You are about to delete this OAuth-Client. Are you sure?',
            deleting_content:
                'Undeploying keys and deleting API-Key. This may take several minutes.',
            deleting_content_oauth_client:
                'Undeploying and deleting OAuth client. This may take several minutes.',
            proxy_check_alert:
                'Unable to connect to all key stores where the API-Key has been deployed. This will likely result with an incomplete deletion, where this key will remain on some key stores. It will have to be removed from the key store directly. There will be an option to force delete the API-Key record from portal.',
            proxy_check_alert_oauth_client:
                'Unable to connect to all key stores where the OAuth-Client has been deployed. This will likely result with an incomplete deletion, where this oauth-client will remain on some key stores. It will have to be removed from the key store directly. There will be an option to force delete the OAuth-Client record from portal.',
            replace_client_metadata_title: 'Modified Client Metadata',
            replace_client_metadata_content: 'Your changes to the client metadata will be lost with this action. Are you sure you want to continue?',
            client_metadata_accordion_title: 'Client Metadata',
            reg_pending_title: 'Registration Pending',
            reg_pending_wf_content: 'OAuth client will be in Pending Registration state, once OAuth Client Request is approved. It can be submitted to auth provider for creation.',
            reg_pending_incomplete_content: 'OAuth client is in Pending Registration state. It can be submitted to auth provider for creation, once the Application is published.',
            actions: {
                addKey: 'Add Key',
                complete_registration: 'Register Key',
                deleteApiKey: 'Delete Key',
                deleteOAuthClient: 'Delete OAuth Client',
                deleting_title: 'Deleting API-Key',
                deleting_title_oauth_client: 'Deleting OAuth-Client',
                force_delete: 'Force Delete',
                reload_client_definition: "Reload Metadata",
                replace_client_metadata_dialog_submit: 'Replace Client Metadata',
                cancel: 'Cancel',
                delete: 'Delete',
                close: 'Close',
            },
        },
        documents: {
            name: 'Wiki |||| Wiki',
            fields: {
                title: 'Title',
                navtitle: 'URI',
                markdown: 'Content',
                modifyTs: 'Last Modified',
                ordinal: 'Position',
                new_document: 'New document',
                select_documentation_locale: 'Selected language',
            },
            actions: {
                // Toolbar
                new_document_button: 'New root document',
                new_child_document_button: 'New child',
                edit_document_button: 'Edit',
                delete_document_button: 'Delete',
                change_document_parent_button: 'Change parent',
                // Tree
                expand_documentation: 'Expand documentation of node {title}',
                collapse_documentation:
                    'Collapse documentation of node {title}',
                // Drag & Drop
                move_as_first_child: 'First document',
                move_after_document: 'After %{title}',
                move_as_root_item: 'Select to move to root',
                // Form
                save: 'Publish',
                cancel: 'Cancel',
            },
            validation: {
                error_no_special_characters:
                    'The URI must contain only uncoded characters. Supports letters from a to z, and the separators - and _.',
                error_navtitle_not_unique: 'This URI already exists.',
            },
            notifications: {
                tree_updated_success: 'Documentation tree updated successfully',
                tree_updated_error: 'Documentation tree update has failed',
                create_success: 'Document successfully created.',
                create_error: 'An error occurred while creating the document.',
                edit_success: 'Document successfully updated.',
                edit_error: 'An error occurred while updating the document.',
                delete_success: 'Document successfully deleted.',
                delete_error: 'An error occurred while deleting the document.',
                unsaved_changes:
                    'If you leave this page, your changes will be lost. Do you want to cancel editing this document?',
            },
            confirm_delete_document_without_children:
                'You are about to delete this document. Are you sure?',
            confirm_delete_document_with_children:
                'You are about to delete this document and its child documents. Are you sure?',
        },
        registrations: {
            title: 'Create a New Account',
            fields: {
                email: 'Email',
                email_confirmation: 'Confirm Email',
                organization: 'Organization or Workspace',
                organization_description: 'Organization Description',
                robot: "I'm not a robot",
            },
            actions: {
                submit: 'Submit',
                login: 'Sign In To An Existing Account',
                return_to_homepage: 'Return to homepage',
            },
            notifications: {
                confirmation_required: 'Confirmation required',
                error: 'There was a problem registering your account.',
                confirmation_title: 'Check Your Email',
                confirmation:
                    'Registration received. A notification email will be sent to the address provided.',
                email_confirmation_error: 'Email does not match.',
                form_confirmation_error: 'Confirmation required.',
                limituserregistration:
                    'Registration request for this email is pending approval/activation. Multiple requests are not allowed.',
            },
            slider: {
                confirmed: 'Confirmed',
                unconfirmed: 'Slide to Confirm',
            },
        },
        userContexts: {
            title: 'My Profile',
            fields: {
                userDetails: {
                    username: 'Username',
                    lastName: 'Last Name',
                    firstName: 'First Name',
                    email: 'Email',
                    password: 'Password',
                },
                currentPassword: 'Current Password',
                newPassword: 'Password',
                confirmNewPassword: 'Confirm Password',
            },
            actions: {
                edit_profile: 'My Profile',
                cancel: 'Cancel',
            },
            notifications: {
                profile_not_exist_error: 'This profile does not exist',
                update_success: 'Profile updated',
                update_error: 'The profile update has failed',
                invalid_password: 'The current password in invalid',
                confirm_password_change:
                    'Your password has been reset. Use your new password to log in.',
            },
            validation: {
                error_current_password_empty:
                    'Please enter your current password',
                error_password_match: 'The passwords do not match',
                tooltip_password:
                    'Password requirements:\n- Minimum 8 characters\n- Maximum 60 characters\n- At least one lowercase character\n- At least one uppercase character\n- At least one number\n- At least one special character: !@#$%^&*',
                tooltip_password_confirm: 'Repeat your password',
            },
            accessibleOrgs: {
                title: 'My Organization |||| My Organizations',
            },
            activeOrgUuid: {
                status: {
                    active: 'Selected organization',
                    not_active: 'Organization not selected',
                },
                notifications: {
                    update_success: 'Your organization updated successfully',
                    update_error: 'The organization update has failed',
                },
            },
        },
        userProfiles: {
            passwordDialogTitle: 'Enter Current Password',
            fields: {
                userName: 'Username',
                lastName: 'Last Name',
                firstName: 'First Name',
                email: 'Email',
                password: 'Password',
                currentPassword: 'Current Password',
                newPassword: 'New Password',
                confirmNewPassword: 'Confirm New Password',
            },
            actions: {
                edit_profile: 'My Profile',
                cancel: 'Cancel',
                submit: 'Submit',
            },
            notifications: {
                update_success: 'Profile updated',
            },
            validation: {
                error_password_empty: "Password can't be blank",
                error_password_match: 'The passwords do not match',
                error_password_not_matching_criteria:
                    'Password must meet the specified password requirements.',
                tooltip_current_password:
                    'Password required to make changes. Please enter your current password.',
                tooltip_password_title: 'Password requirements:',
                tooltip_password_min: '-Minimum %{num} characters',
                tooltip_password_max: '-Maximum %{num} characters',
                tooltip_password_lower:
                    '-At least %{num} lowercase character(s)',
                tooltip_password_upper:
                    '-At least %{num} uppercase character(s)',
                tooltip_password_number: '-At least %{num} number(s)',
                tooltip_password_special:
                    '-At least %{num} special character(s): %{symbols}',
                tooltip_password_confirm: 'Repeat your password',
            },
        },
    },
};

export default mergeTranslations(raMessages, apiHubMessages);
