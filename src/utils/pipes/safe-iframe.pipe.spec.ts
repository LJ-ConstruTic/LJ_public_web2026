import { TestBed } from '@angular/core/testing';
import { provideZonelessChangeDetection } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { SafePipe } from './safe-iframe.pipe';

describe('SafePipe maps', () => {
  it('accepts only the HTTPS map origin used by the CMS', () => {
    TestBed.configureTestingModule({ providers: [provideZonelessChangeDetection()] });
    const pipe = new SafePipe(TestBed.inject(DomSanitizer));
    expect(pipe.transform('https://maps.google.com/maps')).not.toBeNull();
    expect(pipe.transform('http://maps.google.com/maps')).toBeNull();
    expect(pipe.transform('https://example.com/maps')).toBeNull();
    expect(pipe.transform('')).toBeNull();
  });
});
