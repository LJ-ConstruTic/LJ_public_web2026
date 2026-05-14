import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpContext, HttpContextToken } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
//import { API_BASE_URL } from '../core/tokens/api-base-url.token';
import { API_BASE_URL } from '../../api.tokens';

import { AuthStorageService } from './Auth-storage.service';

export const SKIP_AUTH = new HttpContextToken<boolean>(() => false);

export interface BackgroundAuthResponse {
  success: boolean;
  accessToken: string;
  refreshToken: string;
  tokenType?: string;
  expiresInMinutes?: number;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private http = inject(HttpClient);
  private storage = inject(AuthStorageService);
  private apiUrl = inject(API_BASE_URL);

  private readonly accessTokenKey = 'public_access_token';
  private readonly refreshTokenKey = 'public_refresh_token';

  startPublicSession(): Observable<BackgroundAuthResponse> {
    return this.http.post<BackgroundAuthResponse>(
      `${this.apiUrl}/Login`,
      {},
      {
        context: new HttpContext().set(SKIP_AUTH, true)
      }
    ).pipe(
      tap(response => {
        this.saveTokens(
          response.accessToken,
          response.refreshToken
        );
      })
    );
  }

  refreshToken(): Observable<BackgroundAuthResponse> {
    const refreshToken = this.getRefreshToken();

    if (!refreshToken) {
      return this.startPublicSession();
    }

    return this.http.post<BackgroundAuthResponse>(
      `${this.apiUrl}/Refresh`,
      {
        refreshToken: refreshToken
      },
      {
        context: new HttpContext().set(SKIP_AUTH, true)
      }
    ).pipe(
      tap(response => {
        this.saveTokens(
          response.accessToken,
          response.refreshToken
        );
      })
    );
  }

  getAccessToken(): string | null {
    return this.storage.get(this.accessTokenKey);
  }

  getRefreshToken(): string | null {
    return this.storage.get(this.refreshTokenKey);
  }

  saveTokens(accessToken: string, refreshToken: string): void {
    this.storage.set(this.accessTokenKey, accessToken);
    this.storage.set(this.refreshTokenKey, refreshToken);
  }

  clearSession(): void {
    this.storage.remove(this.accessTokenKey);
    this.storage.remove(this.refreshTokenKey);
  }
}