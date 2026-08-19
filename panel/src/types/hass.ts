/**
 * Minimal, dependency-free typings for the Home Assistant frontend `hass`
 * object handed to a custom panel. We intentionally model only the public,
 * stable surface we consume so the panel is not coupled to private internals.
 *
 * Reference: https://developers.home-assistant.io/docs/frontend/data/
 */

export interface HassEntityAttributes {
  friendly_name?: string;
  icon?: string;
  unit_of_measurement?: string;
  device_class?: string;
  supported_features?: number;
  entity_picture?: string;
  assumed_state?: boolean;
  [key: string]: unknown;
}

export interface HassEntity {
  entity_id: string;
  state: string;
  attributes: HassEntityAttributes;
  last_changed: string;
  last_updated: string;
  context?: { id: string; parent_id: string | null; user_id: string | null };
}

export type HassEntities = Record<string, HassEntity>;

export interface HassServiceTarget {
  entity_id?: string | string[];
  device_id?: string | string[];
  area_id?: string | string[];
}

export interface HassUser {
  id: string;
  name: string;
  is_admin: boolean;
  is_owner: boolean;
}

export interface HassThemes {
  darkMode?: boolean;
  theme?: string;
  themes?: Record<string, unknown>;
}

export interface FrontendLocaleData {
  language: string;
  number_format?: string;
  time_format?: string;
  date_format?: string;
  first_weekday?: string;
}

export interface HassConfig {
  latitude: number;
  longitude: number;
  unit_system: { length: string; mass: string; temperature: string; volume: string };
  location_name: string;
  time_zone: string;
  version: string;
  currency?: string;
}

export interface HassConnection {
  subscribeEvents<T>(callback: (ev: T) => void, eventType: string): Promise<() => void>;
  subscribeMessage<T>(callback: (msg: T) => void, subscribeMessage: unknown): Promise<() => void>;
  connected: boolean;
}

/**
 * The `hass` object. Method availability varies slightly across HA versions;
 * everything that may be absent on older cores is marked optional and the
 * panel degrades gracefully (see `home-assistant/state-formatting.ts`).
 */
export interface HomeAssistant {
  states: HassEntities;
  config: HassConfig;
  themes: HassThemes;
  selectedTheme?: unknown;
  panels?: Record<string, unknown>;
  user?: HassUser;
  language: string;
  locale: FrontendLocaleData;
  connected: boolean;
  connection: HassConnection;

  callService(
    domain: string,
    service: string,
    serviceData?: Record<string, unknown>,
    target?: HassServiceTarget,
  ): Promise<unknown>;

  callWS<T>(msg: Record<string, unknown>): Promise<T>;

  callApi<T>(method: string, path: string, parameters?: Record<string, unknown>): Promise<T>;

  /** Locale-aware helpers present on modern cores; optional for safety. */
  localize?: (key: string, ...args: unknown[]) => string;
  formatEntityState?: (stateObj: HassEntity, state?: string) => string;
  formatEntityAttributeValue?: (stateObj: HassEntity, attribute: string, value?: unknown) => string;
  formatEntityAttributeName?: (stateObj: HassEntity, attribute: string) => string;

  /** Auth surface — used only to build authenticated camera/proxy URLs. */
  auth?: { data?: { access_token?: string }; external?: unknown };
  hassUrl?: (path?: string) => string;
}

/** Home Assistant panel element properties, per the custom-panel contract. */
export interface PanelInfo<TConfig = Record<string, unknown>> {
  component_name: string;
  icon: string | null;
  title: string | null;
  config: TConfig | null;
  url_path: string;
}

export interface Route {
  prefix: string;
  path: string;
}
