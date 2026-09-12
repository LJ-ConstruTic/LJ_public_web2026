import { SectionPage, SiteInfo } from "../../core/model/component-dto";


export interface ComponentState {
  site: SiteInfo | null;
  globalSections: SectionPage[];  // header, menu, footer del bootstrap
  pageSections: SectionPage[];    // secciones de la página actual
  loading: boolean;
  error: string | null;
}

export const initialComponentState: ComponentState = {
  site: null,
  globalSections: [],
  pageSections: [],
  loading: false,
  error: null,
};