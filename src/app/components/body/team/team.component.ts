import { CommonModule } from "@angular/common";
import { ChangeDetectionStrategy, Component, computed, effect, inject, Injector, input } from "@angular/core";
import { Block } from "../../../core/model/component-dto";
import { TeamHeader, TeamMember } from "../../../core/model/team-dto";

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
    readonly header = input.required<TeamHeader>();
    readonly members = input.required<TeamMember[]>();

    constructor() {
        effect(() => {
            console.log('[TeamComponent] header recibido:', this.header());
            console.log('[TeamComponent] miembros recibidos:', this.members().length);
        });
    }
}
