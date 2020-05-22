import { mergeTranslations } from 'react-admin';
import raMessages from 'ra-language-italian';

const apiHubMessages = {
    ra: {
        ...raMessages,
        actions: {
            ...raMessages.actions,
            open_sidebar: 'Apri il menu',
            close_sidebar: 'Chiudi menu',
        },
        navigation: {
            ...raMessages.navigation,
            page_rows_per_page: 'Elementi per pagina:',
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
                sign_up_title: 'È la prima volta che utilizzi API Hub?',
                sign_up: 'Crea un account API Hub',
                forgot_password: 'Password dimenticata?',
            },
            notifications: {
                invalid_credentials: 'Credenziali non valide',
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
                invalid_request: "'Impossibile configurare l'account.",
                success: "L'account è stato configurato correttamente.",
            },
            terms_of_use: {
                terms_of_use_acknowledgement: 'Ho letto e accetto i ',
                terms_of_use: 'Condizioni di utilizzo',
                terms_of_use_validation:
                    'Si prega di accettare i termini e le condizioni',
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
                error_password_match: 'Le password non corrispondono.',
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
                "Il contenuto dell'home page non è ancora stato fornito. Se si è l'amministratore del portale, utilizzare il pulsante di modifica per crearlo.",
        },
        actions: {
            view_as_cards: 'Mostra come schede',
            view_as_list: 'Mostra come elenco',
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
            },
            portalStatus: {
                enabled: 'Abilitato',
                disabled: 'Disabilitato',
                deprecated: 'Obsoleto',
                unpublished: 'Non pubblicato',
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
                        "Seleziona un'applicazione per ottenere la chiave API",
                },
            },
            documentation: {
                title: 'Documentazione',
                fields: {
                    new_document: 'Nuovo documento',
                    select_documentation_locale: 'Lingua selezionata',
                },
                actions: {
                    new_document_button: 'Nuovo documento radice',
                    new_child_document_button: 'Nuovo elemento figlio',
                    edit_document_button: 'Modifica',
                    delete_document_button: 'Elimina',
                },
                validation: {
                    error_no_special_characters:
                        "L'URI deve contenere solo caratteri non codificati. Supporta le lettere dalla a alla z e i separatori - e _.",
                    error_navtitle_not_unique: "L'URI esiste già.",
                },
                confirm_delete_document_without_children:
                    "Si sta per procedere all'eliminazione del documento. Procedere?",
                confirm_delete_document_with_children:
                    "Si sta per procedere all'eliminazione del documento e dei documenti figlio. Procedere?",
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
            },
            actions: {
                generateSecret: 'Genera nuovo segreto',
                copyNewSecret: 'Copia nuovo segreto',
                plainTextSecret: 'Segreto di testo normale',
                hashedSecret: 'Segreto con hash',
            },
            status: {
                enabled: 'Abilitato',
                disabled: 'Disabilitato',
                deprecated: 'Obsoleto',
                unpublished: 'Non pubblicato',
                rejected: 'Respinto',
                application_pending_approval: 'In attesa di approvazione',
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
                secret_generated_message:
                    "Il segreto di testo sarà visibile solo durante la sessione corrente del browser e verrà aggiunto un hash in seguito all'aggiornamento della pagina.",
                copy_secret_now: 'Copia il segreto condiviso ora',
            },
        },
        documents: {
            name: 'Documento |||| Documenti',
            fields: {
                title: 'Titolo',
                navtitle: 'URI',
                markdown: 'Contenuto',
                modifyTs: 'Ora ultima modifica',
                ordinal: 'Posizione',
            },
            actions: {
                change_document_parent_button: 'Modifica elemento padre',
                move_as_first_child: 'Primo documento',
                move_after_document: 'Dopo %{title}',
                move_as_root_item:
                    'Seleziona per passare alla directory principale',
                save: 'Pubblica',
                cancel: 'Annulla',
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
        },
        registrations: {
            title: 'Crea un nuovo conto',
            fields: {
                email: 'Email',
                email_confirmation: 'Conferma Email',
                organization: 'Organizzazione o Spazio di Lavoro',
                organization_description: "Descrizione dell'organizzazione",
                robot: 'Non sono un robot',
            },
            actions: {
                submit: 'Inoltra',
                login: 'Accedi ad un conto esistente',
                return_to_homepage: 'Ritorna alla homepage',
            },
            notifications: {
                confirmation_required: 'Conferma richiesta',
                error:
                    'Si è verificato un problema durante la registrazione del tuo account.',
                confirmation_title: 'Controlla La Tua Email',
                confirmation:
                    "Registrazione ricevuta. Un'e-mail di notifica verrà inviata all'indirizzo fornito",
                email_confirmation_error: "l'Email non corrisponde.",
                form_confirmation_error: 'È richiesta la conferma.',
            },
            slider: {
                confirmed: 'Confermato',
                unconfirmed: 'Scorrere per confermare',
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
                    current_password: 'Password corrente',
                    password: 'Password',
                    confirm_password: 'Conferma Password',
                },
            },
            actions: {
                edit_profile: 'Profilo personale',
                change_password: 'Modifica password',
            },
            notifications: {
                profile_not_exist_error: 'Questo profilo non esiste',
                update_success: 'Profilo aggiornato',
                update_error: 'Aggiornamento del profilo non riuscito',
                invalid_password: 'La password corrente non è valida',
                confirm_password_change:
                    "La password è stata ripristinata. Utilizzare la nuova password per effettuare l'accesso.",
            },
            validation: {
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
