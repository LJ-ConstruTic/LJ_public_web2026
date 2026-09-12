export interface ApiError {
  error: {
    code: string;
    message: string;
    requestId: string;
    details: unknown[];
  };
}

export interface ApiErrorDetail {
  status: number;
  code: string;
  message: string;
  requestId: string | null;
  details: unknown[];
}