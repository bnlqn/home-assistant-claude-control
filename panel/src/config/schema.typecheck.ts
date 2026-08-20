import type {
  WidgetConfig,
  WidgetConfigOf,
} from "./schema.js";
import type {
  ActionWidgetOptions,
  ClimateWidgetOptions,
  EnergyWidgetOptions,
  MetricTileWidgetOptions,
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
type BinarySensorRejectsAllOptions = Assert<
  WidgetConfigOf<"binary_sensor">["options"] extends undefined ? true : false
>;
type PersonRejectsAllOptions = Assert<
  WidgetConfigOf<"person">["options"] extends undefined ? true : false
>;
type CameraRejectsAllOptions = Assert<
  WidgetConfigOf<"camera">["options"] extends undefined ? true : false
>;
type SceneRejectsAllOptions = Assert<
  WidgetConfigOf<"scene">["options"] extends undefined ? true : false
>;
type ScriptRejectsAllOptions = Assert<
  WidgetConfigOf<"script">["options"] extends undefined ? true : false
>;
type ButtonRejectsAllOptions = Assert<
  WidgetConfigOf<"button">["options"] extends undefined ? true : false
>;
type AlarmRejectsAllOptions = Assert<
  WidgetConfigOf<"alarm">["options"] extends undefined ? true : false
>;
type ActionRejectsClimateOptions = Assert<DoesNotHave<ActionWidgetOptions, "switches">>;
type MetricTileRejectsEnergyOptions = Assert<DoesNotHave<MetricTileWidgetOptions, "gridPower">>;
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
  {
    id: "typed-binary-sensor",
    type: "binary_sensor",
    entity: "binary_sensor.test",
    size: { compact: "1x1", medium: "1x1", wide: "2x1" },
  },
  {
    id: "typed-person",
    type: "person",
    entity: "person.test",
    size: { compact: "1x1", medium: "1x1", wide: "2x1" },
  },
  {
    id: "typed-camera",
    type: "camera",
    entity: "camera.test",
    size,
  },
  {
    id: "typed-scene",
    type: "scene",
    entity: "scene.test",
    size: { compact: "1x1", medium: "1x1", wide: "2x1" },
  },
  {
    id: "typed-script",
    type: "script",
    entity: "script.test",
    size: { compact: "1x1", medium: "1x1", wide: "2x1" },
  },
  {
    id: "typed-button",
    type: "button",
    entity: "button.test",
    size: { compact: "1x1", medium: "1x1", wide: "2x1" },
  },
  {
    id: "typed-alarm",
    type: "alarm",
    entity: "alarm_control_panel.test",
    size,
  },
  {
    id: "typed-action",
    type: "action",
    name: "Lights off",
    size: { compact: "1x1", medium: "1x1", wide: "2x1" },
    options: { service: "light.turn_off", target: { entity_id: "light.test" } },
  },
  {
    id: "typed-metric",
    type: "metrictile",
    entity: "sensor.test",
    size: { compact: "1x1", medium: "1x1", wide: "2x1" },
    options: { accent: "accent", format: "power", status: "gridDirection" },
  },
  {
    id: "typed-group",
    type: "group",
    size: { compact: "4x2", medium: "4x2", wide: "4x2" },
    options: {
      variant: "tiles",
      children: [{
        id: "typed-group-light",
        type: "light",
        entity: "light.test",
        size: { compact: "1x1", medium: "1x1", wide: "1x1" },
      }],
    },
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
  {
    id: "invalid-vacuum",
    type: "vacuum",
    entity: "vacuum.test",
    size,
    // @ts-expect-error Vacuum brand is deliberately restricted.
    options: {
      brand: "unknown",
    },
  },
  {
    id: "invalid-media",
    type: "media",
    entity: "media_player.test",
    size,
    // @ts-expect-error Media widgets do not accept an options bag.
    options: { source: "TV" },
  },
  {
    id: "invalid-sensor",
    type: "sensor",
    entity: "sensor.test",
    size,
    // @ts-expect-error Sensor widgets do not accept an options bag.
    options: { hours: 48 },
  },
  {
    id: "invalid-weather",
    type: "weather",
    entity: "weather.test",
    size,
    // @ts-expect-error Weather widgets do not accept an options bag.
    options: { forecast: "hourly" },
  },
  {
    id: "invalid-binary-sensor",
    type: "binary_sensor",
    entity: "binary_sensor.test",
    size: { compact: "1x1", medium: "1x1", wide: "2x1" },
    // @ts-expect-error Binary-sensor widgets do not accept an options bag.
    options: { activeLabel: "Open" },
  },
  {
    id: "invalid-person",
    type: "person",
    entity: "person.test",
    size: { compact: "1x1", medium: "1x1", wide: "2x1" },
    // @ts-expect-error Person widgets do not accept an options bag.
    options: { showMap: true },
  },
  {
    id: "invalid-camera",
    type: "camera",
    entity: "camera.test",
    size,
    // @ts-expect-error Camera widgets do not accept an options bag.
    options: { refreshSeconds: 5 },
  },
  {
    id: "invalid-scene",
    type: "scene",
    entity: "scene.test",
    size: { compact: "1x1", medium: "1x1", wide: "2x1" },
    // @ts-expect-error Scene widgets do not accept an options bag.
    options: { transition: 3 },
  },
  {
    id: "invalid-action",
    type: "action",
    size: { compact: "1x1", medium: "1x1", wide: "2x1" },
    // @ts-expect-error Action widgets require a service.
    options: { target: { entity_id: "light.test" } },
  },
  {
    id: "invalid-metric",
    type: "metrictile",
    entity: "sensor.test",
    size: { compact: "1x1", medium: "1x1", wide: "2x1" },
    // @ts-expect-error Metric tiles reject Energy widget options.
    options: { gridPower: "sensor.grid_power" },
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
  | BinarySensorRejectsAllOptions
  | PersonRejectsAllOptions
  | CameraRejectsAllOptions
  | SceneRejectsAllOptions
  | ScriptRejectsAllOptions
  | ButtonRejectsAllOptions
  | AlarmRejectsAllOptions
  | ActionRejectsClimateOptions
  | MetricTileRejectsEnergyOptions
  | VacuumRejectsEnergyOptions;
