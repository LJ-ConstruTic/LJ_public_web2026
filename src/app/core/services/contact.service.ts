import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AbstractApiService } from './abstract-api.service';
import { ContactRequest, ContactResponse } from '../model/contact-dto';

@Injectable({
  providedIn: 'root',
})
export class ContactService extends AbstractApiService {

  constructor() {
    super('');
  }

  submit(body: ContactRequest): Observable<ContactResponse> {
    return this.post<ContactResponse>('/contact-requests', body);
  }
}