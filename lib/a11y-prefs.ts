/**
 * Accessibility widget preferences: shape, storage and the <html> classes
 * each one sets. The CSS for every class lives in globals.css.
 *
 * Shared by the widget (client) and the root layout (server), which inlines
 * `A11Y_BOOT_SCRIPT` so a saved preference is on <html> before first paint.
 * Applying it after hydration instead would repaint the page at a new text
 * size — a layout shift on every visit for exactly the people who set one.
 */

export const A11Y_STORAGE_KEY = "hakerem_a11y";

export type A11yPrefs = { text: number; contrast: boolean; links: boolean; motion: boolean; font: boolean };
export const A11Y_DEFAULTS: A11yPrefs = { text: 0, contrast: false, links: false, motion: false, font: false };

export function a11yClasses(p: A11yPrefs): Record<string, boolean> {
  return {
    "a11y-text-1": p.text === 1,
    "a11y-text-2": p.text === 2,
    "a11y-contrast": p.contrast,
    "a11y-links": p.links,
    "a11y-motion": p.motion,
    "a11y-font": p.font,
  };
}

export const A11Y_BOOT_SCRIPT = `try{var p=JSON.parse(localStorage.getItem(${JSON.stringify(
  A11Y_STORAGE_KEY,
)})||"{}"),c=document.documentElement.classList;if(p.text===1)c.add("a11y-text-1");if(p.text===2)c.add("a11y-text-2");if(p.contrast)c.add("a11y-contrast");if(p.links)c.add("a11y-links");if(p.motion)c.add("a11y-motion");if(p.font)c.add("a11y-font")}catch(e){}`;
