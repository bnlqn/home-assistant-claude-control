import {
  ALL_SIZES,
  ALL_WIDGET_TYPES,
  BREAKPOINTS,
  DashboardConfig,
  GroupOptions,
  ViewConfig,
  WidgetConfig,
  WidgetType,
} from "./schema.js";
import { widgetDefinition } from "../widgets/widget-definition.js";

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
      continue;
    }
    if (!view.label) warn(`${vpath}.label`, `View "${view.id}" has no label.`);
    if (!Array.isArray(view.widgets)) {
      err(`${vpath}.widgets`, `View "${view.id}" must have a \`widgets\` array.`);
      continue;
    }

    const validWidgets: WidgetConfig[] = [];
    for (let wi = 0; wi < (view.widgets ?? []).length; wi++) {
      const widget = view.widgets[wi];
      const wpath = `${vpath}.widgets[${wi}]`;
      const kept = validateWidget(widget, wpath, seenWidgetIds, err);
      if (kept) validWidgets.push(kept);
    }

    validViews.push({ ...view, widgets: validWidgets });
  }

  // defaultView must resolve to a view that survived validation.
  const validViewIds = new Set(validViews.map((view) => view.id));
  if (!validViewIds.has(config.defaultView)) {
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
    defaultView: validViewIds.has(config.defaultView)
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
): WidgetConfig | null {
  if (!widget || typeof widget !== "object") {
    err(wpath, "Widget must be an object.");
    return null;
  }
  if (!widget.id) {
    err(wpath, "Widget is missing an `id`.");
    return null;
  }
  if (seenWidgetIds.has(widget.id)) {
    err(`${wpath}.id`, `Duplicate widget id "${widget.id}".`);
    return null;
  }
  seenWidgetIds.add(widget.id);

  if (!ALL_WIDGET_TYPES.includes(widget.type)) {
    err(`${wpath}.type`, `Unknown widget type "${widget.type}".`);
    return null;
  }
  const type = widget.type as WidgetType;
  const definition = widgetDefinition(type);
  let valid = true;

  // Entity presence + shape.
  const needsEntity = definition.requiresEntity;
  if (needsEntity && !widget.entity) {
    err(`${wpath}.entity`, `Widget "${widget.id}" (${type}) requires an \`entity\`.`);
    valid = false;
  } else if (widget.entity && !isEntityIdLike(widget.entity)) {
    err(
      `${wpath}.entity`,
      `"${widget.entity}" is not a valid entity_id (expected e.g. light.living_room).`,
    );
    valid = false;
  }

  // Size set present and valid for this widget type.
  if (!widget.size || typeof widget.size !== "object") {
    err(`${wpath}.size`, `Widget "${widget.id}" is missing a size set.`);
    valid = false;
  } else {
    const supportedSizes = definition.supportedSizes;
    for (const bp of BREAKPOINTS) {
      const size = widget.size[bp];
      if (!size) {
        err(`${wpath}.size.${bp}`, `Missing "${bp}" size for widget "${widget.id}".`);
        valid = false;
        continue;
      }
      if (!ALL_SIZES.includes(size)) {
        err(`${wpath}.size.${bp}`, `Invalid size "${size}" (allowed: ${ALL_SIZES.join(", ")}).`);
        valid = false;
        continue;
      }
      if (!supportedSizes.includes(size)) {
        err(
          `${wpath}.size.${bp}`,
          `Widget type "${type}" does not support size "${size}" at ${bp}. Supported: ${supportedSizes.join(", ")}.`,
        );
        valid = false;
      }
    }
  }

  // Migrated widgets own their option contract. This keeps widget-specific
  // validation beside the definition instead of growing this central switch.
  for (const issue of definition.validateOptions?.(widget.options) ?? []) {
    err(`${wpath}.options${issue.path ? `.${issue.path}` : ""}`, issue.message);
    valid = false;
  }

  // An explicit `group` container validates its children with the same rules,
  // sharing the id-uniqueness set. (Synthetic groups from `sectioniseView` are
  // built after validation from already-validated widgets.)
  if (widget.type === "group") {
    const children = (widget.options as GroupOptions | undefined)?.children;
    if (!Array.isArray(children) || children.length === 0) {
      err(`${wpath}.options.children`, `Group "${widget.id}" must have a non-empty \`children\` array.`);
      valid = false;
    } else {
      const validChildren = children
        .map((child, ci) =>
          validateWidget(child, `${wpath}.options.children[${ci}]`, seenWidgetIds, err),
        )
        .filter((child): child is WidgetConfig => child !== null);
      if (validChildren.length === 0) {
        err(`${wpath}.options.children`, `Group "${widget.id}" has no valid children after validation.`);
        valid = false;
      } else if (valid) {
        return {
          ...widget,
          options: { ...(widget.options ?? {}), children: validChildren },
        };
      }
    }
  }

  return valid ? { ...widget } : null;
}
