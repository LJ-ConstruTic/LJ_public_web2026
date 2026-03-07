import { InternationalizationDataModel } from "./common-response-dto";

export interface ComponentDataModel {
    id: string;
    idx: number;
    createdAt: string;
    updatedAt: string;
    isActive: boolean;
    name: string;
    description: string;
}

export interface ComponentLanguageTagItem {
    keyLabel: string;
    tagId: number;
    tagIdx: number;
    tag: string;
    imgUrl: string[];
}

export interface ComponentTagsByLanguage {
    componentId: string;
    componentName: string;
    idx: number;
    language: string;
    items: ComponentLanguageTagItem[];
}

export interface ComponentTagDescriptionItem {
    tagId: string;
    keyLabel: string;
    order: number;
    tag: InternationalizationDataModel;
    imgUrl: string[];
}

export interface ComponentTagsDescription {
    componentId: string;
    componentName: string;
    idx: number;
    items: ComponentTagDescriptionItem[];
}

export interface ComponentMenuParentTag {
    id: string;
    idx: number;
    order: number;
    key: string;
    tag: string;
    imgUrl: string[];
}

export interface ComponentMenuItem {
    id: string;
    idx: number;
    order: number;
    key: string;
    tag: string;
    language: string;
    imgUrl: string[];
    tagsParent: ComponentMenuParentTag[];
}