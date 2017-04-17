/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
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
/******/ 	__webpack_require__.p = "build/";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 5);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

"use strict";


__webpack_require__(2);

var _big = __webpack_require__(3);

var _big2 = _interopRequireDefault(_big);

var _small = __webpack_require__(4);

var _small2 = _interopRequireDefault(_small);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var image = document.createElement("img"); /**
                                            * Created by arhexanon on 16-4-17.
                                            */

image.src = 'http://lorempixel.com/400/400';
document.body.appendChild(image);

var imageSmall = document.createElement("img");
imageSmall.src = _small2.default;
document.body.appendChild(imageSmall);

var imageBig = document.createElement("img");
imageBig.src = _big2.default;
document.body.appendChild(imageBig);

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
/**
 * Created by arhexanon on 14-4-17.
 */

var sum = function sum(a, b) {
  return a + b;
};

exports.default = sum;

/***/ },
/* 2 */
/***/ function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "982058ac4f4f75cee6a5e9b5d63bda32.jpg";

/***/ },
/* 4 */
/***/ function(module, exports) {

module.exports = "data:image/jpeg;base64,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"

/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

"use strict";


var _sum = __webpack_require__(1);

var _sum2 = _interopRequireDefault(_sum);

__webpack_require__(0);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Created by arhexanon on 14-4-17.
 */
console.log((0, _sum2.default)(948, 9));

/***/ }
/******/ ]);