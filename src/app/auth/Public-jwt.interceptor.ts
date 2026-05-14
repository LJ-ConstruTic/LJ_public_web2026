// src/app/auth/public-jwt.interceptor.ts

import {
  HttpContextToken,
  HttpErrorResponse,
  HttpInterceptorFn
} from '@angular/common/http';

import { inject } from '@angular/core';
import { catchError, switchMap, throwError } from 'rxjs';

import { AuthService } from './AuthService';
import { ApiStatusService } from './Api-status.service';

export const SKIP_AUTH = new HttpContextToken<boolean>(() => false);
export const RETRIED_AUTH = new HttpContextToken<boolean>(() => false);

export const publicJwtInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const apiStatus = inject(ApiStatusService);

  if (req.context.get(SKIP_AUTH)) {
    return next(req).pipe(
      catchError((error: HttpErrorResponse) => {
        apiStatus.setUnavailable();
        return throwError(() => error);
      })
    );
  }

  const token = authService.getAccessToken();

  const requestWithToken = token
    ? req.clone({
        setHeaders: {
          Authorization: 'Bearer ' + token
        }
      })
    : req;

  return next(requestWithToken).pipe(
    catchError((error: HttpErrorResponse) => {
      const alreadyRetried = req.context.get(RETRIED_AUTH);

      if (alreadyRetried) {
        apiStatus.setUnavailable();
        return throwError(() => error);
      }

      if (error.status === 0) {
        apiStatus.setUnavailable();
        return throwError(() => error);
      }

      if (error.status !== 401 && error.status !== 403) {
        return throwError(() => error);
      }

      return authService.refreshToken().pipe(
        switchMap(response => {
          apiStatus.setOk();

          const retryRequest = req.clone({
            context: req.context.set(RETRIED_AUTH, true),
            setHeaders: {
              Authorization: 'Bearer ' + response.accessToken
            }
          });

          return next(retryRequest);
        }),
        catchError(refreshError => {
          authService.clearSession();
          apiStatus.setUnavailable();

          return throwError(() => refreshError);
        })
      );
    })
  );
};