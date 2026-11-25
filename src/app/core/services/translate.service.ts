import { inject, Injectable, signal } from "@angular/core";
import { TranslateService } from "@ngx-translate/core";


@Injectable({ providedIn: 'root' })
export class TranslateAppService {
    private readonly translateService = inject(TranslateService);

    readonly labels = signal<any>({});

    constructor() {
        this.translateService.onLangChange.subscribe(event => {
            this.labels.set(event.translations);
        });
    }
}