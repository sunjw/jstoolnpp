!function (e, t) {
	for (var r in t)
		e[r] = t[r]
}
(exports, function (e) {
	var t = {};
	function r(n) {
		if (t[n])
			return t[n].exports;
		var o = t[n] = {
			i: n,
			l: !1,
			exports: {}
		};
		return e[n].call(o.exports, o, o.exports, r),
		o.l = !0,
		o.exports
	}
	return r.m = e,
	r.c = t,
	r.d = function (e, t, n) {
		r.o(e, t) || Object.defineProperty(e, t, {
			enumerable: !0,
			get: n
		})
	},
	r.r = function (e) {
		"undefined" != typeof Symbol && Symbol.toStringTag && Object.defineProperty(e, Symbol.toStringTag, {
			value: "Module"
		}),
		Object.defineProperty(e, "__esModule", {
			value: !0
		})
	},
	r.t = function (e, t) {
		if (1 & t && (e = r(e)), 8 & t)
			return e;
		if (4 & t && "object" == typeof e && e && e.__esModule)
			return e;
		var n = Object.create(null);
		if (r.r(n), Object.defineProperty(n, "default", {
				enumerable: !0,
				value: e
			}), 2 & t && "string" != typeof e)
			for (var o in e)
				r.d(n, o, function (t) {
					return e[t]
				}
					.bind(null, o));
		return n
	},
	r.n = function (e) {
		var t = e && e.__esModule ? function () {
			return e.default
		}
		 : function () {
			return e
		};
		return r.d(t, "a", t),
		t
	},
	r.o = function (e, t) {
		return Object.prototype.hasOwnProperty.call(e, t)
	},
	r.p = "",
	r(r.s = 45)
}
	([function (e, t, r) {
				var n = t;
				r(72),
				r(73),
				r(74),
				r(75),
				r(76),
				r(77),
				r(78),
				r(79),
				r(80),
				r(81),
				r(82),
				r(83),
				r(84),
				r(85),
				r(86),
				r(87),
				r(88),
				r(89),
				r(90),
				r(91),
				r(92),
				r(93),
				r(94),
				r(95),
				r(96),
				r(97),
				r(98),
				r(99),
				r(100),
				r(101),
				r(102),
				r(103),
				r(104),
				r(105),
				n.VERSION = "1.4.1",
				n.detect = function (e) {
					var t = new n.UniversalDetector;
					return t.reset(),
					"function" == typeof Buffer && e instanceof Buffer ? t.feed(e.toString("binary")) : t.feed(e),
					t.close(),
					t.result
				},
				n.log = function () {
					console.log.apply(console, arguments)
				}
			}, function (e, t) {
				e.exports = require("path")
			}, function (e, t) {
				e.exports = require("fs")
			}, function (e, t, r) {
				"use strict";
				Object.defineProperty(t, "__esModule", {
					value: !0
				});
				var n = r(36),
				o = r(36);
				t.makePatchingRequire = o.makePatchingRequire;
				var i = function (e) {
					return !0
				},
				s = function () {
					function e() {
						this.version = r(120).version,
						this.subscribers = {},
						this.contextPreservationFunction = function (e) {
							return e
						},
						this.knownPatches = {},
						this.currentlyPublishing = !1
					}
					return e.prototype.shouldPublish = function (e) {
						var t = this.subscribers[e];
						return !!t && t.some(function (e) {
							var t = e.filter;
							return !t || t(!1)
						})
					},
					e.prototype.publish = function (e, t) {
						if (!this.currentlyPublishing) {
							var r = this.subscribers[e];
							if (r) {
								var n = {
									timestamp: Date.now(),
									data: t
								};
								this.currentlyPublishing = !0,
								r.forEach(function (e) {
									var t = e.listener,
									r = e.filter;
									try {
										r && r(!0) && t(n)
									} catch (e) {}
								}),
								this.currentlyPublishing = !1
							}
						}
					},
					e.prototype.subscribe = function (e, t, r) {
						void 0 === r && (r = i),
						this.subscribers[e] || (this.subscribers[e] = []),
						this.subscribers[e].push({
							listener: t,
							filter: r
						})
					},
					e.prototype.unsubscribe = function (e, t, r) {
						void 0 === r && (r = i);
						var n = this.subscribers[e];
						if (n)
							for (var o = 0; o < n.length; ++o)
								if (n[o].listener === t && n[o].filter === r)
									return n.splice(o, 1), !0;
						return !1
					},
					e.prototype.reset = function () {
						var e = this;
						this.subscribers = {},
						this.contextPreservationFunction = function (e) {
							return e
						},
						Object.getOwnPropertyNames(this.knownPatches).forEach(function (t) {
							return delete e.knownPatches[t]
						})
					},
					e.prototype.bindToContext = function (e) {
						return this.contextPreservationFunction(e)
					},
					e.prototype.addContextPreservation = function (e) {
						var t = this.contextPreservationFunction;
						this.contextPreservationFunction = function (r) {
							return e(t(r))
						}
					},
					e.prototype.registerMonkeyPatch = function (e, t) {
						this.knownPatches[e] || (this.knownPatches[e] = []),
						this.knownPatches[e].push(t)
					},
					e.prototype.getPatchesObject = function () {
						return this.knownPatches
					},
					e
				}
				();
				global.diagnosticsSource || (global.diagnosticsSource = new s, r(37).prototype.require = n.makePatchingRequire(global.diagnosticsSource.getPatchesObject()));
				t.channel = global.diagnosticsSource
			}, function (e, t) {
				e.exports = require("vscode")
			}, function (e, t, r) {
				"use strict";
				Object.defineProperty(t, "__esModule", {
					value: !0
				});
				const n = r(1),
				o = r(2),
				i = r(32);
				function s(e) {
					return e.forEach(e => e.dispose()),
					[]
				}
				function a(e) {
					return {
						dispose: e
					}
				}
				function c(e) {
					return a(() => s(e))
				}
				function u(e, t) {
					return (r, n = null, o) => e(e => t(e) && r.call(n, e), null, o)
				}
				function l(e) {
					return (t, r = null, n) => {
						const o = e(e => (o.dispose(), t.call(r, e)), null, n);
						return o
					}
				}
				function h(e, ...t) {
					return new Promise((r, n) => e(...t, (e, t) => e ? n(e) : r(t)))
				}
				function p(e) {
					return /^[a-zA-Z]:\\/.test(e)
				}
				t.log = function (...e) {
					console.log.apply(console, ["git:", ...e])
				},
				t.dispose = s,
				t.toDisposable = a,
				t.combinedDisposable = c,
				t.EmptyDisposable = a(() => null),
				t.fireEvent = function (e) {
					return (t, r = null, n) => e(e => t.call(r), null, n)
				},
				t.mapEvent = function (e, t) {
					return (r, n = null, o) => e(e => r.call(n, t(e)), null, o)
				},
				t.filterEvent = u,
				t.latchEvent = function (e) {
					let t,
					r = !0;
					return u(e, e => {
						let n = r || e !== t;
						return r = !1,
						t = e,
						n
					})
				},
				t.anyEvent = function (...e) {
					return (t, r = null, n) => {
						const o = c(e.map(e => e(e => t.call(r, e))));
						return n && n.push(o),
						o
					}
				},
				t.done = function (e) {
					return e.then(() => void 0)
				},
				t.onceEvent = l,
				t.debounceEvent = function (e, t) {
					return (r, n = null, o) => {
						let i;
						return e(e => {
							clearTimeout(i),
							i = setTimeout(() => r.call(n, e), t)
						}, null, o)
					}
				},
				t.eventToPromise = function (e) {
					return new Promise(t => l(e)(t))
				},
				t.once = function (e) {
					return (...t) => e(...t)
				},
				t.assign = function (e, ...t) {
					for (const r of t)
						Object.keys(r).forEach(t => e[t] = r[t]);
					return e
				},
				t.uniqBy = function (e, t) {
					const r = Object.create(null);
					return e.filter(e => {
						const n = t(e);
						return !r[n] && (r[n] = !0, !0)
					})
				},
				t.groupBy = function (e, t) {
					return e.reduce((e, r) => {
						const n = t(r);
						return e[n] = [...e[n] || [], r],
						e
					}, Object.create(null))
				},
				t.denodeify = function (e) {
					return (...t) => new Promise((r, n) => e(...t, (e, t) => e ? n(e) : r(t)))
				},
				t.nfcall = h,
				t.mkdirp = async function e(t, r) {
					const i = async() => {
						try {
							await h(o.mkdir, t, r)
						} catch (e) {
							if ("EEXIST" === e.code) {
								if ((await h(o.stat, t)).isDirectory())
									return;
								throw new Error(`'${t}' exists and is not a directory.`)
							}
							throw e
						}
					};
					if (t === n.dirname(t))
						return !0;
					try {
						await i()
					} catch (o) {
						if ("ENOENT" !== o.code)
							throw o;
						await e(n.dirname(t), r),
						await i()
					}
					return !0
				},
				t.uniqueFilter = function (e) {
					const t = Object.create(null);
					return r => {
						const n = e(r);
						return !t[n] && (t[n] = !0, !0)
					}
				},
				t.firstIndex = function (e, t) {
					for (let r = 0; r < e.length; r++)
						if (t(e[r]))
							return r;
					return -1
				},
				t.find = function (e, t) {
					let r = void 0;
					return e.some(e => !!t(e) && (r = e, !0)),
					r
				},
				t.grep = async function (e, t) {
					return new Promise((r, n) => {
						const s = o.createReadStream(e, {
								encoding: "utf8"
							}),
						a = i(s);
						a.on("data", e => {
							t.test(e) && (s.close(), r(!0))
						}),
						a.on("error", n),
						a.on("end", () => r(!1))
					})
				},
				t.readBytes = function (e, t) {
					return new Promise((r, n) => {
						let o = !1,
						i = Buffer.allocUnsafe(t),
						s = 0;
						e.on("data", r => {
							let n = Math.min(t - s, r.length);
							r.copy(i, s, 0, n),
							(s += n) === t && e.destroy()
						}),
						e.on("error", e => {
							o || (o = !0, n(e))
						}),
						e.on("close", () => {
							o || (o = !0, r(i.slice(0, s)))
						})
					})
				},
				t.detectUnicodeEncoding = function (e) {
					if (e.length < 2)
						return null;
					const t = e.readUInt8(0),
					r = e.readUInt8(1);
					if (254 === t && 255 === r)
						return "utf16be";
					if (255 === t && 254 === r)
						return "utf16le";
					if (e.length < 3)
						return null;
					const n = e.readUInt8(2);
					return 239 === t && 187 === r && 191 === n ? "utf8" : null
				},
				t.isDescendant = function (e, t) {
					return e === t || (e.charAt(e.length - 1) !== n.sep && (e += n.sep), p(e) && (e = e.toLowerCase(), t = t.toLowerCase()), t.startsWith(e))
				},
				t.pathEquals = function (e, t) {
					return p(e) && (e = e.toLowerCase(), t = t.toLowerCase()),
					e === t
				},
				t.splitInChunks = function  * (e, t) {
					let r = [],
					n = 0;
					for (const o of e) {
						let e = n + o.length;
						e > t && r.length > 0 && (yield r, r = [], e = o.length),
						r.push(o),
						n = e
					}
					r.length > 0 && (yield r)
				};
				t.Limiter = class {
					constructor(e) {
						this.maxDegreeOfParalellism = e,
						this.outstandingPromises = [],
						this.runningPromises = 0
					}
					queue(e) {
						return new Promise((t, r) => {
							this.outstandingPromises.push({
								factory: e,
								c: t,
								e: r
							}),
							this.consume()
						})
					}
					consume() {
						for (; this.outstandingPromises.length && this.runningPromises < this.maxDegreeOfParalellism; ) {
							const e = this.outstandingPromises.shift();
							this.runningPromises++;
							const t = e.factory();
							t.then(e.c, e.e),
							t.then(() => this.consumed(), () => this.consumed())
						}
					}
					consumed() {
						this.runningPromises--,
						this.outstandingPromises.length > 0 && this.consume()
					}
				}
			}, function (e, t, r) {
				"use strict";
				var n = function () {
					function e() {}
					return e.info = function (t) {
						for (var r = [], n = 1; n < arguments.length; n++)
							r[n - 1] = arguments[n];
						e.enableDebug && console.info(e.TAG + t, r)
					},
					e.warn = function (t) {
						for (var r = [], n = 1; n < arguments.length; n++)
							r[n - 1] = arguments[n];
						e.disableWarnings || console.warn(e.TAG + t, r)
					},
					e.enableDebug = !1,
					e.disableWarnings = !1,
					e.TAG = "ApplicationInsights:",
					e
				}
				();
				e.exports = n
			}, function (e, t, r) {
				"use strict";
				function n(e) {
					for (var r in e)
						t.hasOwnProperty(r) || (t[r] = e[r])
				}
				Object.defineProperty(t, "__esModule", {
					value: !0
				}),
				n(r(136)),
				n(r(38)),
				n(r(151))
			}, function (e, t, r) {
				"use strict";
				Object.defineProperty(t, "__esModule", {
					value: !0
				});
				var n,
				o,
				i,
				s,
				a,
				c = r(1),
				u = r(2),
				l = Object.prototype.toString;
				function h(e) {
					return void 0 !== e
				}
				function p(e) {
					return "[object String]" === l.call(e)
				}
				function d(e) {
					return JSON.parse(u.readFileSync(e, "utf8"))
				}
				function f(e, t) {
					return a && (e = "［" + e.replace(/[aouei]/g, "$&$&") + "］"),
					0 === t.length ? e : e.replace(/\{(\d+)\}/g, function (e, r) {
						var n = r[0],
						o = t[n],
						i = e;
						return "string" == typeof o ? i = o : "number" != typeof o && "boolean" != typeof o && void 0 !== o && null !== o || (i = String(o)),
						i
					})
				}
				function g(e) {
					return function (t, r) {
						for (var n = [], o = 2; o < arguments.length; o++)
							n[o - 2] = arguments[o];
						return function (e) {
							return "[object Number]" === l.call(e)
						}
						(t) ? t >= e.length ? void console.error("Broken localize call found. Index out of bounds. Stacktrace is\n: " + new Error("").stack) : f(e[t], n) : p(r) ? (console.warn("Message " + r + " didn't get externalized correctly."), f(r, n)) : void console.error("Broken localize call found. Stacktrace is\n: " + new Error("").stack)
					}
				}
				function m(e, t) {
					for (var r = [], n = 2; n < arguments.length; n++)
						r[n - 2] = arguments[n];
					return f(t, r)
				}
				function y(e, t) {
					return i[e] = t,
					t
				}
				function b(e, t) {
					var r,
					n = c.join(s.cacheRoot, e.id + "-" + e.hash + ".json"),
					o = !1,
					i = !1;
					try {
						return r = JSON.parse(u.readFileSync(n, {
									encoding: "utf8",
									flag: "r"
								})),
						function (e) {
							var t = new Date;
							u.utimes(e, t, t, function () {})
						}
						(n),
						r
					} catch (e) {
						if ("ENOENT" === e.code)
							i = !0;
						else {
							if (!(e instanceof SyntaxError))
								throw e;
							console.log("Syntax error parsing message bundle: " + e.message + "."),
							u.unlink(n, function (e) {
								e && console.error("Deleting corrupted bundle " + n + " failed.")
							}),
							o = !0
						}
					}
					if (!(r = function (e, t) {
							var r = s.translationsConfig[e.id];
							if (r) {
								var n = d(r).contents,
								o = d(c.join(t, "nls.metadata.json")),
								i = Object.create(null);
								for (var a in o) {
									var u = o[a],
									l = n[e.outDir + "/" + a];
									if (l) {
										for (var h = [], f = 0; f < u.keys.length; f++) {
											var g = u.keys[f],
											m = l[p(g) ? g : g.key];
											void 0 === m && (m = u.messages[f]),
											h.push(m)
										}
										i[a] = h
									} else
										i[a] = u.messages
								}
								return i
							}
						}
							(e, t)) || o)
						return r;
					if (i)
						try {
							u.writeFileSync(n, JSON.stringify(r), {
								encoding: "utf8",
								flag: "wx"
							})
						} catch (e) {
							if ("EEXIST" === e.code)
								return r;
							throw e
						}
					return r
				}
				function w(e) {
					try {
						return function (e) {
							var t = d(c.join(e, "nls.metadata.json")),
							r = Object.create(null);
							for (var n in t) {
								var o = t[n];
								r[n] = o.messages
							}
							return r
						}
						(e)
					} catch (e) {
						return void console.log("Generating default bundle from meta data failed.", e)
					}
				}
				function v(e, t) {
					var r;
					if (!0 === s.languagePackSupport && void 0 !== s.cacheRoot && void 0 !== s.languagePackId && void 0 !== s.translationsConfigFile && void 0 !== s.translationsConfig)
						try {
							r = b(e, t)
						} catch (e) {
							console.log("Load or create bundle failed ", e)
						}
					if (!r) {
						if (s.languagePackSupport)
							return w(t);
						var n = function (e) {
							for (var t = s.locale; t; ) {
								var r = c.join(e, "nls.bundle." + t + ".json");
								if (u.existsSync(r))
									return r;
								var n = t.lastIndexOf("-");
								t = n > 0 ? t.substring(0, n) : void 0
							}
							if (void 0 === t && (r = c.join(e, "nls.bundle.json"), u.existsSync(r)))
								return r
						}
						(t);
						if (n)
							try {
								return d(n)
							} catch (e) {
								console.log("Loading in the box message bundle failed.", e)
							}
						r = w(t)
					}
					return r
				}
				function C(e) {
					if (!e)
						return m;
					var t = c.extname(e);
					if (t && (e = e.substr(0, e.length - t.length)), s.messageFormat === n.both || s.messageFormat === n.bundle) {
						var r = function (e) {
							for (var t, r = c.dirname(e); t = c.join(r, "nls.metadata.header.json"), !u.existsSync(t); ) {
								var n = c.dirname(r);
								if (n === r) {
									t = void 0;
									break
								}
								r = n
							}
							return t
						}
						(e);
						if (r) {
							var o = c.dirname(r),
							l = i[o];
							if (void 0 === l)
								try {
									var p = JSON.parse(u.readFileSync(r, "utf8"));
									try {
										var f = v(p, o);
										l = y(o, f ? {
												header: p,
												nlsBundle: f
											}
												 : null)
									} catch (e) {
										console.error("Failed to load nls bundle", e),
										l = y(o, null)
									}
								} catch (e) {
									console.error("Failed to read header file", e),
									l = y(o, null)
								}
							if (l) {
								var b = e.substr(o.length + 1).replace(/\\/g, "/"),
								w = l.nlsBundle[b];
								return void 0 === w ? (console.error("Messages for file " + e + " not found. See console for details."), function () {
									return "Messages not found."
								}) : g(w)
							}
						}
					}
					if (s.messageFormat === n.both || s.messageFormat === n.file)
						try {
							var C = d(function (e) {
									var t;
									if (s.cacheLanguageResolution && t)
										t = t;
									else {
										if (a || !s.locale)
											t = ".nls.json";
										else
											for (var r = s.locale; r; ) {
												var n = ".nls." + r + ".json";
												if (u.existsSync(e + n)) {
													t = n;
													break
												}
												var o = r.lastIndexOf("-");
												o > 0 ? r = r.substring(0, o) : (t = ".nls.json", r = null)
											}
										s.cacheLanguageResolution && (t = t)
									}
									return e + t
								}
									(e));
							return Array.isArray(C) ? g(C) : h(C.messages) && h(C.keys) ? g(C.messages) : (console.error("String bundle '" + e + "' uses an unsupported format."), function () {
								return "File bundle has unsupported format. See console for details"
							})
						} catch (e) {
							"ENOENT" !== e.code && console.error("Failed to load single file bundle", e)
						}
					return console.error("Failed to load message bundle for file " + e),
					function () {
						return "Failed to load message bundle. See console for details."
					}
				}
				!function (e) {
					e.file = "file",
					e.bundle = "bundle",
					e.both = "both"
				}
				(n = t.MessageFormat || (t.MessageFormat = {})),
				function (e) {
					e.is = function (e) {
						var t = e;
						return t && h(t.key) && h(t.comment)
					}
				}
				(o || (o = {})),
				function () {
					if (s = {
							locale: void 0,
							languagePackSupport: !1,
							cacheLanguageResolution: !0,
							messageFormat: n.bundle
						}, p(process.env.VSCODE_NLS_CONFIG))
						try {
							var e = JSON.parse(process.env.VSCODE_NLS_CONFIG);
							if (p(e.locale) && (s.locale = e.locale.toLowerCase()), function (e) {
								return !0 === e || !1 === e
							}
								(e._languagePackSupport) && (s.languagePackSupport = e._languagePackSupport), p(e._cacheRoot) && (s.cacheRoot = e._cacheRoot), p(e._languagePackId) && (s.languagePackId = e._languagePackId), p(e._translationsConfigFile)) {
								s.translationsConfigFile = e._translationsConfigFile;
								try {
									s.translationsConfig = d(s.translationsConfigFile)
								} catch (t) {
									e._corruptedFile && u.writeFile(e._corruptedFile, "corrupted", "utf8", function (e) {
										console.error(e)
									})
								}
							}
						} catch (e) {}
					a = "pseudo" === s.locale,
					void 0,
					i = Object.create(null)
				}
				(),
				t.loadMessageBundle = C,
				t.config = function (e) {
					return e && (p(e.locale) && (s.locale = e.locale.toLowerCase(), void 0, i = Object.create(null)), void 0 !== e.messageFormat && (s.messageFormat = e.messageFormat)),
					a = "pseudo" === s.locale,
					C
				}
			}, function (e, t, r) {
				"use strict";
				var n = function () {
					return function () {}
				}
				();
				e.exports = n
			}, function (e, t, r) {
				"use strict";
				var n = this && this.__assign || Object.assign || function (e) {
					for (var t, r = 1, n = arguments.length; r < n; r++)
						for (var o in t = arguments[r])
							Object.prototype.hasOwnProperty.call(t, o) && (e[o] = t[o]);
					return e
				},
				o = r(13),
				i = r(26),
				s = r(20),
				a = r(156),
				c = r(6),
				u = r(17),
				l = function () {
					function e() {}
					return e.getCookie = function (t, r) {
						var n = "";
						if (t && t.length && "string" == typeof r)
							for (var o = t + "=", i = r.split(";"), s = 0; s < i.length; s++) {
								r = i[s];
								if ((r = e.trim(r)) && 0 === r.indexOf(o)) {
									n = r.substring(o.length, i[s].length);
									break
								}
							}
						return n
					},
					e.trim = function (e) {
						return "string" == typeof e ? e.replace(/^\s+|\s+$/g, "") : ""
					},
					e.int32ArrayToBase64 = function (e) {
						var t = function (e, t) {
							return String.fromCharCode(e >> t & 255)
						},
						r = e.map(function (e) {
								return t(e, 24) + t(e, 16) + t(e, 8) + t(e, 0)
							}).join(""),
						n = (Buffer.from ? Buffer.from(r, "binary") : new Buffer(r, "binary")).toString("base64");
						return n.substr(0, n.indexOf("="))
					},
					e.random32 = function () {
						return 4294967296 * Math.random() | 0
					},
					e.randomu32 = function () {
						return e.random32() + 2147483648
					},
					e.w3cTraceId = function () {
						for (var t, r = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "a", "b", "c", "d", "e", "f"], n = "", o = 0; o < 4; o++)
							n += r[15 & (t = e.random32())] + r[t >> 4 & 15] + r[t >> 8 & 15] + r[t >> 12 & 15] + r[t >> 16 & 15] + r[t >> 20 & 15] + r[t >> 24 & 15] + r[t >> 28 & 15];
						var i = r[8 + 4 * Math.random() | 0];
						return n.substr(0, 8) + n.substr(9, 4) + "4" + n.substr(13, 3) + i + n.substr(16, 3) + n.substr(19, 12)
					},
					e.isArray = function (e) {
						return "[object Array]" === Object.prototype.toString.call(e)
					},
					e.isError = function (e) {
						return e instanceof Error
					},
					e.isPrimitive = function (e) {
						var t = typeof e;
						return "string" === t || "number" === t || "boolean" === t
					},
					e.isDate = function (e) {
						return "[object Date]" === Object.prototype.toString.call(e)
					},
					e.msToTimeSpan = function (e) {
						(isNaN(e) || e < 0) && (e = 0);
						var t = (e / 1e3 % 60).toFixed(7).replace(/0{0,4}$/, ""),
						r = "" + Math.floor(e / 6e4) % 60,
						n = "" + Math.floor(e / 36e5) % 24,
						o = Math.floor(e / 864e5);
						return t = t.indexOf(".") < 2 ? "0" + t : t,
						r = r.length < 2 ? "0" + r : r,
						n = n.length < 2 ? "0" + n : n,
						(o > 0 ? o + "." : "") + n + ":" + r + ":" + t
					},
					e.extractError = function (e) {
						var t = e;
						return {
							message: e.message,
							code: t.code || t.id || ""
						}
					},
					e.extractObject = function (t) {
						return t instanceof Error ? e.extractError(t) : "function" == typeof t.toJSON ? t.toJSON() : t
					},
					e.validateStringMap = function (t) {
						if ("object" == typeof t) {
							var r = {};
							for (var n in t) {
								var o = "",
								i = t[n],
								s = typeof i;
								if (e.isPrimitive(i))
									o = i.toString();
								else if (null === i || "undefined" === s)
									o = "";
								else {
									if ("function" === s) {
										c.info("key: " + n + " was function; will not serialize");
										continue
									}
									var a = e.isArray(i) ? i : e.extractObject(i);
									try {
										o = e.isPrimitive(a) ? a : JSON.stringify(a)
									} catch (e) {
										o = i.constructor.name.toString() + " (Error: " + e.message + ")",
										c.info("key: " + n + ", could not be serialized")
									}
								}
								r[n] = o.substring(0, e.MAX_PROPERTY_LENGTH)
							}
							return r
						}
						c.info("Invalid properties dropped from payload")
					},
					e.canIncludeCorrelationHeader = function (e, t) {
						var r = e && e.config && e.config.correlationHeaderExcludedDomains;
						if (!r || 0 == r.length || !t)
							return !0;
						for (var n = 0; n < r.length; n++) {
							if (new RegExp(r[n].replace(/\./g, ".").replace(/\*/g, ".*")).test(s.parse(t).hostname))
								return !1
						}
						return !0
					},
					e.getCorrelationContextTarget = function (e, t) {
						var r = e.headers && e.headers[u.requestContextHeader];
						if (r)
							for (var n = r.split(","), o = 0; o < n.length; ++o) {
								var i = n[o].split("=");
								if (2 == i.length && i[0] == t)
									return i[1]
							}
					},
					e.makeRequest = function (t, r, a, u) {
						r && 0 === r.indexOf("//") && (r = "https:" + r);
						var l = s.parse(r),
						h = n({}, a, {
								host: l.hostname,
								port: l.port,
								path: l.pathname
							}),
						p = void 0;
						if ("https:" === l.protocol && (p = t.proxyHttpsUrl || void 0), "http:" === l.protocol && (p = t.proxyHttpUrl || void 0), p) {
							0 === p.indexOf("//") && (p = "http:" + p);
							var d = s.parse(p);
							"https:" === d.protocol ? (c.info("Proxies that use HTTPS are not supported"), p = void 0) : h = n({}, h, {
									host: d.hostname,
									port: d.port || "80",
									path: r,
									headers: n({}, h.headers, {
										Host: l.hostname
									})
								})
						}
						var f = "https:" === l.protocol && !p;
						return f && void 0 !== t.httpsAgent ? h.agent = t.httpsAgent : f || void 0 === t.httpAgent ? f && (h.agent = e.tlsRestrictedAgent) : h.agent = t.httpAgent,
						f ? i.request(h, u) : o.request(h, u)
					},
					e.MAX_PROPERTY_LENGTH = 8192,
					e.tlsRestrictedAgent = new i.Agent({
							secureOptions: a.SSL_OP_NO_SSLv2 | a.SSL_OP_NO_SSLv3 | a.SSL_OP_NO_TLSv1 | a.SSL_OP_NO_TLSv1_1
						}),
					e
				}
				();
				e.exports = l
			}, function (e, t) {
				e.exports = require("os")
			}, function (e, t, r) {
				"use strict";
				var n,
				o = r(14),
				i = o.Buffer,
				s = {};
				for (n in o)
					o.hasOwnProperty(n) && "SlowBuffer" !== n && "Buffer" !== n && (s[n] = o[n]);
				var a = s.Buffer = {};
				for (n in i)
					i.hasOwnProperty(n) && "allocUnsafe" !== n && "allocUnsafeSlow" !== n && (a[n] = i[n]);
				if (s.Buffer.prototype = i.prototype, a.from && a.from !== Uint8Array.from || (a.from = function (e, t, r) {
						if ("number" == typeof e)
							throw new TypeError('The "value" argument must not be of type number. Received type ' + typeof e);
							if (e && void 0 === e.length)
								throw new TypeError("The first argument must be one of type string, Buffer, ArrayBuffer, Array, or Array-like Object. Received type " + typeof e);
							return i(e, t, r)
						}), a.alloc || (a.alloc = function (e, t, r) {
							if ("number" != typeof e)
								throw new TypeError('The "size" argument must be of type number. Received type ' + typeof e);
							if (e < 0 || e >= 2 * (1 << 30))
								throw new RangeError('The value "' + e + '" is invalid for option "size"');
							var n = i(e);
							return t && 0 !== t.length ? "string" == typeof r ? n.fill(t, r) : n.fill(t) : n.fill(0),
							n
						}), !s.kStringMaxLength)try {
						s.kStringMaxLength = process.binding("buffer").kStringMaxLength
					} catch (e) {}
				s.constants || (s.constants = {
						MAX_LENGTH: s.kMaxLength
					}, s.kStringMaxLength && (s.constants.MAX_STRING_LENGTH = s.kStringMaxLength)),
				e.exports = s
			}, function (e, t) {
				e.exports = require("http")
			}, function (e, t) {
				e.exports = require("buffer")
			}, function (e, t) {
				e.exports = require("stream")
			}, function (e, t, r) {
				"use strict";
				Object.defineProperty(t, "__esModule", {
					value: !0
				});
				var n = r(6),
				o = r(24),
				i = function () {
					function e() {}
					return e.getCurrentContext = function () {
						return e.enabled ? Zone.current.get("context") : null
					},
					e.generateContextObject = function (e, t, r, n) {
						return t = t || e,
						this.enabled ? {
							operation: {
								name: r,
								id: e,
								parentId: t
							},
							customProperties: new s(n)
						}
						 : null
					},
					e.runWithContext = function (t, r) {
						e.enabled ? Zone.current.fork({
							name: "AI-" + (t && t.operation.parentId || "Unknown"),
							properties: {
								context: t
							}
						}).run(r) : r()
					},
					e.wrapCallback = function (t) {
						return e.enabled ? Zone.current.wrap(t, "User-wrapped method") : t
					},
					e.enable = function () {
						if (!this.enabled)
							if (this.isNodeVersionCompatible()) {
								if (!e.hasEverEnabled) {
									this.hasEverEnabled = !0;
									try {
										"undefined" == typeof Zone && r(132)
									} catch (e) {
										n.warn("Failed to require zone.js")
									}
									o.registerContextPreservation(function (e) {
										return Zone.current.wrap(e, "AI-ContextPreservation")
									}),
									this.patchError(),
									this.patchTimers(["setTimeout", "setInterval"])
								}
								this.enabled = !0
							} else
								this.enabled = !1
					},
					e.disable = function () {
						this.enabled = !1
					},
					e.isNodeVersionCompatible = function () {
						var e = process.versions.node.split(".");
						return parseInt(e[0]) > 3 || parseInt(e[0]) > 2 && parseInt(e[1]) > 2
					},
					e.patchTimers = function (e) {
						e.forEach(function (e) {
							var t = global[e];
							global[e] = function () {
								var e = t.apply(this, arguments);
								return e.toString = function () {
									return this.data && void 0 !== this.data.handleId ? this.data.handleId.toString() : Object.prototype.toString.call(this)
								},
								e
							}
						})
					},
					e.patchError = function () {
						var e = global.Error;
						function t() {
							if (!(this instanceof t))
								return t.apply(Object.create(t.prototype), arguments);
							var r = e.stackRewrite;
							if (e.prepareStackTrace) {
								e.stackRewrite = !1;
								var n = e.prepareStackTrace;
								e.prepareStackTrace = function (e, t) {
									for (var r = !1, o = 0; o < t.length; o++) {
										var i = t[o].getFileName();
										if (i)
											if (-1 === i.indexOf("AutoCollection/CorrelationContextManager") && -1 === i.indexOf("AutoCollection\\CorrelationContextManager")) {
												if (r)
													break
											} else
												r = !0
									}
									return o = Math.max(0, o - 1),
									r && t.splice(0, o),
									n(e, t)
								}
							}
							if (e.apply(this, arguments), e.stackRewrite = r, this.stack && "string" == typeof this.stack) {
								var o = this.stack.split("\n");
								o.length > 3 && (0 === o[2].trim().indexOf("at Error.AppInsightsAsyncCorrelatedErrorWrapper") ? o.splice(2, 1) : 0 === o[1].trim().indexOf("at AppInsightsAsyncCorrelatedErrorWrapper.ZoneAwareError") && 0 === o[2].trim().indexOf("at new AppInsightsAsyncCorrelatedErrorWrapper") && o.splice(1, 2)),
								this.stack = o.map(function (e) {
										var t = e.indexOf(") [");
										return t > -1 && (e = e.substr(0, t + 1)),
										e
									}).join("\n")
							}
							for (var i = Object.getOwnPropertyNames(this).concat(Object.keys(this)), s = 0; s < i.length; s++) {
								var a = i[s],
								c = Zone.__symbol__(a);
								Object.defineProperty(this, a, {
									enumerable: !1
								}),
								Object.defineProperty(this, c, {
									enumerable: !1,
									writable: !0
								})
							}
							return this
						}
						t.prototype = e.prototype;
						for (var r = Object.getOwnPropertyNames(e), n = 0; n < r.length; n++) {
							var o = r[n];
							t[o] || Object.defineProperty(t, o, Object.getOwnPropertyDescriptor(e, o))
						}
						global.Error = t
					},
					e.enabled = !1,
					e.hasEverEnabled = !1,
					e
				}
				();
				t.CorrelationContextManager = i;
				var s = function () {
					function e(e) {
						this.props = [],
						this.addHeaderData(e)
					}
					return e.prototype.addHeaderData = function (e) {
						var t = e ? e.split(", ") : [];
						this.props = t.map(function (e) {
								var t = e.split("=");
								return {
									key: t[0],
									value: t[1]
								}
							}).concat(this.props)
					},
					e.prototype.serializeToHeader = function () {
						return this.props.map(function (e) {
							return e.key + "=" + e.value
						}).join(", ")
					},
					e.prototype.getProperty = function (e) {
						for (var t = 0; t < this.props.length; ++t) {
							var r = this.props[t];
							if (r.key === e)
								return r.value
						}
					},
					e.prototype.setProperty = function (t, r) {
						if (e.bannedCharacters.test(t) || e.bannedCharacters.test(r))
							n.warn("Correlation context property keys and values must not contain ',' or '='. setProperty was called with key: " + t + " and value: " + r);
						else {
							for (var o = 0; o < this.props.length; ++o) {
								var i = this.props[o];
								if (i.key === t)
									return void(i.value = r)
							}
							this.props.push({
								key: t,
								value: r
							})
						}
					},
					e.bannedCharacters = /[,=]/,
					e
				}
				()
			}, function (e, t, r) {
				"use strict";
				e.exports = {
					requestContextHeader: "request-context",
					requestContextSourceKey: "appId",
					requestContextTargetKey: "appId",
					requestIdHeader: "request-id",
					parentIdHeader: "x-ms-request-id",
					rootIdHeader: "x-ms-request-root-id",
					correlationContextHeader: "correlation-context"
				}
			}, function (e, t, r) {
				"use strict";
				Object.defineProperty(t, "__esModule", {
					value: !0
				});
				const n = r(5);
				function o(e) {
					return (t, r, n) => {
						let o = null,
						i = null;
						if ("function" == typeof n.value ? (o = "value", i = n.value) : "function" == typeof n.get && (o = "get", i = n.get), !i || !o)
							throw new Error("not supported");
						n[o] = e(i, r)
					}
				}
				t.memoize = o(function (e, t) {
						const r = `$memoize$${t}`;
						return function (...t) {
							return this.hasOwnProperty(r) || Object.defineProperty(this, r, {
								configurable: !1,
								enumerable: !1,
								writable: !1,
								value: e.apply(this, t)
							}),
							this[r]
						}
					}),
				t.throttle = o(function (e, t) {
						const r = `$throttle$current$${t}`,
						o = `$throttle$next$${t}`,
						i = function (...t) {
							if (this[o])
								return this[o];
							if (this[r])
								return this[o] = n.done(this[r]).then(() => (this[o] = void 0, i.apply(this, t))), this[o];
							this[r] = e.apply(this, t);
							const s = () => this[r] = void 0;
							return n.done(this[r]).then(s, s),
							this[r]
						};
						return i
					}),
				t.sequentialize = o(function (e, t) {
						const r = `__$sequence$${t}`;
						return function (...t) {
							const n = this[r] || Promise.resolve(null),
							o = async() => await e.apply(this, t);
							return this[r] = n.then(o, o),
							this[r]
						}
					}),
				t.debounce = function (e) {
					return o((t, r) => {
						const n = `$debounce$${r}`;
						return function (...r) {
							clearTimeout(this[n]),
							this[n] = setTimeout(() => t.apply(this, r), e)
						}
					})
				}
			}, function (e, t, r) {
				"use strict";
				Object.defineProperty(t, "__esModule", {
					value: !0
				}),
				t.fromGitUri = function (e) {
					return JSON.parse(e.query)
				},
				t.toGitUri = function (e, t, r = {}) {
					const n = {
						path: e.fsPath,
						ref: t
					};
					r.submoduleOf && (n.submoduleOf = r.submoduleOf);
					let o = e.path;
					return r.replaceFileExtension ? o = `${o}.git` : r.submoduleOf && (o = `${o}.diff`),
					e.with({
						scheme: "git",
						path: o,
						query: JSON.stringify(n)
					})
				}
			}, function (e, t) {
				e.exports = require("url")
			}, function (e, t, r) {
				"use strict";
				Object.defineProperty(t, "__esModule", {
					value: !0
				});
				const n = r(2),
				o = r(1),
				i = r(11),
				s = r(28),
				a = r(46),
				c = r(22),
				u = r(50),
				l = r(68),
				h = r(5),
				p = r(70),
				d = r(71),
				f = r(32),
				g = r(29),
				m = 3e4,
				y = h.denodeify(n.readFile);
				function b(e) {
					return e.replace(/^git version /, "")
				}
				function w(e, t) {
					return new Promise((r, n) => {
						t(e);
						const o = [],
						i = s.spawn(e, ["--version"]);
						i.stdout.on("data", e => o.push(e)),
						i.on("error", _(n)),
						i.on("exit", t => t ? n(new Error("Not found")) : r({
								path: e,
								version: b(Buffer.concat(o).toString("utf8").trim())
							}))
					})
				}
				function v(e, t) {
					return e ? w(o.join(e, "Git", "cmd", "git.exe"), t) : Promise.reject("Not found")
				}
				function C(e) {
					return v(process.env.ProgramW6432, e).then(void 0, () => v(process.env["ProgramFiles(x86)"], e)).then(void 0, () => v(process.env.ProgramFiles, e)).then(void 0, () => v(o.join(process.env.LocalAppData, "Programs"), e)).then(void 0, () => (function (e) {
							return new Promise((e, t) => a("git.exe", (r, n) => r ? t(r) : e(n))).then(t => w(t, e))
						})(e))
				}
				function _(e) {
					return t => {
						/ENOENT/.test(t.message) && (t = new k({
									error: t,
									message: "Failed to execute git (ENOENT)",
									gitErrorCode: "NotAGitRepository"
								})),
						e(t)
					}
				}
				async function S(e, t) {
					if (!e.stdout || !e.stderr)
						throw new k({
							message: "Failed to get stdout or stderr from git process."
						});
					if (t && t.isCancellationRequested)
						throw new k({
							message: "Cancelled"
						});
					const r = [],
					n = (e, t, n) => {
						e.once(t, n),
						r.push(h.toDisposable(() => e.removeListener(t, n)))
					},
					o = (e, t, n) => {
						e.on(t, n),
						r.push(h.toDisposable(() => e.removeListener(t, n)))
					};
					let i = Promise.all([new Promise((t, r) => {
									n(e, "error", _(r)),
									n(e, "exit", t)
								}), new Promise(t => {
									const r = [];
									o(e.stdout, "data", e => r.push(e)),
									n(e.stdout, "close", () => t(Buffer.concat(r)))
								}), new Promise(t => {
									const r = [];
									o(e.stderr, "data", e => r.push(e)),
									n(e.stderr, "close", () => t(Buffer.concat(r).toString("utf8")))
								})]);
					if (t) {
						const r = new Promise((r, n) => {
								h.onceEvent(t.onCancellationRequested)(() => {
									try {
										e.kill()
									} catch (e) {}
									n(new k({
											message: "Cancelled"
										}))
								})
							});
						i = Promise.race([i, r])
					}
					try {
						const[e, t, n] = await i;
						return {
							exitCode: e,
							stdout: t,
							stderr: n
						}
					}
					finally {
						h.dispose(r)
					}
				}
				t.findGit = function (e, t) {
					return (e ? w(e, t) : Promise.reject(null)).then(void 0, () => {
						switch (process.platform) {
						case "darwin":
							return function (e) {
								return new Promise((t, r) => {
									s.exec("which git", (n, o) => {
										if (n)
											return r("git not found");
										const i = o.toString().replace(/^\s+|\s+$/g, "");
										function a(n) {
											e(n),
											s.exec("git --version", (e, o) => e ? r("git not found") : t({
													path: n,
													version: b(o.trim())
												}))
										}
										if ("/usr/bin/git" !== i)
											return a(i);
										s.exec("xcode-select -p", e => {
											if (e && 2 === e.code)
												return r("git not found");
											a(i)
										})
									})
								})
							}
							(t);
						case "win32":
							return C(t);
						default:
							return w("git", t)
						}
					}).then(null, () => Promise.reject(new Error("Git installation not found.")))
				};
				class k {
					constructor(e) {
						e.error ? (this.error = e.error, this.message = e.error.message) : (this.error = void 0, this.message = ""),
						this.message = this.message || e.message || "Git error",
						this.stdout = e.stdout,
						this.stderr = e.stderr,
						this.exitCode = e.exitCode,
						this.gitErrorCode = e.gitErrorCode,
						this.gitCommand = e.gitCommand
					}
					toString() {
						let e = this.message + " " + JSON.stringify({
								exitCode: this.exitCode,
								gitErrorCode: this.gitErrorCode,
								gitCommand: this.gitCommand,
								stdout: this.stdout,
								stderr: this.stderr
							}, null, 2);
						return this.error && (e += this.error.stack),
						e
					}
				}
				function T(e) {
					return /Another git process seems to be running in this repository|If no other git process is currently running/.test(e) ? "RepositoryIsLocked" : /Authentication failed/.test(e) ? "AuthenticationFailed" : /Not a git repository/i.test(e) ? "NotAGitRepository" : /bad config file/.test(e) ? "BadConfigFile" : /cannot make pipe for command substitution|cannot create standard input pipe/.test(e) ? "CantCreatePipe" : /Repository not found/.test(e) ? "RepositoryNotFound" : /unable to access/.test(e) ? "CantAccessRemote" : /branch '.+' is not fully merged/.test(e) ? "BranchNotFullyMerged" : /Couldn\'t find remote ref/.test(e) ? "NoRemoteReference" : /A branch named '.+' already exists/.test(e) ? "BranchAlreadyExists" : /'.+' is not a valid branch name/.test(e) ? "InvalidBranchName" : /Please,? commit your changes or stash them/.test(e) ? "DirtyWorkTree" : void 0
				}
				t.GitError = k;
				const E = "%H\n%ae\n%P\n%B";
				t.Git = class {
					constructor(e) {
						this._onOutput = new c.EventEmitter,
						this.path = e.gitPath,
						this.env = e.env || {}
					}
					get onOutput() {
						return this._onOutput
					}
					open(e, t) {
						return new O(this, e, t)
					}
					async init(e) {
						await this.exec(e, ["init"])
					}
					async clone(e, t, r, i) {
						let s = decodeURI(e).replace(/[\/]+$/, "").replace(/^.*[\/\\]/, "").replace(/\.git$/, "") || "repository",
						a = s,
						c = o.join(t, a),
						u = 1;
						for (; u < 20 && await new Promise(e => n.exists(c, e)); )
							a = `${s}-${u++}`, c = o.join(t, a);
						await h.mkdirp(t);
						const l = e => {
							const t = new g.StringDecoder("utf8"),
							n = new f.LineStream({
									encoding: "utf8"
								});
							e.stderr.on("data", e => n.write(t.write(e)));
							let o = 0,
							i = 0;
							n.on("data", e => {
								let t = null;
								(t = /Counting objects:\s*(\d+)%/i.exec(e)) ? o = Math.floor(.1 * parseInt(t[1])) : (t = /Compressing objects:\s*(\d+)%/i.exec(e)) ? o = 10 + Math.floor(.1 * parseInt(t[1])) : (t = /Receiving objects:\s*(\d+)%/i.exec(e)) ? o = 20 + Math.floor(.4 * parseInt(t[1])) : (t = /Resolving deltas:\s*(\d+)%/i.exec(e)) && (o = 60 + Math.floor(.4 * parseInt(t[1]))),
								o !== i && (r.report({
										increment: o - i
									}), i = o)
							})
						};
						try {
							await this.exec(t, ["clone", e.includes(" ") ? encodeURI(e) : e, c, "--progress"], {
								cancellationToken: i,
								onSpawn: l
							})
						} catch (e) {
							throw e.stderr && (e.stderr = e.stderr.replace(/^Cloning.+$/m, "").trim(), e.stderr = e.stderr.replace(/^ERROR:\s+/, "").trim()),
							e
						}
						return c
					}
					async getRepositoryRoot(e) {
						const t = await this.exec(e, ["rev-parse", "--show-toplevel"]);
						return o.normalize(t.stdout.trimLeft().replace(/(\r\n|\r|\n)+$/, ""))
					}
					async getRepositoryDotGit(e) {
						let t = (await this.exec(e, ["rev-parse", "--git-dir"])).stdout.trim();
						return o.isAbsolute(t) || (t = o.join(e, t)),
						o.normalize(t)
					}
					async exec(e, t, r = {}) {
						return r = h.assign({
								cwd: e
							}, r || {}),
						await this._exec(t, r)
					}
					async exec2(e, t = {}) {
						return await this._exec(e, t)
					}
					stream(e, t, r = {}) {
						return r = h.assign({
								cwd: e
							}, r || {}),
						this.spawn(t, r)
					}
					async _exec(e, t = {}) {
						const r = this.spawn(e, t);
						t.onSpawn && t.onSpawn(r),
						t.input && r.stdin.end(t.input, "utf8");
						const n = await S(r, t.cancellationToken);
						!1 !== t.log && n.stderr.length > 0 && this.log(`${n.stderr}\n`);
						let o = t.encoding || "utf8";
						o = u.encodingExists(o) ? o : "utf8";
						const i = {
							exitCode: n.exitCode,
							stdout: u.decode(n.stdout, o),
							stderr: n.stderr
						};
						return n.exitCode ? Promise.reject(new k({
								message: "Failed to execute git",
								stdout: i.stdout,
								stderr: i.stderr,
								exitCode: i.exitCode,
								gitErrorCode: T(i.stderr),
								gitCommand: e[0]
							})) : i
					}
					spawn(e, t = {}) {
						if (!this.path)
							throw new Error("git could not be found in the system.");
						return t || (t = {}),
						t.stdio || t.input || (t.stdio = ["ignore", null, null]),
						t.env = h.assign({}, process.env, this.env, t.env || {}, {
								VSCODE_GIT_COMMAND: e[0],
								LC_ALL: "en_US.UTF-8",
								LANG: "en_US.UTF-8"
							}),
						!1 !== t.log && this.log(`> git ${e.join(" ")}\n`),
						s.spawn(this.path, e, t)
					}
					log(e) {
						this._onOutput.emit("log", e)
					}
				};
				class R {
					constructor() {
						this.lastRaw = "",
						this.result = []
					}
					get status() {
						return this.result
					}
					update(e) {
						let t,
						r = 0;
						for (e = this.lastRaw + e; void 0 !== (t = this.parseEntry(e, r)); )
							r = t;
						this.lastRaw = e.substr(r)
					}
					parseEntry(e, t) {
						if (t + 4 >= e.length)
							return;
						let r;
						const n = {
							x: e.charAt(t++),
							y: e.charAt(t++),
							rename: void 0,
							path: ""
						};
						if (t++, "R" === n.x || "C" === n.x) {
							if (-1 === (r = e.indexOf("\0", t)))
								return;
							n.rename = e.substring(t, r),
							t = r + 1
						}
						return -1 !== (r = e.indexOf("\0", t)) ? (n.path = e.substring(t, r), "/" !== n.path[n.path.length - 1] && this.result.push(n), r + 1) : void 0
					}
				}
				function P(e) {
					const t = /\r?\n/g;
					let r = 0,
					n = null;
					const o = [];
					let i = {};
					function s(e) {
						const t = /^\s*\[submodule "([^"]+)"\]\s*$/.exec(e);
						if (t) {
							i.name && i.path && i.url && o.push(i);
							const e = t[1];
							if (e)
								return void(i = {
										name: e
									})
						}
						if (!i)
							return;
						const r = /^\s*(\w+)\s+=\s+(.*)$/.exec(e);
						if (!r)
							return;
						const[, n, s] = r;
						switch (n) {
						case "path":
							i.path = s;
							break;
						case "url":
							i.url = s
						}
					}
					for (; n = t.exec(e); )
						s(e.substring(r, n.index)), r = n.index + n[0].length;
					return s(e.substring(r)),
					i.name && i.path && i.url && o.push(i),
					o
				}
				function x(e) {
					const t = /^([0-9a-f]{40})\n(.*)\n(.*)(\n([^]*))?$/m.exec(e.trim());
					if (!t)
						return null;
					const r = t[3] ? t[3].split(" ") : [];
					return {
						hash: t[1],
						message: t[5],
						parents: r,
						authorEmail: t[2]
					}
				}
				function I(e) {
					return e.split("\n").filter(e => !!e).map(e => /^(\S+)\s+(\S+)\s+(\S+)\s+(\S+)\s+(.*)$/.exec(e)).filter(e => !!e).map(([, e, t, r, n, o]) => ({
							mode: e,
							type: t,
							object: r,
							size: n,
							file: o
						}))
				}
				function D(e) {
					return e.split("\n").filter(e => !!e).map(e => /^(\S+)\s+(\S+)\s+(\S+)\s+(.*)$/.exec(e)).filter(e => !!e).map(([, e, t, r, n]) => ({
							mode: e,
							object: t,
							stage: r,
							file: n
						}))
				}
				var A;
				t.GitStatusParser = R,
				t.parseGitmodules = P,
				t.parseGitCommit = x,
				t.parseLsTree = I,
				t.parseLsFiles = D,
				function (e) {
					e[e.Force = 0] = "Force",
					e[e.ForceWithLease = 1] = "ForceWithLease"
				}
				(A = t.ForcePushMode || (t.ForcePushMode = {}));
				class O {
					constructor(e, t, r) {
						this._git = e,
						this.repositoryRoot = t,
						this.dotGit = r
					}
					get git() {
						return this._git
					}
					get root() {
						return this.repositoryRoot
					}
					async run(e, t = {}) {
						return await this.git.exec(this.repositoryRoot, e, t)
					}
					stream(e, t = {}) {
						return this.git.stream(this.repositoryRoot, e, t)
					}
					spawn(e, t = {}) {
						return this.git.spawn(e, t)
					}
					async config(e, t, r = null, n = {}) {
						const o = ["config"];
						return e && o.push("--" + e),
						o.push(t),
						r && o.push(r),
						(await this.run(o, n)).stdout.trim()
					}
					async getConfigs(e) {
						const t = ["config"];
						return e && t.push("--" + e),
						t.push("-l"),
						(await this.run(t)).stdout.trim().split(/\r|\r\n|\n/).map(e => {
							const t = e.indexOf("=");
							return {
								key: e.substr(0, t),
								value: e.substr(t + 1)
							}
						})
					}
					async log(e) {
						const t = ["log", "-" + (e && "number" == typeof e.maxEntries && e.maxEntries > 0 ? e.maxEntries : 32), `--pretty=format:${E}%x00%x00`],
						r = await this.run(t);
						if (r.exitCode)
							return [];
						const n = r.stdout,
						o = [];
						let i = 0;
						for (; i < n.length; ) {
							let e = n.indexOf("\0\0", i);
							-1 === e && (e = n.length);
							let t = n.substr(i, e - i);
							t.startsWith("\n") && (t = t.substring(1));
							const r = x(t);
							if (!r)
								break;
							o.push(r),
							i = e + 2
						}
						return o
					}
					async bufferString(e, t = "utf8", r = !1) {
						const n = await this.buffer(e);
						return r && (t = d.detectEncoding(n) || t),
						t = u.encodingExists(t) ? t : "utf8",
						u.decode(n, t)
					}
					async buffer(e) {
						const t = this.stream(["show", e]);
						if (!t.stdout)
							return Promise.reject("Can't open file from git");
						const {
							exitCode: r,
							stdout: n,
							stderr: o
						} = await S(t);
						if (r) {
							const e = new k({
									message: "Could not show object.",
									exitCode: r
								});
							return /exists on disk, but not in/.test(o) && (e.gitErrorCode = "WrongCase"),
							Promise.reject(e)
						}
						return n
					}
					async getObjectDetails(e, t) {
						if (!e) {
							const e = await this.lsfiles(t);
							if (0 === e.length)
								throw new k({
									message: "Path not known by git",
									gitErrorCode: "UnknownPath"
								});
							const {
								mode: r,
								object: n
							} = e[0],
							o = await this.run(["cat-file", "-s", n]);
							return {
								mode: r,
								object: n,
								size: parseInt(o.stdout)
							}
						}
						const r = await this.lstree(e, t);
						if (0 === r.length)
							throw new k({
								message: "Path not known by git",
								gitErrorCode: "UnknownPath"
							});
						const {
							mode: n,
							object: o,
							size: i
						} = r[0];
						return {
							mode: n,
							object: o,
							size: parseInt(i)
						}
					}
					async lstree(e, t) {
						const {
							stdout: r
						} = await this.run(["ls-tree", "-l", e, "--", t]);
						return I(r)
					}
					async lsfiles(e) {
						const {
							stdout: t
						} = await this.run(["ls-files", "--stage", "--", e]);
						return D(t)
					}
					async getGitRelativePath(e, t) {
						const r = t.toLowerCase(),
						n = o.posix.dirname(t) + "/",
						i = (e ? await this.lstree(e, n) : await this.lsfiles(n)).filter(e => e.file.toLowerCase() === r)[0];
						if (!i)
							throw new k({
								message: "Git relative path not found."
							});
						return i.file
					}
					async detectObjectType(e) {
						const t = await this.stream(["show", e]),
						r = await h.readBytes(t.stdout, 4100);
						try {
							t.kill()
						} catch (e) {}
						const n = h.detectUnicodeEncoding(r);
						let o = !0;
						if ("utf16be" !== n && "utf16le" !== n)
							for (let e = 0; e < r.length; e++)
								if (0 === r.readInt8(e)) {
									o = !1;
									break
								}
						if (!o) {
							const e = l(r);
							return e ? {
								mimetype: e.mime
							}
							 : {
								mimetype: "application/octet-stream"
							}
						}
						return n ? {
							mimetype: "text/plain",
							encoding: n
						}
						 : {
							mimetype: "text/plain"
						}
					}
					async apply(e, t) {
						const r = ["apply", e];
						t && r.push("-R");
						try {
							await this.run(r)
						} catch (e) {
							throw /patch does not apply/.test(e.stderr) && (e.gitErrorCode = "PatchDoesNotApply"),
							e
						}
					}
					async diff(e = !1) {
						const t = ["diff"];
						return e && t.push("--cached"),
						(await this.run(t)).stdout
					}
					async diffWithHEAD(e) {
						if (!e)
							return await this.diffFiles(!1);
						const t = ["diff", "--", e];
						return (await this.run(t)).stdout
					}
					async diffWith(e, t) {
						if (!t)
							return await this.diffFiles(!1, e);
						const r = ["diff", e, "--", t];
						return (await this.run(r)).stdout
					}
					async diffIndexWithHEAD(e) {
						if (!e)
							return await this.diffFiles(!0);
						const t = ["diff", "--cached", "--", e];
						return (await this.run(t)).stdout
					}
					async diffIndexWith(e, t) {
						if (!t)
							return await this.diffFiles(!0, e);
						const r = ["diff", "--cached", e, "--", t];
						return (await this.run(r)).stdout
					}
					async diffBlobs(e, t) {
						const r = ["diff", e, t];
						return (await this.run(r)).stdout
					}
					async diffBetween(e, t, r) {
						const n = `${e}...${t}`;
						if (!r)
							return await this.diffFiles(!1, n);
						const o = ["diff", n, "--", r];
						return (await this.run(o)).stdout.trim()
					}
					async diffFiles(e, t) {
						const r = ["diff", "--name-status", "-z", "--diff-filter=ADMR"];
						e && r.push("--cached"),
						t && r.push(t);
						const n = await this.run(r);
						if (n.exitCode)
							return [];
						const i = n.stdout.split("\0");
						let s = 0;
						const a = [];
						e: for (; s < i.length - 1; ) {
							const e = i[s++],
							t = i[s++];
							if (!e || !t)
								break;
							const r = p.URI.file(o.isAbsolute(t) ? t : o.join(this.repositoryRoot, t));
							let n = 7;
							switch (e[0]) {
							case "M":
								n = 5;
								break;
							case "A":
								n = 1;
								break;
							case "D":
								n = 6;
								break;
							case "R":
								if (s >= i.length)
									break;
								const t = i[s++];
								if (!t)
									break;
								const c = p.URI.file(o.isAbsolute(t) ? t : o.join(this.repositoryRoot, t));
								a.push({
									uri: c,
									renameUri: c,
									originalUri: r,
									status: 3
								});
								continue;
							default:
								break e
							}
							a.push({
								status: n,
								originalUri: r,
								uri: r,
								renameUri: r
							})
						}
						return a
					}
					async getMergeBase(e, t) {
						const r = ["merge-base", e, t];
						return (await this.run(r)).stdout.trim()
					}
					async hashObject(e) {
						return (await this.run(["hash-object", "-w", "--stdin"], {
								input: e
							})).stdout.trim()
					}
					async add(e, t) {
						const r = ["add"];
						t && t.update ? r.push("-u") : r.push("-A"),
						r.push("--"),
						e && e.length ? r.push.apply(r, e) : r.push("."),
						await this.run(r)
					}
					async rm(e) {
						const t = ["rm", "--"];
						e && e.length && (t.push(...e), await this.run(t))
					}
					async stage(e, t) {
						const r = this.stream(["hash-object", "--stdin", "-w", "--path", e], {
								stdio: [null, null, null]
							});
						r.stdin.end(t, "utf8");
						const {
							exitCode: n,
							stdout: o
						} = await S(r),
						i = o.toString("utf8");
						if (n)
							throw new k({
								message: "Could not hash object.",
								exitCode: n
							});
						let s,
						a = "";
						try {
							s = (await this.getObjectDetails("HEAD", e)).mode
						} catch (e) {
							if ("UnknownPath" !== e.gitErrorCode)
								throw e;
							s = "100644",
							a = "--add"
						}
						await this.run(["update-index", a, "--cacheinfo", s, i, e])
					}
					async checkout(e, t, r = Object.create(null)) {
						const n = ["checkout", "-q"];
						r.track && n.push("--track"),
						e && n.push(e);
						try {
							if (t && t.length > 0)
								for (const e of h.splitInChunks(t, m))
									await this.run([...n, "--", ...e]);
							else
								await this.run(n)
						} catch (e) {
							throw /Please,? commit your changes or stash them/.test(e.stderr || "") && (e.gitErrorCode = "DirtyWorkTree"),
							e
						}
					}
					async commit(e, t = Object.create(null)) {
						const r = ["commit", "--quiet", "--allow-empty-message", "--file", "-"];
						t.all && r.push("--all"),
						t.amend && r.push("--amend"),
						t.signoff && r.push("--signoff"),
						t.signCommit && r.push("-S"),
						t.empty && r.push("--allow-empty");
						try {
							await this.run(r, {
								input: e || ""
							})
						} catch (e) {
							await this.handleCommitError(e)
						}
					}
					async rebaseContinue() {
						const e = ["rebase", "--continue"];
						try {
							await this.run(e)
						} catch (e) {
							await this.handleCommitError(e)
						}
					}
					async handleCommitError(e) {
						if (/not possible because you have unmerged files/.test(e.stderr || ""))
							throw e.gitErrorCode = "UnmergedChanges", e;
						try {
							await this.run(["config", "--get-all", "user.name"])
						} catch (e) {
							throw e.gitErrorCode = "NoUserNameConfigured",
							e
						}
						try {
							await this.run(["config", "--get-all", "user.email"])
						} catch (e) {
							throw e.gitErrorCode = "NoUserEmailConfigured",
							e
						}
						throw e
					}
					async branch(e, t, r) {
						const n = t ? ["checkout", "-q", "-b", e, "--no-track"] : ["branch", "-q", e];
						r && n.push(r),
						await this.run(n)
					}
					async deleteBranch(e, t) {
						const r = ["branch", t ? "-D" : "-d", e];
						await this.run(r)
					}
					async renameBranch(e) {
						const t = ["branch", "-m", e];
						await this.run(t)
					}
					async setBranchUpstream(e, t) {
						const r = ["branch", "--set-upstream-to", t, e];
						await this.run(r)
					}
					async deleteRef(e) {
						const t = ["update-ref", "-d", e];
						await this.run(t)
					}
					async merge(e) {
						const t = ["merge", e];
						try {
							await this.run(t)
						} catch (e) {
							throw /^CONFLICT /m.test(e.stdout || "") && (e.gitErrorCode = "Conflict"),
							e
						}
					}
					async tag(e, t) {
						let r = ["tag"];
						r = t ? [...r, "-a", e, "-m", t] : [...r, e],
						await this.run(r)
					}
					async deleteTag(e) {
						let t = ["tag", "-d", e];
						await this.run(t)
					}
					async clean(e) {
						const t = h.groupBy(e, e => o.dirname(e)),
						r = Object.keys(t).map(e => t[e]),
						n = new h.Limiter(5),
						i = [];
						for (const e of r)
							for (const t of h.splitInChunks(e, m))
								i.push(n.queue(() => this.run(["clean", "-f", "-q", "--", ...t])));
						await Promise.all(i)
					}
					async undo() {
						await this.run(["clean", "-fd"]);
						try {
							await this.run(["checkout", "--", "."])
						} catch (e) {
							if (/did not match any file\(s\) known to git\./.test(e.stderr || ""))
								return;
							throw e
						}
					}
					async reset(e, t = !1) {
						const r = ["reset", t ? "--hard" : "--soft", e];
						await this.run(r)
					}
					async revert(e, t) {
						let r;
						r = (await this.run(["branch"])).stdout ? ["reset", "-q", e, "--"] : ["rm", "--cached", "-r", "--"],
						t && t.length ? r.push.apply(r, t) : r.push(".");
						try {
							await this.run(r)
						} catch (e) {
							if (/([^:]+: needs merge\n)+/m.test(e.stdout || ""))
								return;
							throw e
						}
					}
					async addRemote(e, t) {
						const r = ["remote", "add", e, t];
						await this.run(r)
					}
					async removeRemote(e) {
						const t = ["remote", "rm", e];
						await this.run(t)
					}
					async fetch(e = {}) {
						const t = ["fetch"],
						r = {};
						e.remote ? (t.push(e.remote), e.ref && t.push(e.ref)) : e.all && t.push("--all"),
						e.prune && t.push("--prune"),
						"number" == typeof e.depth && t.push(`--depth=${e.depth}`),
						e.silent && (r.env = {
								VSCODE_GIT_FETCH_SILENT: "true"
							});
						try {
							await this.run(t, r)
						} catch (e) {
							throw /No remote repository specified\./.test(e.stderr || "") ? e.gitErrorCode = "NoRemoteRepositorySpecified" : /Could not read from remote repository/.test(e.stderr || "") && (e.gitErrorCode = "RemoteConnectionError"),
							e
						}
					}
					async pull(e, t, r, n = {}) {
						const o = ["pull"];
						n.tags && o.push("--tags"),
						n.unshallow && o.push("--unshallow"),
						e && o.push("-r"),
						t && r && (o.push(t), o.push(r));
						try {
							await this.run(o, n)
						} catch (e) {
							throw /^CONFLICT \([^)]+\): \b/m.test(e.stdout || "") ? e.gitErrorCode = "Conflict" : /Please tell me who you are\./.test(e.stderr || "") ? e.gitErrorCode = "NoUserNameConfigured" : /Could not read from remote repository/.test(e.stderr || "") ? e.gitErrorCode = "RemoteConnectionError" : /Pull is not possible because you have unmerged files|Cannot pull with rebase: You have unstaged changes|Your local changes to the following files would be overwritten|Please, commit your changes before you can merge/i.test(e.stderr) ? (e.stderr = e.stderr.replace(/Cannot pull with rebase: You have unstaged changes/i, "Cannot pull with rebase, you have unstaged changes"), e.gitErrorCode = "DirtyWorkTree") : /cannot lock ref|unable to update local ref/i.test(e.stderr || "") ? e.gitErrorCode = "CantLockRef" : /cannot rebase onto multiple branches/i.test(e.stderr || "") && (e.gitErrorCode = "CantRebaseMultipleBranches"),
							e
						}
					}
					async push(e, t, r = !1, n = !1, o) {
						const i = ["push"];
						o === A.ForceWithLease ? i.push("--force-with-lease") : o === A.Force && i.push("--force"),
						r && i.push("-u"),
						n && i.push("--follow-tags"),
						e && i.push(e),
						t && i.push(t);
						try {
							await this.run(i)
						} catch (e) {
							throw /^error: failed to push some refs to\b/m.test(e.stderr || "") ? e.gitErrorCode = "PushRejected" : /Could not read from remote repository/.test(e.stderr || "") ? e.gitErrorCode = "RemoteConnectionError" : /^fatal: The current branch .* has no upstream branch/.test(e.stderr || "") && (e.gitErrorCode = "NoUpstreamBranch"),
							e
						}
					}
					async blame(e) {
						try {
							const t = ["blame"];
							return t.push(e),
							(await this.run(t)).stdout.trim()
						} catch (e) {
							throw /^fatal: no such path/.test(e.stderr || "") && (e.gitErrorCode = "NoPathFound"),
							e
						}
					}
					async createStash(e, t) {
						try {
							const r = ["stash", "push"];
							t && r.push("-u"),
							e && r.push("-m", e),
							await this.run(r)
						} catch (e) {
							throw /No local changes to save/.test(e.stderr || "") && (e.gitErrorCode = "NoLocalChanges"),
							e
						}
					}
					async popStash(e) {
						await this.popOrApplyStash(["stash", "pop"], e)
					}
					async applyStash(e) {
						await this.popOrApplyStash(["stash", "apply"], e)
					}
					async popOrApplyStash(e, t) {
						try {
							"number" == typeof t && e.push(`stash@{${t}}`),
							await this.run(e)
						} catch (e) {
							throw /No stash found/.test(e.stderr || "") ? e.gitErrorCode = "NoStashFound" : /error: Your local changes to the following files would be overwritten/.test(e.stderr || "") ? e.gitErrorCode = "LocalChangesOverwritten" : /^CONFLICT/m.test(e.stdout || "") && (e.gitErrorCode = "StashConflict"),
							e
						}
					}
					async dropStash(e) {
						const t = ["stash", "drop"];
						"number" == typeof e && t.push(`stash@{${e}}`);
						try {
							await this.run(t)
						} catch (e) {
							throw /No stash found/.test(e.stderr || "") && (e.gitErrorCode = "NoStashFound"),
							e
						}
					}
					getStatus(e = 5e3) {
						return new Promise((t, r) => {
							const n = new R,
							o = this.stream(["status", "-z", "-u"], {
									env: {
										GIT_OPTIONAL_LOCKS: "0"
									}
								}),
							i = e => {
								if (0 !== e) {
									const t = a.join("");
									return r(new k({
											message: "Failed to execute git",
											stderr: t,
											exitCode: e,
											gitErrorCode: T(t),
											gitCommand: "status"
										}))
								}
								t({
									status: n.status,
									didHitLimit: !1
								})
							},
							s = r => {
								n.update(r),
								n.status.length > e && (o.removeListener("exit", i), o.stdout.removeListener("data", s), o.kill(), t({
										status: n.status.slice(0, e),
										didHitLimit: !0
									}))
							};
							o.stdout.setEncoding("utf8"),
							o.stdout.on("data", s);
							const a = [];
							o.stderr.setEncoding("utf8"),
							o.stderr.on("data", e => a.push(e)),
							o.on("error", _(r)),
							o.on("exit", i)
						})
					}
					async getHEAD() {
						try {
							const e = await this.run(["symbolic-ref", "--short", "HEAD"]);
							if (!e.stdout)
								throw new Error("Not in a branch");
							return {
								name: e.stdout.trim(),
								commit: void 0,
								type: 0
							}
						} catch (e) {
							const t = await this.run(["rev-parse", "HEAD"]);
							if (!t.stdout)
								throw new Error("Error parsing HEAD");
							return {
								name: void 0,
								commit: t.stdout.trim(),
								type: 0
							}
						}
					}
					async findTrackingBranches(e) {
						return (await this.run(["for-each-ref", "--format", "%(refname:short)%00%(upstream:short)", "refs/heads"])).stdout.trim().split("\n").map(e => e.trim().split("\0")).filter(([t, r]) => r === e).map(([e]) => ({
								name: e,
								type: 0
							}))
					}
					async getRefs(e) {
						const t = ["for-each-ref", "--format", "%(refname) %(objectname)"];
						e && e.sort && "alphabetically" !== e.sort && t.push("--sort", `-${e.sort}`);
						return (await this.run(t)).stdout.trim().split("\n").filter(e => !!e).map(e => {
							let t;
							return (t = /^refs\/heads\/([^ ]+) ([0-9a-f]{40})$/.exec(e)) ? {
								name: t[1],
								commit: t[2],
								type: 0
							}
							 : (t = /^refs\/remotes\/([^/]+)\/([^ ]+) ([0-9a-f]{40})$/.exec(e)) ? {
								name: `${t[1]}/${t[2]}`,
								commit: t[3],
								type: 1,
								remote: t[1]
							}
							 : (t = /^refs\/tags\/([^ ]+) ([0-9a-f]{40})$/.exec(e)) ? {
								name: t[1],
								commit: t[2],
								type: 2
							}
							 : null
						}).filter(e => !!e)
					}
					async getStashes() {
						const e = /^stash@{(\d+)}:(.+)$/;
						return (await this.run(["stash", "list"])).stdout.trim().split("\n").filter(e => !!e).map(t => e.exec(t)).filter(e => !!e).map(([, e, t]) => ({
								index: parseInt(e),
								description: t
							}))
					}
					async getRemotes() {
						const e = (await this.run(["remote", "--verbose"])).stdout.trim().split("\n").filter(e => !!e),
						t = [];
						for (const r of e) {
							const e = r.split(/\s/),
							[n, o, i] = e;
							let s = t.find(e => e.name === n);
							s || (s = {
									name: n,
									isReadOnly: !1
								}, t.push(s)),
							/fetch/i.test(i) ? s.fetchUrl = o : /push/i.test(i) ? s.pushUrl = o : (s.fetchUrl = o, s.pushUrl = o),
							s.isReadOnly = void 0 === s.pushUrl || "no_push" === s.pushUrl
						}
						return t
					}
					async getBranch(e) {
						if ("HEAD" === e)
							return this.getHEAD();
						let t = await this.run(["rev-parse", e]);
						if (!t.stdout && /^@/.test(e)) {
							e = (await this.run(["rev-parse", "--symbolic-full-name", e])).stdout.trim(),
							t = await this.run(["rev-parse", e])
						}
						if (!t.stdout)
							return Promise.reject(new Error("No such branch"));
						const r = t.stdout.trim();
						try {
							const t = (await this.run(["rev-parse", "--symbolic-full-name", e + "@{u}"])).stdout.trim(),
							n = /^refs\/remotes\/([^/]+)\/(.+)$/.exec(t);
							if (!n)
								throw new Error(`Could not parse upstream branch: ${t}`);
							const o = {
								remote: n[1],
								name: n[2]
							},
							i = await this.run(["rev-list", "--left-right", e + "..." + t]);
							let s = 0,
							a = 0,
							c = 0;
							for (; c < i.stdout.length; ) {
								switch (i.stdout.charAt(c)) {
								case "<":
									s++;
									break;
								case ">":
									a++;
									break;
								default:
									c++
								}
								for (; "\n" !== i.stdout.charAt(c++); );
							}
							return {
								name: e,
								type: 0,
								commit: r,
								upstream: o,
								ahead: s,
								behind: a
							}
						} catch (t) {
							return {
								name: e,
								type: 0,
								commit: r
							}
						}
					}
					cleanupCommitEditMessage(e) {
						return /^\s*#[^\n]*$/.test(e) ? e : e.replace(/^\s*#.*$\n?/gm, "").trim()
					}
					async getMergeMessage() {
						const e = o.join(this.repositoryRoot, ".git", "MERGE_MSG");
						try {
							return (await y(e, "utf8")).trim()
						} catch (e) {
							return
						}
					}
					async getCommitTemplate() {
						try {
							const e = await this.run(["config", "--get", "commit.template"]);
							if (!e.stdout)
								return "";
							const t = i.homedir();
							let r = e.stdout.trim().replace(/^~([^\/]*)\//, (e, r) => `${r?o.join(o.dirname(t),r):t}/`);
							return o.isAbsolute(r) || (r = o.join(this.repositoryRoot, r)),
							(await y(r, "utf8")).trim()
						} catch (e) {
							return ""
						}
					}
					async getCommit(e) {
						return x((await this.run(["show", "-s", `--format=${E}`, e])).stdout) || Promise.reject("bad commit format")
					}
					async updateSubmodules(e) {
						const t = ["submodule", "update", "--"];
						for (const r of h.splitInChunks(e, m))
							await this.run([...t, ...r])
					}
					async getSubmodules() {
						const e = o.join(this.root, ".gitmodules");
						try {
							return P(await y(e, "utf8"))
						} catch (e) {
							if (/ENOENT/.test(e.message))
								return [];
							throw e
						}
					}
				}
				t.Repository = O
			}, function (e, t) {
				e.exports = require("events")
			}, function (e) {
				e.exports = [["0", "\0", 127, "€"], ["8140", "丂丄丅丆丏丒丗丟丠両丣並丩丮丯丱丳丵丷丼乀乁乂乄乆乊乑乕乗乚乛乢乣乤乥乧乨乪", 5, "乲乴", 9, "乿", 6, "亇亊"], ["8180", "亐亖亗亙亜亝亞亣亪亯亰亱亴亶亷亸亹亼亽亾仈仌仏仐仒仚仛仜仠仢仦仧仩仭仮仯仱仴仸仹仺仼仾伀伂", 6, "伋伌伒", 4, "伜伝伡伣伨伩伬伭伮伱伳伵伷伹伻伾", 4, "佄佅佇", 5, "佒佔佖佡佢佦佨佪佫佭佮佱佲併佷佸佹佺佽侀侁侂侅來侇侊侌侎侐侒侓侕侖侘侙侚侜侞侟価侢"], ["8240", "侤侫侭侰", 4, "侶", 8, "俀俁係俆俇俈俉俋俌俍俒", 4, "俙俛俠俢俤俥俧俫俬俰俲俴俵俶俷俹俻俼俽俿", 11], ["8280", "個倎倐們倓倕倖倗倛倝倞倠倢倣値倧倫倯", 10, "倻倽倿偀偁偂偄偅偆偉偊偋偍偐", 4, "偖偗偘偙偛偝", 7, "偦", 5, "偭", 8, "偸偹偺偼偽傁傂傃傄傆傇傉傊傋傌傎", 20, "傤傦傪傫傭", 4, "傳", 6, "傼"], ["8340", "傽", 17, "僐", 5, "僗僘僙僛", 10, "僨僩僪僫僯僰僱僲僴僶", 4, "僼", 9, "儈"], ["8380", "儉儊儌", 5, "儓", 13, "儢", 28, "兂兇兊兌兎兏児兒兓兗兘兙兛兝", 4, "兣兤兦內兩兪兯兲兺兾兿冃冄円冇冊冋冎冏冐冑冓冔冘冚冝冞冟冡冣冦", 4, "冭冮冴冸冹冺冾冿凁凂凃凅凈凊凍凎凐凒", 5], ["8440", "凘凙凚凜凞凟凢凣凥", 5, "凬凮凱凲凴凷凾刄刅刉刋刌刏刐刓刔刕刜刞刟刡刢刣別刦刧刪刬刯刱刲刴刵刼刾剄", 5, "剋剎剏剒剓剕剗剘"], ["8480", "剙剚剛剝剟剠剢剣剤剦剨剫剬剭剮剰剱剳", 9, "剾劀劃", 4, "劉", 6, "劑劒劔", 6, "劜劤劥劦劧劮劯劰労", 9, "勀勁勂勄勅勆勈勊勌勍勎勏勑勓勔動勗務", 5, "勠勡勢勣勥", 10, "勱", 7, "勻勼勽匁匂匃匄匇匉匊匋匌匎"], ["8540", "匑匒匓匔匘匛匜匞匟匢匤匥匧匨匩匫匬匭匯", 9, "匼匽區卂卄卆卋卌卍卐協単卙卛卝卥卨卪卬卭卲卶卹卻卼卽卾厀厁厃厇厈厊厎厏"], ["8580", "厐", 4, "厖厗厙厛厜厞厠厡厤厧厪厫厬厭厯", 6, "厷厸厹厺厼厽厾叀參", 4, "収叏叐叒叓叕叚叜叝叞叡叢叧叴叺叾叿吀吂吅吇吋吔吘吙吚吜吢吤吥吪吰吳吶吷吺吽吿呁呂呄呅呇呉呌呍呎呏呑呚呝", 4, "呣呥呧呩", 7, "呴呹呺呾呿咁咃咅咇咈咉咊咍咑咓咗咘咜咞咟咠咡"], ["8640", "咢咥咮咰咲咵咶咷咹咺咼咾哃哅哊哋哖哘哛哠", 4, "哫哬哯哰哱哴", 5, "哻哾唀唂唃唄唅唈唊", 4, "唒唓唕", 5, "唜唝唞唟唡唥唦"], ["8680", "唨唩唫唭唲唴唵唶唸唹唺唻唽啀啂啅啇啈啋", 4, "啑啒啓啔啗", 4, "啝啞啟啠啢啣啨啩啫啯", 5, "啹啺啽啿喅喆喌喍喎喐喒喓喕喖喗喚喛喞喠", 6, "喨", 8, "喲喴営喸喺喼喿", 4, "嗆嗇嗈嗊嗋嗎嗏嗐嗕嗗", 4, "嗞嗠嗢嗧嗩嗭嗮嗰嗱嗴嗶嗸", 4, "嗿嘂嘃嘄嘅"], ["8740", "嘆嘇嘊嘋嘍嘐", 7, "嘙嘚嘜嘝嘠嘡嘢嘥嘦嘨嘩嘪嘫嘮嘯嘰嘳嘵嘷嘸嘺嘼嘽嘾噀", 11, "噏", 4, "噕噖噚噛噝", 4], ["8780", "噣噥噦噧噭噮噯噰噲噳噴噵噷噸噹噺噽", 7, "嚇", 6, "嚐嚑嚒嚔", 14, "嚤", 10, "嚰", 6, "嚸嚹嚺嚻嚽", 12, "囋", 8, "囕囖囘囙囜団囥", 5, "囬囮囯囲図囶囷囸囻囼圀圁圂圅圇國", 6], ["8840", "園", 9, "圝圞圠圡圢圤圥圦圧圫圱圲圴", 4, "圼圽圿坁坃坄坅坆坈坉坋坒", 4, "坘坙坢坣坥坧坬坮坰坱坲坴坵坸坹坺坽坾坿垀"], ["8880", "垁垇垈垉垊垍", 4, "垔", 6, "垜垝垞垟垥垨垪垬垯垰垱垳垵垶垷垹", 8, "埄", 6, "埌埍埐埑埓埖埗埛埜埞埡埢埣埥", 7, "埮埰埱埲埳埵埶執埻埼埾埿堁堃堄堅堈堉堊堌堎堏堐堒堓堔堖堗堘堚堛堜堝堟堢堣堥", 4, "堫", 4, "報堲堳場堶", 7], ["8940", "堾", 5, "塅", 6, "塎塏塐塒塓塕塖塗塙", 4, "塟", 5, "塦", 4, "塭", 16, "塿墂墄墆墇墈墊墋墌"], ["8980", "墍", 4, "墔", 4, "墛墜墝墠", 7, "墪", 17, "墽墾墿壀壂壃壄壆", 10, "壒壓壔壖", 13, "壥", 5, "壭壯壱売壴壵壷壸壺", 7, "夃夅夆夈", 4, "夎夐夑夒夓夗夘夛夝夞夠夡夢夣夦夨夬夰夲夳夵夶夻"], ["8a40", "夽夾夿奀奃奅奆奊奌奍奐奒奓奙奛", 4, "奡奣奤奦", 12, "奵奷奺奻奼奾奿妀妅妉妋妌妎妏妐妑妔妕妘妚妛妜妝妟妠妡妢妦"], ["8a80", "妧妬妭妰妱妳", 5, "妺妼妽妿", 6, "姇姈姉姌姍姎姏姕姖姙姛姞", 4, "姤姦姧姩姪姫姭", 11, "姺姼姽姾娀娂娊娋娍娎娏娐娒娔娕娖娗娙娚娛娝娞娡娢娤娦娧娨娪", 6, "娳娵娷", 4, "娽娾娿婁", 4, "婇婈婋", 9, "婖婗婘婙婛", 5], ["8b40", "婡婣婤婥婦婨婩婫", 8, "婸婹婻婼婽婾媀", 17, "媓", 6, "媜", 13, "媫媬"], ["8b80", "媭", 4, "媴媶媷媹", 4, "媿嫀嫃", 5, "嫊嫋嫍", 4, "嫓嫕嫗嫙嫚嫛嫝嫞嫟嫢嫤嫥嫧嫨嫪嫬", 4, "嫲", 22, "嬊", 11, "嬘", 25, "嬳嬵嬶嬸", 7, "孁", 6], ["8c40", "孈", 7, "孒孖孞孠孡孧孨孫孭孮孯孲孴孶孷學孹孻孼孾孿宂宆宊宍宎宐宑宒宔宖実宧宨宩宬宭宮宯宱宲宷宺宻宼寀寁寃寈寉寊寋寍寎寏"], ["8c80", "寑寔", 8, "寠寢寣實寧審", 4, "寯寱", 6, "寽対尀専尃尅將專尋尌對導尐尒尓尗尙尛尞尟尠尡尣尦尨尩尪尫尭尮尯尰尲尳尵尶尷屃屄屆屇屌屍屒屓屔屖屗屘屚屛屜屝屟屢層屧", 6, "屰屲", 6, "屻屼屽屾岀岃", 4, "岉岊岋岎岏岒岓岕岝", 4, "岤", 4], ["8d40", "岪岮岯岰岲岴岶岹岺岻岼岾峀峂峃峅", 5, "峌", 5, "峓", 5, "峚", 6, "峢峣峧峩峫峬峮峯峱", 9, "峼", 4], ["8d80", "崁崄崅崈", 5, "崏", 4, "崕崗崘崙崚崜崝崟", 4, "崥崨崪崫崬崯", 4, "崵", 7, "崿", 7, "嵈嵉嵍", 10, "嵙嵚嵜嵞", 10, "嵪嵭嵮嵰嵱嵲嵳嵵", 12, "嶃", 21, "嶚嶛嶜嶞嶟嶠"], ["8e40", "嶡", 21, "嶸", 12, "巆", 6, "巎", 12, "巜巟巠巣巤巪巬巭"], ["8e80", "巰巵巶巸", 4, "巿帀帄帇帉帊帋帍帎帒帓帗帞", 7, "帨", 4, "帯帰帲", 4, "帹帺帾帿幀幁幃幆", 5, "幍", 6, "幖", 4, "幜幝幟幠幣", 14, "幵幷幹幾庁庂広庅庈庉庌庍庎庒庘庛庝庡庢庣庤庨", 4, "庮", 4, "庴庺庻庼庽庿", 6], ["8f40", "廆廇廈廋", 5, "廔廕廗廘廙廚廜", 11, "廩廫", 8, "廵廸廹廻廼廽弅弆弇弉弌弍弎弐弒弔弖弙弚弜弝弞弡弢弣弤"], ["8f80", "弨弫弬弮弰弲", 6, "弻弽弾弿彁", 14, "彑彔彙彚彛彜彞彟彠彣彥彧彨彫彮彯彲彴彵彶彸彺彽彾彿徃徆徍徎徏徑従徔徖徚徛徝從徟徠徢", 5, "復徫徬徯", 5, "徶徸徹徺徻徾", 4, "忇忈忊忋忎忓忔忕忚忛応忞忟忢忣忥忦忨忩忬忯忰忲忳忴忶忷忹忺忼怇"], ["9040", "怈怉怋怌怐怑怓怗怘怚怞怟怢怣怤怬怭怮怰", 4, "怶", 4, "怽怾恀恄", 6, "恌恎恏恑恓恔恖恗恘恛恜恞恟恠恡恥恦恮恱恲恴恵恷恾悀"], ["9080", "悁悂悅悆悇悈悊悋悎悏悐悑悓悕悗悘悙悜悞悡悢悤悥悧悩悪悮悰悳悵悶悷悹悺悽", 7, "惇惈惉惌", 4, "惒惓惔惖惗惙惛惞惡", 4, "惪惱惲惵惷惸惻", 4, "愂愃愄愅愇愊愋愌愐", 4, "愖愗愘愙愛愜愝愞愡愢愥愨愩愪愬", 18, "慀", 6], ["9140", "慇慉態慍慏慐慒慓慔慖", 6, "慞慟慠慡慣慤慥慦慩", 6, "慱慲慳慴慶慸", 18, "憌憍憏", 4, "憕"], ["9180", "憖", 6, "憞", 8, "憪憫憭", 9, "憸", 5, "憿懀懁懃", 4, "應懌", 4, "懓懕", 16, "懧", 13, "懶", 8, "戀", 5, "戇戉戓戔戙戜戝戞戠戣戦戧戨戩戫戭戯戰戱戲戵戶戸", 4, "扂扄扅扆扊"], ["9240", "扏扐払扖扗扙扚扜", 6, "扤扥扨扱扲扴扵扷扸扺扻扽抁抂抃抅抆抇抈抋", 5, "抔抙抜抝択抣抦抧抩抪抭抮抯抰抲抳抴抶抷抸抺抾拀拁"], ["9280", "拃拋拏拑拕拝拞拠拡拤拪拫拰拲拵拸拹拺拻挀挃挄挅挆挊挋挌挍挏挐挒挓挔挕挗挘挙挜挦挧挩挬挭挮挰挱挳", 5, "挻挼挾挿捀捁捄捇捈捊捑捒捓捔捖", 7, "捠捤捥捦捨捪捫捬捯捰捲捳捴捵捸捹捼捽捾捿掁掃掄掅掆掋掍掑掓掔掕掗掙", 6, "採掤掦掫掯掱掲掵掶掹掻掽掿揀"], ["9340", "揁揂揃揅揇揈揊揋揌揑揓揔揕揗", 6, "揟揢揤", 4, "揫揬揮揯揰揱揳揵揷揹揺揻揼揾搃搄搆", 4, "損搎搑搒搕", 5, "搝搟搢搣搤"], ["9380", "搥搧搨搩搫搮", 5, "搵", 4, "搻搼搾摀摂摃摉摋", 6, "摓摕摖摗摙", 4, "摟", 7, "摨摪摫摬摮", 9, "摻", 6, "撃撆撈", 8, "撓撔撗撘撚撛撜撝撟", 4, "撥撦撧撨撪撫撯撱撲撳撴撶撹撻撽撾撿擁擃擄擆", 6, "擏擑擓擔擕擖擙據"], ["9440", "擛擜擝擟擠擡擣擥擧", 24, "攁", 7, "攊", 7, "攓", 4, "攙", 8], ["9480", "攢攣攤攦", 4, "攬攭攰攱攲攳攷攺攼攽敀", 4, "敆敇敊敋敍敎敐敒敓敔敗敘敚敜敟敠敡敤敥敧敨敩敪敭敮敯敱敳敵敶數", 14, "斈斉斊斍斎斏斒斔斕斖斘斚斝斞斠斢斣斦斨斪斬斮斱", 7, "斺斻斾斿旀旂旇旈旉旊旍旐旑旓旔旕旘", 7, "旡旣旤旪旫"], ["9540", "旲旳旴旵旸旹旻", 4, "昁昄昅昇昈昉昋昍昐昑昒昖昗昘昚昛昜昞昡昢昣昤昦昩昪昫昬昮昰昲昳昷", 4, "昽昿晀時晄", 6, "晍晎晐晑晘"], ["9580", "晙晛晜晝晞晠晢晣晥晧晩", 4, "晱晲晳晵晸晹晻晼晽晿暀暁暃暅暆暈暉暊暋暍暎暏暐暒暓暔暕暘", 4, "暞", 8, "暩", 4, "暯", 4, "暵暶暷暸暺暻暼暽暿", 25, "曚曞", 7, "曧曨曪", 5, "曱曵曶書曺曻曽朁朂會"], ["9640", "朄朅朆朇朌朎朏朑朒朓朖朘朙朚朜朞朠", 5, "朧朩朮朰朲朳朶朷朸朹朻朼朾朿杁杄杅杇杊杋杍杒杔杕杗", 4, "杝杢杣杤杦杧杫杬杮東杴杶"], ["9680", "杸杹杺杻杽枀枂枃枅枆枈枊枌枍枎枏枑枒枓枔枖枙枛枟枠枡枤枦枩枬枮枱枲枴枹", 7, "柂柅", 9, "柕柖柗柛柟柡柣柤柦柧柨柪柫柭柮柲柵", 7, "柾栁栂栃栄栆栍栐栒栔栕栘", 4, "栞栟栠栢", 6, "栫", 6, "栴栵栶栺栻栿桇桋桍桏桒桖", 5], ["9740", "桜桝桞桟桪桬", 7, "桵桸", 8, "梂梄梇", 7, "梐梑梒梔梕梖梘", 9, "梣梤梥梩梪梫梬梮梱梲梴梶梷梸"], ["9780", "梹", 6, "棁棃", 5, "棊棌棎棏棐棑棓棔棖棗棙棛", 4, "棡棢棤", 9, "棯棲棳棴棶棷棸棻棽棾棿椀椂椃椄椆", 4, "椌椏椑椓", 11, "椡椢椣椥", 7, "椮椯椱椲椳椵椶椷椸椺椻椼椾楀楁楃", 16, "楕楖楘楙楛楜楟"], ["9840", "楡楢楤楥楧楨楩楪楬業楯楰楲", 4, "楺楻楽楾楿榁榃榅榊榋榌榎", 5, "榖榗榙榚榝", 9, "榩榪榬榮榯榰榲榳榵榶榸榹榺榼榽"], ["9880", "榾榿槀槂", 7, "構槍槏槑槒槓槕", 5, "槜槝槞槡", 11, "槮槯槰槱槳", 9, "槾樀", 9, "樋", 11, "標", 5, "樠樢", 5, "権樫樬樭樮樰樲樳樴樶", 6, "樿", 4, "橅橆橈", 7, "橑", 6, "橚"], ["9940", "橜", 4, "橢橣橤橦", 10, "橲", 6, "橺橻橽橾橿檁檂檃檅", 8, "檏檒", 4, "檘", 7, "檡", 5], ["9980", "檧檨檪檭", 114, "欥欦欨", 6], ["9a40", "欯欰欱欳欴欵欶欸欻欼欽欿歀歁歂歄歅歈歊歋歍", 11, "歚", 7, "歨歩歫", 13, "歺歽歾歿殀殅殈"], ["9a80", "殌殎殏殐殑殔殕殗殘殙殜", 4, "殢", 7, "殫", 7, "殶殸", 6, "毀毃毄毆", 4, "毌毎毐毑毘毚毜", 4, "毢", 7, "毬毭毮毰毱毲毴毶毷毸毺毻毼毾", 6, "氈", 4, "氎氒気氜氝氞氠氣氥氫氬氭氱氳氶氷氹氺氻氼氾氿汃汄汅汈汋", 4, "汑汒汓汖汘"], ["9b40", "汙汚汢汣汥汦汧汫", 4, "汱汳汵汷汸決汻汼汿沀沄沇沊沋沍沎沑沒沕沖沗沘沚沜沝沞沠沢沨沬沯沰沴沵沶沷沺泀況泂泃泆泇泈泋泍泎泏泑泒泘"], ["9b80", "泙泚泜泝泟泤泦泧泩泬泭泲泴泹泿洀洂洃洅洆洈洉洊洍洏洐洑洓洔洕洖洘洜洝洟", 5, "洦洨洩洬洭洯洰洴洶洷洸洺洿浀浂浄浉浌浐浕浖浗浘浛浝浟浡浢浤浥浧浨浫浬浭浰浱浲浳浵浶浹浺浻浽", 4, "涃涄涆涇涊涋涍涏涐涒涖", 4, "涜涢涥涬涭涰涱涳涴涶涷涹", 5, "淁淂淃淈淉淊"], ["9c40", "淍淎淏淐淒淓淔淕淗淚淛淜淟淢淣淥淧淨淩淪淭淯淰淲淴淵淶淸淺淽", 7, "渆渇済渉渋渏渒渓渕渘渙減渜渞渟渢渦渧渨渪測渮渰渱渳渵"], ["9c80", "渶渷渹渻", 7, "湅", 7, "湏湐湑湒湕湗湙湚湜湝湞湠", 10, "湬湭湯", 14, "満溁溂溄溇溈溊", 4, "溑", 6, "溙溚溛溝溞溠溡溣溤溦溨溩溫溬溭溮溰溳溵溸溹溼溾溿滀滃滄滅滆滈滉滊滌滍滎滐滒滖滘滙滛滜滝滣滧滪", 5], ["9d40", "滰滱滲滳滵滶滷滸滺", 7, "漃漄漅漇漈漊", 4, "漐漑漒漖", 9, "漡漢漣漥漦漧漨漬漮漰漲漴漵漷", 6, "漿潀潁潂"], ["9d80", "潃潄潅潈潉潊潌潎", 9, "潙潚潛潝潟潠潡潣潤潥潧", 5, "潯潰潱潳潵潶潷潹潻潽", 6, "澅澆澇澊澋澏", 12, "澝澞澟澠澢", 4, "澨", 10, "澴澵澷澸澺", 5, "濁濃", 5, "濊", 6, "濓", 10, "濟濢濣濤濥"], ["9e40", "濦", 7, "濰", 32, "瀒", 7, "瀜", 6, "瀤", 6], ["9e80", "瀫", 9, "瀶瀷瀸瀺", 17, "灍灎灐", 13, "灟", 11, "灮灱灲灳灴灷灹灺灻災炁炂炃炄炆炇炈炋炌炍炏炐炑炓炗炘炚炛炞", 12, "炰炲炴炵炶為炾炿烄烅烆烇烉烋", 12, "烚"], ["9f40", "烜烝烞烠烡烢烣烥烪烮烰", 6, "烸烺烻烼烾", 10, "焋", 4, "焑焒焔焗焛", 10, "焧", 7, "焲焳焴"], ["9f80", "焵焷", 13, "煆煇煈煉煋煍煏", 12, "煝煟", 4, "煥煩", 4, "煯煰煱煴煵煶煷煹煻煼煾", 5, "熅", 4, "熋熌熍熎熐熑熒熓熕熖熗熚", 4, "熡", 6, "熩熪熫熭", 5, "熴熶熷熸熺", 8, "燄", 9, "燏", 4], ["a040", "燖", 9, "燡燢燣燤燦燨", 5, "燯", 9, "燺", 11, "爇", 19], ["a080", "爛爜爞", 9, "爩爫爭爮爯爲爳爴爺爼爾牀", 6, "牉牊牋牎牏牐牑牓牔牕牗牘牚牜牞牠牣牤牥牨牪牫牬牭牰牱牳牴牶牷牸牻牼牽犂犃犅", 4, "犌犎犐犑犓", 11, "犠", 11, "犮犱犲犳犵犺", 6, "狅狆狇狉狊狋狌狏狑狓狔狕狖狘狚狛"], ["a1a1", "　、。·ˉˇ¨〃々—～‖…‘’“”〔〕〈", 7, "〖〗【】±×÷∶∧∨∑∏∪∩∈∷√⊥∥∠⌒⊙∫∮≡≌≈∽∝≠≮≯≤≥∞∵∴♂♀°′″℃＄¤￠￡‰§№☆★○●◎◇◆□■△▲※→←↑↓〓"], ["a2a1", "ⅰ", 9], ["a2b1", "⒈", 19, "⑴", 19, "①", 9], ["a2e5", "㈠", 9], ["a2f1", "Ⅰ", 11], ["a3a1", "！＂＃￥％", 88, "￣"], ["a4a1", "ぁ", 82], ["a5a1", "ァ", 85], ["a6a1", "Α", 16, "Σ", 6], ["a6c1", "α", 16, "σ", 6], ["a6e0", "︵︶︹︺︿﹀︽︾﹁﹂﹃﹄"], ["a6ee", "︻︼︷︸︱"], ["a6f4", "︳︴"], ["a7a1", "А", 5, "ЁЖ", 25], ["a7d1", "а", 5, "ёж", 25], ["a840", "ˊˋ˙–―‥‵℅℉↖↗↘↙∕∟∣≒≦≧⊿═", 35, "▁", 6], ["a880", "█", 7, "▓▔▕▼▽◢◣◤◥☉⊕〒〝〞"], ["a8a1", "āáǎàēéěèīíǐìōóǒòūúǔùǖǘǚǜüêɑ"], ["a8bd", "ńň"], ["a8c0", "ɡ"], ["a8c5", "ㄅ", 36], ["a940", "〡", 8, "㊣㎎㎏㎜㎝㎞㎡㏄㏎㏑㏒㏕︰￢￤"], ["a959", "℡㈱"], ["a95c", "‐"], ["a960", "ー゛゜ヽヾ〆ゝゞ﹉", 9, "﹔﹕﹖﹗﹙", 8], ["a980", "﹢", 4, "﹨﹩﹪﹫"], ["a996", "〇"], ["a9a4", "─", 75], ["aa40", "狜狝狟狢", 5, "狪狫狵狶狹狽狾狿猀猂猄", 5, "猋猌猍猏猐猑猒猔猘猙猚猟猠猣猤猦猧猨猭猯猰猲猳猵猶猺猻猼猽獀", 8], ["aa80", "獉獊獋獌獎獏獑獓獔獕獖獘", 7, "獡", 10, "獮獰獱"], ["ab40", "獲", 11, "獿", 4, "玅玆玈玊玌玍玏玐玒玓玔玕玗玘玙玚玜玝玞玠玡玣", 5, "玪玬玭玱玴玵玶玸玹玼玽玾玿珁珃", 4], ["ab80", "珋珌珎珒", 6, "珚珛珜珝珟珡珢珣珤珦珨珪珫珬珮珯珰珱珳", 4], ["ac40", "珸", 10, "琄琇琈琋琌琍琎琑", 8, "琜", 5, "琣琤琧琩琫琭琯琱琲琷", 4, "琽琾琿瑀瑂", 11], ["ac80", "瑎", 6, "瑖瑘瑝瑠", 12, "瑮瑯瑱", 4, "瑸瑹瑺"], ["ad40", "瑻瑼瑽瑿璂璄璅璆璈璉璊璌璍璏璑", 10, "璝璟", 7, "璪", 15, "璻", 12], ["ad80", "瓈", 9, "瓓", 8, "瓝瓟瓡瓥瓧", 6, "瓰瓱瓲"], ["ae40", "瓳瓵瓸", 6, "甀甁甂甃甅", 7, "甎甐甒甔甕甖甗甛甝甞甠", 4, "甦甧甪甮甴甶甹甼甽甿畁畂畃畄畆畇畉畊畍畐畑畒畓畕畖畗畘"], ["ae80", "畝", 7, "畧畨畩畫", 6, "畳畵當畷畺", 4, "疀疁疂疄疅疇"], ["af40", "疈疉疊疌疍疎疐疓疕疘疛疜疞疢疦", 4, "疭疶疷疺疻疿痀痁痆痋痌痎痏痐痑痓痗痙痚痜痝痟痠痡痥痩痬痭痮痯痲痳痵痶痷痸痺痻痽痾瘂瘄瘆瘇"], ["af80", "瘈瘉瘋瘍瘎瘏瘑瘒瘓瘔瘖瘚瘜瘝瘞瘡瘣瘧瘨瘬瘮瘯瘱瘲瘶瘷瘹瘺瘻瘽癁療癄"], ["b040", "癅", 6, "癎", 5, "癕癗", 4, "癝癟癠癡癢癤", 6, "癬癭癮癰", 7, "癹発發癿皀皁皃皅皉皊皌皍皏皐皒皔皕皗皘皚皛"], ["b080", "皜", 7, "皥", 8, "皯皰皳皵", 9, "盀盁盃啊阿埃挨哎唉哀皑癌蔼矮艾碍爱隘鞍氨安俺按暗岸胺案肮昂盎凹敖熬翱袄傲奥懊澳芭捌扒叭吧笆八疤巴拔跋靶把耙坝霸罢爸白柏百摆佰败拜稗斑班搬扳般颁板版扮拌伴瓣半办绊邦帮梆榜膀绑棒磅蚌镑傍谤苞胞包褒剥"], ["b140", "盄盇盉盋盌盓盕盙盚盜盝盞盠", 4, "盦", 7, "盰盳盵盶盷盺盻盽盿眀眂眃眅眆眊県眎", 10, "眛眜眝眞眡眣眤眥眧眪眫"], ["b180", "眬眮眰", 4, "眹眻眽眾眿睂睄睅睆睈", 7, "睒", 7, "睜薄雹保堡饱宝抱报暴豹鲍爆杯碑悲卑北辈背贝钡倍狈备惫焙被奔苯本笨崩绷甭泵蹦迸逼鼻比鄙笔彼碧蓖蔽毕毙毖币庇痹闭敝弊必辟壁臂避陛鞭边编贬扁便变卞辨辩辫遍标彪膘表鳖憋别瘪彬斌濒滨宾摈兵冰柄丙秉饼炳"], ["b240", "睝睞睟睠睤睧睩睪睭", 11, "睺睻睼瞁瞂瞃瞆", 5, "瞏瞐瞓", 11, "瞡瞣瞤瞦瞨瞫瞭瞮瞯瞱瞲瞴瞶", 4], ["b280", "瞼瞾矀", 12, "矎", 8, "矘矙矚矝", 4, "矤病并玻菠播拨钵波博勃搏铂箔伯帛舶脖膊渤泊驳捕卜哺补埠不布步簿部怖擦猜裁材才财睬踩采彩菜蔡餐参蚕残惭惨灿苍舱仓沧藏操糙槽曹草厕策侧册测层蹭插叉茬茶查碴搽察岔差诧拆柴豺搀掺蝉馋谗缠铲产阐颤昌猖"], ["b340", "矦矨矪矯矰矱矲矴矵矷矹矺矻矼砃", 5, "砊砋砎砏砐砓砕砙砛砞砠砡砢砤砨砪砫砮砯砱砲砳砵砶砽砿硁硂硃硄硆硈硉硊硋硍硏硑硓硔硘硙硚"], ["b380", "硛硜硞", 11, "硯", 7, "硸硹硺硻硽", 6, "场尝常长偿肠厂敞畅唱倡超抄钞朝嘲潮巢吵炒车扯撤掣彻澈郴臣辰尘晨忱沉陈趁衬撑称城橙成呈乘程惩澄诚承逞骋秤吃痴持匙池迟弛驰耻齿侈尺赤翅斥炽充冲虫崇宠抽酬畴踌稠愁筹仇绸瞅丑臭初出橱厨躇锄雏滁除楚"], ["b440", "碄碅碆碈碊碋碏碐碒碔碕碖碙碝碞碠碢碤碦碨", 7, "碵碶碷碸確碻碼碽碿磀磂磃磄磆磇磈磌磍磎磏磑磒磓磖磗磘磚", 9], ["b480", "磤磥磦磧磩磪磫磭", 4, "磳磵磶磸磹磻", 5, "礂礃礄礆", 6, "础储矗搐触处揣川穿椽传船喘串疮窗幢床闯创吹炊捶锤垂春椿醇唇淳纯蠢戳绰疵茨磁雌辞慈瓷词此刺赐次聪葱囱匆从丛凑粗醋簇促蹿篡窜摧崔催脆瘁粹淬翠村存寸磋撮搓措挫错搭达答瘩打大呆歹傣戴带殆代贷袋待逮"], ["b540", "礍", 5, "礔", 9, "礟", 4, "礥", 14, "礵", 4, "礽礿祂祃祄祅祇祊", 8, "祔祕祘祙祡祣"], ["b580", "祤祦祩祪祫祬祮祰", 6, "祹祻", 4, "禂禃禆禇禈禉禋禌禍禎禐禑禒怠耽担丹单郸掸胆旦氮但惮淡诞弹蛋当挡党荡档刀捣蹈倒岛祷导到稻悼道盗德得的蹬灯登等瞪凳邓堤低滴迪敌笛狄涤翟嫡抵底地蒂第帝弟递缔颠掂滇碘点典靛垫电佃甸店惦奠淀殿碉叼雕凋刁掉吊钓调跌爹碟蝶迭谍叠"], ["b640", "禓", 6, "禛", 11, "禨", 10, "禴", 4, "禼禿秂秄秅秇秈秊秌秎秏秐秓秔秖秗秙", 5, "秠秡秢秥秨秪"], ["b680", "秬秮秱", 6, "秹秺秼秾秿稁稄稅稇稈稉稊稌稏", 4, "稕稖稘稙稛稜丁盯叮钉顶鼎锭定订丢东冬董懂动栋侗恫冻洞兜抖斗陡豆逗痘都督毒犊独读堵睹赌杜镀肚度渡妒端短锻段断缎堆兑队对墩吨蹲敦顿囤钝盾遁掇哆多夺垛躲朵跺舵剁惰堕蛾峨鹅俄额讹娥恶厄扼遏鄂饿恩而儿耳尔饵洱二"], ["b740", "稝稟稡稢稤", 14, "稴稵稶稸稺稾穀", 5, "穇", 9, "穒", 4, "穘", 16], ["b780", "穩", 6, "穱穲穳穵穻穼穽穾窂窅窇窉窊窋窌窎窏窐窓窔窙窚窛窞窡窢贰发罚筏伐乏阀法珐藩帆番翻樊矾钒繁凡烦反返范贩犯饭泛坊芳方肪房防妨仿访纺放菲非啡飞肥匪诽吠肺废沸费芬酚吩氛分纷坟焚汾粉奋份忿愤粪丰封枫蜂峰锋风疯烽逢冯缝讽奉凤佛否夫敷肤孵扶拂辐幅氟符伏俘服"], ["b840", "窣窤窧窩窪窫窮", 4, "窴", 10, "竀", 10, "竌", 9, "竗竘竚竛竜竝竡竢竤竧", 5, "竮竰竱竲竳"], ["b880", "竴", 4, "竻竼竾笀笁笂笅笇笉笌笍笎笐笒笓笖笗笘笚笜笝笟笡笢笣笧笩笭浮涪福袱弗甫抚辅俯釜斧脯腑府腐赴副覆赋复傅付阜父腹负富讣附妇缚咐噶嘎该改概钙盖溉干甘杆柑竿肝赶感秆敢赣冈刚钢缸肛纲岗港杠篙皋高膏羔糕搞镐稿告哥歌搁戈鸽胳疙割革葛格蛤阁隔铬个各给根跟耕更庚羹"], ["b940", "笯笰笲笴笵笶笷笹笻笽笿", 5, "筆筈筊筍筎筓筕筗筙筜筞筟筡筣", 10, "筯筰筳筴筶筸筺筼筽筿箁箂箃箄箆", 6, "箎箏"], ["b980", "箑箒箓箖箘箙箚箛箞箟箠箣箤箥箮箯箰箲箳箵箶箷箹", 7, "篂篃範埂耿梗工攻功恭龚供躬公宫弓巩汞拱贡共钩勾沟苟狗垢构购够辜菇咕箍估沽孤姑鼓古蛊骨谷股故顾固雇刮瓜剐寡挂褂乖拐怪棺关官冠观管馆罐惯灌贯光广逛瑰规圭硅归龟闺轨鬼诡癸桂柜跪贵刽辊滚棍锅郭国果裹过哈"], ["ba40", "篅篈築篊篋篍篎篏篐篒篔", 4, "篛篜篞篟篠篢篣篤篧篨篩篫篬篭篯篰篲", 4, "篸篹篺篻篽篿", 7, "簈簉簊簍簎簐", 5, "簗簘簙"], ["ba80", "簚", 4, "簠", 5, "簨簩簫", 12, "簹", 5, "籂骸孩海氦亥害骇酣憨邯韩含涵寒函喊罕翰撼捍旱憾悍焊汗汉夯杭航壕嚎豪毫郝好耗号浩呵喝荷菏核禾和何合盒貉阂河涸赫褐鹤贺嘿黑痕很狠恨哼亨横衡恒轰哄烘虹鸿洪宏弘红喉侯猴吼厚候后呼乎忽瑚壶葫胡蝴狐糊湖"], ["bb40", "籃", 9, "籎", 36, "籵", 5, "籾", 9], ["bb80", "粈粊", 6, "粓粔粖粙粚粛粠粡粣粦粧粨粩粫粬粭粯粰粴", 4, "粺粻弧虎唬护互沪户花哗华猾滑画划化话槐徊怀淮坏欢环桓还缓换患唤痪豢焕涣宦幻荒慌黄磺蝗簧皇凰惶煌晃幌恍谎灰挥辉徽恢蛔回毁悔慧卉惠晦贿秽会烩汇讳诲绘荤昏婚魂浑混豁活伙火获或惑霍货祸击圾基机畸稽积箕"], ["bc40", "粿糀糂糃糄糆糉糋糎", 6, "糘糚糛糝糞糡", 6, "糩", 5, "糰", 7, "糹糺糼", 13, "紋", 5], ["bc80", "紑", 14, "紡紣紤紥紦紨紩紪紬紭紮細", 6, "肌饥迹激讥鸡姬绩缉吉极棘辑籍集及急疾汲即嫉级挤几脊己蓟技冀季伎祭剂悸济寄寂计记既忌际妓继纪嘉枷夹佳家加荚颊贾甲钾假稼价架驾嫁歼监坚尖笺间煎兼肩艰奸缄茧检柬碱硷拣捡简俭剪减荐槛鉴践贱见键箭件"], ["bd40", "紷", 54, "絯", 7], ["bd80", "絸", 32, "健舰剑饯渐溅涧建僵姜将浆江疆蒋桨奖讲匠酱降蕉椒礁焦胶交郊浇骄娇嚼搅铰矫侥脚狡角饺缴绞剿教酵轿较叫窖揭接皆秸街阶截劫节桔杰捷睫竭洁结解姐戒藉芥界借介疥诫届巾筋斤金今津襟紧锦仅谨进靳晋禁近烬浸"], ["be40", "継", 12, "綧", 6, "綯", 42], ["be80", "線", 32, "尽劲荆兢茎睛晶鲸京惊精粳经井警景颈静境敬镜径痉靖竟竞净炯窘揪究纠玖韭久灸九酒厩救旧臼舅咎就疚鞠拘狙疽居驹菊局咀矩举沮聚拒据巨具距踞锯俱句惧炬剧捐鹃娟倦眷卷绢撅攫抉掘倔爵觉决诀绝均菌钧军君峻"], ["bf40", "緻", 62], ["bf80", "縺縼", 4, "繂", 4, "繈", 21, "俊竣浚郡骏喀咖卡咯开揩楷凯慨刊堪勘坎砍看康慷糠扛抗亢炕考拷烤靠坷苛柯棵磕颗科壳咳可渴克刻客课肯啃垦恳坑吭空恐孔控抠口扣寇枯哭窟苦酷库裤夸垮挎跨胯块筷侩快宽款匡筐狂框矿眶旷况亏盔岿窥葵奎魁傀"], ["c040", "繞", 35, "纃", 23, "纜纝纞"], ["c080", "纮纴纻纼绖绤绬绹缊缐缞缷缹缻", 6, "罃罆", 9, "罒罓馈愧溃坤昆捆困括扩廓阔垃拉喇蜡腊辣啦莱来赖蓝婪栏拦篮阑兰澜谰揽览懒缆烂滥琅榔狼廊郎朗浪捞劳牢老佬姥酪烙涝勒乐雷镭蕾磊累儡垒擂肋类泪棱楞冷厘梨犁黎篱狸离漓理李里鲤礼莉荔吏栗丽厉励砾历利傈例俐"], ["c140", "罖罙罛罜罝罞罠罣", 4, "罫罬罭罯罰罳罵罶罷罸罺罻罼罽罿羀羂", 7, "羋羍羏", 4, "羕", 4, "羛羜羠羢羣羥羦羨", 6, "羱"], ["c180", "羳", 4, "羺羻羾翀翂翃翄翆翇翈翉翋翍翏", 4, "翖翗翙", 5, "翢翣痢立粒沥隶力璃哩俩联莲连镰廉怜涟帘敛脸链恋炼练粮凉梁粱良两辆量晾亮谅撩聊僚疗燎寥辽潦了撂镣廖料列裂烈劣猎琳林磷霖临邻鳞淋凛赁吝拎玲菱零龄铃伶羚凌灵陵岭领另令溜琉榴硫馏留刘瘤流柳六龙聋咙笼窿"], ["c240", "翤翧翨翪翫翬翭翯翲翴", 6, "翽翾翿耂耇耈耉耊耎耏耑耓耚耛耝耞耟耡耣耤耫", 5, "耲耴耹耺耼耾聀聁聄聅聇聈聉聎聏聐聑聓聕聖聗"], ["c280", "聙聛", 13, "聫", 5, "聲", 11, "隆垄拢陇楼娄搂篓漏陋芦卢颅庐炉掳卤虏鲁麓碌露路赂鹿潞禄录陆戮驴吕铝侣旅履屡缕虑氯律率滤绿峦挛孪滦卵乱掠略抡轮伦仑沦纶论萝螺罗逻锣箩骡裸落洛骆络妈麻玛码蚂马骂嘛吗埋买麦卖迈脉瞒馒蛮满蔓曼慢漫"], ["c340", "聾肁肂肅肈肊肍", 5, "肔肕肗肙肞肣肦肧肨肬肰肳肵肶肸肹肻胅胇", 4, "胏", 6, "胘胟胠胢胣胦胮胵胷胹胻胾胿脀脁脃脄脅脇脈脋"], ["c380", "脌脕脗脙脛脜脝脟", 12, "脭脮脰脳脴脵脷脹", 4, "脿谩芒茫盲氓忙莽猫茅锚毛矛铆卯茂冒帽貌贸么玫枚梅酶霉煤没眉媒镁每美昧寐妹媚门闷们萌蒙檬盟锰猛梦孟眯醚靡糜迷谜弥米秘觅泌蜜密幂棉眠绵冕免勉娩缅面苗描瞄藐秒渺庙妙蔑灭民抿皿敏悯闽明螟鸣铭名命谬摸"], ["c440", "腀", 5, "腇腉腍腎腏腒腖腗腘腛", 4, "腡腢腣腤腦腨腪腫腬腯腲腳腵腶腷腸膁膃", 4, "膉膋膌膍膎膐膒", 5, "膙膚膞", 4, "膤膥"], ["c480", "膧膩膫", 7, "膴", 5, "膼膽膾膿臄臅臇臈臉臋臍", 6, "摹蘑模膜磨摩魔抹末莫墨默沫漠寞陌谋牟某拇牡亩姆母墓暮幕募慕木目睦牧穆拿哪呐钠那娜纳氖乃奶耐奈南男难囊挠脑恼闹淖呢馁内嫩能妮霓倪泥尼拟你匿腻逆溺蔫拈年碾撵捻念娘酿鸟尿捏聂孽啮镊镍涅您柠狞凝宁"], ["c540", "臔", 14, "臤臥臦臨臩臫臮", 4, "臵", 5, "臽臿舃與", 4, "舎舏舑舓舕", 5, "舝舠舤舥舦舧舩舮舲舺舼舽舿"], ["c580", "艀艁艂艃艅艆艈艊艌艍艎艐", 7, "艙艛艜艝艞艠", 7, "艩拧泞牛扭钮纽脓浓农弄奴努怒女暖虐疟挪懦糯诺哦欧鸥殴藕呕偶沤啪趴爬帕怕琶拍排牌徘湃派攀潘盘磐盼畔判叛乓庞旁耪胖抛咆刨炮袍跑泡呸胚培裴赔陪配佩沛喷盆砰抨烹澎彭蓬棚硼篷膨朋鹏捧碰坯砒霹批披劈琵毗"], ["c640", "艪艫艬艭艱艵艶艷艸艻艼芀芁芃芅芆芇芉芌芐芓芔芕芖芚芛芞芠芢芣芧芲芵芶芺芻芼芿苀苂苃苅苆苉苐苖苙苚苝苢苧苨苩苪苬苭苮苰苲苳苵苶苸"], ["c680", "苺苼", 4, "茊茋茍茐茒茓茖茘茙茝", 9, "茩茪茮茰茲茷茻茽啤脾疲皮匹痞僻屁譬篇偏片骗飘漂瓢票撇瞥拼频贫品聘乒坪苹萍平凭瓶评屏坡泼颇婆破魄迫粕剖扑铺仆莆葡菩蒲埔朴圃普浦谱曝瀑期欺栖戚妻七凄漆柒沏其棋奇歧畦崎脐齐旗祈祁骑起岂乞企启契砌器气迄弃汽泣讫掐"], ["c740", "茾茿荁荂荄荅荈荊", 4, "荓荕", 4, "荝荢荰", 6, "荹荺荾", 6, "莇莈莊莋莌莍莏莐莑莔莕莖莗莙莚莝莟莡", 6, "莬莭莮"], ["c780", "莯莵莻莾莿菂菃菄菆菈菉菋菍菎菐菑菒菓菕菗菙菚菛菞菢菣菤菦菧菨菫菬菭恰洽牵扦钎铅千迁签仟谦乾黔钱钳前潜遣浅谴堑嵌欠歉枪呛腔羌墙蔷强抢橇锹敲悄桥瞧乔侨巧鞘撬翘峭俏窍切茄且怯窃钦侵亲秦琴勤芹擒禽寝沁青轻氢倾卿清擎晴氰情顷请庆琼穷秋丘邱球求囚酋泅趋区蛆曲躯屈驱渠"], ["c840", "菮華菳", 4, "菺菻菼菾菿萀萂萅萇萈萉萊萐萒", 5, "萙萚萛萞", 5, "萩", 7, "萲", 5, "萹萺萻萾", 7, "葇葈葉"], ["c880", "葊", 6, "葒", 4, "葘葝葞葟葠葢葤", 4, "葪葮葯葰葲葴葷葹葻葼取娶龋趣去圈颧权醛泉全痊拳犬券劝缺炔瘸却鹊榷确雀裙群然燃冉染瓤壤攘嚷让饶扰绕惹热壬仁人忍韧任认刃妊纫扔仍日戎茸蓉荣融熔溶容绒冗揉柔肉茹蠕儒孺如辱乳汝入褥软阮蕊瑞锐闰润若弱撒洒萨腮鳃塞赛三叁"], ["c940", "葽", 4, "蒃蒄蒅蒆蒊蒍蒏", 7, "蒘蒚蒛蒝蒞蒟蒠蒢", 12, "蒰蒱蒳蒵蒶蒷蒻蒼蒾蓀蓂蓃蓅蓆蓇蓈蓋蓌蓎蓏蓒蓔蓕蓗"], ["c980", "蓘", 4, "蓞蓡蓢蓤蓧", 4, "蓭蓮蓯蓱", 10, "蓽蓾蔀蔁蔂伞散桑嗓丧搔骚扫嫂瑟色涩森僧莎砂杀刹沙纱傻啥煞筛晒珊苫杉山删煽衫闪陕擅赡膳善汕扇缮墒伤商赏晌上尚裳梢捎稍烧芍勺韶少哨邵绍奢赊蛇舌舍赦摄射慑涉社设砷申呻伸身深娠绅神沈审婶甚肾慎渗声生甥牲升绳"], ["ca40", "蔃", 8, "蔍蔎蔏蔐蔒蔔蔕蔖蔘蔙蔛蔜蔝蔞蔠蔢", 8, "蔭", 9, "蔾", 4, "蕄蕅蕆蕇蕋", 10], ["ca80", "蕗蕘蕚蕛蕜蕝蕟", 4, "蕥蕦蕧蕩", 8, "蕳蕵蕶蕷蕸蕼蕽蕿薀薁省盛剩胜圣师失狮施湿诗尸虱十石拾时什食蚀实识史矢使屎驶始式示士世柿事拭誓逝势是嗜噬适仕侍释饰氏市恃室视试收手首守寿授售受瘦兽蔬枢梳殊抒输叔舒淑疏书赎孰熟薯暑曙署蜀黍鼠属术述树束戍竖墅庶数漱"], ["cb40", "薂薃薆薈", 6, "薐", 10, "薝", 6, "薥薦薧薩薫薬薭薱", 5, "薸薺", 6, "藂", 6, "藊", 4, "藑藒"], ["cb80", "藔藖", 5, "藝", 6, "藥藦藧藨藪", 14, "恕刷耍摔衰甩帅栓拴霜双爽谁水睡税吮瞬顺舜说硕朔烁斯撕嘶思私司丝死肆寺嗣四伺似饲巳松耸怂颂送宋讼诵搜艘擞嗽苏酥俗素速粟僳塑溯宿诉肃酸蒜算虽隋随绥髓碎岁穗遂隧祟孙损笋蓑梭唆缩琐索锁所塌他它她塔"], ["cc40", "藹藺藼藽藾蘀", 4, "蘆", 10, "蘒蘓蘔蘕蘗", 15, "蘨蘪", 13, "蘹蘺蘻蘽蘾蘿虀"], ["cc80", "虁", 11, "虒虓處", 4, "虛虜虝號虠虡虣", 7, "獭挞蹋踏胎苔抬台泰酞太态汰坍摊贪瘫滩坛檀痰潭谭谈坦毯袒碳探叹炭汤塘搪堂棠膛唐糖倘躺淌趟烫掏涛滔绦萄桃逃淘陶讨套特藤腾疼誊梯剔踢锑提题蹄啼体替嚏惕涕剃屉天添填田甜恬舔腆挑条迢眺跳贴铁帖厅听烃"], ["cd40", "虭虯虰虲", 6, "蚃", 6, "蚎", 4, "蚔蚖", 5, "蚞", 4, "蚥蚦蚫蚭蚮蚲蚳蚷蚸蚹蚻", 4, "蛁蛂蛃蛅蛈蛌蛍蛒蛓蛕蛖蛗蛚蛜"], ["cd80", "蛝蛠蛡蛢蛣蛥蛦蛧蛨蛪蛫蛬蛯蛵蛶蛷蛺蛻蛼蛽蛿蜁蜄蜅蜆蜋蜌蜎蜏蜐蜑蜔蜖汀廷停亭庭挺艇通桐酮瞳同铜彤童桶捅筒统痛偷投头透凸秃突图徒途涂屠土吐兔湍团推颓腿蜕褪退吞屯臀拖托脱鸵陀驮驼椭妥拓唾挖哇蛙洼娃瓦袜歪外豌弯湾玩顽丸烷完碗挽晚皖惋宛婉万腕汪王亡枉网往旺望忘妄威"], ["ce40", "蜙蜛蜝蜟蜠蜤蜦蜧蜨蜪蜫蜬蜭蜯蜰蜲蜳蜵蜶蜸蜹蜺蜼蜽蝀", 6, "蝊蝋蝍蝏蝐蝑蝒蝔蝕蝖蝘蝚", 5, "蝡蝢蝦", 7, "蝯蝱蝲蝳蝵"], ["ce80", "蝷蝸蝹蝺蝿螀螁螄螆螇螉螊螌螎", 4, "螔螕螖螘", 6, "螠", 4, "巍微危韦违桅围唯惟为潍维苇萎委伟伪尾纬未蔚味畏胃喂魏位渭谓尉慰卫瘟温蚊文闻纹吻稳紊问嗡翁瓮挝蜗涡窝我斡卧握沃巫呜钨乌污诬屋无芜梧吾吴毋武五捂午舞伍侮坞戊雾晤物勿务悟误昔熙析西硒矽晰嘻吸锡牺"], ["cf40", "螥螦螧螩螪螮螰螱螲螴螶螷螸螹螻螼螾螿蟁", 4, "蟇蟈蟉蟌", 4, "蟔", 6, "蟜蟝蟞蟟蟡蟢蟣蟤蟦蟧蟨蟩蟫蟬蟭蟯", 9], ["cf80", "蟺蟻蟼蟽蟿蠀蠁蠂蠄", 5, "蠋", 7, "蠔蠗蠘蠙蠚蠜", 4, "蠣稀息希悉膝夕惜熄烯溪汐犀檄袭席习媳喜铣洗系隙戏细瞎虾匣霞辖暇峡侠狭下厦夏吓掀锨先仙鲜纤咸贤衔舷闲涎弦嫌显险现献县腺馅羡宪陷限线相厢镶香箱襄湘乡翔祥详想响享项巷橡像向象萧硝霄削哮嚣销消宵淆晓"], ["d040", "蠤", 13, "蠳", 5, "蠺蠻蠽蠾蠿衁衂衃衆", 5, "衎", 5, "衕衖衘衚", 6, "衦衧衪衭衯衱衳衴衵衶衸衹衺"], ["d080", "衻衼袀袃袆袇袉袊袌袎袏袐袑袓袔袕袗", 4, "袝", 4, "袣袥", 5, "小孝校肖啸笑效楔些歇蝎鞋协挟携邪斜胁谐写械卸蟹懈泄泻谢屑薪芯锌欣辛新忻心信衅星腥猩惺兴刑型形邢行醒幸杏性姓兄凶胸匈汹雄熊休修羞朽嗅锈秀袖绣墟戌需虚嘘须徐许蓄酗叙旭序畜恤絮婿绪续轩喧宣悬旋玄"], ["d140", "袬袮袯袰袲", 4, "袸袹袺袻袽袾袿裀裃裄裇裈裊裋裌裍裏裐裑裓裖裗裚", 4, "裠裡裦裧裩", 6, "裲裵裶裷裺裻製裿褀褁褃", 5], ["d180", "褉褋", 4, "褑褔", 4, "褜", 4, "褢褣褤褦褧褨褩褬褭褮褯褱褲褳褵褷选癣眩绚靴薛学穴雪血勋熏循旬询寻驯巡殉汛训讯逊迅压押鸦鸭呀丫芽牙蚜崖衙涯雅哑亚讶焉咽阉烟淹盐严研蜒岩延言颜阎炎沿奄掩眼衍演艳堰燕厌砚雁唁彦焰宴谚验殃央鸯秧杨扬佯疡羊洋阳氧仰痒养样漾邀腰妖瑶"], ["d240", "褸", 8, "襂襃襅", 24, "襠", 5, "襧", 19, "襼"], ["d280", "襽襾覀覂覄覅覇", 26, "摇尧遥窑谣姚咬舀药要耀椰噎耶爷野冶也页掖业叶曳腋夜液一壹医揖铱依伊衣颐夷遗移仪胰疑沂宜姨彝椅蚁倚已乙矣以艺抑易邑屹亿役臆逸肄疫亦裔意毅忆义益溢诣议谊译异翼翌绎茵荫因殷音阴姻吟银淫寅饮尹引隐"], ["d340", "覢", 30, "觃觍觓觔觕觗觘觙觛觝觟觠觡觢觤觧觨觩觪觬觭觮觰觱觲觴", 6], ["d380", "觻", 4, "訁", 5, "計", 21, "印英樱婴鹰应缨莹萤营荧蝇迎赢盈影颖硬映哟拥佣臃痈庸雍踊蛹咏泳涌永恿勇用幽优悠忧尤由邮铀犹油游酉有友右佑釉诱又幼迂淤于盂榆虞愚舆余俞逾鱼愉渝渔隅予娱雨与屿禹宇语羽玉域芋郁吁遇喻峪御愈欲狱育誉"], ["d440", "訞", 31, "訿", 8, "詉", 21], ["d480", "詟", 25, "詺", 6, "浴寓裕预豫驭鸳渊冤元垣袁原援辕园员圆猿源缘远苑愿怨院曰约越跃钥岳粤月悦阅耘云郧匀陨允运蕴酝晕韵孕匝砸杂栽哉灾宰载再在咱攒暂赞赃脏葬遭糟凿藻枣早澡蚤躁噪造皂灶燥责择则泽贼怎增憎曾赠扎喳渣札轧"], ["d540", "誁", 7, "誋", 7, "誔", 46], ["d580", "諃", 32, "铡闸眨栅榨咋乍炸诈摘斋宅窄债寨瞻毡詹粘沾盏斩辗崭展蘸栈占战站湛绽樟章彰漳张掌涨杖丈帐账仗胀瘴障招昭找沼赵照罩兆肇召遮折哲蛰辙者锗蔗这浙珍斟真甄砧臻贞针侦枕疹诊震振镇阵蒸挣睁征狰争怔整拯正政"], ["d640", "諤", 34, "謈", 27], ["d680", "謤謥謧", 30, "帧症郑证芝枝支吱蜘知肢脂汁之织职直植殖执值侄址指止趾只旨纸志挚掷至致置帜峙制智秩稚质炙痔滞治窒中盅忠钟衷终种肿重仲众舟周州洲诌粥轴肘帚咒皱宙昼骤珠株蛛朱猪诸诛逐竹烛煮拄瞩嘱主著柱助蛀贮铸筑"], ["d740", "譆", 31, "譧", 4, "譭", 25], ["d780", "讇", 24, "讬讱讻诇诐诪谉谞住注祝驻抓爪拽专砖转撰赚篆桩庄装妆撞壮状椎锥追赘坠缀谆准捉拙卓桌琢茁酌啄着灼浊兹咨资姿滋淄孜紫仔籽滓子自渍字鬃棕踪宗综总纵邹走奏揍租足卒族祖诅阻组钻纂嘴醉最罪尊遵昨左佐柞做作坐座"], ["d840", "谸", 8, "豂豃豄豅豈豊豋豍", 7, "豖豗豘豙豛", 5, "豣", 6, "豬", 6, "豴豵豶豷豻", 6, "貃貄貆貇"], ["d880", "貈貋貍", 6, "貕貖貗貙", 20, "亍丌兀丐廿卅丕亘丞鬲孬噩丨禺丿匕乇夭爻卮氐囟胤馗毓睾鼗丶亟鼐乜乩亓芈孛啬嘏仄厍厝厣厥厮靥赝匚叵匦匮匾赜卦卣刂刈刎刭刳刿剀剌剞剡剜蒯剽劂劁劐劓冂罔亻仃仉仂仨仡仫仞伛仳伢佤仵伥伧伉伫佞佧攸佚佝"], ["d940", "貮", 62], ["d980", "賭", 32, "佟佗伲伽佶佴侑侉侃侏佾佻侪佼侬侔俦俨俪俅俚俣俜俑俟俸倩偌俳倬倏倮倭俾倜倌倥倨偾偃偕偈偎偬偻傥傧傩傺僖儆僭僬僦僮儇儋仝氽佘佥俎龠汆籴兮巽黉馘冁夔勹匍訇匐凫夙兕亠兖亳衮袤亵脔裒禀嬴蠃羸冫冱冽冼"], ["da40", "贎", 14, "贠赑赒赗赟赥赨赩赪赬赮赯赱赲赸", 8, "趂趃趆趇趈趉趌", 4, "趒趓趕", 9, "趠趡"], ["da80", "趢趤", 12, "趲趶趷趹趻趽跀跁跂跅跇跈跉跊跍跐跒跓跔凇冖冢冥讠讦讧讪讴讵讷诂诃诋诏诎诒诓诔诖诘诙诜诟诠诤诨诩诮诰诳诶诹诼诿谀谂谄谇谌谏谑谒谔谕谖谙谛谘谝谟谠谡谥谧谪谫谮谯谲谳谵谶卩卺阝阢阡阱阪阽阼陂陉陔陟陧陬陲陴隈隍隗隰邗邛邝邙邬邡邴邳邶邺"], ["db40", "跕跘跙跜跠跡跢跥跦跧跩跭跮跰跱跲跴跶跼跾", 6, "踆踇踈踋踍踎踐踑踒踓踕", 7, "踠踡踤", 4, "踫踭踰踲踳踴踶踷踸踻踼踾"], ["db80", "踿蹃蹅蹆蹌", 4, "蹓", 5, "蹚", 11, "蹧蹨蹪蹫蹮蹱邸邰郏郅邾郐郄郇郓郦郢郜郗郛郫郯郾鄄鄢鄞鄣鄱鄯鄹酃酆刍奂劢劬劭劾哿勐勖勰叟燮矍廴凵凼鬯厶弁畚巯坌垩垡塾墼壅壑圩圬圪圳圹圮圯坜圻坂坩垅坫垆坼坻坨坭坶坳垭垤垌垲埏垧垴垓垠埕埘埚埙埒垸埴埯埸埤埝"], ["dc40", "蹳蹵蹷", 4, "蹽蹾躀躂躃躄躆躈", 6, "躑躒躓躕", 6, "躝躟", 11, "躭躮躰躱躳", 6, "躻", 7], ["dc80", "軃", 10, "軏", 21, "堋堍埽埭堀堞堙塄堠塥塬墁墉墚墀馨鼙懿艹艽艿芏芊芨芄芎芑芗芙芫芸芾芰苈苊苣芘芷芮苋苌苁芩芴芡芪芟苄苎芤苡茉苷苤茏茇苜苴苒苘茌苻苓茑茚茆茔茕苠苕茜荑荛荜茈莒茼茴茱莛荞茯荏荇荃荟荀茗荠茭茺茳荦荥"], ["dd40", "軥", 62], ["dd80", "輤", 32, "荨茛荩荬荪荭荮莰荸莳莴莠莪莓莜莅荼莶莩荽莸荻莘莞莨莺莼菁萁菥菘堇萘萋菝菽菖萜萸萑萆菔菟萏萃菸菹菪菅菀萦菰菡葜葑葚葙葳蒇蒈葺蒉葸萼葆葩葶蒌蒎萱葭蓁蓍蓐蓦蒽蓓蓊蒿蒺蓠蒡蒹蒴蒗蓥蓣蔌甍蔸蓰蔹蔟蔺"], ["de40", "轅", 32, "轪辀辌辒辝辠辡辢辤辥辦辧辪辬辭辮辯農辳辴辵辷辸辺辻込辿迀迃迆"], ["de80", "迉", 4, "迏迒迖迗迚迠迡迣迧迬迯迱迲迴迵迶迺迻迼迾迿逇逈逌逎逓逕逘蕖蔻蓿蓼蕙蕈蕨蕤蕞蕺瞢蕃蕲蕻薤薨薇薏蕹薮薜薅薹薷薰藓藁藜藿蘧蘅蘩蘖蘼廾弈夼奁耷奕奚奘匏尢尥尬尴扌扪抟抻拊拚拗拮挢拶挹捋捃掭揶捱捺掎掴捭掬掊捩掮掼揲揸揠揿揄揞揎摒揆掾摅摁搋搛搠搌搦搡摞撄摭撖"], ["df40", "這逜連逤逥逧", 5, "逰", 4, "逷逹逺逽逿遀遃遅遆遈", 4, "過達違遖遙遚遜", 5, "遤遦遧適遪遫遬遯", 4, "遶", 6, "遾邁"], ["df80", "還邅邆邇邉邊邌", 4, "邒邔邖邘邚邜邞邟邠邤邥邧邨邩邫邭邲邷邼邽邿郀摺撷撸撙撺擀擐擗擤擢攉攥攮弋忒甙弑卟叱叽叩叨叻吒吖吆呋呒呓呔呖呃吡呗呙吣吲咂咔呷呱呤咚咛咄呶呦咝哐咭哂咴哒咧咦哓哔呲咣哕咻咿哌哙哚哜咩咪咤哝哏哞唛哧唠哽唔哳唢唣唏唑唧唪啧喏喵啉啭啁啕唿啐唼"], ["e040", "郂郃郆郈郉郋郌郍郒郔郕郖郘郙郚郞郟郠郣郤郥郩郪郬郮郰郱郲郳郵郶郷郹郺郻郼郿鄀鄁鄃鄅", 19, "鄚鄛鄜"], ["e080", "鄝鄟鄠鄡鄤", 10, "鄰鄲", 6, "鄺", 8, "酄唷啖啵啶啷唳唰啜喋嗒喃喱喹喈喁喟啾嗖喑啻嗟喽喾喔喙嗪嗷嗉嘟嗑嗫嗬嗔嗦嗝嗄嗯嗥嗲嗳嗌嗍嗨嗵嗤辔嘞嘈嘌嘁嘤嘣嗾嘀嘧嘭噘嘹噗嘬噍噢噙噜噌噔嚆噤噱噫噻噼嚅嚓嚯囔囗囝囡囵囫囹囿圄圊圉圜帏帙帔帑帱帻帼"], ["e140", "酅酇酈酑酓酔酕酖酘酙酛酜酟酠酦酧酨酫酭酳酺酻酼醀", 4, "醆醈醊醎醏醓", 6, "醜", 5, "醤", 5, "醫醬醰醱醲醳醶醷醸醹醻"], ["e180", "醼", 10, "釈釋釐釒", 9, "針", 8, "帷幄幔幛幞幡岌屺岍岐岖岈岘岙岑岚岜岵岢岽岬岫岱岣峁岷峄峒峤峋峥崂崃崧崦崮崤崞崆崛嵘崾崴崽嵬嵛嵯嵝嵫嵋嵊嵩嵴嶂嶙嶝豳嶷巅彳彷徂徇徉後徕徙徜徨徭徵徼衢彡犭犰犴犷犸狃狁狎狍狒狨狯狩狲狴狷猁狳猃狺"], ["e240", "釦", 62], ["e280", "鈥", 32, "狻猗猓猡猊猞猝猕猢猹猥猬猸猱獐獍獗獠獬獯獾舛夥飧夤夂饣饧", 5, "饴饷饽馀馄馇馊馍馐馑馓馔馕庀庑庋庖庥庠庹庵庾庳赓廒廑廛廨廪膺忄忉忖忏怃忮怄忡忤忾怅怆忪忭忸怙怵怦怛怏怍怩怫怊怿怡恸恹恻恺恂"], ["e340", "鉆", 45, "鉵", 16], ["e380", "銆", 7, "銏", 24, "恪恽悖悚悭悝悃悒悌悛惬悻悱惝惘惆惚悴愠愦愕愣惴愀愎愫慊慵憬憔憧憷懔懵忝隳闩闫闱闳闵闶闼闾阃阄阆阈阊阋阌阍阏阒阕阖阗阙阚丬爿戕氵汔汜汊沣沅沐沔沌汨汩汴汶沆沩泐泔沭泷泸泱泗沲泠泖泺泫泮沱泓泯泾"], ["e440", "銨", 5, "銯", 24, "鋉", 31], ["e480", "鋩", 32, "洹洧洌浃浈洇洄洙洎洫浍洮洵洚浏浒浔洳涑浯涞涠浞涓涔浜浠浼浣渚淇淅淞渎涿淠渑淦淝淙渖涫渌涮渫湮湎湫溲湟溆湓湔渲渥湄滟溱溘滠漭滢溥溧溽溻溷滗溴滏溏滂溟潢潆潇漤漕滹漯漶潋潴漪漉漩澉澍澌潸潲潼潺濑"], ["e540", "錊", 51, "錿", 10], ["e580", "鍊", 31, "鍫濉澧澹澶濂濡濮濞濠濯瀚瀣瀛瀹瀵灏灞宀宄宕宓宥宸甯骞搴寤寮褰寰蹇謇辶迓迕迥迮迤迩迦迳迨逅逄逋逦逑逍逖逡逵逶逭逯遄遑遒遐遨遘遢遛暹遴遽邂邈邃邋彐彗彖彘尻咫屐屙孱屣屦羼弪弩弭艴弼鬻屮妁妃妍妩妪妣"], ["e640", "鍬", 34, "鎐", 27], ["e680", "鎬", 29, "鏋鏌鏍妗姊妫妞妤姒妲妯姗妾娅娆姝娈姣姘姹娌娉娲娴娑娣娓婀婧婊婕娼婢婵胬媪媛婷婺媾嫫媲嫒嫔媸嫠嫣嫱嫖嫦嫘嫜嬉嬗嬖嬲嬷孀尕尜孚孥孳孑孓孢驵驷驸驺驿驽骀骁骅骈骊骐骒骓骖骘骛骜骝骟骠骢骣骥骧纟纡纣纥纨纩"], ["e740", "鏎", 7, "鏗", 54], ["e780", "鐎", 32, "纭纰纾绀绁绂绉绋绌绐绔绗绛绠绡绨绫绮绯绱绲缍绶绺绻绾缁缂缃缇缈缋缌缏缑缒缗缙缜缛缟缡", 6, "缪缫缬缭缯", 4, "缵幺畿巛甾邕玎玑玮玢玟珏珂珑玷玳珀珉珈珥珙顼琊珩珧珞玺珲琏琪瑛琦琥琨琰琮琬"], ["e840", "鐯", 14, "鐿", 43, "鑬鑭鑮鑯"], ["e880", "鑰", 20, "钑钖钘铇铏铓铔铚铦铻锜锠琛琚瑁瑜瑗瑕瑙瑷瑭瑾璜璎璀璁璇璋璞璨璩璐璧瓒璺韪韫韬杌杓杞杈杩枥枇杪杳枘枧杵枨枞枭枋杷杼柰栉柘栊柩枰栌柙枵柚枳柝栀柃枸柢栎柁柽栲栳桠桡桎桢桄桤梃栝桕桦桁桧桀栾桊桉栩梵梏桴桷梓桫棂楮棼椟椠棹"], ["e940", "锧锳锽镃镈镋镕镚镠镮镴镵長", 7, "門", 42], ["e980", "閫", 32, "椤棰椋椁楗棣椐楱椹楠楂楝榄楫榀榘楸椴槌榇榈槎榉楦楣楹榛榧榻榫榭槔榱槁槊槟榕槠榍槿樯槭樗樘橥槲橄樾檠橐橛樵檎橹樽樨橘橼檑檐檩檗檫猷獒殁殂殇殄殒殓殍殚殛殡殪轫轭轱轲轳轵轶轸轷轹轺轼轾辁辂辄辇辋"], ["ea40", "闌", 27, "闬闿阇阓阘阛阞阠阣", 6, "阫阬阭阯阰阷阸阹阺阾陁陃陊陎陏陑陒陓陖陗"], ["ea80", "陘陙陚陜陝陞陠陣陥陦陫陭", 4, "陳陸", 12, "隇隉隊辍辎辏辘辚軎戋戗戛戟戢戡戥戤戬臧瓯瓴瓿甏甑甓攴旮旯旰昊昙杲昃昕昀炅曷昝昴昱昶昵耆晟晔晁晏晖晡晗晷暄暌暧暝暾曛曜曦曩贲贳贶贻贽赀赅赆赈赉赇赍赕赙觇觊觋觌觎觏觐觑牮犟牝牦牯牾牿犄犋犍犏犒挈挲掰"], ["eb40", "隌階隑隒隓隕隖隚際隝", 9, "隨", 7, "隱隲隴隵隷隸隺隻隿雂雃雈雊雋雐雑雓雔雖", 9, "雡", 6, "雫"], ["eb80", "雬雭雮雰雱雲雴雵雸雺電雼雽雿霂霃霅霊霋霌霐霑霒霔霕霗", 4, "霝霟霠搿擘耄毪毳毽毵毹氅氇氆氍氕氘氙氚氡氩氤氪氲攵敕敫牍牒牖爰虢刖肟肜肓肼朊肽肱肫肭肴肷胧胨胩胪胛胂胄胙胍胗朐胝胫胱胴胭脍脎胲胼朕脒豚脶脞脬脘脲腈腌腓腴腙腚腱腠腩腼腽腭腧塍媵膈膂膑滕膣膪臌朦臊膻"], ["ec40", "霡", 8, "霫霬霮霯霱霳", 4, "霺霻霼霽霿", 18, "靔靕靗靘靚靜靝靟靣靤靦靧靨靪", 7], ["ec80", "靲靵靷", 4, "靽", 7, "鞆", 4, "鞌鞎鞏鞐鞓鞕鞖鞗鞙", 4, "臁膦欤欷欹歃歆歙飑飒飓飕飙飚殳彀毂觳斐齑斓於旆旄旃旌旎旒旖炀炜炖炝炻烀炷炫炱烨烊焐焓焖焯焱煳煜煨煅煲煊煸煺熘熳熵熨熠燠燔燧燹爝爨灬焘煦熹戾戽扃扈扉礻祀祆祉祛祜祓祚祢祗祠祯祧祺禅禊禚禧禳忑忐"], ["ed40", "鞞鞟鞡鞢鞤", 6, "鞬鞮鞰鞱鞳鞵", 46], ["ed80", "韤韥韨韮", 4, "韴韷", 23, "怼恝恚恧恁恙恣悫愆愍慝憩憝懋懑戆肀聿沓泶淼矶矸砀砉砗砘砑斫砭砜砝砹砺砻砟砼砥砬砣砩硎硭硖硗砦硐硇硌硪碛碓碚碇碜碡碣碲碹碥磔磙磉磬磲礅磴礓礤礞礴龛黹黻黼盱眄眍盹眇眈眚眢眙眭眦眵眸睐睑睇睃睚睨"], ["ee40", "頏", 62], ["ee80", "顎", 32, "睢睥睿瞍睽瞀瞌瞑瞟瞠瞰瞵瞽町畀畎畋畈畛畲畹疃罘罡罟詈罨罴罱罹羁罾盍盥蠲钅钆钇钋钊钌钍钏钐钔钗钕钚钛钜钣钤钫钪钭钬钯钰钲钴钶", 4, "钼钽钿铄铈", 6, "铐铑铒铕铖铗铙铘铛铞铟铠铢铤铥铧铨铪"], ["ef40", "顯", 5, "颋颎颒颕颙颣風", 37, "飏飐飔飖飗飛飜飝飠", 4], ["ef80", "飥飦飩", 30, "铩铫铮铯铳铴铵铷铹铼铽铿锃锂锆锇锉锊锍锎锏锒", 4, "锘锛锝锞锟锢锪锫锩锬锱锲锴锶锷锸锼锾锿镂锵镄镅镆镉镌镎镏镒镓镔镖镗镘镙镛镞镟镝镡镢镤", 8, "镯镱镲镳锺矧矬雉秕秭秣秫稆嵇稃稂稞稔"], ["f040", "餈", 4, "餎餏餑", 28, "餯", 26], ["f080", "饊", 9, "饖", 12, "饤饦饳饸饹饻饾馂馃馉稹稷穑黏馥穰皈皎皓皙皤瓞瓠甬鸠鸢鸨", 4, "鸲鸱鸶鸸鸷鸹鸺鸾鹁鹂鹄鹆鹇鹈鹉鹋鹌鹎鹑鹕鹗鹚鹛鹜鹞鹣鹦", 6, "鹱鹭鹳疒疔疖疠疝疬疣疳疴疸痄疱疰痃痂痖痍痣痨痦痤痫痧瘃痱痼痿瘐瘀瘅瘌瘗瘊瘥瘘瘕瘙"], ["f140", "馌馎馚", 10, "馦馧馩", 47], ["f180", "駙", 32, "瘛瘼瘢瘠癀瘭瘰瘿瘵癃瘾瘳癍癞癔癜癖癫癯翊竦穸穹窀窆窈窕窦窠窬窨窭窳衤衩衲衽衿袂袢裆袷袼裉裢裎裣裥裱褚裼裨裾裰褡褙褓褛褊褴褫褶襁襦襻疋胥皲皴矜耒耔耖耜耠耢耥耦耧耩耨耱耋耵聃聆聍聒聩聱覃顸颀颃"], ["f240", "駺", 62], ["f280", "騹", 32, "颉颌颍颏颔颚颛颞颟颡颢颥颦虍虔虬虮虿虺虼虻蚨蚍蚋蚬蚝蚧蚣蚪蚓蚩蚶蛄蚵蛎蚰蚺蚱蚯蛉蛏蚴蛩蛱蛲蛭蛳蛐蜓蛞蛴蛟蛘蛑蜃蜇蛸蜈蜊蜍蜉蜣蜻蜞蜥蜮蜚蜾蝈蜴蜱蜩蜷蜿螂蜢蝽蝾蝻蝠蝰蝌蝮螋蝓蝣蝼蝤蝙蝥螓螯螨蟒"], ["f340", "驚", 17, "驲骃骉骍骎骔骕骙骦骩", 6, "骲骳骴骵骹骻骽骾骿髃髄髆", 4, "髍髎髏髐髒體髕髖髗髙髚髛髜"], ["f380", "髝髞髠髢髣髤髥髧髨髩髪髬髮髰", 8, "髺髼", 6, "鬄鬅鬆蟆螈螅螭螗螃螫蟥螬螵螳蟋蟓螽蟑蟀蟊蟛蟪蟠蟮蠖蠓蟾蠊蠛蠡蠹蠼缶罂罄罅舐竺竽笈笃笄笕笊笫笏筇笸笪笙笮笱笠笥笤笳笾笞筘筚筅筵筌筝筠筮筻筢筲筱箐箦箧箸箬箝箨箅箪箜箢箫箴篑篁篌篝篚篥篦篪簌篾篼簏簖簋"], ["f440", "鬇鬉", 5, "鬐鬑鬒鬔", 10, "鬠鬡鬢鬤", 10, "鬰鬱鬳", 7, "鬽鬾鬿魀魆魊魋魌魎魐魒魓魕", 5], ["f480", "魛", 32, "簟簪簦簸籁籀臾舁舂舄臬衄舡舢舣舭舯舨舫舸舻舳舴舾艄艉艋艏艚艟艨衾袅袈裘裟襞羝羟羧羯羰羲籼敉粑粝粜粞粢粲粼粽糁糇糌糍糈糅糗糨艮暨羿翎翕翥翡翦翩翮翳糸絷綦綮繇纛麸麴赳趄趔趑趱赧赭豇豉酊酐酎酏酤"], ["f540", "魼", 62], ["f580", "鮻", 32, "酢酡酰酩酯酽酾酲酴酹醌醅醐醍醑醢醣醪醭醮醯醵醴醺豕鹾趸跫踅蹙蹩趵趿趼趺跄跖跗跚跞跎跏跛跆跬跷跸跣跹跻跤踉跽踔踝踟踬踮踣踯踺蹀踹踵踽踱蹉蹁蹂蹑蹒蹊蹰蹶蹼蹯蹴躅躏躔躐躜躞豸貂貊貅貘貔斛觖觞觚觜"], ["f640", "鯜", 62], ["f680", "鰛", 32, "觥觫觯訾謦靓雩雳雯霆霁霈霏霎霪霭霰霾龀龃龅", 5, "龌黾鼋鼍隹隼隽雎雒瞿雠銎銮鋈錾鍪鏊鎏鐾鑫鱿鲂鲅鲆鲇鲈稣鲋鲎鲐鲑鲒鲔鲕鲚鲛鲞", 5, "鲥", 4, "鲫鲭鲮鲰", 7, "鲺鲻鲼鲽鳄鳅鳆鳇鳊鳋"], ["f740", "鰼", 62], ["f780", "鱻鱽鱾鲀鲃鲄鲉鲊鲌鲏鲓鲖鲗鲘鲙鲝鲪鲬鲯鲹鲾", 4, "鳈鳉鳑鳒鳚鳛鳠鳡鳌", 4, "鳓鳔鳕鳗鳘鳙鳜鳝鳟鳢靼鞅鞑鞒鞔鞯鞫鞣鞲鞴骱骰骷鹘骶骺骼髁髀髅髂髋髌髑魅魃魇魉魈魍魑飨餍餮饕饔髟髡髦髯髫髻髭髹鬈鬏鬓鬟鬣麽麾縻麂麇麈麋麒鏖麝麟黛黜黝黠黟黢黩黧黥黪黯鼢鼬鼯鼹鼷鼽鼾齄"], ["f840", "鳣", 62], ["f880", "鴢", 32], ["f940", "鵃", 62], ["f980", "鶂", 32], ["fa40", "鶣", 62], ["fa80", "鷢", 32], ["fb40", "鸃", 27, "鸤鸧鸮鸰鸴鸻鸼鹀鹍鹐鹒鹓鹔鹖鹙鹝鹟鹠鹡鹢鹥鹮鹯鹲鹴", 9, "麀"], ["fb80", "麁麃麄麅麆麉麊麌", 5, "麔", 8, "麞麠", 5, "麧麨麩麪"], ["fc40", "麫", 8, "麵麶麷麹麺麼麿", 4, "黅黆黇黈黊黋黌黐黒黓黕黖黗黙黚點黡黣黤黦黨黫黬黭黮黰", 8, "黺黽黿", 6], ["fc80", "鼆", 4, "鼌鼏鼑鼒鼔鼕鼖鼘鼚", 5, "鼡鼣", 8, "鼭鼮鼰鼱"], ["fd40", "鼲", 4, "鼸鼺鼼鼿", 4, "齅", 10, "齒", 38], ["fd80", "齹", 5, "龁龂龍", 11, "龜龝龞龡", 4, "郎凉秊裏隣"], ["fe40", "兀嗀﨎﨏﨑﨓﨔礼﨟蘒﨡﨣﨤﨧﨨﨩"]]
			}, function (e, t, r) {
				"use strict";
				if (Object.defineProperty(t, "__esModule", {
						value: !0
					}), t.IsInitialized = !process.env.APPLICATION_INSIGHTS_NO_DIAGNOSTIC_CHANNEL, t.IsInitialized) {
					var n = r(117),
					o = (process.env.APPLICATION_INSIGHTS_NO_PATCH_MODULES || "").split(","),
					i = {
						bunyan: n.bunyan,
						console: n.console,
						mongodb: n.mongodb,
						mongodbCore: n.mongodbCore,
						mysql: n.mysql,
						redis: n.redis,
						pg: n.pg,
						pgPool: n.pgPool,
						winston: n.winston
					};
					for (var s in i)
						 - 1 === o.indexOf(s) && i[s].enable()
				}
				t.registerContextPreservation = function (e) {
					t.IsInitialized && r(3).channel.addContextPreservation(e)
				}
			}, function (e, t, r) {
				"use strict";
				var n = r(13),
				o = r(26),
				i = r(6),
				s = r(10),
				a = r(17),
				c = r(157),
				u = r(16),
				l = r(24),
				h = function () {
					function e(t) {
						if (e.INSTANCE)
							throw new Error("Client request tracking should be configured from the applicationInsights object");
						e.INSTANCE = this,
						this._client = t
					}
					return e.prototype.enable = function (e) {
						this._isEnabled = e,
						this._isEnabled && !this._isInitialized && this._initialize(),
						l.IsInitialized && (r(158).enable(e, this._client), r(159).enable(e, this._client), r(160).enable(e, this._client), r(161).enable(e, this._client))
					},
					e.prototype.isInitialized = function () {
						return this._isInitialized
					},
					e.prototype._initialize = function () {
						var t = this;
						this._isInitialized = !0;
						n.get;
						var r = n.request,
						i = o.request,
						s = function (r, n) {
							var o = !n[e.disableCollectionRequestOption] && !r[e.alreadyAutoCollectedFlag];
							r[e.alreadyAutoCollectedFlag] = !0,
							r && n && o && e.trackRequest(t._client, {
								options: n,
								request: r
							})
						};
						n.request = function (e) {
							for (var t = [], o = 1; o < arguments.length; o++)
								t[o - 1] = arguments[o];
							var i = r.call.apply(r, [n, e].concat(t));
							return s(i, e),
							i
						},
						o.request = function (e) {
							for (var t = [], r = 1; r < arguments.length; r++)
								t[r - 1] = arguments[r];
							var n = i.call.apply(i, [o, e].concat(t));
							return s(n, e),
							n
						},
						n.get = function (e) {
							for (var t = [], r = 1; r < arguments.length; r++)
								t[r - 1] = arguments[r];
							var o,
							i = (o = n.request).call.apply(o, [n, e].concat(t));
							return i.end(),
							i
						},
						o.get = function (e) {
							for (var t = [], r = 1; r < arguments.length; r++)
								t[r - 1] = arguments[r];
							var n,
							i = (n = o.request).call.apply(n, [o, e].concat(t));
							return i.end(),
							i
						}
					},
					e.trackRequest = function (t, r) {
						if (r.options && r.request && t) {
							var n = new c(r.options, r.request),
							o = u.CorrelationContextManager.getCurrentContext(),
							l = o && o.operation && o.operation.parentId + e.requestNumber++ + ".";
							if (s.canIncludeCorrelationHeader(t, n.getUrl()) && r.request.getHeader && r.request.setHeader) {
								if (t.config && t.config.correlationId) {
									var h = r.request.getHeader(a.requestContextHeader);
									if (h) {
										var p = h.split(","),
										d = a.requestContextSourceKey + "=";
										p.some(function (e) {
											return e.substring(0, d.length) === d
										}) || r.request.setHeader(a.requestContextHeader, h + "," + a.requestContextSourceKey + "=" + t.config.correlationId)
									} else
										r.request.setHeader(a.requestContextHeader, a.requestContextSourceKey + "=" + t.config.correlationId)
								}
								if (o && o.operation) {
									r.request.setHeader(a.requestIdHeader, l),
									r.request.setHeader(a.parentIdHeader, o.operation.id),
									r.request.setHeader(a.rootIdHeader, l);
									var f = o.customProperties.serializeToHeader();
									f && r.request.setHeader(a.correlationContextHeader, f)
								}
							}
							r.request.on && (r.request.on("response", function (e) {
									n.onResponse(e);
									var o = n.getDependencyTelemetry(r, l);
									o.contextObjects = o.contextObjects || {},
									o.contextObjects["http.RequestOptions"] = r.options,
									o.contextObjects["http.ClientRequest"] = r.request,
									o.contextObjects["http.ClientResponse"] = e,
									t.trackDependency(o)
								}), r.request.on("error", function (e) {
									n.onError(e);
									var o = n.getDependencyTelemetry(r, l);
									o.contextObjects = o.contextObjects || {},
									o.contextObjects["http.RequestOptions"] = r.options,
									o.contextObjects["http.ClientRequest"] = r.request,
									o.contextObjects.Error = e,
									t.trackDependency(o)
								}))
						} else
							i.info("AutoCollectHttpDependencies.trackRequest was called with invalid parameters: ", !r.options, !r.request, !t)
					},
					e.prototype.dispose = function () {
						e.INSTANCE = null,
						this.enable(!1),
						this._isInitialized = !1
					},
					e.disableCollectionRequestOption = "disableAppInsightsAutoCollection",
					e.requestNumber = 1,
					e.alreadyAutoCollectedFlag = "_appInsightsAutoCollected",
					e
				}
				();
				e.exports = h
			}, function (e, t) {
				e.exports = require("https")
			}, function (e, t, r) {
				"use strict";
				var n = r(10),
				o = r(6),
				i = function () {
					function e() {}
					return e.queryCorrelationId = function (t, r) {
						var i = t.profileQueryEndpoint + "/api/profiles/" + t.instrumentationKey + "/appId";
						if (e.completedLookups.hasOwnProperty(i))
							r(e.completedLookups[i]);
						else if (e.pendingLookups[i])
							e.pendingLookups[i].push(r);
						else {
							e.pendingLookups[i] = [r];
							var s = function () {
								if (e.pendingLookups[i]) {
									var r = {
										method: "GET",
										disableAppInsightsAutoCollection: !0
									};
									o.info(e.TAG, r);
									var a = n.makeRequest(t, i, r, function (r) {
											if (200 === r.statusCode) {
												var n = "";
												r.setEncoding("utf-8"),
												r.on("data", function (e) {
													n += e
												}),
												r.on("end", function () {
													o.info(e.TAG, n);
													var t = e.correlationIdPrefix + n;
													e.completedLookups[i] = t,
													e.pendingLookups[i] && e.pendingLookups[i].forEach(function (e) {
														return e(t)
													}),
													delete e.pendingLookups[i]
												})
											} else
												r.statusCode >= 400 && r.statusCode < 500 ? (e.completedLookups[i] = void 0, delete e.pendingLookups[i]) : setTimeout(s, t.correlationIdRetryIntervalMs)
										});
									a && (a.on("error", function (t) {
											o.warn(e.TAG, t)
										}), a.end())
								}
							};
							setTimeout(s, 0)
						}
					},
					e.cancelCorrelationIdQuery = function (t, r) {
						var n = t.profileQueryEndpoint + "/api/profiles/" + t.instrumentationKey + "/appId",
						o = e.pendingLookups[n];
						o && (e.pendingLookups[n] = o.filter(function (e) {
									return e != r
								}), 0 == e.pendingLookups[n].length && delete e.pendingLookups[n])
					},
					e.generateRequestId = function (t) {
						if (t) {
							"." !== (t = "|" == t[0] ? t : "|" + t)[t.length - 1] && (t += ".");
							var r = (e.currentRootId++).toString(16);
							return e.appendSuffix(t, r, "_")
						}
						return e.generateRootId()
					},
					e.getRootId = function (e) {
						var t = e.indexOf(".");
						t < 0 && (t = e.length);
						var r = "|" === e[0] ? 1 : 0;
						return e.substring(r, t)
					},
					e.generateRootId = function () {
						return "|" + n.w3cTraceId() + "."
					},
					e.appendSuffix = function (t, r, o) {
						if (t.length + r.length < e.requestIdMaxLength)
							return t + r + o;
						var i = e.requestIdMaxLength - 9;
						if (t.length > i)
							for (; i > 1; --i) {
								var s = t[i - 1];
								if ("." === s || "_" === s)
									break
							}
						if (i <= 1)
							return e.generateRootId();
						for (r = n.randomu32().toString(16); r.length < 8; )
							r = "0" + r;
						return t.substring(0, i) + r + "#"
					},
					e.TAG = "CorrelationIdManager",
					e.correlationIdPrefix = "cid-v1:",
					e.pendingLookups = {},
					e.completedLookups = {},
					e.requestIdMaxLength = 1024,
					e.currentRootId = n.randomu32(),
					e
				}
				();
				e.exports = i
			}, function (e, t) {
				e.exports = require("child_process")
			}, function (e, t) {
				e.exports = require("string_decoder")
			}, function (e) {
				e.exports = [["a140", "", 62], ["a180", "", 32], ["a240", "", 62], ["a280", "", 32], ["a2ab", "", 5], ["a2e3", "€"], ["a2ef", ""], ["a2fd", ""], ["a340", "", 62], ["a380", "", 31, "　"], ["a440", "", 62], ["a480", "", 32], ["a4f4", "", 10], ["a540", "", 62], ["a580", "", 32], ["a5f7", "", 7], ["a640", "", 62], ["a680", "", 32], ["a6b9", "", 7], ["a6d9", "", 6], ["a6ec", ""], ["a6f3", ""], ["a6f6", "", 8], ["a740", "", 62], ["a780", "", 32], ["a7c2", "", 14], ["a7f2", "", 12], ["a896", "", 10], ["a8bc", ""], ["a8bf", "ǹ"], ["a8c1", ""], ["a8ea", "", 20], ["a958", ""], ["a95b", ""], ["a95d", ""], ["a989", "〾⿰", 11], ["a997", "", 12], ["a9f0", "", 14], ["aaa1", "", 93], ["aba1", "", 93], ["aca1", "", 93], ["ada1", "", 93], ["aea1", "", 93], ["afa1", "", 93], ["d7fa", "", 4], ["f8a1", "", 93], ["f9a1", "", 93], ["faa1", "", 93], ["fba1", "", 93], ["fca1", "", 93], ["fda1", "", 93], ["fe50", "⺁⺄㑳㑇⺈⺋㖞㘚㘎⺌⺗㥮㤘㧏㧟㩳㧐㭎㱮㳠⺧⺪䁖䅟⺮䌷⺳⺶⺷䎱䎬⺻䏝䓖䙡䙌"], ["fe80", "䜣䜩䝼䞍⻊䥇䥺䥽䦂䦃䦅䦆䦟䦛䦷䦶䲣䲟䲠䲡䱷䲢䴓", 6, "䶮", 93]]
			}, function (e) {
				e.exports = [["0", "\0", 127], ["a140", "　，、。．‧；：？！︰…‥﹐﹑﹒·﹔﹕﹖﹗｜–︱—︳╴︴﹏（）︵︶｛｝︷︸〔〕︹︺【】︻︼《》︽︾〈〉︿﹀「」﹁﹂『』﹃﹄﹙﹚"], ["a1a1", "﹛﹜﹝﹞‘’“”〝〞‵′＃＆＊※§〃○●△▲◎☆★◇◆□■▽▼㊣℅¯￣＿ˍ﹉﹊﹍﹎﹋﹌﹟﹠﹡＋－×÷±√＜＞＝≦≧≠∞≒≡﹢", 4, "～∩∪⊥∠∟⊿㏒㏑∫∮∵∴♀♂⊕⊙↑↓←→↖↗↙↘∥∣／"], ["a240", "＼∕﹨＄￥〒￠￡％＠℃℉﹩﹪﹫㏕㎜㎝㎞㏎㎡㎎㎏㏄°兙兛兞兝兡兣嗧瓩糎▁", 7, "▏▎▍▌▋▊▉┼┴┬┤├▔─│▕┌┐└┘╭"], ["a2a1", "╮╰╯═╞╪╡◢◣◥◤╱╲╳０", 9, "Ⅰ", 9, "〡", 8, "十卄卅Ａ", 25, "ａ", 21], ["a340", "ｗｘｙｚΑ", 16, "Σ", 6, "α", 16, "σ", 6, "ㄅ", 10], ["a3a1", "ㄐ", 25, "˙ˉˊˇˋ"], ["a3e1", "€"], ["a440", "一乙丁七乃九了二人儿入八几刀刁力匕十卜又三下丈上丫丸凡久么也乞于亡兀刃勺千叉口土士夕大女子孑孓寸小尢尸山川工己已巳巾干廾弋弓才"], ["a4a1", "丑丐不中丰丹之尹予云井互五亢仁什仃仆仇仍今介仄元允內六兮公冗凶分切刈勻勾勿化匹午升卅卞厄友及反壬天夫太夭孔少尤尺屯巴幻廿弔引心戈戶手扎支文斗斤方日曰月木欠止歹毋比毛氏水火爪父爻片牙牛犬王丙"], ["a540", "世丕且丘主乍乏乎以付仔仕他仗代令仙仞充兄冉冊冬凹出凸刊加功包匆北匝仟半卉卡占卯卮去可古右召叮叩叨叼司叵叫另只史叱台句叭叻四囚外"], ["a5a1", "央失奴奶孕它尼巨巧左市布平幼弁弘弗必戊打扔扒扑斥旦朮本未末札正母民氐永汁汀氾犯玄玉瓜瓦甘生用甩田由甲申疋白皮皿目矛矢石示禾穴立丞丟乒乓乩亙交亦亥仿伉伙伊伕伍伐休伏仲件任仰仳份企伋光兇兆先全"], ["a640", "共再冰列刑划刎刖劣匈匡匠印危吉吏同吊吐吁吋各向名合吃后吆吒因回囝圳地在圭圬圯圩夙多夷夸妄奸妃好她如妁字存宇守宅安寺尖屹州帆并年"], ["a6a1", "式弛忙忖戎戌戍成扣扛托收早旨旬旭曲曳有朽朴朱朵次此死氖汝汗汙江池汐汕污汛汍汎灰牟牝百竹米糸缶羊羽老考而耒耳聿肉肋肌臣自至臼舌舛舟艮色艾虫血行衣西阡串亨位住佇佗佞伴佛何估佐佑伽伺伸佃佔似但佣"], ["a740", "作你伯低伶余佝佈佚兌克免兵冶冷別判利刪刨劫助努劬匣即卵吝吭吞吾否呎吧呆呃吳呈呂君吩告吹吻吸吮吵吶吠吼呀吱含吟听囪困囤囫坊坑址坍"], ["a7a1", "均坎圾坐坏圻壯夾妝妒妨妞妣妙妖妍妤妓妊妥孝孜孚孛完宋宏尬局屁尿尾岐岑岔岌巫希序庇床廷弄弟彤形彷役忘忌志忍忱快忸忪戒我抄抗抖技扶抉扭把扼找批扳抒扯折扮投抓抑抆改攻攸旱更束李杏材村杜杖杞杉杆杠"], ["a840", "杓杗步每求汞沙沁沈沉沅沛汪決沐汰沌汨沖沒汽沃汲汾汴沆汶沍沔沘沂灶灼災灸牢牡牠狄狂玖甬甫男甸皂盯矣私秀禿究系罕肖肓肝肘肛肚育良芒"], ["a8a1", "芋芍見角言谷豆豕貝赤走足身車辛辰迂迆迅迄巡邑邢邪邦那酉釆里防阮阱阪阬並乖乳事些亞享京佯依侍佳使佬供例來侃佰併侈佩佻侖佾侏侑佺兔兒兕兩具其典冽函刻券刷刺到刮制剁劾劻卒協卓卑卦卷卸卹取叔受味呵"], ["a940", "咖呸咕咀呻呷咄咒咆呼咐呱呶和咚呢周咋命咎固垃坷坪坩坡坦坤坼夜奉奇奈奄奔妾妻委妹妮姑姆姐姍始姓姊妯妳姒姅孟孤季宗定官宜宙宛尚屈居"], ["a9a1", "屆岷岡岸岩岫岱岳帘帚帖帕帛帑幸庚店府底庖延弦弧弩往征彿彼忝忠忽念忿怏怔怯怵怖怪怕怡性怩怫怛或戕房戾所承拉拌拄抿拂抹拒招披拓拔拋拈抨抽押拐拙拇拍抵拚抱拘拖拗拆抬拎放斧於旺昔易昌昆昂明昀昏昕昊"], ["aa40", "昇服朋杭枋枕東果杳杷枇枝林杯杰板枉松析杵枚枓杼杪杲欣武歧歿氓氛泣注泳沱泌泥河沽沾沼波沫法泓沸泄油況沮泗泅泱沿治泡泛泊沬泯泜泖泠"], ["aaa1", "炕炎炒炊炙爬爭爸版牧物狀狎狙狗狐玩玨玟玫玥甽疝疙疚的盂盲直知矽社祀祁秉秈空穹竺糾罔羌羋者肺肥肢肱股肫肩肴肪肯臥臾舍芳芝芙芭芽芟芹花芬芥芯芸芣芰芾芷虎虱初表軋迎返近邵邸邱邶采金長門阜陀阿阻附"], ["ab40", "陂隹雨青非亟亭亮信侵侯便俠俑俏保促侶俘俟俊俗侮俐俄係俚俎俞侷兗冒冑冠剎剃削前剌剋則勇勉勃勁匍南卻厚叛咬哀咨哎哉咸咦咳哇哂咽咪品"], ["aba1", "哄哈咯咫咱咻咩咧咿囿垂型垠垣垢城垮垓奕契奏奎奐姜姘姿姣姨娃姥姪姚姦威姻孩宣宦室客宥封屎屏屍屋峙峒巷帝帥帟幽庠度建弈弭彥很待徊律徇後徉怒思怠急怎怨恍恰恨恢恆恃恬恫恪恤扁拜挖按拼拭持拮拽指拱拷"], ["ac40", "拯括拾拴挑挂政故斫施既春昭映昧是星昨昱昤曷柿染柱柔某柬架枯柵柩柯柄柑枴柚查枸柏柞柳枰柙柢柝柒歪殃殆段毒毗氟泉洋洲洪流津洌洱洞洗"], ["aca1", "活洽派洶洛泵洹洧洸洩洮洵洎洫炫為炳炬炯炭炸炮炤爰牲牯牴狩狠狡玷珊玻玲珍珀玳甚甭畏界畎畋疫疤疥疢疣癸皆皇皈盈盆盃盅省盹相眉看盾盼眇矜砂研砌砍祆祉祈祇禹禺科秒秋穿突竿竽籽紂紅紀紉紇約紆缸美羿耄"], ["ad40", "耐耍耑耶胖胥胚胃胄背胡胛胎胞胤胝致舢苧范茅苣苛苦茄若茂茉苒苗英茁苜苔苑苞苓苟苯茆虐虹虻虺衍衫要觔計訂訃貞負赴赳趴軍軌述迦迢迪迥"], ["ada1", "迭迫迤迨郊郎郁郃酋酊重閂限陋陌降面革韋韭音頁風飛食首香乘亳倌倍倣俯倦倥俸倩倖倆值借倚倒們俺倀倔倨俱倡個候倘俳修倭倪俾倫倉兼冤冥冢凍凌准凋剖剜剔剛剝匪卿原厝叟哨唐唁唷哼哥哲唆哺唔哩哭員唉哮哪"], ["ae40", "哦唧唇哽唏圃圄埂埔埋埃堉夏套奘奚娑娘娜娟娛娓姬娠娣娩娥娌娉孫屘宰害家宴宮宵容宸射屑展屐峭峽峻峪峨峰島崁峴差席師庫庭座弱徒徑徐恙"], ["aea1", "恣恥恐恕恭恩息悄悟悚悍悔悌悅悖扇拳挈拿捎挾振捕捂捆捏捉挺捐挽挪挫挨捍捌效敉料旁旅時晉晏晃晒晌晅晁書朔朕朗校核案框桓根桂桔栩梳栗桌桑栽柴桐桀格桃株桅栓栘桁殊殉殷氣氧氨氦氤泰浪涕消涇浦浸海浙涓"], ["af40", "浬涉浮浚浴浩涌涊浹涅浥涔烊烘烤烙烈烏爹特狼狹狽狸狷玆班琉珮珠珪珞畔畝畜畚留疾病症疲疳疽疼疹痂疸皋皰益盍盎眩真眠眨矩砰砧砸砝破砷"], ["afa1", "砥砭砠砟砲祕祐祠祟祖神祝祗祚秤秣秧租秦秩秘窄窈站笆笑粉紡紗紋紊素索純紐紕級紜納紙紛缺罟羔翅翁耆耘耕耙耗耽耿胱脂胰脅胭胴脆胸胳脈能脊胼胯臭臬舀舐航舫舨般芻茫荒荔荊茸荐草茵茴荏茲茹茶茗荀茱茨荃"], ["b040", "虔蚊蚪蚓蚤蚩蚌蚣蚜衰衷袁袂衽衹記訐討訌訕訊託訓訖訏訑豈豺豹財貢起躬軒軔軏辱送逆迷退迺迴逃追逅迸邕郡郝郢酒配酌釘針釗釜釙閃院陣陡"], ["b0a1", "陛陝除陘陞隻飢馬骨高鬥鬲鬼乾偺偽停假偃偌做偉健偶偎偕偵側偷偏倏偯偭兜冕凰剪副勒務勘動匐匏匙匿區匾參曼商啪啦啄啞啡啃啊唱啖問啕唯啤唸售啜唬啣唳啁啗圈國圉域堅堊堆埠埤基堂堵執培夠奢娶婁婉婦婪婀"], ["b140", "娼婢婚婆婊孰寇寅寄寂宿密尉專將屠屜屝崇崆崎崛崖崢崑崩崔崙崤崧崗巢常帶帳帷康庸庶庵庾張強彗彬彩彫得徙從徘御徠徜恿患悉悠您惋悴惦悽"], ["b1a1", "情悻悵惜悼惘惕惆惟悸惚惇戚戛扈掠控捲掖探接捷捧掘措捱掩掉掃掛捫推掄授掙採掬排掏掀捻捩捨捺敝敖救教敗啟敏敘敕敔斜斛斬族旋旌旎晝晚晤晨晦晞曹勗望梁梯梢梓梵桿桶梱梧梗械梃棄梭梆梅梔條梨梟梡梂欲殺"], ["b240", "毫毬氫涎涼淳淙液淡淌淤添淺清淇淋涯淑涮淞淹涸混淵淅淒渚涵淚淫淘淪深淮淨淆淄涪淬涿淦烹焉焊烽烯爽牽犁猜猛猖猓猙率琅琊球理現琍瓠瓶"], ["b2a1", "瓷甜產略畦畢異疏痔痕疵痊痍皎盔盒盛眷眾眼眶眸眺硫硃硎祥票祭移窒窕笠笨笛第符笙笞笮粒粗粕絆絃統紮紹紼絀細紳組累終紲紱缽羞羚翌翎習耜聊聆脯脖脣脫脩脰脤舂舵舷舶船莎莞莘荸莢莖莽莫莒莊莓莉莠荷荻荼"], ["b340", "莆莧處彪蛇蛀蚶蛄蚵蛆蛋蚱蚯蛉術袞袈被袒袖袍袋覓規訪訝訣訥許設訟訛訢豉豚販責貫貨貪貧赧赦趾趺軛軟這逍通逗連速逝逐逕逞造透逢逖逛途"], ["b3a1", "部郭都酗野釵釦釣釧釭釩閉陪陵陳陸陰陴陶陷陬雀雪雩章竟頂頃魚鳥鹵鹿麥麻傢傍傅備傑傀傖傘傚最凱割剴創剩勞勝勛博厥啻喀喧啼喊喝喘喂喜喪喔喇喋喃喳單喟唾喲喚喻喬喱啾喉喫喙圍堯堪場堤堰報堡堝堠壹壺奠"], ["b440", "婷媚婿媒媛媧孳孱寒富寓寐尊尋就嵌嵐崴嵇巽幅帽幀幃幾廊廁廂廄弼彭復循徨惑惡悲悶惠愜愣惺愕惰惻惴慨惱愎惶愉愀愒戟扉掣掌描揀揩揉揆揍"], ["b4a1", "插揣提握揖揭揮捶援揪換摒揚揹敞敦敢散斑斐斯普晰晴晶景暑智晾晷曾替期朝棺棕棠棘棗椅棟棵森棧棹棒棲棣棋棍植椒椎棉棚楮棻款欺欽殘殖殼毯氮氯氬港游湔渡渲湧湊渠渥渣減湛湘渤湖湮渭渦湯渴湍渺測湃渝渾滋"], ["b540", "溉渙湎湣湄湲湩湟焙焚焦焰無然煮焜牌犄犀猶猥猴猩琺琪琳琢琥琵琶琴琯琛琦琨甥甦畫番痢痛痣痙痘痞痠登發皖皓皴盜睏短硝硬硯稍稈程稅稀窘"], ["b5a1", "窗窖童竣等策筆筐筒答筍筋筏筑粟粥絞結絨絕紫絮絲絡給絢絰絳善翔翕耋聒肅腕腔腋腑腎脹腆脾腌腓腴舒舜菩萃菸萍菠菅萋菁華菱菴著萊菰萌菌菽菲菊萸萎萄菜萇菔菟虛蛟蛙蛭蛔蛛蛤蛐蛞街裁裂袱覃視註詠評詞証詁"], ["b640", "詔詛詐詆訴診訶詖象貂貯貼貳貽賁費賀貴買貶貿貸越超趁跎距跋跚跑跌跛跆軻軸軼辜逮逵週逸進逶鄂郵鄉郾酣酥量鈔鈕鈣鈉鈞鈍鈐鈇鈑閔閏開閑"], ["b6a1", "間閒閎隊階隋陽隅隆隍陲隄雁雅雄集雇雯雲韌項順須飧飪飯飩飲飭馮馭黃黍黑亂傭債傲傳僅傾催傷傻傯僇剿剷剽募勦勤勢勣匯嗟嗨嗓嗦嗎嗜嗇嗑嗣嗤嗯嗚嗡嗅嗆嗥嗉園圓塞塑塘塗塚塔填塌塭塊塢塒塋奧嫁嫉嫌媾媽媼"], ["b740", "媳嫂媲嵩嵯幌幹廉廈弒彙徬微愚意慈感想愛惹愁愈慎慌慄慍愾愴愧愍愆愷戡戢搓搾搞搪搭搽搬搏搜搔損搶搖搗搆敬斟新暗暉暇暈暖暄暘暍會榔業"], ["b7a1", "楚楷楠楔極椰概楊楨楫楞楓楹榆楝楣楛歇歲毀殿毓毽溢溯滓溶滂源溝滇滅溥溘溼溺溫滑準溜滄滔溪溧溴煎煙煩煤煉照煜煬煦煌煥煞煆煨煖爺牒猷獅猿猾瑯瑚瑕瑟瑞瑁琿瑙瑛瑜當畸瘀痰瘁痲痱痺痿痴痳盞盟睛睫睦睞督"], ["b840", "睹睪睬睜睥睨睢矮碎碰碗碘碌碉硼碑碓硿祺祿禁萬禽稜稚稠稔稟稞窟窠筷節筠筮筧粱粳粵經絹綑綁綏絛置罩罪署義羨群聖聘肆肄腱腰腸腥腮腳腫"], ["b8a1", "腹腺腦舅艇蒂葷落萱葵葦葫葉葬葛萼萵葡董葩葭葆虞虜號蛹蜓蜈蜇蜀蛾蛻蜂蜃蜆蜊衙裟裔裙補裘裝裡裊裕裒覜解詫該詳試詩詰誇詼詣誠話誅詭詢詮詬詹詻訾詨豢貊貉賊資賈賄貲賃賂賅跡跟跨路跳跺跪跤跦躲較載軾輊"], ["b940", "辟農運遊道遂達逼違遐遇遏過遍遑逾遁鄒鄗酬酪酩釉鈷鉗鈸鈽鉀鈾鉛鉋鉤鉑鈴鉉鉍鉅鈹鈿鉚閘隘隔隕雍雋雉雊雷電雹零靖靴靶預頑頓頊頒頌飼飴"], ["b9a1", "飽飾馳馱馴髡鳩麂鼎鼓鼠僧僮僥僖僭僚僕像僑僱僎僩兢凳劃劂匱厭嗾嘀嘛嘗嗽嘔嘆嘉嘍嘎嗷嘖嘟嘈嘐嗶團圖塵塾境墓墊塹墅塽壽夥夢夤奪奩嫡嫦嫩嫗嫖嫘嫣孵寞寧寡寥實寨寢寤察對屢嶄嶇幛幣幕幗幔廓廖弊彆彰徹慇"], ["ba40", "愿態慷慢慣慟慚慘慵截撇摘摔撤摸摟摺摑摧搴摭摻敲斡旗旖暢暨暝榜榨榕槁榮槓構榛榷榻榫榴槐槍榭槌榦槃榣歉歌氳漳演滾漓滴漩漾漠漬漏漂漢"], ["baa1", "滿滯漆漱漸漲漣漕漫漯澈漪滬漁滲滌滷熔熙煽熊熄熒爾犒犖獄獐瑤瑣瑪瑰瑭甄疑瘧瘍瘋瘉瘓盡監瞄睽睿睡磁碟碧碳碩碣禎福禍種稱窪窩竭端管箕箋筵算箝箔箏箸箇箄粹粽精綻綰綜綽綾綠緊綴網綱綺綢綿綵綸維緒緇綬"], ["bb40", "罰翠翡翟聞聚肇腐膀膏膈膊腿膂臧臺與舔舞艋蓉蒿蓆蓄蒙蒞蒲蒜蓋蒸蓀蓓蒐蒼蓑蓊蜿蜜蜻蜢蜥蜴蜘蝕蜷蜩裳褂裴裹裸製裨褚裯誦誌語誣認誡誓誤"], ["bba1", "說誥誨誘誑誚誧豪貍貌賓賑賒赫趙趕跼輔輒輕輓辣遠遘遜遣遙遞遢遝遛鄙鄘鄞酵酸酷酴鉸銀銅銘銖鉻銓銜銨鉼銑閡閨閩閣閥閤隙障際雌雒需靼鞅韶頗領颯颱餃餅餌餉駁骯骰髦魁魂鳴鳶鳳麼鼻齊億儀僻僵價儂儈儉儅凜"], ["bc40", "劇劈劉劍劊勰厲嘮嘻嘹嘲嘿嘴嘩噓噎噗噴嘶嘯嘰墀墟增墳墜墮墩墦奭嬉嫻嬋嫵嬌嬈寮寬審寫層履嶝嶔幢幟幡廢廚廟廝廣廠彈影德徵慶慧慮慝慕憂"], ["bca1", "慼慰慫慾憧憐憫憎憬憚憤憔憮戮摩摯摹撞撲撈撐撰撥撓撕撩撒撮播撫撚撬撙撢撳敵敷數暮暫暴暱樣樟槨樁樞標槽模樓樊槳樂樅槭樑歐歎殤毅毆漿潼澄潑潦潔澆潭潛潸潮澎潺潰潤澗潘滕潯潠潟熟熬熱熨牖犛獎獗瑩璋璃"], ["bd40", "瑾璀畿瘠瘩瘟瘤瘦瘡瘢皚皺盤瞎瞇瞌瞑瞋磋磅確磊碾磕碼磐稿稼穀稽稷稻窯窮箭箱範箴篆篇篁箠篌糊締練緯緻緘緬緝編緣線緞緩綞緙緲緹罵罷羯"], ["bda1", "翩耦膛膜膝膠膚膘蔗蔽蔚蓮蔬蔭蔓蔑蔣蔡蔔蓬蔥蓿蔆螂蝴蝶蝠蝦蝸蝨蝙蝗蝌蝓衛衝褐複褒褓褕褊誼諒談諄誕請諸課諉諂調誰論諍誶誹諛豌豎豬賠賞賦賤賬賭賢賣賜質賡赭趟趣踫踐踝踢踏踩踟踡踞躺輝輛輟輩輦輪輜輞"], ["be40", "輥適遮遨遭遷鄰鄭鄧鄱醇醉醋醃鋅銻銷鋪銬鋤鋁銳銼鋒鋇鋰銲閭閱霄霆震霉靠鞍鞋鞏頡頫頜颳養餓餒餘駝駐駟駛駑駕駒駙骷髮髯鬧魅魄魷魯鴆鴉"], ["bea1", "鴃麩麾黎墨齒儒儘儔儐儕冀冪凝劑劓勳噙噫噹噩噤噸噪器噥噱噯噬噢噶壁墾壇壅奮嬝嬴學寰導彊憲憑憩憊懍憶憾懊懈戰擅擁擋撻撼據擄擇擂操撿擒擔撾整曆曉暹曄曇暸樽樸樺橙橫橘樹橄橢橡橋橇樵機橈歙歷氅濂澱澡"], ["bf40", "濃澤濁澧澳激澹澶澦澠澴熾燉燐燒燈燕熹燎燙燜燃燄獨璜璣璘璟璞瓢甌甍瘴瘸瘺盧盥瞠瞞瞟瞥磨磚磬磧禦積穎穆穌穋窺篙簑築篤篛篡篩篦糕糖縊"], ["bfa1", "縑縈縛縣縞縝縉縐罹羲翰翱翮耨膳膩膨臻興艘艙蕊蕙蕈蕨蕩蕃蕉蕭蕪蕞螃螟螞螢融衡褪褲褥褫褡親覦諦諺諫諱謀諜諧諮諾謁謂諷諭諳諶諼豫豭貓賴蹄踱踴蹂踹踵輻輯輸輳辨辦遵遴選遲遼遺鄴醒錠錶鋸錳錯錢鋼錫錄錚"], ["c040", "錐錦錡錕錮錙閻隧隨險雕霎霑霖霍霓霏靛靜靦鞘頰頸頻頷頭頹頤餐館餞餛餡餚駭駢駱骸骼髻髭鬨鮑鴕鴣鴦鴨鴒鴛默黔龍龜優償儡儲勵嚎嚀嚐嚅嚇"], ["c0a1", "嚏壕壓壑壎嬰嬪嬤孺尷屨嶼嶺嶽嶸幫彌徽應懂懇懦懋戲戴擎擊擘擠擰擦擬擱擢擭斂斃曙曖檀檔檄檢檜櫛檣橾檗檐檠歜殮毚氈濘濱濟濠濛濤濫濯澀濬濡濩濕濮濰燧營燮燦燥燭燬燴燠爵牆獰獲璩環璦璨癆療癌盪瞳瞪瞰瞬"], ["c140", "瞧瞭矯磷磺磴磯礁禧禪穗窿簇簍篾篷簌篠糠糜糞糢糟糙糝縮績繆縷縲繃縫總縱繅繁縴縹繈縵縿縯罄翳翼聱聲聰聯聳臆臃膺臂臀膿膽臉膾臨舉艱薪"], ["c1a1", "薄蕾薜薑薔薯薛薇薨薊虧蟀蟑螳蟒蟆螫螻螺蟈蟋褻褶襄褸褽覬謎謗謙講謊謠謝謄謐豁谿豳賺賽購賸賻趨蹉蹋蹈蹊轄輾轂轅輿避遽還邁邂邀鄹醣醞醜鍍鎂錨鍵鍊鍥鍋錘鍾鍬鍛鍰鍚鍔闊闋闌闈闆隱隸雖霜霞鞠韓顆颶餵騁"], ["c240", "駿鮮鮫鮪鮭鴻鴿麋黏點黜黝黛鼾齋叢嚕嚮壙壘嬸彝懣戳擴擲擾攆擺擻擷斷曜朦檳檬櫃檻檸櫂檮檯歟歸殯瀉瀋濾瀆濺瀑瀏燻燼燾燸獷獵璧璿甕癖癘"], ["c2a1", "癒瞽瞿瞻瞼礎禮穡穢穠竄竅簫簧簪簞簣簡糧織繕繞繚繡繒繙罈翹翻職聶臍臏舊藏薩藍藐藉薰薺薹薦蟯蟬蟲蟠覆覲觴謨謹謬謫豐贅蹙蹣蹦蹤蹟蹕軀轉轍邇邃邈醫醬釐鎔鎊鎖鎢鎳鎮鎬鎰鎘鎚鎗闔闖闐闕離雜雙雛雞霤鞣鞦"], ["c340", "鞭韹額顏題顎顓颺餾餿餽餮馥騎髁鬃鬆魏魎魍鯊鯉鯽鯈鯀鵑鵝鵠黠鼕鼬儳嚥壞壟壢寵龐廬懲懷懶懵攀攏曠曝櫥櫝櫚櫓瀛瀟瀨瀚瀝瀕瀘爆爍牘犢獸"], ["c3a1", "獺璽瓊瓣疇疆癟癡矇礙禱穫穩簾簿簸簽簷籀繫繭繹繩繪羅繳羶羹羸臘藩藝藪藕藤藥藷蟻蠅蠍蟹蟾襠襟襖襞譁譜識證譚譎譏譆譙贈贊蹼蹲躇蹶蹬蹺蹴轔轎辭邊邋醱醮鏡鏑鏟鏃鏈鏜鏝鏖鏢鏍鏘鏤鏗鏨關隴難霪霧靡韜韻類"], ["c440", "願顛颼饅饉騖騙鬍鯨鯧鯖鯛鶉鵡鵲鵪鵬麒麗麓麴勸嚨嚷嚶嚴嚼壤孀孃孽寶巉懸懺攘攔攙曦朧櫬瀾瀰瀲爐獻瓏癢癥礦礪礬礫竇競籌籃籍糯糰辮繽繼"], ["c4a1", "纂罌耀臚艦藻藹蘑藺蘆蘋蘇蘊蠔蠕襤覺觸議譬警譯譟譫贏贍躉躁躅躂醴釋鐘鐃鏽闡霰飄饒饑馨騫騰騷騵鰓鰍鹹麵黨鼯齟齣齡儷儸囁囀囂夔屬巍懼懾攝攜斕曩櫻欄櫺殲灌爛犧瓖瓔癩矓籐纏續羼蘗蘭蘚蠣蠢蠡蠟襪襬覽譴"], ["c540", "護譽贓躊躍躋轟辯醺鐮鐳鐵鐺鐸鐲鐫闢霸霹露響顧顥饗驅驃驀騾髏魔魑鰭鰥鶯鶴鷂鶸麝黯鼙齜齦齧儼儻囈囊囉孿巔巒彎懿攤權歡灑灘玀瓤疊癮癬"], ["c5a1", "禳籠籟聾聽臟襲襯觼讀贖贗躑躓轡酈鑄鑑鑒霽霾韃韁顫饕驕驍髒鬚鱉鰱鰾鰻鷓鷗鼴齬齪龔囌巖戀攣攫攪曬欐瓚竊籤籣籥纓纖纔臢蘸蘿蠱變邐邏鑣鑠鑤靨顯饜驚驛驗髓體髑鱔鱗鱖鷥麟黴囑壩攬灞癱癲矗罐羈蠶蠹衢讓讒"], ["c640", "讖艷贛釀鑪靂靈靄韆顰驟鬢魘鱟鷹鷺鹼鹽鼇齷齲廳欖灣籬籮蠻觀躡釁鑲鑰顱饞髖鬣黌灤矚讚鑷韉驢驥纜讜躪釅鑽鑾鑼鱷鱸黷豔鑿鸚爨驪鬱鸛鸞籲"], ["c940", "乂乜凵匚厂万丌乇亍囗兀屮彳丏冇与丮亓仂仉仈冘勼卬厹圠夃夬尐巿旡殳毌气爿丱丼仨仜仩仡仝仚刌匜卌圢圣夗夯宁宄尒尻屴屳帄庀庂忉戉扐氕"], ["c9a1", "氶汃氿氻犮犰玊禸肊阞伎优伬仵伔仱伀价伈伝伂伅伢伓伄仴伒冱刓刉刐劦匢匟卍厊吇囡囟圮圪圴夼妀奼妅奻奾奷奿孖尕尥屼屺屻屾巟幵庄异弚彴忕忔忏扜扞扤扡扦扢扙扠扚扥旯旮朾朹朸朻机朿朼朳氘汆汒汜汏汊汔汋"], ["ca40", "汌灱牞犴犵玎甪癿穵网艸艼芀艽艿虍襾邙邗邘邛邔阢阤阠阣佖伻佢佉体佤伾佧佒佟佁佘伭伳伿佡冏冹刜刞刡劭劮匉卣卲厎厏吰吷吪呔呅吙吜吥吘"], ["caa1", "吽呏呁吨吤呇囮囧囥坁坅坌坉坋坒夆奀妦妘妠妗妎妢妐妏妧妡宎宒尨尪岍岏岈岋岉岒岊岆岓岕巠帊帎庋庉庌庈庍弅弝彸彶忒忑忐忭忨忮忳忡忤忣忺忯忷忻怀忴戺抃抌抎抏抔抇扱扻扺扰抁抈扷扽扲扴攷旰旴旳旲旵杅杇"], ["cb40", "杙杕杌杈杝杍杚杋毐氙氚汸汧汫沄沋沏汱汯汩沚汭沇沕沜汦汳汥汻沎灴灺牣犿犽狃狆狁犺狅玕玗玓玔玒町甹疔疕皁礽耴肕肙肐肒肜芐芏芅芎芑芓"], ["cba1", "芊芃芄豸迉辿邟邡邥邞邧邠阰阨阯阭丳侘佼侅佽侀侇佶佴侉侄佷佌侗佪侚佹侁佸侐侜侔侞侒侂侕佫佮冞冼冾刵刲刳剆刱劼匊匋匼厒厔咇呿咁咑咂咈呫呺呾呥呬呴呦咍呯呡呠咘呣呧呤囷囹坯坲坭坫坱坰坶垀坵坻坳坴坢"], ["cc40", "坨坽夌奅妵妺姏姎妲姌姁妶妼姃姖妱妽姀姈妴姇孢孥宓宕屄屇岮岤岠岵岯岨岬岟岣岭岢岪岧岝岥岶岰岦帗帔帙弨弢弣弤彔徂彾彽忞忥怭怦怙怲怋"], ["cca1", "怴怊怗怳怚怞怬怢怍怐怮怓怑怌怉怜戔戽抭抴拑抾抪抶拊抮抳抯抻抩抰抸攽斨斻昉旼昄昒昈旻昃昋昍昅旽昑昐曶朊枅杬枎枒杶杻枘枆构杴枍枌杺枟枑枙枃杽极杸杹枔欥殀歾毞氝沓泬泫泮泙沶泔沭泧沷泐泂沺泃泆泭泲"], ["cd40", "泒泝沴沊沝沀泞泀洰泍泇沰泹泏泩泑炔炘炅炓炆炄炑炖炂炚炃牪狖狋狘狉狜狒狔狚狌狑玤玡玭玦玢玠玬玝瓝瓨甿畀甾疌疘皯盳盱盰盵矸矼矹矻矺"], ["cda1", "矷祂礿秅穸穻竻籵糽耵肏肮肣肸肵肭舠芠苀芫芚芘芛芵芧芮芼芞芺芴芨芡芩苂芤苃芶芢虰虯虭虮豖迒迋迓迍迖迕迗邲邴邯邳邰阹阽阼阺陃俍俅俓侲俉俋俁俔俜俙侻侳俛俇俖侺俀侹俬剄剉勀勂匽卼厗厖厙厘咺咡咭咥哏"], ["ce40", "哃茍咷咮哖咶哅哆咠呰咼咢咾呲哞咰垵垞垟垤垌垗垝垛垔垘垏垙垥垚垕壴复奓姡姞姮娀姱姝姺姽姼姶姤姲姷姛姩姳姵姠姾姴姭宨屌峐峘峌峗峋峛"], ["cea1", "峞峚峉峇峊峖峓峔峏峈峆峎峟峸巹帡帢帣帠帤庰庤庢庛庣庥弇弮彖徆怷怹恔恲恞恅恓恇恉恛恌恀恂恟怤恄恘恦恮扂扃拏挍挋拵挎挃拫拹挏挌拸拶挀挓挔拺挕拻拰敁敃斪斿昶昡昲昵昜昦昢昳昫昺昝昴昹昮朏朐柁柲柈枺"], ["cf40", "柜枻柸柘柀枷柅柫柤柟枵柍枳柷柶柮柣柂枹柎柧柰枲柼柆柭柌枮柦柛柺柉柊柃柪柋欨殂殄殶毖毘毠氠氡洨洴洭洟洼洿洒洊泚洳洄洙洺洚洑洀洝浂"], ["cfa1", "洁洘洷洃洏浀洇洠洬洈洢洉洐炷炟炾炱炰炡炴炵炩牁牉牊牬牰牳牮狊狤狨狫狟狪狦狣玅珌珂珈珅玹玶玵玴珫玿珇玾珃珆玸珋瓬瓮甮畇畈疧疪癹盄眈眃眄眅眊盷盻盺矧矨砆砑砒砅砐砏砎砉砃砓祊祌祋祅祄秕种秏秖秎窀"], ["d040", "穾竑笀笁籺籸籹籿粀粁紃紈紁罘羑羍羾耇耎耏耔耷胘胇胠胑胈胂胐胅胣胙胜胊胕胉胏胗胦胍臿舡芔苙苾苹茇苨茀苕茺苫苖苴苬苡苲苵茌苻苶苰苪"], ["d0a1", "苤苠苺苳苭虷虴虼虳衁衎衧衪衩觓訄訇赲迣迡迮迠郱邽邿郕郅邾郇郋郈釔釓陔陏陑陓陊陎倞倅倇倓倢倰倛俵俴倳倷倬俶俷倗倜倠倧倵倯倱倎党冔冓凊凄凅凈凎剡剚剒剞剟剕剢勍匎厞唦哢唗唒哧哳哤唚哿唄唈哫唑唅哱"], ["d140", "唊哻哷哸哠唎唃唋圁圂埌堲埕埒垺埆垽垼垸垶垿埇埐垹埁夎奊娙娖娭娮娕娏娗娊娞娳孬宧宭宬尃屖屔峬峿峮峱峷崀峹帩帨庨庮庪庬弳弰彧恝恚恧"], ["d1a1", "恁悢悈悀悒悁悝悃悕悛悗悇悜悎戙扆拲挐捖挬捄捅挶捃揤挹捋捊挼挩捁挴捘捔捙挭捇挳捚捑挸捗捀捈敊敆旆旃旄旂晊晟晇晑朒朓栟栚桉栲栳栻桋桏栖栱栜栵栫栭栯桎桄栴栝栒栔栦栨栮桍栺栥栠欬欯欭欱欴歭肂殈毦毤"], ["d240", "毨毣毢毧氥浺浣浤浶洍浡涒浘浢浭浯涑涍淯浿涆浞浧浠涗浰浼浟涂涘洯浨涋浾涀涄洖涃浻浽浵涐烜烓烑烝烋缹烢烗烒烞烠烔烍烅烆烇烚烎烡牂牸"], ["d2a1", "牷牶猀狺狴狾狶狳狻猁珓珙珥珖玼珧珣珩珜珒珛珔珝珚珗珘珨瓞瓟瓴瓵甡畛畟疰痁疻痄痀疿疶疺皊盉眝眛眐眓眒眣眑眕眙眚眢眧砣砬砢砵砯砨砮砫砡砩砳砪砱祔祛祏祜祓祒祑秫秬秠秮秭秪秜秞秝窆窉窅窋窌窊窇竘笐"], ["d340", "笄笓笅笏笈笊笎笉笒粄粑粊粌粈粍粅紞紝紑紎紘紖紓紟紒紏紌罜罡罞罠罝罛羖羒翃翂翀耖耾耹胺胲胹胵脁胻脀舁舯舥茳茭荄茙荑茥荖茿荁茦茜茢"], ["d3a1", "荂荎茛茪茈茼荍茖茤茠茷茯茩荇荅荌荓茞茬荋茧荈虓虒蚢蚨蚖蚍蚑蚞蚇蚗蚆蚋蚚蚅蚥蚙蚡蚧蚕蚘蚎蚝蚐蚔衃衄衭衵衶衲袀衱衿衯袃衾衴衼訒豇豗豻貤貣赶赸趵趷趶軑軓迾迵适迿迻逄迼迶郖郠郙郚郣郟郥郘郛郗郜郤酐"], ["d440", "酎酏釕釢釚陜陟隼飣髟鬯乿偰偪偡偞偠偓偋偝偲偈偍偁偛偊偢倕偅偟偩偫偣偤偆偀偮偳偗偑凐剫剭剬剮勖勓匭厜啵啶唼啍啐唴唪啑啢唶唵唰啒啅"], ["d4a1", "唌唲啥啎唹啈唭唻啀啋圊圇埻堔埢埶埜埴堀埭埽堈埸堋埳埏堇埮埣埲埥埬埡堎埼堐埧堁堌埱埩埰堍堄奜婠婘婕婧婞娸娵婭婐婟婥婬婓婤婗婃婝婒婄婛婈媎娾婍娹婌婰婩婇婑婖婂婜孲孮寁寀屙崞崋崝崚崠崌崨崍崦崥崏"], ["d540", "崰崒崣崟崮帾帴庱庴庹庲庳弶弸徛徖徟悊悐悆悾悰悺惓惔惏惤惙惝惈悱惛悷惊悿惃惍惀挲捥掊掂捽掽掞掭掝掗掫掎捯掇掐据掯捵掜捭掮捼掤挻掟"], ["d5a1", "捸掅掁掑掍捰敓旍晥晡晛晙晜晢朘桹梇梐梜桭桮梮梫楖桯梣梬梩桵桴梲梏桷梒桼桫桲梪梀桱桾梛梖梋梠梉梤桸桻梑梌梊桽欶欳欷欸殑殏殍殎殌氪淀涫涴涳湴涬淩淢涷淶淔渀淈淠淟淖涾淥淜淝淛淴淊涽淭淰涺淕淂淏淉"], ["d640", "淐淲淓淽淗淍淣涻烺焍烷焗烴焌烰焄烳焐烼烿焆焓焀烸烶焋焂焎牾牻牼牿猝猗猇猑猘猊猈狿猏猞玈珶珸珵琄琁珽琇琀珺珼珿琌琋珴琈畤畣痎痒痏"], ["d6a1", "痋痌痑痐皏皉盓眹眯眭眱眲眴眳眽眥眻眵硈硒硉硍硊硌砦硅硐祤祧祩祪祣祫祡离秺秸秶秷窏窔窐笵筇笴笥笰笢笤笳笘笪笝笱笫笭笯笲笸笚笣粔粘粖粣紵紽紸紶紺絅紬紩絁絇紾紿絊紻紨罣羕羜羝羛翊翋翍翐翑翇翏翉耟"], ["d740", "耞耛聇聃聈脘脥脙脛脭脟脬脞脡脕脧脝脢舑舸舳舺舴舲艴莐莣莨莍荺荳莤荴莏莁莕莙荵莔莩荽莃莌莝莛莪莋荾莥莯莈莗莰荿莦莇莮荶莚虙虖蚿蚷"], ["d7a1", "蛂蛁蛅蚺蚰蛈蚹蚳蚸蛌蚴蚻蚼蛃蚽蚾衒袉袕袨袢袪袚袑袡袟袘袧袙袛袗袤袬袌袓袎覂觖觙觕訰訧訬訞谹谻豜豝豽貥赽赻赹趼跂趹趿跁軘軞軝軜軗軠軡逤逋逑逜逌逡郯郪郰郴郲郳郔郫郬郩酖酘酚酓酕釬釴釱釳釸釤釹釪"], ["d840", "釫釷釨釮镺閆閈陼陭陫陱陯隿靪頄飥馗傛傕傔傞傋傣傃傌傎傝偨傜傒傂傇兟凔匒匑厤厧喑喨喥喭啷噅喢喓喈喏喵喁喣喒喤啽喌喦啿喕喡喎圌堩堷"], ["d8a1", "堙堞堧堣堨埵塈堥堜堛堳堿堶堮堹堸堭堬堻奡媯媔媟婺媢媞婸媦婼媥媬媕媮娷媄媊媗媃媋媩婻婽媌媜媏媓媝寪寍寋寔寑寊寎尌尰崷嵃嵫嵁嵋崿崵嵑嵎嵕崳崺嵒崽崱嵙嵂崹嵉崸崼崲崶嵀嵅幄幁彘徦徥徫惉悹惌惢惎惄愔"], ["d940", "惲愊愖愅惵愓惸惼惾惁愃愘愝愐惿愄愋扊掔掱掰揎揥揨揯揃撝揳揊揠揶揕揲揵摡揟掾揝揜揄揘揓揂揇揌揋揈揰揗揙攲敧敪敤敜敨敥斌斝斞斮旐旒"], ["d9a1", "晼晬晻暀晱晹晪晲朁椌棓椄棜椪棬棪棱椏棖棷棫棤棶椓椐棳棡椇棌椈楰梴椑棯棆椔棸棐棽棼棨椋椊椗棎棈棝棞棦棴棑椆棔棩椕椥棇欹欻欿欼殔殗殙殕殽毰毲毳氰淼湆湇渟湉溈渼渽湅湢渫渿湁湝湳渜渳湋湀湑渻渃渮湞"], ["da40", "湨湜湡渱渨湠湱湫渹渢渰湓湥渧湸湤湷湕湹湒湦渵渶湚焠焞焯烻焮焱焣焥焢焲焟焨焺焛牋牚犈犉犆犅犋猒猋猰猢猱猳猧猲猭猦猣猵猌琮琬琰琫琖"], ["daa1", "琚琡琭琱琤琣琝琩琠琲瓻甯畯畬痧痚痡痦痝痟痤痗皕皒盚睆睇睄睍睅睊睎睋睌矞矬硠硤硥硜硭硱硪确硰硩硨硞硢祴祳祲祰稂稊稃稌稄窙竦竤筊笻筄筈筌筎筀筘筅粢粞粨粡絘絯絣絓絖絧絪絏絭絜絫絒絔絩絑絟絎缾缿罥"], ["db40", "罦羢羠羡翗聑聏聐胾胔腃腊腒腏腇脽腍脺臦臮臷臸臹舄舼舽舿艵茻菏菹萣菀菨萒菧菤菼菶萐菆菈菫菣莿萁菝菥菘菿菡菋菎菖菵菉萉萏菞萑萆菂菳"], ["dba1", "菕菺菇菑菪萓菃菬菮菄菻菗菢萛菛菾蛘蛢蛦蛓蛣蛚蛪蛝蛫蛜蛬蛩蛗蛨蛑衈衖衕袺裗袹袸裀袾袶袼袷袽袲褁裉覕覘覗觝觚觛詎詍訹詙詀詗詘詄詅詒詈詑詊詌詏豟貁貀貺貾貰貹貵趄趀趉跘跓跍跇跖跜跏跕跙跈跗跅軯軷軺"], ["dc40", "軹軦軮軥軵軧軨軶軫軱軬軴軩逭逴逯鄆鄬鄄郿郼鄈郹郻鄁鄀鄇鄅鄃酡酤酟酢酠鈁鈊鈥鈃鈚鈦鈏鈌鈀鈒釿釽鈆鈄鈧鈂鈜鈤鈙鈗鈅鈖镻閍閌閐隇陾隈"], ["dca1", "隉隃隀雂雈雃雱雰靬靰靮頇颩飫鳦黹亃亄亶傽傿僆傮僄僊傴僈僂傰僁傺傱僋僉傶傸凗剺剸剻剼嗃嗛嗌嗐嗋嗊嗝嗀嗔嗄嗩喿嗒喍嗏嗕嗢嗖嗈嗲嗍嗙嗂圔塓塨塤塏塍塉塯塕塎塝塙塥塛堽塣塱壼嫇嫄嫋媺媸媱媵媰媿嫈媻嫆"], ["dd40", "媷嫀嫊媴媶嫍媹媐寖寘寙尟尳嵱嵣嵊嵥嵲嵬嵞嵨嵧嵢巰幏幎幊幍幋廅廌廆廋廇彀徯徭惷慉慊愫慅愶愲愮慆愯慏愩慀戠酨戣戥戤揅揱揫搐搒搉搠搤"], ["dda1", "搳摃搟搕搘搹搷搢搣搌搦搰搨摁搵搯搊搚摀搥搧搋揧搛搮搡搎敯斒旓暆暌暕暐暋暊暙暔晸朠楦楟椸楎楢楱椿楅楪椹楂楗楙楺楈楉椵楬椳椽楥棰楸椴楩楀楯楄楶楘楁楴楌椻楋椷楜楏楑椲楒椯楻椼歆歅歃歂歈歁殛嗀毻毼"], ["de40", "毹毷毸溛滖滈溏滀溟溓溔溠溱溹滆滒溽滁溞滉溷溰滍溦滏溲溾滃滜滘溙溒溎溍溤溡溿溳滐滊溗溮溣煇煔煒煣煠煁煝煢煲煸煪煡煂煘煃煋煰煟煐煓"], ["dea1", "煄煍煚牏犍犌犑犐犎猼獂猻猺獀獊獉瑄瑊瑋瑒瑑瑗瑀瑏瑐瑎瑂瑆瑍瑔瓡瓿瓾瓽甝畹畷榃痯瘏瘃痷痾痼痹痸瘐痻痶痭痵痽皙皵盝睕睟睠睒睖睚睩睧睔睙睭矠碇碚碔碏碄碕碅碆碡碃硹碙碀碖硻祼禂祽祹稑稘稙稒稗稕稢稓"], ["df40", "稛稐窣窢窞竫筦筤筭筴筩筲筥筳筱筰筡筸筶筣粲粴粯綈綆綀綍絿綅絺綎絻綃絼綌綔綄絽綒罭罫罧罨罬羦羥羧翛翜耡腤腠腷腜腩腛腢腲朡腞腶腧腯"], ["dfa1", "腄腡舝艉艄艀艂艅蓱萿葖葶葹蒏蒍葥葑葀蒆葧萰葍葽葚葙葴葳葝蔇葞萷萺萴葺葃葸萲葅萩菙葋萯葂萭葟葰萹葎葌葒葯蓅蒎萻葇萶萳葨葾葄萫葠葔葮葐蜋蜄蛷蜌蛺蛖蛵蝍蛸蜎蜉蜁蛶蜍蜅裖裋裍裎裞裛裚裌裐覅覛觟觥觤"], ["e040", "觡觠觢觜触詶誆詿詡訿詷誂誄詵誃誁詴詺谼豋豊豥豤豦貆貄貅賌赨赩趑趌趎趏趍趓趔趐趒跰跠跬跱跮跐跩跣跢跧跲跫跴輆軿輁輀輅輇輈輂輋遒逿"], ["e0a1", "遄遉逽鄐鄍鄏鄑鄖鄔鄋鄎酮酯鉈鉒鈰鈺鉦鈳鉥鉞銃鈮鉊鉆鉭鉬鉏鉠鉧鉯鈶鉡鉰鈱鉔鉣鉐鉲鉎鉓鉌鉖鈲閟閜閞閛隒隓隑隗雎雺雽雸雵靳靷靸靲頏頍頎颬飶飹馯馲馰馵骭骫魛鳪鳭鳧麀黽僦僔僗僨僳僛僪僝僤僓僬僰僯僣僠"], ["e140", "凘劀劁勩勫匰厬嘧嘕嘌嘒嗼嘏嘜嘁嘓嘂嗺嘝嘄嗿嗹墉塼墐墘墆墁塿塴墋塺墇墑墎塶墂墈塻墔墏壾奫嫜嫮嫥嫕嫪嫚嫭嫫嫳嫢嫠嫛嫬嫞嫝嫙嫨嫟孷寠"], ["e1a1", "寣屣嶂嶀嵽嶆嵺嶁嵷嶊嶉嶈嵾嵼嶍嵹嵿幘幙幓廘廑廗廎廜廕廙廒廔彄彃彯徶愬愨慁慞慱慳慒慓慲慬憀慴慔慺慛慥愻慪慡慖戩戧戫搫摍摛摝摴摶摲摳摽摵摦撦摎撂摞摜摋摓摠摐摿搿摬摫摙摥摷敳斠暡暠暟朅朄朢榱榶槉"], ["e240", "榠槎榖榰榬榼榑榙榎榧榍榩榾榯榿槄榽榤槔榹槊榚槏榳榓榪榡榞槙榗榐槂榵榥槆歊歍歋殞殟殠毃毄毾滎滵滱漃漥滸漷滻漮漉潎漙漚漧漘漻漒滭漊"], ["e2a1", "漶潳滹滮漭潀漰漼漵滫漇漎潃漅滽滶漹漜滼漺漟漍漞漈漡熇熐熉熀熅熂熏煻熆熁熗牄牓犗犕犓獃獍獑獌瑢瑳瑱瑵瑲瑧瑮甀甂甃畽疐瘖瘈瘌瘕瘑瘊瘔皸瞁睼瞅瞂睮瞀睯睾瞃碲碪碴碭碨硾碫碞碥碠碬碢碤禘禊禋禖禕禔禓"], ["e340", "禗禈禒禐稫穊稰稯稨稦窨窫窬竮箈箜箊箑箐箖箍箌箛箎箅箘劄箙箤箂粻粿粼粺綧綷緂綣綪緁緀緅綝緎緄緆緋緌綯綹綖綼綟綦綮綩綡緉罳翢翣翥翞"], ["e3a1", "耤聝聜膉膆膃膇膍膌膋舕蒗蒤蒡蒟蒺蓎蓂蒬蒮蒫蒹蒴蓁蓍蒪蒚蒱蓐蒝蒧蒻蒢蒔蓇蓌蒛蒩蒯蒨蓖蒘蒶蓏蒠蓗蓔蓒蓛蒰蒑虡蜳蜣蜨蝫蝀蜮蜞蜡蜙蜛蝃蜬蝁蜾蝆蜠蜲蜪蜭蜼蜒蜺蜱蜵蝂蜦蜧蜸蜤蜚蜰蜑裷裧裱裲裺裾裮裼裶裻"], ["e440", "裰裬裫覝覡覟覞觩觫觨誫誙誋誒誏誖谽豨豩賕賏賗趖踉踂跿踍跽踊踃踇踆踅跾踀踄輐輑輎輍鄣鄜鄠鄢鄟鄝鄚鄤鄡鄛酺酲酹酳銥銤鉶銛鉺銠銔銪銍"], ["e4a1", "銦銚銫鉹銗鉿銣鋮銎銂銕銢鉽銈銡銊銆銌銙銧鉾銇銩銝銋鈭隞隡雿靘靽靺靾鞃鞀鞂靻鞄鞁靿韎韍頖颭颮餂餀餇馝馜駃馹馻馺駂馽駇骱髣髧鬾鬿魠魡魟鳱鳲鳵麧僿儃儰僸儆儇僶僾儋儌僽儊劋劌勱勯噈噂噌嘵噁噊噉噆噘"], ["e540", "噚噀嘳嘽嘬嘾嘸嘪嘺圚墫墝墱墠墣墯墬墥墡壿嫿嫴嫽嫷嫶嬃嫸嬂嫹嬁嬇嬅嬏屧嶙嶗嶟嶒嶢嶓嶕嶠嶜嶡嶚嶞幩幝幠幜緳廛廞廡彉徲憋憃慹憱憰憢憉"], ["e5a1", "憛憓憯憭憟憒憪憡憍慦憳戭摮摰撖撠撅撗撜撏撋撊撌撣撟摨撱撘敶敺敹敻斲斳暵暰暩暲暷暪暯樀樆樗槥槸樕槱槤樠槿槬槢樛樝槾樧槲槮樔槷槧橀樈槦槻樍槼槫樉樄樘樥樏槶樦樇槴樖歑殥殣殢殦氁氀毿氂潁漦潾澇濆澒"], ["e640", "澍澉澌潢潏澅潚澖潶潬澂潕潲潒潐潗澔澓潝漀潡潫潽潧澐潓澋潩潿澕潣潷潪潻熲熯熛熰熠熚熩熵熝熥熞熤熡熪熜熧熳犘犚獘獒獞獟獠獝獛獡獚獙"], ["e6a1", "獢璇璉璊璆璁瑽璅璈瑼瑹甈甇畾瘥瘞瘙瘝瘜瘣瘚瘨瘛皜皝皞皛瞍瞏瞉瞈磍碻磏磌磑磎磔磈磃磄磉禚禡禠禜禢禛歶稹窲窴窳箷篋箾箬篎箯箹篊箵糅糈糌糋緷緛緪緧緗緡縃緺緦緶緱緰緮緟罶羬羰羭翭翫翪翬翦翨聤聧膣膟"], ["e740", "膞膕膢膙膗舖艏艓艒艐艎艑蔤蔻蔏蔀蔩蔎蔉蔍蔟蔊蔧蔜蓻蔫蓺蔈蔌蓴蔪蓲蔕蓷蓫蓳蓼蔒蓪蓩蔖蓾蔨蔝蔮蔂蓽蔞蓶蔱蔦蓧蓨蓰蓯蓹蔘蔠蔰蔋蔙蔯虢"], ["e7a1", "蝖蝣蝤蝷蟡蝳蝘蝔蝛蝒蝡蝚蝑蝞蝭蝪蝐蝎蝟蝝蝯蝬蝺蝮蝜蝥蝏蝻蝵蝢蝧蝩衚褅褌褔褋褗褘褙褆褖褑褎褉覢覤覣觭觰觬諏諆誸諓諑諔諕誻諗誾諀諅諘諃誺誽諙谾豍貏賥賟賙賨賚賝賧趠趜趡趛踠踣踥踤踮踕踛踖踑踙踦踧"], ["e840", "踔踒踘踓踜踗踚輬輤輘輚輠輣輖輗遳遰遯遧遫鄯鄫鄩鄪鄲鄦鄮醅醆醊醁醂醄醀鋐鋃鋄鋀鋙銶鋏鋱鋟鋘鋩鋗鋝鋌鋯鋂鋨鋊鋈鋎鋦鋍鋕鋉鋠鋞鋧鋑鋓"], ["e8a1", "銵鋡鋆銴镼閬閫閮閰隤隢雓霅霈霂靚鞊鞎鞈韐韏頞頝頦頩頨頠頛頧颲餈飺餑餔餖餗餕駜駍駏駓駔駎駉駖駘駋駗駌骳髬髫髳髲髱魆魃魧魴魱魦魶魵魰魨魤魬鳼鳺鳽鳿鳷鴇鴀鳹鳻鴈鴅鴄麃黓鼏鼐儜儓儗儚儑凞匴叡噰噠噮"], ["e940", "噳噦噣噭噲噞噷圜圛壈墽壉墿墺壂墼壆嬗嬙嬛嬡嬔嬓嬐嬖嬨嬚嬠嬞寯嶬嶱嶩嶧嶵嶰嶮嶪嶨嶲嶭嶯嶴幧幨幦幯廩廧廦廨廥彋徼憝憨憖懅憴懆懁懌憺"], ["e9a1", "憿憸憌擗擖擐擏擉撽撉擃擛擳擙攳敿敼斢曈暾曀曊曋曏暽暻暺曌朣樴橦橉橧樲橨樾橝橭橶橛橑樨橚樻樿橁橪橤橐橏橔橯橩橠樼橞橖橕橍橎橆歕歔歖殧殪殫毈毇氄氃氆澭濋澣濇澼濎濈潞濄澽澞濊澨瀄澥澮澺澬澪濏澿澸"], ["ea40", "澢濉澫濍澯澲澰燅燂熿熸燖燀燁燋燔燊燇燏熽燘熼燆燚燛犝犞獩獦獧獬獥獫獪瑿璚璠璔璒璕璡甋疀瘯瘭瘱瘽瘳瘼瘵瘲瘰皻盦瞚瞝瞡瞜瞛瞢瞣瞕瞙"], ["eaa1", "瞗磝磩磥磪磞磣磛磡磢磭磟磠禤穄穈穇窶窸窵窱窷篞篣篧篝篕篥篚篨篹篔篪篢篜篫篘篟糒糔糗糐糑縒縡縗縌縟縠縓縎縜縕縚縢縋縏縖縍縔縥縤罃罻罼罺羱翯耪耩聬膱膦膮膹膵膫膰膬膴膲膷膧臲艕艖艗蕖蕅蕫蕍蕓蕡蕘"], ["eb40", "蕀蕆蕤蕁蕢蕄蕑蕇蕣蔾蕛蕱蕎蕮蕵蕕蕧蕠薌蕦蕝蕔蕥蕬虣虥虤螛螏螗螓螒螈螁螖螘蝹螇螣螅螐螑螝螄螔螜螚螉褞褦褰褭褮褧褱褢褩褣褯褬褟觱諠"], ["eba1", "諢諲諴諵諝謔諤諟諰諈諞諡諨諿諯諻貑貒貐賵賮賱賰賳赬赮趥趧踳踾踸蹀蹅踶踼踽蹁踰踿躽輶輮輵輲輹輷輴遶遹遻邆郺鄳鄵鄶醓醐醑醍醏錧錞錈錟錆錏鍺錸錼錛錣錒錁鍆錭錎錍鋋錝鋺錥錓鋹鋷錴錂錤鋿錩錹錵錪錔錌"], ["ec40", "錋鋾錉錀鋻錖閼闍閾閹閺閶閿閵閽隩雔霋霒霐鞙鞗鞔韰韸頵頯頲餤餟餧餩馞駮駬駥駤駰駣駪駩駧骹骿骴骻髶髺髹髷鬳鮀鮅鮇魼魾魻鮂鮓鮒鮐魺鮕"], ["eca1", "魽鮈鴥鴗鴠鴞鴔鴩鴝鴘鴢鴐鴙鴟麈麆麇麮麭黕黖黺鼒鼽儦儥儢儤儠儩勴嚓嚌嚍嚆嚄嚃噾嚂噿嚁壖壔壏壒嬭嬥嬲嬣嬬嬧嬦嬯嬮孻寱寲嶷幬幪徾徻懃憵憼懧懠懥懤懨懞擯擩擣擫擤擨斁斀斶旚曒檍檖檁檥檉檟檛檡檞檇檓檎"], ["ed40", "檕檃檨檤檑橿檦檚檅檌檒歛殭氉濌澩濴濔濣濜濭濧濦濞濲濝濢濨燡燱燨燲燤燰燢獳獮獯璗璲璫璐璪璭璱璥璯甐甑甒甏疄癃癈癉癇皤盩瞵瞫瞲瞷瞶"], ["eda1", "瞴瞱瞨矰磳磽礂磻磼磲礅磹磾礄禫禨穜穛穖穘穔穚窾竀竁簅簏篲簀篿篻簎篴簋篳簂簉簃簁篸篽簆篰篱簐簊糨縭縼繂縳顈縸縪繉繀繇縩繌縰縻縶繄縺罅罿罾罽翴翲耬膻臄臌臊臅臇膼臩艛艚艜薃薀薏薧薕薠薋薣蕻薤薚薞"], ["ee40", "蕷蕼薉薡蕺蕸蕗薎薖薆薍薙薝薁薢薂薈薅蕹蕶薘薐薟虨螾螪螭蟅螰螬螹螵螼螮蟉蟃蟂蟌螷螯蟄蟊螴螶螿螸螽蟞螲褵褳褼褾襁襒褷襂覭覯覮觲觳謞"], ["eea1", "謘謖謑謅謋謢謏謒謕謇謍謈謆謜謓謚豏豰豲豱豯貕貔賹赯蹎蹍蹓蹐蹌蹇轃轀邅遾鄸醚醢醛醙醟醡醝醠鎡鎃鎯鍤鍖鍇鍼鍘鍜鍶鍉鍐鍑鍠鍭鎏鍌鍪鍹鍗鍕鍒鍏鍱鍷鍻鍡鍞鍣鍧鎀鍎鍙闇闀闉闃闅閷隮隰隬霠霟霘霝霙鞚鞡鞜"], ["ef40", "鞞鞝韕韔韱顁顄顊顉顅顃餥餫餬餪餳餲餯餭餱餰馘馣馡騂駺駴駷駹駸駶駻駽駾駼騃骾髾髽鬁髼魈鮚鮨鮞鮛鮦鮡鮥鮤鮆鮢鮠鮯鴳鵁鵧鴶鴮鴯鴱鴸鴰"], ["efa1", "鵅鵂鵃鴾鴷鵀鴽翵鴭麊麉麍麰黈黚黻黿鼤鼣鼢齔龠儱儭儮嚘嚜嚗嚚嚝嚙奰嬼屩屪巀幭幮懘懟懭懮懱懪懰懫懖懩擿攄擽擸攁攃擼斔旛曚曛曘櫅檹檽櫡櫆檺檶檷櫇檴檭歞毉氋瀇瀌瀍瀁瀅瀔瀎濿瀀濻瀦濼濷瀊爁燿燹爃燽獶"], ["f040", "璸瓀璵瓁璾璶璻瓂甔甓癜癤癙癐癓癗癚皦皽盬矂瞺磿礌礓礔礉礐礒礑禭禬穟簜簩簙簠簟簭簝簦簨簢簥簰繜繐繖繣繘繢繟繑繠繗繓羵羳翷翸聵臑臒"], ["f0a1", "臐艟艞薴藆藀藃藂薳薵薽藇藄薿藋藎藈藅薱薶藒蘤薸薷薾虩蟧蟦蟢蟛蟫蟪蟥蟟蟳蟤蟔蟜蟓蟭蟘蟣螤蟗蟙蠁蟴蟨蟝襓襋襏襌襆襐襑襉謪謧謣謳謰謵譇謯謼謾謱謥謷謦謶謮謤謻謽謺豂豵貙貘貗賾贄贂贀蹜蹢蹠蹗蹖蹞蹥蹧"], ["f140", "蹛蹚蹡蹝蹩蹔轆轇轈轋鄨鄺鄻鄾醨醥醧醯醪鎵鎌鎒鎷鎛鎝鎉鎧鎎鎪鎞鎦鎕鎈鎙鎟鎍鎱鎑鎲鎤鎨鎴鎣鎥闒闓闑隳雗雚巂雟雘雝霣霢霥鞬鞮鞨鞫鞤鞪"], ["f1a1", "鞢鞥韗韙韖韘韺顐顑顒颸饁餼餺騏騋騉騍騄騑騊騅騇騆髀髜鬈鬄鬅鬩鬵魊魌魋鯇鯆鯃鮿鯁鮵鮸鯓鮶鯄鮹鮽鵜鵓鵏鵊鵛鵋鵙鵖鵌鵗鵒鵔鵟鵘鵚麎麌黟鼁鼀鼖鼥鼫鼪鼩鼨齌齕儴儵劖勷厴嚫嚭嚦嚧嚪嚬壚壝壛夒嬽嬾嬿巃幰"], ["f240", "徿懻攇攐攍攉攌攎斄旞旝曞櫧櫠櫌櫑櫙櫋櫟櫜櫐櫫櫏櫍櫞歠殰氌瀙瀧瀠瀖瀫瀡瀢瀣瀩瀗瀤瀜瀪爌爊爇爂爅犥犦犤犣犡瓋瓅璷瓃甖癠矉矊矄矱礝礛"], ["f2a1", "礡礜礗礞禰穧穨簳簼簹簬簻糬糪繶繵繸繰繷繯繺繲繴繨罋罊羃羆羷翽翾聸臗臕艤艡艣藫藱藭藙藡藨藚藗藬藲藸藘藟藣藜藑藰藦藯藞藢蠀蟺蠃蟶蟷蠉蠌蠋蠆蟼蠈蟿蠊蠂襢襚襛襗襡襜襘襝襙覈覷覶觶譐譈譊譀譓譖譔譋譕"], ["f340", "譑譂譒譗豃豷豶貚贆贇贉趬趪趭趫蹭蹸蹳蹪蹯蹻軂轒轑轏轐轓辴酀鄿醰醭鏞鏇鏏鏂鏚鏐鏹鏬鏌鏙鎩鏦鏊鏔鏮鏣鏕鏄鏎鏀鏒鏧镽闚闛雡霩霫霬霨霦"], ["f3a1", "鞳鞷鞶韝韞韟顜顙顝顗颿颽颻颾饈饇饃馦馧騚騕騥騝騤騛騢騠騧騣騞騜騔髂鬋鬊鬎鬌鬷鯪鯫鯠鯞鯤鯦鯢鯰鯔鯗鯬鯜鯙鯥鯕鯡鯚鵷鶁鶊鶄鶈鵱鶀鵸鶆鶋鶌鵽鵫鵴鵵鵰鵩鶅鵳鵻鶂鵯鵹鵿鶇鵨麔麑黀黼鼭齀齁齍齖齗齘匷嚲"], ["f440", "嚵嚳壣孅巆巇廮廯忀忁懹攗攖攕攓旟曨曣曤櫳櫰櫪櫨櫹櫱櫮櫯瀼瀵瀯瀷瀴瀱灂瀸瀿瀺瀹灀瀻瀳灁爓爔犨獽獼璺皫皪皾盭矌矎矏矍矲礥礣礧礨礤礩"], ["f4a1", "禲穮穬穭竷籉籈籊籇籅糮繻繾纁纀羺翿聹臛臙舋艨艩蘢藿蘁藾蘛蘀藶蘄蘉蘅蘌藽蠙蠐蠑蠗蠓蠖襣襦覹觷譠譪譝譨譣譥譧譭趮躆躈躄轙轖轗轕轘轚邍酃酁醷醵醲醳鐋鐓鏻鐠鐏鐔鏾鐕鐐鐨鐙鐍鏵鐀鏷鐇鐎鐖鐒鏺鐉鏸鐊鏿"], ["f540", "鏼鐌鏶鐑鐆闞闠闟霮霯鞹鞻韽韾顠顢顣顟飁飂饐饎饙饌饋饓騲騴騱騬騪騶騩騮騸騭髇髊髆鬐鬒鬑鰋鰈鯷鰅鰒鯸鱀鰇鰎鰆鰗鰔鰉鶟鶙鶤鶝鶒鶘鶐鶛"], ["f5a1", "鶠鶔鶜鶪鶗鶡鶚鶢鶨鶞鶣鶿鶩鶖鶦鶧麙麛麚黥黤黧黦鼰鼮齛齠齞齝齙龑儺儹劘劗囃嚽嚾孈孇巋巏廱懽攛欂櫼欃櫸欀灃灄灊灈灉灅灆爝爚爙獾甗癪矐礭礱礯籔籓糲纊纇纈纋纆纍罍羻耰臝蘘蘪蘦蘟蘣蘜蘙蘧蘮蘡蘠蘩蘞蘥"], ["f640", "蠩蠝蠛蠠蠤蠜蠫衊襭襩襮襫觺譹譸譅譺譻贐贔趯躎躌轞轛轝酆酄酅醹鐿鐻鐶鐩鐽鐼鐰鐹鐪鐷鐬鑀鐱闥闤闣霵霺鞿韡顤飉飆飀饘饖騹騽驆驄驂驁騺"], ["f6a1", "騿髍鬕鬗鬘鬖鬺魒鰫鰝鰜鰬鰣鰨鰩鰤鰡鶷鶶鶼鷁鷇鷊鷏鶾鷅鷃鶻鶵鷎鶹鶺鶬鷈鶱鶭鷌鶳鷍鶲鹺麜黫黮黭鼛鼘鼚鼱齎齥齤龒亹囆囅囋奱孋孌巕巑廲攡攠攦攢欋欈欉氍灕灖灗灒爞爟犩獿瓘瓕瓙瓗癭皭礵禴穰穱籗籜籙籛籚"], ["f740", "糴糱纑罏羇臞艫蘴蘵蘳蘬蘲蘶蠬蠨蠦蠪蠥襱覿覾觻譾讄讂讆讅譿贕躕躔躚躒躐躖躗轠轢酇鑌鑐鑊鑋鑏鑇鑅鑈鑉鑆霿韣顪顩飋饔饛驎驓驔驌驏驈驊"], ["f7a1", "驉驒驐髐鬙鬫鬻魖魕鱆鱈鰿鱄鰹鰳鱁鰼鰷鰴鰲鰽鰶鷛鷒鷞鷚鷋鷐鷜鷑鷟鷩鷙鷘鷖鷵鷕鷝麶黰鼵鼳鼲齂齫龕龢儽劙壨壧奲孍巘蠯彏戁戃戄攩攥斖曫欑欒欏毊灛灚爢玂玁玃癰矔籧籦纕艬蘺虀蘹蘼蘱蘻蘾蠰蠲蠮蠳襶襴襳觾"], ["f840", "讌讎讋讈豅贙躘轤轣醼鑢鑕鑝鑗鑞韄韅頀驖驙鬞鬟鬠鱒鱘鱐鱊鱍鱋鱕鱙鱌鱎鷻鷷鷯鷣鷫鷸鷤鷶鷡鷮鷦鷲鷰鷢鷬鷴鷳鷨鷭黂黐黲黳鼆鼜鼸鼷鼶齃齏"], ["f8a1", "齱齰齮齯囓囍孎屭攭曭曮欓灟灡灝灠爣瓛瓥矕礸禷禶籪纗羉艭虃蠸蠷蠵衋讔讕躞躟躠躝醾醽釂鑫鑨鑩雥靆靃靇韇韥驞髕魙鱣鱧鱦鱢鱞鱠鸂鷾鸇鸃鸆鸅鸀鸁鸉鷿鷽鸄麠鼞齆齴齵齶囔攮斸欘欙欗欚灢爦犪矘矙礹籩籫糶纚"], ["f940", "纘纛纙臠臡虆虇虈襹襺襼襻觿讘讙躥躤躣鑮鑭鑯鑱鑳靉顲饟鱨鱮鱭鸋鸍鸐鸏鸒鸑麡黵鼉齇齸齻齺齹圞灦籯蠼趲躦釃鑴鑸鑶鑵驠鱴鱳鱱鱵鸔鸓黶鼊"], ["f9a1", "龤灨灥糷虪蠾蠽蠿讞貜躩軉靋顳顴飌饡馫驤驦驧鬤鸕鸗齈戇欞爧虌躨钂钀钁驩驨鬮鸙爩虋讟钃鱹麷癵驫鱺鸝灩灪麤齾齉龘碁銹裏墻恒粧嫺╔╦╗╠╬╣╚╩╝╒╤╕╞╪╡╘╧╛╓╥╖╟╫╢╙╨╜║═╭╮╰╯▓"]]
			}, function (e, t, r) {
				var n = r(15),
				o = r(69),
				i = r(33);
				function s(e, t) {
					if (!e)
						throw new Error("expected readStream");
					if (!e.readable)
						throw new Error("readStream must be readable");
					var r = new a(t);
					return e.pipe(r),
					r
				}
				function a(e) {
					n.Transform.call(this, e),
					e = e || {},
					this._readableState.objectMode = !0,
					this._lineBuffer = [],
					this._keepEmptyLines = e.keepEmptyLines || !1,
					this._lastChunkEndedWithCR = !1;
					var t = this;
					this.on("pipe", function (e) {
						t.encoding || e instanceof n.Readable && (t.encoding = e._readableState.encoding)
					})
				}
				e.exports = function (t, r) {
					return e.exports.createStream(t, r)
				},
				e.exports.createStream = function (e, t) {
					return e ? s(e, t) : new a(t)
				},
				e.exports.createLineStream = function (e) {
					return console.log("WARNING: byline#createLineStream is deprecated and will be removed soon"),
					s(e)
				},
				e.exports.LineStream = a,
				o.inherits(a, n.Transform),
				a.prototype._transform = function (e, t, r) {
					t = t || "utf8",
					Buffer.isBuffer(e) && ("buffer" == t ? (e = e.toString(), t = "utf8") : e = e.toString(t)),
					this._chunkEncoding = t;
					var n = e.split(/\r\n|[\n\v\f\r\x85\u2028\u2029]/g);
					this._lastChunkEndedWithCR && "\n" == e[0] && n.shift(),
					this._lineBuffer.length > 0 && (this._lineBuffer[this._lineBuffer.length - 1] += n[0], n.shift()),
					this._lastChunkEndedWithCR = "\r" == e[e.length - 1],
					this._lineBuffer = this._lineBuffer.concat(n),
					this._pushBuffer(t, 1, r)
				},
				a.prototype._pushBuffer = function (e, t, r) {
					for (; this._lineBuffer.length > t; ) {
						var n = this._lineBuffer.shift();
						if ((this._keepEmptyLines || n.length > 0) && !this.push(this._reencode(n, e))) {
							var o = this;
							return void i.setImmediate(function () {
								o._pushBuffer(e, t, r)
							})
						}
					}
					r()
				},
				a.prototype._flush = function (e) {
					this._pushBuffer(this._chunkEncoding, 0, e)
				},
				a.prototype._reencode = function (e, t) {
					return this.encoding && this.encoding != t ? new Buffer(e, t).toString(this.encoding) : this.encoding ? e : new Buffer(e, t)
				}
			}, function (e, t) {
				e.exports = require("timers")
			}, function (e, t, r) {
				"use strict";
				var n = this && this.__decorate || function (e, t, r, n) {
					var o,
					i = arguments.length,
					s = i < 3 ? t : null === n ? n = Object.getOwnPropertyDescriptor(t, r) : n;
					if ("object" == typeof Reflect && "function" == typeof Reflect.decorate)
						s = Reflect.decorate(e, t, r, n);
					else
						for (var a = e.length - 1; a >= 0; a--)
							(o = e[a]) && (s = (i < 3 ? o(s) : i > 3 ? o(t, r, s) : o(t, r)) || s);
					return i > 3 && s && Object.defineProperty(t, r, s),
					s
				};
				Object.defineProperty(t, "__esModule", {
					value: !0
				});
				const o = r(2),
				i = r(1),
				s = r(4),
				a = r(8),
				c = r(107),
				u = r(18),
				l = r(21),
				h = r(108),
				p = r(19),
				d = r(5),
				f = r(109),
				g = e => new Promise(t => setTimeout(t, e)),
				m = a.loadMessageBundle(r(1).join(__dirname, "repository.ts")),
				y = i.join(i.dirname(__dirname), "resources", "icons");
				function b(e, t) {
					return s.Uri.file(i.join(y, t, `${e}.svg`))
				}
				class w {
					constructor(e, t, r, n, o) {
						this._resourceGroupType = e,
						this._resourceUri = t,
						this._type = r,
						this._useIcons = n,
						this._renameResourceUri = o
					}
					get resourceUri() {
						return !this.renameResourceUri || 5 !== this._type && 6 !== this._type && 3 !== this._type && 4 !== this._type ? this._resourceUri : this.renameResourceUri
					}
					get command() {
						return {
							command: "git.openResource",
							title: m(0, null),
							arguments: [this]
						}
					}
					get resourceGroupType() {
						return this._resourceGroupType
					}
					get type() {
						return this._type
					}
					get original() {
						return this._resourceUri
					}
					get renameResourceUri() {
						return this._renameResourceUri
					}
					getIconPath(e) {
						switch (this.type) {
						case 0:
						case 5:
							return w.Icons[e].Modified;
						case 1:
							return w.Icons[e].Added;
						case 2:
						case 6:
							return w.Icons[e].Deleted;
						case 3:
							return w.Icons[e].Renamed;
						case 4:
							return w.Icons[e].Copied;
						case 7:
							return w.Icons[e].Untracked;
						case 8:
							return w.Icons[e].Ignored;
						case 9:
							return w.Icons[e].Added;
						case 15:
						case 10:
						case 13:
						case 11:
						case 12:
						case 14:
						case 16:
							return w.Icons[e].Conflict;
						default:
							throw new Error("Unknown git status: " + this.type)
						}
					}
					get tooltip() {
						switch (this.type) {
						case 0:
							return m(1, null);
						case 5:
							return m(2, null);
						case 1:
							return m(3, null);
						case 2:
							return m(4, null);
						case 6:
							return m(5, null);
						case 3:
							return m(6, null);
						case 4:
							return m(7, null);
						case 7:
							return m(8, null);
						case 8:
							return m(9, null);
						case 9:
							return m(10, null);
						case 15:
							return m(11, null);
						case 10:
							return m(12, null);
						case 13:
							return m(13, null);
						case 11:
							return m(14, null);
						case 12:
							return m(15, null);
						case 14:
							return m(16, null);
						case 16:
							return m(17, null);
						default:
							return ""
						}
					}
					get strikeThrough() {
						switch (this.type) {
						case 6:
						case 15:
						case 13:
						case 12:
						case 2:
							return !0;
						default:
							return !1
						}
					}
					get faded() {
						return !1
					}
					get decorations() {
						const e = this._useIcons ? {
							iconPath: this.getIconPath("light")
						}
						 : void 0,
						t = this._useIcons ? {
							iconPath: this.getIconPath("dark")
						}
						 : void 0,
						r = this.tooltip;
						return {
							strikeThrough: this.strikeThrough,
							faded: this.faded,
							tooltip: r,
							light: e,
							dark: t
						}
					}
					get letter() {
						switch (this.type) {
						case 0:
						case 5:
							return "M";
						case 1:
						case 9:
							return "A";
						case 2:
						case 6:
							return "D";
						case 3:
							return "R";
						case 7:
							return "U";
						case 8:
							return "I";
						case 13:
						case 12:
							return "D";
						case 4:
						case 15:
						case 10:
						case 11:
						case 14:
						case 16:
							return "C";
						default:
							throw new Error("Unknown git status: " + this.type)
						}
					}
					get color() {
						switch (this.type) {
						case 0:
						case 5:
							return new s.ThemeColor("gitDecoration.modifiedResourceForeground");
						case 2:
						case 6:
							return new s.ThemeColor("gitDecoration.deletedResourceForeground");
						case 1:
						case 9:
							return new s.ThemeColor("gitDecoration.addedResourceForeground");
						case 3:
						case 7:
							return new s.ThemeColor("gitDecoration.untrackedResourceForeground");
						case 8:
							return new s.ThemeColor("gitDecoration.ignoredResourceForeground");
						case 4:
						case 15:
						case 10:
						case 13:
						case 11:
						case 12:
						case 14:
						case 16:
							return new s.ThemeColor("gitDecoration.conflictingResourceForeground");
						default:
							throw new Error("Unknown git status: " + this.type)
						}
					}
					get priority() {
						switch (this.type) {
						case 0:
						case 5:
							return 2;
						case 8:
							return 3;
						case 4:
						case 15:
						case 10:
						case 13:
						case 11:
						case 12:
						case 14:
						case 16:
							return 4;
						default:
							return 1
						}
					}
					get resourceDecoration() {
						return {
							bubble: !0,
							title: this.tooltip,
							letter: this.letter,
							color: this.color,
							priority: this.priority
						}
					}
				}
				function v(e) {
					switch (e) {
					case "Show":
					case "GetCommitTemplate":
					case "CheckIgnore":
					case "GetObjectDetails":
					case "MergeBase":
						return !0;
					default:
						return !1
					}
				}
				function C(e) {
					switch (e) {
					case "Fetch":
					case "CheckIgnore":
					case "GetObjectDetails":
					case "Show":
						return !1;
					default:
						return !0
					}
				}
				w.Icons = {
					light: {
						Modified: b("status-modified", "light"),
						Added: b("status-added", "light"),
						Deleted: b("status-deleted", "light"),
						Renamed: b("status-renamed", "light"),
						Copied: b("status-copied", "light"),
						Untracked: b("status-untracked", "light"),
						Ignored: b("status-ignored", "light"),
						Conflict: b("status-conflict", "light")
					},
					dark: {
						Modified: b("status-modified", "dark"),
						Added: b("status-added", "dark"),
						Deleted: b("status-deleted", "dark"),
						Renamed: b("status-renamed", "dark"),
						Copied: b("status-copied", "dark"),
						Untracked: b("status-untracked", "dark"),
						Ignored: b("status-ignored", "dark"),
						Conflict: b("status-conflict", "dark")
					}
				},
				n([u.memoize], w.prototype, "resourceUri", null),
				n([u.memoize], w.prototype, "command", null),
				n([u.memoize], w.prototype, "faded", null),
				t.Resource = w;
				class _ {
					constructor() {
						this.operations = new Map
					}
					start(e) {
						this.operations.set(e, (this.operations.get(e) || 0) + 1)
					}
					end(e) {
						const t = (this.operations.get(e) || 0) - 1;
						t <= 0 ? this.operations.delete(e) : this.operations.set(e, t)
					}
					isRunning(e) {
						return this.operations.has(e)
					}
					isIdle() {
						const e = this.operations.keys();
						for (const t of e)
							if (!v(t))
								return !1;
						return !0
					}
					shouldShowProgress() {
						const e = this.operations.keys();
						for (const t of e)
							if (C(t))
								return !0;
						return !1
					}
				}
				class S {
					constructor(e) {
						this.repository = e,
						this.enabled = !1,
						this.disposable = d.EmptyDisposable,
						d.filterEvent(s.workspace.onDidChangeConfiguration, e => e.affectsConfiguration("git", s.Uri.file(this.repository.root)))(e => this.updateEnablement()),
						this.updateEnablement()
					}
					updateEnablement() {
						s.workspace.getConfiguration("git", s.Uri.file(this.repository.root)).get("showProgress") ? this.enable() : this.disable()
					}
					enable() {
						if (this.enabled)
							return;
						const e = d.onceEvent(d.filterEvent(this.repository.onDidChangeOperations, () => this.repository.operations.shouldShowProgress())),
						t = d.onceEvent(d.filterEvent(d.debounceEvent(this.repository.onDidChangeOperations, 300), () => !this.repository.operations.shouldShowProgress())),
						r = () => {
							this.disposable = e(() => {
									const e = d.eventToPromise(t).then(() => r());
									s.window.withProgress({
										location: s.ProgressLocation.SourceControl
									}, () => e)
								})
						};
						r(),
						this.enabled = !0
					}
					disable() {
						this.enabled && (this.disposable.dispose(), this.disposable = d.EmptyDisposable, this.enabled = !1)
					}
					dispose() {
						this.disable()
					}
				}
				class k {
					constructor(e, t, r) {
						this.onWorkspaceWorkingTreeFileChange = e,
						this.onDotGitFileChange = t,
						this.outputChannel = r,
						this.eventDisposable = d.EmptyDisposable,
						this.logLevelDisposable = d.EmptyDisposable,
						this.logLevelDisposable = s.env.onDidChangeLogLevel(this.onDidChangeLogLevel, this),
						this.onDidChangeLogLevel(s.env.logLevel)
					}
					onDidChangeLogLevel(e) {
						this.eventDisposable.dispose(),
						e > s.LogLevel.Debug || (this.eventDisposable = d.combinedDisposable([this.onWorkspaceWorkingTreeFileChange(e => this.outputChannel.appendLine(`[debug] [wt] Change: ${e.fsPath}`)), this.onDotGitFileChange(e => this.outputChannel.appendLine(`[debug] [.git] Change: ${e.fsPath}`))]))
					}
					dispose() {
						this.eventDisposable.dispose(),
						this.logLevelDisposable.dispose()
					}
				}
				class T {
					constructor(e, t) {
						this.repository = e,
						this.outputChannel = t,
						this.emitter = new s.EventEmitter,
						this.transientDisposables = [],
						this.disposables = [];
						const r = f.watch(e.dotGit);
						this.disposables.push(r);
						const n = d.filterEvent(r.event, e => !/\/\.git(\/index\.lock)?$/.test(e.path));
						this.event = d.anyEvent(n, this.emitter.event),
						e.onDidRunGitStatus(this.updateTransientWatchers, this, this.disposables),
						this.updateTransientWatchers()
					}
					updateTransientWatchers() {
						if (this.transientDisposables = d.dispose(this.transientDisposables), !this.repository.HEAD || !this.repository.HEAD.upstream)
							return;
						this.transientDisposables = d.dispose(this.transientDisposables);
						const {
							name: e,
							remote: t
						} = this.repository.HEAD.upstream,
						r = i.join(this.repository.dotGit, "refs", "remotes", t, e);
						try {
							const e = f.watch(r);
							this.transientDisposables.push(e),
							e.event(this.emitter.fire, this.emitter, this.transientDisposables)
						} catch (e) {
							s.env.logLevel <= s.LogLevel.Error && this.outputChannel.appendLine(`Failed to watch ref '${r}', is most likely packed.\n${e.stack||e}`)
						}
					}
					dispose() {
						this.emitter.dispose(),
						this.transientDisposables = d.dispose(this.transientDisposables),
						this.disposables = d.dispose(this.disposables)
					}
				}
				class E {
					constructor(e, t, r) {
						this.repository = e,
						this._onDidChangeRepository = new s.EventEmitter,
						this.onDidChangeRepository = this._onDidChangeRepository.event,
						this._onDidChangeState = new s.EventEmitter,
						this.onDidChangeState = this._onDidChangeState.event,
						this._onDidChangeStatus = new s.EventEmitter,
						this.onDidRunGitStatus = this._onDidChangeStatus.event,
						this._onDidChangeOriginalResource = new s.EventEmitter,
						this.onDidChangeOriginalResource = this._onDidChangeOriginalResource.event,
						this._onRunOperation = new s.EventEmitter,
						this.onRunOperation = this._onRunOperation.event,
						this._onDidRunOperation = new s.EventEmitter,
						this.onDidRunOperation = this._onDidRunOperation.event,
						this._refs = [],
						this._remotes = [],
						this._submodules = [],
						this._rebaseCommit = void 0,
						this._operations = new _,
						this._state = 0,
						this.isRepositoryHuge = !1,
						this.didWarnAboutLimit = !1,
						this.disposables = [];
						const n = s.workspace.createFileSystemWatcher("**");
						this.disposables.push(n);
						const o = d.anyEvent(n.onDidChange, n.onDidCreate, n.onDidDelete),
						i = d.filterEvent(o, t => d.isDescendant(e.root, t.fsPath)),
						a = d.filterEvent(i, e => !/\/\.git($|\/)/.test(e.path));
						let u;
						try {
							const e = new T(this, r);
							u = e.event,
							this.disposables.push(e)
						} catch (e) {
							s.env.logLevel <= s.LogLevel.Error && r.appendLine(`Failed to watch '${this.dotGit}', reverting to legacy API file watched. Some events might be lost.\n${e.stack||e}`),
							u = d.filterEvent(i, e => /\/\.git($|\/)/.test(e.path))
						}
						d.anyEvent(a, u)(this.onFileChange, this, this.disposables),
						u(this._onDidChangeRepository.fire, this._onDidChangeRepository, this.disposables),
						this.disposables.push(new k(a, u, r));
						const l = s.Uri.file(e.root);
						this._sourceControl = s.scm.createSourceControl("git", "Git", l),
						this._sourceControl.acceptInputCommand = {
							command: "git.commit",
							title: m(18, null),
							arguments: [this._sourceControl]
						},
						this._sourceControl.quickDiffProvider = this,
						this._sourceControl.inputBox.validateInput = this.validateInput.bind(this),
						this.disposables.push(this._sourceControl),
						this.updateInputBoxPlaceholder(),
						this.disposables.push(this.onDidRunGitStatus(() => this.updateInputBoxPlaceholder())),
						this._mergeGroup = this._sourceControl.createResourceGroup("merge", m(19, null)),
						this._indexGroup = this._sourceControl.createResourceGroup("index", m(20, null)),
						this._workingTreeGroup = this._sourceControl.createResourceGroup("workingTree", m(21, null)),
						this._untrackedGroup = this._sourceControl.createResourceGroup("untracked", m(22, null));
						const p = () => {
							const e = s.workspace.getConfiguration("git", l);
							this.indexGroup.hideWhenEmpty = !e.get("alwaysShowStagedChangesResourceGroup")
						};
						d.filterEvent(s.workspace.onDidChangeConfiguration, e => e.affectsConfiguration("git.alwaysShowStagedChangesResourceGroup", l))(p, this, this.disposables),
						p(),
						d.filterEvent(s.workspace.onDidChangeConfiguration, e => e.affectsConfiguration("git.branchSortOrder", l))(this.updateModelState, this, this.disposables),
						d.filterEvent(s.workspace.onDidChangeConfiguration, e => e.affectsConfiguration("git.untrackedChanges", l))(this.updateModelState, this, this.disposables),
						this.mergeGroup.hideWhenEmpty = !0,
						this.untrackedGroup.hideWhenEmpty = !0,
						this.disposables.push(this.mergeGroup),
						this.disposables.push(this.indexGroup),
						this.disposables.push(this.workingTreeGroup),
						this.disposables.push(this.untrackedGroup),
						this.disposables.push(new c.AutoFetcher(this, t)),
						d.filterEvent(this.onDidRunOperation, e => "Push" === e.operation && !e.error)(() => {
							s.workspace.getConfiguration("git").get("showPushSuccessNotification") && s.window.showInformationMessage(m(23, null))
						}, null, this.disposables);
						const f = new h.StatusBarCommands(this);
						this.disposables.push(f),
						f.onDidChange(() => this._sourceControl.statusBarCommands = f.commands, null, this.disposables),
						this._sourceControl.statusBarCommands = f.commands;
						const g = new S(this);
						this.disposables.push(g),
						d.filterEvent(s.workspace.onDidChangeConfiguration, e => e.affectsConfiguration("git.countBadge", l))(this.setCountBadge, this, this.disposables),
						this.setCountBadge()
					}
					get onDidChangeOperations() {
						return d.anyEvent(this.onRunOperation, this.onDidRunOperation)
					}
					get sourceControl() {
						return this._sourceControl
					}
					get inputBox() {
						return this._sourceControl.inputBox
					}
					get mergeGroup() {
						return this._mergeGroup
					}
					get indexGroup() {
						return this._indexGroup
					}
					get workingTreeGroup() {
						return this._workingTreeGroup
					}
					get untrackedGroup() {
						return this._untrackedGroup
					}
					get HEAD() {
						return this._HEAD
					}
					get refs() {
						return this._refs
					}
					get headShortName() {
						if (!this.HEAD)
							return;
						const e = this.HEAD;
						if (e.name)
							return e.name;
						const t = this.refs.filter(t => 2 === t.type && t.commit === e.commit)[0],
						r = t && t.name;
						return r || (e.commit || "").substr(0, 8)
					}
					get remotes() {
						return this._remotes
					}
					get submodules() {
						return this._submodules
					}
					set rebaseCommit(e) {
						this._rebaseCommit && !e ? this.inputBox.value = "" : !e || this._rebaseCommit && this._rebaseCommit.hash === e.hash || (this.inputBox.value = e.message),
						this._rebaseCommit = e
					}
					get rebaseCommit() {
						return this._rebaseCommit
					}
					get operations() {
						return this._operations
					}
					get state() {
						return this._state
					}
					set state(e) {
						this._state = e,
						this._onDidChangeState.fire(e),
						this._HEAD = void 0,
						this._refs = [],
						this._remotes = [],
						this.mergeGroup.resourceStates = [],
						this.indexGroup.resourceStates = [],
						this.workingTreeGroup.resourceStates = [],
						this.untrackedGroup.resourceStates = [],
						this._sourceControl.count = 0
					}
					get root() {
						return this.repository.root
					}
					get dotGit() {
						return this.repository.dotGit
					}
					validateInput(e, t) {
						if (this.rebaseCommit && this.rebaseCommit.message !== e)
							return {
								message: m(24, null),
								type: s.SourceControlInputBoxValidationType.Warning
							};
						const r = s.workspace.getConfiguration("git"),
						n = r.get("inputValidation");
						if ("off" === n)
							return;
						if (/^\s+$/.test(e))
							return {
								message: m(25, null),
								type: s.SourceControlInputBoxValidationType.Warning
							};
						let o,
						i,
						a = 0,
						c = 0;
						const u = /\r?\n/g;
						for (; (i = u.exec(e)) && t > i.index; )
							c = i.index + i[0].length, a++;
						o = i ? i.index : e.length;
						const l = e.substring(c, o);
						let h = r.get("inputValidationLength", 50);
						if (0 === a) {
							const e = r.get("inputValidationSubjectLength", null);
							null !== e && (h = e)
						}
						if (l.length <= h) {
							if ("always" !== n)
								return;
							return {
								message: m(26, null, h - l.length),
								type: s.SourceControlInputBoxValidationType.Information
							}
						}
						return {
							message: m(27, null, l.length - h, h),
							type: s.SourceControlInputBoxValidationType.Warning
						}
					}
					provideOriginalResource(e) {
						if ("file" === e.scheme)
							return p.toGitUri(e, "", {
								replaceFileExtension: !0
							})
					}
					async getInputTemplate() {
						const e = await this.repository.getMergeMessage();
						if (e)
							return e;
						let t = await this.repository.getCommitTemplate();
						return s.workspace.getConfiguration("git", s.Uri.file(this.root)).get("restoreCommitTemplateComments") || (t = this.cleanUpCommitEditMessage(t)),
						t
					}
					getConfigs() {
						return this.run("Config", () => this.repository.getConfigs("local"))
					}
					getConfig(e) {
						return this.run("Config", () => this.repository.config("local", e))
					}
					getGlobalConfig(e) {
						return this.run("Config", () => this.repository.config("global", e))
					}
					setConfig(e, t) {
						return this.run("Config", () => this.repository.config("local", e, t))
					}
					log(e) {
						return this.run("Log", () => this.repository.log(e))
					}
					async status() {
						await this.run("Status")
					}
					diff(e) {
						return this.run("Diff", () => this.repository.diff(e))
					}
					diffWithHEAD(e) {
						return this.run("Diff", () => this.repository.diffWithHEAD(e))
					}
					diffWith(e, t) {
						return this.run("Diff", () => this.repository.diffWith(e, t))
					}
					diffIndexWithHEAD(e) {
						return this.run("Diff", () => this.repository.diffIndexWithHEAD(e))
					}
					diffIndexWith(e, t) {
						return this.run("Diff", () => this.repository.diffIndexWith(e, t))
					}
					diffBlobs(e, t) {
						return this.run("Diff", () => this.repository.diffBlobs(e, t))
					}
					diffBetween(e, t, r) {
						return this.run("Diff", () => this.repository.diffBetween(e, t, r))
					}
					getMergeBase(e, t) {
						return this.run("MergeBase", () => this.repository.getMergeBase(e, t))
					}
					async hashObject(e) {
						return this.run("HashObject", () => this.repository.hashObject(e))
					}
					async add(e, t) {
						await this.run("Add", () => this.repository.add(e.map(e => e.fsPath), t))
					}
					async rm(e) {
						await this.run("Remove", () => this.repository.rm(e.map(e => e.fsPath)))
					}
					async stage(e, t) {
						const r = i.relative(this.repository.root, e.fsPath).replace(/\\/g, "/");
						await this.run("Stage", () => this.repository.stage(r, t)),
						this._onDidChangeOriginalResource.fire(e)
					}
					async revert(e) {
						await this.run("RevertFiles", () => this.repository.revert("HEAD", e.map(e => e.fsPath)))
					}
					async commit(e, t = Object.create(null)) {
						this.rebaseCommit ? await this.run("RebaseContinue", async() => {
							if (t.all) {
								const e = "tracked" === t.all ? {
									update: !0
								}
								 : {};
								await this.repository.add([], e)
							}
							await this.repository.rebaseContinue()
						}) : await this.run("Commit", async() => {
							if (t.all) {
								const e = "tracked" === t.all ? {
									update: !0
								}
								 : {};
								await this.repository.add([], e)
							}
							delete t.all,
							await this.repository.commit(e, t)
						})
					}
					async clean(e) {
						await this.run("Clean", async() => {
							const t = [],
							r = [],
							n = [],
							o = [...this.workingTreeGroup.resourceStates, ...this.untrackedGroup.resourceStates];
							e.forEach(e => {
								const s = e.fsPath;
								for (const e of this.submodules)
									if (i.join(this.root, e.path) === s)
										return void n.push(s);
								const a = e.toString(),
								c = d.find(o, e => e.resourceUri.toString() === a);
								if (c)
									switch (c.type) {
									case 7:
									case 8:
										t.push(s);
										break;
									default:
										r.push(s)
									}
							}),
							await this.repository.clean(t),
							await this.repository.checkout("", r),
							await this.repository.updateSubmodules(n)
						})
					}
					async branch(e, t, r) {
						await this.run("Branch", () => this.repository.branch(e, t, r))
					}
					async deleteBranch(e, t) {
						await this.run("DeleteBranch", () => this.repository.deleteBranch(e, t))
					}
					async renameBranch(e) {
						await this.run("RenameBranch", () => this.repository.renameBranch(e))
					}
					async getBranch(e) {
						return await this.run("GetBranch", () => this.repository.getBranch(e))
					}
					async setBranchUpstream(e, t) {
						await this.run("SetBranchUpstream", () => this.repository.setBranchUpstream(e, t))
					}
					async merge(e) {
						await this.run("Merge", () => this.repository.merge(e))
					}
					async tag(e, t) {
						await this.run("Tag", () => this.repository.tag(e, t))
					}
					async deleteTag(e) {
						await this.run("DeleteTag", () => this.repository.deleteTag(e))
					}
					async checkout(e) {
						await this.run("Checkout", () => this.repository.checkout(e, []))
					}
					async checkoutTracking(e) {
						await this.run("CheckoutTracking", () => this.repository.checkout(e, [], {
								track: !0
							}))
					}
					async findTrackingBranches(e) {
						return await this.run("GetTracking", () => this.repository.findTrackingBranches(e))
					}
					async getCommit(e) {
						return await this.repository.getCommit(e)
					}
					async reset(e, t) {
						await this.run("Reset", () => this.repository.reset(e, t))
					}
					async deleteRef(e) {
						await this.run("DeleteRef", () => this.repository.deleteRef(e))
					}
					async addRemote(e, t) {
						await this.run("Remote", () => this.repository.addRemote(e, t))
					}
					async removeRemote(e) {
						await this.run("Remote", () => this.repository.removeRemote(e))
					}
					async fetchDefault(e = {}) {
						await this.run("Fetch", () => this.repository.fetch(e))
					}
					async fetchPrune() {
						await this.run("Fetch", () => this.repository.fetch({
								prune: !0
							}))
					}
					async fetchAll() {
						await this.run("Fetch", () => this.repository.fetch({
								all: !0
							}))
					}
					async fetch(e, t, r) {
						await this.run("Fetch", () => this.repository.fetch({
								remote: e,
								ref: t,
								depth: r
							}))
					}
					async pullWithRebase(e) {
						let t,
						r;
						return e && e.name && e.upstream && (t = e.upstream.remote, r = `${e.upstream.name}`),
						this.pullFrom(!0, t, r)
					}
					async pull(e, t) {
						let r,
						n;
						return e && e.name && e.upstream && (r = e.upstream.remote, n = `${e.upstream.name}`),
						this.pullFrom(!1, r, n, t)
					}
					async pullFrom(e, t, r, n) {
						await this.run("Pull", async() => {
							await this.maybeAutoStash(async() => {
								const o = s.workspace.getConfiguration("git", s.Uri.file(this.root)),
								i = o.get("fetchOnPull"),
								a = o.get("pullTags");
								i ? await this.repository.pull(e, void 0, void 0, {
									unshallow: n,
									tags: a
								}) : await this.repository.pull(e, t, r, {
									unshallow: n,
									tags: a
								})
							})
						})
					}
					async push(e, t) {
						let r,
						n;
						e && e.name && e.upstream && (r = e.upstream.remote, n = `${e.name}:${e.upstream.name}`),
						await this.run("Push", () => this.repository.push(r, n, void 0, void 0, t))
					}
					async pushTo(e, t, r = !1, n) {
						await this.run("Push", () => this.repository.push(e, t, r, void 0, n))
					}
					async pushFollowTags(e, t) {
						await this.run("Push", () => this.repository.push(e, void 0, !1, !0, t))
					}
					async blame(e) {
						return await this.run("Blame", () => this.repository.blame(e))
					}
					sync(e) {
						return this._sync(e, !1)
					}
					async syncRebase(e) {
						return this._sync(e, !0)
					}
					async _sync(e, t) {
						let r,
						n,
						o;
						e.name && e.upstream && (r = e.upstream.remote, n = `${e.upstream.name}`, o = `${e.name}:${e.upstream.name}`),
						await this.run("Sync", async() => {
							await this.maybeAutoStash(async() => {
								const e = s.workspace.getConfiguration("git", s.Uri.file(this.root)),
								i = e.get("fetchOnPull"),
								a = e.get("pullTags"),
								c = e.get("supportCancellation"),
								u = i ? async e => await this.repository.pull(t, void 0, void 0, {
										tags: a,
										cancellationToken: e
									}) : async e => await this.repository.pull(t, r, n, {
										tags: a,
										cancellationToken: e
									});
								if (c) {
									const e = {
										location: s.ProgressLocation.Notification,
										title: m(28, null),
										cancellable: !0
									};
									await s.window.withProgress(e, (e, t) => u(t))
								} else
									await u();
								const l = this.remotes.find(e => e.name === r);
								l && l.isReadOnly || this.HEAD && ("number" != typeof this.HEAD.ahead || this.HEAD.ahead > 0) && await this.repository.push(r, o)
							})
						})
					}
					async show(e, t) {
						return await this.run("Show", async() => {
							const r = i.relative(this.repository.root, t).replace(/\\/g, "/"),
							n = s.workspace.getConfiguration("files", s.Uri.file(t)),
							o = n.get("encoding"),
							a = n.get("autoGuessEncoding");
							try {
								return await this.repository.bufferString(`${e}:${r}`, o, a)
							} catch (t) {
								if ("WrongCase" === t.gitErrorCode) {
									const t = await this.repository.getGitRelativePath(e, r);
									return await this.repository.bufferString(`${e}:${t}`, o, a)
								}
								throw t
							}
						})
					}
					async buffer(e, t) {
						return this.run("Show", () => {
							const r = i.relative(this.repository.root, t).replace(/\\/g, "/");
							return this.repository.buffer(`${e}:${r}`)
						})
					}
					getObjectDetails(e, t) {
						return this.run("GetObjectDetails", () => this.repository.getObjectDetails(e, t))
					}
					detectObjectType(e) {
						return this.run("Show", () => this.repository.detectObjectType(e))
					}
					async apply(e, t) {
						return await this.run("Apply", () => this.repository.apply(e, t))
					}
					async getStashes() {
						return await this.repository.getStashes()
					}
					async createStash(e, t) {
						return await this.run("Stash", () => this.repository.createStash(e, t))
					}
					async popStash(e) {
						return await this.run("Stash", () => this.repository.popStash(e))
					}
					async dropStash(e) {
						return await this.run("Stash", () => this.repository.dropStash(e))
					}
					async applyStash(e) {
						return await this.run("Stash", () => this.repository.applyStash(e))
					}
					async getCommitTemplate() {
						return await this.run("GetCommitTemplate", async() => this.repository.getCommitTemplate())
					}
					cleanUpCommitEditMessage(e) {
						return this.repository.cleanupCommitEditMessage(e)
					}
					async ignore(e) {
						return await this.run("Ignore", async() => {
							const t = `${this.repository.root}${i.sep}.gitignore`,
							r = e.map(e => i.relative(this.repository.root, e.fsPath).replace(/\\/g, "/")).join("\n"),
							n = await new Promise(e => o.exists(t, e)) ? await s.workspace.openTextDocument(t) : await s.workspace.openTextDocument(s.Uri.file(t).with({
										scheme: "untitled"
									}));
							await s.window.showTextDocument(n);
							const a = new s.WorkspaceEdit,
							c = n.lineAt(n.lineCount - 1),
							u = c.isEmptyOrWhitespace ? `${r}\n` : `\n${r}\n`;
							a.insert(n.uri, c.range.end, u),
							await s.workspace.applyEdit(a),
							await n.save()
						})
					}
					checkIgnore(e) {
						return this.run("CheckIgnore", () => new Promise((t, r) => {
								if (0 === (e = e.filter(e => d.isDescendant(this.root, e))).length)
									return t(new Set);
								const n = this.repository.stream(["check-ignore", "-v", "-z", "--stdin"], {
										stdio: [null, null, null]
									});
								n.stdin.end(e.join("\0"), "utf8");
								let o = "";
								n.stdout.setEncoding("utf8"),
								n.stdout.on("data", e => {
									o += e
								});
								let i = "";
								n.stderr.setEncoding("utf8"),
								n.stderr.on("data", e => i += e),
								n.on("error", r),
								n.on("exit", e => {
									1 === e ? t(new Set) : 0 === e ? t(new Set(this.parseIgnoreCheck(o))) : / is in submodule /.test(i) ? r(new l.GitError({
											stdout: o,
											stderr: i,
											exitCode: e,
											gitErrorCode: "IsInSubmodule"
										})) : r(new l.GitError({
											stdout: o,
											stderr: i,
											exitCode: e
										}))
								})
							}))
					}
					parseIgnoreCheck(e) {
						const t = [],
						r = e.split("\0");
						for (let e = 0; e < r.length; e += 4) {
							const n = r[e + 2],
							o = r[e + 3];
							n && !n.startsWith("!") && t.push(o)
						}
						return t
					}
					async run(e, t = (() => Promise.resolve(null))) {
						if (0 !== this.state)
							throw new Error("Repository not initialized");
						let r = null;
						this._operations.start(e),
						this._onRunOperation.fire(e);
						try {
							const n = await this.retryRun(e, t);
							return v(e) || await this.updateModelState(),
							n
						} catch (e) {
							throw r = e,
							"NotAGitRepository" === e.gitErrorCode && (this.state = 1),
							e
						}
						finally {
							this._operations.end(e),
							this._onDidRunOperation.fire({
								operation: e,
								error: r
							})
						}
					}
					async retryRun(e, t = (() => Promise.resolve(null))) {
						let r = 0;
						for (; ; )
							try {
								return r++,
								await t()
							} catch (t) {
								if (!(r <= 10 && ("RepositoryIsLocked" === t.gitErrorCode || ("Pull" === e || "Sync" === e || "Fetch" === e) && ("CantLockRef" === t.gitErrorCode || "CantRebaseMultipleBranches" === t.gitErrorCode))))
									throw t;
								await g(50 * Math.pow(r, 2))
							}
					}
					async findKnownHugeFolderPathsToIgnore() {
						const e = [];
						for (const t of E.KnownHugeFolderNames) {
							const r = i.join(this.repository.root, t);
							await new Promise(e => o.exists(r, e)) && e.push(r)
						}
						const t = await this.checkIgnore(e);
						return e.filter(e => !t.has(e))
					}
					async updateModelState() {
						const {
							status: e,
							didHitLimit: t
						} = await this.repository.getStatus(),
						r = s.workspace.getConfiguration("git"),
						n = s.workspace.getConfiguration("git", s.Uri.file(this.repository.root)),
						o = !0 === r.get("ignoreLimitWarning"),
						a = !r.get("decorations.enabled", !0);
						if (this.isRepositoryHuge = t, t && !o && !this.didWarnAboutLimit) {
							const e = await this.findKnownHugeFolderPathsToIgnore(),
							t = m(29, null, this.repository.root),
							n = {
								title: m(30, null)
							};
							if (e.length > 0) {
								const o = e[0],
								a = i.basename(o),
								c = m(31, null, a),
								u = {
									title: m(32, null)
								},
								l = await s.window.showWarningMessage(`${t} ${c}`, u, n);
								l === n ? (r.update("ignoreLimitWarning", !0, !1), this.didWarnAboutLimit = !0) : l === u && this.ignore([s.Uri.file(o)])
							} else {
								await s.window.showWarningMessage(t, n) === n && r.update("ignoreLimitWarning", !0, !1),
								this.didWarnAboutLimit = !0
							}
						}
						let c;
						try {
							if ((c = await this.repository.getHEAD()).name)
								try {
									c = await this.repository.getBranch(c.name)
								} catch (e) {}
						} catch (e) {}
						const u = r.get("branchSortOrder") || "alphabetically",
						[l, h, p, d] = await Promise.all([this.repository.getRefs({
										sort: u
									}), this.repository.getRemotes(), this.repository.getSubmodules(), this.getRebaseCommit()]);
						this._HEAD = c,
						this._refs = l,
						this._remotes = h,
						this._submodules = p,
						this.rebaseCommit = d;
						const f = n.get("untrackedChanges"),
						g = [],
						y = [],
						b = [],
						v = [];
						e.forEach(e => {
							const t = s.Uri.file(i.join(this.repository.root, e.path)),
							r = e.rename ? s.Uri.file(i.join(this.repository.root, e.rename)) : void 0;
							switch (e.x + e.y) {
							case "??":
								switch (f) {
								case "mixed":
									return y.push(new w(2, t, 7, a));
								case "separate":
									return v.push(new w(3, t, 7, a));
								default:
									return
								}
							case "!!":
								switch (f) {
								case "mixed":
									return y.push(new w(2, t, 8, a));
								case "separate":
									return v.push(new w(3, t, 8, a));
								default:
									return
								}
							case "DD":
								return b.push(new w(0, t, 15, a));
							case "AU":
								return b.push(new w(0, t, 10, a));
							case "UD":
								return b.push(new w(0, t, 13, a));
							case "UA":
								return b.push(new w(0, t, 11, a));
							case "DU":
								return b.push(new w(0, t, 12, a));
							case "AA":
								return b.push(new w(0, t, 14, a));
							case "UU":
								return b.push(new w(0, t, 16, a))
							}
							switch (e.x) {
							case "M":
								g.push(new w(1, t, 0, a));
								break;
							case "A":
								g.push(new w(1, t, 1, a));
								break;
							case "D":
								g.push(new w(1, t, 2, a));
								break;
							case "R":
								g.push(new w(1, t, 3, a, r));
								break;
							case "C":
								g.push(new w(1, t, 4, a, r))
							}
							switch (e.y) {
							case "M":
								y.push(new w(2, t, 5, a, r));
								break;
							case "D":
								y.push(new w(2, t, 6, a, r));
								break;
							case "A":
								y.push(new w(2, t, 9, a, r))
							}
						}),
						this.mergeGroup.resourceStates = b,
						this.indexGroup.resourceStates = g,
						this.workingTreeGroup.resourceStates = y,
						this.untrackedGroup.resourceStates = v,
						this.setCountBadge(),
						this._onDidChangeStatus.fire(),
						this._sourceControl.commitTemplate = await this.getInputTemplate()
					}
					setCountBadge() {
						const e = s.workspace.getConfiguration("git", s.Uri.file(this.repository.root)),
						t = e.get("countBadge"),
						r = e.get("untrackedChanges");
						let n = this.mergeGroup.resourceStates.length + this.indexGroup.resourceStates.length + this.workingTreeGroup.resourceStates.length;
						switch (t) {
						case "off":
							n = 0;
							break;
						case "tracked":
							"mixed" === r && (n -= this.workingTreeGroup.resourceStates.filter(e => 7 === e.type || 8 === e.type).length);
							break;
						case "all":
							"separate" === r && (n += this.untrackedGroup.resourceStates.length)
						}
						this._sourceControl.count = n
					}
					async getRebaseCommit() {
						const e = i.join(this.repository.root, ".git", "REBASE_HEAD"),
						t = i.join(this.repository.root, ".git", "rebase-apply"),
						r = i.join(this.repository.root, ".git", "rebase-merge");
						try {
							const[n, i, s] = await Promise.all([new Promise(e => o.exists(t, e)), new Promise(e => o.exists(r, e)), new Promise((t, r) => o.readFile(e, "utf8", (e, n) => e ? r(e) : t(n)))]);
							if (!n && !i)
								return;
							return await this.getCommit(s.trim())
						} catch (e) {
							return
						}
					}
					async maybeAutoStash(e) {
						if (!(s.workspace.getConfiguration("git", s.Uri.file(this.root)).get("autoStash") && this.workingTreeGroup.resourceStates.some(e => 7 !== e.type && 8 !== e.type)))
							return await e();
						await this.repository.createStash(void 0, !0);
						const t = await e();
						return await this.repository.popStash(),
						t
					}
					onFileChange(e) {
						s.workspace.getConfiguration("git").get("autorefresh") && (this.isRepositoryHuge || this.operations.isIdle() && this.eventuallyUpdateWhenIdleAndWait())
					}
					eventuallyUpdateWhenIdleAndWait() {
						this.updateWhenIdleAndWait()
					}
					async updateWhenIdleAndWait() {
						await this.whenIdleAndFocused(),
						await this.status(),
						await g(5e3)
					}
					async whenIdleAndFocused() {
						for (; ; )
							if (this.operations.isIdle()) {
								if (s.window.state.focused)
									return; {
									const e = d.filterEvent(s.window.onDidChangeWindowState, e => e.focused);
									await d.eventToPromise(e)
								}
							} else
								await d.eventToPromise(this.onDidRunOperation)
					}
					get headLabel() {
						const e = this.HEAD;
						if (!e)
							return "";
						const t = this.refs.filter(t => 2 === t.type && t.commit === e.commit)[0],
						r = t && t.name;
						return (e.name || r || (e.commit || "").substr(0, 8)) + (this.workingTreeGroup.resourceStates.length + this.untrackedGroup.resourceStates.length > 0 ? "*" : "") + (this.indexGroup.resourceStates.length > 0 ? "+" : "") + (this.mergeGroup.resourceStates.length > 0 ? "!" : "")
					}
					get syncLabel() {
						if (!(this.HEAD && this.HEAD.name && this.HEAD.commit && this.HEAD.upstream && (this.HEAD.ahead || this.HEAD.behind)))
							return "";
						const e = this.HEAD && this.HEAD.remote || this.HEAD.upstream.remote,
						t = this.remotes.find(t => t.name === e);
						return t && t.isReadOnly ? `${this.HEAD.behind}↓` : `${this.HEAD.behind}↓ ${this.HEAD.ahead}↑`
					}
					updateInputBoxPlaceholder() {
						const e = this.headShortName;
						this._sourceControl.inputBox.placeholder = e ? m(33, null, "{0}", e) : m(34, null)
					}
					dispose() {
						this.disposables = d.dispose(this.disposables)
					}
				}
				E.KnownHugeFolderNames = ["node_modules"],
				n([u.memoize], E.prototype, "onDidChangeOperations", null),
				n([u.throttle], E.prototype, "status", null),
				n([u.throttle], E.prototype, "fetchDefault", null),
				n([u.throttle], E.prototype, "fetchPrune", null),
				n([u.throttle], E.prototype, "fetchAll", null),
				n([u.throttle], E.prototype, "pullWithRebase", null),
				n([u.throttle], E.prototype, "pull", null),
				n([u.throttle], E.prototype, "push", null),
				n([u.throttle], E.prototype, "sync", null),
				n([u.throttle], E.prototype, "syncRebase", null),
				n([u.throttle], E.prototype, "updateModelState", null),
				n([u.debounce(1e3)], E.prototype, "eventuallyUpdateWhenIdleAndWait", null),
				n([u.throttle], E.prototype, "updateWhenIdleAndWait", null),
				t.Repository = E
			}, function (e, t) {
				e.exports = require("crypto")
			}, function (e, t, r) {
				"use strict";
				Object.defineProperty(t, "__esModule", {
					value: !0
				});
				var n = r(1),
				o = r(119),
				i = r(37),
				s = Object.keys(process.binding("natives")),
				a = i.prototype.require;
				t.makePatchingRequire = function (e) {
					var t = {};
					return function (r) {
						var c = a.apply(this, arguments);
						if (e[r]) {
							var u = i._resolveFilename(r, this);
							if (t.hasOwnProperty(u))
								return t[u];
							var l = void 0;
							if (s.indexOf(r) < 0)
								try {
									l = a.call(this, n.join(r, "package.json")).version
								} catch (e) {
									return c
								}
							else
								l = process.version.substring(1);
							var h = l.indexOf("-");
							h >= 0 && (l = l.substring(0, h));
							for (var p = c, d = 0, f = e[r]; d < f.length; d++) {
								var g = f[d];
								o.satisfies(l, g.versionSpecifier) && (p = g.patch(p, u))
							}
							return t[u] = p
						}
						return c
					}
				}
			}, function (e, t) {
				e.exports = require("module")
			}, function (e, t, r) {
				"use strict";
				Object.defineProperty(t, "__esModule", {
					value: !0
				}),
				t.AvailabilityData = r(137),
				t.Base = r(39),
				t.ContextTagKeys = r(138),
				t.Data = r(139),
				t.DataPoint = r(140),
				t.DataPointType = r(40),
				t.Domain = r(9),
				t.Envelope = r(141),
				t.EventData = r(41),
				t.ExceptionData = r(142),
				t.ExceptionDetails = r(143),
				t.MessageData = r(144),
				t.MetricData = r(145),
				t.PageViewData = r(146),
				t.RemoteDependencyData = r(147),
				t.RequestData = r(148),
				t.SeverityLevel = r(149),
				t.StackFrame = r(150)
			}, function (e, t, r) {
				"use strict";
				var n = function () {
					return function () {}
				}
				();
				e.exports = n
			}, function (e, t, r) {
				"use strict";
				var n;
				!function (e) {
					e[e.Measurement = 0] = "Measurement",
					e[e.Aggregation = 1] = "Aggregation"
				}
				(n || (n = {})),
				e.exports = n
			}, function (e, t, r) {
				"use strict";
				var n = this && this.__extends || function () {
					var e = Object.setPrototypeOf || {
						__proto__: []
					}
					instanceof Array && function (e, t) {
						e.__proto__ = t
					}
					 || function (e, t) {
						for (var r in t)
							t.hasOwnProperty(r) && (e[r] = t[r])
					};
					return function (t, r) {
						function n() {
							this.constructor = t
						}
						e(t, r),
						t.prototype = null === r ? Object.create(r) : (n.prototype = r.prototype, new n)
					}
				}
				(),
				o = function (e) {
					function t() {
						var t = e.call(this) || this;
						return t.ver = 2,
						t.properties = {},
						t.measurements = {},
						t
					}
					return n(t, e),
					t
				}
				(r(9));
				e.exports = o
			}, function (e, t, r) {
				"use strict";
				var n = r(11),
				o = r(6),
				i = function () {
					function e(t) {
						if (e.INSTANCE)
							throw new Error("Performance tracking should be configured from the applicationInsights object");
						e.INSTANCE = this,
						this._isInitialized = !1,
						this._client = t
					}
					return e.prototype.enable = function (t) {
						var r = this;
						this._isEnabled = t,
						this._isEnabled && !this._isInitialized && (this._isInitialized = !0),
						t ? this._handle || (this._lastCpus = n.cpus(), this._lastRequests = {
								totalRequestCount: e._totalRequestCount,
								totalFailedRequestCount: e._totalFailedRequestCount,
								time: +new Date
							}, "function" == typeof process.cpuUsage && (this._lastAppCpuUsage = process.cpuUsage()), this._lastHrtime = process.hrtime(), this._handle = setInterval(function () {
									return r.trackPerformance()
								}, 6e4), this._handle.unref()) : this._handle && (clearInterval(this._handle), this._handle = void 0)
					},
					e.countRequest = function (t, r) {
						var n = this;
						if (e.isEnabled()) {
							var i = +new Date;
							t && r ? "function" == typeof r.once && r.once("finish", function () {
								var t = +new Date;
								n._lastRequestExecutionTime = t - i,
								e._totalRequestCount++,
								r.statusCode >= 400 && e._totalFailedRequestCount++
							}) : o.warn("AutoCollectPerformance.countRequest was called with invalid parameters: ", !!t, !!r)
						}
					},
					e.prototype.isInitialized = function () {
						return this._isInitialized
					},
					e.isEnabled = function () {
						return e.INSTANCE && e.INSTANCE._isEnabled
					},
					e.prototype.trackPerformance = function () {
						this._trackCpu(),
						this._trackMemory(),
						this._trackNetwork()
					},
					e.prototype._trackCpu = function () {
						var e = n.cpus();
						if (e && e.length && this._lastCpus && e.length === this._lastCpus.length) {
							for (var t = 0, r = 0, o = 0, i = 0, s = 0, a = 0; e && a < e.length; a++) {
								var c = e[a],
								u = this._lastCpus[a],
								l = (c.model, c.speed, c.times),
								h = u.times;
								t += l.user - h.user || 0,
								r += l.sys - h.sys || 0,
								o += l.nice - h.nice || 0,
								i += l.idle - h.idle || 0,
								s += l.irq - h.irq || 0
							}
							var p = void 0;
							if ("function" == typeof process.cpuUsage) {
								var d = process.cpuUsage(),
								f = process.hrtime(),
								g = d.user - this._lastAppCpuUsage.user + (d.system - this._lastAppCpuUsage.system) || 0;
								if (void 0 !== this._lastHrtime && 2 === this._lastHrtime.length)
									p = 100 * g / ((1e6 * (f[0] - this._lastHrtime[0]) + (f[1] - this._lastHrtime[1]) / 1e3 || 0) * e.length);
								this._lastAppCpuUsage = d,
								this._lastHrtime = f
							}
							var m = t + r + o + i + s || 1;
							this._client.trackMetric({
								name: "\\Processor(_Total)\\% Processor Time",
								value: (m - i) / m * 100
							}),
							this._client.trackMetric({
								name: "\\Process(??APP_WIN32_PROC??)\\% Processor Time",
								value: p || t / m * 100
							})
						}
						this._lastCpus = e
					},
					e.prototype._trackMemory = function () {
						var e = n.freemem(),
						t = process.memoryUsage().rss;
						this._client.trackMetric({
							name: "\\Process(??APP_WIN32_PROC??)\\Private Bytes",
							value: t
						}),
						this._client.trackMetric({
							name: "\\Memory\\Available Bytes",
							value: e
						})
					},
					e.prototype._trackNetwork = function () {
						var t = this._lastRequests,
						r = {
							totalRequestCount: e._totalRequestCount,
							totalFailedRequestCount: e._totalFailedRequestCount,
							time: +new Date
						},
						n = r.totalRequestCount - t.totalRequestCount || 0,
						o = (t.totalFailedRequestCount, r.time - t.time),
						i = o / 1e3;
						if (o > 0) {
							var s = n / i;
							this._client.trackMetric({
								name: "\\ASP.NET Applications(??APP_W3SVC_PROC??)\\Requests/Sec",
								value: s
							}),
							this._client.trackMetric({
								name: "\\ASP.NET Applications(??APP_W3SVC_PROC??)\\Request Execution Time",
								value: e._lastRequestExecutionTime
							})
						}
						this._lastRequests = r
					},
					e.prototype.dispose = function () {
						e.INSTANCE = null,
						this.enable(!1),
						this._isInitialized = !1
					},
					e._totalRequestCount = 0,
					e._totalFailedRequestCount = 0,
					e._lastRequestExecutionTime = 0,
					e
				}
				();
				e.exports = i
			}, function (e, t, r) {
				"use strict";
				var n = function () {
					function e() {}
					return e.prototype.getUrl = function () {
						return this.url
					},
					e.prototype.RequestParser = function () {
						this.startTime = +new Date
					},
					e.prototype._setStatus = function (e, t) {
						var r = +new Date;
						this.duration = r - this.startTime,
						this.statusCode = e;
						var n = this.properties || {};
						if (t)
							if ("string" == typeof t)
								n.error = t;
							else if (t instanceof Error)
								n.error = t.message;
							else if ("object" == typeof t)
								for (var o in t)
									n[o] = t[o] && t[o].toString && t[o].toString();
						this.properties = n
					},
					e.prototype._isSuccess = function () {
						return 0 < this.statusCode && this.statusCode < 400
					},
					e
				}
				();
				e.exports = n
			}, function (e, t, r) {
				"use strict";
				var n = r(13),
				o = r(26),
				i = r(6),
				s = r(10),
				a = r(17),
				c = r(162),
				u = r(16),
				l = r(42),
				h = function () {
					function e(t) {
						if (e.INSTANCE)
							throw new Error("Server request tracking should be configured from the applicationInsights object");
						e.INSTANCE = this,
						this._client = t
					}
					return e.prototype.enable = function (e) {
						this._isEnabled = e,
						(this._isAutoCorrelating || this._isEnabled || l.isEnabled()) && !this._isInitialized && (this.useAutoCorrelation(this._isAutoCorrelating), this._initialize())
					},
					e.prototype.useAutoCorrelation = function (e) {
						e && !this._isAutoCorrelating ? u.CorrelationContextManager.enable() : !e && this._isAutoCorrelating && u.CorrelationContextManager.disable(),
						this._isAutoCorrelating = e
					},
					e.prototype.isInitialized = function () {
						return this._isInitialized
					},
					e.prototype.isAutoCorrelating = function () {
						return this._isAutoCorrelating
					},
					e.prototype._generateCorrelationContext = function (e) {
						if (this._isAutoCorrelating)
							return u.CorrelationContextManager.generateContextObject(e.getOperationId(this._client.context.tags), e.getRequestId(), e.getOperationName(this._client.context.tags), e.getCorrelationContextHeader())
					},
					e.prototype._initialize = function () {
						var t = this;
						this._isInitialized = !0;
						var r = function (r) {
							if (r) {
								if ("function" != typeof r)
									throw new Error("onRequest handler must be a function");
								return function (n, o) {
									var i = n && !n[e.alreadyAutoCollectedFlag];
									if (n && i) {
										var s = new c(n),
										a = t._generateCorrelationContext(s);
										u.CorrelationContextManager.runWithContext(a, function () {
											t._isEnabled && (n[e.alreadyAutoCollectedFlag] = !0, e.trackRequest(t._client, {
													request: n,
													response: o
												}, s)),
											l.countRequest(n, o),
											"function" == typeof r && r(n, o)
										})
									} else
										"function" == typeof r && r(n, o)
								}
							}
						},
						i = function (e) {
							var t = e.addListener.bind(e);
							e.addListener = function (e, n) {
								switch (e) {
								case "request":
								case "checkContinue":
									return t(e, r(n));
								default:
									return t(e, n)
								}
							},
							e.on = e.addListener
						},
						s = n.createServer;
						n.createServer = function (e) {
							var t = s(r(e));
							return i(t),
							t
						};
						var a = o.createServer;
						o.createServer = function (e, t) {
							var n = a(e, r(t));
							return i(n),
							n
						}
					},
					e.trackRequestSync = function (t, r) {
						if (r.request && r.response && t) {
							e.addResponseCorrelationIdHeader(t, r.response);
							var n = u.CorrelationContextManager.getCurrentContext(),
							o = new c(r.request, n && n.operation.parentId);
							n && (n.operation.id = o.getOperationId(t.context.tags) || n.operation.id, n.operation.name = o.getOperationName(t.context.tags) || n.operation.name, n.operation.parentId = o.getRequestId() || n.operation.parentId, n.customProperties.addHeaderData(o.getCorrelationContextHeader())),
							e.endRequest(t, o, r, r.duration, r.error)
						} else
							i.info("AutoCollectHttpRequests.trackRequestSync was called with invalid parameters: ", !r.request, !r.response, !t)
					},
					e.trackRequest = function (t, r, n) {
						if (r.request && r.response && t) {
							var o = u.CorrelationContextManager.getCurrentContext(),
							a = n || new c(r.request, o && o.operation.parentId);
							s.canIncludeCorrelationHeader(t, a.getUrl()) && e.addResponseCorrelationIdHeader(t, r.response),
							o && !n && (o.operation.id = a.getOperationId(t.context.tags) || o.operation.id, o.operation.name = a.getOperationName(t.context.tags) || o.operation.name, o.operation.parentId = a.getOperationParentId(t.context.tags) || o.operation.parentId, o.customProperties.addHeaderData(a.getCorrelationContextHeader())),
							r.response.once && r.response.once("finish", function () {
								e.endRequest(t, a, r, null, null)
							}),
							r.request.on && r.request.on("error", function (n) {
								e.endRequest(t, a, r, null, n)
							})
						} else
							i.info("AutoCollectHttpRequests.trackRequest was called with invalid parameters: ", !r.request, !r.response, !t)
					},
					e.addResponseCorrelationIdHeader = function (e, t) {
						if (e.config && e.config.correlationId && t.getHeader && t.setHeader && !t.headersSent) {
							var r = t.getHeader(a.requestContextHeader);
							if (r) {
								var n = r.split(","),
								o = a.requestContextSourceKey + "=";
								n.some(function (e) {
									return e.substring(0, o.length) === o
								}) || t.setHeader(a.requestContextHeader, r + "," + a.requestContextSourceKey + "=" + e.config.correlationId)
							} else
								t.setHeader(a.requestContextHeader, a.requestContextSourceKey + "=" + e.config.correlationId)
						}
					},
					e.endRequest = function (e, t, r, n, o) {
						o ? t.onError(o, n) : t.onResponse(r.response, n);
						var i = t.getRequestTelemetry(r);
						if (i.tagOverrides = t.getRequestTags(e.context.tags), r.tagOverrides)
							for (var s in r.tagOverrides)
								i.tagOverrides[s] = r.tagOverrides[s];
						i.contextObjects = i.contextObjects || {},
						i.contextObjects["http.ServerRequest"] = r.request,
						i.contextObjects["http.ServerResponse"] = r.response,
						e.trackRequest(i)
					},
					e.prototype.dispose = function () {
						e.INSTANCE = null,
						this.enable(!1),
						this._isInitialized = !1
					},
					e.alreadyAutoCollectedFlag = "_appInsightsAutoCollected",
					e
				}
				();
				e.exports = h
			}, function (e, t, r) {
				"use strict";
				Object.defineProperty(t, "__esModule", {
					value: !0
				});
				const n = r(8).loadMessageBundle(r(1).join(__dirname, "main.ts")),
				o = r(4),
				i = r(21),
				s = r(106),
				a = r(110),
				c = r(112),
				u = r(113),
				l = r(114),
				h = r(5),
				p = r(115),
				d = r(173),
				f = r(175),
				g = r(1),
				m = r(2),
				y = [];
				async function b(e, t, r, p) {
					const f = o.workspace.getConfiguration("git").get("path"),
					g = await i.findGit(f, e => t.appendLine(n(0, null, e))),
					m = new l.Askpass;
					p.push(m);
					const y = await m.getEnv(),
					b = new i.Git({
							gitPath: g.path,
							version: g.version,
							env: y
						}),
					w = new s.Model(b, e.globalState, t);
					p.push(w);
					const v = () => o.commands.executeCommand("setContext", "gitOpenRepositoryCount", `${w.repositories.length}`);
					w.onDidOpenRepository(v, null, p),
					w.onDidCloseRepository(v, null, p),
					v(),
					t.appendLine(n(1, null, g.version, g.path));
					const C = e => {
						const r = e.split(/\r?\n/gm);
						for (; /^\s*$/.test(r[r.length - 1]); )
							r.pop();
						t.appendLine(r.join("\n"))
					};
					return b.onOutput.addListener("log", C),
					p.push(h.toDisposable(() => b.onOutput.removeListener("log", C))),
					p.push(new a.CommandCenter(b, w, t, r), new c.GitContentProvider(w), new u.GitDecorations(w), new d.GitProtocolHandler),
					await async function (e) {
						const t = o.workspace.getConfiguration("git");
						if (!0 === t.get("ignoreLegacyWarning"))
							return;
						if (!/^[01]/.test(e.version))
							return;
						const r = n(5, null),
						i = n(6, null),
						s = await o.window.showWarningMessage(n(7, null, e.version), r, i);
						s === r ? o.commands.executeCommand("vscode.open", o.Uri.parse("https://git-scm.com/")) : s === i && await t.update("ignoreLegacyWarning", !0, !0)
					}
					(g),
					w
				}
				async function w(e) {
					if ("file" !== e.uri.scheme)
						return !1;
					const t = g.join(e.uri.fsPath, ".git");
					try {
						return (await new Promise((e, r) => m.stat(t, (t, n) => t ? r(t) : e(n)))).isDirectory()
					} catch (e) {
						return !1
					}
				}
				t.deactivate = async function () {
					for (const e of y)
						await e()
				},
				t.activate = async function (e) {
					const t = [];
					e.subscriptions.push(new o.Disposable(() => o.Disposable.from(...t).dispose()));
					const i = o.window.createOutputChannel("Git");
					o.commands.registerCommand("git.showOutput", () => i.show()),
					t.push(i);
					const {
						name: s,
						version: a,
						aiKey: c
					} = r(177),
					u = new p.default(s, a, c);
					if (y.push(() => u.dispose()), !o.workspace.getConfiguration("git", null).get("enabled")) {
						const r = h.filterEvent(o.workspace.onDidChangeConfiguration, e => e.affectsConfiguration("git")),
						n = h.filterEvent(r, () => !0 === o.workspace.getConfiguration("git", null).get("enabled")),
						s = new f.GitExtensionImpl;
						return h.eventToPromise(n).then(async() => s.model = await b(e, i, u, t)),
						s
					}
					try {
						const r = await b(e, i, u, t);
						return new f.GitExtensionImpl(r)
					} catch (e) {
						if (!/Git installation not found/.test(e.message || ""))
							throw e;
						return console.warn(e.message),
						i.appendLine(e.message),
						async function () {
							const e = o.workspace.getConfiguration("git");
							if (!0 === e.get("ignoreMissingGitWarning"))
								return;
							if (!o.workspace.workspaceFolders)
								return;
							if ((await Promise.all(o.workspace.workspaceFolders.map(w))).every(e => !e))
								return;
							const t = n(2, null),
							r = n(3, null),
							i = await o.window.showWarningMessage(n(4, null), t, r);
							i === t ? o.commands.executeCommand("vscode.open", o.Uri.parse("https://git-scm.com/")) : i === r && await e.update("ignoreMissingGitWarning", !0, !0)
						}
						(),
						new f.GitExtensionImpl
					}
				}
			}, function (e, t, r) {
				e.exports = u,
				u.sync = function (e, t) {
					for (var r = c(e, t = t || {}), n = r.env, i = r.ext, u = r.extExe, l = [], h = 0, p = n.length; h < p; h++) {
						var d = n[h];
						'"' === d.charAt(0) && '"' === d.slice(-1) && (d = d.slice(1, -1));
						var f = o.join(d, e);
						!d && /^\.[\\\/]/.test(e) && (f = e.slice(0, 2) + f);
						for (var g = 0, m = i.length; g < m; g++) {
							var y = f + i[g];
							try {
								if (s.sync(y, {
										pathExt: u
									})) {
									if (!t.all)
										return y;
									l.push(y)
								}
							} catch (e) {}
						}
					}
					if (t.all && l.length)
						return l;
					if (t.nothrow)
						return null;
					throw a(e)
				};
				var n = "win32" === process.platform || "cygwin" === process.env.OSTYPE || "msys" === process.env.OSTYPE,
				o = r(1),
				i = n ? ";" : ":",
				s = r(47);
				function a(e) {
					var t = new Error("not found: " + e);
					return t.code = "ENOENT",
					t
				}
				function c(e, t) {
					var r = t.colon || i,
					o = t.path || process.env.PATH || "",
					s = [""];
					o = o.split(r);
					var a = "";
					return n && (o.unshift(process.cwd()), s = (a = t.pathExt || process.env.PATHEXT || ".EXE;.CMD;.BAT;.COM").split(r), -1 !== e.indexOf(".") && "" !== s[0] && s.unshift("")),
					(e.match(/\//) || n && e.match(/\\/)) && (o = [""]), {
						env: o,
						ext: s,
						extExe: a
					}
				}
				function u(e, t, r) {
					"function" == typeof t && (r = t, t = {});
					var n = c(e, t),
					i = n.env,
					u = n.ext,
					l = n.extExe,
					h = [];
					!function n(c, p) {
						if (c === p)
							return t.all && h.length ? r(null, h) : r(a(e));
						var d = i[c];
						'"' === d.charAt(0) && '"' === d.slice(-1) && (d = d.slice(1, -1));
						var f = o.join(d, e);
						!d && /^\.[\\\/]/.test(e) && (f = e.slice(0, 2) + f),
						function e(o, i) {
							if (o === i)
								return n(c + 1, p);
							var a = u[o];
							s(f + a, {
								pathExt: l
							}, function (n, s) {
								if (!n && s) {
									if (!t.all)
										return r(null, f + a);
									h.push(f + a)
								}
								return e(o + 1, i)
							})
						}
						(0, u.length)
					}
					(0, i.length)
				}
			}, function (e, t, r) {
				var n;
				r(2);
				function o(e, t, r) {
					if ("function" == typeof t && (r = t, t = {}), !r) {
						if ("function" != typeof Promise)
							throw new TypeError("callback not provided");
						return new Promise(function (r, n) {
							o(e, t || {}, function (e, t) {
								e ? n(e) : r(t)
							})
						})
					}
					n(e, t || {}, function (e, n) {
						e && ("EACCES" === e.code || t && t.ignoreErrors) && (e = null, n = !1),
						r(e, n)
					})
				}
				n = "win32" === process.platform || global.TESTING_WINDOWS ? r(48) : r(49),
				e.exports = o,
				o.sync = function (e, t) {
					try {
						return n.sync(e, t || {})
					} catch (e) {
						if (t && t.ignoreErrors || "EACCES" === e.code)
							return !1;
						throw e
					}
				}
			}, function (e, t, r) {
				e.exports = i,
				i.sync = function (e, t) {
					return o(n.statSync(e), e, t)
				};
				var n = r(2);
				function o(e, t, r) {
					return !(!e.isSymbolicLink() && !e.isFile()) && function (e, t) {
						var r = void 0 !== t.pathExt ? t.pathExt : process.env.PATHEXT;
						if (!r)
							return !0;
						if (-1 !== (r = r.split(";")).indexOf(""))
							return !0;
						for (var n = 0; n < r.length; n++) {
							var o = r[n].toLowerCase();
							if (o && e.substr(-o.length).toLowerCase() === o)
								return !0
						}
						return !1
					}
					(t, r)
				}
				function i(e, t, r) {
					n.stat(e, function (n, i) {
						r(n, !n && o(i, e, t))
					})
				}
			}, function (e, t, r) {
				e.exports = o,
				o.sync = function (e, t) {
					return i(n.statSync(e), t)
				};
				var n = r(2);
				function o(e, t, r) {
					n.stat(e, function (e, n) {
						r(e, !e && i(n, t))
					})
				}
				function i(e, t) {
					return e.isFile() && function (e, t) {
						var r = e.mode,
						n = e.uid,
						o = e.gid,
						i = void 0 !== t.uid ? t.uid : process.getuid && process.getuid(),
						s = void 0 !== t.gid ? t.gid : process.getgid && process.getgid(),
						a = parseInt("100", 8),
						c = parseInt("010", 8),
						u = parseInt("001", 8);
						return r & u || r & c && o === s || r & a && n === i || r & (a | c) && 0 === i
					}
					(e, t)
				}
			}, function (e, t, r) {
				"use strict";
				var n = r(12).Buffer,
				o = r(51),
				i = e.exports;
				i.encodings = null,
				i.defaultCharUnicode = "�",
				i.defaultCharSingleByte = "?",
				i.encode = function (e, t, r) {
					e = "" + (e || "");
					var o = i.getEncoder(t, r),
					s = o.write(e),
					a = o.end();
					return a && a.length > 0 ? n.concat([s, a]) : s
				},
				i.decode = function (e, t, r) {
					"string" == typeof e && (i.skipDecodeWarning || (console.error("Iconv-lite warning: decode()-ing strings is deprecated. Refer to https://github.com/ashtuchkin/iconv-lite/wiki/Use-Buffers-when-decoding"), i.skipDecodeWarning = !0), e = n.from("" + (e || ""), "binary"));
					var o = i.getDecoder(t, r),
					s = o.write(e),
					a = o.end();
					return a ? s + a : s
				},
				i.encodingExists = function (e) {
					try {
						return i.getCodec(e),
						!0
					} catch (e) {
						return !1
					}
				},
				i.toEncoding = i.encode,
				i.fromEncoding = i.decode,
				i._codecDataCache = {},
				i.getCodec = function (e) {
					i.encodings || (i.encodings = r(52));
					for (var t = i._canonicalizeEncoding(e), n = {}; ; ) {
						var o = i._codecDataCache[t];
						if (o)
							return o;
						var s = i.encodings[t];
						switch (typeof s) {
						case "string":
							t = s;
							break;
						case "object":
							for (var a in s)
								n[a] = s[a];
							n.encodingName || (n.encodingName = t),
							t = s.type;
							break;
						case "function":
							return n.encodingName || (n.encodingName = t),
							o = new s(n, i),
							i._codecDataCache[n.encodingName] = o,
							o;
						default:
							throw new Error("Encoding not recognized: '" + e + "' (searched as: '" + t + "')")
						}
					}
				},
				i._canonicalizeEncoding = function (e) {
					return ("" + e).toLowerCase().replace(/:\d{4}$|[^0-9a-z]/g, "")
				},
				i.getEncoder = function (e, t) {
					var r = i.getCodec(e),
					n = new r.encoder(t, r);
					return r.bomAware && t && t.addBOM && (n = new o.PrependBOM(n, t)),
					n
				},
				i.getDecoder = function (e, t) {
					var r = i.getCodec(e),
					n = new r.decoder(t, r);
					return !r.bomAware || t && !1 === t.stripBOM || (n = new o.StripBOM(n, t)),
					n
				};
				var s = "undefined" != typeof process && process.versions && process.versions.node;
				if (s) {
					var a = s.split(".").map(Number);
					(a[0] > 0 || a[1] >= 10) && r(66)(i),
					r(67)(i)
				}
			}, function (e, t, r) {
				"use strict";
				function n(e, t) {
					this.encoder = e,
					this.addBOM = !0
				}
				function o(e, t) {
					this.decoder = e,
					this.pass = !1,
					this.options = t || {}
				}
				t.PrependBOM = n,
				n.prototype.write = function (e) {
					return this.addBOM && (e = "\ufeff" + e, this.addBOM = !1),
					this.encoder.write(e)
				},
				n.prototype.end = function () {
					return this.encoder.end()
				},
				t.StripBOM = o,
				o.prototype.write = function (e) {
					var t = this.decoder.write(e);
					return this.pass || !t ? t : ("\ufeff" === t[0] && (t = t.slice(1), "function" == typeof this.options.stripBOM && this.options.stripBOM()), this.pass = !0, t)
				},
				o.prototype.end = function () {
					return this.decoder.end()
				}
			}, function (e, t, r) {
				"use strict";
				for (var n = [r(53), r(54), r(55), r(56), r(57), r(58), r(59), r(60)], o = 0; o < n.length; o++) {
					e = n[o];
					for (var i in e)
						Object.prototype.hasOwnProperty.call(e, i) && (t[i] = e[i])
				}
			}, function (e, t, r) {
				"use strict";
				var n = r(12).Buffer;
				function o(e, t) {
					this.enc = e.encodingName,
					this.bomAware = e.bomAware,
					"base64" === this.enc ? this.encoder = c : "cesu8" === this.enc && (this.enc = "utf8", this.encoder = u, "💩" !== n.from("eda0bdedb2a9", "hex").toString() && (this.decoder = l, this.defaultCharUnicode = t.defaultCharUnicode))
				}
				e.exports = {
					utf8: {
						type: "_internal",
						bomAware: !0
					},
					cesu8: {
						type: "_internal",
						bomAware: !0
					},
					unicode11utf8: "utf8",
					ucs2: {
						type: "_internal",
						bomAware: !0
					},
					utf16le: "ucs2",
					binary: {
						type: "_internal"
					},
					base64: {
						type: "_internal"
					},
					hex: {
						type: "_internal"
					},
					_internal: o
				},
				o.prototype.encoder = a,
				o.prototype.decoder = s;
				var i = r(29).StringDecoder;
				function s(e, t) {
					i.call(this, t.enc)
				}
				function a(e, t) {
					this.enc = t.enc
				}
				function c(e, t) {
					this.prevStr = ""
				}
				function u(e, t) {}
				function l(e, t) {
					this.acc = 0,
					this.contBytes = 0,
					this.accBytes = 0,
					this.defaultCharUnicode = t.defaultCharUnicode
				}
				i.prototype.end || (i.prototype.end = function () {}),
				s.prototype = i.prototype,
				a.prototype.write = function (e) {
					return n.from(e, this.enc)
				},
				a.prototype.end = function () {},
				c.prototype.write = function (e) {
					var t = (e = this.prevStr + e).length - e.length % 4;
					return this.prevStr = e.slice(t),
					e = e.slice(0, t),
					n.from(e, "base64")
				},
				c.prototype.end = function () {
					return n.from(this.prevStr, "base64")
				},
				u.prototype.write = function (e) {
					for (var t = n.alloc(3 * e.length), r = 0, o = 0; o < e.length; o++) {
						var i = e.charCodeAt(o);
						i < 128 ? t[r++] = i : i < 2048 ? (t[r++] = 192 + (i >>> 6), t[r++] = 128 + (63 & i)) : (t[r++] = 224 + (i >>> 12), t[r++] = 128 + (i >>> 6 & 63), t[r++] = 128 + (63 & i))
					}
					return t.slice(0, r)
				},
				u.prototype.end = function () {},
				l.prototype.write = function (e) {
					for (var t = this.acc, r = this.contBytes, n = this.accBytes, o = "", i = 0; i < e.length; i++) {
						var s = e[i];
						128 != (192 & s) ? (r > 0 && (o += this.defaultCharUnicode, r = 0), s < 128 ? o += String.fromCharCode(s) : s < 224 ? (t = 31 & s, r = 1, n = 1) : s < 240 ? (t = 15 & s, r = 2, n = 1) : o += this.defaultCharUnicode) : r > 0 ? (t = t << 6 | 63 & s, n++, 0 === --r && (o += 2 === n && t < 128 && t > 0 ? this.defaultCharUnicode : 3 === n && t < 2048 ? this.defaultCharUnicode : String.fromCharCode(t))) : o += this.defaultCharUnicode
					}
					return this.acc = t,
					this.contBytes = r,
					this.accBytes = n,
					o
				},
				l.prototype.end = function () {
					var e = 0;
					return this.contBytes > 0 && (e += this.defaultCharUnicode),
					e
				}
			}, function (e, t, r) {
				"use strict";
				var n = r(12).Buffer;
				function o() {}
				function i() {}
				function s() {
					this.overflowByte = -1
				}
				function a(e, t) {
					this.iconv = t
				}
				function c(e, t) {
					void 0 === (e = e || {}).addBOM && (e.addBOM = !0),
					this.encoder = t.iconv.getEncoder("utf-16le", e)
				}
				function u(e, t) {
					this.decoder = null,
					this.initialBytes = [],
					this.initialBytesLen = 0,
					this.options = e || {},
					this.iconv = t.iconv
				}
				function l(e, t) {
					var r = t || "utf-16le";
					if (e.length >= 2)
						if (254 == e[0] && 255 == e[1])
							r = "utf-16be";
						else if (255 == e[0] && 254 == e[1])
							r = "utf-16le";
						else {
							for (var n = 0, o = 0, i = Math.min(e.length - e.length % 2, 64), s = 0; s < i; s += 2)
								0 === e[s] && 0 !== e[s + 1] && o++, 0 !== e[s] && 0 === e[s + 1] && n++;
							o > n ? r = "utf-16be" : o < n && (r = "utf-16le")
						}
					return r
				}
				t.utf16be = o,
				o.prototype.encoder = i,
				o.prototype.decoder = s,
				o.prototype.bomAware = !0,
				i.prototype.write = function (e) {
					for (var t = n.from(e, "ucs2"), r = 0; r < t.length; r += 2) {
						var o = t[r];
						t[r] = t[r + 1],
						t[r + 1] = o
					}
					return t
				},
				i.prototype.end = function () {},
				s.prototype.write = function (e) {
					if (0 == e.length)
						return "";
					var t = n.alloc(e.length + 1),
					r = 0,
					o = 0;
					for (-1 !== this.overflowByte && (t[0] = e[0], t[1] = this.overflowByte, r = 1, o = 2); r < e.length - 1; r += 2, o += 2)
						t[o] = e[r + 1], t[o + 1] = e[r];
					return this.overflowByte = r == e.length - 1 ? e[e.length - 1] : -1,
					t.slice(0, o).toString("ucs2")
				},
				s.prototype.end = function () {},
				t.utf16 = a,
				a.prototype.encoder = c,
				a.prototype.decoder = u,
				c.prototype.write = function (e) {
					return this.encoder.write(e)
				},
				c.prototype.end = function () {
					return this.encoder.end()
				},
				u.prototype.write = function (e) {
					if (!this.decoder) {
						if (this.initialBytes.push(e), this.initialBytesLen += e.length, this.initialBytesLen < 16)
							return "";
						var t = l(e = n.concat(this.initialBytes), this.options.defaultEncoding);
						this.decoder = this.iconv.getDecoder(t, this.options),
						this.initialBytes.length = this.initialBytesLen = 0
					}
					return this.decoder.write(e)
				},
				u.prototype.end = function () {
					if (!this.decoder) {
						var e = n.concat(this.initialBytes),
						t = l(e, this.options.defaultEncoding);
						this.decoder = this.iconv.getDecoder(t, this.options);
						var r = this.decoder.write(e),
						o = this.decoder.end();
						return o ? r + o : r
					}
					return this.decoder.end()
				}
			}, function (e, t, r) {
				"use strict";
				var n = r(12).Buffer;
				function o(e, t) {
					this.iconv = t
				}
				t.utf7 = o,
				t.unicode11utf7 = "utf7",
				o.prototype.encoder = s,
				o.prototype.decoder = a,
				o.prototype.bomAware = !0;
				var i = /[^A-Za-z0-9'\(\),-\.\/:\? \n\r\t]+/g;
				function s(e, t) {
					this.iconv = t.iconv
				}
				function a(e, t) {
					this.iconv = t.iconv,
					this.inBase64 = !1,
					this.base64Accum = ""
				}
				s.prototype.write = function (e) {
					return n.from(e.replace(i, function (e) {
							return "+" + ("+" === e ? "" : this.iconv.encode(e, "utf16-be").toString("base64").replace(/=+$/, "")) + "-"
						}
							.bind(this)))
				},
				s.prototype.end = function () {};
				for (var c = /[A-Za-z0-9\/+]/, u = [], l = 0; l < 256; l++)
					u[l] = c.test(String.fromCharCode(l));
				var h = "+".charCodeAt(0),
				p = "-".charCodeAt(0),
				d = "&".charCodeAt(0);
				function f(e, t) {
					this.iconv = t
				}
				function g(e, t) {
					this.iconv = t.iconv,
					this.inBase64 = !1,
					this.base64Accum = n.alloc(6),
					this.base64AccumIdx = 0
				}
				function m(e, t) {
					this.iconv = t.iconv,
					this.inBase64 = !1,
					this.base64Accum = ""
				}
				a.prototype.write = function (e) {
					for (var t = "", r = 0, o = this.inBase64, i = this.base64Accum, s = 0; s < e.length; s++)
						if (o) {
							if (!u[e[s]]) {
								if (s == r && e[s] == p)
									t += "+";
								else {
									var a = i + e.slice(r, s).toString();
									t += this.iconv.decode(n.from(a, "base64"), "utf16-be")
								}
								e[s] != p && s--,
								r = s + 1,
								o = !1,
								i = ""
							}
						} else
							e[s] == h && (t += this.iconv.decode(e.slice(r, s), "ascii"), r = s + 1, o = !0);
					if (o) {
						var c = (a = i + e.slice(r).toString()).length - a.length % 8;
						i = a.slice(c),
						a = a.slice(0, c),
						t += this.iconv.decode(n.from(a, "base64"), "utf16-be")
					} else
						t += this.iconv.decode(e.slice(r), "ascii");
					return this.inBase64 = o,
					this.base64Accum = i,
					t
				},
				a.prototype.end = function () {
					var e = "";
					return this.inBase64 && this.base64Accum.length > 0 && (e = this.iconv.decode(n.from(this.base64Accum, "base64"), "utf16-be")),
					this.inBase64 = !1,
					this.base64Accum = "",
					e
				},
				t.utf7imap = f,
				f.prototype.encoder = g,
				f.prototype.decoder = m,
				f.prototype.bomAware = !0,
				g.prototype.write = function (e) {
					for (var t = this.inBase64, r = this.base64Accum, o = this.base64AccumIdx, i = n.alloc(5 * e.length + 10), s = 0, a = 0; a < e.length; a++) {
						var c = e.charCodeAt(a);
						32 <= c && c <= 126 ? (t && (o > 0 && (s += i.write(r.slice(0, o).toString("base64").replace(/\//g, ",").replace(/=+$/, ""), s), o = 0), i[s++] = p, t = !1), t || (i[s++] = c, c === d && (i[s++] = p))) : (t || (i[s++] = d, t = !0), t && (r[o++] = c >> 8, r[o++] = 255 & c, o == r.length && (s += i.write(r.toString("base64").replace(/\//g, ","), s), o = 0)))
					}
					return this.inBase64 = t,
					this.base64AccumIdx = o,
					i.slice(0, s)
				},
				g.prototype.end = function () {
					var e = n.alloc(10),
					t = 0;
					return this.inBase64 && (this.base64AccumIdx > 0 && (t += e.write(this.base64Accum.slice(0, this.base64AccumIdx).toString("base64").replace(/\//g, ",").replace(/=+$/, ""), t), this.base64AccumIdx = 0), e[t++] = p, this.inBase64 = !1),
					e.slice(0, t)
				};
				var y = u.slice();
				y[",".charCodeAt(0)] = !0,
				m.prototype.write = function (e) {
					for (var t = "", r = 0, o = this.inBase64, i = this.base64Accum, s = 0; s < e.length; s++)
						if (o) {
							if (!y[e[s]]) {
								if (s == r && e[s] == p)
									t += "&";
								else {
									var a = i + e.slice(r, s).toString().replace(/,/g, "/");
									t += this.iconv.decode(n.from(a, "base64"), "utf16-be")
								}
								e[s] != p && s--,
								r = s + 1,
								o = !1,
								i = ""
							}
						} else
							e[s] == d && (t += this.iconv.decode(e.slice(r, s), "ascii"), r = s + 1, o = !0);
					if (o) {
						var c = (a = i + e.slice(r).toString().replace(/,/g, "/")).length - a.length % 8;
						i = a.slice(c),
						a = a.slice(0, c),
						t += this.iconv.decode(n.from(a, "base64"), "utf16-be")
					} else
						t += this.iconv.decode(e.slice(r), "ascii");
					return this.inBase64 = o,
					this.base64Accum = i,
					t
				},
				m.prototype.end = function () {
					var e = "";
					return this.inBase64 && this.base64Accum.length > 0 && (e = this.iconv.decode(n.from(this.base64Accum, "base64"), "utf16-be")),
					this.inBase64 = !1,
					this.base64Accum = "",
					e
				}
			}, function (e, t, r) {
				"use strict";
				var n = r(12).Buffer;
				function o(e, t) {
					if (!e)
						throw new Error("SBCS codec is called without the data.");
					if (!e.chars || 128 !== e.chars.length && 256 !== e.chars.length)
						throw new Error("Encoding '" + e.type + "' has incorrect 'chars' (must be of len 128 or 256)");
					if (128 === e.chars.length) {
						for (var r = "", o = 0; o < 128; o++)
							r += String.fromCharCode(o);
						e.chars = r + e.chars
					}
					this.decodeBuf = n.from(e.chars, "ucs2");
					var i = n.alloc(65536, t.defaultCharSingleByte.charCodeAt(0));
					for (o = 0; o < e.chars.length; o++)
						i[e.chars.charCodeAt(o)] = o;
					this.encodeBuf = i
				}
				function i(e, t) {
					this.encodeBuf = t.encodeBuf
				}
				function s(e, t) {
					this.decodeBuf = t.decodeBuf
				}
				t._sbcs = o,
				o.prototype.encoder = i,
				o.prototype.decoder = s,
				i.prototype.write = function (e) {
					for (var t = n.alloc(e.length), r = 0; r < e.length; r++)
						t[r] = this.encodeBuf[e.charCodeAt(r)];
					return t
				},
				i.prototype.end = function () {},
				s.prototype.write = function (e) {
					for (var t = this.decodeBuf, r = n.alloc(2 * e.length), o = 0, i = 0, s = 0; s < e.length; s++)
						o = 2 * e[s], r[i = 2 * s] = t[o], r[i + 1] = t[o + 1];
					return r.toString("ucs2")
				},
				s.prototype.end = function () {}
			}, function (e, t, r) {
				"use strict";
				e.exports = {
					10029: "maccenteuro",
					maccenteuro: {
						type: "_sbcs",
						chars: "ÄĀāÉĄÖÜáąČäčĆćéŹźĎíďĒēĖóėôöõúĚěü†°Ę£§•¶ß®©™ę¨≠ģĮįĪ≤≥īĶ∂∑łĻļĽľĹĺŅņŃ¬√ńŇ∆«»… ňŐÕőŌ–—“”‘’÷◊ōŔŕŘ‹›řŖŗŠ‚„šŚśÁŤťÍŽžŪÓÔūŮÚůŰűŲųÝýķŻŁżĢˇ"
					},
					808: "cp808",
					ibm808: "cp808",
					cp808: {
						type: "_sbcs",
						chars: "АБВГДЕЖЗИЙКЛМНОПРСТУФХЦЧШЩЪЫЬЭЮЯабвгдежзийклмноп░▒▓│┤╡╢╖╕╣║╗╝╜╛┐└┴┬├─┼╞╟╚╔╩╦╠═╬╧╨╤╥╙╘╒╓╫╪┘┌█▄▌▐▀рстуфхцчшщъыьэюяЁёЄєЇїЎў°∙·√№€■ "
					},
					mik: {
						type: "_sbcs",
						chars: "АБВГДЕЖЗИЙКЛМНОПРСТУФХЦЧШЩЪЫЬЭЮЯабвгдежзийклмнопрстуфхцчшщъыьэюя└┴┬├─┼╣║╚╔╩╦╠═╬┐░▒▓│┤№§╗╝┘┌█▄▌▐▀αßΓπΣσµτΦΘΩδ∞φε∩≡±≥≤⌠⌡÷≈°∙·√ⁿ²■ "
					},
					ascii8bit: "ascii",
					usascii: "ascii",
					ansix34: "ascii",
					ansix341968: "ascii",
					ansix341986: "ascii",
					csascii: "ascii",
					cp367: "ascii",
					ibm367: "ascii",
					isoir6: "ascii",
					iso646us: "ascii",
					iso646irv: "ascii",
					us: "ascii",
					latin1: "iso88591",
					latin2: "iso88592",
					latin3: "iso88593",
					latin4: "iso88594",
					latin5: "iso88599",
					latin6: "iso885910",
					latin7: "iso885913",
					latin8: "iso885914",
					latin9: "iso885915",
					latin10: "iso885916",
					csisolatin1: "iso88591",
					csisolatin2: "iso88592",
					csisolatin3: "iso88593",
					csisolatin4: "iso88594",
					csisolatincyrillic: "iso88595",
					csisolatinarabic: "iso88596",
					csisolatingreek: "iso88597",
					csisolatinhebrew: "iso88598",
					csisolatin5: "iso88599",
					csisolatin6: "iso885910",
					l1: "iso88591",
					l2: "iso88592",
					l3: "iso88593",
					l4: "iso88594",
					l5: "iso88599",
					l6: "iso885910",
					l7: "iso885913",
					l8: "iso885914",
					l9: "iso885915",
					l10: "iso885916",
					isoir14: "iso646jp",
					isoir57: "iso646cn",
					isoir100: "iso88591",
					isoir101: "iso88592",
					isoir109: "iso88593",
					isoir110: "iso88594",
					isoir144: "iso88595",
					isoir127: "iso88596",
					isoir126: "iso88597",
					isoir138: "iso88598",
					isoir148: "iso88599",
					isoir157: "iso885910",
					isoir166: "tis620",
					isoir179: "iso885913",
					isoir199: "iso885914",
					isoir203: "iso885915",
					isoir226: "iso885916",
					cp819: "iso88591",
					ibm819: "iso88591",
					cyrillic: "iso88595",
					arabic: "iso88596",
					arabic8: "iso88596",
					ecma114: "iso88596",
					asmo708: "iso88596",
					greek: "iso88597",
					greek8: "iso88597",
					ecma118: "iso88597",
					elot928: "iso88597",
					hebrew: "iso88598",
					hebrew8: "iso88598",
					turkish: "iso88599",
					turkish8: "iso88599",
					thai: "iso885911",
					thai8: "iso885911",
					celtic: "iso885914",
					celtic8: "iso885914",
					isoceltic: "iso885914",
					tis6200: "tis620",
					tis62025291: "tis620",
					tis62025330: "tis620",
					10000: "macroman",
					10006: "macgreek",
					10007: "maccyrillic",
					10079: "maciceland",
					10081: "macturkish",
					cspc8codepage437: "cp437",
					cspc775baltic: "cp775",
					cspc850multilingual: "cp850",
					cspcp852: "cp852",
					cspc862latinhebrew: "cp862",
					cpgr: "cp869",
					msee: "cp1250",
					mscyrl: "cp1251",
					msansi: "cp1252",
					msgreek: "cp1253",
					msturk: "cp1254",
					mshebr: "cp1255",
					msarab: "cp1256",
					winbaltrim: "cp1257",
					cp20866: "koi8r",
					20866: "koi8r",
					ibm878: "koi8r",
					cskoi8r: "koi8r",
					cp21866: "koi8u",
					21866: "koi8u",
					ibm1168: "koi8u",
					strk10482002: "rk1048",
					tcvn5712: "tcvn",
					tcvn57121: "tcvn",
					gb198880: "iso646cn",
					cn: "iso646cn",
					csiso14jisc6220ro: "iso646jp",
					jisc62201969ro: "iso646jp",
					jp: "iso646jp",
					cshproman8: "hproman8",
					r8: "hproman8",
					roman8: "hproman8",
					xroman8: "hproman8",
					ibm1051: "hproman8",
					mac: "macintosh",
					csmacintosh: "macintosh"
				}
			}, function (e, t, r) {
				"use strict";
				e.exports = {
					437: "cp437",
					737: "cp737",
					775: "cp775",
					850: "cp850",
					852: "cp852",
					855: "cp855",
					856: "cp856",
					857: "cp857",
					858: "cp858",
					860: "cp860",
					861: "cp861",
					862: "cp862",
					863: "cp863",
					864: "cp864",
					865: "cp865",
					866: "cp866",
					869: "cp869",
					874: "windows874",
					922: "cp922",
					1046: "cp1046",
					1124: "cp1124",
					1125: "cp1125",
					1129: "cp1129",
					1133: "cp1133",
					1161: "cp1161",
					1162: "cp1162",
					1163: "cp1163",
					1250: "windows1250",
					1251: "windows1251",
					1252: "windows1252",
					1253: "windows1253",
					1254: "windows1254",
					1255: "windows1255",
					1256: "windows1256",
					1257: "windows1257",
					1258: "windows1258",
					28591: "iso88591",
					28592: "iso88592",
					28593: "iso88593",
					28594: "iso88594",
					28595: "iso88595",
					28596: "iso88596",
					28597: "iso88597",
					28598: "iso88598",
					28599: "iso88599",
					28600: "iso885910",
					28601: "iso885911",
					28603: "iso885913",
					28604: "iso885914",
					28605: "iso885915",
					28606: "iso885916",
					windows874: {
						type: "_sbcs",
						chars: "€����…�����������‘’“”•–—�������� กขฃคฅฆงจฉชซฌญฎฏฐฑฒณดตถทธนบปผฝพฟภมยรฤลฦวศษสหฬอฮฯะัาำิีึืฺุู����฿เแโใไๅๆ็่้๊๋์ํ๎๏๐๑๒๓๔๕๖๗๘๙๚๛����"
					},
					win874: "windows874",
					cp874: "windows874",
					windows1250: {
						type: "_sbcs",
						chars: "€�‚�„…†‡�‰Š‹ŚŤŽŹ�‘’“”•–—�™š›śťžź ˇ˘Ł¤Ą¦§¨©Ş«¬­®Ż°±˛ł´µ¶·¸ąş»Ľ˝ľżŔÁÂĂÄĹĆÇČÉĘËĚÍÎĎĐŃŇÓÔŐÖ×ŘŮÚŰÜÝŢßŕáâăäĺćçčéęëěíîďđńňóôőö÷řůúűüýţ˙"
					},
					win1250: "windows1250",
					cp1250: "windows1250",
					windows1251: {
						type: "_sbcs",
						chars: "ЂЃ‚ѓ„…†‡€‰Љ‹ЊЌЋЏђ‘’“”•–—�™љ›њќћџ ЎўЈ¤Ґ¦§Ё©Є«¬­®Ї°±Ііґµ¶·ё№є»јЅѕїАБВГДЕЖЗИЙКЛМНОПРСТУФХЦЧШЩЪЫЬЭЮЯабвгдежзийклмнопрстуфхцчшщъыьэюя"
					},
					win1251: "windows1251",
					cp1251: "windows1251",
					windows1252: {
						type: "_sbcs",
						chars: "€�‚ƒ„…†‡ˆ‰Š‹Œ�Ž��‘’“”•–—˜™š›œ�žŸ ¡¢£¤¥¦§¨©ª«¬­®¯°±²³´µ¶·¸¹º»¼½¾¿ÀÁÂÃÄÅÆÇÈÉÊËÌÍÎÏÐÑÒÓÔÕÖ×ØÙÚÛÜÝÞßàáâãäåæçèéêëìíîïðñòóôõö÷øùúûüýþÿ"
					},
					win1252: "windows1252",
					cp1252: "windows1252",
					windows1253: {
						type: "_sbcs",
						chars: "€�‚ƒ„…†‡�‰�‹�����‘’“”•–—�™�›���� ΅Ά£¤¥¦§¨©�«¬­®―°±²³΄µ¶·ΈΉΊ»Ό½ΎΏΐΑΒΓΔΕΖΗΘΙΚΛΜΝΞΟΠΡ�ΣΤΥΦΧΨΩΪΫάέήίΰαβγδεζηθικλμνξοπρςστυφχψωϊϋόύώ�"
					},
					win1253: "windows1253",
					cp1253: "windows1253",
					windows1254: {
						type: "_sbcs",
						chars: "€�‚ƒ„…†‡ˆ‰Š‹Œ����‘’“”•–—˜™š›œ��Ÿ ¡¢£¤¥¦§¨©ª«¬­®¯°±²³´µ¶·¸¹º»¼½¾¿ÀÁÂÃÄÅÆÇÈÉÊËÌÍÎÏĞÑÒÓÔÕÖ×ØÙÚÛÜİŞßàáâãäåæçèéêëìíîïğñòóôõö÷øùúûüışÿ"
					},
					win1254: "windows1254",
					cp1254: "windows1254",
					windows1255: {
						type: "_sbcs",
						chars: "€�‚ƒ„…†‡ˆ‰�‹�����‘’“”•–—˜™�›���� ¡¢£₪¥¦§¨©×«¬­®¯°±²³´µ¶·¸¹÷»¼½¾¿ְֱֲֳִֵֶַָֹֺֻּֽ־ֿ׀ׁׂ׃װױײ׳״�������אבגדהוזחטיךכלםמןנסעףפץצקרשת��‎‏�"
					},
					win1255: "windows1255",
					cp1255: "windows1255",
					windows1256: {
						type: "_sbcs",
						chars: "€پ‚ƒ„…†‡ˆ‰ٹ‹Œچژڈگ‘’“”•–—ک™ڑ›œ‌‍ں ،¢£¤¥¦§¨©ھ«¬­®¯°±²³´µ¶·¸¹؛»¼½¾؟ہءآأؤإئابةتثجحخدذرزسشصض×طظعغـفقكàلâمنهوçèéêëىيîïًٌٍَôُِ÷ّùْûü‎‏ے"
					},
					win1256: "windows1256",
					cp1256: "windows1256",
					windows1257: {
						type: "_sbcs",
						chars: "€�‚�„…†‡�‰�‹�¨ˇ¸�‘’“”•–—�™�›�¯˛� �¢£¤�¦§Ø©Ŗ«¬­®Æ°±²³´µ¶·ø¹ŗ»¼½¾æĄĮĀĆÄÅĘĒČÉŹĖĢĶĪĻŠŃŅÓŌÕÖ×ŲŁŚŪÜŻŽßąįāćäåęēčéźėģķīļšńņóōõö÷ųłśūüżž˙"
					},
					win1257: "windows1257",
					cp1257: "windows1257",
					windows1258: {
						type: "_sbcs",
						chars: "€�‚ƒ„…†‡ˆ‰�‹Œ����‘’“”•–—˜™�›œ��Ÿ ¡¢£¤¥¦§¨©ª«¬­®¯°±²³´µ¶·¸¹º»¼½¾¿ÀÁÂĂÄÅÆÇÈÉÊË̀ÍÎÏĐÑ̉ÓÔƠÖ×ØÙÚÛÜỮßàáâăäåæçèéêë́íîïđṇ̃óôơö÷øùúûüư₫ÿ"
					},
					win1258: "windows1258",
					cp1258: "windows1258",
					iso88591: {
						type: "_sbcs",
						chars: " ¡¢£¤¥¦§¨©ª«¬­®¯°±²³´µ¶·¸¹º»¼½¾¿ÀÁÂÃÄÅÆÇÈÉÊËÌÍÎÏÐÑÒÓÔÕÖ×ØÙÚÛÜÝÞßàáâãäåæçèéêëìíîïðñòóôõö÷øùúûüýþÿ"
					},
					cp28591: "iso88591",
					iso88592: {
						type: "_sbcs",
						chars: " Ą˘Ł¤ĽŚ§¨ŠŞŤŹ­ŽŻ°ą˛ł´ľśˇ¸šşťź˝žżŔÁÂĂÄĹĆÇČÉĘËĚÍÎĎĐŃŇÓÔŐÖ×ŘŮÚŰÜÝŢßŕáâăäĺćçčéęëěíîďđńňóôőö÷řůúűüýţ˙"
					},
					cp28592: "iso88592",
					iso88593: {
						type: "_sbcs",
						chars: " Ħ˘£¤�Ĥ§¨İŞĞĴ­�Ż°ħ²³´µĥ·¸ışğĵ½�żÀÁÂ�ÄĊĈÇÈÉÊËÌÍÎÏ�ÑÒÓÔĠÖ×ĜÙÚÛÜŬŜßàáâ�äċĉçèéêëìíîï�ñòóôġö÷ĝùúûüŭŝ˙"
					},
					cp28593: "iso88593",
					iso88594: {
						type: "_sbcs",
						chars: " ĄĸŖ¤ĨĻ§¨ŠĒĢŦ­Ž¯°ą˛ŗ´ĩļˇ¸šēģŧŊžŋĀÁÂÃÄÅÆĮČÉĘËĖÍÎĪĐŅŌĶÔÕÖ×ØŲÚÛÜŨŪßāáâãäåæįčéęëėíîīđņōķôõö÷øųúûüũū˙"
					},
					cp28594: "iso88594",
					iso88595: {
						type: "_sbcs",
						chars: " ЁЂЃЄЅІЇЈЉЊЋЌ­ЎЏАБВГДЕЖЗИЙКЛМНОПРСТУФХЦЧШЩЪЫЬЭЮЯабвгдежзийклмнопрстуфхцчшщъыьэюя№ёђѓєѕіїјљњћќ§ўџ"
					},
					cp28595: "iso88595",
					iso88596: {
						type: "_sbcs",
						chars: " ���¤�������،­�������������؛���؟�ءآأؤإئابةتثجحخدذرزسشصضطظعغ�����ـفقكلمنهوىيًٌٍَُِّْ�������������"
					},
					cp28596: "iso88596",
					iso88597: {
						type: "_sbcs",
						chars: " ‘’£€₯¦§¨©ͺ«¬­�―°±²³΄΅Ά·ΈΉΊ»Ό½ΎΏΐΑΒΓΔΕΖΗΘΙΚΛΜΝΞΟΠΡ�ΣΤΥΦΧΨΩΪΫάέήίΰαβγδεζηθικλμνξοπρςστυφχψωϊϋόύώ�"
					},
					cp28597: "iso88597",
					iso88598: {
						type: "_sbcs",
						chars: " �¢£¤¥¦§¨©×«¬­®¯°±²³´µ¶·¸¹÷»¼½¾��������������������������������‗אבגדהוזחטיךכלםמןנסעףפץצקרשת��‎‏�"
					},
					cp28598: "iso88598",
					iso88599: {
						type: "_sbcs",
						chars: " ¡¢£¤¥¦§¨©ª«¬­®¯°±²³´µ¶·¸¹º»¼½¾¿ÀÁÂÃÄÅÆÇÈÉÊËÌÍÎÏĞÑÒÓÔÕÖ×ØÙÚÛÜİŞßàáâãäåæçèéêëìíîïğñòóôõö÷øùúûüışÿ"
					},
					cp28599: "iso88599",
					iso885910: {
						type: "_sbcs",
						chars: " ĄĒĢĪĨĶ§ĻĐŠŦŽ­ŪŊ°ąēģīĩķ·ļđšŧž―ūŋĀÁÂÃÄÅÆĮČÉĘËĖÍÎÏÐŅŌÓÔÕÖŨØŲÚÛÜÝÞßāáâãäåæįčéęëėíîïðņōóôõöũøųúûüýþĸ"
					},
					cp28600: "iso885910",
					iso885911: {
						type: "_sbcs",
						chars: " กขฃคฅฆงจฉชซฌญฎฏฐฑฒณดตถทธนบปผฝพฟภมยรฤลฦวศษสหฬอฮฯะัาำิีึืฺุู����฿เแโใไๅๆ็่้๊๋์ํ๎๏๐๑๒๓๔๕๖๗๘๙๚๛����"
					},
					cp28601: "iso885911",
					iso885913: {
						type: "_sbcs",
						chars: " ”¢£¤„¦§Ø©Ŗ«¬­®Æ°±²³“µ¶·ø¹ŗ»¼½¾æĄĮĀĆÄÅĘĒČÉŹĖĢĶĪĻŠŃŅÓŌÕÖ×ŲŁŚŪÜŻŽßąįāćäåęēčéźėģķīļšńņóōõö÷ųłśūüżž’"
					},
					cp28603: "iso885913",
					iso885914: {
						type: "_sbcs",
						chars: " Ḃḃ£ĊċḊ§Ẁ©ẂḋỲ­®ŸḞḟĠġṀṁ¶ṖẁṗẃṠỳẄẅṡÀÁÂÃÄÅÆÇÈÉÊËÌÍÎÏŴÑÒÓÔÕÖṪØÙÚÛÜÝŶßàáâãäåæçèéêëìíîïŵñòóôõöṫøùúûüýŷÿ"
					},
					cp28604: "iso885914",
					iso885915: {
						type: "_sbcs",
						chars: " ¡¢£€¥Š§š©ª«¬­®¯°±²³Žµ¶·ž¹º»ŒœŸ¿ÀÁÂÃÄÅÆÇÈÉÊËÌÍÎÏÐÑÒÓÔÕÖ×ØÙÚÛÜÝÞßàáâãäåæçèéêëìíîïðñòóôõö÷øùúûüýþÿ"
					},
					cp28605: "iso885915",
					iso885916: {
						type: "_sbcs",
						chars: " ĄąŁ€„Š§š©Ș«Ź­źŻ°±ČłŽ”¶·žčș»ŒœŸżÀÁÂĂÄĆÆÇÈÉÊËÌÍÎÏĐŃÒÓÔŐÖŚŰÙÚÛÜĘȚßàáâăäćæçèéêëìíîïđńòóôőöśűùúûüęțÿ"
					},
					cp28606: "iso885916",
					cp437: {
						type: "_sbcs",
						chars: "ÇüéâäàåçêëèïîìÄÅÉæÆôöòûùÿÖÜ¢£¥₧ƒáíóúñÑªº¿⌐¬½¼¡«»░▒▓│┤╡╢╖╕╣║╗╝╜╛┐└┴┬├─┼╞╟╚╔╩╦╠═╬╧╨╤╥╙╘╒╓╫╪┘┌█▄▌▐▀αßΓπΣσµτΦΘΩδ∞φε∩≡±≥≤⌠⌡÷≈°∙·√ⁿ²■ "
					},
					ibm437: "cp437",
					csibm437: "cp437",
					cp737: {
						type: "_sbcs",
						chars: "ΑΒΓΔΕΖΗΘΙΚΛΜΝΞΟΠΡΣΤΥΦΧΨΩαβγδεζηθικλμνξοπρσςτυφχψ░▒▓│┤╡╢╖╕╣║╗╝╜╛┐└┴┬├─┼╞╟╚╔╩╦╠═╬╧╨╤╥╙╘╒╓╫╪┘┌█▄▌▐▀ωάέήϊίόύϋώΆΈΉΊΌΎΏ±≥≤ΪΫ÷≈°∙·√ⁿ²■ "
					},
					ibm737: "cp737",
					csibm737: "cp737",
					cp775: {
						type: "_sbcs",
						chars: "ĆüéāäģåćłēŖŗīŹÄÅÉæÆōöĢ¢ŚśÖÜø£Ø×¤ĀĪóŻżź”¦©®¬½¼Ł«»░▒▓│┤ĄČĘĖ╣║╗╝ĮŠ┐└┴┬├─┼ŲŪ╚╔╩╦╠═╬Žąčęėįšųūž┘┌█▄▌▐▀ÓßŌŃõÕµńĶķĻļņĒŅ’­±“¾¶§÷„°∙·¹³²■ "
					},
					ibm775: "cp775",
					csibm775: "cp775",
					cp850: {
						type: "_sbcs",
						chars: "ÇüéâäàåçêëèïîìÄÅÉæÆôöòûùÿÖÜø£Ø×ƒáíóúñÑªº¿®¬½¼¡«»░▒▓│┤ÁÂÀ©╣║╗╝¢¥┐└┴┬├─┼ãÃ╚╔╩╦╠═╬¤ðÐÊËÈıÍÎÏ┘┌█▄¦Ì▀ÓßÔÒõÕµþÞÚÛÙýÝ¯´­±‗¾¶§÷¸°¨·¹³²■ "
					},
					ibm850: "cp850",
					csibm850: "cp850",
					cp852: {
						type: "_sbcs",
						chars: "ÇüéâäůćçłëŐőîŹÄĆÉĹĺôöĽľŚśÖÜŤťŁ×čáíóúĄąŽžĘę¬źČş«»░▒▓│┤ÁÂĚŞ╣║╗╝Żż┐└┴┬├─┼Ăă╚╔╩╦╠═╬¤đĐĎËďŇÍÎě┘┌█▄ŢŮ▀ÓßÔŃńňŠšŔÚŕŰýÝţ´­˝˛ˇ˘§÷¸°¨˙űŘř■ "
					},
					ibm852: "cp852",
					csibm852: "cp852",
					cp855: {
						type: "_sbcs",
						chars: "ђЂѓЃёЁєЄѕЅіІїЇјЈљЉњЊћЋќЌўЎџЏюЮъЪаАбБцЦдДеЕфФгГ«»░▒▓│┤хХиИ╣║╗╝йЙ┐└┴┬├─┼кК╚╔╩╦╠═╬¤лЛмМнНоОп┘┌█▄Пя▀ЯрРсСтТуУжЖвВьЬ№­ыЫзЗшШэЭщЩчЧ§■ "
					},
					ibm855: "cp855",
					csibm855: "cp855",
					cp856: {
						type: "_sbcs",
						chars: "אבגדהוזחטיךכלםמןנסעףפץצקרשת�£�×����������®¬½¼�«»░▒▓│┤���©╣║╗╝¢¥┐└┴┬├─┼��╚╔╩╦╠═╬¤���������┘┌█▄¦�▀������µ�������¯´­±‗¾¶§÷¸°¨·¹³²■ "
					},
					ibm856: "cp856",
					csibm856: "cp856",
					cp857: {
						type: "_sbcs",
						chars: "ÇüéâäàåçêëèïîıÄÅÉæÆôöòûùİÖÜø£ØŞşáíóúñÑĞğ¿®¬½¼¡«»░▒▓│┤ÁÂÀ©╣║╗╝¢¥┐└┴┬├─┼ãÃ╚╔╩╦╠═╬¤ºªÊËÈ�ÍÎÏ┘┌█▄¦Ì▀ÓßÔÒõÕµ�×ÚÛÙìÿ¯´­±�¾¶§÷¸°¨·¹³²■ "
					},
					ibm857: "cp857",
					csibm857: "cp857",
					cp858: {
						type: "_sbcs",
						chars: "ÇüéâäàåçêëèïîìÄÅÉæÆôöòûùÿÖÜø£Ø×ƒáíóúñÑªº¿®¬½¼¡«»░▒▓│┤ÁÂÀ©╣║╗╝¢¥┐└┴┬├─┼ãÃ╚╔╩╦╠═╬¤ðÐÊËÈ€ÍÎÏ┘┌█▄¦Ì▀ÓßÔÒõÕµþÞÚÛÙýÝ¯´­±‗¾¶§÷¸°¨·¹³²■ "
					},
					ibm858: "cp858",
					csibm858: "cp858",
					cp860: {
						type: "_sbcs",
						chars: "ÇüéâãàÁçêÊèÍÔìÃÂÉÀÈôõòÚùÌÕÜ¢£Ù₧ÓáíóúñÑªº¿Ò¬½¼¡«»░▒▓│┤╡╢╖╕╣║╗╝╜╛┐└┴┬├─┼╞╟╚╔╩╦╠═╬╧╨╤╥╙╘╒╓╫╪┘┌█▄▌▐▀αßΓπΣσµτΦΘΩδ∞φε∩≡±≥≤⌠⌡÷≈°∙·√ⁿ²■ "
					},
					ibm860: "cp860",
					csibm860: "cp860",
					cp861: {
						type: "_sbcs",
						chars: "ÇüéâäàåçêëèÐðÞÄÅÉæÆôöþûÝýÖÜø£Ø₧ƒáíóúÁÍÓÚ¿⌐¬½¼¡«»░▒▓│┤╡╢╖╕╣║╗╝╜╛┐└┴┬├─┼╞╟╚╔╩╦╠═╬╧╨╤╥╙╘╒╓╫╪┘┌█▄▌▐▀αßΓπΣσµτΦΘΩδ∞φε∩≡±≥≤⌠⌡÷≈°∙·√ⁿ²■ "
					},
					ibm861: "cp861",
					csibm861: "cp861",
					cp862: {
						type: "_sbcs",
						chars: "אבגדהוזחטיךכלםמןנסעףפץצקרשת¢£¥₧ƒáíóúñÑªº¿⌐¬½¼¡«»░▒▓│┤╡╢╖╕╣║╗╝╜╛┐└┴┬├─┼╞╟╚╔╩╦╠═╬╧╨╤╥╙╘╒╓╫╪┘┌█▄▌▐▀αßΓπΣσµτΦΘΩδ∞φε∩≡±≥≤⌠⌡÷≈°∙·√ⁿ²■ "
					},
					ibm862: "cp862",
					csibm862: "cp862",
					cp863: {
						type: "_sbcs",
						chars: "ÇüéâÂà¶çêëèïî‗À§ÉÈÊôËÏûù¤ÔÜ¢£ÙÛƒ¦´óú¨¸³¯Î⌐¬½¼¾«»░▒▓│┤╡╢╖╕╣║╗╝╜╛┐└┴┬├─┼╞╟╚╔╩╦╠═╬╧╨╤╥╙╘╒╓╫╪┘┌█▄▌▐▀αßΓπΣσµτΦΘΩδ∞φε∩≡±≥≤⌠⌡÷≈°∙·√ⁿ²■ "
					},
					ibm863: "cp863",
					csibm863: "cp863",
					cp864: {
						type: "_sbcs",
						chars: "\0\b\t\n\v\f\r
