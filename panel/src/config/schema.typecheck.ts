import type {
  WidgetConfig,
  WidgetConfigOf,
} from "./schema.js";
import type { ClimateWidgetOptions, EnergyWidgetOptions } from "./widget-options.js";

type Assert<Condition extends true> = Condition;
type DoesNotHave<Shape, Key extends PropertyKey> = Key extends keyof Shape ? false : true;

// These assertions are intentionally compile-time only. If an option leaks
// between discriminated widget variants, `npm run typecheck` fails here.
type ClimateRejectsEnergyOptions = Assert<DoesNotHave<ClimateWidgetOptions, "gridPower">>;
type EnergyRejectsClimateOptions = Assert<DoesNotHave<EnergyWidgetOptions, "switches">>;
type LightRejectsAllOptions = Assert<
  WidgetConfigOf<"light">["options"] extends undefined ? true : false
>;

const size = { compact: "2x1", medium: "2x1", wide: "2x2" } as const;

const validTypedWidgetFixtures: WidgetConfig[] = [
  {
    id: "typed-climate",
    type: "climate",
    entity: "climate.test",
    size,
    options: { switches: [{ entity: "switch.eco", name: "Economy" }] },
  },
  {
    id: "typed-energy",
    type: "energy",
    size,
    options: { gridPower: "sensor.grid_power" },
  },
];

const invalidTypedWidgetFixtures: WidgetConfig[] = [
  {
    id: "invalid-climate",
    type: "climate",
    entity: "climate.test",
    size,
    options: {
      // @ts-expect-error Energy options cannot be assigned to a climate widget.
      gridPower: "sensor.grid_power",
    },
  },
  // @ts-expect-error Light widgets do not accept an options bag.
  {
    id: "invalid-light",
    type: "light",
    entity: "light.test",
    size: { compact: "1x1", medium: "1x1", wide: "1x1" },
    options: { switches: [] },
  },
];

void validTypedWidgetFixtures;
void invalidTypedWidgetFixtures;

export type WidgetOptionContractAssertions =
  | ClimateRejectsEnergyOptions
  | EnergyRejectsClimateOptions
  | LightRejectsAllOptions;
