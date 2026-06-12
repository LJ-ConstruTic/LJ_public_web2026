import { ChangeDetectionStrategy, Component, computed, effect, inject, Injector, ViewEncapsulation } from "@angular/core";
import { TagStore } from "../../../store/tag/tag.store";
import { CommonModule } from "@angular/common";
import { LanguageStore } from "../../../store/language/language.store";
import { InternationalizationDataModel } from "../../../core/model/common-response-dto";
import { Router } from "@angular/router";
import { ComponentAppStore } from "../../../store/component/component.store";
import { toSignal } from "@angular/core/rxjs-interop";
import { JoinInComponent } from "../join-in/join.component";
import { AboutSection, TeamMember } from "../../../core/model/about-detail-dto";
import { GetComponentTagsStore } from "../../../store/body/tagsByComponent.store";

@Component({
  selector: "about-detail",
  standalone: true,
  imports: [CommonModule, JoinInComponent],
  providers: [GetComponentTagsStore],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  templateUrl: './about-detail.component.html',
  styleUrl: './about-detail.component.scss'
})
export class AboutDetailComponent {
  readonly tagStore = inject(TagStore);
  readonly weAreStore = inject(GetComponentTagsStore);
  readonly languageStore = inject(LanguageStore);
  private readonly componentStore = inject(ComponentAppStore);
  private readonly injector = inject(Injector);

  private readonly router = inject(Router);

  private readonly lang = computed(() => (this.languageStore.$selectedLanguage()?.tag ?? 'en') as keyof InternationalizationDataModel);

  private readonly items = toSignal(this.weAreStore.tags$, { initialValue: null });

  readonly sections = computed<AboutSection[]>(() => {
    const lang = this.lang();
    const rawItems = this.items()?.items ?? [];

    const sectionItems = rawItems.filter(
      (i) => i.order >= 2 && !/^WeAre(Name|Job)\d+$/.test(i.keys)
    );

    const result: AboutSection[] = [];
    let current: AboutSection | null = null;

    for (const item of sectionItems) {
      const text = item.tag[lang] ?? item.tag['pt'] ?? '';
      // Es título de sección si NO contiene "Context" en su key
      const isSectionTitle = !item.keys.toLowerCase().includes('context');

      if (isSectionTitle) {
        if (current) result.push(current);
        current = {
          title: text,
          img: item.imgUrl?.[0] ?? null,
          paragraphs: [],
        };
      } else if (current) {
        current.paragraphs.push(text);
      }
    }

    if (current) result.push(current);
    return result;
  });

  readonly teamSection = computed(() => {
    const lang = this.lang();
    const rawItems = this.items()?.items ?? [];

    const teamTitle = rawItems.find((i) => i.keys === 'weJobwe')?.tag[lang] ?? '';

    const members: TeamMember[] = rawItems
      .filter((i) => /^WeAreName\d+$/.test(i.keys))
      .map((nameItem) => {
        const n = nameItem.keys.replace('WeAreName', '');
        return {
          name: nameItem.tag[lang] ?? '',
          img: nameItem.imgUrl[0] ?? null,
          job: rawItems.find((i) => i.keys === `WeAreJob${n}`)?.tag[lang] ?? '',
        };
      });

    return { teamTitle, members };
  });

  ngOnInit(): void {
    effect(() => {
      const items = this.componentStore.$items();
      if (items.length === 0) return;

      const weAre = items.find((c) => c.idx === 3);
      if (weAre) {
        this.weAreStore.loadComponentTags(weAre.id);
      }
    }, { injector: this.injector });
  }

  goBack(): void {
    this.router.navigate(['/']);
  }
}