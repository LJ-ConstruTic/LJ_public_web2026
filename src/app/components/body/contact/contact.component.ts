import { CommonModule } from "@angular/common";
import { ChangeDetectionStrategy, Component, computed, effect, inject, input, signal, untracked } from "@angular/core";
import { LanguageStore } from "../../../store/language/language.store";
import { InputTextModule } from "primeng/inputtext";
import { ButtonModule } from "primeng/button";
import { SafePipe } from "../../../../utils/pipes/safe-iframe.pipe";
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
import { ContactStore } from "../../../store/body/contact.store";
import { toSignal } from "@angular/core/rxjs-interop";
import { filter, take } from "rxjs";
import { ComponentAppStore } from "../../../store/component/component.store";
import { Block } from "../../../core/model/component-dto";
import { ContactRequest } from "../../../core/model/contact-dto";

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
    readonly block = input.required<Block>();
    private readonly componentStore = inject(ComponentAppStore);
    private readonly languageStore = inject(LanguageStore);
    private readonly contactStore = inject(ContactStore);
    private readonly fb = inject(FormBuilder);

    private readonly contactPageSections = this.componentStore.getSectionsBySlug('page-contact');

    readonly sending = this.contactStore.$sending;
    readonly sent = this.contactStore.$sent;
    submitted = signal(false);

    constructor() {
        effect(() => {
            const lang = this.languageStore.$selectedCodeLang();
            if (!lang) return;

            untracked(() => {
                this.componentStore.loadPageBySlug({ slug: 'page-contact', lang });
            });
        });

        effect(() => {
            const sentSuccessfully = this.contactStore.$sent();
            if (sentSuccessfully) {
                console.log('[ContactComponent] enviado con éxito, reseteando form');
                this.form.reset();
                this.submitted.set(false);
            }
        });
    }

    private readonly contactBlocks = computed(() => {
        const sections = this.contactPageSections();
        if (sections.length === 0) return [];
        const blocks = [...sections[0].blocks].sort((blockA, blockB) => blockA.order - blockB.order);
        console.log('[ContactComponent] bloques:', blocks.length);
        return blocks;
    });

    private findBySourceKey(sourceKey: string): string {
        const block = this.contactBlocks().find(
            block => block.properties['sourceKey'] === sourceKey
        );
        return block?.content ?? '';
    }

    readonly labels = computed(() => {
        const result = {
            title: this.findBySourceKey('contMoreInfo'),
            subtitle: this.findBySourceKey('contWeHelp'),
            name: this.findBySourceKey('contName'),
            phone: this.findBySourceKey('contTel'),
            email: this.findBySourceKey('contEmail'),
            message: this.findBySourceKey('contMessage'),
            btnSend: this.findBySourceKey('btnSendContactForm'),
            mapUrl: this.getMapUrl(),
        };
        console.log('[ContactComponent] labels:', result);
        return result;
    });

    private getMapUrl(): string {
        const blocks = this.contactBlocks();
        const imageBlock = blocks.find(block => block.type === 'image' && block.media.length > 0);
        const url = imageBlock?.media[0]?.url ?? '';
        console.log('[ContactComponent] mapa URL:', url);
        return url;
    }

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
        if (this.form.invalid) return;

        this.contactStore.submitContactForm(this.form.value as ContactRequest);
    }
}