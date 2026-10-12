import { ChangeDetectionStrategy, Component, effect, inject, OnInit, Type, untracked } from "@angular/core";
import { ComponentAppStore } from "../../store/component/component.store";
import { CommonModule } from "@angular/common";
import { COMPONENT_DICTIONARY } from "../../core/dictionary/component-dictionary";
import { PresentationComponent } from "./presentation/presentation.component";
import { LanguageStore } from "../../store/language/language.store";
import { HomeComponent } from "./home/home.component";

@Component({
  selector: "body-page",
  standalone: true,
  imports: [CommonModule, HomeComponent],
  providers: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './body-page.component.html',
  styleUrl: './body-page.component.scss'
})
export class BodyPageComponent {

  private componentStore = inject(ComponentAppStore);
  private readonly languageStore = inject(LanguageStore);

  readonly $loading = this.componentStore.$loading;

  constructor() {
    effect(() => {
      const langCode = this.languageStore.$selectedCodeLang();
      if (!langCode) return;

      untracked(() => {
        this.componentStore.loadPageBySlug({ slug: 'page-home', lang: langCode });
        this.componentStore.loadPageBySlug({ slug: 'page-contact', lang: langCode });
      });
    });
  }

  ngOnInit() {

  }

  getComponent(name: string): Type<any> | null {
    return COMPONENT_DICTIONARY[name]?.component ?? null;
    // return COMPONENT_DICTIONARY[name] ?? null;
    // getComponent(idx: number): Type<any> | null {
    //     return COMPONENT_DICTIONARY[idx] ?? null;
  }

  getDictionaryKey(name: string): string {
    return COMPONENT_DICTIONARY[name]?.key ?? name;
  }
}