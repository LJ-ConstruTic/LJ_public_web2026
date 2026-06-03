import { ComponentStore } from "@ngrx/component-store";
import { ContactState, initialContactState } from "./contact.state";
import { ContactService } from "../../core/services/contact.service";
import { inject } from "@angular/core";
import { CreateContactRequest } from "../../core/model/contact-dto";
import { catchError, EMPTY, switchMap, tap } from "rxjs";



export class ContactStore extends ComponentStore<ContactState> {
    private readonly contactService = inject(ContactService);

    readonly sending$ = this.select((s) => s.sending);
    readonly sent$ = this.select((s) => s.sent);
    readonly error$ = this.select((s) => s.error);

    constructor() {
        super(initialContactState);
    }

    // Updaters
    private readonly setSending = this.updater((state, sending: boolean) => ({
        ...state, sending,
    }));

    private readonly setSent = this.updater((state, sent: boolean) => ({
        ...state, sent,
    }));

    private readonly setError = this.updater((state, error: string | null) => ({
        ...state, error,
    }));

    readonly resetState = this.updater(() => initialContactState);

    // Effect
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