import { SectionPage, SiteInfo } from "../../core/model/component-dto";

export interface ComponentState {
  site: SiteInfo | null;
  globalSections: SectionPage[];
  pageSectionsBySlug: Record<string, SectionPage[]>;
  loading: boolean;
  error: string | null;
}

export const initialComponentState: ComponentState = {
  site: null,
  globalSections: [],
  pageSectionsBySlug: {},
  loading: false,
  error: null,
};