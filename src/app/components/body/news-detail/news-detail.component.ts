import { ChangeDetectionStrategy, Component, effect, inject, Injector, OnInit } from "@angular/core";
import { GetComponentTagsStore } from "../../../store/body/tagsByComponent.store";
import { LanguageStore } from "../../../store/language/language.store";
import { ComponentAppStore } from "../../../store/component/component.store";
import { Router } from "express";
import { CommonModule } from "@angular/common";

@Component({
  selector: "news-detail",
  standalone: true,
  imports: [CommonModule],
  providers: [GetComponentTagsStore],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './news-detail.component.html',
  styleUrl: './news-detail.component.scss'
})
export class NewsDetailComponent implements OnInit {
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

    goBack(): void {
        this.router.navigate(['/']);
    }
}