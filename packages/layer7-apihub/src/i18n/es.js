import { mergeTranslations } from 'react-admin';
import raMessages from 'ra-language-english';

const apiHubMessages = {
    ra: {
        ...raMessages,
        page: {
            dashboard: 'Página principal',
        },
        action: {
            add_filter: 'Añadir filtro',
            show: 'Mostrar',
            edit: 'Editar',
            bulk_actions:
                '1 artículo seleccionado |||| %{smart_count} elementos seleccionados',
            loading: 'Cargando...',
        },
        actions: {
            ...raMessages.actions,
            open_sidebar: 'Abrir el menú',
            close_sidebar: 'Cerrar el menú',
        },
        navigation: {
            ...raMessages.navigation,
            page_rows_per_page: 'Elementos por página:',
            next: 'Sigu',
            prev: 'Ante',
        },
        auth: {
            logout: 'Cerrar Sesión',
        },
    },
    apihub: {
        login: {
            title: 'Iniciar sesión en API Hub',
            fields: {
                username: 'Nombre de usuario',
                password: 'Contraseña',
            },
            actions: {
                sign_in: 'Iniciar sesión',
                sign_in_with: 'Iniciar sesión con',
                sign_up_title: '¿Primera vez en API Hub?',
                sign_up: 'Crear una cuenta de API Hub',
                forgot_password: '¿Ha olvidado la contraseña?',
            },
            notifications: {
                invalid_credentials:
                    'Credenciales no válidas. Vuelva a intentarlo o utilice el enlace de contraseña olvidada a continuación',
                selected_scheme: 'Iniciando sesión con',
                local_logins_disabled:
                    'El inicio de sesión directo está deshabilitado. Puede elegir un método de autenticación de la lista a continuación. Póngase en contacto con su administrador para obtener más información.',
            },
        },
        account_setup: {
            title: 'Completar y activar la cuenta',
            fields: {
                firstname: 'Nombre',
                lastname: 'Apellido',
                email: 'Correo electrónico',
                username: 'Nombre de usuario',
                password: 'Contraseña',
                confirm_password: 'Confirmar contraseña',
            },
            actions: {
                submit: 'Activar cuenta',
                open_login_page: 'Ir a Iniciar sesión',
            },
            validation: {
                error_password_match: 'Las contraseñas no coinciden',
                error_username_not_unique:
                    'Este nombre de usuario no es único.',
                tooltip_username:
                    '6 caracteres como mínimo\n60 caracteres como máximo',
                tooltip_password:
                    'Requisitos de la contraseña:\n- 8 caracteres como mínimo\n- 60 caracteres como máximo\n- Al menos un carácter en minúscula\n- Al menos un carácter en mayúscula\n- Al menos un número\n- Al menos un carácter especial: !@#$%^&*',
                tooltip_password_confirm: 'Repita la contraseña',
            },
            notifications: {
                prepare: 'Preparando formulario...',
                invalid_request: 'No se puede configurar la cuenta.',
                success: 'La cuenta se ha configurado correctamente.',
            },
            terms_of_use: {
                terms_of_use_acknowledgement: 'He leído y acepto los ',
                terms_of_use: 'Términos de uso',
                terms_of_use_validation:
                    'Aceptar nuestros términos y condiciones',
                terms_of_use_dialog: {
                    title: 'Términos de uso',
                    close: 'Cerrar',
                },
            },
        },
        reset_password: {
            title: 'Restablecer contraseña',
            fields: {
                username: 'Nombre de usuario',
            },
            actions: {
                submit: 'Enviar',
            },
            form_details: {
                instructions: 'Introduzca el nombre de usuario',
                description:
                    'Le enviaremos un vínculo para restablecer la contraseña.',
            },
            notifications: {
                local_logins_disabled:
                    'La contraseña no se puede restablecer si los inicios de sesión locales están deshabilitados',
            },
        },
        reset_password_confirm: {
            title: 'Solicitud de restablecimiento de la contraseña enviada',
            actions: {
                open_login_page: 'Ir a Iniciar sesión',
            },
            form_details: {
                instructions: 'Compruebe el correo electrónico.',
                description:
                    'Haga clic en el vínculo del correo electrónico para restablecer la contraseña.',
            },
        },
        new_password: {
            title: 'Crear nueva contraseña',
            fields: {
                current_password: 'Contraseña actual',
                password: 'Contraseña',
                confirm_password: 'Confirmar contraseña',
            },
            actions: {
                change_password: 'Cambiar contraseña',
                open_login_page: 'Ir a Iniciar sesión',
            },
            validation: {
                error_password_match: 'Las contraseñas no coinciden',
                tooltip_password:
                    'Requisitos de la contraseña:\n- 8 caracteres como mínimo\n- 60 caracteres como máximo\n- Al menos un carácter en minúscula\n- Al menos un carácter en mayúscula\n- Al menos un número\n- Al menos un carácter especial: !@#$%^&*',
                tooltip_password_confirm: 'Repita la contraseña',
            },
            notifications: {
                confirmation:
                    'Se ha restablecido la contraseña. Utilice la nueva contraseña para iniciar sesión.',
                verifying_token:
                    'Se está verificando la solicitud de restablecimiento de la contraseña...',
                invalid_token:
                    'No se puede crear una nueva contraseña porque el token no es válido.',
            },
        },
        menu: {
            user_details: {
                full_name: '%{last_name} %{first_name}',
            },
        },
        homepage: {
            placeholder_empty_content:
                'Todavía no se ha proporcionado el contenido de la página principal. Los administradores del portal pueden hacer clic en Crear para agregar contenido.',
        },
        actions: {
            view_as_cards: 'Mostrar como tarjetas',
            view_as_list: 'Mostrar como lista',
            tree_drop_before: 'Antes de %{title}',
            tree_drop_after: 'Después de %{title}',
            select_an_api_plan: 'Seleccionar un plan de la API (obligatorio)',
        },
        validation: {
            password: {
                at_least_one_lowercase_character:
                    'Al menos un carácter en minúscula',
                at_least_one_uppercase_character:
                    'Al menos un carácter en mayúscula',
                at_least_one_number: 'Al menos un número',
                at_least_one_special_character:
                    'Al menos un carácter especial: !@#$%^&*',
                no_other_characters_accepted:
                    'Solo alfanumérico y !@#$%^&*- permitido',
            },
        },
        markdown_editor: {
            fonts: {
                bold: 'Negrita',
                italic: 'Cursiva',
                strikethrough: 'Tachado',
                unordered: 'Lista desordenada',
                order: 'Lista ordenada',
                quote: 'Comillas',
                hr: 'Salto de línea',
                inlinecode: 'Código en línea',
                code: 'Código de bloque',
            },
        },
        terms_and_conditions: {
            api_label:
                'Al hacer clic en Seleccionar API, acepto los términos y condiciones.',
            api_group_label:
                'Al hacer clic en Seleccionar grupo de API, acepto los términos y condiciones.',
        },
    },
    resources: {
        apis: {
            name: 'API |||| Las API',
            fields: {
                name: 'Nombre',
                portalStatus: 'Estado',
                accessStatus: 'Acceso',
                apiServiceType: 'Tipo',
                ssgServiceType: 'Tipo',
                createTs: 'Creada',
                modifyTs: 'Modificado',
                version: 'Versión',
                versionShort: 'V',
                description: 'Descripción',
                privateDescription: 'Descripción privada',
                tags: 'Etiquetas',
                applicationUsage: 'Aplicaciones',
                assets: 'Activos',
                apiLocation: 'Ubicación de la API',
                apiGroup: 'Grupo de API',
            },
            portalStatus: {
                enabled: 'Activado',
                disabled: 'Desactivado',
                deprecated: 'Obsoleto',
                unpublished: 'Sin publicar',
                incomplete: 'Incompleto',
            },
            accessStatus: {
                public: 'Público',
                private: 'Privada',
            },
            last_update: {
                fields: {
                    updated: 'Modificada el %{date}',
                },
            },
            list: {
                cards: {
                    fields: {
                        updated: 'Modificada el %{date}',
                        version: 'v%{version}',
                        applications: '% {smart_count} aplicaciones',
                        applications_long:
                            '1 aplicación que utiliza esta API |||| %{smart_count} aplicaciones que utilizan esta API',
                        averageLatency: '%{ms} ms',
                        averageLatency_long:
                            'Latencia media en los últimos 7 días',
                    },
                },
                sort: {
                    name: {
                        asc: 'Nombre de la API: A-Z',
                        desc: 'Nombre de la API: Z-A',
                    },
                    createTs: {
                        asc:
                            'Fecha de creación: de la más anterior a la más reciente',
                        desc:
                            'Fecha de creación: de la más reciente a la más anterior',
                    },
                    modifyTs: {
                        asc:
                            'Fecha de modificación: de la más anterior a la más reciente',
                        desc:
                            'Fecha de modificación: de la más reciente a la más anterior',
                    },
                },
                filters: {
                    search: 'Buscar por nombre o descripción',
                },
            },
            overview: {
                title: 'Descripción general',
                fields: {
                    version: 'v%{version}',
                },
                actions: {
                    download_assets: 'Descargar activos',
                },
                notifications: {
                    no_assets: 'No hay ningún activo asociado a esta API.',
                },
            },
            specification: {
                title: 'Especificaciones',
                fields: {
                    select_application_label: 'Aplicaciones en uso',
                },
                actions: {
                    select_application:
                        'Seleccione la aplicación para usar su clave predeterminada',
                    search_or_select_application:
                        'Buscar o seleccionar aplicación',
                },
            },
            documentation: {
                title: 'Documentación',
            },
        },
        apiGroups: {
            name: 'Grupo de API |||| Grupos de API',
            short_name: 'Grupo |||| Grupos',
            fields: {
                name: 'Nombre',
            },
        },
        apiPlans: {
            name: 'Plan de la API ||| Planes de la API',
            fields: {
                name: 'Nombre',
                description: 'Descripción',
                rate_limit: 'Límite de frecuencia',
                quota: 'Cuota',
                quota_interval: 'Intervalo de cuota',
                second: 'segundo',
                day: 'día',
                month: 'mes',
            },
        },
        applications: {
            name: 'Aplicación |||| Aplicaciones',
            fields: {
                name: 'Nombre',
                apiKey: 'Clave de la API:',
                keySecret: 'Secreto compartido:',
                apiKeyClientID: 'Clave de la API/ID de cliente',
                apisIncluded: 'API incluidas',
                apis: 'APIs',
                apisCount: '%{count}',
                authentication: 'Autenticación',
                description: 'Descripción',
                day: 'día',
                days: 'días',
                encrypted: 'Cifrado',
                expiryDate: 'fecha de expiración',
                sharedSecretClientSecret:
                    'Secreto compartido/secreto de cliente',
                oauthType: 'Tipo de OAuth',
                oauthCallbackUrl:
                    'Dirección URL de la devolución de llamada de OAuth',
                oauthScope: 'Ámbito de OAuth',
                overview: 'Descripción general',
                status: 'Estado',
                apiGroups: 'Grupos de API',
                apiGroupsCount: '%{count}',
                apiGroup: 'Grupo de API',
                organization: 'Organización',
                applicationInformation: 'Información de la aplicación',
                customField: 'Campo personalizado',
                details: 'detalles',
                noCustomFields: 'No hay campos personalizados disponibles',
                noApplications: 'No hay aplicaciones disponibles',
                apiManagement: 'Gestión de la API',
                authCredentials: 'Autenticación y Credenciales',
                callbackUrl:
                    'Direcciones URL de devolución de llamada o redirección',
                scope: 'Ámbito',
                type: 'Tipo',
                secretType: 'Tipo de Secreto',
                none: 'Ninguno',
                public: 'Público',
                confidential: 'Confidencial',
                hashed: 'Hashed',
                plain: 'Texto Plano',
                sharedSecretFormat: 'Formato del secreto compartido',
                selectOrganization: 'Seleccionar organización',
                apiPlan: 'Plan de la API',
                quota: 'Cuota',
                rateLimit: 'Límite de frecuencia',
                termsOfUseApi:
                    'Al hacer clic en Agregar API, acepto los términos y condiciones.',
                actions: 'Comportamiento',
                default: 'Defecto',
            },
            actions: {
                generateSecret: 'Generar nuevo secreto',
                copyNewSecret: 'Copiar secreto nuevo',
                plainTextSecret: 'Secreto de texto sin formato',
                hashedSecret: 'Secreto con hash',
                cancel: 'Cancelar',
                publish: 'Publicar',
                save: 'Guardar',
                addApplication: 'Agregar aplicación',
                createApplication: 'Crear aplicación',
                deleteApplication: 'Suprimir aplicación',
                deleting_title: 'Eliminando aplicación',
                select_api: 'Seleccionar API',
                addApi: 'Agregar API',
                addApiGroup: 'Agregar grupo de API',
                searchByApiTitle: 'Buscar',
                filterByTag: 'Filtrar por etiqueta',
                accept_terms_and_conditions:
                    'Acepto los términos y condiciones.',
                edit: 'Editar',
                delete: 'Suprimir',
                force_delete: 'Forzar Eliminación',
                no: 'No',
                yes: 'Si',
            },
            validation: {
                apikey_name_caption:
                    'El nombre de la clave debe ser único para esta aplicación. La cantidad máxima es de 255 caracteres.',
                error_application_name_not_unique:
                    'Este nombre de aplicación no es exclusivo.',
                callback_url_caption: 'Utilizar valores separados por comas',
                scope_caption: 'Utilizar valores separados por espacios',
                application_name_caption:
                    'El nombre de la clave debe ser único para esta aplicación. El largo máximo es de 255 caracteres.',
                apikey_name_caption:
                    'El nombre de la clave debe ser único para esta aplicación. La longitud máxima es de 255 caracteres.',
                apikey_name_empty_error: 'El nombre no puede estar vacío',
            },
            status: {
                enabled: 'Activado',
                disabled: 'Desactivado',
                deprecated: 'Obsoleto',
                delete_failed: 'Forzar eliminación',
                expired: 'Caducado',
                incomplete: 'Incompleto',
                unpublished: 'Sin publicar',
                rejected: 'Rechazado',
                application_pending_approval: 'Pendiente de aprobación',
                edit_application_pending_approval: 'Pendiente de aprobación',
                delete_application_pending_approval: 'Pendiente de aprobación',
                apis_help_text:
                    'Se requiere al menos 1 API (o grupo de API) para publicar una aplicación.',
                api_keys_help_text:
                    'Se requiere al menos 1 clave API para publicar una aplicación.',
                partial_lock:
                    'Las partes de esta sección están bloqueadas en espera de la aprobación de una edición anterior.',
                complete_lock:
                    'Esta sección está bloqueada en espera de la aprobación de una edición anterior',
                create_apis_help_text:
                    'Se requiere guardar antes de que se puedan agregar las API. Se requiere al menos 1 API (o grupo de API) para publicar una aplicación.',
                create_api_keys_help_text:
                    'Es necesario guardar antes de que se puedan crear las claves. Se requiere al menos 1 clave API para publicar una aplicación',
            },
            list: {
                sort: {
                    name: {
                        asc: 'Nombre de la aplicación: A-Z',
                        desc: 'Nombre de la aplicación: Z-A',
                    },
                },
            },
            notifications: {
                configuration: 'Configuración',
                copy_success: 'Se ha copiado en el portapapeles correctamente.',
                copy_error:
                    'Se ha producido un error al copiar al portapapeles.',
                generate_secret_warning_1:
                    'Al generar un nuevo secreto se cambia la clave de la API y se anula la clave de la API actual.',
                generate_secret_warning_2:
                    'Esto rompe el acceso para todos los usuarios que utilicen la clave de la API actual. Comparta y utilice el secreto recién generado con los desarrolladores que codifican la aplicación que utiliza las API.',
                hashed_secret_generated_message:
                    'Copie este secreto compartido. No se volverá a mostrar.',
                secret_generated_heading: 'Nuevo secreto generado',
                secret_generated_heading_error:
                    'Se ha producido un error al generar el secreto.',
                secret_generated_message:
                    'El texto del secreto solo será visible durante la sesión actual del explorador y se aplicará un algoritmo hash después de que se haya actualizado la página.',
                copy_secret_now: 'Copiar el secreto compartido ahora',
                copy_to_clipboard: 'Copiar a portapapeles',
                edit_overview: 'Editar descripción general',
                empty_overview: 'Sin valor',
                create_success: 'La aplicación se ha creado correctamente.',
                key_create_success: 'la Clave de API creada con éxito.',
                create_error:
                    'Se ha producido un error al crear la aplicación.',
                edit_request_success:
                    'Solicitud de actualización de la aplicación enviada.',
                edit_success: 'La aplicación se ha actualizado correctamente.',
                edit_error:
                    'Se ha producido un error al actualizar la aplicación.',
                delete_success: 'La aplicación se ha suprimido correctamente.',
                delete_request_success:
                    'Eliminación de la aplicación solicitada con éxito.',
                delete_error:
                    'Se ha producido un error al suprimir la aplicación.',
                publish_request_success:
                    'Solicitud de publicación de la aplicación enviada.',
                unsaved_changes: 'Cambios no guardados',
                unsaved_changes_content:
                    'Esta sección contiene cambios no guardados. ¿Aún deseas salir de esta sección?',
                delete_key_success:
                    'La clave de la aplicación se eliminó con éxito.',
                publish_success: 'Solicitud publicada con éxito.',
            },
            confirm_delete:
                'Está a punto de suprimir este aplicación. ¿Está seguro?',
            deleting_content:
                'Anulación de la implementación de claves y eliminación de la aplicación. Esto puede tomar varios minutos.',
            proxy_check_alert:
                'No se puede conectar a todos los proxies donde la aplicación ha implementado claves. Es probable que esto resulte en una eliminación incompleta, donde algunas claves permanecerán en algunos proxies. Deberán eliminarse directamente de la puerta de enlace. Habrá una opción para forzar la eliminación del registro de la aplicación del portal.',
            publish_help_text:
                'Se puede publicar una aplicación completa con al menos 1 API y 1 clave y sus claves se pueden implementar en proxies',
        },
        apikeys: {
            confirm_delete:
                'Está a punto de eliminar esta clave de API. ¿Está seguro?',
            deleting_content:
                'Desinstalación de claves y eliminación de API-Key. Esto puede tomar varios minutos.',
            proxy_check_alert:
                'No se puede conectar a todos los proxies donde se implementó la clave de API. Es probable que esto resulte en una eliminación incompleta, donde esta clave permanecerá en algunos proxies. Tendrá que ser eliminado de la puerta de enlace directamente. Habrá una opción para forzar la eliminación del registro de clave API del portal.',
            actions: {
                addKey: 'Agregar Clave',
                deleteApiKey: 'Eliminar Clave',
                deleting_title: 'Eliminando Clave de API',
                force_delete: 'Forzar Eliminación',
                cancel: 'Cancelar',
                delete: 'Eliminar',
            },
        },
        documents: {
            name: 'Wiki |||| Wiki',
            fields: {
                title: 'Título',
                navtitle: 'URI',
                markdown: 'Contenido',
                modifyTs: 'Última modificación',
                ordinal: 'Posición',
                new_document: 'Nuevo documento',
                select_documentation_locale: 'Idioma seleccionado',
            },
            actions: {
                // Toolbar
                new_document_button: 'New root document',
                new_child_document_button: 'Nuevo elemento secundario',
                edit_document_button: 'Editar',
                delete_document_button: 'Suprimir',
                change_document_parent_button: 'Cambiar elemento principal',
                // Tree
                expand_documentation: 'Expand documentation of node {title}',
                collapse_documentation:
                    'Contraer la documentación del nodo {title}',
                // Drag & Drop
                move_as_first_child: 'First document',
                move_after_document: 'Después de %{title}',
                move_as_root_item:
                    'Seleccionar para desplazarse al elemento raíz',
                // Form
                save: 'Publish',
                cancel: 'Cancelar',
            },
            validation: {
                error_no_special_characters:
                    'El URI solo debe contener caracteres no codificados. Admite letras de la a a la z y los separadores - y _.',
                error_navtitle_not_unique: 'Este URI ya existe.',
            },
            notifications: {
                tree_updated_success:
                    'El árbol de la documentación se ha actualizado correctamente.',
                tree_updated_error:
                    'Se ha producido un error al actualizar el árbol de la documentación.',
                create_success: 'El documento se ha creado correctamente.',
                create_error: 'Se ha producido un error al crear el documento.',
                edit_success: 'El documento se ha actualizado correctamente.',
                edit_error:
                    'Se ha producido un error al actualizar el documento.',
                delete_success: 'El documento se ha suprimido correctamente.',
                delete_error:
                    'Se ha producido un error al suprimir el documento.',
                unsaved_changes:
                    'Si abandona la página, se perderán los cambios realizados. ¿Desea cancelar la edición de este documento?',
            },
            confirm_delete_document_without_children:
                'Está a punto de suprimir este documento. ¿Está seguro?',
            confirm_delete_document_with_children:
                'Está a punto de suprimir este documento y sus documentos secundarios. ¿Está seguro?',
        },
        registrations: {
            title: 'Crear una nueva cuenta',
            fields: {
                email: 'Correo electrónico',
                email_confirmation: 'Confirmar correo electrónico',
                organization: 'Organización o espacio de trabajo',
                organization_description: 'Descripción de la organización',
                robot: 'No soy un robot',
            },
            actions: {
                submit: 'Enviar',
                login: 'Iniciar sesión en una cuenta existente',
                return_to_homepage: 'Volver a la página principal',
            },
            notifications: {
                confirmation_required: 'Confirmación obligatoria',
                error: 'Se ha producido un problema al registrar la cuenta.',
                confirmation_title: 'Comprobación del correo electrónico',
                confirmation:
                    'Se ha recibido el registro. Se enviará un correo electrónico de notificación a la dirección proporcionada.',
                email_confirmation_error: 'El correo electrónico no coincide.',
                form_confirmation_error: 'Se necesita la confirmación.',
                limituserregistration:
                    'La solicitud de registro para este correo electrónico está pendiente de aprobación o activación. No se permiten varias solicitudes.',
            },
            slider: {
                confirmed: 'Confirmado',
                unconfirmed: 'Deslizar para confirmar',
            },
        },
        userContexts: {
            title: 'Mi perfil',
            fields: {
                userDetails: {
                    username: 'Nombre de usuario',
                    lastName: 'Apellido',
                    firstName: 'Nombre',
                    email: 'Correo electrónico',
                    password: 'Contraseña',
                },
                currentPassword: 'Contraseña actual',
                newPassword: 'Contraseña',
                confirmNewPassword: 'Confirmar contraseña',
            },
            actions: {
                edit_profile: 'Mi perfil',
                cancel: 'Cancelar',
            },
            notifications: {
                profile_not_exist_error: 'Este perfile no existe.',
                update_success: 'Perfil actualizado',
                update_error:
                    'Se ha producido un error al actualizar el perfil.',
                invalid_password: 'La contraseña actual no es válida.',
                confirm_password_change:
                    'Se ha restablecido la contraseña. Utilice la nueva contraseña para iniciar sesión.',
            },
            validation: {
                error_current_password_empty:
                    'Introduzca la contraseña actual.',
                error_password_match: 'Las contraseñas no coinciden',
                tooltip_password:
                    'Requisitos de la contraseña:\n- 8 caracteres como mínimo\n- 60 caracteres como máximo\n- Al menos un carácter en minúscula\n- Al menos un carácter en mayúscula\n- Al menos un número\n- Al menos un carácter especial: !@#$%^&*',
                tooltip_password_confirm: 'Repita la contraseña',
            },
            accessibleOrgs: {
                title: 'Mi organización |||| Mis organizaciones',
            },
            activeOrgUuid: {
                status: {
                    active: 'Organización seleccionada',
                    not_active: 'Organización no seleccionada',
                },
                notifications: {
                    update_success:
                        'Se ha actualizado la organización correctamente.',
                    update_error:
                        'Se ha producido un error al actualizar la organización.',
                },
            },
        },
        userProfiles: {
            passwordDialogTitle: 'Introducir la contraseña actual',
            fields: {
                userName: 'Nombre de usuario',
                lastName: 'Apellido',
                firstName: 'Nombre de pila',
                email: 'correo electrónico',
                password: 'contraseña',
                currentPassword: 'Contraseña actual',
                newPassword: 'Nueva contraseña',
                confirmNewPassword: 'Confirmar nueva contraseña',
            },
            actions: {
                edit_profile: 'Mi perfil',
                cancel: 'Cancelar',
                submit: 'Entregar',
            },
            notifications: {
                update_success: 'Perfil actualizado',
            },
            validation: {
                error_password_empty: 'La contraseña no puede estar en blanco',
                error_password_match: 'las contraseñas no coinciden',
                error_password_not_matching_criteria:
                    'La contraseña debe cumplir con los requisitos de contraseña especificados.',
                tooltip_current_password:
                    'Se requiere contraseña para hacer cambios. Por favor ingrese su contraseña actual.',
                tooltip_password_title: 'Requisitos de contraseña:',
                tooltip_password_min: '-Mínimo %{num} caracteres',
                tooltip_password_max: '-Máximo %{num} caracteres',
                tooltip_password_lower:
                    '-Al menos %{num} minúsculos caracteres)',
                tooltip_password_upper:
                    '-Al menos %{num} mayúscula caracteres)',
                tooltip_password_number: '-Al menos %{num} números)',
                tooltip_password_special:
                    '-Al menos %{num} especial caracteres): %{symbols}',
                tooltip_password_confirm: 'repita su contraseña',
            },
        },
    },
};

export default mergeTranslations(raMessages, apiHubMessages);
