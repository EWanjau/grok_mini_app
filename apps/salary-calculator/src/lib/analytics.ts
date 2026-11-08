/**
 * Privacy-light analytics: never include salary figures in payloads.
 * Wire Plausible by setting VITE_PLAUSIBLE_DOMAIN at build time.
 */
export function trackPageView(): void {
  const domain = import.meta.env.VITE_PLAUSIBLE_DOMAIN as string | undefined;
  if (!domain || typeof window === "undefined") return;
  if (!window.plausible) {
    const script = document.createElement("script");
    script.defer = true;
    script.dataset.domain = domain;
    script.src = "https://plausible.io/js/script.js";
    document.head.appendChild(script);
    window.plausible =
      window.plausible ||
      function (...args: unknown[]) {
        (window.plausible!.q = window.plausible!.q || []).push(args);
      };
  }
  window.plausible?.("pageview");
}

export function trackCalculate(): void {
  window.plausible?.("calculate");
}

declare global {
  interface Window {
    plausible?: ((event: string, options?: { props?: Record<string, string> }) => void) & {
      q?: unknown[];
    };
  }
}
