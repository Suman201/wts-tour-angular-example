import { TestBed } from '@angular/core/testing';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { App } from './app';

describe('App', () => {
  beforeEach(async () => {
    vi.spyOn(HTMLElement.prototype, 'getBoundingClientRect').mockReturnValue(
      new DOMRect(40, 40, 220, 56),
    );

    await TestBed.configureTestingModule({
      imports: [App],
    }).compileComponents();
  });

  afterEach(() => {
    document.querySelectorAll('.wts-tour').forEach((element) => element.remove());
    vi.restoreAllMocks();
  });

  it('renders all five tour targets', async () => {
    const fixture = TestBed.createComponent(App);
    fixture.detectChanges();
    await fixture.whenStable();

    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('#workspace-nav')).toBeTruthy();
    expect(compiled.querySelector('#global-search')).toBeTruthy();
    expect(compiled.querySelector('#momentum-card')).toBeTruthy();
    expect(compiled.querySelector('#project-board')).toBeTruthy();
    expect(compiled.querySelector('#automation-button')).toBeTruthy();
  });

  it('starts the published wts-tour controller from the demo button', async () => {
    const fixture = TestBed.createComponent(App);
    fixture.detectChanges();
    await fixture.whenStable();

    const button = fixture.nativeElement.querySelector('.start-button') as HTMLButtonElement;
    button.click();
    await fixture.whenStable();

    expect(document.querySelector('.wts-tour')).toBeTruthy();
    expect(document.querySelector('.wts-tour__popup')?.textContent).toContain(
      'Everything starts here',
    );
    expect(fixture.nativeElement.querySelector('.tour-readout')?.textContent).toContain(
      'In progress',
    );
  });

  it('moves to the next Angular target through the tour navigation', async () => {
    const fixture = TestBed.createComponent(App);
    fixture.detectChanges();
    await fixture.whenStable();

    (fixture.nativeElement.querySelector('.start-button') as HTMLButtonElement).click();
    await fixture.whenStable();

    const next = document.querySelector('[data-wts-tour-action="next"]') as HTMLButtonElement;
    next.click();
    await fixture.whenStable();

    expect(document.querySelector('.wts-tour__popup')?.textContent).toContain(
      'Find anything, fast',
    );
    expect(fixture.nativeElement.querySelector('.tour-readout')?.textContent).toContain('2/5');
  });
});
