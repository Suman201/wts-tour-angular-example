import { afterNextRender, Component, DestroyRef, inject, signal } from '@angular/core';
import { WtsTour, type TourTheme, type TourTransition, type TourStep } from 'wts-tour';

@Component({
  selector: 'app-root',
  imports: [],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  private readonly destroyRef = inject(DestroyRef);
  private tour?: WtsTour;

  protected readonly theme = signal<TourTheme>('light');
  protected readonly transition = signal<TourTransition>('slide');
  protected readonly status = signal<'Ready' | 'In progress' | 'Completed' | 'Skipped'>('Ready');
  protected readonly currentStep = signal(0);
  protected readonly currentStepTitle = signal('Tour not started');

  protected readonly themes: readonly TourTheme[] = ['light', 'dark', 'auto', 'minimal'];
  protected readonly transitions: readonly TourTransition[] = ['slide', 'fade', 'scale', 'none'];

  private readonly steps: readonly TourStep[] = [
    {
      target: '#workspace-nav',
      badge: 'Workspace · 1 of 5',
      title: 'Everything starts here',
      description:
        'Move between your overview, projects, reports, and team without losing context.',
      placement: 'right',
      padding: 8,
    },
    {
      target: '#global-search',
      badge: 'Search · 2 of 5',
      title: 'Find anything, fast',
      description:
        'Search projects, teammates, and reports from one keyboard-friendly command bar.',
      placement: 'bottom',
    },
    {
      target: '#momentum-card',
      badge: 'Insights · 3 of 5',
      title: 'Read your momentum',
      description:
        'A quick pulse on delivery speed, progress, and the trend behind your team’s work.',
      placement: 'bottom',
      padding: 10,
    },
    {
      target: '#project-board',
      badge: 'Projects · 4 of 5',
      title: 'Keep priorities visible',
      description:
        'Projects surface owners, health, and progress so the next decision is always obvious.',
      placement: 'top',
      padding: 10,
    },
    {
      target: '#automation-button',
      badge: 'Automation · 5 of 5',
      title: 'Let the routine work run itself',
      description: 'Create lightweight automations for recurring updates, handoffs, and reminders.',
      placement: 'left',
      padding: 8,
    },
  ];

  constructor() {
    afterNextRender(() => {
      this.tour = new WtsTour(this.steps, {
        positionPreference: 'right',
        theme: this.theme(),
        transition: this.transition(),
        transitionDuration: 240,
        showArrow: true,
        showProgress: true,
        showBullet: true,
        showSlideCounter: true,
        showCloseButton: true,
        showOverlay: true,
        modal: true,
        keyboardNavigation: true,
        escapeToClose: true,
        scrollLock: true,
        injectStyles: false,
        onStart: ({ index, step }) => this.updateActiveStep(index, step.title),
        onChange: ({ index, step }) => this.updateActiveStep(index, step.title),
        onFinish: () => {
          this.status.set('Completed');
          this.currentStep.set(this.steps.length);
          this.currentStepTitle.set('Workspace tour complete');
        },
        onSkip: () => {
          this.status.set('Skipped');
          this.currentStepTitle.set('Tour closed early');
        },
        onError: (error) => console.error('wts-tour example:', error),
      });

      this.destroyRef.onDestroy(() => this.tour?.destroy());
    });
  }

  protected async startTour(): Promise<void> {
    const started = await this.tour?.startAsync(0);

    if (started === false) {
      this.status.set('Ready');
      this.currentStepTitle.set('No visible tour targets');
    }
  }

  protected changeTheme(event: Event): void {
    const theme = (event.target as HTMLSelectElement).value as TourTheme;
    this.theme.set(theme);
    this.tour?.updateOptions({ theme });
  }

  protected changeTransition(event: Event): void {
    const transition = (event.target as HTMLSelectElement).value as TourTransition;
    this.transition.set(transition);
    this.tour?.updateOptions({ transition });
  }

  private updateActiveStep(index: number, title?: string): void {
    this.status.set('In progress');
    this.currentStep.set(index + 1);
    this.currentStepTitle.set(title ?? `Step ${index + 1}`);
  }
}
