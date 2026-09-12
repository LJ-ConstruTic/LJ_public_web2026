export interface ContactRequest {
  name: string;
  email: string;
  message: string;
  phone?: string;
  website: string;
  captchaToken: string;
}

export interface ContactResponse {
  requestId: string;
  status: string;
  createdAt?: string;
  message?: string;
}