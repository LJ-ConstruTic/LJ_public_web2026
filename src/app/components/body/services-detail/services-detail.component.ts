import { CommonModule } from "@angular/common";
import { ChangeDetectionStrategy, Component, computed, effect, inject, OnInit, untracked, ViewEncapsulation } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { findBlockById } from "../../../core/utils/order-blocks.utils";
import { toSignal } from "@angular/core/rxjs-interop";
import { ComponentAppStore } from "../../../store/component/component.store";
import { map } from "rxjs";
import { TranslateModule } from "@ngx-translate/core";
import { LanguageStore } from "../../../store/language/language.store";


@Component({
    selector: "services-detail",
    standalone: true,
    imports: [CommonModule, TranslateModule],
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
    private readonly languageStore = inject(LanguageStore);

    private readonly servicePageSections = this.componentStore.getSectionsBySlug('page-service');

    private readonly serviceIdFromRoute = toSignal(
        this.route.params.pipe(
            map(params => params['id'] as string)
        )
    );

    constructor() {
        effect(() => {
            const lang = this.languageStore.$selectedCodeLang();
            if (!lang) return;

            untracked(() => {
                this.componentStore.loadPageBySlug({ slug: 'page-service', lang });
            });
        });
    }

    readonly serviceBlock = computed(() => {
        const sections = this.servicePageSections();
        const serviceId = this.serviceIdFromRoute();

        if (sections.length === 0 || !serviceId) return null;

        for (const section of sections) {
            const found = findBlockById(section.blocks, serviceId);
            if (found) {
                return found;
            }
        }
        return null;
    });

    readonly returnButtonText = computed(() => {
        const sections = this.servicePageSections();
        if (sections.length === 0) return '';

        for (const section of sections) {
            const buttonBlock = section.blocks.find(block => block.key === 'button-return');
            if (buttonBlock) return buttonBlock.content ?? '';
        }
        return '';
    });

    goBack(): void {
        this.router.navigate(['/']);
    }
}