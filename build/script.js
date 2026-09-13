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

// node_modules/@zwave-js/shared/build/esm/uint8array-extras.js
var uint8ArrayStringified = "[object Uint8Array]";
var arrayBufferStringified = "[object ArrayBuffer]";
function isType(value, typeConstructor, typeStringified) {
  if (!value) {
    return false;
  }
  if (value.constructor === typeConstructor) {
    return true;
  }
  return Object.prototype.toString.call(value) === typeStringified;
}
function isUint8Array(value) {
  return isType(value, Uint8Array, uint8ArrayStringified);
}
function isArrayBuffer(value) {
  return isType(value, ArrayBuffer, arrayBufferStringified);
}
function isArrayLike(value) {
  return typeof value === "object" && value !== null && "length" in value && typeof value.length === "number";
}
function isUint8ArrayOrArrayBuffer(value) {
  return isUint8Array(value) || isArrayBuffer(value);
}
function assertUint8Array(value) {
  if (!isUint8Array(value)) {
    throw new TypeError(`Expected \`Uint8Array\`, got \`${typeof value}\``);
  }
}
function assertUint8ArrayOrArrayBuffer(value) {
  if (!isUint8ArrayOrArrayBuffer(value)) {
    throw new TypeError(`Expected \`Uint8Array\` or \`ArrayBuffer\`, got \`${typeof value}\``);
  }
}
function concatUint8Arrays(arrays, totalLength) {
  if (arrays.length === 0) {
    return new Uint8Array(0);
  }
  totalLength ??= arrays.reduce((accumulator, currentValue) => accumulator + currentValue.length, 0);
  const returnValue = new Uint8Array(totalLength);
  let offset = 0;
  for (let array of arrays) {
    if (isUint8Array(array)) {
      if (offset + array.length > totalLength) {
        array = array.subarray(0, totalLength - offset);
      }
    } else if (isArrayLike(array)) {
      if (offset + array.length > totalLength) {
        array = Uint8Array.from(array).subarray(0, totalLength - offset);
      }
    } else {
      throw new TypeError(`Expected \`Uint8Array\` or a numeric array, got \`${typeof array}\``);
    }
    returnValue.set(array, offset);
    offset += array.length;
    if (offset >= totalLength)
      break;
  }
  return returnValue;
}
function areUint8ArraysEqual(a, b) {
  assertUint8Array(a);
  assertUint8Array(b);
  if (a === b) {
    return true;
  }
  if (a.length !== b.length) {
    return false;
  }
  for (let index = 0; index < a.length; index++) {
    if (a[index] !== b[index]) {
      return false;
    }
  }
  return true;
}
var cachedDecoders = {
  utf8: new globalThis.TextDecoder("utf8")
};
function uint8ArrayToString(array, encoding = "utf8") {
  assertUint8ArrayOrArrayBuffer(array);
  cachedDecoders[encoding] ??= new globalThis.TextDecoder(encoding);
  return cachedDecoders[encoding].decode(array);
}
function assertString(value) {
  if (typeof value !== "string") {
    throw new TypeError(`Expected \`string\`, got \`${typeof value}\``);
  }
}
var cachedEncoder = new globalThis.TextEncoder();
function stringToUint8Array(string) {
  assertString(string);
  return cachedEncoder.encode(string);
}
function base64ToBase64Url(base64) {
  return base64.replaceAll("+", "-").replaceAll("/", "_").replace(/=+$/, "");
}
var MAX_BLOCK_SIZE = 65535;
function uint8ArrayToBase64(array, options) {
  assertUint8Array(array);
  const { urlSafe = false } = options ?? {};
  let base64;
  if (array.length < MAX_BLOCK_SIZE) {
    base64 = globalThis.btoa(String.fromCodePoint.apply(null, array));
  } else {
    base64 = "";
    for (const value of array) {
      base64 += String.fromCodePoint(value);
    }
    base64 = globalThis.btoa(base64);
  }
  return urlSafe ? base64ToBase64Url(base64) : base64;
}
var byteToHexLookupTable = Array.from({ length: 256 }, (_, index) => index.toString(16).padStart(2, "0"));
function uint8ArrayToHex(array) {
  assertUint8Array(array);
  let hexString = "";
  for (let index = 0; index < array.length; index++) {
    hexString += byteToHexLookupTable[array[index]];
  }
  return hexString;
}
var hexToDecimalLookupTable = {
  0: 0,
  1: 1,
  2: 2,
  3: 3,
  4: 4,
  5: 5,
  6: 6,
  7: 7,
  8: 8,
  9: 9,
  a: 10,
  b: 11,
  c: 12,
  d: 13,
  e: 14,
  f: 15,
  A: 10,
  B: 11,
  C: 12,
  D: 13,
  E: 14,
  F: 15
};
function hexToUint8Array(hexString) {
  assertString(hexString);
  if (hexString.length % 2 !== 0) {
    throw new Error("Invalid Hex string length.");
  }
  const resultLength = hexString.length / 2;
  const bytes = new Uint8Array(resultLength);
  for (let index = 0; index < resultLength; index++) {
    const highNibble = hexToDecimalLookupTable[hexString[index * 2]];
    const lowNibble = hexToDecimalLookupTable[hexString[index * 2 + 1]];
    if (highNibble === void 0 || lowNibble === void 0) {
      throw new Error(`Invalid Hex character encountered at position ${index * 2}`);
    }
    bytes[index] = highNibble << 4 | lowNibble;
  }
  return bytes;
}
function indexOf(array, value) {
  const arrayLength = array.length;
  const valueLength = value.length;
  if (valueLength === 0) {
    return -1;
  }
  if (valueLength > arrayLength) {
    return -1;
  }
  const validOffsetLength = arrayLength - valueLength;
  for (let index = 0; index <= validOffsetLength; index++) {
    let isMatch = true;
    for (let index2 = 0; index2 < valueLength; index2++) {
      if (array[index + index2] !== value[index2]) {
        isMatch = false;
        break;
      }
    }
    if (isMatch) {
      return index;
    }
  }
  return -1;
}
function includes(array, value) {
  return indexOf(array, value) !== -1;
}

// node_modules/@zwave-js/shared/build/esm/Bytes.js
var Bytes = class _Bytes extends Uint8Array {
  /** Returns `true` if both `buf` and `other` have exactly the same bytes,`false` otherwise. Equivalent to `buf.compare(otherBuffer) === 0`. */
  equals(other) {
    return areUint8ArraysEqual(this, other);
  }
  /**
      Convert a value to a `Buffer` without copying its data.
  
      This can be useful for converting a Node.js `Buffer` to a portable `Buffer` instance. The Node.js `Buffer` is already an `Uint8Array` subclass, but [it alters some behavior](https://sindresorhus.com/blog/goodbye-nodejs-buffer), so it can be useful to cast it to a pure `Uint8Array` or portable `Buffer` before returning it.
  
      Tip: If you want a copy, just call `.slice()` on the return value.
      */
  static view(value) {
    if (value instanceof ArrayBuffer) {
      return new this(value);
    }
    if (ArrayBuffer.isView(value)) {
      return new this(value.buffer, value.byteOffset, value.byteLength);
    }
    throw new TypeError(`Unsupported value, got \`${typeof value}\`.`);
  }
  static from(data, encodingOrMapfn, thisArg) {
    if (typeof data === "string") {
      const encoding = encodingOrMapfn;
      switch (encoding) {
        case "ascii":
        case "utf-8":
        case "utf8":
        case void 0:
          return _Bytes.view(stringToUint8Array(data));
        case "hex":
          return _Bytes.view(hexToUint8Array(data));
      }
      throw new Error(`Unsupported encoding: ${encoding}`);
    } else if (isUint8ArrayOrArrayBuffer(data)) {
      return new _Bytes(data);
    } else if ("length" in data) {
      return _Bytes.view(super.from(data));
    } else {
      return _Bytes.view(super.from(data, encodingOrMapfn, thisArg));
    }
  }
  /**
   * Allocates a new `Buffer` of `size` bytes. If `fill` is `undefined`, the`Buffer` will be zero-filled.
   *
   * ```js
   * import { Buffer } from 'node:buffer';
   *
   * const buf = Buffer.alloc(5);
   *
   * console.log(buf);
   * // Prints: <Buffer 00 00 00 00 00>
   * ```
   *
   * If `size` is larger than {@link constants.MAX_LENGTH} or smaller than 0, `ERR_OUT_OF_RANGE` is thrown.
   *
   * If `fill` is specified, the allocated `Buffer` will be initialized by calling `buf.fill(fill)`.
   *
   * A `TypeError` will be thrown if `size` is not a number.
   * @since v5.10.0
   * @param size The desired length of the new `Buffer`.
   * @param [fill=0] A value to pre-fill the new `Buffer` with.
   * @param [encoding='utf8'] If `fill` is a string, this is its encoding.
   */
  static alloc(size, fill) {
    const ret = new _Bytes(size);
    if (fill !== void 0) {
      ret.fill(fill);
    }
    return ret;
  }
  toString(encoding = "utf8") {
    switch (encoding) {
      case "hex":
        return uint8ArrayToHex(this);
      case "base64":
        return uint8ArrayToBase64(this);
      case "base64url":
        return uint8ArrayToBase64(this, { urlSafe: true });
      case "ucs-2":
      case "ucs2":
      case "utf16le":
        return uint8ArrayToString(this, "utf-16le");
      case "ascii":
      case "latin1":
      case "binary":
      // For TextDecoder, these are aliases for "windows-1252"
      // which is not supported with small-icu or without ICU.
      // When dealing with actual ASCII data, there is no difference
      // to simply using "utf8" instead.
      default:
        return uint8ArrayToString(this, "utf-8");
    }
  }
  subarray(start, end) {
    return _Bytes.view(super.subarray(start, end));
  }
  /**
   * Equivalent to `buf.indexOf() !== -1`.
   *
   * @since v5.3.0
   * @param value What to search for.
   * @param [byteOffset=0] Where to begin searching in `buf`. If negative, then offset is calculated from the end of `buf`.
   * @param [encoding='utf8'] If `value` is a string, this is its encoding.
   * @return `true` if `value` was found in `buf`, `false` otherwise.
   */
  includes(value, byteOffset = 0) {
    if (typeof value === "number") {
      return super.includes(value, byteOffset);
    } else if (byteOffset) {
      return includes(this.subarray(byteOffset), value);
    } else {
      return includes(this, value);
    }
  }
  // /**
  //  * Returns `true` if `obj` is a `Buffer`, `false` otherwise.
  //  *
  //  * ```js
  //  * import { Buffer } from 'node:buffer';
  //  *
  //  * Buffer.isBuffer(Buffer.alloc(10)); // true
  //  * Buffer.isBuffer(Buffer.from('foo')); // true
  //  * Buffer.isBuffer('a string'); // false
  //  * Buffer.isBuffer([]); // false
  //  * Buffer.isBuffer(new Uint8Array(1024)); // false
  //  * ```
  //  * @since v0.1.101
  //  */
  // public static isBuffer(obj: any): obj is Buffer {
  // 	return obj && obj instanceof Buffer;
  // }
  /**
   * Returns a new `Buffer` which is the result of concatenating all the `Buffer` instances in the `list` together.
   *
   * If the list has no items, or if the `totalLength` is 0, then a new zero-length `Buffer` is returned.
   *
   * If `totalLength` is not provided, it is calculated from the `Buffer` instances
   * in `list` by adding their lengths.
   *
   * If `totalLength` is provided, it is coerced to an unsigned integer. If the
   * combined length of the `Buffer`s in `list` exceeds `totalLength`, the result is
   * truncated to `totalLength`.
   *
   * ```js
   * import { Buffer } from 'node:buffer';
   *
   * // Create a single `Buffer` from a list of three `Buffer` instances.
   *
   * const buf1 = Buffer.alloc(10);
   * const buf2 = Buffer.alloc(14);
   * const buf3 = Buffer.alloc(18);
   * const totalLength = buf1.length + buf2.length + buf3.length;
   *
   * console.log(totalLength);
   * // Prints: 42
   *
   * const bufA = Buffer.concat([buf1, buf2, buf3], totalLength);
   *
   * console.log(bufA);
   * // Prints: <Buffer 00 00 00 00 ...>
   * console.log(bufA.length);
   * // Prints: 42
   * ```
   *
   * `Buffer.concat()` may also use the internal `Buffer` pool like `new Buffer()` does.
   * @since v0.7.11
   * @param list List of `Buffer` or {@link Uint8Array} instances to concatenate.
   * @param totalLength Total length of the `Buffer` instances in `list` when concatenated.
   */
  static concat(list, totalLength) {
    return _Bytes.view(concatUint8Arrays(list, totalLength));
  }
  getDataView() {
    return new DataView(this.buffer, this.byteOffset, this.byteLength);
  }
  /**
   * Writes `value` to `buf` at the specified `offset` as big-endian.
   *
   * `value` is interpreted and written as a two's complement signed integer.
   *
   * ```js
   * import { Buffer } from 'node:buffer';
   *
   * const buf = new Buffer(8);
   *
   * buf.writeBigInt64BE(0x0102030405060708n, 0);
   *
   * console.log(buf);
   * // Prints: <Buffer 01 02 03 04 05 06 07 08>
   * ```
   * @since v12.0.0, v10.20.0
   * @param value Number to be written to `buf`.
   * @param [offset=0] Number of bytes to skip before starting to write. Must satisfy: `0 <= offset <= buf.length - 8`.
   * @return `offset` plus the number of bytes written.
   */
  writeBigInt64BE(value, offset = 0) {
    const view = this.getDataView();
    view.setBigInt64(offset, value, false);
    return offset + 8;
  }
  /**
   * Writes `value` to `buf` at the specified `offset` as little-endian.
   *
   * `value` is interpreted and written as a two's complement signed integer.
   *
   * ```js
   * import { Buffer } from 'node:buffer';
   *
   * const buf = new Buffer(8);
   *
   * buf.writeBigInt64LE(0x0102030405060708n, 0);
   *
   * console.log(buf);
   * // Prints: <Buffer 08 07 06 05 04 03 02 01>
   * ```
   * @since v12.0.0, v10.20.0
   * @param value Number to be written to `buf`.
   * @param [offset=0] Number of bytes to skip before starting to write. Must satisfy: `0 <= offset <= buf.length - 8`.
   * @return `offset` plus the number of bytes written.
   */
  writeBigInt64LE(value, offset = 0) {
    const view = this.getDataView();
    view.setBigInt64(offset, value, true);
    return offset + 8;
  }
  /**
   * Writes `value` to `buf` at the specified `offset` as big-endian.
   *
   * ```js
   * import { Buffer } from 'node:buffer';
   *
   * const buf = new Buffer(8);
   *
   * buf.writeBigUInt64BE(0xdecafafecacefaden, 0);
   *
   * console.log(buf);
   * // Prints: <Buffer de ca fa fe ca ce fa de>
   * ```
   * @since v12.0.0, v10.20.0
   * @param value Number to be written to `buf`.
   * @param [offset=0] Number of bytes to skip before starting to write. Must satisfy: `0 <= offset <= buf.length - 8`.
   * @return `offset` plus the number of bytes written.
   */
  writeBigUInt64BE(value, offset = 0) {
    const view = this.getDataView();
    view.setBigUint64(offset, value, false);
    return offset + 8;
  }
  /**
   * Writes `value` to `buf` at the specified `offset` as little-endian
   *
   * ```js
   * import { Buffer } from 'node:buffer';
   *
   * const buf = new Buffer(8);
   *
   * buf.writeBigUInt64LE(0xdecafafecacefaden, 0);
   *
   * console.log(buf);
   * // Prints: <Buffer de fa ce ca fe fa ca de>
   * ```
   *
   * @since v12.0.0, v10.20.0
   * @param value Number to be written to `buf`.
   * @param [offset=0] Number of bytes to skip before starting to write. Must satisfy: `0 <= offset <= buf.length - 8`.
   * @return `offset` plus the number of bytes written.
   */
  writeBigUInt64LE(value, offset = 0) {
    const view = this.getDataView();
    view.setBigUint64(offset, value, true);
    return offset + 8;
  }
  /**
   * Writes `byteLength` bytes of `value` to `buf` at the specified `offset`as little-endian. Supports up to 48 bits of accuracy. Behavior is undefined
   * when `value` is anything other than an unsigned integer.
   *
   * ```js
   * import { Buffer } from 'node:buffer';
   *
   * const buf = new Buffer(6);
   *
   * buf.writeUIntLE(0x1234567890ab, 0, 6);
   *
   * console.log(buf);
   * // Prints: <Buffer ab 90 78 56 34 12>
   * ```
   * @since v0.5.5
   * @param value Number to be written to `buf`.
   * @param offset Number of bytes to skip before starting to write. Must satisfy `0 <= offset <= buf.length - byteLength`.
   * @param byteLength Number of bytes to write. Must satisfy `0 < byteLength <= 6`.
   * @return `offset` plus the number of bytes written.
   */
  writeUIntLE(value, offset, byteLength) {
    switch (byteLength) {
      case 1:
        return this.writeUInt8(value, offset);
      case 2:
        return this.writeUInt16LE(value, offset);
      case 3: {
        let ret = this.writeUInt16LE(value & 65535, offset);
        ret = this.writeUInt8(value >>> 16, ret);
        return ret;
      }
      case 4:
        return this.writeUInt32LE(value, offset);
      // Numbers > 32 bit need to be converted to BigInt for the bitwise operations to work
      case 5: {
        const big = BigInt(value);
        const low = Number(big & 0xffffffffn);
        const high = Number(big >> 32n);
        let ret = this.writeUInt32LE(low, offset);
        ret = this.writeUInt8(high, ret);
        return ret;
      }
      case 6: {
        const big = BigInt(value);
        const low = Number(big & 0xffffffffn);
        const high = Number(big >> 32n);
        let ret = this.writeUInt32LE(low, offset);
        ret = this.writeUInt16LE(high, ret);
        return ret;
      }
      default:
        throw new RangeError(`The value of "byteLength" is out of range. It must be >= 1 and <= 6. Received ${byteLength}`);
    }
  }
  /**
   * Writes `byteLength` bytes of `value` to `buf` at the specified `offset`as big-endian. Supports up to 64 bits of accuracy. Behavior is undefined
   * when `value` is anything other than an unsigned integer.
   *
   * ```js
   * import { Buffer } from 'node:buffer';
   *
   * const buf = new Buffer(6);
   *
   * buf.writeUIntBE(0x1234567890ab, 0, 6);
   *
   * console.log(buf);
   * // Prints: <Buffer 12 34 56 78 90 ab>
   * ```
   * @since v0.5.5
   * @param value Number to be written to `buf`.
   * @param offset Number of bytes to skip before starting to write. Must satisfy `0 <= offset <= buf.length - byteLength`.
   * @param byteLength Number of bytes to write. Must satisfy `0 < byteLength <= 8`.
   * @return `offset` plus the number of bytes written.
   */
  writeUIntBE(value, offset, byteLength) {
    switch (byteLength) {
      case 1:
        return this.writeUInt8(value, offset);
      case 2:
        return this.writeUInt16BE(value, offset);
      case 3: {
        let ret = this.writeUInt16BE(value >> 8, offset);
        ret = this.writeUInt8(value & 255, ret);
        return ret;
      }
      case 4:
        return this.writeUInt32BE(value, offset);
      // Numbers > 32 bit need to be converted to BigInt for the bitwise operations to work
      case 5: {
        const big = BigInt(value);
        const high = Number(big >> 8n);
        const low = Number(big & 0xffn);
        let ret = this.writeUInt32BE(high, offset);
        ret = this.writeUInt8(low, ret);
        return ret;
      }
      case 6: {
        const big = BigInt(value);
        const high = Number(big >> 16n);
        const low = Number(big & 0xffffn);
        let ret = this.writeUInt32BE(high, offset);
        ret = this.writeUInt16BE(low, ret);
        return ret;
      }
      case 7: {
        const big = BigInt(value);
        const high = Number(big >> 24n);
        const mid = Number(big >> 8n & 0xffffn);
        const low = Number(big & 0xffn);
        let ret = this.writeUInt32BE(high, offset);
        ret = this.writeUInt16BE(mid, ret);
        ret = this.writeUInt8(low, ret);
        return ret;
      }
      case 8: {
        const ret = this.writeBigUInt64BE(BigInt(value), offset);
        return ret;
      }
      default:
        throw new RangeError(`The value of "byteLength" is out of range. It must be >= 1 and <= 6. Received ${byteLength}`);
    }
  }
  /**
   * Writes `byteLength` bytes of `value` to `buf` at the specified `offset`as little-endian. Supports up to 48 bits of accuracy. Behavior is undefined
   * when `value` is anything other than a signed integer.
   *
   * ```js
   * import { Buffer } from 'node:buffer';
   *
   * const buf = new Buffer(6);
   *
   * buf.writeIntLE(0x1234567890ab, 0, 6);
   *
   * console.log(buf);
   * // Prints: <Buffer ab 90 78 56 34 12>
   * ```
   * @since v0.11.15
   * @param value Number to be written to `buf`.
   * @param offset Number of bytes to skip before starting to write. Must satisfy `0 <= offset <= buf.length - byteLength`.
   * @param byteLength Number of bytes to write. Must satisfy `0 < byteLength <= 6`.
   * @return `offset` plus the number of bytes written.
   */
  writeIntLE(value, offset, byteLength) {
    switch (byteLength) {
      case 1:
        return this.writeInt8(value, offset);
      case 2:
        return this.writeInt16LE(value, offset);
      case 3: {
        let ret = this.writeInt16LE(value & 65535, offset);
        ret = this.writeInt8(value >> 16, ret);
        return ret;
      }
      case 4:
        return this.writeInt32LE(value, offset);
      case 5:
      case 6:
        throw new RangeError(`writeIntLE is currently not implemented for byteLength ${byteLength}`);
      default:
        throw new RangeError(`The value of "byteLength" is out of range. It must be >= 1 and <= 6. Received ${byteLength}`);
    }
  }
  /**
   * Writes `byteLength` bytes of `value` to `buf` at the specified `offset`as big-endian. Supports up to 48 bits of accuracy. Behavior is undefined when`value` is anything other than a
   * signed integer.
   *
   * ```js
   * import { Buffer } from 'node:buffer';
   *
   * const buf = new Buffer(6);
   *
   * buf.writeIntBE(0x1234567890ab, 0, 6);
   *
   * console.log(buf);
   * // Prints: <Buffer 12 34 56 78 90 ab>
   * ```
   * @since v0.11.15
   * @param value Number to be written to `buf`.
   * @param offset Number of bytes to skip before starting to write. Must satisfy `0 <= offset <= buf.length - byteLength`.
   * @param byteLength Number of bytes to write. Must satisfy `0 < byteLength <= 6`.
   * @return `offset` plus the number of bytes written.
   */
  writeIntBE(value, offset, byteLength) {
    switch (byteLength) {
      case 1:
        return this.writeInt8(value, offset);
      case 2:
        return this.writeInt16BE(value, offset);
      case 3: {
        let ret = this.writeInt8(value >> 16, offset);
        ret = this.writeInt16BE(value & 65535, ret);
        return ret;
      }
      case 4:
        return this.writeInt32BE(value, offset);
      case 5:
      case 6:
        throw new RangeError(`writeIntBE is currently not implemented for byteLength ${byteLength}`);
      default:
        throw new RangeError(`The value of "byteLength" is out of range. It must be >= 1 and <= 6. Received ${byteLength}`);
    }
  }
  /**
   * Writes `value` to `buf` at the specified `offset`. `value` must be a
   * valid unsigned 8-bit integer. Behavior is undefined when `value` is anything
   * other than an unsigned 8-bit integer.
   *
   * ```js
   * import { Buffer } from 'node:buffer';
   *
   * const buf = new Buffer(4);
   *
   * buf.writeUInt8(0x3, 0);
   * buf.writeUInt8(0x4, 1);
   * buf.writeUInt8(0x23, 2);
   * buf.writeUInt8(0x42, 3);
   *
   * console.log(buf);
   * // Prints: <Buffer 03 04 23 42>
   * ```
   * @since v0.5.0
   * @param value Number to be written to `buf`.
   * @param [offset=0] Number of bytes to skip before starting to write. Must satisfy `0 <= offset <= buf.length - 1`.
   * @return `offset` plus the number of bytes written.
   */
  writeUInt8(value, offset = 0) {
    const view = this.getDataView();
    view.setUint8(offset, value);
    return offset + 1;
  }
  /**
   * Writes `value` to `buf` at the specified `offset` as little-endian. The `value`must be a valid unsigned 16-bit integer. Behavior is undefined when `value` is
   * anything other than an unsigned 16-bit integer.
   *
   * ```js
   * import { Buffer } from 'node:buffer';
   *
   * const buf = new Buffer(4);
   *
   * buf.writeUInt16LE(0xdead, 0);
   * buf.writeUInt16LE(0xbeef, 2);
   *
   * console.log(buf);
   * // Prints: <Buffer ad de ef be>
   * ```
   * @since v0.5.5
   * @param value Number to be written to `buf`.
   * @param [offset=0] Number of bytes to skip before starting to write. Must satisfy `0 <= offset <= buf.length - 2`.
   * @return `offset` plus the number of bytes written.
   */
  writeUInt16LE(value, offset = 0) {
    const view = this.getDataView();
    view.setUint16(offset, value, true);
    return offset + 2;
  }
  /**
   * Writes `value` to `buf` at the specified `offset` as big-endian. The `value`must be a valid unsigned 16-bit integer. Behavior is undefined when `value`is anything other than an
   * unsigned 16-bit integer.
   *
   * ```js
   * import { Buffer } from 'node:buffer';
   *
   * const buf = new Buffer(4);
   *
   * buf.writeUInt16BE(0xdead, 0);
   * buf.writeUInt16BE(0xbeef, 2);
   *
   * console.log(buf);
   * // Prints: <Buffer de ad be ef>
   * ```
   * @since v0.5.5
   * @param value Number to be written to `buf`.
   * @param [offset=0] Number of bytes to skip before starting to write. Must satisfy `0 <= offset <= buf.length - 2`.
   * @return `offset` plus the number of bytes written.
   */
  writeUInt16BE(value, offset = 0) {
    const view = this.getDataView();
    view.setUint16(offset, value, false);
    return offset + 2;
  }
  /**
   * Writes `value` to `buf` at the specified `offset` as little-endian. The `value`must be a valid unsigned 32-bit integer. Behavior is undefined when `value` is
   * anything other than an unsigned 32-bit integer.
   *
   * ```js
   * import { Buffer } from 'node:buffer';
   *
   * const buf = new Buffer(4);
   *
   * buf.writeUInt32LE(0xfeedface, 0);
   *
   * console.log(buf);
   * // Prints: <Buffer ce fa ed fe>
   * ```
   * @since v0.5.5
   * @param value Number to be written to `buf`.
   * @param [offset=0] Number of bytes to skip before starting to write. Must satisfy `0 <= offset <= buf.length - 4`.
   * @return `offset` plus the number of bytes written.
   */
  writeUInt32LE(value, offset = 0) {
    const view = this.getDataView();
    view.setUint32(offset, value, true);
    return offset + 4;
  }
  /**
   * Writes `value` to `buf` at the specified `offset` as big-endian. The `value`must be a valid unsigned 32-bit integer. Behavior is undefined when `value`is anything other than an
   * unsigned 32-bit integer.
   *
   * ```js
   * import { Buffer } from 'node:buffer';
   *
   * const buf = new Buffer(4);
   *
   * buf.writeUInt32BE(0xfeedface, 0);
   *
   * console.log(buf);
   * // Prints: <Buffer fe ed fa ce>
   * ```
   * @since v0.5.5
   * @param value Number to be written to `buf`.
   * @param [offset=0] Number of bytes to skip before starting to write. Must satisfy `0 <= offset <= buf.length - 4`.
   * @return `offset` plus the number of bytes written.
   */
  writeUInt32BE(value, offset = 0) {
    const view = this.getDataView();
    view.setUint32(offset, value, false);
    return offset + 4;
  }
  /**
   * Writes `value` to `buf` at the specified `offset`. `value` must be a valid
   * signed 8-bit integer. Behavior is undefined when `value` is anything other than
   * a signed 8-bit integer.
   *
   * `value` is interpreted and written as a two's complement signed integer.
   *
   * ```js
   * import { Buffer } from 'node:buffer';
   *
   * const buf = new Buffer(2);
   *
   * buf.writeInt8(2, 0);
   * buf.writeInt8(-2, 1);
   *
   * console.log(buf);
   * // Prints: <Buffer 02 fe>
   * ```
   * @since v0.5.0
   * @param value Number to be written to `buf`.
   * @param [offset=0] Number of bytes to skip before starting to write. Must satisfy `0 <= offset <= buf.length - 1`.
   * @return `offset` plus the number of bytes written.
   */
  writeInt8(value, offset = 0) {
    const view = this.getDataView();
    view.setInt8(offset, value);
    return offset + 1;
  }
  /**
   * Writes `value` to `buf` at the specified `offset` as little-endian.  The `value`must be a valid signed 16-bit integer. Behavior is undefined when `value` is
   * anything other than a signed 16-bit integer.
   *
   * The `value` is interpreted and written as a two's complement signed integer.
   *
   * ```js
   * import { Buffer } from 'node:buffer';
   *
   * const buf = new Buffer(2);
   *
   * buf.writeInt16LE(0x0304, 0);
   *
   * console.log(buf);
   * // Prints: <Buffer 04 03>
   * ```
   * @since v0.5.5
   * @param value Number to be written to `buf`.
   * @param [offset=0] Number of bytes to skip before starting to write. Must satisfy `0 <= offset <= buf.length - 2`.
   * @return `offset` plus the number of bytes written.
   */
  writeInt16LE(value, offset = 0) {
    const view = this.getDataView();
    view.setInt16(offset, value, true);
    return offset + 2;
  }
  /**
   * Writes `value` to `buf` at the specified `offset` as big-endian.  The `value`must be a valid signed 16-bit integer. Behavior is undefined when `value` is
   * anything other than a signed 16-bit integer.
   *
   * The `value` is interpreted and written as a two's complement signed integer.
   *
   * ```js
   * import { Buffer } from 'node:buffer';
   *
   * const buf = new Buffer(2);
   *
   * buf.writeInt16BE(0x0102, 0);
   *
   * console.log(buf);
   * // Prints: <Buffer 01 02>
   * ```
   * @since v0.5.5
   * @param value Number to be written to `buf`.
   * @param [offset=0] Number of bytes to skip before starting to write. Must satisfy `0 <= offset <= buf.length - 2`.
   * @return `offset` plus the number of bytes written.
   */
  writeInt16BE(value, offset = 0) {
    const view = this.getDataView();
    view.setInt16(offset, value, false);
    return offset + 2;
  }
  /**
   * Writes `value` to `buf` at the specified `offset` as little-endian. The `value`must be a valid signed 32-bit integer. Behavior is undefined when `value` is
   * anything other than a signed 32-bit integer.
   *
   * The `value` is interpreted and written as a two's complement signed integer.
   *
   * ```js
   * import { Buffer } from 'node:buffer';
   *
   * const buf = new Buffer(4);
   *
   * buf.writeInt32LE(0x05060708, 0);
   *
   * console.log(buf);
   * // Prints: <Buffer 08 07 06 05>
   * ```
   * @since v0.5.5
   * @param value Number to be written to `buf`.
   * @param [offset=0] Number of bytes to skip before starting to write. Must satisfy `0 <= offset <= buf.length - 4`.
   * @return `offset` plus the number of bytes written.
   */
  writeInt32LE(value, offset = 0) {
    const view = this.getDataView();
    view.setInt32(offset, value, true);
    return offset + 4;
  }
  /**
   * Writes `value` to `buf` at the specified `offset` as big-endian. The `value`must be a valid signed 32-bit integer. Behavior is undefined when `value` is
   * anything other than a signed 32-bit integer.
   *
   * The `value` is interpreted and written as a two's complement signed integer.
   *
   * ```js
   * import { Buffer } from 'node:buffer';
   *
   * const buf = new Buffer(4);
   *
   * buf.writeInt32BE(0x01020304, 0);
   *
   * console.log(buf);
   * // Prints: <Buffer 01 02 03 04>
   * ```
   * @since v0.5.5
   * @param value Number to be written to `buf`.
   * @param [offset=0] Number of bytes to skip before starting to write. Must satisfy `0 <= offset <= buf.length - 4`.
   * @return `offset` plus the number of bytes written.
   */
  writeInt32BE(value, offset = 0) {
    const view = this.getDataView();
    view.setInt32(offset, value, false);
    return offset + 4;
  }
  /**
   * Reads an unsigned, big-endian 64-bit integer from `buf` at the specified`offset`.
   *
   * ```js
   * import { Buffer } from 'node:buffer';
   *
   * const buf = Buffer.from([0x00, 0x00, 0x00, 0x00, 0xff, 0xff, 0xff, 0xff]);
   *
   * console.log(buf.readBigUInt64BE(0));
   * // Prints: 4294967295n
   * ```
   * @since v12.0.0, v10.20.0
   * @param [offset=0] Number of bytes to skip before starting to read. Must satisfy: `0 <= offset <= buf.length - 8`.
   */
  readBigUInt64BE(offset = 0) {
    const view = this.getDataView();
    return view.getBigUint64(offset, false);
  }
  /**
   * Reads an unsigned, little-endian 64-bit integer from `buf` at the specified`offset`.
   *
   * ```js
   * import { Buffer } from 'node:buffer';
   *
   * const buf = Buffer.from([0x00, 0x00, 0x00, 0x00, 0xff, 0xff, 0xff, 0xff]);
   *
   * console.log(buf.readBigUInt64LE(0));
   * // Prints: 18446744069414584320n
   * ```
   * @since v12.0.0, v10.20.0
   * @param [offset=0] Number of bytes to skip before starting to read. Must satisfy: `0 <= offset <= buf.length - 8`.
   */
  readBigUInt64LE(offset = 0) {
    const view = this.getDataView();
    return view.getBigUint64(offset, true);
  }
  /**
   * Reads a signed, big-endian 64-bit integer from `buf` at the specified `offset`.
   *
   * Integers read from a `Buffer` are interpreted as two's complement signed
   * values.
   * @since v12.0.0, v10.20.0
   * @param [offset=0] Number of bytes to skip before starting to read. Must satisfy: `0 <= offset <= buf.length - 8`.
   */
  readBigInt64BE(offset = 0) {
    const view = this.getDataView();
    return view.getBigInt64(offset, false);
  }
  /**
   * Reads a signed, little-endian 64-bit integer from `buf` at the specified`offset`.
   *
   * Integers read from a `Buffer` are interpreted as two's complement signed
   * values.
   * @since v12.0.0, v10.20.0
   * @param [offset=0] Number of bytes to skip before starting to read. Must satisfy: `0 <= offset <= buf.length - 8`.
   */
  readBigInt64LE(offset = 0) {
    const view = this.getDataView();
    return view.getBigInt64(offset, true);
  }
  /**
   * Reads `byteLength` number of bytes from `buf` at the specified `offset` and interprets the result as an unsigned, little-endian integer supporting
   * up to 48 bits of accuracy.
   *
   * ```js
   * import { Buffer } from 'node:buffer';
   *
   * const buf = Buffer.from([0x12, 0x34, 0x56, 0x78, 0x90, 0xab]);
   *
   * console.log(buf.readUIntLE(0, 6).toString(16));
   * // Prints: ab9078563412
   * ```
   * @since v0.11.15
   * @param offset Number of bytes to skip before starting to read. Must satisfy `0 <= offset <= buf.length - byteLength`.
   * @param byteLength Number of bytes to read. Must satisfy `0 < byteLength <= 6`.
   */
  readUIntLE(offset, byteLength) {
    switch (byteLength) {
      case 1:
        return this.readUInt8(offset);
      case 2:
        return this.readUInt16LE(offset);
      case 3: {
        let ret = this.readUInt16LE(offset);
        ret |= this.readUInt8(offset + 2) << 16;
        return ret;
      }
      case 4:
        return this.readUInt32LE(offset);
      // Numbers > 32 bit need to be converted to BigInt for the bitwise operations to work
      case 5: {
        let ret = BigInt(this.readUInt32LE(offset));
        ret |= BigInt(this.readUInt8(offset + 4)) << 32n;
        return Number(ret);
      }
      case 6: {
        let ret = BigInt(this.readUInt32LE(offset));
        ret |= BigInt(this.readUInt16LE(offset + 4)) << 32n;
        return Number(ret);
      }
      default:
        throw new RangeError(`The value of "byteLength" is out of range. It must be >= 1 and <= 6. Received ${byteLength}`);
    }
  }
  /**
   * Reads `byteLength` number of bytes from `buf` at the specified `offset` and interprets the result as an unsigned big-endian integer supporting
   * up to 48 bits of accuracy.
   *
   * ```js
   * import { Buffer } from 'node:buffer';
   *
   * const buf = Buffer.from([0x12, 0x34, 0x56, 0x78, 0x90, 0xab]);
   *
   * console.log(buf.readUIntBE(0, 6).toString(16));
   * // Prints: 1234567890ab
   * console.log(buf.readUIntBE(1, 6).toString(16));
   * // Throws ERR_OUT_OF_RANGE.
   * ```
   * @since v0.11.15
   * @param offset Number of bytes to skip before starting to read. Must satisfy `0 <= offset <= buf.length - byteLength`.
   * @param byteLength Number of bytes to read. Must satisfy `0 < byteLength <= 6`.
   */
  readUIntBE(offset, byteLength) {
    switch (byteLength) {
      case 1:
        return this.readUInt8(offset);
      case 2:
        return this.readUInt16BE(offset);
      case 3: {
        let ret = this.readUInt8(offset) << 16;
        ret |= this.readUInt16BE(offset + 1);
        return ret;
      }
      case 4:
        return this.readUInt32BE(offset);
      // Numbers > 32 bit need to be converted to BigInt for the bitwise operations to work
      case 5: {
        let ret = BigInt(this.readUInt32BE(offset)) << 32n;
        ret |= BigInt(this.readUInt8(offset + 4));
        return Number(ret);
      }
      case 6: {
        let ret = BigInt(this.readUInt32BE(offset)) << 32n;
        ret |= BigInt(this.readUInt16BE(offset + 4));
        return Number(ret);
      }
      default:
        throw new RangeError(`The value of "byteLength" is out of range. It must be >= 1 and <= 6. Received ${byteLength}`);
    }
  }
  /**
   * Reads `byteLength` number of bytes from `buf` at the specified `offset` and interprets the result as a little-endian, two's complement signed value
   * supporting up to 48 bits of accuracy.
   *
   * ```js
   * import { Buffer } from 'node:buffer';
   *
   * const buf = Buffer.from([0x12, 0x34, 0x56, 0x78, 0x90, 0xab]);
   *
   * console.log(buf.readIntLE(0, 6).toString(16));
   * // Prints: -546f87a9cbee
   * ```
   * @since v0.11.15
   * @param offset Number of bytes to skip before starting to read. Must satisfy `0 <= offset <= buf.length - byteLength`.
   * @param byteLength Number of bytes to read. Must satisfy `0 < byteLength <= 6`.
   */
  readIntLE(offset, byteLength) {
    switch (byteLength) {
      case 1:
        return this.readInt8(offset);
      case 2:
        return this.readInt16LE(offset);
      case 3: {
        let ret = this.readUInt16LE(offset);
        ret |= this.readInt8(offset + 2) << 16;
        return ret;
      }
      case 4:
        return this.readInt32LE(offset);
      case 5:
      case 6:
        throw new RangeError(`readIntLE is currently not implemented for byteLength ${byteLength}`);
      default:
        throw new RangeError(`The value of "byteLength" is out of range. It must be >= 1 and <= 6. Received ${byteLength}`);
    }
  }
  /**
   * Reads `byteLength` number of bytes from `buf` at the specified `offset` and interprets the result as a big-endian, two's complement signed value
   * supporting up to 48 bits of accuracy.
   *
   * ```js
   * import { Buffer } from 'node:buffer';
   *
   * const buf = Buffer.from([0x12, 0x34, 0x56, 0x78, 0x90, 0xab]);
   *
   * console.log(buf.readIntBE(0, 6).toString(16));
   * // Prints: 1234567890ab
   * console.log(buf.readIntBE(1, 6).toString(16));
   * // Throws ERR_OUT_OF_RANGE.
   * console.log(buf.readIntBE(1, 0).toString(16));
   * // Throws ERR_OUT_OF_RANGE.
   * ```
   * @since v0.11.15
   * @param offset Number of bytes to skip before starting to read. Must satisfy `0 <= offset <= buf.length - byteLength`.
   * @param byteLength Number of bytes to read. Must satisfy `0 < byteLength <= 6`.
   */
  readIntBE(offset, byteLength) {
    switch (byteLength) {
      case 1:
        return this.readInt8(offset);
      case 2:
        return this.readInt16BE(offset);
      case 3: {
        let ret = this.readInt8(offset) << 16;
        ret |= this.readUInt16BE(offset + 1);
        return ret;
      }
      case 4:
        return this.readInt32BE(offset);
      case 5:
      case 6:
        throw new RangeError(`readIntBE is currently not implemented for byteLength ${byteLength}`);
      default:
        throw new RangeError(`The value of "byteLength" is out of range. It must be >= 1 and <= 6. Received ${byteLength}`);
    }
  }
  /**
   * Reads an unsigned 8-bit integer from `buf` at the specified `offset`.
   *
   * ```js
   * import { Buffer } from 'node:buffer';
   *
   * const buf = Buffer.from([1, -2]);
   *
   * console.log(buf.readUInt8(0));
   * // Prints: 1
   * console.log(buf.readUInt8(1));
   * // Prints: 254
   * console.log(buf.readUInt8(2));
   * // Throws ERR_OUT_OF_RANGE.
   * ```
   * @since v0.5.0
   * @param [offset=0] Number of bytes to skip before starting to read. Must satisfy `0 <= offset <= buf.length - 1`.
   */
  readUInt8(offset = 0) {
    const view = this.getDataView();
    return view.getUint8(offset);
  }
  /**
   * Reads an unsigned, little-endian 16-bit integer from `buf` at the specified`offset`.
   *
   * ```js
   * import { Buffer } from 'node:buffer';
   *
   * const buf = Buffer.from([0x12, 0x34, 0x56]);
   *
   * console.log(buf.readUInt16LE(0).toString(16));
   * // Prints: 3412
   * console.log(buf.readUInt16LE(1).toString(16));
   * // Prints: 5634
   * console.log(buf.readUInt16LE(2).toString(16));
   * // Throws ERR_OUT_OF_RANGE.
   * ```
   * @since v0.5.5
   * @param [offset=0] Number of bytes to skip before starting to read. Must satisfy `0 <= offset <= buf.length - 2`.
   */
  readUInt16LE(offset = 0) {
    const view = this.getDataView();
    return view.getUint16(offset, true);
  }
  /**
   * Reads an unsigned, big-endian 16-bit integer from `buf` at the specified`offset`.
   *
   * ```js
   * import { Buffer } from 'node:buffer';
   *
   * const buf = Buffer.from([0x12, 0x34, 0x56]);
   *
   * console.log(buf.readUInt16BE(0).toString(16));
   * // Prints: 1234
   * console.log(buf.readUInt16BE(1).toString(16));
   * // Prints: 3456
   * ```
   * @since v0.5.5
   * @param [offset=0] Number of bytes to skip before starting to read. Must satisfy `0 <= offset <= buf.length - 2`.
   */
  readUInt16BE(offset = 0) {
    const view = this.getDataView();
    return view.getUint16(offset, false);
  }
  /**
   * Reads an unsigned, little-endian 32-bit integer from `buf` at the specified`offset`.
   *
   * ```js
   * import { Buffer } from 'node:buffer';
   *
   * const buf = Buffer.from([0x12, 0x34, 0x56, 0x78]);
   *
   * console.log(buf.readUInt32LE(0).toString(16));
   * // Prints: 78563412
   * console.log(buf.readUInt32LE(1).toString(16));
   * // Throws ERR_OUT_OF_RANGE.
   * ```
   * @since v0.5.5
   * @param [offset=0] Number of bytes to skip before starting to read. Must satisfy `0 <= offset <= buf.length - 4`.
   */
  readUInt32LE(offset = 0) {
    const view = this.getDataView();
    return view.getUint32(offset, true);
  }
  /**
   * Reads an unsigned, big-endian 32-bit integer from `buf` at the specified`offset`.
   *
   * ```js
   * import { Buffer } from 'node:buffer';
   *
   * const buf = Buffer.from([0x12, 0x34, 0x56, 0x78]);
   *
   * console.log(buf.readUInt32BE(0).toString(16));
   * // Prints: 12345678
   * ```
   * @since v0.5.5
   * @param [offset=0] Number of bytes to skip before starting to read. Must satisfy `0 <= offset <= buf.length - 4`.
   */
  readUInt32BE(offset = 0) {
    const view = this.getDataView();
    return view.getUint32(offset, false);
  }
  /**
   * Reads a signed 8-bit integer from `buf` at the specified `offset`.
   *
   * Integers read from a `Buffer` are interpreted as two's complement signed values.
   *
   * ```js
   * import { Buffer } from 'node:buffer';
   *
   * const buf = Buffer.from([-1, 5]);
   *
   * console.log(buf.readInt8(0));
   * // Prints: -1
   * console.log(buf.readInt8(1));
   * // Prints: 5
   * console.log(buf.readInt8(2));
   * // Throws ERR_OUT_OF_RANGE.
   * ```
   * @since v0.5.0
   * @param [offset=0] Number of bytes to skip before starting to read. Must satisfy `0 <= offset <= buf.length - 1`.
   */
  readInt8(offset = 0) {
    const view = this.getDataView();
    return view.getInt8(offset);
  }
  /**
   * Reads a signed, little-endian 16-bit integer from `buf` at the specified`offset`.
   *
   * Integers read from a `Buffer` are interpreted as two's complement signed values.
   *
   * ```js
   * import { Buffer } from 'node:buffer';
   *
   * const buf = Buffer.from([0, 5]);
   *
   * console.log(buf.readInt16LE(0));
   * // Prints: 1280
   * console.log(buf.readInt16LE(1));
   * // Throws ERR_OUT_OF_RANGE.
   * ```
   * @since v0.5.5
   * @param [offset=0] Number of bytes to skip before starting to read. Must satisfy `0 <= offset <= buf.length - 2`.
   */
  readInt16LE(offset = 0) {
    const view = this.getDataView();
    return view.getInt16(offset, true);
  }
  /**
   * Reads a signed, big-endian 16-bit integer from `buf` at the specified `offset`.
   *
   * Integers read from a `Buffer` are interpreted as two's complement signed values.
   *
   * ```js
   * import { Buffer } from 'node:buffer';
   *
   * const buf = Buffer.from([0, 5]);
   *
   * console.log(buf.readInt16BE(0));
   * // Prints: 5
   * ```
   * @since v0.5.5
   * @param [offset=0] Number of bytes to skip before starting to read. Must satisfy `0 <= offset <= buf.length - 2`.
   */
  readInt16BE(offset = 0) {
    const view = this.getDataView();
    return view.getInt16(offset, false);
  }
  /**
   * Reads a signed, little-endian 32-bit integer from `buf` at the specified`offset`.
   *
   * Integers read from a `Buffer` are interpreted as two's complement signed values.
   *
   * ```js
   * import { Buffer } from 'node:buffer';
   *
   * const buf = Buffer.from([0, 0, 0, 5]);
   *
   * console.log(buf.readInt32LE(0));
   * // Prints: 83886080
   * console.log(buf.readInt32LE(1));
   * // Throws ERR_OUT_OF_RANGE.
   * ```
   * @since v0.5.5
   * @param [offset=0] Number of bytes to skip before starting to read. Must satisfy `0 <= offset <= buf.length - 4`.
   */
  readInt32LE(offset = 0) {
    const view = this.getDataView();
    return view.getInt32(offset, true);
  }
  /**
   * Reads a signed, big-endian 32-bit integer from `buf` at the specified `offset`.
   *
   * Integers read from a `Buffer` are interpreted as two's complement signed values.
   *
   * ```js
   * import { Buffer } from 'node:buffer';
   *
   * const buf = Buffer.from([0, 0, 0, 5]);
   *
   * console.log(buf.readInt32BE(0));
   * // Prints: 5
   * ```
   * @since v0.5.5
   * @param [offset=0] Number of bytes to skip before starting to read. Must satisfy `0 <= offset <= buf.length - 4`.
   */
  readInt32BE(offset = 0) {
    const view = this.getDataView();
    return view.getInt32(offset, false);
  }
};

// node_modules/@zwave-js/core/build/esm/crypto/shared.js
var BLOCK_SIZE = 16;
function zeroPad(input, blockSize) {
  const desiredLength = Math.ceil(input.length / blockSize) * blockSize;
  const ret = new Uint8Array(desiredLength);
  ret.set(input, 0);
  return {
    output: ret,
    paddingLength: ret.length - input.length
  };
}
function xor(b1, b2) {
  if (b1.length !== b2.length) {
    throw new Error("The buffers must have the same length");
  }
  const ret = new Uint8Array(b1.length);
  for (let i = 0; i < b1.length; i++) {
    ret[i] = b1[i] ^ b2[i];
  }
  return ret;
}
function decodeX25519KeyDER(key) {
  return key.subarray(-32);
}
function encodeX25519KeyDERPKCS8(key) {
  return Bytes.concat([
    Bytes.from("302e020100300506032b656e04220420", "hex"),
    key
  ]);
}

// node_modules/@zwave-js/core/build/esm/crypto/primitives/primitives.browser.js
function randomBytes(length) {
  const buffer = new Uint8Array(length);
  return crypto.getRandomValues(buffer);
}
async function encryptAES128ECB(plaintext, key) {
  return encryptAES128CBC(plaintext, key, new Uint8Array(BLOCK_SIZE).fill(0));
}
async function encryptAES128CBC(plaintext, key, iv) {
  const cryptoKey = await crypto.subtle.importKey("raw", key, { name: "AES-CBC" }, true, ["encrypt"]);
  const ciphertext = await crypto.subtle.encrypt({
    name: "AES-CBC",
    iv
  }, cryptoKey, plaintext);
  const paddedLength = Math.ceil(plaintext.length / BLOCK_SIZE) * BLOCK_SIZE;
  return new Uint8Array(ciphertext, 0, paddedLength);
}
async function decryptAES256CBC(ciphertext, key, iv) {
  const cryptoKey = await crypto.subtle.importKey("raw", key, { name: "AES-CBC" }, true, ["decrypt"]);
  const plaintext = await crypto.subtle.decrypt({
    name: "AES-CBC",
    iv
  }, cryptoKey, ciphertext);
  return new Uint8Array(plaintext);
}
async function encryptAES128OFB(plaintext, key, iv) {
  const cryptoKey = await crypto.subtle.importKey("raw", key, { name: "AES-CTR" }, true, [
    "encrypt",
    "decrypt"
  ]);
  const ret = new Uint8Array(plaintext.length);
  let counter = zeroPad(iv, BLOCK_SIZE).output;
  for (let offset = 0; offset < plaintext.length - 1; offset += BLOCK_SIZE) {
    const input = plaintext.slice(offset, offset + BLOCK_SIZE);
    const ciphertextBuffer = await crypto.subtle.encrypt({
      name: "AES-CTR",
      counter,
      length: BLOCK_SIZE * 8
    }, cryptoKey, input);
    const ciphertext = new Uint8Array(ciphertextBuffer);
    ret.set(ciphertext, offset);
    counter = zeroPad(xor(ciphertext, input), BLOCK_SIZE).output;
  }
  return ret;
}
async function decryptAES128OFB(ciphertext, key, iv) {
  const cryptoKey = await crypto.subtle.importKey("raw", key, { name: "AES-CTR" }, true, [
    "encrypt",
    "decrypt"
  ]);
  const ret = new Uint8Array(ciphertext.length);
  let counter = zeroPad(iv, BLOCK_SIZE).output;
  for (let offset = 0; offset < ciphertext.length - 1; offset += BLOCK_SIZE) {
    const input = ciphertext.slice(offset, offset + BLOCK_SIZE);
    const plaintextBuffer = await crypto.subtle.decrypt({
      name: "AES-CTR",
      counter,
      length: BLOCK_SIZE * 8
    }, cryptoKey, input);
    const plaintext = new Uint8Array(plaintextBuffer);
    ret.set(plaintext, offset);
    counter = zeroPad(xor(plaintext, input), BLOCK_SIZE).output;
  }
  return ret;
}
async function encryptAES128CCM(plaintext, key, iv, additionalData, authTagLength) {
  const M = authTagLength - 2 >> 1;
  const L = 15 - iv.length;
  const hasAData = additionalData.length > 0;
  const plaintextBlocks = getCCMPlaintextBlocks(plaintext);
  const B = getCCMAuthenticationBlocks(hasAData, M, L, iv, plaintext, additionalData, plaintextBlocks);
  const X = await computeCBCMac(B, key);
  const A0 = new Uint8Array(BLOCK_SIZE);
  A0[0] = L - 1 & 7;
  A0.set(iv, 1);
  const cryptoKey = await crypto.subtle.importKey("raw", key, { name: "AES-CTR" }, true, ["encrypt"]);
  const encryptionInput = Bytes.concat([X, plaintextBlocks]);
  const encryptionOutput = await crypto.subtle.encrypt({
    name: "AES-CTR",
    counter: A0,
    length: BLOCK_SIZE * 8
  }, cryptoKey, encryptionInput);
  const authTagAndCiphertext = new Uint8Array(encryptionOutput);
  const authTag = authTagAndCiphertext.slice(0, authTagLength);
  const ciphertext = authTagAndCiphertext.slice(BLOCK_SIZE).slice(0, plaintext.length);
  return { ciphertext, authTag };
}
async function computeCBCMac(B, key) {
  const macOutput = await encryptAES128CBC(B, key, new Uint8Array(BLOCK_SIZE).fill(0));
  const X = macOutput.subarray(-BLOCK_SIZE);
  return X;
}
function getCCMPlaintextBlocks(plaintext) {
  const plaintextBlocks = new Bytes(
    // plaintext | ...padding
    Math.ceil(plaintext.length / BLOCK_SIZE) * BLOCK_SIZE
  );
  plaintextBlocks.set(plaintext, 0);
  return plaintextBlocks;
}
function getCCMAuthenticationBlocks(hasAData, M, L, iv, plaintext, additionalData, plaintextBlocks) {
  const B0 = new Bytes(BLOCK_SIZE);
  B0[0] = (hasAData ? 64 : 0) | (M & 7) << 3 | L - 1 & 7;
  B0.set(iv, 1);
  B0.writeUIntBE(plaintext.length, 16 - L, L);
  let aDataLength;
  if (additionalData.length === 0) {
    aDataLength = new Bytes(0);
  } else if (additionalData.length < 65280) {
    aDataLength = new Bytes(2);
    aDataLength.writeUInt16BE(additionalData.length, 0);
  } else if (additionalData.length <= 4294967295) {
    aDataLength = new Bytes(6);
    aDataLength.writeUInt16BE(65534, 0);
    aDataLength.writeUInt32BE(additionalData.length, 2);
  } else {
    aDataLength = new Bytes(10);
    aDataLength.writeUInt16BE(65535, 0);
    aDataLength.writeBigUInt64BE(BigInt(additionalData.length), 2);
  }
  const aDataBlocks = new Bytes(
    // B0 | aDataLength | additionalData | ...padding
    Math.ceil((BLOCK_SIZE + aDataLength.length + additionalData.length) / BLOCK_SIZE) * BLOCK_SIZE
  );
  aDataBlocks.set(B0, 0);
  aDataBlocks.set(aDataLength, BLOCK_SIZE);
  aDataBlocks.set(additionalData, BLOCK_SIZE + aDataLength.length);
  const B = Bytes.concat([aDataBlocks, plaintextBlocks]);
  return B;
}
async function decryptAES128CCM(ciphertext, key, iv, additionalData, authTag) {
  const M = authTag.length - 2 >> 1;
  const L = 15 - iv.length;
  const hasAData = additionalData.length > 0;
  const A0 = new Uint8Array(BLOCK_SIZE);
  A0[0] = L - 1 & 7;
  A0.set(iv, 1);
  const cryptoKey = await crypto.subtle.importKey("raw", key, { name: "AES-CTR" }, true, ["decrypt"]);
  const paddedAuthTag = new Bytes(BLOCK_SIZE);
  paddedAuthTag.set(authTag, 0);
  const decryptionInput = Bytes.concat([paddedAuthTag, ciphertext]);
  const decryptionOutput = await crypto.subtle.decrypt({
    name: "AES-CTR",
    counter: A0,
    length: BLOCK_SIZE * 8
  }, cryptoKey, decryptionInput);
  const plaintextAndT = new Uint8Array(decryptionOutput);
  const T = plaintextAndT.slice(0, authTag.length);
  const plaintext = plaintextAndT.slice(BLOCK_SIZE);
  const plaintextBlocks = getCCMPlaintextBlocks(plaintext);
  const B = getCCMAuthenticationBlocks(hasAData, M, L, iv, plaintext, additionalData, plaintextBlocks);
  const X = await computeCBCMac(B, key);
  const expectedAuthTag = X.subarray(0, authTag.length);
  const emptyPlaintext = new Uint8Array();
  let result = 0;
  if (T.length !== expectedAuthTag.length) {
    return { plaintext: emptyPlaintext, authOK: false };
  }
  for (let i = 0; i < T.length; i++) {
    result |= T[i] ^ expectedAuthTag[i];
  }
  if (result === 0) {
    return { plaintext, authOK: true };
  } else {
    return { plaintext: emptyPlaintext, authOK: false };
  }
}
async function digest(algorithm, data) {
  if (algorithm === "md5") {
    algorithm = "sha-256";
  }
  const output = await crypto.subtle.digest(algorithm, data);
  return new Uint8Array(output);
}
async function generateECDHKeyPair() {
  const pair = await crypto.subtle.generateKey("X25519", true, ["deriveKey"]);
  const publicKey = new Uint8Array(await crypto.subtle.exportKey("raw", pair.publicKey));
  const privateKey = decodeX25519KeyDER(new Uint8Array(await crypto.subtle.exportKey("pkcs8", pair.privateKey)));
  return { publicKey, privateKey };
}
async function keyPairFromRawECDHPrivateKey(privateKey) {
  const privateKeyObject = await crypto.subtle.importKey("pkcs8", encodeX25519KeyDERPKCS8(privateKey), "X25519", true, ["deriveKey"]);
  const jwk = await crypto.subtle.exportKey("jwk", privateKeyObject);
  delete jwk.d;
  const publicKeyObject = await crypto.subtle.importKey("jwk", jwk, "X25519", true, []);
  const publicKey = new Uint8Array(await crypto.subtle.exportKey("raw", publicKeyObject));
  return { publicKey, privateKey };
}
async function deriveSharedECDHSecret(keyPair) {
  const publicKey = await crypto.subtle.importKey("raw", keyPair.publicKey, "X25519", true, []);
  const privateKey = await crypto.subtle.importKey("pkcs8", encodeX25519KeyDERPKCS8(keyPair.privateKey), "X25519", true, ["deriveBits"]);
  const secret = await crypto.subtle.deriveBits({
    name: "X25519",
    public: publicKey
  }, privateKey, null);
  return new Uint8Array(secret);
}
var primitives = {
  randomBytes,
  encryptAES128ECB,
  encryptAES128CBC,
  encryptAES128OFB,
  decryptAES128OFB,
  encryptAES128CCM,
  decryptAES128CCM,
  decryptAES256CBC,
  digest,
  generateECDHKeyPair,
  keyPairFromRawECDHPrivateKey,
  deriveSharedECDHSecret
};

// node_modules/@zwave-js/core/build/esm/crypto/operations.js
var { decryptAES128OFB: decryptAES128OFB2, encryptAES128CBC: encryptAES128CBC2, encryptAES128ECB: encryptAES128ECB2, encryptAES128OFB: encryptAES128OFB2, encryptAES128CCM: encryptAES128CCM2, decryptAES128CCM: decryptAES128CCM2, decryptAES256CBC: decryptAES256CBC2, randomBytes: randomBytes2, digest: digest2, generateECDHKeyPair: generateECDHKeyPair2, deriveSharedECDHSecret: deriveSharedECDHSecret2, keyPairFromRawECDHPrivateKey: keyPairFromRawECDHPrivateKey2 } = primitives;
var Z128 = new Uint8Array(16).fill(0);
var R128 = Bytes.from("00000000000000000000000000000087", "hex");
var constantPRK = new Uint8Array(16).fill(51);
var constantTE = new Uint8Array(15).fill(136);
var constantNK = new Uint8Array(15).fill(85);
var constantNonce = new Uint8Array(16).fill(38);
var constantEI = new Uint8Array(15).fill(136);

// node_modules/@zwave-js/core/build/esm/error/ZWaveError.js
var ZWaveErrorCodes;
(function(ZWaveErrorCodes2) {
  ZWaveErrorCodes2[ZWaveErrorCodes2["PacketFormat_Truncated"] = 0] = "PacketFormat_Truncated";
  ZWaveErrorCodes2[ZWaveErrorCodes2["PacketFormat_Invalid"] = 1] = "PacketFormat_Invalid";
  ZWaveErrorCodes2[ZWaveErrorCodes2["PacketFormat_Checksum"] = 2] = "PacketFormat_Checksum";
  ZWaveErrorCodes2[ZWaveErrorCodes2["PacketFormat_InvalidPayload"] = 3] = "PacketFormat_InvalidPayload";
  ZWaveErrorCodes2[ZWaveErrorCodes2["PacketFormat_DecryptionFailed"] = 4] = "PacketFormat_DecryptionFailed";
  ZWaveErrorCodes2[ZWaveErrorCodes2["Driver_Failed"] = 100] = "Driver_Failed";
  ZWaveErrorCodes2[ZWaveErrorCodes2["Driver_Reset"] = 101] = "Driver_Reset";
  ZWaveErrorCodes2[ZWaveErrorCodes2["Driver_Destroyed"] = 102] = "Driver_Destroyed";
  ZWaveErrorCodes2[ZWaveErrorCodes2["Driver_NotReady"] = 103] = "Driver_NotReady";
  ZWaveErrorCodes2[ZWaveErrorCodes2["Driver_InvalidDataReceived"] = 104] = "Driver_InvalidDataReceived";
  ZWaveErrorCodes2[ZWaveErrorCodes2["Driver_NotSupported"] = 105] = "Driver_NotSupported";
  ZWaveErrorCodes2[ZWaveErrorCodes2["Driver_NoPriority"] = 106] = "Driver_NoPriority";
  ZWaveErrorCodes2[ZWaveErrorCodes2["Driver_InvalidCache"] = 107] = "Driver_InvalidCache";
  ZWaveErrorCodes2[ZWaveErrorCodes2["Driver_InvalidOptions"] = 108] = "Driver_InvalidOptions";
  ZWaveErrorCodes2[ZWaveErrorCodes2["Driver_NoSecurity"] = 109] = "Driver_NoSecurity";
  ZWaveErrorCodes2[ZWaveErrorCodes2["Driver_FeatureDisabled"] = 110] = "Driver_FeatureDisabled";
  ZWaveErrorCodes2[ZWaveErrorCodes2["Driver_TaskRemoved"] = 111] = "Driver_TaskRemoved";
  ZWaveErrorCodes2[ZWaveErrorCodes2["Controller_Timeout"] = 200] = "Controller_Timeout";
  ZWaveErrorCodes2[ZWaveErrorCodes2["Controller_NodeTimeout"] = 201] = "Controller_NodeTimeout";
  ZWaveErrorCodes2[ZWaveErrorCodes2["Controller_MessageDropped"] = 202] = "Controller_MessageDropped";
  ZWaveErrorCodes2[ZWaveErrorCodes2["Controller_ResponseNOK"] = 203] = "Controller_ResponseNOK";
  ZWaveErrorCodes2[ZWaveErrorCodes2["Controller_CallbackNOK"] = 204] = "Controller_CallbackNOK";
  ZWaveErrorCodes2[ZWaveErrorCodes2["Controller_Jammed"] = 205] = "Controller_Jammed";
  ZWaveErrorCodes2[ZWaveErrorCodes2["Controller_Reset"] = 206] = "Controller_Reset";
  ZWaveErrorCodes2[ZWaveErrorCodes2["Controller_InclusionFailed"] = 207] = "Controller_InclusionFailed";
  ZWaveErrorCodes2[ZWaveErrorCodes2["Controller_ExclusionFailed"] = 208] = "Controller_ExclusionFailed";
  ZWaveErrorCodes2[ZWaveErrorCodes2["Controller_NotSupported"] = 209] = "Controller_NotSupported";
  ZWaveErrorCodes2[ZWaveErrorCodes2["Controller_InterviewRestarted"] = 210] = "Controller_InterviewRestarted";
  ZWaveErrorCodes2[ZWaveErrorCodes2["Controller_NodeNotFound"] = 211] = "Controller_NodeNotFound";
  ZWaveErrorCodes2[ZWaveErrorCodes2["Controller_EndpointNotFound"] = 212] = "Controller_EndpointNotFound";
  ZWaveErrorCodes2[ZWaveErrorCodes2["Controller_NodeRemoved"] = 213] = "Controller_NodeRemoved";
  ZWaveErrorCodes2[ZWaveErrorCodes2["Controller_NodeInsecureCommunication"] = 214] = "Controller_NodeInsecureCommunication";
  ZWaveErrorCodes2[ZWaveErrorCodes2["Controller_MessageExpired"] = 215] = "Controller_MessageExpired";
  ZWaveErrorCodes2[ZWaveErrorCodes2["Controller_CommandError"] = 216] = "Controller_CommandError";
  ZWaveErrorCodes2[ZWaveErrorCodes2["Controller_MessageTooLarge"] = 217] = "Controller_MessageTooLarge";
  ZWaveErrorCodes2[ZWaveErrorCodes2["Controller_NotSupportedForLongRange"] = 218] = "Controller_NotSupportedForLongRange";
  ZWaveErrorCodes2[ZWaveErrorCodes2["FWUpdateService_MissingInformation"] = 260] = "FWUpdateService_MissingInformation";
  ZWaveErrorCodes2[ZWaveErrorCodes2["FWUpdateService_RequestError"] = 261] = "FWUpdateService_RequestError";
  ZWaveErrorCodes2[ZWaveErrorCodes2["FWUpdateService_IntegrityCheckFailed"] = 262] = "FWUpdateService_IntegrityCheckFailed";
  ZWaveErrorCodes2[ZWaveErrorCodes2["FWUpdateService_DeviceMismatch"] = 263] = "FWUpdateService_DeviceMismatch";
  ZWaveErrorCodes2[ZWaveErrorCodes2["NVM_NotSupported"] = 280] = "NVM_NotSupported";
  ZWaveErrorCodes2[ZWaveErrorCodes2["NVM_InvalidJSON"] = 281] = "NVM_InvalidJSON";
  ZWaveErrorCodes2[ZWaveErrorCodes2["NVM_ObjectNotFound"] = 282] = "NVM_ObjectNotFound";
  ZWaveErrorCodes2[ZWaveErrorCodes2["NVM_InvalidFormat"] = 283] = "NVM_InvalidFormat";
  ZWaveErrorCodes2[ZWaveErrorCodes2["NVM_NoSpace"] = 284] = "NVM_NoSpace";
  ZWaveErrorCodes2[ZWaveErrorCodes2["NVM_NotOpen"] = 285] = "NVM_NotOpen";
  ZWaveErrorCodes2[ZWaveErrorCodes2["CC_Invalid"] = 300] = "CC_Invalid";
  ZWaveErrorCodes2[ZWaveErrorCodes2["CC_NoNodeID"] = 301] = "CC_NoNodeID";
  ZWaveErrorCodes2[ZWaveErrorCodes2["CC_NotSupported"] = 302] = "CC_NotSupported";
  ZWaveErrorCodes2[ZWaveErrorCodes2["CC_NotImplemented"] = 303] = "CC_NotImplemented";
  ZWaveErrorCodes2[ZWaveErrorCodes2["CC_NoAPI"] = 304] = "CC_NoAPI";
  ZWaveErrorCodes2[ZWaveErrorCodes2["CC_OperationFailed"] = 305] = "CC_OperationFailed";
  ZWaveErrorCodes2[ZWaveErrorCodes2["Deserialization_NotImplemented"] = 320] = "Deserialization_NotImplemented";
  ZWaveErrorCodes2[ZWaveErrorCodes2["Arithmetic"] = 321] = "Arithmetic";
  ZWaveErrorCodes2[ZWaveErrorCodes2["Argument_Invalid"] = 322] = "Argument_Invalid";
  ZWaveErrorCodes2[ZWaveErrorCodes2["Config_Invalid"] = 340] = "Config_Invalid";
  ZWaveErrorCodes2[ZWaveErrorCodes2["Config_NotFound"] = 341] = "Config_NotFound";
  ZWaveErrorCodes2[ZWaveErrorCodes2["Config_CircularImport"] = 342] = "Config_CircularImport";
  ZWaveErrorCodes2[ZWaveErrorCodes2["Config_Update_RegistryError"] = 343] = "Config_Update_RegistryError";
  ZWaveErrorCodes2[ZWaveErrorCodes2["Config_Update_PackageManagerNotFound"] = 344] = "Config_Update_PackageManagerNotFound";
  ZWaveErrorCodes2[ZWaveErrorCodes2["Config_Update_InstallFailed"] = 345] = "Config_Update_InstallFailed";
  ZWaveErrorCodes2[ZWaveErrorCodes2["RemoveFailedNode_Failed"] = 360] = "RemoveFailedNode_Failed";
  ZWaveErrorCodes2[ZWaveErrorCodes2["RemoveFailedNode_NodeOK"] = 361] = "RemoveFailedNode_NodeOK";
  ZWaveErrorCodes2[ZWaveErrorCodes2["ReplaceFailedNode_Failed"] = 362] = "ReplaceFailedNode_Failed";
  ZWaveErrorCodes2[ZWaveErrorCodes2["ReplaceFailedNode_NodeOK"] = 363] = "ReplaceFailedNode_NodeOK";
  ZWaveErrorCodes2[ZWaveErrorCodes2["OTW_Update_Busy"] = 380] = "OTW_Update_Busy";
  ZWaveErrorCodes2[ZWaveErrorCodes2["HealthCheck_Busy"] = 400] = "HealthCheck_Busy";
  ZWaveErrorCodes2[ZWaveErrorCodes2["LinkReliabilityCheck_Busy"] = 401] = "LinkReliabilityCheck_Busy";
  ZWaveErrorCodes2[ZWaveErrorCodes2["ConfigurationCC_FirstParameterNumber"] = 1e3] = "ConfigurationCC_FirstParameterNumber";
  ZWaveErrorCodes2[ZWaveErrorCodes2["ConfigurationCC_NoLegacyScanOnNewDevices"] = 1001] = "ConfigurationCC_NoLegacyScanOnNewDevices";
  ZWaveErrorCodes2[ZWaveErrorCodes2["ConfigurationCC_NoResetToDefaultOnLegacyDevices"] = 1002] = "ConfigurationCC_NoResetToDefaultOnLegacyDevices";
  ZWaveErrorCodes2[ZWaveErrorCodes2["SupervisionCC_CommandFailed"] = 1100] = "SupervisionCC_CommandFailed";
  ZWaveErrorCodes2[ZWaveErrorCodes2["ManufacturerProprietaryCC_NoManufacturerId"] = 1200] = "ManufacturerProprietaryCC_NoManufacturerId";
  ZWaveErrorCodes2[ZWaveErrorCodes2["AssociationCC_InvalidGroup"] = 1300] = "AssociationCC_InvalidGroup";
  ZWaveErrorCodes2[ZWaveErrorCodes2["AssociationCC_NotAllowed"] = 1301] = "AssociationCC_NotAllowed";
  ZWaveErrorCodes2[ZWaveErrorCodes2["SecurityCC_NoNonce"] = 1400] = "SecurityCC_NoNonce";
  ZWaveErrorCodes2[ZWaveErrorCodes2["Security2CC_NoSPAN"] = 1401] = "Security2CC_NoSPAN";
  ZWaveErrorCodes2[ZWaveErrorCodes2["Security2CC_NotInitialized"] = 1402] = "Security2CC_NotInitialized";
  ZWaveErrorCodes2[ZWaveErrorCodes2["Security2CC_NotSecure"] = 1403] = "Security2CC_NotSecure";
  ZWaveErrorCodes2[ZWaveErrorCodes2["Security2CC_MissingExtension"] = 1404] = "Security2CC_MissingExtension";
  ZWaveErrorCodes2[ZWaveErrorCodes2["Security2CC_CannotDecode"] = 1405] = "Security2CC_CannotDecode";
  ZWaveErrorCodes2[ZWaveErrorCodes2["Security2CC_InvalidQRCode"] = 1406] = "Security2CC_InvalidQRCode";
  ZWaveErrorCodes2[ZWaveErrorCodes2["Security2CC_NoMPAN"] = 1407] = "Security2CC_NoMPAN";
  ZWaveErrorCodes2[ZWaveErrorCodes2["Security2CC_CannotDecodeMulticast"] = 1408] = "Security2CC_CannotDecodeMulticast";
  ZWaveErrorCodes2[ZWaveErrorCodes2["FirmwareUpdateCC_Busy"] = 1500] = "FirmwareUpdateCC_Busy";
  ZWaveErrorCodes2[ZWaveErrorCodes2["FirmwareUpdateCC_NotUpgradable"] = 1501] = "FirmwareUpdateCC_NotUpgradable";
  ZWaveErrorCodes2[ZWaveErrorCodes2["FirmwareUpdateCC_TargetNotFound"] = 1502] = "FirmwareUpdateCC_TargetNotFound";
  ZWaveErrorCodes2[ZWaveErrorCodes2["FirmwareUpdateCC_FailedToStart"] = 1503] = "FirmwareUpdateCC_FailedToStart";
  ZWaveErrorCodes2[ZWaveErrorCodes2["FirmwareUpdateCC_FailedToAbort"] = 1504] = "FirmwareUpdateCC_FailedToAbort";
  ZWaveErrorCodes2[ZWaveErrorCodes2["FirmwareUpdateCC_Timeout"] = 1505] = "FirmwareUpdateCC_Timeout";
  ZWaveErrorCodes2[ZWaveErrorCodes2["Invalid_Firmware_File"] = 1506] = "Invalid_Firmware_File";
  ZWaveErrorCodes2[ZWaveErrorCodes2["Unsupported_Firmware_Format"] = 1507] = "Unsupported_Firmware_Format";
  ZWaveErrorCodes2[ZWaveErrorCodes2["FirmwareUpdateCC_NetworkBusy"] = 1508] = "FirmwareUpdateCC_NetworkBusy";
  ZWaveErrorCodes2[ZWaveErrorCodes2["PowerlevelCC_UnsupportedTestNode"] = 1600] = "PowerlevelCC_UnsupportedTestNode";
})(ZWaveErrorCodes || (ZWaveErrorCodes = {}));
function getErrorSuffix(code) {
  return `ZW${code.toString().padStart(4, "0")}`;
}
function appendErrorSuffix(message, code) {
  const suffix = ` (${getErrorSuffix(code)})`;
  if (!message.endsWith(suffix))
    message += suffix;
  return message;
}
var ZWaveError = class _ZWaveError extends Error {
  message;
  code;
  context;
  transactionSource;
  constructor(message, code, context, transactionSource) {
    super();
    this.message = message;
    this.code = code;
    this.context = context;
    this.transactionSource = transactionSource;
    this.message = appendErrorSuffix(message, code);
    Object.setPrototypeOf(this, _ZWaveError.prototype);
    Object.getPrototypeOf(this).name = "ZWaveError";
    if (typeof transactionSource === "string") {
      this.stack = `ZWaveError: ${this.message}
${transactionSource}`;
    }
  }
};

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
function dskToString(dsk) {
  if (dsk.length !== 16) {
    throw new ZWaveError(`DSK length must be 16 bytes, got ${dsk.length}`, ZWaveErrorCodes.Argument_Invalid);
  }
  let ret = "";
  for (let i = 0; i < 16; i += 2) {
    if (i > 0)
      ret += "-";
    ret += Bytes.view(dsk).readUInt16BE(i).toString(10).padStart(5, "0");
  }
  return ret;
}
function isValidDSK(dsk) {
  const patternMatches = /^(\d{5}-){7}\d{5}$/.test(dsk);
  if (!patternMatches)
    return false;
  return dsk.split("-").map((p) => parseInt(p, 10)).every((p) => p <= 65535);
}

// node_modules/@zwave-js/core/build/esm/qr/definitions.js
var onlyDigitsRegex = /^\d+$/;
var minQRCodeLength = 52;
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

// node_modules/@zwave-js/core/build/esm/values/Primitive.js
var IntegerLimits = Object.freeze({
  UInt8: Object.freeze({ min: 0, max: 255 }),
  UInt16: Object.freeze({ min: 0, max: 65535 }),
  UInt24: Object.freeze({ min: 0, max: 16777215 }),
  UInt32: Object.freeze({ min: 0, max: 4294967295 }),
  Int8: Object.freeze({ min: -128, max: 127 }),
  Int16: Object.freeze({ min: -32768, max: 32767 }),
  Int24: Object.freeze({ min: -8388608, max: 8388607 }),
  Int32: Object.freeze({ min: -2147483648, max: 2147483647 })
});
function parseBitMask(mask, startValue = 1, numBits = mask.length * 8) {
  const ret = [];
  for (let index = 0; index < numBits; index++) {
    const byteNum = index >>> 3;
    const bitNum = index % 8;
    if ((mask[byteNum] & 2 ** bitNum) !== 0) {
      ret.push(index + startValue);
    }
  }
  return ret;
}

// node_modules/@zwave-js/core/build/esm/qr/utils.js
function readNumber(qr, offset, length) {
  return parseInt(qr.slice(offset, offset + length), 10);
}
function fail(reason) {
  throw new ZWaveError(`Invalid QR code: ${reason}`, ZWaveErrorCodes.Security2CC_InvalidQRCode);
}
function readLevel(qr, offset) {
  const ret = readNumber(qr, offset, 2);
  if (ret > 99)
    fail("invalid data");
  return ret;
}
function readUInt8(qr, offset) {
  const ret = readNumber(qr, offset, 3);
  if (ret > 255)
    fail("invalid data");
  return ret;
}
function readUInt16(qr, offset) {
  const ret = readNumber(qr, offset, 5);
  if (ret > 65535)
    fail("invalid data");
  return ret;
}
function parseTLVData(type, data) {
  switch (type) {
    case ProvisioningInformationType.ProductType: {
      const deviceClasses = readUInt16(data, 0);
      const installerIconType = readUInt16(data, 5);
      const ret = {
        genericDeviceClass: deviceClasses >>> 8,
        specificDeviceClass: deviceClasses & 255,
        installerIconType
      };
      return ret;
    }
    case ProvisioningInformationType.ProductId: {
      const manufacturerId = readUInt16(data, 0);
      const productType = readUInt16(data, 5);
      const productId = readUInt16(data, 10);
      const applicationVersionNumeric = readUInt16(data, 15);
      const applicationVersion = `${applicationVersionNumeric >>> 8}.${applicationVersionNumeric & 255}`;
      const ret = {
        manufacturerId,
        productType,
        productId,
        applicationVersion
      };
      return ret;
    }
    case ProvisioningInformationType.MaxInclusionRequestInterval: {
      const maxInclusionRequestInterval = 128 * readLevel(data, 0);
      const ret = {
        maxInclusionRequestInterval
      };
      return ret;
    }
    case ProvisioningInformationType.UUID16: {
      const buffer = new Bytes(16);
      const presentationFormat = readLevel(data, 0);
      if (presentationFormat !== 0)
        return;
      for (let chunk = 0; chunk < 8; chunk++) {
        const value = readUInt16(data, 2 + chunk * 5);
        buffer.writeUInt16BE(value, chunk * 2);
      }
      const ret = {
        uuid: buffer.toString("hex")
      };
      return ret;
    }
    case ProvisioningInformationType.SupportedProtocols: {
      const bitMask = Uint8Array.from([
        data.length === 2 ? readLevel(data, 0) : data.length === 3 ? readUInt8(data, 0) : data.length === 5 ? readUInt16(data, 0) : 0
      ]);
      const supportedProtocols = parseBitMask(bitMask, Protocols.ZWave);
      const ret = {
        supportedProtocols
      };
      return ret;
    }
  }
}
function parseTLV(qr) {
  let offset = 0;
  if (qr.length - offset < 4)
    fail("incomplete TLV block");
  const typeCritical = readLevel(qr, offset);
  const type = typeCritical >>> 1;
  const critical = !!(typeCritical & 1);
  const length = readLevel(qr, offset + 2);
  offset += 4;
  if (qr.length - offset < length)
    fail("incomplete TLV block");
  const data = qr.slice(offset, offset + length);
  offset += length;
  const parsed = parseTLVData(type, data);
  if (!parsed && critical)
    fail("Unsupported critical TLV block");
  let entry;
  if (parsed) {
    entry = {
      type,
      ...parsed
    };
  } else {
    entry = {
      type,
      [ProvisioningInformationType[type]]: data
    };
  }
  return {
    entry,
    charsRead: offset
  };
}

// node_modules/@zwave-js/core/build/esm/qr/parse.js
async function parseQRCodeString(qr) {
  qr = qr.trim();
  if (!qr.startsWith("90"))
    fail("must start with 90");
  if (qr.length < minQRCodeLength)
    fail("too short");
  if (!onlyDigitsRegex.test(qr))
    fail("contains invalid characters");
  const version = readLevel(qr, 2);
  if (version > QRCodeVersion.SmartStart)
    fail("invalid version");
  const checksum = readUInt16(qr, 4);
  const checksumInput = new TextEncoder().encode(qr.slice(9));
  const hashResult = await digest2("sha-1", checksumInput);
  const expectedChecksum = Bytes.view(hashResult).readUInt16BE(0);
  if (checksum !== expectedChecksum)
    fail("invalid checksum");
  const requestedKeysBitmask = readUInt8(qr, 9);
  const requestedSecurityClasses = parseBitMask([requestedKeysBitmask], SecurityClass.S2_Unauthenticated);
  if (!requestedSecurityClasses.every((k) => k in SecurityClass)) {
    fail("invalid security class requested");
  }
  let offset = 12;
  const dsk = new Bytes(16);
  for (let dskBlock = 0; dskBlock < 8; dskBlock++) {
    const block = readUInt16(qr, offset);
    dsk.writeUInt16BE(block, dskBlock * 2);
    offset += 5;
  }
  const ret = {
    version,
    // This seems like a duplication, but it's more convenient for applications to not have to copy this field over
    requestedSecurityClasses,
    securityClasses: [...requestedSecurityClasses],
    dsk: dskToString(dsk)
  };
  let hasProductID = false;
  let hasProductType = false;
  while (offset < qr.length) {
    const { entry: { type, ...data }, charsRead } = parseTLV(qr.slice(offset));
    offset += charsRead;
    if (type === ProvisioningInformationType.ProductId) {
      hasProductID = true;
    } else if (type === ProvisioningInformationType.ProductType) {
      hasProductType = true;
    }
    Object.assign(ret, data);
  }
  if (!hasProductID || !hasProductType) {
    fail("missing required fields");
  }
  return ret;
}

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
      uint16(info.installerIconType)
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
var btnParse = document.getElementById("parse");
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
async function parseQR() {
  let qr;
  try {
    qr = await parseQRCodeString(lblQRText.value);
  } catch (e) {
    lblErrorMessage.innerText = e.message;
    return;
  }
  chkS2AccessControl.checked = qr.securityClasses.includes(SecurityClass.S2_AccessControl);
  chkS2Authenticated.checked = qr.securityClasses.includes(SecurityClass.S2_Authenticated);
  chkS2Unauthenticated.checked = qr.securityClasses.includes(SecurityClass.S2_Unauthenticated);
  chkS0.checked = qr.securityClasses.includes(SecurityClass.S0_Legacy);
  chkProtocol.checked = qr.supportedProtocols !== void 0;
  chkProtocolZWave.checked = qr.supportedProtocols?.includes(Protocols.ZWave) ?? false;
  chkProtocolZWaveLR.checked = qr.supportedProtocols?.includes(Protocols.ZWaveLongRange) ?? false;
  txtDSK.value = qr.dsk;
  txtDeviceClassGeneric.value = qr.genericDeviceClass.toString(10);
  lblDeviceClassGenericHex.innerText = "0x" + qr.genericDeviceClass.toString(16).padStart(4, "0");
  txtDeviceClassSpecific.value = qr.specificDeviceClass.toString(10);
  lblDeviceClassSpecificHex.innerText = "0x" + qr.specificDeviceClass.toString(16).padStart(4, "0");
  txtDeviceClassIcon.value = qr.installerIconType.toString(10);
  lblDeviceClassIconHex.innerText = "0x" + qr.installerIconType.toString(16).padStart(4, "0");
  txtManufacturerId.value = qr.manufacturerId.toString(10);
  lblManufacturerIdHex.innerText = "0x" + qr.manufacturerId.toString(16).padStart(4, "0");
  txtProductType.value = qr.productType.toString(10);
  lblProductTypeHex.innerText = "0x" + qr.productType.toString(16).padStart(4, "0");
  txtProductId.value = qr.productId.toString(10);
  lblProductIdHex.innerText = "0x" + qr.productId.toString(16).padStart(4, "0");
  txtVersionMajor.value = qr.applicationVersion.split(".")[0];
  txtVersionMinor.value = qr.applicationVersion.split(".")[1];
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
btnParse.onclick = parseQR;
export {
  generateQRCode
};
//# sourceMappingURL=script.js.map
