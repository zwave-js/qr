var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __require = /* @__PURE__ */ ((x) => typeof require !== "undefined" ? require : typeof Proxy !== "undefined" ? new Proxy(x, {
  get: (a, b) => (typeof require !== "undefined" ? require : a)[b]
}) : x)(function(x) {
  if (typeof require !== "undefined") return require.apply(this, arguments);
  throw Error('Dynamic require of "' + x + '" is not supported');
});
var __commonJS = (cb, mod) => function __require2() {
  return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// node_modules/qrcode-svg/lib/qrcode.js
var require_qrcode = __commonJS({
  "node_modules/qrcode-svg/lib/qrcode.js"(exports, module) {
    function QR8bitByte(data) {
      this.mode = QRMode.MODE_8BIT_BYTE;
      this.data = data;
      this.parsedData = [];
      for (var i2 = 0, l = this.data.length; i2 < l; i2++) {
        var byteArray = [];
        var code = this.data.charCodeAt(i2);
        if (code > 65536) {
          byteArray[0] = 240 | (code & 1835008) >>> 18;
          byteArray[1] = 128 | (code & 258048) >>> 12;
          byteArray[2] = 128 | (code & 4032) >>> 6;
          byteArray[3] = 128 | code & 63;
        } else if (code > 2048) {
          byteArray[0] = 224 | (code & 61440) >>> 12;
          byteArray[1] = 128 | (code & 4032) >>> 6;
          byteArray[2] = 128 | code & 63;
        } else if (code > 128) {
          byteArray[0] = 192 | (code & 1984) >>> 6;
          byteArray[1] = 128 | code & 63;
        } else {
          byteArray[0] = code;
        }
        this.parsedData.push(byteArray);
      }
      this.parsedData = Array.prototype.concat.apply([], this.parsedData);
      if (this.parsedData.length != this.data.length) {
        this.parsedData.unshift(191);
        this.parsedData.unshift(187);
        this.parsedData.unshift(239);
      }
    }
    QR8bitByte.prototype = {
      getLength: function(buffer) {
        return this.parsedData.length;
      },
      write: function(buffer) {
        for (var i2 = 0, l = this.parsedData.length; i2 < l; i2++) {
          buffer.put(this.parsedData[i2], 8);
        }
      }
    };
    function QRCodeModel(typeNumber, errorCorrectLevel) {
      this.typeNumber = typeNumber;
      this.errorCorrectLevel = errorCorrectLevel;
      this.modules = null;
      this.moduleCount = 0;
      this.dataCache = null;
      this.dataList = [];
    }
    QRCodeModel.prototype = { addData: function(data) {
      var newData = new QR8bitByte(data);
      this.dataList.push(newData);
      this.dataCache = null;
    }, isDark: function(row, col) {
      if (row < 0 || this.moduleCount <= row || col < 0 || this.moduleCount <= col) {
        throw new Error(row + "," + col);
      }
      return this.modules[row][col];
    }, getModuleCount: function() {
      return this.moduleCount;
    }, make: function() {
      this.makeImpl(false, this.getBestMaskPattern());
    }, makeImpl: function(test, maskPattern) {
      this.moduleCount = this.typeNumber * 4 + 17;
      this.modules = new Array(this.moduleCount);
      for (var row = 0; row < this.moduleCount; row++) {
        this.modules[row] = new Array(this.moduleCount);
        for (var col = 0; col < this.moduleCount; col++) {
          this.modules[row][col] = null;
        }
      }
      this.setupPositionProbePattern(0, 0);
      this.setupPositionProbePattern(this.moduleCount - 7, 0);
      this.setupPositionProbePattern(0, this.moduleCount - 7);
      this.setupPositionAdjustPattern();
      this.setupTimingPattern();
      this.setupTypeInfo(test, maskPattern);
      if (this.typeNumber >= 7) {
        this.setupTypeNumber(test);
      }
      if (this.dataCache == null) {
        this.dataCache = QRCodeModel.createData(this.typeNumber, this.errorCorrectLevel, this.dataList);
      }
      this.mapData(this.dataCache, maskPattern);
    }, setupPositionProbePattern: function(row, col) {
      for (var r = -1; r <= 7; r++) {
        if (row + r <= -1 || this.moduleCount <= row + r) continue;
        for (var c = -1; c <= 7; c++) {
          if (col + c <= -1 || this.moduleCount <= col + c) continue;
          if (0 <= r && r <= 6 && (c == 0 || c == 6) || 0 <= c && c <= 6 && (r == 0 || r == 6) || 2 <= r && r <= 4 && 2 <= c && c <= 4) {
            this.modules[row + r][col + c] = true;
          } else {
            this.modules[row + r][col + c] = false;
          }
        }
      }
    }, getBestMaskPattern: function() {
      var minLostPoint = 0;
      var pattern = 0;
      for (var i2 = 0; i2 < 8; i2++) {
        this.makeImpl(true, i2);
        var lostPoint = QRUtil.getLostPoint(this);
        if (i2 == 0 || minLostPoint > lostPoint) {
          minLostPoint = lostPoint;
          pattern = i2;
        }
      }
      return pattern;
    }, createMovieClip: function(target_mc, instance_name, depth) {
      var qr_mc = target_mc.createEmptyMovieClip(instance_name, depth);
      var cs = 1;
      this.make();
      for (var row = 0; row < this.modules.length; row++) {
        var y = row * cs;
        for (var col = 0; col < this.modules[row].length; col++) {
          var x = col * cs;
          var dark = this.modules[row][col];
          if (dark) {
            qr_mc.beginFill(0, 100);
            qr_mc.moveTo(x, y);
            qr_mc.lineTo(x + cs, y);
            qr_mc.lineTo(x + cs, y + cs);
            qr_mc.lineTo(x, y + cs);
            qr_mc.endFill();
          }
        }
      }
      return qr_mc;
    }, setupTimingPattern: function() {
      for (var r = 8; r < this.moduleCount - 8; r++) {
        if (this.modules[r][6] != null) {
          continue;
        }
        this.modules[r][6] = r % 2 == 0;
      }
      for (var c = 8; c < this.moduleCount - 8; c++) {
        if (this.modules[6][c] != null) {
          continue;
        }
        this.modules[6][c] = c % 2 == 0;
      }
    }, setupPositionAdjustPattern: function() {
      var pos = QRUtil.getPatternPosition(this.typeNumber);
      for (var i2 = 0; i2 < pos.length; i2++) {
        for (var j = 0; j < pos.length; j++) {
          var row = pos[i2];
          var col = pos[j];
          if (this.modules[row][col] != null) {
            continue;
          }
          for (var r = -2; r <= 2; r++) {
            for (var c = -2; c <= 2; c++) {
              if (r == -2 || r == 2 || c == -2 || c == 2 || r == 0 && c == 0) {
                this.modules[row + r][col + c] = true;
              } else {
                this.modules[row + r][col + c] = false;
              }
            }
          }
        }
      }
    }, setupTypeNumber: function(test) {
      var bits = QRUtil.getBCHTypeNumber(this.typeNumber);
      for (var i2 = 0; i2 < 18; i2++) {
        var mod = !test && (bits >> i2 & 1) == 1;
        this.modules[Math.floor(i2 / 3)][i2 % 3 + this.moduleCount - 8 - 3] = mod;
      }
      for (var i2 = 0; i2 < 18; i2++) {
        var mod = !test && (bits >> i2 & 1) == 1;
        this.modules[i2 % 3 + this.moduleCount - 8 - 3][Math.floor(i2 / 3)] = mod;
      }
    }, setupTypeInfo: function(test, maskPattern) {
      var data = this.errorCorrectLevel << 3 | maskPattern;
      var bits = QRUtil.getBCHTypeInfo(data);
      for (var i2 = 0; i2 < 15; i2++) {
        var mod = !test && (bits >> i2 & 1) == 1;
        if (i2 < 6) {
          this.modules[i2][8] = mod;
        } else if (i2 < 8) {
          this.modules[i2 + 1][8] = mod;
        } else {
          this.modules[this.moduleCount - 15 + i2][8] = mod;
        }
      }
      for (var i2 = 0; i2 < 15; i2++) {
        var mod = !test && (bits >> i2 & 1) == 1;
        if (i2 < 8) {
          this.modules[8][this.moduleCount - i2 - 1] = mod;
        } else if (i2 < 9) {
          this.modules[8][15 - i2 - 1 + 1] = mod;
        } else {
          this.modules[8][15 - i2 - 1] = mod;
        }
      }
      this.modules[this.moduleCount - 8][8] = !test;
    }, mapData: function(data, maskPattern) {
      var inc = -1;
      var row = this.moduleCount - 1;
      var bitIndex = 7;
      var byteIndex = 0;
      for (var col = this.moduleCount - 1; col > 0; col -= 2) {
        if (col == 6) col--;
        while (true) {
          for (var c = 0; c < 2; c++) {
            if (this.modules[row][col - c] == null) {
              var dark = false;
              if (byteIndex < data.length) {
                dark = (data[byteIndex] >>> bitIndex & 1) == 1;
              }
              var mask = QRUtil.getMask(maskPattern, row, col - c);
              if (mask) {
                dark = !dark;
              }
              this.modules[row][col - c] = dark;
              bitIndex--;
              if (bitIndex == -1) {
                byteIndex++;
                bitIndex = 7;
              }
            }
          }
          row += inc;
          if (row < 0 || this.moduleCount <= row) {
            row -= inc;
            inc = -inc;
            break;
          }
        }
      }
    } };
    QRCodeModel.PAD0 = 236;
    QRCodeModel.PAD1 = 17;
    QRCodeModel.createData = function(typeNumber, errorCorrectLevel, dataList) {
      var rsBlocks = QRRSBlock.getRSBlocks(typeNumber, errorCorrectLevel);
      var buffer = new QRBitBuffer();
      for (var i2 = 0; i2 < dataList.length; i2++) {
        var data = dataList[i2];
        buffer.put(data.mode, 4);
        buffer.put(data.getLength(), QRUtil.getLengthInBits(data.mode, typeNumber));
        data.write(buffer);
      }
      var totalDataCount = 0;
      for (var i2 = 0; i2 < rsBlocks.length; i2++) {
        totalDataCount += rsBlocks[i2].dataCount;
      }
      if (buffer.getLengthInBits() > totalDataCount * 8) {
        throw new Error("code length overflow. (" + buffer.getLengthInBits() + ">" + totalDataCount * 8 + ")");
      }
      if (buffer.getLengthInBits() + 4 <= totalDataCount * 8) {
        buffer.put(0, 4);
      }
      while (buffer.getLengthInBits() % 8 != 0) {
        buffer.putBit(false);
      }
      while (true) {
        if (buffer.getLengthInBits() >= totalDataCount * 8) {
          break;
        }
        buffer.put(QRCodeModel.PAD0, 8);
        if (buffer.getLengthInBits() >= totalDataCount * 8) {
          break;
        }
        buffer.put(QRCodeModel.PAD1, 8);
      }
      return QRCodeModel.createBytes(buffer, rsBlocks);
    };
    QRCodeModel.createBytes = function(buffer, rsBlocks) {
      var offset = 0;
      var maxDcCount = 0;
      var maxEcCount = 0;
      var dcdata = new Array(rsBlocks.length);
      var ecdata = new Array(rsBlocks.length);
      for (var r = 0; r < rsBlocks.length; r++) {
        var dcCount = rsBlocks[r].dataCount;
        var ecCount = rsBlocks[r].totalCount - dcCount;
        maxDcCount = Math.max(maxDcCount, dcCount);
        maxEcCount = Math.max(maxEcCount, ecCount);
        dcdata[r] = new Array(dcCount);
        for (var i2 = 0; i2 < dcdata[r].length; i2++) {
          dcdata[r][i2] = 255 & buffer.buffer[i2 + offset];
        }
        offset += dcCount;
        var rsPoly = QRUtil.getErrorCorrectPolynomial(ecCount);
        var rawPoly = new QRPolynomial(dcdata[r], rsPoly.getLength() - 1);
        var modPoly = rawPoly.mod(rsPoly);
        ecdata[r] = new Array(rsPoly.getLength() - 1);
        for (var i2 = 0; i2 < ecdata[r].length; i2++) {
          var modIndex = i2 + modPoly.getLength() - ecdata[r].length;
          ecdata[r][i2] = modIndex >= 0 ? modPoly.get(modIndex) : 0;
        }
      }
      var totalCodeCount = 0;
      for (var i2 = 0; i2 < rsBlocks.length; i2++) {
        totalCodeCount += rsBlocks[i2].totalCount;
      }
      var data = new Array(totalCodeCount);
      var index = 0;
      for (var i2 = 0; i2 < maxDcCount; i2++) {
        for (var r = 0; r < rsBlocks.length; r++) {
          if (i2 < dcdata[r].length) {
            data[index++] = dcdata[r][i2];
          }
        }
      }
      for (var i2 = 0; i2 < maxEcCount; i2++) {
        for (var r = 0; r < rsBlocks.length; r++) {
          if (i2 < ecdata[r].length) {
            data[index++] = ecdata[r][i2];
          }
        }
      }
      return data;
    };
    var QRMode = { MODE_NUMBER: 1 << 0, MODE_ALPHA_NUM: 1 << 1, MODE_8BIT_BYTE: 1 << 2, MODE_KANJI: 1 << 3 };
    var QRErrorCorrectLevel = { L: 1, M: 0, Q: 3, H: 2 };
    var QRMaskPattern = { PATTERN000: 0, PATTERN001: 1, PATTERN010: 2, PATTERN011: 3, PATTERN100: 4, PATTERN101: 5, PATTERN110: 6, PATTERN111: 7 };
    var QRUtil = { PATTERN_POSITION_TABLE: [[], [6, 18], [6, 22], [6, 26], [6, 30], [6, 34], [6, 22, 38], [6, 24, 42], [6, 26, 46], [6, 28, 50], [6, 30, 54], [6, 32, 58], [6, 34, 62], [6, 26, 46, 66], [6, 26, 48, 70], [6, 26, 50, 74], [6, 30, 54, 78], [6, 30, 56, 82], [6, 30, 58, 86], [6, 34, 62, 90], [6, 28, 50, 72, 94], [6, 26, 50, 74, 98], [6, 30, 54, 78, 102], [6, 28, 54, 80, 106], [6, 32, 58, 84, 110], [6, 30, 58, 86, 114], [6, 34, 62, 90, 118], [6, 26, 50, 74, 98, 122], [6, 30, 54, 78, 102, 126], [6, 26, 52, 78, 104, 130], [6, 30, 56, 82, 108, 134], [6, 34, 60, 86, 112, 138], [6, 30, 58, 86, 114, 142], [6, 34, 62, 90, 118, 146], [6, 30, 54, 78, 102, 126, 150], [6, 24, 50, 76, 102, 128, 154], [6, 28, 54, 80, 106, 132, 158], [6, 32, 58, 84, 110, 136, 162], [6, 26, 54, 82, 110, 138, 166], [6, 30, 58, 86, 114, 142, 170]], G15: 1 << 10 | 1 << 8 | 1 << 5 | 1 << 4 | 1 << 2 | 1 << 1 | 1 << 0, G18: 1 << 12 | 1 << 11 | 1 << 10 | 1 << 9 | 1 << 8 | 1 << 5 | 1 << 2 | 1 << 0, G15_MASK: 1 << 14 | 1 << 12 | 1 << 10 | 1 << 4 | 1 << 1, getBCHTypeInfo: function(data) {
      var d = data << 10;
      while (QRUtil.getBCHDigit(d) - QRUtil.getBCHDigit(QRUtil.G15) >= 0) {
        d ^= QRUtil.G15 << QRUtil.getBCHDigit(d) - QRUtil.getBCHDigit(QRUtil.G15);
      }
      return (data << 10 | d) ^ QRUtil.G15_MASK;
    }, getBCHTypeNumber: function(data) {
      var d = data << 12;
      while (QRUtil.getBCHDigit(d) - QRUtil.getBCHDigit(QRUtil.G18) >= 0) {
        d ^= QRUtil.G18 << QRUtil.getBCHDigit(d) - QRUtil.getBCHDigit(QRUtil.G18);
      }
      return data << 12 | d;
    }, getBCHDigit: function(data) {
      var digit = 0;
      while (data != 0) {
        digit++;
        data >>>= 1;
      }
      return digit;
    }, getPatternPosition: function(typeNumber) {
      return QRUtil.PATTERN_POSITION_TABLE[typeNumber - 1];
    }, getMask: function(maskPattern, i2, j) {
      switch (maskPattern) {
        case QRMaskPattern.PATTERN000:
          return (i2 + j) % 2 == 0;
        case QRMaskPattern.PATTERN001:
          return i2 % 2 == 0;
        case QRMaskPattern.PATTERN010:
          return j % 3 == 0;
        case QRMaskPattern.PATTERN011:
          return (i2 + j) % 3 == 0;
        case QRMaskPattern.PATTERN100:
          return (Math.floor(i2 / 2) + Math.floor(j / 3)) % 2 == 0;
        case QRMaskPattern.PATTERN101:
          return i2 * j % 2 + i2 * j % 3 == 0;
        case QRMaskPattern.PATTERN110:
          return (i2 * j % 2 + i2 * j % 3) % 2 == 0;
        case QRMaskPattern.PATTERN111:
          return (i2 * j % 3 + (i2 + j) % 2) % 2 == 0;
        default:
          throw new Error("bad maskPattern:" + maskPattern);
      }
    }, getErrorCorrectPolynomial: function(errorCorrectLength) {
      var a = new QRPolynomial([1], 0);
      for (var i2 = 0; i2 < errorCorrectLength; i2++) {
        a = a.multiply(new QRPolynomial([1, QRMath.gexp(i2)], 0));
      }
      return a;
    }, getLengthInBits: function(mode, type) {
      if (1 <= type && type < 10) {
        switch (mode) {
          case QRMode.MODE_NUMBER:
            return 10;
          case QRMode.MODE_ALPHA_NUM:
            return 9;
          case QRMode.MODE_8BIT_BYTE:
            return 8;
          case QRMode.MODE_KANJI:
            return 8;
          default:
            throw new Error("mode:" + mode);
        }
      } else if (type < 27) {
        switch (mode) {
          case QRMode.MODE_NUMBER:
            return 12;
          case QRMode.MODE_ALPHA_NUM:
            return 11;
          case QRMode.MODE_8BIT_BYTE:
            return 16;
          case QRMode.MODE_KANJI:
            return 10;
          default:
            throw new Error("mode:" + mode);
        }
      } else if (type < 41) {
        switch (mode) {
          case QRMode.MODE_NUMBER:
            return 14;
          case QRMode.MODE_ALPHA_NUM:
            return 13;
          case QRMode.MODE_8BIT_BYTE:
            return 16;
          case QRMode.MODE_KANJI:
            return 12;
          default:
            throw new Error("mode:" + mode);
        }
      } else {
        throw new Error("type:" + type);
      }
    }, getLostPoint: function(qrCode) {
      var moduleCount = qrCode.getModuleCount();
      var lostPoint = 0;
      for (var row = 0; row < moduleCount; row++) {
        for (var col = 0; col < moduleCount; col++) {
          var sameCount = 0;
          var dark = qrCode.isDark(row, col);
          for (var r = -1; r <= 1; r++) {
            if (row + r < 0 || moduleCount <= row + r) {
              continue;
            }
            for (var c = -1; c <= 1; c++) {
              if (col + c < 0 || moduleCount <= col + c) {
                continue;
              }
              if (r == 0 && c == 0) {
                continue;
              }
              if (dark == qrCode.isDark(row + r, col + c)) {
                sameCount++;
              }
            }
          }
          if (sameCount > 5) {
            lostPoint += 3 + sameCount - 5;
          }
        }
      }
      for (var row = 0; row < moduleCount - 1; row++) {
        for (var col = 0; col < moduleCount - 1; col++) {
          var count = 0;
          if (qrCode.isDark(row, col)) count++;
          if (qrCode.isDark(row + 1, col)) count++;
          if (qrCode.isDark(row, col + 1)) count++;
          if (qrCode.isDark(row + 1, col + 1)) count++;
          if (count == 0 || count == 4) {
            lostPoint += 3;
          }
        }
      }
      for (var row = 0; row < moduleCount; row++) {
        for (var col = 0; col < moduleCount - 6; col++) {
          if (qrCode.isDark(row, col) && !qrCode.isDark(row, col + 1) && qrCode.isDark(row, col + 2) && qrCode.isDark(row, col + 3) && qrCode.isDark(row, col + 4) && !qrCode.isDark(row, col + 5) && qrCode.isDark(row, col + 6)) {
            lostPoint += 40;
          }
        }
      }
      for (var col = 0; col < moduleCount; col++) {
        for (var row = 0; row < moduleCount - 6; row++) {
          if (qrCode.isDark(row, col) && !qrCode.isDark(row + 1, col) && qrCode.isDark(row + 2, col) && qrCode.isDark(row + 3, col) && qrCode.isDark(row + 4, col) && !qrCode.isDark(row + 5, col) && qrCode.isDark(row + 6, col)) {
            lostPoint += 40;
          }
        }
      }
      var darkCount = 0;
      for (var col = 0; col < moduleCount; col++) {
        for (var row = 0; row < moduleCount; row++) {
          if (qrCode.isDark(row, col)) {
            darkCount++;
          }
        }
      }
      var ratio = Math.abs(100 * darkCount / moduleCount / moduleCount - 50) / 5;
      lostPoint += ratio * 10;
      return lostPoint;
    } };
    var QRMath = { glog: function(n) {
      if (n < 1) {
        throw new Error("glog(" + n + ")");
      }
      return QRMath.LOG_TABLE[n];
    }, gexp: function(n) {
      while (n < 0) {
        n += 255;
      }
      while (n >= 256) {
        n -= 255;
      }
      return QRMath.EXP_TABLE[n];
    }, EXP_TABLE: new Array(256), LOG_TABLE: new Array(256) };
    for (i = 0; i < 8; i++) {
      QRMath.EXP_TABLE[i] = 1 << i;
    }
    var i;
    for (i = 8; i < 256; i++) {
      QRMath.EXP_TABLE[i] = QRMath.EXP_TABLE[i - 4] ^ QRMath.EXP_TABLE[i - 5] ^ QRMath.EXP_TABLE[i - 6] ^ QRMath.EXP_TABLE[i - 8];
    }
    var i;
    for (i = 0; i < 255; i++) {
      QRMath.LOG_TABLE[QRMath.EXP_TABLE[i]] = i;
    }
    var i;
    function QRPolynomial(num, shift) {
      if (num.length == void 0) {
        throw new Error(num.length + "/" + shift);
      }
      var offset = 0;
      while (offset < num.length && num[offset] == 0) {
        offset++;
      }
      this.num = new Array(num.length - offset + shift);
      for (var i2 = 0; i2 < num.length - offset; i2++) {
        this.num[i2] = num[i2 + offset];
      }
    }
    QRPolynomial.prototype = { get: function(index) {
      return this.num[index];
    }, getLength: function() {
      return this.num.length;
    }, multiply: function(e) {
      var num = new Array(this.getLength() + e.getLength() - 1);
      for (var i2 = 0; i2 < this.getLength(); i2++) {
        for (var j = 0; j < e.getLength(); j++) {
          num[i2 + j] ^= QRMath.gexp(QRMath.glog(this.get(i2)) + QRMath.glog(e.get(j)));
        }
      }
      return new QRPolynomial(num, 0);
    }, mod: function(e) {
      if (this.getLength() - e.getLength() < 0) {
        return this;
      }
      var ratio = QRMath.glog(this.get(0)) - QRMath.glog(e.get(0));
      var num = new Array(this.getLength());
      for (var i2 = 0; i2 < this.getLength(); i2++) {
        num[i2] = this.get(i2);
      }
      for (var i2 = 0; i2 < e.getLength(); i2++) {
        num[i2] ^= QRMath.gexp(QRMath.glog(e.get(i2)) + ratio);
      }
      return new QRPolynomial(num, 0).mod(e);
    } };
    function QRRSBlock(totalCount, dataCount) {
      this.totalCount = totalCount;
      this.dataCount = dataCount;
    }
    QRRSBlock.RS_BLOCK_TABLE = [[1, 26, 19], [1, 26, 16], [1, 26, 13], [1, 26, 9], [1, 44, 34], [1, 44, 28], [1, 44, 22], [1, 44, 16], [1, 70, 55], [1, 70, 44], [2, 35, 17], [2, 35, 13], [1, 100, 80], [2, 50, 32], [2, 50, 24], [4, 25, 9], [1, 134, 108], [2, 67, 43], [2, 33, 15, 2, 34, 16], [2, 33, 11, 2, 34, 12], [2, 86, 68], [4, 43, 27], [4, 43, 19], [4, 43, 15], [2, 98, 78], [4, 49, 31], [2, 32, 14, 4, 33, 15], [4, 39, 13, 1, 40, 14], [2, 121, 97], [2, 60, 38, 2, 61, 39], [4, 40, 18, 2, 41, 19], [4, 40, 14, 2, 41, 15], [2, 146, 116], [3, 58, 36, 2, 59, 37], [4, 36, 16, 4, 37, 17], [4, 36, 12, 4, 37, 13], [2, 86, 68, 2, 87, 69], [4, 69, 43, 1, 70, 44], [6, 43, 19, 2, 44, 20], [6, 43, 15, 2, 44, 16], [4, 101, 81], [1, 80, 50, 4, 81, 51], [4, 50, 22, 4, 51, 23], [3, 36, 12, 8, 37, 13], [2, 116, 92, 2, 117, 93], [6, 58, 36, 2, 59, 37], [4, 46, 20, 6, 47, 21], [7, 42, 14, 4, 43, 15], [4, 133, 107], [8, 59, 37, 1, 60, 38], [8, 44, 20, 4, 45, 21], [12, 33, 11, 4, 34, 12], [3, 145, 115, 1, 146, 116], [4, 64, 40, 5, 65, 41], [11, 36, 16, 5, 37, 17], [11, 36, 12, 5, 37, 13], [5, 109, 87, 1, 110, 88], [5, 65, 41, 5, 66, 42], [5, 54, 24, 7, 55, 25], [11, 36, 12], [5, 122, 98, 1, 123, 99], [7, 73, 45, 3, 74, 46], [15, 43, 19, 2, 44, 20], [3, 45, 15, 13, 46, 16], [1, 135, 107, 5, 136, 108], [10, 74, 46, 1, 75, 47], [1, 50, 22, 15, 51, 23], [2, 42, 14, 17, 43, 15], [5, 150, 120, 1, 151, 121], [9, 69, 43, 4, 70, 44], [17, 50, 22, 1, 51, 23], [2, 42, 14, 19, 43, 15], [3, 141, 113, 4, 142, 114], [3, 70, 44, 11, 71, 45], [17, 47, 21, 4, 48, 22], [9, 39, 13, 16, 40, 14], [3, 135, 107, 5, 136, 108], [3, 67, 41, 13, 68, 42], [15, 54, 24, 5, 55, 25], [15, 43, 15, 10, 44, 16], [4, 144, 116, 4, 145, 117], [17, 68, 42], [17, 50, 22, 6, 51, 23], [19, 46, 16, 6, 47, 17], [2, 139, 111, 7, 140, 112], [17, 74, 46], [7, 54, 24, 16, 55, 25], [34, 37, 13], [4, 151, 121, 5, 152, 122], [4, 75, 47, 14, 76, 48], [11, 54, 24, 14, 55, 25], [16, 45, 15, 14, 46, 16], [6, 147, 117, 4, 148, 118], [6, 73, 45, 14, 74, 46], [11, 54, 24, 16, 55, 25], [30, 46, 16, 2, 47, 17], [8, 132, 106, 4, 133, 107], [8, 75, 47, 13, 76, 48], [7, 54, 24, 22, 55, 25], [22, 45, 15, 13, 46, 16], [10, 142, 114, 2, 143, 115], [19, 74, 46, 4, 75, 47], [28, 50, 22, 6, 51, 23], [33, 46, 16, 4, 47, 17], [8, 152, 122, 4, 153, 123], [22, 73, 45, 3, 74, 46], [8, 53, 23, 26, 54, 24], [12, 45, 15, 28, 46, 16], [3, 147, 117, 10, 148, 118], [3, 73, 45, 23, 74, 46], [4, 54, 24, 31, 55, 25], [11, 45, 15, 31, 46, 16], [7, 146, 116, 7, 147, 117], [21, 73, 45, 7, 74, 46], [1, 53, 23, 37, 54, 24], [19, 45, 15, 26, 46, 16], [5, 145, 115, 10, 146, 116], [19, 75, 47, 10, 76, 48], [15, 54, 24, 25, 55, 25], [23, 45, 15, 25, 46, 16], [13, 145, 115, 3, 146, 116], [2, 74, 46, 29, 75, 47], [42, 54, 24, 1, 55, 25], [23, 45, 15, 28, 46, 16], [17, 145, 115], [10, 74, 46, 23, 75, 47], [10, 54, 24, 35, 55, 25], [19, 45, 15, 35, 46, 16], [17, 145, 115, 1, 146, 116], [14, 74, 46, 21, 75, 47], [29, 54, 24, 19, 55, 25], [11, 45, 15, 46, 46, 16], [13, 145, 115, 6, 146, 116], [14, 74, 46, 23, 75, 47], [44, 54, 24, 7, 55, 25], [59, 46, 16, 1, 47, 17], [12, 151, 121, 7, 152, 122], [12, 75, 47, 26, 76, 48], [39, 54, 24, 14, 55, 25], [22, 45, 15, 41, 46, 16], [6, 151, 121, 14, 152, 122], [6, 75, 47, 34, 76, 48], [46, 54, 24, 10, 55, 25], [2, 45, 15, 64, 46, 16], [17, 152, 122, 4, 153, 123], [29, 74, 46, 14, 75, 47], [49, 54, 24, 10, 55, 25], [24, 45, 15, 46, 46, 16], [4, 152, 122, 18, 153, 123], [13, 74, 46, 32, 75, 47], [48, 54, 24, 14, 55, 25], [42, 45, 15, 32, 46, 16], [20, 147, 117, 4, 148, 118], [40, 75, 47, 7, 76, 48], [43, 54, 24, 22, 55, 25], [10, 45, 15, 67, 46, 16], [19, 148, 118, 6, 149, 119], [18, 75, 47, 31, 76, 48], [34, 54, 24, 34, 55, 25], [20, 45, 15, 61, 46, 16]];
    QRRSBlock.getRSBlocks = function(typeNumber, errorCorrectLevel) {
      var rsBlock = QRRSBlock.getRsBlockTable(typeNumber, errorCorrectLevel);
      if (rsBlock == void 0) {
        throw new Error("bad rs block @ typeNumber:" + typeNumber + "/errorCorrectLevel:" + errorCorrectLevel);
      }
      var length = rsBlock.length / 3;
      var list = [];
      for (var i2 = 0; i2 < length; i2++) {
        var count = rsBlock[i2 * 3 + 0];
        var totalCount = rsBlock[i2 * 3 + 1];
        var dataCount = rsBlock[i2 * 3 + 2];
        for (var j = 0; j < count; j++) {
          list.push(new QRRSBlock(totalCount, dataCount));
        }
      }
      return list;
    };
    QRRSBlock.getRsBlockTable = function(typeNumber, errorCorrectLevel) {
      switch (errorCorrectLevel) {
        case QRErrorCorrectLevel.L:
          return QRRSBlock.RS_BLOCK_TABLE[(typeNumber - 1) * 4 + 0];
        case QRErrorCorrectLevel.M:
          return QRRSBlock.RS_BLOCK_TABLE[(typeNumber - 1) * 4 + 1];
        case QRErrorCorrectLevel.Q:
          return QRRSBlock.RS_BLOCK_TABLE[(typeNumber - 1) * 4 + 2];
        case QRErrorCorrectLevel.H:
          return QRRSBlock.RS_BLOCK_TABLE[(typeNumber - 1) * 4 + 3];
        default:
          return void 0;
      }
    };
    function QRBitBuffer() {
      this.buffer = [];
      this.length = 0;
    }
    QRBitBuffer.prototype = { get: function(index) {
      var bufIndex = Math.floor(index / 8);
      return (this.buffer[bufIndex] >>> 7 - index % 8 & 1) == 1;
    }, put: function(num, length) {
      for (var i2 = 0; i2 < length; i2++) {
        this.putBit((num >>> length - i2 - 1 & 1) == 1);
      }
    }, getLengthInBits: function() {
      return this.length;
    }, putBit: function(bit) {
      var bufIndex = Math.floor(this.length / 8);
      if (this.buffer.length <= bufIndex) {
        this.buffer.push(0);
      }
      if (bit) {
        this.buffer[bufIndex] |= 128 >>> this.length % 8;
      }
      this.length++;
    } };
    var QRCodeLimitLength = [[17, 14, 11, 7], [32, 26, 20, 14], [53, 42, 32, 24], [78, 62, 46, 34], [106, 84, 60, 44], [134, 106, 74, 58], [154, 122, 86, 64], [192, 152, 108, 84], [230, 180, 130, 98], [271, 213, 151, 119], [321, 251, 177, 137], [367, 287, 203, 155], [425, 331, 241, 177], [458, 362, 258, 194], [520, 412, 292, 220], [586, 450, 322, 250], [644, 504, 364, 280], [718, 560, 394, 310], [792, 624, 442, 338], [858, 666, 482, 382], [929, 711, 509, 403], [1003, 779, 565, 439], [1091, 857, 611, 461], [1171, 911, 661, 511], [1273, 997, 715, 535], [1367, 1059, 751, 593], [1465, 1125, 805, 625], [1528, 1190, 868, 658], [1628, 1264, 908, 698], [1732, 1370, 982, 742], [1840, 1452, 1030, 790], [1952, 1538, 1112, 842], [2068, 1628, 1168, 898], [2188, 1722, 1228, 958], [2303, 1809, 1283, 983], [2431, 1911, 1351, 1051], [2563, 1989, 1423, 1093], [2699, 2099, 1499, 1139], [2809, 2213, 1579, 1219], [2953, 2331, 1663, 1273]];
    function QRCode2(options) {
      var instance = this;
      this.options = {
        padding: 4,
        width: 256,
        height: 256,
        typeNumber: 4,
        color: "#000000",
        background: "#ffffff",
        ecl: "M"
      };
      if (typeof options === "string") {
        options = {
          content: options
        };
      }
      if (options) {
        for (var i2 in options) {
          this.options[i2] = options[i2];
        }
      }
      if (typeof this.options.content !== "string") {
        throw new Error("Expected 'content' as string!");
      }
      if (this.options.content.length === 0) {
        throw new Error("Expected 'content' to be non-empty!");
      }
      if (!(this.options.padding >= 0)) {
        throw new Error("Expected 'padding' value to be non-negative!");
      }
      if (!(this.options.width > 0) || !(this.options.height > 0)) {
        throw new Error("Expected 'width' or 'height' value to be higher than zero!");
      }
      function _getErrorCorrectLevel(ecl2) {
        switch (ecl2) {
          case "L":
            return QRErrorCorrectLevel.L;
          case "M":
            return QRErrorCorrectLevel.M;
          case "Q":
            return QRErrorCorrectLevel.Q;
          case "H":
            return QRErrorCorrectLevel.H;
          default:
            throw new Error("Unknwon error correction level: " + ecl2);
        }
      }
      function _getTypeNumber(content2, ecl2) {
        var length = _getUTF8Length(content2);
        var type2 = 1;
        var limit = 0;
        for (var i3 = 0, len = QRCodeLimitLength.length; i3 <= len; i3++) {
          var table = QRCodeLimitLength[i3];
          if (!table) {
            throw new Error("Content too long: expected " + limit + " but got " + length);
          }
          switch (ecl2) {
            case "L":
              limit = table[0];
              break;
            case "M":
              limit = table[1];
              break;
            case "Q":
              limit = table[2];
              break;
            case "H":
              limit = table[3];
              break;
            default:
              throw new Error("Unknwon error correction level: " + ecl2);
          }
          if (length <= limit) {
            break;
          }
          type2++;
        }
        if (type2 > QRCodeLimitLength.length) {
          throw new Error("Content too long");
        }
        return type2;
      }
      function _getUTF8Length(content2) {
        var result = encodeURI(content2).toString().replace(/\%[0-9a-fA-F]{2}/g, "a");
        return result.length + (result.length != content2 ? 3 : 0);
      }
      var content = this.options.content;
      var type = _getTypeNumber(content, this.options.ecl);
      var ecl = _getErrorCorrectLevel(this.options.ecl);
      this.qrcode = new QRCodeModel(type, ecl);
      this.qrcode.addData(content);
      this.qrcode.make();
    }
    QRCode2.prototype.svg = function(opt) {
      var options = this.options || {};
      var modules = this.qrcode.modules;
      if (typeof opt == "undefined") {
        opt = { container: options.container || "svg" };
      }
      var pretty = typeof options.pretty != "undefined" ? !!options.pretty : true;
      var indent = pretty ? "  " : "";
      var EOL = pretty ? "\r\n" : "";
      var width = options.width;
      var height = options.height;
      var length = modules.length;
      var xsize = width / (length + 2 * options.padding);
      var ysize = height / (length + 2 * options.padding);
      var join = typeof options.join != "undefined" ? !!options.join : false;
      var swap = typeof options.swap != "undefined" ? !!options.swap : false;
      var xmlDeclaration = typeof options.xmlDeclaration != "undefined" ? !!options.xmlDeclaration : true;
      var predefined = typeof options.predefined != "undefined" ? !!options.predefined : false;
      var defs = predefined ? indent + '<defs><path id="qrmodule" d="M0 0 h' + ysize + " v" + xsize + ' H0 z" style="fill:' + options.color + ';shape-rendering:crispEdges;" /></defs>' + EOL : "";
      var bgrect = indent + '<rect x="0" y="0" width="' + width + '" height="' + height + '" style="fill:' + options.background + ';shape-rendering:crispEdges;"/>' + EOL;
      var modrect = "";
      var pathdata = "";
      for (var y = 0; y < length; y++) {
        for (var x = 0; x < length; x++) {
          var module2 = modules[x][y];
          if (module2) {
            var px = x * xsize + options.padding * xsize;
            var py = y * ysize + options.padding * ysize;
            if (swap) {
              var t = px;
              px = py;
              py = t;
            }
            if (join) {
              var w = xsize + px;
              var h = ysize + py;
              px = Number.isInteger(px) ? Number(px) : px.toFixed(2);
              py = Number.isInteger(py) ? Number(py) : py.toFixed(2);
              w = Number.isInteger(w) ? Number(w) : w.toFixed(2);
              h = Number.isInteger(h) ? Number(h) : h.toFixed(2);
              pathdata += "M" + px + "," + py + " V" + h + " H" + w + " V" + py + " H" + px + " Z ";
            } else if (predefined) {
              modrect += indent + '<use x="' + px.toString() + '" y="' + py.toString() + '" href="#qrmodule" />' + EOL;
            } else {
              modrect += indent + '<rect x="' + px.toString() + '" y="' + py.toString() + '" width="' + xsize + '" height="' + ysize + '" style="fill:' + options.color + ';shape-rendering:crispEdges;"/>' + EOL;
            }
          }
        }
      }
      if (join) {
        modrect = indent + '<path x="0" y="0" style="fill:' + options.color + ';shape-rendering:crispEdges;" d="' + pathdata + '" />';
      }
      var svg = "";
      switch (opt.container) {
        //Wrapped in SVG document
        case "svg":
          if (xmlDeclaration) {
            svg += '<?xml version="1.0" standalone="yes"?>' + EOL;
          }
          svg += '<svg xmlns="http://www.w3.org/2000/svg" version="1.1" width="' + width + '" height="' + height + '">' + EOL;
          svg += defs + bgrect + modrect;
          svg += "</svg>";
          break;
        //Viewbox for responsive use in a browser, thanks to @danioso
        case "svg-viewbox":
          if (xmlDeclaration) {
            svg += '<?xml version="1.0" standalone="yes"?>' + EOL;
          }
          svg += '<svg xmlns="http://www.w3.org/2000/svg" version="1.1" viewBox="0 0 ' + width + " " + height + '">' + EOL;
          svg += defs + bgrect + modrect;
          svg += "</svg>";
          break;
        //Wrapped in group element    
        case "g":
          svg += '<g width="' + width + '" height="' + height + '">' + EOL;
          svg += defs + bgrect + modrect;
          svg += "</g>";
          break;
        //Without a container
        default:
          svg += (defs + bgrect + modrect).replace(/^\s+/, "");
          break;
      }
      return svg;
    };
    QRCode2.prototype.save = function(file, callback) {
      var data = this.svg();
      if (typeof callback != "function") {
        callback = function(error, result) {
        };
      }
      try {
        var fs = __require("fs");
        fs.writeFile(file, data, callback);
      } catch (e) {
        callback(e);
      }
    };
    if (typeof module != "undefined") {
      module.exports = QRCode2;
    }
  }
});

// src/script.ts
var import_qrcode_svg = __toESM(require_qrcode());

// node_modules/@zwave-js/core/build/esm/qr/definitions.js
var QRCodeVersion;
(function(QRCodeVersion2) {
  QRCodeVersion2[QRCodeVersion2["S2"] = 0] = "S2";
  QRCodeVersion2[QRCodeVersion2["SmartStart"] = 1] = "SmartStart";
})(QRCodeVersion || (QRCodeVersion = {}));
var ProvisioningInformationType;
(function(ProvisioningInformationType2) {
  ProvisioningInformationType2[ProvisioningInformationType2["ProductType"] = 0] = "ProductType";
  ProvisioningInformationType2[ProvisioningInformationType2["ProductId"] = 1] = "ProductId";
  ProvisioningInformationType2[ProvisioningInformationType2["MaxInclusionRequestInterval"] = 2] = "MaxInclusionRequestInterval";
  ProvisioningInformationType2[ProvisioningInformationType2["UUID16"] = 3] = "UUID16";
  ProvisioningInformationType2[ProvisioningInformationType2["SupportedProtocols"] = 4] = "SupportedProtocols";
  ProvisioningInformationType2[ProvisioningInformationType2["Name"] = 50] = "Name";
  ProvisioningInformationType2[ProvisioningInformationType2["Location"] = 51] = "Location";
  ProvisioningInformationType2[ProvisioningInformationType2["SmartStartInclusionSetting"] = 52] = "SmartStartInclusionSetting";
  ProvisioningInformationType2[ProvisioningInformationType2["AdvancedJoining"] = 53] = "AdvancedJoining";
  ProvisioningInformationType2[ProvisioningInformationType2["BootstrappingMode"] = 54] = "BootstrappingMode";
  ProvisioningInformationType2[ProvisioningInformationType2["NetworkStatus"] = 55] = "NetworkStatus";
})(ProvisioningInformationType || (ProvisioningInformationType = {}));

// node_modules/@zwave-js/core/build/esm/definitions/SecurityClass.js
var SecurityClass;
(function(SecurityClass2) {
  SecurityClass2[SecurityClass2["Temporary"] = -2] = "Temporary";
  SecurityClass2[SecurityClass2["None"] = -1] = "None";
  SecurityClass2[SecurityClass2["S2_Unauthenticated"] = 0] = "S2_Unauthenticated";
  SecurityClass2[SecurityClass2["S2_Authenticated"] = 1] = "S2_Authenticated";
  SecurityClass2[SecurityClass2["S2_AccessControl"] = 2] = "S2_AccessControl";
  SecurityClass2[SecurityClass2["S0_Legacy"] = 7] = "S0_Legacy";
})(SecurityClass || (SecurityClass = {}));
var securityClassOrder = [
  SecurityClass.S2_AccessControl,
  SecurityClass.S2_Authenticated,
  SecurityClass.S2_Unauthenticated,
  SecurityClass.S0_Legacy
];

// node_modules/@zwave-js/core/build/esm/dsk/index.js
function isValidDSK(dsk) {
  const patternMatches = /^(\d{5}-){7}\d{5}$/.test(dsk);
  if (!patternMatches)
    return false;
  return dsk.split("-").map((p) => parseInt(p, 10)).every((p) => p <= 65535);
}

// node_modules/@zwave-js/core/build/esm/definitions/Protocol.js
var Protocols;
(function(Protocols2) {
  Protocols2[Protocols2["ZWave"] = 0] = "ZWave";
  Protocols2[Protocols2["ZWaveLongRange"] = 1] = "ZWaveLongRange";
})(Protocols || (Protocols = {}));
var ZWaveDataRate;
(function(ZWaveDataRate2) {
  ZWaveDataRate2[ZWaveDataRate2["9k6"] = 1] = "9k6";
  ZWaveDataRate2[ZWaveDataRate2["40k"] = 2] = "40k";
  ZWaveDataRate2[ZWaveDataRate2["100k"] = 3] = "100k";
})(ZWaveDataRate || (ZWaveDataRate = {}));
var ProtocolDataRate;
(function(ProtocolDataRate2) {
  ProtocolDataRate2[ProtocolDataRate2["ZWave_9k6"] = 1] = "ZWave_9k6";
  ProtocolDataRate2[ProtocolDataRate2["ZWave_40k"] = 2] = "ZWave_40k";
  ProtocolDataRate2[ProtocolDataRate2["ZWave_100k"] = 3] = "ZWave_100k";
  ProtocolDataRate2[ProtocolDataRate2["LongRange_100k"] = 4] = "LongRange_100k";
})(ProtocolDataRate || (ProtocolDataRate = {}));
var RouteProtocolDataRate;
(function(RouteProtocolDataRate2) {
  RouteProtocolDataRate2[RouteProtocolDataRate2["Unspecified"] = 0] = "Unspecified";
  RouteProtocolDataRate2[RouteProtocolDataRate2["ZWave_9k6"] = 1] = "ZWave_9k6";
  RouteProtocolDataRate2[RouteProtocolDataRate2["ZWave_40k"] = 2] = "ZWave_40k";
  RouteProtocolDataRate2[RouteProtocolDataRate2["ZWave_100k"] = 3] = "ZWave_100k";
  RouteProtocolDataRate2[RouteProtocolDataRate2["LongRange_100k"] = 4] = "LongRange_100k";
})(RouteProtocolDataRate || (RouteProtocolDataRate = {}));
var ZnifferProtocolDataRate;
(function(ZnifferProtocolDataRate2) {
  ZnifferProtocolDataRate2[ZnifferProtocolDataRate2["ZWave_9k6"] = 0] = "ZWave_9k6";
  ZnifferProtocolDataRate2[ZnifferProtocolDataRate2["ZWave_40k"] = 1] = "ZWave_40k";
  ZnifferProtocolDataRate2[ZnifferProtocolDataRate2["ZWave_100k"] = 2] = "ZWave_100k";
  ZnifferProtocolDataRate2[ZnifferProtocolDataRate2["LongRange_100k"] = 3] = "LongRange_100k";
})(ZnifferProtocolDataRate || (ZnifferProtocolDataRate = {}));
var ProtocolType;
(function(ProtocolType2) {
  ProtocolType2[ProtocolType2["Z-Wave"] = 0] = "Z-Wave";
  ProtocolType2[ProtocolType2["Z-Wave AV"] = 1] = "Z-Wave AV";
  ProtocolType2[ProtocolType2["Z-Wave for IP"] = 2] = "Z-Wave for IP";
})(ProtocolType || (ProtocolType = {}));
var LongRangeChannel;
(function(LongRangeChannel2) {
  LongRangeChannel2[LongRangeChannel2["Unsupported"] = 0] = "Unsupported";
  LongRangeChannel2[LongRangeChannel2["A"] = 1] = "A";
  LongRangeChannel2[LongRangeChannel2["B"] = 2] = "B";
  LongRangeChannel2[LongRangeChannel2["Auto"] = 255] = "Auto";
})(LongRangeChannel || (LongRangeChannel = {}));
var ProtocolVersion;
(function(ProtocolVersion2) {
  ProtocolVersion2[ProtocolVersion2["unknown"] = 0] = "unknown";
  ProtocolVersion2[ProtocolVersion2["2.0"] = 1] = "2.0";
  ProtocolVersion2[ProtocolVersion2["4.2x / 5.0x"] = 2] = "4.2x / 5.0x";
  ProtocolVersion2[ProtocolVersion2["4.5x / 6.0x"] = 3] = "4.5x / 6.0x";
})(ProtocolVersion || (ProtocolVersion = {}));

// src/script.ts
var Z = "Z".charCodeAt(0);
function level(val) {
  if (val < 0 || val > 99) throw new Error("Value must be between 0 and 99");
  return val.toString(10).padStart(2, "0");
}
function uint8(val) {
  if (val < 0 || val > 255) throw new Error("Value must be between 0 and 255");
  return val.toString(10).padStart(3, "0");
}
function uint16(val) {
  if (val < 0 || val > 65535)
    throw new Error("Value must be between 0 and 65535");
  return val.toString(10).padStart(5, "0");
}
function encodeTLV(type, critical, data) {
  const typeCritical = type << 1 | (critical ? 1 : 0);
  return `${level(typeCritical)}${level(data.length)}${data}`;
}
function encodeBitMask(values, maxValue = Math.max(...values), startValue = 1) {
  let ret = 0;
  for (let val = startValue; val <= maxValue; val++) {
    if (!values.includes(val)) continue;
    ret |= 2 ** (val - startValue);
  }
  return ret;
}
function dskFromString(dsk) {
  if (!isValidDSK(dsk)) {
    throw new Error(
      `The DSK must be in the form "aaaaa-bbbbb-ccccc-ddddd-eeeee-fffff-11111-22222"`
    );
  }
  return dsk.split("-").map((part) => parseInt(part, 10));
}
function hexToBytes(hex) {
  let bytes = [];
  for (let c = 0; c < hex.length; c += 2)
    bytes.push(parseInt(hex.slice(c, c + 2), 16));
  return bytes;
}
async function generateQRCode(info, size = 256) {
  const partsAfterChecksum = [];
  const securityClasses = uint8(
    encodeBitMask(
      info.securityClasses,
      void 0,
      SecurityClass.S2_Unauthenticated
    )
  );
  partsAfterChecksum.push(securityClasses);
  const dsk = dskFromString(info.dsk).map((part) => uint16(part));
  partsAfterChecksum.push(...dsk);
  const productType = encodeTLV(
    ProvisioningInformationType.ProductType,
    false,
    [
      uint16(info.genericDeviceClass << 8 | info.specificDeviceClass),
      uint16(info.specificDeviceClass)
    ].join("")
  );
  partsAfterChecksum.push(productType);
  const applicationVersion = info.applicationVersion.split(".", 2).map((part) => parseInt(part, 10));
  const productId = encodeTLV(
    ProvisioningInformationType.ProductId,
    false,
    [
      uint16(info.manufacturerId),
      uint16(info.productType),
      uint16(info.productId),
      uint16(applicationVersion[0] << 8 | applicationVersion[1])
    ].join("")
  );
  partsAfterChecksum.push(productId);
  if (info.maxInclusionRequestInterval !== void 0) {
    const maxInclusionRequestInterval = encodeTLV(
      ProvisioningInformationType.MaxInclusionRequestInterval,
      false,
      uint16(info.maxInclusionRequestInterval)
    );
    partsAfterChecksum.push(maxInclusionRequestInterval);
  }
  if (info.uuid !== void 0) {
    const bytes = hexToBytes(info.uuid);
    const words = [];
    for (let i = 0; i < bytes.length; i += 2) {
      words.push(bytes[i] << 8 | bytes[i + 1]);
    }
    const uuid = encodeTLV(
      ProvisioningInformationType.UUID16,
      false,
      words.map((w) => uint16(w)).join("")
    );
    partsAfterChecksum.push(uuid);
  }
  if (info.supportedProtocols !== void 0) {
    const supportedProtocols = encodeTLV(
      ProvisioningInformationType.SupportedProtocols,
      false,
      level(encodeBitMask(info.supportedProtocols, void 0, Protocols.ZWave))
    );
    partsAfterChecksum.push(supportedProtocols);
  }
  const textAfterChecksum = partsAfterChecksum.join("");
  const checksumData = new TextEncoder().encode(textAfterChecksum);
  const checksumBuffer = Array.from(
    new Uint8Array(await window.crypto.subtle.digest("SHA-1", checksumData))
  );
  const checksum = checksumBuffer[0] << 8 | checksumBuffer[1];
  const text = `${level(Z)}${level(info.version)}${uint16(
    checksum
  )}${textAfterChecksum}`;
  const svg = new import_qrcode_svg.default({
    content: text,
    container: "none",
    xmlDeclaration: false,
    width: size,
    height: size
  }).svg();
  return { text, svg };
}
var chkS2AccessControl = document.getElementById(
  "security-class_s2-access"
);
var chkS2Authenticated = document.getElementById(
  "security-class_s2-authenticated"
);
var chkS2Unauthenticated = document.getElementById(
  "security-class_s2-unauthenticated"
);
var chkS0 = document.getElementById("security-class_s0");
var chkProtocol = document.getElementById("protocol");
var chkProtocolZWave = document.getElementById(
  "protocol_zwave"
);
var chkProtocolZWaveLR = document.getElementById(
  "protocol_zwlr"
);
var txtDSK = document.getElementById("dsk");
var txtDeviceClassGeneric = document.getElementById(
  "device-class_generic"
);
var txtDeviceClassSpecific = document.getElementById(
  "device-class_specific"
);
var txtDeviceClassIcon = document.getElementById(
  "device-class_icon"
);
var lblDeviceClassGenericHex = document.getElementById(
  "device-class_generic_hex"
);
var lblDeviceClassSpecificHex = document.getElementById(
  "device-class_specific_hex"
);
var lblDeviceClassIconHex = document.getElementById(
  "device-class_icon_hex"
);
var txtManufacturerId = document.getElementById(
  "manufacturer-id"
);
var txtProductType = document.getElementById(
  "product-type"
);
var txtProductId = document.getElementById("product-id");
var txtVersionMajor = document.getElementById(
  "version-major"
);
var txtVersionMinor = document.getElementById(
  "version-minor"
);
var lblManufacturerIdHex = document.getElementById(
  "manufacturer-id_hex"
);
var lblProductTypeHex = document.getElementById(
  "product-type_hex"
);
var lblProductIdHex = document.getElementById(
  "product-id_hex"
);
var lblErrorMessage = document.getElementById(
  "error-message"
);
var btnGenerate = document.getElementById("generate");
var lblQRText = document.getElementById(
  "qr-code-text"
);
var svgQRCode = document.getElementById("qr-code");
function parseDecimal(elem) {
  const value = elem.value.trim();
  if (/^[0-9]+$/.test(value)) {
    return parseInt(value, 10);
  }
  return void 0;
}
function parseHexOrDecimal(elem) {
  const value = elem.value.trim();
  if (/^[0-9]+$/.test(value)) {
    return parseInt(value, 10);
  } else if (/^(0x)?[0-9a-fA-F]+$/.test(value)) {
    if (value.startsWith("0x")) {
      return parseInt(value.slice(2), 16);
    } else {
      return parseInt(value, 16);
    }
  }
  return void 0;
}
function onProtocolToggled() {
  chkProtocolZWave.disabled = !chkProtocol.checked;
  chkProtocolZWaveLR.disabled = !chkProtocol.checked;
  update();
}
function onTextboxChangedHex(txt, lbl) {
  let value = parseHexOrDecimal(txt);
  const min = parseInt(txt.min);
  const max = parseInt(txt.max);
  if (value === void 0) {
    lbl.innerText = "(invalid)";
  } else {
    value = Math.min(max, Math.max(min, value));
    lbl.innerText = "0x" + value.toString(16).padStart(4, "0");
  }
}
function onTextboxBlurHex(txt, lbl) {
  let value = parseHexOrDecimal(txt);
  const min = parseInt(txt.min);
  const max = parseInt(txt.max);
  if (value === void 0) {
    txt.value = txt.min;
    lbl.innerText = "0x" + parseInt(txt.min).toString(16).padStart(4, "0");
  } else {
    value = Math.min(max, Math.max(min, value));
    txt.value = value.toString(10);
    lbl.innerText = "0x" + value.toString(16).padStart(4, "0");
    update();
  }
}
function onTextboxBlurDecimal(txt) {
  let value = parseDecimal(txt);
  const min = parseInt(txt.min);
  const max = parseInt(txt.max);
  if (value === void 0) {
    txt.value = txt.min;
  } else {
    value = Math.min(max, Math.max(min, value));
    txt.value = value.toString(10);
    update();
  }
}
function tryParse() {
  const securityClasses = [];
  if (chkS2AccessControl.checked)
    securityClasses.push(SecurityClass.S2_AccessControl);
  if (chkS2Authenticated.checked)
    securityClasses.push(SecurityClass.S2_Authenticated);
  if (chkS2Unauthenticated.checked)
    securityClasses.push(SecurityClass.S2_Unauthenticated);
  if (chkS0.checked) securityClasses.push(SecurityClass.S0_Legacy);
  let supportedProtocols;
  if (chkProtocol.checked) {
    supportedProtocols = [];
    if (chkProtocolZWave.checked) supportedProtocols.push(Protocols.ZWave);
    if (chkProtocolZWaveLR.checked)
      supportedProtocols.push(Protocols.ZWaveLongRange);
  }
  const dsk = txtDSK.value.trim();
  if (!isValidDSK(dsk)) {
    lblErrorMessage.innerText = "The DSK is not valid. It must be in the form 'xxxxx-xxxxx-xxxxx-xxxxx-xxxxx-xxxxx-xxxxx-xxxxx' with each block between 0 and 65535.";
    return;
  }
  const genericDeviceClass = parseHexOrDecimal(txtDeviceClassGeneric);
  if (genericDeviceClass === void 0) {
    lblErrorMessage.innerText = "The generic device class must be a number";
    return;
  }
  const specificDeviceClass = parseHexOrDecimal(txtDeviceClassSpecific);
  if (specificDeviceClass === void 0) {
    lblErrorMessage.innerText = "The specific device class must be a number";
    return;
  }
  const installerIconType = parseHexOrDecimal(txtDeviceClassIcon);
  if (installerIconType === void 0) {
    lblErrorMessage.innerText = "The installer icon type must be a number";
    return;
  }
  const manufacturerId = parseHexOrDecimal(txtManufacturerId);
  if (manufacturerId === void 0) {
    lblErrorMessage.innerText = "The manufacturer ID must be a number";
    return;
  }
  const productType = parseHexOrDecimal(txtProductType);
  if (productType === void 0) {
    lblErrorMessage.innerText = "The product type must be a number";
    return;
  }
  const productId = parseHexOrDecimal(txtProductId);
  if (productId === void 0) {
    lblErrorMessage.innerText = "The product ID must be a number";
    return;
  }
  const versionMajor = parseDecimal(txtVersionMajor);
  if (versionMajor === void 0) {
    lblErrorMessage.innerText = "The major version must be a number";
    return;
  }
  const versionMinor = parseDecimal(txtVersionMinor);
  if (versionMinor === void 0) {
    lblErrorMessage.innerText = "The minor version must be a number";
    return;
  }
  const applicationVersion = `${versionMajor}.${versionMinor}`;
  const info = {
    version: QRCodeVersion.SmartStart,
    securityClasses,
    supportedProtocols,
    dsk,
    genericDeviceClass,
    specificDeviceClass,
    manufacturerId,
    productType,
    productId,
    installerIconType,
    applicationVersion
  };
  return info;
}
async function update() {
  const info = tryParse();
  if (!info) {
    btnGenerate.disabled = true;
    return;
  } else {
    btnGenerate.disabled = false;
  }
  const { text, svg } = await generateQRCode(
    info,
    svgQRCode.clientWidth || svgQRCode.clientHeight
  );
  lblQRText.value = text;
  svgQRCode.innerHTML = svg;
}
for (const chk of [
  chkS0,
  chkS2AccessControl,
  chkS2Authenticated,
  chkS2Unauthenticated,
  chkProtocolZWave,
  chkProtocolZWaveLR
]) {
  chk.addEventListener("change", update);
}
chkProtocol.addEventListener("change", onProtocolToggled);
for (const [txt, lbl] of [
  [txtDeviceClassGeneric, lblDeviceClassGenericHex],
  [txtDeviceClassSpecific, lblDeviceClassSpecificHex],
  [txtDeviceClassIcon, lblDeviceClassIconHex],
  [txtManufacturerId, lblManufacturerIdHex],
  [txtProductType, lblProductTypeHex],
  [txtProductId, lblProductIdHex]
]) {
  txt.addEventListener("input", () => onTextboxChangedHex(txt, lbl));
  txt.addEventListener("blur", () => onTextboxBlurHex(txt, lbl));
}
for (const txt of [txtVersionMajor, txtVersionMinor]) {
  txt.addEventListener("blur", () => onTextboxBlurDecimal(txt));
}
txtDSK.onblur = update;
btnGenerate.onclick = update;
export {
  generateQRCode
};
//# sourceMappingURL=script.js.map
