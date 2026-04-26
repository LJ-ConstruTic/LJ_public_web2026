import { ChangeDetectionStrategy, Component, inject, ViewEncapsulation } from "@angular/core";
import { TagStore } from "../../../store/tag/tag.store";
import { CommonModule } from "@angular/common";

@Component({
  selector: "about",
  standalone: true,
  imports: [ CommonModule ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  templateUrl: './about.component.html',
  styleUrl: './about.component.scss'
})
export class AboutComponent {
    readonly tagStore = inject(TagStore);

  ngOnInit() {
    this.tagStore.loadAllTags();
  }

}