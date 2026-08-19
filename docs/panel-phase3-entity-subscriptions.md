# Design: per-entity subscriptions for the dashboard panel (Foundations #3)

**Status:** proposal for review — no code written yet.
**Scope:** `panel/` only. Replaces the whole-`hass` re-feed as the widgets' state
source with a shared `subscribe_entities` store.

---

## 1. Why (and an honest ROI note)

The panel today rides Home Assistant's whole-`hass` re-feed: on every state change
in the house, HA hands the root panel a new `hass` object; it flows down to every
mounted widget as a reactive property, and each widget's `shouldUpdate`
([base-widget.ts:50](../panel/src/widgets/base-widget.ts)) decides whether to
re-render. This proposal moves widgets onto a shared, server-filtered
`subscribe_entities` subscription instead.

Being candid about the payoff, because it's narrower than "remove the new-object
churn entirely":

- **HA reassigns `hass` at the panel root every tick regardless** — a custom
  panel can't opt out of that feed. We can stop *widgets* from keying on it; we
  cannot stop the root from receiving it.
- **`shouldUpdate` already prevents a re-render storm** — a tick for an
  unreferenced entity re-renders nothing today; it costs a handful of reference
  comparisons across ~40 widgets.

So the **real, defensible wins** are:

1. **Server-filtered traffic.** Confirmed live: this core accepts an `entity_ids`
   filter on `subscribe_entities` (see §2). The socket then streams diffs for
   only the dashboard's entities, not the whole house.
2. **A cleaner data lifecycle.** The panel owns its own state map and
   reconnect/resubscribe path, instead of inheriting HA's feed semantics.
3. **No per-tick fan-out.** A change to an unreferenced entity touches nothing —
   not even a `shouldUpdate` call on 40 widgets.

For a ~40-widget board these are modest. The change is worth doing for
architectural cleanliness and future scaling, not for a visible speed-up. This
doc exists so that trade — real new surface area (a diff decoder, a subscription
manager, a base-widget contract change) for a mostly-invisible win — is a
deliberate choice.

---

## 2. Verified facts (grounded against the live instance + code)

| Fact | How confirmed | Consequence |
|---|---|---|
| `subscribe_entities` accepts `entity_ids` | live `./bin/ha ws '{"type":"subscribe_entities","entity_ids":["sun.sun"]}'` → `success:true` | Store can server-filter to just the dashboard's entities |
| `connection.subscribeMessage<T>(cb, msg)` is typed | [hass.ts:70](../panel/src/types/hass.ts) | No new dependency; drive the raw command directly |
| `normalizeEntity` reads **only** `hass.states[id]` | [entity-adapters/index.ts](../panel/src/home-assistant/entity-adapters/index.ts) — sole hass read is `hass?.states[entityId]` | State-source swap is minimal; adapter layer already decoupled |
| Composites already override `relevantEntityIds()` | powerflow, energy, basic (script/scene group) | A store keyed on `relevantEntityIds()` covers composites for free |
| `hass.states` is a full snapshot at first paint | HA custom-panel contract | Seed the store from it synchronously → no loading flash |

---

## 3. Goals / non-goals

**Goals**
- One multiplexed `subscribe_entities` subscription, server-filtered to the union
  of entity ids the mounted widgets reference.
- Widgets source live state from the store; `shouldUpdate` keys on the store, not
  on `hass` identity.
- Correct compressed-diff handling, reconnect/resubscribe, and no first-paint
  flash.
- Land incrementally — never a big-bang where all widgets change at once.

**Non-goals**
- Removing `hass` from widgets. `hass` stays for service calls, `connection`,
  locale/formatters, theme. Only the **state object** moves to the store.
- Touching history/statistics (`history.ts`) — that's request/response, unrelated.
- The energy/statistics work (Foundations #4) — separate track.

---

## 4. The `subscribe_entities` wire protocol (the decoder — the risky part)

After the `result` ack, events arrive as `{ type: "event", event: {...} }` with a
**compressed** shape:

```jsonc
// First event after subscribing: "added" — full state for every subscribed id
{ "a": { "sensor.x": { "s": "12.3", "a": { "unit_of_measurement": "kWh" },
                       "c": "01H…", "lc": 1699999999.1, "lu": 1699999999.1 } } }

// Subsequent events: "changed" — per-entity diff
{ "c": { "sensor.x": { "+": { "s": "12.4", "lc": 1700000000.0, "lu": 1700000000.0 },
                       "-": { "a": ["some_attr"] } } } }

// "removed"
{ "r": ["sensor.x"] }
```

Compressed-state keys: `s`=state, `a`=attributes, `c`=context, `lc`=last_changed,
`lu`=last_updated (`ls`/last_reported on newer cores). The decoder folds these
into full `HassEntity` objects:

- **`a`** (added): set the entity's full state from the compressed object.
- **`c`** (changed): apply `+` (merge state + attributes + timestamps) then `-`
  (delete listed attributes) onto the retained entity.
- **`r`** (removed): drop the entity.

> Implementation note: log the first raw `event` payload once during bring-up to
> confirm exact key names on this core version before trusting the decoder. The
> shape above is the documented, stable protocol, but a 30-second runtime check
> removes all doubt and is cheap.

A small pure module `entity-diff.ts` will own decode logic with exhaustive unit
tests (add / change-state-only / change-attrs / remove-attr / remove-entity /
timestamps), so the risky part is tested in isolation, off the socket.

---

## 5. `EntityStore` — the shared subscription

A single instance owned by the root panel, constructed from
`hass.connection`, seeded synchronously from `hass.states`.

```ts
interface EntityStore {
  /** Current snapshot for an id (seeded from hass, then kept live). */
  get(id: string): HassEntity | undefined;

  /** Subscribe a widget's ids; returns an unsubscribe. Refcounts internally. */
  track(ids: string[], onChange: () => void): () => void;

  /** Called by the root when a fresh hass arrives — refreshes connection + seed. */
  setHass(hass: HomeAssistant): void;

  /** Tear down the socket subscription (panel disconnect). */
  dispose(): void;
}
```

**Id-set management (recommended: dynamic + refcounted).** Widgets `track()` their
`relevantEntityIds()` on connect and release on disconnect. The store keeps a
ref-counted multiset of ids; when the **distinct** set changes it **debounces**
(~50 ms, to coalesce a view transition's mount/unmount storm) and re-subscribes
`subscribe_entities` with the new `entity_ids`. This reuses the existing
`relevantEntityIds()` contract, so composites (powerflow/energy) are covered with
no extra code.

- On resubscribe, **retain** the existing entity map (don't clear) — the new
  subscription's `a` event refreshes it; entities shared across views never
  flash.
- Notify only the widgets whose tracked ids actually changed (map each id →
  set of listeners), so a diff for one entity wakes only its widgets.

**Rejected alternative — static whole-config union.** Compute every referenced id
from `dashboardConfig` once, subscribe stably, never resubscribe on view change.
Simpler lifecycle, but extracting composite ids statically means duplicating each
composite's `relevantEntityIds()` logic (they derive ids from `options` in
widget-specific ways). Net: not simpler, and it desyncs from the instance method.
Rejected.

**Reconnect.** `connection.subscribeMessage` resolves an unsubscribe and the lib
re-establishes the socket on reconnect, but our subscription must be re-armed. The
store listens for connection loss/restore (via `hass.connected` transitions the
root already observes, and/or `connection` events) and re-subscribes, then lets
the fresh `a` event reconcile. Between loss and restore, `get()` returns the last
snapshot (widgets show stale-but-present data, not blank).

---

## 6. `EntityWidget` contract change

Because `normalizeEntity` needs only `states[id]`, the change is small and
surgical:

- Add `@property({ attribute: false }) store?: EntityStore;` (threaded from the
  grid, same as `hass`).
- `connectedCallback`: `this._release = this.store?.track(this.relevantEntityIds(),
  () => this.requestUpdate())`. `disconnectedCallback`: call `_release`.
- `get vm()` sources the state object from the store:
  `normalizeEntity(this.hass, this.entityId, this.config)` becomes a variant that
  reads `this.store?.get(id)` for the state object while still passing `hass` for
  anything else. Cleanest: **give `normalizeEntity` the state object directly**
  (it already uses nothing else), e.g. `normalizeEntity(stateObj, id, config)`,
  and have the widget fetch `stateObj` from the store. This is a tidy refactor of
  a function whose only hass read is `states[id]`.
- `shouldUpdate`: drop the `hass.states` reference-diff branch. The store's
  `onChange` already calls `requestUpdate` precisely when a tracked entity moved,
  so `shouldUpdate` reduces to: render on `config`/`currentSize`/connectivity
  change, else let the store drive. `hass` reassignment no longer triggers work.
- Keep `hass` for `callService`, `connection`, locale/formatters. Widgets that
  read `hass.formatEntityState` etc. directly are unaffected (those stay on hass).

`relevantEntityIds()` is dynamic for some composites (ids depend on `options`,
which are static per config) — so the tracked set is stable per widget instance.
If any widget ever needs to change its tracked ids at runtime, add a
`retrack()` helper; not needed for current widgets.

---

## 7. Wiring

- `home-dashboard-panel` constructs the `EntityStore` once (lazily, when the first
  `hass` with a `connection` arrives), calls `store.setHass(hass)` in
  `willUpdate` on each `hass` change, threads `.store` into `hd-view-grid`,
  `disposes` on disconnect.
- `hd-view-grid` passes `.store` to each widget alongside `.hass`
  ([view-grid.ts](../panel/src/panel/view-grid.ts)).
- The detail surface (`detail-surface.ts`) can keep reading `hass.states` for now
  (it's opened on demand, not a churn source) — or read the store for consistency
  in a follow-up. Not on the critical path.

---

## 8. Incremental migration (no big-bang)

1. Land `entity-diff.ts` + `EntityStore` + full unit tests. **No widget touched.**
   Nothing uses the store yet; suite stays green.
2. Thread `store` through panel → grid → base-widget, but have `vm` **prefer the
   store and fall back to `hass.states`** when the store lacks an id. Both paths
   live simultaneously; behavior identical.
3. Flip `shouldUpdate` to the store-driven form. Verify churn is gone (render
   counter in dev).
4. Once confident, remove the `hass.states` fallback in `vm`.

Each step is independently verifiable and revertable.

---

## 9. Risks & mitigations

| Risk | Mitigation |
|---|---|
| Diff decoder wrong on an edge case | Pure `entity-diff.ts` with exhaustive tests; log one live payload during bring-up |
| First-paint flash | Seed store synchronously from `hass.states` |
| View-change resubscribe churn | Debounce; retain map across resubscribe |
| Reconnect leaves stale/blank tiles | Retain last snapshot; re-arm subscription on restore; `a` reconciles |
| Contract change ripples through 40 widgets | Migration keeps a `hass.states` fallback until the store is proven (step 2–4) |
| Two sources of truth during migration | Explicitly temporary (steps 2–3); step 4 removes the fallback |

---

## 10. Testing & verification

- **Unit:** `entity-diff.test.ts` (decode matrix) + `entity-store.test.ts`
  (refcount, resubscribe on set change, retain-on-resubscribe, reconnect).
- **Browser (dev server, port 5178):** via `read_network_requests`/WS frames,
  confirm only referenced entities stream; add a temporary render counter to show
  the per-tick fan-out is gone; toggle offline (dev toolbar) to confirm tiles hold
  last state and recover. All views render across breakpoints; full suite green.

---

## 11. Effort & recommendation

Rough effort: `entity-diff` + store + tests ≈ the bulk; base-widget + wiring is
small given the adapter is already decoupled. Call it a focused day, most of it in
the decoder tests and reconnect edge cases.

**Recommendation:** the design is clean and low-risk *given the incremental path*,
but the real-world payoff at this board size is modest. Reasonable to (a) green-
light implementation now that the shape is known, or (b) shelve it as a
well-specified backlog item and spend the next block on Foundations #4 (energy
depth), which is more user-visible. Either is defensible; this doc makes #3 ready
to pick up whenever.
