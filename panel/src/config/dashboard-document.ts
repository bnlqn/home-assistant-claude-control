import {
  ALL_SIZES,
  ALL_WIDGET_TYPES,
  DISPLAY_PROFILE_BUCKETS,
  DISPLAY_PROFILES,
  type DashboardConfig,
  type DisplayProfile,
  type EnergyHeroConfig,
  type KioskConfig,
  type ViewType,
  type WidgetConfig,
  type WidgetSize,
} from "./schema.js";
import { validateConfig, type ValidationIssue } from "./validation.js";
import { widgetDefinition } from "../widgets/widget-definition.js";

export const DASHBOARD_DOCUMENT_VERSION = 1 as const;
const ENTITY_ID_RE = /^[a-z_]+\.[a-z0-9_]+$/;

type WithoutPlacement<Config> = Config extends WidgetConfig ? Omit<Config, "size"> : never;

/** Stable widget data, deliberately excluding page/profile placement. */
export type DashboardWidgetInstance = WithoutPlacement<WidgetConfig>;

export interface DashboardPlacementV1 {
  widgetId: string;
  order: number;
  size: WidgetSize;
  visible: boolean;
}

export type DashboardProfilePlacementsV1 = Record<DisplayProfile, DashboardPlacementV1[]>;

export interface DashboardPageV1 {
  id: string;
  type: ViewType;
  label: string;
  icon: string;
  subtitle?: string;
  hero?: EnergyHeroConfig;
  placements: DashboardProfilePlacementsV1;
}

export interface DashboardDocumentV1 {
  version: typeof DASHBOARD_DOCUMENT_VERSION;
  defaultPageId: string;
  title?: string;
  kiosk?: KioskConfig;
  widgets: DashboardWidgetInstance[];
  pages: DashboardPageV1[];
}

export interface DashboardDocumentValidationResult {
  ok: boolean;
  issues: ValidationIssue[];
  document?: DashboardDocumentV1;
}

export interface DashboardDocumentLoadResult {
  document: DashboardDocumentV1;
  issues: ValidationIssue[];
  usedFallback: boolean;
}

/** One-time bridge from the current TypeScript config to serializable v1 data. */
export function dashboardConfigToDocument(config: DashboardConfig): DashboardDocumentV1 {
  const widgets = config.views.flatMap((view) => view.widgets.map(withoutPlacement));
  const pages = config.views.map((view): DashboardPageV1 => {
    const placements = Object.fromEntries(
      DISPLAY_PROFILES.map((profile) => {
        const bucket = DISPLAY_PROFILE_BUCKETS[profile];
        return [profile, view.widgets.map((widget, order): DashboardPlacementV1 => ({
          widgetId: widget.id,
          order,
          size: widget.size[bucket],
          visible: true,
        }))];
      }),
    ) as DashboardProfilePlacementsV1;
    return {
      id: view.id,
      type: view.type,
      label: view.label,
      icon: view.icon,
      ...(view.subtitle ? { subtitle: view.subtitle } : {}),
      ...(view.hero ? { hero: view.hero } : {}),
      placements,
    };
  });

  return {
    version: DASHBOARD_DOCUMENT_VERSION,
    defaultPageId: config.defaultView,
    ...(config.title ? { title: config.title } : {}),
    ...(config.kiosk ? { kiosk: config.kiosk } : {}),
    widgets,
    pages,
  };
}

/** Resolve one profile into the existing read-only runtime page contract. */
export function dashboardDocumentToConfig(
  document: DashboardDocumentV1,
  profile: DisplayProfile,
): DashboardConfig {
  const widgets = new Map(document.widgets.map((widget) => [widget.id, widget]));
  return {
    defaultView: document.defaultPageId,
    ...(document.title ? { title: document.title } : {}),
    ...(document.kiosk ? { kiosk: document.kiosk } : {}),
    views: document.pages.map((page) => ({
      id: page.id,
      type: page.type,
      label: page.label,
      icon: page.icon,
      ...(page.subtitle ? { subtitle: page.subtitle } : {}),
      ...(page.hero ? { hero: page.hero } : {}),
      widgets: page.placements[profile]
        .map((placement, sourceIndex) => ({ placement, sourceIndex }))
        .filter(({ placement }) => placement.visible)
        .sort((a, b) => a.placement.order - b.placement.order || a.sourceIndex - b.sourceIndex)
        .flatMap(({ placement }) => {
          const instance = widgets.get(placement.widgetId);
          if (!instance) return [];
          const size = {
            compact: placement.size,
            medium: placement.size,
            wide: placement.size,
          };
          return [{ ...instance, size } as WidgetConfig];
        }),
    })),
  };
}

/** Validate structure, widget contracts, references, and every profile size. */
export function validateDashboardDocument(input: unknown): DashboardDocumentValidationResult {
  const issues: ValidationIssue[] = [];
  const error = (path: string, message: string) => issues.push({ level: "error", path, message });
  if (!isRecord(input)) {
    return { ok: false, issues: [{ level: "error", path: "document", message: "Dashboard document must be an object." }] };
  }
  if (input.version !== DASHBOARD_DOCUMENT_VERSION) {
    error("version", `Unsupported dashboard document version "${String(input.version)}".`);
  }
  if (!Array.isArray(input.widgets)) error("widgets", "Dashboard document requires a `widgets` array.");
  if (!Array.isArray(input.pages) || input.pages.length === 0) {
    error("pages", "Dashboard document requires at least one page.");
  }

  const widgetEntries: Array<{ sourceIndex: number; instance: DashboardWidgetInstance }> = [];
  const widgetIds = new Set<string>();
  for (const [index, raw] of (Array.isArray(input.widgets) ? input.widgets : []).entries()) {
    const path = `widgets[${index}]`;
    if (!isRecord(raw)) {
      error(path, "Widget instance must be an object.");
      continue;
    }
    if (typeof raw.id !== "string" || !raw.id) {
      error(`${path}.id`, "Widget instance requires a non-empty `id`.");
      continue;
    }
    if (widgetIds.has(raw.id)) {
      error(`${path}.id`, `Duplicate widget id "${raw.id}".`);
      continue;
    }
    widgetIds.add(raw.id);
    if (typeof raw.type !== "string" || !ALL_WIDGET_TYPES.includes(raw.type as WidgetConfig["type"])) {
      error(`${path}.type`, `Unknown widget type "${String(raw.type)}".`);
      continue;
    }
    if ("size" in raw) {
      error(`${path}.size`, "Widget instances cannot contain placement size data.");
    }
    if (raw.name !== undefined && typeof raw.name !== "string") {
      error(`${path}.name`, "Widget name must be a string.");
    }
    if (raw.icon !== undefined && typeof raw.icon !== "string") {
      error(`${path}.icon`, "Widget icon must be a string.");
    }
    if (raw.requiresConfirmation !== undefined && typeof raw.requiresConfirmation !== "boolean") {
      error(`${path}.requiresConfirmation`, "Widget confirmation setting must be a boolean.");
    }
    widgetEntries.push({ sourceIndex: index, instance: raw as unknown as DashboardWidgetInstance });
  }

  validateWidgetInstances(widgetEntries, issues);

  const pages: DashboardPageV1[] = [];
  const pageIds = new Set<string>();
  const rawPages = Array.isArray(input.pages) ? input.pages : [];
  for (const [pageIndex, raw] of rawPages.entries()) {
    const path = `pages[${pageIndex}]`;
    if (!isRecord(raw)) {
      error(path, "Page must be an object.");
      continue;
    }
    if (typeof raw.id !== "string" || !raw.id) {
      error(`${path}.id`, "Page requires a non-empty `id`.");
      continue;
    }
    if (pageIds.has(raw.id)) {
      error(`${path}.id`, `Duplicate page id "${raw.id}".`);
      continue;
    }
    pageIds.add(raw.id);
    if (!isViewType(raw.type)) error(`${path}.type`, `Unknown page type "${String(raw.type)}".`);
    if (typeof raw.label !== "string" || !raw.label) error(`${path}.label`, "Page requires a label.");
    if (typeof raw.icon !== "string" || !raw.icon) error(`${path}.icon`, "Page requires an icon.");
    if (raw.subtitle !== undefined && typeof raw.subtitle !== "string") {
      error(`${path}.subtitle`, "Page subtitle must be a string.");
    }
    if (raw.hero !== undefined) validateEnergyHero(raw.hero, `${path}.hero`, error);
    if (!isRecord(raw.placements)) {
      error(`${path}.placements`, "Page requires placements for every display profile.");
      continue;
    }

    const placements = {} as DashboardProfilePlacementsV1;
    for (const profile of DISPLAY_PROFILES) {
      const list = raw.placements[profile];
      const profilePath = `${path}.placements.${profile}`;
      if (!Array.isArray(list)) {
        error(profilePath, `Missing ${profile} placement array.`);
        placements[profile] = [];
        continue;
      }
      const seenWidgets = new Set<string>();
      const seenOrders = new Set<number>();
      placements[profile] = list.flatMap((candidate, placementIndex) => {
        const placementPath = `${profilePath}[${placementIndex}]`;
        if (!isRecord(candidate)) {
          error(placementPath, "Placement must be an object.");
          return [];
        }
        const widgetId = candidate.widgetId;
        if (typeof widgetId !== "string" || !widgetIds.has(widgetId)) {
          error(`${placementPath}.widgetId`, `Placement references unknown widget "${String(widgetId)}".`);
          return [];
        }
        if (seenWidgets.has(widgetId)) {
          error(`${placementPath}.widgetId`, `Widget "${widgetId}" is placed more than once in ${profile}.`);
        }
        seenWidgets.add(widgetId);
        const order = candidate.order;
        if (!Number.isInteger(order) || (order as number) < 0) {
          error(`${placementPath}.order`, "Placement order must be a non-negative integer.");
        } else if (seenOrders.has(order as number)) {
          error(`${placementPath}.order`, `Placement order ${order} is duplicated in ${profile}.`);
        } else {
          seenOrders.add(order as number);
        }
        if (typeof candidate.visible !== "boolean") {
          error(`${placementPath}.visible`, "Placement visibility must be a boolean.");
        }
        const size = candidate.size;
        if (typeof size !== "string" || !ALL_SIZES.includes(size as WidgetSize)) {
          error(`${placementPath}.size`, `Placement size "${String(size)}" is not supported.`);
        } else {
          const instance = widgetEntries.find((entry) => entry.instance.id === widgetId)?.instance;
          if (instance && !widgetDefinition(instance.type).supportedSizes.includes(size as WidgetSize)) {
            error(`${placementPath}.size`, `Widget type "${instance.type}" does not support size "${size}".`);
          }
        }
        return [{
          widgetId,
          order: typeof order === "number" ? order : 0,
          size: ALL_SIZES.includes(size as WidgetSize) ? size as WidgetSize : "1x1",
          visible: candidate.visible === true,
        }];
      });
    }

    pages.push({
      id: raw.id,
      type: isViewType(raw.type) ? raw.type : "room",
      label: typeof raw.label === "string" ? raw.label : "",
      icon: typeof raw.icon === "string" ? raw.icon : "",
      ...(typeof raw.subtitle === "string" ? { subtitle: raw.subtitle } : {}),
      ...(isRecord(raw.hero) ? { hero: raw.hero as unknown as EnergyHeroConfig } : {}),
      placements,
    });
  }

  const defaultPageId = input.defaultPageId;
  if (typeof defaultPageId !== "string" || !pageIds.has(defaultPageId)) {
    error("defaultPageId", `Default page "${String(defaultPageId)}" does not exist.`);
  }
  if (input.title !== undefined && typeof input.title !== "string") {
    error("title", "Dashboard title must be a string.");
  }
  if (input.kiosk !== undefined) validateKiosk(input.kiosk, error);

  const ok = !issues.some((issue) => issue.level === "error");
  if (!ok) return { ok, issues };
  return {
    ok,
    issues,
    document: {
      version: DASHBOARD_DOCUMENT_VERSION,
      defaultPageId: defaultPageId as string,
      ...(typeof input.title === "string" ? { title: input.title } : {}),
      ...(isRecord(input.kiosk) ? { kiosk: input.kiosk as unknown as KioskConfig } : {}),
      widgets: widgetEntries.map((entry) => entry.instance),
      pages,
    },
  };
}

/** Treat the previous monolithic DashboardConfig as the implicit v0 format. */
export function migrateDashboardDocument(input: unknown): DashboardDocumentV1 {
  if (isRecord(input) && input.version === DASHBOARD_DOCUMENT_VERSION) {
    return input as unknown as DashboardDocumentV1;
  }
  if (isRecord(input) && Array.isArray(input.views) && typeof input.defaultView === "string") {
    const legacy = validateConfig(input as unknown as DashboardConfig);
    if (!legacy.ok) throw new Error("Legacy dashboard config is invalid and cannot be migrated.");
    return dashboardConfigToDocument(legacy.sanitized);
  }
  throw new Error("Dashboard document has no supported version or legacy shape.");
}

/** Load candidate data without allowing corruption to replace a known-good document. */
export function loadDashboardDocument(
  candidate: unknown,
  fallback: DashboardDocumentV1,
): DashboardDocumentLoadResult {
  const candidateIssues: ValidationIssue[] = [];
  try {
    const migrated = migrateDashboardDocument(decodeCandidate(candidate));
    const result = validateDashboardDocument(migrated);
    if (result.ok && result.document) {
      return { document: result.document, issues: result.issues, usedFallback: false };
    }
    candidateIssues.push(...result.issues);
  } catch (error) {
    candidateIssues.push({
      level: "error",
      path: "document",
      message: error instanceof Error ? error.message : "Dashboard document could not be loaded.",
    });
  }

  const fallbackResult = validateDashboardDocument(fallback);
  if (!fallbackResult.ok || !fallbackResult.document) {
    throw new Error("The fallback dashboard document is invalid.");
  }
  return { document: fallbackResult.document, issues: candidateIssues, usedFallback: true };
}

export function exportDashboardDocument(document: DashboardDocumentV1): string {
  return JSON.stringify(document, null, 2);
}

export function importDashboardDocument(
  serialized: string,
  fallback: DashboardDocumentV1,
): DashboardDocumentLoadResult {
  return loadDashboardDocument(serialized, fallback);
}

function validateWidgetInstances(
  entries: Array<{ sourceIndex: number; instance: DashboardWidgetInstance }>,
  issues: ValidationIssue[],
): void {
  if (!entries.length) return;
  const validation = validateConfig({
    defaultView: "instances",
    views: [{
      id: "instances",
      type: "overview",
      label: "Instances",
      icon: "mdi:view-dashboard-outline",
      widgets: entries.map(({ instance }) => ({
        ...instance,
        size: widgetDefinition(instance.type).defaultSize,
      } as WidgetConfig)),
    }],
  });
  for (const issue of validation.issues) {
    const match = /^views\[0\]\.widgets\[(\d+)\](.*)$/.exec(issue.path);
    if (!match) continue;
    const entry = entries[Number(match[1])];
    issues.push({ ...issue, path: `widgets[${entry.sourceIndex}]${match[2]}` });
  }
}

function withoutPlacement(widget: WidgetConfig): DashboardWidgetInstance {
  const instance = { ...widget } as Record<string, unknown>;
  delete instance.size;
  return instance as unknown as DashboardWidgetInstance;
}

function decodeCandidate(candidate: unknown): unknown {
  if (typeof candidate !== "string") return candidate;
  return JSON.parse(candidate) as unknown;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return !!value && typeof value === "object" && !Array.isArray(value);
}

function isViewType(value: unknown): value is ViewType {
  return value === "overview" || value === "room" || value === "system";
}

function validateKiosk(
  value: unknown,
  error: (path: string, message: string) => void,
): void {
  if (!isRecord(value)) {
    error("kiosk", "Kiosk configuration must be an object.");
    return;
  }
  for (const key of ["enabled", "hideHomeAssistantSidebar", "preventScreenSelection"] as const) {
    if (typeof value[key] !== "boolean") error(`kiosk.${key}`, `Kiosk ${key} must be a boolean.`);
  }
}

function validateEnergyHero(
  value: unknown,
  path: string,
  error: (path: string, message: string) => void,
): void {
  if (!isRecord(value)) {
    error(path, "Page hero must be an object.");
    return;
  }
  if (value.type !== "energy") error(`${path}.type`, "Page hero type must be `energy`.");
  for (const key of ["grid", "solar", "gridPower", "solarPower"] as const) {
    if (typeof value[key] !== "string" || !ENTITY_ID_RE.test(value[key])) {
      error(`${path}.${key}`, `Energy hero ${key} must be a valid entity_id.`);
    }
  }
  for (const key of ["carConnected", "carPower"] as const) {
    if (value[key] !== undefined && (typeof value[key] !== "string" || !ENTITY_ID_RE.test(value[key]))) {
      error(`${path}.${key}`, `Energy hero ${key} must be a valid entity_id.`);
    }
  }
  if (value.label !== undefined && typeof value.label !== "string") {
    error(`${path}.label`, "Energy hero label must be a string.");
  }
}
