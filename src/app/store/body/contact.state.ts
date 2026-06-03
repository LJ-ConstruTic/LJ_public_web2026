export interface ContactState {
  sending: boolean;
  sent: boolean;
  error: string | null;
}

export const initialContactState: ContactState = {
  sending: false,
  sent: false,
  error: null,
};