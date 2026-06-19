import { ComponentStore } from "@ngrx/component-store";
import { ContactState, initialContactState } from "./contact.state";
import { ContactService } from "../../core/services/contact.service";
import { inject, Injectable } from "@angular/core";
import { CreateContactRequest } from "../../core/model/contact-dto";
import { catchError, EMPTY, switchMap, tap } from "rxjs";
import { ComponentService } from "../../core/services/component.service";
import { ComponentTagsDescription } from "../../core/model/component-dto";

@Injectable()
export class ContactStore extends ComponentStore<ContactState> {
    private readonly contactService = inject(ContactService);
    private readonly componentService = inject(ComponentService);

    readonly sending$ = this.select((s) => s.sending);
    readonly sent$ = this.select((s) => s.sent);
    readonly error$ = this.select((s) => s.error);
    readonly tags$ = this.select((s) => s.tags);
    readonly loading$ = this.select((s) => s.loading);

    constructor() {
        super(initialContactState);
    }

    // Updaters
    private readonly setTags = this.updater((state, tags: ComponentTagsDescription) => ({
        ...state, tags,
    }));

    private readonly setSending = this.updater((state, sending: boolean) => ({
        ...state, sending,
    }));

    private readonly setSent = this.updater((state, sent: boolean) => ({
        ...state, sent,
    }));

    private readonly setError = this.updater((state, error: string | null) => ({
        ...state, error,
    }));

    private readonly setLoading = this.updater((state, loading: boolean) => ({
        ...state, loading,
    }));

    readonly resetState = this.updater(() => initialContactState);

    // Effect
    readonly loadContactTags = this.effect<string>((id$) =>
        id$.pipe(
            tap(() => {
                this.setLoading(true);
                this.setError(null);
            }),
            switchMap((id) =>
                this.componentService.getTagsByComponentId(id).pipe(
                    tap((response: any) => {
                        const tags = response?.items ?? response;
                        console.log('CONTACT tags', tags);
                        this.setTags(tags);
                        this.setLoading(false);
                    }),
                    catchError(() => {
                        this.setError('Error al cargar los tags');
                        this.setLoading(false);
                        return EMPTY;
                    })
                )
            )
        )
    );

    readonly submit = this.effect<CreateContactRequest>((payload$) =>
        payload$.pipe(
            tap(() => {
                this.setSending(true);
                this.setError(null);
            }),
            switchMap((payload) =>
                this.contactService.create(payload).pipe(
                    tap(() => {
                        this.setSending(false);
                        this.setSent(true);
                    }),
                    catchError((err) => {
                        this.setSending(false);
                        this.setError('Error al enviar el mensaje');
                        return EMPTY;
                    })
                )
            )
        )
    );


}