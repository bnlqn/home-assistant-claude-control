import type { DashboardConfig } from "./schema.js";

/**
 * ============================================================================
 *  THE ONE FILE YOU EDIT.  Every entity id in the whole dashboard lives here.
 * ============================================================================
 *
 * This config is pre-populated with the REAL entities discovered on this Home
 * Assistant instance (areas, lights, climate, media, Tesla, energy, …) so the
 * panel works the moment it is deployed. Treat the ids below as your starting
 * point and edit freely.
 *
 * ----------------------------------------------------------------------------
 *  HOW TO ADD A ROOM
 * ----------------------------------------------------------------------------
 *  1. Add a `ViewConfig` object to `views` with `type: "room"`, a unique `id`
 *     (becomes the URL: /home-dashboard/<id>), a `label`, and an `icon`.
 *  2. Give it a `widgets: []` array. The room automatically appears in the
 *     shell navigation — rooms are always full views, never cards.
 *
 *  HOW TO ADD A WIDGET
 *  1. Add a `WidgetConfig` to a view's `widgets` array.
 *  2. Pick a `type` (see the union in schema.ts / the README catalogue).
 *  3. Point `entity` at a real entity_id (composite types like `energy` and
 *     `action` take their entities via `options` instead).
 *  4. Choose a `size` for each breakpoint. Only sizes the widget type supports
 *     are allowed — an unsupported size is rejected at startup with a message.
 *
 *  CUSTOM LABEL / ICON:  add `name: "…"` and/or `icon: "mdi:…"` to any widget.
 *  CONFIRMATION:  add `requiresConfirmation: true` to guard a quick action.
 *
 *  Sizes are "1x1" | "2x1" | "1x2" | "2x2"  (WIDTHxHEIGHT in grid units).
 *  Breakpoints resolve against the PANEL's width, not the screen:
 *    compact ≈ phone · medium ≈ tablet · wide ≈ desktop / wall display.
 *
 *  ▶ PLACEHOLDER PATTERN — to hand this to a different home, replace ids with
 *    your own. Anything containing REPLACE_ME renders an explicit
 *    "needs configuration" state instead of crashing. Example:
 *
 *      { id: "my-light", type: "light",
 *        entity: "light.REPLACE_ME_MAIN_LIGHT",
 *        size: { compact: "1x1", medium: "1x1", wide: "1x1" } }
 */
export const dashboardConfig: DashboardConfig = {
  defaultView: "overview",
  title: "Home",

  // Wall-tablet / kiosk behaviour. Off by default; opt-in per install.
  kiosk: {
    enabled: false,
    hideHomeAssistantSidebar: false,
    preventScreenSelection: false,
  },

  views: [
    // ========================================================================
    //  OVERVIEW — whole-home glance. Global widgets only; rooms are NOT shown
    //  as cards here, they are their own destinations in the nav.
    // ========================================================================
    {
      id: "overview",
      type: "overview",
      label: "Home",
      icon: "mdi:home-variant",
      subtitle: "Welcome home",
      widgets: [
        {
          id: "ov-weather",
          type: "weather",
          entity: "weather.forecast_home",
          size: { compact: "2x2", medium: "2x2", wide: "2x2" },
        },
        {
          id: "ov-energy",
          type: "energy",
          name: "Energy",
          size: { compact: "2x2", medium: "2x2", wide: "2x2" },
          options: {
            gridPower: "sensor.p1_meter_power",
            solarPower: "sensor.goodwe_pv_power",
            solarToday: "sensor.goodwe_today_s_pv_generation",
            forecastEndOfDay: "sensor.energy_forecast_end_of_day",
            solarForecastRemaining: "sensor.helios_forecast_energy_today_remaining",
          },
        },
        {
          id: "ov-all-lights",
          type: "light",
          entity: "light.all_lights",
          name: "All lights",
          size: { compact: "2x1", medium: "2x1", wide: "2x1" },
        },
        {
          id: "ov-lights-off",
          type: "action",
          name: "All lights off",
          icon: "mdi:lightbulb-group-off",
          size: { compact: "1x1", medium: "1x1", wide: "1x1" },
          options: {
            service: "light.turn_off",
            target: { entity_id: "light.all_lights" },
            activeIcon: "mdi:lightbulb-off",
          },
        },
        {
          id: "ov-goodnight",
          type: "script",
          entity: "script.goodnight",
          name: "Goodnight",
          icon: "mdi:weather-night",
          size: { compact: "1x1", medium: "1x1", wide: "1x1" },
        },
        {
          id: "ov-presence",
          type: "person",
          entity: "person.ben",
          size: { compact: "1x1", medium: "1x1", wide: "1x1" },
        },
        {
          id: "ov-vacuum",
          type: "vacuum",
          entity: "vacuum.roborock_s8_pro_ultra",
          name: "Vacuum",
          size: { compact: "1x1", medium: "2x1", wide: "2x1" },
        },
        {
          id: "ov-tv",
          type: "media",
          entity: "media_player.tv_tv",
          name: "TV",
          size: { compact: "2x1", medium: "2x2", wide: "2x2" },
        },
        {
          id: "ov-car-battery",
          type: "sensor",
          entity: "sensor.other_tesla_model_3_battery_level",
          name: "Car battery",
          icon: "mdi:car-electric",
          size: { compact: "1x1", medium: "1x1", wide: "1x1" },
        },
        {
          id: "ov-waste",
          type: "sensor",
          entity: "sensor.next_collection",
          name: "Waste pickup",
          icon: "mdi:recycle",
          size: { compact: "1x1", medium: "1x1", wide: "1x1" },
        },
      ],
    },

    // ========================================================================
    //  ROOMS — one dedicated view/route per area.
    // ========================================================================
    {
      id: "living-room",
      type: "room",
      label: "Living room",
      icon: "mdi:sofa-outline",
      widgets: [
        {
          id: "lr-main",
          type: "light",
          entity: "light.living_room_living_room",
          name: "Living room",
          size: { compact: "2x1", medium: "2x1", wide: "2x1" },
        },
        {
          id: "lr-lamp",
          type: "light",
          entity: "light.living_room_living_room_table_lamp",
          name: "Table lamp",
          size: { compact: "1x1", medium: "1x1", wide: "1x1" },
        },
        {
          id: "lr-movie",
          type: "scene",
          entity: "scene.living_room_living_room_movie",
          name: "Movie",
          icon: "mdi:movie-open",
          size: { compact: "1x1", medium: "1x1", wide: "1x1" },
        },
        {
          id: "lr-tv",
          type: "media",
          entity: "media_player.tv_tv",
          name: "TV",
          size: { compact: "2x1", medium: "2x2", wide: "2x2" },
        },
        {
          id: "lr-speaker",
          type: "media",
          entity: "media_player.ht_a9_2",
          name: "HT-A9",
          size: { compact: "2x1", medium: "2x1", wide: "2x1" },
        },
        {
          id: "lr-vacuum",
          type: "vacuum",
          entity: "vacuum.roborock_s8_pro_ultra",
          size: { compact: "2x1", medium: "2x2", wide: "2x2" },
        },
      ],
    },
    {
      id: "kitchen",
      type: "room",
      label: "Kitchen",
      icon: "mdi:fridge-outline",
      widgets: [
        {
          id: "k-main",
          type: "light",
          entity: "light.kitchen",
          name: "Kitchen",
          size: { compact: "2x1", medium: "2x1", wide: "2x1" },
        },
        {
          id: "k-adaptive",
          type: "switch",
          entity: "switch.kitchen_adaptive_lighting_kitchen",
          name: "Adaptive lighting",
          icon: "mdi:theme-light-dark",
          size: { compact: "1x1", medium: "1x1", wide: "1x1" },
        },
      ],
    },
    {
      id: "dining-room",
      type: "room",
      label: "Dining room",
      icon: "mdi:silverware-fork-knife",
      widgets: [
        {
          id: "dr-main",
          type: "light",
          entity: "light.dining",
          name: "Dining",
          size: { compact: "2x1", medium: "2x1", wide: "2x1" },
        },
        {
          id: "dr-adaptive",
          type: "switch",
          entity: "switch.dining_adaptive_lighting_dining",
          name: "Adaptive lighting",
          icon: "mdi:theme-light-dark",
          size: { compact: "1x1", medium: "1x1", wide: "1x1" },
        },
      ],
    },
    {
      id: "bedroom",
      type: "room",
      label: "Bedroom",
      icon: "mdi:bed-outline",
      widgets: [
        {
          id: "br-main",
          type: "light",
          entity: "light.bedroom_bedroom",
          name: "Bedroom",
          size: { compact: "2x1", medium: "2x1", wide: "2x1" },
        },
        {
          id: "br-ben",
          type: "light",
          entity: "light.bedroom_bens_bed_table",
          name: "Ben’s table",
          size: { compact: "1x1", medium: "1x1", wide: "1x1" },
        },
        {
          id: "br-ilona",
          type: "light",
          entity: "light.bedroom_ilonas_bed_table",
          name: "Ilona’s table",
          size: { compact: "1x1", medium: "1x1", wide: "1x1" },
        },
        {
          id: "br-read",
          type: "scene",
          entity: "scene.bedroom_bedroom_read",
          name: "Read",
          icon: "mdi:book-open-page-variant",
          size: { compact: "1x1", medium: "1x1", wide: "1x1" },
        },
        {
          id: "br-night",
          type: "scene",
          entity: "scene.bedroom_bedroom_nightlight",
          name: "Nightlight",
          icon: "mdi:weather-night",
          size: { compact: "1x1", medium: "1x1", wide: "1x1" },
        },
      ],
    },
    {
      id: "mias-bedroom",
      type: "room",
      label: "Mia’s bedroom",
      icon: "mdi:teddy-bear",
      widgets: [
        {
          id: "mia-main",
          type: "light",
          entity: "light.mias_bedroom_mias_bedroom",
          name: "Mia’s bedroom",
          size: { compact: "2x1", medium: "2x1", wide: "2x1" },
        },
      ],
    },
    {
      id: "juliens-bedroom",
      type: "room",
      label: "Julien’s bedroom",
      icon: "mdi:teddy-bear",
      widgets: [
        {
          id: "jul-main",
          type: "light",
          entity: "light.juliens_bedroom_juliens_bedroom",
          name: "Julien’s bedroom",
          size: { compact: "2x1", medium: "2x1", wide: "2x1" },
        },
        {
          id: "jul-go",
          type: "light",
          entity: "light.juliens_bedroom_hue_go_julien",
          name: "Hue Go",
          size: { compact: "1x1", medium: "1x1", wide: "1x1" },
        },
      ],
    },
    {
      id: "office",
      type: "room",
      label: "Office",
      icon: "mdi:desk",
      widgets: [
        {
          id: "of-airco",
          type: "climate",
          entity: "climate.ec3a56bc6527",
          name: "Airco",
          size: { compact: "2x2", medium: "2x2", wide: "2x2" },
        },
        {
          id: "of-main",
          type: "light",
          entity: "light.bens_office_bens_office",
          name: "Office",
          size: { compact: "2x1", medium: "2x1", wide: "2x1" },
        },
        {
          id: "of-screen",
          type: "light",
          entity: "light.bens_office_bens_screen",
          name: "Screen light",
          size: { compact: "1x1", medium: "1x1", wide: "1x1" },
        },
        {
          id: "of-printer",
          type: "sensor",
          entity: "sensor.hp_laserjet_pro_m404_m405",
          name: "Printer",
          icon: "mdi:printer",
          size: { compact: "1x1", medium: "1x1", wide: "1x1" },
        },
      ],
    },
    {
      id: "playground",
      type: "room",
      label: "Playground",
      icon: "mdi:gamepad-variant-outline",
      widgets: [
        {
          id: "pg-main",
          type: "light",
          entity: "light.playground_playground",
          name: "Playground",
          size: { compact: "2x1", medium: "2x1", wide: "2x1" },
        },
      ],
    },
    {
      id: "hallway",
      type: "room",
      label: "Hallway",
      icon: "mdi:coat-rack",
      widgets: [
        {
          id: "hw-main",
          type: "light",
          entity: "light.hallway_hallway",
          name: "Hallway",
          size: { compact: "2x1", medium: "2x1", wide: "2x1" },
        },
        {
          id: "hw-power",
          type: "sensor",
          entity: "sensor.p1_meter_power",
          name: "Grid power",
          icon: "mdi:transmission-tower",
          size: { compact: "1x1", medium: "1x1", wide: "1x1" },
        },
      ],
    },
    {
      id: "corridor",
      type: "room",
      label: "Corridor",
      icon: "mdi:stairs",
      widgets: [
        {
          id: "co-main",
          type: "light",
          entity: "light.corridor_corridor",
          name: "Corridor",
          size: { compact: "2x1", medium: "2x1", wide: "2x1" },
        },
      ],
    },
    {
      id: "car",
      type: "room",
      label: "Car",
      icon: "mdi:car-electric-outline",
      subtitle: "Tesla Model 3",
      widgets: [
        {
          id: "car-battery",
          type: "sensor",
          entity: "sensor.other_tesla_model_3_battery_level",
          name: "Battery",
          icon: "mdi:battery-charging",
          size: { compact: "2x1", medium: "2x1", wide: "2x1" },
        },
        {
          id: "car-climate",
          type: "climate",
          entity: "climate.other_tesla_model_3_climate",
          name: "Climate",
          size: { compact: "2x1", medium: "2x1", wide: "2x1" },
        },
        {
          id: "car-lock",
          type: "lock",
          entity: "lock.other_tesla_model_3_lock",
          name: "Doors",
          // Unlocking a car is sensitive → always confirm.
          requiresConfirmation: true,
          size: { compact: "1x1", medium: "1x1", wide: "1x1" },
        },
        {
          id: "car-sentry",
          type: "switch",
          entity: "switch.other_tesla_model_3_sentry_mode",
          name: "Sentry mode",
          icon: "mdi:cctv",
          size: { compact: "1x1", medium: "1x1", wide: "1x1" },
        },
        {
          id: "car-trunk",
          type: "cover",
          entity: "cover.other_tesla_model_3_trunk",
          name: "Trunk",
          size: { compact: "1x1", medium: "1x1", wide: "1x1" },
        },
        {
          id: "car-charger",
          type: "sensor",
          entity: "sensor.tesla_wall_connector_status",
          name: "Wall connector",
          icon: "mdi:ev-station",
          size: { compact: "1x1", medium: "1x1", wide: "1x1" },
        },
      ],
    },

    // ========================================================================
    //  SYSTEM VIEW — Energy. Not a room; a dedicated destination.
    // ========================================================================
    {
      id: "energy",
      type: "system",
      label: "Energy",
      icon: "mdi:lightning-bolt-outline",
      widgets: [
        // Hero: the live power-flow diagram (Grid ↔ Solar ↔ House ↔ Car). The
        // stat tiles below are its numeric breakdown.
        {
          id: "en-flow",
          type: "powerflow",
          name: "Power flow",
          // Full-width 2x2 on a phone; the roomier XL square on tablet/desktop,
          // where the size-capped nodes stay put and the gaps open up.
          size: { compact: "2x2", medium: "3x3", wide: "3x3" },
          options: {
            gridPower: "sensor.p1_meter_power", // signed W: + import / − export (HomeWizard P1)
            solarPower: "sensor.goodwe_pv_power",
            houseConsumption: "sensor.house_power_consumption",
            carPower: "sensor.tesla_wall_connector_total_power", // kW, auto-normalized
            carPowerAlt: "sensor.other_tesla_model_3_charger_power", // kW fallback
            carActive: "sensor.tesla_wall_connector_status",
            carActiveAlt: "sensor.other_tesla_model_3_charging",
          },
        },
        {
          id: "en-grid-now",
          type: "sensor",
          entity: "sensor.p1_meter_power",
          name: "Grid now",
          icon: "mdi:transmission-tower",
          size: { compact: "2x1", medium: "2x1", wide: "2x1" },
        },
        {
          id: "en-solar-now",
          type: "sensor",
          entity: "sensor.goodwe_pv_power",
          name: "Solar now",
          icon: "mdi:solar-power",
          size: { compact: "1x1", medium: "1x1", wide: "1x1" },
        },
        {
          id: "en-house-now",
          type: "sensor",
          entity: "sensor.house_power_consumption",
          name: "House now",
          icon: "mdi:home-variant",
          size: { compact: "1x1", medium: "1x1", wide: "1x1" },
        },
        {
          id: "en-solar-today",
          type: "sensor",
          entity: "sensor.goodwe_today_s_pv_generation",
          name: "Solar today",
          icon: "mdi:solar-power-variant",
          size: { compact: "1x1", medium: "1x1", wide: "1x1" },
        },
        {
          id: "en-forecast",
          type: "sensor",
          entity: "sensor.energy_forecast_end_of_day",
          name: "Forecast use",
          icon: "mdi:chart-bell-curve",
          size: { compact: "1x1", medium: "1x1", wide: "1x1" },
        },
        {
          id: "en-import",
          type: "sensor",
          entity: "sensor.p1_meter_energy_import",
          name: "Imported",
          icon: "mdi:transmission-tower-import",
          size: { compact: "1x1", medium: "1x1", wide: "1x1" },
        },
        {
          id: "en-export",
          type: "sensor",
          entity: "sensor.p1_meter_energy_export",
          name: "Exported",
          icon: "mdi:transmission-tower-export",
          size: { compact: "1x1", medium: "1x1", wide: "1x1" },
        },
        {
          id: "en-car-charger",
          type: "sensor",
          entity: "sensor.tesla_wall_connector_status",
          name: "EV charger",
          icon: "mdi:ev-station",
          size: { compact: "1x1", medium: "1x1", wide: "1x1" },
        },
      ],
    },
  ],
};
