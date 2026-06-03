import { CommonModule } from "@angular/common";
import { ChangeDetectionStrategy, Component, computed, inject, PLATFORM_ID, signal } from "@angular/core";
import { TagStore } from "../../../store/tag/tag.store";
import { LanguageStore } from "../../../store/language/language.store";
import { InternationalizationDataModel } from "../../../core/model/common-response-dto";
import { TagKey, TAGS_DICTIONARY } from "../../../core/dictionary/tags-dictionary";
import { InputTextModule } from "primeng/inputtext";
import { ButtonModule } from "primeng/button";
import { SafePipe } from "../../../../utils/pipes/safe-iframe.pipe";
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
import { ContactStore } from "../../../store/body/contact.store";
import { toSignal } from "@angular/core/rxjs-interop";
import { filter, take } from "rxjs";

@Component({
    selector: "contact",
    standalone: true,
    imports: [CommonModule, InputTextModule, ButtonModule, SafePipe, ReactiveFormsModule],
    providers: [],
    changeDetection: ChangeDetectionStrategy.OnPush,
    templateUrl: './contact.component.html',
    styleUrl: './contact.component.scss'
})
export class ContactComponent {
    readonly tagStore = inject(TagStore);
    readonly contactStore = inject(ContactStore);
    readonly languageStore = inject(LanguageStore);

    private readonly fb = inject(FormBuilder);

    readonly sending = toSignal(this.contactStore.sending$, { initialValue: false });
    readonly sent = toSignal(this.contactStore.sent$, { initialValue: false });

    submitted = signal(false);


    readonly mapUrl = 'https://maps.google.com/maps?q=-12.3644,13.5360&z=15&output=embed';

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
        name: ['', Validators.required],
        phone: ['', Validators.required],
        email: ['', [Validators.required, Validators.email]],
        message: ['', Validators.required],
        website: [''],
    });

    hasError(field: string): boolean {
        const control = this.form.get(field);
        return !!control && control.invalid && (control.touched || this.submitted());
    }

    onSubmit(): void {
        this.submitted.set(true);

        if (this.form.invalid) return; // Validación

        const { ...formData } = this.form.value;

        this.contactStore.submit(formData);

        // Resetear formulario cuando el envío sea exitoso
        this.contactStore.sent$.pipe(
            filter(Boolean),
            take(1)).subscribe(() => {
            this.form.reset();
            this.submitted.set(false);
        });
    }
}