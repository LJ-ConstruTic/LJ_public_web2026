import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Pipe({ name: 'safe', standalone: true })
export class SafePipe implements PipeTransform {
  constructor(private sanitizer: DomSanitizer) {}

  transform(url: string): SafeResourceUrl | null {
    try {
      const target = new URL(url);
      if (target.origin === 'https://maps.google.com' && !target.username && !target.password) {
        return this.sanitizer.bypassSecurityTrustResourceUrl(target.href);
      }
    } catch {
      // A malformed CMS URL must not be assigned to the iframe.
    }
    return null;
  }
}
