import { CommonModule } from "@angular/common";
import { ChangeDetectionStrategy, Component, computed, effect, inject, OnInit, ViewEncapsulation } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { findBlockById } from "../../../core/utils/order-blocks.utils";
import { toSignal } from "@angular/core/rxjs-interop";
import { ComponentAppStore } from "../../../store/component/component.store";
import { map } from "rxjs";


@Component({
    selector: "services-detail",
    standalone: true,
    imports: [CommonModule],
    providers: [],
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
    templateUrl: './services-detail.component.html',
    styleUrls: ['./services-detail.component.scss']
})
export class ServicesDetailComponent {
    private readonly router = inject(Router);
    private readonly route = inject(ActivatedRoute);
    private readonly componentStore = inject(ComponentAppStore);

    private readonly servicePageSections = this.componentStore.getSectionsBySlug('page-service');

    private readonly serviceIdFromRoute = toSignal(
        this.route.params.pipe(
            map(params => params['id'] as string)
        )
    );

    readonly serviceBlock = computed(() => {
        const sections = this.servicePageSections();
        const serviceId = this.serviceIdFromRoute();

        if (sections.length === 0 || !serviceId) {
            return null;
        }

        for (const section of sections) {
            const found = findBlockById(section.blocks, serviceId);
            if (found) {
                return found;
            }
        }
        return null;
    });

    goBack(): void {
        this.router.navigate(['/']);
    }
}