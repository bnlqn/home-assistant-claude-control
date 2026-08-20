//#region \0rolldown/runtime.js
var e = Object.defineProperty, t = (e, t, n) => () => {
	if (n) throw n[0];
	try {
		return e && (t = e(e = 0)), t;
	} catch (e) {
		throw n = [e], e;
	}
}, n = (t, n) => {
	let r = {};
	for (var i in t) e(r, i, {
		get: t[i],
		enumerable: !0
	});
	return n || e(r, Symbol.toStringTag, { value: "Module" }), r;
}, r, i, a, o, s, c, l, u, d, f = t((() => {
	r = globalThis, i = r.ShadowRoot && (r.ShadyCSS === void 0 || r.ShadyCSS.nativeShadow) && "adoptedStyleSheets" in Document.prototype && "replace" in CSSStyleSheet.prototype, a = Symbol(), o = /* @__PURE__ */ new WeakMap(), s = class {
		constructor(e, t, n) {
			if (this._$cssResult$ = !0, n !== a) throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");
			this.cssText = e, this.t = t;
		}
		get styleSheet() {
			let e = this.o, t = this.t;
			if (i && e === void 0) {
				let n = t !== void 0 && t.length === 1;
				n && (e = o.get(t)), e === void 0 && ((this.o = e = new CSSStyleSheet()).replaceSync(this.cssText), n && o.set(t, e));
			}
			return e;
		}
		toString() {
			return this.cssText;
		}
	}, c = (e) => new s(typeof e == "string" ? e : e + "", void 0, a), l = (e, ...t) => {
		let n = e.length === 1 ? e[0] : t.reduce((t, n, r) => t + ((e) => {
			if (!0 === e._$cssResult$) return e.cssText;
			if (typeof e == "number") return e;
			throw Error("Value passed to 'css' function must be a 'css' function result: " + e + ". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.");
		})(n) + e[r + 1], e[0]);
		return new s(n, e, a);
	}, u = (e, t) => {
		if (i) e.adoptedStyleSheets = t.map((e) => e instanceof CSSStyleSheet ? e : e.styleSheet);
		else for (let n of t) {
			let t = document.createElement("style"), i = r.litNonce;
			i !== void 0 && t.setAttribute("nonce", i), t.textContent = n.cssText, e.appendChild(t);
		}
	}, d = i ? (e) => e : (e) => e instanceof CSSStyleSheet ? ((e) => {
		let t = "";
		for (let n of e.cssRules) t += n.cssText;
		return c(t);
	})(e) : e;
})), p, m, h, ee, g, te, ne, re, ie, ae, oe, se, ce, le, ue, de = t((() => {
	f(), {is: p, defineProperty: m, getOwnPropertyDescriptor: h, getOwnPropertyNames: ee, getOwnPropertySymbols: g, getPrototypeOf: te} = Object, ne = globalThis, re = ne.trustedTypes, ie = re ? re.emptyScript : "", ae = ne.reactiveElementPolyfillSupport, oe = (e, t) => e, se = {
		toAttribute(e, t) {
			switch (t) {
				case Boolean:
					e = e ? ie : null;
					break;
				case Object:
				case Array: e = e == null ? e : JSON.stringify(e);
			}
			return e;
		},
		fromAttribute(e, t) {
			let n = e;
			switch (t) {
				case Boolean:
					n = e !== null;
					break;
				case Number:
					n = e === null ? null : Number(e);
					break;
				case Object:
				case Array: try {
					n = JSON.parse(e);
				} catch {
					n = null;
				}
			}
			return n;
		}
	}, ce = (e, t) => !p(e, t), le = {
		attribute: !0,
		type: String,
		converter: se,
		reflect: !1,
		useDefault: !1,
		hasChanged: ce
	}, Symbol.metadata ??= Symbol("metadata"), ne.litPropertyMetadata ??= /* @__PURE__ */ new WeakMap(), ue = class extends HTMLElement {
		static addInitializer(e) {
			this._$Ei(), (this.l ??= []).push(e);
		}
		static get observedAttributes() {
			return this.finalize(), this._$Eh && [...this._$Eh.keys()];
		}
		static createProperty(e, t = le) {
			if (t.state && (t.attribute = !1), this._$Ei(), this.prototype.hasOwnProperty(e) && ((t = Object.create(t)).wrapped = !0), this.elementProperties.set(e, t), !t.noAccessor) {
				let n = Symbol(), r = this.getPropertyDescriptor(e, n, t);
				r !== void 0 && m(this.prototype, e, r);
			}
		}
		static getPropertyDescriptor(e, t, n) {
			let { get: r, set: i } = h(this.prototype, e) ?? {
				get() {
					return this[t];
				},
				set(e) {
					this[t] = e;
				}
			};
			return {
				get: r,
				set(t) {
					let a = r?.call(this);
					i?.call(this, t), this.requestUpdate(e, a, n);
				},
				configurable: !0,
				enumerable: !0
			};
		}
		static getPropertyOptions(e) {
			return this.elementProperties.get(e) ?? le;
		}
		static _$Ei() {
			if (this.hasOwnProperty(oe("elementProperties"))) return;
			let e = te(this);
			e.finalize(), e.l !== void 0 && (this.l = [...e.l]), this.elementProperties = new Map(e.elementProperties);
		}
		static finalize() {
			if (this.hasOwnProperty(oe("finalized"))) return;
			if (this.finalized = !0, this._$Ei(), this.hasOwnProperty(oe("properties"))) {
				let e = this.properties, t = [...ee(e), ...g(e)];
				for (let n of t) this.createProperty(n, e[n]);
			}
			let e = this[Symbol.metadata];
			if (e !== null) {
				let t = litPropertyMetadata.get(e);
				if (t !== void 0) for (let [e, n] of t) this.elementProperties.set(e, n);
			}
			this._$Eh = /* @__PURE__ */ new Map();
			for (let [e, t] of this.elementProperties) {
				let n = this._$Eu(e, t);
				n !== void 0 && this._$Eh.set(n, e);
			}
			this.elementStyles = this.finalizeStyles(this.styles);
		}
		static finalizeStyles(e) {
			let t = [];
			if (Array.isArray(e)) {
				let n = new Set(e.flat(1 / 0).reverse());
				for (let e of n) t.unshift(d(e));
			} else e !== void 0 && t.push(d(e));
			return t;
		}
		static _$Eu(e, t) {
			let n = t.attribute;
			return !1 === n ? void 0 : typeof n == "string" ? n : typeof e == "string" ? e.toLowerCase() : void 0;
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
			let e = /* @__PURE__ */ new Map(), t = this.constructor.elementProperties;
			for (let n of t.keys()) this.hasOwnProperty(n) && (e.set(n, this[n]), delete this[n]);
			e.size > 0 && (this._$Ep = e);
		}
		createRenderRoot() {
			let e = this.shadowRoot ?? this.attachShadow(this.constructor.shadowRootOptions);
			return u(e, this.constructor.elementStyles), e;
		}
		connectedCallback() {
			this.renderRoot ??= this.createRenderRoot(), this.enableUpdating(!0), this._$EO?.forEach((e) => e.hostConnected?.());
		}
		enableUpdating(e) {}
		disconnectedCallback() {
			this._$EO?.forEach((e) => e.hostDisconnected?.());
		}
		attributeChangedCallback(e, t, n) {
			this._$AK(e, n);
		}
		_$ET(e, t) {
			let n = this.constructor.elementProperties.get(e), r = this.constructor._$Eu(e, n);
			if (r !== void 0 && !0 === n.reflect) {
				let i = (n.converter?.toAttribute === void 0 ? se : n.converter).toAttribute(t, n.type);
				this._$Em = e, i == null ? this.removeAttribute(r) : this.setAttribute(r, i), this._$Em = null;
			}
		}
		_$AK(e, t) {
			let n = this.constructor, r = n._$Eh.get(e);
			if (r !== void 0 && this._$Em !== r) {
				let e = n.getPropertyOptions(r), i = typeof e.converter == "function" ? { fromAttribute: e.converter } : e.converter?.fromAttribute === void 0 ? se : e.converter;
				this._$Em = r;
				let a = i.fromAttribute(t, e.type);
				this[r] = a ?? this._$Ej?.get(r) ?? a, this._$Em = null;
			}
		}
		requestUpdate(e, t, n, r = !1, i) {
			if (e !== void 0) {
				let a = this.constructor;
				if (!1 === r && (i = this[e]), n ??= a.getPropertyOptions(e), !((n.hasChanged ?? ce)(i, t) || n.useDefault && n.reflect && i === this._$Ej?.get(e) && !this.hasAttribute(a._$Eu(e, n)))) return;
				this.C(e, t, n);
			}
			!1 === this.isUpdatePending && (this._$ES = this._$EP());
		}
		C(e, t, { useDefault: n, reflect: r, wrapped: i }, a) {
			n && !(this._$Ej ??= /* @__PURE__ */ new Map()).has(e) && (this._$Ej.set(e, a ?? t ?? this[e]), !0 !== i || a !== void 0) || (this._$AL.has(e) || (this.hasUpdated || n || (t = void 0), this._$AL.set(e, t)), !0 === r && this._$Em !== e && (this._$Eq ??= /* @__PURE__ */ new Set()).add(e));
		}
		async _$EP() {
			this.isUpdatePending = !0;
			try {
				await this._$ES;
			} catch (e) {
				Promise.reject(e);
			}
			let e = this.scheduleUpdate();
			return e != null && await e, !this.isUpdatePending;
		}
		scheduleUpdate() {
			return this.performUpdate();
		}
		performUpdate() {
			if (!this.isUpdatePending) return;
			if (!this.hasUpdated) {
				if (this.renderRoot ??= this.createRenderRoot(), this._$Ep) {
					for (let [e, t] of this._$Ep) this[e] = t;
					this._$Ep = void 0;
				}
				let e = this.constructor.elementProperties;
				if (e.size > 0) for (let [t, n] of e) {
					let { wrapped: e } = n, r = this[t];
					!0 !== e || this._$AL.has(t) || r === void 0 || this.C(t, void 0, n, r);
				}
			}
			let e = !1, t = this._$AL;
			try {
				e = this.shouldUpdate(t), e ? (this.willUpdate(t), this._$EO?.forEach((e) => e.hostUpdate?.()), this.update(t)) : this._$EM();
			} catch (t) {
				throw e = !1, this._$EM(), t;
			}
			e && this._$AE(t);
		}
		willUpdate(e) {}
		_$AE(e) {
			this._$EO?.forEach((e) => e.hostUpdated?.()), this.hasUpdated || (this.hasUpdated = !0, this.firstUpdated(e)), this.updated(e);
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
			this._$Eq &&= this._$Eq.forEach((e) => this._$ET(e, this[e])), this._$EM();
		}
		updated(e) {}
		firstUpdated(e) {}
	}, ue.elementStyles = [], ue.shadowRootOptions = { mode: "open" }, ue[oe("elementProperties")] = /* @__PURE__ */ new Map(), ue[oe("finalized")] = /* @__PURE__ */ new Map(), ae?.({ ReactiveElement: ue }), (ne.reactiveElementVersions ??= []).push("2.1.2");
}));
//#endregion
//#region node_modules/lit-html/lit-html.js
function fe(e, t) {
	if (!Ce(e) || !e.hasOwnProperty("raw")) throw Error("invalid template strings array");
	return _e === void 0 ? t : _e.createHTML(t);
}
function pe(e, t, n = e, r) {
	if (t === x) return t;
	let i = r === void 0 ? n._$Cl : n._$Co?.[r], a = Se(t) ? void 0 : t._$litDirective$;
	return i?.constructor !== a && (i?._$AO?.(!1), a === void 0 ? i = void 0 : (i = new a(e), i._$AT(e, n, r)), r === void 0 ? n._$Cl = i : (n._$Co ??= [])[r] = i), i !== void 0 && (t = pe(e, i._$AS(e, t.values), i, r)), t;
}
var me, he, ge, _e, ve, _, ye, be, v, xe, Se, Ce, we, Te, Ee, De, Oe, y, ke, Ae, je, Me, b, Ne, x, S, Pe, C, Fe, Ie, Le, Re, ze, Be, Ve, He, Ue, We, Ge, Ke, qe = t((() => {
	me = globalThis, he = (e) => e, ge = me.trustedTypes, _e = ge ? ge.createPolicy("lit-html", { createHTML: (e) => e }) : void 0, ve = "$lit$", _ = `lit$${Math.random().toFixed(9).slice(2)}$`, ye = "?" + _, be = `<${ye}>`, v = document, xe = () => v.createComment(""), Se = (e) => e === null || typeof e != "object" && typeof e != "function", Ce = Array.isArray, we = (e) => Ce(e) || typeof e?.[Symbol.iterator] == "function", Te = "[ 	\n\f\r]", Ee = /<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g, De = /-->/g, Oe = />/g, y = RegExp(`>|${Te}(?:([^\\s"'>=/]+)(${Te}*=${Te}*(?:[^ \t\n\f\r"'\`<>=]|("|')|))|$)`, "g"), ke = /'/g, Ae = /"/g, je = /^(?:script|style|textarea|title)$/i, Me = (e) => (t, ...n) => ({
		_$litType$: e,
		strings: t,
		values: n
	}), b = Me(1), Ne = Me(2), Me(3), x = Symbol.for("lit-noChange"), S = Symbol.for("lit-nothing"), Pe = /* @__PURE__ */ new WeakMap(), C = v.createTreeWalker(v, 129), Fe = (e, t) => {
		let n = e.length - 1, r = [], i, a = t === 2 ? "<svg>" : t === 3 ? "<math>" : "", o = Ee;
		for (let t = 0; t < n; t++) {
			let n = e[t], s, c, l = -1, u = 0;
			for (; u < n.length && (o.lastIndex = u, c = o.exec(n), c !== null);) u = o.lastIndex, o === Ee ? c[1] === "!--" ? o = De : c[1] === void 0 ? c[2] === void 0 ? c[3] !== void 0 && (o = y) : (je.test(c[2]) && (i = RegExp("</" + c[2], "g")), o = y) : o = Oe : o === y ? c[0] === ">" ? (o = i ?? Ee, l = -1) : c[1] === void 0 ? l = -2 : (l = o.lastIndex - c[2].length, s = c[1], o = c[3] === void 0 ? y : c[3] === "\"" ? Ae : ke) : o === Ae || o === ke ? o = y : o === De || o === Oe ? o = Ee : (o = y, i = void 0);
			let d = o === y && e[t + 1].startsWith("/>") ? " " : "";
			a += o === Ee ? n + be : l >= 0 ? (r.push(s), n.slice(0, l) + ve + n.slice(l) + _ + d) : n + _ + (l === -2 ? t : d);
		}
		return [fe(e, a + (e[n] || "<?>") + (t === 2 ? "</svg>" : t === 3 ? "</math>" : "")), r];
	}, Ie = class e {
		constructor({ strings: t, _$litType$: n }, r) {
			let i;
			this.parts = [];
			let a = 0, o = 0, s = t.length - 1, c = this.parts, [l, u] = Fe(t, n);
			if (this.el = e.createElement(l, r), C.currentNode = this.el.content, n === 2 || n === 3) {
				let e = this.el.content.firstChild;
				e.replaceWith(...e.childNodes);
			}
			for (; (i = C.nextNode()) !== null && c.length < s;) {
				if (i.nodeType === 1) {
					if (i.hasAttributes()) for (let e of i.getAttributeNames()) if (e.endsWith(ve)) {
						let t = u[o++], n = i.getAttribute(e).split(_), r = /([.?@])?(.*)/.exec(t);
						c.push({
							type: 1,
							index: a,
							name: r[2],
							strings: n,
							ctor: r[1] === "." ? Be : r[1] === "?" ? Ve : r[1] === "@" ? He : ze
						}), i.removeAttribute(e);
					} else e.startsWith(_) && (c.push({
						type: 6,
						index: a
					}), i.removeAttribute(e));
					if (je.test(i.tagName)) {
						let e = i.textContent.split(_), t = e.length - 1;
						if (t > 0) {
							i.textContent = ge ? ge.emptyScript : "";
							for (let n = 0; n < t; n++) i.append(e[n], xe()), C.nextNode(), c.push({
								type: 2,
								index: ++a
							});
							i.append(e[t], xe());
						}
					}
				} else if (i.nodeType === 8) {
					if (i.data === ye) c.push({
						type: 2,
						index: a
					});
					else {
						let e = -1;
						for (; (e = i.data.indexOf(_, e + 1)) !== -1;) c.push({
							type: 7,
							index: a
						}), e += _.length - 1;
					}
				}
				a++;
			}
		}
		static createElement(e, t) {
			let n = v.createElement("template");
			return n.innerHTML = e, n;
		}
	}, Le = class {
		constructor(e, t) {
			this._$AV = [], this._$AN = void 0, this._$AD = e, this._$AM = t;
		}
		get parentNode() {
			return this._$AM.parentNode;
		}
		get _$AU() {
			return this._$AM._$AU;
		}
		u(e) {
			let { el: { content: t }, parts: n } = this._$AD, r = (e?.creationScope ?? v).importNode(t, !0);
			C.currentNode = r;
			let i = C.nextNode(), a = 0, o = 0, s = n[0];
			for (; s !== void 0;) {
				if (a === s.index) {
					let t;
					s.type === 2 ? t = new Re(i, i.nextSibling, this, e) : s.type === 1 ? t = new s.ctor(i, s.name, s.strings, this, e) : s.type === 6 && (t = new Ue(i, this, e)), this._$AV.push(t), s = n[++o];
				}
				a !== s?.index && (i = C.nextNode(), a++);
			}
			return C.currentNode = v, r;
		}
		p(e) {
			let t = 0;
			for (let n of this._$AV) n !== void 0 && (n.strings === void 0 ? n._$AI(e[t]) : (n._$AI(e, n, t), t += n.strings.length - 2)), t++;
		}
	}, Re = class e {
		get _$AU() {
			return this._$AM?._$AU ?? this._$Cv;
		}
		constructor(e, t, n, r) {
			this.type = 2, this._$AH = S, this._$AN = void 0, this._$AA = e, this._$AB = t, this._$AM = n, this.options = r, this._$Cv = r?.isConnected ?? !0;
		}
		get parentNode() {
			let e = this._$AA.parentNode, t = this._$AM;
			return t !== void 0 && e?.nodeType === 11 && (e = t.parentNode), e;
		}
		get startNode() {
			return this._$AA;
		}
		get endNode() {
			return this._$AB;
		}
		_$AI(e, t = this) {
			e = pe(this, e, t), Se(e) ? e === S || e == null || e === "" ? (this._$AH !== S && this._$AR(), this._$AH = S) : e !== this._$AH && e !== x && this._(e) : e._$litType$ === void 0 ? e.nodeType === void 0 ? we(e) ? this.k(e) : this._(e) : this.T(e) : this.$(e);
		}
		O(e) {
			return this._$AA.parentNode.insertBefore(e, this._$AB);
		}
		T(e) {
			this._$AH !== e && (this._$AR(), this._$AH = this.O(e));
		}
		_(e) {
			this._$AH !== S && Se(this._$AH) ? this._$AA.nextSibling.data = e : this.T(v.createTextNode(e)), this._$AH = e;
		}
		$(e) {
			let { values: t, _$litType$: n } = e, r = typeof n == "number" ? this._$AC(e) : (n.el === void 0 && (n.el = Ie.createElement(fe(n.h, n.h[0]), this.options)), n);
			if (this._$AH?._$AD === r) this._$AH.p(t);
			else {
				let e = new Le(r, this), n = e.u(this.options);
				e.p(t), this.T(n), this._$AH = e;
			}
		}
		_$AC(e) {
			let t = Pe.get(e.strings);
			return t === void 0 && Pe.set(e.strings, t = new Ie(e)), t;
		}
		k(t) {
			Ce(this._$AH) || (this._$AH = [], this._$AR());
			let n = this._$AH, r, i = 0;
			for (let a of t) i === n.length ? n.push(r = new e(this.O(xe()), this.O(xe()), this, this.options)) : r = n[i], r._$AI(a), i++;
			i < n.length && (this._$AR(r && r._$AB.nextSibling, i), n.length = i);
		}
		_$AR(e = this._$AA.nextSibling, t) {
			for (this._$AP?.(!1, !0, t); e !== this._$AB;) {
				let t = he(e).nextSibling;
				he(e).remove(), e = t;
			}
		}
		setConnected(e) {
			this._$AM === void 0 && (this._$Cv = e, this._$AP?.(e));
		}
	}, ze = class {
		get tagName() {
			return this.element.tagName;
		}
		get _$AU() {
			return this._$AM._$AU;
		}
		constructor(e, t, n, r, i) {
			this.type = 1, this._$AH = S, this._$AN = void 0, this.element = e, this.name = t, this._$AM = r, this.options = i, n.length > 2 || n[0] !== "" || n[1] !== "" ? (this._$AH = Array(n.length - 1).fill(/* @__PURE__ */ new String()), this.strings = n) : this._$AH = S;
		}
		_$AI(e, t = this, n, r) {
			let i = this.strings, a = !1;
			if (i === void 0) e = pe(this, e, t, 0), a = !Se(e) || e !== this._$AH && e !== x, a && (this._$AH = e);
			else {
				let r = e, o, s;
				for (e = i[0], o = 0; o < i.length - 1; o++) s = pe(this, r[n + o], t, o), s === x && (s = this._$AH[o]), a ||= !Se(s) || s !== this._$AH[o], s === S ? e = S : e !== S && (e += (s ?? "") + i[o + 1]), this._$AH[o] = s;
			}
			a && !r && this.j(e);
		}
		j(e) {
			e === S ? this.element.removeAttribute(this.name) : this.element.setAttribute(this.name, e ?? "");
		}
	}, Be = class extends ze {
		constructor() {
			super(...arguments), this.type = 3;
		}
		j(e) {
			this.element[this.name] = e === S ? void 0 : e;
		}
	}, Ve = class extends ze {
		constructor() {
			super(...arguments), this.type = 4;
		}
		j(e) {
			this.element.toggleAttribute(this.name, !!e && e !== S);
		}
	}, He = class extends ze {
		constructor(e, t, n, r, i) {
			super(e, t, n, r, i), this.type = 5;
		}
		_$AI(e, t = this) {
			if ((e = pe(this, e, t, 0) ?? S) === x) return;
			let n = this._$AH, r = e === S && n !== S || e.capture !== n.capture || e.once !== n.once || e.passive !== n.passive, i = e !== S && (n === S || r);
			r && this.element.removeEventListener(this.name, this, n), i && this.element.addEventListener(this.name, this, e), this._$AH = e;
		}
		handleEvent(e) {
			typeof this._$AH == "function" ? this._$AH.call(this.options?.host ?? this.element, e) : this._$AH.handleEvent(e);
		}
	}, Ue = class {
		constructor(e, t, n) {
			this.element = e, this.type = 6, this._$AN = void 0, this._$AM = t, this.options = n;
		}
		get _$AU() {
			return this._$AM._$AU;
		}
		_$AI(e) {
			pe(this, e);
		}
	}, We = {
		M: ve,
		P: _,
		A: ye,
		C: 1,
		L: Fe,
		R: Le,
		D: we,
		V: pe,
		I: Re,
		H: ze,
		N: Ve,
		U: He,
		B: Be,
		F: Ue
	}, Ge = me.litHtmlPolyfillSupport, Ge?.(Ie, Re), (me.litHtmlVersions ??= []).push("3.3.3"), Ke = (e, t, n) => {
		let r = n?.renderBefore ?? t, i = r._$litPart$;
		if (i === void 0) {
			let e = n?.renderBefore ?? null;
			r._$litPart$ = i = new Re(t.insertBefore(xe(), e), e, void 0, n ?? {});
		}
		return i._$AI(e), i;
	};
})), Je, w, Ye, Xe = t((() => {
	de(), de(), qe(), qe(), Je = globalThis, w = class extends ue {
		constructor() {
			super(...arguments), this.renderOptions = { host: this }, this._$Do = void 0;
		}
		createRenderRoot() {
			let e = super.createRenderRoot();
			return this.renderOptions.renderBefore ??= e.firstChild, e;
		}
		update(e) {
			let t = this.render();
			this.hasUpdated || (this.renderOptions.isConnected = this.isConnected), super.update(e), this._$Do = Ke(t, this.renderRoot, this.renderOptions);
		}
		connectedCallback() {
			super.connectedCallback(), this._$Do?.setConnected(!0);
		}
		disconnectedCallback() {
			super.disconnectedCallback(), this._$Do?.setConnected(!1);
		}
		render() {
			return x;
		}
	}, w._$litElement$ = !0, w.finalized = !0, Je.litElementHydrateSupport?.({ LitElement: w }), Ye = Je.litElementPolyfillSupport, Ye?.({ LitElement: w }), (Je.litElementVersions ??= []).push("4.2.2");
})), Ze = t((() => {})), T = t((() => {
	de(), qe(), Xe(), Ze();
})), Qe = t((() => {}));
//#endregion
//#region node_modules/@lit/reactive-element/decorators/property.js
function E(e) {
	return (t, n) => typeof n == "object" ? et(e, t, n) : ((e, t, n) => {
		let r = t.hasOwnProperty(n);
		return t.constructor.createProperty(n, e), r ? Object.getOwnPropertyDescriptor(t, n) : void 0;
	})(e, t, n);
}
var $e, et, tt = t((() => {
	de(), $e = {
		attribute: !0,
		type: String,
		converter: se,
		reflect: !1,
		hasChanged: ce
	}, et = (e = $e, t, n) => {
		let { kind: r, metadata: i } = n, a = globalThis.litPropertyMetadata.get(i);
		if (a === void 0 && globalThis.litPropertyMetadata.set(i, a = /* @__PURE__ */ new Map()), r === "setter" && ((e = Object.create(e)).wrapped = !0), a.set(n.name, e), r === "accessor") {
			let { name: r } = n;
			return {
				set(n) {
					let i = t.get.call(this);
					t.set.call(this, n), this.requestUpdate(r, i, e, !0, n);
				},
				init(t) {
					return t !== void 0 && this.C(r, void 0, e, t), t;
				}
			};
		}
		if (r === "setter") {
			let { name: r } = n;
			return function(n) {
				let i = this[r];
				t.call(this, n), this.requestUpdate(r, i, e, !0, n);
			};
		}
		throw Error("Unsupported decorator location: " + r);
	};
}));
//#endregion
//#region node_modules/@lit/reactive-element/decorators/state.js
function D(e) {
	return E({
		...e,
		state: !0,
		attribute: !1
	});
}
var nt = t((() => {
	tt();
})), rt = t((() => {})), it, at = t((() => {
	it = (e, t, n) => (n.configurable = !0, n.enumerable = !0, Reflect.decorate && typeof t != "object" && Object.defineProperty(e, t, n), n);
}));
//#endregion
//#region node_modules/@lit/reactive-element/decorators/query.js
function ot(e, t) {
	return (n, r, i) => {
		let a = (t) => t.renderRoot?.querySelector(e) ?? null;
		if (t) {
			let { get: e, set: t } = typeof r == "object" ? n : i ?? (() => {
				let e = Symbol();
				return {
					get() {
						return this[e];
					},
					set(t) {
						this[e] = t;
					}
				};
			})();
			return it(n, r, { get() {
				let n = e.call(this);
				return n === void 0 && (n = a(this), (n !== null || this.hasUpdated) && t.call(this, n)), n;
			} });
		}
		return it(n, r, { get() {
			return a(this);
		} });
	};
}
var st = t((() => {
	at();
})), ct = t((() => {})), lt = t((() => {})), ut = t((() => {})), dt = t((() => {})), O = t((() => {
	Qe(), tt(), nt(), rt(), st(), ct(), lt(), ut(), dt();
}));
//#endregion
//#region src/primitives/registry.ts
function k(e) {
	return function(t) {
		return customElements.get(e) || customElements.define(e, t), t;
	};
}
var A = t((() => {}));
O(), A(), T();
var ft = l`
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
`, pt = l`
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
`, mt = {
	defaultView: "overview",
	title: "Home",
	kiosk: {
		enabled: !1,
		hideHomeAssistantSidebar: !1,
		preventScreenSelection: !1
	},
	views: [
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
					size: {
						compact: "2x2",
						medium: "2x2",
						wide: "2x2"
					}
				},
				{
					id: "ov-energy",
					type: "energy",
					name: "Energy",
					size: {
						compact: "2x2",
						medium: "2x2",
						wide: "2x2"
					},
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
					size: {
						compact: "2x1",
						medium: "2x1",
						wide: "2x1"
					}
				},
				{
					id: "ov-lights-off",
					type: "action",
					name: "All lights off",
					icon: "mdi:lightbulb-group-off",
					size: {
						compact: "1x1",
						medium: "1x1",
						wide: "1x1"
					},
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
					size: {
						compact: "1x1",
						medium: "1x1",
						wide: "1x1"
					}
				},
				{
					id: "ov-presence",
					type: "person",
					entity: "person.ben",
					size: {
						compact: "1x1",
						medium: "1x1",
						wide: "1x1"
					}
				},
				{
					id: "ov-vacuum",
					type: "vacuum",
					entity: "vacuum.roborock_s8_pro_ultra",
					name: "S8 Pro Ultra",
					size: {
						compact: "2x2",
						medium: "2x2",
						wide: "2x2"
					},
					options: { brand: "roborock" }
				},
				{
					id: "ov-tv",
					type: "media",
					entity: "media_player.tv_tv",
					name: "TV",
					size: {
						compact: "2x1",
						medium: "2x2",
						wide: "2x2"
					}
				},
				{
					id: "ov-car-battery",
					type: "sensor",
					entity: "sensor.other_tesla_model_3_battery_level",
					name: "Car battery",
					icon: "mdi:car-electric",
					size: {
						compact: "1x1",
						medium: "1x1",
						wide: "1x1"
					}
				},
				{
					id: "ov-waste",
					type: "sensor",
					entity: "sensor.next_collection",
					name: "Waste pickup",
					icon: "mdi:recycle",
					size: {
						compact: "1x1",
						medium: "1x1",
						wide: "1x1"
					}
				}
			]
		},
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
					size: {
						compact: "2x1",
						medium: "2x1",
						wide: "2x1"
					}
				},
				{
					id: "lr-lamp",
					type: "light",
					entity: "light.living_room_living_room_table_lamp",
					name: "Table lamp",
					size: {
						compact: "1x1",
						medium: "1x1",
						wide: "1x1"
					}
				},
				{
					id: "lr-movie",
					type: "scene",
					entity: "scene.living_room_living_room_movie",
					name: "Movie",
					icon: "mdi:movie-open",
					size: {
						compact: "1x1",
						medium: "1x1",
						wide: "1x1"
					}
				},
				{
					id: "lr-tv",
					type: "media",
					entity: "media_player.tv_tv",
					name: "TV",
					size: {
						compact: "2x1",
						medium: "2x2",
						wide: "2x2"
					}
				},
				{
					id: "lr-speaker",
					type: "media",
					entity: "media_player.ht_a9_2",
					name: "HT-A9",
					size: {
						compact: "2x1",
						medium: "2x1",
						wide: "2x1"
					}
				},
				{
					id: "lr-vacuum",
					type: "vacuum",
					entity: "vacuum.roborock_s8_pro_ultra",
					name: "S8 Pro Ultra",
					size: {
						compact: "2x2",
						medium: "2x2",
						wide: "2x2"
					},
					options: { brand: "roborock" }
				}
			]
		},
		{
			id: "kitchen",
			type: "room",
			label: "Kitchen",
			icon: "mdi:fridge-outline",
			widgets: [{
				id: "k-main",
				type: "light",
				entity: "light.kitchen",
				name: "Kitchen",
				size: {
					compact: "2x1",
					medium: "2x1",
					wide: "2x1"
				}
			}, {
				id: "k-adaptive",
				type: "switch",
				entity: "switch.kitchen_adaptive_lighting_kitchen",
				name: "Adaptive lighting",
				icon: "mdi:theme-light-dark",
				size: {
					compact: "1x1",
					medium: "1x1",
					wide: "1x1"
				}
			}]
		},
		{
			id: "dining-room",
			type: "room",
			label: "Dining room",
			icon: "mdi:silverware-fork-knife",
			widgets: [{
				id: "dr-main",
				type: "light",
				entity: "light.dining",
				name: "Dining",
				size: {
					compact: "2x1",
					medium: "2x1",
					wide: "2x1"
				}
			}, {
				id: "dr-adaptive",
				type: "switch",
				entity: "switch.dining_adaptive_lighting_dining",
				name: "Adaptive lighting",
				icon: "mdi:theme-light-dark",
				size: {
					compact: "1x1",
					medium: "1x1",
					wide: "1x1"
				}
			}]
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
					size: {
						compact: "2x1",
						medium: "2x1",
						wide: "2x1"
					}
				},
				{
					id: "br-ben",
					type: "light",
					entity: "light.bedroom_bens_bed_table",
					name: "Ben’s table",
					size: {
						compact: "1x1",
						medium: "1x1",
						wide: "1x1"
					}
				},
				{
					id: "br-ilona",
					type: "light",
					entity: "light.bedroom_ilonas_bed_table",
					name: "Ilona’s table",
					size: {
						compact: "1x1",
						medium: "1x1",
						wide: "1x1"
					}
				},
				{
					id: "br-read",
					type: "scene",
					entity: "scene.bedroom_bedroom_read",
					name: "Read",
					icon: "mdi:book-open-page-variant",
					size: {
						compact: "1x1",
						medium: "1x1",
						wide: "1x1"
					}
				},
				{
					id: "br-night",
					type: "scene",
					entity: "scene.bedroom_bedroom_nightlight",
					name: "Nightlight",
					icon: "mdi:weather-night",
					size: {
						compact: "1x1",
						medium: "1x1",
						wide: "1x1"
					}
				}
			]
		},
		{
			id: "mias-bedroom",
			type: "room",
			label: "Mia’s bedroom",
			icon: "mdi:teddy-bear",
			widgets: [{
				id: "mia-main",
				type: "light",
				entity: "light.mias_bedroom_mias_bedroom",
				name: "Mia’s bedroom",
				size: {
					compact: "2x1",
					medium: "2x1",
					wide: "2x1"
				}
			}]
		},
		{
			id: "juliens-bedroom",
			type: "room",
			label: "Julien’s bedroom",
			icon: "mdi:teddy-bear",
			widgets: [{
				id: "jul-main",
				type: "light",
				entity: "light.juliens_bedroom_juliens_bedroom",
				name: "Julien’s bedroom",
				size: {
					compact: "2x1",
					medium: "2x1",
					wide: "2x1"
				}
			}, {
				id: "jul-go",
				type: "light",
				entity: "light.juliens_bedroom_hue_go_julien",
				name: "Hue Go",
				size: {
					compact: "1x1",
					medium: "1x1",
					wide: "1x1"
				}
			}]
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
					size: {
						compact: "2x2",
						medium: "2x2",
						wide: "2x2"
					},
					options: { switches: [
						{
							entity: "switch.ec3a56bc6527_powerful",
							name: "Powerful"
						},
						{
							entity: "switch.ec3a56bc6527_economy_mode",
							name: "Economy"
						},
						{
							entity: "switch.ec3a56bc6527_quiet_fan",
							name: "Quiet fan"
						},
						{
							entity: "switch.ec3a56bc6527_human_detection",
							name: "Human detection"
						}
					] }
				},
				{
					id: "of-main",
					type: "light",
					entity: "light.bens_office_bens_office",
					name: "Office",
					size: {
						compact: "2x1",
						medium: "2x1",
						wide: "2x1"
					}
				},
				{
					id: "of-screen",
					type: "light",
					entity: "light.bens_office_bens_screen",
					name: "Screen light",
					size: {
						compact: "1x1",
						medium: "1x1",
						wide: "1x1"
					}
				},
				{
					id: "of-printer",
					type: "sensor",
					entity: "sensor.hp_laserjet_pro_m404_m405",
					name: "Printer",
					icon: "mdi:printer",
					size: {
						compact: "1x1",
						medium: "1x1",
						wide: "1x1"
					}
				}
			]
		},
		{
			id: "playground",
			type: "room",
			label: "Playground",
			icon: "mdi:gamepad-variant-outline",
			widgets: [{
				id: "pg-main",
				type: "light",
				entity: "light.playground_playground",
				name: "Playground",
				size: {
					compact: "2x1",
					medium: "2x1",
					wide: "2x1"
				}
			}]
		},
		{
			id: "hallway",
			type: "room",
			label: "Hallway",
			icon: "mdi:coat-rack",
			widgets: [{
				id: "hw-main",
				type: "light",
				entity: "light.hallway_hallway",
				name: "Hallway",
				size: {
					compact: "2x1",
					medium: "2x1",
					wide: "2x1"
				}
			}, {
				id: "hw-power",
				type: "sensor",
				entity: "sensor.p1_meter_power",
				name: "Grid power",
				icon: "mdi:transmission-tower",
				size: {
					compact: "1x1",
					medium: "1x1",
					wide: "1x1"
				}
			}]
		},
		{
			id: "corridor",
			type: "room",
			label: "Corridor",
			icon: "mdi:stairs",
			widgets: [{
				id: "co-main",
				type: "light",
				entity: "light.corridor_corridor",
				name: "Corridor",
				size: {
					compact: "2x1",
					medium: "2x1",
					wide: "2x1"
				}
			}]
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
					size: {
						compact: "2x1",
						medium: "2x1",
						wide: "2x1"
					}
				},
				{
					id: "car-climate",
					type: "climate",
					entity: "climate.other_tesla_model_3_climate",
					name: "Climate",
					size: {
						compact: "2x1",
						medium: "2x1",
						wide: "2x1"
					}
				},
				{
					id: "car-lock",
					type: "lock",
					entity: "lock.other_tesla_model_3_lock",
					name: "Doors",
					requiresConfirmation: !0,
					size: {
						compact: "1x1",
						medium: "1x1",
						wide: "1x1"
					}
				},
				{
					id: "car-sentry",
					type: "switch",
					entity: "switch.other_tesla_model_3_sentry_mode",
					name: "Sentry mode",
					icon: "mdi:cctv",
					size: {
						compact: "1x1",
						medium: "1x1",
						wide: "1x1"
					}
				},
				{
					id: "car-trunk",
					type: "cover",
					entity: "cover.other_tesla_model_3_trunk",
					name: "Trunk",
					size: {
						compact: "1x1",
						medium: "1x1",
						wide: "1x1"
					}
				},
				{
					id: "car-charger",
					type: "sensor",
					entity: "sensor.tesla_wall_connector_status",
					name: "Wall connector",
					icon: "mdi:ev-station",
					size: {
						compact: "1x1",
						medium: "1x1",
						wide: "1x1"
					}
				}
			]
		},
		{
			id: "energy",
			type: "system",
			label: "Energy",
			icon: "mdi:lightning-bolt-outline",
			hero: {
				type: "energy",
				grid: "sensor.whole_home_energy_daily_usage",
				solar: "sensor.goodwe_today_s_pv_generation",
				gridPower: "sensor.p1_meter_power",
				solarPower: "sensor.goodwe_pv_power",
				carConnected: "binary_sensor.tesla_wall_connector_vehicle_connected",
				carPower: "sensor.tesla_wall_connector_total_power"
			},
			widgets: [
				{
					id: "en-tiles",
					type: "group",
					size: {
						compact: "4x2",
						medium: "4x2",
						wide: "4x2"
					},
					options: {
						variant: "tiles",
						children: [
							{
								id: "en-t-electricity",
								type: "metrictile",
								entity: "sensor.p1_meter_power",
								name: "Electricity",
								icon: "mdi:flash",
								size: {
									compact: "1x1",
									medium: "1x1",
									wide: "1x1"
								},
								options: {
									accent: "accent",
									format: "power",
									status: "gridDirection"
								}
							},
							{
								id: "en-t-solar",
								type: "metrictile",
								entity: "sensor.goodwe_pv_power",
								name: "Solar",
								icon: "mdi:weather-sunny",
								size: {
									compact: "1x1",
									medium: "1x1",
									wide: "1x1"
								},
								options: {
									accent: "light",
									format: "power",
									status: "none"
								}
							},
							{
								id: "en-t-ev",
								type: "metrictile",
								entity: "sensor.other_tesla_model_3_battery_level",
								name: "Electric Vehicle",
								icon: "mdi:car-electric",
								size: {
									compact: "1x1",
									medium: "1x1",
									wide: "1x1"
								},
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
				{
					id: "en-solar-charging",
					type: "solarcharging",
					name: "Solar charging",
					size: {
						compact: "2x2",
						medium: "2x2",
						wide: "2x2"
					},
					options: {
						brand: "tesla",
						master: "input_boolean.tesla_solar_charging_active",
						vehicleConnected: "binary_sensor.tesla_wall_connector_vehicle_connected",
						chargingState: "sensor.other_tesla_model_3_charging",
						wallStatus: "sensor.tesla_wall_connector_status",
						chargePower: "sensor.tesla_wall_connector_total_power",
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
				{
					id: "en-total",
					type: "electricitytotal",
					name: "Electricity Total",
					size: {
						compact: "4x2",
						medium: "4x2",
						wide: "4x2"
					},
					options: {
						importEnergy: "sensor.p1_meter_energy_import",
						exportEnergy: "sensor.p1_meter_energy_export"
					}
				}
			]
		}
	]
}, ht, gt, _t, vt, yt, bt, xt = t((() => {
	ht = [
		"1x1",
		"2x1",
		"1x2",
		"2x2",
		"3x3",
		"4x2"
	], gt = [
		"compact",
		"medium",
		"wide"
	], _t = [
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
	], vt = [
		"media",
		"devices",
		"sensors",
		"energy",
		"tiles"
	], yt = {
		group: ht,
		binary_sensor: ["1x1", "2x1"],
		person: ["1x1", "2x1"],
		scene: [
			"1x1",
			"2x1",
			"1x2"
		],
		script: ["1x1", "2x1"],
		button: ["1x1", "2x1"],
		camera: ["2x1", "2x2"],
		energy: [
			"2x1",
			"1x2",
			"2x2"
		],
		powerflow: ["2x2", "3x3"],
		solarcharging: [
			"2x1",
			"1x2",
			"2x2"
		],
		energychart: ["2x2", "4x2"],
		metrictile: ["1x1", "2x1"],
		electricitytotal: ["2x2", "4x2"],
		alarm: [
			"1x1",
			"2x1",
			"2x2"
		],
		action: ["1x1", "2x1"]
	}, bt = [
		"group",
		"energy",
		"powerflow",
		"solarcharging",
		"energychart",
		"electricitytotal",
		"action"
	];
}));
//#endregion
//#region src/home-assistant/capabilities.ts
function j(e, t) {
	return e ? ((e.attributes.supported_features ?? 0) & t) === t : !1;
}
function St(e) {
	return e.split(".")[0];
}
function Ct(e) {
	return !e || e.state === "unavailable";
}
function wt(e) {
	return !!e && e.state === "unknown";
}
function Tt(e) {
	let t = e?.attributes.supported_color_modes ?? [];
	return {
		brightness: t.some((e) => Mt.has(e)),
		colorTemp: t.includes("color_temp"),
		color: t.some((e) => Nt.has(e)),
		effects: j(e, jt.EFFECT)
	};
}
function Et(e) {
	return {
		open: j(e, M.OPEN),
		close: j(e, M.CLOSE),
		stop: j(e, M.STOP),
		setPosition: j(e, M.SET_POSITION),
		tilt: j(e, M.OPEN_TILT) || j(e, M.CLOSE_TILT),
		setTilt: j(e, M.SET_TILT_POSITION)
	};
}
function Dt(e) {
	return {
		targetTemp: j(e, Pt.TARGET_TEMPERATURE),
		targetTempRange: j(e, Pt.TARGET_TEMPERATURE_RANGE),
		fanMode: j(e, Pt.FAN_MODE),
		presetMode: j(e, Pt.PRESET_MODE),
		swingMode: j(e, Pt.SWING_MODE),
		humidity: j(e, Pt.TARGET_HUMIDITY)
	};
}
function Ot(e) {
	return {
		play: j(e, N.PLAY),
		pause: j(e, N.PAUSE),
		stop: j(e, N.STOP),
		next: j(e, N.NEXT_TRACK),
		previous: j(e, N.PREVIOUS_TRACK),
		volumeSet: j(e, N.VOLUME_SET),
		volumeStep: j(e, N.VOLUME_STEP),
		mute: j(e, N.VOLUME_MUTE),
		selectSource: j(e, N.SELECT_SOURCE),
		selectSoundMode: j(e, N.SELECT_SOUND_MODE),
		power: j(e, N.TURN_ON) || j(e, N.TURN_OFF)
	};
}
function kt(e) {
	return {
		start: j(e, P.START),
		pause: j(e, P.PAUSE),
		stop: j(e, P.STOP),
		returnHome: j(e, P.RETURN_HOME),
		fanSpeed: j(e, P.FAN_SPEED),
		battery: j(e, P.BATTERY),
		locate: j(e, P.LOCATE)
	};
}
function At(e) {
	return {
		speed: j(e, Ft.SET_SPEED),
		oscillate: j(e, Ft.OSCILLATE),
		direction: j(e, Ft.DIRECTION),
		presetMode: j(e, Ft.PRESET_MODE)
	};
}
var jt, Mt, Nt, M, Pt, N, P, Ft, F = t((() => {
	jt = {
		EFFECT: 4,
		FLASH: 8,
		TRANSITION: 32
	}, Mt = /* @__PURE__ */ new Set([
		"brightness",
		"color_temp",
		"hs",
		"xy",
		"rgb",
		"rgbw",
		"rgbww",
		"white"
	]), Nt = /* @__PURE__ */ new Set([
		"hs",
		"xy",
		"rgb",
		"rgbw",
		"rgbww"
	]), M = {
		OPEN: 1,
		CLOSE: 2,
		SET_POSITION: 4,
		STOP: 8,
		OPEN_TILT: 16,
		CLOSE_TILT: 32,
		STOP_TILT: 64,
		SET_TILT_POSITION: 128
	}, Pt = {
		TARGET_TEMPERATURE: 1,
		TARGET_TEMPERATURE_RANGE: 2,
		TARGET_HUMIDITY: 4,
		FAN_MODE: 8,
		PRESET_MODE: 16,
		SWING_MODE: 32,
		TURN_OFF: 128,
		TURN_ON: 256,
		SWING_HORIZONTAL_MODE: 512
	}, N = {
		PAUSE: 1,
		SEEK: 2,
		VOLUME_SET: 4,
		VOLUME_MUTE: 8,
		PREVIOUS_TRACK: 16,
		NEXT_TRACK: 32,
		TURN_ON: 128,
		TURN_OFF: 256,
		PLAY_MEDIA: 512,
		VOLUME_STEP: 1024,
		SELECT_SOURCE: 2048,
		STOP: 4096,
		PLAY: 16384,
		SELECT_SOUND_MODE: 65536,
		BROWSE_MEDIA: 131072
	}, P = {
		PAUSE: 4,
		STOP: 8,
		RETURN_HOME: 16,
		FAN_SPEED: 32,
		BATTERY: 64,
		LOCATE: 512,
		CLEAN_SPOT: 1024,
		START: 8192
	}, Ft = {
		SET_SPEED: 1,
		OSCILLATE: 2,
		DIRECTION: 4,
		PRESET_MODE: 8
	};
}));
//#endregion
//#region src/home-assistant/service-calls.ts
function It(e, t) {
	let n = { ...t.data ?? {} }, r = t.target ?? {};
	return e.callService(t.domain, t.service, n, r);
}
function Lt(e) {
	let t = St(e);
	return {
		domain: (/* @__PURE__ */ new Set([
			"light",
			"switch",
			"fan",
			"input_boolean",
			"media_player",
			"cover",
			"climate"
		])).has(t) ? t : "homeassistant",
		service: "toggle",
		data: I(e)
	};
}
function Rt(e, t = {}) {
	let n = St(e);
	return {
		domain: [
			"light",
			"switch",
			"fan",
			"media_player",
			"input_boolean",
			"climate",
			"humidifier"
		].includes(n) ? n : "homeassistant",
		service: "turn_on",
		data: I(e, t)
	};
}
function zt(e) {
	let t = St(e);
	return {
		domain: [
			"light",
			"switch",
			"fan",
			"media_player",
			"input_boolean",
			"climate",
			"humidifier"
		].includes(t) ? t : "homeassistant",
		service: "turn_off",
		data: I(e)
	};
}
function Bt(e, t = {}) {
	let n = {};
	return t.brightnessPct != null && (n.brightness_pct = _n(Math.round(t.brightnessPct), 0, 100)), t.colorTempKelvin != null && (n.color_temp_kelvin = Math.round(t.colorTempKelvin)), t.rgbColor && (n.rgb_color = t.rgbColor), t.hsColor && (n.hs_color = [_n(t.hsColor[0], 0, 360), _n(t.hsColor[1], 0, 100)]), t.effect && (n.effect = t.effect), t.transition != null && (n.transition = t.transition), {
		domain: "light",
		service: "turn_on",
		data: I(e, n)
	};
}
function Vt(e, t) {
	let n = _n(Math.round(t), 0, 100);
	return n <= 0 ? zt(e) : Bt(e, { brightnessPct: n });
}
function Ht(e, t) {
	return {
		domain: "climate",
		service: "set_temperature",
		data: I(e, { temperature: t })
	};
}
function Ut(e, t) {
	return {
		domain: "climate",
		service: "set_hvac_mode",
		data: I(e, { hvac_mode: t })
	};
}
function Wt(e, t) {
	return {
		domain: "climate",
		service: "set_fan_mode",
		data: I(e, { fan_mode: t })
	};
}
function Gt(e, t) {
	return {
		domain: "climate",
		service: "set_preset_mode",
		data: I(e, { preset_mode: t })
	};
}
function Kt(e, t) {
	return {
		domain: "climate",
		service: "set_swing_mode",
		data: I(e, { swing_mode: t })
	};
}
function qt(e) {
	return {
		domain: "cover",
		service: "open_cover",
		data: I(e)
	};
}
function Jt(e) {
	return {
		domain: "cover",
		service: "close_cover",
		data: I(e)
	};
}
function Yt(e) {
	return {
		domain: "cover",
		service: "stop_cover",
		data: I(e)
	};
}
function Xt(e, t) {
	return {
		domain: "cover",
		service: "set_cover_position",
		data: I(e, { position: _n(Math.round(t), 0, 100) })
	};
}
function Zt(e) {
	return {
		domain: "media_player",
		service: "media_play_pause",
		data: I(e)
	};
}
function Qt(e) {
	return {
		domain: "media_player",
		service: "media_next_track",
		data: I(e)
	};
}
function $t(e) {
	return {
		domain: "media_player",
		service: "media_previous_track",
		data: I(e)
	};
}
function en(e, t) {
	return {
		domain: "media_player",
		service: "volume_set",
		data: I(e, { volume_level: _n(t, 0, 1) })
	};
}
function tn(e, t) {
	return {
		domain: "media_player",
		service: "volume_mute",
		data: I(e, { is_volume_muted: t })
	};
}
function nn(e, t) {
	return {
		domain: "media_player",
		service: "select_source",
		data: I(e, { source: t })
	};
}
function rn(e, t) {
	return {
		domain: "media_player",
		service: "select_sound_mode",
		data: I(e, { sound_mode: t })
	};
}
function an(e) {
	return {
		domain: "vacuum",
		service: "start",
		data: I(e)
	};
}
function on(e) {
	return {
		domain: "vacuum",
		service: "pause",
		data: I(e)
	};
}
function sn(e) {
	return {
		domain: "vacuum",
		service: "return_to_base",
		data: I(e)
	};
}
function cn(e, t) {
	return {
		domain: "vacuum",
		service: "set_fan_speed",
		data: I(e, { fan_speed: t })
	};
}
function ln(e) {
	return {
		domain: "vacuum",
		service: "locate",
		data: I(e)
	};
}
function un(e) {
	return {
		domain: "lock",
		service: "lock",
		data: I(e)
	};
}
function dn(e) {
	return {
		domain: "lock",
		service: "unlock",
		data: I(e)
	};
}
function fn(e) {
	return {
		domain: "scene",
		service: "turn_on",
		data: I(e)
	};
}
function pn(e) {
	return {
		domain: "script",
		service: "turn_on",
		data: I(e)
	};
}
function mn(e) {
	return {
		domain: "button",
		service: "press",
		data: I(e)
	};
}
function hn(e, t) {
	return {
		domain: St(e) === "number" ? "number" : "input_number",
		service: "set_value",
		data: I(e, { value: t })
	};
}
function gn(e, t) {
	return {
		domain: "fan",
		service: "set_percentage",
		data: I(e, { percentage: _n(Math.round(t), 0, 100) })
	};
}
function _n(e, t, n) {
	return Math.min(n, Math.max(t, e));
}
var I, L = t((() => {
	F(), I = (e, t = {}) => ({
		entity_id: e,
		...t
	});
}));
//#endregion
//#region src/home-assistant/state-formatting.ts
function vn(e, t) {
	return e?.attributes.friendly_name?.trim() || t;
}
function yn(e, t) {
	if (!t) return "—";
	if (Ct(t)) return "Unavailable";
	if (wt(t)) return "Unknown";
	if (e?.formatEntityState) try {
		return e.formatEntityState(t);
	} catch {}
	return xn(t);
}
function bn(e, t, n) {
	if (!t) return "—";
	if (e?.formatEntityAttributeValue) try {
		return e.formatEntityAttributeValue(t, n);
	} catch {}
	let r = t.attributes[n];
	return r == null ? "—" : String(r);
}
function xn(e) {
	let t = e.attributes.unit_of_measurement, n = Number(e.state);
	return !Number.isNaN(n) && e.state.trim() !== "" ? t ? `${R(n)} ${t}` : R(n) : z(e.state);
}
function R(e, t = 1) {
	if (!Number.isFinite(e)) return "—";
	let n = Math.abs(e), r = n >= 100 ? 0 : n >= 10 ? 1 : t;
	try {
		return new Intl.NumberFormat(void 0, {
			maximumFractionDigits: r,
			minimumFractionDigits: 0
		}).format(e);
	} catch {
		return e.toFixed(r);
	}
}
function z(e) {
	return e.replace(/[_-]+/g, " ").replace(/\b\w/g, (e) => e.toUpperCase()).trim();
}
function Sn(e) {
	if (!e) return "";
	let t = new Date(e).getTime();
	if (Number.isNaN(t)) return "";
	let n = Math.round((Date.now() - t) / 1e3), r = Math.abs(n), i = Cn(), [a, o] = r < 60 ? [-n, "second"] : r < 3600 ? [-Math.round(n / 60), "minute"] : r < 86400 ? [-Math.round(n / 3600), "hour"] : [-Math.round(n / 86400), "day"];
	return r < 45 ? "just now" : i ? i.format(a, o) : `${Math.abs(a)} ${o}${Math.abs(a) === 1 ? "" : "s"} ${a < 0 ? "ago" : "from now"}`;
}
function Cn() {
	if (Tn !== void 0) return Tn;
	try {
		Tn = new Intl.RelativeTimeFormat(void 0, { numeric: "auto" });
	} catch {
		Tn = null;
	}
	return Tn;
}
function wn(e) {
	if (!Number.isFinite(e) || e < 0) return "0:00";
	let t = Math.floor(e % 60), n = Math.floor(e / 60 % 60), r = Math.floor(e / 3600), i = r > 0 ? String(n).padStart(2, "0") : String(n), a = String(t).padStart(2, "0");
	return r > 0 ? `${r}:${i}:${a}` : `${i}:${a}`;
}
var Tn, B = t((() => {
	F();
}));
//#endregion
//#region src/home-assistant/vacuum-companions.ts
function En(e, t, n) {
	let r = e?.states[t];
	if (!r || (n.push(t), Ct(r) || wt(r))) return;
	let i = Number(r.state);
	return Number.isFinite(i) ? i : void 0;
}
function Dn(e, t, n) {
	let r = e?.states[t];
	if (r && (n.push(t), !(Ct(r) || wt(r)))) return r.state || void 0;
}
function On(e, t) {
	let n = [], r = {
		consumables: [],
		ids: n
	};
	if (!e || !t) return r;
	let i = t.split(".")[1];
	if (!i) return r;
	let a = `sensor.${i}_`, o = [];
	for (let [t, r] of kn) {
		let i = En(e, a + t, n);
		i != null && o.push({
			key: t,
			label: r,
			hoursLeft: i
		});
	}
	return {
		battery: En(e, a + "battery", n),
		status: Dn(e, a + "status", n),
		room: Dn(e, a + "current_room", n),
		progress: En(e, a + "cleaning_progress", n),
		area: En(e, a + "cleaning_area", n),
		cleaningTime: En(e, a + "cleaning_time", n),
		consumables: o,
		ids: n
	};
}
var kn, An = t((() => {
	F(), kn = [
		["main_brush_time_left", "Main brush"],
		["side_brush_time_left", "Side brush"],
		["filter_time_left", "Filter"],
		["sensor_time_left", "Sensors"],
		["dock_maintenance_brush_time_left", "Dock brush"],
		["dock_strainer_time_left", "Dock strainer"]
	];
}));
//#endregion
//#region src/home-assistant/entity-adapters/icons.ts
function jn(e, t) {
	let n = t?.attributes.device_class;
	return n && Pn[e]?.[n] ? Pn[e][n] : Fn[e] ?? "mdi:help-circle-outline";
}
function Mn(e) {
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
	}[e] ?? "mdi:weather-cloudy";
}
function Nn(e, t) {
	let n = Math.round(e / 10) * 10;
	return t ? n >= 100 ? "mdi:battery-charging-100" : n <= 10 ? "mdi:battery-charging-10" : `mdi:battery-charging-${n}` : n >= 100 ? "mdi:battery" : n <= 5 ? "mdi:battery-alert-variant-outline" : `mdi:battery-${n}`;
}
var Pn, Fn, In = t((() => {
	Pn = {
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
	}, Fn = {
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
}));
//#endregion
//#region src/home-assistant/entity-adapters/index.ts
function Ln(e, t, n) {
	let r = n?.name ?? "Unknown";
	if (!t) return Jn("", r, "mdi:help-circle-outline", "Not configured");
	let i = St(t), a = ta(t), o = e?.states[t];
	if (a) return Jn(t, n?.name ?? "Configure me", n?.icon ?? jn(i, void 0), "Replace placeholder id");
	if (!o) return {
		entityId: t,
		domain: i,
		exists: !1,
		available: !1,
		unknown: !1,
		isPlaceholder: !1,
		name: n?.name ?? z(t.split(".")[1] ?? t),
		icon: n?.icon ?? jn(i, void 0),
		rawState: "missing",
		displayState: "Not found",
		secondary: "Entity unavailable",
		active: !1,
		accent: "unavailable",
		quickAction: {
			kind: "none",
			label: "Unavailable"
		}
	};
	let s = n?.name ?? vn(o, z(t.split(".")[1] ?? t)), c = Ct(o), l = wt(o), u = {
		entityId: t,
		domain: i,
		stateObj: o,
		exists: !0,
		available: !c,
		unknown: l,
		isPlaceholder: !1,
		name: s,
		icon: n?.icon ?? o.attributes.icon ?? jn(i, o),
		rawState: o.state,
		displayState: yn(e, o),
		active: !1,
		accent: c ? "unavailable" : "idle",
		quickAction: {
			kind: "none",
			label: s
		}
	};
	return c ? (u.secondary = "Unavailable", u) : Rn(u, o, n, e);
}
function Rn(e, t, n, r) {
	let i = Xn.has(t.state);
	switch (e.domain) {
		case "light": return zn(e, t, n);
		case "switch":
		case "input_boolean": return e.active = t.state === "on", e.accent = e.active ? "accent" : "idle", e.icon = n?.icon ?? t.attributes.icon ?? jn(e.domain, t), e.quickAction = {
			kind: "toggle",
			label: e.active ? "Turn off" : "Turn on",
			call: Lt(e.entityId)
		}, e;
		case "fan": return e.active = t.state === "on", e.accent = e.active ? "accent" : "idle", typeof t.attributes.percentage == "number" && (e.level = t.attributes.percentage), e.secondary = e.active && e.level != null ? `${Math.round(e.level)}%` : void 0, e.quickAction = {
			kind: "toggle",
			label: e.active ? "Turn off" : "Turn on",
			call: Lt(e.entityId)
		}, e;
		case "climate": return Bn(e, t);
		case "cover": return Vn(e, t);
		case "media_player": return Hn(e, t);
		case "lock": return Un(e, t, n);
		case "vacuum": return Wn(e, t, r);
		case "binary_sensor": return Gn(e, t);
		case "person":
		case "device_tracker": return Kn(e, t);
		case "sensor": return qn(e, t);
		case "weather": return e.icon = Mn(t.state), e.accent = "accent", e.secondary = t.attributes.temperature == null ? void 0 : `${R(t.attributes.temperature)}°`, e;
		case "scene": return e.accent = "accent", e.displayState = "Scene", e.quickAction = {
			kind: "activate",
			label: "Activate",
			call: fn(e.entityId)
		}, e;
		case "script": return e.active = t.state === "on", e.accent = e.active ? "accent" : "idle", e.displayState = e.active ? "Running" : "Run", e.quickAction = {
			kind: "activate",
			label: "Run",
			call: pn(e.entityId),
			requiresConfirmation: n?.requiresConfirmation
		}, e;
		case "button": return e.accent = "accent", e.displayState = "Press", e.quickAction = {
			kind: "activate",
			label: "Press",
			call: mn(e.entityId),
			requiresConfirmation: n?.requiresConfirmation
		}, e;
		default: return e.active = i, e.accent = i ? "accent" : "idle", e;
	}
}
function zn(e, t, n) {
	let r = t.state === "on";
	e.active = r, e.accent = r ? "light" : "idle", e.icon = n?.icon ?? t.attributes.icon ?? "mdi:lightbulb";
	let i = t.attributes.brightness;
	r && typeof i == "number" ? (e.level = Math.round(i / 255 * 100), e.secondary = `${e.level}%`) : e.secondary = r ? "On" : "Off";
	let a = t.attributes.rgb_color, o = t.attributes.color_mode;
	return r && a && o && [
		"hs",
		"xy",
		"rgb",
		"rgbw",
		"rgbww"
	].includes(o) && (e.rgbCss = `rgb(${a[0]}, ${a[1]}, ${a[2]})`), e.quickAction = {
		kind: "toggle",
		label: r ? "Turn off" : "Turn on",
		call: Lt(e.entityId)
	}, e;
}
function Bn(e, t) {
	let n = t.state;
	e.active = n !== "off";
	let r = ["heat", "heat_cool"].includes(n);
	e.accent = n === "off" ? "idle" : r ? "heat" : n === "cool" ? "cool" : "accent";
	let i = t.attributes.current_temperature, a = t.attributes.temperature;
	e.displayState = z(n);
	let o = [];
	return i != null && o.push(`${R(i)}°`), a != null && n !== "off" && o.push(`→ ${R(a)}°`), e.secondary = o.join("  "), typeof a == "number" && (e.level = a), e.quickAction = {
		kind: "none",
		label: e.name
	}, e;
}
function Vn(e, t) {
	let n = t.attributes.current_position, r = t.state === "open" || typeof n == "number" && n > 0;
	return e.active = r, e.accent = r ? "accent" : "idle", typeof n == "number" ? (e.level = n, e.secondary = `${n}% open`) : e.secondary = z(t.state), e.quickAction = {
		kind: "none",
		label: e.name
	}, e;
}
function Hn(e, t) {
	let n = t.state, r = n === "playing";
	e.active = [
		"playing",
		"paused",
		"on",
		"buffering"
	].includes(n), e.accent = r || e.active ? "accent" : "idle", e.icon = e.active ? "mdi:cast-connected" : "mdi:cast";
	let i = t.attributes.media_title, a = t.attributes.app_name, o = t.attributes.source;
	return e.displayState = r ? "Playing" : z(n), e.secondary = i ?? a ?? o ?? void 0, e.quickAction = {
		kind: "none",
		label: e.name
	}, e;
}
function Un(e, t, n) {
	let r = t.state === "locked";
	return e.active = !r, e.accent = r ? "eco" : "warn", e.icon = r ? "mdi:lock" : "mdi:lock-open-variant", e.displayState = z(t.state), e.quickAction = {
		kind: "toggle",
		label: r ? "Unlock" : "Lock",
		call: r ? dn(e.entityId) : un(e.entityId),
		requiresConfirmation: r || n?.requiresConfirmation
	}, e;
}
function Wn(e, t, n) {
	let r = t.state, i = r === "cleaning", a = r === "error", o = On(n, e.entityId);
	e.active = i, e.accent = a ? "alert" : i ? "accent" : "idle";
	let s = z((o.status ?? r).replace(/_/g, " "));
	e.displayState = i && o.room ? `Cleaning ${o.room}` : s, typeof o.progress == "number" && i && (e.level = o.progress);
	let c = o.battery ?? t.attributes.battery_level;
	if (i && typeof o.progress == "number") {
		let t = typeof o.area == "number" && o.area > 0 ? ` · ${R(o.area)} m²` : "";
		e.secondary = `${Math.round(o.progress)}%${t}`;
	} else e.secondary = c == null ? void 0 : `${Math.round(c)}% battery`;
	return e.quickAction = r === "docked" || r === "idle" ? {
		kind: "toggle",
		label: "Start",
		call: an(e.entityId)
	} : {
		kind: "toggle",
		label: "Return to dock",
		call: sn(e.entityId)
	}, e;
}
function Gn(e, t) {
	let n = t.state === "on";
	e.active = n;
	let r = t.attributes.device_class;
	return e.accent = n && r && Zn.has(r) ? "alert" : n ? "accent" : "idle", e.secondary = Sn(t.last_changed), e;
}
function Kn(e, t) {
	let n = t.state === "home";
	return e.active = n, e.accent = n ? "eco" : "idle", e.icon = n ? "mdi:home-account" : "mdi:home-export-outline", e.displayState = n ? "Home" : z(t.state), e.secondary = Sn(t.last_changed), e;
}
function qn(e, t) {
	let n = t.attributes.device_class, r = Number(t.state);
	return e.accent = "idle", n === "battery" && !Number.isNaN(r) && (e.icon = Nn(r, t.attributes.battery_charging ?? !1), e.accent = r <= 15 ? "warn" : "eco"), e.secondary = void 0, e.quickAction = {
		kind: "none",
		label: e.name
	}, e;
}
function Jn(e, t, n, r) {
	return {
		entityId: e,
		domain: e ? St(e) : "",
		exists: !1,
		available: !1,
		unknown: !1,
		isPlaceholder: !0,
		name: t,
		icon: n,
		rawState: "placeholder",
		displayState: "Set up",
		secondary: r,
		active: !1,
		accent: "unavailable",
		quickAction: {
			kind: "none",
			label: "Configure"
		}
	};
}
function Yn(e) {
	switch (e) {
		case "light": return {
			fg: "var(--state-light)",
			bg: "var(--state-light-soft)"
		};
		case "heat": return {
			fg: "var(--state-heat)",
			bg: "var(--state-heat-soft)"
		};
		case "cool": return {
			fg: "var(--state-cool)",
			bg: "var(--state-cool-soft)"
		};
		case "eco": return {
			fg: "var(--state-eco)",
			bg: "var(--state-eco-soft)"
		};
		case "warn": return {
			fg: "var(--state-warn)",
			bg: "var(--state-warn-soft)"
		};
		case "alert": return {
			fg: "var(--state-alert)",
			bg: "var(--state-alert-soft)"
		};
		case "accent": return {
			fg: "var(--accent)",
			bg: "var(--accent-soft)"
		};
		case "unavailable": return {
			fg: "var(--unavailable-fg)",
			bg: "var(--idle-bg)"
		};
		default: return {
			fg: "var(--idle-fg)",
			bg: "var(--idle-bg)"
		};
	}
}
var Xn, Zn, Qn = t((() => {
	aa(), F(), B(), L(), An(), In(), Xn = /* @__PURE__ */ new Set([
		"on",
		"open",
		"playing",
		"home",
		"cleaning",
		"heat",
		"cool",
		"auto",
		"active"
	]), Zn = /* @__PURE__ */ new Set([
		"smoke",
		"gas",
		"moisture",
		"problem",
		"safety",
		"carbon_monoxide",
		"tamper"
	]);
}));
//#endregion
//#region src/primitives/feedback.ts
function $n(e, t) {
	return new Promise((n) => {
		let r = new CustomEvent("hd-confirm", {
			detail: {
				opts: t,
				resolve: n
			},
			bubbles: !0,
			composed: !0
		});
		e.dispatchEvent(r) || n(!1);
	});
}
function er(e, t) {
	e.dispatchEvent(new CustomEvent("hd-toast", {
		detail: t,
		bubbles: !0,
		composed: !0
	}));
}
var tr = t((() => {})), nr, rr = t((() => {
	nr = {
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
}));
//#endregion
//#region \0@oxc-project+runtime@0.146.0/helpers/esm/decorate.js
function V(e, t, n, r) {
	var i = arguments.length, a = i < 3 ? t : r === null ? r = Object.getOwnPropertyDescriptor(t, n) : r, o;
	if (typeof Reflect == "object" && typeof Reflect.decorate == "function") a = Reflect.decorate(e, t, n, r);
	else for (var s = e.length - 1; s >= 0; s--) (o = e[s]) && (a = (i < 3 ? o(a) : i > 3 ? o(t, n, a) : o(t, n)) || a);
	return i > 3 && a && Object.defineProperty(t, n, a), a;
}
var H = t((() => {})), ir, ar, U = t((() => {
	T(), rr(), H(), ar = (ir = class extends w {
		constructor(...e) {
			super(...e), this.icon = "", this.size = 24;
		}
		render() {
			let e = nr[this.icon], t = `--hd-icon-size:${this.size}px`;
			if (e) return b`<svg viewBox="0 0 24 24" style=${t} aria-hidden="true">
        ${Ne`<path d=${e}></path>`}
      </svg>`;
			if (typeof customElements < "u" && customElements.get("ha-icon") && this.icon) {
				let e = document.createElement("ha-icon");
				return e.setAttribute("icon", this.icon), e.style.setProperty("--mdc-icon-size", `${this.size}px`), e.style.width = `${this.size}px`, e.style.height = `${this.size}px`, b`${e}`;
			}
			return this.icon ? b`<span class="dot" style=${t}></span>` : S;
		}
	}, ir.styles = l`
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
  `, ir), V([E({ type: String })], ar.prototype, "icon", void 0), V([E({ type: Number })], ar.prototype, "size", void 0), ar = V([k("hd-icon")], ar);
})), or, W, G = t((() => {
	T(), O(), A(), Qn(), U(), H(), W = (or = class extends w {
		constructor(...e) {
			super(...e), this.icon = "", this.name = "", this.stateText = "", this.secondary = "", this.size = "1x1", this.accent = "idle", this.glyphColor = "", this.active = !1, this.unavailable = !1, this.hasDetail = !1, this.quickKind = "none", this.quickLabel = "", this.actionState = "idle", this.bleed = !1, this.layout = "row";
		}
		connectedCallback() {
			super.connectedCallback(), this.setAttribute("data-size", this.size);
		}
		updated(e) {
			e.has("size") && this.setAttribute("data-size", this.size);
		}
		get _bodyAction() {
			return this.unavailable ? null : this.hasDetail ? "detail" : this.quickKind === "activate" ? "quick" : null;
		}
		_quick(e) {
			if (e.stopPropagation(), !this.unavailable) {
				if (this.quickKind === "none") {
					this.hasDetail && this._emit("hd-activate");
					return;
				}
				this._emit("hd-quick");
			}
		}
		_body(e) {
			e.stopPropagation();
			let t = this._bodyAction;
			t === "detail" ? this._emit("hd-activate") : t === "quick" && this._emit("hd-quick");
		}
		_emit(e) {
			this.dispatchEvent(new CustomEvent(e, {
				bubbles: !0,
				composed: !0
			}));
		}
		_stop(e) {
			e.stopPropagation();
		}
		render() {
			let e = Yn(this.accent), t = this.glyphColor || e.fg, n = `--icon-bg:${e.bg};--icon-fg:${t};--accent-ring:${e.fg};--state-color:${this.active ? e.fg : "var(--text-secondary)"}`, r = (this.quickKind !== "none" || this.hasDetail) && !this.unavailable, i = this._bodyAction, a = this.quickKind === "none" ? this.hasDetail ? `${this.name} details` : this.name : this.quickLabel || this.name, o = i === "detail" ? `${this.name} details` : this.name;
			return this.bleed ? b`<div
        class="card bleed"
        data-clickable=${i ? "true" : "false"}
        style=${n}
        @click=${this._body}
      >
        <slot></slot>
      </div>` : this.layout === "tile" ? this._renderTile(n, i, r, a, o) : this.layout === "value" ? this._renderValue(n, i, o) : this._renderRow(n, i, r, a, o);
		}
		_iconButton(e, t) {
			return b`<button
      class="icon-btn ${this.actionState}"
      data-interactive=${e ? "true" : "false"}
      aria-label=${t}
      ?disabled=${this.unavailable && this.quickKind !== "none"}
      @click=${this._quick}
    >
      <hd-icon .icon=${this.icon} .size=${24}></hd-icon>
    </button>`;
		}
		_titleBlock(e, t) {
			let n = b`<span class="name">${this.name}</span>
      ${this.stateText ? b`<span class="state">${this.stateText}</span>` : S}
      ${this.secondary ? b`<span class="secondary">${this.secondary}</span>` : S}`;
			return e ? b`<button class="titles" aria-label=${t} @click=${this._body}>${n}</button>` : b`<div class="titles">${n}</div>`;
		}
		_renderRow(e, t, n, r, i) {
			return b`
      <div class="card" data-clickable=${t ? "true" : "false"} style=${e} @click=${this._body}>
        <div class="header">
          ${this._iconButton(n, r)} ${this._titleBlock(t, i)}
          <div class="badge">
            <slot name="badge"></slot>
            ${this.hasDetail && this.quickKind === "none" ? b`<hd-icon class="chev" icon="mdi:chevron-right" .size=${20}></hd-icon>` : S}
          </div>
        </div>
        <div class="body" @click=${this._stop}><slot></slot></div>
      </div>
    `;
		}
		_renderTile(e, t, n, r, i) {
			let a = b`<span class="name">${this.name}</span>
      ${this.stateText ? b`<span class="state">${this.stateText}</span>` : S}`;
			return b`
      <div class="card tile" data-clickable=${t ? "true" : "false"} style=${e} @click=${this._body}>
        <div class="tile-top">
          ${this._iconButton(n, r)}
          <span class="accessory">
            <slot name="badge">${this.active ? b`<span class="dot"></span>` : S}</slot>
          </span>
        </div>
        ${t ? b`<button class="tile-foot" aria-label=${i} @click=${this._body}>${a}</button>` : b`<div class="tile-foot">${a}</div>`}
      </div>
    `;
		}
		_renderValue(e, t, n) {
			let r = b`<span class="val-label">${this.name}</span>
      <span class="val-value">
        ${this.stateText ? b`<span>${this.stateText}</span>` : S}
        <slot></slot>
      </span>`;
			return b`
      <div class="card value" data-clickable=${t ? "true" : "false"} style=${e} @click=${this._body}>
        ${t ? b`<button class="val-main" aria-label=${n} @click=${this._body}>${r}</button>` : b`<div class="val-main">${r}</div>`}
        <span class="val-icon"><hd-icon .icon=${this.icon} .size=${22}></hd-icon></span>
      </div>
    `;
		}
	}, or.styles = l`
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
      min-height: 44px;
      box-sizing: border-box;
      justify-content: center;
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
    :host([data-size="1x1"]) .card.tile {
      /* A compact square still contains two 44px+ interaction targets. Keep
         the spacing lean enough that neither target nor padding is clipped. */
      --pad: 10px;
      gap: 0;
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
      min-height: 44px;
      box-sizing: border-box;
      justify-content: flex-end;
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
      min-height: 44px;
      box-sizing: border-box;
      justify-content: center;
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
  `, or), V([E({ type: String })], W.prototype, "icon", void 0), V([E({ type: String })], W.prototype, "name", void 0), V([E({ type: String })], W.prototype, "stateText", void 0), V([E({ type: String })], W.prototype, "secondary", void 0), V([E({ type: String })], W.prototype, "size", void 0), V([E({ type: String })], W.prototype, "accent", void 0), V([E({ type: String })], W.prototype, "glyphColor", void 0), V([E({
		type: Boolean,
		reflect: !0
	})], W.prototype, "active", void 0), V([E({
		type: Boolean,
		reflect: !0
	})], W.prototype, "unavailable", void 0), V([E({ type: Boolean })], W.prototype, "hasDetail", void 0), V([E({ type: String })], W.prototype, "quickKind", void 0), V([E({ type: String })], W.prototype, "quickLabel", void 0), V([E({ type: String })], W.prototype, "actionState", void 0), V([E({ type: Boolean })], W.prototype, "bleed", void 0), V([E({ type: String })], W.prototype, "layout", void 0), W = V([k("hd-widget-frame")], W);
})), K, q = t((() => {
	T(), O(), L(), Qn(), tr(), G(), H(), K = class extends w {
		constructor(...e) {
			super(...e), this.currentSize = "1x1", this.layout = "row", this.actionState = "idle", this._resetTimer = 0;
		}
		get entityId() {
			return this.config?.entity;
		}
		get vm() {
			return Ln(this.hass, this.entityId, this.config);
		}
		get isConnected2() {
			return this.hass?.connected !== !1;
		}
		relevantEntityIds() {
			return this.entityId ? [this.entityId] : [];
		}
		hasDetail() {
			return !0;
		}
		shouldUpdate(e) {
			if (!(e.size === 1 && e.has("hass"))) return !0;
			let t = e.get("hass");
			return !t || !this.hass || t.connected !== this.hass.connected || this.relevantEntityIds().some((e) => t.states[e] !== this.hass.states[e]);
		}
		render() {
			try {
				return this.renderContent();
			} catch (e) {
				let t = this.config?.id ?? this.config?.type ?? this.entityId ?? "?";
				return console.error(`[hd-widget ${t}] render failed:`, e), this._renderErrorTile();
			}
		}
		_renderErrorTile() {
			let e = this.config?.name || this.config?.entity || "Widget";
			return b`<hd-widget-frame
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
			this.hasDetail() && this.dispatchEvent(new CustomEvent("hd-open-detail", {
				detail: {
					entityId: this.entityId,
					config: this.config,
					type: this.config.type
				},
				bubbles: !0,
				composed: !0
			}));
		}
		async runQuick() {
			let e = this.vm, t = e.quickAction;
			if (!(!this.isConnected2 || e.isPlaceholder || !e.exists)) {
				if (t.kind === "none" || !t.call) {
					this.hasDetail() && this.openDetail();
					return;
				}
				if (t.requiresConfirmation) {
					let n = e.domain === "lock" || e.domain === "alarm_control_panel";
					if (!await $n(this, {
						title: `${t.label} ${e.name}?`,
						confirmLabel: t.label,
						destructive: n,
						icon: e.icon
					})) return;
				}
				await this.callService(t.call, { errorVerb: t.label.toLowerCase() });
			}
		}
		async callService(e, t = {}) {
			if (this.hass) {
				window.clearTimeout(this._resetTimer), this.actionState = "pending";
				try {
					await It(this.hass, e), this.actionState = "success";
				} catch (e) {
					throw this.actionState = "error", er(this, {
						message: `Couldn't ${t.errorVerb ?? "update"} ${this.vm.name}`,
						tone: "alert",
						icon: "mdi:alert-circle-outline"
					}), this._scheduleReset(), e;
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
	}, V([E({ attribute: !1 })], K.prototype, "hass", void 0), V([E({ attribute: !1 })], K.prototype, "config", void 0), V([E({ type: String })], K.prototype, "currentSize", void 0), V([E({ type: String })], K.prototype, "layout", void 0), V([D()], K.prototype, "actionState", void 0);
})), sr, J, cr = t((() => {
	T(), O(), A(), U(), H(), J = (sr = class extends w {
		constructor(...e) {
			super(...e), this.value = 0, this.min = 0, this.max = 100, this.step = 1, this.vertical = !1, this.disabled = !1, this.label = "", this.icon = "", this.valueText = "", this.color = "var(--accent)", this._dragging = !1, this._dragValue = 0, this._raf = 0;
		}
		get _current() {
			return this._dragging ? this._dragValue : this.value;
		}
		_ratio() {
			let e = this.max - this.min || 1;
			return Math.min(1, Math.max(0, (this._current - this.min) / e));
		}
		_snap(e) {
			let t = this.max - this.min, n = Math.round((e - this.min) / this.step) * this.step + this.min;
			return n = Math.min(this.max, Math.max(this.min, n)), Math.abs(t) > 0 ? Number(n.toFixed(4)) : n;
		}
		_valueFromPointer(e) {
			let t = this.renderRoot.querySelector(".track").getBoundingClientRect(), n;
			return n = this.vertical ? 1 - (e.clientY - t.top) / t.height : (e.clientX - t.left) / t.width, n = Math.min(1, Math.max(0, n)), this._snap(this.min + n * (this.max - this.min));
		}
		_onPointerDown(e) {
			this.disabled || (e.preventDefault(), e.target.setPointerCapture(e.pointerId), this._dragging = !0, this._dragValue = this._valueFromPointer(e), this._emit("hd-input"));
		}
		_onPointerMove(e) {
			if (!this._dragging) return;
			let t = this._valueFromPointer(e);
			t !== this._dragValue && (this._dragValue = t, !this._raf && (this._raf = requestAnimationFrame(() => {
				this._raf = 0, this._emit("hd-input");
			})));
		}
		_onPointerUp(e) {
			if (!this._dragging) return;
			this._raf &&= (cancelAnimationFrame(this._raf), 0);
			let t = this._valueFromPointer(e);
			this._dragValue = t, this.value = t, this._dragging = !1, this._emit("hd-change");
		}
		_onKeyDown(e) {
			if (this.disabled) return;
			let t = Math.max(this.step, (this.max - this.min) / 10), n;
			switch (e.key) {
				case "ArrowUp":
				case "ArrowRight":
					n = this.value + this.step;
					break;
				case "ArrowDown":
				case "ArrowLeft":
					n = this.value - this.step;
					break;
				case "PageUp":
					n = this.value + t;
					break;
				case "PageDown":
					n = this.value - t;
					break;
				case "Home":
					n = this.min;
					break;
				case "End":
					n = this.max;
					break;
				default: return;
			}
			e.preventDefault(), n = this._snap(n), n !== this.value && (this.value = n, this._emit("hd-input"), this._emit("hd-change"));
		}
		_emit(e) {
			this.dispatchEvent(new CustomEvent(e, {
				detail: { value: this._current },
				bubbles: !0,
				composed: !0
			}));
		}
		render() {
			let e = `${this._ratio() * 100}%`;
			return b`
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
        style=${`--fill:${e};--fill-color:${this.color}`}
        @pointerdown=${this._onPointerDown}
        @pointermove=${this._onPointerMove}
        @pointerup=${this._onPointerUp}
        @pointercancel=${this._onPointerUp}
        @keydown=${this._onKeyDown}
      >
        <div class="fill"></div>
        <div class="content">
          ${this.icon ? b`<hd-icon .icon=${this.icon} .size=${20}></hd-icon>` : S}
          ${this.valueText ? b`<span class="val">${this.valueText}</span>` : S}
        </div>
      </div>
    `;
		}
	}, sr.styles = l`
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
  `, sr), V([E({ type: Number })], J.prototype, "value", void 0), V([E({ type: Number })], J.prototype, "min", void 0), V([E({ type: Number })], J.prototype, "max", void 0), V([E({ type: Number })], J.prototype, "step", void 0), V([E({
		type: Boolean,
		reflect: !0
	})], J.prototype, "vertical", void 0), V([E({
		type: Boolean,
		reflect: !0
	})], J.prototype, "disabled", void 0), V([E({ type: String })], J.prototype, "label", void 0), V([E({ type: String })], J.prototype, "icon", void 0), V([E({ type: String })], J.prototype, "valueText", void 0), V([E({ type: String })], J.prototype, "color", void 0), V([D()], J.prototype, "_dragging", void 0), V([D()], J.prototype, "_dragValue", void 0), J = V([k("hd-slider")], J);
})), lr = /* @__PURE__ */ n({ LightWidget: () => dr }), ur, dr, fr = t((() => {
	T(), O(), A(), q(), F(), L(), G(), cr(), H(), dr = (ur = class extends K {
		constructor(...e) {
			super(...e), this._optimistic = null, this._optimisticTs = 0, this._debounce = 0;
		}
		get _displayLevel() {
			let e = this.vm, t = e.level ?? (e.active ? 100 : 0);
			return this._optimistic == null ? t : Math.abs(t - this._optimistic) <= 3 || Date.now() - this._optimisticTs > 1600 ? (this._optimistic = null, t) : this._optimistic;
		}
		_onInput(e) {
			this._optimistic = e, this._optimisticTs = Date.now(), window.clearTimeout(this._debounce), this._debounce = window.setTimeout(() => {
				this.entityId && this.callService(Vt(this.entityId, e), { errorVerb: "dim" });
			}, 180);
		}
		_onChange(e) {
			this._optimistic = e, this._optimisticTs = Date.now(), window.clearTimeout(this._debounce), this.entityId && this.callService(Vt(this.entityId, e), { errorVerb: "dim" });
		}
		_onTemp(e) {
			this.entityId && this.callService(Bt(this.entityId, { colorTempKelvin: e }), { errorVerb: "set color of" });
		}
		_renderBrightness(e) {
			let t = this.vm, n = this._displayLevel, r = !t.available || !t.active;
			return b`<hd-slider
      class=${e ? "vert" : ""}
      .vertical=${e}
      .value=${n}
      .min=${1}
      .max=${100}
      .step=${1}
      .disabled=${r}
      .valueText=${t.active ? `${Math.round(n)}%` : "Off"}
      .icon=${"mdi:brightness-6"}
      .color=${t.rgbCss || "var(--state-light)"}
      label=${`Brightness of ${t.name}`}
      @hd-input=${(e) => this._onInput(e.detail.value)}
      @hd-change=${(e) => this._onChange(e.detail.value)}
    ></hd-slider>`;
		}
		_renderTemp() {
			let e = this.vm, t = e.stateObj, n = t?.attributes.min_color_temp_kelvin ?? 2200, r = t?.attributes.max_color_temp_kelvin ?? 6500, i = t?.attributes.color_temp_kelvin ?? Math.round((n + r) / 2);
			return b`<div class="temp-row">
      <span class="temp-label">Warm</span>
      <hd-slider
        style="flex:1"
        .value=${i}
        .min=${n}
        .max=${r}
        .step=${50}
        .disabled=${!e.active}
        .color=${"linear-gradient(90deg,#ffb85c,#fff5e8)"}
        label=${`Color temperature of ${e.name}`}
        @hd-change=${(e) => this._onTemp(e.detail.value)}
      ></hd-slider>
      <span class="temp-label">Cool</span>
    </div>`;
		}
		renderContent() {
			let e = this.vm, t = Tt(e.stateObj), n = this.currentSize, r = t.brightness && (n === "2x1" || n === "1x2" || n === "2x2"), i = n === "1x2", a = t.colorTemp && n === "2x2";
			return b`
      <hd-widget-frame
        .icon=${e.icon}
        .layout=${this.layout}
        .name=${e.name}
        .stateText=${e.displayState}
        .size=${n}
        .accent=${e.accent}
        .glyphColor=${e.rgbCss || ""}
        .active=${e.active}
        .unavailable=${!e.available}
        .hasDetail=${!0}
        .quickKind=${"toggle"}
        .quickLabel=${e.quickAction.label}
        .actionState=${this.actionState}
        @hd-quick=${() => this.runQuick()}
        @hd-activate=${() => this.openDetail()}
      >
        ${r ? b`<div class="col">
              ${i ? this._renderBrightness(!0) : S}
              ${i ? S : this._renderBrightness(!1)}
              ${a ? this._renderTemp() : S}
            </div>` : S}
      </hd-widget-frame>
    `;
		}
		disconnectedCallback() {
			super.disconnectedCallback(), window.clearTimeout(this._debounce);
		}
	}, ur.styles = l`
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
  `, ur), V([D()], dr.prototype, "_optimistic", void 0), dr = V([k("hd-widget-light")], dr);
})), pr, Y, mr = t((() => {
	T(), O(), A(), U(), H(), Y = (pr = class extends w {
		constructor(...e) {
			super(...e), this.icon = "", this.label = "", this.disabled = !1, this.loading = !1, this.variant = "plain", this.size = 22;
		}
		render() {
			return b`
      <button
        ?disabled=${this.disabled || this.loading}
        aria-label=${this.label || this.icon}
        aria-busy=${this.loading ? "true" : "false"}
      >
        ${this.loading ? b`<span class="spin" role="progressbar"></span>` : b`<hd-icon .icon=${this.icon} .size=${this.size}></hd-icon>`}
      </button>
    `;
		}
	}, pr.styles = l`
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
  `, pr), V([E({ type: String })], Y.prototype, "icon", void 0), V([E({ type: String })], Y.prototype, "label", void 0), V([E({
		type: Boolean,
		reflect: !0
	})], Y.prototype, "disabled", void 0), V([E({
		type: Boolean,
		reflect: !0
	})], Y.prototype, "loading", void 0), V([E({ type: String })], Y.prototype, "variant", void 0), V([E({ type: Number })], Y.prototype, "size", void 0), Y = V([k("hd-icon-button")], Y);
})), hr, gr, _r = t((() => {
	T(), O(), A(), U(), H(), gr = (hr = class extends w {
		constructor(...e) {
			super(...e), this.options = [], this.value = "", this.disabled = !1, this.label = "";
		}
		_select(e) {
			this.disabled || e === this.value || (this.value = e, this.dispatchEvent(new CustomEvent("hd-select", {
				detail: { value: e },
				bubbles: !0,
				composed: !0
			})));
		}
		_onKey(e, t) {
			if (e.key !== "ArrowLeft" && e.key !== "ArrowRight") return;
			e.preventDefault();
			let n = (t + (e.key === "ArrowRight" ? 1 : -1) + this.options.length) % this.options.length, r = this.options[n];
			this._select(r.value), this.renderRoot.querySelectorAll("button")[n]?.focus();
		}
		render() {
			return b`
      <div class="group" role="radiogroup" aria-label=${this.label}>
        ${this.options.map((e, t) => b`
            <button
              role="radio"
              aria-checked=${e.value === this.value ? "true" : "false"}
              tabindex=${e.value === this.value ? 0 : -1}
              @click=${() => this._select(e.value)}
              @keydown=${(e) => this._onKey(e, t)}
            >
              ${e.icon ? b`<hd-icon .icon=${e.icon} .size=${18}></hd-icon>` : S}
              ${e.label ? b`<span>${e.label}</span>` : S}
            </button>
          `)}
      </div>
    `;
		}
	}, hr.styles = l`
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
  `, hr), V([E({ attribute: !1 })], gr.prototype, "options", void 0), V([E({ type: String })], gr.prototype, "value", void 0), V([E({
		type: Boolean,
		reflect: !0
	})], gr.prototype, "disabled", void 0), V([E({ type: String })], gr.prototype, "label", void 0), gr = V([k("hd-segmented")], gr);
})), vr = /* @__PURE__ */ n({ ClimateWidget: () => xr }), yr, br, xr, Sr = t((() => {
	T(), O(), A(), q(), F(), L(), B(), G(), mr(), _r(), H(), br = {
		off: "mdi:power",
		heat: "mdi:fire",
		cool: "mdi:snowflake",
		heat_cool: "mdi:thermostat-auto",
		auto: "mdi:thermostat-auto",
		dry: "mdi:water-percent",
		fan_only: "mdi:fan"
	}, xr = (yr = class extends K {
		constructor(...e) {
			super(...e), this._optimisticTarget = null, this._optimisticTs = 0, this._debounce = 0;
		}
		get _target() {
			let e = this.vm.stateObj?.attributes.temperature ?? 20;
			return this._optimisticTarget == null ? e : this._optimisticTarget === e || Date.now() - this._optimisticTs > 1600 ? (this._optimisticTarget = null, e) : this._optimisticTarget;
		}
		_step(e) {
			let t = this.vm;
			if (!t.available || t.rawState === "off") return;
			let n = t.stateObj?.attributes.target_temp_step ?? .5, r = t.stateObj?.attributes.min_temp ?? 7, i = t.stateObj?.attributes.max_temp ?? 35, a = Math.min(i, Math.max(r, this._target + e * n));
			this._optimisticTarget = Number(a.toFixed(1)), this._optimisticTs = Date.now(), this.requestUpdate(), window.clearTimeout(this._debounce), this._debounce = window.setTimeout(() => {
				this.entityId && this.callService(Ht(this.entityId, this._optimisticTarget), { errorVerb: "set temperature for" });
			}, 350);
		}
		_setMode(e) {
			this.entityId && this.callService(Ut(this.entityId, e), { errorVerb: "set mode for" });
		}
		_renderStepper(e) {
			let t = this.vm, n = t.rawState === "off", r = t.stateObj?.attributes.current_temperature;
			return b`<div>
      <div class="stepper ${e ? "center" : ""}">
        <hd-icon-button
          icon="mdi:minus"
          label="Lower target temperature"
          variant="soft"
          .disabled=${n || !t.available}
          @click=${() => this._step(-1)}
        ></hd-icon-button>
        <span class="target">${n ? "—" : `${R(this._target)}°`}</span>
        <hd-icon-button
          icon="mdi:plus"
          label="Raise target temperature"
          variant="soft"
          .disabled=${n || !t.available}
          @click=${() => this._step(1)}
        ></hd-icon-button>
      </div>
      ${r == null ? S : b`<div class="now">Now ${R(r)}°</div>`}
    </div>`;
		}
		_renderModes() {
			let e = this.vm, t = e.stateObj?.attributes.hvac_modes ?? [];
			if (t.length < 2) return S;
			let n = t.map((e) => ({
				value: e,
				icon: br[e] ?? "mdi:thermostat"
			}));
			return b`<div class="modes">
      <hd-segmented
        .options=${n}
        .value=${e.rawState}
        .disabled=${!e.available}
        label="HVAC mode"
        @hd-select=${(e) => this._setMode(e.detail.value)}
      ></hd-segmented>
    </div>`;
		}
		renderContent() {
			let e = this.vm, t = this.currentSize, n = Dt(e.stateObj).targetTemp, r = t === "2x2";
			return b`
      <hd-widget-frame
        .icon=${e.icon}
        .layout=${this.layout}
        .name=${e.name}
        .stateText=${z(e.rawState)}
        .secondary=${e.secondary ?? ""}
        .size=${t}
        .accent=${e.accent}
        .active=${e.active}
        .unavailable=${!e.available}
        .hasDetail=${!0}
        .quickKind=${"none"}
        @hd-activate=${() => this.openDetail()}
      >
        ${n ? this._renderStepper(r) : S}
        ${r ? this._renderModes() : S}
      </hd-widget-frame>
    `;
		}
		disconnectedCallback() {
			super.disconnectedCallback(), window.clearTimeout(this._debounce);
		}
	}, yr.styles = l`
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
  `, yr), V([D()], xr.prototype, "_optimisticTarget", void 0), xr = V([k("hd-widget-climate")], xr);
}));
//#endregion
//#region src/widgets/plain-widget-frame.ts
function Cr(e, t) {
	let n = e.vm, r = e;
	return b`<hd-widget-frame
    .icon=${n.icon}
    .name=${n.name}
    .stateText=${n.displayState}
    .secondary=${n.secondary ?? ""}
    .size=${r.currentSize}
    .layout=${e.layout}
    .accent=${n.accent}
    .active=${n.active}
    .unavailable=${!n.available}
    .hasDetail=${t.hasDetail}
    .quickKind=${t.quickKind}
    .quickLabel=${n.quickAction.label}
    .actionState=${r.actionState}
    @hd-quick=${() => r.runQuick()}
    @hd-activate=${() => r.openDetail()}
  ></hd-widget-frame>`;
}
var wr = t((() => {
	T(), G();
})), Tr = /* @__PURE__ */ n({ SwitchWidget: () => Er }), Er, Dr = t((() => {
	A(), q(), wr(), H(), Er = class extends K {
		renderContent() {
			return Cr(this, {
				quickKind: "toggle",
				hasDetail: !0
			});
		}
	}, Er = V([k("hd-widget-switch")], Er);
})), Or = /* @__PURE__ */ n({ FanWidget: () => Ar }), kr, Ar, jr = t((() => {
	T(), F(), L(), A(), q(), G(), cr(), H(), Ar = (kr = class extends K {
		constructor(...e) {
			super(...e), this._debounce = 0;
		}
		_setPercentage(e, t) {
			window.clearTimeout(this._debounce);
			let n = () => this.entityId && this.callService(gn(this.entityId, e), { errorVerb: "set speed for" });
			t ? n() : this._debounce = window.setTimeout(n, 200);
		}
		renderContent() {
			let e = this.vm, t = At(e.stateObj), n = this.currentSize, r = n === "1x2", i = t.speed && (n === "2x1" || n === "1x2") && e.active, a = e.stateObj?.attributes.percentage ?? 0;
			return b`<hd-widget-frame
      .icon=${e.icon}
      .layout=${this.layout}
      .name=${e.name}
      .stateText=${e.displayState}
      .secondary=${e.secondary ?? ""}
      .size=${n}
      .accent=${e.accent}
      .active=${e.active}
      .unavailable=${!e.available}
      .hasDetail=${!0}
      .quickKind=${"toggle"}
      .quickLabel=${e.quickAction.label}
      .actionState=${this.actionState}
      @hd-quick=${() => this.runQuick()}
      @hd-activate=${() => this.openDetail()}
    >
      ${i ? b`<hd-slider
            class=${r ? "vert" : ""}
            .vertical=${r}
            .value=${a}
            .valueText=${`${Math.round(a)}%`}
            icon="mdi:fan"
            label=${`Speed of ${e.name}`}
            @hd-input=${(e) => this._setPercentage(e.detail.value, !1)}
            @hd-change=${(e) => this._setPercentage(e.detail.value, !0)}
          ></hd-slider>` : S}
    </hd-widget-frame>`;
		}
		disconnectedCallback() {
			super.disconnectedCallback(), window.clearTimeout(this._debounce);
		}
	}, kr.styles = l`
    .vert {
      flex: 1;
      min-height: 120px;
    }
  `, kr), Ar = V([k("hd-widget-fan")], Ar);
})), Mr = /* @__PURE__ */ n({ CoverWidget: () => Pr }), Nr, Pr, Fr = t((() => {
	T(), O(), A(), q(), F(), L(), G(), mr(), cr(), H(), Pr = (Nr = class extends K {
		constructor(...e) {
			super(...e), this._optimistic = null, this._optimisticTs = 0, this._debounce = 0;
		}
		get _position() {
			let e = this.vm, t = e.stateObj?.attributes.current_position ?? (e.rawState === "open" ? 100 : 0);
			return this._optimistic == null ? t : Math.abs(t - this._optimistic) <= 2 || Date.now() - this._optimisticTs > 1600 ? (this._optimistic = null, t) : this._optimistic;
		}
		_setPosition(e, t) {
			this._optimistic = e, this._optimisticTs = Date.now(), window.clearTimeout(this._debounce);
			let n = () => {
				this.entityId && this.callService(Xt(this.entityId, e), { errorVerb: "move" });
			};
			t ? n() : this._debounce = window.setTimeout(n, 200);
		}
		_buttons(e, t) {
			let n = !this.vm.available;
			return b`<div class="controls ${t ? "center" : ""}">
      ${e.open ? b`<hd-icon-button
            icon="mdi:arrow-up"
            label="Open"
            variant="soft"
            .disabled=${n}
            @click=${() => this.entityId && this.callService(qt(this.entityId), { errorVerb: "open" })}
          ></hd-icon-button>` : S}
      ${e.stop ? b`<hd-icon-button
            icon="mdi:stop"
            label="Stop"
            variant="soft"
            .disabled=${n}
            @click=${() => this.entityId && this.callService(Yt(this.entityId), { errorVerb: "stop" })}
          ></hd-icon-button>` : S}
      ${e.close ? b`<hd-icon-button
            icon="mdi:arrow-down"
            label="Close"
            variant="soft"
            .disabled=${n}
            @click=${() => this.entityId && this.callService(Jt(this.entityId), { errorVerb: "close" })}
          ></hd-icon-button>` : S}
    </div>`;
		}
		renderContent() {
			let e = this.vm, t = Et(e.stateObj), n = this.currentSize, r = n === "1x2", i = t.setPosition && n !== "1x1", a;
			return a = r && i ? b`<div class="stack">
        <hd-slider
          class="vert"
          vertical
          .value=${this._position}
          .disabled=${!e.available}
          .valueText=${`${Math.round(this._position)}%`}
          icon="mdi:window-shutter"
          label=${`Position of ${e.name}`}
          @hd-input=${(e) => this._setPosition(e.detail.value, !1)}
          @hd-change=${(e) => this._setPosition(e.detail.value, !0)}
        ></hd-slider>
        ${this._buttons(t, !0)}
      </div>` : i ? b`<div class="stack">
        <hd-slider
          .value=${this._position}
          .disabled=${!e.available}
          .valueText=${`${Math.round(this._position)}% open`}
          label=${`Position of ${e.name}`}
          @hd-input=${(e) => this._setPosition(e.detail.value, !1)}
          @hd-change=${(e) => this._setPosition(e.detail.value, !0)}
        ></hd-slider>
        ${this._buttons(t, !1)}
      </div>` : this._buttons(t, n !== "1x1"), b`
      <hd-widget-frame
        .icon=${e.icon}
        .layout=${this.layout}
        .name=${e.name}
        .stateText=${e.displayState}
        .size=${n}
        .accent=${e.accent}
        .active=${e.active}
        .unavailable=${!e.available}
        .hasDetail=${!0}
        .quickKind=${"none"}
        @hd-activate=${() => this.openDetail()}
      >
        ${a}
      </hd-widget-frame>
    `;
		}
		disconnectedCallback() {
			super.disconnectedCallback(), window.clearTimeout(this._debounce);
		}
	}, Nr.styles = l`
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
  `, Nr), V([D()], Pr.prototype, "_optimistic", void 0), Pr = V([k("hd-widget-cover")], Pr);
})), Ir = /* @__PURE__ */ n({ LockWidget: () => Lr }), Lr, Rr = t((() => {
	A(), q(), wr(), H(), Lr = class extends K {
		renderContent() {
			return Cr(this, {
				quickKind: "toggle",
				hasDetail: !0
			});
		}
	}, Lr = V([k("hd-widget-lock")], Lr);
}));
//#endregion
//#region src/panel/assets.ts
function zr(e, t = !1) {
	let n = e.replace(/^\/+/, "");
	return t ? `/${n}` : `/local/home-dashboard/${n}`;
}
var Br = t((() => {})), Vr = /* @__PURE__ */ n({ VacuumWidget: () => Ur }), Hr, Ur, Wr = t((() => {
	T(), A(), q(), F(), L(), B(), An(), Br(), G(), mr(), U(), _r(), H(), Ur = (Hr = class extends K {
		get _branded() {
			if (this.config.type !== "vacuum") return !1;
			let e = this.config.options ?? {};
			return e.brand === "roborock" || e.branded === !0 || e.hero === !0;
		}
		relevantEntityIds() {
			return [...this.entityId ? [this.entityId] : [], ...On(this.hass, this.entityId).ids];
		}
		_progress() {
			let e = On(this.hass, this.entityId);
			if (this.vm.rawState !== "cleaning" || typeof e.progress != "number") return S;
			let t = Math.max(0, Math.min(100, Math.round(e.progress))), n = [`${t}%`];
			return typeof e.area == "number" && e.area > 0 && n.push(`${R(e.area)} m²`), typeof e.cleaningTime == "number" && e.cleaningTime > 0 && n.push(`${Math.round(e.cleaningTime)} min`), b`<div class="progress">
      <div class="track"><div class="fill" style=${`width:${t}%`}></div></div>
      <div class="meta"><span>${n[0]}</span><span>${n.slice(1).join(" · ")}</span></div>
    </div>`;
		}
		_controls(e) {
			let t = this.vm, n = t.rawState, r = !t.available;
			return b`<div class="controls" @click=${(e) => e.stopPropagation()}>
      ${n === "cleaning" && e.pause ? b`<hd-icon-button
            icon="mdi:pause"
            label="Pause"
            variant="soft"
            .disabled=${r}
            @click=${() => this.entityId && this.callService(on(this.entityId), { errorVerb: "pause" })}
          ></hd-icon-button>` : b`<hd-icon-button
            icon="mdi:play"
            label="Start"
            variant="filled"
            .disabled=${r || !e.start}
            @click=${() => this.entityId && this.callService(an(this.entityId), { errorVerb: "start" })}
          ></hd-icon-button>`}
      ${e.returnHome ? b`<hd-icon-button
            icon="mdi:home-import-outline"
            label="Return to dock"
            variant="soft"
            .disabled=${r || n === "docked"}
            @click=${() => this.entityId && this.callService(sn(this.entityId), { errorVerb: "dock" })}
          ></hd-icon-button>` : S}
    </div>`;
		}
		_fanSpeed() {
			let e = this.vm, t = (e.stateObj?.attributes.fan_speed_list ?? []).filter((e) => !["off", "custom"].includes(e));
			if (t.length < 2) return S;
			let n = t.map((e) => ({
				value: e,
				label: z(e)
			}));
			return b`<div class="fan">
      <hd-segmented
        .options=${n}
        .value=${e.stateObj?.attributes.fan_speed ?? ""}
        .disabled=${!e.available}
        label="Suction power"
        @hd-select=${(e) => this.entityId && this.callService(cn(this.entityId, e.detail.value), { errorVerb: "set suction for" })}
      ></hd-segmented>
    </div>`;
		}
		_heroControls(e) {
			let t = this.vm, n = t.rawState, r = !t.available, i = n === "cleaning", a = (e, t) => this.entityId && this.callService(e(), { errorVerb: t });
			return b`<div class="controls" @click=${(e) => e.stopPropagation()}>
      ${i && e.pause ? b`<button class="pill primary" aria-label="Pause" ?disabled=${r} @click=${() => a(() => on(this.entityId), "pause")}>
            <hd-icon icon="mdi:pause" .size=${20}></hd-icon>
          </button>` : b`<button class="pill primary" aria-label="Start" ?disabled=${r || !e.start} @click=${() => a(() => an(this.entityId), "start")}>
            <hd-icon icon="mdi:play" .size=${20}></hd-icon>
          </button>`}
      ${e.returnHome ? b`<button class="pill" aria-label="Return to dock" ?disabled=${r || n === "docked"} @click=${() => a(() => sn(this.entityId), "dock")}>
            <hd-icon icon="mdi:home-import-outline" .size=${20}></hd-icon>
          </button>` : S}
      ${e.locate ? b`<button class="pill" aria-label="Locate" ?disabled=${r} @click=${() => a(() => ln(this.entityId), "locate")}>
            <hd-icon icon="mdi:map-marker-radius" .size=${20}></hd-icon>
          </button>` : S}
    </div>`;
		}
		_renderHero(e) {
			let t = this.vm, n = On(this.hass, this.entityId), r = t.rawState === "cleaning", i = r && typeof n.progress == "number" ? Math.max(0, Math.min(100, Math.round(n.progress))) : void 0, a = [];
			n.battery != null && a.push(`${Math.round(n.battery)}%`), n.area != null && n.area > 0 && a.push(`${R(n.area)} m²`);
			let o = i == null ? S : b`<div class="hprogress">
            <div class="prow">
              <span>${i}%</span>
              <span>${n.cleaningTime != null && n.cleaningTime > 0 ? `${Math.round(n.cleaningTime)} min` : ""}</span>
            </div>
            <div class="htrack"><div class="hfill" style=${`width:${i}%`}></div></div>
          </div>`;
			return b`
      <hd-widget-frame
        bleed
        .size=${this.currentSize}
        .accent=${t.accent}
        .hasDetail=${!0}
        .quickKind=${"none"}
        .unavailable=${!t.available}
        .actionState=${this.actionState}
        @hd-activate=${() => this.openDetail()}
      >
        <div class="hero" ?data-cleaning=${r}>
          <div class="glow"></div>
          <img
            class="robot"
            src=${zr("assets/roborock-s8.webp")}
            alt=""
            aria-hidden="true"
            draggable="false"
          />
          <div class="top">
            <div class="brand">roborock</div>
            <div class="htext">
              <span class="hname">${t.name}</span>
              <span class="hstatus">${t.displayState}</span>
              ${a.length ? b`<span class="hmeta">${a.join(" · ")}</span>` : S}
            </div>
          </div>
          <div class="bottom">
            ${o}
            ${this._heroControls(e)}
          </div>
        </div>
      </hd-widget-frame>
    `;
		}
		renderContent() {
			let e = this.vm, t = this.currentSize, n = kt(e.stateObj), r = t !== "1x1";
			return this._branded && t === "2x2" && e.exists ? this._renderHero(n) : b`
      <hd-widget-frame
        .icon=${e.icon}
        .layout=${this.layout}
        .name=${e.name}
        .stateText=${e.displayState}
        .secondary=${e.secondary ?? ""}
        .size=${t}
        .accent=${e.accent}
        .active=${e.active}
        .unavailable=${!e.available}
        .hasDetail=${!0}
        .quickKind=${t === "1x1" ? "toggle" : "none"}
        .quickLabel=${e.quickAction.label}
        .actionState=${this.actionState}
        @hd-quick=${() => this.runQuick()}
        @hd-activate=${() => this.openDetail()}
      >
        ${r ? this._controls(n) : S} ${t === "1x1" ? S : this._progress()}
        ${t === "2x2" ? this._fanSpeed() : S}
      </hd-widget-frame>
    `;
		}
	}, Hr.styles = l`
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
      height: 44px;
      min-width: 44px;
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
      color: ${c("#EA0029")};
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
  `, Hr), Ur = V([k("hd-widget-vacuum")], Ur);
}));
//#endregion
//#region src/home-assistant/media-apps.ts
function Gr(e) {
	return Yr[e.replace(/\u00a0/g, " ").trim().toLowerCase()];
}
function Kr(e) {
	return e.some((e) => Gr(e) !== void 0);
}
function qr(e) {
	return e.replace(/ /g, " ").trim().toLowerCase();
}
function Jr(e) {
	let t = /* @__PURE__ */ new Map();
	for (let n of e) {
		let e = qr(n);
		t.has(e) || t.set(e, n);
	}
	let n = [], r = /* @__PURE__ */ new Set();
	for (let e of Xr) {
		let i = t.get(e.key);
		i && (n.push({
			...e,
			source: i
		}), r.add(i));
	}
	return {
		featured: n,
		rest: e.filter((e) => !r.has(e))
	};
}
var Yr, Xr, Zr = t((() => {
	Yr = {
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
	}, Xr = [
		{
			key: "tv",
			label: "Apple TV+",
			icon: "mdi:apple"
		},
		{
			key: "infuse",
			label: "Infuse",
			icon: "mdi:play-box-multiple"
		},
		{
			key: "netflix",
			label: "Netflix",
			icon: "mdi:netflix"
		}
	];
}));
//#endregion
//#region src/home-assistant/media-progress.ts
function Qr(e) {
	let t = e?.attributes.media_duration;
	if (!e || !t || t <= 0) return null;
	let n = e.attributes.media_position ?? 0, r = e.attributes.media_position_updated_at;
	return e.state === "playing" && r && (n += (Date.now() - new Date(r).getTime()) / 1e3), n = Math.max(0, Math.min(n, t)), {
		pct: n / t * 100,
		elapsed: wn(n),
		total: wn(t),
		positionSec: n,
		durationSec: t
	};
}
var $r = t((() => {
	B();
}));
//#endregion
//#region src/home-assistant/artwork-color.ts
function ei(e) {
	return oi.get(e);
}
function ti(e) {
	if (oi.has(e)) return Promise.resolve(oi.get(e) ?? null);
	let t = si.get(e);
	if (t) return t;
	let n = ni(e).then((t) => (oi.set(e, t), si.delete(e), t)).catch(() => (oi.set(e, null), si.delete(e), null));
	return si.set(e, n), n;
}
function ni(e) {
	return new Promise((t) => {
		let n = new Image();
		n.crossOrigin = "anonymous", n.decoding = "async", n.onload = () => t(ri(n)), n.onerror = () => t(null), n.src = e;
	});
}
function ri(e) {
	let t = document.createElement("canvas");
	t.width = 24, t.height = 24;
	let n = t.getContext("2d", { willReadFrequently: !0 });
	if (!n) return null;
	try {
		n.drawImage(e, 0, 0, 24, 24);
		let { data: t } = n.getImageData(0, 0, 24, 24), r = 0, i = 0, a = 0, o = 0, s = null, c = -1;
		for (let e = 0; e < t.length; e += 4) {
			let n = t[e], l = t[e + 1], u = t[e + 2];
			if (t[e + 3] < 200) continue;
			r += n, i += l, a += u, o += 1;
			let d = Math.max(n, l, u), f = Math.min(n, l, u), p = (d + f) / 2, m = (d === 0 ? 0 : (d - f) / d) * (1 - Math.abs(p - 140) / 140);
			m > c && (c = m, s = {
				r: n,
				g: l,
				b: u
			});
		}
		if (!o) return null;
		let l = {
			r: r / o | 0,
			g: i / o | 0,
			b: a / o | 0
		};
		return s && c > .15 ? {
			r: s.r * .6 + l.r * .4 | 0,
			g: s.g * .6 + l.g * .4 | 0,
			b: s.b * .6 + l.b * .4 | 0
		} : l;
	} catch {
		return null;
	}
}
function ii({ r: e, g: t, b: n }, r) {
	let i = 1 - r;
	return {
		r: e * i | 0,
		g: t * i | 0,
		b: n * i | 0
	};
}
function ai({ r: e, g: t, b: n }, r = 1) {
	return r >= 1 ? `rgb(${e}, ${t}, ${n})` : `rgba(${e}, ${t}, ${n}, ${r})`;
}
var oi, si, ci = t((() => {
	oi = /* @__PURE__ */ new Map(), si = /* @__PURE__ */ new Map();
})), li = /* @__PURE__ */ n({ MediaWidget: () => pi }), ui, di, fi, pi, mi = t((() => {
	T(), O(), A(), q(), F(), Zr(), $r(), ci(), L(), G(), mr(), H(), di = {
		r: 32,
		g: 36,
		b: 44
	}, fi = 1600, pi = (ui = class extends K {
		constructor(...e) {
			super(...e), this._artColor = null, this._colorFor = "", this._optimistic = null, this._optimisticTs = 0, this._tick = 0, this._marquee = !1, this._marqueeRaf = 0, this._marqueeKey = "";
		}
		get _rawState() {
			return this.vm.rawState;
		}
		get _isPlaying() {
			let e = this._rawState === "playing";
			if (this._optimistic != null) {
				if (Date.now() - this._optimisticTs > fi) return this._optimistic = null, e;
				let t = this._optimistic === "playing";
				return e === t ? (this._optimistic = null, e) : t;
			}
			return e;
		}
		_playPause() {
			this.entityId && (this._optimistic = this._isPlaying ? "paused" : "playing", this._optimisticTs = Date.now(), this.callService(Zt(this.entityId), { errorVerb: "control" }));
		}
		willUpdate() {
			let e = this.vm.stateObj?.attributes.entity_picture;
			if (e && this._colorFor !== e) {
				this._colorFor = e;
				let t = ei(e);
				t === void 0 ? ti(e).then((t) => {
					this._colorFor === e && (this._artColor = t);
				}) : this._artColor = t;
			} else !e && this._colorFor && (this._colorFor = "", this._artColor = null);
		}
		updated() {
			this._syncTicker(), this._scheduleMarqueeCheck();
		}
		_scheduleMarqueeCheck() {
			this._marqueeRaf ||= requestAnimationFrame(() => {
				this._marqueeRaf = 0, this._checkMarquee();
			});
		}
		_syncTicker() {
			let e = this._isPlaying && !!Qr(this.vm.stateObj);
			e && !this._tick ? this._tick = window.setInterval(() => this.requestUpdate(), 1e3) : !e && this._tick && (window.clearInterval(this._tick), this._tick = 0);
		}
		_checkMarquee() {
			let e = this.renderRoot.querySelector(".np"), t = this.renderRoot.querySelector(".np-title"), n = t?.querySelector(".np-title-inner");
			if (!t || !n || e?.getAttribute("data-variant") === "hero") {
				this._marqueeKey = " ", this._marquee &&= !1;
				return;
			}
			let r = `${n.textContent ?? ""}@${t.clientWidth}`;
			if (r === this._marqueeKey) return;
			this._marqueeKey = r;
			let i = n.scrollWidth - t.clientWidth, a = i > 6;
			a && (t.style.setProperty("--marq-shift", `-${i}px`), t.style.setProperty("--marq-dur", `${Math.max(6, Math.round(i / 22))}s`)), a !== this._marquee && (this._marquee = a);
		}
		disconnectedCallback() {
			super.disconnectedCallback(), this._tick && window.clearInterval(this._tick), this._tick = 0, cancelAnimationFrame(this._marqueeRaf), this._marqueeRaf = 0;
		}
		_ambientVars() {
			let e = this._artColor ?? di;
			return [
				`--np-dark:${ai(ii(e, .62))}`,
				`--np-scrim-strong:${ai(ii(e, .55), .9)}`,
				`--np-scrim-soft:${ai(ii(e, .35), .45)}`
			].join(";");
		}
		_transport(e) {
			let t = !this.vm.available || this._rawState === "off", n = this._rawState === "buffering";
			return b`<div class="np-transport" @click=${(e) => e.stopPropagation()}>
      ${e.previous ? b`<hd-icon-button
            icon="mdi:skip-previous"
            label="Previous"
            variant="plain"
            .disabled=${t}
            @click=${() => this.entityId && this.callService($t(this.entityId), { errorVerb: "skip" })}
          ></hd-icon-button>` : S}
      <span class="np-play">
        <hd-icon-button
          icon=${this._isPlaying ? "mdi:pause" : "mdi:play"}
          label="Play or pause"
          variant="plain"
          .loading=${n}
          .disabled=${t || !e.play && !e.pause}
          @click=${() => this._playPause()}
        ></hd-icon-button>
      </span>
      ${e.next ? b`<hd-icon-button
            icon="mdi:skip-next"
            label="Next"
            variant="plain"
            .disabled=${t}
            @click=${() => this.entityId && this.callService(Qt(this.entityId), { errorVerb: "skip" })}
          ></hd-icon-button>` : S}
    </div>`;
		}
		renderContent() {
			let e = this.vm, t = Ot(e.stateObj), n = this.currentSize, r = e.stateObj?.attributes.entity_picture, i = e.stateObj?.attributes.app_name, a = e.stateObj?.attributes.media_title, o = this._rawState, s = i ? Gr(i) : void 0;
			if (o === "off" || (o === "idle" || o === "standby") && !(r || i || a)) return b`
        <hd-widget-frame
          .icon=${e.icon}
          .name=${e.name}
          .stateText=${o === "off" ? "Off" : "Not playing"}
          .secondary=${e.secondary ?? ""}
          .size=${n}
          .accent=${e.accent}
          .active=${!1}
          .unavailable=${!e.available}
          .hasDetail=${!0}
          .quickKind=${"none"}
          @hd-activate=${() => this.openDetail()}
        >
          ${t.play || t.pause ? this._transportPlain(t) : S}
        </hd-widget-frame>
      `;
			let c = n === "2x2", l = Qr(e.stateObj), u = r ? `background-image:url("${r}")` : "";
			return b`
      <hd-widget-frame
        bleed
        .name=${e.name}
        .size=${n}
        .accent=${e.accent}
        .active=${e.active}
        .unavailable=${!e.available}
        .hasDetail=${!0}
        .quickKind=${"none"}
        @hd-activate=${() => this.openDetail()}
      >
        <div class="np" data-variant=${c ? "hero" : "bar"} style=${this._ambientVars()}>
          <div class="np-bg" style=${u}></div>
          <div class="np-scrim"></div>
          <div class="np-body">
            <div class="np-art" style=${c ? "" : u}>
              ${r ? S : b`<hd-icon icon=${s ?? "mdi:music-note"} .size=${c ? 56 : 26}></hd-icon>`}
            </div>
            <div class="np-meta">
              <div class="np-app">${i ?? e.name}</div>
              <div class="np-title" data-marquee=${this._marquee && !c ? "on" : "off"}>
                <span class="np-title-inner">${a ?? e.displayState}</span>
              </div>
            </div>
            ${this._transport(t)}
          </div>
          ${l ? b`<div class="np-progress"><span style=${`width:${l.pct}%`}></span></div>` : S}
        </div>
      </hd-widget-frame>
    `;
		}
		_transportPlain(e) {
			let t = !this.vm.available;
			return b`<div class="transport" @click=${(e) => e.stopPropagation()}>
      <hd-icon-button
        icon=${this._isPlaying ? "mdi:pause" : "mdi:play"}
        label="Play or pause"
        variant="filled"
        .disabled=${t || !e.play && !e.pause}
        @click=${() => this._playPause()}
      ></hd-icon-button>
    </div>`;
		}
	}, ui.styles = l`
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
  `, ui), V([D()], pi.prototype, "_artColor", void 0), V([D()], pi.prototype, "_marquee", void 0), pi = V([k("hd-widget-media")], pi);
}));
//#endregion
//#region src/home-assistant/history.ts
async function hi(e, t, n = 24) {
	let r = /* @__PURE__ */ new Date(), i = /* @__PURE__ */ new Date(r.getTime() - n * 3600 * 1e3);
	try {
		return ((await e.callWS({
			type: "history/history_during_period",
			start_time: i.toISOString(),
			end_time: r.toISOString(),
			entity_ids: [t],
			minimal_response: !0,
			no_attributes: !0
		}))?.[t] ?? []).map((e) => ({
			t: (e.lu ?? e.lc ?? 0) * 1e3,
			value: Number(e.s ?? e.state)
		})).filter((e) => Number.isFinite(e.value) && e.t > 0);
	} catch {
		try {
			let n = `history/period/${i.toISOString()}?filter_entity_id=${encodeURIComponent(t)}&minimal_response&no_attributes&end_time=${encodeURIComponent(r.toISOString())}`;
			return ((await e.callApi("GET", n))?.[0] ?? []).map((e) => ({
				t: new Date(e.last_updated).getTime(),
				value: Number(e.state)
			})).filter((e) => Number.isFinite(e.value) && e.t > 0);
		} catch {
			return [];
		}
	}
}
var gi = t((() => {})), _i, vi, yi, bi, xi, Si, Ci, wi, Ti = t((() => {
	T(), O(), A(), U(), H(), xi = (_i = class extends w {
		constructor(...e) {
			super(...e), this.value = 0, this.color = "var(--accent)", this.label = "";
		}
		render() {
			let e = Math.min(100, Math.max(0, this.value));
			return b`<div
      class="rail"
      role="progressbar"
      aria-label=${this.label}
      aria-valuenow=${Math.round(e)}
      aria-valuemin="0"
      aria-valuemax="100"
    >
      <div class="bar" style=${`width:${e}%;--bar-color:${this.color}`}></div>
    </div>`;
		}
	}, _i.styles = l`
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
  `, _i), V([E({ type: Number })], xi.prototype, "value", void 0), V([E({ type: String })], xi.prototype, "color", void 0), V([E({ type: String })], xi.prototype, "label", void 0), xi = V([k("hd-progress")], xi), Si = (vi = class extends w {
		constructor(...e) {
			super(...e), this.icon = "", this.text = "", this.tone = "neutral";
		}
		render() {
			return b`<span class="badge"
      >${this.icon ? b`<hd-icon .icon=${this.icon} .size=${14}></hd-icon>` : S}
      ${this.text ? b`<span>${this.text}</span>` : S}</span
    >`;
		}
	}, vi.styles = l`
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
  `, vi), V([E({ type: String })], Si.prototype, "icon", void 0), V([E({ type: String })], Si.prototype, "text", void 0), V([E({ type: String })], Si.prototype, "tone", void 0), Si = V([k("hd-status-badge")], Si), Ci = (yi = class extends w {
		constructor(...e) {
			super(...e), this.w = "100%", this.h = "16px", this.radius = "8px";
		}
		render() {
			return b`<div class="sk" style=${`--w:${this.w};--h:${this.h};--r:${this.radius}`}></div>`;
		}
	}, yi.styles = l`
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
  `, yi), V([E({ type: String })], Ci.prototype, "w", void 0), V([E({ type: String })], Ci.prototype, "h", void 0), V([E({ type: String })], Ci.prototype, "radius", void 0), Ci = V([k("hd-skeleton")], Ci), wi = (bi = class extends w {
		constructor(...e) {
			super(...e), this.points = [], this.color = "var(--accent)", this.area = !0, this.summary = "";
		}
		render() {
			let e = this.points.filter((e) => Number.isFinite(e));
			if (e.length < 2) return b`<svg viewBox="0 0 100 32" preserveAspectRatio="none" aria-label=${this.summary}></svg>`;
			let t = Math.min(...e), n = Math.max(...e) - t || 1, r = 100 / (e.length - 1), i = e.map((e, i) => [i * r, 32 - (e - t) / n * 28 - 2]).map(([e, t], n) => `${n === 0 ? "M" : "L"}${e.toFixed(2)},${t.toFixed(2)}`).join(" "), a = `${i} L100,32 L0,32 Z`;
			return b`<svg viewBox="0 0 ${100} ${32}" preserveAspectRatio="none" role="img" aria-label=${this.summary}
      style=${`--trend-color:${this.color}`}
      >${this.area ? Ne`<path class="fill" d=${a}></path>` : S}
      ${Ne`<path class="line" d=${i}></path>`}</svg
    >`;
		}
	}, bi.styles = l`
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
  `, bi), V([E({ attribute: !1 })], wi.prototype, "points", void 0), V([E({ type: String })], wi.prototype, "color", void 0), V([E({ type: Boolean })], wi.prototype, "area", void 0), V([E({ type: String })], wi.prototype, "summary", void 0), wi = V([k("hd-trend")], wi);
})), Ei = /* @__PURE__ */ n({ SensorWidget: () => ki });
function Di(e) {
	let t = Math.abs(e), n = t >= 100 ? 0 : t >= 10 ? 1 : 2;
	try {
		return new Intl.NumberFormat(void 0, { maximumFractionDigits: n }).format(e);
	} catch {
		return e.toFixed(n);
	}
}
var Oi, ki, Ai = t((() => {
	T(), O(), A(), q(), gi(), Qn(), G(), Ti(), H(), ki = (Oi = class extends K {
		constructor(...e) {
			super(...e), this._trend = [], this._fetchedFor = "";
		}
		get _isBig() {
			return this.currentSize === "2x2" || this.currentSize === "1x2";
		}
		updated() {
			if (this._isBig && this.entityId && this.hass?.connected && this._fetchedFor !== this.entityId) {
				let e = this.hass.states[this.entityId];
				e && Number.isFinite(Number(e.state)) && (this._fetchedFor = this.entityId, this._loadTrend());
			}
			this._isBig ? this.setAttribute("data-big", "") : this.removeAttribute("data-big");
		}
		async _loadTrend() {
			if (!this.hass || !this.entityId) return;
			let e = await hi(this.hass, this.entityId, 24);
			this._trend = e.map((e) => e.value);
		}
		renderContent() {
			let e = this.vm, t = e.stateObj, n = t ? Number(t.state) : NaN, r = Number.isFinite(n) && t.state.trim() !== "", i = t?.attributes.unit_of_measurement, a = Yn(e.accent), o = e.available && r ? b`<div class="value">
            <span>${Di(n)}</span>${i ? b`<span class="unit">${i}</span>` : S}
          </div>` : b`<div class="value"><span class="txt">${e.displayState}</span></div>`;
			return b`
      <hd-widget-frame
        .icon=${e.icon}
        .layout=${this.layout}
        .name=${e.name}
        .stateText=${""}
        .size=${this.currentSize}
        .accent=${e.accent}
        .active=${!1}
        .unavailable=${!e.available}
        .hasDetail=${!0}
        .quickKind=${"none"}
        @hd-activate=${() => this.openDetail()}
      >
        ${o}
        ${this._isBig && r && this._trend.length > 1 ? b`<div class="trend">
              <hd-trend
                .points=${this._trend}
                .color=${a.fg}
                .summary=${`24 hour trend for ${e.name}`}
              ></hd-trend>
            </div>` : S}
      </hd-widget-frame>
    `;
		}
	}, Oi.styles = l`
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
  `, Oi), V([D()], ki.prototype, "_trend", void 0), ki = V([k("hd-widget-sensor")], ki);
})), ji = /* @__PURE__ */ n({ WeatherWidget: () => Ni }), Mi, Ni, Pi = t((() => {
	T(), O(), A(), q(), In(), B(), G(), U(), H(), Ni = (Mi = class extends K {
		constructor(...e) {
			super(...e), this._forecast = [], this._fetchedFor = "";
		}
		hasDetail() {
			return !0;
		}
		updated() {
			(this.currentSize === "1x2" || this.currentSize === "2x2") && this.entityId && this.hass?.connected && this._fetchedFor !== this.entityId && (this._fetchedFor = this.entityId, this._loadForecast());
		}
		async _loadForecast() {
			let e = this.vm.stateObj?.attributes.forecast;
			if (e?.length) {
				this._forecast = e.slice(0, 5);
				return;
			}
			if (!(!this.hass || !this.entityId)) try {
				let e = (await this.hass.callWS({
					type: "call_service",
					domain: "weather",
					service: "get_forecasts",
					service_data: { type: "daily" },
					target: { entity_id: this.entityId },
					return_response: !0
				}))?.response?.[this.entityId]?.forecast ?? [];
				this._forecast = e.slice(0, 5);
			} catch {
				this._forecast = [];
			}
		}
		_metrics() {
			let e = this.vm.stateObj?.attributes ?? {}, t = [];
			return e.humidity != null && t.push(["mdi:water-percent", `${Math.round(e.humidity)}%`]), e.wind_speed != null && t.push(["mdi:weather-windy", `${R(e.wind_speed)} ${e.wind_speed_unit ?? "km/h"}`]), b`<div class="metrics">
      ${t.map(([e, t]) => b`<span class="metric"><hd-icon .icon=${e} .size=${14}></hd-icon>${t}</span>`)}
    </div>`;
		}
		_forecastStrip() {
			return this._forecast.length ? b`<div class="forecast">
      ${this._forecast.map((e) => {
				let t = new Date(e.datetime), n = Number.isNaN(t.getTime()) ? "" : t.toLocaleDateString(void 0, { weekday: "short" });
				return b`<div class="day">
          <span class="dow">${n}</span>
          <hd-icon .icon=${Mn(e.condition ?? "")} .size=${20}></hd-icon>
          <span class="hi">${e.temperature == null ? "–" : `${Math.round(e.temperature)}°`}</span>
          ${e.templow == null ? S : b`<span class="lo">${Math.round(e.templow)}°</span>`}
        </div>`;
			})}
    </div>` : S;
		}
		renderContent() {
			let e = this.vm, t = e.stateObj?.attributes ?? {}, n = this.currentSize, r = n === "1x2" || n === "2x2", i = t.temperature == null ? "—" : `${R(t.temperature)}°`, a = this.layout === "value";
			return b`
      <hd-widget-frame
        .icon=${Mn(e.rawState)}
        .layout=${this.layout}
        .name=${e.name}
        .stateText=${a ? i : z(e.rawState)}
        .size=${n}
        .accent=${"accent"}
        .active=${!1}
        .unavailable=${!e.available}
        .hasDetail=${!0}
        .quickKind=${"none"}
        @hd-activate=${() => this.openDetail()}
      >
        ${a ? S : b`<div class="temp">${i}</div>
              ${this._metrics()} ${r ? this._forecastStrip() : S}`}
      </hd-widget-frame>
    `;
		}
	}, Mi.styles = l`
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
  `, Mi), V([D()], Ni.prototype, "_forecast", void 0), Ni = V([k("hd-widget-weather")], Ni);
}));
//#endregion
//#region src/widgets/widget-definition.ts
function Fi(e) {
	return !!e && typeof e == "object" && !Array.isArray(e);
}
function Ii(e) {
	let t = Fi(e) ? e.switches : void 0;
	return Array.isArray(t) ? t.filter((e) => !!e && typeof e == "object" && typeof e.entity == "string" && typeof e.name == "string") : [];
}
function Li(e) {
	let t = Fi(e) ? e.switches : void 0;
	if (t === void 0) return [];
	if (!Array.isArray(t)) return [{
		path: "switches",
		message: "Climate `switches` must be an array."
	}];
	let n = [];
	return t.forEach((e, t) => {
		let r = e && typeof e == "object" ? e : void 0;
		if (!r) {
			n.push({
				path: `switches[${t}]`,
				message: "Climate switch must be an object."
			});
			return;
		}
		(typeof r.entity != "string" || !Bi.test(r.entity)) && n.push({
			path: `switches[${t}].entity`,
			message: "Climate switch requires a valid entity_id."
		}), (typeof r.name != "string" || !r.name.trim()) && n.push({
			path: `switches[${t}].name`,
			message: "Climate switch requires a non-empty name."
		});
	}), n;
}
function Ri(e) {
	if (e === void 0) return [];
	if (!Fi(e)) return [{
		path: "",
		message: "Vacuum options must be an object."
	}];
	let t = e, n = [];
	return t.brand !== void 0 && t.brand !== "roborock" && n.push({
		path: "brand",
		message: "Vacuum `brand` must be `roborock`."
	}), t.branded !== void 0 && typeof t.branded != "boolean" && n.push({
		path: "branded",
		message: "Vacuum `branded` must be a boolean."
	}), t.hero !== void 0 && typeof t.hero != "boolean" && n.push({
		path: "hero",
		message: "Vacuum `hero` must be a boolean."
	}), n;
}
function zi(e) {
	return Qi[e];
}
var Bi, Vi, Hi, Ui, Wi, Gi, Ki, qi, Ji, Yi, Xi, Zi, Qi, $i = t((() => {
	Bi = /^[a-z_]+\.[a-z0-9_]+$/, Vi = {
		type: "light",
		tag: "hd-widget-light",
		label: "Light",
		icon: "mdi:lightbulb",
		load: () => Promise.resolve().then(() => (fr(), lr)),
		supportedSizes: [
			"1x1",
			"2x1",
			"1x2",
			"2x2"
		],
		defaultSize: {
			compact: "1x1",
			medium: "2x1",
			wide: "2x2"
		},
		requiresEntity: !0,
		section: "devices",
		quickAction: "toggle",
		hasDetail: !0,
		dependencyIds: (e) => e.entity ? [e.entity] : [],
		detailRenderer: "light"
	}, Hi = {
		type: "climate",
		tag: "hd-widget-climate",
		label: "Climate",
		icon: "mdi:thermostat",
		load: () => Promise.resolve().then(() => (Sr(), vr)),
		supportedSizes: [
			"2x1",
			"1x2",
			"2x2"
		],
		defaultSize: {
			compact: "2x1",
			medium: "2x1",
			wide: "2x2"
		},
		requiresEntity: !0,
		section: "devices",
		quickAction: "none",
		hasDetail: !0,
		dependencyIds: (e) => [...e.entity ? [e.entity] : [], ...Ii(e.options).map((e) => e.entity)],
		validateOptions: Li,
		detailRenderer: "climate"
	}, Ui = {
		type: "switch",
		tag: "hd-widget-switch",
		label: "Switch",
		icon: "mdi:toggle-switch",
		load: () => Promise.resolve().then(() => (Dr(), Tr)),
		supportedSizes: ["1x1", "2x1"],
		defaultSize: {
			compact: "1x1",
			medium: "1x1",
			wide: "2x1"
		},
		requiresEntity: !0,
		section: "devices",
		quickAction: "toggle",
		hasDetail: !0,
		dependencyIds: (e) => e.entity ? [e.entity] : [],
		detailRenderer: "generic"
	}, Wi = {
		type: "fan",
		tag: "hd-widget-fan",
		label: "Fan",
		icon: "mdi:fan",
		load: () => Promise.resolve().then(() => (jr(), Or)),
		supportedSizes: [
			"1x1",
			"2x1",
			"1x2"
		],
		defaultSize: {
			compact: "1x1",
			medium: "2x1",
			wide: "2x1"
		},
		requiresEntity: !0,
		section: "devices",
		quickAction: "toggle",
		hasDetail: !0,
		dependencyIds: (e) => e.entity ? [e.entity] : [],
		detailRenderer: "generic"
	}, Gi = {
		type: "cover",
		tag: "hd-widget-cover",
		label: "Cover",
		icon: "mdi:window-shutter",
		load: () => Promise.resolve().then(() => (Fr(), Mr)),
		supportedSizes: [
			"1x1",
			"2x1",
			"1x2",
			"2x2"
		],
		defaultSize: {
			compact: "1x1",
			medium: "2x1",
			wide: "2x2"
		},
		requiresEntity: !0,
		section: "devices",
		quickAction: "none",
		hasDetail: !0,
		dependencyIds: (e) => e.entity ? [e.entity] : [],
		detailRenderer: "cover"
	}, Ki = {
		type: "lock",
		tag: "hd-widget-lock",
		label: "Lock",
		icon: "mdi:lock",
		load: () => Promise.resolve().then(() => (Rr(), Ir)),
		supportedSizes: ["1x1", "2x1"],
		defaultSize: {
			compact: "1x1",
			medium: "1x1",
			wide: "2x1"
		},
		requiresEntity: !0,
		section: "devices",
		quickAction: "toggle",
		hasDetail: !0,
		dependencyIds: (e) => e.entity ? [e.entity] : [],
		detailRenderer: "lock"
	}, qi = {
		type: "vacuum",
		tag: "hd-widget-vacuum",
		label: "Vacuum",
		icon: "mdi:robot-vacuum",
		load: () => Promise.resolve().then(() => (Wr(), Vr)),
		supportedSizes: [
			"1x1",
			"2x1",
			"2x2"
		],
		defaultSize: {
			compact: "1x1",
			medium: "2x1",
			wide: "2x2"
		},
		requiresEntity: !0,
		section: "devices",
		quickAction: "toggle",
		hasDetail: !0,
		dependencyIds: (e) => e.entity ? [e.entity] : [],
		validateOptions: Ri,
		detailRenderer: "vacuum"
	}, Ji = {
		type: "media",
		tag: "hd-widget-media",
		label: "Media",
		icon: "mdi:cast",
		load: () => Promise.resolve().then(() => (mi(), li)),
		supportedSizes: ["2x1", "2x2"],
		defaultSize: {
			compact: "2x1",
			medium: "2x1",
			wide: "2x2"
		},
		requiresEntity: !0,
		section: "media",
		quickAction: "none",
		hasDetail: !0,
		dependencyIds: (e) => e.entity ? [e.entity] : [],
		detailRenderer: "media"
	}, Yi = {
		type: "sensor",
		tag: "hd-widget-sensor",
		label: "Sensor",
		icon: "mdi:gauge",
		load: () => Promise.resolve().then(() => (Ai(), Ei)),
		supportedSizes: [
			"1x1",
			"2x1",
			"1x2",
			"2x2"
		],
		defaultSize: {
			compact: "1x1",
			medium: "2x1",
			wide: "2x2"
		},
		requiresEntity: !0,
		section: "sensors",
		quickAction: "none",
		hasDetail: !0,
		dependencyIds: (e) => e.entity ? [e.entity] : [],
		detailRenderer: "sensor"
	}, Xi = {
		type: "weather",
		tag: "hd-widget-weather",
		label: "Weather",
		icon: "mdi:weather-partly-cloudy",
		load: () => Promise.resolve().then(() => (Pi(), ji)),
		supportedSizes: [
			"2x1",
			"1x2",
			"2x2"
		],
		defaultSize: {
			compact: "2x1",
			medium: "2x1",
			wide: "2x2"
		},
		requiresEntity: !0,
		section: "sensors",
		quickAction: "none",
		hasDetail: !0,
		dependencyIds: (e) => e.entity ? [e.entity] : [],
		detailRenderer: "weather"
	}, Zi = {
		light: Vi,
		climate: Hi,
		switch: Ui,
		fan: Wi,
		cover: Gi,
		lock: Ki,
		vacuum: qi,
		media: Ji,
		sensor: Yi,
		weather: Xi
	}, Qi = Zi;
}));
//#endregion
//#region src/config/validation.ts
function ea(e) {
	return typeof e == "string" && ia.test(e);
}
function ta(e) {
	return !!e && /replace_me/i.test(e);
}
function na(e) {
	let t = [], n = (e, n) => t.push({
		level: "error",
		path: e,
		message: n
	}), r = (e, n) => t.push({
		level: "warning",
		path: e,
		message: n
	});
	if (!e || typeof e != "object") return {
		ok: !1,
		issues: [{
			level: "error",
			path: "config",
			message: "Dashboard config is missing or not an object."
		}],
		sanitized: {
			defaultView: "",
			views: []
		}
	};
	let i = /* @__PURE__ */ new Set(), a = /* @__PURE__ */ new Set(), o = [];
	(!Array.isArray(e.views) || e.views.length === 0) && n("views", "At least one view must be configured.");
	for (let t = 0; t < (e.views ?? []).length; t++) {
		let s = e.views[t], c = `views[${t}]`;
		if (!s || typeof s != "object") {
			n(c, "View must be an object.");
			continue;
		}
		if (!s.id) {
			n(c, "View is missing an `id`.");
			continue;
		}
		if (i.has(s.id)) {
			n(`${c}.id`, `Duplicate view id "${s.id}".`);
			continue;
		}
		if (i.add(s.id), ![
			"overview",
			"room",
			"system"
		].includes(s.type)) {
			n(`${c}.type`, `Unknown view type "${s.type}".`);
			continue;
		}
		if (s.label || r(`${c}.label`, `View "${s.id}" has no label.`), !Array.isArray(s.widgets)) {
			n(`${c}.widgets`, `View "${s.id}" must have a \`widgets\` array.`);
			continue;
		}
		let l = [];
		for (let e = 0; e < (s.widgets ?? []).length; e++) {
			let t = s.widgets[e], r = ra(t, `${c}.widgets[${e}]`, a, n);
			r && l.push(r);
		}
		o.push({
			...s,
			widgets: l
		});
	}
	let s = new Set(o.map((e) => e.id));
	s.has(e.defaultView) || (o.length > 0 ? r("defaultView", `defaultView "${e.defaultView}" is not a known view; falling back to "${o[0].id}".`) : n("defaultView", `defaultView "${e.defaultView}" does not match any view.`));
	let c = {
		...e,
		defaultView: s.has(e.defaultView) ? e.defaultView : o[0]?.id ?? "",
		views: o
	};
	return {
		ok: !t.some((e) => e.level === "error"),
		issues: t,
		sanitized: c
	};
}
function ra(e, t, n, r) {
	if (!e || typeof e != "object") return r(t, "Widget must be an object."), null;
	if (!e.id) return r(t, "Widget is missing an `id`."), null;
	if (n.has(e.id)) return r(`${t}.id`, `Duplicate widget id "${e.id}".`), null;
	if (n.add(e.id), !_t.includes(e.type)) return r(`${t}.type`, `Unknown widget type "${e.type}".`), null;
	let i = e.type, a = zi(i), o = !0;
	if ((a?.requiresEntity ?? !bt.includes(i)) && !e.entity ? (r(`${t}.entity`, `Widget "${e.id}" (${i}) requires an \`entity\`.`), o = !1) : e.entity && !ea(e.entity) && (r(`${t}.entity`, `"${e.entity}" is not a valid entity_id (expected e.g. light.living_room).`), o = !1), !e.size || typeof e.size != "object") r(`${t}.size`, `Widget "${e.id}" is missing a size set.`), o = !1;
	else {
		let n = a?.supportedSizes ?? yt[i];
		for (let a of gt) {
			let s = e.size[a];
			if (!s) {
				r(`${t}.size.${a}`, `Missing "${a}" size for widget "${e.id}".`), o = !1;
				continue;
			}
			if (!ht.includes(s)) {
				r(`${t}.size.${a}`, `Invalid size "${s}" (allowed: ${ht.join(", ")}).`), o = !1;
				continue;
			}
			n.includes(s) || (r(`${t}.size.${a}`, `Widget type "${i}" does not support size "${s}" at ${a}. Supported: ${n.join(", ")}.`), o = !1);
		}
	}
	for (let n of a?.validateOptions?.(e.options) ?? []) r(`${t}.options${n.path ? `.${n.path}` : ""}`, n.message), o = !1;
	if (e.type === "group") {
		let i = e.options?.children;
		if (!Array.isArray(i) || i.length === 0) r(`${t}.options.children`, `Group "${e.id}" must have a non-empty \`children\` array.`), o = !1;
		else {
			let a = i.map((e, i) => ra(e, `${t}.options.children[${i}]`, n, r)).filter((e) => e !== null);
			if (a.length === 0) r(`${t}.options.children`, `Group "${e.id}" has no valid children after validation.`), o = !1;
			else if (o) return {
				...e,
				options: {
					...e.options ?? {},
					children: a
				}
			};
		}
	}
	return o ? { ...e } : null;
}
var ia, aa = t((() => {
	xt(), $i(), ia = /^[a-z_]+\.[a-z0-9_]+$/;
}));
//#endregion
//#region src/panel/router.ts
function oa(e, t, n = window.location) {
	return e && typeof e.path == "string" ? ca(e.path) : sa(n.pathname, t);
}
function sa(e, t) {
	let n = e.replace(/^\/+/, "").split("/").filter(Boolean);
	return n[0] === t ? n[1] ?? "" : n.length > 1 ? n[1] : "";
}
function ca(e) {
	return e.replace(/^\/+/, "").split("/").filter(Boolean)[0] ?? "";
}
function la(e, t, n) {
	return !t || t === n ? `/${e}` : `/${e}/${t}`;
}
function ua(e) {
	window.location.pathname !== e && (history.pushState(null, "", e), window.dispatchEvent(new CustomEvent("location-changed", { detail: { replace: !1 } })));
}
//#endregion
//#region src/panel/element-width-controller.ts
var da = class {
	constructor(e) {
		this.host = e, this.width = 0, this._frame = 0, this._pendingWidth = 0, e.addController(this);
	}
	hostConnected() {
		this.width = Math.round(this.host.getBoundingClientRect().width || window.innerWidth), this._observer = new ResizeObserver(([e]) => {
			let t = Math.round(e?.contentRect.width ?? 0);
			!t || Math.abs(t - this.width) <= 1 || (this._pendingWidth = t, !this._frame && (this._frame = requestAnimationFrame(() => {
				this._frame = 0;
				let e = this._pendingWidth;
				!e || Math.abs(e - this.width) <= 1 || (this.width = e, this.host.requestUpdate());
			})));
		}), this._observer.observe(this.host);
	}
	hostDisconnected() {
		this._observer?.disconnect(), cancelAnimationFrame(this._frame), this._frame = 0;
	}
};
T(), O(), A(), mr(), H();
var fa, X = (fa = class extends w {
	constructor(...e) {
		super(...e), this.open = !1, this.variant = "auto", this.heading = "", this.subheading = "", this.headless = !1, this._resolved = "sheet", this._dragY = 0, this._closing = !1, this._opener = null, this._dragStartY = 0, this._dragging = !1, this._onKeyDown = (e) => {
			this.open && e.key === "Escape" && (e.stopPropagation(), this.requestClose());
		}, this._onHandleDown = (e) => {
			this._resolved === "sheet" && (this._dragging = !0, this._dragStartY = e.clientY, e.target.setPointerCapture(e.pointerId));
		}, this._onHandleMove = (e) => {
			this._dragging && (this._dragY = Math.max(0, e.clientY - this._dragStartY), this._container && (this._container.style.transform = `translateY(${this._dragY}px)`));
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
	updated(e) {
		e.has("open") && (this.open ? this._activate() : this._deactivate()), e.has("variant") && this._resolveVariant();
	}
	_resolveVariant() {
		this._resolved = this.variant === "auto" ? this._mql?.matches ? "drawer" : "sheet" : this.variant, this.classList.toggle("sheet", this._resolved === "sheet"), this.classList.toggle("drawer", this._resolved === "drawer"), this.classList.toggle("center", this._resolved === "center");
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
		let e = "button, [href], input, select, textarea, hd-icon-button, hd-toggle, hd-slider, hd-segmented, [tabindex]:not([tabindex=\"-1\"])", t = Array.from(this.renderRoot.querySelectorAll(e)), n = Array.from(this.querySelectorAll(e));
		return [...t, ...n].filter((e) => !e.hasAttribute("disabled") && e.offsetParent !== null && !e.classList.contains("sentinel"));
	}
	_wrap(e) {
		let t = this._focusable();
		((e === "first" ? t[0] : t[t.length - 1]) ?? this._container)?.focus();
	}
	requestClose() {
		if (this._closing) return;
		this._closing = !0, this.classList.add("closing");
		let e = () => {
			this.classList.remove("closing"), this._closing = !1, this.dispatchEvent(new CustomEvent("hd-close", {
				bubbles: !0,
				composed: !0
			}));
		}, t = this._container;
		if (!t || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
			window.setTimeout(e, 10);
			return;
		}
		let n = !1, r = () => {
			n || (n = !0, e());
		};
		t.addEventListener("animationend", r, { once: !0 }), window.setTimeout(r, 400);
	}
	_onBackdrop(e) {
		e.target === e.currentTarget && this.requestClose();
	}
	render() {
		if (!this.open) return S;
		let e = this.heading ? "hd-surface-title" : void 0;
		return b`
      <div class="backdrop" @click=${(e) => this._onBackdrop(e)}></div>
      <div class="sentinel" tabindex="0" @focus=${() => this._wrap("last")}></div>
      <div
        class="container"
        role="dialog"
        aria-modal="true"
        aria-label=${this.heading ? S : "Details"}
        aria-labelledby=${e ?? S}
        tabindex="-1"
      >
        <div
          class="handle"
          @pointerdown=${this._onHandleDown}
          @pointermove=${this._onHandleMove}
          @pointerup=${this._onHandleUp}
          @pointercancel=${this._onHandleUp}
        ></div>
        ${this.headless ? S : b`
              <header>
                <div class="titles">
                  <h2 id="hd-surface-title">${this.heading}</h2>
                  ${this.subheading ? b`<p>${this.subheading}</p>` : S}
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
}, fa.styles = l`
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
  `, fa);
V([E({
	type: Boolean,
	reflect: !0
})], X.prototype, "open", void 0), V([E({ type: String })], X.prototype, "variant", void 0), V([E({ type: String })], X.prototype, "heading", void 0), V([E({ type: String })], X.prototype, "subheading", void 0), V([E({ type: Boolean })], X.prototype, "headless", void 0), V([D()], X.prototype, "_resolved", void 0), V([D()], X.prototype, "_dragY", void 0), V([D()], X.prototype, "_closing", void 0), V([ot(".container")], X.prototype, "_container", void 0), X = V([k("hd-surface")], X), T(), O(), A(), U(), mr(), H();
var pa, Z = (pa = class extends w {
	constructor(...e) {
		super(...e), this.views = [], this.currentViewId = "", this.productTitle = "Home", this.subtitle = "", this.connected = !0, this.appearance = "auto", this._switcherOpen = !1, this._elementWidth = new da(this);
	}
	get _mode() {
		let e = this._elementWidth.width;
		return e >= 1e3 ? "sidebar" : e >= 720 ? "rail" : "compact";
	}
	_navigate(e) {
		this._switcherOpen = !1, this.dispatchEvent(new CustomEvent("hd-navigate", {
			detail: { viewId: e },
			bubbles: !0,
			composed: !0
		}));
	}
	_cycleAppearance() {
		this.dispatchEvent(new CustomEvent("hd-toggle-appearance", {
			bubbles: !0,
			composed: !0
		}));
	}
	get _current() {
		return this.views.find((e) => e.id === this.currentViewId) ?? this.views[0];
	}
	scrollToTop() {
		this.renderRoot.querySelector(".content")?.scrollTo({ top: 0 });
	}
	_appearanceIcon() {
		return this.appearance === "dark" ? "mdi:weather-night" : this.appearance === "light" ? "mdi:weather-sunny" : "mdi:theme-light-dark";
	}
	_renderNav() {
		let e = this.views.filter((e) => e.type === "room"), t = this.views.filter((e) => e.type !== "room"), n = (e) => b`
      <button
        class="navitem"
        aria-current=${e.id === this.currentViewId ? "page" : "false"}
        title=${e.label}
        @click=${() => this._navigate(e.id)}
      >
        <hd-icon .icon=${e.icon} .size=${22}></hd-icon>
        <span class="lbl">${e.label}</span>
      </button>
    `;
		return b`
      <nav class="side" aria-label="Views">
        <div class="brand">
          <span class="logo"><hd-icon icon="mdi:home-variant" .size=${20}></hd-icon></span>
          <span class="name">${this.productTitle}</span>
        </div>
        ${t.filter((e) => e.type === "overview").map(n)}
        ${e.length ? b`<div class="navsection">Rooms</div>` : S}
        ${e.map(n)}
        ${t.filter((e) => e.type === "system").length ? b`<div class="navsection">System</div>` : S}
        ${t.filter((e) => e.type === "system").map(n)}
        <div class="navspacer"></div>
        <button class="navitem" @click=${() => this._cycleAppearance()} title="Appearance">
          <hd-icon .icon=${this._appearanceIcon()} .size=${22}></hd-icon>
          <span class="lbl">Appearance</span>
        </button>
      </nav>
    `;
	}
	render() {
		let e = this._current, t = this._mode === "compact";
		return b`
      <div class="shell" data-mode=${this._mode}>
        ${t ? S : this._renderNav()}
        <div class="main">
          <header class="topbar">
            ${t ? b`<button class="switcher" @click=${() => this._switcherOpen = !0} aria-haspopup="dialog">
                    <span class="cur">
                      <hd-icon .icon=${e?.icon ?? "mdi:home"} .size=${24}></hd-icon>
                      <span class="rn">${e?.label ?? this.productTitle}</span>
                    </span>
                    <hd-icon icon="mdi:chevron-down" .size=${22}></hd-icon>
                  </button>` : b`<div class="titles">
                    <h1>${e?.label ?? this.productTitle}</h1>
                    ${this.subtitle ? b`<p>${this.subtitle}</p>` : S}
                  </div>`}
            <div class="actions">
              ${this.connected ? S : b`<hd-icon title="Offline" icon="mdi:wifi-off" .size=${20} style="color:var(--state-warn)"></hd-icon>`}
              ${t ? b`<hd-icon-button
                    .icon=${this._appearanceIcon()}
                    label="Appearance"
                    variant="soft"
                    @click=${() => this._cycleAppearance()}
                  ></hd-icon-button>` : S}
            </div>
          </header>

          ${this.connected ? S : b`<div class="offline" role="status">
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
          ${this.views.map((e) => b`<button
              class="sheet-item"
              aria-current=${e.id === this.currentViewId ? "page" : "false"}
              @click=${() => this._navigate(e.id)}
            >
              <span class="ic"><hd-icon .icon=${e.icon} .size=${22}></hd-icon></span>
              <span>${e.label}</span>
            </button>`)}
        </div>
      </hd-surface>
    `;
	}
}, pa.styles = l`
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
  `, pa);
V([E({ attribute: !1 })], Z.prototype, "views", void 0), V([E({ type: String })], Z.prototype, "currentViewId", void 0), V([E({ type: String })], Z.prototype, "productTitle", void 0), V([E({ type: String })], Z.prototype, "subtitle", void 0), V([E({ type: Boolean })], Z.prototype, "connected", void 0), V([E({ type: String })], Z.prototype, "appearance", void 0), V([D()], Z.prototype, "_switcherOpen", void 0), Z = V([k("hd-app-shell")], Z);
//#endregion
//#region node_modules/lit-html/directive.js
var ma = {
	ATTRIBUTE: 1,
	CHILD: 2,
	PROPERTY: 3,
	BOOLEAN_ATTRIBUTE: 4,
	EVENT: 5,
	ELEMENT: 6
}, ha = (e) => (...t) => ({
	_$litDirective$: e,
	values: t
}), ga = class {
	constructor(e) {}
	get _$AU() {
		return this._$AM._$AU;
	}
	_$AT(e, t, n) {
		this._$Ct = e, this._$AM = t, this._$Ci = n;
	}
	_$AS(e, t) {
		return this.update(e, t);
	}
	update(e, t) {
		return this.render(...t);
	}
};
//#endregion
//#region node_modules/lit-html/directive-helpers.js
qe();
var { I: _a } = We, va = (e) => e, ya = () => document.createComment(""), ba = (e, t, n) => {
	let r = e._$AA.parentNode, i = t === void 0 ? e._$AB : t._$AA;
	if (n === void 0) n = new _a(r.insertBefore(ya(), i), r.insertBefore(ya(), i), e, e.options);
	else {
		let t = n._$AB.nextSibling, a = n._$AM, o = a !== e;
		if (o) {
			let t;
			n._$AQ?.(e), n._$AM = e, n._$AP !== void 0 && (t = e._$AU) !== a._$AU && n._$AP(t);
		}
		if (t !== i || o) {
			let e = n._$AA;
			for (; e !== t;) {
				let t = va(e).nextSibling;
				va(r).insertBefore(e, i), e = t;
			}
		}
	}
	return n;
}, xa = (e, t, n = e) => (e._$AI(t, n), e), Sa = {}, Ca = (e, t = Sa) => e._$AH = t, wa = (e) => e._$AH, Ta = (e) => {
	e._$AR(), e._$AA.remove();
};
//#endregion
//#region node_modules/lit-html/directives/repeat.js
qe();
var Ea = (e, t, n) => {
	let r = /* @__PURE__ */ new Map();
	for (let i = t; i <= n; i++) r.set(e[i], i);
	return r;
}, Da = ha(class extends ga {
	constructor(e) {
		if (super(e), e.type !== ma.CHILD) throw Error("repeat() can only be used in text expressions");
	}
	dt(e, t, n) {
		let r;
		n === void 0 ? n = t : t !== void 0 && (r = t);
		let i = [], a = [], o = 0;
		for (let t of e) i[o] = r ? r(t, o) : o, a[o] = n(t, o), o++;
		return {
			values: a,
			keys: i
		};
	}
	render(e, t, n) {
		return this.dt(e, t, n).values;
	}
	update(e, [t, n, r]) {
		let i = wa(e), { values: a, keys: o } = this.dt(t, n, r);
		if (!Array.isArray(i)) return this.ut = o, a;
		let s = this.ut ??= [], c = [], l, u, d = 0, f = i.length - 1, p = 0, m = a.length - 1;
		for (; d <= f && p <= m;) if (i[d] === null) d++;
		else if (i[f] === null) f--;
		else if (s[d] === o[p]) c[p] = xa(i[d], a[p]), d++, p++;
		else if (s[f] === o[m]) c[m] = xa(i[f], a[m]), f--, m--;
		else if (s[d] === o[m]) c[m] = xa(i[d], a[m]), ba(e, c[m + 1], i[d]), d++, m--;
		else if (s[f] === o[p]) c[p] = xa(i[f], a[p]), ba(e, i[d], i[f]), f--, p++;
		else if (l === void 0 && (l = Ea(o, p, m), u = Ea(s, d, f)), l.has(s[d])) {
			if (l.has(s[f])) {
				let t = u.get(o[p]), n = t === void 0 ? null : i[t];
				if (n === null) {
					let t = ba(e, i[d]);
					xa(t, a[p]), c[p] = t;
				} else c[p] = xa(n, a[p]), ba(e, i[d], n), i[t] = null;
				p++;
			} else Ta(i[f]), f--;
		} else Ta(i[d]), d++;
		for (; p <= m;) {
			let t = ba(e, c[m + 1]);
			xa(t, a[p]), c[p++] = t;
		}
		for (; d <= f;) {
			let e = i[d++];
			e !== null && Ta(e);
		}
		return this.ut = o, Ca(e, c), x;
	}
});
xt(), $i();
function Oa(e) {
	let t = e || 1024;
	return t < 600 ? {
		columns: 2,
		gap: 10,
		pad: 12,
		bucket: "compact"
	} : t < 900 ? {
		columns: 4,
		gap: 14,
		pad: 20,
		bucket: "medium"
	} : t < 1200 ? {
		columns: 6,
		gap: 16,
		pad: 24,
		bucket: "wide"
	} : t < 1600 ? {
		columns: 8,
		gap: 16,
		pad: 28,
		bucket: "wide"
	} : {
		columns: 10,
		gap: 16,
		pad: 32,
		bucket: "wide"
	};
}
function ka(e, t) {
	return e.size?.[t] ?? e.size?.medium ?? "1x1";
}
function Aa(e, t) {
	let n = e.options;
	if (!(n && typeof n == "object" && !Array.isArray(n) && ("hero" in n && n.hero === !0 || "brand" in n && typeof n.brand == "string"))) return null;
	let r = ka(e, t);
	return r === "1x1" ? null : r;
}
function ja(e, t) {
	let [n, r] = e.split("x").map((e) => parseInt(e, 10));
	return {
		colSpan: Math.min(Math.max(1, n || 1), t),
		rowSpan: Math.max(1, r || 1)
	};
}
function Ma(e, t) {
	let n = (e || 1024) - t.pad * 2 - t.gap * (t.columns - 1);
	return Math.max(96, Math.floor(n / t.columns));
}
var Na = vt, Pa = {
	media: "Media",
	devices: "Devices",
	sensors: "Sensors",
	energy: "Energy",
	tiles: ""
};
function Fa(e) {
	let t = zi(e);
	if (t) return t.section;
	switch (e) {
		case "media": return "media";
		case "energy":
		case "powerflow":
		case "solarcharging":
		case "energychart": return "energy";
		case "sensor":
		case "binary_sensor":
		case "person":
		case "weather": return "sensors";
		default: return "devices";
	}
}
function Ia(e) {
	return e === "devices" ? "tile" : e === "sensors" ? "value" : "row";
}
function La(e, t) {
	let n = t || 1024;
	switch (e) {
		case "media": return n < 900 ? 1 : 2;
		case "devices": return n < 354 ? 2 : n < 600 ? 3 : n < 900 ? 4 : n < 1200 ? 6 : 8;
		case "sensors": return n < 600 ? 2 : n < 900 ? 3 : n < 1200 ? 4 : 6;
		case "energy": return n < 900 ? 2 : 4;
		case "tiles": return n < 640 ? 2 : 3;
	}
}
var Ra = {
	compact: "4x2",
	medium: "4x2",
	wide: "4x2"
};
function za(e, t) {
	let n = {
		label: Pa[e],
		variant: e,
		children: t
	};
	return {
		id: `__section_${e}`,
		type: "group",
		size: Ra,
		options: n
	};
}
function Ba(e) {
	let t = e ?? [];
	if (t.some((e) => e.type === "group")) return t;
	let n = /* @__PURE__ */ new Map();
	for (let e of t) {
		let t = Fa(e.type), r = n.get(t) ?? [];
		r.push(e), n.set(t, r);
	}
	let r = [];
	for (let e of Na) {
		let t = n.get(e);
		t && t.length && r.push(za(e, t));
	}
	return r;
}
//#endregion
//#region node_modules/lit-html/static.js
qe();
var Va = Symbol.for(""), Ha = (e) => {
	if (e?.r === Va) return e?._$litStatic$;
}, Ua = (e) => ({
	_$litStatic$: e,
	r: Va
}), Wa = /* @__PURE__ */ new Map(), Ga = ((e) => (t, ...n) => {
	let r = n.length, i, a, o = [], s = [], c, l = 0, u = !1;
	for (; l < r;) {
		for (c = t[l]; l < r && (a = n[l], (i = Ha(a)) !== void 0);) c += i + t[++l], u = !0;
		l !== r && s.push(a), o.push(c), l++;
	}
	if (l === r && o.push(t[r]), u) {
		let e = o.join("$$lit$$");
		(t = Wa.get(e)) === void 0 && (o.raw = o, Wa.set(e, t = o)), n = s;
	}
	return e(t, ...n);
})(b);
T(), O(), A(), H();
var Ka, qa = (Ka = class extends w {
	constructor(...e) {
		super(...e), this.currentSize = "4x2", this.layout = "row", this._elementWidth = new da(this);
	}
	get _opts() {
		return this.config?.options ?? {};
	}
	get _children() {
		return this._opts.children ?? [];
	}
	get _variant() {
		return this._opts.variant ?? Fa(this._children[0]?.type ?? "sensor");
	}
	render() {
		let e = this._children;
		if (!e.length) return S;
		let t = this._elementWidth.width, n = this._variant, r = La(n, t), i = Oa(t).bucket, a = Ia(n), o = this._opts.label, s = a !== "row", c = `--cols:${r}; --gap:12px; --unit:${n === "sensors" ? 84 : n === "media" ? 116 : n === "tiles" ? 100 : Ma(t || 1024, {
			columns: r,
			gap: 12,
			pad: 0,
			bucket: i
		})}px`;
		return b`
      <section class="section">
        ${o ? b`<h2 class="head">${o}</h2>` : S}
        <div class="grid" style=${c}>
          ${Da(e, (e) => e.id, (e) => {
			let t = s ? Aa(e, i) : null;
			return Zo(e, t ?? (s ? "1x1" : ka(e, i)), r, this.hass, t ? "row" : a);
		})}
        </div>
      </section>
    `;
	}
}, Ka.styles = l`
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
  `, Ka);
V([E({ attribute: !1 })], qa.prototype, "hass", void 0), V([E({ attribute: !1 })], qa.prototype, "config", void 0), V([E({ type: String })], qa.prototype, "currentSize", void 0), V([E({ type: String })], qa.prototype, "layout", void 0), qa = V([k("hd-group")], qa), T(), A(), q(), tr(), wr(), G(), H();
var Ja = class extends K {
	renderContent() {
		return Cr(this, {
			quickKind: "none",
			hasDetail: !0
		});
	}
};
Ja = V([k("hd-widget-person")], Ja);
var Ya = class extends K {
	renderContent() {
		return Cr(this, {
			quickKind: "none",
			hasDetail: !0
		});
	}
};
Ya = V([k("hd-widget-binary")], Ya);
var Xa = class extends K {
	hasDetail() {
		return !1;
	}
	async activate() {
		let e = this.vm, t = e.quickAction;
		if (!(!t.call || !this.isConnected2) && !(t.requiresConfirmation && !await $n(this, {
			title: `${t.label} ${e.name}?`,
			confirmLabel: t.label
		}))) try {
			await this.callService(t.call, { errorVerb: t.label.toLowerCase() }), er(this, {
				message: `${e.name} — ${t.label.toLowerCase()}`,
				tone: "eco",
				icon: "mdi:check"
			});
		} catch {}
	}
	renderContent() {
		let e = this.vm;
		return b`<hd-widget-frame
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
}, Za = class extends Xa {};
Za = V([k("hd-widget-scene")], Za);
var Qa = class extends Xa {};
Qa = V([k("hd-widget-script")], Qa);
var $a = class extends Xa {};
$a = V([k("hd-widget-button")], $a);
var eo = class extends K {
	hasDetail() {
		return !1;
	}
	relevantEntityIds() {
		return [];
	}
	async _run() {
		let e = this.config.options ?? {};
		if (!e.service || !this.hass) return;
		let [t, n] = e.service.split(".");
		if (!(!t || !n) && !(this.config.requiresConfirmation && !await $n(this, {
			title: `${this.config.name ?? "Run"}?`,
			confirmLabel: this.config.name ?? "Run"
		}))) {
			this.actionState = "pending";
			try {
				await this.hass.callService(t, n, {
					...e.data ?? {},
					...e.target ?? {}
				}), this.actionState = "success", er(this, {
					message: `${this.config.name ?? "Done"}`,
					tone: "eco",
					icon: "mdi:check"
				});
			} catch {
				this.actionState = "error", er(this, {
					message: `Couldn't run ${this.config.name ?? "action"}`,
					tone: "alert",
					icon: "mdi:alert-circle-outline"
				});
			} finally {
				window.setTimeout(() => this.actionState = "idle", 850);
			}
		}
	}
	renderContent() {
		let e = this.config.name ?? "Action", t = this.config.icon ?? "mdi:gesture-tap-button";
		return b`<hd-widget-frame
      .icon=${t}
      .name=${e}
      .stateText=${"Tap to run"}
      .size=${this.currentSize}
      .layout=${this.layout}
      .accent=${"accent"}
      .active=${!1}
      .hasDetail=${!1}
      .quickKind=${"activate"}
      .quickLabel=${e}
      .actionState=${this.actionState}
      @hd-quick=${() => this._run()}
    ></hd-widget-frame>`;
	}
};
eo = V([k("hd-widget-action")], eo), T(), O(), A(), q(), gi(), B(), G(), Ti(), H();
var to, no = (to = class extends K {
	constructor(...e) {
		super(...e), this._trend = [], this._fetchedFor = "";
	}
	hasDetail() {
		return !0;
	}
	get _opts() {
		return this.config.type === "energy" ? this.config.options ?? {} : {};
	}
	relevantEntityIds() {
		return Object.values(this._opts).filter((e) => typeof e == "string");
	}
	updated() {
		let e = this._opts.gridPower;
		this.currentSize === "2x2" && e && this.hass?.connected && this._fetchedFor !== e && (this._fetchedFor = e, this._loadTrend(e));
	}
	async _loadTrend(e) {
		if (!this.hass) return;
		let t = await hi(this.hass, e, 24);
		this._trend = t.map((e) => e.value);
	}
	_num(e) {
		if (!e || !this.hass) return null;
		let t = this.hass.states[e];
		if (!t) return null;
		let n = Number(t.state);
		return Number.isFinite(n) ? n : null;
	}
	_powerText(e) {
		let t = Math.abs(e);
		return t >= 1e3 ? {
			value: R(t / 1e3),
			unit: "kW"
		} : {
			value: String(Math.round(t)),
			unit: "W"
		};
	}
	renderContent() {
		let e = this._opts, t = this._num(e.gridPower), n = this._num(e.solarPower), r = this._num(e.solarToday), i = this._num(e.forecastEndOfDay), a = this._num(e.solarForecastRemaining), o = this.currentSize, s = (t ?? 0) >= 0, c = t == null || s ? "var(--text-primary)" : "var(--state-eco)", l = t == null ? {
			value: "—",
			unit: ""
		} : this._powerText(t);
		return b`
      <hd-widget-frame
        .icon=${s ? "mdi:transmission-tower-import" : "mdi:solar-power"}
        .name=${this.config.name ?? "Energy"}
        .stateText=${""}
        .size=${o}
        .accent=${s ? "accent" : "eco"}
        .active=${!1}
        .hasDetail=${!0}
        .quickKind=${"none"}
        @hd-activate=${() => this.openDetail()}
      >
        <div>
          <div class="hero" style=${`--flow-color:${c}`}>
            <span class="num">${l.value}</span><span class="unit">${l.unit}</span>
          </div>
          <div class="flow-label">
            ${t == null ? "Grid power unavailable" : s ? "Importing from grid" : "Exporting to grid"}
          </div>
        </div>

        <div class="stats">
          ${n == null ? S : b`<hd-status-badge tone="eco" icon="mdi:solar-power-variant" text=${`${this._powerText(n).value} ${this._powerText(n).unit} now`}></hd-status-badge>`}
          ${r == null ? S : b`<hd-status-badge tone="eco" icon="mdi:weather-sunny" text=${`${R(r)} kWh today`}></hd-status-badge>`}
          ${a != null && n == null ? b`<hd-status-badge tone="neutral" icon="mdi:chart-bell-curve" text=${`${R(a)} kWh left`}></hd-status-badge>` : S}
          ${i != null && (o === "2x2" || o === "2x1") ? b`<hd-status-badge tone="neutral" icon="mdi:chart-line" text=${`${R(i)} kWh forecast`}></hd-status-badge>` : S}
        </div>

        ${o === "2x2" && this._trend.length > 1 ? b`<div class="trend">
              <hd-trend .points=${this._trend} .color=${"var(--accent)"} .summary=${"24 hour grid power"}></hd-trend>
            </div>` : S}
      </hd-widget-frame>
    `;
	}
}, to.styles = l`
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
  `, to);
V([D()], no.prototype, "_trend", void 0), no = V([k("hd-widget-energy")], no);
function ro(e) {
	if (!e) return null;
	let t = Number(e.state);
	if (!Number.isFinite(t)) return null;
	let n = String(e.attributes.unit_of_measurement ?? "").toLowerCase();
	return n === "kw" ? t * 1e3 : n === "mw" ? t * 1e6 : t;
}
function io(e) {
	return e > 0 ? e : 0;
}
function ao(e) {
	let t = e.grid ?? 0, n = io(e.solar ?? 0), r = io(e.car ?? 0), i = e.carActive ? r : 0, a = io(t), o = io(-t), s = io(n + t - i), c = a > 25 || o > 25, l = n > 25, u = e.carActive && i > 25, d = a > 25 ? "import" : o > 25 ? "export" : "idle", f = {
		watts: d === "export" ? o : a,
		direction: d === "import" ? "toHouse" : d === "export" ? "toGrid" : "idle",
		active: c,
		source: d === "export" ? "solar" : "grid"
	}, p = {
		watts: n,
		direction: l ? "toHouse" : "idle",
		active: l,
		source: "solar"
	}, m = {
		watts: i,
		direction: u ? "toCar" : "idle",
		active: u,
		source: u && (o > 25 || n > i) ? "solar" : "grid"
	}, h = s + i, ee = h > 0 ? Math.round(Math.min(n, h) / h * 100) : n > 0 ? 100 : 0;
	return {
		grid: {
			watts: Math.abs(t),
			active: c,
			mode: d
		},
		solar: {
			watts: n,
			active: l
		},
		house: {
			watts: s,
			active: s > 25
		},
		car: {
			watts: i,
			active: u,
			connected: e.carConnected ?? e.carActive
		},
		paths: {
			gridHouse: f,
			solarHouse: p,
			houseCar: m
		},
		selfSufficiency: ee
	};
}
function oo(e) {
	if (!e) return !1;
	let t = e.toLowerCase();
	return t === "charging" || t === "starting";
}
function so(e) {
	if (!e) return !1;
	let t = e.toLowerCase();
	return t !== "not_connected" && t !== "disconnected" && t !== "unavailable" && t !== "unknown";
}
T(), O(), A(), q(), B(), G(), U(), H();
var co;
function lo(e, t) {
	let n = (t) => t ? ro(e.states[t]) : null, r = n(t.gridPower), i = n(t.solarPower), a = n(t.carPower);
	if ((a == null || a === 0) && t.carPowerAlt) {
		let e = n(t.carPowerAlt);
		e != null && e > 0 && (a = e);
	}
	let o = t.carActive ? e.states[t.carActive]?.state : void 0, s = t.carActiveAlt ? e.states[t.carActiveAlt]?.state : void 0, c = oo(o) || oo(s), l = so(o) || so(s);
	return ao({
		grid: r,
		solar: i,
		car: a,
		carActive: c,
		carConnected: l
	});
}
function uo(e) {
	let t = Math.abs(e);
	return t >= 1e3 ? `${R(t / 1e3)} kW` : `${Math.round(t)} W`;
}
var Q = {
	grid: [25, 26],
	solar: [75, 26],
	house: [50, 50],
	car: [50, 80]
}, fo = {
	grid: [40, 40],
	solar: [60, 40],
	car: [67, 64]
}, po = 10, mo = 13;
function ho(e, t) {
	let n = Math.hypot(e, t) || 1;
	return [e / n, t / n];
}
function go(e, t, n, r, i) {
	let [a, o] = ho(t[0] - e[0], t[1] - e[1]), s = [e[0] + a * r, e[1] + o * r], [c, l] = ho(t[0] - n[0], t[1] - n[1]), u = [n[0] + c * i, n[1] + l * i], d = `M ${s[0].toFixed(2)} ${s[1].toFixed(2)} Q ${t[0]} ${t[1]} ${u[0].toFixed(2)} ${u[1].toFixed(2)}`, [f, p] = ho(u[0] - t[0], u[1] - t[1]), m = 3.1, h = [u[0] - f * m, u[1] - p * m], ee = -p * m * .6, g = f * m * .6;
	return {
		d,
		chevron: `${u[0].toFixed(2)},${u[1].toFixed(2)} ${(h[0] + ee).toFixed(2)},${(h[1] + g).toFixed(2)} ${(h[0] - ee).toFixed(2)},${(h[1] - g).toFixed(2)}`
	};
}
var _o = (e, t, n) => e + (t - e) * n, vo = (e) => 1 - (1 - e) ** 3, yo = (co = class extends w {
	constructor(...e) {
		super(...e), this._shown = {
			grid: 0,
			solar: 0,
			house: 0,
			car: 0
		}, this._raf = 0;
	}
	willUpdate(e) {
		e.has("model") && this._retween();
	}
	disconnectedCallback() {
		super.disconnectedCallback(), cancelAnimationFrame(this._raf);
	}
	_retween() {
		let e = this.model;
		if (!e) return;
		let t = {
			grid: e.grid.watts,
			solar: e.solar.watts,
			house: e.house.watts,
			car: e.car.watts
		};
		if (typeof window < "u" && window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) {
			this._shown = t;
			return;
		}
		let n = { ...this._shown }, r = performance.now();
		cancelAnimationFrame(this._raf);
		let i = (e) => {
			let a = Math.min(1, (e - r) / 420), o = vo(a);
			this._shown = {
				grid: _o(n.grid, t.grid, o),
				solar: _o(n.solar, t.solar, o),
				house: _o(n.house, t.house, o),
				car: _o(n.car, t.car, o)
			}, a < 1 && (this._raf = requestAnimationFrame(i));
		};
		this._raf = requestAnimationFrame(i);
	}
	_speed(e) {
		return Math.min(2.4, Math.max(.7, 2.6 - e / 2500));
	}
	_conn(e, t, n, r, i) {
		return Ne`
      <path class="track" d=${t.d}></path>
      <path class="band ${n ? "on" : ""}" d=${e.d} style=${`stroke:${r};--pc:${r}`}></path>
      ${n ? Ne`<path class="flow" d=${e.d} style=${`stroke:${r};animation-duration:${this._speed(i)}s`}></path>` : S}
      <polygon class="chevron ${n ? "on" : ""}" points=${e.chevron} style=${`fill:${r}`}></polygon>
    `;
	}
	_node(e, t, n, r, i, a) {
		let [o, s] = Q[e], c = e === "house";
		return b`<div class="${`node ${c ? "hub " : ""}${r ? "active" : "idle"}`}" style=${`left:${o}%;top:${s}%;--n-fg:${i}`}>
      <div class="disc"><hd-icon .icon=${t} .size=${c ? 26 : 22}></hd-icon></div>
      <div class="label">${uo(this._shown[e])}</div>
      ${a ?? b`<div class="name">${n}</div>`}
    </div>`;
	}
	render() {
		let e = this.model;
		if (!e) return S;
		let t = "var(--state-eco)", n = "var(--accent)", r = e.grid.mode !== "export", i = e.grid.mode === "export" ? t : n, a = e.paths.houseCar.source === "solar" ? t : n, o = r ? go(Q.grid, fo.grid, Q.house, po, mo) : go(Q.house, fo.grid, Q.grid, mo, po), s = go(Q.grid, fo.grid, Q.house, po, mo), c = go(Q.solar, fo.solar, Q.house, po, mo), l = go(Q.house, fo.car, Q.car, mo, po), u = e.grid.mode === "export" ? t : e.grid.mode === "import" ? n : "var(--text-tertiary)", d = e.grid.mode === "export" ? `Exporting ${uo(e.grid.watts)}` : e.grid.mode === "import" ? `Importing ${uo(e.grid.watts)}` : "Grid balanced", f = e.solar.watts > 25;
		return b`
      <div class="stage">
        <div class="status" style=${`--status-color:${u}`}>
          <span class="dot"></span><span class="txt">${d}</span>
        </div>

        <svg class="paths" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid meet" aria-hidden="true">
          ${this._conn(c, c, e.paths.solarHouse.active, t, e.paths.solarHouse.watts)}
          ${this._conn(o, s, e.paths.gridHouse.active, i, e.paths.gridHouse.watts)}
          ${this._conn(l, l, e.paths.houseCar.active, a, e.paths.houseCar.watts)}
        </svg>

        ${this._node("solar", "mdi:solar-power", "Solar", e.solar.active, t)}
        ${this._node("grid", e.grid.mode === "export" ? "mdi:transmission-tower-export" : "mdi:transmission-tower", e.grid.mode === "export" ? "Export" : "Grid", e.grid.active, i)}
        ${this._node("car", e.car.connected ? "mdi:car-electric" : "mdi:car-electric-outline", "Car", e.car.active, a)}
        ${this._node("house", "mdi:home-variant", "House", e.house.active, "var(--text-primary)", f ? b`<div class="autarky">${e.selfSufficiency}% solar</div>` : b`<div class="name">House</div>`)}
      </div>
    `;
	}
}, co.styles = l`
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
  `, co);
V([E({ attribute: !1 })], yo.prototype, "model", void 0), V([D()], yo.prototype, "_shown", void 0), yo = V([k("hd-flow-diagram")], yo);
var bo = class extends K {
	get _opts() {
		return this.config.type === "powerflow" ? this.config.options ?? {} : {};
	}
	relevantEntityIds() {
		return Object.values(this._opts).filter((e) => typeof e == "string");
	}
	hasDetail() {
		return !0;
	}
	renderContent() {
		let e = this.hass ? lo(this.hass, this._opts) : void 0, t = e?.grid.mode === "export" ? "eco" : "accent";
		return b`
      <hd-widget-frame
        bleed
        .name=${this.config.name ?? "Power flow"}
        .size=${this.currentSize}
        .accent=${t}
        .hasDetail=${!0}
        .quickKind=${"none"}
        @hd-activate=${() => this.openDetail()}
      >
        <hd-flow-diagram .model=${e}></hd-flow-diagram>
      </hd-widget-frame>
    `;
	}
};
bo = V([k("hd-widget-powerflow")], bo), T(), A(), q(), L(), B(), Br(), G(), Ti(), U(), H();
var xo, So = "#E82127", Co = (e, t) => {
	if (!t || !e) return null;
	let n = e.states[t];
	if (!n) return null;
	let r = Number(n.state);
	return Number.isFinite(r) ? r : null;
}, wo = (e, t) => t ? e?.states[t]?.state : void 0;
function To(e, t) {
	let n = wo(e, t.master) === "on", r = wo(e, t.vehicleConnected) === "on", i = wo(e, t.chargingState), a = Co(e, t.chargePower), o = Co(e, t.battery), s = Co(e, t.chargeLimit), c = Co(e, t.sessionEnergy), l = Co(e, t.chargeRate), u = Co(e, t.chargeCurrent), d = i === "charging" || i === "starting" || (a ?? 0) > .1, f = i === "complete", p;
	p = r ? d ? "charging" : f ? "complete" : n ? "waiting" : "off" : "unplugged";
	let m = a == null ? "—" : R(a), h = {
		unplugged: {
			label: "Car not connected",
			tone: "neutral",
			icon: "mdi:ev-plug-type2"
		},
		charging: {
			label: n ? `Solar charging · ${m} kW` : `Charging · ${m} kW`,
			tone: n ? "eco" : "accent",
			icon: "mdi:ev-station"
		},
		complete: {
			label: "Charge complete",
			tone: "eco",
			icon: "mdi:battery-charging-100"
		},
		waiting: {
			label: "Waiting for surplus",
			tone: "accent",
			icon: "mdi:solar-power-variant"
		},
		off: {
			label: "Solar mode off",
			tone: "neutral",
			icon: "mdi:ev-station"
		}
	};
	return {
		armed: n,
		connected: r,
		phase: p,
		powerKw: a,
		batteryPct: o,
		limitPct: s,
		sessionKwh: c,
		rateKmh: l,
		currentA: u,
		...h[p]
	};
}
var Eo = (xo = class extends K {
	get _opts() {
		return this.config.type === "solarcharging" ? this.config.options ?? {} : {};
	}
	get _branded() {
		let e = this._opts;
		return e.brand === "tesla" || e.branded === !0;
	}
	relevantEntityIds() {
		return Object.values(this._opts).filter((e) => typeof e == "string");
	}
	hasDetail() {
		return !0;
	}
	_toggleMaster() {
		let e = this._opts.master;
		e && this.callService(Lt(e), { errorVerb: "toggle solar charging" });
	}
	_renderHero(e) {
		let t = e.batteryPct, n = e.limitPct, r = e.phase === "charging", i = [];
		e.rateKmh != null && e.rateKmh > .5 && i.push(`${Math.round(e.rateKmh)} km/h`), e.sessionKwh != null && e.sessionKwh > .01 && i.push(`${R(e.sessionKwh)} kWh session`);
		let a = t == null ? S : b`<div class="hbattery">
            <div class="brow">
              <span>Battery ${Math.round(t)}%</span>
              <span>${n == null ? "" : `Target ${Math.round(n)}%`}</span>
            </div>
            <div class="btrack">
              <div class="bfill" style=${`width:${Math.min(100, Math.max(0, t))}%`}></div>
              ${n == null ? S : b`<div class="blimit" style=${`left:${Math.min(100, Math.max(0, n))}%`}></div>`}
            </div>
          </div>`;
		return b`
      <hd-widget-frame
        bleed
        .size=${this.currentSize}
        .accent=${e.tone === "neutral" ? "idle" : e.tone}
        .active=${e.armed}
        .hasDetail=${!0}
        .quickKind=${"none"}
        @hd-activate=${() => this.openDetail()}
      >
        <div class="hero" ?data-charging=${r && e.armed}>
          <div class="glow"></div>
          <img
            class="car"
            src=${zr("assets/tesla-model-3.webp")}
            alt=""
            aria-hidden="true"
            draggable="false"
          />
          <div class="top">
            <div class="brand">Tesla</div>
            <div class="htext">
              <span class="hname">${this.config.name ?? "Solar charging"}</span>
              <span class="hstatus">${e.label}</span>
              ${i.length ? b`<span class="hstatus">${i.join(" · ")}</span>` : S}
            </div>
          </div>
          <div class="bottom">
            ${a}
            <div class="controls" @click=${(e) => e.stopPropagation()}>
              <button
                class="pill ${e.armed ? "armed" : ""}"
                aria-pressed=${e.armed ? "true" : "false"}
                aria-label=${e.armed ? "Turn off solar charging" : "Turn on solar charging"}
                @click=${() => this._toggleMaster()}
              >
                <hd-icon icon="mdi:solar-power-variant" .size=${18}></hd-icon>
                ${e.armed ? "Solar on" : "Solar off"}
              </button>
            </div>
          </div>
        </div>
      </hd-widget-frame>
    `;
	}
	renderContent() {
		let e = To(this.hass, this._opts), t = this.currentSize;
		if (this._branded && t === "2x2") return this._renderHero(e);
		let n = e.batteryPct, r = e.limitPct, i = e.phase === "charging" && e.armed ? "var(--state-eco)" : "var(--accent)", a = n != null && (t === "2x2" || t === "1x2"), o = t === "2x2" || t === "1x2" || t === "2x1";
		return b`
      <hd-widget-frame
        .icon=${e.icon}
        .name=${this.config.name ?? "Solar charging"}
        .stateText=${e.label}
        .secondary=${n == null ? "" : `Battery ${Math.round(n)}%${r == null ? "" : ` → ${Math.round(r)}%`}`}
        .size=${t}
        .accent=${e.tone === "neutral" ? "idle" : e.tone}
        .active=${e.armed}
        .hasDetail=${!0}
        .quickKind=${"toggle"}
        .quickLabel=${e.armed ? "Turn off solar charging" : "Turn on solar charging"}
        @hd-quick=${() => this._toggleMaster()}
        @hd-activate=${() => this.openDetail()}
      >
        ${a ? b`<div class="battery">
              <div class="line">
                <span class="soc">${Math.round(n)}%</span>
                ${r == null ? S : b`<span>Target ${Math.round(r)}%</span>`}
              </div>
              <div class="bar" style=${`--fill:${i}`}>
                <div class="fill" style=${`width:${Math.min(100, Math.max(0, n))}%`}></div>
                ${r == null ? S : b`<div class="limit" style=${`left:${Math.min(100, Math.max(0, r))}%`}></div>`}
              </div>
            </div>` : S}
        ${o ? b`<div class="stats">
              ${e.powerKw != null && e.powerKw > .05 ? b`<hd-status-badge
                    tone=${e.armed ? "eco" : "accent"}
                    icon="mdi:flash"
                    text=${`${R(e.powerKw)} kW`}
                  ></hd-status-badge>` : S}
              ${e.sessionKwh != null && e.sessionKwh > .01 ? b`<hd-status-badge
                    tone="neutral"
                    icon="mdi:counter"
                    text=${`${R(e.sessionKwh)} kWh session`}
                  ></hd-status-badge>` : S}
              ${e.rateKmh != null && e.rateKmh > .5 ? b`<hd-status-badge
                    tone="neutral"
                    icon="mdi:speedometer"
                    text=${`${Math.round(e.rateKmh)} km/h`}
                  ></hd-status-badge>` : S}
            </div>` : S}
      </hd-widget-frame>
    `;
	}
}, xo.styles = l`
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

    /* ---- Tesla branded hero (dark premium) ------------------------------ */
    .hero {
      position: relative;
      min-height: 300px;
      height: 100%;
      width: 100%;
      overflow: hidden;
      color: #fff;
      isolation: isolate;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      padding: 22px 26px;
      box-sizing: border-box;
      /* Graphite → near-black base, with Tesla red as a glow from the lower
         right (behind the car) — dark and minimal, red as accent not fill. */
      background:
        radial-gradient(115% 130% at 84% 118%, rgba(232, 33, 39, 0.5) 0%, rgba(232, 33, 39, 0) 52%),
        radial-gradient(120% 130% at 8% -25%, #303236 0%, #191b1e 48%, #0b0c0e 100%);
    }
    /* bottom vignette so the car's base grounds into the dark */
    .hero::before {
      content: "";
      position: absolute;
      inset: auto 0 0 0;
      height: 42%;
      background: linear-gradient(to top, rgba(8, 9, 10, 0.72) 0%, rgba(8, 9, 10, 0) 100%);
      z-index: 1;
    }
    .hero .glow {
      position: absolute;
      right: -6%;
      bottom: -4%;
      width: 82%;
      height: 86%;
      background: radial-gradient(closest-side, rgba(232, 33, 39, 0.55), rgba(232, 33, 39, 0) 70%);
      z-index: 0;
      pointer-events: none;
    }
    .hero .car {
      position: absolute;
      right: -4%;
      bottom: 4%;
      width: 70%;
      height: auto;
      max-height: 78%;
      object-fit: contain;
      filter: drop-shadow(0 18px 26px rgba(0, 0, 0, 0.55));
      /* fade the image's baked ground shadow into the dark base */
      -webkit-mask-image: linear-gradient(to bottom, #000 78%, transparent 98%);
      mask-image: linear-gradient(to bottom, #000 78%, transparent 98%);
      z-index: 2;
      pointer-events: none;
      user-select: none;
    }
    .hero[data-charging] .glow {
      animation: teslapulse 3.4s ease-in-out infinite;
    }
    @keyframes teslapulse {
      50% {
        opacity: 0.62;
        transform: scale(1.07);
      }
    }
    @media (prefers-reduced-motion: reduce) {
      .hero[data-charging] .glow {
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
      letter-spacing: 0.34em;
      text-transform: uppercase;
      opacity: 0.92;
    }
    .hero .htext {
      margin-top: 6px;
      max-width: 60%;
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
    .hero .hbattery {
      max-width: 54%;
      margin-bottom: 12px;
      display: flex;
      flex-direction: column;
      gap: 5px;
    }
    .hero .brow {
      display: flex;
      justify-content: space-between;
      gap: 8px;
      font: var(--text-meta);
      color: rgba(255, 255, 255, 0.9);
      font-variant-numeric: tabular-nums;
    }
    .hero .btrack {
      position: relative;
      height: 6px;
      border-radius: var(--radius-pill);
      background: rgba(255, 255, 255, 0.28);
      overflow: hidden;
    }
    .hero .bfill {
      position: absolute;
      inset: 0 auto 0 0;
      border-radius: inherit;
      background: #fff;
      transition: width var(--motion-state) var(--ease-standard);
    }
    .hero .blimit {
      position: absolute;
      top: -2px;
      bottom: -2px;
      width: 2px;
      background: rgba(255, 255, 255, 0.85);
    }
    .hero .controls {
      display: flex;
      gap: 8px;
      align-items: center;
    }
    .hero .pill {
      appearance: none;
      border: none;
      cursor: pointer;
      height: 44px;
      min-width: 44px;
      padding: 0 16px;
      border-radius: var(--radius-pill);
      background: rgba(255, 255, 255, 0.17);
      color: #fff;
      font: var(--text-meta);
      font-weight: 650;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 7px;
      -webkit-backdrop-filter: blur(4px);
      backdrop-filter: blur(4px);
      transition: background var(--motion-state) var(--ease-standard), transform var(--motion-press) var(--ease-standard);
    }
    .hero .pill:hover {
      background: rgba(255, 255, 255, 0.28);
    }
    .hero .pill:active {
      transform: scale(0.94);
    }
    .hero .pill.armed {
      background: #fff;
      color: ${c(So)};
    }
    .hero .pill.armed:hover {
      background: rgba(255, 255, 255, 0.88);
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
  `, xo);
Eo = V([k("hd-widget-solarcharging")], Eo);
//#endregion
//#region src/home-assistant/statistics.ts
function Do(e) {
	let t = {};
	for (let [n, r] of Object.entries(e ?? {})) t[n] = (r ?? []).map((e) => ({
		start: typeof e.start == "number" ? e.start : Date.parse(String(e.start)),
		change: Number.isFinite(e.change) ? e.change : 0
	}));
	return t;
}
function Oo(e, t, n = /* @__PURE__ */ new Date()) {
	let r = new Date(n);
	if (r.setHours(0, 0, 0, 0), e === "day") r.setDate(r.getDate() - (t - 1));
	else if (e === "week") {
		let e = (r.getDay() + 6) % 7;
		r.setDate(r.getDate() - e - 7 * (t - 1));
	} else r.setDate(1), r.setMonth(r.getMonth() - (t - 1));
	return r;
}
function ko(e, t) {
	let n = new Date(e);
	return Number.isNaN(n.getTime()) ? "" : t === "day" ? n.toLocaleDateString(void 0, { weekday: "short" }) : t === "week" ? n.toLocaleDateString(void 0, {
		day: "numeric",
		month: "short"
	}) : n.toLocaleDateString(void 0, { month: "short" });
}
async function Ao(e, t, n, r) {
	let i = t.filter(Boolean);
	return i.length ? Do(await e.callWS({
		type: "recorder/statistics_during_period",
		start_time: r.toISOString(),
		statistic_ids: i,
		period: n,
		types: ["change"]
	})) : {};
}
T(), O(), A(), H();
var jo, Mo = (e) => {
	if (e <= 0) return 1;
	let t = 10 ** Math.floor(Math.log10(e)), n = e / t;
	return (n <= 1 ? 1 : n <= 2 ? 2 : n <= 5 ? 5 : 10) * t;
}, No = (e) => Math.abs(e) >= 100 ? Math.round(e).toString() : e.toFixed(1), Po = (jo = class extends w {
	constructor(...e) {
		super(...e), this.series = [], this.labels = [], this.unit = "", this.legend = !0;
	}
	_total(e) {
		return e.values.reduce((e, t) => e + (Number.isFinite(t) ? t : 0), 0);
	}
	render() {
		let e = this.labels.length, t = this.series.filter((e) => e.values.some((e) => e > 0)), n = Math.max(0, ...this.series.flatMap((e) => e.values.filter((e) => Number.isFinite(e))));
		if (!e || !t.length || n <= 0) return b`<div class="empty">No data for this period</div>`;
		let r = Mo(n), i = t.map((e) => `${e.label} ${No(this._total(e))} ${this.unit}`).join(", ");
		return b`
      <div class="wrap" role="img" aria-label=${i}>
        <div class="plot">
          <span class="ymax">${No(r)} ${this.unit}</span>
          ${this.labels.map((e, t) => b`<div class="group">
              <div class="bars">
                ${this.series.map((e) => {
			let n = Number.isFinite(e.values[t]) ? e.values[t] : 0, i = n <= 0 ? 0 : Math.max(1.5, n / r * 100);
			return b`<div
                    class="bar"
                    style=${`--c:${e.color};height:${i}%`}
                    title=${`${e.label}: ${No(n)} ${this.unit}`}
                  ></div>`;
		})}
              </div>
              <div class="xlabel">${e}</div>
            </div>`)}
        </div>
        ${this.legend ? b`<div class="legend">
              ${this.series.map((e) => b`<span class="key" style=${`--c:${e.color}`}>
                  <i></i>${e.label} <b>${No(this._total(e))} ${this.unit}</b>
                </span>`)}
            </div>` : S}
      </div>
    `;
	}
}, jo.styles = l`
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
  `, jo);
V([E({ attribute: !1 })], Po.prototype, "series", void 0), V([E({ attribute: !1 })], Po.prototype, "labels", void 0), V([E({ type: String })], Po.prototype, "unit", void 0), V([E({ type: Boolean })], Po.prototype, "legend", void 0), Po = V([k("hd-bar-chart")], Po), T(), O(), A(), q(), G(), _r(), H();
var Fo, Io = [
	{
		key: "solar",
		label: "Solar",
		color: "#f4b740"
	},
	{
		key: "gridImport",
		label: "Import",
		color: "var(--accent)"
	},
	{
		key: "gridExport",
		label: "Export",
		color: "var(--state-eco)"
	},
	{
		key: "car",
		label: "Car",
		color: "#8b7cf6"
	}
], Lo = {
	day: 7,
	week: 8,
	month: 12
}, Ro = (Fo = class extends K {
	constructor(...e) {
		super(...e), this._period = "day", this._data = {}, this._periodInit = !1, this._fetchKey = "";
	}
	get _opts() {
		return this.config.type === "energychart" ? this.config.options ?? {} : {};
	}
	relevantEntityIds() {
		return [];
	}
	hasDetail() {
		return !1;
	}
	_ids() {
		return Io.map((e) => this._opts[e.key]).filter((e) => typeof e == "string");
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
		let e = this._ids();
		if (!e.length) return;
		let t = `${this._period}|${e.join(",")}`;
		if (t !== this._fetchKey) {
			this._fetchKey = t;
			try {
				let t = Oo(this._period, Lo[this._period]);
				this._data = await Ao(this.hass, e, this._period, t);
			} catch {
				this._data = {};
			}
		}
	}
	_setPeriod(e) {
		e !== this._period && (this._period = e);
	}
	_chart() {
		let e = Lo[this._period], t = /* @__PURE__ */ new Set();
		for (let e of Io) {
			let n = this._opts[e.key];
			if (n) for (let e of this._data[n] ?? []) t.add(e.start);
		}
		let n = [...t].sort((e, t) => e - t).slice(-e);
		return {
			labels: n.map((e) => ko(e, this._period)),
			series: Io.filter((e) => this._opts[e.key]).map((e) => {
				let t = new Map((this._data[this._opts[e.key]] ?? []).map((e) => [e.start, e.change]));
				return {
					label: e.label,
					color: e.color,
					values: n.map((e) => t.get(e) ?? 0)
				};
			})
		};
	}
	renderContent() {
		let { labels: e, series: t } = this._chart();
		return b`
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
			{
				value: "day",
				label: "Day"
			},
			{
				value: "week",
				label: "Week"
			},
			{
				value: "month",
				label: "Month"
			}
		]}
            .value=${this._period}
            label="History period"
            @hd-select=${(e) => this._setPeriod(e.detail.value)}
          ></hd-segmented>
        </div>
        <div class="chart-box">
          <hd-bar-chart .series=${t} .labels=${e} unit="kWh"></hd-bar-chart>
        </div>
      </hd-widget-frame>
    `;
	}
}, Fo.styles = l`
    .head {
      display: flex;
      justify-content: flex-end;
      margin-bottom: 4px;
    }
    .chart-box {
      flex: 1;
      min-height: 0;
    }
  `, Fo);
V([D()], Ro.prototype, "_period", void 0), V([D()], Ro.prototype, "_data", void 0), V([D()], Ro.prototype, "_periodInit", void 0), Ro = V([k("hd-widget-energychart")], Ro), T(), A(), q(), Qn(), B(), U(), H();
var zo, Bo = (zo = class extends K {
	get _opts() {
		return this.config.options ?? {};
	}
	relevantEntityIds() {
		let e = this._opts;
		return [
			this.config.entity,
			e.chargeStatus,
			e.connected
		].filter((e) => typeof e == "string");
	}
	_valueText() {
		let e = this._opts, t = this.entityId ? this.hass?.states[this.entityId] : void 0;
		if (!t) return "—";
		if (e.format === "power") {
			let e = ro(t);
			if (e == null) return "—";
			let n = Math.abs(e);
			return n >= 1e3 ? `${R(n / 1e3)} kW` : `${Math.round(n)} W`;
		}
		if (e.format === "percent") {
			let e = Number(t.state);
			return Number.isFinite(e) ? `${Math.round(e)}%` : "—";
		}
		return yn(this.hass, t);
	}
	_statusText() {
		let e = this._opts;
		if (e.status === "gridDirection") {
			let e = this.entityId ? this.hass?.states[this.entityId] : void 0, t = e ? ro(e) : null;
			return t == null ? "" : t > 25 ? "Importing" : t < -25 ? "Exporting" : "Balanced";
		}
		if (e.status === "carCharge") {
			let t = e.chargeStatus ? this.hass?.states[e.chargeStatus]?.state : void 0;
			return (e.connected ? this.hass?.states[e.connected]?.state : void 0) === "on" || so(t) ? oo(t) ? "Charging" : "Plugged in" : "Disconnected";
		}
		return "";
	}
	renderContent() {
		let e = this._opts, t = Yn(e.accent ?? "idle").fg, n = this.entityId ? this.hass?.states[this.entityId] : void 0, r = !n || n.state === "unavailable" || n.state === "unknown";
		this.setAttribute("data-unavailable", r ? "true" : "false");
		let i = this._valueText(), a = this._statusText(), o = a ? `${i} • ${a}` : i;
		return b`
      <button
        class="tile"
        style=${`--glyph:${t}`}
        aria-label=${`${this.config.name ?? ""} details`}
        @click=${() => this.openDetail()}
      >
        <span class="glyph">
          <hd-icon .icon=${this.config.icon ?? "mdi:flash"} .size=${24}></hd-icon>
        </span>
        <span class="text">
          <span class="name">${this.config.name ?? ""}</span>
          <span class="sub">${o}</span>
        </span>
        ${S}
      </button>
    `;
	}
}, zo.styles = l`
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
  `, zo);
Bo = V([k("hd-widget-metrictile")], Bo), T(), O(), A(), q(), B(), H();
var Vo, Ho = (Vo = class extends K {
	constructor(...e) {
		super(...e), this._import = 0, this._export = 0, this._ready = !1, this._timer = 0;
	}
	get _opts() {
		return this.config.type === "electricitytotal" ? this.config.options ?? {} : {};
	}
	relevantEntityIds() {
		return [];
	}
	hasDetail() {
		return !1;
	}
	connectedCallback() {
		super.connectedCallback(), this._timer = window.setInterval(() => void this._fetch(), 3e5);
	}
	disconnectedCallback() {
		super.disconnectedCallback(), window.clearInterval(this._timer);
	}
	updated() {
		this._ready || this._fetch();
	}
	_sum(e) {
		return (e ?? []).reduce((e, t) => e + (t.change || 0), 0);
	}
	async _fetch() {
		if (!this.hass?.connected) return;
		let e = this._opts.importEnergy, t = this._opts.exportEnergy, n = [e, t].filter((e) => typeof e == "string");
		if (n.length) try {
			let r = await Ao(this.hass, n, "day", Oo("day", 1));
			this._import = e ? this._sum(r[e]) : 0, this._export = t ? this._sum(r[t]) : 0, this._ready = !0;
		} catch {}
	}
	_term(e, t, n, r) {
		return b`<div class="term">
      <span class="num" style=${`--n:${r}`}><b>${R(e)}</b><span class="u">${t}</span></span>
      <span class="lbl">${n}</span>
    </div>`;
	}
	renderContent() {
		let e = this._import - this._export, t = !this._ready;
		return b`
      <h2 class="title">${this.config.name ?? "Electricity Total"}</h2>
      <div class="card" style=${t ? "opacity:0.6" : ""}>
        <span class="lead"><hd-icon icon="mdi:flash" .size=${26}></hd-icon></span>
        ${this._term(this._import, "kWh", "Imported", "var(--accent)")}
        <span class="op">−</span>
        ${this._term(this._export, "kWh", "Exported", "var(--state-eco)")}
        <span class="op">=</span>
        ${this._term(e, "kWh", "Total", "var(--accent)")}
        ${S}
      </div>
    `;
	}
}, Vo.styles = l`
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
  `, Vo);
V([D()], Ho.prototype, "_import", void 0), V([D()], Ho.prototype, "_export", void 0), V([D()], Ho.prototype, "_ready", void 0), Ho = V([k("hd-widget-electricitytotal")], Ho), T(), O(), A(), q(), tr(), B(), G(), H();
var Uo, Wo, Go = (Uo = class extends K {
	constructor(...e) {
		super(...e), this._cacheBust = Date.now(), this._timer = 0;
	}
	connectedCallback() {
		super.connectedCallback(), this._timer = window.setInterval(() => this._cacheBust = Date.now(), 1e4);
	}
	disconnectedCallback() {
		super.disconnectedCallback(), window.clearInterval(this._timer);
	}
	renderContent() {
		let e = this.vm, t = e.stateObj?.attributes.entity_picture, n = t ? `${t}${t.includes("?") ? "&" : "?"}_=${this._cacheBust}` : void 0;
		return b`<hd-widget-frame
      bleed
      .name=${e.name}
      .size=${this.currentSize}
      .accent=${"accent"}
      .hasDetail=${!0}
      .quickKind=${"none"}
      @hd-activate=${() => this.openDetail()}
    >
      <div class="tile">
        ${n && e.available ? b`<img src=${n} alt=${`Live view of ${e.name}`} loading="lazy" />` : b`<div class="off"><hd-icon icon="mdi:cctv" .size=${34}></hd-icon><span>${e.displayState}</span></div>`}
        <span class="label">${e.name}</span>
      </div>
    </hd-widget-frame>`;
	}
}, Uo.styles = l`
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
  `, Uo);
V([D()], Go.prototype, "_cacheBust", void 0), Go = V([k("hd-widget-camera")], Go);
var Ko = (Wo = class extends K {
	async _call(e, t) {
		!this.entityId || !this.hass || t && !await $n(this, {
			title: `${z(e.replace("alarm_", "").replace("_", " "))}?`,
			confirmLabel: "Confirm",
			destructive: e === "alarm_disarm"
		}) || this.callService({
			domain: "alarm_control_panel",
			service: e,
			data: { entity_id: this.entityId }
		}, { errorVerb: "update" });
	}
	renderContent() {
		let e = this.vm, t = e.rawState, n = t === "triggered" ? "alert" : t.startsWith("armed") ? "warn" : t === "disarmed" ? "eco" : "accent", r = this.currentSize, i = t !== "disarmed";
		return b`<hd-widget-frame
      .icon=${t === "triggered" ? "mdi:shield-alert" : i ? "mdi:shield-home" : "mdi:shield-off"}
      .name=${e.name}
      .stateText=${z(t.replace("_", " "))}
      .size=${r}
      .accent=${n}
      .active=${i}
      .unavailable=${!e.available}
      .hasDetail=${!0}
      .quickKind=${"none"}
      @hd-activate=${() => this.openDetail()}
    >
      ${r === "1x1" ? S : b`<div class="controls" @click=${(e) => e.stopPropagation()}>
            ${i ? b`<button class="danger" @click=${() => this._call("alarm_disarm", !0)}>Disarm</button>` : b`<button @click=${() => this._call("alarm_arm_home", !1)}>Arm home</button>
                  <button @click=${() => this._call("alarm_arm_away", !1)}>Arm away</button>`}
          </div>`}
    </hd-widget-frame>`;
	}
}, Wo.styles = l`
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
  `, Wo);
//#endregion
//#region src/widgets/widget-registry.ts
Ko = V([k("hd-widget-alarm")], Ko), $i();
var qo = {
	group: "hd-group",
	binary_sensor: "hd-widget-binary",
	person: "hd-widget-person",
	scene: "hd-widget-scene",
	script: "hd-widget-script",
	button: "hd-widget-button",
	camera: "hd-widget-camera",
	energy: "hd-widget-energy",
	powerflow: "hd-widget-powerflow",
	solarcharging: "hd-widget-solarcharging",
	energychart: "hd-widget-energychart",
	metrictile: "hd-widget-metrictile",
	electricitytotal: "hd-widget-electricitytotal",
	alarm: "hd-widget-alarm",
	action: "hd-widget-action"
}, Jo = /* @__PURE__ */ new Map();
function Yo(e) {
	if (Jo.has(e)) return;
	let t = zi(e);
	if (!t) return;
	let n = t.load().catch((t) => {
		console.error(`[widget-registry] failed to load "${e}":`, t);
	});
	Jo.set(e, n);
}
function Xo(e) {
	let t = zi(e);
	return t ? (Yo(e), t.tag) : qo[e] ?? "hd-widget-sensor";
}
T(), G();
function Zo(e, t, n, r, i = "row") {
	try {
		let { colSpan: a, rowSpan: o } = ja(t, n), s = Ua(Xo(e.type));
		return Ga`<${s}
      class="cell"
      style=${`grid-column: span ${a}; grid-row: span ${o};`}
      .hass=${r}
      .config=${e}
      .currentSize=${t}
      .layout=${i}
    ></${s}>`;
	} catch (r) {
		return console.error(`[widget-cell] widget "${e?.id ?? e?.type}" failed to render:`, r), Qo(e, t, n);
	}
}
function Qo(e, t, n) {
	let r = 1, i = 1;
	try {
		({colSpan: r, rowSpan: i} = ja(t, n));
	} catch {}
	let a = `grid-column: span ${r}; grid-row: span ${i};`, o = e?.name || e?.entity || "Widget";
	return b`<hd-widget-frame
    class="cell"
    style=${a}
    icon="mdi:alert-circle-outline"
    .name=${o}
    stateText="Unavailable"
    secondary="Widget error"
    accent="alert"
    .size=${t}
    ?unavailable=${!0}
  ></hd-widget-frame>`;
}
T(), O(), A(), B(), Br(), U(), H();
var $o, es = 960, ts = 720;
function ns(e, t) {
	if (!e || !t) return [];
	let n = (t) => t ? ro(e.states[t]) : null, r = n(t.gridPower) ?? 0, i = n(t.solarPower) ?? 0, a = n(t.carPower) ?? 0, o = t.carConnected ? e.states[t.carConnected]?.state === "on" : !1, s = i + r - a, c = [];
	return i > 25 && c.push("solar-generating"), r < -25 ? c.push("grid-exporting") : r > 25 && c.push("grid-importing"), s > 25 && c.push("home-consuming"), o && a > 25 && c.push("ev-charging"), c;
}
var rs = ($o = class extends w {
	constructor(...e) {
		super(...e), this._reduce = !1;
	}
	connectedCallback() {
		super.connectedCallback(), this._reduce = typeof window < "u" && window.matchMedia?.("(prefers-reduced-motion: reduce)").matches === !0;
	}
	_num(e) {
		if (!e) return null;
		let t = Number(this.hass?.states[e]?.state);
		return Number.isFinite(t) ? t : null;
	}
	_stat(e, t) {
		return b`<div class="stat">
      <span class="v">${e == null ? "—" : R(e)}<span class="u">kWh</span></span>
      <span class="l">${t}</span>
    </div>`;
	}
	render() {
		let e = this.options, t = this._num(e?.solar), n = this._num(e?.grid), r = n != null && t != null ? n + t : null, i = ns(this.hass, e);
		return b`
      <div class="hero">
        <div class="inner">
          <div class="bar">
            <span class="pill">
              ${e?.label ?? "Today"}
              <hd-icon icon="mdi:calendar-blank" .size=${18}></hd-icon>
            </span>
          </div>
          <div class="stats">
            ${this._stat(n, "Grid")} ${this._stat(t, "Solar Panels")}
            ${this._stat(r, "Home")}
          </div>
          <div class="house">
            <img
              class="house-art"
              src=${zr("assets/energy-house.webp")}
              alt=""
              aria-hidden="true"
            />
            ${Da(i, (e) => e, (e) => b`
                <img
                  class="flow"
                  src=${zr(`assets/energy-flows/${e}${this._reduce ? "-still" : ""}.webp`)}
                  alt=""
                  aria-hidden="true"
                  decoding="async"
                />
              `)}
          </div>
        </div>
      </div>
    `;
	}
}, $o.styles = l`
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
      aspect-ratio: ${es} / ${ts};
    }
    .house > img {
      position: absolute;
      inset: 0;
      display: block;
      width: 100%;
      height: 100%;
      object-fit: contain;
      -webkit-user-drag: none;
      user-select: none;
    }
    .house-art {
      z-index: 0;
    }
    .flow {
      z-index: 1;
      pointer-events: none;
    }
  `, $o);
V([E({ attribute: !1 })], rs.prototype, "hass", void 0), V([E({ attribute: !1 })], rs.prototype, "options", void 0), rs = V([k("hd-energy-hero")], rs), T(), O(), A(), U(), G(), H();
var is, as = (is = class extends w {
	constructor(...e) {
		super(...e), this._elementWidth = new da(this);
	}
	render() {
		let e = this.view, t = Oa(this._elementWidth.width), n = `--pad:${t.pad}px`, r = e?.hero ? b`<hd-energy-hero .hass=${this.hass} .options=${e.hero}></hd-energy-hero>` : S;
		if (!e || e.widgets.length === 0 && !e.hero) return b`<div class="empty">
        <hd-icon icon="mdi:view-dashboard-outline" .size=${40}></hd-icon>
        <h3>No widgets yet</h3>
        <p>Add widgets to this view in <code>dashboard.config.ts</code>.</p>
      </div>`;
		let i = Ba(e.widgets);
		return b`
      ${r}
      <div class="stack" style=${n}>
        ${Da(i, (e) => e.id, (e) => Zo(e, ka(e, t.bucket), 1, this.hass, "row"))}
      </div>
      ${S}
    `;
	}
}, is.styles = l`
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
  `, is);
V([E({ attribute: !1 })], as.prototype, "hass", void 0), V([E({ attribute: !1 })], as.prototype, "view", void 0), as = V([k("hd-view-grid")], as), T(), F(), L(), B();
function os(e, t) {
	let n = Dt(t), r = t.state === "off", i = t.attributes.temperature ?? 20, a = t.attributes.current_temperature, o = t.attributes.target_temp_step ?? .5, s = t.attributes.hvac_modes ?? [], c = t.attributes.fan_modes ?? [], l = t.attributes.swing_modes ?? [], u = t.attributes.preset_modes ?? [], d = (e.config?.type === "climate" ? e.config.options?.switches ?? [] : []).filter((t) => e.hass.states[t.entity]), f = (n) => {
		let r = t.attributes.min_temp ?? 7, a = t.attributes.max_temp ?? 35, s = Math.min(a, Math.max(r, i + n * o));
		e.call(Ht(e.entityId, Number(s.toFixed(1))), "set temperature for");
	}, p = (e) => e.map((e) => ({
		value: e,
		label: z(e)
	}));
	return b`
    ${n.targetTemp ? b`<div class="d-section climate-hero">
          <hd-icon-button
            icon="mdi:minus"
            label="Lower"
            variant="soft"
            .disabled=${r}
            @click=${() => f(-1)}
          ></hd-icon-button>
          <div class="climate-target">
            <span class="big">${r ? "—" : `${R(i)}°`}</span>
            ${a == null ? S : b`<span class="sub">Now ${R(a)}°</span>`}
          </div>
          <hd-icon-button
            icon="mdi:plus"
            label="Raise"
            variant="soft"
            .disabled=${r}
            @click=${() => f(1)}
          ></hd-icon-button>
        </div>` : S}

    ${s.length > 1 ? b`<div class="d-section">
          <span class="d-label">Mode</span>
          <hd-segmented
            .options=${p(s)}
            .value=${t.state}
            label="Mode"
            @hd-select=${(t) => e.call(Ut(e.entityId, t.detail.value), "set mode for")}
          ></hd-segmented>
        </div>` : S}
    ${n.fanMode && c.length ? b`<div class="d-section">
          <span class="d-label">Fan</span>
          <hd-segmented
            .options=${p(c)}
            .value=${t.attributes.fan_mode ?? ""}
            label="Fan mode"
            @hd-select=${(t) => e.call(Wt(e.entityId, t.detail.value), "set fan for")}
          ></hd-segmented>
        </div>` : S}
    ${n.swingMode && l.length ? b`<div class="d-section">
          <span class="d-label">Swing</span>
          <hd-segmented
            .options=${p(l)}
            .value=${t.attributes.swing_mode ?? ""}
            label="Swing mode"
            @hd-select=${(t) => e.call(Kt(e.entityId, t.detail.value), "set swing for")}
          ></hd-segmented>
        </div>` : S}
    ${n.presetMode && u.length ? b`<div class="d-section">
          <span class="d-label">Preset</span>
          <hd-segmented
            .options=${p(u)}
            .value=${t.attributes.preset_mode ?? ""}
            label="Preset"
            @hd-select=${(t) => e.call(Gt(e.entityId, t.detail.value), "set preset for")}
          ></hd-segmented>
        </div>` : S}

    ${d.map((t) => {
		let n = e.hass.states[t.entity].state === "on";
		return b`<div class="d-section d-row-between">
        <span class="d-label">${t.name}</span>
        <hd-toggle
          .checked=${n}
          label=${t.name}
          @hd-toggle=${() => e.call(Lt(t.entity), `toggle ${t.name.toLowerCase()}`)}
        ></hd-toggle>
      </div>`;
	})}
  `;
}
T(), B();
function ss(e, t) {
	let n = [
		"device_class",
		"state_class",
		"unit_of_measurement"
	].filter((e) => t.attributes[e] != null);
	return b`<div class="d-grid">
    ${n.map((n) => b`<div class="d-cell">
      <span class="k">${z(n)}</span>
      <span class="v">${bn(e.hass, t, n)}</span>
    </div>`)}
    <div class="d-cell">
      <span class="k">Last updated</span>
      <span class="v">${Sn(t.last_updated)}</span>
    </div>
  </div>`;
}
T(), F(), L(), B(), An(), tr();
function cs(e, t) {
	let n = Et(t), r = t.attributes.current_position ?? (t.state === "open" ? 100 : 0);
	return b`
    ${n.setPosition ? b`<div class="d-section">
          <span class="d-label">Position</span>
          <hd-slider
            .value=${r}
            .valueText=${`${Math.round(r)}% open`}
            label="Position"
            @hd-change=${(t) => e.call(Xt(e.entityId, t.detail.value), "move")}
          ></hd-slider>
        </div>` : S}
    <div class="d-section big-buttons">
      ${n.open ? b`<button
            class="bigbtn"
            @click=${() => e.call(qt(e.entityId), "open")}
          ><hd-icon icon="mdi:arrow-up" .size=${20}></hd-icon>Open</button>` : S}
      ${n.stop ? b`<button
            class="bigbtn"
            @click=${() => e.call(Yt(e.entityId), "stop")}
          ><hd-icon icon="mdi:stop" .size=${20}></hd-icon>Stop</button>` : S}
      ${n.close ? b`<button
            class="bigbtn"
            @click=${() => e.call(Jt(e.entityId), "close")}
          ><hd-icon icon="mdi:arrow-down" .size=${20}></hd-icon>Close</button>` : S}
    </div>
  `;
}
function ls(e, t) {
	let n = t.state === "locked";
	return b`
    <div class="d-section big-buttons">
      <button
        class="bigbtn ${n ? "active" : ""}"
        @click=${() => e.call(un(e.entityId), "lock")}
      >
        <hd-icon icon="mdi:lock" .size=${20}></hd-icon>Lock
      </button>
      <button class="bigbtn ${n ? "" : "active"}" @click=${async () => {
		await $n(e.host, {
			title: `Unlock ${t.attributes.friendly_name ?? "lock"}?`,
			confirmLabel: "Unlock",
			destructive: !0,
			icon: "mdi:lock-open-variant"
		}) && e.call(dn(e.entityId), "unlock");
	}}>
        <hd-icon icon="mdi:lock-open-variant" .size=${20}></hd-icon>Unlock
      </button>
    </div>
    <div class="d-meta">Last changed ${Sn(t.last_changed)}</div>
  `;
}
function us(e, t) {
	let n = kt(t), r = (t.attributes.fan_speed_list ?? []).filter((e) => !["off", "custom"].includes(e)), i = On(e.hass, e.entityId), a = i.battery ?? t.attributes.battery_level, o = t.state === "cleaning", s = [];
	return typeof i.progress == "number" && o && s.push(["Progress", `${Math.round(i.progress)}%`]), typeof i.area == "number" && i.area > 0 && s.push(["Area", `${R(i.area)} m²`]), typeof i.cleaningTime == "number" && i.cleaningTime > 0 && s.push(["Time", `${Math.round(i.cleaningTime)} min`]), b`
    <div class="d-section big-buttons">
      <button
        class="bigbtn"
        @click=${() => e.call(an(e.entityId), "start")}
      ><hd-icon icon="mdi:play" .size=${20}></hd-icon>Start</button>
      ${n.pause ? b`<button
            class="bigbtn"
            @click=${() => e.call(on(e.entityId), "pause")}
          ><hd-icon icon="mdi:pause" .size=${20}></hd-icon>Pause</button>` : S}
      ${n.returnHome ? b`<button
            class="bigbtn"
            @click=${() => e.call(sn(e.entityId), "dock")}
          ><hd-icon icon="mdi:home-import-outline" .size=${20}></hd-icon>Dock</button>` : S}
      ${n.locate ? b`<button
            class="bigbtn"
            @click=${() => e.call(ln(e.entityId), "locate")}
          ><hd-icon icon="mdi:map-marker-radius" .size=${20}></hd-icon>Locate</button>` : S}
    </div>
    ${r.length ? b`<div class="d-section">
          <span class="d-label">Suction</span>
          <hd-segmented
            .options=${r.map((e) => ({
		value: e,
		label: z(e)
	}))}
            .value=${t.attributes.fan_speed ?? ""}
            @hd-select=${(t) => e.call(cn(e.entityId, t.detail.value), "set suction for")}
          ></hd-segmented>
        </div>` : S}
    ${s.length ? b`<div class="d-section">
          <span class="d-label">${o ? i.room ? `Cleaning ${i.room}` : "Current clean" : "Last clean"}</span>
          <div class="d-grid">
            ${s.map(([e, t]) => b`<div class="d-cell">
              <span class="k">${e}</span><span class="v">${t}</span>
            </div>`)}
          </div>
        </div>` : S}
    ${i.consumables.length ? b`<div class="d-section">
          <span class="d-label">Consumables</span>
          <div class="d-grid">
            ${i.consumables.map((e) => {
		let t = e.hoursLeft <= 20;
		return b`<div class="d-cell">
                <span class="k">${e.label}</span>
                <span class="v" style=${t ? "color:var(--state-warn)" : ""}>
                  ${Math.round(e.hoursLeft)} h${t ? " · replace" : ""}
                </span>
              </div>`;
	})}
          </div>
        </div>` : S}
    ${a == null ? S : b`<div class="d-meta">Battery ${Math.round(a)}%${i.status ? ` · ${z(i.status.replace(/_/g, " "))}` : ""}</div>`}
  `;
}
function ds(e, t) {
	let n = e.entityId.split(".")[0], r = [
		"switch",
		"input_boolean",
		"fan",
		"light",
		"humidifier",
		"siren"
	].includes(n);
	return b`
    <div class="d-value big">${yn(e.hass, t)}</div>
    ${r ? b`<div class="d-section big-buttons">
          <button
            class="bigbtn"
            @click=${() => e.call(Rt(e.entityId), "turn on")}
          >Turn on</button>
          <button
            class="bigbtn"
            @click=${() => e.call(zt(e.entityId), "turn off")}
          >Turn off</button>
        </div>` : S}
    ${ss(e, t)}
  `;
}
T(), L(), B();
function fs(e) {
	let t = e.config?.type === "energy" ? e.config.options ?? {} : {}, n = (t) => t ? e.hass.states[t] ?? null : null, r = Object.entries(t).map(([e, t]) => ({
		key: e,
		state: n(t)
	})).filter((e) => e.state);
	return b`
    <div class="d-section">
      <span class="d-label">Live values</span>
      <div class="d-grid">
        ${r.map((t) => b`<div class="d-cell">
          <span class="k">${z(t.key)}</span>
          <span class="v">${yn(e.hass, t.state)}</span>
        </div>`)}
      </div>
    </div>
    ${e.trend.length > 1 ? b`<div class="d-section">
          <span class="d-label">Grid power — last 24 hours</span>
          <div class="detail-trend">
            <hd-trend .points=${e.trend} .summary=${"24 hour grid power"}></hd-trend>
          </div>
        </div>` : S}
  `;
}
function ps(e) {
	let t = e.config?.type === "powerflow" ? e.config.options ?? {} : {}, n = lo(e.hass, t), r = (t, n) => {
		let r = n ? e.hass.states[n] : void 0;
		return r ? b`<div class="d-cell">
          <span class="k">${t}</span>
          <span class="v">${yn(e.hass, r)}</span>
        </div>` : S;
	};
	return b`
    <div class="detail-flow"><hd-flow-diagram .model=${n}></hd-flow-diagram></div>
    <div class="d-section">
      <span class="d-label">Live values</span>
      <div class="d-grid">
        ${r("Grid", t.gridPower)}
        ${r("Solar", t.solarPower)}
        ${r("House", t.houseConsumption)}
        ${r("Car charger", t.carPower)}
      </div>
    </div>
    ${e.trend.length > 1 ? b`<div class="d-section">
          <span class="d-label">Grid power — last 24 hours</span>
          <div class="detail-trend">
            <hd-trend .points=${e.trend} .summary=${"24 hour grid power"}></hd-trend>
          </div>
        </div>` : S}
  `;
}
function ms(e) {
	let t = e.config?.type === "solarcharging" ? e.config.options ?? {} : {}, n = To(e.hass, t), r = n.tone === "eco" ? "var(--state-eco)" : n.tone === "accent" ? "var(--accent)" : "var(--text-secondary)", i = (e, t) => t == null ? S : b`<div class="d-cell"><span class="k">${e}</span><span class="v">${t}</span></div>`, a = (t, n, r, i) => {
		let a = t ? e.hass.states[t] : void 0;
		if (!t || !a) return S;
		let o = Number(a.state), s = a.attributes.min ?? i.min, c = a.attributes.max ?? i.max, l = a.attributes.step ?? i.step;
		return b`<div class="d-section">
      <span class="d-label">${n}</span>
      <hd-slider
        .value=${Number.isFinite(o) ? o : s}
        .min=${s}
        .max=${c}
        .step=${l}
        .valueText=${Number.isFinite(o) ? r(o) : "—"}
        label=${n}
        @hd-change=${(r) => e.call(hn(t, r.detail.value), `set ${n.toLowerCase()}`)}
      ></hd-slider>
    </div>`;
	};
	return b`
    <div class="d-section d-row-between">
      <span class="d-label">Solar charging</span>
      <hd-toggle
        .checked=${n.armed}
        label="Toggle solar charging"
        @hd-toggle=${() => t.master ? e.call(Lt(t.master), "toggle solar charging") : void 0}
      ></hd-toggle>
    </div>

    <div class="d-section">
      <span class="d-label">Status</span>
      <div class="d-value big" style=${`color:${r}`}>${n.label}</div>
      <div class="d-grid">
        ${i("Battery", n.batteryPct == null ? null : `${Math.round(n.batteryPct)}%`)}
        ${i("Target", n.limitPct == null ? null : `${Math.round(n.limitPct)}%`)}
        ${i("Power", n.powerKw == null ? null : `${R(n.powerKw)} kW`)}
        ${i("Current", n.currentA == null ? null : `${Math.round(n.currentA)} A`)}
        ${i("Rate", n.rateKmh == null ? null : `${Math.round(n.rateKmh)} km/h`)}
        ${i("Session", n.sessionKwh == null ? null : `${R(n.sessionKwh)} kWh`)}
      </div>
    </div>

    ${a(t.startThreshold, "Start above export", (e) => `${Math.abs(Math.round(e))} W export`, {
		min: -5e3,
		max: -500,
		step: 50
	})}
    ${a(t.stopThreshold, "Stop above import", (e) => `${Math.round(e)} W import`, {
		min: 0,
		max: 2e3,
		step: 50
	})}
    ${a(t.minCurrent, "Min charge current", (e) => `${Math.round(e)} A`, {
		min: 5,
		max: 10,
		step: 1
	})}
    ${a(t.deadband, "Current deadband", (e) => `${Math.round(e)} A`, {
		min: 1,
		max: 5,
		step: 1
	})}
  `;
}
T(), F(), L(), B();
var hs = [
	["Warm white", [
		255,
		197,
		143
	]],
	["Sun", [
		255,
		233,
		170
	]],
	["Red", [
		255,
		74,
		74
	]],
	["Orange", [
		255,
		145,
		48
	]],
	["Green", [
		86,
		200,
		90
	]],
	["Teal", [
		40,
		200,
		180
	]],
	["Blue", [
		70,
		130,
		255
	]],
	["Indigo", [
		120,
		90,
		240
	]],
	["Pink", [
		255,
		92,
		170
	]]
];
function gs(e) {
	let [t, n, r] = e.map((e) => e / 255), i = Math.max(t, n, r), a = i - Math.min(t, n, r), o = 0;
	a !== 0 && (o = i === t ? (n - r) / a % 6 : i === n ? (r - t) / a + 2 : (t - n) / a + 4, o *= 60, o < 0 && (o += 360));
	let s = i === 0 ? 0 : a / i * 100;
	return [Math.round(o), Math.round(s)];
}
function _s(e, t) {
	let n = Tt(t), r = t.state === "on", i = r ? Math.round((t.attributes.brightness ?? 255) / 2.55) : 0, a = t.attributes.min_color_temp_kelvin ?? 2200, o = t.attributes.max_color_temp_kelvin ?? 6500, s = t.attributes.color_temp_kelvin ?? Math.round((a + o) / 2), c = t.attributes.effect_list?.filter((e) => e && e !== "None") ?? [], l = t.attributes.hs_color, u = t.attributes.rgb_color, [d, f] = l ? [l[0], l[1]] : u ? gs(u) : [0, 0];
	return b`
    <div class="d-section d-row-between">
      <span class="d-label">Power</span>
      <hd-toggle
        .checked=${r}
        label="Toggle light"
        @hd-toggle=${() => e.call(Lt(e.entityId), "toggle")}
      ></hd-toggle>
    </div>

    ${n.brightness ? b`<div class="d-section">
          <span class="d-label">Brightness</span>
          <hd-slider
            .value=${i}
            .min=${1}
            .max=${100}
            .disabled=${!r}
            .valueText=${r ? `${i}%` : "Off"}
            .color=${"var(--state-light)"}
            icon="mdi:brightness-6"
            label="Brightness"
            @hd-change=${(t) => e.call(Vt(e.entityId, t.detail.value), "dim")}
          ></hd-slider>
        </div>` : S}

    ${n.colorTemp ? b`<div class="d-section">
          <span class="d-label">Color temperature</span>
          <hd-slider
            .value=${s}
            .min=${a}
            .max=${o}
            .step=${50}
            .disabled=${!r}
            .color=${"linear-gradient(90deg,#ffb85c,#fff5e8,#cfe0ff)"}
            label="Color temperature"
            @hd-change=${(t) => e.call(Bt(e.entityId, { colorTempKelvin: t.detail.value }), "set color of")}
          ></hd-slider>
        </div>` : S}

    ${n.color ? b`<div class="d-section">
          <span class="d-label">Color</span>
          <div class="color-wheel-wrap">
            <hd-color-wheel
              .hue=${d}
              .sat=${f}
              .disabled=${!r}
              @hd-color=${(t) => e.call(Bt(e.entityId, { hsColor: [t.detail.hue, t.detail.sat] }), "set color of")}
            ></hd-color-wheel>
          </div>
          <div class="swatches">
            ${hs.map(([t, n]) => b`<button
                class="swatch"
                style=${`background:rgb(${n[0]},${n[1]},${n[2]})`}
                aria-label=${t}
                ?disabled=${!r}
                @click=${() => e.call(Bt(e.entityId, { rgbColor: n }), "set color of")}
              ></button>`)}
          </div>
        </div>` : S}

    ${n.effects && c.length ? b`<div class="d-section">
          <span class="d-label">Effect</span>
          <div class="chips">
            ${c.slice(0, 12).map((n) => b`<button
                class="chip ${t.attributes.effect === n ? "active" : ""}"
                ?disabled=${!r}
                @click=${() => e.call(Bt(e.entityId, { effect: n }), "set effect of")}
              >
                ${z(n)}
              </button>`)}
          </div>
        </div>` : S}
  `;
}
T(), F(), Zr(), $r(), L(), B();
function vs(e, t) {
	let n = Ot(t), r = t.attributes.entity_picture, i = t.attributes.media_title, a = t.attributes.app_name, o = t.attributes.volume_level ?? 0, s = t.attributes.is_volume_muted ?? !1, c = t.attributes.source_list ?? [], l = t.attributes.sound_mode_list ?? [], u = t.state === "off", d = n.selectSource && Kr(c), { featured: f, rest: p } = d ? Jr(c) : {
		featured: [],
		rest: c
	}, m = async (t) => {
		u && await e.call(Rt(e.entityId), "turn on"), await e.call(nn(e.entityId, t), d ? "launch" : "change source of");
	}, h = !u && t.state !== "idle" && t.state !== "standby", ee = a ? Gr(a) : void 0, g = Qr(t);
	return b`
    ${r ? b`<div class="media-art" style=${`background-image:url("${r}")`}></div>` : h && (ee || a) ? b`<div class="media-art media-art-fallback">
            <hd-icon icon=${ee ?? "mdi:television-classic"} .size=${56}></hd-icon>
            ${a ? b`<span>${a}</span>` : S}
          </div>` : S}
    <div class="media-meta">
      <div class="d-value">${i ?? a ?? yn(e.hass, t)}</div>
      ${a && i ? b`<div class="d-sub">${a}</div>` : S}
    </div>
    ${g ? b`<div class="d-section media-progress">
          <div class="media-progress-bar"><span style=${`width:${g.pct}%`}></span></div>
          <div class="media-progress-time">
            <span>${g.elapsed}</span><span>${g.total}</span>
          </div>
        </div>` : S}
    <div class="d-section media-transport">
      ${n.power ? b`<hd-icon-button
            icon="mdi:power"
            label=${u ? "Turn on" : "Turn off"}
            variant=${u ? "soft" : "filled"}
            @click=${() => e.call(Lt(e.entityId), u ? "turn on" : "turn off")}
          ></hd-icon-button>` : S}
      ${n.previous ? b`<hd-icon-button
            icon="mdi:skip-previous"
            label="Previous"
            variant="soft"
            .disabled=${u}
            @click=${() => e.call($t(e.entityId), "skip")}
          ></hd-icon-button>` : S}
      <hd-icon-button
        icon=${t.state === "playing" ? "mdi:pause" : "mdi:play"}
        label="Play or pause"
        variant="filled"
        .disabled=${u}
        @click=${() => e.call(Zt(e.entityId), "control")}
      ></hd-icon-button>
      ${n.next ? b`<hd-icon-button
            icon="mdi:skip-next"
            label="Next"
            variant="soft"
            .disabled=${u}
            @click=${() => e.call(Qt(e.entityId), "skip")}
          ></hd-icon-button>` : S}
    </div>
    ${n.volumeSet ? b`<div class="d-section">
          <span class="d-label">Volume</span>
          <div class="vol-row">
            ${n.mute ? b`<hd-icon-button
                  icon=${s ? "mdi:volume-off" : "mdi:volume-high"}
                  label="Mute"
                  variant="soft"
                  @click=${() => e.call(tn(e.entityId, !s), "mute")}
                ></hd-icon-button>` : S}
            <hd-slider
              style="flex:1"
              .value=${Math.round(o * 100)}
              .valueText=${`${Math.round(o * 100)}%`}
              label="Volume"
              @hd-change=${(t) => e.call(en(e.entityId, t.detail.value / 100), "set volume of")}
            ></hd-slider>
          </div>
        </div>` : S}
    ${n.selectSoundMode && l.length ? b`<div class="d-section">
          <span class="d-label">Sound mode</span>
          <div class="chips">
            ${l.map((n) => b`<button
                class="chip ${t.attributes.sound_mode === n ? "active" : ""}"
                @click=${() => e.call(rn(e.entityId, n), "set sound mode of")}
              >${n}</button>`)}
          </div>
        </div>` : S}
    ${f.length ? b`<div class="d-section">
          <span class="d-label">Apps</span>
          <div class="media-apps big-buttons">
            ${f.map((e) => b`<button
                class="bigbtn app ${t.attributes.source === e.source ? "active" : ""}"
                @click=${() => m(e.source)}
              >
                <hd-icon icon=${e.icon} .size=${26}></hd-icon><span>${e.label}</span>
              </button>`)}
          </div>
        </div>` : S}
    ${n.selectSource && p.length ? b`<div class="d-section">
          <span class="d-label">${d ? f.length ? "More apps" : "Apps" : "Source"}</span>
          <div class="chips">
            ${p.slice(0, 24).map((e) => {
		let n = t.attributes.source === e, r = d ? Gr(e) ?? "mdi:apps" : void 0;
		return b`<button
                class="chip ${r ? "with-icon" : ""} ${n ? "active" : ""}"
                @click=${() => m(e)}
              >
                ${r ? b`<hd-icon icon=${r} .size=${18}></hd-icon>` : S}
                <span>${e}</span>
              </button>`;
	})}
          </div>
        </div>` : S}
  `;
}
T(), B();
function ys(e, t) {
	let n = Number.isFinite(Number(t.state)), r = e.trend, i = r.length > 1 ? `Min ${R(Math.min(...r))}, max ${R(Math.max(...r))}, latest ${R(r[r.length - 1])}` : "";
	return b`
    <div class="d-value big">${yn(e.hass, t)}</div>
    ${n && r.length > 1 ? b`<div class="d-section">
          <span class="d-label">Last 24 hours</span>
          <div class="detail-trend">
            <hd-trend .points=${r} .summary=${i}></hd-trend>
          </div>
          <div class="d-meta">${i}</div>
        </div>` : S}
    ${ss(e, t)}
  `;
}
function bs(e, t) {
	let n = t.attributes, r = [];
	return n.temperature != null && r.push(["Temperature", `${R(n.temperature)}°`]), n.humidity != null && r.push(["Humidity", `${Math.round(n.humidity)}%`]), n.wind_speed != null && r.push(["Wind", `${R(n.wind_speed)} ${n.wind_speed_unit ?? ""}`]), n.pressure != null && r.push(["Pressure", `${R(n.pressure)} ${n.pressure_unit ?? ""}`]), b`
    <div class="d-value big">${z(t.state)}</div>
    <div class="d-grid">
      ${r.map(([e, t]) => b`<div class="d-cell">
        <span class="k">${e}</span><span class="v">${t}</span>
      </div>`)}
    </div>
    ${e.forecast.length ? b`<div class="d-section">
          <span class="d-label">Forecast</span>
          ${e.forecast.map((e) => {
		let t = new Date(e.datetime), n = Number.isNaN(t.getTime()) ? "" : t.toLocaleDateString(void 0, { weekday: "long" });
		return b`<div class="fc-row">
              <span class="fc-day">${n}</span>
              <hd-icon
                .icon=${xs(e.condition ?? "")}
                .size=${20}
              ></hd-icon>
              <span class="fc-temp">${e.temperature == null ? "" : `${Math.round(e.temperature)}°`}${e.templow == null ? "" : ` / ${Math.round(e.templow)}°`}</span>
            </div>`;
	})}
        </div>` : S}
  `;
}
function xs(e) {
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
	}[e] ?? "mdi:weather-cloudy";
}
//#endregion
//#region src/details/controllers.ts
T();
function Ss(e) {
	let t = e.hass.states[e.entityId], n = e.config?.type;
	if (n === "energy") return fs(e);
	if (n === "powerflow") return ps(e);
	if (n === "solarcharging") return ms(e);
	if (!t) return b`<div class="d-value big">Entity unavailable</div>
      <div class="d-meta">
        ${e.entityId || "No entity configured"} was not found in Home Assistant.
      </div>`;
	switch (e.entityId.split(".")[0]) {
		case "light": return _s(e, t);
		case "climate": return os(e, t);
		case "media_player": return vs(e, t);
		case "cover": return cs(e, t);
		case "lock": return ls(e, t);
		case "vacuum": return us(e, t);
		case "sensor": return ys(e, t);
		case "weather": return bs(e, t);
		default: return ds(e, t);
	}
}
function Cs(e, t) {
	return t?.type === "energy" || t?.type === "powerflow" ? t.options?.gridPower ?? null : e.split(".")[0] === "sensor" ? e : null;
}
function ws(e) {
	return e.split(".")[0] === "weather";
}
//#endregion
//#region src/details/detail-registry.ts
var Ts = {
	light: _s,
	climate: os,
	generic: ds,
	cover: cs,
	lock: ls,
	vacuum: us,
	media: vs,
	sensor: ys,
	weather: bs
};
function Es(e, t, n) {
	return Ts[e](t, n);
}
T(), O(), A(), H();
var Ds, Os = (Ds = class extends w {
	constructor(...e) {
		super(...e), this.checked = !1, this.disabled = !1, this.label = "";
	}
	_toggle() {
		this.disabled || (this.checked = !this.checked, this.dispatchEvent(new CustomEvent("hd-toggle", {
			detail: { checked: this.checked },
			bubbles: !0,
			composed: !0
		})));
	}
	render() {
		return b`
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
}, Ds.styles = l`
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
  `, Ds);
V([E({
	type: Boolean,
	reflect: !0
})], Os.prototype, "checked", void 0), V([E({
	type: Boolean,
	reflect: !0
})], Os.prototype, "disabled", void 0), V([E({ type: String })], Os.prototype, "label", void 0), Os = V([k("hd-toggle")], Os);
//#endregion
//#region src/primitives/color-wheel.ts
var ks = /* @__PURE__ */ n({ HdColorWheel: () => js }), As, js, Ms = t((() => {
	T(), O(), A(), H(), js = (As = class extends w {
		constructor(...e) {
			super(...e), this.hue = 0, this.sat = 100, this.disabled = !1, this._onDown = (e) => {
				if (this.disabled) return;
				e.preventDefault(), this._track(e);
				let t = (e) => this._track(e), n = () => {
					window.removeEventListener("pointermove", t), window.removeEventListener("pointerup", n), this._emit("hd-color");
				};
				window.addEventListener("pointermove", t), window.addEventListener("pointerup", n);
			};
		}
		_track(e) {
			let t = this.renderRoot.querySelector(".wheel");
			if (!t) return;
			let n = t.getBoundingClientRect(), r = e.clientX - (n.left + n.width / 2), i = e.clientY - (n.top + n.height / 2), a = Math.min(1, Math.hypot(r, i) / (n.width / 2)), o = Math.atan2(i, r) * 180 / Math.PI;
			o < 0 && (o += 360), this.hue = Math.round(o), this.sat = Math.round(a * 100), this._emit("hd-color-input");
		}
		_emit(e) {
			this.dispatchEvent(new CustomEvent(e, {
				detail: {
					hue: this.hue,
					sat: this.sat
				},
				bubbles: !0,
				composed: !0
			}));
		}
		render() {
			let e = this.hue * Math.PI / 180, t = this.sat / 100, n = 50 + Math.cos(e) * t * 50, r = 50 + Math.sin(e) * t * 50, i = `hsl(${this.hue}, ${this.sat}%, 50%)`;
			return b`<div
      class="wheel"
      role="slider"
      aria-label="Colour"
      aria-valuetext=${`hue ${this.hue}°, saturation ${this.sat}%`}
      @pointerdown=${this._onDown}
    >
      <div class="handle" style=${`left:${n}%;top:${r}%;background:${i}`}></div>
    </div>`;
		}
	}, As.styles = l`
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
  `, As), V([E({ type: Number })], js.prototype, "hue", void 0), V([E({ type: Number })], js.prototype, "sat", void 0), V([E({
		type: Boolean,
		reflect: !0
	})], js.prototype, "disabled", void 0), js = V([k("hd-color-wheel")], js);
}));
T(), O(), A(), L(), Qn(), gi(), tr(), $i(), cr(), _r(), mr(), U(), Ti(), H();
var Ns, Ps = (Ns = class extends w {
	constructor(...e) {
		super(...e), this.open = !1, this.entityId = "", this._trend = [], this._forecast = [], this._loadedKey = "", this._call = async (e, t = "update") => {
			if (this.hass) try {
				await It(this.hass, e);
			} catch {
				er(this, {
					message: `Couldn't ${t} ${this._name}`,
					tone: "alert",
					icon: "mdi:alert-circle-outline"
				});
			}
		};
	}
	updated(e) {
		(e.has("open") || e.has("entityId")) && (this.open ? this._maybeLoad() : this._loadedKey &&= (this._trend.length && (this._trend = []), this._forecast.length && (this._forecast = []), ""));
	}
	async _maybeLoad() {
		if (!this.hass) return;
		let e = `${this.entityId}:${this.config?.type ?? ""}:${this.config?.id ?? ""}`;
		if (this._loadedKey === e) return;
		this._loadedKey = e, this._trend.length && (this._trend = []), this._forecast.length && (this._forecast = []), this.entityId.startsWith("light.") && (this.hass.states[this.entityId]?.attributes.supported_color_modes)?.some((e) => [
			"hs",
			"xy",
			"rgb",
			"rgbw",
			"rgbww",
			"rgbwww"
		].includes(e)) && Promise.resolve().then(() => (Ms(), ks));
		let t = Cs(this.entityId, this.config);
		if (t && this.hass.connected) {
			let e = await hi(this.hass, t, 24);
			this._trend = e.map((e) => e.value);
		}
		this.entityId && ws(this.entityId) && this.hass.connected && await this._loadForecast();
	}
	async _loadForecast() {
		if (!this.hass) return;
		let e = this.hass.states[this.entityId]?.attributes.forecast;
		if (e?.length) {
			this._forecast = e.slice(0, 7);
			return;
		}
		try {
			let e = await this.hass.callWS({
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
		this.open = !1, this.dispatchEvent(new CustomEvent("hd-detail-close", {
			bubbles: !0,
			composed: !0
		}));
	}
	render() {
		if (!this.hass || !this.entityId && !this.config) return b`<hd-surface .open=${this.open} @hd-close=${() => this._close()}></hd-surface>`;
		let e = Ln(this.hass, this.entityId, this.config), t = {
			hass: this.hass,
			entityId: this.entityId,
			config: this.config,
			host: this,
			trend: this._trend,
			forecast: this._forecast,
			call: this._call
		}, n = this.config?.type === "energy" ? "Live energy" : this.config?.type === "powerflow" ? "Live power flow" : e.displayState, r = this.config ? zi(this.config.type) : void 0, i = this.hass.states[this.entityId], a = this.open && r?.detailRenderer && i ? Es(r.detailRenderer, t, i) : this.open ? Ss(t) : S;
		return b`
      <hd-surface
        variant="auto"
        .open=${this.open}
        .heading=${this._name}
        .subheading=${n}
        @hd-close=${() => this._close()}
      >
        ${a}
      </hd-surface>
    `;
	}
}, Ns.styles = l`
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
  `, Ns);
V([E({ attribute: !1 })], Ps.prototype, "hass", void 0), V([E({
	type: Boolean,
	reflect: !0
})], Ps.prototype, "open", void 0), V([E({ type: String })], Ps.prototype, "entityId", void 0), V([E({ attribute: !1 })], Ps.prototype, "config", void 0), V([D()], Ps.prototype, "_trend", void 0), V([D()], Ps.prototype, "_forecast", void 0), Ps = V([k("hd-detail")], Ps), T(), O(), A(), U(), H();
var Fs, Is = (Fs = class extends w {
	constructor(...e) {
		super(...e), this._open = !1, this._opts = null, this._resolve = null;
	}
	ask(e) {
		return this._opts = e, this._open = !0, new Promise((e) => {
			this._resolve = e;
		});
	}
	_settle(e) {
		this._resolve?.(e), this._resolve = null, this._open = !1;
	}
	render() {
		let e = this._opts;
		return e ? b`
      <hd-surface
        variant="center"
        headless
        ?open=${this._open}
        @hd-close=${() => this._settle(!1)}
      >
        <div class="content">
          <div class="head">
            <div class="badge ${e.destructive ? "destructive" : ""}">
              <hd-icon .icon=${e.icon ?? (e.destructive ? "mdi:alert" : "mdi:help-circle-outline")} .size=${24}></hd-icon>
            </div>
            <div>
              <h3>${e.title}</h3>
              ${e.message ? b`<p>${e.message}</p>` : S}
            </div>
          </div>
          <div class="actions">
            <button class="cancel" @click=${() => this._settle(!1)}>${e.cancelLabel ?? "Cancel"}</button>
            <button class="ok ${e.destructive ? "destructive" : ""}" @click=${() => this._settle(!0)}>
              ${e.confirmLabel ?? "Confirm"}
            </button>
          </div>
        </div>
      </hd-surface>
    ` : S;
	}
}, Fs.styles = l`
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
  `, Fs);
V([D()], Is.prototype, "_open", void 0), V([D()], Is.prototype, "_opts", void 0), Is = V([k("hd-confirm")], Is), T(), O(), A(), U(), H();
var Ls, Rs = (Ls = class extends w {
	constructor(...e) {
		super(...e), this._toasts = [], this._seq = 0;
	}
	show(e) {
		let t = ++this._seq;
		this._toasts = [...this._toasts, {
			...e,
			id: t
		}];
		let n = e.duration ?? 3200;
		window.setTimeout(() => {
			this._toasts = this._toasts.filter((e) => e.id !== t);
		}, n);
	}
	render() {
		return b`<div aria-live="polite" aria-atomic="false">
      ${this._toasts.map((e) => b`<div class="toast ${e.tone ?? "neutral"}" role="status">
          ${e.icon ? b`<hd-icon .icon=${e.icon} .size=${18}></hd-icon>` : ""}
          <span>${e.message}</span>
        </div>`)}
    </div>`;
	}
}, Ls.styles = l`
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
  `, Ls);
V([D()], Rs.prototype, "_toasts", void 0), Rs = V([k("hd-toasts")], Rs), T(), O(), A(), aa(), Ti(), H();
var zs, Bs = "hd-panel-appearance", $ = (zs = class extends w {
	constructor(...e) {
		super(...e), this.narrow = !1, this._viewId = "", this._appearance = "auto", this._detailOpen = !1, this._detailEntityId = "", this._onPop = () => this._syncViewFromLocation(), this._onMqlChange = () => this._applyTheme(), this._onWindowError = (e) => {
			let t = e.error;
			`${e.message ?? ""} ${typeof t == "string" ? t : t?.message ?? ""}`.includes("ResizeObserver loop") || console.error("[home-dashboard-panel] uncaught error:", t ?? e.message);
		}, this._onRejection = (e) => console.error("[home-dashboard-panel] unhandled rejection:", e.reason);
	}
	connectedCallback() {
		super.connectedCallback(), this._appearance = localStorage.getItem(Bs) || "auto", this._mqlDark = window.matchMedia("(prefers-color-scheme: dark)"), this._mqlDark.addEventListener("change", this._onMqlChange), window.addEventListener("popstate", this._onPop), window.addEventListener("error", this._onWindowError), window.addEventListener("unhandledrejection", this._onRejection), this._syncViewFromLocation(), this._applyTheme(), this._applyKiosk();
	}
	disconnectedCallback() {
		super.disconnectedCallback(), this._mqlDark?.removeEventListener("change", this._onMqlChange), window.removeEventListener("popstate", this._onPop), window.removeEventListener("error", this._onWindowError), window.removeEventListener("unhandledrejection", this._onRejection);
	}
	willUpdate(e) {
		e.has("route") && this._syncViewFromLocation(), e.has("hass") && this._appearance === "auto" && this._applyTheme();
	}
	get _cfg() {
		if (!this._validated) {
			let e = na(mt);
			this._validated = {
				config: e.sanitized,
				issues: e.issues
			};
			let t = e.issues.filter((e) => e.level === "error");
			t.length && console.error("[home-dashboard-panel] Invalid dashboard config:", t);
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
		return this._views.map((e) => ({
			id: e.id,
			label: e.label,
			icon: e.icon,
			type: e.type
		}));
	}
	get _currentView() {
		return this._views.find((e) => e.id === this._viewId) ?? this._views[0];
	}
	_syncViewFromLocation() {
		let e = oa(this.route, this._base) || this._cfg.config.defaultView, t = this._views.some((t) => t.id === e);
		this._viewId = t ? e : this._cfg.config.defaultView;
	}
	_onNavigate(e) {
		e !== this._viewId && (this._viewId = e, ua(la(this._base, e, this._cfg.config.defaultView)), this.updateComplete.then(() => this.renderRoot.querySelector("hd-app-shell")?.scrollToTop()));
	}
	_resolveDark() {
		return this._appearance === "dark" ? !0 : this._appearance === "light" ? !1 : this.hass?.themes?.darkMode == null ? !!this._mqlDark?.matches : !!this.hass.themes.darkMode;
	}
	_applyTheme() {
		this.setAttribute("data-theme", this._resolveDark() ? "dark" : "light");
	}
	_cycleAppearance() {
		this._appearance = this._appearance === "auto" ? "light" : this._appearance === "light" ? "dark" : "auto", localStorage.setItem(Bs, this._appearance), this._applyTheme();
	}
	_applyKiosk() {
		this._cfg.config.kiosk?.enabled && this._cfg.config.kiosk.preventScreenSelection && this.setAttribute("data-kiosk", "");
	}
	_onOpenDetail(e) {
		this._detailEntityId = e.detail.entityId ?? "", this._detailConfig = e.detail.config, this._detailOpen = !0;
	}
	_onConfirm(e) {
		e.stopPropagation(), this._confirm ? this._confirm.ask(e.detail.opts).then(e.detail.resolve) : e.detail.resolve(!1);
	}
	_onToast(e) {
		e.stopPropagation(), this._toasts?.show(e.detail);
	}
	render() {
		if (!this.hass) return b`<div class="loading"><hd-skeleton w="220px" h="26px"></hd-skeleton></div>`;
		let e = this._cfg.issues.filter((e) => e.level === "error"), t = this._currentView;
		return b`
      <hd-app-shell
        .views=${this._navViews}
        .currentViewId=${t?.id ?? ""}
        .productTitle=${this._cfg.config.title ?? "Home"}
        .subtitle=${t?.subtitle ?? ""}
        .connected=${this.hass.connected !== !1}
        .appearance=${this._appearance}
        @hd-navigate=${(e) => this._onNavigate(e.detail.viewId)}
        @hd-toggle-appearance=${() => this._cycleAppearance()}
        @hd-open-detail=${(e) => this._onOpenDetail(e)}
        @hd-confirm=${(e) => this._onConfirm(e)}
        @hd-toast=${(e) => this._onToast(e)}
      >
        ${e.length ? b`<div class="cfg-errors" role="alert">
              <strong>Dashboard configuration has ${e.length} error(s):</strong>
              <ul>
                ${e.slice(0, 8).map((e) => b`<li><code>${e.path}</code> — ${e.message}</li>`)}
              </ul>
            </div>` : S}
        <hd-view-grid .hass=${this.hass} .view=${t}></hd-view-grid>
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
}, zs.styles = [
	ft,
	pt,
	l`
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
], zs);
V([E({ attribute: !1 })], $.prototype, "hass", void 0), V([E({ type: Boolean })], $.prototype, "narrow", void 0), V([E({ attribute: !1 })], $.prototype, "panel", void 0), V([E({ attribute: !1 })], $.prototype, "route", void 0), V([D()], $.prototype, "_viewId", void 0), V([D()], $.prototype, "_appearance", void 0), V([D()], $.prototype, "_detailOpen", void 0), V([D()], $.prototype, "_detailEntityId", void 0), V([D()], $.prototype, "_detailConfig", void 0), V([ot("hd-confirm")], $.prototype, "_confirm", void 0), V([ot("hd-toasts")], $.prototype, "_toasts", void 0), $ = V([k("home-dashboard-panel")], $);
//#endregion
export { $ as HomeDashboardPanel };
