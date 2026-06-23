import { CommonModule } from "@angular/common";
import { ChangeDetectionStrategy, Component, computed, effect, inject, OnInit, ViewEncapsulation } from "@angular/core";
import { LanguageStore } from "../../../store/language/language.store";
import { InternationalizationDataModel } from "../../../core/model/common-response-dto";
import { toSignal } from "@angular/core/rxjs-interop";
import { ActivatedRoute, Router } from "@angular/router";
import { GetGroupDetailsStore } from "../../../store/body/group-detail.store";

@Component({
    selector: "services-detail",
    standalone: true,
    imports: [CommonModule],
    providers: [GetGroupDetailsStore],
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
    templateUrl: './services-detail.component.html',
    styleUrls: ['./services-detail.component.scss']
})
export class ServicesDetailComponent implements OnInit {
    readonly languageStore = inject(LanguageStore);
    private readonly router = inject(Router);
    readonly detailStore = inject(GetGroupDetailsStore);
    private readonly route = inject(ActivatedRoute);

    private readonly detail = toSignal(this.detailStore.detail$, { initialValue: null });
    private readonly lang = computed(() => (this.languageStore.$selectedLanguage()?.tag ?? 'en') as keyof InternationalizationDataModel);

    readonly content = computed(() => {
        const lang = this.lang();
        const items = [...(this.detail()?.items ?? [])].sort((a, b) => a.order - b.order);

        const header = items.find(i =>
            (i.internationalization.tagHtml === 'h2' || i.internationalization.tagHtml === 'li')
            && i.internationalization.imgUrl?.length > 0
        );

        return {
            img: header?.internationalization.imgUrl?.[0] ?? null,
            title: header?.internationalization.tag[lang] ?? '',
            texts: items
                .filter(i => i !== header)
                .map(i => ({
                    tagHtml: i.internationalization.tagHtml,
                    text: i.internationalization.tag[lang] ?? '',
                }))
        };
    });

    ngOnInit(): void {
        this.route.params.subscribe(params => {
            const tagId = params['id'];
            if (tagId) this.detailStore.loadDetail(tagId);
        });
    }

    goBack(): void {
        this.router.navigate(['/']);
    }

}