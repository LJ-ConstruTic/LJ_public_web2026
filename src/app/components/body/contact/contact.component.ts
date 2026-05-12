import { CommonModule } from "@angular/common";
import { ChangeDetectionStrategy, Component, computed, inject, signal } from "@angular/core";
import { TagStore } from "../../../store/tag/tag.store";
import { LanguageStore } from "../../../store/language/language.store";
import { InternationalizationDataModel } from "../../../core/model/common-response-dto";
import { TagKey, TAGS_DICTIONARY } from "../../../core/dictionary/tags-dictionary";
import { InputTextModule } from "primeng/inputtext";
import { ButtonModule } from "primeng/button";
import { SafePipe } from "../../../../utils/pipes/safe-iframe.pipe";
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";

@Component({
    selector: "contact",
    standalone: true,
    imports: [CommonModule, InputTextModule, InputTextModule, ButtonModule, SafePipe, ReactiveFormsModule],
    providers: [],
    changeDetection: ChangeDetectionStrategy.OnPush,
    templateUrl: './contact.component.html',
    styleUrl: './contact.component.scss'
})
export class ContactComponent {
    readonly tagStore = inject(TagStore);
    private readonly languageStore = inject(LanguageStore);

    private readonly fb = inject(FormBuilder);

    submitted = signal(false);

    readonly mapUrl = 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3000!2d13.5513!3d-12.3947!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTLCsDIzJzQxLjAiUyAxM8KwMzMnMDQuNiJF!5e0!3m2!1ses!2s!4v1';

    private readonly lang = computed(
        () => (this.languageStore.$selectedLanguage()?.tag ?? 'en') as keyof InternationalizationDataModel
    );


    readonly labels = computed(() => {
        const lang = this.lang();
        const tags = this.tagStore.$tags();

        const text = (key: TagKey) =>
            tags.find((t) => t.isActive && t.internationalization.keyLabel === key)?.internationalization.tag[lang] ?? '';

        return {
            title: text(TAGS_DICTIONARY.CONT_MORE_INFO),
            subtitle: text(TAGS_DICTIONARY.CONT_WE_HELP),
            name: text(TAGS_DICTIONARY.CONT_NAME),
            phone: text(TAGS_DICTIONARY.CONT_TEL),
            email: text(TAGS_DICTIONARY.CONT_EMAIL),
            message: text(TAGS_DICTIONARY.CONT_MESSAGE),
        };
    });

    readonly form: FormGroup = this.fb.group({
        name:    ['', Validators.required],
        phone:   ['', Validators.required],
        email:   ['', [Validators.required, Validators.email]],
        message: ['', Validators.required],
    });

    hasError(field: string): boolean {
        const control = this.form.get(field);
        return !!control && control.invalid && (control.touched || this.submitted());
    }

    onSubmit(): void {
        this.submitted.set(true);
        if (this.form.valid) {
        console.log(this.form.value);
        // TODO: lógica de envío
        }
    }
}