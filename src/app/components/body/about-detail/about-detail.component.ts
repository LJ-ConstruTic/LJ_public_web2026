import { ChangeDetectionStrategy, Component, computed, inject, ViewEncapsulation } from "@angular/core";
import { TagStore } from "../../../store/tag/tag.store";
import { CommonModule } from "@angular/common";
import { TAGS_DICTIONARY } from "../../../core/dictionary/tags-dictionary";

@Component({
  selector: "about-detail",
  standalone: true,
  imports: [ CommonModule ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  templateUrl: './about-detail.component.html',
  styleUrl: './about-detail.component.scss'
})
export class AboutDetailComponent {
  readonly tagStore = inject(TagStore);

  readonly teamMembers = computed(() => [
    {
      key: TAGS_DICTIONARY.WE_ARE_NAME_2,
      name: 'Jose Cabral',
      role: 'Software Architect & Data Engineer',
      img: this.tagStore.$tagByKey(TAGS_DICTIONARY.WE_ARE_NAME_2)()?.internationalization.imgUrl[0] ?? null
    },
    {
      key: TAGS_DICTIONARY.WE_ARE_NAME_3,
      name: 'Pedro Muteca',
      role: 'Programmer Front-End',
      img: this.tagStore.$tagByKey(TAGS_DICTIONARY.WE_ARE_NAME_3)()?.internationalization.imgUrl[0] ?? null
    },
    
  ]);

  readonly vision = computed(() =>
    this.tagStore.$tagByKey(TAGS_DICTIONARY.WE_VISION)()?.internationalization.imgUrl[0] ?? null);
}