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
            prev: 'Préc',
        },
        auth: {
            logout: 'Se déconnecter',
        },
    },
    apihub: {
        login: {
            title: 'Se connecter à API Hub',
            fields: {
                username: "Nom d'utilisateur",
                password: 'Mot de passe',
            },
            actions: {
                sign_in: 'Connexion',
                sign_in_with: 'Connexion avec',
                sign_up_title: "Nouvel utilisateur d'API Hub ?",
                sign_up: 'Créer un compte API Hub',
                forgot_password: 'Mot de passe oublié ?',
            },
            notifications: {
                invalid_credentials:
                    "Informations d'identification non valides",
                selected_scheme: 'Connexion avec',
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
                accessStatus: 'Visibilité',
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
                        "Sélectionnez une application pour obtenir la clé d'API.",
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
                authentication: 'Authentification',
                description: 'Description ',
                encrypted: 'Chiffré',
                sharedSecretClientSecret: 'Secret partagé/Secret de client',
                oauthType: 'Type OAuth',
                oauthCallbackUrl: 'URL de rappel OAuth',
                oauthScope: 'Etendue OAuth',
                overview: 'Présentation',
                status: 'Etat',
                apiGroups: "Groupes d'API",
                apiGroup: "Groupe d'API",
                organization: 'Organisation',
                applicationInformation: "Informations sur l'application",
                customField: 'Champ personnalisé',
                noCustomFields: "Aucun champ personnalisé n'est disponible.",
                noApplications: "Aucune application n'est disponible",
                apiManagement: 'Gestion des API',
                authCredentials:
                    "Authentification et informations d'identification",
                callbackUrl: 'URL(s) de rappel/redirection',
                scope: 'Portée ',
                type: 'Type',
                none: 'Aucun(e)',
                public: 'Public',
                confidential: 'Confidentiel',
                sharedSecretFormat: 'Format du secret partagé',
                selectOrganization: "Sélectionner l'organisation",
                apiPlan: "Plan d'API",
                quota: 'Quota',
                rateLimit: 'Limite de taux',
                termsOfUseApi:
                    "En cliquant sur Ajouter une API, j'accepte les termes et conditions.",
                actions: 'Actions',
                default: 'Défaut',
            },
            actions: {
                generateSecret: 'Générer un nouveau secret',
                copyNewSecret: 'Copier le nouveau secret',
                plainTextSecret: 'Secret en texte brut',
                hashedSecret: 'Secret haché',
                cancel: 'Annuler',
                save: 'Enregistrer',
                addApplication: 'Ajouter une application',
                createApplication: 'Créer une application',
                deleteApplication: "Supprimer l'application",
                select_api: "Sélectionner l'API",
                addApi: 'Ajouter une API',
                addApiGroup: "Ajouter un groupe d'API",
                searchByApiTitle: 'Rechercher',
                filterByTag: 'Filtrer par étiquette',
                accept_terms_and_conditions:
                    "J'accepte les termes et conditions",
                edit: 'Modifier',
                delete: 'Supprimer',
            },
            validation: {
                error_application_name_not_unique:
                    "Le nom de cette application n'est pas unique.",
                callback_url_caption:
                    'Utiliser des valeurs séparées par des virgules',
                scope_caption: 'Utiliser des valeurs séparées par des espaces',
                application_name_caption:
                    'Utiliser un nom unique de 50 caractères max.',
            },
            status: {
                enabled: 'Activé',
                disabled: 'Désactivé',
                deprecated: 'Désapprouvé',
                unpublished: 'Non publié',
                rejected: 'Rejeté',
                application_pending_approval: "En attente d'approbation",
                edit_application_pending_approval: "En attente d'approbation",
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
                secret_generated_heading: 'Nouveau secret généré',
                secret_generated_heading_error:
                    "Une erreur s'est produite lors de la génération du secret.",
                secret_generated_message:
                    "Le secret de texte est visible uniquement pendant la session de navigation actuelle ; il est haché après l'actualisation de la page.",
                copy_secret_now: 'Copier le secret partagé maintenant',
                copy_to_clipboard: 'Copier dans le presse-papiers',
                edit_overview: 'Modifier la présentation',
                empty_overview: 'Aucune valeur',
                create_success: "L'application a été créée.",
                create_error:
                    "Une erreur s'est produite lors de la création de l'application.",
                edit_success: "L'application a été mise à jour.",
                edit_error:
                    "Une erreur s'est produite lors de la mise à jour de l'application.",
                delete_success: "L'application a été supprimée.",
                delete_error:
                    "Une erreur s'est produite lors de la suppression de l'application.",
            },
            confirm_delete:
                'Vous êtes sur le point de supprimer cette application. Voulez-vous continuer ?',
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
    },
};

export default mergeTranslations(raMessages, apiHubMessages);
