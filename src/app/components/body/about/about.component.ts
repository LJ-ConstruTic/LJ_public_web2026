import { ChangeDetectionStrategy, Component, computed, inject, ViewEncapsulation } from "@angular/core";
import { TagStore } from "../../../store/tag/tag.store";
import { CommonModule } from "@angular/common";
import { Router } from "@angular/router";
import { TAGS_DICTIONARY } from "../../../core/dictionary/tags-dictionary";

@Component({
  selector: "about",
  standalone: true,
  imports: [ CommonModule ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  templateUrl: './about.component.html',
  styleUrl: './about.component.scss'
})
export class AboutComponent {
  readonly tagStore = inject(TagStore);
  private readonly router = inject(Router);

  readonly weAreImgUrl = computed(() =>
    this.tagStore.$tagByKey(TAGS_DICTIONARY.HEAD_WE_ARE)()?.internationalization.imgUrl[0] ?? null
  );

  goToAboutDetail(): void {
    this.router.navigate(['about/about-detail']);
  }
}