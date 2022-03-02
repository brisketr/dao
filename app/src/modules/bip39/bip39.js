"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __markAsModule = (target) => __defProp(target, "__esModule", { value: true });
var __esm = (fn, res) => function __init() {
  return fn && (res = (0, fn[__getOwnPropNames(fn)[0]])(fn = 0)), res;
};
var __commonJS = (cb, mod) => function __require() {
  return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __reExport = (target, module, copyDefault, desc) => {
  if (module && typeof module === "object" || typeof module === "function") {
    for (let key of __getOwnPropNames(module))
      if (!__hasOwnProp.call(target, key) && (copyDefault || key !== "default"))
        __defProp(target, key, { get: () => module[key], enumerable: !(desc = __getOwnPropDesc(module, key)) || desc.enumerable });
  }
  return target;
};
var __toCommonJS = /* @__PURE__ */ ((cache) => {
  return (module, temp) => {
    return cache && cache.get(module) || (temp = __reExport(__markAsModule({}), module, 1), cache && cache.set(module, temp), temp);
  };
})(typeof WeakMap !== "undefined" ? /* @__PURE__ */ new WeakMap() : 0);

// node-modules-polyfills:buffer
var buffer_exports = {};
__export(buffer_exports, {
  Buffer: () => Buffer2,
  INSPECT_MAX_BYTES: () => INSPECT_MAX_BYTES,
  SlowBuffer: () => SlowBuffer,
  isBuffer: () => isBuffer,
  kMaxLength: () => _kMaxLength
});
function init() {
  inited = true;
  var code = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
  for (var i = 0, len = code.length; i < len; ++i) {
    lookup[i] = code[i];
    revLookup[code.charCodeAt(i)] = i;
  }
  revLookup["-".charCodeAt(0)] = 62;
  revLookup["_".charCodeAt(0)] = 63;
}
function toByteArray(b64) {
  if (!inited) {
    init();
  }
  var i, j, l, tmp, placeHolders, arr;
  var len = b64.length;
  if (len % 4 > 0) {
    throw new Error("Invalid string. Length must be a multiple of 4");
  }
  placeHolders = b64[len - 2] === "=" ? 2 : b64[len - 1] === "=" ? 1 : 0;
  arr = new Arr(len * 3 / 4 - placeHolders);
  l = placeHolders > 0 ? len - 4 : len;
  var L = 0;
  for (i = 0, j = 0; i < l; i += 4, j += 3) {
    tmp = revLookup[b64.charCodeAt(i)] << 18 | revLookup[b64.charCodeAt(i + 1)] << 12 | revLookup[b64.charCodeAt(i + 2)] << 6 | revLookup[b64.charCodeAt(i + 3)];
    arr[L++] = tmp >> 16 & 255;
    arr[L++] = tmp >> 8 & 255;
    arr[L++] = tmp & 255;
  }
  if (placeHolders === 2) {
    tmp = revLookup[b64.charCodeAt(i)] << 2 | revLookup[b64.charCodeAt(i + 1)] >> 4;
    arr[L++] = tmp & 255;
  } else if (placeHolders === 1) {
    tmp = revLookup[b64.charCodeAt(i)] << 10 | revLookup[b64.charCodeAt(i + 1)] << 4 | revLookup[b64.charCodeAt(i + 2)] >> 2;
    arr[L++] = tmp >> 8 & 255;
    arr[L++] = tmp & 255;
  }
  return arr;
}
function tripletToBase64(num) {
  return lookup[num >> 18 & 63] + lookup[num >> 12 & 63] + lookup[num >> 6 & 63] + lookup[num & 63];
}
function encodeChunk(uint8, start, end) {
  var tmp;
  var output = [];
  for (var i = start; i < end; i += 3) {
    tmp = (uint8[i] << 16) + (uint8[i + 1] << 8) + uint8[i + 2];
    output.push(tripletToBase64(tmp));
  }
  return output.join("");
}
function fromByteArray(uint8) {
  if (!inited) {
    init();
  }
  var tmp;
  var len = uint8.length;
  var extraBytes = len % 3;
  var output = "";
  var parts = [];
  var maxChunkLength = 16383;
  for (var i = 0, len2 = len - extraBytes; i < len2; i += maxChunkLength) {
    parts.push(encodeChunk(uint8, i, i + maxChunkLength > len2 ? len2 : i + maxChunkLength));
  }
  if (extraBytes === 1) {
    tmp = uint8[len - 1];
    output += lookup[tmp >> 2];
    output += lookup[tmp << 4 & 63];
    output += "==";
  } else if (extraBytes === 2) {
    tmp = (uint8[len - 2] << 8) + uint8[len - 1];
    output += lookup[tmp >> 10];
    output += lookup[tmp >> 4 & 63];
    output += lookup[tmp << 2 & 63];
    output += "=";
  }
  parts.push(output);
  return parts.join("");
}
function read(buffer, offset, isLE, mLen, nBytes) {
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
  for (; nBits > 0; e = e * 256 + buffer[offset + i], i += d, nBits -= 8) {
  }
  m = e & (1 << -nBits) - 1;
  e >>= -nBits;
  nBits += mLen;
  for (; nBits > 0; m = m * 256 + buffer[offset + i], i += d, nBits -= 8) {
  }
  if (e === 0) {
    e = 1 - eBias;
  } else if (e === eMax) {
    return m ? NaN : (s ? -1 : 1) * Infinity;
  } else {
    m = m + Math.pow(2, mLen);
    e = e - eBias;
  }
  return (s ? -1 : 1) * m * Math.pow(2, e - mLen);
}
function write(buffer, value, offset, isLE, mLen, nBytes) {
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
  for (; mLen >= 8; buffer[offset + i] = m & 255, i += d, m /= 256, mLen -= 8) {
  }
  e = e << mLen | m;
  eLen += mLen;
  for (; eLen > 0; buffer[offset + i] = e & 255, i += d, e /= 256, eLen -= 8) {
  }
  buffer[offset + i - d] |= s * 128;
}
function kMaxLength() {
  return Buffer2.TYPED_ARRAY_SUPPORT ? 2147483647 : 1073741823;
}
function createBuffer(that, length) {
  if (kMaxLength() < length) {
    throw new RangeError("Invalid typed array length");
  }
  if (Buffer2.TYPED_ARRAY_SUPPORT) {
    that = new Uint8Array(length);
    that.__proto__ = Buffer2.prototype;
  } else {
    if (that === null) {
      that = new Buffer2(length);
    }
    that.length = length;
  }
  return that;
}
function Buffer2(arg, encodingOrOffset, length) {
  if (!Buffer2.TYPED_ARRAY_SUPPORT && !(this instanceof Buffer2)) {
    return new Buffer2(arg, encodingOrOffset, length);
  }
  if (typeof arg === "number") {
    if (typeof encodingOrOffset === "string") {
      throw new Error("If encoding is specified then the first argument must be a string");
    }
    return allocUnsafe(this, arg);
  }
  return from(this, arg, encodingOrOffset, length);
}
function from(that, value, encodingOrOffset, length) {
  if (typeof value === "number") {
    throw new TypeError('"value" argument must not be a number');
  }
  if (typeof ArrayBuffer !== "undefined" && value instanceof ArrayBuffer) {
    return fromArrayBuffer(that, value, encodingOrOffset, length);
  }
  if (typeof value === "string") {
    return fromString(that, value, encodingOrOffset);
  }
  return fromObject(that, value);
}
function assertSize(size) {
  if (typeof size !== "number") {
    throw new TypeError('"size" argument must be a number');
  } else if (size < 0) {
    throw new RangeError('"size" argument must not be negative');
  }
}
function alloc(that, size, fill2, encoding) {
  assertSize(size);
  if (size <= 0) {
    return createBuffer(that, size);
  }
  if (fill2 !== void 0) {
    return typeof encoding === "string" ? createBuffer(that, size).fill(fill2, encoding) : createBuffer(that, size).fill(fill2);
  }
  return createBuffer(that, size);
}
function allocUnsafe(that, size) {
  assertSize(size);
  that = createBuffer(that, size < 0 ? 0 : checked(size) | 0);
  if (!Buffer2.TYPED_ARRAY_SUPPORT) {
    for (var i = 0; i < size; ++i) {
      that[i] = 0;
    }
  }
  return that;
}
function fromString(that, string, encoding) {
  if (typeof encoding !== "string" || encoding === "") {
    encoding = "utf8";
  }
  if (!Buffer2.isEncoding(encoding)) {
    throw new TypeError('"encoding" must be a valid string encoding');
  }
  var length = byteLength(string, encoding) | 0;
  that = createBuffer(that, length);
  var actual = that.write(string, encoding);
  if (actual !== length) {
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
  array.byteLength;
  if (byteOffset < 0 || array.byteLength < byteOffset) {
    throw new RangeError("'offset' is out of bounds");
  }
  if (array.byteLength < byteOffset + (length || 0)) {
    throw new RangeError("'length' is out of bounds");
  }
  if (byteOffset === void 0 && length === void 0) {
    array = new Uint8Array(array);
  } else if (length === void 0) {
    array = new Uint8Array(array, byteOffset);
  } else {
    array = new Uint8Array(array, byteOffset, length);
  }
  if (Buffer2.TYPED_ARRAY_SUPPORT) {
    that = array;
    that.__proto__ = Buffer2.prototype;
  } else {
    that = fromArrayLike(that, array);
  }
  return that;
}
function fromObject(that, obj) {
  if (internalIsBuffer(obj)) {
    var len = checked(obj.length) | 0;
    that = createBuffer(that, len);
    if (that.length === 0) {
      return that;
    }
    obj.copy(that, 0, 0, len);
    return that;
  }
  if (obj) {
    if (typeof ArrayBuffer !== "undefined" && obj.buffer instanceof ArrayBuffer || "length" in obj) {
      if (typeof obj.length !== "number" || isnan(obj.length)) {
        return createBuffer(that, 0);
      }
      return fromArrayLike(that, obj);
    }
    if (obj.type === "Buffer" && isArray(obj.data)) {
      return fromArrayLike(that, obj.data);
    }
  }
  throw new TypeError("First argument must be a string, Buffer, ArrayBuffer, Array, or array-like object.");
}
function checked(length) {
  if (length >= kMaxLength()) {
    throw new RangeError("Attempt to allocate Buffer larger than maximum size: 0x" + kMaxLength().toString(16) + " bytes");
  }
  return length | 0;
}
function SlowBuffer(length) {
  if (+length != length) {
    length = 0;
  }
  return Buffer2.alloc(+length);
}
function internalIsBuffer(b) {
  return !!(b != null && b._isBuffer);
}
function byteLength(string, encoding) {
  if (internalIsBuffer(string)) {
    return string.length;
  }
  if (typeof ArrayBuffer !== "undefined" && typeof ArrayBuffer.isView === "function" && (ArrayBuffer.isView(string) || string instanceof ArrayBuffer)) {
    return string.byteLength;
  }
  if (typeof string !== "string") {
    string = "" + string;
  }
  var len = string.length;
  if (len === 0)
    return 0;
  var loweredCase = false;
  for (; ; ) {
    switch (encoding) {
      case "ascii":
      case "latin1":
      case "binary":
        return len;
      case "utf8":
      case "utf-8":
      case void 0:
        return utf8ToBytes(string).length;
      case "ucs2":
      case "ucs-2":
      case "utf16le":
      case "utf-16le":
        return len * 2;
      case "hex":
        return len >>> 1;
      case "base64":
        return base64ToBytes(string).length;
      default:
        if (loweredCase)
          return utf8ToBytes(string).length;
        encoding = ("" + encoding).toLowerCase();
        loweredCase = true;
    }
  }
}
function slowToString(encoding, start, end) {
  var loweredCase = false;
  if (start === void 0 || start < 0) {
    start = 0;
  }
  if (start > this.length) {
    return "";
  }
  if (end === void 0 || end > this.length) {
    end = this.length;
  }
  if (end <= 0) {
    return "";
  }
  end >>>= 0;
  start >>>= 0;
  if (end <= start) {
    return "";
  }
  if (!encoding)
    encoding = "utf8";
  while (true) {
    switch (encoding) {
      case "hex":
        return hexSlice(this, start, end);
      case "utf8":
      case "utf-8":
        return utf8Slice(this, start, end);
      case "ascii":
        return asciiSlice(this, start, end);
      case "latin1":
      case "binary":
        return latin1Slice(this, start, end);
      case "base64":
        return base64Slice(this, start, end);
      case "ucs2":
      case "ucs-2":
      case "utf16le":
      case "utf-16le":
        return utf16leSlice(this, start, end);
      default:
        if (loweredCase)
          throw new TypeError("Unknown encoding: " + encoding);
        encoding = (encoding + "").toLowerCase();
        loweredCase = true;
    }
  }
}
function swap(b, n, m) {
  var i = b[n];
  b[n] = b[m];
  b[m] = i;
}
function bidirectionalIndexOf(buffer, val, byteOffset, encoding, dir) {
  if (buffer.length === 0)
    return -1;
  if (typeof byteOffset === "string") {
    encoding = byteOffset;
    byteOffset = 0;
  } else if (byteOffset > 2147483647) {
    byteOffset = 2147483647;
  } else if (byteOffset < -2147483648) {
    byteOffset = -2147483648;
  }
  byteOffset = +byteOffset;
  if (isNaN(byteOffset)) {
    byteOffset = dir ? 0 : buffer.length - 1;
  }
  if (byteOffset < 0)
    byteOffset = buffer.length + byteOffset;
  if (byteOffset >= buffer.length) {
    if (dir)
      return -1;
    else
      byteOffset = buffer.length - 1;
  } else if (byteOffset < 0) {
    if (dir)
      byteOffset = 0;
    else
      return -1;
  }
  if (typeof val === "string") {
    val = Buffer2.from(val, encoding);
  }
  if (internalIsBuffer(val)) {
    if (val.length === 0) {
      return -1;
    }
    return arrayIndexOf(buffer, val, byteOffset, encoding, dir);
  } else if (typeof val === "number") {
    val = val & 255;
    if (Buffer2.TYPED_ARRAY_SUPPORT && typeof Uint8Array.prototype.indexOf === "function") {
      if (dir) {
        return Uint8Array.prototype.indexOf.call(buffer, val, byteOffset);
      } else {
        return Uint8Array.prototype.lastIndexOf.call(buffer, val, byteOffset);
      }
    }
    return arrayIndexOf(buffer, [val], byteOffset, encoding, dir);
  }
  throw new TypeError("val must be string, number or Buffer");
}
function arrayIndexOf(arr, val, byteOffset, encoding, dir) {
  var indexSize = 1;
  var arrLength = arr.length;
  var valLength = val.length;
  if (encoding !== void 0) {
    encoding = String(encoding).toLowerCase();
    if (encoding === "ucs2" || encoding === "ucs-2" || encoding === "utf16le" || encoding === "utf-16le") {
      if (arr.length < 2 || val.length < 2) {
        return -1;
      }
      indexSize = 2;
      arrLength /= 2;
      valLength /= 2;
      byteOffset /= 2;
    }
  }
  function read2(buf, i2) {
    if (indexSize === 1) {
      return buf[i2];
    } else {
      return buf.readUInt16BE(i2 * indexSize);
    }
  }
  var i;
  if (dir) {
    var foundIndex = -1;
    for (i = byteOffset; i < arrLength; i++) {
      if (read2(arr, i) === read2(val, foundIndex === -1 ? 0 : i - foundIndex)) {
        if (foundIndex === -1)
          foundIndex = i;
        if (i - foundIndex + 1 === valLength)
          return foundIndex * indexSize;
      } else {
        if (foundIndex !== -1)
          i -= i - foundIndex;
        foundIndex = -1;
      }
    }
  } else {
    if (byteOffset + valLength > arrLength)
      byteOffset = arrLength - valLength;
    for (i = byteOffset; i >= 0; i--) {
      var found = true;
      for (var j = 0; j < valLength; j++) {
        if (read2(arr, i + j) !== read2(val, j)) {
          found = false;
          break;
        }
      }
      if (found)
        return i;
    }
  }
  return -1;
}
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
  var strLen = string.length;
  if (strLen % 2 !== 0)
    throw new TypeError("Invalid hex string");
  if (length > strLen / 2) {
    length = strLen / 2;
  }
  for (var i = 0; i < length; ++i) {
    var parsed = parseInt(string.substr(i * 2, 2), 16);
    if (isNaN(parsed))
      return i;
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
function base64Slice(buf, start, end) {
  if (start === 0 && end === buf.length) {
    return fromByteArray(buf);
  } else {
    return fromByteArray(buf.slice(start, end));
  }
}
function utf8Slice(buf, start, end) {
  end = Math.min(buf.length, end);
  var res = [];
  var i = start;
  while (i < end) {
    var firstByte = buf[i];
    var codePoint = null;
    var bytesPerSequence = firstByte > 239 ? 4 : firstByte > 223 ? 3 : firstByte > 191 ? 2 : 1;
    if (i + bytesPerSequence <= end) {
      var secondByte, thirdByte, fourthByte, tempCodePoint;
      switch (bytesPerSequence) {
        case 1:
          if (firstByte < 128) {
            codePoint = firstByte;
          }
          break;
        case 2:
          secondByte = buf[i + 1];
          if ((secondByte & 192) === 128) {
            tempCodePoint = (firstByte & 31) << 6 | secondByte & 63;
            if (tempCodePoint > 127) {
              codePoint = tempCodePoint;
            }
          }
          break;
        case 3:
          secondByte = buf[i + 1];
          thirdByte = buf[i + 2];
          if ((secondByte & 192) === 128 && (thirdByte & 192) === 128) {
            tempCodePoint = (firstByte & 15) << 12 | (secondByte & 63) << 6 | thirdByte & 63;
            if (tempCodePoint > 2047 && (tempCodePoint < 55296 || tempCodePoint > 57343)) {
              codePoint = tempCodePoint;
            }
          }
          break;
        case 4:
          secondByte = buf[i + 1];
          thirdByte = buf[i + 2];
          fourthByte = buf[i + 3];
          if ((secondByte & 192) === 128 && (thirdByte & 192) === 128 && (fourthByte & 192) === 128) {
            tempCodePoint = (firstByte & 15) << 18 | (secondByte & 63) << 12 | (thirdByte & 63) << 6 | fourthByte & 63;
            if (tempCodePoint > 65535 && tempCodePoint < 1114112) {
              codePoint = tempCodePoint;
            }
          }
      }
    }
    if (codePoint === null) {
      codePoint = 65533;
      bytesPerSequence = 1;
    } else if (codePoint > 65535) {
      codePoint -= 65536;
      res.push(codePoint >>> 10 & 1023 | 55296);
      codePoint = 56320 | codePoint & 1023;
    }
    res.push(codePoint);
    i += bytesPerSequence;
  }
  return decodeCodePointsArray(res);
}
function decodeCodePointsArray(codePoints) {
  var len = codePoints.length;
  if (len <= MAX_ARGUMENTS_LENGTH) {
    return String.fromCharCode.apply(String, codePoints);
  }
  var res = "";
  var i = 0;
  while (i < len) {
    res += String.fromCharCode.apply(String, codePoints.slice(i, i += MAX_ARGUMENTS_LENGTH));
  }
  return res;
}
function asciiSlice(buf, start, end) {
  var ret = "";
  end = Math.min(buf.length, end);
  for (var i = start; i < end; ++i) {
    ret += String.fromCharCode(buf[i] & 127);
  }
  return ret;
}
function latin1Slice(buf, start, end) {
  var ret = "";
  end = Math.min(buf.length, end);
  for (var i = start; i < end; ++i) {
    ret += String.fromCharCode(buf[i]);
  }
  return ret;
}
function hexSlice(buf, start, end) {
  var len = buf.length;
  if (!start || start < 0)
    start = 0;
  if (!end || end < 0 || end > len)
    end = len;
  var out = "";
  for (var i = start; i < end; ++i) {
    out += toHex(buf[i]);
  }
  return out;
}
function utf16leSlice(buf, start, end) {
  var bytes = buf.slice(start, end);
  var res = "";
  for (var i = 0; i < bytes.length; i += 2) {
    res += String.fromCharCode(bytes[i] + bytes[i + 1] * 256);
  }
  return res;
}
function checkOffset(offset, ext, length) {
  if (offset % 1 !== 0 || offset < 0)
    throw new RangeError("offset is not uint");
  if (offset + ext > length)
    throw new RangeError("Trying to access beyond buffer length");
}
function checkInt(buf, value, offset, ext, max, min) {
  if (!internalIsBuffer(buf))
    throw new TypeError('"buffer" argument must be a Buffer instance');
  if (value > max || value < min)
    throw new RangeError('"value" argument is out of bounds');
  if (offset + ext > buf.length)
    throw new RangeError("Index out of range");
}
function objectWriteUInt16(buf, value, offset, littleEndian) {
  if (value < 0)
    value = 65535 + value + 1;
  for (var i = 0, j = Math.min(buf.length - offset, 2); i < j; ++i) {
    buf[offset + i] = (value & 255 << 8 * (littleEndian ? i : 1 - i)) >>> (littleEndian ? i : 1 - i) * 8;
  }
}
function objectWriteUInt32(buf, value, offset, littleEndian) {
  if (value < 0)
    value = 4294967295 + value + 1;
  for (var i = 0, j = Math.min(buf.length - offset, 4); i < j; ++i) {
    buf[offset + i] = value >>> (littleEndian ? i : 3 - i) * 8 & 255;
  }
}
function checkIEEE754(buf, value, offset, ext, max, min) {
  if (offset + ext > buf.length)
    throw new RangeError("Index out of range");
  if (offset < 0)
    throw new RangeError("Index out of range");
}
function writeFloat(buf, value, offset, littleEndian, noAssert) {
  if (!noAssert) {
    checkIEEE754(buf, value, offset, 4);
  }
  write(buf, value, offset, littleEndian, 23, 4);
  return offset + 4;
}
function writeDouble(buf, value, offset, littleEndian, noAssert) {
  if (!noAssert) {
    checkIEEE754(buf, value, offset, 8);
  }
  write(buf, value, offset, littleEndian, 52, 8);
  return offset + 8;
}
function base64clean(str) {
  str = stringtrim(str).replace(INVALID_BASE64_RE, "");
  if (str.length < 2)
    return "";
  while (str.length % 4 !== 0) {
    str = str + "=";
  }
  return str;
}
function stringtrim(str) {
  if (str.trim)
    return str.trim();
  return str.replace(/^\s+|\s+$/g, "");
}
function toHex(n) {
  if (n < 16)
    return "0" + n.toString(16);
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
    if (codePoint > 55295 && codePoint < 57344) {
      if (!leadSurrogate) {
        if (codePoint > 56319) {
          if ((units -= 3) > -1)
            bytes.push(239, 191, 189);
          continue;
        } else if (i + 1 === length) {
          if ((units -= 3) > -1)
            bytes.push(239, 191, 189);
          continue;
        }
        leadSurrogate = codePoint;
        continue;
      }
      if (codePoint < 56320) {
        if ((units -= 3) > -1)
          bytes.push(239, 191, 189);
        leadSurrogate = codePoint;
        continue;
      }
      codePoint = (leadSurrogate - 55296 << 10 | codePoint - 56320) + 65536;
    } else if (leadSurrogate) {
      if ((units -= 3) > -1)
        bytes.push(239, 191, 189);
    }
    leadSurrogate = null;
    if (codePoint < 128) {
      if ((units -= 1) < 0)
        break;
      bytes.push(codePoint);
    } else if (codePoint < 2048) {
      if ((units -= 2) < 0)
        break;
      bytes.push(codePoint >> 6 | 192, codePoint & 63 | 128);
    } else if (codePoint < 65536) {
      if ((units -= 3) < 0)
        break;
      bytes.push(codePoint >> 12 | 224, codePoint >> 6 & 63 | 128, codePoint & 63 | 128);
    } else if (codePoint < 1114112) {
      if ((units -= 4) < 0)
        break;
      bytes.push(codePoint >> 18 | 240, codePoint >> 12 & 63 | 128, codePoint >> 6 & 63 | 128, codePoint & 63 | 128);
    } else {
      throw new Error("Invalid code point");
    }
  }
  return bytes;
}
function asciiToBytes(str) {
  var byteArray = [];
  for (var i = 0; i < str.length; ++i) {
    byteArray.push(str.charCodeAt(i) & 255);
  }
  return byteArray;
}
function utf16leToBytes(str, units) {
  var c, hi, lo;
  var byteArray = [];
  for (var i = 0; i < str.length; ++i) {
    if ((units -= 2) < 0)
      break;
    c = str.charCodeAt(i);
    hi = c >> 8;
    lo = c % 256;
    byteArray.push(lo);
    byteArray.push(hi);
  }
  return byteArray;
}
function base64ToBytes(str) {
  return toByteArray(base64clean(str));
}
function blitBuffer(src, dst, offset, length) {
  for (var i = 0; i < length; ++i) {
    if (i + offset >= dst.length || i >= src.length)
      break;
    dst[i + offset] = src[i];
  }
  return i;
}
function isnan(val) {
  return val !== val;
}
function isBuffer(obj) {
  return obj != null && (!!obj._isBuffer || isFastBuffer(obj) || isSlowBuffer(obj));
}
function isFastBuffer(obj) {
  return !!obj.constructor && typeof obj.constructor.isBuffer === "function" && obj.constructor.isBuffer(obj);
}
function isSlowBuffer(obj) {
  return typeof obj.readFloatLE === "function" && typeof obj.slice === "function" && isFastBuffer(obj.slice(0, 0));
}
var lookup, revLookup, Arr, inited, toString, isArray, INSPECT_MAX_BYTES, _kMaxLength, MAX_ARGUMENTS_LENGTH, INVALID_BASE64_RE;
var init_buffer = __esm({
  "node-modules-polyfills:buffer"() {
    init_node_globals();
    lookup = [];
    revLookup = [];
    Arr = typeof Uint8Array !== "undefined" ? Uint8Array : Array;
    inited = false;
    toString = {}.toString;
    isArray = Array.isArray || function(arr) {
      return toString.call(arr) == "[object Array]";
    };
    INSPECT_MAX_BYTES = 50;
    Buffer2.TYPED_ARRAY_SUPPORT = globalThis.TYPED_ARRAY_SUPPORT !== void 0 ? globalThis.TYPED_ARRAY_SUPPORT : true;
    _kMaxLength = kMaxLength();
    Buffer2.poolSize = 8192;
    Buffer2._augment = function(arr) {
      arr.__proto__ = Buffer2.prototype;
      return arr;
    };
    Buffer2.from = function(value, encodingOrOffset, length) {
      return from(null, value, encodingOrOffset, length);
    };
    if (Buffer2.TYPED_ARRAY_SUPPORT) {
      Buffer2.prototype.__proto__ = Uint8Array.prototype;
      Buffer2.__proto__ = Uint8Array;
    }
    Buffer2.alloc = function(size, fill2, encoding) {
      return alloc(null, size, fill2, encoding);
    };
    Buffer2.allocUnsafe = function(size) {
      return allocUnsafe(null, size);
    };
    Buffer2.allocUnsafeSlow = function(size) {
      return allocUnsafe(null, size);
    };
    Buffer2.isBuffer = isBuffer;
    Buffer2.compare = function compare(a, b) {
      if (!internalIsBuffer(a) || !internalIsBuffer(b)) {
        throw new TypeError("Arguments must be Buffers");
      }
      if (a === b)
        return 0;
      var x = a.length;
      var y = b.length;
      for (var i = 0, len = Math.min(x, y); i < len; ++i) {
        if (a[i] !== b[i]) {
          x = a[i];
          y = b[i];
          break;
        }
      }
      if (x < y)
        return -1;
      if (y < x)
        return 1;
      return 0;
    };
    Buffer2.isEncoding = function isEncoding(encoding) {
      switch (String(encoding).toLowerCase()) {
        case "hex":
        case "utf8":
        case "utf-8":
        case "ascii":
        case "latin1":
        case "binary":
        case "base64":
        case "ucs2":
        case "ucs-2":
        case "utf16le":
        case "utf-16le":
          return true;
        default:
          return false;
      }
    };
    Buffer2.concat = function concat(list, length) {
      if (!isArray(list)) {
        throw new TypeError('"list" argument must be an Array of Buffers');
      }
      if (list.length === 0) {
        return Buffer2.alloc(0);
      }
      var i;
      if (length === void 0) {
        length = 0;
        for (i = 0; i < list.length; ++i) {
          length += list[i].length;
        }
      }
      var buffer = Buffer2.allocUnsafe(length);
      var pos = 0;
      for (i = 0; i < list.length; ++i) {
        var buf = list[i];
        if (!internalIsBuffer(buf)) {
          throw new TypeError('"list" argument must be an Array of Buffers');
        }
        buf.copy(buffer, pos);
        pos += buf.length;
      }
      return buffer;
    };
    Buffer2.byteLength = byteLength;
    Buffer2.prototype._isBuffer = true;
    Buffer2.prototype.swap16 = function swap16() {
      var len = this.length;
      if (len % 2 !== 0) {
        throw new RangeError("Buffer size must be a multiple of 16-bits");
      }
      for (var i = 0; i < len; i += 2) {
        swap(this, i, i + 1);
      }
      return this;
    };
    Buffer2.prototype.swap32 = function swap32() {
      var len = this.length;
      if (len % 4 !== 0) {
        throw new RangeError("Buffer size must be a multiple of 32-bits");
      }
      for (var i = 0; i < len; i += 4) {
        swap(this, i, i + 3);
        swap(this, i + 1, i + 2);
      }
      return this;
    };
    Buffer2.prototype.swap64 = function swap64() {
      var len = this.length;
      if (len % 8 !== 0) {
        throw new RangeError("Buffer size must be a multiple of 64-bits");
      }
      for (var i = 0; i < len; i += 8) {
        swap(this, i, i + 7);
        swap(this, i + 1, i + 6);
        swap(this, i + 2, i + 5);
        swap(this, i + 3, i + 4);
      }
      return this;
    };
    Buffer2.prototype.toString = function toString2() {
      var length = this.length | 0;
      if (length === 0)
        return "";
      if (arguments.length === 0)
        return utf8Slice(this, 0, length);
      return slowToString.apply(this, arguments);
    };
    Buffer2.prototype.equals = function equals(b) {
      if (!internalIsBuffer(b))
        throw new TypeError("Argument must be a Buffer");
      if (this === b)
        return true;
      return Buffer2.compare(this, b) === 0;
    };
    Buffer2.prototype.inspect = function inspect() {
      var str = "";
      var max = INSPECT_MAX_BYTES;
      if (this.length > 0) {
        str = this.toString("hex", 0, max).match(/.{2}/g).join(" ");
        if (this.length > max)
          str += " ... ";
      }
      return "<Buffer " + str + ">";
    };
    Buffer2.prototype.compare = function compare2(target, start, end, thisStart, thisEnd) {
      if (!internalIsBuffer(target)) {
        throw new TypeError("Argument must be a Buffer");
      }
      if (start === void 0) {
        start = 0;
      }
      if (end === void 0) {
        end = target ? target.length : 0;
      }
      if (thisStart === void 0) {
        thisStart = 0;
      }
      if (thisEnd === void 0) {
        thisEnd = this.length;
      }
      if (start < 0 || end > target.length || thisStart < 0 || thisEnd > this.length) {
        throw new RangeError("out of range index");
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
      if (this === target)
        return 0;
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
      if (x < y)
        return -1;
      if (y < x)
        return 1;
      return 0;
    };
    Buffer2.prototype.includes = function includes(val, byteOffset, encoding) {
      return this.indexOf(val, byteOffset, encoding) !== -1;
    };
    Buffer2.prototype.indexOf = function indexOf(val, byteOffset, encoding) {
      return bidirectionalIndexOf(this, val, byteOffset, encoding, true);
    };
    Buffer2.prototype.lastIndexOf = function lastIndexOf(val, byteOffset, encoding) {
      return bidirectionalIndexOf(this, val, byteOffset, encoding, false);
    };
    Buffer2.prototype.write = function write2(string, offset, length, encoding) {
      if (offset === void 0) {
        encoding = "utf8";
        length = this.length;
        offset = 0;
      } else if (length === void 0 && typeof offset === "string") {
        encoding = offset;
        length = this.length;
        offset = 0;
      } else if (isFinite(offset)) {
        offset = offset | 0;
        if (isFinite(length)) {
          length = length | 0;
          if (encoding === void 0)
            encoding = "utf8";
        } else {
          encoding = length;
          length = void 0;
        }
      } else {
        throw new Error("Buffer.write(string, encoding, offset[, length]) is no longer supported");
      }
      var remaining = this.length - offset;
      if (length === void 0 || length > remaining)
        length = remaining;
      if (string.length > 0 && (length < 0 || offset < 0) || offset > this.length) {
        throw new RangeError("Attempt to write outside buffer bounds");
      }
      if (!encoding)
        encoding = "utf8";
      var loweredCase = false;
      for (; ; ) {
        switch (encoding) {
          case "hex":
            return hexWrite(this, string, offset, length);
          case "utf8":
          case "utf-8":
            return utf8Write(this, string, offset, length);
          case "ascii":
            return asciiWrite(this, string, offset, length);
          case "latin1":
          case "binary":
            return latin1Write(this, string, offset, length);
          case "base64":
            return base64Write(this, string, offset, length);
          case "ucs2":
          case "ucs-2":
          case "utf16le":
          case "utf-16le":
            return ucs2Write(this, string, offset, length);
          default:
            if (loweredCase)
              throw new TypeError("Unknown encoding: " + encoding);
            encoding = ("" + encoding).toLowerCase();
            loweredCase = true;
        }
      }
    };
    Buffer2.prototype.toJSON = function toJSON() {
      return {
        type: "Buffer",
        data: Array.prototype.slice.call(this._arr || this, 0)
      };
    };
    MAX_ARGUMENTS_LENGTH = 4096;
    Buffer2.prototype.slice = function slice(start, end) {
      var len = this.length;
      start = ~~start;
      end = end === void 0 ? len : ~~end;
      if (start < 0) {
        start += len;
        if (start < 0)
          start = 0;
      } else if (start > len) {
        start = len;
      }
      if (end < 0) {
        end += len;
        if (end < 0)
          end = 0;
      } else if (end > len) {
        end = len;
      }
      if (end < start)
        end = start;
      var newBuf;
      if (Buffer2.TYPED_ARRAY_SUPPORT) {
        newBuf = this.subarray(start, end);
        newBuf.__proto__ = Buffer2.prototype;
      } else {
        var sliceLen = end - start;
        newBuf = new Buffer2(sliceLen, void 0);
        for (var i = 0; i < sliceLen; ++i) {
          newBuf[i] = this[i + start];
        }
      }
      return newBuf;
    };
    Buffer2.prototype.readUIntLE = function readUIntLE(offset, byteLength2, noAssert) {
      offset = offset | 0;
      byteLength2 = byteLength2 | 0;
      if (!noAssert)
        checkOffset(offset, byteLength2, this.length);
      var val = this[offset];
      var mul = 1;
      var i = 0;
      while (++i < byteLength2 && (mul *= 256)) {
        val += this[offset + i] * mul;
      }
      return val;
    };
    Buffer2.prototype.readUIntBE = function readUIntBE(offset, byteLength2, noAssert) {
      offset = offset | 0;
      byteLength2 = byteLength2 | 0;
      if (!noAssert) {
        checkOffset(offset, byteLength2, this.length);
      }
      var val = this[offset + --byteLength2];
      var mul = 1;
      while (byteLength2 > 0 && (mul *= 256)) {
        val += this[offset + --byteLength2] * mul;
      }
      return val;
    };
    Buffer2.prototype.readUInt8 = function readUInt8(offset, noAssert) {
      if (!noAssert)
        checkOffset(offset, 1, this.length);
      return this[offset];
    };
    Buffer2.prototype.readUInt16LE = function readUInt16LE(offset, noAssert) {
      if (!noAssert)
        checkOffset(offset, 2, this.length);
      return this[offset] | this[offset + 1] << 8;
    };
    Buffer2.prototype.readUInt16BE = function readUInt16BE(offset, noAssert) {
      if (!noAssert)
        checkOffset(offset, 2, this.length);
      return this[offset] << 8 | this[offset + 1];
    };
    Buffer2.prototype.readUInt32LE = function readUInt32LE(offset, noAssert) {
      if (!noAssert)
        checkOffset(offset, 4, this.length);
      return (this[offset] | this[offset + 1] << 8 | this[offset + 2] << 16) + this[offset + 3] * 16777216;
    };
    Buffer2.prototype.readUInt32BE = function readUInt32BE(offset, noAssert) {
      if (!noAssert)
        checkOffset(offset, 4, this.length);
      return this[offset] * 16777216 + (this[offset + 1] << 16 | this[offset + 2] << 8 | this[offset + 3]);
    };
    Buffer2.prototype.readIntLE = function readIntLE(offset, byteLength2, noAssert) {
      offset = offset | 0;
      byteLength2 = byteLength2 | 0;
      if (!noAssert)
        checkOffset(offset, byteLength2, this.length);
      var val = this[offset];
      var mul = 1;
      var i = 0;
      while (++i < byteLength2 && (mul *= 256)) {
        val += this[offset + i] * mul;
      }
      mul *= 128;
      if (val >= mul)
        val -= Math.pow(2, 8 * byteLength2);
      return val;
    };
    Buffer2.prototype.readIntBE = function readIntBE(offset, byteLength2, noAssert) {
      offset = offset | 0;
      byteLength2 = byteLength2 | 0;
      if (!noAssert)
        checkOffset(offset, byteLength2, this.length);
      var i = byteLength2;
      var mul = 1;
      var val = this[offset + --i];
      while (i > 0 && (mul *= 256)) {
        val += this[offset + --i] * mul;
      }
      mul *= 128;
      if (val >= mul)
        val -= Math.pow(2, 8 * byteLength2);
      return val;
    };
    Buffer2.prototype.readInt8 = function readInt8(offset, noAssert) {
      if (!noAssert)
        checkOffset(offset, 1, this.length);
      if (!(this[offset] & 128))
        return this[offset];
      return (255 - this[offset] + 1) * -1;
    };
    Buffer2.prototype.readInt16LE = function readInt16LE(offset, noAssert) {
      if (!noAssert)
        checkOffset(offset, 2, this.length);
      var val = this[offset] | this[offset + 1] << 8;
      return val & 32768 ? val | 4294901760 : val;
    };
    Buffer2.prototype.readInt16BE = function readInt16BE(offset, noAssert) {
      if (!noAssert)
        checkOffset(offset, 2, this.length);
      var val = this[offset + 1] | this[offset] << 8;
      return val & 32768 ? val | 4294901760 : val;
    };
    Buffer2.prototype.readInt32LE = function readInt32LE(offset, noAssert) {
      if (!noAssert)
        checkOffset(offset, 4, this.length);
      return this[offset] | this[offset + 1] << 8 | this[offset + 2] << 16 | this[offset + 3] << 24;
    };
    Buffer2.prototype.readInt32BE = function readInt32BE(offset, noAssert) {
      if (!noAssert)
        checkOffset(offset, 4, this.length);
      return this[offset] << 24 | this[offset + 1] << 16 | this[offset + 2] << 8 | this[offset + 3];
    };
    Buffer2.prototype.readFloatLE = function readFloatLE(offset, noAssert) {
      if (!noAssert)
        checkOffset(offset, 4, this.length);
      return read(this, offset, true, 23, 4);
    };
    Buffer2.prototype.readFloatBE = function readFloatBE(offset, noAssert) {
      if (!noAssert)
        checkOffset(offset, 4, this.length);
      return read(this, offset, false, 23, 4);
    };
    Buffer2.prototype.readDoubleLE = function readDoubleLE(offset, noAssert) {
      if (!noAssert)
        checkOffset(offset, 8, this.length);
      return read(this, offset, true, 52, 8);
    };
    Buffer2.prototype.readDoubleBE = function readDoubleBE(offset, noAssert) {
      if (!noAssert)
        checkOffset(offset, 8, this.length);
      return read(this, offset, false, 52, 8);
    };
    Buffer2.prototype.writeUIntLE = function writeUIntLE(value, offset, byteLength2, noAssert) {
      value = +value;
      offset = offset | 0;
      byteLength2 = byteLength2 | 0;
      if (!noAssert) {
        var maxBytes = Math.pow(2, 8 * byteLength2) - 1;
        checkInt(this, value, offset, byteLength2, maxBytes, 0);
      }
      var mul = 1;
      var i = 0;
      this[offset] = value & 255;
      while (++i < byteLength2 && (mul *= 256)) {
        this[offset + i] = value / mul & 255;
      }
      return offset + byteLength2;
    };
    Buffer2.prototype.writeUIntBE = function writeUIntBE(value, offset, byteLength2, noAssert) {
      value = +value;
      offset = offset | 0;
      byteLength2 = byteLength2 | 0;
      if (!noAssert) {
        var maxBytes = Math.pow(2, 8 * byteLength2) - 1;
        checkInt(this, value, offset, byteLength2, maxBytes, 0);
      }
      var i = byteLength2 - 1;
      var mul = 1;
      this[offset + i] = value & 255;
      while (--i >= 0 && (mul *= 256)) {
        this[offset + i] = value / mul & 255;
      }
      return offset + byteLength2;
    };
    Buffer2.prototype.writeUInt8 = function writeUInt8(value, offset, noAssert) {
      value = +value;
      offset = offset | 0;
      if (!noAssert)
        checkInt(this, value, offset, 1, 255, 0);
      if (!Buffer2.TYPED_ARRAY_SUPPORT)
        value = Math.floor(value);
      this[offset] = value & 255;
      return offset + 1;
    };
    Buffer2.prototype.writeUInt16LE = function writeUInt16LE(value, offset, noAssert) {
      value = +value;
      offset = offset | 0;
      if (!noAssert)
        checkInt(this, value, offset, 2, 65535, 0);
      if (Buffer2.TYPED_ARRAY_SUPPORT) {
        this[offset] = value & 255;
        this[offset + 1] = value >>> 8;
      } else {
        objectWriteUInt16(this, value, offset, true);
      }
      return offset + 2;
    };
    Buffer2.prototype.writeUInt16BE = function writeUInt16BE(value, offset, noAssert) {
      value = +value;
      offset = offset | 0;
      if (!noAssert)
        checkInt(this, value, offset, 2, 65535, 0);
      if (Buffer2.TYPED_ARRAY_SUPPORT) {
        this[offset] = value >>> 8;
        this[offset + 1] = value & 255;
      } else {
        objectWriteUInt16(this, value, offset, false);
      }
      return offset + 2;
    };
    Buffer2.prototype.writeUInt32LE = function writeUInt32LE(value, offset, noAssert) {
      value = +value;
      offset = offset | 0;
      if (!noAssert)
        checkInt(this, value, offset, 4, 4294967295, 0);
      if (Buffer2.TYPED_ARRAY_SUPPORT) {
        this[offset + 3] = value >>> 24;
        this[offset + 2] = value >>> 16;
        this[offset + 1] = value >>> 8;
        this[offset] = value & 255;
      } else {
        objectWriteUInt32(this, value, offset, true);
      }
      return offset + 4;
    };
    Buffer2.prototype.writeUInt32BE = function writeUInt32BE(value, offset, noAssert) {
      value = +value;
      offset = offset | 0;
      if (!noAssert)
        checkInt(this, value, offset, 4, 4294967295, 0);
      if (Buffer2.TYPED_ARRAY_SUPPORT) {
        this[offset] = value >>> 24;
        this[offset + 1] = value >>> 16;
        this[offset + 2] = value >>> 8;
        this[offset + 3] = value & 255;
      } else {
        objectWriteUInt32(this, value, offset, false);
      }
      return offset + 4;
    };
    Buffer2.prototype.writeIntLE = function writeIntLE(value, offset, byteLength2, noAssert) {
      value = +value;
      offset = offset | 0;
      if (!noAssert) {
        var limit = Math.pow(2, 8 * byteLength2 - 1);
        checkInt(this, value, offset, byteLength2, limit - 1, -limit);
      }
      var i = 0;
      var mul = 1;
      var sub = 0;
      this[offset] = value & 255;
      while (++i < byteLength2 && (mul *= 256)) {
        if (value < 0 && sub === 0 && this[offset + i - 1] !== 0) {
          sub = 1;
        }
        this[offset + i] = (value / mul >> 0) - sub & 255;
      }
      return offset + byteLength2;
    };
    Buffer2.prototype.writeIntBE = function writeIntBE(value, offset, byteLength2, noAssert) {
      value = +value;
      offset = offset | 0;
      if (!noAssert) {
        var limit = Math.pow(2, 8 * byteLength2 - 1);
        checkInt(this, value, offset, byteLength2, limit - 1, -limit);
      }
      var i = byteLength2 - 1;
      var mul = 1;
      var sub = 0;
      this[offset + i] = value & 255;
      while (--i >= 0 && (mul *= 256)) {
        if (value < 0 && sub === 0 && this[offset + i + 1] !== 0) {
          sub = 1;
        }
        this[offset + i] = (value / mul >> 0) - sub & 255;
      }
      return offset + byteLength2;
    };
    Buffer2.prototype.writeInt8 = function writeInt8(value, offset, noAssert) {
      value = +value;
      offset = offset | 0;
      if (!noAssert)
        checkInt(this, value, offset, 1, 127, -128);
      if (!Buffer2.TYPED_ARRAY_SUPPORT)
        value = Math.floor(value);
      if (value < 0)
        value = 255 + value + 1;
      this[offset] = value & 255;
      return offset + 1;
    };
    Buffer2.prototype.writeInt16LE = function writeInt16LE(value, offset, noAssert) {
      value = +value;
      offset = offset | 0;
      if (!noAssert)
        checkInt(this, value, offset, 2, 32767, -32768);
      if (Buffer2.TYPED_ARRAY_SUPPORT) {
        this[offset] = value & 255;
        this[offset + 1] = value >>> 8;
      } else {
        objectWriteUInt16(this, value, offset, true);
      }
      return offset + 2;
    };
    Buffer2.prototype.writeInt16BE = function writeInt16BE(value, offset, noAssert) {
      value = +value;
      offset = offset | 0;
      if (!noAssert)
        checkInt(this, value, offset, 2, 32767, -32768);
      if (Buffer2.TYPED_ARRAY_SUPPORT) {
        this[offset] = value >>> 8;
        this[offset + 1] = value & 255;
      } else {
        objectWriteUInt16(this, value, offset, false);
      }
      return offset + 2;
    };
    Buffer2.prototype.writeInt32LE = function writeInt32LE(value, offset, noAssert) {
      value = +value;
      offset = offset | 0;
      if (!noAssert)
        checkInt(this, value, offset, 4, 2147483647, -2147483648);
      if (Buffer2.TYPED_ARRAY_SUPPORT) {
        this[offset] = value & 255;
        this[offset + 1] = value >>> 8;
        this[offset + 2] = value >>> 16;
        this[offset + 3] = value >>> 24;
      } else {
        objectWriteUInt32(this, value, offset, true);
      }
      return offset + 4;
    };
    Buffer2.prototype.writeInt32BE = function writeInt32BE(value, offset, noAssert) {
      value = +value;
      offset = offset | 0;
      if (!noAssert)
        checkInt(this, value, offset, 4, 2147483647, -2147483648);
      if (value < 0)
        value = 4294967295 + value + 1;
      if (Buffer2.TYPED_ARRAY_SUPPORT) {
        this[offset] = value >>> 24;
        this[offset + 1] = value >>> 16;
        this[offset + 2] = value >>> 8;
        this[offset + 3] = value & 255;
      } else {
        objectWriteUInt32(this, value, offset, false);
      }
      return offset + 4;
    };
    Buffer2.prototype.writeFloatLE = function writeFloatLE(value, offset, noAssert) {
      return writeFloat(this, value, offset, true, noAssert);
    };
    Buffer2.prototype.writeFloatBE = function writeFloatBE(value, offset, noAssert) {
      return writeFloat(this, value, offset, false, noAssert);
    };
    Buffer2.prototype.writeDoubleLE = function writeDoubleLE(value, offset, noAssert) {
      return writeDouble(this, value, offset, true, noAssert);
    };
    Buffer2.prototype.writeDoubleBE = function writeDoubleBE(value, offset, noAssert) {
      return writeDouble(this, value, offset, false, noAssert);
    };
    Buffer2.prototype.copy = function copy(target, targetStart, start, end) {
      if (!start)
        start = 0;
      if (!end && end !== 0)
        end = this.length;
      if (targetStart >= target.length)
        targetStart = target.length;
      if (!targetStart)
        targetStart = 0;
      if (end > 0 && end < start)
        end = start;
      if (end === start)
        return 0;
      if (target.length === 0 || this.length === 0)
        return 0;
      if (targetStart < 0) {
        throw new RangeError("targetStart out of bounds");
      }
      if (start < 0 || start >= this.length)
        throw new RangeError("sourceStart out of bounds");
      if (end < 0)
        throw new RangeError("sourceEnd out of bounds");
      if (end > this.length)
        end = this.length;
      if (target.length - targetStart < end - start) {
        end = target.length - targetStart + start;
      }
      var len = end - start;
      var i;
      if (this === target && start < targetStart && targetStart < end) {
        for (i = len - 1; i >= 0; --i) {
          target[i + targetStart] = this[i + start];
        }
      } else if (len < 1e3 || !Buffer2.TYPED_ARRAY_SUPPORT) {
        for (i = 0; i < len; ++i) {
          target[i + targetStart] = this[i + start];
        }
      } else {
        Uint8Array.prototype.set.call(target, this.subarray(start, start + len), targetStart);
      }
      return len;
    };
    Buffer2.prototype.fill = function fill(val, start, end, encoding) {
      if (typeof val === "string") {
        if (typeof start === "string") {
          encoding = start;
          start = 0;
          end = this.length;
        } else if (typeof end === "string") {
          encoding = end;
          end = this.length;
        }
        if (val.length === 1) {
          var code = val.charCodeAt(0);
          if (code < 256) {
            val = code;
          }
        }
        if (encoding !== void 0 && typeof encoding !== "string") {
          throw new TypeError("encoding must be a string");
        }
        if (typeof encoding === "string" && !Buffer2.isEncoding(encoding)) {
          throw new TypeError("Unknown encoding: " + encoding);
        }
      } else if (typeof val === "number") {
        val = val & 255;
      }
      if (start < 0 || this.length < start || this.length < end) {
        throw new RangeError("Out of range index");
      }
      if (end <= start) {
        return this;
      }
      start = start >>> 0;
      end = end === void 0 ? this.length : end >>> 0;
      if (!val)
        val = 0;
      var i;
      if (typeof val === "number") {
        for (i = start; i < end; ++i) {
          this[i] = val;
        }
      } else {
        var bytes = internalIsBuffer(val) ? val : utf8ToBytes(new Buffer2(val, encoding).toString());
        var len = bytes.length;
        for (i = 0; i < end - start; ++i) {
          this[i + start] = bytes[i % len];
        }
      }
      return this;
    };
    INVALID_BASE64_RE = /[^+\/0-9A-Za-z-_]/g;
  }
});

// node-modules-polyfills-commonjs:buffer
var require_buffer = __commonJS({
  "node-modules-polyfills-commonjs:buffer"(exports, module) {
    init_node_globals();
    var polyfill = (init_buffer(), __toCommonJS(buffer_exports));
    if (polyfill && polyfill.default) {
      module.exports = polyfill.default;
      for (let k in polyfill) {
        module.exports[k] = polyfill[k];
      }
    } else if (polyfill) {
      module.exports = polyfill;
    }
  }
});

// ../node_modules/process/browser.js
var require_browser = __commonJS({
  "../node_modules/process/browser.js"(exports, module) {
    init_node_globals();
    var process2 = module.exports = {};
    var cachedSetTimeout2;
    var cachedClearTimeout2;
    function defaultSetTimout2() {
      throw new Error("setTimeout has not been defined");
    }
    function defaultClearTimeout2() {
      throw new Error("clearTimeout has not been defined");
    }
    (function() {
      try {
        if (typeof setTimeout === "function") {
          cachedSetTimeout2 = setTimeout;
        } else {
          cachedSetTimeout2 = defaultSetTimout2;
        }
      } catch (e) {
        cachedSetTimeout2 = defaultSetTimout2;
      }
      try {
        if (typeof clearTimeout === "function") {
          cachedClearTimeout2 = clearTimeout;
        } else {
          cachedClearTimeout2 = defaultClearTimeout2;
        }
      } catch (e) {
        cachedClearTimeout2 = defaultClearTimeout2;
      }
    })();
    function runTimeout2(fun) {
      if (cachedSetTimeout2 === setTimeout) {
        return setTimeout(fun, 0);
      }
      if ((cachedSetTimeout2 === defaultSetTimout2 || !cachedSetTimeout2) && setTimeout) {
        cachedSetTimeout2 = setTimeout;
        return setTimeout(fun, 0);
      }
      try {
        return cachedSetTimeout2(fun, 0);
      } catch (e) {
        try {
          return cachedSetTimeout2.call(null, fun, 0);
        } catch (e2) {
          return cachedSetTimeout2.call(this, fun, 0);
        }
      }
    }
    function runClearTimeout2(marker) {
      if (cachedClearTimeout2 === clearTimeout) {
        return clearTimeout(marker);
      }
      if ((cachedClearTimeout2 === defaultClearTimeout2 || !cachedClearTimeout2) && clearTimeout) {
        cachedClearTimeout2 = clearTimeout;
        return clearTimeout(marker);
      }
      try {
        return cachedClearTimeout2(marker);
      } catch (e) {
        try {
          return cachedClearTimeout2.call(null, marker);
        } catch (e2) {
          return cachedClearTimeout2.call(this, marker);
        }
      }
    }
    var queue2 = [];
    var draining2 = false;
    var currentQueue2;
    var queueIndex2 = -1;
    function cleanUpNextTick2() {
      if (!draining2 || !currentQueue2) {
        return;
      }
      draining2 = false;
      if (currentQueue2.length) {
        queue2 = currentQueue2.concat(queue2);
      } else {
        queueIndex2 = -1;
      }
      if (queue2.length) {
        drainQueue2();
      }
    }
    function drainQueue2() {
      if (draining2) {
        return;
      }
      var timeout = runTimeout2(cleanUpNextTick2);
      draining2 = true;
      var len = queue2.length;
      while (len) {
        currentQueue2 = queue2;
        queue2 = [];
        while (++queueIndex2 < len) {
          if (currentQueue2) {
            currentQueue2[queueIndex2].run();
          }
        }
        queueIndex2 = -1;
        len = queue2.length;
      }
      currentQueue2 = null;
      draining2 = false;
      runClearTimeout2(timeout);
    }
    process2.nextTick = function(fun) {
      var args = new Array(arguments.length - 1);
      if (arguments.length > 1) {
        for (var i = 1; i < arguments.length; i++) {
          args[i - 1] = arguments[i];
        }
      }
      queue2.push(new Item2(fun, args));
      if (queue2.length === 1 && !draining2) {
        runTimeout2(drainQueue2);
      }
    };
    function Item2(fun, array) {
      this.fun = fun;
      this.array = array;
    }
    Item2.prototype.run = function() {
      this.fun.apply(null, this.array);
    };
    process2.title = "browser";
    process2.browser = true;
    process2.env = {};
    process2.argv = [];
    process2.version = "";
    process2.versions = {};
    function noop2() {
    }
    process2.on = noop2;
    process2.addListener = noop2;
    process2.once = noop2;
    process2.off = noop2;
    process2.removeListener = noop2;
    process2.removeAllListeners = noop2;
    process2.emit = noop2;
    process2.prependListener = noop2;
    process2.prependOnceListener = noop2;
    process2.listeners = function(name) {
      return [];
    };
    process2.binding = function(name) {
      throw new Error("process.binding is not supported");
    };
    process2.cwd = function() {
      return "/";
    };
    process2.chdir = function(dir) {
      throw new Error("process.chdir is not supported");
    };
    process2.umask = function() {
      return 0;
    };
  }
});

// src/node-globals.js
var Buffer3, process;
var init_node_globals = __esm({
  "src/node-globals.js"() {
    Buffer3 = require_buffer().Buffer;
    process = require_browser();
    if (globalThis && globalThis.process && globalThis.process.env)
      globalThis.process.env.LIBP2P_FORCE_PNET = false;
  }
});

// ../node_modules/inherits/inherits_browser.js
var require_inherits_browser = __commonJS({
  "../node_modules/inherits/inherits_browser.js"(exports, module) {
    init_node_globals();
    if (typeof Object.create === "function") {
      module.exports = function inherits2(ctor, superCtor) {
        if (superCtor) {
          ctor.super_ = superCtor;
          ctor.prototype = Object.create(superCtor.prototype, {
            constructor: {
              value: ctor,
              enumerable: false,
              writable: true,
              configurable: true
            }
          });
        }
      };
    } else {
      module.exports = function inherits2(ctor, superCtor) {
        if (superCtor) {
          ctor.super_ = superCtor;
          var TempCtor = function() {
          };
          TempCtor.prototype = superCtor.prototype;
          ctor.prototype = new TempCtor();
          ctor.prototype.constructor = ctor;
        }
      };
    }
  }
});

// ../node_modules/safe-buffer/index.js
var require_safe_buffer = __commonJS({
  "../node_modules/safe-buffer/index.js"(exports, module) {
    init_node_globals();
    var buffer = require_buffer();
    var Buffer4 = buffer.Buffer;
    function copyProps(src, dst) {
      for (var key in src) {
        dst[key] = src[key];
      }
    }
    if (Buffer4.from && Buffer4.alloc && Buffer4.allocUnsafe && Buffer4.allocUnsafeSlow) {
      module.exports = buffer;
    } else {
      copyProps(buffer, exports);
      exports.Buffer = SafeBuffer;
    }
    function SafeBuffer(arg, encodingOrOffset, length) {
      return Buffer4(arg, encodingOrOffset, length);
    }
    SafeBuffer.prototype = Object.create(Buffer4.prototype);
    copyProps(Buffer4, SafeBuffer);
    SafeBuffer.from = function(arg, encodingOrOffset, length) {
      if (typeof arg === "number") {
        throw new TypeError("Argument must not be a number");
      }
      return Buffer4(arg, encodingOrOffset, length);
    };
    SafeBuffer.alloc = function(size, fill2, encoding) {
      if (typeof size !== "number") {
        throw new TypeError("Argument must be a number");
      }
      var buf = Buffer4(size);
      if (fill2 !== void 0) {
        if (typeof encoding === "string") {
          buf.fill(fill2, encoding);
        } else {
          buf.fill(fill2);
        }
      } else {
        buf.fill(0);
      }
      return buf;
    };
    SafeBuffer.allocUnsafe = function(size) {
      if (typeof size !== "number") {
        throw new TypeError("Argument must be a number");
      }
      return Buffer4(size);
    };
    SafeBuffer.allocUnsafeSlow = function(size) {
      if (typeof size !== "number") {
        throw new TypeError("Argument must be a number");
      }
      return buffer.SlowBuffer(size);
    };
  }
});

// node-modules-polyfills:events
var events_exports = {};
__export(events_exports, {
  EventEmitter: () => EventEmitter,
  default: () => events_default
});
function EventHandlers() {
}
function EventEmitter() {
  EventEmitter.init.call(this);
}
function $getMaxListeners(that) {
  if (that._maxListeners === void 0)
    return EventEmitter.defaultMaxListeners;
  return that._maxListeners;
}
function emitNone(handler, isFn, self2) {
  if (isFn)
    handler.call(self2);
  else {
    var len = handler.length;
    var listeners2 = arrayClone(handler, len);
    for (var i = 0; i < len; ++i)
      listeners2[i].call(self2);
  }
}
function emitOne(handler, isFn, self2, arg1) {
  if (isFn)
    handler.call(self2, arg1);
  else {
    var len = handler.length;
    var listeners2 = arrayClone(handler, len);
    for (var i = 0; i < len; ++i)
      listeners2[i].call(self2, arg1);
  }
}
function emitTwo(handler, isFn, self2, arg1, arg2) {
  if (isFn)
    handler.call(self2, arg1, arg2);
  else {
    var len = handler.length;
    var listeners2 = arrayClone(handler, len);
    for (var i = 0; i < len; ++i)
      listeners2[i].call(self2, arg1, arg2);
  }
}
function emitThree(handler, isFn, self2, arg1, arg2, arg3) {
  if (isFn)
    handler.call(self2, arg1, arg2, arg3);
  else {
    var len = handler.length;
    var listeners2 = arrayClone(handler, len);
    for (var i = 0; i < len; ++i)
      listeners2[i].call(self2, arg1, arg2, arg3);
  }
}
function emitMany(handler, isFn, self2, args) {
  if (isFn)
    handler.apply(self2, args);
  else {
    var len = handler.length;
    var listeners2 = arrayClone(handler, len);
    for (var i = 0; i < len; ++i)
      listeners2[i].apply(self2, args);
  }
}
function _addListener(target, type, listener, prepend) {
  var m;
  var events;
  var existing;
  if (typeof listener !== "function")
    throw new TypeError('"listener" argument must be a function');
  events = target._events;
  if (!events) {
    events = target._events = new EventHandlers();
    target._eventsCount = 0;
  } else {
    if (events.newListener) {
      target.emit("newListener", type, listener.listener ? listener.listener : listener);
      events = target._events;
    }
    existing = events[type];
  }
  if (!existing) {
    existing = events[type] = listener;
    ++target._eventsCount;
  } else {
    if (typeof existing === "function") {
      existing = events[type] = prepend ? [listener, existing] : [existing, listener];
    } else {
      if (prepend) {
        existing.unshift(listener);
      } else {
        existing.push(listener);
      }
    }
    if (!existing.warned) {
      m = $getMaxListeners(target);
      if (m && m > 0 && existing.length > m) {
        existing.warned = true;
        var w = new Error("Possible EventEmitter memory leak detected. " + existing.length + " " + type + " listeners added. Use emitter.setMaxListeners() to increase limit");
        w.name = "MaxListenersExceededWarning";
        w.emitter = target;
        w.type = type;
        w.count = existing.length;
        emitWarning(w);
      }
    }
  }
  return target;
}
function emitWarning(e) {
  typeof console.warn === "function" ? console.warn(e) : console.log(e);
}
function _onceWrap(target, type, listener) {
  var fired = false;
  function g() {
    target.removeListener(type, g);
    if (!fired) {
      fired = true;
      listener.apply(target, arguments);
    }
  }
  g.listener = listener;
  return g;
}
function listenerCount(type) {
  var events = this._events;
  if (events) {
    var evlistener = events[type];
    if (typeof evlistener === "function") {
      return 1;
    } else if (evlistener) {
      return evlistener.length;
    }
  }
  return 0;
}
function spliceOne(list, index) {
  for (var i = index, k = i + 1, n = list.length; k < n; i += 1, k += 1)
    list[i] = list[k];
  list.pop();
}
function arrayClone(arr, i) {
  var copy2 = new Array(i);
  while (i--)
    copy2[i] = arr[i];
  return copy2;
}
function unwrapListeners(arr) {
  var ret = new Array(arr.length);
  for (var i = 0; i < ret.length; ++i) {
    ret[i] = arr[i].listener || arr[i];
  }
  return ret;
}
var domain, events_default;
var init_events = __esm({
  "node-modules-polyfills:events"() {
    "use strict";
    init_node_globals();
    EventHandlers.prototype = /* @__PURE__ */ Object.create(null);
    events_default = EventEmitter;
    EventEmitter.EventEmitter = EventEmitter;
    EventEmitter.usingDomains = false;
    EventEmitter.prototype.domain = void 0;
    EventEmitter.prototype._events = void 0;
    EventEmitter.prototype._maxListeners = void 0;
    EventEmitter.defaultMaxListeners = 10;
    EventEmitter.init = function() {
      this.domain = null;
      if (EventEmitter.usingDomains) {
        if (domain.active && !(this instanceof domain.Domain)) {
          this.domain = domain.active;
        }
      }
      if (!this._events || this._events === Object.getPrototypeOf(this)._events) {
        this._events = new EventHandlers();
        this._eventsCount = 0;
      }
      this._maxListeners = this._maxListeners || void 0;
    };
    EventEmitter.prototype.setMaxListeners = function setMaxListeners(n) {
      if (typeof n !== "number" || n < 0 || isNaN(n))
        throw new TypeError('"n" argument must be a positive number');
      this._maxListeners = n;
      return this;
    };
    EventEmitter.prototype.getMaxListeners = function getMaxListeners() {
      return $getMaxListeners(this);
    };
    EventEmitter.prototype.emit = function emit(type) {
      var er, handler, len, args, i, events, domain2;
      var needDomainExit = false;
      var doError = type === "error";
      events = this._events;
      if (events)
        doError = doError && events.error == null;
      else if (!doError)
        return false;
      domain2 = this.domain;
      if (doError) {
        er = arguments[1];
        if (domain2) {
          if (!er)
            er = new Error('Uncaught, unspecified "error" event');
          er.domainEmitter = this;
          er.domain = domain2;
          er.domainThrown = false;
          domain2.emit("error", er);
        } else if (er instanceof Error) {
          throw er;
        } else {
          var err = new Error('Uncaught, unspecified "error" event. (' + er + ")");
          err.context = er;
          throw err;
        }
        return false;
      }
      handler = events[type];
      if (!handler)
        return false;
      var isFn = typeof handler === "function";
      len = arguments.length;
      switch (len) {
        case 1:
          emitNone(handler, isFn, this);
          break;
        case 2:
          emitOne(handler, isFn, this, arguments[1]);
          break;
        case 3:
          emitTwo(handler, isFn, this, arguments[1], arguments[2]);
          break;
        case 4:
          emitThree(handler, isFn, this, arguments[1], arguments[2], arguments[3]);
          break;
        default:
          args = new Array(len - 1);
          for (i = 1; i < len; i++)
            args[i - 1] = arguments[i];
          emitMany(handler, isFn, this, args);
      }
      if (needDomainExit)
        domain2.exit();
      return true;
    };
    EventEmitter.prototype.addListener = function addListener(type, listener) {
      return _addListener(this, type, listener, false);
    };
    EventEmitter.prototype.on = EventEmitter.prototype.addListener;
    EventEmitter.prototype.prependListener = function prependListener(type, listener) {
      return _addListener(this, type, listener, true);
    };
    EventEmitter.prototype.once = function once(type, listener) {
      if (typeof listener !== "function")
        throw new TypeError('"listener" argument must be a function');
      this.on(type, _onceWrap(this, type, listener));
      return this;
    };
    EventEmitter.prototype.prependOnceListener = function prependOnceListener(type, listener) {
      if (typeof listener !== "function")
        throw new TypeError('"listener" argument must be a function');
      this.prependListener(type, _onceWrap(this, type, listener));
      return this;
    };
    EventEmitter.prototype.removeListener = function removeListener(type, listener) {
      var list, events, position, i, originalListener;
      if (typeof listener !== "function")
        throw new TypeError('"listener" argument must be a function');
      events = this._events;
      if (!events)
        return this;
      list = events[type];
      if (!list)
        return this;
      if (list === listener || list.listener && list.listener === listener) {
        if (--this._eventsCount === 0)
          this._events = new EventHandlers();
        else {
          delete events[type];
          if (events.removeListener)
            this.emit("removeListener", type, list.listener || listener);
        }
      } else if (typeof list !== "function") {
        position = -1;
        for (i = list.length; i-- > 0; ) {
          if (list[i] === listener || list[i].listener && list[i].listener === listener) {
            originalListener = list[i].listener;
            position = i;
            break;
          }
        }
        if (position < 0)
          return this;
        if (list.length === 1) {
          list[0] = void 0;
          if (--this._eventsCount === 0) {
            this._events = new EventHandlers();
            return this;
          } else {
            delete events[type];
          }
        } else {
          spliceOne(list, position);
        }
        if (events.removeListener)
          this.emit("removeListener", type, originalListener || listener);
      }
      return this;
    };
    EventEmitter.prototype.removeAllListeners = function removeAllListeners(type) {
      var listeners2, events;
      events = this._events;
      if (!events)
        return this;
      if (!events.removeListener) {
        if (arguments.length === 0) {
          this._events = new EventHandlers();
          this._eventsCount = 0;
        } else if (events[type]) {
          if (--this._eventsCount === 0)
            this._events = new EventHandlers();
          else
            delete events[type];
        }
        return this;
      }
      if (arguments.length === 0) {
        var keys2 = Object.keys(events);
        for (var i = 0, key; i < keys2.length; ++i) {
          key = keys2[i];
          if (key === "removeListener")
            continue;
          this.removeAllListeners(key);
        }
        this.removeAllListeners("removeListener");
        this._events = new EventHandlers();
        this._eventsCount = 0;
        return this;
      }
      listeners2 = events[type];
      if (typeof listeners2 === "function") {
        this.removeListener(type, listeners2);
      } else if (listeners2) {
        do {
          this.removeListener(type, listeners2[listeners2.length - 1]);
        } while (listeners2[0]);
      }
      return this;
    };
    EventEmitter.prototype.listeners = function listeners(type) {
      var evlistener;
      var ret;
      var events = this._events;
      if (!events)
        ret = [];
      else {
        evlistener = events[type];
        if (!evlistener)
          ret = [];
        else if (typeof evlistener === "function")
          ret = [evlistener.listener || evlistener];
        else
          ret = unwrapListeners(evlistener);
      }
      return ret;
    };
    EventEmitter.listenerCount = function(emitter, type) {
      if (typeof emitter.listenerCount === "function") {
        return emitter.listenerCount(type);
      } else {
        return listenerCount.call(emitter, type);
      }
    };
    EventEmitter.prototype.listenerCount = listenerCount;
    EventEmitter.prototype.eventNames = function eventNames() {
      return this._eventsCount > 0 ? Reflect.ownKeys(this._events) : [];
    };
  }
});

// node-modules-polyfills-commonjs:events
var require_events = __commonJS({
  "node-modules-polyfills-commonjs:events"(exports, module) {
    init_node_globals();
    var polyfill = (init_events(), __toCommonJS(events_exports));
    if (polyfill && polyfill.default) {
      module.exports = polyfill.default;
      for (let k in polyfill) {
        module.exports[k] = polyfill[k];
      }
    } else if (polyfill) {
      module.exports = polyfill;
    }
  }
});

// ../node_modules/readable-stream/lib/internal/streams/stream-browser.js
var require_stream_browser = __commonJS({
  "../node_modules/readable-stream/lib/internal/streams/stream-browser.js"(exports, module) {
    init_node_globals();
    module.exports = require_events().EventEmitter;
  }
});

// node-modules-polyfills:process
function defaultSetTimout() {
  throw new Error("setTimeout has not been defined");
}
function defaultClearTimeout() {
  throw new Error("clearTimeout has not been defined");
}
function runTimeout(fun) {
  if (cachedSetTimeout === setTimeout) {
    return setTimeout(fun, 0);
  }
  if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
    cachedSetTimeout = setTimeout;
    return setTimeout(fun, 0);
  }
  try {
    return cachedSetTimeout(fun, 0);
  } catch (e) {
    try {
      return cachedSetTimeout.call(null, fun, 0);
    } catch (e2) {
      return cachedSetTimeout.call(this, fun, 0);
    }
  }
}
function runClearTimeout(marker) {
  if (cachedClearTimeout === clearTimeout) {
    return clearTimeout(marker);
  }
  if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
    cachedClearTimeout = clearTimeout;
    return clearTimeout(marker);
  }
  try {
    return cachedClearTimeout(marker);
  } catch (e) {
    try {
      return cachedClearTimeout.call(null, marker);
    } catch (e2) {
      return cachedClearTimeout.call(this, marker);
    }
  }
}
function cleanUpNextTick() {
  if (!draining || !currentQueue) {
    return;
  }
  draining = false;
  if (currentQueue.length) {
    queue = currentQueue.concat(queue);
  } else {
    queueIndex = -1;
  }
  if (queue.length) {
    drainQueue();
  }
}
function drainQueue() {
  if (draining) {
    return;
  }
  var timeout = runTimeout(cleanUpNextTick);
  draining = true;
  var len = queue.length;
  while (len) {
    currentQueue = queue;
    queue = [];
    while (++queueIndex < len) {
      if (currentQueue) {
        currentQueue[queueIndex].run();
      }
    }
    queueIndex = -1;
    len = queue.length;
  }
  currentQueue = null;
  draining = false;
  runClearTimeout(timeout);
}
function nextTick(fun) {
  var args = new Array(arguments.length - 1);
  if (arguments.length > 1) {
    for (var i = 1; i < arguments.length; i++) {
      args[i - 1] = arguments[i];
    }
  }
  queue.push(new Item(fun, args));
  if (queue.length === 1 && !draining) {
    runTimeout(drainQueue);
  }
}
function Item(fun, array) {
  this.fun = fun;
  this.array = array;
}
function noop() {
}
function binding(name) {
  throw new Error("process.binding is not supported");
}
function cwd() {
  return "/";
}
function chdir(dir) {
  throw new Error("process.chdir is not supported");
}
function umask() {
  return 0;
}
function hrtime(previousTimestamp) {
  var clocktime = performanceNow.call(performance) * 1e-3;
  var seconds = Math.floor(clocktime);
  var nanoseconds = Math.floor(clocktime % 1 * 1e9);
  if (previousTimestamp) {
    seconds = seconds - previousTimestamp[0];
    nanoseconds = nanoseconds - previousTimestamp[1];
    if (nanoseconds < 0) {
      seconds--;
      nanoseconds += 1e9;
    }
  }
  return [seconds, nanoseconds];
}
function uptime() {
  var currentTime = new Date();
  var dif = currentTime - startTime;
  return dif / 1e3;
}
var cachedSetTimeout, cachedClearTimeout, queue, draining, currentQueue, queueIndex, title, platform, browser, env, argv, version, versions, release, config, on, addListener2, once2, off, removeListener2, removeAllListeners2, emit2, performance, performanceNow, startTime, browser$1, process_default;
var init_process = __esm({
  "node-modules-polyfills:process"() {
    init_node_globals();
    cachedSetTimeout = defaultSetTimout;
    cachedClearTimeout = defaultClearTimeout;
    if (typeof globalThis.setTimeout === "function") {
      cachedSetTimeout = setTimeout;
    }
    if (typeof globalThis.clearTimeout === "function") {
      cachedClearTimeout = clearTimeout;
    }
    queue = [];
    draining = false;
    queueIndex = -1;
    Item.prototype.run = function() {
      this.fun.apply(null, this.array);
    };
    title = "browser";
    platform = "browser";
    browser = true;
    env = {};
    argv = [];
    version = "";
    versions = {};
    release = {};
    config = {};
    on = noop;
    addListener2 = noop;
    once2 = noop;
    off = noop;
    removeListener2 = noop;
    removeAllListeners2 = noop;
    emit2 = noop;
    performance = globalThis.performance || {};
    performanceNow = performance.now || performance.mozNow || performance.msNow || performance.oNow || performance.webkitNow || function() {
      return new Date().getTime();
    };
    startTime = new Date();
    browser$1 = {
      nextTick,
      title,
      browser,
      env,
      argv,
      version,
      versions,
      on,
      addListener: addListener2,
      once: once2,
      off,
      removeListener: removeListener2,
      removeAllListeners: removeAllListeners2,
      emit: emit2,
      binding,
      cwd,
      chdir,
      umask,
      hrtime,
      platform,
      release,
      config,
      uptime
    };
    process_default = browser$1;
  }
});

// ../node_modules/rollup-plugin-node-polyfills/polyfills/inherits.js
var inherits, inherits_default;
var init_inherits = __esm({
  "../node_modules/rollup-plugin-node-polyfills/polyfills/inherits.js"() {
    init_node_globals();
    if (typeof Object.create === "function") {
      inherits = function inherits2(ctor, superCtor) {
        ctor.super_ = superCtor;
        ctor.prototype = Object.create(superCtor.prototype, {
          constructor: {
            value: ctor,
            enumerable: false,
            writable: true,
            configurable: true
          }
        });
      };
    } else {
      inherits = function inherits2(ctor, superCtor) {
        ctor.super_ = superCtor;
        var TempCtor = function() {
        };
        TempCtor.prototype = superCtor.prototype;
        ctor.prototype = new TempCtor();
        ctor.prototype.constructor = ctor;
      };
    }
    inherits_default = inherits;
  }
});

// node-modules-polyfills:util
var util_exports = {};
__export(util_exports, {
  _extend: () => _extend,
  debuglog: () => debuglog,
  default: () => util_default,
  deprecate: () => deprecate,
  format: () => format,
  inherits: () => inherits_default,
  inspect: () => inspect2,
  isArray: () => isArray2,
  isBoolean: () => isBoolean,
  isBuffer: () => isBuffer2,
  isDate: () => isDate,
  isError: () => isError,
  isFunction: () => isFunction,
  isNull: () => isNull,
  isNullOrUndefined: () => isNullOrUndefined,
  isNumber: () => isNumber,
  isObject: () => isObject,
  isPrimitive: () => isPrimitive,
  isRegExp: () => isRegExp,
  isString: () => isString,
  isSymbol: () => isSymbol,
  isUndefined: () => isUndefined,
  log: () => log
});
function format(f) {
  if (!isString(f)) {
    var objects = [];
    for (var i = 0; i < arguments.length; i++) {
      objects.push(inspect2(arguments[i]));
    }
    return objects.join(" ");
  }
  var i = 1;
  var args = arguments;
  var len = args.length;
  var str = String(f).replace(formatRegExp, function(x2) {
    if (x2 === "%%")
      return "%";
    if (i >= len)
      return x2;
    switch (x2) {
      case "%s":
        return String(args[i++]);
      case "%d":
        return Number(args[i++]);
      case "%j":
        try {
          return JSON.stringify(args[i++]);
        } catch (_) {
          return "[Circular]";
        }
      default:
        return x2;
    }
  });
  for (var x = args[i]; i < len; x = args[++i]) {
    if (isNull(x) || !isObject(x)) {
      str += " " + x;
    } else {
      str += " " + inspect2(x);
    }
  }
  return str;
}
function deprecate(fn, msg) {
  if (isUndefined(globalThis.process)) {
    return function() {
      return deprecate(fn, msg).apply(this, arguments);
    };
  }
  if (process_default.noDeprecation === true) {
    return fn;
  }
  var warned = false;
  function deprecated() {
    if (!warned) {
      if (process_default.throwDeprecation) {
        throw new Error(msg);
      } else if (process_default.traceDeprecation) {
        console.trace(msg);
      } else {
        console.error(msg);
      }
      warned = true;
    }
    return fn.apply(this, arguments);
  }
  return deprecated;
}
function debuglog(set) {
  if (isUndefined(debugEnviron))
    debugEnviron = process_default.env.NODE_DEBUG || "";
  set = set.toUpperCase();
  if (!debugs[set]) {
    if (new RegExp("\\b" + set + "\\b", "i").test(debugEnviron)) {
      var pid = 0;
      debugs[set] = function() {
        var msg = format.apply(null, arguments);
        console.error("%s %d: %s", set, pid, msg);
      };
    } else {
      debugs[set] = function() {
      };
    }
  }
  return debugs[set];
}
function inspect2(obj, opts) {
  var ctx = {
    seen: [],
    stylize: stylizeNoColor
  };
  if (arguments.length >= 3)
    ctx.depth = arguments[2];
  if (arguments.length >= 4)
    ctx.colors = arguments[3];
  if (isBoolean(opts)) {
    ctx.showHidden = opts;
  } else if (opts) {
    _extend(ctx, opts);
  }
  if (isUndefined(ctx.showHidden))
    ctx.showHidden = false;
  if (isUndefined(ctx.depth))
    ctx.depth = 2;
  if (isUndefined(ctx.colors))
    ctx.colors = false;
  if (isUndefined(ctx.customInspect))
    ctx.customInspect = true;
  if (ctx.colors)
    ctx.stylize = stylizeWithColor;
  return formatValue(ctx, obj, ctx.depth);
}
function stylizeWithColor(str, styleType) {
  var style = inspect2.styles[styleType];
  if (style) {
    return "\x1B[" + inspect2.colors[style][0] + "m" + str + "\x1B[" + inspect2.colors[style][1] + "m";
  } else {
    return str;
  }
}
function stylizeNoColor(str, styleType) {
  return str;
}
function arrayToHash(array) {
  var hash = {};
  array.forEach(function(val, idx) {
    hash[val] = true;
  });
  return hash;
}
function formatValue(ctx, value, recurseTimes) {
  if (ctx.customInspect && value && isFunction(value.inspect) && value.inspect !== inspect2 && !(value.constructor && value.constructor.prototype === value)) {
    var ret = value.inspect(recurseTimes, ctx);
    if (!isString(ret)) {
      ret = formatValue(ctx, ret, recurseTimes);
    }
    return ret;
  }
  var primitive = formatPrimitive(ctx, value);
  if (primitive) {
    return primitive;
  }
  var keys2 = Object.keys(value);
  var visibleKeys = arrayToHash(keys2);
  if (ctx.showHidden) {
    keys2 = Object.getOwnPropertyNames(value);
  }
  if (isError(value) && (keys2.indexOf("message") >= 0 || keys2.indexOf("description") >= 0)) {
    return formatError(value);
  }
  if (keys2.length === 0) {
    if (isFunction(value)) {
      var name = value.name ? ": " + value.name : "";
      return ctx.stylize("[Function" + name + "]", "special");
    }
    if (isRegExp(value)) {
      return ctx.stylize(RegExp.prototype.toString.call(value), "regexp");
    }
    if (isDate(value)) {
      return ctx.stylize(Date.prototype.toString.call(value), "date");
    }
    if (isError(value)) {
      return formatError(value);
    }
  }
  var base = "", array = false, braces = ["{", "}"];
  if (isArray2(value)) {
    array = true;
    braces = ["[", "]"];
  }
  if (isFunction(value)) {
    var n = value.name ? ": " + value.name : "";
    base = " [Function" + n + "]";
  }
  if (isRegExp(value)) {
    base = " " + RegExp.prototype.toString.call(value);
  }
  if (isDate(value)) {
    base = " " + Date.prototype.toUTCString.call(value);
  }
  if (isError(value)) {
    base = " " + formatError(value);
  }
  if (keys2.length === 0 && (!array || value.length == 0)) {
    return braces[0] + base + braces[1];
  }
  if (recurseTimes < 0) {
    if (isRegExp(value)) {
      return ctx.stylize(RegExp.prototype.toString.call(value), "regexp");
    } else {
      return ctx.stylize("[Object]", "special");
    }
  }
  ctx.seen.push(value);
  var output;
  if (array) {
    output = formatArray(ctx, value, recurseTimes, visibleKeys, keys2);
  } else {
    output = keys2.map(function(key) {
      return formatProperty(ctx, value, recurseTimes, visibleKeys, key, array);
    });
  }
  ctx.seen.pop();
  return reduceToSingleString(output, base, braces);
}
function formatPrimitive(ctx, value) {
  if (isUndefined(value))
    return ctx.stylize("undefined", "undefined");
  if (isString(value)) {
    var simple = "'" + JSON.stringify(value).replace(/^"|"$/g, "").replace(/'/g, "\\'").replace(/\\"/g, '"') + "'";
    return ctx.stylize(simple, "string");
  }
  if (isNumber(value))
    return ctx.stylize("" + value, "number");
  if (isBoolean(value))
    return ctx.stylize("" + value, "boolean");
  if (isNull(value))
    return ctx.stylize("null", "null");
}
function formatError(value) {
  return "[" + Error.prototype.toString.call(value) + "]";
}
function formatArray(ctx, value, recurseTimes, visibleKeys, keys2) {
  var output = [];
  for (var i = 0, l = value.length; i < l; ++i) {
    if (hasOwnProperty(value, String(i))) {
      output.push(formatProperty(ctx, value, recurseTimes, visibleKeys, String(i), true));
    } else {
      output.push("");
    }
  }
  keys2.forEach(function(key) {
    if (!key.match(/^\d+$/)) {
      output.push(formatProperty(ctx, value, recurseTimes, visibleKeys, key, true));
    }
  });
  return output;
}
function formatProperty(ctx, value, recurseTimes, visibleKeys, key, array) {
  var name, str, desc;
  desc = Object.getOwnPropertyDescriptor(value, key) || { value: value[key] };
  if (desc.get) {
    if (desc.set) {
      str = ctx.stylize("[Getter/Setter]", "special");
    } else {
      str = ctx.stylize("[Getter]", "special");
    }
  } else {
    if (desc.set) {
      str = ctx.stylize("[Setter]", "special");
    }
  }
  if (!hasOwnProperty(visibleKeys, key)) {
    name = "[" + key + "]";
  }
  if (!str) {
    if (ctx.seen.indexOf(desc.value) < 0) {
      if (isNull(recurseTimes)) {
        str = formatValue(ctx, desc.value, null);
      } else {
        str = formatValue(ctx, desc.value, recurseTimes - 1);
      }
      if (str.indexOf("\n") > -1) {
        if (array) {
          str = str.split("\n").map(function(line) {
            return "  " + line;
          }).join("\n").substr(2);
        } else {
          str = "\n" + str.split("\n").map(function(line) {
            return "   " + line;
          }).join("\n");
        }
      }
    } else {
      str = ctx.stylize("[Circular]", "special");
    }
  }
  if (isUndefined(name)) {
    if (array && key.match(/^\d+$/)) {
      return str;
    }
    name = JSON.stringify("" + key);
    if (name.match(/^"([a-zA-Z_][a-zA-Z_0-9]*)"$/)) {
      name = name.substr(1, name.length - 2);
      name = ctx.stylize(name, "name");
    } else {
      name = name.replace(/'/g, "\\'").replace(/\\"/g, '"').replace(/(^"|"$)/g, "'");
      name = ctx.stylize(name, "string");
    }
  }
  return name + ": " + str;
}
function reduceToSingleString(output, base, braces) {
  var numLinesEst = 0;
  var length = output.reduce(function(prev, cur) {
    numLinesEst++;
    if (cur.indexOf("\n") >= 0)
      numLinesEst++;
    return prev + cur.replace(/\u001b\[\d\d?m/g, "").length + 1;
  }, 0);
  if (length > 60) {
    return braces[0] + (base === "" ? "" : base + "\n ") + " " + output.join(",\n  ") + " " + braces[1];
  }
  return braces[0] + base + " " + output.join(", ") + " " + braces[1];
}
function isArray2(ar) {
  return Array.isArray(ar);
}
function isBoolean(arg) {
  return typeof arg === "boolean";
}
function isNull(arg) {
  return arg === null;
}
function isNullOrUndefined(arg) {
  return arg == null;
}
function isNumber(arg) {
  return typeof arg === "number";
}
function isString(arg) {
  return typeof arg === "string";
}
function isSymbol(arg) {
  return typeof arg === "symbol";
}
function isUndefined(arg) {
  return arg === void 0;
}
function isRegExp(re) {
  return isObject(re) && objectToString(re) === "[object RegExp]";
}
function isObject(arg) {
  return typeof arg === "object" && arg !== null;
}
function isDate(d) {
  return isObject(d) && objectToString(d) === "[object Date]";
}
function isError(e) {
  return isObject(e) && (objectToString(e) === "[object Error]" || e instanceof Error);
}
function isFunction(arg) {
  return typeof arg === "function";
}
function isPrimitive(arg) {
  return arg === null || typeof arg === "boolean" || typeof arg === "number" || typeof arg === "string" || typeof arg === "symbol" || typeof arg === "undefined";
}
function isBuffer2(maybeBuf) {
  return Buffer3.isBuffer(maybeBuf);
}
function objectToString(o) {
  return Object.prototype.toString.call(o);
}
function pad(n) {
  return n < 10 ? "0" + n.toString(10) : n.toString(10);
}
function timestamp() {
  var d = new Date();
  var time = [
    pad(d.getHours()),
    pad(d.getMinutes()),
    pad(d.getSeconds())
  ].join(":");
  return [d.getDate(), months[d.getMonth()], time].join(" ");
}
function log() {
  console.log("%s - %s", timestamp(), format.apply(null, arguments));
}
function _extend(origin, add) {
  if (!add || !isObject(add))
    return origin;
  var keys2 = Object.keys(add);
  var i = keys2.length;
  while (i--) {
    origin[keys2[i]] = add[keys2[i]];
  }
  return origin;
}
function hasOwnProperty(obj, prop) {
  return Object.prototype.hasOwnProperty.call(obj, prop);
}
var formatRegExp, debugs, debugEnviron, months, util_default;
var init_util = __esm({
  "node-modules-polyfills:util"() {
    init_node_globals();
    init_process();
    init_inherits();
    formatRegExp = /%[sdj%]/g;
    debugs = {};
    inspect2.colors = {
      "bold": [1, 22],
      "italic": [3, 23],
      "underline": [4, 24],
      "inverse": [7, 27],
      "white": [37, 39],
      "grey": [90, 39],
      "black": [30, 39],
      "blue": [34, 39],
      "cyan": [36, 39],
      "green": [32, 39],
      "magenta": [35, 39],
      "red": [31, 39],
      "yellow": [33, 39]
    };
    inspect2.styles = {
      "special": "cyan",
      "number": "yellow",
      "boolean": "yellow",
      "undefined": "grey",
      "null": "bold",
      "string": "green",
      "date": "magenta",
      "regexp": "red"
    };
    months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec"
    ];
    util_default = {
      inherits: inherits_default,
      _extend,
      log,
      isBuffer: isBuffer2,
      isPrimitive,
      isFunction,
      isError,
      isDate,
      isObject,
      isRegExp,
      isUndefined,
      isSymbol,
      isString,
      isNumber,
      isNullOrUndefined,
      isNull,
      isBoolean,
      isArray: isArray2,
      inspect: inspect2,
      deprecate,
      format,
      debuglog
    };
  }
});

// node-modules-polyfills-commonjs:util
var require_util = __commonJS({
  "node-modules-polyfills-commonjs:util"(exports, module) {
    init_node_globals();
    var polyfill = (init_util(), __toCommonJS(util_exports));
    if (polyfill && polyfill.default) {
      module.exports = polyfill.default;
      for (let k in polyfill) {
        module.exports[k] = polyfill[k];
      }
    } else if (polyfill) {
      module.exports = polyfill;
    }
  }
});

// ../node_modules/readable-stream/lib/internal/streams/buffer_list.js
var require_buffer_list = __commonJS({
  "../node_modules/readable-stream/lib/internal/streams/buffer_list.js"(exports, module) {
    "use strict";
    init_node_globals();
    function ownKeys(object, enumerableOnly) {
      var keys2 = Object.keys(object);
      if (Object.getOwnPropertySymbols) {
        var symbols = Object.getOwnPropertySymbols(object);
        if (enumerableOnly)
          symbols = symbols.filter(function(sym) {
            return Object.getOwnPropertyDescriptor(object, sym).enumerable;
          });
        keys2.push.apply(keys2, symbols);
      }
      return keys2;
    }
    function _objectSpread(target) {
      for (var i = 1; i < arguments.length; i++) {
        var source = arguments[i] != null ? arguments[i] : {};
        if (i % 2) {
          ownKeys(Object(source), true).forEach(function(key) {
            _defineProperty(target, key, source[key]);
          });
        } else if (Object.getOwnPropertyDescriptors) {
          Object.defineProperties(target, Object.getOwnPropertyDescriptors(source));
        } else {
          ownKeys(Object(source)).forEach(function(key) {
            Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
          });
        }
      }
      return target;
    }
    function _defineProperty(obj, key, value) {
      if (key in obj) {
        Object.defineProperty(obj, key, { value, enumerable: true, configurable: true, writable: true });
      } else {
        obj[key] = value;
      }
      return obj;
    }
    function _classCallCheck(instance, Constructor) {
      if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
      }
    }
    function _defineProperties(target, props) {
      for (var i = 0; i < props.length; i++) {
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || false;
        descriptor.configurable = true;
        if ("value" in descriptor)
          descriptor.writable = true;
        Object.defineProperty(target, descriptor.key, descriptor);
      }
    }
    function _createClass(Constructor, protoProps, staticProps) {
      if (protoProps)
        _defineProperties(Constructor.prototype, protoProps);
      if (staticProps)
        _defineProperties(Constructor, staticProps);
      return Constructor;
    }
    var _require = require_buffer();
    var Buffer4 = _require.Buffer;
    var _require2 = require_util();
    var inspect3 = _require2.inspect;
    var custom = inspect3 && inspect3.custom || "inspect";
    function copyBuffer(src, target, offset) {
      Buffer4.prototype.copy.call(src, target, offset);
    }
    module.exports = /* @__PURE__ */ function() {
      function BufferList2() {
        _classCallCheck(this, BufferList2);
        this.head = null;
        this.tail = null;
        this.length = 0;
      }
      _createClass(BufferList2, [{
        key: "push",
        value: function push(v) {
          var entry = {
            data: v,
            next: null
          };
          if (this.length > 0)
            this.tail.next = entry;
          else
            this.head = entry;
          this.tail = entry;
          ++this.length;
        }
      }, {
        key: "unshift",
        value: function unshift(v) {
          var entry = {
            data: v,
            next: this.head
          };
          if (this.length === 0)
            this.tail = entry;
          this.head = entry;
          ++this.length;
        }
      }, {
        key: "shift",
        value: function shift() {
          if (this.length === 0)
            return;
          var ret = this.head.data;
          if (this.length === 1)
            this.head = this.tail = null;
          else
            this.head = this.head.next;
          --this.length;
          return ret;
        }
      }, {
        key: "clear",
        value: function clear() {
          this.head = this.tail = null;
          this.length = 0;
        }
      }, {
        key: "join",
        value: function join(s) {
          if (this.length === 0)
            return "";
          var p = this.head;
          var ret = "" + p.data;
          while (p = p.next) {
            ret += s + p.data;
          }
          return ret;
        }
      }, {
        key: "concat",
        value: function concat2(n) {
          if (this.length === 0)
            return Buffer4.alloc(0);
          var ret = Buffer4.allocUnsafe(n >>> 0);
          var p = this.head;
          var i = 0;
          while (p) {
            copyBuffer(p.data, ret, i);
            i += p.data.length;
            p = p.next;
          }
          return ret;
        }
      }, {
        key: "consume",
        value: function consume(n, hasStrings) {
          var ret;
          if (n < this.head.data.length) {
            ret = this.head.data.slice(0, n);
            this.head.data = this.head.data.slice(n);
          } else if (n === this.head.data.length) {
            ret = this.shift();
          } else {
            ret = hasStrings ? this._getString(n) : this._getBuffer(n);
          }
          return ret;
        }
      }, {
        key: "first",
        value: function first() {
          return this.head.data;
        }
      }, {
        key: "_getString",
        value: function _getString(n) {
          var p = this.head;
          var c = 1;
          var ret = p.data;
          n -= ret.length;
          while (p = p.next) {
            var str = p.data;
            var nb = n > str.length ? str.length : n;
            if (nb === str.length)
              ret += str;
            else
              ret += str.slice(0, n);
            n -= nb;
            if (n === 0) {
              if (nb === str.length) {
                ++c;
                if (p.next)
                  this.head = p.next;
                else
                  this.head = this.tail = null;
              } else {
                this.head = p;
                p.data = str.slice(nb);
              }
              break;
            }
            ++c;
          }
          this.length -= c;
          return ret;
        }
      }, {
        key: "_getBuffer",
        value: function _getBuffer(n) {
          var ret = Buffer4.allocUnsafe(n);
          var p = this.head;
          var c = 1;
          p.data.copy(ret);
          n -= p.data.length;
          while (p = p.next) {
            var buf = p.data;
            var nb = n > buf.length ? buf.length : n;
            buf.copy(ret, ret.length - n, 0, nb);
            n -= nb;
            if (n === 0) {
              if (nb === buf.length) {
                ++c;
                if (p.next)
                  this.head = p.next;
                else
                  this.head = this.tail = null;
              } else {
                this.head = p;
                p.data = buf.slice(nb);
              }
              break;
            }
            ++c;
          }
          this.length -= c;
          return ret;
        }
      }, {
        key: custom,
        value: function value(_, options) {
          return inspect3(this, _objectSpread({}, options, {
            depth: 0,
            customInspect: false
          }));
        }
      }]);
      return BufferList2;
    }();
  }
});

// ../node_modules/readable-stream/lib/internal/streams/destroy.js
var require_destroy = __commonJS({
  "../node_modules/readable-stream/lib/internal/streams/destroy.js"(exports, module) {
    "use strict";
    init_node_globals();
    function destroy(err, cb) {
      var _this = this;
      var readableDestroyed = this._readableState && this._readableState.destroyed;
      var writableDestroyed = this._writableState && this._writableState.destroyed;
      if (readableDestroyed || writableDestroyed) {
        if (cb) {
          cb(err);
        } else if (err) {
          if (!this._writableState) {
            process.nextTick(emitErrorNT, this, err);
          } else if (!this._writableState.errorEmitted) {
            this._writableState.errorEmitted = true;
            process.nextTick(emitErrorNT, this, err);
          }
        }
        return this;
      }
      if (this._readableState) {
        this._readableState.destroyed = true;
      }
      if (this._writableState) {
        this._writableState.destroyed = true;
      }
      this._destroy(err || null, function(err2) {
        if (!cb && err2) {
          if (!_this._writableState) {
            process.nextTick(emitErrorAndCloseNT, _this, err2);
          } else if (!_this._writableState.errorEmitted) {
            _this._writableState.errorEmitted = true;
            process.nextTick(emitErrorAndCloseNT, _this, err2);
          } else {
            process.nextTick(emitCloseNT, _this);
          }
        } else if (cb) {
          process.nextTick(emitCloseNT, _this);
          cb(err2);
        } else {
          process.nextTick(emitCloseNT, _this);
        }
      });
      return this;
    }
    function emitErrorAndCloseNT(self2, err) {
      emitErrorNT(self2, err);
      emitCloseNT(self2);
    }
    function emitCloseNT(self2) {
      if (self2._writableState && !self2._writableState.emitClose)
        return;
      if (self2._readableState && !self2._readableState.emitClose)
        return;
      self2.emit("close");
    }
    function undestroy() {
      if (this._readableState) {
        this._readableState.destroyed = false;
        this._readableState.reading = false;
        this._readableState.ended = false;
        this._readableState.endEmitted = false;
      }
      if (this._writableState) {
        this._writableState.destroyed = false;
        this._writableState.ended = false;
        this._writableState.ending = false;
        this._writableState.finalCalled = false;
        this._writableState.prefinished = false;
        this._writableState.finished = false;
        this._writableState.errorEmitted = false;
      }
    }
    function emitErrorNT(self2, err) {
      self2.emit("error", err);
    }
    function errorOrDestroy(stream, err) {
      var rState = stream._readableState;
      var wState = stream._writableState;
      if (rState && rState.autoDestroy || wState && wState.autoDestroy)
        stream.destroy(err);
      else
        stream.emit("error", err);
    }
    module.exports = {
      destroy,
      undestroy,
      errorOrDestroy
    };
  }
});

// ../node_modules/readable-stream/errors-browser.js
var require_errors_browser = __commonJS({
  "../node_modules/readable-stream/errors-browser.js"(exports, module) {
    "use strict";
    init_node_globals();
    function _inheritsLoose(subClass, superClass) {
      subClass.prototype = Object.create(superClass.prototype);
      subClass.prototype.constructor = subClass;
      subClass.__proto__ = superClass;
    }
    var codes = {};
    function createErrorType(code, message, Base) {
      if (!Base) {
        Base = Error;
      }
      function getMessage(arg1, arg2, arg3) {
        if (typeof message === "string") {
          return message;
        } else {
          return message(arg1, arg2, arg3);
        }
      }
      var NodeError = /* @__PURE__ */ function(_Base) {
        _inheritsLoose(NodeError2, _Base);
        function NodeError2(arg1, arg2, arg3) {
          return _Base.call(this, getMessage(arg1, arg2, arg3)) || this;
        }
        return NodeError2;
      }(Base);
      NodeError.prototype.name = Base.name;
      NodeError.prototype.code = code;
      codes[code] = NodeError;
    }
    function oneOf(expected, thing) {
      if (Array.isArray(expected)) {
        var len = expected.length;
        expected = expected.map(function(i) {
          return String(i);
        });
        if (len > 2) {
          return "one of ".concat(thing, " ").concat(expected.slice(0, len - 1).join(", "), ", or ") + expected[len - 1];
        } else if (len === 2) {
          return "one of ".concat(thing, " ").concat(expected[0], " or ").concat(expected[1]);
        } else {
          return "of ".concat(thing, " ").concat(expected[0]);
        }
      } else {
        return "of ".concat(thing, " ").concat(String(expected));
      }
    }
    function startsWith(str, search, pos) {
      return str.substr(!pos || pos < 0 ? 0 : +pos, search.length) === search;
    }
    function endsWith(str, search, this_len) {
      if (this_len === void 0 || this_len > str.length) {
        this_len = str.length;
      }
      return str.substring(this_len - search.length, this_len) === search;
    }
    function includes2(str, search, start) {
      if (typeof start !== "number") {
        start = 0;
      }
      if (start + search.length > str.length) {
        return false;
      } else {
        return str.indexOf(search, start) !== -1;
      }
    }
    createErrorType("ERR_INVALID_OPT_VALUE", function(name, value) {
      return 'The value "' + value + '" is invalid for option "' + name + '"';
    }, TypeError);
    createErrorType("ERR_INVALID_ARG_TYPE", function(name, expected, actual) {
      var determiner;
      if (typeof expected === "string" && startsWith(expected, "not ")) {
        determiner = "must not be";
        expected = expected.replace(/^not /, "");
      } else {
        determiner = "must be";
      }
      var msg;
      if (endsWith(name, " argument")) {
        msg = "The ".concat(name, " ").concat(determiner, " ").concat(oneOf(expected, "type"));
      } else {
        var type = includes2(name, ".") ? "property" : "argument";
        msg = 'The "'.concat(name, '" ').concat(type, " ").concat(determiner, " ").concat(oneOf(expected, "type"));
      }
      msg += ". Received type ".concat(typeof actual);
      return msg;
    }, TypeError);
    createErrorType("ERR_STREAM_PUSH_AFTER_EOF", "stream.push() after EOF");
    createErrorType("ERR_METHOD_NOT_IMPLEMENTED", function(name) {
      return "The " + name + " method is not implemented";
    });
    createErrorType("ERR_STREAM_PREMATURE_CLOSE", "Premature close");
    createErrorType("ERR_STREAM_DESTROYED", function(name) {
      return "Cannot call " + name + " after a stream was destroyed";
    });
    createErrorType("ERR_MULTIPLE_CALLBACK", "Callback called multiple times");
    createErrorType("ERR_STREAM_CANNOT_PIPE", "Cannot pipe, not readable");
    createErrorType("ERR_STREAM_WRITE_AFTER_END", "write after end");
    createErrorType("ERR_STREAM_NULL_VALUES", "May not write null values to stream", TypeError);
    createErrorType("ERR_UNKNOWN_ENCODING", function(arg) {
      return "Unknown encoding: " + arg;
    }, TypeError);
    createErrorType("ERR_STREAM_UNSHIFT_AFTER_END_EVENT", "stream.unshift() after end event");
    module.exports.codes = codes;
  }
});

// ../node_modules/readable-stream/lib/internal/streams/state.js
var require_state = __commonJS({
  "../node_modules/readable-stream/lib/internal/streams/state.js"(exports, module) {
    "use strict";
    init_node_globals();
    var ERR_INVALID_OPT_VALUE = require_errors_browser().codes.ERR_INVALID_OPT_VALUE;
    function highWaterMarkFrom(options, isDuplex, duplexKey) {
      return options.highWaterMark != null ? options.highWaterMark : isDuplex ? options[duplexKey] : null;
    }
    function getHighWaterMark(state, options, duplexKey, isDuplex) {
      var hwm = highWaterMarkFrom(options, isDuplex, duplexKey);
      if (hwm != null) {
        if (!(isFinite(hwm) && Math.floor(hwm) === hwm) || hwm < 0) {
          var name = isDuplex ? duplexKey : "highWaterMark";
          throw new ERR_INVALID_OPT_VALUE(name, hwm);
        }
        return Math.floor(hwm);
      }
      return state.objectMode ? 16 : 16 * 1024;
    }
    module.exports = {
      getHighWaterMark
    };
  }
});

// ../node_modules/util-deprecate/browser.js
var require_browser2 = __commonJS({
  "../node_modules/util-deprecate/browser.js"(exports, module) {
    init_node_globals();
    module.exports = deprecate2;
    function deprecate2(fn, msg) {
      if (config2("noDeprecation")) {
        return fn;
      }
      var warned = false;
      function deprecated() {
        if (!warned) {
          if (config2("throwDeprecation")) {
            throw new Error(msg);
          } else if (config2("traceDeprecation")) {
            console.trace(msg);
          } else {
            console.warn(msg);
          }
          warned = true;
        }
        return fn.apply(this, arguments);
      }
      return deprecated;
    }
    function config2(name) {
      try {
        if (!globalThis.localStorage)
          return false;
      } catch (_) {
        return false;
      }
      var val = globalThis.localStorage[name];
      if (val == null)
        return false;
      return String(val).toLowerCase() === "true";
    }
  }
});

// ../node_modules/readable-stream/lib/_stream_writable.js
var require_stream_writable = __commonJS({
  "../node_modules/readable-stream/lib/_stream_writable.js"(exports, module) {
    "use strict";
    init_node_globals();
    module.exports = Writable2;
    function CorkedRequest2(state) {
      var _this = this;
      this.next = null;
      this.entry = null;
      this.finish = function() {
        onCorkedFinish(_this, state);
      };
    }
    var Duplex2;
    Writable2.WritableState = WritableState2;
    var internalUtil = {
      deprecate: require_browser2()
    };
    var Stream2 = require_stream_browser();
    var Buffer4 = require_buffer().Buffer;
    var OurUint8Array = globalThis.Uint8Array || function() {
    };
    function _uint8ArrayToBuffer(chunk) {
      return Buffer4.from(chunk);
    }
    function _isUint8Array(obj) {
      return Buffer4.isBuffer(obj) || obj instanceof OurUint8Array;
    }
    var destroyImpl = require_destroy();
    var _require = require_state();
    var getHighWaterMark = _require.getHighWaterMark;
    var _require$codes = require_errors_browser().codes;
    var ERR_INVALID_ARG_TYPE = _require$codes.ERR_INVALID_ARG_TYPE;
    var ERR_METHOD_NOT_IMPLEMENTED = _require$codes.ERR_METHOD_NOT_IMPLEMENTED;
    var ERR_MULTIPLE_CALLBACK = _require$codes.ERR_MULTIPLE_CALLBACK;
    var ERR_STREAM_CANNOT_PIPE = _require$codes.ERR_STREAM_CANNOT_PIPE;
    var ERR_STREAM_DESTROYED = _require$codes.ERR_STREAM_DESTROYED;
    var ERR_STREAM_NULL_VALUES = _require$codes.ERR_STREAM_NULL_VALUES;
    var ERR_STREAM_WRITE_AFTER_END = _require$codes.ERR_STREAM_WRITE_AFTER_END;
    var ERR_UNKNOWN_ENCODING = _require$codes.ERR_UNKNOWN_ENCODING;
    var errorOrDestroy = destroyImpl.errorOrDestroy;
    require_inherits_browser()(Writable2, Stream2);
    function nop2() {
    }
    function WritableState2(options, stream, isDuplex) {
      Duplex2 = Duplex2 || require_stream_duplex();
      options = options || {};
      if (typeof isDuplex !== "boolean")
        isDuplex = stream instanceof Duplex2;
      this.objectMode = !!options.objectMode;
      if (isDuplex)
        this.objectMode = this.objectMode || !!options.writableObjectMode;
      this.highWaterMark = getHighWaterMark(this, options, "writableHighWaterMark", isDuplex);
      this.finalCalled = false;
      this.needDrain = false;
      this.ending = false;
      this.ended = false;
      this.finished = false;
      this.destroyed = false;
      var noDecode = options.decodeStrings === false;
      this.decodeStrings = !noDecode;
      this.defaultEncoding = options.defaultEncoding || "utf8";
      this.length = 0;
      this.writing = false;
      this.corked = 0;
      this.sync = true;
      this.bufferProcessing = false;
      this.onwrite = function(er) {
        onwrite2(stream, er);
      };
      this.writecb = null;
      this.writelen = 0;
      this.bufferedRequest = null;
      this.lastBufferedRequest = null;
      this.pendingcb = 0;
      this.prefinished = false;
      this.errorEmitted = false;
      this.emitClose = options.emitClose !== false;
      this.autoDestroy = !!options.autoDestroy;
      this.bufferedRequestCount = 0;
      this.corkedRequestsFree = new CorkedRequest2(this);
    }
    WritableState2.prototype.getBuffer = function getBuffer() {
      var current = this.bufferedRequest;
      var out = [];
      while (current) {
        out.push(current);
        current = current.next;
      }
      return out;
    };
    (function() {
      try {
        Object.defineProperty(WritableState2.prototype, "buffer", {
          get: internalUtil.deprecate(function writableStateBufferGetter() {
            return this.getBuffer();
          }, "_writableState.buffer is deprecated. Use _writableState.getBuffer instead.", "DEP0003")
        });
      } catch (_) {
      }
    })();
    var realHasInstance;
    if (typeof Symbol === "function" && Symbol.hasInstance && typeof Function.prototype[Symbol.hasInstance] === "function") {
      realHasInstance = Function.prototype[Symbol.hasInstance];
      Object.defineProperty(Writable2, Symbol.hasInstance, {
        value: function value(object) {
          if (realHasInstance.call(this, object))
            return true;
          if (this !== Writable2)
            return false;
          return object && object._writableState instanceof WritableState2;
        }
      });
    } else {
      realHasInstance = function realHasInstance2(object) {
        return object instanceof this;
      };
    }
    function Writable2(options) {
      Duplex2 = Duplex2 || require_stream_duplex();
      var isDuplex = this instanceof Duplex2;
      if (!isDuplex && !realHasInstance.call(Writable2, this))
        return new Writable2(options);
      this._writableState = new WritableState2(options, this, isDuplex);
      this.writable = true;
      if (options) {
        if (typeof options.write === "function")
          this._write = options.write;
        if (typeof options.writev === "function")
          this._writev = options.writev;
        if (typeof options.destroy === "function")
          this._destroy = options.destroy;
        if (typeof options.final === "function")
          this._final = options.final;
      }
      Stream2.call(this);
    }
    Writable2.prototype.pipe = function() {
      errorOrDestroy(this, new ERR_STREAM_CANNOT_PIPE());
    };
    function writeAfterEnd2(stream, cb) {
      var er = new ERR_STREAM_WRITE_AFTER_END();
      errorOrDestroy(stream, er);
      process.nextTick(cb, er);
    }
    function validChunk2(stream, state, chunk, cb) {
      var er;
      if (chunk === null) {
        er = new ERR_STREAM_NULL_VALUES();
      } else if (typeof chunk !== "string" && !state.objectMode) {
        er = new ERR_INVALID_ARG_TYPE("chunk", ["string", "Buffer"], chunk);
      }
      if (er) {
        errorOrDestroy(stream, er);
        process.nextTick(cb, er);
        return false;
      }
      return true;
    }
    Writable2.prototype.write = function(chunk, encoding, cb) {
      var state = this._writableState;
      var ret = false;
      var isBuf = !state.objectMode && _isUint8Array(chunk);
      if (isBuf && !Buffer4.isBuffer(chunk)) {
        chunk = _uint8ArrayToBuffer(chunk);
      }
      if (typeof encoding === "function") {
        cb = encoding;
        encoding = null;
      }
      if (isBuf)
        encoding = "buffer";
      else if (!encoding)
        encoding = state.defaultEncoding;
      if (typeof cb !== "function")
        cb = nop2;
      if (state.ending)
        writeAfterEnd2(this, cb);
      else if (isBuf || validChunk2(this, state, chunk, cb)) {
        state.pendingcb++;
        ret = writeOrBuffer2(this, state, isBuf, chunk, encoding, cb);
      }
      return ret;
    };
    Writable2.prototype.cork = function() {
      this._writableState.corked++;
    };
    Writable2.prototype.uncork = function() {
      var state = this._writableState;
      if (state.corked) {
        state.corked--;
        if (!state.writing && !state.corked && !state.bufferProcessing && state.bufferedRequest)
          clearBuffer2(this, state);
      }
    };
    Writable2.prototype.setDefaultEncoding = function setDefaultEncoding2(encoding) {
      if (typeof encoding === "string")
        encoding = encoding.toLowerCase();
      if (!(["hex", "utf8", "utf-8", "ascii", "binary", "base64", "ucs2", "ucs-2", "utf16le", "utf-16le", "raw"].indexOf((encoding + "").toLowerCase()) > -1))
        throw new ERR_UNKNOWN_ENCODING(encoding);
      this._writableState.defaultEncoding = encoding;
      return this;
    };
    Object.defineProperty(Writable2.prototype, "writableBuffer", {
      enumerable: false,
      get: function get() {
        return this._writableState && this._writableState.getBuffer();
      }
    });
    function decodeChunk2(state, chunk, encoding) {
      if (!state.objectMode && state.decodeStrings !== false && typeof chunk === "string") {
        chunk = Buffer4.from(chunk, encoding);
      }
      return chunk;
    }
    Object.defineProperty(Writable2.prototype, "writableHighWaterMark", {
      enumerable: false,
      get: function get() {
        return this._writableState.highWaterMark;
      }
    });
    function writeOrBuffer2(stream, state, isBuf, chunk, encoding, cb) {
      if (!isBuf) {
        var newChunk = decodeChunk2(state, chunk, encoding);
        if (chunk !== newChunk) {
          isBuf = true;
          encoding = "buffer";
          chunk = newChunk;
        }
      }
      var len = state.objectMode ? 1 : chunk.length;
      state.length += len;
      var ret = state.length < state.highWaterMark;
      if (!ret)
        state.needDrain = true;
      if (state.writing || state.corked) {
        var last = state.lastBufferedRequest;
        state.lastBufferedRequest = {
          chunk,
          encoding,
          isBuf,
          callback: cb,
          next: null
        };
        if (last) {
          last.next = state.lastBufferedRequest;
        } else {
          state.bufferedRequest = state.lastBufferedRequest;
        }
        state.bufferedRequestCount += 1;
      } else {
        doWrite2(stream, state, false, len, chunk, encoding, cb);
      }
      return ret;
    }
    function doWrite2(stream, state, writev, len, chunk, encoding, cb) {
      state.writelen = len;
      state.writecb = cb;
      state.writing = true;
      state.sync = true;
      if (state.destroyed)
        state.onwrite(new ERR_STREAM_DESTROYED("write"));
      else if (writev)
        stream._writev(chunk, state.onwrite);
      else
        stream._write(chunk, encoding, state.onwrite);
      state.sync = false;
    }
    function onwriteError2(stream, state, sync, er, cb) {
      --state.pendingcb;
      if (sync) {
        process.nextTick(cb, er);
        process.nextTick(finishMaybe2, stream, state);
        stream._writableState.errorEmitted = true;
        errorOrDestroy(stream, er);
      } else {
        cb(er);
        stream._writableState.errorEmitted = true;
        errorOrDestroy(stream, er);
        finishMaybe2(stream, state);
      }
    }
    function onwriteStateUpdate2(state) {
      state.writing = false;
      state.writecb = null;
      state.length -= state.writelen;
      state.writelen = 0;
    }
    function onwrite2(stream, er) {
      var state = stream._writableState;
      var sync = state.sync;
      var cb = state.writecb;
      if (typeof cb !== "function")
        throw new ERR_MULTIPLE_CALLBACK();
      onwriteStateUpdate2(state);
      if (er)
        onwriteError2(stream, state, sync, er, cb);
      else {
        var finished = needFinish2(state) || stream.destroyed;
        if (!finished && !state.corked && !state.bufferProcessing && state.bufferedRequest) {
          clearBuffer2(stream, state);
        }
        if (sync) {
          process.nextTick(afterWrite2, stream, state, finished, cb);
        } else {
          afterWrite2(stream, state, finished, cb);
        }
      }
    }
    function afterWrite2(stream, state, finished, cb) {
      if (!finished)
        onwriteDrain2(stream, state);
      state.pendingcb--;
      cb();
      finishMaybe2(stream, state);
    }
    function onwriteDrain2(stream, state) {
      if (state.length === 0 && state.needDrain) {
        state.needDrain = false;
        stream.emit("drain");
      }
    }
    function clearBuffer2(stream, state) {
      state.bufferProcessing = true;
      var entry = state.bufferedRequest;
      if (stream._writev && entry && entry.next) {
        var l = state.bufferedRequestCount;
        var buffer = new Array(l);
        var holder = state.corkedRequestsFree;
        holder.entry = entry;
        var count = 0;
        var allBuffers = true;
        while (entry) {
          buffer[count] = entry;
          if (!entry.isBuf)
            allBuffers = false;
          entry = entry.next;
          count += 1;
        }
        buffer.allBuffers = allBuffers;
        doWrite2(stream, state, true, state.length, buffer, "", holder.finish);
        state.pendingcb++;
        state.lastBufferedRequest = null;
        if (holder.next) {
          state.corkedRequestsFree = holder.next;
          holder.next = null;
        } else {
          state.corkedRequestsFree = new CorkedRequest2(state);
        }
        state.bufferedRequestCount = 0;
      } else {
        while (entry) {
          var chunk = entry.chunk;
          var encoding = entry.encoding;
          var cb = entry.callback;
          var len = state.objectMode ? 1 : chunk.length;
          doWrite2(stream, state, false, len, chunk, encoding, cb);
          entry = entry.next;
          state.bufferedRequestCount--;
          if (state.writing) {
            break;
          }
        }
        if (entry === null)
          state.lastBufferedRequest = null;
      }
      state.bufferedRequest = entry;
      state.bufferProcessing = false;
    }
    Writable2.prototype._write = function(chunk, encoding, cb) {
      cb(new ERR_METHOD_NOT_IMPLEMENTED("_write()"));
    };
    Writable2.prototype._writev = null;
    Writable2.prototype.end = function(chunk, encoding, cb) {
      var state = this._writableState;
      if (typeof chunk === "function") {
        cb = chunk;
        chunk = null;
        encoding = null;
      } else if (typeof encoding === "function") {
        cb = encoding;
        encoding = null;
      }
      if (chunk !== null && chunk !== void 0)
        this.write(chunk, encoding);
      if (state.corked) {
        state.corked = 1;
        this.uncork();
      }
      if (!state.ending)
        endWritable2(this, state, cb);
      return this;
    };
    Object.defineProperty(Writable2.prototype, "writableLength", {
      enumerable: false,
      get: function get() {
        return this._writableState.length;
      }
    });
    function needFinish2(state) {
      return state.ending && state.length === 0 && state.bufferedRequest === null && !state.finished && !state.writing;
    }
    function callFinal(stream, state) {
      stream._final(function(err) {
        state.pendingcb--;
        if (err) {
          errorOrDestroy(stream, err);
        }
        state.prefinished = true;
        stream.emit("prefinish");
        finishMaybe2(stream, state);
      });
    }
    function prefinish2(stream, state) {
      if (!state.prefinished && !state.finalCalled) {
        if (typeof stream._final === "function" && !state.destroyed) {
          state.pendingcb++;
          state.finalCalled = true;
          process.nextTick(callFinal, stream, state);
        } else {
          state.prefinished = true;
          stream.emit("prefinish");
        }
      }
    }
    function finishMaybe2(stream, state) {
      var need = needFinish2(state);
      if (need) {
        prefinish2(stream, state);
        if (state.pendingcb === 0) {
          state.finished = true;
          stream.emit("finish");
          if (state.autoDestroy) {
            var rState = stream._readableState;
            if (!rState || rState.autoDestroy && rState.endEmitted) {
              stream.destroy();
            }
          }
        }
      }
      return need;
    }
    function endWritable2(stream, state, cb) {
      state.ending = true;
      finishMaybe2(stream, state);
      if (cb) {
        if (state.finished)
          process.nextTick(cb);
        else
          stream.once("finish", cb);
      }
      state.ended = true;
      stream.writable = false;
    }
    function onCorkedFinish(corkReq, state, err) {
      var entry = corkReq.entry;
      corkReq.entry = null;
      while (entry) {
        var cb = entry.callback;
        state.pendingcb--;
        cb(err);
        entry = entry.next;
      }
      state.corkedRequestsFree.next = corkReq;
    }
    Object.defineProperty(Writable2.prototype, "destroyed", {
      enumerable: false,
      get: function get() {
        if (this._writableState === void 0) {
          return false;
        }
        return this._writableState.destroyed;
      },
      set: function set(value) {
        if (!this._writableState) {
          return;
        }
        this._writableState.destroyed = value;
      }
    });
    Writable2.prototype.destroy = destroyImpl.destroy;
    Writable2.prototype._undestroy = destroyImpl.undestroy;
    Writable2.prototype._destroy = function(err, cb) {
      cb(err);
    };
  }
});

// ../node_modules/readable-stream/lib/_stream_duplex.js
var require_stream_duplex = __commonJS({
  "../node_modules/readable-stream/lib/_stream_duplex.js"(exports, module) {
    "use strict";
    init_node_globals();
    var objectKeys = Object.keys || function(obj) {
      var keys3 = [];
      for (var key in obj) {
        keys3.push(key);
      }
      return keys3;
    };
    module.exports = Duplex2;
    var Readable2 = require_stream_readable();
    var Writable2 = require_stream_writable();
    require_inherits_browser()(Duplex2, Readable2);
    {
      keys2 = objectKeys(Writable2.prototype);
      for (v = 0; v < keys2.length; v++) {
        method = keys2[v];
        if (!Duplex2.prototype[method])
          Duplex2.prototype[method] = Writable2.prototype[method];
      }
    }
    var keys2;
    var method;
    var v;
    function Duplex2(options) {
      if (!(this instanceof Duplex2))
        return new Duplex2(options);
      Readable2.call(this, options);
      Writable2.call(this, options);
      this.allowHalfOpen = true;
      if (options) {
        if (options.readable === false)
          this.readable = false;
        if (options.writable === false)
          this.writable = false;
        if (options.allowHalfOpen === false) {
          this.allowHalfOpen = false;
          this.once("end", onend2);
        }
      }
    }
    Object.defineProperty(Duplex2.prototype, "writableHighWaterMark", {
      enumerable: false,
      get: function get() {
        return this._writableState.highWaterMark;
      }
    });
    Object.defineProperty(Duplex2.prototype, "writableBuffer", {
      enumerable: false,
      get: function get() {
        return this._writableState && this._writableState.getBuffer();
      }
    });
    Object.defineProperty(Duplex2.prototype, "writableLength", {
      enumerable: false,
      get: function get() {
        return this._writableState.length;
      }
    });
    function onend2() {
      if (this._writableState.ended)
        return;
      process.nextTick(onEndNT2, this);
    }
    function onEndNT2(self2) {
      self2.end();
    }
    Object.defineProperty(Duplex2.prototype, "destroyed", {
      enumerable: false,
      get: function get() {
        if (this._readableState === void 0 || this._writableState === void 0) {
          return false;
        }
        return this._readableState.destroyed && this._writableState.destroyed;
      },
      set: function set(value) {
        if (this._readableState === void 0 || this._writableState === void 0) {
          return;
        }
        this._readableState.destroyed = value;
        this._writableState.destroyed = value;
      }
    });
  }
});

// ../node_modules/string_decoder/lib/string_decoder.js
var require_string_decoder = __commonJS({
  "../node_modules/string_decoder/lib/string_decoder.js"(exports) {
    "use strict";
    init_node_globals();
    var Buffer4 = require_safe_buffer().Buffer;
    var isEncoding2 = Buffer4.isEncoding || function(encoding) {
      encoding = "" + encoding;
      switch (encoding && encoding.toLowerCase()) {
        case "hex":
        case "utf8":
        case "utf-8":
        case "ascii":
        case "binary":
        case "base64":
        case "ucs2":
        case "ucs-2":
        case "utf16le":
        case "utf-16le":
        case "raw":
          return true;
        default:
          return false;
      }
    };
    function _normalizeEncoding(enc) {
      if (!enc)
        return "utf8";
      var retried;
      while (true) {
        switch (enc) {
          case "utf8":
          case "utf-8":
            return "utf8";
          case "ucs2":
          case "ucs-2":
          case "utf16le":
          case "utf-16le":
            return "utf16le";
          case "latin1":
          case "binary":
            return "latin1";
          case "base64":
          case "ascii":
          case "hex":
            return enc;
          default:
            if (retried)
              return;
            enc = ("" + enc).toLowerCase();
            retried = true;
        }
      }
    }
    function normalizeEncoding(enc) {
      var nenc = _normalizeEncoding(enc);
      if (typeof nenc !== "string" && (Buffer4.isEncoding === isEncoding2 || !isEncoding2(enc)))
        throw new Error("Unknown encoding: " + enc);
      return nenc || enc;
    }
    exports.StringDecoder = StringDecoder2;
    function StringDecoder2(encoding) {
      this.encoding = normalizeEncoding(encoding);
      var nb;
      switch (this.encoding) {
        case "utf16le":
          this.text = utf16Text;
          this.end = utf16End;
          nb = 4;
          break;
        case "utf8":
          this.fillLast = utf8FillLast;
          nb = 4;
          break;
        case "base64":
          this.text = base64Text;
          this.end = base64End;
          nb = 3;
          break;
        default:
          this.write = simpleWrite;
          this.end = simpleEnd;
          return;
      }
      this.lastNeed = 0;
      this.lastTotal = 0;
      this.lastChar = Buffer4.allocUnsafe(nb);
    }
    StringDecoder2.prototype.write = function(buf) {
      if (buf.length === 0)
        return "";
      var r;
      var i;
      if (this.lastNeed) {
        r = this.fillLast(buf);
        if (r === void 0)
          return "";
        i = this.lastNeed;
        this.lastNeed = 0;
      } else {
        i = 0;
      }
      if (i < buf.length)
        return r ? r + this.text(buf, i) : this.text(buf, i);
      return r || "";
    };
    StringDecoder2.prototype.end = utf8End;
    StringDecoder2.prototype.text = utf8Text;
    StringDecoder2.prototype.fillLast = function(buf) {
      if (this.lastNeed <= buf.length) {
        buf.copy(this.lastChar, this.lastTotal - this.lastNeed, 0, this.lastNeed);
        return this.lastChar.toString(this.encoding, 0, this.lastTotal);
      }
      buf.copy(this.lastChar, this.lastTotal - this.lastNeed, 0, buf.length);
      this.lastNeed -= buf.length;
    };
    function utf8CheckByte(byte) {
      if (byte <= 127)
        return 0;
      else if (byte >> 5 === 6)
        return 2;
      else if (byte >> 4 === 14)
        return 3;
      else if (byte >> 3 === 30)
        return 4;
      return byte >> 6 === 2 ? -1 : -2;
    }
    function utf8CheckIncomplete(self2, buf, i) {
      var j = buf.length - 1;
      if (j < i)
        return 0;
      var nb = utf8CheckByte(buf[j]);
      if (nb >= 0) {
        if (nb > 0)
          self2.lastNeed = nb - 1;
        return nb;
      }
      if (--j < i || nb === -2)
        return 0;
      nb = utf8CheckByte(buf[j]);
      if (nb >= 0) {
        if (nb > 0)
          self2.lastNeed = nb - 2;
        return nb;
      }
      if (--j < i || nb === -2)
        return 0;
      nb = utf8CheckByte(buf[j]);
      if (nb >= 0) {
        if (nb > 0) {
          if (nb === 2)
            nb = 0;
          else
            self2.lastNeed = nb - 3;
        }
        return nb;
      }
      return 0;
    }
    function utf8CheckExtraBytes(self2, buf, p) {
      if ((buf[0] & 192) !== 128) {
        self2.lastNeed = 0;
        return "\uFFFD";
      }
      if (self2.lastNeed > 1 && buf.length > 1) {
        if ((buf[1] & 192) !== 128) {
          self2.lastNeed = 1;
          return "\uFFFD";
        }
        if (self2.lastNeed > 2 && buf.length > 2) {
          if ((buf[2] & 192) !== 128) {
            self2.lastNeed = 2;
            return "\uFFFD";
          }
        }
      }
    }
    function utf8FillLast(buf) {
      var p = this.lastTotal - this.lastNeed;
      var r = utf8CheckExtraBytes(this, buf, p);
      if (r !== void 0)
        return r;
      if (this.lastNeed <= buf.length) {
        buf.copy(this.lastChar, p, 0, this.lastNeed);
        return this.lastChar.toString(this.encoding, 0, this.lastTotal);
      }
      buf.copy(this.lastChar, p, 0, buf.length);
      this.lastNeed -= buf.length;
    }
    function utf8Text(buf, i) {
      var total = utf8CheckIncomplete(this, buf, i);
      if (!this.lastNeed)
        return buf.toString("utf8", i);
      this.lastTotal = total;
      var end = buf.length - (total - this.lastNeed);
      buf.copy(this.lastChar, 0, end);
      return buf.toString("utf8", i, end);
    }
    function utf8End(buf) {
      var r = buf && buf.length ? this.write(buf) : "";
      if (this.lastNeed)
        return r + "\uFFFD";
      return r;
    }
    function utf16Text(buf, i) {
      if ((buf.length - i) % 2 === 0) {
        var r = buf.toString("utf16le", i);
        if (r) {
          var c = r.charCodeAt(r.length - 1);
          if (c >= 55296 && c <= 56319) {
            this.lastNeed = 2;
            this.lastTotal = 4;
            this.lastChar[0] = buf[buf.length - 2];
            this.lastChar[1] = buf[buf.length - 1];
            return r.slice(0, -1);
          }
        }
        return r;
      }
      this.lastNeed = 1;
      this.lastTotal = 2;
      this.lastChar[0] = buf[buf.length - 1];
      return buf.toString("utf16le", i, buf.length - 1);
    }
    function utf16End(buf) {
      var r = buf && buf.length ? this.write(buf) : "";
      if (this.lastNeed) {
        var end = this.lastTotal - this.lastNeed;
        return r + this.lastChar.toString("utf16le", 0, end);
      }
      return r;
    }
    function base64Text(buf, i) {
      var n = (buf.length - i) % 3;
      if (n === 0)
        return buf.toString("base64", i);
      this.lastNeed = 3 - n;
      this.lastTotal = 3;
      if (n === 1) {
        this.lastChar[0] = buf[buf.length - 1];
      } else {
        this.lastChar[0] = buf[buf.length - 2];
        this.lastChar[1] = buf[buf.length - 1];
      }
      return buf.toString("base64", i, buf.length - n);
    }
    function base64End(buf) {
      var r = buf && buf.length ? this.write(buf) : "";
      if (this.lastNeed)
        return r + this.lastChar.toString("base64", 0, 3 - this.lastNeed);
      return r;
    }
    function simpleWrite(buf) {
      return buf.toString(this.encoding);
    }
    function simpleEnd(buf) {
      return buf && buf.length ? this.write(buf) : "";
    }
  }
});

// ../node_modules/readable-stream/lib/internal/streams/end-of-stream.js
var require_end_of_stream = __commonJS({
  "../node_modules/readable-stream/lib/internal/streams/end-of-stream.js"(exports, module) {
    "use strict";
    init_node_globals();
    var ERR_STREAM_PREMATURE_CLOSE = require_errors_browser().codes.ERR_STREAM_PREMATURE_CLOSE;
    function once3(callback) {
      var called = false;
      return function() {
        if (called)
          return;
        called = true;
        for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
          args[_key] = arguments[_key];
        }
        callback.apply(this, args);
      };
    }
    function noop2() {
    }
    function isRequest(stream) {
      return stream.setHeader && typeof stream.abort === "function";
    }
    function eos(stream, opts, callback) {
      if (typeof opts === "function")
        return eos(stream, null, opts);
      if (!opts)
        opts = {};
      callback = once3(callback || noop2);
      var readable = opts.readable || opts.readable !== false && stream.readable;
      var writable = opts.writable || opts.writable !== false && stream.writable;
      var onlegacyfinish = function onlegacyfinish2() {
        if (!stream.writable)
          onfinish();
      };
      var writableEnded = stream._writableState && stream._writableState.finished;
      var onfinish = function onfinish2() {
        writable = false;
        writableEnded = true;
        if (!readable)
          callback.call(stream);
      };
      var readableEnded = stream._readableState && stream._readableState.endEmitted;
      var onend2 = function onend3() {
        readable = false;
        readableEnded = true;
        if (!writable)
          callback.call(stream);
      };
      var onerror = function onerror2(err) {
        callback.call(stream, err);
      };
      var onclose = function onclose2() {
        var err;
        if (readable && !readableEnded) {
          if (!stream._readableState || !stream._readableState.ended)
            err = new ERR_STREAM_PREMATURE_CLOSE();
          return callback.call(stream, err);
        }
        if (writable && !writableEnded) {
          if (!stream._writableState || !stream._writableState.ended)
            err = new ERR_STREAM_PREMATURE_CLOSE();
          return callback.call(stream, err);
        }
      };
      var onrequest = function onrequest2() {
        stream.req.on("finish", onfinish);
      };
      if (isRequest(stream)) {
        stream.on("complete", onfinish);
        stream.on("abort", onclose);
        if (stream.req)
          onrequest();
        else
          stream.on("request", onrequest);
      } else if (writable && !stream._writableState) {
        stream.on("end", onlegacyfinish);
        stream.on("close", onlegacyfinish);
      }
      stream.on("end", onend2);
      stream.on("finish", onfinish);
      if (opts.error !== false)
        stream.on("error", onerror);
      stream.on("close", onclose);
      return function() {
        stream.removeListener("complete", onfinish);
        stream.removeListener("abort", onclose);
        stream.removeListener("request", onrequest);
        if (stream.req)
          stream.req.removeListener("finish", onfinish);
        stream.removeListener("end", onlegacyfinish);
        stream.removeListener("close", onlegacyfinish);
        stream.removeListener("finish", onfinish);
        stream.removeListener("end", onend2);
        stream.removeListener("error", onerror);
        stream.removeListener("close", onclose);
      };
    }
    module.exports = eos;
  }
});

// ../node_modules/readable-stream/lib/internal/streams/async_iterator.js
var require_async_iterator = __commonJS({
  "../node_modules/readable-stream/lib/internal/streams/async_iterator.js"(exports, module) {
    "use strict";
    init_node_globals();
    var _Object$setPrototypeO;
    function _defineProperty(obj, key, value) {
      if (key in obj) {
        Object.defineProperty(obj, key, { value, enumerable: true, configurable: true, writable: true });
      } else {
        obj[key] = value;
      }
      return obj;
    }
    var finished = require_end_of_stream();
    var kLastResolve = Symbol("lastResolve");
    var kLastReject = Symbol("lastReject");
    var kError = Symbol("error");
    var kEnded = Symbol("ended");
    var kLastPromise = Symbol("lastPromise");
    var kHandlePromise = Symbol("handlePromise");
    var kStream = Symbol("stream");
    function createIterResult(value, done2) {
      return {
        value,
        done: done2
      };
    }
    function readAndResolve(iter) {
      var resolve = iter[kLastResolve];
      if (resolve !== null) {
        var data = iter[kStream].read();
        if (data !== null) {
          iter[kLastPromise] = null;
          iter[kLastResolve] = null;
          iter[kLastReject] = null;
          resolve(createIterResult(data, false));
        }
      }
    }
    function onReadable(iter) {
      process.nextTick(readAndResolve, iter);
    }
    function wrapForNext(lastPromise, iter) {
      return function(resolve, reject) {
        lastPromise.then(function() {
          if (iter[kEnded]) {
            resolve(createIterResult(void 0, true));
            return;
          }
          iter[kHandlePromise](resolve, reject);
        }, reject);
      };
    }
    var AsyncIteratorPrototype = Object.getPrototypeOf(function() {
    });
    var ReadableStreamAsyncIteratorPrototype = Object.setPrototypeOf((_Object$setPrototypeO = {
      get stream() {
        return this[kStream];
      },
      next: function next() {
        var _this = this;
        var error = this[kError];
        if (error !== null) {
          return Promise.reject(error);
        }
        if (this[kEnded]) {
          return Promise.resolve(createIterResult(void 0, true));
        }
        if (this[kStream].destroyed) {
          return new Promise(function(resolve, reject) {
            process.nextTick(function() {
              if (_this[kError]) {
                reject(_this[kError]);
              } else {
                resolve(createIterResult(void 0, true));
              }
            });
          });
        }
        var lastPromise = this[kLastPromise];
        var promise;
        if (lastPromise) {
          promise = new Promise(wrapForNext(lastPromise, this));
        } else {
          var data = this[kStream].read();
          if (data !== null) {
            return Promise.resolve(createIterResult(data, false));
          }
          promise = new Promise(this[kHandlePromise]);
        }
        this[kLastPromise] = promise;
        return promise;
      }
    }, _defineProperty(_Object$setPrototypeO, Symbol.asyncIterator, function() {
      return this;
    }), _defineProperty(_Object$setPrototypeO, "return", function _return() {
      var _this2 = this;
      return new Promise(function(resolve, reject) {
        _this2[kStream].destroy(null, function(err) {
          if (err) {
            reject(err);
            return;
          }
          resolve(createIterResult(void 0, true));
        });
      });
    }), _Object$setPrototypeO), AsyncIteratorPrototype);
    var createReadableStreamAsyncIterator = function createReadableStreamAsyncIterator2(stream) {
      var _Object$create;
      var iterator = Object.create(ReadableStreamAsyncIteratorPrototype, (_Object$create = {}, _defineProperty(_Object$create, kStream, {
        value: stream,
        writable: true
      }), _defineProperty(_Object$create, kLastResolve, {
        value: null,
        writable: true
      }), _defineProperty(_Object$create, kLastReject, {
        value: null,
        writable: true
      }), _defineProperty(_Object$create, kError, {
        value: null,
        writable: true
      }), _defineProperty(_Object$create, kEnded, {
        value: stream._readableState.endEmitted,
        writable: true
      }), _defineProperty(_Object$create, kHandlePromise, {
        value: function value(resolve, reject) {
          var data = iterator[kStream].read();
          if (data) {
            iterator[kLastPromise] = null;
            iterator[kLastResolve] = null;
            iterator[kLastReject] = null;
            resolve(createIterResult(data, false));
          } else {
            iterator[kLastResolve] = resolve;
            iterator[kLastReject] = reject;
          }
        },
        writable: true
      }), _Object$create));
      iterator[kLastPromise] = null;
      finished(stream, function(err) {
        if (err && err.code !== "ERR_STREAM_PREMATURE_CLOSE") {
          var reject = iterator[kLastReject];
          if (reject !== null) {
            iterator[kLastPromise] = null;
            iterator[kLastResolve] = null;
            iterator[kLastReject] = null;
            reject(err);
          }
          iterator[kError] = err;
          return;
        }
        var resolve = iterator[kLastResolve];
        if (resolve !== null) {
          iterator[kLastPromise] = null;
          iterator[kLastResolve] = null;
          iterator[kLastReject] = null;
          resolve(createIterResult(void 0, true));
        }
        iterator[kEnded] = true;
      });
      stream.on("readable", onReadable.bind(null, iterator));
      return iterator;
    };
    module.exports = createReadableStreamAsyncIterator;
  }
});

// ../node_modules/readable-stream/lib/internal/streams/from-browser.js
var require_from_browser = __commonJS({
  "../node_modules/readable-stream/lib/internal/streams/from-browser.js"(exports, module) {
    init_node_globals();
    module.exports = function() {
      throw new Error("Readable.from is not available in the browser");
    };
  }
});

// ../node_modules/readable-stream/lib/_stream_readable.js
var require_stream_readable = __commonJS({
  "../node_modules/readable-stream/lib/_stream_readable.js"(exports, module) {
    "use strict";
    init_node_globals();
    module.exports = Readable2;
    var Duplex2;
    Readable2.ReadableState = ReadableState2;
    var EE = require_events().EventEmitter;
    var EElistenerCount = function EElistenerCount2(emitter, type) {
      return emitter.listeners(type).length;
    };
    var Stream2 = require_stream_browser();
    var Buffer4 = require_buffer().Buffer;
    var OurUint8Array = globalThis.Uint8Array || function() {
    };
    function _uint8ArrayToBuffer(chunk) {
      return Buffer4.from(chunk);
    }
    function _isUint8Array(obj) {
      return Buffer4.isBuffer(obj) || obj instanceof OurUint8Array;
    }
    var debugUtil = require_util();
    var debug2;
    if (debugUtil && debugUtil.debuglog) {
      debug2 = debugUtil.debuglog("stream");
    } else {
      debug2 = function debug3() {
      };
    }
    var BufferList2 = require_buffer_list();
    var destroyImpl = require_destroy();
    var _require = require_state();
    var getHighWaterMark = _require.getHighWaterMark;
    var _require$codes = require_errors_browser().codes;
    var ERR_INVALID_ARG_TYPE = _require$codes.ERR_INVALID_ARG_TYPE;
    var ERR_STREAM_PUSH_AFTER_EOF = _require$codes.ERR_STREAM_PUSH_AFTER_EOF;
    var ERR_METHOD_NOT_IMPLEMENTED = _require$codes.ERR_METHOD_NOT_IMPLEMENTED;
    var ERR_STREAM_UNSHIFT_AFTER_END_EVENT = _require$codes.ERR_STREAM_UNSHIFT_AFTER_END_EVENT;
    var StringDecoder2;
    var createReadableStreamAsyncIterator;
    var from2;
    require_inherits_browser()(Readable2, Stream2);
    var errorOrDestroy = destroyImpl.errorOrDestroy;
    var kProxyEvents = ["error", "close", "destroy", "pause", "resume"];
    function prependListener3(emitter, event, fn) {
      if (typeof emitter.prependListener === "function")
        return emitter.prependListener(event, fn);
      if (!emitter._events || !emitter._events[event])
        emitter.on(event, fn);
      else if (Array.isArray(emitter._events[event]))
        emitter._events[event].unshift(fn);
      else
        emitter._events[event] = [fn, emitter._events[event]];
    }
    function ReadableState2(options, stream, isDuplex) {
      Duplex2 = Duplex2 || require_stream_duplex();
      options = options || {};
      if (typeof isDuplex !== "boolean")
        isDuplex = stream instanceof Duplex2;
      this.objectMode = !!options.objectMode;
      if (isDuplex)
        this.objectMode = this.objectMode || !!options.readableObjectMode;
      this.highWaterMark = getHighWaterMark(this, options, "readableHighWaterMark", isDuplex);
      this.buffer = new BufferList2();
      this.length = 0;
      this.pipes = null;
      this.pipesCount = 0;
      this.flowing = null;
      this.ended = false;
      this.endEmitted = false;
      this.reading = false;
      this.sync = true;
      this.needReadable = false;
      this.emittedReadable = false;
      this.readableListening = false;
      this.resumeScheduled = false;
      this.paused = true;
      this.emitClose = options.emitClose !== false;
      this.autoDestroy = !!options.autoDestroy;
      this.destroyed = false;
      this.defaultEncoding = options.defaultEncoding || "utf8";
      this.awaitDrain = 0;
      this.readingMore = false;
      this.decoder = null;
      this.encoding = null;
      if (options.encoding) {
        if (!StringDecoder2)
          StringDecoder2 = require_string_decoder().StringDecoder;
        this.decoder = new StringDecoder2(options.encoding);
        this.encoding = options.encoding;
      }
    }
    function Readable2(options) {
      Duplex2 = Duplex2 || require_stream_duplex();
      if (!(this instanceof Readable2))
        return new Readable2(options);
      var isDuplex = this instanceof Duplex2;
      this._readableState = new ReadableState2(options, this, isDuplex);
      this.readable = true;
      if (options) {
        if (typeof options.read === "function")
          this._read = options.read;
        if (typeof options.destroy === "function")
          this._destroy = options.destroy;
      }
      Stream2.call(this);
    }
    Object.defineProperty(Readable2.prototype, "destroyed", {
      enumerable: false,
      get: function get() {
        if (this._readableState === void 0) {
          return false;
        }
        return this._readableState.destroyed;
      },
      set: function set(value) {
        if (!this._readableState) {
          return;
        }
        this._readableState.destroyed = value;
      }
    });
    Readable2.prototype.destroy = destroyImpl.destroy;
    Readable2.prototype._undestroy = destroyImpl.undestroy;
    Readable2.prototype._destroy = function(err, cb) {
      cb(err);
    };
    Readable2.prototype.push = function(chunk, encoding) {
      var state = this._readableState;
      var skipChunkCheck;
      if (!state.objectMode) {
        if (typeof chunk === "string") {
          encoding = encoding || state.defaultEncoding;
          if (encoding !== state.encoding) {
            chunk = Buffer4.from(chunk, encoding);
            encoding = "";
          }
          skipChunkCheck = true;
        }
      } else {
        skipChunkCheck = true;
      }
      return readableAddChunk2(this, chunk, encoding, false, skipChunkCheck);
    };
    Readable2.prototype.unshift = function(chunk) {
      return readableAddChunk2(this, chunk, null, true, false);
    };
    function readableAddChunk2(stream, chunk, encoding, addToFront, skipChunkCheck) {
      debug2("readableAddChunk", chunk);
      var state = stream._readableState;
      if (chunk === null) {
        state.reading = false;
        onEofChunk2(stream, state);
      } else {
        var er;
        if (!skipChunkCheck)
          er = chunkInvalid2(state, chunk);
        if (er) {
          errorOrDestroy(stream, er);
        } else if (state.objectMode || chunk && chunk.length > 0) {
          if (typeof chunk !== "string" && !state.objectMode && Object.getPrototypeOf(chunk) !== Buffer4.prototype) {
            chunk = _uint8ArrayToBuffer(chunk);
          }
          if (addToFront) {
            if (state.endEmitted)
              errorOrDestroy(stream, new ERR_STREAM_UNSHIFT_AFTER_END_EVENT());
            else
              addChunk(stream, state, chunk, true);
          } else if (state.ended) {
            errorOrDestroy(stream, new ERR_STREAM_PUSH_AFTER_EOF());
          } else if (state.destroyed) {
            return false;
          } else {
            state.reading = false;
            if (state.decoder && !encoding) {
              chunk = state.decoder.write(chunk);
              if (state.objectMode || chunk.length !== 0)
                addChunk(stream, state, chunk, false);
              else
                maybeReadMore2(stream, state);
            } else {
              addChunk(stream, state, chunk, false);
            }
          }
        } else if (!addToFront) {
          state.reading = false;
          maybeReadMore2(stream, state);
        }
      }
      return !state.ended && (state.length < state.highWaterMark || state.length === 0);
    }
    function addChunk(stream, state, chunk, addToFront) {
      if (state.flowing && state.length === 0 && !state.sync) {
        state.awaitDrain = 0;
        stream.emit("data", chunk);
      } else {
        state.length += state.objectMode ? 1 : chunk.length;
        if (addToFront)
          state.buffer.unshift(chunk);
        else
          state.buffer.push(chunk);
        if (state.needReadable)
          emitReadable2(stream);
      }
      maybeReadMore2(stream, state);
    }
    function chunkInvalid2(state, chunk) {
      var er;
      if (!_isUint8Array(chunk) && typeof chunk !== "string" && chunk !== void 0 && !state.objectMode) {
        er = new ERR_INVALID_ARG_TYPE("chunk", ["string", "Buffer", "Uint8Array"], chunk);
      }
      return er;
    }
    Readable2.prototype.isPaused = function() {
      return this._readableState.flowing === false;
    };
    Readable2.prototype.setEncoding = function(enc) {
      if (!StringDecoder2)
        StringDecoder2 = require_string_decoder().StringDecoder;
      var decoder = new StringDecoder2(enc);
      this._readableState.decoder = decoder;
      this._readableState.encoding = this._readableState.decoder.encoding;
      var p = this._readableState.buffer.head;
      var content = "";
      while (p !== null) {
        content += decoder.write(p.data);
        p = p.next;
      }
      this._readableState.buffer.clear();
      if (content !== "")
        this._readableState.buffer.push(content);
      this._readableState.length = content.length;
      return this;
    };
    var MAX_HWM2 = 1073741824;
    function computeNewHighWaterMark2(n) {
      if (n >= MAX_HWM2) {
        n = MAX_HWM2;
      } else {
        n--;
        n |= n >>> 1;
        n |= n >>> 2;
        n |= n >>> 4;
        n |= n >>> 8;
        n |= n >>> 16;
        n++;
      }
      return n;
    }
    function howMuchToRead2(n, state) {
      if (n <= 0 || state.length === 0 && state.ended)
        return 0;
      if (state.objectMode)
        return 1;
      if (n !== n) {
        if (state.flowing && state.length)
          return state.buffer.head.data.length;
        else
          return state.length;
      }
      if (n > state.highWaterMark)
        state.highWaterMark = computeNewHighWaterMark2(n);
      if (n <= state.length)
        return n;
      if (!state.ended) {
        state.needReadable = true;
        return 0;
      }
      return state.length;
    }
    Readable2.prototype.read = function(n) {
      debug2("read", n);
      n = parseInt(n, 10);
      var state = this._readableState;
      var nOrig = n;
      if (n !== 0)
        state.emittedReadable = false;
      if (n === 0 && state.needReadable && ((state.highWaterMark !== 0 ? state.length >= state.highWaterMark : state.length > 0) || state.ended)) {
        debug2("read: emitReadable", state.length, state.ended);
        if (state.length === 0 && state.ended)
          endReadable2(this);
        else
          emitReadable2(this);
        return null;
      }
      n = howMuchToRead2(n, state);
      if (n === 0 && state.ended) {
        if (state.length === 0)
          endReadable2(this);
        return null;
      }
      var doRead = state.needReadable;
      debug2("need readable", doRead);
      if (state.length === 0 || state.length - n < state.highWaterMark) {
        doRead = true;
        debug2("length less than watermark", doRead);
      }
      if (state.ended || state.reading) {
        doRead = false;
        debug2("reading or ended", doRead);
      } else if (doRead) {
        debug2("do read");
        state.reading = true;
        state.sync = true;
        if (state.length === 0)
          state.needReadable = true;
        this._read(state.highWaterMark);
        state.sync = false;
        if (!state.reading)
          n = howMuchToRead2(nOrig, state);
      }
      var ret;
      if (n > 0)
        ret = fromList2(n, state);
      else
        ret = null;
      if (ret === null) {
        state.needReadable = state.length <= state.highWaterMark;
        n = 0;
      } else {
        state.length -= n;
        state.awaitDrain = 0;
      }
      if (state.length === 0) {
        if (!state.ended)
          state.needReadable = true;
        if (nOrig !== n && state.ended)
          endReadable2(this);
      }
      if (ret !== null)
        this.emit("data", ret);
      return ret;
    };
    function onEofChunk2(stream, state) {
      debug2("onEofChunk");
      if (state.ended)
        return;
      if (state.decoder) {
        var chunk = state.decoder.end();
        if (chunk && chunk.length) {
          state.buffer.push(chunk);
          state.length += state.objectMode ? 1 : chunk.length;
        }
      }
      state.ended = true;
      if (state.sync) {
        emitReadable2(stream);
      } else {
        state.needReadable = false;
        if (!state.emittedReadable) {
          state.emittedReadable = true;
          emitReadable_2(stream);
        }
      }
    }
    function emitReadable2(stream) {
      var state = stream._readableState;
      debug2("emitReadable", state.needReadable, state.emittedReadable);
      state.needReadable = false;
      if (!state.emittedReadable) {
        debug2("emitReadable", state.flowing);
        state.emittedReadable = true;
        process.nextTick(emitReadable_2, stream);
      }
    }
    function emitReadable_2(stream) {
      var state = stream._readableState;
      debug2("emitReadable_", state.destroyed, state.length, state.ended);
      if (!state.destroyed && (state.length || state.ended)) {
        stream.emit("readable");
        state.emittedReadable = false;
      }
      state.needReadable = !state.flowing && !state.ended && state.length <= state.highWaterMark;
      flow2(stream);
    }
    function maybeReadMore2(stream, state) {
      if (!state.readingMore) {
        state.readingMore = true;
        process.nextTick(maybeReadMore_2, stream, state);
      }
    }
    function maybeReadMore_2(stream, state) {
      while (!state.reading && !state.ended && (state.length < state.highWaterMark || state.flowing && state.length === 0)) {
        var len = state.length;
        debug2("maybeReadMore read 0");
        stream.read(0);
        if (len === state.length)
          break;
      }
      state.readingMore = false;
    }
    Readable2.prototype._read = function(n) {
      errorOrDestroy(this, new ERR_METHOD_NOT_IMPLEMENTED("_read()"));
    };
    Readable2.prototype.pipe = function(dest, pipeOpts) {
      var src = this;
      var state = this._readableState;
      switch (state.pipesCount) {
        case 0:
          state.pipes = dest;
          break;
        case 1:
          state.pipes = [state.pipes, dest];
          break;
        default:
          state.pipes.push(dest);
          break;
      }
      state.pipesCount += 1;
      debug2("pipe count=%d opts=%j", state.pipesCount, pipeOpts);
      var doEnd = (!pipeOpts || pipeOpts.end !== false) && dest !== process.stdout && dest !== process.stderr;
      var endFn = doEnd ? onend2 : unpipe;
      if (state.endEmitted)
        process.nextTick(endFn);
      else
        src.once("end", endFn);
      dest.on("unpipe", onunpipe);
      function onunpipe(readable, unpipeInfo) {
        debug2("onunpipe");
        if (readable === src) {
          if (unpipeInfo && unpipeInfo.hasUnpiped === false) {
            unpipeInfo.hasUnpiped = true;
            cleanup();
          }
        }
      }
      function onend2() {
        debug2("onend");
        dest.end();
      }
      var ondrain = pipeOnDrain2(src);
      dest.on("drain", ondrain);
      var cleanedUp = false;
      function cleanup() {
        debug2("cleanup");
        dest.removeListener("close", onclose);
        dest.removeListener("finish", onfinish);
        dest.removeListener("drain", ondrain);
        dest.removeListener("error", onerror);
        dest.removeListener("unpipe", onunpipe);
        src.removeListener("end", onend2);
        src.removeListener("end", unpipe);
        src.removeListener("data", ondata);
        cleanedUp = true;
        if (state.awaitDrain && (!dest._writableState || dest._writableState.needDrain))
          ondrain();
      }
      src.on("data", ondata);
      function ondata(chunk) {
        debug2("ondata");
        var ret = dest.write(chunk);
        debug2("dest.write", ret);
        if (ret === false) {
          if ((state.pipesCount === 1 && state.pipes === dest || state.pipesCount > 1 && indexOf3(state.pipes, dest) !== -1) && !cleanedUp) {
            debug2("false write response, pause", state.awaitDrain);
            state.awaitDrain++;
          }
          src.pause();
        }
      }
      function onerror(er) {
        debug2("onerror", er);
        unpipe();
        dest.removeListener("error", onerror);
        if (EElistenerCount(dest, "error") === 0)
          errorOrDestroy(dest, er);
      }
      prependListener3(dest, "error", onerror);
      function onclose() {
        dest.removeListener("finish", onfinish);
        unpipe();
      }
      dest.once("close", onclose);
      function onfinish() {
        debug2("onfinish");
        dest.removeListener("close", onclose);
        unpipe();
      }
      dest.once("finish", onfinish);
      function unpipe() {
        debug2("unpipe");
        src.unpipe(dest);
      }
      dest.emit("pipe", src);
      if (!state.flowing) {
        debug2("pipe resume");
        src.resume();
      }
      return dest;
    };
    function pipeOnDrain2(src) {
      return function pipeOnDrainFunctionResult() {
        var state = src._readableState;
        debug2("pipeOnDrain", state.awaitDrain);
        if (state.awaitDrain)
          state.awaitDrain--;
        if (state.awaitDrain === 0 && EElistenerCount(src, "data")) {
          state.flowing = true;
          flow2(src);
        }
      };
    }
    Readable2.prototype.unpipe = function(dest) {
      var state = this._readableState;
      var unpipeInfo = {
        hasUnpiped: false
      };
      if (state.pipesCount === 0)
        return this;
      if (state.pipesCount === 1) {
        if (dest && dest !== state.pipes)
          return this;
        if (!dest)
          dest = state.pipes;
        state.pipes = null;
        state.pipesCount = 0;
        state.flowing = false;
        if (dest)
          dest.emit("unpipe", this, unpipeInfo);
        return this;
      }
      if (!dest) {
        var dests = state.pipes;
        var len = state.pipesCount;
        state.pipes = null;
        state.pipesCount = 0;
        state.flowing = false;
        for (var i = 0; i < len; i++) {
          dests[i].emit("unpipe", this, {
            hasUnpiped: false
          });
        }
        return this;
      }
      var index = indexOf3(state.pipes, dest);
      if (index === -1)
        return this;
      state.pipes.splice(index, 1);
      state.pipesCount -= 1;
      if (state.pipesCount === 1)
        state.pipes = state.pipes[0];
      dest.emit("unpipe", this, unpipeInfo);
      return this;
    };
    Readable2.prototype.on = function(ev, fn) {
      var res = Stream2.prototype.on.call(this, ev, fn);
      var state = this._readableState;
      if (ev === "data") {
        state.readableListening = this.listenerCount("readable") > 0;
        if (state.flowing !== false)
          this.resume();
      } else if (ev === "readable") {
        if (!state.endEmitted && !state.readableListening) {
          state.readableListening = state.needReadable = true;
          state.flowing = false;
          state.emittedReadable = false;
          debug2("on readable", state.length, state.reading);
          if (state.length) {
            emitReadable2(this);
          } else if (!state.reading) {
            process.nextTick(nReadingNextTick2, this);
          }
        }
      }
      return res;
    };
    Readable2.prototype.addListener = Readable2.prototype.on;
    Readable2.prototype.removeListener = function(ev, fn) {
      var res = Stream2.prototype.removeListener.call(this, ev, fn);
      if (ev === "readable") {
        process.nextTick(updateReadableListening, this);
      }
      return res;
    };
    Readable2.prototype.removeAllListeners = function(ev) {
      var res = Stream2.prototype.removeAllListeners.apply(this, arguments);
      if (ev === "readable" || ev === void 0) {
        process.nextTick(updateReadableListening, this);
      }
      return res;
    };
    function updateReadableListening(self2) {
      var state = self2._readableState;
      state.readableListening = self2.listenerCount("readable") > 0;
      if (state.resumeScheduled && !state.paused) {
        state.flowing = true;
      } else if (self2.listenerCount("data") > 0) {
        self2.resume();
      }
    }
    function nReadingNextTick2(self2) {
      debug2("readable nexttick read 0");
      self2.read(0);
    }
    Readable2.prototype.resume = function() {
      var state = this._readableState;
      if (!state.flowing) {
        debug2("resume");
        state.flowing = !state.readableListening;
        resume2(this, state);
      }
      state.paused = false;
      return this;
    };
    function resume2(stream, state) {
      if (!state.resumeScheduled) {
        state.resumeScheduled = true;
        process.nextTick(resume_2, stream, state);
      }
    }
    function resume_2(stream, state) {
      debug2("resume", state.reading);
      if (!state.reading) {
        stream.read(0);
      }
      state.resumeScheduled = false;
      stream.emit("resume");
      flow2(stream);
      if (state.flowing && !state.reading)
        stream.read(0);
    }
    Readable2.prototype.pause = function() {
      debug2("call pause flowing=%j", this._readableState.flowing);
      if (this._readableState.flowing !== false) {
        debug2("pause");
        this._readableState.flowing = false;
        this.emit("pause");
      }
      this._readableState.paused = true;
      return this;
    };
    function flow2(stream) {
      var state = stream._readableState;
      debug2("flow", state.flowing);
      while (state.flowing && stream.read() !== null) {
        ;
      }
    }
    Readable2.prototype.wrap = function(stream) {
      var _this = this;
      var state = this._readableState;
      var paused = false;
      stream.on("end", function() {
        debug2("wrapped end");
        if (state.decoder && !state.ended) {
          var chunk = state.decoder.end();
          if (chunk && chunk.length)
            _this.push(chunk);
        }
        _this.push(null);
      });
      stream.on("data", function(chunk) {
        debug2("wrapped data");
        if (state.decoder)
          chunk = state.decoder.write(chunk);
        if (state.objectMode && (chunk === null || chunk === void 0))
          return;
        else if (!state.objectMode && (!chunk || !chunk.length))
          return;
        var ret = _this.push(chunk);
        if (!ret) {
          paused = true;
          stream.pause();
        }
      });
      for (var i in stream) {
        if (this[i] === void 0 && typeof stream[i] === "function") {
          this[i] = function methodWrap(method) {
            return function methodWrapReturnFunction() {
              return stream[method].apply(stream, arguments);
            };
          }(i);
        }
      }
      for (var n = 0; n < kProxyEvents.length; n++) {
        stream.on(kProxyEvents[n], this.emit.bind(this, kProxyEvents[n]));
      }
      this._read = function(n2) {
        debug2("wrapped _read", n2);
        if (paused) {
          paused = false;
          stream.resume();
        }
      };
      return this;
    };
    if (typeof Symbol === "function") {
      Readable2.prototype[Symbol.asyncIterator] = function() {
        if (createReadableStreamAsyncIterator === void 0) {
          createReadableStreamAsyncIterator = require_async_iterator();
        }
        return createReadableStreamAsyncIterator(this);
      };
    }
    Object.defineProperty(Readable2.prototype, "readableHighWaterMark", {
      enumerable: false,
      get: function get() {
        return this._readableState.highWaterMark;
      }
    });
    Object.defineProperty(Readable2.prototype, "readableBuffer", {
      enumerable: false,
      get: function get() {
        return this._readableState && this._readableState.buffer;
      }
    });
    Object.defineProperty(Readable2.prototype, "readableFlowing", {
      enumerable: false,
      get: function get() {
        return this._readableState.flowing;
      },
      set: function set(state) {
        if (this._readableState) {
          this._readableState.flowing = state;
        }
      }
    });
    Readable2._fromList = fromList2;
    Object.defineProperty(Readable2.prototype, "readableLength", {
      enumerable: false,
      get: function get() {
        return this._readableState.length;
      }
    });
    function fromList2(n, state) {
      if (state.length === 0)
        return null;
      var ret;
      if (state.objectMode)
        ret = state.buffer.shift();
      else if (!n || n >= state.length) {
        if (state.decoder)
          ret = state.buffer.join("");
        else if (state.buffer.length === 1)
          ret = state.buffer.first();
        else
          ret = state.buffer.concat(state.length);
        state.buffer.clear();
      } else {
        ret = state.buffer.consume(n, state.decoder);
      }
      return ret;
    }
    function endReadable2(stream) {
      var state = stream._readableState;
      debug2("endReadable", state.endEmitted);
      if (!state.endEmitted) {
        state.ended = true;
        process.nextTick(endReadableNT2, state, stream);
      }
    }
    function endReadableNT2(state, stream) {
      debug2("endReadableNT", state.endEmitted, state.length);
      if (!state.endEmitted && state.length === 0) {
        state.endEmitted = true;
        stream.readable = false;
        stream.emit("end");
        if (state.autoDestroy) {
          var wState = stream._writableState;
          if (!wState || wState.autoDestroy && wState.finished) {
            stream.destroy();
          }
        }
      }
    }
    if (typeof Symbol === "function") {
      Readable2.from = function(iterable, opts) {
        if (from2 === void 0) {
          from2 = require_from_browser();
        }
        return from2(Readable2, iterable, opts);
      };
    }
    function indexOf3(xs, x) {
      for (var i = 0, l = xs.length; i < l; i++) {
        if (xs[i] === x)
          return i;
      }
      return -1;
    }
  }
});

// ../node_modules/readable-stream/lib/_stream_transform.js
var require_stream_transform = __commonJS({
  "../node_modules/readable-stream/lib/_stream_transform.js"(exports, module) {
    "use strict";
    init_node_globals();
    module.exports = Transform2;
    var _require$codes = require_errors_browser().codes;
    var ERR_METHOD_NOT_IMPLEMENTED = _require$codes.ERR_METHOD_NOT_IMPLEMENTED;
    var ERR_MULTIPLE_CALLBACK = _require$codes.ERR_MULTIPLE_CALLBACK;
    var ERR_TRANSFORM_ALREADY_TRANSFORMING = _require$codes.ERR_TRANSFORM_ALREADY_TRANSFORMING;
    var ERR_TRANSFORM_WITH_LENGTH_0 = _require$codes.ERR_TRANSFORM_WITH_LENGTH_0;
    var Duplex2 = require_stream_duplex();
    require_inherits_browser()(Transform2, Duplex2);
    function afterTransform2(er, data) {
      var ts = this._transformState;
      ts.transforming = false;
      var cb = ts.writecb;
      if (cb === null) {
        return this.emit("error", new ERR_MULTIPLE_CALLBACK());
      }
      ts.writechunk = null;
      ts.writecb = null;
      if (data != null)
        this.push(data);
      cb(er);
      var rs = this._readableState;
      rs.reading = false;
      if (rs.needReadable || rs.length < rs.highWaterMark) {
        this._read(rs.highWaterMark);
      }
    }
    function Transform2(options) {
      if (!(this instanceof Transform2))
        return new Transform2(options);
      Duplex2.call(this, options);
      this._transformState = {
        afterTransform: afterTransform2.bind(this),
        needTransform: false,
        transforming: false,
        writecb: null,
        writechunk: null,
        writeencoding: null
      };
      this._readableState.needReadable = true;
      this._readableState.sync = false;
      if (options) {
        if (typeof options.transform === "function")
          this._transform = options.transform;
        if (typeof options.flush === "function")
          this._flush = options.flush;
      }
      this.on("prefinish", prefinish2);
    }
    function prefinish2() {
      var _this = this;
      if (typeof this._flush === "function" && !this._readableState.destroyed) {
        this._flush(function(er, data) {
          done2(_this, er, data);
        });
      } else {
        done2(this, null, null);
      }
    }
    Transform2.prototype.push = function(chunk, encoding) {
      this._transformState.needTransform = false;
      return Duplex2.prototype.push.call(this, chunk, encoding);
    };
    Transform2.prototype._transform = function(chunk, encoding, cb) {
      cb(new ERR_METHOD_NOT_IMPLEMENTED("_transform()"));
    };
    Transform2.prototype._write = function(chunk, encoding, cb) {
      var ts = this._transformState;
      ts.writecb = cb;
      ts.writechunk = chunk;
      ts.writeencoding = encoding;
      if (!ts.transforming) {
        var rs = this._readableState;
        if (ts.needTransform || rs.needReadable || rs.length < rs.highWaterMark)
          this._read(rs.highWaterMark);
      }
    };
    Transform2.prototype._read = function(n) {
      var ts = this._transformState;
      if (ts.writechunk !== null && !ts.transforming) {
        ts.transforming = true;
        this._transform(ts.writechunk, ts.writeencoding, ts.afterTransform);
      } else {
        ts.needTransform = true;
      }
    };
    Transform2.prototype._destroy = function(err, cb) {
      Duplex2.prototype._destroy.call(this, err, function(err2) {
        cb(err2);
      });
    };
    function done2(stream, er, data) {
      if (er)
        return stream.emit("error", er);
      if (data != null)
        stream.push(data);
      if (stream._writableState.length)
        throw new ERR_TRANSFORM_WITH_LENGTH_0();
      if (stream._transformState.transforming)
        throw new ERR_TRANSFORM_ALREADY_TRANSFORMING();
      return stream.push(null);
    }
  }
});

// ../node_modules/readable-stream/lib/_stream_passthrough.js
var require_stream_passthrough = __commonJS({
  "../node_modules/readable-stream/lib/_stream_passthrough.js"(exports, module) {
    "use strict";
    init_node_globals();
    module.exports = PassThrough2;
    var Transform2 = require_stream_transform();
    require_inherits_browser()(PassThrough2, Transform2);
    function PassThrough2(options) {
      if (!(this instanceof PassThrough2))
        return new PassThrough2(options);
      Transform2.call(this, options);
    }
    PassThrough2.prototype._transform = function(chunk, encoding, cb) {
      cb(null, chunk);
    };
  }
});

// ../node_modules/readable-stream/lib/internal/streams/pipeline.js
var require_pipeline = __commonJS({
  "../node_modules/readable-stream/lib/internal/streams/pipeline.js"(exports, module) {
    "use strict";
    init_node_globals();
    var eos;
    function once3(callback) {
      var called = false;
      return function() {
        if (called)
          return;
        called = true;
        callback.apply(void 0, arguments);
      };
    }
    var _require$codes = require_errors_browser().codes;
    var ERR_MISSING_ARGS = _require$codes.ERR_MISSING_ARGS;
    var ERR_STREAM_DESTROYED = _require$codes.ERR_STREAM_DESTROYED;
    function noop2(err) {
      if (err)
        throw err;
    }
    function isRequest(stream) {
      return stream.setHeader && typeof stream.abort === "function";
    }
    function destroyer(stream, reading, writing, callback) {
      callback = once3(callback);
      var closed = false;
      stream.on("close", function() {
        closed = true;
      });
      if (eos === void 0)
        eos = require_end_of_stream();
      eos(stream, {
        readable: reading,
        writable: writing
      }, function(err) {
        if (err)
          return callback(err);
        closed = true;
        callback();
      });
      var destroyed = false;
      return function(err) {
        if (closed)
          return;
        if (destroyed)
          return;
        destroyed = true;
        if (isRequest(stream))
          return stream.abort();
        if (typeof stream.destroy === "function")
          return stream.destroy();
        callback(err || new ERR_STREAM_DESTROYED("pipe"));
      };
    }
    function call(fn) {
      fn();
    }
    function pipe(from2, to) {
      return from2.pipe(to);
    }
    function popCallback(streams) {
      if (!streams.length)
        return noop2;
      if (typeof streams[streams.length - 1] !== "function")
        return noop2;
      return streams.pop();
    }
    function pipeline() {
      for (var _len = arguments.length, streams = new Array(_len), _key = 0; _key < _len; _key++) {
        streams[_key] = arguments[_key];
      }
      var callback = popCallback(streams);
      if (Array.isArray(streams[0]))
        streams = streams[0];
      if (streams.length < 2) {
        throw new ERR_MISSING_ARGS("streams");
      }
      var error;
      var destroys = streams.map(function(stream, i) {
        var reading = i < streams.length - 1;
        var writing = i > 0;
        return destroyer(stream, reading, writing, function(err) {
          if (!error)
            error = err;
          if (err)
            destroys.forEach(call);
          if (reading)
            return;
          destroys.forEach(call);
          callback(error);
        });
      });
      return streams.reduce(pipe);
    }
    module.exports = pipeline;
  }
});

// ../node_modules/readable-stream/readable-browser.js
var require_readable_browser = __commonJS({
  "../node_modules/readable-stream/readable-browser.js"(exports, module) {
    init_node_globals();
    exports = module.exports = require_stream_readable();
    exports.Stream = exports;
    exports.Readable = exports;
    exports.Writable = require_stream_writable();
    exports.Duplex = require_stream_duplex();
    exports.Transform = require_stream_transform();
    exports.PassThrough = require_stream_passthrough();
    exports.finished = require_end_of_stream();
    exports.pipeline = require_pipeline();
  }
});

// ../node_modules/hash-base/index.js
var require_hash_base = __commonJS({
  "../node_modules/hash-base/index.js"(exports, module) {
    "use strict";
    init_node_globals();
    var Buffer4 = require_safe_buffer().Buffer;
    var Transform2 = require_readable_browser().Transform;
    var inherits2 = require_inherits_browser();
    function throwIfNotStringOrBuffer(val, prefix) {
      if (!Buffer4.isBuffer(val) && typeof val !== "string") {
        throw new TypeError(prefix + " must be a string or a buffer");
      }
    }
    function HashBase(blockSize) {
      Transform2.call(this);
      this._block = Buffer4.allocUnsafe(blockSize);
      this._blockSize = blockSize;
      this._blockOffset = 0;
      this._length = [0, 0, 0, 0];
      this._finalized = false;
    }
    inherits2(HashBase, Transform2);
    HashBase.prototype._transform = function(chunk, encoding, callback) {
      var error = null;
      try {
        this.update(chunk, encoding);
      } catch (err) {
        error = err;
      }
      callback(error);
    };
    HashBase.prototype._flush = function(callback) {
      var error = null;
      try {
        this.push(this.digest());
      } catch (err) {
        error = err;
      }
      callback(error);
    };
    HashBase.prototype.update = function(data, encoding) {
      throwIfNotStringOrBuffer(data, "Data");
      if (this._finalized)
        throw new Error("Digest already called");
      if (!Buffer4.isBuffer(data))
        data = Buffer4.from(data, encoding);
      var block = this._block;
      var offset = 0;
      while (this._blockOffset + data.length - offset >= this._blockSize) {
        for (var i = this._blockOffset; i < this._blockSize; )
          block[i++] = data[offset++];
        this._update();
        this._blockOffset = 0;
      }
      while (offset < data.length)
        block[this._blockOffset++] = data[offset++];
      for (var j = 0, carry = data.length * 8; carry > 0; ++j) {
        this._length[j] += carry;
        carry = this._length[j] / 4294967296 | 0;
        if (carry > 0)
          this._length[j] -= 4294967296 * carry;
      }
      return this;
    };
    HashBase.prototype._update = function() {
      throw new Error("_update is not implemented");
    };
    HashBase.prototype.digest = function(encoding) {
      if (this._finalized)
        throw new Error("Digest already called");
      this._finalized = true;
      var digest = this._digest();
      if (encoding !== void 0)
        digest = digest.toString(encoding);
      this._block.fill(0);
      this._blockOffset = 0;
      for (var i = 0; i < 4; ++i)
        this._length[i] = 0;
      return digest;
    };
    HashBase.prototype._digest = function() {
      throw new Error("_digest is not implemented");
    };
    module.exports = HashBase;
  }
});

// ../node_modules/md5.js/index.js
var require_md5 = __commonJS({
  "../node_modules/md5.js/index.js"(exports, module) {
    "use strict";
    init_node_globals();
    var inherits2 = require_inherits_browser();
    var HashBase = require_hash_base();
    var Buffer4 = require_safe_buffer().Buffer;
    var ARRAY16 = new Array(16);
    function MD5() {
      HashBase.call(this, 64);
      this._a = 1732584193;
      this._b = 4023233417;
      this._c = 2562383102;
      this._d = 271733878;
    }
    inherits2(MD5, HashBase);
    MD5.prototype._update = function() {
      var M = ARRAY16;
      for (var i = 0; i < 16; ++i)
        M[i] = this._block.readInt32LE(i * 4);
      var a = this._a;
      var b = this._b;
      var c = this._c;
      var d = this._d;
      a = fnF(a, b, c, d, M[0], 3614090360, 7);
      d = fnF(d, a, b, c, M[1], 3905402710, 12);
      c = fnF(c, d, a, b, M[2], 606105819, 17);
      b = fnF(b, c, d, a, M[3], 3250441966, 22);
      a = fnF(a, b, c, d, M[4], 4118548399, 7);
      d = fnF(d, a, b, c, M[5], 1200080426, 12);
      c = fnF(c, d, a, b, M[6], 2821735955, 17);
      b = fnF(b, c, d, a, M[7], 4249261313, 22);
      a = fnF(a, b, c, d, M[8], 1770035416, 7);
      d = fnF(d, a, b, c, M[9], 2336552879, 12);
      c = fnF(c, d, a, b, M[10], 4294925233, 17);
      b = fnF(b, c, d, a, M[11], 2304563134, 22);
      a = fnF(a, b, c, d, M[12], 1804603682, 7);
      d = fnF(d, a, b, c, M[13], 4254626195, 12);
      c = fnF(c, d, a, b, M[14], 2792965006, 17);
      b = fnF(b, c, d, a, M[15], 1236535329, 22);
      a = fnG(a, b, c, d, M[1], 4129170786, 5);
      d = fnG(d, a, b, c, M[6], 3225465664, 9);
      c = fnG(c, d, a, b, M[11], 643717713, 14);
      b = fnG(b, c, d, a, M[0], 3921069994, 20);
      a = fnG(a, b, c, d, M[5], 3593408605, 5);
      d = fnG(d, a, b, c, M[10], 38016083, 9);
      c = fnG(c, d, a, b, M[15], 3634488961, 14);
      b = fnG(b, c, d, a, M[4], 3889429448, 20);
      a = fnG(a, b, c, d, M[9], 568446438, 5);
      d = fnG(d, a, b, c, M[14], 3275163606, 9);
      c = fnG(c, d, a, b, M[3], 4107603335, 14);
      b = fnG(b, c, d, a, M[8], 1163531501, 20);
      a = fnG(a, b, c, d, M[13], 2850285829, 5);
      d = fnG(d, a, b, c, M[2], 4243563512, 9);
      c = fnG(c, d, a, b, M[7], 1735328473, 14);
      b = fnG(b, c, d, a, M[12], 2368359562, 20);
      a = fnH(a, b, c, d, M[5], 4294588738, 4);
      d = fnH(d, a, b, c, M[8], 2272392833, 11);
      c = fnH(c, d, a, b, M[11], 1839030562, 16);
      b = fnH(b, c, d, a, M[14], 4259657740, 23);
      a = fnH(a, b, c, d, M[1], 2763975236, 4);
      d = fnH(d, a, b, c, M[4], 1272893353, 11);
      c = fnH(c, d, a, b, M[7], 4139469664, 16);
      b = fnH(b, c, d, a, M[10], 3200236656, 23);
      a = fnH(a, b, c, d, M[13], 681279174, 4);
      d = fnH(d, a, b, c, M[0], 3936430074, 11);
      c = fnH(c, d, a, b, M[3], 3572445317, 16);
      b = fnH(b, c, d, a, M[6], 76029189, 23);
      a = fnH(a, b, c, d, M[9], 3654602809, 4);
      d = fnH(d, a, b, c, M[12], 3873151461, 11);
      c = fnH(c, d, a, b, M[15], 530742520, 16);
      b = fnH(b, c, d, a, M[2], 3299628645, 23);
      a = fnI(a, b, c, d, M[0], 4096336452, 6);
      d = fnI(d, a, b, c, M[7], 1126891415, 10);
      c = fnI(c, d, a, b, M[14], 2878612391, 15);
      b = fnI(b, c, d, a, M[5], 4237533241, 21);
      a = fnI(a, b, c, d, M[12], 1700485571, 6);
      d = fnI(d, a, b, c, M[3], 2399980690, 10);
      c = fnI(c, d, a, b, M[10], 4293915773, 15);
      b = fnI(b, c, d, a, M[1], 2240044497, 21);
      a = fnI(a, b, c, d, M[8], 1873313359, 6);
      d = fnI(d, a, b, c, M[15], 4264355552, 10);
      c = fnI(c, d, a, b, M[6], 2734768916, 15);
      b = fnI(b, c, d, a, M[13], 1309151649, 21);
      a = fnI(a, b, c, d, M[4], 4149444226, 6);
      d = fnI(d, a, b, c, M[11], 3174756917, 10);
      c = fnI(c, d, a, b, M[2], 718787259, 15);
      b = fnI(b, c, d, a, M[9], 3951481745, 21);
      this._a = this._a + a | 0;
      this._b = this._b + b | 0;
      this._c = this._c + c | 0;
      this._d = this._d + d | 0;
    };
    MD5.prototype._digest = function() {
      this._block[this._blockOffset++] = 128;
      if (this._blockOffset > 56) {
        this._block.fill(0, this._blockOffset, 64);
        this._update();
        this._blockOffset = 0;
      }
      this._block.fill(0, this._blockOffset, 56);
      this._block.writeUInt32LE(this._length[0], 56);
      this._block.writeUInt32LE(this._length[1], 60);
      this._update();
      var buffer = Buffer4.allocUnsafe(16);
      buffer.writeInt32LE(this._a, 0);
      buffer.writeInt32LE(this._b, 4);
      buffer.writeInt32LE(this._c, 8);
      buffer.writeInt32LE(this._d, 12);
      return buffer;
    };
    function rotl(x, n) {
      return x << n | x >>> 32 - n;
    }
    function fnF(a, b, c, d, m, k, s) {
      return rotl(a + (b & c | ~b & d) + m + k | 0, s) + b | 0;
    }
    function fnG(a, b, c, d, m, k, s) {
      return rotl(a + (b & d | c & ~d) + m + k | 0, s) + b | 0;
    }
    function fnH(a, b, c, d, m, k, s) {
      return rotl(a + (b ^ c ^ d) + m + k | 0, s) + b | 0;
    }
    function fnI(a, b, c, d, m, k, s) {
      return rotl(a + (c ^ (b | ~d)) + m + k | 0, s) + b | 0;
    }
    module.exports = MD5;
  }
});

// ../node_modules/ripemd160/index.js
var require_ripemd160 = __commonJS({
  "../node_modules/ripemd160/index.js"(exports, module) {
    "use strict";
    init_node_globals();
    var Buffer4 = require_buffer().Buffer;
    var inherits2 = require_inherits_browser();
    var HashBase = require_hash_base();
    var ARRAY16 = new Array(16);
    var zl = [
      0,
      1,
      2,
      3,
      4,
      5,
      6,
      7,
      8,
      9,
      10,
      11,
      12,
      13,
      14,
      15,
      7,
      4,
      13,
      1,
      10,
      6,
      15,
      3,
      12,
      0,
      9,
      5,
      2,
      14,
      11,
      8,
      3,
      10,
      14,
      4,
      9,
      15,
      8,
      1,
      2,
      7,
      0,
      6,
      13,
      11,
      5,
      12,
      1,
      9,
      11,
      10,
      0,
      8,
      12,
      4,
      13,
      3,
      7,
      15,
      14,
      5,
      6,
      2,
      4,
      0,
      5,
      9,
      7,
      12,
      2,
      10,
      14,
      1,
      3,
      8,
      11,
      6,
      15,
      13
    ];
    var zr = [
      5,
      14,
      7,
      0,
      9,
      2,
      11,
      4,
      13,
      6,
      15,
      8,
      1,
      10,
      3,
      12,
      6,
      11,
      3,
      7,
      0,
      13,
      5,
      10,
      14,
      15,
      8,
      12,
      4,
      9,
      1,
      2,
      15,
      5,
      1,
      3,
      7,
      14,
      6,
      9,
      11,
      8,
      12,
      2,
      10,
      0,
      4,
      13,
      8,
      6,
      4,
      1,
      3,
      11,
      15,
      0,
      5,
      12,
      2,
      13,
      9,
      7,
      10,
      14,
      12,
      15,
      10,
      4,
      1,
      5,
      8,
      7,
      6,
      2,
      13,
      14,
      0,
      3,
      9,
      11
    ];
    var sl = [
      11,
      14,
      15,
      12,
      5,
      8,
      7,
      9,
      11,
      13,
      14,
      15,
      6,
      7,
      9,
      8,
      7,
      6,
      8,
      13,
      11,
      9,
      7,
      15,
      7,
      12,
      15,
      9,
      11,
      7,
      13,
      12,
      11,
      13,
      6,
      7,
      14,
      9,
      13,
      15,
      14,
      8,
      13,
      6,
      5,
      12,
      7,
      5,
      11,
      12,
      14,
      15,
      14,
      15,
      9,
      8,
      9,
      14,
      5,
      6,
      8,
      6,
      5,
      12,
      9,
      15,
      5,
      11,
      6,
      8,
      13,
      12,
      5,
      12,
      13,
      14,
      11,
      8,
      5,
      6
    ];
    var sr = [
      8,
      9,
      9,
      11,
      13,
      15,
      15,
      5,
      7,
      7,
      8,
      11,
      14,
      14,
      12,
      6,
      9,
      13,
      15,
      7,
      12,
      8,
      9,
      11,
      7,
      7,
      12,
      7,
      6,
      15,
      13,
      11,
      9,
      7,
      15,
      11,
      8,
      6,
      6,
      14,
      12,
      13,
      5,
      14,
      13,
      13,
      7,
      5,
      15,
      5,
      8,
      11,
      14,
      14,
      6,
      14,
      6,
      9,
      12,
      9,
      12,
      5,
      15,
      8,
      8,
      5,
      12,
      9,
      12,
      5,
      14,
      6,
      8,
      13,
      6,
      5,
      15,
      13,
      11,
      11
    ];
    var hl = [0, 1518500249, 1859775393, 2400959708, 2840853838];
    var hr = [1352829926, 1548603684, 1836072691, 2053994217, 0];
    function RIPEMD160() {
      HashBase.call(this, 64);
      this._a = 1732584193;
      this._b = 4023233417;
      this._c = 2562383102;
      this._d = 271733878;
      this._e = 3285377520;
    }
    inherits2(RIPEMD160, HashBase);
    RIPEMD160.prototype._update = function() {
      var words = ARRAY16;
      for (var j = 0; j < 16; ++j)
        words[j] = this._block.readInt32LE(j * 4);
      var al = this._a | 0;
      var bl = this._b | 0;
      var cl = this._c | 0;
      var dl = this._d | 0;
      var el = this._e | 0;
      var ar = this._a | 0;
      var br = this._b | 0;
      var cr = this._c | 0;
      var dr = this._d | 0;
      var er = this._e | 0;
      for (var i = 0; i < 80; i += 1) {
        var tl;
        var tr;
        if (i < 16) {
          tl = fn1(al, bl, cl, dl, el, words[zl[i]], hl[0], sl[i]);
          tr = fn5(ar, br, cr, dr, er, words[zr[i]], hr[0], sr[i]);
        } else if (i < 32) {
          tl = fn2(al, bl, cl, dl, el, words[zl[i]], hl[1], sl[i]);
          tr = fn4(ar, br, cr, dr, er, words[zr[i]], hr[1], sr[i]);
        } else if (i < 48) {
          tl = fn3(al, bl, cl, dl, el, words[zl[i]], hl[2], sl[i]);
          tr = fn3(ar, br, cr, dr, er, words[zr[i]], hr[2], sr[i]);
        } else if (i < 64) {
          tl = fn4(al, bl, cl, dl, el, words[zl[i]], hl[3], sl[i]);
          tr = fn2(ar, br, cr, dr, er, words[zr[i]], hr[3], sr[i]);
        } else {
          tl = fn5(al, bl, cl, dl, el, words[zl[i]], hl[4], sl[i]);
          tr = fn1(ar, br, cr, dr, er, words[zr[i]], hr[4], sr[i]);
        }
        al = el;
        el = dl;
        dl = rotl(cl, 10);
        cl = bl;
        bl = tl;
        ar = er;
        er = dr;
        dr = rotl(cr, 10);
        cr = br;
        br = tr;
      }
      var t = this._b + cl + dr | 0;
      this._b = this._c + dl + er | 0;
      this._c = this._d + el + ar | 0;
      this._d = this._e + al + br | 0;
      this._e = this._a + bl + cr | 0;
      this._a = t;
    };
    RIPEMD160.prototype._digest = function() {
      this._block[this._blockOffset++] = 128;
      if (this._blockOffset > 56) {
        this._block.fill(0, this._blockOffset, 64);
        this._update();
        this._blockOffset = 0;
      }
      this._block.fill(0, this._blockOffset, 56);
      this._block.writeUInt32LE(this._length[0], 56);
      this._block.writeUInt32LE(this._length[1], 60);
      this._update();
      var buffer = Buffer4.alloc ? Buffer4.alloc(20) : new Buffer4(20);
      buffer.writeInt32LE(this._a, 0);
      buffer.writeInt32LE(this._b, 4);
      buffer.writeInt32LE(this._c, 8);
      buffer.writeInt32LE(this._d, 12);
      buffer.writeInt32LE(this._e, 16);
      return buffer;
    };
    function rotl(x, n) {
      return x << n | x >>> 32 - n;
    }
    function fn1(a, b, c, d, e, m, k, s) {
      return rotl(a + (b ^ c ^ d) + m + k | 0, s) + e | 0;
    }
    function fn2(a, b, c, d, e, m, k, s) {
      return rotl(a + (b & c | ~b & d) + m + k | 0, s) + e | 0;
    }
    function fn3(a, b, c, d, e, m, k, s) {
      return rotl(a + ((b | ~c) ^ d) + m + k | 0, s) + e | 0;
    }
    function fn4(a, b, c, d, e, m, k, s) {
      return rotl(a + (b & d | c & ~d) + m + k | 0, s) + e | 0;
    }
    function fn5(a, b, c, d, e, m, k, s) {
      return rotl(a + (b ^ (c | ~d)) + m + k | 0, s) + e | 0;
    }
    module.exports = RIPEMD160;
  }
});

// ../node_modules/sha.js/hash.js
var require_hash = __commonJS({
  "../node_modules/sha.js/hash.js"(exports, module) {
    init_node_globals();
    var Buffer4 = require_safe_buffer().Buffer;
    function Hash(blockSize, finalSize) {
      this._block = Buffer4.alloc(blockSize);
      this._finalSize = finalSize;
      this._blockSize = blockSize;
      this._len = 0;
    }
    Hash.prototype.update = function(data, enc) {
      if (typeof data === "string") {
        enc = enc || "utf8";
        data = Buffer4.from(data, enc);
      }
      var block = this._block;
      var blockSize = this._blockSize;
      var length = data.length;
      var accum = this._len;
      for (var offset = 0; offset < length; ) {
        var assigned = accum % blockSize;
        var remainder = Math.min(length - offset, blockSize - assigned);
        for (var i = 0; i < remainder; i++) {
          block[assigned + i] = data[offset + i];
        }
        accum += remainder;
        offset += remainder;
        if (accum % blockSize === 0) {
          this._update(block);
        }
      }
      this._len += length;
      return this;
    };
    Hash.prototype.digest = function(enc) {
      var rem = this._len % this._blockSize;
      this._block[rem] = 128;
      this._block.fill(0, rem + 1);
      if (rem >= this._finalSize) {
        this._update(this._block);
        this._block.fill(0);
      }
      var bits = this._len * 8;
      if (bits <= 4294967295) {
        this._block.writeUInt32BE(bits, this._blockSize - 4);
      } else {
        var lowBits = (bits & 4294967295) >>> 0;
        var highBits = (bits - lowBits) / 4294967296;
        this._block.writeUInt32BE(highBits, this._blockSize - 8);
        this._block.writeUInt32BE(lowBits, this._blockSize - 4);
      }
      this._update(this._block);
      var hash = this._hash();
      return enc ? hash.toString(enc) : hash;
    };
    Hash.prototype._update = function() {
      throw new Error("_update must be implemented by subclass");
    };
    module.exports = Hash;
  }
});

// ../node_modules/sha.js/sha.js
var require_sha = __commonJS({
  "../node_modules/sha.js/sha.js"(exports, module) {
    init_node_globals();
    var inherits2 = require_inherits_browser();
    var Hash = require_hash();
    var Buffer4 = require_safe_buffer().Buffer;
    var K = [
      1518500249,
      1859775393,
      2400959708 | 0,
      3395469782 | 0
    ];
    var W = new Array(80);
    function Sha() {
      this.init();
      this._w = W;
      Hash.call(this, 64, 56);
    }
    inherits2(Sha, Hash);
    Sha.prototype.init = function() {
      this._a = 1732584193;
      this._b = 4023233417;
      this._c = 2562383102;
      this._d = 271733878;
      this._e = 3285377520;
      return this;
    };
    function rotl5(num) {
      return num << 5 | num >>> 27;
    }
    function rotl30(num) {
      return num << 30 | num >>> 2;
    }
    function ft(s, b, c, d) {
      if (s === 0)
        return b & c | ~b & d;
      if (s === 2)
        return b & c | b & d | c & d;
      return b ^ c ^ d;
    }
    Sha.prototype._update = function(M) {
      var W2 = this._w;
      var a = this._a | 0;
      var b = this._b | 0;
      var c = this._c | 0;
      var d = this._d | 0;
      var e = this._e | 0;
      for (var i = 0; i < 16; ++i)
        W2[i] = M.readInt32BE(i * 4);
      for (; i < 80; ++i)
        W2[i] = W2[i - 3] ^ W2[i - 8] ^ W2[i - 14] ^ W2[i - 16];
      for (var j = 0; j < 80; ++j) {
        var s = ~~(j / 20);
        var t = rotl5(a) + ft(s, b, c, d) + e + W2[j] + K[s] | 0;
        e = d;
        d = c;
        c = rotl30(b);
        b = a;
        a = t;
      }
      this._a = a + this._a | 0;
      this._b = b + this._b | 0;
      this._c = c + this._c | 0;
      this._d = d + this._d | 0;
      this._e = e + this._e | 0;
    };
    Sha.prototype._hash = function() {
      var H = Buffer4.allocUnsafe(20);
      H.writeInt32BE(this._a | 0, 0);
      H.writeInt32BE(this._b | 0, 4);
      H.writeInt32BE(this._c | 0, 8);
      H.writeInt32BE(this._d | 0, 12);
      H.writeInt32BE(this._e | 0, 16);
      return H;
    };
    module.exports = Sha;
  }
});

// ../node_modules/sha.js/sha1.js
var require_sha1 = __commonJS({
  "../node_modules/sha.js/sha1.js"(exports, module) {
    init_node_globals();
    var inherits2 = require_inherits_browser();
    var Hash = require_hash();
    var Buffer4 = require_safe_buffer().Buffer;
    var K = [
      1518500249,
      1859775393,
      2400959708 | 0,
      3395469782 | 0
    ];
    var W = new Array(80);
    function Sha1() {
      this.init();
      this._w = W;
      Hash.call(this, 64, 56);
    }
    inherits2(Sha1, Hash);
    Sha1.prototype.init = function() {
      this._a = 1732584193;
      this._b = 4023233417;
      this._c = 2562383102;
      this._d = 271733878;
      this._e = 3285377520;
      return this;
    };
    function rotl1(num) {
      return num << 1 | num >>> 31;
    }
    function rotl5(num) {
      return num << 5 | num >>> 27;
    }
    function rotl30(num) {
      return num << 30 | num >>> 2;
    }
    function ft(s, b, c, d) {
      if (s === 0)
        return b & c | ~b & d;
      if (s === 2)
        return b & c | b & d | c & d;
      return b ^ c ^ d;
    }
    Sha1.prototype._update = function(M) {
      var W2 = this._w;
      var a = this._a | 0;
      var b = this._b | 0;
      var c = this._c | 0;
      var d = this._d | 0;
      var e = this._e | 0;
      for (var i = 0; i < 16; ++i)
        W2[i] = M.readInt32BE(i * 4);
      for (; i < 80; ++i)
        W2[i] = rotl1(W2[i - 3] ^ W2[i - 8] ^ W2[i - 14] ^ W2[i - 16]);
      for (var j = 0; j < 80; ++j) {
        var s = ~~(j / 20);
        var t = rotl5(a) + ft(s, b, c, d) + e + W2[j] + K[s] | 0;
        e = d;
        d = c;
        c = rotl30(b);
        b = a;
        a = t;
      }
      this._a = a + this._a | 0;
      this._b = b + this._b | 0;
      this._c = c + this._c | 0;
      this._d = d + this._d | 0;
      this._e = e + this._e | 0;
    };
    Sha1.prototype._hash = function() {
      var H = Buffer4.allocUnsafe(20);
      H.writeInt32BE(this._a | 0, 0);
      H.writeInt32BE(this._b | 0, 4);
      H.writeInt32BE(this._c | 0, 8);
      H.writeInt32BE(this._d | 0, 12);
      H.writeInt32BE(this._e | 0, 16);
      return H;
    };
    module.exports = Sha1;
  }
});

// ../node_modules/sha.js/sha256.js
var require_sha256 = __commonJS({
  "../node_modules/sha.js/sha256.js"(exports, module) {
    init_node_globals();
    var inherits2 = require_inherits_browser();
    var Hash = require_hash();
    var Buffer4 = require_safe_buffer().Buffer;
    var K = [
      1116352408,
      1899447441,
      3049323471,
      3921009573,
      961987163,
      1508970993,
      2453635748,
      2870763221,
      3624381080,
      310598401,
      607225278,
      1426881987,
      1925078388,
      2162078206,
      2614888103,
      3248222580,
      3835390401,
      4022224774,
      264347078,
      604807628,
      770255983,
      1249150122,
      1555081692,
      1996064986,
      2554220882,
      2821834349,
      2952996808,
      3210313671,
      3336571891,
      3584528711,
      113926993,
      338241895,
      666307205,
      773529912,
      1294757372,
      1396182291,
      1695183700,
      1986661051,
      2177026350,
      2456956037,
      2730485921,
      2820302411,
      3259730800,
      3345764771,
      3516065817,
      3600352804,
      4094571909,
      275423344,
      430227734,
      506948616,
      659060556,
      883997877,
      958139571,
      1322822218,
      1537002063,
      1747873779,
      1955562222,
      2024104815,
      2227730452,
      2361852424,
      2428436474,
      2756734187,
      3204031479,
      3329325298
    ];
    var W = new Array(64);
    function Sha256() {
      this.init();
      this._w = W;
      Hash.call(this, 64, 56);
    }
    inherits2(Sha256, Hash);
    Sha256.prototype.init = function() {
      this._a = 1779033703;
      this._b = 3144134277;
      this._c = 1013904242;
      this._d = 2773480762;
      this._e = 1359893119;
      this._f = 2600822924;
      this._g = 528734635;
      this._h = 1541459225;
      return this;
    };
    function ch(x, y, z) {
      return z ^ x & (y ^ z);
    }
    function maj(x, y, z) {
      return x & y | z & (x | y);
    }
    function sigma0(x) {
      return (x >>> 2 | x << 30) ^ (x >>> 13 | x << 19) ^ (x >>> 22 | x << 10);
    }
    function sigma1(x) {
      return (x >>> 6 | x << 26) ^ (x >>> 11 | x << 21) ^ (x >>> 25 | x << 7);
    }
    function gamma0(x) {
      return (x >>> 7 | x << 25) ^ (x >>> 18 | x << 14) ^ x >>> 3;
    }
    function gamma1(x) {
      return (x >>> 17 | x << 15) ^ (x >>> 19 | x << 13) ^ x >>> 10;
    }
    Sha256.prototype._update = function(M) {
      var W2 = this._w;
      var a = this._a | 0;
      var b = this._b | 0;
      var c = this._c | 0;
      var d = this._d | 0;
      var e = this._e | 0;
      var f = this._f | 0;
      var g = this._g | 0;
      var h = this._h | 0;
      for (var i = 0; i < 16; ++i)
        W2[i] = M.readInt32BE(i * 4);
      for (; i < 64; ++i)
        W2[i] = gamma1(W2[i - 2]) + W2[i - 7] + gamma0(W2[i - 15]) + W2[i - 16] | 0;
      for (var j = 0; j < 64; ++j) {
        var T1 = h + sigma1(e) + ch(e, f, g) + K[j] + W2[j] | 0;
        var T2 = sigma0(a) + maj(a, b, c) | 0;
        h = g;
        g = f;
        f = e;
        e = d + T1 | 0;
        d = c;
        c = b;
        b = a;
        a = T1 + T2 | 0;
      }
      this._a = a + this._a | 0;
      this._b = b + this._b | 0;
      this._c = c + this._c | 0;
      this._d = d + this._d | 0;
      this._e = e + this._e | 0;
      this._f = f + this._f | 0;
      this._g = g + this._g | 0;
      this._h = h + this._h | 0;
    };
    Sha256.prototype._hash = function() {
      var H = Buffer4.allocUnsafe(32);
      H.writeInt32BE(this._a, 0);
      H.writeInt32BE(this._b, 4);
      H.writeInt32BE(this._c, 8);
      H.writeInt32BE(this._d, 12);
      H.writeInt32BE(this._e, 16);
      H.writeInt32BE(this._f, 20);
      H.writeInt32BE(this._g, 24);
      H.writeInt32BE(this._h, 28);
      return H;
    };
    module.exports = Sha256;
  }
});

// ../node_modules/sha.js/sha224.js
var require_sha224 = __commonJS({
  "../node_modules/sha.js/sha224.js"(exports, module) {
    init_node_globals();
    var inherits2 = require_inherits_browser();
    var Sha256 = require_sha256();
    var Hash = require_hash();
    var Buffer4 = require_safe_buffer().Buffer;
    var W = new Array(64);
    function Sha224() {
      this.init();
      this._w = W;
      Hash.call(this, 64, 56);
    }
    inherits2(Sha224, Sha256);
    Sha224.prototype.init = function() {
      this._a = 3238371032;
      this._b = 914150663;
      this._c = 812702999;
      this._d = 4144912697;
      this._e = 4290775857;
      this._f = 1750603025;
      this._g = 1694076839;
      this._h = 3204075428;
      return this;
    };
    Sha224.prototype._hash = function() {
      var H = Buffer4.allocUnsafe(28);
      H.writeInt32BE(this._a, 0);
      H.writeInt32BE(this._b, 4);
      H.writeInt32BE(this._c, 8);
      H.writeInt32BE(this._d, 12);
      H.writeInt32BE(this._e, 16);
      H.writeInt32BE(this._f, 20);
      H.writeInt32BE(this._g, 24);
      return H;
    };
    module.exports = Sha224;
  }
});

// ../node_modules/sha.js/sha512.js
var require_sha512 = __commonJS({
  "../node_modules/sha.js/sha512.js"(exports, module) {
    init_node_globals();
    var inherits2 = require_inherits_browser();
    var Hash = require_hash();
    var Buffer4 = require_safe_buffer().Buffer;
    var K = [
      1116352408,
      3609767458,
      1899447441,
      602891725,
      3049323471,
      3964484399,
      3921009573,
      2173295548,
      961987163,
      4081628472,
      1508970993,
      3053834265,
      2453635748,
      2937671579,
      2870763221,
      3664609560,
      3624381080,
      2734883394,
      310598401,
      1164996542,
      607225278,
      1323610764,
      1426881987,
      3590304994,
      1925078388,
      4068182383,
      2162078206,
      991336113,
      2614888103,
      633803317,
      3248222580,
      3479774868,
      3835390401,
      2666613458,
      4022224774,
      944711139,
      264347078,
      2341262773,
      604807628,
      2007800933,
      770255983,
      1495990901,
      1249150122,
      1856431235,
      1555081692,
      3175218132,
      1996064986,
      2198950837,
      2554220882,
      3999719339,
      2821834349,
      766784016,
      2952996808,
      2566594879,
      3210313671,
      3203337956,
      3336571891,
      1034457026,
      3584528711,
      2466948901,
      113926993,
      3758326383,
      338241895,
      168717936,
      666307205,
      1188179964,
      773529912,
      1546045734,
      1294757372,
      1522805485,
      1396182291,
      2643833823,
      1695183700,
      2343527390,
      1986661051,
      1014477480,
      2177026350,
      1206759142,
      2456956037,
      344077627,
      2730485921,
      1290863460,
      2820302411,
      3158454273,
      3259730800,
      3505952657,
      3345764771,
      106217008,
      3516065817,
      3606008344,
      3600352804,
      1432725776,
      4094571909,
      1467031594,
      275423344,
      851169720,
      430227734,
      3100823752,
      506948616,
      1363258195,
      659060556,
      3750685593,
      883997877,
      3785050280,
      958139571,
      3318307427,
      1322822218,
      3812723403,
      1537002063,
      2003034995,
      1747873779,
      3602036899,
      1955562222,
      1575990012,
      2024104815,
      1125592928,
      2227730452,
      2716904306,
      2361852424,
      442776044,
      2428436474,
      593698344,
      2756734187,
      3733110249,
      3204031479,
      2999351573,
      3329325298,
      3815920427,
      3391569614,
      3928383900,
      3515267271,
      566280711,
      3940187606,
      3454069534,
      4118630271,
      4000239992,
      116418474,
      1914138554,
      174292421,
      2731055270,
      289380356,
      3203993006,
      460393269,
      320620315,
      685471733,
      587496836,
      852142971,
      1086792851,
      1017036298,
      365543100,
      1126000580,
      2618297676,
      1288033470,
      3409855158,
      1501505948,
      4234509866,
      1607167915,
      987167468,
      1816402316,
      1246189591
    ];
    var W = new Array(160);
    function Sha512() {
      this.init();
      this._w = W;
      Hash.call(this, 128, 112);
    }
    inherits2(Sha512, Hash);
    Sha512.prototype.init = function() {
      this._ah = 1779033703;
      this._bh = 3144134277;
      this._ch = 1013904242;
      this._dh = 2773480762;
      this._eh = 1359893119;
      this._fh = 2600822924;
      this._gh = 528734635;
      this._hh = 1541459225;
      this._al = 4089235720;
      this._bl = 2227873595;
      this._cl = 4271175723;
      this._dl = 1595750129;
      this._el = 2917565137;
      this._fl = 725511199;
      this._gl = 4215389547;
      this._hl = 327033209;
      return this;
    };
    function Ch(x, y, z) {
      return z ^ x & (y ^ z);
    }
    function maj(x, y, z) {
      return x & y | z & (x | y);
    }
    function sigma0(x, xl) {
      return (x >>> 28 | xl << 4) ^ (xl >>> 2 | x << 30) ^ (xl >>> 7 | x << 25);
    }
    function sigma1(x, xl) {
      return (x >>> 14 | xl << 18) ^ (x >>> 18 | xl << 14) ^ (xl >>> 9 | x << 23);
    }
    function Gamma0(x, xl) {
      return (x >>> 1 | xl << 31) ^ (x >>> 8 | xl << 24) ^ x >>> 7;
    }
    function Gamma0l(x, xl) {
      return (x >>> 1 | xl << 31) ^ (x >>> 8 | xl << 24) ^ (x >>> 7 | xl << 25);
    }
    function Gamma1(x, xl) {
      return (x >>> 19 | xl << 13) ^ (xl >>> 29 | x << 3) ^ x >>> 6;
    }
    function Gamma1l(x, xl) {
      return (x >>> 19 | xl << 13) ^ (xl >>> 29 | x << 3) ^ (x >>> 6 | xl << 26);
    }
    function getCarry(a, b) {
      return a >>> 0 < b >>> 0 ? 1 : 0;
    }
    Sha512.prototype._update = function(M) {
      var W2 = this._w;
      var ah = this._ah | 0;
      var bh = this._bh | 0;
      var ch = this._ch | 0;
      var dh = this._dh | 0;
      var eh = this._eh | 0;
      var fh = this._fh | 0;
      var gh = this._gh | 0;
      var hh = this._hh | 0;
      var al = this._al | 0;
      var bl = this._bl | 0;
      var cl = this._cl | 0;
      var dl = this._dl | 0;
      var el = this._el | 0;
      var fl = this._fl | 0;
      var gl = this._gl | 0;
      var hl = this._hl | 0;
      for (var i = 0; i < 32; i += 2) {
        W2[i] = M.readInt32BE(i * 4);
        W2[i + 1] = M.readInt32BE(i * 4 + 4);
      }
      for (; i < 160; i += 2) {
        var xh = W2[i - 15 * 2];
        var xl = W2[i - 15 * 2 + 1];
        var gamma0 = Gamma0(xh, xl);
        var gamma0l = Gamma0l(xl, xh);
        xh = W2[i - 2 * 2];
        xl = W2[i - 2 * 2 + 1];
        var gamma1 = Gamma1(xh, xl);
        var gamma1l = Gamma1l(xl, xh);
        var Wi7h = W2[i - 7 * 2];
        var Wi7l = W2[i - 7 * 2 + 1];
        var Wi16h = W2[i - 16 * 2];
        var Wi16l = W2[i - 16 * 2 + 1];
        var Wil = gamma0l + Wi7l | 0;
        var Wih = gamma0 + Wi7h + getCarry(Wil, gamma0l) | 0;
        Wil = Wil + gamma1l | 0;
        Wih = Wih + gamma1 + getCarry(Wil, gamma1l) | 0;
        Wil = Wil + Wi16l | 0;
        Wih = Wih + Wi16h + getCarry(Wil, Wi16l) | 0;
        W2[i] = Wih;
        W2[i + 1] = Wil;
      }
      for (var j = 0; j < 160; j += 2) {
        Wih = W2[j];
        Wil = W2[j + 1];
        var majh = maj(ah, bh, ch);
        var majl = maj(al, bl, cl);
        var sigma0h = sigma0(ah, al);
        var sigma0l = sigma0(al, ah);
        var sigma1h = sigma1(eh, el);
        var sigma1l = sigma1(el, eh);
        var Kih = K[j];
        var Kil = K[j + 1];
        var chh = Ch(eh, fh, gh);
        var chl = Ch(el, fl, gl);
        var t1l = hl + sigma1l | 0;
        var t1h = hh + sigma1h + getCarry(t1l, hl) | 0;
        t1l = t1l + chl | 0;
        t1h = t1h + chh + getCarry(t1l, chl) | 0;
        t1l = t1l + Kil | 0;
        t1h = t1h + Kih + getCarry(t1l, Kil) | 0;
        t1l = t1l + Wil | 0;
        t1h = t1h + Wih + getCarry(t1l, Wil) | 0;
        var t2l = sigma0l + majl | 0;
        var t2h = sigma0h + majh + getCarry(t2l, sigma0l) | 0;
        hh = gh;
        hl = gl;
        gh = fh;
        gl = fl;
        fh = eh;
        fl = el;
        el = dl + t1l | 0;
        eh = dh + t1h + getCarry(el, dl) | 0;
        dh = ch;
        dl = cl;
        ch = bh;
        cl = bl;
        bh = ah;
        bl = al;
        al = t1l + t2l | 0;
        ah = t1h + t2h + getCarry(al, t1l) | 0;
      }
      this._al = this._al + al | 0;
      this._bl = this._bl + bl | 0;
      this._cl = this._cl + cl | 0;
      this._dl = this._dl + dl | 0;
      this._el = this._el + el | 0;
      this._fl = this._fl + fl | 0;
      this._gl = this._gl + gl | 0;
      this._hl = this._hl + hl | 0;
      this._ah = this._ah + ah + getCarry(this._al, al) | 0;
      this._bh = this._bh + bh + getCarry(this._bl, bl) | 0;
      this._ch = this._ch + ch + getCarry(this._cl, cl) | 0;
      this._dh = this._dh + dh + getCarry(this._dl, dl) | 0;
      this._eh = this._eh + eh + getCarry(this._el, el) | 0;
      this._fh = this._fh + fh + getCarry(this._fl, fl) | 0;
      this._gh = this._gh + gh + getCarry(this._gl, gl) | 0;
      this._hh = this._hh + hh + getCarry(this._hl, hl) | 0;
    };
    Sha512.prototype._hash = function() {
      var H = Buffer4.allocUnsafe(64);
      function writeInt64BE(h, l, offset) {
        H.writeInt32BE(h, offset);
        H.writeInt32BE(l, offset + 4);
      }
      writeInt64BE(this._ah, this._al, 0);
      writeInt64BE(this._bh, this._bl, 8);
      writeInt64BE(this._ch, this._cl, 16);
      writeInt64BE(this._dh, this._dl, 24);
      writeInt64BE(this._eh, this._el, 32);
      writeInt64BE(this._fh, this._fl, 40);
      writeInt64BE(this._gh, this._gl, 48);
      writeInt64BE(this._hh, this._hl, 56);
      return H;
    };
    module.exports = Sha512;
  }
});

// ../node_modules/sha.js/sha384.js
var require_sha384 = __commonJS({
  "../node_modules/sha.js/sha384.js"(exports, module) {
    init_node_globals();
    var inherits2 = require_inherits_browser();
    var SHA512 = require_sha512();
    var Hash = require_hash();
    var Buffer4 = require_safe_buffer().Buffer;
    var W = new Array(160);
    function Sha384() {
      this.init();
      this._w = W;
      Hash.call(this, 128, 112);
    }
    inherits2(Sha384, SHA512);
    Sha384.prototype.init = function() {
      this._ah = 3418070365;
      this._bh = 1654270250;
      this._ch = 2438529370;
      this._dh = 355462360;
      this._eh = 1731405415;
      this._fh = 2394180231;
      this._gh = 3675008525;
      this._hh = 1203062813;
      this._al = 3238371032;
      this._bl = 914150663;
      this._cl = 812702999;
      this._dl = 4144912697;
      this._el = 4290775857;
      this._fl = 1750603025;
      this._gl = 1694076839;
      this._hl = 3204075428;
      return this;
    };
    Sha384.prototype._hash = function() {
      var H = Buffer4.allocUnsafe(48);
      function writeInt64BE(h, l, offset) {
        H.writeInt32BE(h, offset);
        H.writeInt32BE(l, offset + 4);
      }
      writeInt64BE(this._ah, this._al, 0);
      writeInt64BE(this._bh, this._bl, 8);
      writeInt64BE(this._ch, this._cl, 16);
      writeInt64BE(this._dh, this._dl, 24);
      writeInt64BE(this._eh, this._el, 32);
      writeInt64BE(this._fh, this._fl, 40);
      return H;
    };
    module.exports = Sha384;
  }
});

// ../node_modules/sha.js/index.js
var require_sha2 = __commonJS({
  "../node_modules/sha.js/index.js"(exports, module) {
    init_node_globals();
    var exports = module.exports = function SHA(algorithm) {
      algorithm = algorithm.toLowerCase();
      var Algorithm = exports[algorithm];
      if (!Algorithm)
        throw new Error(algorithm + " is not supported (we accept pull requests)");
      return new Algorithm();
    };
    exports.sha = require_sha();
    exports.sha1 = require_sha1();
    exports.sha224 = require_sha224();
    exports.sha256 = require_sha256();
    exports.sha384 = require_sha384();
    exports.sha512 = require_sha512();
  }
});

// ../node_modules/rollup-plugin-node-polyfills/polyfills/readable-stream/buffer-list.js
function BufferList() {
  this.head = null;
  this.tail = null;
  this.length = 0;
}
var buffer_list_default;
var init_buffer_list = __esm({
  "../node_modules/rollup-plugin-node-polyfills/polyfills/readable-stream/buffer-list.js"() {
    init_node_globals();
    init_buffer();
    buffer_list_default = BufferList;
    BufferList.prototype.push = function(v) {
      var entry = { data: v, next: null };
      if (this.length > 0)
        this.tail.next = entry;
      else
        this.head = entry;
      this.tail = entry;
      ++this.length;
    };
    BufferList.prototype.unshift = function(v) {
      var entry = { data: v, next: this.head };
      if (this.length === 0)
        this.tail = entry;
      this.head = entry;
      ++this.length;
    };
    BufferList.prototype.shift = function() {
      if (this.length === 0)
        return;
      var ret = this.head.data;
      if (this.length === 1)
        this.head = this.tail = null;
      else
        this.head = this.head.next;
      --this.length;
      return ret;
    };
    BufferList.prototype.clear = function() {
      this.head = this.tail = null;
      this.length = 0;
    };
    BufferList.prototype.join = function(s) {
      if (this.length === 0)
        return "";
      var p = this.head;
      var ret = "" + p.data;
      while (p = p.next) {
        ret += s + p.data;
      }
      return ret;
    };
    BufferList.prototype.concat = function(n) {
      if (this.length === 0)
        return Buffer2.alloc(0);
      if (this.length === 1)
        return this.head.data;
      var ret = Buffer2.allocUnsafe(n >>> 0);
      var p = this.head;
      var i = 0;
      while (p) {
        p.data.copy(ret, i);
        i += p.data.length;
        p = p.next;
      }
      return ret;
    };
  }
});

// node-modules-polyfills:string_decoder
var string_decoder_exports = {};
__export(string_decoder_exports, {
  StringDecoder: () => StringDecoder
});
function assertEncoding(encoding) {
  if (encoding && !isBufferEncoding(encoding)) {
    throw new Error("Unknown encoding: " + encoding);
  }
}
function StringDecoder(encoding) {
  this.encoding = (encoding || "utf8").toLowerCase().replace(/[-_]/, "");
  assertEncoding(encoding);
  switch (this.encoding) {
    case "utf8":
      this.surrogateSize = 3;
      break;
    case "ucs2":
    case "utf16le":
      this.surrogateSize = 2;
      this.detectIncompleteChar = utf16DetectIncompleteChar;
      break;
    case "base64":
      this.surrogateSize = 3;
      this.detectIncompleteChar = base64DetectIncompleteChar;
      break;
    default:
      this.write = passThroughWrite;
      return;
  }
  this.charBuffer = new Buffer2(6);
  this.charReceived = 0;
  this.charLength = 0;
}
function passThroughWrite(buffer) {
  return buffer.toString(this.encoding);
}
function utf16DetectIncompleteChar(buffer) {
  this.charReceived = buffer.length % 2;
  this.charLength = this.charReceived ? 2 : 0;
}
function base64DetectIncompleteChar(buffer) {
  this.charReceived = buffer.length % 3;
  this.charLength = this.charReceived ? 3 : 0;
}
var isBufferEncoding;
var init_string_decoder = __esm({
  "node-modules-polyfills:string_decoder"() {
    init_node_globals();
    init_buffer();
    isBufferEncoding = Buffer2.isEncoding || function(encoding) {
      switch (encoding && encoding.toLowerCase()) {
        case "hex":
        case "utf8":
        case "utf-8":
        case "ascii":
        case "binary":
        case "base64":
        case "ucs2":
        case "ucs-2":
        case "utf16le":
        case "utf-16le":
        case "raw":
          return true;
        default:
          return false;
      }
    };
    StringDecoder.prototype.write = function(buffer) {
      var charStr = "";
      while (this.charLength) {
        var available = buffer.length >= this.charLength - this.charReceived ? this.charLength - this.charReceived : buffer.length;
        buffer.copy(this.charBuffer, this.charReceived, 0, available);
        this.charReceived += available;
        if (this.charReceived < this.charLength) {
          return "";
        }
        buffer = buffer.slice(available, buffer.length);
        charStr = this.charBuffer.slice(0, this.charLength).toString(this.encoding);
        var charCode = charStr.charCodeAt(charStr.length - 1);
        if (charCode >= 55296 && charCode <= 56319) {
          this.charLength += this.surrogateSize;
          charStr = "";
          continue;
        }
        this.charReceived = this.charLength = 0;
        if (buffer.length === 0) {
          return charStr;
        }
        break;
      }
      this.detectIncompleteChar(buffer);
      var end = buffer.length;
      if (this.charLength) {
        buffer.copy(this.charBuffer, 0, buffer.length - this.charReceived, end);
        end -= this.charReceived;
      }
      charStr += buffer.toString(this.encoding, 0, end);
      var end = charStr.length - 1;
      var charCode = charStr.charCodeAt(end);
      if (charCode >= 55296 && charCode <= 56319) {
        var size = this.surrogateSize;
        this.charLength += size;
        this.charReceived += size;
        this.charBuffer.copy(this.charBuffer, size, 0, size);
        buffer.copy(this.charBuffer, 0, 0, size);
        return charStr.substring(0, end);
      }
      return charStr;
    };
    StringDecoder.prototype.detectIncompleteChar = function(buffer) {
      var i = buffer.length >= 3 ? 3 : buffer.length;
      for (; i > 0; i--) {
        var c = buffer[buffer.length - i];
        if (i == 1 && c >> 5 == 6) {
          this.charLength = 2;
          break;
        }
        if (i <= 2 && c >> 4 == 14) {
          this.charLength = 3;
          break;
        }
        if (i <= 3 && c >> 3 == 30) {
          this.charLength = 4;
          break;
        }
      }
      this.charReceived = i;
    };
    StringDecoder.prototype.end = function(buffer) {
      var res = "";
      if (buffer && buffer.length)
        res = this.write(buffer);
      if (this.charReceived) {
        var cr = this.charReceived;
        var buf = this.charBuffer;
        var enc = this.encoding;
        res += buf.slice(0, cr).toString(enc);
      }
      return res;
    };
  }
});

// ../node_modules/rollup-plugin-node-polyfills/polyfills/readable-stream/readable.js
function prependListener2(emitter, event, fn) {
  if (typeof emitter.prependListener === "function") {
    return emitter.prependListener(event, fn);
  } else {
    if (!emitter._events || !emitter._events[event])
      emitter.on(event, fn);
    else if (Array.isArray(emitter._events[event]))
      emitter._events[event].unshift(fn);
    else
      emitter._events[event] = [fn, emitter._events[event]];
  }
}
function listenerCount2(emitter, type) {
  return emitter.listeners(type).length;
}
function ReadableState(options, stream) {
  options = options || {};
  this.objectMode = !!options.objectMode;
  if (stream instanceof Duplex)
    this.objectMode = this.objectMode || !!options.readableObjectMode;
  var hwm = options.highWaterMark;
  var defaultHwm = this.objectMode ? 16 : 16 * 1024;
  this.highWaterMark = hwm || hwm === 0 ? hwm : defaultHwm;
  this.highWaterMark = ~~this.highWaterMark;
  this.buffer = new buffer_list_default();
  this.length = 0;
  this.pipes = null;
  this.pipesCount = 0;
  this.flowing = null;
  this.ended = false;
  this.endEmitted = false;
  this.reading = false;
  this.sync = true;
  this.needReadable = false;
  this.emittedReadable = false;
  this.readableListening = false;
  this.resumeScheduled = false;
  this.defaultEncoding = options.defaultEncoding || "utf8";
  this.ranOut = false;
  this.awaitDrain = 0;
  this.readingMore = false;
  this.decoder = null;
  this.encoding = null;
  if (options.encoding) {
    this.decoder = new StringDecoder(options.encoding);
    this.encoding = options.encoding;
  }
}
function Readable(options) {
  if (!(this instanceof Readable))
    return new Readable(options);
  this._readableState = new ReadableState(options, this);
  this.readable = true;
  if (options && typeof options.read === "function")
    this._read = options.read;
  events_default.call(this);
}
function readableAddChunk(stream, state, chunk, encoding, addToFront) {
  var er = chunkInvalid(state, chunk);
  if (er) {
    stream.emit("error", er);
  } else if (chunk === null) {
    state.reading = false;
    onEofChunk(stream, state);
  } else if (state.objectMode || chunk && chunk.length > 0) {
    if (state.ended && !addToFront) {
      var e = new Error("stream.push() after EOF");
      stream.emit("error", e);
    } else if (state.endEmitted && addToFront) {
      var _e = new Error("stream.unshift() after end event");
      stream.emit("error", _e);
    } else {
      var skipAdd;
      if (state.decoder && !addToFront && !encoding) {
        chunk = state.decoder.write(chunk);
        skipAdd = !state.objectMode && chunk.length === 0;
      }
      if (!addToFront)
        state.reading = false;
      if (!skipAdd) {
        if (state.flowing && state.length === 0 && !state.sync) {
          stream.emit("data", chunk);
          stream.read(0);
        } else {
          state.length += state.objectMode ? 1 : chunk.length;
          if (addToFront)
            state.buffer.unshift(chunk);
          else
            state.buffer.push(chunk);
          if (state.needReadable)
            emitReadable(stream);
        }
      }
      maybeReadMore(stream, state);
    }
  } else if (!addToFront) {
    state.reading = false;
  }
  return needMoreData(state);
}
function needMoreData(state) {
  return !state.ended && (state.needReadable || state.length < state.highWaterMark || state.length === 0);
}
function computeNewHighWaterMark(n) {
  if (n >= MAX_HWM) {
    n = MAX_HWM;
  } else {
    n--;
    n |= n >>> 1;
    n |= n >>> 2;
    n |= n >>> 4;
    n |= n >>> 8;
    n |= n >>> 16;
    n++;
  }
  return n;
}
function howMuchToRead(n, state) {
  if (n <= 0 || state.length === 0 && state.ended)
    return 0;
  if (state.objectMode)
    return 1;
  if (n !== n) {
    if (state.flowing && state.length)
      return state.buffer.head.data.length;
    else
      return state.length;
  }
  if (n > state.highWaterMark)
    state.highWaterMark = computeNewHighWaterMark(n);
  if (n <= state.length)
    return n;
  if (!state.ended) {
    state.needReadable = true;
    return 0;
  }
  return state.length;
}
function chunkInvalid(state, chunk) {
  var er = null;
  if (!Buffer3.isBuffer(chunk) && typeof chunk !== "string" && chunk !== null && chunk !== void 0 && !state.objectMode) {
    er = new TypeError("Invalid non-string/buffer chunk");
  }
  return er;
}
function onEofChunk(stream, state) {
  if (state.ended)
    return;
  if (state.decoder) {
    var chunk = state.decoder.end();
    if (chunk && chunk.length) {
      state.buffer.push(chunk);
      state.length += state.objectMode ? 1 : chunk.length;
    }
  }
  state.ended = true;
  emitReadable(stream);
}
function emitReadable(stream) {
  var state = stream._readableState;
  state.needReadable = false;
  if (!state.emittedReadable) {
    debug("emitReadable", state.flowing);
    state.emittedReadable = true;
    if (state.sync)
      nextTick(emitReadable_, stream);
    else
      emitReadable_(stream);
  }
}
function emitReadable_(stream) {
  debug("emit readable");
  stream.emit("readable");
  flow(stream);
}
function maybeReadMore(stream, state) {
  if (!state.readingMore) {
    state.readingMore = true;
    nextTick(maybeReadMore_, stream, state);
  }
}
function maybeReadMore_(stream, state) {
  var len = state.length;
  while (!state.reading && !state.flowing && !state.ended && state.length < state.highWaterMark) {
    debug("maybeReadMore read 0");
    stream.read(0);
    if (len === state.length)
      break;
    else
      len = state.length;
  }
  state.readingMore = false;
}
function pipeOnDrain(src) {
  return function() {
    var state = src._readableState;
    debug("pipeOnDrain", state.awaitDrain);
    if (state.awaitDrain)
      state.awaitDrain--;
    if (state.awaitDrain === 0 && src.listeners("data").length) {
      state.flowing = true;
      flow(src);
    }
  };
}
function nReadingNextTick(self2) {
  debug("readable nexttick read 0");
  self2.read(0);
}
function resume(stream, state) {
  if (!state.resumeScheduled) {
    state.resumeScheduled = true;
    nextTick(resume_, stream, state);
  }
}
function resume_(stream, state) {
  if (!state.reading) {
    debug("resume read 0");
    stream.read(0);
  }
  state.resumeScheduled = false;
  state.awaitDrain = 0;
  stream.emit("resume");
  flow(stream);
  if (state.flowing && !state.reading)
    stream.read(0);
}
function flow(stream) {
  var state = stream._readableState;
  debug("flow", state.flowing);
  while (state.flowing && stream.read() !== null) {
  }
}
function fromList(n, state) {
  if (state.length === 0)
    return null;
  var ret;
  if (state.objectMode)
    ret = state.buffer.shift();
  else if (!n || n >= state.length) {
    if (state.decoder)
      ret = state.buffer.join("");
    else if (state.buffer.length === 1)
      ret = state.buffer.head.data;
    else
      ret = state.buffer.concat(state.length);
    state.buffer.clear();
  } else {
    ret = fromListPartial(n, state.buffer, state.decoder);
  }
  return ret;
}
function fromListPartial(n, list, hasStrings) {
  var ret;
  if (n < list.head.data.length) {
    ret = list.head.data.slice(0, n);
    list.head.data = list.head.data.slice(n);
  } else if (n === list.head.data.length) {
    ret = list.shift();
  } else {
    ret = hasStrings ? copyFromBufferString(n, list) : copyFromBuffer(n, list);
  }
  return ret;
}
function copyFromBufferString(n, list) {
  var p = list.head;
  var c = 1;
  var ret = p.data;
  n -= ret.length;
  while (p = p.next) {
    var str = p.data;
    var nb = n > str.length ? str.length : n;
    if (nb === str.length)
      ret += str;
    else
      ret += str.slice(0, n);
    n -= nb;
    if (n === 0) {
      if (nb === str.length) {
        ++c;
        if (p.next)
          list.head = p.next;
        else
          list.head = list.tail = null;
      } else {
        list.head = p;
        p.data = str.slice(nb);
      }
      break;
    }
    ++c;
  }
  list.length -= c;
  return ret;
}
function copyFromBuffer(n, list) {
  var ret = Buffer3.allocUnsafe(n);
  var p = list.head;
  var c = 1;
  p.data.copy(ret);
  n -= p.data.length;
  while (p = p.next) {
    var buf = p.data;
    var nb = n > buf.length ? buf.length : n;
    buf.copy(ret, ret.length - n, 0, nb);
    n -= nb;
    if (n === 0) {
      if (nb === buf.length) {
        ++c;
        if (p.next)
          list.head = p.next;
        else
          list.head = list.tail = null;
      } else {
        list.head = p;
        p.data = buf.slice(nb);
      }
      break;
    }
    ++c;
  }
  list.length -= c;
  return ret;
}
function endReadable(stream) {
  var state = stream._readableState;
  if (state.length > 0)
    throw new Error('"endReadable()" called on non-empty stream');
  if (!state.endEmitted) {
    state.ended = true;
    nextTick(endReadableNT, state, stream);
  }
}
function endReadableNT(state, stream) {
  if (!state.endEmitted && state.length === 0) {
    state.endEmitted = true;
    stream.readable = false;
    stream.emit("end");
  }
}
function forEach(xs, f) {
  for (var i = 0, l = xs.length; i < l; i++) {
    f(xs[i], i);
  }
}
function indexOf2(xs, x) {
  for (var i = 0, l = xs.length; i < l; i++) {
    if (xs[i] === x)
      return i;
  }
  return -1;
}
var debug, MAX_HWM;
var init_readable = __esm({
  "../node_modules/rollup-plugin-node-polyfills/polyfills/readable-stream/readable.js"() {
    "use strict";
    init_node_globals();
    init_events();
    init_util();
    init_buffer_list();
    init_string_decoder();
    init_duplex();
    init_process();
    Readable.ReadableState = ReadableState;
    debug = debuglog("stream");
    inherits_default(Readable, events_default);
    Readable.prototype.push = function(chunk, encoding) {
      var state = this._readableState;
      if (!state.objectMode && typeof chunk === "string") {
        encoding = encoding || state.defaultEncoding;
        if (encoding !== state.encoding) {
          chunk = Buffer3.from(chunk, encoding);
          encoding = "";
        }
      }
      return readableAddChunk(this, state, chunk, encoding, false);
    };
    Readable.prototype.unshift = function(chunk) {
      var state = this._readableState;
      return readableAddChunk(this, state, chunk, "", true);
    };
    Readable.prototype.isPaused = function() {
      return this._readableState.flowing === false;
    };
    Readable.prototype.setEncoding = function(enc) {
      this._readableState.decoder = new StringDecoder(enc);
      this._readableState.encoding = enc;
      return this;
    };
    MAX_HWM = 8388608;
    Readable.prototype.read = function(n) {
      debug("read", n);
      n = parseInt(n, 10);
      var state = this._readableState;
      var nOrig = n;
      if (n !== 0)
        state.emittedReadable = false;
      if (n === 0 && state.needReadable && (state.length >= state.highWaterMark || state.ended)) {
        debug("read: emitReadable", state.length, state.ended);
        if (state.length === 0 && state.ended)
          endReadable(this);
        else
          emitReadable(this);
        return null;
      }
      n = howMuchToRead(n, state);
      if (n === 0 && state.ended) {
        if (state.length === 0)
          endReadable(this);
        return null;
      }
      var doRead = state.needReadable;
      debug("need readable", doRead);
      if (state.length === 0 || state.length - n < state.highWaterMark) {
        doRead = true;
        debug("length less than watermark", doRead);
      }
      if (state.ended || state.reading) {
        doRead = false;
        debug("reading or ended", doRead);
      } else if (doRead) {
        debug("do read");
        state.reading = true;
        state.sync = true;
        if (state.length === 0)
          state.needReadable = true;
        this._read(state.highWaterMark);
        state.sync = false;
        if (!state.reading)
          n = howMuchToRead(nOrig, state);
      }
      var ret;
      if (n > 0)
        ret = fromList(n, state);
      else
        ret = null;
      if (ret === null) {
        state.needReadable = true;
        n = 0;
      } else {
        state.length -= n;
      }
      if (state.length === 0) {
        if (!state.ended)
          state.needReadable = true;
        if (nOrig !== n && state.ended)
          endReadable(this);
      }
      if (ret !== null)
        this.emit("data", ret);
      return ret;
    };
    Readable.prototype._read = function(n) {
      this.emit("error", new Error("not implemented"));
    };
    Readable.prototype.pipe = function(dest, pipeOpts) {
      var src = this;
      var state = this._readableState;
      switch (state.pipesCount) {
        case 0:
          state.pipes = dest;
          break;
        case 1:
          state.pipes = [state.pipes, dest];
          break;
        default:
          state.pipes.push(dest);
          break;
      }
      state.pipesCount += 1;
      debug("pipe count=%d opts=%j", state.pipesCount, pipeOpts);
      var doEnd = !pipeOpts || pipeOpts.end !== false;
      var endFn = doEnd ? onend2 : cleanup;
      if (state.endEmitted)
        nextTick(endFn);
      else
        src.once("end", endFn);
      dest.on("unpipe", onunpipe);
      function onunpipe(readable) {
        debug("onunpipe");
        if (readable === src) {
          cleanup();
        }
      }
      function onend2() {
        debug("onend");
        dest.end();
      }
      var ondrain = pipeOnDrain(src);
      dest.on("drain", ondrain);
      var cleanedUp = false;
      function cleanup() {
        debug("cleanup");
        dest.removeListener("close", onclose);
        dest.removeListener("finish", onfinish);
        dest.removeListener("drain", ondrain);
        dest.removeListener("error", onerror);
        dest.removeListener("unpipe", onunpipe);
        src.removeListener("end", onend2);
        src.removeListener("end", cleanup);
        src.removeListener("data", ondata);
        cleanedUp = true;
        if (state.awaitDrain && (!dest._writableState || dest._writableState.needDrain))
          ondrain();
      }
      var increasedAwaitDrain = false;
      src.on("data", ondata);
      function ondata(chunk) {
        debug("ondata");
        increasedAwaitDrain = false;
        var ret = dest.write(chunk);
        if (ret === false && !increasedAwaitDrain) {
          if ((state.pipesCount === 1 && state.pipes === dest || state.pipesCount > 1 && indexOf2(state.pipes, dest) !== -1) && !cleanedUp) {
            debug("false write response, pause", src._readableState.awaitDrain);
            src._readableState.awaitDrain++;
            increasedAwaitDrain = true;
          }
          src.pause();
        }
      }
      function onerror(er) {
        debug("onerror", er);
        unpipe();
        dest.removeListener("error", onerror);
        if (listenerCount2(dest, "error") === 0)
          dest.emit("error", er);
      }
      prependListener2(dest, "error", onerror);
      function onclose() {
        dest.removeListener("finish", onfinish);
        unpipe();
      }
      dest.once("close", onclose);
      function onfinish() {
        debug("onfinish");
        dest.removeListener("close", onclose);
        unpipe();
      }
      dest.once("finish", onfinish);
      function unpipe() {
        debug("unpipe");
        src.unpipe(dest);
      }
      dest.emit("pipe", src);
      if (!state.flowing) {
        debug("pipe resume");
        src.resume();
      }
      return dest;
    };
    Readable.prototype.unpipe = function(dest) {
      var state = this._readableState;
      if (state.pipesCount === 0)
        return this;
      if (state.pipesCount === 1) {
        if (dest && dest !== state.pipes)
          return this;
        if (!dest)
          dest = state.pipes;
        state.pipes = null;
        state.pipesCount = 0;
        state.flowing = false;
        if (dest)
          dest.emit("unpipe", this);
        return this;
      }
      if (!dest) {
        var dests = state.pipes;
        var len = state.pipesCount;
        state.pipes = null;
        state.pipesCount = 0;
        state.flowing = false;
        for (var _i = 0; _i < len; _i++) {
          dests[_i].emit("unpipe", this);
        }
        return this;
      }
      var i = indexOf2(state.pipes, dest);
      if (i === -1)
        return this;
      state.pipes.splice(i, 1);
      state.pipesCount -= 1;
      if (state.pipesCount === 1)
        state.pipes = state.pipes[0];
      dest.emit("unpipe", this);
      return this;
    };
    Readable.prototype.on = function(ev, fn) {
      var res = events_default.prototype.on.call(this, ev, fn);
      if (ev === "data") {
        if (this._readableState.flowing !== false)
          this.resume();
      } else if (ev === "readable") {
        var state = this._readableState;
        if (!state.endEmitted && !state.readableListening) {
          state.readableListening = state.needReadable = true;
          state.emittedReadable = false;
          if (!state.reading) {
            nextTick(nReadingNextTick, this);
          } else if (state.length) {
            emitReadable(this, state);
          }
        }
      }
      return res;
    };
    Readable.prototype.addListener = Readable.prototype.on;
    Readable.prototype.resume = function() {
      var state = this._readableState;
      if (!state.flowing) {
        debug("resume");
        state.flowing = true;
        resume(this, state);
      }
      return this;
    };
    Readable.prototype.pause = function() {
      debug("call pause flowing=%j", this._readableState.flowing);
      if (this._readableState.flowing !== false) {
        debug("pause");
        this._readableState.flowing = false;
        this.emit("pause");
      }
      return this;
    };
    Readable.prototype.wrap = function(stream) {
      var state = this._readableState;
      var paused = false;
      var self2 = this;
      stream.on("end", function() {
        debug("wrapped end");
        if (state.decoder && !state.ended) {
          var chunk = state.decoder.end();
          if (chunk && chunk.length)
            self2.push(chunk);
        }
        self2.push(null);
      });
      stream.on("data", function(chunk) {
        debug("wrapped data");
        if (state.decoder)
          chunk = state.decoder.write(chunk);
        if (state.objectMode && (chunk === null || chunk === void 0))
          return;
        else if (!state.objectMode && (!chunk || !chunk.length))
          return;
        var ret = self2.push(chunk);
        if (!ret) {
          paused = true;
          stream.pause();
        }
      });
      for (var i in stream) {
        if (this[i] === void 0 && typeof stream[i] === "function") {
          this[i] = function(method) {
            return function() {
              return stream[method].apply(stream, arguments);
            };
          }(i);
        }
      }
      var events = ["error", "close", "destroy", "pause", "resume"];
      forEach(events, function(ev) {
        stream.on(ev, self2.emit.bind(self2, ev));
      });
      self2._read = function(n) {
        debug("wrapped _read", n);
        if (paused) {
          paused = false;
          stream.resume();
        }
      };
      return self2;
    };
    Readable._fromList = fromList;
  }
});

// ../node_modules/rollup-plugin-node-polyfills/polyfills/readable-stream/writable.js
function nop() {
}
function WriteReq(chunk, encoding, cb) {
  this.chunk = chunk;
  this.encoding = encoding;
  this.callback = cb;
  this.next = null;
}
function WritableState(options, stream) {
  Object.defineProperty(this, "buffer", {
    get: deprecate(function() {
      return this.getBuffer();
    }, "_writableState.buffer is deprecated. Use _writableState.getBuffer instead.")
  });
  options = options || {};
  this.objectMode = !!options.objectMode;
  if (stream instanceof Duplex)
    this.objectMode = this.objectMode || !!options.writableObjectMode;
  var hwm = options.highWaterMark;
  var defaultHwm = this.objectMode ? 16 : 16 * 1024;
  this.highWaterMark = hwm || hwm === 0 ? hwm : defaultHwm;
  this.highWaterMark = ~~this.highWaterMark;
  this.needDrain = false;
  this.ending = false;
  this.ended = false;
  this.finished = false;
  var noDecode = options.decodeStrings === false;
  this.decodeStrings = !noDecode;
  this.defaultEncoding = options.defaultEncoding || "utf8";
  this.length = 0;
  this.writing = false;
  this.corked = 0;
  this.sync = true;
  this.bufferProcessing = false;
  this.onwrite = function(er) {
    onwrite(stream, er);
  };
  this.writecb = null;
  this.writelen = 0;
  this.bufferedRequest = null;
  this.lastBufferedRequest = null;
  this.pendingcb = 0;
  this.prefinished = false;
  this.errorEmitted = false;
  this.bufferedRequestCount = 0;
  this.corkedRequestsFree = new CorkedRequest(this);
}
function Writable(options) {
  if (!(this instanceof Writable) && !(this instanceof Duplex))
    return new Writable(options);
  this._writableState = new WritableState(options, this);
  this.writable = true;
  if (options) {
    if (typeof options.write === "function")
      this._write = options.write;
    if (typeof options.writev === "function")
      this._writev = options.writev;
  }
  EventEmitter.call(this);
}
function writeAfterEnd(stream, cb) {
  var er = new Error("write after end");
  stream.emit("error", er);
  nextTick(cb, er);
}
function validChunk(stream, state, chunk, cb) {
  var valid = true;
  var er = false;
  if (chunk === null) {
    er = new TypeError("May not write null values to stream");
  } else if (!Buffer2.isBuffer(chunk) && typeof chunk !== "string" && chunk !== void 0 && !state.objectMode) {
    er = new TypeError("Invalid non-string/buffer chunk");
  }
  if (er) {
    stream.emit("error", er);
    nextTick(cb, er);
    valid = false;
  }
  return valid;
}
function decodeChunk(state, chunk, encoding) {
  if (!state.objectMode && state.decodeStrings !== false && typeof chunk === "string") {
    chunk = Buffer2.from(chunk, encoding);
  }
  return chunk;
}
function writeOrBuffer(stream, state, chunk, encoding, cb) {
  chunk = decodeChunk(state, chunk, encoding);
  if (Buffer2.isBuffer(chunk))
    encoding = "buffer";
  var len = state.objectMode ? 1 : chunk.length;
  state.length += len;
  var ret = state.length < state.highWaterMark;
  if (!ret)
    state.needDrain = true;
  if (state.writing || state.corked) {
    var last = state.lastBufferedRequest;
    state.lastBufferedRequest = new WriteReq(chunk, encoding, cb);
    if (last) {
      last.next = state.lastBufferedRequest;
    } else {
      state.bufferedRequest = state.lastBufferedRequest;
    }
    state.bufferedRequestCount += 1;
  } else {
    doWrite(stream, state, false, len, chunk, encoding, cb);
  }
  return ret;
}
function doWrite(stream, state, writev, len, chunk, encoding, cb) {
  state.writelen = len;
  state.writecb = cb;
  state.writing = true;
  state.sync = true;
  if (writev)
    stream._writev(chunk, state.onwrite);
  else
    stream._write(chunk, encoding, state.onwrite);
  state.sync = false;
}
function onwriteError(stream, state, sync, er, cb) {
  --state.pendingcb;
  if (sync)
    nextTick(cb, er);
  else
    cb(er);
  stream._writableState.errorEmitted = true;
  stream.emit("error", er);
}
function onwriteStateUpdate(state) {
  state.writing = false;
  state.writecb = null;
  state.length -= state.writelen;
  state.writelen = 0;
}
function onwrite(stream, er) {
  var state = stream._writableState;
  var sync = state.sync;
  var cb = state.writecb;
  onwriteStateUpdate(state);
  if (er)
    onwriteError(stream, state, sync, er, cb);
  else {
    var finished = needFinish(state);
    if (!finished && !state.corked && !state.bufferProcessing && state.bufferedRequest) {
      clearBuffer(stream, state);
    }
    if (sync) {
      nextTick(afterWrite, stream, state, finished, cb);
    } else {
      afterWrite(stream, state, finished, cb);
    }
  }
}
function afterWrite(stream, state, finished, cb) {
  if (!finished)
    onwriteDrain(stream, state);
  state.pendingcb--;
  cb();
  finishMaybe(stream, state);
}
function onwriteDrain(stream, state) {
  if (state.length === 0 && state.needDrain) {
    state.needDrain = false;
    stream.emit("drain");
  }
}
function clearBuffer(stream, state) {
  state.bufferProcessing = true;
  var entry = state.bufferedRequest;
  if (stream._writev && entry && entry.next) {
    var l = state.bufferedRequestCount;
    var buffer = new Array(l);
    var holder = state.corkedRequestsFree;
    holder.entry = entry;
    var count = 0;
    while (entry) {
      buffer[count] = entry;
      entry = entry.next;
      count += 1;
    }
    doWrite(stream, state, true, state.length, buffer, "", holder.finish);
    state.pendingcb++;
    state.lastBufferedRequest = null;
    if (holder.next) {
      state.corkedRequestsFree = holder.next;
      holder.next = null;
    } else {
      state.corkedRequestsFree = new CorkedRequest(state);
    }
  } else {
    while (entry) {
      var chunk = entry.chunk;
      var encoding = entry.encoding;
      var cb = entry.callback;
      var len = state.objectMode ? 1 : chunk.length;
      doWrite(stream, state, false, len, chunk, encoding, cb);
      entry = entry.next;
      if (state.writing) {
        break;
      }
    }
    if (entry === null)
      state.lastBufferedRequest = null;
  }
  state.bufferedRequestCount = 0;
  state.bufferedRequest = entry;
  state.bufferProcessing = false;
}
function needFinish(state) {
  return state.ending && state.length === 0 && state.bufferedRequest === null && !state.finished && !state.writing;
}
function prefinish(stream, state) {
  if (!state.prefinished) {
    state.prefinished = true;
    stream.emit("prefinish");
  }
}
function finishMaybe(stream, state) {
  var need = needFinish(state);
  if (need) {
    if (state.pendingcb === 0) {
      prefinish(stream, state);
      state.finished = true;
      stream.emit("finish");
    } else {
      prefinish(stream, state);
    }
  }
  return need;
}
function endWritable(stream, state, cb) {
  state.ending = true;
  finishMaybe(stream, state);
  if (cb) {
    if (state.finished)
      nextTick(cb);
    else
      stream.once("finish", cb);
  }
  state.ended = true;
  stream.writable = false;
}
function CorkedRequest(state) {
  var _this = this;
  this.next = null;
  this.entry = null;
  this.finish = function(err) {
    var entry = _this.entry;
    _this.entry = null;
    while (entry) {
      var cb = entry.callback;
      state.pendingcb--;
      cb(err);
      entry = entry.next;
    }
    if (state.corkedRequestsFree) {
      state.corkedRequestsFree.next = _this;
    } else {
      state.corkedRequestsFree = _this;
    }
  };
}
var init_writable = __esm({
  "../node_modules/rollup-plugin-node-polyfills/polyfills/readable-stream/writable.js"() {
    init_node_globals();
    init_util();
    init_buffer();
    init_events();
    init_duplex();
    init_process();
    Writable.WritableState = WritableState;
    inherits_default(Writable, EventEmitter);
    WritableState.prototype.getBuffer = function writableStateGetBuffer() {
      var current = this.bufferedRequest;
      var out = [];
      while (current) {
        out.push(current);
        current = current.next;
      }
      return out;
    };
    Writable.prototype.pipe = function() {
      this.emit("error", new Error("Cannot pipe, not readable"));
    };
    Writable.prototype.write = function(chunk, encoding, cb) {
      var state = this._writableState;
      var ret = false;
      if (typeof encoding === "function") {
        cb = encoding;
        encoding = null;
      }
      if (Buffer2.isBuffer(chunk))
        encoding = "buffer";
      else if (!encoding)
        encoding = state.defaultEncoding;
      if (typeof cb !== "function")
        cb = nop;
      if (state.ended)
        writeAfterEnd(this, cb);
      else if (validChunk(this, state, chunk, cb)) {
        state.pendingcb++;
        ret = writeOrBuffer(this, state, chunk, encoding, cb);
      }
      return ret;
    };
    Writable.prototype.cork = function() {
      var state = this._writableState;
      state.corked++;
    };
    Writable.prototype.uncork = function() {
      var state = this._writableState;
      if (state.corked) {
        state.corked--;
        if (!state.writing && !state.corked && !state.finished && !state.bufferProcessing && state.bufferedRequest)
          clearBuffer(this, state);
      }
    };
    Writable.prototype.setDefaultEncoding = function setDefaultEncoding(encoding) {
      if (typeof encoding === "string")
        encoding = encoding.toLowerCase();
      if (!(["hex", "utf8", "utf-8", "ascii", "binary", "base64", "ucs2", "ucs-2", "utf16le", "utf-16le", "raw"].indexOf((encoding + "").toLowerCase()) > -1))
        throw new TypeError("Unknown encoding: " + encoding);
      this._writableState.defaultEncoding = encoding;
      return this;
    };
    Writable.prototype._write = function(chunk, encoding, cb) {
      cb(new Error("not implemented"));
    };
    Writable.prototype._writev = null;
    Writable.prototype.end = function(chunk, encoding, cb) {
      var state = this._writableState;
      if (typeof chunk === "function") {
        cb = chunk;
        chunk = null;
        encoding = null;
      } else if (typeof encoding === "function") {
        cb = encoding;
        encoding = null;
      }
      if (chunk !== null && chunk !== void 0)
        this.write(chunk, encoding);
      if (state.corked) {
        state.corked = 1;
        this.uncork();
      }
      if (!state.ending && !state.finished)
        endWritable(this, state, cb);
    };
  }
});

// ../node_modules/rollup-plugin-node-polyfills/polyfills/readable-stream/duplex.js
function Duplex(options) {
  if (!(this instanceof Duplex))
    return new Duplex(options);
  Readable.call(this, options);
  Writable.call(this, options);
  if (options && options.readable === false)
    this.readable = false;
  if (options && options.writable === false)
    this.writable = false;
  this.allowHalfOpen = true;
  if (options && options.allowHalfOpen === false)
    this.allowHalfOpen = false;
  this.once("end", onend);
}
function onend() {
  if (this.allowHalfOpen || this._writableState.ended)
    return;
  nextTick(onEndNT, this);
}
function onEndNT(self2) {
  self2.end();
}
var keys, method, v;
var init_duplex = __esm({
  "../node_modules/rollup-plugin-node-polyfills/polyfills/readable-stream/duplex.js"() {
    init_node_globals();
    init_util();
    init_process();
    init_readable();
    init_writable();
    inherits_default(Duplex, Readable);
    keys = Object.keys(Writable.prototype);
    for (v = 0; v < keys.length; v++) {
      method = keys[v];
      if (!Duplex.prototype[method])
        Duplex.prototype[method] = Writable.prototype[method];
    }
  }
});

// ../node_modules/rollup-plugin-node-polyfills/polyfills/readable-stream/transform.js
function TransformState(stream) {
  this.afterTransform = function(er, data) {
    return afterTransform(stream, er, data);
  };
  this.needTransform = false;
  this.transforming = false;
  this.writecb = null;
  this.writechunk = null;
  this.writeencoding = null;
}
function afterTransform(stream, er, data) {
  var ts = stream._transformState;
  ts.transforming = false;
  var cb = ts.writecb;
  if (!cb)
    return stream.emit("error", new Error("no writecb in Transform class"));
  ts.writechunk = null;
  ts.writecb = null;
  if (data !== null && data !== void 0)
    stream.push(data);
  cb(er);
  var rs = stream._readableState;
  rs.reading = false;
  if (rs.needReadable || rs.length < rs.highWaterMark) {
    stream._read(rs.highWaterMark);
  }
}
function Transform(options) {
  if (!(this instanceof Transform))
    return new Transform(options);
  Duplex.call(this, options);
  this._transformState = new TransformState(this);
  var stream = this;
  this._readableState.needReadable = true;
  this._readableState.sync = false;
  if (options) {
    if (typeof options.transform === "function")
      this._transform = options.transform;
    if (typeof options.flush === "function")
      this._flush = options.flush;
  }
  this.once("prefinish", function() {
    if (typeof this._flush === "function")
      this._flush(function(er) {
        done(stream, er);
      });
    else
      done(stream);
  });
}
function done(stream, er) {
  if (er)
    return stream.emit("error", er);
  var ws = stream._writableState;
  var ts = stream._transformState;
  if (ws.length)
    throw new Error("Calling transform done when ws.length != 0");
  if (ts.transforming)
    throw new Error("Calling transform done when still transforming");
  return stream.push(null);
}
var init_transform = __esm({
  "../node_modules/rollup-plugin-node-polyfills/polyfills/readable-stream/transform.js"() {
    init_node_globals();
    init_duplex();
    init_util();
    inherits_default(Transform, Duplex);
    Transform.prototype.push = function(chunk, encoding) {
      this._transformState.needTransform = false;
      return Duplex.prototype.push.call(this, chunk, encoding);
    };
    Transform.prototype._transform = function(chunk, encoding, cb) {
      throw new Error("Not implemented");
    };
    Transform.prototype._write = function(chunk, encoding, cb) {
      var ts = this._transformState;
      ts.writecb = cb;
      ts.writechunk = chunk;
      ts.writeencoding = encoding;
      if (!ts.transforming) {
        var rs = this._readableState;
        if (ts.needTransform || rs.needReadable || rs.length < rs.highWaterMark)
          this._read(rs.highWaterMark);
      }
    };
    Transform.prototype._read = function(n) {
      var ts = this._transformState;
      if (ts.writechunk !== null && ts.writecb && !ts.transforming) {
        ts.transforming = true;
        this._transform(ts.writechunk, ts.writeencoding, ts.afterTransform);
      } else {
        ts.needTransform = true;
      }
    };
  }
});

// ../node_modules/rollup-plugin-node-polyfills/polyfills/readable-stream/passthrough.js
function PassThrough(options) {
  if (!(this instanceof PassThrough))
    return new PassThrough(options);
  Transform.call(this, options);
}
var init_passthrough = __esm({
  "../node_modules/rollup-plugin-node-polyfills/polyfills/readable-stream/passthrough.js"() {
    init_node_globals();
    init_transform();
    init_util();
    inherits_default(PassThrough, Transform);
    PassThrough.prototype._transform = function(chunk, encoding, cb) {
      cb(null, chunk);
    };
  }
});

// node-modules-polyfills:stream
var stream_exports = {};
__export(stream_exports, {
  Duplex: () => Duplex,
  PassThrough: () => PassThrough,
  Readable: () => Readable,
  Stream: () => Stream,
  Transform: () => Transform,
  Writable: () => Writable,
  default: () => stream_default
});
function Stream() {
  events_default.call(this);
}
var stream_default;
var init_stream = __esm({
  "node-modules-polyfills:stream"() {
    init_node_globals();
    init_events();
    init_util();
    init_duplex();
    init_readable();
    init_writable();
    init_transform();
    init_passthrough();
    inherits_default(Stream, events_default);
    Stream.Readable = Readable;
    Stream.Writable = Writable;
    Stream.Duplex = Duplex;
    Stream.Transform = Transform;
    Stream.PassThrough = PassThrough;
    Stream.Stream = Stream;
    stream_default = Stream;
    Stream.prototype.pipe = function(dest, options) {
      var source = this;
      function ondata(chunk) {
        if (dest.writable) {
          if (dest.write(chunk) === false && source.pause) {
            source.pause();
          }
        }
      }
      source.on("data", ondata);
      function ondrain() {
        if (source.readable && source.resume) {
          source.resume();
        }
      }
      dest.on("drain", ondrain);
      if (!dest._isStdio && (!options || options.end !== false)) {
        source.on("end", onend2);
        source.on("close", onclose);
      }
      var didOnEnd = false;
      function onend2() {
        if (didOnEnd)
          return;
        didOnEnd = true;
        dest.end();
      }
      function onclose() {
        if (didOnEnd)
          return;
        didOnEnd = true;
        if (typeof dest.destroy === "function")
          dest.destroy();
      }
      function onerror(er) {
        cleanup();
        if (events_default.listenerCount(this, "error") === 0) {
          throw er;
        }
      }
      source.on("error", onerror);
      dest.on("error", onerror);
      function cleanup() {
        source.removeListener("data", ondata);
        dest.removeListener("drain", ondrain);
        source.removeListener("end", onend2);
        source.removeListener("close", onclose);
        source.removeListener("error", onerror);
        dest.removeListener("error", onerror);
        source.removeListener("end", cleanup);
        source.removeListener("close", cleanup);
        dest.removeListener("close", cleanup);
      }
      source.on("end", cleanup);
      source.on("close", cleanup);
      dest.on("close", cleanup);
      dest.emit("pipe", source);
      return dest;
    };
  }
});

// node-modules-polyfills-commonjs:stream
var require_stream = __commonJS({
  "node-modules-polyfills-commonjs:stream"(exports, module) {
    init_node_globals();
    var polyfill = (init_stream(), __toCommonJS(stream_exports));
    if (polyfill && polyfill.default) {
      module.exports = polyfill.default;
      for (let k in polyfill) {
        module.exports[k] = polyfill[k];
      }
    } else if (polyfill) {
      module.exports = polyfill;
    }
  }
});

// node-modules-polyfills-commonjs:string_decoder
var require_string_decoder2 = __commonJS({
  "node-modules-polyfills-commonjs:string_decoder"(exports, module) {
    init_node_globals();
    var polyfill = (init_string_decoder(), __toCommonJS(string_decoder_exports));
    if (polyfill && polyfill.default) {
      module.exports = polyfill.default;
      for (let k in polyfill) {
        module.exports[k] = polyfill[k];
      }
    } else if (polyfill) {
      module.exports = polyfill;
    }
  }
});

// ../node_modules/cipher-base/index.js
var require_cipher_base = __commonJS({
  "../node_modules/cipher-base/index.js"(exports, module) {
    init_node_globals();
    var Buffer4 = require_safe_buffer().Buffer;
    var Transform2 = require_stream().Transform;
    var StringDecoder2 = require_string_decoder2().StringDecoder;
    var inherits2 = require_inherits_browser();
    function CipherBase(hashMode) {
      Transform2.call(this);
      this.hashMode = typeof hashMode === "string";
      if (this.hashMode) {
        this[hashMode] = this._finalOrDigest;
      } else {
        this.final = this._finalOrDigest;
      }
      if (this._final) {
        this.__final = this._final;
        this._final = null;
      }
      this._decoder = null;
      this._encoding = null;
    }
    inherits2(CipherBase, Transform2);
    CipherBase.prototype.update = function(data, inputEnc, outputEnc) {
      if (typeof data === "string") {
        data = Buffer4.from(data, inputEnc);
      }
      var outData = this._update(data);
      if (this.hashMode)
        return this;
      if (outputEnc) {
        outData = this._toString(outData, outputEnc);
      }
      return outData;
    };
    CipherBase.prototype.setAutoPadding = function() {
    };
    CipherBase.prototype.getAuthTag = function() {
      throw new Error("trying to get auth tag in unsupported state");
    };
    CipherBase.prototype.setAuthTag = function() {
      throw new Error("trying to set auth tag in unsupported state");
    };
    CipherBase.prototype.setAAD = function() {
      throw new Error("trying to set aad in unsupported state");
    };
    CipherBase.prototype._transform = function(data, _, next) {
      var err;
      try {
        if (this.hashMode) {
          this._update(data);
        } else {
          this.push(this._update(data));
        }
      } catch (e) {
        err = e;
      } finally {
        next(err);
      }
    };
    CipherBase.prototype._flush = function(done2) {
      var err;
      try {
        this.push(this.__final());
      } catch (e) {
        err = e;
      }
      done2(err);
    };
    CipherBase.prototype._finalOrDigest = function(outputEnc) {
      var outData = this.__final() || Buffer4.alloc(0);
      if (outputEnc) {
        outData = this._toString(outData, outputEnc, true);
      }
      return outData;
    };
    CipherBase.prototype._toString = function(value, enc, fin) {
      if (!this._decoder) {
        this._decoder = new StringDecoder2(enc);
        this._encoding = enc;
      }
      if (this._encoding !== enc)
        throw new Error("can't switch encodings");
      var out = this._decoder.write(value);
      if (fin) {
        out += this._decoder.end();
      }
      return out;
    };
    module.exports = CipherBase;
  }
});

// ../node_modules/create-hash/browser.js
var require_browser3 = __commonJS({
  "../node_modules/create-hash/browser.js"(exports, module) {
    "use strict";
    init_node_globals();
    var inherits2 = require_inherits_browser();
    var MD5 = require_md5();
    var RIPEMD160 = require_ripemd160();
    var sha = require_sha2();
    var Base = require_cipher_base();
    function Hash(hash) {
      Base.call(this, "digest");
      this._hash = hash;
    }
    inherits2(Hash, Base);
    Hash.prototype._update = function(data) {
      this._hash.update(data);
    };
    Hash.prototype._final = function() {
      return this._hash.digest();
    };
    module.exports = function createHash(alg) {
      alg = alg.toLowerCase();
      if (alg === "md5")
        return new MD5();
      if (alg === "rmd160" || alg === "ripemd160")
        return new RIPEMD160();
      return new Hash(sha(alg));
    };
  }
});

// ../node_modules/pbkdf2/lib/precondition.js
var require_precondition = __commonJS({
  "../node_modules/pbkdf2/lib/precondition.js"(exports, module) {
    init_node_globals();
    var MAX_ALLOC = Math.pow(2, 30) - 1;
    module.exports = function(iterations, keylen) {
      if (typeof iterations !== "number") {
        throw new TypeError("Iterations not a number");
      }
      if (iterations < 0) {
        throw new TypeError("Bad iterations");
      }
      if (typeof keylen !== "number") {
        throw new TypeError("Key length not a number");
      }
      if (keylen < 0 || keylen > MAX_ALLOC || keylen !== keylen) {
        throw new TypeError("Bad key length");
      }
    };
  }
});

// ../node_modules/pbkdf2/lib/default-encoding.js
var require_default_encoding = __commonJS({
  "../node_modules/pbkdf2/lib/default-encoding.js"(exports, module) {
    init_node_globals();
    var defaultEncoding;
    if (globalThis.process && globalThis.process.browser) {
      defaultEncoding = "utf-8";
    } else if (globalThis.process && globalThis.process.version) {
      pVersionMajor = parseInt(process.version.split(".")[0].slice(1), 10);
      defaultEncoding = pVersionMajor >= 6 ? "utf-8" : "binary";
    } else {
      defaultEncoding = "utf-8";
    }
    var pVersionMajor;
    module.exports = defaultEncoding;
  }
});

// ../node_modules/create-hash/md5.js
var require_md52 = __commonJS({
  "../node_modules/create-hash/md5.js"(exports, module) {
    init_node_globals();
    var MD5 = require_md5();
    module.exports = function(buffer) {
      return new MD5().update(buffer).digest();
    };
  }
});

// ../node_modules/pbkdf2/lib/to-buffer.js
var require_to_buffer = __commonJS({
  "../node_modules/pbkdf2/lib/to-buffer.js"(exports, module) {
    init_node_globals();
    var Buffer4 = require_safe_buffer().Buffer;
    module.exports = function(thing, encoding, name) {
      if (Buffer4.isBuffer(thing)) {
        return thing;
      } else if (typeof thing === "string") {
        return Buffer4.from(thing, encoding);
      } else if (ArrayBuffer.isView(thing)) {
        return Buffer4.from(thing.buffer);
      } else {
        throw new TypeError(name + " must be a string, a Buffer, a typed array or a DataView");
      }
    };
  }
});

// ../node_modules/pbkdf2/lib/sync-browser.js
var require_sync_browser = __commonJS({
  "../node_modules/pbkdf2/lib/sync-browser.js"(exports, module) {
    init_node_globals();
    var md5 = require_md52();
    var RIPEMD160 = require_ripemd160();
    var sha = require_sha2();
    var Buffer4 = require_safe_buffer().Buffer;
    var checkParameters = require_precondition();
    var defaultEncoding = require_default_encoding();
    var toBuffer = require_to_buffer();
    var ZEROS = Buffer4.alloc(128);
    var sizes = {
      md5: 16,
      sha1: 20,
      sha224: 28,
      sha256: 32,
      sha384: 48,
      sha512: 64,
      rmd160: 20,
      ripemd160: 20
    };
    function Hmac(alg, key, saltLen) {
      var hash = getDigest(alg);
      var blocksize = alg === "sha512" || alg === "sha384" ? 128 : 64;
      if (key.length > blocksize) {
        key = hash(key);
      } else if (key.length < blocksize) {
        key = Buffer4.concat([key, ZEROS], blocksize);
      }
      var ipad = Buffer4.allocUnsafe(blocksize + sizes[alg]);
      var opad = Buffer4.allocUnsafe(blocksize + sizes[alg]);
      for (var i = 0; i < blocksize; i++) {
        ipad[i] = key[i] ^ 54;
        opad[i] = key[i] ^ 92;
      }
      var ipad1 = Buffer4.allocUnsafe(blocksize + saltLen + 4);
      ipad.copy(ipad1, 0, 0, blocksize);
      this.ipad1 = ipad1;
      this.ipad2 = ipad;
      this.opad = opad;
      this.alg = alg;
      this.blocksize = blocksize;
      this.hash = hash;
      this.size = sizes[alg];
    }
    Hmac.prototype.run = function(data, ipad) {
      data.copy(ipad, this.blocksize);
      var h = this.hash(ipad);
      h.copy(this.opad, this.blocksize);
      return this.hash(this.opad);
    };
    function getDigest(alg) {
      function shaFunc(data) {
        return sha(alg).update(data).digest();
      }
      function rmd160Func(data) {
        return new RIPEMD160().update(data).digest();
      }
      if (alg === "rmd160" || alg === "ripemd160")
        return rmd160Func;
      if (alg === "md5")
        return md5;
      return shaFunc;
    }
    function pbkdf2(password, salt, iterations, keylen, digest) {
      checkParameters(iterations, keylen);
      password = toBuffer(password, defaultEncoding, "Password");
      salt = toBuffer(salt, defaultEncoding, "Salt");
      digest = digest || "sha1";
      var hmac = new Hmac(digest, password, salt.length);
      var DK = Buffer4.allocUnsafe(keylen);
      var block1 = Buffer4.allocUnsafe(salt.length + 4);
      salt.copy(block1, 0, 0, salt.length);
      var destPos = 0;
      var hLen = sizes[digest];
      var l = Math.ceil(keylen / hLen);
      for (var i = 1; i <= l; i++) {
        block1.writeUInt32BE(i, salt.length);
        var T = hmac.run(block1, hmac.ipad1);
        var U = T;
        for (var j = 1; j < iterations; j++) {
          U = hmac.run(U, hmac.ipad2);
          for (var k = 0; k < hLen; k++)
            T[k] ^= U[k];
        }
        T.copy(DK, destPos);
        destPos += hLen;
      }
      return DK;
    }
    module.exports = pbkdf2;
  }
});

// ../node_modules/pbkdf2/lib/async.js
var require_async = __commonJS({
  "../node_modules/pbkdf2/lib/async.js"(exports, module) {
    init_node_globals();
    var Buffer4 = require_safe_buffer().Buffer;
    var checkParameters = require_precondition();
    var defaultEncoding = require_default_encoding();
    var sync = require_sync_browser();
    var toBuffer = require_to_buffer();
    var ZERO_BUF;
    var subtle = globalThis.crypto && globalThis.crypto.subtle;
    var toBrowser = {
      sha: "SHA-1",
      "sha-1": "SHA-1",
      sha1: "SHA-1",
      sha256: "SHA-256",
      "sha-256": "SHA-256",
      sha384: "SHA-384",
      "sha-384": "SHA-384",
      "sha-512": "SHA-512",
      sha512: "SHA-512"
    };
    var checks = [];
    function checkNative(algo) {
      if (globalThis.process && !globalThis.process.browser) {
        return Promise.resolve(false);
      }
      if (!subtle || !subtle.importKey || !subtle.deriveBits) {
        return Promise.resolve(false);
      }
      if (checks[algo] !== void 0) {
        return checks[algo];
      }
      ZERO_BUF = ZERO_BUF || Buffer4.alloc(8);
      var prom = browserPbkdf2(ZERO_BUF, ZERO_BUF, 10, 128, algo).then(function() {
        return true;
      }).catch(function() {
        return false;
      });
      checks[algo] = prom;
      return prom;
    }
    var nextTick2;
    function getNextTick() {
      if (nextTick2) {
        return nextTick2;
      }
      if (globalThis.process && globalThis.process.nextTick) {
        nextTick2 = globalThis.process.nextTick;
      } else if (globalThis.queueMicrotask) {
        nextTick2 = globalThis.queueMicrotask;
      } else if (globalThis.setImmediate) {
        nextTick2 = globalThis.setImmediate;
      } else {
        nextTick2 = globalThis.setTimeout;
      }
      return nextTick2;
    }
    function browserPbkdf2(password, salt, iterations, length, algo) {
      return subtle.importKey("raw", password, { name: "PBKDF2" }, false, ["deriveBits"]).then(function(key) {
        return subtle.deriveBits({
          name: "PBKDF2",
          salt,
          iterations,
          hash: {
            name: algo
          }
        }, key, length << 3);
      }).then(function(res) {
        return Buffer4.from(res);
      });
    }
    function resolvePromise(promise, callback) {
      promise.then(function(out) {
        getNextTick()(function() {
          callback(null, out);
        });
      }, function(e) {
        getNextTick()(function() {
          callback(e);
        });
      });
    }
    module.exports = function(password, salt, iterations, keylen, digest, callback) {
      if (typeof digest === "function") {
        callback = digest;
        digest = void 0;
      }
      digest = digest || "sha1";
      var algo = toBrowser[digest.toLowerCase()];
      if (!algo || typeof globalThis.Promise !== "function") {
        getNextTick()(function() {
          var out;
          try {
            out = sync(password, salt, iterations, keylen, digest);
          } catch (e) {
            return callback(e);
          }
          callback(null, out);
        });
        return;
      }
      checkParameters(iterations, keylen);
      password = toBuffer(password, defaultEncoding, "Password");
      salt = toBuffer(salt, defaultEncoding, "Salt");
      if (typeof callback !== "function")
        throw new Error("No callback provided to pbkdf2");
      resolvePromise(checkNative(algo).then(function(resp) {
        if (resp)
          return browserPbkdf2(password, salt, iterations, keylen, algo);
        return sync(password, salt, iterations, keylen, digest);
      }), callback);
    };
  }
});

// ../node_modules/pbkdf2/browser.js
var require_browser4 = __commonJS({
  "../node_modules/pbkdf2/browser.js"(exports) {
    init_node_globals();
    exports.pbkdf2 = require_async();
    exports.pbkdf2Sync = require_sync_browser();
  }
});

// ../node_modules/randombytes/browser.js
var require_browser5 = __commonJS({
  "../node_modules/randombytes/browser.js"(exports, module) {
    "use strict";
    init_node_globals();
    var MAX_BYTES = 65536;
    var MAX_UINT32 = 4294967295;
    function oldBrowser() {
      throw new Error("Secure random number generation is not supported by this browser.\nUse Chrome, Firefox or Internet Explorer 11");
    }
    var Buffer4 = require_safe_buffer().Buffer;
    var crypto = globalThis.crypto || globalThis.msCrypto;
    if (crypto && crypto.getRandomValues) {
      module.exports = randomBytes;
    } else {
      module.exports = oldBrowser;
    }
    function randomBytes(size, cb) {
      if (size > MAX_UINT32)
        throw new RangeError("requested too many random bytes");
      var bytes = Buffer4.allocUnsafe(size);
      if (size > 0) {
        if (size > MAX_BYTES) {
          for (var generated = 0; generated < size; generated += MAX_BYTES) {
            crypto.getRandomValues(bytes.slice(generated, generated + MAX_BYTES));
          }
        } else {
          crypto.getRandomValues(bytes);
        }
      }
      if (typeof cb === "function") {
        return process.nextTick(function() {
          cb(null, bytes);
        });
      }
      return bytes;
    }
  }
});

// ../node_modules/bip39/src/wordlists/czech.json
var require_czech = __commonJS({
  "../node_modules/bip39/src/wordlists/czech.json"(exports, module) {
    module.exports = [
      "abdikace",
      "abeceda",
      "adresa",
      "agrese",
      "akce",
      "aktovka",
      "alej",
      "alkohol",
      "amputace",
      "ananas",
      "andulka",
      "anekdota",
      "anketa",
      "antika",
      "anulovat",
      "archa",
      "arogance",
      "asfalt",
      "asistent",
      "aspirace",
      "astma",
      "astronom",
      "atlas",
      "atletika",
      "atol",
      "autobus",
      "azyl",
      "babka",
      "bachor",
      "bacil",
      "baculka",
      "badatel",
      "bageta",
      "bagr",
      "bahno",
      "bakterie",
      "balada",
      "baletka",
      "balkon",
      "balonek",
      "balvan",
      "balza",
      "bambus",
      "bankomat",
      "barbar",
      "baret",
      "barman",
      "baroko",
      "barva",
      "baterka",
      "batoh",
      "bavlna",
      "bazalka",
      "bazilika",
      "bazuka",
      "bedna",
      "beran",
      "beseda",
      "bestie",
      "beton",
      "bezinka",
      "bezmoc",
      "beztak",
      "bicykl",
      "bidlo",
      "biftek",
      "bikiny",
      "bilance",
      "biograf",
      "biolog",
      "bitva",
      "bizon",
      "blahobyt",
      "blatouch",
      "blecha",
      "bledule",
      "blesk",
      "blikat",
      "blizna",
      "blokovat",
      "bloudit",
      "blud",
      "bobek",
      "bobr",
      "bodlina",
      "bodnout",
      "bohatost",
      "bojkot",
      "bojovat",
      "bokorys",
      "bolest",
      "borec",
      "borovice",
      "bota",
      "boubel",
      "bouchat",
      "bouda",
      "boule",
      "bourat",
      "boxer",
      "bradavka",
      "brambora",
      "branka",
      "bratr",
      "brepta",
      "briketa",
      "brko",
      "brloh",
      "bronz",
      "broskev",
      "brunetka",
      "brusinka",
      "brzda",
      "brzy",
      "bublina",
      "bubnovat",
      "buchta",
      "buditel",
      "budka",
      "budova",
      "bufet",
      "bujarost",
      "bukvice",
      "buldok",
      "bulva",
      "bunda",
      "bunkr",
      "burza",
      "butik",
      "buvol",
      "buzola",
      "bydlet",
      "bylina",
      "bytovka",
      "bzukot",
      "capart",
      "carevna",
      "cedr",
      "cedule",
      "cejch",
      "cejn",
      "cela",
      "celer",
      "celkem",
      "celnice",
      "cenina",
      "cennost",
      "cenovka",
      "centrum",
      "cenzor",
      "cestopis",
      "cetka",
      "chalupa",
      "chapadlo",
      "charita",
      "chata",
      "chechtat",
      "chemie",
      "chichot",
      "chirurg",
      "chlad",
      "chleba",
      "chlubit",
      "chmel",
      "chmura",
      "chobot",
      "chochol",
      "chodba",
      "cholera",
      "chomout",
      "chopit",
      "choroba",
      "chov",
      "chrapot",
      "chrlit",
      "chrt",
      "chrup",
      "chtivost",
      "chudina",
      "chutnat",
      "chvat",
      "chvilka",
      "chvost",
      "chyba",
      "chystat",
      "chytit",
      "cibule",
      "cigareta",
      "cihelna",
      "cihla",
      "cinkot",
      "cirkus",
      "cisterna",
      "citace",
      "citrus",
      "cizinec",
      "cizost",
      "clona",
      "cokoliv",
      "couvat",
      "ctitel",
      "ctnost",
      "cudnost",
      "cuketa",
      "cukr",
      "cupot",
      "cvaknout",
      "cval",
      "cvik",
      "cvrkot",
      "cyklista",
      "daleko",
      "dareba",
      "datel",
      "datum",
      "dcera",
      "debata",
      "dechovka",
      "decibel",
      "deficit",
      "deflace",
      "dekl",
      "dekret",
      "demokrat",
      "deprese",
      "derby",
      "deska",
      "detektiv",
      "dikobraz",
      "diktovat",
      "dioda",
      "diplom",
      "disk",
      "displej",
      "divadlo",
      "divoch",
      "dlaha",
      "dlouho",
      "dluhopis",
      "dnes",
      "dobro",
      "dobytek",
      "docent",
      "dochutit",
      "dodnes",
      "dohled",
      "dohoda",
      "dohra",
      "dojem",
      "dojnice",
      "doklad",
      "dokola",
      "doktor",
      "dokument",
      "dolar",
      "doleva",
      "dolina",
      "doma",
      "dominant",
      "domluvit",
      "domov",
      "donutit",
      "dopad",
      "dopis",
      "doplnit",
      "doposud",
      "doprovod",
      "dopustit",
      "dorazit",
      "dorost",
      "dort",
      "dosah",
      "doslov",
      "dostatek",
      "dosud",
      "dosyta",
      "dotaz",
      "dotek",
      "dotknout",
      "doufat",
      "doutnat",
      "dovozce",
      "dozadu",
      "doznat",
      "dozorce",
      "drahota",
      "drak",
      "dramatik",
      "dravec",
      "draze",
      "drdol",
      "drobnost",
      "drogerie",
      "drozd",
      "drsnost",
      "drtit",
      "drzost",
      "duben",
      "duchovno",
      "dudek",
      "duha",
      "duhovka",
      "dusit",
      "dusno",
      "dutost",
      "dvojice",
      "dvorec",
      "dynamit",
      "ekolog",
      "ekonomie",
      "elektron",
      "elipsa",
      "email",
      "emise",
      "emoce",
      "empatie",
      "epizoda",
      "epocha",
      "epopej",
      "epos",
      "esej",
      "esence",
      "eskorta",
      "eskymo",
      "etiketa",
      "euforie",
      "evoluce",
      "exekuce",
      "exkurze",
      "expedice",
      "exploze",
      "export",
      "extrakt",
      "facka",
      "fajfka",
      "fakulta",
      "fanatik",
      "fantazie",
      "farmacie",
      "favorit",
      "fazole",
      "federace",
      "fejeton",
      "fenka",
      "fialka",
      "figurant",
      "filozof",
      "filtr",
      "finance",
      "finta",
      "fixace",
      "fjord",
      "flanel",
      "flirt",
      "flotila",
      "fond",
      "fosfor",
      "fotbal",
      "fotka",
      "foton",
      "frakce",
      "freska",
      "fronta",
      "fukar",
      "funkce",
      "fyzika",
      "galeje",
      "garant",
      "genetika",
      "geolog",
      "gilotina",
      "glazura",
      "glejt",
      "golem",
      "golfista",
      "gotika",
      "graf",
      "gramofon",
      "granule",
      "grep",
      "gril",
      "grog",
      "groteska",
      "guma",
      "hadice",
      "hadr",
      "hala",
      "halenka",
      "hanba",
      "hanopis",
      "harfa",
      "harpuna",
      "havran",
      "hebkost",
      "hejkal",
      "hejno",
      "hejtman",
      "hektar",
      "helma",
      "hematom",
      "herec",
      "herna",
      "heslo",
      "hezky",
      "historik",
      "hladovka",
      "hlasivky",
      "hlava",
      "hledat",
      "hlen",
      "hlodavec",
      "hloh",
      "hloupost",
      "hltat",
      "hlubina",
      "hluchota",
      "hmat",
      "hmota",
      "hmyz",
      "hnis",
      "hnojivo",
      "hnout",
      "hoblina",
      "hoboj",
      "hoch",
      "hodiny",
      "hodlat",
      "hodnota",
      "hodovat",
      "hojnost",
      "hokej",
      "holinka",
      "holka",
      "holub",
      "homole",
      "honitba",
      "honorace",
      "horal",
      "horda",
      "horizont",
      "horko",
      "horlivec",
      "hormon",
      "hornina",
      "horoskop",
      "horstvo",
      "hospoda",
      "hostina",
      "hotovost",
      "houba",
      "houf",
      "houpat",
      "houska",
      "hovor",
      "hradba",
      "hranice",
      "hravost",
      "hrazda",
      "hrbolek",
      "hrdina",
      "hrdlo",
      "hrdost",
      "hrnek",
      "hrobka",
      "hromada",
      "hrot",
      "hrouda",
      "hrozen",
      "hrstka",
      "hrubost",
      "hryzat",
      "hubenost",
      "hubnout",
      "hudba",
      "hukot",
      "humr",
      "husita",
      "hustota",
      "hvozd",
      "hybnost",
      "hydrant",
      "hygiena",
      "hymna",
      "hysterik",
      "idylka",
      "ihned",
      "ikona",
      "iluze",
      "imunita",
      "infekce",
      "inflace",
      "inkaso",
      "inovace",
      "inspekce",
      "internet",
      "invalida",
      "investor",
      "inzerce",
      "ironie",
      "jablko",
      "jachta",
      "jahoda",
      "jakmile",
      "jakost",
      "jalovec",
      "jantar",
      "jarmark",
      "jaro",
      "jasan",
      "jasno",
      "jatka",
      "javor",
      "jazyk",
      "jedinec",
      "jedle",
      "jednatel",
      "jehlan",
      "jekot",
      "jelen",
      "jelito",
      "jemnost",
      "jenom",
      "jepice",
      "jeseter",
      "jevit",
      "jezdec",
      "jezero",
      "jinak",
      "jindy",
      "jinoch",
      "jiskra",
      "jistota",
      "jitrnice",
      "jizva",
      "jmenovat",
      "jogurt",
      "jurta",
      "kabaret",
      "kabel",
      "kabinet",
      "kachna",
      "kadet",
      "kadidlo",
      "kahan",
      "kajak",
      "kajuta",
      "kakao",
      "kaktus",
      "kalamita",
      "kalhoty",
      "kalibr",
      "kalnost",
      "kamera",
      "kamkoliv",
      "kamna",
      "kanibal",
      "kanoe",
      "kantor",
      "kapalina",
      "kapela",
      "kapitola",
      "kapka",
      "kaple",
      "kapota",
      "kapr",
      "kapusta",
      "kapybara",
      "karamel",
      "karotka",
      "karton",
      "kasa",
      "katalog",
      "katedra",
      "kauce",
      "kauza",
      "kavalec",
      "kazajka",
      "kazeta",
      "kazivost",
      "kdekoliv",
      "kdesi",
      "kedluben",
      "kemp",
      "keramika",
      "kino",
      "klacek",
      "kladivo",
      "klam",
      "klapot",
      "klasika",
      "klaun",
      "klec",
      "klenba",
      "klepat",
      "klesnout",
      "klid",
      "klima",
      "klisna",
      "klobouk",
      "klokan",
      "klopa",
      "kloub",
      "klubovna",
      "klusat",
      "kluzkost",
      "kmen",
      "kmitat",
      "kmotr",
      "kniha",
      "knot",
      "koalice",
      "koberec",
      "kobka",
      "kobliha",
      "kobyla",
      "kocour",
      "kohout",
      "kojenec",
      "kokos",
      "koktejl",
      "kolaps",
      "koleda",
      "kolize",
      "kolo",
      "komando",
      "kometa",
      "komik",
      "komnata",
      "komora",
      "kompas",
      "komunita",
      "konat",
      "koncept",
      "kondice",
      "konec",
      "konfese",
      "kongres",
      "konina",
      "konkurs",
      "kontakt",
      "konzerva",
      "kopanec",
      "kopie",
      "kopnout",
      "koprovka",
      "korbel",
      "korektor",
      "kormidlo",
      "koroptev",
      "korpus",
      "koruna",
      "koryto",
      "korzet",
      "kosatec",
      "kostka",
      "kotel",
      "kotleta",
      "kotoul",
      "koukat",
      "koupelna",
      "kousek",
      "kouzlo",
      "kovboj",
      "koza",
      "kozoroh",
      "krabice",
      "krach",
      "krajina",
      "kralovat",
      "krasopis",
      "kravata",
      "kredit",
      "krejcar",
      "kresba",
      "kreveta",
      "kriket",
      "kritik",
      "krize",
      "krkavec",
      "krmelec",
      "krmivo",
      "krocan",
      "krok",
      "kronika",
      "kropit",
      "kroupa",
      "krovka",
      "krtek",
      "kruhadlo",
      "krupice",
      "krutost",
      "krvinka",
      "krychle",
      "krypta",
      "krystal",
      "kryt",
      "kudlanka",
      "kufr",
      "kujnost",
      "kukla",
      "kulajda",
      "kulich",
      "kulka",
      "kulomet",
      "kultura",
      "kuna",
      "kupodivu",
      "kurt",
      "kurzor",
      "kutil",
      "kvalita",
      "kvasinka",
      "kvestor",
      "kynolog",
      "kyselina",
      "kytara",
      "kytice",
      "kytka",
      "kytovec",
      "kyvadlo",
      "labrador",
      "lachtan",
      "ladnost",
      "laik",
      "lakomec",
      "lamela",
      "lampa",
      "lanovka",
      "lasice",
      "laso",
      "lastura",
      "latinka",
      "lavina",
      "lebka",
      "leckdy",
      "leden",
      "lednice",
      "ledovka",
      "ledvina",
      "legenda",
      "legie",
      "legrace",
      "lehce",
      "lehkost",
      "lehnout",
      "lektvar",
      "lenochod",
      "lentilka",
      "lepenka",
      "lepidlo",
      "letadlo",
      "letec",
      "letmo",
      "letokruh",
      "levhart",
      "levitace",
      "levobok",
      "libra",
      "lichotka",
      "lidojed",
      "lidskost",
      "lihovina",
      "lijavec",
      "lilek",
      "limetka",
      "linie",
      "linka",
      "linoleum",
      "listopad",
      "litina",
      "litovat",
      "lobista",
      "lodivod",
      "logika",
      "logoped",
      "lokalita",
      "loket",
      "lomcovat",
      "lopata",
      "lopuch",
      "lord",
      "losos",
      "lotr",
      "loudal",
      "louh",
      "louka",
      "louskat",
      "lovec",
      "lstivost",
      "lucerna",
      "lucifer",
      "lump",
      "lusk",
      "lustrace",
      "lvice",
      "lyra",
      "lyrika",
      "lysina",
      "madam",
      "madlo",
      "magistr",
      "mahagon",
      "majetek",
      "majitel",
      "majorita",
      "makak",
      "makovice",
      "makrela",
      "malba",
      "malina",
      "malovat",
      "malvice",
      "maminka",
      "mandle",
      "manko",
      "marnost",
      "masakr",
      "maskot",
      "masopust",
      "matice",
      "matrika",
      "maturita",
      "mazanec",
      "mazivo",
      "mazlit",
      "mazurka",
      "mdloba",
      "mechanik",
      "meditace",
      "medovina",
      "melasa",
      "meloun",
      "mentolka",
      "metla",
      "metoda",
      "metr",
      "mezera",
      "migrace",
      "mihnout",
      "mihule",
      "mikina",
      "mikrofon",
      "milenec",
      "milimetr",
      "milost",
      "mimika",
      "mincovna",
      "minibar",
      "minomet",
      "minulost",
      "miska",
      "mistr",
      "mixovat",
      "mladost",
      "mlha",
      "mlhovina",
      "mlok",
      "mlsat",
      "mluvit",
      "mnich",
      "mnohem",
      "mobil",
      "mocnost",
      "modelka",
      "modlitba",
      "mohyla",
      "mokro",
      "molekula",
      "momentka",
      "monarcha",
      "monokl",
      "monstrum",
      "montovat",
      "monzun",
      "mosaz",
      "moskyt",
      "most",
      "motivace",
      "motorka",
      "motyka",
      "moucha",
      "moudrost",
      "mozaika",
      "mozek",
      "mozol",
      "mramor",
      "mravenec",
      "mrkev",
      "mrtvola",
      "mrzet",
      "mrzutost",
      "mstitel",
      "mudrc",
      "muflon",
      "mulat",
      "mumie",
      "munice",
      "muset",
      "mutace",
      "muzeum",
      "muzikant",
      "myslivec",
      "mzda",
      "nabourat",
      "nachytat",
      "nadace",
      "nadbytek",
      "nadhoz",
      "nadobro",
      "nadpis",
      "nahlas",
      "nahnat",
      "nahodile",
      "nahradit",
      "naivita",
      "najednou",
      "najisto",
      "najmout",
      "naklonit",
      "nakonec",
      "nakrmit",
      "nalevo",
      "namazat",
      "namluvit",
      "nanometr",
      "naoko",
      "naopak",
      "naostro",
      "napadat",
      "napevno",
      "naplnit",
      "napnout",
      "naposled",
      "naprosto",
      "narodit",
      "naruby",
      "narychlo",
      "nasadit",
      "nasekat",
      "naslepo",
      "nastat",
      "natolik",
      "navenek",
      "navrch",
      "navzdory",
      "nazvat",
      "nebe",
      "nechat",
      "necky",
      "nedaleko",
      "nedbat",
      "neduh",
      "negace",
      "nehet",
      "nehoda",
      "nejen",
      "nejprve",
      "neklid",
      "nelibost",
      "nemilost",
      "nemoc",
      "neochota",
      "neonka",
      "nepokoj",
      "nerost",
      "nerv",
      "nesmysl",
      "nesoulad",
      "netvor",
      "neuron",
      "nevina",
      "nezvykle",
      "nicota",
      "nijak",
      "nikam",
      "nikdy",
      "nikl",
      "nikterak",
      "nitro",
      "nocleh",
      "nohavice",
      "nominace",
      "nora",
      "norek",
      "nositel",
      "nosnost",
      "nouze",
      "noviny",
      "novota",
      "nozdra",
      "nuda",
      "nudle",
      "nuget",
      "nutit",
      "nutnost",
      "nutrie",
      "nymfa",
      "obal",
      "obarvit",
      "obava",
      "obdiv",
      "obec",
      "obehnat",
      "obejmout",
      "obezita",
      "obhajoba",
      "obilnice",
      "objasnit",
      "objekt",
      "obklopit",
      "oblast",
      "oblek",
      "obliba",
      "obloha",
      "obluda",
      "obnos",
      "obohatit",
      "obojek",
      "obout",
      "obrazec",
      "obrna",
      "obruba",
      "obrys",
      "obsah",
      "obsluha",
      "obstarat",
      "obuv",
      "obvaz",
      "obvinit",
      "obvod",
      "obvykle",
      "obyvatel",
      "obzor",
      "ocas",
      "ocel",
      "ocenit",
      "ochladit",
      "ochota",
      "ochrana",
      "ocitnout",
      "odboj",
      "odbyt",
      "odchod",
      "odcizit",
      "odebrat",
      "odeslat",
      "odevzdat",
      "odezva",
      "odhadce",
      "odhodit",
      "odjet",
      "odjinud",
      "odkaz",
      "odkoupit",
      "odliv",
      "odluka",
      "odmlka",
      "odolnost",
      "odpad",
      "odpis",
      "odplout",
      "odpor",
      "odpustit",
      "odpykat",
      "odrazka",
      "odsoudit",
      "odstup",
      "odsun",
      "odtok",
      "odtud",
      "odvaha",
      "odveta",
      "odvolat",
      "odvracet",
      "odznak",
      "ofina",
      "ofsajd",
      "ohlas",
      "ohnisko",
      "ohrada",
      "ohrozit",
      "ohryzek",
      "okap",
      "okenice",
      "oklika",
      "okno",
      "okouzlit",
      "okovy",
      "okrasa",
      "okres",
      "okrsek",
      "okruh",
      "okupant",
      "okurka",
      "okusit",
      "olejnina",
      "olizovat",
      "omak",
      "omeleta",
      "omezit",
      "omladina",
      "omlouvat",
      "omluva",
      "omyl",
      "onehdy",
      "opakovat",
      "opasek",
      "operace",
      "opice",
      "opilost",
      "opisovat",
      "opora",
      "opozice",
      "opravdu",
      "oproti",
      "orbital",
      "orchestr",
      "orgie",
      "orlice",
      "orloj",
      "ortel",
      "osada",
      "oschnout",
      "osika",
      "osivo",
      "oslava",
      "oslepit",
      "oslnit",
      "oslovit",
      "osnova",
      "osoba",
      "osolit",
      "ospalec",
      "osten",
      "ostraha",
      "ostuda",
      "ostych",
      "osvojit",
      "oteplit",
      "otisk",
      "otop",
      "otrhat",
      "otrlost",
      "otrok",
      "otruby",
      "otvor",
      "ovanout",
      "ovar",
      "oves",
      "ovlivnit",
      "ovoce",
      "oxid",
      "ozdoba",
      "pachatel",
      "pacient",
      "padouch",
      "pahorek",
      "pakt",
      "palanda",
      "palec",
      "palivo",
      "paluba",
      "pamflet",
      "pamlsek",
      "panenka",
      "panika",
      "panna",
      "panovat",
      "panstvo",
      "pantofle",
      "paprika",
      "parketa",
      "parodie",
      "parta",
      "paruka",
      "paryba",
      "paseka",
      "pasivita",
      "pastelka",
      "patent",
      "patrona",
      "pavouk",
      "pazneht",
      "pazourek",
      "pecka",
      "pedagog",
      "pejsek",
      "peklo",
      "peloton",
      "penalta",
      "pendrek",
      "penze",
      "periskop",
      "pero",
      "pestrost",
      "petarda",
      "petice",
      "petrolej",
      "pevnina",
      "pexeso",
      "pianista",
      "piha",
      "pijavice",
      "pikle",
      "piknik",
      "pilina",
      "pilnost",
      "pilulka",
      "pinzeta",
      "pipeta",
      "pisatel",
      "pistole",
      "pitevna",
      "pivnice",
      "pivovar",
      "placenta",
      "plakat",
      "plamen",
      "planeta",
      "plastika",
      "platit",
      "plavidlo",
      "plaz",
      "plech",
      "plemeno",
      "plenta",
      "ples",
      "pletivo",
      "plevel",
      "plivat",
      "plnit",
      "plno",
      "plocha",
      "plodina",
      "plomba",
      "plout",
      "pluk",
      "plyn",
      "pobavit",
      "pobyt",
      "pochod",
      "pocit",
      "poctivec",
      "podat",
      "podcenit",
      "podepsat",
      "podhled",
      "podivit",
      "podklad",
      "podmanit",
      "podnik",
      "podoba",
      "podpora",
      "podraz",
      "podstata",
      "podvod",
      "podzim",
      "poezie",
      "pohanka",
      "pohnutka",
      "pohovor",
      "pohroma",
      "pohyb",
      "pointa",
      "pojistka",
      "pojmout",
      "pokazit",
      "pokles",
      "pokoj",
      "pokrok",
      "pokuta",
      "pokyn",
      "poledne",
      "polibek",
      "polknout",
      "poloha",
      "polynom",
      "pomalu",
      "pominout",
      "pomlka",
      "pomoc",
      "pomsta",
      "pomyslet",
      "ponechat",
      "ponorka",
      "ponurost",
      "popadat",
      "popel",
      "popisek",
      "poplach",
      "poprosit",
      "popsat",
      "popud",
      "poradce",
      "porce",
      "porod",
      "porucha",
      "poryv",
      "posadit",
      "posed",
      "posila",
      "poskok",
      "poslanec",
      "posoudit",
      "pospolu",
      "postava",
      "posudek",
      "posyp",
      "potah",
      "potkan",
      "potlesk",
      "potomek",
      "potrava",
      "potupa",
      "potvora",
      "poukaz",
      "pouto",
      "pouzdro",
      "povaha",
      "povidla",
      "povlak",
      "povoz",
      "povrch",
      "povstat",
      "povyk",
      "povzdech",
      "pozdrav",
      "pozemek",
      "poznatek",
      "pozor",
      "pozvat",
      "pracovat",
      "prahory",
      "praktika",
      "prales",
      "praotec",
      "praporek",
      "prase",
      "pravda",
      "princip",
      "prkno",
      "probudit",
      "procento",
      "prodej",
      "profese",
      "prohra",
      "projekt",
      "prolomit",
      "promile",
      "pronikat",
      "propad",
      "prorok",
      "prosba",
      "proton",
      "proutek",
      "provaz",
      "prskavka",
      "prsten",
      "prudkost",
      "prut",
      "prvek",
      "prvohory",
      "psanec",
      "psovod",
      "pstruh",
      "ptactvo",
      "puberta",
      "puch",
      "pudl",
      "pukavec",
      "puklina",
      "pukrle",
      "pult",
      "pumpa",
      "punc",
      "pupen",
      "pusa",
      "pusinka",
      "pustina",
      "putovat",
      "putyka",
      "pyramida",
      "pysk",
      "pytel",
      "racek",
      "rachot",
      "radiace",
      "radnice",
      "radon",
      "raft",
      "ragby",
      "raketa",
      "rakovina",
      "rameno",
      "rampouch",
      "rande",
      "rarach",
      "rarita",
      "rasovna",
      "rastr",
      "ratolest",
      "razance",
      "razidlo",
      "reagovat",
      "reakce",
      "recept",
      "redaktor",
      "referent",
      "reflex",
      "rejnok",
      "reklama",
      "rekord",
      "rekrut",
      "rektor",
      "reputace",
      "revize",
      "revma",
      "revolver",
      "rezerva",
      "riskovat",
      "riziko",
      "robotika",
      "rodokmen",
      "rohovka",
      "rokle",
      "rokoko",
      "romaneto",
      "ropovod",
      "ropucha",
      "rorejs",
      "rosol",
      "rostlina",
      "rotmistr",
      "rotoped",
      "rotunda",
      "roubenka",
      "roucho",
      "roup",
      "roura",
      "rovina",
      "rovnice",
      "rozbor",
      "rozchod",
      "rozdat",
      "rozeznat",
      "rozhodce",
      "rozinka",
      "rozjezd",
      "rozkaz",
      "rozloha",
      "rozmar",
      "rozpad",
      "rozruch",
      "rozsah",
      "roztok",
      "rozum",
      "rozvod",
      "rubrika",
      "ruchadlo",
      "rukavice",
      "rukopis",
      "ryba",
      "rybolov",
      "rychlost",
      "rydlo",
      "rypadlo",
      "rytina",
      "ryzost",
      "sadista",
      "sahat",
      "sako",
      "samec",
      "samizdat",
      "samota",
      "sanitka",
      "sardinka",
      "sasanka",
      "satelit",
      "sazba",
      "sazenice",
      "sbor",
      "schovat",
      "sebranka",
      "secese",
      "sedadlo",
      "sediment",
      "sedlo",
      "sehnat",
      "sejmout",
      "sekera",
      "sekta",
      "sekunda",
      "sekvoje",
      "semeno",
      "seno",
      "servis",
      "sesadit",
      "seshora",
      "seskok",
      "seslat",
      "sestra",
      "sesuv",
      "sesypat",
      "setba",
      "setina",
      "setkat",
      "setnout",
      "setrvat",
      "sever",
      "seznam",
      "shoda",
      "shrnout",
      "sifon",
      "silnice",
      "sirka",
      "sirotek",
      "sirup",
      "situace",
      "skafandr",
      "skalisko",
      "skanzen",
      "skaut",
      "skeptik",
      "skica",
      "skladba",
      "sklenice",
      "sklo",
      "skluz",
      "skoba",
      "skokan",
      "skoro",
      "skripta",
      "skrz",
      "skupina",
      "skvost",
      "skvrna",
      "slabika",
      "sladidlo",
      "slanina",
      "slast",
      "slavnost",
      "sledovat",
      "slepec",
      "sleva",
      "slezina",
      "slib",
      "slina",
      "sliznice",
      "slon",
      "sloupek",
      "slovo",
      "sluch",
      "sluha",
      "slunce",
      "slupka",
      "slza",
      "smaragd",
      "smetana",
      "smilstvo",
      "smlouva",
      "smog",
      "smrad",
      "smrk",
      "smrtka",
      "smutek",
      "smysl",
      "snad",
      "snaha",
      "snob",
      "sobota",
      "socha",
      "sodovka",
      "sokol",
      "sopka",
      "sotva",
      "souboj",
      "soucit",
      "soudce",
      "souhlas",
      "soulad",
      "soumrak",
      "souprava",
      "soused",
      "soutok",
      "souviset",
      "spalovna",
      "spasitel",
      "spis",
      "splav",
      "spodek",
      "spojenec",
      "spolu",
      "sponzor",
      "spornost",
      "spousta",
      "sprcha",
      "spustit",
      "sranda",
      "sraz",
      "srdce",
      "srna",
      "srnec",
      "srovnat",
      "srpen",
      "srst",
      "srub",
      "stanice",
      "starosta",
      "statika",
      "stavba",
      "stehno",
      "stezka",
      "stodola",
      "stolek",
      "stopa",
      "storno",
      "stoupat",
      "strach",
      "stres",
      "strhnout",
      "strom",
      "struna",
      "studna",
      "stupnice",
      "stvol",
      "styk",
      "subjekt",
      "subtropy",
      "suchar",
      "sudost",
      "sukno",
      "sundat",
      "sunout",
      "surikata",
      "surovina",
      "svah",
      "svalstvo",
      "svetr",
      "svatba",
      "svazek",
      "svisle",
      "svitek",
      "svoboda",
      "svodidlo",
      "svorka",
      "svrab",
      "sykavka",
      "sykot",
      "synek",
      "synovec",
      "sypat",
      "sypkost",
      "syrovost",
      "sysel",
      "sytost",
      "tabletka",
      "tabule",
      "tahoun",
      "tajemno",
      "tajfun",
      "tajga",
      "tajit",
      "tajnost",
      "taktika",
      "tamhle",
      "tampon",
      "tancovat",
      "tanec",
      "tanker",
      "tapeta",
      "tavenina",
      "tazatel",
      "technika",
      "tehdy",
      "tekutina",
      "telefon",
      "temnota",
      "tendence",
      "tenista",
      "tenor",
      "teplota",
      "tepna",
      "teprve",
      "terapie",
      "termoska",
      "textil",
      "ticho",
      "tiskopis",
      "titulek",
      "tkadlec",
      "tkanina",
      "tlapka",
      "tleskat",
      "tlukot",
      "tlupa",
      "tmel",
      "toaleta",
      "topinka",
      "topol",
      "torzo",
      "touha",
      "toulec",
      "tradice",
      "traktor",
      "tramp",
      "trasa",
      "traverza",
      "trefit",
      "trest",
      "trezor",
      "trhavina",
      "trhlina",
      "trochu",
      "trojice",
      "troska",
      "trouba",
      "trpce",
      "trpitel",
      "trpkost",
      "trubec",
      "truchlit",
      "truhlice",
      "trus",
      "trvat",
      "tudy",
      "tuhnout",
      "tuhost",
      "tundra",
      "turista",
      "turnaj",
      "tuzemsko",
      "tvaroh",
      "tvorba",
      "tvrdost",
      "tvrz",
      "tygr",
      "tykev",
      "ubohost",
      "uboze",
      "ubrat",
      "ubrousek",
      "ubrus",
      "ubytovna",
      "ucho",
      "uctivost",
      "udivit",
      "uhradit",
      "ujednat",
      "ujistit",
      "ujmout",
      "ukazatel",
      "uklidnit",
      "uklonit",
      "ukotvit",
      "ukrojit",
      "ulice",
      "ulita",
      "ulovit",
      "umyvadlo",
      "unavit",
      "uniforma",
      "uniknout",
      "upadnout",
      "uplatnit",
      "uplynout",
      "upoutat",
      "upravit",
      "uran",
      "urazit",
      "usednout",
      "usilovat",
      "usmrtit",
      "usnadnit",
      "usnout",
      "usoudit",
      "ustlat",
      "ustrnout",
      "utahovat",
      "utkat",
      "utlumit",
      "utonout",
      "utopenec",
      "utrousit",
      "uvalit",
      "uvolnit",
      "uvozovka",
      "uzdravit",
      "uzel",
      "uzenina",
      "uzlina",
      "uznat",
      "vagon",
      "valcha",
      "valoun",
      "vana",
      "vandal",
      "vanilka",
      "varan",
      "varhany",
      "varovat",
      "vcelku",
      "vchod",
      "vdova",
      "vedro",
      "vegetace",
      "vejce",
      "velbloud",
      "veletrh",
      "velitel",
      "velmoc",
      "velryba",
      "venkov",
      "veranda",
      "verze",
      "veselka",
      "veskrze",
      "vesnice",
      "vespodu",
      "vesta",
      "veterina",
      "veverka",
      "vibrace",
      "vichr",
      "videohra",
      "vidina",
      "vidle",
      "vila",
      "vinice",
      "viset",
      "vitalita",
      "vize",
      "vizitka",
      "vjezd",
      "vklad",
      "vkus",
      "vlajka",
      "vlak",
      "vlasec",
      "vlevo",
      "vlhkost",
      "vliv",
      "vlnovka",
      "vloupat",
      "vnucovat",
      "vnuk",
      "voda",
      "vodivost",
      "vodoznak",
      "vodstvo",
      "vojensky",
      "vojna",
      "vojsko",
      "volant",
      "volba",
      "volit",
      "volno",
      "voskovka",
      "vozidlo",
      "vozovna",
      "vpravo",
      "vrabec",
      "vracet",
      "vrah",
      "vrata",
      "vrba",
      "vrcholek",
      "vrhat",
      "vrstva",
      "vrtule",
      "vsadit",
      "vstoupit",
      "vstup",
      "vtip",
      "vybavit",
      "vybrat",
      "vychovat",
      "vydat",
      "vydra",
      "vyfotit",
      "vyhledat",
      "vyhnout",
      "vyhodit",
      "vyhradit",
      "vyhubit",
      "vyjasnit",
      "vyjet",
      "vyjmout",
      "vyklopit",
      "vykonat",
      "vylekat",
      "vymazat",
      "vymezit",
      "vymizet",
      "vymyslet",
      "vynechat",
      "vynikat",
      "vynutit",
      "vypadat",
      "vyplatit",
      "vypravit",
      "vypustit",
      "vyrazit",
      "vyrovnat",
      "vyrvat",
      "vyslovit",
      "vysoko",
      "vystavit",
      "vysunout",
      "vysypat",
      "vytasit",
      "vytesat",
      "vytratit",
      "vyvinout",
      "vyvolat",
      "vyvrhel",
      "vyzdobit",
      "vyznat",
      "vzadu",
      "vzbudit",
      "vzchopit",
      "vzdor",
      "vzduch",
      "vzdychat",
      "vzestup",
      "vzhledem",
      "vzkaz",
      "vzlykat",
      "vznik",
      "vzorek",
      "vzpoura",
      "vztah",
      "vztek",
      "xylofon",
      "zabrat",
      "zabydlet",
      "zachovat",
      "zadarmo",
      "zadusit",
      "zafoukat",
      "zahltit",
      "zahodit",
      "zahrada",
      "zahynout",
      "zajatec",
      "zajet",
      "zajistit",
      "zaklepat",
      "zakoupit",
      "zalepit",
      "zamezit",
      "zamotat",
      "zamyslet",
      "zanechat",
      "zanikat",
      "zaplatit",
      "zapojit",
      "zapsat",
      "zarazit",
      "zastavit",
      "zasunout",
      "zatajit",
      "zatemnit",
      "zatknout",
      "zaujmout",
      "zavalit",
      "zavelet",
      "zavinit",
      "zavolat",
      "zavrtat",
      "zazvonit",
      "zbavit",
      "zbrusu",
      "zbudovat",
      "zbytek",
      "zdaleka",
      "zdarma",
      "zdatnost",
      "zdivo",
      "zdobit",
      "zdroj",
      "zdvih",
      "zdymadlo",
      "zelenina",
      "zeman",
      "zemina",
      "zeptat",
      "zezadu",
      "zezdola",
      "zhatit",
      "zhltnout",
      "zhluboka",
      "zhotovit",
      "zhruba",
      "zima",
      "zimnice",
      "zjemnit",
      "zklamat",
      "zkoumat",
      "zkratka",
      "zkumavka",
      "zlato",
      "zlehka",
      "zloba",
      "zlom",
      "zlost",
      "zlozvyk",
      "zmapovat",
      "zmar",
      "zmatek",
      "zmije",
      "zmizet",
      "zmocnit",
      "zmodrat",
      "zmrzlina",
      "zmutovat",
      "znak",
      "znalost",
      "znamenat",
      "znovu",
      "zobrazit",
      "zotavit",
      "zoubek",
      "zoufale",
      "zplodit",
      "zpomalit",
      "zprava",
      "zprostit",
      "zprudka",
      "zprvu",
      "zrada",
      "zranit",
      "zrcadlo",
      "zrnitost",
      "zrno",
      "zrovna",
      "zrychlit",
      "zrzavost",
      "zticha",
      "ztratit",
      "zubovina",
      "zubr",
      "zvednout",
      "zvenku",
      "zvesela",
      "zvon",
      "zvrat",
      "zvukovod",
      "zvyk"
    ];
  }
});

// ../node_modules/bip39/src/wordlists/chinese_simplified.json
var require_chinese_simplified = __commonJS({
  "../node_modules/bip39/src/wordlists/chinese_simplified.json"(exports, module) {
    module.exports = [
      "\u7684",
      "\u4E00",
      "\u662F",
      "\u5728",
      "\u4E0D",
      "\u4E86",
      "\u6709",
      "\u548C",
      "\u4EBA",
      "\u8FD9",
      "\u4E2D",
      "\u5927",
      "\u4E3A",
      "\u4E0A",
      "\u4E2A",
      "\u56FD",
      "\u6211",
      "\u4EE5",
      "\u8981",
      "\u4ED6",
      "\u65F6",
      "\u6765",
      "\u7528",
      "\u4EEC",
      "\u751F",
      "\u5230",
      "\u4F5C",
      "\u5730",
      "\u4E8E",
      "\u51FA",
      "\u5C31",
      "\u5206",
      "\u5BF9",
      "\u6210",
      "\u4F1A",
      "\u53EF",
      "\u4E3B",
      "\u53D1",
      "\u5E74",
      "\u52A8",
      "\u540C",
      "\u5DE5",
      "\u4E5F",
      "\u80FD",
      "\u4E0B",
      "\u8FC7",
      "\u5B50",
      "\u8BF4",
      "\u4EA7",
      "\u79CD",
      "\u9762",
      "\u800C",
      "\u65B9",
      "\u540E",
      "\u591A",
      "\u5B9A",
      "\u884C",
      "\u5B66",
      "\u6CD5",
      "\u6240",
      "\u6C11",
      "\u5F97",
      "\u7ECF",
      "\u5341",
      "\u4E09",
      "\u4E4B",
      "\u8FDB",
      "\u7740",
      "\u7B49",
      "\u90E8",
      "\u5EA6",
      "\u5BB6",
      "\u7535",
      "\u529B",
      "\u91CC",
      "\u5982",
      "\u6C34",
      "\u5316",
      "\u9AD8",
      "\u81EA",
      "\u4E8C",
      "\u7406",
      "\u8D77",
      "\u5C0F",
      "\u7269",
      "\u73B0",
      "\u5B9E",
      "\u52A0",
      "\u91CF",
      "\u90FD",
      "\u4E24",
      "\u4F53",
      "\u5236",
      "\u673A",
      "\u5F53",
      "\u4F7F",
      "\u70B9",
      "\u4ECE",
      "\u4E1A",
      "\u672C",
      "\u53BB",
      "\u628A",
      "\u6027",
      "\u597D",
      "\u5E94",
      "\u5F00",
      "\u5B83",
      "\u5408",
      "\u8FD8",
      "\u56E0",
      "\u7531",
      "\u5176",
      "\u4E9B",
      "\u7136",
      "\u524D",
      "\u5916",
      "\u5929",
      "\u653F",
      "\u56DB",
      "\u65E5",
      "\u90A3",
      "\u793E",
      "\u4E49",
      "\u4E8B",
      "\u5E73",
      "\u5F62",
      "\u76F8",
      "\u5168",
      "\u8868",
      "\u95F4",
      "\u6837",
      "\u4E0E",
      "\u5173",
      "\u5404",
      "\u91CD",
      "\u65B0",
      "\u7EBF",
      "\u5185",
      "\u6570",
      "\u6B63",
      "\u5FC3",
      "\u53CD",
      "\u4F60",
      "\u660E",
      "\u770B",
      "\u539F",
      "\u53C8",
      "\u4E48",
      "\u5229",
      "\u6BD4",
      "\u6216",
      "\u4F46",
      "\u8D28",
      "\u6C14",
      "\u7B2C",
      "\u5411",
      "\u9053",
      "\u547D",
      "\u6B64",
      "\u53D8",
      "\u6761",
      "\u53EA",
      "\u6CA1",
      "\u7ED3",
      "\u89E3",
      "\u95EE",
      "\u610F",
      "\u5EFA",
      "\u6708",
      "\u516C",
      "\u65E0",
      "\u7CFB",
      "\u519B",
      "\u5F88",
      "\u60C5",
      "\u8005",
      "\u6700",
      "\u7ACB",
      "\u4EE3",
      "\u60F3",
      "\u5DF2",
      "\u901A",
      "\u5E76",
      "\u63D0",
      "\u76F4",
      "\u9898",
      "\u515A",
      "\u7A0B",
      "\u5C55",
      "\u4E94",
      "\u679C",
      "\u6599",
      "\u8C61",
      "\u5458",
      "\u9769",
      "\u4F4D",
      "\u5165",
      "\u5E38",
      "\u6587",
      "\u603B",
      "\u6B21",
      "\u54C1",
      "\u5F0F",
      "\u6D3B",
      "\u8BBE",
      "\u53CA",
      "\u7BA1",
      "\u7279",
      "\u4EF6",
      "\u957F",
      "\u6C42",
      "\u8001",
      "\u5934",
      "\u57FA",
      "\u8D44",
      "\u8FB9",
      "\u6D41",
      "\u8DEF",
      "\u7EA7",
      "\u5C11",
      "\u56FE",
      "\u5C71",
      "\u7EDF",
      "\u63A5",
      "\u77E5",
      "\u8F83",
      "\u5C06",
      "\u7EC4",
      "\u89C1",
      "\u8BA1",
      "\u522B",
      "\u5979",
      "\u624B",
      "\u89D2",
      "\u671F",
      "\u6839",
      "\u8BBA",
      "\u8FD0",
      "\u519C",
      "\u6307",
      "\u51E0",
      "\u4E5D",
      "\u533A",
      "\u5F3A",
      "\u653E",
      "\u51B3",
      "\u897F",
      "\u88AB",
      "\u5E72",
      "\u505A",
      "\u5FC5",
      "\u6218",
      "\u5148",
      "\u56DE",
      "\u5219",
      "\u4EFB",
      "\u53D6",
      "\u636E",
      "\u5904",
      "\u961F",
      "\u5357",
      "\u7ED9",
      "\u8272",
      "\u5149",
      "\u95E8",
      "\u5373",
      "\u4FDD",
      "\u6CBB",
      "\u5317",
      "\u9020",
      "\u767E",
      "\u89C4",
      "\u70ED",
      "\u9886",
      "\u4E03",
      "\u6D77",
      "\u53E3",
      "\u4E1C",
      "\u5BFC",
      "\u5668",
      "\u538B",
      "\u5FD7",
      "\u4E16",
      "\u91D1",
      "\u589E",
      "\u4E89",
      "\u6D4E",
      "\u9636",
      "\u6CB9",
      "\u601D",
      "\u672F",
      "\u6781",
      "\u4EA4",
      "\u53D7",
      "\u8054",
      "\u4EC0",
      "\u8BA4",
      "\u516D",
      "\u5171",
      "\u6743",
      "\u6536",
      "\u8BC1",
      "\u6539",
      "\u6E05",
      "\u7F8E",
      "\u518D",
      "\u91C7",
      "\u8F6C",
      "\u66F4",
      "\u5355",
      "\u98CE",
      "\u5207",
      "\u6253",
      "\u767D",
      "\u6559",
      "\u901F",
      "\u82B1",
      "\u5E26",
      "\u5B89",
      "\u573A",
      "\u8EAB",
      "\u8F66",
      "\u4F8B",
      "\u771F",
      "\u52A1",
      "\u5177",
      "\u4E07",
      "\u6BCF",
      "\u76EE",
      "\u81F3",
      "\u8FBE",
      "\u8D70",
      "\u79EF",
      "\u793A",
      "\u8BAE",
      "\u58F0",
      "\u62A5",
      "\u6597",
      "\u5B8C",
      "\u7C7B",
      "\u516B",
      "\u79BB",
      "\u534E",
      "\u540D",
      "\u786E",
      "\u624D",
      "\u79D1",
      "\u5F20",
      "\u4FE1",
      "\u9A6C",
      "\u8282",
      "\u8BDD",
      "\u7C73",
      "\u6574",
      "\u7A7A",
      "\u5143",
      "\u51B5",
      "\u4ECA",
      "\u96C6",
      "\u6E29",
      "\u4F20",
      "\u571F",
      "\u8BB8",
      "\u6B65",
      "\u7FA4",
      "\u5E7F",
      "\u77F3",
      "\u8BB0",
      "\u9700",
      "\u6BB5",
      "\u7814",
      "\u754C",
      "\u62C9",
      "\u6797",
      "\u5F8B",
      "\u53EB",
      "\u4E14",
      "\u7A76",
      "\u89C2",
      "\u8D8A",
      "\u7EC7",
      "\u88C5",
      "\u5F71",
      "\u7B97",
      "\u4F4E",
      "\u6301",
      "\u97F3",
      "\u4F17",
      "\u4E66",
      "\u5E03",
      "\u590D",
      "\u5BB9",
      "\u513F",
      "\u987B",
      "\u9645",
      "\u5546",
      "\u975E",
      "\u9A8C",
      "\u8FDE",
      "\u65AD",
      "\u6DF1",
      "\u96BE",
      "\u8FD1",
      "\u77FF",
      "\u5343",
      "\u5468",
      "\u59D4",
      "\u7D20",
      "\u6280",
      "\u5907",
      "\u534A",
      "\u529E",
      "\u9752",
      "\u7701",
      "\u5217",
      "\u4E60",
      "\u54CD",
      "\u7EA6",
      "\u652F",
      "\u822C",
      "\u53F2",
      "\u611F",
      "\u52B3",
      "\u4FBF",
      "\u56E2",
      "\u5F80",
      "\u9178",
      "\u5386",
      "\u5E02",
      "\u514B",
      "\u4F55",
      "\u9664",
      "\u6D88",
      "\u6784",
      "\u5E9C",
      "\u79F0",
      "\u592A",
      "\u51C6",
      "\u7CBE",
      "\u503C",
      "\u53F7",
      "\u7387",
      "\u65CF",
      "\u7EF4",
      "\u5212",
      "\u9009",
      "\u6807",
      "\u5199",
      "\u5B58",
      "\u5019",
      "\u6BDB",
      "\u4EB2",
      "\u5FEB",
      "\u6548",
      "\u65AF",
      "\u9662",
      "\u67E5",
      "\u6C5F",
      "\u578B",
      "\u773C",
      "\u738B",
      "\u6309",
      "\u683C",
      "\u517B",
      "\u6613",
      "\u7F6E",
      "\u6D3E",
      "\u5C42",
      "\u7247",
      "\u59CB",
      "\u5374",
      "\u4E13",
      "\u72B6",
      "\u80B2",
      "\u5382",
      "\u4EAC",
      "\u8BC6",
      "\u9002",
      "\u5C5E",
      "\u5706",
      "\u5305",
      "\u706B",
      "\u4F4F",
      "\u8C03",
      "\u6EE1",
      "\u53BF",
      "\u5C40",
      "\u7167",
      "\u53C2",
      "\u7EA2",
      "\u7EC6",
      "\u5F15",
      "\u542C",
      "\u8BE5",
      "\u94C1",
      "\u4EF7",
      "\u4E25",
      "\u9996",
      "\u5E95",
      "\u6DB2",
      "\u5B98",
      "\u5FB7",
      "\u968F",
      "\u75C5",
      "\u82CF",
      "\u5931",
      "\u5C14",
      "\u6B7B",
      "\u8BB2",
      "\u914D",
      "\u5973",
      "\u9EC4",
      "\u63A8",
      "\u663E",
      "\u8C08",
      "\u7F6A",
      "\u795E",
      "\u827A",
      "\u5462",
      "\u5E2D",
      "\u542B",
      "\u4F01",
      "\u671B",
      "\u5BC6",
      "\u6279",
      "\u8425",
      "\u9879",
      "\u9632",
      "\u4E3E",
      "\u7403",
      "\u82F1",
      "\u6C27",
      "\u52BF",
      "\u544A",
      "\u674E",
      "\u53F0",
      "\u843D",
      "\u6728",
      "\u5E2E",
      "\u8F6E",
      "\u7834",
      "\u4E9A",
      "\u5E08",
      "\u56F4",
      "\u6CE8",
      "\u8FDC",
      "\u5B57",
      "\u6750",
      "\u6392",
      "\u4F9B",
      "\u6CB3",
      "\u6001",
      "\u5C01",
      "\u53E6",
      "\u65BD",
      "\u51CF",
      "\u6811",
      "\u6EB6",
      "\u600E",
      "\u6B62",
      "\u6848",
      "\u8A00",
      "\u58EB",
      "\u5747",
      "\u6B66",
      "\u56FA",
      "\u53F6",
      "\u9C7C",
      "\u6CE2",
      "\u89C6",
      "\u4EC5",
      "\u8D39",
      "\u7D27",
      "\u7231",
      "\u5DE6",
      "\u7AE0",
      "\u65E9",
      "\u671D",
      "\u5BB3",
      "\u7EED",
      "\u8F7B",
      "\u670D",
      "\u8BD5",
      "\u98DF",
      "\u5145",
      "\u5175",
      "\u6E90",
      "\u5224",
      "\u62A4",
      "\u53F8",
      "\u8DB3",
      "\u67D0",
      "\u7EC3",
      "\u5DEE",
      "\u81F4",
      "\u677F",
      "\u7530",
      "\u964D",
      "\u9ED1",
      "\u72AF",
      "\u8D1F",
      "\u51FB",
      "\u8303",
      "\u7EE7",
      "\u5174",
      "\u4F3C",
      "\u4F59",
      "\u575A",
      "\u66F2",
      "\u8F93",
      "\u4FEE",
      "\u6545",
      "\u57CE",
      "\u592B",
      "\u591F",
      "\u9001",
      "\u7B14",
      "\u8239",
      "\u5360",
      "\u53F3",
      "\u8D22",
      "\u5403",
      "\u5BCC",
      "\u6625",
      "\u804C",
      "\u89C9",
      "\u6C49",
      "\u753B",
      "\u529F",
      "\u5DF4",
      "\u8DDF",
      "\u867D",
      "\u6742",
      "\u98DE",
      "\u68C0",
      "\u5438",
      "\u52A9",
      "\u5347",
      "\u9633",
      "\u4E92",
      "\u521D",
      "\u521B",
      "\u6297",
      "\u8003",
      "\u6295",
      "\u574F",
      "\u7B56",
      "\u53E4",
      "\u5F84",
      "\u6362",
      "\u672A",
      "\u8DD1",
      "\u7559",
      "\u94A2",
      "\u66FE",
      "\u7AEF",
      "\u8D23",
      "\u7AD9",
      "\u7B80",
      "\u8FF0",
      "\u94B1",
      "\u526F",
      "\u5C3D",
      "\u5E1D",
      "\u5C04",
      "\u8349",
      "\u51B2",
      "\u627F",
      "\u72EC",
      "\u4EE4",
      "\u9650",
      "\u963F",
      "\u5BA3",
      "\u73AF",
      "\u53CC",
      "\u8BF7",
      "\u8D85",
      "\u5FAE",
      "\u8BA9",
      "\u63A7",
      "\u5DDE",
      "\u826F",
      "\u8F74",
      "\u627E",
      "\u5426",
      "\u7EAA",
      "\u76CA",
      "\u4F9D",
      "\u4F18",
      "\u9876",
      "\u7840",
      "\u8F7D",
      "\u5012",
      "\u623F",
      "\u7A81",
      "\u5750",
      "\u7C89",
      "\u654C",
      "\u7565",
      "\u5BA2",
      "\u8881",
      "\u51B7",
      "\u80DC",
      "\u7EDD",
      "\u6790",
      "\u5757",
      "\u5242",
      "\u6D4B",
      "\u4E1D",
      "\u534F",
      "\u8BC9",
      "\u5FF5",
      "\u9648",
      "\u4ECD",
      "\u7F57",
      "\u76D0",
      "\u53CB",
      "\u6D0B",
      "\u9519",
      "\u82E6",
      "\u591C",
      "\u5211",
      "\u79FB",
      "\u9891",
      "\u9010",
      "\u9760",
      "\u6DF7",
      "\u6BCD",
      "\u77ED",
      "\u76AE",
      "\u7EC8",
      "\u805A",
      "\u6C7D",
      "\u6751",
      "\u4E91",
      "\u54EA",
      "\u65E2",
      "\u8DDD",
      "\u536B",
      "\u505C",
      "\u70C8",
      "\u592E",
      "\u5BDF",
      "\u70E7",
      "\u8FC5",
      "\u5883",
      "\u82E5",
      "\u5370",
      "\u6D32",
      "\u523B",
      "\u62EC",
      "\u6FC0",
      "\u5B54",
      "\u641E",
      "\u751A",
      "\u5BA4",
      "\u5F85",
      "\u6838",
      "\u6821",
      "\u6563",
      "\u4FB5",
      "\u5427",
      "\u7532",
      "\u6E38",
      "\u4E45",
      "\u83DC",
      "\u5473",
      "\u65E7",
      "\u6A21",
      "\u6E56",
      "\u8D27",
      "\u635F",
      "\u9884",
      "\u963B",
      "\u6BEB",
      "\u666E",
      "\u7A33",
      "\u4E59",
      "\u5988",
      "\u690D",
      "\u606F",
      "\u6269",
      "\u94F6",
      "\u8BED",
      "\u6325",
      "\u9152",
      "\u5B88",
      "\u62FF",
      "\u5E8F",
      "\u7EB8",
      "\u533B",
      "\u7F3A",
      "\u96E8",
      "\u5417",
      "\u9488",
      "\u5218",
      "\u554A",
      "\u6025",
      "\u5531",
      "\u8BEF",
      "\u8BAD",
      "\u613F",
      "\u5BA1",
      "\u9644",
      "\u83B7",
      "\u8336",
      "\u9C9C",
      "\u7CAE",
      "\u65A4",
      "\u5B69",
      "\u8131",
      "\u786B",
      "\u80A5",
      "\u5584",
      "\u9F99",
      "\u6F14",
      "\u7236",
      "\u6E10",
      "\u8840",
      "\u6B22",
      "\u68B0",
      "\u638C",
      "\u6B4C",
      "\u6C99",
      "\u521A",
      "\u653B",
      "\u8C13",
      "\u76FE",
      "\u8BA8",
      "\u665A",
      "\u7C92",
      "\u4E71",
      "\u71C3",
      "\u77DB",
      "\u4E4E",
      "\u6740",
      "\u836F",
      "\u5B81",
      "\u9C81",
      "\u8D35",
      "\u949F",
      "\u7164",
      "\u8BFB",
      "\u73ED",
      "\u4F2F",
      "\u9999",
      "\u4ECB",
      "\u8FEB",
      "\u53E5",
      "\u4E30",
      "\u57F9",
      "\u63E1",
      "\u5170",
      "\u62C5",
      "\u5F26",
      "\u86CB",
      "\u6C89",
      "\u5047",
      "\u7A7F",
      "\u6267",
      "\u7B54",
      "\u4E50",
      "\u8C01",
      "\u987A",
      "\u70DF",
      "\u7F29",
      "\u5F81",
      "\u8138",
      "\u559C",
      "\u677E",
      "\u811A",
      "\u56F0",
      "\u5F02",
      "\u514D",
      "\u80CC",
      "\u661F",
      "\u798F",
      "\u4E70",
      "\u67D3",
      "\u4E95",
      "\u6982",
      "\u6162",
      "\u6015",
      "\u78C1",
      "\u500D",
      "\u7956",
      "\u7687",
      "\u4FC3",
      "\u9759",
      "\u8865",
      "\u8BC4",
      "\u7FFB",
      "\u8089",
      "\u8DF5",
      "\u5C3C",
      "\u8863",
      "\u5BBD",
      "\u626C",
      "\u68C9",
      "\u5E0C",
      "\u4F24",
      "\u64CD",
      "\u5782",
      "\u79CB",
      "\u5B9C",
      "\u6C22",
      "\u5957",
      "\u7763",
      "\u632F",
      "\u67B6",
      "\u4EAE",
      "\u672B",
      "\u5BAA",
      "\u5E86",
      "\u7F16",
      "\u725B",
      "\u89E6",
      "\u6620",
      "\u96F7",
      "\u9500",
      "\u8BD7",
      "\u5EA7",
      "\u5C45",
      "\u6293",
      "\u88C2",
      "\u80DE",
      "\u547C",
      "\u5A18",
      "\u666F",
      "\u5A01",
      "\u7EFF",
      "\u6676",
      "\u539A",
      "\u76DF",
      "\u8861",
      "\u9E21",
      "\u5B59",
      "\u5EF6",
      "\u5371",
      "\u80F6",
      "\u5C4B",
      "\u4E61",
      "\u4E34",
      "\u9646",
      "\u987E",
      "\u6389",
      "\u5440",
      "\u706F",
      "\u5C81",
      "\u63AA",
      "\u675F",
      "\u8010",
      "\u5267",
      "\u7389",
      "\u8D75",
      "\u8DF3",
      "\u54E5",
      "\u5B63",
      "\u8BFE",
      "\u51EF",
      "\u80E1",
      "\u989D",
      "\u6B3E",
      "\u7ECD",
      "\u5377",
      "\u9F50",
      "\u4F1F",
      "\u84B8",
      "\u6B96",
      "\u6C38",
      "\u5B97",
      "\u82D7",
      "\u5DDD",
      "\u7089",
      "\u5CA9",
      "\u5F31",
      "\u96F6",
      "\u6768",
      "\u594F",
      "\u6CBF",
      "\u9732",
      "\u6746",
      "\u63A2",
      "\u6ED1",
      "\u9547",
      "\u996D",
      "\u6D53",
      "\u822A",
      "\u6000",
      "\u8D76",
      "\u5E93",
      "\u593A",
      "\u4F0A",
      "\u7075",
      "\u7A0E",
      "\u9014",
      "\u706D",
      "\u8D5B",
      "\u5F52",
      "\u53EC",
      "\u9F13",
      "\u64AD",
      "\u76D8",
      "\u88C1",
      "\u9669",
      "\u5EB7",
      "\u552F",
      "\u5F55",
      "\u83CC",
      "\u7EAF",
      "\u501F",
      "\u7CD6",
      "\u76D6",
      "\u6A2A",
      "\u7B26",
      "\u79C1",
      "\u52AA",
      "\u5802",
      "\u57DF",
      "\u67AA",
      "\u6DA6",
      "\u5E45",
      "\u54C8",
      "\u7ADF",
      "\u719F",
      "\u866B",
      "\u6CFD",
      "\u8111",
      "\u58E4",
      "\u78B3",
      "\u6B27",
      "\u904D",
      "\u4FA7",
      "\u5BE8",
      "\u6562",
      "\u5F7B",
      "\u8651",
      "\u659C",
      "\u8584",
      "\u5EAD",
      "\u7EB3",
      "\u5F39",
      "\u9972",
      "\u4F38",
      "\u6298",
      "\u9EA6",
      "\u6E7F",
      "\u6697",
      "\u8377",
      "\u74E6",
      "\u585E",
      "\u5E8A",
      "\u7B51",
      "\u6076",
      "\u6237",
      "\u8BBF",
      "\u5854",
      "\u5947",
      "\u900F",
      "\u6881",
      "\u5200",
      "\u65CB",
      "\u8FF9",
      "\u5361",
      "\u6C2F",
      "\u9047",
      "\u4EFD",
      "\u6BD2",
      "\u6CE5",
      "\u9000",
      "\u6D17",
      "\u6446",
      "\u7070",
      "\u5F69",
      "\u5356",
      "\u8017",
      "\u590F",
      "\u62E9",
      "\u5FD9",
      "\u94DC",
      "\u732E",
      "\u786C",
      "\u4E88",
      "\u7E41",
      "\u5708",
      "\u96EA",
      "\u51FD",
      "\u4EA6",
      "\u62BD",
      "\u7BC7",
      "\u9635",
      "\u9634",
      "\u4E01",
      "\u5C3A",
      "\u8FFD",
      "\u5806",
      "\u96C4",
      "\u8FCE",
      "\u6CDB",
      "\u7238",
      "\u697C",
      "\u907F",
      "\u8C0B",
      "\u5428",
      "\u91CE",
      "\u732A",
      "\u65D7",
      "\u7D2F",
      "\u504F",
      "\u5178",
      "\u9986",
      "\u7D22",
      "\u79E6",
      "\u8102",
      "\u6F6E",
      "\u7237",
      "\u8C46",
      "\u5FFD",
      "\u6258",
      "\u60CA",
      "\u5851",
      "\u9057",
      "\u6108",
      "\u6731",
      "\u66FF",
      "\u7EA4",
      "\u7C97",
      "\u503E",
      "\u5C1A",
      "\u75DB",
      "\u695A",
      "\u8C22",
      "\u594B",
      "\u8D2D",
      "\u78E8",
      "\u541B",
      "\u6C60",
      "\u65C1",
      "\u788E",
      "\u9AA8",
      "\u76D1",
      "\u6355",
      "\u5F1F",
      "\u66B4",
      "\u5272",
      "\u8D2F",
      "\u6B8A",
      "\u91CA",
      "\u8BCD",
      "\u4EA1",
      "\u58C1",
      "\u987F",
      "\u5B9D",
      "\u5348",
      "\u5C18",
      "\u95FB",
      "\u63ED",
      "\u70AE",
      "\u6B8B",
      "\u51AC",
      "\u6865",
      "\u5987",
      "\u8B66",
      "\u7EFC",
      "\u62DB",
      "\u5434",
      "\u4ED8",
      "\u6D6E",
      "\u906D",
      "\u5F90",
      "\u60A8",
      "\u6447",
      "\u8C37",
      "\u8D5E",
      "\u7BB1",
      "\u9694",
      "\u8BA2",
      "\u7537",
      "\u5439",
      "\u56ED",
      "\u7EB7",
      "\u5510",
      "\u8D25",
      "\u5B8B",
      "\u73BB",
      "\u5DE8",
      "\u8015",
      "\u5766",
      "\u8363",
      "\u95ED",
      "\u6E7E",
      "\u952E",
      "\u51E1",
      "\u9A7B",
      "\u9505",
      "\u6551",
      "\u6069",
      "\u5265",
      "\u51DD",
      "\u78B1",
      "\u9F7F",
      "\u622A",
      "\u70BC",
      "\u9EBB",
      "\u7EBA",
      "\u7981",
      "\u5E9F",
      "\u76DB",
      "\u7248",
      "\u7F13",
      "\u51C0",
      "\u775B",
      "\u660C",
      "\u5A5A",
      "\u6D89",
      "\u7B52",
      "\u5634",
      "\u63D2",
      "\u5CB8",
      "\u6717",
      "\u5E84",
      "\u8857",
      "\u85CF",
      "\u59D1",
      "\u8D38",
      "\u8150",
      "\u5974",
      "\u5566",
      "\u60EF",
      "\u4E58",
      "\u4F19",
      "\u6062",
      "\u5300",
      "\u7EB1",
      "\u624E",
      "\u8FA9",
      "\u8033",
      "\u5F6A",
      "\u81E3",
      "\u4EBF",
      "\u7483",
      "\u62B5",
      "\u8109",
      "\u79C0",
      "\u8428",
      "\u4FC4",
      "\u7F51",
      "\u821E",
      "\u5E97",
      "\u55B7",
      "\u7EB5",
      "\u5BF8",
      "\u6C57",
      "\u6302",
      "\u6D2A",
      "\u8D3A",
      "\u95EA",
      "\u67EC",
      "\u7206",
      "\u70EF",
      "\u6D25",
      "\u7A3B",
      "\u5899",
      "\u8F6F",
      "\u52C7",
      "\u50CF",
      "\u6EDA",
      "\u5398",
      "\u8499",
      "\u82B3",
      "\u80AF",
      "\u5761",
      "\u67F1",
      "\u8361",
      "\u817F",
      "\u4EEA",
      "\u65C5",
      "\u5C3E",
      "\u8F67",
      "\u51B0",
      "\u8D21",
      "\u767B",
      "\u9ECE",
      "\u524A",
      "\u94BB",
      "\u52D2",
      "\u9003",
      "\u969C",
      "\u6C28",
      "\u90ED",
      "\u5CF0",
      "\u5E01",
      "\u6E2F",
      "\u4F0F",
      "\u8F68",
      "\u4EA9",
      "\u6BD5",
      "\u64E6",
      "\u83AB",
      "\u523A",
      "\u6D6A",
      "\u79D8",
      "\u63F4",
      "\u682A",
      "\u5065",
      "\u552E",
      "\u80A1",
      "\u5C9B",
      "\u7518",
      "\u6CE1",
      "\u7761",
      "\u7AE5",
      "\u94F8",
      "\u6C64",
      "\u9600",
      "\u4F11",
      "\u6C47",
      "\u820D",
      "\u7267",
      "\u7ED5",
      "\u70B8",
      "\u54F2",
      "\u78F7",
      "\u7EE9",
      "\u670B",
      "\u6DE1",
      "\u5C16",
      "\u542F",
      "\u9677",
      "\u67F4",
      "\u5448",
      "\u5F92",
      "\u989C",
      "\u6CEA",
      "\u7A0D",
      "\u5FD8",
      "\u6CF5",
      "\u84DD",
      "\u62D6",
      "\u6D1E",
      "\u6388",
      "\u955C",
      "\u8F9B",
      "\u58EE",
      "\u950B",
      "\u8D2B",
      "\u865A",
      "\u5F2F",
      "\u6469",
      "\u6CF0",
      "\u5E7C",
      "\u5EF7",
      "\u5C0A",
      "\u7A97",
      "\u7EB2",
      "\u5F04",
      "\u96B6",
      "\u7591",
      "\u6C0F",
      "\u5BAB",
      "\u59D0",
      "\u9707",
      "\u745E",
      "\u602A",
      "\u5C24",
      "\u7434",
      "\u5FAA",
      "\u63CF",
      "\u819C",
      "\u8FDD",
      "\u5939",
      "\u8170",
      "\u7F18",
      "\u73E0",
      "\u7A77",
      "\u68EE",
      "\u679D",
      "\u7AF9",
      "\u6C9F",
      "\u50AC",
      "\u7EF3",
      "\u5FC6",
      "\u90A6",
      "\u5269",
      "\u5E78",
      "\u6D46",
      "\u680F",
      "\u62E5",
      "\u7259",
      "\u8D2E",
      "\u793C",
      "\u6EE4",
      "\u94A0",
      "\u7EB9",
      "\u7F62",
      "\u62CD",
      "\u54B1",
      "\u558A",
      "\u8896",
      "\u57C3",
      "\u52E4",
      "\u7F5A",
      "\u7126",
      "\u6F5C",
      "\u4F0D",
      "\u58A8",
      "\u6B32",
      "\u7F1D",
      "\u59D3",
      "\u520A",
      "\u9971",
      "\u4EFF",
      "\u5956",
      "\u94DD",
      "\u9B3C",
      "\u4E3D",
      "\u8DE8",
      "\u9ED8",
      "\u6316",
      "\u94FE",
      "\u626B",
      "\u559D",
      "\u888B",
      "\u70AD",
      "\u6C61",
      "\u5E55",
      "\u8BF8",
      "\u5F27",
      "\u52B1",
      "\u6885",
      "\u5976",
      "\u6D01",
      "\u707E",
      "\u821F",
      "\u9274",
      "\u82EF",
      "\u8BBC",
      "\u62B1",
      "\u6BC1",
      "\u61C2",
      "\u5BD2",
      "\u667A",
      "\u57D4",
      "\u5BC4",
      "\u5C4A",
      "\u8DC3",
      "\u6E21",
      "\u6311",
      "\u4E39",
      "\u8270",
      "\u8D1D",
      "\u78B0",
      "\u62D4",
      "\u7239",
      "\u6234",
      "\u7801",
      "\u68A6",
      "\u82BD",
      "\u7194",
      "\u8D64",
      "\u6E14",
      "\u54ED",
      "\u656C",
      "\u9897",
      "\u5954",
      "\u94C5",
      "\u4EF2",
      "\u864E",
      "\u7A00",
      "\u59B9",
      "\u4E4F",
      "\u73CD",
      "\u7533",
      "\u684C",
      "\u9075",
      "\u5141",
      "\u9686",
      "\u87BA",
      "\u4ED3",
      "\u9B4F",
      "\u9510",
      "\u6653",
      "\u6C2E",
      "\u517C",
      "\u9690",
      "\u788D",
      "\u8D6B",
      "\u62E8",
      "\u5FE0",
      "\u8083",
      "\u7F38",
      "\u7275",
      "\u62A2",
      "\u535A",
      "\u5DE7",
      "\u58F3",
      "\u5144",
      "\u675C",
      "\u8BAF",
      "\u8BDA",
      "\u78A7",
      "\u7965",
      "\u67EF",
      "\u9875",
      "\u5DE1",
      "\u77E9",
      "\u60B2",
      "\u704C",
      "\u9F84",
      "\u4F26",
      "\u7968",
      "\u5BFB",
      "\u6842",
      "\u94FA",
      "\u5723",
      "\u6050",
      "\u6070",
      "\u90D1",
      "\u8DA3",
      "\u62AC",
      "\u8352",
      "\u817E",
      "\u8D34",
      "\u67D4",
      "\u6EF4",
      "\u731B",
      "\u9614",
      "\u8F86",
      "\u59BB",
      "\u586B",
      "\u64A4",
      "\u50A8",
      "\u7B7E",
      "\u95F9",
      "\u6270",
      "\u7D2B",
      "\u7802",
      "\u9012",
      "\u620F",
      "\u540A",
      "\u9676",
      "\u4F10",
      "\u5582",
      "\u7597",
      "\u74F6",
      "\u5A46",
      "\u629A",
      "\u81C2",
      "\u6478",
      "\u5FCD",
      "\u867E",
      "\u8721",
      "\u90BB",
      "\u80F8",
      "\u5DE9",
      "\u6324",
      "\u5076",
      "\u5F03",
      "\u69FD",
      "\u52B2",
      "\u4E73",
      "\u9093",
      "\u5409",
      "\u4EC1",
      "\u70C2",
      "\u7816",
      "\u79DF",
      "\u4E4C",
      "\u8230",
      "\u4F34",
      "\u74DC",
      "\u6D45",
      "\u4E19",
      "\u6682",
      "\u71E5",
      "\u6A61",
      "\u67F3",
      "\u8FF7",
      "\u6696",
      "\u724C",
      "\u79E7",
      "\u80C6",
      "\u8BE6",
      "\u7C27",
      "\u8E0F",
      "\u74F7",
      "\u8C31",
      "\u5446",
      "\u5BBE",
      "\u7CCA",
      "\u6D1B",
      "\u8F89",
      "\u6124",
      "\u7ADE",
      "\u9699",
      "\u6012",
      "\u7C98",
      "\u4E43",
      "\u7EEA",
      "\u80A9",
      "\u7C4D",
      "\u654F",
      "\u6D82",
      "\u7199",
      "\u7686",
      "\u4FA6",
      "\u60AC",
      "\u6398",
      "\u4EAB",
      "\u7EA0",
      "\u9192",
      "\u72C2",
      "\u9501",
      "\u6DC0",
      "\u6068",
      "\u7272",
      "\u9738",
      "\u722C",
      "\u8D4F",
      "\u9006",
      "\u73A9",
      "\u9675",
      "\u795D",
      "\u79D2",
      "\u6D59",
      "\u8C8C",
      "\u5F79",
      "\u5F7C",
      "\u6089",
      "\u9E2D",
      "\u8D8B",
      "\u51E4",
      "\u6668",
      "\u755C",
      "\u8F88",
      "\u79E9",
      "\u5375",
      "\u7F72",
      "\u68AF",
      "\u708E",
      "\u6EE9",
      "\u68CB",
      "\u9A71",
      "\u7B5B",
      "\u5CE1",
      "\u5192",
      "\u5565",
      "\u5BFF",
      "\u8BD1",
      "\u6D78",
      "\u6CC9",
      "\u5E3D",
      "\u8FDF",
      "\u7845",
      "\u7586",
      "\u8D37",
      "\u6F0F",
      "\u7A3F",
      "\u51A0",
      "\u5AE9",
      "\u80C1",
      "\u82AF",
      "\u7262",
      "\u53DB",
      "\u8680",
      "\u5965",
      "\u9E23",
      "\u5CAD",
      "\u7F8A",
      "\u51ED",
      "\u4E32",
      "\u5858",
      "\u7ED8",
      "\u9175",
      "\u878D",
      "\u76C6",
      "\u9521",
      "\u5E99",
      "\u7B79",
      "\u51BB",
      "\u8F85",
      "\u6444",
      "\u88AD",
      "\u7B4B",
      "\u62D2",
      "\u50DA",
      "\u65F1",
      "\u94BE",
      "\u9E1F",
      "\u6F06",
      "\u6C88",
      "\u7709",
      "\u758F",
      "\u6DFB",
      "\u68D2",
      "\u7A57",
      "\u785D",
      "\u97E9",
      "\u903C",
      "\u626D",
      "\u4FA8",
      "\u51C9",
      "\u633A",
      "\u7897",
      "\u683D",
      "\u7092",
      "\u676F",
      "\u60A3",
      "\u998F",
      "\u529D",
      "\u8C6A",
      "\u8FBD",
      "\u52C3",
      "\u9E3F",
      "\u65E6",
      "\u540F",
      "\u62DC",
      "\u72D7",
      "\u57CB",
      "\u8F8A",
      "\u63A9",
      "\u996E",
      "\u642C",
      "\u9A82",
      "\u8F9E",
      "\u52FE",
      "\u6263",
      "\u4F30",
      "\u848B",
      "\u7ED2",
      "\u96FE",
      "\u4E08",
      "\u6735",
      "\u59C6",
      "\u62DF",
      "\u5B87",
      "\u8F91",
      "\u9655",
      "\u96D5",
      "\u507F",
      "\u84C4",
      "\u5D07",
      "\u526A",
      "\u5021",
      "\u5385",
      "\u54AC",
      "\u9A76",
      "\u85AF",
      "\u5237",
      "\u65A5",
      "\u756A",
      "\u8D4B",
      "\u5949",
      "\u4F5B",
      "\u6D47",
      "\u6F2B",
      "\u66FC",
      "\u6247",
      "\u9499",
      "\u6843",
      "\u6276",
      "\u4ED4",
      "\u8FD4",
      "\u4FD7",
      "\u4E8F",
      "\u8154",
      "\u978B",
      "\u68F1",
      "\u8986",
      "\u6846",
      "\u6084",
      "\u53D4",
      "\u649E",
      "\u9A97",
      "\u52D8",
      "\u65FA",
      "\u6CB8",
      "\u5B64",
      "\u5410",
      "\u5B5F",
      "\u6E20",
      "\u5C48",
      "\u75BE",
      "\u5999",
      "\u60DC",
      "\u4EF0",
      "\u72E0",
      "\u80C0",
      "\u8C10",
      "\u629B",
      "\u9709",
      "\u6851",
      "\u5C97",
      "\u561B",
      "\u8870",
      "\u76D7",
      "\u6E17",
      "\u810F",
      "\u8D56",
      "\u6D8C",
      "\u751C",
      "\u66F9",
      "\u9605",
      "\u808C",
      "\u54E9",
      "\u5389",
      "\u70C3",
      "\u7EAC",
      "\u6BC5",
      "\u6628",
      "\u4F2A",
      "\u75C7",
      "\u716E",
      "\u53F9",
      "\u9489",
      "\u642D",
      "\u830E",
      "\u7B3C",
      "\u9177",
      "\u5077",
      "\u5F13",
      "\u9525",
      "\u6052",
      "\u6770",
      "\u5751",
      "\u9F3B",
      "\u7FFC",
      "\u7EB6",
      "\u53D9",
      "\u72F1",
      "\u902E",
      "\u7F50",
      "\u7EDC",
      "\u68DA",
      "\u6291",
      "\u81A8",
      "\u852C",
      "\u5BFA",
      "\u9AA4",
      "\u7A46",
      "\u51B6",
      "\u67AF",
      "\u518C",
      "\u5C38",
      "\u51F8",
      "\u7EC5",
      "\u576F",
      "\u727A",
      "\u7130",
      "\u8F70",
      "\u6B23",
      "\u664B",
      "\u7626",
      "\u5FA1",
      "\u952D",
      "\u9526",
      "\u4E27",
      "\u65EC",
      "\u953B",
      "\u5784",
      "\u641C",
      "\u6251",
      "\u9080",
      "\u4EAD",
      "\u916F",
      "\u8FC8",
      "\u8212",
      "\u8106",
      "\u9176",
      "\u95F2",
      "\u5FE7",
      "\u915A",
      "\u987D",
      "\u7FBD",
      "\u6DA8",
      "\u5378",
      "\u4ED7",
      "\u966A",
      "\u8F9F",
      "\u60E9",
      "\u676D",
      "\u59DA",
      "\u809A",
      "\u6349",
      "\u98D8",
      "\u6F02",
      "\u6606",
      "\u6B3A",
      "\u543E",
      "\u90CE",
      "\u70F7",
      "\u6C41",
      "\u5475",
      "\u9970",
      "\u8427",
      "\u96C5",
      "\u90AE",
      "\u8FC1",
      "\u71D5",
      "\u6492",
      "\u59FB",
      "\u8D74",
      "\u5BB4",
      "\u70E6",
      "\u503A",
      "\u5E10",
      "\u6591",
      "\u94C3",
      "\u65E8",
      "\u9187",
      "\u8463",
      "\u997C",
      "\u96CF",
      "\u59FF",
      "\u62CC",
      "\u5085",
      "\u8179",
      "\u59A5",
      "\u63C9",
      "\u8D24",
      "\u62C6",
      "\u6B6A",
      "\u8461",
      "\u80FA",
      "\u4E22",
      "\u6D69",
      "\u5FBD",
      "\u6602",
      "\u57AB",
      "\u6321",
      "\u89C8",
      "\u8D2A",
      "\u6170",
      "\u7F34",
      "\u6C6A",
      "\u614C",
      "\u51AF",
      "\u8BFA",
      "\u59DC",
      "\u8C0A",
      "\u51F6",
      "\u52A3",
      "\u8BEC",
      "\u8000",
      "\u660F",
      "\u8EBA",
      "\u76C8",
      "\u9A91",
      "\u4E54",
      "\u6EAA",
      "\u4E1B",
      "\u5362",
      "\u62B9",
      "\u95F7",
      "\u54A8",
      "\u522E",
      "\u9A7E",
      "\u7F06",
      "\u609F",
      "\u6458",
      "\u94D2",
      "\u63B7",
      "\u9887",
      "\u5E7B",
      "\u67C4",
      "\u60E0",
      "\u60E8",
      "\u4F73",
      "\u4EC7",
      "\u814A",
      "\u7A9D",
      "\u6DA4",
      "\u5251",
      "\u77A7",
      "\u5821",
      "\u6CFC",
      "\u8471",
      "\u7F69",
      "\u970D",
      "\u635E",
      "\u80CE",
      "\u82CD",
      "\u6EE8",
      "\u4FE9",
      "\u6345",
      "\u6E58",
      "\u780D",
      "\u971E",
      "\u90B5",
      "\u8404",
      "\u75AF",
      "\u6DEE",
      "\u9042",
      "\u718A",
      "\u7CAA",
      "\u70D8",
      "\u5BBF",
      "\u6863",
      "\u6208",
      "\u9A73",
      "\u5AC2",
      "\u88D5",
      "\u5F99",
      "\u7BAD",
      "\u6350",
      "\u80A0",
      "\u6491",
      "\u6652",
      "\u8FA8",
      "\u6BBF",
      "\u83B2",
      "\u644A",
      "\u6405",
      "\u9171",
      "\u5C4F",
      "\u75AB",
      "\u54C0",
      "\u8521",
      "\u5835",
      "\u6CAB",
      "\u76B1",
      "\u7545",
      "\u53E0",
      "\u9601",
      "\u83B1",
      "\u6572",
      "\u8F96",
      "\u94A9",
      "\u75D5",
      "\u575D",
      "\u5DF7",
      "\u997F",
      "\u7978",
      "\u4E18",
      "\u7384",
      "\u6E9C",
      "\u66F0",
      "\u903B",
      "\u5F6D",
      "\u5C1D",
      "\u537F",
      "\u59A8",
      "\u8247",
      "\u541E",
      "\u97E6",
      "\u6028",
      "\u77EE",
      "\u6B47"
    ];
  }
});

// ../node_modules/bip39/src/wordlists/chinese_traditional.json
var require_chinese_traditional = __commonJS({
  "../node_modules/bip39/src/wordlists/chinese_traditional.json"(exports, module) {
    module.exports = [
      "\u7684",
      "\u4E00",
      "\u662F",
      "\u5728",
      "\u4E0D",
      "\u4E86",
      "\u6709",
      "\u548C",
      "\u4EBA",
      "\u9019",
      "\u4E2D",
      "\u5927",
      "\u70BA",
      "\u4E0A",
      "\u500B",
      "\u570B",
      "\u6211",
      "\u4EE5",
      "\u8981",
      "\u4ED6",
      "\u6642",
      "\u4F86",
      "\u7528",
      "\u5011",
      "\u751F",
      "\u5230",
      "\u4F5C",
      "\u5730",
      "\u65BC",
      "\u51FA",
      "\u5C31",
      "\u5206",
      "\u5C0D",
      "\u6210",
      "\u6703",
      "\u53EF",
      "\u4E3B",
      "\u767C",
      "\u5E74",
      "\u52D5",
      "\u540C",
      "\u5DE5",
      "\u4E5F",
      "\u80FD",
      "\u4E0B",
      "\u904E",
      "\u5B50",
      "\u8AAA",
      "\u7522",
      "\u7A2E",
      "\u9762",
      "\u800C",
      "\u65B9",
      "\u5F8C",
      "\u591A",
      "\u5B9A",
      "\u884C",
      "\u5B78",
      "\u6CD5",
      "\u6240",
      "\u6C11",
      "\u5F97",
      "\u7D93",
      "\u5341",
      "\u4E09",
      "\u4E4B",
      "\u9032",
      "\u8457",
      "\u7B49",
      "\u90E8",
      "\u5EA6",
      "\u5BB6",
      "\u96FB",
      "\u529B",
      "\u88E1",
      "\u5982",
      "\u6C34",
      "\u5316",
      "\u9AD8",
      "\u81EA",
      "\u4E8C",
      "\u7406",
      "\u8D77",
      "\u5C0F",
      "\u7269",
      "\u73FE",
      "\u5BE6",
      "\u52A0",
      "\u91CF",
      "\u90FD",
      "\u5169",
      "\u9AD4",
      "\u5236",
      "\u6A5F",
      "\u7576",
      "\u4F7F",
      "\u9EDE",
      "\u5F9E",
      "\u696D",
      "\u672C",
      "\u53BB",
      "\u628A",
      "\u6027",
      "\u597D",
      "\u61C9",
      "\u958B",
      "\u5B83",
      "\u5408",
      "\u9084",
      "\u56E0",
      "\u7531",
      "\u5176",
      "\u4E9B",
      "\u7136",
      "\u524D",
      "\u5916",
      "\u5929",
      "\u653F",
      "\u56DB",
      "\u65E5",
      "\u90A3",
      "\u793E",
      "\u7FA9",
      "\u4E8B",
      "\u5E73",
      "\u5F62",
      "\u76F8",
      "\u5168",
      "\u8868",
      "\u9593",
      "\u6A23",
      "\u8207",
      "\u95DC",
      "\u5404",
      "\u91CD",
      "\u65B0",
      "\u7DDA",
      "\u5167",
      "\u6578",
      "\u6B63",
      "\u5FC3",
      "\u53CD",
      "\u4F60",
      "\u660E",
      "\u770B",
      "\u539F",
      "\u53C8",
      "\u9EBC",
      "\u5229",
      "\u6BD4",
      "\u6216",
      "\u4F46",
      "\u8CEA",
      "\u6C23",
      "\u7B2C",
      "\u5411",
      "\u9053",
      "\u547D",
      "\u6B64",
      "\u8B8A",
      "\u689D",
      "\u53EA",
      "\u6C92",
      "\u7D50",
      "\u89E3",
      "\u554F",
      "\u610F",
      "\u5EFA",
      "\u6708",
      "\u516C",
      "\u7121",
      "\u7CFB",
      "\u8ECD",
      "\u5F88",
      "\u60C5",
      "\u8005",
      "\u6700",
      "\u7ACB",
      "\u4EE3",
      "\u60F3",
      "\u5DF2",
      "\u901A",
      "\u4E26",
      "\u63D0",
      "\u76F4",
      "\u984C",
      "\u9EE8",
      "\u7A0B",
      "\u5C55",
      "\u4E94",
      "\u679C",
      "\u6599",
      "\u8C61",
      "\u54E1",
      "\u9769",
      "\u4F4D",
      "\u5165",
      "\u5E38",
      "\u6587",
      "\u7E3D",
      "\u6B21",
      "\u54C1",
      "\u5F0F",
      "\u6D3B",
      "\u8A2D",
      "\u53CA",
      "\u7BA1",
      "\u7279",
      "\u4EF6",
      "\u9577",
      "\u6C42",
      "\u8001",
      "\u982D",
      "\u57FA",
      "\u8CC7",
      "\u908A",
      "\u6D41",
      "\u8DEF",
      "\u7D1A",
      "\u5C11",
      "\u5716",
      "\u5C71",
      "\u7D71",
      "\u63A5",
      "\u77E5",
      "\u8F03",
      "\u5C07",
      "\u7D44",
      "\u898B",
      "\u8A08",
      "\u5225",
      "\u5979",
      "\u624B",
      "\u89D2",
      "\u671F",
      "\u6839",
      "\u8AD6",
      "\u904B",
      "\u8FB2",
      "\u6307",
      "\u5E7E",
      "\u4E5D",
      "\u5340",
      "\u5F37",
      "\u653E",
      "\u6C7A",
      "\u897F",
      "\u88AB",
      "\u5E79",
      "\u505A",
      "\u5FC5",
      "\u6230",
      "\u5148",
      "\u56DE",
      "\u5247",
      "\u4EFB",
      "\u53D6",
      "\u64DA",
      "\u8655",
      "\u968A",
      "\u5357",
      "\u7D66",
      "\u8272",
      "\u5149",
      "\u9580",
      "\u5373",
      "\u4FDD",
      "\u6CBB",
      "\u5317",
      "\u9020",
      "\u767E",
      "\u898F",
      "\u71B1",
      "\u9818",
      "\u4E03",
      "\u6D77",
      "\u53E3",
      "\u6771",
      "\u5C0E",
      "\u5668",
      "\u58D3",
      "\u5FD7",
      "\u4E16",
      "\u91D1",
      "\u589E",
      "\u722D",
      "\u6FDF",
      "\u968E",
      "\u6CB9",
      "\u601D",
      "\u8853",
      "\u6975",
      "\u4EA4",
      "\u53D7",
      "\u806F",
      "\u4EC0",
      "\u8A8D",
      "\u516D",
      "\u5171",
      "\u6B0A",
      "\u6536",
      "\u8B49",
      "\u6539",
      "\u6E05",
      "\u7F8E",
      "\u518D",
      "\u63A1",
      "\u8F49",
      "\u66F4",
      "\u55AE",
      "\u98A8",
      "\u5207",
      "\u6253",
      "\u767D",
      "\u6559",
      "\u901F",
      "\u82B1",
      "\u5E36",
      "\u5B89",
      "\u5834",
      "\u8EAB",
      "\u8ECA",
      "\u4F8B",
      "\u771F",
      "\u52D9",
      "\u5177",
      "\u842C",
      "\u6BCF",
      "\u76EE",
      "\u81F3",
      "\u9054",
      "\u8D70",
      "\u7A4D",
      "\u793A",
      "\u8B70",
      "\u8072",
      "\u5831",
      "\u9B25",
      "\u5B8C",
      "\u985E",
      "\u516B",
      "\u96E2",
      "\u83EF",
      "\u540D",
      "\u78BA",
      "\u624D",
      "\u79D1",
      "\u5F35",
      "\u4FE1",
      "\u99AC",
      "\u7BC0",
      "\u8A71",
      "\u7C73",
      "\u6574",
      "\u7A7A",
      "\u5143",
      "\u6CC1",
      "\u4ECA",
      "\u96C6",
      "\u6EAB",
      "\u50B3",
      "\u571F",
      "\u8A31",
      "\u6B65",
      "\u7FA4",
      "\u5EE3",
      "\u77F3",
      "\u8A18",
      "\u9700",
      "\u6BB5",
      "\u7814",
      "\u754C",
      "\u62C9",
      "\u6797",
      "\u5F8B",
      "\u53EB",
      "\u4E14",
      "\u7A76",
      "\u89C0",
      "\u8D8A",
      "\u7E54",
      "\u88DD",
      "\u5F71",
      "\u7B97",
      "\u4F4E",
      "\u6301",
      "\u97F3",
      "\u773E",
      "\u66F8",
      "\u5E03",
      "\u590D",
      "\u5BB9",
      "\u5152",
      "\u9808",
      "\u969B",
      "\u5546",
      "\u975E",
      "\u9A57",
      "\u9023",
      "\u65B7",
      "\u6DF1",
      "\u96E3",
      "\u8FD1",
      "\u7926",
      "\u5343",
      "\u9031",
      "\u59D4",
      "\u7D20",
      "\u6280",
      "\u5099",
      "\u534A",
      "\u8FA6",
      "\u9752",
      "\u7701",
      "\u5217",
      "\u7FD2",
      "\u97FF",
      "\u7D04",
      "\u652F",
      "\u822C",
      "\u53F2",
      "\u611F",
      "\u52DE",
      "\u4FBF",
      "\u5718",
      "\u5F80",
      "\u9178",
      "\u6B77",
      "\u5E02",
      "\u514B",
      "\u4F55",
      "\u9664",
      "\u6D88",
      "\u69CB",
      "\u5E9C",
      "\u7A31",
      "\u592A",
      "\u6E96",
      "\u7CBE",
      "\u503C",
      "\u865F",
      "\u7387",
      "\u65CF",
      "\u7DAD",
      "\u5283",
      "\u9078",
      "\u6A19",
      "\u5BEB",
      "\u5B58",
      "\u5019",
      "\u6BDB",
      "\u89AA",
      "\u5FEB",
      "\u6548",
      "\u65AF",
      "\u9662",
      "\u67E5",
      "\u6C5F",
      "\u578B",
      "\u773C",
      "\u738B",
      "\u6309",
      "\u683C",
      "\u990A",
      "\u6613",
      "\u7F6E",
      "\u6D3E",
      "\u5C64",
      "\u7247",
      "\u59CB",
      "\u537B",
      "\u5C08",
      "\u72C0",
      "\u80B2",
      "\u5EE0",
      "\u4EAC",
      "\u8B58",
      "\u9069",
      "\u5C6C",
      "\u5713",
      "\u5305",
      "\u706B",
      "\u4F4F",
      "\u8ABF",
      "\u6EFF",
      "\u7E23",
      "\u5C40",
      "\u7167",
      "\u53C3",
      "\u7D05",
      "\u7D30",
      "\u5F15",
      "\u807D",
      "\u8A72",
      "\u9435",
      "\u50F9",
      "\u56B4",
      "\u9996",
      "\u5E95",
      "\u6DB2",
      "\u5B98",
      "\u5FB7",
      "\u96A8",
      "\u75C5",
      "\u8607",
      "\u5931",
      "\u723E",
      "\u6B7B",
      "\u8B1B",
      "\u914D",
      "\u5973",
      "\u9EC3",
      "\u63A8",
      "\u986F",
      "\u8AC7",
      "\u7F6A",
      "\u795E",
      "\u85DD",
      "\u5462",
      "\u5E2D",
      "\u542B",
      "\u4F01",
      "\u671B",
      "\u5BC6",
      "\u6279",
      "\u71DF",
      "\u9805",
      "\u9632",
      "\u8209",
      "\u7403",
      "\u82F1",
      "\u6C27",
      "\u52E2",
      "\u544A",
      "\u674E",
      "\u53F0",
      "\u843D",
      "\u6728",
      "\u5E6B",
      "\u8F2A",
      "\u7834",
      "\u4E9E",
      "\u5E2B",
      "\u570D",
      "\u6CE8",
      "\u9060",
      "\u5B57",
      "\u6750",
      "\u6392",
      "\u4F9B",
      "\u6CB3",
      "\u614B",
      "\u5C01",
      "\u53E6",
      "\u65BD",
      "\u6E1B",
      "\u6A39",
      "\u6EB6",
      "\u600E",
      "\u6B62",
      "\u6848",
      "\u8A00",
      "\u58EB",
      "\u5747",
      "\u6B66",
      "\u56FA",
      "\u8449",
      "\u9B5A",
      "\u6CE2",
      "\u8996",
      "\u50C5",
      "\u8CBB",
      "\u7DCA",
      "\u611B",
      "\u5DE6",
      "\u7AE0",
      "\u65E9",
      "\u671D",
      "\u5BB3",
      "\u7E8C",
      "\u8F15",
      "\u670D",
      "\u8A66",
      "\u98DF",
      "\u5145",
      "\u5175",
      "\u6E90",
      "\u5224",
      "\u8B77",
      "\u53F8",
      "\u8DB3",
      "\u67D0",
      "\u7DF4",
      "\u5DEE",
      "\u81F4",
      "\u677F",
      "\u7530",
      "\u964D",
      "\u9ED1",
      "\u72AF",
      "\u8CA0",
      "\u64CA",
      "\u8303",
      "\u7E7C",
      "\u8208",
      "\u4F3C",
      "\u9918",
      "\u5805",
      "\u66F2",
      "\u8F38",
      "\u4FEE",
      "\u6545",
      "\u57CE",
      "\u592B",
      "\u5920",
      "\u9001",
      "\u7B46",
      "\u8239",
      "\u4F54",
      "\u53F3",
      "\u8CA1",
      "\u5403",
      "\u5BCC",
      "\u6625",
      "\u8077",
      "\u89BA",
      "\u6F22",
      "\u756B",
      "\u529F",
      "\u5DF4",
      "\u8DDF",
      "\u96D6",
      "\u96DC",
      "\u98DB",
      "\u6AA2",
      "\u5438",
      "\u52A9",
      "\u6607",
      "\u967D",
      "\u4E92",
      "\u521D",
      "\u5275",
      "\u6297",
      "\u8003",
      "\u6295",
      "\u58DE",
      "\u7B56",
      "\u53E4",
      "\u5F91",
      "\u63DB",
      "\u672A",
      "\u8DD1",
      "\u7559",
      "\u92FC",
      "\u66FE",
      "\u7AEF",
      "\u8CAC",
      "\u7AD9",
      "\u7C21",
      "\u8FF0",
      "\u9322",
      "\u526F",
      "\u76E1",
      "\u5E1D",
      "\u5C04",
      "\u8349",
      "\u885D",
      "\u627F",
      "\u7368",
      "\u4EE4",
      "\u9650",
      "\u963F",
      "\u5BA3",
      "\u74B0",
      "\u96D9",
      "\u8ACB",
      "\u8D85",
      "\u5FAE",
      "\u8B93",
      "\u63A7",
      "\u5DDE",
      "\u826F",
      "\u8EF8",
      "\u627E",
      "\u5426",
      "\u7D00",
      "\u76CA",
      "\u4F9D",
      "\u512A",
      "\u9802",
      "\u790E",
      "\u8F09",
      "\u5012",
      "\u623F",
      "\u7A81",
      "\u5750",
      "\u7C89",
      "\u6575",
      "\u7565",
      "\u5BA2",
      "\u8881",
      "\u51B7",
      "\u52DD",
      "\u7D55",
      "\u6790",
      "\u584A",
      "\u5291",
      "\u6E2C",
      "\u7D72",
      "\u5354",
      "\u8A34",
      "\u5FF5",
      "\u9673",
      "\u4ECD",
      "\u7F85",
      "\u9E7D",
      "\u53CB",
      "\u6D0B",
      "\u932F",
      "\u82E6",
      "\u591C",
      "\u5211",
      "\u79FB",
      "\u983B",
      "\u9010",
      "\u9760",
      "\u6DF7",
      "\u6BCD",
      "\u77ED",
      "\u76AE",
      "\u7D42",
      "\u805A",
      "\u6C7D",
      "\u6751",
      "\u96F2",
      "\u54EA",
      "\u65E2",
      "\u8DDD",
      "\u885B",
      "\u505C",
      "\u70C8",
      "\u592E",
      "\u5BDF",
      "\u71D2",
      "\u8FC5",
      "\u5883",
      "\u82E5",
      "\u5370",
      "\u6D32",
      "\u523B",
      "\u62EC",
      "\u6FC0",
      "\u5B54",
      "\u641E",
      "\u751A",
      "\u5BA4",
      "\u5F85",
      "\u6838",
      "\u6821",
      "\u6563",
      "\u4FB5",
      "\u5427",
      "\u7532",
      "\u904A",
      "\u4E45",
      "\u83DC",
      "\u5473",
      "\u820A",
      "\u6A21",
      "\u6E56",
      "\u8CA8",
      "\u640D",
      "\u9810",
      "\u963B",
      "\u6BEB",
      "\u666E",
      "\u7A69",
      "\u4E59",
      "\u5ABD",
      "\u690D",
      "\u606F",
      "\u64F4",
      "\u9280",
      "\u8A9E",
      "\u63EE",
      "\u9152",
      "\u5B88",
      "\u62FF",
      "\u5E8F",
      "\u7D19",
      "\u91AB",
      "\u7F3A",
      "\u96E8",
      "\u55CE",
      "\u91DD",
      "\u5289",
      "\u554A",
      "\u6025",
      "\u5531",
      "\u8AA4",
      "\u8A13",
      "\u9858",
      "\u5BE9",
      "\u9644",
      "\u7372",
      "\u8336",
      "\u9BAE",
      "\u7CE7",
      "\u65A4",
      "\u5B69",
      "\u812B",
      "\u786B",
      "\u80A5",
      "\u5584",
      "\u9F8D",
      "\u6F14",
      "\u7236",
      "\u6F38",
      "\u8840",
      "\u6B61",
      "\u68B0",
      "\u638C",
      "\u6B4C",
      "\u6C99",
      "\u525B",
      "\u653B",
      "\u8B02",
      "\u76FE",
      "\u8A0E",
      "\u665A",
      "\u7C92",
      "\u4E82",
      "\u71C3",
      "\u77DB",
      "\u4E4E",
      "\u6BBA",
      "\u85E5",
      "\u5BE7",
      "\u9B6F",
      "\u8CB4",
      "\u9418",
      "\u7164",
      "\u8B80",
      "\u73ED",
      "\u4F2F",
      "\u9999",
      "\u4ECB",
      "\u8FEB",
      "\u53E5",
      "\u8C50",
      "\u57F9",
      "\u63E1",
      "\u862D",
      "\u64D4",
      "\u5F26",
      "\u86CB",
      "\u6C89",
      "\u5047",
      "\u7A7F",
      "\u57F7",
      "\u7B54",
      "\u6A02",
      "\u8AB0",
      "\u9806",
      "\u7159",
      "\u7E2E",
      "\u5FB5",
      "\u81C9",
      "\u559C",
      "\u677E",
      "\u8173",
      "\u56F0",
      "\u7570",
      "\u514D",
      "\u80CC",
      "\u661F",
      "\u798F",
      "\u8CB7",
      "\u67D3",
      "\u4E95",
      "\u6982",
      "\u6162",
      "\u6015",
      "\u78C1",
      "\u500D",
      "\u7956",
      "\u7687",
      "\u4FC3",
      "\u975C",
      "\u88DC",
      "\u8A55",
      "\u7FFB",
      "\u8089",
      "\u8E10",
      "\u5C3C",
      "\u8863",
      "\u5BEC",
      "\u63DA",
      "\u68C9",
      "\u5E0C",
      "\u50B7",
      "\u64CD",
      "\u5782",
      "\u79CB",
      "\u5B9C",
      "\u6C2B",
      "\u5957",
      "\u7763",
      "\u632F",
      "\u67B6",
      "\u4EAE",
      "\u672B",
      "\u61B2",
      "\u6176",
      "\u7DE8",
      "\u725B",
      "\u89F8",
      "\u6620",
      "\u96F7",
      "\u92B7",
      "\u8A69",
      "\u5EA7",
      "\u5C45",
      "\u6293",
      "\u88C2",
      "\u80DE",
      "\u547C",
      "\u5A18",
      "\u666F",
      "\u5A01",
      "\u7DA0",
      "\u6676",
      "\u539A",
      "\u76DF",
      "\u8861",
      "\u96DE",
      "\u5B6B",
      "\u5EF6",
      "\u5371",
      "\u81A0",
      "\u5C4B",
      "\u9109",
      "\u81E8",
      "\u9678",
      "\u9867",
      "\u6389",
      "\u5440",
      "\u71C8",
      "\u6B72",
      "\u63AA",
      "\u675F",
      "\u8010",
      "\u5287",
      "\u7389",
      "\u8D99",
      "\u8DF3",
      "\u54E5",
      "\u5B63",
      "\u8AB2",
      "\u51F1",
      "\u80E1",
      "\u984D",
      "\u6B3E",
      "\u7D39",
      "\u5377",
      "\u9F4A",
      "\u5049",
      "\u84B8",
      "\u6B96",
      "\u6C38",
      "\u5B97",
      "\u82D7",
      "\u5DDD",
      "\u7210",
      "\u5CA9",
      "\u5F31",
      "\u96F6",
      "\u694A",
      "\u594F",
      "\u6CBF",
      "\u9732",
      "\u687F",
      "\u63A2",
      "\u6ED1",
      "\u93AE",
      "\u98EF",
      "\u6FC3",
      "\u822A",
      "\u61F7",
      "\u8D95",
      "\u5EAB",
      "\u596A",
      "\u4F0A",
      "\u9748",
      "\u7A05",
      "\u9014",
      "\u6EC5",
      "\u8CFD",
      "\u6B78",
      "\u53EC",
      "\u9F13",
      "\u64AD",
      "\u76E4",
      "\u88C1",
      "\u96AA",
      "\u5EB7",
      "\u552F",
      "\u9304",
      "\u83CC",
      "\u7D14",
      "\u501F",
      "\u7CD6",
      "\u84CB",
      "\u6A6B",
      "\u7B26",
      "\u79C1",
      "\u52AA",
      "\u5802",
      "\u57DF",
      "\u69CD",
      "\u6F64",
      "\u5E45",
      "\u54C8",
      "\u7ADF",
      "\u719F",
      "\u87F2",
      "\u6FA4",
      "\u8166",
      "\u58E4",
      "\u78B3",
      "\u6B50",
      "\u904D",
      "\u5074",
      "\u5BE8",
      "\u6562",
      "\u5FB9",
      "\u616E",
      "\u659C",
      "\u8584",
      "\u5EAD",
      "\u7D0D",
      "\u5F48",
      "\u98FC",
      "\u4F38",
      "\u6298",
      "\u9EA5",
      "\u6FD5",
      "\u6697",
      "\u8377",
      "\u74E6",
      "\u585E",
      "\u5E8A",
      "\u7BC9",
      "\u60E1",
      "\u6236",
      "\u8A2A",
      "\u5854",
      "\u5947",
      "\u900F",
      "\u6881",
      "\u5200",
      "\u65CB",
      "\u8DE1",
      "\u5361",
      "\u6C2F",
      "\u9047",
      "\u4EFD",
      "\u6BD2",
      "\u6CE5",
      "\u9000",
      "\u6D17",
      "\u64FA",
      "\u7070",
      "\u5F69",
      "\u8CE3",
      "\u8017",
      "\u590F",
      "\u64C7",
      "\u5FD9",
      "\u9285",
      "\u737B",
      "\u786C",
      "\u4E88",
      "\u7E41",
      "\u5708",
      "\u96EA",
      "\u51FD",
      "\u4EA6",
      "\u62BD",
      "\u7BC7",
      "\u9663",
      "\u9670",
      "\u4E01",
      "\u5C3A",
      "\u8FFD",
      "\u5806",
      "\u96C4",
      "\u8FCE",
      "\u6CDB",
      "\u7238",
      "\u6A13",
      "\u907F",
      "\u8B00",
      "\u5678",
      "\u91CE",
      "\u8C6C",
      "\u65D7",
      "\u7D2F",
      "\u504F",
      "\u5178",
      "\u9928",
      "\u7D22",
      "\u79E6",
      "\u8102",
      "\u6F6E",
      "\u723A",
      "\u8C46",
      "\u5FFD",
      "\u6258",
      "\u9A5A",
      "\u5851",
      "\u907A",
      "\u6108",
      "\u6731",
      "\u66FF",
      "\u7E96",
      "\u7C97",
      "\u50BE",
      "\u5C1A",
      "\u75DB",
      "\u695A",
      "\u8B1D",
      "\u596E",
      "\u8CFC",
      "\u78E8",
      "\u541B",
      "\u6C60",
      "\u65C1",
      "\u788E",
      "\u9AA8",
      "\u76E3",
      "\u6355",
      "\u5F1F",
      "\u66B4",
      "\u5272",
      "\u8CAB",
      "\u6B8A",
      "\u91CB",
      "\u8A5E",
      "\u4EA1",
      "\u58C1",
      "\u9813",
      "\u5BF6",
      "\u5348",
      "\u5875",
      "\u805E",
      "\u63ED",
      "\u70AE",
      "\u6B98",
      "\u51AC",
      "\u6A4B",
      "\u5A66",
      "\u8B66",
      "\u7D9C",
      "\u62DB",
      "\u5433",
      "\u4ED8",
      "\u6D6E",
      "\u906D",
      "\u5F90",
      "\u60A8",
      "\u6416",
      "\u8C37",
      "\u8D0A",
      "\u7BB1",
      "\u9694",
      "\u8A02",
      "\u7537",
      "\u5439",
      "\u5712",
      "\u7D1B",
      "\u5510",
      "\u6557",
      "\u5B8B",
      "\u73BB",
      "\u5DE8",
      "\u8015",
      "\u5766",
      "\u69AE",
      "\u9589",
      "\u7063",
      "\u9375",
      "\u51E1",
      "\u99D0",
      "\u934B",
      "\u6551",
      "\u6069",
      "\u525D",
      "\u51DD",
      "\u9E7C",
      "\u9F52",
      "\u622A",
      "\u7149",
      "\u9EBB",
      "\u7D21",
      "\u7981",
      "\u5EE2",
      "\u76DB",
      "\u7248",
      "\u7DE9",
      "\u6DE8",
      "\u775B",
      "\u660C",
      "\u5A5A",
      "\u6D89",
      "\u7B52",
      "\u5634",
      "\u63D2",
      "\u5CB8",
      "\u6717",
      "\u838A",
      "\u8857",
      "\u85CF",
      "\u59D1",
      "\u8CBF",
      "\u8150",
      "\u5974",
      "\u5566",
      "\u6163",
      "\u4E58",
      "\u5925",
      "\u6062",
      "\u52FB",
      "\u7D17",
      "\u624E",
      "\u8FAF",
      "\u8033",
      "\u5F6A",
      "\u81E3",
      "\u5104",
      "\u7483",
      "\u62B5",
      "\u8108",
      "\u79C0",
      "\u85A9",
      "\u4FC4",
      "\u7DB2",
      "\u821E",
      "\u5E97",
      "\u5674",
      "\u7E31",
      "\u5BF8",
      "\u6C57",
      "\u639B",
      "\u6D2A",
      "\u8CC0",
      "\u9583",
      "\u67EC",
      "\u7206",
      "\u70EF",
      "\u6D25",
      "\u7A3B",
      "\u7246",
      "\u8EDF",
      "\u52C7",
      "\u50CF",
      "\u6EFE",
      "\u5398",
      "\u8499",
      "\u82B3",
      "\u80AF",
      "\u5761",
      "\u67F1",
      "\u76EA",
      "\u817F",
      "\u5100",
      "\u65C5",
      "\u5C3E",
      "\u8ECB",
      "\u51B0",
      "\u8CA2",
      "\u767B",
      "\u9ECE",
      "\u524A",
      "\u947D",
      "\u52D2",
      "\u9003",
      "\u969C",
      "\u6C28",
      "\u90ED",
      "\u5CF0",
      "\u5E63",
      "\u6E2F",
      "\u4F0F",
      "\u8ECC",
      "\u755D",
      "\u7562",
      "\u64E6",
      "\u83AB",
      "\u523A",
      "\u6D6A",
      "\u79D8",
      "\u63F4",
      "\u682A",
      "\u5065",
      "\u552E",
      "\u80A1",
      "\u5CF6",
      "\u7518",
      "\u6CE1",
      "\u7761",
      "\u7AE5",
      "\u9444",
      "\u6E6F",
      "\u95A5",
      "\u4F11",
      "\u532F",
      "\u820D",
      "\u7267",
      "\u7E5E",
      "\u70B8",
      "\u54F2",
      "\u78F7",
      "\u7E3E",
      "\u670B",
      "\u6DE1",
      "\u5C16",
      "\u555F",
      "\u9677",
      "\u67F4",
      "\u5448",
      "\u5F92",
      "\u984F",
      "\u6DDA",
      "\u7A0D",
      "\u5FD8",
      "\u6CF5",
      "\u85CD",
      "\u62D6",
      "\u6D1E",
      "\u6388",
      "\u93E1",
      "\u8F9B",
      "\u58EF",
      "\u92D2",
      "\u8CA7",
      "\u865B",
      "\u5F4E",
      "\u6469",
      "\u6CF0",
      "\u5E7C",
      "\u5EF7",
      "\u5C0A",
      "\u7A97",
      "\u7DB1",
      "\u5F04",
      "\u96B8",
      "\u7591",
      "\u6C0F",
      "\u5BAE",
      "\u59D0",
      "\u9707",
      "\u745E",
      "\u602A",
      "\u5C24",
      "\u7434",
      "\u5FAA",
      "\u63CF",
      "\u819C",
      "\u9055",
      "\u593E",
      "\u8170",
      "\u7DE3",
      "\u73E0",
      "\u7AAE",
      "\u68EE",
      "\u679D",
      "\u7AF9",
      "\u6E9D",
      "\u50AC",
      "\u7E69",
      "\u61B6",
      "\u90A6",
      "\u5269",
      "\u5E78",
      "\u6F3F",
      "\u6B04",
      "\u64C1",
      "\u7259",
      "\u8CAF",
      "\u79AE",
      "\u6FFE",
      "\u9209",
      "\u7D0B",
      "\u7F77",
      "\u62CD",
      "\u54B1",
      "\u558A",
      "\u8896",
      "\u57C3",
      "\u52E4",
      "\u7F70",
      "\u7126",
      "\u6F5B",
      "\u4F0D",
      "\u58A8",
      "\u6B32",
      "\u7E2B",
      "\u59D3",
      "\u520A",
      "\u98FD",
      "\u4EFF",
      "\u734E",
      "\u92C1",
      "\u9B3C",
      "\u9E97",
      "\u8DE8",
      "\u9ED8",
      "\u6316",
      "\u93C8",
      "\u6383",
      "\u559D",
      "\u888B",
      "\u70AD",
      "\u6C61",
      "\u5E55",
      "\u8AF8",
      "\u5F27",
      "\u52F5",
      "\u6885",
      "\u5976",
      "\u6F54",
      "\u707D",
      "\u821F",
      "\u9451",
      "\u82EF",
      "\u8A1F",
      "\u62B1",
      "\u6BC0",
      "\u61C2",
      "\u5BD2",
      "\u667A",
      "\u57D4",
      "\u5BC4",
      "\u5C46",
      "\u8E8D",
      "\u6E21",
      "\u6311",
      "\u4E39",
      "\u8271",
      "\u8C9D",
      "\u78B0",
      "\u62D4",
      "\u7239",
      "\u6234",
      "\u78BC",
      "\u5922",
      "\u82BD",
      "\u7194",
      "\u8D64",
      "\u6F01",
      "\u54ED",
      "\u656C",
      "\u9846",
      "\u5954",
      "\u925B",
      "\u4EF2",
      "\u864E",
      "\u7A00",
      "\u59B9",
      "\u4E4F",
      "\u73CD",
      "\u7533",
      "\u684C",
      "\u9075",
      "\u5141",
      "\u9686",
      "\u87BA",
      "\u5009",
      "\u9B4F",
      "\u92B3",
      "\u66C9",
      "\u6C2E",
      "\u517C",
      "\u96B1",
      "\u7919",
      "\u8D6B",
      "\u64A5",
      "\u5FE0",
      "\u8085",
      "\u7F38",
      "\u727D",
      "\u6436",
      "\u535A",
      "\u5DE7",
      "\u6BBC",
      "\u5144",
      "\u675C",
      "\u8A0A",
      "\u8AA0",
      "\u78A7",
      "\u7965",
      "\u67EF",
      "\u9801",
      "\u5DE1",
      "\u77E9",
      "\u60B2",
      "\u704C",
      "\u9F61",
      "\u502B",
      "\u7968",
      "\u5C0B",
      "\u6842",
      "\u92EA",
      "\u8056",
      "\u6050",
      "\u6070",
      "\u912D",
      "\u8DA3",
      "\u62AC",
      "\u8352",
      "\u9A30",
      "\u8CBC",
      "\u67D4",
      "\u6EF4",
      "\u731B",
      "\u95CA",
      "\u8F1B",
      "\u59BB",
      "\u586B",
      "\u64A4",
      "\u5132",
      "\u7C3D",
      "\u9B27",
      "\u64FE",
      "\u7D2B",
      "\u7802",
      "\u905E",
      "\u6232",
      "\u540A",
      "\u9676",
      "\u4F10",
      "\u9935",
      "\u7642",
      "\u74F6",
      "\u5A46",
      "\u64AB",
      "\u81C2",
      "\u6478",
      "\u5FCD",
      "\u8766",
      "\u881F",
      "\u9130",
      "\u80F8",
      "\u978F",
      "\u64E0",
      "\u5076",
      "\u68C4",
      "\u69FD",
      "\u52C1",
      "\u4E73",
      "\u9127",
      "\u5409",
      "\u4EC1",
      "\u721B",
      "\u78DA",
      "\u79DF",
      "\u70CF",
      "\u8266",
      "\u4F34",
      "\u74DC",
      "\u6DFA",
      "\u4E19",
      "\u66AB",
      "\u71E5",
      "\u6A61",
      "\u67F3",
      "\u8FF7",
      "\u6696",
      "\u724C",
      "\u79E7",
      "\u81BD",
      "\u8A73",
      "\u7C27",
      "\u8E0F",
      "\u74F7",
      "\u8B5C",
      "\u5446",
      "\u8CD3",
      "\u7CCA",
      "\u6D1B",
      "\u8F1D",
      "\u61A4",
      "\u7AF6",
      "\u9699",
      "\u6012",
      "\u7C98",
      "\u4E43",
      "\u7DD2",
      "\u80A9",
      "\u7C4D",
      "\u654F",
      "\u5857",
      "\u7199",
      "\u7686",
      "\u5075",
      "\u61F8",
      "\u6398",
      "\u4EAB",
      "\u7CFE",
      "\u9192",
      "\u72C2",
      "\u9396",
      "\u6DC0",
      "\u6068",
      "\u7272",
      "\u9738",
      "\u722C",
      "\u8CDE",
      "\u9006",
      "\u73A9",
      "\u9675",
      "\u795D",
      "\u79D2",
      "\u6D59",
      "\u8C8C",
      "\u5F79",
      "\u5F7C",
      "\u6089",
      "\u9D28",
      "\u8DA8",
      "\u9CF3",
      "\u6668",
      "\u755C",
      "\u8F29",
      "\u79E9",
      "\u5375",
      "\u7F72",
      "\u68AF",
      "\u708E",
      "\u7058",
      "\u68CB",
      "\u9A45",
      "\u7BE9",
      "\u5CFD",
      "\u5192",
      "\u5565",
      "\u58FD",
      "\u8B6F",
      "\u6D78",
      "\u6CC9",
      "\u5E3D",
      "\u9072",
      "\u77FD",
      "\u7586",
      "\u8CB8",
      "\u6F0F",
      "\u7A3F",
      "\u51A0",
      "\u5AE9",
      "\u8105",
      "\u82AF",
      "\u7262",
      "\u53DB",
      "\u8755",
      "\u5967",
      "\u9CF4",
      "\u5DBA",
      "\u7F8A",
      "\u6191",
      "\u4E32",
      "\u5858",
      "\u7E6A",
      "\u9175",
      "\u878D",
      "\u76C6",
      "\u932B",
      "\u5EDF",
      "\u7C4C",
      "\u51CD",
      "\u8F14",
      "\u651D",
      "\u8972",
      "\u7B4B",
      "\u62D2",
      "\u50DA",
      "\u65F1",
      "\u9240",
      "\u9CE5",
      "\u6F06",
      "\u6C88",
      "\u7709",
      "\u758F",
      "\u6DFB",
      "\u68D2",
      "\u7A57",
      "\u785D",
      "\u97D3",
      "\u903C",
      "\u626D",
      "\u50D1",
      "\u6DBC",
      "\u633A",
      "\u7897",
      "\u683D",
      "\u7092",
      "\u676F",
      "\u60A3",
      "\u993E",
      "\u52F8",
      "\u8C6A",
      "\u907C",
      "\u52C3",
      "\u9D3B",
      "\u65E6",
      "\u540F",
      "\u62DC",
      "\u72D7",
      "\u57CB",
      "\u8F25",
      "\u63A9",
      "\u98F2",
      "\u642C",
      "\u7F75",
      "\u8FAD",
      "\u52FE",
      "\u6263",
      "\u4F30",
      "\u8523",
      "\u7D68",
      "\u9727",
      "\u4E08",
      "\u6735",
      "\u59C6",
      "\u64EC",
      "\u5B87",
      "\u8F2F",
      "\u965D",
      "\u96D5",
      "\u511F",
      "\u84C4",
      "\u5D07",
      "\u526A",
      "\u5021",
      "\u5EF3",
      "\u54AC",
      "\u99DB",
      "\u85AF",
      "\u5237",
      "\u65A5",
      "\u756A",
      "\u8CE6",
      "\u5949",
      "\u4F5B",
      "\u6F86",
      "\u6F2B",
      "\u66FC",
      "\u6247",
      "\u9223",
      "\u6843",
      "\u6276",
      "\u4ED4",
      "\u8FD4",
      "\u4FD7",
      "\u8667",
      "\u8154",
      "\u978B",
      "\u68F1",
      "\u8986",
      "\u6846",
      "\u6084",
      "\u53D4",
      "\u649E",
      "\u9A19",
      "\u52D8",
      "\u65FA",
      "\u6CB8",
      "\u5B64",
      "\u5410",
      "\u5B5F",
      "\u6E20",
      "\u5C48",
      "\u75BE",
      "\u5999",
      "\u60DC",
      "\u4EF0",
      "\u72E0",
      "\u8139",
      "\u8AE7",
      "\u62CB",
      "\u9EF4",
      "\u6851",
      "\u5D17",
      "\u561B",
      "\u8870",
      "\u76DC",
      "\u6EF2",
      "\u81DF",
      "\u8CF4",
      "\u6E67",
      "\u751C",
      "\u66F9",
      "\u95B1",
      "\u808C",
      "\u54E9",
      "\u53B2",
      "\u70F4",
      "\u7DEF",
      "\u6BC5",
      "\u6628",
      "\u507D",
      "\u75C7",
      "\u716E",
      "\u5606",
      "\u91D8",
      "\u642D",
      "\u8396",
      "\u7C60",
      "\u9177",
      "\u5077",
      "\u5F13",
      "\u9310",
      "\u6046",
      "\u5091",
      "\u5751",
      "\u9F3B",
      "\u7FFC",
      "\u7DB8",
      "\u6558",
      "\u7344",
      "\u902E",
      "\u7F50",
      "\u7D61",
      "\u68DA",
      "\u6291",
      "\u81A8",
      "\u852C",
      "\u5BFA",
      "\u9A5F",
      "\u7A46",
      "\u51B6",
      "\u67AF",
      "\u518A",
      "\u5C4D",
      "\u51F8",
      "\u7D33",
      "\u576F",
      "\u72A7",
      "\u7130",
      "\u8F5F",
      "\u6B23",
      "\u6649",
      "\u7626",
      "\u79A6",
      "\u9320",
      "\u9326",
      "\u55AA",
      "\u65EC",
      "\u935B",
      "\u58DF",
      "\u641C",
      "\u64B2",
      "\u9080",
      "\u4EAD",
      "\u916F",
      "\u9081",
      "\u8212",
      "\u8106",
      "\u9176",
      "\u9592",
      "\u6182",
      "\u915A",
      "\u9811",
      "\u7FBD",
      "\u6F32",
      "\u5378",
      "\u4ED7",
      "\u966A",
      "\u95E2",
      "\u61F2",
      "\u676D",
      "\u59DA",
      "\u809A",
      "\u6349",
      "\u98C4",
      "\u6F02",
      "\u6606",
      "\u6B3A",
      "\u543E",
      "\u90CE",
      "\u70F7",
      "\u6C41",
      "\u5475",
      "\u98FE",
      "\u856D",
      "\u96C5",
      "\u90F5",
      "\u9077",
      "\u71D5",
      "\u6492",
      "\u59FB",
      "\u8D74",
      "\u5BB4",
      "\u7169",
      "\u50B5",
      "\u5E33",
      "\u6591",
      "\u9234",
      "\u65E8",
      "\u9187",
      "\u8463",
      "\u9905",
      "\u96DB",
      "\u59FF",
      "\u62CC",
      "\u5085",
      "\u8179",
      "\u59A5",
      "\u63C9",
      "\u8CE2",
      "\u62C6",
      "\u6B6A",
      "\u8461",
      "\u80FA",
      "\u4E1F",
      "\u6D69",
      "\u5FBD",
      "\u6602",
      "\u588A",
      "\u64CB",
      "\u89BD",
      "\u8CAA",
      "\u6170",
      "\u7E73",
      "\u6C6A",
      "\u614C",
      "\u99AE",
      "\u8AFE",
      "\u59DC",
      "\u8ABC",
      "\u5147",
      "\u52A3",
      "\u8AA3",
      "\u8000",
      "\u660F",
      "\u8EBA",
      "\u76C8",
      "\u9A0E",
      "\u55AC",
      "\u6EAA",
      "\u53E2",
      "\u76E7",
      "\u62B9",
      "\u60B6",
      "\u8AEE",
      "\u522E",
      "\u99D5",
      "\u7E9C",
      "\u609F",
      "\u6458",
      "\u927A",
      "\u64F2",
      "\u9817",
      "\u5E7B",
      "\u67C4",
      "\u60E0",
      "\u6158",
      "\u4F73",
      "\u4EC7",
      "\u81D8",
      "\u7AA9",
      "\u6ECC",
      "\u528D",
      "\u77A7",
      "\u5821",
      "\u6F51",
      "\u8525",
      "\u7F69",
      "\u970D",
      "\u6488",
      "\u80CE",
      "\u84BC",
      "\u6FF1",
      "\u5006",
      "\u6345",
      "\u6E58",
      "\u780D",
      "\u971E",
      "\u90B5",
      "\u8404",
      "\u760B",
      "\u6DEE",
      "\u9042",
      "\u718A",
      "\u7CDE",
      "\u70D8",
      "\u5BBF",
      "\u6A94",
      "\u6208",
      "\u99C1",
      "\u5AC2",
      "\u88D5",
      "\u5F99",
      "\u7BAD",
      "\u6350",
      "\u8178",
      "\u6490",
      "\u66EC",
      "\u8FA8",
      "\u6BBF",
      "\u84EE",
      "\u6524",
      "\u652A",
      "\u91AC",
      "\u5C4F",
      "\u75AB",
      "\u54C0",
      "\u8521",
      "\u5835",
      "\u6CAB",
      "\u76BA",
      "\u66A2",
      "\u758A",
      "\u95A3",
      "\u840A",
      "\u6572",
      "\u8F44",
      "\u9264",
      "\u75D5",
      "\u58E9",
      "\u5DF7",
      "\u9913",
      "\u798D",
      "\u4E18",
      "\u7384",
      "\u6E9C",
      "\u66F0",
      "\u908F",
      "\u5F6D",
      "\u5617",
      "\u537F",
      "\u59A8",
      "\u8247",
      "\u541E",
      "\u97CB",
      "\u6028",
      "\u77EE",
      "\u6B47"
    ];
  }
});

// ../node_modules/bip39/src/wordlists/korean.json
var require_korean = __commonJS({
  "../node_modules/bip39/src/wordlists/korean.json"(exports, module) {
    module.exports = [
      "\u1100\u1161\u1100\u1167\u11A8",
      "\u1100\u1161\u1101\u1173\u11B7",
      "\u1100\u1161\u1102\u1161\u11AB",
      "\u1100\u1161\u1102\u1173\u11BC",
      "\u1100\u1161\u1103\u1173\u11A8",
      "\u1100\u1161\u1105\u1173\u110E\u1175\u11B7",
      "\u1100\u1161\u1106\u116E\u11B7",
      "\u1100\u1161\u1107\u1161\u11BC",
      "\u1100\u1161\u1109\u1161\u11BC",
      "\u1100\u1161\u1109\u1173\u11B7",
      "\u1100\u1161\u110B\u116E\u11AB\u1103\u1166",
      "\u1100\u1161\u110B\u1173\u11AF",
      "\u1100\u1161\u110B\u1175\u1103\u1173",
      "\u1100\u1161\u110B\u1175\u11B8",
      "\u1100\u1161\u110C\u1161\u11BC",
      "\u1100\u1161\u110C\u1165\u11BC",
      "\u1100\u1161\u110C\u1169\u11A8",
      "\u1100\u1161\u110C\u116E\u11A8",
      "\u1100\u1161\u11A8\u110B\u1169",
      "\u1100\u1161\u11A8\u110C\u1161",
      "\u1100\u1161\u11AB\u1100\u1167\u11A8",
      "\u1100\u1161\u11AB\u1107\u116E",
      "\u1100\u1161\u11AB\u1109\u1165\u11B8",
      "\u1100\u1161\u11AB\u110C\u1161\u11BC",
      "\u1100\u1161\u11AB\u110C\u1165\u11B8",
      "\u1100\u1161\u11AB\u1111\u1161\u11AB",
      "\u1100\u1161\u11AF\u1103\u1173\u11BC",
      "\u1100\u1161\u11AF\u1107\u1175",
      "\u1100\u1161\u11AF\u1109\u1162\u11A8",
      "\u1100\u1161\u11AF\u110C\u1173\u11BC",
      "\u1100\u1161\u11B7\u1100\u1161\u11A8",
      "\u1100\u1161\u11B7\u1100\u1175",
      "\u1100\u1161\u11B7\u1109\u1169",
      "\u1100\u1161\u11B7\u1109\u116E\u1109\u1165\u11BC",
      "\u1100\u1161\u11B7\u110C\u1161",
      "\u1100\u1161\u11B7\u110C\u1165\u11BC",
      "\u1100\u1161\u11B8\u110C\u1161\u1100\u1175",
      "\u1100\u1161\u11BC\u1102\u1161\u11B7",
      "\u1100\u1161\u11BC\u1103\u1161\u11BC",
      "\u1100\u1161\u11BC\u1103\u1169",
      "\u1100\u1161\u11BC\u1105\u1167\u11A8\u1112\u1175",
      "\u1100\u1161\u11BC\u1107\u1167\u11AB",
      "\u1100\u1161\u11BC\u1107\u116E\u11A8",
      "\u1100\u1161\u11BC\u1109\u1161",
      "\u1100\u1161\u11BC\u1109\u116E\u1105\u1163\u11BC",
      "\u1100\u1161\u11BC\u110B\u1161\u110C\u1175",
      "\u1100\u1161\u11BC\u110B\u116F\u11AB\u1103\u1169",
      "\u1100\u1161\u11BC\u110B\u1174",
      "\u1100\u1161\u11BC\u110C\u1166",
      "\u1100\u1161\u11BC\u110C\u1169",
      "\u1100\u1161\u11C0\u110B\u1175",
      "\u1100\u1162\u1100\u116E\u1105\u1175",
      "\u1100\u1162\u1102\u1161\u1105\u1175",
      "\u1100\u1162\u1107\u1161\u11BC",
      "\u1100\u1162\u1107\u1167\u11AF",
      "\u1100\u1162\u1109\u1165\u11AB",
      "\u1100\u1162\u1109\u1165\u11BC",
      "\u1100\u1162\u110B\u1175\u11AB",
      "\u1100\u1162\u11A8\u1100\u116A\u11AB\u110C\u1165\u11A8",
      "\u1100\u1165\u1109\u1175\u11AF",
      "\u1100\u1165\u110B\u1162\u11A8",
      "\u1100\u1165\u110B\u116E\u11AF",
      "\u1100\u1165\u110C\u1175\u11BA",
      "\u1100\u1165\u1111\u116E\u11B7",
      "\u1100\u1165\u11A8\u110C\u1165\u11BC",
      "\u1100\u1165\u11AB\u1100\u1161\u11BC",
      "\u1100\u1165\u11AB\u1106\u116E\u11AF",
      "\u1100\u1165\u11AB\u1109\u1165\u11AF",
      "\u1100\u1165\u11AB\u110C\u1169",
      "\u1100\u1165\u11AB\u110E\u116E\u11A8",
      "\u1100\u1165\u11AF\u110B\u1173\u11B7",
      "\u1100\u1165\u11B7\u1109\u1161",
      "\u1100\u1165\u11B7\u1110\u1169",
      "\u1100\u1166\u1109\u1175\u1111\u1161\u11AB",
      "\u1100\u1166\u110B\u1175\u11B7",
      "\u1100\u1167\u110B\u116E\u11AF",
      "\u1100\u1167\u11AB\u1112\u1162",
      "\u1100\u1167\u11AF\u1100\u116A",
      "\u1100\u1167\u11AF\u1100\u116E\u11A8",
      "\u1100\u1167\u11AF\u1105\u1169\u11AB",
      "\u1100\u1167\u11AF\u1109\u1165\u11A8",
      "\u1100\u1167\u11AF\u1109\u1173\u11BC",
      "\u1100\u1167\u11AF\u1109\u1175\u11B7",
      "\u1100\u1167\u11AF\u110C\u1165\u11BC",
      "\u1100\u1167\u11AF\u1112\u1169\u11AB",
      "\u1100\u1167\u11BC\u1100\u1168",
      "\u1100\u1167\u11BC\u1100\u1169",
      "\u1100\u1167\u11BC\u1100\u1175",
      "\u1100\u1167\u11BC\u1105\u1167\u11A8",
      "\u1100\u1167\u11BC\u1107\u1169\u11A8\u1100\u116E\u11BC",
      "\u1100\u1167\u11BC\u1107\u1175",
      "\u1100\u1167\u11BC\u1109\u1161\u11BC\u1103\u1169",
      "\u1100\u1167\u11BC\u110B\u1167\u11BC",
      "\u1100\u1167\u11BC\u110B\u116E",
      "\u1100\u1167\u11BC\u110C\u1162\u11BC",
      "\u1100\u1167\u11BC\u110C\u1166",
      "\u1100\u1167\u11BC\u110C\u116E",
      "\u1100\u1167\u11BC\u110E\u1161\u11AF",
      "\u1100\u1167\u11BC\u110E\u1175",
      "\u1100\u1167\u11BC\u1112\u1163\u11BC",
      "\u1100\u1167\u11BC\u1112\u1165\u11B7",
      "\u1100\u1168\u1100\u1169\u11A8",
      "\u1100\u1168\u1103\u1161\u11AB",
      "\u1100\u1168\u1105\u1161\u11AB",
      "\u1100\u1168\u1109\u1161\u11AB",
      "\u1100\u1168\u1109\u1169\u11A8",
      "\u1100\u1168\u110B\u1163\u11A8",
      "\u1100\u1168\u110C\u1165\u11AF",
      "\u1100\u1168\u110E\u1173\u11BC",
      "\u1100\u1168\u1112\u116C\u11A8",
      "\u1100\u1169\u1100\u1162\u11A8",
      "\u1100\u1169\u1100\u116E\u1105\u1167",
      "\u1100\u1169\u1100\u116E\u11BC",
      "\u1100\u1169\u1100\u1173\u11B8",
      "\u1100\u1169\u1103\u1173\u11BC\u1112\u1161\u11A8\u1109\u1162\u11BC",
      "\u1100\u1169\u1106\u116E\u1109\u1175\u11AB",
      "\u1100\u1169\u1106\u1175\u11AB",
      "\u1100\u1169\u110B\u1163\u11BC\u110B\u1175",
      "\u1100\u1169\u110C\u1161\u11BC",
      "\u1100\u1169\u110C\u1165\u11AB",
      "\u1100\u1169\u110C\u1175\u11B8",
      "\u1100\u1169\u110E\u116E\u11BA\u1100\u1161\u1105\u116E",
      "\u1100\u1169\u1110\u1169\u11BC",
      "\u1100\u1169\u1112\u1163\u11BC",
      "\u1100\u1169\u11A8\u1109\u1175\u11A8",
      "\u1100\u1169\u11AF\u1106\u1169\u11A8",
      "\u1100\u1169\u11AF\u110D\u1161\u1100\u1175",
      "\u1100\u1169\u11AF\u1111\u1173",
      "\u1100\u1169\u11BC\u1100\u1161\u11AB",
      "\u1100\u1169\u11BC\u1100\u1162",
      "\u1100\u1169\u11BC\u1100\u1167\u11A8",
      "\u1100\u1169\u11BC\u1100\u116E\u11AB",
      "\u1100\u1169\u11BC\u1100\u1173\u11B8",
      "\u1100\u1169\u11BC\u1100\u1175",
      "\u1100\u1169\u11BC\u1103\u1169\u11BC",
      "\u1100\u1169\u11BC\u1106\u116E\u110B\u116F\u11AB",
      "\u1100\u1169\u11BC\u1107\u116E",
      "\u1100\u1169\u11BC\u1109\u1161",
      "\u1100\u1169\u11BC\u1109\u1175\u11A8",
      "\u1100\u1169\u11BC\u110B\u1165\u11B8",
      "\u1100\u1169\u11BC\u110B\u1167\u11AB",
      "\u1100\u1169\u11BC\u110B\u116F\u11AB",
      "\u1100\u1169\u11BC\u110C\u1161\u11BC",
      "\u1100\u1169\u11BC\u110D\u1161",
      "\u1100\u1169\u11BC\u110E\u1162\u11A8",
      "\u1100\u1169\u11BC\u1110\u1169\u11BC",
      "\u1100\u1169\u11BC\u1111\u1169",
      "\u1100\u1169\u11BC\u1112\u1161\u11BC",
      "\u1100\u1169\u11BC\u1112\u1172\u110B\u1175\u11AF",
      "\u1100\u116A\u1106\u1169\u11A8",
      "\u1100\u116A\u110B\u1175\u11AF",
      "\u1100\u116A\u110C\u1161\u11BC",
      "\u1100\u116A\u110C\u1165\u11BC",
      "\u1100\u116A\u1112\u1161\u11A8",
      "\u1100\u116A\u11AB\u1100\u1162\u11A8",
      "\u1100\u116A\u11AB\u1100\u1168",
      "\u1100\u116A\u11AB\u1100\u116A\u11BC",
      "\u1100\u116A\u11AB\u1102\u1167\u11B7",
      "\u1100\u116A\u11AB\u1105\u1161\u11B7",
      "\u1100\u116A\u11AB\u1105\u1167\u11AB",
      "\u1100\u116A\u11AB\u1105\u1175",
      "\u1100\u116A\u11AB\u1109\u1173\u11B8",
      "\u1100\u116A\u11AB\u1109\u1175\u11B7",
      "\u1100\u116A\u11AB\u110C\u1165\u11B7",
      "\u1100\u116A\u11AB\u110E\u1161\u11AF",
      "\u1100\u116A\u11BC\u1100\u1167\u11BC",
      "\u1100\u116A\u11BC\u1100\u1169",
      "\u1100\u116A\u11BC\u110C\u1161\u11BC",
      "\u1100\u116A\u11BC\u110C\u116E",
      "\u1100\u116C\u1105\u1169\u110B\u116E\u11B7",
      "\u1100\u116C\u11BC\u110C\u1161\u11BC\u1112\u1175",
      "\u1100\u116D\u1100\u116A\u1109\u1165",
      "\u1100\u116D\u1106\u116E\u11AB",
      "\u1100\u116D\u1107\u1169\u11A8",
      "\u1100\u116D\u1109\u1175\u11AF",
      "\u1100\u116D\u110B\u1163\u11BC",
      "\u1100\u116D\u110B\u1172\u11A8",
      "\u1100\u116D\u110C\u1161\u11BC",
      "\u1100\u116D\u110C\u1175\u11A8",
      "\u1100\u116D\u1110\u1169\u11BC",
      "\u1100\u116D\u1112\u116A\u11AB",
      "\u1100\u116D\u1112\u116E\u11AB",
      "\u1100\u116E\u1100\u1167\u11BC",
      "\u1100\u116E\u1105\u1173\u11B7",
      "\u1100\u116E\u1106\u1165\u11BC",
      "\u1100\u116E\u1107\u1167\u11AF",
      "\u1100\u116E\u1107\u116E\u11AB",
      "\u1100\u116E\u1109\u1165\u11A8",
      "\u1100\u116E\u1109\u1165\u11BC",
      "\u1100\u116E\u1109\u1169\u11A8",
      "\u1100\u116E\u110B\u1167\u11A8",
      "\u1100\u116E\u110B\u1175\u11B8",
      "\u1100\u116E\u110E\u1165\u11BC",
      "\u1100\u116E\u110E\u1166\u110C\u1165\u11A8",
      "\u1100\u116E\u11A8\u1100\u1161",
      "\u1100\u116E\u11A8\u1100\u1175",
      "\u1100\u116E\u11A8\u1102\u1162",
      "\u1100\u116E\u11A8\u1105\u1175\u11B8",
      "\u1100\u116E\u11A8\u1106\u116E\u11AF",
      "\u1100\u116E\u11A8\u1106\u1175\u11AB",
      "\u1100\u116E\u11A8\u1109\u116E",
      "\u1100\u116E\u11A8\u110B\u1165",
      "\u1100\u116E\u11A8\u110B\u116A\u11BC",
      "\u1100\u116E\u11A8\u110C\u1165\u11A8",
      "\u1100\u116E\u11A8\u110C\u1166",
      "\u1100\u116E\u11A8\u1112\u116C",
      "\u1100\u116E\u11AB\u1103\u1162",
      "\u1100\u116E\u11AB\u1109\u1161",
      "\u1100\u116E\u11AB\u110B\u1175\u11AB",
      "\u1100\u116E\u11BC\u1100\u1173\u11A8\u110C\u1165\u11A8",
      "\u1100\u116F\u11AB\u1105\u1175",
      "\u1100\u116F\u11AB\u110B\u1171",
      "\u1100\u116F\u11AB\u1110\u116E",
      "\u1100\u1171\u1100\u116E\u11A8",
      "\u1100\u1171\u1109\u1175\u11AB",
      "\u1100\u1172\u110C\u1165\u11BC",
      "\u1100\u1172\u110E\u1175\u11A8",
      "\u1100\u1172\u11AB\u1112\u1167\u11BC",
      "\u1100\u1173\u1102\u1161\u11AF",
      "\u1100\u1173\u1102\u1163\u11BC",
      "\u1100\u1173\u1102\u1173\u11AF",
      "\u1100\u1173\u1105\u1165\u1102\u1161",
      "\u1100\u1173\u1105\u116E\u11B8",
      "\u1100\u1173\u1105\u1173\u11BA",
      "\u1100\u1173\u1105\u1175\u11B7",
      "\u1100\u1173\u110C\u1166\u1109\u1165\u110B\u1163",
      "\u1100\u1173\u1110\u1169\u1105\u1169\u11A8",
      "\u1100\u1173\u11A8\u1107\u1169\u11A8",
      "\u1100\u1173\u11A8\u1112\u1175",
      "\u1100\u1173\u11AB\u1100\u1165",
      "\u1100\u1173\u11AB\u1100\u116D",
      "\u1100\u1173\u11AB\u1105\u1162",
      "\u1100\u1173\u11AB\u1105\u1169",
      "\u1100\u1173\u11AB\u1106\u116E",
      "\u1100\u1173\u11AB\u1107\u1169\u11AB",
      "\u1100\u1173\u11AB\u110B\u116F\u11AB",
      "\u1100\u1173\u11AB\u110B\u1172\u11A8",
      "\u1100\u1173\u11AB\u110E\u1165",
      "\u1100\u1173\u11AF\u110A\u1175",
      "\u1100\u1173\u11AF\u110C\u1161",
      "\u1100\u1173\u11B7\u1100\u1161\u11BC\u1109\u1161\u11AB",
      "\u1100\u1173\u11B7\u1100\u1169",
      "\u1100\u1173\u11B7\u1102\u1167\u11AB",
      "\u1100\u1173\u11B7\u1106\u1166\u1103\u1161\u11AF",
      "\u1100\u1173\u11B7\u110B\u1162\u11A8",
      "\u1100\u1173\u11B7\u110B\u1167\u11AB",
      "\u1100\u1173\u11B7\u110B\u116D\u110B\u1175\u11AF",
      "\u1100\u1173\u11B7\u110C\u1175",
      "\u1100\u1173\u11BC\u110C\u1165\u11BC\u110C\u1165\u11A8",
      "\u1100\u1175\u1100\u1161\u11AB",
      "\u1100\u1175\u1100\u116A\u11AB",
      "\u1100\u1175\u1102\u1167\u11B7",
      "\u1100\u1175\u1102\u1173\u11BC",
      "\u1100\u1175\u1103\u1169\u11A8\u1100\u116D",
      "\u1100\u1175\u1103\u116E\u11BC",
      "\u1100\u1175\u1105\u1169\u11A8",
      "\u1100\u1175\u1105\u1173\u11B7",
      "\u1100\u1175\u1107\u1165\u11B8",
      "\u1100\u1175\u1107\u1169\u11AB",
      "\u1100\u1175\u1107\u116E\u11AB",
      "\u1100\u1175\u1108\u1173\u11B7",
      "\u1100\u1175\u1109\u116E\u11A8\u1109\u1161",
      "\u1100\u1175\u1109\u116E\u11AF",
      "\u1100\u1175\u110B\u1165\u11A8",
      "\u1100\u1175\u110B\u1165\u11B8",
      "\u1100\u1175\u110B\u1169\u11AB",
      "\u1100\u1175\u110B\u116E\u11AB",
      "\u1100\u1175\u110B\u116F\u11AB",
      "\u1100\u1175\u110C\u1165\u11A8",
      "\u1100\u1175\u110C\u116E\u11AB",
      "\u1100\u1175\u110E\u1175\u11B7",
      "\u1100\u1175\u1112\u1169\u11AB",
      "\u1100\u1175\u1112\u116C\u11A8",
      "\u1100\u1175\u11AB\u1100\u1173\u11B8",
      "\u1100\u1175\u11AB\u110C\u1161\u11BC",
      "\u1100\u1175\u11AF\u110B\u1175",
      "\u1100\u1175\u11B7\u1107\u1161\u11B8",
      "\u1100\u1175\u11B7\u110E\u1175",
      "\u1100\u1175\u11B7\u1111\u1169\u1100\u1169\u11BC\u1112\u1161\u11BC",
      "\u1101\u1161\u11A8\u1103\u116E\u1100\u1175",
      "\u1101\u1161\u11B7\u1108\u1161\u11A8",
      "\u1101\u1162\u1103\u1161\u11AF\u110B\u1173\u11B7",
      "\u1101\u1162\u1109\u1169\u1100\u1173\u11B7",
      "\u1101\u1165\u11B8\u110C\u1175\u11AF",
      "\u1101\u1169\u11A8\u1103\u1162\u1100\u1175",
      "\u1101\u1169\u11BE\u110B\u1175\u11C1",
      "\u1102\u1161\u1103\u1173\u11AF\u110B\u1175",
      "\u1102\u1161\u1105\u1161\u11AB\u1112\u1175",
      "\u1102\u1161\u1106\u1165\u110C\u1175",
      "\u1102\u1161\u1106\u116E\u11AF",
      "\u1102\u1161\u110E\u1175\u11B7\u1107\u1161\u11AB",
      "\u1102\u1161\u1112\u1173\u11AF",
      "\u1102\u1161\u11A8\u110B\u1167\u11B8",
      "\u1102\u1161\u11AB\u1107\u1161\u11BC",
      "\u1102\u1161\u11AF\u1100\u1162",
      "\u1102\u1161\u11AF\u110A\u1175",
      "\u1102\u1161\u11AF\u110D\u1161",
      "\u1102\u1161\u11B7\u1102\u1167",
      "\u1102\u1161\u11B7\u1103\u1162\u1106\u116E\u11AB",
      "\u1102\u1161\u11B7\u1106\u1162",
      "\u1102\u1161\u11B7\u1109\u1161\u11AB",
      "\u1102\u1161\u11B7\u110C\u1161",
      "\u1102\u1161\u11B7\u1111\u1167\u11AB",
      "\u1102\u1161\u11B7\u1112\u1161\u11A8\u1109\u1162\u11BC",
      "\u1102\u1161\u11BC\u1107\u1175",
      "\u1102\u1161\u11C0\u1106\u1161\u11AF",
      "\u1102\u1162\u1102\u1167\u11AB",
      "\u1102\u1162\u110B\u116D\u11BC",
      "\u1102\u1162\u110B\u1175\u11AF",
      "\u1102\u1162\u11B7\u1107\u1175",
      "\u1102\u1162\u11B7\u1109\u1162",
      "\u1102\u1162\u11BA\u1106\u116E\u11AF",
      "\u1102\u1162\u11BC\u1103\u1169\u11BC",
      "\u1102\u1162\u11BC\u1106\u1167\u11AB",
      "\u1102\u1162\u11BC\u1107\u1161\u11BC",
      "\u1102\u1162\u11BC\u110C\u1161\u11BC\u1100\u1169",
      "\u1102\u1166\u11A8\u1110\u1161\u110B\u1175",
      "\u1102\u1166\u11BA\u110D\u1162",
      "\u1102\u1169\u1103\u1169\u11BC",
      "\u1102\u1169\u1105\u1161\u11AB\u1109\u1162\u11A8",
      "\u1102\u1169\u1105\u1167\u11A8",
      "\u1102\u1169\u110B\u1175\u11AB",
      "\u1102\u1169\u11A8\u110B\u1173\u11B7",
      "\u1102\u1169\u11A8\u110E\u1161",
      "\u1102\u1169\u11A8\u1112\u116A",
      "\u1102\u1169\u11AB\u1105\u1175",
      "\u1102\u1169\u11AB\u1106\u116E\u11AB",
      "\u1102\u1169\u11AB\u110C\u1162\u11BC",
      "\u1102\u1169\u11AF\u110B\u1175",
      "\u1102\u1169\u11BC\u1100\u116E",
      "\u1102\u1169\u11BC\u1103\u1161\u11B7",
      "\u1102\u1169\u11BC\u1106\u1175\u11AB",
      "\u1102\u1169\u11BC\u1107\u116E",
      "\u1102\u1169\u11BC\u110B\u1165\u11B8",
      "\u1102\u1169\u11BC\u110C\u1161\u11BC",
      "\u1102\u1169\u11BC\u110E\u1169\u11AB",
      "\u1102\u1169\u11C1\u110B\u1175",
      "\u1102\u116E\u11AB\u1103\u1169\u11BC\u110C\u1161",
      "\u1102\u116E\u11AB\u1106\u116E\u11AF",
      "\u1102\u116E\u11AB\u110A\u1165\u11B8",
      "\u1102\u1172\u110B\u116D\u11A8",
      "\u1102\u1173\u1101\u1175\u11B7",
      "\u1102\u1173\u11A8\u1103\u1162",
      "\u1102\u1173\u11BC\u1103\u1169\u11BC\u110C\u1165\u11A8",
      "\u1102\u1173\u11BC\u1105\u1167\u11A8",
      "\u1103\u1161\u1107\u1161\u11BC",
      "\u1103\u1161\u110B\u1163\u11BC\u1109\u1165\u11BC",
      "\u1103\u1161\u110B\u1173\u11B7",
      "\u1103\u1161\u110B\u1175\u110B\u1165\u1110\u1173",
      "\u1103\u1161\u1112\u1162\u11BC",
      "\u1103\u1161\u11AB\u1100\u1168",
      "\u1103\u1161\u11AB\u1100\u1169\u11AF",
      "\u1103\u1161\u11AB\u1103\u1169\u11A8",
      "\u1103\u1161\u11AB\u1106\u1161\u11BA",
      "\u1103\u1161\u11AB\u1109\u116E\u11AB",
      "\u1103\u1161\u11AB\u110B\u1165",
      "\u1103\u1161\u11AB\u110B\u1171",
      "\u1103\u1161\u11AB\u110C\u1165\u11B7",
      "\u1103\u1161\u11AB\u110E\u1166",
      "\u1103\u1161\u11AB\u110E\u116E",
      "\u1103\u1161\u11AB\u1111\u1167\u11AB",
      "\u1103\u1161\u11AB\u1111\u116E\u11BC",
      "\u1103\u1161\u11AF\u1100\u1163\u11AF",
      "\u1103\u1161\u11AF\u1105\u1165",
      "\u1103\u1161\u11AF\u1105\u1167\u11A8",
      "\u1103\u1161\u11AF\u1105\u1175",
      "\u1103\u1161\u11B0\u1100\u1169\u1100\u1175",
      "\u1103\u1161\u11B7\u1103\u1161\u11BC",
      "\u1103\u1161\u11B7\u1107\u1162",
      "\u1103\u1161\u11B7\u110B\u116D",
      "\u1103\u1161\u11B7\u110B\u1175\u11B7",
      "\u1103\u1161\u11B8\u1107\u1167\u11AB",
      "\u1103\u1161\u11B8\u110C\u1161\u11BC",
      "\u1103\u1161\u11BC\u1100\u1173\u11AB",
      "\u1103\u1161\u11BC\u1107\u116E\u11AB\u1100\u1161\u11AB",
      "\u1103\u1161\u11BC\u110B\u1167\u11AB\u1112\u1175",
      "\u1103\u1161\u11BC\u110C\u1161\u11BC",
      "\u1103\u1162\u1100\u1172\u1106\u1169",
      "\u1103\u1162\u1102\u1161\u11BD",
      "\u1103\u1162\u1103\u1161\u11AB\u1112\u1175",
      "\u1103\u1162\u1103\u1161\u11B8",
      "\u1103\u1162\u1103\u1169\u1109\u1175",
      "\u1103\u1162\u1105\u1163\u11A8",
      "\u1103\u1162\u1105\u1163\u11BC",
      "\u1103\u1162\u1105\u1172\u11A8",
      "\u1103\u1162\u1106\u116E\u11AB",
      "\u1103\u1162\u1107\u116E\u1107\u116E\u11AB",
      "\u1103\u1162\u1109\u1175\u11AB",
      "\u1103\u1162\u110B\u1173\u11BC",
      "\u1103\u1162\u110C\u1161\u11BC",
      "\u1103\u1162\u110C\u1165\u11AB",
      "\u1103\u1162\u110C\u1165\u11B8",
      "\u1103\u1162\u110C\u116E\u11BC",
      "\u1103\u1162\u110E\u1162\u11A8",
      "\u1103\u1162\u110E\u116E\u11AF",
      "\u1103\u1162\u110E\u116E\u11BC",
      "\u1103\u1162\u1110\u1169\u11BC\u1105\u1167\u11BC",
      "\u1103\u1162\u1112\u1161\u11A8",
      "\u1103\u1162\u1112\u1161\u11AB\u1106\u1175\u11AB\u1100\u116E\u11A8",
      "\u1103\u1162\u1112\u1161\u11B8\u1109\u1175\u11AF",
      "\u1103\u1162\u1112\u1167\u11BC",
      "\u1103\u1165\u11BC\u110B\u1165\u1105\u1175",
      "\u1103\u1166\u110B\u1175\u1110\u1173",
      "\u1103\u1169\u1103\u1162\u110E\u1166",
      "\u1103\u1169\u1103\u1165\u11A8",
      "\u1103\u1169\u1103\u116E\u11A8",
      "\u1103\u1169\u1106\u1161\u11BC",
      "\u1103\u1169\u1109\u1165\u1100\u116A\u11AB",
      "\u1103\u1169\u1109\u1175\u11B7",
      "\u1103\u1169\u110B\u116E\u11B7",
      "\u1103\u1169\u110B\u1175\u11B8",
      "\u1103\u1169\u110C\u1161\u1100\u1175",
      "\u1103\u1169\u110C\u1165\u1112\u1175",
      "\u1103\u1169\u110C\u1165\u11AB",
      "\u1103\u1169\u110C\u116E\u11BC",
      "\u1103\u1169\u110E\u1161\u11A8",
      "\u1103\u1169\u11A8\u1100\u1161\u11B7",
      "\u1103\u1169\u11A8\u1105\u1175\u11B8",
      "\u1103\u1169\u11A8\u1109\u1165",
      "\u1103\u1169\u11A8\u110B\u1175\u11AF",
      "\u1103\u1169\u11A8\u110E\u1161\u11BC\u110C\u1165\u11A8",
      "\u1103\u1169\u11BC\u1112\u116A\u110E\u1162\u11A8",
      "\u1103\u1171\u11BA\u1106\u1169\u1109\u1173\u11B8",
      "\u1103\u1171\u11BA\u1109\u1161\u11AB",
      "\u1104\u1161\u11AF\u110B\u1161\u110B\u1175",
      "\u1106\u1161\u1102\u116E\u1105\u1161",
      "\u1106\u1161\u1102\u1173\u11AF",
      "\u1106\u1161\u1103\u1161\u11BC",
      "\u1106\u1161\u1105\u1161\u1110\u1169\u11AB",
      "\u1106\u1161\u1105\u1167\u11AB",
      "\u1106\u1161\u1106\u116E\u1105\u1175",
      "\u1106\u1161\u1109\u1161\u110C\u1175",
      "\u1106\u1161\u110B\u1163\u11A8",
      "\u1106\u1161\u110B\u116D\u1102\u1166\u110C\u1173",
      "\u1106\u1161\u110B\u1173\u11AF",
      "\u1106\u1161\u110B\u1173\u11B7",
      "\u1106\u1161\u110B\u1175\u110F\u1173",
      "\u1106\u1161\u110C\u116E\u11BC",
      "\u1106\u1161\u110C\u1175\u1106\u1161\u11A8",
      "\u1106\u1161\u110E\u1161\u11AB\u1100\u1161\u110C\u1175",
      "\u1106\u1161\u110E\u1161\u11AF",
      "\u1106\u1161\u1112\u1173\u11AB",
      "\u1106\u1161\u11A8\u1100\u1165\u11AF\u1105\u1175",
      "\u1106\u1161\u11A8\u1102\u1162",
      "\u1106\u1161\u11A8\u1109\u1161\u11BC",
      "\u1106\u1161\u11AB\u1102\u1161\u11B7",
      "\u1106\u1161\u11AB\u1103\u116E",
      "\u1106\u1161\u11AB\u1109\u1166",
      "\u1106\u1161\u11AB\u110B\u1163\u11A8",
      "\u1106\u1161\u11AB\u110B\u1175\u11AF",
      "\u1106\u1161\u11AB\u110C\u1165\u11B7",
      "\u1106\u1161\u11AB\u110C\u1169\u11A8",
      "\u1106\u1161\u11AB\u1112\u116A",
      "\u1106\u1161\u11AD\u110B\u1175",
      "\u1106\u1161\u11AF\u1100\u1175",
      "\u1106\u1161\u11AF\u110A\u1173\u11B7",
      "\u1106\u1161\u11AF\u1110\u116E",
      "\u1106\u1161\u11B7\u1103\u1162\u1105\u1169",
      "\u1106\u1161\u11BC\u110B\u116F\u11AB\u1100\u1167\u11BC",
      "\u1106\u1162\u1102\u1167\u11AB",
      "\u1106\u1162\u1103\u1161\u11AF",
      "\u1106\u1162\u1105\u1167\u11A8",
      "\u1106\u1162\u1107\u1165\u11AB",
      "\u1106\u1162\u1109\u1173\u110F\u1165\u11B7",
      "\u1106\u1162\u110B\u1175\u11AF",
      "\u1106\u1162\u110C\u1161\u11BC",
      "\u1106\u1162\u11A8\u110C\u116E",
      "\u1106\u1165\u11A8\u110B\u1175",
      "\u1106\u1165\u11AB\u110C\u1165",
      "\u1106\u1165\u11AB\u110C\u1175",
      "\u1106\u1165\u11AF\u1105\u1175",
      "\u1106\u1166\u110B\u1175\u11AF",
      "\u1106\u1167\u1102\u1173\u1105\u1175",
      "\u1106\u1167\u110E\u1175\u11AF",
      "\u1106\u1167\u11AB\u1103\u1161\u11B7",
      "\u1106\u1167\u11AF\u110E\u1175",
      "\u1106\u1167\u11BC\u1103\u1161\u11AB",
      "\u1106\u1167\u11BC\u1105\u1167\u11BC",
      "\u1106\u1167\u11BC\u110B\u1168",
      "\u1106\u1167\u11BC\u110B\u1174",
      "\u1106\u1167\u11BC\u110C\u1165\u11AF",
      "\u1106\u1167\u11BC\u110E\u1175\u11BC",
      "\u1106\u1167\u11BC\u1112\u1161\u11B7",
      "\u1106\u1169\u1100\u1173\u11B7",
      "\u1106\u1169\u1102\u1175\u1110\u1165",
      "\u1106\u1169\u1103\u1166\u11AF",
      "\u1106\u1169\u1103\u1173\u11AB",
      "\u1106\u1169\u1107\u1165\u11B7",
      "\u1106\u1169\u1109\u1173\u11B8",
      "\u1106\u1169\u110B\u1163\u11BC",
      "\u1106\u1169\u110B\u1175\u11B7",
      "\u1106\u1169\u110C\u1169\u1105\u1175",
      "\u1106\u1169\u110C\u1175\u11B8",
      "\u1106\u1169\u1110\u116E\u11BC\u110B\u1175",
      "\u1106\u1169\u11A8\u1100\u1165\u11AF\u110B\u1175",
      "\u1106\u1169\u11A8\u1105\u1169\u11A8",
      "\u1106\u1169\u11A8\u1109\u1161",
      "\u1106\u1169\u11A8\u1109\u1169\u1105\u1175",
      "\u1106\u1169\u11A8\u1109\u116E\u11B7",
      "\u1106\u1169\u11A8\u110C\u1165\u11A8",
      "\u1106\u1169\u11A8\u1111\u116D",
      "\u1106\u1169\u11AF\u1105\u1162",
      "\u1106\u1169\u11B7\u1106\u1162",
      "\u1106\u1169\u11B7\u1106\u116E\u1100\u1166",
      "\u1106\u1169\u11B7\u1109\u1161\u11AF",
      "\u1106\u1169\u11B7\u1109\u1169\u11A8",
      "\u1106\u1169\u11B7\u110C\u1175\u11BA",
      "\u1106\u1169\u11B7\u1110\u1169\u11BC",
      "\u1106\u1169\u11B8\u1109\u1175",
      "\u1106\u116E\u1100\u116A\u11AB\u1109\u1175\u11B7",
      "\u1106\u116E\u1100\u116E\u11BC\u1112\u116A",
      "\u1106\u116E\u1103\u1165\u110B\u1171",
      "\u1106\u116E\u1103\u1165\u11B7",
      "\u1106\u116E\u1105\u1173\u11C1",
      "\u1106\u116E\u1109\u1173\u11AB",
      "\u1106\u116E\u110B\u1165\u11BA",
      "\u1106\u116E\u110B\u1167\u11A8",
      "\u1106\u116E\u110B\u116D\u11BC",
      "\u1106\u116E\u110C\u1169\u1100\u1165\u11AB",
      "\u1106\u116E\u110C\u1175\u1100\u1162",
      "\u1106\u116E\u110E\u1165\u11A8",
      "\u1106\u116E\u11AB\u1100\u116E",
      "\u1106\u116E\u11AB\u1103\u1173\u11A8",
      "\u1106\u116E\u11AB\u1107\u1165\u11B8",
      "\u1106\u116E\u11AB\u1109\u1165",
      "\u1106\u116E\u11AB\u110C\u1166",
      "\u1106\u116E\u11AB\u1112\u1161\u11A8",
      "\u1106\u116E\u11AB\u1112\u116A",
      "\u1106\u116E\u11AF\u1100\u1161",
      "\u1106\u116E\u11AF\u1100\u1165\u11AB",
      "\u1106\u116E\u11AF\u1100\u1167\u11AF",
      "\u1106\u116E\u11AF\u1100\u1169\u1100\u1175",
      "\u1106\u116E\u11AF\u1105\u1169\u11AB",
      "\u1106\u116E\u11AF\u1105\u1175\u1112\u1161\u11A8",
      "\u1106\u116E\u11AF\u110B\u1173\u11B7",
      "\u1106\u116E\u11AF\u110C\u1175\u11AF",
      "\u1106\u116E\u11AF\u110E\u1166",
      "\u1106\u1175\u1100\u116E\u11A8",
      "\u1106\u1175\u1103\u1175\u110B\u1165",
      "\u1106\u1175\u1109\u1161\u110B\u1175\u11AF",
      "\u1106\u1175\u1109\u116E\u11AF",
      "\u1106\u1175\u110B\u1167\u11A8",
      "\u1106\u1175\u110B\u116D\u11BC\u1109\u1175\u11AF",
      "\u1106\u1175\u110B\u116E\u11B7",
      "\u1106\u1175\u110B\u1175\u11AB",
      "\u1106\u1175\u1110\u1175\u11BC",
      "\u1106\u1175\u1112\u1169\u11AB",
      "\u1106\u1175\u11AB\u1100\u1161\u11AB",
      "\u1106\u1175\u11AB\u110C\u1169\u11A8",
      "\u1106\u1175\u11AB\u110C\u116E",
      "\u1106\u1175\u11AE\u110B\u1173\u11B7",
      "\u1106\u1175\u11AF\u1100\u1161\u1105\u116E",
      "\u1106\u1175\u11AF\u1105\u1175\u1106\u1175\u1110\u1165",
      "\u1106\u1175\u11C0\u1107\u1161\u1103\u1161\u11A8",
      "\u1107\u1161\u1100\u1161\u110C\u1175",
      "\u1107\u1161\u1100\u116E\u1102\u1175",
      "\u1107\u1161\u1102\u1161\u1102\u1161",
      "\u1107\u1161\u1102\u1173\u11AF",
      "\u1107\u1161\u1103\u1161\u11A8",
      "\u1107\u1161\u1103\u1161\u11BA\u1100\u1161",
      "\u1107\u1161\u1105\u1161\u11B7",
      "\u1107\u1161\u110B\u1175\u1105\u1165\u1109\u1173",
      "\u1107\u1161\u1110\u1161\u11BC",
      "\u1107\u1161\u11A8\u1106\u116E\u11AF\u1100\u116A\u11AB",
      "\u1107\u1161\u11A8\u1109\u1161",
      "\u1107\u1161\u11A8\u1109\u116E",
      "\u1107\u1161\u11AB\u1103\u1162",
      "\u1107\u1161\u11AB\u1103\u1173\u1109\u1175",
      "\u1107\u1161\u11AB\u1106\u1161\u11AF",
      "\u1107\u1161\u11AB\u1107\u1161\u11AF",
      "\u1107\u1161\u11AB\u1109\u1165\u11BC",
      "\u1107\u1161\u11AB\u110B\u1173\u11BC",
      "\u1107\u1161\u11AB\u110C\u1161\u11BC",
      "\u1107\u1161\u11AB\u110C\u116E\u11A8",
      "\u1107\u1161\u11AB\u110C\u1175",
      "\u1107\u1161\u11AB\u110E\u1161\u11AB",
      "\u1107\u1161\u11AE\u110E\u1175\u11B7",
      "\u1107\u1161\u11AF\u1100\u1161\u1105\u1161\u11A8",
      "\u1107\u1161\u11AF\u1100\u1165\u11AF\u110B\u1173\u11B7",
      "\u1107\u1161\u11AF\u1100\u1167\u11AB",
      "\u1107\u1161\u11AF\u1103\u1161\u11AF",
      "\u1107\u1161\u11AF\u1105\u1166",
      "\u1107\u1161\u11AF\u1106\u1169\u11A8",
      "\u1107\u1161\u11AF\u1107\u1161\u1103\u1161\u11A8",
      "\u1107\u1161\u11AF\u1109\u1162\u11BC",
      "\u1107\u1161\u11AF\u110B\u1173\u11B7",
      "\u1107\u1161\u11AF\u110C\u1161\u1100\u116E\u11A8",
      "\u1107\u1161\u11AF\u110C\u1165\u11AB",
      "\u1107\u1161\u11AF\u1110\u1169\u11B8",
      "\u1107\u1161\u11AF\u1111\u116D",
      "\u1107\u1161\u11B7\u1112\u1161\u1102\u1173\u11AF",
      "\u1107\u1161\u11B8\u1100\u1173\u1105\u1173\u11BA",
      "\u1107\u1161\u11B8\u1106\u1161\u11BA",
      "\u1107\u1161\u11B8\u1109\u1161\u11BC",
      "\u1107\u1161\u11B8\u1109\u1169\u11C0",
      "\u1107\u1161\u11BC\u1100\u1173\u11B7",
      "\u1107\u1161\u11BC\u1106\u1167\u11AB",
      "\u1107\u1161\u11BC\u1106\u116E\u11AB",
      "\u1107\u1161\u11BC\u1107\u1161\u1103\u1161\u11A8",
      "\u1107\u1161\u11BC\u1107\u1165\u11B8",
      "\u1107\u1161\u11BC\u1109\u1169\u11BC",
      "\u1107\u1161\u11BC\u1109\u1175\u11A8",
      "\u1107\u1161\u11BC\u110B\u1161\u11AB",
      "\u1107\u1161\u11BC\u110B\u116E\u11AF",
      "\u1107\u1161\u11BC\u110C\u1175",
      "\u1107\u1161\u11BC\u1112\u1161\u11A8",
      "\u1107\u1161\u11BC\u1112\u1162",
      "\u1107\u1161\u11BC\u1112\u1163\u11BC",
      "\u1107\u1162\u1100\u1167\u11BC",
      "\u1107\u1162\u1101\u1169\u11B8",
      "\u1107\u1162\u1103\u1161\u11AF",
      "\u1107\u1162\u1103\u1173\u1106\u1175\u11AB\u1110\u1165\u11AB",
      "\u1107\u1162\u11A8\u1103\u116E\u1109\u1161\u11AB",
      "\u1107\u1162\u11A8\u1109\u1162\u11A8",
      "\u1107\u1162\u11A8\u1109\u1165\u11BC",
      "\u1107\u1162\u11A8\u110B\u1175\u11AB",
      "\u1107\u1162\u11A8\u110C\u1166",
      "\u1107\u1162\u11A8\u1112\u116A\u110C\u1165\u11B7",
      "\u1107\u1165\u1105\u1173\u11BA",
      "\u1107\u1165\u1109\u1165\u11BA",
      "\u1107\u1165\u1110\u1173\u11AB",
      "\u1107\u1165\u11AB\u1100\u1162",
      "\u1107\u1165\u11AB\u110B\u1167\u11A8",
      "\u1107\u1165\u11AB\u110C\u1175",
      "\u1107\u1165\u11AB\u1112\u1169",
      "\u1107\u1165\u11AF\u1100\u1173\u11B7",
      "\u1107\u1165\u11AF\u1105\u1166",
      "\u1107\u1165\u11AF\u110A\u1165",
      "\u1107\u1165\u11B7\u110B\u1171",
      "\u1107\u1165\u11B7\u110B\u1175\u11AB",
      "\u1107\u1165\u11B7\u110C\u116C",
      "\u1107\u1165\u11B8\u1105\u1172\u11AF",
      "\u1107\u1165\u11B8\u110B\u116F\u11AB",
      "\u1107\u1165\u11B8\u110C\u1165\u11A8",
      "\u1107\u1165\u11B8\u110E\u1175\u11A8",
      "\u1107\u1166\u110B\u1175\u110C\u1175\u11BC",
      "\u1107\u1166\u11AF\u1110\u1173",
      "\u1107\u1167\u11AB\u1100\u1167\u11BC",
      "\u1107\u1167\u11AB\u1103\u1169\u11BC",
      "\u1107\u1167\u11AB\u1106\u1167\u11BC",
      "\u1107\u1167\u11AB\u1109\u1175\u11AB",
      "\u1107\u1167\u11AB\u1112\u1169\u1109\u1161",
      "\u1107\u1167\u11AB\u1112\u116A",
      "\u1107\u1167\u11AF\u1103\u1169",
      "\u1107\u1167\u11AF\u1106\u1167\u11BC",
      "\u1107\u1167\u11AF\u110B\u1175\u11AF",
      "\u1107\u1167\u11BC\u1109\u1175\u11AF",
      "\u1107\u1167\u11BC\u110B\u1161\u1105\u1175",
      "\u1107\u1167\u11BC\u110B\u116F\u11AB",
      "\u1107\u1169\u1100\u116A\u11AB",
      "\u1107\u1169\u1102\u1165\u1109\u1173",
      "\u1107\u1169\u1105\u1161\u1109\u1162\u11A8",
      "\u1107\u1169\u1105\u1161\u11B7",
      "\u1107\u1169\u1105\u1173\u11B7",
      "\u1107\u1169\u1109\u1161\u11BC",
      "\u1107\u1169\u110B\u1161\u11AB",
      "\u1107\u1169\u110C\u1161\u1100\u1175",
      "\u1107\u1169\u110C\u1161\u11BC",
      "\u1107\u1169\u110C\u1165\u11AB",
      "\u1107\u1169\u110C\u1169\u11AB",
      "\u1107\u1169\u1110\u1169\u11BC",
      "\u1107\u1169\u1111\u1167\u11AB\u110C\u1165\u11A8",
      "\u1107\u1169\u1112\u1165\u11B7",
      "\u1107\u1169\u11A8\u1103\u1169",
      "\u1107\u1169\u11A8\u1109\u1161",
      "\u1107\u1169\u11A8\u1109\u116E\u11BC\u110B\u1161",
      "\u1107\u1169\u11A8\u1109\u1173\u11B8",
      "\u1107\u1169\u11A9\u110B\u1173\u11B7",
      "\u1107\u1169\u11AB\u1100\u1167\u11A8\u110C\u1165\u11A8",
      "\u1107\u1169\u11AB\u1105\u1162",
      "\u1107\u1169\u11AB\u1107\u116E",
      "\u1107\u1169\u11AB\u1109\u1161",
      "\u1107\u1169\u11AB\u1109\u1165\u11BC",
      "\u1107\u1169\u11AB\u110B\u1175\u11AB",
      "\u1107\u1169\u11AB\u110C\u1175\u11AF",
      "\u1107\u1169\u11AF\u1111\u1166\u11AB",
      "\u1107\u1169\u11BC\u1109\u1161",
      "\u1107\u1169\u11BC\u110C\u1175",
      "\u1107\u1169\u11BC\u1110\u116E",
      "\u1107\u116E\u1100\u1173\u11AB",
      "\u1107\u116E\u1101\u1173\u1105\u1165\u110B\u116E\u11B7",
      "\u1107\u116E\u1103\u1161\u11B7",
      "\u1107\u116E\u1103\u1169\u11BC\u1109\u1161\u11AB",
      "\u1107\u116E\u1106\u116E\u11AB",
      "\u1107\u116E\u1107\u116E\u11AB",
      "\u1107\u116E\u1109\u1161\u11AB",
      "\u1107\u116E\u1109\u1161\u11BC",
      "\u1107\u116E\u110B\u1165\u11BF",
      "\u1107\u116E\u110B\u1175\u11AB",
      "\u1107\u116E\u110C\u1161\u11A8\u110B\u116D\u11BC",
      "\u1107\u116E\u110C\u1161\u11BC",
      "\u1107\u116E\u110C\u1165\u11BC",
      "\u1107\u116E\u110C\u1169\u11A8",
      "\u1107\u116E\u110C\u1175\u1105\u1165\u11AB\u1112\u1175",
      "\u1107\u116E\u110E\u1175\u11AB",
      "\u1107\u116E\u1110\u1161\u11A8",
      "\u1107\u116E\u1111\u116E\u11B7",
      "\u1107\u116E\u1112\u116C\u110C\u1161\u11BC",
      "\u1107\u116E\u11A8\u1107\u116E",
      "\u1107\u116E\u11A8\u1112\u1161\u11AB",
      "\u1107\u116E\u11AB\u1102\u1169",
      "\u1107\u116E\u11AB\u1105\u1163\u11BC",
      "\u1107\u116E\u11AB\u1105\u1175",
      "\u1107\u116E\u11AB\u1106\u1167\u11BC",
      "\u1107\u116E\u11AB\u1109\u1165\u11A8",
      "\u1107\u116E\u11AB\u110B\u1163",
      "\u1107\u116E\u11AB\u110B\u1171\u1100\u1175",
      "\u1107\u116E\u11AB\u1111\u1175\u11AF",
      "\u1107\u116E\u11AB\u1112\u1169\u11BC\u1109\u1162\u11A8",
      "\u1107\u116E\u11AF\u1100\u1169\u1100\u1175",
      "\u1107\u116E\u11AF\u1100\u116A",
      "\u1107\u116E\u11AF\u1100\u116D",
      "\u1107\u116E\u11AF\u1101\u1169\u11BE",
      "\u1107\u116E\u11AF\u1106\u1161\u11AB",
      "\u1107\u116E\u11AF\u1107\u1165\u11B8",
      "\u1107\u116E\u11AF\u1107\u1175\u11BE",
      "\u1107\u116E\u11AF\u110B\u1161\u11AB",
      "\u1107\u116E\u11AF\u110B\u1175\u110B\u1175\u11A8",
      "\u1107\u116E\u11AF\u1112\u1162\u11BC",
      "\u1107\u1173\u1105\u1162\u11AB\u1103\u1173",
      "\u1107\u1175\u1100\u1173\u11A8",
      "\u1107\u1175\u1102\u1161\u11AB",
      "\u1107\u1175\u1102\u1175\u11AF",
      "\u1107\u1175\u1103\u116E\u11AF\u1100\u1175",
      "\u1107\u1175\u1103\u1175\u110B\u1169",
      "\u1107\u1175\u1105\u1169\u1109\u1169",
      "\u1107\u1175\u1106\u1161\u11AB",
      "\u1107\u1175\u1106\u1167\u11BC",
      "\u1107\u1175\u1106\u1175\u11AF",
      "\u1107\u1175\u1107\u1161\u1105\u1161\u11B7",
      "\u1107\u1175\u1107\u1175\u11B7\u1107\u1161\u11B8",
      "\u1107\u1175\u1109\u1161\u11BC",
      "\u1107\u1175\u110B\u116D\u11BC",
      "\u1107\u1175\u110B\u1172\u11AF",
      "\u1107\u1175\u110C\u116E\u11BC",
      "\u1107\u1175\u1110\u1161\u1106\u1175\u11AB",
      "\u1107\u1175\u1111\u1161\u11AB",
      "\u1107\u1175\u11AF\u1103\u1175\u11BC",
      "\u1107\u1175\u11BA\u1106\u116E\u11AF",
      "\u1107\u1175\u11BA\u1107\u1161\u11BC\u110B\u116E\u11AF",
      "\u1107\u1175\u11BA\u110C\u116E\u11AF\u1100\u1175",
      "\u1107\u1175\u11BE\u1101\u1161\u11AF",
      "\u1108\u1161\u11AF\u1100\u1161\u11AB\u1109\u1162\u11A8",
      "\u1108\u1161\u11AF\u1105\u1162",
      "\u1108\u1161\u11AF\u1105\u1175",
      "\u1109\u1161\u1100\u1165\u11AB",
      "\u1109\u1161\u1100\u1168\u110C\u1165\u11AF",
      "\u1109\u1161\u1102\u1161\u110B\u1175",
      "\u1109\u1161\u1102\u1163\u11BC",
      "\u1109\u1161\u1105\u1161\u11B7",
      "\u1109\u1161\u1105\u1161\u11BC",
      "\u1109\u1161\u1105\u1175\u11B8",
      "\u1109\u1161\u1106\u1169\u1102\u1175\u11B7",
      "\u1109\u1161\u1106\u116E\u11AF",
      "\u1109\u1161\u1107\u1161\u11BC",
      "\u1109\u1161\u1109\u1161\u11BC",
      "\u1109\u1161\u1109\u1162\u11BC\u1112\u116A\u11AF",
      "\u1109\u1161\u1109\u1165\u11AF",
      "\u1109\u1161\u1109\u1173\u11B7",
      "\u1109\u1161\u1109\u1175\u11AF",
      "\u1109\u1161\u110B\u1165\u11B8",
      "\u1109\u1161\u110B\u116D\u11BC",
      "\u1109\u1161\u110B\u116F\u11AF",
      "\u1109\u1161\u110C\u1161\u11BC",
      "\u1109\u1161\u110C\u1165\u11AB",
      "\u1109\u1161\u110C\u1175\u11AB",
      "\u1109\u1161\u110E\u1169\u11AB",
      "\u1109\u1161\u110E\u116E\u11AB\u1100\u1175",
      "\u1109\u1161\u1110\u1161\u11BC",
      "\u1109\u1161\u1110\u116E\u1105\u1175",
      "\u1109\u1161\u1112\u1173\u11AF",
      "\u1109\u1161\u11AB\u1100\u1175\u11AF",
      "\u1109\u1161\u11AB\u1107\u116E\u110B\u1175\u11AB\u1100\u116A",
      "\u1109\u1161\u11AB\u110B\u1165\u11B8",
      "\u1109\u1161\u11AB\u110E\u1162\u11A8",
      "\u1109\u1161\u11AF\u1105\u1175\u11B7",
      "\u1109\u1161\u11AF\u110B\u1175\u11AB",
      "\u1109\u1161\u11AF\u110D\u1161\u11A8",
      "\u1109\u1161\u11B7\u1100\u1168\u1110\u1161\u11BC",
      "\u1109\u1161\u11B7\u1100\u116E\u11A8",
      "\u1109\u1161\u11B7\u1109\u1175\u11B8",
      "\u1109\u1161\u11B7\u110B\u116F\u11AF",
      "\u1109\u1161\u11B7\u110E\u1169\u11AB",
      "\u1109\u1161\u11BC\u1100\u116A\u11AB",
      "\u1109\u1161\u11BC\u1100\u1173\u11B7",
      "\u1109\u1161\u11BC\u1103\u1162",
      "\u1109\u1161\u11BC\u1105\u1172",
      "\u1109\u1161\u11BC\u1107\u1161\u11AB\u1100\u1175",
      "\u1109\u1161\u11BC\u1109\u1161\u11BC",
      "\u1109\u1161\u11BC\u1109\u1175\u11A8",
      "\u1109\u1161\u11BC\u110B\u1165\u11B8",
      "\u1109\u1161\u11BC\u110B\u1175\u11AB",
      "\u1109\u1161\u11BC\u110C\u1161",
      "\u1109\u1161\u11BC\u110C\u1165\u11B7",
      "\u1109\u1161\u11BC\u110E\u1165",
      "\u1109\u1161\u11BC\u110E\u116E",
      "\u1109\u1161\u11BC\u1110\u1162",
      "\u1109\u1161\u11BC\u1111\u116D",
      "\u1109\u1161\u11BC\u1111\u116E\u11B7",
      "\u1109\u1161\u11BC\u1112\u116A\u11BC",
      "\u1109\u1162\u1107\u1167\u11A8",
      "\u1109\u1162\u11A8\u1101\u1161\u11AF",
      "\u1109\u1162\u11A8\u110B\u1167\u11AB\u1111\u1175\u11AF",
      "\u1109\u1162\u11BC\u1100\u1161\u11A8",
      "\u1109\u1162\u11BC\u1106\u1167\u11BC",
      "\u1109\u1162\u11BC\u1106\u116E\u11AF",
      "\u1109\u1162\u11BC\u1107\u1161\u11BC\u1109\u1169\u11BC",
      "\u1109\u1162\u11BC\u1109\u1161\u11AB",
      "\u1109\u1162\u11BC\u1109\u1165\u11AB",
      "\u1109\u1162\u11BC\u1109\u1175\u11AB",
      "\u1109\u1162\u11BC\u110B\u1175\u11AF",
      "\u1109\u1162\u11BC\u1112\u116A\u11AF",
      "\u1109\u1165\u1105\u1161\u11B8",
      "\u1109\u1165\u1105\u1173\u11AB",
      "\u1109\u1165\u1106\u1167\u11BC",
      "\u1109\u1165\u1106\u1175\u11AB",
      "\u1109\u1165\u1107\u1175\u1109\u1173",
      "\u1109\u1165\u110B\u1163\u11BC",
      "\u1109\u1165\u110B\u116E\u11AF",
      "\u1109\u1165\u110C\u1165\u11A8",
      "\u1109\u1165\u110C\u1165\u11B7",
      "\u1109\u1165\u110D\u1169\u11A8",
      "\u1109\u1165\u110F\u1173\u11AF",
      "\u1109\u1165\u11A8\u1109\u1161",
      "\u1109\u1165\u11A8\u110B\u1172",
      "\u1109\u1165\u11AB\u1100\u1165",
      "\u1109\u1165\u11AB\u1106\u116E\u11AF",
      "\u1109\u1165\u11AB\u1107\u1162",
      "\u1109\u1165\u11AB\u1109\u1162\u11BC",
      "\u1109\u1165\u11AB\u1109\u116E",
      "\u1109\u1165\u11AB\u110B\u116F\u11AB",
      "\u1109\u1165\u11AB\u110C\u1161\u11BC",
      "\u1109\u1165\u11AB\u110C\u1165\u11AB",
      "\u1109\u1165\u11AB\u1110\u1162\u11A8",
      "\u1109\u1165\u11AB\u1111\u116E\u11BC\u1100\u1175",
      "\u1109\u1165\u11AF\u1100\u1165\u110C\u1175",
      "\u1109\u1165\u11AF\u1102\u1161\u11AF",
      "\u1109\u1165\u11AF\u1105\u1165\u11BC\u1110\u1161\u11BC",
      "\u1109\u1165\u11AF\u1106\u1167\u11BC",
      "\u1109\u1165\u11AF\u1106\u116E\u11AB",
      "\u1109\u1165\u11AF\u1109\u1161",
      "\u1109\u1165\u11AF\u110B\u1161\u11A8\u1109\u1161\u11AB",
      "\u1109\u1165\u11AF\u110E\u1175",
      "\u1109\u1165\u11AF\u1110\u1161\u11BC",
      "\u1109\u1165\u11B8\u110A\u1175",
      "\u1109\u1165\u11BC\u1100\u1169\u11BC",
      "\u1109\u1165\u11BC\u1103\u1161\u11BC",
      "\u1109\u1165\u11BC\u1106\u1167\u11BC",
      "\u1109\u1165\u11BC\u1107\u1167\u11AF",
      "\u1109\u1165\u11BC\u110B\u1175\u11AB",
      "\u1109\u1165\u11BC\u110C\u1161\u11BC",
      "\u1109\u1165\u11BC\u110C\u1165\u11A8",
      "\u1109\u1165\u11BC\u110C\u1175\u11AF",
      "\u1109\u1165\u11BC\u1112\u1161\u11B7",
      "\u1109\u1166\u1100\u1173\u11B7",
      "\u1109\u1166\u1106\u1175\u1102\u1161",
      "\u1109\u1166\u1109\u1161\u11BC",
      "\u1109\u1166\u110B\u116F\u11AF",
      "\u1109\u1166\u110C\u1169\u11BC\u1103\u1162\u110B\u116A\u11BC",
      "\u1109\u1166\u1110\u1161\u11A8",
      "\u1109\u1166\u11AB\u1110\u1165",
      "\u1109\u1166\u11AB\u1110\u1175\u1106\u1175\u1110\u1165",
      "\u1109\u1166\u11BA\u110D\u1162",
      "\u1109\u1169\u1100\u1172\u1106\u1169",
      "\u1109\u1169\u1100\u1173\u11A8\u110C\u1165\u11A8",
      "\u1109\u1169\u1100\u1173\u11B7",
      "\u1109\u1169\u1102\u1161\u1100\u1175",
      "\u1109\u1169\u1102\u1167\u11AB",
      "\u1109\u1169\u1103\u1173\u11A8",
      "\u1109\u1169\u1106\u1161\u11BC",
      "\u1109\u1169\u1106\u116E\u11AB",
      "\u1109\u1169\u1109\u1165\u11AF",
      "\u1109\u1169\u1109\u1169\u11A8",
      "\u1109\u1169\u110B\u1161\u1100\u116A",
      "\u1109\u1169\u110B\u116D\u11BC",
      "\u1109\u1169\u110B\u116F\u11AB",
      "\u1109\u1169\u110B\u1173\u11B7",
      "\u1109\u1169\u110C\u116E\u11BC\u1112\u1175",
      "\u1109\u1169\u110C\u1175\u1111\u116E\u11B7",
      "\u1109\u1169\u110C\u1175\u11AF",
      "\u1109\u1169\u1111\u116E\u11BC",
      "\u1109\u1169\u1112\u1167\u11BC",
      "\u1109\u1169\u11A8\u1103\u1161\u11B7",
      "\u1109\u1169\u11A8\u1103\u1169",
      "\u1109\u1169\u11A8\u110B\u1169\u11BA",
      "\u1109\u1169\u11AB\u1100\u1161\u1105\u1161\u11A8",
      "\u1109\u1169\u11AB\u1100\u1175\u11AF",
      "\u1109\u1169\u11AB\u1102\u1167",
      "\u1109\u1169\u11AB\u1102\u1175\u11B7",
      "\u1109\u1169\u11AB\u1103\u1173\u11BC",
      "\u1109\u1169\u11AB\u1106\u1169\u11A8",
      "\u1109\u1169\u11AB\u1108\u1167\u11A8",
      "\u1109\u1169\u11AB\u1109\u1175\u11AF",
      "\u1109\u1169\u11AB\u110C\u1175\u11AF",
      "\u1109\u1169\u11AB\u1110\u1169\u11B8",
      "\u1109\u1169\u11AB\u1112\u1162",
      "\u1109\u1169\u11AF\u110C\u1175\u11A8\u1112\u1175",
      "\u1109\u1169\u11B7\u110A\u1175",
      "\u1109\u1169\u11BC\u110B\u1161\u110C\u1175",
      "\u1109\u1169\u11BC\u110B\u1175",
      "\u1109\u1169\u11BC\u1111\u1167\u11AB",
      "\u1109\u116C\u1100\u1169\u1100\u1175",
      "\u1109\u116D\u1111\u1175\u11BC",
      "\u1109\u116E\u1100\u1165\u11AB",
      "\u1109\u116E\u1102\u1167\u11AB",
      "\u1109\u116E\u1103\u1161\u11AB",
      "\u1109\u116E\u1103\u1169\u11BA\u1106\u116E\u11AF",
      "\u1109\u116E\u1103\u1169\u11BC\u110C\u1165\u11A8",
      "\u1109\u116E\u1106\u1167\u11AB",
      "\u1109\u116E\u1106\u1167\u11BC",
      "\u1109\u116E\u1107\u1161\u11A8",
      "\u1109\u116E\u1109\u1161\u11BC",
      "\u1109\u116E\u1109\u1165\u11A8",
      "\u1109\u116E\u1109\u116E\u11AF",
      "\u1109\u116E\u1109\u1175\u1105\u1169",
      "\u1109\u116E\u110B\u1165\u11B8",
      "\u1109\u116E\u110B\u1167\u11B7",
      "\u1109\u116E\u110B\u1167\u11BC",
      "\u1109\u116E\u110B\u1175\u11B8",
      "\u1109\u116E\u110C\u116E\u11AB",
      "\u1109\u116E\u110C\u1175\u11B8",
      "\u1109\u116E\u110E\u116E\u11AF",
      "\u1109\u116E\u110F\u1165\u11BA",
      "\u1109\u116E\u1111\u1175\u11AF",
      "\u1109\u116E\u1112\u1161\u11A8",
      "\u1109\u116E\u1112\u1165\u11B7\u1109\u1162\u11BC",
      "\u1109\u116E\u1112\u116A\u1100\u1175",
      "\u1109\u116E\u11A8\u1102\u1167",
      "\u1109\u116E\u11A8\u1109\u1169",
      "\u1109\u116E\u11A8\u110C\u1166",
      "\u1109\u116E\u11AB\u1100\u1161\u11AB",
      "\u1109\u116E\u11AB\u1109\u1165",
      "\u1109\u116E\u11AB\u1109\u116E",
      "\u1109\u116E\u11AB\u1109\u1175\u11A8\u1100\u1161\u11AB",
      "\u1109\u116E\u11AB\u110B\u1171",
      "\u1109\u116E\u11AE\u1100\u1161\u1105\u1161\u11A8",
      "\u1109\u116E\u11AF\u1107\u1167\u11BC",
      "\u1109\u116E\u11AF\u110C\u1175\u11B8",
      "\u1109\u116E\u11BA\u110C\u1161",
      "\u1109\u1173\u1102\u1175\u11B7",
      "\u1109\u1173\u1106\u116E\u11AF",
      "\u1109\u1173\u1109\u1173\u1105\u1169",
      "\u1109\u1173\u1109\u1173\u11BC",
      "\u1109\u1173\u110B\u1170\u1110\u1165",
      "\u1109\u1173\u110B\u1171\u110E\u1175",
      "\u1109\u1173\u110F\u1166\u110B\u1175\u1110\u1173",
      "\u1109\u1173\u1110\u1172\u1103\u1175\u110B\u1169",
      "\u1109\u1173\u1110\u1173\u1105\u1166\u1109\u1173",
      "\u1109\u1173\u1111\u1169\u110E\u1173",
      "\u1109\u1173\u11AF\u110D\u1165\u11A8",
      "\u1109\u1173\u11AF\u1111\u1173\u11B7",
      "\u1109\u1173\u11B8\u1100\u116A\u11AB",
      "\u1109\u1173\u11B8\u1100\u1175",
      "\u1109\u1173\u11BC\u1100\u1162\u11A8",
      "\u1109\u1173\u11BC\u1105\u1175",
      "\u1109\u1173\u11BC\u1107\u116E",
      "\u1109\u1173\u11BC\u110B\u116D\u11BC\u110E\u1161",
      "\u1109\u1173\u11BC\u110C\u1175\u11AB",
      "\u1109\u1175\u1100\u1161\u11A8",
      "\u1109\u1175\u1100\u1161\u11AB",
      "\u1109\u1175\u1100\u1169\u11AF",
      "\u1109\u1175\u1100\u1173\u11B7\u110E\u1175",
      "\u1109\u1175\u1102\u1161\u1105\u1175\u110B\u1169",
      "\u1109\u1175\u1103\u1162\u11A8",
      "\u1109\u1175\u1105\u1175\u110C\u1173",
      "\u1109\u1175\u1106\u1166\u11AB\u1110\u1173",
      "\u1109\u1175\u1106\u1175\u11AB",
      "\u1109\u1175\u1107\u116E\u1106\u1169",
      "\u1109\u1175\u1109\u1165\u11AB",
      "\u1109\u1175\u1109\u1165\u11AF",
      "\u1109\u1175\u1109\u1173\u1110\u1166\u11B7",
      "\u1109\u1175\u110B\u1161\u1107\u1165\u110C\u1175",
      "\u1109\u1175\u110B\u1165\u1106\u1165\u1102\u1175",
      "\u1109\u1175\u110B\u116F\u11AF",
      "\u1109\u1175\u110B\u1175\u11AB",
      "\u1109\u1175\u110B\u1175\u11AF",
      "\u1109\u1175\u110C\u1161\u11A8",
      "\u1109\u1175\u110C\u1161\u11BC",
      "\u1109\u1175\u110C\u1165\u11AF",
      "\u1109\u1175\u110C\u1165\u11B7",
      "\u1109\u1175\u110C\u116E\u11BC",
      "\u1109\u1175\u110C\u1173\u11AB",
      "\u1109\u1175\u110C\u1175\u11B8",
      "\u1109\u1175\u110E\u1165\u11BC",
      "\u1109\u1175\u1112\u1161\u11B8",
      "\u1109\u1175\u1112\u1165\u11B7",
      "\u1109\u1175\u11A8\u1100\u116E",
      "\u1109\u1175\u11A8\u1100\u1175",
      "\u1109\u1175\u11A8\u1103\u1161\u11BC",
      "\u1109\u1175\u11A8\u1105\u1163\u11BC",
      "\u1109\u1175\u11A8\u1105\u116D\u1111\u116E\u11B7",
      "\u1109\u1175\u11A8\u1106\u116E\u11AF",
      "\u1109\u1175\u11A8\u1108\u1161\u11BC",
      "\u1109\u1175\u11A8\u1109\u1161",
      "\u1109\u1175\u11A8\u1109\u1162\u11BC\u1112\u116A\u11AF",
      "\u1109\u1175\u11A8\u110E\u1169",
      "\u1109\u1175\u11A8\u1110\u1161\u11A8",
      "\u1109\u1175\u11A8\u1111\u116E\u11B7",
      "\u1109\u1175\u11AB\u1100\u1169",
      "\u1109\u1175\u11AB\u1100\u1172",
      "\u1109\u1175\u11AB\u1102\u1167\u11B7",
      "\u1109\u1175\u11AB\u1106\u116E\u11AB",
      "\u1109\u1175\u11AB\u1107\u1161\u11AF",
      "\u1109\u1175\u11AB\u1107\u1175",
      "\u1109\u1175\u11AB\u1109\u1161",
      "\u1109\u1175\u11AB\u1109\u1166",
      "\u1109\u1175\u11AB\u110B\u116D\u11BC",
      "\u1109\u1175\u11AB\u110C\u1166\u1111\u116E\u11B7",
      "\u1109\u1175\u11AB\u110E\u1165\u11BC",
      "\u1109\u1175\u11AB\u110E\u1166",
      "\u1109\u1175\u11AB\u1112\u116A",
      "\u1109\u1175\u11AF\u1100\u1161\u11B7",
      "\u1109\u1175\u11AF\u1102\u1162",
      "\u1109\u1175\u11AF\u1105\u1167\u11A8",
      "\u1109\u1175\u11AF\u1105\u1168",
      "\u1109\u1175\u11AF\u1106\u1161\u11BC",
      "\u1109\u1175\u11AF\u1109\u116E",
      "\u1109\u1175\u11AF\u1109\u1173\u11B8",
      "\u1109\u1175\u11AF\u1109\u1175",
      "\u1109\u1175\u11AF\u110C\u1161\u11BC",
      "\u1109\u1175\u11AF\u110C\u1165\u11BC",
      "\u1109\u1175\u11AF\u110C\u1175\u11AF\u110C\u1165\u11A8",
      "\u1109\u1175\u11AF\u110E\u1165\u11AB",
      "\u1109\u1175\u11AF\u110E\u1166",
      "\u1109\u1175\u11AF\u110F\u1165\u11BA",
      "\u1109\u1175\u11AF\u1110\u1162",
      "\u1109\u1175\u11AF\u1111\u1162",
      "\u1109\u1175\u11AF\u1112\u1165\u11B7",
      "\u1109\u1175\u11AF\u1112\u1167\u11AB",
      "\u1109\u1175\u11B7\u1105\u1175",
      "\u1109\u1175\u11B7\u1107\u116E\u1105\u1173\u11B7",
      "\u1109\u1175\u11B7\u1109\u1161",
      "\u1109\u1175\u11B7\u110C\u1161\u11BC",
      "\u1109\u1175\u11B7\u110C\u1165\u11BC",
      "\u1109\u1175\u11B7\u1111\u1161\u11AB",
      "\u110A\u1161\u11BC\u1103\u116E\u11BC\u110B\u1175",
      "\u110A\u1175\u1105\u1173\u11B7",
      "\u110A\u1175\u110B\u1161\u11BA",
      "\u110B\u1161\u1100\u1161\u110A\u1175",
      "\u110B\u1161\u1102\u1161\u110B\u116E\u11AB\u1109\u1165",
      "\u110B\u1161\u1103\u1173\u1102\u1175\u11B7",
      "\u110B\u1161\u1103\u1173\u11AF",
      "\u110B\u1161\u1109\u1171\u110B\u116E\u11B7",
      "\u110B\u1161\u1109\u1173\u1111\u1161\u11AF\u1110\u1173",
      "\u110B\u1161\u1109\u1175\u110B\u1161",
      "\u110B\u1161\u110B\u116E\u11AF\u1105\u1165",
      "\u110B\u1161\u110C\u1165\u110A\u1175",
      "\u110B\u1161\u110C\u116E\u11B7\u1106\u1161",
      "\u110B\u1161\u110C\u1175\u11A8",
      "\u110B\u1161\u110E\u1175\u11B7",
      "\u110B\u1161\u1111\u1161\u1110\u1173",
      "\u110B\u1161\u1111\u1173\u1105\u1175\u110F\u1161",
      "\u110B\u1161\u1111\u1173\u11B7",
      "\u110B\u1161\u1112\u1169\u11B8",
      "\u110B\u1161\u1112\u1173\u11AB",
      "\u110B\u1161\u11A8\u1100\u1175",
      "\u110B\u1161\u11A8\u1106\u1169\u11BC",
      "\u110B\u1161\u11A8\u1109\u116E",
      "\u110B\u1161\u11AB\u1100\u1162",
      "\u110B\u1161\u11AB\u1100\u1167\u11BC",
      "\u110B\u1161\u11AB\u1100\u116A",
      "\u110B\u1161\u11AB\u1102\u1162",
      "\u110B\u1161\u11AB\u1102\u1167\u11BC",
      "\u110B\u1161\u11AB\u1103\u1169\u11BC",
      "\u110B\u1161\u11AB\u1107\u1161\u11BC",
      "\u110B\u1161\u11AB\u1107\u116E",
      "\u110B\u1161\u11AB\u110C\u116E",
      "\u110B\u1161\u11AF\u1105\u116E\u1106\u1175\u1102\u1172\u11B7",
      "\u110B\u1161\u11AF\u110F\u1169\u110B\u1169\u11AF",
      "\u110B\u1161\u11B7\u1109\u1175",
      "\u110B\u1161\u11B7\u110F\u1165\u11BA",
      "\u110B\u1161\u11B8\u1105\u1167\u11A8",
      "\u110B\u1161\u11C1\u1102\u1161\u11AF",
      "\u110B\u1161\u11C1\u1106\u116E\u11AB",
      "\u110B\u1162\u110B\u1175\u11AB",
      "\u110B\u1162\u110C\u1165\u11BC",
      "\u110B\u1162\u11A8\u1109\u116E",
      "\u110B\u1162\u11AF\u1107\u1165\u11B7",
      "\u110B\u1163\u1100\u1161\u11AB",
      "\u110B\u1163\u1103\u1161\u11AB",
      "\u110B\u1163\u110B\u1169\u11BC",
      "\u110B\u1163\u11A8\u1100\u1161\u11AB",
      "\u110B\u1163\u11A8\u1100\u116E\u11A8",
      "\u110B\u1163\u11A8\u1109\u1169\u11A8",
      "\u110B\u1163\u11A8\u1109\u116E",
      "\u110B\u1163\u11A8\u110C\u1165\u11B7",
      "\u110B\u1163\u11A8\u1111\u116E\u11B7",
      "\u110B\u1163\u11A8\u1112\u1169\u11AB\u1102\u1167",
      "\u110B\u1163\u11BC\u1102\u1167\u11B7",
      "\u110B\u1163\u11BC\u1105\u1167\u11A8",
      "\u110B\u1163\u11BC\u1106\u1161\u11AF",
      "\u110B\u1163\u11BC\u1107\u1162\u110E\u116E",
      "\u110B\u1163\u11BC\u110C\u116E",
      "\u110B\u1163\u11BC\u1111\u1161",
      "\u110B\u1165\u1103\u116E\u11B7",
      "\u110B\u1165\u1105\u1167\u110B\u116E\u11B7",
      "\u110B\u1165\u1105\u1173\u11AB",
      "\u110B\u1165\u110C\u1166\u11BA\u1107\u1161\u11B7",
      "\u110B\u1165\u110D\u1162\u11BB\u1103\u1173\u11AB",
      "\u110B\u1165\u110D\u1165\u1103\u1161\u1100\u1161",
      "\u110B\u1165\u110D\u1165\u11AB\u110C\u1175",
      "\u110B\u1165\u11AB\u1102\u1175",
      "\u110B\u1165\u11AB\u1103\u1165\u11A8",
      "\u110B\u1165\u11AB\u1105\u1169\u11AB",
      "\u110B\u1165\u11AB\u110B\u1165",
      "\u110B\u1165\u11AF\u1100\u116E\u11AF",
      "\u110B\u1165\u11AF\u1105\u1173\u11AB",
      "\u110B\u1165\u11AF\u110B\u1173\u11B7",
      "\u110B\u1165\u11AF\u1111\u1175\u11BA",
      "\u110B\u1165\u11B7\u1106\u1161",
      "\u110B\u1165\u11B8\u1106\u116E",
      "\u110B\u1165\u11B8\u110C\u1169\u11BC",
      "\u110B\u1165\u11B8\u110E\u1166",
      "\u110B\u1165\u11BC\u1103\u1165\u11BC\u110B\u1175",
      "\u110B\u1165\u11BC\u1106\u1161\u11BC",
      "\u110B\u1165\u11BC\u1110\u1165\u1105\u1175",
      "\u110B\u1165\u11BD\u1100\u1173\u110C\u1166",
      "\u110B\u1166\u1102\u1165\u110C\u1175",
      "\u110B\u1166\u110B\u1165\u110F\u1165\u11AB",
      "\u110B\u1166\u11AB\u110C\u1175\u11AB",
      "\u110B\u1167\u1100\u1165\u11AB",
      "\u110B\u1167\u1100\u1169\u1109\u1162\u11BC",
      "\u110B\u1167\u1100\u116A\u11AB",
      "\u110B\u1167\u1100\u116E\u11AB",
      "\u110B\u1167\u1100\u116F\u11AB",
      "\u110B\u1167\u1103\u1162\u1109\u1162\u11BC",
      "\u110B\u1167\u1103\u1165\u11B2",
      "\u110B\u1167\u1103\u1169\u11BC\u1109\u1162\u11BC",
      "\u110B\u1167\u1103\u1173\u11AB",
      "\u110B\u1167\u1105\u1169\u11AB",
      "\u110B\u1167\u1105\u1173\u11B7",
      "\u110B\u1167\u1109\u1165\u11BA",
      "\u110B\u1167\u1109\u1165\u11BC",
      "\u110B\u1167\u110B\u116A\u11BC",
      "\u110B\u1167\u110B\u1175\u11AB",
      "\u110B\u1167\u110C\u1165\u11AB\u1112\u1175",
      "\u110B\u1167\u110C\u1175\u11A8\u110B\u116F\u11AB",
      "\u110B\u1167\u1112\u1161\u11A8\u1109\u1162\u11BC",
      "\u110B\u1167\u1112\u1162\u11BC",
      "\u110B\u1167\u11A8\u1109\u1161",
      "\u110B\u1167\u11A8\u1109\u1175",
      "\u110B\u1167\u11A8\u1112\u1161\u11AF",
      "\u110B\u1167\u11AB\u1100\u1167\u11AF",
      "\u110B\u1167\u11AB\u1100\u116E",
      "\u110B\u1167\u11AB\u1100\u1173\u11A8",
      "\u110B\u1167\u11AB\u1100\u1175",
      "\u110B\u1167\u11AB\u1105\u1161\u11A8",
      "\u110B\u1167\u11AB\u1109\u1165\u11AF",
      "\u110B\u1167\u11AB\u1109\u1166",
      "\u110B\u1167\u11AB\u1109\u1169\u11A8",
      "\u110B\u1167\u11AB\u1109\u1173\u11B8",
      "\u110B\u1167\u11AB\u110B\u1162",
      "\u110B\u1167\u11AB\u110B\u1168\u110B\u1175\u11AB",
      "\u110B\u1167\u11AB\u110B\u1175\u11AB",
      "\u110B\u1167\u11AB\u110C\u1161\u11BC",
      "\u110B\u1167\u11AB\u110C\u116E",
      "\u110B\u1167\u11AB\u110E\u116E\u11AF",
      "\u110B\u1167\u11AB\u1111\u1175\u11AF",
      "\u110B\u1167\u11AB\u1112\u1161\u11B8",
      "\u110B\u1167\u11AB\u1112\u1172",
      "\u110B\u1167\u11AF\u1100\u1175",
      "\u110B\u1167\u11AF\u1106\u1162",
      "\u110B\u1167\u11AF\u1109\u116C",
      "\u110B\u1167\u11AF\u1109\u1175\u11B7\u1112\u1175",
      "\u110B\u1167\u11AF\u110C\u1165\u11BC",
      "\u110B\u1167\u11AF\u110E\u1161",
      "\u110B\u1167\u11AF\u1112\u1173\u11AF",
      "\u110B\u1167\u11B7\u1105\u1167",
      "\u110B\u1167\u11B8\u1109\u1165",
      "\u110B\u1167\u11BC\u1100\u116E\u11A8",
      "\u110B\u1167\u11BC\u1102\u1161\u11B7",
      "\u110B\u1167\u11BC\u1109\u1161\u11BC",
      "\u110B\u1167\u11BC\u110B\u1163\u11BC",
      "\u110B\u1167\u11BC\u110B\u1167\u11A8",
      "\u110B\u1167\u11BC\u110B\u116E\u11BC",
      "\u110B\u1167\u11BC\u110B\u116F\u11AB\u1112\u1175",
      "\u110B\u1167\u11BC\u1112\u1161",
      "\u110B\u1167\u11BC\u1112\u1163\u11BC",
      "\u110B\u1167\u11BC\u1112\u1169\u11AB",
      "\u110B\u1167\u11BC\u1112\u116A",
      "\u110B\u1167\u11C1\u1100\u116E\u1105\u1175",
      "\u110B\u1167\u11C1\u1107\u1161\u11BC",
      "\u110B\u1167\u11C1\u110C\u1175\u11B8",
      "\u110B\u1168\u1100\u1161\u11B7",
      "\u110B\u1168\u1100\u1173\u11B7",
      "\u110B\u1168\u1107\u1161\u11BC",
      "\u110B\u1168\u1109\u1161\u11AB",
      "\u110B\u1168\u1109\u1161\u11BC",
      "\u110B\u1168\u1109\u1165\u11AB",
      "\u110B\u1168\u1109\u116E\u11AF",
      "\u110B\u1168\u1109\u1173\u11B8",
      "\u110B\u1168\u1109\u1175\u11A8\u110C\u1161\u11BC",
      "\u110B\u1168\u110B\u1163\u11A8",
      "\u110B\u1168\u110C\u1165\u11AB",
      "\u110B\u1168\u110C\u1165\u11AF",
      "\u110B\u1168\u110C\u1165\u11BC",
      "\u110B\u1168\u110F\u1165\u11AB\u1103\u1162",
      "\u110B\u1168\u11BA\u1102\u1161\u11AF",
      "\u110B\u1169\u1102\u1173\u11AF",
      "\u110B\u1169\u1105\u1161\u11A8",
      "\u110B\u1169\u1105\u1162\u11BA\u1103\u1169\u11BC\u110B\u1161\u11AB",
      "\u110B\u1169\u1105\u1166\u11AB\u110C\u1175",
      "\u110B\u1169\u1105\u1169\u110C\u1175",
      "\u110B\u1169\u1105\u1173\u11AB\u1107\u1161\u11AF",
      "\u110B\u1169\u1107\u1173\u11AB",
      "\u110B\u1169\u1109\u1175\u11B8",
      "\u110B\u1169\u110B\u1167\u11B7",
      "\u110B\u1169\u110B\u116F\u11AF",
      "\u110B\u1169\u110C\u1165\u11AB",
      "\u110B\u1169\u110C\u1175\u11A8",
      "\u110B\u1169\u110C\u1175\u11BC\u110B\u1165",
      "\u110B\u1169\u1111\u1166\u1105\u1161",
      "\u110B\u1169\u1111\u1175\u1109\u1173\u1110\u1166\u11AF",
      "\u110B\u1169\u1112\u1175\u1105\u1167",
      "\u110B\u1169\u11A8\u1109\u1161\u11BC",
      "\u110B\u1169\u11A8\u1109\u116E\u1109\u116E",
      "\u110B\u1169\u11AB\u1100\u1161\u11BD",
      "\u110B\u1169\u11AB\u1105\u1161\u110B\u1175\u11AB",
      "\u110B\u1169\u11AB\u1106\u1169\u11B7",
      "\u110B\u1169\u11AB\u110C\u1169\u11BC\u110B\u1175\u11AF",
      "\u110B\u1169\u11AB\u1110\u1169\u11BC",
      "\u110B\u1169\u11AF\u1100\u1161\u110B\u1173\u11AF",
      "\u110B\u1169\u11AF\u1105\u1175\u11B7\u1111\u1175\u11A8",
      "\u110B\u1169\u11AF\u1112\u1162",
      "\u110B\u1169\u11BA\u110E\u1161\u1105\u1175\u11B7",
      "\u110B\u116A\u110B\u1175\u1109\u1167\u110E\u1173",
      "\u110B\u116A\u110B\u1175\u11AB",
      "\u110B\u116A\u11AB\u1109\u1165\u11BC",
      "\u110B\u116A\u11AB\u110C\u1165\u11AB",
      "\u110B\u116A\u11BC\u1107\u1175",
      "\u110B\u116A\u11BC\u110C\u1161",
      "\u110B\u116B\u1102\u1163\u1112\u1161\u1106\u1167\u11AB",
      "\u110B\u116B\u11AB\u110C\u1175",
      "\u110B\u116C\u1100\u1161\u11BA\u110C\u1175\u11B8",
      "\u110B\u116C\u1100\u116E\u11A8",
      "\u110B\u116C\u1105\u1169\u110B\u116E\u11B7",
      "\u110B\u116C\u1109\u1161\u11B7\u110E\u1169\u11AB",
      "\u110B\u116C\u110E\u116E\u11AF",
      "\u110B\u116C\u110E\u1175\u11B7",
      "\u110B\u116C\u1112\u1161\u11AF\u1106\u1165\u1102\u1175",
      "\u110B\u116C\u11AB\u1107\u1161\u11AF",
      "\u110B\u116C\u11AB\u1109\u1169\u11AB",
      "\u110B\u116C\u11AB\u110D\u1169\u11A8",
      "\u110B\u116D\u1100\u1173\u11B7",
      "\u110B\u116D\u110B\u1175\u11AF",
      "\u110B\u116D\u110C\u1173\u11B7",
      "\u110B\u116D\u110E\u1165\u11BC",
      "\u110B\u116D\u11BC\u1100\u1175",
      "\u110B\u116D\u11BC\u1109\u1165",
      "\u110B\u116D\u11BC\u110B\u1165",
      "\u110B\u116E\u1109\u1161\u11AB",
      "\u110B\u116E\u1109\u1165\u11AB",
      "\u110B\u116E\u1109\u1173\u11BC",
      "\u110B\u116E\u110B\u1167\u11AB\u1112\u1175",
      "\u110B\u116E\u110C\u1165\u11BC",
      "\u110B\u116E\u110E\u1166\u1100\u116E\u11A8",
      "\u110B\u116E\u1111\u1167\u11AB",
      "\u110B\u116E\u11AB\u1103\u1169\u11BC",
      "\u110B\u116E\u11AB\u1106\u1167\u11BC",
      "\u110B\u116E\u11AB\u1107\u1161\u11AB",
      "\u110B\u116E\u11AB\u110C\u1165\u11AB",
      "\u110B\u116E\u11AB\u1112\u1162\u11BC",
      "\u110B\u116E\u11AF\u1109\u1161\u11AB",
      "\u110B\u116E\u11AF\u110B\u1173\u11B7",
      "\u110B\u116E\u11B7\u110C\u1175\u11A8\u110B\u1175\u11B7",
      "\u110B\u116E\u11BA\u110B\u1165\u1105\u1173\u11AB",
      "\u110B\u116E\u11BA\u110B\u1173\u11B7",
      "\u110B\u116F\u1102\u1161\u11A8",
      "\u110B\u116F\u11AB\u1100\u1169",
      "\u110B\u116F\u11AB\u1105\u1162",
      "\u110B\u116F\u11AB\u1109\u1165",
      "\u110B\u116F\u11AB\u1109\u116E\u11BC\u110B\u1175",
      "\u110B\u116F\u11AB\u110B\u1175\u11AB",
      "\u110B\u116F\u11AB\u110C\u1161\u11BC",
      "\u110B\u116F\u11AB\u1111\u1175\u1109\u1173",
      "\u110B\u116F\u11AF\u1100\u1173\u11B8",
      "\u110B\u116F\u11AF\u1103\u1173\u110F\u1165\u11B8",
      "\u110B\u116F\u11AF\u1109\u1166",
      "\u110B\u116F\u11AF\u110B\u116D\u110B\u1175\u11AF",
      "\u110B\u1170\u110B\u1175\u1110\u1165",
      "\u110B\u1171\u1107\u1161\u11AB",
      "\u110B\u1171\u1107\u1165\u11B8",
      "\u110B\u1171\u1109\u1165\u11BC",
      "\u110B\u1171\u110B\u116F\u11AB",
      "\u110B\u1171\u1112\u1165\u11B7",
      "\u110B\u1171\u1112\u1167\u11B8",
      "\u110B\u1171\u11BA\u1109\u1161\u1105\u1161\u11B7",
      "\u110B\u1172\u1102\u1161\u11AB\u1112\u1175",
      "\u110B\u1172\u1105\u1165\u11B8",
      "\u110B\u1172\u1106\u1167\u11BC",
      "\u110B\u1172\u1106\u116E\u11AF",
      "\u110B\u1172\u1109\u1161\u11AB",
      "\u110B\u1172\u110C\u1165\u11A8",
      "\u110B\u1172\u110E\u1175\u110B\u116F\u11AB",
      "\u110B\u1172\u1112\u1161\u11A8",
      "\u110B\u1172\u1112\u1162\u11BC",
      "\u110B\u1172\u1112\u1167\u11BC",
      "\u110B\u1172\u11A8\u1100\u116E\u11AB",
      "\u110B\u1172\u11A8\u1109\u1161\u11BC",
      "\u110B\u1172\u11A8\u1109\u1175\u11B8",
      "\u110B\u1172\u11A8\u110E\u1166",
      "\u110B\u1173\u11AB\u1112\u1162\u11BC",
      "\u110B\u1173\u11B7\u1105\u1167\u11A8",
      "\u110B\u1173\u11B7\u1105\u116D",
      "\u110B\u1173\u11B7\u1107\u1161\u11AB",
      "\u110B\u1173\u11B7\u1109\u1165\u11BC",
      "\u110B\u1173\u11B7\u1109\u1175\u11A8",
      "\u110B\u1173\u11B7\u110B\u1161\u11A8",
      "\u110B\u1173\u11B7\u110C\u116E",
      "\u110B\u1174\u1100\u1167\u11AB",
      "\u110B\u1174\u1102\u1169\u11AB",
      "\u110B\u1174\u1106\u116E\u11AB",
      "\u110B\u1174\u1107\u1169\u11A8",
      "\u110B\u1174\u1109\u1175\u11A8",
      "\u110B\u1174\u1109\u1175\u11B7",
      "\u110B\u1174\u110B\u116C\u1105\u1169",
      "\u110B\u1174\u110B\u116D\u11A8",
      "\u110B\u1174\u110B\u116F\u11AB",
      "\u110B\u1174\u1112\u1161\u11A8",
      "\u110B\u1175\u1100\u1165\u11BA",
      "\u110B\u1175\u1100\u1169\u11BA",
      "\u110B\u1175\u1102\u1167\u11B7",
      "\u110B\u1175\u1102\u1169\u11B7",
      "\u110B\u1175\u1103\u1161\u11AF",
      "\u110B\u1175\u1103\u1162\u1105\u1169",
      "\u110B\u1175\u1103\u1169\u11BC",
      "\u110B\u1175\u1105\u1165\u11C2\u1100\u1166",
      "\u110B\u1175\u1105\u1167\u11A8\u1109\u1165",
      "\u110B\u1175\u1105\u1169\u11AB\u110C\u1165\u11A8",
      "\u110B\u1175\u1105\u1173\u11B7",
      "\u110B\u1175\u1106\u1175\u11AB",
      "\u110B\u1175\u1107\u1161\u11AF\u1109\u1169",
      "\u110B\u1175\u1107\u1167\u11AF",
      "\u110B\u1175\u1107\u116E\u11AF",
      "\u110B\u1175\u1108\u1161\u11AF",
      "\u110B\u1175\u1109\u1161\u11BC",
      "\u110B\u1175\u1109\u1165\u11BC",
      "\u110B\u1175\u1109\u1173\u11AF",
      "\u110B\u1175\u110B\u1163\u1100\u1175",
      "\u110B\u1175\u110B\u116D\u11BC",
      "\u110B\u1175\u110B\u116E\u11BA",
      "\u110B\u1175\u110B\u116F\u11AF",
      "\u110B\u1175\u110B\u1173\u11A8\u1100\u1169",
      "\u110B\u1175\u110B\u1175\u11A8",
      "\u110B\u1175\u110C\u1165\u11AB",
      "\u110B\u1175\u110C\u116E\u11BC",
      "\u110B\u1175\u1110\u1173\u11AE\u1102\u1161\u11AF",
      "\u110B\u1175\u1110\u1173\u11AF",
      "\u110B\u1175\u1112\u1169\u11AB",
      "\u110B\u1175\u11AB\u1100\u1161\u11AB",
      "\u110B\u1175\u11AB\u1100\u1167\u11A8",
      "\u110B\u1175\u11AB\u1100\u1169\u11BC",
      "\u110B\u1175\u11AB\u1100\u116E",
      "\u110B\u1175\u11AB\u1100\u1173\u11AB",
      "\u110B\u1175\u11AB\u1100\u1175",
      "\u110B\u1175\u11AB\u1103\u1169",
      "\u110B\u1175\u11AB\u1105\u1172",
      "\u110B\u1175\u11AB\u1106\u116E\u11AF",
      "\u110B\u1175\u11AB\u1109\u1162\u11BC",
      "\u110B\u1175\u11AB\u1109\u116B",
      "\u110B\u1175\u11AB\u110B\u1167\u11AB",
      "\u110B\u1175\u11AB\u110B\u116F\u11AB",
      "\u110B\u1175\u11AB\u110C\u1162",
      "\u110B\u1175\u11AB\u110C\u1169\u11BC",
      "\u110B\u1175\u11AB\u110E\u1165\u11AB",
      "\u110B\u1175\u11AB\u110E\u1166",
      "\u110B\u1175\u11AB\u1110\u1165\u1102\u1166\u11BA",
      "\u110B\u1175\u11AB\u1112\u1161",
      "\u110B\u1175\u11AB\u1112\u1167\u11BC",
      "\u110B\u1175\u11AF\u1100\u1169\u11B8",
      "\u110B\u1175\u11AF\u1100\u1175",
      "\u110B\u1175\u11AF\u1103\u1161\u11AB",
      "\u110B\u1175\u11AF\u1103\u1162",
      "\u110B\u1175\u11AF\u1103\u1173\u11BC",
      "\u110B\u1175\u11AF\u1107\u1161\u11AB",
      "\u110B\u1175\u11AF\u1107\u1169\u11AB",
      "\u110B\u1175\u11AF\u1107\u116E",
      "\u110B\u1175\u11AF\u1109\u1161\u11BC",
      "\u110B\u1175\u11AF\u1109\u1162\u11BC",
      "\u110B\u1175\u11AF\u1109\u1169\u11AB",
      "\u110B\u1175\u11AF\u110B\u116D\u110B\u1175\u11AF",
      "\u110B\u1175\u11AF\u110B\u116F\u11AF",
      "\u110B\u1175\u11AF\u110C\u1165\u11BC",
      "\u110B\u1175\u11AF\u110C\u1169\u11BC",
      "\u110B\u1175\u11AF\u110C\u116E\u110B\u1175\u11AF",
      "\u110B\u1175\u11AF\u110D\u1175\u11A8",
      "\u110B\u1175\u11AF\u110E\u1166",
      "\u110B\u1175\u11AF\u110E\u1175",
      "\u110B\u1175\u11AF\u1112\u1162\u11BC",
      "\u110B\u1175\u11AF\u1112\u116C\u110B\u116D\u11BC",
      "\u110B\u1175\u11B7\u1100\u1173\u11B7",
      "\u110B\u1175\u11B7\u1106\u116E",
      "\u110B\u1175\u11B8\u1103\u1162",
      "\u110B\u1175\u11B8\u1105\u1167\u11A8",
      "\u110B\u1175\u11B8\u1106\u1161\u11BA",
      "\u110B\u1175\u11B8\u1109\u1161",
      "\u110B\u1175\u11B8\u1109\u116E\u11AF",
      "\u110B\u1175\u11B8\u1109\u1175",
      "\u110B\u1175\u11B8\u110B\u116F\u11AB",
      "\u110B\u1175\u11B8\u110C\u1161\u11BC",
      "\u110B\u1175\u11B8\u1112\u1161\u11A8",
      "\u110C\u1161\u1100\u1161\u110B\u116D\u11BC",
      "\u110C\u1161\u1100\u1167\u11A8",
      "\u110C\u1161\u1100\u1173\u11A8",
      "\u110C\u1161\u1103\u1169\u11BC",
      "\u110C\u1161\u1105\u1161\u11BC",
      "\u110C\u1161\u1107\u116E\u1109\u1175\u11B7",
      "\u110C\u1161\u1109\u1175\u11A8",
      "\u110C\u1161\u1109\u1175\u11AB",
      "\u110C\u1161\u110B\u1167\u11AB",
      "\u110C\u1161\u110B\u116F\u11AB",
      "\u110C\u1161\u110B\u1172\u11AF",
      "\u110C\u1161\u110C\u1165\u11AB\u1100\u1165",
      "\u110C\u1161\u110C\u1165\u11BC",
      "\u110C\u1161\u110C\u1169\u11AB\u1109\u1175\u11B7",
      "\u110C\u1161\u1111\u1161\u11AB",
      "\u110C\u1161\u11A8\u1100\u1161",
      "\u110C\u1161\u11A8\u1102\u1167\u11AB",
      "\u110C\u1161\u11A8\u1109\u1165\u11BC",
      "\u110C\u1161\u11A8\u110B\u1165\u11B8",
      "\u110C\u1161\u11A8\u110B\u116D\u11BC",
      "\u110C\u1161\u11A8\u110B\u1173\u11AB\u1104\u1161\u11AF",
      "\u110C\u1161\u11A8\u1111\u116E\u11B7",
      "\u110C\u1161\u11AB\u1103\u1175",
      "\u110C\u1161\u11AB\u1104\u1173\u11A8",
      "\u110C\u1161\u11AB\u110E\u1175",
      "\u110C\u1161\u11AF\u1106\u1169\u11BA",
      "\u110C\u1161\u11B7\u1101\u1161\u11AB",
      "\u110C\u1161\u11B7\u1109\u116E\u1112\u1161\u11B7",
      "\u110C\u1161\u11B7\u1109\u1175",
      "\u110C\u1161\u11B7\u110B\u1169\u11BA",
      "\u110C\u1161\u11B7\u110C\u1161\u1105\u1175",
      "\u110C\u1161\u11B8\u110C\u1175",
      "\u110C\u1161\u11BC\u1100\u116A\u11AB",
      "\u110C\u1161\u11BC\u1100\u116E\u11AB",
      "\u110C\u1161\u11BC\u1100\u1175\u1100\u1161\u11AB",
      "\u110C\u1161\u11BC\u1105\u1162",
      "\u110C\u1161\u11BC\u1105\u1168",
      "\u110C\u1161\u11BC\u1105\u1173",
      "\u110C\u1161\u11BC\u1106\u1161",
      "\u110C\u1161\u11BC\u1106\u1167\u11AB",
      "\u110C\u1161\u11BC\u1106\u1169",
      "\u110C\u1161\u11BC\u1106\u1175",
      "\u110C\u1161\u11BC\u1107\u1175",
      "\u110C\u1161\u11BC\u1109\u1161",
      "\u110C\u1161\u11BC\u1109\u1169",
      "\u110C\u1161\u11BC\u1109\u1175\u11A8",
      "\u110C\u1161\u11BC\u110B\u1162\u110B\u1175\u11AB",
      "\u110C\u1161\u11BC\u110B\u1175\u11AB",
      "\u110C\u1161\u11BC\u110C\u1165\u11B7",
      "\u110C\u1161\u11BC\u110E\u1161",
      "\u110C\u1161\u11BC\u1112\u1161\u11A8\u1100\u1173\u11B7",
      "\u110C\u1162\u1102\u1173\u11BC",
      "\u110C\u1162\u1108\u1161\u11AF\u1105\u1175",
      "\u110C\u1162\u1109\u1161\u11AB",
      "\u110C\u1162\u1109\u1162\u11BC",
      "\u110C\u1162\u110C\u1161\u11A8\u1102\u1167\u11AB",
      "\u110C\u1162\u110C\u1165\u11BC",
      "\u110C\u1162\u110E\u1162\u1100\u1175",
      "\u110C\u1162\u1111\u1161\u11AB",
      "\u110C\u1162\u1112\u1161\u11A8",
      "\u110C\u1162\u1112\u116A\u11AF\u110B\u116D\u11BC",
      "\u110C\u1165\u1100\u1165\u11BA",
      "\u110C\u1165\u1100\u1169\u1105\u1175",
      "\u110C\u1165\u1100\u1169\u11BA",
      "\u110C\u1165\u1102\u1167\u11A8",
      "\u110C\u1165\u1105\u1165\u11AB",
      "\u110C\u1165\u1105\u1165\u11C2\u1100\u1166",
      "\u110C\u1165\u1107\u1165\u11AB",
      "\u110C\u1165\u110B\u116E\u11AF",
      "\u110C\u1165\u110C\u1165\u11AF\u1105\u1169",
      "\u110C\u1165\u110E\u116E\u11A8",
      "\u110C\u1165\u11A8\u1100\u1173\u11A8",
      "\u110C\u1165\u11A8\u1103\u1161\u11BC\u1112\u1175",
      "\u110C\u1165\u11A8\u1109\u1165\u11BC",
      "\u110C\u1165\u11A8\u110B\u116D\u11BC",
      "\u110C\u1165\u11A8\u110B\u1173\u11BC",
      "\u110C\u1165\u11AB\u1100\u1162",
      "\u110C\u1165\u11AB\u1100\u1169\u11BC",
      "\u110C\u1165\u11AB\u1100\u1175",
      "\u110C\u1165\u11AB\u1103\u1161\u11AF",
      "\u110C\u1165\u11AB\u1105\u1161\u1103\u1169",
      "\u110C\u1165\u11AB\u1106\u1161\u11BC",
      "\u110C\u1165\u11AB\u1106\u116E\u11AB",
      "\u110C\u1165\u11AB\u1107\u1161\u11AB",
      "\u110C\u1165\u11AB\u1107\u116E",
      "\u110C\u1165\u11AB\u1109\u1166",
      "\u110C\u1165\u11AB\u1109\u1175",
      "\u110C\u1165\u11AB\u110B\u116D\u11BC",
      "\u110C\u1165\u11AB\u110C\u1161",
      "\u110C\u1165\u11AB\u110C\u1162\u11BC",
      "\u110C\u1165\u11AB\u110C\u116E",
      "\u110C\u1165\u11AB\u110E\u1165\u11AF",
      "\u110C\u1165\u11AB\u110E\u1166",
      "\u110C\u1165\u11AB\u1110\u1169\u11BC",
      "\u110C\u1165\u11AB\u1112\u1167",
      "\u110C\u1165\u11AB\u1112\u116E",
      "\u110C\u1165\u11AF\u1103\u1162",
      "\u110C\u1165\u11AF\u1106\u1161\u11BC",
      "\u110C\u1165\u11AF\u1107\u1161\u11AB",
      "\u110C\u1165\u11AF\u110B\u1163\u11A8",
      "\u110C\u1165\u11AF\u110E\u1161",
      "\u110C\u1165\u11B7\u1100\u1165\u11B7",
      "\u110C\u1165\u11B7\u1109\u116E",
      "\u110C\u1165\u11B7\u1109\u1175\u11B7",
      "\u110C\u1165\u11B7\u110B\u116F\u11AB",
      "\u110C\u1165\u11B7\u110C\u1165\u11B7",
      "\u110C\u1165\u11B7\u110E\u1161",
      "\u110C\u1165\u11B8\u1100\u1173\u11AB",
      "\u110C\u1165\u11B8\u1109\u1175",
      "\u110C\u1165\u11B8\u110E\u1169\u11A8",
      "\u110C\u1165\u11BA\u1100\u1161\u1105\u1161\u11A8",
      "\u110C\u1165\u11BC\u1100\u1165\u110C\u1161\u11BC",
      "\u110C\u1165\u11BC\u1103\u1169",
      "\u110C\u1165\u11BC\u1105\u1172\u110C\u1161\u11BC",
      "\u110C\u1165\u11BC\u1105\u1175",
      "\u110C\u1165\u11BC\u1106\u1161\u11AF",
      "\u110C\u1165\u11BC\u1106\u1167\u11AB",
      "\u110C\u1165\u11BC\u1106\u116E\u11AB",
      "\u110C\u1165\u11BC\u1107\u1161\u11AB\u1103\u1162",
      "\u110C\u1165\u11BC\u1107\u1169",
      "\u110C\u1165\u11BC\u1107\u116E",
      "\u110C\u1165\u11BC\u1107\u1175",
      "\u110C\u1165\u11BC\u1109\u1161\u11BC",
      "\u110C\u1165\u11BC\u1109\u1165\u11BC",
      "\u110C\u1165\u11BC\u110B\u1169",
      "\u110C\u1165\u11BC\u110B\u116F\u11AB",
      "\u110C\u1165\u11BC\u110C\u1161\u11BC",
      "\u110C\u1165\u11BC\u110C\u1175",
      "\u110C\u1165\u11BC\u110E\u1175",
      "\u110C\u1165\u11BC\u1112\u116A\u11A8\u1112\u1175",
      "\u110C\u1166\u1100\u1169\u11BC",
      "\u110C\u1166\u1100\u116A\u110C\u1165\u11B7",
      "\u110C\u1166\u1103\u1162\u1105\u1169",
      "\u110C\u1166\u1106\u1169\u11A8",
      "\u110C\u1166\u1107\u1161\u11AF",
      "\u110C\u1166\u1107\u1165\u11B8",
      "\u110C\u1166\u1109\u1161\u11BA\u1102\u1161\u11AF",
      "\u110C\u1166\u110B\u1161\u11AB",
      "\u110C\u1166\u110B\u1175\u11AF",
      "\u110C\u1166\u110C\u1161\u11A8",
      "\u110C\u1166\u110C\u116E\u1103\u1169",
      "\u110C\u1166\u110E\u116E\u11AF",
      "\u110C\u1166\u1111\u116E\u11B7",
      "\u110C\u1166\u1112\u1161\u11AB",
      "\u110C\u1169\u1100\u1161\u11A8",
      "\u110C\u1169\u1100\u1165\u11AB",
      "\u110C\u1169\u1100\u1173\u11B7",
      "\u110C\u1169\u1100\u1175\u11BC",
      "\u110C\u1169\u1106\u1167\u11BC",
      "\u110C\u1169\u1106\u1175\u1105\u116D",
      "\u110C\u1169\u1109\u1161\u11BC",
      "\u110C\u1169\u1109\u1165\u11AB",
      "\u110C\u1169\u110B\u116D\u11BC\u1112\u1175",
      "\u110C\u1169\u110C\u1165\u11AF",
      "\u110C\u1169\u110C\u1165\u11BC",
      "\u110C\u1169\u110C\u1175\u11A8",
      "\u110C\u1169\u11AB\u1103\u1162\u11BA\u1106\u1161\u11AF",
      "\u110C\u1169\u11AB\u110C\u1162",
      "\u110C\u1169\u11AF\u110B\u1165\u11B8",
      "\u110C\u1169\u11AF\u110B\u1173\u11B7",
      "\u110C\u1169\u11BC\u1100\u116D",
      "\u110C\u1169\u11BC\u1105\u1169",
      "\u110C\u1169\u11BC\u1105\u1172",
      "\u110C\u1169\u11BC\u1109\u1169\u1105\u1175",
      "\u110C\u1169\u11BC\u110B\u1165\u11B8\u110B\u116F\u11AB",
      "\u110C\u1169\u11BC\u110C\u1169\u11BC",
      "\u110C\u1169\u11BC\u1112\u1161\u11B8",
      "\u110C\u116A\u1109\u1165\u11A8",
      "\u110C\u116C\u110B\u1175\u11AB",
      "\u110C\u116E\u1100\u116A\u11AB\u110C\u1165\u11A8",
      "\u110C\u116E\u1105\u1173\u11B7",
      "\u110C\u116E\u1106\u1161\u11AF",
      "\u110C\u116E\u1106\u1165\u1102\u1175",
      "\u110C\u116E\u1106\u1165\u11A8",
      "\u110C\u116E\u1106\u116E\u11AB",
      "\u110C\u116E\u1106\u1175\u11AB",
      "\u110C\u116E\u1107\u1161\u11BC",
      "\u110C\u116E\u1107\u1167\u11AB",
      "\u110C\u116E\u1109\u1175\u11A8",
      "\u110C\u116E\u110B\u1175\u11AB",
      "\u110C\u116E\u110B\u1175\u11AF",
      "\u110C\u116E\u110C\u1161\u11BC",
      "\u110C\u116E\u110C\u1165\u11AB\u110C\u1161",
      "\u110C\u116E\u1110\u1162\u11A8",
      "\u110C\u116E\u11AB\u1107\u1175",
      "\u110C\u116E\u11AF\u1100\u1165\u1105\u1175",
      "\u110C\u116E\u11AF\u1100\u1175",
      "\u110C\u116E\u11AF\u1106\u116E\u1102\u1174",
      "\u110C\u116E\u11BC\u1100\u1161\u11AB",
      "\u110C\u116E\u11BC\u1100\u1168\u1107\u1161\u11BC\u1109\u1169\u11BC",
      "\u110C\u116E\u11BC\u1100\u116E\u11A8",
      "\u110C\u116E\u11BC\u1102\u1167\u11AB",
      "\u110C\u116E\u11BC\u1103\u1161\u11AB",
      "\u110C\u116E\u11BC\u1103\u1169\u11A8",
      "\u110C\u116E\u11BC\u1107\u1161\u11AB",
      "\u110C\u116E\u11BC\u1107\u116E",
      "\u110C\u116E\u11BC\u1109\u1166",
      "\u110C\u116E\u11BC\u1109\u1169\u1100\u1175\u110B\u1165\u11B8",
      "\u110C\u116E\u11BC\u1109\u116E\u11AB",
      "\u110C\u116E\u11BC\u110B\u1161\u11BC",
      "\u110C\u116E\u11BC\u110B\u116D",
      "\u110C\u116E\u11BC\u1112\u1161\u11A8\u1100\u116D",
      "\u110C\u1173\u11A8\u1109\u1165\u11A8",
      "\u110C\u1173\u11A8\u1109\u1175",
      "\u110C\u1173\u11AF\u1100\u1165\u110B\u116E\u11B7",
      "\u110C\u1173\u11BC\u1100\u1161",
      "\u110C\u1173\u11BC\u1100\u1165",
      "\u110C\u1173\u11BC\u1100\u116F\u11AB",
      "\u110C\u1173\u11BC\u1109\u1161\u11BC",
      "\u110C\u1173\u11BC\u1109\u1166",
      "\u110C\u1175\u1100\u1161\u11A8",
      "\u110C\u1175\u1100\u1161\u11B8",
      "\u110C\u1175\u1100\u1167\u11BC",
      "\u110C\u1175\u1100\u1173\u11A8\u1112\u1175",
      "\u110C\u1175\u1100\u1173\u11B7",
      "\u110C\u1175\u1100\u1173\u11B8",
      "\u110C\u1175\u1102\u1173\u11BC",
      "\u110C\u1175\u1105\u1173\u11B7\u1100\u1175\u11AF",
      "\u110C\u1175\u1105\u1175\u1109\u1161\u11AB",
      "\u110C\u1175\u1107\u1161\u11BC",
      "\u110C\u1175\u1107\u116E\u11BC",
      "\u110C\u1175\u1109\u1175\u11A8",
      "\u110C\u1175\u110B\u1167\u11A8",
      "\u110C\u1175\u110B\u116E\u1100\u1162",
      "\u110C\u1175\u110B\u116F\u11AB",
      "\u110C\u1175\u110C\u1165\u11A8",
      "\u110C\u1175\u110C\u1165\u11B7",
      "\u110C\u1175\u110C\u1175\u11AB",
      "\u110C\u1175\u110E\u116E\u11AF",
      "\u110C\u1175\u11A8\u1109\u1165\u11AB",
      "\u110C\u1175\u11A8\u110B\u1165\u11B8",
      "\u110C\u1175\u11A8\u110B\u116F\u11AB",
      "\u110C\u1175\u11A8\u110C\u1161\u11BC",
      "\u110C\u1175\u11AB\u1100\u1173\u11B8",
      "\u110C\u1175\u11AB\u1103\u1169\u11BC",
      "\u110C\u1175\u11AB\u1105\u1169",
      "\u110C\u1175\u11AB\u1105\u116D",
      "\u110C\u1175\u11AB\u1105\u1175",
      "\u110C\u1175\u11AB\u110D\u1161",
      "\u110C\u1175\u11AB\u110E\u1161\u11AF",
      "\u110C\u1175\u11AB\u110E\u116E\u11AF",
      "\u110C\u1175\u11AB\u1110\u1169\u11BC",
      "\u110C\u1175\u11AB\u1112\u1162\u11BC",
      "\u110C\u1175\u11AF\u1106\u116E\u11AB",
      "\u110C\u1175\u11AF\u1107\u1167\u11BC",
      "\u110C\u1175\u11AF\u1109\u1165",
      "\u110C\u1175\u11B7\u110C\u1161\u11A8",
      "\u110C\u1175\u11B8\u1103\u1161\u11AB",
      "\u110C\u1175\u11B8\u110B\u1161\u11AB",
      "\u110C\u1175\u11B8\u110C\u116E\u11BC",
      "\u110D\u1161\u110C\u1173\u11BC",
      "\u110D\u1175\u1101\u1165\u1100\u1175",
      "\u110E\u1161\u1102\u1161\u11B7",
      "\u110E\u1161\u1105\u1161\u1105\u1175",
      "\u110E\u1161\u1105\u1163\u11BC",
      "\u110E\u1161\u1105\u1175\u11B7",
      "\u110E\u1161\u1107\u1167\u11AF",
      "\u110E\u1161\u1109\u1165\u11AB",
      "\u110E\u1161\u110E\u1173\u11B7",
      "\u110E\u1161\u11A8\u1100\u1161\u11A8",
      "\u110E\u1161\u11AB\u1106\u116E\u11AF",
      "\u110E\u1161\u11AB\u1109\u1165\u11BC",
      "\u110E\u1161\u11B7\u1100\u1161",
      "\u110E\u1161\u11B7\u1100\u1175\u1105\u1173\u11B7",
      "\u110E\u1161\u11B7\u1109\u1162",
      "\u110E\u1161\u11B7\u1109\u1165\u11A8",
      "\u110E\u1161\u11B7\u110B\u1167",
      "\u110E\u1161\u11B7\u110B\u116C",
      "\u110E\u1161\u11B7\u110C\u1169",
      "\u110E\u1161\u11BA\u110C\u1161\u11AB",
      "\u110E\u1161\u11BC\u1100\u1161",
      "\u110E\u1161\u11BC\u1100\u1169",
      "\u110E\u1161\u11BC\u1100\u116E",
      "\u110E\u1161\u11BC\u1106\u116E\u11AB",
      "\u110E\u1161\u11BC\u1107\u1161\u11A9",
      "\u110E\u1161\u11BC\u110C\u1161\u11A8",
      "\u110E\u1161\u11BC\u110C\u1169",
      "\u110E\u1162\u1102\u1165\u11AF",
      "\u110E\u1162\u110C\u1165\u11B7",
      "\u110E\u1162\u11A8\u1100\u1161\u1107\u1161\u11BC",
      "\u110E\u1162\u11A8\u1107\u1161\u11BC",
      "\u110E\u1162\u11A8\u1109\u1161\u11BC",
      "\u110E\u1162\u11A8\u110B\u1175\u11B7",
      "\u110E\u1162\u11B7\u1111\u1175\u110B\u1165\u11AB",
      "\u110E\u1165\u1107\u1165\u11AF",
      "\u110E\u1165\u110B\u1173\u11B7",
      "\u110E\u1165\u11AB\u1100\u116E\u11A8",
      "\u110E\u1165\u11AB\u1103\u116E\u11BC",
      "\u110E\u1165\u11AB\u110C\u1161\u11BC",
      "\u110E\u1165\u11AB\u110C\u1162",
      "\u110E\u1165\u11AB\u110E\u1165\u11AB\u1112\u1175",
      "\u110E\u1165\u11AF\u1103\u1169",
      "\u110E\u1165\u11AF\u110C\u1165\u1112\u1175",
      "\u110E\u1165\u11AF\u1112\u1161\u11A8",
      "\u110E\u1165\u11BA\u1102\u1161\u11AF",
      "\u110E\u1165\u11BA\u110D\u1162",
      "\u110E\u1165\u11BC\u1102\u1167\u11AB",
      "\u110E\u1165\u11BC\u1107\u1161\u110C\u1175",
      "\u110E\u1165\u11BC\u1109\u1169",
      "\u110E\u1165\u11BC\u110E\u116E\u11AB",
      "\u110E\u1166\u1100\u1168",
      "\u110E\u1166\u1105\u1167\u11A8",
      "\u110E\u1166\u110B\u1169\u11AB",
      "\u110E\u1166\u110B\u1172\u11A8",
      "\u110E\u1166\u110C\u116E\u11BC",
      "\u110E\u1166\u1112\u1165\u11B7",
      "\u110E\u1169\u1103\u1173\u11BC\u1112\u1161\u11A8\u1109\u1162\u11BC",
      "\u110E\u1169\u1107\u1161\u11AB",
      "\u110E\u1169\u1107\u1161\u11B8",
      "\u110E\u1169\u1109\u1161\u11BC\u1112\u116A",
      "\u110E\u1169\u1109\u116E\u11AB",
      "\u110E\u1169\u110B\u1167\u1105\u1173\u11B7",
      "\u110E\u1169\u110B\u116F\u11AB",
      "\u110E\u1169\u110C\u1165\u1102\u1167\u11A8",
      "\u110E\u1169\u110C\u1165\u11B7",
      "\u110E\u1169\u110E\u1165\u11BC",
      "\u110E\u1169\u110F\u1169\u11AF\u1105\u1175\u11BA",
      "\u110E\u1169\u11BA\u1107\u116E\u11AF",
      "\u110E\u1169\u11BC\u1100\u1161\u11A8",
      "\u110E\u1169\u11BC\u1105\u1175",
      "\u110E\u1169\u11BC\u110C\u1161\u11BC",
      "\u110E\u116A\u11AF\u110B\u1167\u11BC",
      "\u110E\u116C\u1100\u1173\u11AB",
      "\u110E\u116C\u1109\u1161\u11BC",
      "\u110E\u116C\u1109\u1165\u11AB",
      "\u110E\u116C\u1109\u1175\u11AB",
      "\u110E\u116C\u110B\u1161\u11A8",
      "\u110E\u116C\u110C\u1169\u11BC",
      "\u110E\u116E\u1109\u1165\u11A8",
      "\u110E\u116E\u110B\u1165\u11A8",
      "\u110E\u116E\u110C\u1175\u11AB",
      "\u110E\u116E\u110E\u1165\u11AB",
      "\u110E\u116E\u110E\u1173\u11A8",
      "\u110E\u116E\u11A8\u1100\u116E",
      "\u110E\u116E\u11A8\u1109\u1169",
      "\u110E\u116E\u11A8\u110C\u1166",
      "\u110E\u116E\u11A8\u1112\u1161",
      "\u110E\u116E\u11AF\u1100\u1173\u11AB",
      "\u110E\u116E\u11AF\u1107\u1161\u11AF",
      "\u110E\u116E\u11AF\u1109\u1161\u11AB",
      "\u110E\u116E\u11AF\u1109\u1175\u11AB",
      "\u110E\u116E\u11AF\u110B\u1167\u11AB",
      "\u110E\u116E\u11AF\u110B\u1175\u11B8",
      "\u110E\u116E\u11AF\u110C\u1161\u11BC",
      "\u110E\u116E\u11AF\u1111\u1161\u11AB",
      "\u110E\u116E\u11BC\u1100\u1167\u11A8",
      "\u110E\u116E\u11BC\u1100\u1169",
      "\u110E\u116E\u11BC\u1103\u1169\u11AF",
      "\u110E\u116E\u11BC\u1107\u116E\u11AB\u1112\u1175",
      "\u110E\u116E\u11BC\u110E\u1165\u11BC\u1103\u1169",
      "\u110E\u1171\u110B\u1165\u11B8",
      "\u110E\u1171\u110C\u1175\u11A8",
      "\u110E\u1171\u1112\u1163\u11BC",
      "\u110E\u1175\u110B\u1163\u11A8",
      "\u110E\u1175\u11AB\u1100\u116E",
      "\u110E\u1175\u11AB\u110E\u1165\u11A8",
      "\u110E\u1175\u11AF\u1109\u1175\u11B8",
      "\u110E\u1175\u11AF\u110B\u116F\u11AF",
      "\u110E\u1175\u11AF\u1111\u1161\u11AB",
      "\u110E\u1175\u11B7\u1103\u1162",
      "\u110E\u1175\u11B7\u1106\u116E\u11A8",
      "\u110E\u1175\u11B7\u1109\u1175\u11AF",
      "\u110E\u1175\u11BA\u1109\u1169\u11AF",
      "\u110E\u1175\u11BC\u110E\u1161\u11AB",
      "\u110F\u1161\u1106\u1166\u1105\u1161",
      "\u110F\u1161\u110B\u116E\u11AB\u1110\u1165",
      "\u110F\u1161\u11AF\u1100\u116E\u11A8\u1109\u116E",
      "\u110F\u1162\u1105\u1175\u11A8\u1110\u1165",
      "\u110F\u1162\u11B7\u1111\u1165\u1109\u1173",
      "\u110F\u1162\u11B7\u1111\u1166\u110B\u1175\u11AB",
      "\u110F\u1165\u1110\u1173\u11AB",
      "\u110F\u1165\u11AB\u1103\u1175\u1109\u1167\u11AB",
      "\u110F\u1165\u11AF\u1105\u1165",
      "\u110F\u1165\u11B7\u1111\u1172\u1110\u1165",
      "\u110F\u1169\u1101\u1175\u1105\u1175",
      "\u110F\u1169\u1106\u1175\u1103\u1175",
      "\u110F\u1169\u11AB\u1109\u1165\u1110\u1173",
      "\u110F\u1169\u11AF\u1105\u1161",
      "\u110F\u1169\u11B7\u1111\u1173\u11AF\u1105\u1166\u11A8\u1109\u1173",
      "\u110F\u1169\u11BC\u1102\u1161\u1106\u116E\u11AF",
      "\u110F\u116B\u1100\u1161\u11B7",
      "\u110F\u116E\u1103\u1166\u1110\u1161",
      "\u110F\u1173\u1105\u1175\u11B7",
      "\u110F\u1173\u11AB\u1100\u1175\u11AF",
      "\u110F\u1173\u11AB\u1104\u1161\u11AF",
      "\u110F\u1173\u11AB\u1109\u1169\u1105\u1175",
      "\u110F\u1173\u11AB\u110B\u1161\u1103\u1173\u11AF",
      "\u110F\u1173\u11AB\u110B\u1165\u1106\u1165\u1102\u1175",
      "\u110F\u1173\u11AB\u110B\u1175\u11AF",
      "\u110F\u1173\u11AB\u110C\u1165\u11AF",
      "\u110F\u1173\u11AF\u1105\u1162\u1109\u1175\u11A8",
      "\u110F\u1173\u11AF\u1105\u1165\u11B8",
      "\u110F\u1175\u11AF\u1105\u1169",
      "\u1110\u1161\u110B\u1175\u11B8",
      "\u1110\u1161\u110C\u1161\u1100\u1175",
      "\u1110\u1161\u11A8\u1100\u116E",
      "\u1110\u1161\u11A8\u110C\u1161",
      "\u1110\u1161\u11AB\u1109\u1162\u11BC",
      "\u1110\u1162\u1100\u116F\u11AB\u1103\u1169",
      "\u1110\u1162\u110B\u1163\u11BC",
      "\u1110\u1162\u1111\u116E\u11BC",
      "\u1110\u1162\u11A8\u1109\u1175",
      "\u1110\u1162\u11AF\u1105\u1165\u11AB\u1110\u1173",
      "\u1110\u1165\u1102\u1165\u11AF",
      "\u1110\u1165\u1106\u1175\u1102\u1165\u11AF",
      "\u1110\u1166\u1102\u1175\u1109\u1173",
      "\u1110\u1166\u1109\u1173\u1110\u1173",
      "\u1110\u1166\u110B\u1175\u1107\u1173\u11AF",
      "\u1110\u1166\u11AF\u1105\u1166\u1107\u1175\u110C\u1165\u11AB",
      "\u1110\u1169\u1105\u1169\u11AB",
      "\u1110\u1169\u1106\u1161\u1110\u1169",
      "\u1110\u1169\u110B\u116D\u110B\u1175\u11AF",
      "\u1110\u1169\u11BC\u1100\u1168",
      "\u1110\u1169\u11BC\u1100\u116A",
      "\u1110\u1169\u11BC\u1105\u1169",
      "\u1110\u1169\u11BC\u1109\u1175\u11AB",
      "\u1110\u1169\u11BC\u110B\u1167\u11A8",
      "\u1110\u1169\u11BC\u110B\u1175\u11AF",
      "\u1110\u1169\u11BC\u110C\u1161\u11BC",
      "\u1110\u1169\u11BC\u110C\u1166",
      "\u1110\u1169\u11BC\u110C\u1173\u11BC",
      "\u1110\u1169\u11BC\u1112\u1161\u11B8",
      "\u1110\u1169\u11BC\u1112\u116A",
      "\u1110\u116C\u1100\u1173\u11AB",
      "\u1110\u116C\u110B\u116F\u11AB",
      "\u1110\u116C\u110C\u1175\u11A8\u1100\u1173\u11B7",
      "\u1110\u1171\u1100\u1175\u11B7",
      "\u1110\u1173\u1105\u1165\u11A8",
      "\u1110\u1173\u11A8\u1100\u1173\u11B8",
      "\u1110\u1173\u11A8\u1107\u1167\u11AF",
      "\u1110\u1173\u11A8\u1109\u1165\u11BC",
      "\u1110\u1173\u11A8\u1109\u116E",
      "\u1110\u1173\u11A8\u110C\u1175\u11BC",
      "\u1110\u1173\u11A8\u1112\u1175",
      "\u1110\u1173\u11AB\u1110\u1173\u11AB\u1112\u1175",
      "\u1110\u1175\u1109\u1167\u110E\u1173",
      "\u1111\u1161\u1105\u1161\u11AB\u1109\u1162\u11A8",
      "\u1111\u1161\u110B\u1175\u11AF",
      "\u1111\u1161\u110E\u116E\u11AF\u1109\u1169",
      "\u1111\u1161\u11AB\u1100\u1167\u11AF",
      "\u1111\u1161\u11AB\u1103\u1161\u11AB",
      "\u1111\u1161\u11AB\u1106\u1162",
      "\u1111\u1161\u11AB\u1109\u1161",
      "\u1111\u1161\u11AF\u1109\u1175\u11B8",
      "\u1111\u1161\u11AF\u110B\u116F\u11AF",
      "\u1111\u1161\u11B8\u1109\u1169\u11BC",
      "\u1111\u1162\u1109\u1167\u11AB",
      "\u1111\u1162\u11A8\u1109\u1173",
      "\u1111\u1162\u11A8\u1109\u1175\u1106\u1175\u11AF\u1105\u1175",
      "\u1111\u1162\u11AB\u1110\u1175",
      "\u1111\u1165\u1109\u1166\u11AB\u1110\u1173",
      "\u1111\u1166\u110B\u1175\u11AB\u1110\u1173",
      "\u1111\u1167\u11AB\u1100\u1167\u11AB",
      "\u1111\u1167\u11AB\u110B\u1174",
      "\u1111\u1167\u11AB\u110C\u1175",
      "\u1111\u1167\u11AB\u1112\u1175",
      "\u1111\u1167\u11BC\u1100\u1161",
      "\u1111\u1167\u11BC\u1100\u1172\u11AB",
      "\u1111\u1167\u11BC\u1109\u1162\u11BC",
      "\u1111\u1167\u11BC\u1109\u1169",
      "\u1111\u1167\u11BC\u110B\u1163\u11BC",
      "\u1111\u1167\u11BC\u110B\u1175\u11AF",
      "\u1111\u1167\u11BC\u1112\u116A",
      "\u1111\u1169\u1109\u1173\u1110\u1165",
      "\u1111\u1169\u110B\u1175\u11AB\u1110\u1173",
      "\u1111\u1169\u110C\u1161\u11BC",
      "\u1111\u1169\u1112\u1161\u11B7",
      "\u1111\u116D\u1106\u1167\u11AB",
      "\u1111\u116D\u110C\u1165\u11BC",
      "\u1111\u116D\u110C\u116E\u11AB",
      "\u1111\u116D\u1112\u1167\u11AB",
      "\u1111\u116E\u11B7\u1106\u1169\u11A8",
      "\u1111\u116E\u11B7\u110C\u1175\u11AF",
      "\u1111\u116E\u11BC\u1100\u1167\u11BC",
      "\u1111\u116E\u11BC\u1109\u1169\u11A8",
      "\u1111\u116E\u11BC\u1109\u1173\u11B8",
      "\u1111\u1173\u1105\u1161\u11BC\u1109\u1173",
      "\u1111\u1173\u1105\u1175\u11AB\u1110\u1165",
      "\u1111\u1173\u11AF\u1105\u1161\u1109\u1173\u1110\u1175\u11A8",
      "\u1111\u1175\u1100\u1169\u11AB",
      "\u1111\u1175\u1106\u1161\u11BC",
      "\u1111\u1175\u110B\u1161\u1102\u1169",
      "\u1111\u1175\u11AF\u1105\u1173\u11B7",
      "\u1111\u1175\u11AF\u1109\u116E",
      "\u1111\u1175\u11AF\u110B\u116D",
      "\u1111\u1175\u11AF\u110C\u1161",
      "\u1111\u1175\u11AF\u1110\u1169\u11BC",
      "\u1111\u1175\u11BC\u1100\u1168",
      "\u1112\u1161\u1102\u1173\u1102\u1175\u11B7",
      "\u1112\u1161\u1102\u1173\u11AF",
      "\u1112\u1161\u1103\u1173\u110B\u1170\u110B\u1165",
      "\u1112\u1161\u1105\u116E\u11BA\u1107\u1161\u11B7",
      "\u1112\u1161\u1107\u1161\u11AB\u1100\u1175",
      "\u1112\u1161\u1109\u116E\u11A8\u110C\u1175\u11B8",
      "\u1112\u1161\u1109\u116E\u11AB",
      "\u1112\u1161\u110B\u1167\u1110\u1173\u11AB",
      "\u1112\u1161\u110C\u1175\u1106\u1161\u11AB",
      "\u1112\u1161\u110E\u1165\u11AB",
      "\u1112\u1161\u1111\u116E\u11B7",
      "\u1112\u1161\u1111\u1175\u11AF",
      "\u1112\u1161\u11A8\u1100\u116A",
      "\u1112\u1161\u11A8\u1100\u116D",
      "\u1112\u1161\u11A8\u1100\u1173\u11B8",
      "\u1112\u1161\u11A8\u1100\u1175",
      "\u1112\u1161\u11A8\u1102\u1167\u11AB",
      "\u1112\u1161\u11A8\u1105\u1167\u11A8",
      "\u1112\u1161\u11A8\u1107\u1165\u11AB",
      "\u1112\u1161\u11A8\u1107\u116E\u1106\u1169",
      "\u1112\u1161\u11A8\u1107\u1175",
      "\u1112\u1161\u11A8\u1109\u1162\u11BC",
      "\u1112\u1161\u11A8\u1109\u116E\u11AF",
      "\u1112\u1161\u11A8\u1109\u1173\u11B8",
      "\u1112\u1161\u11A8\u110B\u116D\u11BC\u1111\u116E\u11B7",
      "\u1112\u1161\u11A8\u110B\u116F\u11AB",
      "\u1112\u1161\u11A8\u110B\u1171",
      "\u1112\u1161\u11A8\u110C\u1161",
      "\u1112\u1161\u11A8\u110C\u1165\u11B7",
      "\u1112\u1161\u11AB\u1100\u1168",
      "\u1112\u1161\u11AB\u1100\u1173\u11AF",
      "\u1112\u1161\u11AB\u1101\u1165\u1107\u1165\u11AB\u110B\u1166",
      "\u1112\u1161\u11AB\u1102\u1161\u11BD",
      "\u1112\u1161\u11AB\u1102\u116E\u11AB",
      "\u1112\u1161\u11AB\u1103\u1169\u11BC\u110B\u1161\u11AB",
      "\u1112\u1161\u11AB\u1104\u1162",
      "\u1112\u1161\u11AB\u1105\u1161\u1109\u1161\u11AB",
      "\u1112\u1161\u11AB\u1106\u1161\u1103\u1175",
      "\u1112\u1161\u11AB\u1106\u116E\u11AB",
      "\u1112\u1161\u11AB\u1107\u1165\u11AB",
      "\u1112\u1161\u11AB\u1107\u1169\u11A8",
      "\u1112\u1161\u11AB\u1109\u1175\u11A8",
      "\u1112\u1161\u11AB\u110B\u1167\u1105\u1173\u11B7",
      "\u1112\u1161\u11AB\u110D\u1169\u11A8",
      "\u1112\u1161\u11AF\u1106\u1165\u1102\u1175",
      "\u1112\u1161\u11AF\u110B\u1161\u1107\u1165\u110C\u1175",
      "\u1112\u1161\u11AF\u110B\u1175\u11AB",
      "\u1112\u1161\u11B7\u1101\u1166",
      "\u1112\u1161\u11B7\u1107\u116E\u1105\u1169",
      "\u1112\u1161\u11B8\u1100\u1167\u11A8",
      "\u1112\u1161\u11B8\u1105\u1175\u110C\u1165\u11A8",
      "\u1112\u1161\u11BC\u1100\u1169\u11BC",
      "\u1112\u1161\u11BC\u1100\u116E",
      "\u1112\u1161\u11BC\u1109\u1161\u11BC",
      "\u1112\u1161\u11BC\u110B\u1174",
      "\u1112\u1162\u1100\u1167\u11AF",
      "\u1112\u1162\u1100\u116E\u11AB",
      "\u1112\u1162\u1103\u1161\u11B8",
      "\u1112\u1162\u1103\u1161\u11BC",
      "\u1112\u1162\u1106\u116E\u11AF",
      "\u1112\u1162\u1109\u1165\u11A8",
      "\u1112\u1162\u1109\u1165\u11AF",
      "\u1112\u1162\u1109\u116E\u110B\u116D\u11A8\u110C\u1161\u11BC",
      "\u1112\u1162\u110B\u1161\u11AB",
      "\u1112\u1162\u11A8\u1109\u1175\u11B7",
      "\u1112\u1162\u11AB\u1103\u1173\u1107\u1162\u11A8",
      "\u1112\u1162\u11B7\u1107\u1165\u1100\u1165",
      "\u1112\u1162\u11BA\u1107\u1167\u11C0",
      "\u1112\u1162\u11BA\u1109\u1161\u11AF",
      "\u1112\u1162\u11BC\u1103\u1169\u11BC",
      "\u1112\u1162\u11BC\u1107\u1169\u11A8",
      "\u1112\u1162\u11BC\u1109\u1161",
      "\u1112\u1162\u11BC\u110B\u116E\u11AB",
      "\u1112\u1162\u11BC\u110B\u1171",
      "\u1112\u1163\u11BC\u1100\u1175",
      "\u1112\u1163\u11BC\u1109\u1161\u11BC",
      "\u1112\u1163\u11BC\u1109\u116E",
      "\u1112\u1165\u1105\u1161\u11A8",
      "\u1112\u1165\u110B\u116D\u11BC",
      "\u1112\u1166\u11AF\u1100\u1175",
      "\u1112\u1167\u11AB\u1100\u116A\u11AB",
      "\u1112\u1167\u11AB\u1100\u1173\u11B7",
      "\u1112\u1167\u11AB\u1103\u1162",
      "\u1112\u1167\u11AB\u1109\u1161\u11BC",
      "\u1112\u1167\u11AB\u1109\u1175\u11AF",
      "\u1112\u1167\u11AB\u110C\u1161\u11BC",
      "\u1112\u1167\u11AB\u110C\u1162",
      "\u1112\u1167\u11AB\u110C\u1175",
      "\u1112\u1167\u11AF\u110B\u1162\u11A8",
      "\u1112\u1167\u11B8\u1105\u1167\u11A8",
      "\u1112\u1167\u11BC\u1107\u116E",
      "\u1112\u1167\u11BC\u1109\u1161",
      "\u1112\u1167\u11BC\u1109\u116E",
      "\u1112\u1167\u11BC\u1109\u1175\u11A8",
      "\u1112\u1167\u11BC\u110C\u1166",
      "\u1112\u1167\u11BC\u1110\u1162",
      "\u1112\u1167\u11BC\u1111\u1167\u11AB",
      "\u1112\u1168\u1110\u1162\u11A8",
      "\u1112\u1169\u1100\u1175\u1109\u1175\u11B7",
      "\u1112\u1169\u1102\u1161\u11B7",
      "\u1112\u1169\u1105\u1161\u11BC\u110B\u1175",
      "\u1112\u1169\u1107\u1161\u11A8",
      "\u1112\u1169\u1110\u1166\u11AF",
      "\u1112\u1169\u1112\u1173\u11B8",
      "\u1112\u1169\u11A8\u1109\u1175",
      "\u1112\u1169\u11AF\u1105\u1169",
      "\u1112\u1169\u11B7\u1111\u1166\u110B\u1175\u110C\u1175",
      "\u1112\u1169\u11BC\u1107\u1169",
      "\u1112\u1169\u11BC\u1109\u116E",
      "\u1112\u1169\u11BC\u110E\u1161",
      "\u1112\u116A\u1106\u1167\u11AB",
      "\u1112\u116A\u1107\u116E\u11AB",
      "\u1112\u116A\u1109\u1161\u11AF",
      "\u1112\u116A\u110B\u116D\u110B\u1175\u11AF",
      "\u1112\u116A\u110C\u1161\u11BC",
      "\u1112\u116A\u1112\u1161\u11A8",
      "\u1112\u116A\u11A8\u1107\u1169",
      "\u1112\u116A\u11A8\u110B\u1175\u11AB",
      "\u1112\u116A\u11A8\u110C\u1161\u11BC",
      "\u1112\u116A\u11A8\u110C\u1165\u11BC",
      "\u1112\u116A\u11AB\u1100\u1161\u11B8",
      "\u1112\u116A\u11AB\u1100\u1167\u11BC",
      "\u1112\u116A\u11AB\u110B\u1167\u11BC",
      "\u1112\u116A\u11AB\u110B\u1172\u11AF",
      "\u1112\u116A\u11AB\u110C\u1161",
      "\u1112\u116A\u11AF\u1100\u1175",
      "\u1112\u116A\u11AF\u1103\u1169\u11BC",
      "\u1112\u116A\u11AF\u1107\u1161\u11AF\u1112\u1175",
      "\u1112\u116A\u11AF\u110B\u116D\u11BC",
      "\u1112\u116A\u11AF\u110D\u1161\u11A8",
      "\u1112\u116C\u1100\u1167\u11AB",
      "\u1112\u116C\u1100\u116A\u11AB",
      "\u1112\u116C\u1107\u1169\u11A8",
      "\u1112\u116C\u1109\u1162\u11A8",
      "\u1112\u116C\u110B\u116F\u11AB",
      "\u1112\u116C\u110C\u1161\u11BC",
      "\u1112\u116C\u110C\u1165\u11AB",
      "\u1112\u116C\u11BA\u1109\u116E",
      "\u1112\u116C\u11BC\u1103\u1161\u11AB\u1107\u1169\u1103\u1169",
      "\u1112\u116D\u110B\u1172\u11AF\u110C\u1165\u11A8",
      "\u1112\u116E\u1107\u1161\u11AB",
      "\u1112\u116E\u110E\u116E\u11BA\u1100\u1161\u1105\u116E",
      "\u1112\u116E\u11AB\u1105\u1167\u11AB",
      "\u1112\u116F\u11AF\u110A\u1175\u11AB",
      "\u1112\u1172\u1109\u1175\u11A8",
      "\u1112\u1172\u110B\u1175\u11AF",
      "\u1112\u1172\u11BC\u1102\u1162",
      "\u1112\u1173\u1105\u1173\u11B7",
      "\u1112\u1173\u11A8\u1107\u1162\u11A8",
      "\u1112\u1173\u11A8\u110B\u1175\u11AB",
      "\u1112\u1173\u11AB\u110C\u1165\u11A8",
      "\u1112\u1173\u11AB\u1112\u1175",
      "\u1112\u1173\u11BC\u1106\u1175",
      "\u1112\u1173\u11BC\u1107\u116E\u11AB",
      "\u1112\u1174\u1100\u1169\u11A8",
      "\u1112\u1174\u1106\u1161\u11BC",
      "\u1112\u1174\u1109\u1162\u11BC",
      "\u1112\u1174\u11AB\u1109\u1162\u11A8",
      "\u1112\u1175\u11B7\u1101\u1165\u11BA"
    ];
  }
});

// ../node_modules/bip39/src/wordlists/french.json
var require_french = __commonJS({
  "../node_modules/bip39/src/wordlists/french.json"(exports, module) {
    module.exports = [
      "abaisser",
      "abandon",
      "abdiquer",
      "abeille",
      "abolir",
      "aborder",
      "aboutir",
      "aboyer",
      "abrasif",
      "abreuver",
      "abriter",
      "abroger",
      "abrupt",
      "absence",
      "absolu",
      "absurde",
      "abusif",
      "abyssal",
      "acade\u0301mie",
      "acajou",
      "acarien",
      "accabler",
      "accepter",
      "acclamer",
      "accolade",
      "accroche",
      "accuser",
      "acerbe",
      "achat",
      "acheter",
      "aciduler",
      "acier",
      "acompte",
      "acque\u0301rir",
      "acronyme",
      "acteur",
      "actif",
      "actuel",
      "adepte",
      "ade\u0301quat",
      "adhe\u0301sif",
      "adjectif",
      "adjuger",
      "admettre",
      "admirer",
      "adopter",
      "adorer",
      "adoucir",
      "adresse",
      "adroit",
      "adulte",
      "adverbe",
      "ae\u0301rer",
      "ae\u0301ronef",
      "affaire",
      "affecter",
      "affiche",
      "affreux",
      "affubler",
      "agacer",
      "agencer",
      "agile",
      "agiter",
      "agrafer",
      "agre\u0301able",
      "agrume",
      "aider",
      "aiguille",
      "ailier",
      "aimable",
      "aisance",
      "ajouter",
      "ajuster",
      "alarmer",
      "alchimie",
      "alerte",
      "alge\u0300bre",
      "algue",
      "alie\u0301ner",
      "aliment",
      "alle\u0301ger",
      "alliage",
      "allouer",
      "allumer",
      "alourdir",
      "alpaga",
      "altesse",
      "alve\u0301ole",
      "amateur",
      "ambigu",
      "ambre",
      "ame\u0301nager",
      "amertume",
      "amidon",
      "amiral",
      "amorcer",
      "amour",
      "amovible",
      "amphibie",
      "ampleur",
      "amusant",
      "analyse",
      "anaphore",
      "anarchie",
      "anatomie",
      "ancien",
      "ane\u0301antir",
      "angle",
      "angoisse",
      "anguleux",
      "animal",
      "annexer",
      "annonce",
      "annuel",
      "anodin",
      "anomalie",
      "anonyme",
      "anormal",
      "antenne",
      "antidote",
      "anxieux",
      "apaiser",
      "ape\u0301ritif",
      "aplanir",
      "apologie",
      "appareil",
      "appeler",
      "apporter",
      "appuyer",
      "aquarium",
      "aqueduc",
      "arbitre",
      "arbuste",
      "ardeur",
      "ardoise",
      "argent",
      "arlequin",
      "armature",
      "armement",
      "armoire",
      "armure",
      "arpenter",
      "arracher",
      "arriver",
      "arroser",
      "arsenic",
      "arte\u0301riel",
      "article",
      "aspect",
      "asphalte",
      "aspirer",
      "assaut",
      "asservir",
      "assiette",
      "associer",
      "assurer",
      "asticot",
      "astre",
      "astuce",
      "atelier",
      "atome",
      "atrium",
      "atroce",
      "attaque",
      "attentif",
      "attirer",
      "attraper",
      "aubaine",
      "auberge",
      "audace",
      "audible",
      "augurer",
      "aurore",
      "automne",
      "autruche",
      "avaler",
      "avancer",
      "avarice",
      "avenir",
      "averse",
      "aveugle",
      "aviateur",
      "avide",
      "avion",
      "aviser",
      "avoine",
      "avouer",
      "avril",
      "axial",
      "axiome",
      "badge",
      "bafouer",
      "bagage",
      "baguette",
      "baignade",
      "balancer",
      "balcon",
      "baleine",
      "balisage",
      "bambin",
      "bancaire",
      "bandage",
      "banlieue",
      "bannie\u0300re",
      "banquier",
      "barbier",
      "baril",
      "baron",
      "barque",
      "barrage",
      "bassin",
      "bastion",
      "bataille",
      "bateau",
      "batterie",
      "baudrier",
      "bavarder",
      "belette",
      "be\u0301lier",
      "belote",
      "be\u0301ne\u0301fice",
      "berceau",
      "berger",
      "berline",
      "bermuda",
      "besace",
      "besogne",
      "be\u0301tail",
      "beurre",
      "biberon",
      "bicycle",
      "bidule",
      "bijou",
      "bilan",
      "bilingue",
      "billard",
      "binaire",
      "biologie",
      "biopsie",
      "biotype",
      "biscuit",
      "bison",
      "bistouri",
      "bitume",
      "bizarre",
      "blafard",
      "blague",
      "blanchir",
      "blessant",
      "blinder",
      "blond",
      "bloquer",
      "blouson",
      "bobard",
      "bobine",
      "boire",
      "boiser",
      "bolide",
      "bonbon",
      "bondir",
      "bonheur",
      "bonifier",
      "bonus",
      "bordure",
      "borne",
      "botte",
      "boucle",
      "boueux",
      "bougie",
      "boulon",
      "bouquin",
      "bourse",
      "boussole",
      "boutique",
      "boxeur",
      "branche",
      "brasier",
      "brave",
      "brebis",
      "bre\u0300che",
      "breuvage",
      "bricoler",
      "brigade",
      "brillant",
      "brioche",
      "brique",
      "brochure",
      "broder",
      "bronzer",
      "brousse",
      "broyeur",
      "brume",
      "brusque",
      "brutal",
      "bruyant",
      "buffle",
      "buisson",
      "bulletin",
      "bureau",
      "burin",
      "bustier",
      "butiner",
      "butoir",
      "buvable",
      "buvette",
      "cabanon",
      "cabine",
      "cachette",
      "cadeau",
      "cadre",
      "cafe\u0301ine",
      "caillou",
      "caisson",
      "calculer",
      "calepin",
      "calibre",
      "calmer",
      "calomnie",
      "calvaire",
      "camarade",
      "came\u0301ra",
      "camion",
      "campagne",
      "canal",
      "caneton",
      "canon",
      "cantine",
      "canular",
      "capable",
      "caporal",
      "caprice",
      "capsule",
      "capter",
      "capuche",
      "carabine",
      "carbone",
      "caresser",
      "caribou",
      "carnage",
      "carotte",
      "carreau",
      "carton",
      "cascade",
      "casier",
      "casque",
      "cassure",
      "causer",
      "caution",
      "cavalier",
      "caverne",
      "caviar",
      "ce\u0301dille",
      "ceinture",
      "ce\u0301leste",
      "cellule",
      "cendrier",
      "censurer",
      "central",
      "cercle",
      "ce\u0301re\u0301bral",
      "cerise",
      "cerner",
      "cerveau",
      "cesser",
      "chagrin",
      "chaise",
      "chaleur",
      "chambre",
      "chance",
      "chapitre",
      "charbon",
      "chasseur",
      "chaton",
      "chausson",
      "chavirer",
      "chemise",
      "chenille",
      "che\u0301quier",
      "chercher",
      "cheval",
      "chien",
      "chiffre",
      "chignon",
      "chime\u0300re",
      "chiot",
      "chlorure",
      "chocolat",
      "choisir",
      "chose",
      "chouette",
      "chrome",
      "chute",
      "cigare",
      "cigogne",
      "cimenter",
      "cine\u0301ma",
      "cintrer",
      "circuler",
      "cirer",
      "cirque",
      "citerne",
      "citoyen",
      "citron",
      "civil",
      "clairon",
      "clameur",
      "claquer",
      "classe",
      "clavier",
      "client",
      "cligner",
      "climat",
      "clivage",
      "cloche",
      "clonage",
      "cloporte",
      "cobalt",
      "cobra",
      "cocasse",
      "cocotier",
      "coder",
      "codifier",
      "coffre",
      "cogner",
      "cohe\u0301sion",
      "coiffer",
      "coincer",
      "cole\u0300re",
      "colibri",
      "colline",
      "colmater",
      "colonel",
      "combat",
      "come\u0301die",
      "commande",
      "compact",
      "concert",
      "conduire",
      "confier",
      "congeler",
      "connoter",
      "consonne",
      "contact",
      "convexe",
      "copain",
      "copie",
      "corail",
      "corbeau",
      "cordage",
      "corniche",
      "corpus",
      "correct",
      "corte\u0300ge",
      "cosmique",
      "costume",
      "coton",
      "coude",
      "coupure",
      "courage",
      "couteau",
      "couvrir",
      "coyote",
      "crabe",
      "crainte",
      "cravate",
      "crayon",
      "cre\u0301ature",
      "cre\u0301diter",
      "cre\u0301meux",
      "creuser",
      "crevette",
      "cribler",
      "crier",
      "cristal",
      "crite\u0300re",
      "croire",
      "croquer",
      "crotale",
      "crucial",
      "cruel",
      "crypter",
      "cubique",
      "cueillir",
      "cuille\u0300re",
      "cuisine",
      "cuivre",
      "culminer",
      "cultiver",
      "cumuler",
      "cupide",
      "curatif",
      "curseur",
      "cyanure",
      "cycle",
      "cylindre",
      "cynique",
      "daigner",
      "damier",
      "danger",
      "danseur",
      "dauphin",
      "de\u0301battre",
      "de\u0301biter",
      "de\u0301border",
      "de\u0301brider",
      "de\u0301butant",
      "de\u0301caler",
      "de\u0301cembre",
      "de\u0301chirer",
      "de\u0301cider",
      "de\u0301clarer",
      "de\u0301corer",
      "de\u0301crire",
      "de\u0301cupler",
      "de\u0301dale",
      "de\u0301ductif",
      "de\u0301esse",
      "de\u0301fensif",
      "de\u0301filer",
      "de\u0301frayer",
      "de\u0301gager",
      "de\u0301givrer",
      "de\u0301glutir",
      "de\u0301grafer",
      "de\u0301jeuner",
      "de\u0301lice",
      "de\u0301loger",
      "demander",
      "demeurer",
      "de\u0301molir",
      "de\u0301nicher",
      "de\u0301nouer",
      "dentelle",
      "de\u0301nuder",
      "de\u0301part",
      "de\u0301penser",
      "de\u0301phaser",
      "de\u0301placer",
      "de\u0301poser",
      "de\u0301ranger",
      "de\u0301rober",
      "de\u0301sastre",
      "descente",
      "de\u0301sert",
      "de\u0301signer",
      "de\u0301sobe\u0301ir",
      "dessiner",
      "destrier",
      "de\u0301tacher",
      "de\u0301tester",
      "de\u0301tourer",
      "de\u0301tresse",
      "devancer",
      "devenir",
      "deviner",
      "devoir",
      "diable",
      "dialogue",
      "diamant",
      "dicter",
      "diffe\u0301rer",
      "dige\u0301rer",
      "digital",
      "digne",
      "diluer",
      "dimanche",
      "diminuer",
      "dioxyde",
      "directif",
      "diriger",
      "discuter",
      "disposer",
      "dissiper",
      "distance",
      "divertir",
      "diviser",
      "docile",
      "docteur",
      "dogme",
      "doigt",
      "domaine",
      "domicile",
      "dompter",
      "donateur",
      "donjon",
      "donner",
      "dopamine",
      "dortoir",
      "dorure",
      "dosage",
      "doseur",
      "dossier",
      "dotation",
      "douanier",
      "double",
      "douceur",
      "douter",
      "doyen",
      "dragon",
      "draper",
      "dresser",
      "dribbler",
      "droiture",
      "duperie",
      "duplexe",
      "durable",
      "durcir",
      "dynastie",
      "e\u0301blouir",
      "e\u0301carter",
      "e\u0301charpe",
      "e\u0301chelle",
      "e\u0301clairer",
      "e\u0301clipse",
      "e\u0301clore",
      "e\u0301cluse",
      "e\u0301cole",
      "e\u0301conomie",
      "e\u0301corce",
      "e\u0301couter",
      "e\u0301craser",
      "e\u0301cre\u0301mer",
      "e\u0301crivain",
      "e\u0301crou",
      "e\u0301cume",
      "e\u0301cureuil",
      "e\u0301difier",
      "e\u0301duquer",
      "effacer",
      "effectif",
      "effigie",
      "effort",
      "effrayer",
      "effusion",
      "e\u0301galiser",
      "e\u0301garer",
      "e\u0301jecter",
      "e\u0301laborer",
      "e\u0301largir",
      "e\u0301lectron",
      "e\u0301le\u0301gant",
      "e\u0301le\u0301phant",
      "e\u0301le\u0300ve",
      "e\u0301ligible",
      "e\u0301litisme",
      "e\u0301loge",
      "e\u0301lucider",
      "e\u0301luder",
      "emballer",
      "embellir",
      "embryon",
      "e\u0301meraude",
      "e\u0301mission",
      "emmener",
      "e\u0301motion",
      "e\u0301mouvoir",
      "empereur",
      "employer",
      "emporter",
      "emprise",
      "e\u0301mulsion",
      "encadrer",
      "enche\u0300re",
      "enclave",
      "encoche",
      "endiguer",
      "endosser",
      "endroit",
      "enduire",
      "e\u0301nergie",
      "enfance",
      "enfermer",
      "enfouir",
      "engager",
      "engin",
      "englober",
      "e\u0301nigme",
      "enjamber",
      "enjeu",
      "enlever",
      "ennemi",
      "ennuyeux",
      "enrichir",
      "enrobage",
      "enseigne",
      "entasser",
      "entendre",
      "entier",
      "entourer",
      "entraver",
      "e\u0301nume\u0301rer",
      "envahir",
      "enviable",
      "envoyer",
      "enzyme",
      "e\u0301olien",
      "e\u0301paissir",
      "e\u0301pargne",
      "e\u0301patant",
      "e\u0301paule",
      "e\u0301picerie",
      "e\u0301pide\u0301mie",
      "e\u0301pier",
      "e\u0301pilogue",
      "e\u0301pine",
      "e\u0301pisode",
      "e\u0301pitaphe",
      "e\u0301poque",
      "e\u0301preuve",
      "e\u0301prouver",
      "e\u0301puisant",
      "e\u0301querre",
      "e\u0301quipe",
      "e\u0301riger",
      "e\u0301rosion",
      "erreur",
      "e\u0301ruption",
      "escalier",
      "espadon",
      "espe\u0300ce",
      "espie\u0300gle",
      "espoir",
      "esprit",
      "esquiver",
      "essayer",
      "essence",
      "essieu",
      "essorer",
      "estime",
      "estomac",
      "estrade",
      "e\u0301tage\u0300re",
      "e\u0301taler",
      "e\u0301tanche",
      "e\u0301tatique",
      "e\u0301teindre",
      "e\u0301tendoir",
      "e\u0301ternel",
      "e\u0301thanol",
      "e\u0301thique",
      "ethnie",
      "e\u0301tirer",
      "e\u0301toffer",
      "e\u0301toile",
      "e\u0301tonnant",
      "e\u0301tourdir",
      "e\u0301trange",
      "e\u0301troit",
      "e\u0301tude",
      "euphorie",
      "e\u0301valuer",
      "e\u0301vasion",
      "e\u0301ventail",
      "e\u0301vidence",
      "e\u0301viter",
      "e\u0301volutif",
      "e\u0301voquer",
      "exact",
      "exage\u0301rer",
      "exaucer",
      "exceller",
      "excitant",
      "exclusif",
      "excuse",
      "exe\u0301cuter",
      "exemple",
      "exercer",
      "exhaler",
      "exhorter",
      "exigence",
      "exiler",
      "exister",
      "exotique",
      "expe\u0301dier",
      "explorer",
      "exposer",
      "exprimer",
      "exquis",
      "extensif",
      "extraire",
      "exulter",
      "fable",
      "fabuleux",
      "facette",
      "facile",
      "facture",
      "faiblir",
      "falaise",
      "fameux",
      "famille",
      "farceur",
      "farfelu",
      "farine",
      "farouche",
      "fasciner",
      "fatal",
      "fatigue",
      "faucon",
      "fautif",
      "faveur",
      "favori",
      "fe\u0301brile",
      "fe\u0301conder",
      "fe\u0301de\u0301rer",
      "fe\u0301lin",
      "femme",
      "fe\u0301mur",
      "fendoir",
      "fe\u0301odal",
      "fermer",
      "fe\u0301roce",
      "ferveur",
      "festival",
      "feuille",
      "feutre",
      "fe\u0301vrier",
      "fiasco",
      "ficeler",
      "fictif",
      "fide\u0300le",
      "figure",
      "filature",
      "filetage",
      "filie\u0300re",
      "filleul",
      "filmer",
      "filou",
      "filtrer",
      "financer",
      "finir",
      "fiole",
      "firme",
      "fissure",
      "fixer",
      "flairer",
      "flamme",
      "flasque",
      "flatteur",
      "fle\u0301au",
      "fle\u0300che",
      "fleur",
      "flexion",
      "flocon",
      "flore",
      "fluctuer",
      "fluide",
      "fluvial",
      "folie",
      "fonderie",
      "fongible",
      "fontaine",
      "forcer",
      "forgeron",
      "formuler",
      "fortune",
      "fossile",
      "foudre",
      "fouge\u0300re",
      "fouiller",
      "foulure",
      "fourmi",
      "fragile",
      "fraise",
      "franchir",
      "frapper",
      "frayeur",
      "fre\u0301gate",
      "freiner",
      "frelon",
      "fre\u0301mir",
      "fre\u0301ne\u0301sie",
      "fre\u0300re",
      "friable",
      "friction",
      "frisson",
      "frivole",
      "froid",
      "fromage",
      "frontal",
      "frotter",
      "fruit",
      "fugitif",
      "fuite",
      "fureur",
      "furieux",
      "furtif",
      "fusion",
      "futur",
      "gagner",
      "galaxie",
      "galerie",
      "gambader",
      "garantir",
      "gardien",
      "garnir",
      "garrigue",
      "gazelle",
      "gazon",
      "ge\u0301ant",
      "ge\u0301latine",
      "ge\u0301lule",
      "gendarme",
      "ge\u0301ne\u0301ral",
      "ge\u0301nie",
      "genou",
      "gentil",
      "ge\u0301ologie",
      "ge\u0301ome\u0300tre",
      "ge\u0301ranium",
      "germe",
      "gestuel",
      "geyser",
      "gibier",
      "gicler",
      "girafe",
      "givre",
      "glace",
      "glaive",
      "glisser",
      "globe",
      "gloire",
      "glorieux",
      "golfeur",
      "gomme",
      "gonfler",
      "gorge",
      "gorille",
      "goudron",
      "gouffre",
      "goulot",
      "goupille",
      "gourmand",
      "goutte",
      "graduel",
      "graffiti",
      "graine",
      "grand",
      "grappin",
      "gratuit",
      "gravir",
      "grenat",
      "griffure",
      "griller",
      "grimper",
      "grogner",
      "gronder",
      "grotte",
      "groupe",
      "gruger",
      "grutier",
      "gruye\u0300re",
      "gue\u0301pard",
      "guerrier",
      "guide",
      "guimauve",
      "guitare",
      "gustatif",
      "gymnaste",
      "gyrostat",
      "habitude",
      "hachoir",
      "halte",
      "hameau",
      "hangar",
      "hanneton",
      "haricot",
      "harmonie",
      "harpon",
      "hasard",
      "he\u0301lium",
      "he\u0301matome",
      "herbe",
      "he\u0301risson",
      "hermine",
      "he\u0301ron",
      "he\u0301siter",
      "heureux",
      "hiberner",
      "hibou",
      "hilarant",
      "histoire",
      "hiver",
      "homard",
      "hommage",
      "homoge\u0300ne",
      "honneur",
      "honorer",
      "honteux",
      "horde",
      "horizon",
      "horloge",
      "hormone",
      "horrible",
      "houleux",
      "housse",
      "hublot",
      "huileux",
      "humain",
      "humble",
      "humide",
      "humour",
      "hurler",
      "hydromel",
      "hygie\u0300ne",
      "hymne",
      "hypnose",
      "idylle",
      "ignorer",
      "iguane",
      "illicite",
      "illusion",
      "image",
      "imbiber",
      "imiter",
      "immense",
      "immobile",
      "immuable",
      "impact",
      "impe\u0301rial",
      "implorer",
      "imposer",
      "imprimer",
      "imputer",
      "incarner",
      "incendie",
      "incident",
      "incliner",
      "incolore",
      "indexer",
      "indice",
      "inductif",
      "ine\u0301dit",
      "ineptie",
      "inexact",
      "infini",
      "infliger",
      "informer",
      "infusion",
      "inge\u0301rer",
      "inhaler",
      "inhiber",
      "injecter",
      "injure",
      "innocent",
      "inoculer",
      "inonder",
      "inscrire",
      "insecte",
      "insigne",
      "insolite",
      "inspirer",
      "instinct",
      "insulter",
      "intact",
      "intense",
      "intime",
      "intrigue",
      "intuitif",
      "inutile",
      "invasion",
      "inventer",
      "inviter",
      "invoquer",
      "ironique",
      "irradier",
      "irre\u0301el",
      "irriter",
      "isoler",
      "ivoire",
      "ivresse",
      "jaguar",
      "jaillir",
      "jambe",
      "janvier",
      "jardin",
      "jauger",
      "jaune",
      "javelot",
      "jetable",
      "jeton",
      "jeudi",
      "jeunesse",
      "joindre",
      "joncher",
      "jongler",
      "joueur",
      "jouissif",
      "journal",
      "jovial",
      "joyau",
      "joyeux",
      "jubiler",
      "jugement",
      "junior",
      "jupon",
      "juriste",
      "justice",
      "juteux",
      "juve\u0301nile",
      "kayak",
      "kimono",
      "kiosque",
      "label",
      "labial",
      "labourer",
      "lace\u0301rer",
      "lactose",
      "lagune",
      "laine",
      "laisser",
      "laitier",
      "lambeau",
      "lamelle",
      "lampe",
      "lanceur",
      "langage",
      "lanterne",
      "lapin",
      "largeur",
      "larme",
      "laurier",
      "lavabo",
      "lavoir",
      "lecture",
      "le\u0301gal",
      "le\u0301ger",
      "le\u0301gume",
      "lessive",
      "lettre",
      "levier",
      "lexique",
      "le\u0301zard",
      "liasse",
      "libe\u0301rer",
      "libre",
      "licence",
      "licorne",
      "lie\u0300ge",
      "lie\u0300vre",
      "ligature",
      "ligoter",
      "ligue",
      "limer",
      "limite",
      "limonade",
      "limpide",
      "line\u0301aire",
      "lingot",
      "lionceau",
      "liquide",
      "lisie\u0300re",
      "lister",
      "lithium",
      "litige",
      "littoral",
      "livreur",
      "logique",
      "lointain",
      "loisir",
      "lombric",
      "loterie",
      "louer",
      "lourd",
      "loutre",
      "louve",
      "loyal",
      "lubie",
      "lucide",
      "lucratif",
      "lueur",
      "lugubre",
      "luisant",
      "lumie\u0300re",
      "lunaire",
      "lundi",
      "luron",
      "lutter",
      "luxueux",
      "machine",
      "magasin",
      "magenta",
      "magique",
      "maigre",
      "maillon",
      "maintien",
      "mairie",
      "maison",
      "majorer",
      "malaxer",
      "male\u0301fice",
      "malheur",
      "malice",
      "mallette",
      "mammouth",
      "mandater",
      "maniable",
      "manquant",
      "manteau",
      "manuel",
      "marathon",
      "marbre",
      "marchand",
      "mardi",
      "maritime",
      "marqueur",
      "marron",
      "marteler",
      "mascotte",
      "massif",
      "mate\u0301riel",
      "matie\u0300re",
      "matraque",
      "maudire",
      "maussade",
      "mauve",
      "maximal",
      "me\u0301chant",
      "me\u0301connu",
      "me\u0301daille",
      "me\u0301decin",
      "me\u0301diter",
      "me\u0301duse",
      "meilleur",
      "me\u0301lange",
      "me\u0301lodie",
      "membre",
      "me\u0301moire",
      "menacer",
      "mener",
      "menhir",
      "mensonge",
      "mentor",
      "mercredi",
      "me\u0301rite",
      "merle",
      "messager",
      "mesure",
      "me\u0301tal",
      "me\u0301te\u0301ore",
      "me\u0301thode",
      "me\u0301tier",
      "meuble",
      "miauler",
      "microbe",
      "miette",
      "mignon",
      "migrer",
      "milieu",
      "million",
      "mimique",
      "mince",
      "mine\u0301ral",
      "minimal",
      "minorer",
      "minute",
      "miracle",
      "miroiter",
      "missile",
      "mixte",
      "mobile",
      "moderne",
      "moelleux",
      "mondial",
      "moniteur",
      "monnaie",
      "monotone",
      "monstre",
      "montagne",
      "monument",
      "moqueur",
      "morceau",
      "morsure",
      "mortier",
      "moteur",
      "motif",
      "mouche",
      "moufle",
      "moulin",
      "mousson",
      "mouton",
      "mouvant",
      "multiple",
      "munition",
      "muraille",
      "mure\u0300ne",
      "murmure",
      "muscle",
      "muse\u0301um",
      "musicien",
      "mutation",
      "muter",
      "mutuel",
      "myriade",
      "myrtille",
      "myste\u0300re",
      "mythique",
      "nageur",
      "nappe",
      "narquois",
      "narrer",
      "natation",
      "nation",
      "nature",
      "naufrage",
      "nautique",
      "navire",
      "ne\u0301buleux",
      "nectar",
      "ne\u0301faste",
      "ne\u0301gation",
      "ne\u0301gliger",
      "ne\u0301gocier",
      "neige",
      "nerveux",
      "nettoyer",
      "neurone",
      "neutron",
      "neveu",
      "niche",
      "nickel",
      "nitrate",
      "niveau",
      "noble",
      "nocif",
      "nocturne",
      "noirceur",
      "noisette",
      "nomade",
      "nombreux",
      "nommer",
      "normatif",
      "notable",
      "notifier",
      "notoire",
      "nourrir",
      "nouveau",
      "novateur",
      "novembre",
      "novice",
      "nuage",
      "nuancer",
      "nuire",
      "nuisible",
      "nume\u0301ro",
      "nuptial",
      "nuque",
      "nutritif",
      "obe\u0301ir",
      "objectif",
      "obliger",
      "obscur",
      "observer",
      "obstacle",
      "obtenir",
      "obturer",
      "occasion",
      "occuper",
      "oce\u0301an",
      "octobre",
      "octroyer",
      "octupler",
      "oculaire",
      "odeur",
      "odorant",
      "offenser",
      "officier",
      "offrir",
      "ogive",
      "oiseau",
      "oisillon",
      "olfactif",
      "olivier",
      "ombrage",
      "omettre",
      "onctueux",
      "onduler",
      "one\u0301reux",
      "onirique",
      "opale",
      "opaque",
      "ope\u0301rer",
      "opinion",
      "opportun",
      "opprimer",
      "opter",
      "optique",
      "orageux",
      "orange",
      "orbite",
      "ordonner",
      "oreille",
      "organe",
      "orgueil",
      "orifice",
      "ornement",
      "orque",
      "ortie",
      "osciller",
      "osmose",
      "ossature",
      "otarie",
      "ouragan",
      "ourson",
      "outil",
      "outrager",
      "ouvrage",
      "ovation",
      "oxyde",
      "oxyge\u0300ne",
      "ozone",
      "paisible",
      "palace",
      "palmare\u0300s",
      "palourde",
      "palper",
      "panache",
      "panda",
      "pangolin",
      "paniquer",
      "panneau",
      "panorama",
      "pantalon",
      "papaye",
      "papier",
      "papoter",
      "papyrus",
      "paradoxe",
      "parcelle",
      "paresse",
      "parfumer",
      "parler",
      "parole",
      "parrain",
      "parsemer",
      "partager",
      "parure",
      "parvenir",
      "passion",
      "paste\u0300que",
      "paternel",
      "patience",
      "patron",
      "pavillon",
      "pavoiser",
      "payer",
      "paysage",
      "peigne",
      "peintre",
      "pelage",
      "pe\u0301lican",
      "pelle",
      "pelouse",
      "peluche",
      "pendule",
      "pe\u0301ne\u0301trer",
      "pe\u0301nible",
      "pensif",
      "pe\u0301nurie",
      "pe\u0301pite",
      "pe\u0301plum",
      "perdrix",
      "perforer",
      "pe\u0301riode",
      "permuter",
      "perplexe",
      "persil",
      "perte",
      "peser",
      "pe\u0301tale",
      "petit",
      "pe\u0301trir",
      "peuple",
      "pharaon",
      "phobie",
      "phoque",
      "photon",
      "phrase",
      "physique",
      "piano",
      "pictural",
      "pie\u0300ce",
      "pierre",
      "pieuvre",
      "pilote",
      "pinceau",
      "pipette",
      "piquer",
      "pirogue",
      "piscine",
      "piston",
      "pivoter",
      "pixel",
      "pizza",
      "placard",
      "plafond",
      "plaisir",
      "planer",
      "plaque",
      "plastron",
      "plateau",
      "pleurer",
      "plexus",
      "pliage",
      "plomb",
      "plonger",
      "pluie",
      "plumage",
      "pochette",
      "poe\u0301sie",
      "poe\u0300te",
      "pointe",
      "poirier",
      "poisson",
      "poivre",
      "polaire",
      "policier",
      "pollen",
      "polygone",
      "pommade",
      "pompier",
      "ponctuel",
      "ponde\u0301rer",
      "poney",
      "portique",
      "position",
      "posse\u0301der",
      "posture",
      "potager",
      "poteau",
      "potion",
      "pouce",
      "poulain",
      "poumon",
      "pourpre",
      "poussin",
      "pouvoir",
      "prairie",
      "pratique",
      "pre\u0301cieux",
      "pre\u0301dire",
      "pre\u0301fixe",
      "pre\u0301lude",
      "pre\u0301nom",
      "pre\u0301sence",
      "pre\u0301texte",
      "pre\u0301voir",
      "primitif",
      "prince",
      "prison",
      "priver",
      "proble\u0300me",
      "proce\u0301der",
      "prodige",
      "profond",
      "progre\u0300s",
      "proie",
      "projeter",
      "prologue",
      "promener",
      "propre",
      "prospe\u0300re",
      "prote\u0301ger",
      "prouesse",
      "proverbe",
      "prudence",
      "pruneau",
      "psychose",
      "public",
      "puceron",
      "puiser",
      "pulpe",
      "pulsar",
      "punaise",
      "punitif",
      "pupitre",
      "purifier",
      "puzzle",
      "pyramide",
      "quasar",
      "querelle",
      "question",
      "quie\u0301tude",
      "quitter",
      "quotient",
      "racine",
      "raconter",
      "radieux",
      "ragondin",
      "raideur",
      "raisin",
      "ralentir",
      "rallonge",
      "ramasser",
      "rapide",
      "rasage",
      "ratisser",
      "ravager",
      "ravin",
      "rayonner",
      "re\u0301actif",
      "re\u0301agir",
      "re\u0301aliser",
      "re\u0301animer",
      "recevoir",
      "re\u0301citer",
      "re\u0301clamer",
      "re\u0301colter",
      "recruter",
      "reculer",
      "recycler",
      "re\u0301diger",
      "redouter",
      "refaire",
      "re\u0301flexe",
      "re\u0301former",
      "refrain",
      "refuge",
      "re\u0301galien",
      "re\u0301gion",
      "re\u0301glage",
      "re\u0301gulier",
      "re\u0301ite\u0301rer",
      "rejeter",
      "rejouer",
      "relatif",
      "relever",
      "relief",
      "remarque",
      "reme\u0300de",
      "remise",
      "remonter",
      "remplir",
      "remuer",
      "renard",
      "renfort",
      "renifler",
      "renoncer",
      "rentrer",
      "renvoi",
      "replier",
      "reporter",
      "reprise",
      "reptile",
      "requin",
      "re\u0301serve",
      "re\u0301sineux",
      "re\u0301soudre",
      "respect",
      "rester",
      "re\u0301sultat",
      "re\u0301tablir",
      "retenir",
      "re\u0301ticule",
      "retomber",
      "retracer",
      "re\u0301union",
      "re\u0301ussir",
      "revanche",
      "revivre",
      "re\u0301volte",
      "re\u0301vulsif",
      "richesse",
      "rideau",
      "rieur",
      "rigide",
      "rigoler",
      "rincer",
      "riposter",
      "risible",
      "risque",
      "rituel",
      "rival",
      "rivie\u0300re",
      "rocheux",
      "romance",
      "rompre",
      "ronce",
      "rondin",
      "roseau",
      "rosier",
      "rotatif",
      "rotor",
      "rotule",
      "rouge",
      "rouille",
      "rouleau",
      "routine",
      "royaume",
      "ruban",
      "rubis",
      "ruche",
      "ruelle",
      "rugueux",
      "ruiner",
      "ruisseau",
      "ruser",
      "rustique",
      "rythme",
      "sabler",
      "saboter",
      "sabre",
      "sacoche",
      "safari",
      "sagesse",
      "saisir",
      "salade",
      "salive",
      "salon",
      "saluer",
      "samedi",
      "sanction",
      "sanglier",
      "sarcasme",
      "sardine",
      "saturer",
      "saugrenu",
      "saumon",
      "sauter",
      "sauvage",
      "savant",
      "savonner",
      "scalpel",
      "scandale",
      "sce\u0301le\u0301rat",
      "sce\u0301nario",
      "sceptre",
      "sche\u0301ma",
      "science",
      "scinder",
      "score",
      "scrutin",
      "sculpter",
      "se\u0301ance",
      "se\u0301cable",
      "se\u0301cher",
      "secouer",
      "se\u0301cre\u0301ter",
      "se\u0301datif",
      "se\u0301duire",
      "seigneur",
      "se\u0301jour",
      "se\u0301lectif",
      "semaine",
      "sembler",
      "semence",
      "se\u0301minal",
      "se\u0301nateur",
      "sensible",
      "sentence",
      "se\u0301parer",
      "se\u0301quence",
      "serein",
      "sergent",
      "se\u0301rieux",
      "serrure",
      "se\u0301rum",
      "service",
      "se\u0301same",
      "se\u0301vir",
      "sevrage",
      "sextuple",
      "side\u0301ral",
      "sie\u0300cle",
      "sie\u0301ger",
      "siffler",
      "sigle",
      "signal",
      "silence",
      "silicium",
      "simple",
      "since\u0300re",
      "sinistre",
      "siphon",
      "sirop",
      "sismique",
      "situer",
      "skier",
      "social",
      "socle",
      "sodium",
      "soigneux",
      "soldat",
      "soleil",
      "solitude",
      "soluble",
      "sombre",
      "sommeil",
      "somnoler",
      "sonde",
      "songeur",
      "sonnette",
      "sonore",
      "sorcier",
      "sortir",
      "sosie",
      "sottise",
      "soucieux",
      "soudure",
      "souffle",
      "soulever",
      "soupape",
      "source",
      "soutirer",
      "souvenir",
      "spacieux",
      "spatial",
      "spe\u0301cial",
      "sphe\u0300re",
      "spiral",
      "stable",
      "station",
      "sternum",
      "stimulus",
      "stipuler",
      "strict",
      "studieux",
      "stupeur",
      "styliste",
      "sublime",
      "substrat",
      "subtil",
      "subvenir",
      "succe\u0300s",
      "sucre",
      "suffixe",
      "sugge\u0301rer",
      "suiveur",
      "sulfate",
      "superbe",
      "supplier",
      "surface",
      "suricate",
      "surmener",
      "surprise",
      "sursaut",
      "survie",
      "suspect",
      "syllabe",
      "symbole",
      "syme\u0301trie",
      "synapse",
      "syntaxe",
      "syste\u0300me",
      "tabac",
      "tablier",
      "tactile",
      "tailler",
      "talent",
      "talisman",
      "talonner",
      "tambour",
      "tamiser",
      "tangible",
      "tapis",
      "taquiner",
      "tarder",
      "tarif",
      "tartine",
      "tasse",
      "tatami",
      "tatouage",
      "taupe",
      "taureau",
      "taxer",
      "te\u0301moin",
      "temporel",
      "tenaille",
      "tendre",
      "teneur",
      "tenir",
      "tension",
      "terminer",
      "terne",
      "terrible",
      "te\u0301tine",
      "texte",
      "the\u0300me",
      "the\u0301orie",
      "the\u0301rapie",
      "thorax",
      "tibia",
      "tie\u0300de",
      "timide",
      "tirelire",
      "tiroir",
      "tissu",
      "titane",
      "titre",
      "tituber",
      "toboggan",
      "tole\u0301rant",
      "tomate",
      "tonique",
      "tonneau",
      "toponyme",
      "torche",
      "tordre",
      "tornade",
      "torpille",
      "torrent",
      "torse",
      "tortue",
      "totem",
      "toucher",
      "tournage",
      "tousser",
      "toxine",
      "traction",
      "trafic",
      "tragique",
      "trahir",
      "train",
      "trancher",
      "travail",
      "tre\u0300fle",
      "tremper",
      "tre\u0301sor",
      "treuil",
      "triage",
      "tribunal",
      "tricoter",
      "trilogie",
      "triomphe",
      "tripler",
      "triturer",
      "trivial",
      "trombone",
      "tronc",
      "tropical",
      "troupeau",
      "tuile",
      "tulipe",
      "tumulte",
      "tunnel",
      "turbine",
      "tuteur",
      "tutoyer",
      "tuyau",
      "tympan",
      "typhon",
      "typique",
      "tyran",
      "ubuesque",
      "ultime",
      "ultrason",
      "unanime",
      "unifier",
      "union",
      "unique",
      "unitaire",
      "univers",
      "uranium",
      "urbain",
      "urticant",
      "usage",
      "usine",
      "usuel",
      "usure",
      "utile",
      "utopie",
      "vacarme",
      "vaccin",
      "vagabond",
      "vague",
      "vaillant",
      "vaincre",
      "vaisseau",
      "valable",
      "valise",
      "vallon",
      "valve",
      "vampire",
      "vanille",
      "vapeur",
      "varier",
      "vaseux",
      "vassal",
      "vaste",
      "vecteur",
      "vedette",
      "ve\u0301ge\u0301tal",
      "ve\u0301hicule",
      "veinard",
      "ve\u0301loce",
      "vendredi",
      "ve\u0301ne\u0301rer",
      "venger",
      "venimeux",
      "ventouse",
      "verdure",
      "ve\u0301rin",
      "vernir",
      "verrou",
      "verser",
      "vertu",
      "veston",
      "ve\u0301te\u0301ran",
      "ve\u0301tuste",
      "vexant",
      "vexer",
      "viaduc",
      "viande",
      "victoire",
      "vidange",
      "vide\u0301o",
      "vignette",
      "vigueur",
      "vilain",
      "village",
      "vinaigre",
      "violon",
      "vipe\u0300re",
      "virement",
      "virtuose",
      "virus",
      "visage",
      "viseur",
      "vision",
      "visqueux",
      "visuel",
      "vital",
      "vitesse",
      "viticole",
      "vitrine",
      "vivace",
      "vivipare",
      "vocation",
      "voguer",
      "voile",
      "voisin",
      "voiture",
      "volaille",
      "volcan",
      "voltiger",
      "volume",
      "vorace",
      "vortex",
      "voter",
      "vouloir",
      "voyage",
      "voyelle",
      "wagon",
      "xe\u0301non",
      "yacht",
      "ze\u0300bre",
      "ze\u0301nith",
      "zeste",
      "zoologie"
    ];
  }
});

// ../node_modules/bip39/src/wordlists/italian.json
var require_italian = __commonJS({
  "../node_modules/bip39/src/wordlists/italian.json"(exports, module) {
    module.exports = [
      "abaco",
      "abbaglio",
      "abbinato",
      "abete",
      "abisso",
      "abolire",
      "abrasivo",
      "abrogato",
      "accadere",
      "accenno",
      "accusato",
      "acetone",
      "achille",
      "acido",
      "acqua",
      "acre",
      "acrilico",
      "acrobata",
      "acuto",
      "adagio",
      "addebito",
      "addome",
      "adeguato",
      "aderire",
      "adipe",
      "adottare",
      "adulare",
      "affabile",
      "affetto",
      "affisso",
      "affranto",
      "aforisma",
      "afoso",
      "africano",
      "agave",
      "agente",
      "agevole",
      "aggancio",
      "agire",
      "agitare",
      "agonismo",
      "agricolo",
      "agrumeto",
      "aguzzo",
      "alabarda",
      "alato",
      "albatro",
      "alberato",
      "albo",
      "albume",
      "alce",
      "alcolico",
      "alettone",
      "alfa",
      "algebra",
      "aliante",
      "alibi",
      "alimento",
      "allagato",
      "allegro",
      "allievo",
      "allodola",
      "allusivo",
      "almeno",
      "alogeno",
      "alpaca",
      "alpestre",
      "altalena",
      "alterno",
      "alticcio",
      "altrove",
      "alunno",
      "alveolo",
      "alzare",
      "amalgama",
      "amanita",
      "amarena",
      "ambito",
      "ambrato",
      "ameba",
      "america",
      "ametista",
      "amico",
      "ammasso",
      "ammenda",
      "ammirare",
      "ammonito",
      "amore",
      "ampio",
      "ampliare",
      "amuleto",
      "anacardo",
      "anagrafe",
      "analista",
      "anarchia",
      "anatra",
      "anca",
      "ancella",
      "ancora",
      "andare",
      "andrea",
      "anello",
      "angelo",
      "angolare",
      "angusto",
      "anima",
      "annegare",
      "annidato",
      "anno",
      "annuncio",
      "anonimo",
      "anticipo",
      "anzi",
      "apatico",
      "apertura",
      "apode",
      "apparire",
      "appetito",
      "appoggio",
      "approdo",
      "appunto",
      "aprile",
      "arabica",
      "arachide",
      "aragosta",
      "araldica",
      "arancio",
      "aratura",
      "arazzo",
      "arbitro",
      "archivio",
      "ardito",
      "arenile",
      "argento",
      "argine",
      "arguto",
      "aria",
      "armonia",
      "arnese",
      "arredato",
      "arringa",
      "arrosto",
      "arsenico",
      "arso",
      "artefice",
      "arzillo",
      "asciutto",
      "ascolto",
      "asepsi",
      "asettico",
      "asfalto",
      "asino",
      "asola",
      "aspirato",
      "aspro",
      "assaggio",
      "asse",
      "assoluto",
      "assurdo",
      "asta",
      "astenuto",
      "astice",
      "astratto",
      "atavico",
      "ateismo",
      "atomico",
      "atono",
      "attesa",
      "attivare",
      "attorno",
      "attrito",
      "attuale",
      "ausilio",
      "austria",
      "autista",
      "autonomo",
      "autunno",
      "avanzato",
      "avere",
      "avvenire",
      "avviso",
      "avvolgere",
      "azione",
      "azoto",
      "azzimo",
      "azzurro",
      "babele",
      "baccano",
      "bacino",
      "baco",
      "badessa",
      "badilata",
      "bagnato",
      "baita",
      "balcone",
      "baldo",
      "balena",
      "ballata",
      "balzano",
      "bambino",
      "bandire",
      "baraonda",
      "barbaro",
      "barca",
      "baritono",
      "barlume",
      "barocco",
      "basilico",
      "basso",
      "batosta",
      "battuto",
      "baule",
      "bava",
      "bavosa",
      "becco",
      "beffa",
      "belgio",
      "belva",
      "benda",
      "benevole",
      "benigno",
      "benzina",
      "bere",
      "berlina",
      "beta",
      "bibita",
      "bici",
      "bidone",
      "bifido",
      "biga",
      "bilancia",
      "bimbo",
      "binocolo",
      "biologo",
      "bipede",
      "bipolare",
      "birbante",
      "birra",
      "biscotto",
      "bisesto",
      "bisnonno",
      "bisonte",
      "bisturi",
      "bizzarro",
      "blando",
      "blatta",
      "bollito",
      "bonifico",
      "bordo",
      "bosco",
      "botanico",
      "bottino",
      "bozzolo",
      "braccio",
      "bradipo",
      "brama",
      "branca",
      "bravura",
      "bretella",
      "brevetto",
      "brezza",
      "briglia",
      "brillante",
      "brindare",
      "broccolo",
      "brodo",
      "bronzina",
      "brullo",
      "bruno",
      "bubbone",
      "buca",
      "budino",
      "buffone",
      "buio",
      "bulbo",
      "buono",
      "burlone",
      "burrasca",
      "bussola",
      "busta",
      "cadetto",
      "caduco",
      "calamaro",
      "calcolo",
      "calesse",
      "calibro",
      "calmo",
      "caloria",
      "cambusa",
      "camerata",
      "camicia",
      "cammino",
      "camola",
      "campale",
      "canapa",
      "candela",
      "cane",
      "canino",
      "canotto",
      "cantina",
      "capace",
      "capello",
      "capitolo",
      "capogiro",
      "cappero",
      "capra",
      "capsula",
      "carapace",
      "carcassa",
      "cardo",
      "carisma",
      "carovana",
      "carretto",
      "cartolina",
      "casaccio",
      "cascata",
      "caserma",
      "caso",
      "cassone",
      "castello",
      "casuale",
      "catasta",
      "catena",
      "catrame",
      "cauto",
      "cavillo",
      "cedibile",
      "cedrata",
      "cefalo",
      "celebre",
      "cellulare",
      "cena",
      "cenone",
      "centesimo",
      "ceramica",
      "cercare",
      "certo",
      "cerume",
      "cervello",
      "cesoia",
      "cespo",
      "ceto",
      "chela",
      "chiaro",
      "chicca",
      "chiedere",
      "chimera",
      "china",
      "chirurgo",
      "chitarra",
      "ciao",
      "ciclismo",
      "cifrare",
      "cigno",
      "cilindro",
      "ciottolo",
      "circa",
      "cirrosi",
      "citrico",
      "cittadino",
      "ciuffo",
      "civetta",
      "civile",
      "classico",
      "clinica",
      "cloro",
      "cocco",
      "codardo",
      "codice",
      "coerente",
      "cognome",
      "collare",
      "colmato",
      "colore",
      "colposo",
      "coltivato",
      "colza",
      "coma",
      "cometa",
      "commando",
      "comodo",
      "computer",
      "comune",
      "conciso",
      "condurre",
      "conferma",
      "congelare",
      "coniuge",
      "connesso",
      "conoscere",
      "consumo",
      "continuo",
      "convegno",
      "coperto",
      "copione",
      "coppia",
      "copricapo",
      "corazza",
      "cordata",
      "coricato",
      "cornice",
      "corolla",
      "corpo",
      "corredo",
      "corsia",
      "cortese",
      "cosmico",
      "costante",
      "cottura",
      "covato",
      "cratere",
      "cravatta",
      "creato",
      "credere",
      "cremoso",
      "crescita",
      "creta",
      "criceto",
      "crinale",
      "crisi",
      "critico",
      "croce",
      "cronaca",
      "crostata",
      "cruciale",
      "crusca",
      "cucire",
      "cuculo",
      "cugino",
      "cullato",
      "cupola",
      "curatore",
      "cursore",
      "curvo",
      "cuscino",
      "custode",
      "dado",
      "daino",
      "dalmata",
      "damerino",
      "daniela",
      "dannoso",
      "danzare",
      "datato",
      "davanti",
      "davvero",
      "debutto",
      "decennio",
      "deciso",
      "declino",
      "decollo",
      "decreto",
      "dedicato",
      "definito",
      "deforme",
      "degno",
      "delegare",
      "delfino",
      "delirio",
      "delta",
      "demenza",
      "denotato",
      "dentro",
      "deposito",
      "derapata",
      "derivare",
      "deroga",
      "descritto",
      "deserto",
      "desiderio",
      "desumere",
      "detersivo",
      "devoto",
      "diametro",
      "dicembre",
      "diedro",
      "difeso",
      "diffuso",
      "digerire",
      "digitale",
      "diluvio",
      "dinamico",
      "dinnanzi",
      "dipinto",
      "diploma",
      "dipolo",
      "diradare",
      "dire",
      "dirotto",
      "dirupo",
      "disagio",
      "discreto",
      "disfare",
      "disgelo",
      "disposto",
      "distanza",
      "disumano",
      "dito",
      "divano",
      "divelto",
      "dividere",
      "divorato",
      "doblone",
      "docente",
      "doganale",
      "dogma",
      "dolce",
      "domato",
      "domenica",
      "dominare",
      "dondolo",
      "dono",
      "dormire",
      "dote",
      "dottore",
      "dovuto",
      "dozzina",
      "drago",
      "druido",
      "dubbio",
      "dubitare",
      "ducale",
      "duna",
      "duomo",
      "duplice",
      "duraturo",
      "ebano",
      "eccesso",
      "ecco",
      "eclissi",
      "economia",
      "edera",
      "edicola",
      "edile",
      "editoria",
      "educare",
      "egemonia",
      "egli",
      "egoismo",
      "egregio",
      "elaborato",
      "elargire",
      "elegante",
      "elencato",
      "eletto",
      "elevare",
      "elfico",
      "elica",
      "elmo",
      "elsa",
      "eluso",
      "emanato",
      "emblema",
      "emesso",
      "emiro",
      "emotivo",
      "emozione",
      "empirico",
      "emulo",
      "endemico",
      "enduro",
      "energia",
      "enfasi",
      "enoteca",
      "entrare",
      "enzima",
      "epatite",
      "epilogo",
      "episodio",
      "epocale",
      "eppure",
      "equatore",
      "erario",
      "erba",
      "erboso",
      "erede",
      "eremita",
      "erigere",
      "ermetico",
      "eroe",
      "erosivo",
      "errante",
      "esagono",
      "esame",
      "esanime",
      "esaudire",
      "esca",
      "esempio",
      "esercito",
      "esibito",
      "esigente",
      "esistere",
      "esito",
      "esofago",
      "esortato",
      "esoso",
      "espanso",
      "espresso",
      "essenza",
      "esso",
      "esteso",
      "estimare",
      "estonia",
      "estroso",
      "esultare",
      "etilico",
      "etnico",
      "etrusco",
      "etto",
      "euclideo",
      "europa",
      "evaso",
      "evidenza",
      "evitato",
      "evoluto",
      "evviva",
      "fabbrica",
      "faccenda",
      "fachiro",
      "falco",
      "famiglia",
      "fanale",
      "fanfara",
      "fango",
      "fantasma",
      "fare",
      "farfalla",
      "farinoso",
      "farmaco",
      "fascia",
      "fastoso",
      "fasullo",
      "faticare",
      "fato",
      "favoloso",
      "febbre",
      "fecola",
      "fede",
      "fegato",
      "felpa",
      "feltro",
      "femmina",
      "fendere",
      "fenomeno",
      "fermento",
      "ferro",
      "fertile",
      "fessura",
      "festivo",
      "fetta",
      "feudo",
      "fiaba",
      "fiducia",
      "fifa",
      "figurato",
      "filo",
      "finanza",
      "finestra",
      "finire",
      "fiore",
      "fiscale",
      "fisico",
      "fiume",
      "flacone",
      "flamenco",
      "flebo",
      "flemma",
      "florido",
      "fluente",
      "fluoro",
      "fobico",
      "focaccia",
      "focoso",
      "foderato",
      "foglio",
      "folata",
      "folclore",
      "folgore",
      "fondente",
      "fonetico",
      "fonia",
      "fontana",
      "forbito",
      "forchetta",
      "foresta",
      "formica",
      "fornaio",
      "foro",
      "fortezza",
      "forzare",
      "fosfato",
      "fosso",
      "fracasso",
      "frana",
      "frassino",
      "fratello",
      "freccetta",
      "frenata",
      "fresco",
      "frigo",
      "frollino",
      "fronde",
      "frugale",
      "frutta",
      "fucilata",
      "fucsia",
      "fuggente",
      "fulmine",
      "fulvo",
      "fumante",
      "fumetto",
      "fumoso",
      "fune",
      "funzione",
      "fuoco",
      "furbo",
      "furgone",
      "furore",
      "fuso",
      "futile",
      "gabbiano",
      "gaffe",
      "galateo",
      "gallina",
      "galoppo",
      "gambero",
      "gamma",
      "garanzia",
      "garbo",
      "garofano",
      "garzone",
      "gasdotto",
      "gasolio",
      "gastrico",
      "gatto",
      "gaudio",
      "gazebo",
      "gazzella",
      "geco",
      "gelatina",
      "gelso",
      "gemello",
      "gemmato",
      "gene",
      "genitore",
      "gennaio",
      "genotipo",
      "gergo",
      "ghepardo",
      "ghiaccio",
      "ghisa",
      "giallo",
      "gilda",
      "ginepro",
      "giocare",
      "gioiello",
      "giorno",
      "giove",
      "girato",
      "girone",
      "gittata",
      "giudizio",
      "giurato",
      "giusto",
      "globulo",
      "glutine",
      "gnomo",
      "gobba",
      "golf",
      "gomito",
      "gommone",
      "gonfio",
      "gonna",
      "governo",
      "gracile",
      "grado",
      "grafico",
      "grammo",
      "grande",
      "grattare",
      "gravoso",
      "grazia",
      "greca",
      "gregge",
      "grifone",
      "grigio",
      "grinza",
      "grotta",
      "gruppo",
      "guadagno",
      "guaio",
      "guanto",
      "guardare",
      "gufo",
      "guidare",
      "ibernato",
      "icona",
      "identico",
      "idillio",
      "idolo",
      "idra",
      "idrico",
      "idrogeno",
      "igiene",
      "ignaro",
      "ignorato",
      "ilare",
      "illeso",
      "illogico",
      "illudere",
      "imballo",
      "imbevuto",
      "imbocco",
      "imbuto",
      "immane",
      "immerso",
      "immolato",
      "impacco",
      "impeto",
      "impiego",
      "importo",
      "impronta",
      "inalare",
      "inarcare",
      "inattivo",
      "incanto",
      "incendio",
      "inchino",
      "incisivo",
      "incluso",
      "incontro",
      "incrocio",
      "incubo",
      "indagine",
      "india",
      "indole",
      "inedito",
      "infatti",
      "infilare",
      "inflitto",
      "ingaggio",
      "ingegno",
      "inglese",
      "ingordo",
      "ingrosso",
      "innesco",
      "inodore",
      "inoltrare",
      "inondato",
      "insano",
      "insetto",
      "insieme",
      "insonnia",
      "insulina",
      "intasato",
      "intero",
      "intonaco",
      "intuito",
      "inumidire",
      "invalido",
      "invece",
      "invito",
      "iperbole",
      "ipnotico",
      "ipotesi",
      "ippica",
      "iride",
      "irlanda",
      "ironico",
      "irrigato",
      "irrorare",
      "isolato",
      "isotopo",
      "isterico",
      "istituto",
      "istrice",
      "italia",
      "iterare",
      "labbro",
      "labirinto",
      "lacca",
      "lacerato",
      "lacrima",
      "lacuna",
      "laddove",
      "lago",
      "lampo",
      "lancetta",
      "lanterna",
      "lardoso",
      "larga",
      "laringe",
      "lastra",
      "latenza",
      "latino",
      "lattuga",
      "lavagna",
      "lavoro",
      "legale",
      "leggero",
      "lembo",
      "lentezza",
      "lenza",
      "leone",
      "lepre",
      "lesivo",
      "lessato",
      "lesto",
      "letterale",
      "leva",
      "levigato",
      "libero",
      "lido",
      "lievito",
      "lilla",
      "limatura",
      "limitare",
      "limpido",
      "lineare",
      "lingua",
      "liquido",
      "lira",
      "lirica",
      "lisca",
      "lite",
      "litigio",
      "livrea",
      "locanda",
      "lode",
      "logica",
      "lombare",
      "londra",
      "longevo",
      "loquace",
      "lorenzo",
      "loto",
      "lotteria",
      "luce",
      "lucidato",
      "lumaca",
      "luminoso",
      "lungo",
      "lupo",
      "luppolo",
      "lusinga",
      "lusso",
      "lutto",
      "macabro",
      "macchina",
      "macero",
      "macinato",
      "madama",
      "magico",
      "maglia",
      "magnete",
      "magro",
      "maiolica",
      "malafede",
      "malgrado",
      "malinteso",
      "malsano",
      "malto",
      "malumore",
      "mana",
      "mancia",
      "mandorla",
      "mangiare",
      "manifesto",
      "mannaro",
      "manovra",
      "mansarda",
      "mantide",
      "manubrio",
      "mappa",
      "maratona",
      "marcire",
      "maretta",
      "marmo",
      "marsupio",
      "maschera",
      "massaia",
      "mastino",
      "materasso",
      "matricola",
      "mattone",
      "maturo",
      "mazurca",
      "meandro",
      "meccanico",
      "mecenate",
      "medesimo",
      "meditare",
      "mega",
      "melassa",
      "melis",
      "melodia",
      "meninge",
      "meno",
      "mensola",
      "mercurio",
      "merenda",
      "merlo",
      "meschino",
      "mese",
      "messere",
      "mestolo",
      "metallo",
      "metodo",
      "mettere",
      "miagolare",
      "mica",
      "micelio",
      "michele",
      "microbo",
      "midollo",
      "miele",
      "migliore",
      "milano",
      "milite",
      "mimosa",
      "minerale",
      "mini",
      "minore",
      "mirino",
      "mirtillo",
      "miscela",
      "missiva",
      "misto",
      "misurare",
      "mitezza",
      "mitigare",
      "mitra",
      "mittente",
      "mnemonico",
      "modello",
      "modifica",
      "modulo",
      "mogano",
      "mogio",
      "mole",
      "molosso",
      "monastero",
      "monco",
      "mondina",
      "monetario",
      "monile",
      "monotono",
      "monsone",
      "montato",
      "monviso",
      "mora",
      "mordere",
      "morsicato",
      "mostro",
      "motivato",
      "motosega",
      "motto",
      "movenza",
      "movimento",
      "mozzo",
      "mucca",
      "mucosa",
      "muffa",
      "mughetto",
      "mugnaio",
      "mulatto",
      "mulinello",
      "multiplo",
      "mummia",
      "munto",
      "muovere",
      "murale",
      "musa",
      "muscolo",
      "musica",
      "mutevole",
      "muto",
      "nababbo",
      "nafta",
      "nanometro",
      "narciso",
      "narice",
      "narrato",
      "nascere",
      "nastrare",
      "naturale",
      "nautica",
      "naviglio",
      "nebulosa",
      "necrosi",
      "negativo",
      "negozio",
      "nemmeno",
      "neofita",
      "neretto",
      "nervo",
      "nessuno",
      "nettuno",
      "neutrale",
      "neve",
      "nevrotico",
      "nicchia",
      "ninfa",
      "nitido",
      "nobile",
      "nocivo",
      "nodo",
      "nome",
      "nomina",
      "nordico",
      "normale",
      "norvegese",
      "nostrano",
      "notare",
      "notizia",
      "notturno",
      "novella",
      "nucleo",
      "nulla",
      "numero",
      "nuovo",
      "nutrire",
      "nuvola",
      "nuziale",
      "oasi",
      "obbedire",
      "obbligo",
      "obelisco",
      "oblio",
      "obolo",
      "obsoleto",
      "occasione",
      "occhio",
      "occidente",
      "occorrere",
      "occultare",
      "ocra",
      "oculato",
      "odierno",
      "odorare",
      "offerta",
      "offrire",
      "offuscato",
      "oggetto",
      "oggi",
      "ognuno",
      "olandese",
      "olfatto",
      "oliato",
      "oliva",
      "ologramma",
      "oltre",
      "omaggio",
      "ombelico",
      "ombra",
      "omega",
      "omissione",
      "ondoso",
      "onere",
      "onice",
      "onnivoro",
      "onorevole",
      "onta",
      "operato",
      "opinione",
      "opposto",
      "oracolo",
      "orafo",
      "ordine",
      "orecchino",
      "orefice",
      "orfano",
      "organico",
      "origine",
      "orizzonte",
      "orma",
      "ormeggio",
      "ornativo",
      "orologio",
      "orrendo",
      "orribile",
      "ortensia",
      "ortica",
      "orzata",
      "orzo",
      "osare",
      "oscurare",
      "osmosi",
      "ospedale",
      "ospite",
      "ossa",
      "ossidare",
      "ostacolo",
      "oste",
      "otite",
      "otre",
      "ottagono",
      "ottimo",
      "ottobre",
      "ovale",
      "ovest",
      "ovino",
      "oviparo",
      "ovocito",
      "ovunque",
      "ovviare",
      "ozio",
      "pacchetto",
      "pace",
      "pacifico",
      "padella",
      "padrone",
      "paese",
      "paga",
      "pagina",
      "palazzina",
      "palesare",
      "pallido",
      "palo",
      "palude",
      "pandoro",
      "pannello",
      "paolo",
      "paonazzo",
      "paprica",
      "parabola",
      "parcella",
      "parere",
      "pargolo",
      "pari",
      "parlato",
      "parola",
      "partire",
      "parvenza",
      "parziale",
      "passivo",
      "pasticca",
      "patacca",
      "patologia",
      "pattume",
      "pavone",
      "peccato",
      "pedalare",
      "pedonale",
      "peggio",
      "peloso",
      "penare",
      "pendice",
      "penisola",
      "pennuto",
      "penombra",
      "pensare",
      "pentola",
      "pepe",
      "pepita",
      "perbene",
      "percorso",
      "perdonato",
      "perforare",
      "pergamena",
      "periodo",
      "permesso",
      "perno",
      "perplesso",
      "persuaso",
      "pertugio",
      "pervaso",
      "pesatore",
      "pesista",
      "peso",
      "pestifero",
      "petalo",
      "pettine",
      "petulante",
      "pezzo",
      "piacere",
      "pianta",
      "piattino",
      "piccino",
      "picozza",
      "piega",
      "pietra",
      "piffero",
      "pigiama",
      "pigolio",
      "pigro",
      "pila",
      "pilifero",
      "pillola",
      "pilota",
      "pimpante",
      "pineta",
      "pinna",
      "pinolo",
      "pioggia",
      "piombo",
      "piramide",
      "piretico",
      "pirite",
      "pirolisi",
      "pitone",
      "pizzico",
      "placebo",
      "planare",
      "plasma",
      "platano",
      "plenario",
      "pochezza",
      "poderoso",
      "podismo",
      "poesia",
      "poggiare",
      "polenta",
      "poligono",
      "pollice",
      "polmonite",
      "polpetta",
      "polso",
      "poltrona",
      "polvere",
      "pomice",
      "pomodoro",
      "ponte",
      "popoloso",
      "porfido",
      "poroso",
      "porpora",
      "porre",
      "portata",
      "posa",
      "positivo",
      "possesso",
      "postulato",
      "potassio",
      "potere",
      "pranzo",
      "prassi",
      "pratica",
      "precluso",
      "predica",
      "prefisso",
      "pregiato",
      "prelievo",
      "premere",
      "prenotare",
      "preparato",
      "presenza",
      "pretesto",
      "prevalso",
      "prima",
      "principe",
      "privato",
      "problema",
      "procura",
      "produrre",
      "profumo",
      "progetto",
      "prolunga",
      "promessa",
      "pronome",
      "proposta",
      "proroga",
      "proteso",
      "prova",
      "prudente",
      "prugna",
      "prurito",
      "psiche",
      "pubblico",
      "pudica",
      "pugilato",
      "pugno",
      "pulce",
      "pulito",
      "pulsante",
      "puntare",
      "pupazzo",
      "pupilla",
      "puro",
      "quadro",
      "qualcosa",
      "quasi",
      "querela",
      "quota",
      "raccolto",
      "raddoppio",
      "radicale",
      "radunato",
      "raffica",
      "ragazzo",
      "ragione",
      "ragno",
      "ramarro",
      "ramingo",
      "ramo",
      "randagio",
      "rantolare",
      "rapato",
      "rapina",
      "rappreso",
      "rasatura",
      "raschiato",
      "rasente",
      "rassegna",
      "rastrello",
      "rata",
      "ravveduto",
      "reale",
      "recepire",
      "recinto",
      "recluta",
      "recondito",
      "recupero",
      "reddito",
      "redimere",
      "regalato",
      "registro",
      "regola",
      "regresso",
      "relazione",
      "remare",
      "remoto",
      "renna",
      "replica",
      "reprimere",
      "reputare",
      "resa",
      "residente",
      "responso",
      "restauro",
      "rete",
      "retina",
      "retorica",
      "rettifica",
      "revocato",
      "riassunto",
      "ribadire",
      "ribelle",
      "ribrezzo",
      "ricarica",
      "ricco",
      "ricevere",
      "riciclato",
      "ricordo",
      "ricreduto",
      "ridicolo",
      "ridurre",
      "rifasare",
      "riflesso",
      "riforma",
      "rifugio",
      "rigare",
      "rigettato",
      "righello",
      "rilassato",
      "rilevato",
      "rimanere",
      "rimbalzo",
      "rimedio",
      "rimorchio",
      "rinascita",
      "rincaro",
      "rinforzo",
      "rinnovo",
      "rinomato",
      "rinsavito",
      "rintocco",
      "rinuncia",
      "rinvenire",
      "riparato",
      "ripetuto",
      "ripieno",
      "riportare",
      "ripresa",
      "ripulire",
      "risata",
      "rischio",
      "riserva",
      "risibile",
      "riso",
      "rispetto",
      "ristoro",
      "risultato",
      "risvolto",
      "ritardo",
      "ritegno",
      "ritmico",
      "ritrovo",
      "riunione",
      "riva",
      "riverso",
      "rivincita",
      "rivolto",
      "rizoma",
      "roba",
      "robotico",
      "robusto",
      "roccia",
      "roco",
      "rodaggio",
      "rodere",
      "roditore",
      "rogito",
      "rollio",
      "romantico",
      "rompere",
      "ronzio",
      "rosolare",
      "rospo",
      "rotante",
      "rotondo",
      "rotula",
      "rovescio",
      "rubizzo",
      "rubrica",
      "ruga",
      "rullino",
      "rumine",
      "rumoroso",
      "ruolo",
      "rupe",
      "russare",
      "rustico",
      "sabato",
      "sabbiare",
      "sabotato",
      "sagoma",
      "salasso",
      "saldatura",
      "salgemma",
      "salivare",
      "salmone",
      "salone",
      "saltare",
      "saluto",
      "salvo",
      "sapere",
      "sapido",
      "saporito",
      "saraceno",
      "sarcasmo",
      "sarto",
      "sassoso",
      "satellite",
      "satira",
      "satollo",
      "saturno",
      "savana",
      "savio",
      "saziato",
      "sbadiglio",
      "sbalzo",
      "sbancato",
      "sbarra",
      "sbattere",
      "sbavare",
      "sbendare",
      "sbirciare",
      "sbloccato",
      "sbocciato",
      "sbrinare",
      "sbruffone",
      "sbuffare",
      "scabroso",
      "scadenza",
      "scala",
      "scambiare",
      "scandalo",
      "scapola",
      "scarso",
      "scatenare",
      "scavato",
      "scelto",
      "scenico",
      "scettro",
      "scheda",
      "schiena",
      "sciarpa",
      "scienza",
      "scindere",
      "scippo",
      "sciroppo",
      "scivolo",
      "sclerare",
      "scodella",
      "scolpito",
      "scomparto",
      "sconforto",
      "scoprire",
      "scorta",
      "scossone",
      "scozzese",
      "scriba",
      "scrollare",
      "scrutinio",
      "scuderia",
      "scultore",
      "scuola",
      "scuro",
      "scusare",
      "sdebitare",
      "sdoganare",
      "seccatura",
      "secondo",
      "sedano",
      "seggiola",
      "segnalato",
      "segregato",
      "seguito",
      "selciato",
      "selettivo",
      "sella",
      "selvaggio",
      "semaforo",
      "sembrare",
      "seme",
      "seminato",
      "sempre",
      "senso",
      "sentire",
      "sepolto",
      "sequenza",
      "serata",
      "serbato",
      "sereno",
      "serio",
      "serpente",
      "serraglio",
      "servire",
      "sestina",
      "setola",
      "settimana",
      "sfacelo",
      "sfaldare",
      "sfamato",
      "sfarzoso",
      "sfaticato",
      "sfera",
      "sfida",
      "sfilato",
      "sfinge",
      "sfocato",
      "sfoderare",
      "sfogo",
      "sfoltire",
      "sforzato",
      "sfratto",
      "sfruttato",
      "sfuggito",
      "sfumare",
      "sfuso",
      "sgabello",
      "sgarbato",
      "sgonfiare",
      "sgorbio",
      "sgrassato",
      "sguardo",
      "sibilo",
      "siccome",
      "sierra",
      "sigla",
      "signore",
      "silenzio",
      "sillaba",
      "simbolo",
      "simpatico",
      "simulato",
      "sinfonia",
      "singolo",
      "sinistro",
      "sino",
      "sintesi",
      "sinusoide",
      "sipario",
      "sisma",
      "sistole",
      "situato",
      "slitta",
      "slogatura",
      "sloveno",
      "smarrito",
      "smemorato",
      "smentito",
      "smeraldo",
      "smilzo",
      "smontare",
      "smottato",
      "smussato",
      "snellire",
      "snervato",
      "snodo",
      "sobbalzo",
      "sobrio",
      "soccorso",
      "sociale",
      "sodale",
      "soffitto",
      "sogno",
      "soldato",
      "solenne",
      "solido",
      "sollazzo",
      "solo",
      "solubile",
      "solvente",
      "somatico",
      "somma",
      "sonda",
      "sonetto",
      "sonnifero",
      "sopire",
      "soppeso",
      "sopra",
      "sorgere",
      "sorpasso",
      "sorriso",
      "sorso",
      "sorteggio",
      "sorvolato",
      "sospiro",
      "sosta",
      "sottile",
      "spada",
      "spalla",
      "spargere",
      "spatola",
      "spavento",
      "spazzola",
      "specie",
      "spedire",
      "spegnere",
      "spelatura",
      "speranza",
      "spessore",
      "spettrale",
      "spezzato",
      "spia",
      "spigoloso",
      "spillato",
      "spinoso",
      "spirale",
      "splendido",
      "sportivo",
      "sposo",
      "spranga",
      "sprecare",
      "spronato",
      "spruzzo",
      "spuntino",
      "squillo",
      "sradicare",
      "srotolato",
      "stabile",
      "stacco",
      "staffa",
      "stagnare",
      "stampato",
      "stantio",
      "starnuto",
      "stasera",
      "statuto",
      "stelo",
      "steppa",
      "sterzo",
      "stiletto",
      "stima",
      "stirpe",
      "stivale",
      "stizzoso",
      "stonato",
      "storico",
      "strappo",
      "stregato",
      "stridulo",
      "strozzare",
      "strutto",
      "stuccare",
      "stufo",
      "stupendo",
      "subentro",
      "succoso",
      "sudore",
      "suggerito",
      "sugo",
      "sultano",
      "suonare",
      "superbo",
      "supporto",
      "surgelato",
      "surrogato",
      "sussurro",
      "sutura",
      "svagare",
      "svedese",
      "sveglio",
      "svelare",
      "svenuto",
      "svezia",
      "sviluppo",
      "svista",
      "svizzera",
      "svolta",
      "svuotare",
      "tabacco",
      "tabulato",
      "tacciare",
      "taciturno",
      "tale",
      "talismano",
      "tampone",
      "tannino",
      "tara",
      "tardivo",
      "targato",
      "tariffa",
      "tarpare",
      "tartaruga",
      "tasto",
      "tattico",
      "taverna",
      "tavolata",
      "tazza",
      "teca",
      "tecnico",
      "telefono",
      "temerario",
      "tempo",
      "temuto",
      "tendone",
      "tenero",
      "tensione",
      "tentacolo",
      "teorema",
      "terme",
      "terrazzo",
      "terzetto",
      "tesi",
      "tesserato",
      "testato",
      "tetro",
      "tettoia",
      "tifare",
      "tigella",
      "timbro",
      "tinto",
      "tipico",
      "tipografo",
      "tiraggio",
      "tiro",
      "titanio",
      "titolo",
      "titubante",
      "tizio",
      "tizzone",
      "toccare",
      "tollerare",
      "tolto",
      "tombola",
      "tomo",
      "tonfo",
      "tonsilla",
      "topazio",
      "topologia",
      "toppa",
      "torba",
      "tornare",
      "torrone",
      "tortora",
      "toscano",
      "tossire",
      "tostatura",
      "totano",
      "trabocco",
      "trachea",
      "trafila",
      "tragedia",
      "tralcio",
      "tramonto",
      "transito",
      "trapano",
      "trarre",
      "trasloco",
      "trattato",
      "trave",
      "treccia",
      "tremolio",
      "trespolo",
      "tributo",
      "tricheco",
      "trifoglio",
      "trillo",
      "trincea",
      "trio",
      "tristezza",
      "triturato",
      "trivella",
      "tromba",
      "trono",
      "troppo",
      "trottola",
      "trovare",
      "truccato",
      "tubatura",
      "tuffato",
      "tulipano",
      "tumulto",
      "tunisia",
      "turbare",
      "turchino",
      "tuta",
      "tutela",
      "ubicato",
      "uccello",
      "uccisore",
      "udire",
      "uditivo",
      "uffa",
      "ufficio",
      "uguale",
      "ulisse",
      "ultimato",
      "umano",
      "umile",
      "umorismo",
      "uncinetto",
      "ungere",
      "ungherese",
      "unicorno",
      "unificato",
      "unisono",
      "unitario",
      "unte",
      "uovo",
      "upupa",
      "uragano",
      "urgenza",
      "urlo",
      "usanza",
      "usato",
      "uscito",
      "usignolo",
      "usuraio",
      "utensile",
      "utilizzo",
      "utopia",
      "vacante",
      "vaccinato",
      "vagabondo",
      "vagliato",
      "valanga",
      "valgo",
      "valico",
      "valletta",
      "valoroso",
      "valutare",
      "valvola",
      "vampata",
      "vangare",
      "vanitoso",
      "vano",
      "vantaggio",
      "vanvera",
      "vapore",
      "varano",
      "varcato",
      "variante",
      "vasca",
      "vedetta",
      "vedova",
      "veduto",
      "vegetale",
      "veicolo",
      "velcro",
      "velina",
      "velluto",
      "veloce",
      "venato",
      "vendemmia",
      "vento",
      "verace",
      "verbale",
      "vergogna",
      "verifica",
      "vero",
      "verruca",
      "verticale",
      "vescica",
      "vessillo",
      "vestale",
      "veterano",
      "vetrina",
      "vetusto",
      "viandante",
      "vibrante",
      "vicenda",
      "vichingo",
      "vicinanza",
      "vidimare",
      "vigilia",
      "vigneto",
      "vigore",
      "vile",
      "villano",
      "vimini",
      "vincitore",
      "viola",
      "vipera",
      "virgola",
      "virologo",
      "virulento",
      "viscoso",
      "visione",
      "vispo",
      "vissuto",
      "visura",
      "vita",
      "vitello",
      "vittima",
      "vivanda",
      "vivido",
      "viziare",
      "voce",
      "voga",
      "volatile",
      "volere",
      "volpe",
      "voragine",
      "vulcano",
      "zampogna",
      "zanna",
      "zappato",
      "zattera",
      "zavorra",
      "zefiro",
      "zelante",
      "zelo",
      "zenzero",
      "zerbino",
      "zibetto",
      "zinco",
      "zircone",
      "zitto",
      "zolla",
      "zotico",
      "zucchero",
      "zufolo",
      "zulu",
      "zuppa"
    ];
  }
});

// ../node_modules/bip39/src/wordlists/spanish.json
var require_spanish = __commonJS({
  "../node_modules/bip39/src/wordlists/spanish.json"(exports, module) {
    module.exports = [
      "a\u0301baco",
      "abdomen",
      "abeja",
      "abierto",
      "abogado",
      "abono",
      "aborto",
      "abrazo",
      "abrir",
      "abuelo",
      "abuso",
      "acabar",
      "academia",
      "acceso",
      "accio\u0301n",
      "aceite",
      "acelga",
      "acento",
      "aceptar",
      "a\u0301cido",
      "aclarar",
      "acne\u0301",
      "acoger",
      "acoso",
      "activo",
      "acto",
      "actriz",
      "actuar",
      "acudir",
      "acuerdo",
      "acusar",
      "adicto",
      "admitir",
      "adoptar",
      "adorno",
      "aduana",
      "adulto",
      "ae\u0301reo",
      "afectar",
      "aficio\u0301n",
      "afinar",
      "afirmar",
      "a\u0301gil",
      "agitar",
      "agoni\u0301a",
      "agosto",
      "agotar",
      "agregar",
      "agrio",
      "agua",
      "agudo",
      "a\u0301guila",
      "aguja",
      "ahogo",
      "ahorro",
      "aire",
      "aislar",
      "ajedrez",
      "ajeno",
      "ajuste",
      "alacra\u0301n",
      "alambre",
      "alarma",
      "alba",
      "a\u0301lbum",
      "alcalde",
      "aldea",
      "alegre",
      "alejar",
      "alerta",
      "aleta",
      "alfiler",
      "alga",
      "algodo\u0301n",
      "aliado",
      "aliento",
      "alivio",
      "alma",
      "almeja",
      "almi\u0301bar",
      "altar",
      "alteza",
      "altivo",
      "alto",
      "altura",
      "alumno",
      "alzar",
      "amable",
      "amante",
      "amapola",
      "amargo",
      "amasar",
      "a\u0301mbar",
      "a\u0301mbito",
      "ameno",
      "amigo",
      "amistad",
      "amor",
      "amparo",
      "amplio",
      "ancho",
      "anciano",
      "ancla",
      "andar",
      "ande\u0301n",
      "anemia",
      "a\u0301ngulo",
      "anillo",
      "a\u0301nimo",
      "ani\u0301s",
      "anotar",
      "antena",
      "antiguo",
      "antojo",
      "anual",
      "anular",
      "anuncio",
      "an\u0303adir",
      "an\u0303ejo",
      "an\u0303o",
      "apagar",
      "aparato",
      "apetito",
      "apio",
      "aplicar",
      "apodo",
      "aporte",
      "apoyo",
      "aprender",
      "aprobar",
      "apuesta",
      "apuro",
      "arado",
      "aran\u0303a",
      "arar",
      "a\u0301rbitro",
      "a\u0301rbol",
      "arbusto",
      "archivo",
      "arco",
      "arder",
      "ardilla",
      "arduo",
      "a\u0301rea",
      "a\u0301rido",
      "aries",
      "armoni\u0301a",
      "arne\u0301s",
      "aroma",
      "arpa",
      "arpo\u0301n",
      "arreglo",
      "arroz",
      "arruga",
      "arte",
      "artista",
      "asa",
      "asado",
      "asalto",
      "ascenso",
      "asegurar",
      "aseo",
      "asesor",
      "asiento",
      "asilo",
      "asistir",
      "asno",
      "asombro",
      "a\u0301spero",
      "astilla",
      "astro",
      "astuto",
      "asumir",
      "asunto",
      "atajo",
      "ataque",
      "atar",
      "atento",
      "ateo",
      "a\u0301tico",
      "atleta",
      "a\u0301tomo",
      "atraer",
      "atroz",
      "atu\u0301n",
      "audaz",
      "audio",
      "auge",
      "aula",
      "aumento",
      "ausente",
      "autor",
      "aval",
      "avance",
      "avaro",
      "ave",
      "avellana",
      "avena",
      "avestruz",
      "avio\u0301n",
      "aviso",
      "ayer",
      "ayuda",
      "ayuno",
      "azafra\u0301n",
      "azar",
      "azote",
      "azu\u0301car",
      "azufre",
      "azul",
      "baba",
      "babor",
      "bache",
      "bahi\u0301a",
      "baile",
      "bajar",
      "balanza",
      "balco\u0301n",
      "balde",
      "bambu\u0301",
      "banco",
      "banda",
      "ban\u0303o",
      "barba",
      "barco",
      "barniz",
      "barro",
      "ba\u0301scula",
      "basto\u0301n",
      "basura",
      "batalla",
      "bateri\u0301a",
      "batir",
      "batuta",
      "bau\u0301l",
      "bazar",
      "bebe\u0301",
      "bebida",
      "bello",
      "besar",
      "beso",
      "bestia",
      "bicho",
      "bien",
      "bingo",
      "blanco",
      "bloque",
      "blusa",
      "boa",
      "bobina",
      "bobo",
      "boca",
      "bocina",
      "boda",
      "bodega",
      "boina",
      "bola",
      "bolero",
      "bolsa",
      "bomba",
      "bondad",
      "bonito",
      "bono",
      "bonsa\u0301i",
      "borde",
      "borrar",
      "bosque",
      "bote",
      "boti\u0301n",
      "bo\u0301veda",
      "bozal",
      "bravo",
      "brazo",
      "brecha",
      "breve",
      "brillo",
      "brinco",
      "brisa",
      "broca",
      "broma",
      "bronce",
      "brote",
      "bruja",
      "brusco",
      "bruto",
      "buceo",
      "bucle",
      "bueno",
      "buey",
      "bufanda",
      "bufo\u0301n",
      "bu\u0301ho",
      "buitre",
      "bulto",
      "burbuja",
      "burla",
      "burro",
      "buscar",
      "butaca",
      "buzo\u0301n",
      "caballo",
      "cabeza",
      "cabina",
      "cabra",
      "cacao",
      "cada\u0301ver",
      "cadena",
      "caer",
      "cafe\u0301",
      "cai\u0301da",
      "caima\u0301n",
      "caja",
      "cajo\u0301n",
      "cal",
      "calamar",
      "calcio",
      "caldo",
      "calidad",
      "calle",
      "calma",
      "calor",
      "calvo",
      "cama",
      "cambio",
      "camello",
      "camino",
      "campo",
      "ca\u0301ncer",
      "candil",
      "canela",
      "canguro",
      "canica",
      "canto",
      "can\u0303a",
      "can\u0303o\u0301n",
      "caoba",
      "caos",
      "capaz",
      "capita\u0301n",
      "capote",
      "captar",
      "capucha",
      "cara",
      "carbo\u0301n",
      "ca\u0301rcel",
      "careta",
      "carga",
      "carin\u0303o",
      "carne",
      "carpeta",
      "carro",
      "carta",
      "casa",
      "casco",
      "casero",
      "caspa",
      "castor",
      "catorce",
      "catre",
      "caudal",
      "causa",
      "cazo",
      "cebolla",
      "ceder",
      "cedro",
      "celda",
      "ce\u0301lebre",
      "celoso",
      "ce\u0301lula",
      "cemento",
      "ceniza",
      "centro",
      "cerca",
      "cerdo",
      "cereza",
      "cero",
      "cerrar",
      "certeza",
      "ce\u0301sped",
      "cetro",
      "chacal",
      "chaleco",
      "champu\u0301",
      "chancla",
      "chapa",
      "charla",
      "chico",
      "chiste",
      "chivo",
      "choque",
      "choza",
      "chuleta",
      "chupar",
      "ciclo\u0301n",
      "ciego",
      "cielo",
      "cien",
      "cierto",
      "cifra",
      "cigarro",
      "cima",
      "cinco",
      "cine",
      "cinta",
      "cipre\u0301s",
      "circo",
      "ciruela",
      "cisne",
      "cita",
      "ciudad",
      "clamor",
      "clan",
      "claro",
      "clase",
      "clave",
      "cliente",
      "clima",
      "cli\u0301nica",
      "cobre",
      "coccio\u0301n",
      "cochino",
      "cocina",
      "coco",
      "co\u0301digo",
      "codo",
      "cofre",
      "coger",
      "cohete",
      "coji\u0301n",
      "cojo",
      "cola",
      "colcha",
      "colegio",
      "colgar",
      "colina",
      "collar",
      "colmo",
      "columna",
      "combate",
      "comer",
      "comida",
      "co\u0301modo",
      "compra",
      "conde",
      "conejo",
      "conga",
      "conocer",
      "consejo",
      "contar",
      "copa",
      "copia",
      "corazo\u0301n",
      "corbata",
      "corcho",
      "cordo\u0301n",
      "corona",
      "correr",
      "coser",
      "cosmos",
      "costa",
      "cra\u0301neo",
      "cra\u0301ter",
      "crear",
      "crecer",
      "crei\u0301do",
      "crema",
      "cri\u0301a",
      "crimen",
      "cripta",
      "crisis",
      "cromo",
      "cro\u0301nica",
      "croqueta",
      "crudo",
      "cruz",
      "cuadro",
      "cuarto",
      "cuatro",
      "cubo",
      "cubrir",
      "cuchara",
      "cuello",
      "cuento",
      "cuerda",
      "cuesta",
      "cueva",
      "cuidar",
      "culebra",
      "culpa",
      "culto",
      "cumbre",
      "cumplir",
      "cuna",
      "cuneta",
      "cuota",
      "cupo\u0301n",
      "cu\u0301pula",
      "curar",
      "curioso",
      "curso",
      "curva",
      "cutis",
      "dama",
      "danza",
      "dar",
      "dardo",
      "da\u0301til",
      "deber",
      "de\u0301bil",
      "de\u0301cada",
      "decir",
      "dedo",
      "defensa",
      "definir",
      "dejar",
      "delfi\u0301n",
      "delgado",
      "delito",
      "demora",
      "denso",
      "dental",
      "deporte",
      "derecho",
      "derrota",
      "desayuno",
      "deseo",
      "desfile",
      "desnudo",
      "destino",
      "desvi\u0301o",
      "detalle",
      "detener",
      "deuda",
      "di\u0301a",
      "diablo",
      "diadema",
      "diamante",
      "diana",
      "diario",
      "dibujo",
      "dictar",
      "diente",
      "dieta",
      "diez",
      "difi\u0301cil",
      "digno",
      "dilema",
      "diluir",
      "dinero",
      "directo",
      "dirigir",
      "disco",
      "disen\u0303o",
      "disfraz",
      "diva",
      "divino",
      "doble",
      "doce",
      "dolor",
      "domingo",
      "don",
      "donar",
      "dorado",
      "dormir",
      "dorso",
      "dos",
      "dosis",
      "drago\u0301n",
      "droga",
      "ducha",
      "duda",
      "duelo",
      "duen\u0303o",
      "dulce",
      "du\u0301o",
      "duque",
      "durar",
      "dureza",
      "duro",
      "e\u0301bano",
      "ebrio",
      "echar",
      "eco",
      "ecuador",
      "edad",
      "edicio\u0301n",
      "edificio",
      "editor",
      "educar",
      "efecto",
      "eficaz",
      "eje",
      "ejemplo",
      "elefante",
      "elegir",
      "elemento",
      "elevar",
      "elipse",
      "e\u0301lite",
      "elixir",
      "elogio",
      "eludir",
      "embudo",
      "emitir",
      "emocio\u0301n",
      "empate",
      "empen\u0303o",
      "empleo",
      "empresa",
      "enano",
      "encargo",
      "enchufe",
      "enci\u0301a",
      "enemigo",
      "enero",
      "enfado",
      "enfermo",
      "engan\u0303o",
      "enigma",
      "enlace",
      "enorme",
      "enredo",
      "ensayo",
      "ensen\u0303ar",
      "entero",
      "entrar",
      "envase",
      "envi\u0301o",
      "e\u0301poca",
      "equipo",
      "erizo",
      "escala",
      "escena",
      "escolar",
      "escribir",
      "escudo",
      "esencia",
      "esfera",
      "esfuerzo",
      "espada",
      "espejo",
      "espi\u0301a",
      "esposa",
      "espuma",
      "esqui\u0301",
      "estar",
      "este",
      "estilo",
      "estufa",
      "etapa",
      "eterno",
      "e\u0301tica",
      "etnia",
      "evadir",
      "evaluar",
      "evento",
      "evitar",
      "exacto",
      "examen",
      "exceso",
      "excusa",
      "exento",
      "exigir",
      "exilio",
      "existir",
      "e\u0301xito",
      "experto",
      "explicar",
      "exponer",
      "extremo",
      "fa\u0301brica",
      "fa\u0301bula",
      "fachada",
      "fa\u0301cil",
      "factor",
      "faena",
      "faja",
      "falda",
      "fallo",
      "falso",
      "faltar",
      "fama",
      "familia",
      "famoso",
      "farao\u0301n",
      "farmacia",
      "farol",
      "farsa",
      "fase",
      "fatiga",
      "fauna",
      "favor",
      "fax",
      "febrero",
      "fecha",
      "feliz",
      "feo",
      "feria",
      "feroz",
      "fe\u0301rtil",
      "fervor",
      "festi\u0301n",
      "fiable",
      "fianza",
      "fiar",
      "fibra",
      "ficcio\u0301n",
      "ficha",
      "fideo",
      "fiebre",
      "fiel",
      "fiera",
      "fiesta",
      "figura",
      "fijar",
      "fijo",
      "fila",
      "filete",
      "filial",
      "filtro",
      "fin",
      "finca",
      "fingir",
      "finito",
      "firma",
      "flaco",
      "flauta",
      "flecha",
      "flor",
      "flota",
      "fluir",
      "flujo",
      "flu\u0301or",
      "fobia",
      "foca",
      "fogata",
      "fogo\u0301n",
      "folio",
      "folleto",
      "fondo",
      "forma",
      "forro",
      "fortuna",
      "forzar",
      "fosa",
      "foto",
      "fracaso",
      "fra\u0301gil",
      "franja",
      "frase",
      "fraude",
      "frei\u0301r",
      "freno",
      "fresa",
      "fri\u0301o",
      "frito",
      "fruta",
      "fuego",
      "fuente",
      "fuerza",
      "fuga",
      "fumar",
      "funcio\u0301n",
      "funda",
      "furgo\u0301n",
      "furia",
      "fusil",
      "fu\u0301tbol",
      "futuro",
      "gacela",
      "gafas",
      "gaita",
      "gajo",
      "gala",
      "galeri\u0301a",
      "gallo",
      "gamba",
      "ganar",
      "gancho",
      "ganga",
      "ganso",
      "garaje",
      "garza",
      "gasolina",
      "gastar",
      "gato",
      "gavila\u0301n",
      "gemelo",
      "gemir",
      "gen",
      "ge\u0301nero",
      "genio",
      "gente",
      "geranio",
      "gerente",
      "germen",
      "gesto",
      "gigante",
      "gimnasio",
      "girar",
      "giro",
      "glaciar",
      "globo",
      "gloria",
      "gol",
      "golfo",
      "goloso",
      "golpe",
      "goma",
      "gordo",
      "gorila",
      "gorra",
      "gota",
      "goteo",
      "gozar",
      "grada",
      "gra\u0301fico",
      "grano",
      "grasa",
      "gratis",
      "grave",
      "grieta",
      "grillo",
      "gripe",
      "gris",
      "grito",
      "grosor",
      "gru\u0301a",
      "grueso",
      "grumo",
      "grupo",
      "guante",
      "guapo",
      "guardia",
      "guerra",
      "gui\u0301a",
      "guin\u0303o",
      "guion",
      "guiso",
      "guitarra",
      "gusano",
      "gustar",
      "haber",
      "ha\u0301bil",
      "hablar",
      "hacer",
      "hacha",
      "hada",
      "hallar",
      "hamaca",
      "harina",
      "haz",
      "hazan\u0303a",
      "hebilla",
      "hebra",
      "hecho",
      "helado",
      "helio",
      "hembra",
      "herir",
      "hermano",
      "he\u0301roe",
      "hervir",
      "hielo",
      "hierro",
      "hi\u0301gado",
      "higiene",
      "hijo",
      "himno",
      "historia",
      "hocico",
      "hogar",
      "hoguera",
      "hoja",
      "hombre",
      "hongo",
      "honor",
      "honra",
      "hora",
      "hormiga",
      "horno",
      "hostil",
      "hoyo",
      "hueco",
      "huelga",
      "huerta",
      "hueso",
      "huevo",
      "huida",
      "huir",
      "humano",
      "hu\u0301medo",
      "humilde",
      "humo",
      "hundir",
      "huraca\u0301n",
      "hurto",
      "icono",
      "ideal",
      "idioma",
      "i\u0301dolo",
      "iglesia",
      "iglu\u0301",
      "igual",
      "ilegal",
      "ilusio\u0301n",
      "imagen",
      "ima\u0301n",
      "imitar",
      "impar",
      "imperio",
      "imponer",
      "impulso",
      "incapaz",
      "i\u0301ndice",
      "inerte",
      "infiel",
      "informe",
      "ingenio",
      "inicio",
      "inmenso",
      "inmune",
      "innato",
      "insecto",
      "instante",
      "intere\u0301s",
      "i\u0301ntimo",
      "intuir",
      "inu\u0301til",
      "invierno",
      "ira",
      "iris",
      "ironi\u0301a",
      "isla",
      "islote",
      "jabali\u0301",
      "jabo\u0301n",
      "jamo\u0301n",
      "jarabe",
      "jardi\u0301n",
      "jarra",
      "jaula",
      "jazmi\u0301n",
      "jefe",
      "jeringa",
      "jinete",
      "jornada",
      "joroba",
      "joven",
      "joya",
      "juerga",
      "jueves",
      "juez",
      "jugador",
      "jugo",
      "juguete",
      "juicio",
      "junco",
      "jungla",
      "junio",
      "juntar",
      "ju\u0301piter",
      "jurar",
      "justo",
      "juvenil",
      "juzgar",
      "kilo",
      "koala",
      "labio",
      "lacio",
      "lacra",
      "lado",
      "ladro\u0301n",
      "lagarto",
      "la\u0301grima",
      "laguna",
      "laico",
      "lamer",
      "la\u0301mina",
      "la\u0301mpara",
      "lana",
      "lancha",
      "langosta",
      "lanza",
      "la\u0301piz",
      "largo",
      "larva",
      "la\u0301stima",
      "lata",
      "la\u0301tex",
      "latir",
      "laurel",
      "lavar",
      "lazo",
      "leal",
      "leccio\u0301n",
      "leche",
      "lector",
      "leer",
      "legio\u0301n",
      "legumbre",
      "lejano",
      "lengua",
      "lento",
      "len\u0303a",
      "leo\u0301n",
      "leopardo",
      "lesio\u0301n",
      "letal",
      "letra",
      "leve",
      "leyenda",
      "libertad",
      "libro",
      "licor",
      "li\u0301der",
      "lidiar",
      "lienzo",
      "liga",
      "ligero",
      "lima",
      "li\u0301mite",
      "limo\u0301n",
      "limpio",
      "lince",
      "lindo",
      "li\u0301nea",
      "lingote",
      "lino",
      "linterna",
      "li\u0301quido",
      "liso",
      "lista",
      "litera",
      "litio",
      "litro",
      "llaga",
      "llama",
      "llanto",
      "llave",
      "llegar",
      "llenar",
      "llevar",
      "llorar",
      "llover",
      "lluvia",
      "lobo",
      "locio\u0301n",
      "loco",
      "locura",
      "lo\u0301gica",
      "logro",
      "lombriz",
      "lomo",
      "lonja",
      "lote",
      "lucha",
      "lucir",
      "lugar",
      "lujo",
      "luna",
      "lunes",
      "lupa",
      "lustro",
      "luto",
      "luz",
      "maceta",
      "macho",
      "madera",
      "madre",
      "maduro",
      "maestro",
      "mafia",
      "magia",
      "mago",
      "mai\u0301z",
      "maldad",
      "maleta",
      "malla",
      "malo",
      "mama\u0301",
      "mambo",
      "mamut",
      "manco",
      "mando",
      "manejar",
      "manga",
      "maniqui\u0301",
      "manjar",
      "mano",
      "manso",
      "manta",
      "man\u0303ana",
      "mapa",
      "ma\u0301quina",
      "mar",
      "marco",
      "marea",
      "marfil",
      "margen",
      "marido",
      "ma\u0301rmol",
      "marro\u0301n",
      "martes",
      "marzo",
      "masa",
      "ma\u0301scara",
      "masivo",
      "matar",
      "materia",
      "matiz",
      "matriz",
      "ma\u0301ximo",
      "mayor",
      "mazorca",
      "mecha",
      "medalla",
      "medio",
      "me\u0301dula",
      "mejilla",
      "mejor",
      "melena",
      "melo\u0301n",
      "memoria",
      "menor",
      "mensaje",
      "mente",
      "menu\u0301",
      "mercado",
      "merengue",
      "me\u0301rito",
      "mes",
      "meso\u0301n",
      "meta",
      "meter",
      "me\u0301todo",
      "metro",
      "mezcla",
      "miedo",
      "miel",
      "miembro",
      "miga",
      "mil",
      "milagro",
      "militar",
      "millo\u0301n",
      "mimo",
      "mina",
      "minero",
      "mi\u0301nimo",
      "minuto",
      "miope",
      "mirar",
      "misa",
      "miseria",
      "misil",
      "mismo",
      "mitad",
      "mito",
      "mochila",
      "mocio\u0301n",
      "moda",
      "modelo",
      "moho",
      "mojar",
      "molde",
      "moler",
      "molino",
      "momento",
      "momia",
      "monarca",
      "moneda",
      "monja",
      "monto",
      "mon\u0303o",
      "morada",
      "morder",
      "moreno",
      "morir",
      "morro",
      "morsa",
      "mortal",
      "mosca",
      "mostrar",
      "motivo",
      "mover",
      "mo\u0301vil",
      "mozo",
      "mucho",
      "mudar",
      "mueble",
      "muela",
      "muerte",
      "muestra",
      "mugre",
      "mujer",
      "mula",
      "muleta",
      "multa",
      "mundo",
      "mun\u0303eca",
      "mural",
      "muro",
      "mu\u0301sculo",
      "museo",
      "musgo",
      "mu\u0301sica",
      "muslo",
      "na\u0301car",
      "nacio\u0301n",
      "nadar",
      "naipe",
      "naranja",
      "nariz",
      "narrar",
      "nasal",
      "natal",
      "nativo",
      "natural",
      "na\u0301usea",
      "naval",
      "nave",
      "navidad",
      "necio",
      "ne\u0301ctar",
      "negar",
      "negocio",
      "negro",
      "neo\u0301n",
      "nervio",
      "neto",
      "neutro",
      "nevar",
      "nevera",
      "nicho",
      "nido",
      "niebla",
      "nieto",
      "nin\u0303ez",
      "nin\u0303o",
      "ni\u0301tido",
      "nivel",
      "nobleza",
      "noche",
      "no\u0301mina",
      "noria",
      "norma",
      "norte",
      "nota",
      "noticia",
      "novato",
      "novela",
      "novio",
      "nube",
      "nuca",
      "nu\u0301cleo",
      "nudillo",
      "nudo",
      "nuera",
      "nueve",
      "nuez",
      "nulo",
      "nu\u0301mero",
      "nutria",
      "oasis",
      "obeso",
      "obispo",
      "objeto",
      "obra",
      "obrero",
      "observar",
      "obtener",
      "obvio",
      "oca",
      "ocaso",
      "oce\u0301ano",
      "ochenta",
      "ocho",
      "ocio",
      "ocre",
      "octavo",
      "octubre",
      "oculto",
      "ocupar",
      "ocurrir",
      "odiar",
      "odio",
      "odisea",
      "oeste",
      "ofensa",
      "oferta",
      "oficio",
      "ofrecer",
      "ogro",
      "oi\u0301do",
      "oi\u0301r",
      "ojo",
      "ola",
      "oleada",
      "olfato",
      "olivo",
      "olla",
      "olmo",
      "olor",
      "olvido",
      "ombligo",
      "onda",
      "onza",
      "opaco",
      "opcio\u0301n",
      "o\u0301pera",
      "opinar",
      "oponer",
      "optar",
      "o\u0301ptica",
      "opuesto",
      "oracio\u0301n",
      "orador",
      "oral",
      "o\u0301rbita",
      "orca",
      "orden",
      "oreja",
      "o\u0301rgano",
      "orgi\u0301a",
      "orgullo",
      "oriente",
      "origen",
      "orilla",
      "oro",
      "orquesta",
      "oruga",
      "osadi\u0301a",
      "oscuro",
      "osezno",
      "oso",
      "ostra",
      "oton\u0303o",
      "otro",
      "oveja",
      "o\u0301vulo",
      "o\u0301xido",
      "oxi\u0301geno",
      "oyente",
      "ozono",
      "pacto",
      "padre",
      "paella",
      "pa\u0301gina",
      "pago",
      "pai\u0301s",
      "pa\u0301jaro",
      "palabra",
      "palco",
      "paleta",
      "pa\u0301lido",
      "palma",
      "paloma",
      "palpar",
      "pan",
      "panal",
      "pa\u0301nico",
      "pantera",
      "pan\u0303uelo",
      "papa\u0301",
      "papel",
      "papilla",
      "paquete",
      "parar",
      "parcela",
      "pared",
      "parir",
      "paro",
      "pa\u0301rpado",
      "parque",
      "pa\u0301rrafo",
      "parte",
      "pasar",
      "paseo",
      "pasio\u0301n",
      "paso",
      "pasta",
      "pata",
      "patio",
      "patria",
      "pausa",
      "pauta",
      "pavo",
      "payaso",
      "peato\u0301n",
      "pecado",
      "pecera",
      "pecho",
      "pedal",
      "pedir",
      "pegar",
      "peine",
      "pelar",
      "peldan\u0303o",
      "pelea",
      "peligro",
      "pellejo",
      "pelo",
      "peluca",
      "pena",
      "pensar",
      "pen\u0303o\u0301n",
      "peo\u0301n",
      "peor",
      "pepino",
      "pequen\u0303o",
      "pera",
      "percha",
      "perder",
      "pereza",
      "perfil",
      "perico",
      "perla",
      "permiso",
      "perro",
      "persona",
      "pesa",
      "pesca",
      "pe\u0301simo",
      "pestan\u0303a",
      "pe\u0301talo",
      "petro\u0301leo",
      "pez",
      "pezun\u0303a",
      "picar",
      "picho\u0301n",
      "pie",
      "piedra",
      "pierna",
      "pieza",
      "pijama",
      "pilar",
      "piloto",
      "pimienta",
      "pino",
      "pintor",
      "pinza",
      "pin\u0303a",
      "piojo",
      "pipa",
      "pirata",
      "pisar",
      "piscina",
      "piso",
      "pista",
      "pito\u0301n",
      "pizca",
      "placa",
      "plan",
      "plata",
      "playa",
      "plaza",
      "pleito",
      "pleno",
      "plomo",
      "pluma",
      "plural",
      "pobre",
      "poco",
      "poder",
      "podio",
      "poema",
      "poesi\u0301a",
      "poeta",
      "polen",
      "polici\u0301a",
      "pollo",
      "polvo",
      "pomada",
      "pomelo",
      "pomo",
      "pompa",
      "poner",
      "porcio\u0301n",
      "portal",
      "posada",
      "poseer",
      "posible",
      "poste",
      "potencia",
      "potro",
      "pozo",
      "prado",
      "precoz",
      "pregunta",
      "premio",
      "prensa",
      "preso",
      "previo",
      "primo",
      "pri\u0301ncipe",
      "prisio\u0301n",
      "privar",
      "proa",
      "probar",
      "proceso",
      "producto",
      "proeza",
      "profesor",
      "programa",
      "prole",
      "promesa",
      "pronto",
      "propio",
      "pro\u0301ximo",
      "prueba",
      "pu\u0301blico",
      "puchero",
      "pudor",
      "pueblo",
      "puerta",
      "puesto",
      "pulga",
      "pulir",
      "pulmo\u0301n",
      "pulpo",
      "pulso",
      "puma",
      "punto",
      "pun\u0303al",
      "pun\u0303o",
      "pupa",
      "pupila",
      "pure\u0301",
      "quedar",
      "queja",
      "quemar",
      "querer",
      "queso",
      "quieto",
      "qui\u0301mica",
      "quince",
      "quitar",
      "ra\u0301bano",
      "rabia",
      "rabo",
      "racio\u0301n",
      "radical",
      "rai\u0301z",
      "rama",
      "rampa",
      "rancho",
      "rango",
      "rapaz",
      "ra\u0301pido",
      "rapto",
      "rasgo",
      "raspa",
      "rato",
      "rayo",
      "raza",
      "razo\u0301n",
      "reaccio\u0301n",
      "realidad",
      "reban\u0303o",
      "rebote",
      "recaer",
      "receta",
      "rechazo",
      "recoger",
      "recreo",
      "recto",
      "recurso",
      "red",
      "redondo",
      "reducir",
      "reflejo",
      "reforma",
      "refra\u0301n",
      "refugio",
      "regalo",
      "regir",
      "regla",
      "regreso",
      "rehe\u0301n",
      "reino",
      "rei\u0301r",
      "reja",
      "relato",
      "relevo",
      "relieve",
      "relleno",
      "reloj",
      "remar",
      "remedio",
      "remo",
      "rencor",
      "rendir",
      "renta",
      "reparto",
      "repetir",
      "reposo",
      "reptil",
      "res",
      "rescate",
      "resina",
      "respeto",
      "resto",
      "resumen",
      "retiro",
      "retorno",
      "retrato",
      "reunir",
      "reve\u0301s",
      "revista",
      "rey",
      "rezar",
      "rico",
      "riego",
      "rienda",
      "riesgo",
      "rifa",
      "ri\u0301gido",
      "rigor",
      "rinco\u0301n",
      "rin\u0303o\u0301n",
      "ri\u0301o",
      "riqueza",
      "risa",
      "ritmo",
      "rito",
      "rizo",
      "roble",
      "roce",
      "rociar",
      "rodar",
      "rodeo",
      "rodilla",
      "roer",
      "rojizo",
      "rojo",
      "romero",
      "romper",
      "ron",
      "ronco",
      "ronda",
      "ropa",
      "ropero",
      "rosa",
      "rosca",
      "rostro",
      "rotar",
      "rubi\u0301",
      "rubor",
      "rudo",
      "rueda",
      "rugir",
      "ruido",
      "ruina",
      "ruleta",
      "rulo",
      "rumbo",
      "rumor",
      "ruptura",
      "ruta",
      "rutina",
      "sa\u0301bado",
      "saber",
      "sabio",
      "sable",
      "sacar",
      "sagaz",
      "sagrado",
      "sala",
      "saldo",
      "salero",
      "salir",
      "salmo\u0301n",
      "salo\u0301n",
      "salsa",
      "salto",
      "salud",
      "salvar",
      "samba",
      "sancio\u0301n",
      "sandi\u0301a",
      "sanear",
      "sangre",
      "sanidad",
      "sano",
      "santo",
      "sapo",
      "saque",
      "sardina",
      "sarte\u0301n",
      "sastre",
      "sata\u0301n",
      "sauna",
      "saxofo\u0301n",
      "seccio\u0301n",
      "seco",
      "secreto",
      "secta",
      "sed",
      "seguir",
      "seis",
      "sello",
      "selva",
      "semana",
      "semilla",
      "senda",
      "sensor",
      "sen\u0303al",
      "sen\u0303or",
      "separar",
      "sepia",
      "sequi\u0301a",
      "ser",
      "serie",
      "sermo\u0301n",
      "servir",
      "sesenta",
      "sesio\u0301n",
      "seta",
      "setenta",
      "severo",
      "sexo",
      "sexto",
      "sidra",
      "siesta",
      "siete",
      "siglo",
      "signo",
      "si\u0301laba",
      "silbar",
      "silencio",
      "silla",
      "si\u0301mbolo",
      "simio",
      "sirena",
      "sistema",
      "sitio",
      "situar",
      "sobre",
      "socio",
      "sodio",
      "sol",
      "solapa",
      "soldado",
      "soledad",
      "so\u0301lido",
      "soltar",
      "solucio\u0301n",
      "sombra",
      "sondeo",
      "sonido",
      "sonoro",
      "sonrisa",
      "sopa",
      "soplar",
      "soporte",
      "sordo",
      "sorpresa",
      "sorteo",
      "soste\u0301n",
      "so\u0301tano",
      "suave",
      "subir",
      "suceso",
      "sudor",
      "suegra",
      "suelo",
      "suen\u0303o",
      "suerte",
      "sufrir",
      "sujeto",
      "sulta\u0301n",
      "sumar",
      "superar",
      "suplir",
      "suponer",
      "supremo",
      "sur",
      "surco",
      "suren\u0303o",
      "surgir",
      "susto",
      "sutil",
      "tabaco",
      "tabique",
      "tabla",
      "tabu\u0301",
      "taco",
      "tacto",
      "tajo",
      "talar",
      "talco",
      "talento",
      "talla",
      "talo\u0301n",
      "taman\u0303o",
      "tambor",
      "tango",
      "tanque",
      "tapa",
      "tapete",
      "tapia",
      "tapo\u0301n",
      "taquilla",
      "tarde",
      "tarea",
      "tarifa",
      "tarjeta",
      "tarot",
      "tarro",
      "tarta",
      "tatuaje",
      "tauro",
      "taza",
      "tazo\u0301n",
      "teatro",
      "techo",
      "tecla",
      "te\u0301cnica",
      "tejado",
      "tejer",
      "tejido",
      "tela",
      "tele\u0301fono",
      "tema",
      "temor",
      "templo",
      "tenaz",
      "tender",
      "tener",
      "tenis",
      "tenso",
      "teori\u0301a",
      "terapia",
      "terco",
      "te\u0301rmino",
      "ternura",
      "terror",
      "tesis",
      "tesoro",
      "testigo",
      "tetera",
      "texto",
      "tez",
      "tibio",
      "tiburo\u0301n",
      "tiempo",
      "tienda",
      "tierra",
      "tieso",
      "tigre",
      "tijera",
      "tilde",
      "timbre",
      "ti\u0301mido",
      "timo",
      "tinta",
      "ti\u0301o",
      "ti\u0301pico",
      "tipo",
      "tira",
      "tiro\u0301n",
      "tita\u0301n",
      "ti\u0301tere",
      "ti\u0301tulo",
      "tiza",
      "toalla",
      "tobillo",
      "tocar",
      "tocino",
      "todo",
      "toga",
      "toldo",
      "tomar",
      "tono",
      "tonto",
      "topar",
      "tope",
      "toque",
      "to\u0301rax",
      "torero",
      "tormenta",
      "torneo",
      "toro",
      "torpedo",
      "torre",
      "torso",
      "tortuga",
      "tos",
      "tosco",
      "toser",
      "to\u0301xico",
      "trabajo",
      "tractor",
      "traer",
      "tra\u0301fico",
      "trago",
      "traje",
      "tramo",
      "trance",
      "trato",
      "trauma",
      "trazar",
      "tre\u0301bol",
      "tregua",
      "treinta",
      "tren",
      "trepar",
      "tres",
      "tribu",
      "trigo",
      "tripa",
      "triste",
      "triunfo",
      "trofeo",
      "trompa",
      "tronco",
      "tropa",
      "trote",
      "trozo",
      "truco",
      "trueno",
      "trufa",
      "tuberi\u0301a",
      "tubo",
      "tuerto",
      "tumba",
      "tumor",
      "tu\u0301nel",
      "tu\u0301nica",
      "turbina",
      "turismo",
      "turno",
      "tutor",
      "ubicar",
      "u\u0301lcera",
      "umbral",
      "unidad",
      "unir",
      "universo",
      "uno",
      "untar",
      "un\u0303a",
      "urbano",
      "urbe",
      "urgente",
      "urna",
      "usar",
      "usuario",
      "u\u0301til",
      "utopi\u0301a",
      "uva",
      "vaca",
      "vaci\u0301o",
      "vacuna",
      "vagar",
      "vago",
      "vaina",
      "vajilla",
      "vale",
      "va\u0301lido",
      "valle",
      "valor",
      "va\u0301lvula",
      "vampiro",
      "vara",
      "variar",
      "varo\u0301n",
      "vaso",
      "vecino",
      "vector",
      "vehi\u0301culo",
      "veinte",
      "vejez",
      "vela",
      "velero",
      "veloz",
      "vena",
      "vencer",
      "venda",
      "veneno",
      "vengar",
      "venir",
      "venta",
      "venus",
      "ver",
      "verano",
      "verbo",
      "verde",
      "vereda",
      "verja",
      "verso",
      "verter",
      "vi\u0301a",
      "viaje",
      "vibrar",
      "vicio",
      "vi\u0301ctima",
      "vida",
      "vi\u0301deo",
      "vidrio",
      "viejo",
      "viernes",
      "vigor",
      "vil",
      "villa",
      "vinagre",
      "vino",
      "vin\u0303edo",
      "violi\u0301n",
      "viral",
      "virgo",
      "virtud",
      "visor",
      "vi\u0301spera",
      "vista",
      "vitamina",
      "viudo",
      "vivaz",
      "vivero",
      "vivir",
      "vivo",
      "volca\u0301n",
      "volumen",
      "volver",
      "voraz",
      "votar",
      "voto",
      "voz",
      "vuelo",
      "vulgar",
      "yacer",
      "yate",
      "yegua",
      "yema",
      "yerno",
      "yeso",
      "yodo",
      "yoga",
      "yogur",
      "zafiro",
      "zanja",
      "zapato",
      "zarza",
      "zona",
      "zorro",
      "zumo",
      "zurdo"
    ];
  }
});

// ../node_modules/bip39/src/wordlists/japanese.json
var require_japanese = __commonJS({
  "../node_modules/bip39/src/wordlists/japanese.json"(exports, module) {
    module.exports = [
      "\u3042\u3044\u3053\u304F\u3057\u3093",
      "\u3042\u3044\u3055\u3064",
      "\u3042\u3044\u305F\u3099",
      "\u3042\u304A\u305D\u3099\u3089",
      "\u3042\u304B\u3061\u3083\u3093",
      "\u3042\u304D\u308B",
      "\u3042\u3051\u304B\u3099\u305F",
      "\u3042\u3051\u308B",
      "\u3042\u3053\u304B\u3099\u308C\u308B",
      "\u3042\u3055\u3044",
      "\u3042\u3055\u3072",
      "\u3042\u3057\u3042\u3068",
      "\u3042\u3057\u3099\u308F\u3046",
      "\u3042\u3059\u3099\u304B\u308B",
      "\u3042\u3059\u3099\u304D",
      "\u3042\u305D\u3075\u3099",
      "\u3042\u305F\u3048\u308B",
      "\u3042\u305F\u305F\u3081\u308B",
      "\u3042\u305F\u308A\u307E\u3048",
      "\u3042\u305F\u308B",
      "\u3042\u3064\u3044",
      "\u3042\u3064\u304B\u3046",
      "\u3042\u3063\u3057\u3085\u304F",
      "\u3042\u3064\u307E\u308A",
      "\u3042\u3064\u3081\u308B",
      "\u3042\u3066\u306A",
      "\u3042\u3066\u306F\u307E\u308B",
      "\u3042\u3072\u308B",
      "\u3042\u3075\u3099\u3089",
      "\u3042\u3075\u3099\u308B",
      "\u3042\u3075\u308C\u308B",
      "\u3042\u307E\u3044",
      "\u3042\u307E\u3068\u3099",
      "\u3042\u307E\u3084\u304B\u3059",
      "\u3042\u307E\u308A",
      "\u3042\u307F\u3082\u306E",
      "\u3042\u3081\u308A\u304B",
      "\u3042\u3084\u307E\u308B",
      "\u3042\u3086\u3080",
      "\u3042\u3089\u3044\u304F\u3099\u307E",
      "\u3042\u3089\u3057",
      "\u3042\u3089\u3059\u3057\u3099",
      "\u3042\u3089\u305F\u3081\u308B",
      "\u3042\u3089\u3086\u308B",
      "\u3042\u3089\u308F\u3059",
      "\u3042\u308A\u304B\u3099\u3068\u3046",
      "\u3042\u308F\u305B\u308B",
      "\u3042\u308F\u3066\u308B",
      "\u3042\u3093\u3044",
      "\u3042\u3093\u304B\u3099\u3044",
      "\u3042\u3093\u3053",
      "\u3042\u3093\u305B\u3099\u3093",
      "\u3042\u3093\u3066\u3044",
      "\u3042\u3093\u306A\u3044",
      "\u3042\u3093\u307E\u308A",
      "\u3044\u3044\u305F\u3099\u3059",
      "\u3044\u304A\u3093",
      "\u3044\u304B\u3099\u3044",
      "\u3044\u304B\u3099\u304F",
      "\u3044\u304D\u304A\u3044",
      "\u3044\u304D\u306A\u308A",
      "\u3044\u304D\u3082\u306E",
      "\u3044\u304D\u308B",
      "\u3044\u304F\u3057\u3099",
      "\u3044\u304F\u3075\u3099\u3093",
      "\u3044\u3051\u306F\u3099\u306A",
      "\u3044\u3051\u3093",
      "\u3044\u3053\u3046",
      "\u3044\u3053\u304F",
      "\u3044\u3053\u3064",
      "\u3044\u3055\u307E\u3057\u3044",
      "\u3044\u3055\u3093",
      "\u3044\u3057\u304D",
      "\u3044\u3057\u3099\u3085\u3046",
      "\u3044\u3057\u3099\u3087\u3046",
      "\u3044\u3057\u3099\u308F\u308B",
      "\u3044\u3059\u3099\u307F",
      "\u3044\u3059\u3099\u308C",
      "\u3044\u305B\u3044",
      "\u3044\u305B\u3048\u3072\u3099",
      "\u3044\u305B\u304B\u3044",
      "\u3044\u305B\u304D",
      "\u3044\u305B\u3099\u3093",
      "\u3044\u305D\u3046\u308D\u3046",
      "\u3044\u305D\u304B\u3099\u3057\u3044",
      "\u3044\u305F\u3099\u3044",
      "\u3044\u305F\u3099\u304F",
      "\u3044\u305F\u3059\u3099\u3089",
      "\u3044\u305F\u307F",
      "\u3044\u305F\u308A\u3042",
      "\u3044\u3061\u304A\u3046",
      "\u3044\u3061\u3057\u3099",
      "\u3044\u3061\u3068\u3099",
      "\u3044\u3061\u306F\u3099",
      "\u3044\u3061\u3075\u3099",
      "\u3044\u3061\u308A\u3085\u3046",
      "\u3044\u3064\u304B",
      "\u3044\u3063\u3057\u3085\u3093",
      "\u3044\u3063\u305B\u3044",
      "\u3044\u3063\u305D\u3046",
      "\u3044\u3063\u305F\u3093",
      "\u3044\u3063\u3061",
      "\u3044\u3063\u3066\u3044",
      "\u3044\u3063\u307B\u309A\u3046",
      "\u3044\u3066\u3055\u3099",
      "\u3044\u3066\u3093",
      "\u3044\u3068\u3099\u3046",
      "\u3044\u3068\u3053",
      "\u3044\u306A\u3044",
      "\u3044\u306A\u304B",
      "\u3044\u306D\u3080\u308A",
      "\u3044\u306E\u3061",
      "\u3044\u306E\u308B",
      "\u3044\u306F\u3064",
      "\u3044\u306F\u3099\u308B",
      "\u3044\u306F\u3093",
      "\u3044\u3072\u3099\u304D",
      "\u3044\u3072\u3093",
      "\u3044\u3075\u304F",
      "\u3044\u3078\u3093",
      "\u3044\u307B\u3046",
      "\u3044\u307F\u3093",
      "\u3044\u3082\u3046\u3068",
      "\u3044\u3082\u305F\u308C",
      "\u3044\u3082\u308A",
      "\u3044\u3084\u304B\u3099\u308B",
      "\u3044\u3084\u3059",
      "\u3044\u3088\u304B\u3093",
      "\u3044\u3088\u304F",
      "\u3044\u3089\u3044",
      "\u3044\u3089\u3059\u3068",
      "\u3044\u308A\u304F\u3099\u3061",
      "\u3044\u308A\u3087\u3046",
      "\u3044\u308C\u3044",
      "\u3044\u308C\u3082\u306E",
      "\u3044\u308C\u308B",
      "\u3044\u308D\u3048\u3093\u3072\u309A\u3064",
      "\u3044\u308F\u3044",
      "\u3044\u308F\u3046",
      "\u3044\u308F\u304B\u3093",
      "\u3044\u308F\u306F\u3099",
      "\u3044\u308F\u3086\u308B",
      "\u3044\u3093\u3051\u3099\u3093\u307E\u3081",
      "\u3044\u3093\u3055\u3064",
      "\u3044\u3093\u3057\u3087\u3046",
      "\u3044\u3093\u3088\u3046",
      "\u3046\u3048\u304D",
      "\u3046\u3048\u308B",
      "\u3046\u304A\u3055\u3099",
      "\u3046\u304B\u3099\u3044",
      "\u3046\u304B\u3075\u3099",
      "\u3046\u304B\u3078\u3099\u308B",
      "\u3046\u304D\u308F",
      "\u3046\u304F\u3089\u3044\u306A",
      "\u3046\u304F\u308C\u308C",
      "\u3046\u3051\u305F\u307E\u308F\u308B",
      "\u3046\u3051\u3064\u3051",
      "\u3046\u3051\u3068\u308B",
      "\u3046\u3051\u3082\u3064",
      "\u3046\u3051\u308B",
      "\u3046\u3053\u3099\u304B\u3059",
      "\u3046\u3053\u3099\u304F",
      "\u3046\u3053\u3093",
      "\u3046\u3055\u304D\u3099",
      "\u3046\u3057\u306A\u3046",
      "\u3046\u3057\u308D\u304B\u3099\u307F",
      "\u3046\u3059\u3044",
      "\u3046\u3059\u304D\u3099",
      "\u3046\u3059\u304F\u3099\u3089\u3044",
      "\u3046\u3059\u3081\u308B",
      "\u3046\u305B\u3064",
      "\u3046\u3061\u3042\u308F\u305B",
      "\u3046\u3061\u304B\u3099\u308F",
      "\u3046\u3061\u304D",
      "\u3046\u3061\u3085\u3046",
      "\u3046\u3063\u304B\u308A",
      "\u3046\u3064\u304F\u3057\u3044",
      "\u3046\u3063\u305F\u3048\u308B",
      "\u3046\u3064\u308B",
      "\u3046\u3068\u3099\u3093",
      "\u3046\u306A\u304D\u3099",
      "\u3046\u306A\u3057\u3099",
      "\u3046\u306A\u3059\u3099\u304F",
      "\u3046\u306A\u308B",
      "\u3046\u306D\u308B",
      "\u3046\u306E\u3046",
      "\u3046\u3075\u3099\u3051\u3099",
      "\u3046\u3075\u3099\u3053\u3099\u3048",
      "\u3046\u307E\u308C\u308B",
      "\u3046\u3081\u308B",
      "\u3046\u3082\u3046",
      "\u3046\u3084\u307E\u3046",
      "\u3046\u3088\u304F",
      "\u3046\u3089\u304B\u3099\u3048\u3059",
      "\u3046\u3089\u304F\u3099\u3061",
      "\u3046\u3089\u306A\u3044",
      "\u3046\u308A\u3042\u3051\u3099",
      "\u3046\u308A\u304D\u308C",
      "\u3046\u308B\u3055\u3044",
      "\u3046\u308C\u3057\u3044",
      "\u3046\u308C\u3086\u304D",
      "\u3046\u308C\u308B",
      "\u3046\u308D\u3053",
      "\u3046\u308F\u304D",
      "\u3046\u308F\u3055",
      "\u3046\u3093\u3053\u3046",
      "\u3046\u3093\u3061\u3093",
      "\u3046\u3093\u3066\u3093",
      "\u3046\u3093\u3068\u3099\u3046",
      "\u3048\u3044\u3048\u3093",
      "\u3048\u3044\u304B\u3099",
      "\u3048\u3044\u304D\u3087\u3046",
      "\u3048\u3044\u3053\u3099",
      "\u3048\u3044\u305B\u3044",
      "\u3048\u3044\u3075\u3099\u3093",
      "\u3048\u3044\u3088\u3046",
      "\u3048\u3044\u308F",
      "\u3048\u304A\u308A",
      "\u3048\u304B\u3099\u304A",
      "\u3048\u304B\u3099\u304F",
      "\u3048\u304D\u305F\u3044",
      "\u3048\u304F\u305B\u308B",
      "\u3048\u3057\u3083\u304F",
      "\u3048\u3059\u3066",
      "\u3048\u3064\u3089\u3093",
      "\u3048\u306E\u304F\u3099",
      "\u3048\u307B\u3046\u307E\u304D",
      "\u3048\u307B\u3093",
      "\u3048\u307E\u304D",
      "\u3048\u3082\u3057\u3099",
      "\u3048\u3082\u306E",
      "\u3048\u3089\u3044",
      "\u3048\u3089\u3075\u3099",
      "\u3048\u308A\u3042",
      "\u3048\u3093\u3048\u3093",
      "\u3048\u3093\u304B\u3044",
      "\u3048\u3093\u304D\u3099",
      "\u3048\u3093\u3051\u3099\u304D",
      "\u3048\u3093\u3057\u3085\u3046",
      "\u3048\u3093\u305B\u3099\u3064",
      "\u3048\u3093\u305D\u304F",
      "\u3048\u3093\u3061\u3087\u3046",
      "\u3048\u3093\u3068\u3064",
      "\u304A\u3044\u304B\u3051\u308B",
      "\u304A\u3044\u3053\u3059",
      "\u304A\u3044\u3057\u3044",
      "\u304A\u3044\u3064\u304F",
      "\u304A\u3046\u3048\u3093",
      "\u304A\u3046\u3055\u307E",
      "\u304A\u3046\u3057\u3099",
      "\u304A\u3046\u305B\u3064",
      "\u304A\u3046\u305F\u3044",
      "\u304A\u3046\u3075\u304F",
      "\u304A\u3046\u3078\u3099\u3044",
      "\u304A\u3046\u3088\u3046",
      "\u304A\u3048\u308B",
      "\u304A\u304A\u3044",
      "\u304A\u304A\u3046",
      "\u304A\u304A\u3068\u3099\u304A\u308A",
      "\u304A\u304A\u3084",
      "\u304A\u304A\u3088\u305D",
      "\u304A\u304B\u3048\u308A",
      "\u304A\u304B\u3059\u3099",
      "\u304A\u304B\u3099\u3080",
      "\u304A\u304B\u308F\u308A",
      "\u304A\u304D\u3099\u306A\u3046",
      "\u304A\u304D\u308B",
      "\u304A\u304F\u3055\u307E",
      "\u304A\u304F\u3057\u3099\u3087\u3046",
      "\u304A\u304F\u308A\u304B\u3099\u306A",
      "\u304A\u304F\u308B",
      "\u304A\u304F\u308C\u308B",
      "\u304A\u3053\u3059",
      "\u304A\u3053\u306A\u3046",
      "\u304A\u3053\u308B",
      "\u304A\u3055\u3048\u308B",
      "\u304A\u3055\u306A\u3044",
      "\u304A\u3055\u3081\u308B",
      "\u304A\u3057\u3044\u308C",
      "\u304A\u3057\u3048\u308B",
      "\u304A\u3057\u3099\u304D\u3099",
      "\u304A\u3057\u3099\u3055\u3093",
      "\u304A\u3057\u3083\u308C",
      "\u304A\u305D\u3089\u304F",
      "\u304A\u305D\u308F\u308B",
      "\u304A\u305F\u304B\u3099\u3044",
      "\u304A\u305F\u304F",
      "\u304A\u305F\u3099\u3084\u304B",
      "\u304A\u3061\u3064\u304F",
      "\u304A\u3063\u3068",
      "\u304A\u3064\u308A",
      "\u304A\u3066\u3099\u304B\u3051",
      "\u304A\u3068\u3057\u3082\u306E",
      "\u304A\u3068\u306A\u3057\u3044",
      "\u304A\u3068\u3099\u308A",
      "\u304A\u3068\u3099\u308D\u304B\u3059",
      "\u304A\u306F\u3099\u3055\u3093",
      "\u304A\u307E\u3044\u308A",
      "\u304A\u3081\u3066\u3099\u3068\u3046",
      "\u304A\u3082\u3044\u3066\u3099",
      "\u304A\u3082\u3046",
      "\u304A\u3082\u305F\u3044",
      "\u304A\u3082\u3061\u3083",
      "\u304A\u3084\u3064",
      "\u304A\u3084\u3086\u3072\u3099",
      "\u304A\u3088\u307B\u3099\u3059",
      "\u304A\u3089\u3093\u305F\u3099",
      "\u304A\u308D\u3059",
      "\u304A\u3093\u304B\u3099\u304F",
      "\u304A\u3093\u3051\u3044",
      "\u304A\u3093\u3057\u3083",
      "\u304A\u3093\u305B\u3093",
      "\u304A\u3093\u305F\u3099\u3093",
      "\u304A\u3093\u3061\u3085\u3046",
      "\u304A\u3093\u3068\u3099\u3051\u3044",
      "\u304B\u3042\u3064",
      "\u304B\u3044\u304B\u3099",
      "\u304B\u3099\u3044\u304D",
      "\u304B\u3099\u3044\u3051\u3093",
      "\u304B\u3099\u3044\u3053\u3046",
      "\u304B\u3044\u3055\u3064",
      "\u304B\u3044\u3057\u3083",
      "\u304B\u3044\u3059\u3044\u3088\u304F",
      "\u304B\u3044\u305B\u3099\u3093",
      "\u304B\u3044\u305D\u3099\u3046\u3068\u3099",
      "\u304B\u3044\u3064\u3046",
      "\u304B\u3044\u3066\u3093",
      "\u304B\u3044\u3068\u3046",
      "\u304B\u3044\u3075\u304F",
      "\u304B\u3099\u3044\u3078\u304D",
      "\u304B\u3044\u307B\u3046",
      "\u304B\u3044\u3088\u3046",
      "\u304B\u3099\u3044\u3089\u3044",
      "\u304B\u3044\u308F",
      "\u304B\u3048\u308B",
      "\u304B\u304A\u308A",
      "\u304B\u304B\u3048\u308B",
      "\u304B\u304B\u3099\u304F",
      "\u304B\u304B\u3099\u3057",
      "\u304B\u304B\u3099\u307F",
      "\u304B\u304F\u3053\u3099",
      "\u304B\u304F\u3068\u304F",
      "\u304B\u3055\u3099\u308B",
      "\u304B\u3099\u305D\u3099\u3046",
      "\u304B\u305F\u3044",
      "\u304B\u305F\u3061",
      "\u304B\u3099\u3061\u3087\u3046",
      "\u304B\u3099\u3063\u304D\u3085\u3046",
      "\u304B\u3099\u3063\u3053\u3046",
      "\u304B\u3099\u3063\u3055\u3093",
      "\u304B\u3099\u3063\u3057\u3087\u3046",
      "\u304B\u306A\u3055\u3099\u308F\u3057",
      "\u304B\u306E\u3046",
      "\u304B\u3099\u306F\u304F",
      "\u304B\u3075\u3099\u304B",
      "\u304B\u307B\u3046",
      "\u304B\u307B\u3053\u3099",
      "\u304B\u307E\u3046",
      "\u304B\u307E\u307B\u3099\u3053",
      "\u304B\u3081\u308C\u304A\u3093",
      "\u304B\u3086\u3044",
      "\u304B\u3088\u3046\u3072\u3099",
      "\u304B\u3089\u3044",
      "\u304B\u308B\u3044",
      "\u304B\u308D\u3046",
      "\u304B\u308F\u304F",
      "\u304B\u308F\u3089",
      "\u304B\u3099\u3093\u304B",
      "\u304B\u3093\u3051\u3044",
      "\u304B\u3093\u3053\u3046",
      "\u304B\u3093\u3057\u3083",
      "\u304B\u3093\u305D\u3046",
      "\u304B\u3093\u305F\u3093",
      "\u304B\u3093\u3061",
      "\u304B\u3099\u3093\u306F\u3099\u308B",
      "\u304D\u3042\u3044",
      "\u304D\u3042\u3064",
      "\u304D\u3044\u308D",
      "\u304D\u3099\u3044\u3093",
      "\u304D\u3046\u3044",
      "\u304D\u3046\u3093",
      "\u304D\u3048\u308B",
      "\u304D\u304A\u3046",
      "\u304D\u304A\u304F",
      "\u304D\u304A\u3061",
      "\u304D\u304A\u3093",
      "\u304D\u304B\u3044",
      "\u304D\u304B\u304F",
      "\u304D\u304B\u3093\u3057\u3083",
      "\u304D\u304D\u3066",
      "\u304D\u304F\u306F\u3099\u308A",
      "\u304D\u304F\u3089\u3051\u3099",
      "\u304D\u3051\u3093\u305B\u3044",
      "\u304D\u3053\u3046",
      "\u304D\u3053\u3048\u308B",
      "\u304D\u3053\u304F",
      "\u304D\u3055\u3044",
      "\u304D\u3055\u304F",
      "\u304D\u3055\u307E",
      "\u304D\u3055\u3089\u304D\u3099",
      "\u304D\u3099\u3057\u3099\u304B\u304B\u3099\u304F",
      "\u304D\u3099\u3057\u304D",
      "\u304D\u3099\u3057\u3099\u305F\u3044\u3051\u3093",
      "\u304D\u3099\u3057\u3099\u306B\u3063\u3066\u3044",
      "\u304D\u3099\u3057\u3099\u3085\u3064\u3057\u3083",
      "\u304D\u3059\u3046",
      "\u304D\u305B\u3044",
      "\u304D\u305B\u304D",
      "\u304D\u305B\u3064",
      "\u304D\u305D\u3046",
      "\u304D\u305D\u3099\u304F",
      "\u304D\u305D\u3099\u3093",
      "\u304D\u305F\u3048\u308B",
      "\u304D\u3061\u3087\u3046",
      "\u304D\u3064\u3048\u3093",
      "\u304D\u3099\u3063\u3061\u308A",
      "\u304D\u3064\u3064\u304D",
      "\u304D\u3064\u306D",
      "\u304D\u3066\u3044",
      "\u304D\u3068\u3099\u3046",
      "\u304D\u3068\u3099\u304F",
      "\u304D\u306A\u3044",
      "\u304D\u306A\u304B\u3099",
      "\u304D\u306A\u3053",
      "\u304D\u306C\u3053\u3099\u3057",
      "\u304D\u306D\u3093",
      "\u304D\u306E\u3046",
      "\u304D\u306E\u3057\u305F",
      "\u304D\u306F\u304F",
      "\u304D\u3072\u3099\u3057\u3044",
      "\u304D\u3072\u3093",
      "\u304D\u3075\u304F",
      "\u304D\u3075\u3099\u3093",
      "\u304D\u307B\u3099\u3046",
      "\u304D\u307B\u3093",
      "\u304D\u307E\u308B",
      "\u304D\u307F\u3064",
      "\u304D\u3080\u3059\u3099\u304B\u3057\u3044",
      "\u304D\u3081\u308B",
      "\u304D\u3082\u305F\u3099\u3081\u3057",
      "\u304D\u3082\u3061",
      "\u304D\u3082\u306E",
      "\u304D\u3083\u304F",
      "\u304D\u3084\u304F",
      "\u304D\u3099\u3085\u3046\u306B\u304F",
      "\u304D\u3088\u3046",
      "\u304D\u3087\u3046\u308A\u3085\u3046",
      "\u304D\u3089\u3044",
      "\u304D\u3089\u304F",
      "\u304D\u308A\u3093",
      "\u304D\u308C\u3044",
      "\u304D\u308C\u3064",
      "\u304D\u308D\u304F",
      "\u304D\u3099\u308D\u3093",
      "\u304D\u308F\u3081\u308B",
      "\u304D\u3099\u3093\u3044\u308D",
      "\u304D\u3093\u304B\u304F\u3057\u3099",
      "\u304D\u3093\u3057\u3099\u3087",
      "\u304D\u3093\u3088\u3046\u3072\u3099",
      "\u304F\u3099\u3042\u3044",
      "\u304F\u3044\u3059\u3099",
      "\u304F\u3046\u304B\u3093",
      "\u304F\u3046\u304D",
      "\u304F\u3046\u304F\u3099\u3093",
      "\u304F\u3046\u3053\u3046",
      "\u304F\u3099\u3046\u305B\u3044",
      "\u304F\u3046\u305D\u3046",
      "\u304F\u3099\u3046\u305F\u3089",
      "\u304F\u3046\u3075\u304F",
      "\u304F\u3046\u307B\u3099",
      "\u304F\u304B\u3093",
      "\u304F\u304D\u3087\u3046",
      "\u304F\u3051\u3099\u3093",
      "\u304F\u3099\u3053\u3046",
      "\u304F\u3055\u3044",
      "\u304F\u3055\u304D",
      "\u304F\u3055\u306F\u3099\u306A",
      "\u304F\u3055\u308B",
      "\u304F\u3057\u3083\u307F",
      "\u304F\u3057\u3087\u3046",
      "\u304F\u3059\u306E\u304D",
      "\u304F\u3059\u308A\u3086\u3072\u3099",
      "\u304F\u305B\u3051\u3099",
      "\u304F\u305B\u3093",
      "\u304F\u3099\u305F\u3044\u3066\u304D",
      "\u304F\u305F\u3099\u3055\u308B",
      "\u304F\u305F\u3072\u3099\u308C\u308B",
      "\u304F\u3061\u3053\u307F",
      "\u304F\u3061\u3055\u304D",
      "\u304F\u3064\u3057\u305F",
      "\u304F\u3099\u3063\u3059\u308A",
      "\u304F\u3064\u308D\u304F\u3099",
      "\u304F\u3068\u3046\u3066\u3093",
      "\u304F\u3068\u3099\u304F",
      "\u304F\u306A\u3093",
      "\u304F\u306D\u304F\u306D",
      "\u304F\u306E\u3046",
      "\u304F\u3075\u3046",
      "\u304F\u307F\u3042\u308F\u305B",
      "\u304F\u307F\u305F\u3066\u308B",
      "\u304F\u3081\u308B",
      "\u304F\u3084\u304F\u3057\u3087",
      "\u304F\u3089\u3059",
      "\u304F\u3089\u3078\u3099\u308B",
      "\u304F\u308B\u307E",
      "\u304F\u308C\u308B",
      "\u304F\u308D\u3046",
      "\u304F\u308F\u3057\u3044",
      "\u304F\u3099\u3093\u304B\u3093",
      "\u304F\u3099\u3093\u3057\u3087\u304F",
      "\u304F\u3099\u3093\u305F\u3044",
      "\u304F\u3099\u3093\u3066",
      "\u3051\u3042\u306A",
      "\u3051\u3044\u304B\u304F",
      "\u3051\u3044\u3051\u3093",
      "\u3051\u3044\u3053",
      "\u3051\u3044\u3055\u3064",
      "\u3051\u3099\u3044\u3057\u3099\u3085\u3064",
      "\u3051\u3044\u305F\u3044",
      "\u3051\u3099\u3044\u306E\u3046\u3057\u3099\u3093",
      "\u3051\u3044\u308C\u304D",
      "\u3051\u3044\u308D",
      "\u3051\u304A\u3068\u3059",
      "\u3051\u304A\u308A\u3082\u306E",
      "\u3051\u3099\u304D\u304B",
      "\u3051\u3099\u304D\u3051\u3099\u3093",
      "\u3051\u3099\u304D\u305F\u3099\u3093",
      "\u3051\u3099\u304D\u3061\u3093",
      "\u3051\u3099\u304D\u3068\u3064",
      "\u3051\u3099\u304D\u306F",
      "\u3051\u3099\u304D\u3084\u304F",
      "\u3051\u3099\u3053\u3046",
      "\u3051\u3099\u3053\u304F\u3057\u3099\u3087\u3046",
      "\u3051\u3099\u3055\u3099\u3044",
      "\u3051\u3055\u304D",
      "\u3051\u3099\u3055\u3099\u3093",
      "\u3051\u3057\u304D",
      "\u3051\u3057\u3053\u3099\u3080",
      "\u3051\u3057\u3087\u3046",
      "\u3051\u3099\u3059\u3068",
      "\u3051\u305F\u306F\u3099",
      "\u3051\u3061\u3083\u3063\u3075\u309A",
      "\u3051\u3061\u3089\u3059",
      "\u3051\u3064\u3042\u3064",
      "\u3051\u3064\u3044",
      "\u3051\u3064\u3048\u304D",
      "\u3051\u3063\u3053\u3093",
      "\u3051\u3064\u3057\u3099\u3087",
      "\u3051\u3063\u305B\u304D",
      "\u3051\u3063\u3066\u3044",
      "\u3051\u3064\u307E\u3064",
      "\u3051\u3099\u3064\u3088\u3046\u3072\u3099",
      "\u3051\u3099\u3064\u308C\u3044",
      "\u3051\u3064\u308D\u3093",
      "\u3051\u3099\u3068\u3099\u304F",
      "\u3051\u3068\u306F\u3099\u3059",
      "\u3051\u3068\u308B",
      "\u3051\u306A\u3051\u3099",
      "\u3051\u306A\u3059",
      "\u3051\u306A\u307F",
      "\u3051\u306C\u304D",
      "\u3051\u3099\u306D\u3064",
      "\u3051\u306D\u3093",
      "\u3051\u306F\u3044",
      "\u3051\u3099\u3072\u3093",
      "\u3051\u3075\u3099\u304B\u3044",
      "\u3051\u3099\u307B\u3099\u304F",
      "\u3051\u307E\u308A",
      "\u3051\u307F\u304B\u308B",
      "\u3051\u3080\u3057",
      "\u3051\u3080\u308A",
      "\u3051\u3082\u306E",
      "\u3051\u3089\u3044",
      "\u3051\u308D\u3051\u308D",
      "\u3051\u308F\u3057\u3044",
      "\u3051\u3093\u3044",
      "\u3051\u3093\u3048\u3064",
      "\u3051\u3093\u304A",
      "\u3051\u3093\u304B",
      "\u3051\u3099\u3093\u304D",
      "\u3051\u3093\u3051\u3099\u3093",
      "\u3051\u3093\u3053\u3046",
      "\u3051\u3093\u3055\u304F",
      "\u3051\u3093\u3057\u3085\u3046",
      "\u3051\u3093\u3059\u3046",
      "\u3051\u3099\u3093\u305D\u3046",
      "\u3051\u3093\u3061\u304F",
      "\u3051\u3093\u3066\u3044",
      "\u3051\u3093\u3068\u3046",
      "\u3051\u3093\u306A\u3044",
      "\u3051\u3093\u306B\u3093",
      "\u3051\u3099\u3093\u3075\u3099\u3064",
      "\u3051\u3093\u307E",
      "\u3051\u3093\u307F\u3093",
      "\u3051\u3093\u3081\u3044",
      "\u3051\u3093\u3089\u3093",
      "\u3051\u3093\u308A",
      "\u3053\u3042\u304F\u307E",
      "\u3053\u3044\u306C",
      "\u3053\u3044\u3072\u3099\u3068",
      "\u3053\u3099\u3046\u3044",
      "\u3053\u3046\u3048\u3093",
      "\u3053\u3046\u304A\u3093",
      "\u3053\u3046\u304B\u3093",
      "\u3053\u3099\u3046\u304D\u3085\u3046",
      "\u3053\u3099\u3046\u3051\u3044",
      "\u3053\u3046\u3053\u3046",
      "\u3053\u3046\u3055\u3044",
      "\u3053\u3046\u3057\u3099",
      "\u3053\u3046\u3059\u3044",
      "\u3053\u3099\u3046\u305B\u3044",
      "\u3053\u3046\u305D\u304F",
      "\u3053\u3046\u305F\u3044",
      "\u3053\u3046\u3061\u3083",
      "\u3053\u3046\u3064\u3046",
      "\u3053\u3046\u3066\u3044",
      "\u3053\u3046\u3068\u3099\u3046",
      "\u3053\u3046\u306A\u3044",
      "\u3053\u3046\u306F\u3044",
      "\u3053\u3099\u3046\u307B\u3046",
      "\u3053\u3099\u3046\u307E\u3093",
      "\u3053\u3046\u3082\u304F",
      "\u3053\u3046\u308A\u3064",
      "\u3053\u3048\u308B",
      "\u3053\u304A\u308A",
      "\u3053\u3099\u304B\u3044",
      "\u3053\u3099\u304B\u3099\u3064",
      "\u3053\u3099\u304B\u3093",
      "\u3053\u304F\u3053\u3099",
      "\u3053\u304F\u3055\u3044",
      "\u3053\u304F\u3068\u3046",
      "\u3053\u304F\u306A\u3044",
      "\u3053\u304F\u306F\u304F",
      "\u3053\u304F\u3099\u307E",
      "\u3053\u3051\u3044",
      "\u3053\u3051\u308B",
      "\u3053\u3053\u306E\u304B",
      "\u3053\u3053\u308D",
      "\u3053\u3055\u3081",
      "\u3053\u3057\u3064",
      "\u3053\u3059\u3046",
      "\u3053\u305B\u3044",
      "\u3053\u305B\u304D",
      "\u3053\u305B\u3099\u3093",
      "\u3053\u305D\u305F\u3099\u3066",
      "\u3053\u305F\u3044",
      "\u3053\u305F\u3048\u308B",
      "\u3053\u305F\u3064",
      "\u3053\u3061\u3087\u3046",
      "\u3053\u3063\u304B",
      "\u3053\u3064\u3053\u3064",
      "\u3053\u3064\u306F\u3099\u3093",
      "\u3053\u3064\u3075\u3099",
      "\u3053\u3066\u3044",
      "\u3053\u3066\u3093",
      "\u3053\u3068\u304B\u3099\u3089",
      "\u3053\u3068\u3057",
      "\u3053\u3068\u306F\u3099",
      "\u3053\u3068\u308A",
      "\u3053\u306A\u3053\u3099\u306A",
      "\u3053\u306D\u3053\u306D",
      "\u3053\u306E\u307E\u307E",
      "\u3053\u306E\u307F",
      "\u3053\u306E\u3088",
      "\u3053\u3099\u306F\u3093",
      "\u3053\u3072\u3064\u3057\u3099",
      "\u3053\u3075\u3046",
      "\u3053\u3075\u3093",
      "\u3053\u307B\u3099\u308C\u308B",
      "\u3053\u3099\u307E\u3042\u3075\u3099\u3089",
      "\u3053\u307E\u304B\u3044",
      "\u3053\u3099\u307E\u3059\u308A",
      "\u3053\u307E\u3064\u306A",
      "\u3053\u307E\u308B",
      "\u3053\u3080\u304D\u3099\u3053",
      "\u3053\u3082\u3057\u3099",
      "\u3053\u3082\u3061",
      "\u3053\u3082\u306E",
      "\u3053\u3082\u3093",
      "\u3053\u3084\u304F",
      "\u3053\u3084\u307E",
      "\u3053\u3086\u3046",
      "\u3053\u3086\u3072\u3099",
      "\u3053\u3088\u3044",
      "\u3053\u3088\u3046",
      "\u3053\u308A\u308B",
      "\u3053\u308C\u304F\u3057\u3087\u3093",
      "\u3053\u308D\u3063\u3051",
      "\u3053\u308F\u3082\u3066",
      "\u3053\u308F\u308C\u308B",
      "\u3053\u3093\u3044\u3093",
      "\u3053\u3093\u304B\u3044",
      "\u3053\u3093\u304D",
      "\u3053\u3093\u3057\u3085\u3046",
      "\u3053\u3093\u3059\u3044",
      "\u3053\u3093\u305F\u3099\u3066",
      "\u3053\u3093\u3068\u3093",
      "\u3053\u3093\u306A\u3093",
      "\u3053\u3093\u3072\u3099\u306B",
      "\u3053\u3093\u307B\u309A\u3093",
      "\u3053\u3093\u307E\u3051",
      "\u3053\u3093\u3084",
      "\u3053\u3093\u308C\u3044",
      "\u3053\u3093\u308F\u304F",
      "\u3055\u3099\u3044\u3048\u304D",
      "\u3055\u3044\u304B\u3044",
      "\u3055\u3044\u304D\u3093",
      "\u3055\u3099\u3044\u3051\u3099\u3093",
      "\u3055\u3099\u3044\u3053",
      "\u3055\u3044\u3057\u3087",
      "\u3055\u3044\u305B\u3044",
      "\u3055\u3099\u3044\u305F\u304F",
      "\u3055\u3099\u3044\u3061\u3085\u3046",
      "\u3055\u3044\u3066\u304D",
      "\u3055\u3099\u3044\u308A\u3087\u3046",
      "\u3055\u3046\u306A",
      "\u3055\u304B\u3044\u3057",
      "\u3055\u304B\u3099\u3059",
      "\u3055\u304B\u306A",
      "\u3055\u304B\u307F\u3061",
      "\u3055\u304B\u3099\u308B",
      "\u3055\u304D\u3099\u3087\u3046",
      "\u3055\u304F\u3057",
      "\u3055\u304F\u3072\u3093",
      "\u3055\u304F\u3089",
      "\u3055\u3053\u304F",
      "\u3055\u3053\u3064",
      "\u3055\u3059\u3099\u304B\u308B",
      "\u3055\u3099\u305B\u304D",
      "\u3055\u305F\u3093",
      "\u3055\u3064\u3048\u3044",
      "\u3055\u3099\u3064\u304A\u3093",
      "\u3055\u3099\u3063\u304B",
      "\u3055\u3099\u3064\u304B\u3099\u304F",
      "\u3055\u3063\u304D\u3087\u304F",
      "\u3055\u3099\u3063\u3057",
      "\u3055\u3064\u3057\u3099\u3093",
      "\u3055\u3099\u3063\u305D\u3046",
      "\u3055\u3064\u305F\u306F\u3099",
      "\u3055\u3064\u307E\u3044\u3082",
      "\u3055\u3066\u3044",
      "\u3055\u3068\u3044\u3082",
      "\u3055\u3068\u3046",
      "\u3055\u3068\u304A\u3084",
      "\u3055\u3068\u3057",
      "\u3055\u3068\u308B",
      "\u3055\u306E\u3046",
      "\u3055\u306F\u3099\u304F",
      "\u3055\u3072\u3099\u3057\u3044",
      "\u3055\u3078\u3099\u3064",
      "\u3055\u307B\u3046",
      "\u3055\u307B\u3068\u3099",
      "\u3055\u307E\u3059",
      "\u3055\u307F\u3057\u3044",
      "\u3055\u307F\u305F\u3099\u308C",
      "\u3055\u3080\u3051",
      "\u3055\u3081\u308B",
      "\u3055\u3084\u3048\u3093\u3068\u3099\u3046",
      "\u3055\u3086\u3046",
      "\u3055\u3088\u3046",
      "\u3055\u3088\u304F",
      "\u3055\u3089\u305F\u3099",
      "\u3055\u3099\u308B\u305D\u306F\u3099",
      "\u3055\u308F\u3084\u304B",
      "\u3055\u308F\u308B",
      "\u3055\u3093\u3044\u3093",
      "\u3055\u3093\u304B",
      "\u3055\u3093\u304D\u3083\u304F",
      "\u3055\u3093\u3053\u3046",
      "\u3055\u3093\u3055\u3044",
      "\u3055\u3099\u3093\u3057\u3087",
      "\u3055\u3093\u3059\u3046",
      "\u3055\u3093\u305B\u3044",
      "\u3055\u3093\u305D",
      "\u3055\u3093\u3061",
      "\u3055\u3093\u307E",
      "\u3055\u3093\u307F",
      "\u3055\u3093\u3089\u3093",
      "\u3057\u3042\u3044",
      "\u3057\u3042\u3051\u3099",
      "\u3057\u3042\u3055\u3063\u3066",
      "\u3057\u3042\u308F\u305B",
      "\u3057\u3044\u304F",
      "\u3057\u3044\u3093",
      "\u3057\u3046\u3061",
      "\u3057\u3048\u3044",
      "\u3057\u304A\u3051",
      "\u3057\u304B\u3044",
      "\u3057\u304B\u304F",
      "\u3057\u3099\u304B\u3093",
      "\u3057\u3053\u3099\u3068",
      "\u3057\u3059\u3046",
      "\u3057\u3099\u305F\u3099\u3044",
      "\u3057\u305F\u3046\u3051",
      "\u3057\u305F\u304D\u3099",
      "\u3057\u305F\u3066",
      "\u3057\u305F\u307F",
      "\u3057\u3061\u3087\u3046",
      "\u3057\u3061\u308A\u3093",
      "\u3057\u3063\u304B\u308A",
      "\u3057\u3064\u3057\u3099",
      "\u3057\u3064\u3082\u3093",
      "\u3057\u3066\u3044",
      "\u3057\u3066\u304D",
      "\u3057\u3066\u3064",
      "\u3057\u3099\u3066\u3093",
      "\u3057\u3099\u3068\u3099\u3046",
      "\u3057\u306A\u304D\u3099\u308C",
      "\u3057\u306A\u3082\u306E",
      "\u3057\u306A\u3093",
      "\u3057\u306D\u307E",
      "\u3057\u306D\u3093",
      "\u3057\u306E\u304F\u3099",
      "\u3057\u306E\u3075\u3099",
      "\u3057\u306F\u3044",
      "\u3057\u306F\u3099\u304B\u308A",
      "\u3057\u306F\u3064",
      "\u3057\u306F\u3089\u3044",
      "\u3057\u306F\u3093",
      "\u3057\u3072\u3087\u3046",
      "\u3057\u3075\u304F",
      "\u3057\u3099\u3075\u3099\u3093",
      "\u3057\u3078\u3044",
      "\u3057\u307B\u3046",
      "\u3057\u307B\u3093",
      "\u3057\u307E\u3046",
      "\u3057\u307E\u308B",
      "\u3057\u307F\u3093",
      "\u3057\u3080\u3051\u308B",
      "\u3057\u3099\u3080\u3057\u3087",
      "\u3057\u3081\u3044",
      "\u3057\u3081\u308B",
      "\u3057\u3082\u3093",
      "\u3057\u3083\u3044\u3093",
      "\u3057\u3083\u3046\u3093",
      "\u3057\u3083\u304A\u3093",
      "\u3057\u3099\u3083\u304B\u3099\u3044\u3082",
      "\u3057\u3084\u304F\u3057\u3087",
      "\u3057\u3083\u304F\u307B\u3046",
      "\u3057\u3083\u3051\u3093",
      "\u3057\u3083\u3053",
      "\u3057\u3083\u3055\u3099\u3044",
      "\u3057\u3083\u3057\u3093",
      "\u3057\u3083\u305B\u3093",
      "\u3057\u3083\u305D\u3046",
      "\u3057\u3083\u305F\u3044",
      "\u3057\u3083\u3061\u3087\u3046",
      "\u3057\u3083\u3063\u304D\u3093",
      "\u3057\u3099\u3083\u307E",
      "\u3057\u3083\u308A\u3093",
      "\u3057\u3083\u308C\u3044",
      "\u3057\u3099\u3086\u3046",
      "\u3057\u3099\u3085\u3046\u3057\u3087",
      "\u3057\u3085\u304F\u306F\u304F",
      "\u3057\u3099\u3085\u3057\u3093",
      "\u3057\u3085\u3063\u305B\u304D",
      "\u3057\u3085\u307F",
      "\u3057\u3085\u3089\u306F\u3099",
      "\u3057\u3099\u3085\u3093\u306F\u3099\u3093",
      "\u3057\u3087\u3046\u304B\u3044",
      "\u3057\u3087\u304F\u305F\u304F",
      "\u3057\u3087\u3063\u3051\u3093",
      "\u3057\u3087\u3068\u3099\u3046",
      "\u3057\u3087\u3082\u3064",
      "\u3057\u3089\u305B\u308B",
      "\u3057\u3089\u3078\u3099\u308B",
      "\u3057\u3093\u304B",
      "\u3057\u3093\u3053\u3046",
      "\u3057\u3099\u3093\u3057\u3099\u3083",
      "\u3057\u3093\u305B\u3044\u3057\u3099",
      "\u3057\u3093\u3061\u304F",
      "\u3057\u3093\u308A\u3093",
      "\u3059\u3042\u3051\u3099",
      "\u3059\u3042\u3057",
      "\u3059\u3042\u306A",
      "\u3059\u3099\u3042\u3093",
      "\u3059\u3044\u3048\u3044",
      "\u3059\u3044\u304B",
      "\u3059\u3044\u3068\u3046",
      "\u3059\u3099\u3044\u3075\u3099\u3093",
      "\u3059\u3044\u3088\u3046\u3072\u3099",
      "\u3059\u3046\u304B\u3099\u304F",
      "\u3059\u3046\u3057\u3099\u3064",
      "\u3059\u3046\u305B\u3093",
      "\u3059\u304A\u3068\u3099\u308A",
      "\u3059\u304D\u307E",
      "\u3059\u304F\u3046",
      "\u3059\u304F\u306A\u3044",
      "\u3059\u3051\u308B",
      "\u3059\u3053\u3099\u3044",
      "\u3059\u3053\u3057",
      "\u3059\u3099\u3055\u3093",
      "\u3059\u3059\u3099\u3057\u3044",
      "\u3059\u3059\u3080",
      "\u3059\u3059\u3081\u308B",
      "\u3059\u3063\u304B\u308A",
      "\u3059\u3099\u3063\u3057\u308A",
      "\u3059\u3099\u3063\u3068",
      "\u3059\u3066\u304D",
      "\u3059\u3066\u308B",
      "\u3059\u306D\u308B",
      "\u3059\u306E\u3053",
      "\u3059\u306F\u305F\u3099",
      "\u3059\u306F\u3099\u3089\u3057\u3044",
      "\u3059\u3099\u3072\u3087\u3046",
      "\u3059\u3099\u3075\u3099\u306C\u308C",
      "\u3059\u3075\u3099\u308A",
      "\u3059\u3075\u308C",
      "\u3059\u3078\u3099\u3066",
      "\u3059\u3078\u3099\u308B",
      "\u3059\u3099\u307B\u3046",
      "\u3059\u307B\u3099\u3093",
      "\u3059\u307E\u3044",
      "\u3059\u3081\u3057",
      "\u3059\u3082\u3046",
      "\u3059\u3084\u304D",
      "\u3059\u3089\u3059\u3089",
      "\u3059\u308B\u3081",
      "\u3059\u308C\u3061\u304B\u3099\u3046",
      "\u3059\u308D\u3063\u3068",
      "\u3059\u308F\u308B",
      "\u3059\u3093\u305B\u3099\u3093",
      "\u3059\u3093\u307B\u309A\u3046",
      "\u305B\u3042\u3075\u3099\u3089",
      "\u305B\u3044\u304B\u3064",
      "\u305B\u3044\u3051\u3099\u3093",
      "\u305B\u3044\u3057\u3099",
      "\u305B\u3044\u3088\u3046",
      "\u305B\u304A\u3046",
      "\u305B\u304B\u3044\u304B\u3093",
      "\u305B\u304D\u306B\u3093",
      "\u305B\u304D\u3080",
      "\u305B\u304D\u3086",
      "\u305B\u304D\u3089\u3093\u3046\u3093",
      "\u305B\u3051\u3093",
      "\u305B\u3053\u3046",
      "\u305B\u3059\u3057\u3099",
      "\u305B\u305F\u3044",
      "\u305B\u305F\u3051",
      "\u305B\u3063\u304B\u304F",
      "\u305B\u3063\u304D\u3083\u304F",
      "\u305B\u3099\u3063\u304F",
      "\u305B\u3063\u3051\u3093",
      "\u305B\u3063\u3053\u3064",
      "\u305B\u3063\u3055\u305F\u304F\u307E",
      "\u305B\u3064\u305D\u3099\u304F",
      "\u305B\u3064\u305F\u3099\u3093",
      "\u305B\u3064\u3066\u3099\u3093",
      "\u305B\u3063\u306F\u309A\u3093",
      "\u305B\u3064\u3072\u3099",
      "\u305B\u3064\u3075\u3099\u3093",
      "\u305B\u3064\u3081\u3044",
      "\u305B\u3064\u308A\u3064",
      "\u305B\u306A\u304B",
      "\u305B\u306E\u3072\u3099",
      "\u305B\u306F\u306F\u3099",
      "\u305B\u3072\u3099\u308D",
      "\u305B\u307B\u3099\u306D",
      "\u305B\u307E\u3044",
      "\u305B\u307E\u308B",
      "\u305B\u3081\u308B",
      "\u305B\u3082\u305F\u308C",
      "\u305B\u308A\u3075",
      "\u305B\u3099\u3093\u3042\u304F",
      "\u305B\u3093\u3044",
      "\u305B\u3093\u3048\u3044",
      "\u305B\u3093\u304B",
      "\u305B\u3093\u304D\u3087",
      "\u305B\u3093\u304F",
      "\u305B\u3093\u3051\u3099\u3093",
      "\u305B\u3099\u3093\u3053\u3099",
      "\u305B\u3093\u3055\u3044",
      "\u305B\u3093\u3057\u3085",
      "\u305B\u3093\u3059\u3044",
      "\u305B\u3093\u305B\u3044",
      "\u305B\u3093\u305D\u3099",
      "\u305B\u3093\u305F\u304F",
      "\u305B\u3093\u3061\u3087\u3046",
      "\u305B\u3093\u3066\u3044",
      "\u305B\u3093\u3068\u3046",
      "\u305B\u3093\u306C\u304D",
      "\u305B\u3093\u306D\u3093",
      "\u305B\u3093\u306F\u309A\u3044",
      "\u305B\u3099\u3093\u3075\u3099",
      "\u305B\u3099\u3093\u307B\u309A\u3046",
      "\u305B\u3093\u3080",
      "\u305B\u3093\u3081\u3093\u3057\u3099\u3087",
      "\u305B\u3093\u3082\u3093",
      "\u305B\u3093\u3084\u304F",
      "\u305B\u3093\u3086\u3046",
      "\u305B\u3093\u3088\u3046",
      "\u305B\u3099\u3093\u3089",
      "\u305B\u3099\u3093\u308A\u3083\u304F",
      "\u305B\u3093\u308C\u3044",
      "\u305B\u3093\u308D",
      "\u305D\u3042\u304F",
      "\u305D\u3044\u3068\u3051\u3099\u308B",
      "\u305D\u3044\u306D",
      "\u305D\u3046\u304B\u3099\u3093\u304D\u3087\u3046",
      "\u305D\u3046\u304D",
      "\u305D\u3046\u3053\u3099",
      "\u305D\u3046\u3057\u3093",
      "\u305D\u3046\u305F\u3099\u3093",
      "\u305D\u3046\u306A\u3093",
      "\u305D\u3046\u3072\u3099",
      "\u305D\u3046\u3081\u3093",
      "\u305D\u3046\u308A",
      "\u305D\u3048\u3082\u306E",
      "\u305D\u3048\u3093",
      "\u305D\u304B\u3099\u3044",
      "\u305D\u3051\u3099\u304D",
      "\u305D\u3053\u3046",
      "\u305D\u3053\u305D\u3053",
      "\u305D\u3055\u3099\u3044",
      "\u305D\u3057\u306A",
      "\u305D\u305B\u3044",
      "\u305D\u305B\u3093",
      "\u305D\u305D\u304F\u3099",
      "\u305D\u305F\u3099\u3066\u308B",
      "\u305D\u3064\u3046",
      "\u305D\u3064\u3048\u3093",
      "\u305D\u3063\u304B\u3093",
      "\u305D\u3064\u304D\u3099\u3087\u3046",
      "\u305D\u3063\u3051\u3064",
      "\u305D\u3063\u3053\u3046",
      "\u305D\u3063\u305B\u3093",
      "\u305D\u3063\u3068",
      "\u305D\u3068\u304B\u3099\u308F",
      "\u305D\u3068\u3064\u3099\u3089",
      "\u305D\u306A\u3048\u308B",
      "\u305D\u306A\u305F",
      "\u305D\u3075\u307B\u3099",
      "\u305D\u307B\u3099\u304F",
      "\u305D\u307B\u3099\u308D",
      "\u305D\u307E\u3064",
      "\u305D\u307E\u308B",
      "\u305D\u3080\u304F",
      "\u305D\u3080\u308A\u3048",
      "\u305D\u3081\u308B",
      "\u305D\u3082\u305D\u3082",
      "\u305D\u3088\u304B\u305B\u3099",
      "\u305D\u3089\u307E\u3081",
      "\u305D\u308D\u3046",
      "\u305D\u3093\u304B\u3044",
      "\u305D\u3093\u3051\u3044",
      "\u305D\u3093\u3055\u3099\u3044",
      "\u305D\u3093\u3057\u3064",
      "\u305D\u3093\u305D\u3099\u304F",
      "\u305D\u3093\u3061\u3087\u3046",
      "\u305D\u3099\u3093\u3072\u3099",
      "\u305D\u3099\u3093\u3075\u3099\u3093",
      "\u305D\u3093\u307F\u3093",
      "\u305F\u3042\u3044",
      "\u305F\u3044\u3044\u3093",
      "\u305F\u3044\u3046\u3093",
      "\u305F\u3044\u3048\u304D",
      "\u305F\u3044\u304A\u3046",
      "\u305F\u3099\u3044\u304B\u3099\u304F",
      "\u305F\u3044\u304D",
      "\u305F\u3044\u304F\u3099\u3046",
      "\u305F\u3044\u3051\u3093",
      "\u305F\u3044\u3053",
      "\u305F\u3044\u3055\u3099\u3044",
      "\u305F\u3099\u3044\u3057\u3099\u3087\u3046\u3075\u3099",
      "\u305F\u3099\u3044\u3059\u304D",
      "\u305F\u3044\u305B\u3064",
      "\u305F\u3044\u305D\u3046",
      "\u305F\u3099\u3044\u305F\u3044",
      "\u305F\u3044\u3061\u3087\u3046",
      "\u305F\u3044\u3066\u3044",
      "\u305F\u3099\u3044\u3068\u3099\u3053\u308D",
      "\u305F\u3044\u306A\u3044",
      "\u305F\u3044\u306D\u3064",
      "\u305F\u3044\u306E\u3046",
      "\u305F\u3044\u306F\u3093",
      "\u305F\u3099\u3044\u3072\u3087\u3046",
      "\u305F\u3044\u3075\u3046",
      "\u305F\u3044\u3078\u3093",
      "\u305F\u3044\u307B",
      "\u305F\u3044\u307E\u3064\u306F\u3099\u306A",
      "\u305F\u3044\u307F\u3093\u304F\u3099",
      "\u305F\u3044\u3080",
      "\u305F\u3044\u3081\u3093",
      "\u305F\u3044\u3084\u304D",
      "\u305F\u3044\u3088\u3046",
      "\u305F\u3044\u3089",
      "\u305F\u3044\u308A\u3087\u304F",
      "\u305F\u3044\u308B",
      "\u305F\u3044\u308F\u3093",
      "\u305F\u3046\u3048",
      "\u305F\u3048\u308B",
      "\u305F\u304A\u3059",
      "\u305F\u304A\u308B",
      "\u305F\u304A\u308C\u308B",
      "\u305F\u304B\u3044",
      "\u305F\u304B\u306D",
      "\u305F\u304D\u3072\u3099",
      "\u305F\u304F\u3055\u3093",
      "\u305F\u3053\u304F",
      "\u305F\u3053\u3084\u304D",
      "\u305F\u3055\u3044",
      "\u305F\u3057\u3055\u3099\u3093",
      "\u305F\u3099\u3057\u3099\u3083\u308C",
      "\u305F\u3059\u3051\u308B",
      "\u305F\u3059\u3099\u3055\u308F\u308B",
      "\u305F\u305D\u304B\u3099\u308C",
      "\u305F\u305F\u304B\u3046",
      "\u305F\u305F\u304F",
      "\u305F\u305F\u3099\u3057\u3044",
      "\u305F\u305F\u307F",
      "\u305F\u3061\u306F\u3099\u306A",
      "\u305F\u3099\u3063\u304B\u3044",
      "\u305F\u3099\u3063\u304D\u3083\u304F",
      "\u305F\u3099\u3063\u3053",
      "\u305F\u3099\u3063\u3057\u3085\u3064",
      "\u305F\u3099\u3063\u305F\u3044",
      "\u305F\u3066\u308B",
      "\u305F\u3068\u3048\u308B",
      "\u305F\u306A\u306F\u3099\u305F",
      "\u305F\u306B\u3093",
      "\u305F\u306C\u304D",
      "\u305F\u306E\u3057\u307F",
      "\u305F\u306F\u3064",
      "\u305F\u3075\u3099\u3093",
      "\u305F\u3078\u3099\u308B",
      "\u305F\u307B\u3099\u3046",
      "\u305F\u307E\u3053\u3099",
      "\u305F\u307E\u308B",
      "\u305F\u3099\u3080\u308B",
      "\u305F\u3081\u3044\u304D",
      "\u305F\u3081\u3059",
      "\u305F\u3081\u308B",
      "\u305F\u3082\u3064",
      "\u305F\u3084\u3059\u3044",
      "\u305F\u3088\u308B",
      "\u305F\u3089\u3059",
      "\u305F\u308A\u304D\u307B\u3093\u304B\u3099\u3093",
      "\u305F\u308A\u3087\u3046",
      "\u305F\u308A\u308B",
      "\u305F\u308B\u3068",
      "\u305F\u308C\u308B",
      "\u305F\u308C\u3093\u3068",
      "\u305F\u308D\u3063\u3068",
      "\u305F\u308F\u3080\u308C\u308B",
      "\u305F\u3099\u3093\u3042\u3064",
      "\u305F\u3093\u3044",
      "\u305F\u3093\u304A\u3093",
      "\u305F\u3093\u304B",
      "\u305F\u3093\u304D",
      "\u305F\u3093\u3051\u3093",
      "\u305F\u3093\u3053\u3099",
      "\u305F\u3093\u3055\u3093",
      "\u305F\u3093\u3057\u3099\u3087\u3046\u3072\u3099",
      "\u305F\u3099\u3093\u305B\u3044",
      "\u305F\u3093\u305D\u304F",
      "\u305F\u3093\u305F\u3044",
      "\u305F\u3099\u3093\u3061",
      "\u305F\u3093\u3066\u3044",
      "\u305F\u3093\u3068\u3046",
      "\u305F\u3099\u3093\u306A",
      "\u305F\u3093\u306B\u3093",
      "\u305F\u3099\u3093\u306D\u3064",
      "\u305F\u3093\u306E\u3046",
      "\u305F\u3093\u3072\u309A\u3093",
      "\u305F\u3099\u3093\u307B\u3099\u3046",
      "\u305F\u3093\u307E\u3064",
      "\u305F\u3093\u3081\u3044",
      "\u305F\u3099\u3093\u308C\u3064",
      "\u305F\u3099\u3093\u308D",
      "\u305F\u3099\u3093\u308F",
      "\u3061\u3042\u3044",
      "\u3061\u3042\u3093",
      "\u3061\u3044\u304D",
      "\u3061\u3044\u3055\u3044",
      "\u3061\u3048\u3093",
      "\u3061\u304B\u3044",
      "\u3061\u304B\u3089",
      "\u3061\u304D\u3085\u3046",
      "\u3061\u304D\u3093",
      "\u3061\u3051\u3044\u3059\u3099",
      "\u3061\u3051\u3093",
      "\u3061\u3053\u304F",
      "\u3061\u3055\u3044",
      "\u3061\u3057\u304D",
      "\u3061\u3057\u308A\u3087\u3046",
      "\u3061\u305B\u3044",
      "\u3061\u305D\u3046",
      "\u3061\u305F\u3044",
      "\u3061\u305F\u3093",
      "\u3061\u3061\u304A\u3084",
      "\u3061\u3064\u3057\u3099\u3087",
      "\u3061\u3066\u304D",
      "\u3061\u3066\u3093",
      "\u3061\u306C\u304D",
      "\u3061\u306C\u308A",
      "\u3061\u306E\u3046",
      "\u3061\u3072\u3087\u3046",
      "\u3061\u3078\u3044\u305B\u3093",
      "\u3061\u307B\u3046",
      "\u3061\u307E\u305F",
      "\u3061\u307F\u3064",
      "\u3061\u307F\u3068\u3099\u308D",
      "\u3061\u3081\u3044\u3068\u3099",
      "\u3061\u3083\u3093\u3053\u306A\u3078\u3099",
      "\u3061\u3085\u3046\u3044",
      "\u3061\u3086\u308A\u3087\u304F",
      "\u3061\u3087\u3046\u3057",
      "\u3061\u3087\u3055\u304F\u3051\u3093",
      "\u3061\u3089\u3057",
      "\u3061\u3089\u307F",
      "\u3061\u308A\u304B\u3099\u307F",
      "\u3061\u308A\u3087\u3046",
      "\u3061\u308B\u3068\u3099",
      "\u3061\u308F\u308F",
      "\u3061\u3093\u305F\u3044",
      "\u3061\u3093\u3082\u304F",
      "\u3064\u3044\u304B",
      "\u3064\u3044\u305F\u3061",
      "\u3064\u3046\u304B",
      "\u3064\u3046\u3057\u3099\u3087\u3046",
      "\u3064\u3046\u306F\u3093",
      "\u3064\u3046\u308F",
      "\u3064\u304B\u3046",
      "\u3064\u304B\u308C\u308B",
      "\u3064\u304F\u306D",
      "\u3064\u304F\u308B",
      "\u3064\u3051\u306D",
      "\u3064\u3051\u308B",
      "\u3064\u3053\u3099\u3046",
      "\u3064\u305F\u3048\u308B",
      "\u3064\u3064\u3099\u304F",
      "\u3064\u3064\u3057\u3099",
      "\u3064\u3064\u3080",
      "\u3064\u3068\u3081\u308B",
      "\u3064\u306A\u304B\u3099\u308B",
      "\u3064\u306A\u307F",
      "\u3064\u306D\u3064\u3099\u306D",
      "\u3064\u306E\u308B",
      "\u3064\u3075\u3099\u3059",
      "\u3064\u307E\u3089\u306A\u3044",
      "\u3064\u307E\u308B",
      "\u3064\u307F\u304D",
      "\u3064\u3081\u305F\u3044",
      "\u3064\u3082\u308A",
      "\u3064\u3082\u308B",
      "\u3064\u3088\u3044",
      "\u3064\u308B\u307B\u3099",
      "\u3064\u308B\u307F\u304F",
      "\u3064\u308F\u3082\u306E",
      "\u3064\u308F\u308A",
      "\u3066\u3042\u3057",
      "\u3066\u3042\u3066",
      "\u3066\u3042\u307F",
      "\u3066\u3044\u304A\u3093",
      "\u3066\u3044\u304B",
      "\u3066\u3044\u304D",
      "\u3066\u3044\u3051\u3044",
      "\u3066\u3044\u3053\u304F",
      "\u3066\u3044\u3055\u3064",
      "\u3066\u3044\u3057",
      "\u3066\u3044\u305B\u3044",
      "\u3066\u3044\u305F\u3044",
      "\u3066\u3044\u3068\u3099",
      "\u3066\u3044\u306D\u3044",
      "\u3066\u3044\u3072\u3087\u3046",
      "\u3066\u3044\u3078\u3093",
      "\u3066\u3044\u307B\u3099\u3046",
      "\u3066\u3046\u3061",
      "\u3066\u304A\u304F\u308C",
      "\u3066\u304D\u3068\u3046",
      "\u3066\u304F\u3072\u3099",
      "\u3066\u3099\u3053\u307B\u3099\u3053",
      "\u3066\u3055\u304D\u3099\u3087\u3046",
      "\u3066\u3055\u3051\u3099",
      "\u3066\u3059\u308A",
      "\u3066\u305D\u3046",
      "\u3066\u3061\u304B\u3099\u3044",
      "\u3066\u3061\u3087\u3046",
      "\u3066\u3064\u304B\u3099\u304F",
      "\u3066\u3064\u3064\u3099\u304D",
      "\u3066\u3099\u3063\u306F\u309A",
      "\u3066\u3064\u307B\u3099\u3046",
      "\u3066\u3064\u3084",
      "\u3066\u3099\u306C\u304B\u3048",
      "\u3066\u306C\u304D",
      "\u3066\u306C\u304F\u3099\u3044",
      "\u3066\u306E\u3072\u3089",
      "\u3066\u306F\u3044",
      "\u3066\u3075\u3099\u304F\u308D",
      "\u3066\u3075\u305F\u3099",
      "\u3066\u307B\u3068\u3099\u304D",
      "\u3066\u307B\u3093",
      "\u3066\u307E\u3048",
      "\u3066\u307E\u304D\u3059\u3099\u3057",
      "\u3066\u307F\u3057\u3099\u304B",
      "\u3066\u307F\u3084\u3051\u3099",
      "\u3066\u3089\u3059",
      "\u3066\u308C\u3072\u3099",
      "\u3066\u308F\u3051",
      "\u3066\u308F\u305F\u3057",
      "\u3066\u3099\u3093\u3042\u3064",
      "\u3066\u3093\u3044\u3093",
      "\u3066\u3093\u304B\u3044",
      "\u3066\u3093\u304D",
      "\u3066\u3093\u304F\u3099",
      "\u3066\u3093\u3051\u3093",
      "\u3066\u3093\u3053\u3099\u304F",
      "\u3066\u3093\u3055\u3044",
      "\u3066\u3093\u3057",
      "\u3066\u3093\u3059\u3046",
      "\u3066\u3099\u3093\u3061",
      "\u3066\u3093\u3066\u304D",
      "\u3066\u3093\u3068\u3046",
      "\u3066\u3093\u306A\u3044",
      "\u3066\u3093\u3075\u309A\u3089",
      "\u3066\u3093\u307B\u3099\u3046\u305F\u3099\u3044",
      "\u3066\u3093\u3081\u3064",
      "\u3066\u3093\u3089\u3093\u304B\u3044",
      "\u3066\u3099\u3093\u308A\u3087\u304F",
      "\u3066\u3099\u3093\u308F",
      "\u3068\u3099\u3042\u3044",
      "\u3068\u3044\u308C",
      "\u3068\u3099\u3046\u304B\u3093",
      "\u3068\u3046\u304D\u3085\u3046",
      "\u3068\u3099\u3046\u304F\u3099",
      "\u3068\u3046\u3057",
      "\u3068\u3046\u3080\u304D\u3099",
      "\u3068\u304A\u3044",
      "\u3068\u304A\u304B",
      "\u3068\u304A\u304F",
      "\u3068\u304A\u3059",
      "\u3068\u304A\u308B",
      "\u3068\u304B\u3044",
      "\u3068\u304B\u3059",
      "\u3068\u304D\u304A\u308A",
      "\u3068\u304D\u3068\u3099\u304D",
      "\u3068\u304F\u3044",
      "\u3068\u304F\u3057\u3085\u3046",
      "\u3068\u304F\u3066\u3093",
      "\u3068\u304F\u306B",
      "\u3068\u304F\u3078\u3099\u3064",
      "\u3068\u3051\u3044",
      "\u3068\u3051\u308B",
      "\u3068\u3053\u3084",
      "\u3068\u3055\u304B",
      "\u3068\u3057\u3087\u304B\u3093",
      "\u3068\u305D\u3046",
      "\u3068\u305F\u3093",
      "\u3068\u3061\u3085\u3046",
      "\u3068\u3063\u304D\u3085\u3046",
      "\u3068\u3063\u304F\u3093",
      "\u3068\u3064\u305B\u3099\u3093",
      "\u3068\u3064\u306B\u3085\u3046",
      "\u3068\u3068\u3099\u3051\u308B",
      "\u3068\u3068\u306E\u3048\u308B",
      "\u3068\u306A\u3044",
      "\u3068\u306A\u3048\u308B",
      "\u3068\u306A\u308A",
      "\u3068\u306E\u3055\u307E",
      "\u3068\u306F\u3099\u3059",
      "\u3068\u3099\u3075\u3099\u304B\u3099\u308F",
      "\u3068\u307B\u3046",
      "\u3068\u307E\u308B",
      "\u3068\u3081\u308B",
      "\u3068\u3082\u305F\u3099\u3061",
      "\u3068\u3082\u308B",
      "\u3068\u3099\u3088\u3046\u3072\u3099",
      "\u3068\u3089\u3048\u308B",
      "\u3068\u3093\u304B\u3064",
      "\u3068\u3099\u3093\u3075\u3099\u308A",
      "\u306A\u3044\u304B\u304F",
      "\u306A\u3044\u3053\u3046",
      "\u306A\u3044\u3057\u3087",
      "\u306A\u3044\u3059",
      "\u306A\u3044\u305B\u3093",
      "\u306A\u3044\u305D\u3046",
      "\u306A\u304A\u3059",
      "\u306A\u304B\u3099\u3044",
      "\u306A\u304F\u3059",
      "\u306A\u3051\u3099\u308B",
      "\u306A\u3053\u3046\u3068\u3099",
      "\u306A\u3055\u3051",
      "\u306A\u305F\u3066\u3099\u3053\u3053",
      "\u306A\u3063\u3068\u3046",
      "\u306A\u3064\u3084\u3059\u307F",
      "\u306A\u306A\u304A\u3057",
      "\u306A\u306B\u3053\u3099\u3068",
      "\u306A\u306B\u3082\u306E",
      "\u306A\u306B\u308F",
      "\u306A\u306E\u304B",
      "\u306A\u3075\u305F\u3099",
      "\u306A\u307E\u3044\u304D",
      "\u306A\u307E\u3048",
      "\u306A\u307E\u307F",
      "\u306A\u307F\u305F\u3099",
      "\u306A\u3081\u3089\u304B",
      "\u306A\u3081\u308B",
      "\u306A\u3084\u3080",
      "\u306A\u3089\u3046",
      "\u306A\u3089\u3072\u3099",
      "\u306A\u3089\u3075\u3099",
      "\u306A\u308C\u308B",
      "\u306A\u308F\u3068\u3072\u3099",
      "\u306A\u308F\u306F\u3099\u308A",
      "\u306B\u3042\u3046",
      "\u306B\u3044\u304B\u3099\u305F",
      "\u306B\u3046\u3051",
      "\u306B\u304A\u3044",
      "\u306B\u304B\u3044",
      "\u306B\u304B\u3099\u3066",
      "\u306B\u304D\u3072\u3099",
      "\u306B\u304F\u3057\u307F",
      "\u306B\u304F\u307E\u3093",
      "\u306B\u3051\u3099\u308B",
      "\u306B\u3055\u3093\u304B\u305F\u3093\u305D",
      "\u306B\u3057\u304D",
      "\u306B\u305B\u3082\u306E",
      "\u306B\u3061\u3057\u3099\u3087\u3046",
      "\u306B\u3061\u3088\u3046\u3072\u3099",
      "\u306B\u3063\u304B",
      "\u306B\u3063\u304D",
      "\u306B\u3063\u3051\u3044",
      "\u306B\u3063\u3053\u3046",
      "\u306B\u3063\u3055\u3093",
      "\u306B\u3063\u3057\u3087\u304F",
      "\u306B\u3063\u3059\u3046",
      "\u306B\u3063\u305B\u304D",
      "\u306B\u3063\u3066\u3044",
      "\u306B\u306A\u3046",
      "\u306B\u307B\u3093",
      "\u306B\u307E\u3081",
      "\u306B\u3082\u3064",
      "\u306B\u3084\u308A",
      "\u306B\u3085\u3046\u3044\u3093",
      "\u306B\u308A\u3093\u3057\u3083",
      "\u306B\u308F\u3068\u308A",
      "\u306B\u3093\u3044",
      "\u306B\u3093\u304B",
      "\u306B\u3093\u304D",
      "\u306B\u3093\u3051\u3099\u3093",
      "\u306B\u3093\u3057\u304D",
      "\u306B\u3093\u3059\u3099\u3046",
      "\u306B\u3093\u305D\u3046",
      "\u306B\u3093\u305F\u3044",
      "\u306B\u3093\u3061",
      "\u306B\u3093\u3066\u3044",
      "\u306B\u3093\u306B\u304F",
      "\u306B\u3093\u3075\u309A",
      "\u306B\u3093\u307E\u308A",
      "\u306B\u3093\u3080",
      "\u306B\u3093\u3081\u3044",
      "\u306B\u3093\u3088\u3046",
      "\u306C\u3044\u304F\u304D\u3099",
      "\u306C\u304B\u3059",
      "\u306C\u304F\u3099\u3044\u3068\u308B",
      "\u306C\u304F\u3099\u3046",
      "\u306C\u304F\u3082\u308A",
      "\u306C\u3059\u3080",
      "\u306C\u307E\u3048\u3072\u3099",
      "\u306C\u3081\u308A",
      "\u306C\u3089\u3059",
      "\u306C\u3093\u3061\u3083\u304F",
      "\u306D\u3042\u3051\u3099",
      "\u306D\u3044\u304D",
      "\u306D\u3044\u308B",
      "\u306D\u3044\u308D",
      "\u306D\u304F\u3099\u305B",
      "\u306D\u304F\u305F\u3044",
      "\u306D\u304F\u3089",
      "\u306D\u3053\u305B\u3099",
      "\u306D\u3053\u3080",
      "\u306D\u3055\u3051\u3099",
      "\u306D\u3059\u3053\u3099\u3059",
      "\u306D\u305D\u3078\u3099\u308B",
      "\u306D\u305F\u3099\u3093",
      "\u306D\u3064\u3044",
      "\u306D\u3063\u3057\u3093",
      "\u306D\u3064\u305D\u3099\u3046",
      "\u306D\u3063\u305F\u3044\u304D\u3099\u3087",
      "\u306D\u3075\u3099\u305D\u304F",
      "\u306D\u3075\u305F\u3099",
      "\u306D\u307B\u3099\u3046",
      "\u306D\u307B\u308A\u306F\u307B\u308A",
      "\u306D\u307E\u304D",
      "\u306D\u307E\u308F\u3057",
      "\u306D\u307F\u307F",
      "\u306D\u3080\u3044",
      "\u306D\u3080\u305F\u3044",
      "\u306D\u3082\u3068",
      "\u306D\u3089\u3046",
      "\u306D\u308F\u3055\u3099",
      "\u306D\u3093\u3044\u308A",
      "\u306D\u3093\u304A\u3057",
      "\u306D\u3093\u304B\u3093",
      "\u306D\u3093\u304D\u3093",
      "\u306D\u3093\u304F\u3099",
      "\u306D\u3093\u3055\u3099",
      "\u306D\u3093\u3057",
      "\u306D\u3093\u3061\u3083\u304F",
      "\u306D\u3093\u3068\u3099",
      "\u306D\u3093\u3072\u309A",
      "\u306D\u3093\u3075\u3099\u3064",
      "\u306D\u3093\u307E\u3064",
      "\u306D\u3093\u308A\u3087\u3046",
      "\u306D\u3093\u308C\u3044",
      "\u306E\u3044\u3059\u3099",
      "\u306E\u304A\u3064\u3099\u307E",
      "\u306E\u304B\u3099\u3059",
      "\u306E\u304D\u306A\u307F",
      "\u306E\u3053\u304D\u3099\u308A",
      "\u306E\u3053\u3059",
      "\u306E\u3053\u308B",
      "\u306E\u305B\u308B",
      "\u306E\u305D\u3099\u304F",
      "\u306E\u305D\u3099\u3080",
      "\u306E\u305F\u307E\u3046",
      "\u306E\u3061\u307B\u3068\u3099",
      "\u306E\u3063\u304F",
      "\u306E\u306F\u3099\u3059",
      "\u306E\u306F\u3089",
      "\u306E\u3078\u3099\u308B",
      "\u306E\u307B\u3099\u308B",
      "\u306E\u307F\u3082\u306E",
      "\u306E\u3084\u307E",
      "\u306E\u3089\u3044\u306C",
      "\u306E\u3089\u306D\u3053",
      "\u306E\u308A\u3082\u306E",
      "\u306E\u308A\u3086\u304D",
      "\u306E\u308C\u3093",
      "\u306E\u3093\u304D",
      "\u306F\u3099\u3042\u3044",
      "\u306F\u3042\u304F",
      "\u306F\u3099\u3042\u3055\u3093",
      "\u306F\u3099\u3044\u304B",
      "\u306F\u3099\u3044\u304F",
      "\u306F\u3044\u3051\u3093",
      "\u306F\u3044\u3053\u3099",
      "\u306F\u3044\u3057\u3093",
      "\u306F\u3044\u3059\u3044",
      "\u306F\u3044\u305B\u3093",
      "\u306F\u3044\u305D\u3046",
      "\u306F\u3044\u3061",
      "\u306F\u3099\u3044\u306F\u3099\u3044",
      "\u306F\u3044\u308C\u3064",
      "\u306F\u3048\u308B",
      "\u306F\u304A\u308B",
      "\u306F\u304B\u3044",
      "\u306F\u3099\u304B\u308A",
      "\u306F\u304B\u308B",
      "\u306F\u304F\u3057\u3085",
      "\u306F\u3051\u3093",
      "\u306F\u3053\u3075\u3099",
      "\u306F\u3055\u307F",
      "\u306F\u3055\u3093",
      "\u306F\u3057\u3053\u3099",
      "\u306F\u3099\u3057\u3087",
      "\u306F\u3057\u308B",
      "\u306F\u305B\u308B",
      "\u306F\u309A\u305D\u3053\u3093",
      "\u306F\u305D\u3093",
      "\u306F\u305F\u3093",
      "\u306F\u3061\u307F\u3064",
      "\u306F\u3064\u304A\u3093",
      "\u306F\u3063\u304B\u304F",
      "\u306F\u3064\u3099\u304D",
      "\u306F\u3063\u304D\u308A",
      "\u306F\u3063\u304F\u3064",
      "\u306F\u3063\u3051\u3093",
      "\u306F\u3063\u3053\u3046",
      "\u306F\u3063\u3055\u3093",
      "\u306F\u3063\u3057\u3093",
      "\u306F\u3063\u305F\u3064",
      "\u306F\u3063\u3061\u3085\u3046",
      "\u306F\u3063\u3066\u3093",
      "\u306F\u3063\u3072\u309A\u3087\u3046",
      "\u306F\u3063\u307B\u309A\u3046",
      "\u306F\u306A\u3059",
      "\u306F\u306A\u3072\u3099",
      "\u306F\u306B\u304B\u3080",
      "\u306F\u3075\u3099\u3089\u3057",
      "\u306F\u307F\u304B\u3099\u304D",
      "\u306F\u3080\u304B\u3046",
      "\u306F\u3081\u3064",
      "\u306F\u3084\u3044",
      "\u306F\u3084\u3057",
      "\u306F\u3089\u3046",
      "\u306F\u308D\u3046\u3043\u3093",
      "\u306F\u308F\u3044",
      "\u306F\u3093\u3044",
      "\u306F\u3093\u3048\u3044",
      "\u306F\u3093\u304A\u3093",
      "\u306F\u3093\u304B\u304F",
      "\u306F\u3093\u304D\u3087\u3046",
      "\u306F\u3099\u3093\u304F\u3099\u307F",
      "\u306F\u3093\u3053",
      "\u306F\u3093\u3057\u3083",
      "\u306F\u3093\u3059\u3046",
      "\u306F\u3093\u305F\u3099\u3093",
      "\u306F\u309A\u3093\u3061",
      "\u306F\u309A\u3093\u3064",
      "\u306F\u3093\u3066\u3044",
      "\u306F\u3093\u3068\u3057",
      "\u306F\u3093\u306E\u3046",
      "\u306F\u3093\u306F\u309A",
      "\u306F\u3093\u3075\u3099\u3093",
      "\u306F\u3093\u3078\u309A\u3093",
      "\u306F\u3093\u307B\u3099\u3046\u304D",
      "\u306F\u3093\u3081\u3044",
      "\u306F\u3093\u3089\u3093",
      "\u306F\u3093\u308D\u3093",
      "\u3072\u3044\u304D",
      "\u3072\u3046\u3093",
      "\u3072\u3048\u308B",
      "\u3072\u304B\u304F",
      "\u3072\u304B\u308A",
      "\u3072\u304B\u308B",
      "\u3072\u304B\u3093",
      "\u3072\u304F\u3044",
      "\u3072\u3051\u3064",
      "\u3072\u3053\u3046\u304D",
      "\u3072\u3053\u304F",
      "\u3072\u3055\u3044",
      "\u3072\u3055\u3057\u3075\u3099\u308A",
      "\u3072\u3055\u3093",
      "\u3072\u3099\u3057\u3099\u3085\u3064\u304B\u3093",
      "\u3072\u3057\u3087",
      "\u3072\u305D\u304B",
      "\u3072\u305D\u3080",
      "\u3072\u305F\u3080\u304D",
      "\u3072\u305F\u3099\u308A",
      "\u3072\u305F\u308B",
      "\u3072\u3064\u304D\u3099",
      "\u3072\u3063\u3053\u3057",
      "\u3072\u3063\u3057",
      "\u3072\u3064\u3057\u3099\u3085\u3072\u3093",
      "\u3072\u3063\u3059",
      "\u3072\u3064\u305B\u3099\u3093",
      "\u3072\u309A\u3063\u305F\u308A",
      "\u3072\u309A\u3063\u3061\u308A",
      "\u3072\u3064\u3088\u3046",
      "\u3072\u3066\u3044",
      "\u3072\u3068\u3053\u3099\u307F",
      "\u3072\u306A\u307E\u3064\u308A",
      "\u3072\u306A\u3093",
      "\u3072\u306D\u308B",
      "\u3072\u306F\u3093",
      "\u3072\u3072\u3099\u304F",
      "\u3072\u3072\u3087\u3046",
      "\u3072\u307B\u3046",
      "\u3072\u307E\u308F\u308A",
      "\u3072\u307E\u3093",
      "\u3072\u307F\u3064",
      "\u3072\u3081\u3044",
      "\u3072\u3081\u3057\u3099\u3057",
      "\u3072\u3084\u3051",
      "\u3072\u3084\u3059",
      "\u3072\u3088\u3046",
      "\u3072\u3099\u3087\u3046\u304D",
      "\u3072\u3089\u304B\u3099\u306A",
      "\u3072\u3089\u304F",
      "\u3072\u308A\u3064",
      "\u3072\u308A\u3087\u3046",
      "\u3072\u308B\u307E",
      "\u3072\u308B\u3084\u3059\u307F",
      "\u3072\u308C\u3044",
      "\u3072\u308D\u3044",
      "\u3072\u308D\u3046",
      "\u3072\u308D\u304D",
      "\u3072\u308D\u3086\u304D",
      "\u3072\u3093\u304B\u304F",
      "\u3072\u3093\u3051\u3064",
      "\u3072\u3093\u3053\u3093",
      "\u3072\u3093\u3057\u3085",
      "\u3072\u3093\u305D\u3046",
      "\u3072\u309A\u3093\u3061",
      "\u3072\u3093\u306F\u309A\u3093",
      "\u3072\u3099\u3093\u307B\u3099\u3046",
      "\u3075\u3042\u3093",
      "\u3075\u3044\u3046\u3061",
      "\u3075\u3046\u3051\u3044",
      "\u3075\u3046\u305B\u3093",
      "\u3075\u309A\u3046\u305F\u308D\u3046",
      "\u3075\u3046\u3068\u3046",
      "\u3075\u3046\u3075",
      "\u3075\u3048\u308B",
      "\u3075\u304A\u3093",
      "\u3075\u304B\u3044",
      "\u3075\u304D\u3093",
      "\u3075\u304F\u3055\u3099\u3064",
      "\u3075\u304F\u3075\u3099\u304F\u308D",
      "\u3075\u3053\u3046",
      "\u3075\u3055\u3044",
      "\u3075\u3057\u304D\u3099",
      "\u3075\u3057\u3099\u307F",
      "\u3075\u3059\u307E",
      "\u3075\u305B\u3044",
      "\u3075\u305B\u304F\u3099",
      "\u3075\u305D\u304F",
      "\u3075\u3099\u305F\u306B\u304F",
      "\u3075\u305F\u3093",
      "\u3075\u3061\u3087\u3046",
      "\u3075\u3064\u3046",
      "\u3075\u3064\u304B",
      "\u3075\u3063\u304B\u3064",
      "\u3075\u3063\u304D",
      "\u3075\u3063\u3053\u304F",
      "\u3075\u3099\u3068\u3099\u3046",
      "\u3075\u3068\u308B",
      "\u3075\u3068\u3093",
      "\u3075\u306E\u3046",
      "\u3075\u306F\u3044",
      "\u3075\u3072\u3087\u3046",
      "\u3075\u3078\u3093",
      "\u3075\u307E\u3093",
      "\u3075\u307F\u3093",
      "\u3075\u3081\u3064",
      "\u3075\u3081\u3093",
      "\u3075\u3088\u3046",
      "\u3075\u308A\u3053",
      "\u3075\u308A\u308B",
      "\u3075\u308B\u3044",
      "\u3075\u3093\u3044\u304D",
      "\u3075\u3099\u3093\u304B\u3099\u304F",
      "\u3075\u3099\u3093\u304F\u3099",
      "\u3075\u3093\u3057\u3064",
      "\u3075\u3099\u3093\u305B\u304D",
      "\u3075\u3093\u305D\u3046",
      "\u3075\u3099\u3093\u307B\u309A\u3046",
      "\u3078\u3044\u3042\u3093",
      "\u3078\u3044\u304A\u3093",
      "\u3078\u3044\u304B\u3099\u3044",
      "\u3078\u3044\u304D",
      "\u3078\u3044\u3051\u3099\u3093",
      "\u3078\u3044\u3053\u3046",
      "\u3078\u3044\u3055",
      "\u3078\u3044\u3057\u3083",
      "\u3078\u3044\u305B\u3064",
      "\u3078\u3044\u305D",
      "\u3078\u3044\u305F\u304F",
      "\u3078\u3044\u3066\u3093",
      "\u3078\u3044\u306D\u3064",
      "\u3078\u3044\u308F",
      "\u3078\u304D\u304B\u3099",
      "\u3078\u3053\u3080",
      "\u3078\u3099\u306B\u3044\u308D",
      "\u3078\u3099\u306B\u3057\u3087\u3046\u304B\u3099",
      "\u3078\u3089\u3059",
      "\u3078\u3093\u304B\u3093",
      "\u3078\u3099\u3093\u304D\u3087\u3046",
      "\u3078\u3099\u3093\u3053\u3099\u3057",
      "\u3078\u3093\u3055\u3044",
      "\u3078\u3093\u305F\u3044",
      "\u3078\u3099\u3093\u308A",
      "\u307B\u3042\u3093",
      "\u307B\u3044\u304F",
      "\u307B\u3099\u3046\u304D\u3099\u3087",
      "\u307B\u3046\u3053\u304F",
      "\u307B\u3046\u305D\u3046",
      "\u307B\u3046\u307B\u3046",
      "\u307B\u3046\u3082\u3093",
      "\u307B\u3046\u308A\u3064",
      "\u307B\u3048\u308B",
      "\u307B\u304A\u3093",
      "\u307B\u304B\u3093",
      "\u307B\u304D\u3087\u3046",
      "\u307B\u3099\u304D\u3093",
      "\u307B\u304F\u308D",
      "\u307B\u3051\u3064",
      "\u307B\u3051\u3093",
      "\u307B\u3053\u3046",
      "\u307B\u3053\u308B",
      "\u307B\u3057\u3044",
      "\u307B\u3057\u3064",
      "\u307B\u3057\u3085",
      "\u307B\u3057\u3087\u3046",
      "\u307B\u305B\u3044",
      "\u307B\u305D\u3044",
      "\u307B\u305D\u304F",
      "\u307B\u305F\u3066",
      "\u307B\u305F\u308B",
      "\u307B\u309A\u3061\u3075\u3099\u304F\u308D",
      "\u307B\u3063\u304D\u3087\u304F",
      "\u307B\u3063\u3055",
      "\u307B\u3063\u305F\u3093",
      "\u307B\u3068\u3093\u3068\u3099",
      "\u307B\u3081\u308B",
      "\u307B\u3093\u3044",
      "\u307B\u3093\u304D",
      "\u307B\u3093\u3051",
      "\u307B\u3093\u3057\u3064",
      "\u307B\u3093\u3084\u304F",
      "\u307E\u3044\u306B\u3061",
      "\u307E\u304B\u3044",
      "\u307E\u304B\u305B\u308B",
      "\u307E\u304B\u3099\u308B",
      "\u307E\u3051\u308B",
      "\u307E\u3053\u3068",
      "\u307E\u3055\u3064",
      "\u307E\u3057\u3099\u3081",
      "\u307E\u3059\u304F",
      "\u307E\u305B\u3099\u308B",
      "\u307E\u3064\u308A",
      "\u307E\u3068\u3081",
      "\u307E\u306A\u3075\u3099",
      "\u307E\u306C\u3051",
      "\u307E\u306D\u304F",
      "\u307E\u307B\u3046",
      "\u307E\u3082\u308B",
      "\u307E\u3086\u3051\u3099",
      "\u307E\u3088\u3046",
      "\u307E\u308D\u3084\u304B",
      "\u307E\u308F\u3059",
      "\u307E\u308F\u308A",
      "\u307E\u308F\u308B",
      "\u307E\u3093\u304B\u3099",
      "\u307E\u3093\u304D\u3064",
      "\u307E\u3093\u305D\u3099\u304F",
      "\u307E\u3093\u306A\u304B",
      "\u307F\u3044\u3089",
      "\u307F\u3046\u3061",
      "\u307F\u3048\u308B",
      "\u307F\u304B\u3099\u304F",
      "\u307F\u304B\u305F",
      "\u307F\u304B\u3093",
      "\u307F\u3051\u3093",
      "\u307F\u3053\u3093",
      "\u307F\u3057\u3099\u304B\u3044",
      "\u307F\u3059\u3044",
      "\u307F\u3059\u3048\u308B",
      "\u307F\u305B\u308B",
      "\u307F\u3063\u304B",
      "\u307F\u3064\u304B\u308B",
      "\u307F\u3064\u3051\u308B",
      "\u307F\u3066\u3044",
      "\u307F\u3068\u3081\u308B",
      "\u307F\u306A\u3068",
      "\u307F\u306A\u307F\u304B\u3055\u3044",
      "\u307F\u306D\u3089\u308B",
      "\u307F\u306E\u3046",
      "\u307F\u306E\u304B\u3099\u3059",
      "\u307F\u307B\u3093",
      "\u307F\u3082\u3068",
      "\u307F\u3084\u3051\u3099",
      "\u307F\u3089\u3044",
      "\u307F\u308A\u3087\u304F",
      "\u307F\u308F\u304F",
      "\u307F\u3093\u304B",
      "\u307F\u3093\u305D\u3099\u304F",
      "\u3080\u3044\u304B",
      "\u3080\u3048\u304D",
      "\u3080\u3048\u3093",
      "\u3080\u304B\u3044",
      "\u3080\u304B\u3046",
      "\u3080\u304B\u3048",
      "\u3080\u304B\u3057",
      "\u3080\u304D\u3099\u3061\u3083",
      "\u3080\u3051\u308B",
      "\u3080\u3051\u3099\u3093",
      "\u3080\u3055\u307B\u3099\u308B",
      "\u3080\u3057\u3042\u3064\u3044",
      "\u3080\u3057\u306F\u3099",
      "\u3080\u3057\u3099\u3085\u3093",
      "\u3080\u3057\u308D",
      "\u3080\u3059\u3046",
      "\u3080\u3059\u3053",
      "\u3080\u3059\u3075\u3099",
      "\u3080\u3059\u3081",
      "\u3080\u305B\u308B",
      "\u3080\u305B\u3093",
      "\u3080\u3061\u3085\u3046",
      "\u3080\u306A\u3057\u3044",
      "\u3080\u306E\u3046",
      "\u3080\u3084\u307F",
      "\u3080\u3088\u3046",
      "\u3080\u3089\u3055\u304D",
      "\u3080\u308A\u3087\u3046",
      "\u3080\u308D\u3093",
      "\u3081\u3044\u3042\u3093",
      "\u3081\u3044\u3046\u3093",
      "\u3081\u3044\u3048\u3093",
      "\u3081\u3044\u304B\u304F",
      "\u3081\u3044\u304D\u3087\u304F",
      "\u3081\u3044\u3055\u3044",
      "\u3081\u3044\u3057",
      "\u3081\u3044\u305D\u3046",
      "\u3081\u3044\u3075\u3099\u3064",
      "\u3081\u3044\u308C\u3044",
      "\u3081\u3044\u308F\u304F",
      "\u3081\u304F\u3099\u307E\u308C\u308B",
      "\u3081\u3055\u3099\u3059",
      "\u3081\u3057\u305F",
      "\u3081\u3059\u3099\u3089\u3057\u3044",
      "\u3081\u305F\u3099\u3064",
      "\u3081\u307E\u3044",
      "\u3081\u3084\u3059",
      "\u3081\u3093\u304D\u3087",
      "\u3081\u3093\u305B\u304D",
      "\u3081\u3093\u3068\u3099\u3046",
      "\u3082\u3046\u3057\u3042\u3051\u3099\u308B",
      "\u3082\u3046\u3068\u3099\u3046\u3051\u3093",
      "\u3082\u3048\u308B",
      "\u3082\u304F\u3057",
      "\u3082\u304F\u3066\u304D",
      "\u3082\u304F\u3088\u3046\u3072\u3099",
      "\u3082\u3061\u308D\u3093",
      "\u3082\u3068\u3099\u308B",
      "\u3082\u3089\u3046",
      "\u3082\u3093\u304F",
      "\u3082\u3093\u305F\u3099\u3044",
      "\u3084\u304A\u3084",
      "\u3084\u3051\u308B",
      "\u3084\u3055\u3044",
      "\u3084\u3055\u3057\u3044",
      "\u3084\u3059\u3044",
      "\u3084\u3059\u305F\u308D\u3046",
      "\u3084\u3059\u307F",
      "\u3084\u305B\u308B",
      "\u3084\u305D\u3046",
      "\u3084\u305F\u3044",
      "\u3084\u3061\u3093",
      "\u3084\u3063\u3068",
      "\u3084\u3063\u306F\u309A\u308A",
      "\u3084\u3075\u3099\u308B",
      "\u3084\u3081\u308B",
      "\u3084\u3084\u3053\u3057\u3044",
      "\u3084\u3088\u3044",
      "\u3084\u308F\u3089\u304B\u3044",
      "\u3086\u3046\u304D",
      "\u3086\u3046\u3072\u3099\u3093\u304D\u3087\u304F",
      "\u3086\u3046\u3078\u3099",
      "\u3086\u3046\u3081\u3044",
      "\u3086\u3051\u3064",
      "\u3086\u3057\u3085\u3064",
      "\u3086\u305B\u3093",
      "\u3086\u305D\u3046",
      "\u3086\u305F\u304B",
      "\u3086\u3061\u3083\u304F",
      "\u3086\u3066\u3099\u308B",
      "\u3086\u306B\u3085\u3046",
      "\u3086\u3072\u3099\u308F",
      "\u3086\u3089\u3044",
      "\u3086\u308C\u308B",
      "\u3088\u3046\u3044",
      "\u3088\u3046\u304B",
      "\u3088\u3046\u304D\u3085\u3046",
      "\u3088\u3046\u3057\u3099",
      "\u3088\u3046\u3059",
      "\u3088\u3046\u3061\u3048\u3093",
      "\u3088\u304B\u305B\u3099",
      "\u3088\u304B\u3093",
      "\u3088\u304D\u3093",
      "\u3088\u304F\u305B\u3044",
      "\u3088\u304F\u307B\u3099\u3046",
      "\u3088\u3051\u3044",
      "\u3088\u3053\u3099\u308C\u308B",
      "\u3088\u3055\u3093",
      "\u3088\u3057\u3085\u3046",
      "\u3088\u305D\u3046",
      "\u3088\u305D\u304F",
      "\u3088\u3063\u304B",
      "\u3088\u3066\u3044",
      "\u3088\u3068\u3099\u304B\u3099\u308F\u304F",
      "\u3088\u306D\u3064",
      "\u3088\u3084\u304F",
      "\u3088\u3086\u3046",
      "\u3088\u308D\u3053\u3075\u3099",
      "\u3088\u308D\u3057\u3044",
      "\u3089\u3044\u3046",
      "\u3089\u304F\u304B\u3099\u304D",
      "\u3089\u304F\u3053\u3099",
      "\u3089\u304F\u3055\u3064",
      "\u3089\u304F\u305F\u3099",
      "\u3089\u3057\u3093\u306F\u3099\u3093",
      "\u3089\u305B\u3093",
      "\u3089\u305D\u3099\u304F",
      "\u3089\u305F\u3044",
      "\u3089\u3063\u304B",
      "\u3089\u308C\u3064",
      "\u308A\u3048\u304D",
      "\u308A\u304B\u3044",
      "\u308A\u304D\u3055\u304F",
      "\u308A\u304D\u305B\u3064",
      "\u308A\u304F\u304F\u3099\u3093",
      "\u308A\u304F\u3064",
      "\u308A\u3051\u3093",
      "\u308A\u3053\u3046",
      "\u308A\u305B\u3044",
      "\u308A\u305D\u3046",
      "\u308A\u305D\u304F",
      "\u308A\u3066\u3093",
      "\u308A\u306D\u3093",
      "\u308A\u3086\u3046",
      "\u308A\u3085\u3046\u304B\u3099\u304F",
      "\u308A\u3088\u3046",
      "\u308A\u3087\u3046\u308A",
      "\u308A\u3087\u304B\u3093",
      "\u308A\u3087\u304F\u3061\u3083",
      "\u308A\u3087\u3053\u3046",
      "\u308A\u308A\u304F",
      "\u308A\u308C\u304D",
      "\u308A\u308D\u3093",
      "\u308A\u3093\u3053\u3099",
      "\u308B\u3044\u3051\u3044",
      "\u308B\u3044\u3055\u3044",
      "\u308B\u3044\u3057\u3099",
      "\u308B\u3044\u305B\u304D",
      "\u308B\u3059\u306F\u3099\u3093",
      "\u308B\u308A\u304B\u3099\u308F\u3089",
      "\u308C\u3044\u304B\u3093",
      "\u308C\u3044\u304D\u3099",
      "\u308C\u3044\u305B\u3044",
      "\u308C\u3044\u305D\u3099\u3046\u3053",
      "\u308C\u3044\u3068\u3046",
      "\u308C\u3044\u307B\u3099\u3046",
      "\u308C\u304D\u3057",
      "\u308C\u304D\u305F\u3099\u3044",
      "\u308C\u3093\u3042\u3044",
      "\u308C\u3093\u3051\u3044",
      "\u308C\u3093\u3053\u3093",
      "\u308C\u3093\u3055\u3044",
      "\u308C\u3093\u3057\u3085\u3046",
      "\u308C\u3093\u305D\u3099\u304F",
      "\u308C\u3093\u3089\u304F",
      "\u308D\u3046\u304B",
      "\u308D\u3046\u3053\u3099",
      "\u308D\u3046\u3057\u3099\u3093",
      "\u308D\u3046\u305D\u304F",
      "\u308D\u304F\u304B\u3099",
      "\u308D\u3053\u3064",
      "\u308D\u3057\u3099\u3046\u3089",
      "\u308D\u3057\u3085\u3064",
      "\u308D\u305B\u3093",
      "\u308D\u3066\u3093",
      "\u308D\u3081\u3093",
      "\u308D\u308C\u3064",
      "\u308D\u3093\u304D\u3099",
      "\u308D\u3093\u306F\u309A",
      "\u308D\u3093\u3075\u3099\u3093",
      "\u308D\u3093\u308A",
      "\u308F\u304B\u3059",
      "\u308F\u304B\u3081",
      "\u308F\u304B\u3084\u307E",
      "\u308F\u304B\u308C\u308B",
      "\u308F\u3057\u3064",
      "\u308F\u3057\u3099\u307E\u3057",
      "\u308F\u3059\u308C\u3082\u306E",
      "\u308F\u3089\u3046",
      "\u308F\u308C\u308B"
    ];
  }
});

// ../node_modules/bip39/src/wordlists/portuguese.json
var require_portuguese = __commonJS({
  "../node_modules/bip39/src/wordlists/portuguese.json"(exports, module) {
    module.exports = [
      "abacate",
      "abaixo",
      "abalar",
      "abater",
      "abduzir",
      "abelha",
      "aberto",
      "abismo",
      "abotoar",
      "abranger",
      "abreviar",
      "abrigar",
      "abrupto",
      "absinto",
      "absoluto",
      "absurdo",
      "abutre",
      "acabado",
      "acalmar",
      "acampar",
      "acanhar",
      "acaso",
      "aceitar",
      "acelerar",
      "acenar",
      "acervo",
      "acessar",
      "acetona",
      "achatar",
      "acidez",
      "acima",
      "acionado",
      "acirrar",
      "aclamar",
      "aclive",
      "acolhida",
      "acomodar",
      "acoplar",
      "acordar",
      "acumular",
      "acusador",
      "adaptar",
      "adega",
      "adentro",
      "adepto",
      "adequar",
      "aderente",
      "adesivo",
      "adeus",
      "adiante",
      "aditivo",
      "adjetivo",
      "adjunto",
      "admirar",
      "adorar",
      "adquirir",
      "adubo",
      "adverso",
      "advogado",
      "aeronave",
      "afastar",
      "aferir",
      "afetivo",
      "afinador",
      "afivelar",
      "aflito",
      "afluente",
      "afrontar",
      "agachar",
      "agarrar",
      "agasalho",
      "agenciar",
      "agilizar",
      "agiota",
      "agitado",
      "agora",
      "agradar",
      "agreste",
      "agrupar",
      "aguardar",
      "agulha",
      "ajoelhar",
      "ajudar",
      "ajustar",
      "alameda",
      "alarme",
      "alastrar",
      "alavanca",
      "albergue",
      "albino",
      "alcatra",
      "aldeia",
      "alecrim",
      "alegria",
      "alertar",
      "alface",
      "alfinete",
      "algum",
      "alheio",
      "aliar",
      "alicate",
      "alienar",
      "alinhar",
      "aliviar",
      "almofada",
      "alocar",
      "alpiste",
      "alterar",
      "altitude",
      "alucinar",
      "alugar",
      "aluno",
      "alusivo",
      "alvo",
      "amaciar",
      "amador",
      "amarelo",
      "amassar",
      "ambas",
      "ambiente",
      "ameixa",
      "amenizar",
      "amido",
      "amistoso",
      "amizade",
      "amolador",
      "amontoar",
      "amoroso",
      "amostra",
      "amparar",
      "ampliar",
      "ampola",
      "anagrama",
      "analisar",
      "anarquia",
      "anatomia",
      "andaime",
      "anel",
      "anexo",
      "angular",
      "animar",
      "anjo",
      "anomalia",
      "anotado",
      "ansioso",
      "anterior",
      "anuidade",
      "anunciar",
      "anzol",
      "apagador",
      "apalpar",
      "apanhado",
      "apego",
      "apelido",
      "apertada",
      "apesar",
      "apetite",
      "apito",
      "aplauso",
      "aplicada",
      "apoio",
      "apontar",
      "aposta",
      "aprendiz",
      "aprovar",
      "aquecer",
      "arame",
      "aranha",
      "arara",
      "arcada",
      "ardente",
      "areia",
      "arejar",
      "arenito",
      "aresta",
      "argiloso",
      "argola",
      "arma",
      "arquivo",
      "arraial",
      "arrebate",
      "arriscar",
      "arroba",
      "arrumar",
      "arsenal",
      "arterial",
      "artigo",
      "arvoredo",
      "asfaltar",
      "asilado",
      "aspirar",
      "assador",
      "assinar",
      "assoalho",
      "assunto",
      "astral",
      "atacado",
      "atadura",
      "atalho",
      "atarefar",
      "atear",
      "atender",
      "aterro",
      "ateu",
      "atingir",
      "atirador",
      "ativo",
      "atoleiro",
      "atracar",
      "atrevido",
      "atriz",
      "atual",
      "atum",
      "auditor",
      "aumentar",
      "aura",
      "aurora",
      "autismo",
      "autoria",
      "autuar",
      "avaliar",
      "avante",
      "avaria",
      "avental",
      "avesso",
      "aviador",
      "avisar",
      "avulso",
      "axila",
      "azarar",
      "azedo",
      "azeite",
      "azulejo",
      "babar",
      "babosa",
      "bacalhau",
      "bacharel",
      "bacia",
      "bagagem",
      "baiano",
      "bailar",
      "baioneta",
      "bairro",
      "baixista",
      "bajular",
      "baleia",
      "baliza",
      "balsa",
      "banal",
      "bandeira",
      "banho",
      "banir",
      "banquete",
      "barato",
      "barbado",
      "baronesa",
      "barraca",
      "barulho",
      "baseado",
      "bastante",
      "batata",
      "batedor",
      "batida",
      "batom",
      "batucar",
      "baunilha",
      "beber",
      "beijo",
      "beirada",
      "beisebol",
      "beldade",
      "beleza",
      "belga",
      "beliscar",
      "bendito",
      "bengala",
      "benzer",
      "berimbau",
      "berlinda",
      "berro",
      "besouro",
      "bexiga",
      "bezerro",
      "bico",
      "bicudo",
      "bienal",
      "bifocal",
      "bifurcar",
      "bigorna",
      "bilhete",
      "bimestre",
      "bimotor",
      "biologia",
      "biombo",
      "biosfera",
      "bipolar",
      "birrento",
      "biscoito",
      "bisneto",
      "bispo",
      "bissexto",
      "bitola",
      "bizarro",
      "blindado",
      "bloco",
      "bloquear",
      "boato",
      "bobagem",
      "bocado",
      "bocejo",
      "bochecha",
      "boicotar",
      "bolada",
      "boletim",
      "bolha",
      "bolo",
      "bombeiro",
      "bonde",
      "boneco",
      "bonita",
      "borbulha",
      "borda",
      "boreal",
      "borracha",
      "bovino",
      "boxeador",
      "branco",
      "brasa",
      "braveza",
      "breu",
      "briga",
      "brilho",
      "brincar",
      "broa",
      "brochura",
      "bronzear",
      "broto",
      "bruxo",
      "bucha",
      "budismo",
      "bufar",
      "bule",
      "buraco",
      "busca",
      "busto",
      "buzina",
      "cabana",
      "cabelo",
      "cabide",
      "cabo",
      "cabrito",
      "cacau",
      "cacetada",
      "cachorro",
      "cacique",
      "cadastro",
      "cadeado",
      "cafezal",
      "caiaque",
      "caipira",
      "caixote",
      "cajado",
      "caju",
      "calafrio",
      "calcular",
      "caldeira",
      "calibrar",
      "calmante",
      "calota",
      "camada",
      "cambista",
      "camisa",
      "camomila",
      "campanha",
      "camuflar",
      "canavial",
      "cancelar",
      "caneta",
      "canguru",
      "canhoto",
      "canivete",
      "canoa",
      "cansado",
      "cantar",
      "canudo",
      "capacho",
      "capela",
      "capinar",
      "capotar",
      "capricho",
      "captador",
      "capuz",
      "caracol",
      "carbono",
      "cardeal",
      "careca",
      "carimbar",
      "carneiro",
      "carpete",
      "carreira",
      "cartaz",
      "carvalho",
      "casaco",
      "casca",
      "casebre",
      "castelo",
      "casulo",
      "catarata",
      "cativar",
      "caule",
      "causador",
      "cautelar",
      "cavalo",
      "caverna",
      "cebola",
      "cedilha",
      "cegonha",
      "celebrar",
      "celular",
      "cenoura",
      "censo",
      "centeio",
      "cercar",
      "cerrado",
      "certeiro",
      "cerveja",
      "cetim",
      "cevada",
      "chacota",
      "chaleira",
      "chamado",
      "chapada",
      "charme",
      "chatice",
      "chave",
      "chefe",
      "chegada",
      "cheiro",
      "cheque",
      "chicote",
      "chifre",
      "chinelo",
      "chocalho",
      "chover",
      "chumbo",
      "chutar",
      "chuva",
      "cicatriz",
      "ciclone",
      "cidade",
      "cidreira",
      "ciente",
      "cigana",
      "cimento",
      "cinto",
      "cinza",
      "ciranda",
      "circuito",
      "cirurgia",
      "citar",
      "clareza",
      "clero",
      "clicar",
      "clone",
      "clube",
      "coado",
      "coagir",
      "cobaia",
      "cobertor",
      "cobrar",
      "cocada",
      "coelho",
      "coentro",
      "coeso",
      "cogumelo",
      "coibir",
      "coifa",
      "coiote",
      "colar",
      "coleira",
      "colher",
      "colidir",
      "colmeia",
      "colono",
      "coluna",
      "comando",
      "combinar",
      "comentar",
      "comitiva",
      "comover",
      "complexo",
      "comum",
      "concha",
      "condor",
      "conectar",
      "confuso",
      "congelar",
      "conhecer",
      "conjugar",
      "consumir",
      "contrato",
      "convite",
      "cooperar",
      "copeiro",
      "copiador",
      "copo",
      "coquetel",
      "coragem",
      "cordial",
      "corneta",
      "coronha",
      "corporal",
      "correio",
      "cortejo",
      "coruja",
      "corvo",
      "cosseno",
      "costela",
      "cotonete",
      "couro",
      "couve",
      "covil",
      "cozinha",
      "cratera",
      "cravo",
      "creche",
      "credor",
      "creme",
      "crer",
      "crespo",
      "criada",
      "criminal",
      "crioulo",
      "crise",
      "criticar",
      "crosta",
      "crua",
      "cruzeiro",
      "cubano",
      "cueca",
      "cuidado",
      "cujo",
      "culatra",
      "culminar",
      "culpar",
      "cultura",
      "cumprir",
      "cunhado",
      "cupido",
      "curativo",
      "curral",
      "cursar",
      "curto",
      "cuspir",
      "custear",
      "cutelo",
      "damasco",
      "datar",
      "debater",
      "debitar",
      "deboche",
      "debulhar",
      "decalque",
      "decimal",
      "declive",
      "decote",
      "decretar",
      "dedal",
      "dedicado",
      "deduzir",
      "defesa",
      "defumar",
      "degelo",
      "degrau",
      "degustar",
      "deitado",
      "deixar",
      "delator",
      "delegado",
      "delinear",
      "delonga",
      "demanda",
      "demitir",
      "demolido",
      "dentista",
      "depenado",
      "depilar",
      "depois",
      "depressa",
      "depurar",
      "deriva",
      "derramar",
      "desafio",
      "desbotar",
      "descanso",
      "desenho",
      "desfiado",
      "desgaste",
      "desigual",
      "deslize",
      "desmamar",
      "desova",
      "despesa",
      "destaque",
      "desviar",
      "detalhar",
      "detentor",
      "detonar",
      "detrito",
      "deusa",
      "dever",
      "devido",
      "devotado",
      "dezena",
      "diagrama",
      "dialeto",
      "didata",
      "difuso",
      "digitar",
      "dilatado",
      "diluente",
      "diminuir",
      "dinastia",
      "dinheiro",
      "diocese",
      "direto",
      "discreta",
      "disfarce",
      "disparo",
      "disquete",
      "dissipar",
      "distante",
      "ditador",
      "diurno",
      "diverso",
      "divisor",
      "divulgar",
      "dizer",
      "dobrador",
      "dolorido",
      "domador",
      "dominado",
      "donativo",
      "donzela",
      "dormente",
      "dorsal",
      "dosagem",
      "dourado",
      "doutor",
      "drenagem",
      "drible",
      "drogaria",
      "duelar",
      "duende",
      "dueto",
      "duplo",
      "duquesa",
      "durante",
      "duvidoso",
      "eclodir",
      "ecoar",
      "ecologia",
      "edificar",
      "edital",
      "educado",
      "efeito",
      "efetivar",
      "ejetar",
      "elaborar",
      "eleger",
      "eleitor",
      "elenco",
      "elevador",
      "eliminar",
      "elogiar",
      "embargo",
      "embolado",
      "embrulho",
      "embutido",
      "emenda",
      "emergir",
      "emissor",
      "empatia",
      "empenho",
      "empinado",
      "empolgar",
      "emprego",
      "empurrar",
      "emulador",
      "encaixe",
      "encenado",
      "enchente",
      "encontro",
      "endeusar",
      "endossar",
      "enfaixar",
      "enfeite",
      "enfim",
      "engajado",
      "engenho",
      "englobar",
      "engomado",
      "engraxar",
      "enguia",
      "enjoar",
      "enlatar",
      "enquanto",
      "enraizar",
      "enrolado",
      "enrugar",
      "ensaio",
      "enseada",
      "ensino",
      "ensopado",
      "entanto",
      "enteado",
      "entidade",
      "entortar",
      "entrada",
      "entulho",
      "envergar",
      "enviado",
      "envolver",
      "enxame",
      "enxerto",
      "enxofre",
      "enxuto",
      "epiderme",
      "equipar",
      "ereto",
      "erguido",
      "errata",
      "erva",
      "ervilha",
      "esbanjar",
      "esbelto",
      "escama",
      "escola",
      "escrita",
      "escuta",
      "esfinge",
      "esfolar",
      "esfregar",
      "esfumado",
      "esgrima",
      "esmalte",
      "espanto",
      "espelho",
      "espiga",
      "esponja",
      "espreita",
      "espumar",
      "esquerda",
      "estaca",
      "esteira",
      "esticar",
      "estofado",
      "estrela",
      "estudo",
      "esvaziar",
      "etanol",
      "etiqueta",
      "euforia",
      "europeu",
      "evacuar",
      "evaporar",
      "evasivo",
      "eventual",
      "evidente",
      "evoluir",
      "exagero",
      "exalar",
      "examinar",
      "exato",
      "exausto",
      "excesso",
      "excitar",
      "exclamar",
      "executar",
      "exemplo",
      "exibir",
      "exigente",
      "exonerar",
      "expandir",
      "expelir",
      "expirar",
      "explanar",
      "exposto",
      "expresso",
      "expulsar",
      "externo",
      "extinto",
      "extrato",
      "fabricar",
      "fabuloso",
      "faceta",
      "facial",
      "fada",
      "fadiga",
      "faixa",
      "falar",
      "falta",
      "familiar",
      "fandango",
      "fanfarra",
      "fantoche",
      "fardado",
      "farelo",
      "farinha",
      "farofa",
      "farpa",
      "fartura",
      "fatia",
      "fator",
      "favorita",
      "faxina",
      "fazenda",
      "fechado",
      "feijoada",
      "feirante",
      "felino",
      "feminino",
      "fenda",
      "feno",
      "fera",
      "feriado",
      "ferrugem",
      "ferver",
      "festejar",
      "fetal",
      "feudal",
      "fiapo",
      "fibrose",
      "ficar",
      "ficheiro",
      "figurado",
      "fileira",
      "filho",
      "filme",
      "filtrar",
      "firmeza",
      "fisgada",
      "fissura",
      "fita",
      "fivela",
      "fixador",
      "fixo",
      "flacidez",
      "flamingo",
      "flanela",
      "flechada",
      "flora",
      "flutuar",
      "fluxo",
      "focal",
      "focinho",
      "fofocar",
      "fogo",
      "foguete",
      "foice",
      "folgado",
      "folheto",
      "forjar",
      "formiga",
      "forno",
      "forte",
      "fosco",
      "fossa",
      "fragata",
      "fralda",
      "frango",
      "frasco",
      "fraterno",
      "freira",
      "frente",
      "fretar",
      "frieza",
      "friso",
      "fritura",
      "fronha",
      "frustrar",
      "fruteira",
      "fugir",
      "fulano",
      "fuligem",
      "fundar",
      "fungo",
      "funil",
      "furador",
      "furioso",
      "futebol",
      "gabarito",
      "gabinete",
      "gado",
      "gaiato",
      "gaiola",
      "gaivota",
      "galega",
      "galho",
      "galinha",
      "galocha",
      "ganhar",
      "garagem",
      "garfo",
      "gargalo",
      "garimpo",
      "garoupa",
      "garrafa",
      "gasoduto",
      "gasto",
      "gata",
      "gatilho",
      "gaveta",
      "gazela",
      "gelado",
      "geleia",
      "gelo",
      "gemada",
      "gemer",
      "gemido",
      "generoso",
      "gengiva",
      "genial",
      "genoma",
      "genro",
      "geologia",
      "gerador",
      "germinar",
      "gesso",
      "gestor",
      "ginasta",
      "gincana",
      "gingado",
      "girafa",
      "girino",
      "glacial",
      "glicose",
      "global",
      "glorioso",
      "goela",
      "goiaba",
      "golfe",
      "golpear",
      "gordura",
      "gorjeta",
      "gorro",
      "gostoso",
      "goteira",
      "governar",
      "gracejo",
      "gradual",
      "grafite",
      "gralha",
      "grampo",
      "granada",
      "gratuito",
      "graveto",
      "graxa",
      "grego",
      "grelhar",
      "greve",
      "grilo",
      "grisalho",
      "gritaria",
      "grosso",
      "grotesco",
      "grudado",
      "grunhido",
      "gruta",
      "guache",
      "guarani",
      "guaxinim",
      "guerrear",
      "guiar",
      "guincho",
      "guisado",
      "gula",
      "guloso",
      "guru",
      "habitar",
      "harmonia",
      "haste",
      "haver",
      "hectare",
      "herdar",
      "heresia",
      "hesitar",
      "hiato",
      "hibernar",
      "hidratar",
      "hiena",
      "hino",
      "hipismo",
      "hipnose",
      "hipoteca",
      "hoje",
      "holofote",
      "homem",
      "honesto",
      "honrado",
      "hormonal",
      "hospedar",
      "humorado",
      "iate",
      "ideia",
      "idoso",
      "ignorado",
      "igreja",
      "iguana",
      "ileso",
      "ilha",
      "iludido",
      "iluminar",
      "ilustrar",
      "imagem",
      "imediato",
      "imenso",
      "imersivo",
      "iminente",
      "imitador",
      "imortal",
      "impacto",
      "impedir",
      "implante",
      "impor",
      "imprensa",
      "impune",
      "imunizar",
      "inalador",
      "inapto",
      "inativo",
      "incenso",
      "inchar",
      "incidir",
      "incluir",
      "incolor",
      "indeciso",
      "indireto",
      "indutor",
      "ineficaz",
      "inerente",
      "infantil",
      "infestar",
      "infinito",
      "inflamar",
      "informal",
      "infrator",
      "ingerir",
      "inibido",
      "inicial",
      "inimigo",
      "injetar",
      "inocente",
      "inodoro",
      "inovador",
      "inox",
      "inquieto",
      "inscrito",
      "inseto",
      "insistir",
      "inspetor",
      "instalar",
      "insulto",
      "intacto",
      "integral",
      "intimar",
      "intocado",
      "intriga",
      "invasor",
      "inverno",
      "invicto",
      "invocar",
      "iogurte",
      "iraniano",
      "ironizar",
      "irreal",
      "irritado",
      "isca",
      "isento",
      "isolado",
      "isqueiro",
      "italiano",
      "janeiro",
      "jangada",
      "janta",
      "jararaca",
      "jardim",
      "jarro",
      "jasmim",
      "jato",
      "javali",
      "jazida",
      "jejum",
      "joaninha",
      "joelhada",
      "jogador",
      "joia",
      "jornal",
      "jorrar",
      "jovem",
      "juba",
      "judeu",
      "judoca",
      "juiz",
      "julgador",
      "julho",
      "jurado",
      "jurista",
      "juro",
      "justa",
      "labareda",
      "laboral",
      "lacre",
      "lactante",
      "ladrilho",
      "lagarta",
      "lagoa",
      "laje",
      "lamber",
      "lamentar",
      "laminar",
      "lampejo",
      "lanche",
      "lapidar",
      "lapso",
      "laranja",
      "lareira",
      "largura",
      "lasanha",
      "lastro",
      "lateral",
      "latido",
      "lavanda",
      "lavoura",
      "lavrador",
      "laxante",
      "lazer",
      "lealdade",
      "lebre",
      "legado",
      "legendar",
      "legista",
      "leigo",
      "leiloar",
      "leitura",
      "lembrete",
      "leme",
      "lenhador",
      "lentilha",
      "leoa",
      "lesma",
      "leste",
      "letivo",
      "letreiro",
      "levar",
      "leveza",
      "levitar",
      "liberal",
      "libido",
      "liderar",
      "ligar",
      "ligeiro",
      "limitar",
      "limoeiro",
      "limpador",
      "linda",
      "linear",
      "linhagem",
      "liquidez",
      "listagem",
      "lisura",
      "litoral",
      "livro",
      "lixa",
      "lixeira",
      "locador",
      "locutor",
      "lojista",
      "lombo",
      "lona",
      "longe",
      "lontra",
      "lorde",
      "lotado",
      "loteria",
      "loucura",
      "lousa",
      "louvar",
      "luar",
      "lucidez",
      "lucro",
      "luneta",
      "lustre",
      "lutador",
      "luva",
      "macaco",
      "macete",
      "machado",
      "macio",
      "madeira",
      "madrinha",
      "magnata",
      "magreza",
      "maior",
      "mais",
      "malandro",
      "malha",
      "malote",
      "maluco",
      "mamilo",
      "mamoeiro",
      "mamute",
      "manada",
      "mancha",
      "mandato",
      "manequim",
      "manhoso",
      "manivela",
      "manobrar",
      "mansa",
      "manter",
      "manusear",
      "mapeado",
      "maquinar",
      "marcador",
      "maresia",
      "marfim",
      "margem",
      "marinho",
      "marmita",
      "maroto",
      "marquise",
      "marreco",
      "martelo",
      "marujo",
      "mascote",
      "masmorra",
      "massagem",
      "mastigar",
      "matagal",
      "materno",
      "matinal",
      "matutar",
      "maxilar",
      "medalha",
      "medida",
      "medusa",
      "megafone",
      "meiga",
      "melancia",
      "melhor",
      "membro",
      "memorial",
      "menino",
      "menos",
      "mensagem",
      "mental",
      "merecer",
      "mergulho",
      "mesada",
      "mesclar",
      "mesmo",
      "mesquita",
      "mestre",
      "metade",
      "meteoro",
      "metragem",
      "mexer",
      "mexicano",
      "micro",
      "migalha",
      "migrar",
      "milagre",
      "milenar",
      "milhar",
      "mimado",
      "minerar",
      "minhoca",
      "ministro",
      "minoria",
      "miolo",
      "mirante",
      "mirtilo",
      "misturar",
      "mocidade",
      "moderno",
      "modular",
      "moeda",
      "moer",
      "moinho",
      "moita",
      "moldura",
      "moleza",
      "molho",
      "molinete",
      "molusco",
      "montanha",
      "moqueca",
      "morango",
      "morcego",
      "mordomo",
      "morena",
      "mosaico",
      "mosquete",
      "mostarda",
      "motel",
      "motim",
      "moto",
      "motriz",
      "muda",
      "muito",
      "mulata",
      "mulher",
      "multar",
      "mundial",
      "munido",
      "muralha",
      "murcho",
      "muscular",
      "museu",
      "musical",
      "nacional",
      "nadador",
      "naja",
      "namoro",
      "narina",
      "narrado",
      "nascer",
      "nativa",
      "natureza",
      "navalha",
      "navegar",
      "navio",
      "neblina",
      "nebuloso",
      "negativa",
      "negociar",
      "negrito",
      "nervoso",
      "neta",
      "neural",
      "nevasca",
      "nevoeiro",
      "ninar",
      "ninho",
      "nitidez",
      "nivelar",
      "nobreza",
      "noite",
      "noiva",
      "nomear",
      "nominal",
      "nordeste",
      "nortear",
      "notar",
      "noticiar",
      "noturno",
      "novelo",
      "novilho",
      "novo",
      "nublado",
      "nudez",
      "numeral",
      "nupcial",
      "nutrir",
      "nuvem",
      "obcecado",
      "obedecer",
      "objetivo",
      "obrigado",
      "obscuro",
      "obstetra",
      "obter",
      "obturar",
      "ocidente",
      "ocioso",
      "ocorrer",
      "oculista",
      "ocupado",
      "ofegante",
      "ofensiva",
      "oferenda",
      "oficina",
      "ofuscado",
      "ogiva",
      "olaria",
      "oleoso",
      "olhar",
      "oliveira",
      "ombro",
      "omelete",
      "omisso",
      "omitir",
      "ondulado",
      "oneroso",
      "ontem",
      "opcional",
      "operador",
      "oponente",
      "oportuno",
      "oposto",
      "orar",
      "orbitar",
      "ordem",
      "ordinal",
      "orfanato",
      "orgasmo",
      "orgulho",
      "oriental",
      "origem",
      "oriundo",
      "orla",
      "ortodoxo",
      "orvalho",
      "oscilar",
      "ossada",
      "osso",
      "ostentar",
      "otimismo",
      "ousadia",
      "outono",
      "outubro",
      "ouvido",
      "ovelha",
      "ovular",
      "oxidar",
      "oxigenar",
      "pacato",
      "paciente",
      "pacote",
      "pactuar",
      "padaria",
      "padrinho",
      "pagar",
      "pagode",
      "painel",
      "pairar",
      "paisagem",
      "palavra",
      "palestra",
      "palheta",
      "palito",
      "palmada",
      "palpitar",
      "pancada",
      "panela",
      "panfleto",
      "panqueca",
      "pantanal",
      "papagaio",
      "papelada",
      "papiro",
      "parafina",
      "parcial",
      "pardal",
      "parede",
      "partida",
      "pasmo",
      "passado",
      "pastel",
      "patamar",
      "patente",
      "patinar",
      "patrono",
      "paulada",
      "pausar",
      "peculiar",
      "pedalar",
      "pedestre",
      "pediatra",
      "pedra",
      "pegada",
      "peitoral",
      "peixe",
      "pele",
      "pelicano",
      "penca",
      "pendurar",
      "peneira",
      "penhasco",
      "pensador",
      "pente",
      "perceber",
      "perfeito",
      "pergunta",
      "perito",
      "permitir",
      "perna",
      "perplexo",
      "persiana",
      "pertence",
      "peruca",
      "pescado",
      "pesquisa",
      "pessoa",
      "petiscar",
      "piada",
      "picado",
      "piedade",
      "pigmento",
      "pilastra",
      "pilhado",
      "pilotar",
      "pimenta",
      "pincel",
      "pinguim",
      "pinha",
      "pinote",
      "pintar",
      "pioneiro",
      "pipoca",
      "piquete",
      "piranha",
      "pires",
      "pirueta",
      "piscar",
      "pistola",
      "pitanga",
      "pivete",
      "planta",
      "plaqueta",
      "platina",
      "plebeu",
      "plumagem",
      "pluvial",
      "pneu",
      "poda",
      "poeira",
      "poetisa",
      "polegada",
      "policiar",
      "poluente",
      "polvilho",
      "pomar",
      "pomba",
      "ponderar",
      "pontaria",
      "populoso",
      "porta",
      "possuir",
      "postal",
      "pote",
      "poupar",
      "pouso",
      "povoar",
      "praia",
      "prancha",
      "prato",
      "praxe",
      "prece",
      "predador",
      "prefeito",
      "premiar",
      "prensar",
      "preparar",
      "presilha",
      "pretexto",
      "prevenir",
      "prezar",
      "primata",
      "princesa",
      "prisma",
      "privado",
      "processo",
      "produto",
      "profeta",
      "proibido",
      "projeto",
      "prometer",
      "propagar",
      "prosa",
      "protetor",
      "provador",
      "publicar",
      "pudim",
      "pular",
      "pulmonar",
      "pulseira",
      "punhal",
      "punir",
      "pupilo",
      "pureza",
      "puxador",
      "quadra",
      "quantia",
      "quarto",
      "quase",
      "quebrar",
      "queda",
      "queijo",
      "quente",
      "querido",
      "quimono",
      "quina",
      "quiosque",
      "rabanada",
      "rabisco",
      "rachar",
      "racionar",
      "radial",
      "raiar",
      "rainha",
      "raio",
      "raiva",
      "rajada",
      "ralado",
      "ramal",
      "ranger",
      "ranhura",
      "rapadura",
      "rapel",
      "rapidez",
      "raposa",
      "raquete",
      "raridade",
      "rasante",
      "rascunho",
      "rasgar",
      "raspador",
      "rasteira",
      "rasurar",
      "ratazana",
      "ratoeira",
      "realeza",
      "reanimar",
      "reaver",
      "rebaixar",
      "rebelde",
      "rebolar",
      "recado",
      "recente",
      "recheio",
      "recibo",
      "recordar",
      "recrutar",
      "recuar",
      "rede",
      "redimir",
      "redonda",
      "reduzida",
      "reenvio",
      "refinar",
      "refletir",
      "refogar",
      "refresco",
      "refugiar",
      "regalia",
      "regime",
      "regra",
      "reinado",
      "reitor",
      "rejeitar",
      "relativo",
      "remador",
      "remendo",
      "remorso",
      "renovado",
      "reparo",
      "repelir",
      "repleto",
      "repolho",
      "represa",
      "repudiar",
      "requerer",
      "resenha",
      "resfriar",
      "resgatar",
      "residir",
      "resolver",
      "respeito",
      "ressaca",
      "restante",
      "resumir",
      "retalho",
      "reter",
      "retirar",
      "retomada",
      "retratar",
      "revelar",
      "revisor",
      "revolta",
      "riacho",
      "rica",
      "rigidez",
      "rigoroso",
      "rimar",
      "ringue",
      "risada",
      "risco",
      "risonho",
      "robalo",
      "rochedo",
      "rodada",
      "rodeio",
      "rodovia",
      "roedor",
      "roleta",
      "romano",
      "roncar",
      "rosado",
      "roseira",
      "rosto",
      "rota",
      "roteiro",
      "rotina",
      "rotular",
      "rouco",
      "roupa",
      "roxo",
      "rubro",
      "rugido",
      "rugoso",
      "ruivo",
      "rumo",
      "rupestre",
      "russo",
      "sabor",
      "saciar",
      "sacola",
      "sacudir",
      "sadio",
      "safira",
      "saga",
      "sagrada",
      "saibro",
      "salada",
      "saleiro",
      "salgado",
      "saliva",
      "salpicar",
      "salsicha",
      "saltar",
      "salvador",
      "sambar",
      "samurai",
      "sanar",
      "sanfona",
      "sangue",
      "sanidade",
      "sapato",
      "sarda",
      "sargento",
      "sarjeta",
      "saturar",
      "saudade",
      "saxofone",
      "sazonal",
      "secar",
      "secular",
      "seda",
      "sedento",
      "sediado",
      "sedoso",
      "sedutor",
      "segmento",
      "segredo",
      "segundo",
      "seiva",
      "seleto",
      "selvagem",
      "semanal",
      "semente",
      "senador",
      "senhor",
      "sensual",
      "sentado",
      "separado",
      "sereia",
      "seringa",
      "serra",
      "servo",
      "setembro",
      "setor",
      "sigilo",
      "silhueta",
      "silicone",
      "simetria",
      "simpatia",
      "simular",
      "sinal",
      "sincero",
      "singular",
      "sinopse",
      "sintonia",
      "sirene",
      "siri",
      "situado",
      "soberano",
      "sobra",
      "socorro",
      "sogro",
      "soja",
      "solda",
      "soletrar",
      "solteiro",
      "sombrio",
      "sonata",
      "sondar",
      "sonegar",
      "sonhador",
      "sono",
      "soprano",
      "soquete",
      "sorrir",
      "sorteio",
      "sossego",
      "sotaque",
      "soterrar",
      "sovado",
      "sozinho",
      "suavizar",
      "subida",
      "submerso",
      "subsolo",
      "subtrair",
      "sucata",
      "sucesso",
      "suco",
      "sudeste",
      "sufixo",
      "sugador",
      "sugerir",
      "sujeito",
      "sulfato",
      "sumir",
      "suor",
      "superior",
      "suplicar",
      "suposto",
      "suprimir",
      "surdina",
      "surfista",
      "surpresa",
      "surreal",
      "surtir",
      "suspiro",
      "sustento",
      "tabela",
      "tablete",
      "tabuada",
      "tacho",
      "tagarela",
      "talher",
      "talo",
      "talvez",
      "tamanho",
      "tamborim",
      "tampa",
      "tangente",
      "tanto",
      "tapar",
      "tapioca",
      "tardio",
      "tarefa",
      "tarja",
      "tarraxa",
      "tatuagem",
      "taurino",
      "taxativo",
      "taxista",
      "teatral",
      "tecer",
      "tecido",
      "teclado",
      "tedioso",
      "teia",
      "teimar",
      "telefone",
      "telhado",
      "tempero",
      "tenente",
      "tensor",
      "tentar",
      "termal",
      "terno",
      "terreno",
      "tese",
      "tesoura",
      "testado",
      "teto",
      "textura",
      "texugo",
      "tiara",
      "tigela",
      "tijolo",
      "timbrar",
      "timidez",
      "tingido",
      "tinteiro",
      "tiragem",
      "titular",
      "toalha",
      "tocha",
      "tolerar",
      "tolice",
      "tomada",
      "tomilho",
      "tonel",
      "tontura",
      "topete",
      "tora",
      "torcido",
      "torneio",
      "torque",
      "torrada",
      "torto",
      "tostar",
      "touca",
      "toupeira",
      "toxina",
      "trabalho",
      "tracejar",
      "tradutor",
      "trafegar",
      "trajeto",
      "trama",
      "trancar",
      "trapo",
      "traseiro",
      "tratador",
      "travar",
      "treino",
      "tremer",
      "trepidar",
      "trevo",
      "triagem",
      "tribo",
      "triciclo",
      "tridente",
      "trilogia",
      "trindade",
      "triplo",
      "triturar",
      "triunfal",
      "trocar",
      "trombeta",
      "trova",
      "trunfo",
      "truque",
      "tubular",
      "tucano",
      "tudo",
      "tulipa",
      "tupi",
      "turbo",
      "turma",
      "turquesa",
      "tutelar",
      "tutorial",
      "uivar",
      "umbigo",
      "unha",
      "unidade",
      "uniforme",
      "urologia",
      "urso",
      "urtiga",
      "urubu",
      "usado",
      "usina",
      "usufruir",
      "vacina",
      "vadiar",
      "vagaroso",
      "vaidoso",
      "vala",
      "valente",
      "validade",
      "valores",
      "vantagem",
      "vaqueiro",
      "varanda",
      "vareta",
      "varrer",
      "vascular",
      "vasilha",
      "vassoura",
      "vazar",
      "vazio",
      "veado",
      "vedar",
      "vegetar",
      "veicular",
      "veleiro",
      "velhice",
      "veludo",
      "vencedor",
      "vendaval",
      "venerar",
      "ventre",
      "verbal",
      "verdade",
      "vereador",
      "vergonha",
      "vermelho",
      "verniz",
      "versar",
      "vertente",
      "vespa",
      "vestido",
      "vetorial",
      "viaduto",
      "viagem",
      "viajar",
      "viatura",
      "vibrador",
      "videira",
      "vidraria",
      "viela",
      "viga",
      "vigente",
      "vigiar",
      "vigorar",
      "vilarejo",
      "vinco",
      "vinheta",
      "vinil",
      "violeta",
      "virada",
      "virtude",
      "visitar",
      "visto",
      "vitral",
      "viveiro",
      "vizinho",
      "voador",
      "voar",
      "vogal",
      "volante",
      "voleibol",
      "voltagem",
      "volumoso",
      "vontade",
      "vulto",
      "vuvuzela",
      "xadrez",
      "xarope",
      "xeque",
      "xeretar",
      "xerife",
      "xingar",
      "zangado",
      "zarpar",
      "zebu",
      "zelador",
      "zombar",
      "zoologia",
      "zumbido"
    ];
  }
});

// ../node_modules/bip39/src/wordlists/english.json
var require_english = __commonJS({
  "../node_modules/bip39/src/wordlists/english.json"(exports, module) {
    module.exports = [
      "abandon",
      "ability",
      "able",
      "about",
      "above",
      "absent",
      "absorb",
      "abstract",
      "absurd",
      "abuse",
      "access",
      "accident",
      "account",
      "accuse",
      "achieve",
      "acid",
      "acoustic",
      "acquire",
      "across",
      "act",
      "action",
      "actor",
      "actress",
      "actual",
      "adapt",
      "add",
      "addict",
      "address",
      "adjust",
      "admit",
      "adult",
      "advance",
      "advice",
      "aerobic",
      "affair",
      "afford",
      "afraid",
      "again",
      "age",
      "agent",
      "agree",
      "ahead",
      "aim",
      "air",
      "airport",
      "aisle",
      "alarm",
      "album",
      "alcohol",
      "alert",
      "alien",
      "all",
      "alley",
      "allow",
      "almost",
      "alone",
      "alpha",
      "already",
      "also",
      "alter",
      "always",
      "amateur",
      "amazing",
      "among",
      "amount",
      "amused",
      "analyst",
      "anchor",
      "ancient",
      "anger",
      "angle",
      "angry",
      "animal",
      "ankle",
      "announce",
      "annual",
      "another",
      "answer",
      "antenna",
      "antique",
      "anxiety",
      "any",
      "apart",
      "apology",
      "appear",
      "apple",
      "approve",
      "april",
      "arch",
      "arctic",
      "area",
      "arena",
      "argue",
      "arm",
      "armed",
      "armor",
      "army",
      "around",
      "arrange",
      "arrest",
      "arrive",
      "arrow",
      "art",
      "artefact",
      "artist",
      "artwork",
      "ask",
      "aspect",
      "assault",
      "asset",
      "assist",
      "assume",
      "asthma",
      "athlete",
      "atom",
      "attack",
      "attend",
      "attitude",
      "attract",
      "auction",
      "audit",
      "august",
      "aunt",
      "author",
      "auto",
      "autumn",
      "average",
      "avocado",
      "avoid",
      "awake",
      "aware",
      "away",
      "awesome",
      "awful",
      "awkward",
      "axis",
      "baby",
      "bachelor",
      "bacon",
      "badge",
      "bag",
      "balance",
      "balcony",
      "ball",
      "bamboo",
      "banana",
      "banner",
      "bar",
      "barely",
      "bargain",
      "barrel",
      "base",
      "basic",
      "basket",
      "battle",
      "beach",
      "bean",
      "beauty",
      "because",
      "become",
      "beef",
      "before",
      "begin",
      "behave",
      "behind",
      "believe",
      "below",
      "belt",
      "bench",
      "benefit",
      "best",
      "betray",
      "better",
      "between",
      "beyond",
      "bicycle",
      "bid",
      "bike",
      "bind",
      "biology",
      "bird",
      "birth",
      "bitter",
      "black",
      "blade",
      "blame",
      "blanket",
      "blast",
      "bleak",
      "bless",
      "blind",
      "blood",
      "blossom",
      "blouse",
      "blue",
      "blur",
      "blush",
      "board",
      "boat",
      "body",
      "boil",
      "bomb",
      "bone",
      "bonus",
      "book",
      "boost",
      "border",
      "boring",
      "borrow",
      "boss",
      "bottom",
      "bounce",
      "box",
      "boy",
      "bracket",
      "brain",
      "brand",
      "brass",
      "brave",
      "bread",
      "breeze",
      "brick",
      "bridge",
      "brief",
      "bright",
      "bring",
      "brisk",
      "broccoli",
      "broken",
      "bronze",
      "broom",
      "brother",
      "brown",
      "brush",
      "bubble",
      "buddy",
      "budget",
      "buffalo",
      "build",
      "bulb",
      "bulk",
      "bullet",
      "bundle",
      "bunker",
      "burden",
      "burger",
      "burst",
      "bus",
      "business",
      "busy",
      "butter",
      "buyer",
      "buzz",
      "cabbage",
      "cabin",
      "cable",
      "cactus",
      "cage",
      "cake",
      "call",
      "calm",
      "camera",
      "camp",
      "can",
      "canal",
      "cancel",
      "candy",
      "cannon",
      "canoe",
      "canvas",
      "canyon",
      "capable",
      "capital",
      "captain",
      "car",
      "carbon",
      "card",
      "cargo",
      "carpet",
      "carry",
      "cart",
      "case",
      "cash",
      "casino",
      "castle",
      "casual",
      "cat",
      "catalog",
      "catch",
      "category",
      "cattle",
      "caught",
      "cause",
      "caution",
      "cave",
      "ceiling",
      "celery",
      "cement",
      "census",
      "century",
      "cereal",
      "certain",
      "chair",
      "chalk",
      "champion",
      "change",
      "chaos",
      "chapter",
      "charge",
      "chase",
      "chat",
      "cheap",
      "check",
      "cheese",
      "chef",
      "cherry",
      "chest",
      "chicken",
      "chief",
      "child",
      "chimney",
      "choice",
      "choose",
      "chronic",
      "chuckle",
      "chunk",
      "churn",
      "cigar",
      "cinnamon",
      "circle",
      "citizen",
      "city",
      "civil",
      "claim",
      "clap",
      "clarify",
      "claw",
      "clay",
      "clean",
      "clerk",
      "clever",
      "click",
      "client",
      "cliff",
      "climb",
      "clinic",
      "clip",
      "clock",
      "clog",
      "close",
      "cloth",
      "cloud",
      "clown",
      "club",
      "clump",
      "cluster",
      "clutch",
      "coach",
      "coast",
      "coconut",
      "code",
      "coffee",
      "coil",
      "coin",
      "collect",
      "color",
      "column",
      "combine",
      "come",
      "comfort",
      "comic",
      "common",
      "company",
      "concert",
      "conduct",
      "confirm",
      "congress",
      "connect",
      "consider",
      "control",
      "convince",
      "cook",
      "cool",
      "copper",
      "copy",
      "coral",
      "core",
      "corn",
      "correct",
      "cost",
      "cotton",
      "couch",
      "country",
      "couple",
      "course",
      "cousin",
      "cover",
      "coyote",
      "crack",
      "cradle",
      "craft",
      "cram",
      "crane",
      "crash",
      "crater",
      "crawl",
      "crazy",
      "cream",
      "credit",
      "creek",
      "crew",
      "cricket",
      "crime",
      "crisp",
      "critic",
      "crop",
      "cross",
      "crouch",
      "crowd",
      "crucial",
      "cruel",
      "cruise",
      "crumble",
      "crunch",
      "crush",
      "cry",
      "crystal",
      "cube",
      "culture",
      "cup",
      "cupboard",
      "curious",
      "current",
      "curtain",
      "curve",
      "cushion",
      "custom",
      "cute",
      "cycle",
      "dad",
      "damage",
      "damp",
      "dance",
      "danger",
      "daring",
      "dash",
      "daughter",
      "dawn",
      "day",
      "deal",
      "debate",
      "debris",
      "decade",
      "december",
      "decide",
      "decline",
      "decorate",
      "decrease",
      "deer",
      "defense",
      "define",
      "defy",
      "degree",
      "delay",
      "deliver",
      "demand",
      "demise",
      "denial",
      "dentist",
      "deny",
      "depart",
      "depend",
      "deposit",
      "depth",
      "deputy",
      "derive",
      "describe",
      "desert",
      "design",
      "desk",
      "despair",
      "destroy",
      "detail",
      "detect",
      "develop",
      "device",
      "devote",
      "diagram",
      "dial",
      "diamond",
      "diary",
      "dice",
      "diesel",
      "diet",
      "differ",
      "digital",
      "dignity",
      "dilemma",
      "dinner",
      "dinosaur",
      "direct",
      "dirt",
      "disagree",
      "discover",
      "disease",
      "dish",
      "dismiss",
      "disorder",
      "display",
      "distance",
      "divert",
      "divide",
      "divorce",
      "dizzy",
      "doctor",
      "document",
      "dog",
      "doll",
      "dolphin",
      "domain",
      "donate",
      "donkey",
      "donor",
      "door",
      "dose",
      "double",
      "dove",
      "draft",
      "dragon",
      "drama",
      "drastic",
      "draw",
      "dream",
      "dress",
      "drift",
      "drill",
      "drink",
      "drip",
      "drive",
      "drop",
      "drum",
      "dry",
      "duck",
      "dumb",
      "dune",
      "during",
      "dust",
      "dutch",
      "duty",
      "dwarf",
      "dynamic",
      "eager",
      "eagle",
      "early",
      "earn",
      "earth",
      "easily",
      "east",
      "easy",
      "echo",
      "ecology",
      "economy",
      "edge",
      "edit",
      "educate",
      "effort",
      "egg",
      "eight",
      "either",
      "elbow",
      "elder",
      "electric",
      "elegant",
      "element",
      "elephant",
      "elevator",
      "elite",
      "else",
      "embark",
      "embody",
      "embrace",
      "emerge",
      "emotion",
      "employ",
      "empower",
      "empty",
      "enable",
      "enact",
      "end",
      "endless",
      "endorse",
      "enemy",
      "energy",
      "enforce",
      "engage",
      "engine",
      "enhance",
      "enjoy",
      "enlist",
      "enough",
      "enrich",
      "enroll",
      "ensure",
      "enter",
      "entire",
      "entry",
      "envelope",
      "episode",
      "equal",
      "equip",
      "era",
      "erase",
      "erode",
      "erosion",
      "error",
      "erupt",
      "escape",
      "essay",
      "essence",
      "estate",
      "eternal",
      "ethics",
      "evidence",
      "evil",
      "evoke",
      "evolve",
      "exact",
      "example",
      "excess",
      "exchange",
      "excite",
      "exclude",
      "excuse",
      "execute",
      "exercise",
      "exhaust",
      "exhibit",
      "exile",
      "exist",
      "exit",
      "exotic",
      "expand",
      "expect",
      "expire",
      "explain",
      "expose",
      "express",
      "extend",
      "extra",
      "eye",
      "eyebrow",
      "fabric",
      "face",
      "faculty",
      "fade",
      "faint",
      "faith",
      "fall",
      "false",
      "fame",
      "family",
      "famous",
      "fan",
      "fancy",
      "fantasy",
      "farm",
      "fashion",
      "fat",
      "fatal",
      "father",
      "fatigue",
      "fault",
      "favorite",
      "feature",
      "february",
      "federal",
      "fee",
      "feed",
      "feel",
      "female",
      "fence",
      "festival",
      "fetch",
      "fever",
      "few",
      "fiber",
      "fiction",
      "field",
      "figure",
      "file",
      "film",
      "filter",
      "final",
      "find",
      "fine",
      "finger",
      "finish",
      "fire",
      "firm",
      "first",
      "fiscal",
      "fish",
      "fit",
      "fitness",
      "fix",
      "flag",
      "flame",
      "flash",
      "flat",
      "flavor",
      "flee",
      "flight",
      "flip",
      "float",
      "flock",
      "floor",
      "flower",
      "fluid",
      "flush",
      "fly",
      "foam",
      "focus",
      "fog",
      "foil",
      "fold",
      "follow",
      "food",
      "foot",
      "force",
      "forest",
      "forget",
      "fork",
      "fortune",
      "forum",
      "forward",
      "fossil",
      "foster",
      "found",
      "fox",
      "fragile",
      "frame",
      "frequent",
      "fresh",
      "friend",
      "fringe",
      "frog",
      "front",
      "frost",
      "frown",
      "frozen",
      "fruit",
      "fuel",
      "fun",
      "funny",
      "furnace",
      "fury",
      "future",
      "gadget",
      "gain",
      "galaxy",
      "gallery",
      "game",
      "gap",
      "garage",
      "garbage",
      "garden",
      "garlic",
      "garment",
      "gas",
      "gasp",
      "gate",
      "gather",
      "gauge",
      "gaze",
      "general",
      "genius",
      "genre",
      "gentle",
      "genuine",
      "gesture",
      "ghost",
      "giant",
      "gift",
      "giggle",
      "ginger",
      "giraffe",
      "girl",
      "give",
      "glad",
      "glance",
      "glare",
      "glass",
      "glide",
      "glimpse",
      "globe",
      "gloom",
      "glory",
      "glove",
      "glow",
      "glue",
      "goat",
      "goddess",
      "gold",
      "good",
      "goose",
      "gorilla",
      "gospel",
      "gossip",
      "govern",
      "gown",
      "grab",
      "grace",
      "grain",
      "grant",
      "grape",
      "grass",
      "gravity",
      "great",
      "green",
      "grid",
      "grief",
      "grit",
      "grocery",
      "group",
      "grow",
      "grunt",
      "guard",
      "guess",
      "guide",
      "guilt",
      "guitar",
      "gun",
      "gym",
      "habit",
      "hair",
      "half",
      "hammer",
      "hamster",
      "hand",
      "happy",
      "harbor",
      "hard",
      "harsh",
      "harvest",
      "hat",
      "have",
      "hawk",
      "hazard",
      "head",
      "health",
      "heart",
      "heavy",
      "hedgehog",
      "height",
      "hello",
      "helmet",
      "help",
      "hen",
      "hero",
      "hidden",
      "high",
      "hill",
      "hint",
      "hip",
      "hire",
      "history",
      "hobby",
      "hockey",
      "hold",
      "hole",
      "holiday",
      "hollow",
      "home",
      "honey",
      "hood",
      "hope",
      "horn",
      "horror",
      "horse",
      "hospital",
      "host",
      "hotel",
      "hour",
      "hover",
      "hub",
      "huge",
      "human",
      "humble",
      "humor",
      "hundred",
      "hungry",
      "hunt",
      "hurdle",
      "hurry",
      "hurt",
      "husband",
      "hybrid",
      "ice",
      "icon",
      "idea",
      "identify",
      "idle",
      "ignore",
      "ill",
      "illegal",
      "illness",
      "image",
      "imitate",
      "immense",
      "immune",
      "impact",
      "impose",
      "improve",
      "impulse",
      "inch",
      "include",
      "income",
      "increase",
      "index",
      "indicate",
      "indoor",
      "industry",
      "infant",
      "inflict",
      "inform",
      "inhale",
      "inherit",
      "initial",
      "inject",
      "injury",
      "inmate",
      "inner",
      "innocent",
      "input",
      "inquiry",
      "insane",
      "insect",
      "inside",
      "inspire",
      "install",
      "intact",
      "interest",
      "into",
      "invest",
      "invite",
      "involve",
      "iron",
      "island",
      "isolate",
      "issue",
      "item",
      "ivory",
      "jacket",
      "jaguar",
      "jar",
      "jazz",
      "jealous",
      "jeans",
      "jelly",
      "jewel",
      "job",
      "join",
      "joke",
      "journey",
      "joy",
      "judge",
      "juice",
      "jump",
      "jungle",
      "junior",
      "junk",
      "just",
      "kangaroo",
      "keen",
      "keep",
      "ketchup",
      "key",
      "kick",
      "kid",
      "kidney",
      "kind",
      "kingdom",
      "kiss",
      "kit",
      "kitchen",
      "kite",
      "kitten",
      "kiwi",
      "knee",
      "knife",
      "knock",
      "know",
      "lab",
      "label",
      "labor",
      "ladder",
      "lady",
      "lake",
      "lamp",
      "language",
      "laptop",
      "large",
      "later",
      "latin",
      "laugh",
      "laundry",
      "lava",
      "law",
      "lawn",
      "lawsuit",
      "layer",
      "lazy",
      "leader",
      "leaf",
      "learn",
      "leave",
      "lecture",
      "left",
      "leg",
      "legal",
      "legend",
      "leisure",
      "lemon",
      "lend",
      "length",
      "lens",
      "leopard",
      "lesson",
      "letter",
      "level",
      "liar",
      "liberty",
      "library",
      "license",
      "life",
      "lift",
      "light",
      "like",
      "limb",
      "limit",
      "link",
      "lion",
      "liquid",
      "list",
      "little",
      "live",
      "lizard",
      "load",
      "loan",
      "lobster",
      "local",
      "lock",
      "logic",
      "lonely",
      "long",
      "loop",
      "lottery",
      "loud",
      "lounge",
      "love",
      "loyal",
      "lucky",
      "luggage",
      "lumber",
      "lunar",
      "lunch",
      "luxury",
      "lyrics",
      "machine",
      "mad",
      "magic",
      "magnet",
      "maid",
      "mail",
      "main",
      "major",
      "make",
      "mammal",
      "man",
      "manage",
      "mandate",
      "mango",
      "mansion",
      "manual",
      "maple",
      "marble",
      "march",
      "margin",
      "marine",
      "market",
      "marriage",
      "mask",
      "mass",
      "master",
      "match",
      "material",
      "math",
      "matrix",
      "matter",
      "maximum",
      "maze",
      "meadow",
      "mean",
      "measure",
      "meat",
      "mechanic",
      "medal",
      "media",
      "melody",
      "melt",
      "member",
      "memory",
      "mention",
      "menu",
      "mercy",
      "merge",
      "merit",
      "merry",
      "mesh",
      "message",
      "metal",
      "method",
      "middle",
      "midnight",
      "milk",
      "million",
      "mimic",
      "mind",
      "minimum",
      "minor",
      "minute",
      "miracle",
      "mirror",
      "misery",
      "miss",
      "mistake",
      "mix",
      "mixed",
      "mixture",
      "mobile",
      "model",
      "modify",
      "mom",
      "moment",
      "monitor",
      "monkey",
      "monster",
      "month",
      "moon",
      "moral",
      "more",
      "morning",
      "mosquito",
      "mother",
      "motion",
      "motor",
      "mountain",
      "mouse",
      "move",
      "movie",
      "much",
      "muffin",
      "mule",
      "multiply",
      "muscle",
      "museum",
      "mushroom",
      "music",
      "must",
      "mutual",
      "myself",
      "mystery",
      "myth",
      "naive",
      "name",
      "napkin",
      "narrow",
      "nasty",
      "nation",
      "nature",
      "near",
      "neck",
      "need",
      "negative",
      "neglect",
      "neither",
      "nephew",
      "nerve",
      "nest",
      "net",
      "network",
      "neutral",
      "never",
      "news",
      "next",
      "nice",
      "night",
      "noble",
      "noise",
      "nominee",
      "noodle",
      "normal",
      "north",
      "nose",
      "notable",
      "note",
      "nothing",
      "notice",
      "novel",
      "now",
      "nuclear",
      "number",
      "nurse",
      "nut",
      "oak",
      "obey",
      "object",
      "oblige",
      "obscure",
      "observe",
      "obtain",
      "obvious",
      "occur",
      "ocean",
      "october",
      "odor",
      "off",
      "offer",
      "office",
      "often",
      "oil",
      "okay",
      "old",
      "olive",
      "olympic",
      "omit",
      "once",
      "one",
      "onion",
      "online",
      "only",
      "open",
      "opera",
      "opinion",
      "oppose",
      "option",
      "orange",
      "orbit",
      "orchard",
      "order",
      "ordinary",
      "organ",
      "orient",
      "original",
      "orphan",
      "ostrich",
      "other",
      "outdoor",
      "outer",
      "output",
      "outside",
      "oval",
      "oven",
      "over",
      "own",
      "owner",
      "oxygen",
      "oyster",
      "ozone",
      "pact",
      "paddle",
      "page",
      "pair",
      "palace",
      "palm",
      "panda",
      "panel",
      "panic",
      "panther",
      "paper",
      "parade",
      "parent",
      "park",
      "parrot",
      "party",
      "pass",
      "patch",
      "path",
      "patient",
      "patrol",
      "pattern",
      "pause",
      "pave",
      "payment",
      "peace",
      "peanut",
      "pear",
      "peasant",
      "pelican",
      "pen",
      "penalty",
      "pencil",
      "people",
      "pepper",
      "perfect",
      "permit",
      "person",
      "pet",
      "phone",
      "photo",
      "phrase",
      "physical",
      "piano",
      "picnic",
      "picture",
      "piece",
      "pig",
      "pigeon",
      "pill",
      "pilot",
      "pink",
      "pioneer",
      "pipe",
      "pistol",
      "pitch",
      "pizza",
      "place",
      "planet",
      "plastic",
      "plate",
      "play",
      "please",
      "pledge",
      "pluck",
      "plug",
      "plunge",
      "poem",
      "poet",
      "point",
      "polar",
      "pole",
      "police",
      "pond",
      "pony",
      "pool",
      "popular",
      "portion",
      "position",
      "possible",
      "post",
      "potato",
      "pottery",
      "poverty",
      "powder",
      "power",
      "practice",
      "praise",
      "predict",
      "prefer",
      "prepare",
      "present",
      "pretty",
      "prevent",
      "price",
      "pride",
      "primary",
      "print",
      "priority",
      "prison",
      "private",
      "prize",
      "problem",
      "process",
      "produce",
      "profit",
      "program",
      "project",
      "promote",
      "proof",
      "property",
      "prosper",
      "protect",
      "proud",
      "provide",
      "public",
      "pudding",
      "pull",
      "pulp",
      "pulse",
      "pumpkin",
      "punch",
      "pupil",
      "puppy",
      "purchase",
      "purity",
      "purpose",
      "purse",
      "push",
      "put",
      "puzzle",
      "pyramid",
      "quality",
      "quantum",
      "quarter",
      "question",
      "quick",
      "quit",
      "quiz",
      "quote",
      "rabbit",
      "raccoon",
      "race",
      "rack",
      "radar",
      "radio",
      "rail",
      "rain",
      "raise",
      "rally",
      "ramp",
      "ranch",
      "random",
      "range",
      "rapid",
      "rare",
      "rate",
      "rather",
      "raven",
      "raw",
      "razor",
      "ready",
      "real",
      "reason",
      "rebel",
      "rebuild",
      "recall",
      "receive",
      "recipe",
      "record",
      "recycle",
      "reduce",
      "reflect",
      "reform",
      "refuse",
      "region",
      "regret",
      "regular",
      "reject",
      "relax",
      "release",
      "relief",
      "rely",
      "remain",
      "remember",
      "remind",
      "remove",
      "render",
      "renew",
      "rent",
      "reopen",
      "repair",
      "repeat",
      "replace",
      "report",
      "require",
      "rescue",
      "resemble",
      "resist",
      "resource",
      "response",
      "result",
      "retire",
      "retreat",
      "return",
      "reunion",
      "reveal",
      "review",
      "reward",
      "rhythm",
      "rib",
      "ribbon",
      "rice",
      "rich",
      "ride",
      "ridge",
      "rifle",
      "right",
      "rigid",
      "ring",
      "riot",
      "ripple",
      "risk",
      "ritual",
      "rival",
      "river",
      "road",
      "roast",
      "robot",
      "robust",
      "rocket",
      "romance",
      "roof",
      "rookie",
      "room",
      "rose",
      "rotate",
      "rough",
      "round",
      "route",
      "royal",
      "rubber",
      "rude",
      "rug",
      "rule",
      "run",
      "runway",
      "rural",
      "sad",
      "saddle",
      "sadness",
      "safe",
      "sail",
      "salad",
      "salmon",
      "salon",
      "salt",
      "salute",
      "same",
      "sample",
      "sand",
      "satisfy",
      "satoshi",
      "sauce",
      "sausage",
      "save",
      "say",
      "scale",
      "scan",
      "scare",
      "scatter",
      "scene",
      "scheme",
      "school",
      "science",
      "scissors",
      "scorpion",
      "scout",
      "scrap",
      "screen",
      "script",
      "scrub",
      "sea",
      "search",
      "season",
      "seat",
      "second",
      "secret",
      "section",
      "security",
      "seed",
      "seek",
      "segment",
      "select",
      "sell",
      "seminar",
      "senior",
      "sense",
      "sentence",
      "series",
      "service",
      "session",
      "settle",
      "setup",
      "seven",
      "shadow",
      "shaft",
      "shallow",
      "share",
      "shed",
      "shell",
      "sheriff",
      "shield",
      "shift",
      "shine",
      "ship",
      "shiver",
      "shock",
      "shoe",
      "shoot",
      "shop",
      "short",
      "shoulder",
      "shove",
      "shrimp",
      "shrug",
      "shuffle",
      "shy",
      "sibling",
      "sick",
      "side",
      "siege",
      "sight",
      "sign",
      "silent",
      "silk",
      "silly",
      "silver",
      "similar",
      "simple",
      "since",
      "sing",
      "siren",
      "sister",
      "situate",
      "six",
      "size",
      "skate",
      "sketch",
      "ski",
      "skill",
      "skin",
      "skirt",
      "skull",
      "slab",
      "slam",
      "sleep",
      "slender",
      "slice",
      "slide",
      "slight",
      "slim",
      "slogan",
      "slot",
      "slow",
      "slush",
      "small",
      "smart",
      "smile",
      "smoke",
      "smooth",
      "snack",
      "snake",
      "snap",
      "sniff",
      "snow",
      "soap",
      "soccer",
      "social",
      "sock",
      "soda",
      "soft",
      "solar",
      "soldier",
      "solid",
      "solution",
      "solve",
      "someone",
      "song",
      "soon",
      "sorry",
      "sort",
      "soul",
      "sound",
      "soup",
      "source",
      "south",
      "space",
      "spare",
      "spatial",
      "spawn",
      "speak",
      "special",
      "speed",
      "spell",
      "spend",
      "sphere",
      "spice",
      "spider",
      "spike",
      "spin",
      "spirit",
      "split",
      "spoil",
      "sponsor",
      "spoon",
      "sport",
      "spot",
      "spray",
      "spread",
      "spring",
      "spy",
      "square",
      "squeeze",
      "squirrel",
      "stable",
      "stadium",
      "staff",
      "stage",
      "stairs",
      "stamp",
      "stand",
      "start",
      "state",
      "stay",
      "steak",
      "steel",
      "stem",
      "step",
      "stereo",
      "stick",
      "still",
      "sting",
      "stock",
      "stomach",
      "stone",
      "stool",
      "story",
      "stove",
      "strategy",
      "street",
      "strike",
      "strong",
      "struggle",
      "student",
      "stuff",
      "stumble",
      "style",
      "subject",
      "submit",
      "subway",
      "success",
      "such",
      "sudden",
      "suffer",
      "sugar",
      "suggest",
      "suit",
      "summer",
      "sun",
      "sunny",
      "sunset",
      "super",
      "supply",
      "supreme",
      "sure",
      "surface",
      "surge",
      "surprise",
      "surround",
      "survey",
      "suspect",
      "sustain",
      "swallow",
      "swamp",
      "swap",
      "swarm",
      "swear",
      "sweet",
      "swift",
      "swim",
      "swing",
      "switch",
      "sword",
      "symbol",
      "symptom",
      "syrup",
      "system",
      "table",
      "tackle",
      "tag",
      "tail",
      "talent",
      "talk",
      "tank",
      "tape",
      "target",
      "task",
      "taste",
      "tattoo",
      "taxi",
      "teach",
      "team",
      "tell",
      "ten",
      "tenant",
      "tennis",
      "tent",
      "term",
      "test",
      "text",
      "thank",
      "that",
      "theme",
      "then",
      "theory",
      "there",
      "they",
      "thing",
      "this",
      "thought",
      "three",
      "thrive",
      "throw",
      "thumb",
      "thunder",
      "ticket",
      "tide",
      "tiger",
      "tilt",
      "timber",
      "time",
      "tiny",
      "tip",
      "tired",
      "tissue",
      "title",
      "toast",
      "tobacco",
      "today",
      "toddler",
      "toe",
      "together",
      "toilet",
      "token",
      "tomato",
      "tomorrow",
      "tone",
      "tongue",
      "tonight",
      "tool",
      "tooth",
      "top",
      "topic",
      "topple",
      "torch",
      "tornado",
      "tortoise",
      "toss",
      "total",
      "tourist",
      "toward",
      "tower",
      "town",
      "toy",
      "track",
      "trade",
      "traffic",
      "tragic",
      "train",
      "transfer",
      "trap",
      "trash",
      "travel",
      "tray",
      "treat",
      "tree",
      "trend",
      "trial",
      "tribe",
      "trick",
      "trigger",
      "trim",
      "trip",
      "trophy",
      "trouble",
      "truck",
      "true",
      "truly",
      "trumpet",
      "trust",
      "truth",
      "try",
      "tube",
      "tuition",
      "tumble",
      "tuna",
      "tunnel",
      "turkey",
      "turn",
      "turtle",
      "twelve",
      "twenty",
      "twice",
      "twin",
      "twist",
      "two",
      "type",
      "typical",
      "ugly",
      "umbrella",
      "unable",
      "unaware",
      "uncle",
      "uncover",
      "under",
      "undo",
      "unfair",
      "unfold",
      "unhappy",
      "uniform",
      "unique",
      "unit",
      "universe",
      "unknown",
      "unlock",
      "until",
      "unusual",
      "unveil",
      "update",
      "upgrade",
      "uphold",
      "upon",
      "upper",
      "upset",
      "urban",
      "urge",
      "usage",
      "use",
      "used",
      "useful",
      "useless",
      "usual",
      "utility",
      "vacant",
      "vacuum",
      "vague",
      "valid",
      "valley",
      "valve",
      "van",
      "vanish",
      "vapor",
      "various",
      "vast",
      "vault",
      "vehicle",
      "velvet",
      "vendor",
      "venture",
      "venue",
      "verb",
      "verify",
      "version",
      "very",
      "vessel",
      "veteran",
      "viable",
      "vibrant",
      "vicious",
      "victory",
      "video",
      "view",
      "village",
      "vintage",
      "violin",
      "virtual",
      "virus",
      "visa",
      "visit",
      "visual",
      "vital",
      "vivid",
      "vocal",
      "voice",
      "void",
      "volcano",
      "volume",
      "vote",
      "voyage",
      "wage",
      "wagon",
      "wait",
      "walk",
      "wall",
      "walnut",
      "want",
      "warfare",
      "warm",
      "warrior",
      "wash",
      "wasp",
      "waste",
      "water",
      "wave",
      "way",
      "wealth",
      "weapon",
      "wear",
      "weasel",
      "weather",
      "web",
      "wedding",
      "weekend",
      "weird",
      "welcome",
      "west",
      "wet",
      "whale",
      "what",
      "wheat",
      "wheel",
      "when",
      "where",
      "whip",
      "whisper",
      "wide",
      "width",
      "wife",
      "wild",
      "will",
      "win",
      "window",
      "wine",
      "wing",
      "wink",
      "winner",
      "winter",
      "wire",
      "wisdom",
      "wise",
      "wish",
      "witness",
      "wolf",
      "woman",
      "wonder",
      "wood",
      "wool",
      "word",
      "work",
      "world",
      "worry",
      "worth",
      "wrap",
      "wreck",
      "wrestle",
      "wrist",
      "write",
      "wrong",
      "yard",
      "year",
      "yellow",
      "you",
      "young",
      "youth",
      "zebra",
      "zero",
      "zone",
      "zoo"
    ];
  }
});

// ../node_modules/bip39/src/_wordlists.js
var require_wordlists = __commonJS({
  "../node_modules/bip39/src/_wordlists.js"(exports) {
    "use strict";
    init_node_globals();
    Object.defineProperty(exports, "__esModule", { value: true });
    var wordlists = {};
    exports.wordlists = wordlists;
    var _default;
    exports._default = _default;
    try {
      exports._default = _default = require_czech();
      wordlists.czech = _default;
    } catch (err) {
    }
    try {
      exports._default = _default = require_chinese_simplified();
      wordlists.chinese_simplified = _default;
    } catch (err) {
    }
    try {
      exports._default = _default = require_chinese_traditional();
      wordlists.chinese_traditional = _default;
    } catch (err) {
    }
    try {
      exports._default = _default = require_korean();
      wordlists.korean = _default;
    } catch (err) {
    }
    try {
      exports._default = _default = require_french();
      wordlists.french = _default;
    } catch (err) {
    }
    try {
      exports._default = _default = require_italian();
      wordlists.italian = _default;
    } catch (err) {
    }
    try {
      exports._default = _default = require_spanish();
      wordlists.spanish = _default;
    } catch (err) {
    }
    try {
      exports._default = _default = require_japanese();
      wordlists.japanese = _default;
      wordlists.JA = _default;
    } catch (err) {
    }
    try {
      exports._default = _default = require_portuguese();
      wordlists.portuguese = _default;
    } catch (err) {
    }
    try {
      exports._default = _default = require_english();
      wordlists.english = _default;
      wordlists.EN = _default;
    } catch (err) {
    }
  }
});

// ../node_modules/bip39/src/index.js
var require_src = __commonJS({
  "../node_modules/bip39/src/index.js"(exports) {
    init_node_globals();
    Object.defineProperty(exports, "__esModule", { value: true });
    var createHash = require_browser3();
    var pbkdf2_1 = require_browser4();
    var randomBytes = require_browser5();
    var _wordlists_1 = require_wordlists();
    var DEFAULT_WORDLIST = _wordlists_1._default;
    var INVALID_MNEMONIC = "Invalid mnemonic";
    var INVALID_ENTROPY = "Invalid entropy";
    var INVALID_CHECKSUM = "Invalid mnemonic checksum";
    var WORDLIST_REQUIRED = "A wordlist is required but a default could not be found.\nPlease pass a 2048 word array explicitly.";
    function pbkdf2Promise(password, saltMixin, iterations, keylen, digest) {
      return Promise.resolve().then(() => new Promise((resolve, reject) => {
        const callback = (err, derivedKey) => {
          if (err) {
            return reject(err);
          } else {
            return resolve(derivedKey);
          }
        };
        pbkdf2_1.pbkdf2(password, saltMixin, iterations, keylen, digest, callback);
      }));
    }
    function normalize(str) {
      return (str || "").normalize("NFKD");
    }
    function lpad(str, padString, length) {
      while (str.length < length) {
        str = padString + str;
      }
      return str;
    }
    function binaryToByte(bin) {
      return parseInt(bin, 2);
    }
    function bytesToBinary(bytes) {
      return bytes.map((x) => lpad(x.toString(2), "0", 8)).join("");
    }
    function deriveChecksumBits(entropyBuffer) {
      const ENT = entropyBuffer.length * 8;
      const CS = ENT / 32;
      const hash = createHash("sha256").update(entropyBuffer).digest();
      return bytesToBinary(Array.from(hash)).slice(0, CS);
    }
    function salt(password) {
      return "mnemonic" + (password || "");
    }
    function mnemonicToSeedSync(mnemonic, password) {
      const mnemonicBuffer = Buffer3.from(normalize(mnemonic), "utf8");
      const saltBuffer = Buffer3.from(salt(normalize(password)), "utf8");
      return pbkdf2_1.pbkdf2Sync(mnemonicBuffer, saltBuffer, 2048, 64, "sha512");
    }
    exports.mnemonicToSeedSync = mnemonicToSeedSync;
    function mnemonicToSeed(mnemonic, password) {
      return Promise.resolve().then(() => {
        const mnemonicBuffer = Buffer3.from(normalize(mnemonic), "utf8");
        const saltBuffer = Buffer3.from(salt(normalize(password)), "utf8");
        return pbkdf2Promise(mnemonicBuffer, saltBuffer, 2048, 64, "sha512");
      });
    }
    exports.mnemonicToSeed = mnemonicToSeed;
    function mnemonicToEntropy(mnemonic, wordlist) {
      wordlist = wordlist || DEFAULT_WORDLIST;
      if (!wordlist) {
        throw new Error(WORDLIST_REQUIRED);
      }
      const words = normalize(mnemonic).split(" ");
      if (words.length % 3 !== 0) {
        throw new Error(INVALID_MNEMONIC);
      }
      const bits = words.map((word) => {
        const index = wordlist.indexOf(word);
        if (index === -1) {
          throw new Error(INVALID_MNEMONIC);
        }
        return lpad(index.toString(2), "0", 11);
      }).join("");
      const dividerIndex = Math.floor(bits.length / 33) * 32;
      const entropyBits = bits.slice(0, dividerIndex);
      const checksumBits = bits.slice(dividerIndex);
      const entropyBytes = entropyBits.match(/(.{1,8})/g).map(binaryToByte);
      if (entropyBytes.length < 16) {
        throw new Error(INVALID_ENTROPY);
      }
      if (entropyBytes.length > 32) {
        throw new Error(INVALID_ENTROPY);
      }
      if (entropyBytes.length % 4 !== 0) {
        throw new Error(INVALID_ENTROPY);
      }
      const entropy = Buffer3.from(entropyBytes);
      const newChecksum = deriveChecksumBits(entropy);
      if (newChecksum !== checksumBits) {
        throw new Error(INVALID_CHECKSUM);
      }
      return entropy.toString("hex");
    }
    exports.mnemonicToEntropy = mnemonicToEntropy;
    function entropyToMnemonic(entropy, wordlist) {
      if (!Buffer3.isBuffer(entropy)) {
        entropy = Buffer3.from(entropy, "hex");
      }
      wordlist = wordlist || DEFAULT_WORDLIST;
      if (!wordlist) {
        throw new Error(WORDLIST_REQUIRED);
      }
      if (entropy.length < 16) {
        throw new TypeError(INVALID_ENTROPY);
      }
      if (entropy.length > 32) {
        throw new TypeError(INVALID_ENTROPY);
      }
      if (entropy.length % 4 !== 0) {
        throw new TypeError(INVALID_ENTROPY);
      }
      const entropyBits = bytesToBinary(Array.from(entropy));
      const checksumBits = deriveChecksumBits(entropy);
      const bits = entropyBits + checksumBits;
      const chunks = bits.match(/(.{1,11})/g);
      const words = chunks.map((binary) => {
        const index = binaryToByte(binary);
        return wordlist[index];
      });
      return wordlist[0] === "\u3042\u3044\u3053\u304F\u3057\u3093" ? words.join("\u3000") : words.join(" ");
    }
    exports.entropyToMnemonic = entropyToMnemonic;
    function generateMnemonic(strength, rng, wordlist) {
      strength = strength || 128;
      if (strength % 32 !== 0) {
        throw new TypeError(INVALID_ENTROPY);
      }
      rng = rng || randomBytes;
      return entropyToMnemonic(rng(strength / 8), wordlist);
    }
    exports.generateMnemonic = generateMnemonic;
    function validateMnemonic(mnemonic, wordlist) {
      try {
        mnemonicToEntropy(mnemonic, wordlist);
      } catch (e) {
        return false;
      }
      return true;
    }
    exports.validateMnemonic = validateMnemonic;
    function setDefaultWordlist(language) {
      const result = _wordlists_1.wordlists[language];
      if (result) {
        DEFAULT_WORDLIST = result;
      } else {
        throw new Error('Could not find wordlist for language "' + language + '"');
      }
    }
    exports.setDefaultWordlist = setDefaultWordlist;
    function getDefaultWordlist() {
      if (!DEFAULT_WORDLIST) {
        throw new Error("No Default Wordlist set");
      }
      return Object.keys(_wordlists_1.wordlists).filter((lang) => {
        if (lang === "JA" || lang === "EN") {
          return false;
        }
        return _wordlists_1.wordlists[lang].every((word, index) => word === DEFAULT_WORDLIST[index]);
      })[0];
    }
    exports.getDefaultWordlist = getDefaultWordlist;
    var _wordlists_2 = require_wordlists();
    exports.wordlists = _wordlists_2.wordlists;
  }
});
"use strict";
export default require_src();
/*!
 * The buffer module from node.js, for the browser.
 *
 * @author   Feross Aboukhadijeh <feross@feross.org> <http://feross.org>
 * @license  MIT
 */
/*! safe-buffer. MIT License. Feross Aboukhadijeh <https://feross.org/opensource> */
//# sourceMappingURL=bip39.js.map
