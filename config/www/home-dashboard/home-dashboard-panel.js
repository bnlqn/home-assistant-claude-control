/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const ie = globalThis, We = ie.ShadowRoot && (ie.ShadyCSS === void 0 || ie.ShadyCSS.nativeShadow) && "adoptedStyleSheets" in Document.prototype && "replace" in CSSStyleSheet.prototype, Xe = Symbol(), ri = /* @__PURE__ */ new WeakMap();
let Ri = class {
  constructor(e, i, a) {
    if (this._$cssResult$ = !0, a !== Xe) throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");
    this.cssText = e, this.t = i;
  }
  get styleSheet() {
    let e = this.o;
    const i = this.t;
    if (We && e === void 0) {
      const a = i !== void 0 && i.length === 1;
      a && (e = ri.get(i)), e === void 0 && ((this.o = e = new CSSStyleSheet()).replaceSync(this.cssText), a && ri.set(i, e));
    }
    return e;
  }
  toString() {
    return this.cssText;
  }
};
const Zi = (t) => new Ri(typeof t == "string" ? t : t + "", void 0, Xe), x = (t, ...e) => {
  const i = t.length === 1 ? t[0] : e.reduce((a, s, n) => a + ((r) => {
    if (r._$cssResult$ === !0) return r.cssText;
    if (typeof r == "number") return r;
    throw Error("Value passed to 'css' function must be a 'css' function result: " + r + ". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.");
  })(s) + t[n + 1], t[0]);
  return new Ri(i, t, Xe);
}, P1 = (t, e) => {
  if (We) t.adoptedStyleSheets = e.map((i) => i instanceof CSSStyleSheet ? i : i.styleSheet);
  else for (const i of e) {
    const a = document.createElement("style"), s = ie.litNonce;
    s !== void 0 && a.setAttribute("nonce", s), a.textContent = i.cssText, t.appendChild(a);
  }
}, oi = We ? (t) => t : (t) => t instanceof CSSStyleSheet ? ((e) => {
  let i = "";
  for (const a of e.cssRules) i += a.cssText;
  return Zi(i);
})(t) : t;
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const { is: T1, defineProperty: E1, getOwnPropertyDescriptor: O1, getOwnPropertyNames: z1, getOwnPropertySymbols: D1, getPrototypeOf: I1 } = Object, ve = globalThis, ci = ve.trustedTypes, R1 = ci ? ci.emptyScript : "", Z1 = ve.reactiveElementPolyfillSupport, It = (t, e) => t, se = { toAttribute(t, e) {
  switch (e) {
    case Boolean:
      t = t ? R1 : null;
      break;
    case Object:
    case Array:
      t = t == null ? t : JSON.stringify(t);
  }
  return t;
}, fromAttribute(t, e) {
  let i = t;
  switch (e) {
    case Boolean:
      i = t !== null;
      break;
    case Number:
      i = t === null ? null : Number(t);
      break;
    case Object:
    case Array:
      try {
        i = JSON.parse(t);
      } catch {
        i = null;
      }
  }
  return i;
} }, Be = (t, e) => !T1(t, e), li = { attribute: !0, type: String, converter: se, reflect: !1, useDefault: !1, hasChanged: Be };
Symbol.metadata ??= Symbol("metadata"), ve.litPropertyMetadata ??= /* @__PURE__ */ new WeakMap();
let mt = class extends HTMLElement {
  static addInitializer(e) {
    this._$Ei(), (this.l ??= []).push(e);
  }
  static get observedAttributes() {
    return this.finalize(), this._$Eh && [...this._$Eh.keys()];
  }
  static createProperty(e, i = li) {
    if (i.state && (i.attribute = !1), this._$Ei(), this.prototype.hasOwnProperty(e) && ((i = Object.create(i)).wrapped = !0), this.elementProperties.set(e, i), !i.noAccessor) {
      const a = Symbol(), s = this.getPropertyDescriptor(e, a, i);
      s !== void 0 && E1(this.prototype, e, s);
    }
  }
  static getPropertyDescriptor(e, i, a) {
    const { get: s, set: n } = O1(this.prototype, e) ?? { get() {
      return this[i];
    }, set(r) {
      this[i] = r;
    } };
    return { get: s, set(r) {
      const c = s?.call(this);
      n?.call(this, r), this.requestUpdate(e, c, a);
    }, configurable: !0, enumerable: !0 };
  }
  static getPropertyOptions(e) {
    return this.elementProperties.get(e) ?? li;
  }
  static _$Ei() {
    if (this.hasOwnProperty(It("elementProperties"))) return;
    const e = I1(this);
    e.finalize(), e.l !== void 0 && (this.l = [...e.l]), this.elementProperties = new Map(e.elementProperties);
  }
  static finalize() {
    if (this.hasOwnProperty(It("finalized"))) return;
    if (this.finalized = !0, this._$Ei(), this.hasOwnProperty(It("properties"))) {
      const i = this.properties, a = [...z1(i), ...D1(i)];
      for (const s of a) this.createProperty(s, i[s]);
    }
    const e = this[Symbol.metadata];
    if (e !== null) {
      const i = litPropertyMetadata.get(e);
      if (i !== void 0) for (const [a, s] of i) this.elementProperties.set(a, s);
    }
    this._$Eh = /* @__PURE__ */ new Map();
    for (const [i, a] of this.elementProperties) {
      const s = this._$Eu(i, a);
      s !== void 0 && this._$Eh.set(s, i);
    }
    this.elementStyles = this.finalizeStyles(this.styles);
  }
  static finalizeStyles(e) {
    const i = [];
    if (Array.isArray(e)) {
      const a = new Set(e.flat(1 / 0).reverse());
      for (const s of a) i.unshift(oi(s));
    } else e !== void 0 && i.push(oi(e));
    return i;
  }
  static _$Eu(e, i) {
    const a = i.attribute;
    return a === !1 ? void 0 : typeof a == "string" ? a : typeof e == "string" ? e.toLowerCase() : void 0;
  }
  constructor() {
    super(), this._$Ep = void 0, this.isUpdatePending = !1, this.hasUpdated = !1, this._$Em = null, this._$Ev();
  }
  _$Ev() {
    this._$ES = new Promise((e) => this.enableUpdating = e), this._$AL = /* @__PURE__ */ new Map(), this._$E_(), this.requestUpdate(), this.constructor.l?.forEach((e) => e(this));
  }
  addController(e) {
    (this._$EO ??= /* @__PURE__ */ new Set()).add(e), this.renderRoot !== void 0 && this.isConnected && e.hostConnected?.();
  }
  removeController(e) {
    this._$EO?.delete(e);
  }
  _$E_() {
    const e = /* @__PURE__ */ new Map(), i = this.constructor.elementProperties;
    for (const a of i.keys()) this.hasOwnProperty(a) && (e.set(a, this[a]), delete this[a]);
    e.size > 0 && (this._$Ep = e);
  }
  createRenderRoot() {
    const e = this.shadowRoot ?? this.attachShadow(this.constructor.shadowRootOptions);
    return P1(e, this.constructor.elementStyles), e;
  }
  connectedCallback() {
    this.renderRoot ??= this.createRenderRoot(), this.enableUpdating(!0), this._$EO?.forEach((e) => e.hostConnected?.());
  }
  enableUpdating(e) {
  }
  disconnectedCallback() {
    this._$EO?.forEach((e) => e.hostDisconnected?.());
  }
  attributeChangedCallback(e, i, a) {
    this._$AK(e, a);
  }
  _$ET(e, i) {
    const a = this.constructor.elementProperties.get(e), s = this.constructor._$Eu(e, a);
    if (s !== void 0 && a.reflect === !0) {
      const n = (a.converter?.toAttribute !== void 0 ? a.converter : se).toAttribute(i, a.type);
      this._$Em = e, n == null ? this.removeAttribute(s) : this.setAttribute(s, n), this._$Em = null;
    }
  }
  _$AK(e, i) {
    const a = this.constructor, s = a._$Eh.get(e);
    if (s !== void 0 && this._$Em !== s) {
      const n = a.getPropertyOptions(s), r = typeof n.converter == "function" ? { fromAttribute: n.converter } : n.converter?.fromAttribute !== void 0 ? n.converter : se;
      this._$Em = s;
      const c = r.fromAttribute(i, n.type);
      this[s] = c ?? this._$Ej?.get(s) ?? c, this._$Em = null;
    }
  }
  requestUpdate(e, i, a, s = !1, n) {
    if (e !== void 0) {
      const r = this.constructor;
      if (s === !1 && (n = this[e]), a ??= r.getPropertyOptions(e), !((a.hasChanged ?? Be)(n, i) || a.useDefault && a.reflect && n === this._$Ej?.get(e) && !this.hasAttribute(r._$Eu(e, a)))) return;
      this.C(e, i, a);
    }
    this.isUpdatePending === !1 && (this._$ES = this._$EP());
  }
  C(e, i, { useDefault: a, reflect: s, wrapped: n }, r) {
    a && !(this._$Ej ??= /* @__PURE__ */ new Map()).has(e) && (this._$Ej.set(e, r ?? i ?? this[e]), n !== !0 || r !== void 0) || (this._$AL.has(e) || (this.hasUpdated || a || (i = void 0), this._$AL.set(e, i)), s === !0 && this._$Em !== e && (this._$Eq ??= /* @__PURE__ */ new Set()).add(e));
  }
  async _$EP() {
    this.isUpdatePending = !0;
    try {
      await this._$ES;
    } catch (i) {
      Promise.reject(i);
    }
    const e = this.scheduleUpdate();
    return e != null && await e, !this.isUpdatePending;
  }
  scheduleUpdate() {
    return this.performUpdate();
  }
  performUpdate() {
    if (!this.isUpdatePending) return;
    if (!this.hasUpdated) {
      if (this.renderRoot ??= this.createRenderRoot(), this._$Ep) {
        for (const [s, n] of this._$Ep) this[s] = n;
        this._$Ep = void 0;
      }
      const a = this.constructor.elementProperties;
      if (a.size > 0) for (const [s, n] of a) {
        const { wrapped: r } = n, c = this[s];
        r !== !0 || this._$AL.has(s) || c === void 0 || this.C(s, void 0, n, c);
      }
    }
    let e = !1;
    const i = this._$AL;
    try {
      e = this.shouldUpdate(i), e ? (this.willUpdate(i), this._$EO?.forEach((a) => a.hostUpdate?.()), this.update(i)) : this._$EM();
    } catch (a) {
      throw e = !1, this._$EM(), a;
    }
    e && this._$AE(i);
  }
  willUpdate(e) {
  }
  _$AE(e) {
    this._$EO?.forEach((i) => i.hostUpdated?.()), this.hasUpdated || (this.hasUpdated = !0, this.firstUpdated(e)), this.updated(e);
  }
  _$EM() {
    this._$AL = /* @__PURE__ */ new Map(), this.isUpdatePending = !1;
  }
  get updateComplete() {
    return this.getUpdateComplete();
  }
  getUpdateComplete() {
    return this._$ES;
  }
  shouldUpdate(e) {
    return !0;
  }
  update(e) {
    this._$Eq &&= this._$Eq.forEach((i) => this._$ET(i, this[i])), this._$EM();
  }
  updated(e) {
  }
  firstUpdated(e) {
  }
};
mt.elementStyles = [], mt.shadowRootOptions = { mode: "open" }, mt[It("elementProperties")] = /* @__PURE__ */ new Map(), mt[It("finalized")] = /* @__PURE__ */ new Map(), Z1?.({ ReactiveElement: mt }), (ve.reactiveElementVersions ??= []).push("2.1.2");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const Ye = globalThis, di = (t) => t, ne = Ye.trustedTypes, hi = ne ? ne.createPolicy("lit-html", { createHTML: (t) => t }) : void 0, qi = "$lit$", W = `lit$${Math.random().toFixed(9).slice(2)}$`, Fi = "?" + W, q1 = `<${Fi}>`, at = document, Zt = () => at.createComment(""), qt = (t) => t === null || typeof t != "object" && typeof t != "function", Qe = Array.isArray, F1 = (t) => Qe(t) || typeof t?.[Symbol.iterator] == "function", ke = `[ 	
\f\r]`, Vt = /<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g, ui = /-->/g, pi = />/g, Q = RegExp(`>|${ke}(?:([^\\s"'>=/]+)(${ke}*=${ke}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`, "g"), mi = /'/g, gi = /"/g, Ni = /^(?:script|style|textarea|title)$/i, Ui = (t) => (e, ...i) => ({ _$litType$: t, strings: e, values: i }), o = Ui(1), Ft = Ui(2), st = Symbol.for("lit-noChange"), d = Symbol.for("lit-nothing"), fi = /* @__PURE__ */ new WeakMap(), et = at.createTreeWalker(at, 129);
function ji(t, e) {
  if (!Qe(t) || !t.hasOwnProperty("raw")) throw Error("invalid template strings array");
  return hi !== void 0 ? hi.createHTML(e) : e;
}
const N1 = (t, e) => {
  const i = t.length - 1, a = [];
  let s, n = e === 2 ? "<svg>" : e === 3 ? "<math>" : "", r = Vt;
  for (let c = 0; c < i; c++) {
    const l = t[c];
    let h, u, p = -1, f = 0;
    for (; f < l.length && (r.lastIndex = f, u = r.exec(l), u !== null); ) f = r.lastIndex, r === Vt ? u[1] === "!--" ? r = ui : u[1] !== void 0 ? r = pi : u[2] !== void 0 ? (Ni.test(u[2]) && (s = RegExp("</" + u[2], "g")), r = Q) : u[3] !== void 0 && (r = Q) : r === Q ? u[0] === ">" ? (r = s ?? Vt, p = -1) : u[1] === void 0 ? p = -2 : (p = r.lastIndex - u[2].length, h = u[1], r = u[3] === void 0 ? Q : u[3] === '"' ? gi : mi) : r === gi || r === mi ? r = Q : r === ui || r === pi ? r = Vt : (r = Q, s = void 0);
    const g = r === Q && t[c + 1].startsWith("/>") ? " " : "";
    n += r === Vt ? l + q1 : p >= 0 ? (a.push(h), l.slice(0, p) + qi + l.slice(p) + W + g) : l + W + (p === -2 ? c : g);
  }
  return [ji(t, n + (t[i] || "<?>") + (e === 2 ? "</svg>" : e === 3 ? "</math>" : "")), a];
};
class Nt {
  constructor({ strings: e, _$litType$: i }, a) {
    let s;
    this.parts = [];
    let n = 0, r = 0;
    const c = e.length - 1, l = this.parts, [h, u] = N1(e, i);
    if (this.el = Nt.createElement(h, a), et.currentNode = this.el.content, i === 2 || i === 3) {
      const p = this.el.content.firstChild;
      p.replaceWith(...p.childNodes);
    }
    for (; (s = et.nextNode()) !== null && l.length < c; ) {
      if (s.nodeType === 1) {
        if (s.hasAttributes()) for (const p of s.getAttributeNames()) if (p.endsWith(qi)) {
          const f = u[r++], g = s.getAttribute(p).split(W), v = /([.?@])?(.*)/.exec(f);
          l.push({ type: 1, index: n, name: v[2], strings: g, ctor: v[1] === "." ? j1 : v[1] === "?" ? K1 : v[1] === "@" ? W1 : be }), s.removeAttribute(p);
        } else p.startsWith(W) && (l.push({ type: 6, index: n }), s.removeAttribute(p));
        if (Ni.test(s.tagName)) {
          const p = s.textContent.split(W), f = p.length - 1;
          if (f > 0) {
            s.textContent = ne ? ne.emptyScript : "";
            for (let g = 0; g < f; g++) s.append(p[g], Zt()), et.nextNode(), l.push({ type: 2, index: ++n });
            s.append(p[f], Zt());
          }
        }
      } else if (s.nodeType === 8) if (s.data === Fi) l.push({ type: 2, index: n });
      else {
        let p = -1;
        for (; (p = s.data.indexOf(W, p + 1)) !== -1; ) l.push({ type: 7, index: n }), p += W.length - 1;
      }
      n++;
    }
  }
  static createElement(e, i) {
    const a = at.createElement("template");
    return a.innerHTML = e, a;
  }
}
function ft(t, e, i = t, a) {
  if (e === st) return e;
  let s = a !== void 0 ? i._$Co?.[a] : i._$Cl;
  const n = qt(e) ? void 0 : e._$litDirective$;
  return s?.constructor !== n && (s?._$AO?.(!1), n === void 0 ? s = void 0 : (s = new n(t), s._$AT(t, i, a)), a !== void 0 ? (i._$Co ??= [])[a] = s : i._$Cl = s), s !== void 0 && (e = ft(t, s._$AS(t, e.values), s, a)), e;
}
class U1 {
  constructor(e, i) {
    this._$AV = [], this._$AN = void 0, this._$AD = e, this._$AM = i;
  }
  get parentNode() {
    return this._$AM.parentNode;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  u(e) {
    const { el: { content: i }, parts: a } = this._$AD, s = (e?.creationScope ?? at).importNode(i, !0);
    et.currentNode = s;
    let n = et.nextNode(), r = 0, c = 0, l = a[0];
    for (; l !== void 0; ) {
      if (r === l.index) {
        let h;
        l.type === 2 ? h = new $t(n, n.nextSibling, this, e) : l.type === 1 ? h = new l.ctor(n, l.name, l.strings, this, e) : l.type === 6 && (h = new X1(n, this, e)), this._$AV.push(h), l = a[++c];
      }
      r !== l?.index && (n = et.nextNode(), r++);
    }
    return et.currentNode = at, s;
  }
  p(e) {
    let i = 0;
    for (const a of this._$AV) a !== void 0 && (a.strings !== void 0 ? (a._$AI(e, a, i), i += a.strings.length - 2) : a._$AI(e[i])), i++;
  }
}
class $t {
  get _$AU() {
    return this._$AM?._$AU ?? this._$Cv;
  }
  constructor(e, i, a, s) {
    this.type = 2, this._$AH = d, this._$AN = void 0, this._$AA = e, this._$AB = i, this._$AM = a, this.options = s, this._$Cv = s?.isConnected ?? !0;
  }
  get parentNode() {
    let e = this._$AA.parentNode;
    const i = this._$AM;
    return i !== void 0 && e?.nodeType === 11 && (e = i.parentNode), e;
  }
  get startNode() {
    return this._$AA;
  }
  get endNode() {
    return this._$AB;
  }
  _$AI(e, i = this) {
    e = ft(this, e, i), qt(e) ? e === d || e == null || e === "" ? (this._$AH !== d && this._$AR(), this._$AH = d) : e !== this._$AH && e !== st && this._(e) : e._$litType$ !== void 0 ? this.$(e) : e.nodeType !== void 0 ? this.T(e) : F1(e) ? this.k(e) : this._(e);
  }
  O(e) {
    return this._$AA.parentNode.insertBefore(e, this._$AB);
  }
  T(e) {
    this._$AH !== e && (this._$AR(), this._$AH = this.O(e));
  }
  _(e) {
    this._$AH !== d && qt(this._$AH) ? this._$AA.nextSibling.data = e : this.T(at.createTextNode(e)), this._$AH = e;
  }
  $(e) {
    const { values: i, _$litType$: a } = e, s = typeof a == "number" ? this._$AC(e) : (a.el === void 0 && (a.el = Nt.createElement(ji(a.h, a.h[0]), this.options)), a);
    if (this._$AH?._$AD === s) this._$AH.p(i);
    else {
      const n = new U1(s, this), r = n.u(this.options);
      n.p(i), this.T(r), this._$AH = n;
    }
  }
  _$AC(e) {
    let i = fi.get(e.strings);
    return i === void 0 && fi.set(e.strings, i = new Nt(e)), i;
  }
  k(e) {
    Qe(this._$AH) || (this._$AH = [], this._$AR());
    const i = this._$AH;
    let a, s = 0;
    for (const n of e) s === i.length ? i.push(a = new $t(this.O(Zt()), this.O(Zt()), this, this.options)) : a = i[s], a._$AI(n), s++;
    s < i.length && (this._$AR(a && a._$AB.nextSibling, s), i.length = s);
  }
  _$AR(e = this._$AA.nextSibling, i) {
    for (this._$AP?.(!1, !0, i); e !== this._$AB; ) {
      const a = di(e).nextSibling;
      di(e).remove(), e = a;
    }
  }
  setConnected(e) {
    this._$AM === void 0 && (this._$Cv = e, this._$AP?.(e));
  }
}
class be {
  get tagName() {
    return this.element.tagName;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  constructor(e, i, a, s, n) {
    this.type = 1, this._$AH = d, this._$AN = void 0, this.element = e, this.name = i, this._$AM = s, this.options = n, a.length > 2 || a[0] !== "" || a[1] !== "" ? (this._$AH = Array(a.length - 1).fill(new String()), this.strings = a) : this._$AH = d;
  }
  _$AI(e, i = this, a, s) {
    const n = this.strings;
    let r = !1;
    if (n === void 0) e = ft(this, e, i, 0), r = !qt(e) || e !== this._$AH && e !== st, r && (this._$AH = e);
    else {
      const c = e;
      let l, h;
      for (e = n[0], l = 0; l < n.length - 1; l++) h = ft(this, c[a + l], i, l), h === st && (h = this._$AH[l]), r ||= !qt(h) || h !== this._$AH[l], h === d ? e = d : e !== d && (e += (h ?? "") + n[l + 1]), this._$AH[l] = h;
    }
    r && !s && this.j(e);
  }
  j(e) {
    e === d ? this.element.removeAttribute(this.name) : this.element.setAttribute(this.name, e ?? "");
  }
}
class j1 extends be {
  constructor() {
    super(...arguments), this.type = 3;
  }
  j(e) {
    this.element[this.name] = e === d ? void 0 : e;
  }
}
class K1 extends be {
  constructor() {
    super(...arguments), this.type = 4;
  }
  j(e) {
    this.element.toggleAttribute(this.name, !!e && e !== d);
  }
}
class W1 extends be {
  constructor(e, i, a, s, n) {
    super(e, i, a, s, n), this.type = 5;
  }
  _$AI(e, i = this) {
    if ((e = ft(this, e, i, 0) ?? d) === st) return;
    const a = this._$AH, s = e === d && a !== d || e.capture !== a.capture || e.once !== a.once || e.passive !== a.passive, n = e !== d && (a === d || s);
    s && this.element.removeEventListener(this.name, this, a), n && this.element.addEventListener(this.name, this, e), this._$AH = e;
  }
  handleEvent(e) {
    typeof this._$AH == "function" ? this._$AH.call(this.options?.host ?? this.element, e) : this._$AH.handleEvent(e);
  }
}
class X1 {
  constructor(e, i, a) {
    this.element = e, this.type = 6, this._$AN = void 0, this._$AM = i, this.options = a;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  _$AI(e) {
    ft(this, e);
  }
}
const B1 = { I: $t }, Y1 = Ye.litHtmlPolyfillSupport;
Y1?.(Nt, $t), (Ye.litHtmlVersions ??= []).push("3.3.3");
const Q1 = (t, e, i) => {
  const a = i?.renderBefore ?? e;
  let s = a._$litPart$;
  if (s === void 0) {
    const n = i?.renderBefore ?? null;
    a._$litPart$ = s = new $t(e.insertBefore(Zt(), n), n, void 0, i ?? {});
  }
  return s._$AI(t), s;
};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const Ge = globalThis;
let A = class extends mt {
  constructor() {
    super(...arguments), this.renderOptions = { host: this }, this._$Do = void 0;
  }
  createRenderRoot() {
    const e = super.createRenderRoot();
    return this.renderOptions.renderBefore ??= e.firstChild, e;
  }
  update(e) {
    const i = this.render();
    this.hasUpdated || (this.renderOptions.isConnected = this.isConnected), super.update(e), this._$Do = Q1(i, this.renderRoot, this.renderOptions);
  }
  connectedCallback() {
    super.connectedCallback(), this._$Do?.setConnected(!0);
  }
  disconnectedCallback() {
    super.disconnectedCallback(), this._$Do?.setConnected(!1);
  }
  render() {
    return st;
  }
};
A._$litElement$ = !0, A.finalized = !0, Ge.litElementHydrateSupport?.({ LitElement: A });
const G1 = Ge.litElementPolyfillSupport;
G1?.({ LitElement: A });
(Ge.litElementVersions ??= []).push("4.2.2");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const J1 = { attribute: !0, type: String, converter: se, reflect: !1, hasChanged: Be }, ta = (t = J1, e, i) => {
  const { kind: a, metadata: s } = i;
  let n = globalThis.litPropertyMetadata.get(s);
  if (n === void 0 && globalThis.litPropertyMetadata.set(s, n = /* @__PURE__ */ new Map()), a === "setter" && ((t = Object.create(t)).wrapped = !0), n.set(i.name, t), a === "accessor") {
    const { name: r } = i;
    return { set(c) {
      const l = e.get.call(this);
      e.set.call(this, c), this.requestUpdate(r, l, t, !0, c);
    }, init(c) {
      return c !== void 0 && this.C(r, void 0, t, c), c;
    } };
  }
  if (a === "setter") {
    const { name: r } = i;
    return function(c) {
      const l = this[r];
      e.call(this, c), this.requestUpdate(r, l, t, !0, c);
    };
  }
  throw Error("Unsupported decorator location: " + a);
};
function m(t) {
  return (e, i) => typeof i == "object" ? ta(t, e, i) : ((a, s, n) => {
    const r = s.hasOwnProperty(n);
    return s.constructor.createProperty(n, a), r ? Object.getOwnPropertyDescriptor(s, n) : void 0;
  })(t, e, i);
}
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
function C(t) {
  return m({ ...t, state: !0, attribute: !1 });
}
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const ea = (t, e, i) => (i.configurable = !0, i.enumerable = !0, Reflect.decorate && typeof e != "object" && Object.defineProperty(t, e, i), i);
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
function Je(t, e) {
  return (i, a, s) => {
    const n = (r) => r.renderRoot?.querySelector(t) ?? null;
    return ea(i, a, { get() {
      return n(this);
    } });
  };
}
function b(t) {
  return function(e) {
    return customElements.get(t) || customElements.define(t, e), e;
  };
}
const ia = x`
  :host {
    /* ---- Canvas & surfaces (light) ---- */
    --canvas: #f2f3f5;
    --surface: #ffffff;
    --surface-subtle: #f7f8fa;
    --surface-hover: #f0f2f5;
    --surface-sunken: #eceef1;
    --surface-inverse: #191c21;

    /* ---- Text ---- */
    --text-primary: #121419;
    --text-secondary: #6b717b;
    --text-tertiary: #9298a1;
    --text-on-accent: #ffffff;

    /* ---- Lines ---- */
    --border-subtle: rgba(18, 20, 25, 0.06);
    --border-strong: rgba(18, 20, 25, 0.12);

    /* ---- Elevation ---- */
    --shadow-widget: 0 1px 2px rgba(16, 24, 40, 0.04), 0 10px 30px rgba(16, 24, 40, 0.06);
    --shadow-raised: 0 8px 20px rgba(16, 24, 40, 0.1), 0 24px 48px rgba(16, 24, 40, 0.14);
    --shadow-inset-control: inset 0 0 0 1px var(--border-subtle);

    /* ---- Brand / state accents ---- */
    --accent: #2f6bff;
    --accent-hover: #285ce0;
    --accent-soft: rgba(47, 107, 255, 0.12);
    --accent-text: #2f6bff;

    --state-light: #f7b500; /* warm yellow for lights on */
    --state-light-soft: rgba(247, 181, 0, 0.16);
    --state-heat: #ff7043;
    --state-heat-soft: rgba(255, 112, 67, 0.16);
    --state-cool: #37a0f4;
    --state-cool-soft: rgba(55, 160, 244, 0.16);
    --state-eco: #2fbf71; /* green: healthy / generation */
    --state-eco-soft: rgba(47, 191, 113, 0.16);
    --state-warn: #f5a623;
    --state-warn-soft: rgba(245, 166, 35, 0.16);
    --state-alert: #f24242;
    --state-alert-soft: rgba(242, 66, 66, 0.16);

    /* Neutral idle icon container */
    --idle-bg: #eceef2;
    --idle-fg: #6b717b;
    --unavailable-fg: #9aa0a9;

    /* ---- Shape ---- */
    --radius-control: 12px;
    --radius-widget: 22px;
    --radius-sheet: 26px;
    --radius-pill: 999px;
    --radius-icon: 14px;

    /* ---- Spacing scale (4px base) ---- */
    --space-1: 4px;
    --space-2: 8px;
    --space-3: 12px;
    --space-4: 16px;
    --space-5: 20px;
    --space-6: 24px;
    --space-8: 32px;
    --space-10: 40px;
    --space-12: 48px;

    /* ---- Grid rhythm (overridden per breakpoint by the grid) ---- */
    --grid-gap: 14px;
    --grid-pad: 20px;
    --grid-unit: 104px;

    /* ---- Typography ---- */
    --font-sans: Inter, ui-sans-serif, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
      "Helvetica Neue", Arial, sans-serif;
    --font-numeric: "Inter", ui-sans-serif, system-ui, sans-serif;

    --text-view-title: 700 30px/1.15 var(--font-sans);
    --text-drawer-title: 650 24px/1.2 var(--font-sans);
    --text-value: 650 26px/1.1 var(--font-sans);
    --text-value-lg: 700 34px/1.05 var(--font-sans);
    --text-widget-title: 600 15px/1.25 var(--font-sans);
    --text-secondary-state: 500 13px/1.3 var(--font-sans);
    --text-meta: 500 11.5px/1.3 var(--font-sans);

    /* ---- Motion ---- */
    --motion-press: 120ms;
    --motion-state: 190ms;
    --motion-content: 220ms;
    --motion-surface: 280ms;
    --ease-standard: cubic-bezier(0.2, 0, 0, 1);
    --ease-emphasis: cubic-bezier(0.3, 0, 0, 1);
    --ease-exit: cubic-bezier(0.4, 0, 1, 1);

    /* ---- Focus ---- */
    --focus-ring: 0 0 0 2px var(--surface), 0 0 0 4px var(--accent);
  }

  :host([data-theme="dark"]) {
    --canvas: #0d0f12;
    --surface: #191c21;
    --surface-subtle: #21252b;
    --surface-hover: #272c33;
    --surface-sunken: #14171b;
    --surface-inverse: #f6f7f8;

    --text-primary: #f6f7f8;
    --text-secondary: #a6abb3;
    --text-tertiary: #767d87;
    --text-on-accent: #ffffff;

    --border-subtle: rgba(255, 255, 255, 0.07);
    --border-strong: rgba(255, 255, 255, 0.14);

    --shadow-widget: 0 1px 2px rgba(0, 0, 0, 0.3), 0 14px 36px rgba(0, 0, 0, 0.24);
    --shadow-raised: 0 12px 28px rgba(0, 0, 0, 0.4), 0 28px 60px rgba(0, 0, 0, 0.5);

    --accent: #4d84ff;
    --accent-hover: #6a99ff;
    --accent-soft: rgba(77, 132, 255, 0.2);
    --accent-text: #7aa5ff;

    --state-light: #ffca3a;
    --state-light-soft: rgba(255, 202, 58, 0.18);
    --state-heat: #ff845c;
    --state-heat-soft: rgba(255, 132, 92, 0.2);
    --state-cool: #56b5ff;
    --state-cool-soft: rgba(86, 181, 255, 0.2);
    --state-eco: #46d48a;
    --state-eco-soft: rgba(70, 212, 138, 0.2);
    --state-warn: #ffbe4d;
    --state-warn-soft: rgba(255, 190, 77, 0.2);
    --state-alert: #ff5c5c;
    --state-alert-soft: rgba(255, 92, 92, 0.2);

    --idle-bg: #262a31;
    --idle-fg: #a6abb3;
    --unavailable-fg: #6b717b;

    --focus-ring: 0 0 0 2px var(--surface), 0 0 0 4px var(--accent);
  }

  @media (prefers-reduced-motion: reduce) {
    :host {
      --motion-press: 0ms;
      --motion-state: 0ms;
      --motion-content: 0ms;
      --motion-surface: 0ms;
    }
  }
`, aa = x`
  .visually-hidden {
    position: absolute !important;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border: 0;
  }
  :host(:focus-visible),
  *:focus-visible {
    outline: none;
    box-shadow: var(--focus-ring);
  }
  .tnum {
    font-variant-numeric: tabular-nums;
    font-feature-settings: "tnum" 1;
  }
  .truncate {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
`, sa = {
  defaultView: "overview",
  title: "Home",
  // Wall-tablet / kiosk behaviour. Off by default; opt-in per install.
  kiosk: {
    enabled: !1,
    hideHomeAssistantSidebar: !1,
    preventScreenSelection: !1
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
          size: { compact: "2x2", medium: "2x2", wide: "2x2" }
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
            solarForecastRemaining: "sensor.helios_forecast_energy_today_remaining"
          }
        },
        {
          id: "ov-all-lights",
          type: "light",
          entity: "light.all_lights",
          name: "All lights",
          size: { compact: "2x1", medium: "2x1", wide: "2x1" }
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
            activeIcon: "mdi:lightbulb-off"
          }
        },
        {
          id: "ov-goodnight",
          type: "script",
          entity: "script.goodnight",
          name: "Goodnight",
          icon: "mdi:weather-night",
          size: { compact: "1x1", medium: "1x1", wide: "1x1" }
        },
        {
          id: "ov-presence",
          type: "person",
          entity: "person.ben",
          size: { compact: "1x1", medium: "1x1", wide: "1x1" }
        },
        {
          id: "ov-vacuum",
          type: "vacuum",
          entity: "vacuum.roborock_s8_pro_ultra",
          name: "S8 Pro Ultra",
          size: { compact: "1x1", medium: "2x2", wide: "2x2" },
          options: { brand: "roborock" }
        },
        {
          id: "ov-tv",
          type: "media",
          entity: "media_player.tv_tv",
          name: "TV",
          size: { compact: "2x1", medium: "2x2", wide: "2x2" }
        },
        {
          id: "ov-car-battery",
          type: "sensor",
          entity: "sensor.other_tesla_model_3_battery_level",
          name: "Car battery",
          icon: "mdi:car-electric",
          size: { compact: "1x1", medium: "1x1", wide: "1x1" }
        },
        {
          id: "ov-waste",
          type: "sensor",
          entity: "sensor.next_collection",
          name: "Waste pickup",
          icon: "mdi:recycle",
          size: { compact: "1x1", medium: "1x1", wide: "1x1" }
        }
      ]
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
          size: { compact: "2x1", medium: "2x1", wide: "2x1" }
        },
        {
          id: "lr-lamp",
          type: "light",
          entity: "light.living_room_living_room_table_lamp",
          name: "Table lamp",
          size: { compact: "1x1", medium: "1x1", wide: "1x1" }
        },
        {
          id: "lr-movie",
          type: "scene",
          entity: "scene.living_room_living_room_movie",
          name: "Movie",
          icon: "mdi:movie-open",
          size: { compact: "1x1", medium: "1x1", wide: "1x1" }
        },
        {
          id: "lr-tv",
          type: "media",
          entity: "media_player.tv_tv",
          name: "TV",
          size: { compact: "2x1", medium: "2x2", wide: "2x2" }
        },
        {
          id: "lr-speaker",
          type: "media",
          entity: "media_player.ht_a9_2",
          name: "HT-A9",
          size: { compact: "2x1", medium: "2x1", wide: "2x1" }
        },
        {
          id: "lr-vacuum",
          type: "vacuum",
          entity: "vacuum.roborock_s8_pro_ultra",
          name: "S8 Pro Ultra",
          size: { compact: "1x1", medium: "2x2", wide: "2x2" },
          options: { brand: "roborock" }
        }
      ]
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
          size: { compact: "2x1", medium: "2x1", wide: "2x1" }
        },
        {
          id: "k-adaptive",
          type: "switch",
          entity: "switch.kitchen_adaptive_lighting_kitchen",
          name: "Adaptive lighting",
          icon: "mdi:theme-light-dark",
          size: { compact: "1x1", medium: "1x1", wide: "1x1" }
        }
      ]
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
          size: { compact: "2x1", medium: "2x1", wide: "2x1" }
        },
        {
          id: "dr-adaptive",
          type: "switch",
          entity: "switch.dining_adaptive_lighting_dining",
          name: "Adaptive lighting",
          icon: "mdi:theme-light-dark",
          size: { compact: "1x1", medium: "1x1", wide: "1x1" }
        }
      ]
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
          size: { compact: "2x1", medium: "2x1", wide: "2x1" }
        },
        {
          id: "br-ben",
          type: "light",
          entity: "light.bedroom_bens_bed_table",
          name: "Ben’s table",
          size: { compact: "1x1", medium: "1x1", wide: "1x1" }
        },
        {
          id: "br-ilona",
          type: "light",
          entity: "light.bedroom_ilonas_bed_table",
          name: "Ilona’s table",
          size: { compact: "1x1", medium: "1x1", wide: "1x1" }
        },
        {
          id: "br-read",
          type: "scene",
          entity: "scene.bedroom_bedroom_read",
          name: "Read",
          icon: "mdi:book-open-page-variant",
          size: { compact: "1x1", medium: "1x1", wide: "1x1" }
        },
        {
          id: "br-night",
          type: "scene",
          entity: "scene.bedroom_bedroom_nightlight",
          name: "Nightlight",
          icon: "mdi:weather-night",
          size: { compact: "1x1", medium: "1x1", wide: "1x1" }
        }
      ]
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
          size: { compact: "2x1", medium: "2x1", wide: "2x1" }
        }
      ]
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
          size: { compact: "2x1", medium: "2x1", wide: "2x1" }
        },
        {
          id: "jul-go",
          type: "light",
          entity: "light.juliens_bedroom_hue_go_julien",
          name: "Hue Go",
          size: { compact: "1x1", medium: "1x1", wide: "1x1" }
        }
      ]
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
          // Extra device switches surfaced in the climate detail.
          options: {
            switches: [
              { entity: "switch.ec3a56bc6527_powerful", name: "Powerful" },
              { entity: "switch.ec3a56bc6527_economy_mode", name: "Economy" },
              { entity: "switch.ec3a56bc6527_quiet_fan", name: "Quiet fan" },
              { entity: "switch.ec3a56bc6527_human_detection", name: "Human detection" }
            ]
          }
        },
        {
          id: "of-main",
          type: "light",
          entity: "light.bens_office_bens_office",
          name: "Office",
          size: { compact: "2x1", medium: "2x1", wide: "2x1" }
        },
        {
          id: "of-screen",
          type: "light",
          entity: "light.bens_office_bens_screen",
          name: "Screen light",
          size: { compact: "1x1", medium: "1x1", wide: "1x1" }
        },
        {
          id: "of-printer",
          type: "sensor",
          entity: "sensor.hp_laserjet_pro_m404_m405",
          name: "Printer",
          icon: "mdi:printer",
          size: { compact: "1x1", medium: "1x1", wide: "1x1" }
        }
      ]
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
          size: { compact: "2x1", medium: "2x1", wide: "2x1" }
        }
      ]
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
          size: { compact: "2x1", medium: "2x1", wide: "2x1" }
        },
        {
          id: "hw-power",
          type: "sensor",
          entity: "sensor.p1_meter_power",
          name: "Grid power",
          icon: "mdi:transmission-tower",
          size: { compact: "1x1", medium: "1x1", wide: "1x1" }
        }
      ]
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
          size: { compact: "2x1", medium: "2x1", wide: "2x1" }
        }
      ]
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
          size: { compact: "2x1", medium: "2x1", wide: "2x1" }
        },
        {
          id: "car-climate",
          type: "climate",
          entity: "climate.other_tesla_model_3_climate",
          name: "Climate",
          size: { compact: "2x1", medium: "2x1", wide: "2x1" }
        },
        {
          id: "car-lock",
          type: "lock",
          entity: "lock.other_tesla_model_3_lock",
          name: "Doors",
          // Unlocking a car is sensitive → always confirm.
          requiresConfirmation: !0,
          size: { compact: "1x1", medium: "1x1", wide: "1x1" }
        },
        {
          id: "car-sentry",
          type: "switch",
          entity: "switch.other_tesla_model_3_sentry_mode",
          name: "Sentry mode",
          icon: "mdi:cctv",
          size: { compact: "1x1", medium: "1x1", wide: "1x1" }
        },
        {
          id: "car-trunk",
          type: "cover",
          entity: "cover.other_tesla_model_3_trunk",
          name: "Trunk",
          size: { compact: "1x1", medium: "1x1", wide: "1x1" }
        },
        {
          id: "car-charger",
          type: "sensor",
          entity: "sensor.tesla_wall_connector_status",
          name: "Wall connector",
          icon: "mdi:ev-station",
          size: { compact: "1x1", medium: "1x1", wide: "1x1" }
        }
      ]
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
            gridPower: "sensor.p1_meter_power",
            // signed W: + import / − export (HomeWizard P1)
            solarPower: "sensor.goodwe_pv_power",
            houseConsumption: "sensor.house_power_consumption",
            carPower: "sensor.tesla_wall_connector_total_power",
            // kW, auto-normalized
            carPowerAlt: "sensor.other_tesla_model_3_charger_power",
            // kW fallback
            carActive: "sensor.tesla_wall_connector_status",
            carActiveAlt: "sensor.other_tesla_model_3_charging"
          }
        },
        // Bespoke: the solar-only EV-charging control system (master arm, live
        // charge status, and the grid-power start/stop thresholds as sliders).
        {
          id: "en-solar-charging",
          type: "solarcharging",
          name: "Solar charging",
          size: { compact: "2x2", medium: "2x2", wide: "2x2" },
          options: {
            master: "input_boolean.tesla_solar_charging_active",
            vehicleConnected: "binary_sensor.tesla_wall_connector_vehicle_connected",
            chargingState: "sensor.other_tesla_model_3_charging",
            wallStatus: "sensor.tesla_wall_connector_status",
            chargePower: "sensor.tesla_wall_connector_total_power",
            // kW
            battery: "sensor.other_tesla_model_3_battery_level",
            chargeLimit: "number.other_tesla_model_3_charge_limit",
            sessionEnergy: "sensor.tesla_wall_connector_session_energy",
            chargeRate: "sensor.other_tesla_model_3_charge_rate",
            chargeCurrent: "number.other_tesla_model_3_charge_current",
            startThreshold: "input_number.tesla_solar_grid_start_threshold_w",
            stopThreshold: "input_number.tesla_solar_grid_stop_threshold_w",
            minCurrent: "input_number.tesla_solar_min_charge_current",
            deadband: "input_number.tesla_solar_deadband_current_a"
          }
        },
        // Long-range history from the Statistics API — solar / import / export /
        // car-charging in kWh, with a Day / Week / Month selector.
        {
          id: "en-history",
          type: "energychart",
          name: "Energy history",
          size: { compact: "2x2", medium: "4x2", wide: "4x2" },
          options: {
            solar: "sensor.goodwe_total_pv_generation",
            gridImport: "sensor.p1_meter_energy_import",
            gridExport: "sensor.p1_meter_energy_export",
            car: "sensor.tesla_wall_connector_energy",
            defaultPeriod: "day"
          }
        },
        {
          id: "en-grid-now",
          type: "sensor",
          entity: "sensor.p1_meter_power",
          name: "Grid now",
          icon: "mdi:transmission-tower",
          size: { compact: "2x1", medium: "2x1", wide: "2x1" }
        },
        {
          id: "en-solar-now",
          type: "sensor",
          entity: "sensor.goodwe_pv_power",
          name: "Solar now",
          icon: "mdi:solar-power",
          size: { compact: "1x1", medium: "1x1", wide: "1x1" }
        },
        {
          id: "en-house-now",
          type: "sensor",
          entity: "sensor.house_power_consumption",
          name: "House now",
          icon: "mdi:home-variant",
          size: { compact: "1x1", medium: "1x1", wide: "1x1" }
        },
        {
          id: "en-solar-today",
          type: "sensor",
          entity: "sensor.goodwe_today_s_pv_generation",
          name: "Solar today",
          icon: "mdi:solar-power-variant",
          size: { compact: "1x1", medium: "1x1", wide: "1x1" }
        },
        {
          id: "en-forecast",
          type: "sensor",
          entity: "sensor.energy_forecast_end_of_day",
          name: "Forecast use",
          icon: "mdi:chart-bell-curve",
          size: { compact: "1x1", medium: "1x1", wide: "1x1" }
        },
        {
          id: "en-import",
          type: "sensor",
          entity: "sensor.p1_meter_energy_import",
          name: "Imported",
          icon: "mdi:transmission-tower-import",
          size: { compact: "1x1", medium: "1x1", wide: "1x1" }
        },
        {
          id: "en-export",
          type: "sensor",
          entity: "sensor.p1_meter_energy_export",
          name: "Exported",
          icon: "mdi:transmission-tower-export",
          size: { compact: "1x1", medium: "1x1", wide: "1x1" }
        }
      ]
    }
  ]
}, Ie = ["1x1", "2x1", "1x2", "2x2", "3x3", "4x2"], na = ["compact", "medium", "wide"], ra = [
  "group",
  "light",
  "switch",
  "fan",
  "climate",
  "cover",
  "media",
  "sensor",
  "binary_sensor",
  "person",
  "scene",
  "script",
  "button",
  "lock",
  "vacuum",
  "camera",
  "weather",
  "energy",
  "powerflow",
  "solarcharging",
  "energychart",
  "alarm",
  "action"
], oa = ["media", "devices", "sensors", "energy"], vi = {
  // A container is full-width and self-sizing; the grid ignores its footprint,
  // so every size is permitted (synthetic groups carry a nominal one).
  group: Ie,
  light: ["1x1", "2x1", "1x2", "2x2"],
  switch: ["1x1", "2x1"],
  fan: ["1x1", "2x1", "1x2"],
  climate: ["2x1", "1x2", "2x2"],
  cover: ["1x1", "2x1", "1x2", "2x2"],
  media: ["2x1", "2x2"],
  sensor: ["1x1", "2x1", "1x2", "2x2"],
  binary_sensor: ["1x1", "2x1"],
  person: ["1x1", "2x1"],
  scene: ["1x1", "2x1", "1x2"],
  script: ["1x1", "2x1"],
  button: ["1x1", "2x1"],
  lock: ["1x1", "2x1"],
  vacuum: ["1x1", "2x1", "2x2"],
  camera: ["2x1", "2x2"],
  weather: ["2x1", "1x2", "2x2"],
  energy: ["2x1", "1x2", "2x2"],
  powerflow: ["2x2", "3x3"],
  solarcharging: ["2x1", "1x2", "2x2"],
  energychart: ["2x2", "4x2"],
  alarm: ["1x1", "2x1", "2x2"],
  action: ["1x1", "2x1"]
}, ca = [
  "group",
  "energy",
  "powerflow",
  "solarcharging",
  "energychart",
  "action"
], la = /^[a-z_]+\.[a-z0-9_]+$/;
function da(t) {
  return typeof t == "string" && la.test(t);
}
function ha(t) {
  return !!t && /replace_me/i.test(t);
}
function ua(t) {
  const e = [], i = (l, h) => e.push({ level: "error", path: l, message: h }), a = (l, h) => e.push({ level: "warning", path: l, message: h });
  if (!t || typeof t != "object")
    return {
      ok: !1,
      issues: [{ level: "error", path: "config", message: "Dashboard config is missing or not an object." }],
      sanitized: { defaultView: "", views: [] }
    };
  const s = /* @__PURE__ */ new Set(), n = /* @__PURE__ */ new Set(), r = [];
  (!Array.isArray(t.views) || t.views.length === 0) && i("views", "At least one view must be configured.");
  for (let l = 0; l < (t.views ?? []).length; l++) {
    const h = t.views[l], u = `views[${l}]`;
    if (!h || typeof h != "object") {
      i(u, "View must be an object.");
      continue;
    }
    if (!h.id) {
      i(u, "View is missing an `id`.");
      continue;
    }
    if (s.has(h.id)) {
      i(`${u}.id`, `Duplicate view id "${h.id}".`);
      continue;
    }
    s.add(h.id), ["overview", "room", "system"].includes(h.type) || i(`${u}.type`, `Unknown view type "${h.type}".`), h.label || a(`${u}.label`, `View "${h.id}" has no label.`);
    const p = [];
    for (let f = 0; f < (h.widgets ?? []).length; f++) {
      const g = h.widgets[f], v = `${u}.widgets[${f}]`;
      Ki(g, v, n, i) && p.push(g);
    }
    r.push({ ...h, widgets: p });
  }
  s.has(t.defaultView) || (r.length > 0 ? a(
    "defaultView",
    `defaultView "${t.defaultView}" is not a known view; falling back to "${r[0].id}".`
  ) : i("defaultView", `defaultView "${t.defaultView}" does not match any view.`));
  const c = {
    ...t,
    defaultView: s.has(t.defaultView) ? t.defaultView : r[0]?.id ?? "",
    views: r
  };
  return { ok: !e.some((l) => l.level === "error"), issues: e, sanitized: c };
}
function Ki(t, e, i, a) {
  if (!t || typeof t != "object")
    return a(e, "Widget must be an object."), !1;
  if (!t.id)
    return a(e, "Widget is missing an `id`."), !1;
  if (i.has(t.id))
    return a(`${e}.id`, `Duplicate widget id "${t.id}".`), !1;
  if (i.add(t.id), !ra.includes(t.type))
    return a(`${e}.type`, `Unknown widget type "${t.type}".`), !1;
  const s = t.type;
  if (!ca.includes(s) && !t.entity ? a(`${e}.entity`, `Widget "${t.id}" (${s}) requires an \`entity\`.`) : t.entity && !da(t.entity) && a(
    `${e}.entity`,
    `"${t.entity}" is not a valid entity_id (expected e.g. light.living_room).`
  ), !t.size || typeof t.size != "object")
    a(`${e}.size`, `Widget "${t.id}" is missing a size set.`);
  else
    for (const r of na) {
      const c = t.size[r];
      if (!c) {
        a(`${e}.size.${r}`, `Missing "${r}" size for widget "${t.id}".`);
        continue;
      }
      if (!Ie.includes(c)) {
        a(`${e}.size.${r}`, `Invalid size "${c}" (allowed: ${Ie.join(", ")}).`);
        continue;
      }
      vi[s].includes(c) || a(
        `${e}.size.${r}`,
        `Widget type "${s}" does not support size "${c}" at ${r}. Supported: ${vi[s].join(", ")}.`
      );
    }
  if (s === "group") {
    const r = t.options?.children;
    !Array.isArray(r) || r.length === 0 ? a(`${e}.options.children`, `Group "${t.id}" must have a non-empty \`children\` array.`) : r.forEach(
      (c, l) => Ki(c, `${e}.options.children[${l}]`, i, a)
    );
  }
  return !0;
}
function pa(t, e, i = window.location) {
  return t && typeof t.path == "string" ? ga(t.path) : ma(i.pathname, e);
}
function ma(t, e) {
  const i = t.replace(/^\/+/, "").split("/").filter(Boolean);
  return i[0] === e ? i[1] ?? "" : i.length > 1 ? i[1] : "";
}
function ga(t) {
  return t.replace(/^\/+/, "").split("/").filter(Boolean)[0] ?? "";
}
function fa(t, e, i) {
  return !e || e === i ? `/${t}` : `/${t}/${e}`;
}
function va(t) {
  window.location.pathname !== t && (history.pushState(null, "", t), window.dispatchEvent(new CustomEvent("location-changed", { detail: { replace: !1 } })));
}
const ba = {
  // App-launcher glyphs for media_player sources (Apple TV & friends).
  "mdi:netflix": "M6.5,2H10.5L13.44,10.83L13.5,2H17.5V22C16.25,21.78 14.87,21.64 13.41,21.58L10.5,13L10.43,21.59C9.03,21.65 7.7,21.79 6.5,22V2Z",
  "mdi:youtube": "M10,15L15.19,12L10,9V15M21.56,7.17C21.69,7.64 21.78,8.27 21.84,9.07C21.91,9.87 21.94,10.56 21.94,11.16L22,12C22,14.19 21.84,15.8 21.56,16.83C21.31,17.73 20.73,18.31 19.83,18.56C19.36,18.69 18.5,18.78 17.18,18.84C15.88,18.91 14.69,18.94 13.59,18.94L12,19C7.81,19 5.2,18.84 4.17,18.56C3.27,18.31 2.69,17.73 2.44,16.83C2.31,16.36 2.22,15.73 2.16,14.93C2.09,14.13 2.06,13.44 2.06,12.84L2,12C2,9.81 2.16,8.2 2.44,7.17C2.69,6.27 3.27,5.69 4.17,5.44C4.64,5.31 5.5,5.22 6.82,5.16C8.12,5.09 9.31,5.06 10.41,5.06L12,5C16.19,5 18.8,5.16 19.83,5.44C20.73,5.69 21.31,6.27 21.56,7.17Z",
  "mdi:youtube-tv": "M2.5,4.5H21.5C22.34,4.5 23,5.15 23,6V17.5C23,18.35 22.34,19 21.5,19H2.5C1.65,19 1,18.35 1,17.5V6C1,5.15 1.65,4.5 2.5,4.5M9.71,8.5V15L15.42,11.7L9.71,8.5M17.25,21H6.65C6.35,21 6.15,20.8 6.15,20.5C6.15,20.2 6.35,20 6.65,20H17.35C17.65,20 17.85,20.2 17.85,20.5C17.85,20.8 17.55,21 17.25,21Z",
  "mdi:apple": "M18.71,19.5C17.88,20.74 17,21.95 15.66,21.97C14.32,22 13.89,21.18 12.37,21.18C10.84,21.18 10.37,21.95 9.1,22C7.79,22.05 6.8,20.68 5.96,19.47C4.25,17 2.94,12.45 4.7,9.39C5.57,7.87 7.13,6.91 8.82,6.88C10.1,6.86 11.32,7.75 12.11,7.75C12.89,7.75 14.37,6.68 15.92,6.84C16.57,6.87 18.39,7.1 19.56,8.82C19.47,8.88 17.39,10.1 17.41,12.63C17.44,15.65 20.06,16.66 20.09,16.67C20.06,16.74 19.67,18.11 18.71,19.5M13,3.5C13.73,2.67 14.94,2.04 15.94,2C16.07,3.17 15.6,4.35 14.9,5.19C14.21,6.04 13.07,6.7 11.95,6.61C11.8,5.46 12.36,4.26 13,3.5Z",
  "mdi:television-classic": "M8.16,3L6.75,4.41L9.34,7H4C2.89,7 2,7.89 2,9V19C2,20.11 2.89,21 4,21H20C21.11,21 22,20.11 22,19V9C22,7.89 21.11,7 20,7H14.66L17.25,4.41L15.84,3L12,6.84L8.16,3M4,9H17V19H4V9M19.5,9A1,1 0 0,1 20.5,10A1,1 0 0,1 19.5,11A1,1 0 0,1 18.5,10A1,1 0 0,1 19.5,9M19.5,12A1,1 0 0,1 20.5,13A1,1 0 0,1 19.5,14A1,1 0 0,1 18.5,13A1,1 0 0,1 19.5,12Z",
  "mdi:movie-open-play": "M14.75 7.46L12 3.93L13.97 3.54L16.71 7.07L14.75 7.46M21.62 6.1L20.84 2.18L16.91 2.96L19.65 6.5L21.62 6.1M4.16 5.5L3.18 5.69C2.1 5.91 1.4 6.96 1.61 8.04L2 10L6.9 9.03L4.16 5.5M11.81 8.05L9.07 4.5L7.1 4.91L9.85 8.44L11.81 8.05M2 10V20C2 21.11 2.9 22 4 22H13.81C13.3 21.12 13 20.1 13 19C13 15.69 15.69 13 19 13C20.1 13 21.12 13.3 22 13.81V10H2M17 22L22 19L17 16V22Z",
  "mdi:movie-roll": "M12,2A10,10 0 0,1 22,12A10,10 0 0,1 12,22A10,10 0 0,1 2,12A10,10 0 0,1 12,2M12,4A2.5,2.5 0 0,0 9.5,6.5A2.5,2.5 0 0,0 12,9A2.5,2.5 0 0,0 14.5,6.5A2.5,2.5 0 0,0 12,4M4.4,9.53C3.97,10.84 4.69,12.25 6,12.68C7.32,13.1 8.73,12.39 9.15,11.07C9.58,9.76 8.86,8.35 7.55,7.92C6.24,7.5 4.82,8.21 4.4,9.53M19.61,9.5C19.18,8.21 17.77,7.5 16.46,7.92C15.14,8.34 14.42,9.75 14.85,11.07C15.28,12.38 16.69,13.1 18,12.67C19.31,12.25 20.03,10.83 19.61,9.5M7.31,18.46C8.42,19.28 10,19.03 10.8,17.91C11.61,16.79 11.36,15.23 10.24,14.42C9.13,13.61 7.56,13.86 6.75,14.97C5.94,16.09 6.19,17.65 7.31,18.46M16.7,18.46C17.82,17.65 18.07,16.09 17.26,14.97C16.45,13.85 14.88,13.6 13.77,14.42C12.65,15.23 12.4,16.79 13.21,17.91C14,19.03 15.59,19.27 16.7,18.46M12,10.5A1.5,1.5 0 0,0 10.5,12A1.5,1.5 0 0,0 12,13.5A1.5,1.5 0 0,0 13.5,12A1.5,1.5 0 0,0 12,10.5Z",
  "mdi:filmstrip": "M18,9H16V7H18M18,13H16V11H18M18,17H16V15H18M8,9H6V7H8M8,13H6V11H8M8,17H6V15H8M18,3V5H16V3H8V5H6V3H4V21H6V19H8V21H16V19H18V21H20V3H18Z",
  "mdi:podcast": "M17,18.25V21.5H7V18.25C7,16.87 9.24,15.75 12,15.75C14.76,15.75 17,16.87 17,18.25M12,5.5A6.5,6.5 0 0,1 18.5,12C18.5,13.25 18.15,14.42 17.54,15.41L16,14.04C16.32,13.43 16.5,12.73 16.5,12C16.5,9.5 14.5,7.5 12,7.5C9.5,7.5 7.5,9.5 7.5,12C7.5,12.73 7.68,13.43 8,14.04L6.46,15.41C5.85,14.42 5.5,13.25 5.5,12A6.5,6.5 0 0,1 12,5.5M12,1.5A10.5,10.5 0 0,1 22.5,12C22.5,14.28 21.77,16.39 20.54,18.11L19.04,16.76C19.96,15.4 20.5,13.76 20.5,12A8.5,8.5 0 0,0 12,3.5A8.5,8.5 0 0,0 3.5,12C3.5,13.76 4.04,15.4 4.96,16.76L3.46,18.11C2.23,16.39 1.5,14.28 1.5,12A10.5,10.5 0 0,1 12,1.5M12,9.5A2.5,2.5 0 0,1 14.5,12A2.5,2.5 0 0,1 12,14.5A2.5,2.5 0 0,1 9.5,12A2.5,2.5 0 0,1 12,9.5Z",
  "mdi:music": "M21,3V15.5A3.5,3.5 0 0,1 17.5,19A3.5,3.5 0 0,1 14,15.5A3.5,3.5 0 0,1 17.5,12C18.04,12 18.55,12.12 19,12.34V6.47L9,8.6V17.5A3.5,3.5 0 0,1 5.5,21A3.5,3.5 0 0,1 2,17.5A3.5,3.5 0 0,1 5.5,14C6.04,14 6.55,14.12 7,14.34V6L21,3Z",
  "mdi:image-multiple": "M22,16V4A2,2 0 0,0 20,2H8A2,2 0 0,0 6,4V16A2,2 0 0,0 8,18H20A2,2 0 0,0 22,16M11,12L13.03,14.71L16,11L20,16H8M2,6V20A2,2 0 0,0 4,22H18V20H4V6",
  "mdi:cog": "M12,15.5A3.5,3.5 0 0,1 8.5,12A3.5,3.5 0 0,1 12,8.5A3.5,3.5 0 0,1 15.5,12A3.5,3.5 0 0,1 12,15.5M19.43,12.97C19.47,12.65 19.5,12.33 19.5,12C19.5,11.67 19.47,11.34 19.43,11L21.54,9.37C21.73,9.22 21.78,8.95 21.66,8.73L19.66,5.27C19.54,5.05 19.27,4.96 19.05,5.05L16.56,6.05C16.04,5.66 15.5,5.32 14.87,5.07L14.5,2.42C14.46,2.18 14.25,2 14,2H10C9.75,2 9.54,2.18 9.5,2.42L9.13,5.07C8.5,5.32 7.96,5.66 7.44,6.05L4.95,5.05C4.73,4.96 4.46,5.05 4.34,5.27L2.34,8.73C2.21,8.95 2.27,9.22 2.46,9.37L4.57,11C4.53,11.34 4.5,11.67 4.5,12C4.5,12.33 4.53,12.65 4.57,12.97L2.46,14.63C2.27,14.78 2.21,15.05 2.34,15.27L4.34,18.73C4.46,18.95 4.73,19.03 4.95,18.95L7.44,17.94C7.96,18.34 8.5,18.68 9.13,18.93L9.5,21.58C9.54,21.82 9.75,22 10,22H14C14.25,22 14.46,21.82 14.5,21.58L14.87,18.93C15.5,18.67 16.04,18.34 16.56,17.94L19.05,18.95C19.27,19.03 19.54,18.95 19.66,18.73L21.66,15.27C21.78,15.05 21.73,14.78 21.54,14.63L19.43,12.97Z",
  "mdi:controller-classic": "M6,7H18A5,5 0 0,1 23,12A5,5 0 0,1 18,17C16.36,17 14.91,16.21 14,15H10C9.09,16.21 7.64,17 6,17A5,5 0 0,1 1,12A5,5 0 0,1 6,7M19.75,9.5A1.25,1.25 0 0,0 18.5,10.75A1.25,1.25 0 0,0 19.75,12A1.25,1.25 0 0,0 21,10.75A1.25,1.25 0 0,0 19.75,9.5M17.25,12A1.25,1.25 0 0,0 16,13.25A1.25,1.25 0 0,0 17.25,14.5A1.25,1.25 0 0,0 18.5,13.25A1.25,1.25 0 0,0 17.25,12M5,9V11H3V13H5V15H7V13H9V11H7V9H5Z",
  "mdi:video-outline": "M15,8V16H5V8H15M16,6H4A1,1 0 0,0 3,7V17A1,1 0 0,0 4,18H16A1,1 0 0,0 17,17V13.5L21,17.5V6.5L17,10.5V7A1,1 0 0,0 16,6Z",
  "mdi:speedometer": "M12,16A3,3 0 0,1 9,13C9,11.88 9.61,10.9 10.5,10.39L20.21,4.77L14.68,14.35C14.18,15.33 13.17,16 12,16M12,3C13.81,3 15.5,3.5 16.97,4.32L14.87,5.53C14,5.19 13,5 12,5A8,8 0 0,0 4,13C4,15.21 4.89,17.21 6.34,18.65H6.35C6.74,19.04 6.74,19.67 6.35,20.06C5.96,20.45 5.32,20.45 4.93,20.07V20.07C3.12,18.26 2,15.76 2,13A10,10 0 0,1 12,3M22,13C22,15.76 20.88,18.26 19.07,20.07V20.07C18.68,20.45 18.05,20.45 17.66,20.06C17.27,19.67 17.27,19.04 17.66,18.65V18.65C19.11,17.2 20,15.21 20,13C20,12 19.81,11 19.46,10.1L20.67,8C21.5,9.5 22,11.18 22,13Z",
  "mdi:laptop": "M4,6H20V16H4M20,18A2,2 0 0,0 22,16V6C22,4.89 21.1,4 20,4H4C2.89,4 2,4.89 2,6V16A2,2 0 0,0 4,18H0V20H24V18H20Z",
  "mdi:vpn": "M9,5H15L12,8L9,5M10.5,14.66C10.2,15 10,15.5 10,16A2,2 0 0,0 12,18A2,2 0 0,0 14,16C14,15.45 13.78,14.95 13.41,14.59L14.83,13.17C15.55,13.9 16,14.9 16,16A4,4 0 0,1 12,20A4,4 0 0,1 8,16C8,14.93 8.42,13.96 9.1,13.25L9.09,13.24L16.17,6.17V6.17C16.89,5.45 17.89,5 19,5A4,4 0 0,1 23,9A4,4 0 0,1 19,13C17.9,13 16.9,12.55 16.17,11.83L17.59,10.41C17.95,10.78 18.45,11 19,11A2,2 0 0,0 21,9A2,2 0 0,0 19,7C18.45,7 17.95,7.22 17.59,7.59L10.5,14.66M6.41,7.59C6.05,7.22 5.55,7 5,7A2,2 0 0,0 3,9A2,2 0 0,0 5,11C5.55,11 6.05,10.78 6.41,10.41L7.83,11.83C7.1,12.55 6.1,13 5,13A4,4 0 0,1 1,9A4,4 0 0,1 5,5C6.11,5 7.11,5.45 7.83,6.17V6.17L10.59,8.93L9.17,10.35L6.41,7.59Z",
  "mdi:heart-pulse": "M7.5,4A5.5,5.5 0 0,0 2,9.5C2,10 2.09,10.5 2.22,11H6.3L7.57,7.63C7.87,6.83 9.05,6.75 9.43,7.63L11.5,13L12.09,11.58C12.22,11.25 12.57,11 13,11H21.78C21.91,10.5 22,10 22,9.5A5.5,5.5 0 0,0 16.5,4C14.64,4 13,4.93 12,6.34C11,4.93 9.36,4 7.5,4V4M3,12.5A1,1 0 0,0 2,13.5A1,1 0 0,0 3,14.5H5.44L11,20C12,20.9 12,20.9 13,20L18.56,14.5H21A1,1 0 0,0 22,13.5A1,1 0 0,0 21,12.5H13.4L12.47,14.8C12.07,15.81 10.92,15.67 10.55,14.83L8.5,9.5L7.54,11.83C7.39,12.21 7.05,12.5 6.6,12.5H3Z",
  "mdi:apps": "M16,20H20V16H16M16,14H20V10H16M10,8H14V4H10M16,8H20V4H16M10,14H14V10H10M4,14H8V10H4M4,20H8V16H4M10,20H14V16H10M4,8H8V4H4V8Z",
  "mdi:play-box-multiple": "M4,6H2V20A2,2 0 0,0 4,22H18V20H4V6M20,2H8A2,2 0 0,0 6,4V16A2,2 0 0,0 8,18H20A2,2 0 0,0 22,16V4A2,2 0 0,0 20,2M12,14.5V5.5L18,10L12,14.5Z",
  "mdi:account": "M12,4A4,4 0 0,1 16,8A4,4 0 0,1 12,12A4,4 0 0,1 8,8A4,4 0 0,1 12,4M12,14C16.42,14 20,15.79 20,18V20H4V18C4,15.79 7.58,14 12,14Z",
  "mdi:air-filter": "M19,18.31V20A2,2 0 0,1 17,22H7A2,2 0 0,1 5,20V16.3C4.54,16.12 3.95,16 3,16A1,1 0 0,1 2,15A1,1 0 0,1 3,14C3.82,14 4.47,14.08 5,14.21V12.3C4.54,12.12 3.95,12 3,12A1,1 0 0,1 2,11A1,1 0 0,1 3,10C3.82,10 4.47,10.08 5,10.21V8.3C4.54,8.12 3.95,8 3,8A1,1 0 0,1 2,7A1,1 0 0,1 3,6C3.82,6 4.47,6.08 5,6.21V4A2,2 0 0,1 7,2H17A2,2 0 0,1 19,4V6.16C20.78,6.47 21.54,7.13 21.71,7.29C22.1,7.68 22.1,8.32 21.71,8.71C21.32,9.1 20.8,9.09 20.29,8.71V8.71C20.29,8.71 19.25,8 17,8C15.74,8 14.91,8.41 13.95,8.9C12.91,9.41 11.74,10 10,10C9.64,10 9.31,10 9,9.96V7.95C9.3,8 9.63,8 10,8C11.26,8 12.09,7.59 13.05,7.11C14.09,6.59 15.27,6 17,6V4H7V20H17V18C18.5,18 18.97,18.29 19,18.31M17,10C15.27,10 14.09,10.59 13.05,11.11C12.09,11.59 11.26,12 10,12C9.63,12 9.3,12 9,11.95V13.96C9.31,14 9.64,14 10,14C11.74,14 12.91,13.41 13.95,12.9C14.91,12.42 15.74,12 17,12C19.25,12 20.29,12.71 20.29,12.71V12.71C20.8,13.1 21.32,13.1 21.71,12.71C22.1,12.32 22.1,11.69 21.71,11.29C21.5,11.08 20.25,10 17,10M17,14C15.27,14 14.09,14.59 13.05,15.11C12.09,15.59 11.26,16 10,16C9.63,16 9.3,16 9,15.95V17.96C9.31,18 9.64,18 10,18C11.74,18 12.91,17.41 13.95,16.9C14.91,16.42 15.74,16 17,16C19.25,16 20.29,16.71 20.29,16.71V16.71C20.8,17.1 21.32,17.1 21.71,16.71C22.1,16.32 22.1,15.69 21.71,15.29C21.5,15.08 20.25,14 17,14Z",
  "mdi:alert": "M13 14H11V9H13M13 18H11V16H13M1 21H23L12 2L1 21Z",
  "mdi:alert-circle": "M13,13H11V7H13M13,17H11V15H13M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2Z",
  "mdi:alert-circle-outline": "M11,15H13V17H11V15M11,7H13V13H11V7M12,2C6.47,2 2,6.5 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M12,20A8,8 0 0,1 4,12A8,8 0 0,1 12,4A8,8 0 0,1 20,12A8,8 0 0,1 12,20Z",
  "mdi:arrow-collapse-vertical": "M4,12H20V14H4V12M4,9H20V11H4V9M16,4L12,8L8,4H11V1H13V4H16M8,19L12,15L16,19H13V22H11V19H8Z",
  "mdi:arrow-down": "M11,4H13V16L18.5,10.5L19.92,11.92L12,19.84L4.08,11.92L5.5,10.5L11,16V4Z",
  "mdi:arrow-expand-vertical": "M13,9V15H16L12,19L8,15H11V9H8L12,5L16,9H13M4,2H20V4H4V2M4,20H20V22H4V20Z",
  "mdi:arrow-up": "M13,20H11V8L5.5,13.5L4.08,12.08L12,4.16L19.92,12.08L18.5,13.5L13,8V20Z",
  "mdi:awning-outline": "M5.06 7C4.63 7 4.22 7.14 3.84 7.42C3.46 7.7 3.24 8.06 3.14 8.5L2.11 12.91C1.86 14 2.06 14.92 2.69 15.73C2.81 15.85 2.93 15.97 3.04 16.07C3.63 16.64 4.28 17 5.22 17C6.16 17 6.91 16.59 7.47 16.05C8.1 16.67 8.86 17 9.8 17C10.64 17 11.44 16.63 12 16.07C12.68 16.7 13.45 17 14.3 17C15.17 17 15.91 16.67 16.54 16.05C17.11 16.62 17.86 17 18.81 17C19.76 17 20.43 16.65 21 16.06C21.09 15.97 21.18 15.87 21.28 15.77C21.94 14.95 22.14 14 21.89 12.91L20.86 8.5C20.73 8.06 20.5 7.7 20.13 7.42C19.77 7.14 19.38 7 18.94 7H5.06M18.89 8.97L19.97 13.38C20.06 13.81 19.97 14.2 19.69 14.55C19.44 14.86 19.13 15 18.75 15C18.44 15 18.17 14.9 17.95 14.66C17.73 14.43 17.61 14.16 17.58 13.84L16.97 9L18.89 8.97M5.06 9H7.03L6.42 13.84C6.3 14.63 5.91 15 5.25 15C4.84 15 4.53 14.86 4.31 14.55C4.03 14.2 3.94 13.81 4.03 13.38L5.06 9M9.05 9H11V13.7C11 14.05 10.89 14.35 10.64 14.62C10.39 14.88 10.08 15 9.7 15C9.36 15 9.07 14.88 8.84 14.59C8.61 14.3 8.5 14 8.5 13.66V13.5L9.05 9M13 9H14.95L15.5 13.5C15.58 13.92 15.5 14.27 15.21 14.57C14.95 14.87 14.61 15 14.2 15C13.89 15 13.61 14.88 13.36 14.62C13.11 14.35 13 14.05 13 13.7V9Z",
  "mdi:battery": "M16.67,4H15V2H9V4H7.33A1.33,1.33 0 0,0 6,5.33V20.67C6,21.4 6.6,22 7.33,22H16.67A1.33,1.33 0 0,0 18,20.67V5.33C18,4.6 17.4,4 16.67,4Z",
  "mdi:battery-10": "M16,18H8V6H16M16.67,4H15V2H9V4H7.33A1.33,1.33 0 0,0 6,5.33V20.67C6,21.4 6.6,22 7.33,22H16.67A1.33,1.33 0 0,0 18,20.67V5.33C18,4.6 17.4,4 16.67,4Z",
  "mdi:battery-20": "M16,17H8V6H16M16.67,4H15V2H9V4H7.33A1.33,1.33 0 0,0 6,5.33V20.67C6,21.4 6.6,22 7.33,22H16.67A1.33,1.33 0 0,0 18,20.67V5.33C18,4.6 17.4,4 16.67,4Z",
  "mdi:battery-30": "M16,15H8V6H16M16.67,4H15V2H9V4H7.33A1.33,1.33 0 0,0 6,5.33V20.67C6,21.4 6.6,22 7.33,22H16.67A1.33,1.33 0 0,0 18,20.67V5.33C18,4.6 17.4,4 16.67,4Z",
  "mdi:battery-40": "M16,14H8V6H16M16.67,4H15V2H9V4H7.33A1.33,1.33 0 0,0 6,5.33V20.67C6,21.4 6.6,22 7.33,22H16.67A1.33,1.33 0 0,0 18,20.67V5.33C18,4.6 17.4,4 16.67,4Z",
  "mdi:battery-50": "M16,13H8V6H16M16.67,4H15V2H9V4H7.33A1.33,1.33 0 0,0 6,5.33V20.67C6,21.4 6.6,22 7.33,22H16.67A1.33,1.33 0 0,0 18,20.67V5.33C18,4.6 17.4,4 16.67,4Z",
  "mdi:battery-60": "M16,12H8V6H16M16.67,4H15V2H9V4H7.33A1.33,1.33 0 0,0 6,5.33V20.67C6,21.4 6.6,22 7.33,22H16.67A1.33,1.33 0 0,0 18,20.67V5.33C18,4.6 17.4,4 16.67,4Z",
  "mdi:battery-70": "M16,10H8V6H16M16.67,4H15V2H9V4H7.33A1.33,1.33 0 0,0 6,5.33V20.67C6,21.4 6.6,22 7.33,22H16.67A1.33,1.33 0 0,0 18,20.67V5.33C18,4.6 17.4,4 16.67,4Z",
  "mdi:battery-80": "M16,9H8V6H16M16.67,4H15V2H9V4H7.33A1.33,1.33 0 0,0 6,5.33V20.67C6,21.4 6.6,22 7.33,22H16.67A1.33,1.33 0 0,0 18,20.67V5.33C18,4.6 17.4,4 16.67,4Z",
  "mdi:battery-90": "M16,8H8V6H16M16.67,4H15V2H9V4H7.33A1.33,1.33 0 0,0 6,5.33V20.67C6,21.4 6.6,22 7.33,22H16.67A1.33,1.33 0 0,0 18,20.67V5.33C18,4.6 17.4,4 16.67,4Z",
  "mdi:battery-alert": "M13 14H11V8H13M13 18H11V16H13M16.7 4H15V2H9V4H7.3C6.6 4 6 4.6 6 5.3V20.6C6 21.4 6.6 22 7.3 22H16.6C17.3 22 17.9 21.4 17.9 20.7V5.3C18 4.6 17.4 4 16.7 4Z",
  "mdi:battery-alert-variant-outline": "M14 20H6V6H14M14.67 4H13V2H7V4H5.33C4.6 4 4 4.6 4 5.33V20.67C4 21.4 4.6 22 5.33 22H14.67C15.4 22 16 21.4 16 20.67V5.33C16 4.6 15.4 4 14.67 4M21 7H19V13H21V8M21 15H19V17H21V15Z",
  "mdi:battery-charging": "M16.67,4H15V2H9V4H7.33A1.33,1.33 0 0,0 6,5.33V20.66C6,21.4 6.6,22 7.33,22H16.66C17.4,22 18,21.4 18,20.67V5.33C18,4.6 17.4,4 16.67,4M11,20V14.5H9L13,7V12.5H15",
  "mdi:battery-charging-10": "M23.05,11H20.05V4L15.05,14H18.05V22M12,18H4L4.05,6H12.05M12.72,4H11.05V2H5.05V4H3.38A1.33,1.33 0 0,0 2.05,5.33V20.67C2.05,21.4 2.65,22 3.38,22H12.72C13.45,22 14.05,21.4 14.05,20.67V5.33A1.33,1.33 0 0,0 12.72,4Z",
  "mdi:battery-charging-100": "M23,11H20V4L15,14H18V22M12.67,4H11V2H5V4H3.33A1.33,1.33 0 0,0 2,5.33V20.67C2,21.4 2.6,22 3.33,22H12.67C13.4,22 14,21.4 14,20.67V5.33A1.33,1.33 0 0,0 12.67,4Z",
  "mdi:battery-charging-20": "M23.05,11H20.05V4L15.05,14H18.05V22M12.05,17H4.05V6H12.05M12.72,4H11.05V2H5.05V4H3.38A1.33,1.33 0 0,0 2.05,5.33V20.67C2.05,21.4 2.65,22 3.38,22H12.72C13.45,22 14.05,21.4 14.05,20.67V5.33A1.33,1.33 0 0,0 12.72,4Z",
  "mdi:battery-charging-30": "M12,15H4V6H12M12.67,4H11V2H5V4H3.33A1.33,1.33 0 0,0 2,5.33V20.67C2,21.4 2.6,22 3.33,22H12.67C13.4,22 14,21.4 14,20.67V5.33A1.33,1.33 0 0,0 12.67,4M23,11H20V4L15,14H18V22L23,11Z",
  "mdi:battery-charging-40": "M13 4H11V2H5V4H3C2.4 4 2 4.4 2 5V21C2 21.6 2.4 22 3 22H13C13.6 22 14 21.6 14 21V5C14 4.4 13.6 4 13 4M12 14.5H4V6H12V14.5M23 11H20V4L15 14H18V22",
  "mdi:battery-charging-50": "M23,11H20V4L15,14H18V22M12,13H4V6H12M12.67,4H11V2H5V4H3.33A1.33,1.33 0 0,0 2,5.33V20.67C2,21.4 2.6,22 3.33,22H12.67C13.4,22 14,21.4 14,20.67V5.33A1.33,1.33 0 0,0 12.67,4Z",
  "mdi:battery-charging-60": "M12,11H4V6H12M12.67,4H11V2H5V4H3.33A1.33,1.33 0 0,0 2,5.33V20.67C2,21.4 2.6,22 3.33,22H12.67C13.4,22 14,21.4 14,20.67V5.33A1.33,1.33 0 0,0 12.67,4M23,11H20V4L15,14H18V22L23,11Z",
  "mdi:battery-charging-70": "M12,10H4V6H12M12.67,4H11V2H5V4H3.33A1.33,1.33 0 0,0 2,5.33V20.67C2,21.4 2.6,22 3.33,22H12.67C13.4,22 14,21.4 14,20.67V5.33A1.33,1.33 0 0,0 12.67,4M23,11H20V4L15,14H18V22L23,11Z",
  "mdi:battery-charging-80": "M23,11H20V4L15,14H18V22M12,9H4V6H12M12.67,4H11V2H5V4H3.33A1.33,1.33 0 0,0 2,5.33V20.67C2,21.4 2.6,22 3.33,22H12.67C13.4,22 14,21.4 14,20.67V5.33A1.33,1.33 0 0,0 12.67,4Z",
  "mdi:battery-charging-90": "M23,11H20V4L15,14H18V22M12,8H4V6H12M12.67,4H11V2H5V4H3.33A1.33,1.33 0 0,0 2,5.33V20.67C2,21.4 2.6,22 3.33,22H12.67C13.4,22 14,21.4 14,20.67V5.33A1.33,1.33 0 0,0 12.67,4Z",
  "mdi:battery-outline": "M16,20H8V6H16M16.67,4H15V2H9V4H7.33A1.33,1.33 0 0,0 6,5.33V20.67C6,21.4 6.6,22 7.33,22H16.67A1.33,1.33 0 0,0 18,20.67V5.33C18,4.6 17.4,4 16.67,4Z",
  "mdi:bed-outline": "M7 14C8.66 14 10 12.66 10 11C10 9.34 8.66 8 7 8C5.34 8 4 9.34 4 11C4 12.66 5.34 14 7 14M7 10C7.55 10 8 10.45 8 11C8 11.55 7.55 12 7 12C6.45 12 6 11.55 6 11C6 10.45 6.45 10 7 10M19 7H11V15H3V5H1V20H3V17H21V20H23V11C23 8.79 21.21 7 19 7M21 15H13V9H19C20.1 9 21 9.9 21 11Z",
  "mdi:blinds": "M3,2H21A1,1 0 0,1 22,3V5A1,1 0 0,1 21,6H20V13A1,1 0 0,1 19,14H13V16.17C14.17,16.58 15,17.69 15,19A3,3 0 0,1 12,22A3,3 0 0,1 9,19C9,17.69 9.83,16.58 11,16.17V14H5A1,1 0 0,1 4,13V6H3A1,1 0 0,1 2,5V3A1,1 0 0,1 3,2M12,18A1,1 0 0,0 11,19A1,1 0 0,0 12,20A1,1 0 0,0 13,19A1,1 0 0,0 12,18Z",
  "mdi:book-open-page-variant": "M19 2L14 6.5V17.5L19 13V2M6.5 5C4.55 5 2.45 5.4 1 6.5V21.16C1 21.41 1.25 21.66 1.5 21.66C1.6 21.66 1.65 21.59 1.75 21.59C3.1 20.94 5.05 20.5 6.5 20.5C8.45 20.5 10.55 20.9 12 22C13.35 21.15 15.8 20.5 17.5 20.5C19.15 20.5 20.85 20.81 22.25 21.56C22.35 21.61 22.4 21.59 22.5 21.59C22.75 21.59 23 21.34 23 21.09V6.5C22.4 6.05 21.75 5.75 21 5.5V19C19.9 18.65 18.7 18.5 17.5 18.5C15.8 18.5 13.35 19.15 12 20V6.5C10.55 5.4 8.45 5 6.5 5Z",
  "mdi:brightness-5": "M12,18A6,6 0 0,1 6,12A6,6 0 0,1 12,6A6,6 0 0,1 18,12A6,6 0 0,1 12,18M20,15.31L23.31,12L20,8.69V4H15.31L12,0.69L8.69,4H4V8.69L0.69,12L4,15.31V20H8.69L12,23.31L15.31,20H20V15.31Z",
  "mdi:car-electric": "M18.92 2C18.72 1.42 18.16 1 17.5 1H6.5C5.84 1 5.29 1.42 5.08 2L3 8V16C3 16.55 3.45 17 4 17H5C5.55 17 6 16.55 6 16V15H18V16C18 16.55 18.45 17 19 17H20C20.55 17 21 16.55 21 16V8L18.92 2M6.5 12C5.67 12 5 11.33 5 10.5S5.67 9 6.5 9 8 9.67 8 10.5 7.33 12 6.5 12M17.5 12C16.67 12 16 11.33 16 10.5S16.67 9 17.5 9 19 9.67 19 10.5 18.33 12 17.5 12M5 7L6.5 2.5H17.5L19 7H5M7 20H11V18L17 21H13V23L7 20Z",
  "mdi:car-electric-outline": "M18.92 2C18.72 1.42 18.16 1 17.5 1H6.5C5.84 1 5.29 1.42 5.08 2L3 8V16C3 16.55 3.45 17 4 17H5C5.55 17 6 16.55 6 16V15H18V16C18 16.55 18.45 17 19 17H20C20.55 17 21 16.55 21 16V8L18.92 2M6.85 3H17.14L18.22 6.11H5.77L6.85 3M19 13H5V8H19V13M7.5 9C8.33 9 9 9.67 9 10.5S8.33 12 7.5 12 6 11.33 6 10.5 6.67 9 7.5 9M16.5 9C17.33 9 18 9.67 18 10.5S17.33 12 16.5 12C15.67 12 15 11.33 15 10.5S15.67 9 16.5 9M7 20H11V18L17 21H13V23L7 20Z",
  "mdi:cast": "M1,10V12A9,9 0 0,1 10,21H12C12,14.92 7.07,10 1,10M1,14V16A5,5 0 0,1 6,21H8A7,7 0 0,0 1,14M1,18V21H4A3,3 0 0,0 1,18M21,3H3C1.89,3 1,3.89 1,5V8H3V5H21V19H14V21H21A2,2 0 0,0 23,19V5C23,3.89 22.1,3 21,3Z",
  "mdi:cast-connected": "M21,3H3C1.89,3 1,3.89 1,5V8H3V5H21V19H14V21H21A2,2 0 0,0 23,19V5C23,3.89 22.1,3 21,3M1,10V12A9,9 0 0,1 10,21H12C12,14.92 7.07,10 1,10M19,7H5V8.63C8.96,9.91 12.09,13.04 13.37,17H19M1,14V16A5,5 0 0,1 6,21H8A7,7 0 0,0 1,14M1,18V21H4A3,3 0 0,0 1,18Z",
  "mdi:cctv": "M6.03 12.03L8.03 15.5L5.5 18.68L2 12.62L6.03 12.03M17 18V15.29C17.88 14.9 18.5 14.03 18.5 13C18.5 12.43 18.3 11.9 17.97 11.5L19.94 10.35C20.95 9.76 21.3 8.47 20.71 7.46L19.33 5.06C18.74 4.05 17.45 3.7 16.44 4.28L8.31 9C7.36 9.53 7.03 10.75 7.58 11.71L9.08 14.31C9.63 15.26 10.86 15.59 11.81 15.04L13.69 13.96C13.94 14.55 14.41 15.03 15 15.29V18C15 19.1 15.9 20 17 20H22V18H17Z",
  "mdi:chart-bell-curve": "M9.96,11.31C10.82,8.1 11.5,6 13,6C14.5,6 15.18,8.1 16.04,11.31C17,14.92 18.1,19 22,19V17C19.8,17 19,14.54 17.97,10.8C17.08,7.46 16.15,4 13,4C9.85,4 8.92,7.46 8.03,10.8C7.03,14.54 6.2,17 4,17V2H2V22H22V20H4V19C7.9,19 9,14.92 9.96,11.31Z",
  "mdi:chart-line": "M16,11.78L20.24,4.45L21.97,5.45L16.74,14.5L10.23,10.75L5.46,19H22V21H2V3H4V17.54L9.5,8L16,11.78Z",
  "mdi:check": "M21,7L9,19L3.5,13.5L4.91,12.09L9,16.17L19.59,5.59L21,7Z",
  "mdi:chevron-down": "M7.41,8.58L12,13.17L16.59,8.58L18,10L12,16L6,10L7.41,8.58Z",
  "mdi:chevron-left": "M15.41,16.58L10.83,12L15.41,7.41L14,6L8,12L14,18L15.41,16.58Z",
  "mdi:chevron-right": "M8.59,16.58L13.17,12L8.59,7.41L10,6L16,12L10,18L8.59,16.58Z",
  "mdi:chevron-up": "M7.41,15.41L12,10.83L16.59,15.41L18,14L12,8L6,14L7.41,15.41Z",
  "mdi:circle-medium": "M12,8A4,4 0 0,0 8,12A4,4 0 0,0 12,16A4,4 0 0,0 16,12A4,4 0 0,0 12,8Z",
  "mdi:close": "M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z",
  "mdi:coat-rack": "M18.33 7.78A1 1 0 0 0 16.66 8.89A2 2 0 1 1 13 10V7.82A3 3 0 1 0 11 7.82V10A2 2 0 1 1 7.34 8.89A1 1 0 1 0 5.67 7.78A4 4 0 0 0 11 13.46V20A2 2 0 0 0 9 22H15A2 2 0 0 0 13 20V13.46A4 4 0 0 0 18.33 7.78M12 4A1 1 0 1 1 11 5A1 1 0 0 1 12 4Z",
  "mdi:cog-outline": "M12,8A4,4 0 0,1 16,12A4,4 0 0,1 12,16A4,4 0 0,1 8,12A4,4 0 0,1 12,8M12,10A2,2 0 0,0 10,12A2,2 0 0,0 12,14A2,2 0 0,0 14,12A2,2 0 0,0 12,10M10,22C9.75,22 9.54,21.82 9.5,21.58L9.13,18.93C8.5,18.68 7.96,18.34 7.44,17.94L4.95,18.95C4.73,19.03 4.46,18.95 4.34,18.73L2.34,15.27C2.21,15.05 2.27,14.78 2.46,14.63L4.57,12.97L4.5,12L4.57,11L2.46,9.37C2.27,9.22 2.21,8.95 2.34,8.73L4.34,5.27C4.46,5.05 4.73,4.96 4.95,5.05L7.44,6.05C7.96,5.66 8.5,5.32 9.13,5.07L9.5,2.42C9.54,2.18 9.75,2 10,2H14C14.25,2 14.46,2.18 14.5,2.42L14.87,5.07C15.5,5.32 16.04,5.66 16.56,6.05L19.05,5.05C19.27,4.96 19.54,5.05 19.66,5.27L21.66,8.73C21.79,8.95 21.73,9.22 21.54,9.37L19.43,11L19.5,12L19.43,13L21.54,14.63C21.73,14.78 21.79,15.05 21.66,15.27L19.66,18.73C19.54,18.95 19.27,19.04 19.05,18.95L16.56,17.95C16.04,18.34 15.5,18.68 14.87,18.93L14.5,21.58C14.46,21.82 14.25,22 14,22H10M11.25,4L10.88,6.61C9.68,6.86 8.62,7.5 7.85,8.39L5.44,7.35L4.69,8.65L6.8,10.2C6.4,11.37 6.4,12.64 6.8,13.8L4.68,15.36L5.43,16.66L7.86,15.62C8.63,16.5 9.68,17.14 10.87,17.38L11.24,20H12.76L13.13,17.39C14.32,17.14 15.37,16.5 16.14,15.62L18.57,16.66L19.32,15.36L17.2,13.81C17.6,12.64 17.6,11.37 17.2,10.2L19.31,8.65L18.56,7.35L16.15,8.39C15.38,7.5 14.32,6.86 13.12,6.62L12.75,4H11.25Z",
  "mdi:crosshairs-gps": "M12,8A4,4 0 0,1 16,12A4,4 0 0,1 12,16A4,4 0 0,1 8,12A4,4 0 0,1 12,8M3.05,13H1V11H3.05C3.5,6.83 6.83,3.5 11,3.05V1H13V3.05C17.17,3.5 20.5,6.83 20.95,11H23V13H20.95C20.5,17.17 17.17,20.5 13,20.95V23H11V20.95C6.83,20.5 3.5,17.17 3.05,13M12,5A7,7 0 0,0 5,12A7,7 0 0,0 12,19A7,7 0 0,0 19,12A7,7 0 0,0 12,5Z",
  "mdi:current-ac": "M12.43 11C12.28 10.84 10 7 7 7S2.32 10.18 2 11V13H11.57C11.72 13.16 14 17 17 17S21.68 13.82 22 13V11H12.43M7 9C8.17 9 9.18 9.85 10 11H4.31C4.78 10.17 5.54 9 7 9M17 15C15.83 15 14.82 14.15 14 13H19.69C19.22 13.83 18.46 15 17 15Z",
  "mdi:curtains": "M23 3H1V1H23V3M2 22H6C6 19 4 17 4 17C10 13 11 4 11 4H2V22M22 4H13C13 4 14 13 20 17C20 17 18 19 18 22H22V4Z",
  "mdi:desk": "M3 6H21C21.55 6 22 6.45 22 7C22 7.55 21.55 8 21 8V19H19V17H15V19H13V8H5V19H3V8C2.45 8 2 7.55 2 7C2 6.45 2.45 6 3 6M16 10.5V11H18V10.5C18 10.22 17.78 10 17.5 10H16.5C16.22 10 16 10.22 16 10.5M16 14.5V15H18V14.5C18 14.22 17.78 14 17.5 14H16.5C16.22 14 16 14.22 16 14.5Z",
  "mdi:door": "M8,3C6.89,3 6,3.89 6,5V21H18V5C18,3.89 17.11,3 16,3H8M8,5H16V19H8V5M13,11V13H15V11H13Z",
  "mdi:dots-horizontal": "M16,12A2,2 0 0,1 18,10A2,2 0 0,1 20,12A2,2 0 0,1 18,14A2,2 0 0,1 16,12M10,12A2,2 0 0,1 12,10A2,2 0 0,1 14,12A2,2 0 0,1 12,14A2,2 0 0,1 10,12M4,12A2,2 0 0,1 6,10A2,2 0 0,1 8,12A2,2 0 0,1 6,14A2,2 0 0,1 4,12Z",
  "mdi:dots-vertical": "M12,16A2,2 0 0,1 14,18A2,2 0 0,1 12,20A2,2 0 0,1 10,18A2,2 0 0,1 12,16M12,10A2,2 0 0,1 14,12A2,2 0 0,1 12,14A2,2 0 0,1 10,12A2,2 0 0,1 12,10M12,4A2,2 0 0,1 14,6A2,2 0 0,1 12,8A2,2 0 0,1 10,6A2,2 0 0,1 12,4Z",
  "mdi:ev-station": "M19.77,7.23L19.78,7.22L16.06,3.5L15,4.56L17.11,6.67C16.17,7.03 15.5,7.93 15.5,9A2.5,2.5 0 0,0 18,11.5C18.36,11.5 18.69,11.42 19,11.29V18.5A1,1 0 0,1 18,19.5A1,1 0 0,1 17,18.5V14A2,2 0 0,0 15,12H14V5A2,2 0 0,0 12,3H6A2,2 0 0,0 4,5V21H14V13.5H15.5V18.5A2.5,2.5 0 0,0 18,21A2.5,2.5 0 0,0 20.5,18.5V9C20.5,8.31 20.22,7.68 19.77,7.23M18,10A1,1 0 0,1 17,9A1,1 0 0,1 18,8A1,1 0 0,1 19,9A1,1 0 0,1 18,10M8,18V13.5H6L10,6V11H12L8,18Z",
  "mdi:eye": "M12,9A3,3 0 0,0 9,12A3,3 0 0,0 12,15A3,3 0 0,0 15,12A3,3 0 0,0 12,9M12,17A5,5 0 0,1 7,12A5,5 0 0,1 12,7A5,5 0 0,1 17,12A5,5 0 0,1 12,17M12,4.5C7,4.5 2.73,7.61 1,12C2.73,16.39 7,19.5 12,19.5C17,19.5 21.27,16.39 23,12C21.27,7.61 17,4.5 12,4.5Z",
  "mdi:fan": "M12,11A1,1 0 0,0 11,12A1,1 0 0,0 12,13A1,1 0 0,0 13,12A1,1 0 0,0 12,11M12.5,2C17,2 17.11,5.57 14.75,6.75C13.76,7.24 13.32,8.29 13.13,9.22C13.61,9.42 14.03,9.73 14.35,10.13C18.05,8.13 22.03,8.92 22.03,12.5C22.03,17 18.46,17.1 17.28,14.73C16.78,13.74 15.72,13.3 14.79,13.11C14.59,13.59 14.28,14 13.88,14.34C15.87,18.03 15.08,22 11.5,22C7,22 6.91,18.42 9.27,17.24C10.25,16.75 10.69,15.71 10.89,14.79C10.4,14.59 9.97,14.27 9.65,13.87C5.96,15.85 2,15.07 2,11.5C2,7 5.56,6.89 6.74,9.26C7.24,10.25 8.29,10.68 9.22,10.87C9.41,10.39 9.73,9.97 10.14,9.65C8.15,5.96 8.94,2 12.5,2Z",
  "mdi:fire": "M17.66 11.2C17.43 10.9 17.15 10.64 16.89 10.38C16.22 9.78 15.46 9.35 14.82 8.72C13.33 7.26 13 4.85 13.95 3C13 3.23 12.17 3.75 11.46 4.32C8.87 6.4 7.85 10.07 9.07 13.22C9.11 13.32 9.15 13.42 9.15 13.55C9.15 13.77 9 13.97 8.8 14.05C8.57 14.15 8.33 14.09 8.14 13.93C8.08 13.88 8.04 13.83 8 13.76C6.87 12.33 6.69 10.28 7.45 8.64C5.78 10 4.87 12.3 5 14.47C5.06 14.97 5.12 15.47 5.29 15.97C5.43 16.57 5.7 17.17 6 17.7C7.08 19.43 8.95 20.67 10.96 20.92C13.1 21.19 15.39 20.8 17.03 19.32C18.86 17.66 19.5 15 18.56 12.72L18.43 12.46C18.22 12 17.66 11.2 17.66 11.2M14.5 17.5C14.22 17.74 13.76 18 13.4 18.1C12.28 18.5 11.16 17.94 10.5 17.28C11.69 17 12.4 16.12 12.61 15.23C12.78 14.43 12.46 13.77 12.33 13C12.21 12.26 12.23 11.63 12.5 10.94C12.69 11.32 12.89 11.7 13.13 12C13.9 13 15.11 13.44 15.37 14.8C15.41 14.94 15.43 15.08 15.43 15.23C15.46 16.05 15.1 16.95 14.5 17.5H14.5Z",
  "mdi:flash": "M7,2V13H10V22L17,10H13L17,2H7Z",
  "mdi:fridge-outline": "M9,21V22H7V21A2,2 0 0,1 5,19V4A2,2 0 0,1 7,2H17A2,2 0 0,1 19,4V19A2,2 0 0,1 17,21V22H15V21H9M7,4V9H17V4H7M7,19H17V11H7V19M8,12H10V15H8V12M8,6H10V8H8V6Z",
  "mdi:gamepad-variant-outline": "M6,9H8V11H10V13H8V15H6V13H4V11H6V9M18.5,9A1.5,1.5 0 0,1 20,10.5A1.5,1.5 0 0,1 18.5,12A1.5,1.5 0 0,1 17,10.5A1.5,1.5 0 0,1 18.5,9M15.5,12A1.5,1.5 0 0,1 17,13.5A1.5,1.5 0 0,1 15.5,15A1.5,1.5 0 0,1 14,13.5A1.5,1.5 0 0,1 15.5,12M17,5A7,7 0 0,1 24,12A7,7 0 0,1 17,19C15.04,19 13.27,18.2 12,16.9C10.73,18.2 8.96,19 7,19A7,7 0 0,1 0,12A7,7 0 0,1 7,5H17M7,7A5,5 0 0,0 2,12A5,5 0 0,0 7,17C8.64,17 10.09,16.21 11,15H13C13.91,16.21 15.36,17 17,17A5,5 0 0,0 22,12A5,5 0 0,0 17,7H7Z",
  "mdi:garage": "M19,20H17V11H7V20H5V9L12,5L19,9V20M8,12H16V14H8V12M8,15H16V17H8V15M16,18V20H8V18H16Z",
  "mdi:gas-cylinder": "M16,9V14L16,20A2,2 0 0,1 14,22H10A2,2 0 0,1 8,20V14L8,9C8,7.14 9.27,5.57 11,5.13V4H9V2H15V4H13V5.13C14.73,5.57 16,7.14 16,9Z",
  "mdi:gate": "M9 6V11H7V7H5V11H3V9H1V21H3V19H5V21H7V19H9V21H11V19H13V21H15V19H17V21H19V19H21V21H23V9H21V11H19V7H17V11H15V6H13V11H11V6H9M3 13H5V17H3V13M7 13H9V17H7V13M11 13H13V17H11V13M15 13H17V17H15V13M19 13H21V17H19V13Z",
  "mdi:gauge": "M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M12,4A8,8 0 0,1 20,12C20,14.4 19,16.5 17.3,18C15.9,16.7 14,16 12,16C10,16 8.2,16.7 6.7,18C5,16.5 4,14.4 4,12A8,8 0 0,1 12,4M14,5.89C13.62,5.9 13.26,6.15 13.1,6.54L11.81,9.77L11.71,10C11,10.13 10.41,10.6 10.14,11.26C9.73,12.29 10.23,13.45 11.26,13.86C12.29,14.27 13.45,13.77 13.86,12.74C14.12,12.08 14,11.32 13.57,10.76L13.67,10.5L14.96,7.29L14.97,7.26C15.17,6.75 14.92,6.17 14.41,5.96C14.28,5.91 14.15,5.89 14,5.89M10,6A1,1 0 0,0 9,7A1,1 0 0,0 10,8A1,1 0 0,0 11,7A1,1 0 0,0 10,6M7,9A1,1 0 0,0 6,10A1,1 0 0,0 7,11A1,1 0 0,0 8,10A1,1 0 0,0 7,9M17,9A1,1 0 0,0 16,10A1,1 0 0,0 17,11A1,1 0 0,0 18,10A1,1 0 0,0 17,9Z",
  "mdi:gesture-tap-button": "M13 5C15.21 5 17 6.79 17 9C17 10.5 16.2 11.77 15 12.46V11.24C15.61 10.69 16 9.89 16 9C16 7.34 14.66 6 13 6S10 7.34 10 9C10 9.89 10.39 10.69 11 11.24V12.46C9.8 11.77 9 10.5 9 9C9 6.79 10.79 5 13 5M20 20.5C19.97 21.32 19.32 21.97 18.5 22H13C12.62 22 12.26 21.85 12 21.57L8 17.37L8.74 16.6C8.93 16.39 9.2 16.28 9.5 16.28H9.7L12 18V9C12 8.45 12.45 8 13 8S14 8.45 14 9V13.47L15.21 13.6L19.15 15.79C19.68 16.03 20 16.56 20 17.14V20.5M20 2H4C2.9 2 2 2.9 2 4V12C2 13.11 2.9 14 4 14H8V12L4 12L4 4H20L20 12H18V14H20V13.96L20.04 14C21.13 14 22 13.09 22 12V4C22 2.9 21.11 2 20 2Z",
  "mdi:help-circle-outline": "M11,18H13V16H11V18M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M12,20C7.59,20 4,16.41 4,12C4,7.59 7.59,4 12,4C16.41,4 20,7.59 20,12C20,16.41 16.41,20 12,20M12,6A4,4 0 0,0 8,10H10A2,2 0 0,1 12,8A2,2 0 0,1 14,10C14,12 11,11.75 11,15H13C13,12.75 16,12.5 16,10A4,4 0 0,0 12,6Z",
  "mdi:home": "M10,20V14H14V20H19V12H22L12,3L2,12H5V20H10Z",
  "mdi:home-account": "M12,3L2,12H5V20H19V12H22L12,3M12,8.75A2.25,2.25 0 0,1 14.25,11A2.25,2.25 0 0,1 12,13.25A2.25,2.25 0 0,1 9.75,11A2.25,2.25 0 0,1 12,8.75M12,15C13.5,15 16.5,15.75 16.5,17.25V18H7.5V17.25C7.5,15.75 10.5,15 12,15Z",
  "mdi:home-assistant": "M21.8,13H20V21H13V17.67L15.79,14.88L16.5,15C17.66,15 18.6,14.06 18.6,12.9C18.6,11.74 17.66,10.8 16.5,10.8A2.1,2.1 0 0,0 14.4,12.9L14.5,13.61L13,15.13V9.65C13.66,9.29 14.1,8.6 14.1,7.8A2.1,2.1 0 0,0 12,5.7A2.1,2.1 0 0,0 9.9,7.8C9.9,8.6 10.34,9.29 11,9.65V15.13L9.5,13.61L9.6,12.9A2.1,2.1 0 0,0 7.5,10.8A2.1,2.1 0 0,0 5.4,12.9A2.1,2.1 0 0,0 7.5,15L8.21,14.88L11,17.67V21H4V13H2.25C1.83,13 1.42,13 1.42,12.79C1.43,12.57 1.85,12.15 2.28,11.72L11,3C11.33,2.67 11.67,2.33 12,2.33C12.33,2.33 12.67,2.67 13,3L17,7V6H19V9L21.78,11.78C22.18,12.18 22.59,12.59 22.6,12.8C22.6,13 22.2,13 21.8,13M7.5,12A0.9,0.9 0 0,1 8.4,12.9A0.9,0.9 0 0,1 7.5,13.8A0.9,0.9 0 0,1 6.6,12.9A0.9,0.9 0 0,1 7.5,12M16.5,12C17,12 17.4,12.4 17.4,12.9C17.4,13.4 17,13.8 16.5,13.8A0.9,0.9 0 0,1 15.6,12.9A0.9,0.9 0 0,1 16.5,12M12,6.9C12.5,6.9 12.9,7.3 12.9,7.8C12.9,8.3 12.5,8.7 12,8.7C11.5,8.7 11.1,8.3 11.1,7.8C11.1,7.3 11.5,6.9 12,6.9Z",
  "mdi:home-export-outline": "M24 13L20 17V14H11V12H20V9L24 13M4 20V12H1L11 3L18 9.3V10H15.79L11 5.69L6 10.19V18H16V16H18V20H4Z",
  "mdi:home-import-outline": "M15 13L11 17V14H2V12H11V9L15 13M5 20V16H7V18H17V10.19L12 5.69L7.21 10H4.22L12 3L22 12H19V20H5Z",
  "mdi:home-variant": "M12,3L20,9V21H15V14H9V21H4V9L12,3Z",
  "mdi:information-outline": "M11,9H13V7H11M12,20C7.59,20 4,16.41 4,12C4,7.59 7.59,4 12,4C16.41,4 20,7.59 20,12C20,16.41 16.41,20 12,20M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M11,17H13V11H11V17Z",
  "mdi:lan-connect": "M4,1C2.89,1 2,1.89 2,3V7C2,8.11 2.89,9 4,9H1V11H13V9H10C11.11,9 12,8.11 12,7V3C12,1.89 11.11,1 10,1H4M4,3H10V7H4V3M3,13V18L3,20H10V18H5V13H3M14,13C12.89,13 12,13.89 12,15V19C12,20.11 12.89,21 14,21H11V23H23V21H20C21.11,21 22,20.11 22,19V15C22,13.89 21.11,13 20,13H14M14,15H20V19H14V15Z",
  "mdi:lightbulb": "M12,2A7,7 0 0,0 5,9C5,11.38 6.19,13.47 8,14.74V17A1,1 0 0,0 9,18H15A1,1 0 0,0 16,17V14.74C17.81,13.47 19,11.38 19,9A7,7 0 0,0 12,2M9,21A1,1 0 0,0 10,22H14A1,1 0 0,0 15,21V20H9V21Z",
  "mdi:lightbulb-group": "M15 14V16A1 1 0 0 1 14 17H10A1 1 0 0 1 9 16V14A5 5 0 1 1 15 14M14 18H10V19A1 1 0 0 0 11 20H13A1 1 0 0 0 14 19M7 19V18H5V19A1 1 0 0 0 6 20H7.17A2.93 2.93 0 0 1 7 19M5 10A6.79 6.79 0 0 1 5.68 7A4 4 0 0 0 4 14.45V16A1 1 0 0 0 5 17H7V14.88A6.92 6.92 0 0 1 5 10M17 18V19A2.93 2.93 0 0 1 16.83 20H18A1 1 0 0 0 19 19V18M18.32 7A6.79 6.79 0 0 1 19 10A6.92 6.92 0 0 1 17 14.88V17H19A1 1 0 0 0 20 16V14.45A4 4 0 0 0 18.32 7Z",
  "mdi:lightbulb-group-off": "M20.84 22.73L18.09 20C18.06 20 18.03 20 18 20H16.83C16.94 19.68 17 19.34 17 19V18.89L14.75 16.64C14.57 16.86 14.31 17 14 17H10C9.45 17 9 16.55 9 16V14C7.4 12.8 6.74 10.84 7.12 9L5.5 7.4C5.18 8.23 5 9.11 5 10C5 11.83 5.72 13.58 7 14.88V17H5C4.45 17 4 16.55 4 16V14.45C2.86 13.79 2.12 12.62 2 11.31C1.85 9.27 3.25 7.5 5.2 7.09L1.11 3L2.39 1.73L22.11 21.46L20.84 22.73M15 6C13.22 4.67 10.86 4.72 9.13 5.93L16.08 12.88C17.63 10.67 17.17 7.63 15 6M19.79 16.59C19.91 16.42 20 16.22 20 16V14.45C21.91 13.34 22.57 10.9 21.46 9C20.8 7.85 19.63 7.11 18.32 7C18.77 7.94 19 8.96 19 10C19 11.57 18.47 13.09 17.5 14.31L19.79 16.59M10 19C10 19.55 10.45 20 11 20H13C13.55 20 14 19.55 14 19V18H10V19M7 18H5V19C5 19.55 5.45 20 6 20H7.17C7.06 19.68 7 19.34 7 19V18Z",
  "mdi:lightbulb-off": "M12,2C9.76,2 7.78,3.05 6.5,4.68L16.31,14.5C17.94,13.21 19,11.24 19,9A7,7 0 0,0 12,2M3.28,4L2,5.27L5.04,8.3C5,8.53 5,8.76 5,9C5,11.38 6.19,13.47 8,14.74V17A1,1 0 0,0 9,18H14.73L18.73,22L20,20.72L3.28,4M9,20V21A1,1 0 0,0 10,22H14A1,1 0 0,0 15,21V20H9Z",
  "mdi:lightbulb-outline": "M12,2A7,7 0 0,1 19,9C19,11.38 17.81,13.47 16,14.74V17A1,1 0 0,1 15,18H9A1,1 0 0,1 8,17V14.74C6.19,13.47 5,11.38 5,9A7,7 0 0,1 12,2M9,21V20H15V21A1,1 0 0,1 14,22H10A1,1 0 0,1 9,21M12,4A5,5 0 0,0 7,9C7,11.05 8.23,12.81 10,13.58V16H14V13.58C15.77,12.81 17,11.05 17,9A5,5 0 0,0 12,4Z",
  "mdi:lightning-bolt": "M11 15H6L13 1V9H18L11 23V15Z",
  "mdi:lightning-bolt-outline": "M11 9.47V11H14.76L13 14.53V13H9.24L11 9.47M13 1L6 15H11V23L18 9H13V1Z",
  "mdi:lock": "M12,17A2,2 0 0,0 14,15C14,13.89 13.1,13 12,13A2,2 0 0,0 10,15A2,2 0 0,0 12,17M18,8A2,2 0 0,1 20,10V20A2,2 0 0,1 18,22H6A2,2 0 0,1 4,20V10C4,8.89 4.9,8 6,8H7V6A5,5 0 0,1 12,1A5,5 0 0,1 17,6V8H18M12,3A3,3 0 0,0 9,6V8H15V6A3,3 0 0,0 12,3Z",
  "mdi:lock-open-variant": "M18 1C15.24 1 13 3.24 13 6V8H4C2.9 8 2 8.89 2 10V20C2 21.11 2.9 22 4 22H16C17.11 22 18 21.11 18 20V10C18 8.9 17.11 8 16 8H15V6C15 4.34 16.34 3 18 3C19.66 3 21 4.34 21 6V8H23V6C23 3.24 20.76 1 18 1M10 13C11.1 13 12 13.89 12 15C12 16.11 11.11 17 10 17C8.9 17 8 16.11 8 15C8 13.9 8.9 13 10 13Z",
  "mdi:magnify": "M9.5,3A6.5,6.5 0 0,1 16,9.5C16,11.11 15.41,12.59 14.44,13.73L14.71,14H15.5L20.5,19L19,20.5L14,15.5V14.71L13.73,14.44C12.59,15.41 11.11,16 9.5,16A6.5,6.5 0 0,1 3,9.5A6.5,6.5 0 0,1 9.5,3M9.5,5C7,5 5,7 5,9.5C5,12 7,14 9.5,14C12,14 14,12 14,9.5C14,7 12,5 9.5,5Z",
  "mdi:map-marker": "M12,11.5A2.5,2.5 0 0,1 9.5,9A2.5,2.5 0 0,1 12,6.5A2.5,2.5 0 0,1 14.5,9A2.5,2.5 0 0,1 12,11.5M12,2A7,7 0 0,0 5,9C5,14.25 12,22 12,22C12,22 19,14.25 19,9A7,7 0 0,0 12,2Z",
  "mdi:menu": "M3,6H21V8H3V6M3,11H21V13H3V11M3,16H21V18H3V16Z",
  "mdi:meter-gas": "M16 4H15V2H13V4H11V2H9V4H8C5.79 4 4 5.79 4 8V18C4 20.21 5.79 22 8 22H16C18.21 22 20 20.21 20 18V8C20 5.79 18.21 4 16 4M12 18C10.62 18 9.5 16.9 9.5 15.54C9.5 14.45 9.93 14.15 12 11.75C14.05 14.13 14.5 14.45 14.5 15.54C14.5 16.9 13.38 18 12 18M16 10H8V8H16V10Z",
  "mdi:minus": "M19,13H5V11H19V13Z",
  "mdi:molecule-co2": "M5,7A2,2 0 0,0 3,9V15A2,2 0 0,0 5,17H8V15H5V9H8V7H5M11,7A2,2 0 0,0 9,9V15A2,2 0 0,0 11,17H13A2,2 0 0,0 15,15V9A2,2 0 0,0 13,7H11M11,9H13V15H11V9M16,10.5V12H19V13.5H17.5A1.5,1.5 0 0,0 16,15V18H20.5V16.5H17.5V15H19A1.5,1.5 0 0,0 20.5,13.5V12A1.5,1.5 0 0,0 19,10.5H16Z",
  "mdi:motion-sensor": "M10,0.2C9,0.2 8.2,1 8.2,2C8.2,3 9,3.8 10,3.8C11,3.8 11.8,3 11.8,2C11.8,1 11,0.2 10,0.2M15.67,1A7.33,7.33 0 0,0 23,8.33V7A6,6 0 0,1 17,1H15.67M18.33,1C18.33,3.58 20.42,5.67 23,5.67V4.33C21.16,4.33 19.67,2.84 19.67,1H18.33M21,1A2,2 0 0,0 23,3V1H21M7.92,4.03C7.75,4.03 7.58,4.06 7.42,4.11L2,5.8V11H3.8V7.33L5.91,6.67L2,22H3.8L6.67,13.89L9,17V22H10.8V15.59L8.31,11.05L9.04,8.18L10.12,10H15V8.2H11.38L9.38,4.87C9.08,4.37 8.54,4.03 7.92,4.03Z",
  "mdi:movie-open": "M20.84 2.18L16.91 2.96L19.65 6.5L21.62 6.1L20.84 2.18M13.97 3.54L12 3.93L14.75 7.46L16.71 7.07L13.97 3.54M9.07 4.5L7.1 4.91L9.85 8.44L11.81 8.05L9.07 4.5M4.16 5.5L3.18 5.69A2 2 0 0 0 1.61 8.04L2 10L6.9 9.03L4.16 5.5M2 10V20C2 21.11 2.9 22 4 22H20C21.11 22 22 21.11 22 20V10H2Z",
  "mdi:music-note": "M12 3V13.55C11.41 13.21 10.73 13 10 13C7.79 13 6 14.79 6 17S7.79 21 10 21 14 19.21 14 17V7H18V3H12Z",
  "mdi:palette": "M17.5,12A1.5,1.5 0 0,1 16,10.5A1.5,1.5 0 0,1 17.5,9A1.5,1.5 0 0,1 19,10.5A1.5,1.5 0 0,1 17.5,12M14.5,8A1.5,1.5 0 0,1 13,6.5A1.5,1.5 0 0,1 14.5,5A1.5,1.5 0 0,1 16,6.5A1.5,1.5 0 0,1 14.5,8M9.5,8A1.5,1.5 0 0,1 8,6.5A1.5,1.5 0 0,1 9.5,5A1.5,1.5 0 0,1 11,6.5A1.5,1.5 0 0,1 9.5,8M6.5,12A1.5,1.5 0 0,1 5,10.5A1.5,1.5 0 0,1 6.5,9A1.5,1.5 0 0,1 8,10.5A1.5,1.5 0 0,1 6.5,12M12,3A9,9 0 0,0 3,12A9,9 0 0,0 12,21A1.5,1.5 0 0,0 13.5,19.5C13.5,19.11 13.35,18.76 13.11,18.5C12.88,18.23 12.73,17.88 12.73,17.5A1.5,1.5 0 0,1 14.23,16H16A5,5 0 0,0 21,11C21,6.58 16.97,3 12,3Z",
  "mdi:palette-outline": "M12,22A10,10 0 0,1 2,12A10,10 0 0,1 12,2C17.5,2 22,6 22,11A6,6 0 0,1 16,17H14.2C13.9,17 13.7,17.2 13.7,17.5C13.7,17.6 13.8,17.7 13.8,17.8C14.2,18.3 14.4,18.9 14.4,19.5C14.5,20.9 13.4,22 12,22M12,4A8,8 0 0,0 4,12A8,8 0 0,0 12,20C12.3,20 12.5,19.8 12.5,19.5C12.5,19.3 12.4,19.2 12.4,19.1C12,18.6 11.8,18.1 11.8,17.5C11.8,16.1 12.9,15 14.3,15H16A4,4 0 0,0 20,11C20,7.1 16.4,4 12,4M6.5,10C7.3,10 8,10.7 8,11.5C8,12.3 7.3,13 6.5,13C5.7,13 5,12.3 5,11.5C5,10.7 5.7,10 6.5,10M9.5,6C10.3,6 11,6.7 11,7.5C11,8.3 10.3,9 9.5,9C8.7,9 8,8.3 8,7.5C8,6.7 8.7,6 9.5,6M14.5,6C15.3,6 16,6.7 16,7.5C16,8.3 15.3,9 14.5,9C13.7,9 13,8.3 13,7.5C13,6.7 13.7,6 14.5,6M17.5,10C18.3,10 19,10.7 19,11.5C19,12.3 18.3,13 17.5,13C16.7,13 16,12.3 16,11.5C16,10.7 16.7,10 17.5,10Z",
  "mdi:pause": "M14,19H18V5H14M6,19H10V5H6V19Z",
  "mdi:play": "M8,5.14V19.14L19,12.14L8,5.14Z",
  "mdi:play-pause": "M3,5V19L11,12M13,19H16V5H13M18,5V19H21V5",
  "mdi:plus": "M19,13H13V19H11V13H5V11H11V5H13V11H19V13Z",
  "mdi:power": "M16.56,5.44L15.11,6.89C16.84,7.94 18,9.83 18,12A6,6 0 0,1 12,18A6,6 0 0,1 6,12C6,9.83 7.16,7.94 8.88,6.88L7.44,5.44C5.36,6.88 4,9.28 4,12A8,8 0 0,0 12,20A8,8 0 0,0 20,12C20,9.28 18.64,6.88 16.56,5.44M13,3H11V13H13",
  "mdi:power-plug": "M16,7V3H14V7H10V3H8V7H8C7,7 6,8 6,9V14.5L9.5,18V21H14.5V18L18,14.5V9C18,8 17,7 16,7Z",
  "mdi:printer": "M18,3H6V7H18M19,12A1,1 0 0,1 18,11A1,1 0 0,1 19,10A1,1 0 0,1 20,11A1,1 0 0,1 19,12M16,19H8V14H16M19,8H5A3,3 0 0,0 2,11V17H6V21H18V17H22V11A3,3 0 0,0 19,8Z",
  "mdi:recycle": "M21.82,15.42L19.32,19.75C18.83,20.61 17.92,21.06 17,21H15V23L12.5,18.5L15,14V16H17.82L15.6,12.15L19.93,9.65L21.73,12.77C22.25,13.54 22.32,14.57 21.82,15.42M9.21,3.06H14.21C15.19,3.06 16.04,3.63 16.45,4.45L17.45,6.19L19.18,5.19L16.54,9.6L11.39,9.69L13.12,8.69L11.71,6.24L9.5,10.09L5.16,7.59L6.96,4.47C7.37,3.64 8.22,3.06 9.21,3.06M5.05,19.76L2.55,15.43C2.06,14.58 2.13,13.56 2.64,12.79L3.64,11.06L1.91,10.06L7.05,10.14L9.7,14.56L7.97,13.56L6.56,16H11V21H7.4C6.47,21.07 5.55,20.61 5.05,19.76Z",
  "mdi:refresh": "M17.65,6.35C16.2,4.9 14.21,4 12,4A8,8 0 0,0 4,12A8,8 0 0,0 12,20C15.73,20 18.84,17.45 19.73,14H17.65C16.83,16.33 14.61,18 12,18A6,6 0 0,1 6,12A6,6 0 0,1 12,6C13.66,6 15.14,6.69 16.22,7.78L13,11H20V4L17.65,6.35Z",
  "mdi:restart": "M12,4C14.1,4 16.1,4.8 17.6,6.3C20.7,9.4 20.7,14.5 17.6,17.6C15.8,19.5 13.3,20.2 10.9,19.9L11.4,17.9C13.1,18.1 14.9,17.5 16.2,16.2C18.5,13.9 18.5,10.1 16.2,7.7C15.1,6.6 13.5,6 12,6V10.6L7,5.6L12,0.6V4M6.3,17.6C3.7,15 3.3,11 5.1,7.9L6.6,9.4C5.5,11.6 5.9,14.4 7.8,16.2C8.3,16.7 8.9,17.1 9.6,17.4L9,19.4C8,19 7.1,18.4 6.3,17.6Z",
  "mdi:robot": "M12,2A2,2 0 0,1 14,4C14,4.74 13.6,5.39 13,5.73V7H14A7,7 0 0,1 21,14H22A1,1 0 0,1 23,15V18A1,1 0 0,1 22,19H21V20A2,2 0 0,1 19,22H5A2,2 0 0,1 3,20V19H2A1,1 0 0,1 1,18V15A1,1 0 0,1 2,14H3A7,7 0 0,1 10,7H11V5.73C10.4,5.39 10,4.74 10,4A2,2 0 0,1 12,2M7.5,13A2.5,2.5 0 0,0 5,15.5A2.5,2.5 0 0,0 7.5,18A2.5,2.5 0 0,0 10,15.5A2.5,2.5 0 0,0 7.5,13M16.5,13A2.5,2.5 0 0,0 14,15.5A2.5,2.5 0 0,0 16.5,18A2.5,2.5 0 0,0 19,15.5A2.5,2.5 0 0,0 16.5,13Z",
  "mdi:robot-vacuum": "M12,2C14.65,2 17.19,3.06 19.07,4.93L17.65,6.35C16.15,4.85 14.12,4 12,4C9.88,4 7.84,4.84 6.35,6.35L4.93,4.93C6.81,3.06 9.35,2 12,2M3.66,6.5L5.11,7.94C4.39,9.17 4,10.57 4,12A8,8 0 0,0 12,20A8,8 0 0,0 20,12C20,10.57 19.61,9.17 18.88,7.94L20.34,6.5C21.42,8.12 22,10.04 22,12A10,10 0 0,1 12,22A10,10 0 0,1 2,12C2,10.04 2.58,8.12 3.66,6.5M12,6A6,6 0 0,1 18,12C18,13.59 17.37,15.12 16.24,16.24L14.83,14.83C14.08,15.58 13.06,16 12,16C10.94,16 9.92,15.58 9.17,14.83L7.76,16.24C6.63,15.12 6,13.59 6,12A6,6 0 0,1 12,6M12,8A1,1 0 0,0 11,9A1,1 0 0,0 12,10A1,1 0 0,0 13,9A1,1 0 0,0 12,8Z",
  "mdi:roller-shade": "M20 19V3H4V19H2V21H22V19H20M6 19V13H11V14.8C10.6 15.1 10.2 15.6 10.2 16.2C10.2 17.2 11 18 12 18S13.8 17.2 13.8 16.2C13.8 15.6 13.5 15.1 13 14.8V13H18V19H6Z",
  "mdi:script-text": "M17.8,20C17.4,21.2 16.3,22 15,22H5C3.3,22 2,20.7 2,19V18H5L14.2,18C14.6,19.2 15.7,20 17,20H17.8M19,2C20.7,2 22,3.3 22,5V6H20V5C20,4.4 19.6,4 19,4C18.4,4 18,4.4 18,5V18H17C16.4,18 16,17.6 16,17V16H5V5C5,3.3 6.3,2 8,2H19M8,6V8H15V6H8M8,10V12H14V10H8Z",
  "mdi:shield-home": "M11,13H13V16H16V11H18L12,6L6,11H8V16H11V13M12,1L21,5V11C21,16.55 17.16,21.74 12,23C6.84,21.74 3,16.55 3,11V5L12,1Z",
  "mdi:silverware-fork-knife": "M11,9H9V2H7V9H5V2H3V9C3,11.12 4.66,12.84 6.75,12.97V22H9.25V12.97C11.34,12.84 13,11.12 13,9V2H11V9M16,6V14H18.5V22H21V2C18.24,2 16,4.24 16,6Z",
  "mdi:sine-wave": "M16.5,21C13.5,21 12.31,16.76 11.05,12.28C10.14,9.04 9,5 7.5,5C4.11,5 4,11.93 4,12H2C2,11.63 2.06,3 7.5,3C10.5,3 11.71,7.25 12.97,11.74C13.83,14.8 15,19 16.5,19C19.94,19 20.03,12.07 20.03,12H22.03C22.03,12.37 21.97,21 16.5,21Z",
  "mdi:skip-next": "M16,18H18V6H16M6,18L14.5,12L6,6V18Z",
  "mdi:skip-previous": "M6,18V6H8V18H6M9.5,12L18,6V18L9.5,12Z",
  "mdi:smoke-detector": "M12,18A6,6 0 0,0 18,12C18,8.68 15.31,6 12,6C8.68,6 6,8.68 6,12A6,6 0 0,0 12,18M19,3A2,2 0 0,1 21,5V19A2,2 0 0,1 19,21H5C3.89,21 3,20.1 3,19V5C3,3.89 3.89,3 5,3H19M8,12A4,4 0 0,1 12,8A4,4 0 0,1 16,12A4,4 0 0,1 12,16A4,4 0 0,1 8,12Z",
  "mdi:snowflake": "M20.79,13.95L18.46,14.57L16.46,13.44V10.56L18.46,9.43L20.79,10.05L21.31,8.12L19.54,7.65L20,5.88L18.07,5.36L17.45,7.69L15.45,8.82L13,7.38V5.12L14.71,3.41L13.29,2L12,3.29L10.71,2L9.29,3.41L11,5.12V7.38L8.5,8.82L6.5,7.69L5.92,5.36L4,5.88L4.47,7.65L2.7,8.12L3.22,10.05L5.55,9.43L7.55,10.56V13.45L5.55,14.58L3.22,13.96L2.7,15.89L4.47,16.36L4,18.12L5.93,18.64L6.55,16.31L8.55,15.18L11,16.62V18.88L9.29,20.59L10.71,22L12,20.71L13.29,22L14.7,20.59L13,18.88V16.62L15.5,15.17L17.5,16.3L18.12,18.63L20,18.12L19.53,16.35L21.3,15.88L20.79,13.95M9.5,10.56L12,9.11L14.5,10.56V13.44L12,14.89L9.5,13.44V10.56Z",
  "mdi:sofa-outline": "M21 9V7C21 5.35 19.65 4 18 4H14C13.23 4 12.53 4.3 12 4.78C11.47 4.3 10.77 4 10 4H6C4.35 4 3 5.35 3 7V9C1.35 9 0 10.35 0 12V17C0 18.65 1.35 20 3 20V22H5V20H19V22H21V20C22.65 20 24 18.65 24 17V12C24 10.35 22.65 9 21 9M14 6H18C18.55 6 19 6.45 19 7V9.78C18.39 10.33 18 11.12 18 12V14H13V7C13 6.45 13.45 6 14 6M5 7C5 6.45 5.45 6 6 6H10C10.55 6 11 6.45 11 7V14H6V12C6 11.12 5.61 10.33 5 9.78V7M22 17C22 17.55 21.55 18 21 18H3C2.45 18 2 17.55 2 17V12C2 11.45 2.45 11 3 11S4 11.45 4 12V16H20V12C20 11.45 20.45 11 21 11S22 11.45 22 12V17Z",
  "mdi:solar-power": "M11.45,2V5.55L15,3.77L11.45,2M10.45,8L8,10.46L11.75,11.71L10.45,8M2,11.45L3.77,15L5.55,11.45H2M10,2H2V10C2.57,10.17 3.17,10.25 3.77,10.25C7.35,10.26 10.26,7.35 10.27,3.75C10.26,3.16 10.17,2.57 10,2M17,22V16H14L19,7V13H22L17,22Z",
  "mdi:solar-power-variant": "M3.33 16H11V13H4L3.33 16M13 16H20.67L20 13H13V16M21.11 18H13V22H22L21.11 18M2 22H11V18H2.89L2 22M11 8H13V11H11V8M15.76 7.21L17.18 5.79L19.3 7.91L17.89 9.33L15.76 7.21M4.71 7.91L6.83 5.79L8.24 7.21L6.12 9.33L4.71 7.91M3 2H6V4H3V2M18 2H21V4H18V2M12 7C14.76 7 17 4.76 17 2H7C7 4.76 9.24 7 12 7Z",
  "mdi:speaker": "M12,12A3,3 0 0,0 9,15A3,3 0 0,0 12,18A3,3 0 0,0 15,15A3,3 0 0,0 12,12M12,20A5,5 0 0,1 7,15A5,5 0 0,1 12,10A5,5 0 0,1 17,15A5,5 0 0,1 12,20M12,4A2,2 0 0,1 14,6A2,2 0 0,1 12,8C10.89,8 10,7.1 10,6C10,4.89 10.89,4 12,4M17,2H7C5.89,2 5,2.89 5,4V20A2,2 0 0,0 7,22H17A2,2 0 0,0 19,20V4C19,2.89 18.1,2 17,2Z",
  "mdi:square-outline": "M3,3H21V21H3V3M5,5V19H19V5H5Z",
  "mdi:stairs": "M15,5V9H11V13H7V17H3V20H10V16H14V12H18V8H22V5H15Z",
  "mdi:stop": "M18,18H6V6H18V18Z",
  "mdi:teddy-bear": "M15.75 19.13C14.92 19.13 14.25 18.29 14.25 17.25C14.25 16.22 14.92 15.38 15.75 15.38C16.58 15.38 17.25 16.22 17.25 17.25C17.25 18.29 16.58 19.13 15.75 19.13M12 11.25C10.76 11.25 9.75 10.41 9.75 9.38C9.75 8.34 10.76 7.5 12 7.5C13.24 7.5 14.25 8.34 14.25 9.38C14.25 10.41 13.24 11.25 12 11.25M8.25 19.13C7.42 19.13 6.75 18.29 6.75 17.25C6.75 16.22 7.42 15.38 8.25 15.38C9.08 15.38 9.75 16.22 9.75 17.25C9.75 18.29 9.08 19.13 8.25 19.13M12 8.25C12.41 8.25 12.75 8.59 12.75 9C12.75 9.41 12.41 9.75 12 9.75C11.59 9.75 11.25 9.41 11.25 9C11.25 8.59 11.59 8.25 12 8.25M18.75 12C18.43 12 18.12 12.07 17.84 12.2C17.36 11.59 16.71 11.07 15.93 10.67C16.5 9.87 16.84 8.9 16.84 7.85C16.84 7.83 16.84 7.81 16.84 7.79C17.93 7.56 18.75 6.59 18.75 5.42C18.75 4.09 17.66 3 16.33 3C15.64 3 15 3.29 14.58 3.75C13.83 3.28 12.95 3 12 3C11.05 3 10.16 3.28 9.42 3.75C9 3.29 8.36 3 7.67 3C6.34 3 5.25 4.09 5.25 5.42C5.25 6.58 6.07 7.55 7.15 7.79C7.15 7.81 7.15 7.83 7.15 7.85C7.15 8.9 7.5 9.88 8.06 10.67C7.29 11.07 6.64 11.59 6.16 12.2C5.88 12.07 5.57 12 5.25 12C4 12 3 13 3 14.25C3 15.5 4 16.5 5.25 16.5C5.27 16.5 5.29 16.5 5.31 16.5C5.27 16.74 5.25 17 5.25 17.25C5.25 19.32 6.59 21 8.25 21C9.26 21 10.15 20.37 10.7 19.41C11.12 19.47 11.55 19.5 12 19.5C12.45 19.5 12.88 19.47 13.3 19.41C13.85 20.37 14.74 21 15.75 21C17.41 21 18.75 19.32 18.75 17.25C18.75 17 18.73 16.74 18.69 16.5C18.71 16.5 18.73 16.5 18.75 16.5C20 16.5 21 15.5 21 14.25C21 13 20 12 18.75 12",
  "mdi:theme-light-dark": "M7.5,2C5.71,3.15 4.5,5.18 4.5,7.5C4.5,9.82 5.71,11.85 7.53,13C4.46,13 2,10.54 2,7.5A5.5,5.5 0 0,1 7.5,2M19.07,3.5L20.5,4.93L4.93,20.5L3.5,19.07L19.07,3.5M12.89,5.93L11.41,5L9.97,6L10.39,4.3L9,3.24L10.75,3.12L11.33,1.47L12,3.1L13.73,3.13L12.38,4.26L12.89,5.93M9.59,9.54L8.43,8.81L7.31,9.59L7.65,8.27L6.56,7.44L7.92,7.35L8.37,6.06L8.88,7.33L10.24,7.36L9.19,8.23L9.59,9.54M19,13.5A5.5,5.5 0 0,1 13.5,19C12.28,19 11.15,18.6 10.24,17.93L17.93,10.24C18.6,11.15 19,12.28 19,13.5M14.6,20.08L17.37,18.93L17.13,22.28L14.6,20.08M18.93,17.38L20.08,14.61L22.28,17.15L18.93,17.38M20.08,12.42L18.94,9.64L22.28,9.88L20.08,12.42M9.63,18.93L12.4,20.08L9.87,22.27L9.63,18.93Z",
  "mdi:thermometer": "M15 13V5A3 3 0 0 0 9 5V13A5 5 0 1 0 15 13M12 4A1 1 0 0 1 13 5V8H11V5A1 1 0 0 1 12 4Z",
  "mdi:thermometer-low": "M15 13V5A3 3 0 0 0 9 5V13A5 5 0 1 0 15 13M12 4A1 1 0 0 1 13 5V12H11V5A1 1 0 0 1 12 4Z",
  "mdi:thermostat": "M16.95,16.95L14.83,14.83C15.55,14.1 16,13.1 16,12C16,11.26 15.79,10.57 15.43,10L17.6,7.81C18.5,9 19,10.43 19,12C19,13.93 18.22,15.68 16.95,16.95M12,5C13.57,5 15,5.5 16.19,6.4L14,8.56C13.43,8.21 12.74,8 12,8A4,4 0 0,0 8,12C8,13.1 8.45,14.1 9.17,14.83L7.05,16.95C5.78,15.68 5,13.93 5,12A7,7 0 0,1 12,5M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12C22,6.47 17.5,2 12,2Z",
  "mdi:toggle-switch": "M17,7H7A5,5 0 0,0 2,12A5,5 0 0,0 7,17H17A5,5 0 0,0 22,12A5,5 0 0,0 17,7M17,15A3,3 0 0,1 14,12A3,3 0 0,1 17,9A3,3 0 0,1 20,12A3,3 0 0,1 17,15Z",
  "mdi:toggle-switch-off-outline": "M17 6H7c-3.31 0-6 2.69-6 6s2.69 6 6 6h10c3.31 0 6-2.69 6-6s-2.69-6-6-6zm0 10H7c-2.21 0-4-1.79-4-4s1.79-4 4-4h10c2.21 0 4 1.79 4 4s-1.79 4-4 4zM7 9c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z",
  "mdi:toggle-switch-variant": "M18.4 1.6C18 1.2 17.5 1 17 1H7C6.5 1 6 1.2 5.6 1.6C5.2 2 5 2.5 5 3V21C5 21.5 5.2 22 5.6 22.4C6 22.8 6.5 23 7 23H17C17.5 23 18 22.8 18.4 22.4C18.8 22 19 21.5 19 21V3C19 2.5 18.8 2 18.4 1.6M16 7C16 7.6 15.6 8 15 8H9C8.4 8 8 7.6 8 7V5C8 4.4 8.4 4 9 4H15C15.6 4 16 4.4 16 5V7Z",
  "mdi:transmission-tower": "M8.28,5.45L6.5,4.55L7.76,2H16.23L17.5,4.55L15.72,5.44L15,4H9L8.28,5.45M18.62,8H14.09L13.3,5H10.7L9.91,8H5.38L4.1,10.55L5.89,11.44L6.62,10H17.38L18.1,11.45L19.89,10.56L18.62,8M17.77,22H15.7L15.46,21.1L12,15.9L8.53,21.1L8.3,22H6.23L9.12,11H11.19L10.83,12.35L12,14.1L13.16,12.35L12.81,11H14.88L17.77,22M11.4,15L10.5,13.65L9.32,18.13L11.4,15M14.68,18.12L13.5,13.64L12.6,15L14.68,18.12Z",
  "mdi:transmission-tower-export": "M5.18 5.45L3.4 4.55L4.66 2H13.13L14.4 4.55L12.62 5.44L11.9 4H5.9L5.18 5.45M15.5 8H11L10.2 5H7.6L6.81 8H2.28L1 10.55L2.79 11.44L3.5 10H14.28L15 11.45L16.79 10.56L15.5 8M14.67 22H12.6L12.36 21.1L8.9 15.9L5.43 21.1L5.2 22H3.13L6 11H8.09L7.73 12.35L8.9 14.1L10.06 12.35L9.71 11H11.78L14.67 22M8.3 15L7.4 13.65L6.22 18.13L8.3 15M11.58 18.12L10.4 13.64L9.5 15L11.58 18.12M23 16L19 12V15H15V17H19V20L23 16Z",
  "mdi:transmission-tower-import": "M11.39 5.45L9.61 4.55L10.87 2H19.34L20.61 4.55L18.83 5.44L18.11 4H12.11L11.39 5.45M21.73 8H17.2L16.41 5H13.81L13 8H8.5L7.21 10.55L9 11.44L9.73 10H20.5L21.21 11.45L23 10.56L21.73 8M20.88 22H18.81L18.57 21.1L15.11 15.9L11.64 21.1L11.41 22H9.34L12.23 11H14.3L13.94 12.35L15.11 14.1L16.27 12.35L15.92 11H18L20.88 22M14.5 15L13.61 13.65L12.43 18.13L14.5 15M17.79 18.12L16.61 13.64L15.71 15L17.79 18.12M9 16L5 12V15H1V17H5V20L9 16Z",
  "mdi:tune-variant": "M8 13C6.14 13 4.59 14.28 4.14 16H2V18H4.14C4.59 19.72 6.14 21 8 21S11.41 19.72 11.86 18H22V16H11.86C11.41 14.28 9.86 13 8 13M8 19C6.9 19 6 18.1 6 17C6 15.9 6.9 15 8 15S10 15.9 10 17C10 18.1 9.1 19 8 19M19.86 6C19.41 4.28 17.86 3 16 3S12.59 4.28 12.14 6H2V8H12.14C12.59 9.72 14.14 11 16 11S19.41 9.72 19.86 8H22V6H19.86M16 9C14.9 9 14 8.1 14 7C14 5.9 14.9 5 16 5S18 5.9 18 7C18 8.1 17.1 9 16 9Z",
  "mdi:volume-high": "M14,3.23V5.29C16.89,6.15 19,8.83 19,12C19,15.17 16.89,17.84 14,18.7V20.77C18,19.86 21,16.28 21,12C21,7.72 18,4.14 14,3.23M16.5,12C16.5,10.23 15.5,8.71 14,7.97V16C15.5,15.29 16.5,13.76 16.5,12M3,9V15H7L12,20V4L7,9H3Z",
  "mdi:volume-low": "M7,9V15H11L16,20V4L11,9H7Z",
  "mdi:volume-medium": "M5,9V15H9L14,20V4L9,9M18.5,12C18.5,10.23 17.5,8.71 16,7.97V16C17.5,15.29 18.5,13.76 18.5,12Z",
  "mdi:volume-mute": "M3,9H7L12,4V20L7,15H3V9M16.59,12L14,9.41L15.41,8L18,10.59L20.59,8L22,9.41L19.41,12L22,14.59L20.59,16L18,13.41L15.41,16L14,14.59L16.59,12Z",
  "mdi:volume-off": "M12,4L9.91,6.09L12,8.18M4.27,3L3,4.27L7.73,9H3V15H7L12,20V13.27L16.25,17.53C15.58,18.04 14.83,18.46 14,18.7V20.77C15.38,20.45 16.63,19.82 17.68,18.96L19.73,21L21,19.73L12,10.73M19,12C19,12.94 18.8,13.82 18.46,14.64L19.97,16.15C20.62,14.91 21,13.5 21,12C21,7.72 18,4.14 14,3.23V5.29C16.89,6.15 19,8.83 19,12M16.5,12C16.5,10.23 15.5,8.71 14,7.97V10.18L16.45,12.63C16.5,12.43 16.5,12.21 16.5,12Z",
  "mdi:water-percent": "M12,3.25C12,3.25 6,10 6,14C6,17.32 8.69,20 12,20A6,6 0 0,0 18,14C18,10 12,3.25 12,3.25M14.47,9.97L15.53,11.03L9.53,17.03L8.47,15.97M9.75,10A1.25,1.25 0 0,1 11,11.25A1.25,1.25 0 0,1 9.75,12.5A1.25,1.25 0 0,1 8.5,11.25A1.25,1.25 0 0,1 9.75,10M14.25,14.5A1.25,1.25 0 0,1 15.5,15.75A1.25,1.25 0 0,1 14.25,17A1.25,1.25 0 0,1 13,15.75A1.25,1.25 0 0,1 14.25,14.5Z",
  "mdi:weather-cloudy": "M6,19A5,5 0 0,1 1,14A5,5 0 0,1 6,9C7,6.65 9.3,5 12,5C15.43,5 18.24,7.66 18.5,11.03L19,11A4,4 0 0,1 23,15A4,4 0 0,1 19,19H6M19,13H17V12A5,5 0 0,0 12,7C9.5,7 7.45,8.82 7.06,11.19C6.73,11.07 6.37,11 6,11A3,3 0 0,0 3,14A3,3 0 0,0 6,17H19A2,2 0 0,0 21,15A2,2 0 0,0 19,13Z",
  "mdi:weather-fog": "M3,15H13A1,1 0 0,1 14,16A1,1 0 0,1 13,17H3A1,1 0 0,1 2,16A1,1 0 0,1 3,15M16,15H21A1,1 0 0,1 22,16A1,1 0 0,1 21,17H16A1,1 0 0,1 15,16A1,1 0 0,1 16,15M1,12A5,5 0 0,1 6,7C7,4.65 9.3,3 12,3C15.43,3 18.24,5.66 18.5,9.03L19,9C21.19,9 22.97,10.76 23,13H21A2,2 0 0,0 19,11H17V10A5,5 0 0,0 12,5C9.5,5 7.45,6.82 7.06,9.19C6.73,9.07 6.37,9 6,9A3,3 0 0,0 3,12C3,12.35 3.06,12.69 3.17,13H1.1L1,12M3,19H5A1,1 0 0,1 6,20A1,1 0 0,1 5,21H3A1,1 0 0,1 2,20A1,1 0 0,1 3,19M8,19H21A1,1 0 0,1 22,20A1,1 0 0,1 21,21H8A1,1 0 0,1 7,20A1,1 0 0,1 8,19Z",
  "mdi:weather-hail": "M6,14A1,1 0 0,1 7,15A1,1 0 0,1 6,16A5,5 0 0,1 1,11A5,5 0 0,1 6,6C7,3.65 9.3,2 12,2C15.43,2 18.24,4.66 18.5,8.03L19,8A4,4 0 0,1 23,12A4,4 0 0,1 19,16H18A1,1 0 0,1 17,15A1,1 0 0,1 18,14H19A2,2 0 0,0 21,12A2,2 0 0,0 19,10H17V9A5,5 0 0,0 12,4C9.5,4 7.45,5.82 7.06,8.19C6.73,8.07 6.37,8 6,8A3,3 0 0,0 3,11A3,3 0 0,0 6,14M10,18A2,2 0 0,1 12,20A2,2 0 0,1 10,22A2,2 0 0,1 8,20A2,2 0 0,1 10,18M14.5,16A1.5,1.5 0 0,1 16,17.5A1.5,1.5 0 0,1 14.5,19A1.5,1.5 0 0,1 13,17.5A1.5,1.5 0 0,1 14.5,16M10.5,12A1.5,1.5 0 0,1 12,13.5A1.5,1.5 0 0,1 10.5,15A1.5,1.5 0 0,1 9,13.5A1.5,1.5 0 0,1 10.5,12Z",
  "mdi:weather-lightning": "M6,16A5,5 0 0,1 1,11A5,5 0 0,1 6,6C7,3.65 9.3,2 12,2C15.43,2 18.24,4.66 18.5,8.03L19,8A4,4 0 0,1 23,12A4,4 0 0,1 19,16H18A1,1 0 0,1 17,15A1,1 0 0,1 18,14H19A2,2 0 0,0 21,12A2,2 0 0,0 19,10H17V9A5,5 0 0,0 12,4C9.5,4 7.45,5.82 7.06,8.19C6.73,8.07 6.37,8 6,8A3,3 0 0,0 3,11A3,3 0 0,0 6,14H7A1,1 0 0,1 8,15A1,1 0 0,1 7,16H6M12,11H15L13,15H15L11.25,22L12,17H9.5L12,11Z",
  "mdi:weather-lightning-rainy": "M4.5,13.59C5,13.87 5.14,14.5 4.87,14.96C4.59,15.44 4,15.6 3.5,15.33V15.33C2,14.47 1,12.85 1,11A5,5 0 0,1 6,6C7,3.65 9.3,2 12,2C15.43,2 18.24,4.66 18.5,8.03L19,8A4,4 0 0,1 23,12A4,4 0 0,1 19,16A1,1 0 0,1 18,15A1,1 0 0,1 19,14A2,2 0 0,0 21,12A2,2 0 0,0 19,10H17V9A5,5 0 0,0 12,4C9.5,4 7.45,5.82 7.06,8.19C6.73,8.07 6.37,8 6,8A3,3 0 0,0 3,11C3,12.11 3.6,13.08 4.5,13.6V13.59M9.5,11H12.5L10.5,15H12.5L8.75,22L9.5,17H7L9.5,11M17.5,18.67C17.5,19.96 16.5,21 15.25,21C14,21 13,19.96 13,18.67C13,17.12 15.25,14.5 15.25,14.5C15.25,14.5 17.5,17.12 17.5,18.67Z",
  "mdi:weather-night": "M17.75,4.09L15.22,6.03L16.13,9.09L13.5,7.28L10.87,9.09L11.78,6.03L9.25,4.09L12.44,4L13.5,1L14.56,4L17.75,4.09M21.25,11L19.61,12.25L20.2,14.23L18.5,13.06L16.8,14.23L17.39,12.25L15.75,11L17.81,10.95L18.5,9L19.19,10.95L21.25,11M18.97,15.95C19.8,15.87 20.69,17.05 20.16,17.8C19.84,18.25 19.5,18.67 19.08,19.07C15.17,23 8.84,23 4.94,19.07C1.03,15.17 1.03,8.83 4.94,4.93C5.34,4.53 5.76,4.17 6.21,3.85C6.96,3.32 8.14,4.21 8.06,5.04C7.79,7.9 8.75,10.87 10.95,13.06C13.14,15.26 16.1,16.22 18.97,15.95M17.33,17.97C14.5,17.81 11.7,16.64 9.53,14.5C7.36,12.31 6.2,9.5 6.04,6.68C3.23,9.82 3.34,14.64 6.35,17.66C9.37,20.67 14.19,20.78 17.33,17.97Z",
  "mdi:weather-partly-cloudy": "M12.74,5.47C15.1,6.5 16.35,9.03 15.92,11.46C17.19,12.56 18,14.19 18,16V16.17C18.31,16.06 18.65,16 19,16A3,3 0 0,1 22,19A3,3 0 0,1 19,22H6A4,4 0 0,1 2,18A4,4 0 0,1 6,14H6.27C5,12.45 4.6,10.24 5.5,8.26C6.72,5.5 9.97,4.24 12.74,5.47M11.93,7.3C10.16,6.5 8.09,7.31 7.31,9.07C6.85,10.09 6.93,11.22 7.41,12.13C8.5,10.83 10.16,10 12,10C12.7,10 13.38,10.12 14,10.34C13.94,9.06 13.18,7.86 11.93,7.3M13.55,3.64C13,3.4 12.45,3.23 11.88,3.12L14.37,1.82L15.27,4.71C14.76,4.29 14.19,3.93 13.55,3.64M6.09,4.44C5.6,4.79 5.17,5.19 4.8,5.63L4.91,2.82L7.87,3.5C7.25,3.71 6.65,4.03 6.09,4.44M18,9.71C17.91,9.12 17.78,8.55 17.59,8L19.97,9.5L17.92,11.73C18.03,11.08 18.05,10.4 18,9.71M3.04,11.3C3.11,11.9 3.24,12.47 3.43,13L1.06,11.5L3.1,9.28C3,9.93 2.97,10.61 3.04,11.3M19,18H16V16A4,4 0 0,0 12,12A4,4 0 0,0 8,16H6A2,2 0 0,0 4,18A2,2 0 0,0 6,20H19A1,1 0 0,0 20,19A1,1 0 0,0 19,18Z",
  "mdi:weather-pouring": "M9,12C9.53,12.14 9.85,12.69 9.71,13.22L8.41,18.05C8.27,18.59 7.72,18.9 7.19,18.76C6.65,18.62 6.34,18.07 6.5,17.54L7.78,12.71C7.92,12.17 8.47,11.86 9,12M13,12C13.53,12.14 13.85,12.69 13.71,13.22L11.64,20.95C11.5,21.5 10.95,21.8 10.41,21.66C9.88,21.5 9.56,20.97 9.7,20.43L11.78,12.71C11.92,12.17 12.47,11.86 13,12M17,12C17.53,12.14 17.85,12.69 17.71,13.22L16.41,18.05C16.27,18.59 15.72,18.9 15.19,18.76C14.65,18.62 14.34,18.07 14.5,17.54L15.78,12.71C15.92,12.17 16.47,11.86 17,12M17,10V9A5,5 0 0,0 12,4C9.5,4 7.45,5.82 7.06,8.19C6.73,8.07 6.37,8 6,8A3,3 0 0,0 3,11C3,12.11 3.6,13.08 4.5,13.6V13.59C5,13.87 5.14,14.5 4.87,14.96C4.59,15.43 4,15.6 3.5,15.32V15.33C2,14.47 1,12.85 1,11A5,5 0 0,1 6,6C7,3.65 9.3,2 12,2C15.43,2 18.24,4.66 18.5,8.03L19,8A4,4 0 0,1 23,12C23,13.5 22.2,14.77 21,15.46V15.46C20.5,15.73 19.91,15.57 19.63,15.09C19.36,14.61 19.5,14 20,13.72V13.73C20.6,13.39 21,12.74 21,12A2,2 0 0,0 19,10H17Z",
  "mdi:weather-rainy": "M6,14.03A1,1 0 0,1 7,15.03C7,15.58 6.55,16.03 6,16.03C3.24,16.03 1,13.79 1,11.03C1,8.27 3.24,6.03 6,6.03C7,3.68 9.3,2.03 12,2.03C15.43,2.03 18.24,4.69 18.5,8.06L19,8.03A4,4 0 0,1 23,12.03C23,14.23 21.21,16.03 19,16.03H18C17.45,16.03 17,15.58 17,15.03C17,14.47 17.45,14.03 18,14.03H19A2,2 0 0,0 21,12.03A2,2 0 0,0 19,10.03H17V9.03C17,6.27 14.76,4.03 12,4.03C9.5,4.03 7.45,5.84 7.06,8.21C6.73,8.09 6.37,8.03 6,8.03A3,3 0 0,0 3,11.03A3,3 0 0,0 6,14.03M12,14.15C12.18,14.39 12.37,14.66 12.56,14.94C13,15.56 14,17.03 14,18C14,19.11 13.1,20 12,20A2,2 0 0,1 10,18C10,17.03 11,15.56 11.44,14.94C11.63,14.66 11.82,14.4 12,14.15M12,11.03L11.5,11.59C11.5,11.59 10.65,12.55 9.79,13.81C8.93,15.06 8,16.56 8,18A4,4 0 0,0 12,22A4,4 0 0,0 16,18C16,16.56 15.07,15.06 14.21,13.81C13.35,12.55 12.5,11.59 12.5,11.59",
  "mdi:weather-snowy": "M6,14A1,1 0 0,1 7,15A1,1 0 0,1 6,16A5,5 0 0,1 1,11A5,5 0 0,1 6,6C7,3.65 9.3,2 12,2C15.43,2 18.24,4.66 18.5,8.03L19,8A4,4 0 0,1 23,12A4,4 0 0,1 19,16H18A1,1 0 0,1 17,15A1,1 0 0,1 18,14H19A2,2 0 0,0 21,12A2,2 0 0,0 19,10H17V9A5,5 0 0,0 12,4C9.5,4 7.45,5.82 7.06,8.19C6.73,8.07 6.37,8 6,8A3,3 0 0,0 3,11A3,3 0 0,0 6,14M7.88,18.07L10.07,17.5L8.46,15.88C8.07,15.5 8.07,14.86 8.46,14.46C8.85,14.07 9.5,14.07 9.88,14.46L11.5,16.07L12.07,13.88C12.21,13.34 12.76,13.03 13.29,13.17C13.83,13.31 14.14,13.86 14,14.4L13.41,16.59L15.6,16C16.14,15.86 16.69,16.17 16.83,16.71C16.97,17.24 16.66,17.79 16.12,17.93L13.93,18.5L15.54,20.12C15.93,20.5 15.93,21.15 15.54,21.54C15.15,21.93 14.5,21.93 14.12,21.54L12.5,19.93L11.93,22.12C11.79,22.66 11.24,22.97 10.71,22.83C10.17,22.69 9.86,22.14 10,21.6L10.59,19.41L8.4,20C7.86,20.14 7.31,19.83 7.17,19.29C7.03,18.76 7.34,18.21 7.88,18.07Z",
  "mdi:weather-snowy-rainy": "M18.5,18.67C18.5,19.96 17.5,21 16.25,21C15,21 14,19.96 14,18.67C14,17.12 16.25,14.5 16.25,14.5C16.25,14.5 18.5,17.12 18.5,18.67M4,17.36C3.86,16.82 4.18,16.25 4.73,16.11L7,15.5L5.33,13.86C4.93,13.46 4.93,12.81 5.33,12.4C5.73,12 6.4,12 6.79,12.4L8.45,14.05L9.04,11.8C9.18,11.24 9.75,10.92 10.29,11.07C10.85,11.21 11.17,11.78 11,12.33L10.42,14.58L12.67,14C13.22,13.83 13.79,14.15 13.93,14.71C14.08,15.25 13.76,15.82 13.2,15.96L10.95,16.55L12.6,18.21C13,18.6 13,19.27 12.6,19.67C12.2,20.07 11.54,20.07 11.15,19.67L9.5,18L8.89,20.27C8.75,20.83 8.18,21.14 7.64,21C7.08,20.86 6.77,20.29 6.91,19.74L7.5,17.5L5.26,18.09C4.71,18.23 4.14,17.92 4,17.36M1,11A5,5 0 0,1 6,6C7,3.65 9.3,2 12,2C15.43,2 18.24,4.66 18.5,8.03L19,8A4,4 0 0,1 23,12A4,4 0 0,1 19,16A1,1 0 0,1 18,15A1,1 0 0,1 19,14A2,2 0 0,0 21,12A2,2 0 0,0 19,10H17V9A5,5 0 0,0 12,4C9.5,4 7.45,5.82 7.06,8.19C6.73,8.07 6.37,8 6,8A3,3 0 0,0 3,11C3,11.85 3.35,12.61 3.91,13.16C4.27,13.55 4.26,14.16 3.88,14.54C3.5,14.93 2.85,14.93 2.47,14.54C1.56,13.63 1,12.38 1,11Z",
  "mdi:weather-sunny": "M12,7A5,5 0 0,1 17,12A5,5 0 0,1 12,17A5,5 0 0,1 7,12A5,5 0 0,1 12,7M12,9A3,3 0 0,0 9,12A3,3 0 0,0 12,15A3,3 0 0,0 15,12A3,3 0 0,0 12,9M12,2L14.39,5.42C13.65,5.15 12.84,5 12,5C11.16,5 10.35,5.15 9.61,5.42L12,2M3.34,7L7.5,6.65C6.9,7.16 6.36,7.78 5.94,8.5C5.5,9.24 5.25,10 5.11,10.79L3.34,7M3.36,17L5.12,13.23C5.26,14 5.53,14.78 5.95,15.5C6.37,16.24 6.91,16.86 7.5,17.37L3.36,17M20.65,7L18.88,10.79C18.74,10 18.47,9.23 18.05,8.5C17.63,7.78 17.1,7.15 16.5,6.64L20.65,7M20.64,17L16.5,17.36C17.09,16.85 17.62,16.22 18.04,15.5C18.46,14.77 18.73,14 18.87,13.21L20.64,17M12,22L9.59,18.56C10.33,18.83 11.14,19 12,19C12.82,19 13.63,18.83 14.37,18.56L12,22Z",
  "mdi:weather-windy": "M4,10A1,1 0 0,1 3,9A1,1 0 0,1 4,8H12A2,2 0 0,0 14,6A2,2 0 0,0 12,4C11.45,4 10.95,4.22 10.59,4.59C10.2,5 9.56,5 9.17,4.59C8.78,4.2 8.78,3.56 9.17,3.17C9.9,2.45 10.9,2 12,2A4,4 0 0,1 16,6A4,4 0 0,1 12,10H4M19,12A1,1 0 0,0 20,11A1,1 0 0,0 19,10C18.72,10 18.47,10.11 18.29,10.29C17.9,10.68 17.27,10.68 16.88,10.29C16.5,9.9 16.5,9.27 16.88,8.88C17.42,8.34 18.17,8 19,8A3,3 0 0,1 22,11A3,3 0 0,1 19,14H5A1,1 0 0,1 4,13A1,1 0 0,1 5,12H19M18,18H4A1,1 0 0,1 3,17A1,1 0 0,1 4,16H18A3,3 0 0,1 21,19A3,3 0 0,1 18,22C17.17,22 16.42,21.66 15.88,21.12C15.5,20.73 15.5,20.1 15.88,19.71C16.27,19.32 16.9,19.32 17.29,19.71C17.47,19.89 17.72,20 18,20A1,1 0 0,0 19,19A1,1 0 0,0 18,18Z",
  "mdi:weather-windy-variant": "M6,6L6.69,6.06C7.32,3.72 9.46,2 12,2A5.5,5.5 0 0,1 17.5,7.5L17.42,8.45C17.88,8.16 18.42,8 19,8A3,3 0 0,1 22,11A3,3 0 0,1 19,14H6A4,4 0 0,1 2,10A4,4 0 0,1 6,6M6,8A2,2 0 0,0 4,10A2,2 0 0,0 6,12H19A1,1 0 0,0 20,11A1,1 0 0,0 19,10H15.5V7.5A3.5,3.5 0 0,0 12,4A3.5,3.5 0 0,0 8.5,7.5V8H6M18,18H4A1,1 0 0,1 3,17A1,1 0 0,1 4,16H18A3,3 0 0,1 21,19A3,3 0 0,1 18,22C17.17,22 16.42,21.66 15.88,21.12C15.5,20.73 15.5,20.1 15.88,19.71C16.27,19.32 16.9,19.32 17.29,19.71C17.47,19.89 17.72,20 18,20A1,1 0 0,0 19,19A1,1 0 0,0 18,18Z",
  "mdi:white-balance-incandescent": "M17.24,18.15L19.04,19.95L20.45,18.53L18.66,16.74M20,12.5H23V10.5H20M15,6.31V1.5H9V6.31C7.21,7.35 6,9.28 6,11.5A6,6 0 0,0 12,17.5A6,6 0 0,0 18,11.5C18,9.28 16.79,7.35 15,6.31M4,10.5H1V12.5H4M11,22.45C11.32,22.45 13,22.45 13,22.45V19.5H11M3.55,18.53L4.96,19.95L6.76,18.15L5.34,16.74L3.55,18.53Z",
  "mdi:wifi": "M12,21L15.6,16.2C14.6,15.45 13.35,15 12,15C10.65,15 9.4,15.45 8.4,16.2L12,21M12,3C7.95,3 4.21,4.34 1.2,6.6L3,9C5.5,7.12 8.62,6 12,6C15.38,6 18.5,7.12 21,9L22.8,6.6C19.79,4.34 16.05,3 12,3M12,9C9.3,9 6.81,9.89 4.8,11.4L6.6,13.8C8.1,12.67 9.97,12 12,12C14.03,12 15.9,12.67 17.4,13.8L19.2,11.4C17.19,9.89 14.7,9 12,9Z",
  "mdi:wifi-off": "M2.28,3L1,4.27L2.47,5.74C2.04,6 1.61,6.29 1.2,6.6L3,9C3.53,8.6 4.08,8.25 4.66,7.93L6.89,10.16C6.15,10.5 5.44,10.91 4.8,11.4L6.6,13.8C7.38,13.22 8.26,12.77 9.2,12.47L11.75,15C10.5,15.07 9.34,15.5 8.4,16.2L12,21L14.46,17.73L17.74,21L19,19.72M12,3C9.85,3 7.8,3.38 5.9,4.07L8.29,6.47C9.5,6.16 10.72,6 12,6C15.38,6 18.5,7.11 21,9L22.8,6.6C19.79,4.34 16.06,3 12,3M12,9C11.62,9 11.25,9 10.88,9.05L14.07,12.25C15.29,12.53 16.43,13.07 17.4,13.8L19.2,11.4C17.2,9.89 14.7,9 12,9Z",
  "mdi:window-closed-variant": "M21 20V2H3V20H1V23H23V20M19 4V11H13V4M5 4H11V11H5M5 20V13H11V20M13 20V13H19V20Z",
  "mdi:window-shutter": "M3 4H21V8H19V20H17V8H7V20H5V8H3V4M8 9H16V11H8V9M8 12H16V14H8V12M8 15H16V17H8V15M8 18H16V20H8V18Z"
};
var ya = Object.defineProperty, wa = Object.getOwnPropertyDescriptor, ti = (t, e, i, a) => {
  for (var s = a > 1 ? void 0 : a ? wa(e, i) : e, n = t.length - 1, r; n >= 0; n--)
    (r = t[n]) && (s = (a ? r(e, i, s) : r(s)) || s);
  return a && s && ya(e, i, s), s;
};
let Ut = class extends A {
  constructor() {
    super(...arguments), this.icon = "", this.size = 24;
  }
  render() {
    const t = ba[this.icon], e = `--hd-icon-size:${this.size}px`;
    if (t)
      return o`<svg viewBox="0 0 24 24" style=${e} aria-hidden="true">
        ${Ft`<path d=${t}></path>`}
      </svg>`;
    if (typeof customElements < "u" && customElements.get("ha-icon") && this.icon) {
      const i = document.createElement("ha-icon");
      return i.setAttribute("icon", this.icon), i.style.setProperty("--mdc-icon-size", `${this.size}px`), i.style.width = `${this.size}px`, i.style.height = `${this.size}px`, o`${i}`;
    }
    return this.icon ? o`<span class="dot" style=${e}></span>` : d;
  }
};
Ut.styles = x`
    :host {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      color: inherit;
      line-height: 0;
    }
    svg {
      display: block;
      width: var(--hd-icon-size, 24px);
      height: var(--hd-icon-size, 24px);
      fill: currentColor;
    }
    .dot {
      width: calc(var(--hd-icon-size, 24px) * 0.4);
      height: calc(var(--hd-icon-size, 24px) * 0.4);
      border-radius: 50%;
      background: currentColor;
      opacity: 0.5;
    }
  `;
ti([
  m({ type: String })
], Ut.prototype, "icon", 2);
ti([
  m({ type: Number })
], Ut.prototype, "size", 2);
Ut = ti([
  b("hd-icon")
], Ut);
var xa = Object.defineProperty, Ca = Object.getOwnPropertyDescriptor, lt = (t, e, i, a) => {
  for (var s = a > 1 ? void 0 : a ? Ca(e, i) : e, n = t.length - 1, r; n >= 0; n--)
    (r = t[n]) && (s = (a ? r(e, i, s) : r(s)) || s);
  return a && s && xa(e, i, s), s;
};
let U = class extends A {
  constructor() {
    super(...arguments), this.icon = "", this.label = "", this.disabled = !1, this.loading = !1, this.variant = "plain", this.size = 22;
  }
  render() {
    return o`
      <button
        ?disabled=${this.disabled || this.loading}
        aria-label=${this.label || this.icon}
        aria-busy=${this.loading ? "true" : "false"}
      >
        ${this.loading ? o`<span class="spin" role="progressbar"></span>` : o`<hd-icon .icon=${this.icon} .size=${this.size}></hd-icon>`}
      </button>
    `;
  }
};
U.styles = x`
    :host {
      display: inline-flex;
    }
    button {
      -webkit-tap-highlight-color: transparent;
      appearance: none;
      border: none;
      cursor: pointer;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      min-width: 44px;
      min-height: 44px;
      width: 44px;
      height: 44px;
      padding: 0;
      border-radius: var(--radius-pill);
      background: transparent;
      color: var(--text-primary);
      transition: background var(--motion-press) var(--ease-standard),
        transform var(--motion-press) var(--ease-standard);
    }
    button:hover:not(:disabled) {
      background: var(--surface-hover);
    }
    button:active:not(:disabled) {
      transform: scale(0.92);
    }
    :host([variant="filled"]) button {
      background: var(--accent);
      color: var(--text-on-accent);
    }
    :host([variant="filled"]) button:hover:not(:disabled) {
      background: var(--accent-hover);
    }
    :host([variant="soft"]) button {
      background: var(--surface-subtle);
    }
    :host([variant="soft"]) button:hover:not(:disabled) {
      background: var(--surface-hover);
    }
    button:disabled {
      opacity: 0.4;
      cursor: not-allowed;
    }
    button:focus-visible {
      outline: none;
      box-shadow: var(--focus-ring);
    }
    .spin {
      width: 20px;
      height: 20px;
      border-radius: 50%;
      border: 2px solid currentColor;
      border-top-color: transparent;
      opacity: 0.8;
      animation: spin 0.8s linear infinite;
    }
    @keyframes spin {
      to {
        transform: rotate(360deg);
      }
    }
    @media (prefers-reduced-motion: reduce) {
      .spin {
        animation-duration: 1.6s;
      }
      button:active:not(:disabled) {
        transform: none;
      }
    }
  `;
lt([
  m({ type: String })
], U.prototype, "icon", 2);
lt([
  m({ type: String })
], U.prototype, "label", 2);
lt([
  m({ type: Boolean, reflect: !0 })
], U.prototype, "disabled", 2);
lt([
  m({ type: Boolean, reflect: !0 })
], U.prototype, "loading", 2);
lt([
  m({ type: String })
], U.prototype, "variant", 2);
lt([
  m({ type: Number })
], U.prototype, "size", 2);
U = lt([
  b("hd-icon-button")
], U);
var _a = Object.defineProperty, $a = Object.getOwnPropertyDescriptor, F = (t, e, i, a) => {
  for (var s = a > 1 ? void 0 : a ? $a(e, i) : e, n = t.length - 1, r; n >= 0; n--)
    (r = t[n]) && (s = (a ? r(e, i, s) : r(s)) || s);
  return a && s && _a(e, i, s), s;
};
let I = class extends A {
  constructor() {
    super(...arguments), this.open = !1, this.variant = "auto", this.heading = "", this.subheading = "", this.headless = !1, this._resolved = "sheet", this._dragY = 0, this._closing = !1, this._opener = null, this._dragStartY = 0, this._dragging = !1, this._onKeyDown = (t) => {
      this.open && t.key === "Escape" && (t.stopPropagation(), this.requestClose());
    }, this._onHandleDown = (t) => {
      this._resolved === "sheet" && (this._dragging = !0, this._dragStartY = t.clientY, t.target.setPointerCapture(t.pointerId));
    }, this._onHandleMove = (t) => {
      this._dragging && (this._dragY = Math.max(0, t.clientY - this._dragStartY), this._container && (this._container.style.transform = `translateY(${this._dragY}px)`));
    }, this._onHandleUp = () => {
      this._dragging && (this._dragging = !1, this._container && (this._container.style.transform = ""), this._dragY > 120 && this.requestClose(), this._dragY = 0);
    };
  }
  connectedCallback() {
    super.connectedCallback(), this._mql = window.matchMedia("(min-width: 840px)"), this._resolveVariant();
  }
  disconnectedCallback() {
    super.disconnectedCallback(), document.removeEventListener("keydown", this._onKeyDown, !0);
  }
  updated(t) {
    t.has("open") && (this.open ? this._activate() : this._deactivate()), t.has("variant") && this._resolveVariant();
  }
  _resolveVariant() {
    this.variant === "auto" ? this._resolved = this._mql?.matches ? "drawer" : "sheet" : this._resolved = this.variant, this.classList.toggle("sheet", this._resolved === "sheet"), this.classList.toggle("drawer", this._resolved === "drawer"), this.classList.toggle("center", this._resolved === "center");
  }
  _activate() {
    this._resolveVariant(), this._closing = !1, this.classList.remove("closing"), this._opener = this.getRootNode().activeElement, document.addEventListener("keydown", this._onKeyDown, !0), requestAnimationFrame(() => this._focusFirst());
  }
  _deactivate() {
    document.removeEventListener("keydown", this._onKeyDown, !0), this._opener && typeof this._opener.focus == "function" && this._opener.focus(), this._opener = null;
  }
  _focusFirst() {
    (this._focusable()[0] ?? this._container)?.focus();
  }
  _focusable() {
    const t = 'button, [href], input, select, textarea, hd-icon-button, hd-toggle, hd-slider, hd-segmented, [tabindex]:not([tabindex="-1"])', e = Array.from(this.renderRoot.querySelectorAll(t)), i = Array.from(this.querySelectorAll(t));
    return [...e, ...i].filter(
      (a) => !a.hasAttribute("disabled") && a.offsetParent !== null && !a.classList.contains("sentinel")
    );
  }
  /** Sentinel focus handlers keep focus trapped inside the surface. */
  _wrap(t) {
    const e = this._focusable();
    ((t === "first" ? e[0] : e[e.length - 1]) ?? this._container)?.focus();
  }
  requestClose() {
    if (this._closing) return;
    this._closing = !0, this.classList.add("closing");
    const t = () => {
      this.classList.remove("closing"), this._closing = !1, this.dispatchEvent(new CustomEvent("hd-close", { bubbles: !0, composed: !0 }));
    }, e = this._container;
    if (!e || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      window.setTimeout(t, 10);
      return;
    }
    let i = !1;
    const a = () => {
      i || (i = !0, t());
    };
    e.addEventListener("animationend", a, { once: !0 }), window.setTimeout(a, 400);
  }
  _onBackdrop(t) {
    t.target === t.currentTarget && this.requestClose();
  }
  render() {
    if (!this.open) return d;
    const t = this.heading ? "hd-surface-title" : void 0;
    return o`
      <div class="backdrop" @click=${(e) => this._onBackdrop(e)}></div>
      <div class="sentinel" tabindex="0" @focus=${() => this._wrap("last")}></div>
      <div
        class="container"
        role="dialog"
        aria-modal="true"
        aria-label=${this.heading ? d : "Details"}
        aria-labelledby=${t ?? d}
        tabindex="-1"
      >
        <div
          class="handle"
          @pointerdown=${this._onHandleDown}
          @pointermove=${this._onHandleMove}
          @pointerup=${this._onHandleUp}
          @pointercancel=${this._onHandleUp}
        ></div>
        ${this.headless ? d : o`
              <header>
                <div class="titles">
                  <h2 id="hd-surface-title">${this.heading}</h2>
                  ${this.subheading ? o`<p>${this.subheading}</p>` : d}
                </div>
                <hd-icon-button
                  icon="mdi:close"
                  label="Close"
                  variant="soft"
                  @click=${() => this.requestClose()}
                ></hd-icon-button>
              </header>
            `}
        <div class="body"><slot></slot></div>
      </div>
      <div class="sentinel" tabindex="0" @focus=${() => this._wrap("first")}></div>
    `;
  }
};
I.styles = x`
    :host {
      position: fixed;
      inset: 0;
      z-index: 1000;
      display: none;
    }
    :host([open]) {
      display: block;
    }
    .backdrop {
      position: absolute;
      inset: 0;
      background: rgba(8, 10, 14, 0.44);
      opacity: 0;
      animation: fade var(--motion-surface) var(--ease-standard) forwards;
    }
    :host(.closing) .backdrop {
      animation: fadeOut var(--motion-surface) var(--ease-exit) forwards;
    }
    @keyframes fade {
      to {
        opacity: 1;
      }
    }
    @keyframes fadeOut {
      from {
        opacity: 1;
      }
      to {
        opacity: 0;
      }
    }

    .container {
      position: absolute;
      background: var(--surface);
      color: var(--text-primary);
      box-shadow: var(--shadow-raised);
      display: flex;
      flex-direction: column;
      max-height: 100%;
      overscroll-behavior: contain;
    }

    /* Bottom sheet */
    :host(.sheet) .container {
      left: 0;
      right: 0;
      bottom: 0;
      max-height: 92dvh;
      border-radius: var(--radius-sheet) var(--radius-sheet) 0 0;
      padding-bottom: env(safe-area-inset-bottom, 0px);
      animation: sheetIn var(--motion-surface) var(--ease-emphasis) forwards;
    }
    :host(.sheet.closing) .container {
      animation: sheetOut var(--motion-surface) var(--ease-exit) forwards;
    }
    @keyframes sheetIn {
      from {
        transform: translateY(100%);
      }
      to {
        transform: translateY(0);
      }
    }
    @keyframes sheetOut {
      to {
        transform: translateY(100%);
      }
    }

    /* Right drawer */
    :host(.drawer) .container {
      top: 0;
      bottom: 0;
      right: 0;
      width: min(460px, 92vw);
      border-radius: var(--radius-sheet) 0 0 var(--radius-sheet);
      animation: drawerIn var(--motion-surface) var(--ease-emphasis) forwards;
    }
    :host(.drawer.closing) .container {
      animation: drawerOut var(--motion-surface) var(--ease-exit) forwards;
    }
    @keyframes drawerIn {
      from {
        transform: translateX(100%);
      }
      to {
        transform: translateX(0);
      }
    }
    @keyframes drawerOut {
      to {
        transform: translateX(100%);
      }
    }

    /* Centered dialog */
    :host(.center) .container {
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      width: min(400px, 92vw);
      border-radius: var(--radius-widget);
      animation: dialogIn var(--motion-surface) var(--ease-emphasis) forwards;
    }
    :host(.center.closing) .container {
      animation: dialogOut var(--motion-content) var(--ease-exit) forwards;
    }
    @keyframes dialogIn {
      from {
        opacity: 0;
        transform: translate(-50%, -46%) scale(0.96);
      }
      to {
        opacity: 1;
        transform: translate(-50%, -50%) scale(1);
      }
    }
    @keyframes dialogOut {
      to {
        opacity: 0;
        transform: translate(-50%, -50%) scale(0.97);
      }
    }

    @media (prefers-reduced-motion: reduce) {
      .backdrop,
      .container {
        animation-duration: 1ms !important;
      }
    }

    .handle {
      align-self: center;
      width: 40px;
      height: 5px;
      border-radius: var(--radius-pill);
      background: var(--border-strong);
      margin: 10px 0 4px;
      flex: none;
      touch-action: none;
      cursor: grab;
    }
    :host(:not(.sheet)) .handle {
      display: none;
    }

    header {
      display: flex;
      align-items: flex-start;
      gap: 12px;
      padding: 10px 16px 12px 22px;
      flex: none;
    }
    .titles {
      flex: 1;
      min-width: 0;
      padding-top: 4px;
    }
    .titles h2 {
      margin: 0;
      font: var(--text-drawer-title);
      color: var(--text-primary);
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    .titles p {
      margin: 2px 0 0;
      font: var(--text-secondary-state);
      color: var(--text-secondary);
    }
    .body {
      flex: 1;
      overflow-y: auto;
      -webkit-overflow-scrolling: touch;
      padding: 4px 22px 24px;
    }
    .sentinel {
      position: fixed;
      width: 1px;
      height: 1px;
      opacity: 0;
    }
  `;
F([
  m({ type: Boolean, reflect: !0 })
], I.prototype, "open", 2);
F([
  m({ type: String })
], I.prototype, "variant", 2);
F([
  m({ type: String })
], I.prototype, "heading", 2);
F([
  m({ type: String })
], I.prototype, "subheading", 2);
F([
  m({ type: Boolean })
], I.prototype, "headless", 2);
F([
  C()
], I.prototype, "_resolved", 2);
F([
  C()
], I.prototype, "_dragY", 2);
F([
  C()
], I.prototype, "_closing", 2);
F([
  Je(".container")
], I.prototype, "_container", 2);
I = F([
  b("hd-surface")
], I);
var Aa = Object.defineProperty, Ha = Object.getOwnPropertyDescriptor, K = (t, e, i, a) => {
  for (var s = a > 1 ? void 0 : a ? Ha(e, i) : e, n = t.length - 1, r; n >= 0; n--)
    (r = t[n]) && (s = (a ? r(e, i, s) : r(s)) || s);
  return a && s && Aa(e, i, s), s;
};
let q = class extends A {
  constructor() {
    super(...arguments), this.views = [], this.currentViewId = "", this.productTitle = "Home", this.subtitle = "", this.connected = !0, this.appearance = "auto", this._mode = "sidebar", this._switcherOpen = !1;
  }
  connectedCallback() {
    super.connectedCallback(), this._ro = new ResizeObserver((t) => {
      const e = t[0].contentRect.width, i = e >= 1e3 ? "sidebar" : e >= 720 ? "rail" : "compact";
      i !== this._mode && (this._mode = i);
    }), this._ro.observe(this);
  }
  disconnectedCallback() {
    super.disconnectedCallback(), this._ro?.disconnect();
  }
  _navigate(t) {
    this._switcherOpen = !1, this.dispatchEvent(new CustomEvent("hd-navigate", { detail: { viewId: t }, bubbles: !0, composed: !0 }));
  }
  _cycleAppearance() {
    this.dispatchEvent(new CustomEvent("hd-toggle-appearance", { bubbles: !0, composed: !0 }));
  }
  get _current() {
    return this.views.find((t) => t.id === this.currentViewId) ?? this.views[0];
  }
  _appearanceIcon() {
    return this.appearance === "dark" ? "mdi:weather-night" : this.appearance === "light" ? "mdi:weather-sunny" : "mdi:theme-light-dark";
  }
  _renderNav() {
    const t = this.views.filter((a) => a.type === "room"), e = this.views.filter((a) => a.type !== "room"), i = (a) => o`
      <button
        class="navitem"
        aria-current=${a.id === this.currentViewId ? "page" : "false"}
        title=${a.label}
        @click=${() => this._navigate(a.id)}
      >
        <hd-icon .icon=${a.icon} .size=${22}></hd-icon>
        <span class="lbl">${a.label}</span>
      </button>
    `;
    return o`
      <nav class="side" aria-label="Views">
        <div class="brand">
          <span class="logo"><hd-icon icon="mdi:home-variant" .size=${20}></hd-icon></span>
          <span class="name">${this.productTitle}</span>
        </div>
        ${e.filter((a) => a.type === "overview").map(i)}
        ${t.length ? o`<div class="navsection">Rooms</div>` : d}
        ${t.map(i)}
        ${e.filter((a) => a.type === "system").length ? o`<div class="navsection">System</div>` : d}
        ${e.filter((a) => a.type === "system").map(i)}
        <div class="navspacer"></div>
        <button class="navitem" @click=${() => this._cycleAppearance()} title="Appearance">
          <hd-icon .icon=${this._appearanceIcon()} .size=${22}></hd-icon>
          <span class="lbl">Appearance</span>
        </button>
      </nav>
    `;
  }
  render() {
    const t = this._current, e = this._mode === "compact";
    return o`
      <div class="shell" data-mode=${this._mode}>
        ${e ? d : this._renderNav()}
        <div class="main">
          <header class="topbar">
            ${e ? o`<button class="switcher" @click=${() => this._switcherOpen = !0} aria-haspopup="dialog">
                    <span class="cur">
                      <hd-icon .icon=${t?.icon ?? "mdi:home"} .size=${24}></hd-icon>
                      <span class="rn">${t?.label ?? this.productTitle}</span>
                    </span>
                    <hd-icon icon="mdi:chevron-down" .size=${22}></hd-icon>
                  </button>` : o`<div class="titles">
                    <h1>${t?.label ?? this.productTitle}</h1>
                    ${this.subtitle ? o`<p>${this.subtitle}</p>` : d}
                  </div>`}
            <div class="actions">
              ${this.connected ? d : o`<hd-icon title="Offline" icon="mdi:wifi-off" .size=${20} style="color:var(--state-warn)"></hd-icon>`}
              ${e ? o`<hd-icon-button
                    .icon=${this._appearanceIcon()}
                    label="Appearance"
                    variant="soft"
                    @click=${() => this._cycleAppearance()}
                  ></hd-icon-button>` : d}
            </div>
          </header>

          ${this.connected ? d : o`<div class="offline" role="status">
                <hd-icon icon="mdi:wifi-off" .size=${16}></hd-icon>
                Offline — showing last known values. Controls are paused.
              </div>`}

          <div class="content"><slot></slot></div>
        </div>
      </div>

      <hd-surface
        variant="sheet"
        heading="Go to"
        ?open=${this._switcherOpen}
        @hd-close=${() => this._switcherOpen = !1}
      >
        <div class="sheet-list">
          ${this.views.map(
      (i) => o`<button
              class="sheet-item"
              aria-current=${i.id === this.currentViewId ? "page" : "false"}
              @click=${() => this._navigate(i.id)}
            >
              <span class="ic"><hd-icon .icon=${i.icon} .size=${22}></hd-icon></span>
              <span>${i.label}</span>
            </button>`
    )}
        </div>
      </hd-surface>
    `;
  }
};
q.styles = x`
    :host {
      display: block;
      height: 100%;
    }
    .shell {
      display: grid;
      height: 100%;
      background: var(--canvas);
      color: var(--text-primary);
    }
    .shell[data-mode="sidebar"] {
      grid-template-columns: 248px 1fr;
    }
    .shell[data-mode="rail"] {
      grid-template-columns: 76px 1fr;
    }
    .shell[data-mode="compact"] {
      grid-template-columns: 1fr;
    }

    /* ---- Sidebar / rail ---- */
    nav.side {
      border-right: 1px solid var(--border-subtle);
      background: var(--surface);
      display: flex;
      flex-direction: column;
      gap: 4px;
      padding: 18px 12px;
      overflow-y: auto;
    }
    .brand {
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 6px 10px 16px;
    }
    .brand .logo {
      width: 34px;
      height: 34px;
      border-radius: 10px;
      background: var(--accent);
      color: var(--text-on-accent);
      display: grid;
      place-items: center;
      flex: none;
    }
    .brand .name {
      font: var(--text-widget-title);
      font-weight: 700;
      font-size: 17px;
      color: var(--text-primary);
    }
    .shell[data-mode="rail"] .brand {
      justify-content: center;
      padding: 6px 0 16px;
    }
    .shell[data-mode="rail"] .brand .name {
      display: none;
    }

    .navitem {
      -webkit-tap-highlight-color: transparent;
      appearance: none;
      border: none;
      background: transparent;
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 11px 12px;
      border-radius: var(--radius-control);
      color: var(--text-secondary);
      font: var(--text-widget-title);
      font-weight: 600;
      min-height: 44px;
      text-align: left;
      width: 100%;
      transition: background var(--motion-press) var(--ease-standard), color var(--motion-press) var(--ease-standard);
    }
    .navitem:hover {
      background: var(--surface-hover);
      color: var(--text-primary);
    }
    .navitem[aria-current="page"] {
      background: var(--accent-soft);
      color: var(--accent-text);
    }
    .navitem .lbl {
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    .shell[data-mode="rail"] .navitem {
      justify-content: center;
      padding: 11px 0;
    }
    .shell[data-mode="rail"] .navitem .lbl {
      display: none;
    }
    .navitem:focus-visible {
      outline: none;
      box-shadow: var(--focus-ring);
    }
    .navspacer {
      flex: 1;
    }
    .navsection {
      font: var(--text-meta);
      color: var(--text-tertiary);
      text-transform: uppercase;
      letter-spacing: 0.05em;
      padding: 14px 12px 4px;
    }
    .shell[data-mode="rail"] .navsection {
      text-align: center;
      padding: 12px 0 4px;
      font-size: 9px;
    }

    /* ---- Main ---- */
    .main {
      display: flex;
      flex-direction: column;
      min-width: 0;
      height: 100%;
      overflow: hidden;
    }
    header.topbar {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 18px 24px 8px;
      flex: none;
    }
    .shell[data-mode="compact"] header.topbar {
      padding: calc(env(safe-area-inset-top, 0px) + 12px) 16px 8px;
      position: sticky;
      top: 0;
      background: color-mix(in srgb, var(--canvas) 88%, transparent);
      backdrop-filter: saturate(1.2) blur(8px);
      z-index: 5;
    }
    .titles {
      flex: 1;
      min-width: 0;
    }
    .titles h1 {
      margin: 0;
      font: var(--text-view-title);
      color: var(--text-primary);
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    .titles p {
      margin: 2px 0 0;
      font: var(--text-secondary-state);
      color: var(--text-secondary);
    }
    .switcher {
      -webkit-tap-highlight-color: transparent;
      appearance: none;
      border: none;
      background: transparent;
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 6px 8px 6px 4px;
      border-radius: var(--radius-pill);
      color: var(--text-primary);
      min-height: 44px;
    }
    .switcher .cur {
      display: flex;
      align-items: center;
      gap: 10px;
    }
    .switcher .cur .rn {
      font: var(--text-view-title);
      font-size: 24px;
    }
    .switcher:focus-visible {
      outline: none;
      box-shadow: var(--focus-ring);
    }
    .actions {
      display: flex;
      align-items: center;
      gap: 4px;
      flex: none;
    }
    .content {
      flex: 1;
      overflow-y: auto;
      overflow-x: hidden;
      -webkit-overflow-scrolling: touch;
      overscroll-behavior-y: contain;
      padding-bottom: env(safe-area-inset-bottom, 0px);
    }

    .offline {
      display: flex;
      align-items: center;
      gap: 8px;
      margin: 0 24px;
      padding: 10px 14px;
      border-radius: var(--radius-control);
      background: var(--state-warn-soft);
      color: var(--state-warn);
      font: var(--text-secondary-state);
      font-weight: 600;
    }
    .shell[data-mode="compact"] .offline {
      margin: 0 16px;
    }

    /* ---- Bottom-sheet switcher list ---- */
    .sheet-list {
      display: flex;
      flex-direction: column;
      gap: 4px;
    }
    .sheet-item {
      display: flex;
      align-items: center;
      gap: 14px;
      padding: 14px 12px;
      border-radius: var(--radius-control);
      border: none;
      background: transparent;
      color: var(--text-primary);
      font: var(--text-widget-title);
      font-weight: 600;
      cursor: pointer;
      min-height: 52px;
      text-align: left;
      width: 100%;
    }
    .sheet-item[aria-current="page"] {
      background: var(--accent-soft);
      color: var(--accent-text);
    }
    .sheet-item .ic {
      width: 40px;
      height: 40px;
      border-radius: var(--radius-icon);
      display: grid;
      place-items: center;
      background: var(--surface-subtle);
      flex: none;
    }
    .sheet-item[aria-current="page"] .ic {
      background: var(--surface);
    }
  `;
K([
  m({ attribute: !1 })
], q.prototype, "views", 2);
K([
  m({ type: String })
], q.prototype, "currentViewId", 2);
K([
  m({ type: String })
], q.prototype, "productTitle", 2);
K([
  m({ type: String })
], q.prototype, "subtitle", 2);
K([
  m({ type: Boolean })
], q.prototype, "connected", 2);
K([
  m({ type: String })
], q.prototype, "appearance", 2);
K([
  C()
], q.prototype, "_mode", 2);
K([
  C()
], q.prototype, "_switcherOpen", 2);
q = K([
  b("hd-app-shell")
], q);
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const La = { CHILD: 2 }, Va = (t) => (...e) => ({ _$litDirective$: t, values: e });
let Ma = class {
  constructor(e) {
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  _$AT(e, i, a) {
    this._$Ct = e, this._$AM = i, this._$Ci = a;
  }
  _$AS(e, i) {
    return this.update(e, i);
  }
  update(e, i) {
    return this.render(...i);
  }
};
/**
 * @license
 * Copyright 2020 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const { I: ka } = B1, bi = (t) => t, yi = () => document.createComment(""), Mt = (t, e, i) => {
  const a = t._$AA.parentNode, s = e === void 0 ? t._$AB : e._$AA;
  if (i === void 0) {
    const n = a.insertBefore(yi(), s), r = a.insertBefore(yi(), s);
    i = new ka(n, r, t, t.options);
  } else {
    const n = i._$AB.nextSibling, r = i._$AM, c = r !== t;
    if (c) {
      let l;
      i._$AQ?.(t), i._$AM = t, i._$AP !== void 0 && (l = t._$AU) !== r._$AU && i._$AP(l);
    }
    if (n !== s || c) {
      let l = i._$AA;
      for (; l !== n; ) {
        const h = bi(l).nextSibling;
        bi(a).insertBefore(l, s), l = h;
      }
    }
  }
  return i;
}, G = (t, e, i = t) => (t._$AI(e, i), t), Sa = {}, Pa = (t, e = Sa) => t._$AH = e, Ta = (t) => t._$AH, Se = (t) => {
  t._$AR(), t._$AA.remove();
};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const wi = (t, e, i) => {
  const a = /* @__PURE__ */ new Map();
  for (let s = e; s <= i; s++) a.set(t[s], s);
  return a;
}, Wi = Va(class extends Ma {
  constructor(t) {
    if (super(t), t.type !== La.CHILD) throw Error("repeat() can only be used in text expressions");
  }
  dt(t, e, i) {
    let a;
    i === void 0 ? i = e : e !== void 0 && (a = e);
    const s = [], n = [];
    let r = 0;
    for (const c of t) s[r] = a ? a(c, r) : r, n[r] = i(c, r), r++;
    return { values: n, keys: s };
  }
  render(t, e, i) {
    return this.dt(t, e, i).values;
  }
  update(t, [e, i, a]) {
    const s = Ta(t), { values: n, keys: r } = this.dt(e, i, a);
    if (!Array.isArray(s)) return this.ut = r, n;
    const c = this.ut ??= [], l = [];
    let h, u, p = 0, f = s.length - 1, g = 0, v = n.length - 1;
    for (; p <= f && g <= v; ) if (s[p] === null) p++;
    else if (s[f] === null) f--;
    else if (c[p] === r[g]) l[g] = G(s[p], n[g]), p++, g++;
    else if (c[f] === r[v]) l[v] = G(s[f], n[v]), f--, v--;
    else if (c[p] === r[v]) l[v] = G(s[p], n[v]), Mt(t, l[v + 1], s[p]), p++, v--;
    else if (c[f] === r[g]) l[g] = G(s[f], n[g]), Mt(t, s[p], s[f]), f--, g++;
    else if (h === void 0 && (h = wi(r, g, v), u = wi(c, p, f)), h.has(c[p])) if (h.has(c[f])) {
      const y = u.get(r[g]), M = y !== void 0 ? s[y] : null;
      if (M === null) {
        const T = Mt(t, s[p]);
        G(T, n[g]), l[g] = T;
      } else l[g] = G(M, n[g]), Mt(t, s[p], M), s[y] = null;
      g++;
    } else Se(s[f]), f--;
    else Se(s[p]), p++;
    for (; g <= v; ) {
      const y = Mt(t, l[v + 1]);
      G(y, n[g]), l[g++] = y;
    }
    for (; p <= f; ) {
      const y = s[p++];
      y !== null && Se(y);
    }
    return this.ut = r, Pa(t, l), st;
  }
});
function Xi(t) {
  const e = t || 1024;
  return e < 600 ? { columns: 2, gap: 10, pad: 12, bucket: "compact" } : e < 900 ? { columns: 4, gap: 14, pad: 20, bucket: "medium" } : e < 1200 ? { columns: 6, gap: 16, pad: 24, bucket: "wide" } : e < 1600 ? { columns: 8, gap: 16, pad: 28, bucket: "wide" } : { columns: 10, gap: 16, pad: 32, bucket: "wide" };
}
function ei(t, e) {
  return t.size?.[e] ?? t.size?.medium ?? "1x1";
}
function Ea(t, e) {
  const i = t.options ?? {};
  if (!(i.hero === !0 || typeof i.brand == "string")) return null;
  const s = ei(t, e);
  return s === "1x1" ? null : s;
}
function Bi(t, e) {
  const [i, a] = t.split("x").map((s) => parseInt(s, 10));
  return { colSpan: Math.min(Math.max(1, i || 1), e), rowSpan: Math.max(1, a || 1) };
}
function Oa(t, e) {
  const i = t - e.pad * 2 - e.gap * (e.columns - 1);
  return Math.max(96, Math.floor(i / e.columns));
}
const za = oa, Da = {
  media: "Media",
  devices: "Devices",
  sensors: "Sensors",
  energy: "Energy"
};
function Yi(t) {
  switch (t) {
    case "media":
      return "media";
    case "energy":
    case "powerflow":
    case "solarcharging":
    case "energychart":
      return "energy";
    case "sensor":
    case "binary_sensor":
    case "person":
    case "weather":
      return "sensors";
    default:
      return "devices";
  }
}
function Ia(t) {
  return t === "devices" ? "tile" : t === "sensors" ? "value" : "row";
}
function Ra(t, e) {
  const i = e || 1024;
  switch (t) {
    case "media":
      return i < 900 ? 1 : 2;
    case "devices":
      return i < 600 ? 3 : i < 900 ? 4 : i < 1200 ? 6 : 8;
    case "sensors":
      return i < 600 ? 2 : i < 900 ? 3 : i < 1200 ? 4 : 6;
    case "energy":
      return i < 900 ? 2 : 4;
  }
}
const Za = { compact: "4x2", medium: "4x2", wide: "4x2" };
function qa(t, e) {
  const i = { label: Da[t], variant: t, children: e };
  return {
    id: `__section_${t}`,
    type: "group",
    size: Za,
    options: i
  };
}
function Fa(t) {
  const e = t ?? [];
  if (e.some((s) => s.type === "group")) return e;
  const i = /* @__PURE__ */ new Map();
  for (const s of e) {
    const n = Yi(s.type), r = i.get(n) ?? [];
    r.push(s), i.set(n, r);
  }
  const a = [];
  for (const s of za) {
    const n = i.get(s);
    n && n.length && a.push(qa(s, n));
  }
  return a;
}
/**
 * @license
 * Copyright 2020 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const Qi = Symbol.for(""), Na = (t) => {
  if (t?.r === Qi) return t?._$litStatic$;
}, Ua = (t) => ({ _$litStatic$: t, r: Qi }), xi = /* @__PURE__ */ new Map(), ja = (t) => (e, ...i) => {
  const a = i.length;
  let s, n;
  const r = [], c = [];
  let l, h = 0, u = !1;
  for (; h < a; ) {
    for (l = e[h]; h < a && (n = i[h], (s = Na(n)) !== void 0); ) l += s + e[++h], u = !0;
    h !== a && c.push(n), r.push(l), h++;
  }
  if (h === a && r.push(e[a]), u) {
    const p = r.join("$$lit$$");
    (e = xi.get(p)) === void 0 && (r.raw = r, xi.set(p, e = r)), i = c;
  }
  return t(e, ...i);
}, Ka = ja(o);
var Wa = Object.defineProperty, Xa = Object.getOwnPropertyDescriptor, At = (t, e, i, a) => {
  for (var s = a > 1 ? void 0 : a ? Xa(e, i) : e, n = t.length - 1, r; n >= 0; n--)
    (r = t[n]) && (s = (a ? r(e, i, s) : r(s)) || s);
  return a && s && Wa(e, i, s), s;
};
let X = class extends A {
  constructor() {
    super(...arguments), this.currentSize = "4x2", this.layout = "row", this._width = 0;
  }
  connectedCallback() {
    super.connectedCallback(), this._ro = new ResizeObserver((t) => {
      const e = Math.round(t[0].contentRect.width);
      e && Math.abs(e - this._width) > 1 && (this._width = e);
    }), this._ro.observe(this), this._width = this.getBoundingClientRect().width || window.innerWidth;
  }
  disconnectedCallback() {
    super.disconnectedCallback(), this._ro?.disconnect();
  }
  get _opts() {
    return this.config?.options ?? {};
  }
  get _children() {
    return this._opts.children ?? [];
  }
  get _variant() {
    return this._opts.variant ?? Yi(this._children[0]?.type ?? "sensor");
  }
  render() {
    const t = this._children;
    if (!t.length) return d;
    const e = this._variant, i = Ra(e, this._width), a = 12, s = Xi(this._width).bucket, n = Ia(e), r = this._opts.label, c = n !== "row", l = e === "sensors" ? 84 : e === "media" ? 116 : Oa(this._width || 1024, { columns: i, gap: a, pad: 0 }), h = `--cols:${i}; --gap:${a}px; --unit:${l}px`;
    return o`
      <section class="section">
        ${r ? o`<h2 class="head">${r}</h2>` : d}
        <div class="grid" style=${h}>
          ${Wi(
      t,
      (u) => u.id,
      (u) => {
        const p = c ? Ea(u, s) : null;
        return M1(
          u,
          p ?? (c ? "1x1" : ei(u, s)),
          i,
          this.hass,
          p ? "row" : n
        );
      }
    )}
        </div>
      </section>
    `;
  }
};
X.styles = x`
    :host {
      display: block;
      grid-column: 1 / -1;
    }
    .section {
      display: block;
    }
    .head {
      margin: 0 0 12px 2px;
      font: var(--text-widget-title);
      font-weight: 700;
      font-size: 17px;
      color: var(--text-primary);
    }
    .grid {
      display: grid;
      grid-auto-flow: row;
      grid-template-columns: repeat(var(--cols, 3), minmax(0, 1fr));
      grid-auto-rows: var(--unit, 120px);
      gap: var(--gap, 12px);
    }
    .cell {
      min-width: 0;
      min-height: 0;
    }
  `;
At([
  m({ attribute: !1 })
], X.prototype, "hass", 2);
At([
  m({ attribute: !1 })
], X.prototype, "config", 2);
At([
  m({ type: String })
], X.prototype, "currentSize", 2);
At([
  m({ type: String })
], X.prototype, "layout", 2);
At([
  C()
], X.prototype, "_width", 2);
X = At([
  b("hd-group")
], X);
function w(t, e) {
  return t ? ((t.attributes.supported_features ?? 0) & e) === e : !1;
}
function Ht(t) {
  return t.split(".")[0];
}
function ye(t) {
  return !t || t.state === "unavailable";
}
function we(t) {
  return !!t && t.state === "unknown";
}
const Ba = { EFFECT: 4 }, Ya = /* @__PURE__ */ new Set([
  "brightness",
  "color_temp",
  "hs",
  "xy",
  "rgb",
  "rgbw",
  "rgbww",
  "white"
]), Qa = /* @__PURE__ */ new Set(["hs", "xy", "rgb", "rgbw", "rgbww"]);
function Gi(t) {
  const e = t?.attributes.supported_color_modes ?? [];
  return {
    brightness: e.some((i) => Ya.has(i)),
    colorTemp: e.includes("color_temp"),
    color: e.some((i) => Qa.has(i)),
    effects: w(t, Ba.EFFECT)
  };
}
const J = {
  OPEN: 1,
  CLOSE: 2,
  SET_POSITION: 4,
  STOP: 8,
  OPEN_TILT: 16,
  CLOSE_TILT: 32,
  SET_TILT_POSITION: 128
};
function Ji(t) {
  return {
    open: w(t, J.OPEN),
    close: w(t, J.CLOSE),
    stop: w(t, J.STOP),
    setPosition: w(t, J.SET_POSITION),
    tilt: w(t, J.OPEN_TILT) || w(t, J.CLOSE_TILT),
    setTilt: w(t, J.SET_TILT_POSITION)
  };
}
const ut = {
  TARGET_TEMPERATURE: 1,
  TARGET_TEMPERATURE_RANGE: 2,
  TARGET_HUMIDITY: 4,
  FAN_MODE: 8,
  PRESET_MODE: 16,
  SWING_MODE: 32
};
function t1(t) {
  return {
    targetTemp: w(t, ut.TARGET_TEMPERATURE),
    targetTempRange: w(t, ut.TARGET_TEMPERATURE_RANGE),
    fanMode: w(t, ut.FAN_MODE),
    presetMode: w(t, ut.PRESET_MODE),
    swingMode: w(t, ut.SWING_MODE),
    humidity: w(t, ut.TARGET_HUMIDITY)
  };
}
const D = {
  PAUSE: 1,
  VOLUME_SET: 4,
  VOLUME_MUTE: 8,
  PREVIOUS_TRACK: 16,
  NEXT_TRACK: 32,
  TURN_ON: 128,
  TURN_OFF: 256,
  VOLUME_STEP: 1024,
  SELECT_SOURCE: 2048,
  STOP: 4096,
  PLAY: 16384,
  SELECT_SOUND_MODE: 65536
};
function e1(t) {
  return {
    play: w(t, D.PLAY),
    pause: w(t, D.PAUSE),
    stop: w(t, D.STOP),
    next: w(t, D.NEXT_TRACK),
    previous: w(t, D.PREVIOUS_TRACK),
    volumeSet: w(t, D.VOLUME_SET),
    volumeStep: w(t, D.VOLUME_STEP),
    mute: w(t, D.VOLUME_MUTE),
    selectSource: w(t, D.SELECT_SOURCE),
    selectSoundMode: w(t, D.SELECT_SOUND_MODE),
    power: w(t, D.TURN_ON) || w(t, D.TURN_OFF)
  };
}
const tt = {
  PAUSE: 4,
  STOP: 8,
  RETURN_HOME: 16,
  FAN_SPEED: 32,
  BATTERY: 64,
  LOCATE: 512,
  START: 8192
};
function i1(t) {
  return {
    start: w(t, tt.START),
    pause: w(t, tt.PAUSE),
    stop: w(t, tt.STOP),
    returnHome: w(t, tt.RETURN_HOME),
    fanSpeed: w(t, tt.FAN_SPEED),
    battery: w(t, tt.BATTERY),
    locate: w(t, tt.LOCATE)
  };
}
const Gt = { SET_SPEED: 1, OSCILLATE: 2, DIRECTION: 4, PRESET_MODE: 8 };
function Ga(t) {
  return {
    speed: w(t, Gt.SET_SPEED),
    oscillate: w(t, Gt.OSCILLATE),
    direction: w(t, Gt.DIRECTION),
    presetMode: w(t, Gt.PRESET_MODE)
  };
}
function a1(t, e) {
  const i = { ...e.data ?? {} }, a = e.target ?? {};
  return t.callService(e.domain, e.service, i, a);
}
const _ = (t, e = {}) => ({
  entity_id: t,
  ...e
});
function B(t) {
  const e = Ht(t);
  return { domain: (/* @__PURE__ */ new Set(["light", "switch", "fan", "input_boolean", "media_player", "cover", "climate"])).has(e) ? e : "homeassistant", service: "toggle", data: _(t) };
}
function s1(t, e = {}) {
  const i = Ht(t);
  return { domain: ["light", "switch", "fan", "media_player", "input_boolean", "climate", "humidifier"].includes(i) ? i : "homeassistant", service: "turn_on", data: _(t, e) };
}
function n1(t) {
  const e = Ht(t);
  return { domain: ["light", "switch", "fan", "media_player", "input_boolean", "climate", "humidifier"].includes(e) ? e : "homeassistant", service: "turn_off", data: _(t) };
}
function gt(t, e = {}) {
  const i = {};
  return e.brightnessPct != null && (i.brightness_pct = it(Math.round(e.brightnessPct), 0, 100)), e.colorTempKelvin != null && (i.color_temp_kelvin = Math.round(e.colorTempKelvin)), e.rgbColor && (i.rgb_color = e.rgbColor), e.hsColor && (i.hs_color = [it(e.hsColor[0], 0, 360), it(e.hsColor[1], 0, 100)]), e.effect && (i.effect = e.effect), e.transition != null && (i.transition = e.transition), { domain: "light", service: "turn_on", data: _(t, i) };
}
function Re(t, e) {
  const i = it(Math.round(e), 0, 100);
  return i <= 0 ? n1(t) : gt(t, { brightnessPct: i });
}
function r1(t, e) {
  return { domain: "climate", service: "set_temperature", data: _(t, { temperature: e }) };
}
function o1(t, e) {
  return { domain: "climate", service: "set_hvac_mode", data: _(t, { hvac_mode: e }) };
}
function Ja(t, e) {
  return { domain: "climate", service: "set_fan_mode", data: _(t, { fan_mode: e }) };
}
function ts(t, e) {
  return { domain: "climate", service: "set_preset_mode", data: _(t, { preset_mode: e }) };
}
function es(t, e) {
  return { domain: "climate", service: "set_swing_mode", data: _(t, { swing_mode: e }) };
}
function c1(t) {
  return { domain: "cover", service: "open_cover", data: _(t) };
}
function l1(t) {
  return { domain: "cover", service: "close_cover", data: _(t) };
}
function d1(t) {
  return { domain: "cover", service: "stop_cover", data: _(t) };
}
function h1(t, e) {
  return {
    domain: "cover",
    service: "set_cover_position",
    data: _(t, { position: it(Math.round(e), 0, 100) })
  };
}
function u1(t) {
  return { domain: "media_player", service: "media_play_pause", data: _(t) };
}
function p1(t) {
  return { domain: "media_player", service: "media_next_track", data: _(t) };
}
function m1(t) {
  return { domain: "media_player", service: "media_previous_track", data: _(t) };
}
function is(t, e) {
  return {
    domain: "media_player",
    service: "volume_set",
    data: _(t, { volume_level: it(e, 0, 1) })
  };
}
function as(t, e) {
  return { domain: "media_player", service: "volume_mute", data: _(t, { is_volume_muted: e }) };
}
function ss(t, e) {
  return { domain: "media_player", service: "select_source", data: _(t, { source: e }) };
}
function ns(t, e) {
  return { domain: "media_player", service: "select_sound_mode", data: _(t, { sound_mode: e }) };
}
function re(t) {
  return { domain: "vacuum", service: "start", data: _(t) };
}
function Ze(t) {
  return { domain: "vacuum", service: "pause", data: _(t) };
}
function oe(t) {
  return { domain: "vacuum", service: "return_to_base", data: _(t) };
}
function g1(t, e) {
  return { domain: "vacuum", service: "set_fan_speed", data: _(t, { fan_speed: e }) };
}
function f1(t) {
  return { domain: "vacuum", service: "locate", data: _(t) };
}
function v1(t) {
  return { domain: "lock", service: "lock", data: _(t) };
}
function b1(t) {
  return { domain: "lock", service: "unlock", data: _(t) };
}
function rs(t) {
  return { domain: "scene", service: "turn_on", data: _(t) };
}
function os(t) {
  return { domain: "script", service: "turn_on", data: _(t) };
}
function cs(t) {
  return { domain: "button", service: "press", data: _(t) };
}
function ls(t, e) {
  return { domain: Ht(t) === "number" ? "number" : "input_number", service: "set_value", data: _(t, { value: e }) };
}
function ds(t, e) {
  return {
    domain: "fan",
    service: "set_percentage",
    data: _(t, { percentage: it(Math.round(e), 0, 100) })
  };
}
function it(t, e, i) {
  return Math.min(i, Math.max(e, t));
}
function hs(t, e) {
  return t?.attributes.friendly_name?.trim() || e;
}
function Lt(t, e) {
  if (!e) return "—";
  if (ye(e)) return "Unavailable";
  if (we(e)) return "Unknown";
  if (t?.formatEntityState)
    try {
      return t.formatEntityState(e);
    } catch {
    }
  return ps(e);
}
function us(t, e, i) {
  if (!e) return "—";
  if (t?.formatEntityAttributeValue)
    try {
      return t.formatEntityAttributeValue(e, i);
    } catch {
    }
  const a = e.attributes[i];
  return a == null ? "—" : String(a);
}
function ps(t) {
  const e = t.attributes.unit_of_measurement, i = Number(t.state);
  return !Number.isNaN(i) && t.state.trim() !== "" ? e ? `${$(i)} ${e}` : $(i) : V(t.state);
}
function $(t, e = 1) {
  if (!Number.isFinite(t)) return "—";
  const i = Math.abs(t), a = i >= 100 ? 0 : i >= 10 ? 1 : e;
  try {
    return new Intl.NumberFormat(void 0, {
      maximumFractionDigits: a,
      minimumFractionDigits: 0
    }).format(t);
  } catch {
    return t.toFixed(a);
  }
}
function V(t) {
  return t.replace(/[_-]+/g, " ").replace(/\b\w/g, (e) => e.toUpperCase()).trim();
}
function xe(t) {
  if (!t) return "";
  const e = new Date(t).getTime();
  if (Number.isNaN(e)) return "";
  const i = Math.round((Date.now() - e) / 1e3), a = Math.abs(i), s = ms(), n = () => a < 60 ? [-i, "second"] : a < 3600 ? [-Math.round(i / 60), "minute"] : a < 86400 ? [-Math.round(i / 3600), "hour"] : [-Math.round(i / 86400), "day"], [r, c] = n();
  return a < 45 ? "just now" : s ? s.format(r, c) : `${Math.abs(r)} ${c}${Math.abs(r) === 1 ? "" : "s"} ${r < 0 ? "ago" : "from now"}`;
}
let kt;
function ms() {
  if (kt !== void 0) return kt;
  try {
    kt = new Intl.RelativeTimeFormat(void 0, { numeric: "auto" });
  } catch {
    kt = null;
  }
  return kt;
}
function Ci(t) {
  if (!Number.isFinite(t) || t < 0) return "0:00";
  const e = Math.floor(t % 60), i = Math.floor(t / 60 % 60), a = Math.floor(t / 3600), s = a > 0 ? String(i).padStart(2, "0") : String(i), n = String(e).padStart(2, "0");
  return a > 0 ? `${a}:${s}:${n}` : `${s}:${n}`;
}
const gs = [
  ["main_brush_time_left", "Main brush"],
  ["side_brush_time_left", "Side brush"],
  ["filter_time_left", "Filter"],
  ["sensor_time_left", "Sensors"],
  ["dock_maintenance_brush_time_left", "Dock brush"],
  ["dock_strainer_time_left", "Dock strainer"]
], fs = 20;
function St(t, e, i) {
  const a = t?.states[e];
  if (!a || (i.push(e), ye(a) || we(a))) return;
  const s = Number(a.state);
  return Number.isFinite(s) ? s : void 0;
}
function _i(t, e, i) {
  const a = t?.states[e];
  if (a && (i.push(e), !(ye(a) || we(a))))
    return a.state || void 0;
}
function Rt(t, e) {
  const i = [], a = { consumables: [], ids: i };
  if (!t || !e) return a;
  const s = e.split(".")[1];
  if (!s) return a;
  const n = `sensor.${s}_`, r = [];
  for (const [c, l] of gs) {
    const h = St(t, n + c, i);
    h != null && r.push({ key: c, label: l, hoursLeft: h });
  }
  return {
    battery: St(t, n + "battery", i),
    status: _i(t, n + "status", i),
    room: _i(t, n + "current_room", i),
    progress: St(t, n + "cleaning_progress", i),
    area: St(t, n + "cleaning_area", i),
    cleaningTime: St(t, n + "cleaning_time", i),
    consumables: r,
    ids: i
  };
}
const $i = {
  binary_sensor: {
    motion: "mdi:motion-sensor",
    door: "mdi:door",
    window: "mdi:window-closed-variant",
    garage_door: "mdi:garage",
    moisture: "mdi:water-alert",
    smoke: "mdi:smoke-detector",
    gas: "mdi:gas-cylinder",
    problem: "mdi:alert-circle",
    connectivity: "mdi:lan-connect",
    occupancy: "mdi:home-account",
    presence: "mdi:home-account",
    lock: "mdi:lock",
    opening: "mdi:square-outline",
    battery: "mdi:battery-alert",
    power: "mdi:power-plug"
  },
  sensor: {
    temperature: "mdi:thermometer",
    humidity: "mdi:water-percent",
    power: "mdi:flash",
    energy: "mdi:lightning-bolt",
    battery: "mdi:battery",
    pressure: "mdi:gauge",
    illuminance: "mdi:brightness-5",
    voltage: "mdi:sine-wave",
    current: "mdi:current-ac",
    gas: "mdi:meter-gas",
    carbon_dioxide: "mdi:molecule-co2",
    pm25: "mdi:air-filter"
  },
  cover: {
    door: "mdi:door",
    garage: "mdi:garage",
    shade: "mdi:roller-shade",
    blind: "mdi:blinds",
    curtain: "mdi:curtains",
    window: "mdi:window-shutter",
    awning: "mdi:awning-outline",
    gate: "mdi:gate"
  }
}, vs = {
  light: "mdi:lightbulb",
  switch: "mdi:toggle-switch-variant",
  fan: "mdi:fan",
  climate: "mdi:thermostat",
  cover: "mdi:window-shutter",
  media_player: "mdi:cast",
  sensor: "mdi:eye",
  binary_sensor: "mdi:radiobox-blank",
  person: "mdi:account",
  device_tracker: "mdi:crosshairs-gps",
  scene: "mdi:palette",
  script: "mdi:script-text",
  button: "mdi:gesture-tap-button",
  lock: "mdi:lock",
  vacuum: "mdi:robot-vacuum",
  camera: "mdi:cctv",
  weather: "mdi:weather-partly-cloudy",
  alarm_control_panel: "mdi:shield-home",
  automation: "mdi:robot",
  input_boolean: "mdi:toggle-switch"
};
function ae(t, e) {
  const i = e?.attributes.device_class;
  return i && $i[t]?.[i] ? $i[t][i] : vs[t] ?? "mdi:help-circle-outline";
}
function qe(t) {
  return {
    "clear-night": "mdi:weather-night",
    cloudy: "mdi:weather-cloudy",
    fog: "mdi:weather-fog",
    hail: "mdi:weather-hail",
    lightning: "mdi:weather-lightning",
    "lightning-rainy": "mdi:weather-lightning-rainy",
    partlycloudy: "mdi:weather-partly-cloudy",
    pouring: "mdi:weather-pouring",
    rainy: "mdi:weather-rainy",
    snowy: "mdi:weather-snowy",
    "snowy-rainy": "mdi:weather-snowy-rainy",
    sunny: "mdi:weather-sunny",
    windy: "mdi:weather-windy",
    "windy-variant": "mdi:weather-windy-variant",
    exceptional: "mdi:alert-circle-outline"
  }[t] ?? "mdi:weather-cloudy";
}
function bs(t, e) {
  const i = Math.round(t / 10) * 10;
  return e ? i >= 100 ? "mdi:battery-charging-100" : i <= 10 ? "mdi:battery-charging-10" : `mdi:battery-charging-${i}` : i >= 100 ? "mdi:battery" : i <= 5 ? "mdi:battery-alert-variant-outline" : `mdi:battery-${i}`;
}
const ys = /* @__PURE__ */ new Set(["on", "open", "playing", "home", "cleaning", "heat", "cool", "auto", "active"]);
function y1(t, e, i) {
  const a = i?.name ?? "Unknown";
  if (!e)
    return Ai("", a, "mdi:help-circle-outline", "Not configured");
  const s = Ht(e), n = ha(e), r = t?.states[e];
  if (n)
    return Ai(e, i?.name ?? "Configure me", i?.icon ?? ae(s, void 0), "Replace placeholder id");
  if (!r)
    return {
      entityId: e,
      domain: s,
      exists: !1,
      available: !1,
      unknown: !1,
      isPlaceholder: !1,
      name: i?.name ?? V(e.split(".")[1] ?? e),
      icon: i?.icon ?? ae(s, void 0),
      rawState: "missing",
      displayState: "Not found",
      secondary: "Entity unavailable",
      active: !1,
      accent: "unavailable",
      quickAction: { kind: "none", label: "Unavailable" }
    };
  const c = i?.name ?? hs(r, V(e.split(".")[1] ?? e)), l = ye(r), h = we(r), u = {
    entityId: e,
    domain: s,
    stateObj: r,
    exists: !0,
    available: !l,
    unknown: h,
    isPlaceholder: !1,
    name: c,
    icon: i?.icon ?? r.attributes.icon ?? ae(s, r),
    rawState: r.state,
    displayState: Lt(t, r),
    active: !1,
    accent: l ? "unavailable" : "idle",
    quickAction: { kind: "none", label: c }
  };
  return l ? (u.secondary = "Unavailable", u) : ws(u, r, i, t);
}
function ws(t, e, i, a) {
  const s = ys.has(e.state);
  switch (t.domain) {
    case "light":
      return xs(t, e, i);
    case "switch":
    case "input_boolean":
      return t.active = e.state === "on", t.accent = t.active ? "accent" : "idle", t.icon = i?.icon ?? e.attributes.icon ?? ae(t.domain, e), t.quickAction = { kind: "toggle", label: t.active ? "Turn off" : "Turn on", call: B(t.entityId) }, t;
    case "fan":
      return t.active = e.state === "on", t.accent = t.active ? "accent" : "idle", typeof e.attributes.percentage == "number" && (t.level = e.attributes.percentage), t.secondary = t.active && t.level != null ? `${Math.round(t.level)}%` : void 0, t.quickAction = { kind: "toggle", label: t.active ? "Turn off" : "Turn on", call: B(t.entityId) }, t;
    case "climate":
      return Cs(t, e);
    case "cover":
      return _s(t, e);
    case "media_player":
      return $s(t, e);
    case "lock":
      return As(t, e, i);
    case "vacuum":
      return Hs(t, e, a);
    case "binary_sensor":
      return Vs(t, e);
    case "person":
    case "device_tracker":
      return Ms(t, e);
    case "sensor":
      return ks(t, e);
    case "weather":
      return t.icon = qe(e.state), t.accent = "accent", t.secondary = e.attributes.temperature != null ? `${$(e.attributes.temperature)}°` : void 0, t;
    case "scene":
      return t.accent = "accent", t.displayState = "Scene", t.quickAction = { kind: "activate", label: "Activate", call: rs(t.entityId) }, t;
    case "script":
      return t.active = e.state === "on", t.accent = t.active ? "accent" : "idle", t.displayState = t.active ? "Running" : "Run", t.quickAction = {
        kind: "activate",
        label: "Run",
        call: os(t.entityId),
        requiresConfirmation: i?.requiresConfirmation
      }, t;
    case "button":
      return t.accent = "accent", t.displayState = "Press", t.quickAction = {
        kind: "activate",
        label: "Press",
        call: cs(t.entityId),
        requiresConfirmation: i?.requiresConfirmation
      }, t;
    default:
      return t.active = s, t.accent = s ? "accent" : "idle", t;
  }
}
function xs(t, e, i) {
  const a = e.state === "on";
  t.active = a, t.accent = a ? "light" : "idle", t.icon = i?.icon ?? e.attributes.icon ?? "mdi:lightbulb";
  const s = e.attributes.brightness;
  a && typeof s == "number" ? (t.level = Math.round(s / 255 * 100), t.secondary = `${t.level}%`) : t.secondary = a ? "On" : "Off";
  const n = e.attributes.rgb_color, r = e.attributes.color_mode;
  return a && n && r && ["hs", "xy", "rgb", "rgbw", "rgbww"].includes(r) && (t.rgbCss = `rgb(${n[0]}, ${n[1]}, ${n[2]})`), t.quickAction = { kind: "toggle", label: a ? "Turn off" : "Turn on", call: B(t.entityId) }, t;
}
function Cs(t, e) {
  const i = e.state;
  t.active = i !== "off";
  const a = ["heat", "heat_cool"].includes(i), s = i === "cool";
  t.accent = i === "off" ? "idle" : a ? "heat" : s ? "cool" : "accent";
  const n = e.attributes.current_temperature, r = e.attributes.temperature;
  t.displayState = V(i);
  const c = [];
  return n != null && c.push(`${$(n)}°`), r != null && i !== "off" && c.push(`→ ${$(r)}°`), t.secondary = c.join("  "), typeof r == "number" && (t.level = r), t.quickAction = { kind: "none", label: t.name }, t;
}
function _s(t, e) {
  const i = e.attributes.current_position, a = e.state === "open" || typeof i == "number" && i > 0;
  return t.active = a, t.accent = a ? "accent" : "idle", typeof i == "number" ? (t.level = i, t.secondary = `${i}% open`) : t.secondary = V(e.state), t.quickAction = { kind: "none", label: t.name }, t;
}
function $s(t, e) {
  const i = e.state, a = i === "playing";
  t.active = ["playing", "paused", "on", "buffering"].includes(i), t.accent = a || t.active ? "accent" : "idle", t.icon = t.active ? "mdi:cast-connected" : "mdi:cast";
  const s = e.attributes.media_title, n = e.attributes.app_name, r = e.attributes.source;
  return t.displayState = a ? "Playing" : V(i), t.secondary = s ?? n ?? r ?? void 0, t.quickAction = { kind: "none", label: t.name }, t;
}
function As(t, e, i) {
  const a = e.state === "locked";
  return t.active = !a, t.accent = a ? "eco" : "warn", t.icon = a ? "mdi:lock" : "mdi:lock-open-variant", t.displayState = V(e.state), t.quickAction = {
    kind: "toggle",
    label: a ? "Unlock" : "Lock",
    call: a ? b1(t.entityId) : v1(t.entityId),
    // Unlocking is sensitive; honor explicit config too.
    requiresConfirmation: a || i?.requiresConfirmation
  }, t;
}
function Hs(t, e, i) {
  const a = e.state, s = a === "cleaning", n = a === "error", r = Rt(i, t.entityId);
  t.active = s, t.accent = n ? "alert" : s ? "accent" : "idle";
  const c = V((r.status ?? a).replace(/_/g, " "));
  t.displayState = s && r.room ? `Cleaning ${r.room}` : c, typeof r.progress == "number" && s && (t.level = r.progress);
  const l = r.battery ?? e.attributes.battery_level;
  if (s && typeof r.progress == "number") {
    const h = typeof r.area == "number" && r.area > 0 ? ` · ${$(r.area)} m²` : "";
    t.secondary = `${Math.round(r.progress)}%${h}`;
  } else
    t.secondary = l != null ? `${Math.round(l)}% battery` : void 0;
  return t.quickAction = a === "docked" || a === "idle" ? { kind: "toggle", label: "Start", call: re(t.entityId) } : { kind: "toggle", label: "Return to dock", call: oe(t.entityId) }, t;
}
const Ls = /* @__PURE__ */ new Set(["smoke", "gas", "moisture", "problem", "safety", "carbon_monoxide", "tamper"]);
function Vs(t, e) {
  const i = e.state === "on";
  t.active = i;
  const a = e.attributes.device_class;
  return i && a && Ls.has(a) ? t.accent = "alert" : i ? t.accent = "accent" : t.accent = "idle", t.secondary = xe(e.last_changed), t;
}
function Ms(t, e) {
  const i = e.state === "home";
  return t.active = i, t.accent = i ? "eco" : "idle", t.icon = i ? "mdi:home-account" : "mdi:home-export-outline", t.displayState = i ? "Home" : V(e.state), t.secondary = xe(e.last_changed), t;
}
function ks(t, e) {
  const i = e.attributes.device_class, a = Number(e.state);
  if (t.accent = "idle", i === "battery" && !Number.isNaN(a)) {
    const s = e.attributes.battery_charging ?? !1;
    t.icon = bs(a, s), t.accent = a <= 15 ? "warn" : "eco";
  }
  return t.secondary = void 0, t.quickAction = { kind: "none", label: t.name }, t;
}
function Ai(t, e, i, a) {
  return {
    entityId: t,
    domain: t ? Ht(t) : "",
    exists: !1,
    available: !1,
    unknown: !1,
    isPlaceholder: !0,
    name: e,
    icon: i,
    rawState: "placeholder",
    displayState: "Set up",
    secondary: a,
    active: !1,
    accent: "unavailable",
    quickAction: { kind: "none", label: "Configure" }
  };
}
function w1(t) {
  switch (t) {
    case "light":
      return { fg: "var(--state-light)", bg: "var(--state-light-soft)" };
    case "heat":
      return { fg: "var(--state-heat)", bg: "var(--state-heat-soft)" };
    case "cool":
      return { fg: "var(--state-cool)", bg: "var(--state-cool-soft)" };
    case "eco":
      return { fg: "var(--state-eco)", bg: "var(--state-eco-soft)" };
    case "warn":
      return { fg: "var(--state-warn)", bg: "var(--state-warn-soft)" };
    case "alert":
      return { fg: "var(--state-alert)", bg: "var(--state-alert-soft)" };
    case "accent":
      return { fg: "var(--accent)", bg: "var(--accent-soft)" };
    case "unavailable":
      return { fg: "var(--unavailable-fg)", bg: "var(--idle-bg)" };
    case "idle":
    default:
      return { fg: "var(--idle-fg)", bg: "var(--idle-bg)" };
  }
}
function Xt(t, e) {
  return new Promise((i) => {
    const a = new CustomEvent("hd-confirm", {
      detail: { opts: e, resolve: i },
      bubbles: !0,
      composed: !0
    });
    t.dispatchEvent(a) || i(!1);
  });
}
function jt(t, e) {
  t.dispatchEvent(new CustomEvent("hd-toast", { detail: e, bubbles: !0, composed: !0 }));
}
var Ss = Object.defineProperty, Ps = Object.getOwnPropertyDescriptor, P = (t, e, i, a) => {
  for (var s = a > 1 ? void 0 : a ? Ps(e, i) : e, n = t.length - 1, r; n >= 0; n--)
    (r = t[n]) && (s = (a ? r(e, i, s) : r(s)) || s);
  return a && s && Ss(e, i, s), s;
};
let k = class extends A {
  constructor() {
    super(...arguments), this.icon = "", this.name = "", this.stateText = "", this.secondary = "", this.size = "1x1", this.accent = "idle", this.glyphColor = "", this.active = !1, this.unavailable = !1, this.hasDetail = !1, this.quickKind = "none", this.quickLabel = "", this.actionState = "idle", this.bleed = !1, this.layout = "row";
  }
  connectedCallback() {
    super.connectedCallback(), this.setAttribute("data-size", this.size);
  }
  updated(t) {
    t.has("size") && this.setAttribute("data-size", this.size);
  }
  /** What tapping the card body does. */
  get _bodyAction() {
    return this.unavailable ? null : this.hasDetail ? "detail" : this.quickKind === "activate" ? "quick" : null;
  }
  _quick(t) {
    if (t.stopPropagation(), !this.unavailable) {
      if (this.quickKind === "none") {
        this.hasDetail && this._emit("hd-activate");
        return;
      }
      this._emit("hd-quick");
    }
  }
  _body(t) {
    t.stopPropagation();
    const e = this._bodyAction;
    e === "detail" ? this._emit("hd-activate") : e === "quick" && this._emit("hd-quick");
  }
  _emit(t) {
    this.dispatchEvent(new CustomEvent(t, { bubbles: !0, composed: !0 }));
  }
  _stop(t) {
    t.stopPropagation();
  }
  render() {
    const t = w1(this.accent), e = this.glyphColor || t.fg, i = `--icon-bg:${t.bg};--icon-fg:${e};--accent-ring:${t.fg};--state-color:${this.active ? t.fg : "var(--text-secondary)"}`, a = (this.quickKind !== "none" || this.hasDetail) && !this.unavailable, s = this._bodyAction, n = this.quickKind !== "none" ? this.quickLabel || this.name : this.hasDetail ? `${this.name} details` : this.name, r = s === "detail" ? `${this.name} details` : this.name;
    return this.bleed ? o`<div
        class="card bleed"
        data-clickable=${s ? "true" : "false"}
        style=${i}
        @click=${this._body}
      >
        <slot></slot>
      </div>` : this.layout === "tile" ? this._renderTile(i, s, a, n, r) : this.layout === "value" ? this._renderValue(i, s, r) : this._renderRow(i, s, a, n, r);
  }
  /** The reusable quick-action icon button, shared by every layout. */
  _iconButton(t, e) {
    return o`<button
      class="icon-btn ${this.actionState}"
      data-interactive=${t ? "true" : "false"}
      aria-label=${e}
      ?disabled=${this.unavailable && this.quickKind !== "none"}
      @click=${this._quick}
    >
      <hd-icon .icon=${this.icon} .size=${24}></hd-icon>
    </button>`;
  }
  _titleBlock(t, e) {
    const i = o`<span class="name">${this.name}</span>
      ${this.stateText ? o`<span class="state">${this.stateText}</span>` : d}
      ${this.secondary ? o`<span class="secondary">${this.secondary}</span>` : d}`;
    return t ? o`<button class="titles" aria-label=${e} @click=${this._body}>${i}</button>` : o`<div class="titles">${i}</div>`;
  }
  /** The default header card. */
  _renderRow(t, e, i, a, s) {
    return o`
      <div class="card" data-clickable=${e ? "true" : "false"} style=${t} @click=${this._body}>
        <div class="header">
          ${this._iconButton(i, a)} ${this._titleBlock(e, s)}
          <div class="badge">
            <slot name="badge"></slot>
            ${this.hasDetail && this.quickKind === "none" ? o`<hd-icon class="chev" icon="mdi:chevron-right" .size=${20}></hd-icon>` : d}
          </div>
        </div>
        <div class="body" @click=${this._stop}><slot></slot></div>
      </div>
    `;
  }
  /** Homey device square: icon TL · accessory TR · name pinned to the bottom. */
  _renderTile(t, e, i, a, s) {
    const n = o`<span class="name">${this.name}</span>
      ${this.stateText ? o`<span class="state">${this.stateText}</span>` : d}`;
    return o`
      <div class="card tile" data-clickable=${e ? "true" : "false"} style=${t} @click=${this._body}>
        <div class="tile-top">
          ${this._iconButton(i, a)}
          <span class="accessory">
            <slot name="badge">${this.active ? o`<span class="dot"></span>` : d}</slot>
          </span>
        </div>
        ${e ? o`<button class="tile-foot" aria-label=${s} @click=${this._body}>${n}</button>` : o`<div class="tile-foot">${n}</div>`}
      </div>
    `;
  }
  /** Read-only value tile: label · big value · right-hand icon circle. */
  _renderValue(t, e, i) {
    const a = o`<span class="val-label">${this.name}</span>
      <span class="val-value">
        ${this.stateText ? o`<span>${this.stateText}</span>` : d}
        <slot></slot>
      </span>`;
    return o`
      <div class="card value" data-clickable=${e ? "true" : "false"} style=${t} @click=${this._body}>
        ${e ? o`<button class="val-main" aria-label=${i} @click=${this._body}>${a}</button>` : o`<div class="val-main">${a}</div>`}
        <span class="val-icon"><hd-icon .icon=${this.icon} .size=${22}></hd-icon></span>
      </div>
    `;
  }
};
k.styles = x`
    :host {
      display: block;
      height: 100%;
    }
    .card {
      position: relative;
      height: 100%;
      box-sizing: border-box;
      background: var(--surface);
      border-radius: var(--radius-widget);
      box-shadow: var(--shadow-widget);
      padding: var(--pad, 16px);
      display: flex;
      flex-direction: column;
      gap: 10px;
      overflow: hidden;
      transition: box-shadow var(--motion-state) var(--ease-standard);
      isolation: isolate;
    }
    .card[data-clickable="true"] {
      cursor: pointer;
    }
    :host([active]) .card {
      box-shadow: var(--shadow-widget), inset 0 0 0 1.5px var(--accent-ring, transparent);
    }
    .card.bleed {
      padding: 0;
      gap: 0;
    }
    :host([data-size="1x1"]) .card {
      --pad: 14px;
    }
    :host([data-size="2x1"]) .card,
    :host([data-size="1x2"]) .card {
      --pad: 17px;
    }
    :host([data-size="2x2"]) .card {
      --pad: 21px;
    }

    .header {
      display: flex;
      align-items: flex-start;
      gap: 12px;
    }
    .icon-btn {
      -webkit-tap-highlight-color: transparent;
      flex: none;
      appearance: none;
      border: none;
      cursor: pointer;
      width: 46px;
      height: 46px;
      min-width: 44px;
      min-height: 44px;
      border-radius: var(--radius-icon);
      display: grid;
      place-items: center;
      background: var(--icon-bg, var(--idle-bg));
      color: var(--icon-fg, var(--idle-fg));
      transition: background var(--motion-state) var(--ease-standard),
        color var(--motion-state) var(--ease-standard), transform var(--motion-press) var(--ease-standard);
    }
    .icon-btn[data-interactive="true"]:active {
      transform: scale(0.9);
    }
    .icon-btn[data-interactive="false"] {
      cursor: default;
    }
    .icon-btn:focus-visible {
      outline: none;
      box-shadow: var(--focus-ring);
    }
    .icon-btn.pending {
      animation: pulse 1s ease-in-out infinite;
    }
    .icon-btn.success {
      --icon-bg: var(--state-eco-soft);
      --icon-fg: var(--state-eco);
    }
    .icon-btn.error {
      --icon-bg: var(--state-alert-soft);
      --icon-fg: var(--state-alert);
    }
    @keyframes pulse {
      50% {
        opacity: 0.55;
      }
    }
    @media (prefers-reduced-motion: reduce) {
      .icon-btn.pending {
        animation: none;
        opacity: 0.7;
      }
      .icon-btn[data-interactive="true"]:active {
        transform: none;
      }
    }

    .titles {
      -webkit-tap-highlight-color: transparent;
      appearance: none;
      border: none;
      background: none;
      text-align: left;
      padding: 2px 0 0;
      margin: 0;
      flex: 1;
      min-width: 0;
      display: flex;
      flex-direction: column;
      gap: 2px;
      color: inherit;
      border-radius: 8px;
    }
    button.titles {
      cursor: pointer;
    }
    button.titles:focus-visible {
      outline: none;
      box-shadow: var(--focus-ring);
    }
    .name {
      font: var(--text-widget-title);
      color: var(--text-primary);
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    .state {
      font: var(--text-secondary-state);
      color: var(--state-color, var(--text-secondary));
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    .secondary {
      font: var(--text-meta);
      color: var(--text-tertiary);
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    .badge {
      flex: none;
      display: flex;
      align-items: center;
      gap: 6px;
    }
    .chev {
      color: var(--text-tertiary);
      opacity: 0.7;
    }
    .body {
      flex: 1;
      min-height: 0;
      display: flex;
      flex-direction: column;
      justify-content: flex-end;
      gap: 10px;
    }
    :host([data-size="1x1"]) .body {
      gap: 6px;
    }
    :host([unavailable]) .card {
      opacity: 0.72;
    }
    ::slotted(*) {
      min-width: 0;
    }

    /* ---- Homey device tile: icon TL · accessory TR · name at the bottom ---- */
    .card.tile {
      justify-content: space-between;
      gap: 10px;
    }
    .tile-top {
      display: flex;
      align-items: flex-start;
      justify-content: space-between;
      gap: 8px;
    }
    .accessory {
      flex: none;
      display: flex;
      align-items: center;
      gap: 6px;
      min-height: 24px;
    }
    .dot {
      width: 12px;
      height: 12px;
      border-radius: var(--radius-pill);
      background: var(--accent-ring, var(--idle-fg));
    }
    .tile-foot {
      display: flex;
      flex-direction: column;
      gap: 2px;
      text-align: left;
      appearance: none;
      border: none;
      background: none;
      padding: 0;
      margin: 0;
      color: inherit;
      border-radius: 8px;
      min-width: 0;
    }
    button.tile-foot {
      cursor: pointer;
    }
    button.tile-foot:focus-visible {
      outline: none;
      box-shadow: var(--focus-ring);
    }
    .card.tile .name {
      white-space: normal;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
    }

    /* ---- Read-only value tile: label · big value · right-hand icon circle ---- */
    .card.value {
      flex-direction: row;
      align-items: center;
      justify-content: space-between;
      gap: 12px;
    }
    .val-main {
      display: flex;
      flex-direction: column;
      gap: 3px;
      min-width: 0;
      flex: 1;
      text-align: left;
      appearance: none;
      border: none;
      background: none;
      padding: 0;
      margin: 0;
      color: inherit;
      border-radius: 8px;
    }
    button.val-main {
      cursor: pointer;
    }
    button.val-main:focus-visible {
      outline: none;
      box-shadow: var(--focus-ring);
    }
    .val-label {
      font: var(--text-secondary-state);
      color: var(--text-secondary);
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    .val-value {
      font: var(--text-value);
      color: var(--text-primary);
      font-variant-numeric: tabular-nums;
      display: flex;
      align-items: baseline;
      gap: 4px;
      min-width: 0;
      overflow: hidden;
    }
    .val-value > span {
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    .val-icon {
      flex: none;
      width: 44px;
      height: 44px;
      border-radius: var(--radius-pill);
      display: grid;
      place-items: center;
      background: var(--icon-bg, var(--idle-bg));
      color: var(--icon-fg, var(--idle-fg));
    }
  `;
P([
  m({ type: String })
], k.prototype, "icon", 2);
P([
  m({ type: String })
], k.prototype, "name", 2);
P([
  m({ type: String })
], k.prototype, "stateText", 2);
P([
  m({ type: String })
], k.prototype, "secondary", 2);
P([
  m({ type: String })
], k.prototype, "size", 2);
P([
  m({ type: String })
], k.prototype, "accent", 2);
P([
  m({ type: String })
], k.prototype, "glyphColor", 2);
P([
  m({ type: Boolean, reflect: !0 })
], k.prototype, "active", 2);
P([
  m({ type: Boolean, reflect: !0 })
], k.prototype, "unavailable", 2);
P([
  m({ type: Boolean })
], k.prototype, "hasDetail", 2);
P([
  m({ type: String })
], k.prototype, "quickKind", 2);
P([
  m({ type: String })
], k.prototype, "quickLabel", 2);
P([
  m({ type: String })
], k.prototype, "actionState", 2);
P([
  m({ type: Boolean })
], k.prototype, "bleed", 2);
P([
  m({ type: String })
], k.prototype, "layout", 2);
k = P([
  b("hd-widget-frame")
], k);
var Ts = Object.defineProperty, Bt = (t, e, i, a) => {
  for (var s = void 0, n = t.length - 1, r; n >= 0; n--)
    (r = t[n]) && (s = r(e, i, s) || s);
  return s && Ts(e, i, s), s;
};
class H extends A {
  constructor() {
    super(...arguments), this.currentSize = "1x1", this.layout = "row", this.actionState = "idle", this._resetTimer = 0;
  }
  get entityId() {
    return this.config?.entity;
  }
  get vm() {
    return y1(this.hass, this.entityId, this.config);
  }
  get isConnected2() {
    return this.hass?.connected !== !1;
  }
  /** Entities whose changes should trigger a re-render (override for composites). */
  relevantEntityIds() {
    return this.entityId ? [this.entityId] : [];
  }
  /** Whether this widget type offers a detail surface. */
  hasDetail() {
    return !0;
  }
  shouldUpdate(e) {
    if (!(e.size === 1 && e.has("hass"))) return !0;
    const i = e.get("hass");
    return !i || !this.hass || i.connected !== this.hass.connected ? !0 : this.relevantEntityIds().some((a) => i.states[a] !== this.hass.states[a]);
  }
  /**
   * Per-widget error boundary. Subclasses implement `renderContent()` instead of
   * `render()`; a throw in that content (a bad attribute, a divide-by-zero in a
   * custom SVG, an unexpected state shape) degrades this one tile to an error
   * card rather than propagating up and blanking the whole view. This is the
   * primary safety net for an always-on display; the grid adds a second net for
   * config/layout throws, and the panel root a best-effort backstop for async
   * throws neither boundary can see.
   */
  render() {
    try {
      return this.renderContent();
    } catch (e) {
      const i = this.config?.id ?? this.config?.type ?? this.entityId ?? "?";
      return console.error(`[hd-widget ${i}] render failed:`, e), this._renderErrorTile();
    }
  }
  /** Neutral, card-styled fallback shown when `renderContent()` throws. */
  _renderErrorTile() {
    const e = this.config?.name || this.config?.entity || "Widget";
    return o`<hd-widget-frame
      icon="mdi:alert-circle-outline"
      .name=${e}
      stateText="Unavailable"
      secondary="Widget error"
      accent="alert"
      .size=${this.currentSize}
      ?unavailable=${!0}
    ></hd-widget-frame>`;
  }
  openDetail() {
    this.hasDetail() && this.dispatchEvent(
      new CustomEvent("hd-open-detail", {
        detail: { entityId: this.entityId, config: this.config, type: this.config.type },
        bubbles: !0,
        composed: !0
      })
    );
  }
  /** Run the widget's default quick action (from the adapter). */
  async runQuick() {
    const e = this.vm, i = e.quickAction;
    if (!(!this.isConnected2 || e.isPlaceholder || !e.exists)) {
      if (i.kind === "none" || !i.call) {
        this.hasDetail() && this.openDetail();
        return;
      }
      if (i.requiresConfirmation) {
        const a = e.domain === "lock" || e.domain === "alarm_control_panel";
        if (!await Xt(this, {
          title: `${i.label} ${e.name}?`,
          confirmLabel: i.label,
          destructive: a,
          icon: e.icon
        })) return;
      }
      await this.callService(i.call, { errorVerb: i.label.toLowerCase() });
    }
  }
  /**
   * Execute a service call with pending/success/error feedback. On failure,
   * surfaces a toast; callers that applied optimistic UI should revert in their
   * own catch (we re-throw the error to allow that).
   */
  async callService(e, i = {}) {
    if (this.hass) {
      window.clearTimeout(this._resetTimer), this.actionState = "pending";
      try {
        await a1(this.hass, e), this.actionState = "success";
      } catch (a) {
        throw this.actionState = "error", jt(this, {
          message: `Couldn't ${i.errorVerb ?? "update"} ${this.vm.name}`,
          tone: "alert",
          icon: "mdi:alert-circle-outline"
        }), this._scheduleReset(), a;
      }
      this._scheduleReset();
    }
  }
  _scheduleReset() {
    this._resetTimer = window.setTimeout(() => {
      this.actionState = "idle";
    }, 850);
  }
  disconnectedCallback() {
    super.disconnectedCallback(), window.clearTimeout(this._resetTimer);
  }
}
Bt([
  m({ attribute: !1 })
], H.prototype, "hass");
Bt([
  m({ attribute: !1 })
], H.prototype, "config");
Bt([
  m({ type: String })
], H.prototype, "currentSize");
Bt([
  m({ type: String })
], H.prototype, "layout");
Bt([
  C()
], H.prototype, "actionState");
var Es = Object.defineProperty, Os = Object.getOwnPropertyDescriptor, z = (t, e, i, a) => {
  for (var s = a > 1 ? void 0 : a ? Os(e, i) : e, n = t.length - 1, r; n >= 0; n--)
    (r = t[n]) && (s = (a ? r(e, i, s) : r(s)) || s);
  return a && s && Es(e, i, s), s;
};
let E = class extends A {
  constructor() {
    super(...arguments), this.value = 0, this.min = 0, this.max = 100, this.step = 1, this.vertical = !1, this.disabled = !1, this.label = "", this.icon = "", this.valueText = "", this.color = "var(--accent)", this._dragging = !1, this._dragValue = 0, this._raf = 0;
  }
  get _current() {
    return this._dragging ? this._dragValue : this.value;
  }
  _ratio() {
    const t = this.max - this.min || 1;
    return Math.min(1, Math.max(0, (this._current - this.min) / t));
  }
  _snap(t) {
    const e = this.max - this.min;
    let i = Math.round((t - this.min) / this.step) * this.step + this.min;
    return i = Math.min(this.max, Math.max(this.min, i)), Math.abs(e) > 0 ? Number(i.toFixed(4)) : i;
  }
  _valueFromPointer(t) {
    const i = this.renderRoot.querySelector(".track").getBoundingClientRect();
    let a;
    return this.vertical ? a = 1 - (t.clientY - i.top) / i.height : a = (t.clientX - i.left) / i.width, a = Math.min(1, Math.max(0, a)), this._snap(this.min + a * (this.max - this.min));
  }
  _onPointerDown(t) {
    this.disabled || (t.preventDefault(), t.target.setPointerCapture(t.pointerId), this._dragging = !0, this._dragValue = this._valueFromPointer(t), this._emit("hd-input"));
  }
  _onPointerMove(t) {
    if (!this._dragging) return;
    const e = this._valueFromPointer(t);
    e !== this._dragValue && (this._dragValue = e, !this._raf && (this._raf = requestAnimationFrame(() => {
      this._raf = 0, this._emit("hd-input");
    })));
  }
  _onPointerUp(t) {
    if (!this._dragging) return;
    this._raf && (cancelAnimationFrame(this._raf), this._raf = 0);
    const e = this._valueFromPointer(t);
    this._dragValue = e, this.value = e, this._dragging = !1, this._emit("hd-change");
  }
  _onKeyDown(t) {
    if (this.disabled) return;
    const e = Math.max(this.step, (this.max - this.min) / 10);
    let i = this.value;
    switch (t.key) {
      case "ArrowUp":
      case "ArrowRight":
        i = this.value + this.step;
        break;
      case "ArrowDown":
      case "ArrowLeft":
        i = this.value - this.step;
        break;
      case "PageUp":
        i = this.value + e;
        break;
      case "PageDown":
        i = this.value - e;
        break;
      case "Home":
        i = this.min;
        break;
      case "End":
        i = this.max;
        break;
      default:
        return;
    }
    t.preventDefault(), i = this._snap(i), i !== this.value && (this.value = i, this._emit("hd-input"), this._emit("hd-change"));
  }
  _emit(t) {
    this.dispatchEvent(
      new CustomEvent(t, { detail: { value: this._current }, bubbles: !0, composed: !0 })
    );
  }
  render() {
    const t = `${this._ratio() * 100}%`;
    return o`
      <div
        class="track"
        role="slider"
        tabindex=${this.disabled ? -1 : 0}
        aria-label=${this.label}
        aria-orientation=${this.vertical ? "vertical" : "horizontal"}
        aria-valuemin=${this.min}
        aria-valuemax=${this.max}
        aria-valuenow=${Math.round(this._current)}
        aria-valuetext=${this.valueText || String(Math.round(this._current))}
        aria-disabled=${this.disabled ? "true" : "false"}
        style=${`--fill:${t};--fill-color:${this.color}`}
        @pointerdown=${this._onPointerDown}
        @pointermove=${this._onPointerMove}
        @pointerup=${this._onPointerUp}
        @pointercancel=${this._onPointerUp}
        @keydown=${this._onKeyDown}
      >
        <div class="fill"></div>
        <div class="content">
          ${this.icon ? o`<hd-icon .icon=${this.icon} .size=${20}></hd-icon>` : d}
          ${this.valueText ? o`<span class="val">${this.valueText}</span>` : d}
        </div>
      </div>
    `;
  }
};
E.styles = x`
    :host {
      display: block;
      touch-action: none;
      -webkit-tap-highlight-color: transparent;
    }
    .track {
      position: relative;
      width: 100%;
      height: 46px;
      border-radius: var(--radius-control);
      background: var(--surface-sunken);
      box-shadow: var(--shadow-inset-control);
      overflow: hidden;
      cursor: pointer;
      outline: none;
    }
    :host([vertical]) .track {
      width: 58px;
      height: 100%;
      min-height: 120px;
    }
    .fill {
      position: absolute;
      inset: 0 auto 0 0;
      width: var(--fill, 0%);
      background: var(--fill-color, var(--accent));
      transition: width var(--motion-state) var(--ease-standard),
        height var(--motion-state) var(--ease-standard);
    }
    :host([vertical]) .fill {
      inset: auto 0 0 0;
      width: auto;
      height: var(--fill, 0%);
    }
    :host([dragging]) .fill {
      transition: none;
    }
    .content {
      position: absolute;
      inset: 0;
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 0 14px;
      pointer-events: none;
      color: var(--text-primary);
      font: var(--text-secondary-state);
      mix-blend-mode: normal;
    }
    :host([vertical]) .content {
      flex-direction: column-reverse;
      justify-content: flex-start;
      padding: 12px 0;
      text-align: center;
    }
    .val {
      font-variant-numeric: tabular-nums;
      font-weight: 650;
    }
    .track:focus-visible {
      box-shadow: var(--focus-ring), var(--shadow-inset-control);
    }
    :host([disabled]) {
      opacity: 0.45;
      pointer-events: none;
    }
  `;
z([
  m({ type: Number })
], E.prototype, "value", 2);
z([
  m({ type: Number })
], E.prototype, "min", 2);
z([
  m({ type: Number })
], E.prototype, "max", 2);
z([
  m({ type: Number })
], E.prototype, "step", 2);
z([
  m({ type: Boolean, reflect: !0 })
], E.prototype, "vertical", 2);
z([
  m({ type: Boolean, reflect: !0 })
], E.prototype, "disabled", 2);
z([
  m({ type: String })
], E.prototype, "label", 2);
z([
  m({ type: String })
], E.prototype, "icon", 2);
z([
  m({ type: String })
], E.prototype, "valueText", 2);
z([
  m({ type: String })
], E.prototype, "color", 2);
z([
  C()
], E.prototype, "_dragging", 2);
z([
  C()
], E.prototype, "_dragValue", 2);
E = z([
  b("hd-slider")
], E);
var zs = Object.defineProperty, Ds = Object.getOwnPropertyDescriptor, x1 = (t, e, i, a) => {
  for (var s = a > 1 ? void 0 : a ? Ds(e, i) : e, n = t.length - 1, r; n >= 0; n--)
    (r = t[n]) && (s = (a ? r(e, i, s) : r(s)) || s);
  return a && s && zs(e, i, s), s;
};
let ce = class extends H {
  constructor() {
    super(...arguments), this._optimistic = null, this._optimisticTs = 0, this._debounce = 0;
  }
  get _displayLevel() {
    const t = this.vm, e = t.level ?? (t.active ? 100 : 0);
    return this._optimistic != null ? Math.abs(e - this._optimistic) <= 3 || Date.now() - this._optimisticTs > 1600 ? (this._optimistic = null, e) : this._optimistic : e;
  }
  _onInput(t) {
    this._optimistic = t, this._optimisticTs = Date.now(), window.clearTimeout(this._debounce), this._debounce = window.setTimeout(() => {
      this.entityId && this.callService(Re(this.entityId, t), { errorVerb: "dim" });
    }, 180);
  }
  _onChange(t) {
    this._optimistic = t, this._optimisticTs = Date.now(), window.clearTimeout(this._debounce), this.entityId && this.callService(Re(this.entityId, t), { errorVerb: "dim" });
  }
  _onTemp(t) {
    this.entityId && this.callService(gt(this.entityId, { colorTempKelvin: t }), {
      errorVerb: "set color of"
    });
  }
  _renderBrightness(t) {
    const e = this.vm, i = this._displayLevel, a = !e.available || !e.active;
    return o`<hd-slider
      class=${t ? "vert" : ""}
      .vertical=${t}
      .value=${i}
      .min=${1}
      .max=${100}
      .step=${1}
      .disabled=${a}
      .valueText=${e.active ? `${Math.round(i)}%` : "Off"}
      .icon=${"mdi:brightness-6"}
      .color=${e.rgbCss || "var(--state-light)"}
      label=${`Brightness of ${e.name}`}
      @hd-input=${(s) => this._onInput(s.detail.value)}
      @hd-change=${(s) => this._onChange(s.detail.value)}
    ></hd-slider>`;
  }
  _renderTemp() {
    const t = this.vm, e = t.stateObj, i = e?.attributes.min_color_temp_kelvin ?? 2200, a = e?.attributes.max_color_temp_kelvin ?? 6500, s = e?.attributes.color_temp_kelvin ?? Math.round((i + a) / 2);
    return o`<div class="temp-row">
      <span class="temp-label">Warm</span>
      <hd-slider
        style="flex:1"
        .value=${s}
        .min=${i}
        .max=${a}
        .step=${50}
        .disabled=${!t.active}
        .color=${"linear-gradient(90deg,#ffb85c,#fff5e8)"}
        label=${`Color temperature of ${t.name}`}
        @hd-change=${(n) => this._onTemp(n.detail.value)}
      ></hd-slider>
      <span class="temp-label">Cool</span>
    </div>`;
  }
  renderContent() {
    const t = this.vm, e = Gi(t.stateObj), i = this.currentSize, a = e.brightness && (i === "2x1" || i === "1x2" || i === "2x2"), s = i === "1x2", n = e.colorTemp && i === "2x2";
    return o`
      <hd-widget-frame
        .icon=${t.icon}
        .layout=${this.layout}
        .name=${t.name}
        .stateText=${t.displayState}
        .size=${i}
        .accent=${t.accent}
        .glyphColor=${t.rgbCss || ""}
        .active=${t.active}
        .unavailable=${!t.available}
        .hasDetail=${!0}
        .quickKind=${"toggle"}
        .quickLabel=${t.quickAction.label}
        .actionState=${this.actionState}
        @hd-quick=${() => this.runQuick()}
        @hd-activate=${() => this.openDetail()}
      >
        ${a ? o`<div class="col">
              ${s ? this._renderBrightness(!0) : d}
              ${s ? d : this._renderBrightness(!1)}
              ${n ? this._renderTemp() : d}
            </div>` : d}
      </hd-widget-frame>
    `;
  }
  disconnectedCallback() {
    super.disconnectedCallback(), window.clearTimeout(this._debounce);
  }
};
ce.styles = x`
    .col {
      display: flex;
      flex-direction: column;
      gap: 12px;
      height: 100%;
    }
    .vert {
      flex: 1;
      min-height: 120px;
    }
    .temp-row {
      display: flex;
      align-items: center;
      gap: 10px;
    }
    .temp-label {
      font: var(--text-meta);
      color: var(--text-tertiary);
      flex: none;
    }
  `;
x1([
  C()
], ce.prototype, "_optimistic", 2);
ce = x1([
  b("hd-widget-light")
], ce);
var Is = Object.getOwnPropertyDescriptor, Y = (t, e, i, a) => {
  for (var s = a > 1 ? void 0 : a ? Is(e, i) : e, n = t.length - 1, r; n >= 0; n--)
    (r = t[n]) && (s = r(s) || s);
  return s;
};
function Ce(t, e) {
  const i = t.vm;
  return o`<hd-widget-frame
    .icon=${i.icon}
    .name=${i.name}
    .stateText=${i.displayState}
    .secondary=${i.secondary ?? ""}
    .size=${t.currentSize}
    .layout=${t.layout}
    .accent=${i.accent}
    .active=${i.active}
    .unavailable=${!i.available}
    .hasDetail=${e.hasDetail}
    .quickKind=${e.quickKind}
    .quickLabel=${i.quickAction.label}
    .actionState=${t.actionState}
    @hd-quick=${() => t.runQuick()}
    @hd-activate=${() => t.openDetail()}
  ></hd-widget-frame>`;
}
let Hi = class extends H {
  renderContent() {
    return Ce(this, { quickKind: "toggle", hasDetail: !0 });
  }
};
Hi = Y([
  b("hd-widget-switch")
], Hi);
let Li = class extends H {
  renderContent() {
    return Ce(this, { quickKind: "toggle", hasDetail: !0 });
  }
};
Li = Y([
  b("hd-widget-lock")
], Li);
let Vi = class extends H {
  renderContent() {
    return Ce(this, { quickKind: "none", hasDetail: !0 });
  }
};
Vi = Y([
  b("hd-widget-person")
], Vi);
let Mi = class extends H {
  renderContent() {
    return Ce(this, { quickKind: "none", hasDetail: !0 });
  }
};
Mi = Y([
  b("hd-widget-binary")
], Mi);
class ii extends H {
  hasDetail() {
    return !1;
  }
  async activate() {
    const e = this.vm, i = e.quickAction;
    if (!(!i.call || !this.isConnected2) && !(i.requiresConfirmation && !await Xt(this, { title: `${i.label} ${e.name}?`, confirmLabel: i.label })))
      try {
        await this.callService(i.call, { errorVerb: i.label.toLowerCase() }), jt(this, { message: `${e.name} — ${i.label.toLowerCase()}`, tone: "eco", icon: "mdi:check" });
      } catch {
      }
  }
  renderContent() {
    const e = this.vm;
    return o`<hd-widget-frame
      .icon=${e.icon}
      .name=${e.name}
      .stateText=${e.displayState}
      .size=${this.currentSize}
      .layout=${this.layout}
      .accent=${e.accent}
      .active=${e.active}
      .unavailable=${!e.available}
      .hasDetail=${!1}
      .quickKind=${"activate"}
      .quickLabel=${e.quickAction.label}
      .actionState=${this.actionState}
      @hd-quick=${() => this.activate()}
    ></hd-widget-frame>`;
  }
}
let ki = class extends ii {
};
ki = Y([
  b("hd-widget-scene")
], ki);
let Si = class extends ii {
};
Si = Y([
  b("hd-widget-script")
], Si);
let Pi = class extends ii {
};
Pi = Y([
  b("hd-widget-button")
], Pi);
let Ti = class extends H {
  hasDetail() {
    return !1;
  }
  relevantEntityIds() {
    return [];
  }
  async _run() {
    const t = this.config.options ?? {};
    if (!t.service || !this.hass) return;
    const [e, i] = t.service.split(".");
    if (!(!e || !i) && !(this.config.requiresConfirmation && !await Xt(this, {
      title: `${this.config.name ?? "Run"}?`,
      confirmLabel: this.config.name ?? "Run"
    }))) {
      this.actionState = "pending";
      try {
        await this.hass.callService(e, i, { ...t.data ?? {}, ...t.target ?? {} }), this.actionState = "success", jt(this, { message: `${this.config.name ?? "Done"}`, tone: "eco", icon: "mdi:check" });
      } catch {
        this.actionState = "error", jt(this, { message: `Couldn't run ${this.config.name ?? "action"}`, tone: "alert", icon: "mdi:alert-circle-outline" });
      } finally {
        window.setTimeout(() => this.actionState = "idle", 850);
      }
    }
  }
  renderContent() {
    const t = this.config.name ?? "Action", e = this.config.icon ?? "mdi:gesture-tap-button";
    return o`<hd-widget-frame
      .icon=${e}
      .name=${t}
      .stateText=${"Tap to run"}
      .size=${this.currentSize}
      .layout=${this.layout}
      .accent=${"accent"}
      .active=${!1}
      .hasDetail=${!1}
      .quickKind=${"activate"}
      .quickLabel=${t}
      .actionState=${this.actionState}
      @hd-quick=${() => this._run()}
    ></hd-widget-frame>`;
  }
};
Ti = Y([
  b("hd-widget-action")
], Ti);
async function ai(t, e, i = 24) {
  const a = /* @__PURE__ */ new Date(), s = new Date(a.getTime() - i * 3600 * 1e3);
  try {
    return ((await t.callWS({
      type: "history/history_during_period",
      start_time: s.toISOString(),
      end_time: a.toISOString(),
      entity_ids: [e],
      minimal_response: !0,
      no_attributes: !0
    }))?.[e] ?? []).map((c) => ({
      t: (c.lu ?? c.lc ?? 0) * 1e3,
      value: Number(c.s ?? c.state)
    })).filter((c) => Number.isFinite(c.value) && c.t > 0);
  } catch {
    try {
      const n = `history/period/${s.toISOString()}?filter_entity_id=${encodeURIComponent(
        e
      )}&minimal_response&no_attributes&end_time=${encodeURIComponent(a.toISOString())}`;
      return ((await t.callApi("GET", n))?.[0] ?? []).map((l) => ({ t: new Date(l.last_updated).getTime(), value: Number(l.state) })).filter((l) => Number.isFinite(l.value) && l.t > 0);
    } catch {
      return [];
    }
  }
}
var Rs = Object.defineProperty, Zs = Object.getOwnPropertyDescriptor, S = (t, e, i, a) => {
  for (var s = a > 1 ? void 0 : a ? Zs(e, i) : e, n = t.length - 1, r; n >= 0; n--)
    (r = t[n]) && (s = (a ? r(e, i, s) : r(s)) || s);
  return a && s && Rs(e, i, s), s;
};
let vt = class extends A {
  constructor() {
    super(...arguments), this.value = 0, this.color = "var(--accent)", this.label = "";
  }
  render() {
    const t = Math.min(100, Math.max(0, this.value));
    return o`<div
      class="rail"
      role="progressbar"
      aria-label=${this.label}
      aria-valuenow=${Math.round(t)}
      aria-valuemin="0"
      aria-valuemax="100"
    >
      <div class="bar" style=${`width:${t}%;--bar-color:${this.color}`}></div>
    </div>`;
  }
};
vt.styles = x`
    :host {
      display: block;
    }
    .rail {
      height: 8px;
      border-radius: var(--radius-pill);
      background: var(--surface-sunken);
      overflow: hidden;
    }
    .bar {
      height: 100%;
      border-radius: var(--radius-pill);
      background: var(--bar-color, var(--accent));
      transition: width var(--motion-state) var(--ease-standard);
    }
  `;
S([
  m({ type: Number })
], vt.prototype, "value", 2);
S([
  m({ type: String })
], vt.prototype, "color", 2);
S([
  m({ type: String })
], vt.prototype, "label", 2);
vt = S([
  b("hd-progress")
], vt);
let bt = class extends A {
  constructor() {
    super(...arguments), this.icon = "", this.text = "", this.tone = "neutral";
  }
  render() {
    return o`<span class="badge"
      >${this.icon ? o`<hd-icon .icon=${this.icon} .size=${14}></hd-icon>` : d}
      ${this.text ? o`<span>${this.text}</span>` : d}</span
    >`;
  }
};
bt.styles = x`
    :host {
      display: inline-flex;
    }
    .badge {
      display: inline-flex;
      align-items: center;
      gap: 5px;
      padding: 4px 9px;
      border-radius: var(--radius-pill);
      font: var(--text-meta);
      font-weight: 600;
      background: var(--idle-bg);
      color: var(--text-secondary);
      max-width: 100%;
    }
    .badge span {
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    :host([tone="eco"]) .badge {
      background: var(--state-eco-soft);
      color: var(--state-eco);
    }
    :host([tone="warn"]) .badge {
      background: var(--state-warn-soft);
      color: var(--state-warn);
    }
    :host([tone="alert"]) .badge {
      background: var(--state-alert-soft);
      color: var(--state-alert);
    }
    :host([tone="accent"]) .badge {
      background: var(--accent-soft);
      color: var(--accent-text);
    }
  `;
S([
  m({ type: String })
], bt.prototype, "icon", 2);
S([
  m({ type: String })
], bt.prototype, "text", 2);
S([
  m({ type: String })
], bt.prototype, "tone", 2);
bt = S([
  b("hd-status-badge")
], bt);
let yt = class extends A {
  constructor() {
    super(...arguments), this.w = "100%", this.h = "16px", this.radius = "8px";
  }
  render() {
    return o`<div class="sk" style=${`--w:${this.w};--h:${this.h};--r:${this.radius}`}></div>`;
  }
};
yt.styles = x`
    :host {
      display: block;
    }
    .sk {
      width: var(--w);
      height: var(--h);
      border-radius: var(--r);
      background: linear-gradient(
        100deg,
        var(--surface-subtle) 30%,
        var(--surface-hover) 50%,
        var(--surface-subtle) 70%
      );
      background-size: 200% 100%;
      animation: shimmer 1.4s ease-in-out infinite;
    }
    @keyframes shimmer {
      to {
        background-position: -200% 0;
      }
    }
    @media (prefers-reduced-motion: reduce) {
      .sk {
        animation: none;
        background: var(--surface-subtle);
      }
    }
  `;
S([
  m({ type: String })
], yt.prototype, "w", 2);
S([
  m({ type: String })
], yt.prototype, "h", 2);
S([
  m({ type: String })
], yt.prototype, "radius", 2);
yt = S([
  b("hd-skeleton")
], yt);
let nt = class extends A {
  constructor() {
    super(...arguments), this.points = [], this.color = "var(--accent)", this.area = !0, this.summary = "";
  }
  render() {
    const t = this.points.filter((u) => Number.isFinite(u));
    if (t.length < 2)
      return o`<svg viewBox="0 0 100 32" preserveAspectRatio="none" aria-label=${this.summary}></svg>`;
    const e = Math.min(...t), a = Math.max(...t) - e || 1, s = 100, n = 32, r = s / (t.length - 1), l = t.map((u, p) => {
      const f = p * r, g = n - (u - e) / a * (n - 4) - 2;
      return [f, g];
    }).map(([u, p], f) => `${f === 0 ? "M" : "L"}${u.toFixed(2)},${p.toFixed(2)}`).join(" "), h = `${l} L${s},${n} L0,${n} Z`;
    return o`<svg viewBox="0 0 ${s} ${n}" preserveAspectRatio="none" role="img" aria-label=${this.summary}
      style=${`--trend-color:${this.color}`}
      >${this.area ? Ft`<path class="fill" d=${h}></path>` : d}
      ${Ft`<path class="line" d=${l}></path>`}</svg
    >`;
  }
};
nt.styles = x`
    :host {
      display: block;
      width: 100%;
    }
    svg {
      display: block;
      width: 100%;
      height: 100%;
      overflow: visible;
    }
    .line {
      fill: none;
      stroke: var(--trend-color, var(--accent));
      stroke-width: 2.5;
      stroke-linecap: round;
      stroke-linejoin: round;
      vector-effect: non-scaling-stroke;
    }
    .fill {
      fill: var(--trend-color, var(--accent));
      opacity: 0.14;
    }
  `;
S([
  m({ attribute: !1 })
], nt.prototype, "points", 2);
S([
  m({ type: String })
], nt.prototype, "color", 2);
S([
  m({ type: Boolean })
], nt.prototype, "area", 2);
S([
  m({ type: String })
], nt.prototype, "summary", 2);
nt = S([
  b("hd-trend")
], nt);
var qs = Object.defineProperty, Fs = Object.getOwnPropertyDescriptor, C1 = (t, e, i, a) => {
  for (var s = a > 1 ? void 0 : a ? Fs(e, i) : e, n = t.length - 1, r; n >= 0; n--)
    (r = t[n]) && (s = (a ? r(e, i, s) : r(s)) || s);
  return a && s && qs(e, i, s), s;
};
let le = class extends H {
  constructor() {
    super(...arguments), this._trend = [], this._fetchedFor = "";
  }
  get _isBig() {
    return this.currentSize === "2x2" || this.currentSize === "1x2";
  }
  updated() {
    if (this._isBig && this.entityId && this.hass?.connected && this._fetchedFor !== this.entityId) {
      const t = this.hass.states[this.entityId];
      t && Number.isFinite(Number(t.state)) && (this._fetchedFor = this.entityId, this._loadTrend());
    }
    this._isBig ? this.setAttribute("data-big", "") : this.removeAttribute("data-big");
  }
  async _loadTrend() {
    if (!this.hass || !this.entityId) return;
    const t = await ai(this.hass, this.entityId, 24);
    this._trend = t.map((e) => e.value);
  }
  renderContent() {
    const t = this.vm, e = t.stateObj, i = e ? Number(e.state) : NaN, a = Number.isFinite(i) && e.state.trim() !== "", s = e?.attributes.unit_of_measurement, n = w1(t.accent), r = t.available ? a ? o`<div class="value">
            <span>${Ns(i)}</span>${s ? o`<span class="unit">${s}</span>` : d}
          </div>` : o`<div class="value"><span class="txt">${t.displayState}</span></div>` : o`<div class="value"><span class="txt">${t.displayState}</span></div>`;
    return o`
      <hd-widget-frame
        .icon=${t.icon}
        .layout=${this.layout}
        .name=${t.name}
        .stateText=${""}
        .size=${this.currentSize}
        .accent=${t.accent}
        .active=${!1}
        .unavailable=${!t.available}
        .hasDetail=${!0}
        .quickKind=${"none"}
        @hd-activate=${() => this.openDetail()}
      >
        ${r}
        ${this._isBig && a && this._trend.length > 1 ? o`<div class="trend">
              <hd-trend
                .points=${this._trend}
                .color=${n.fg}
                .summary=${`24 hour trend for ${t.name}`}
              ></hd-trend>
            </div>` : d}
      </hd-widget-frame>
    `;
  }
};
le.styles = x`
    .value {
      font: var(--text-value);
      color: var(--text-primary);
      font-variant-numeric: tabular-nums;
      display: flex;
      align-items: baseline;
      gap: 4px;
      overflow: hidden;
    }
    :host([data-big]) .value {
      font: var(--text-value-lg);
    }
    .value .unit {
      font: var(--text-widget-title);
      color: var(--text-secondary);
      font-weight: 600;
    }
    .value .txt {
      font: var(--text-widget-title);
      font-weight: 650;
      line-height: 1.25;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
      white-space: normal;
    }
    .trend {
      height: 46px;
      margin-top: 6px;
    }
  `;
C1([
  C()
], le.prototype, "_trend", 2);
le = C1([
  b("hd-widget-sensor")
], le);
function Ns(t) {
  const e = Math.abs(t), i = e >= 100 ? 0 : e >= 10 ? 1 : 2;
  try {
    return new Intl.NumberFormat(void 0, { maximumFractionDigits: i }).format(t);
  } catch {
    return t.toFixed(i);
  }
}
var Us = Object.defineProperty, js = Object.getOwnPropertyDescriptor, Yt = (t, e, i, a) => {
  for (var s = a > 1 ? void 0 : a ? js(e, i) : e, n = t.length - 1, r; n >= 0; n--)
    (r = t[n]) && (s = (a ? r(e, i, s) : r(s)) || s);
  return a && s && Us(e, i, s), s;
};
let rt = class extends A {
  constructor() {
    super(...arguments), this.options = [], this.value = "", this.disabled = !1, this.label = "";
  }
  _select(t) {
    this.disabled || t === this.value || (this.value = t, this.dispatchEvent(new CustomEvent("hd-select", { detail: { value: t }, bubbles: !0, composed: !0 })));
  }
  _onKey(t, e) {
    if (t.key !== "ArrowLeft" && t.key !== "ArrowRight") return;
    t.preventDefault();
    const i = t.key === "ArrowRight" ? 1 : -1, a = (e + i + this.options.length) % this.options.length, s = this.options[a];
    this._select(s.value), this.renderRoot.querySelectorAll("button")[a]?.focus();
  }
  render() {
    return o`
      <div class="group" role="radiogroup" aria-label=${this.label}>
        ${this.options.map(
      (t, e) => o`
            <button
              role="radio"
              aria-checked=${t.value === this.value ? "true" : "false"}
              tabindex=${t.value === this.value ? 0 : -1}
              @click=${() => this._select(t.value)}
              @keydown=${(i) => this._onKey(i, e)}
            >
              ${t.icon ? o`<hd-icon .icon=${t.icon} .size=${18}></hd-icon>` : d}
              ${t.label ? o`<span>${t.label}</span>` : d}
            </button>
          `
    )}
      </div>
    `;
  }
};
rt.styles = x`
    :host {
      display: block;
    }
    .group {
      display: flex;
      gap: 4px;
      padding: 4px;
      background: var(--surface-sunken);
      border-radius: var(--radius-pill);
      flex-wrap: wrap;
    }
    button {
      -webkit-tap-highlight-color: transparent;
      appearance: none;
      border: none;
      cursor: pointer;
      flex: 1 1 auto;
      min-height: 40px;
      padding: 0 14px;
      border-radius: var(--radius-pill);
      background: transparent;
      color: var(--text-secondary);
      font: var(--text-secondary-state);
      font-weight: 600;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 6px;
      white-space: nowrap;
      transition: background var(--motion-state) var(--ease-standard),
        color var(--motion-state) var(--ease-standard);
    }
    button[aria-checked="true"] {
      background: var(--surface);
      color: var(--text-primary);
      box-shadow: var(--shadow-widget);
    }
    button:hover:not([aria-checked="true"]) {
      color: var(--text-primary);
    }
    button:focus-visible {
      outline: none;
      box-shadow: var(--focus-ring);
    }
    :host([disabled]) {
      opacity: 0.5;
      pointer-events: none;
    }
  `;
Yt([
  m({ attribute: !1 })
], rt.prototype, "options", 2);
Yt([
  m({ type: String })
], rt.prototype, "value", 2);
Yt([
  m({ type: Boolean, reflect: !0 })
], rt.prototype, "disabled", 2);
Yt([
  m({ type: String })
], rt.prototype, "label", 2);
rt = Yt([
  b("hd-segmented")
], rt);
var Ks = Object.defineProperty, Ws = Object.getOwnPropertyDescriptor, _1 = (t, e, i, a) => {
  for (var s = a > 1 ? void 0 : a ? Ws(e, i) : e, n = t.length - 1, r; n >= 0; n--)
    (r = t[n]) && (s = (a ? r(e, i, s) : r(s)) || s);
  return a && s && Ks(e, i, s), s;
};
const Xs = {
  off: "mdi:power",
  heat: "mdi:fire",
  cool: "mdi:snowflake",
  heat_cool: "mdi:thermostat-auto",
  auto: "mdi:thermostat-auto",
  dry: "mdi:water-percent",
  fan_only: "mdi:fan"
};
let de = class extends H {
  constructor() {
    super(...arguments), this._optimisticTarget = null, this._optimisticTs = 0, this._debounce = 0;
  }
  get _target() {
    const e = this.vm.stateObj?.attributes.temperature ?? 20;
    return this._optimisticTarget != null ? this._optimisticTarget === e || Date.now() - this._optimisticTs > 1600 ? (this._optimisticTarget = null, e) : this._optimisticTarget : e;
  }
  _step(t) {
    const e = this.vm;
    if (!e.available || e.rawState === "off") return;
    const i = e.stateObj?.attributes.target_temp_step ?? 0.5, a = e.stateObj?.attributes.min_temp ?? 7, s = e.stateObj?.attributes.max_temp ?? 35, n = Math.min(s, Math.max(a, this._target + t * i));
    this._optimisticTarget = Number(n.toFixed(1)), this._optimisticTs = Date.now(), this.requestUpdate(), window.clearTimeout(this._debounce), this._debounce = window.setTimeout(() => {
      this.entityId && this.callService(r1(this.entityId, this._optimisticTarget), {
        errorVerb: "set temperature for"
      });
    }, 350);
  }
  _setMode(t) {
    this.entityId && this.callService(o1(this.entityId, t), { errorVerb: "set mode for" });
  }
  _renderStepper(t) {
    const e = this.vm, i = e.rawState === "off", a = e.stateObj?.attributes.current_temperature;
    return o`<div>
      <div class="stepper ${t ? "center" : ""}">
        <hd-icon-button
          icon="mdi:minus"
          label="Lower target temperature"
          variant="soft"
          .disabled=${i || !e.available}
          @click=${() => this._step(-1)}
        ></hd-icon-button>
        <span class="target">${i ? "—" : `${$(this._target)}°`}</span>
        <hd-icon-button
          icon="mdi:plus"
          label="Raise target temperature"
          variant="soft"
          .disabled=${i || !e.available}
          @click=${() => this._step(1)}
        ></hd-icon-button>
      </div>
      ${a != null ? o`<div class="now">Now ${$(a)}°</div>` : d}
    </div>`;
  }
  _renderModes() {
    const t = this.vm, e = t.stateObj?.attributes.hvac_modes ?? [];
    if (e.length < 2) return d;
    const i = e.map((a) => ({ value: a, icon: Xs[a] ?? "mdi:thermostat" }));
    return o`<div class="modes">
      <hd-segmented
        .options=${i}
        .value=${t.rawState}
        .disabled=${!t.available}
        label="HVAC mode"
        @hd-select=${(a) => this._setMode(a.detail.value)}
      ></hd-segmented>
    </div>`;
  }
  renderContent() {
    const t = this.vm, e = this.currentSize, a = t1(t.stateObj).targetTemp, s = e === "2x2";
    return o`
      <hd-widget-frame
        .icon=${t.icon}
        .layout=${this.layout}
        .name=${t.name}
        .stateText=${V(t.rawState)}
        .secondary=${t.secondary ?? ""}
        .size=${e}
        .accent=${t.accent}
        .active=${t.active}
        .unavailable=${!t.available}
        .hasDetail=${!0}
        .quickKind=${"none"}
        @hd-activate=${() => this.openDetail()}
      >
        ${a ? this._renderStepper(s) : d}
        ${s ? this._renderModes() : d}
      </hd-widget-frame>
    `;
  }
  disconnectedCallback() {
    super.disconnectedCallback(), window.clearTimeout(this._debounce);
  }
};
de.styles = x`
    .stepper {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 8px;
    }
    .stepper.center {
      justify-content: center;
      gap: 16px;
    }
    .target {
      font: var(--text-value-lg);
      font-variant-numeric: tabular-nums;
      color: var(--text-primary);
      min-width: 4ch;
      text-align: center;
    }
    .now {
      font: var(--text-meta);
      color: var(--text-tertiary);
      text-align: center;
    }
    .modes {
      margin-top: 4px;
    }
  `;
_1([
  C()
], de.prototype, "_optimisticTarget", 2);
de = _1([
  b("hd-widget-climate")
], de);
var Bs = Object.defineProperty, Ys = Object.getOwnPropertyDescriptor, $1 = (t, e, i, a) => {
  for (var s = a > 1 ? void 0 : a ? Ys(e, i) : e, n = t.length - 1, r; n >= 0; n--)
    (r = t[n]) && (s = (a ? r(e, i, s) : r(s)) || s);
  return a && s && Bs(e, i, s), s;
};
let he = class extends H {
  constructor() {
    super(...arguments), this._optimistic = null, this._optimisticTs = 0, this._debounce = 0;
  }
  get _position() {
    const t = this.vm, e = t.stateObj?.attributes.current_position ?? (t.rawState === "open" ? 100 : 0);
    return this._optimistic != null ? Math.abs(e - this._optimistic) <= 2 || Date.now() - this._optimisticTs > 1600 ? (this._optimistic = null, e) : this._optimistic : e;
  }
  _setPosition(t, e) {
    this._optimistic = t, this._optimisticTs = Date.now(), window.clearTimeout(this._debounce);
    const i = () => {
      this.entityId && this.callService(h1(this.entityId, t), { errorVerb: "move" });
    };
    e ? i() : this._debounce = window.setTimeout(i, 200);
  }
  _buttons(t, e) {
    const a = !this.vm.available;
    return o`<div class="controls ${e ? "center" : ""}">
      ${t.open ? o`<hd-icon-button
            icon="mdi:arrow-up"
            label="Open"
            variant="soft"
            .disabled=${a}
            @click=${() => this.entityId && this.callService(c1(this.entityId), { errorVerb: "open" })}
          ></hd-icon-button>` : d}
      ${t.stop ? o`<hd-icon-button
            icon="mdi:stop"
            label="Stop"
            variant="soft"
            .disabled=${a}
            @click=${() => this.entityId && this.callService(d1(this.entityId), { errorVerb: "stop" })}
          ></hd-icon-button>` : d}
      ${t.close ? o`<hd-icon-button
            icon="mdi:arrow-down"
            label="Close"
            variant="soft"
            .disabled=${a}
            @click=${() => this.entityId && this.callService(l1(this.entityId), { errorVerb: "close" })}
          ></hd-icon-button>` : d}
    </div>`;
  }
  renderContent() {
    const t = this.vm, e = Ji(t.stateObj), i = this.currentSize, a = i === "1x2", s = e.setPosition && i !== "1x1";
    let n;
    return a && s ? n = o`<div class="stack">
        <hd-slider
          class="vert"
          vertical
          .value=${this._position}
          .disabled=${!t.available}
          .valueText=${`${Math.round(this._position)}%`}
          icon="mdi:window-shutter"
          label=${`Position of ${t.name}`}
          @hd-input=${(r) => this._setPosition(r.detail.value, !1)}
          @hd-change=${(r) => this._setPosition(r.detail.value, !0)}
        ></hd-slider>
        ${this._buttons(e, !0)}
      </div>` : s ? n = o`<div class="stack">
        <hd-slider
          .value=${this._position}
          .disabled=${!t.available}
          .valueText=${`${Math.round(this._position)}% open`}
          label=${`Position of ${t.name}`}
          @hd-input=${(r) => this._setPosition(r.detail.value, !1)}
          @hd-change=${(r) => this._setPosition(r.detail.value, !0)}
        ></hd-slider>
        ${this._buttons(e, !1)}
      </div>` : n = this._buttons(e, i !== "1x1"), o`
      <hd-widget-frame
        .icon=${t.icon}
        .layout=${this.layout}
        .name=${t.name}
        .stateText=${t.displayState}
        .size=${i}
        .accent=${t.accent}
        .active=${t.active}
        .unavailable=${!t.available}
        .hasDetail=${!0}
        .quickKind=${"none"}
        @hd-activate=${() => this.openDetail()}
      >
        ${n}
      </hd-widget-frame>
    `;
  }
  disconnectedCallback() {
    super.disconnectedCallback(), window.clearTimeout(this._debounce);
  }
};
he.styles = x`
    .controls {
      display: flex;
      gap: 8px;
      align-items: center;
      justify-content: flex-start;
    }
    .controls.center {
      justify-content: space-evenly;
    }
    .vert {
      flex: 1;
      min-height: 120px;
    }
    .stack {
      display: flex;
      flex-direction: column;
      gap: 10px;
      height: 100%;
    }
  `;
$1([
  C()
], he.prototype, "_optimistic", 2);
he = $1([
  b("hd-widget-cover")
], he);
const Qs = {
  netflix: "mdi:netflix",
  youtube: "mdi:youtube",
  "youtube tv": "mdi:youtube-tv",
  "prime video": "mdi:filmstrip",
  "hbo max": "mdi:movie-roll",
  max: "mdi:movie-roll",
  skyshowtime: "mdi:movie-open-play",
  disney: "mdi:movie-open-play",
  "disney+": "mdi:movie-open-play",
  infuse: "mdi:play-box-multiple",
  auvio: "mdi:television-classic",
  "pilot wp": "mdi:television-classic",
  tv: "mdi:television-classic",
  music: "mdi:music",
  podcasts: "mdi:podcast",
  photos: "mdi:image-multiple",
  fitness: "mdi:heart-pulse",
  arcade: "mdi:controller-classic",
  facetime: "mdi:video-outline",
  computers: "mdi:laptop",
  "app store": "mdi:apple",
  settings: "mdi:cog",
  search: "mdi:magnify",
  nordvpn: "mdi:vpn",
  speedtest: "mdi:speedometer"
};
function ue(t) {
  return Qs[t.replace(/ /g, " ").trim().toLowerCase()];
}
function Gs(t) {
  return t.some((e) => ue(e) !== void 0);
}
function Js(t) {
  return t.replace(/ /g, " ").trim().toLowerCase();
}
const tn = [
  { key: "tv", label: "Apple TV+", icon: "mdi:apple" },
  { key: "infuse", label: "Infuse", icon: "mdi:play-box-multiple" },
  { key: "netflix", label: "Netflix", icon: "mdi:netflix" }
];
function en(t) {
  const e = /* @__PURE__ */ new Map();
  for (const n of t) {
    const r = Js(n);
    e.has(r) || e.set(r, n);
  }
  const i = [], a = /* @__PURE__ */ new Set();
  for (const n of tn) {
    const r = e.get(n.key);
    r && (i.push({ ...n, source: r }), a.add(r));
  }
  const s = t.filter((n) => !a.has(n));
  return { featured: i, rest: s };
}
function Fe(t) {
  const e = t?.attributes.media_duration;
  if (!t || !e || e <= 0) return null;
  let i = t.attributes.media_position ?? 0;
  const a = t.attributes.media_position_updated_at;
  return t.state === "playing" && a && (i += (Date.now() - new Date(a).getTime()) / 1e3), i = Math.max(0, Math.min(i, e)), {
    pct: i / e * 100,
    elapsed: Ci(i),
    total: Ci(e),
    positionSec: i,
    durationSec: e
  };
}
const Dt = /* @__PURE__ */ new Map(), Jt = /* @__PURE__ */ new Map();
function an(t) {
  return Dt.get(t);
}
function sn(t) {
  if (Dt.has(t)) return Promise.resolve(Dt.get(t) ?? null);
  const e = Jt.get(t);
  if (e) return e;
  const i = nn(t).then((a) => (Dt.set(t, a), Jt.delete(t), a)).catch(() => (Dt.set(t, null), Jt.delete(t), null));
  return Jt.set(t, i), i;
}
function nn(t) {
  return new Promise((e) => {
    const i = new Image();
    i.crossOrigin = "anonymous", i.decoding = "async", i.onload = () => e(rn(i)), i.onerror = () => e(null), i.src = t;
  });
}
function rn(t) {
  const i = document.createElement("canvas");
  i.width = 24, i.height = 24;
  const a = i.getContext("2d", { willReadFrequently: !0 });
  if (!a) return null;
  try {
    a.drawImage(t, 0, 0, 24, 24);
    const { data: s } = a.getImageData(0, 0, 24, 24);
    let n = 0, r = 0, c = 0, l = 0, h = null, u = -1;
    for (let f = 0; f < s.length; f += 4) {
      const g = s[f], v = s[f + 1], y = s[f + 2];
      if (s[f + 3] < 200) continue;
      n += g, r += v, c += y, l += 1;
      const M = Math.max(g, v, y), T = Math.min(g, v, y), L = (M + T) / 2, ht = (M === 0 ? 0 : (M - T) / M) * (1 - Math.abs(L - 140) / 140);
      ht > u && (u = ht, h = { r: g, g: v, b: y });
    }
    if (!l) return null;
    const p = { r: n / l | 0, g: r / l | 0, b: c / l | 0 };
    return h && u > 0.15 ? {
      r: h.r * 0.6 + p.r * 0.4 | 0,
      g: h.g * 0.6 + p.g * 0.4 | 0,
      b: h.b * 0.6 + p.b * 0.4 | 0
    } : p;
  } catch {
    return null;
  }
}
function Pe({ r: t, g: e, b: i }, a) {
  const s = 1 - a;
  return { r: t * s | 0, g: e * s | 0, b: i * s | 0 };
}
function Te({ r: t, g: e, b: i }, a = 1) {
  return a >= 1 ? `rgb(${t}, ${e}, ${i})` : `rgba(${t}, ${e}, ${i}, ${a})`;
}
var on = Object.defineProperty, cn = Object.getOwnPropertyDescriptor, _e = (t, e, i, a) => {
  for (var s = a > 1 ? void 0 : a ? cn(e, i) : e, n = t.length - 1, r; n >= 0; n--)
    (r = t[n]) && (s = (a ? r(e, i, s) : r(s)) || s);
  return a && s && on(e, i, s), s;
};
const ln = { r: 32, g: 36, b: 44 }, dn = 1600;
let wt = class extends H {
  constructor() {
    super(...arguments), this._artColor = null, this._colorFor = "", this._optimistic = null, this._optimisticTs = 0, this._tick = 0, this._marquee = !1, this._marqueeKey = "\0";
  }
  // ---- Playback state ----------------------------------------------------
  get _rawState() {
    return this.vm.rawState;
  }
  /** Live playing state, honouring a recent optimistic toggle. */
  get _isPlaying() {
    const t = this._rawState === "playing";
    if (this._optimistic != null) {
      if (Date.now() - this._optimisticTs > dn)
        return this._optimistic = null, t;
      const e = this._optimistic === "playing";
      return t === e ? (this._optimistic = null, t) : e;
    }
    return t;
  }
  _playPause() {
    this.entityId && (this._optimistic = this._isPlaying ? "paused" : "playing", this._optimisticTs = Date.now(), this.callService(u1(this.entityId), { errorVerb: "control" }));
  }
  // ---- Lifecycle ---------------------------------------------------------
  updated() {
    const t = this.vm.stateObj?.attributes.entity_picture;
    if (t && this._colorFor !== t) {
      this._colorFor = t;
      const e = an(t);
      e !== void 0 ? this._artColor = e : sn(t).then((i) => {
        this._colorFor === t && (this._artColor = i);
      });
    } else !t && this._colorFor && (this._colorFor = "", this._artColor = null);
    this._syncTicker(), this._checkMarquee();
  }
  /** Advance the scrubber once a second while actually playing. */
  _syncTicker() {
    const t = this._isPlaying && !!Fe(this.vm.stateObj);
    t && !this._tick ? this._tick = window.setInterval(() => this.requestUpdate(), 1e3) : !t && this._tick && (window.clearInterval(this._tick), this._tick = 0);
  }
  _checkMarquee() {
    const t = this.renderRoot.querySelector(".np"), e = this.renderRoot.querySelector(".np-title"), i = e?.querySelector(".np-title-inner");
    if (!e || !i || t?.getAttribute("data-variant") === "hero") {
      this._marqueeKey = " ", this._marquee && (this._marquee = !1);
      return;
    }
    const a = `${i.textContent ?? ""}@${e.clientWidth}`;
    if (a === this._marqueeKey) return;
    this._marqueeKey = a;
    const s = i.scrollWidth - e.clientWidth, n = s > 6;
    n && (e.style.setProperty("--marq-shift", `-${s}px`), e.style.setProperty("--marq-dur", `${Math.max(6, Math.round(s / 22))}s`)), n !== this._marquee && (this._marquee = n);
  }
  disconnectedCallback() {
    super.disconnectedCallback(), this._tick && window.clearInterval(this._tick), this._tick = 0;
  }
  // ---- Rendering ---------------------------------------------------------
  _ambientVars() {
    const t = this._artColor ?? ln, e = Pe(t, 0.62);
    return [
      `--np-dark:${Te(e)}`,
      `--np-scrim-strong:${Te(Pe(t, 0.55), 0.9)}`,
      `--np-scrim-soft:${Te(Pe(t, 0.35), 0.45)}`
    ].join(";");
  }
  _transport(t) {
    const i = !this.vm.available || this._rawState === "off", a = this._rawState === "buffering";
    return o`<div class="np-transport" @click=${(s) => s.stopPropagation()}>
      ${t.previous ? o`<hd-icon-button
            icon="mdi:skip-previous"
            label="Previous"
            variant="plain"
            .disabled=${i}
            @click=${() => this.entityId && this.callService(m1(this.entityId), { errorVerb: "skip" })}
          ></hd-icon-button>` : d}
      <span class="np-play">
        <hd-icon-button
          icon=${this._isPlaying ? "mdi:pause" : "mdi:play"}
          label="Play or pause"
          variant="plain"
          .loading=${a}
          .disabled=${i || !t.play && !t.pause}
          @click=${() => this._playPause()}
        ></hd-icon-button>
      </span>
      ${t.next ? o`<hd-icon-button
            icon="mdi:skip-next"
            label="Next"
            variant="plain"
            .disabled=${i}
            @click=${() => this.entityId && this.callService(p1(this.entityId), { errorVerb: "skip" })}
          ></hd-icon-button>` : d}
    </div>`;
  }
  renderContent() {
    const t = this.vm, e = e1(t.stateObj), i = this.currentSize, a = t.stateObj?.attributes.entity_picture, s = t.stateObj?.attributes.app_name, n = t.stateObj?.attributes.media_title, r = this._rawState, c = s ? ue(s) : void 0;
    if (r === "off" || (r === "idle" || r === "standby") && !!!(a || s || n))
      return o`
        <hd-widget-frame
          .icon=${t.icon}
          .name=${t.name}
          .stateText=${r === "off" ? "Off" : "Not playing"}
          .secondary=${t.secondary ?? ""}
          .size=${i}
          .accent=${t.accent}
          .active=${!1}
          .unavailable=${!t.available}
          .hasDetail=${!0}
          .quickKind=${"none"}
          @hd-activate=${() => this.openDetail()}
        >
          ${e.play || e.pause ? this._transportPlain(e) : d}
        </hd-widget-frame>
      `;
    const u = i === "2x2", p = Fe(t.stateObj), f = a ? `background-image:url("${a}")` : "";
    return o`
      <hd-widget-frame
        bleed
        .name=${t.name}
        .size=${i}
        .accent=${t.accent}
        .active=${t.active}
        .unavailable=${!t.available}
        .hasDetail=${!0}
        .quickKind=${"none"}
        @hd-activate=${() => this.openDetail()}
      >
        <div class="np" data-variant=${u ? "hero" : "bar"} style=${this._ambientVars()}>
          <div class="np-bg" style=${f}></div>
          <div class="np-scrim"></div>
          <div class="np-body">
            <div class="np-art" style=${u ? "" : f}>
              ${a ? d : o`<hd-icon icon=${c ?? "mdi:music-note"} .size=${u ? 56 : 26}></hd-icon>`}
            </div>
            <div class="np-meta">
              <div class="np-app">${s ?? t.name}</div>
              <div class="np-title" data-marquee=${this._marquee && !u ? "on" : "off"}>
                <span class="np-title-inner">${n ?? t.displayState}</span>
              </div>
            </div>
            ${this._transport(e)}
          </div>
          ${p ? o`<div class="np-progress"><span style=${`width:${p.pct}%`}></span></div>` : d}
        </div>
      </hd-widget-frame>
    `;
  }
  /** Neutral transport for the resting tile (soft buttons on a light card). */
  _transportPlain(t) {
    const e = !this.vm.available;
    return o`<div class="transport" @click=${(i) => i.stopPropagation()}>
      <hd-icon-button
        icon=${this._isPlaying ? "mdi:pause" : "mdi:play"}
        label="Play or pause"
        variant="filled"
        .disabled=${e || !t.play && !t.pause}
        @click=${() => this._playPause()}
      ></hd-icon-button>
    </div>`;
  }
};
wt.styles = x`
    :host {
      display: block;
      height: 100%;
    }
    .transport {
      display: flex;
      align-items: center;
      gap: 6px;
    }

    /* ---- Ambient now-playing card (shared by bar + hero) ---- */
    .np {
      position: relative;
      height: 100%;
      min-height: 96px;
      overflow: hidden;
      color: #fff;
      isolation: isolate;
      background: var(--np-dark);
    }
    .np-bg {
      position: absolute;
      inset: 0;
      background-size: cover;
      background-position: center;
      z-index: 0;
    }
    .np[data-variant="bar"] .np-bg {
      transform: scale(1.4);
      filter: blur(26px) saturate(1.5);
    }
    .np-scrim {
      position: absolute;
      inset: 0;
      z-index: 1;
    }
    .np[data-variant="bar"] .np-scrim {
      background: linear-gradient(90deg, var(--np-scrim-strong) 0%, var(--np-scrim-soft) 100%);
    }
    .np[data-variant="hero"] .np-scrim {
      background: linear-gradient(180deg, rgba(0, 0, 0, 0.08) 25%, var(--np-scrim-strong) 100%);
    }

    /* Bar layout: crisp thumbnail · meta · transport, thin progress at foot. */
    .np[data-variant="bar"] .np-body {
      position: relative;
      z-index: 2;
      height: 100%;
      box-sizing: border-box;
      display: flex;
      align-items: center;
      gap: 13px;
      padding: 12px 14px;
    }
    .np-art {
      flex: none;
      width: 56px;
      height: 56px;
      border-radius: 12px;
      background-size: cover;
      background-position: center;
      background-color: rgba(255, 255, 255, 0.12);
      box-shadow: 0 6px 16px rgba(0, 0, 0, 0.35);
      display: grid;
      place-items: center;
      color: rgba(255, 255, 255, 0.85);
    }
    .np-meta {
      flex: 1;
      min-width: 0;
      display: flex;
      flex-direction: column;
      gap: 2px;
    }
    .np-app {
      font: var(--text-meta);
      text-transform: uppercase;
      letter-spacing: 0.05em;
      color: rgba(255, 255, 255, 0.72);
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    .np-title {
      font: var(--text-widget-title);
      font-weight: 650;
      color: #fff;
      overflow: hidden;
      white-space: nowrap;
    }
    .np-title-inner {
      display: inline-block;
      max-width: 100%;
      overflow: hidden;
      text-overflow: ellipsis;
      vertical-align: bottom;
    }
    .np-title[data-marquee="on"] .np-title-inner {
      max-width: none;
      text-overflow: clip;
      animation: marquee var(--marq-dur, 8s) linear infinite alternate;
    }
    @keyframes marquee {
      0%,
      12% {
        transform: translateX(0);
      }
      88%,
      100% {
        transform: translateX(var(--marq-shift, 0));
      }
    }
    .np-transport {
      position: relative;
      z-index: 2;
      display: flex;
      align-items: center;
      gap: 4px;
      --icon-fg: #fff;
    }
    .np-transport hd-icon-button {
      color: #fff;
    }
    .np-play {
      width: 46px;
      height: 46px;
      border-radius: var(--radius-pill);
      display: grid;
      place-items: center;
      background: rgba(255, 255, 255, 0.16);
      backdrop-filter: blur(6px);
    }

    /* Hero layout (2×2): meta + transport anchored to the bottom. */
    .np[data-variant="hero"] .np-body {
      position: relative;
      z-index: 2;
      height: 100%;
      box-sizing: border-box;
      display: flex;
      flex-direction: column;
      justify-content: flex-end;
      gap: 12px;
      padding: 18px;
    }
    .np[data-variant="hero"] .np-art {
      display: none;
    }
    .np[data-variant="hero"] .np-title {
      font-size: 17px;
      white-space: normal;
    }
    .np[data-variant="hero"] .np-title-inner {
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      white-space: normal;
      animation: none;
    }

    .np-progress {
      position: absolute;
      left: 0;
      right: 0;
      bottom: 0;
      z-index: 3;
      height: 3px;
      background: rgba(255, 255, 255, 0.2);
    }
    .np[data-variant="hero"] .np-progress {
      left: 18px;
      right: 18px;
      bottom: 78px;
      border-radius: var(--radius-pill);
    }
    .np-progress span {
      display: block;
      height: 100%;
      background: #fff;
      border-radius: var(--radius-pill);
    }

    @media (prefers-reduced-motion: reduce) {
      .np-title[data-marquee="on"] .np-title-inner {
        animation: none;
        text-overflow: ellipsis;
        max-width: 100%;
      }
    }
  `;
_e([
  C()
], wt.prototype, "_artColor", 2);
_e([
  C()
], wt.prototype, "_optimistic", 2);
_e([
  C()
], wt.prototype, "_marquee", 2);
wt = _e([
  b("hd-widget-media")
], wt);
const hn = "data:image/webp;base64,UklGRupFAABXRUJQVlA4WAoAAAAQAAAA0gEA3wEAQUxQSH4XAAAB/yckSPD/eGtEpO4DbgOwbRuASA/9/8FFsmUidYno/wTgiGwECY+Z3LC2zExuDICLxSTAgYvgIQ9DcsbDZibnM3KoWsdIlbO8V0RRJPeIyiJ+RtITaYr8ecEbFT8Y8YcR/yT49YKrsARXYQmmYEqebjdLkCfcPSHeqXib4tOFXy9YSta8U0p28kTZSUmse7PJkZbNyJI+XHdLIU+tb0a8CninZIkzknIisdGH2grvkQuqSTbQLBNCc8oE2rVe2YlEu1orQ68soFsO0C8HcDRNWzyLw8ap0rA9C8O+JCuasDsJkrVgVJKnOjAySXadTofA8OzGfTyhQGk8FJjjoUR5AsfJLAUYZbWIuSlg4WRntRSK2rZtGOv/t9PLHhEToMXYZe2YW9TEeTRpFbtYol7MMkz16C69i1l3oS7atlXJja0x1z4nUyxZLKvkAjMzM1MxMzMzM3M1ZmYmMzODrLJMV2xbzMkRcc5eHxkp26GMyH3ufa+1iJgAOpIkObKrrCXgTIIKHbfB/RX2OX1sZmea1QEm0gytRcQEMJaUAJVMmb+b8ondWTehb40cYKjYvCwbJDjDHZzKU1me54Gm4SXnnjaXx3HdX7fdcOMgI2cC3N2rChlND5l58gtd+a7dFMME+AgmUQ5sqYHroR/sfUg3IwdT1SATQDjj9a9942e2TqOpuw17jO4SIw88+Mt3DrmGtq1evYmmkgVJ6U8hyw1yphz82hkMdx8m8Tg73kxixC1r/7v49nu2UzhNu/CQ8CRj+O5vfHl3bwl1uTLRqu7RHSwIKAcLW/XX+Q/ccm/eFwEzS3AKeSZg8tFv/NZv1jI8qpud0h0kRrxm3KYHtO5IwJTaZABzn3nB8q3u7qWBjJ3agSiXMXzL4itfQUIXDrgfcLgffR5ALGXGqOkRdyxA/NxsWROZfEc0zNORhbx7EiCL+31hMgJ3hBiF3Yn+bWV5VxZEUwHOiJaBRzzxSKLp9Jc874BoA1CXMonRu2h8mabzj3nnt/Y6rOwGBpY3hlY8smLhugGay0ySkkzIAGze8R/84q9uoWmpcYzyhb9v6uEf/PRXf/CPxe7s8OD69YNL1sjrl9ogI8vMpHSiLACTZ006+T1PnQy4CxBtcNOWGTMYXgo1c8AYcYv6/37npmXbvN4XGW4hRlAKAfZ5zY+XOkDhUqCdFlHIjB13d6KDcpoXaxeuqW+79/5V/TQ3M0nJwfKuLAsyEFPf/rc17u4QJdqqu8QT6sPEiMW6RzZtuP36bbXJYrhCnplSgSR22N/u7vUiOh2su0NgeG8jrv7dW5+3x7ScpiaN/SSA7MknzBvXdcVd8z3b+qoPTyyD0QG7u5PRfPC+DRs29a+4a/kAEMZwFvKuLsGkzI9587OBgTv3VP+KM3DRQTvgeKDphpv/cl2v0NhMZjR/za/On+aZYiFyhpcmOnCPuBMMyr5/nol2SE001rEsAOz5wu//9Cf/6XEAF+AOSHTw7hh48SakYWaWmWy4QiaZxiSykOXAjJlTn/XipwqgNDHGLLINJz8UHHkDIjtuBu7g0hhBFmg6581fP/sAgMJREGPOqIveSgnOrN12e9I+4wbAQ9e6xbZy6UZ2UCGo01OWC3jqcz/7jysfcieCEGNSx59x25u6p9oxE9Q7xI72927f2rNy5j1Ly21bnjQJIO/qyjMzdUqSjTBhANwA5p7yp5oPL+rBGNNe8DRGLn2kIHZw4J7/fOWF++WMKBvm4J2MjB3MGwDTX7b/7D0OBDwiYwzsEBESIzuOIzfRfMvdyxpo+Q09WzcwouHeoShAvuBpnheAxwDs/q7zgVLG2DhKPNHu7hlNe/sW/+j+OsQhG9oCmYBo6jSg+5UXDjmPMZZSIC3G6EAwRtzctf4fv1o5yIiyEIKZSZ3A+L3/dHt0jzvmEsnSwTVMwJq1m0qIt5wxS4woZO2uK3z6GUAp7VgadTxmNC+H7l208AHKdWHgUSDggIPakdR9yCmUGKk2ug8LovnafNtCv+aOu9hBUxvK/0HMScCOu6MA0OhfHVfdvmX1ooHNgOV5np/DiDFnoYuEHCGSMeLA1b/74aGMeDqHiYxzhpSUmjoOAgSsvr/X1XPJNRsBaw/GHheSsD1CoOm2m3956GTaxbwfoHQ1PEZAAfAbDkDtYea38bQ1orsX/rlg7QAmziOZq3zDntHaQqynMwJt09KZyMejtqAinUHWTXssayiddU9tCzGsXoKnM+VtAaefZO70b8XbAZTpDGrbaZOW0vLx7aKezoRCu4jpzIm1dpHU20cdJbSyXTgJPTbaRSU9lNLKRntwNqa0eh/eDqA3pTX6aZN1T2hlo11U0jGlqW3UPaGZtQujgqqntJCbSe1gwJNZtBWHbQPyzEY9kcxdW799430DPYAi2FL7ko2PfOplezKTowdwX/7Vzx/Yap7SILp7JnL/gpbi3RX6yqb01g6LRDfQPNWxx0G8ciq3UUGXFZQ3Kqj/l7dXULGOV0yOl1TPsbeK6q+gUBX1f6VVRRUVlDcqKIbw6mmQCjpWUf8/aVFUUUNV1Ha8aoIa/z/pooqqoeqprKL6MK+cGpHqOZYV1FCR5ja2rUNp7p6tt4GnuEcyURpJvpA59VqaW8gglmmusnlMc4WtVktxqcpWNPD0Jg22GKmea0NpLsic2mCaa2TpvrIVJZ7inthiQZKvbJ7oFjSjluJShcxFmeKkRobRh6e4RzRRkOTv0BJ96jafpHVGLXBKc+xOgVLchgYFSf42n05qcDWU3qQCt9WT3ECL3BfNE1xFg4z07qENrvQEp0rXSHJjhzNSfNvgCk9x+zKhMuFEir9e4FK869d/JtQ/d3BKcOhyQXPqnuIy0aBMcr3DiSQ34IqY3lxbgXNSfOtwaX5LuP4ixXWhO3VPcYMNiiTX6Iz07qp0DU9vaKErYopreJ7igm5Kn2JCXWdU5oRSmVE5oWqZUO1pRq0TqpQJFZrQbZtQ24O8agqtSvAVTvr/Z1yDCz39fBMeeBVVpjcMNFJc4NVT3BWvkeL4yxRX8SzFNbz+9CZVvFp6Q4nXSHH89eTm0g3Pkxuo4SV46YbXSG/kPqEM1quoBkpuOfAG8OTWd7xthZJbW+Gc/nXy1BaCl7ILKBObv/gER+DVNXlaQ1c6Mf6BENOa8pEO4/tuaY3yL17ARWLvK5645l55WlPgYcs/VY+JzaCy/1wUiqQ2Gh9dfNVJ6tkNGMcUmae0vhvAeB8V1JxBUvr24ADL/2pFMnPWRw984L5QpjLYmgXyDYtFOl/Sg+kSQtUkpv05xmT21/CAhXM9lYl+ccGcmxXTGKwuELO3WUxke3NB4HNF6WmshA1pb/dE9n+3gbo/vDWiFLaV8AELSw8prMloFr7hkRRenIhZfyCmsF3hg8ARVqSwIadB+0Q8gZlV9tcNeMWErTp+MqqaVAaq54V3TiiUusJNxtkePXVVN9L4F9fwxNXdDH8keT36kX1PJO6//ZB3f2iokbaaIeCBWCatO0cZX3CSdnMksz+pTFnhiIxD643o6cp0nn/XG1WTCFfHWDFhHOFF1SQbd6GXFROBPTYRKyaMZwZVTTJuVlkxkekLpGkxfGGXnzmIJ6g2H69cm6SckzPMqJ4jiTqspWlXX1EaM6Uo2LzLt+K4HKWoLIyBk6bHna2l6iy8eRWVpEXXyduKFAUu78vw9ORsLd66SNDOitVblqJg/MmbUpSY9sxbI0VB18lbf4pyFt15K9LUtmJMYCkKJpyNYUNDaSrKunelqRDWGJ+mcnPb05TLu9JUu6+lKTd3Z5rqad7KNFWmt0aaippOznZFVkwQ5T1RdVtzGkPmCWpIYQzKTaRnZ4lO1naf4CnK5FycOd2VnMQuSmPwVCdFB3mfrgQlpmhY20qS7pb3WpoaMtdIUc6QYjaJDd6UJygX63yFnMCJtfSk0C7XmjAJePMW8wQ1PNm4bsi797/SHSWoaklA9taNPUPeiCTosirtSOz17q/vDVAGUnQfsipp0i5wxmXulCaSdOr25AWY8+Q533Yv6uomWa9PShOWBQu77nnkobzEG9GdhF13eZQAul79ytPvePXxDRJ3pgUB+73lSwdOPe1DX7ro6cTUZVE5zDpgrfvGD0/96hX/3Z3k3QeeDPh53b2se+0jxx1y6Nb01QqcMtj7O/sDjpHf9O1nrccSV6rubAI7ZaFTBhAQDZzkXXYlWMaUZ/zdvUE3IxeR9J0pbnUx5beFl9GpimUw7wKIIrm3igW7/WI3nArZsl32v8txq44k+JV73TKq5DN+r8IyEv3I4DFNfJ87Cb+mcA1+4rEwpbtNgcPBF3sjOgl/1SlZsvFr90ci6d8LVmz+E07SDxyx2xw3Un9jCUy+R6T+0L0SRBwQ8OQnbQINLJlCJXgBUd51G1Vg6A4k8B0qwo1DXDHkXg3sSojAfZY5lWCuglTW92MiFWGnMGYiKsKsFOOn3kFZFfSFwZj3j+3mVUFWCO3jojosELwyxqogNRYlgNj1NvfqADLT57ykQkgE44LYqBCyExjz7veyMpBOrwgCt0+jSoyXiuNluig0VCU8E6AogqgSE0A8ab6qBUKxD5Wzs90rhgCAGtViVgRVDOoIVWO8QFDFkAWhMVQtqCP0r8arg9S4KQlKKsW8iXCoUS3ohNBo4FVCXBG8n0oxd4Q4VC0gOmVPxTAAIF+7zbxCaP8qAfyyVcQKgVFcvI0qcSSDx0qhFAR5A68SkoAQ+6gS/xgEMrIKIXVLBDShQpAWMXisFCqDhbJSWAmU2ZtXZrFCqIcLeQ68sx+vEOJoBhy4+MHCeMy1Hi881eWxBAe+8Q33u/OYnd5HlYkYk1w5lDJeuN4h8viu+PGr9oUiS3BVcRzBde41MntcnKFb106fPm8B7slt0XGlid/xWDpP5INfvu0DrxR4Ukv9oziKgv3Bi+hPhKPakkWb/rM00igSmrTpsFl8EBdPcDQ2/+yefU/eZw549GTWvdNkLHScJ9zdgPv+snbaR3YxJbPx+M4RwsHLs0greunKejZm89de84CnsonsnAFWIlr7jtuXJzJnJdoZMg57lNaOGOncdw6jnEvrx9JCIlNO60t2TEFsKdeivuNJ5dEevhdvucAxKxEt3lufmqWzlSvVagocOIEKM3rxLBetrcCj41CFAR+l1U28dRCnsow++PmvSK2VYV91jKoyxoyPfTHQ0grM6KNBZVkGrjkvC2olBTj+lZgqCo+Bdb/8JqKVA+zxlR6c6rL45deWYLSwjGmnLHQ3KsroxSVfuZW8oIUFZ912CFFUk2UZ/K8go4UtY8FL1nghUVHmLDxiapfRwiY4b9C9EJVkRCy+0UG0sOCIX63xIjqVZJHhD/zwLiRaOGj+s18KJirJKF/zh1MDudHKYvyNUIpKsvSs+M3BgGhlC3xsWSwto5J08e3vQyZaOsBH3GOginQ3rr/mK4MyWlscc0nhkSoyFu69H+oGEy2tMOHsxU6gWvQmMbDtU9Mhp8UNPuXecKrFkub3/fkYkGhxo+vHtVp0KkUvKPrK7eO6v/K7DQTR6mL63l25qBQd9/tOnEbTrkCry8LkXiKVYll28eD3FqBhZrR+4MAGkSrRY2D7p6eAsbPmHBDJqBCjwa1XX3gLMnbWjH03Fk5n7kU+9vACL7Z8ehqY2GkDK4uMytDd4JFzM+gydt6M48fjVYHHwPovF/uDxM7cNf2nlFSEUapt/OUnwdi5G1sOJlANRnP/6jmzCHlgp1bOZVSDsVRW/OV54xgFMzZQVgCOG1z5eegK2umMvTfkXgEAD/1r8X96MHZ+syeZSP6xyMpVm94AGKOhrvoB0RNflOBTnwXLxWgoHh4g8ZcELvv20C11nFFS/1FIeo4bj178lsgoKnbtJ+VHgxt+ff06slFEzL0sxnRXeL5x8Ns/7gfKUSTwfPBEFz3AXc9fCXnJqNqlN1qdNB+N+MHlt6+W3BldAx/EUpxHwn9vez7SG4VgjbmPkqW3GDP4TTdMubz5yIN+4tGSWzSWvmH7/WQG9NJIYnc3lt5x18+3IYYH0MwePKl5keM/eQpgYrSOr/aShO4xsP6b+0BXJkbv+QuIyazAjNqPfnI/GKP6swdinsyAK7/58H0EMcr/e4k3ghKYg676y5cOhMwY9bd+IDpllKetMuZw8fmAGW2wn93O+/yh4GXKKgOrTvLNQ3km2qIM9nnO/D0CEAtPUWWA22/47SIQ7dKRgPyF39zmQBGUmLzoYvCT00ESbdXyHDj2hSftefgMolxKRu6W3fetH0CX0YZlDD/rJSfsAZRRnoC8IGfdt78HMtq1mVEwc6re9uZxQEw+Lljylvsg0OYNoPv0M/NdBny4JRz37d//3i4QjLYvRAR48TWDtS4amCzFlNEGt78YMNEhSgqRMHHeS191IBAFSioO4kcTJ5J3ic5SAHOeP/e4PRcAhaUTjwGuv/yfIDpQKQDjp732dVNmQGFSEonuGx58zgQQnarlWQEsOOXU8+YAHlvOh/kIQmMfF7WfzQYyo5MV4HDU2QedPB15vVG2TBEhFzscC1A+homFZXHpGSCJzleBAk0OX1lPCODuT5iDG0BPVzbQixr10qZMHQ/gLjQmcQQLn7kFiU7ZiMB+J86Yc9wRAP4EDf/LIlj6yMTuLRvR4EBh8+bNXwDz3s5Y1X3lJ961G5jopIUD7PLuN6I51BvF4+QePV+rTT/8AY/zc954iFMUYwxvKFuz8DRAdN4WVJYgff5deQYRgXbEcQm44Jly6HJFR+6AgyRzlSWEC8htLOFu8A0gz40OXbg8HPni134zZoAXDsLBzIBtN9+/6LpHcXPn8TXHu6/4BeZjhVjmbPzE5suRGAse/YFDpk0cxw5v3vq7Py0raMWZ12ls4Lj7tj8ewphQJkpn6u7Td13Q7TatNgA9fVseXLUdFGJ8opRrXENjAgKLv3wsZJnGAE1lJY9d4LSgcZzo+L1wetb97VgwMZaUIQlKGTge3WlFGaetwzs7dwyWHvzZW8gDY/+Q59y6VZGOPhr0vyM+FSQSoICPTCuMTt7LrL40/uS7IFKgxJEf+MLEjM7diQFWf+KXkMlIgYL9L3Wng48S3PK9vksbIUaSoIXJPz461tWpuYPRuOWn/wYjFcr4vUcyOnQXcNdXtlwFJpKh8V5vdNGZl+65L/Uv/LMXU0lCDNwbSzrwEgLgX/oYkFE6aWFhowPzGKD2iXvCloUluJMYjbd40Vm544Hbe+MXryVZGr9xLzsldySg/PiXARNETxIKfLKgETuiKEHP129YX1uuzGMkYYpzb3XHI7GDKcEE62v/+jtAiE7aVGDKcy46D6DhHYq7AX3X/KTPwIBI+gwwf/+nPndCjyiR1FG4uzxw55Au+cNKACtIpMoYfvgPtwagcJR1AmUEZQA93/gswwPuJelUwgRPOfig39SczjAaQHHZx6L6lpvh0UmxwQBO/1UWp59rEKU25W4AN62AwX9eAmCRhGtmAph77VO7gEKmduMeyYBo97ztZoYbEEm9lsutu5sDv/S0mVBKahuOxyAYvO7by7d5n0eHWJKYT33ZgtMyoHSzUS9GFAAeuTO/9PukaYHcGbf7zHecPEMQPYxqEQPqjcu/PLR1tUW5A56chgscmHbqmbMO3hOXo9EnIoGLhx6qb/zHw/9DAhciAuz1o+3PBsqIhVEilsOU0fSBy762huHBcfCk1VRmNLqLuX7CV54ClMF9p/ImbjR99IJv98rp6yGTR3dSukWAfc+fHc84HKS4s0SM5g9f3KOoLb9eR3OLpHcBisD0l3wmHwSPZmqliLtDjvdHXD23/fHvNDVv4iR7C6JOzlE/fgAgIj1xDi5E83VX/PXGPiCWZAZ44VSBZsC0p73kc79e5xBLMz0+HuMwCzR9YGDT6rvqxR33MaKcilEM3/31b919ChDtMbnjgea17keuuuru/p6iVgcwYrMKUpYFgMPOmnvAKYHHd9FNdUWtXTTlof/SPIdYUm1KRoRxx73ljKl6DHevW7d8yQ1rGdEAB5wxPVZQOCBGLgAAcA4BnQEq0wHgAT5tNJZIpCKiJiJRiqjADYlpbr5s2oezRXvHNg+lcBqj/X78Y/gF5cfqvyh9Dfx/7b/Yf4D9vvkAxR/E+Bn8z/O36zz98F/yz97/Zb2C/xz+U/338x/dmkx8ivsv/L6jvsN9j/0n+M/xn/M/uvxT9mPMS/AeZ5/qP7Z/WvR7/UXz8PF/9h/gPgB/kf89/2/+i/a//Uf//7af8b/cf4n/Of87/CfC78i/zH+2/zX7f/43///gP/Gv5p/lf7b/mv+l/kv/9/5Puc9YH7J+wX+oX3rkO72C1b4tCMNDEMQk1nlK1uy93Y0oBfwR5GmSf1ssuUoPs17GIjibsJmecR70ia9Z6HZoMTyyLJWJ5C72C7WHG5vh4rIDzOHRFznFbmW2XK4Y3gSL//6O6cfIlvczlLJPSPPZO/wWlOFvjJ2e1lirA2NqVcXLwiWQaZS8rkwZ5tH9Dxq0RMXSijCix/I1L5MKU9Q4ElJ68vSgdbvEBJJcNcOHRaiLsRdk5Jl50utoke96aCm8C1pGWpxwvMYqB9bcJJyGj/fhlAaa/ZEVT5dG2OtswNa9NnGEx8UUoDHkORHw242A6Epttx0g/2xpn3O9LSlm9eTcwwbvcvb2K8TkGrHFzDV4eyr21reMY8rJE1zBnC5zjb6bVHOaS+2Lwq6AZ5roMUxB9ccnDRqrtb1WCQ0aQclVBzqXo40gpvfhfXQWEXh32RmoQMuPmOWoy882xzbRQbFUEgd4VgSzCQbvU5wsWng2WuZEOwMLmAKhVgDBQffTilkwzSvsqgT6Pj5fIJXNjt67/0Z2jdWhwvrSioShibb/Wq2zz1+OnJUEDHuXqFizkTOTqsd/iHJ1HjFn7BCZDLX8cKKkO+QnZp8liDsEmi+9DTLXsVNtdW2pzXngKOYmo6ggbDwWV+f+08zLrr6arMcC8/XNMcucknFWR+cze4tjUX9D/2+IVh1U/DovnnA1AMUJsRn2UTOAyOOyotj/k/dj8L2HaUZY9YEh2Q9WL9phKPrPRXR7H7iT1/dkKhSGxHfeSPKOAgNX3r/PJu0v9/7AYZTS8Dqz5IVFT+h6Vpc6FajlzjpV6fb6KE0gXCv0EQUH+sn78jii9PPaP5qx+UHxnnDQ+mLK0p7ZEgRKVC3nvjNyK6Wb4p0FsfaSbCfRXudzE+XDXqf6hcLjNww0tbJP4KLrd/5ET8JDnEHy+frA2hqDZw5+ucUj9S+AQxqU9tjBP3UyFEf+NlfEdAHqE3+jlmt9nQ4WjQNX7LilW34HZvh/nLfQGzf4rjMquXOdLOJaKl5NSY8Xl6K82dAeogfef0xpSmf1m/20JcXI1MganwgID9LxfwwojljJ5Jz2ud5+qA85cOxNbRtlKyacryMsukhA2JQ9fQMUhQS72reEqs3tgheFNRk/QrEoKYdrrp5UMR71urli96z6Tm9gykHG70VjrFhWdrnAAKD/QZ4cKpbA/xtxqyMv5Q+/Rb/cHqHs1SAiN4sCyvBR05PKlEfovB09L7Dfmo0bK2fGZcDbihOKEcgwbiDu2sPRTrDWjOG536eqXZWvDVHJBcxvOP/2sg6wv3AmB+3YSHeRhd0N3vMXXslbItPC45e7BMddYC4Uph41MrCYk0SLqPp8cDxzuOy7YyL/hFfKzQiW+URHIub1fuKe13hgxl5Z0cNBOzL+rESejNaxUyEaL3oJ4HzgFYmZMLVnrD7tqQAPSGF3kgm4EDyxLz1wzEcXd5AuQSxHq2HUYivtAav8kpBTmlzHzk3wGWBUogc6PXR41MTNj7vYuP2TTfxkefv6AwrdaV4vi9MLOIz1ed4FX/sh4GYcTBUEMkYYUa/p5/eX/H4E7//rG1xiY5uLvC8HEGhjeSy9pbVcmPuL4Pk4vOf87l4I5GnIlQ2xTPf+QaKVpFE0q1XcEGKpVxJZlZJbEqbH9DJhI8SGDmmXNdmaEZT3OTopeuiAE92JdMBPFk6LidIqg63/X/kg6Ssdhk///DF7JlqQgPCTMQpIo5za4zirOSExBsJ0wT2h3k+dxP8i1FrZIIlPaRjGp67UvNfLtkFwGesG5TuvG8bfdWD8rgsmYKPti11rPqrOS6WdVfa7uguuoYxC1L52MR9Ov1nFD23QrWAzTfuTlipI7XA6hHUiyvSKTQd4GAF2LRa1TL4RI8l7GC9gFFWDR6uyo4kGS4H6PbZLwxJkychOBtL8UsGzEvwvrUmj3uWZDvd8WPEkzGTu77MWk1PHnCOFMsVq4vfugeLDKPTz4RLWBv8Wi5KBNbIKQzKHBA4cAC120MHTf2jD+gxL8DjMEzObQYrhRl2YFiPI++52LR7uyNNH3vd5gQ4PgiG6vOo+qsvcWzki7YVBal2Qu8dQQkpmVYfZLFUGT8ShXIazoNnvqcJfPP5EwWQU1DuuD+y4c+HS2yy/jvdaLtdUv+iEjXk1Rgan0ggX/um5GHAt24wNY8tA5Y2dMywf4pZzVYGngwKmH3zd1A/hcTExPAau5wJCrV7Q7XmairJGUft5bQ7e2dbMhT4pn9rOzNhead+usOWQ5iIsNRXjTEMKIcdnw75Kjp0FBJSoVptctrzG8WqFRmGtgsXymLxw3pz8Di4k8sbuiRGmLmgXTs1IxAfoqG6PxGhqh3RcJiKiQN2gqMpUlZGTAjhBnt5dqPIwlgWApXPT7oU0uZua98cyhe2vWj/RNoKxxefmPRmuuidZWcdd/31bXdOV3+gY3hIYg81qY7km/aoOqfxZ+rBFRwX6mL6YLUACvLDMW5tMOcgAAQdD1/I1S1xlXYqG4X/oGC4m0nKdEXOdO2AJ6j7fRqWGDAXOectzCslXEHTCZbwOe7RB2BVHZaJ8RRApmXdPTELrtZJDV8nyBlC3aoXTgaVrouZw6IrwAP7+6pCQ7tNGicDnVP5gkX2LuWkrH/3yLc09G14uICf2Mf/f666TNPS0G6A9vsohpdFR8qI6jdjUVJP3M33ReggwSI8WSdFD8Q53QY+xsIoSoszohhyng8BHn8mJQH6b3qYCQW0/ngITCgPcE2smTL+HdFTjJW2srbcdQacTQp79/67Hn5FzI+r/sbH79nicM5BpYi5uDMauF/3soVKXQT6joMouFWO+S7cBWlRiUyZfquzotQo5N6cMMq6T4xoOkuW9g+G+eYHRCRgmzLYEAusXdRfBoxrnaD5tFC4EGLzcZeTo1/x2oL+6EBvEbk6b50xAMeWp0XSR5X7N3DbuQRE/uBq0Rw6FoTgt/TjWAKYF6YpLkeFaIb4cx7GlI54PUMDtnwt8yMdnwVPbJV5cJhGnz9gqWAFm36HlZzpOx2wNqD2YBBgF4bzHJv185r0UvPQ7n1gdDk6jUCe+5ruwsrUBIpHoi7bsnkCgAZ1bcCHdWSNdSDen1G94CHkGXZVqz8nSqo5swAAE8yPJbUqySC8HrCUH0C9gcifuvok5gY5ztK5yzfzTckqJcNJ0zRoVbxsJeswiFhSTSNpnaCyikztunWTJBt9+nhTiq45HQ2Eo9tgh2aHnJVept+L7hbt7Fp7fQpqxp4FUmgUfkuqOJ8wx17s2nK11sLKGCdQqEjEVS62Dw2PZBNcXr2iD/Y52f9CYH88X8ZL8QEY+hRzL8JrNhyuqeeoNtwYcQ9tY4hjUDeELI4sa1NM8+4T9mNLiYuxuUH0jBkr3VVRcBsmcSvwP2kzhXhW+b8Sd1glZAK02TIxQpBYQExP0ZpYgdWeeXgyCanV0c4XA/Vi7wwOEr44Q09c0/rXGCrw3cKVBcsRpmB3qAZd138wTbLFexzDpnOYw3uUOeh8cBLJrcW4XnIb4FhaGSnPh5xpX02SBgNZM+vHnyzrAJbnZ6Cg9i72HIBCehEuAwKNG80wvW/HOj81oZjAhPActP+HLYGKa6LCU7Lc/3C/MEeADPCH0HY+8DarBj7sXsSrid3qjKbrX1oLYhn6Iq87N1iRtf20yfkZthUKC+URG/0DAUh5Q/dM4yqnGx27QkwkjmUcehi86RG7nlpnP31QQaFRkKYfSLmCVLR267l7mY538pmfbW+b4s3thP9J/JQu6G6qAL9LkiyQI7rNA7RTKJYeN9LnE83eJoRxKlVrWBy1c1uwun/r4+7YT0cVeqZDBdtJxntNeaZY7f5u5kyLfo1OjuPUDSq9Vh1H3Lw5MtBUhFQrPeVOD+2iS0Qc++NSYgtNeDGRNrTYbk8x3AjmJCVHQ/a5U6DoxWl7J9P4Y0R93AnJMtPsqsPXUAh9Vza1yM9rijRsCEgZjUuH1Uy58AX3TPl/8a11g6f+6v07nscvcVm6vE9KLSA7gUB11x3i6P6D8/IBiArcD58n9jyYqmC4FX3p7JFHGor2/hs5cxHlx1F+Ai4JUTYBtuR2tpMwt/whBl6ZGn5XQsrwRFaziYrzMQrevwLxBq3Dgw6qP5djKX9vLn++zdjrZzYnqzfElAsZlTiXDT9RGS2SfUGmJoxiBwsKK4l2UxcficwGYa4Nrwtmce++qarkQ1PgJZrw8WSQOljiWgNtK2rEaMUMH3cXikywrD+3qBVSP56j5020jdETGphNGW5X9OKF8pRpahvpa/83vxO+7Y6nVd1guGjJ7Gb7ie3An1RhulS7hstLi2ZU8DuluXaD0ODkp/5Lknu6uk7GCoqXhT7mNHWGDa3RT2HcY4BEEkBprgUzZnikTlwcSwZgunhbXQksVbRSVZMx+oPLM5iIt3L7w3xNy6oLg0drLLI7TaXvXsbyc+bHkmR4o8ICU8gEUB8kA2ZGzdHj8fCUoRKVI8a6qtxwLQUjQCQAAC9Fee+X2EPxAYXLScnMAyu1yc9/Jieu4MpIGqUHZTptfkddytTDIb4xAQbINXc74LPJWLtOdSGThjYaOWu/1q3FKA9HJXQLePz26PgVV/4Gu9a08P9WsWuUcYtbu2cZrMuOn4OXCUbodDclRkBGoARyfGrfs76tTZ55Fi9MFP4p7ZqFNoB/xBlt9Jv8r7sWTDMVoEr70N/yMu/efsvSwPSiDixDJ2El6PJI6a33ASUoPYCw2HnXAzTvUPWTsMaLd2DTLIVVON+i6bcQHH7Lz+LjGhjQa2xhiU63Di328ADiyL5M4cHfvJShbkRsKKfM6W+0iODVb5lSUFvDo7TK+kg05X1Emj4XUuIf30kuBTZVnRQr5GPTs7vvcb5ZRFJPU/YyNkPqrMKvE0WZ54baXtOZKehSNo5IPMAJ/cLYpcdT2DZHwCEE6TS3jvV60QdLKWSGFv4ZjeqTy33LcvpRndDsn1hScjidPewNHwFh+sPdnACC8DcqX0g+Lt1u1WVRcuE+ifdmuTzcyh0BtuyXVogIXeQkMYezxfeDmkLAatGRAkpxenmgB6YEjlMYpTuLtkhDBwEGbS4QczjhdJ90/RZMyx4gxMyLjYmEq/pEcm50EmMn4rwBJpHG0rgpUTLBe4ZSRgPEYWyxaJvCXQMIbWKlJyMuMQrnsV538e79h2JI4aTC7RFseLWS+eBD+QmtEC9dJbzzq/TNCuIGMH2Y5EP+UUr1/SetFFxHa7y/FEw1hbfT+RMD4a56mn7mVLVmM9oWtAFf809FMN+apzBdX88YndeayY4COd3w2ERGn9zWKvPzUx8HMp6LSHHyuNE3s6L5OR6Unc0plGHFet68rC7ruL5XJ31Gx8yX12cq2SYJ1o2L9FSg1AoLmmLiIF5Yg5zB6vdsdpHWT0G0ZhTcVdZcf8W7TEJUeZ3gAVE9alOc5iFzL/lAfIP/0eAkz5tGhg73nx9TVZ3eJeDrjo4kmC1NIgINT7rAxQRGb+eeEYUfdhJUlV4mJh7E8guWqb/6pclI3QcQ8WUGwHPk+gESifTJj9+iES6DoA1Nhk852ieavfffAIRqpfUol/Bwa1K+h6iITJzqvYl+D6mmtYjYUh/5c+snqvUdhnp6yUYtNAhP9K/S98O2BFrPmgJ7QZP2wrF3uw6a8B0w8c3KhVPW0nz9pbNhF6r4Y4ETmkss7TliEg5Wg7wxc8XyYGuhLpaFg6jNry3/mVbgAXDGp9l6XgEA1m7zxfsrWCVGI34CAu6pF2H6dsBEi2h4c/4PCa+XX+XKrPKh7oFZpQd7LCYV+E2IRR/2uUN8X+kXL19pd+pn9dNzTKSskwmaaylrsPKkymrqSk3UKQ9HntkpmwwVfhPao2Vv5TKl6/rCnEOUnWjVu+hsJikrdZp8eb3nVgZwFxTzt6oWQouUuOy2AcT6qv0Enp+BARi53g8nsQ3fELTcnse2HWuUZX/D0AM7IST8C91gLcd0UmsP49ba9UWezOxKMcXKbogJp/rSxY4z6/eM6S2kCJvgkLCe/bAm9J07JfG27UZb1S2iRnBbUlm4fACh20Z91+8JvqqCZElexq+mpXmf3NY/bjwrkXhTk6dJyOMyaT8WskxvIJs+slrOuIxSdKasvCX7+TSoXxr/NSmgKnZ4hdyBmizrVFALhBIWIkO+WEIJLkJVp6z5mrvITGJ18KWcbHK9uvOnInzlfjtjRSZMNoE9yFnzcQGW3gGgrjzxP+SOBpY5CAW6OFOWe/7ILgEldXGuMkgLDd7y6yteor6fY0+T7dQVcfUWgGQ/tiy8dGpnss2IKE7bmt3vZh4dkpIaklxi2aU9Af9JVC3RQ0znFptRj9RO07IkR5T26FJFuO1PLtqmmB8yT8rVPyCcJUvMYc/N4h/AkfhcL1IEup2c2CCHYfFD0WFCyUdhSR8eAdnJpCzurXQ/l0rhQl6u/pUSkU+kuIlHpppRkXaqSneBrrEer9I6T6eyDnwheH/9cs+FJjIEibjbMOB9RmfxsSWe06DEP4t270RjdBKirpDKW/6HM9b0gYykJV0HX0yruDb24USSbxU+eDGoutNd3Dwl7LBX52NX5MQ/JfvgWqStL5up0qguK+Tk+AmP9ZVekPG5SJtX+xb2W6k/Hded/zD5lvHGf+EAVvFBN5I+0AO4DMRzvXEsKWAE5N+4e9W5MMNVnPYmuCmpQpZ1BhMHxyXN/hoOHQel5vyfgpLxxel3e2dY5LqdoTZRzhJf/+YkFTAZpB2+t1hNLw8YjXvH+nTm9qZdbjKGMFp89eTqbPErE8yF46z2fDiNAHa7trK/iS71fmWVB7DlCw9MUtDpgQm61zRJUN3q5sOVtSxxOHcDlSM2JoV7amymA0Koel5z8EEiLq7/9A9zsr1sn0yJZ/87c7yR3A5rfIpHi55usnVmPtMBUnefXasD4GkO5nmvdq2Xe9eYmtBP+UJSvPfzLq/WMsb3xRpBQKF2DdIbgLk2jQpe81DKzOXgi/ryagDZc87JoBfKHf8SiC+mhH7VcHWKfEZ2d3ynqCzcnymYrq3fuZEFL6dPvWq9UE1ADG/L+pvYj9k8da+FqPn1LwdxeUbBrdPrIwykpQ3m5BX3F8QR+9xWPhuA/CcNR41FEu6GHGZrTK+yecKTuiQnR0YUOvlFH76mu86wK4uSH5sUzTYESaAq3k3PGMmdFMb+tVtIuRsO8Hn6QG5MUtlMtgCTb2+4TE+GmGUQGrkKSO0QcMNGkKXeQ6B/tkr7qt/8B2xFQIKiSm6Xt4P3n16+qC0+Xr92TXEDnQ/xPm77WHvjIt+SvP090vrEzua62NIHpjfXUiiVtGigFH0yOfjZLQ6ZbeSfu4p6jNC1RTQlJ4q2refr02QO9YRzMoNmPb29eFDJbITKfCb1pVkrmPjsZpSywgColBzEhbU4BF+NzWb/tq0F8JHjxd1MaYr4R9dTV9cke5R87nY6gpsvwXWE5k57tAHMxM27WnK0fMcI15ieHykolzzRTyFRe7w3j/eb8qOXXvfWFKVPrYrYgQnj2WFvCki7r6i4vJfy7dK42U3RuiOwR2HMy1LUdV8fU30UVqpQr8H/fNzWWiSG78PbgQyp/cFVBIWlSyDcTOHlluPIK9KHV8JlIU5L9vUQ59wLWcxsNKrb5GgwRO0+4nM5zllLXvRs1HXlbZ+/0jwkIhkpBwWrO4OTiUWBrGx9y/m1HTYX/5qZ5QL55raH8Vt+gGAfbPRNTegTfalK7J2+M60muA42kzzPdj4mEzCNAgVsU3d4/+0G4DP+NFhH5qBGrt7vokm0F74jxzOQnCdfvp3OgUZJT5X0NVnOaDzM+GN2VK0PefMpgi4hhJLoUlK28Lzl/zrOceK0vZU/mIaeKKmtE8trnmrmxdluTGb3OFF3LDjiP00tyubxbwFXmeYuGkA52a4zxre5Enq5OUqHNUBHkBH5xOGLn1CDiOoEP6lDqY0sbRFP3TL1Y4RiOPo17y7HKgW89BaxsJt7MLzjcdurFxT21wKvvgL6nO5pM7RCFNkmVpmVcxLwIpDrf85g3DwjF2yCXp4pwxRpifikeUgjZjlzlwlp5Adoh+1odiKU6dZffsvjY5/2JsF9PPApmXcO6eEvWjU+T/Iz5T7dyEs6vEvR+ZpZlP04jXVfCawSNLxkUJUI7cT6jAe5XQXYWgbmb5HFEMPvTdxrVLyzAMZHXXejh0HwKna9VtuwZXURY5nnDijQWI598YUTr/8SuXN+QKV5Ke3xcRykVGXbvAX/BEEDy+MxdJPMX1lXkrx7/nfogCMrsH5ph9WnaXbPyC2rjGJlsOoWHotAdGjXKZ5z8puijMomcD2BVx81iZu4lFHJUBj/+HlFGCRfGH0va0VPfl4VPs7vCwWeMtsVwNYBlRn/pzX5gdkxgtGpcJ+EnSW52hk2ypuGQHD3a9XMZqbqODC8A4rOHMZl9ZpLpTX1ZIaK3f5AhHePkXil+aoQVte6Xaegtho01+/wom/jazkopnnYbpE8d8Hh3XGQn2wJG4yyd5F1o7qXMT8TNDjlVczHPndDoKrwDYF1MAVKB85HHfcYMazEMhlh6z+LRh9YvJPQhaseb0TGLko+1DPtuMZuLxZzE7QkWDjY77cVAQzWt4+yR5OBI1uVRglZ6cEJn1wRwzD26i5oDKqERuYmbEoks/i+jT+hiSfFjatQ9WC3DCd6F2ZXYQfRvg7Ny5WCeCZZMOVWLhAqjYqjTCSjuHaH31tzIL8tUP7NAORMncaRu5DrPRSnbgM3P34+tXZsvv+9Uq2ZERGTD3m/18QN7yenEsaPizn4T1jrOzunv5ADA50WXdZnjMjIlQpjfSVXmPP8vATPjIQDQ8OOlqN0HilcISSY28b6KwXO2l2FUFZ0aDAqnYVZJ1deq+QULlyD+PUf6W66x5i327le1VsrUFL0jWKZopAF3Aro7VJnejM6jte4sEO4yTcOzhwpO+mjRgQwpqhfMTd7ybZeYfzBPc2DC3XKBhnvyTjbkQ6g60WOLVv3v3FpRYg3Fd53+WbLssf/YVQgxD3q24XRTC728WfZfvkNX5vA2j5TDjTDmJoR8+mtJkoMf0k4R/PbBr8wG05IsyguwZGKPLxiI5J+Wp9+VHQ3XDlQAkuhz4eCqxFToCK1zf59tY7mwYMDlRsKWXtv/Ctd3kE4zKKlswqdyLNhgI1eOfULDDh7Nng/d9DfM12aOHi+N6ATvzqNXMCyzvqiRrH89iVWmjII7TSMgyl2TK5EeM0ZVmQJ0iTMXwacxaIk/3fnQfifAONx1i25pnowo16+5/AchlUoDoa4KIQeDvRLVREaSH4eaXfsSxNNdOWzidNn8HnXollTJ6Nk0QoE6a60YRr0RO2sFPq+cng9PhgJzUOYbILXxpxpgE1zwOYvdSYV4yrgP4jlyP6xQsdTYtJ46KG/pYetP531BLPMJw/8eZwLXg30+f1qQ3AeajJdJ3pUbbbTiyLFWI2c3OF5Bw6XZhTUxxffMWvy8TG/tVsgo6QSg9C1nnIqx6YmYsfJiNV1vO0x6DSk+iIgvT1ZCoQZ5tqoCGrpAwFzSechX1YVmvr50N1moZN4qZPuqh+i/wM2XqhXOq1PDp2i8fn04IVXJaI/2p0A8Y3QNc2NJSgC5FZHc8zDw7N9Ov+8uCMtrqk7Qk6UohFd48aLeQKdn7FQlh2agU6t7kKdqxodJ0NxdmVhhI3QGLwdmeZHDG4et/lJrsBPT6rV0waWdYj7IGYn9NGpfbEeG+BsBBBL5y/qMg9V3nBva2uWLsdZ2p4eOsOuSDXsYqnOqykNu+0M55HLXW9nvgdddum98KgQn2AQNP9ARnxPCoVQiVz4aKUsp1cjcGwaWdFcmGu6InE3iJ6j821Zi3hYWQhVxFXtU+gOUOmE1O/Lc2vSG9UmaCQCDLz3KxJyKYMIliJH9n4VOq/XZfWKoLWJxQsjZvjKvcmD/fy7zsAXEuXx379sdd6YVwlRsHlkAbij2IhMw6LMk1gsxG5zfiV8AT7vus1XAt71NkAoJXFydRwjIZlF+0Q6Yczkjn9twqclQ+kbPByS1KuYI/fFx+FhuUN4LMlndC5vb9Eg9hSsAeTQ76CSY1dcj271O6//YxxfHR0c7dmPMJKvkUiXkeYrXZtbFTyFfH4K2iydkFlVMgb/lEICH/9HA6DzA1ocfvDE8hp4+aX6F/V8/1p1hvhsOXwGe9EWUT0BCBpH8wY+s6DaU0hgUtWfRrd1tubslai6pZIiCnD4KyoGN5ozSVb2rAfsQABkJvVG2cI971Bf/tD6DmA8c3t+rDe2KBSDkzBaw9FqhZ2rn6K4aC1QvRI4pl+xP4WTiQmyjJfECOY2ULcjsyWsw+k4ijEszEssYfQ0z53seZv3/n6Q6h1CGHgQpF+A0yUVTSGVhdvXIU748BSYx42NQnEfOsM1frwpQksvlSVFPI6MCtAe3X68Lu7oyhUYa1gre70Us5EYyibSSvlPeEgipU8aawVgkq3ExA7VtTfpXvod1ivjj61i+vMyUIhHNQlECQCnVqjHRv4aI+WHPh62HCOX3FWqxyhWB6+5c82AuE5KBgDhyfjhdCquKisvCSePdpcBg1CFfCpSqqjk/DKWEidR9hM1TEflHJxJxJPdly9zDQamqdRq0fTMpe2tOxanHQ/4TE4Z0VRPViQtqu5mOJwktHp8d/6lV2DcVXMffVYmJTmQTQfQXuklBeOpILpVtyh1ALF7EgLR82e8MpktFrev5lMgO5hviyifzkmrc+rdz8yKlMK1vjhTZLB7FzfAwkxIrkXwM77oC7Z7PUVCmG6st6wsENiwCZeK8MJVRzFZ+ZGnpZyqxFi1R+UUCk0BaOJnzJfBaEaYd7fW4ME9VC/I2yskG4CbujomCLbeQqiQXRZ5iAHW+9pO+7JrXWmcirKbqx6OQ8vxh7QIEkQqjTuBiCqodVcWNK3MA+QRiWD5HbDnPQXCyu2wXFUBUcsgndECyWGcJq7tlzy+E4jXlGuXxIOa6nfJtW7LXvT5yw7wnZeWtZqo2YcN8cuIm60wTdHxUZB5FTWd3miAddzXMw/Rgw+CF6rb3zP8jRBrXgnfH7Y40ztKSSfqJ4JzVTTz1pXiKR4k7YI5NSiEuHqQh0YRoB+7HzbS9q3Oi/BrJq+ZkgpTa2uspGDPKj5V4aH4T2EEfYDg/CfBgPQCL6TSC1GpdniXl3pnY7kS8Sz6cz8fGkDiP+zic+w4cfe32fyNvZG66ZPInKTxzhcja+xY+fmsDos6MP5nMGAvVnqElae/0bfiCiHALPWZONx49xhVA+98yVRNgO10Uhg5cwvlz9Z6abu+z6UZ2hjEKtM0LiNRse8xZ372hKx9Lv5JpiO/LZxstmlLEalQ9TAIRjGml/RLWnyz8batI8joFbHIFdwtlu5IxmGpaIzF4Tc5bobrA6sLcmqMfEdZ5aa+QL13iF2DMawmIK4e65yrSE0Th20L9ONEDxwYWD5nuieD732SDjUbopHFp0Z025VMEpZrH/FzKu0lfD2afu7+kH9Yrva5gpDlKsz/mIlSSlvzK4tdOCqejqb+0mAPluGJXyzyuCXtKsjKnvficIEuCK80K4io/Y5LEi2etfyjShbV9KX3iH1EX00yV9YOUGtKU3/1+f+FXNZ9DaUQDdeUgDr8XCzVS59mOfi3dFodpskWJJRlJKIVAKsFjYY2LBeS1i7dOEwPYknzd+uwuVUynPKK5fnSTkVwAoGrSMPVRmuo9NF5OHmCvYcZsOMwuSrNexIxOR3kBUjl0WCvlOKzx4AoVs+/8X9M4FHjaXy5l44uu59t3hpVVRmkLcDzGvfSRk+NuwnTNcXOCZgdyPSM7V8C27ovx40+qZS60JGwbBpjME/odoEF98n7hVeMJrudYFc2hKxpzD6Fo/vZhQsuzRmle+BMSvHE6IyRcNuFcFpqRBgsvodcgopu1ngC2SUEFpWVbnFggPINWdjmIYQHpN9FwFPv0rvwwL7xa7HXuIGVx4HaJvcERnUqmUH4h/anWYxkPg3/XELLL28vy+j3CRABPYpazO2VNbT+i1avZ+jFj2+e+V2R+u8wW3wQRMLrZjIzraTTv+gzoKFAaTRbRtofNfhX9/JXzSLuCeg8Q7nve9ckjt2IyrW6rcgmH2PEAsfRveGXMjqYuS5ANQKAzQNrmZYeerol3ZbOF6ADan19TmgNrGawTat81KgVyt31xjeOt2YHzP8dv2mUDunJc9BkEnI9qUBRIPNM8GvfKtcFQYgchcrrKo24TAkpnf4NCJgw9aQExYQqZI97sLGq49LdFTARDLY4i3ETFplSsMZxMp7hYuRd0i8jLve7VLa/dUhn0Ye4WBwcPnqKAf3l+8vmV6TxWBZyfJMda1RfIuyD4oM63yzm8aU6t4HTXSbdJfGRgEBMjI+3ENnsWsXiRawuPDKFKPvZ5zV4UKQfIOKxVCJxfIy4SOKgNe2qV43WvcULjCdQDVuonMEy1+FRbY9cKOZrABRPa6VLUnu5ZnxYy7PuvFVueI38G0QkBTCS/Y5vm5dGtW6YV6qptAmxul5U+iCeiLhAmQCCj0CLEySfmJFiBWlOBNY2bbITPNm66/PkgLWVDmYZgvTbFlfL9k3Vou8CFpGAuwUlg9oReQpwtnwn74MMmlIm4YXudSqX+8DarwxMGFRIdocAqOKXpxEq+VK6MhcqNOQSm0PhCc21ZYuYPzJeWboLjadRxalmS3v4QJSZJib5h0dYosHiuKR9nu0iIPmfgN8RjFQhsMJQWHNKlhywEnEaUVDhQCg8H3FyQdy5MPXneoxewC+t2BZBBVsdVww4BGmLu3II1y1g4RGAA2qbRuBeRIKWLTCrcoZkZ4FK2lG8Spk41ssWae2mq5lVMv6T+kfw3K77vroJMDvJMdN6kgb+7r/bQqNOcCnQvSFRWanEd9fAla501+v/bsHXH49KTTlbxeTKELTVbYyoH2DdwDGQojyHPeMPVX5rjmyPIhHY4+/jS33EtJf56pCvhav4PvXDvIQecAZjEFlZev0qSKmeVuXwMZDSu4AUAYPa+ux/s3U+5pyj6jnvHBKkRb6DgQT8Jyf+YTqwwxiAPiQuXFozMwSboJxeNo+JCeEZ1I0ZnHiL9rysxCWk6aF3b/lmfbzuN8ouOxQaAtB25cu6BH10qTxCxSgER0ttcvUNNud+Yc8UZvgB8D02138FFSGuWcysUJMHbu1zN0Zubx6Q2TWcoKI0d5kMn5vVjyQhnEEpLphbUEooaxg+H/iYytCrggdoLbZ9KrZcsZXLP27FMYCdPd32lQw0Wb6edZe0bPscGbLvHofWvJ5487y136wYV4ERDUAviaEeF/k0MXuVTIySaWlukB3R5/+WLAMPSOVDHqqCICK1Z961cbHCe+ucLfxiIiG6Xn5f9l4EVPiIeezQZXsXmvkq6JnFYbBBNb6HOnoSXtUlRvgGA+ZTco1soRCFRDLTHca5c4GAZuQ6jX1sGV/hAUM7z9jcgspzTX0TpIAN3xPqcaA2UOh8Vf9/dvmuObrj7LN6DQJmTJiWiM94Co1F5IQg/6Qlw/q1ES6WhVgignv+yJSg+WGvT8X+webLzQcvSKjKS0EB5rpb/jjzIRudsbOLu5hq67LujGhF6WnBjVjuo49+tlSLQS4CgcQo26aJ/4ZB03V/4lFzIAgdH1pBMYfPHv1CQFghmBTO32GvrWCN31BQqmj34XMk01pJtQguUwAR39ak96Zj0Dh86odUsVuQ38uL//uceLWgdOfnxzplUv9Rpjp+ZXmO2PfQfbQdVV+zIxNKSiuo0D1/Uf2/PjJuIHPws77F0jiuT9+uUamR97YFVQRQviYj0cylwCHjZwkR8f1QYT2VCtGZVjFkzh38Xh/P9jp20PexNmpb+7Rx44/mO6PZJ1txvXyPw/2soTyCuSCKZQsH0GVo5Fv4bubpBsYqyu88MiokoJEhk+4ken5qLVfvycKW/ZpkSfv9PqTt8Q3Crg1CTvdNSPLlnG9TfO0tKPwDUdpzfVVSZSK6gIo3+pYooB2oPwFmx239VUAz3sUm0RjZKBRaOk+6UuRYLwpBeYNj4SwIE96MgmITP4/PmzBHaHpbROxw5WfAZ+O5/z0R7fd6sfgw2lwt7ebkK62v/DaAeBH30nguQQ0JAcxXiQtvNmEJ0VwR2wr+dLOs72jEqXY79Dn3/TjlAGaWSp/o5gdZHuvKeXg3SjAyXXIlsqugXzQpYU5B8M5fHw+pW/5XmofVS+PUhuZuryYhKtLEo0EIBC5dz2tPTG+ltImwP2cOiUYBjr4Wy9/NLTWMwKkUyIes1hF+m0T7U/CZSFv7NJaEqeh9c2Ia1uPg6tFKgbfCorzYK1IxoaLsAa1Blm3jzasc/EuSFPFe6aUHR0McBtnNWvYeJCyTAdpgnMZ50t7uWsO0IUA75yaJu9ccX/xdj+TGuIxX3rdbpOiCYIPs6mt0D5et8gKVScXal4Rp4J1dArYPb3fvXXDonvrqxytB8mfVw37oGpBdngbSzrOHMctMlcVaMjQ3EabooEJprBOiZcVDDklkkZSPE1sXjWghpKOrAYvm03M6jsA2hbzgI8MNjogtPCPHpgKU0Fhk34fsaLmxiYJFGdcEDKzVkPPn7C4WzCZofsHS6TOD2jV5CzcoYp3ZummTsJ22TtkoLxLr1OV/Yb8gO5nJhWenCJtKOe/n0cv/q1eRnMvnXg6+jiIHLLHGlLlDhftEDuONy7mC1lGo3Q7+xgV6HUMbgboqZBtStSRpOFaNdiYrznojnzkRIt1f3ZHY672clvm295Fk5GzoG8LwZBrvJqOKxE3s2JVGmE0AAEbacZ2nmLLxGimpzLgPonVPr1UVAyr1M89I3mrb2JysbkdYxGVujO24S1GTADWrPioodjDn0ll97jE6DwK1bZR2V7Y26mCK+svjv+qwPFISAYvUHPfa+9pWbskXL8ZCQ21NLHPBvInfLsWEhYWP6ivLQMVp0RA8l0hmxRjJjXcCMRrMSHZNYK4xsJyqlOVwRT/RA//dETXD7xqNNuHSfQH7Ob96ZWaDaIyxbyWkR1Pq2QOt0vuW2ektPe8bnqUXh8QKIoLq1TwyjBAk9ybp6rCHPvG+m06AmV7QXCCi+bDOsZ3EhaLEDATz95TcfKqSZAo7hG0Yn6vhk230lOw6lDCFIOt34RkCR9M89FmCFFCc9QSdb3u/K/dKi0D2tY2Xvzr0FFkg0ELNow7PfXwFqp94BxYlIEfsRui8sh/pD5/6wcrQdfyFJ/XvP2lfyoukAcIn4BsnKYsjiiDgkkzA9alKumQF62rAXl+t6r40eT9MW/Zl+EABpP7DX/XLraIOk8HzzxfZbByz+EM4DwmR5eYWu1PWhbEkcSNwvKPJOPAzys77Pw8XtZmzSq3JBY2lBbrqmcqza5K2jP8VvRmzVaU+Ia1iL5EKB23OAXvLUZZMJHNx8s6/+maxMSNIRGAV4tM3EmAe6J14tRZndw3eBt6JX4dc2xKE3L4kWAw16wAAAAAA=";
var un = Object.getOwnPropertyDescriptor, pn = (t, e, i, a) => {
  for (var s = a > 1 ? void 0 : a ? un(e, i) : e, n = t.length - 1, r; n >= 0; n--)
    (r = t[n]) && (s = r(s) || s);
  return s;
};
const mn = "#EA0029";
let Ne = class extends H {
  get _branded() {
    const t = this.config.options ?? {};
    return t.brand === "roborock" || t.branded === !0;
  }
  relevantEntityIds() {
    return [...this.entityId ? [this.entityId] : [], ...Rt(this.hass, this.entityId).ids];
  }
  _progress() {
    const t = Rt(this.hass, this.entityId);
    if (this.vm.rawState !== "cleaning" || typeof t.progress != "number") return d;
    const e = Math.max(0, Math.min(100, Math.round(t.progress))), i = [`${e}%`];
    return typeof t.area == "number" && t.area > 0 && i.push(`${$(t.area)} m²`), typeof t.cleaningTime == "number" && t.cleaningTime > 0 && i.push(`${Math.round(t.cleaningTime)} min`), o`<div class="progress">
      <div class="track"><div class="fill" style=${`width:${e}%`}></div></div>
      <div class="meta"><span>${i[0]}</span><span>${i.slice(1).join(" · ")}</span></div>
    </div>`;
  }
  _controls(t) {
    const e = this.vm, i = e.rawState, a = !e.available;
    return o`<div class="controls" @click=${(n) => n.stopPropagation()}>
      ${i === "cleaning" && t.pause ? o`<hd-icon-button
            icon="mdi:pause"
            label="Pause"
            variant="soft"
            .disabled=${a}
            @click=${() => this.entityId && this.callService(Ze(this.entityId), { errorVerb: "pause" })}
          ></hd-icon-button>` : o`<hd-icon-button
            icon="mdi:play"
            label="Start"
            variant="filled"
            .disabled=${a || !t.start}
            @click=${() => this.entityId && this.callService(re(this.entityId), { errorVerb: "start" })}
          ></hd-icon-button>`}
      ${t.returnHome ? o`<hd-icon-button
            icon="mdi:home-import-outline"
            label="Return to dock"
            variant="soft"
            .disabled=${a || i === "docked"}
            @click=${() => this.entityId && this.callService(oe(this.entityId), { errorVerb: "dock" })}
          ></hd-icon-button>` : d}
    </div>`;
  }
  _fanSpeed() {
    const t = this.vm, i = (t.stateObj?.attributes.fan_speed_list ?? []).filter((s) => !["off", "custom"].includes(s));
    if (i.length < 2) return d;
    const a = i.map((s) => ({ value: s, label: V(s) }));
    return o`<div class="fan">
      <hd-segmented
        .options=${a}
        .value=${t.stateObj?.attributes.fan_speed ?? ""}
        .disabled=${!t.available}
        label="Suction power"
        @hd-select=${(s) => this.entityId && this.callService(g1(this.entityId, s.detail.value), { errorVerb: "set suction for" })}
      ></hd-segmented>
    </div>`;
  }
  /** Translucent-white transport pills used on the branded hero. */
  _heroControls(t) {
    const e = this.vm, i = e.rawState, a = !e.available, s = i === "cleaning", n = (r, c) => this.entityId && this.callService(r(), { errorVerb: c });
    return o`<div class="controls" @click=${(r) => r.stopPropagation()}>
      ${s && t.pause ? o`<button class="pill primary" aria-label="Pause" ?disabled=${a} @click=${() => n(() => Ze(this.entityId), "pause")}>
            <hd-icon icon="mdi:pause" .size=${20}></hd-icon>
          </button>` : o`<button class="pill primary" aria-label="Start" ?disabled=${a || !t.start} @click=${() => n(() => re(this.entityId), "start")}>
            <hd-icon icon="mdi:play" .size=${20}></hd-icon>
          </button>`}
      ${t.returnHome ? o`<button class="pill" aria-label="Return to dock" ?disabled=${a || i === "docked"} @click=${() => n(() => oe(this.entityId), "dock")}>
            <hd-icon icon="mdi:home-import-outline" .size=${20}></hd-icon>
          </button>` : d}
      ${t.locate ? o`<button class="pill" aria-label="Locate" ?disabled=${a} @click=${() => n(() => f1(this.entityId), "locate")}>
            <hd-icon icon="mdi:map-marker-radius" .size=${20}></hd-icon>
          </button>` : d}
    </div>`;
  }
  /** Full-bleed Roborock-branded hero (2×2): red panel + product shot. */
  _renderHero(t) {
    const e = this.vm, i = Rt(this.hass, this.entityId), a = e.rawState === "cleaning", s = a && typeof i.progress == "number" ? Math.max(0, Math.min(100, Math.round(i.progress))) : void 0, n = [];
    i.battery != null && n.push(`${Math.round(i.battery)}%`), i.area != null && i.area > 0 && n.push(`${$(i.area)} m²`);
    const r = s != null ? o`<div class="hprogress">
            <div class="prow">
              <span>${s}%</span>
              <span>${i.cleaningTime != null && i.cleaningTime > 0 ? `${Math.round(i.cleaningTime)} min` : ""}</span>
            </div>
            <div class="htrack"><div class="hfill" style=${`width:${s}%`}></div></div>
          </div>` : d;
    return o`
      <hd-widget-frame
        bleed
        .size=${this.currentSize}
        .accent=${e.accent}
        .hasDetail=${!0}
        .quickKind=${"none"}
        .unavailable=${!e.available}
        .actionState=${this.actionState}
        @hd-activate=${() => this.openDetail()}
      >
        <div class="hero" ?data-cleaning=${a}>
          <div class="glow"></div>
          <img class="robot" src=${hn} alt="" aria-hidden="true" draggable="false" />
          <div class="top">
            <div class="brand">roborock</div>
            <div class="htext">
              <span class="hname">${e.name}</span>
              <span class="hstatus">${e.displayState}</span>
              ${n.length ? o`<span class="hmeta">${n.join(" · ")}</span>` : d}
            </div>
          </div>
          <div class="bottom">
            ${r}
            ${this._heroControls(t)}
          </div>
        </div>
      </hd-widget-frame>
    `;
  }
  renderContent() {
    const t = this.vm, e = this.currentSize, i = i1(t.stateObj), a = e !== "1x1";
    return this._branded && e === "2x2" && t.exists ? this._renderHero(i) : o`
      <hd-widget-frame
        .icon=${t.icon}
        .layout=${this.layout}
        .name=${t.name}
        .stateText=${t.displayState}
        .secondary=${t.secondary ?? ""}
        .size=${e}
        .accent=${t.accent}
        .active=${t.active}
        .unavailable=${!t.available}
        .hasDetail=${!0}
        .quickKind=${e === "1x1" ? "toggle" : "none"}
        .quickLabel=${t.quickAction.label}
        .actionState=${this.actionState}
        @hd-quick=${() => this.runQuick()}
        @hd-activate=${() => this.openDetail()}
      >
        ${a ? this._controls(i) : d} ${e !== "1x1" ? this._progress() : d}
        ${e === "2x2" ? this._fanSpeed() : d}
      </hd-widget-frame>
    `;
  }
};
Ne.styles = x`
    .controls {
      display: flex;
      gap: 8px;
      align-items: center;
    }
    .fan {
      margin-top: 4px;
    }
    .progress {
      display: flex;
      flex-direction: column;
      gap: 5px;
    }
    .progress .track {
      height: 6px;
      border-radius: var(--radius-pill);
      background: var(--idle-bg);
      overflow: hidden;
    }
    .progress .fill {
      height: 100%;
      border-radius: inherit;
      background: var(--accent-ring, var(--accent));
      transition: width var(--motion-state) var(--ease-standard);
    }
    .progress .meta {
      display: flex;
      justify-content: space-between;
      gap: 8px;
      font: var(--text-meta);
      color: var(--text-tertiary);
      font-variant-numeric: tabular-nums;
    }

    /* ---- Roborock branded hero (2×2) ------------------------------------- */
    .hero {
      position: relative;
      height: 100%;
      width: 100%;
      overflow: hidden;
      color: #fff;
      isolation: isolate;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      padding: 18px 20px;
      box-sizing: border-box;
      background: radial-gradient(125% 120% at 12% -10%, #ff2a4d 0%, #ea0029 40%, #a5001b 100%);
    }
    /* readability scrim so white text clears AA on the red */
    .hero::before {
      content: "";
      position: absolute;
      inset: 0;
      background: linear-gradient(118deg, rgba(74, 0, 12, 0.6) 0%, rgba(74, 0, 12, 0) 48%);
      z-index: 0;
    }
    .hero .glow {
      position: absolute;
      right: 0;
      bottom: -6%;
      width: 74%;
      height: 82%;
      background: radial-gradient(closest-side, rgba(255, 255, 255, 0.24), rgba(255, 255, 255, 0) 72%);
      z-index: 0;
      pointer-events: none;
    }
    .hero .robot {
      position: absolute;
      right: -5%;
      bottom: -4%;
      height: 86%;
      width: auto;
      object-fit: contain;
      filter: drop-shadow(0 14px 20px rgba(0, 0, 0, 0.42));
      z-index: 1;
      pointer-events: none;
      user-select: none;
    }
    .hero[data-cleaning] .glow {
      animation: robopulse 3.2s ease-in-out infinite;
    }
    @keyframes robopulse {
      50% {
        opacity: 0.6;
        transform: scale(1.06);
      }
    }
    @media (prefers-reduced-motion: reduce) {
      .hero[data-cleaning] .glow {
        animation: none;
      }
    }
    .hero .top,
    .hero .bottom {
      position: relative;
      z-index: 2;
    }
    .hero .brand {
      font: var(--text-meta);
      font-weight: 700;
      letter-spacing: 0.16em;
      text-transform: lowercase;
      opacity: 0.9;
    }
    .hero .htext {
      margin-top: 6px;
      max-width: 62%;
      display: flex;
      flex-direction: column;
      gap: 2px;
    }
    .hero .hname {
      font: var(--text-widget-title);
      font-weight: 650;
      color: #fff;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    .hero .hstatus {
      font: var(--text-secondary-state);
      color: rgba(255, 255, 255, 0.94);
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    .hero .hmeta {
      font: var(--text-meta);
      color: rgba(255, 255, 255, 0.78);
      font-variant-numeric: tabular-nums;
    }
    .hero .hprogress {
      max-width: 60%;
      margin-bottom: 12px;
    }
    .hero .hprogress .prow {
      display: flex;
      justify-content: space-between;
      gap: 8px;
      font: var(--text-meta);
      color: rgba(255, 255, 255, 0.9);
      font-variant-numeric: tabular-nums;
      margin-bottom: 5px;
    }
    .hero .htrack {
      height: 6px;
      border-radius: var(--radius-pill);
      background: rgba(255, 255, 255, 0.28);
      overflow: hidden;
    }
    .hero .hfill {
      height: 100%;
      border-radius: inherit;
      background: #fff;
      transition: width var(--motion-state) var(--ease-standard);
    }
    .hero .controls {
      display: flex;
      gap: 8px;
    }
    .hero .pill {
      appearance: none;
      border: none;
      cursor: pointer;
      height: 42px;
      min-width: 42px;
      padding: 0 12px;
      border-radius: var(--radius-pill);
      background: rgba(255, 255, 255, 0.17);
      color: #fff;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 6px;
      -webkit-backdrop-filter: blur(4px);
      backdrop-filter: blur(4px);
      transition: background var(--motion-state) var(--ease-standard), transform var(--motion-press) var(--ease-standard);
    }
    .hero .pill:hover {
      background: rgba(255, 255, 255, 0.28);
    }
    .hero .pill:active {
      transform: scale(0.93);
    }
    .hero .pill.primary {
      background: #fff;
      color: ${Zi(mn)};
    }
    .hero .pill.primary:hover {
      background: rgba(255, 255, 255, 0.88);
    }
    .hero .pill:disabled {
      opacity: 0.45;
      cursor: default;
      transform: none;
    }
    .hero .pill:focus-visible {
      outline: none;
      box-shadow: 0 0 0 3px rgba(255, 255, 255, 0.65);
    }
    @media (prefers-reduced-motion: reduce) {
      .hero .pill:active {
        transform: none;
      }
    }
  `;
Ne = pn([
  b("hd-widget-vacuum")
], Ne);
var gn = Object.defineProperty, fn = Object.getOwnPropertyDescriptor, A1 = (t, e, i, a) => {
  for (var s = a > 1 ? void 0 : a ? fn(e, i) : e, n = t.length - 1, r; n >= 0; n--)
    (r = t[n]) && (s = (a ? r(e, i, s) : r(s)) || s);
  return a && s && gn(e, i, s), s;
};
let pe = class extends H {
  constructor() {
    super(...arguments), this._forecast = [], this._fetchedFor = "";
  }
  hasDetail() {
    return !0;
  }
  updated() {
    (this.currentSize === "1x2" || this.currentSize === "2x2") && this.entityId && this.hass?.connected && this._fetchedFor !== this.entityId && (this._fetchedFor = this.entityId, this._loadForecast());
  }
  async _loadForecast() {
    const e = this.vm.stateObj?.attributes.forecast;
    if (e?.length) {
      this._forecast = e.slice(0, 5);
      return;
    }
    if (!(!this.hass || !this.entityId))
      try {
        const a = (await this.hass.callWS({
          type: "call_service",
          domain: "weather",
          service: "get_forecasts",
          service_data: { type: "daily" },
          target: { entity_id: this.entityId },
          return_response: !0
        }))?.response?.[this.entityId]?.forecast ?? [];
        this._forecast = a.slice(0, 5);
      } catch {
        this._forecast = [];
      }
  }
  _metrics() {
    const t = this.vm.stateObj?.attributes ?? {}, e = [];
    return t.humidity != null && e.push(["mdi:water-percent", `${Math.round(t.humidity)}%`]), t.wind_speed != null && e.push(["mdi:weather-windy", `${$(t.wind_speed)} ${t.wind_speed_unit ?? "km/h"}`]), o`<div class="metrics">
      ${e.map(
      ([i, a]) => o`<span class="metric"><hd-icon .icon=${i} .size=${14}></hd-icon>${a}</span>`
    )}
    </div>`;
  }
  _forecastStrip() {
    return this._forecast.length ? o`<div class="forecast">
      ${this._forecast.map((t) => {
      const e = new Date(t.datetime), i = Number.isNaN(e.getTime()) ? "" : e.toLocaleDateString(void 0, { weekday: "short" });
      return o`<div class="day">
          <span class="dow">${i}</span>
          <hd-icon .icon=${qe(t.condition ?? "")} .size=${20}></hd-icon>
          <span class="hi">${t.temperature != null ? `${Math.round(t.temperature)}°` : "–"}</span>
          ${t.templow != null ? o`<span class="lo">${Math.round(t.templow)}°</span>` : d}
        </div>`;
    })}
    </div>` : d;
  }
  renderContent() {
    const t = this.vm, e = t.stateObj?.attributes ?? {}, i = this.currentSize, a = i === "1x2" || i === "2x2", s = e.temperature != null ? `${$(e.temperature)}°` : "—", n = this.layout === "value";
    return o`
      <hd-widget-frame
        .icon=${qe(t.rawState)}
        .layout=${this.layout}
        .name=${t.name}
        .stateText=${n ? s : V(t.rawState)}
        .size=${i}
        .accent=${"accent"}
        .active=${!1}
        .unavailable=${!t.available}
        .hasDetail=${!0}
        .quickKind=${"none"}
        @hd-activate=${() => this.openDetail()}
      >
        ${n ? d : o`<div class="temp">${s}</div>
              ${this._metrics()} ${a ? this._forecastStrip() : d}`}
      </hd-widget-frame>
    `;
  }
};
pe.styles = x`
    .temp {
      font: var(--text-value-lg);
      font-variant-numeric: tabular-nums;
      color: var(--text-primary);
    }
    .metrics {
      display: flex;
      gap: 14px;
      flex-wrap: wrap;
      margin-top: 2px;
    }
    .metric {
      font: var(--text-meta);
      color: var(--text-tertiary);
      display: flex;
      align-items: center;
      gap: 4px;
    }
    .forecast {
      display: flex;
      justify-content: space-between;
      gap: 6px;
      margin-top: 6px;
    }
    .day {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 4px;
      flex: 1;
    }
    .day .dow {
      font: var(--text-meta);
      color: var(--text-tertiary);
    }
    .day .hi {
      font: var(--text-secondary-state);
      font-weight: 650;
      color: var(--text-primary);
      font-variant-numeric: tabular-nums;
    }
    .day .lo {
      font: var(--text-meta);
      color: var(--text-tertiary);
      font-variant-numeric: tabular-nums;
    }
  `;
A1([
  C()
], pe.prototype, "_forecast", 2);
pe = A1([
  b("hd-widget-weather")
], pe);
var vn = Object.defineProperty, bn = Object.getOwnPropertyDescriptor, H1 = (t, e, i, a) => {
  for (var s = a > 1 ? void 0 : a ? bn(e, i) : e, n = t.length - 1, r; n >= 0; n--)
    (r = t[n]) && (s = (a ? r(e, i, s) : r(s)) || s);
  return a && s && vn(e, i, s), s;
};
let me = class extends H {
  constructor() {
    super(...arguments), this._trend = [], this._fetchedFor = "";
  }
  hasDetail() {
    return !0;
  }
  get _opts() {
    return this.config.options ?? {};
  }
  relevantEntityIds() {
    return Object.values(this._opts).filter((t) => typeof t == "string");
  }
  updated() {
    const t = this._opts.gridPower;
    this.currentSize === "2x2" && t && this.hass?.connected && this._fetchedFor !== t && (this._fetchedFor = t, this._loadTrend(t));
  }
  async _loadTrend(t) {
    if (!this.hass) return;
    const e = await ai(this.hass, t, 24);
    this._trend = e.map((i) => i.value);
  }
  _num(t) {
    if (!t || !this.hass) return null;
    const e = this.hass.states[t];
    if (!e) return null;
    const i = Number(e.state);
    return Number.isFinite(i) ? i : null;
  }
  _powerText(t) {
    const e = Math.abs(t);
    return e >= 1e3 ? { value: $(e / 1e3), unit: "kW" } : { value: String(Math.round(e)), unit: "W" };
  }
  renderContent() {
    const t = this._opts, e = this._num(t.gridPower), i = this._num(t.solarPower), a = this._num(t.solarToday), s = this._num(t.forecastEndOfDay), n = this._num(t.solarForecastRemaining), r = this.currentSize, c = (e ?? 0) >= 0, l = e == null || c ? "var(--text-primary)" : "var(--state-eco)", h = e == null ? { value: "—", unit: "" } : this._powerText(e);
    return o`
      <hd-widget-frame
        .icon=${c ? "mdi:transmission-tower-import" : "mdi:solar-power"}
        .name=${this.config.name ?? "Energy"}
        .stateText=${""}
        .size=${r}
        .accent=${c ? "accent" : "eco"}
        .active=${!1}
        .hasDetail=${!0}
        .quickKind=${"none"}
        @hd-activate=${() => this.openDetail()}
      >
        <div>
          <div class="hero" style=${`--flow-color:${l}`}>
            <span class="num">${h.value}</span><span class="unit">${h.unit}</span>
          </div>
          <div class="flow-label">
            ${e == null ? "Grid power unavailable" : c ? "Importing from grid" : "Exporting to grid"}
          </div>
        </div>

        <div class="stats">
          ${i != null ? o`<hd-status-badge tone="eco" icon="mdi:solar-power-variant" text=${`${this._powerText(i).value} ${this._powerText(i).unit} now`}></hd-status-badge>` : d}
          ${a != null ? o`<hd-status-badge tone="eco" icon="mdi:weather-sunny" text=${`${$(a)} kWh today`}></hd-status-badge>` : d}
          ${n != null && i == null ? o`<hd-status-badge tone="neutral" icon="mdi:chart-bell-curve" text=${`${$(n)} kWh left`}></hd-status-badge>` : d}
          ${s != null && (r === "2x2" || r === "2x1") ? o`<hd-status-badge tone="neutral" icon="mdi:chart-line" text=${`${$(s)} kWh forecast`}></hd-status-badge>` : d}
        </div>

        ${r === "2x2" && this._trend.length > 1 ? o`<div class="trend">
              <hd-trend .points=${this._trend} .color=${"var(--accent)"} .summary=${"24 hour grid power"}></hd-trend>
            </div>` : d}
      </hd-widget-frame>
    `;
  }
};
me.styles = x`
    .hero {
      display: flex;
      align-items: baseline;
      gap: 6px;
    }
    .hero .num {
      font: var(--text-value-lg);
      font-variant-numeric: tabular-nums;
      color: var(--flow-color, var(--text-primary));
    }
    .hero .unit {
      font: var(--text-widget-title);
      color: var(--text-secondary);
    }
    .flow-label {
      font: var(--text-meta);
      color: var(--text-tertiary);
      margin-top: -2px;
    }
    .stats {
      display: flex;
      flex-wrap: wrap;
      gap: 6px;
      margin-top: 4px;
    }
    .trend {
      height: 44px;
      margin-top: 8px;
    }
  `;
H1([
  C()
], me.prototype, "_trend", 2);
me = H1([
  b("hd-widget-energy")
], me);
const N = 25;
function yn(t) {
  if (!t) return null;
  const e = Number(t.state);
  if (!Number.isFinite(e)) return null;
  const i = String(t.attributes.unit_of_measurement ?? "").toLowerCase();
  return i === "kw" ? e * 1e3 : i === "mw" ? e * 1e6 : e;
}
function Pt(t) {
  return t > 0 ? t : 0;
}
function wn(t) {
  const e = t.grid ?? 0, i = Pt(t.solar ?? 0), a = Pt(t.car ?? 0), s = t.carActive ? a : 0, n = Pt(e), r = Pt(-e), c = Pt(i + e - s), l = n > N || r > N, h = i > N, u = t.carActive && s > N, p = n > N ? "import" : r > N ? "export" : "idle", f = {
    watts: p === "export" ? r : n,
    direction: p === "import" ? "toHouse" : p === "export" ? "toGrid" : "idle",
    active: l,
    // Exported energy is solar in origin; imported is grid.
    source: p === "export" ? "solar" : "grid"
  }, g = {
    watts: i,
    direction: h ? "toHouse" : "idle",
    active: h,
    source: "solar"
  }, v = {
    watts: s,
    direction: u ? "toCar" : "idle",
    active: u,
    // If we're exporting, there's surplus solar covering the car; else it's grid.
    source: u && (r > N || i > s) ? "solar" : "grid"
  }, y = c + s, M = y > 0 ? Math.round(Math.min(i, y) / y * 100) : i > 0 ? 100 : 0;
  return {
    grid: { watts: Math.abs(e), active: l, mode: p },
    solar: { watts: i, active: h },
    house: { watts: c, active: c > N },
    car: { watts: s, active: u, connected: t.carConnected ?? t.carActive },
    paths: { gridHouse: f, solarHouse: g, houseCar: v },
    selfSufficiency: M
  };
}
function Ei(t) {
  if (!t) return !1;
  const e = t.toLowerCase();
  return e === "charging" || e === "starting";
}
function Oi(t) {
  if (!t) return !1;
  const e = t.toLowerCase();
  return e !== "not_connected" && e !== "disconnected" && e !== "unavailable" && e !== "unknown";
}
var xn = Object.defineProperty, Cn = Object.getOwnPropertyDescriptor, $e = (t, e, i, a) => {
  for (var s = a > 1 ? void 0 : a ? Cn(e, i) : e, n = t.length - 1, r; n >= 0; n--)
    (r = t[n]) && (s = (a ? r(e, i, s) : r(s)) || s);
  return a && s && xn(e, i, s), s;
};
function L1(t, e) {
  const i = (u) => u ? yn(t.states[u]) : null, a = i(e.gridPower), s = i(e.solarPower);
  let n = i(e.carPower);
  if ((n == null || n === 0) && e.carPowerAlt) {
    const u = i(e.carPowerAlt);
    u != null && u > 0 && (n = u);
  }
  const r = e.carActive ? t.states[e.carActive]?.state : void 0, c = e.carActiveAlt ? t.states[e.carActiveAlt]?.state : void 0, l = Ei(r) || Ei(c), h = Oi(r) || Oi(c);
  return wn({ grid: a, solar: s, car: n, carActive: l, carConnected: h });
}
function Ee(t) {
  const e = Math.abs(t);
  return e >= 1e3 ? `${$(e / 1e3)} kW` : `${Math.round(e)} W`;
}
const Z = {
  grid: [25, 26],
  solar: [75, 26],
  house: [50, 50],
  car: [50, 80]
}, Tt = { grid: [40, 40], solar: [60, 40], car: [67, 64] }, Et = 10, Ot = 13;
function Oe(t, e) {
  const i = Math.hypot(t, e) || 1;
  return [t / i, e / i];
}
function zt(t, e, i, a, s) {
  const [n, r] = Oe(e[0] - t[0], e[1] - t[1]), c = [t[0] + n * a, t[1] + r * a], [l, h] = Oe(e[0] - i[0], e[1] - i[1]), u = [i[0] + l * s, i[1] + h * s], p = `M ${c[0].toFixed(2)} ${c[1].toFixed(2)} Q ${e[0]} ${e[1]} ${u[0].toFixed(2)} ${u[1].toFixed(2)}`, [f, g] = Oe(u[0] - e[0], u[1] - e[1]), v = 3.1, y = [u[0] - f * v, u[1] - g * v], M = -g * v * 0.6, T = f * v * 0.6, L = `${u[0].toFixed(2)},${u[1].toFixed(2)} ${(y[0] + M).toFixed(2)},${(y[1] + T).toFixed(2)} ${(y[0] - M).toFixed(2)},${(y[1] - T).toFixed(2)}`;
  return { d: p, chevron: L };
}
const te = (t, e, i) => t + (e - t) * i, _n = (t) => 1 - Math.pow(1 - t, 3);
let Kt = class extends A {
  constructor() {
    super(...arguments), this._shown = { grid: 0, solar: 0, house: 0, car: 0 }, this._raf = 0;
  }
  willUpdate(t) {
    t.has("model") && this._retween();
  }
  disconnectedCallback() {
    super.disconnectedCallback(), cancelAnimationFrame(this._raf);
  }
  _retween() {
    const t = this.model;
    if (!t) return;
    const e = { grid: t.grid.watts, solar: t.solar.watts, house: t.house.watts, car: t.car.watts };
    if (typeof window < "u" && window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) {
      this._shown = e;
      return;
    }
    const a = { ...this._shown }, s = performance.now(), n = 420;
    cancelAnimationFrame(this._raf);
    const r = (c) => {
      const l = Math.min(1, (c - s) / n), h = _n(l);
      this._shown = {
        grid: te(a.grid, e.grid, h),
        solar: te(a.solar, e.solar, h),
        house: te(a.house, e.house, h),
        car: te(a.car, e.car, h)
      }, l < 1 && (this._raf = requestAnimationFrame(r));
    };
    this._raf = requestAnimationFrame(r);
  }
  _speed(t) {
    return Math.min(2.4, Math.max(0.7, 2.6 - t / 2500));
  }
  _conn(t, e, i, a, s) {
    return Ft`
      <path class="track" d=${e.d}></path>
      <path class="band ${i ? "on" : ""}" d=${t.d} style=${`stroke:${a};--pc:${a}`}></path>
      ${i ? Ft`<path class="flow" d=${t.d} style=${`stroke:${a};animation-duration:${this._speed(s)}s`}></path>` : d}
      <polygon class="chevron ${i ? "on" : ""}" points=${t.chevron} style=${`fill:${a}`}></polygon>
    `;
  }
  _node(t, e, i, a, s, n) {
    const [r, c] = Z[t], l = t === "house";
    return o`<div class="${`node ${l ? "hub " : ""}${a ? "active" : "idle"}`}" style=${`left:${r}%;top:${c}%;--n-fg:${s}`}>
      <div class="disc"><hd-icon .icon=${e} .size=${l ? 26 : 22}></hd-icon></div>
      <div class="label">${Ee(this._shown[t])}</div>
      ${n ?? o`<div class="name">${i}</div>`}
    </div>`;
  }
  render() {
    const t = this.model;
    if (!t) return d;
    const e = "var(--state-eco)", i = "var(--accent)", a = t.grid.mode !== "export", s = t.grid.mode === "export" ? e : i, n = t.paths.houseCar.source === "solar" ? e : i, r = a ? zt(Z.grid, Tt.grid, Z.house, Et, Ot) : zt(Z.house, Tt.grid, Z.grid, Ot, Et), c = zt(Z.grid, Tt.grid, Z.house, Et, Ot), l = zt(Z.solar, Tt.solar, Z.house, Et, Ot), h = zt(Z.house, Tt.car, Z.car, Ot, Et), u = t.grid.mode === "export" ? e : t.grid.mode === "import" ? i : "var(--text-tertiary)", p = t.grid.mode === "export" ? `Exporting ${Ee(t.grid.watts)}` : t.grid.mode === "import" ? `Importing ${Ee(t.grid.watts)}` : "Grid balanced", f = t.solar.watts > N;
    return o`
      <div class="stage">
        <div class="status" style=${`--status-color:${u}`}>
          <span class="dot"></span><span class="txt">${p}</span>
        </div>

        <svg class="paths" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid meet" aria-hidden="true">
          ${this._conn(l, l, t.paths.solarHouse.active, e, t.paths.solarHouse.watts)}
          ${this._conn(r, c, t.paths.gridHouse.active, s, t.paths.gridHouse.watts)}
          ${this._conn(h, h, t.paths.houseCar.active, n, t.paths.houseCar.watts)}
        </svg>

        ${this._node("solar", "mdi:solar-power", "Solar", t.solar.active, e)}
        ${this._node(
      "grid",
      t.grid.mode === "export" ? "mdi:transmission-tower-export" : "mdi:transmission-tower",
      t.grid.mode === "export" ? "Export" : "Grid",
      t.grid.active,
      s
    )}
        ${this._node(
      "car",
      t.car.connected ? "mdi:car-electric" : "mdi:car-electric-outline",
      "Car",
      t.car.active,
      n
    )}
        ${this._node(
      "house",
      "mdi:home-variant",
      "House",
      t.house.active,
      "var(--text-primary)",
      f ? o`<div class="autarky">${t.selfSufficiency}% solar</div>` : o`<div class="name">House</div>`
    )}
      </div>
    `;
  }
};
Kt.styles = x`
    :host {
      display: block;
      position: relative;
      width: 100%;
      height: 100%;
      min-height: 210px;
    }
    /* inset (not host padding): an absolutely-positioned child ignores host
       padding, so inset the centered square directly to get card breathing room
       around the pill and nodes while keeping the square lock. */
    .stage {
      position: absolute;
      inset: 14px;
      margin: auto;
      aspect-ratio: 1;
      max-width: calc(100% - 28px);
      max-height: calc(100% - 28px);
      container-type: size;
    }
    /* Soft depth behind the hub. */
    .stage::before {
      content: "";
      position: absolute;
      inset: 8%;
      border-radius: 50%;
      background: radial-gradient(circle at 50% 46%, var(--surface-subtle), transparent 62%);
      opacity: 0.9;
      pointer-events: none;
    }

    .status {
      position: absolute;
      top: 0;
      left: 50%;
      transform: translateX(-50%);
      z-index: 4;
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 3px 10px;
      border-radius: var(--radius-pill);
      background: var(--surface-subtle);
      box-shadow: var(--shadow-widget);
      font: var(--text-meta);
      font-weight: 650;
      color: var(--text-secondary);
      white-space: nowrap;
    }
    .status .dot {
      width: 6px;
      height: 6px;
      border-radius: 50%;
      background: var(--status-color, var(--text-tertiary));
    }
    .status .txt {
      color: var(--status-color, var(--text-secondary));
      font-variant-numeric: tabular-nums;
    }

    svg.paths {
      position: absolute;
      inset: 0;
      width: 100%;
      height: 100%;
      z-index: 1;
      overflow: visible;
    }
    .track {
      fill: none;
      stroke: var(--border-subtle);
      stroke-width: 1.4;
      vector-effect: non-scaling-stroke;
    }
    .band {
      fill: none;
      stroke-width: 3;
      stroke-linecap: round;
      vector-effect: non-scaling-stroke;
      filter: drop-shadow(0 0 2px var(--pc));
      opacity: 0;
      transition: opacity var(--motion-content) var(--ease-standard);
    }
    .band.on {
      opacity: 0.32;
    }
    .flow {
      fill: none;
      stroke-width: 2.6;
      stroke-linecap: round;
      stroke-dasharray: 0.5 6;
      vector-effect: non-scaling-stroke;
      animation: march 1.4s linear infinite;
    }
    @keyframes march {
      to {
        stroke-dashoffset: -13;
      }
    }
    .chevron {
      opacity: 0;
      transition: opacity var(--motion-content) var(--ease-standard);
    }
    .chevron.on {
      opacity: 0.9;
    }
    @media (prefers-reduced-motion: reduce) {
      .flow {
        display: none;
      }
    }

    .node {
      position: absolute;
      transform: translate(-50%, -50%);
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 6px;
      z-index: 2;
      transition: opacity var(--motion-state) var(--ease-standard);
    }
    .node.idle {
      opacity: 0.45;
    }
    .disc {
      width: clamp(46px, 20cqmin, 62px);
      height: clamp(46px, 20cqmin, 62px);
      border-radius: 50%;
      display: grid;
      place-items: center;
      background: var(--surface);
      color: var(--idle-fg);
      border: 2px solid var(--border-strong);
      box-shadow: var(--shadow-widget);
      transition: color var(--motion-state) var(--ease-standard),
        border-color var(--motion-state) var(--ease-standard), box-shadow var(--motion-state) var(--ease-standard);
    }
    .node.active .disc {
      color: var(--n-fg);
      border-color: var(--n-fg);
      box-shadow: var(--shadow-widget), 0 5px 18px -4px color-mix(in srgb, var(--n-fg) 55%, transparent);
    }
    .node.hub .disc {
      width: clamp(58px, 27cqmin, 82px);
      height: clamp(58px, 27cqmin, 82px);
      background: var(--surface);
      color: var(--text-primary);
      border: 2px solid var(--border-strong);
      box-shadow: var(--shadow-raised);
    }
    .node.hub.active .disc {
      animation: hub 3.4s ease-in-out infinite;
    }
    @keyframes hub {
      50% {
        box-shadow: var(--shadow-raised), 0 0 0 6px color-mix(in srgb, var(--text-primary) 6%, transparent);
      }
    }
    @media (prefers-reduced-motion: reduce) {
      .node.hub.active .disc {
        animation: none;
      }
    }
    .label {
      font: var(--text-secondary-state);
      font-weight: 700;
      color: var(--text-primary);
      font-variant-numeric: tabular-nums;
      line-height: 1;
    }
    .node.hub .label {
      font-size: 16px;
    }
    .name {
      font: var(--text-meta);
      color: var(--text-tertiary);
      line-height: 1;
    }
    .node.idle .label {
      color: var(--text-tertiary);
    }
    .autarky {
      font: var(--text-meta);
      font-weight: 650;
      color: var(--state-eco);
      line-height: 1;
    }
  `;
$e([
  m({ attribute: !1 })
], Kt.prototype, "model", 2);
$e([
  C()
], Kt.prototype, "_shown", 2);
Kt = $e([
  b("hd-flow-diagram")
], Kt);
let zi = class extends H {
  get _opts() {
    return this.config.options ?? {};
  }
  relevantEntityIds() {
    return Object.values(this._opts).filter((t) => typeof t == "string");
  }
  hasDetail() {
    return !0;
  }
  renderContent() {
    const t = this.hass ? L1(this.hass, this._opts) : void 0, e = t?.grid.mode === "export" ? "eco" : "accent";
    return o`
      <hd-widget-frame
        bleed
        .name=${this.config.name ?? "Power flow"}
        .size=${this.currentSize}
        .accent=${e}
        .hasDetail=${!0}
        .quickKind=${"none"}
        @hd-activate=${() => this.openDetail()}
      >
        <hd-flow-diagram .model=${t}></hd-flow-diagram>
      </hd-widget-frame>
    `;
  }
};
zi = $e([
  b("hd-widget-powerflow")
], zi);
var $n = Object.getOwnPropertyDescriptor, An = (t, e, i, a) => {
  for (var s = a > 1 ? void 0 : a ? $n(e, i) : e, n = t.length - 1, r; n >= 0; n--)
    (r = t[n]) && (s = r(s) || s);
  return s;
};
const pt = (t, e) => {
  if (!e || !t) return null;
  const i = t.states[e];
  if (!i) return null;
  const a = Number(i.state);
  return Number.isFinite(a) ? a : null;
}, ze = (t, e) => e ? t?.states[e]?.state : void 0;
function V1(t, e) {
  const i = ze(t, e.master) === "on", a = ze(t, e.vehicleConnected) === "on", s = ze(t, e.chargingState), n = pt(t, e.chargePower), r = pt(t, e.battery), c = pt(t, e.chargeLimit), l = pt(t, e.sessionEnergy), h = pt(t, e.chargeRate), u = pt(t, e.chargeCurrent), p = s === "charging" || s === "starting" || (n ?? 0) > 0.1, f = s === "complete";
  let g;
  a ? p ? g = "charging" : f ? g = "complete" : i ? g = "waiting" : g = "off" : g = "unplugged";
  const v = n != null ? $(n) : "—", y = {
    unplugged: { label: "Car not connected", tone: "neutral", icon: "mdi:ev-plug-type2" },
    charging: {
      label: i ? `Solar charging · ${v} kW` : `Charging · ${v} kW`,
      tone: i ? "eco" : "accent",
      icon: "mdi:ev-station"
    },
    complete: { label: "Charge complete", tone: "eco", icon: "mdi:battery-charging-100" },
    waiting: { label: "Waiting for surplus", tone: "accent", icon: "mdi:solar-power-variant" },
    off: { label: "Solar mode off", tone: "neutral", icon: "mdi:ev-station" }
  };
  return {
    armed: i,
    connected: a,
    phase: g,
    powerKw: n,
    batteryPct: r,
    limitPct: c,
    sessionKwh: l,
    rateKmh: h,
    currentA: u,
    ...y[g]
  };
}
let Ue = class extends H {
  get _opts() {
    return this.config.options ?? {};
  }
  relevantEntityIds() {
    return Object.values(this._opts).filter((t) => typeof t == "string");
  }
  hasDetail() {
    return !0;
  }
  _toggleMaster() {
    const t = this._opts.master;
    t && this.callService(B(t), { errorVerb: "toggle solar charging" });
  }
  renderContent() {
    const t = V1(this.hass, this._opts), e = this.currentSize, i = t.batteryPct, a = t.limitPct, s = t.phase === "charging" && t.armed ? "var(--state-eco)" : "var(--accent)", n = i != null && (e === "2x2" || e === "1x2"), r = e === "2x2" || e === "1x2" || e === "2x1";
    return o`
      <hd-widget-frame
        .icon=${t.icon}
        .name=${this.config.name ?? "Solar charging"}
        .stateText=${t.label}
        .secondary=${i != null ? `Battery ${Math.round(i)}%${a != null ? ` → ${Math.round(a)}%` : ""}` : ""}
        .size=${e}
        .accent=${t.tone === "neutral" ? "idle" : t.tone}
        .active=${t.armed}
        .hasDetail=${!0}
        .quickKind=${"toggle"}
        .quickLabel=${t.armed ? "Turn off solar charging" : "Turn on solar charging"}
        @hd-quick=${() => this._toggleMaster()}
        @hd-activate=${() => this.openDetail()}
      >
        ${n ? o`<div class="battery">
              <div class="line">
                <span class="soc">${Math.round(i)}%</span>
                ${a != null ? o`<span>Target ${Math.round(a)}%</span>` : d}
              </div>
              <div class="bar" style=${`--fill:${s}`}>
                <div class="fill" style=${`width:${Math.min(100, Math.max(0, i))}%`}></div>
                ${a != null ? o`<div class="limit" style=${`left:${Math.min(100, Math.max(0, a))}%`}></div>` : d}
              </div>
            </div>` : d}
        ${r ? o`<div class="stats">
              ${t.powerKw != null && t.powerKw > 0.05 ? o`<hd-status-badge
                    tone=${t.armed ? "eco" : "accent"}
                    icon="mdi:flash"
                    text=${`${$(t.powerKw)} kW`}
                  ></hd-status-badge>` : d}
              ${t.sessionKwh != null && t.sessionKwh > 0.01 ? o`<hd-status-badge
                    tone="neutral"
                    icon="mdi:counter"
                    text=${`${$(t.sessionKwh)} kWh session`}
                  ></hd-status-badge>` : d}
              ${t.rateKmh != null && t.rateKmh > 0.5 ? o`<hd-status-badge
                    tone="neutral"
                    icon="mdi:speedometer"
                    text=${`${Math.round(t.rateKmh)} km/h`}
                  ></hd-status-badge>` : d}
            </div>` : d}
      </hd-widget-frame>
    `;
  }
};
Ue.styles = x`
    .battery {
      display: flex;
      flex-direction: column;
      gap: 6px;
    }
    .battery .line {
      display: flex;
      align-items: baseline;
      justify-content: space-between;
      font: var(--text-meta);
      color: var(--text-secondary);
    }
    .battery .line .soc {
      font: var(--text-value-lg);
      font-variant-numeric: tabular-nums;
      color: var(--text-primary);
    }
    .bar {
      position: relative;
      height: 8px;
      border-radius: 999px;
      background: var(--idle-bg);
      overflow: hidden;
    }
    .bar .fill {
      position: absolute;
      inset: 0 auto 0 0;
      border-radius: 999px;
      background: var(--fill, var(--accent));
      transition: width var(--motion-state) var(--ease-standard);
    }
    .bar .limit {
      position: absolute;
      top: -2px;
      bottom: -2px;
      width: 2px;
      background: var(--text-tertiary);
      opacity: 0.7;
    }
    .stats {
      display: flex;
      flex-wrap: wrap;
      gap: 6px;
      margin-top: 8px;
    }
  `;
Ue = An([
  b("hd-widget-solarcharging")
], Ue);
function Hn(t) {
  const e = {};
  for (const [i, a] of Object.entries(t ?? {}))
    e[i] = (a ?? []).map((s) => ({
      start: typeof s.start == "number" ? s.start : Date.parse(String(s.start)),
      change: Number.isFinite(s.change) ? s.change : 0
    }));
  return e;
}
function Ln(t, e, i = /* @__PURE__ */ new Date()) {
  const a = new Date(i);
  if (a.setHours(0, 0, 0, 0), t === "day")
    a.setDate(a.getDate() - (e - 1));
  else if (t === "week") {
    const s = (a.getDay() + 6) % 7;
    a.setDate(a.getDate() - s - 7 * (e - 1));
  } else
    a.setDate(1), a.setMonth(a.getMonth() - (e - 1));
  return a;
}
function Vn(t, e) {
  const i = new Date(t);
  return Number.isNaN(i.getTime()) ? "" : e === "day" ? i.toLocaleDateString(void 0, { weekday: "short" }) : e === "week" ? i.toLocaleDateString(void 0, { day: "numeric", month: "short" }) : i.toLocaleDateString(void 0, { month: "short" });
}
async function Mn(t, e, i, a) {
  const s = e.filter(Boolean);
  if (!s.length) return {};
  const n = await t.callWS({
    type: "recorder/statistics_during_period",
    start_time: a.toISOString(),
    statistic_ids: s,
    period: i,
    types: ["change"]
  });
  return Hn(n);
}
var kn = Object.defineProperty, Sn = Object.getOwnPropertyDescriptor, Qt = (t, e, i, a) => {
  for (var s = a > 1 ? void 0 : a ? Sn(e, i) : e, n = t.length - 1, r; n >= 0; n--)
    (r = t[n]) && (s = (a ? r(e, i, s) : r(s)) || s);
  return a && s && kn(e, i, s), s;
};
const Pn = (t) => {
  if (t <= 0) return 1;
  const e = Math.pow(10, Math.floor(Math.log10(t))), i = t / e;
  return (i <= 1 ? 1 : i <= 2 ? 2 : i <= 5 ? 5 : 10) * e;
}, ee = (t) => Math.abs(t) >= 100 ? Math.round(t).toString() : t.toFixed(1);
let ot = class extends A {
  constructor() {
    super(...arguments), this.series = [], this.labels = [], this.unit = "", this.legend = !0;
  }
  _total(t) {
    return t.values.reduce((e, i) => e + (Number.isFinite(i) ? i : 0), 0);
  }
  render() {
    const t = this.labels.length, e = this.series.filter((n) => n.values.some((r) => r > 0)), i = Math.max(0, ...this.series.flatMap((n) => n.values.filter((r) => Number.isFinite(r))));
    if (!t || !e.length || i <= 0)
      return o`<div class="empty">No data for this period</div>`;
    const a = Pn(i), s = e.map((n) => `${n.label} ${ee(this._total(n))} ${this.unit}`).join(", ");
    return o`
      <div class="wrap" role="img" aria-label=${s}>
        <div class="plot">
          <span class="ymax">${ee(a)} ${this.unit}</span>
          ${this.labels.map(
      (n, r) => o`<div class="group">
              <div class="bars">
                ${this.series.map((c) => {
        const l = Number.isFinite(c.values[r]) ? c.values[r] : 0, h = l <= 0 ? 0 : Math.max(1.5, l / a * 100);
        return o`<div
                    class="bar"
                    style=${`--c:${c.color};height:${h}%`}
                    title=${`${c.label}: ${ee(l)} ${this.unit}`}
                  ></div>`;
      })}
              </div>
              <div class="xlabel">${n}</div>
            </div>`
    )}
        </div>
        ${this.legend ? o`<div class="legend">
              ${this.series.map(
      (n) => o`<span class="key" style=${`--c:${n.color}`}>
                  <i></i>${n.label} <b>${ee(this._total(n))} ${this.unit}</b>
                </span>`
    )}
            </div>` : d}
      </div>
    `;
  }
};
ot.styles = x`
    :host {
      display: block;
      height: 100%;
    }
    .wrap {
      display: flex;
      flex-direction: column;
      height: 100%;
      gap: 8px;
    }
    .plot {
      position: relative;
      flex: 1;
      min-height: 0;
      display: flex;
      align-items: stretch;
      gap: 1.5%;
      padding-top: 14px;
    }
    .ymax {
      position: absolute;
      top: 0;
      right: 0;
      font: var(--text-meta);
      color: var(--text-tertiary);
      font-variant-numeric: tabular-nums;
    }
    .group {
      flex: 1;
      min-width: 0;
      display: flex;
      flex-direction: column;
    }
    .bars {
      flex: 1;
      min-height: 0;
      display: flex;
      align-items: flex-end;
      justify-content: center;
      gap: 2px;
      border-bottom: 1px solid var(--hairline, rgba(128, 128, 128, 0.22));
    }
    .bar {
      flex: 1;
      max-width: 16px;
      border-radius: 3px 3px 0 0;
      background: var(--c, var(--accent));
      transition: height var(--motion-state, 0.3s) var(--ease-standard, ease);
    }
    .xlabel {
      margin-top: 5px;
      text-align: center;
      font: var(--text-meta);
      color: var(--text-tertiary);
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .legend {
      display: flex;
      flex-wrap: wrap;
      gap: 8px 14px;
    }
    .key {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      font: var(--text-meta);
      color: var(--text-secondary);
    }
    .key i {
      width: 10px;
      height: 10px;
      border-radius: 3px;
      background: var(--c);
      flex: none;
    }
    .key b {
      color: var(--text-primary);
      font-weight: 600;
      font-variant-numeric: tabular-nums;
    }
    .empty {
      display: grid;
      place-items: center;
      height: 100%;
      color: var(--text-tertiary);
      font: var(--text-secondary-state);
    }
  `;
Qt([
  m({ attribute: !1 })
], ot.prototype, "series", 2);
Qt([
  m({ attribute: !1 })
], ot.prototype, "labels", 2);
Qt([
  m({ type: String })
], ot.prototype, "unit", 2);
Qt([
  m({ type: Boolean })
], ot.prototype, "legend", 2);
ot = Qt([
  b("hd-bar-chart")
], ot);
var Tn = Object.defineProperty, En = Object.getOwnPropertyDescriptor, Ae = (t, e, i, a) => {
  for (var s = a > 1 ? void 0 : a ? En(e, i) : e, n = t.length - 1, r; n >= 0; n--)
    (r = t[n]) && (s = (a ? r(e, i, s) : r(s)) || s);
  return a && s && Tn(e, i, s), s;
};
const De = [
  { key: "solar", label: "Solar", color: "#f4b740" },
  { key: "gridImport", label: "Import", color: "var(--accent)" },
  { key: "gridExport", label: "Export", color: "var(--state-eco)" },
  { key: "car", label: "Car", color: "#8b7cf6" }
], Di = { day: 7, week: 8, month: 12 };
let xt = class extends H {
  constructor() {
    super(...arguments), this._period = "day", this._data = {}, this._periodInit = !1, this._fetchKey = "";
  }
  get _opts() {
    return this.config.options ?? {};
  }
  // The chart is periodic history, not live state — don't re-render on every
  // state tick of the underlying meters.
  relevantEntityIds() {
    return [];
  }
  hasDetail() {
    return !1;
  }
  _ids() {
    return De.map((t) => this._opts[t.key]).filter((t) => typeof t == "string");
  }
  updated() {
    if (!this._periodInit && (this._periodInit = !0, this._opts.defaultPeriod)) {
      this._period = this._opts.defaultPeriod;
      return;
    }
    this._maybeFetch();
  }
  async _maybeFetch() {
    if (!this.hass?.connected) return;
    const t = this._ids();
    if (!t.length) return;
    const e = `${this._period}|${t.join(",")}`;
    if (e !== this._fetchKey) {
      this._fetchKey = e;
      try {
        const i = Ln(this._period, Di[this._period]);
        this._data = await Mn(this.hass, t, this._period, i);
      } catch {
        this._data = {};
      }
    }
  }
  _setPeriod(t) {
    t !== this._period && (this._period = t);
  }
  _chart() {
    const t = Di[this._period], e = /* @__PURE__ */ new Set();
    for (const n of De) {
      const r = this._opts[n.key];
      if (r) for (const c of this._data[r] ?? []) e.add(c.start);
    }
    const i = [...e].sort((n, r) => n - r).slice(-t), a = i.map((n) => Vn(n, this._period)), s = De.filter((n) => this._opts[n.key]).map((n) => {
      const r = new Map((this._data[this._opts[n.key]] ?? []).map((c) => [c.start, c.change]));
      return {
        label: n.label,
        color: n.color,
        values: i.map((c) => r.get(c) ?? 0)
      };
    });
    return { labels: a, series: s };
  }
  renderContent() {
    const { labels: t, series: e } = this._chart();
    return o`
      <hd-widget-frame
        .icon=${"mdi:chart-bar"}
        .name=${this.config.name ?? "Energy history"}
        .size=${this.currentSize}
        .accent=${"accent"}
        .hasDetail=${!1}
        .quickKind=${"none"}
      >
        <div class="head">
          <hd-segmented
            .options=${[
      { value: "day", label: "Day" },
      { value: "week", label: "Week" },
      { value: "month", label: "Month" }
    ]}
            .value=${this._period}
            label="History period"
            @hd-select=${(i) => this._setPeriod(i.detail.value)}
          ></hd-segmented>
        </div>
        <div class="chart-box">
          <hd-bar-chart .series=${e} .labels=${t} unit="kWh"></hd-bar-chart>
        </div>
      </hd-widget-frame>
    `;
  }
};
xt.styles = x`
    .head {
      display: flex;
      justify-content: flex-end;
      margin-bottom: 4px;
    }
    .chart-box {
      flex: 1;
      min-height: 0;
    }
  `;
Ae([
  C()
], xt.prototype, "_period", 2);
Ae([
  C()
], xt.prototype, "_data", 2);
Ae([
  C()
], xt.prototype, "_periodInit", 2);
xt = Ae([
  b("hd-widget-energychart")
], xt);
var On = Object.defineProperty, zn = Object.getOwnPropertyDescriptor, He = (t, e, i, a) => {
  for (var s = a > 1 ? void 0 : a ? zn(e, i) : e, n = t.length - 1, r; n >= 0; n--)
    (r = t[n]) && (s = (a ? r(e, i, s) : r(s)) || s);
  return a && s && On(e, i, s), s;
};
let je = class extends H {
  constructor() {
    super(...arguments), this._debounce = 0;
  }
  _setPct(t, e) {
    window.clearTimeout(this._debounce);
    const i = () => this.entityId && this.callService(ds(this.entityId, t), { errorVerb: "set speed for" });
    e ? i() : this._debounce = window.setTimeout(i, 200);
  }
  renderContent() {
    const t = this.vm, e = Ga(t.stateObj), i = this.currentSize, a = i === "1x2", s = e.speed && (i === "2x1" || i === "1x2") && t.active, n = t.stateObj?.attributes.percentage ?? 0;
    return o`<hd-widget-frame
      .icon=${t.icon}
      .name=${t.name}
      .stateText=${t.displayState}
      .secondary=${t.secondary ?? ""}
      .size=${i}
      .accent=${t.accent}
      .active=${t.active}
      .unavailable=${!t.available}
      .hasDetail=${!0}
      .quickKind=${"toggle"}
      .quickLabel=${t.quickAction.label}
      .actionState=${this.actionState}
      @hd-quick=${() => this.runQuick()}
      @hd-activate=${() => this.openDetail()}
    >
      ${s ? o`<hd-slider
            class=${a ? "vert" : ""}
            .vertical=${a}
            .value=${n}
            .valueText=${`${Math.round(n)}%`}
            icon="mdi:fan"
            label=${`Speed of ${t.name}`}
            @hd-input=${(r) => this._setPct(r.detail.value, !1)}
            @hd-change=${(r) => this._setPct(r.detail.value, !0)}
          ></hd-slider>` : d}
    </hd-widget-frame>`;
  }
  disconnectedCallback() {
    super.disconnectedCallback(), window.clearTimeout(this._debounce);
  }
};
je.styles = x`
    .vert {
      flex: 1;
      min-height: 120px;
    }
  `;
je = He([
  b("hd-widget-fan")
], je);
let ge = class extends H {
  constructor() {
    super(...arguments), this._cacheBust = Date.now(), this._timer = 0;
  }
  connectedCallback() {
    super.connectedCallback(), this._timer = window.setInterval(() => this._cacheBust = Date.now(), 1e4);
  }
  disconnectedCallback() {
    super.disconnectedCallback(), window.clearInterval(this._timer);
  }
  renderContent() {
    const t = this.vm, e = t.stateObj?.attributes.entity_picture, i = e ? `${e}${e.includes("?") ? "&" : "?"}_=${this._cacheBust}` : void 0;
    return o`<hd-widget-frame
      bleed
      .name=${t.name}
      .size=${this.currentSize}
      .accent=${"accent"}
      .hasDetail=${!0}
      .quickKind=${"none"}
      @hd-activate=${() => this.openDetail()}
    >
      <div class="tile">
        ${i && t.available ? o`<img src=${i} alt=${`Live view of ${t.name}`} loading="lazy" />` : o`<div class="off"><hd-icon icon="mdi:cctv" .size=${34}></hd-icon><span>${t.displayState}</span></div>`}
        <span class="label">${t.name}</span>
      </div>
    </hd-widget-frame>`;
  }
};
ge.styles = x`
    .tile {
      position: relative;
      height: 100%;
      min-height: 120px;
      background: #0b0d10;
      display: grid;
      place-items: center;
      overflow: hidden;
    }
    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      display: block;
    }
    .label {
      position: absolute;
      left: 12px;
      bottom: 10px;
      color: #fff;
      font: var(--text-secondary-state);
      font-weight: 650;
      text-shadow: 0 1px 3px rgba(0, 0, 0, 0.6);
    }
    .off {
      color: var(--text-tertiary);
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 6px;
    }
  `;
He([
  C()
], ge.prototype, "_cacheBust", 2);
ge = He([
  b("hd-widget-camera")
], ge);
let Ke = class extends H {
  async _call(t, e) {
    !this.entityId || !this.hass || e && !await Xt(this, { title: `${V(t.replace("alarm_", "").replace("_", " "))}?`, confirmLabel: "Confirm", destructive: t === "alarm_disarm" }) || this.callService(
      { domain: "alarm_control_panel", service: t, data: { entity_id: this.entityId } },
      { errorVerb: "update" }
    );
  }
  renderContent() {
    const t = this.vm, e = t.rawState, i = e === "triggered" ? "alert" : e.startsWith("armed") ? "warn" : e === "disarmed" ? "eco" : "accent", a = this.currentSize, s = e !== "disarmed";
    return o`<hd-widget-frame
      .icon=${e === "triggered" ? "mdi:shield-alert" : s ? "mdi:shield-home" : "mdi:shield-off"}
      .name=${t.name}
      .stateText=${V(e.replace("_", " "))}
      .size=${a}
      .accent=${i}
      .active=${s}
      .unavailable=${!t.available}
      .hasDetail=${!0}
      .quickKind=${"none"}
      @hd-activate=${() => this.openDetail()}
    >
      ${a !== "1x1" ? o`<div class="controls" @click=${(n) => n.stopPropagation()}>
            ${s ? o`<button class="danger" @click=${() => this._call("alarm_disarm", !0)}>Disarm</button>` : o`<button @click=${() => this._call("alarm_arm_home", !1)}>Arm home</button>
                  <button @click=${() => this._call("alarm_arm_away", !1)}>Arm away</button>`}
          </div>` : d}
    </hd-widget-frame>`;
  }
};
Ke.styles = x`
    .controls {
      display: flex;
      gap: 8px;
      flex-wrap: wrap;
    }
    button {
      -webkit-tap-highlight-color: transparent;
      appearance: none;
      border: none;
      cursor: pointer;
      min-height: 44px;
      padding: 0 14px;
      border-radius: var(--radius-control);
      background: var(--surface-subtle);
      color: var(--text-primary);
      font: var(--text-secondary-state);
      font-weight: 650;
    }
    button.danger {
      background: var(--state-alert-soft);
      color: var(--state-alert);
    }
  `;
Ke = He([
  b("hd-widget-alarm")
], Ke);
const Dn = {
  group: "hd-group",
  light: "hd-widget-light",
  switch: "hd-widget-switch",
  fan: "hd-widget-fan",
  climate: "hd-widget-climate",
  cover: "hd-widget-cover",
  media: "hd-widget-media",
  sensor: "hd-widget-sensor",
  binary_sensor: "hd-widget-binary",
  person: "hd-widget-person",
  scene: "hd-widget-scene",
  script: "hd-widget-script",
  button: "hd-widget-button",
  lock: "hd-widget-lock",
  vacuum: "hd-widget-vacuum",
  camera: "hd-widget-camera",
  weather: "hd-widget-weather",
  energy: "hd-widget-energy",
  powerflow: "hd-widget-powerflow",
  solarcharging: "hd-widget-solarcharging",
  energychart: "hd-widget-energychart",
  alarm: "hd-widget-alarm",
  action: "hd-widget-action"
};
function In(t) {
  return Dn[t] ?? "hd-widget-sensor";
}
function M1(t, e, i, a, s = "row") {
  try {
    const { colSpan: n, rowSpan: r } = Bi(e, i), c = Ua(In(t.type)), l = `grid-column: span ${n}; grid-row: span ${r};`;
    return Ka`<${c}
      class="cell"
      style=${l}
      .hass=${a}
      .config=${t}
      .currentSize=${e}
      .layout=${s}
    ></${c}>`;
  } catch (n) {
    return console.error(`[widget-cell] widget "${t?.id ?? t?.type}" failed to render:`, n), Rn(t, e, i);
  }
}
function Rn(t, e, i) {
  let a = 1, s = 1;
  try {
    ({ colSpan: a, rowSpan: s } = Bi(e, i));
  } catch {
  }
  const n = `grid-column: span ${a}; grid-row: span ${s};`, r = t?.name || t?.entity || "Widget";
  return o`<hd-widget-frame
    class="cell"
    style=${n}
    icon="mdi:alert-circle-outline"
    .name=${r}
    stateText="Unavailable"
    secondary="Widget error"
    accent="alert"
    .size=${e}
    ?unavailable=${!0}
  ></hd-widget-frame>`;
}
var Zn = Object.defineProperty, qn = Object.getOwnPropertyDescriptor, Le = (t, e, i, a) => {
  for (var s = a > 1 ? void 0 : a ? qn(e, i) : e, n = t.length - 1, r; n >= 0; n--)
    (r = t[n]) && (s = (a ? r(e, i, s) : r(s)) || s);
  return a && s && Zn(e, i, s), s;
};
let Ct = class extends A {
  constructor() {
    super(...arguments), this._width = 0;
  }
  connectedCallback() {
    super.connectedCallback(), this._ro = new ResizeObserver((t) => {
      const e = Math.round(t[0].contentRect.width);
      e && Math.abs(e - this._width) > 1 && (this._width = e);
    }), this._ro.observe(this), this._width = this.getBoundingClientRect().width || window.innerWidth;
  }
  disconnectedCallback() {
    super.disconnectedCallback(), this._ro?.disconnect();
  }
  render() {
    const t = this.view, e = Xi(this._width), i = `--pad:${e.pad}px`;
    if (!t || t.widgets.length === 0)
      return o`<div class="empty">
        <hd-icon icon="mdi:view-dashboard-outline" .size=${40}></hd-icon>
        <h3>No widgets yet</h3>
        <p>Add widgets to this view in <code>dashboard.config.ts</code>.</p>
      </div>`;
    const a = Fa(t.widgets);
    return o`
      <div class="stack" style=${i}>
        ${Wi(
      a,
      (s) => s.id,
      (s) => M1(s, ei(s, e.bucket), 1, this.hass, "row")
    )}
      </div>
      ${d}
    `;
  }
};
Ct.styles = x`
    :host {
      display: block;
    }
    .stack {
      display: flex;
      flex-direction: column;
      gap: 26px;
      padding: var(--pad, 20px);
      box-sizing: border-box;
      max-width: 1760px;
      margin: 0 auto;
    }
    .empty {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 10px;
      color: var(--text-tertiary);
      text-align: center;
      padding: 64px 24px;
    }
    .empty h3 {
      margin: 0;
      font: var(--text-widget-title);
      color: var(--text-secondary);
    }
    .empty p {
      margin: 0;
      font: var(--text-secondary-state);
      max-width: 34ch;
    }
    .cell {
      min-width: 0;
      min-height: 0;
    }
  `;
Le([
  m({ attribute: !1 })
], Ct.prototype, "hass", 2);
Le([
  m({ attribute: !1 })
], Ct.prototype, "view", 2);
Le([
  C()
], Ct.prototype, "_width", 2);
Ct = Le([
  b("hd-view-grid")
], Ct);
const Fn = [
  ["Warm white", [255, 197, 143]],
  ["Sun", [255, 233, 170]],
  ["Red", [255, 74, 74]],
  ["Orange", [255, 145, 48]],
  ["Green", [86, 200, 90]],
  ["Teal", [40, 200, 180]],
  ["Blue", [70, 130, 255]],
  ["Indigo", [120, 90, 240]],
  ["Pink", [255, 92, 170]]
];
function Nn(t) {
  const [e, i, a] = t.map((h) => h / 255), s = Math.max(e, i, a), n = Math.min(e, i, a), r = s - n;
  let c = 0;
  r !== 0 && (s === e ? c = (i - a) / r % 6 : s === i ? c = (a - e) / r + 2 : c = (e - i) / r + 4, c = c * 60, c < 0 && (c += 360));
  const l = s === 0 ? 0 : r / s * 100;
  return [Math.round(c), Math.round(l)];
}
function Un(t, e) {
  const i = Gi(e), a = e.state === "on", s = a ? Math.round((e.attributes.brightness ?? 255) / 2.55) : 0, n = e.attributes.min_color_temp_kelvin ?? 2200, r = e.attributes.max_color_temp_kelvin ?? 6500, c = e.attributes.color_temp_kelvin ?? Math.round((n + r) / 2), l = e.attributes.effect_list?.filter((g) => g && g !== "None") ?? [], h = e.attributes.hs_color, u = e.attributes.rgb_color, [p, f] = h ? [h[0], h[1]] : u ? Nn(u) : [0, 0];
  return o`
    <div class="d-section d-row-between">
      <span class="d-label">Power</span>
      <hd-toggle
        .checked=${a}
        label="Toggle light"
        @hd-toggle=${() => t.call(B(t.entityId), "toggle")}
      ></hd-toggle>
    </div>

    ${i.brightness ? o`<div class="d-section">
          <span class="d-label">Brightness</span>
          <hd-slider
            .value=${s}
            .min=${1}
            .max=${100}
            .disabled=${!a}
            .valueText=${a ? `${s}%` : "Off"}
            .color=${"var(--state-light)"}
            icon="mdi:brightness-6"
            label="Brightness"
            @hd-change=${(g) => t.call(Re(t.entityId, g.detail.value), "dim")}
          ></hd-slider>
        </div>` : d}

    ${i.colorTemp ? o`<div class="d-section">
          <span class="d-label">Color temperature</span>
          <hd-slider
            .value=${c}
            .min=${n}
            .max=${r}
            .step=${50}
            .disabled=${!a}
            .color=${"linear-gradient(90deg,#ffb85c,#fff5e8,#cfe0ff)"}
            label="Color temperature"
            @hd-change=${(g) => t.call(gt(t.entityId, { colorTempKelvin: g.detail.value }), "set color of")}
          ></hd-slider>
        </div>` : d}

    ${i.color ? o`<div class="d-section">
          <span class="d-label">Color</span>
          <div class="color-wheel-wrap">
            <hd-color-wheel
              .hue=${p}
              .sat=${f}
              .disabled=${!a}
              @hd-color=${(g) => t.call(gt(t.entityId, { hsColor: [g.detail.hue, g.detail.sat] }), "set color of")}
            ></hd-color-wheel>
          </div>
          <div class="swatches">
            ${Fn.map(
    ([g, v]) => o`<button
                class="swatch"
                style=${`background:rgb(${v[0]},${v[1]},${v[2]})`}
                aria-label=${g}
                ?disabled=${!a}
                @click=${() => t.call(gt(t.entityId, { rgbColor: v }), "set color of")}
              ></button>`
  )}
          </div>
        </div>` : d}

    ${i.effects && l.length ? o`<div class="d-section">
          <span class="d-label">Effect</span>
          <div class="chips">
            ${l.slice(0, 12).map(
    (g) => o`<button
                class="chip ${e.attributes.effect === g ? "active" : ""}"
                ?disabled=${!a}
                @click=${() => t.call(gt(t.entityId, { effect: g }), "set effect of")}
              >
                ${V(g)}
              </button>`
  )}
          </div>
        </div>` : d}
  `;
}
function jn(t, e) {
  const i = t1(e), a = e.state === "off", s = e.attributes.temperature ?? 20, n = e.attributes.current_temperature, r = e.attributes.target_temp_step ?? 0.5, c = e.attributes.hvac_modes ?? [], l = e.attributes.fan_modes ?? [], h = e.attributes.swing_modes ?? [], u = e.attributes.preset_modes ?? [], p = (t.config?.options?.switches ?? []).filter(
    (v) => t.hass.states[v.entity]
  ), f = (v) => {
    const y = e.attributes.min_temp ?? 7, M = e.attributes.max_temp ?? 35, T = Math.min(M, Math.max(y, s + v * r));
    t.call(r1(t.entityId, Number(T.toFixed(1))), "set temperature for");
  }, g = (v) => v.map((y) => ({ value: y, label: V(y) }));
  return o`
    ${i.targetTemp ? o`<div class="d-section climate-hero">
          <hd-icon-button icon="mdi:minus" label="Lower" variant="soft" .disabled=${a} @click=${() => f(-1)}></hd-icon-button>
          <div class="climate-target">
            <span class="big">${a ? "—" : `${$(s)}°`}</span>
            ${n != null ? o`<span class="sub">Now ${$(n)}°</span>` : d}
          </div>
          <hd-icon-button icon="mdi:plus" label="Raise" variant="soft" .disabled=${a} @click=${() => f(1)}></hd-icon-button>
        </div>` : d}

    ${c.length > 1 ? o`<div class="d-section">
          <span class="d-label">Mode</span>
          <hd-segmented .options=${g(c)} .value=${e.state} label="Mode"
            @hd-select=${(v) => t.call(o1(t.entityId, v.detail.value), "set mode for")}></hd-segmented>
        </div>` : d}
    ${i.fanMode && l.length ? o`<div class="d-section">
          <span class="d-label">Fan</span>
          <hd-segmented .options=${g(l)} .value=${e.attributes.fan_mode ?? ""} label="Fan mode"
            @hd-select=${(v) => t.call(Ja(t.entityId, v.detail.value), "set fan for")}></hd-segmented>
        </div>` : d}
    ${i.swingMode && h.length ? o`<div class="d-section">
          <span class="d-label">Swing</span>
          <hd-segmented .options=${g(h)} .value=${e.attributes.swing_mode ?? ""} label="Swing mode"
            @hd-select=${(v) => t.call(es(t.entityId, v.detail.value), "set swing for")}></hd-segmented>
        </div>` : d}
    ${i.presetMode && u.length ? o`<div class="d-section">
          <span class="d-label">Preset</span>
          <hd-segmented .options=${g(u)} .value=${e.attributes.preset_mode ?? ""} label="Preset"
            @hd-select=${(v) => t.call(ts(t.entityId, v.detail.value), "set preset for")}></hd-segmented>
        </div>` : d}

    ${p.map((v) => {
    const y = t.hass.states[v.entity].state === "on";
    return o`<div class="d-section d-row-between">
        <span class="d-label">${v.name}</span>
        <hd-toggle
          .checked=${y}
          label=${v.name}
          @hd-toggle=${() => t.call(B(v.entity), `toggle ${v.name.toLowerCase()}`)}
        ></hd-toggle>
      </div>`;
  })}
  `;
}
function Kn(t, e) {
  const i = e1(e), a = e.attributes.entity_picture, s = e.attributes.media_title, n = e.attributes.app_name, r = e.attributes.volume_level ?? 0, c = e.attributes.is_volume_muted ?? !1, l = e.attributes.source_list ?? [], h = e.attributes.sound_mode_list ?? [], u = e.state === "off", p = i.selectSource && Gs(l), { featured: f, rest: g } = p ? en(l) : { featured: [], rest: l }, v = async (L) => {
    u && await t.call(s1(t.entityId), "turn on"), await t.call(ss(t.entityId, L), p ? "launch" : "change source of");
  }, y = !u && e.state !== "idle" && e.state !== "standby", M = n ? ue(n) : void 0, T = Fe(e);
  return o`
    ${a ? o`<div class="media-art" style=${`background-image:url("${a}")`}></div>` : y && (M || n) ? o`<div class="media-art media-art-fallback">
            <hd-icon icon=${M ?? "mdi:television-classic"} .size=${56}></hd-icon>
            ${n ? o`<span>${n}</span>` : d}
          </div>` : d}
    <div class="media-meta">
      <div class="d-value">${s ?? n ?? Lt(t.hass, e)}</div>
      ${n && s ? o`<div class="d-sub">${n}</div>` : d}
    </div>
    ${T ? o`<div class="d-section media-progress">
          <div class="media-progress-bar"><span style=${`width:${T.pct}%`}></span></div>
          <div class="media-progress-time"><span>${T.elapsed}</span><span>${T.total}</span></div>
        </div>` : d}
    <div class="d-section media-transport">
      ${i.power ? o`<hd-icon-button icon="mdi:power" label=${u ? "Turn on" : "Turn off"} variant=${u ? "soft" : "filled"} @click=${() => t.call(B(t.entityId), u ? "turn on" : "turn off")}></hd-icon-button>` : d}
      ${i.previous ? o`<hd-icon-button icon="mdi:skip-previous" label="Previous" variant="soft" .disabled=${u} @click=${() => t.call(m1(t.entityId), "skip")}></hd-icon-button>` : d}
      <hd-icon-button icon=${e.state === "playing" ? "mdi:pause" : "mdi:play"} label="Play or pause" variant="filled" .disabled=${u} @click=${() => t.call(u1(t.entityId), "control")}></hd-icon-button>
      ${i.next ? o`<hd-icon-button icon="mdi:skip-next" label="Next" variant="soft" .disabled=${u} @click=${() => t.call(p1(t.entityId), "skip")}></hd-icon-button>` : d}
    </div>
    ${i.volumeSet ? o`<div class="d-section">
          <span class="d-label">Volume</span>
          <div class="vol-row">
            ${i.mute ? o`<hd-icon-button icon=${c ? "mdi:volume-off" : "mdi:volume-high"} label="Mute" variant="soft" @click=${() => t.call(as(t.entityId, !c), "mute")}></hd-icon-button>` : d}
            <hd-slider style="flex:1" .value=${Math.round(r * 100)} .valueText=${`${Math.round(r * 100)}%`} label="Volume"
              @hd-change=${(L) => t.call(is(t.entityId, L.detail.value / 100), "set volume of")}></hd-slider>
          </div>
        </div>` : d}
    ${i.selectSoundMode && h.length ? o`<div class="d-section">
          <span class="d-label">Sound mode</span>
          <div class="chips">
            ${h.map(
    (L) => o`<button class="chip ${e.attributes.sound_mode === L ? "active" : ""}" @click=${() => t.call(ns(t.entityId, L), "set sound mode of")}>${L}</button>`
  )}
          </div>
        </div>` : d}
    ${f.length ? o`<div class="d-section">
          <span class="d-label">Apps</span>
          <div class="media-apps big-buttons">
            ${f.map(
    (L) => o`<button
                class="bigbtn app ${e.attributes.source === L.source ? "active" : ""}"
                @click=${() => v(L.source)}
              >
                <hd-icon icon=${L.icon} .size=${26}></hd-icon><span>${L.label}</span>
              </button>`
  )}
          </div>
        </div>` : d}
    ${i.selectSource && g.length ? o`<div class="d-section">
          <span class="d-label">${p ? f.length ? "More apps" : "Apps" : "Source"}</span>
          <div class="chips">
            ${g.slice(0, 24).map((L) => {
    const ni = e.attributes.source === L, ht = p ? ue(L) ?? "mdi:apps" : void 0;
    return o`<button
                class="chip ${ht ? "with-icon" : ""} ${ni ? "active" : ""}"
                @click=${() => v(L)}
              >
                ${ht ? o`<hd-icon icon=${ht} .size=${18}></hd-icon>` : d}<span>${L}</span>
              </button>`;
  })}
          </div>
        </div>` : d}
  `;
}
function Wn(t, e) {
  const i = Ji(e), a = e.attributes.current_position ?? (e.state === "open" ? 100 : 0);
  return o`
    ${i.setPosition ? o`<div class="d-section">
          <span class="d-label">Position</span>
          <hd-slider .value=${a} .valueText=${`${Math.round(a)}% open`} label="Position"
            @hd-change=${(s) => t.call(h1(t.entityId, s.detail.value), "move")}></hd-slider>
        </div>` : d}
    <div class="d-section big-buttons">
      ${i.open ? o`<button class="bigbtn" @click=${() => t.call(c1(t.entityId), "open")}><hd-icon icon="mdi:arrow-up" .size=${20}></hd-icon>Open</button>` : d}
      ${i.stop ? o`<button class="bigbtn" @click=${() => t.call(d1(t.entityId), "stop")}><hd-icon icon="mdi:stop" .size=${20}></hd-icon>Stop</button>` : d}
      ${i.close ? o`<button class="bigbtn" @click=${() => t.call(l1(t.entityId), "close")}><hd-icon icon="mdi:arrow-down" .size=${20}></hd-icon>Close</button>` : d}
    </div>
  `;
}
function Xn(t, e) {
  const i = e.state === "locked";
  return o`
    <div class="d-section big-buttons">
      <button class="bigbtn ${i ? "active" : ""}" @click=${() => t.call(v1(t.entityId), "lock")}>
        <hd-icon icon="mdi:lock" .size=${20}></hd-icon>Lock
      </button>
      <button class="bigbtn ${i ? "" : "active"}" @click=${async () => {
    await Xt(t.host, { title: `Unlock ${e.attributes.friendly_name ?? "lock"}?`, confirmLabel: "Unlock", destructive: !0, icon: "mdi:lock-open-variant" }) && t.call(b1(t.entityId), "unlock");
  }}>
        <hd-icon icon="mdi:lock-open-variant" .size=${20}></hd-icon>Unlock
      </button>
    </div>
    <div class="d-meta">Last changed ${xe(e.last_changed)}</div>
  `;
}
function Bn(t, e) {
  const i = i1(e), a = (e.attributes.fan_speed_list ?? []).filter((l) => !["off", "custom"].includes(l)), s = Rt(t.hass, t.entityId), n = s.battery ?? e.attributes.battery_level, r = e.state === "cleaning", c = [];
  return typeof s.progress == "number" && r && c.push(["Progress", `${Math.round(s.progress)}%`]), typeof s.area == "number" && s.area > 0 && c.push(["Area", `${$(s.area)} m²`]), typeof s.cleaningTime == "number" && s.cleaningTime > 0 && c.push(["Time", `${Math.round(s.cleaningTime)} min`]), o`
    <div class="d-section big-buttons">
      <button class="bigbtn" @click=${() => t.call(re(t.entityId), "start")}><hd-icon icon="mdi:play" .size=${20}></hd-icon>Start</button>
      ${i.pause ? o`<button class="bigbtn" @click=${() => t.call(Ze(t.entityId), "pause")}><hd-icon icon="mdi:pause" .size=${20}></hd-icon>Pause</button>` : d}
      ${i.returnHome ? o`<button class="bigbtn" @click=${() => t.call(oe(t.entityId), "dock")}><hd-icon icon="mdi:home-import-outline" .size=${20}></hd-icon>Dock</button>` : d}
      ${i.locate ? o`<button class="bigbtn" @click=${() => t.call(f1(t.entityId), "locate")}><hd-icon icon="mdi:map-marker-radius" .size=${20}></hd-icon>Locate</button>` : d}
    </div>
    ${a.length ? o`<div class="d-section">
          <span class="d-label">Suction</span>
          <hd-segmented .options=${a.map((l) => ({ value: l, label: V(l) }))} .value=${e.attributes.fan_speed ?? ""}
            @hd-select=${(l) => t.call(g1(t.entityId, l.detail.value), "set suction for")}></hd-segmented>
        </div>` : d}
    ${c.length ? o`<div class="d-section">
          <span class="d-label">${r ? s.room ? `Cleaning ${s.room}` : "Current clean" : "Last clean"}</span>
          <div class="d-grid">
            ${c.map(([l, h]) => o`<div class="d-cell"><span class="k">${l}</span><span class="v">${h}</span></div>`)}
          </div>
        </div>` : d}
    ${s.consumables.length ? o`<div class="d-section">
          <span class="d-label">Consumables</span>
          <div class="d-grid">
            ${s.consumables.map((l) => {
    const h = l.hoursLeft <= fs;
    return o`<div class="d-cell">
                <span class="k">${l.label}</span>
                <span class="v" style=${h ? "color:var(--state-warn)" : ""}>${Math.round(l.hoursLeft)} h${h ? " · replace" : ""}</span>
              </div>`;
  })}
          </div>
        </div>` : d}
    ${n != null ? o`<div class="d-meta">Battery ${Math.round(n)}%${s.status ? ` · ${V(s.status.replace(/_/g, " "))}` : ""}</div>` : d}
  `;
}
function Yn(t, e) {
  const i = Number(e.state), a = Number.isFinite(i), s = t.trend, n = s.length > 1 ? `Min ${$(Math.min(...s))}, max ${$(Math.max(...s))}, latest ${$(s[s.length - 1])}` : "";
  return o`
    <div class="d-value big">${Lt(t.hass, e)}</div>
    ${a && s.length > 1 ? o`<div class="d-section">
          <span class="d-label">Last 24 hours</span>
          <div class="detail-trend"><hd-trend .points=${s} .summary=${n}></hd-trend></div>
          <div class="d-meta">${n}</div>
        </div>` : d}
    ${k1(t, e)}
  `;
}
function Qn(t, e) {
  const i = e.attributes, a = [];
  return i.temperature != null && a.push(["Temperature", `${$(i.temperature)}°`]), i.humidity != null && a.push(["Humidity", `${Math.round(i.humidity)}%`]), i.wind_speed != null && a.push(["Wind", `${$(i.wind_speed)} ${i.wind_speed_unit ?? ""}`]), i.pressure != null && a.push(["Pressure", `${$(i.pressure)} ${i.pressure_unit ?? ""}`]), o`
    <div class="d-value big">${V(e.state)}</div>
    <div class="d-grid">
      ${a.map(([s, n]) => o`<div class="d-cell"><span class="k">${s}</span><span class="v">${n}</span></div>`)}
    </div>
    ${t.forecast.length ? o`<div class="d-section">
          <span class="d-label">Forecast</span>
          ${t.forecast.map((s) => {
    const n = new Date(s.datetime), r = Number.isNaN(n.getTime()) ? "" : n.toLocaleDateString(void 0, { weekday: "long" });
    return o`<div class="fc-row">
              <span class="fc-day">${r}</span>
              <hd-icon .icon=${ir(s.condition ?? "")} .size=${20}></hd-icon>
              <span class="fc-temp">${s.temperature != null ? `${Math.round(s.temperature)}°` : ""}${s.templow != null ? ` / ${Math.round(s.templow)}°` : ""}</span>
            </div>`;
  })}
        </div>` : d}
  `;
}
function Gn(t) {
  const e = t.config?.options ?? {}, i = (s) => {
    if (!s) return null;
    const n = t.hass.states[s];
    return n || null;
  }, a = Object.entries(e).map(([s, n]) => ({ k: s, st: i(n) })).filter((s) => s.st);
  return o`
    <div class="d-section">
      <span class="d-label">Live values</span>
      <div class="d-grid">
        ${a.map((s) => o`<div class="d-cell"><span class="k">${V(s.k)}</span><span class="v">${Lt(t.hass, s.st)}</span></div>`)}
      </div>
    </div>
    ${t.trend.length > 1 ? o`<div class="d-section">
          <span class="d-label">Grid power — last 24 hours</span>
          <div class="detail-trend"><hd-trend .points=${t.trend} .summary=${"24 hour grid power"}></hd-trend></div>
        </div>` : d}
  `;
}
function Jn(t) {
  const e = t.config?.options ?? {}, i = L1(t.hass, e), a = (s, n) => {
    const r = n ? t.hass.states[n] : void 0;
    return r ? o`<div class="d-cell"><span class="k">${s}</span><span class="v">${Lt(t.hass, r)}</span></div>` : d;
  };
  return o`
    <div class="detail-flow"><hd-flow-diagram .model=${i}></hd-flow-diagram></div>
    <div class="d-section">
      <span class="d-label">Live values</span>
      <div class="d-grid">
        ${a("Grid", e.gridPower)} ${a("Solar", e.solarPower)} ${a("House", e.houseConsumption)}
        ${a("Car charger", e.carPower)}
      </div>
    </div>
    ${t.trend.length > 1 ? o`<div class="d-section">
          <span class="d-label">Grid power — last 24 hours</span>
          <div class="detail-trend"><hd-trend .points=${t.trend} .summary=${"24 hour grid power"}></hd-trend></div>
        </div>` : d}
  `;
}
function tr(t) {
  const e = t.config?.options ?? {}, i = V1(t.hass, e), a = i.tone === "eco" ? "var(--state-eco)" : i.tone === "accent" ? "var(--accent)" : "var(--text-secondary)", s = (r, c) => c != null ? o`<div class="d-cell"><span class="k">${r}</span><span class="v">${c}</span></div>` : d, n = (r, c, l, h) => {
    const u = r ? t.hass.states[r] : void 0;
    if (!r || !u) return d;
    const p = Number(u.state), f = u.attributes.min ?? h.min, g = u.attributes.max ?? h.max, v = u.attributes.step ?? h.step;
    return o`<div class="d-section">
      <span class="d-label">${c}</span>
      <hd-slider
        .value=${Number.isFinite(p) ? p : f}
        .min=${f}
        .max=${g}
        .step=${v}
        .valueText=${Number.isFinite(p) ? l(p) : "—"}
        label=${c}
        @hd-change=${(y) => t.call(ls(r, y.detail.value), `set ${c.toLowerCase()}`)}
      ></hd-slider>
    </div>`;
  };
  return o`
    <div class="d-section d-row-between">
      <span class="d-label">Solar charging</span>
      <hd-toggle
        .checked=${i.armed}
        label="Toggle solar charging"
        @hd-toggle=${() => e.master ? t.call(B(e.master), "toggle solar charging") : void 0}
      ></hd-toggle>
    </div>

    <div class="d-section">
      <span class="d-label">Status</span>
      <div class="d-value big" style=${`color:${a}`}>${i.label}</div>
      <div class="d-grid">
        ${s("Battery", i.batteryPct != null ? `${Math.round(i.batteryPct)}%` : null)}
        ${s("Target", i.limitPct != null ? `${Math.round(i.limitPct)}%` : null)}
        ${s("Power", i.powerKw != null ? `${$(i.powerKw)} kW` : null)}
        ${s("Current", i.currentA != null ? `${Math.round(i.currentA)} A` : null)}
        ${s("Rate", i.rateKmh != null ? `${Math.round(i.rateKmh)} km/h` : null)}
        ${s("Session", i.sessionKwh != null ? `${$(i.sessionKwh)} kWh` : null)}
      </div>
    </div>

    ${n(e.startThreshold, "Start above export", (r) => `${Math.abs(Math.round(r))} W export`, { min: -5e3, max: -500, step: 50 })}
    ${n(e.stopThreshold, "Stop above import", (r) => `${Math.round(r)} W import`, { min: 0, max: 2e3, step: 50 })}
    ${n(e.minCurrent, "Min charge current", (r) => `${Math.round(r)} A`, { min: 5, max: 10, step: 1 })}
    ${n(e.deadband, "Current deadband", (r) => `${Math.round(r)} A`, { min: 1, max: 5, step: 1 })}
  `;
}
function er(t, e) {
  const i = t.entityId.split(".")[0], a = ["switch", "input_boolean", "fan", "light", "humidifier", "siren"].includes(i);
  return o`
    <div class="d-value big">${Lt(t.hass, e)}</div>
    ${a ? o`<div class="d-section big-buttons">
          <button class="bigbtn" @click=${() => t.call(s1(t.entityId), "turn on")}>Turn on</button>
          <button class="bigbtn" @click=${() => t.call(n1(t.entityId), "turn off")}>Turn off</button>
        </div>` : d}
    ${k1(t, e)}
  `;
}
function k1(t, e) {
  const i = ["device_class", "state_class", "unit_of_measurement"].filter((a) => e.attributes[a] != null);
  return o`<div class="d-grid">
    ${i.map(
    (a) => o`<div class="d-cell"><span class="k">${V(a)}</span><span class="v">${us(t.hass, e, a)}</span></div>`
  )}
    <div class="d-cell"><span class="k">Last updated</span><span class="v">${xe(e.last_updated)}</span></div>
  </div>`;
}
function ir(t) {
  return {
    sunny: "mdi:weather-sunny",
    "clear-night": "mdi:weather-night",
    cloudy: "mdi:weather-cloudy",
    partlycloudy: "mdi:weather-partly-cloudy",
    rainy: "mdi:weather-rainy",
    pouring: "mdi:weather-pouring",
    snowy: "mdi:weather-snowy",
    fog: "mdi:weather-fog",
    windy: "mdi:weather-windy"
  }[t] ?? "mdi:weather-cloudy";
}
function ar(t) {
  const e = t.hass.states[t.entityId], i = t.config?.type;
  if (i === "energy") return Gn(t);
  if (i === "powerflow") return Jn(t);
  if (i === "solarcharging") return tr(t);
  if (!e)
    return o`<div class="d-value big">Entity unavailable</div>
      <div class="d-meta">${t.entityId || "No entity configured"} was not found in Home Assistant.</div>`;
  switch (t.entityId.split(".")[0]) {
    case "light":
      return Un(t, e);
    case "climate":
      return jn(t, e);
    case "media_player":
      return Kn(t, e);
    case "cover":
      return Wn(t, e);
    case "lock":
      return Xn(t, e);
    case "vacuum":
      return Bn(t, e);
    case "sensor":
      return Yn(t, e);
    case "weather":
      return Qn(t, e);
    default:
      return er(t, e);
  }
}
function sr(t, e) {
  return e?.type === "energy" || e?.type === "powerflow" ? e.options?.gridPower ?? null : t.split(".")[0] === "sensor" ? t : null;
}
function nr(t) {
  return t.split(".")[0] === "weather";
}
var rr = Object.defineProperty, or = Object.getOwnPropertyDescriptor, Ve = (t, e, i, a) => {
  for (var s = a > 1 ? void 0 : a ? or(e, i) : e, n = t.length - 1, r; n >= 0; n--)
    (r = t[n]) && (s = (a ? r(e, i, s) : r(s)) || s);
  return a && s && rr(e, i, s), s;
};
let _t = class extends A {
  constructor() {
    super(...arguments), this.checked = !1, this.disabled = !1, this.label = "";
  }
  _toggle() {
    this.disabled || (this.checked = !this.checked, this.dispatchEvent(
      new CustomEvent("hd-toggle", { detail: { checked: this.checked }, bubbles: !0, composed: !0 })
    ));
  }
  render() {
    return o`
      <button
        role="switch"
        aria-checked=${this.checked ? "true" : "false"}
        aria-label=${this.label}
        ?disabled=${this.disabled}
        @click=${this._toggle}
      >
        <span class="track"><span class="thumb"></span></span>
      </button>
    `;
  }
};
_t.styles = x`
    :host {
      display: inline-flex;
    }
    button {
      -webkit-tap-highlight-color: transparent;
      appearance: none;
      border: none;
      cursor: pointer;
      position: relative;
      width: 52px;
      height: 32px;
      min-height: 44px;
      padding: 6px 0;
      background: transparent;
      display: inline-flex;
      align-items: center;
    }
    .track {
      width: 52px;
      height: 32px;
      border-radius: var(--radius-pill);
      background: var(--surface-sunken);
      box-shadow: var(--shadow-inset-control);
      transition: background var(--motion-state) var(--ease-standard);
      position: relative;
    }
    .thumb {
      position: absolute;
      top: 3px;
      left: 3px;
      width: 26px;
      height: 26px;
      border-radius: 50%;
      background: #fff;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.25);
      transition: transform var(--motion-state) var(--ease-emphasis);
    }
    :host([checked]) .track {
      background: var(--accent);
    }
    :host([checked]) .thumb {
      transform: translateX(20px);
    }
    button:disabled {
      cursor: not-allowed;
      opacity: 0.4;
    }
    button:focus-visible {
      outline: none;
    }
    button:focus-visible .track {
      box-shadow: var(--focus-ring), var(--shadow-inset-control);
    }
  `;
Ve([
  m({ type: Boolean, reflect: !0 })
], _t.prototype, "checked", 2);
Ve([
  m({ type: Boolean, reflect: !0 })
], _t.prototype, "disabled", 2);
Ve([
  m({ type: String })
], _t.prototype, "label", 2);
_t = Ve([
  b("hd-toggle")
], _t);
var cr = Object.defineProperty, lr = Object.getOwnPropertyDescriptor, dt = (t, e, i, a) => {
  for (var s = a > 1 ? void 0 : a ? lr(e, i) : e, n = t.length - 1, r; n >= 0; n--)
    (r = t[n]) && (s = (a ? r(e, i, s) : r(s)) || s);
  return a && s && cr(e, i, s), s;
};
let j = class extends A {
  constructor() {
    super(...arguments), this.open = !1, this.entityId = "", this._trend = [], this._forecast = [], this._loadedKey = "", this._call = async (t, e = "update") => {
      if (this.hass)
        try {
          await a1(this.hass, t);
        } catch {
          jt(this, { message: `Couldn't ${e} ${this._name}`, tone: "alert", icon: "mdi:alert-circle-outline" });
        }
    };
  }
  updated(t) {
    (t.has("open") || t.has("entityId")) && (this.open ? this._maybeLoad() : this._loadedKey && (this._trend.length && (this._trend = []), this._forecast.length && (this._forecast = []), this._loadedKey = ""));
  }
  async _maybeLoad() {
    if (!this.hass) return;
    const t = `${this.entityId}:${this.config?.type ?? ""}:${this.config?.id ?? ""}`;
    if (this._loadedKey === t) return;
    this._loadedKey = t, this._trend.length && (this._trend = []), this._forecast.length && (this._forecast = []), this.entityId.startsWith("light.") && this.hass.states[this.entityId]?.attributes.supported_color_modes?.some((a) => ["hs", "xy", "rgb", "rgbw", "rgbww", "rgbwww"].includes(a)) && Promise.resolve().then(() => br);
    const e = sr(this.entityId, this.config);
    if (e && this.hass.connected) {
      const i = await ai(this.hass, e, 24);
      this._trend = i.map((a) => a.value);
    }
    this.entityId && nr(this.entityId) && this.hass.connected && await this._loadForecast();
  }
  async _loadForecast() {
    if (!this.hass) return;
    const t = this.hass.states[this.entityId]?.attributes.forecast;
    if (t?.length) {
      this._forecast = t.slice(0, 7);
      return;
    }
    try {
      const e = await this.hass.callWS({
        type: "call_service",
        domain: "weather",
        service: "get_forecasts",
        service_data: { type: "daily" },
        target: { entity_id: this.entityId },
        return_response: !0
      });
      this._forecast = (e?.response?.[this.entityId]?.forecast ?? []).slice(0, 7);
    } catch {
      this._forecast = [];
    }
  }
  get _name() {
    return this.config?.name ?? this.hass?.states[this.entityId]?.attributes.friendly_name ?? this.entityId;
  }
  _close() {
    this.open = !1, this.dispatchEvent(new CustomEvent("hd-detail-close", { bubbles: !0, composed: !0 }));
  }
  render() {
    if (!this.hass || !this.entityId && !this.config)
      return o`<hd-surface .open=${this.open} @hd-close=${() => this._close()}></hd-surface>`;
    const t = y1(this.hass, this.entityId, this.config), e = {
      hass: this.hass,
      entityId: this.entityId,
      config: this.config,
      host: this,
      trend: this._trend,
      forecast: this._forecast,
      call: this._call
    }, i = this.config?.type === "energy" ? "Live energy" : this.config?.type === "powerflow" ? "Live power flow" : t.displayState;
    return o`
      <hd-surface
        variant="auto"
        .open=${this.open}
        .heading=${this._name}
        .subheading=${i}
        @hd-close=${() => this._close()}
      >
        ${this.open ? ar(e) : d}
      </hd-surface>
    `;
  }
};
j.styles = x`
    .d-section {
      margin-top: 18px;
      display: flex;
      flex-direction: column;
      gap: 10px;
    }
    .d-row-between {
      flex-direction: row;
      align-items: center;
      justify-content: space-between;
    }
    .d-label {
      font: var(--text-widget-title);
      color: var(--text-secondary);
      font-weight: 600;
    }
    .d-value {
      font: var(--text-value);
      color: var(--text-primary);
      font-variant-numeric: tabular-nums;
    }
    .d-value.big {
      font: var(--text-value-lg);
    }
    .d-sub {
      font: var(--text-secondary-state);
      color: var(--text-secondary);
    }
    .d-meta {
      font: var(--text-meta);
      color: var(--text-tertiary);
      margin-top: 8px;
    }
    .color-wheel-wrap {
      min-height: 240px;
    }
    .swatches {
      display: flex;
      gap: 10px;
      flex-wrap: wrap;
    }
    .swatch {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      border: 2px solid var(--surface);
      box-shadow: 0 0 0 1px var(--border-strong);
      cursor: pointer;
    }
    .swatch:disabled {
      opacity: 0.4;
      cursor: not-allowed;
    }
    .swatch:focus-visible {
      outline: none;
      box-shadow: var(--focus-ring);
    }
    .chips {
      display: flex;
      gap: 8px;
      flex-wrap: wrap;
    }
    .chip {
      appearance: none;
      border: none;
      cursor: pointer;
      padding: 9px 14px;
      border-radius: var(--radius-pill);
      background: var(--surface-subtle);
      color: var(--text-secondary);
      font: var(--text-secondary-state);
      font-weight: 600;
      min-height: 40px;
    }
    .chip.with-icon {
      display: inline-flex;
      align-items: center;
      gap: 7px;
    }
    .chip.with-icon hd-icon {
      opacity: 0.85;
    }
    .chip.active {
      background: var(--accent);
      color: var(--text-on-accent);
    }
    .chip.active.with-icon hd-icon {
      opacity: 1;
    }
    .chip:focus-visible {
      outline: none;
      box-shadow: var(--focus-ring);
    }
    .big-buttons {
      flex-direction: row;
      flex-wrap: wrap;
      gap: 10px;
    }
    .bigbtn {
      flex: 1 1 30%;
      min-height: 56px;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 4px;
      border: none;
      cursor: pointer;
      border-radius: var(--radius-control);
      background: var(--surface-subtle);
      color: var(--text-primary);
      font: var(--text-secondary-state);
      font-weight: 650;
    }
    .bigbtn.active {
      background: var(--accent-soft);
      color: var(--accent-text);
    }
    .bigbtn:focus-visible {
      outline: none;
      box-shadow: var(--focus-ring);
    }
    /* Featured streaming-app launchers — bigger, branded, primary. */
    .media-apps {
      display: flex;
      gap: 10px;
    }
    .bigbtn.app {
      min-height: 74px;
      gap: 9px;
      border-radius: var(--radius-widget);
      font-weight: 700;
    }
    .bigbtn.app hd-icon {
      opacity: 0.95;
    }
    .bigbtn.app.active {
      background: var(--accent);
      color: var(--text-on-accent);
    }
    .climate-hero {
      flex-direction: row;
      align-items: center;
      justify-content: center;
      gap: 24px;
      margin-top: 8px;
    }
    .climate-target {
      display: flex;
      flex-direction: column;
      align-items: center;
    }
    .climate-target .big {
      font: var(--text-value-lg);
      font-size: 44px;
      font-variant-numeric: tabular-nums;
      color: var(--text-primary);
    }
    .climate-target .sub {
      font: var(--text-meta);
      color: var(--text-tertiary);
    }
    .media-art {
      width: 100%;
      height: 180px;
      border-radius: var(--radius-widget);
      background-size: cover;
      background-position: center;
      background-color: var(--surface-sunken);
    }
    .media-art-fallback {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 12px;
      color: var(--text-secondary);
      background: linear-gradient(135deg, var(--surface-subtle), var(--surface-sunken));
    }
    .media-art-fallback span {
      font: var(--text-widget-title);
      font-weight: 650;
      letter-spacing: 0.02em;
    }
    .media-meta {
      margin-top: 12px;
    }
    .media-progress {
      gap: 6px;
    }
    .media-progress-bar {
      height: 6px;
      border-radius: var(--radius-pill);
      background: var(--surface-subtle);
      overflow: hidden;
    }
    .media-progress-bar span {
      display: block;
      height: 100%;
      border-radius: var(--radius-pill);
      background: var(--accent);
    }
    .media-progress-time {
      display: flex;
      justify-content: space-between;
      font: var(--text-meta);
      color: var(--text-secondary);
      font-variant-numeric: tabular-nums;
    }
    .media-transport {
      flex-direction: row;
      align-items: center;
      justify-content: center;
      gap: 12px;
    }
    .vol-row {
      display: flex;
      align-items: center;
      gap: 10px;
    }
    .d-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 10px;
      margin-top: 6px;
    }
    .d-cell {
      background: var(--surface-subtle);
      border-radius: var(--radius-control);
      padding: 12px 14px;
      display: flex;
      flex-direction: column;
      gap: 3px;
    }
    .d-cell .k {
      font: var(--text-meta);
      color: var(--text-tertiary);
    }
    .d-cell .v {
      font: var(--text-secondary-state);
      color: var(--text-primary);
      font-weight: 650;
      font-variant-numeric: tabular-nums;
    }
    .detail-trend {
      height: 90px;
    }
    .detail-flow {
      height: 320px;
      margin: 4px 0 8px;
    }
    .fc-row {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 8px 0;
      border-top: 1px solid var(--border-subtle);
    }
    .fc-day {
      flex: 1;
      font: var(--text-secondary-state);
      color: var(--text-primary);
    }
    .fc-temp {
      font: var(--text-secondary-state);
      color: var(--text-secondary);
      font-variant-numeric: tabular-nums;
    }
  `;
dt([
  m({ attribute: !1 })
], j.prototype, "hass", 2);
dt([
  m({ type: Boolean, reflect: !0 })
], j.prototype, "open", 2);
dt([
  m({ type: String })
], j.prototype, "entityId", 2);
dt([
  m({ attribute: !1 })
], j.prototype, "config", 2);
dt([
  C()
], j.prototype, "_trend", 2);
dt([
  C()
], j.prototype, "_forecast", 2);
j = dt([
  b("hd-detail")
], j);
var dr = Object.defineProperty, hr = Object.getOwnPropertyDescriptor, si = (t, e, i, a) => {
  for (var s = a > 1 ? void 0 : a ? hr(e, i) : e, n = t.length - 1, r; n >= 0; n--)
    (r = t[n]) && (s = (a ? r(e, i, s) : r(s)) || s);
  return a && s && dr(e, i, s), s;
};
let Wt = class extends A {
  constructor() {
    super(...arguments), this._open = !1, this._opts = null, this._resolve = null;
  }
  ask(t) {
    return this._opts = t, this._open = !0, new Promise((e) => {
      this._resolve = e;
    });
  }
  _settle(t) {
    this._resolve?.(t), this._resolve = null, this._open = !1;
  }
  render() {
    const t = this._opts;
    return t ? o`
      <hd-surface
        variant="center"
        headless
        ?open=${this._open}
        @hd-close=${() => this._settle(!1)}
      >
        <div class="content">
          <div class="head">
            <div class="badge ${t.destructive ? "destructive" : ""}">
              <hd-icon .icon=${t.icon ?? (t.destructive ? "mdi:alert" : "mdi:help-circle-outline")} .size=${24}></hd-icon>
            </div>
            <div>
              <h3>${t.title}</h3>
              ${t.message ? o`<p>${t.message}</p>` : d}
            </div>
          </div>
          <div class="actions">
            <button class="cancel" @click=${() => this._settle(!1)}>${t.cancelLabel ?? "Cancel"}</button>
            <button class="ok ${t.destructive ? "destructive" : ""}" @click=${() => this._settle(!0)}>
              ${t.confirmLabel ?? "Confirm"}
            </button>
          </div>
        </div>
      </hd-surface>
    ` : d;
  }
};
Wt.styles = x`
    .content {
      display: flex;
      flex-direction: column;
      gap: 14px;
      padding-top: 4px;
    }
    .head {
      display: flex;
      gap: 14px;
      align-items: flex-start;
    }
    .badge {
      flex: none;
      width: 46px;
      height: 46px;
      border-radius: var(--radius-icon);
      display: grid;
      place-items: center;
      background: var(--accent-soft);
      color: var(--accent-text);
    }
    .badge.destructive {
      background: var(--state-alert-soft);
      color: var(--state-alert);
    }
    h3 {
      margin: 0 0 4px;
      font: var(--text-drawer-title);
    }
    p {
      margin: 0;
      color: var(--text-secondary);
      font: var(--text-secondary-state);
      line-height: 1.45;
    }
    .actions {
      display: flex;
      gap: 10px;
      justify-content: flex-end;
      margin-top: 4px;
    }
    button {
      -webkit-tap-highlight-color: transparent;
      appearance: none;
      border: none;
      cursor: pointer;
      min-height: 44px;
      padding: 0 18px;
      border-radius: var(--radius-control);
      font: var(--text-widget-title);
      font-weight: 650;
      transition: background var(--motion-press) var(--ease-standard);
    }
    .cancel {
      background: var(--surface-subtle);
      color: var(--text-primary);
    }
    .cancel:hover {
      background: var(--surface-hover);
    }
    .ok {
      background: var(--accent);
      color: var(--text-on-accent);
    }
    .ok:hover {
      background: var(--accent-hover);
    }
    .ok.destructive {
      background: var(--state-alert);
    }
    button:focus-visible {
      outline: none;
      box-shadow: var(--focus-ring);
    }
  `;
si([
  C()
], Wt.prototype, "_open", 2);
si([
  C()
], Wt.prototype, "_opts", 2);
Wt = si([
  b("hd-confirm")
], Wt);
var ur = Object.defineProperty, pr = Object.getOwnPropertyDescriptor, S1 = (t, e, i, a) => {
  for (var s = a > 1 ? void 0 : a ? pr(e, i) : e, n = t.length - 1, r; n >= 0; n--)
    (r = t[n]) && (s = (a ? r(e, i, s) : r(s)) || s);
  return a && s && ur(e, i, s), s;
};
let fe = class extends A {
  constructor() {
    super(...arguments), this._toasts = [], this._seq = 0;
  }
  show(t) {
    const e = ++this._seq;
    this._toasts = [...this._toasts, { ...t, id: e }];
    const i = t.duration ?? 3200;
    window.setTimeout(() => {
      this._toasts = this._toasts.filter((a) => a.id !== e);
    }, i);
  }
  render() {
    return o`<div aria-live="polite" aria-atomic="false">
      ${this._toasts.map(
      (t) => o`<div class="toast ${t.tone ?? "neutral"}" role="status">
          ${t.icon ? o`<hd-icon .icon=${t.icon} .size=${18}></hd-icon>` : ""}
          <span>${t.message}</span>
        </div>`
    )}
    </div>`;
  }
};
fe.styles = x`
    :host {
      position: fixed;
      left: 50%;
      bottom: calc(env(safe-area-inset-bottom, 0px) + 18px);
      transform: translateX(-50%);
      z-index: 1100;
      display: flex;
      flex-direction: column-reverse;
      gap: 8px;
      pointer-events: none;
      width: max-content;
      max-width: min(92vw, 420px);
    }
    .toast {
      pointer-events: auto;
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 12px 16px;
      border-radius: var(--radius-pill);
      background: var(--surface-inverse);
      color: var(--canvas);
      box-shadow: var(--shadow-raised);
      font: var(--text-secondary-state);
      font-weight: 600;
      animation: rise var(--motion-surface) var(--ease-emphasis) both;
    }
    .toast.eco {
      background: var(--state-eco);
      color: #06210f;
    }
    .toast.warn {
      background: var(--state-warn);
      color: #2a1c00;
    }
    .toast.alert {
      background: var(--state-alert);
      color: #2a0606;
    }
    @keyframes rise {
      from {
        opacity: 0;
        transform: translateY(10px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }
    @media (prefers-reduced-motion: reduce) {
      .toast {
        animation-duration: 1ms;
      }
    }
  `;
S1([
  C()
], fe.prototype, "_toasts", 2);
fe = S1([
  b("hd-toasts")
], fe);
var mr = Object.defineProperty, gr = Object.getOwnPropertyDescriptor, R = (t, e, i, a) => {
  for (var s = a > 1 ? void 0 : a ? gr(e, i) : e, n = t.length - 1, r; n >= 0; n--)
    (r = t[n]) && (s = (a ? r(e, i, s) : r(s)) || s);
  return a && s && mr(e, i, s), s;
};
const Ii = "hd-panel-appearance";
let O = class extends A {
  constructor() {
    super(...arguments), this.narrow = !1, this._viewId = "", this._appearance = "auto", this._detailOpen = !1, this._detailEntityId = "", this._onPop = () => this._syncViewFromLocation(), this._onMqlChange = () => this._applyTheme(), this._onWindowError = (t) => {
      const e = t.error;
      `${t.message ?? ""} ${typeof e == "string" ? e : e?.message ?? ""}`.includes("ResizeObserver loop") || console.error("[home-dashboard-panel] uncaught error:", e ?? t.message);
    }, this._onRejection = (t) => console.error("[home-dashboard-panel] unhandled rejection:", t.reason);
  }
  // ---- Lifecycle ---------------------------------------------------------
  connectedCallback() {
    super.connectedCallback(), this._appearance = localStorage.getItem(Ii) || "auto", this._mqlDark = window.matchMedia("(prefers-color-scheme: dark)"), this._mqlDark.addEventListener("change", this._onMqlChange), window.addEventListener("popstate", this._onPop), window.addEventListener("error", this._onWindowError), window.addEventListener("unhandledrejection", this._onRejection), this._syncViewFromLocation(), this._applyTheme(), this._applyKiosk();
  }
  disconnectedCallback() {
    super.disconnectedCallback(), this._mqlDark?.removeEventListener("change", this._onMqlChange), window.removeEventListener("popstate", this._onPop), window.removeEventListener("error", this._onWindowError), window.removeEventListener("unhandledrejection", this._onRejection);
  }
  willUpdate(t) {
    t.has("route") && this._syncViewFromLocation(), t.has("hass") && this._appearance === "auto" && this._applyTheme();
  }
  // ---- Config ------------------------------------------------------------
  get _cfg() {
    if (!this._validated) {
      const t = ua(sa);
      this._validated = { config: t.sanitized, issues: t.issues };
      const e = t.issues.filter((i) => i.level === "error");
      e.length && console.error("[home-dashboard-panel] Invalid dashboard config:", e);
    }
    return this._validated;
  }
  get _base() {
    return this.panel?.url_path ?? "home-dashboard";
  }
  get _views() {
    return this._cfg.config.views;
  }
  get _navViews() {
    return this._views.map((t) => ({ id: t.id, label: t.label, icon: t.icon, type: t.type }));
  }
  get _currentView() {
    return this._views.find((t) => t.id === this._viewId) ?? this._views[0];
  }
  // ---- Routing -----------------------------------------------------------
  _syncViewFromLocation() {
    const e = pa(this.route, this._base) || this._cfg.config.defaultView, i = this._views.some((a) => a.id === e);
    this._viewId = i ? e : this._cfg.config.defaultView;
  }
  _onNavigate(t) {
    t !== this._viewId && (this._viewId = t, va(fa(this._base, t, this._cfg.config.defaultView)), this.renderRoot.querySelector(".content")?.scrollTo?.({ top: 0 }));
  }
  // ---- Theme -------------------------------------------------------------
  _resolveDark() {
    return this._appearance === "dark" ? !0 : this._appearance === "light" ? !1 : this.hass?.themes?.darkMode != null ? !!this.hass.themes.darkMode : !!this._mqlDark?.matches;
  }
  _applyTheme() {
    this.setAttribute("data-theme", this._resolveDark() ? "dark" : "light");
  }
  _cycleAppearance() {
    this._appearance = this._appearance === "auto" ? "light" : this._appearance === "light" ? "dark" : "auto", localStorage.setItem(Ii, this._appearance), this._applyTheme();
  }
  _applyKiosk() {
    this._cfg.config.kiosk?.enabled && this._cfg.config.kiosk.preventScreenSelection && this.setAttribute("data-kiosk", "");
  }
  // ---- Event bus ---------------------------------------------------------
  _onOpenDetail(t) {
    this._detailEntityId = t.detail.entityId ?? "", this._detailConfig = t.detail.config, this._detailOpen = !0;
  }
  _onConfirm(t) {
    t.stopPropagation(), this._confirm ? this._confirm.ask(t.detail.opts).then(t.detail.resolve) : t.detail.resolve(!1);
  }
  _onToast(t) {
    t.stopPropagation(), this._toasts?.show(t.detail);
  }
  render() {
    if (!this.hass)
      return o`<div class="loading"><hd-skeleton w="220px" h="26px"></hd-skeleton></div>`;
    const t = this._cfg.issues.filter((i) => i.level === "error"), e = this._currentView;
    return o`
      <hd-app-shell
        .views=${this._navViews}
        .currentViewId=${e?.id ?? ""}
        .productTitle=${this._cfg.config.title ?? "Home"}
        .subtitle=${e?.subtitle ?? ""}
        .connected=${this.hass.connected !== !1}
        .appearance=${this._appearance}
        @hd-navigate=${(i) => this._onNavigate(i.detail.viewId)}
        @hd-toggle-appearance=${() => this._cycleAppearance()}
        @hd-open-detail=${(i) => this._onOpenDetail(i)}
        @hd-confirm=${(i) => this._onConfirm(i)}
        @hd-toast=${(i) => this._onToast(i)}
      >
        ${t.length ? o`<div class="cfg-errors" role="alert">
              <strong>Dashboard configuration has ${t.length} error(s):</strong>
              <ul>
                ${t.slice(0, 8).map((i) => o`<li><code>${i.path}</code> — ${i.message}</li>`)}
              </ul>
            </div>` : d}
        <hd-view-grid .hass=${this.hass} .view=${e}></hd-view-grid>
      </hd-app-shell>

      <hd-detail
        .hass=${this.hass}
        .open=${this._detailOpen}
        .entityId=${this._detailEntityId}
        .config=${this._detailConfig}
        @hd-detail-close=${() => this._detailOpen = !1}
      ></hd-detail>

      <hd-confirm></hd-confirm>
      <hd-toasts></hd-toasts>
    `;
  }
};
O.styles = [
  ia,
  aa,
  x`
      :host {
        display: block;
        height: 100%;
        width: 100%;
        font-family: var(--font-sans);
        background: var(--canvas);
        color: var(--text-primary);
        -webkit-font-smoothing: antialiased;
        text-rendering: optimizeLegibility;
      }
      :host([data-kiosk]) {
        user-select: none;
        -webkit-user-select: none;
      }
      .loading {
        height: 100%;
        display: grid;
        place-items: center;
      }
      .cfg-errors {
        margin: 12px 24px 0;
        padding: 14px 16px;
        border-radius: var(--radius-control);
        background: var(--state-alert-soft);
        color: var(--state-alert);
        font: var(--text-secondary-state);
      }
      .cfg-errors strong {
        display: block;
        margin-bottom: 6px;
      }
      .cfg-errors ul {
        margin: 0;
        padding-left: 18px;
      }
      .cfg-errors code {
        font-family: ui-monospace, monospace;
      }
    `
];
R([
  m({ attribute: !1 })
], O.prototype, "hass", 2);
R([
  m({ type: Boolean })
], O.prototype, "narrow", 2);
R([
  m({ attribute: !1 })
], O.prototype, "panel", 2);
R([
  m({ attribute: !1 })
], O.prototype, "route", 2);
R([
  C()
], O.prototype, "_viewId", 2);
R([
  C()
], O.prototype, "_appearance", 2);
R([
  C()
], O.prototype, "_detailOpen", 2);
R([
  C()
], O.prototype, "_detailEntityId", 2);
R([
  C()
], O.prototype, "_detailConfig", 2);
R([
  Je("hd-confirm")
], O.prototype, "_confirm", 2);
R([
  Je("hd-toasts")
], O.prototype, "_toasts", 2);
O = R([
  b("home-dashboard-panel")
], O);
var fr = Object.defineProperty, vr = Object.getOwnPropertyDescriptor, Me = (t, e, i, a) => {
  for (var s = a > 1 ? void 0 : a ? vr(e, i) : e, n = t.length - 1, r; n >= 0; n--)
    (r = t[n]) && (s = (a ? r(e, i, s) : r(s)) || s);
  return a && s && fr(e, i, s), s;
};
let ct = class extends A {
  constructor() {
    super(...arguments), this.hue = 0, this.sat = 100, this.disabled = !1, this._onDown = (t) => {
      if (this.disabled) return;
      t.preventDefault(), this._track(t);
      const e = (a) => this._track(a), i = () => {
        window.removeEventListener("pointermove", e), window.removeEventListener("pointerup", i), this._emit("hd-color");
      };
      window.addEventListener("pointermove", e), window.addEventListener("pointerup", i);
    };
  }
  _track(t) {
    const e = this.renderRoot.querySelector(".wheel");
    if (!e) return;
    const i = e.getBoundingClientRect(), a = t.clientX - (i.left + i.width / 2), s = t.clientY - (i.top + i.height / 2), n = Math.min(1, Math.hypot(a, s) / (i.width / 2));
    let r = Math.atan2(s, a) * 180 / Math.PI;
    r < 0 && (r += 360), this.hue = Math.round(r), this.sat = Math.round(n * 100), this._emit("hd-color-input");
  }
  _emit(t) {
    this.dispatchEvent(
      new CustomEvent(t, { detail: { hue: this.hue, sat: this.sat }, bubbles: !0, composed: !0 })
    );
  }
  render() {
    const t = this.hue * Math.PI / 180, e = this.sat / 100, i = 50 + Math.cos(t) * e * 50, a = 50 + Math.sin(t) * e * 50, s = `hsl(${this.hue}, ${this.sat}%, 50%)`;
    return o`<div
      class="wheel"
      role="slider"
      aria-label="Colour"
      aria-valuetext=${`hue ${this.hue}°, saturation ${this.sat}%`}
      @pointerdown=${this._onDown}
    >
      <div class="handle" style=${`left:${i}%;top:${a}%;background:${s}`}></div>
    </div>`;
  }
};
ct.styles = x`
    :host {
      display: block;
    }
    .wheel {
      position: relative;
      width: 100%;
      max-width: 240px;
      aspect-ratio: 1;
      margin: 0 auto;
      border-radius: 50%;
      touch-action: none;
      cursor: crosshair;
      background:
        radial-gradient(circle at center, #fff 0%, rgba(255, 255, 255, 0) 100%),
        conic-gradient(
          from 90deg,
          hsl(0, 100%, 50%),
          hsl(60, 100%, 50%),
          hsl(120, 100%, 50%),
          hsl(180, 100%, 50%),
          hsl(240, 100%, 50%),
          hsl(300, 100%, 50%),
          hsl(360, 100%, 50%)
        );
      box-shadow: inset 0 0 0 1px rgba(0, 0, 0, 0.1);
    }
    :host([disabled]) .wheel {
      opacity: 0.4;
      pointer-events: none;
    }
    .handle {
      position: absolute;
      width: 24px;
      height: 24px;
      border-radius: 50%;
      border: 3px solid #fff;
      box-shadow: 0 1px 5px rgba(0, 0, 0, 0.45);
      transform: translate(-50%, -50%);
      pointer-events: none;
    }
  `;
Me([
  m({ type: Number })
], ct.prototype, "hue", 2);
Me([
  m({ type: Number })
], ct.prototype, "sat", 2);
Me([
  m({ type: Boolean, reflect: !0 })
], ct.prototype, "disabled", 2);
ct = Me([
  b("hd-color-wheel")
], ct);
const br = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  get HdColorWheel() {
    return ct;
  }
}, Symbol.toStringTag, { value: "Module" }));
export {
  O as HomeDashboardPanel
};
