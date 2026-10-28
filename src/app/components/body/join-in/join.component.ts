import { CommonModule } from "@angular/common";
import { ChangeDetectionStrategy, Component, computed, effect, inject, Injector, input, OnInit } from "@angular/core";
import { LanguageStore } from "../../../store/language/language.store";
import { ComponentAppStore } from "../../../store/component/component.store";
import { toSignal } from "@angular/core/rxjs-interop";
import { Block } from "../../../core/model/component-dto";

@Component({
  selector: "join",
  standalone: true,
  imports: [CommonModule],
  providers: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './join.component.html',
  styleUrl: './join.component.scss'
})
export class JoinInComponent {
    readonly blocks = input.required<Block[]>();

    readonly sectionTitle = computed(() => {
        const titleBlock = this.blocks().find(block => block.type === 'heading');
        return titleBlock?.content ?? '';
    });

    readonly offers = computed(() => {
        const allBlocks = this.blocks();
        const titleBlocks = allBlocks.filter(
            (block, index) => block.type === 'heading' && index > 0
        );

        const offerList = titleBlocks.map(titleBlock => {
            const titleIndex = allBlocks.indexOf(titleBlock);
            const descBlock = allBlocks[titleIndex + 1];
            const description = descBlock?.type === 'text' ? descBlock.content ?? '' : '';

            return {
                title: titleBlock.content ?? '',
                description,
            };
        });

        return offerList;
    });
}