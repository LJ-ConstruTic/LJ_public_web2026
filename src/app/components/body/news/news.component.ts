import { CommonModule } from "@angular/common";
import { ChangeDetectionStrategy, Component, computed, effect, inject, Injector, OnInit } from "@angular/core";
import { TagKey, TAGS_DICTIONARY } from "../../../core/dictionary/tags-dictionary";
import { LanguageStore } from "../../../store/language/language.store";
import { InternationalizationDataModel } from "../../../core/model/common-response-dto";
import { ComponentAppStore } from "../../../store/component/component.store";
import { GetComponentTagsStore } from "../../../store/body/tagsByComponent.store";
import { toSignal } from "@angular/core/rxjs-interop";
import { Router } from "@angular/router";
import { CardModule } from "primeng/card";

@Component({
  selector: "news",
  standalone: true,
  imports: [CommonModule, CardModule],
  providers: [GetComponentTagsStore],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './news.component.html',
  styleUrl: './news.component.scss'
})
export class NewsComponent implements OnInit {
  readonly newsStore = inject(GetComponentTagsStore);
  readonly languageStore = inject(LanguageStore);
  readonly componentStore = inject(ComponentAppStore);
  readonly router = inject(Router);
  private readonly injector = inject(Injector);

  ngOnInit(): void {
    // effect(() => {
    //   const items = this.componentStore.$items();
    //   if (items.length === 0) return;

    //   const joinTags = items.find((component) => component.idx === 15);
    //   if (joinTags) {
    //     this.newsStore.loadComponentTags(joinTags.id);
    //   }
    // }, { injector: this.injector });
  }

    goToNews(): void {
    this.router.navigate(['news/news-detail']);
  }
}