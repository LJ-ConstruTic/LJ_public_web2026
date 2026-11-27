import { TestBed } from '@angular/core/testing';
import { provideZonelessChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { Subject } from 'rxjs';
import { PageResponse, SectionPage } from '../../core/model/component-dto';
import { ComponentService } from '../../core/services/component.service';
import { ComponentAppStore } from './component.store';

describe('ComponentAppStore public CMS requests', () => {
  let store: ComponentAppStore;
  let getPage: jasmine.Spy;
  let responses: Map<string, Subject<PageResponse>>;

  beforeEach(() => {
    responses = new Map();
    getPage = jasmine.createSpy('getPageBySlug').and.callFake((slug: string, lang: string) => {
      const response = new Subject<PageResponse>();
      responses.set(`${slug}/${lang}`, response);
      return response;
    });
    TestBed.configureTestingModule({
      providers: [
        ComponentAppStore,
        provideZonelessChangeDetection(),
        provideRouter([]),
        { provide: ComponentService, useValue: { getPageBySlug: getPage } },
      ],
    });
    store = TestBed.inject(ComponentAppStore);
  });

  function respond(slug: string, lang: string): SectionPage {
    const section = { id: lang } as SectionPage;
    const response = responses.get(`${slug}/${lang}`)!;
    response.next({ page: { sections: [section] } } as PageResponse);
    response.complete();
    return section;
  }

  it('deduplicates pending work and prevents an older language replacing the selection', () => {
    store.loadPageBySlug({ slug: 'page-home', lang: 'pt' });
    store.loadPageBySlug({ slug: 'page-home', lang: 'pt' });
    store.loadPageBySlug({ slug: 'page-home', lang: 'en' });

    const current = respond('page-home', 'en');
    respond('page-home', 'pt');
    expect(getPage).toHaveBeenCalledTimes(2);
    expect(store.getSectionsBySlug('page-home')()).toEqual([current]);
  });

  it('continues accepting requests after a CMS failure', () => {
    const request = { slug: 'page-home', lang: 'pt' };
    store.loadPageBySlug(request);
    responses.get('page-home/pt')!.error(new Error('Unavailable'));
    expect(store.$error()).toBe('Unavailable');

    store.loadPageBySlug(request);
    const section = respond('page-home', 'pt');
    expect(store.getSectionsBySlug('page-home')()).toEqual([section]);
    expect(store.$loading()).toBeFalse();
  });
});
