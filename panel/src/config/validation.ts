import {
  ALL_SIZES,
  ALL_WIDGET_TYPES,
  BREAKPOINTS,
  DashboardConfig,
  ENTITYLESS_TYPES,
  SUPPORTED_SIZES,
  ViewConfig,
  WidgetConfig,
  WidgetType,
} from "./schema.js";

export interface ValidationIssue {
  level: "error" | "warning";
  path: string;
  message: string;
}

export interface ValidationResult {
  ok: boolean;
  issues: ValidationIssue[];
  /** A config with invalid views/widgets stripped, safe to render. */
  sanitized: DashboardConfig;
}

// A conservative entity_id shape: `domain.object_id`, lowercase + digits + _.
const ENTITY_ID_RE = /^[a-z_]+\.[a-z0-9_]+$/;

function isEntityIdLike(value: unknown): value is string {
  return typeof value === "string" && ENTITY_ID_RE.test(value);
}

/** Looks like an intentional placeholder the user still has to fill in. */
export function isPlaceholderEntity(entityId: string | undefined): boolean {
  return !!entityId && /replace_me/i.test(entityId);
}

/**
 * Validate a dashboard config at startup. Returns structured issues plus a
 * sanitized config: invalid widgets are dropped (not crashed on), invalid
 * views are dropped, and a developer-facing panel surfaces the errors.
 */
export function validateConfig(config: DashboardConfig): ValidationResult {
  const issues: ValidationIssue[] = [];
  const err = (path: string, message: string) => issues.push({ level: "error", path, message });
  const warn = (path: string, message: string) => issues.push({ level: "warning", path, message });

  if (!config || typeof config !== "object") {
    return {
      ok: false,
      issues: [{ level: "error", path: "config", message: "Dashboard config is missing or not an object." }],
      sanitized: { defaultView: "", views: [] },
    };
  }

  const seenViewIds = new Set<string>();
  const seenWidgetIds = new Set<string>();
  const validViews: ViewConfig[] = [];

  if (!Array.isArray(config.views) || config.views.length === 0) {
    err("views", "At least one view must be configured.");
  }

  for (let vi = 0; vi < (config.views ?? []).length; vi++) {
    const view = config.views[vi];
    const vpath = `views[${vi}]`;

    if (!view || typeof view !== "object") {
      err(vpath, "View must be an object.");
      continue;
    }
    if (!view.id) {
      err(vpath, "View is missing an `id`.");
      continue;
    }
    if (seenViewIds.has(view.id)) {
      err(`${vpath}.id`, `Duplicate view id "${view.id}".`);
      continue;
    }
    seenViewIds.add(view.id);

    if (!["overview", "room", "system"].includes(view.type)) {
      err(`${vpath}.type`, `Unknown view type "${view.type}".`);
    }
    if (!view.label) warn(`${vpath}.label`, `View "${view.id}" has no label.`);

    const validWidgets: WidgetConfig[] = [];
    for (let wi = 0; wi < (view.widgets ?? []).length; wi++) {
      const widget = view.widgets[wi];
      const wpath = `${vpath}.widgets[${wi}]`;
      const kept = validateWidget(widget, wpath, seenWidgetIds, err);
      if (kept) validWidgets.push(widget);
    }

    validViews.push({ ...view, widgets: validWidgets });
  }

  // defaultView must resolve to a real view.
  if (!seenViewIds.has(config.defaultView)) {
    if (validViews.length > 0) {
      warn(
        "defaultView",
        `defaultView "${config.defaultView}" is not a known view; falling back to "${validViews[0].id}".`,
      );
    } else {
      err("defaultView", `defaultView "${config.defaultView}" does not match any view.`);
    }
  }

  const sanitized: DashboardConfig = {
    ...config,
    defaultView: seenViewIds.has(config.defaultView)
      ? config.defaultView
      : validViews[0]?.id ?? "",
    views: validViews,
  };

  return { ok: !issues.some((i) => i.level === "error"), issues, sanitized };
}

function validateWidget(
  widget: WidgetConfig,
  wpath: string,
  seenWidgetIds: Set<string>,
  err: (p: string, m: string) => void,
): boolean {
  if (!widget || typeof widget !== "object") {
    err(wpath, "Widget must be an object.");
    return false;
  }
  if (!widget.id) {
    err(wpath, "Widget is missing an `id`.");
    return false;
  }
  if (seenWidgetIds.has(widget.id)) {
    err(`${wpath}.id`, `Duplicate widget id "${widget.id}".`);
    return false;
  }
  seenWidgetIds.add(widget.id);

  if (!ALL_WIDGET_TYPES.includes(widget.type)) {
    err(`${wpath}.type`, `Unknown widget type "${widget.type}".`);
    return false;
  }
  const type = widget.type as WidgetType;

  // Entity presence + shape.
  const needsEntity = !ENTITYLESS_TYPES.includes(type);
  if (needsEntity && !widget.entity) {
    err(`${wpath}.entity`, `Widget "${widget.id}" (${type}) requires an \`entity\`.`);
  } else if (widget.entity && !isEntityIdLike(widget.entity)) {
    err(
      `${wpath}.entity`,
      `"${widget.entity}" is not a valid entity_id (expected e.g. light.living_room).`,
    );
  }

  // Size set present and valid for this widget type.
  if (!widget.size || typeof widget.size !== "object") {
    err(`${wpath}.size`, `Widget "${widget.id}" is missing a size set.`);
  } else {
    for (const bp of BREAKPOINTS) {
      const size = widget.size[bp];
      if (!size) {
        err(`${wpath}.size.${bp}`, `Missing "${bp}" size for widget "${widget.id}".`);
        continue;
      }
      if (!ALL_SIZES.includes(size)) {
        err(`${wpath}.size.${bp}`, `Invalid size "${size}" (allowed: ${ALL_SIZES.join(", ")}).`);
        continue;
      }
      if (!SUPPORTED_SIZES[type].includes(size)) {
        err(
          `${wpath}.size.${bp}`,
          `Widget type "${type}" does not support size "${size}" at ${bp}. Supported: ${SUPPORTED_SIZES[type].join(", ")}.`,
        );
      }
    }
  }

  return true;
}
