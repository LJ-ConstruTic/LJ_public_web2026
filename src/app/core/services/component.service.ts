import { Injectable } from "@angular/core";
import { HttpParams } from "@angular/common/http";
import { AbstractApiService } from "./abstract-api.service";
import { Observable } from "rxjs";
import { BootstrapResponse, PageResponse } from "../model/component-dto";
import { LanguagesResponse } from "../model/language-dto";

@Injectable({
    providedIn: 'root'
})
export class ComponentService extends AbstractApiService {
    constructor() {
    super(''); // endpoints directos sobre la base
  }

  getBootstrap(lang: string, site = 'main'): Observable<BootstrapResponse> {
    const params = new HttpParams()
      .set('site', site)
      .set('lang', lang);
    return this.get<BootstrapResponse>('/site/bootstrap', { params });
  }

  getPageByRoute(route: string, lang: string, site = 'main'): Observable<PageResponse> {
    const params = new HttpParams()
      .set('site', site)
      .set('lang', lang)
      .set('route', route);
    return this.get<PageResponse>('/pages/by-route', { params });
  }

  getPageBySlug(slug: string, lang: string, site = 'main'): Observable<PageResponse> {
    const params = new HttpParams()
      .set('site', site)
      .set('lang', lang);
    return this.get<PageResponse>(`/pages/${encodeURIComponent(slug)}`, { params });
  }

  getLanguages(): Observable<LanguagesResponse> {
    return this.get<LanguagesResponse>('/languages');
  }
}
