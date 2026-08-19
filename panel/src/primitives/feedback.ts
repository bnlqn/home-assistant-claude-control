/**
 * Widget → shell feedback bus. Widgets don't own modality; they raise composed
 * events that bubble to the app shell, which hosts the confirm dialog and toast
 * stack. This keeps a single confirm/toast instance for the whole panel.
 */

export interface ConfirmOptions {
  title: string;
  message?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  destructive?: boolean;
  icon?: string;
}

export interface ToastOptions {
  message: string;
  tone?: "neutral" | "eco" | "warn" | "alert";
  icon?: string;
  duration?: number;
}

/** Ask the shell to confirm a sensitive action. Resolves true/false. */
export function requestConfirm(source: HTMLElement, opts: ConfirmOptions): Promise<boolean> {
  return new Promise<boolean>((resolve) => {
    const ev = new CustomEvent("hd-confirm", {
      detail: { opts, resolve },
      bubbles: true,
      composed: true,
    });
    const dispatched = source.dispatchEvent(ev);
    // If nothing handled it (no shell), fail safe by not performing the action.
    if (!dispatched) resolve(false);
  });
}

/** Fire a transient toast. */
export function toast(source: HTMLElement, opts: ToastOptions): void {
  source.dispatchEvent(new CustomEvent("hd-toast", { detail: opts, bubbles: true, composed: true }));
}
