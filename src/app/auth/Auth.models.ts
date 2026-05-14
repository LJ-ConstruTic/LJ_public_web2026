export interface PublicAuthResponse {

  success: boolean;

  accessToken: string;

  refreshToken: string;

  tokenType?: string;

  expiresInMinutes?: number;

}