import { CommonModule } from "@angular/common";
import { ChangeDetectionStrategy, Component, computed, inject, input, OnInit } from "@angular/core";
import { Block } from "../../../core/model/component-dto";
import { Router } from "@angular/router";

@Component({
    selector: "services",
    standalone: true,
    imports: [CommonModule],
    providers: [],
    changeDetection: ChangeDetectionStrategy.OnPush,
    templateUrl: './services.component.html',
    styleUrl: './services.component.scss'
})
export class ServicesComponent {
    readonly block = input.required<Block>();
    private readonly router = inject(Router);

    
    readonly servicesTitle = computed(() => {
        const title = this.block().content ?? '';
        console.log('[ServicesComponent] título:', title);
        return title;
    });

    readonly serviceCardsWithDescription = computed(() => {
        const cards = this.block().children
            .filter(child => child.properties['productId'] != null)
            .map(card => {
                const description = card.children.find(child => child.type === 'text')?.content ?? '';
                console.log('[ServicesComponent] card:', card.content, '→ desc:', description.substring(0, 40) + '...');
                return { card, description };
            });

        console.log('[ServicesComponent] tarjetas:', cards.length);
        return cards;
    });

    navigateToService(serviceBlock: Block): void {
        const productId = serviceBlock.properties['productId'];
        console.log('[ServicesComponent] click en servicio:', serviceBlock.content, '→ id:', productId);
        if (typeof productId === 'string') {
            this.router.navigate(['/service', productId]);
        }
    }
}