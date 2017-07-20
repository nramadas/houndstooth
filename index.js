'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var React = require('react');
var React__default = _interopDefault(React);
var PropTypes = _interopDefault(require('prop-types'));

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

/**
 * A simple data bus.
 */
var makeBus = function (initial) {
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

var ThemeProvider = (function (_super) {
    __extends(ThemeProvider, _super);
    function ThemeProvider(props) {
        var _this = _super.call(this, props) || this;
        _this.bus = makeBus(props.theme);
        return _this;
    }
    ThemeProvider.prototype.getChildContext = function () {
        return {
            houndstooth: this.bus,
        };
    };
    ThemeProvider.prototype.componentWillMount = function () {
        if (this.context.houndstooth) {
            this.bus.set(this.props.theme);
        }
    };
    ThemeProvider.prototype.componentWillReceiveProps = function (nextProps) {
        if (this.context.houndstooth) {
            this.bus.set(nextProps.theme);
        }
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

function styled$1(tag) {
    return function (strings) {
        var keys = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            keys[_i - 1] = arguments[_i];
        }
        var Styled = (function (_super) {
            __extends(Styled, _super);
            function Styled(props) {
                var _this = _super.call(this, props) || this;
                _this.cleanUp = null;
                _this.state = {
                    theme: null,
                };
                return _this;
            }
            Styled.prototype.componentWillMount = function () {
                console.log(strings, keys);
                var staticStyles = [];
                var dynamicStyles = [];
                if (this.context.houndstooth) {
                    this.setState({ theme: this.context.houndstooth.peek() });
                }
            };
            Styled.prototype.componentDidMount = function () {
                var _this = this;
                if (this.context.houndstooth) {
                    this.cleanUp = this.context.houndstooth.listen(function (theme) {
                        _this.setState({ theme: theme });
                    });
                }
            };
            Styled.prototype.componentWillUnmount = function () {
                if (this.cleanUp) {
                    this.cleanUp();
                }
            };
            Styled.prototype.render = function () {
                return React.createElement(tag, this.props);
            };
            Styled.contextTypes = {
                houndstooth: PropTypes.object,
            };
            return Styled;
        }(React__default.Component));
        return Styled;
    };
}

exports.ThemeProvider = ThemeProvider;
exports['default'] = styled$1;
//# sourceMappingURL=index.js.map
