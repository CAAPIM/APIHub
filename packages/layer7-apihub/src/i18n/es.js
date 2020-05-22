import { mergeTranslations } from 'react-admin';
import raMessages from '@blackbox-vision/ra-language-spanish';

const apiHubMessages = {
    ra: {
        ...raMessages,
        page: {
            dashboard: 'Inicio',
        },
        actions: {
            ...raMessages.actions,
            open_sidebar: 'Abrir el menú',
            close_sidebar: 'Cerrar el menú',
        },
        navigation: {
            ...raMessages.navigation,
            page_rows_per_page: 'Elementos por página:',
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
                sign_up_title: '¿Primera vez en API Hub?',
                sign_up: 'Crear una cuenta de API Hub',
                forgot_password: '¿Ha olvidado la contraseña?',
            },
            notifications: {
                invalid_credentials: 'Credenciales no válidas',
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
                error_password_match: 'Las contraseñas no coinciden.',
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
                password: 'Contraseña actual',
                newPassword: 'Contraseña',
                confirmNewPassword: 'Confirmar contraseña',
            },
            actions: {
                change_password: 'Cambiar contraseña',
                open_login_page: 'Ir a Iniciar sesión',
            },
            validation: {
                error_password_match: 'Las contraseñas no coinciden.',
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
                'El contenido de la página principal todavía no se ha proporcionado. Utilice el botón de edición para crearlo si es un administrador del portal.',
        },
        actions: {
            view_as_cards: 'Mostrar como tarjetas',
            view_as_list: 'Mostrar como lista',
            tree_drop_before: 'Antes de %{title}',
            tree_drop_after: 'Después de %{title}',
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
            },
        },
    },
    resources: {
        apis: {
            name: 'API |||| Las API',
            fields: {
                name: 'Nombre',
                portalStatus: 'Estado',
                accessStatus: 'Visibilidad',
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
            },
            portalStatus: {
                enabled: 'Activado',
                disabled: 'Desactivado',
                deprecated: 'Obsoleto',
                unpublished: 'Sin publicar',
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
                        applications: '%{smart_count} aplicaciones',
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
                        'Seleccione una aplicación para obtener la clave de la API.',
                },
            },
            documentation: {
                title: 'Documentación',
                fields: {
                    new_document: 'Nuevo documento',
                    select_documentation_locale: 'Idioma seleccionado',
                },
                actions: {
                    new_document_button: 'Nuevo elemento raíz',
                    new_child_document_button: 'Nuevo elemento secundario',
                    edit_document_button: 'Editar',
                    delete_document_button: 'Suprimir',
                },
                validation: {
                    error_no_special_characters:
                        'El URI solo debe contener caracteres no codificados. Admite letras de la a a la z y los separadores - y _.',
                    error_navtitle_not_unique: 'Este URI ya existe.',
                },
                confirm_delete_document_without_children:
                    'Está a punto de suprimir este documento. ¿Está seguro?',
                confirm_delete_document_with_children:
                    'Está a punto de suprimir este documento y sus documentos secundarios. ¿Está seguro?',
            },
        },
        applications: {
            name: 'Aplicación |||| Aplicaciones',
            fields: {
                name: 'Nombre',
                apiKey: 'Clave de la API:',
                keySecret: 'Secreto compartido:',
                apiKeyClientID: 'Clave de la API / ID de cliente',
                apisIncluded: 'API incluidas',
                authentication: 'Autenticación',
                description: 'Descripción',
                encrypted: 'Cifrado',
                sharedSecretClientSecret:
                    'Secreto compartido / Secreto de cliente',
                oauthType: 'Tipo de OAuth',
                oauthCallbackUrl:
                    'Dirección URL de la devolución de llamada de OAuth',
                oauthScope: 'Ámbito de OAuth',
                overview: 'Descripción general',
                status: 'Estado',
            },
            actions: {
                generateSecret: 'Generar nuevo secreto',
                copyNewSecret: 'Copiar secreto nuevo',
                plainTextSecret: 'Secreto de texto sin formato',
                hashedSecret: 'Secreto con hash',
                cancel: 'Cancelar',
                save: 'Publicar',
            },
            status: {
                enabled: 'Activado',
                disabled: 'Desactivado',
                deprecated: 'Obsoleto',
                unpublished: 'Sin publicar',
                rejected: 'Rechazado',
                application_pending_approval: 'Pendiente de aprobación',
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
                secret_generated_heading: 'Nuevo secreto generado',
                secret_generated_message:
                    'El texto del secreto solo será visible durante la sesión actual del explorador y se aplicará un algoritmo hash después de que se haya actualizado la página.',
                copy_secret_now: 'Copiar el secreto compartido ahora',
                copy_to_clipboard: 'Copiar al portapapeles',
                edit_overview: 'Editar la descripción general',
                empty_overview: 'No hay una descripción general',
            },
        },
        documents: {
            name: 'Documento |||| Documentos',
            fields: {
                title: 'Título',
                navtitle: 'URI',
                markdown: 'Contenido',
                modifyTs: 'Última modificación',
                ordinal: 'Posición',
            },
            actions: {
                change_document_parent_button: 'Cambiar elemento principal',
                move_as_first_child: 'Primer documento',
                move_after_document: 'Después de %{title}',
                move_as_root_item:
                    'Seleccionar para desplazarse al elemento raíz',
                save: 'Publicar',
                cancel: 'Cancelar',
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
        },
        registrations: {
            title: 'Crear una nueva cuenta',
            fields: {
                email: 'Correo electrónico',
                email_confirmation: 'Confirme el correo electrónico',
                organization: 'Organización o Espacio de Trabajo',
                organization_description: 'Descripción de la organización',
                robot: 'No soy un robot',
            },
            actions: {
                submit: 'submit',
                login: 'Ingresar a una cuenta existente',
                return_to_homepage: 'regresar a la página principal',
            },
            notifications: {
                confirmation_required: 'Se requiere confirmación',
                error: 'Hubo un problema al registrar su cuenta',
                confirmation_title: 'Consultar Su Correo Electrónico',
                confirmation:
                    'Registro recibido. Se enviará un correo electrónico de notificación a la dirección proporcionada.',
                email_confirmation_error: 'El email no coincide.',
                form_confirmation_error: 'Se requiere confirmación.',
            },
            slider: {
                confirmed: 'Confirmado',
                unconfirmed: 'Diapositiva para confirmar',
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
                change_password: 'Cambiar contraseña',
                cancel: 'Cancelar',
            },
            notifications: {
                profile_not_exist_error: 'Este perfil no existe',
                update_success: 'Perfil actualizado',
                update_error:
                    'Se ha producido un error al actualizar el perfil.',
                invalid_password: 'La contraseña actual no es válida.',
                confirm_password_change:
                    'Se ha restablecido la contraseña. Utilice la nueva contraseña para iniciar sesión.',
            },
            validation: {
                error_current_password_empty:
                    'Por favor, introduzca su contraseña actual',
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
    },
};

export default mergeTranslations(raMessages, apiHubMessages);
