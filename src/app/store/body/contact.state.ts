export interface ContactState {
  sending: boolean;
  sent: boolean;
  requestId: string | null;    // referencia del 202 para soporte
  errorCode: string | null;    // 'CAPTCHA_INVALID', 'CONTACT_RATE_LIMITED', etc.
  errorMessage: string | null; // mensaje legible para el usuario
}

export const initialContactState: ContactState = {
  sending: false,
  sent: false,
  requestId: null,
  errorCode: null,
  errorMessage: null,
};