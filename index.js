(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('react'), require('prop-types')) :
	typeof define === 'function' && define.amd ? define(['exports', 'react', 'prop-types'], factory) :
	(factory((global.houndstooth = {}),global.React,global.PropTypes));
}(this, (function (exports,React,PropTypes) { 'use strict';

var React__default = 'default' in React ? React['default'] : React;
PropTypes = PropTypes && 'default' in PropTypes ? PropTypes['default'] : PropTypes;

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
/* global Reflect, Promise */

var extendStatics = Object.setPrototypeOf ||
    ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
    function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };

function __extends(d, b) {
    extendStatics(d, b);
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
}

var __assign = Object.assign || function __assign(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
    }
    return t;
};

/**
 * A simple data bus.
 */
var createBus = function (initial) {
    var channels = {};
    var nextAvailableId = 0;
    var state = initial;
    return {
        peek: function () { return state; },
        set: function (s) {
            state = s;
            for (var id in channels) {
                channels[id](state);
            }
        },
        listen: function (listener) {
            var id = nextAvailableId++;
            channels[id] = listener;
            return function () {
                delete channels[id];
            };
        },
    };
};
//# sourceMappingURL=bus.js.map

var ThemeProvider = (function (_super) {
    __extends(ThemeProvider, _super);
    function ThemeProvider(props) {
        var _this = _super.call(this, props) || this;
        _this.bus = createBus(props.theme);
        return _this;
    }
    ThemeProvider.prototype.getChildContext = function () {
        return {
            houndstooth: {
                themeBus: this.bus,
                styleSheet: this.props.styleSheet,
            },
        };
    };
    ThemeProvider.prototype.componentWillMount = function () {
        this.bus.set(this.props.theme);
    };
    ThemeProvider.prototype.componentWillReceiveProps = function (nextProps) {
        this.bus.set(nextProps.theme);
    };
    ThemeProvider.prototype.render = function () {
        return this.props.children
            ? React__default.Children.only(this.props.children)
            : null;
    };
    ThemeProvider.childContextTypes = {
        houndstooth: PropTypes.object.isRequired,
    };
    return ThemeProvider;
}(React__default.Component));

//# sourceMappingURL=ThemeProvider.js.map

var keyToCssRule = function (key) { return key
    .replace(/([A-Z])/g, '-$1')
    .toLowerCase()
    .replace(/^ms-/, '-ms'); };
var objectToCss = function (obj) {
    return Object
        .keys(obj)
        .map(function (key) {
        var value = obj[key];
        if (typeof value === 'object') {
            return key + " {\n  " + objectToCss(value) + "\n}";
        }
        return keyToCssRule(key) + ": " + value + ";";
    })
        .join('\n');
};

//# sourceMappingURL=objectToCss.js.map

// murmurhash2 via https://gist.github.com/raycmorgan/588423
// adapted to add types
var chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
function UInt32(str, pos) {
    return str.charCodeAt(pos++) + (str.charCodeAt(pos++) << 8) + (str.charCodeAt(pos++) << 16) + (str.charCodeAt(pos) << 24);
}
function UInt16(str, pos) {
    return str.charCodeAt(pos++) + (str.charCodeAt(pos++) << 8);
}
function Umul32(n, m) {
    n = n | 0;
    m = m | 0;
    var nlo = n & 0xffff;
    var nhi = n >>> 16;
    var res = nlo * m + ((nhi * m & 0xffff) << 16) | 0;
    return res;
}
function doHash(str, seed) {
    if (seed === void 0) { seed = 0; }
    var m = 0x5bd1e995;
    var r = 24;
    var h = seed ^ str.length;
    var length = str.length;
    var currentIndex = 0;
    while (length >= 4) {
        var k = UInt32(str, currentIndex);
        k = Umul32(k, m);
        k ^= k >>> r;
        k = Umul32(k, m);
        h = Umul32(h, m);
        h ^= k;
        currentIndex += 4;
        length -= 4;
    }
    switch (length) {
        case 3:
            h ^= UInt16(str, currentIndex);
            h ^= str.charCodeAt(currentIndex + 2) << 16;
            h = Umul32(h, m);
            break;
        case 2:
            h ^= UInt16(str, currentIndex);
            h = Umul32(h, m);
            break;
        case 1:
            h ^= str.charCodeAt(currentIndex);
            h = Umul32(h, m);
            break;
    }
    h ^= h >>> 13;
    h = Umul32(h, m);
    h ^= h >>> 15;
    var num = h >>> 0;
    var str = '';
    while (num) {
        str = '' + chars[num % chars.length] + str;
        num = Math.floor(num / chars.length);
    }
    return str;
}
//# sourceMappingURL=hash.js.map

function isComponentStateless(comp) {
    return !comp.prototype.render;
}
function areStylesStatic(styles) {
    return typeof styles === 'object';
}
function areStylesDynamic(styles) {
    return typeof styles === 'function';
}
var id = 0;
var COMPONENT_ID_TO_CLASSNAMES = {};
var styled$1 = function (tag) { return function () {
    var styles = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        styles[_i] = arguments[_i];
    }
    var visited = false;
    var staticClassNames = [];
    var dynamicRules = [];
    return _a = (function (_super) {
            __extends(Styled, _super);
            function Styled(props) {
                var _this = _super.call(this, props) || this;
                _this.state = {
                    theme: null
                };
                return _this;
            }
            Styled.prototype.componentWillMount = function () {
                if (this.context.houndstooth && this.context.houndstooth.themeBus) {
                    var theme = this.context.houndstooth.themeBus.peek();
                    this.setState({
                        theme: theme,
                    });
                }
            };
            Styled.prototype.componentDidMount = function () {
                var _this = this;
                if (this.context.houndstooth && this.context.houndstooth.themeBus) {
                    this.cleanUp = this.context.houndstooth.themeBus.listen(function (theme) {
                        _this.setState({
                            theme: theme,
                        });
                    });
                }
            };
            Styled.prototype.componentWillUnmount = function () {
                if (this.cleanUp)
                    this.cleanUp();
            };
            Styled.prototype.shouldComponentUpdate = function (nextProps, nextState) {
                if (nextState.theme !== this.state.theme)
                    return true;
                if (nextProps === this.props)
                    return false;
                if (Object.keys(nextProps).length !== Object.keys(this.props).length)
                    return true;
                for (var key in nextProps) {
                    if (nextProps[key] !== this.props[key])
                        return true;
                }
                return false;
            };
            Styled.prototype.generateClassName = function (theme) {
                var _this = this;
                var staticStyles = styles.filter(areStylesStatic);
                var dynamicStyles = styles.filter(areStylesDynamic);
                var styleSheet = this.context.houndstooth ? this.context.houndstooth.styleSheet : null;
                var classNames = [];
                var inheritingComponentStyles = typeof tag !== 'string'
                    ? COMPONENT_ID_TO_CLASSNAMES[tag.id]
                    : null;
                var after = inheritingComponentStyles
                    ? inheritingComponentStyles.orderedList[inheritingComponentStyles.orderedList.length - 1]
                    : undefined;
                if (visited) {
                    classNames = classNames.concat(staticClassNames);
                }
                else {
                    visited = true;
                    staticStyles
                        .forEach(function (styles) {
                        var css = objectToCss(styles);
                        var className = "h-" + doHash(css);
                        classNames.push(className);
                        staticClassNames.push(className);
                        if (!styleSheet)
                            return;
                        var rule = styleSheet.inject(className, css, after);
                        after = rule.className;
                    });
                }
                dynamicStyles
                    .forEach(function (styles, index) {
                    var css = objectToCss(styles(__assign({}, _this.props, { theme: theme || {} })));
                    var className = "h-" + doHash(css);
                    classNames.push(className);
                    if (!styleSheet)
                        return;
                    if (dynamicRules[index]) {
                        dynamicRules[index] = styleSheet.replace(dynamicRules[index], className, css);
                    }
                    else {
                        var rule = styleSheet.inject(className, css, after);
                        after = rule.className;
                        dynamicRules.push(rule);
                    }
                });
                var uniqueClassNames = inheritingComponentStyles
                    ? classNames.filter(function (str) { return !inheritingComponentStyles.lookup.has(str); })
                    : classNames;
                var totalClassNames = inheritingComponentStyles
                    ? inheritingComponentStyles.orderedList.concat(uniqueClassNames)
                    : classNames;
                COMPONENT_ID_TO_CLASSNAMES[Styled.id] = {
                    orderedList: uniqueClassNames,
                    unique: uniqueClassNames,
                    lookup: new Set(totalClassNames),
                };
                return uniqueClassNames;
            };
            Styled.prototype.render = function () {
                var className = this.props.className;
                var computedClassNames = this.generateClassName(this.state.theme);
                var classNameSum = computedClassNames.concat(className).join(' ');
                var baseProps = __assign({}, this.props, { className: classNameSum });
                if (typeof tag === 'string')
                    return React.createElement(tag, baseProps);
                var componentProps = __assign({}, baseProps, { theme: this.state.theme });
                if (isComponentStateless(tag))
                    return React.createElement(tag, componentProps);
                return React.createElement(tag, componentProps);
            };
            return Styled;
        }(React__default.Component)),
        _a.contextTypes = {
            houndstooth: PropTypes.object,
        },
        _a.id = id++,
        _a;
    var _a;
}; };

//# sourceMappingURL=styled.js.map

function createCommonjsModule(fn, module) {
	return module = { exports: {} }, fn(module, module.exports), module.exports;
}

var stylis = createCommonjsModule(function (module, exports) {
/*
 *          __        ___
 *    _____/ /___  __/ (_)____
 *   / ___/ __/ / / / / / ___/
 *  (__  ) /_/ /_/ / / (__  )
 * /____/\__/\__, /_/_/____/
 *          /____/
 *
 * light - weight css preprocessor @licence MIT
 */
/* eslint-disable */
(function (factory) {
	module['exports'] = factory(null);
}(/** @param {*=} options */function factory (options) {

	'use strict';

	/**
	 * Notes
	 *
	 * The ['<method name>'] pattern is used to support closure compiler
	 * the jsdoc signatures are also used to the same effect
	 *
	 * ---- 
	 *
	 * int + int + int === n4 [faster]
	 *
	 * vs
	 *
	 * int === n1 && int === n2 && int === n3
	 *
	 * ----
	 *
	 * switch (int) { case ints...} [faster]
	 *
	 * vs
	 *
	 * if (int == 1 && int === 2 ...)
	 *
	 * ----
	 *
	 * The (first*n1 + second*n2 + third*n3) format used in the property parser
	 * is a simple way to hash the sequence of characters
	 * taking into account the index they occur in
	 * since any number of 3 character sequences could produce duplicates.
	 *
	 * On the other hand sequences that are directly tied to the index of the character
	 * resolve a far more accurate measure, it's also faster
	 * to evaluate one condition in a switch statement
	 * than three in an if statement regardless of the added math.
	 *
	 * This allows the vendor prefixer to be both small and fast.
	 */

	var nullptn = /^\0+/g; /* matches leading null characters */
	var formatptn = /[\0\r\f]/g; /* matches new line, null and formfeed characters */
	var colonptn = /: */g; /* splits animation rules */
	var cursorptn = /zoo|gra/; /* assert cursor varient */
	var transformptn = /([,: ])(transform)/g; /* vendor prefix transform, older webkit */
	var animationptn = /,+\s*(?![^(]*[)])/g; /* splits multiple shorthand notation animations */
	var propertiesptn = / +\s*(?![^(]*[)])/g; /* animation properties */
	var elementptn = / *[\0] */g; /* selector elements */
	var selectorptn = /,\r+?/g; /* splits selectors */
	var andptn = /([\t\r\n ])*\f?&/g; /* match & */
	var escapeptn = /:global\(((?:[^\(\)\[\]]*|\[.*\]|\([^\(\)]*\))*)\)/g; /* matches :global(.*) */
	var invalidptn = /\W+/g; /* removes invalid characters from keyframes */
	var keyframeptn = /@(k\w+)\s*(\S*)\s*/; /* matches @keyframes $1 */
	var plcholdrptn = /::(place)/g; /* match ::placeholder varient */
	var readonlyptn = /:(read-only)/g; /* match :read-only varient */
	var beforeptn = /\s+(?=[{\];=:>])/g; /* matches \s before ] ; = : */
	var afterptn = /([[}=:>])\s+/g; /* matches \s after characters [ } = : */
	var tailptn = /(\{[^{]+?);(?=\})/g; /* matches tail semi-colons ;} */
	var whiteptn = /\s{2,}/g; /* matches repeating whitespace */
	var pseudoptn = /([^\(])(:+) */g; /* pseudo element */
	var writingptn = /[svh]\w+-[tblr]{2}/; /* match writing mode property values */

	/* vendors */
	var webkit = '-webkit-';
	var moz = '-moz-';
	var ms = '-ms-';

	/* character codes */
	var SEMICOLON = 59; /* ; */
	var CLOSEBRACES = 125; /* } */
	var OPENBRACES = 123; /* { */
	var OPENPARENTHESES = 40; /* ( */
	var CLOSEPARENTHESES = 41; /* ) */
	var OPENBRACKET = 91; /* [ */
	var CLOSEBRACKET = 93; /* ] */
	var NEWLINE = 10; /* \n */
	var CARRIAGE = 13; /* \r */
	var TAB = 9; /* \t */
	var AT = 64; /* @ */
	var SPACE = 32; /*   */
	var AND = 38; /* & */
	var DASH = 45; /* - */
	var UNDERSCORE = 95; /* _ */
	var STAR = 42; /* * */
	var COMMA = 44; /* , */
	var COLON = 58; /* : */
	var SINGLEQUOTE = 39; /* ' */
	var DOUBLEQUOTE = 34; /* " */
	var FOWARDSLASH = 47; /* / */
	var GREATERTHAN = 62; /* > */
	var PLUS = 43; /* + */
	var TILDE = 126; /* ~ */
	var NULL = 0; /* \0 */
	var FORMFEED = 12; /* \f */
	var VERTICALTAB = 11; /* \v */

	/* special identifiers */
	var KEYFRAME = 107; /* k */
	var MEDIA = 109; /* m */
	var SUPPORTS = 115; /* s */
	var PLACEHOLDER = 112; /* p */
	var READONLY = 111; /* o */
	var IMPORT = 169; /* <at>i */
	var CHARSET = 163; /* <at>c */
	var DOCUMENT = 100; /* <at>d */

	var column = 1; /* current column */
	var line = 1; /* current line numebr */
	var pattern = 0; /* :pattern */

	var cascade = 1; /* #id h1 h2 vs h1#id h2#id  */
	var vendor = 1; /* vendor prefix */
	var escape = 1; /* escape :global() pattern */
	var compress = 0; /* compress output */
	var semicolon = 0; /* no/semicolon option */
	var preserve = 0; /* preserve empty selectors */

	/* empty reference */
	var array = [];

	/* plugins */
	var plugins = [];
	var plugged = 0;

	/* plugin context */
	var POSTS = -2;
	var PREPS = -1;
	var UNKWN = 0;
	var PROPS = 1;
	var BLCKS = 2;
	var ATRUL = 3;

	/* plugin newline context */
	var unkwn = 0;

	/* keyframe animation */
	var keyed = 1;
	var key = '';

	/* selector namespace */
	var nscopealt = '';
	var nscope = '';

	/**
	 * Compile
	 *
	 * @param {Array<string>} parent
	 * @param {Array<string>} current
	 * @param {string} body
	 * @param {number} id
	 * @return {string}
	 */
	function compile (parent, current, body, id) {
		var bracket = 0; /* brackets [] */
		var comment = 0; /* comments /* // or /* */
		var parentheses = 0; /* functions () */
		var quote = 0; /* quotes '', "" */

		var first = 0; /* first character code */
		var second = 0; /* second character code */
		var code = 0; /* current character code */
		var tail = 0; /* previous character code */
		var trail = 0; /* character before previous code */
		var peak = 0; /* previous non-whitespace code */
		
		var counter = 0; /* count sequence termination */
		var context = 0; /* track current context */
		var atrule = 0; /* track @at-rule context */
		var pseudo = 0; /* track pseudo token index */
		var caret = 0; /* current character index */
		var format = 0; /* control character formating context */
		var insert = 0; /* auto semicolon insertion */
		var invert = 0; /* inverted selector pattern */
		var length = 0; /* generic length address */
		var eof = body.length; /* end of file(length) */
		var eol = eof - 1; /* end of file(characters) */

		var char = ''; /* current character */
		var chars = ''; /* current buffer of characters */
		var child = ''; /* next buffer of characters */
		var out = ''; /* compiled body */
		var children = ''; /* compiled children */
		var flat = ''; /* compiled leafs */
		var selector; /* generic selector address */
		var result; /* generic address */

		// ...build body
		while (caret < eof) {
			code = body.charCodeAt(caret);

			if (comment + quote + parentheses + bracket === 0) {
				// eof varient
				if (caret === eol) {
					if (format > 0) {
						chars = chars.replace(formatptn, '');
					}

					if ((chars = chars.trim()).length > 0) {
						switch (code) {
							case SPACE:
							case TAB:
							case SEMICOLON:
							case CARRIAGE:
							case NEWLINE: {
								break
							}
							default: {
								chars += body.charAt(caret);
							}
						}

						code = SEMICOLON;
					}
				}

				// auto semicolon insertion
				if (insert === 1) {
					switch (code) {
						// false flags
						case OPENBRACES:
						case COMMA: {
							insert = 0;
							break
						}
						// ignore
						case TAB:
						case CARRIAGE:
						case NEWLINE:
						case SPACE: {
							break
						}
						// valid
						default: {
							caret--;
							code = SEMICOLON;
						}
					}
				}

				// token varient
				switch (code) {
					case OPENBRACES: {
						chars = chars.trim();
						first = chars.charCodeAt(0);
						counter = 1;
						caret++;

						while (caret < eof) {
							code = body.charCodeAt(caret);

							switch (code) {
								case OPENBRACES: {
									counter++;
									break
								}
								case CLOSEBRACES: {
									counter--;
									break
								}
							}

							if (counter === 0) {
								break
							}

							child += body.charAt(caret++);
						}

						if (first === NULL) {
							first = (chars = chars.replace(nullptn, '').trim()).charCodeAt(0);
						}

						switch (first) {
							// @at-rule
							case AT: {
								if (format > 0) {
									chars = chars.replace(formatptn, '');
								}

								second = chars.charCodeAt(1);

								switch (second) {
									case DOCUMENT:
									case MEDIA:
									case SUPPORTS: {
										selector = current;
										break
									}
									default: {
										selector = array;
									}
								}

								child = compile(current, selector, child, second);
								length = child.length;

								// preserve empty @at-rule
								if (preserve > 0 && length === 0) {
									length = chars.length;
								}

								// execute plugins, @at-rule context
								if (plugged > 0) {
									selector = select(array, chars, invert);
									result = proxy(ATRUL, child, selector, current, line, column, length, second);
									chars = selector.join('');

									if (result !== void 0) {
										if ((length = (child = result.trim()).length) === 0) {
											second = 0;
											child = '';
										}
									}
								}

								if (length > 0) {
									switch (second) {
										case DOCUMENT:
										case MEDIA:
										case SUPPORTS: {
											child = chars + '{' + child + '}';
											break
										}
										case KEYFRAME: {
											chars = chars.replace(keyframeptn, '$1 $2' + (keyed > 0 ? key : ''));
											child = chars + '{' + child + '}';
											child = '@' + (vendor > 0 ? webkit + child + '@' + child : child);
											break
										}
										default: {
											child = chars + child;
										}
									}
								} else {
									child = '';
								}

								break
							}
							// selector
							default: {
								child = compile(current, select(current, chars, invert), child, id);
							}
						}

						children += child;

						// reset
						context = 0;
						insert = 0;
						pseudo = 0;
						format = 0;
						invert = 0;
						atrule = 0;
						chars = '';
						child = '';

						caret++;
						break
					}
					case CLOSEBRACES:
					case SEMICOLON: {
						chars = (format > 0 ? chars.replace(formatptn, '') : chars).trim();
						
						if (code !== CLOSEBRACES || chars.length > 0) {
							// monkey-patch missing colon
							if (pseudo === 0) {
								first = chars.charCodeAt(0);

								// first character is a letter or dash, buffer has a space character
								if ((first === DASH || first > 96 && first < 123) && chars.indexOf(' ')) {
									chars = chars.replace(' ', ': ');
								}
							}

							// execute plugins, property context
							if (plugged > 0) {
								if ((result = proxy(PROPS, chars, current, parent, line, column, out.length, id)) !== void 0) {
									if ((chars = result.trim()).length === 0) {
										chars = '\0\0';
									}
								}
							}

							first = chars.charCodeAt(0);
							second = chars.charCodeAt(1);

							switch (first + second) {
								case NULL: {
									break
								}
								case IMPORT:
								case CHARSET: {
									flat += chars + body.charAt(caret);
									break
								}
								default: {
									out += pseudo > 0 ? property(chars, first, second, chars.charCodeAt(2)) : chars + ';';
								}
							}
						}

						// reset
						context = 0;
						insert = 0;
						pseudo = 0;
						format = 0;
						invert = 0;
						chars = '';

						caret++;
						break
					}
				}
			}

			// parse characters
			switch (code) {
				case CARRIAGE:
				case NEWLINE: {
					// auto insert semicolon
					if (comment + quote + parentheses + bracket + semicolon === 0) {
						// valid non-whitespace characters that
						// may precede a newline
						switch (peak) {
							case AT:
							case TILDE:
							case GREATERTHAN:
							case STAR:
							case PLUS:
							case FOWARDSLASH:
							case DASH:
							case COLON:
							case COMMA:
							case SEMICOLON:
							case OPENBRACES:
							case CLOSEBRACES: {
								break
							}
							default: {
								// current buffer has a colon
								if (pseudo > 0) {
									insert = 1;
								}
							}
						}
					}

					// terminate line comment
					if (comment === FOWARDSLASH) {
						comment = 0;
					}

					// execute plugins, newline context
					if (plugged * unkwn > 0) {
						proxy(UNKWN, chars, current, parent, line, column, out.length, id);
					}

					// next line, reset column position
					column = 1;
					line++;

					break
				}
				default: {
					// increment column position
					column++;

					// current character
					char = body.charAt(caret);

					if (code === TAB && quote === 0) {
						switch (tail) {
							case TAB:
							case SPACE: {
								char = '';
								break
							}
							default: {
								char = parentheses === 0 ? '' : ' ';
							}
						}
					}
						
					// remove comments, escape functions, strings, attributes and prepare selectors
					switch (code) {
						// escape breaking control characters
						case NULL: {
							char = '\\0';
							break
						}
						case FORMFEED: {
							char = '\\f';
							break
						}
						case VERTICALTAB: {
							char = '\\v';
							break
						}
						// &
						case AND: {
							// inverted selector pattern i.e html &
							if (quote + comment + bracket === 0 && cascade > 0) {
								invert = 1;
								format = 1;
								char = '\f' + char;
							}
							break
						}
						// ::p<l>aceholder, l
						// :read-on<l>y, l
						case 108: {
							if (quote + comment + bracket + pattern === 0 && pseudo > 0) {
								switch (caret - pseudo) {
									// ::placeholder
									case 2: {
										if (tail === PLACEHOLDER && body.charCodeAt(caret-3) === COLON) {
											pattern = tail;
										}
									}
									// :read-only
									case 8: {
										if (trail === READONLY) {
											pattern = trail;
										}
									}
								}
							}
							break
						}
						// :<pattern>
						case COLON: {
							if (quote + comment + bracket === 0) {
								pseudo = caret;
							}
							break
						}
						// selectors
						case COMMA: {
							if (comment + parentheses + quote + bracket === 0) {
								format = 1;
								char += '\r';
							}
							break
						}
						// quotes
						case DOUBLEQUOTE: {
							if (comment === 0) {
								quote = quote === code ? 0 : (quote === 0 ? code : quote);
							}
							break
						}
						case SINGLEQUOTE: {
							if (comment === 0) {
								quote = quote === code ? 0 : (quote === 0 ? code : quote);
							}
							break
						}
						// attributes
						case OPENBRACKET: {
							if (quote + comment + parentheses === 0) {
								bracket++;
							}
							break
						}
						case CLOSEBRACKET: {
							if (quote + comment + parentheses === 0) {
								bracket--;
							}
							break
						}
						// functions
						case CLOSEPARENTHESES: {
							if (quote + comment + bracket === 0) {
								// ) is the last character, add synthetic padding to avoid skipping this buffer
								if (caret === eol) {
									eol++;
									eof++;
								}

								parentheses--;
							}
							break
						}
						case OPENPARENTHESES: {
							if (quote + comment + bracket === 0) {
								if (context === 0) {
									switch (tail*2 + trail*3) {
										// :matches
										case 533: {
											break
										}
										// :global, :not, :nth-child etc...
										default: {
											counter = 0;
											context = 1;
										}
									}
								}

								parentheses++;
							}
							break
						}
						case AT: {
							if (comment + parentheses + quote + bracket + pseudo + atrule === 0) {
								atrule = 1;
							}
							break
						}
						// block/line comments
						case STAR:
						case FOWARDSLASH: {
							if (quote + bracket + parentheses > 0) {
								break
							}

							switch (comment) {
								// initialize line/block comment context
								case 0: {
									switch (code*2 + body.charCodeAt(caret+1)*3) {
										// //
										case 235: {
											comment = FOWARDSLASH;
											break
										}
										// /*
										case 220: {
											comment = STAR;
											break
										}
									}
									break
								}
								// end block comment context
								case STAR: {
									if (code === FOWARDSLASH && tail === STAR) {
										char = '';
										comment = 0;
									}
								}
							}
						}
					}

					// ignore comment blocks
					if (comment === 0) {
						// aggressive isolation mode, divide each individual selector
						// including selectors in :not function but excluding selectors in :global function
						if (cascade + quote + bracket + atrule === 0 && id !== KEYFRAME && code !== SEMICOLON) {
							switch (code) {
								case COMMA:
								case TILDE:
								case GREATERTHAN:
								case PLUS:
								case CLOSEPARENTHESES:
								case OPENPARENTHESES: {
									if (context === 0) {
										// outside of an isolated context i.e nth-child(<...>)
										switch (tail) {
											case TAB:
											case SPACE:
											case NEWLINE:
											case CARRIAGE: {
												char = char + '\0';
												break
											}
											default: {
												char = '\0' + char + (code === COMMA ? '' : '\0');
											}
										}
										format = 1;
									} else {
										// within an isolated context, sleep untill it's terminated
										switch (code) {
											case OPENPARENTHESES: {
												context = ++counter;
												break
											}
											case CLOSEPARENTHESES: {
												if ((context = --counter) === 0) {
													format = 1;
													char += '\0';
												}
												break
											}
										}
									}
									break
								}
								case SPACE: {
									switch (tail) {
										case NULL:
										case OPENBRACES:
										case CLOSEBRACES:
										case SEMICOLON:
										case COMMA:
										case FORMFEED:
										case TAB:
										case SPACE:
										case NEWLINE:
										case CARRIAGE: {
											break
										}
										default: {
											// ignore in isolated contexts
											if (context === 0) {
												format = 1;
												char += '\0';
											}
										}
									}
								}
							}
						}

						// concat buffer of characters
						chars += char;

						// previous non-whitespace character code
						if (code !== SPACE) {
							peak = code;
						}
					}
				}
			}

			// tail character codes
			trail = tail;
			tail = code;

			// visit every character
			caret++;
		}

		length = out.length;

		// preserve empty selector
 		if (preserve > 0) {
 			if (length === 0 && children.length === 0 && (current[0].length === 0) === false) {
 				if (id !== MEDIA || (current.length === 1 && (cascade > 0 ? nscopealt : nscope) === current[0])) {
					length = current.join(',').length + 2; 					
 				}
 			}
		}

		if (length > 0) {
			// cascade isolation mode
			if (cascade === 0 && id !== KEYFRAME) {
				isolate(current);
			}

			// execute plugins, block context
			if (plugged > 0) {
				result = proxy(BLCKS, out, current, parent, line, column, length, id);

				if (result !== void 0 && (out = result).length === 0) {
					return flat + out + children
				}
			}		

			out = current.join(',') + '{' + out + '}';

			if (vendor*pattern > 0) {
				switch (pattern) {
					// ::read-only
					case READONLY: {
						out = out.replace(readonlyptn, ':'+moz+'$1')+out;
						break
					}
					// ::placeholder
					case PLACEHOLDER: {
						out = (
							out.replace(plcholdrptn, '::' + webkit + 'input-$1') +
							out.replace(plcholdrptn, '::' + moz + '$1') +
							out.replace(plcholdrptn, ':' + ms + 'input-$1') + out
						);
						break
					}
				}
				pattern = 0;
			}
		}

		return flat + out + children
	}

	/**
	 * Select
	 *
	 * @param {Array<string>} parent
	 * @param {string} current
	 * @param {number} invert
	 * @return {Array<string>}
	 */
	function select (parent, current, invert) {
		var selectors = current.trim().split(selectorptn);
		var out = selectors;

		var length = selectors.length;
		var l = parent.length;

		switch (l) {
			// 0-1 parent selectors
			case 0:
			case 1: {
				for (var i = 0, selector = l === 0 ? '' : parent[0] + ' '; i < length; i++) {
					out[i] = scope(selector, out[i], invert, l).trim();
				}
				break
			}
			// >2 parent selectors, nested
			default: {
				for (var i = 0, j = 0, out = []; i < length; i++) {
					for (var k = 0; k < l; k++) {
						out[j++] = scope(parent[k] + ' ', selectors[i], invert, l).trim();
					}
				}
			}
		}

		return out
	}

	/**
	 * Scope
	 *
	 * @param {string} parent
	 * @param {string} current
	 * @param {number} invert
	 * @param {number} level
	 * @return {string}
	 */
	function scope (parent, current, invert, level) {
		var selector = current;
		var code = selector.charCodeAt(0);

		// trim leading whitespace
		if (code < 33) {
			code = (selector = selector.trim()).charCodeAt(0);
		}

		switch (code) {
			// &
			case AND: {
				switch (cascade + level) {
					case 0:
					case 1: {
						if (parent.trim().length === 0) {
							break
						}
					}
					default: {
						return selector.replace(andptn, '$1'+parent.trim())
					}
				}
				break
			}
			// :
			case COLON: {
				switch (selector.charCodeAt(1)) {
					// g in :global
					case 103: {
						if (escape > 0 && cascade > 0) {
							return selector.replace(escapeptn, '$1').replace(andptn, '$1'+nscope)
						}
						break
					}
					default: {
						// :hover
						return parent.trim() + selector
					}
				}
			}
			default: {
				// html &
				if (invert*cascade > 0 && selector.indexOf('\f') > 0) {
					return selector.replace(andptn, (parent.charCodeAt(0) === COLON ? '' : '$1')+parent.trim())
				}
			}
		}

		return parent + selector
	}

	/**
	 * Property
	 *
	 * @param {string} input
	 * @param {number} first
	 * @param {number} second
	 * @param {number} third
	 * @return {string}
	 */
	function property (input, first, second, third) {
		var out = input + ';';
		var index = 0;
		var hash = (first*2) + (second*3) + (third*4);
		var cache;

		// animation: a, n, i characters
		if (hash === 944) {
			out = animation(out);
		} else if (vendor > 0) {
			// vendor prefix
			switch (hash) {
				// color/column, c, o, l
				case 963: {
					// column
					if (out.charCodeAt(5) === 110) {
						out = webkit + out + out;
					}
					break
				}
				// appearance: a, p, p
				case 978: {
					out = webkit + out + moz + out + out;
					break
				}
				// hyphens: h, y, p
				// user-select: u, s, e
				case 1019:
				case 983: {
					out = webkit + out + moz + out + ms + out + out;
					break
				}
				// background/backface-visibility, b, a, c
				case 883: {
					// backface-visibility, -
					if (out.charCodeAt(8) === DASH) {
						out = webkit + out + out;
					}
					break
				}
				// flex: f, l, e
				case 932: {
					out = webkit + out + ms + out + out;
					break
				}
				// order: o, r, d
				case 964: {
					out = webkit + out + ms + 'flex' + '-' + out + out;
					break
				}
				// justify-content, j, u, s
				case 1023: {
					cache = out.substring(out.indexOf(':', 15)).replace('flex-', '');
					out = webkit + 'box-pack' + cache + webkit + out + ms + 'flex-pack' + cache + out;
					break
				}
				// display(flex/inline-flex/inline-box): d, i, s
				case 975: {
					index = (out = input).length-10;
					cache = (out.charCodeAt(index) === 33 ? out.substring(0, index) : out).substring(8).trim();

					switch (hash = cache.charCodeAt(0) + (cache.charCodeAt(7)|0)) {
						// inline-
						case 203: {
							// inline-box
							if (cache.charCodeAt(8) > 110) {
								out = out.replace(cache, webkit+cache)+';'+out;
							}
							break
						}
						// inline-flex
						// flex
						case 207:
						case 102: {
							out = (
								out.replace(cache, webkit+(hash > 102 ? 'inline-' : '')+'box')+';'+
								out.replace(cache, webkit+cache)+';'+
								out.replace(cache, ms+cache+'box')+';'+
								out
							);
						}
					}
					
					out += ';';
					break
				}
				// align-items, align-center, align-self: a, l, i, -
				case 938: {
					if (out.charCodeAt(5) === DASH) {
						switch (out.charCodeAt(6)) {
							// align-items, i
							case 105: {
								cache = out.replace('-items', '');
								out = webkit + out + webkit + 'box-' + cache + ms + 'flex-' + cache + out;
								break
							}
							// align-self, s
							case 115: {
								out = webkit + out + ms + 'flex-item-' + out.replace('-self', '') + out;
								break
							}
							// align-content
							default: {
								out = webkit + out + ms + 'flex-line-pack' + out.replace('align-content', '') + out;
							}
						}
					}
					break
				}
				// cursor, c, u, r
				case 1005: {
					if (cursorptn.test(out)) {
						out = out.replace(colonptn, ': ' + webkit) + out.replace(colonptn, ': ' + moz) + out;
					}
					break
				}
				// width: min-content / width: max-content
				case 953: {
					if ((index = out.indexOf('-content', 9)) > 0) {
						// width: min-content / width: max-content
						cache = out.substring(index - 3);
						out = 'width:' + webkit + cache + 'width:' + moz + cache + 'width:' + cache;
					}
					break
				}
				// text-size-adjust: t, e, x
				case 1015: {
					if (input.charCodeAt(9) !== DASH) {
						break
					}
				}
				// transform, transition: t, r, a
				case 962: {
					out = webkit + out + (out.charCodeAt(5) === 102 ? ms + out : '') + out;

					// transitions
					if (second + third === 211 && out.charCodeAt(13) === 105 && out.indexOf('transform', 10) > 0) {
						out = out.substring(0, out.indexOf(';', 27) + 1).replace(transformptn, '$1' + webkit + '$2') + out;
					}

					break
				}
				// writing-mode, w, r, i
				case 1000: {
					cache = out.substring(13).trim();
					index = cache.indexOf('-')+1;

					switch (cache.charCodeAt(0)+cache.charCodeAt(index)) {
						// vertical-lr
						case 226: {
							cache = out.replace(writingptn, 'tb');
							break
						}
						// vertical-rl
						case 232: {
							cache = out.replace(writingptn, 'tb-rl');
							break
						}
						// horizontal-tb
						case 220: {
							cache = out.replace(writingptn, 'lr');
							break
						}
						default: {
							return out
						}
					}

					out = webkit+out+ms+cache+out;
					break
				}
			}
		}

		return out
	}

	/**
	 * Animation
	 *
	 * @param {string} input
	 * @return {string}
	 */
	function animation (input) {
		var length = input.length;
		var index = input.indexOf(':', 9) + 1;
		var declare = input.substring(0, index).trim();
		var body = input.substring(index, length-1).trim();
		var out = '';

		// shorthand
		if (input.charCodeAt(9) !== DASH) {
			// split in case of multiple animations
			var list = body.split(animationptn);

			for (var i = 0, index = 0, length = list.length; i < length; index = 0, i++) {
				var value = list[i];
				var items = value.split(propertiesptn);

				while (value = items[index]) {
					var peak = value.charCodeAt(0);

					if (keyed === 1 && (
						// letters
						(peak > AT && peak < 90) || (peak > 96 && peak < 123) || peak === UNDERSCORE ||
						// dash but not in sequence i.e --
						(peak === DASH && value.charCodeAt(1) !== DASH)
					)) {
						// not a number/function
						switch (isNaN(parseFloat(value)) + (value.indexOf('(') !== -1)) {
							case 1: {
								switch (value) {
									// not a valid reserved keyword
									case 'infinite': case 'alternate': case 'backwards': case 'running':
									case 'normal': case 'forwards': case 'both': case 'none': case 'linear':
									case 'ease': case 'ease-in': case 'ease-out': case 'ease-in-out':
									case 'paused': case 'reverse': case 'alternate-reverse': case 'inherit':
									case 'initial': case 'unset': case 'step-start': case 'step-end': {
										break
									}
									default: {
										value += key;
									}
								}
							}
						}
					}

					items[index++] = value;
				}

				out += (i === 0 ? '' : ',') + items.join(' ');
			}
		} else {
			// animation-name, n
			out += input.charCodeAt(10) === 110 ? body + (keyed === 1 ? key : '') : body;
		}

		out = declare + out + ';';

		return vendor > 0 ? webkit + out + out : out
	}

	/**
	 * Isolate
	 *
	 * @param {Array<string>} selectors
	 */
	function isolate (selectors) {
		for (var i = 0, length = selectors.length, padding, element; i < length; i++) {
			// split individual elements in a selector i.e h1 h2 === [h1, h2]
			var elements = selectors[i].split(elementptn);
			var out = '';

			for (var j = 0, size = 0, tail = 0, code = 0, l = elements.length; j < l; j++) {
				// empty element
				if ((size = (element = elements[j]).length) === 0 && l > 1) {
					continue
				}

				tail = out.charCodeAt(out.length-1);
				code = element.charCodeAt(0);
				padding = '';

				if (j !== 0) {
					// determine if we need padding
					switch (tail) {
						case STAR:
						case TILDE:
						case GREATERTHAN:
						case PLUS:
						case SPACE:
						case OPENPARENTHESES:  {
							break
						}
						default: {
							padding = ' ';
						}
					}
				}

				switch (code) {
					case AND: {
						element = padding + nscopealt;
					}
					case TILDE:
					case GREATERTHAN:
					case PLUS:
					case SPACE:
					case CLOSEPARENTHESES:
					case OPENPARENTHESES: {
						break
					}
					case OPENBRACKET: {
						element = padding + element + nscopealt;
						break
					}
					case COLON: {
						switch (element.charCodeAt(1)*2 + element.charCodeAt(2)*3) {
							// :global
							case 530: {
								if (escape > 0) {
									element = padding + element.substring(8, size - 1);
									break
								}
							}
							// :hover, :nth-child(), ...
							default: {
								if (j < 1 || elements[j-1].length < 1) {
									element = padding + nscopealt + element;
								}
							}
						}
						break
					}
					case COMMA: {
						padding = '';
					}
					default: {
						if (size > 1 && element.indexOf(':') > 0) {
							element = padding + element.replace(pseudoptn, '$1' + nscopealt + '$2');
						} else {
							element = padding + element + nscopealt;
						}
					}
				}

				out += element;
			}

			selectors[i] = out.replace(formatptn, '').trim();
		}
	}

	/**
	 * Proxy
	 *
	 * @param {number} context
	 * @param {string} content
	 * @param {Array<string>} selectors
	 * @param {Array<string>} parents
	 * @param {number} line
	 * @param {number} column
	 * @param {number} length
	 * @param {number} id
	 * @return {(string|void|*)}
	 */
	function proxy (context, content, selectors, parents, line, column, length, id) {
		for (var i = 0, out = content, next; i < plugged; i++) {
			switch (next = plugins[i].call(stylis, context, out, selectors, parents, line, column, length, id)) {
				case void 0:
				case false:
				case true:
				case null: {
					break
				}
				default: {
					out = next;
				}
			}
		}

		switch (out) {
			case void 0:
			case false:
			case true:
			case null:
			case content: {
				break
			}
			default: {
				return out
			}
		}
	}

	/**
	 * Minify
	 *
	 * @param {(string|*)} output
	 * @return {string}
	 */
	function minify (output) {
		return output
			.replace(formatptn, '')
			.replace(beforeptn, '')
			.replace(afterptn, '$1')
			.replace(tailptn, '$1')
			.replace(whiteptn, ' ')
	}

	/**
	 * Use
	 *
	 * @param {(Array<function(...?)>|function(...?)|number|void)?} plugin
	 */
	function use (plugin) {
		switch (plugin) {
			case void 0:
			case null: {
				plugged = plugins.length = 0;
				break
			}
			default: {
				switch (plugin.constructor) {
					case Array: {
						for (var i = 0, length = plugin.length; i < length; i++) {
							use(plugin[i]);
						}
						break
					}
					case Function: {
						plugins[plugged++] = plugin;
						break
					}
					case Boolean: {
						unkwn = !!plugin|0;
					}
				}
			}
 		}

 		return use
	}

	/**
	 * Set
	 *
	 * @param {*} options
	 */
	function set (options) {		
		for (var name in options) {
			var value = options[name];
			switch (name) {
				case 'keyframe': keyed = value|0; break
				case 'global': escape = value|0; break
				case 'cascade': cascade = value|0; break
				case 'compress': compress = value|0; break
				case 'prefix': vendor = value|0; break
				case 'semicolon': semicolon = value|0; break
				case 'preserve': preserve = value|0; break
			}
		}

		return set
	}

	/**
	 * Stylis
	 *
	 * @param {string} selector
	 * @param {string} input
	 * @return {*}
	 */
	function stylis (selector, input) {
		if (this !== void 0 && this.constructor === stylis) {
			return factory(selector)
		}

		// setup
		var ns = selector;
		var code = ns.charCodeAt(0);

		// trim leading whitespace
		if (code < 33) {
			code = (ns = ns.trim()).charCodeAt(0);
		}

		// keyframe/animation namespace
		if (keyed > 0) {
			key = ns.replace(invalidptn, code === OPENBRACKET ? '' : '-');
		}

		// reset, used to assert if a plugin is moneky-patching the return value
		code = 1;

		// cascade/isolate
		if (cascade === 1) {
			nscope = ns;
		} else {
			nscopealt = ns;
		}

		var selectors = [nscope];
		var result;

		// execute plugins, pre-process context
		if (plugged > 0) {
			result = proxy(PREPS, input, selectors, selectors, line, column, 0, 0);

			if (result !== void 0 && typeof result === 'string') {
				input = result;
			}
		}

		// build
		var output = compile(array, selectors, input, 0);

		// execute plugins, post-process context
		if (plugged > 0) {
			result = proxy(POSTS, output, selectors, selectors, line, column, output.length, 0);
	
			// bypass minification
			if (result !== void 0 && typeof(output = result) !== 'string') {
				code = 0;
			}
		}

		// reset
		key = '';
		nscope = '';
		nscopealt = '';
		pattern = 0;
		line = 1;
		column = 1;

		return compress*code === 0 ? output : minify(output)
	}

	stylis['use'] = use;
	stylis['set'] = set;

	if (options !== void 0) {
		set(options);
	}

	return stylis
}));
});

var Node = (function () {
    function Node(key, value) {
        this.key = key;
        this.value = value;
        this.prev = null;
        this.next = null;
    }
    return Node;
}());
var DLLCache = (function () {
    function DLLCache() {
        this.head = null;
        this.tail = null;
        this.cache = {};
    }
    DLLCache.prototype.append = function (key, value) {
        var node = new Node(key, value);
        if (!this.tail) {
            this.tail = node;
        }
        if (!this.head) {
            this.head = node;
        }
        else {
            node.prev = this.head;
            this.head.next = node;
            this.head = node;
        }
        this.cache[key] = node;
        return node;
    };
    DLLCache.prototype.appendAfter = function (after, key, value) {
        var node = new Node(key, value);
        node.next = after.next;
        node.prev = after;
        after.next = node;
        this.cache[key] = node;
        return node;
    };
    DLLCache.prototype.forEach = function (fn) {
        var node = this.tail;
        while (node) {
            fn(node);
            node = node.next;
        }
    };
    DLLCache.prototype.get = function (key) {
        return this.cache[key];
    };
    return DLLCache;
}());

//# sourceMappingURL=DLLCache.js.map

var StyleSheet = (function () {
    function StyleSheet(args) {
        this.cache = new DLLCache();
        this.server = !!(args && args.server) || typeof document === 'undefined';
    }
    StyleSheet.prototype.collectStyles = function () {
        var styles = [];
        this.cache.forEach(function (rule) {
            if (rule.value.type === 'client') {
                styles.push(rule.value.style.innerHTML);
            }
            else {
                styles.push(rule.value.style);
            }
        });
        return styles.join('\n');
    };
    StyleSheet.prototype.has = function (className) {
        return !!this.cache.get(className);
    };
    StyleSheet.prototype.inject = function (className, content, after) {
        var rule = this.server
            ? {
                className: className,
                content: content,
                type: 'server',
                style: '',
            }
            : {
                className: className,
                content: content,
                type: 'client',
                style: document.createElement('style'),
            };
        var styleContent = stylis("." + rule.className, rule.content);
        if (rule.type === 'server') {
            rule.style = styleContent;
        }
        else {
            rule.style.innerHTML = styleContent;
        }
        var afterNode = after ? this.cache.get(after) : null;
        if (afterNode) {
            this.cache.appendAfter(afterNode, rule.className, rule);
            if (rule.type === 'client' && afterNode.value.type === 'client') {
                afterNode.value.style.insertAdjacentElement('afterend', rule.style);
            }
        }
        else {
            this.cache.append(rule.className, rule);
            if (rule.type === 'client') {
                document.head.appendChild(rule.style);
            }
        }
        return rule;
    };
    StyleSheet.prototype.replace = function (rule, className, content) {
        if (rule.type === 'client') {
            rule.style.innerHTML = stylis("." + className, content);
        }
        return rule;
    };
    return StyleSheet;
}());

//# sourceMappingURL=index.js.map

exports['default'] = styled$1;
exports.ThemeProvider = ThemeProvider;
exports.StyleSheet = StyleSheet;

Object.defineProperty(exports, '__esModule', { value: true });

})));
//# sourceMappingURL=index.js.map
