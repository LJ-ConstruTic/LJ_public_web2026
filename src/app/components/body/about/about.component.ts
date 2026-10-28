import { ChangeDetectionStrategy, Component, computed, inject, input, OnInit, ViewEncapsulation } from "@angular/core";
import { CommonModule } from "@angular/common";
import { Router } from "@angular/router";
import { LanguageStore } from "../../../store/language/language.store";
import { BoldPipe } from "../../../../utils/pipes/bold.pipe";
import { ComponentAppStore } from "../../../store/component/component.store";
import { toSignal } from "@angular/core/rxjs-interop";
import { Block } from "../../../core/model/component-dto";
import { extractFirstMediaUrl } from "../../../core/utils/extract-img.utils";

@Component({
  selector: "about",
  standalone: true,
  imports: [CommonModule, BoldPipe],
  providers: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  templateUrl: './about.component.html',
  styleUrl: './about.component.scss'
})
export class AboutComponent {
  readonly block = input.required<Block>();

  readonly router = inject(Router);

  readonly aboutImage = computed(() => {
    const mediaItems = this.block().media;
    const imageUrl = mediaItems.length > 0 ? mediaItems[0].url : null;
    return imageUrl;
  });

  readonly aboutTextChildren = computed(() => {
    const children = this.block().children.filter(
      child => child.type === 'text'
    );
    return children;
  });

  readonly aboutImageUrl = computed(() => {
    const mediaItems = this.block().media;
    if (mediaItems.length === 0) return null;
    const url = extractFirstMediaUrl(mediaItems[0].url);
    return url;
  });

  readonly buttonMoreText = computed(() => {
    const children = this.block().children;
    const buttonChild = children.find(child => child.key === 'button-more');
    return buttonChild?.content ?? '';
  });


  goToAboutDetail(): void {
    this.router.navigate(['about/about-detail']);
  }
}