/*!
* better-mock v0.3.2 (mock.browser.js)
* (c) 2019-2021 lavyun@163.com
* Released under the MIT License.
*/

(function (global, factory) {
	typeof exports === "object" && typeof module !== "undefined" ? module.exports = factory()
		: typeof define === "function" && define.amd ? define(factory)
			: (global = global || self, global.Mock = factory());
}(this, () => {
	

	const constant = {
		GUID: 1,
		RE_KEY: /(.+)\|(?:\+(\d+)|([+\-]?\d+-?[+\-]?\d*)?(?:\.(\d+-?\d*))?)/,
		RE_TRANSFER_TYPE: /#(.*)$/,
		RE_RANGE: /([+\-]?\d+)-?([+\-]?\d+)?/,
		RE_PLACEHOLDER: /\\*@([^\s#%&()?@]+)(?:\((.*?)\))?/g
	};

	/* type-coverage:ignore-next-line */
	const type = function (value) {
		return isDef(value)
			? Object.prototype.toString.call(value).match(/\[object (\w+)]/)[1].toLowerCase()
			: String(value);
	};
	var isDef = function (value) {
		return value !== undefined && value !== null;
	};
	const isString = function (value) {
		return type(value) === "string";
	};
	const isNumber = function (value) {
		return type(value) === "number";
	};
	const isObject = function (value) {
		return type(value) === "object";
	};
	const isArray = function (value) {
		return type(value) === "array";
	};
	const isRegExp = function (value) {
		return type(value) === "regexp";
	};
	const isFunction = function (value) {
		return type(value) === "function";
	};
	const keys = function (obj) {
		const keys = [];
		for (const key in obj) {
			if (obj.hasOwnProperty(key)) {
				keys.push(key);
			}
		}
		return keys;
	};
	const values = function (obj) {
		const values = [];
		for (const key in obj) {
			if (obj.hasOwnProperty(key)) {
				values.push(obj[key]);
			}
		}
		return values;
	};
	/**
		 * Mock.heredoc(fn)
		 * 以直观、安全的方式书写（多行）HTML 模板。
		 * http://stackoverflow.com/questions/805107/creating-multiline-strings-in-javascript
		 */
	const heredoc = function (fn) {
		// 1. 移除起始的 function(){ /*!
		// 2. 移除末尾的 */ }
		// 3. 移除起始和末尾的空格
		return fn
			.toString()
			.replace(/^[^/]+\/\*!?/, "")
			.replace(/\*\/[^/]+$/, "")
			.replace(/^\s+/, "")
			.replace(/\s+$/, ""); // .trim()
	};
	const noop = function () { };
	const assert = function (condition, error) {
		if (!condition) {
			throw new Error(`[better-mock] ${  error}`);
		}
	};
	/**
		 * 创建一个自定义事件，兼容 IE
		 * @param type 一个字符串，表示事件名称。
		 * @param bubbles 一个布尔值，表示该事件能否冒泡。
		 * @param cancelable 一个布尔值，表示该事件是否可以取消。
		 * @param detail 一个任意类型，传递给事件的自定义数据。
		 */
	const createCustomEvent = function (type, bubbles, cancelable, detail) {
		if (bubbles === void 0) { bubbles = false; }
		if (cancelable === void 0) { cancelable = false; }
		try {
			return new CustomEvent(type, { bubbles, cancelable, detail });
		} catch {
			const event_1 = document.createEvent("CustomEvent");
			event_1.initCustomEvent(type, bubbles, cancelable, detail);
			return event_1;
		}
	};

	const Util = /* #__PURE__ */Object.freeze({
		__proto__: null,
		type,
		isDef,
		isString,
		isNumber,
		isObject,
		isArray,
		isRegExp,
		isFunction,
		keys,
		values,
		heredoc,
		noop,
		assert,
		createCustomEvent
	});

	/*! *****************************************************************************
		Copyright (c) Microsoft Corporation. All rights reserved.
		Licensed under the Apache License, Version 2.0 (the "License"); you may not use
		this file except in compliance with the License. You may obtain a copy of the
		License at http://www.apache.org/licenses/LICENSE-2.0
  
		THIS CODE IS PROVIDED ON AN *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
		KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED
		WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE,
		MERCHANTABLITY OR NON-INFRINGEMENT.
  
		See the Apache Version 2.0 License for specific language governing permissions
		and limitations under the License.
		***************************************************************************** */

	var __assign = function () {
		__assign = Object.assign || function __assign(t) {
			for (var s, i = 1, n = arguments.length; i < n; i++) {
				s = arguments[i];
				for (const p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
			}
			return t;
		};
		return Reflect.apply(__assign, this, arguments);
	};

	function __spreadArrays() {
		for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
		for (var r = new Array(s), k = 0, i = 0; i < il; i++) {
			for (let a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++) { r[k] = a[j]; }
		}
		return r;
	}

	const MAX_NATURE_NUMBER = 9_007_199_254_740_992;
	const MIN_NATURE_NUMBER = -9_007_199_254_740_992;
	// 返回一个随机的布尔值。
	const boolean = function (min, max, current) {
		if (min === void 0) { min = 1; }
		if (max === void 0) { max = 1; }
		if (isDef(current)) {
			if (isDef(min)) {
				min = !isNaN(min) ? Number.parseInt(min.toString(), 10) : 1;
			}
			if (isDef(max)) {
				max = !isNaN(max) ? Number.parseInt(max.toString(), 10) : 1;
			}
			return Math.random() > 1 / (min + max) * min ? !current : current;
		}
		return Math.random() >= 0.5;
	};
	const bool = boolean;
	// 返回一个随机的自然数（大于等于 0 的整数）。
	const natural = function (min, max) {
		if (min === void 0) { min = 0; }
		if (max === void 0) { max = MAX_NATURE_NUMBER; }
		min = Number.parseInt(min.toString(), 10);
		max = Number.parseInt(max.toString(), 10);
		return Math.round(Math.random() * (max - min)) + min;
	};
	// 返回一个随机的整数。
	const integer = function (min, max) {
		if (min === void 0) { min = MIN_NATURE_NUMBER; }
		if (max === void 0) { max = MAX_NATURE_NUMBER; }
		min = Number.parseInt(min.toString(), 10);
		max = Number.parseInt(max.toString(), 10);
		return Math.round(Math.random() * (max - min)) + min;
	};
	const int = integer;
	// 返回一个随机的浮点数。
	const float = function (min, max, dmin, dmax) {
		dmin = isDef(dmin) ? dmin : 0;
		dmin = Math.max(Math.min(dmin, 17), 0);
		dmax = isDef(dmax) ? dmax : 17;
		dmax = Math.max(Math.min(dmax, 17), 0);
		let ret = `${integer(min, max)  }.`;
		for (let i = 0, dcount = natural(dmin, dmax); i < dcount; i++) {
			// 最后一位不能为 0：如果最后一位为 0，会被 JS 引擎忽略掉。
			const num = i < dcount - 1 ? character("number") : character("123456789");
			ret += num;
		}
		return Number.parseFloat(ret);
	};
	// 返回一个随机字符。
	var character = function (pool) {
		if (pool === void 0) { pool = ""; }
		const lower = "abcdefghijklmnopqrstuvwxyz";
		const upper = lower.toUpperCase();
		const number = "0123456789";
		const symbol = "!@#$%^&*()[]";
		const pools = {
			lower,
			upper,
			number,
			symbol,
			alpha: lower + upper
		};
		pool = !pool ? lower + upper + number + symbol : pools[pool.toLowerCase()] || pool;
		return pool.charAt(natural(0, pool.length - 1));
	};
	const char = character;
	// 返回一个随机字符串。
	const string = function (pool, min, max) {
		let len;
		switch (arguments.length) {
			case 0: // ()
				len = natural(3, 7);
				break;
			case 1: // ( length )
				len = pool;
				pool = undefined;
				break;
			case 2:
				// ( pool, length )
				if (typeof arguments[0] === "string") {
					len = min;
				} else {
					// ( min, max )
					len = natural(pool, min);
					pool = undefined;
				}
				break;
			case 3:
				len = natural(min, max);
				break;
		}
		let text = "";
		for (let i = 0; i < len; i++) {
			text += character(pool);
		}
		return text;
	};
	const str = string;
	// 返回一个整型数组。
	const range = function (start, stop, step) {
		if (step === void 0) { step = 1; }
		// range( stop )
		if (arguments.length <= 1) {
			stop = start || 0;
			start = 0;
		}
		start = +start;
		stop = +stop;
		step = +step;
		let idx = 0;
		const len = Math.max(Math.ceil((stop - start) / step), 0);
		const range = new Array(len);
		while (idx < len) {
			range[idx++] = start;
			start += step;
		}
		return range;
	};

	const basic = /* #__PURE__ */Object.freeze({
		__proto__: null,
		boolean,
		bool,
		natural,
		integer,
		int,
		float,
		character,
		char,
		string,
		str,
		range
	});

	// Date
	const _padZero = function (value) {
		return value < 10 ? `0${  value}` : value.toString();
	};
	const patternLetters = {
		yyyy: "getFullYear",
		yy (date) {
			return date.getFullYear().toString().slice(2);
		},
		y: "yy",
		MM (date) {
			return _padZero(date.getMonth() + 1);
		},
		M (date) {
			return (date.getMonth() + 1).toString();
		},
		dd (date) {
			return _padZero(date.getDate());
		},
		d: "getDate",
		HH (date) {
			return _padZero(date.getHours());
		},
		H: "getHours",
		hh (date) {
			return _padZero(date.getHours() % 12);
		},
		h (date) {
			return (date.getHours() % 12).toString();
		},
		mm (date) {
			return _padZero(date.getMinutes());
		},
		m: "getMinutes",
		ss (date) {
			return _padZero(date.getSeconds());
		},
		s: "getSeconds",
		SS (date) {
			const ms = date.getMilliseconds();
			return ms < 10 && `00${  ms}` || ms < 100 && `0${  ms}` || ms.toString();
		},
		S: "getMilliseconds",
		A (date) {
			return date.getHours() < 12 ? "AM" : "PM";
		},
		a (date) {
			return date.getHours() < 12 ? "am" : "pm";
		},
		T: "getTime"
	};
	const _createFormatRE = function () {
		const re = keys(patternLetters);
		return `(${  re.join("|")  })`;
	};
	const _formatDate = function (date, format) {
		const formatRE = new RegExp(_createFormatRE(), "g");
		return format.replace(formatRE, function createNewSubString($0, flag) {
			return typeof patternLetters[flag] === "function"
				? patternLetters[flag](date)
				: patternLetters[flag] in patternLetters
					? createNewSubString($0, patternLetters[flag])
					: date[patternLetters[flag]]();
		});
	};
	// 生成一个随机的 Date 对象。
	const _randomDate = function (min, max) {
		if (min === void 0) { min = new Date(0); }
		if (max === void 0) { max = new Date(); }
		const randomTS = Math.random() * (max.getTime() - min.getTime());
		return new Date(randomTS);
	};
	// 返回一个随机的日期字符串。
	const date = function (format) {
		if (format === void 0) { format = "yyyy-MM-dd"; }
		return _formatDate(_randomDate(), format);
	};
	// 返回一个随机的时间字符串。
	const time = function (format) {
		if (format === void 0) { format = "HH:mm:ss"; }
		return _formatDate(_randomDate(), format);
	};
	// 返回一个随机的日期和时间字符串。
	const datetime = function (format) {
		if (format === void 0) { format = "yyyy-MM-dd HH:mm:ss"; }
		return _formatDate(_randomDate(), format);
	};
	// 返回一个随机的时间戳
	const timestamp = function () {
		return Number(_formatDate(_randomDate(), "T"));
	};
	// 返回当前的日期和时间字符串。
	const now = function (unit, format) {
		// now(unit) now(format)
		if (arguments.length === 1 && // now(format)
			!/year|month|day|hour|minute|second|week/.test(unit)) {
				format = unit;
				unit = "";
			}
		unit = (unit || "").toLowerCase();
		format = format || "yyyy-MM-dd HH:mm:ss";
		const date = new Date();
		// 参考自 http://momentjs.cn/docs/#/manipulating/start-of/
		switch (unit) {
			case "year":
				date.setMonth(0);
				break;
			case "month":
				date.setDate(1);
				break;
			case "week":
				date.setDate(date.getDate() - date.getDay());
				break;
			case "day":
				date.setHours(0);
				break;
			case "hour":
				date.setMinutes(0);
				break;
			case "minute":
				date.setSeconds(0);
				break;
			case "second":
				date.setMilliseconds(0);
		}
		return _formatDate(date, format);
	};

	const date$1 = /* #__PURE__ */Object.freeze({
		__proto__: null,
		date,
		time,
		datetime,
		timestamp,
		now
	});

	// 把字符串的第一个字母转换为大写。
	const capitalize = function (word) {
		word += "";
		return word.charAt(0).toUpperCase() + word.slice(1);
	};
	// 把字符串转换为大写。
	const upper = function (str) {
		return (`${str  }`).toUpperCase();
	};
	// 把字符串转换为小写。
	const lower = function (str) {
		return (`${str  }`).toLowerCase();
	};
	// 从数组中随机选择一个
	const pickOne = function (arr) {
		return arr[natural(0, arr.length - 1)];
	};
	function pick(arr, min, max) {
		if (min === void 0) { min = 1; }
		// pick( item1, item2 ... )
		if (!isArray(arr)) {
			return pickOne([...arguments]);
		}
		// pick( [ item1, item2 ... ], count )
		if (!isDef(max)) {
			max = min;
		}
		if (min === 1 && max === 1) {
			return pickOne(arr);
		}
		// pick( [ item1, item2 ... ], min, max )
		return shuffle(arr, min, max);
	}
	// 从map中随机选择一个
	const pickMap = function (map) {
		return pick(values(map));
	};
	// 打乱数组中元素的顺序，并按照 min - max 返回。
	var shuffle = function (arr, min, max) {
		if (!Array.isArray(arr)) {
			return [];
		}
		const copy = [...arr];
		const {length} = arr;
		for (let i = 0; i < length; i++) {
			const swapIndex = natural(0, length - 1);
			const swapValue = copy[swapIndex];
			copy[swapIndex] = copy[i];
			copy[i] = swapValue;
		}
		if (min && max) {
			return copy.slice(0, natural(min, max));
		}
		if (min) {
			return copy.slice(0, min);
		}
		return copy;
	};

	const helper = /* #__PURE__ */Object.freeze({
		__proto__: null,
		capitalize,
		upper,
		lower,
		pickOne,
		pick,
		pickMap,
		shuffle
	});

	// image
	// 常见图片尺寸
	const imageSize = [
		"150x100", "300x200", "400x300", "600x450", "800x600",
		"100x150", "200x300", "300x400", "450x600", "600x800",
		"100x100", "200x200", "300x300", "450x450", "600x600"
	];
	/**
		 * 随机生成一个图片，使用：http://iph.href.lu，例如：
		 * https://iph.href.lu/600x400?fg=cc00cc&bg=470047&text=hello
		 * @param size 图片大小
		 * @param background 背景色
		 * @param foreground 文字颜色
		 * @param format 图片格式
		 * @param text 文字
		 */
	const image = function (size, background, foreground, format, text) {
		if (size === void 0) { size = ""; }
		if (background === void 0) { background = ""; }
		if (foreground === void 0) { foreground = ""; }
		if (format === void 0) { format = ""; }
		if (text === void 0) { text = ""; }
		// Random.image( size, background, foreground, text )
		if (arguments.length === 4) {
			text = format;
			format = "";
		}
		// Random.image( size, background, text )
		if (arguments.length === 3) {
			text = foreground;
			foreground = "";
		}
		// Random.image( size, text )
		if (arguments.length === 2) {
			text = background;
			background = "";
		}
		// Random.image()
		size = size || pick(imageSize);
		if (background && ~background.indexOf("#")) {
			background = background.slice(1);
		}
		if (foreground && ~foreground.indexOf("#")) {
			foreground = foreground.slice(1);
		}
		return format
			? (`https://dummyimage.com/${ 
				size 
				}${background ? `/${  background}` : "" 
				}${foreground ? `/${  foreground}` : "" 
				}${format ? `.${  format}` : "" 
				}${text ? `?text=${  encodeURIComponent(text)}` : ""}`)
			: `https://iph.href.lu/${  size  }?bg=${  background  }&fg=${  foreground  }&text=${  text}`;
	};
	const img = image;
	/**
		 * 生成一个随机的base64图片
		 * @param size 图片宽高
		 * @param text 图片上的文字
		 */
	const dataImage = function (size, text) {
		size = size || pick(imageSize);
		text = text || size;
		const background = pick([
			"#171515", "#e47911", "#183693", "#720e9e", "#c4302b", "#dd4814",
			"#00acee", "#0071c5", "#3d9ae8", "#ec6231", "#003580", "#e51937"
		]);
		const sizes = size.split("x");
		const width = Number.parseInt(sizes[0], 10);
		const height = Number.parseInt(sizes[1], 10);
		assert(isNumber(width) && isNumber(height), "Invalid size, expected INTxINT, e.g. 300x400");
		{
			return createBrowserDataImage(width, height, background, text);
		}
	};
	// browser 端生成 base64 图片
	function createBrowserDataImage(width, height, background, text) {
		const canvas = document.createElement("canvas");
		const ctx = canvas && canvas.getContext && canvas.getContext("2d");
		if (!canvas || !ctx) {
			return "";
		}
		canvas.width = width;
		canvas.height = height;
		ctx.textAlign = "center";
		ctx.textBaseline = "middle";
		ctx.fillStyle = background;
		ctx.fillRect(0, 0, width, height);
		ctx.fillStyle = "#FFFFFF";
		ctx.font = "bold 14px sans-serif";
		ctx.fillText(text, width / 2, height / 2, width);
		return canvas.toDataURL("image/png");
	}

	const image$1 = /* #__PURE__ */Object.freeze({
		__proto__: null,
		image,
		img,
		dataImage
	});

	// 颜色空间RGB与HSV(HSL)的转换
	const hsv2rgb = function hsv2rgb(hsv) {
		const h = hsv[0] / 60;
		const s = hsv[1] / 100;
		let v = hsv[2] / 100;
		const hi = Math.floor(h) % 6;
		const f = h - Math.floor(h);
		const p = 255 * v * (1 - s);
		const q = 255 * v * (1 - (s * f));
		const t = 255 * v * (1 - (s * (1 - f)));
		v = 255 * v;
		switch (hi) {
			case 0:
				return [v, t, p];
			case 1:
				return [q, v, p];
			case 2:
				return [p, v, t];
			case 3:
				return [p, q, v];
			case 4:
				return [t, p, v];
			case 5:
				return [v, p, q];
		}
	};
	const hsv2hsl = function hsv2hsl(hsv) {
		const h = hsv[0]; const s = hsv[1] / 100; const v = hsv[2] / 100; let sl; let l;
		l = (2 - s) * v;
		sl = s * v;
		sl /= (l <= 1) ? l : 2 - l;
		l /= 2;
		return [h, sl * 100, l * 100];
	};
	// http://www.140byt.es/keywords/color
	const rgb2hex = function (a, // red, as a number from 0 to 255
		b, // green, as a number from 0 to 255
		c // blue, as a number from 0 to 255
	) {
		return `#${  ((256 + a << 8 | b) << 8 | c).toString(16).slice(1)}`;
	};

	// 颜色相关
	const colorMap = {
		navy: "#001F3F",
		blue: "#0074D9",
		aqua: "#7FDBFF",
		teal: "#39CCCC",
		olive: "#3D9970",
		green: "#2ECC40",
		lime: "#01FF70",
		yellow: "#FFDC00",
		orange: "#FF851B",
		red: "#FF4136",
		maroon: "#85144B",
		fuchsia: "#F012BE",
		purple: "#B10DC9",
		silver: "#DDDDDD",
		gray: "#AAAAAA",
		black: "#111111",
		white: "#FFFFFF"
	};
	// 随机生成一个有吸引力的颜色，格式为 '#RRGGBB'。
	const color = function (name) {
		if (name === void 0) { name = ""; }
		if (name && colorMap[name]) {
			return colorMap[name];
		}
		return hex();
	};
	// #DAC0DE
	var hex = function () {
		const hsv = _goldenRatioColor();
		const rgb = hsv2rgb(hsv);
		return rgb2hex(rgb[0], rgb[1], rgb[2]);
	};
	// rgb(128,255,255)
	const rgb = function () {
		const hsv = _goldenRatioColor();
		const rgb = hsv2rgb(hsv);
		return `rgb(${ 
			Number.parseInt(rgb[0].toString(), 10)  }, ${ 
			Number.parseInt(rgb[1].toString(), 10)  }, ${ 
			Number.parseInt(rgb[2].toString(), 10)  })`;
	};
	// rgba(128,255,255,0.3)
	const rgba = function () {
		const hsv = _goldenRatioColor();
		const rgb = hsv2rgb(hsv);
		return `rgba(${ 
			Number.parseInt(rgb[0].toString(), 10)  }, ${ 
			Number.parseInt(rgb[1].toString(), 10)  }, ${ 
			Number.parseInt(rgb[2].toString(), 10)  }, ${ 
			Math.random().toFixed(2)  })`;
	};
	// hsl(300,80%,90%)
	const hsl = function () {
		const hsv = _goldenRatioColor();
		const hsl = hsv2hsl(hsv);
		return `hsl(${ 
			Number.parseInt(hsl[0], 10)  }, ${ 
			Number.parseInt(hsl[1], 10)  }, ${ 
			Number.parseInt(hsl[2], 10)  })`;
	};
	// http://martin.ankerl.com/2009/12/09/how-to-create-random-colors-programmatically/
	// https://github.com/devongovett/color-generator/blob/master/index.js
	// 随机生成一个有吸引力的颜色。
	let _hue = 0;
	var _goldenRatioColor = function (saturation, value) {
		const _goldenRatio = 0.618_033_988_749_895;
		_hue = _hue || Math.random();
		_hue += _goldenRatio;
		_hue %= 1;
		if (typeof saturation !== "number") { saturation = 0.5; }
		if (typeof value !== "number") { value = 0.95; }
		return [
			_hue * 360,
			saturation * 100,
			value * 100
		];
	};

	const color$1 = /* #__PURE__ */Object.freeze({
		__proto__: null,
		color,
		hex,
		rgb,
		rgba,
		hsl
	});

	/** Used to compose unicode character classes. */
	const rsAstralRange = "\\ud800-\\udfff";
	const rsComboMarksRange = "\\u0300-\\u036f";
	const reComboHalfMarksRange = "\\ufe20-\\ufe2f";
	const rsComboSymbolsRange = "\\u20d0-\\u20ff";
	const rsComboMarksExtendedRange = "\\u1ab0-\\u1aff";
	const rsComboMarksSupplementRange = "\\u1dc0-\\u1dff";
	const rsComboRange = rsComboMarksRange + reComboHalfMarksRange + rsComboSymbolsRange + rsComboMarksExtendedRange + rsComboMarksSupplementRange;
	const rsVarRange = "\\ufe0e\\ufe0f";
	/** Used to compose unicode capture groups. */
	const rsZWJ = "\\u200d";
	const rsAstral = `[${  rsAstralRange  }]`;
	const rsCombo = `[${  rsComboRange  }]`;
	const rsFitz = "\\ud83c[\\udffb-\\udfff]";
	const rsModifier = `(?:${  rsCombo  }|${  rsFitz  })`;
	const rsNonAstral = `[^${  rsAstralRange  }]`;
	const rsRegional = "(?:\\ud83c[\\udde6-\\uddff]){2}";
	const rsSurrPair = "[\\ud800-\\udbff][\\udc00-\\udfff]";
	/** Used to compose unicode regexes. */
	const reOptMod = `${rsModifier  }?`;
	const rsOptVar = `[${  rsVarRange  }]?`;
	const rsOptJoin = `(?:${  rsZWJ  }(?:${  [rsNonAstral, rsRegional, rsSurrPair].join("|")  })${  rsOptVar + reOptMod  })*`;
	const rsSeq = rsOptVar + reOptMod + rsOptJoin;
	const rsNonAstralCombo = `${  rsNonAstral  }${rsCombo  }?`;
	const rsSymbol = `(?:${  [rsNonAstralCombo, rsCombo, rsRegional, rsSurrPair, rsAstral].join("|")  })`;
	/** Used to match [string symbols](https://mathiasbynens.be/notes/javascript-unicode). */
	const reUnicode = new RegExp(`${rsFitz  }(?=${  rsFitz  })|${  rsSymbol + rsSeq}`, "g");
	/** Used to detect strings with [zero-width joiners or code points from the astral planes](http://eev.ee/blog/2015/09/12/dark-corners-of-unicode/). */
	const reHasUnicode = new RegExp(`[${  rsZWJ + rsAstralRange + rsComboRange + rsVarRange  }]`);
	/**
		 * Checks if `string` contains Unicode symbols.
		 *
		 * @private
		 * @param {string} string The string to inspect.
		 * @returns {boolean} Returns `true` if a symbol is found, else `false`.
		 */
	function hasUnicode(string) {
		return reHasUnicode.test(string);
	}
	/**
		 * Converts an ASCII `string` to an array.
		 *
		 * @private
		 * @param {string} string The string to convert.
		 * @returns {Array} Returns the converted array.
		 */
	function asciiToArray(string) {
		return string.split("");
	}
	/**
		* Converts a Unicode `string` to an array.
		*
		* @private
		* @param {string} string The string to convert.
		* @returns {Array} Returns the converted array.
		*/
	function unicodeToArray(string) {
		return string.match(reUnicode) || [];
	}
	/**
		 * Converts `string` to an array.
		 *
		 * @private
		 * @param {string} string The string to convert.
		 * @returns {Array} Returns the converted array.
		 */
	/* istanbul ignore next */
	function stringToArray(string) {
		return hasUnicode(string)
			? unicodeToArray(string)
			: asciiToArray(string);
	}

	const _range = function (defaultMin, defaultMax, min, max) {
		return !isDef(min)
			? natural(defaultMin, defaultMax)
			: !isDef(max)
				? min
				: natural(Number.parseInt(min.toString(), 10), Number.parseInt(max.toString(), 10)); // ( min, max )
	};
	// 随机生成一段文本。
	const paragraph = function (min, max) {
		const len = _range(3, 7, min, max);
		const result = [];
		for (let i = 0; i < len; i++) {
			result.push(sentence());
		}
		return result.join(" ");
	};
	const cparagraph = function (min, max) {
		const len = _range(3, 7, min, max);
		const result = [];
		for (let i = 0; i < len; i++) {
			result.push(csentence());
		}
		return result.join("");
	};
	// 随机生成一个句子，第一个单词的首字母大写。
	var sentence = function (min, max) {
		const len = _range(12, 18, min, max);
		const result = [];
		for (let i = 0; i < len; i++) {
			result.push(word());
		}
		return `${capitalize(result.join(" "))  }.`;
	};
	// 随机生成一个中文句子。
	var csentence = function (min, max) {
		const len = _range(12, 18, min, max);
		const result = [];
		for (let i = 0; i < len; i++) {
			result.push(cword());
		}
		return `${result.join("")  }。`;
	};
	// 随机生成一个单词。
	var word = function (min, max) {
		const len = _range(3, 10, min, max);
		let result = "";
		for (let i = 0; i < len; i++) {
			result += character("lower");
		}
		return result;
	};
	// 随机生成一个或多个汉字。
	var cword = function (pool, min, max) {
		if (pool === void 0) { pool = ""; }
		// 最常用的 500 个汉字 http://baike.baidu.com/view/568436.htm
		const cnWords = "的一是在不了有和人这中大为上个国我以要他时来用们生到作地于出就分对成会可主发年动同工也能下过子说产种面而方后多定行学法所民得经十三之进着等部度家电力里如水化高自二理起小物现实加量都两体制机当使点从业本去把性好应开它合还因由其些然前外天政四日那社义事平形相全表间样与关各重新线内数正心反你明看原又么利比或但质气第向道命此变条只没结解问意建月公无系军很情者最立代想已通并提直题党程展五果料象员革位入常文总次品式活设及管特件长求老头基资边流路级少图山统接知较将组见计别她手角期根论运农指几九区强放决西被干做必战先回则任取据处队南给色光门即保治北造百规热领七海口东导器压志世金增争济阶油思术极交受联什认六共权收证改清己美再采转更单风切打白教速花带安场身车例真务具万每目至达走积示议声报斗完类八离华名确才科张信马节话米整空元况今集温传土许步群广石记需段研界拉林律叫且究观越织装影算低持音众书布复容儿须际商非验连断深难近矿千周委素技备半办青省列习响约支般史感劳便团往酸历市克何除消构府称太准精值号率族维划选标写存候毛亲快效斯院查江型眼王按格养易置派层片始却专状育厂京识适属圆包火住调满县局照参红细引听该铁价严龙飞";
		let len;
		switch (arguments.length) {
			case 0: // ()
				pool = cnWords;
				len = 1;
				break;
			case 1: // ( pool )
				if (typeof arguments[0] === "string") {
					len = 1;
				} else {
					// ( length )
					len = pool;
					pool = cnWords;
				}
				break;
			case 2:
				// ( pool, length )
				if (typeof arguments[0] === "string") {
					len = min;
				} else {
					// ( min, max )
					len = natural(Number.parseInt(pool, 10), min);
					pool = cnWords;
				}
				break;
			case 3:
				len = natural(min, max);
				break;
		}
		let result = "";
		for (let i = 0; i < len; i++) {
			result += pool.charAt(natural(0, pool.length - 1));
		}
		return result;
	};
	// 随机生成一个或多个 emoji 符号
	const emoji = function (pool, min, max) {
		if (!["string", "number", "undefined"].includes(typeof pool)) {
			return "";
		}
		// 常用的 338 个emoji符号 http://www.fhdq.net/emoji.html
		const emojis = "😀😁😂😃😄😅😆😉😊😋😎😍😘😗😙😚☺😇😐😑😶😏😣😥😮😯😪😫😴😌😛😜😝😒😓😔😕😲😷😖😞😟😤😢😭😦😧😨😬😰😱😳😵😡😠😈👿👹👺💀👻👽👦👧👨👩👴👵👶👱👮👲👳👷👸💂🎅👰👼💆💇🙍🙎🙅🙆💁🙋🙇🙌🙏👤👥🚶🏃👯💃👫👬👭💏💑👪💪👈👉☝👆👇✌✋👌👍👎✊👊👋👏👐✍👣👀👂👃👅👄💋👓👔👕👖👗👘👙👚👛👜👝🎒💼👞👟👠👡👢👑👒🎩🎓💄💅💍🌂🙈🙉🙊🐵🐒🐶🐕🐩🐺🐱😺😸😹😻😼😽🙀😿😾🐈🐯🐅🐆🐴🐎🐮🐂🐃🐄🐷🐖🐗🐽🐏🐑🐐🐪🐫🐘🐭🐁🐀🐹🐰🐇🐻🐨🐼🐾🐔🐓🐣🐤🐥🐦🐧🐸🐊🐢🐍🐲🐉🐳🐋🐬🐟🐠🐡🐙🐚🐌🐛🐜🐝🐞💐🌸💮🌹🌺🌻🌼🌷🌱🌲🌳🌴🌵🌾🌿🍀🍁🍂🍃🌍🌎🌏🌐🌑🌒🌓🌔🌕🌖🌗🌘🌙🌚🌛🌜☀🌝🌞⭐🌟🌠☁⛅☔⚡❄🔥💧🌊💩🍇🍈🍉🍊🍋🍌🍍🍎🍏🍐🍑🍒🍓🍅🍆🌽🍄🌰🍞🍖🍗🍔🍟🍕🍳🍲🍱🍘🍙🍚🍛🍜🍝🍠🍢🍣🍤🍥🍡🍦🍧🍨🍩🍪🎂🍰🍫🍬🍭🍮🍯🍼☕🍵🍶🍷🍸🍹🍺🍻🍴";
		let array = stringToArray(emojis);
		if (typeof pool === "string") { // emoji("😀😁😂"), emoji("😀😂", 2), emoji("😀😂", 2, 3)
			array = stringToArray(pool);
		} else if (typeof pool === "number") { // emoji(2), emoji(2, 3)
			max = min;
			min = pool;
		}
		if (min === undefined || min < 2) { // emoji("😀😁😂"), emoji()
			return pick(array); // pick(['1', '2']) => "2", pick(['1', '2'], 1) => "2"
		}
		return pick(array, min, max).join("");
	};
	// 随机生成一句标题，其中每个单词的首字母大写。
	const title = function (min, max) {
		const len = _range(3, 7, min, max);
		const result = [];
		for (let i = 0; i < len; i++) {
			result.push(capitalize(word()));
		}
		return result.join(" ");
	};
	// 随机生成一句中文标题。
	const ctitle = function (min, max) {
		const len = _range(3, 7, min, max);
		const result = [];
		for (let i = 0; i < len; i++) {
			result.push(cword());
		}
		return result.join("");
	};

	const text = /* #__PURE__ */Object.freeze({
		__proto__: null,
		paragraph,
		cparagraph,
		sentence,
		csentence,
		word,
		cword,
		emoji,
		title,
		ctitle
	});

	// 随机生成一个常见的英文名。
	const first = function () {
		const male = [
			"James", "John", "Robert", "Michael", "William",
			"David", "Richard", "Charles", "Joseph", "Thomas",
			"Christopher", "Daniel", "Paul", "Mark", "Donald",
			"George", "Kenneth", "Steven", "Edward", "Brian",
			"Ronald", "Anthony", "Kevin", "Jason", "Matthew",
			"Gary", "Timothy", "Jose", "Larry", "Jeffrey",
			"Frank", "Scott", "Eric"
		];
		const female = [
			"Mary", "Patricia", "Linda", "Barbara", "Elizabeth",
			"Jennifer", "Maria", "Susan", "Margaret", "Dorothy",
			"Lisa", "Nancy", "Karen", "Betty", "Helen",
			"Sandra", "Donna", "Carol", "Ruth", "Sharon",
			"Michelle", "Laura", "Sarah", "Kimberly", "Deborah",
			"Jessica", "Shirley", "Cynthia", "Angela", "Melissa",
			"Brenda", "Amy", "Anna"
		];
		return pick(__spreadArrays(male, female));
	};
	// 随机生成一个常见的英文姓。
	const last = function () {
		const names = [
			"Smith", "Johnson", "Williams", "Brown", "Jones",
			"Miller", "Davis", "Garcia", "Rodriguez", "Wilson",
			"Martinez", "Anderson", "Taylor", "Thomas", "Hernandez",
			"Moore", "Martin", "Jackson", "Thompson", "White",
			"Lopez", "Lee", "Gonzalez", "Harris", "Clark",
			"Lewis", "Robinson", "Walker", "Perez", "Hall",
			"Young", "Allen"
		];
		return pick(names);
	};
	// 随机生成一个常见的英文姓名。
	const name = function (middle) {
		if (middle === void 0) { middle = false; }
		return `${first()  } ${  middle ? `${first()  } ` : ""  }${last()}`;
	};
	// 随机生成一个常见的中文姓。
	// [世界常用姓氏排行](http://baike.baidu.com/view/1719115.htm)
	// [玄派网 - 网络小说创作辅助平台](http://xuanpai.sinaapp.com/)
	const cfirst = function () {
		const names = [
			"王", "李", "张", "刘", "陈", "杨", "赵", "黄",
			"周", "吴", "徐", "孙", "胡", "朱", "高", "林",
			"何", "郭", "马", "罗", "梁", "宋", "郑", "谢",
			"韩", "唐", "冯", "于", "董", "萧", "程", "曹",
			"袁", "邓", "许", "傅", "沈", "曾", "彭", "吕",
			"苏", "卢", "蒋", "蔡", "贾", "丁", "魏", "薛",
			"叶", "阎", "余", "潘", "杜", "戴", "夏", "锺",
			"汪", "田", "任", "姜", "范", "方", "石", "姚",
			"谭", "廖", "邹", "熊", "金", "陆", "郝", "孔",
			"白", "崔", "康", "毛", "邱", "秦", "江", "史",
			"顾", "侯", "邵", "孟", "龙", "万", "段", "雷",
			"钱", "汤", "尹", "黎", "易", "常", "武", "乔",
			"贺", "赖", "龚", "文"
		];
		return pick(names);
	};
	// 随机生成一个常见的中文名。
	// [中国最常见名字前50名_三九算命网](http://www.name999.net/xingming/xingshi/20131004/48.html)
	const clast = function () {
		const names = [
			"伟", "芳", "娜", "秀英", "敏", "静", "丽", "强",
			"磊", "军", "洋", "勇", "艳", "杰", "娟", "涛",
			"明", "超", "秀兰", "霞", "平", "刚", "桂英"
		];
		return pick(names);
	};
	// 随机生成一个常见的中文姓名。
	const cname = function () {
		return cfirst() + clast();
	};

	const name$1 = /* #__PURE__ */Object.freeze({
		__proto__: null,
		first,
		last,
		name,
		cfirst,
		clast,
		cname
	});

	// 随机生成一个 URL。
	const url = function (_protocol, host) {
		if (_protocol === void 0) { _protocol = protocol(); }
		if (host === void 0) { host = domain(); }
		return `${_protocol  }://${  host  }/${  word()}`;
	};
	// 随机生成一个 URL 协议。
	var protocol = function () {
		// 协议簇
		const protocols = [
			"http", "ftp", "gopher", "mailto", "mid", "cid", "news", "nntp",
			"prospero", "telnet", "rlogin", "tn3270", "wais"
		];
		return pick(protocols);
	};
	// 随机生成一个域名。
	var domain = function (_tld) {
		if (_tld === void 0) { _tld = tld(); }
		return `${word()  }.${  _tld}`;
	};
	// 随机生成一个顶级域名。
	// [域名后缀大全](http://www.163ns.com/zixun/post/4417.html)
	var tld = function () {
		const tlds = (
			// 域名后缀
			"com net org edu gov int mil cn " +
			// 国内域名
			"com.cn net.cn gov.cn org.cn " +
			// 中文国内域名
			"中国 中国互联.公司 中国互联.网络 " +
			// 新国际域名
			"tel biz cc tv info name hk mobi asia cd travel pro museum coop aero " +
			// 世界各国域名后缀
			"ad ae af ag ai al am an ao aq ar as at au aw az ba bb bd be bf bg bh bi bj bm bn bo br bs bt bv bw by bz ca cc cf cg ch ci ck cl cm cn co cq cr cu cv cx cy cz de dj dk dm do dz ec ee eg eh es et ev fi fj fk fm fo fr ga gb gd ge gf gh gi gl gm gn gp gr gt gu gw gy hk hm hn hr ht hu id ie il in io iq ir is it jm jo jp ke kg kh ki km kn kp kr kw ky kz la lb lc li lk lr ls lt lu lv ly ma mc md mg mh ml mm mn mo mp mq mr ms mt mv mw mx my mz na nc ne nf ng ni nl no np nr nt nu nz om qa pa pe pf pg ph pk pl pm pn pr pt pw py re ro ru rw sa sb sc sd se sg sh si sj sk sl sm sn so sr st su sy sz tc td tf tg th tj tk tm tn to tp tr tt tv tw tz ua ug uk us uy va vc ve vg vn vu wf ws ye yu za zm zr zw").split(" ");
		return pick(tlds);
	};
	// 随机生成一个邮件地址。
	const email = function (_domain) {
		if (_domain === void 0) { _domain = domain(); }
		return `${character("lower")  }.${  word()  }@${  _domain}`;
	};
	// 随机生成一个 IP 地址。
	const ip = function () {
		return `${natural(0, 255)  }.${ 
			natural(0, 255)  }.${ 
			natural(0, 255)  }.${ 
			natural(0, 255)}`;
	};

	const web = /* #__PURE__ */Object.freeze({
		__proto__: null,
		url,
		protocol,
		domain,
		tld,
		email,
		ip
	});

	const location$1 = {
		110_000: {
			code: "110000",
			name: "北京市",
			cities: {
				110_000: {
					code: "110000",
					name: "北京市",
					districts: {
						110_101: "东城区",
						110_102: "西城区",
						110_105: "朝阳区",
						110_106: "丰台区",
						110_107: "石景山区",
						110_108: "海淀区",
						110_109: "门头沟区",
						110_111: "房山区",
						110_112: "通州区",
						110_113: "顺义区",
						110_114: "昌平区",
						110_115: "大兴区",
						110_116: "怀柔区",
						110_117: "平谷区",
						110_118: "密云区",
						110_119: "延庆区"
					}
				}
			}
		},
		120_000: {
			code: "120000",
			name: "天津市",
			cities: {
				120_000: {
					code: "120000",
					name: "天津市",
					districts: {
						120_101: "和平区",
						120_102: "河东区",
						120_103: "河西区",
						120_104: "南开区",
						120_105: "河北区",
						120_106: "红桥区",
						120_110: "东丽区",
						120_111: "西青区",
						120_112: "津南区",
						120_113: "北辰区",
						120_114: "武清区",
						120_115: "宝坻区",
						120_116: "滨海新区",
						120_117: "宁河区",
						120_118: "静海区",
						120_119: "蓟州区"
					}
				}
			}
		},
		130_000: {
			code: "130000",
			name: "河北省",
			cities: {
				130_100: {
					code: "130100",
					name: "石家庄市",
					districts: {
						130_102: "长安区",
						130_104: "桥西区",
						130_105: "新华区",
						130_107: "井陉矿区",
						130_108: "裕华区",
						130_109: "藁城区",
						130_110: "鹿泉区",
						130_111: "栾城区",
						130_121: "井陉县",
						130_123: "正定县",
						130_125: "行唐县",
						130_126: "灵寿县",
						130_127: "高邑县",
						130_128: "深泽县",
						130_129: "赞皇县",
						130_130: "无极县",
						130_131: "平山县",
						130_132: "元氏县",
						130_133: "赵县",
						130_181: "辛集市",
						130_183: "晋州市",
						130_184: "新乐市"
					}
				},
				130_200: {
					code: "130200",
					name: "唐山市",
					districts: {
						130_202: "路南区",
						130_203: "路北区",
						130_204: "古冶区",
						130_205: "开平区",
						130_207: "丰南区",
						130_208: "丰润区",
						130_209: "曹妃甸区",
						130_224: "滦南县",
						130_225: "乐亭县",
						130_227: "迁西县",
						130_229: "玉田县",
						130_281: "遵化市",
						130_283: "迁安市",
						130_284: "滦州市"
					}
				},
				130_300: {
					code: "130300",
					name: "秦皇岛市",
					districts: {
						130_302: "海港区",
						130_303: "山海关区",
						130_304: "北戴河区",
						130_306: "抚宁区",
						130_321: "青龙满族自治县",
						130_322: "昌黎县",
						130_324: "卢龙县"
					}
				},
				130_400: {
					code: "130400",
					name: "邯郸市",
					districts: {
						130_402: "邯山区",
						130_403: "丛台区",
						130_404: "复兴区",
						130_406: "峰峰矿区",
						130_407: "肥乡区",
						130_408: "永年区",
						130_423: "临漳县",
						130_424: "成安县",
						130_425: "大名县",
						130_426: "涉县",
						130_427: "磁县",
						130_430: "邱县",
						130_431: "鸡泽县",
						130_432: "广平县",
						130_433: "馆陶县",
						130_434: "魏县",
						130_435: "曲周县",
						130_481: "武安市"
					}
				},
				130_500: {
					code: "130500",
					name: "邢台市",
					districts: {
						130_502: "桥东区",
						130_503: "桥西区",
						130_521: "邢台县",
						130_522: "临城县",
						130_523: "内丘县",
						130_524: "柏乡县",
						130_525: "隆尧县",
						130_526: "任县",
						130_527: "南和县",
						130_528: "宁晋县",
						130_529: "巨鹿县",
						130_530: "新河县",
						130_531: "广宗县",
						130_532: "平乡县",
						130_533: "威县",
						130_534: "清河县",
						130_535: "临西县",
						130_581: "南宫市",
						130_582: "沙河市"
					}
				},
				130_600: {
					code: "130600",
					name: "保定市",
					districts: {
						130_602: "竞秀区",
						130_606: "莲池区",
						130_607: "满城区",
						130_608: "清苑区",
						130_609: "徐水区",
						130_623: "涞水县",
						130_624: "阜平县",
						130_626: "定兴县",
						130_627: "唐县",
						130_628: "高阳县",
						130_629: "容城县",
						130_630: "涞源县",
						130_631: "望都县",
						130_632: "安新县",
						130_633: "易县",
						130_634: "曲阳县",
						130_635: "蠡县",
						130_636: "顺平县",
						130_637: "博野县",
						130_638: "雄县",
						130_681: "涿州市",
						130_682: "定州市",
						130_683: "安国市",
						130_684: "高碑店市"
					}
				},
				130_700: {
					code: "130700",
					name: "张家口市",
					districts: {
						130_702: "桥东区",
						130_703: "桥西区",
						130_705: "宣化区",
						130_706: "下花园区",
						130_708: "万全区",
						130_709: "崇礼区",
						130_722: "张北县",
						130_723: "康保县",
						130_724: "沽源县",
						130_725: "尚义县",
						130_726: "蔚县",
						130_727: "阳原县",
						130_728: "怀安县",
						130_730: "怀来县",
						130_731: "涿鹿县",
						130_732: "赤城县"
					}
				},
				130_800: {
					code: "130800",
					name: "承德市",
					districts: {
						130_802: "双桥区",
						130_803: "双滦区",
						130_804: "鹰手营子矿区",
						130_821: "承德县",
						130_822: "兴隆县",
						130_824: "滦平县",
						130_825: "隆化县",
						130_826: "丰宁满族自治县",
						130_827: "宽城满族自治县",
						130_828: "围场满族蒙古族自治县",
						130_881: "平泉市"
					}
				},
				130_900: {
					code: "130900",
					name: "沧州市",
					districts: {
						130_902: "新华区",
						130_903: "运河区",
						130_921: "沧县",
						130_922: "青县",
						130_923: "东光县",
						130_924: "海兴县",
						130_925: "盐山县",
						130_926: "肃宁县",
						130_927: "南皮县",
						130_928: "吴桥县",
						130_929: "献县",
						130_930: "孟村回族自治县",
						130_981: "泊头市",
						130_982: "任丘市",
						130_983: "黄骅市",
						130_984: "河间市"
					}
				},
				131_000: {
					code: "131000",
					name: "廊坊市",
					districts: {
						131_002: "安次区",
						131_003: "广阳区",
						131_022: "固安县",
						131_023: "永清县",
						131_024: "香河县",
						131_025: "大城县",
						131_026: "文安县",
						131_028: "大厂回族自治县",
						131_081: "霸州市",
						131_082: "三河市"
					}
				},
				131_100: {
					code: "131100",
					name: "衡水市",
					districts: {
						131_102: "桃城区",
						131_103: "冀州区",
						131_121: "枣强县",
						131_122: "武邑县",
						131_123: "武强县",
						131_124: "饶阳县",
						131_125: "安平县",
						131_126: "故城县",
						131_127: "景县",
						131_128: "阜城县",
						131_182: "深州市"
					}
				}
			}
		},
		140_000: {
			code: "140000",
			name: "山西省",
			cities: {
				140_100: {
					code: "140100",
					name: "太原市",
					districts: {
						140_105: "小店区",
						140_106: "迎泽区",
						140_107: "杏花岭区",
						140_108: "尖草坪区",
						140_109: "万柏林区",
						140_110: "晋源区",
						140_121: "清徐县",
						140_122: "阳曲县",
						140_123: "娄烦县",
						140_181: "古交市"
					}
				},
				140_200: {
					code: "140200",
					name: "大同市",
					districts: {
						140_212: "新荣区",
						140_213: "平城区",
						140_214: "云冈区",
						140_215: "云州区",
						140_221: "阳高县",
						140_222: "天镇县",
						140_223: "广灵县",
						140_224: "灵丘县",
						140_225: "浑源县",
						140_226: "左云县"
					}
				},
				140_300: {
					code: "140300",
					name: "阳泉市",
					districts: {
						140_302: "城区",
						140_303: "矿区",
						140_311: "郊区",
						140_321: "平定县",
						140_322: "盂县"
					}
				},
				140_400: {
					code: "140400",
					name: "长治市",
					districts: {
						140_403: "潞州区",
						140_404: "上党区",
						140_405: "屯留区",
						140_406: "潞城区",
						140_423: "襄垣县",
						140_425: "平顺县",
						140_426: "黎城县",
						140_427: "壶关县",
						140_428: "长子县",
						140_429: "武乡县",
						140_430: "沁县",
						140_431: "沁源县"
					}
				},
				140_500: {
					code: "140500",
					name: "晋城市",
					districts: {
						140_502: "城区",
						140_521: "沁水县",
						140_522: "阳城县",
						140_524: "陵川县",
						140_525: "泽州县",
						140_581: "高平市"
					}
				},
				140_600: {
					code: "140600",
					name: "朔州市",
					districts: {
						140_602: "朔城区",
						140_603: "平鲁区",
						140_621: "山阴县",
						140_622: "应县",
						140_623: "右玉县",
						140_681: "怀仁市"
					}
				},
				140_700: {
					code: "140700",
					name: "晋中市",
					districts: {
						140_702: "榆次区",
						140_721: "榆社县",
						140_722: "左权县",
						140_723: "和顺县",
						140_724: "昔阳县",
						140_725: "寿阳县",
						140_726: "太谷县",
						140_727: "祁县",
						140_728: "平遥县",
						140_729: "灵石县",
						140_781: "介休市"
					}
				},
				140_800: {
					code: "140800",
					name: "运城市",
					districts: {
						140_802: "盐湖区",
						140_821: "临猗县",
						140_822: "万荣县",
						140_823: "闻喜县",
						140_824: "稷山县",
						140_825: "新绛县",
						140_826: "绛县",
						140_827: "垣曲县",
						140_828: "夏县",
						140_829: "平陆县",
						140_830: "芮城县",
						140_881: "永济市",
						140_882: "河津市"
					}
				},
				140_900: {
					code: "140900",
					name: "忻州市",
					districts: {
						140_902: "忻府区",
						140_921: "定襄县",
						140_922: "五台县",
						140_923: "代县",
						140_924: "繁峙县",
						140_925: "宁武县",
						140_926: "静乐县",
						140_927: "神池县",
						140_928: "五寨县",
						140_929: "岢岚县",
						140_930: "河曲县",
						140_931: "保德县",
						140_932: "偏关县",
						140_981: "原平市"
					}
				},
				141_000: {
					code: "141000",
					name: "临汾市",
					districts: {
						141_002: "尧都区",
						141_021: "曲沃县",
						141_022: "翼城县",
						141_023: "襄汾县",
						141_024: "洪洞县",
						141_025: "古县",
						141_026: "安泽县",
						141_027: "浮山县",
						141_028: "吉县",
						141_029: "乡宁县",
						141_030: "大宁县",
						141_031: "隰县",
						141_032: "永和县",
						141_033: "蒲县",
						141_034: "汾西县",
						141_081: "侯马市",
						141_082: "霍州市"
					}
				},
				141_100: {
					code: "141100",
					name: "吕梁市",
					districts: {
						141_102: "离石区",
						141_121: "文水县",
						141_122: "交城县",
						141_123: "兴县",
						141_124: "临县",
						141_125: "柳林县",
						141_126: "石楼县",
						141_127: "岚县",
						141_128: "方山县",
						141_129: "中阳县",
						141_130: "交口县",
						141_181: "孝义市",
						141_182: "汾阳市"
					}
				}
			}
		},
		150_000: {
			code: "150000",
			name: "内蒙古自治区",
			cities: {
				150_100: {
					code: "150100",
					name: "呼和浩特市",
					districts: {
						150_102: "新城区",
						150_103: "回民区",
						150_104: "玉泉区",
						150_105: "赛罕区",
						150_121: "土默特左旗",
						150_122: "托克托县",
						150_123: "和林格尔县",
						150_124: "清水河县",
						150_125: "武川县"
					}
				},
				150_200: {
					code: "150200",
					name: "包头市",
					districts: {
						150_202: "东河区",
						150_203: "昆都仑区",
						150_204: "青山区",
						150_205: "石拐区",
						150_206: "白云鄂博矿区",
						150_207: "九原区",
						150_221: "土默特右旗",
						150_222: "固阳县",
						150_223: "达尔罕茂明安联合旗"
					}
				},
				150_300: {
					code: "150300",
					name: "乌海市",
					districts: {
						150_302: "海勃湾区",
						150_303: "海南区",
						150_304: "乌达区"
					}
				},
				150_400: {
					code: "150400",
					name: "赤峰市",
					districts: {
						150_402: "红山区",
						150_403: "元宝山区",
						150_404: "松山区",
						150_421: "阿鲁科尔沁旗",
						150_422: "巴林左旗",
						150_423: "巴林右旗",
						150_424: "林西县",
						150_425: "克什克腾旗",
						150_426: "翁牛特旗",
						150_428: "喀喇沁旗",
						150_429: "宁城县",
						150_430: "敖汉旗"
					}
				},
				150_500: {
					code: "150500",
					name: "通辽市",
					districts: {
						150_502: "科尔沁区",
						150_521: "科尔沁左翼中旗",
						150_522: "科尔沁左翼后旗",
						150_523: "开鲁县",
						150_524: "库伦旗",
						150_525: "奈曼旗",
						150_526: "扎鲁特旗",
						150_581: "霍林郭勒市"
					}
				},
				150_600: {
					code: "150600",
					name: "鄂尔多斯市",
					districts: {
						150_602: "东胜区",
						150_603: "康巴什区",
						150_621: "达拉特旗",
						150_622: "准格尔旗",
						150_623: "鄂托克前旗",
						150_624: "鄂托克旗",
						150_625: "杭锦旗",
						150_626: "乌审旗",
						150_627: "伊金霍洛旗"
					}
				},
				150_700: {
					code: "150700",
					name: "呼伦贝尔市",
					districts: {
						150_702: "海拉尔区",
						150_703: "扎赉诺尔区",
						150_721: "阿荣旗",
						150_722: "莫力达瓦达斡尔族自治旗",
						150_723: "鄂伦春自治旗",
						150_724: "鄂温克族自治旗",
						150_725: "陈巴尔虎旗",
						150_726: "新巴尔虎左旗",
						150_727: "新巴尔虎右旗",
						150_781: "满洲里市",
						150_782: "牙克石市",
						150_783: "扎兰屯市",
						150_784: "额尔古纳市",
						150_785: "根河市"
					}
				},
				150_800: {
					code: "150800",
					name: "巴彦淖尔市",
					districts: {
						150_802: "临河区",
						150_821: "五原县",
						150_822: "磴口县",
						150_823: "乌拉特前旗",
						150_824: "乌拉特中旗",
						150_825: "乌拉特后旗",
						150_826: "杭锦后旗"
					}
				},
				150_900: {
					code: "150900",
					name: "乌兰察布市",
					districts: {
						150_902: "集宁区",
						150_921: "卓资县",
						150_922: "化德县",
						150_923: "商都县",
						150_924: "兴和县",
						150_925: "凉城县",
						150_926: "察哈尔右翼前旗",
						150_927: "察哈尔右翼中旗",
						150_928: "察哈尔右翼后旗",
						150_929: "四子王旗",
						150_981: "丰镇市"
					}
				},
				152_200: {
					code: "152200",
					name: "兴安盟",
					districts: {
						152_201: "乌兰浩特市",
						152_202: "阿尔山市",
						152_221: "科尔沁右翼前旗",
						152_222: "科尔沁右翼中旗",
						152_223: "扎赉特旗",
						152_224: "突泉县"
					}
				},
				152_500: {
					code: "152500",
					name: "锡林郭勒盟",
					districts: {
						152_501: "二连浩特市",
						152_502: "锡林浩特市",
						152_522: "阿巴嘎旗",
						152_523: "苏尼特左旗",
						152_524: "苏尼特右旗",
						152_525: "东乌珠穆沁旗",
						152_526: "西乌珠穆沁旗",
						152_527: "太仆寺旗",
						152_528: "镶黄旗",
						152_529: "正镶白旗",
						152_530: "正蓝旗",
						152_531: "多伦县"
					}
				},
				152_900: {
					code: "152900",
					name: "阿拉善盟",
					districts: {
						152_921: "阿拉善左旗",
						152_922: "阿拉善右旗",
						152_923: "额济纳旗"
					}
				}
			}
		},
		210_000: {
			code: "210000",
			name: "辽宁省",
			cities: {
				210_100: {
					code: "210100",
					name: "沈阳市",
					districts: {
						210_102: "和平区",
						210_103: "沈河区",
						210_104: "大东区",
						210_105: "皇姑区",
						210_106: "铁西区",
						210_111: "苏家屯区",
						210_112: "浑南区",
						210_113: "沈北新区",
						210_114: "于洪区",
						210_115: "辽中区",
						210_123: "康平县",
						210_124: "法库县",
						210_181: "新民市"
					}
				},
				210_200: {
					code: "210200",
					name: "大连市",
					districts: {
						210_202: "中山区",
						210_203: "西岗区",
						210_204: "沙河口区",
						210_211: "甘井子区",
						210_212: "旅顺口区",
						210_213: "金州区",
						210_214: "普兰店区",
						210_224: "长海县",
						210_281: "瓦房店市",
						210_283: "庄河市"
					}
				},
				210_300: {
					code: "210300",
					name: "鞍山市",
					districts: {
						210_302: "铁东区",
						210_303: "铁西区",
						210_304: "立山区",
						210_311: "千山区",
						210_321: "台安县",
						210_323: "岫岩满族自治县",
						210_381: "海城市"
					}
				},
				210_400: {
					code: "210400",
					name: "抚顺市",
					districts: {
						210_402: "新抚区",
						210_403: "东洲区",
						210_404: "望花区",
						210_411: "顺城区",
						210_421: "抚顺县",
						210_422: "新宾满族自治县",
						210_423: "清原满族自治县"
					}
				},
				210_500: {
					code: "210500",
					name: "本溪市",
					districts: {
						210_502: "平山区",
						210_503: "溪湖区",
						210_504: "明山区",
						210_505: "南芬区",
						210_521: "本溪满族自治县",
						210_522: "桓仁满族自治县"
					}
				},
				210_600: {
					code: "210600",
					name: "丹东市",
					districts: {
						210_602: "元宝区",
						210_603: "振兴区",
						210_604: "振安区",
						210_624: "宽甸满族自治县",
						210_681: "东港市",
						210_682: "凤城市"
					}
				},
				210_700: {
					code: "210700",
					name: "锦州市",
					districts: {
						210_702: "古塔区",
						210_703: "凌河区",
						210_711: "太和区",
						210_726: "黑山县",
						210_727: "义县",
						210_781: "凌海市",
						210_782: "北镇市"
					}
				},
				210_800: {
					code: "210800",
					name: "营口市",
					districts: {
						210_802: "站前区",
						210_803: "西市区",
						210_804: "鲅鱼圈区",
						210_811: "老边区",
						210_881: "盖州市",
						210_882: "大石桥市"
					}
				},
				210_900: {
					code: "210900",
					name: "阜新市",
					districts: {
						210_902: "海州区",
						210_903: "新邱区",
						210_904: "太平区",
						210_905: "清河门区",
						210_911: "细河区",
						210_921: "阜新蒙古族自治县",
						210_922: "彰武县"
					}
				},
				211_000: {
					code: "211000",
					name: "辽阳市",
					districts: {
						211_002: "白塔区",
						211_003: "文圣区",
						211_004: "宏伟区",
						211_005: "弓长岭区",
						211_011: "太子河区",
						211_021: "辽阳县",
						211_081: "灯塔市"
					}
				},
				211_100: {
					code: "211100",
					name: "盘锦市",
					districts: {
						211_102: "双台子区",
						211_103: "兴隆台区",
						211_104: "大洼区",
						211_122: "盘山县"
					}
				},
				211_200: {
					code: "211200",
					name: "铁岭市",
					districts: {
						211_202: "银州区",
						211_204: "清河区",
						211_221: "铁岭县",
						211_223: "西丰县",
						211_224: "昌图县",
						211_281: "调兵山市",
						211_282: "开原市"
					}
				},
				211_300: {
					code: "211300",
					name: "朝阳市",
					districts: {
						211_302: "双塔区",
						211_303: "龙城区",
						211_321: "朝阳县",
						211_322: "建平县",
						211_324: "喀喇沁左翼蒙古族自治县",
						211_381: "北票市",
						211_382: "凌源市"
					}
				},
				211_400: {
					code: "211400",
					name: "葫芦岛市",
					districts: {
						211_402: "连山区",
						211_403: "龙港区",
						211_404: "南票区",
						211_421: "绥中县",
						211_422: "建昌县",
						211_481: "兴城市"
					}
				}
			}
		},
		220_000: {
			code: "220000",
			name: "吉林省",
			cities: {
				220_100: {
					code: "220100",
					name: "长春市",
					districts: {
						220_102: "南关区",
						220_103: "宽城区",
						220_104: "朝阳区",
						220_105: "二道区",
						220_106: "绿园区",
						220_112: "双阳区",
						220_113: "九台区",
						220_122: "农安县",
						220_182: "榆树市",
						220_183: "德惠市"
					}
				},
				220_200: {
					code: "220200",
					name: "吉林市",
					districts: {
						220_202: "昌邑区",
						220_203: "龙潭区",
						220_204: "船营区",
						220_211: "丰满区",
						220_221: "永吉县",
						220_281: "蛟河市",
						220_282: "桦甸市",
						220_283: "舒兰市",
						220_284: "磐石市"
					}
				},
				220_300: {
					code: "220300",
					name: "四平市",
					districts: {
						220_302: "铁西区",
						220_303: "铁东区",
						220_322: "梨树县",
						220_323: "伊通满族自治县",
						220_381: "公主岭市",
						220_382: "双辽市"
					}
				},
				220_400: {
					code: "220400",
					name: "辽源市",
					districts: {
						220_402: "龙山区",
						220_403: "西安区",
						220_421: "东丰县",
						220_422: "东辽县"
					}
				},
				220_500: {
					code: "220500",
					name: "通化市",
					districts: {
						220_502: "东昌区",
						220_503: "二道江区",
						220_521: "通化县",
						220_523: "辉南县",
						220_524: "柳河县",
						220_581: "梅河口市",
						220_582: "集安市"
					}
				},
				220_600: {
					code: "220600",
					name: "白山市",
					districts: {
						220_602: "浑江区",
						220_605: "江源区",
						220_621: "抚松县",
						220_622: "靖宇县",
						220_623: "长白朝鲜族自治县",
						220_681: "临江市"
					}
				},
				220_700: {
					code: "220700",
					name: "松原市",
					districts: {
						220_702: "宁江区",
						220_721: "前郭尔罗斯蒙古族自治县",
						220_722: "长岭县",
						220_723: "乾安县",
						220_781: "扶余市"
					}
				},
				220_800: {
					code: "220800",
					name: "白城市",
					districts: {
						220_802: "洮北区",
						220_821: "镇赉县",
						220_822: "通榆县",
						220_881: "洮南市",
						220_882: "大安市"
					}
				},
				222_400: {
					code: "222400",
					name: "延边朝鲜族自治州",
					districts: {
						222_401: "延吉市",
						222_402: "图们市",
						222_403: "敦化市",
						222_404: "珲春市",
						222_405: "龙井市",
						222_406: "和龙市",
						222_424: "汪清县",
						222_426: "安图县"
					}
				}
			}
		},
		230_000: {
			code: "230000",
			name: "黑龙江省",
			cities: {
				230_100: {
					code: "230100",
					name: "哈尔滨市",
					districts: {
						230_102: "道里区",
						230_103: "南岗区",
						230_104: "道外区",
						230_108: "平房区",
						230_109: "松北区",
						230_110: "香坊区",
						230_111: "呼兰区",
						230_112: "阿城区",
						230_113: "双城区",
						230_123: "依兰县",
						230_124: "方正县",
						230_125: "宾县",
						230_126: "巴彦县",
						230_127: "木兰县",
						230_128: "通河县",
						230_129: "延寿县",
						230_183: "尚志市",
						230_184: "五常市"
					}
				},
				230_200: {
					code: "230200",
					name: "齐齐哈尔市",
					districts: {
						230_202: "龙沙区",
						230_203: "建华区",
						230_204: "铁锋区",
						230_205: "昂昂溪区",
						230_206: "富拉尔基区",
						230_207: "碾子山区",
						230_208: "梅里斯达斡尔族区",
						230_221: "龙江县",
						230_223: "依安县",
						230_224: "泰来县",
						230_225: "甘南县",
						230_227: "富裕县",
						230_229: "克山县",
						230_230: "克东县",
						230_231: "拜泉县",
						230_281: "讷河市"
					}
				},
				230_300: {
					code: "230300",
					name: "鸡西市",
					districts: {
						230_302: "鸡冠区",
						230_303: "恒山区",
						230_304: "滴道区",
						230_305: "梨树区",
						230_306: "城子河区",
						230_307: "麻山区",
						230_321: "鸡东县",
						230_381: "虎林市",
						230_382: "密山市"
					}
				},
				230_400: {
					code: "230400",
					name: "鹤岗市",
					districts: {
						230_402: "向阳区",
						230_403: "工农区",
						230_404: "南山区",
						230_405: "兴安区",
						230_406: "东山区",
						230_407: "兴山区",
						230_421: "萝北县",
						230_422: "绥滨县"
					}
				},
				230_500: {
					code: "230500",
					name: "双鸭山市",
					districts: {
						230_502: "尖山区",
						230_503: "岭东区",
						230_505: "四方台区",
						230_506: "宝山区",
						230_521: "集贤县",
						230_522: "友谊县",
						230_523: "宝清县",
						230_524: "饶河县"
					}
				},
				230_600: {
					code: "230600",
					name: "大庆市",
					districts: {
						230_602: "萨尔图区",
						230_603: "龙凤区",
						230_604: "让胡路区",
						230_605: "红岗区",
						230_606: "大同区",
						230_621: "肇州县",
						230_622: "肇源县",
						230_623: "林甸县",
						230_624: "杜尔伯特蒙古族自治县"
					}
				},
				230_700: {
					code: "230700",
					name: "伊春市",
					districts: {
						230_702: "伊春区",
						230_703: "南岔区",
						230_704: "友好区",
						230_705: "西林区",
						230_706: "翠峦区",
						230_707: "新青区",
						230_708: "美溪区",
						230_709: "金山屯区",
						230_710: "五营区",
						230_711: "乌马河区",
						230_712: "汤旺河区",
						230_713: "带岭区",
						230_714: "乌伊岭区",
						230_715: "红星区",
						230_716: "上甘岭区",
						230_722: "嘉荫县",
						230_781: "铁力市"
					}
				},
				230_800: {
					code: "230800",
					name: "佳木斯市",
					districts: {
						230_803: "向阳区",
						230_804: "前进区",
						230_805: "东风区",
						230_811: "郊区",
						230_822: "桦南县",
						230_826: "桦川县",
						230_828: "汤原县",
						230_881: "同江市",
						230_882: "富锦市",
						230_883: "抚远市"
					}
				},
				230_900: {
					code: "230900",
					name: "七台河市",
					districts: {
						230_902: "新兴区",
						230_903: "桃山区",
						230_904: "茄子河区",
						230_921: "勃利县"
					}
				},
				231_000: {
					code: "231000",
					name: "牡丹江市",
					districts: {
						231_002: "东安区",
						231_003: "阳明区",
						231_004: "爱民区",
						231_005: "西安区",
						231_025: "林口县",
						231_081: "绥芬河市",
						231_083: "海林市",
						231_084: "宁安市",
						231_085: "穆棱市",
						231_086: "东宁市"
					}
				},
				231_100: {
					code: "231100",
					name: "黑河市",
					districts: {
						231_102: "爱辉区",
						231_121: "嫩江县",
						231_123: "逊克县",
						231_124: "孙吴县",
						231_181: "北安市",
						231_182: "五大连池市"
					}
				},
				231_200: {
					code: "231200",
					name: "绥化市",
					districts: {
						231_202: "北林区",
						231_221: "望奎县",
						231_222: "兰西县",
						231_223: "青冈县",
						231_224: "庆安县",
						231_225: "明水县",
						231_226: "绥棱县",
						231_281: "安达市",
						231_282: "肇东市",
						231_283: "海伦市"
					}
				},
				232_700: {
					code: "232700",
					name: "大兴安岭地区",
					districts: {
						232_701: "漠河市",
						232_721: "呼玛县",
						232_722: "塔河县"
					}
				}
			}
		},
		310_000: {
			code: "310000",
			name: "上海市",
			cities: {
				310_000: {
					code: "310000",
					name: "上海市",
					districts: {
						310_101: "黄浦区",
						310_104: "徐汇区",
						310_105: "长宁区",
						310_106: "静安区",
						310_107: "普陀区",
						310_109: "虹口区",
						310_110: "杨浦区",
						310_112: "闵行区",
						310_113: "宝山区",
						310_114: "嘉定区",
						310_115: "浦东新区",
						310_116: "金山区",
						310_117: "松江区",
						310_118: "青浦区",
						310_120: "奉贤区",
						310_151: "崇明区"
					}
				}
			}
		},
		320_000: {
			code: "320000",
			name: "江苏省",
			cities: {
				320_100: {
					code: "320100",
					name: "南京市",
					districts: {
						320_102: "玄武区",
						320_104: "秦淮区",
						320_105: "建邺区",
						320_106: "鼓楼区",
						320_111: "浦口区",
						320_113: "栖霞区",
						320_114: "雨花台区",
						320_115: "江宁区",
						320_116: "六合区",
						320_117: "溧水区",
						320_118: "高淳区"
					}
				},
				320_200: {
					code: "320200",
					name: "无锡市",
					districts: {
						320_205: "锡山区",
						320_206: "惠山区",
						320_211: "滨湖区",
						320_213: "梁溪区",
						320_214: "新吴区",
						320_281: "江阴市",
						320_282: "宜兴市"
					}
				},
				320_300: {
					code: "320300",
					name: "徐州市",
					districts: {
						320_302: "鼓楼区",
						320_303: "云龙区",
						320_305: "贾汪区",
						320_311: "泉山区",
						320_312: "铜山区",
						320_321: "丰县",
						320_322: "沛县",
						320_324: "睢宁县",
						320_381: "新沂市",
						320_382: "邳州市"
					}
				},
				320_400: {
					code: "320400",
					name: "常州市",
					districts: {
						320_402: "天宁区",
						320_404: "钟楼区",
						320_411: "新北区",
						320_412: "武进区",
						320_413: "金坛区",
						320_481: "溧阳市"
					}
				},
				320_500: {
					code: "320500",
					name: "苏州市",
					districts: {
						320_505: "虎丘区",
						320_506: "吴中区",
						320_507: "相城区",
						320_508: "姑苏区",
						320_509: "吴江区",
						320_581: "常熟市",
						320_582: "张家港市",
						320_583: "昆山市",
						320_585: "太仓市"
					}
				},
				320_600: {
					code: "320600",
					name: "南通市",
					districts: {
						320_602: "崇川区",
						320_611: "港闸区",
						320_612: "通州区",
						320_623: "如东县",
						320_681: "启东市",
						320_682: "如皋市",
						320_684: "海门市",
						320_685: "海安市"
					}
				},
				320_700: {
					code: "320700",
					name: "连云港市",
					districts: {
						320_703: "连云区",
						320_706: "海州区",
						320_707: "赣榆区",
						320_722: "东海县",
						320_723: "灌云县",
						320_724: "灌南县"
					}
				},
				320_800: {
					code: "320800",
					name: "淮安市",
					districts: {
						320_803: "淮安区",
						320_804: "淮阴区",
						320_812: "清江浦区",
						320_813: "洪泽区",
						320_826: "涟水县",
						320_830: "盱眙县",
						320_831: "金湖县"
					}
				},
				320_900: {
					code: "320900",
					name: "盐城市",
					districts: {
						320_902: "亭湖区",
						320_903: "盐都区",
						320_904: "大丰区",
						320_921: "响水县",
						320_922: "滨海县",
						320_923: "阜宁县",
						320_924: "射阳县",
						320_925: "建湖县",
						320_981: "东台市"
					}
				},
				321_000: {
					code: "321000",
					name: "扬州市",
					districts: {
						321_002: "广陵区",
						321_003: "邗江区",
						321_012: "江都区",
						321_023: "宝应县",
						321_081: "仪征市",
						321_084: "高邮市"
					}
				},
				321_100: {
					code: "321100",
					name: "镇江市",
					districts: {
						321_102: "京口区",
						321_111: "润州区",
						321_112: "丹徒区",
						321_181: "丹阳市",
						321_182: "扬中市",
						321_183: "句容市"
					}
				},
				321_200: {
					code: "321200",
					name: "泰州市",
					districts: {
						321_202: "海陵区",
						321_203: "高港区",
						321_204: "姜堰区",
						321_281: "兴化市",
						321_282: "靖江市",
						321_283: "泰兴市"
					}
				},
				321_300: {
					code: "321300",
					name: "宿迁市",
					districts: {
						321_302: "宿城区",
						321_311: "宿豫区",
						321_322: "沭阳县",
						321_323: "泗阳县",
						321_324: "泗洪县"
					}
				}
			}
		},
		330_000: {
			code: "330000",
			name: "浙江省",
			cities: {
				330_100: {
					code: "330100",
					name: "杭州市",
					districts: {
						330_102: "上城区",
						330_103: "下城区",
						330_104: "江干区",
						330_105: "拱墅区",
						330_106: "西湖区",
						330_108: "滨江区",
						330_109: "萧山区",
						330_110: "余杭区",
						330_111: "富阳区",
						330_112: "临安区",
						330_122: "桐庐县",
						330_127: "淳安县",
						330_182: "建德市"
					}
				},
				330_200: {
					code: "330200",
					name: "宁波市",
					districts: {
						330_203: "海曙区",
						330_205: "江北区",
						330_206: "北仑区",
						330_211: "镇海区",
						330_212: "鄞州区",
						330_213: "奉化区",
						330_225: "象山县",
						330_226: "宁海县",
						330_281: "余姚市",
						330_282: "慈溪市"
					}
				},
				330_300: {
					code: "330300",
					name: "温州市",
					districts: {
						330_302: "鹿城区",
						330_303: "龙湾区",
						330_304: "瓯海区",
						330_305: "洞头区",
						330_324: "永嘉县",
						330_326: "平阳县",
						330_327: "苍南县",
						330_328: "文成县",
						330_329: "泰顺县",
						330_381: "瑞安市",
						330_382: "乐清市"
					}
				},
				330_400: {
					code: "330400",
					name: "嘉兴市",
					districts: {
						330_402: "南湖区",
						330_411: "秀洲区",
						330_421: "嘉善县",
						330_424: "海盐县",
						330_481: "海宁市",
						330_482: "平湖市",
						330_483: "桐乡市"
					}
				},
				330_500: {
					code: "330500",
					name: "湖州市",
					districts: {
						330_502: "吴兴区",
						330_503: "南浔区",
						330_521: "德清县",
						330_522: "长兴县",
						330_523: "安吉县"
					}
				},
				330_600: {
					code: "330600",
					name: "绍兴市",
					districts: {
						330_602: "越城区",
						330_603: "柯桥区",
						330_604: "上虞区",
						330_624: "新昌县",
						330_681: "诸暨市",
						330_683: "嵊州市"
					}
				},
				330_700: {
					code: "330700",
					name: "金华市",
					districts: {
						330_702: "婺城区",
						330_703: "金东区",
						330_723: "武义县",
						330_726: "浦江县",
						330_727: "磐安县",
						330_781: "兰溪市",
						330_782: "义乌市",
						330_783: "东阳市",
						330_784: "永康市"
					}
				},
				330_800: {
					code: "330800",
					name: "衢州市",
					districts: {
						330_802: "柯城区",
						330_803: "衢江区",
						330_822: "常山县",
						330_824: "开化县",
						330_825: "龙游县",
						330_881: "江山市"
					}
				},
				330_900: {
					code: "330900",
					name: "舟山市",
					districts: {
						330_902: "定海区",
						330_903: "普陀区",
						330_921: "岱山县",
						330_922: "嵊泗县"
					}
				},
				331_000: {
					code: "331000",
					name: "台州市",
					districts: {
						331_002: "椒江区",
						331_003: "黄岩区",
						331_004: "路桥区",
						331_022: "三门县",
						331_023: "天台县",
						331_024: "仙居县",
						331_081: "温岭市",
						331_082: "临海市",
						331_083: "玉环市"
					}
				},
				331_100: {
					code: "331100",
					name: "丽水市",
					districts: {
						331_102: "莲都区",
						331_121: "青田县",
						331_122: "缙云县",
						331_123: "遂昌县",
						331_124: "松阳县",
						331_125: "云和县",
						331_126: "庆元县",
						331_127: "景宁畲族自治县",
						331_181: "龙泉市"
					}
				}
			}
		},
		340_000: {
			code: "340000",
			name: "安徽省",
			cities: {
				340_100: {
					code: "340100",
					name: "合肥市",
					districts: {
						340_102: "瑶海区",
						340_103: "庐阳区",
						340_104: "蜀山区",
						340_111: "包河区",
						340_121: "长丰县",
						340_122: "肥东县",
						340_123: "肥西县",
						340_124: "庐江县",
						340_181: "巢湖市"
					}
				},
				340_200: {
					code: "340200",
					name: "芜湖市",
					districts: {
						340_202: "镜湖区",
						340_203: "弋江区",
						340_207: "鸠江区",
						340_208: "三山区",
						340_221: "芜湖县",
						340_222: "繁昌县",
						340_223: "南陵县",
						340_225: "无为县"
					}
				},
				340_300: {
					code: "340300",
					name: "蚌埠市",
					districts: {
						340_302: "龙子湖区",
						340_303: "蚌山区",
						340_304: "禹会区",
						340_311: "淮上区",
						340_321: "怀远县",
						340_322: "五河县",
						340_323: "固镇县"
					}
				},
				340_400: {
					code: "340400",
					name: "淮南市",
					districts: {
						340_402: "大通区",
						340_403: "田家庵区",
						340_404: "谢家集区",
						340_405: "八公山区",
						340_406: "潘集区",
						340_421: "凤台县",
						340_422: "寿县"
					}
				},
				340_500: {
					code: "340500",
					name: "马鞍山市",
					districts: {
						340_503: "花山区",
						340_504: "雨山区",
						340_506: "博望区",
						340_521: "当涂县",
						340_522: "含山县",
						340_523: "和县"
					}
				},
				340_600: {
					code: "340600",
					name: "淮北市",
					districts: {
						340_602: "杜集区",
						340_603: "相山区",
						340_604: "烈山区",
						340_621: "濉溪县"
					}
				},
				340_700: {
					code: "340700",
					name: "铜陵市",
					districts: {
						340_705: "铜官区",
						340_706: "义安区",
						340_711: "郊区",
						340_722: "枞阳县"
					}
				},
				340_800: {
					code: "340800",
					name: "安庆市",
					districts: {
						340_802: "迎江区",
						340_803: "大观区",
						340_811: "宜秀区",
						340_822: "怀宁县",
						340_825: "太湖县",
						340_826: "宿松县",
						340_827: "望江县",
						340_828: "岳西县",
						340_881: "桐城市",
						340_882: "潜山市"
					}
				},
				341_000: {
					code: "341000",
					name: "黄山市",
					districts: {
						341_002: "屯溪区",
						341_003: "黄山区",
						341_004: "徽州区",
						341_021: "歙县",
						341_022: "休宁县",
						341_023: "黟县",
						341_024: "祁门县"
					}
				},
				341_100: {
					code: "341100",
					name: "滁州市",
					districts: {
						341_102: "琅琊区",
						341_103: "南谯区",
						341_122: "来安县",
						341_124: "全椒县",
						341_125: "定远县",
						341_126: "凤阳县",
						341_181: "天长市",
						341_182: "明光市"
					}
				},
				341_200: {
					code: "341200",
					name: "阜阳市",
					districts: {
						341_202: "颍州区",
						341_203: "颍东区",
						341_204: "颍泉区",
						341_221: "临泉县",
						341_222: "太和县",
						341_225: "阜南县",
						341_226: "颍上县",
						341_282: "界首市"
					}
				},
				341_300: {
					code: "341300",
					name: "宿州市",
					districts: {
						341_302: "埇桥区",
						341_321: "砀山县",
						341_322: "萧县",
						341_323: "灵璧县",
						341_324: "泗县"
					}
				},
				341_500: {
					code: "341500",
					name: "六安市",
					districts: {
						341_502: "金安区",
						341_503: "裕安区",
						341_504: "叶集区",
						341_522: "霍邱县",
						341_523: "舒城县",
						341_524: "金寨县",
						341_525: "霍山县"
					}
				},
				341_600: {
					code: "341600",
					name: "亳州市",
					districts: {
						341_602: "谯城区",
						341_621: "涡阳县",
						341_622: "蒙城县",
						341_623: "利辛县"
					}
				},
				341_700: {
					code: "341700",
					name: "池州市",
					districts: {
						341_702: "贵池区",
						341_721: "东至县",
						341_722: "石台县",
						341_723: "青阳县"
					}
				},
				341_800: {
					code: "341800",
					name: "宣城市",
					districts: {
						341_802: "宣州区",
						341_821: "郎溪县",
						341_822: "广德县",
						341_823: "泾县",
						341_824: "绩溪县",
						341_825: "旌德县",
						341_881: "宁国市"
					}
				}
			}
		},
		350_000: {
			code: "350000",
			name: "福建省",
			cities: {
				350_100: {
					code: "350100",
					name: "福州市",
					districts: {
						350_102: "鼓楼区",
						350_103: "台江区",
						350_104: "仓山区",
						350_105: "马尾区",
						350_111: "晋安区",
						350_112: "长乐区",
						350_121: "闽侯县",
						350_122: "连江县",
						350_123: "罗源县",
						350_124: "闽清县",
						350_125: "永泰县",
						350_128: "平潭县",
						350_181: "福清市"
					}
				},
				350_200: {
					code: "350200",
					name: "厦门市",
					districts: {
						350_203: "思明区",
						350_205: "海沧区",
						350_206: "湖里区",
						350_211: "集美区",
						350_212: "同安区",
						350_213: "翔安区"
					}
				},
				350_300: {
					code: "350300",
					name: "莆田市",
					districts: {
						350_302: "城厢区",
						350_303: "涵江区",
						350_304: "荔城区",
						350_305: "秀屿区",
						350_322: "仙游县"
					}
				},
				350_400: {
					code: "350400",
					name: "三明市",
					districts: {
						350_402: "梅列区",
						350_403: "三元区",
						350_421: "明溪县",
						350_423: "清流县",
						350_424: "宁化县",
						350_425: "大田县",
						350_426: "尤溪县",
						350_427: "沙县",
						350_428: "将乐县",
						350_429: "泰宁县",
						350_430: "建宁县",
						350_481: "永安市"
					}
				},
				350_500: {
					code: "350500",
					name: "泉州市",
					districts: {
						350_502: "鲤城区",
						350_503: "丰泽区",
						350_504: "洛江区",
						350_505: "泉港区",
						350_521: "惠安县",
						350_524: "安溪县",
						350_525: "永春县",
						350_526: "德化县",
						350_527: "金门县",
						350_581: "石狮市",
						350_582: "晋江市",
						350_583: "南安市"
					}
				},
				350_600: {
					code: "350600",
					name: "漳州市",
					districts: {
						350_602: "芗城区",
						350_603: "龙文区",
						350_622: "云霄县",
						350_623: "漳浦县",
						350_624: "诏安县",
						350_625: "长泰县",
						350_626: "东山县",
						350_627: "南靖县",
						350_628: "平和县",
						350_629: "华安县",
						350_681: "龙海市"
					}
				},
				350_700: {
					code: "350700",
					name: "南平市",
					districts: {
						350_702: "延平区",
						350_703: "建阳区",
						350_721: "顺昌县",
						350_722: "浦城县",
						350_723: "光泽县",
						350_724: "松溪县",
						350_725: "政和县",
						350_781: "邵武市",
						350_782: "武夷山市",
						350_783: "建瓯市"
					}
				},
				350_800: {
					code: "350800",
					name: "龙岩市",
					districts: {
						350_802: "新罗区",
						350_803: "永定区",
						350_821: "长汀县",
						350_823: "上杭县",
						350_824: "武平县",
						350_825: "连城县",
						350_881: "漳平市"
					}
				},
				350_900: {
					code: "350900",
					name: "宁德市",
					districts: {
						350_902: "蕉城区",
						350_921: "霞浦县",
						350_922: "古田县",
						350_923: "屏南县",
						350_924: "寿宁县",
						350_925: "周宁县",
						350_926: "柘荣县",
						350_981: "福安市",
						350_982: "福鼎市"
					}
				}
			}
		},
		360_000: {
			code: "360000",
			name: "江西省",
			cities: {
				360_100: {
					code: "360100",
					name: "南昌市",
					districts: {
						360_102: "东湖区",
						360_103: "西湖区",
						360_104: "青云谱区",
						360_105: "湾里区",
						360_111: "青山湖区",
						360_112: "新建区",
						360_121: "南昌县",
						360_123: "安义县",
						360_124: "进贤县"
					}
				},
				360_200: {
					code: "360200",
					name: "景德镇市",
					districts: {
						360_202: "昌江区",
						360_203: "珠山区",
						360_222: "浮梁县",
						360_281: "乐平市"
					}
				},
				360_300: {
					code: "360300",
					name: "萍乡市",
					districts: {
						360_302: "安源区",
						360_313: "湘东区",
						360_321: "莲花县",
						360_322: "上栗县",
						360_323: "芦溪县"
					}
				},
				360_400: {
					code: "360400",
					name: "九江市",
					districts: {
						360_402: "濂溪区",
						360_403: "浔阳区",
						360_404: "柴桑区",
						360_423: "武宁县",
						360_424: "修水县",
						360_425: "永修县",
						360_426: "德安县",
						360_428: "都昌县",
						360_429: "湖口县",
						360_430: "彭泽县",
						360_481: "瑞昌市",
						360_482: "共青城市",
						360_483: "庐山市"
					}
				},
				360_500: {
					code: "360500",
					name: "新余市",
					districts: {
						360_502: "渝水区",
						360_521: "分宜县"
					}
				},
				360_600: {
					code: "360600",
					name: "鹰潭市",
					districts: {
						360_602: "月湖区",
						360_603: "余江区",
						360_681: "贵溪市"
					}
				},
				360_700: {
					code: "360700",
					name: "赣州市",
					districts: {
						360_702: "章贡区",
						360_703: "南康区",
						360_704: "赣县区",
						360_722: "信丰县",
						360_723: "大余县",
						360_724: "上犹县",
						360_725: "崇义县",
						360_726: "安远县",
						360_727: "龙南县",
						360_728: "定南县",
						360_729: "全南县",
						360_730: "宁都县",
						360_731: "于都县",
						360_732: "兴国县",
						360_733: "会昌县",
						360_734: "寻乌县",
						360_735: "石城县",
						360_781: "瑞金市"
					}
				},
				360_800: {
					code: "360800",
					name: "吉安市",
					districts: {
						360_802: "吉州区",
						360_803: "青原区",
						360_821: "吉安县",
						360_822: "吉水县",
						360_823: "峡江县",
						360_824: "新干县",
						360_825: "永丰县",
						360_826: "泰和县",
						360_827: "遂川县",
						360_828: "万安县",
						360_829: "安福县",
						360_830: "永新县",
						360_881: "井冈山市"
					}
				},
				360_900: {
					code: "360900",
					name: "宜春市",
					districts: {
						360_902: "袁州区",
						360_921: "奉新县",
						360_922: "万载县",
						360_923: "上高县",
						360_924: "宜丰县",
						360_925: "靖安县",
						360_926: "铜鼓县",
						360_981: "丰城市",
						360_982: "樟树市",
						360_983: "高安市"
					}
				},
				361_000: {
					code: "361000",
					name: "抚州市",
					districts: {
						361_002: "临川区",
						361_003: "东乡区",
						361_021: "南城县",
						361_022: "黎川县",
						361_023: "南丰县",
						361_024: "崇仁县",
						361_025: "乐安县",
						361_026: "宜黄县",
						361_027: "金溪县",
						361_028: "资溪县",
						361_030: "广昌县"
					}
				},
				361_100: {
					code: "361100",
					name: "上饶市",
					districts: {
						361_102: "信州区",
						361_103: "广丰区",
						361_121: "上饶县",
						361_123: "玉山县",
						361_124: "铅山县",
						361_125: "横峰县",
						361_126: "弋阳县",
						361_127: "余干县",
						361_128: "鄱阳县",
						361_129: "万年县",
						361_130: "婺源县",
						361_181: "德兴市"
					}
				}
			}
		},
		370_000: {
			code: "370000",
			name: "山东省",
			cities: {
				370_100: {
					code: "370100",
					name: "济南市",
					districts: {
						370_102: "历下区",
						370_103: "市中区",
						370_104: "槐荫区",
						370_105: "天桥区",
						370_112: "历城区",
						370_113: "长清区",
						370_114: "章丘区",
						370_115: "济阳区",
						370_116: "莱芜区",
						370_117: "钢城区",
						370_124: "平阴县",
						370_126: "商河县"
					}
				},
				370_200: {
					code: "370200",
					name: "青岛市",
					districts: {
						370_202: "市南区",
						370_203: "市北区",
						370_211: "黄岛区",
						370_212: "崂山区",
						370_213: "李沧区",
						370_214: "城阳区",
						370_215: "即墨区",
						370_281: "胶州市",
						370_283: "平度市",
						370_285: "莱西市"
					}
				},
				370_300: {
					code: "370300",
					name: "淄博市",
					districts: {
						370_302: "淄川区",
						370_303: "张店区",
						370_304: "博山区",
						370_305: "临淄区",
						370_306: "周村区",
						370_321: "桓台县",
						370_322: "高青县",
						370_323: "沂源县"
					}
				},
				370_400: {
					code: "370400",
					name: "枣庄市",
					districts: {
						370_402: "市中区",
						370_403: "薛城区",
						370_404: "峄城区",
						370_405: "台儿庄区",
						370_406: "山亭区",
						370_481: "滕州市"
					}
				},
				370_500: {
					code: "370500",
					name: "东营市",
					districts: {
						370_502: "东营区",
						370_503: "河口区",
						370_505: "垦利区",
						370_522: "利津县",
						370_523: "广饶县"
					}
				},
				370_600: {
					code: "370600",
					name: "烟台市",
					districts: {
						370_602: "芝罘区",
						370_611: "福山区",
						370_612: "牟平区",
						370_613: "莱山区",
						370_614: "蓬莱区",
						370_681: "龙口市",
						370_682: "莱阳市",
						370_683: "莱州市",
						370_684: "蓬莱市",
						370_685: "招远市",
						370_686: "栖霞市",
						370_687: "海阳市"
					}
				},
				370_700: {
					code: "370700",
					name: "潍坊市",
					districts: {
						370_702: "潍城区",
						370_703: "寒亭区",
						370_704: "坊子区",
						370_705: "奎文区",
						370_724: "临朐县",
						370_725: "昌乐县",
						370_781: "青州市",
						370_782: "诸城市",
						370_783: "寿光市",
						370_784: "安丘市",
						370_785: "高密市",
						370_786: "昌邑市"
					}
				},
				370_800: {
					code: "370800",
					name: "济宁市",
					districts: {
						370_811: "任城区",
						370_812: "兖州区",
						370_826: "微山县",
						370_827: "鱼台县",
						370_828: "金乡县",
						370_829: "嘉祥县",
						370_830: "汶上县",
						370_831: "泗水县",
						370_832: "梁山县",
						370_881: "曲阜市",
						370_883: "邹城市"
					}
				},
				370_900: {
					code: "370900",
					name: "泰安市",
					districts: {
						370_902: "泰山区",
						370_911: "岱岳区",
						370_921: "宁阳县",
						370_923: "东平县",
						370_982: "新泰市",
						370_983: "肥城市"
					}
				},
				371_000: {
					code: "371000",
					name: "威海市",
					districts: {
						371_002: "环翠区",
						371_003: "文登区",
						371_082: "荣成市",
						371_083: "乳山市"
					}
				},
				371_100: {
					code: "371100",
					name: "日照市",
					districts: {
						371_102: "东港区",
						371_103: "岚山区",
						371_121: "五莲县",
						371_122: "莒县"
					}
				},
				371_300: {
					code: "371300",
					name: "临沂市",
					districts: {
						371_302: "兰山区",
						371_311: "罗庄区",
						371_312: "河东区",
						371_321: "沂南县",
						371_322: "郯城县",
						371_323: "沂水县",
						371_324: "兰陵县",
						371_325: "费县",
						371_326: "平邑县",
						371_327: "莒南县",
						371_328: "蒙阴县",
						371_329: "临沭县"
					}
				},
				371_400: {
					code: "371400",
					name: "德州市",
					districts: {
						371_402: "德城区",
						371_403: "陵城区",
						371_422: "宁津县",
						371_423: "庆云县",
						371_424: "临邑县",
						371_425: "齐河县",
						371_426: "平原县",
						371_427: "夏津县",
						371_428: "武城县",
						371_481: "乐陵市",
						371_482: "禹城市"
					}
				},
				371_500: {
					code: "371500",
					name: "聊城市",
					districts: {
						371_502: "东昌府区",
						371_521: "阳谷县",
						371_522: "莘县",
						371_523: "茌平县",
						371_524: "东阿县",
						371_525: "冠县",
						371_526: "高唐县",
						371_581: "临清市"
					}
				},
				371_600: {
					code: "371600",
					name: "滨州市",
					districts: {
						371_602: "滨城区",
						371_603: "沾化区",
						371_621: "惠民县",
						371_622: "阳信县",
						371_623: "无棣县",
						371_625: "博兴县",
						371_681: "邹平市"
					}
				},
				371_700: {
					code: "371700",
					name: "菏泽市",
					districts: {
						371_702: "牡丹区",
						371_703: "定陶区",
						371_721: "曹县",
						371_722: "单县",
						371_723: "成武县",
						371_724: "巨野县",
						371_725: "郓城县",
						371_726: "鄄城县",
						371_728: "东明县"
					}
				}
			}
		},
		410_000: {
			code: "410000",
			name: "河南省",
			cities: {
				410_100: {
					code: "410100",
					name: "郑州市",
					districts: {
						410_102: "中原区",
						410_103: "二七区",
						410_104: "管城回族区",
						410_105: "金水区",
						410_106: "上街区",
						410_108: "惠济区",
						410_122: "中牟县",
						410_181: "巩义市",
						410_182: "荥阳市",
						410_183: "新密市",
						410_184: "新郑市",
						410_185: "登封市"
					}
				},
				410_200: {
					code: "410200",
					name: "开封市",
					districts: {
						410_202: "龙亭区",
						410_203: "顺河回族区",
						410_204: "鼓楼区",
						410_205: "禹王台区",
						410_212: "祥符区",
						410_221: "杞县",
						410_222: "通许县",
						410_223: "尉氏县",
						410_225: "兰考县"
					}
				},
				410_300: {
					code: "410300",
					name: "洛阳市",
					districts: {
						410_302: "老城区",
						410_303: "西工区",
						410_304: "瀍河回族区",
						410_305: "涧西区",
						410_306: "吉利区",
						410_311: "洛龙区",
						410_322: "孟津县",
						410_323: "新安县",
						410_324: "栾川县",
						410_325: "嵩县",
						410_326: "汝阳县",
						410_327: "宜阳县",
						410_328: "洛宁县",
						410_329: "伊川县",
						410_381: "偃师市"
					}
				},
				410_400: {
					code: "410400",
					name: "平顶山市",
					districts: {
						410_402: "新华区",
						410_403: "卫东区",
						410_404: "石龙区",
						410_411: "湛河区",
						410_421: "宝丰县",
						410_422: "叶县",
						410_423: "鲁山县",
						410_425: "郏县",
						410_481: "舞钢市",
						410_482: "汝州市"
					}
				},
				410_500: {
					code: "410500",
					name: "安阳市",
					districts: {
						410_502: "文峰区",
						410_503: "北关区",
						410_505: "殷都区",
						410_506: "龙安区",
						410_522: "安阳县",
						410_523: "汤阴县",
						410_526: "滑县",
						410_527: "内黄县",
						410_581: "林州市"
					}
				},
				410_600: {
					code: "410600",
					name: "鹤壁市",
					districts: {
						410_602: "鹤山区",
						410_603: "山城区",
						410_611: "淇滨区",
						410_621: "浚县",
						410_622: "淇县"
					}
				},
				410_700: {
					code: "410700",
					name: "新乡市",
					districts: {
						410_702: "红旗区",
						410_703: "卫滨区",
						410_704: "凤泉区",
						410_711: "牧野区",
						410_721: "新乡县",
						410_724: "获嘉县",
						410_725: "原阳县",
						410_726: "延津县",
						410_727: "封丘县",
						410_728: "长垣县",
						410_781: "卫辉市",
						410_782: "辉县市"
					}
				},
				410_800: {
					code: "410800",
					name: "焦作市",
					districts: {
						410_802: "解放区",
						410_803: "中站区",
						410_804: "马村区",
						410_811: "山阳区",
						410_821: "修武县",
						410_822: "博爱县",
						410_823: "武陟县",
						410_825: "温县",
						410_882: "沁阳市",
						410_883: "孟州市"
					}
				},
				410_900: {
					code: "410900",
					name: "濮阳市",
					districts: {
						410_902: "华龙区",
						410_922: "清丰县",
						410_923: "南乐县",
						410_926: "范县",
						410_927: "台前县",
						410_928: "濮阳县"
					}
				},
				411_000: {
					code: "411000",
					name: "许昌市",
					districts: {
						411_002: "魏都区",
						411_003: "建安区",
						411_024: "鄢陵县",
						411_025: "襄城县",
						411_081: "禹州市",
						411_082: "长葛市"
					}
				},
				411_100: {
					code: "411100",
					name: "漯河市",
					districts: {
						411_102: "源汇区",
						411_103: "郾城区",
						411_104: "召陵区",
						411_121: "舞阳县",
						411_122: "临颍县"
					}
				},
				411_200: {
					code: "411200",
					name: "三门峡市",
					districts: {
						411_202: "湖滨区",
						411_203: "陕州区",
						411_221: "渑池县",
						411_224: "卢氏县",
						411_281: "义马市",
						411_282: "灵宝市"
					}
				},
				411_300: {
					code: "411300",
					name: "南阳市",
					districts: {
						411_302: "宛城区",
						411_303: "卧龙区",
						411_321: "南召县",
						411_322: "方城县",
						411_323: "西峡县",
						411_324: "镇平县",
						411_325: "内乡县",
						411_326: "淅川县",
						411_327: "社旗县",
						411_328: "唐河县",
						411_329: "新野县",
						411_330: "桐柏县",
						411_381: "邓州市"
					}
				},
				411_400: {
					code: "411400",
					name: "商丘市",
					districts: {
						411_402: "梁园区",
						411_403: "睢阳区",
						411_421: "民权县",
						411_422: "睢县",
						411_423: "宁陵县",
						411_424: "柘城县",
						411_425: "虞城县",
						411_426: "夏邑县",
						411_481: "永城市"
					}
				},
				411_500: {
					code: "411500",
					name: "信阳市",
					districts: {
						411_502: "浉河区",
						411_503: "平桥区",
						411_521: "罗山县",
						411_522: "光山县",
						411_523: "新县",
						411_524: "商城县",
						411_525: "固始县",
						411_526: "潢川县",
						411_527: "淮滨县",
						411_528: "息县"
					}
				},
				411_600: {
					code: "411600",
					name: "周口市",
					districts: {
						411_602: "川汇区",
						411_621: "扶沟县",
						411_622: "西华县",
						411_623: "商水县",
						411_624: "沈丘县",
						411_625: "郸城县",
						411_626: "淮阳县",
						411_627: "太康县",
						411_628: "鹿邑县",
						411_681: "项城市"
					}
				},
				411_700: {
					code: "411700",
					name: "驻马店市",
					districts: {
						411_702: "驿城区",
						411_721: "西平县",
						411_722: "上蔡县",
						411_723: "平舆县",
						411_724: "正阳县",
						411_725: "确山县",
						411_726: "泌阳县",
						411_727: "汝南县",
						411_728: "遂平县",
						411_729: "新蔡县"
					}
				}
			}
		},
		420_000: {
			code: "420000",
			name: "湖北省",
			cities: {
				420_100: {
					code: "420100",
					name: "武汉市",
					districts: {
						420_102: "江岸区",
						420_103: "江汉区",
						420_104: "硚口区",
						420_105: "汉阳区",
						420_106: "武昌区",
						420_107: "青山区",
						420_111: "洪山区",
						420_112: "东西湖区",
						420_113: "汉南区",
						420_114: "蔡甸区",
						420_115: "江夏区",
						420_116: "黄陂区",
						420_117: "新洲区"
					}
				},
				420_200: {
					code: "420200",
					name: "黄石市",
					districts: {
						420_202: "黄石港区",
						420_203: "西塞山区",
						420_204: "下陆区",
						420_205: "铁山区",
						420_222: "阳新县",
						420_281: "大冶市"
					}
				},
				420_300: {
					code: "420300",
					name: "十堰市",
					districts: {
						420_302: "茅箭区",
						420_303: "张湾区",
						420_304: "郧阳区",
						420_322: "郧西县",
						420_323: "竹山县",
						420_324: "竹溪县",
						420_325: "房县",
						420_381: "丹江口市"
					}
				},
				420_500: {
					code: "420500",
					name: "宜昌市",
					districts: {
						420_502: "西陵区",
						420_503: "伍家岗区",
						420_504: "点军区",
						420_505: "猇亭区",
						420_506: "夷陵区",
						420_525: "远安县",
						420_526: "兴山县",
						420_527: "秭归县",
						420_528: "长阳土家族自治县",
						420_529: "五峰土家族自治县",
						420_581: "宜都市",
						420_582: "当阳市",
						420_583: "枝江市"
					}
				},
				420_600: {
					code: "420600",
					name: "襄阳市",
					districts: {
						420_602: "襄城区",
						420_606: "樊城区",
						420_607: "襄州区",
						420_624: "南漳县",
						420_625: "谷城县",
						420_626: "保康县",
						420_682: "老河口市",
						420_683: "枣阳市",
						420_684: "宜城市"
					}
				},
				420_700: {
					code: "420700",
					name: "鄂州市",
					districts: {
						420_702: "梁子湖区",
						420_703: "华容区",
						420_704: "鄂城区"
					}
				},
				420_800: {
					code: "420800",
					name: "荆门市",
					districts: {
						420_802: "东宝区",
						420_804: "掇刀区",
						420_822: "沙洋县",
						420_881: "钟祥市",
						420_882: "京山市"
					}
				},
				420_900: {
					code: "420900",
					name: "孝感市",
					districts: {
						420_902: "孝南区",
						420_921: "孝昌县",
						420_922: "大悟县",
						420_923: "云梦县",
						420_981: "应城市",
						420_982: "安陆市",
						420_984: "汉川市"
					}
				},
				421_000: {
					code: "421000",
					name: "荆州市",
					districts: {
						421_002: "沙市区",
						421_003: "荆州区",
						421_022: "公安县",
						421_023: "监利县",
						421_024: "江陵县",
						421_081: "石首市",
						421_083: "洪湖市",
						421_087: "松滋市"
					}
				},
				421_100: {
					code: "421100",
					name: "黄冈市",
					districts: {
						421_102: "黄州区",
						421_121: "团风县",
						421_122: "红安县",
						421_123: "罗田县",
						421_124: "英山县",
						421_125: "浠水县",
						421_126: "蕲春县",
						421_127: "黄梅县",
						421_181: "麻城市",
						421_182: "武穴市"
					}
				},
				421_200: {
					code: "421200",
					name: "咸宁市",
					districts: {
						421_202: "咸安区",
						421_221: "嘉鱼县",
						421_222: "通城县",
						421_223: "崇阳县",
						421_224: "通山县",
						421_281: "赤壁市"
					}
				},
				421_300: {
					code: "421300",
					name: "随州市",
					districts: {
						421_303: "曾都区",
						421_321: "随县",
						421_381: "广水市"
					}
				},
				422_800: {
					code: "422800",
					name: "恩施土家族苗族自治州",
					districts: {
						422_801: "恩施市",
						422_802: "利川市",
						422_822: "建始县",
						422_823: "巴东县",
						422_825: "宣恩县",
						422_826: "咸丰县",
						422_827: "来凤县",
						422_828: "鹤峰县"
					}
				}
			}
		},
		430_000: {
			code: "430000",
			name: "湖南省",
			cities: {
				430_100: {
					code: "430100",
					name: "长沙市",
					districts: {
						430_102: "芙蓉区",
						430_103: "天心区",
						430_104: "岳麓区",
						430_105: "开福区",
						430_111: "雨花区",
						430_112: "望城区",
						430_121: "长沙县",
						430_181: "浏阳市",
						430_182: "宁乡市"
					}
				},
				430_200: {
					code: "430200",
					name: "株洲市",
					districts: {
						430_202: "荷塘区",
						430_203: "芦淞区",
						430_204: "石峰区",
						430_211: "天元区",
						430_212: "渌口区",
						430_223: "攸县",
						430_224: "茶陵县",
						430_225: "炎陵县",
						430_281: "醴陵市"
					}
				},
				430_300: {
					code: "430300",
					name: "湘潭市",
					districts: {
						430_302: "雨湖区",
						430_304: "岳塘区",
						430_321: "湘潭县",
						430_381: "湘乡市",
						430_382: "韶山市"
					}
				},
				430_400: {
					code: "430400",
					name: "衡阳市",
					districts: {
						430_405: "珠晖区",
						430_406: "雁峰区",
						430_407: "石鼓区",
						430_408: "蒸湘区",
						430_412: "南岳区",
						430_421: "衡阳县",
						430_422: "衡南县",
						430_423: "衡山县",
						430_424: "衡东县",
						430_426: "祁东县",
						430_481: "耒阳市",
						430_482: "常宁市"
					}
				},
				430_500: {
					code: "430500",
					name: "邵阳市",
					districts: {
						430_502: "双清区",
						430_503: "大祥区",
						430_511: "北塔区",
						430_521: "邵东县",
						430_522: "新邵县",
						430_523: "邵阳县",
						430_524: "隆回县",
						430_525: "洞口县",
						430_527: "绥宁县",
						430_528: "新宁县",
						430_529: "城步苗族自治县",
						430_581: "武冈市"
					}
				},
				430_600: {
					code: "430600",
					name: "岳阳市",
					districts: {
						430_602: "岳阳楼区",
						430_603: "云溪区",
						430_611: "君山区",
						430_621: "岳阳县",
						430_623: "华容县",
						430_624: "湘阴县",
						430_626: "平江县",
						430_681: "汨罗市",
						430_682: "临湘市"
					}
				},
				430_700: {
					code: "430700",
					name: "常德市",
					districts: {
						430_702: "武陵区",
						430_703: "鼎城区",
						430_721: "安乡县",
						430_722: "汉寿县",
						430_723: "澧县",
						430_724: "临澧县",
						430_725: "桃源县",
						430_726: "石门县",
						430_781: "津市市"
					}
				},
				430_800: {
					code: "430800",
					name: "张家界市",
					districts: {
						430_802: "永定区",
						430_811: "武陵源区",
						430_821: "慈利县",
						430_822: "桑植县"
					}
				},
				430_900: {
					code: "430900",
					name: "益阳市",
					districts: {
						430_902: "资阳区",
						430_903: "赫山区",
						430_921: "南县",
						430_922: "桃江县",
						430_923: "安化县",
						430_981: "沅江市"
					}
				},
				431_000: {
					code: "431000",
					name: "郴州市",
					districts: {
						431_002: "北湖区",
						431_003: "苏仙区",
						431_021: "桂阳县",
						431_022: "宜章县",
						431_023: "永兴县",
						431_024: "嘉禾县",
						431_025: "临武县",
						431_026: "汝城县",
						431_027: "桂东县",
						431_028: "安仁县",
						431_081: "资兴市"
					}
				},
				431_100: {
					code: "431100",
					name: "永州市",
					districts: {
						431_102: "零陵区",
						431_103: "冷水滩区",
						431_121: "祁阳县",
						431_122: "东安县",
						431_123: "双牌县",
						431_124: "道县",
						431_125: "江永县",
						431_126: "宁远县",
						431_127: "蓝山县",
						431_128: "新田县",
						431_129: "江华瑶族自治县"
					}
				},
				431_200: {
					code: "431200",
					name: "怀化市",
					districts: {
						431_202: "鹤城区",
						431_221: "中方县",
						431_222: "沅陵县",
						431_223: "辰溪县",
						431_224: "溆浦县",
						431_225: "会同县",
						431_226: "麻阳苗族自治县",
						431_227: "新晃侗族自治县",
						431_228: "芷江侗族自治县",
						431_229: "靖州苗族侗族自治县",
						431_230: "通道侗族自治县",
						431_281: "洪江市"
					}
				},
				431_300: {
					code: "431300",
					name: "娄底市",
					districts: {
						431_302: "娄星区",
						431_321: "双峰县",
						431_322: "新化县",
						431_381: "冷水江市",
						431_382: "涟源市"
					}
				},
				433_100: {
					code: "433100",
					name: "湘西土家族苗族自治州",
					districts: {
						433_101: "吉首市",
						433_122: "泸溪县",
						433_123: "凤凰县",
						433_124: "花垣县",
						433_125: "保靖县",
						433_126: "古丈县",
						433_127: "永顺县",
						433_130: "龙山县"
					}
				}
			}
		},
		440_000: {
			code: "440000",
			name: "广东省",
			cities: {
				440_100: {
					code: "440100",
					name: "广州市",
					districts: {
						440_103: "荔湾区",
						440_104: "越秀区",
						440_105: "海珠区",
						440_106: "天河区",
						440_111: "白云区",
						440_112: "黄埔区",
						440_113: "番禺区",
						440_114: "花都区",
						440_115: "南沙区",
						440_117: "从化区",
						440_118: "增城区"
					}
				},
				440_200: {
					code: "440200",
					name: "韶关市",
					districts: {
						440_203: "武江区",
						440_204: "浈江区",
						440_205: "曲江区",
						440_222: "始兴县",
						440_224: "仁化县",
						440_229: "翁源县",
						440_232: "乳源瑶族自治县",
						440_233: "新丰县",
						440_281: "乐昌市",
						440_282: "南雄市"
					}
				},
				440_300: {
					code: "440300",
					name: "深圳市",
					districts: {
						440_303: "罗湖区",
						440_304: "福田区",
						440_305: "南山区",
						440_306: "宝安区",
						440_307: "龙岗区",
						440_308: "盐田区",
						440_309: "龙华区",
						440_310: "坪山区",
						440_311: "光明区"
					}
				},
				440_400: {
					code: "440400",
					name: "珠海市",
					districts: {
						440_402: "香洲区",
						440_403: "斗门区",
						440_404: "金湾区"
					}
				},
				440_500: {
					code: "440500",
					name: "汕头市",
					districts: {
						440_507: "龙湖区",
						440_511: "金平区",
						440_512: "濠江区",
						440_513: "潮阳区",
						440_514: "潮南区",
						440_515: "澄海区",
						440_523: "南澳县"
					}
				},
				440_600: {
					code: "440600",
					name: "佛山市",
					districts: {
						440_604: "禅城区",
						440_605: "南海区",
						440_606: "顺德区",
						440_607: "三水区",
						440_608: "高明区"
					}
				},
				440_700: {
					code: "440700",
					name: "江门市",
					districts: {
						440_703: "蓬江区",
						440_704: "江海区",
						440_705: "新会区",
						440_781: "台山市",
						440_783: "开平市",
						440_784: "鹤山市",
						440_785: "恩平市"
					}
				},
				440_800: {
					code: "440800",
					name: "湛江市",
					districts: {
						440_802: "赤坎区",
						440_803: "霞山区",
						440_804: "坡头区",
						440_811: "麻章区",
						440_823: "遂溪县",
						440_825: "徐闻县",
						440_881: "廉江市",
						440_882: "雷州市",
						440_883: "吴川市"
					}
				},
				440_900: {
					code: "440900",
					name: "茂名市",
					districts: {
						440_902: "茂南区",
						440_904: "电白区",
						440_981: "高州市",
						440_982: "化州市",
						440_983: "信宜市"
					}
				},
				441_200: {
					code: "441200",
					name: "肇庆市",
					districts: {
						441_202: "端州区",
						441_203: "鼎湖区",
						441_204: "高要区",
						441_223: "广宁县",
						441_224: "怀集县",
						441_225: "封开县",
						441_226: "德庆县",
						441_284: "四会市"
					}
				},
				441_300: {
					code: "441300",
					name: "惠州市",
					districts: {
						441_302: "惠城区",
						441_303: "惠阳区",
						441_322: "博罗县",
						441_323: "惠东县",
						441_324: "龙门县"
					}
				},
				441_400: {
					code: "441400",
					name: "梅州市",
					districts: {
						441_402: "梅江区",
						441_403: "梅县区",
						441_422: "大埔县",
						441_423: "丰顺县",
						441_424: "五华县",
						441_426: "平远县",
						441_427: "蕉岭县",
						441_481: "兴宁市"
					}
				},
				441_500: {
					code: "441500",
					name: "汕尾市",
					districts: {
						441_502: "城区",
						441_521: "海丰县",
						441_523: "陆河县",
						441_581: "陆丰市"
					}
				},
				441_600: {
					code: "441600",
					name: "河源市",
					districts: {
						441_602: "源城区",
						441_621: "紫金县",
						441_622: "龙川县",
						441_623: "连平县",
						441_624: "和平县",
						441_625: "东源县"
					}
				},
				441_700: {
					code: "441700",
					name: "阳江市",
					districts: {
						441_702: "江城区",
						441_704: "阳东区",
						441_721: "阳西县",
						441_781: "阳春市"
					}
				},
				441_800: {
					code: "441800",
					name: "清远市",
					districts: {
						441_802: "清城区",
						441_803: "清新区",
						441_821: "佛冈县",
						441_823: "阳山县",
						441_825: "连山壮族瑶族自治县",
						441_826: "连南瑶族自治县",
						441_881: "英德市",
						441_882: "连州市"
					}
				},
				441_900: {
					code: "441900",
					name: "东莞市",
					districts: {
					}
				},
				442_000: {
					code: "442000",
					name: "中山市",
					districts: {
					}
				},
				445_100: {
					code: "445100",
					name: "潮州市",
					districts: {
						445_102: "湘桥区",
						445_103: "潮安区",
						445_122: "饶平县"
					}
				},
				445_200: {
					code: "445200",
					name: "揭阳市",
					districts: {
						445_202: "榕城区",
						445_203: "揭东区",
						445_222: "揭西县",
						445_224: "惠来县",
						445_281: "普宁市"
					}
				},
				445_300: {
					code: "445300",
					name: "云浮市",
					districts: {
						445_302: "云城区",
						445_303: "云安区",
						445_321: "新兴县",
						445_322: "郁南县",
						445_381: "罗定市"
					}
				}
			}
		},
		450_000: {
			code: "450000",
			name: "广西壮族自治区",
			cities: {
				450_100: {
					code: "450100",
					name: "南宁市",
					districts: {
						450_102: "兴宁区",
						450_103: "青秀区",
						450_105: "江南区",
						450_107: "西乡塘区",
						450_108: "良庆区",
						450_109: "邕宁区",
						450_110: "武鸣区",
						450_123: "隆安县",
						450_124: "马山县",
						450_125: "上林县",
						450_126: "宾阳县",
						450_127: "横县"
					}
				},
				450_200: {
					code: "450200",
					name: "柳州市",
					districts: {
						450_202: "城中区",
						450_203: "鱼峰区",
						450_204: "柳南区",
						450_205: "柳北区",
						450_206: "柳江区",
						450_222: "柳城县",
						450_223: "鹿寨县",
						450_224: "融安县",
						450_225: "融水苗族自治县",
						450_226: "三江侗族自治县"
					}
				},
				450_300: {
					code: "450300",
					name: "桂林市",
					districts: {
						450_302: "秀峰区",
						450_303: "叠彩区",
						450_304: "象山区",
						450_305: "七星区",
						450_311: "雁山区",
						450_312: "临桂区",
						450_321: "阳朔县",
						450_323: "灵川县",
						450_324: "全州县",
						450_325: "兴安县",
						450_326: "永福县",
						450_327: "灌阳县",
						450_328: "龙胜各族自治县",
						450_329: "资源县",
						450_330: "平乐县",
						450_332: "恭城瑶族自治县",
						450_381: "荔浦市"
					}
				},
				450_400: {
					code: "450400",
					name: "梧州市",
					districts: {
						450_403: "万秀区",
						450_405: "长洲区",
						450_406: "龙圩区",
						450_421: "苍梧县",
						450_422: "藤县",
						450_423: "蒙山县",
						450_481: "岑溪市"
					}
				},
				450_500: {
					code: "450500",
					name: "北海市",
					districts: {
						450_502: "海城区",
						450_503: "银海区",
						450_512: "铁山港区",
						450_521: "合浦县"
					}
				},
				450_600: {
					code: "450600",
					name: "防城港市",
					districts: {
						450_602: "港口区",
						450_603: "防城区",
						450_621: "上思县",
						450_681: "东兴市"
					}
				},
				450_700: {
					code: "450700",
					name: "钦州市",
					districts: {
						450_702: "钦南区",
						450_703: "钦北区",
						450_721: "灵山县",
						450_722: "浦北县"
					}
				},
				450_800: {
					code: "450800",
					name: "贵港市",
					districts: {
						450_802: "港北区",
						450_803: "港南区",
						450_804: "覃塘区",
						450_821: "平南县",
						450_881: "桂平市"
					}
				},
				450_900: {
					code: "450900",
					name: "玉林市",
					districts: {
						450_902: "玉州区",
						450_903: "福绵区",
						450_921: "容县",
						450_922: "陆川县",
						450_923: "博白县",
						450_924: "兴业县",
						450_981: "北流市"
					}
				},
				451_000: {
					code: "451000",
					name: "百色市",
					districts: {
						451_002: "右江区",
						451_021: "田阳县",
						451_022: "田东县",
						451_023: "平果县",
						451_024: "德保县",
						451_026: "那坡县",
						451_027: "凌云县",
						451_028: "乐业县",
						451_029: "田林县",
						451_030: "西林县",
						451_031: "隆林各族自治县",
						451_081: "靖西市"
					}
				},
				451_100: {
					code: "451100",
					name: "贺州市",
					districts: {
						451_102: "八步区",
						451_103: "平桂区",
						451_121: "昭平县",
						451_122: "钟山县",
						451_123: "富川瑶族自治县"
					}
				},
				451_200: {
					code: "451200",
					name: "河池市",
					districts: {
						451_202: "金城江区",
						451_203: "宜州区",
						451_221: "南丹县",
						451_222: "天峨县",
						451_223: "凤山县",
						451_224: "东兰县",
						451_225: "罗城仫佬族自治县",
						451_226: "环江毛南族自治县",
						451_227: "巴马瑶族自治县",
						451_228: "都安瑶族自治县",
						451_229: "大化瑶族自治县"
					}
				},
				451_300: {
					code: "451300",
					name: "来宾市",
					districts: {
						451_302: "兴宾区",
						451_321: "忻城县",
						451_322: "象州县",
						451_323: "武宣县",
						451_324: "金秀瑶族自治县",
						451_381: "合山市"
					}
				},
				451_400: {
					code: "451400",
					name: "崇左市",
					districts: {
						451_402: "江州区",
						451_421: "扶绥县",
						451_422: "宁明县",
						451_423: "龙州县",
						451_424: "大新县",
						451_425: "天等县",
						451_481: "凭祥市"
					}
				}
			}
		},
		460_000: {
			code: "460000",
			name: "海南省",
			cities: {
				460_100: {
					code: "460100",
					name: "海口市",
					districts: {
						460_105: "秀英区",
						460_106: "龙华区",
						460_107: "琼山区",
						460_108: "美兰区"
					}
				},
				460_200: {
					code: "460200",
					name: "三亚市",
					districts: {
						460_202: "海棠区",
						460_203: "吉阳区",
						460_204: "天涯区",
						460_205: "崖州区"
					}
				},
				460_300: {
					code: "460300",
					name: "三沙市",
					districts: {
						460_321: "西沙群岛",
						460_322: "南沙群岛",
						460_323: "中沙群岛的岛礁及其海域",
						460_324: "永乐群岛"
					}
				},
				460_400: {
					code: "460400",
					name: "儋州市",
					districts: {
					}
				}
			}
		},
		500_000: {
			code: "500000",
			name: "重庆市",
			cities: {
				500_000: {
					code: "500000",
					name: "重庆市",
					districts: {
						500_101: "万州区",
						500_102: "涪陵区",
						500_103: "渝中区",
						500_104: "大渡口区",
						500_105: "江北区",
						500_106: "沙坪坝区",
						500_107: "九龙坡区",
						500_108: "南岸区",
						500_109: "北碚区",
						500_110: "綦江区",
						500_111: "大足区",
						500_112: "渝北区",
						500_113: "巴南区",
						500_114: "黔江区",
						500_115: "长寿区",
						500_116: "江津区",
						500_117: "合川区",
						500_118: "永川区",
						500_119: "南川区",
						500_120: "璧山区",
						500_151: "铜梁区",
						500_152: "潼南区",
						500_153: "荣昌区",
						500_154: "开州区",
						500_155: "梁平区",
						500_156: "武隆区",
						500_229: "城口县",
						500_230: "丰都县",
						500_231: "垫江县",
						500_233: "忠县",
						500_235: "云阳县",
						500_236: "奉节县",
						500_237: "巫山县",
						500_238: "巫溪县",
						500_240: "石柱土家族自治县",
						500_241: "秀山土家族苗族自治县",
						500_242: "酉阳土家族苗族自治县",
						500_243: "彭水苗族土家族自治县"
					}
				}
			}
		},
		510_000: {
			code: "510000",
			name: "四川省",
			cities: {
				510_100: {
					code: "510100",
					name: "成都市",
					districts: {
						510_104: "锦江区",
						510_105: "青羊区",
						510_106: "金牛区",
						510_107: "武侯区",
						510_108: "成华区",
						510_112: "龙泉驿区",
						510_113: "青白江区",
						510_114: "新都区",
						510_115: "温江区",
						510_116: "双流区",
						510_117: "郫都区",
						510_121: "金堂县",
						510_129: "大邑县",
						510_131: "蒲江县",
						510_132: "新津县",
						510_181: "都江堰市",
						510_182: "彭州市",
						510_183: "邛崃市",
						510_184: "崇州市",
						510_185: "简阳市"
					}
				},
				510_300: {
					code: "510300",
					name: "自贡市",
					districts: {
						510_302: "自流井区",
						510_303: "贡井区",
						510_304: "大安区",
						510_311: "沿滩区",
						510_321: "荣县",
						510_322: "富顺县"
					}
				},
				510_400: {
					code: "510400",
					name: "攀枝花市",
					districts: {
						510_402: "东区",
						510_403: "西区",
						510_411: "仁和区",
						510_421: "米易县",
						510_422: "盐边县"
					}
				},
				510_500: {
					code: "510500",
					name: "泸州市",
					districts: {
						510_502: "江阳区",
						510_503: "纳溪区",
						510_504: "龙马潭区",
						510_521: "泸县",
						510_522: "合江县",
						510_524: "叙永县",
						510_525: "古蔺县"
					}
				},
				510_600: {
					code: "510600",
					name: "德阳市",
					districts: {
						510_603: "旌阳区",
						510_604: "罗江区",
						510_623: "中江县",
						510_681: "广汉市",
						510_682: "什邡市",
						510_683: "绵竹市"
					}
				},
				510_700: {
					code: "510700",
					name: "绵阳市",
					districts: {
						510_703: "涪城区",
						510_704: "游仙区",
						510_705: "安州区",
						510_722: "三台县",
						510_723: "盐亭县",
						510_725: "梓潼县",
						510_726: "北川羌族自治县",
						510_727: "平武县",
						510_781: "江油市"
					}
				},
				510_800: {
					code: "510800",
					name: "广元市",
					districts: {
						510_802: "利州区",
						510_811: "昭化区",
						510_812: "朝天区",
						510_821: "旺苍县",
						510_822: "青川县",
						510_823: "剑阁县",
						510_824: "苍溪县"
					}
				},
				510_900: {
					code: "510900",
					name: "遂宁市",
					districts: {
						510_903: "船山区",
						510_904: "安居区",
						510_921: "蓬溪县",
						510_922: "射洪县",
						510_923: "大英县"
					}
				},
				511_000: {
					code: "511000",
					name: "内江市",
					districts: {
						511_002: "市中区",
						511_011: "东兴区",
						511_024: "威远县",
						511_025: "资中县",
						511_083: "隆昌市"
					}
				},
				511_100: {
					code: "511100",
					name: "乐山市",
					districts: {
						511_102: "市中区",
						511_111: "沙湾区",
						511_112: "五通桥区",
						511_113: "金口河区",
						511_123: "犍为县",
						511_124: "井研县",
						511_126: "夹江县",
						511_129: "沐川县",
						511_132: "峨边彝族自治县",
						511_133: "马边彝族自治县",
						511_181: "峨眉山市"
					}
				},
				511_300: {
					code: "511300",
					name: "南充市",
					districts: {
						511_302: "顺庆区",
						511_303: "高坪区",
						511_304: "嘉陵区",
						511_321: "南部县",
						511_322: "营山县",
						511_323: "蓬安县",
						511_324: "仪陇县",
						511_325: "西充县",
						511_381: "阆中市"
					}
				},
				511_400: {
					code: "511400",
					name: "眉山市",
					districts: {
						511_402: "东坡区",
						511_403: "彭山区",
						511_421: "仁寿县",
						511_423: "洪雅县",
						511_424: "丹棱县",
						511_425: "青神县"
					}
				},
				511_500: {
					code: "511500",
					name: "宜宾市",
					districts: {
						511_502: "翠屏区",
						511_503: "南溪区",
						511_504: "叙州区",
						511_523: "江安县",
						511_524: "长宁县",
						511_525: "高县",
						511_526: "珙县",
						511_527: "筠连县",
						511_528: "兴文县",
						511_529: "屏山县"
					}
				},
				511_600: {
					code: "511600",
					name: "广安市",
					districts: {
						511_602: "广安区",
						511_603: "前锋区",
						511_621: "岳池县",
						511_622: "武胜县",
						511_623: "邻水县",
						511_681: "华蓥市"
					}
				},
				511_700: {
					code: "511700",
					name: "达州市",
					districts: {
						511_702: "通川区",
						511_703: "达川区",
						511_722: "宣汉县",
						511_723: "开江县",
						511_724: "大竹县",
						511_725: "渠县",
						511_781: "万源市"
					}
				},
				511_800: {
					code: "511800",
					name: "雅安市",
					districts: {
						511_802: "雨城区",
						511_803: "名山区",
						511_822: "荥经县",
						511_823: "汉源县",
						511_824: "石棉县",
						511_825: "天全县",
						511_826: "芦山县",
						511_827: "宝兴县"
					}
				},
				511_900: {
					code: "511900",
					name: "巴中市",
					districts: {
						511_902: "巴州区",
						511_903: "恩阳区",
						511_921: "通江县",
						511_922: "南江县",
						511_923: "平昌县"
					}
				},
				512_000: {
					code: "512000",
					name: "资阳市",
					districts: {
						512_002: "雁江区",
						512_021: "安岳县",
						512_022: "乐至县"
					}
				},
				513_200: {
					code: "513200",
					name: "阿坝藏族羌族自治州",
					districts: {
						513_201: "马尔康市",
						513_221: "汶川县",
						513_222: "理县",
						513_223: "茂县",
						513_224: "松潘县",
						513_225: "九寨沟县",
						513_226: "金川县",
						513_227: "小金县",
						513_228: "黑水县",
						513_230: "壤塘县",
						513_231: "阿坝县",
						513_232: "若尔盖县",
						513_233: "红原县"
					}
				},
				513_300: {
					code: "513300",
					name: "甘孜藏族自治州",
					districts: {
						513_301: "康定市",
						513_322: "泸定县",
						513_323: "丹巴县",
						513_324: "九龙县",
						513_325: "雅江县",
						513_326: "道孚县",
						513_327: "炉霍县",
						513_328: "甘孜县",
						513_329: "新龙县",
						513_330: "德格县",
						513_331: "白玉县",
						513_332: "石渠县",
						513_333: "色达县",
						513_334: "理塘县",
						513_335: "巴塘县",
						513_336: "乡城县",
						513_337: "稻城县",
						513_338: "得荣县"
					}
				},
				513_400: {
					code: "513400",
					name: "凉山彝族自治州",
					districts: {
						513_401: "西昌市",
						513_422: "木里藏族自治县",
						513_423: "盐源县",
						513_424: "德昌县",
						513_425: "会理县",
						513_426: "会东县",
						513_427: "宁南县",
						513_428: "普格县",
						513_429: "布拖县",
						513_430: "金阳县",
						513_431: "昭觉县",
						513_432: "喜德县",
						513_433: "冕宁县",
						513_434: "越西县",
						513_435: "甘洛县",
						513_436: "美姑县",
						513_437: "雷波县"
					}
				}
			}
		},
		520_000: {
			code: "520000",
			name: "贵州省",
			cities: {
				520_100: {
					code: "520100",
					name: "贵阳市",
					districts: {
						520_102: "南明区",
						520_103: "云岩区",
						520_111: "花溪区",
						520_112: "乌当区",
						520_113: "白云区",
						520_115: "观山湖区",
						520_121: "开阳县",
						520_122: "息烽县",
						520_123: "修文县",
						520_181: "清镇市"
					}
				},
				520_200: {
					code: "520200",
					name: "六盘水市",
					districts: {
						520_201: "钟山区",
						520_203: "六枝特区",
						520_221: "水城县",
						520_281: "盘州市"
					}
				},
				520_300: {
					code: "520300",
					name: "遵义市",
					districts: {
						520_302: "红花岗区",
						520_303: "汇川区",
						520_304: "播州区",
						520_322: "桐梓县",
						520_323: "绥阳县",
						520_324: "正安县",
						520_325: "道真仡佬族苗族自治县",
						520_326: "务川仡佬族苗族自治县",
						520_327: "凤冈县",
						520_328: "湄潭县",
						520_329: "余庆县",
						520_330: "习水县",
						520_381: "赤水市",
						520_382: "仁怀市"
					}
				},
				520_400: {
					code: "520400",
					name: "安顺市",
					districts: {
						520_402: "西秀区",
						520_403: "平坝区",
						520_422: "普定县",
						520_423: "镇宁布依族苗族自治县",
						520_424: "关岭布依族苗族自治县",
						520_425: "紫云苗族布依族自治县"
					}
				},
				520_500: {
					code: "520500",
					name: "毕节市",
					districts: {
						520_502: "七星关区",
						520_521: "大方县",
						520_522: "黔西县",
						520_523: "金沙县",
						520_524: "织金县",
						520_525: "纳雍县",
						520_526: "威宁彝族回族苗族自治县",
						520_527: "赫章县"
					}
				},
				520_600: {
					code: "520600",
					name: "铜仁市",
					districts: {
						520_602: "碧江区",
						520_603: "万山区",
						520_621: "江口县",
						520_622: "玉屏侗族自治县",
						520_623: "石阡县",
						520_624: "思南县",
						520_625: "印江土家族苗族自治县",
						520_626: "德江县",
						520_627: "沿河土家族自治县",
						520_628: "松桃苗族自治县"
					}
				},
				522_300: {
					code: "522300",
					name: "黔西南布依族苗族自治州",
					districts: {
						522_301: "兴义市",
						522_302: "兴仁市",
						522_323: "普安县",
						522_324: "晴隆县",
						522_325: "贞丰县",
						522_326: "望谟县",
						522_327: "册亨县",
						522_328: "安龙县"
					}
				},
				522_600: {
					code: "522600",
					name: "黔东南苗族侗族自治州",
					districts: {
						522_601: "凯里市",
						522_622: "黄平县",
						522_623: "施秉县",
						522_624: "三穗县",
						522_625: "镇远县",
						522_626: "岑巩县",
						522_627: "天柱县",
						522_628: "锦屏县",
						522_629: "剑河县",
						522_630: "台江县",
						522_631: "黎平县",
						522_632: "榕江县",
						522_633: "从江县",
						522_634: "雷山县",
						522_635: "麻江县",
						522_636: "丹寨县"
					}
				},
				522_700: {
					code: "522700",
					name: "黔南布依族苗族自治州",
					districts: {
						522_701: "都匀市",
						522_702: "福泉市",
						522_722: "荔波县",
						522_723: "贵定县",
						522_725: "瓮安县",
						522_726: "独山县",
						522_727: "平塘县",
						522_728: "罗甸县",
						522_729: "长顺县",
						522_730: "龙里县",
						522_731: "惠水县",
						522_732: "三都水族自治县"
					}
				}
			}
		},
		530_000: {
			code: "530000",
			name: "云南省",
			cities: {
				530_100: {
					code: "530100",
					name: "昆明市",
					districts: {
						530_102: "五华区",
						530_103: "盘龙区",
						530_111: "官渡区",
						530_112: "西山区",
						530_113: "东川区",
						530_114: "呈贡区",
						530_115: "晋宁区",
						530_124: "富民县",
						530_125: "宜良县",
						530_126: "石林彝族自治县",
						530_127: "嵩明县",
						530_128: "禄劝彝族苗族自治县",
						530_129: "寻甸回族彝族自治县",
						530_181: "安宁市"
					}
				},
				530_300: {
					code: "530300",
					name: "曲靖市",
					districts: {
						530_302: "麒麟区",
						530_303: "沾益区",
						530_304: "马龙区",
						530_322: "陆良县",
						530_323: "师宗县",
						530_324: "罗平县",
						530_325: "富源县",
						530_326: "会泽县",
						530_381: "宣威市"
					}
				},
				530_400: {
					code: "530400",
					name: "玉溪市",
					districts: {
						530_402: "红塔区",
						530_403: "江川区",
						530_422: "澄江县",
						530_423: "通海县",
						530_424: "华宁县",
						530_425: "易门县",
						530_426: "峨山彝族自治县",
						530_427: "新平彝族傣族自治县",
						530_428: "元江哈尼族彝族傣族自治县"
					}
				},
				530_500: {
					code: "530500",
					name: "保山市",
					districts: {
						530_502: "隆阳区",
						530_521: "施甸县",
						530_523: "龙陵县",
						530_524: "昌宁县",
						530_581: "腾冲市"
					}
				},
				530_600: {
					code: "530600",
					name: "昭通市",
					districts: {
						530_602: "昭阳区",
						530_621: "鲁甸县",
						530_622: "巧家县",
						530_623: "盐津县",
						530_624: "大关县",
						530_625: "永善县",
						530_626: "绥江县",
						530_627: "镇雄县",
						530_628: "彝良县",
						530_629: "威信县",
						530_681: "水富市"
					}
				},
				530_700: {
					code: "530700",
					name: "丽江市",
					districts: {
						530_702: "古城区",
						530_721: "玉龙纳西族自治县",
						530_722: "永胜县",
						530_723: "华坪县",
						530_724: "宁蒗彝族自治县"
					}
				},
				530_800: {
					code: "530800",
					name: "普洱市",
					districts: {
						530_802: "思茅区",
						530_821: "宁洱哈尼族彝族自治县",
						530_822: "墨江哈尼族自治县",
						530_823: "景东彝族自治县",
						530_824: "景谷傣族彝族自治县",
						530_825: "镇沅彝族哈尼族拉祜族自治县",
						530_826: "江城哈尼族彝族自治县",
						530_827: "孟连傣族拉祜族佤族自治县",
						530_828: "澜沧拉祜族自治县",
						530_829: "西盟佤族自治县"
					}
				},
				530_900: {
					code: "530900",
					name: "临沧市",
					districts: {
						530_902: "临翔区",
						530_921: "凤庆县",
						530_922: "云县",
						530_923: "永德县",
						530_924: "镇康县",
						530_925: "双江拉祜族佤族布朗族傣族自治县",
						530_926: "耿马傣族佤族自治县",
						530_927: "沧源佤族自治县"
					}
				},
				532_300: {
					code: "532300",
					name: "楚雄彝族自治州",
					districts: {
						532_301: "楚雄市",
						532_322: "双柏县",
						532_323: "牟定县",
						532_324: "南华县",
						532_325: "姚安县",
						532_326: "大姚县",
						532_327: "永仁县",
						532_328: "元谋县",
						532_329: "武定县",
						532_331: "禄丰县"
					}
				},
				532_500: {
					code: "532500",
					name: "红河哈尼族彝族自治州",
					districts: {
						532_501: "个旧市",
						532_502: "开远市",
						532_503: "蒙自市",
						532_504: "弥勒市",
						532_523: "屏边苗族自治县",
						532_524: "建水县",
						532_525: "石屏县",
						532_527: "泸西县",
						532_528: "元阳县",
						532_529: "红河县",
						532_530: "金平苗族瑶族傣族自治县",
						532_531: "绿春县",
						532_532: "河口瑶族自治县"
					}
				},
				532_600: {
					code: "532600",
					name: "文山壮族苗族自治州",
					districts: {
						532_601: "文山市",
						532_622: "砚山县",
						532_623: "西畴县",
						532_624: "麻栗坡县",
						532_625: "马关县",
						532_626: "丘北县",
						532_627: "广南县",
						532_628: "富宁县"
					}
				},
				532_800: {
					code: "532800",
					name: "西双版纳傣族自治州",
					districts: {
						532_801: "景洪市",
						532_822: "勐海县",
						532_823: "勐腊县"
					}
				},
				532_900: {
					code: "532900",
					name: "大理白族自治州",
					districts: {
						532_901: "大理市",
						532_922: "漾濞彝族自治县",
						532_923: "祥云县",
						532_924: "宾川县",
						532_925: "弥渡县",
						532_926: "南涧彝族自治县",
						532_927: "巍山彝族回族自治县",
						532_928: "永平县",
						532_929: "云龙县",
						532_930: "洱源县",
						532_931: "剑川县",
						532_932: "鹤庆县"
					}
				},
				533_100: {
					code: "533100",
					name: "德宏傣族景颇族自治州",
					districts: {
						533_102: "瑞丽市",
						533_103: "芒市",
						533_122: "梁河县",
						533_123: "盈江县",
						533_124: "陇川县"
					}
				},
				533_300: {
					code: "533300",
					name: "怒江傈僳族自治州",
					districts: {
						533_301: "泸水市",
						533_323: "福贡县",
						533_324: "贡山独龙族怒族自治县",
						533_325: "兰坪白族普米族自治县"
					}
				},
				533_400: {
					code: "533400",
					name: "迪庆藏族自治州",
					districts: {
						533_401: "香格里拉市",
						533_422: "德钦县",
						533_423: "维西傈僳族自治县"
					}
				}
			}
		},
		540_000: {
			code: "540000",
			name: "西藏自治区",
			cities: {
				540_100: {
					code: "540100",
					name: "拉萨市",
					districts: {
						540_102: "城关区",
						540_103: "堆龙德庆区",
						540_104: "达孜区",
						540_121: "林周县",
						540_122: "当雄县",
						540_123: "尼木县",
						540_124: "曲水县",
						540_127: "墨竹工卡县"
					}
				},
				540_200: {
					code: "540200",
					name: "日喀则市",
					districts: {
						540_202: "桑珠孜区",
						540_221: "南木林县",
						540_222: "江孜县",
						540_223: "定日县",
						540_224: "萨迦县",
						540_225: "拉孜县",
						540_226: "昂仁县",
						540_227: "谢通门县",
						540_228: "白朗县",
						540_229: "仁布县",
						540_230: "康马县",
						540_231: "定结县",
						540_232: "仲巴县",
						540_233: "亚东县",
						540_234: "吉隆县",
						540_235: "聂拉木县",
						540_236: "萨嘎县",
						540_237: "岗巴县"
					}
				},
				540_300: {
					code: "540300",
					name: "昌都市",
					districts: {
						540_302: "卡若区",
						540_321: "江达县",
						540_322: "贡觉县",
						540_323: "类乌齐县",
						540_324: "丁青县",
						540_325: "察雅县",
						540_326: "八宿县",
						540_327: "左贡县",
						540_328: "芒康县",
						540_329: "洛隆县",
						540_330: "边坝县"
					}
				},
				540_400: {
					code: "540400",
					name: "林芝市",
					districts: {
						540_402: "巴宜区",
						540_421: "工布江达县",
						540_422: "米林县",
						540_423: "墨脱县",
						540_424: "波密县",
						540_425: "察隅县",
						540_426: "朗县"
					}
				},
				540_500: {
					code: "540500",
					name: "山南市",
					districts: {
						540_502: "乃东区",
						540_521: "扎囊县",
						540_522: "贡嘎县",
						540_523: "桑日县",
						540_524: "琼结县",
						540_525: "曲松县",
						540_526: "措美县",
						540_527: "洛扎县",
						540_528: "加查县",
						540_529: "隆子县",
						540_530: "错那县",
						540_531: "浪卡子县"
					}
				},
				540_600: {
					code: "540600",
					name: "那曲市",
					districts: {
						540_602: "色尼区",
						540_621: "嘉黎县",
						540_622: "比如县",
						540_623: "聂荣县",
						540_624: "安多县",
						540_625: "申扎县",
						540_626: "索县",
						540_627: "班戈县",
						540_628: "巴青县",
						540_629: "尼玛县",
						540_630: "双湖县"
					}
				},
				542_500: {
					code: "542500",
					name: "阿里地区",
					districts: {
						542_521: "普兰县",
						542_522: "札达县",
						542_523: "噶尔县",
						542_524: "日土县",
						542_525: "革吉县",
						542_526: "改则县",
						542_527: "措勤县"
					}
				}
			}
		},
		610_000: {
			code: "610000",
			name: "陕西省",
			cities: {
				610_100: {
					code: "610100",
					name: "西安市",
					districts: {
						610_102: "新城区",
						610_103: "碑林区",
						610_104: "莲湖区",
						610_111: "灞桥区",
						610_112: "未央区",
						610_113: "雁塔区",
						610_114: "阎良区",
						610_115: "临潼区",
						610_116: "长安区",
						610_117: "高陵区",
						610_118: "鄠邑区",
						610_122: "蓝田县",
						610_124: "周至县"
					}
				},
				610_200: {
					code: "610200",
					name: "铜川市",
					districts: {
						610_202: "王益区",
						610_203: "印台区",
						610_204: "耀州区",
						610_222: "宜君县"
					}
				},
				610_300: {
					code: "610300",
					name: "宝鸡市",
					districts: {
						610_302: "渭滨区",
						610_303: "金台区",
						610_304: "陈仓区",
						610_322: "凤翔县",
						610_323: "岐山县",
						610_324: "扶风县",
						610_326: "眉县",
						610_327: "陇县",
						610_328: "千阳县",
						610_329: "麟游县",
						610_330: "凤县",
						610_331: "太白县"
					}
				},
				610_400: {
					code: "610400",
					name: "咸阳市",
					districts: {
						610_402: "秦都区",
						610_403: "杨陵区",
						610_404: "渭城区",
						610_422: "三原县",
						610_423: "泾阳县",
						610_424: "乾县",
						610_425: "礼泉县",
						610_426: "永寿县",
						610_428: "长武县",
						610_429: "旬邑县",
						610_430: "淳化县",
						610_431: "武功县",
						610_481: "兴平市",
						610_482: "彬州市"
					}
				},
				610_500: {
					code: "610500",
					name: "渭南市",
					districts: {
						610_502: "临渭区",
						610_503: "华州区",
						610_522: "潼关县",
						610_523: "大荔县",
						610_524: "合阳县",
						610_525: "澄城县",
						610_526: "蒲城县",
						610_527: "白水县",
						610_528: "富平县",
						610_581: "韩城市",
						610_582: "华阴市"
					}
				},
				610_600: {
					code: "610600",
					name: "延安市",
					districts: {
						610_602: "宝塔区",
						610_603: "安塞区",
						610_621: "延长县",
						610_622: "延川县",
						610_623: "子长县",
						610_625: "志丹县",
						610_626: "吴起县",
						610_627: "甘泉县",
						610_628: "富县",
						610_629: "洛川县",
						610_630: "宜川县",
						610_631: "黄龙县",
						610_632: "黄陵县"
					}
				},
				610_700: {
					code: "610700",
					name: "汉中市",
					districts: {
						610_702: "汉台区",
						610_703: "南郑区",
						610_722: "城固县",
						610_723: "洋县",
						610_724: "西乡县",
						610_725: "勉县",
						610_726: "宁强县",
						610_727: "略阳县",
						610_728: "镇巴县",
						610_729: "留坝县",
						610_730: "佛坪县"
					}
				},
				610_800: {
					code: "610800",
					name: "榆林市",
					districts: {
						610_802: "榆阳区",
						610_803: "横山区",
						610_822: "府谷县",
						610_824: "靖边县",
						610_825: "定边县",
						610_826: "绥德县",
						610_827: "米脂县",
						610_828: "佳县",
						610_829: "吴堡县",
						610_830: "清涧县",
						610_831: "子洲县",
						610_881: "神木市"
					}
				},
				610_900: {
					code: "610900",
					name: "安康市",
					districts: {
						610_902: "汉滨区",
						610_921: "汉阴县",
						610_922: "石泉县",
						610_923: "宁陕县",
						610_924: "紫阳县",
						610_925: "岚皋县",
						610_926: "平利县",
						610_927: "镇坪县",
						610_928: "旬阳县",
						610_929: "白河县"
					}
				},
				611_000: {
					code: "611000",
					name: "商洛市",
					districts: {
						611_002: "商州区",
						611_021: "洛南县",
						611_022: "丹凤县",
						611_023: "商南县",
						611_024: "山阳县",
						611_025: "镇安县",
						611_026: "柞水县"
					}
				}
			}
		},
		620_000: {
			code: "620000",
			name: "甘肃省",
			cities: {
				620_100: {
					code: "620100",
					name: "兰州市",
					districts: {
						620_102: "城关区",
						620_103: "七里河区",
						620_104: "西固区",
						620_105: "安宁区",
						620_111: "红古区",
						620_121: "永登县",
						620_122: "皋兰县",
						620_123: "榆中县"
					}
				},
				620_200: {
					code: "620200",
					name: "嘉峪关市",
					districts: {
					}
				},
				620_300: {
					code: "620300",
					name: "金昌市",
					districts: {
						620_302: "金川区",
						620_321: "永昌县"
					}
				},
				620_400: {
					code: "620400",
					name: "白银市",
					districts: {
						620_402: "白银区",
						620_403: "平川区",
						620_421: "靖远县",
						620_422: "会宁县",
						620_423: "景泰县"
					}
				},
				620_500: {
					code: "620500",
					name: "天水市",
					districts: {
						620_502: "秦州区",
						620_503: "麦积区",
						620_521: "清水县",
						620_522: "秦安县",
						620_523: "甘谷县",
						620_524: "武山县",
						620_525: "张家川回族自治县"
					}
				},
				620_600: {
					code: "620600",
					name: "武威市",
					districts: {
						620_602: "凉州区",
						620_621: "民勤县",
						620_622: "古浪县",
						620_623: "天祝藏族自治县"
					}
				},
				620_700: {
					code: "620700",
					name: "张掖市",
					districts: {
						620_702: "甘州区",
						620_721: "肃南裕固族自治县",
						620_722: "民乐县",
						620_723: "临泽县",
						620_724: "高台县",
						620_725: "山丹县"
					}
				},
				620_800: {
					code: "620800",
					name: "平凉市",
					districts: {
						620_802: "崆峒区",
						620_821: "泾川县",
						620_822: "灵台县",
						620_823: "崇信县",
						620_825: "庄浪县",
						620_826: "静宁县",
						620_881: "华亭市"
					}
				},
				620_900: {
					code: "620900",
					name: "酒泉市",
					districts: {
						620_902: "肃州区",
						620_921: "金塔县",
						620_922: "瓜州县",
						620_923: "肃北蒙古族自治县",
						620_924: "阿克塞哈萨克族自治县",
						620_981: "玉门市",
						620_982: "敦煌市"
					}
				},
				621_000: {
					code: "621000",
					name: "庆阳市",
					districts: {
						621_002: "西峰区",
						621_021: "庆城县",
						621_022: "环县",
						621_023: "华池县",
						621_024: "合水县",
						621_025: "正宁县",
						621_026: "宁县",
						621_027: "镇原县"
					}
				},
				621_100: {
					code: "621100",
					name: "定西市",
					districts: {
						621_102: "安定区",
						621_121: "通渭县",
						621_122: "陇西县",
						621_123: "渭源县",
						621_124: "临洮县",
						621_125: "漳县",
						621_126: "岷县"
					}
				},
				621_200: {
					code: "621200",
					name: "陇南市",
					districts: {
						621_202: "武都区",
						621_221: "成县",
						621_222: "文县",
						621_223: "宕昌县",
						621_224: "康县",
						621_225: "西和县",
						621_226: "礼县",
						621_227: "徽县",
						621_228: "两当县"
					}
				},
				622_900: {
					code: "622900",
					name: "临夏回族自治州",
					districts: {
						622_901: "临夏市",
						622_921: "临夏县",
						622_922: "康乐县",
						622_923: "永靖县",
						622_924: "广河县",
						622_925: "和政县",
						622_926: "东乡族自治县",
						622_927: "积石山保安族东乡族撒拉族自治县"
					}
				},
				623_000: {
					code: "623000",
					name: "甘南藏族自治州",
					districts: {
						623_001: "合作市",
						623_021: "临潭县",
						623_022: "卓尼县",
						623_023: "舟曲县",
						623_024: "迭部县",
						623_025: "玛曲县",
						623_026: "碌曲县",
						623_027: "夏河县"
					}
				}
			}
		},
		630_000: {
			code: "630000",
			name: "青海省",
			cities: {
				630_100: {
					code: "630100",
					name: "西宁市",
					districts: {
						630_102: "城东区",
						630_103: "城中区",
						630_104: "城西区",
						630_105: "城北区",
						630_121: "大通回族土族自治县",
						630_122: "湟中县",
						630_123: "湟源县"
					}
				},
				630_200: {
					code: "630200",
					name: "海东市",
					districts: {
						630_202: "乐都区",
						630_203: "平安区",
						630_222: "民和回族土族自治县",
						630_223: "互助土族自治县",
						630_224: "化隆回族自治县",
						630_225: "循化撒拉族自治县"
					}
				},
				632_200: {
					code: "632200",
					name: "海北藏族自治州",
					districts: {
						632_221: "门源回族自治县",
						632_222: "祁连县",
						632_223: "海晏县",
						632_224: "刚察县"
					}
				},
				632_300: {
					code: "632300",
					name: "黄南藏族自治州",
					districts: {
						632_321: "同仁县",
						632_322: "尖扎县",
						632_323: "泽库县",
						632_324: "河南蒙古族自治县"
					}
				},
				632_500: {
					code: "632500",
					name: "海南藏族自治州",
					districts: {
						632_521: "共和县",
						632_522: "同德县",
						632_523: "贵德县",
						632_524: "兴海县",
						632_525: "贵南县"
					}
				},
				632_600: {
					code: "632600",
					name: "果洛藏族自治州",
					districts: {
						632_621: "玛沁县",
						632_622: "班玛县",
						632_623: "甘德县",
						632_624: "达日县",
						632_625: "久治县",
						632_626: "玛多县"
					}
				},
				632_700: {
					code: "632700",
					name: "玉树藏族自治州",
					districts: {
						632_701: "玉树市",
						632_722: "杂多县",
						632_723: "称多县",
						632_724: "治多县",
						632_725: "囊谦县",
						632_726: "曲麻莱县"
					}
				},
				632_800: {
					code: "632800",
					name: "海西蒙古族藏族自治州",
					districts: {
						632_801: "格尔木市",
						632_802: "德令哈市",
						632_803: "茫崖市",
						632_821: "乌兰县",
						632_822: "都兰县",
						632_823: "天峻县"
					}
				}
			}
		},
		640_000: {
			code: "640000",
			name: "宁夏回族自治区",
			cities: {
				640_100: {
					code: "640100",
					name: "银川市",
					districts: {
						640_104: "兴庆区",
						640_105: "西夏区",
						640_106: "金凤区",
						640_121: "永宁县",
						640_122: "贺兰县",
						640_181: "灵武市"
					}
				},
				640_200: {
					code: "640200",
					name: "石嘴山市",
					districts: {
						640_202: "大武口区",
						640_205: "惠农区",
						640_221: "平罗县"
					}
				},
				640_300: {
					code: "640300",
					name: "吴忠市",
					districts: {
						640_302: "利通区",
						640_303: "红寺堡区",
						640_323: "盐池县",
						640_324: "同心县",
						640_381: "青铜峡市"
					}
				},
				640_400: {
					code: "640400",
					name: "固原市",
					districts: {
						640_402: "原州区",
						640_422: "西吉县",
						640_423: "隆德县",
						640_424: "泾源县",
						640_425: "彭阳县"
					}
				},
				640_500: {
					code: "640500",
					name: "中卫市",
					districts: {
						640_502: "沙坡头区",
						640_521: "中宁县",
						640_522: "海原县"
					}
				}
			}
		},
		650_000: {
			code: "650000",
			name: "新疆维吾尔自治区",
			cities: {
				650_100: {
					code: "650100",
					name: "乌鲁木齐市",
					districts: {
						650_102: "天山区",
						650_103: "沙依巴克区",
						650_104: "新市区",
						650_105: "水磨沟区",
						650_106: "头屯河区",
						650_107: "达坂城区",
						650_109: "米东区",
						650_121: "乌鲁木齐县"
					}
				},
				650_200: {
					code: "650200",
					name: "克拉玛依市",
					districts: {
						650_202: "独山子区",
						650_203: "克拉玛依区",
						650_204: "白碱滩区",
						650_205: "乌尔禾区"
					}
				},
				650_400: {
					code: "650400",
					name: "吐鲁番市",
					districts: {
						650_402: "高昌区",
						650_421: "鄯善县",
						650_422: "托克逊县"
					}
				},
				650_500: {
					code: "650500",
					name: "哈密市",
					districts: {
						650_502: "伊州区",
						650_521: "巴里坤哈萨克自治县",
						650_522: "伊吾县"
					}
				},
				652_300: {
					code: "652300",
					name: "昌吉回族自治州",
					districts: {
						652_301: "昌吉市",
						652_302: "阜康市",
						652_323: "呼图壁县",
						652_324: "玛纳斯县",
						652_325: "奇台县",
						652_327: "吉木萨尔县",
						652_328: "木垒哈萨克自治县"
					}
				},
				652_700: {
					code: "652700",
					name: "博尔塔拉蒙古自治州",
					districts: {
						652_701: "博乐市",
						652_702: "阿拉山口市",
						652_722: "精河县",
						652_723: "温泉县"
					}
				},
				652_800: {
					code: "652800",
					name: "巴音郭楞蒙古自治州",
					districts: {
						652_801: "库尔勒市",
						652_822: "轮台县",
						652_823: "尉犁县",
						652_824: "若羌县",
						652_825: "且末县",
						652_826: "焉耆回族自治县",
						652_827: "和静县",
						652_828: "和硕县",
						652_829: "博湖县"
					}
				},
				652_900: {
					code: "652900",
					name: "阿克苏地区",
					districts: {
						652_901: "阿克苏市",
						652_922: "温宿县",
						652_923: "库车县",
						652_924: "沙雅县",
						652_925: "新和县",
						652_926: "拜城县",
						652_927: "乌什县",
						652_928: "阿瓦提县",
						652_929: "柯坪县"
					}
				},
				653_000: {
					code: "653000",
					name: "克孜勒苏柯尔克孜自治州",
					districts: {
						653_001: "阿图什市",
						653_022: "阿克陶县",
						653_023: "阿合奇县",
						653_024: "乌恰县"
					}
				},
				653_100: {
					code: "653100",
					name: "喀什地区",
					districts: {
						653_101: "喀什市",
						653_121: "疏附县",
						653_122: "疏勒县",
						653_123: "英吉沙县",
						653_124: "泽普县",
						653_125: "莎车县",
						653_126: "叶城县",
						653_127: "麦盖提县",
						653_128: "岳普湖县",
						653_129: "伽师县",
						653_130: "巴楚县",
						653_131: "塔什库尔干塔吉克自治县"
					}
				},
				653_200: {
					code: "653200",
					name: "和田地区",
					districts: {
						653_201: "和田市",
						653_221: "和田县",
						653_222: "墨玉县",
						653_223: "皮山县",
						653_224: "洛浦县",
						653_225: "策勒县",
						653_226: "于田县",
						653_227: "民丰县"
					}
				},
				654_000: {
					code: "654000",
					name: "伊犁哈萨克自治州",
					districts: {
						654_002: "伊宁市",
						654_003: "奎屯市",
						654_004: "霍尔果斯市",
						654_021: "伊宁县",
						654_022: "察布查尔锡伯自治县",
						654_023: "霍城县",
						654_024: "巩留县",
						654_025: "新源县",
						654_026: "昭苏县",
						654_027: "特克斯县",
						654_028: "尼勒克县"
					}
				},
				654_200: {
					code: "654200",
					name: "塔城地区",
					districts: {
						654_201: "塔城市",
						654_202: "乌苏市",
						654_221: "额敏县",
						654_223: "沙湾县",
						654_224: "托里县",
						654_225: "裕民县",
						654_226: "和布克赛尔蒙古自治县"
					}
				},
				654_300: {
					code: "654300",
					name: "阿勒泰地区",
					districts: {
						654_301: "阿勒泰市",
						654_321: "布尔津县",
						654_322: "富蕴县",
						654_323: "福海县",
						654_324: "哈巴河县",
						654_325: "青河县",
						654_326: "吉木乃县"
					}
				}
			}
		},
		810_000: {
			code: "810000",
			name: "香港特别行政区",
			cities: {
				810_000: {
					code: "810000",
					name: "香港特别行政区",
					districts: {
						810_101: "中西区",
						810_102: "湾仔区",
						810_103: "东区",
						810_104: "南区",
						810_105: "油尖旺区",
						810_106: "深水埗区",
						810_107: "九龙城区",
						810_108: "黄大仙区",
						810_109: "观塘区",
						810_110: "北区",
						810_111: "大埔区",
						810_112: "沙田区",
						810_113: "西贡区",
						810_114: "荃湾区",
						810_115: "屯门区",
						810_116: "元朗区",
						810_117: "葵青区",
						810_118: "离岛区"
					}
				}
			}
		},
		820_000: {
			code: "820000",
			name: "澳门特别行政区",
			cities: {
				820_000: {
					code: "820000",
					name: "澳门特别行政区",
					districts: {
						820_101: "花地玛堂区",
						820_102: "圣安多尼堂区",
						820_103: "大堂区",
						820_104: "望德堂区",
						820_105: "风顺堂区",
						820_106: "嘉模堂区",
						820_107: "圣方济各堂区",
						820_108: "路氹城",
						820_109: "澳门新城"
					}
				}
			}
		},
		830_000: {
			code: "830000",
			name: "台湾省",
			cities: {
				830_100: {
					code: "830100",
					name: "台北市",
					districts: {
						830_101: "中正区",
						830_102: "大同区",
						830_103: "中山区",
						830_104: "万华区",
						830_105: "信义区",
						830_106: "松山区",
						830_107: "大安区",
						830_108: "南港区",
						830_109: "北投区",
						830_110: "内湖区",
						830_111: "士林区",
						830_112: "文山区"
					}
				},
				830_200: {
					code: "830200",
					name: "新北市",
					districts: {
						830_201: "板桥区",
						830_202: "土城区",
						830_203: "新庄区",
						830_204: "新店区",
						830_205: "深坑区",
						830_206: "石碇区",
						830_207: "坪林区",
						830_208: "乌来区",
						830_209: "五股区",
						830_210: "八里区",
						830_211: "林口区",
						830_212: "淡水区",
						830_213: "中和区",
						830_214: "永和区",
						830_215: "三重区",
						830_216: "芦洲区",
						830_217: "泰山区",
						830_218: "树林区",
						830_219: "莺歌区",
						830_220: "三峡区",
						830_221: "汐止区",
						830_222: "金山区",
						830_223: "万里区",
						830_224: "三芝区",
						830_225: "石门区",
						830_226: "瑞芳区",
						830_227: "贡寮区",
						830_228: "双溪区",
						830_229: "平溪区"
					}
				},
				830_300: {
					code: "830300",
					name: "桃园市",
					districts: {
						830_301: "桃园区",
						830_302: "中坜区",
						830_303: "平镇区",
						830_304: "八德区",
						830_305: "杨梅区",
						830_306: "芦竹区",
						830_307: "大溪区",
						830_308: "龙潭区",
						830_309: "龟山区",
						830_310: "大园区",
						830_311: "观音区",
						830_312: "新屋区",
						830_313: "复兴区"
					}
				},
				830_400: {
					code: "830400",
					name: "台中市",
					districts: {
						830_401: "中区",
						830_402: "东区",
						830_403: "西区",
						830_404: "南区",
						830_405: "北区",
						830_406: "西屯区",
						830_407: "南屯区",
						830_408: "北屯区",
						830_409: "丰原区",
						830_410: "大里区",
						830_411: "太平区",
						830_412: "东势区",
						830_413: "大甲区",
						830_414: "清水区",
						830_415: "沙鹿区",
						830_416: "梧栖区",
						830_417: "后里区",
						830_418: "神冈区",
						830_419: "潭子区",
						830_420: "大雅区",
						830_421: "新小区",
						830_422: "石冈区",
						830_423: "外埔区",
						830_424: "大安区",
						830_425: "乌日区",
						830_426: "大肚区",
						830_427: "龙井区",
						830_428: "雾峰区",
						830_429: "和平区"
					}
				},
				830_500: {
					code: "830500",
					name: "台南市",
					districts: {
						830_501: "中西区",
						830_502: "东区",
						830_503: "南区",
						830_504: "北区",
						830_505: "安平区",
						830_506: "安南区",
						830_507: "永康区",
						830_508: "归仁区",
						830_509: "新化区",
						830_510: "左镇区",
						830_511: "玉井区",
						830_512: "楠西区",
						830_513: "南化区",
						830_514: "仁德区",
						830_515: "关庙区",
						830_516: "龙崎区",
						830_517: "官田区",
						830_518: "麻豆区",
						830_519: "佳里区",
						830_520: "西港区",
						830_521: "七股区",
						830_522: "将军区",
						830_523: "学甲区",
						830_524: "北门区",
						830_525: "新营区",
						830_526: "后壁区",
						830_527: "白河区",
						830_528: "东山区",
						830_529: "六甲区",
						830_530: "下营区",
						830_531: "柳营区",
						830_532: "盐水区",
						830_533: "善化区",
						830_534: "大内区",
						830_535: "山上区",
						830_536: "新市区",
						830_537: "安定区"
					}
				},
				830_600: {
					code: "830600",
					name: "高雄市",
					districts: {
						830_601: "楠梓区",
						830_602: "左营区",
						830_603: "鼓山区",
						830_604: "三民区",
						830_605: "盐埕区",
						830_606: "前金区",
						830_607: "新兴区",
						830_608: "苓雅区",
						830_609: "前镇区",
						830_610: "旗津区",
						830_611: "小港区",
						830_612: "凤山区",
						830_613: "大寮区",
						830_614: "鸟松区",
						830_615: "林园区",
						830_616: "仁武区",
						830_617: "大树区",
						830_618: "大社区",
						830_619: "冈山区",
						830_620: "路竹区",
						830_621: "桥头区",
						830_622: "梓官区",
						830_623: "弥陀区",
						830_624: "永安区",
						830_625: "燕巢区",
						830_626: "阿莲区",
						830_627: "茄萣区",
						830_628: "湖内区",
						830_629: "旗山区",
						830_630: "美浓区",
						830_631: "内门区",
						830_632: "杉林区",
						830_633: "甲仙区",
						830_634: "六龟区",
						830_635: "茂林区",
						830_636: "桃源区",
						830_637: "那玛夏区"
					}
				},
				830_700: {
					code: "830700",
					name: "基隆市",
					districts: {
						830_701: "中正区",
						830_702: "七堵区",
						830_703: "暖暖区",
						830_704: "仁爱区",
						830_705: "中山区",
						830_706: "安乐区",
						830_707: "信义区"
					}
				},
				830_800: {
					code: "830800",
					name: "新竹市",
					districts: {
						830_801: "东区",
						830_802: "北区",
						830_803: "香山区"
					}
				},
				830_900: {
					code: "830900",
					name: "嘉义市",
					districts: {
						830_901: "东区",
						830_902: "西区"
					}
				}
			}
		}
	};

	const REGION = ["东北", "华北", "华东", "华中", "华南", "西南", "西北"];
	const areas = location$1;
	// 随机生成一个大区。
	const region = function () {
		return pick(REGION);
	};
	// 随机生成一个（中国）省（或直辖市、自治区、特别行政区）。
	const province = function () {
		return pickMap(areas).name;
	};
	/**
		 * 随机生成一个（中国）市。
		 * @param prefix 是否有省前缀
		 */
	const city = function (prefix) {
		if (prefix === void 0) { prefix = false; }
		const province = pickMap(areas);
		const city = pickMap(province.cities);
		return prefix ? [province.name, city.name].join(" ") : city.name;
	};
	/**
		 * 随机生成一个（中国）县。
		 * @param prefix 是否有省/市前缀
		 */
	var county = function (prefix) {
		if (prefix === void 0) { prefix = false; }
		// 直筒子市，无区县
		// https://baike.baidu.com/item/%E7%9B%B4%E7%AD%92%E5%AD%90%E5%B8%82
		const specialCity = ["460400", "441900", "442000", "620200"];
		const province = pickMap(areas);
		const city = pickMap(province.cities);
		/* istanbul ignore next */
		if (specialCity.includes(city.code)) {
			return county(prefix);
		}
		const district = pickMap(city.districts) || "-";
		return prefix ? [province.name, city.name, district].join(" ") : district;
	};
	/**
		 * 随机生成一个邮政编码（默认6位数字）。
		 * @param len
		 */
	const zip = function (len) {
		if (len === void 0) { len = 6; }
		let zip = "";
		for (let i = 0; i < len; i++) {
			zip += natural(0, 9);
		}
		return zip;
	};

	const address = /* #__PURE__ */Object.freeze({
		__proto__: null,
		region,
		province,
		city,
		county,
		zip
	});

	// Miscellaneous
	const areas$1 = location$1;
	// 随机生成一个 guid
	// http://www.broofa.com/2008/09/javascript-uuid-function/
	const guid = function () {
		const pool = "abcdefABCDEF1234567890";
		return `${string(pool, 8)  }-${  string(pool, 4)  }-${  string(pool, 4)  }-${  string(pool, 4)  }-${  string(pool, 12)}`;
	};
	const uuid = guid;
	// 随机生成一个 18 位身份证。
	// http://baike.baidu.com/view/1697.htm#4
	// [身份证](http://baike.baidu.com/view/1697.htm#4)
	// 地址码 6 + 出生日期码 8 + 顺序码 3 + 校验码 1
	// [《中华人民共和国行政区划代码》国家标准(GB/T2260)](http://zhidao.baidu.com/question/1954561.html)
	var id = function () {
		let _id;
		let _sum = 0;
		const rank = ["7", "9", "10", "5", "8", "4", "2", "1", "6", "3", "7", "9", "10", "5", "8", "4", "2"];
		const last = ["1", "0", "X", "9", "8", "7", "6", "5", "4", "3", "2"];
		// 直筒子市，无区县
		// https://baike.baidu.com/item/%E7%9B%B4%E7%AD%92%E5%AD%90%E5%B8%82
		const specialCity = ["460400", "441900", "442000", "620200"];
		const province = pickMap(areas$1);
		const city = pickMap(province.cities);
		/* istanbul ignore next */
		if (specialCity.includes(city.code)) {
			return id();
		}
		const {districts} = city;
		const district = pick(keys(districts));
		_id = district + date("yyyyMMdd") + string("number", 3);
		for (const [i, element] of _id.entries()) {
			_sum += element * Number(rank[i]);
		}
		_id += last[_sum % 11];
		return _id;
	};
	// 生成一个全局的自增整数。
	// 类似自增主键（auto increment primary key）。
	let key = 0;
	const increment = function (step) {
		return key += (Number(step) || 1); // step?
	};
	const inc = increment;
	/**
		 * 随机生成一个版本号
		 * @param depth 版本号的层级，默认为3
		 */
	const version = function (depth) {
		if (depth === void 0) { depth = 3; }
		const numbers = [];
		for (let i = 0; i < depth; i++) {
			numbers.push(natural(0, 10));
		}
		return numbers.join(".");
	};
	// 随机生成一个中国手机号
	const phone = function () {
		const segments = [
			// 移动号段
			"134", "135", "136", "137", "138", "139", "147", "150", "151", "152", "157", "158", "159", "165", "172", "178", "182", "183", "184", "187", "188",
			// 联通号段
			"130", "131", "132", "145", "155", "156", "171", "175", "176", "185", "186",
			// 电信号段
			"133", "149", "153", "173", "174", "177", "180", "181", "189", "191"
		];
		return pick(segments) + string("number", 8);
	};

	const misc = /* #__PURE__ */Object.freeze({
		__proto__: null,
		guid,
		uuid,
		id,
		increment,
		inc,
		version,
		phone
	});

	const random = {extend: extendFunc, ...basic, ...date$1, ...image$1, ...color$1, ...text, ...name$1, ...web, ...address, ...helper, ...misc};
	function extendFunc(source) {
		if (isObject(source)) {
			for (const key in source) {
				random[key] = source[key];
			}
		}
	}

	// 解析数据模板（属性名部分）。
	const parse = function (name) {
		name = name === undefined ? "" : (`${name  }`);
		const parameters = name.match(constant.RE_KEY);
		// name|min-max, name|count
		const range = parameters && parameters[3] && parameters[3].match(constant.RE_RANGE);
		const min = range && range[1] && Number.parseInt(range[1], 10);
		const max = range && range[2] && Number.parseInt(range[2], 10);
		// 如果是 min-max, 返回 min-max 之间的一个数
		// 如果是 count, 返回 count
		const count = range
			? range[2]
				? random.integer(Number(min), Number(max))
				: Number.parseInt(range[1], 10)
			: undefined;
		const decimal = parameters && parameters[4] && parameters[4].match(constant.RE_RANGE);
		const dmin = decimal && decimal[1] && Number.parseInt(decimal[1], 10);
		const dmax = decimal && decimal[2] && Number.parseInt(decimal[2], 10);
		// int || dmin-dmax
		const dcount = decimal
			? decimal[2]
				? random.integer(Number(dmin), Number(dmax))
				: Number.parseInt(decimal[1], 10)
			: undefined;
		const result = {
			// 1 name, 2 inc, 3 range, 4 decimal
			parameters,
			// 1 min, 2 max
			range,
			min,
			max,
			count,
			decimal,
			dmin,
			dmax,
			dcount
		};
		for (const r in result) {
			if (result[r] != undefined) {
				return result;
			}
		}
		return {};
	};

	const number = Number;
	const boolean$1 = Boolean;
	const string$1 = String;
	const transfer = {
		number,
		boolean: boolean$1,
		string: string$1,
		extend
	};
	function extend(source) {
		if (isObject(source)) {
			for (const key in source) {
				transfer[key] = source[key];
			}
		}
	}

	// ## RegExp Handler
	// ASCII printable code chart
	const LOWER = ascii(97, 122);
	const UPPER = ascii(65, 90);
	const NUMBER = ascii(48, 57);
	const OTHER = ascii(32, 47) + ascii(58, 64) + ascii(91, 96) + ascii(123, 126); // 排除 95 _ ascii(91, 94) + ascii(96, 96)
	const PRINTABLE = ascii(32, 126);
	const SPACE = " \f\n\r\t\v\u00A0\u2028\u2029";
	const CHARACTER_CLASSES = {
		"\\w": `${LOWER + UPPER + NUMBER  }_`,
		"\\W": OTHER.replace("_", ""),
		"\\s": SPACE,
		"\\S": (function () {
			let result = PRINTABLE;
			for (let i = 0; i < SPACE.length; i++) {
				result = result.replace(SPACE[i], "");
			}
			return result;
		}()),
		"\\d": NUMBER,
		"\\D": LOWER + UPPER + OTHER
	};
	function ascii(from, to) {
		let result = "";
		for (let i = from; i <= to; i++) {
			result += String.fromCharCode(i);
		}
		return result;
	}
	var handler = {
		// var ast = RegExpParser.parse(regexp.source)
		gen (node, result, cache) {
			cache = cache || {
				guid: 1
			};
			return handler[node.type] ? handler[node.type](node, result, cache) : handler.token(node);
		},
		token: /* istanbul ignore next */ function (node) {
			switch (node.type) {
				case "start":
				case "end":
					return "";
				case "any-character":
					return random.character();
				case "backspace":
					return "";
				case "word-boundary": // TODO
					return "";
				case "non-word-boundary": // TODO
					break;
				case "digit":
					return random.pick(NUMBER.split(""));
				case "non-digit":
					return random.pick((LOWER + UPPER + OTHER).split(""));
				case "form-feed":
					break;
				case "line-feed":
					return node.body || node.text;
				case "carriage-return":
					break;
				case "white-space":
					return random.pick([...SPACE]);
				case "non-white-space":
					return random.pick((LOWER + UPPER + NUMBER).split(""));
				case "tab":
					break;
				case "vertical-tab":
					break;
				case "word": // \w [a-zA-Z0-9]
					return random.pick((LOWER + UPPER + NUMBER).split(""));
				case "non-word": // \W [^a-zA-Z0-9]
					return random.pick(OTHER.replace("_", "").split(""));
			}
			return node.body || node.text;
		},
		// {
		//   type: 'alternate',
		//   offset: 0,
		//   text: '',
		//   left: {
		//     boyd: []
		//   },
		//   right: {
		//     boyd: []
		//   }
		// }
		alternate (node, result, cache) {
			// node.left/right {}
			return handler.gen(random.boolean() ? node.left : node.right, result, cache);
		},
		// {
		//   type: 'match',
		//   offset: 0,
		//   text: '',
		//   body: []
		// }
		match (node, result, cache) {
			result = "";
			// node.body []
			for (let i = 0; i < node.body.length; i++) {
				result += handler.gen(node.body[i], result, cache);
			}
			return result;
		},
		// ()
		"capture-group": function (node, result, cache) {
			// node.body {}
			result = handler.gen(node.body, result, cache);
			cache[cache.guid++] = result;
			return result;
		},
		// (?:...)
		"non-capture-group": function (node, result, cache) {
			// node.body {}
			return handler.gen(node.body, result, cache);
		},
		// (?=p)
		"positive-lookahead": function (node, result, cache) {
			// node.body
			return handler.gen(node.body, result, cache);
		},
		// (?!p)
		"negative-lookahead": function () {
			// node.body
			return "";
		},
		// {
		//   type: 'quantified',
		//   offset: 3,
		//   text: 'c*',
		//   body: {
		//     type: 'literal',
		//     offset: 3,
		//     text: 'c',
		//     body: 'c',
		//     escaped: false
		//   },
		//   quantifier: {
		//     type: 'quantifier',
		//     offset: 4,
		//     text: '*',
		//     min: 0,
		//     max: Infinity,
		//     greedy: true
		//   }
		// }
		quantified (node, result, cache) {
			result = "";
			// node.quantifier {}
			const count = handler.quantifier(node.quantifier);
			// node.body {}
			for (let i = 0; i < count; i++) {
				result += handler.gen(node.body, result, cache);
			}
			return result;
		},
		// quantifier: {
		//   type: 'quantifier',
		//   offset: 4,
		//   text: '*',
		//   min: 0,
		//   max: Infinity,
		//   greedy: true
		// }
		quantifier (node) {
			const min = Math.max(node.min, 0);
			const max = isFinite(node.max) ? node.max : min + random.integer(3, 7);
			return random.integer(min, max);
		},
		charset (node, result, cache) {
			// node.invert
			if (node.invert) {
				return handler["invert-charset"](node, result, cache);
			}
			// node.body []
			const literal = random.pick(node.body);
			return handler.gen(literal, result, cache);
		},
		"invert-charset": function (node, result, cache) {
			let pool = PRINTABLE;
			let item;
			for (let i = 0; i < node.body.length; i++) {
				item = node.body[i];
				switch (item.type) {
					case "literal":
						pool = pool.replace(item.body, "");
						break;
					case "range":
						var min = handler.gen(item.start, result, cache).charCodeAt();
						var max = handler.gen(item.end, result, cache).charCodeAt();
						for (let ii = min; ii <= max; ii++) {
							pool = pool.replace(String.fromCharCode(ii), "");
						}
					/* falls through */
					default:
						var characters = CHARACTER_CLASSES[item.text];
						if (characters) {
							for (let iii = 0; iii <= characters.length; iii++) {
								pool = pool.replace(characters[iii], "");
							}
						}
				}
			}
			return random.pick(pool.split(""));
		},
		range (node, result, cache) {
			// node.start, node.end
			const min = handler.gen(node.start, result, cache).charCodeAt();
			const max = handler.gen(node.end, result, cache).charCodeAt();
			return String.fromCharCode(random.integer(min, max));
		},
		literal (node) {
			return node.escaped ? node.body : node.text;
		},
		// Unicode \u
		unicode (node) {
			return String.fromCharCode(Number.parseInt(node.code, 16));
		},
		// 十六进制 \xFF
		hex (node) {
			return String.fromCharCode(Number.parseInt(node.code, 16));
		},
		octal (node) {
			return String.fromCharCode(Number.parseInt(node.code, 8));
		},
		// 反向引用
		"back-reference": function (node, result, cache) {
			return cache[node.code] || "";
		},
		// http://en.wikipedia.org/wiki/C0_and_C1_control_codes
		CONTROL_CHARACTER_MAP: (function () {
			const CONTROL_CHARACTER = "@ A B C D E F G H I J K L M N O P Q R S T U V W X Y Z [ \\ ] ^ _".split(" ");
			const CONTROL_CHARACTER_UNICODE = "\u0000 \u0001 \u0002 \u0003 \u0004 \u0005 \u0006 \u0007 \u0008 \u0009 \u000A \u000B \u000C \u000D \u000E \u000F \u0010 \u0011 \u0012 \u0013 \u0014 \u0015 \u0016 \u0017 \u0018 \u0019 \u001A \u001B \u001C \u001D \u001E \u001F".split(" ");
			const map = {};
			for (const [i, element] of CONTROL_CHARACTER.entries()) {
				map[element] = CONTROL_CHARACTER_UNICODE[i];
			}
			return map;
		}()),
		"control-character": function (node) {
			return this.CONTROL_CHARACTER_MAP[node.code];
		}
	};

	// https://github.com/nuysoft/regexp
	// forked from https://github.com/ForbesLindesay/regexp
	function Token(n) {
		this.type = n, this.offset = Token.offset(), this.text = Token.text();
	}

	function Alternate(n, l) {
		Token.call(this, "alternate"), this.left = n, this.right = l;
	}

	function Match(n) {
		Token.call(this, "match"), this.body = n.filter(Boolean);
	}

	function Group(n, l) {
		Token.call(this, n), this.body = l;
	}

	function CaptureGroup(n) {
		Group.call(this, "capture-group"), this.index = cgs[this.offset] || (cgs[this.offset] = index++),
			this.body = n;
	}

	function Quantified(n, l) {
		Token.call(this, "quantified"), this.body = n, this.quantifier = l;
	}

	function Quantifier(n, l) {
		Token.call(this, "quantifier"), this.min = n, this.max = l, this.greedy = !0;
	}

	function CharSet(n, l) {
		Token.call(this, "charset"), this.invert = n, this.body = l;
	}

	function CharacterRange(n, l) {
		Token.call(this, "range"), this.start = n, this.end = l;
	}

	function Literal(n) {
		Token.call(this, "literal"), this.body = n, this.escaped = this.body != this.text;
	}

	function Unicode(n) {
		Token.call(this, "unicode"), this.code = n.toUpperCase();
	}

	function Hex(n) {
		Token.call(this, "hex"), this.code = n.toUpperCase();
	}

	function Octal(n) {
		Token.call(this, "octal"), this.code = n.toUpperCase();
	}

	function BackReference(n) {
		Token.call(this, "back-reference"), this.code = n.toUpperCase();
	}

	function ControlCharacter(n) {
		Token.call(this, "control-character"), this.code = n.toUpperCase();
	}

	/* istanbul ignore next */
	const parser = (function () {
		function n(n, l) {
			function u() {
				this.constructor = n;
			}

			u.prototype = l.prototype, n.prototype = new u();
		}

		function l(n, l, u, t, r) {
			function e(n, l) {
				function u(n) {
					function l(n) {
						return n.charCodeAt(0).toString(16).toUpperCase()
					}

					return n.replace(/\\/g, "\\\\").replace(/"/g, "\\\"").replace(/\u0008/g, "\\b").replace(/\t/g, "\\t").replace(/\n/g, "\\n").replace(/\f/g, "\\f").replace(/\r/g, "\\r").replace(/[\u0000-\u0007\u000B\u000E\u000F]/g, (n) => `\\x0${  l(n)}`).replace(/[\u0010-\u001F\u0080-\u00FF]/g, (n) => `\\x${  l(n)}`).replace(/[\u0180-\u0FFF]/g, (n) => `\\u0${  l(n)}`).replace(/[\u1080-\uFFFF]/g, (n) => `\\u${  l(n)}`)
				}

				let t; let r;
				switch (n.length) {
					case 0:
						t = "end of input";
						break

					case 1:
						t = n[0];
						break

					default:
						t = `${n.slice(0, -1).join(", ")  } or ${  n[n.length - 1]}`;
				}
				return r = l ? `"${  u(l)  }"` : "end of input", `Expected ${  t  } but ${  r  } found.`
			}

			this.expected = n, this.found = l, this.offset = u, this.line = t, this.column = r,
				this.name = "SyntaxError", this.message = e(n, l);
		}

		function u(n) {
			function u() {
				return n.substring(Lt, qt)
			}

			function t() {
				return Lt
			}

			function r(l) {
				function u(l, u, t) {
					let r; let e;
					for (r = u; t > r; r++) {
						e = n.charAt(r), e === "\n" ? (l.seenCR || l.line++, l.column = 1,
							l.seenCR = !1) : e === "\r" || e === "\u2028" || e === "\u2029" ? (l.line++, l.column = 1,
								l.seenCR = !0) : (l.column++, l.seenCR = !1);
					}
				}

				return Mt !== l && (Mt > l && (Mt = 0, Dt = {
					line: 1,
					column: 1,
					seenCR: !1
				}), u(Dt, Mt, l), Mt = l), Dt
			}

			function e(n) {
				Ht > qt || (qt > Ht && (Ht = qt, Ot = []), Ot.push(n));
			}

			function o(n) {
				let l = 0;
				for (n.sort(); l < n.length;) n[l - 1] === n[l] ? n.splice(l, 1) : l++;
			}

			function c() {
				let l; let u; let t; let r; let o;
				return l = qt, u = i(), u !== null ? (t = qt, n.charCodeAt(qt) === 124 ? (r = fl,
					qt++) : (r = null, Wt === 0 && e(sl)), r !== null ? (o = c(), o !== null ? (r = [r, o],
						t = r) : (qt = t, t = il)) : (qt = t, t = il), t === null && (t = al), t !== null ? (Lt = l,
							u = hl(u, t), u === null ? (qt = l, l = u) : l = u) : (qt = l, l = il)) : (qt = l,
								l = il), l
			}

			function i() {
				let n; let l; let u; let t; let r;
				if (n = qt, l = f(), l === null && (l = al), l !== null) {
					if (u = qt, Wt++, t = d(),
						Wt--, t === null ? u = al : (qt = u, u = il), u !== null) {
						for (t = [], r = h(), r === null && (r = a()); r !== null;) {
							t.push(r), r = h(),
								r === null && (r = a());
						}
						t !== null ? (r = s(), r === null && (r = al), r !== null ? (Lt = n, l = dl(l, t, r),
							l === null ? (qt = n, n = l) : n = l) : (qt = n, n = il)) : (qt = n, n = il);
					} else qt = n, n = il;
				} else qt = n, n = il;
				return n
			}

			function a() {
				let n;
				return n = x(), n === null && (n = Q(), n === null && (n = B())), n
			}

			function f() {
				let l; let u;
				return l = qt, n.charCodeAt(qt) === 94 ? (u = pl, qt++) : (u = null, Wt === 0 && e(vl)),
					u !== null && (Lt = l, u = wl()), u === null ? (qt = l, l = u) : l = u, l
			}

			function s() {
				let l; let u;
				return l = qt, n.charCodeAt(qt) === 36 ? (u = Al, qt++) : (u = null, Wt === 0 && e(Cl)),
					u !== null && (Lt = l, u = gl()), u === null ? (qt = l, l = u) : l = u, l
			}

			function h() {
				let n; let l; let u;
				return n = qt, l = a(), l !== null ? (u = d(), u !== null ? (Lt = n, l = bl(l, u),
					l === null ? (qt = n, n = l) : n = l) : (qt = n, n = il)) : (qt = n, n = il), n
			}

			function d() {
				let n; let l; let u;
				return Wt++, n = qt, l = p(), l !== null ? (u = k(), u === null && (u = al), u !== null ? (Lt = n,
					l = Tl(l, u), l === null ? (qt = n, n = l) : n = l) : (qt = n, n = il)) : (qt = n,
						n = il), Wt--, n === null && (l = null, Wt === 0 && e(kl)), n
			}

			function p() {
				let n;
				return n = v(), n === null && (n = w(), n === null && (n = A(), n === null && (n = C(),
					n === null && (n = g(), n === null && (n = b()))))), n
			}

			function v() {
				let l; let u; let t; let r; let o; let c;
				return l = qt, n.charCodeAt(qt) === 123 ? (u = xl, qt++) : (u = null, Wt === 0 && e(yl)),
					u !== null ? (t = T(), t !== null ? (n.charCodeAt(qt) === 44 ? (r = ml, qt++) : (r = null,
						Wt === 0 && e(Rl)), r !== null ? (o = T(), o !== null ? (n.charCodeAt(qt) === 125 ? (c = Fl,
							qt++) : (c = null, Wt === 0 && e(Ql)), c !== null ? (Lt = l, u = Sl(t, o), u === null ? (qt = l,
								l = u) : l = u) : (qt = l, l = il)) : (qt = l, l = il)) : (qt = l, l = il)) : (qt = l,
									l = il)) : (qt = l, l = il), l
			}

			function w() {
				let l; let u; let t; let r;
				return l = qt, n.charCodeAt(qt) === 123 ? (u = xl, qt++) : (u = null, Wt === 0 && e(yl)),
					u !== null ? (t = T(), t !== null ? (n.substr(qt, 2) === Ul ? (r = Ul, qt += 2) : (r = null,
						Wt === 0 && e(El)), r !== null ? (Lt = l, u = Gl(t), u === null ? (qt = l, l = u) : l = u) : (qt = l,
							l = il)) : (qt = l, l = il)) : (qt = l, l = il), l
			}

			function A() {
				let l; let u; let t; let r;
				return l = qt, n.charCodeAt(qt) === 123 ? (u = xl, qt++) : (u = null, Wt === 0 && e(yl)),
					u !== null ? (t = T(), t !== null ? (n.charCodeAt(qt) === 125 ? (r = Fl, qt++) : (r = null,
						Wt === 0 && e(Ql)), r !== null ? (Lt = l, u = Bl(t), u === null ? (qt = l, l = u) : l = u) : (qt = l,
							l = il)) : (qt = l, l = il)) : (qt = l, l = il), l
			}

			function C() {
				let l; let u;
				return l = qt, n.charCodeAt(qt) === 43 ? (u = jl, qt++) : (u = null, Wt === 0 && e($l)),
					u !== null && (Lt = l, u = ql()), u === null ? (qt = l, l = u) : l = u, l
			}

			function g() {
				let l; let u;
				return l = qt, n.charCodeAt(qt) === 42 ? (u = Ll, qt++) : (u = null, Wt === 0 && e(Ml)),
					u !== null && (Lt = l, u = Dl()), u === null ? (qt = l, l = u) : l = u, l
			}

			function b() {
				let l; let u;
				return l = qt, n.charCodeAt(qt) === 63 ? (u = Hl, qt++) : (u = null, Wt === 0 && e(Ol)),
					u !== null && (Lt = l, u = Wl()), u === null ? (qt = l, l = u) : l = u, l
			}

			function k() {
				let l;
				return n.charCodeAt(qt) === 63 ? (l = Hl, qt++) : (l = null, Wt === 0 && e(Ol)),
					l
			}

			function T() {
				let l; let u; let t;
				if (l = qt, u = [], zl.test(n.charAt(qt)) ? (t = n.charAt(qt), qt++) : (t = null,
					Wt === 0 && e(Il)), t !== null) {
					for (; t !== null;) {
						u.push(t), zl.test(n.charAt(qt)) ? (t = n.charAt(qt),
							qt++) : (t = null, Wt === 0 && e(Il));
					}
				} else u = il;
				return u !== null && (Lt = l, u = Jl(u)), u === null ? (qt = l, l = u) : l = u,
					l
			}

			function x() {
				let l; let u; let t; let r;
				return l = qt, n.charCodeAt(qt) === 40 ? (u = Kl, qt++) : (u = null, Wt === 0 && e(Nl)),
					u !== null ? (t = R(), t === null && (t = F(), t === null && (t = m(), t === null && (t = y()))),
						t !== null ? (n.charCodeAt(qt) === 41 ? (r = Pl, qt++) : (r = null, Wt === 0 && e(Vl)),
							r !== null ? (Lt = l, u = Xl(t), u === null ? (qt = l, l = u) : l = u) : (qt = l,
								l = il)) : (qt = l, l = il)) : (qt = l, l = il), l
			}

			function y() {
				let n; let l;
				return n = qt, l = c(), l !== null && (Lt = n, l = Yl(l)), l === null ? (qt = n,
					n = l) : n = l, n
			}

			function m() {
				let l; let u; let t;
				return l = qt, n.substr(qt, 2) === Zl ? (u = Zl, qt += 2) : (u = null, Wt === 0 && e(_l)),
					u !== null ? (t = c(), t !== null ? (Lt = l, u = nu(t), u === null ? (qt = l, l = u) : l = u) : (qt = l,
						l = il)) : (qt = l, l = il), l
			}

			function R() {
				let l; let u; let t;
				return l = qt, n.substr(qt, 2) === lu ? (u = lu, qt += 2) : (u = null, Wt === 0 && e(uu)),
					u !== null ? (t = c(), t !== null ? (Lt = l, u = tu(t), u === null ? (qt = l, l = u) : l = u) : (qt = l,
						l = il)) : (qt = l, l = il), l
			}

			function F() {
				let l; let u; let t;
				return l = qt, n.substr(qt, 2) === ru ? (u = ru, qt += 2) : (u = null, Wt === 0 && e(eu)),
					u !== null ? (t = c(), t !== null ? (Lt = l, u = ou(t), u === null ? (qt = l, l = u) : l = u) : (qt = l,
						l = il)) : (qt = l, l = il), l
			}

			function Q() {
				let l; let u; let t; let r; let o;
				if (Wt++, l = qt, n.charCodeAt(qt) === 91 ? (u = iu, qt++) : (u = null, Wt === 0 && e(au)),
					u !== null) {
					if (n.charCodeAt(qt) === 94 ? (t = pl, qt++) : (t = null, Wt === 0 && e(vl)),
						t === null && (t = al), t !== null) {
						for (r = [], o = S(), o === null && (o = U()); o !== null;) {
							r.push(o), o = S(),
								o === null && (o = U());
						}
						r !== null ? (n.charCodeAt(qt) === 93 ? (o = fu, qt++) : (o = null, Wt === 0 && e(su)),
							o !== null ? (Lt = l, u = hu(t, r), u === null ? (qt = l, l = u) : l = u) : (qt = l,
								l = il)) : (qt = l, l = il);
					} else qt = l, l = il;
				} else qt = l, l = il;
				return Wt--, l === null && (u = null, Wt === 0 && e(cu)), l
			}

			function S() {
				let l; let u; let t; let r;
				return Wt++, l = qt, u = U(), u !== null ? (n.charCodeAt(qt) === 45 ? (t = pu, qt++) : (t = null,
					Wt === 0 && e(vu)), t !== null ? (r = U(), r !== null ? (Lt = l, u = wu(u, r), u === null ? (qt = l,
						l = u) : l = u) : (qt = l, l = il)) : (qt = l, l = il)) : (qt = l, l = il), Wt--,
					l === null && (u = null, Wt === 0 && e(du)), l
			}

			function U() {
				let n;
				return Wt++, n = G(), n === null && (n = E()), Wt--, n === null && (Wt === 0 && e(Au)),
					n
			}

			function E() {
				let l; let u;
				return l = qt, Cu.test(n.charAt(qt)) ? (u = n.charAt(qt), qt++) : (u = null, Wt === 0 && e(gu)),
					u !== null && (Lt = l, u = bu(u)), u === null ? (qt = l, l = u) : l = u, l
			}

			function G() {
				let n;
				return n = L(), n === null && (n = Y(), n === null && (n = H(), n === null && (n = O(),
					n === null && (n = W(), n === null && (n = z(), n === null && (n = I(), n === null && (n = J(),
						n === null && (n = K(), n === null && (n = N(), n === null && (n = P(), n === null && (n = V(),
							n === null && (n = X(), n === null && (n = _(), n === null && (n = nl(), n === null && (n = ll(),
								n === null && (n = ul(), n === null && (n = tl()))))))))))))))))), n
			}

			function B() {
				let n;
				return n = j(), n === null && (n = q(), n === null && (n = $())), n
			}

			function j() {
				let l; let u;
				return l = qt, n.charCodeAt(qt) === 46 ? (u = ku, qt++) : (u = null, Wt === 0 && e(Tu)),
					u !== null && (Lt = l, u = xu()), u === null ? (qt = l, l = u) : l = u, l
			}

			function $() {
				let l; let u;
				return Wt++, l = qt, mu.test(n.charAt(qt)) ? (u = n.charAt(qt), qt++) : (u = null,
					Wt === 0 && e(Ru)), u !== null && (Lt = l, u = bu(u)), u === null ? (qt = l, l = u) : l = u,
					Wt--, l === null && (u = null, Wt === 0 && e(yu)), l
			}

			function q() {
				let n;
				return n = M(), n === null && (n = D(), n === null && (n = Y(), n === null && (n = H(),
					n === null && (n = O(), n === null && (n = W(), n === null && (n = z(), n === null && (n = I(),
						n === null && (n = J(), n === null && (n = K(), n === null && (n = N(), n === null && (n = P(),
							n === null && (n = V(), n === null && (n = X(), n === null && (n = Z(), n === null && (n = _(),
								n === null && (n = nl(), n === null && (n = ll(), n === null && (n = ul(), n === null && (n = tl()))))))))))))))))))),
					n
			}

			function L() {
				let l; let u;
				return l = qt, n.substr(qt, 2) === Fu ? (u = Fu, qt += 2) : (u = null, Wt === 0 && e(Qu)),
					u !== null && (Lt = l, u = Su()), u === null ? (qt = l, l = u) : l = u, l
			}

			function M() {
				let l; let u;
				return l = qt, n.substr(qt, 2) === Fu ? (u = Fu, qt += 2) : (u = null, Wt === 0 && e(Qu)),
					u !== null && (Lt = l, u = Uu()), u === null ? (qt = l, l = u) : l = u, l
			}

			function D() {
				let l; let u;
				return l = qt, n.substr(qt, 2) === Eu ? (u = Eu, qt += 2) : (u = null, Wt === 0 && e(Gu)),
					u !== null && (Lt = l, u = Bu()), u === null ? (qt = l, l = u) : l = u, l
			}

			function H() {
				let l; let u;
				return l = qt, n.substr(qt, 2) === ju ? (u = ju, qt += 2) : (u = null, Wt === 0 && e($u)),
					u !== null && (Lt = l, u = qu()), u === null ? (qt = l, l = u) : l = u, l
			}

			function O() {
				let l; let u;
				return l = qt, n.substr(qt, 2) === Lu ? (u = Lu, qt += 2) : (u = null, Wt === 0 && e(Mu)),
					u !== null && (Lt = l, u = Du()), u === null ? (qt = l, l = u) : l = u, l
			}

			function W() {
				let l; let u;
				return l = qt, n.substr(qt, 2) === Hu ? (u = Hu, qt += 2) : (u = null, Wt === 0 && e(Ou)),
					u !== null && (Lt = l, u = Wu()), u === null ? (qt = l, l = u) : l = u, l
			}

			function z() {
				let l; let u;
				return l = qt, n.substr(qt, 2) === zu ? (u = zu, qt += 2) : (u = null, Wt === 0 && e(Iu)),
					u !== null && (Lt = l, u = Ju()), u === null ? (qt = l, l = u) : l = u, l
			}

			function I() {
				let l; let u;
				return l = qt, n.substr(qt, 2) === Ku ? (u = Ku, qt += 2) : (u = null, Wt === 0 && e(Nu)),
					u !== null && (Lt = l, u = Pu()), u === null ? (qt = l, l = u) : l = u, l
			}

			function J() {
				let l; let u;
				return l = qt, n.substr(qt, 2) === Vu ? (u = Vu, qt += 2) : (u = null, Wt === 0 && e(Xu)),
					u !== null && (Lt = l, u = Yu()), u === null ? (qt = l, l = u) : l = u, l
			}

			function K() {
				let l; let u;
				return l = qt, n.substr(qt, 2) === Zu ? (u = Zu, qt += 2) : (u = null, Wt === 0 && e(_u)),
					u !== null && (Lt = l, u = nt()), u === null ? (qt = l, l = u) : l = u, l
			}

			function N() {
				let l; let u;
				return l = qt, n.substr(qt, 2) === lt ? (u = lt, qt += 2) : (u = null, Wt === 0 && e(ut)),
					u !== null && (Lt = l, u = tt()), u === null ? (qt = l, l = u) : l = u, l
			}

			function P() {
				let l; let u;
				return l = qt, n.substr(qt, 2) === rt ? (u = rt, qt += 2) : (u = null, Wt === 0 && e(et)),
					u !== null && (Lt = l, u = ot()), u === null ? (qt = l, l = u) : l = u, l
			}

			function V() {
				let l; let u;
				return l = qt, n.substr(qt, 2) === ct ? (u = ct, qt += 2) : (u = null, Wt === 0 && e(it)),
					u !== null && (Lt = l, u = at()), u === null ? (qt = l, l = u) : l = u, l
			}

			function X() {
				let l; let u;
				return l = qt, n.substr(qt, 2) === ft ? (u = ft, qt += 2) : (u = null, Wt === 0 && e(st)),
					u !== null && (Lt = l, u = ht()), u === null ? (qt = l, l = u) : l = u, l
			}

			function Y() {
				let l; let u; let t;
				return l = qt, n.substr(qt, 2) === dt ? (u = dt, qt += 2) : (u = null, Wt === 0 && e(pt)),
					u !== null ? (n.length > qt ? (t = n.charAt(qt), qt++) : (t = null, Wt === 0 && e(vt)),
						t !== null ? (Lt = l, u = wt(t), u === null ? (qt = l, l = u) : l = u) : (qt = l,
							l = il)) : (qt = l, l = il), l
			}

			function Z() {
				let l; let u; let t;
				return l = qt, n.charCodeAt(qt) === 92 ? (u = At, qt++) : (u = null, Wt === 0 && e(Ct)),
					u !== null ? (gt.test(n.charAt(qt)) ? (t = n.charAt(qt), qt++) : (t = null, Wt === 0 && e(bt)),
						t !== null ? (Lt = l, u = kt(t), u === null ? (qt = l, l = u) : l = u) : (qt = l,
							l = il)) : (qt = l, l = il), l
			}

			function _() {
				let l; let u; let t; let r;
				if (l = qt, n.substr(qt, 2) === Tt ? (u = Tt, qt += 2) : (u = null, Wt === 0 && e(xt)),
					u !== null) {
					if (t = [], yt.test(n.charAt(qt)) ? (r = n.charAt(qt), qt++) : (r = null, Wt === 0 && e(mt)),
						r !== null) {
						for (; r !== null;) {
							t.push(r), yt.test(n.charAt(qt)) ? (r = n.charAt(qt),
								qt++) : (r = null, Wt === 0 && e(mt));
						}
					} else t = il;
					t !== null ? (Lt = l, u = Rt(t), u === null ? (qt = l, l = u) : l = u) : (qt = l,
						l = il);
				} else qt = l, l = il;
				return l
			}

			function nl() {
				let l; let u; let t; let r;
				if (l = qt, n.substr(qt, 2) === Ft ? (u = Ft, qt += 2) : (u = null, Wt === 0 && e(Qt)),
					u !== null) {
					if (t = [], St.test(n.charAt(qt)) ? (r = n.charAt(qt), qt++) : (r = null, Wt === 0 && e(Ut)),
						r !== null) {
						for (; r !== null;) {
							t.push(r), St.test(n.charAt(qt)) ? (r = n.charAt(qt),
								qt++) : (r = null, Wt === 0 && e(Ut));
						}
					} else t = il;
					t !== null ? (Lt = l, u = Et(t), u === null ? (qt = l, l = u) : l = u) : (qt = l,
						l = il);
				} else qt = l, l = il;
				return l
			}

			function ll() {
				let l; let u; let t; let r;
				if (l = qt, n.substr(qt, 2) === Gt ? (u = Gt, qt += 2) : (u = null, Wt === 0 && e(Bt)),
					u !== null) {
					if (t = [], St.test(n.charAt(qt)) ? (r = n.charAt(qt), qt++) : (r = null, Wt === 0 && e(Ut)),
						r !== null) {
						for (; r !== null;) {
							t.push(r), St.test(n.charAt(qt)) ? (r = n.charAt(qt),
								qt++) : (r = null, Wt === 0 && e(Ut));
						}
					} else t = il;
					t !== null ? (Lt = l, u = jt(t), u === null ? (qt = l, l = u) : l = u) : (qt = l,
						l = il);
				} else qt = l, l = il;
				return l
			}

			function ul() {
				let l; let u;
				return l = qt, n.substr(qt, 2) === Tt ? (u = Tt, qt += 2) : (u = null, Wt === 0 && e(xt)),
					u !== null && (Lt = l, u = $t()), u === null ? (qt = l, l = u) : l = u, l
			}

			function tl() {
				let l; let u; let t;
				return l = qt, n.charCodeAt(qt) === 92 ? (u = At, qt++) : (u = null, Wt === 0 && e(Ct)),
					u !== null ? (n.length > qt ? (t = n.charAt(qt), qt++) : (t = null, Wt === 0 && e(vt)),
						t !== null ? (Lt = l, u = bu(t), u === null ? (qt = l, l = u) : l = u) : (qt = l,
							l = il)) : (qt = l, l = il), l
			}
			let rl; const el = arguments.length > 1 ? arguments[1] : {}; const ol = {
				regexp: c
			}; let cl = c; var il = null; var al = ""; var fl = "|"; var sl = "\"|\""; var hl = function (n, l) {
				return l ? new Alternate(n, l[1]) : n
			}; var dl = function (n, l, u) {
				return new Match([...[n].concat(l), u])
			}; var pl = "^"; var vl = "\"^\""; var wl = function () {
				return new Token("start")
			}; var Al = "$"; var Cl = "\"$\""; var gl = function () {
				return new Token("end")
			}; var bl = function (n, l) {
				return new Quantified(n, l)
			}; var kl = "Quantifier"; var Tl = function (n, l) {
				return l && (n.greedy = !1), n
			}; var xl = "{"; var yl = "\"{\""; var ml = ","; var Rl = "\",\""; var Fl = "}"; var Ql = "\"}\""; var Sl = function (n, l) {
				return new Quantifier(n, l)
			}; var Ul = ",}"; var El = "\",}\""; var Gl = function (n) {
				return new Quantifier(n, 1 / 0)
			}; var Bl = function (n) {
				return new Quantifier(n, n)
			}; var jl = "+"; var $l = "\"+\""; var ql = function () {
				return new Quantifier(1, 1 / 0)
			}; var Ll = "*"; var Ml = "\"*\""; var Dl = function () {
				return new Quantifier(0, 1 / 0)
			}; var Hl = "?"; var Ol = "\"?\""; var Wl = function () {
				return new Quantifier(0, 1)
			}; var zl = /^\d/; var Il = "[0-9]"; var Jl = function (n) {
				return +n.join("")
			}; var Kl = "("; var Nl = "\"(\""; var Pl = ")"; var Vl = "\")\""; var Xl = function (n) {
				return n
			}; var Yl = function (n) {
				return new CaptureGroup(n)
			}; var Zl = "?:"; var _l = "\"?:\""; var nu = function (n) {
				return new Group("non-capture-group", n)
			}; var lu = "?="; var uu = "\"?=\""; var tu = function (n) {
				return new Group("positive-lookahead", n)
			}; var ru = "?!"; var eu = "\"?!\""; var ou = function (n) {
				return new Group("negative-lookahead", n)
			}; var cu = "CharacterSet"; var iu = "["; var au = "\"[\""; var fu = "]"; var su = "\"]\""; var hu = function (n, l) {
				return new CharSet(!!n, l)
			}; var du = "CharacterRange"; var pu = "-"; var vu = "\"-\""; var wu = function (n, l) {
				return new CharacterRange(n, l)
			}; var Au = "Character"; var Cu = /^[^\\\]]/; var gu = "[^\\\\\\]]"; var bu = function (n) {
				return new Literal(n)
			}; var ku = "."; var Tu = "\".\""; var xu = function () {
				return new Token("any-character")
			}; var yu = "Literal"; var mu = /^[^$()*+./?[\\^|]/; var Ru = "[^|\\\\\\/.[()?+*$\\^]"; var Fu = "\\b"; var Qu = "\"\\\\b\"";
			var Su = function () {
				return new Token("backspace")
			}; var Uu = function () {
				return new Token("word-boundary")
			}; var Eu = "\\B"; var Gu = "\"\\\\B\""; var Bu = function () {
				return new Token("non-word-boundary")
			}; var ju = "\\d"; var $u = "\"\\\\d\""; var qu = function () {
				return new Token("digit")
			}; var Lu = "\\D"; var Mu = "\"\\\\D\""; var Du = function () {
				return new Token("non-digit")
			}; var Hu = "\\f"; var Ou = "\"\\\\f\""; var Wu = function () {
				return new Token("form-feed")
			}; var zu = "\\n"; var Iu = "\"\\\\n\""; var Ju = function () {
				return new Token("line-feed")
			}; var Ku = "\\r"; var Nu = "\"\\\\r\""; var Pu = function () {
				return new Token("carriage-return")
			}; var Vu = "\\s"; var Xu = "\"\\\\s\""; var Yu = function () {
				return new Token("white-space")
			}; var Zu = "\\S"; var _u = "\"\\\\S\""; var nt = function () {
				return new Token("non-white-space")
			}; var lt = "\\t"; var ut = "\"\\\\t\""; var tt = function () {
				return new Token("tab")
			}; var rt = "\\v"; var et = "\"\\\\v\""; var ot = function () {
				return new Token("vertical-tab")
			}; var ct = "\\w"; var it = "\"\\\\w\""; var at = function () {
				return new Token("word")
			}; var ft = "\\W"; var st = "\"\\\\W\""; var ht = function () {
				return new Token("non-word")
			}; var dt = "\\c"; var pt = "\"\\\\c\""; var vt = "any character"; var wt = function (n) {
				return new ControlCharacter(n)
			}; var At = "\\"; var Ct = "\"\\\\\""; var gt = /^[1-9]/; var bt = "[1-9]"; var kt = function (n) {
				return new BackReference(n)
			}; var Tt = "\\0"; var xt = "\"\\\\0\""; var yt = /^[0-7]/; var mt = "[0-7]"; var Rt = function (n) {
				return new Octal(n.join(""))
			}; var Ft = "\\x"; var Qt = "\"\\\\x\""; var St = /^[\dA-Fa-f]/; var Ut = "[0-9a-fA-F]"; var Et = function (n) {
				return new Hex(n.join(""))
			}; var Gt = "\\u"; var Bt = "\"\\\\u\""; var jt = function (n) {
				return new Unicode(n.join(""))
			}; var $t = function () {
				return new Token("null-character")
			}; var qt = 0; var Lt = 0; var Mt = 0; var Dt = {
				line: 1,
				column: 1,
				seenCR: !1
			}; var Ht = 0; var Ot = []; var Wt = 0;
			if ("startRule" in el) {
				if (!(el.startRule in ol)) throw new Error(`Can't start parsing from rule "${  el.startRule  }".`)
				cl = ol[el.startRule];
			}
			if (Token.offset = t, Token.text = u, rl = cl(), rl !== null && qt === n.length) return rl
			throw o(Ot), Lt = Math.max(qt, Ht), new l(Ot, Lt < n.length ? n.charAt(Lt) : null, Lt, r(Lt).line, r(Lt).column)
		}

		return n(l, Error), {
			SyntaxError: l,
			parse: u
		}
	}()); var index = 1; var cgs = {};

	const RE = {
		Parser: parser,
		Handler: handler
	};

	// 处理数据模板。
	var handler$1 = {
		// template        属性值（即数据模板）
		// name            属性名
		// context         数据上下文，生成后的数据
		// templateContext 模板上下文，
		//
		// Handle.gen(template, name, options)
		// context
		//     currentContext, templateCurrentContext,
		//     path, templatePath
		//     root, templateRoot
		gen (template, name, context) {
			name = name === undefined ? "" : name.toString();
			context = context || {};
			context = {
				// 当前访问路径，只有属性名，不包括生成规则
				path: context.path || [constant.GUID],
				templatePath: context.templatePath || [constant.GUID++],
				currentContext: context.currentContext,
				templateCurrentContext: context.templateCurrentContext || template,
				root: context.root || context.currentContext,
				templateRoot: context.templateRoot || context.templateCurrentContext || template
			};
			const rule = parse(name);
			const type$1 = type(template);
			let data;
			if (handler$1[type$1]) {
				data = handler$1[type$1]({
					type: type$1,
					template,
					name,
					rule,
					context,
					parsedName: name ? name.replace(constant.RE_KEY, "$1") : name
				});
				if (!context.root) {
					context.root = data;
				}
				return data;
			}
			return template;
		},
		array (options) {
			let result = [];
			// 'name|1': []
			// 'name|count': []
			// 'name|min-max': []
			if (options.template.length === 0) { return result; }
			// 'arr': [{ 'email': '@EMAIL' }, { 'email': '@EMAIL' }]
			if (!options.rule.parameters) {
				for (var i = 0; i < options.template.length; i++) {
					options.context.path.push(i);
					options.context.templatePath.push(i);
					result.push(handler$1.gen(options.template[i], i, {
						path: options.context.path,
						templatePath: options.context.templatePath,
						currentContext: result,
						templateCurrentContext: options.template,
						root: options.context.root || result,
						templateRoot: options.context.templateRoot || options.template
					}));
					options.context.path.pop();
					options.context.templatePath.pop();
				}
			} else {
				// 'method|1': ['GET', 'POST', 'HEAD', 'DELETE']
				if (options.rule.min === 1 && options.rule.max === undefined) {
					// fix Mock.js#17
					options.context.path.push(options.name);
					options.context.templatePath.push(options.name);
					result = random.pick(handler$1.gen(options.template, undefined, {
						path: options.context.path,
						templatePath: options.context.templatePath,
						currentContext: result,
						templateCurrentContext: options.template,
						root: options.context.root || result,
						templateRoot: options.context.templateRoot || options.template
					}));
					options.context.path.pop();
					options.context.templatePath.pop();
				} else {
					// 'data|+1': [{}, {}]
					if (options.rule.parameters[2]) {
						options.template.__order_index = options.template.__order_index || 0;
						options.context.path.push(options.name);
						options.context.templatePath.push(options.name);
						result = handler$1.gen(options.template, undefined, {
							path: options.context.path,
							templatePath: options.context.templatePath,
							currentContext: result,
							templateCurrentContext: options.template,
							root: options.context.root || result,
							templateRoot: options.context.templateRoot || options.template
						})[options.template.__order_index % options.template.length];
						options.template.__order_index += +options.rule.parameters[2];
						options.context.path.pop();
						options.context.templatePath.pop();
					} else if (options.rule.count) {
						// 'data|1-10': [{}]
						for (var i = 0; i < options.rule.count; i++) {
							// 'data|1-10': [{}, {}]
							for (let ii = 0; ii < options.template.length; ii++) {
								options.context.path.push(result.length);
								options.context.templatePath.push(ii);
								result.push(handler$1.gen(options.template[ii], result.length, {
									path: options.context.path,
									templatePath: options.context.templatePath,
									currentContext: result,
									templateCurrentContext: options.template,
									root: options.context.root || result,
									templateRoot: options.context.templateRoot || options.template
								}));
								options.context.path.pop();
								options.context.templatePath.pop();
							}
						}
					}
				}
			}
			return result;
		},
		object (options) {
			const result = {};
			// 'obj|min-max': {}
			if (options.rule.min != undefined) {
				var keys$1 = keys(options.template);
				keys$1 = random.shuffle(keys$1);
				keys$1 = keys$1.slice(0, options.rule.count);
				for (var i = 0; i < keys$1.length; i++) {
					var key = keys$1[i];
					var parsedKey = key.replace(constant.RE_KEY, "$1");
					var transferTypeCtor = handler$1.getTransferTypeCtor(key);
					if (transferTypeCtor) {
						parsedKey = parsedKey.replace(constant.RE_TRANSFER_TYPE, "");
					}
					options.context.path.push(parsedKey);
					options.context.templatePath.push(key);
					var generatedValue = handler$1.gen(options.template[key], key, {
						path: options.context.path,
						templatePath: options.context.templatePath,
						currentContext: result,
						templateCurrentContext: options.template,
						root: options.context.root || result,
						templateRoot: options.context.templateRoot || options.template
					});
					result[parsedKey] = transferTypeCtor(generatedValue);
					options.context.path.pop();
					options.context.templatePath.pop();
				}
			} else {
				// 'obj': {}
				var keys$1 = [];
				const fnKeys = []; // Mock.js#25 改变了非函数属性的顺序，查找起来不方便
				for (var key in options.template) {
					const target = typeof options.template[key] === "function" ? fnKeys : keys$1;
					target.push(key);
				}
				keys$1 = [...keys$1, ...fnKeys];
				for (var i = 0; i < keys$1.length; i++) {
					var key = keys$1[i];
					var parsedKey = key.replace(constant.RE_KEY, "$1");
					var transferTypeCtor = handler$1.getTransferTypeCtor(key);
					if (transferTypeCtor) {
						parsedKey = parsedKey.replace(constant.RE_TRANSFER_TYPE, "");
					}
					options.context.path.push(parsedKey);
					options.context.templatePath.push(key);
					var generatedValue = handler$1.gen(options.template[key], key, {
						path: options.context.path,
						templatePath: options.context.templatePath,
						currentContext: result,
						templateCurrentContext: options.template,
						root: options.context.root || result,
						templateRoot: options.context.templateRoot || options.template
					});
					result[parsedKey] = transferTypeCtor(generatedValue);
					options.context.path.pop();
					options.context.templatePath.pop();
					// 'id|+1': 1
					const inc = key.match(constant.RE_KEY);
					if (inc && inc[2] && type(options.template[key]) === "number") {
						options.template[key] += Number.parseInt(inc[2], 10);
					}
				}
			}
			return result;
		},
		number (options) {
			let result;
			let parts;
			if (options.rule.decimal) {
				// float
				options.template += "";
				parts = options.template.split(".");
				// 'float1|.1-10': 10,
				// 'float2|1-100.1-10': 1,
				// 'float3|999.1-10': 1,
				// 'float4|.3-10': 123.123,
				parts[0] = options.rule.range ? options.rule.count : parts[0];
				parts[1] = (parts[1] || "").slice(0, options.rule.dcount);
				while (parts[1].length < options.rule.dcount) {
					// 最后一位不能为 0：如果最后一位为 0，会被 JS 引擎忽略掉。
					parts[1] += parts[1].length < options.rule.dcount - 1
						? random.character("number")
						: random.character("123456789");
				}
				result = Number.parseFloat(parts.join("."));
			} else {
				// integer
				// 'grade1|1-100': 1,
				result = options.rule.range && !options.rule.parameters[2] ? options.rule.count : options.template;
			}
			return result;
		},
		boolean (options) {
			// 'prop|multiple': false, 当前值是相反值的概率倍数
			// 'prop|probability-probability': false, 当前值与相反值的概率
			const result = options.rule.parameters
				? random.bool(Number(options.rule.min), Number(options.rule.max), options.template)
				: options.template;
			return result;
		},
		string (options) {
			let source = "";
			let result = "";
			let match;
			let lastIndex = 0;
			if (options.template.length > 0) {
				// 'foo': '★',
				if (options.rule.count === undefined) {
					source += options.template;
				} else {
					// 'star|1-5': '★',
					for (let i = 0; i < options.rule.count; i++) {
						source += options.template;
					}
				}
				// 'email|1-10': '@EMAIL, ',
				constant.RE_PLACEHOLDER.exec("");
				while (match = constant.RE_PLACEHOLDER.exec(source)) {
					const {index} = match;
					const input = match[0];
					if (index >= lastIndex) {
						// 遇到转义斜杠，不需要解析占位符
						if (/^\\/.test(input)) {
							result += source.slice(lastIndex, index) + input.slice(1);
							lastIndex = index + input.length;
							continue;
						}
						// console.log(input, options.context.currentContext, options.context.templateCurrentContext, options)
						const replaced = handler$1.placeholder(input, options.context.currentContext, options.context.templateCurrentContext, options);
						// 只有一个占位符，并且没有其他字符，例如：'name': '@EMAIL'
						if (index === 0 && input.length === source.length) {
							result = replaced;
						} else {
							result += source.slice(lastIndex, index) + replaced;
						}
						lastIndex = index + input.length;
					}
				}
				if (lastIndex < source.length) {
					result += source.slice(lastIndex);
				}
			} else {
				// 'ASCII|1-10': '',
				// 'ASCII': '',
				result = options.rule.range ? random.string(options.rule.count) : options.template;
			}
			return result;
		},
		function (options) {
			// ( context, options )
			return options.template.call(options.context.currentContext, options);
		},
		regexp (options) {
			let source = "";
			// 'name': /regexp/,
			if (options.rule.count === undefined) {
				source += options.template.source; // regexp.source
			} else {
				// 'name|1-5': /regexp/,
				for (let i = 0; i < options.rule.count; i++) {
					source += options.template.source;
				}
			}
			return RE.Handler.gen(RE.Parser.parse(source));
		},
		_all () {
			const re = {};
			for (const key in random) {
				re[key.toLowerCase()] = key;
			}
			return re;
		},
		// 处理占位符，转换为最终值
		placeholder (placeholder, obj, templateContext, options) {
			// 1 key, 2 params
			// regexp init
			constant.RE_PLACEHOLDER.exec("");
			const parts = constant.RE_PLACEHOLDER.exec(placeholder);
			const key = parts && parts[1];
			const lkey = key && key.toLowerCase();
			const okey = handler$1._all()[lkey];
			const paramsInput = (parts && parts[2]) || "";
			const pathParts = handler$1.splitPathToArray(key);
			let params = [];
			// 解析占位符的参数
			try {
				// 1. 尝试保持参数的类型
				// #24 [Window Firefox 30.0 引用 占位符 抛错](https://github.com/nuysoft/Mock/issues/24)
				// [BX9056: 各浏览器下 window.eval 方法的执行上下文存在差异](http://www.w3help.org/zh-cn/causes/BX9056)
				// 应该属于 Window Firefox 30.0 的 BUG
				params = eval(`(function(){ return [].splice.call(arguments, 0 ) })(${  paramsInput  })`);
			} catch {
				// 2. 如果失败，先使用 `[]` 包裹，用 JSON.parse 尝试解析
				try {
					const paramsString = paramsInput.replace(/'/g, "\"");
					params = JSON.parse(`[${  paramsString  }]`);
				} catch {
					// 3. 逗号 split 方案兜底
					params = paramsInput.split(/,\s*/);
				}
			}
			// 占位符优先引用数据模板中的属性
			// { first: '@EMAIL', full: '@first' } =>  { first: 'dsa@163.com', full: 'dsa@163.com' }
			if (obj && key in obj) {
				return obj[key];
			}
			// 绝对路径 or 相对路径
			if (key.charAt(0) === "/" || pathParts.length > 1) {
				return handler$1.getValueByKeyPath(key, options);
			}
			// 递归引用数据模板中的属性
			// fix Mock.js#15 避免自己依赖自己)
			if (templateContext && typeof templateContext === "object" && key in templateContext && placeholder !== templateContext[key]) {
				// 先计算被引用的属性值
				templateContext[key] = handler$1.gen(templateContext[key], key, {
					currentContext: obj, templateCurrentContext: templateContext
				});
				return templateContext[key];
			}
			// 如果未找到，则原样返回
			if (!(key in random) && !(lkey in random) && !(okey in random)) {
				return placeholder;
			}
			// 递归解析参数中的占位符
			for (let i = 0; i < params.length; i++) {
				constant.RE_PLACEHOLDER.exec("");
				if (constant.RE_PLACEHOLDER.test(params[i])) {
					params[i] = handler$1.placeholder(params[i], obj, templateContext, options);
				}
			}
			const handle = random[key] || random[lkey] || random[okey];
			if (isFunction(handle)) {
				// 执行占位符方法（大多数情况）
				handle.options = options;
				let ret = handle.apply(random, params);
				// 因为是在字符串中，所以默认为空字符串。
				if (ret === undefined) {
					ret = "";
				}
				delete handle.options;
				return ret;
			}
			return "";
		},
		getValueByKeyPath (key, options) {
			const originalKey = key;
			const keyPathParts = handler$1.splitPathToArray(key);
			let absolutePathParts = [];
			// 绝对路径
			if (key.charAt(0) === "/") {
				absolutePathParts = [options.context.path[0]].concat(handler$1.normalizePath(keyPathParts));
			} else {
				// 相对路径
				if (keyPathParts.length > 1) {
					absolutePathParts = [...options.context.path];
					absolutePathParts.pop();
					absolutePathParts = handler$1.normalizePath(absolutePathParts.concat(keyPathParts));
				}
			}
			try {
				key = keyPathParts[keyPathParts.length - 1];
				let currentContext = options.context.root;
				let templateCurrentContext = options.context.templateRoot;
				for (let i = 1; i < absolutePathParts.length - 1; i++) {
					currentContext = currentContext[absolutePathParts[i]];
					templateCurrentContext = templateCurrentContext[absolutePathParts[i]];
				}
				// 引用的值已经计算好
				if (currentContext && key in currentContext) {
					return currentContext[key];
				}
				// 尚未计算，递归引用数据模板中的属性
				// fix #15 避免自己依赖自己
				if (templateCurrentContext &&
					typeof templateCurrentContext === "object" &&
					key in templateCurrentContext &&
					originalKey !== templateCurrentContext[key]) {
					// 先计算被引用的属性值
					templateCurrentContext[key] = handler$1.gen(templateCurrentContext[key], key, {
						currentContext,
						templateCurrentContext
					});
					return templateCurrentContext[key];
				}
			} catch { }
			return `@${  keyPathParts.join("/")}`;
		},
		// https://github.com/kissyteam/kissy/blob/master/src/path/src/path.js
		normalizePath (pathParts) {
			const newPathParts = [];
			for (const pathPart of pathParts) {
				switch (pathPart) {
					case "..":
						newPathParts.pop();
						break;
					case ".":
						break;
					default:
						newPathParts.push(pathPart);
				}
			}
			return newPathParts;
		},
		splitPathToArray (path) {
			return path.split(/\/+/).filter((_) => _);
		},
		getTransferTypeCtor (key) {
			const matched = key.match(constant.RE_TRANSFER_TYPE);
			const type = matched && matched[1];
			if (type && transfer.hasOwnProperty(type) && type !== "extend") {
				return transfer[type];
			}
			return function (value) { return value; };
		}
	};

	// 把 Mock.js 风格的数据模板转换成 JSON Schema。
	function toJSONSchema(template, name, path) {
		path = path || [];
		const result = {
			name: typeof name === "string" ? name.replace(constant.RE_KEY, "$1") : name,
			template,
			type: type(template),
			rule: parse(name),
			path: [...path]
		};
		result.path.push(name === undefined ? "ROOT" : result.name);
		if (isArray(template)) {
			result.items = [];
			template.forEach((item, index) => {
				result.items.push(toJSONSchema(item, index, result.path));
			});
		} else if (isObject(template)) {
			result.properties = [];
			for (const key in template) {
				result.properties.push(toJSONSchema(template[key], key, result.path));
			}
		}
		return result;
	}

	// ## valid(template, data)
	var Diff = {
		diff (schema, data, name) {
			const result = [];
			// 先检测名称 name 和类型 type，如果匹配，才有必要继续检测
			if (Diff.name(schema, data, name, result) && Diff.type(schema, data, name, result)) {
				Diff.value(schema, data, name, result);
				Diff.properties(schema, data, name, result);
				Diff.items(schema, data, name, result);
			}
			return result;
		},
		/* jshint unused:false */
		name (schema, _data, name, result) {
			const {length} = result;
			Assert.equal("name", schema.path, `${name  }`, `${schema.name  }`, result);
			return result.length === length;
		},
		type (schema, data, _name, result) {
			const {length} = result;
			if (isString(schema.template)) {
				// 占位符类型处理
				if (constant.RE_PLACEHOLDER.test(schema.template)) {
					const actualValue = handler$1.gen(schema.template);
					Assert.equal("type", schema.path, type(data), type(actualValue), result);
					return result.length === length;
				}
			} else if (isArray(schema.template)) {
				if (schema.rule.parameters) {
					// name|count: array
					if (schema.rule.min !== undefined && schema.rule.max === undefined && // 跳过 name|1: array，因为最终值的类型（很可能）不是数组，也不一定与 `array` 中的类型一致
						schema.rule.count === 1) {
							return true;
						}
					// 跳过 name|+inc: array
					if (schema.rule.parameters[2]) {
						return true;
					}
				}
			} else if (isFunction(schema.template)) {
				// 跳过 `'name': function`，因为函数可以返回任何类型的值。
				return true;
			}
			Assert.equal("type", schema.path, type(data), schema.type, result);
			return result.length === length;
		},
		value (schema, data, name, result) {
			const {length} = result;
			const {rule} = schema;
			const templateType = schema.type;
			if (templateType === "object" || templateType === "array" || templateType === "function") {
				return true;
			}
			// 无生成规则
			if (!rule.parameters) {
				if (isRegExp(schema.template)) {
					Assert.match("value", schema.path, data, schema.template, result);
					return result.length === length;
				}
				if (isString(schema.template) && // 同样跳过含有『占位符』的属性值，因为『占位符』的返回值会通常会与模板不一致
					schema.template.match(constant.RE_PLACEHOLDER)) {
						return result.length === length;
					}
				Assert.equal("value", schema.path, data, schema.template, result);
				return result.length === length;
			}
			// 有生成规则
			let actualRepeatCount;
			if (isNumber(schema.template)) {
				const parts = (`${data  }`).split(".");
				const intPart = Number(parts[0]);
				const floatPart = parts[1];
				// 整数部分
				// |min-max
				if (rule.min !== undefined && rule.max !== undefined) {
					Assert.greaterThanOrEqualTo("value", schema.path, intPart, Math.min(Number(rule.min), Number(rule.max)), result);
					// , 'numeric instance is lower than the required minimum (minimum: {expected}, found: {actual})')
					Assert.lessThanOrEqualTo("value", schema.path, intPart, Math.max(Number(rule.min), Number(rule.max)), result);
				}
				// |count
				if (rule.min !== undefined && rule.max === undefined) {
					Assert.equal("value", schema.path, intPart, Number(rule.min), result, `[value] ${  name}`);
				}
				// 小数部分
				if (rule.decimal) {
					// |dmin-dmax
					if (rule.dmin !== undefined && rule.dmax !== undefined) {
						Assert.greaterThanOrEqualTo("value", schema.path, floatPart.length, Number(rule.dmin), result);
						Assert.lessThanOrEqualTo("value", schema.path, floatPart.length, Number(rule.dmax), result);
					}
					// |dcount
					if (rule.dmin !== undefined && rule.dmax === undefined) {
						Assert.equal("value", schema.path, floatPart.length, Number(rule.dmin), result);
					}
				}
			} else if (isString(schema.template)) {
				// 'aaa'.match(/a/g)
				actualRepeatCount = data.match(new RegExp(schema.template, "g"));
				actualRepeatCount = actualRepeatCount ? actualRepeatCount.length : 0;
				// |min-max
				if (rule.min !== undefined && rule.max !== undefined) {
					Assert.greaterThanOrEqualTo("repeat count", schema.path, actualRepeatCount, Number(rule.min), result);
					Assert.lessThanOrEqualTo("repeat count", schema.path, actualRepeatCount, Number(rule.max), result);
				}
				// |count
				if (rule.min !== undefined && rule.max === undefined) {
					Assert.equal("repeat count", schema.path, actualRepeatCount, rule.min, result);
				}
			} else if (isRegExp(schema.template)) {
				actualRepeatCount = data.match(new RegExp(schema.template.source.replace(/^\^|\$$/g, ""), "g"));
				actualRepeatCount = actualRepeatCount ? actualRepeatCount.length : 0;
				// |min-max
				if (rule.min !== undefined && rule.max !== undefined) {
					Assert.greaterThanOrEqualTo("repeat count", schema.path, actualRepeatCount, Number(rule.min), result);
					Assert.lessThanOrEqualTo("repeat count", schema.path, actualRepeatCount, Number(rule.max), result);
				}
				// |count
				if (rule.min !== undefined && rule.max === undefined) {
					Assert.equal("repeat count", schema.path, actualRepeatCount, rule.min, result);
				}
			}
			return result.length === length;
		},
		properties (schema, data, _name, result) {
			const {length} = result;
			const {rule} = schema;
			const keys$1 = keys(data);
			if (!schema.properties) {
				return;
			}
			// 无生成规则
			if (!schema.rule.parameters) {
				Assert.equal("properties length", schema.path, keys$1.length, schema.properties.length, result);
			} else {
				// 有生成规则
				// |min-max
				if (rule.min !== undefined && rule.max !== undefined) {
					Assert.greaterThanOrEqualTo("properties length", schema.path, keys$1.length, Math.min(Number(rule.min), Number(rule.max)), result);
					Assert.lessThanOrEqualTo("properties length", schema.path, keys$1.length, Math.max(Number(rule.min), Number(rule.max)), result);
				}
				// |count
				if (rule.min !== undefined && rule.max === undefined && // |1, |>1
					rule.count !== 1) {
						Assert.equal("properties length", schema.path, keys$1.length, Number(rule.min), result);
					}
			}
			if (result.length !== length) {
				return false;
			}
			const _loop_1 = function (i) {
				let property;
				schema.properties.forEach((item) => {
					if (item.name === keys$1[i]) {
						property = item;
					}
				});
				property = property || schema.properties[i];
				result.push.apply(result, Diff.diff(property, data[keys$1[i]], keys$1[i]));
			};
			for (let i = 0; i < keys$1.length; i++) {
				_loop_1(i);
			}
			return result.length === length;
		},
		items (schema, data, _name, result) {
			const {length} = result;
			if (!schema.items) {
				return;
			}
			const {rule} = schema;
			// 无生成规则
			if (!schema.rule.parameters) {
				Assert.equal("items length", schema.path, data.length, schema.items.length, result);
			} else {
				// 有生成规则
				// |min-max
				if (rule.min !== undefined && rule.max !== undefined) {
					Assert.greaterThanOrEqualTo("items", schema.path, data.length, Math.min(Number(rule.min), Number(rule.max)) * schema.items.length, result, "[{utype}] array is too short: {path} must have at least {expected} elements but instance has {actual} elements");
					Assert.lessThanOrEqualTo("items", schema.path, data.length, Math.max(Number(rule.min), Number(rule.max)) * schema.items.length, result, "[{utype}] array is too long: {path} must have at most {expected} elements but instance has {actual} elements");
				}
				// |count
				if (rule.min !== undefined && rule.max === undefined) {
					// |1, |>1
					if (rule.count === 1) {
						return result.length === length;
					} 
						Assert.equal("items length", schema.path, data.length, (Number(rule.min) * schema.items.length), result);
					
				}
				// |+inc
				if (rule.parameters && rule.parameters[2]) {
					return result.length === length;
				}
			}
			if (result.length !== length) {
				return false;
			}
			for (const [i, datum] of data.entries()) {
				result.push.apply(result, Diff.diff(schema.items[i % schema.items.length], datum, i % schema.items.length));
			}
			return result.length === length;
		}
	};
	// 完善、友好的提示信息
	//
	// Equal, not equal to, greater than, less than, greater than or equal to, less than or equal to
	// 路径 验证类型 描述
	//
	// Expect path.name is less than or equal to expected, but path.name is actual.
	//
	//   Expect path.name is less than or equal to expected, but path.name is actual.
	//   Expect path.name is greater than or equal to expected, but path.name is actual.
	var Assert = {
		message (item) {
			if (item.message) {
				return item.message;
			}
			const upperType = item.type.toUpperCase();
			const lowerType = item.type.toLowerCase();
			const path = isArray(item.path) && item.path.join(".") || item.path;
			const {action} = item;
			const {expected} = item;
			const {actual} = item;
			return `[${  upperType  }] Expect ${  path  }'${  lowerType  } ${  action  } ${  expected  }, but is ${  actual}`;
		},
		equal (type, path, actual, expected, result, message) {
			if (actual === expected) {
				return true;
			}
			// 正则模板 === 字符串最终值
			if (type === "type" && expected === "regexp" && actual === "string") {
				return true;
			}
			result.push(Assert.createDiffResult(type, path, actual, expected, message, "is equal to"));
			return false;
		},
		// actual matches expected
		match (type, path, actual, expected, result, message) {
			if (expected.test(actual)) {
				return true;
			}
			result.push(Assert.createDiffResult(type, path, actual, expected, message, "matches"));
			return false;
		},
		greaterThanOrEqualTo (type, path, actual, expected, result, message) {
			if (actual >= expected) {
				return true;
			}
			result.push(Assert.createDiffResult(type, path, actual, expected, message, "is greater than or equal to"));
			return false;
		},
		lessThanOrEqualTo (type, path, actual, expected, result, message) {
			if (actual <= expected) {
				return true;
			}
			result.push(Assert.createDiffResult(type, path, actual, expected, message, "is less than or equal to"));
			return false;
		},
		createDiffResult (type, path, actual, expected, message, action) {
			const item = {
				path,
				type,
				actual,
				expected,
				action,
				message
			};
			item.message = Assert.message(item);
			return item;
		}
	};
	const valid = function (template, data) {
		const schema = toJSONSchema(template);
		return Diff.diff(schema, data);
	};
	valid.Diff = Diff;
	valid.Assert = Assert;

	function rgx(str, loose) {
		if (str instanceof RegExp) return { keys: false, pattern: str };
		let c; let o; let tmp; let ext; const keys = []; let pattern = ""; const arr = str.split("/");
		arr[0] || arr.shift();

		while (tmp = arr.shift()) {
			c = tmp[0];
			if (c === "*") {
				keys.push("wild");
				pattern += "/(.*)";
			} else if (c === ":") {
				o = tmp.indexOf("?", 1);
				ext = tmp.indexOf(".", 1);
				keys.push(tmp.substring(1, ~o ? o : ~ext ? ext : tmp.length));
				pattern += !!~o && !~ext ? "(?:/([^/]+?))?" : "/([^/]+?)";
				if (~ext) pattern += `${~o ? "?" : ""  }\\${  tmp.slice(Math.max(0, ext))}`;
			} else {
				pattern += `/${  tmp}`;
			}
		}

		return {
			keys,
			pattern: new RegExp(`^${  pattern  }${loose ? "(?=$|\/)" : "\/?$"}`, "i")
		};
	}

	const IMocked = /** @class */ (function () {
		function IMocked() {
			this._mocked = {};
		}
		IMocked.prototype.set = function (key, value) {
			this._mocked[key] = value;
		};
		IMocked.prototype.getMocked = function () {
			return this._mocked;
		};
		// 查找与请求参数匹配的数据模板：URL，Type
		IMocked.prototype.find = function (url, type) {
			const mockedItems = Object.values(this._mocked);
			console.log(mockedItems, "mockedItems",url)
			for (const item of mockedItems) {
				const urlMatched = this._matchUrl(item.rurl, url);
				const typeMatched = this._matchType(item.rtype, type);
				console.log(urlMatched, "urlMatched", typeMatched, "typeMatched")
				if (!item.rtype && urlMatched) {
					return item;
				}
				if (urlMatched && typeMatched) {
					return item;
				}
			}
		};
		/**
				* 数据模板转换成 mock 数据
				* @param item 发请求时匹配到的 mock 数据源
				* @param options 包含请求头，请求体，请求方法等
				*/
		IMocked.prototype.convert = function (item, options) {
			return isFunction(item.template) ? item.template(options) : handler$1.gen(item.template);
		};
		IMocked.prototype._matchUrl = function (expected, actual) {
			console.log(expected,actual,'比较')
			if (isString(expected)) {
				if (expected === actual) {
					return true;
				}
				// expected: /hello/world
				// actual: /hello/world?type=1
				if (actual.indexOf(expected) === 0 && actual[expected.length] === "?") {
					return true;
				}
				if (expected.indexOf("/") === 0) {
					return rgx(expected).pattern.test(actual);
				}
			}
			if (isRegExp(expected)) {
				return expected.test(actual);
			}
			return false;
		};
		IMocked.prototype._matchType = function (expected, actual) {
			if (isString(expected) || isRegExp(expected)) {
				return new RegExp(expected, "i").test(actual);
			}
			return false;
		};
		return IMocked;
	}());
	const mocked = new IMocked();

	const Setting = /** @class */ (function () {
		function Setting() {
			this._setting = {
				timeout: "10-100"
			};
		}
		Setting.prototype.setup = function (setting) {
			Object.assign(this._setting, setting);
		};
		Setting.prototype.parseTimeout = function (timeout) {
			if (timeout === void 0) { timeout = this._setting.timeout; }
			if (typeof timeout === "number") {
				return timeout;
			}
			if (typeof timeout === "string" && !timeout.includes("-")) {
				return Number.parseInt(timeout, 10);
			}
			if (typeof timeout === "string" && timeout.includes("-")) {
				const tmp = timeout.split("-");
				const min = Number.parseInt(tmp[0], 10);
				const max = Number.parseInt(tmp[1], 10);
				return Math.round(Math.random() * (max - min)) + min;
			}
			return 0;
		};
		return Setting;
	}());
	const setting = new Setting();

	// 备份原生 XMLHttpRequest
	const _XMLHttpRequest = XMLHttpRequest;
	let XHR_STATES;
	(function (XHR_STATES) {
		// The object has been constructed.
		XHR_STATES[XHR_STATES.UNSENT = 0] = "UNSENT";
		// The open() method has been successfully invoked.
		XHR_STATES[XHR_STATES.OPENED = 1] = "OPENED";
		// All redirects (if any) have been followed and all HTTP headers of the response have been received.
		XHR_STATES[XHR_STATES.HEADERS_RECEIVED = 2] = "HEADERS_RECEIVED";
		// The response's body is being received.
		XHR_STATES[XHR_STATES.LOADING = 3] = "LOADING";
		// The data transfer has been completed or something went wrong during the transfer (e.g. infinite redirects).
		XHR_STATES[XHR_STATES.DONE = 4] = "DONE";
	})(XHR_STATES || (XHR_STATES = {}));
	const XHR_EVENTS = ["readystatechange", "loadstart", "progress", "abort", "error", "load", "timeout", "loadend"];
	const XHR_REQUEST_PROPERTIES = ["timeout", "withCredentials", "responseType"];
	const XHR_RESPONSE_PROPERTIES = [
		"readyState",
		"responseURL",
		"status",
		"statusText",
		"response",
		"responseText",
		"responseXML"
	];
	const MockXMLHttpRequest = /** @class */ (function () {
		function MockXMLHttpRequest() {
			// 标记当前对象为 MockXMLHttpRequest
			this.mock = true;
			// 是否拦截 Ajax 请求
			this.match = false;
			this.timeout = 0;
			this.readyState = XHR_STATES.UNSENT;
			this.withCredentials = false;
			this.responseURL = "";
			this.status = XHR_STATES.UNSENT;
			this.statusText = "";
			// '', 'text', 'arraybuffer', 'blob', 'document', 'json'
			this.responseType = "";
			this.response = null;
			this.responseText = "";
			this.responseXML = "";
			this.UNSENT = XHR_STATES.UNSENT;
			this.OPENED = XHR_STATES.OPENED;
			this.HEADERS_RECEIVED = XHR_STATES.HEADERS_RECEIVED;
			this.LOADING = XHR_STATES.LOADING;
			this.DONE = XHR_STATES.DONE;
			// 初始化 custom 对象，用于存储自定义属性
			this.custom = {
				events: {},
				requestHeaders: {},
				responseHeaders: {},
				timeout: 0,
				options: {},
				xhr: createNativeXHR(),
				template: null,
				async: true
			};
			this.upload = this.custom.xhr.upload;
		}
		MockXMLHttpRequest.prototype.open = function (method, url, async, username, password) {
			const _this = this;
			console.log("走了拦截的方法")
			if (async === void 0) { async = true; }
			Object.assign(this.custom, {
				method,
				url,
				async: typeof async === "boolean" ? async : true,
				username,
				password,
				options: {
					url,
					type: method
				}
			});
			this.custom.timeout = setting.parseTimeout();
			// 查找与请求参数匹配的数据模板
			const {options} = this.custom;
			const item = mocked.find(options.url, options.type);
			// 如果未找到匹配的数据模板，则采用原生 XHR 发送请求。
			if (!item) {
				const xhr_1 = this.custom.xhr;
				// 初始化所有事件，用于监听原生 XHR 对象的事件
				for (const XHR_EVENT of XHR_EVENTS) {
					xhr_1.addEventListener(XHR_EVENT, (event) => {
						// 同步属性 NativeXMLHttpRequest => MockXMLHttpRequest
						XHR_RESPONSE_PROPERTIES.forEach((prop) => {
							try {
								_this[prop] = xhr_1[prop];
							} catch { }
						});
						// 触发 MockXMLHttpRequest 上的同名事件
						_this.dispatchEvent(createCustomEvent(event.type));
					});
				}
				// xhr.open()
				if (username) {
					xhr_1.open(method, url, async, username, password);
				} else {
					xhr_1.open(method, url, async);
				}
				return;
			}
			// 找到了匹配的数据模板，开始拦截 XHR 请求
			this.match = true;
			this.custom.template = item;
			this.readyState = XHR_STATES.OPENED;
			this.dispatchEvent(createCustomEvent("readystatechange"));
		};
		// Combines a header in author request headers.
		MockXMLHttpRequest.prototype.setRequestHeader = function (name, value) {
			// 原生 XHR
			if (!this.match) {
				this.custom.xhr.setRequestHeader(name, value);
				return;
			}
			// 拦截 XHR
			const {requestHeaders} = this.custom;
			if (requestHeaders[name]) {
				requestHeaders[name] += `,${  value}`;
			} else {
				requestHeaders[name] = value;
			}
		};
		// Initiates the request.
		MockXMLHttpRequest.prototype.send = function (data) {
			const _this = this;
			this.custom.options.body = data;
			this.custom.options.headers = this.custom.requestHeaders;
			// 原生 XHR
			if (!this.match) {
				console.log("原生方法send")
				// 同步属性 MockXMLHttpRequest => NativeXMLHttpRequest
				XHR_REQUEST_PROPERTIES.forEach((prop) => {
					try {
						_this.custom.xhr[prop] = _this[prop];
					} catch { }
				});
				this.custom.xhr.send(data);
				return;
			}
			// 拦截 XHR
			// X-Requested-With header
			console.log("走了拦截的方法send")
			this.setRequestHeader("X-Requested-With", "MockXMLHttpRequest");
			// loadstart The fetch initiates.
			this.dispatchEvent(createCustomEvent("loadstart"));
			const done = function () {
				_this.readyState = XHR_STATES.HEADERS_RECEIVED;
				_this.dispatchEvent(createCustomEvent("readystatechange"));
				_this.readyState = XHR_STATES.LOADING;
				_this.dispatchEvent(createCustomEvent("readystatechange"));
				_this.status = 200;
				_this.statusText = "OK";
				// fix #92 #93 by @qddegtya
				const mockResponse = mocked.convert(_this.custom.template, _this.custom.options);
				_this.response = _this.responseText = JSON.stringify(mockResponse);
				_this.readyState = XHR_STATES.DONE;
				_this.dispatchEvent(createCustomEvent("readystatechange"));
				_this.dispatchEvent(createCustomEvent("load"));
				_this.dispatchEvent(createCustomEvent("loadend"));
			};
			if (this.custom.async) {
				// 异步
				setTimeout(done, this.custom.timeout);
			} else {
				// 同步
				done();
			}
		};
		// https://xhr.spec.whatwg.org/#the-abort()-method
		// Cancels any network activity.
		MockXMLHttpRequest.prototype.abort = function () {
			// 原生 XHR
			if (!this.match) {
				this.custom.xhr.abort();
				return;
			}
			// 拦截 XHR
			this.readyState = XHR_STATES.UNSENT;
			this.dispatchEvent(createCustomEvent("abort", false, false, this));
			this.dispatchEvent(createCustomEvent("error", false, false, this));
		};
		// https://xhr.spec.whatwg.org/#the-getresponseheader()-method
		MockXMLHttpRequest.prototype.getResponseHeader = function (name) {
			// 原生 XHR
			if (!this.match) {
				return this.custom.xhr.getResponseHeader(name);
			}
			// 拦截 XHR
			return this.custom.responseHeaders[name.toLowerCase()];
		};
		// https://xhr.spec.whatwg.org/#the-getallresponseheaders()-method
		// http://www.utf8-chartable.de/
		MockXMLHttpRequest.prototype.getAllResponseHeaders = function () {
			// 原生 XHR
			if (!this.match) {
				return this.custom.xhr.getAllResponseHeaders();
			}
			// 拦截 XHR
			const {responseHeaders} = this.custom;
			let headers = "";
			for (const h in responseHeaders) {
				if (!responseHeaders.hasOwnProperty(h)) {
					continue;
				}
				headers += `${h  }: ${  responseHeaders[h]  }\r\n`;
			}
			return headers;
		};
		MockXMLHttpRequest.prototype.overrideMimeType = function () { };
		MockXMLHttpRequest.prototype.addEventListener = function (type, handle) {
			const {events} = this.custom;
			if (!events[type]) {
				events[type] = [];
			}
			events[type].push(handle);
		};
		MockXMLHttpRequest.prototype.removeEventListener = function (type, handle) {
			const handles = this.custom.events[type] || [];
			for (let i = 0; i < handles.length; i++) {
				if (handles[i] === handle) {
					handles.splice(i--, 1);
				}
			}
		};
		MockXMLHttpRequest.prototype.dispatchEvent = function (event) {
			const handles = this.custom.events[event.type] || [];
			for (const handle of handles) {
				handle.call(this, event);
			}
			const onType = `on${  event.type}`;
			if (this[onType]) {
				this[onType](event);
			}
		};
		MockXMLHttpRequest.UNSENT = XHR_STATES.UNSENT;
		MockXMLHttpRequest.OPENED = XHR_STATES.OPENED;
		MockXMLHttpRequest.HEADERS_RECEIVED = XHR_STATES.HEADERS_RECEIVED;
		MockXMLHttpRequest.LOADING = XHR_STATES.LOADING;
		MockXMLHttpRequest.DONE = XHR_STATES.DONE;
		MockXMLHttpRequest.__MOCK__ = false;
		return MockXMLHttpRequest;
	}());
	// Inspired by jQuery
	function createNativeXHR() {
		const localProtocolRE = /^(?:about|app|app-storage|.+-extension|file|res|widget):$/;
		const isLocal = localProtocolRE.test(location.protocol);
		return window.ActiveXObject
			? (!isLocal && createStandardXHR()) || createActiveXHR()
			: createStandardXHR();
		function createStandardXHR() {
			try {
				return new _XMLHttpRequest();
			} catch { }
		}
		function createActiveXHR() {
			try {
				return new window.ActiveXObject("Microsoft.XMLHTTP");
			} catch { }
		}
	}
	function overrideXHR() {
		if (!MockXMLHttpRequest.__MOCK__) {
			MockXMLHttpRequest.__MOCK__ = true;
			console.log("已经替换了");
			window.XMLHttpRequest = MockXMLHttpRequest;
		}
	}

	const _nativeFetch = fetch;
	const _nativeRequest = Request;
	function extendRequest(request, input, init) {
		if (isString(input)) {
			request._actualUrl = input;
		}
		if (init && init.body) {
			request._actualBody = init.body;
		}
		if (input instanceof _nativeRequest && !init) {
			request._actualUrl = input._actualUrl;
			request._actualBody = input._actualBody;
		}
		return request;
	}
	let MockRequest;
	/**
		* 拦截 window.Request 实例化
		* 原生 Request 对象被实例化后，对 request.url 取值得到的是拼接后的 url:
		*   const request = new Request('/path/to')
		*   console.log(request.url) => 'http://example.com/path/to'
		* 原生 Request 对象被实例化后，对 request.body 取值得到的是 undefined:
		*   const request = new Request('/path/to', { method: 'POST', body: 'foo=1' })
		*   console.log(request.body) => undefined
		*/
	if (window.Proxy) {
		MockRequest = new Proxy(_nativeRequest, {
			construct (target, _a) {
				const input = _a[0]; const init = _a[1];
				const request = new target(input, init);
				return extendRequest(request, input, init);
			}
		});
	} /* istanbul ignore next */
	else {
		MockRequest = function MockRequest(input, init) {
			const request = new _nativeRequest(input, init);
			return extendRequest(request, input, init);
		};
		MockRequest.prototype = _nativeRequest.prototype;
	}
	// 拦截 fetch 方法
	// https://developer.mozilla.org/zh-CN/docs/Web/API/WindowOrWorkerGlobalScope/fetch
	function MockFetch(input, init) {
		let request;
		request = input instanceof Request && !init ? input : new Request(input, init);
		// 收集请求头
		const headers = {};
		request.headers.forEach((value, key) => {
			headers[key] = value;
		});
		// 优先获取自己扩展的 _actualUrl 和 _actualBody
		const options = {
			url: request._actualUrl || request.url,
			type: request.method,
			body: request._actualBody || request.body || null,
			headers
		};
		// 查找与请求参数匹配的数据模板
		const item = mocked.find(options.url, options.type);
		// 如果未找到匹配的数据模板，则采用原生 fetch 发送请求。
		if (!item) {
			return _nativeFetch(input, init);
		}
		// 找到了匹配的数据模板，拦截 fetch 请求
		const body = JSON.stringify(mocked.convert(item, options));
		const response = new Response(body, {
			status: 200,
			statusText: "ok",
			headers: request.headers
		});
		// 异步返回数据
		return new Promise((resolve) => {
			setTimeout(() => {
				resolve(response);
			}, setting.parseTimeout());
		});
	}
	function overrideFetchAndRequest() {
		if (window.fetch && !MockRequest.__MOCK__) {
			MockRequest.__MOCK__ = true;
			window.Request = MockRequest;
			window.fetch = MockFetch;
		}
	}

	// For browser
	const Mock = {
		Handler: handler$1,
		Random: random,
		Transfer: transfer,
		Util,
		XHR: MockXMLHttpRequest,
		RE,
		toJSONSchema,
		valid,
		mock,
		heredoc,
		setup: setting.setup.bind(setting),
		_mocked: mocked.getMocked(),
		version: "0.3.2"
	};
	// 根据数据模板生成模拟数据。
	function mock(rurl, rtype, template) {
		assert(arguments.length, "The mock function needs to pass at least one parameter!");
		// Mock.mock(template)
		if (arguments.length === 1) {
			return handler$1.gen(rurl);
		}
		// Mock.mock(url, template)
		if (arguments.length === 2) {
			template = rtype;
			rtype = undefined;
		}
		// 拦截 XHR
		overrideXHR();
		// 拦截fetch
		overrideFetchAndRequest();
		const key = String(rurl) + String(rtype);
		mocked.set(key, { rurl, rtype, template });
		return Mock;
	}

	return Mock;
}));
