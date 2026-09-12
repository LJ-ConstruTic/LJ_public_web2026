import { CommonModule } from "@angular/common";
import { ChangeDetectionStrategy, Component, computed, inject, OnInit, ViewEncapsulation } from "@angular/core";
import { LanguageStore } from "../../../store/language/language.store";
import { toSignal } from "@angular/core/rxjs-interop";
import { ActivatedRoute, Router } from "@angular/router";

@Component({
    selector: "products",
    standalone: true,
    imports: [CommonModule],
    providers: [],
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None,
    templateUrl: './product-detail.component.html',
    styleUrl: './product-detail.component.scss'
})
export class ProductDetailComponent {
    // readonly languageStore = inject(LanguageStore);
    private readonly router = inject(Router);
    // readonly detailStore = inject(GetGroupDetailsStore);
    private readonly route = inject(ActivatedRoute);

    // private readonly detail = toSignal(this.detailStore.detail$, { initialValue: null });
    // private readonly lang = computed(() => (this.languageStore.$selectedLanguage()?.tag ?? 'en') as keyof InternationalizationDataModel);

    // readonly content = computed(() => {
    //     const lang = this.lang();
    //     const items = [...(this.detail()?.items ?? [])].sort((a, b) => a.order - b.order);

    //     const header = items.find(i =>
    //         (i.internationalization.tagHtml === 'h2' || i.internationalization.tagHtml === 'li')
    //         && i.internationalization.imgUrl?.length > 0
    //     );

    //     return {
    //         img: header?.internationalization.imgUrl?.[0] ?? null,
    //         title: header?.internationalization.tag[lang] ?? '',
    //         texts: items
    //             .filter(i => i !== header)
    //             .map(i => ({
    //                 tagHtml: i.internationalization.tagHtml,
    //                 text: i.internationalization.tag[lang] ?? '',
    //             }))
    //     };
    // });

    // ngOnInit(): void {
    //     this.route.params.subscribe(params => {
    //         const tagId = params['id'];
    //         if (tagId) this.detailStore.loadDetail(tagId);
    //     });
    // }

    goBack(): void {
        this.router.navigate(['/']);
    }
}