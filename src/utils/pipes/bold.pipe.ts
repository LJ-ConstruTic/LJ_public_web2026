import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'bold', standalone: true })
export class BoldPipe implements PipeTransform {
  transform(value: string): string {
    return value.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
  }
}