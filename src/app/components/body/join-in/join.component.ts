import { ChangeDetectionStrategy, Component, computed, ElementRef, inject, viewChild } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ComponentAppStore } from '../../../store/component/component.store';

@Component({
  selector: 'join',
  imports: [ReactiveFormsModule, RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './join.component.html',
  styleUrl: './join.component.scss',
})
export class JoinInComponent {
  private readonly formBuilder = inject(FormBuilder);
  private readonly footerSections = inject(ComponentAppStore).getSectionsBySlug('page-footer');
  private readonly applicantName = viewChild.required<ElementRef<HTMLInputElement>>('applicantName');

  readonly vacancies = [
    { id: 'encarregado', area: 'Construção', title: 'Encarregado de obra', description: 'Coordenar equipas em obra e acompanhar a execução, os prazos e a segurança.' },
    { id: 'medidor', area: 'Construção', title: 'Técnico de medições e orçamentos', description: 'Analisar projetos, preparar mapas de quantidades e elaborar orçamentos.' },
    { id: 'programador', area: 'Informática', title: 'Programador web', description: 'Desenvolver e manter aplicações web em colaboração com a equipa de produto.' },
    { id: 'suporte', area: 'Informática', title: 'Técnico de suporte informático', description: 'Apoiar utilizadores, configurar equipamentos e resolver incidentes técnicos.' },
  ];

  readonly recruitmentEmail = computed(() => {
    const info = this.footerSections()[0]?.blocks.find(block => block.properties['name'] === 'info');
    return info?.children
      .map(block => block.content?.trim())
      .find(email => email && /^[^\s@?&#,;]+@[^\s@?&#,;]+\.[^\s@?&#,;]+$/.test(email));
  });

  readonly form = this.formBuilder.nonNullable.group({
    vacancy: ['', Validators.required],
    name: ['', [Validators.required, Validators.pattern(/\S/), Validators.maxLength(100)]],
    email: ['', [Validators.required, Validators.email, Validators.maxLength(150)]],
    phone: ['', Validators.maxLength(35)],
    message: ['', [Validators.required, Validators.pattern(/\S/), Validators.maxLength(500)]],
  });

  selectVacancy(id: string): void {
    this.form.controls.vacancy.setValue(id);
    this.applicantName().nativeElement.focus();
  }

  prepareApplication(): void {
    const values = this.form.getRawValue();
    const vacancy = this.vacancies.find(item => item.id === values.vacancy);
    const recipient = this.recruitmentEmail();
    if (this.form.invalid || !vacancy || !recipient) {
      this.form.markAllAsTouched();
      return;
    }

    const subject = encodeURIComponent(`Candidatura — ${vacancy.title}`);
    const body = encodeURIComponent([
      `Vaga: ${vacancy.title}`,
      `Nome: ${values.name.trim()}`,
      `Email: ${values.email.trim()}`,
      `Telefone: ${values.phone.trim() || 'Não indicado'}`,
      '',
      values.message.trim(),
    ].join('\r\n'));
    window.location.href = `mailto:${recipient}?subject=${subject}&body=${body}`;
  }
}
