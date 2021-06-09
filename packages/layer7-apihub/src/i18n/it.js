import { mergeTranslations } from 'react-admin';
import raMessages from 'ra-language-english';

const apiHubMessages = {
    ra: {
        ...raMessages,
        page: {
            dashboard: 'Pagina iniziale',
        },
        action: {
            loading: 'Caricamento in corso',
        },
        actions: {
            ...raMessages.actions,
            open_sidebar: 'Apri il menu',
            close_sidebar: 'Chiudi menu',
        },
        navigation: {
            ...raMessages.navigation,
            page_rows_per_page: 'Elementi per pagina:',
        },
        auth: {
            logout: 'Disconnettersi',
        },
    },
    apihub: {
        login: {
            title: 'Accedi ad API Hub',
            fields: {
                username: 'Nome utente',
                password: 'Password',
            },
            actions: {
                sign_in: 'Accedi',
                sign_in_with: 'Accedi con',
                sign_up_title: 'È la prima volta che utilizzi API Hub?',
                sign_up: 'Crea un account API Hub',
                forgot_password: 'Password dimenticata?',
            },
            notifications: {
                invalid_credentials: 'Credenziali non valide',
                selected_scheme: 'Accesso con',
            },
        },
        account_setup: {
            title: "Completa e attiva l'account",
            fields: {
                firstname: 'Nome',
                lastname: 'Cognome',
                email: 'Messaggio di posta elettronica',
                username: 'Nome utente',
                password: 'Password',
                confirm_password: 'Conferma Password',
            },
            actions: {
                submit: "Attiva l'account",
                open_login_page: 'Vai alla pagina di accesso',
            },
            validation: {
                error_password_match: 'Le password non corrispondono',
                error_username_not_unique: 'Il nome utente non è univoco',
                tooltip_username:
                    'Numero minimo di caratteri: 6\nNumero massimo di caratteri: 60',
                tooltip_password:
                    'Requisiti di password:\n- Numero minimo di caratteri: 8\n- Numero massimo di caratteri: 60\n- Almeno un carattere con lettera minuscola\n- Almeno un carattere con lettera maiuscola\n- Almeno un numero\n- Almeno un carattere speciale: !@#$%^&*',
                tooltip_password_confirm: 'Ripeti la password',
            },
            notifications: {
                prepare: 'Preparazione del modulo in corso...',
                invalid_request: "Impossibile configurare l'account.",
                success: "L'account è stato configurato correttamente.",
            },
            terms_of_use: {
                terms_of_use_acknowledgement: 'Ho letto e accetto i ',
                terms_of_use: 'Condizioni di utilizzo',
                terms_of_use_validation: 'Accetto i termini e le condizioni',
                terms_of_use_dialog: {
                    title: 'Condizioni di utilizzo',
                    close: 'Chiudi',
                },
            },
        },
        reset_password: {
            title: 'Reimposta password',
            fields: {
                username: 'Nome utente',
            },
            actions: {
                submit: 'Inoltra',
            },
            form_details: {
                instructions: 'Immetti il nome utente',
                description:
                    'Verrà inviato un messaggio di posta elettronica contenente un collegamento per ripristinare la password.',
            },
        },
        reset_password_confirm: {
            title: 'Richiesta di ripristino della password inviata',
            actions: {
                open_login_page: 'Vai alla pagina di accesso',
            },
            form_details: {
                instructions: 'Verificare la casella di posta.',
                description:
                    'Fai clic sul collegamento nel messaggio di posta elettronica per reimpostare la password.',
            },
        },
        new_password: {
            title: 'Crea una nuova password',
            fields: {
                current_password: 'Password corrente',
                password: 'Password',
                confirm_password: 'Conferma Password',
            },
            actions: {
                change_password: 'Modifica password',
                open_login_page: 'Vai alla pagina di accesso',
            },
            validation: {
                error_password_match: 'Le password non corrispondono',
                tooltip_password:
                    'Requisiti di password:\n- Numero minimo di caratteri: 8\n- Numero massimo di caratteri: 60\n- Almeno un carattere con lettera minuscola\n- Almeno un carattere con lettera maiuscola\n- Almeno un numero\n- Almeno un carattere speciale: !@#$%^&*',
                tooltip_password_confirm: 'Ripeti la password',
            },
            notifications: {
                confirmation:
                    "La password è stata ripristinata. Utilizzare la nuova password per effettuare l'accesso.",
                verifying_token:
                    'Verifica della richiesta di ripristino della password in corso...',
                invalid_token:
                    'Impossibile creare una nuova password. Il token non è valido.',
            },
        },
        menu: {
            user_details: {
                full_name: '%{last_name} %{first_name}',
            },
        },
        homepage: {
            placeholder_empty_content:
                'Il contenuto della pagina principale non è ancora stato fornito. Gli amministratori del portale possono fare clic su Crea per aggiungere il contenuto.',
        },
        actions: {
            view_as_cards: 'Mostra come schede',
            view_as_list: 'Mostra come elenco',
            tree_drop_before: 'Prima di %{title}',
            tree_drop_after: 'Dopo %{title}',
            select_an_api_plan: 'Seleziona un piano API (obbligatorio)',
        },
        validation: {
            password: {
                at_least_one_lowercase_character:
                    'Almeno un carattere con lettera minuscola',
                at_least_one_uppercase_character:
                    'Almeno un carattere con lettera maiuscola',
                at_least_one_number: 'Almeno un numero',
                at_least_one_special_character:
                    'È necessario immettere almeno un carattere speciale: !@#$%^&*',
            },
        },
        markdown_editor: {
            fonts: {
                bold: 'Grassetto',
                italic: 'Corsivo',
                strikethrough: 'Barrato',
                unordered: 'Elenco non ordinato',
                order: 'Elenco ordinato',
                quote: 'Quota',
                hr: 'Interruzione di riga',
                inlinecode: 'Codice inline',
                code: 'Codice di blocco',
            },
        },
        terms_and_conditions: {
            api_label:
                'Facendo clic su Seleziona API, si accettano i termini e le condizioni',
            api_group_label:
                'Facendo clic su Seleziona gruppo API, si accettano i termini e le condizioni',
        },
    },
    resources: {
        apis: {
            name: 'API |||| API',
            fields: {
                name: 'Nome',
                portalStatus: 'Stato',
                accessStatus: 'Visibilità',
                apiServiceType: 'Tipo',
                ssgServiceType: 'Tipo',
                createTs: 'Creato',
                modifyTs: 'Modificato',
                version: 'Versione',
                versionShort: 'V',
                description: 'Descrizione',
                privateDescription: 'Descrizione privata',
                tags: 'Tag',
                applicationUsage: 'Applicazioni',
                assets: 'Beni',
                apiLocation: 'Posizione API',
                apiGroup: 'Gruppo API',
            },
            portalStatus: {
                enabled: 'Abilitato',
                disabled: 'Disabilitato',
                deprecated: 'Obsoleto',
                unpublished: 'Non pubblicato',
                incomplete: 'Incompleto',
            },
            accessStatus: {
                public: 'Pubblico',
                private: 'Privato',
            },
            last_update: {
                fields: {
                    updated: 'Data di modifica %{date}',
                },
            },
            list: {
                cards: {
                    fields: {
                        updated: 'Data di modifica %{date}',
                        version: 'v%{version}',
                        applications: '%{smart_count} app',
                        applications_long:
                            '1 applicazione che utilizza questa API |||| %{smart_count} applicazioni che utilizzano questa API',
                        averageLatency: '%{ms} ms',
                        averageLatency_long:
                            'Latenza media negli ultimi 7 giorni',
                    },
                },
                sort: {
                    name: {
                        asc: 'Nome API: A-Z',
                        desc: 'Nome API: Z-A',
                    },
                    createTs: {
                        asc:
                            'Data di creazione: da elementi meno recenti a elementi più recenti',
                        desc:
                            'Data di creazione: da elementi più recenti a elementi meno recenti',
                    },
                    modifyTs: {
                        asc:
                            'Data di modifica: da elementi meno recenti a elementi più recenti',
                        desc:
                            'Data di modifica: da elementi più recenti a elementi meno recenti',
                    },
                },
                filters: {
                    search: 'Cerca in base al nome o alla descrizione',
                },
            },
            overview: {
                title: 'Panoramica',
                fields: {
                    version: 'v%{version}',
                },
                actions: {
                    download_assets: 'Scarica asset',
                },
                notifications: {
                    no_assets: "Nessun asset associato all'API corrente.",
                },
            },
            specification: {
                title: 'Specifiche',
                fields: {
                    select_application_label: 'Applicazioni in uso',
                },
                actions: {
                    select_application:
                        "Seleziona l'applicazione per utilizzare la sua chiave predefinita",
                    search_or_select_application:
                        'Cerca o seleziona applicazione',
                },
            },
            documentation: {
                title: 'Documentazione',
            },
        },
        apiGroups: {
            name: 'Gruppo API |||| Gruppi API',
            short_name: 'Gruppo |||| Gruppi',
            fields: {
                name: 'Nome',
            },
        },
        apiPlans: {
            name: 'Piano API |||| Piani API',
            fields: {
                name: 'Nome',
                description: 'Descrizione',
                rate_limit: 'Limite di frequenza',
                quota: 'Quota',
                quota_interval: 'Intervallo di quota',
                second: 'secondi',
                day: 'giorno',
                month: 'mese',
            },
        },
        applications: {
            name: 'Applicazione |||| Applicazioni',
            fields: {
                name: 'Nome',
                apiKey: 'Chiave API:',
                keySecret: 'Segreto condiviso:',
                apiKeyClientID: 'Chiave API / ID client',
                apisIncluded: 'API incluse',
                authentication: 'Autenticazione',
                description: 'Descrizione',
                encrypted: 'Crittografato',
                sharedSecretClientSecret: 'Segreto condiviso / Segreto client',
                oauthType: 'Tipo OAuth',
                oauthCallbackUrl: 'URL di callback OAuth',
                oauthScope: 'Ambito OAuth',
                overview: 'Panoramica',
                status: 'Stato',
                apiGroups: 'Gruppi API',
                apiGroup: 'Gruppo API',
                organization: 'Organizzazione',
                applicationInformation: "Informazioni sull'applicazione",
                customField: 'Campo personalizzato',
                noCustomFields: 'Nessun campo personalizzato disponibile',
                apiManagement: 'Gestione API',
                authCredentials: 'Autenticazione e credenziali',
                callbackUrl: 'URL di richiamata/reindirizzamento',
                scope: 'Ambito',
                type: 'Tipo',
                none: 'Nessuno',
                public: 'Pubblico',
                confidential: 'Riservato',
                sharedSecretFormat: 'Formato del segreto condiviso',
                selectOrganization: 'Seleziona organizzazione',
                apiPlan: 'Piano API',
                quota: 'Quota',
                rateLimit: 'Limite di frequenza',
                termsOfUseApi:
                    'Facendo clic su Aggiungi API, si accettano i termini e le condizioni',
                actions: ' Azioni',
            },
            actions: {
                generateSecret: 'Genera nuovo segreto',
                copyNewSecret: 'Copia nuovo segreto',
                plainTextSecret: 'Segreto di testo normale',
                hashedSecret: 'Segreto con hash',
                cancel: 'Annulla',
                save: 'Salva',
                addApplication: 'Aggiungi applicazione',
                createApplication: 'Crea applicazione',
                deleteApplication: 'Elimina applicazione',
                deleting_title: "Eliminazione dell'applicazione",
                select_api: 'Seleziona API',
                addApi: 'Aggiungi API',
                addApiGroup: 'Aggiungi gruppo API',
                searchByApiTitle: 'Cerca per titolo API',
                filterByTag: 'Filtra per tag',
                accept_terms_and_conditions:
                    'Accetto i termini e le condizioni',
                edit: 'Modifica',
                delete: 'Elimina',
            },
            validation: {
                error_application_name_not_unique:
                    "Nome dell'applicazione non univoco",
                callback_url_caption: 'Usa valori separati da virgola',
                scope_caption: 'Usa valori separati da spazi',
                application_name_caption:
                    'Usa nome univoco di 50 caratteri (valore massimo consentito)',
            },
            status: {
                enabled: 'Abilitato',
                disabled: 'Disabilitato',
                deprecated: 'Obsoleto',
                unpublished: 'Non pubblicato',
                rejected: 'Rifiutato',
                application_pending_approval: 'In attesa di approvazione',
                edit_application_pending_approval: 'In attesa di approvazione',
            },
            list: {
                sort: {
                    name: {
                        asc: 'Nome applicazione: A-Z',
                        desc: 'Nome applicazione: Z-A',
                    },
                },
            },
            notifications: {
                configuration: 'Configurazione',
                copy_success: 'Copia negli Appunti eseguita correttamente',
                copy_error: 'Copia negli Appunti non riuscita',
                generate_secret_warning_1:
                    'La generazione di un nuovo segreto modifica la chiave API e annulla la chiave API corrente.',
                generate_secret_warning_2:
                    "L'operazione interrompe l'accesso per chiunque utilizzi la chiave API corrente. Condividere e utilizzare il nuovo segreto generato con gli sviluppatori che codificano l'applicazione mediante le API.",
                secret_generated_heading: 'Nuovo segreto generato',
                secret_generated_heading_error:
                    'Si è verificato un errore durante la generazione del segreto.',
                secret_generated_message:
                    "Il segreto di testo sarà visibile solo durante la sessione corrente del browser e verrà aggiunto un hash in seguito all'aggiornamento della pagina.",
                copy_secret_now: 'Copia il segreto condiviso ora',
                copy_to_clipboard: 'Copia negli Appunti',
                edit_overview: 'Modifica panoramica',
                empty_overview: 'Nuovo valore',
                create_success: 'Applicazione creata correttamente.',
                create_error:
                    "Si è verificato un errore durante la creazione dell'applicazione.",
                edit_success: 'Applicazione aggiornata correttamente.',
                edit_error:
                    "Si è verificato un errore durante l'aggiornamento dell'applicazione.",
                delete_success: 'Applicazione eliminata correttamente.',
                delete_error:
                    "Si è verificato un errore durante l'eliminazione dell'applicazione.",
            },
            confirm_delete:
                "Si sta per procedere all'eliminazione dell'applicazione. Procedere?",
            deleting_content:
                "Annullamento della distribuzione delle chiavi ed eliminazione dell'applicazione. Questo potrebbe richiedere vari minuti.",
        },
        documents: {
            name: 'Wiki |||| Wiki',
            fields: {
                title: 'Titolo',
                navtitle: 'URI',
                markdown: 'Contenuto',
                modifyTs: 'Ora ultima modifica',
                ordinal: 'Posizione',
                new_document: 'Nuovo documento',
                select_documentation_locale: 'Lingua selezionata',
            },
            actions: {
                new_document_button: 'New root document',
                new_child_document_button: 'Nuovo elemento figlio',
                edit_document_button: 'Modifica',
                delete_document_button: 'Elimina',
                change_document_parent_button: 'Modifica elemento padre',
                expand_documentation: 'Expand documentation of node {title}',
                collapse_documentation:
                    'Comprimi documentazione del nodo {title}',
                move_as_first_child: 'First document',
                move_after_document: 'Dopo %{title}',
                move_as_root_item:
                    'Seleziona per passare alla directory principale',
                save: 'Publish',
                cancel: 'Annulla',
            },
            validation: {
                error_no_special_characters:
                    "L'URI deve contenere solo caratteri non codificati. Supporta le lettere dalla a alla z e i separatori - e _.",
                error_navtitle_not_unique: "L'URI esiste già.",
            },
            notifications: {
                tree_updated_success:
                    'Struttura della documentazione aggiornata correttamente',
                tree_updated_error:
                    'Aggiornamento della struttura della documentazione non riuscito',
                create_success: 'Documento creato correttamente.',
                create_error:
                    'Si è verificato un errore durante la creazione del documento.',
                edit_success: 'Documento aggiornato correttamente.',
                edit_error:
                    "Si è verificato un errore durante l'aggiornamento del documento.",
                delete_success: 'Documento eliminato correttamente.',
                delete_error:
                    "Si è verificato un errore durante l'eliminazione del documento.",
                unsaved_changes:
                    'Se si abbandona la pagina, le modifiche andranno perse. Annullare la modifica di questo documento?',
            },
            confirm_delete_document_without_children:
                "Si sta per procedere all'eliminazione del documento. Procedere?",
            confirm_delete_document_with_children:
                "Si sta per procedere all'eliminazione del documento e dei documenti figlio. Procedere?",
        },
        registrations: {
            title: 'Crea Nuovo account',
            fields: {
                email: 'Messaggio di posta elettronica',
                email_confirmation: 'Conferma indirizzo di posta',
                organization: 'Organizzazione o area di lavoro',
                organization_description: 'Descrizione organizzazione',
                robot: "I'm not a robot",
            },
            actions: {
                submit: 'Inoltra',
                login: 'Accedi a un account esistente',
                return_to_homepage: 'Torna alla pagina principale',
            },
            notifications: {
                confirmation_required: 'Conferma obbligatoria',
                error:
                    "Si è verificato un problema durante la registrazione dell'account.",
                confirmation_title: 'Verifica la casella di posta',
                confirmation:
                    "Registrazione ricevuta. Verrà inviato un messaggio di posta elettronica di notifica all'indirizzo specificato.",
                email_confirmation_error:
                    'Gli indirizzi di posta non corrispondono.',
                form_confirmation_error: 'Conferma obbligatoria.',
                limituserregistration:
                    'La richiesta di registrazione per questo messaggio di posta elettronica è in attesa di approvazione/attivazione. Non sono consentite richieste multiple.',
            },
            slider: {
                confirmed: 'Operazione confermata',
                unconfirmed: 'Scorri per confermare',
            },
        },
        userContexts: {
            title: 'Profilo personale',
            fields: {
                userDetails: {
                    username: 'Nome utente',
                    lastName: 'Cognome',
                    firstName: 'Nome',
                    email: 'Messaggio di posta elettronica',
                    password: 'Password',
                },
                currentPassword: 'Password corrente',
                newPassword: 'Password',
                confirmNewPassword: 'Conferma Password',
            },
            actions: {
                edit_profile: 'Profilo personale',
                cancel: 'Annulla',
            },
            notifications: {
                profile_not_exist_error: 'Il profilo non esiste.',
                update_success: 'Profilo aggiornato',
                update_error: 'Aggiornamento del profilo non riuscito',
                invalid_password: 'La password corrente non è valida',
                confirm_password_change:
                    "La password è stata ripristinata. Utilizzare la nuova password per effettuare l'accesso.",
            },
            validation: {
                error_current_password_empty: 'Immettere la password corrente',
                error_password_match: 'Le password non corrispondono',
                tooltip_password:
                    'Requisiti di password:\n- Numero minimo di caratteri: 8\n- Numero massimo di caratteri: 60\n- Almeno un carattere con lettera minuscola\n- Almeno un carattere con lettera maiuscola\n- Almeno un numero\n- Almeno un carattere speciale: !@#$%^&*',
                tooltip_password_confirm: 'Ripeti la password',
            },
            accessibleOrgs: {
                title: 'Organizzazione personale |||| Organizzazioni personali',
            },
            activeOrgUuid: {
                status: {
                    active: 'Organizzazione selezionata',
                    not_active: 'Organizzazione non selezionata',
                },
                notifications: {
                    update_success:
                        "L'organizzazione è stata aggiornata correttamente",
                    update_error:
                        "Aggiornamento dell'organizzazione non riuscito",
                },
            },
        },
    },
};

export default mergeTranslations(raMessages, apiHubMessages);
