
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AbstractApiService } from './abstract-api.service';
import { CommonModelResponse } from '../model/common-response-dto';
import { TagDataModel } from '../model/tags-dto';

@Injectable({
  providedIn: 'root',
})
export class TagService extends AbstractApiService {
  constructor() {
    super('/Tag');
  }

  getAllTags(): Observable<CommonModelResponse<TagDataModel>> {
    return this.get<CommonModelResponse<TagDataModel>>();
  }

  getTagById(id: number): Observable<TagDataModel> {
    if (id === null || id === undefined) {
      throw new Error('Missing required param: id');
    }

    return this.get<TagDataModel>(`/${id}`);
  }
}