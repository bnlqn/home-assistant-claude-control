import type {
  WidgetConfig,
  WidgetConfigOf,
} from "./schema.js";
import type {
  ClimateWidgetOptions,
  EnergyWidgetOptions,
  VacuumWidgetOptions,
} from "./widget-options.js";

type Assert<Condition extends true> = Condition;
type DoesNotHave<Shape, Key extends PropertyKey> = Key extends keyof Shape ? false : true;

// These assertions are intentionally compile-time only. If an option leaks
// between discriminated widget variants, `npm run typecheck` fails here.
type ClimateRejectsEnergyOptions = Assert<DoesNotHave<ClimateWidgetOptions, "gridPower">>;
type EnergyRejectsClimateOptions = Assert<DoesNotHave<EnergyWidgetOptions, "switches">>;
type LightRejectsAllOptions = Assert<
  WidgetConfigOf<"light">["options"] extends undefined ? true : false
>;
type SwitchRejectsAllOptions = Assert<
  WidgetConfigOf<"switch">["options"] extends undefined ? true : false
>;
type MediaRejectsAllOptions = Assert<
  WidgetConfigOf<"media">["options"] extends undefined ? true : false
>;
type SensorRejectsAllOptions = Assert<
  WidgetConfigOf<"sensor">["options"] extends undefined ? true : false
>;
type WeatherRejectsAllOptions = Assert<
  WidgetConfigOf<"weather">["options"] extends undefined ? true : false
>;
type VacuumRejectsEnergyOptions = Assert<DoesNotHave<VacuumWidgetOptions, "gridPower">>;

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
  {
    id: "typed-vacuum",
    type: "vacuum",
    entity: "vacuum.test",
    size,
    options: { brand: "roborock", hero: true },
  },
  {
    id: "typed-media",
    type: "media",
    entity: "media_player.test",
    size,
  },
  {
    id: "typed-sensor",
    type: "sensor",
    entity: "sensor.test",
    size,
  },
  {
    id: "typed-weather",
    type: "weather",
    entity: "weather.test",
    size,
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
  // @ts-expect-error Switch widgets do not accept an options bag.
  {
    id: "invalid-switch",
    type: "switch",
    entity: "switch.test",
    size: { compact: "1x1", medium: "1x1", wide: "1x1" },
    options: { hero: true },
  },
  // @ts-expect-error Vacuum brand is deliberately restricted.
  {
    id: "invalid-vacuum",
    type: "vacuum",
    entity: "vacuum.test",
    size,
    options: {
      brand: "unknown",
    },
  },
  // @ts-expect-error Media widgets do not accept an options bag.
  {
    id: "invalid-media",
    type: "media",
    entity: "media_player.test",
    size,
    options: { source: "TV" },
  },
  // @ts-expect-error Sensor widgets do not accept an options bag.
  {
    id: "invalid-sensor",
    type: "sensor",
    entity: "sensor.test",
    size,
    options: { hours: 48 },
  },
  // @ts-expect-error Weather widgets do not accept an options bag.
  {
    id: "invalid-weather",
    type: "weather",
    entity: "weather.test",
    size,
    options: { forecast: "hourly" },
  },
];

void validTypedWidgetFixtures;
void invalidTypedWidgetFixtures;

export type WidgetOptionContractAssertions =
  | ClimateRejectsEnergyOptions
  | EnergyRejectsClimateOptions
  | LightRejectsAllOptions
  | SwitchRejectsAllOptions
  | MediaRejectsAllOptions
  | SensorRejectsAllOptions
  | WeatherRejectsAllOptions
  | VacuumRejectsEnergyOptions;
