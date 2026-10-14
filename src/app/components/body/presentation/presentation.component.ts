import { ChangeDetectionStrategy, Component, computed, effect, inject, Injector, input, OnInit, signal } from "@angular/core";
import { CarouselModule } from "primeng/carousel";
import { Block } from "../../../core/model/component-dto";


@Component({
  selector: "presentation",
  standalone: true,
  imports: [CarouselModule],
  providers: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './presentation.component.html',
  styleUrls: ['./presentation.component.scss']
})
export class PresentationComponent {

  readonly block = input.required<Block>();

  readonly carouselTitle = computed(() => {
    const title = this.block().content ?? '';
    return title;
  });

  readonly carouselSlides = computed(() => {
    const slides = [...this.block().children].sort(
      (slideA, slideB) => slideA.order - slideB.order
    );
    return slides;
  });

  readonly carouselImage = computed(() => {
    const mediaItems = this.block().media;
    const imageUrl = mediaItems.length > 0 ? mediaItems[0].url : null;
    return imageUrl;
  });

  goTo(index: number): void {
    // this.activeIndex.set(index);
  }

}