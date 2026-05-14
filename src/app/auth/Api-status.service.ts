// src/app/core/services/api-status.service.ts

import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export type ApiStatus = 'OK' | 'CONNECTING' | 'UNAVAILABLE';

@Injectable({ providedIn: 'root' })
export class ApiStatusService {
  private statusSubject = new BehaviorSubject<ApiStatus>('CONNECTING');

  status$ = this.statusSubject.asObservable();

  setOk(): void {
    this.statusSubject.next('OK');
  }

  setUnavailable(): void {
    this.statusSubject.next('UNAVAILABLE');
  }

  setConnecting(): void {
    this.statusSubject.next('CONNECTING');
  }
}