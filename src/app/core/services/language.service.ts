import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { LanguageDataModel } from '../model/language-dto';
import { CommonModelResponse } from '../model/common-response-dto';
import { AbstractApiService } from './abstract-api.service';

@Injectable({
  providedIn: 'root'
})
export class LanguageService extends AbstractApiService {
  constructor() {
    super('/Language');
  }

  getAllLanguages(): Observable<CommonModelResponse<LanguageDataModel>> {
    return this.get<CommonModelResponse<LanguageDataModel>>();
  }

  getLanguageById(id: number): Observable<LanguageDataModel> {
    if (id === null || id === undefined) {
      throw new Error('Missing required param: id');
    }

    return this.get<LanguageDataModel>(`/${encodeURIComponent(String(id))}`);
  }
}
