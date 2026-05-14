// src/app/auth/public-jwt.interceptor.ts

import {
  HttpErrorResponse,
  HttpInterceptorFn,
  HttpRequest,
  HttpHandlerFn,
  HttpContextToken
} from '@angular/common/http';

import { inject } from '@angular/core';

import {
  catchError,
  switchMap,
  throwError,
  Observable
} from 'rxjs';

import { AuthService } from './AuthService';


// ======================================================
// TOKEN PARA IGNORAR AUTH EN PETICIONES ESPECIFICAS
// ======================================================

export const SKIP_AUTH =
  new HttpContextToken<boolean>(() => false);


// ======================================================
// INTERCEPTOR JWT PUBLICO
// ======================================================

export const publicJwtInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);

  if (req.context.get(SKIP_AUTH)) {
    return next(req);
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
      if (error.status !== 401) {
        return throwError(() => error);
      }

      return authService.refreshToken().pipe(
        switchMap(response => {
          const retryRequest = req.clone({
            setHeaders: {
              Authorization: 'Bearer ' + response.accessToken
            }
          });

          return next(retryRequest);
        }),

        catchError(() => {
          authService.clearSession();

          return authService.startPublicSession().pipe(
            switchMap(response => {
              const retryRequest = req.clone({
                setHeaders: {
                  Authorization: 'Bearer ' + response.accessToken
                }
              });

              return next(retryRequest);
            }),

            catchError(finalError => {
              return throwError(() => finalError);
            })
          );
        })
      );
    })
  );
};