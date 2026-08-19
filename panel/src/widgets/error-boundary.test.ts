import { describe, it, expect, vi } from "vitest";
import { html } from "lit";
import { EntityWidget } from "./base-widget.js";
import "./widget-frame.js";
import type { WidgetConfig } from "../config/schema.js";

const CONFIG: WidgetConfig = {
  id: "t1",
  type: "switch",
  entity: "switch.test",
  name: "Test Lamp",
  size: { compact: "1x1", medium: "1x1", wide: "1x1" },
};

/** A widget whose real render throws — the boundary should catch it. */
class ThrowingWidget extends EntityWidget {
  protected renderContent(): unknown {
    throw new Error("boom");
  }
}
customElements.define("hd-test-throwing", ThrowingWidget);

/** A well-behaved widget — the boundary should be fully transparent. */
class OkWidget extends EntityWidget {
  protected renderContent(): unknown {
    return html`<div class="ok">fine</div>`;
  }
}
customElements.define("hd-test-ok", OkWidget);

async function mount<T extends HTMLElement>(tag: string, props: Partial<T> = {}): Promise<T> {
  const el = document.createElement(tag) as T;
  Object.assign(el, props);
  document.body.appendChild(el);
  await (el as unknown as { updateComplete: Promise<unknown> }).updateComplete;
  return el;
}

describe("EntityWidget render boundary", () => {
  it("degrades to a card-styled error tile when renderContent throws, without rethrowing", async () => {
    const errSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    // If the throw propagated, updateComplete would reject and this would throw.
    const el = await mount<ThrowingWidget>("hd-test-throwing", { config: CONFIG });

    const frame = el.shadowRoot!.querySelector("hd-widget-frame");
    expect(frame).toBeTruthy();
    expect(frame!.hasAttribute("unavailable")).toBe(true);
    expect(frame!.getAttribute("accent")).toBe("alert");
    // Uses only plain config fields (never `vm`, which may be what threw).
    expect((frame as unknown as { name: string }).name).toBe("Test Lamp");
    // The failure is logged, not swallowed.
    expect(errSpy).toHaveBeenCalled();

    errSpy.mockRestore();
    el.remove();
  });

  it("isolates a failing widget so siblings render normally", async () => {
    const errSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    const bad = await mount<ThrowingWidget>("hd-test-throwing", { config: CONFIG });
    const good = await mount<OkWidget>("hd-test-ok", { config: { ...CONFIG, id: "t2" } });

    expect(bad.shadowRoot!.querySelector("hd-widget-frame[unavailable]")).toBeTruthy();
    // The healthy widget renders its own content, unwrapped.
    expect(good.shadowRoot!.querySelector(".ok")?.textContent).toBe("fine");
    expect(good.shadowRoot!.querySelector("hd-widget-frame[unavailable]")).toBeNull();

    errSpy.mockRestore();
    bad.remove();
    good.remove();
  });
});
