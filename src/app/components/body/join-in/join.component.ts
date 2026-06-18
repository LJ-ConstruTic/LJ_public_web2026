import { CommonModule } from "@angular/common";
import { ChangeDetectionStrategy, Component, computed, effect, inject, Injector, OnInit } from "@angular/core";
import { TagKey, TAGS_DICTIONARY } from "../../../core/dictionary/tags-dictionary";
import { LanguageStore } from "../../../store/language/language.store";
import { InternationalizationDataModel } from "../../../core/model/common-response-dto";
import { ComponentAppStore } from "../../../store/component/component.store";
import { GetComponentTagsStore } from "../../../store/body/tagsByComponent.store";
import { toSignal } from "@angular/core/rxjs-interop";

@Component({
  selector: "join",
  standalone: true,
  imports: [CommonModule],
  providers: [GetComponentTagsStore],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './join.component.html',
  styleUrl: './join.component.scss'
})
export class JoinInComponent implements OnInit {
  readonly joinInStore = inject(GetComponentTagsStore);
  readonly languageStore = inject(LanguageStore);
  readonly componentStore = inject(ComponentAppStore);
  private readonly injector = inject(Injector);

  private readonly lang = computed(
    () => (this.languageStore.$selectedLanguage()?.tag ?? 'en') as keyof InternationalizationDataModel
  );

  private readonly items = toSignal(this.joinInStore.tags$, { initialValue: null });

  readonly data = computed(() => {
    const lang = this.lang();
    const rawItems = this.items()?.items ?? [];

    const titles = rawItems.filter((i) => i.tagHtml === 'h2');

    const offers = titles.map((titleItem) => {
      const n = titleItem.keys.replace('JoinTitle', '');
      return {
        title: titleItem.tag[lang] ?? '',
        desc: rawItems.find((i) => i.keys === `JoinDesc0${n}`)?.tag[lang] ?? '',
      };
    }).filter((o) => o.title);

    return { offers };
  });

  ngOnInit(): void {
    effect(() => {
      const items = this.componentStore.$items();
      if (items.length === 0) return;

      const joinTags = items.find((component) => component.idx === 7);
      if (joinTags) {
        this.joinInStore.loadComponentTags(joinTags.id);
      }
    }, { injector: this.injector });
  }
}