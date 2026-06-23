// import { Injectable } from "@angular/core";
// import { AbstractApiService } from "./abstract-api.service";
// import { Observable } from "rxjs";
// import { GroupDetail } from "../model/group-details-dto";
// import { HttpParams } from "@angular/common/http";


// @Injectable({
//   providedIn: 'root',
// })
// export class GroupDetailsService extends AbstractApiService {

//   constructor() {
//     super('/GroupDetails');
//   }

//   getById(id: string, codeLanguage: number = 0): Observable<GroupDetail> {
//     const params = new HttpParams()
//       .set('id', id)
//       .set('codeLanguage', codeLanguage);

//     return this.get<GroupDetail>('/ById', { params });
//   }
// }