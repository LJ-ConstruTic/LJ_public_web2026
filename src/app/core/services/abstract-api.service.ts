import { inject } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { API_BASE_URL } from '../../../api.tokens';
import { Observable } from 'rxjs';

export abstract class AbstractApiService {
  protected readonly http = inject(HttpClient);
  protected readonly baseUrl = inject(API_BASE_URL);

  protected readonly resource: string;

  constructor(endpoint: string) {
    this.resource = `${this.baseUrl}${endpoint}`;
  }

  protected get<T>(url: string = '', options?: {
      headers?: HttpHeaders | { [header: string]: string | string[] };
      params?: HttpParams | {
        [param: string]: string | number | boolean | readonly (string | number | boolean)[];
      };
    }
  ): Observable<T> {
    return this.http.get<T>(`${this.resource}${url}`, options);
  }

  protected post<T>(
    url: string = '',
    body?: unknown,
    options?: {
      headers?: HttpHeaders | { [header: string]: string | string[] };
      params?: HttpParams | {
        [param: string]: string | number | boolean | readonly (string | number | boolean)[];
      };
    }
  ): Observable<T> {
    return this.http.post<T>(`${this.resource}${url}`, body, options);
  }

  protected put<T>(url: string = '', body?: unknown, options?: {
      headers?: HttpHeaders | { [header: string]: string | string[] };
      params?: HttpParams | {
        [param: string]: string | number | boolean | readonly (string | number | boolean)[];
      };
    }
  ): Observable<T> {
    return this.http.put<T>(`${this.resource}${url}`, body, options);
  }

  protected delete<T>(url: string = '', options?: {
      headers?: HttpHeaders | { [header: string]: string | string[] };
      params?: HttpParams | {
        [param: string]: string | number | boolean | readonly (string | number | boolean)[];
      };
    }
  ): Observable<T> {
    return this.http.delete<T>(`${this.resource}${url}`, options);
  }
}
