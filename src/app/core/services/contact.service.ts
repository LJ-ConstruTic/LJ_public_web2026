import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AbstractApiService } from './abstract-api.service';
import { ContactDetail, CreateContactRequest, CreateContactResponse, GetAllContactsResponse } from '../model/contact-dto';

@Injectable({
  providedIn: 'root',
})
export class ContactService extends AbstractApiService {

  constructor() {
    super('/Contact');
  }

  create(payload: CreateContactRequest): Observable<CreateContactResponse> {
    return this.post<CreateContactResponse>('', payload);
  }
}