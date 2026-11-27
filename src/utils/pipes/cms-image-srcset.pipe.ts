import { Pipe, PipeTransform } from '@angular/core';

const optimized: Record<string, string> = {
  'https://ljconstrutic.com/media/web/stratery.webp': 'strategy',
  'https://ljconstrutic.com/media/web/we_are_deail.webp': 'about',
};

@Pipe({ name: 'cmsImageSrcset', standalone: true })
export class CmsImageSrcsetPipe implements PipeTransform {
  transform(url: string): string | null {
    if (!Object.hasOwn(optimized, url)) return null;
    const name = optimized[url];
    return `/img/${name}-cms-640.webp 640w, /img/${name}-cms-1280.webp 1280w`;
  }
}
