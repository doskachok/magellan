import { flushSync } from 'react-dom';

/**
 * Which way the next view transition slides; `GlobalStyle` keys the animation off `html[data-nav]`.
 * React Router can't pass view transition types, so the direction travels as an attribute instead.
 */
export type NavDirection = 'forward' | 'back' | 'tab';

export const setNavDirection = (direction: NavDirection) => {
  document.documentElement.dataset.nav = direction;
};

// Registered at import, before the router's own popstate listener, so browser Back always slides backwards.
// Any click defaults to forward; controls that mean otherwise (back button, tabs) override it in their handler.
if (typeof document !== 'undefined') {
  document.addEventListener('click', () => setNavDirection('forward'), { capture: true });
  window.addEventListener('popstate', () => setNavDirection('back'));
}

/** Runs a local state change (e.g. a wizard step) inside a view transition where the browser has them. */
export const withViewTransition = (direction: NavDirection, update: () => void) => {
  setNavDirection(direction);
  if (!document.startViewTransition) {
    update();
    return;
  }
  document.startViewTransition(() => flushSync(update));
};
