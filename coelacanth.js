(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define("coelacanth", [], factory);
	else if(typeof exports === 'object')
		exports["coelacanth"] = factory();
	else
		root["coelacanth"] = factory();
})(this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * Merge two objects with nested data
 */
function mergeObject(oldObject, newObject) {
  var oldCopy = Object.assign({}, oldObject);

  function _merge(oo, no) {
    for (var key in no) {
      if (key in oo) {
        // Follow structure of oo
        if (oo[key] === Object(oo[key])) {
          _merge(oo[key], no[key]);
        } else if (no[key] !== Object(no[key])) {
          oo[key] = no[key];
        }
      } else {
        // Plain assign
        oo[key] = no[key];
      }
    }
    return oo;
  }

  return _merge(oldCopy, newObject);
}

/**
 * Main config class
 */

var Coelacanth = function () {
  function Coelacanth(defaults) {
    var root = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;

    _classCallCheck(this, Coelacanth);

    this.proxy = new Proxy(this, {
      get: function get(target, name) {
        if (typeof target[name] === 'function') {
          return function () {
            for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
              args[_key] = arguments[_key];
            }

            return target[name].apply(this, args);
          };
        } else if (name in target._defaults) {
          return target._defaults[name];
        } else {
          return target[name];
        }
      },
      set: function set(target, name, value) {
        target[name] = value;
      }
    });

    // Initialize default values
    this.root = root || this.proxy;
    this._defaults = {};
    for (var key in defaults) {
      if (defaults[key] === Object(defaults[key])) {
        this._defaults[key] = new Coelacanth(defaults[key], this.root);
      } else {
        this._defaults[key] = defaults[key];
      }
    }
    this._derivations = {};

    return this.proxy;
  }

  _createClass(Coelacanth, [{
    key: 'derive',
    value: function derive(name, derivation) {
      var _this = this;

      this._derivations[name] = derivation;

      Object.defineProperty(this, name, {
        get: function get() {
          return derivation(_this.proxy, _this.root);
        }
      });
    }
  }, {
    key: '_deriveCopy',
    value: function _deriveCopy(object) {
      // Apply root level derivations
      for (var key in object._derivations) {
        this.derive(key, object._derivations[key]);
      }

      // Apply to children
      for (var _key2 in object._defaults) {
        if (this._defaults[_key2] === Object(this._defaults[_key2])) {
          this._defaults[_key2]._deriveCopy(object._defaults[_key2]);
        }
      }
    }

    /**
     * Plain json getters
     */

  }, {
    key: 'overwrite',
    value: function overwrite(newConfig) {
      var overwritten = new Coelacanth(mergeObject(this.defaults, newConfig));
      // Apply derivations
      overwritten._deriveCopy(this);
      return overwritten;
    }
  }, {
    key: 'defaults',
    get: function get() {
      var out = {};
      for (var key in this._defaults) {
        if (this._defaults[key] === Object(this._defaults[key])) {
          out[key] = this._defaults[key].defaults;
        } else {
          out[key] = this._defaults[key];
        }
      }
      return out;
    }
  }]);

  return Coelacanth;
}();

exports.default = Coelacanth;

/***/ })
/******/ ]);
});