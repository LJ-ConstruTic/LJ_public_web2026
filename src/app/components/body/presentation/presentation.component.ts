import { ChangeDetectionStrategy, Component, inject } from "@angular/core";
import { TagService } from "../../../core/services/tags.service";


@Component({
  selector: "presentation",
  standalone: true,
  imports: [ ],
  providers: [  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './presentation.component.html'
})
export class PresentationComponent {
  private tagService = inject(TagService);

  ngOnInit(): void {
    this.testGetAllTags();
    this.testGetTagById(1); // BORRAR CUANDO VAYAS A USAR ESTE COMPONENTE
  }

  testGetAllTags(): void {
    this.tagService.getAllTags().subscribe({
      next: (response) => console.log('✅ getAllTags:', response),
      error: (err) => console.error('❌ Error getAllTags:', err),
    });
  }

  testGetTagById(id: number): void {
    this.tagService.getTagById(id).subscribe({
      next: (tag) => console.log(`✅ getTagById(${id}):`, tag),
      error: (err) => console.error(`❌ Error getTagById(${id}):`, err),
    });
  }

}