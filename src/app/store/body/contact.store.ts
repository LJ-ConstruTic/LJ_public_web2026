import { ComponentStore } from "@ngrx/component-store";
import { ContactState, initialContactState } from "./contact.state";
import { ContactService } from "../../core/services/contact.service";
import { computed, inject, Injectable } from "@angular/core";
import { catchError, EMPTY, switchMap, tap } from "rxjs";
import { ContactRequest } from "../../core/model/contact-dto";
import { ApiErrorDetail } from "../../core/model/error-dto";

@Injectable()
export class ContactStore extends ComponentStore<ContactState> {
    private readonly contactService = inject(ContactService);

    readonly $sending = this.selectSignal(state => state.sending);
    readonly $sent = this.selectSignal(state => state.sent);
    readonly $requestId = this.selectSignal(state => state.requestId);
    readonly $errorCode = this.selectSignal(state => state.errorCode);
    readonly $errorMessage = this.selectSignal(state => state.errorMessage);

    readonly $hasError = computed(() => this.$errorCode() !== null);

    readonly $isCaptchaError = computed(() => {
        const code = this.$errorCode();
        return code === 'CAPTCHA_INVALID' || code === 'CAPTCHA_REQUIRED';
    });

    constructor() {
        super(initialContactState);
    }

    // --- Updaters ---
    private readonly setSending = this.updater<boolean>((state, sending) => {
        console.log('[ContactStore] state change — sending:', sending);
        return { ...state, sending };
    });

    private readonly setSent = this.updater<boolean>((state, sent) => {
        console.log('[ContactStore] state change — sent:', sent);
        return { ...state, sent };
    });

    private readonly setRequestId = this.updater<string | null>((state, requestId) => {
        console.log('[ContactStore] state change — requestId:', requestId);
        return { ...state, requestId };
    });

    private readonly setErrorFromResponse = this.updater<{code: string | null; message: string | null;}>((state, error) => {
        console.log('[ContactStore] state change — error:', error.code, error.message);
        return {
            ...state,
            errorCode: error.code,
            errorMessage: error.message,
        };
    });

    private readonly clearError = this.updater((state) => {
        console.log('[ContactStore] state change — clearing error');
        return { ...state, errorCode: null, errorMessage: null };
    });

    // Resetear todo el estado (después de envío exitoso y el usuario quiere enviar otro)
    readonly resetState = this.updater(() => {
        console.log('[ContactStore] state change — full reset');
        return initialContactState;
    });

    // --- Effects ---
    readonly submitContactForm = this.effect<ContactRequest>((payload$) =>
        payload$.pipe(
            // 1. Arranca el envío: poner sending=true, limpiar errores previos
            tap((payload) => {
                console.log('[ContactStore] submit — starting, payload:', {
                    name: payload.name,
                    email: payload.email,
                    hasPhone: !!payload.phone,
                    messageLength: payload.message.length,
                    hasToken: !!payload.captchaToken,
                });
                this.setSending(true);
                this.clearError();
            }),

            // 2. Llamar al servicio
            switchMap((payload) =>
                this.contactService.submit(payload).pipe(
                    // 3a. Éxito (202)
                    tap((response) => {
                        console.log('[ContactStore] submit — success, response:', response);
                        this.setSending(false);
                        this.setSent(true);
                        this.setRequestId(response.requestId);
                    }),

                    // 3b. Error — aquí es donde distinguimos cada caso
                    catchError((error: ApiErrorDetail) => {
                        console.error('[ContactStore] submit — error:', error);
                        this.setSending(false);

                        const userFacingMessage = this.resolveErrorMessage(error);
                        this.setErrorFromResponse({
                            code: error.code,
                            message: userFacingMessage,
                        });

                        // Guardar requestId del error si viene, para soporte
                        if (error.requestId) {
                            this.setRequestId(error.requestId);
                        }

                        return EMPTY;
                    })
                )
            )
        )
    );

    // Traduce el código de error de la API a un mensaje para el usuario
    private resolveErrorMessage(error: ApiErrorDetail): string {
        console.log('[ContactStore] resolving message for error code:', error.code, 'status:', error.status);

        switch (error.status) {
            case 429:
                return 'Has alcanzado el límite temporal. Espera antes de volver a enviar.';
            case 413:
                return 'El formulario es demasiado grande. Reduce el mensaje.';
            default:
                break;
        }

        switch (error.code) {
            case 'CAPTCHA_REQUIRED':
                return 'Completa la verificación antes de enviar.';
            case 'CAPTCHA_INVALID':
                return 'La verificación ha fallado. Inténtalo de nuevo.';
            case 'INVALID_CONTACT_REQUEST':
            case 'INVALID_REQUEST':
                return 'Revisa los campos del formulario.';
            default:
                return 'No se pudo completar la solicitud. Conservamos tus datos.';
        }
    }
}