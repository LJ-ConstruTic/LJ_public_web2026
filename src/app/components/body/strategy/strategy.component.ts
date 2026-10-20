import { CommonModule } from "@angular/common";

import { ChangeDetectionStrategy, Component, computed, input, ViewEncapsulation } from "@angular/core";
import { Block } from "../../../core/model/component-dto";

@Component({
  selector: "strategy",
  standalone: true,
  imports: [CommonModule],
  providers: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  templateUrl: './strategy.component.html',
  styleUrl: './strategy.component.scss'
})
export class StrategyComponent {
  readonly block = input.required<Block>();

  readonly strategyTitle = computed(() => {
    return this.block().content ?? '';
  });

  readonly strategyImage = computed(() => {
    const url = this.block().media.length > 0 ? this.block().media[0].url : null;
    return url;
  });

  readonly strategyTexts = computed(() => {
    const texts = this.block().children.filter(child => child.type === 'text');
    return texts;
  });

}