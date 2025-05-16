(() => {
  var __create = Object.create;
  var __defProp = Object.defineProperty;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __getProtoOf = Object.getPrototypeOf;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __commonJS = (cb, mod) => function __require() {
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

  // node_modules/seedrandom/lib/alea.js
  var require_alea = __commonJS({
    "node_modules/seedrandom/lib/alea.js"(exports, module) {
      (function(global, module2, define2) {
        function Alea(seed) {
          var me = this, mash = Mash();
          me.next = function() {
            var t = 2091639 * me.s0 + me.c * 23283064365386963e-26;
            me.s0 = me.s1;
            me.s1 = me.s2;
            return me.s2 = t - (me.c = t | 0);
          };
          me.c = 1;
          me.s0 = mash(" ");
          me.s1 = mash(" ");
          me.s2 = mash(" ");
          me.s0 -= mash(seed);
          if (me.s0 < 0) {
            me.s0 += 1;
          }
          me.s1 -= mash(seed);
          if (me.s1 < 0) {
            me.s1 += 1;
          }
          me.s2 -= mash(seed);
          if (me.s2 < 0) {
            me.s2 += 1;
          }
          mash = null;
        }
        function copy(f, t) {
          t.c = f.c;
          t.s0 = f.s0;
          t.s1 = f.s1;
          t.s2 = f.s2;
          return t;
        }
        function impl(seed, opts) {
          var xg = new Alea(seed), state = opts && opts.state, prng = xg.next;
          prng.int32 = function() {
            return xg.next() * 4294967296 | 0;
          };
          prng.double = function() {
            return prng() + (prng() * 2097152 | 0) * 11102230246251565e-32;
          };
          prng.quick = prng;
          if (state) {
            if (typeof state == "object") copy(state, xg);
            prng.state = function() {
              return copy(xg, {});
            };
          }
          return prng;
        }
        function Mash() {
          var n = 4022871197;
          var mash = function(data) {
            data = String(data);
            for (var i = 0; i < data.length; i++) {
              n += data.charCodeAt(i);
              var h = 0.02519603282416938 * n;
              n = h >>> 0;
              h -= n;
              h *= n;
              n = h >>> 0;
              h -= n;
              n += h * 4294967296;
            }
            return (n >>> 0) * 23283064365386963e-26;
          };
          return mash;
        }
        if (module2 && module2.exports) {
          module2.exports = impl;
        } else if (define2 && define2.amd) {
          define2(function() {
            return impl;
          });
        } else {
          this.alea = impl;
        }
      })(
        exports,
        typeof module == "object" && module,
        // present in node.js
        typeof define == "function" && define
        // present with an AMD loader
      );
    }
  });

  // node_modules/seedrandom/lib/xor128.js
  var require_xor128 = __commonJS({
    "node_modules/seedrandom/lib/xor128.js"(exports, module) {
      (function(global, module2, define2) {
        function XorGen(seed) {
          var me = this, strseed = "";
          me.x = 0;
          me.y = 0;
          me.z = 0;
          me.w = 0;
          me.next = function() {
            var t = me.x ^ me.x << 11;
            me.x = me.y;
            me.y = me.z;
            me.z = me.w;
            return me.w ^= me.w >>> 19 ^ t ^ t >>> 8;
          };
          if (seed === (seed | 0)) {
            me.x = seed;
          } else {
            strseed += seed;
          }
          for (var k = 0; k < strseed.length + 64; k++) {
            me.x ^= strseed.charCodeAt(k) | 0;
            me.next();
          }
        }
        function copy(f, t) {
          t.x = f.x;
          t.y = f.y;
          t.z = f.z;
          t.w = f.w;
          return t;
        }
        function impl(seed, opts) {
          var xg = new XorGen(seed), state = opts && opts.state, prng = function() {
            return (xg.next() >>> 0) / 4294967296;
          };
          prng.double = function() {
            do {
              var top = xg.next() >>> 11, bot = (xg.next() >>> 0) / 4294967296, result = (top + bot) / (1 << 21);
            } while (result === 0);
            return result;
          };
          prng.int32 = xg.next;
          prng.quick = prng;
          if (state) {
            if (typeof state == "object") copy(state, xg);
            prng.state = function() {
              return copy(xg, {});
            };
          }
          return prng;
        }
        if (module2 && module2.exports) {
          module2.exports = impl;
        } else if (define2 && define2.amd) {
          define2(function() {
            return impl;
          });
        } else {
          this.xor128 = impl;
        }
      })(
        exports,
        typeof module == "object" && module,
        // present in node.js
        typeof define == "function" && define
        // present with an AMD loader
      );
    }
  });

  // node_modules/seedrandom/lib/xorwow.js
  var require_xorwow = __commonJS({
    "node_modules/seedrandom/lib/xorwow.js"(exports, module) {
      (function(global, module2, define2) {
        function XorGen(seed) {
          var me = this, strseed = "";
          me.next = function() {
            var t = me.x ^ me.x >>> 2;
            me.x = me.y;
            me.y = me.z;
            me.z = me.w;
            me.w = me.v;
            return (me.d = me.d + 362437 | 0) + (me.v = me.v ^ me.v << 4 ^ (t ^ t << 1)) | 0;
          };
          me.x = 0;
          me.y = 0;
          me.z = 0;
          me.w = 0;
          me.v = 0;
          if (seed === (seed | 0)) {
            me.x = seed;
          } else {
            strseed += seed;
          }
          for (var k = 0; k < strseed.length + 64; k++) {
            me.x ^= strseed.charCodeAt(k) | 0;
            if (k == strseed.length) {
              me.d = me.x << 10 ^ me.x >>> 4;
            }
            me.next();
          }
        }
        function copy(f, t) {
          t.x = f.x;
          t.y = f.y;
          t.z = f.z;
          t.w = f.w;
          t.v = f.v;
          t.d = f.d;
          return t;
        }
        function impl(seed, opts) {
          var xg = new XorGen(seed), state = opts && opts.state, prng = function() {
            return (xg.next() >>> 0) / 4294967296;
          };
          prng.double = function() {
            do {
              var top = xg.next() >>> 11, bot = (xg.next() >>> 0) / 4294967296, result = (top + bot) / (1 << 21);
            } while (result === 0);
            return result;
          };
          prng.int32 = xg.next;
          prng.quick = prng;
          if (state) {
            if (typeof state == "object") copy(state, xg);
            prng.state = function() {
              return copy(xg, {});
            };
          }
          return prng;
        }
        if (module2 && module2.exports) {
          module2.exports = impl;
        } else if (define2 && define2.amd) {
          define2(function() {
            return impl;
          });
        } else {
          this.xorwow = impl;
        }
      })(
        exports,
        typeof module == "object" && module,
        // present in node.js
        typeof define == "function" && define
        // present with an AMD loader
      );
    }
  });

  // node_modules/seedrandom/lib/xorshift7.js
  var require_xorshift7 = __commonJS({
    "node_modules/seedrandom/lib/xorshift7.js"(exports, module) {
      (function(global, module2, define2) {
        function XorGen(seed) {
          var me = this;
          me.next = function() {
            var X = me.x, i = me.i, t, v, w;
            t = X[i];
            t ^= t >>> 7;
            v = t ^ t << 24;
            t = X[i + 1 & 7];
            v ^= t ^ t >>> 10;
            t = X[i + 3 & 7];
            v ^= t ^ t >>> 3;
            t = X[i + 4 & 7];
            v ^= t ^ t << 7;
            t = X[i + 7 & 7];
            t = t ^ t << 13;
            v ^= t ^ t << 9;
            X[i] = v;
            me.i = i + 1 & 7;
            return v;
          };
          function init(me2, seed2) {
            var j, w, X = [];
            if (seed2 === (seed2 | 0)) {
              w = X[0] = seed2;
            } else {
              seed2 = "" + seed2;
              for (j = 0; j < seed2.length; ++j) {
                X[j & 7] = X[j & 7] << 15 ^ seed2.charCodeAt(j) + X[j + 1 & 7] << 13;
              }
            }
            while (X.length < 8) X.push(0);
            for (j = 0; j < 8 && X[j] === 0; ++j) ;
            if (j == 8) w = X[7] = -1;
            else w = X[j];
            me2.x = X;
            me2.i = 0;
            for (j = 256; j > 0; --j) {
              me2.next();
            }
          }
          init(me, seed);
        }
        function copy(f, t) {
          t.x = f.x.slice();
          t.i = f.i;
          return t;
        }
        function impl(seed, opts) {
          if (seed == null) seed = +/* @__PURE__ */ new Date();
          var xg = new XorGen(seed), state = opts && opts.state, prng = function() {
            return (xg.next() >>> 0) / 4294967296;
          };
          prng.double = function() {
            do {
              var top = xg.next() >>> 11, bot = (xg.next() >>> 0) / 4294967296, result = (top + bot) / (1 << 21);
            } while (result === 0);
            return result;
          };
          prng.int32 = xg.next;
          prng.quick = prng;
          if (state) {
            if (state.x) copy(state, xg);
            prng.state = function() {
              return copy(xg, {});
            };
          }
          return prng;
        }
        if (module2 && module2.exports) {
          module2.exports = impl;
        } else if (define2 && define2.amd) {
          define2(function() {
            return impl;
          });
        } else {
          this.xorshift7 = impl;
        }
      })(
        exports,
        typeof module == "object" && module,
        // present in node.js
        typeof define == "function" && define
        // present with an AMD loader
      );
    }
  });

  // node_modules/seedrandom/lib/xor4096.js
  var require_xor4096 = __commonJS({
    "node_modules/seedrandom/lib/xor4096.js"(exports, module) {
      (function(global, module2, define2) {
        function XorGen(seed) {
          var me = this;
          me.next = function() {
            var w = me.w, X = me.X, i = me.i, t, v;
            me.w = w = w + 1640531527 | 0;
            v = X[i + 34 & 127];
            t = X[i = i + 1 & 127];
            v ^= v << 13;
            t ^= t << 17;
            v ^= v >>> 15;
            t ^= t >>> 12;
            v = X[i] = v ^ t;
            me.i = i;
            return v + (w ^ w >>> 16) | 0;
          };
          function init(me2, seed2) {
            var t, v, i, j, w, X = [], limit = 128;
            if (seed2 === (seed2 | 0)) {
              v = seed2;
              seed2 = null;
            } else {
              seed2 = seed2 + "\0";
              v = 0;
              limit = Math.max(limit, seed2.length);
            }
            for (i = 0, j = -32; j < limit; ++j) {
              if (seed2) v ^= seed2.charCodeAt((j + 32) % seed2.length);
              if (j === 0) w = v;
              v ^= v << 10;
              v ^= v >>> 15;
              v ^= v << 4;
              v ^= v >>> 13;
              if (j >= 0) {
                w = w + 1640531527 | 0;
                t = X[j & 127] ^= v + w;
                i = 0 == t ? i + 1 : 0;
              }
            }
            if (i >= 128) {
              X[(seed2 && seed2.length || 0) & 127] = -1;
            }
            i = 127;
            for (j = 4 * 128; j > 0; --j) {
              v = X[i + 34 & 127];
              t = X[i = i + 1 & 127];
              v ^= v << 13;
              t ^= t << 17;
              v ^= v >>> 15;
              t ^= t >>> 12;
              X[i] = v ^ t;
            }
            me2.w = w;
            me2.X = X;
            me2.i = i;
          }
          init(me, seed);
        }
        function copy(f, t) {
          t.i = f.i;
          t.w = f.w;
          t.X = f.X.slice();
          return t;
        }
        ;
        function impl(seed, opts) {
          if (seed == null) seed = +/* @__PURE__ */ new Date();
          var xg = new XorGen(seed), state = opts && opts.state, prng = function() {
            return (xg.next() >>> 0) / 4294967296;
          };
          prng.double = function() {
            do {
              var top = xg.next() >>> 11, bot = (xg.next() >>> 0) / 4294967296, result = (top + bot) / (1 << 21);
            } while (result === 0);
            return result;
          };
          prng.int32 = xg.next;
          prng.quick = prng;
          if (state) {
            if (state.X) copy(state, xg);
            prng.state = function() {
              return copy(xg, {});
            };
          }
          return prng;
        }
        if (module2 && module2.exports) {
          module2.exports = impl;
        } else if (define2 && define2.amd) {
          define2(function() {
            return impl;
          });
        } else {
          this.xor4096 = impl;
        }
      })(
        exports,
        // window object or global
        typeof module == "object" && module,
        // present in node.js
        typeof define == "function" && define
        // present with an AMD loader
      );
    }
  });

  // node_modules/seedrandom/lib/tychei.js
  var require_tychei = __commonJS({
    "node_modules/seedrandom/lib/tychei.js"(exports, module) {
      (function(global, module2, define2) {
        function XorGen(seed) {
          var me = this, strseed = "";
          me.next = function() {
            var b = me.b, c = me.c, d = me.d, a = me.a;
            b = b << 25 ^ b >>> 7 ^ c;
            c = c - d | 0;
            d = d << 24 ^ d >>> 8 ^ a;
            a = a - b | 0;
            me.b = b = b << 20 ^ b >>> 12 ^ c;
            me.c = c = c - d | 0;
            me.d = d << 16 ^ c >>> 16 ^ a;
            return me.a = a - b | 0;
          };
          me.a = 0;
          me.b = 0;
          me.c = 2654435769 | 0;
          me.d = 1367130551;
          if (seed === Math.floor(seed)) {
            me.a = seed / 4294967296 | 0;
            me.b = seed | 0;
          } else {
            strseed += seed;
          }
          for (var k = 0; k < strseed.length + 20; k++) {
            me.b ^= strseed.charCodeAt(k) | 0;
            me.next();
          }
        }
        function copy(f, t) {
          t.a = f.a;
          t.b = f.b;
          t.c = f.c;
          t.d = f.d;
          return t;
        }
        ;
        function impl(seed, opts) {
          var xg = new XorGen(seed), state = opts && opts.state, prng = function() {
            return (xg.next() >>> 0) / 4294967296;
          };
          prng.double = function() {
            do {
              var top = xg.next() >>> 11, bot = (xg.next() >>> 0) / 4294967296, result = (top + bot) / (1 << 21);
            } while (result === 0);
            return result;
          };
          prng.int32 = xg.next;
          prng.quick = prng;
          if (state) {
            if (typeof state == "object") copy(state, xg);
            prng.state = function() {
              return copy(xg, {});
            };
          }
          return prng;
        }
        if (module2 && module2.exports) {
          module2.exports = impl;
        } else if (define2 && define2.amd) {
          define2(function() {
            return impl;
          });
        } else {
          this.tychei = impl;
        }
      })(
        exports,
        typeof module == "object" && module,
        // present in node.js
        typeof define == "function" && define
        // present with an AMD loader
      );
    }
  });

  // (disabled):crypto
  var require_crypto = __commonJS({
    "(disabled):crypto"() {
    }
  });

  // node_modules/seedrandom/seedrandom.js
  var require_seedrandom = __commonJS({
    "node_modules/seedrandom/seedrandom.js"(exports, module) {
      (function(global, pool, math) {
        var width = 256, chunks = 6, digits = 52, rngname = "random", startdenom = math.pow(width, chunks), significance = math.pow(2, digits), overflow = significance * 2, mask = width - 1, nodecrypto;
        function seedrandom2(seed, options, callback) {
          var key = [];
          options = options == true ? { entropy: true } : options || {};
          var shortseed = mixkey(flatten(
            options.entropy ? [seed, tostring(pool)] : seed == null ? autoseed() : seed,
            3
          ), key);
          var arc4 = new ARC4(key);
          var prng = function() {
            var n = arc4.g(chunks), d = startdenom, x = 0;
            while (n < significance) {
              n = (n + x) * width;
              d *= width;
              x = arc4.g(1);
            }
            while (n >= overflow) {
              n /= 2;
              d /= 2;
              x >>>= 1;
            }
            return (n + x) / d;
          };
          prng.int32 = function() {
            return arc4.g(4) | 0;
          };
          prng.quick = function() {
            return arc4.g(4) / 4294967296;
          };
          prng.double = prng;
          mixkey(tostring(arc4.S), pool);
          return (options.pass || callback || function(prng2, seed2, is_math_call, state) {
            if (state) {
              if (state.S) {
                copy(state, arc4);
              }
              prng2.state = function() {
                return copy(arc4, {});
              };
            }
            if (is_math_call) {
              math[rngname] = prng2;
              return seed2;
            } else return prng2;
          })(
            prng,
            shortseed,
            "global" in options ? options.global : this == math,
            options.state
          );
        }
        function ARC4(key) {
          var t, keylen = key.length, me = this, i = 0, j = me.i = me.j = 0, s = me.S = [];
          if (!keylen) {
            key = [keylen++];
          }
          while (i < width) {
            s[i] = i++;
          }
          for (i = 0; i < width; i++) {
            s[i] = s[j = mask & j + key[i % keylen] + (t = s[i])];
            s[j] = t;
          }
          (me.g = function(count) {
            var t2, r = 0, i2 = me.i, j2 = me.j, s2 = me.S;
            while (count--) {
              t2 = s2[i2 = mask & i2 + 1];
              r = r * width + s2[mask & (s2[i2] = s2[j2 = mask & j2 + t2]) + (s2[j2] = t2)];
            }
            me.i = i2;
            me.j = j2;
            return r;
          })(width);
        }
        function copy(f, t) {
          t.i = f.i;
          t.j = f.j;
          t.S = f.S.slice();
          return t;
        }
        ;
        function flatten(obj, depth) {
          var result = [], typ = typeof obj, prop;
          if (depth && typ == "object") {
            for (prop in obj) {
              try {
                result.push(flatten(obj[prop], depth - 1));
              } catch (e) {
              }
            }
          }
          return result.length ? result : typ == "string" ? obj : obj + "\0";
        }
        function mixkey(seed, key) {
          var stringseed = seed + "", smear, j = 0;
          while (j < stringseed.length) {
            key[mask & j] = mask & (smear ^= key[mask & j] * 19) + stringseed.charCodeAt(j++);
          }
          return tostring(key);
        }
        function autoseed() {
          try {
            var out;
            if (nodecrypto && (out = nodecrypto.randomBytes)) {
              out = out(width);
            } else {
              out = new Uint8Array(width);
              (global.crypto || global.msCrypto).getRandomValues(out);
            }
            return tostring(out);
          } catch (e) {
            var browser = global.navigator, plugins = browser && browser.plugins;
            return [+/* @__PURE__ */ new Date(), global, plugins, global.screen, tostring(pool)];
          }
        }
        function tostring(a) {
          return String.fromCharCode.apply(0, a);
        }
        mixkey(math.random(), pool);
        if (typeof module == "object" && module.exports) {
          module.exports = seedrandom2;
          try {
            nodecrypto = require_crypto();
          } catch (ex) {
          }
        } else if (typeof define == "function" && define.amd) {
          define(function() {
            return seedrandom2;
          });
        } else {
          math["seed" + rngname] = seedrandom2;
        }
      })(
        // global: `self` in browsers (including strict mode and web workers),
        // otherwise `this` in Node and other environments
        typeof self !== "undefined" ? self : exports,
        [],
        // pool: entropy pool starts empty
        Math
        // math: package containing random, pow, and seedrandom
      );
    }
  });

  // node_modules/seedrandom/index.js
  var require_seedrandom2 = __commonJS({
    "node_modules/seedrandom/index.js"(exports, module) {
      var alea = require_alea();
      var xor128 = require_xor128();
      var xorwow = require_xorwow();
      var xorshift7 = require_xorshift7();
      var xor4096 = require_xor4096();
      var tychei = require_tychei();
      var sr = require_seedrandom();
      sr.alea = alea;
      sr.xor128 = xor128;
      sr.xorwow = xorwow;
      sr.xorshift7 = xorshift7;
      sr.xor4096 = xor4096;
      sr.tychei = tychei;
      module.exports = sr;
    }
  });

  // src/gl-lib.ts
  function createShader(gl2, source, type) {
    const shader = gl2.createShader(type);
    if (!shader) return void 0;
    gl2.shaderSource(shader, source);
    gl2.compileShader(shader);
    if (!gl2.getShaderParameter(shader, gl2.COMPILE_STATUS)) {
      console.log(gl2.getShaderInfoLog(shader));
      return;
    }
    return shader;
  }
  function createProgram(gl2, vertex, fragment) {
    const prog = gl2.createProgram();
    if (!prog) return void 0;
    gl2.attachShader(prog, vertex);
    gl2.attachShader(prog, fragment);
    gl2.linkProgram(prog);
    if (!gl2.getProgramParameter(prog, gl2.LINK_STATUS)) {
      gl2.getProgramInfoLog(prog);
      return void 0;
    }
    return prog;
  }
  function createProgramFromShaderSources(gl2, vertex, fragment) {
    const maybeVShader = createShader(gl2, vertex, gl2.VERTEX_SHADER);
    const maybeFShader = createShader(gl2, fragment, gl2.FRAGMENT_SHADER);
    if (!maybeVShader || !maybeFShader) return void 0;
    return createProgram(gl2, maybeVShader, maybeFShader);
  }
  function makeUniformSetter(gl2, prog) {
    return (type, name, ...data) => {
      gl2["uniform" + type](gl2.getUniformLocation(prog, name), ...data);
    };
  }
  var FULLSCREEN_QUAD = new Float32Array([
    -1,
    1,
    1,
    1,
    1,
    -1,
    -1,
    1,
    1,
    -1,
    -1,
    -1
  ]);

  // src/levels.ts
  var LEVELS = [
    {
      bottomLeft: {
        x: -1.567237808935025,
        y: -0.5634295039781368
      },
      topRight: {
        x: -0.4635249284236504,
        y: 0.540283376533235
      },
      fractalIndex: 1,
      params: {
        x: 0.2,
        y: -0.6
      }
    },
    {
      bottomLeft: {
        x: -0.7167493837524495,
        y: 0.40506130306021365
      },
      topRight: {
        x: -0.3224314822733099,
        y: 0.7993792045393522
      },
      fractalIndex: 1,
      params: {
        x: 0.2,
        y: -0.6
      }
    },
    {
      bottomLeft: {
        x: 0.21373789725275888,
        y: -0.08591326357228113
      },
      topRight: {
        x: 0.37552217091227036,
        y: 0.0758710100872297
      },
      fractalIndex: 1,
      params: {
        x: -0.3436385255648038,
        y: -0.004282655246252709
      }
    },
    {
      bottomLeft: {
        x: -1.8968619993813423,
        y: -0.13524676606496094
      },
      topRight: {
        x: -1.6253906671956728,
        y: 0.1362245661207094
      },
      fractalIndex: 1,
      params: {
        x: -0.3436385255648038,
        y: -0.004282655246252709
      }
    },
    // add some more levels here between zoom levels 4 and 14
    {
      bottomLeft: {
        x: 0.047514078338310714,
        y: 0.5813964071711524
      },
      topRight: {
        x: 0.22281609140514436,
        y: 0.7566984202379872
      },
      fractalIndex: 1,
      params: {
        x: 0.2,
        y: -0.6
      }
    },
    {
      bottomLeft: {
        x: -1.5308643358316392,
        y: -0.25933954441185697
      },
      topRight: {
        x: -1.320939534620107,
        y: -0.049414743200325115
      },
      fractalIndex: 1,
      params: {
        x: 0.2,
        y: -0.6
      }
    },
    {
      bottomLeft: {
        x: 0.3267041411059802,
        y: 0.5797128874572623
      },
      topRight: {
        x: 0.4374003189766384,
        y: 0.6904090653279197
      },
      fractalIndex: 1,
      params: {
        x: 0.2,
        y: -0.6
      }
    },
    {
      bottomLeft: {
        x: -0.7312708839988104,
        y: -0.509526368359592
      },
      topRight: {
        x: -0.6430550187428722,
        y: -0.42131050310364987
      },
      fractalIndex: 1,
      params: {
        x: -0.16057585825027687,
        y: 0.20342612419700212
      }
    },
    // harder stuff
    {
      bottomLeft: {
        x: -0.29217933711418237,
        y: 0.8075503227659846
      },
      topRight: {
        x: -0.21715530646090014,
        y: 0.8825743534192677
      },
      fractalIndex: 1,
      params: {
        x: 0.2,
        y: -0.6
      }
    },
    {
      bottomLeft: {
        x: -0.6091914677639261,
        y: -0.6826542138250117
      },
      topRight: {
        x: -0.5381912220238967,
        y: -0.6116539680935971
      },
      fractalIndex: 1,
      params: {
        x: -0.20332936979785965,
        y: -0.31049250535331907
      }
    },
    {
      bottomLeft: {
        x: 0.3269114127814559,
        y: 0.6148588972516744
      },
      topRight: {
        x: 0.38587313000551615,
        y: 0.6738206144757348
      },
      fractalIndex: 1,
      params: {
        x: 0.2,
        y: -0.6
      }
    },
    {
      bottomLeft: {
        x: -0.761522302414126,
        y: 0.18329183413934488
      },
      topRight: {
        x: -0.7113791956054126,
        y: 0.23343494094805375
      },
      fractalIndex: 1,
      params: {
        x: 0.2,
        y: -0.6
      }
    },
    {
      bottomLeft: {
        x: -0.9479219885015935,
        y: -0.3097326614583672
      },
      topRight: {
        x: -0.9108836237290072,
        y: -0.27269429668578415
      },
      fractalIndex: 1,
      params: {
        x: 0.2,
        y: -0.6
      }
    },
    {
      bottomLeft: {
        x: 0.1614078112917602,
        y: -0.6094354894280556
      },
      topRight: {
        x: 0.20347496263492398,
        y: -0.5673683380848925
      },
      fractalIndex: 1,
      params: {
        x: 0.2,
        y: -0.6
      }
    },
    {
      bottomLeft: {
        x: -0.8375141320941696,
        y: 0.22917754201213877
      },
      topRight: {
        x: -0.8249876431805833,
        y: 0.24170403092572515
      },
      fractalIndex: 1,
      params: {
        x: 0.34883720930232553,
        y: -0.25267665952890794
      }
    },
    {
      bottomLeft: {
        x: -1.767772771788433,
        y: 0.011721642294182776
      },
      topRight: {
        x: -1.7582273846389225,
        y: 0.02126702944369282
      },
      fractalIndex: 1,
      params: {
        x: 0.2,
        y: -0.6
      }
    },
    {
      bottomLeft: {
        x: -0.20039358578346736,
        y: 1.0982350414761437
      },
      topRight: {
        x: -0.1963110863991057,
        y: 1.102317540860506
      },
      fractalIndex: 1,
      params: {
        x: -0.01218161683277963,
        y: 0.008565310492505418
      }
    },
    // ok this stuff im intentionally making difficult lmao
    {
      bottomLeft: {
        x: -0.4975743875044242,
        y: 0.6255659336299683
      },
      topRight: {
        x: -0.4905725306284329,
        y: 0.6325677905059593
      },
      fractalIndex: 1,
      params: {
        x: 0.2,
        y: -0.6
      }
    },
    {
      bottomLeft: {
        x: -1.3854368508960502,
        y: -0.03319120160045996
      },
      topRight: {
        x: -1.3702725425998266,
        y: -0.018026893304237075
      },
      fractalIndex: 1,
      params: {
        x: 0.2,
        y: -0.6
      }
    },
    {
      bottomLeft: {
        x: 0.3281951514017246,
        y: -0.043233928890188324
      },
      topRight: {
        x: 0.3305850998042167,
        y: -0.040843980487696004
      },
      fractalIndex: 1,
      params: {
        x: 0.2,
        y: -0.6
      }
    },
    {
      bottomLeft: {
        x: 0.423856865600202,
        y: 0.3388219086560594
      },
      topRight: {
        x: 0.4283982167562747,
        y: 0.3433632598121322
      },
      fractalIndex: 1,
      params: {
        x: 0.2,
        y: -0.6
      }
    },
    {
      bottomLeft: {
        x: -0.5578105689329734,
        y: -0.6480566527297372
      },
      topRight: {
        x: -0.5551302686551465,
        y: -0.6453763524519139
      },
      fractalIndex: 1,
      params: {
        x: 0.2,
        y: -0.6
      }
    },
    {
      bottomLeft: {
        x: -48589924650560003e-20,
        y: 0.7927371880210792
      },
      topRight: {
        x: 28688237081409023e-20,
        y: 0.7935099696384382
      },
      fractalIndex: 1,
      params: {
        x: 0.3045404208194906,
        y: 0.37044967880085644
      }
    },
    {
      bottomLeft: {
        x: -1.4377465903502502,
        y: 0.0012340326474489767
      },
      topRight: {
        x: -1.435141154523501,
        y: 0.0038394684741987436
      },
      fractalIndex: 1,
      params: {
        x: 0.2,
        y: -0.6
      }
    },
    {
      bottomLeft: {
        x: -0.7706819950131055,
        y: -0.11786057656758708
      },
      topRight: {
        x: -0.7672803772670385,
        y: -0.1144589588215196
      },
      fractalIndex: 1,
      params: {
        x: 0.28682170542635665,
        y: -0.06638115631691643
      }
    }
    // {
    //   bottomLeft: {
    //     x: -0.302373124875951,
    //     y: -1.0315392869672173,
    //   },
    //   topRight: {
    //     x: 0.4567576185848055,
    //     y: -0.2724085435064655,
    //   },
    //   fractalIndex: 1,
    //   params: {
    //     x: 0.2,
    //     y: -0.6,
    //   },
    // },
    // {
    //   bottomLeft: {
    //     x: -1.0808099909819329,
    //     y: -0.5385742813352624,
    //   },
    //   topRight: {
    //     x: -0.684866200062996,
    //     y: -0.14263049041632594,
    //   },
    //   fractalIndex: 1,
    //   params: {
    //     x: 0.2,
    //     y: -0.6,
    //   },
    // },
    // {
    //   bottomLeft: {
    //     x: -1.2629528160529173,
    //     y: 0.3745317849422254,
    //   },
    //   topRight: {
    //     x: -1.2485148474591334,
    //     y: 0.38896975353601,
    //   },
    //   fractalIndex: 1,
    //   params: {
    //     x: 0.2,
    //     y: -0.6,
    //   },
    // },
    // {
    //   bottomLeft: {
    //     x: 0.34708677390673875,
    //     y: 0.5729895209222156,
    //   },
    //   topRight: {
    //     x: 0.38386464665796144,
    //     y: 0.6097673936734397,
    //   },
    //   fractalIndex: 1,
    //   params: {
    //     x: 0.2,
    //     y: -0.6,
    //   },
    // },
    // {
    //   bottomLeft: {
    //     x: -1.8667391911660034,
    //     y: -0.0056043732637976965,
    //   },
    //   topRight: {
    //     x: -1.8557129943785577,
    //     y: 0.005421823523647911,
    //   },
    //   fractalIndex: 1,
    //   params: {
    //     x: 0.2,
    //     y: -0.6,
    //   },
    // },
  ];

  // src/sound.ts
  var ac = new AudioContext();
  var soundCache = /* @__PURE__ */ new Map();
  async function fetchAudio(url) {
    let audio = soundCache.get(url);
    if (!audio) {
      const file = await fetch(url);
      const buf = await file.arrayBuffer();
      audio = await ac.decodeAudioData(buf);
      soundCache.set(url, audio);
    }
    return audio;
  }
  async function createSoundWithPitchAndGain(audio, pitch, gain) {
    const track = new AudioBufferSourceNode(ac, {
      buffer: audio,
      playbackRate: pitch
    });
    const gainNode = new GainNode(ac, {
      gain: gain ?? 1
    });
    track.connect(gainNode);
    gainNode.connect(ac.destination);
    return track;
  }
  async function playSound(url, pitch, gain) {
    const track = await createSoundWithPitchAndGain(
      await fetchAudio(url),
      pitch,
      gain
    );
    track.start();
    return track;
  }
  async function loopSound(url, pitch, gain) {
    const audio = await fetchAudio(url);
    const track = await createSoundWithPitchAndGain(audio, pitch, gain);
    track.loop = true;
    track.start();
    return track;
  }

  // src/level-generator.ts
  function mandelbrot(cx, cy, iters) {
    let zx = 0;
    let zy = 0;
    for (let i = 0; i < iters; i++) {
      if (zx * zx + zy * zy >= 4) return i;
      let zxTemp = zx;
      zx = zx * zx - zy * zy + cx;
      zy = 2 * zxTemp * zy + cy;
    }
    return iters;
  }
  function findPointOnEdgeOfMandelbrot(random) {
    while (true) {
      const x = random() * 4 - 2;
      const y = random() * 4 - 2;
      const v = mandelbrot(x, y, 64);
      if (v > 32 && v < 64) {
        return { x, y };
      }
    }
  }

  // src/index.ts
  var import_seedrandom = __toESM(require_seedrandom2());
  var canvas = document.getElementById(
    "canvas"
  );
  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    gl.viewport(0, 0, canvas.width, canvas.height);
  }
  var params = new URLSearchParams(window.location.search);
  function setParam(param, value) {
    const paramsTemp = new URLSearchParams(window.location.search);
    if (value) paramsTemp.set(param, value);
    else paramsTemp.delete(param);
    const url = window.location.origin + window.location.pathname + "?" + paramsTemp.toString();
    window.history.pushState(
      {
        path: url
      },
      "",
      url
    );
  }
  var seedInput = document.getElementById("seed");
  seedInput.value = params.get("seed") ?? "";
  seedInput.addEventListener("input", (e) => {
    setParam("seed", seedInput.value);
  });
  var difficultyInput = document.getElementById(
    "difficulty"
  );
  difficultyInput.value = params.get("difficulty") ?? "2";
  difficultyInput.addEventListener("change", (e) => {
    setParam("difficulty", difficultyInput.value);
  });
  window.addEventListener("resize", resize);
  var gl = canvas.getContext("webgl2");
  resize();
  async function setupGL() {
    gl.viewport(0, 0, canvas.width, canvas.height);
    const vertexSource = await (await fetch("./fractal.vert")).text();
    const fragmentSource = await (await fetch("./fractal.frag")).text();
    const prog = createProgramFromShaderSources(gl, vertexSource, fragmentSource);
    if (!prog) {
      return;
    }
    const set = makeUniformSetter(gl, prog);
    const vao = gl.createVertexArray();
    gl.bindVertexArray(vao);
    const fullscreenQuadBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, fullscreenQuadBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, FULLSCREEN_QUAD, gl.STATIC_DRAW);
    gl.useProgram(prog);
    const vertexPositionLocation = gl.getAttribLocation(prog, "vertex_position");
    gl.enableVertexAttribArray(vertexPositionLocation);
    gl.vertexAttribPointer(vertexPositionLocation, 2, gl.FLOAT, false, 8, 0);
    return set;
  }
  var mousePos = { x: 0, y: 0 };
  var mouseButtonsPressed = /* @__PURE__ */ new Map();
  canvas.addEventListener("mousemove", (e) => {
    mousePos = { x: e.clientX, y: e.clientY };
  });
  var isMusicPlayingYet = false;
  canvas.addEventListener("mousedown", (e) => {
    if (!isMusicPlayingYet) {
      isMusicPlayingYet = true;
      loopSound("background-music.ogg", 0.5, 0.04);
    }
    mouseButtonsPressed.set(e.button, true);
  });
  canvas.addEventListener("mouseup", (e) => {
    for (const btn of mouseButtonsPressed.keys())
      mouseButtonsPressed.set(btn, false);
  });
  var fine = false;
  canvas.addEventListener("keydown", (e) => {
    if (e.key.toLowerCase() === "f") fine = true;
  });
  canvas.addEventListener("keyup", (e) => {
    if (e.key.toLowerCase() === "f") fine = false;
  });
  canvas.addEventListener("contextmenu", (e) => {
    e.preventDefault();
    return false;
  });
  var touches = /* @__PURE__ */ new Map();
  canvas.addEventListener("touchstart", (e) => {
    for (const t of e.touches) {
      touches.set(t.identifier, { x: t.clientX, y: t.clientY, dx: 0, dy: 0 });
    }
  });
  canvas.addEventListener("touchmove", (e) => {
    for (const t of e.touches) {
      const oldTouch = touches.get(t.identifier);
      if (oldTouch) {
        touches.set(t.identifier, {
          x: t.clientX,
          y: t.clientY,
          dx: t.clientX - oldTouch.x + oldTouch.dx,
          dy: t.clientY - oldTouch.y + oldTouch.dy
        });
      } else {
        touches.set(t.identifier, { x: t.clientX, y: t.clientY, dx: 0, dy: 0 });
      }
    }
  });
  canvas.addEventListener("touchend", (e) => {
    for (const t of e.changedTouches) {
      touches.delete(t.identifier);
    }
  });
  canvas.addEventListener("touchcancel", (e) => {
    for (const t of touches.keys()) {
      touches.delete(t);
    }
  });
  var lastScrollPositive = 2 /* None */;
  var scrollUntilNoise = 0;
  canvas.addEventListener("wheel", (e) => {
    lastScrollPositive = e.deltaY > 0 ? 1 /* Positive */ : 0 /* Negative */;
  });
  var userBottomLeft = { x: -2, y: -2 };
  var userTopRight = { x: 2, y: 2 };
  var userParams = { x: 0.2, y: -0.6 };
  var userTargetParams = { x: 0.2, y: -0.6 };
  var scrollVel = 0;
  var fractalIndex = 1;
  var levelIndex = 0;
  var targetBottomLeft = { x: 0, y: 0 };
  var targetTopRight = { x: 0, y: 0 };
  var targetParams = { x: 0, y: 0 };
  var winAnimationFrame = 0;
  var winAnimationRunning = false;
  function lerp(a, b, x) {
    return b * x + a * (1 - x);
  }
  function smoothstep(x) {
    return 3 * x * x - 2 * x * x * x;
  }
  function smoothlerp(a, b, x) {
    return lerp(a, b, smoothstep(x));
  }
  function printParams() {
    console.log(Math.round(1 / (userTopRight.x - userBottomLeft.x)));
    console.log({
      bottomLeft: { ...userBottomLeft },
      topRight: { ...userTopRight },
      fractalIndex,
      params: { ...userTargetParams }
    });
  }
  function loadLevel(level) {
    targetBottomLeft = { ...level.bottomLeft };
    targetTopRight = { ...level.topRight };
    targetParams = { ...level.params };
  }
  loadLevel(LEVELS[0]);
  window.printParams = printParams;
  window.printZoomLevels = () => {
    return LEVELS.map((l) => Math.round(1 / (l.topRight.x - l.bottomLeft.x)));
  };
  window.loadLevelIndex = (index) => {
    loadLevel(LEVELS[index]);
    levelIndex = index;
  };
  function draw(w, h, set) {
    set("2f", "target_params", targetParams.x, targetParams.y);
    set("2f", "target_bottom_left", targetBottomLeft.x, targetBottomLeft.y);
    set("2f", "target_top_right", targetTopRight.x, targetTopRight.y);
    set("2f", "user_params", userParams.x, userParams.y);
    set("2f", "user_bottom_left", userBottomLeft.x, userBottomLeft.y);
    set("2f", "user_top_right", userTopRight.x, userTopRight.y);
    set("1i", "fractal", fractalIndex);
    set(
      "1f",
      "iterations",
      Math.max(
        1,
        Math.ceil(
          smoothlerp(
            0,
            64,
            Math.abs(Math.max(0, Math.abs((winAnimationFrame - 120) / 60) - 1))
          )
        )
      )
    );
    set("2f", "resolution", w, h);
    set("1f", "hue_offset", hueOffset);
    set("1f", "threshold", 4);
    set("1f", "animation_frame", animationTime);
    gl.drawArrays(gl.TRIANGLES, 0, 6);
  }
  var matchFound = document.getElementById("match-found");
  var levelsComplete = document.getElementById("levels-complete");
  var info = document.getElementById("info");
  var debugBox = document.getElementById("debug");
  var playAgainButton = document.getElementById("play-again");
  playAgainButton.addEventListener("click", (e) => {
    console.log("clicked!!!!!!!");
    window.location.reload();
  });
  var startButton = document.getElementById("start");
  startButton.addEventListener("click", (e) => {
    LEVELS.splice(0, LEVELS.length);
    info.style.display = "none";
    const seed = seedInput.value || Math.floor(Math.random() * 2 ** 52).toString();
    setParam("seed", seed);
    const rand = (0, import_seedrandom.default)(seed);
    let difficulty = Number(difficultyInput.value);
    if (isNaN(difficulty)) difficulty = 2;
    difficulty = Math.min(Math.max(difficulty, 1), 200);
    for (let i = 0; i < difficulty * 5; i++) {
      const pt = findPointOnEdgeOfMandelbrot(rand);
      const zoom = 1 / (2 + Math.pow(i, 1.5) * (1.5 + rand()));
      LEVELS.push({
        bottomLeft: { x: pt.x - zoom, y: pt.y - zoom },
        topRight: { x: pt.x + zoom, y: pt.y + zoom },
        params: { x: 0, y: 0 },
        fractalIndex: 1
      });
    }
    loadLevel(LEVELS[0]);
  });
  var hueOffset = -0.1;
  var animationTime = 0;
  (async () => {
    const set = await setupGL();
    let stopLooping = false;
    window.printAllLevels = () => {
      stopLooping = true;
      const gridSize = Math.ceil(Math.sqrt(LEVELS.length));
      for (let i = 0; i < LEVELS.length; i++) {
        const lvl = LEVELS[i];
        const gridX = i % gridSize;
        const gridY = gridSize - Math.floor(i / gridSize) - 1;
        const gridYFlipped = Math.floor(i / gridSize);
        const gridWidth = Math.floor(window.innerWidth / gridSize);
        const gridHeight = Math.floor(window.innerHeight / gridSize);
        gl.viewport(gridX * gridWidth, gridY * gridHeight, gridWidth, gridHeight);
        loadLevel(lvl);
        userBottomLeft = { x: 100, y: 100 };
        userTopRight = { x: 100, y: 100 };
        draw(gridWidth, gridHeight, set);
        const label = document.createElement("div");
        label.innerHTML = `zoom: ${Math.round(
          1 / (targetTopRight.x - targetBottomLeft.x)
        )}`;
        label.style.position = "absolute";
        label.style.color = "white";
        label.style.padding = "10px";
        label.style.backgroundColor = "black";
        label.style.fontFamily = "sans-serif";
        label.style.top = `${(gridYFlipped + 0.1) * gridHeight}px`;
        label.style.left = `${(gridX + 0.1) * gridWidth}px`;
        document.body.appendChild(label);
      }
    };
    let prevMousePos = { x: 0, y: 0 };
    function loop() {
      animationTime++;
      hueOffset = hueOffset + 1e-4;
      if (stopLooping) return;
      const winDist = (userTopRight.x - userBottomLeft.x) / 12;
      if (Math.hypot(
        targetTopRight.x - userTopRight.x,
        targetTopRight.y - userTopRight.y
      ) < winDist && Math.hypot(
        targetBottomLeft.x - userBottomLeft.x,
        targetTopRight.y - userTopRight.y
      ) < winDist && !winAnimationRunning) {
        winAnimationRunning = true;
        playSound("level-complete.flac", 1);
        levelsComplete.innerText = `${levelIndex + 1} / ${LEVELS.length}` + (levelIndex == LEVELS.length - 1 ? " | YOU WIN!" : "");
        if (levelIndex == LEVELS.length - 1) {
          playAgainButton.style.display = "block";
        }
      }
      if (winAnimationRunning) {
        winAnimationFrame++;
      }
      if (winAnimationFrame > 0 && winAnimationFrame < 120) {
        userBottomLeft = {
          x: lerp(userBottomLeft.x, targetBottomLeft.x, 0.1),
          y: lerp(userBottomLeft.y, targetBottomLeft.y, 0.1)
        };
        userTopRight = {
          x: lerp(userTopRight.x, targetTopRight.x, 0.1),
          y: lerp(userTopRight.y, targetTopRight.y, 0.1)
        };
      }
      matchFound.style.opacity = smoothstep(
        1 - Math.min(Math.max(Math.abs(winAnimationFrame - 120) / 60 - 1, 0), 1)
      ).toString();
      if (winAnimationFrame == 120) {
        levelIndex++;
        if (LEVELS[levelIndex]) {
          loadLevel(LEVELS[levelIndex]);
        } else {
          winAnimationRunning = false;
        }
        userBottomLeft = { x: -2, y: -2 };
        userTopRight = { x: 2, y: 2 };
        userParams = { x: 0.2, y: -0.6 };
        userTargetParams = { x: 0.2, y: -0.6 };
      }
      if (winAnimationFrame >= 240) {
        winAnimationRunning = false;
        winAnimationFrame = 0;
      }
      const touchValues = [...touches.values()];
      if (touchValues.length === 1) {
        let deltaX = -(touchValues[0].dx / window.innerHeight) * (userTopRight.y - userBottomLeft.y);
        let deltaY = touchValues[0].dy / window.innerHeight * (userTopRight.y - userBottomLeft.y);
        userBottomLeft.x += deltaX;
        userBottomLeft.y += deltaY;
        userTopRight.x += deltaX;
        userTopRight.y += deltaY;
        touchValues[0].dx = 0;
        touchValues[0].dy = 0;
      } else if (touchValues.length === 2) {
        let deltaX = -((touchValues[0].dx + touchValues[1].dx) / 2 / window.innerHeight) * (userTopRight.y - userBottomLeft.y);
        let deltaY = (touchValues[0].dy + touchValues[1].dy) / 2 / window.innerHeight * (userTopRight.y - userBottomLeft.y);
        userBottomLeft.x += deltaX;
        userBottomLeft.y += deltaY;
        userTopRight.x += deltaX;
        userTopRight.y += deltaY;
        let zoomAmount = Math.hypot(
          touchValues[0].x - touchValues[1].x,
          touchValues[0].y - touchValues[1].y
        ) / Math.hypot(
          touchValues[0].x - touchValues[0].dx - touchValues[1].x + touchValues[1].dx,
          touchValues[0].y - touchValues[0].dy - touchValues[1].y + touchValues[1].dy
        ) - 1;
        zoomAmount = Math.min(Math.max(zoomAmount, -0.1), 0.1);
        let originX2 = lerp(userBottomLeft.x, userTopRight.x, 0.5);
        let originY2 = lerp(userBottomLeft.y, userTopRight.y, 0.5);
        userBottomLeft.x = lerp(userBottomLeft.x, originX2, zoomAmount);
        userBottomLeft.y = lerp(userBottomLeft.y, originY2, zoomAmount);
        userTopRight.x = lerp(userTopRight.x, originX2, zoomAmount);
        userTopRight.y = lerp(userTopRight.y, originY2, zoomAmount);
        debugBox.innerText = `zoom: ${zoomAmount}, touchvalues: ${JSON.stringify(
          touchValues
        )}`;
        touchValues[0].dx = 0;
        touchValues[0].dy = 0;
        touchValues[1].dx = 0;
        touchValues[1].dy = 0;
      }
      if (mouseButtonsPressed.get(0)) {
        let deltaX = (prevMousePos.x - mousePos.x) / window.innerHeight * (userTopRight.y - userBottomLeft.y);
        let deltaY = (mousePos.y - prevMousePos.y) / window.innerHeight * (userTopRight.y - userBottomLeft.y);
        userBottomLeft.x += deltaX;
        userBottomLeft.y += deltaY;
        userTopRight.x += deltaX;
        userTopRight.y += deltaY;
      }
      if (mouseButtonsPressed.get(2)) {
        userTargetParams.x = mousePos.x / window.innerWidth * 2 - 1;
        userTargetParams.y = mousePos.y / window.innerHeight * 2 - 1;
      }
      userParams = {
        x: lerp(userParams.x, userTargetParams.x, 0.3),
        y: lerp(userParams.y, userTargetParams.y, 0.3)
      };
      if (lastScrollPositive === 1 /* Positive */) {
        scrollVel += fine ? 5e-3 : 0.03;
      } else if (lastScrollPositive === 0 /* Negative */) {
        scrollVel -= fine ? 5e-3 : 0.03;
      }
      scrollVel *= 0.75;
      lastScrollPositive = 2 /* None */;
      let factor = scrollVel;
      if (userTopRight.x - userBottomLeft.x > 10) {
        factor = Math.max(factor, 0);
      }
      if (userTopRight.x - userBottomLeft.x < 1e-7) {
        factor = Math.min(factor, 0);
      }
      if (scrollUntilNoise < 0) {
        scrollUntilNoise = 1;
        playSound(
          "scroll-noise.flac",
          0.8 + 0.06 * Math.log2(1 / (userTopRight.x - userBottomLeft.x)),
          0.7
        );
      }
      scrollUntilNoise -= Math.abs(factor) * 3;
      let originX = lerp(userBottomLeft.x, userTopRight.x, 0.5);
      let originY = lerp(userBottomLeft.y, userTopRight.y, 0.5);
      userBottomLeft.x = lerp(userBottomLeft.x, originX, factor);
      userBottomLeft.y = lerp(userBottomLeft.y, originY, factor);
      userTopRight.x = lerp(userTopRight.x, originX, factor);
      userTopRight.y = lerp(userTopRight.y, originY, factor);
      prevMousePos = mousePos;
      draw(window.innerWidth, window.innerHeight, set);
      requestAnimationFrame(loop);
    }
    loop();
  })();
})();
//# sourceMappingURL=index.js.map
