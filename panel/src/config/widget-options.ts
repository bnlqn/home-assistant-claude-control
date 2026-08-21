/** Typed option contracts for migrated widget configuration variants. */

export interface ClimateSwitchOption {
  entity: string;
  name: string;
}

export interface ClimateWidgetOptions {
  switches?: ClimateSwitchOption[];
}

export interface VacuumWidgetOptions {
  /** Enable the optional Roborock-branded 2×2 hero treatment. */
  brand?: "roborock";
  /** Backward-compatible explicit switch for the branded hero. */
  branded?: boolean;
  /** Generic full-bleed hero opt-in used by the shared breakout resolver. */
  hero?: boolean;
}

export interface ActionWidgetTarget {
  entity_id?: string | string[];
  device_id?: string | string[];
  area_id?: string | string[];
}

export interface ActionWidgetOptions {
  /** Home Assistant service in `domain.service` form. */
  service: `${string}.${string}`;
  /** Service data passed as the third `callService` argument. */
  data?: Record<string, unknown>;
  /** Home Assistant service target passed separately from service data. */
  target?: ActionWidgetTarget;
}

export interface EnergyWidgetOptions {
  gridPower?: string;
  solarPower?: string;
  solarToday?: string;
  forecastEndOfDay?: string;
  solarForecastRemaining?: string;
}

export interface PowerflowWidgetOptions {
  gridPower?: string;
  solarPower?: string;
  houseConsumption?: string;
  carPower?: string;
  carPowerAlt?: string;
  carActive?: string;
  carActiveAlt?: string;
}

/** Entity map for the bespoke Tesla solar-charging control system. */
export interface SolarChargingWidgetOptions {
  brand?: "tesla";
  branded?: boolean;
  /** input_boolean master arm for the solar-charging automation. */
  master?: string;
  /** binary_sensor — whether the vehicle is connected. */
  vehicleConnected?: string;
  chargingState?: string;
  wallStatus?: string;
  /** Live charging power sensor, in kW. */
  chargePower?: string;
  battery?: string;
  chargeLimit?: string;
  sessionEnergy?: string;
  chargeRate?: string;
  chargeCurrent?: string;
  startThreshold?: string;
  stopThreshold?: string;
  minCurrent?: string;
  deadband?: string;
}

export type EnergyChartPeriod = "day" | "week" | "month";

export interface EnergyChartWidgetOptions {
  gridImport?: string;
  gridExport?: string;
  solar?: string;
  car?: string;
  defaultPeriod?: EnergyChartPeriod;
}

export interface ElectricityTotalWidgetOptions {
  /** `total_increasing` grid-import energy statistic id. */
  importEnergy?: string;
  /** `total_increasing` grid-export energy statistic id. */
  exportEnergy?: string;
}

export interface SolarForecastWidgetOptions {
  /**
   * Sensor whose `forecast` attribute is an hourly/quarter-hourly
   * `[{ datetime, watts }]` series (e.g. a Solcast/Forecast.Solar style helper).
   * Filtered to the local day to draw the expected-production curve.
   */
  forecastPower?: string;
  /** Live PV power sensor (W) whose history draws the actual curve to `now`. */
  actualPower?: string;
  /** kWh already produced today (headline "so far"). */
  producedToday?: string;
  /** Predicted end-of-day production (kWh). */
  forecastTotal?: string;
  /** Forecast kWh still to come today (headline "to go"). */
  remaining?: string;
}

export type MetricTileAccent =
  | "idle"
  | "unavailable"
  | "accent"
  | "light"
  | "heat"
  | "cool"
  | "eco"
  | "warn"
  | "alert";

export interface MetricTileWidgetOptions {
  accent?: MetricTileAccent;
  format?: "power" | "percent" | "state";
  status?: "gridDirection" | "carCharge" | "none";
  chargeStatus?: string;
  connected?: string;
}
