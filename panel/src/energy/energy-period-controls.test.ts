import { describe, expect, it } from "vitest";
import "./energy-period-controls.js";
import type { EnergyPeriodControls, EnergyNavDetail } from "./energy-period-controls.js";
import { resolveEnergyPeriod, type EnergyPeriodRange } from "./energy-period.js";

const TZ = "Europe/Brussels";
const NOW = new Date("2026-08-21T10:00:00+02:00");

async function mount(range: EnergyPeriodRange, availability: string | null = null) {
  const el = document.createElement("hd-energy-period-controls") as EnergyPeriodControls;
  el.range = range;
  el.availability = availability;
  el.timeZone = TZ;
  document.body.appendChild(el);
  await el.updateComplete;
  return el;
}

function captureNav(el: EnergyPeriodControls): EnergyNavDetail[] {
  const events: EnergyNavDetail[] = [];
  el.addEventListener("hd-energy-nav", (e) => events.push((e as CustomEvent<EnergyNavDetail>).detail));
  return events;
}

function iconButton(el: EnergyPeriodControls, label: string): HTMLButtonElement {
  const host = [...el.shadowRoot!.querySelectorAll("hd-icon-button")].find(
    (b) => b.getAttribute("label") === label,
  )!;
  return host.shadowRoot!.querySelector("button") as HTMLButtonElement;
}

describe("hd-energy-period-controls", () => {
  it("emits a period change carrying the chosen granularity", async () => {
    const range = resolveEnergyPeriod({ period: "day", anchor: "2026-08-21" }, NOW, TZ);
    const el = await mount(range);
    const events = captureNav(el);
    el.shadowRoot!.querySelector("hd-segmented")!.dispatchEvent(
      new CustomEvent("hd-select", { detail: { value: "week" }, bubbles: true, composed: true }),
    );
    expect(events).toEqual([{ action: "period", period: "week" }]);
    el.remove();
  });

  it("steps backward and forward from the stepper buttons", async () => {
    const range = resolveEnergyPeriod({ period: "day", anchor: "2026-08-20" }, NOW, TZ);
    const el = await mount(range);
    const events = captureNav(el);
    iconButton(el, "Previous day").click();
    iconButton(el, "Next day").click();
    expect(events).toEqual([
      { action: "shift", offset: -1 },
      { action: "shift", offset: 1 },
    ]);
    el.remove();
  });

  it("disables next and hides the recovery button on the current period", async () => {
    const range = resolveEnergyPeriod({ period: "day", anchor: "2026-08-21" }, NOW, TZ);
    const el = await mount(range);
    expect(range.isCurrent).toBe(true);
    expect(iconButton(el, "Next day").disabled).toBe(true);
    expect(el.shadowRoot!.querySelector(".today")).toBeNull();
    el.remove();
  });

  it("enables next and shows a recovery button on a historical period", async () => {
    const range = resolveEnergyPeriod({ period: "week", anchor: "2026-08-04" }, NOW, TZ);
    const el = await mount(range);
    expect(range.isCurrent).toBe(false);
    expect(iconButton(el, "Next week").disabled).toBe(false);
    const today = el.shadowRoot!.querySelector(".today") as HTMLButtonElement;
    expect(today.textContent).toContain("This week");
    const events = captureNav(el);
    today.click();
    expect(events).toEqual([{ action: "today" }]);
    el.remove();
  });

  it("caps the date picker at today and emits the selected anchor", async () => {
    const range = resolveEnergyPeriod({ period: "day", anchor: "2026-08-10" }, NOW, TZ);
    const el = await mount(range);
    const input = el.shadowRoot!.querySelector("input[type=date]") as HTMLInputElement;
    expect(input.getAttribute("max")).toBe("2026-08-21");
    expect(input.value).toBe("2026-08-10");
    const events = captureNav(el);
    input.value = "2026-08-15";
    input.dispatchEvent(new Event("change"));
    expect(events).toEqual([{ action: "date", anchor: "2026-08-15" }]);
    el.remove();
  });

  it("renders the recorder availability chip when provided", async () => {
    const range = resolveEnergyPeriod({ period: "day", anchor: "2026-08-10" }, NOW, TZ);
    const el = await mount(range, "Partial");
    expect(el.shadowRoot!.querySelector(".availability")?.textContent).toContain("Partial");
    el.remove();
  });
});
