// Copyright © 2025 Broadcom Inc. and its subsidiaries. All Rights Reserved.
import { mergeTranslations } from 'react-admin';
import raMessages from 'ra-language-english';

const apiHubMessages = {
    ra: {
        ...raMessages,
        page: {
            dashboard: 'Accueil',
        },
        action: {
            add_filter: 'Ajouter un filtre',
            show: 'Spectacle',
            edit: 'Éditer',
            bulk_actions:
                '1 élément sélectionné |||| %{smart_count} articles sélectionnés',
            loading: 'Chargement...',
        },
        actions: {
            ...raMessages.actions,
            open_sidebar: 'Ouvrir le menu',
            close_sidebar: 'Fermer le menu',
        },
        navigation: {
            ...raMessages.navigation,
            page_rows_per_page: 'Eléments par page :',
            next: 'Proc',
            previous: 'Préc',
        },
        auth: {
            logout: 'Se déconnecter',
        },
    },
    apihub: {
        login: {
            title: 'Se connecter à API Hub',
            multiple_sessions_title: 'Plusieurs sessions détectées',
            multiple_sessions_text:
                'Une session active existe déjà pour ce compte. Cette procédure mettra fin à toutes les autres sessions pour ce compte.',
            fields: {
                username: "Nom d'utilisateur",
                password: 'Mot de passe',
            },
            actions: {
                multi_session_sign_in: 'CONTINUER',
                multi_session_sign_in_additional_text:
                    'LES AUTRES SESSIONS SERONT INTERROMPUES',
                sign_in: 'Connexion',
                sign_in_with: 'Connexion avec',
                sign_up_title: "Nouvel utilisateur d'API Hub ?",
                sign_up: 'Créer un compte API Hub',
                forgot_password: 'Mot de passe oublié ?',
            },
            notifications: {
                invalid_credentials:
                    "Informations d'identification non valides. Veuillez réessayer ou utiliser le lien mot de passe oublié ci-dessous",
                multi_session_invalid_credentials:
                    'Les informations d’identification sont invalides. Veuillez essayer à nouveau.',
                selected_scheme: 'Connexion avec',
                local_logins_disabled:
                    'L’accès direct est interdit. Vous devez sélectionner une méthode d’authentification dans la liste ci-dessous. Vous pouvez contacter votre administrateur pour plus d’informations.',
            },
        },
        account_setup: {
            title: 'Terminer et activer votre compte',
            fields: {
                firstname: 'Prénom',
                lastname: 'Nom',
                email: 'Courriel',
                username: "Nom d'utilisateur",
                password: 'Mot de passe',
                confirm_password: 'Confirmer le mot de passe',
            },
            actions: {
                submit: 'Activer votre compte',
                open_login_page: 'Accéder à la page de connexion',
            },
            validation: {
                error_password_match: 'Les mots de passe sont différents.',
                error_username_not_unique:
                    "Ce nom d'utilisateur n'est pas unique.",
                tooltip_username: '6 caractères minimum\n60 caractères maximum',
                tooltip_password:
                    'Exigences relatives au mot de passe : \n- 8 caractères minimum\n- 60 caractères maximum\n- Au moins une minuscule\n- Au moins une majuscule\n- Au moins un chiffre\n- Au moins un caractère spécial parmi ceux ci-après : !@#$%^&*',
                tooltip_password_confirm: 'Resaisissez votre mot de passe',
            },
            notifications: {
                prepare: 'Préparation du formulaire..',
                invalid_request: 'Impossible de configurer votre compte.',
                success: 'Votre compte a été configuré.',
            },
            terms_of_use: {
                terms_of_use_acknowledgement: "J’ai lu et j'accepte les ",
                terms_of_use: "Conditions d'utilisation",
                terms_of_use_validation: 'Accepter nos termes et conditions',
                terms_of_use_dialog: {
                    title: "Conditions d'utilisation",
                    close: 'Fermer',
                },
            },
        },
        reset_password: {
            title: 'Réinitialiser le mot de passe',
            fields: {
                username: "Nom d'utilisateur",
            },
            actions: {
                submit: 'Soumettre',
            },
            form_details: {
                instructions: "Entrez votre nom d'utilisateur.",
                description:
                    'Un lien de réinitialisation de votre mot de passe vous sera envoyé par courriel.',
            },
            notifications: {
                local_logins_disabled:
                    'Le password ne peut être réinitialisé lorsque l’accès direct est désactivé.',
            },
        },
        reset_password_confirm: {
            title: 'Demande de réinitialisation du mot de passe envoyée',
            actions: {
                open_login_page: 'Accéder à la page de connexion',
            },
            form_details: {
                instructions: 'Consultez votre boîte de réception.',
                description:
                    'Pour réinitialiser votre mot de passe, cliquez sur le lien inclus dans votre courriel.',
            },
        },
        new_password: {
            title: 'Créer un mot de passe',
            fields: {
                current_password: 'Mot de passe actuel',
                password: 'Mot de passe',
                confirm_password: 'Confirmer le mot de passe',
            },
            actions: {
                change_password: 'Modifier le mot de passe',
                open_login_page: 'Accéder à la page de connexion',
            },
            validation: {
                error_password_match: 'Les mots de passe sont différents.',
                tooltip_password:
                    'Exigences relatives au mot de passe : \n- 8 caractères minimum\n- 60 caractères maximum\n- Au moins une minuscule\n- Au moins une majuscule\n- Au moins un chiffre\n- Au moins un caractère spécial parmi ceux ci-après : !@#$%^&*',
                tooltip_password_confirm: 'Resaisissez votre mot de passe',
            },
            notifications: {
                confirmation:
                    'Votre mot de passe a été réinitialisé. Utilisez votre nouveau mot de passe pour vous connecter.',
                verifying_token:
                    'Vérification de votre demande de réinitialisation du mot de passe...',
                invalid_token:
                    "Impossible de créer un mot de passe : votre jeton n'est pas valide.",
            },
        },
        menu: {
            user_details: {
                full_name: '%{last_name} %{first_name}',
            },
        },
        homepage: {
            placeholder_empty_content:
                "Le contenu de la page d'accueil n'a pas encore été fourni. Les administrateurs du portail peuvent cliquer sur Créer pour ajouter du contenu.",
        },
        actions: {
            view_as_cards: 'Afficher sous forme de cartes',
            view_as_list: 'Afficher sous forme de liste',
            tree_drop_before: 'Avant %{title}',
            tree_drop_after: 'Après %{title}',
            select_an_api_plan: "Sélectionner un plan d'API (obligatoire)",
        },
        validation: {
            password: {
                at_least_one_lowercase_character: 'Au moins une minuscule',
                at_least_one_uppercase_character: 'Au moins une majuscule',
                at_least_one_number: 'Au moins un chiffre',
                at_least_one_special_character:
                    'Au moins un caractère spécial parmi ceux ci-après : !@#$%^&*',
                no_other_characters_accepted:
                    'Seuls les caractères alphanumériques et !@#$%^&*- sont autorisés',
            },
        },
        markdown_editor: {
            fonts: {
                bold: 'Gras',
                italic: 'Italique',
                strikethrough: 'Barré',
                unordered: 'Liste non triée',
                order: 'Liste numérotée',
                quote: 'Citation',
                hr: 'Saut de ligne',
                inlinecode: 'Code intégré',
                code: 'Code de bloc',
            },
        },
        terms_and_conditions: {
            api_label:
                "En cliquant sur Sélectionner une API, j'accepte les termes et conditions.",
            api_group_label:
                "En cliquant sur Sélectionner un groupe d'API, j'accepte les termes et conditions.",
        },
    },
    resources: {
        apis: {
            name: 'API |||| API',
            fields: {
                name: 'Nom ',
                portalStatus: 'Etat',
                accessStatus: 'Accès',
                apiServiceType: 'Type',
                ssgServiceType: 'Type',
                createTs: 'Créé',
                modifyTs: 'Modifié',
                version: 'Version',
                versionShort: 'V',
                description: 'Description ',
                privateDescription: 'Description privée',
                tags: 'Etiquettes',
                applicationUsage: 'Applications',
                assets: 'Actifs',
                apiLocation: "Emplacement de l'API",
                apiGroup: "Groupe d'API",
            },
            portalStatus: {
                enabled: 'Activé',
                disabled: 'Désactivé',
                deprecated: 'Désapprouvé',
                unpublished: 'Non publié',
                incomplete: 'Incomplet',
                new: 'Non publié',
            },
            accessStatus: {
                public: 'Public',
                private: 'Privée',
            },
            last_update: {
                fields: {
                    updated: 'Modification %{date}',
                },
            },
            list: {
                cards: {
                    fields: {
                        updated: 'Modification %{date}',
                        version: 'v%{version}',
                        applications: '%{smart_count} application(s)',
                        applications_long:
                            '1 application utilisant cette API |||| %{smart_count} applications utilisant cette API',
                        averageLatency: '%{ms} ms',
                        averageLatency_long:
                            'Latence moyenne au cours des 7 derniers jours',
                    },
                },
                sort: {
                    name: {
                        asc: "Nom de l'API : A-Z",
                        desc: "Nom de l'API : Z-A",
                    },
                    createTs: {
                        asc:
                            'Date de création : du plus ancien au plus ancien récent',
                        desc:
                            'Date de création : du plus récent au plus ancien',
                    },
                    modifyTs: {
                        asc:
                            'Date de modification : du plus ancien au plus ancien récent',
                        desc:
                            'Date de modification : du plus récent au plus ancien',
                    },
                },
                filters: {
                    search: 'Rechercher par nom ou par description',
                },
            },
            overview: {
                title: 'Présentation',
                fields: {
                    version: 'v%{version}',
                },
                actions: {
                    download_assets: 'Télécharger les actifs',
                },
                notifications: {
                    no_assets: "Aucun actif n'est associé à cette API.",
                },
            },
            specification: {
                title: 'Spécifications',
                fields: {
                    select_application_label: 'Applications utilisées',
                },
                actions: {
                    select_application:
                        "Sélectionnez l'application pour utiliser sa clé par défaut.",
                    search_or_select_application:
                        'Rechercher ou sélectionner une application',
                    select_api_key: "Sélectionner la clé d'API",
                },
            },
            documentation: {
                title: 'Documentation',
            },
        },
        apiGroups: {
            name: "Groupe d'API |||| Groupes d'API",
            short_name: 'Groupe |||| Groupes',
            fields: {
                name: 'Nom ',
            },
        },
        apiPlans: {
            name: "Plan d'API |||| Plans d'API",
            fields: {
                name: 'Nom ',
                description: 'Description ',
                rate_limit: 'Limite de taux',
                quota: 'Quota',
                quota_interval: 'Intervalle de quota',
                second: 'seconde',
                day: 'jour',
                month: 'mois',
            },
        },
        applications: {
            name: 'Application |||| Applications',
            fields: {
                name: 'Nom ',
                apiKey: "Clé d'API :",
                keySecret: 'Secret partagé :',
                apiKeyClientID: "Clé d'API/ID de client",
                apisIncluded: 'API incluses',
                apis: 'APIs',
                apisCount: '%{count}',
                authentication: 'Authentification',
                authMethod: "Méthode d'authentification",
                authprovider: "Fournisseur d'authentification",
                day: 'jour',
                days: 'jours',
                description: 'Description ',
                encrypted: 'Chiffré',
                expiryDate: "Date d'expiration",
                sharedSecretClientSecret: 'Secret partagé/Secret de client',
                oauthType: 'Type OAuth',
                oauthCallbackUrl: 'URL de rappel OAuth',
                oauthScope: 'Etendue OAuth',
                overview: 'Présentation',
                status: 'Etat',
                apiGroups: "Groupes d'API",
                apiGroupsCount: '%{count}',
                certificateName: 'Nom ',
                apiGroup: "Groupe d'API",
                organization: 'Organisation',
                applicationInformation: "Informations sur l'application",
                customField: 'Champ personnalisé',
                details: 'Détails',
                noCustomFields: "Aucun champ personnalisé n'est disponible.",
                noApplications: "Aucune application n'est disponible",
                apiManagement: 'Gestion des API',
                authCredentials: 'Authentifications et références',
                callbackUrl: 'URL(s) de rappel/redirection',
                scope: 'Portée ',
                type: 'Type',
                secretType: 'Type de secret',
                none: 'Aucun(e)',
                public: 'Public',
                confidential: 'Confidentiel',
                hashed: 'Hashed',
                plain: 'Format texte.',
                sharedSecretFormat: 'Format du secret partagé',
                selectOrganization: "Sélectionner l'organisation",
                apiPlan: "Plan d'API",
                quota: 'Quota',
                rateLimit: 'Limite de taux',
                termsOfUseApi:
                    "En cliquant sur Ajouter une API, j'accepte les termes et conditions.",
                actions: 'Actions',
                default: 'Défaut',
                certificate: 'Certificat',
                shaThumbPrint: 'Empreinte digitale SHA-256',
                subjectDomain: 'Domaine du sujet',
                notValidAfter: 'Non valable après (%{zone})',
                certificates: 'Certificats',
                authMethodCertificate: 'Certificats',
                authMethodNone: 'Aucun',
                authMethodSecret: 'Identifiant client et secret',
                notAvailableAuthMethod: 'Non disponible',
                deferredClientId:
                    "L'identifiant du uclient sera disponible après l'inscription.",
                clientMetadata: 'Métadonnées du client',
                clientDefinitionName: 'Nom de définition du client',
                clientDefinitionDescription: 'Description',
            },
            actions: {
                generateSecret: 'Générer un nouveau secret',
                copyNewSecret: 'Copier le nouveau secret',
                plainTextSecret: 'Secret en texte brut',
                hashedSecret: 'Secret haché',
                cancel: 'Annuler',
                publish: 'Publier',
                save: 'Enregistrer',
                addApplication: 'Ajouter une application',
                createApplication: 'Créer une application',
                deleteApplication: "Supprimer l'application",
                deleting_title: "Suppression de l'application",
                select_api: "Sélectionner l'API",
                addApi: 'Ajouter une API',
                addApiGroup: "Ajouter un groupe d'API",
                searchByApiTitle: 'Rechercher',
                filterByTag: 'Filtrer par étiquette',
                accept_terms_and_conditions:
                    "J'accepte les termes et conditions",
                edit: 'Modifier',
                delete: 'Supprimer',
                force_delete: 'Forcer la suppression',
                no: 'Non',
                yes: 'Oui',
                addCertificate: 'Ajouter un certificat',
                submitForApproval: 'Soumettre pour approbation',
                uploadCertificate: 'Télécharger le certificat',
                confirm: 'Confirmer',
                submitDelete: 'Soumettre Supprimer',
            },
            validation: {
                apikey_caption:
                    'La clé doit être unique. La longueur maximale de la clé est de 255 caractères.',
                apikey_name_caption:
                    'Le nom de la clé doit être unique pour l’application. La longueur maximale est de 255 caractères.',
                error_application_name_not_unique:
                    "Le nom de cette application n'est pas unique.",
                callback_url_caption:
                    'Utiliser des valeurs séparées par des virgules',
                scope_caption: 'Utiliser des valeurs séparées par des espaces',
                application_name_caption:
                    'Le nom de la clé doit être unique pour l’application. La longueur maximale est de 255 caractères.',
                apikey_name_empty_error: 'Le nom ne peut pas être vide',
                certificate_name_caption: 'Doit être unique par application.',
                certificate_file_input_caption:
                    'Tous les certificats de clés d’application seront redéployés.',
                clientDefintion_json:
                    'JSON valide requis, 5000 caractères maximum.',
            },
            status: {
                enabled: 'Activé',
                disabled: 'Désactivé',
                deprecated: 'Désapprouvé',
                delete_failed: 'Echec de la suppression.',
                pending_registration: "En attente d'inscription",
                expired: 'Expiré',
                incomplete: 'Incomplet',
                unpublished: 'Non publié',
                rejected: 'Rejeté',
                application_pending_approval: "En attente d'approbation",
                edit_application_pending_approval: "En attente d'approbation",
                delete_application_pending_approval: "En attente d'approbation",
                apis_help_text:
                    'Au moins 1 API (ou un groupe d’API) est nécessaire pour publier une application.',
                api_keys_help_text:
                    'Au moins une clé d’API est nécessaire pour publier une application.',
                partial_lock:
                    'Des parties de cette section sont verrouillées en attente de la validation d’une modification précédente.',
                complete_lock:
                    'Cette section est verrouillée en attente de la validation d’une modification précédente.',
                create_apis_help_text:
                    "Enregistrement requis avant de pouvoir ajouter des API. Au moins 1 API (ou groupe d'API) est nécessaire pour publier une application.",
                create_api_keys_help_text:
                    'Enregistrement requis avant de pouvoir créer des clés. Au moins 1 clé API est requise pour publier une application',
                add_certificates_help_text:
                    "Sauvegarde nécessaire avant qu'un certificat puisse être ajouté.",
                certificate_submission:
                    'Le certificat sera soumis sous forme de demande et sera disponible après approbation.',
            },
            list: {
                sort: {
                    name: {
                        asc: "Nom de l'application : A-Z",
                        desc: "Nom de l'application : Z-A",
                    },
                },
            },
            notifications: {
                configuration: 'Configuration',
                copy_success: 'Copié dans le presse-papiers',
                copy_error: 'Echec de la copie dans le presse-papiers',
                generate_secret_warning_1:
                    "La génération d'un nouveau secret modifie la clé d'API et annule la clé d'API actuelle.",
                generate_secret_warning_2:
                    "Cette option permet d'empêcher l'accès à quiconque utilise la clé d'API actuelle. Partagez le nouveau secret généré avec les développeurs qui codent une application utilisant les API.",
                hashed_secret_generated_message:
                    'Copiez ce secret partagé. Il ne sera plus affiché.',
                secret_generated_heading: 'Nouveau secret généré',
                secret_generated_heading_error:
                    "Une erreur s'est produite lors de la génération du secret.",
                secret_generated_message:
                    "Le secret de texte est visible uniquement pendant la session de navigation actuelle ; il est haché après l'actualisation de la page.",
                oauth_client_secret_generated_message:
                    'Le secret ne sera visible que pendant la session du navigateur en cours.',
                copy_secret_now: 'Copier le secret partagé maintenant',
                copy_to_clipboard: 'Copier dans le presse-papiers',
                edit_overview: 'Modifier la présentation',
                empty_overview: 'Aucune valeur',
                create_success: "L'application a été créée.",
                key_create_request_success:
                    "Demande de création de clé d'API soumise.",
                key_create_success: 'Clé d’API créée avec succès.',
                create_error:
                    "Une erreur s'est produite lors de la création de l'application.",
                edit_request_success:
                    'Demande de mise à jour de l’application effectuée.',
                edit_success: "L'application a été mise à jour.",
                edit_error:
                    "Une erreur s'est produite lors de la mise à jour de l'application.",
                delete_success: "L'application a été supprimée.",
                delete_request_success:
                    'Demande de suppression de l’application effectuée avec succès.',
                delete_error:
                    "Une erreur s'est produite lors de la suppression de l'application.",
                publish_request_success:
                    'Demande de publication de l’application effectuée.',
                unsaved_changes: 'Modifications non enregistrées.',
                unsaved_changes_content:
                    'Cette section contient des modifications qui n’ont pas été enregistrées. Souhaitez-vous toujours quitter cette section ?',
                delete_key_success: "'Clé d'application supprimée avec succès.",
                publish_success: 'Application publiée avec succès.',
                certificate_upload_request_success:
                    'Demande de téléchargement du certificat soumise avec succès.',
                certificate_upload_request_failure:
                    'Echec de la demande de téléchargement de certificat.',
                certificate_upload_success:
                    'Certificat téléchargé avec succès.',
                certificate_upload_failure:
                    'Échec du téléchargement du certificat.',
                certificate_delete_failure:
                    'Échec de la suppression du certificat.',
                certificate_delete_success: 'Certificat supprimé avec succès.',
                certificate_delete_request_failure:
                    ' Échec de la demande de suppression du certificat',
                certificate_delete_request_success:
                    'Demande de suppression de certificat soumise avec succès.',
            },
            confirm_delete:
                'Vous êtes sur le point de supprimer cette application. Voulez-vous continuer ?',
            deleting_content:
                "Annulation du déploiement des clés et suppression de l'application. Cela peut prendre plusieurs minutes.",
            deleting_content_oauth_client:
                'Annulation du déploiement et suppression du client OAuth. Cela peut prendre plusieurs minutes.',
            proxy_check_alert:
                'Impossible de se connecter à tous les magasins de clés dans lesquels la clé API est déployée. Cela entraînera probablement une suppression incomplète, où cette clé restera dans certains magasins de clés. Il devra être supprimé directement du magasin de clés. Il y aura une option pour forcer la suppression de l’enregistrement de la clé API du portail.',
            publish_help_text:
                'Une application complète avec au moins 1 API et 1 clé peut être publiée et sa clé déployée vers les proxys.',
        },
        apikeys: {
            confirm_delete:
                'Vous êtes sur le point de supprimer cette clé d’API. En êtes vous sûr ?',
            confirm_delete_oauth_client:
                'Vous êtes sur le point de supprimer ce client OAuth. Etes-vous sûr?',
            deleting_content:
                'Suppression du déploiement et de la clé d’API. Ceci peut prendre quelques minutes.',
            proxy_check_alert:
                'Impossible de se connecter à tous les magasins de clés dans lesquels la clé API est déployée. Cela entraînera probablement une suppression incomplète, où cette clé restera dans certains magasins de clés. Il devra être supprimé directement du magasin de clés. Il y aura une option pour forcer la suppression de l’enregistrement de la clé API du portail.',
            proxy_check_alert_oauth_client:
                "Impossible de se connecter à tous les magasins de clés dans lesquels le client OAuth a été déployé. Cela entraînera probablement une suppression incomplète, où ce client OAuth restera sur certains magasins de clés. Il devra être supprimé directement du magasin de clés. Il y aura une option pour forcer la suppression de l'enregistrement OAuth-Client du portail.",
            replace_client_metadata_title: 'Métadonnées du client modifiées',
            replace_client_metadata_content:
                'Vos modifications apportées aux métadonnées du client seront perdues avec cette action. Êtes-vous sûr de vouloir continuer ?',
            client_metadata_accordion_title: 'Métadonnées du client',
            reg_pending_title: "En attente d'inscription",
            reg_pending_wf_content:
                "Le client OAuth est en état d'enregistrement en attente. Il peut être soumis au fournisseur d'authentification pour création, une fois la demande du client OAuth approuvée.",
            reg_pending_incomplete_content:
                "Le client OAuth est en état d'enregistrement en attente. Il peut être soumis au fournisseur d'authentification pour création, une fois l'application publiée.",
            actions: {
                addKey: 'Ajouter une clé',
                complete_registration: "Clé d'enregistrement",
                deleteApiKey: 'Supprimer une clé',
                deleteOAuthClient: 'Supprimer le client OAuth',
                deleting_title: "Supprimer une clé d'API",
                deleting_title_oauth_client: 'Suppression du client OAuth',
                force_delete: 'Forcer la suppression',
                reload_client_definition: 'Recharger les métadonnées',
                replace_client_metadata_dialog_submit:
                    'Remplacer les métadonnées du client',
                cancel: 'Annuler',
                delete: 'Supprimer',
                close: 'Fermer',
            },
        },
        documents: {
            name: 'Wiki |||| Wiki',
            fields: {
                title: 'Titre',
                navtitle: 'URI',
                markdown: 'Contenu',
                modifyTs: 'Dernière modification',
                ordinal: 'Position',
                new_document: 'Nouveau document',
                select_documentation_locale: 'Langue sélectionnée',
            },
            actions: {
                // Toolbar
                new_document_button: 'New root document',
                new_child_document_button: 'Nouvel enfant',
                edit_document_button: 'Modifier',
                delete_document_button: 'Supprimer',
                change_document_parent_button: 'Modifier le parent',
                // Tree
                expand_documentation: 'Expand documentation of node {title}',
                collapse_documentation:
                    'Réduire la documentation du noeud {title}',
                // Drag & Drop
                move_as_first_child: 'First document',
                move_after_document: 'Après %{title}',
                move_as_root_item:
                    'Sélectionnez cette option pour accéder à la racine.',
                // Form
                save: 'Publish',
                cancel: 'Annuler',
            },
            validation: {
                error_no_special_characters:
                    "L'URI doit contenir uniquement des caractères non codés. Les lettres de a à z et les séparateurs - et _ sont pris en charge.",
                error_navtitle_not_unique: 'Cet URI existe déjà.',
            },
            notifications: {
                tree_updated_success:
                    "L'arborescence de documentation a été mise à jour.",
                tree_updated_error:
                    "Echec de la mise à jour de l'arborescence de la documentation",
                create_success: 'Le document a été créé.',
                create_error:
                    "Une erreur s'est produite lors de la création du document.",
                edit_success: 'Le document a été mis à jour.',
                edit_error:
                    "Une erreur s'est produite lors de la mise à jour du document.",
                delete_success: 'Le document a été supprimé.',
                delete_error:
                    "Une erreur s'est produite lors de la suppression du document.",
                unsaved_changes:
                    'Si vous quittez cette page, vos modifications seront perdues. Voulez-vous annuler la modification de ce document ?',
            },
            confirm_delete_document_without_children:
                'Vous êtes sur le point de supprimer ce document. Voulez-vous continuer ?',
            confirm_delete_document_with_children:
                'Vous êtes sur le point de supprimer ce document et ses documents enfants. Voulez-vous continuer ?',
        },
        registrations: {
            title: 'Créer un compte',
            fields: {
                email: 'Courriel',
                email_confirmation: "Confirmer l'adresse de messagerie",
                organization: 'Organisation ou espace de travail',
                organization_description: "Description de l'organisation",
                robot: "I'm not a robot",
            },
            actions: {
                submit: 'Soumettre',
                login: 'Se connecter à un compte existant',
                return_to_homepage: "Revenir à la page d'accueil",
            },
            notifications: {
                confirmation_required: 'Confirmation requise',
                error:
                    "Un problème est survenu lors de l'enregistrement de votre compte.",
                confirmation_title: 'Consulter votre boîte de réception',
                confirmation:
                    "Enregistrement reçu. Un courriel de notification sera envoyé à l'adresse indiquée.",
                email_confirmation_error:
                    "L'adresse de messagerie ne correspond pas.",
                form_confirmation_error: 'Confirmation requise.',
                limituserregistration:
                    "La demande d'enregistrement de cette adresse électronique est en attente d'approbation/activation. Les demandes multiples ne sont pas autorisées.",
            },
            slider: {
                confirmed: 'Confirmé(e)',
                unconfirmed: 'Faire glisser pour confirmer',
            },
        },
        userContexts: {
            title: 'Mon profil',
            fields: {
                userDetails: {
                    username: "Nom d'utilisateur",
                    lastName: 'Nom',
                    firstName: 'Prénom',
                    email: 'Courriel',
                    password: 'Mot de passe',
                },
                currentPassword: 'Mot de passe actuel',
                newPassword: 'Mot de passe',
                confirmNewPassword: 'Confirmer le mot de passe',
            },
            actions: {
                edit_profile: 'Mon profil',
                cancel: 'Annuler',
            },
            notifications: {
                profile_not_exist_error: "Ce profil n'existe pas.",
                update_success: 'Profil mis à jour',
                update_error: 'La mise à jour du profil a échoué.',
                invalid_password: "Le mot de passe actuel n'est pas valide.",
                confirm_password_change:
                    'Votre mot de passe a été réinitialisé. Utilisez votre nouveau mot de passe pour vous connecter.',
            },
            validation: {
                error_current_password_empty:
                    'Saisissez votre mot de passe actuel',
                error_password_match: 'Les mots de passe sont différents.',
                tooltip_password:
                    'Exigences relatives au mot de passe : \n- 8 caractères minimum\n- 60 caractères maximum\n- Au moins une minuscule\n- Au moins une majuscule\n- Au moins un chiffre\n- Au moins un caractère spécial parmi ceux ci-après : !@#$%^&*',
                tooltip_password_confirm: 'Resaisissez votre mot de passe',
            },
            accessibleOrgs: {
                title: 'Mon organisation |||| Mes organisations',
            },
            activeOrgUuid: {
                status: {
                    active: 'Organisation sélectionnée',
                    not_active: 'Organisation non sélectionnée',
                },
                notifications: {
                    update_success: 'Votre organisation a été mise à jour.',
                    update_error: "La mise à jour de l'organisation a échoué.",
                },
            },
        },
        userProfiles: {
            passwordDialogTitle: 'Entrer le mot de passe actuel',
            fields: {
                userName: "Nom d'utilisateur",
                lastName: 'Nom de famille',
                firstName: 'Prénom',
                email: 'E-mail',
                password: 'mot de passe',
                currentPassword: 'Mot de passe actuel',
                newPassword: 'nouveau mot de passe',
                confirmNewPassword: 'Confirmer le nouveau mot de passe',
            },
            actions: {
                edit_profile: 'Mon profil',
                cancel: 'Annuler',
                submit: 'Soumettre',
            },
            notifications: {
                update_success: 'Profil mis à jour',
            },
            validation: {
                error_password_empty: 'Le mot de passe ne peut pas être vide',
                error_password_match: 'Le mot de passe ne correspond pas',
                error_password_not_matching_criteria:
                    'Le mot de passe doit répondre aux exigences spécifiées.',
                tooltip_current_password:
                    'Mot de passe requis pour effectuer des modifications. Veuillez saisir votre mot de passe.',
                tooltip_password_title: 'Exigences relatives au mot de passe:',
                tooltip_password_min: '-Minimum %{num} caractères',
                tooltip_password_max: '-Maximum %{num} caractères',
                tooltip_password_lower:
                    '-Au moins %{num} caractères minuscule)',
                tooltip_password_upper:
                    '-Au moins %{num} caractères majuscule)',
                tooltip_password_number: '-Au moins %{num} nombres)',
                tooltip_password_special:
                    '-Au moins %{num} caractères spéciaux): %{symbols}',
                tooltip_password_confirm: 'Répétez votre mot de passe',
            },
        },
    },
};

export default mergeTranslations(raMessages, apiHubMessages);
