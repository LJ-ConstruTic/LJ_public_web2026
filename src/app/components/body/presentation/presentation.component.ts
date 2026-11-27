import { ChangeDetectionStrategy, Component, computed, effect, inject, input, untracked } from "@angular/core";
import { CarouselModule } from "primeng/carousel";
import { Block } from "../../../core/model/component-dto";
import { LanguageStore } from "../../../store/language/language.store";
import { ComponentAppStore } from "../../../store/component/component.store";
import { PresentationSlide } from "../../../core/model/slide-dto";

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
  readonly slides = input<PresentationSlide[]>([]);

  private readonly prefersReducedMotion =
    typeof window === 'undefined' || window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  readonly autoplayInterval = computed(() =>
    this.slides().length > 1 && !this.prefersReducedMotion ? 5500 : 0
  );
}
