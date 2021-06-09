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
            fields: {
                username: 'Username',
                password: 'Password',
            },
            actions: {
                sign_in: 'Sign in',
                sign_in_with: 'Sign in with',
                sign_up_title: 'New to API Hub?',
                sign_up: 'Create an API Hub Account',
                forgot_password: 'Forgot password?',
            },
            notifications: {
                invalid_credentials: 'Invalid credentials',
                selected_scheme: 'Signing in with',
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
                accessStatus: 'Visibility',
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
                keySecret: 'Shared Secret:',
                apiKeyClientID: 'API Key / Client ID',
                apisIncluded: 'APIs Included',
                authentication: 'Authentication',
                description: 'Description',
                encrypted: 'Encrypted',
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
                noCustomFields: 'No available custom fields',
                noApplications: 'No available applications',
                apiManagement: 'API Management',
                authCredentials: 'Authentication and Credentials',
                callbackUrl: 'Callback/Redirect URL(s)',
                scope: 'Scope',
                type: 'Type',
                none: 'None',
                public: 'Public',
                confidential: 'Confidential',
                sharedSecretFormat: 'Shared Secret Format',
                selectOrganization: 'Select organization',
                apiPlan: 'API Plan',
                quota: 'Quota',
                rateLimit: 'Rate Limit',
                termsOfUseApi:
                    'By clicking Add API, I accept Terms and Conditions',
                actions: 'Actions',
                default: 'Default',
            },
            actions: {
                generateSecret: 'Generate New Secret',
                copyNewSecret: 'Copy New Secret',
                plainTextSecret: 'Plain text secret',
                hashedSecret: 'Hashed secret',
                cancel: 'Cancel',
                save: 'Save',
                addApplication: 'Add Application',
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
            },
            validation: {
                error_application_name_not_unique:
                    'This application name is not unique',
                callback_url_caption: 'Use comma separated values',
                scope_caption: 'Use space separated values',
                application_name_caption: 'Use unique name 50 characters (max)',
            },
            status: {
                enabled: 'Enabled',
                disabled: 'Disabled',
                deprecated: 'Deprecated',
                unpublished: 'Unpublished',
                rejected: 'Rejected',
                application_pending_approval: 'Pending Approval',
                edit_application_pending_approval: 'Pending Approval',
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
                secret_generated_heading: 'New Secret Generated',
                secret_generated_heading_error:
                    'An error occurred while generating the secret',
                secret_generated_message:
                    'Text secret will only be visible during the current browser session and will be hashed after the page has been refreshed.',
                copy_secret_now: 'Copy the shared secret now',
                copy_to_clipboard: 'Copy to Clipboard',
                edit_overview: 'Edit overview',
                empty_overview: 'No value',
                create_success: 'Application successfully created.',
                create_error:
                    'An error occurred while creating the application.',
                edit_success: 'Application successfully updated.',
                edit_error: 'An error occurred while updating the application.',
                delete_success: 'Application successfully deleted.',
                delete_error:
                    'An error occurred while deleting the application.',
            },
            confirm_delete:
                'You are about to delete this application. Are you sure?',
            deleting_content:
                'Undeploying keys and deleting application. This may take several minutes.',
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
    },
};

export default mergeTranslations(raMessages, apiHubMessages);
