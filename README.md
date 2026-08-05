# wts-tour Angular 22 example

A complete Angular 22 integration for [`wts-tour`](https://www.npmjs.com/package/wts-tour), a framework-agnostic product-tour controller.

The example includes five real dashboard targets, live theme and transition controls, lifecycle-driven Angular signals, keyboard-accessible navigation, and controller cleanup with `DestroyRef`.

## Run locally

```bash
npm install
npm start
```

Open `http://localhost:4200`, choose a theme and transition, then select **Start guided tour**.

## Verify

```bash
npm test -- --watch=false
npm run build
```

## Integration outline

The application imports `WtsTour` from `wts-tour`, creates the controller after Angular renders the DOM, and destroys it with the component. The package stylesheet is loaded once from `wts-tour/styles.css` in `src/styles.scss`.

```ts
import { afterNextRender, DestroyRef, inject } from '@angular/core';
import { WtsTour } from 'wts-tour';

const destroyRef = inject(DestroyRef);

afterNextRender(() => {
  const tour = new WtsTour([{ target: '#workspace-nav', title: 'Everything starts here' }], {
    theme: 'light',
    transition: 'slide',
    showProgress: true,
  });

  tour.start();
  destroyRef.onDestroy(() => tour.destroy());
});
```

## Package

- [`wts-tour` on npm](https://www.npmjs.com/package/wts-tour)
- [Angular documentation](https://angular.dev/)
