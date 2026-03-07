import { Injectable } from "@angular/core";
import { HttpParams } from "@angular/common/http";
import { Observable } from "rxjs";
import { ComponentDataModel, ComponentMenuItem, ComponentTagsByLanguage, ComponentTagsDescription } from "../model/component-dto";
import { CommonModelResponse } from "../model/common-response-dto";
import { AbstractApiService } from "./abstract-api.service";

@Injectable({
    providedIn: 'root'
})
export class ComponentService extends AbstractApiService{
    constructor() {
        super('/Component');
    }

    getAllComponents(): Observable<CommonModelResponse<ComponentDataModel>> {
        return this.get<CommonModelResponse<ComponentDataModel>>();
    }

    getComponentById(id: number): Observable<ComponentDataModel> {
        if (!id) throw new Error('Missing required param: id');

        return this.get<ComponentDataModel>(`/${id}`);
    }

    getComponentTagsByLanguage(idComponent: string, codeLanguage: number): Observable<ComponentTagsByLanguage> {
        if (!idComponent) throw new Error('Missing required param: idComponent');

        if (!codeLanguage) throw new Error('Missing required param: codeLanguage');

        const params = new HttpParams()
            .set('idComponent', idComponent)
            .set('codeLanguage', String(codeLanguage));

        return this.get<ComponentTagsByLanguage>(`/tags/Language`, { params });
    }

    getTagsByComponentId(componentId: string): Observable<ComponentTagsDescription> {
        if (!componentId) throw new Error('Missing required param: componentId');

        return this.get<ComponentTagsDescription>(`/tags/${encodeURIComponent(componentId)}`
        );
    }

    getComponentMenu(codeLanguage: number): Observable<CommonModelResponse<ComponentMenuItem>> {
        if (codeLanguage === null || codeLanguage === undefined) {
            throw new Error('Missing required param: codeLanguage');
        }

        const params = new HttpParams().set('codeLanguage', String(codeLanguage));

        return this.get<CommonModelResponse<ComponentMenuItem>>(`/menu`,{ params });
    }
}
