import { CommonModule } from "@angular/common";
import { ChangeDetectionStrategy, Component, computed, effect, inject, Injector, input } from "@angular/core";
import { Block } from "../../../core/model/component-dto";

@Component({
    selector: "team",
    standalone: true,
    imports: [CommonModule],
    providers: [],
    changeDetection: ChangeDetectionStrategy.OnPush,
    templateUrl: './team.component.html',
    styleUrls: ['./team.component.scss']
})
export class TeamComponent {
    readonly blocks = input.required<Block[]>();

    readonly members = computed(() => {
        return this.blocks().map(block => ({
            id: block.id,
            name: block.content ?? '',
            image: block.media.length > 0 ? block.media[0].url : null,
        }));
    });
}
