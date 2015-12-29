(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.ICO = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";var PNG=require("./png"),ico=require("../ico"),ICO=ico({PNG:PNG});module.exports=ICO;
},{"../ico":4,"./png":2}],2:[function(require,module,exports){
(function (global){
"use strict";var dataURLToArrayBuffer=function(t){for(var e=global.atob(t.replace(/.+,/,"")),a=new Uint8Array(e.length),r=0;r<e.length;r++)a[r]=e.charCodeAt(r);return a.buffer},PNG={encode:function(t){return new Promise(function(e){var a=t.data,r=global.document.createElement("canvas");r.width=t.width,r.height=t.height;for(var n=r.getContext("2d"),o=n.createImageData(t.width,t.height),h=o.data,d=0;d<h.length;d++)h[d]=a[d];n.putImageData(o,0,0),e(dataURLToArrayBuffer(r.toDataURL()))})}};module.exports=PNG;
}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{}],3:[function(require,module,exports){
"use strict";var bitArray=require("./utils/bit-array"),toDividableBy4=require("./utils/to-dividable-by-4"),extractOne=function(t,i){for(var e=new DataView(t),r=e.getUint8(6+16*i)||256,o=e.getUint8(7+16*i)||256,n=e.getUint32(18+16*i,!0),a=e.getUint16(n+14,!0),l=e.getUint32(18+16*i,!0)+e.getUint32(n,!0),s=e.getUint32(n+32,!0),c=l+4*s,u=c+toDividableBy4(r*a/8)*o,b={width:r,height:o,colorCount:e.getUint8(8+16*i),bit:a,colors:[],xor:t.slice(c,u),and:t.slice(u,u+toDividableBy4(r/8)*o)},g=0;s>g;g++)b.colors.push(bitArray.of8(t.slice(l+4*g,l+4*g+4)));return b};module.exports=extractOne;
},{"./utils/bit-array":6,"./utils/to-dividable-by-4":7}],4:[function(require,module,exports){
(function (global){
"use strict";var extractOne=require("./extract-one"),imageData=require("./image-data"),range=function(t){return new Array(t).fill(0).map(function(t,e){return e})},factory=function(t){var e=global.ICO,r={parse:function(e){var r=new DataView(e);if(0!==r.getUint16(0,!0)||1!==r.getUint16(2,!0))return Promise.reject(new Error("buffer is not ico"));var a=Promise.all(range(r.getUint16(4,!0)).map(function(r){var a=void 0,i=extractOne(e,r);switch(i.bit){case 1:a=imageData.from1bit(i);break;case 4:a=imageData.from4bit(i);break;case 8:a=imageData.from8bit(i);break;case 24:a=imageData.from24bit(i);break;case 32:a=imageData.from32bit(i)}return t.PNG.encode({width:i.width,height:i.height,data:a}).then(function(t){return{bit:i.bit,width:i.width,height:i.height,buffer:t}})}));return a},isICO:function(t){if(!(t instanceof ArrayBuffer))return!1;var e=new DataView(t);return 0===e.getUint16(0,!0)&&1===e.getUint16(2,!0)},noConflict:function(){return global.ICO=e,this}};return r};module.exports=factory;
}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"./extract-one":3,"./image-data":5}],5:[function(require,module,exports){
"use strict";var bitArray=require("./utils/bit-array"),toDividableBy4=require("./utils/to-dividable-by-4"),imageData={from1bit:function(i){for(var t=void 0,r=bitArray.of1(i.xor),a=bitArray.of1(i.and),o=8*toDividableBy4(i.width*i.bit/8)/i.bit,e=8*toDividableBy4(i.width/8),d=0,h=new Uint8ClampedArray(i.width*i.height*4),b=i.height-1;b>=0;b--)for(var n=0;n<i.width;n++)t=i.colors[r[b*o+n]],h[d]=t[2],h[d+1]=t[1],h[d+2]=t[0],h[d+3]=a[b*e+n]?0:255,d+=4;return h},from4bit:function(i){for(var t=void 0,r=bitArray.of4(i.xor),a=bitArray.of1(i.and),o=8*toDividableBy4(i.width*i.bit/8)/i.bit,e=8*toDividableBy4(i.width/8),d=0,h=new Uint8ClampedArray(i.width*i.height*4),b=i.height-1;b>=0;b--)for(var n=0;n<i.width;n++)t=i.colors[r[b*o+n]],h[d]=t[2],h[d+1]=t[1],h[d+2]=t[0],h[d+3]=a[b*e+n]?0:255,d+=4;return h},from8bit:function(i){for(var t=void 0,r=new Uint8Array(i.xor),a=bitArray.of1(i.and),o=8*toDividableBy4(i.width*i.bit/8)/i.bit,e=8*toDividableBy4(i.width/8),d=0,h=new Uint8ClampedArray(i.width*i.height*4),b=i.height-1;b>=0;b--)for(var n=0;n<i.width;n++)t=i.colors[r[b*o+n]],h[d]=t[2],h[d+1]=t[1],h[d+2]=t[0],h[d+3]=a[b*e+n]?0:255,d+=4;return h},from24bit:function(i){for(var t=new Uint8Array(i.xor),r=bitArray.of1(i.and),a=8*toDividableBy4(i.width*i.bit/8)/i.bit,o=8*toDividableBy4(i.width/8),e=0,d=new Uint8ClampedArray(i.width*i.height*4),h=i.height-1;h>=0;h--)for(var b=0;b<i.width;b++)d[e]=t[3*(h*a+b)+2],d[e+1]=t[3*(h*a+b)+1],d[e+2]=t[3*(h*a+b)],d[e+3]=r[h*o+b]?0:255,e+=4;return d},from32bit:function(i){for(var t=new Uint8Array(i.xor),r=bitArray.of1(i.and),a=8*toDividableBy4(i.width*i.bit/8)/i.bit,o=8*toDividableBy4(i.width/8),e=0,d=new Uint8ClampedArray(i.width*i.height*4),h=i.height-1;h>=0;h--)for(var b=0;b<i.width;b++)d[e]=t[4*(h*a+b)+2],d[e+1]=t[4*(h*a+b)+1],d[e+2]=t[4*(h*a+b)],d[e+3]=1===r[h*o+b]||1===t[4*(h*a+b)+3]?0:t[4*(h*a+b)+3]>1?t[4*(h*a+b)+3]:255,e+=4;return d}};module.exports=imageData;
},{"./utils/bit-array":6,"./utils/to-dividable-by-4":7}],6:[function(require,module,exports){
"use strict";var bitArray={of1:function(r){for(var t=new Uint8Array(r),n="",e=0;e<t.byteLength;e++)n+=("000000000"+t[e].toString(2)).slice(-8);return n.split("").map(function(r){return parseInt(r,2)})},of4:function(r){for(var t=new Uint8Array(r),n="",e=0;e<t.byteLength;e++)n+=("00"+t[e].toString(16)).slice(-2);return n.split("").map(function(r){return parseInt(r,16)})},of8:function(r){for(var t=new Uint8Array(r),n=[],e=0;e<t.byteLength;e++)n.push(t[e]);return n}};module.exports=bitArray;
},{}],7:[function(require,module,exports){
"use strict";var toDividableBy4=function(t){return t%4!==0&&(t+=4-t%4),t};module.exports=toDividableBy4;
},{}]},{},[1])(1)
});


//# sourceMappingURL=ico.js.map