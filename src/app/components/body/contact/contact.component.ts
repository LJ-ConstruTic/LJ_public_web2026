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
import { ComponentAppStore } from "../../../store/component/component.store";

@Component({
    selector: "contact",
    standalone: true,
    imports: [CommonModule, InputTextModule, ButtonModule, SafePipe, ReactiveFormsModule],
    providers: [ContactStore],
    changeDetection: ChangeDetectionStrategy.OnPush,
    templateUrl: './contact.component.html',
    styleUrl: './contact.component.scss'
})
export class ContactComponent {
    readonly tagStore = inject(TagStore);
    readonly contactStore = inject(ContactStore);
    readonly languageStore = inject(LanguageStore);
    readonly componentStore = inject(ComponentAppStore);

    private readonly fb = inject(FormBuilder);

    readonly sending = toSignal(this.contactStore.sending$, { initialValue: false });
    readonly sent = toSignal(this.contactStore.sent$, { initialValue: false });
    private readonly items = toSignal(this.contactStore.tags$, { initialValue: null });

    submitted = signal(false);

    ngOnInit(): void {
        const contact = this.componentStore.$items().find((component) => component.idx === 9);
        if (contact) {
        this.contactStore.loadContactTags(contact.id);
        }
    }

    private readonly lang = computed(
        () => (this.languageStore.$selectedLanguage()?.tag ?? 'en') as keyof InternationalizationDataModel
    );


    private readonly contactItems = computed(() => {
    const lang = this.lang();
    const raw = this.items();
    return (Array.isArray(raw) ? raw : raw?.items ?? [])
        .sort((a, b) => a.order - b.order)
        .map((i) => ({
            keys: i.keys,
            text: i.tag[lang] ?? '',
            img:  i.imgUrl[0] ?? null,
        }));
    });

    readonly label = computed(() => {
        const items = this.contactItems();
        const find    = (keys: string) => items.find((i) => i.keys === keys)?.text ?? '';
        const findImg = (keys: string) => items.find((i) => i.keys === keys)?.img  ?? '';

        return {
            title:    find('contMoreInfo'),
            subtitle: find('contWeHelp'),
            name:     find('contName'),
            phone:    find('contTel'),
            email:    find('contEmail'),
            message:  find('contMessage'),
            btnSend:  find('btnSendContactForm'),
            mapUrl:   findImg('mapContatFormUrl'),
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