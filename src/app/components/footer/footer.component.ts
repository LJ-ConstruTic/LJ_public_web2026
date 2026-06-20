import { CommonModule } from "@angular/common";
import { Component, computed, effect, inject, InjectionToken, OnInit, ViewEncapsulation } from "@angular/core";
import { TagStore } from "../../store/tag/tag.store";
import { LanguageStore } from "../../store/language/language.store";
import { ComponentAppStore } from "../../store/component/component.store";
import { InternationalizationDataModel } from "../../core/model/common-response-dto";
import { toSignal } from "@angular/core/rxjs-interop";
import { GetComponentTagsStore } from "../../store/body/tagsByComponent.store";
import { RouterLink } from "@angular/router";

const PRIVACY_STORE = new InjectionToken<GetComponentTagsStore>('PRIVACY_STORE');
const DATA_STORE = new InjectionToken<GetComponentTagsStore>('DATA_STORE');
const COOKIES_STORE = new InjectionToken<GetComponentTagsStore>('COOKIES_STORE');
const CONDITIONS_STORE = new InjectionToken<GetComponentTagsStore>('CONDITIONS_STORE');

@Component({
    selector: 'footer',
    templateUrl: './footer.component.html',
    standalone: true,
    imports: [CommonModule, RouterLink],
    providers: [
        GetComponentTagsStore,
        { provide: PRIVACY_STORE, useClass: GetComponentTagsStore },
        { provide: DATA_STORE, useClass: GetComponentTagsStore },
        { provide: COOKIES_STORE, useClass: GetComponentTagsStore },
        { provide: CONDITIONS_STORE, useClass: GetComponentTagsStore },
    ],
    encapsulation: ViewEncapsulation.None,
})

export class FooterComponent implements OnInit {
    readonly tagStore = inject(TagStore);
    readonly languageStore = inject(LanguageStore);
    readonly footerStore = inject(GetComponentTagsStore);
    readonly componentStore = inject(ComponentAppStore);

    private readonly privacyStore = inject(PRIVACY_STORE);
    private readonly dataStore = inject(DATA_STORE);
    private readonly cookiesStore = inject(COOKIES_STORE);
    private readonly conditionsStore = inject(CONDITIONS_STORE);

    readonly currentYear = new Date().getFullYear();
    private readonly items = toSignal(this.footerStore.tags$, { initialValue: null });
    private readonly lang = computed(() => (this.languageStore.$selectedLanguage()?.tag ?? 'en') as keyof InternationalizationDataModel);

    private readonly privacyItems = toSignal(this.privacyStore.tags$, { initialValue: null });
    private readonly dataItems = toSignal(this.dataStore.tags$, { initialValue: null });
    private readonly cookiesItems = toSignal(this.cookiesStore.tags$, { initialValue: null });
    private readonly conditionsItems = toSignal(this.conditionsStore.tags$, { initialValue: null });

    constructor() {
        effect(() => {
            const items = this.componentStore.$items();
            if (items.length === 0) return;

            const footer = items.find((c) => c.idx === 10);
            if (footer) this.footerStore.loadComponentTags(footer.id);

            const privacy = items.find((c) => c.idx === 16);
            if (privacy) this.privacyStore.loadComponentTags(privacy.id);

            const data = items.find((c) => c.idx === 17);
            if (data) this.dataStore.loadComponentTags(data.id);

            const cookies = items.find((c) => c.idx === 18);
            if (cookies) this.cookiesStore.loadComponentTags(cookies.id);

            const conditions = items.find((c) => c.idx === 19);
            if (conditions) this.conditionsStore.loadComponentTags(conditions.id);
        });
    }

    private legalTitle(items: any): string {
        const lang = this.lang();
        return (items?.items ?? []).find((i: any) => i.order === 1)?.tag[lang] ?? '';
    }

    readonly footer = computed(() => {
        const lang = this.lang();
        const rawItems = this.items()?.items ?? [];
        const byOrder = (order: number) => rawItems.find((i) => i.order === order);

        return {
            logo: byOrder(1)?.imgUrl[0] ?? null,
            copyright: byOrder(2)?.tag[lang] ?? '',
            phone: byOrder(3)?.tag[lang] ?? '',
            email: byOrder(4)?.tag[lang] ?? '',
            company: byOrder(5)?.tag[lang] ?? '',
            address: byOrder(6)?.tag[lang] ?? '',
            socials: [7, 8, 9]
                .map(o => byOrder(o))
                .filter(i => !!i?.imgUrl[0])
                .map(i => ({ icon: i!.imgUrl[0], url: i!.imgUrl[1] ?? '#', alt: i!.keys })),
            legal: {
                privacy: this.legalTitle(this.privacyItems()),
                dataProtection: this.legalTitle(this.dataItems()),
                cookies: this.legalTitle(this.cookiesItems()),
                conditions: this.legalTitle(this.conditionsItems()),
            }
        };
    });

    ngOnInit(): void {
        const servicesTags = this.componentStore.$items().find((component) => component.idx === 10);
        if (servicesTags) {
            this.footerStore.loadComponentTags(servicesTags.id);
        }
    }
}  