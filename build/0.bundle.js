webpackJsonp([0],[
/* 0 */,
/* 1 */
/***/ function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

__webpack_require__(9);

var _big = __webpack_require__(10);

var _big2 = _interopRequireDefault(_big);

var _small = __webpack_require__(11);

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

exports.default = function () {
    var imageBig = document.createElement("img");
    imageBig.src = _big2.default;
    document.body.appendChild(imageBig);
};

/***/ },
/* 2 */,
/* 3 */
/***/ function(module, exports, __webpack_require__) {

"use strict";


exports.byteLength = byteLength;
exports.toByteArray = toByteArray;
exports.fromByteArray = fromByteArray;

var lookup = [];
var revLookup = [];
var Arr = typeof Uint8Array !== 'undefined' ? Uint8Array : Array;

var code = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
for (var i = 0, len = code.length; i < len; ++i) {
  lookup[i] = code[i];
  revLookup[code.charCodeAt(i)] = i;
}

revLookup['-'.charCodeAt(0)] = 62;
revLookup['_'.charCodeAt(0)] = 63;

function placeHoldersCount(b64) {
  var len = b64.length;
  if (len % 4 > 0) {
    throw new Error('Invalid string. Length must be a multiple of 4');
  }

  // the number of equal signs (place holders)
  // if there are two placeholders, than the two characters before it
  // represent one byte
  // if there is only one, then the three characters before it represent 2 bytes
  // this is just a cheap hack to not do indexOf twice
  return b64[len - 2] === '=' ? 2 : b64[len - 1] === '=' ? 1 : 0;
}

function byteLength(b64) {
  // base64 is 4/3 + up to two characters of the original data
  return b64.length * 3 / 4 - placeHoldersCount(b64);
}

function toByteArray(b64) {
  var i, j, l, tmp, placeHolders, arr;
  var len = b64.length;
  placeHolders = placeHoldersCount(b64);

  arr = new Arr(len * 3 / 4 - placeHolders);

  // if there are placeholders, only get up to the last complete 4 chars
  l = placeHolders > 0 ? len - 4 : len;

  var L = 0;

  for (i = 0, j = 0; i < l; i += 4, j += 3) {
    tmp = revLookup[b64.charCodeAt(i)] << 18 | revLookup[b64.charCodeAt(i + 1)] << 12 | revLookup[b64.charCodeAt(i + 2)] << 6 | revLookup[b64.charCodeAt(i + 3)];
    arr[L++] = tmp >> 16 & 0xFF;
    arr[L++] = tmp >> 8 & 0xFF;
    arr[L++] = tmp & 0xFF;
  }

  if (placeHolders === 2) {
    tmp = revLookup[b64.charCodeAt(i)] << 2 | revLookup[b64.charCodeAt(i + 1)] >> 4;
    arr[L++] = tmp & 0xFF;
  } else if (placeHolders === 1) {
    tmp = revLookup[b64.charCodeAt(i)] << 10 | revLookup[b64.charCodeAt(i + 1)] << 4 | revLookup[b64.charCodeAt(i + 2)] >> 2;
    arr[L++] = tmp >> 8 & 0xFF;
    arr[L++] = tmp & 0xFF;
  }

  return arr;
}

function tripletToBase64(num) {
  return lookup[num >> 18 & 0x3F] + lookup[num >> 12 & 0x3F] + lookup[num >> 6 & 0x3F] + lookup[num & 0x3F];
}

function encodeChunk(uint8, start, end) {
  var tmp;
  var output = [];
  for (var i = start; i < end; i += 3) {
    tmp = (uint8[i] << 16) + (uint8[i + 1] << 8) + uint8[i + 2];
    output.push(tripletToBase64(tmp));
  }
  return output.join('');
}

function fromByteArray(uint8) {
  var tmp;
  var len = uint8.length;
  var extraBytes = len % 3; // if we have 1 byte left, pad 2 bytes
  var output = '';
  var parts = [];
  var maxChunkLength = 16383; // must be multiple of 3

  // go through the array every three bytes, we'll deal with trailing stuff later
  for (var i = 0, len2 = len - extraBytes; i < len2; i += maxChunkLength) {
    parts.push(encodeChunk(uint8, i, i + maxChunkLength > len2 ? len2 : i + maxChunkLength));
  }

  // pad the end with zeros, but make sure to not forget the extra bytes
  if (extraBytes === 1) {
    tmp = uint8[len - 1];
    output += lookup[tmp >> 2];
    output += lookup[tmp << 4 & 0x3F];
    output += '==';
  } else if (extraBytes === 2) {
    tmp = (uint8[len - 2] << 8) + uint8[len - 1];
    output += lookup[tmp >> 10];
    output += lookup[tmp >> 4 & 0x3F];
    output += lookup[tmp << 2 & 0x3F];
    output += '=';
  }

  parts.push(output);

  return parts.join('');
}

/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(global) {/*!
 * The buffer module from node.js, for the browser.
 *
 * @author   Feross Aboukhadijeh <feross@feross.org> <http://feross.org>
 * @license  MIT
 */
/* eslint-disable no-proto */



var base64 = __webpack_require__(3);
var ieee754 = __webpack_require__(6);
var isArray = __webpack_require__(7);

exports.Buffer = Buffer;
exports.SlowBuffer = SlowBuffer;
exports.INSPECT_MAX_BYTES = 50;

/**
 * If `Buffer.TYPED_ARRAY_SUPPORT`:
 *   === true    Use Uint8Array implementation (fastest)
 *   === false   Use Object implementation (most compatible, even IE6)
 *
 * Browsers that support typed arrays are IE 10+, Firefox 4+, Chrome 7+, Safari 5.1+,
 * Opera 11.6+, iOS 4.2+.
 *
 * Due to various browser bugs, sometimes the Object implementation will be used even
 * when the browser supports typed arrays.
 *
 * Note:
 *
 *   - Firefox 4-29 lacks support for adding new properties to `Uint8Array` instances,
 *     See: https://bugzilla.mozilla.org/show_bug.cgi?id=695438.
 *
 *   - Chrome 9-10 is missing the `TypedArray.prototype.subarray` function.
 *
 *   - IE10 has a broken `TypedArray.prototype.subarray` function which returns arrays of
 *     incorrect length in some situations.

 * We detect these buggy browsers and set `Buffer.TYPED_ARRAY_SUPPORT` to `false` so they
 * get the Object implementation, which is slower but behaves correctly.
 */
Buffer.TYPED_ARRAY_SUPPORT = global.TYPED_ARRAY_SUPPORT !== undefined ? global.TYPED_ARRAY_SUPPORT : typedArraySupport();

/*
 * Export kMaxLength after typed array support is determined.
 */
exports.kMaxLength = kMaxLength();

function typedArraySupport() {
  try {
    var arr = new Uint8Array(1);
    arr.__proto__ = { __proto__: Uint8Array.prototype, foo: function foo() {
        return 42;
      } };
    return arr.foo() === 42 && // typed array instances can be augmented
    typeof arr.subarray === 'function' && // chrome 9-10 lack `subarray`
    arr.subarray(1, 1).byteLength === 0; // ie10 has broken `subarray`
  } catch (e) {
    return false;
  }
}

function kMaxLength() {
  return Buffer.TYPED_ARRAY_SUPPORT ? 0x7fffffff : 0x3fffffff;
}

function createBuffer(that, length) {
  if (kMaxLength() < length) {
    throw new RangeError('Invalid typed array length');
  }
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    // Return an augmented `Uint8Array` instance, for best performance
    that = new Uint8Array(length);
    that.__proto__ = Buffer.prototype;
  } else {
    // Fallback: Return an object instance of the Buffer class
    if (that === null) {
      that = new Buffer(length);
    }
    that.length = length;
  }

  return that;
}

/**
 * The Buffer constructor returns instances of `Uint8Array` that have their
 * prototype changed to `Buffer.prototype`. Furthermore, `Buffer` is a subclass of
 * `Uint8Array`, so the returned instances will have all the node `Buffer` methods
 * and the `Uint8Array` methods. Square bracket notation works as expected -- it
 * returns a single octet.
 *
 * The `Uint8Array` prototype remains unmodified.
 */

function Buffer(arg, encodingOrOffset, length) {
  if (!Buffer.TYPED_ARRAY_SUPPORT && !(this instanceof Buffer)) {
    return new Buffer(arg, encodingOrOffset, length);
  }

  // Common case.
  if (typeof arg === 'number') {
    if (typeof encodingOrOffset === 'string') {
      throw new Error('If encoding is specified then the first argument must be a string');
    }
    return allocUnsafe(this, arg);
  }
  return from(this, arg, encodingOrOffset, length);
}

Buffer.poolSize = 8192; // not used by this implementation

// TODO: Legacy, not needed anymore. Remove in next major version.
Buffer._augment = function (arr) {
  arr.__proto__ = Buffer.prototype;
  return arr;
};

function from(that, value, encodingOrOffset, length) {
  if (typeof value === 'number') {
    throw new TypeError('"value" argument must not be a number');
  }

  if (typeof ArrayBuffer !== 'undefined' && value instanceof ArrayBuffer) {
    return fromArrayBuffer(that, value, encodingOrOffset, length);
  }

  if (typeof value === 'string') {
    return fromString(that, value, encodingOrOffset);
  }

  return fromObject(that, value);
}

/**
 * Functionally equivalent to Buffer(arg, encoding) but throws a TypeError
 * if value is a number.
 * Buffer.from(str[, encoding])
 * Buffer.from(array)
 * Buffer.from(buffer)
 * Buffer.from(arrayBuffer[, byteOffset[, length]])
 **/
Buffer.from = function (value, encodingOrOffset, length) {
  return from(null, value, encodingOrOffset, length);
};

if (Buffer.TYPED_ARRAY_SUPPORT) {
  Buffer.prototype.__proto__ = Uint8Array.prototype;
  Buffer.__proto__ = Uint8Array;
  if (typeof Symbol !== 'undefined' && Symbol.species && Buffer[Symbol.species] === Buffer) {
    // Fix subarray() in ES2016. See: https://github.com/feross/buffer/pull/97
    Object.defineProperty(Buffer, Symbol.species, {
      value: null,
      configurable: true
    });
  }
}

function assertSize(size) {
  if (typeof size !== 'number') {
    throw new TypeError('"size" argument must be a number');
  } else if (size < 0) {
    throw new RangeError('"size" argument must not be negative');
  }
}

function alloc(that, size, fill, encoding) {
  assertSize(size);
  if (size <= 0) {
    return createBuffer(that, size);
  }
  if (fill !== undefined) {
    // Only pay attention to encoding if it's a string. This
    // prevents accidentally sending in a number that would
    // be interpretted as a start offset.
    return typeof encoding === 'string' ? createBuffer(that, size).fill(fill, encoding) : createBuffer(that, size).fill(fill);
  }
  return createBuffer(that, size);
}

/**
 * Creates a new filled Buffer instance.
 * alloc(size[, fill[, encoding]])
 **/
Buffer.alloc = function (size, fill, encoding) {
  return alloc(null, size, fill, encoding);
};

function allocUnsafe(that, size) {
  assertSize(size);
  that = createBuffer(that, size < 0 ? 0 : checked(size) | 0);
  if (!Buffer.TYPED_ARRAY_SUPPORT) {
    for (var i = 0; i < size; ++i) {
      that[i] = 0;
    }
  }
  return that;
}

/**
 * Equivalent to Buffer(num), by default creates a non-zero-filled Buffer instance.
 * */
Buffer.allocUnsafe = function (size) {
  return allocUnsafe(null, size);
};
/**
 * Equivalent to SlowBuffer(num), by default creates a non-zero-filled Buffer instance.
 */
Buffer.allocUnsafeSlow = function (size) {
  return allocUnsafe(null, size);
};

function fromString(that, string, encoding) {
  if (typeof encoding !== 'string' || encoding === '') {
    encoding = 'utf8';
  }

  if (!Buffer.isEncoding(encoding)) {
    throw new TypeError('"encoding" must be a valid string encoding');
  }

  var length = byteLength(string, encoding) | 0;
  that = createBuffer(that, length);

  var actual = that.write(string, encoding);

  if (actual !== length) {
    // Writing a hex string, for example, that contains invalid characters will
    // cause everything after the first invalid character to be ignored. (e.g.
    // 'abxxcd' will be treated as 'ab')
    that = that.slice(0, actual);
  }

  return that;
}

function fromArrayLike(that, array) {
  var length = array.length < 0 ? 0 : checked(array.length) | 0;
  that = createBuffer(that, length);
  for (var i = 0; i < length; i += 1) {
    that[i] = array[i] & 255;
  }
  return that;
}

function fromArrayBuffer(that, array, byteOffset, length) {
  array.byteLength; // this throws if `array` is not a valid ArrayBuffer

  if (byteOffset < 0 || array.byteLength < byteOffset) {
    throw new RangeError('\'offset\' is out of bounds');
  }

  if (array.byteLength < byteOffset + (length || 0)) {
    throw new RangeError('\'length\' is out of bounds');
  }

  if (byteOffset === undefined && length === undefined) {
    array = new Uint8Array(array);
  } else if (length === undefined) {
    array = new Uint8Array(array, byteOffset);
  } else {
    array = new Uint8Array(array, byteOffset, length);
  }

  if (Buffer.TYPED_ARRAY_SUPPORT) {
    // Return an augmented `Uint8Array` instance, for best performance
    that = array;
    that.__proto__ = Buffer.prototype;
  } else {
    // Fallback: Return an object instance of the Buffer class
    that = fromArrayLike(that, array);
  }
  return that;
}

function fromObject(that, obj) {
  if (Buffer.isBuffer(obj)) {
    var len = checked(obj.length) | 0;
    that = createBuffer(that, len);

    if (that.length === 0) {
      return that;
    }

    obj.copy(that, 0, 0, len);
    return that;
  }

  if (obj) {
    if (typeof ArrayBuffer !== 'undefined' && obj.buffer instanceof ArrayBuffer || 'length' in obj) {
      if (typeof obj.length !== 'number' || isnan(obj.length)) {
        return createBuffer(that, 0);
      }
      return fromArrayLike(that, obj);
    }

    if (obj.type === 'Buffer' && isArray(obj.data)) {
      return fromArrayLike(that, obj.data);
    }
  }

  throw new TypeError('First argument must be a string, Buffer, ArrayBuffer, Array, or array-like object.');
}

function checked(length) {
  // Note: cannot use `length < kMaxLength()` here because that fails when
  // length is NaN (which is otherwise coerced to zero.)
  if (length >= kMaxLength()) {
    throw new RangeError('Attempt to allocate Buffer larger than maximum ' + 'size: 0x' + kMaxLength().toString(16) + ' bytes');
  }
  return length | 0;
}

function SlowBuffer(length) {
  if (+length != length) {
    // eslint-disable-line eqeqeq
    length = 0;
  }
  return Buffer.alloc(+length);
}

Buffer.isBuffer = function isBuffer(b) {
  return !!(b != null && b._isBuffer);
};

Buffer.compare = function compare(a, b) {
  if (!Buffer.isBuffer(a) || !Buffer.isBuffer(b)) {
    throw new TypeError('Arguments must be Buffers');
  }

  if (a === b) return 0;

  var x = a.length;
  var y = b.length;

  for (var i = 0, len = Math.min(x, y); i < len; ++i) {
    if (a[i] !== b[i]) {
      x = a[i];
      y = b[i];
      break;
    }
  }

  if (x < y) return -1;
  if (y < x) return 1;
  return 0;
};

Buffer.isEncoding = function isEncoding(encoding) {
  switch (String(encoding).toLowerCase()) {
    case 'hex':
    case 'utf8':
    case 'utf-8':
    case 'ascii':
    case 'latin1':
    case 'binary':
    case 'base64':
    case 'ucs2':
    case 'ucs-2':
    case 'utf16le':
    case 'utf-16le':
      return true;
    default:
      return false;
  }
};

Buffer.concat = function concat(list, length) {
  if (!isArray(list)) {
    throw new TypeError('"list" argument must be an Array of Buffers');
  }

  if (list.length === 0) {
    return Buffer.alloc(0);
  }

  var i;
  if (length === undefined) {
    length = 0;
    for (i = 0; i < list.length; ++i) {
      length += list[i].length;
    }
  }

  var buffer = Buffer.allocUnsafe(length);
  var pos = 0;
  for (i = 0; i < list.length; ++i) {
    var buf = list[i];
    if (!Buffer.isBuffer(buf)) {
      throw new TypeError('"list" argument must be an Array of Buffers');
    }
    buf.copy(buffer, pos);
    pos += buf.length;
  }
  return buffer;
};

function byteLength(string, encoding) {
  if (Buffer.isBuffer(string)) {
    return string.length;
  }
  if (typeof ArrayBuffer !== 'undefined' && typeof ArrayBuffer.isView === 'function' && (ArrayBuffer.isView(string) || string instanceof ArrayBuffer)) {
    return string.byteLength;
  }
  if (typeof string !== 'string') {
    string = '' + string;
  }

  var len = string.length;
  if (len === 0) return 0;

  // Use a for loop to avoid recursion
  var loweredCase = false;
  for (;;) {
    switch (encoding) {
      case 'ascii':
      case 'latin1':
      case 'binary':
        return len;
      case 'utf8':
      case 'utf-8':
      case undefined:
        return utf8ToBytes(string).length;
      case 'ucs2':
      case 'ucs-2':
      case 'utf16le':
      case 'utf-16le':
        return len * 2;
      case 'hex':
        return len >>> 1;
      case 'base64':
        return base64ToBytes(string).length;
      default:
        if (loweredCase) return utf8ToBytes(string).length; // assume utf8
        encoding = ('' + encoding).toLowerCase();
        loweredCase = true;
    }
  }
}
Buffer.byteLength = byteLength;

function slowToString(encoding, start, end) {
  var loweredCase = false;

  // No need to verify that "this.length <= MAX_UINT32" since it's a read-only
  // property of a typed array.

  // This behaves neither like String nor Uint8Array in that we set start/end
  // to their upper/lower bounds if the value passed is out of range.
  // undefined is handled specially as per ECMA-262 6th Edition,
  // Section 13.3.3.7 Runtime Semantics: KeyedBindingInitialization.
  if (start === undefined || start < 0) {
    start = 0;
  }
  // Return early if start > this.length. Done here to prevent potential uint32
  // coercion fail below.
  if (start > this.length) {
    return '';
  }

  if (end === undefined || end > this.length) {
    end = this.length;
  }

  if (end <= 0) {
    return '';
  }

  // Force coersion to uint32. This will also coerce falsey/NaN values to 0.
  end >>>= 0;
  start >>>= 0;

  if (end <= start) {
    return '';
  }

  if (!encoding) encoding = 'utf8';

  while (true) {
    switch (encoding) {
      case 'hex':
        return hexSlice(this, start, end);

      case 'utf8':
      case 'utf-8':
        return utf8Slice(this, start, end);

      case 'ascii':
        return asciiSlice(this, start, end);

      case 'latin1':
      case 'binary':
        return latin1Slice(this, start, end);

      case 'base64':
        return base64Slice(this, start, end);

      case 'ucs2':
      case 'ucs-2':
      case 'utf16le':
      case 'utf-16le':
        return utf16leSlice(this, start, end);

      default:
        if (loweredCase) throw new TypeError('Unknown encoding: ' + encoding);
        encoding = (encoding + '').toLowerCase();
        loweredCase = true;
    }
  }
}

// The property is used by `Buffer.isBuffer` and `is-buffer` (in Safari 5-7) to detect
// Buffer instances.
Buffer.prototype._isBuffer = true;

function swap(b, n, m) {
  var i = b[n];
  b[n] = b[m];
  b[m] = i;
}

Buffer.prototype.swap16 = function swap16() {
  var len = this.length;
  if (len % 2 !== 0) {
    throw new RangeError('Buffer size must be a multiple of 16-bits');
  }
  for (var i = 0; i < len; i += 2) {
    swap(this, i, i + 1);
  }
  return this;
};

Buffer.prototype.swap32 = function swap32() {
  var len = this.length;
  if (len % 4 !== 0) {
    throw new RangeError('Buffer size must be a multiple of 32-bits');
  }
  for (var i = 0; i < len; i += 4) {
    swap(this, i, i + 3);
    swap(this, i + 1, i + 2);
  }
  return this;
};

Buffer.prototype.swap64 = function swap64() {
  var len = this.length;
  if (len % 8 !== 0) {
    throw new RangeError('Buffer size must be a multiple of 64-bits');
  }
  for (var i = 0; i < len; i += 8) {
    swap(this, i, i + 7);
    swap(this, i + 1, i + 6);
    swap(this, i + 2, i + 5);
    swap(this, i + 3, i + 4);
  }
  return this;
};

Buffer.prototype.toString = function toString() {
  var length = this.length | 0;
  if (length === 0) return '';
  if (arguments.length === 0) return utf8Slice(this, 0, length);
  return slowToString.apply(this, arguments);
};

Buffer.prototype.equals = function equals(b) {
  if (!Buffer.isBuffer(b)) throw new TypeError('Argument must be a Buffer');
  if (this === b) return true;
  return Buffer.compare(this, b) === 0;
};

Buffer.prototype.inspect = function inspect() {
  var str = '';
  var max = exports.INSPECT_MAX_BYTES;
  if (this.length > 0) {
    str = this.toString('hex', 0, max).match(/.{2}/g).join(' ');
    if (this.length > max) str += ' ... ';
  }
  return '<Buffer ' + str + '>';
};

Buffer.prototype.compare = function compare(target, start, end, thisStart, thisEnd) {
  if (!Buffer.isBuffer(target)) {
    throw new TypeError('Argument must be a Buffer');
  }

  if (start === undefined) {
    start = 0;
  }
  if (end === undefined) {
    end = target ? target.length : 0;
  }
  if (thisStart === undefined) {
    thisStart = 0;
  }
  if (thisEnd === undefined) {
    thisEnd = this.length;
  }

  if (start < 0 || end > target.length || thisStart < 0 || thisEnd > this.length) {
    throw new RangeError('out of range index');
  }

  if (thisStart >= thisEnd && start >= end) {
    return 0;
  }
  if (thisStart >= thisEnd) {
    return -1;
  }
  if (start >= end) {
    return 1;
  }

  start >>>= 0;
  end >>>= 0;
  thisStart >>>= 0;
  thisEnd >>>= 0;

  if (this === target) return 0;

  var x = thisEnd - thisStart;
  var y = end - start;
  var len = Math.min(x, y);

  var thisCopy = this.slice(thisStart, thisEnd);
  var targetCopy = target.slice(start, end);

  for (var i = 0; i < len; ++i) {
    if (thisCopy[i] !== targetCopy[i]) {
      x = thisCopy[i];
      y = targetCopy[i];
      break;
    }
  }

  if (x < y) return -1;
  if (y < x) return 1;
  return 0;
};

// Finds either the first index of `val` in `buffer` at offset >= `byteOffset`,
// OR the last index of `val` in `buffer` at offset <= `byteOffset`.
//
// Arguments:
// - buffer - a Buffer to search
// - val - a string, Buffer, or number
// - byteOffset - an index into `buffer`; will be clamped to an int32
// - encoding - an optional encoding, relevant is val is a string
// - dir - true for indexOf, false for lastIndexOf
function bidirectionalIndexOf(buffer, val, byteOffset, encoding, dir) {
  // Empty buffer means no match
  if (buffer.length === 0) return -1;

  // Normalize byteOffset
  if (typeof byteOffset === 'string') {
    encoding = byteOffset;
    byteOffset = 0;
  } else if (byteOffset > 0x7fffffff) {
    byteOffset = 0x7fffffff;
  } else if (byteOffset < -0x80000000) {
    byteOffset = -0x80000000;
  }
  byteOffset = +byteOffset; // Coerce to Number.
  if (isNaN(byteOffset)) {
    // byteOffset: it it's undefined, null, NaN, "foo", etc, search whole buffer
    byteOffset = dir ? 0 : buffer.length - 1;
  }

  // Normalize byteOffset: negative offsets start from the end of the buffer
  if (byteOffset < 0) byteOffset = buffer.length + byteOffset;
  if (byteOffset >= buffer.length) {
    if (dir) return -1;else byteOffset = buffer.length - 1;
  } else if (byteOffset < 0) {
    if (dir) byteOffset = 0;else return -1;
  }

  // Normalize val
  if (typeof val === 'string') {
    val = Buffer.from(val, encoding);
  }

  // Finally, search either indexOf (if dir is true) or lastIndexOf
  if (Buffer.isBuffer(val)) {
    // Special case: looking for empty string/buffer always fails
    if (val.length === 0) {
      return -1;
    }
    return arrayIndexOf(buffer, val, byteOffset, encoding, dir);
  } else if (typeof val === 'number') {
    val = val & 0xFF; // Search for a byte value [0-255]
    if (Buffer.TYPED_ARRAY_SUPPORT && typeof Uint8Array.prototype.indexOf === 'function') {
      if (dir) {
        return Uint8Array.prototype.indexOf.call(buffer, val, byteOffset);
      } else {
        return Uint8Array.prototype.lastIndexOf.call(buffer, val, byteOffset);
      }
    }
    return arrayIndexOf(buffer, [val], byteOffset, encoding, dir);
  }

  throw new TypeError('val must be string, number or Buffer');
}

function arrayIndexOf(arr, val, byteOffset, encoding, dir) {
  var indexSize = 1;
  var arrLength = arr.length;
  var valLength = val.length;

  if (encoding !== undefined) {
    encoding = String(encoding).toLowerCase();
    if (encoding === 'ucs2' || encoding === 'ucs-2' || encoding === 'utf16le' || encoding === 'utf-16le') {
      if (arr.length < 2 || val.length < 2) {
        return -1;
      }
      indexSize = 2;
      arrLength /= 2;
      valLength /= 2;
      byteOffset /= 2;
    }
  }

  function read(buf, i) {
    if (indexSize === 1) {
      return buf[i];
    } else {
      return buf.readUInt16BE(i * indexSize);
    }
  }

  var i;
  if (dir) {
    var foundIndex = -1;
    for (i = byteOffset; i < arrLength; i++) {
      if (read(arr, i) === read(val, foundIndex === -1 ? 0 : i - foundIndex)) {
        if (foundIndex === -1) foundIndex = i;
        if (i - foundIndex + 1 === valLength) return foundIndex * indexSize;
      } else {
        if (foundIndex !== -1) i -= i - foundIndex;
        foundIndex = -1;
      }
    }
  } else {
    if (byteOffset + valLength > arrLength) byteOffset = arrLength - valLength;
    for (i = byteOffset; i >= 0; i--) {
      var found = true;
      for (var j = 0; j < valLength; j++) {
        if (read(arr, i + j) !== read(val, j)) {
          found = false;
          break;
        }
      }
      if (found) return i;
    }
  }

  return -1;
}

Buffer.prototype.includes = function includes(val, byteOffset, encoding) {
  return this.indexOf(val, byteOffset, encoding) !== -1;
};

Buffer.prototype.indexOf = function indexOf(val, byteOffset, encoding) {
  return bidirectionalIndexOf(this, val, byteOffset, encoding, true);
};

Buffer.prototype.lastIndexOf = function lastIndexOf(val, byteOffset, encoding) {
  return bidirectionalIndexOf(this, val, byteOffset, encoding, false);
};

function hexWrite(buf, string, offset, length) {
  offset = Number(offset) || 0;
  var remaining = buf.length - offset;
  if (!length) {
    length = remaining;
  } else {
    length = Number(length);
    if (length > remaining) {
      length = remaining;
    }
  }

  // must be an even number of digits
  var strLen = string.length;
  if (strLen % 2 !== 0) throw new TypeError('Invalid hex string');

  if (length > strLen / 2) {
    length = strLen / 2;
  }
  for (var i = 0; i < length; ++i) {
    var parsed = parseInt(string.substr(i * 2, 2), 16);
    if (isNaN(parsed)) return i;
    buf[offset + i] = parsed;
  }
  return i;
}

function utf8Write(buf, string, offset, length) {
  return blitBuffer(utf8ToBytes(string, buf.length - offset), buf, offset, length);
}

function asciiWrite(buf, string, offset, length) {
  return blitBuffer(asciiToBytes(string), buf, offset, length);
}

function latin1Write(buf, string, offset, length) {
  return asciiWrite(buf, string, offset, length);
}

function base64Write(buf, string, offset, length) {
  return blitBuffer(base64ToBytes(string), buf, offset, length);
}

function ucs2Write(buf, string, offset, length) {
  return blitBuffer(utf16leToBytes(string, buf.length - offset), buf, offset, length);
}

Buffer.prototype.write = function write(string, offset, length, encoding) {
  // Buffer#write(string)
  if (offset === undefined) {
    encoding = 'utf8';
    length = this.length;
    offset = 0;
    // Buffer#write(string, encoding)
  } else if (length === undefined && typeof offset === 'string') {
    encoding = offset;
    length = this.length;
    offset = 0;
    // Buffer#write(string, offset[, length][, encoding])
  } else if (isFinite(offset)) {
    offset = offset | 0;
    if (isFinite(length)) {
      length = length | 0;
      if (encoding === undefined) encoding = 'utf8';
    } else {
      encoding = length;
      length = undefined;
    }
    // legacy write(string, encoding, offset, length) - remove in v0.13
  } else {
    throw new Error('Buffer.write(string, encoding, offset[, length]) is no longer supported');
  }

  var remaining = this.length - offset;
  if (length === undefined || length > remaining) length = remaining;

  if (string.length > 0 && (length < 0 || offset < 0) || offset > this.length) {
    throw new RangeError('Attempt to write outside buffer bounds');
  }

  if (!encoding) encoding = 'utf8';

  var loweredCase = false;
  for (;;) {
    switch (encoding) {
      case 'hex':
        return hexWrite(this, string, offset, length);

      case 'utf8':
      case 'utf-8':
        return utf8Write(this, string, offset, length);

      case 'ascii':
        return asciiWrite(this, string, offset, length);

      case 'latin1':
      case 'binary':
        return latin1Write(this, string, offset, length);

      case 'base64':
        // Warning: maxLength not taken into account in base64Write
        return base64Write(this, string, offset, length);

      case 'ucs2':
      case 'ucs-2':
      case 'utf16le':
      case 'utf-16le':
        return ucs2Write(this, string, offset, length);

      default:
        if (loweredCase) throw new TypeError('Unknown encoding: ' + encoding);
        encoding = ('' + encoding).toLowerCase();
        loweredCase = true;
    }
  }
};

Buffer.prototype.toJSON = function toJSON() {
  return {
    type: 'Buffer',
    data: Array.prototype.slice.call(this._arr || this, 0)
  };
};

function base64Slice(buf, start, end) {
  if (start === 0 && end === buf.length) {
    return base64.fromByteArray(buf);
  } else {
    return base64.fromByteArray(buf.slice(start, end));
  }
}

function utf8Slice(buf, start, end) {
  end = Math.min(buf.length, end);
  var res = [];

  var i = start;
  while (i < end) {
    var firstByte = buf[i];
    var codePoint = null;
    var bytesPerSequence = firstByte > 0xEF ? 4 : firstByte > 0xDF ? 3 : firstByte > 0xBF ? 2 : 1;

    if (i + bytesPerSequence <= end) {
      var secondByte, thirdByte, fourthByte, tempCodePoint;

      switch (bytesPerSequence) {
        case 1:
          if (firstByte < 0x80) {
            codePoint = firstByte;
          }
          break;
        case 2:
          secondByte = buf[i + 1];
          if ((secondByte & 0xC0) === 0x80) {
            tempCodePoint = (firstByte & 0x1F) << 0x6 | secondByte & 0x3F;
            if (tempCodePoint > 0x7F) {
              codePoint = tempCodePoint;
            }
          }
          break;
        case 3:
          secondByte = buf[i + 1];
          thirdByte = buf[i + 2];
          if ((secondByte & 0xC0) === 0x80 && (thirdByte & 0xC0) === 0x80) {
            tempCodePoint = (firstByte & 0xF) << 0xC | (secondByte & 0x3F) << 0x6 | thirdByte & 0x3F;
            if (tempCodePoint > 0x7FF && (tempCodePoint < 0xD800 || tempCodePoint > 0xDFFF)) {
              codePoint = tempCodePoint;
            }
          }
          break;
        case 4:
          secondByte = buf[i + 1];
          thirdByte = buf[i + 2];
          fourthByte = buf[i + 3];
          if ((secondByte & 0xC0) === 0x80 && (thirdByte & 0xC0) === 0x80 && (fourthByte & 0xC0) === 0x80) {
            tempCodePoint = (firstByte & 0xF) << 0x12 | (secondByte & 0x3F) << 0xC | (thirdByte & 0x3F) << 0x6 | fourthByte & 0x3F;
            if (tempCodePoint > 0xFFFF && tempCodePoint < 0x110000) {
              codePoint = tempCodePoint;
            }
          }
      }
    }

    if (codePoint === null) {
      // we did not generate a valid codePoint so insert a
      // replacement char (U+FFFD) and advance only 1 byte
      codePoint = 0xFFFD;
      bytesPerSequence = 1;
    } else if (codePoint > 0xFFFF) {
      // encode to utf16 (surrogate pair dance)
      codePoint -= 0x10000;
      res.push(codePoint >>> 10 & 0x3FF | 0xD800);
      codePoint = 0xDC00 | codePoint & 0x3FF;
    }

    res.push(codePoint);
    i += bytesPerSequence;
  }

  return decodeCodePointsArray(res);
}

// Based on http://stackoverflow.com/a/22747272/680742, the browser with
// the lowest limit is Chrome, with 0x10000 args.
// We go 1 magnitude less, for safety
var MAX_ARGUMENTS_LENGTH = 0x1000;

function decodeCodePointsArray(codePoints) {
  var len = codePoints.length;
  if (len <= MAX_ARGUMENTS_LENGTH) {
    return String.fromCharCode.apply(String, codePoints); // avoid extra slice()
  }

  // Decode in chunks to avoid "call stack size exceeded".
  var res = '';
  var i = 0;
  while (i < len) {
    res += String.fromCharCode.apply(String, codePoints.slice(i, i += MAX_ARGUMENTS_LENGTH));
  }
  return res;
}

function asciiSlice(buf, start, end) {
  var ret = '';
  end = Math.min(buf.length, end);

  for (var i = start; i < end; ++i) {
    ret += String.fromCharCode(buf[i] & 0x7F);
  }
  return ret;
}

function latin1Slice(buf, start, end) {
  var ret = '';
  end = Math.min(buf.length, end);

  for (var i = start; i < end; ++i) {
    ret += String.fromCharCode(buf[i]);
  }
  return ret;
}

function hexSlice(buf, start, end) {
  var len = buf.length;

  if (!start || start < 0) start = 0;
  if (!end || end < 0 || end > len) end = len;

  var out = '';
  for (var i = start; i < end; ++i) {
    out += toHex(buf[i]);
  }
  return out;
}

function utf16leSlice(buf, start, end) {
  var bytes = buf.slice(start, end);
  var res = '';
  for (var i = 0; i < bytes.length; i += 2) {
    res += String.fromCharCode(bytes[i] + bytes[i + 1] * 256);
  }
  return res;
}

Buffer.prototype.slice = function slice(start, end) {
  var len = this.length;
  start = ~~start;
  end = end === undefined ? len : ~~end;

  if (start < 0) {
    start += len;
    if (start < 0) start = 0;
  } else if (start > len) {
    start = len;
  }

  if (end < 0) {
    end += len;
    if (end < 0) end = 0;
  } else if (end > len) {
    end = len;
  }

  if (end < start) end = start;

  var newBuf;
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    newBuf = this.subarray(start, end);
    newBuf.__proto__ = Buffer.prototype;
  } else {
    var sliceLen = end - start;
    newBuf = new Buffer(sliceLen, undefined);
    for (var i = 0; i < sliceLen; ++i) {
      newBuf[i] = this[i + start];
    }
  }

  return newBuf;
};

/*
 * Need to make sure that buffer isn't trying to write out of bounds.
 */
function checkOffset(offset, ext, length) {
  if (offset % 1 !== 0 || offset < 0) throw new RangeError('offset is not uint');
  if (offset + ext > length) throw new RangeError('Trying to access beyond buffer length');
}

Buffer.prototype.readUIntLE = function readUIntLE(offset, byteLength, noAssert) {
  offset = offset | 0;
  byteLength = byteLength | 0;
  if (!noAssert) checkOffset(offset, byteLength, this.length);

  var val = this[offset];
  var mul = 1;
  var i = 0;
  while (++i < byteLength && (mul *= 0x100)) {
    val += this[offset + i] * mul;
  }

  return val;
};

Buffer.prototype.readUIntBE = function readUIntBE(offset, byteLength, noAssert) {
  offset = offset | 0;
  byteLength = byteLength | 0;
  if (!noAssert) {
    checkOffset(offset, byteLength, this.length);
  }

  var val = this[offset + --byteLength];
  var mul = 1;
  while (byteLength > 0 && (mul *= 0x100)) {
    val += this[offset + --byteLength] * mul;
  }

  return val;
};

Buffer.prototype.readUInt8 = function readUInt8(offset, noAssert) {
  if (!noAssert) checkOffset(offset, 1, this.length);
  return this[offset];
};

Buffer.prototype.readUInt16LE = function readUInt16LE(offset, noAssert) {
  if (!noAssert) checkOffset(offset, 2, this.length);
  return this[offset] | this[offset + 1] << 8;
};

Buffer.prototype.readUInt16BE = function readUInt16BE(offset, noAssert) {
  if (!noAssert) checkOffset(offset, 2, this.length);
  return this[offset] << 8 | this[offset + 1];
};

Buffer.prototype.readUInt32LE = function readUInt32LE(offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length);

  return (this[offset] | this[offset + 1] << 8 | this[offset + 2] << 16) + this[offset + 3] * 0x1000000;
};

Buffer.prototype.readUInt32BE = function readUInt32BE(offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length);

  return this[offset] * 0x1000000 + (this[offset + 1] << 16 | this[offset + 2] << 8 | this[offset + 3]);
};

Buffer.prototype.readIntLE = function readIntLE(offset, byteLength, noAssert) {
  offset = offset | 0;
  byteLength = byteLength | 0;
  if (!noAssert) checkOffset(offset, byteLength, this.length);

  var val = this[offset];
  var mul = 1;
  var i = 0;
  while (++i < byteLength && (mul *= 0x100)) {
    val += this[offset + i] * mul;
  }
  mul *= 0x80;

  if (val >= mul) val -= Math.pow(2, 8 * byteLength);

  return val;
};

Buffer.prototype.readIntBE = function readIntBE(offset, byteLength, noAssert) {
  offset = offset | 0;
  byteLength = byteLength | 0;
  if (!noAssert) checkOffset(offset, byteLength, this.length);

  var i = byteLength;
  var mul = 1;
  var val = this[offset + --i];
  while (i > 0 && (mul *= 0x100)) {
    val += this[offset + --i] * mul;
  }
  mul *= 0x80;

  if (val >= mul) val -= Math.pow(2, 8 * byteLength);

  return val;
};

Buffer.prototype.readInt8 = function readInt8(offset, noAssert) {
  if (!noAssert) checkOffset(offset, 1, this.length);
  if (!(this[offset] & 0x80)) return this[offset];
  return (0xff - this[offset] + 1) * -1;
};

Buffer.prototype.readInt16LE = function readInt16LE(offset, noAssert) {
  if (!noAssert) checkOffset(offset, 2, this.length);
  var val = this[offset] | this[offset + 1] << 8;
  return val & 0x8000 ? val | 0xFFFF0000 : val;
};

Buffer.prototype.readInt16BE = function readInt16BE(offset, noAssert) {
  if (!noAssert) checkOffset(offset, 2, this.length);
  var val = this[offset + 1] | this[offset] << 8;
  return val & 0x8000 ? val | 0xFFFF0000 : val;
};

Buffer.prototype.readInt32LE = function readInt32LE(offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length);

  return this[offset] | this[offset + 1] << 8 | this[offset + 2] << 16 | this[offset + 3] << 24;
};

Buffer.prototype.readInt32BE = function readInt32BE(offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length);

  return this[offset] << 24 | this[offset + 1] << 16 | this[offset + 2] << 8 | this[offset + 3];
};

Buffer.prototype.readFloatLE = function readFloatLE(offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length);
  return ieee754.read(this, offset, true, 23, 4);
};

Buffer.prototype.readFloatBE = function readFloatBE(offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length);
  return ieee754.read(this, offset, false, 23, 4);
};

Buffer.prototype.readDoubleLE = function readDoubleLE(offset, noAssert) {
  if (!noAssert) checkOffset(offset, 8, this.length);
  return ieee754.read(this, offset, true, 52, 8);
};

Buffer.prototype.readDoubleBE = function readDoubleBE(offset, noAssert) {
  if (!noAssert) checkOffset(offset, 8, this.length);
  return ieee754.read(this, offset, false, 52, 8);
};

function checkInt(buf, value, offset, ext, max, min) {
  if (!Buffer.isBuffer(buf)) throw new TypeError('"buffer" argument must be a Buffer instance');
  if (value > max || value < min) throw new RangeError('"value" argument is out of bounds');
  if (offset + ext > buf.length) throw new RangeError('Index out of range');
}

Buffer.prototype.writeUIntLE = function writeUIntLE(value, offset, byteLength, noAssert) {
  value = +value;
  offset = offset | 0;
  byteLength = byteLength | 0;
  if (!noAssert) {
    var maxBytes = Math.pow(2, 8 * byteLength) - 1;
    checkInt(this, value, offset, byteLength, maxBytes, 0);
  }

  var mul = 1;
  var i = 0;
  this[offset] = value & 0xFF;
  while (++i < byteLength && (mul *= 0x100)) {
    this[offset + i] = value / mul & 0xFF;
  }

  return offset + byteLength;
};

Buffer.prototype.writeUIntBE = function writeUIntBE(value, offset, byteLength, noAssert) {
  value = +value;
  offset = offset | 0;
  byteLength = byteLength | 0;
  if (!noAssert) {
    var maxBytes = Math.pow(2, 8 * byteLength) - 1;
    checkInt(this, value, offset, byteLength, maxBytes, 0);
  }

  var i = byteLength - 1;
  var mul = 1;
  this[offset + i] = value & 0xFF;
  while (--i >= 0 && (mul *= 0x100)) {
    this[offset + i] = value / mul & 0xFF;
  }

  return offset + byteLength;
};

Buffer.prototype.writeUInt8 = function writeUInt8(value, offset, noAssert) {
  value = +value;
  offset = offset | 0;
  if (!noAssert) checkInt(this, value, offset, 1, 0xff, 0);
  if (!Buffer.TYPED_ARRAY_SUPPORT) value = Math.floor(value);
  this[offset] = value & 0xff;
  return offset + 1;
};

function objectWriteUInt16(buf, value, offset, littleEndian) {
  if (value < 0) value = 0xffff + value + 1;
  for (var i = 0, j = Math.min(buf.length - offset, 2); i < j; ++i) {
    buf[offset + i] = (value & 0xff << 8 * (littleEndian ? i : 1 - i)) >>> (littleEndian ? i : 1 - i) * 8;
  }
}

Buffer.prototype.writeUInt16LE = function writeUInt16LE(value, offset, noAssert) {
  value = +value;
  offset = offset | 0;
  if (!noAssert) checkInt(this, value, offset, 2, 0xffff, 0);
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = value & 0xff;
    this[offset + 1] = value >>> 8;
  } else {
    objectWriteUInt16(this, value, offset, true);
  }
  return offset + 2;
};

Buffer.prototype.writeUInt16BE = function writeUInt16BE(value, offset, noAssert) {
  value = +value;
  offset = offset | 0;
  if (!noAssert) checkInt(this, value, offset, 2, 0xffff, 0);
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = value >>> 8;
    this[offset + 1] = value & 0xff;
  } else {
    objectWriteUInt16(this, value, offset, false);
  }
  return offset + 2;
};

function objectWriteUInt32(buf, value, offset, littleEndian) {
  if (value < 0) value = 0xffffffff + value + 1;
  for (var i = 0, j = Math.min(buf.length - offset, 4); i < j; ++i) {
    buf[offset + i] = value >>> (littleEndian ? i : 3 - i) * 8 & 0xff;
  }
}

Buffer.prototype.writeUInt32LE = function writeUInt32LE(value, offset, noAssert) {
  value = +value;
  offset = offset | 0;
  if (!noAssert) checkInt(this, value, offset, 4, 0xffffffff, 0);
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset + 3] = value >>> 24;
    this[offset + 2] = value >>> 16;
    this[offset + 1] = value >>> 8;
    this[offset] = value & 0xff;
  } else {
    objectWriteUInt32(this, value, offset, true);
  }
  return offset + 4;
};

Buffer.prototype.writeUInt32BE = function writeUInt32BE(value, offset, noAssert) {
  value = +value;
  offset = offset | 0;
  if (!noAssert) checkInt(this, value, offset, 4, 0xffffffff, 0);
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = value >>> 24;
    this[offset + 1] = value >>> 16;
    this[offset + 2] = value >>> 8;
    this[offset + 3] = value & 0xff;
  } else {
    objectWriteUInt32(this, value, offset, false);
  }
  return offset + 4;
};

Buffer.prototype.writeIntLE = function writeIntLE(value, offset, byteLength, noAssert) {
  value = +value;
  offset = offset | 0;
  if (!noAssert) {
    var limit = Math.pow(2, 8 * byteLength - 1);

    checkInt(this, value, offset, byteLength, limit - 1, -limit);
  }

  var i = 0;
  var mul = 1;
  var sub = 0;
  this[offset] = value & 0xFF;
  while (++i < byteLength && (mul *= 0x100)) {
    if (value < 0 && sub === 0 && this[offset + i - 1] !== 0) {
      sub = 1;
    }
    this[offset + i] = (value / mul >> 0) - sub & 0xFF;
  }

  return offset + byteLength;
};

Buffer.prototype.writeIntBE = function writeIntBE(value, offset, byteLength, noAssert) {
  value = +value;
  offset = offset | 0;
  if (!noAssert) {
    var limit = Math.pow(2, 8 * byteLength - 1);

    checkInt(this, value, offset, byteLength, limit - 1, -limit);
  }

  var i = byteLength - 1;
  var mul = 1;
  var sub = 0;
  this[offset + i] = value & 0xFF;
  while (--i >= 0 && (mul *= 0x100)) {
    if (value < 0 && sub === 0 && this[offset + i + 1] !== 0) {
      sub = 1;
    }
    this[offset + i] = (value / mul >> 0) - sub & 0xFF;
  }

  return offset + byteLength;
};

Buffer.prototype.writeInt8 = function writeInt8(value, offset, noAssert) {
  value = +value;
  offset = offset | 0;
  if (!noAssert) checkInt(this, value, offset, 1, 0x7f, -0x80);
  if (!Buffer.TYPED_ARRAY_SUPPORT) value = Math.floor(value);
  if (value < 0) value = 0xff + value + 1;
  this[offset] = value & 0xff;
  return offset + 1;
};

Buffer.prototype.writeInt16LE = function writeInt16LE(value, offset, noAssert) {
  value = +value;
  offset = offset | 0;
  if (!noAssert) checkInt(this, value, offset, 2, 0x7fff, -0x8000);
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = value & 0xff;
    this[offset + 1] = value >>> 8;
  } else {
    objectWriteUInt16(this, value, offset, true);
  }
  return offset + 2;
};

Buffer.prototype.writeInt16BE = function writeInt16BE(value, offset, noAssert) {
  value = +value;
  offset = offset | 0;
  if (!noAssert) checkInt(this, value, offset, 2, 0x7fff, -0x8000);
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = value >>> 8;
    this[offset + 1] = value & 0xff;
  } else {
    objectWriteUInt16(this, value, offset, false);
  }
  return offset + 2;
};

Buffer.prototype.writeInt32LE = function writeInt32LE(value, offset, noAssert) {
  value = +value;
  offset = offset | 0;
  if (!noAssert) checkInt(this, value, offset, 4, 0x7fffffff, -0x80000000);
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = value & 0xff;
    this[offset + 1] = value >>> 8;
    this[offset + 2] = value >>> 16;
    this[offset + 3] = value >>> 24;
  } else {
    objectWriteUInt32(this, value, offset, true);
  }
  return offset + 4;
};

Buffer.prototype.writeInt32BE = function writeInt32BE(value, offset, noAssert) {
  value = +value;
  offset = offset | 0;
  if (!noAssert) checkInt(this, value, offset, 4, 0x7fffffff, -0x80000000);
  if (value < 0) value = 0xffffffff + value + 1;
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = value >>> 24;
    this[offset + 1] = value >>> 16;
    this[offset + 2] = value >>> 8;
    this[offset + 3] = value & 0xff;
  } else {
    objectWriteUInt32(this, value, offset, false);
  }
  return offset + 4;
};

function checkIEEE754(buf, value, offset, ext, max, min) {
  if (offset + ext > buf.length) throw new RangeError('Index out of range');
  if (offset < 0) throw new RangeError('Index out of range');
}

function writeFloat(buf, value, offset, littleEndian, noAssert) {
  if (!noAssert) {
    checkIEEE754(buf, value, offset, 4, 3.4028234663852886e+38, -3.4028234663852886e+38);
  }
  ieee754.write(buf, value, offset, littleEndian, 23, 4);
  return offset + 4;
}

Buffer.prototype.writeFloatLE = function writeFloatLE(value, offset, noAssert) {
  return writeFloat(this, value, offset, true, noAssert);
};

Buffer.prototype.writeFloatBE = function writeFloatBE(value, offset, noAssert) {
  return writeFloat(this, value, offset, false, noAssert);
};

function writeDouble(buf, value, offset, littleEndian, noAssert) {
  if (!noAssert) {
    checkIEEE754(buf, value, offset, 8, 1.7976931348623157E+308, -1.7976931348623157E+308);
  }
  ieee754.write(buf, value, offset, littleEndian, 52, 8);
  return offset + 8;
}

Buffer.prototype.writeDoubleLE = function writeDoubleLE(value, offset, noAssert) {
  return writeDouble(this, value, offset, true, noAssert);
};

Buffer.prototype.writeDoubleBE = function writeDoubleBE(value, offset, noAssert) {
  return writeDouble(this, value, offset, false, noAssert);
};

// copy(targetBuffer, targetStart=0, sourceStart=0, sourceEnd=buffer.length)
Buffer.prototype.copy = function copy(target, targetStart, start, end) {
  if (!start) start = 0;
  if (!end && end !== 0) end = this.length;
  if (targetStart >= target.length) targetStart = target.length;
  if (!targetStart) targetStart = 0;
  if (end > 0 && end < start) end = start;

  // Copy 0 bytes; we're done
  if (end === start) return 0;
  if (target.length === 0 || this.length === 0) return 0;

  // Fatal error conditions
  if (targetStart < 0) {
    throw new RangeError('targetStart out of bounds');
  }
  if (start < 0 || start >= this.length) throw new RangeError('sourceStart out of bounds');
  if (end < 0) throw new RangeError('sourceEnd out of bounds');

  // Are we oob?
  if (end > this.length) end = this.length;
  if (target.length - targetStart < end - start) {
    end = target.length - targetStart + start;
  }

  var len = end - start;
  var i;

  if (this === target && start < targetStart && targetStart < end) {
    // descending copy from end
    for (i = len - 1; i >= 0; --i) {
      target[i + targetStart] = this[i + start];
    }
  } else if (len < 1000 || !Buffer.TYPED_ARRAY_SUPPORT) {
    // ascending copy from start
    for (i = 0; i < len; ++i) {
      target[i + targetStart] = this[i + start];
    }
  } else {
    Uint8Array.prototype.set.call(target, this.subarray(start, start + len), targetStart);
  }

  return len;
};

// Usage:
//    buffer.fill(number[, offset[, end]])
//    buffer.fill(buffer[, offset[, end]])
//    buffer.fill(string[, offset[, end]][, encoding])
Buffer.prototype.fill = function fill(val, start, end, encoding) {
  // Handle string cases:
  if (typeof val === 'string') {
    if (typeof start === 'string') {
      encoding = start;
      start = 0;
      end = this.length;
    } else if (typeof end === 'string') {
      encoding = end;
      end = this.length;
    }
    if (val.length === 1) {
      var code = val.charCodeAt(0);
      if (code < 256) {
        val = code;
      }
    }
    if (encoding !== undefined && typeof encoding !== 'string') {
      throw new TypeError('encoding must be a string');
    }
    if (typeof encoding === 'string' && !Buffer.isEncoding(encoding)) {
      throw new TypeError('Unknown encoding: ' + encoding);
    }
  } else if (typeof val === 'number') {
    val = val & 255;
  }

  // Invalid ranges are not set to a default, so can range check early.
  if (start < 0 || this.length < start || this.length < end) {
    throw new RangeError('Out of range index');
  }

  if (end <= start) {
    return this;
  }

  start = start >>> 0;
  end = end === undefined ? this.length : end >>> 0;

  if (!val) val = 0;

  var i;
  if (typeof val === 'number') {
    for (i = start; i < end; ++i) {
      this[i] = val;
    }
  } else {
    var bytes = Buffer.isBuffer(val) ? val : utf8ToBytes(new Buffer(val, encoding).toString());
    var len = bytes.length;
    for (i = 0; i < end - start; ++i) {
      this[i + start] = bytes[i % len];
    }
  }

  return this;
};

// HELPER FUNCTIONS
// ================

var INVALID_BASE64_RE = /[^+\/0-9A-Za-z-_]/g;

function base64clean(str) {
  // Node strips out invalid characters like \n and \t from the string, base64-js does not
  str = stringtrim(str).replace(INVALID_BASE64_RE, '');
  // Node converts strings with length < 2 to ''
  if (str.length < 2) return '';
  // Node allows for non-padded base64 strings (missing trailing ===), base64-js does not
  while (str.length % 4 !== 0) {
    str = str + '=';
  }
  return str;
}

function stringtrim(str) {
  if (str.trim) return str.trim();
  return str.replace(/^\s+|\s+$/g, '');
}

function toHex(n) {
  if (n < 16) return '0' + n.toString(16);
  return n.toString(16);
}

function utf8ToBytes(string, units) {
  units = units || Infinity;
  var codePoint;
  var length = string.length;
  var leadSurrogate = null;
  var bytes = [];

  for (var i = 0; i < length; ++i) {
    codePoint = string.charCodeAt(i);

    // is surrogate component
    if (codePoint > 0xD7FF && codePoint < 0xE000) {
      // last char was a lead
      if (!leadSurrogate) {
        // no lead yet
        if (codePoint > 0xDBFF) {
          // unexpected trail
          if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD);
          continue;
        } else if (i + 1 === length) {
          // unpaired lead
          if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD);
          continue;
        }

        // valid lead
        leadSurrogate = codePoint;

        continue;
      }

      // 2 leads in a row
      if (codePoint < 0xDC00) {
        if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD);
        leadSurrogate = codePoint;
        continue;
      }

      // valid surrogate pair
      codePoint = (leadSurrogate - 0xD800 << 10 | codePoint - 0xDC00) + 0x10000;
    } else if (leadSurrogate) {
      // valid bmp char, but last char was a lead
      if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD);
    }

    leadSurrogate = null;

    // encode utf8
    if (codePoint < 0x80) {
      if ((units -= 1) < 0) break;
      bytes.push(codePoint);
    } else if (codePoint < 0x800) {
      if ((units -= 2) < 0) break;
      bytes.push(codePoint >> 0x6 | 0xC0, codePoint & 0x3F | 0x80);
    } else if (codePoint < 0x10000) {
      if ((units -= 3) < 0) break;
      bytes.push(codePoint >> 0xC | 0xE0, codePoint >> 0x6 & 0x3F | 0x80, codePoint & 0x3F | 0x80);
    } else if (codePoint < 0x110000) {
      if ((units -= 4) < 0) break;
      bytes.push(codePoint >> 0x12 | 0xF0, codePoint >> 0xC & 0x3F | 0x80, codePoint >> 0x6 & 0x3F | 0x80, codePoint & 0x3F | 0x80);
    } else {
      throw new Error('Invalid code point');
    }
  }

  return bytes;
}

function asciiToBytes(str) {
  var byteArray = [];
  for (var i = 0; i < str.length; ++i) {
    // Node's code seems to be doing this and not & 0x7F..
    byteArray.push(str.charCodeAt(i) & 0xFF);
  }
  return byteArray;
}

function utf16leToBytes(str, units) {
  var c, hi, lo;
  var byteArray = [];
  for (var i = 0; i < str.length; ++i) {
    if ((units -= 2) < 0) break;

    c = str.charCodeAt(i);
    hi = c >> 8;
    lo = c % 256;
    byteArray.push(lo);
    byteArray.push(hi);
  }

  return byteArray;
}

function base64ToBytes(str) {
  return base64.toByteArray(base64clean(str));
}

function blitBuffer(src, dst, offset, length) {
  for (var i = 0; i < length; ++i) {
    if (i + offset >= dst.length || i >= src.length) break;
    dst[i + offset] = src[i];
  }
  return i;
}

function isnan(val) {
  return val !== val; // eslint-disable-line no-self-compare
}
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(8)))

/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(Buffer) {

/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/
// css base code, injected by the css-loader
module.exports = function (useSourceMap) {
	var list = [];

	// return the list of modules as css string
	list.toString = function toString() {
		return this.map(function (item) {
			var content = cssWithMappingToString(item, useSourceMap);
			if (item[2]) {
				return "@media " + item[2] + "{" + content + "}";
			} else {
				return content;
			}
		}).join("");
	};

	// import a list of modules into the list
	list.i = function (modules, mediaQuery) {
		if (typeof modules === "string") modules = [[null, modules, ""]];
		var alreadyImportedModules = {};
		for (var i = 0; i < this.length; i++) {
			var id = this[i][0];
			if (typeof id === "number") alreadyImportedModules[id] = true;
		}
		for (i = 0; i < modules.length; i++) {
			var item = modules[i];
			// skip already imported module
			// this implementation is not 100% perfect for weird media query combinations
			//  when a module is imported multiple times with different media queries.
			//  I hope this will never occur (Hey this way we have smaller bundles)
			if (typeof item[0] !== "number" || !alreadyImportedModules[item[0]]) {
				if (mediaQuery && !item[2]) {
					item[2] = mediaQuery;
				} else if (mediaQuery) {
					item[2] = "(" + item[2] + ") and (" + mediaQuery + ")";
				}
				list.push(item);
			}
		}
	};
	return list;
};

function cssWithMappingToString(item, useSourceMap) {
	var content = item[1] || '';
	var cssMapping = item[3];
	if (!cssMapping) {
		return content;
	}

	if (useSourceMap) {
		var sourceMapping = toComment(cssMapping);
		var sourceURLs = cssMapping.sources.map(function (source) {
			return '/*# sourceURL=' + cssMapping.sourceRoot + source + ' */';
		});

		return [content].concat(sourceURLs).concat([sourceMapping]).join('\n');
	}

	return [content].join('\n');
}

// Adapted from convert-source-map (MIT)
function toComment(sourceMap) {
	var base64 = new Buffer(JSON.stringify(sourceMap)).toString('base64');
	var data = 'sourceMappingURL=data:application/json;charset=utf-8;base64,' + base64;

	return '/*# ' + data + ' */';
}
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(4).Buffer))

/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

"use strict";


exports.read = function (buffer, offset, isLE, mLen, nBytes) {
  var e, m;
  var eLen = nBytes * 8 - mLen - 1;
  var eMax = (1 << eLen) - 1;
  var eBias = eMax >> 1;
  var nBits = -7;
  var i = isLE ? nBytes - 1 : 0;
  var d = isLE ? -1 : 1;
  var s = buffer[offset + i];

  i += d;

  e = s & (1 << -nBits) - 1;
  s >>= -nBits;
  nBits += eLen;
  for (; nBits > 0; e = e * 256 + buffer[offset + i], i += d, nBits -= 8) {}

  m = e & (1 << -nBits) - 1;
  e >>= -nBits;
  nBits += mLen;
  for (; nBits > 0; m = m * 256 + buffer[offset + i], i += d, nBits -= 8) {}

  if (e === 0) {
    e = 1 - eBias;
  } else if (e === eMax) {
    return m ? NaN : (s ? -1 : 1) * Infinity;
  } else {
    m = m + Math.pow(2, mLen);
    e = e - eBias;
  }
  return (s ? -1 : 1) * m * Math.pow(2, e - mLen);
};

exports.write = function (buffer, value, offset, isLE, mLen, nBytes) {
  var e, m, c;
  var eLen = nBytes * 8 - mLen - 1;
  var eMax = (1 << eLen) - 1;
  var eBias = eMax >> 1;
  var rt = mLen === 23 ? Math.pow(2, -24) - Math.pow(2, -77) : 0;
  var i = isLE ? 0 : nBytes - 1;
  var d = isLE ? 1 : -1;
  var s = value < 0 || value === 0 && 1 / value < 0 ? 1 : 0;

  value = Math.abs(value);

  if (isNaN(value) || value === Infinity) {
    m = isNaN(value) ? 1 : 0;
    e = eMax;
  } else {
    e = Math.floor(Math.log(value) / Math.LN2);
    if (value * (c = Math.pow(2, -e)) < 1) {
      e--;
      c *= 2;
    }
    if (e + eBias >= 1) {
      value += rt / c;
    } else {
      value += rt * Math.pow(2, 1 - eBias);
    }
    if (value * c >= 2) {
      e++;
      c /= 2;
    }

    if (e + eBias >= eMax) {
      m = 0;
      e = eMax;
    } else if (e + eBias >= 1) {
      m = (value * c - 1) * Math.pow(2, mLen);
      e = e + eBias;
    } else {
      m = value * Math.pow(2, eBias - 1) * Math.pow(2, mLen);
      e = 0;
    }
  }

  for (; mLen >= 8; buffer[offset + i] = m & 0xff, i += d, m /= 256, mLen -= 8) {}

  e = e << mLen | m;
  eLen += mLen;
  for (; eLen > 0; buffer[offset + i] = e & 0xff, i += d, e /= 256, eLen -= 8) {}

  buffer[offset + i - d] |= s * 128;
};

/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

"use strict";


var toString = {}.toString;

module.exports = Array.isArray || function (arr) {
  return toString.call(arr) == '[object Array]';
};

/***/ },
/* 8 */
/***/ function(module, exports, __webpack_require__) {

"use strict";


var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var g;

// This works in non-strict mode
g = function () {
	return this;
}();

try {
	// This works if eval is allowed (see CSP)
	g = g || Function("return this")() || (1, eval)("this");
} catch (e) {
	// This works if the window reference is available
	if ((typeof window === "undefined" ? "undefined" : _typeof(window)) === "object") g = window;
}

// g can still be undefined, but nothing to do about it...
// We return undefined, instead of nothing here, so it's
// easier to handle this case. if(!global) { ...}

module.exports = g;

/***/ },
/* 9 */
/***/ function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(5)(undefined);
// imports


// module
exports.push([module.i, "img {\n    border: 10px solid black;\n}", ""]);

// exports


/***/ },
/* 10 */
/***/ function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "982058ac4f4f75cee6a5e9b5d63bda32.jpg";

/***/ },
/* 11 */
/***/ function(module, exports) {

module.exports = "data:image/jpeg;base64,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"

/***/ }
]);