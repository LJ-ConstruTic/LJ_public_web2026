import { CommonModule } from "@angular/common";
import { ChangeDetectionStrategy, Component, computed, inject } from "@angular/core";
import { RouterLink } from '@angular/router';
import { LanguageStore } from '../../store/language/language.store';
import catalog from '../../seo-pages.json';

const copy: Record<string, string[]> = catalog.nonIndexable['not-found'];

@Component({
    selector: "app-not-found",
    standalone: true,
    imports: [CommonModule, RouterLink],
    providers: [],
    changeDetection: ChangeDetectionStrategy.OnPush,
    templateUrl: './not-found.component.html',
    styleUrl: './not-found.component.scss'
})
export class NotFoundComponent {
    private readonly language = inject(LanguageStore).$selectedCodeLang;
    readonly message = computed(() => copy[this.language() ?? 'pt'] ?? copy['en']);
}
