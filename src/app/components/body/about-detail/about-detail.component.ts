import { ChangeDetectionStrategy, Component, computed, effect, inject, Injector, ViewEncapsulation } from "@angular/core";
import { TagStore } from "../../../store/tag/tag.store";
import { CommonModule } from "@angular/common";
import { LanguageStore } from "../../../store/language/language.store";
import { InternationalizationDataModel } from "../../../core/model/common-response-dto";
import { Router } from "@angular/router";
import { WeAreStore } from "../../../store/body/we-are.store";
import { ComponentAppStore } from "../../../store/component/component.store";
import { toObservable, toSignal } from "@angular/core/rxjs-interop";
import { JoinInComponent } from "../join-in/join.component";
import { filter, take } from "rxjs";

@Component({
  selector: "about-detail",
  standalone: true,
  imports: [CommonModule, JoinInComponent],
  providers: [WeAreStore],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  templateUrl: './about-detail.component.html',
  styleUrl: './about-detail.component.scss'
})
export class AboutDetailComponent {
  readonly tagStore = inject(TagStore);
  readonly weAreStore = inject(WeAreStore);
  readonly languageStore = inject(LanguageStore);
  private readonly componentStore = inject(ComponentAppStore);
  private readonly injector = inject(Injector);

  private readonly router = inject(Router);

  private readonly lang = computed(() => (this.languageStore.$selectedLanguage()?.tag ?? 'en') as keyof InternationalizationDataModel);

  private readonly items = toSignal(this.weAreStore.tags$, { initialValue: null });

  readonly about_detail = computed(() => {
    const lang = this.lang();
    const rawItems = this.items()?.items ?? [];

    const byOrder = (order: number) => rawItems.find((i) => i.order === order);

    const team = rawItems
      .filter((i) => /^WeAreName\d+$/.test(i.keys))
      .map((nameItem) => {
        const n = nameItem.keys.replace('WeAreName', '');
        return {
          name: nameItem.tag[lang] ?? '',
          img: nameItem.imgUrl[0] ?? null,
          job: rawItems.find((i) => i.keys === `WeAreJob${n}`)?.tag[lang] ?? '',
        };
      });

    return {
      historyTitle: byOrder(2)?.tag[lang] ?? '',
      historyImg: byOrder(2)?.imgUrl[0] ?? null,
      historyCtx2: byOrder(3)?.tag[lang] ?? '',
      historyCtx3: byOrder(4)?.tag[lang] ?? '',
      visionTitle: byOrder(5)?.tag[lang] ?? '',
      visionImg: byOrder(5)?.imgUrl[0] ?? null,
      visionCtx: byOrder(6)?.tag[lang] ?? '',
      missionTitle: byOrder(7)?.tag[lang] ?? '',
      missionImg: byOrder(7)?.imgUrl[0] ?? null,
      missionCtx: byOrder(8)?.tag[lang] ?? '',
      missionCtx2: byOrder(9)?.tag[lang] ?? '',
      teamTitle: byOrder(10)?.tag[lang] ?? '',
      team,
    };
  });

  ngOnInit(): void {
    effect(() => {
      const items = this.componentStore.$items();
      if (items.length === 0) return;

      const weAre = items.find((c) => c.idx === 3);
      if (weAre) {
        this.weAreStore.loadWeAreTags(weAre.id);
      }
    }, { injector: this.injector });
  }

  goBack(): void {
    this.router.navigate(['/']);
  }
}