import { CommonModule } from "@angular/common";
import { Component, effect, inject, ViewEncapsulation } from "@angular/core";
import { RouterLink } from "@angular/router";
import { ComponentAppStore } from "../../store/component/component.store";

@Component({
    selector: 'footer',
    templateUrl: './footer.component.html',
    standalone: true,
    imports: [CommonModule, RouterLink],
    providers: [],
    encapsulation: ViewEncapsulation.None,
})

export class FooterComponent {

    readonly componentStore = inject(ComponentAppStore);

    readonly footerCompany = this.componentStore.$footerCompany;
    readonly footerContact = this.componentStore.$footerContact;
    readonly footerSocial = this.componentStore.$footerSocial;

    constructor() {
    //     effect(() => {
    //         console.log('footerCompany:', this.footerCompany());
    //         console.log('footerContact:', this.footerContact());
    //         console.log('footerSocial:', this.footerSocial());
    //     });
    }

}  