/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const re = globalThis, si = re.ShadowRoot && (re.ShadyCSS === void 0 || re.ShadyCSS.nativeShadow) && "adoptedStyleSheets" in Document.prototype && "replace" in CSSStyleSheet.prototype, ni = Symbol(), vi = /* @__PURE__ */ new WeakMap();
let Wi = class {
  constructor(e, i, a) {
    if (this._$cssResult$ = !0, a !== ni) throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");
    this.cssText = e, this.t = i;
  }
  get styleSheet() {
    let e = this.o;
    const i = this.t;
    if (si && e === void 0) {
      const a = i !== void 0 && i.length === 1;
      a && (e = vi.get(i)), e === void 0 && ((this.o = e = new CSSStyleSheet()).replaceSync(this.cssText), a && vi.set(i, e));
    }
    return e;
  }
  toString() {
    return this.cssText;
  }
};
const Ki = (t) => new Wi(typeof t == "string" ? t : t + "", void 0, ni), y = (t, ...e) => {
  const i = t.length === 1 ? t[0] : e.reduce((a, s, n) => a + ((r) => {
    if (r._$cssResult$ === !0) return r.cssText;
    if (typeof r == "number") return r;
    throw Error("Value passed to 'css' function must be a 'css' function result: " + r + ". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.");
  })(s) + t[n + 1], t[0]);
  return new Wi(i, t, ni);
}, Fa = (t, e) => {
  if (si) t.adoptedStyleSheets = e.map((i) => i instanceof CSSStyleSheet ? i : i.styleSheet);
  else for (const i of e) {
    const a = document.createElement("style"), s = re.litNonce;
    s !== void 0 && a.setAttribute("nonce", s), a.textContent = i.cssText, t.appendChild(a);
  }
}, bi = si ? (t) => t : (t) => t instanceof CSSStyleSheet ? ((e) => {
  let i = "";
  for (const a of e.cssRules) i += a.cssText;
  return Ki(i);
})(t) : t;
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const { is: Ua, defineProperty: Ja, getOwnPropertyDescriptor: $a, getOwnPropertyNames: ja, getOwnPropertySymbols: qa, getPrototypeOf: Wa } = Object, xe = globalThis, yi = xe.trustedTypes, Ka = yi ? yi.emptyScript : "", Na = xe.reactiveElementPolyfillSupport, Ft = (t, e) => t, ce = { toAttribute(t, e) {
  switch (e) {
    case Boolean:
      t = t ? Ka : null;
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
} }, ri = (t, e) => !Ua(t, e), wi = { attribute: !0, type: String, converter: ce, reflect: !1, useDefault: !1, hasChanged: ri };
Symbol.metadata ??= Symbol("metadata"), xe.litPropertyMetadata ??= /* @__PURE__ */ new WeakMap();
let gt = class extends HTMLElement {
  static addInitializer(e) {
    this._$Ei(), (this.l ??= []).push(e);
  }
  static get observedAttributes() {
    return this.finalize(), this._$Eh && [...this._$Eh.keys()];
  }
  static createProperty(e, i = wi) {
    if (i.state && (i.attribute = !1), this._$Ei(), this.prototype.hasOwnProperty(e) && ((i = Object.create(i)).wrapped = !0), this.elementProperties.set(e, i), !i.noAccessor) {
      const a = Symbol(), s = this.getPropertyDescriptor(e, a, i);
      s !== void 0 && Ja(this.prototype, e, s);
    }
  }
  static getPropertyDescriptor(e, i, a) {
    const { get: s, set: n } = $a(this.prototype, e) ?? { get() {
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
    return this.elementProperties.get(e) ?? wi;
  }
  static _$Ei() {
    if (this.hasOwnProperty(Ft("elementProperties"))) return;
    const e = Wa(this);
    e.finalize(), e.l !== void 0 && (this.l = [...e.l]), this.elementProperties = new Map(e.elementProperties);
  }
  static finalize() {
    if (this.hasOwnProperty(Ft("finalized"))) return;
    if (this.finalized = !0, this._$Ei(), this.hasOwnProperty(Ft("properties"))) {
      const i = this.properties, a = [...ja(i), ...qa(i)];
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
      for (const s of a) i.unshift(bi(s));
    } else e !== void 0 && i.push(bi(e));
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
    return Fa(e, this.constructor.elementStyles), e;
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
      const n = (a.converter?.toAttribute !== void 0 ? a.converter : ce).toAttribute(i, a.type);
      this._$Em = e, n == null ? this.removeAttribute(s) : this.setAttribute(s, n), this._$Em = null;
    }
  }
  _$AK(e, i) {
    const a = this.constructor, s = a._$Eh.get(e);
    if (s !== void 0 && this._$Em !== s) {
      const n = a.getPropertyOptions(s), r = typeof n.converter == "function" ? { fromAttribute: n.converter } : n.converter?.fromAttribute !== void 0 ? n.converter : ce;
      this._$Em = s;
      const c = r.fromAttribute(i, n.type);
      this[s] = c ?? this._$Ej?.get(s) ?? c, this._$Em = null;
    }
  }
  requestUpdate(e, i, a, s = !1, n) {
    if (e !== void 0) {
      const r = this.constructor;
      if (s === !1 && (n = this[e]), a ??= r.getPropertyOptions(e), !((a.hasChanged ?? ri)(n, i) || a.useDefault && a.reflect && n === this._$Ej?.get(e) && !this.hasAttribute(r._$Eu(e, a)))) return;
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
gt.elementStyles = [], gt.shadowRootOptions = { mode: "open" }, gt[Ft("elementProperties")] = /* @__PURE__ */ new Map(), gt[Ft("finalized")] = /* @__PURE__ */ new Map(), Na?.({ ReactiveElement: gt }), (xe.reactiveElementVersions ??= []).push("2.1.2");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const oi = globalThis, Ci = (t) => t, le = oi.trustedTypes, xi = le ? le.createPolicy("lit-html", { createHTML: (t) => t }) : void 0, Ni = "$lit$", q = `lit$${Math.random().toFixed(9).slice(2)}$`, Xi = "?" + q, Xa = `<${Xi}>`, at = document, Jt = () => at.createComment(""), $t = (t) => t === null || typeof t != "object" && typeof t != "function", ci = Array.isArray, Ya = (t) => ci(t) || typeof t?.[Symbol.iterator] == "function", Be = `[ 	
\f\r]`, Et = /<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g, Ai = /-->/g, Li = />/g, X = RegExp(`>|${Be}(?:([^\\s"'>=/]+)(${Be}*=${Be}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`, "g"), Hi = /'/g, Mi = /"/g, Yi = /^(?:script|style|textarea|title)$/i, Gi = (t) => (e, ...i) => ({ _$litType$: t, strings: e, values: i }), o = Gi(1), jt = Gi(2), st = Symbol.for("lit-noChange"), d = Symbol.for("lit-nothing"), Vi = /* @__PURE__ */ new WeakMap(), et = at.createTreeWalker(at, 129);
function ta(t, e) {
  if (!ci(t) || !t.hasOwnProperty("raw")) throw Error("invalid template strings array");
  return xi !== void 0 ? xi.createHTML(e) : e;
}
const Ga = (t, e) => {
  const i = t.length - 1, a = [];
  let s, n = e === 2 ? "<svg>" : e === 3 ? "<math>" : "", r = Et;
  for (let c = 0; c < i; c++) {
    const l = t[c];
    let h, u, m = -1, f = 0;
    for (; f < l.length && (r.lastIndex = f, u = r.exec(l), u !== null); ) f = r.lastIndex, r === Et ? u[1] === "!--" ? r = Ai : u[1] !== void 0 ? r = Li : u[2] !== void 0 ? (Yi.test(u[2]) && (s = RegExp("</" + u[2], "g")), r = X) : u[3] !== void 0 && (r = X) : r === X ? u[0] === ">" ? (r = s ?? Et, m = -1) : u[1] === void 0 ? m = -2 : (m = r.lastIndex - u[2].length, h = u[1], r = u[3] === void 0 ? X : u[3] === '"' ? Mi : Hi) : r === Mi || r === Hi ? r = X : r === Ai || r === Li ? r = Et : (r = X, s = void 0);
    const g = r === X && t[c + 1].startsWith("/>") ? " " : "";
    n += r === Et ? l + Xa : m >= 0 ? (a.push(h), l.slice(0, m) + Ni + l.slice(m) + q + g) : l + q + (m === -2 ? c : g);
  }
  return [ta(t, n + (t[i] || "<?>") + (e === 2 ? "</svg>" : e === 3 ? "</math>" : "")), a];
};
class qt {
  constructor({ strings: e, _$litType$: i }, a) {
    let s;
    this.parts = [];
    let n = 0, r = 0;
    const c = e.length - 1, l = this.parts, [h, u] = Ga(e, i);
    if (this.el = qt.createElement(h, a), et.currentNode = this.el.content, i === 2 || i === 3) {
      const m = this.el.content.firstChild;
      m.replaceWith(...m.childNodes);
    }
    for (; (s = et.nextNode()) !== null && l.length < c; ) {
      if (s.nodeType === 1) {
        if (s.hasAttributes()) for (const m of s.getAttributeNames()) if (m.endsWith(Ni)) {
          const f = u[r++], g = s.getAttribute(m).split(q), v = /([.?@])?(.*)/.exec(f);
          l.push({ type: 1, index: n, name: v[2], strings: g, ctor: v[1] === "." ? e1 : v[1] === "?" ? i1 : v[1] === "@" ? a1 : Ae }), s.removeAttribute(m);
        } else m.startsWith(q) && (l.push({ type: 6, index: n }), s.removeAttribute(m));
        if (Yi.test(s.tagName)) {
          const m = s.textContent.split(q), f = m.length - 1;
          if (f > 0) {
            s.textContent = le ? le.emptyScript : "";
            for (let g = 0; g < f; g++) s.append(m[g], Jt()), et.nextNode(), l.push({ type: 2, index: ++n });
            s.append(m[f], Jt());
          }
        }
      } else if (s.nodeType === 8) if (s.data === Xi) l.push({ type: 2, index: n });
      else {
        let m = -1;
        for (; (m = s.data.indexOf(q, m + 1)) !== -1; ) l.push({ type: 7, index: n }), m += q.length - 1;
      }
      n++;
    }
  }
  static createElement(e, i) {
    const a = at.createElement("template");
    return a.innerHTML = e, a;
  }
}
function vt(t, e, i = t, a) {
  if (e === st) return e;
  let s = a !== void 0 ? i._$Co?.[a] : i._$Cl;
  const n = $t(e) ? void 0 : e._$litDirective$;
  return s?.constructor !== n && (s?._$AO?.(!1), n === void 0 ? s = void 0 : (s = new n(t), s._$AT(t, i, a)), a !== void 0 ? (i._$Co ??= [])[a] = s : i._$Cl = s), s !== void 0 && (e = vt(t, s._$AS(t, e.values), s, a)), e;
}
class t1 {
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
        l.type === 2 ? h = new Vt(n, n.nextSibling, this, e) : l.type === 1 ? h = new l.ctor(n, l.name, l.strings, this, e) : l.type === 6 && (h = new s1(n, this, e)), this._$AV.push(h), l = a[++c];
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
class Vt {
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
    e = vt(this, e, i), $t(e) ? e === d || e == null || e === "" ? (this._$AH !== d && this._$AR(), this._$AH = d) : e !== this._$AH && e !== st && this._(e) : e._$litType$ !== void 0 ? this.$(e) : e.nodeType !== void 0 ? this.T(e) : Ya(e) ? this.k(e) : this._(e);
  }
  O(e) {
    return this._$AA.parentNode.insertBefore(e, this._$AB);
  }
  T(e) {
    this._$AH !== e && (this._$AR(), this._$AH = this.O(e));
  }
  _(e) {
    this._$AH !== d && $t(this._$AH) ? this._$AA.nextSibling.data = e : this.T(at.createTextNode(e)), this._$AH = e;
  }
  $(e) {
    const { values: i, _$litType$: a } = e, s = typeof a == "number" ? this._$AC(e) : (a.el === void 0 && (a.el = qt.createElement(ta(a.h, a.h[0]), this.options)), a);
    if (this._$AH?._$AD === s) this._$AH.p(i);
    else {
      const n = new t1(s, this), r = n.u(this.options);
      n.p(i), this.T(r), this._$AH = n;
    }
  }
  _$AC(e) {
    let i = Vi.get(e.strings);
    return i === void 0 && Vi.set(e.strings, i = new qt(e)), i;
  }
  k(e) {
    ci(this._$AH) || (this._$AH = [], this._$AR());
    const i = this._$AH;
    let a, s = 0;
    for (const n of e) s === i.length ? i.push(a = new Vt(this.O(Jt()), this.O(Jt()), this, this.options)) : a = i[s], a._$AI(n), s++;
    s < i.length && (this._$AR(a && a._$AB.nextSibling, s), i.length = s);
  }
  _$AR(e = this._$AA.nextSibling, i) {
    for (this._$AP?.(!1, !0, i); e !== this._$AB; ) {
      const a = Ci(e).nextSibling;
      Ci(e).remove(), e = a;
    }
  }
  setConnected(e) {
    this._$AM === void 0 && (this._$Cv = e, this._$AP?.(e));
  }
}
class Ae {
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
    if (n === void 0) e = vt(this, e, i, 0), r = !$t(e) || e !== this._$AH && e !== st, r && (this._$AH = e);
    else {
      const c = e;
      let l, h;
      for (e = n[0], l = 0; l < n.length - 1; l++) h = vt(this, c[a + l], i, l), h === st && (h = this._$AH[l]), r ||= !$t(h) || h !== this._$AH[l], h === d ? e = d : e !== d && (e += (h ?? "") + n[l + 1]), this._$AH[l] = h;
    }
    r && !s && this.j(e);
  }
  j(e) {
    e === d ? this.element.removeAttribute(this.name) : this.element.setAttribute(this.name, e ?? "");
  }
}
class e1 extends Ae {
  constructor() {
    super(...arguments), this.type = 3;
  }
  j(e) {
    this.element[this.name] = e === d ? void 0 : e;
  }
}
class i1 extends Ae {
  constructor() {
    super(...arguments), this.type = 4;
  }
  j(e) {
    this.element.toggleAttribute(this.name, !!e && e !== d);
  }
}
class a1 extends Ae {
  constructor(e, i, a, s, n) {
    super(e, i, a, s, n), this.type = 5;
  }
  _$AI(e, i = this) {
    if ((e = vt(this, e, i, 0) ?? d) === st) return;
    const a = this._$AH, s = e === d && a !== d || e.capture !== a.capture || e.once !== a.once || e.passive !== a.passive, n = e !== d && (a === d || s);
    s && this.element.removeEventListener(this.name, this, a), n && this.element.addEventListener(this.name, this, e), this._$AH = e;
  }
  handleEvent(e) {
    typeof this._$AH == "function" ? this._$AH.call(this.options?.host ?? this.element, e) : this._$AH.handleEvent(e);
  }
}
class s1 {
  constructor(e, i, a) {
    this.element = e, this.type = 6, this._$AN = void 0, this._$AM = i, this.options = a;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  _$AI(e) {
    vt(this, e);
  }
}
const n1 = { I: Vt }, r1 = oi.litHtmlPolyfillSupport;
r1?.(qt, Vt), (oi.litHtmlVersions ??= []).push("3.3.3");
const o1 = (t, e, i) => {
  const a = i?.renderBefore ?? e;
  let s = a._$litPart$;
  if (s === void 0) {
    const n = i?.renderBefore ?? null;
    a._$litPart$ = s = new Vt(e.insertBefore(Jt(), n), n, void 0, i ?? {});
  }
  return s._$AI(t), s;
};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const li = globalThis;
let H = class extends gt {
  constructor() {
    super(...arguments), this.renderOptions = { host: this }, this._$Do = void 0;
  }
  createRenderRoot() {
    const e = super.createRenderRoot();
    return this.renderOptions.renderBefore ??= e.firstChild, e;
  }
  update(e) {
    const i = this.render();
    this.hasUpdated || (this.renderOptions.isConnected = this.isConnected), super.update(e), this._$Do = o1(i, this.renderRoot, this.renderOptions);
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
H._$litElement$ = !0, H.finalized = !0, li.litElementHydrateSupport?.({ LitElement: H });
const c1 = li.litElementPolyfillSupport;
c1?.({ LitElement: H });
(li.litElementVersions ??= []).push("4.2.2");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const l1 = { attribute: !0, type: String, converter: ce, reflect: !1, hasChanged: ri }, d1 = (t = l1, e, i) => {
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
function p(t) {
  return (e, i) => typeof i == "object" ? d1(t, e, i) : ((a, s, n) => {
    const r = s.hasOwnProperty(n);
    return s.constructor.createProperty(n, a), r ? Object.getOwnPropertyDescriptor(s, n) : void 0;
  })(t, e, i);
}
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
function x(t) {
  return p({ ...t, state: !0, attribute: !1 });
}
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const h1 = (t, e, i) => (i.configurable = !0, i.enumerable = !0, Reflect.decorate && typeof e != "object" && Object.defineProperty(t, e, i), i);
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
function Le(t, e) {
  return (i, a, s) => {
    const n = (r) => r.renderRoot?.querySelector(t) ?? null;
    return h1(i, a, { get() {
      return n(this);
    } });
  };
}
function b(t) {
  return function(e) {
    return customElements.get(t) || customElements.define(t, e), e;
  };
}
const u1 = y`
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
`, p1 = y`
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
`, m1 = {
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
      // The house is a page ASSET (not a widget): a full-bleed hero rendered
      // above the grid, with today's Grid / Solar / Home totals overlaid and
      // live flows animated over the conduit lines. Home = Grid + Solar.
      hero: {
        type: "energy",
        grid: "sensor.whole_home_energy_daily_usage",
        // daily net grid (kWh)
        solar: "sensor.goodwe_today_s_pv_generation",
        // daily solar (kWh)
        gridPower: "sensor.p1_meter_power",
        // signed W: + import / − export
        solarPower: "sensor.goodwe_pv_power",
        // W
        carConnected: "binary_sensor.tesla_wall_connector_vehicle_connected",
        // swaps to the EV art
        carPower: "sensor.tesla_wall_connector_total_power"
        // kW, auto-normalized
      },
      widgets: [
        // The three Homey-style status tiles, in their own container. (No home
        // battery in this install, so the fourth "Battery" tile is omitted.)
        {
          id: "en-tiles",
          type: "group",
          size: { compact: "4x2", medium: "4x2", wide: "4x2" },
          options: {
            variant: "tiles",
            children: [
              {
                id: "en-t-electricity",
                type: "metrictile",
                entity: "sensor.p1_meter_power",
                name: "Electricity",
                icon: "mdi:flash",
                size: { compact: "1x1", medium: "1x1", wide: "1x1" },
                options: { accent: "accent", format: "power", status: "gridDirection" }
              },
              {
                id: "en-t-solar",
                type: "metrictile",
                entity: "sensor.goodwe_pv_power",
                name: "Solar",
                icon: "mdi:weather-sunny",
                size: { compact: "1x1", medium: "1x1", wide: "1x1" },
                options: { accent: "light", format: "power", status: "none" }
              },
              {
                id: "en-t-ev",
                type: "metrictile",
                entity: "sensor.other_tesla_model_3_battery_level",
                name: "Electric Vehicle",
                icon: "mdi:car-electric",
                size: { compact: "1x1", medium: "1x1", wide: "1x1" },
                options: {
                  accent: "alert",
                  format: "percent",
                  status: "carCharge",
                  chargeStatus: "sensor.tesla_wall_connector_status",
                  connected: "binary_sensor.tesla_wall_connector_vehicle_connected"
                }
              }
            ]
          }
        },
        // Today's Imported − Exported = Total, from the Statistics API.
        {
          id: "en-total",
          type: "electricitytotal",
          name: "Electricity Total",
          size: { compact: "4x2", medium: "4x2", wide: "4x2" },
          options: {
            importEnergy: "sensor.p1_meter_energy_import",
            exportEnergy: "sensor.p1_meter_energy_export"
          }
        }
      ]
    }
  ]
}, je = ["1x1", "2x1", "1x2", "2x2", "3x3", "4x2"], g1 = ["compact", "medium", "wide"], f1 = [
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
  "metrictile",
  "electricitytotal",
  "alarm",
  "action"
], v1 = ["media", "devices", "sensors", "energy", "tiles"], ki = {
  // A container is full-width and self-sizing; the grid ignores its footprint,
  // so every size is permitted (synthetic groups carry a nominal one).
  group: je,
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
  // Homey-style wide status tile (icon + name + "value • status"); one per grid cell.
  metrictile: ["1x1", "2x1"],
  // Full-width "Imported − Exported = Total" breakdown band.
  electricitytotal: ["2x2", "4x2"],
  alarm: ["1x1", "2x1", "2x2"],
  action: ["1x1", "2x1"]
}, b1 = [
  "group",
  "energy",
  "powerflow",
  "solarcharging",
  "energychart",
  "electricitytotal",
  "action"
], y1 = /^[a-z_]+\.[a-z0-9_]+$/;
function w1(t) {
  return typeof t == "string" && y1.test(t);
}
function C1(t) {
  return !!t && /replace_me/i.test(t);
}
function x1(t) {
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
    const m = [];
    for (let f = 0; f < (h.widgets ?? []).length; f++) {
      const g = h.widgets[f], v = `${u}.widgets[${f}]`;
      ea(g, v, n, i) && m.push(g);
    }
    r.push({ ...h, widgets: m });
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
function ea(t, e, i, a) {
  if (!t || typeof t != "object")
    return a(e, "Widget must be an object."), !1;
  if (!t.id)
    return a(e, "Widget is missing an `id`."), !1;
  if (i.has(t.id))
    return a(`${e}.id`, `Duplicate widget id "${t.id}".`), !1;
  if (i.add(t.id), !f1.includes(t.type))
    return a(`${e}.type`, `Unknown widget type "${t.type}".`), !1;
  const s = t.type;
  if (!b1.includes(s) && !t.entity ? a(`${e}.entity`, `Widget "${t.id}" (${s}) requires an \`entity\`.`) : t.entity && !w1(t.entity) && a(
    `${e}.entity`,
    `"${t.entity}" is not a valid entity_id (expected e.g. light.living_room).`
  ), !t.size || typeof t.size != "object")
    a(`${e}.size`, `Widget "${t.id}" is missing a size set.`);
  else
    for (const r of g1) {
      const c = t.size[r];
      if (!c) {
        a(`${e}.size.${r}`, `Missing "${r}" size for widget "${t.id}".`);
        continue;
      }
      if (!je.includes(c)) {
        a(`${e}.size.${r}`, `Invalid size "${c}" (allowed: ${je.join(", ")}).`);
        continue;
      }
      ki[s].includes(c) || a(
        `${e}.size.${r}`,
        `Widget type "${s}" does not support size "${c}" at ${r}. Supported: ${ki[s].join(", ")}.`
      );
    }
  if (s === "group") {
    const r = t.options?.children;
    !Array.isArray(r) || r.length === 0 ? a(`${e}.options.children`, `Group "${t.id}" must have a non-empty \`children\` array.`) : r.forEach(
      (c, l) => ea(c, `${e}.options.children[${l}]`, i, a)
    );
  }
  return !0;
}
function A1(t, e, i = window.location) {
  return t && typeof t.path == "string" ? H1(t.path) : L1(i.pathname, e);
}
function L1(t, e) {
  const i = t.replace(/^\/+/, "").split("/").filter(Boolean);
  return i[0] === e ? i[1] ?? "" : i.length > 1 ? i[1] : "";
}
function H1(t) {
  return t.replace(/^\/+/, "").split("/").filter(Boolean)[0] ?? "";
}
function M1(t, e, i) {
  return !e || e === i ? `/${t}` : `/${t}/${e}`;
}
function V1(t) {
  window.location.pathname !== t && (history.pushState(null, "", t), window.dispatchEvent(new CustomEvent("location-changed", { detail: { replace: !1 } })));
}
const k1 = {
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
var S1 = Object.defineProperty, E1 = Object.getOwnPropertyDescriptor, di = (t, e, i, a) => {
  for (var s = a > 1 ? void 0 : a ? E1(e, i) : e, n = t.length - 1, r; n >= 0; n--)
    (r = t[n]) && (s = (a ? r(e, i, s) : r(s)) || s);
  return a && s && S1(e, i, s), s;
};
let Wt = class extends H {
  constructor() {
    super(...arguments), this.icon = "", this.size = 24;
  }
  render() {
    const t = k1[this.icon], e = `--hd-icon-size:${this.size}px`;
    if (t)
      return o`<svg viewBox="0 0 24 24" style=${e} aria-hidden="true">
        ${jt`<path d=${t}></path>`}
      </svg>`;
    if (typeof customElements < "u" && customElements.get("ha-icon") && this.icon) {
      const i = document.createElement("ha-icon");
      return i.setAttribute("icon", this.icon), i.style.setProperty("--mdc-icon-size", `${this.size}px`), i.style.width = `${this.size}px`, i.style.height = `${this.size}px`, o`${i}`;
    }
    return this.icon ? o`<span class="dot" style=${e}></span>` : d;
  }
};
Wt.styles = y`
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
di([
  p({ type: String })
], Wt.prototype, "icon", 2);
di([
  p({ type: Number })
], Wt.prototype, "size", 2);
Wt = di([
  b("hd-icon")
], Wt);
var I1 = Object.defineProperty, P1 = Object.getOwnPropertyDescriptor, lt = (t, e, i, a) => {
  for (var s = a > 1 ? void 0 : a ? P1(e, i) : e, n = t.length - 1, r; n >= 0; n--)
    (r = t[n]) && (s = (a ? r(e, i, s) : r(s)) || s);
  return a && s && I1(e, i, s), s;
};
let J = class extends H {
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
J.styles = y`
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
  p({ type: String })
], J.prototype, "icon", 2);
lt([
  p({ type: String })
], J.prototype, "label", 2);
lt([
  p({ type: Boolean, reflect: !0 })
], J.prototype, "disabled", 2);
lt([
  p({ type: Boolean, reflect: !0 })
], J.prototype, "loading", 2);
lt([
  p({ type: String })
], J.prototype, "variant", 2);
lt([
  p({ type: Number })
], J.prototype, "size", 2);
J = lt([
  b("hd-icon-button")
], J);
var T1 = Object.defineProperty, D1 = Object.getOwnPropertyDescriptor, U = (t, e, i, a) => {
  for (var s = a > 1 ? void 0 : a ? D1(e, i) : e, n = t.length - 1, r; n >= 0; n--)
    (r = t[n]) && (s = (a ? r(e, i, s) : r(s)) || s);
  return a && s && T1(e, i, s), s;
};
let Z = class extends H {
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
Z.styles = y`
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
U([
  p({ type: Boolean, reflect: !0 })
], Z.prototype, "open", 2);
U([
  p({ type: String })
], Z.prototype, "variant", 2);
U([
  p({ type: String })
], Z.prototype, "heading", 2);
U([
  p({ type: String })
], Z.prototype, "subheading", 2);
U([
  p({ type: Boolean })
], Z.prototype, "headless", 2);
U([
  x()
], Z.prototype, "_resolved", 2);
U([
  x()
], Z.prototype, "_dragY", 2);
U([
  x()
], Z.prototype, "_closing", 2);
U([
  Le(".container")
], Z.prototype, "_container", 2);
Z = U([
  b("hd-surface")
], Z);
var O1 = Object.defineProperty, z1 = Object.getOwnPropertyDescriptor, j = (t, e, i, a) => {
  for (var s = a > 1 ? void 0 : a ? z1(e, i) : e, n = t.length - 1, r; n >= 0; n--)
    (r = t[n]) && (s = (a ? r(e, i, s) : r(s)) || s);
  return a && s && O1(e, i, s), s;
};
let F = class extends H {
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
F.styles = y`
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
j([
  p({ attribute: !1 })
], F.prototype, "views", 2);
j([
  p({ type: String })
], F.prototype, "currentViewId", 2);
j([
  p({ type: String })
], F.prototype, "productTitle", 2);
j([
  p({ type: String })
], F.prototype, "subtitle", 2);
j([
  p({ type: Boolean })
], F.prototype, "connected", 2);
j([
  p({ type: String })
], F.prototype, "appearance", 2);
j([
  x()
], F.prototype, "_mode", 2);
j([
  x()
], F.prototype, "_switcherOpen", 2);
F = j([
  b("hd-app-shell")
], F);
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const R1 = { CHILD: 2 }, B1 = (t) => (...e) => ({ _$litDirective$: t, values: e });
let Z1 = class {
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
const { I: Q1 } = n1, Si = (t) => t, Ei = () => document.createComment(""), It = (t, e, i) => {
  const a = t._$AA.parentNode, s = e === void 0 ? t._$AB : e._$AA;
  if (i === void 0) {
    const n = a.insertBefore(Ei(), s), r = a.insertBefore(Ei(), s);
    i = new Q1(n, r, t, t.options);
  } else {
    const n = i._$AB.nextSibling, r = i._$AM, c = r !== t;
    if (c) {
      let l;
      i._$AQ?.(t), i._$AM = t, i._$AP !== void 0 && (l = t._$AU) !== r._$AU && i._$AP(l);
    }
    if (n !== s || c) {
      let l = i._$AA;
      for (; l !== n; ) {
        const h = Si(l).nextSibling;
        Si(a).insertBefore(l, s), l = h;
      }
    }
  }
  return i;
}, Y = (t, e, i = t) => (t._$AI(e, i), t), _1 = {}, F1 = (t, e = _1) => t._$AH = e, U1 = (t) => t._$AH, Ze = (t) => {
  t._$AR(), t._$AA.remove();
};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const Ii = (t, e, i) => {
  const a = /* @__PURE__ */ new Map();
  for (let s = e; s <= i; s++) a.set(t[s], s);
  return a;
}, ia = B1(class extends Z1 {
  constructor(t) {
    if (super(t), t.type !== R1.CHILD) throw Error("repeat() can only be used in text expressions");
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
    const s = U1(t), { values: n, keys: r } = this.dt(e, i, a);
    if (!Array.isArray(s)) return this.ut = r, n;
    const c = this.ut ??= [], l = [];
    let h, u, m = 0, f = s.length - 1, g = 0, v = n.length - 1;
    for (; m <= f && g <= v; ) if (s[m] === null) m++;
    else if (s[f] === null) f--;
    else if (c[m] === r[g]) l[g] = Y(s[m], n[g]), m++, g++;
    else if (c[f] === r[v]) l[v] = Y(s[f], n[v]), f--, v--;
    else if (c[m] === r[v]) l[v] = Y(s[m], n[v]), It(t, l[v + 1], s[m]), m++, v--;
    else if (c[f] === r[g]) l[g] = Y(s[f], n[g]), It(t, s[m], s[f]), f--, g++;
    else if (h === void 0 && (h = Ii(r, g, v), u = Ii(c, m, f)), h.has(c[m])) if (h.has(c[f])) {
      const w = u.get(r[g]), S = w !== void 0 ? s[w] : null;
      if (S === null) {
        const D = It(t, s[m]);
        Y(D, n[g]), l[g] = D;
      } else l[g] = Y(S, n[g]), It(t, s[m], S), s[w] = null;
      g++;
    } else Ze(s[f]), f--;
    else Ze(s[m]), m++;
    for (; g <= v; ) {
      const w = It(t, l[v + 1]);
      Y(w, n[g]), l[g++] = w;
    }
    for (; m <= f; ) {
      const w = s[m++];
      w !== null && Ze(w);
    }
    return this.ut = r, F1(t, l), st;
  }
});
function aa(t) {
  const e = t || 1024;
  return e < 600 ? { columns: 2, gap: 10, pad: 12, bucket: "compact" } : e < 900 ? { columns: 4, gap: 14, pad: 20, bucket: "medium" } : e < 1200 ? { columns: 6, gap: 16, pad: 24, bucket: "wide" } : e < 1600 ? { columns: 8, gap: 16, pad: 28, bucket: "wide" } : { columns: 10, gap: 16, pad: 32, bucket: "wide" };
}
function hi(t, e) {
  return t.size?.[e] ?? t.size?.medium ?? "1x1";
}
function J1(t, e) {
  const i = t.options ?? {};
  if (!(i.hero === !0 || typeof i.brand == "string")) return null;
  const s = hi(t, e);
  return s === "1x1" ? null : s;
}
function sa(t, e) {
  const [i, a] = t.split("x").map((s) => parseInt(s, 10));
  return { colSpan: Math.min(Math.max(1, i || 1), e), rowSpan: Math.max(1, a || 1) };
}
function $1(t, e) {
  const i = t - e.pad * 2 - e.gap * (e.columns - 1);
  return Math.max(96, Math.floor(i / e.columns));
}
const j1 = v1, q1 = {
  media: "Media",
  devices: "Devices",
  sensors: "Sensors",
  energy: "Energy",
  // Hand-composed only (never auto-collected); heading comes from GroupOptions.
  tiles: ""
};
function na(t) {
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
function W1(t) {
  return t === "devices" ? "tile" : t === "sensors" ? "value" : "row";
}
function K1(t, e) {
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
    case "tiles":
      return i < 640 ? 2 : 3;
  }
}
const N1 = { compact: "4x2", medium: "4x2", wide: "4x2" };
function X1(t, e) {
  const i = { label: q1[t], variant: t, children: e };
  return {
    id: `__section_${t}`,
    type: "group",
    size: N1,
    options: i
  };
}
function Y1(t) {
  const e = t ?? [];
  if (e.some((s) => s.type === "group")) return e;
  const i = /* @__PURE__ */ new Map();
  for (const s of e) {
    const n = na(s.type), r = i.get(n) ?? [];
    r.push(s), i.set(n, r);
  }
  const a = [];
  for (const s of j1) {
    const n = i.get(s);
    n && n.length && a.push(X1(s, n));
  }
  return a;
}
/**
 * @license
 * Copyright 2020 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const ra = Symbol.for(""), G1 = (t) => {
  if (t?.r === ra) return t?._$litStatic$;
}, ts = (t) => ({ _$litStatic$: t, r: ra }), Pi = /* @__PURE__ */ new Map(), es = (t) => (e, ...i) => {
  const a = i.length;
  let s, n;
  const r = [], c = [];
  let l, h = 0, u = !1;
  for (; h < a; ) {
    for (l = e[h]; h < a && (n = i[h], (s = G1(n)) !== void 0); ) l += s + e[++h], u = !0;
    h !== a && c.push(n), r.push(l), h++;
  }
  if (h === a && r.push(e[a]), u) {
    const m = r.join("$$lit$$");
    (e = Pi.get(m)) === void 0 && (r.raw = r, Pi.set(m, e = r)), i = c;
  }
  return t(e, ...i);
}, is = es(o);
var as = Object.defineProperty, ss = Object.getOwnPropertyDescriptor, kt = (t, e, i, a) => {
  for (var s = a > 1 ? void 0 : a ? ss(e, i) : e, n = t.length - 1, r; n >= 0; n--)
    (r = t[n]) && (s = (a ? r(e, i, s) : r(s)) || s);
  return a && s && as(e, i, s), s;
};
let W = class extends H {
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
    return this._opts.variant ?? na(this._children[0]?.type ?? "sensor");
  }
  render() {
    const t = this._children;
    if (!t.length) return d;
    const e = this._variant, i = K1(e, this._width), a = 12, s = aa(this._width).bucket, n = W1(e), r = this._opts.label, c = n !== "row", l = e === "sensors" ? 84 : e === "media" ? 116 : e === "tiles" ? 100 : $1(this._width || 1024, { columns: i, gap: a, pad: 0 }), h = `--cols:${i}; --gap:${a}px; --unit:${l}px`;
    return o`
      <section class="section">
        ${r ? o`<h2 class="head">${r}</h2>` : d}
        <div class="grid" style=${h}>
          ${ia(
      t,
      (u) => u.id,
      (u) => {
        const m = c ? J1(u, s) : null;
        return Za(
          u,
          m ?? (c ? "1x1" : hi(u, s)),
          i,
          this.hass,
          m ? "row" : n
        );
      }
    )}
        </div>
      </section>
    `;
  }
};
W.styles = y`
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
kt([
  p({ attribute: !1 })
], W.prototype, "hass", 2);
kt([
  p({ attribute: !1 })
], W.prototype, "config", 2);
kt([
  p({ type: String })
], W.prototype, "currentSize", 2);
kt([
  p({ type: String })
], W.prototype, "layout", 2);
kt([
  x()
], W.prototype, "_width", 2);
W = kt([
  b("hd-group")
], W);
function C(t, e) {
  return t ? ((t.attributes.supported_features ?? 0) & e) === e : !1;
}
function St(t) {
  return t.split(".")[0];
}
function He(t) {
  return !t || t.state === "unavailable";
}
function Me(t) {
  return !!t && t.state === "unknown";
}
const ns = { EFFECT: 4 }, rs = /* @__PURE__ */ new Set([
  "brightness",
  "color_temp",
  "hs",
  "xy",
  "rgb",
  "rgbw",
  "rgbww",
  "white"
]), os = /* @__PURE__ */ new Set(["hs", "xy", "rgb", "rgbw", "rgbww"]);
function oa(t) {
  const e = t?.attributes.supported_color_modes ?? [];
  return {
    brightness: e.some((i) => rs.has(i)),
    colorTemp: e.includes("color_temp"),
    color: e.some((i) => os.has(i)),
    effects: C(t, ns.EFFECT)
  };
}
const G = {
  OPEN: 1,
  CLOSE: 2,
  SET_POSITION: 4,
  STOP: 8,
  OPEN_TILT: 16,
  CLOSE_TILT: 32,
  SET_TILT_POSITION: 128
};
function ca(t) {
  return {
    open: C(t, G.OPEN),
    close: C(t, G.CLOSE),
    stop: C(t, G.STOP),
    setPosition: C(t, G.SET_POSITION),
    tilt: C(t, G.OPEN_TILT) || C(t, G.CLOSE_TILT),
    setTilt: C(t, G.SET_TILT_POSITION)
  };
}
const pt = {
  TARGET_TEMPERATURE: 1,
  TARGET_TEMPERATURE_RANGE: 2,
  TARGET_HUMIDITY: 4,
  FAN_MODE: 8,
  PRESET_MODE: 16,
  SWING_MODE: 32
};
function la(t) {
  return {
    targetTemp: C(t, pt.TARGET_TEMPERATURE),
    targetTempRange: C(t, pt.TARGET_TEMPERATURE_RANGE),
    fanMode: C(t, pt.FAN_MODE),
    presetMode: C(t, pt.PRESET_MODE),
    swingMode: C(t, pt.SWING_MODE),
    humidity: C(t, pt.TARGET_HUMIDITY)
  };
}
const B = {
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
function da(t) {
  return {
    play: C(t, B.PLAY),
    pause: C(t, B.PAUSE),
    stop: C(t, B.STOP),
    next: C(t, B.NEXT_TRACK),
    previous: C(t, B.PREVIOUS_TRACK),
    volumeSet: C(t, B.VOLUME_SET),
    volumeStep: C(t, B.VOLUME_STEP),
    mute: C(t, B.VOLUME_MUTE),
    selectSource: C(t, B.SELECT_SOURCE),
    selectSoundMode: C(t, B.SELECT_SOUND_MODE),
    power: C(t, B.TURN_ON) || C(t, B.TURN_OFF)
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
function ha(t) {
  return {
    start: C(t, tt.START),
    pause: C(t, tt.PAUSE),
    stop: C(t, tt.STOP),
    returnHome: C(t, tt.RETURN_HOME),
    fanSpeed: C(t, tt.FAN_SPEED),
    battery: C(t, tt.BATTERY),
    locate: C(t, tt.LOCATE)
  };
}
const ie = { SET_SPEED: 1, OSCILLATE: 2, DIRECTION: 4, PRESET_MODE: 8 };
function cs(t) {
  return {
    speed: C(t, ie.SET_SPEED),
    oscillate: C(t, ie.OSCILLATE),
    direction: C(t, ie.DIRECTION),
    presetMode: C(t, ie.PRESET_MODE)
  };
}
function ua(t, e) {
  const i = { ...e.data ?? {} }, a = e.target ?? {};
  return t.callService(e.domain, e.service, i, a);
}
const L = (t, e = {}) => ({
  entity_id: t,
  ...e
});
function K(t) {
  const e = St(t);
  return { domain: (/* @__PURE__ */ new Set(["light", "switch", "fan", "input_boolean", "media_player", "cover", "climate"])).has(e) ? e : "homeassistant", service: "toggle", data: L(t) };
}
function pa(t, e = {}) {
  const i = St(t);
  return { domain: ["light", "switch", "fan", "media_player", "input_boolean", "climate", "humidifier"].includes(i) ? i : "homeassistant", service: "turn_on", data: L(t, e) };
}
function ma(t) {
  const e = St(t);
  return { domain: ["light", "switch", "fan", "media_player", "input_boolean", "climate", "humidifier"].includes(e) ? e : "homeassistant", service: "turn_off", data: L(t) };
}
function ft(t, e = {}) {
  const i = {};
  return e.brightnessPct != null && (i.brightness_pct = it(Math.round(e.brightnessPct), 0, 100)), e.colorTempKelvin != null && (i.color_temp_kelvin = Math.round(e.colorTempKelvin)), e.rgbColor && (i.rgb_color = e.rgbColor), e.hsColor && (i.hs_color = [it(e.hsColor[0], 0, 360), it(e.hsColor[1], 0, 100)]), e.effect && (i.effect = e.effect), e.transition != null && (i.transition = e.transition), { domain: "light", service: "turn_on", data: L(t, i) };
}
function qe(t, e) {
  const i = it(Math.round(e), 0, 100);
  return i <= 0 ? ma(t) : ft(t, { brightnessPct: i });
}
function ga(t, e) {
  return { domain: "climate", service: "set_temperature", data: L(t, { temperature: e }) };
}
function fa(t, e) {
  return { domain: "climate", service: "set_hvac_mode", data: L(t, { hvac_mode: e }) };
}
function ls(t, e) {
  return { domain: "climate", service: "set_fan_mode", data: L(t, { fan_mode: e }) };
}
function ds(t, e) {
  return { domain: "climate", service: "set_preset_mode", data: L(t, { preset_mode: e }) };
}
function hs(t, e) {
  return { domain: "climate", service: "set_swing_mode", data: L(t, { swing_mode: e }) };
}
function va(t) {
  return { domain: "cover", service: "open_cover", data: L(t) };
}
function ba(t) {
  return { domain: "cover", service: "close_cover", data: L(t) };
}
function ya(t) {
  return { domain: "cover", service: "stop_cover", data: L(t) };
}
function wa(t, e) {
  return {
    domain: "cover",
    service: "set_cover_position",
    data: L(t, { position: it(Math.round(e), 0, 100) })
  };
}
function Ca(t) {
  return { domain: "media_player", service: "media_play_pause", data: L(t) };
}
function xa(t) {
  return { domain: "media_player", service: "media_next_track", data: L(t) };
}
function Aa(t) {
  return { domain: "media_player", service: "media_previous_track", data: L(t) };
}
function us(t, e) {
  return {
    domain: "media_player",
    service: "volume_set",
    data: L(t, { volume_level: it(e, 0, 1) })
  };
}
function ps(t, e) {
  return { domain: "media_player", service: "volume_mute", data: L(t, { is_volume_muted: e }) };
}
function ms(t, e) {
  return { domain: "media_player", service: "select_source", data: L(t, { source: e }) };
}
function gs(t, e) {
  return { domain: "media_player", service: "select_sound_mode", data: L(t, { sound_mode: e }) };
}
function de(t) {
  return { domain: "vacuum", service: "start", data: L(t) };
}
function We(t) {
  return { domain: "vacuum", service: "pause", data: L(t) };
}
function he(t) {
  return { domain: "vacuum", service: "return_to_base", data: L(t) };
}
function La(t, e) {
  return { domain: "vacuum", service: "set_fan_speed", data: L(t, { fan_speed: e }) };
}
function Ha(t) {
  return { domain: "vacuum", service: "locate", data: L(t) };
}
function Ma(t) {
  return { domain: "lock", service: "lock", data: L(t) };
}
function Va(t) {
  return { domain: "lock", service: "unlock", data: L(t) };
}
function fs(t) {
  return { domain: "scene", service: "turn_on", data: L(t) };
}
function vs(t) {
  return { domain: "script", service: "turn_on", data: L(t) };
}
function bs(t) {
  return { domain: "button", service: "press", data: L(t) };
}
function ys(t, e) {
  return { domain: St(t) === "number" ? "number" : "input_number", service: "set_value", data: L(t, { value: e }) };
}
function ws(t, e) {
  return {
    domain: "fan",
    service: "set_percentage",
    data: L(t, { percentage: it(Math.round(e), 0, 100) })
  };
}
function it(t, e, i) {
  return Math.min(i, Math.max(e, t));
}
function Cs(t, e) {
  return t?.attributes.friendly_name?.trim() || e;
}
function dt(t, e) {
  if (!e) return "—";
  if (He(e)) return "Unavailable";
  if (Me(e)) return "Unknown";
  if (t?.formatEntityState)
    try {
      return t.formatEntityState(e);
    } catch {
    }
  return As(e);
}
function xs(t, e, i) {
  if (!e) return "—";
  if (t?.formatEntityAttributeValue)
    try {
      return t.formatEntityAttributeValue(e, i);
    } catch {
    }
  const a = e.attributes[i];
  return a == null ? "—" : String(a);
}
function As(t) {
  const e = t.attributes.unit_of_measurement, i = Number(t.state);
  return !Number.isNaN(i) && t.state.trim() !== "" ? e ? `${A(i)} ${e}` : A(i) : k(t.state);
}
function A(t, e = 1) {
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
function k(t) {
  return t.replace(/[_-]+/g, " ").replace(/\b\w/g, (e) => e.toUpperCase()).trim();
}
function Ve(t) {
  if (!t) return "";
  const e = new Date(t).getTime();
  if (Number.isNaN(e)) return "";
  const i = Math.round((Date.now() - e) / 1e3), a = Math.abs(i), s = Ls(), n = () => a < 60 ? [-i, "second"] : a < 3600 ? [-Math.round(i / 60), "minute"] : a < 86400 ? [-Math.round(i / 3600), "hour"] : [-Math.round(i / 86400), "day"], [r, c] = n();
  return a < 45 ? "just now" : s ? s.format(r, c) : `${Math.abs(r)} ${c}${Math.abs(r) === 1 ? "" : "s"} ${r < 0 ? "ago" : "from now"}`;
}
let Pt;
function Ls() {
  if (Pt !== void 0) return Pt;
  try {
    Pt = new Intl.RelativeTimeFormat(void 0, { numeric: "auto" });
  } catch {
    Pt = null;
  }
  return Pt;
}
function Ti(t) {
  if (!Number.isFinite(t) || t < 0) return "0:00";
  const e = Math.floor(t % 60), i = Math.floor(t / 60 % 60), a = Math.floor(t / 3600), s = a > 0 ? String(i).padStart(2, "0") : String(i), n = String(e).padStart(2, "0");
  return a > 0 ? `${a}:${s}:${n}` : `${s}:${n}`;
}
const Hs = [
  ["main_brush_time_left", "Main brush"],
  ["side_brush_time_left", "Side brush"],
  ["filter_time_left", "Filter"],
  ["sensor_time_left", "Sensors"],
  ["dock_maintenance_brush_time_left", "Dock brush"],
  ["dock_strainer_time_left", "Dock strainer"]
], Ms = 20;
function Tt(t, e, i) {
  const a = t?.states[e];
  if (!a || (i.push(e), He(a) || Me(a))) return;
  const s = Number(a.state);
  return Number.isFinite(s) ? s : void 0;
}
function Di(t, e, i) {
  const a = t?.states[e];
  if (a && (i.push(e), !(He(a) || Me(a))))
    return a.state || void 0;
}
function Ut(t, e) {
  const i = [], a = { consumables: [], ids: i };
  if (!t || !e) return a;
  const s = e.split(".")[1];
  if (!s) return a;
  const n = `sensor.${s}_`, r = [];
  for (const [c, l] of Hs) {
    const h = Tt(t, n + c, i);
    h != null && r.push({ key: c, label: l, hoursLeft: h });
  }
  return {
    battery: Tt(t, n + "battery", i),
    status: Di(t, n + "status", i),
    room: Di(t, n + "current_room", i),
    progress: Tt(t, n + "cleaning_progress", i),
    area: Tt(t, n + "cleaning_area", i),
    cleaningTime: Tt(t, n + "cleaning_time", i),
    consumables: r,
    ids: i
  };
}
const Oi = {
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
}, Vs = {
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
function oe(t, e) {
  const i = e?.attributes.device_class;
  return i && Oi[t]?.[i] ? Oi[t][i] : Vs[t] ?? "mdi:help-circle-outline";
}
function Ke(t) {
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
function ks(t, e) {
  const i = Math.round(t / 10) * 10;
  return e ? i >= 100 ? "mdi:battery-charging-100" : i <= 10 ? "mdi:battery-charging-10" : `mdi:battery-charging-${i}` : i >= 100 ? "mdi:battery" : i <= 5 ? "mdi:battery-alert-variant-outline" : `mdi:battery-${i}`;
}
const Ss = /* @__PURE__ */ new Set(["on", "open", "playing", "home", "cleaning", "heat", "cool", "auto", "active"]);
function ka(t, e, i) {
  const a = i?.name ?? "Unknown";
  if (!e)
    return zi("", a, "mdi:help-circle-outline", "Not configured");
  const s = St(e), n = C1(e), r = t?.states[e];
  if (n)
    return zi(e, i?.name ?? "Configure me", i?.icon ?? oe(s, void 0), "Replace placeholder id");
  if (!r)
    return {
      entityId: e,
      domain: s,
      exists: !1,
      available: !1,
      unknown: !1,
      isPlaceholder: !1,
      name: i?.name ?? k(e.split(".")[1] ?? e),
      icon: i?.icon ?? oe(s, void 0),
      rawState: "missing",
      displayState: "Not found",
      secondary: "Entity unavailable",
      active: !1,
      accent: "unavailable",
      quickAction: { kind: "none", label: "Unavailable" }
    };
  const c = i?.name ?? Cs(r, k(e.split(".")[1] ?? e)), l = He(r), h = Me(r), u = {
    entityId: e,
    domain: s,
    stateObj: r,
    exists: !0,
    available: !l,
    unknown: h,
    isPlaceholder: !1,
    name: c,
    icon: i?.icon ?? r.attributes.icon ?? oe(s, r),
    rawState: r.state,
    displayState: dt(t, r),
    active: !1,
    accent: l ? "unavailable" : "idle",
    quickAction: { kind: "none", label: c }
  };
  return l ? (u.secondary = "Unavailable", u) : Es(u, r, i, t);
}
function Es(t, e, i, a) {
  const s = Ss.has(e.state);
  switch (t.domain) {
    case "light":
      return Is(t, e, i);
    case "switch":
    case "input_boolean":
      return t.active = e.state === "on", t.accent = t.active ? "accent" : "idle", t.icon = i?.icon ?? e.attributes.icon ?? oe(t.domain, e), t.quickAction = { kind: "toggle", label: t.active ? "Turn off" : "Turn on", call: K(t.entityId) }, t;
    case "fan":
      return t.active = e.state === "on", t.accent = t.active ? "accent" : "idle", typeof e.attributes.percentage == "number" && (t.level = e.attributes.percentage), t.secondary = t.active && t.level != null ? `${Math.round(t.level)}%` : void 0, t.quickAction = { kind: "toggle", label: t.active ? "Turn off" : "Turn on", call: K(t.entityId) }, t;
    case "climate":
      return Ps(t, e);
    case "cover":
      return Ts(t, e);
    case "media_player":
      return Ds(t, e);
    case "lock":
      return Os(t, e, i);
    case "vacuum":
      return zs(t, e, a);
    case "binary_sensor":
      return Bs(t, e);
    case "person":
    case "device_tracker":
      return Zs(t, e);
    case "sensor":
      return Qs(t, e);
    case "weather":
      return t.icon = Ke(e.state), t.accent = "accent", t.secondary = e.attributes.temperature != null ? `${A(e.attributes.temperature)}°` : void 0, t;
    case "scene":
      return t.accent = "accent", t.displayState = "Scene", t.quickAction = { kind: "activate", label: "Activate", call: fs(t.entityId) }, t;
    case "script":
      return t.active = e.state === "on", t.accent = t.active ? "accent" : "idle", t.displayState = t.active ? "Running" : "Run", t.quickAction = {
        kind: "activate",
        label: "Run",
        call: vs(t.entityId),
        requiresConfirmation: i?.requiresConfirmation
      }, t;
    case "button":
      return t.accent = "accent", t.displayState = "Press", t.quickAction = {
        kind: "activate",
        label: "Press",
        call: bs(t.entityId),
        requiresConfirmation: i?.requiresConfirmation
      }, t;
    default:
      return t.active = s, t.accent = s ? "accent" : "idle", t;
  }
}
function Is(t, e, i) {
  const a = e.state === "on";
  t.active = a, t.accent = a ? "light" : "idle", t.icon = i?.icon ?? e.attributes.icon ?? "mdi:lightbulb";
  const s = e.attributes.brightness;
  a && typeof s == "number" ? (t.level = Math.round(s / 255 * 100), t.secondary = `${t.level}%`) : t.secondary = a ? "On" : "Off";
  const n = e.attributes.rgb_color, r = e.attributes.color_mode;
  return a && n && r && ["hs", "xy", "rgb", "rgbw", "rgbww"].includes(r) && (t.rgbCss = `rgb(${n[0]}, ${n[1]}, ${n[2]})`), t.quickAction = { kind: "toggle", label: a ? "Turn off" : "Turn on", call: K(t.entityId) }, t;
}
function Ps(t, e) {
  const i = e.state;
  t.active = i !== "off";
  const a = ["heat", "heat_cool"].includes(i), s = i === "cool";
  t.accent = i === "off" ? "idle" : a ? "heat" : s ? "cool" : "accent";
  const n = e.attributes.current_temperature, r = e.attributes.temperature;
  t.displayState = k(i);
  const c = [];
  return n != null && c.push(`${A(n)}°`), r != null && i !== "off" && c.push(`→ ${A(r)}°`), t.secondary = c.join("  "), typeof r == "number" && (t.level = r), t.quickAction = { kind: "none", label: t.name }, t;
}
function Ts(t, e) {
  const i = e.attributes.current_position, a = e.state === "open" || typeof i == "number" && i > 0;
  return t.active = a, t.accent = a ? "accent" : "idle", typeof i == "number" ? (t.level = i, t.secondary = `${i}% open`) : t.secondary = k(e.state), t.quickAction = { kind: "none", label: t.name }, t;
}
function Ds(t, e) {
  const i = e.state, a = i === "playing";
  t.active = ["playing", "paused", "on", "buffering"].includes(i), t.accent = a || t.active ? "accent" : "idle", t.icon = t.active ? "mdi:cast-connected" : "mdi:cast";
  const s = e.attributes.media_title, n = e.attributes.app_name, r = e.attributes.source;
  return t.displayState = a ? "Playing" : k(i), t.secondary = s ?? n ?? r ?? void 0, t.quickAction = { kind: "none", label: t.name }, t;
}
function Os(t, e, i) {
  const a = e.state === "locked";
  return t.active = !a, t.accent = a ? "eco" : "warn", t.icon = a ? "mdi:lock" : "mdi:lock-open-variant", t.displayState = k(e.state), t.quickAction = {
    kind: "toggle",
    label: a ? "Unlock" : "Lock",
    call: a ? Va(t.entityId) : Ma(t.entityId),
    // Unlocking is sensitive; honor explicit config too.
    requiresConfirmation: a || i?.requiresConfirmation
  }, t;
}
function zs(t, e, i) {
  const a = e.state, s = a === "cleaning", n = a === "error", r = Ut(i, t.entityId);
  t.active = s, t.accent = n ? "alert" : s ? "accent" : "idle";
  const c = k((r.status ?? a).replace(/_/g, " "));
  t.displayState = s && r.room ? `Cleaning ${r.room}` : c, typeof r.progress == "number" && s && (t.level = r.progress);
  const l = r.battery ?? e.attributes.battery_level;
  if (s && typeof r.progress == "number") {
    const h = typeof r.area == "number" && r.area > 0 ? ` · ${A(r.area)} m²` : "";
    t.secondary = `${Math.round(r.progress)}%${h}`;
  } else
    t.secondary = l != null ? `${Math.round(l)}% battery` : void 0;
  return t.quickAction = a === "docked" || a === "idle" ? { kind: "toggle", label: "Start", call: de(t.entityId) } : { kind: "toggle", label: "Return to dock", call: he(t.entityId) }, t;
}
const Rs = /* @__PURE__ */ new Set(["smoke", "gas", "moisture", "problem", "safety", "carbon_monoxide", "tamper"]);
function Bs(t, e) {
  const i = e.state === "on";
  t.active = i;
  const a = e.attributes.device_class;
  return i && a && Rs.has(a) ? t.accent = "alert" : i ? t.accent = "accent" : t.accent = "idle", t.secondary = Ve(e.last_changed), t;
}
function Zs(t, e) {
  const i = e.state === "home";
  return t.active = i, t.accent = i ? "eco" : "idle", t.icon = i ? "mdi:home-account" : "mdi:home-export-outline", t.displayState = i ? "Home" : k(e.state), t.secondary = Ve(e.last_changed), t;
}
function Qs(t, e) {
  const i = e.attributes.device_class, a = Number(e.state);
  if (t.accent = "idle", i === "battery" && !Number.isNaN(a)) {
    const s = e.attributes.battery_charging ?? !1;
    t.icon = ks(a, s), t.accent = a <= 15 ? "warn" : "eco";
  }
  return t.secondary = void 0, t.quickAction = { kind: "none", label: t.name }, t;
}
function zi(t, e, i, a) {
  return {
    entityId: t,
    domain: t ? St(t) : "",
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
function ui(t) {
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
function Yt(t, e) {
  return new Promise((i) => {
    const a = new CustomEvent("hd-confirm", {
      detail: { opts: e, resolve: i },
      bubbles: !0,
      composed: !0
    });
    t.dispatchEvent(a) || i(!1);
  });
}
function Kt(t, e) {
  t.dispatchEvent(new CustomEvent("hd-toast", { detail: e, bubbles: !0, composed: !0 }));
}
var _s = Object.defineProperty, Fs = Object.getOwnPropertyDescriptor, T = (t, e, i, a) => {
  for (var s = a > 1 ? void 0 : a ? Fs(e, i) : e, n = t.length - 1, r; n >= 0; n--)
    (r = t[n]) && (s = (a ? r(e, i, s) : r(s)) || s);
  return a && s && _s(e, i, s), s;
};
let E = class extends H {
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
    const t = ui(this.accent), e = this.glyphColor || t.fg, i = `--icon-bg:${t.bg};--icon-fg:${e};--accent-ring:${t.fg};--state-color:${this.active ? t.fg : "var(--text-secondary)"}`, a = (this.quickKind !== "none" || this.hasDetail) && !this.unavailable, s = this._bodyAction, n = this.quickKind !== "none" ? this.quickLabel || this.name : this.hasDetail ? `${this.name} details` : this.name, r = s === "detail" ? `${this.name} details` : this.name;
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
E.styles = y`
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
T([
  p({ type: String })
], E.prototype, "icon", 2);
T([
  p({ type: String })
], E.prototype, "name", 2);
T([
  p({ type: String })
], E.prototype, "stateText", 2);
T([
  p({ type: String })
], E.prototype, "secondary", 2);
T([
  p({ type: String })
], E.prototype, "size", 2);
T([
  p({ type: String })
], E.prototype, "accent", 2);
T([
  p({ type: String })
], E.prototype, "glyphColor", 2);
T([
  p({ type: Boolean, reflect: !0 })
], E.prototype, "active", 2);
T([
  p({ type: Boolean, reflect: !0 })
], E.prototype, "unavailable", 2);
T([
  p({ type: Boolean })
], E.prototype, "hasDetail", 2);
T([
  p({ type: String })
], E.prototype, "quickKind", 2);
T([
  p({ type: String })
], E.prototype, "quickLabel", 2);
T([
  p({ type: String })
], E.prototype, "actionState", 2);
T([
  p({ type: Boolean })
], E.prototype, "bleed", 2);
T([
  p({ type: String })
], E.prototype, "layout", 2);
E = T([
  b("hd-widget-frame")
], E);
var Us = Object.defineProperty, Gt = (t, e, i, a) => {
  for (var s = void 0, n = t.length - 1, r; n >= 0; n--)
    (r = t[n]) && (s = r(e, i, s) || s);
  return s && Us(e, i, s), s;
};
class M extends H {
  constructor() {
    super(...arguments), this.currentSize = "1x1", this.layout = "row", this.actionState = "idle", this._resetTimer = 0;
  }
  get entityId() {
    return this.config?.entity;
  }
  get vm() {
    return ka(this.hass, this.entityId, this.config);
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
        if (!await Yt(this, {
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
        await ua(this.hass, e), this.actionState = "success";
      } catch (a) {
        throw this.actionState = "error", Kt(this, {
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
Gt([
  p({ attribute: !1 })
], M.prototype, "hass");
Gt([
  p({ attribute: !1 })
], M.prototype, "config");
Gt([
  p({ type: String })
], M.prototype, "currentSize");
Gt([
  p({ type: String })
], M.prototype, "layout");
Gt([
  x()
], M.prototype, "actionState");
var Js = Object.defineProperty, $s = Object.getOwnPropertyDescriptor, R = (t, e, i, a) => {
  for (var s = a > 1 ? void 0 : a ? $s(e, i) : e, n = t.length - 1, r; n >= 0; n--)
    (r = t[n]) && (s = (a ? r(e, i, s) : r(s)) || s);
  return a && s && Js(e, i, s), s;
};
let O = class extends H {
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
O.styles = y`
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
R([
  p({ type: Number })
], O.prototype, "value", 2);
R([
  p({ type: Number })
], O.prototype, "min", 2);
R([
  p({ type: Number })
], O.prototype, "max", 2);
R([
  p({ type: Number })
], O.prototype, "step", 2);
R([
  p({ type: Boolean, reflect: !0 })
], O.prototype, "vertical", 2);
R([
  p({ type: Boolean, reflect: !0 })
], O.prototype, "disabled", 2);
R([
  p({ type: String })
], O.prototype, "label", 2);
R([
  p({ type: String })
], O.prototype, "icon", 2);
R([
  p({ type: String })
], O.prototype, "valueText", 2);
R([
  p({ type: String })
], O.prototype, "color", 2);
R([
  x()
], O.prototype, "_dragging", 2);
R([
  x()
], O.prototype, "_dragValue", 2);
O = R([
  b("hd-slider")
], O);
var js = Object.defineProperty, qs = Object.getOwnPropertyDescriptor, Sa = (t, e, i, a) => {
  for (var s = a > 1 ? void 0 : a ? qs(e, i) : e, n = t.length - 1, r; n >= 0; n--)
    (r = t[n]) && (s = (a ? r(e, i, s) : r(s)) || s);
  return a && s && js(e, i, s), s;
};
let ue = class extends M {
  constructor() {
    super(...arguments), this._optimistic = null, this._optimisticTs = 0, this._debounce = 0;
  }
  get _displayLevel() {
    const t = this.vm, e = t.level ?? (t.active ? 100 : 0);
    return this._optimistic != null ? Math.abs(e - this._optimistic) <= 3 || Date.now() - this._optimisticTs > 1600 ? (this._optimistic = null, e) : this._optimistic : e;
  }
  _onInput(t) {
    this._optimistic = t, this._optimisticTs = Date.now(), window.clearTimeout(this._debounce), this._debounce = window.setTimeout(() => {
      this.entityId && this.callService(qe(this.entityId, t), { errorVerb: "dim" });
    }, 180);
  }
  _onChange(t) {
    this._optimistic = t, this._optimisticTs = Date.now(), window.clearTimeout(this._debounce), this.entityId && this.callService(qe(this.entityId, t), { errorVerb: "dim" });
  }
  _onTemp(t) {
    this.entityId && this.callService(ft(this.entityId, { colorTempKelvin: t }), {
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
    const t = this.vm, e = oa(t.stateObj), i = this.currentSize, a = e.brightness && (i === "2x1" || i === "1x2" || i === "2x2"), s = i === "1x2", n = e.colorTemp && i === "2x2";
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
ue.styles = y`
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
Sa([
  x()
], ue.prototype, "_optimistic", 2);
ue = Sa([
  b("hd-widget-light")
], ue);
var Ws = Object.getOwnPropertyDescriptor, N = (t, e, i, a) => {
  for (var s = a > 1 ? void 0 : a ? Ws(e, i) : e, n = t.length - 1, r; n >= 0; n--)
    (r = t[n]) && (s = r(s) || s);
  return s;
};
function ke(t, e) {
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
let Ri = class extends M {
  renderContent() {
    return ke(this, { quickKind: "toggle", hasDetail: !0 });
  }
};
Ri = N([
  b("hd-widget-switch")
], Ri);
let Bi = class extends M {
  renderContent() {
    return ke(this, { quickKind: "toggle", hasDetail: !0 });
  }
};
Bi = N([
  b("hd-widget-lock")
], Bi);
let Zi = class extends M {
  renderContent() {
    return ke(this, { quickKind: "none", hasDetail: !0 });
  }
};
Zi = N([
  b("hd-widget-person")
], Zi);
let Qi = class extends M {
  renderContent() {
    return ke(this, { quickKind: "none", hasDetail: !0 });
  }
};
Qi = N([
  b("hd-widget-binary")
], Qi);
class pi extends M {
  hasDetail() {
    return !1;
  }
  async activate() {
    const e = this.vm, i = e.quickAction;
    if (!(!i.call || !this.isConnected2) && !(i.requiresConfirmation && !await Yt(this, { title: `${i.label} ${e.name}?`, confirmLabel: i.label })))
      try {
        await this.callService(i.call, { errorVerb: i.label.toLowerCase() }), Kt(this, { message: `${e.name} — ${i.label.toLowerCase()}`, tone: "eco", icon: "mdi:check" });
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
let _i = class extends pi {
};
_i = N([
  b("hd-widget-scene")
], _i);
let Fi = class extends pi {
};
Fi = N([
  b("hd-widget-script")
], Fi);
let Ui = class extends pi {
};
Ui = N([
  b("hd-widget-button")
], Ui);
let Ji = class extends M {
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
    if (!(!e || !i) && !(this.config.requiresConfirmation && !await Yt(this, {
      title: `${this.config.name ?? "Run"}?`,
      confirmLabel: this.config.name ?? "Run"
    }))) {
      this.actionState = "pending";
      try {
        await this.hass.callService(e, i, { ...t.data ?? {}, ...t.target ?? {} }), this.actionState = "success", Kt(this, { message: `${this.config.name ?? "Done"}`, tone: "eco", icon: "mdi:check" });
      } catch {
        this.actionState = "error", Kt(this, { message: `Couldn't run ${this.config.name ?? "action"}`, tone: "alert", icon: "mdi:alert-circle-outline" });
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
Ji = N([
  b("hd-widget-action")
], Ji);
async function mi(t, e, i = 24) {
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
var Ks = Object.defineProperty, Ns = Object.getOwnPropertyDescriptor, I = (t, e, i, a) => {
  for (var s = a > 1 ? void 0 : a ? Ns(e, i) : e, n = t.length - 1, r; n >= 0; n--)
    (r = t[n]) && (s = (a ? r(e, i, s) : r(s)) || s);
  return a && s && Ks(e, i, s), s;
};
let bt = class extends H {
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
bt.styles = y`
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
I([
  p({ type: Number })
], bt.prototype, "value", 2);
I([
  p({ type: String })
], bt.prototype, "color", 2);
I([
  p({ type: String })
], bt.prototype, "label", 2);
bt = I([
  b("hd-progress")
], bt);
let yt = class extends H {
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
yt.styles = y`
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
I([
  p({ type: String })
], yt.prototype, "icon", 2);
I([
  p({ type: String })
], yt.prototype, "text", 2);
I([
  p({ type: String })
], yt.prototype, "tone", 2);
yt = I([
  b("hd-status-badge")
], yt);
let wt = class extends H {
  constructor() {
    super(...arguments), this.w = "100%", this.h = "16px", this.radius = "8px";
  }
  render() {
    return o`<div class="sk" style=${`--w:${this.w};--h:${this.h};--r:${this.radius}`}></div>`;
  }
};
wt.styles = y`
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
I([
  p({ type: String })
], wt.prototype, "w", 2);
I([
  p({ type: String })
], wt.prototype, "h", 2);
I([
  p({ type: String })
], wt.prototype, "radius", 2);
wt = I([
  b("hd-skeleton")
], wt);
let nt = class extends H {
  constructor() {
    super(...arguments), this.points = [], this.color = "var(--accent)", this.area = !0, this.summary = "";
  }
  render() {
    const t = this.points.filter((u) => Number.isFinite(u));
    if (t.length < 2)
      return o`<svg viewBox="0 0 100 32" preserveAspectRatio="none" aria-label=${this.summary}></svg>`;
    const e = Math.min(...t), a = Math.max(...t) - e || 1, s = 100, n = 32, r = s / (t.length - 1), l = t.map((u, m) => {
      const f = m * r, g = n - (u - e) / a * (n - 4) - 2;
      return [f, g];
    }).map(([u, m], f) => `${f === 0 ? "M" : "L"}${u.toFixed(2)},${m.toFixed(2)}`).join(" "), h = `${l} L${s},${n} L0,${n} Z`;
    return o`<svg viewBox="0 0 ${s} ${n}" preserveAspectRatio="none" role="img" aria-label=${this.summary}
      style=${`--trend-color:${this.color}`}
      >${this.area ? jt`<path class="fill" d=${h}></path>` : d}
      ${jt`<path class="line" d=${l}></path>`}</svg
    >`;
  }
};
nt.styles = y`
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
I([
  p({ attribute: !1 })
], nt.prototype, "points", 2);
I([
  p({ type: String })
], nt.prototype, "color", 2);
I([
  p({ type: Boolean })
], nt.prototype, "area", 2);
I([
  p({ type: String })
], nt.prototype, "summary", 2);
nt = I([
  b("hd-trend")
], nt);
var Xs = Object.defineProperty, Ys = Object.getOwnPropertyDescriptor, Ea = (t, e, i, a) => {
  for (var s = a > 1 ? void 0 : a ? Ys(e, i) : e, n = t.length - 1, r; n >= 0; n--)
    (r = t[n]) && (s = (a ? r(e, i, s) : r(s)) || s);
  return a && s && Xs(e, i, s), s;
};
let pe = class extends M {
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
    const t = await mi(this.hass, this.entityId, 24);
    this._trend = t.map((e) => e.value);
  }
  renderContent() {
    const t = this.vm, e = t.stateObj, i = e ? Number(e.state) : NaN, a = Number.isFinite(i) && e.state.trim() !== "", s = e?.attributes.unit_of_measurement, n = ui(t.accent), r = t.available ? a ? o`<div class="value">
            <span>${Gs(i)}</span>${s ? o`<span class="unit">${s}</span>` : d}
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
pe.styles = y`
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
Ea([
  x()
], pe.prototype, "_trend", 2);
pe = Ea([
  b("hd-widget-sensor")
], pe);
function Gs(t) {
  const e = Math.abs(t), i = e >= 100 ? 0 : e >= 10 ? 1 : 2;
  try {
    return new Intl.NumberFormat(void 0, { maximumFractionDigits: i }).format(t);
  } catch {
    return t.toFixed(i);
  }
}
var tn = Object.defineProperty, en = Object.getOwnPropertyDescriptor, te = (t, e, i, a) => {
  for (var s = a > 1 ? void 0 : a ? en(e, i) : e, n = t.length - 1, r; n >= 0; n--)
    (r = t[n]) && (s = (a ? r(e, i, s) : r(s)) || s);
  return a && s && tn(e, i, s), s;
};
let rt = class extends H {
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
rt.styles = y`
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
te([
  p({ attribute: !1 })
], rt.prototype, "options", 2);
te([
  p({ type: String })
], rt.prototype, "value", 2);
te([
  p({ type: Boolean, reflect: !0 })
], rt.prototype, "disabled", 2);
te([
  p({ type: String })
], rt.prototype, "label", 2);
rt = te([
  b("hd-segmented")
], rt);
var an = Object.defineProperty, sn = Object.getOwnPropertyDescriptor, Ia = (t, e, i, a) => {
  for (var s = a > 1 ? void 0 : a ? sn(e, i) : e, n = t.length - 1, r; n >= 0; n--)
    (r = t[n]) && (s = (a ? r(e, i, s) : r(s)) || s);
  return a && s && an(e, i, s), s;
};
const nn = {
  off: "mdi:power",
  heat: "mdi:fire",
  cool: "mdi:snowflake",
  heat_cool: "mdi:thermostat-auto",
  auto: "mdi:thermostat-auto",
  dry: "mdi:water-percent",
  fan_only: "mdi:fan"
};
let me = class extends M {
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
      this.entityId && this.callService(ga(this.entityId, this._optimisticTarget), {
        errorVerb: "set temperature for"
      });
    }, 350);
  }
  _setMode(t) {
    this.entityId && this.callService(fa(this.entityId, t), { errorVerb: "set mode for" });
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
        <span class="target">${i ? "—" : `${A(this._target)}°`}</span>
        <hd-icon-button
          icon="mdi:plus"
          label="Raise target temperature"
          variant="soft"
          .disabled=${i || !e.available}
          @click=${() => this._step(1)}
        ></hd-icon-button>
      </div>
      ${a != null ? o`<div class="now">Now ${A(a)}°</div>` : d}
    </div>`;
  }
  _renderModes() {
    const t = this.vm, e = t.stateObj?.attributes.hvac_modes ?? [];
    if (e.length < 2) return d;
    const i = e.map((a) => ({ value: a, icon: nn[a] ?? "mdi:thermostat" }));
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
    const t = this.vm, e = this.currentSize, a = la(t.stateObj).targetTemp, s = e === "2x2";
    return o`
      <hd-widget-frame
        .icon=${t.icon}
        .layout=${this.layout}
        .name=${t.name}
        .stateText=${k(t.rawState)}
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
me.styles = y`
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
Ia([
  x()
], me.prototype, "_optimisticTarget", 2);
me = Ia([
  b("hd-widget-climate")
], me);
var rn = Object.defineProperty, on = Object.getOwnPropertyDescriptor, Pa = (t, e, i, a) => {
  for (var s = a > 1 ? void 0 : a ? on(e, i) : e, n = t.length - 1, r; n >= 0; n--)
    (r = t[n]) && (s = (a ? r(e, i, s) : r(s)) || s);
  return a && s && rn(e, i, s), s;
};
let ge = class extends M {
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
      this.entityId && this.callService(wa(this.entityId, t), { errorVerb: "move" });
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
            @click=${() => this.entityId && this.callService(va(this.entityId), { errorVerb: "open" })}
          ></hd-icon-button>` : d}
      ${t.stop ? o`<hd-icon-button
            icon="mdi:stop"
            label="Stop"
            variant="soft"
            .disabled=${a}
            @click=${() => this.entityId && this.callService(ya(this.entityId), { errorVerb: "stop" })}
          ></hd-icon-button>` : d}
      ${t.close ? o`<hd-icon-button
            icon="mdi:arrow-down"
            label="Close"
            variant="soft"
            .disabled=${a}
            @click=${() => this.entityId && this.callService(ba(this.entityId), { errorVerb: "close" })}
          ></hd-icon-button>` : d}
    </div>`;
  }
  renderContent() {
    const t = this.vm, e = ca(t.stateObj), i = this.currentSize, a = i === "1x2", s = e.setPosition && i !== "1x1";
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
ge.styles = y`
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
Pa([
  x()
], ge.prototype, "_optimistic", 2);
ge = Pa([
  b("hd-widget-cover")
], ge);
const cn = {
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
function fe(t) {
  return cn[t.replace(/ /g, " ").trim().toLowerCase()];
}
function ln(t) {
  return t.some((e) => fe(e) !== void 0);
}
function dn(t) {
  return t.replace(/ /g, " ").trim().toLowerCase();
}
const hn = [
  { key: "tv", label: "Apple TV+", icon: "mdi:apple" },
  { key: "infuse", label: "Infuse", icon: "mdi:play-box-multiple" },
  { key: "netflix", label: "Netflix", icon: "mdi:netflix" }
];
function un(t) {
  const e = /* @__PURE__ */ new Map();
  for (const n of t) {
    const r = dn(n);
    e.has(r) || e.set(r, n);
  }
  const i = [], a = /* @__PURE__ */ new Set();
  for (const n of hn) {
    const r = e.get(n.key);
    r && (i.push({ ...n, source: r }), a.add(r));
  }
  const s = t.filter((n) => !a.has(n));
  return { featured: i, rest: s };
}
function Ne(t) {
  const e = t?.attributes.media_duration;
  if (!t || !e || e <= 0) return null;
  let i = t.attributes.media_position ?? 0;
  const a = t.attributes.media_position_updated_at;
  return t.state === "playing" && a && (i += (Date.now() - new Date(a).getTime()) / 1e3), i = Math.max(0, Math.min(i, e)), {
    pct: i / e * 100,
    elapsed: Ti(i),
    total: Ti(e),
    positionSec: i,
    durationSec: e
  };
}
const _t = /* @__PURE__ */ new Map(), ae = /* @__PURE__ */ new Map();
function pn(t) {
  return _t.get(t);
}
function mn(t) {
  if (_t.has(t)) return Promise.resolve(_t.get(t) ?? null);
  const e = ae.get(t);
  if (e) return e;
  const i = gn(t).then((a) => (_t.set(t, a), ae.delete(t), a)).catch(() => (_t.set(t, null), ae.delete(t), null));
  return ae.set(t, i), i;
}
function gn(t) {
  return new Promise((e) => {
    const i = new Image();
    i.crossOrigin = "anonymous", i.decoding = "async", i.onload = () => e(fn(i)), i.onerror = () => e(null), i.src = t;
  });
}
function fn(t) {
  const i = document.createElement("canvas");
  i.width = 24, i.height = 24;
  const a = i.getContext("2d", { willReadFrequently: !0 });
  if (!a) return null;
  try {
    a.drawImage(t, 0, 0, 24, 24);
    const { data: s } = a.getImageData(0, 0, 24, 24);
    let n = 0, r = 0, c = 0, l = 0, h = null, u = -1;
    for (let f = 0; f < s.length; f += 4) {
      const g = s[f], v = s[f + 1], w = s[f + 2];
      if (s[f + 3] < 200) continue;
      n += g, r += v, c += w, l += 1;
      const S = Math.max(g, v, w), D = Math.min(g, v, w), V = (S + D) / 2, ut = (S === 0 ? 0 : (S - D) / S) * (1 - Math.abs(V - 140) / 140);
      ut > u && (u = ut, h = { r: g, g: v, b: w });
    }
    if (!l) return null;
    const m = { r: n / l | 0, g: r / l | 0, b: c / l | 0 };
    return h && u > 0.15 ? {
      r: h.r * 0.6 + m.r * 0.4 | 0,
      g: h.g * 0.6 + m.g * 0.4 | 0,
      b: h.b * 0.6 + m.b * 0.4 | 0
    } : m;
  } catch {
    return null;
  }
}
function Qe({ r: t, g: e, b: i }, a) {
  const s = 1 - a;
  return { r: t * s | 0, g: e * s | 0, b: i * s | 0 };
}
function _e({ r: t, g: e, b: i }, a = 1) {
  return a >= 1 ? `rgb(${t}, ${e}, ${i})` : `rgba(${t}, ${e}, ${i}, ${a})`;
}
var vn = Object.defineProperty, bn = Object.getOwnPropertyDescriptor, Se = (t, e, i, a) => {
  for (var s = a > 1 ? void 0 : a ? bn(e, i) : e, n = t.length - 1, r; n >= 0; n--)
    (r = t[n]) && (s = (a ? r(e, i, s) : r(s)) || s);
  return a && s && vn(e, i, s), s;
};
const yn = { r: 32, g: 36, b: 44 }, wn = 1600;
let Ct = class extends M {
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
      if (Date.now() - this._optimisticTs > wn)
        return this._optimistic = null, t;
      const e = this._optimistic === "playing";
      return t === e ? (this._optimistic = null, t) : e;
    }
    return t;
  }
  _playPause() {
    this.entityId && (this._optimistic = this._isPlaying ? "paused" : "playing", this._optimisticTs = Date.now(), this.callService(Ca(this.entityId), { errorVerb: "control" }));
  }
  // ---- Lifecycle ---------------------------------------------------------
  updated() {
    const t = this.vm.stateObj?.attributes.entity_picture;
    if (t && this._colorFor !== t) {
      this._colorFor = t;
      const e = pn(t);
      e !== void 0 ? this._artColor = e : mn(t).then((i) => {
        this._colorFor === t && (this._artColor = i);
      });
    } else !t && this._colorFor && (this._colorFor = "", this._artColor = null);
    this._syncTicker(), this._checkMarquee();
  }
  /** Advance the scrubber once a second while actually playing. */
  _syncTicker() {
    const t = this._isPlaying && !!Ne(this.vm.stateObj);
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
    const t = this._artColor ?? yn, e = Qe(t, 0.62);
    return [
      `--np-dark:${_e(e)}`,
      `--np-scrim-strong:${_e(Qe(t, 0.55), 0.9)}`,
      `--np-scrim-soft:${_e(Qe(t, 0.35), 0.45)}`
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
            @click=${() => this.entityId && this.callService(Aa(this.entityId), { errorVerb: "skip" })}
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
            @click=${() => this.entityId && this.callService(xa(this.entityId), { errorVerb: "skip" })}
          ></hd-icon-button>` : d}
    </div>`;
  }
  renderContent() {
    const t = this.vm, e = da(t.stateObj), i = this.currentSize, a = t.stateObj?.attributes.entity_picture, s = t.stateObj?.attributes.app_name, n = t.stateObj?.attributes.media_title, r = this._rawState, c = s ? fe(s) : void 0;
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
    const u = i === "2x2", m = Ne(t.stateObj), f = a ? `background-image:url("${a}")` : "";
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
          ${m ? o`<div class="np-progress"><span style=${`width:${m.pct}%`}></span></div>` : d}
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
Ct.styles = y`
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
Se([
  x()
], Ct.prototype, "_artColor", 2);
Se([
  x()
], Ct.prototype, "_optimistic", 2);
Se([
  x()
], Ct.prototype, "_marquee", 2);
Ct = Se([
  b("hd-widget-media")
], Ct);
const Cn = "data:image/webp;base64,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";
var xn = Object.getOwnPropertyDescriptor, An = (t, e, i, a) => {
  for (var s = a > 1 ? void 0 : a ? xn(e, i) : e, n = t.length - 1, r; n >= 0; n--)
    (r = t[n]) && (s = r(s) || s);
  return s;
};
const Ln = "#EA0029";
let Xe = class extends M {
  get _branded() {
    const t = this.config.options ?? {};
    return t.brand === "roborock" || t.branded === !0;
  }
  relevantEntityIds() {
    return [...this.entityId ? [this.entityId] : [], ...Ut(this.hass, this.entityId).ids];
  }
  _progress() {
    const t = Ut(this.hass, this.entityId);
    if (this.vm.rawState !== "cleaning" || typeof t.progress != "number") return d;
    const e = Math.max(0, Math.min(100, Math.round(t.progress))), i = [`${e}%`];
    return typeof t.area == "number" && t.area > 0 && i.push(`${A(t.area)} m²`), typeof t.cleaningTime == "number" && t.cleaningTime > 0 && i.push(`${Math.round(t.cleaningTime)} min`), o`<div class="progress">
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
            @click=${() => this.entityId && this.callService(We(this.entityId), { errorVerb: "pause" })}
          ></hd-icon-button>` : o`<hd-icon-button
            icon="mdi:play"
            label="Start"
            variant="filled"
            .disabled=${a || !t.start}
            @click=${() => this.entityId && this.callService(de(this.entityId), { errorVerb: "start" })}
          ></hd-icon-button>`}
      ${t.returnHome ? o`<hd-icon-button
            icon="mdi:home-import-outline"
            label="Return to dock"
            variant="soft"
            .disabled=${a || i === "docked"}
            @click=${() => this.entityId && this.callService(he(this.entityId), { errorVerb: "dock" })}
          ></hd-icon-button>` : d}
    </div>`;
  }
  _fanSpeed() {
    const t = this.vm, i = (t.stateObj?.attributes.fan_speed_list ?? []).filter((s) => !["off", "custom"].includes(s));
    if (i.length < 2) return d;
    const a = i.map((s) => ({ value: s, label: k(s) }));
    return o`<div class="fan">
      <hd-segmented
        .options=${a}
        .value=${t.stateObj?.attributes.fan_speed ?? ""}
        .disabled=${!t.available}
        label="Suction power"
        @hd-select=${(s) => this.entityId && this.callService(La(this.entityId, s.detail.value), { errorVerb: "set suction for" })}
      ></hd-segmented>
    </div>`;
  }
  /** Translucent-white transport pills used on the branded hero. */
  _heroControls(t) {
    const e = this.vm, i = e.rawState, a = !e.available, s = i === "cleaning", n = (r, c) => this.entityId && this.callService(r(), { errorVerb: c });
    return o`<div class="controls" @click=${(r) => r.stopPropagation()}>
      ${s && t.pause ? o`<button class="pill primary" aria-label="Pause" ?disabled=${a} @click=${() => n(() => We(this.entityId), "pause")}>
            <hd-icon icon="mdi:pause" .size=${20}></hd-icon>
          </button>` : o`<button class="pill primary" aria-label="Start" ?disabled=${a || !t.start} @click=${() => n(() => de(this.entityId), "start")}>
            <hd-icon icon="mdi:play" .size=${20}></hd-icon>
          </button>`}
      ${t.returnHome ? o`<button class="pill" aria-label="Return to dock" ?disabled=${a || i === "docked"} @click=${() => n(() => he(this.entityId), "dock")}>
            <hd-icon icon="mdi:home-import-outline" .size=${20}></hd-icon>
          </button>` : d}
      ${t.locate ? o`<button class="pill" aria-label="Locate" ?disabled=${a} @click=${() => n(() => Ha(this.entityId), "locate")}>
            <hd-icon icon="mdi:map-marker-radius" .size=${20}></hd-icon>
          </button>` : d}
    </div>`;
  }
  /** Full-bleed Roborock-branded hero (2×2): red panel + product shot. */
  _renderHero(t) {
    const e = this.vm, i = Ut(this.hass, this.entityId), a = e.rawState === "cleaning", s = a && typeof i.progress == "number" ? Math.max(0, Math.min(100, Math.round(i.progress))) : void 0, n = [];
    i.battery != null && n.push(`${Math.round(i.battery)}%`), i.area != null && i.area > 0 && n.push(`${A(i.area)} m²`);
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
          <img class="robot" src=${Cn} alt="" aria-hidden="true" draggable="false" />
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
    const t = this.vm, e = this.currentSize, i = ha(t.stateObj), a = e !== "1x1";
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
Xe.styles = y`
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
      color: ${Ki(Ln)};
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
Xe = An([
  b("hd-widget-vacuum")
], Xe);
var Hn = Object.defineProperty, Mn = Object.getOwnPropertyDescriptor, Ta = (t, e, i, a) => {
  for (var s = a > 1 ? void 0 : a ? Mn(e, i) : e, n = t.length - 1, r; n >= 0; n--)
    (r = t[n]) && (s = (a ? r(e, i, s) : r(s)) || s);
  return a && s && Hn(e, i, s), s;
};
let ve = class extends M {
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
    return t.humidity != null && e.push(["mdi:water-percent", `${Math.round(t.humidity)}%`]), t.wind_speed != null && e.push(["mdi:weather-windy", `${A(t.wind_speed)} ${t.wind_speed_unit ?? "km/h"}`]), o`<div class="metrics">
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
          <hd-icon .icon=${Ke(t.condition ?? "")} .size=${20}></hd-icon>
          <span class="hi">${t.temperature != null ? `${Math.round(t.temperature)}°` : "–"}</span>
          ${t.templow != null ? o`<span class="lo">${Math.round(t.templow)}°</span>` : d}
        </div>`;
    })}
    </div>` : d;
  }
  renderContent() {
    const t = this.vm, e = t.stateObj?.attributes ?? {}, i = this.currentSize, a = i === "1x2" || i === "2x2", s = e.temperature != null ? `${A(e.temperature)}°` : "—", n = this.layout === "value";
    return o`
      <hd-widget-frame
        .icon=${Ke(t.rawState)}
        .layout=${this.layout}
        .name=${t.name}
        .stateText=${n ? s : k(t.rawState)}
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
ve.styles = y`
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
Ta([
  x()
], ve.prototype, "_forecast", 2);
ve = Ta([
  b("hd-widget-weather")
], ve);
var Vn = Object.defineProperty, kn = Object.getOwnPropertyDescriptor, Da = (t, e, i, a) => {
  for (var s = a > 1 ? void 0 : a ? kn(e, i) : e, n = t.length - 1, r; n >= 0; n--)
    (r = t[n]) && (s = (a ? r(e, i, s) : r(s)) || s);
  return a && s && Vn(e, i, s), s;
};
let be = class extends M {
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
    const e = await mi(this.hass, t, 24);
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
    return e >= 1e3 ? { value: A(e / 1e3), unit: "kW" } : { value: String(Math.round(e)), unit: "W" };
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
          ${a != null ? o`<hd-status-badge tone="eco" icon="mdi:weather-sunny" text=${`${A(a)} kWh today`}></hd-status-badge>` : d}
          ${n != null && i == null ? o`<hd-status-badge tone="neutral" icon="mdi:chart-bell-curve" text=${`${A(n)} kWh left`}></hd-status-badge>` : d}
          ${s != null && (r === "2x2" || r === "2x1") ? o`<hd-status-badge tone="neutral" icon="mdi:chart-line" text=${`${A(s)} kWh forecast`}></hd-status-badge>` : d}
        </div>

        ${r === "2x2" && this._trend.length > 1 ? o`<div class="trend">
              <hd-trend .points=${this._trend} .color=${"var(--accent)"} .summary=${"24 hour grid power"}></hd-trend>
            </div>` : d}
      </hd-widget-frame>
    `;
  }
};
be.styles = y`
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
Da([
  x()
], be.prototype, "_trend", 2);
be = Da([
  b("hd-widget-energy")
], be);
const P = 25;
function ye(t) {
  if (!t) return null;
  const e = Number(t.state);
  if (!Number.isFinite(e)) return null;
  const i = String(t.attributes.unit_of_measurement ?? "").toLowerCase();
  return i === "kw" ? e * 1e3 : i === "mw" ? e * 1e6 : e;
}
function Dt(t) {
  return t > 0 ? t : 0;
}
function Sn(t) {
  const e = t.grid ?? 0, i = Dt(t.solar ?? 0), a = Dt(t.car ?? 0), s = t.carActive ? a : 0, n = Dt(e), r = Dt(-e), c = Dt(i + e - s), l = n > P || r > P, h = i > P, u = t.carActive && s > P, m = n > P ? "import" : r > P ? "export" : "idle", f = {
    watts: m === "export" ? r : n,
    direction: m === "import" ? "toHouse" : m === "export" ? "toGrid" : "idle",
    active: l,
    // Exported energy is solar in origin; imported is grid.
    source: m === "export" ? "solar" : "grid"
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
    source: u && (r > P || i > s) ? "solar" : "grid"
  }, w = c + s, S = w > 0 ? Math.round(Math.min(i, w) / w * 100) : i > 0 ? 100 : 0;
  return {
    grid: { watts: Math.abs(e), active: l, mode: m },
    solar: { watts: i, active: h },
    house: { watts: c, active: c > P },
    car: { watts: s, active: u, connected: t.carConnected ?? t.carActive },
    paths: { gridHouse: f, solarHouse: g, houseCar: v },
    selfSufficiency: S
  };
}
function Ye(t) {
  if (!t) return !1;
  const e = t.toLowerCase();
  return e === "charging" || e === "starting";
}
function Ge(t) {
  if (!t) return !1;
  const e = t.toLowerCase();
  return e !== "not_connected" && e !== "disconnected" && e !== "unavailable" && e !== "unknown";
}
var En = Object.defineProperty, In = Object.getOwnPropertyDescriptor, Ee = (t, e, i, a) => {
  for (var s = a > 1 ? void 0 : a ? In(e, i) : e, n = t.length - 1, r; n >= 0; n--)
    (r = t[n]) && (s = (a ? r(e, i, s) : r(s)) || s);
  return a && s && En(e, i, s), s;
};
function Oa(t, e) {
  const i = (u) => u ? ye(t.states[u]) : null, a = i(e.gridPower), s = i(e.solarPower);
  let n = i(e.carPower);
  if ((n == null || n === 0) && e.carPowerAlt) {
    const u = i(e.carPowerAlt);
    u != null && u > 0 && (n = u);
  }
  const r = e.carActive ? t.states[e.carActive]?.state : void 0, c = e.carActiveAlt ? t.states[e.carActiveAlt]?.state : void 0, l = Ye(r) || Ye(c), h = Ge(r) || Ge(c);
  return Sn({ grid: a, solar: s, car: n, carActive: l, carConnected: h });
}
function Fe(t) {
  const e = Math.abs(t);
  return e >= 1e3 ? `${A(e / 1e3)} kW` : `${Math.round(e)} W`;
}
const _ = {
  grid: [25, 26],
  solar: [75, 26],
  house: [50, 50],
  car: [50, 80]
}, Ot = { grid: [40, 40], solar: [60, 40], car: [67, 64] }, zt = 10, Rt = 13;
function Ue(t, e) {
  const i = Math.hypot(t, e) || 1;
  return [t / i, e / i];
}
function Bt(t, e, i, a, s) {
  const [n, r] = Ue(e[0] - t[0], e[1] - t[1]), c = [t[0] + n * a, t[1] + r * a], [l, h] = Ue(e[0] - i[0], e[1] - i[1]), u = [i[0] + l * s, i[1] + h * s], m = `M ${c[0].toFixed(2)} ${c[1].toFixed(2)} Q ${e[0]} ${e[1]} ${u[0].toFixed(2)} ${u[1].toFixed(2)}`, [f, g] = Ue(u[0] - e[0], u[1] - e[1]), v = 3.1, w = [u[0] - f * v, u[1] - g * v], S = -g * v * 0.6, D = f * v * 0.6, V = `${u[0].toFixed(2)},${u[1].toFixed(2)} ${(w[0] + S).toFixed(2)},${(w[1] + D).toFixed(2)} ${(w[0] - S).toFixed(2)},${(w[1] - D).toFixed(2)}`;
  return { d: m, chevron: V };
}
const se = (t, e, i) => t + (e - t) * i, Pn = (t) => 1 - Math.pow(1 - t, 3);
let Nt = class extends H {
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
      const l = Math.min(1, (c - s) / n), h = Pn(l);
      this._shown = {
        grid: se(a.grid, e.grid, h),
        solar: se(a.solar, e.solar, h),
        house: se(a.house, e.house, h),
        car: se(a.car, e.car, h)
      }, l < 1 && (this._raf = requestAnimationFrame(r));
    };
    this._raf = requestAnimationFrame(r);
  }
  _speed(t) {
    return Math.min(2.4, Math.max(0.7, 2.6 - t / 2500));
  }
  _conn(t, e, i, a, s) {
    return jt`
      <path class="track" d=${e.d}></path>
      <path class="band ${i ? "on" : ""}" d=${t.d} style=${`stroke:${a};--pc:${a}`}></path>
      ${i ? jt`<path class="flow" d=${t.d} style=${`stroke:${a};animation-duration:${this._speed(s)}s`}></path>` : d}
      <polygon class="chevron ${i ? "on" : ""}" points=${t.chevron} style=${`fill:${a}`}></polygon>
    `;
  }
  _node(t, e, i, a, s, n) {
    const [r, c] = _[t], l = t === "house";
    return o`<div class="${`node ${l ? "hub " : ""}${a ? "active" : "idle"}`}" style=${`left:${r}%;top:${c}%;--n-fg:${s}`}>
      <div class="disc"><hd-icon .icon=${e} .size=${l ? 26 : 22}></hd-icon></div>
      <div class="label">${Fe(this._shown[t])}</div>
      ${n ?? o`<div class="name">${i}</div>`}
    </div>`;
  }
  render() {
    const t = this.model;
    if (!t) return d;
    const e = "var(--state-eco)", i = "var(--accent)", a = t.grid.mode !== "export", s = t.grid.mode === "export" ? e : i, n = t.paths.houseCar.source === "solar" ? e : i, r = a ? Bt(_.grid, Ot.grid, _.house, zt, Rt) : Bt(_.house, Ot.grid, _.grid, Rt, zt), c = Bt(_.grid, Ot.grid, _.house, zt, Rt), l = Bt(_.solar, Ot.solar, _.house, zt, Rt), h = Bt(_.house, Ot.car, _.car, Rt, zt), u = t.grid.mode === "export" ? e : t.grid.mode === "import" ? i : "var(--text-tertiary)", m = t.grid.mode === "export" ? `Exporting ${Fe(t.grid.watts)}` : t.grid.mode === "import" ? `Importing ${Fe(t.grid.watts)}` : "Grid balanced", f = t.solar.watts > P;
    return o`
      <div class="stage">
        <div class="status" style=${`--status-color:${u}`}>
          <span class="dot"></span><span class="txt">${m}</span>
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
Nt.styles = y`
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
Ee([
  p({ attribute: !1 })
], Nt.prototype, "model", 2);
Ee([
  x()
], Nt.prototype, "_shown", 2);
Nt = Ee([
  b("hd-flow-diagram")
], Nt);
let $i = class extends M {
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
    const t = this.hass ? Oa(this.hass, this._opts) : void 0, e = t?.grid.mode === "export" ? "eco" : "accent";
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
$i = Ee([
  b("hd-widget-powerflow")
], $i);
var Tn = Object.getOwnPropertyDescriptor, Dn = (t, e, i, a) => {
  for (var s = a > 1 ? void 0 : a ? Tn(e, i) : e, n = t.length - 1, r; n >= 0; n--)
    (r = t[n]) && (s = r(s) || s);
  return s;
};
const mt = (t, e) => {
  if (!e || !t) return null;
  const i = t.states[e];
  if (!i) return null;
  const a = Number(i.state);
  return Number.isFinite(a) ? a : null;
}, Je = (t, e) => e ? t?.states[e]?.state : void 0;
function za(t, e) {
  const i = Je(t, e.master) === "on", a = Je(t, e.vehicleConnected) === "on", s = Je(t, e.chargingState), n = mt(t, e.chargePower), r = mt(t, e.battery), c = mt(t, e.chargeLimit), l = mt(t, e.sessionEnergy), h = mt(t, e.chargeRate), u = mt(t, e.chargeCurrent), m = s === "charging" || s === "starting" || (n ?? 0) > 0.1, f = s === "complete";
  let g;
  a ? m ? g = "charging" : f ? g = "complete" : i ? g = "waiting" : g = "off" : g = "unplugged";
  const v = n != null ? A(n) : "—", w = {
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
    ...w[g]
  };
}
let ti = class extends M {
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
    t && this.callService(K(t), { errorVerb: "toggle solar charging" });
  }
  renderContent() {
    const t = za(this.hass, this._opts), e = this.currentSize, i = t.batteryPct, a = t.limitPct, s = t.phase === "charging" && t.armed ? "var(--state-eco)" : "var(--accent)", n = i != null && (e === "2x2" || e === "1x2"), r = e === "2x2" || e === "1x2" || e === "2x1";
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
                    text=${`${A(t.powerKw)} kW`}
                  ></hd-status-badge>` : d}
              ${t.sessionKwh != null && t.sessionKwh > 0.01 ? o`<hd-status-badge
                    tone="neutral"
                    icon="mdi:counter"
                    text=${`${A(t.sessionKwh)} kWh session`}
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
ti.styles = y`
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
ti = Dn([
  b("hd-widget-solarcharging")
], ti);
function On(t) {
  const e = {};
  for (const [i, a] of Object.entries(t ?? {}))
    e[i] = (a ?? []).map((s) => ({
      start: typeof s.start == "number" ? s.start : Date.parse(String(s.start)),
      change: Number.isFinite(s.change) ? s.change : 0
    }));
  return e;
}
function Ra(t, e, i = /* @__PURE__ */ new Date()) {
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
function zn(t, e) {
  const i = new Date(t);
  return Number.isNaN(i.getTime()) ? "" : e === "day" ? i.toLocaleDateString(void 0, { weekday: "short" }) : e === "week" ? i.toLocaleDateString(void 0, { day: "numeric", month: "short" }) : i.toLocaleDateString(void 0, { month: "short" });
}
async function Ba(t, e, i, a) {
  const s = e.filter(Boolean);
  if (!s.length) return {};
  const n = await t.callWS({
    type: "recorder/statistics_during_period",
    start_time: a.toISOString(),
    statistic_ids: s,
    period: i,
    types: ["change"]
  });
  return On(n);
}
var Rn = Object.defineProperty, Bn = Object.getOwnPropertyDescriptor, ee = (t, e, i, a) => {
  for (var s = a > 1 ? void 0 : a ? Bn(e, i) : e, n = t.length - 1, r; n >= 0; n--)
    (r = t[n]) && (s = (a ? r(e, i, s) : r(s)) || s);
  return a && s && Rn(e, i, s), s;
};
const Zn = (t) => {
  if (t <= 0) return 1;
  const e = Math.pow(10, Math.floor(Math.log10(t))), i = t / e;
  return (i <= 1 ? 1 : i <= 2 ? 2 : i <= 5 ? 5 : 10) * e;
}, ne = (t) => Math.abs(t) >= 100 ? Math.round(t).toString() : t.toFixed(1);
let ot = class extends H {
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
    const a = Zn(i), s = e.map((n) => `${n.label} ${ne(this._total(n))} ${this.unit}`).join(", ");
    return o`
      <div class="wrap" role="img" aria-label=${s}>
        <div class="plot">
          <span class="ymax">${ne(a)} ${this.unit}</span>
          ${this.labels.map(
      (n, r) => o`<div class="group">
              <div class="bars">
                ${this.series.map((c) => {
        const l = Number.isFinite(c.values[r]) ? c.values[r] : 0, h = l <= 0 ? 0 : Math.max(1.5, l / a * 100);
        return o`<div
                    class="bar"
                    style=${`--c:${c.color};height:${h}%`}
                    title=${`${c.label}: ${ne(l)} ${this.unit}`}
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
                  <i></i>${n.label} <b>${ne(this._total(n))} ${this.unit}</b>
                </span>`
    )}
            </div>` : d}
      </div>
    `;
  }
};
ot.styles = y`
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
ee([
  p({ attribute: !1 })
], ot.prototype, "series", 2);
ee([
  p({ attribute: !1 })
], ot.prototype, "labels", 2);
ee([
  p({ type: String })
], ot.prototype, "unit", 2);
ee([
  p({ type: Boolean })
], ot.prototype, "legend", 2);
ot = ee([
  b("hd-bar-chart")
], ot);
var Qn = Object.defineProperty, _n = Object.getOwnPropertyDescriptor, Ie = (t, e, i, a) => {
  for (var s = a > 1 ? void 0 : a ? _n(e, i) : e, n = t.length - 1, r; n >= 0; n--)
    (r = t[n]) && (s = (a ? r(e, i, s) : r(s)) || s);
  return a && s && Qn(e, i, s), s;
};
const $e = [
  { key: "solar", label: "Solar", color: "#f4b740" },
  { key: "gridImport", label: "Import", color: "var(--accent)" },
  { key: "gridExport", label: "Export", color: "var(--state-eco)" },
  { key: "car", label: "Car", color: "#8b7cf6" }
], ji = { day: 7, week: 8, month: 12 };
let xt = class extends M {
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
    return $e.map((t) => this._opts[t.key]).filter((t) => typeof t == "string");
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
        const i = Ra(this._period, ji[this._period]);
        this._data = await Ba(this.hass, t, this._period, i);
      } catch {
        this._data = {};
      }
    }
  }
  _setPeriod(t) {
    t !== this._period && (this._period = t);
  }
  _chart() {
    const t = ji[this._period], e = /* @__PURE__ */ new Set();
    for (const n of $e) {
      const r = this._opts[n.key];
      if (r) for (const c of this._data[r] ?? []) e.add(c.start);
    }
    const i = [...e].sort((n, r) => n - r).slice(-t), a = i.map((n) => zn(n, this._period)), s = $e.filter((n) => this._opts[n.key]).map((n) => {
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
xt.styles = y`
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
Ie([
  x()
], xt.prototype, "_period", 2);
Ie([
  x()
], xt.prototype, "_data", 2);
Ie([
  x()
], xt.prototype, "_periodInit", 2);
xt = Ie([
  b("hd-widget-energychart")
], xt);
var Fn = Object.getOwnPropertyDescriptor, Un = (t, e, i, a) => {
  for (var s = a > 1 ? void 0 : a ? Fn(e, i) : e, n = t.length - 1, r; n >= 0; n--)
    (r = t[n]) && (s = r(s) || s);
  return s;
};
let ei = class extends M {
  get _opts() {
    return this.config.options ?? {};
  }
  relevantEntityIds() {
    const t = this._opts;
    return [this.config.entity, t.chargeStatus, t.connected].filter((e) => typeof e == "string");
  }
  _valueText() {
    const t = this._opts, e = this.entityId ? this.hass?.states[this.entityId] : void 0;
    if (!e) return "—";
    if (t.format === "power") {
      const i = ye(e);
      if (i == null) return "—";
      const a = Math.abs(i);
      return a >= 1e3 ? `${A(a / 1e3)} kW` : `${Math.round(a)} W`;
    }
    if (t.format === "percent") {
      const i = Number(e.state);
      return Number.isFinite(i) ? `${Math.round(i)}%` : "—";
    }
    return dt(this.hass, e);
  }
  _statusText() {
    const t = this._opts;
    if (t.status === "gridDirection") {
      const e = this.entityId ? this.hass?.states[this.entityId] : void 0, i = e ? ye(e) : null;
      return i == null ? "" : i > P ? "Importing" : i < -P ? "Exporting" : "Balanced";
    }
    if (t.status === "carCharge") {
      const e = t.chargeStatus ? this.hass?.states[t.chargeStatus]?.state : void 0;
      return (t.connected ? this.hass?.states[t.connected]?.state : void 0) === "on" || Ge(e) ? Ye(e) ? "Charging" : "Plugged in" : "Disconnected";
    }
    return "";
  }
  renderContent() {
    const t = this._opts, e = ui(t.accent ?? "idle").fg, i = this.entityId ? this.hass?.states[this.entityId] : void 0, a = !i || i.state === "unavailable" || i.state === "unknown";
    this.setAttribute("data-unavailable", a ? "true" : "false");
    const s = this._valueText(), n = this._statusText(), r = n ? `${s} • ${n}` : s;
    return o`
      <button
        class="tile"
        style=${`--glyph:${e}`}
        aria-label=${`${this.config.name ?? ""} details`}
        @click=${() => this.openDetail()}
      >
        <span class="glyph">
          <hd-icon .icon=${this.config.icon ?? "mdi:flash"} .size=${24}></hd-icon>
        </span>
        <span class="text">
          <span class="name">${this.config.name ?? ""}</span>
          <span class="sub">${r}</span>
        </span>
        ${d}
      </button>
    `;
  }
};
ei.styles = y`
    :host {
      display: block;
      height: 100%;
    }
    .tile {
      -webkit-tap-highlight-color: transparent;
      appearance: none;
      border: none;
      text-align: left;
      width: 100%;
      height: 100%;
      box-sizing: border-box;
      background: var(--surface);
      border-radius: var(--radius-widget);
      box-shadow: var(--shadow-widget);
      padding: 13px 14px;
      display: flex;
      align-items: center;
      gap: 10px;
      cursor: pointer;
      color: inherit;
      transition: box-shadow var(--motion-state) var(--ease-standard);
    }
    .tile:focus-visible {
      outline: none;
      box-shadow: var(--focus-ring);
    }
    .glyph {
      flex: none;
      width: 26px;
      display: grid;
      place-items: center;
      color: var(--glyph, var(--idle-fg));
    }
    .text {
      min-width: 0;
      display: flex;
      flex-direction: column;
      gap: 2px;
    }
    .name {
      font: var(--text-widget-title);
      font-weight: 700;
      line-height: 1.15;
      color: var(--text-primary);
      overflow: hidden;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
    }
    .sub {
      font: var(--text-secondary-state);
      color: var(--text-secondary);
      font-variant-numeric: tabular-nums;
      overflow: hidden;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
    }
    :host([data-unavailable="true"]) .tile {
      opacity: 0.72;
      cursor: default;
    }
  `;
ei = Un([
  b("hd-widget-metrictile")
], ei);
var Jn = Object.defineProperty, $n = Object.getOwnPropertyDescriptor, Pe = (t, e, i, a) => {
  for (var s = a > 1 ? void 0 : a ? $n(e, i) : e, n = t.length - 1, r; n >= 0; n--)
    (r = t[n]) && (s = (a ? r(e, i, s) : r(s)) || s);
  return a && s && Jn(e, i, s), s;
};
let At = class extends M {
  constructor() {
    super(...arguments), this._import = 0, this._export = 0, this._ready = !1, this._timer = 0;
  }
  get _opts() {
    return this.config.options ?? {};
  }
  // Periodic history, not live state — never re-render on meter ticks.
  relevantEntityIds() {
    return [];
  }
  hasDetail() {
    return !1;
  }
  connectedCallback() {
    super.connectedCallback(), this._timer = window.setInterval(() => void this._fetch(), 300 * 1e3);
  }
  disconnectedCallback() {
    super.disconnectedCallback(), window.clearInterval(this._timer);
  }
  updated() {
    this._ready || this._fetch();
  }
  _sum(t) {
    return (t ?? []).reduce((e, i) => e + (i.change || 0), 0);
  }
  async _fetch() {
    if (!this.hass?.connected) return;
    const t = this._opts.importEnergy, e = this._opts.exportEnergy, i = [t, e].filter((a) => typeof a == "string");
    if (i.length)
      try {
        const a = await Ba(this.hass, i, "day", Ra("day", 1));
        this._import = t ? this._sum(a[t]) : 0, this._export = e ? this._sum(a[e]) : 0, this._ready = !0;
      } catch {
      }
  }
  _term(t, e, i, a) {
    return o`<div class="term">
      <span class="num" style=${`--n:${a}`}><b>${A(t)}</b><span class="u">${e}</span></span>
      <span class="lbl">${i}</span>
    </div>`;
  }
  renderContent() {
    const t = this._import - this._export, e = !this._ready;
    return o`
      <h2 class="title">${this.config.name ?? "Electricity Total"}</h2>
      <div class="card" style=${e ? "opacity:0.6" : ""}>
        <span class="lead"><hd-icon icon="mdi:flash" .size=${26}></hd-icon></span>
        ${this._term(this._import, "kWh", "Imported", "var(--accent)")}
        <span class="op">−</span>
        ${this._term(this._export, "kWh", "Exported", "var(--state-eco)")}
        <span class="op">=</span>
        ${this._term(t, "kWh", "Total", "var(--accent)")}
        ${d}
      </div>
    `;
  }
};
At.styles = y`
    :host {
      display: block;
    }
    .title {
      margin: 0 0 12px 2px;
      font: var(--text-widget-title);
      font-weight: 700;
      font-size: 20px;
      color: var(--text-primary);
    }
    .card {
      background: var(--surface);
      border-radius: var(--radius-widget);
      box-shadow: var(--shadow-widget);
      padding: 20px 22px;
      display: flex;
      align-items: center;
      gap: 10px;
      overflow-x: auto;
    }
    .lead {
      flex: none;
      display: grid;
      place-items: center;
      color: var(--accent);
      margin-right: 4px;
    }
    .term {
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      gap: 2px;
      min-width: 0;
    }
    .num {
      display: flex;
      align-items: baseline;
      gap: 5px;
      font-variant-numeric: tabular-nums;
      white-space: nowrap;
    }
    .num b {
      font: 700 clamp(24px, 7vw, 34px) / 1.05 var(--font-sans);
      color: var(--n, var(--text-primary));
    }
    .num .u {
      font: var(--text-secondary-state);
      color: var(--text-tertiary);
    }
    .lbl {
      font: var(--text-meta);
      color: var(--text-tertiary);
    }
    .op {
      flex: none;
      font: var(--text-value);
      color: var(--text-tertiary);
      padding: 0 6px 14px;
      align-self: center;
    }
  `;
Pe([
  x()
], At.prototype, "_import", 2);
Pe([
  x()
], At.prototype, "_export", 2);
Pe([
  x()
], At.prototype, "_ready", 2);
At = Pe([
  b("hd-widget-electricitytotal")
], At);
var jn = Object.defineProperty, qn = Object.getOwnPropertyDescriptor, Te = (t, e, i, a) => {
  for (var s = a > 1 ? void 0 : a ? qn(e, i) : e, n = t.length - 1, r; n >= 0; n--)
    (r = t[n]) && (s = (a ? r(e, i, s) : r(s)) || s);
  return a && s && jn(e, i, s), s;
};
let ii = class extends M {
  constructor() {
    super(...arguments), this._debounce = 0;
  }
  _setPct(t, e) {
    window.clearTimeout(this._debounce);
    const i = () => this.entityId && this.callService(ws(this.entityId, t), { errorVerb: "set speed for" });
    e ? i() : this._debounce = window.setTimeout(i, 200);
  }
  renderContent() {
    const t = this.vm, e = cs(t.stateObj), i = this.currentSize, a = i === "1x2", s = e.speed && (i === "2x1" || i === "1x2") && t.active, n = t.stateObj?.attributes.percentage ?? 0;
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
ii.styles = y`
    .vert {
      flex: 1;
      min-height: 120px;
    }
  `;
ii = Te([
  b("hd-widget-fan")
], ii);
let we = class extends M {
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
we.styles = y`
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
Te([
  x()
], we.prototype, "_cacheBust", 2);
we = Te([
  b("hd-widget-camera")
], we);
let ai = class extends M {
  async _call(t, e) {
    !this.entityId || !this.hass || e && !await Yt(this, { title: `${k(t.replace("alarm_", "").replace("_", " "))}?`, confirmLabel: "Confirm", destructive: t === "alarm_disarm" }) || this.callService(
      { domain: "alarm_control_panel", service: t, data: { entity_id: this.entityId } },
      { errorVerb: "update" }
    );
  }
  renderContent() {
    const t = this.vm, e = t.rawState, i = e === "triggered" ? "alert" : e.startsWith("armed") ? "warn" : e === "disarmed" ? "eco" : "accent", a = this.currentSize, s = e !== "disarmed";
    return o`<hd-widget-frame
      .icon=${e === "triggered" ? "mdi:shield-alert" : s ? "mdi:shield-home" : "mdi:shield-off"}
      .name=${t.name}
      .stateText=${k(e.replace("_", " "))}
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
ai.styles = y`
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
ai = Te([
  b("hd-widget-alarm")
], ai);
const Wn = {
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
  metrictile: "hd-widget-metrictile",
  electricitytotal: "hd-widget-electricitytotal",
  alarm: "hd-widget-alarm",
  action: "hd-widget-action"
};
function Kn(t) {
  return Wn[t] ?? "hd-widget-sensor";
}
function Za(t, e, i, a, s = "row") {
  try {
    const { colSpan: n, rowSpan: r } = sa(e, i), c = ts(Kn(t.type)), l = `grid-column: span ${n}; grid-row: span ${r};`;
    return is`<${c}
      class="cell"
      style=${l}
      .hass=${a}
      .config=${t}
      .currentSize=${e}
      .layout=${s}
    ></${c}>`;
  } catch (n) {
    return console.error(`[widget-cell] widget "${t?.id ?? t?.type}" failed to render:`, n), Nn(t, e, i);
  }
}
function Nn(t, e, i) {
  let a = 1, s = 1;
  try {
    ({ colSpan: a, rowSpan: s } = sa(e, i));
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
const Xn = 960, Yn = 720, Gn = "data:image/webp;base64,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";
var tr = Object.defineProperty, er = Object.getOwnPropertyDescriptor, De = (t, e, i, a) => {
  for (var s = a > 1 ? void 0 : a ? er(e, i) : e, n = t.length - 1, r; n >= 0; n--)
    (r = t[n]) && (s = (a ? r(e, i, s) : r(s)) || s);
  return a && s && tr(e, i, s), s;
};
const ir = "/local/home-dashboard/flows", Zt = 113, ar = 30, Qt = {
  solar: "solar-generating",
  grid: "grid-exporting",
  home: "home-consuming",
  ev: "ev-charging"
};
class sr {
  constructor(e, i) {
    this.base = e, this.total = i, this.frames = [], this.started = !1, this.loaded = 0;
  }
  start() {
    if (!this.started) {
      this.started = !0;
      for (let e = 0; e < this.total; e++) {
        const i = new Image();
        i.decoding = "async", i.onload = () => {
          this.loaded++;
        }, i.src = `${this.base}.${e}.webp`, this.frames[e] = i;
      }
    }
  }
  /** The frame image if it has decoded, else null (skip drawing this tick). */
  frame(e) {
    const i = this.frames[e];
    return i && i.complete && i.naturalWidth > 0 ? i : null;
  }
}
let Lt = class extends H {
  constructor() {
    super(...arguments), this._seqs = /* @__PURE__ */ new Map(), this._active = [], this._raf = 0, this._running = !1, this._reduce = !1;
  }
  connectedCallback() {
    super.connectedCallback(), this._reduce = typeof window < "u" && window.matchMedia?.("(prefers-reduced-motion: reduce)").matches === !0;
  }
  disconnectedCallback() {
    super.disconnectedCallback(), this._stopLoop(), this._ro?.disconnect();
  }
  firstUpdated() {
    const t = this.renderRoot.querySelector(".house");
    t && (this._ro = new ResizeObserver(() => this._resize()), this._ro.observe(t)), this._resize(), this._computeActive(), this._syncLoop();
  }
  updated(t) {
    (t.has("hass") || t.has("options")) && (this._computeActive(), this._syncLoop());
  }
  // ---- live state → active sequences -------------------------------------
  _watts(t) {
    return t ? ye(this.hass?.states[t]) : null;
  }
  _num(t) {
    if (!t) return null;
    const e = Number(this.hass?.states[t]?.state);
    return Number.isFinite(e) ? e : null;
  }
  _computeActive() {
    const t = this.options, e = this._watts(t?.gridPower) ?? 0, i = this._watts(t?.solarPower) ?? 0, a = this._watts(t?.carPower) ?? 0, s = t?.carConnected ? this.hass?.states[t.carConnected]?.state === "on" : !1, n = i + e - a, r = [];
    i > P && r.push({ dir: Qt.solar, reverse: !1 }), e < -P ? r.push({ dir: Qt.grid, reverse: !1 }) : e > P && r.push({ dir: Qt.grid, reverse: !0 }), n > P && r.push({ dir: Qt.home, reverse: !1 }), s && a > P && r.push({ dir: Qt.ev, reverse: !1 }), this._active = r;
    for (const c of r)
      this._seqs.has(c.dir) || this._seqs.set(c.dir, new sr(`${ir}/${c.dir}/${c.dir}`, Zt)), this._seqs.get(c.dir).start();
  }
  // ---- animation loop -----------------------------------------------------
  _syncLoop() {
    if (!this._canvas) return;
    if (this._reduce) {
      this._stopLoop(), this._drawFrame(Math.floor(Zt * 0.5));
      return;
    }
    const t = this._active.length > 0;
    t && !this._running ? (this._running = !0, this._raf = requestAnimationFrame((e) => this._tick(e))) : !t && this._running && (this._stopLoop(), this._clear());
  }
  _stopLoop() {
    this._running = !1, cancelAnimationFrame(this._raf);
  }
  _tick(t) {
    if (!this._running) return;
    const e = Math.floor(t / 1e3 * ar) % Zt;
    this._drawFrame(e), this._raf = requestAnimationFrame((i) => this._tick(i));
  }
  // ---- canvas -------------------------------------------------------------
  _resize() {
    const t = this._canvas, e = this.renderRoot.querySelector(".house");
    if (!t || !e) return;
    const i = e.clientWidth, a = e.clientHeight;
    if (!i || !a) return;
    const s = Math.min(window.devicePixelRatio || 1, 2);
    t.width = Math.round(i * s), t.height = Math.round(a * s), this._reduce && this._drawFrame(Math.floor(Zt * 0.5));
  }
  _clear() {
    const t = this._canvas?.getContext("2d");
    this._canvas && t && t.clearRect(0, 0, this._canvas.width, this._canvas.height);
  }
  _drawFrame(t) {
    const e = this._canvas, i = e?.getContext("2d");
    if (!(!e || !i)) {
      i.clearRect(0, 0, e.width, e.height), i.imageSmoothingEnabled = !0, i.imageSmoothingQuality = "high";
      for (const a of this._active) {
        const s = a.reverse ? Zt - 1 - t : t, n = this._seqs.get(a.dir)?.frame(s);
        n && i.drawImage(n, 0, 0, e.width, e.height);
      }
    }
  }
  // ---- markup -------------------------------------------------------------
  _stat(t, e) {
    return o`<div class="stat">
      <span class="v">${t == null ? "—" : A(t)}<span class="u">kWh</span></span>
      <span class="l">${e}</span>
    </div>`;
  }
  render() {
    const t = this.options, e = this._num(t?.solar), i = this._num(t?.grid), a = i != null && e != null ? i + e : null;
    return o`
      <div class="hero">
        <div class="inner">
          <div class="bar">
            <span class="pill">
              ${t?.label ?? "Today"}
              <hd-icon icon="mdi:calendar-blank" .size=${18}></hd-icon>
            </span>
          </div>
          <div class="stats">
            ${this._stat(i, "Grid")} ${this._stat(e, "Solar Panels")}
            ${this._stat(a, "Home")}
          </div>
          <div class="house">
            <img src=${Gn} alt="" aria-hidden="true" />
            <canvas class="flows" aria-hidden="true"></canvas>
          </div>
        </div>
      </div>
    `;
  }
};
Lt.styles = y`
    :host {
      display: block;
    }
    .hero {
      position: relative;
      overflow: hidden;
      border-radius: 0 0 28px 28px;
      background: linear-gradient(
        180deg,
        #2f6bff 0%,
        #4f86ff 22%,
        #9dc0ff 46%,
        #e7eefb 70%,
        var(--canvas) 100%
      );
      padding: 18px clamp(16px, 4vw, 40px) 8px;
    }
    .inner {
      max-width: 1000px;
      margin: 0 auto;
    }
    .bar {
      display: flex;
      justify-content: flex-end;
      margin-bottom: 6px;
    }
    .pill {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      padding: 8px 14px;
      border-radius: var(--radius-pill);
      background: rgba(255, 255, 255, 0.22);
      color: #fff;
      font: var(--text-widget-title);
      font-weight: 600;
      backdrop-filter: blur(6px);
      -webkit-backdrop-filter: blur(6px);
    }
    .stats {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 4px;
      color: #fff;
      position: relative;
      z-index: 2;
    }
    .stat {
      display: flex;
      flex-direction: column;
      align-items: center;
      text-align: center;
      padding: 4px 6px 0;
      position: relative;
    }
    .stat .v {
      font: 700 clamp(20px, 5.5vw, 30px) / 1.05 var(--font-sans);
      font-variant-numeric: tabular-nums;
      display: flex;
      align-items: baseline;
      gap: 5px;
    }
    .stat .v .u {
      font-size: 0.5em;
      font-weight: 600;
      opacity: 0.9;
    }
    .stat .l {
      font: var(--text-secondary-state);
      opacity: 0.82;
      margin-top: 2px;
    }
    .stat::after {
      content: "";
      position: absolute;
      top: 100%;
      width: 1px;
      height: clamp(24px, 8vw, 52px);
      background: linear-gradient(180deg, rgba(255, 255, 255, 0.5), rgba(255, 255, 255, 0));
    }
    .house {
      position: relative;
      width: 100%;
      max-width: 820px;
      margin: -4px auto 0;
      aspect-ratio: ${Xn} / ${Yn};
    }
    .house img {
      display: block;
      width: 100%;
      height: 100%;
      object-fit: contain;
      -webkit-user-drag: none;
      user-select: none;
    }
    canvas.flows {
      position: absolute;
      inset: 0;
      width: 100%;
      height: 100%;
      pointer-events: none;
    }
  `;
De([
  p({ attribute: !1 })
], Lt.prototype, "hass", 2);
De([
  p({ attribute: !1 })
], Lt.prototype, "options", 2);
De([
  Le("canvas")
], Lt.prototype, "_canvas", 2);
Lt = De([
  b("hd-energy-hero")
], Lt);
var nr = Object.defineProperty, rr = Object.getOwnPropertyDescriptor, Oe = (t, e, i, a) => {
  for (var s = a > 1 ? void 0 : a ? rr(e, i) : e, n = t.length - 1, r; n >= 0; n--)
    (r = t[n]) && (s = (a ? r(e, i, s) : r(s)) || s);
  return a && s && nr(e, i, s), s;
};
let Ht = class extends H {
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
    const t = this.view, e = aa(this._width), i = `--pad:${e.pad}px`, a = t?.hero ? o`<hd-energy-hero .hass=${this.hass} .options=${t.hero}></hd-energy-hero>` : d;
    if (!t || t.widgets.length === 0 && !t.hero)
      return o`<div class="empty">
        <hd-icon icon="mdi:view-dashboard-outline" .size=${40}></hd-icon>
        <h3>No widgets yet</h3>
        <p>Add widgets to this view in <code>dashboard.config.ts</code>.</p>
      </div>`;
    const s = Y1(t.widgets);
    return o`
      ${a}
      <div class="stack" style=${i}>
        ${ia(
      s,
      (n) => n.id,
      (n) => Za(n, hi(n, e.bucket), 1, this.hass, "row")
    )}
      </div>
      ${d}
    `;
  }
};
Ht.styles = y`
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
Oe([
  p({ attribute: !1 })
], Ht.prototype, "hass", 2);
Oe([
  p({ attribute: !1 })
], Ht.prototype, "view", 2);
Oe([
  x()
], Ht.prototype, "_width", 2);
Ht = Oe([
  b("hd-view-grid")
], Ht);
const or = [
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
function cr(t) {
  const [e, i, a] = t.map((h) => h / 255), s = Math.max(e, i, a), n = Math.min(e, i, a), r = s - n;
  let c = 0;
  r !== 0 && (s === e ? c = (i - a) / r % 6 : s === i ? c = (a - e) / r + 2 : c = (e - i) / r + 4, c = c * 60, c < 0 && (c += 360));
  const l = s === 0 ? 0 : r / s * 100;
  return [Math.round(c), Math.round(l)];
}
function lr(t, e) {
  const i = oa(e), a = e.state === "on", s = a ? Math.round((e.attributes.brightness ?? 255) / 2.55) : 0, n = e.attributes.min_color_temp_kelvin ?? 2200, r = e.attributes.max_color_temp_kelvin ?? 6500, c = e.attributes.color_temp_kelvin ?? Math.round((n + r) / 2), l = e.attributes.effect_list?.filter((g) => g && g !== "None") ?? [], h = e.attributes.hs_color, u = e.attributes.rgb_color, [m, f] = h ? [h[0], h[1]] : u ? cr(u) : [0, 0];
  return o`
    <div class="d-section d-row-between">
      <span class="d-label">Power</span>
      <hd-toggle
        .checked=${a}
        label="Toggle light"
        @hd-toggle=${() => t.call(K(t.entityId), "toggle")}
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
            @hd-change=${(g) => t.call(qe(t.entityId, g.detail.value), "dim")}
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
            @hd-change=${(g) => t.call(ft(t.entityId, { colorTempKelvin: g.detail.value }), "set color of")}
          ></hd-slider>
        </div>` : d}

    ${i.color ? o`<div class="d-section">
          <span class="d-label">Color</span>
          <div class="color-wheel-wrap">
            <hd-color-wheel
              .hue=${m}
              .sat=${f}
              .disabled=${!a}
              @hd-color=${(g) => t.call(ft(t.entityId, { hsColor: [g.detail.hue, g.detail.sat] }), "set color of")}
            ></hd-color-wheel>
          </div>
          <div class="swatches">
            ${or.map(
    ([g, v]) => o`<button
                class="swatch"
                style=${`background:rgb(${v[0]},${v[1]},${v[2]})`}
                aria-label=${g}
                ?disabled=${!a}
                @click=${() => t.call(ft(t.entityId, { rgbColor: v }), "set color of")}
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
                @click=${() => t.call(ft(t.entityId, { effect: g }), "set effect of")}
              >
                ${k(g)}
              </button>`
  )}
          </div>
        </div>` : d}
  `;
}
function dr(t, e) {
  const i = la(e), a = e.state === "off", s = e.attributes.temperature ?? 20, n = e.attributes.current_temperature, r = e.attributes.target_temp_step ?? 0.5, c = e.attributes.hvac_modes ?? [], l = e.attributes.fan_modes ?? [], h = e.attributes.swing_modes ?? [], u = e.attributes.preset_modes ?? [], m = (t.config?.options?.switches ?? []).filter(
    (v) => t.hass.states[v.entity]
  ), f = (v) => {
    const w = e.attributes.min_temp ?? 7, S = e.attributes.max_temp ?? 35, D = Math.min(S, Math.max(w, s + v * r));
    t.call(ga(t.entityId, Number(D.toFixed(1))), "set temperature for");
  }, g = (v) => v.map((w) => ({ value: w, label: k(w) }));
  return o`
    ${i.targetTemp ? o`<div class="d-section climate-hero">
          <hd-icon-button icon="mdi:minus" label="Lower" variant="soft" .disabled=${a} @click=${() => f(-1)}></hd-icon-button>
          <div class="climate-target">
            <span class="big">${a ? "—" : `${A(s)}°`}</span>
            ${n != null ? o`<span class="sub">Now ${A(n)}°</span>` : d}
          </div>
          <hd-icon-button icon="mdi:plus" label="Raise" variant="soft" .disabled=${a} @click=${() => f(1)}></hd-icon-button>
        </div>` : d}

    ${c.length > 1 ? o`<div class="d-section">
          <span class="d-label">Mode</span>
          <hd-segmented .options=${g(c)} .value=${e.state} label="Mode"
            @hd-select=${(v) => t.call(fa(t.entityId, v.detail.value), "set mode for")}></hd-segmented>
        </div>` : d}
    ${i.fanMode && l.length ? o`<div class="d-section">
          <span class="d-label">Fan</span>
          <hd-segmented .options=${g(l)} .value=${e.attributes.fan_mode ?? ""} label="Fan mode"
            @hd-select=${(v) => t.call(ls(t.entityId, v.detail.value), "set fan for")}></hd-segmented>
        </div>` : d}
    ${i.swingMode && h.length ? o`<div class="d-section">
          <span class="d-label">Swing</span>
          <hd-segmented .options=${g(h)} .value=${e.attributes.swing_mode ?? ""} label="Swing mode"
            @hd-select=${(v) => t.call(hs(t.entityId, v.detail.value), "set swing for")}></hd-segmented>
        </div>` : d}
    ${i.presetMode && u.length ? o`<div class="d-section">
          <span class="d-label">Preset</span>
          <hd-segmented .options=${g(u)} .value=${e.attributes.preset_mode ?? ""} label="Preset"
            @hd-select=${(v) => t.call(ds(t.entityId, v.detail.value), "set preset for")}></hd-segmented>
        </div>` : d}

    ${m.map((v) => {
    const w = t.hass.states[v.entity].state === "on";
    return o`<div class="d-section d-row-between">
        <span class="d-label">${v.name}</span>
        <hd-toggle
          .checked=${w}
          label=${v.name}
          @hd-toggle=${() => t.call(K(v.entity), `toggle ${v.name.toLowerCase()}`)}
        ></hd-toggle>
      </div>`;
  })}
  `;
}
function hr(t, e) {
  const i = da(e), a = e.attributes.entity_picture, s = e.attributes.media_title, n = e.attributes.app_name, r = e.attributes.volume_level ?? 0, c = e.attributes.is_volume_muted ?? !1, l = e.attributes.source_list ?? [], h = e.attributes.sound_mode_list ?? [], u = e.state === "off", m = i.selectSource && ln(l), { featured: f, rest: g } = m ? un(l) : { featured: [], rest: l }, v = async (V) => {
    u && await t.call(pa(t.entityId), "turn on"), await t.call(ms(t.entityId, V), m ? "launch" : "change source of");
  }, w = !u && e.state !== "idle" && e.state !== "standby", S = n ? fe(n) : void 0, D = Ne(e);
  return o`
    ${a ? o`<div class="media-art" style=${`background-image:url("${a}")`}></div>` : w && (S || n) ? o`<div class="media-art media-art-fallback">
            <hd-icon icon=${S ?? "mdi:television-classic"} .size=${56}></hd-icon>
            ${n ? o`<span>${n}</span>` : d}
          </div>` : d}
    <div class="media-meta">
      <div class="d-value">${s ?? n ?? dt(t.hass, e)}</div>
      ${n && s ? o`<div class="d-sub">${n}</div>` : d}
    </div>
    ${D ? o`<div class="d-section media-progress">
          <div class="media-progress-bar"><span style=${`width:${D.pct}%`}></span></div>
          <div class="media-progress-time"><span>${D.elapsed}</span><span>${D.total}</span></div>
        </div>` : d}
    <div class="d-section media-transport">
      ${i.power ? o`<hd-icon-button icon="mdi:power" label=${u ? "Turn on" : "Turn off"} variant=${u ? "soft" : "filled"} @click=${() => t.call(K(t.entityId), u ? "turn on" : "turn off")}></hd-icon-button>` : d}
      ${i.previous ? o`<hd-icon-button icon="mdi:skip-previous" label="Previous" variant="soft" .disabled=${u} @click=${() => t.call(Aa(t.entityId), "skip")}></hd-icon-button>` : d}
      <hd-icon-button icon=${e.state === "playing" ? "mdi:pause" : "mdi:play"} label="Play or pause" variant="filled" .disabled=${u} @click=${() => t.call(Ca(t.entityId), "control")}></hd-icon-button>
      ${i.next ? o`<hd-icon-button icon="mdi:skip-next" label="Next" variant="soft" .disabled=${u} @click=${() => t.call(xa(t.entityId), "skip")}></hd-icon-button>` : d}
    </div>
    ${i.volumeSet ? o`<div class="d-section">
          <span class="d-label">Volume</span>
          <div class="vol-row">
            ${i.mute ? o`<hd-icon-button icon=${c ? "mdi:volume-off" : "mdi:volume-high"} label="Mute" variant="soft" @click=${() => t.call(ps(t.entityId, !c), "mute")}></hd-icon-button>` : d}
            <hd-slider style="flex:1" .value=${Math.round(r * 100)} .valueText=${`${Math.round(r * 100)}%`} label="Volume"
              @hd-change=${(V) => t.call(us(t.entityId, V.detail.value / 100), "set volume of")}></hd-slider>
          </div>
        </div>` : d}
    ${i.selectSoundMode && h.length ? o`<div class="d-section">
          <span class="d-label">Sound mode</span>
          <div class="chips">
            ${h.map(
    (V) => o`<button class="chip ${e.attributes.sound_mode === V ? "active" : ""}" @click=${() => t.call(gs(t.entityId, V), "set sound mode of")}>${V}</button>`
  )}
          </div>
        </div>` : d}
    ${f.length ? o`<div class="d-section">
          <span class="d-label">Apps</span>
          <div class="media-apps big-buttons">
            ${f.map(
    (V) => o`<button
                class="bigbtn app ${e.attributes.source === V.source ? "active" : ""}"
                @click=${() => v(V.source)}
              >
                <hd-icon icon=${V.icon} .size=${26}></hd-icon><span>${V.label}</span>
              </button>`
  )}
          </div>
        </div>` : d}
    ${i.selectSource && g.length ? o`<div class="d-section">
          <span class="d-label">${m ? f.length ? "More apps" : "Apps" : "Source"}</span>
          <div class="chips">
            ${g.slice(0, 24).map((V) => {
    const fi = e.attributes.source === V, ut = m ? fe(V) ?? "mdi:apps" : void 0;
    return o`<button
                class="chip ${ut ? "with-icon" : ""} ${fi ? "active" : ""}"
                @click=${() => v(V)}
              >
                ${ut ? o`<hd-icon icon=${ut} .size=${18}></hd-icon>` : d}<span>${V}</span>
              </button>`;
  })}
          </div>
        </div>` : d}
  `;
}
function ur(t, e) {
  const i = ca(e), a = e.attributes.current_position ?? (e.state === "open" ? 100 : 0);
  return o`
    ${i.setPosition ? o`<div class="d-section">
          <span class="d-label">Position</span>
          <hd-slider .value=${a} .valueText=${`${Math.round(a)}% open`} label="Position"
            @hd-change=${(s) => t.call(wa(t.entityId, s.detail.value), "move")}></hd-slider>
        </div>` : d}
    <div class="d-section big-buttons">
      ${i.open ? o`<button class="bigbtn" @click=${() => t.call(va(t.entityId), "open")}><hd-icon icon="mdi:arrow-up" .size=${20}></hd-icon>Open</button>` : d}
      ${i.stop ? o`<button class="bigbtn" @click=${() => t.call(ya(t.entityId), "stop")}><hd-icon icon="mdi:stop" .size=${20}></hd-icon>Stop</button>` : d}
      ${i.close ? o`<button class="bigbtn" @click=${() => t.call(ba(t.entityId), "close")}><hd-icon icon="mdi:arrow-down" .size=${20}></hd-icon>Close</button>` : d}
    </div>
  `;
}
function pr(t, e) {
  const i = e.state === "locked";
  return o`
    <div class="d-section big-buttons">
      <button class="bigbtn ${i ? "active" : ""}" @click=${() => t.call(Ma(t.entityId), "lock")}>
        <hd-icon icon="mdi:lock" .size=${20}></hd-icon>Lock
      </button>
      <button class="bigbtn ${i ? "" : "active"}" @click=${async () => {
    await Yt(t.host, { title: `Unlock ${e.attributes.friendly_name ?? "lock"}?`, confirmLabel: "Unlock", destructive: !0, icon: "mdi:lock-open-variant" }) && t.call(Va(t.entityId), "unlock");
  }}>
        <hd-icon icon="mdi:lock-open-variant" .size=${20}></hd-icon>Unlock
      </button>
    </div>
    <div class="d-meta">Last changed ${Ve(e.last_changed)}</div>
  `;
}
function mr(t, e) {
  const i = ha(e), a = (e.attributes.fan_speed_list ?? []).filter((l) => !["off", "custom"].includes(l)), s = Ut(t.hass, t.entityId), n = s.battery ?? e.attributes.battery_level, r = e.state === "cleaning", c = [];
  return typeof s.progress == "number" && r && c.push(["Progress", `${Math.round(s.progress)}%`]), typeof s.area == "number" && s.area > 0 && c.push(["Area", `${A(s.area)} m²`]), typeof s.cleaningTime == "number" && s.cleaningTime > 0 && c.push(["Time", `${Math.round(s.cleaningTime)} min`]), o`
    <div class="d-section big-buttons">
      <button class="bigbtn" @click=${() => t.call(de(t.entityId), "start")}><hd-icon icon="mdi:play" .size=${20}></hd-icon>Start</button>
      ${i.pause ? o`<button class="bigbtn" @click=${() => t.call(We(t.entityId), "pause")}><hd-icon icon="mdi:pause" .size=${20}></hd-icon>Pause</button>` : d}
      ${i.returnHome ? o`<button class="bigbtn" @click=${() => t.call(he(t.entityId), "dock")}><hd-icon icon="mdi:home-import-outline" .size=${20}></hd-icon>Dock</button>` : d}
      ${i.locate ? o`<button class="bigbtn" @click=${() => t.call(Ha(t.entityId), "locate")}><hd-icon icon="mdi:map-marker-radius" .size=${20}></hd-icon>Locate</button>` : d}
    </div>
    ${a.length ? o`<div class="d-section">
          <span class="d-label">Suction</span>
          <hd-segmented .options=${a.map((l) => ({ value: l, label: k(l) }))} .value=${e.attributes.fan_speed ?? ""}
            @hd-select=${(l) => t.call(La(t.entityId, l.detail.value), "set suction for")}></hd-segmented>
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
    const h = l.hoursLeft <= Ms;
    return o`<div class="d-cell">
                <span class="k">${l.label}</span>
                <span class="v" style=${h ? "color:var(--state-warn)" : ""}>${Math.round(l.hoursLeft)} h${h ? " · replace" : ""}</span>
              </div>`;
  })}
          </div>
        </div>` : d}
    ${n != null ? o`<div class="d-meta">Battery ${Math.round(n)}%${s.status ? ` · ${k(s.status.replace(/_/g, " "))}` : ""}</div>` : d}
  `;
}
function gr(t, e) {
  const i = Number(e.state), a = Number.isFinite(i), s = t.trend, n = s.length > 1 ? `Min ${A(Math.min(...s))}, max ${A(Math.max(...s))}, latest ${A(s[s.length - 1])}` : "";
  return o`
    <div class="d-value big">${dt(t.hass, e)}</div>
    ${a && s.length > 1 ? o`<div class="d-section">
          <span class="d-label">Last 24 hours</span>
          <div class="detail-trend"><hd-trend .points=${s} .summary=${n}></hd-trend></div>
          <div class="d-meta">${n}</div>
        </div>` : d}
    ${Qa(t, e)}
  `;
}
function fr(t, e) {
  const i = e.attributes, a = [];
  return i.temperature != null && a.push(["Temperature", `${A(i.temperature)}°`]), i.humidity != null && a.push(["Humidity", `${Math.round(i.humidity)}%`]), i.wind_speed != null && a.push(["Wind", `${A(i.wind_speed)} ${i.wind_speed_unit ?? ""}`]), i.pressure != null && a.push(["Pressure", `${A(i.pressure)} ${i.pressure_unit ?? ""}`]), o`
    <div class="d-value big">${k(e.state)}</div>
    <div class="d-grid">
      ${a.map(([s, n]) => o`<div class="d-cell"><span class="k">${s}</span><span class="v">${n}</span></div>`)}
    </div>
    ${t.forecast.length ? o`<div class="d-section">
          <span class="d-label">Forecast</span>
          ${t.forecast.map((s) => {
    const n = new Date(s.datetime), r = Number.isNaN(n.getTime()) ? "" : n.toLocaleDateString(void 0, { weekday: "long" });
    return o`<div class="fc-row">
              <span class="fc-day">${r}</span>
              <hd-icon .icon=${Cr(s.condition ?? "")} .size=${20}></hd-icon>
              <span class="fc-temp">${s.temperature != null ? `${Math.round(s.temperature)}°` : ""}${s.templow != null ? ` / ${Math.round(s.templow)}°` : ""}</span>
            </div>`;
  })}
        </div>` : d}
  `;
}
function vr(t) {
  const e = t.config?.options ?? {}, i = (s) => {
    if (!s) return null;
    const n = t.hass.states[s];
    return n || null;
  }, a = Object.entries(e).map(([s, n]) => ({ k: s, st: i(n) })).filter((s) => s.st);
  return o`
    <div class="d-section">
      <span class="d-label">Live values</span>
      <div class="d-grid">
        ${a.map((s) => o`<div class="d-cell"><span class="k">${k(s.k)}</span><span class="v">${dt(t.hass, s.st)}</span></div>`)}
      </div>
    </div>
    ${t.trend.length > 1 ? o`<div class="d-section">
          <span class="d-label">Grid power — last 24 hours</span>
          <div class="detail-trend"><hd-trend .points=${t.trend} .summary=${"24 hour grid power"}></hd-trend></div>
        </div>` : d}
  `;
}
function br(t) {
  const e = t.config?.options ?? {}, i = Oa(t.hass, e), a = (s, n) => {
    const r = n ? t.hass.states[n] : void 0;
    return r ? o`<div class="d-cell"><span class="k">${s}</span><span class="v">${dt(t.hass, r)}</span></div>` : d;
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
function yr(t) {
  const e = t.config?.options ?? {}, i = za(t.hass, e), a = i.tone === "eco" ? "var(--state-eco)" : i.tone === "accent" ? "var(--accent)" : "var(--text-secondary)", s = (r, c) => c != null ? o`<div class="d-cell"><span class="k">${r}</span><span class="v">${c}</span></div>` : d, n = (r, c, l, h) => {
    const u = r ? t.hass.states[r] : void 0;
    if (!r || !u) return d;
    const m = Number(u.state), f = u.attributes.min ?? h.min, g = u.attributes.max ?? h.max, v = u.attributes.step ?? h.step;
    return o`<div class="d-section">
      <span class="d-label">${c}</span>
      <hd-slider
        .value=${Number.isFinite(m) ? m : f}
        .min=${f}
        .max=${g}
        .step=${v}
        .valueText=${Number.isFinite(m) ? l(m) : "—"}
        label=${c}
        @hd-change=${(w) => t.call(ys(r, w.detail.value), `set ${c.toLowerCase()}`)}
      ></hd-slider>
    </div>`;
  };
  return o`
    <div class="d-section d-row-between">
      <span class="d-label">Solar charging</span>
      <hd-toggle
        .checked=${i.armed}
        label="Toggle solar charging"
        @hd-toggle=${() => e.master ? t.call(K(e.master), "toggle solar charging") : void 0}
      ></hd-toggle>
    </div>

    <div class="d-section">
      <span class="d-label">Status</span>
      <div class="d-value big" style=${`color:${a}`}>${i.label}</div>
      <div class="d-grid">
        ${s("Battery", i.batteryPct != null ? `${Math.round(i.batteryPct)}%` : null)}
        ${s("Target", i.limitPct != null ? `${Math.round(i.limitPct)}%` : null)}
        ${s("Power", i.powerKw != null ? `${A(i.powerKw)} kW` : null)}
        ${s("Current", i.currentA != null ? `${Math.round(i.currentA)} A` : null)}
        ${s("Rate", i.rateKmh != null ? `${Math.round(i.rateKmh)} km/h` : null)}
        ${s("Session", i.sessionKwh != null ? `${A(i.sessionKwh)} kWh` : null)}
      </div>
    </div>

    ${n(e.startThreshold, "Start above export", (r) => `${Math.abs(Math.round(r))} W export`, { min: -5e3, max: -500, step: 50 })}
    ${n(e.stopThreshold, "Stop above import", (r) => `${Math.round(r)} W import`, { min: 0, max: 2e3, step: 50 })}
    ${n(e.minCurrent, "Min charge current", (r) => `${Math.round(r)} A`, { min: 5, max: 10, step: 1 })}
    ${n(e.deadband, "Current deadband", (r) => `${Math.round(r)} A`, { min: 1, max: 5, step: 1 })}
  `;
}
function wr(t, e) {
  const i = t.entityId.split(".")[0], a = ["switch", "input_boolean", "fan", "light", "humidifier", "siren"].includes(i);
  return o`
    <div class="d-value big">${dt(t.hass, e)}</div>
    ${a ? o`<div class="d-section big-buttons">
          <button class="bigbtn" @click=${() => t.call(pa(t.entityId), "turn on")}>Turn on</button>
          <button class="bigbtn" @click=${() => t.call(ma(t.entityId), "turn off")}>Turn off</button>
        </div>` : d}
    ${Qa(t, e)}
  `;
}
function Qa(t, e) {
  const i = ["device_class", "state_class", "unit_of_measurement"].filter((a) => e.attributes[a] != null);
  return o`<div class="d-grid">
    ${i.map(
    (a) => o`<div class="d-cell"><span class="k">${k(a)}</span><span class="v">${xs(t.hass, e, a)}</span></div>`
  )}
    <div class="d-cell"><span class="k">Last updated</span><span class="v">${Ve(e.last_updated)}</span></div>
  </div>`;
}
function Cr(t) {
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
function xr(t) {
  const e = t.hass.states[t.entityId], i = t.config?.type;
  if (i === "energy") return vr(t);
  if (i === "powerflow") return br(t);
  if (i === "solarcharging") return yr(t);
  if (!e)
    return o`<div class="d-value big">Entity unavailable</div>
      <div class="d-meta">${t.entityId || "No entity configured"} was not found in Home Assistant.</div>`;
  switch (t.entityId.split(".")[0]) {
    case "light":
      return lr(t, e);
    case "climate":
      return dr(t, e);
    case "media_player":
      return hr(t, e);
    case "cover":
      return ur(t, e);
    case "lock":
      return pr(t, e);
    case "vacuum":
      return mr(t, e);
    case "sensor":
      return gr(t, e);
    case "weather":
      return fr(t, e);
    default:
      return wr(t, e);
  }
}
function Ar(t, e) {
  return e?.type === "energy" || e?.type === "powerflow" ? e.options?.gridPower ?? null : t.split(".")[0] === "sensor" ? t : null;
}
function Lr(t) {
  return t.split(".")[0] === "weather";
}
var Hr = Object.defineProperty, Mr = Object.getOwnPropertyDescriptor, ze = (t, e, i, a) => {
  for (var s = a > 1 ? void 0 : a ? Mr(e, i) : e, n = t.length - 1, r; n >= 0; n--)
    (r = t[n]) && (s = (a ? r(e, i, s) : r(s)) || s);
  return a && s && Hr(e, i, s), s;
};
let Mt = class extends H {
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
Mt.styles = y`
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
ze([
  p({ type: Boolean, reflect: !0 })
], Mt.prototype, "checked", 2);
ze([
  p({ type: Boolean, reflect: !0 })
], Mt.prototype, "disabled", 2);
ze([
  p({ type: String })
], Mt.prototype, "label", 2);
Mt = ze([
  b("hd-toggle")
], Mt);
var Vr = Object.defineProperty, kr = Object.getOwnPropertyDescriptor, ht = (t, e, i, a) => {
  for (var s = a > 1 ? void 0 : a ? kr(e, i) : e, n = t.length - 1, r; n >= 0; n--)
    (r = t[n]) && (s = (a ? r(e, i, s) : r(s)) || s);
  return a && s && Vr(e, i, s), s;
};
let $ = class extends H {
  constructor() {
    super(...arguments), this.open = !1, this.entityId = "", this._trend = [], this._forecast = [], this._loadedKey = "", this._call = async (t, e = "update") => {
      if (this.hass)
        try {
          await ua(this.hass, t);
        } catch {
          Kt(this, { message: `Couldn't ${e} ${this._name}`, tone: "alert", icon: "mdi:alert-circle-outline" });
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
    this._loadedKey = t, this._trend.length && (this._trend = []), this._forecast.length && (this._forecast = []), this.entityId.startsWith("light.") && this.hass.states[this.entityId]?.attributes.supported_color_modes?.some((a) => ["hs", "xy", "rgb", "rgbw", "rgbww", "rgbwww"].includes(a)) && Promise.resolve().then(() => Rr);
    const e = Ar(this.entityId, this.config);
    if (e && this.hass.connected) {
      const i = await mi(this.hass, e, 24);
      this._trend = i.map((a) => a.value);
    }
    this.entityId && Lr(this.entityId) && this.hass.connected && await this._loadForecast();
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
    const t = ka(this.hass, this.entityId, this.config), e = {
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
        ${this.open ? xr(e) : d}
      </hd-surface>
    `;
  }
};
$.styles = y`
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
ht([
  p({ attribute: !1 })
], $.prototype, "hass", 2);
ht([
  p({ type: Boolean, reflect: !0 })
], $.prototype, "open", 2);
ht([
  p({ type: String })
], $.prototype, "entityId", 2);
ht([
  p({ attribute: !1 })
], $.prototype, "config", 2);
ht([
  x()
], $.prototype, "_trend", 2);
ht([
  x()
], $.prototype, "_forecast", 2);
$ = ht([
  b("hd-detail")
], $);
var Sr = Object.defineProperty, Er = Object.getOwnPropertyDescriptor, gi = (t, e, i, a) => {
  for (var s = a > 1 ? void 0 : a ? Er(e, i) : e, n = t.length - 1, r; n >= 0; n--)
    (r = t[n]) && (s = (a ? r(e, i, s) : r(s)) || s);
  return a && s && Sr(e, i, s), s;
};
let Xt = class extends H {
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
Xt.styles = y`
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
gi([
  x()
], Xt.prototype, "_open", 2);
gi([
  x()
], Xt.prototype, "_opts", 2);
Xt = gi([
  b("hd-confirm")
], Xt);
var Ir = Object.defineProperty, Pr = Object.getOwnPropertyDescriptor, _a = (t, e, i, a) => {
  for (var s = a > 1 ? void 0 : a ? Pr(e, i) : e, n = t.length - 1, r; n >= 0; n--)
    (r = t[n]) && (s = (a ? r(e, i, s) : r(s)) || s);
  return a && s && Ir(e, i, s), s;
};
let Ce = class extends H {
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
Ce.styles = y`
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
_a([
  x()
], Ce.prototype, "_toasts", 2);
Ce = _a([
  b("hd-toasts")
], Ce);
var Tr = Object.defineProperty, Dr = Object.getOwnPropertyDescriptor, Q = (t, e, i, a) => {
  for (var s = a > 1 ? void 0 : a ? Dr(e, i) : e, n = t.length - 1, r; n >= 0; n--)
    (r = t[n]) && (s = (a ? r(e, i, s) : r(s)) || s);
  return a && s && Tr(e, i, s), s;
};
const qi = "hd-panel-appearance";
let z = class extends H {
  constructor() {
    super(...arguments), this.narrow = !1, this._viewId = "", this._appearance = "auto", this._detailOpen = !1, this._detailEntityId = "", this._onPop = () => this._syncViewFromLocation(), this._onMqlChange = () => this._applyTheme(), this._onWindowError = (t) => {
      const e = t.error;
      `${t.message ?? ""} ${typeof e == "string" ? e : e?.message ?? ""}`.includes("ResizeObserver loop") || console.error("[home-dashboard-panel] uncaught error:", e ?? t.message);
    }, this._onRejection = (t) => console.error("[home-dashboard-panel] unhandled rejection:", t.reason);
  }
  // ---- Lifecycle ---------------------------------------------------------
  connectedCallback() {
    super.connectedCallback(), this._appearance = localStorage.getItem(qi) || "auto", this._mqlDark = window.matchMedia("(prefers-color-scheme: dark)"), this._mqlDark.addEventListener("change", this._onMqlChange), window.addEventListener("popstate", this._onPop), window.addEventListener("error", this._onWindowError), window.addEventListener("unhandledrejection", this._onRejection), this._syncViewFromLocation(), this._applyTheme(), this._applyKiosk();
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
      const t = x1(m1);
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
    const e = A1(this.route, this._base) || this._cfg.config.defaultView, i = this._views.some((a) => a.id === e);
    this._viewId = i ? e : this._cfg.config.defaultView;
  }
  _onNavigate(t) {
    t !== this._viewId && (this._viewId = t, V1(M1(this._base, t, this._cfg.config.defaultView)), this.renderRoot.querySelector(".content")?.scrollTo?.({ top: 0 }));
  }
  // ---- Theme -------------------------------------------------------------
  _resolveDark() {
    return this._appearance === "dark" ? !0 : this._appearance === "light" ? !1 : this.hass?.themes?.darkMode != null ? !!this.hass.themes.darkMode : !!this._mqlDark?.matches;
  }
  _applyTheme() {
    this.setAttribute("data-theme", this._resolveDark() ? "dark" : "light");
  }
  _cycleAppearance() {
    this._appearance = this._appearance === "auto" ? "light" : this._appearance === "light" ? "dark" : "auto", localStorage.setItem(qi, this._appearance), this._applyTheme();
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
z.styles = [
  u1,
  p1,
  y`
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
Q([
  p({ attribute: !1 })
], z.prototype, "hass", 2);
Q([
  p({ type: Boolean })
], z.prototype, "narrow", 2);
Q([
  p({ attribute: !1 })
], z.prototype, "panel", 2);
Q([
  p({ attribute: !1 })
], z.prototype, "route", 2);
Q([
  x()
], z.prototype, "_viewId", 2);
Q([
  x()
], z.prototype, "_appearance", 2);
Q([
  x()
], z.prototype, "_detailOpen", 2);
Q([
  x()
], z.prototype, "_detailEntityId", 2);
Q([
  x()
], z.prototype, "_detailConfig", 2);
Q([
  Le("hd-confirm")
], z.prototype, "_confirm", 2);
Q([
  Le("hd-toasts")
], z.prototype, "_toasts", 2);
z = Q([
  b("home-dashboard-panel")
], z);
var Or = Object.defineProperty, zr = Object.getOwnPropertyDescriptor, Re = (t, e, i, a) => {
  for (var s = a > 1 ? void 0 : a ? zr(e, i) : e, n = t.length - 1, r; n >= 0; n--)
    (r = t[n]) && (s = (a ? r(e, i, s) : r(s)) || s);
  return a && s && Or(e, i, s), s;
};
let ct = class extends H {
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
ct.styles = y`
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
Re([
  p({ type: Number })
], ct.prototype, "hue", 2);
Re([
  p({ type: Number })
], ct.prototype, "sat", 2);
Re([
  p({ type: Boolean, reflect: !0 })
], ct.prototype, "disabled", 2);
ct = Re([
  b("hd-color-wheel")
], ct);
const Rr = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  get HdColorWheel() {
    return ct;
  }
}, Symbol.toStringTag, { value: "Module" }));
export {
  z as HomeDashboardPanel
};
