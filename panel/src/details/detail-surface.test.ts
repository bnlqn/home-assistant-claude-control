import { afterEach, describe, expect, it, vi } from "vitest";
import type { WidgetConfig } from "../config/schema.js";
import type { HassEntity, HomeAssistant } from "../types/hass.js";
import { ClimateWidget } from "../widgets/climate.js";
import { HdDetail } from "./detail-surface.js";

function entity(entityId: string, state: string, attributes: Record<string, unknown>): HassEntity {
  return {
    entity_id: entityId,
    state,
    attributes,
    last_changed: "2026-08-20T10:00:00Z",
    last_updated: "2026-08-20T10:00:00Z",
  };
}

afterEach(() => {
  document.body.replaceChildren();
  vi.restoreAllMocks();
});

describe("HdDetail registered renderer integration", () => {
  it("mounts the climate domain renderer inside the adaptive surface", async () => {
    const climate = entity("climate.test", "cool", {
      friendly_name: "Test climate",
      temperature: 20,
      current_temperature: 24,
      hvac_modes: ["off", "cool"],
      fan_modes: ["auto", "high"],
      supported_features: 1 | 8,
    });
    const economy = entity("switch.eco", "on", { friendly_name: "Economy" });
    const hass = {
      states: { [climate.entity_id]: climate, [economy.entity_id]: economy },
      connected: true,
    } as unknown as HomeAssistant;
    const config: WidgetConfig = {
      id: "climate-detail",
      type: "climate",
      entity: climate.entity_id,
      size: { compact: "2x1", medium: "2x1", wide: "2x2" },
      options: { switches: [{ entity: economy.entity_id, name: "Economy" }] },
    };
    const detail = new HdDetail();
    detail.hass = hass;
    detail.entityId = climate.entity_id;
    detail.config = config;
    detail.open = true;
    document.body.appendChild(detail);

    await detail.updateComplete;

    const surface = detail.shadowRoot!.querySelector("hd-surface") as HTMLElement & { open: boolean };
    expect(surface.open).toBe(true);
    expect(detail.shadowRoot!.querySelectorAll("hd-segmented")).toHaveLength(2);
    expect(detail.shadowRoot!.textContent).toContain("Economy");
  });

  it("opens the registered climate detail from the widget frame", async () => {
    const climate = entity("climate.test", "cool", {
      friendly_name: "Test climate",
      temperature: 20,
      current_temperature: 24,
      hvac_modes: ["off", "cool"],
      supported_features: 1,
    });
    const hass = {
      states: { [climate.entity_id]: climate },
      connected: true,
    } as unknown as HomeAssistant;
    const config: WidgetConfig = {
      id: "climate-widget",
      type: "climate",
      entity: climate.entity_id,
      size: { compact: "2x1", medium: "2x1", wide: "2x2" },
    };
    const widget = new ClimateWidget();
    widget.hass = hass;
    widget.config = config;
    document.body.appendChild(widget);

    await widget.updateComplete;
    const frame = widget.shadowRoot!.querySelector("hd-widget-frame") as HTMLElement & {
      updateComplete: Promise<boolean>;
    };
    await frame.updateComplete;

    const opened = vi.fn();
    widget.addEventListener("hd-open-detail", opened);
    frame.shadowRoot!.querySelector<HTMLButtonElement>(".icon-btn")!.click();

    expect(opened).toHaveBeenCalledOnce();
    expect((opened.mock.calls[0][0] as CustomEvent).detail).toEqual({
      entityId: climate.entity_id,
      config,
      type: "climate",
    });
  });
});
