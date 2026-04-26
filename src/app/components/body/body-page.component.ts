import { ChangeDetectionStrategy, Component, inject, OnInit, Type } from "@angular/core";
import { ComponentAppStore } from "../../store/component/component.store";
import { CommonModule } from "@angular/common";
import { COMPONENT_DICTIONARY } from "../../core/dictionary/component-dictionary";
import { TagStore } from "../../store/tag/tag.store";

@Component({
  selector: "body-page",
  standalone: true,
  imports: [ CommonModule ],
  providers: [ ComponentAppStore, TagStore ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './body-page.component.html',
  styleUrl: './body-page.component.scss'
})
export class BodyPageComponent implements OnInit{
    
    private componentStore = inject(ComponentAppStore);
    
    readonly $loading = this.componentStore.$loading;
    readonly $activeComponents = this.componentStore.$activeComponents;

    ngOnInit() {
        this.componentStore.loadAllComponents();
    }

    getComponent(name: string): Type<any> | null {
        return COMPONENT_DICTIONARY[name] ?? null;
    }
}