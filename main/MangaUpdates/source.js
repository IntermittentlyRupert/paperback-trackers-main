(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.Sources = f()}})(function(){var define,module,exports;return (function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
(function (global){(function (){
'use strict';

var possibleNames = [
	'BigInt64Array',
	'BigUint64Array',
	'Float32Array',
	'Float64Array',
	'Int16Array',
	'Int32Array',
	'Int8Array',
	'Uint16Array',
	'Uint32Array',
	'Uint8Array',
	'Uint8ClampedArray'
];

module.exports = function availableTypedArrays() {
	var out = [];
	for (var i = 0; i < possibleNames.length; i++) {
		if (typeof global[possibleNames[i]] === 'function') {
			out[out.length] = possibleNames[i];
		}
	}
	return out;
};

}).call(this)}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}],2:[function(require,module,exports){
'use strict';

var GetIntrinsic = require('get-intrinsic');

var callBind = require('./');

var $indexOf = callBind(GetIntrinsic('String.prototype.indexOf'));

module.exports = function callBoundIntrinsic(name, allowMissing) {
	var intrinsic = GetIntrinsic(name, !!allowMissing);
	if (typeof intrinsic === 'function' && $indexOf(name, '.prototype.') > -1) {
		return callBind(intrinsic);
	}
	return intrinsic;
};

},{"./":3,"get-intrinsic":8}],3:[function(require,module,exports){
'use strict';

var bind = require('function-bind');
var GetIntrinsic = require('get-intrinsic');

var $apply = GetIntrinsic('%Function.prototype.apply%');
var $call = GetIntrinsic('%Function.prototype.call%');
var $reflectApply = GetIntrinsic('%Reflect.apply%', true) || bind.call($call, $apply);

var $gOPD = GetIntrinsic('%Object.getOwnPropertyDescriptor%', true);
var $defineProperty = GetIntrinsic('%Object.defineProperty%', true);
var $max = GetIntrinsic('%Math.max%');

if ($defineProperty) {
	try {
		$defineProperty({}, 'a', { value: 1 });
	} catch (e) {
		// IE 8 has a broken defineProperty
		$defineProperty = null;
	}
}

module.exports = function callBind(originalFunction) {
	var func = $reflectApply(bind, $call, arguments);
	if ($gOPD && $defineProperty) {
		var desc = $gOPD(func, 'length');
		if (desc.configurable) {
			// original length, plus the receiver, minus any additional arguments (after the receiver)
			$defineProperty(
				func,
				'length',
				{ value: 1 + $max(0, originalFunction.length - (arguments.length - 1)) }
			);
		}
	}
	return func;
};

var applyBind = function applyBind() {
	return $reflectApply(bind, $apply, arguments);
};

if ($defineProperty) {
	$defineProperty(module.exports, 'apply', { value: applyBind });
} else {
	module.exports.apply = applyBind;
}

},{"function-bind":7,"get-intrinsic":8}],4:[function(require,module,exports){
'use strict';

var GetIntrinsic = require('get-intrinsic');

var $gOPD = GetIntrinsic('%Object.getOwnPropertyDescriptor%');
if ($gOPD) {
	try {
		$gOPD([], 'length');
	} catch (e) {
		// IE 8 has a broken gOPD
		$gOPD = null;
	}
}

module.exports = $gOPD;

},{"get-intrinsic":8}],5:[function(require,module,exports){

var hasOwn = Object.prototype.hasOwnProperty;
var toString = Object.prototype.toString;

module.exports = function forEach (obj, fn, ctx) {
    if (toString.call(fn) !== '[object Function]') {
        throw new TypeError('iterator must be a function');
    }
    var l = obj.length;
    if (l === +l) {
        for (var i = 0; i < l; i++) {
            fn.call(ctx, obj[i], i, obj);
        }
    } else {
        for (var k in obj) {
            if (hasOwn.call(obj, k)) {
                fn.call(ctx, obj[k], k, obj);
            }
        }
    }
};


},{}],6:[function(require,module,exports){
'use strict';

/* eslint no-invalid-this: 1 */

var ERROR_MESSAGE = 'Function.prototype.bind called on incompatible ';
var slice = Array.prototype.slice;
var toStr = Object.prototype.toString;
var funcType = '[object Function]';

module.exports = function bind(that) {
    var target = this;
    if (typeof target !== 'function' || toStr.call(target) !== funcType) {
        throw new TypeError(ERROR_MESSAGE + target);
    }
    var args = slice.call(arguments, 1);

    var bound;
    var binder = function () {
        if (this instanceof bound) {
            var result = target.apply(
                this,
                args.concat(slice.call(arguments))
            );
            if (Object(result) === result) {
                return result;
            }
            return this;
        } else {
            return target.apply(
                that,
                args.concat(slice.call(arguments))
            );
        }
    };

    var boundLength = Math.max(0, target.length - args.length);
    var boundArgs = [];
    for (var i = 0; i < boundLength; i++) {
        boundArgs.push('$' + i);
    }

    bound = Function('binder', 'return function (' + boundArgs.join(',') + '){ return binder.apply(this,arguments); }')(binder);

    if (target.prototype) {
        var Empty = function Empty() {};
        Empty.prototype = target.prototype;
        bound.prototype = new Empty();
        Empty.prototype = null;
    }

    return bound;
};

},{}],7:[function(require,module,exports){
'use strict';

var implementation = require('./implementation');

module.exports = Function.prototype.bind || implementation;

},{"./implementation":6}],8:[function(require,module,exports){
'use strict';

var undefined;

var $SyntaxError = SyntaxError;
var $Function = Function;
var $TypeError = TypeError;

// eslint-disable-next-line consistent-return
var getEvalledConstructor = function (expressionSyntax) {
	try {
		return $Function('"use strict"; return (' + expressionSyntax + ').constructor;')();
	} catch (e) {}
};

var $gOPD = Object.getOwnPropertyDescriptor;
if ($gOPD) {
	try {
		$gOPD({}, '');
	} catch (e) {
		$gOPD = null; // this is IE 8, which has a broken gOPD
	}
}

var throwTypeError = function () {
	throw new $TypeError();
};
var ThrowTypeError = $gOPD
	? (function () {
		try {
			// eslint-disable-next-line no-unused-expressions, no-caller, no-restricted-properties
			arguments.callee; // IE 8 does not throw here
			return throwTypeError;
		} catch (calleeThrows) {
			try {
				// IE 8 throws on Object.getOwnPropertyDescriptor(arguments, '')
				return $gOPD(arguments, 'callee').get;
			} catch (gOPDthrows) {
				return throwTypeError;
			}
		}
	}())
	: throwTypeError;

var hasSymbols = require('has-symbols')();

var getProto = Object.getPrototypeOf || function (x) { return x.__proto__; }; // eslint-disable-line no-proto

var needsEval = {};

var TypedArray = typeof Uint8Array === 'undefined' ? undefined : getProto(Uint8Array);

var INTRINSICS = {
	'%AggregateError%': typeof AggregateError === 'undefined' ? undefined : AggregateError,
	'%Array%': Array,
	'%ArrayBuffer%': typeof ArrayBuffer === 'undefined' ? undefined : ArrayBuffer,
	'%ArrayIteratorPrototype%': hasSymbols ? getProto([][Symbol.iterator]()) : undefined,
	'%AsyncFromSyncIteratorPrototype%': undefined,
	'%AsyncFunction%': needsEval,
	'%AsyncGenerator%': needsEval,
	'%AsyncGeneratorFunction%': needsEval,
	'%AsyncIteratorPrototype%': needsEval,
	'%Atomics%': typeof Atomics === 'undefined' ? undefined : Atomics,
	'%BigInt%': typeof BigInt === 'undefined' ? undefined : BigInt,
	'%Boolean%': Boolean,
	'%DataView%': typeof DataView === 'undefined' ? undefined : DataView,
	'%Date%': Date,
	'%decodeURI%': decodeURI,
	'%decodeURIComponent%': decodeURIComponent,
	'%encodeURI%': encodeURI,
	'%encodeURIComponent%': encodeURIComponent,
	'%Error%': Error,
	'%eval%': eval, // eslint-disable-line no-eval
	'%EvalError%': EvalError,
	'%Float32Array%': typeof Float32Array === 'undefined' ? undefined : Float32Array,
	'%Float64Array%': typeof Float64Array === 'undefined' ? undefined : Float64Array,
	'%FinalizationRegistry%': typeof FinalizationRegistry === 'undefined' ? undefined : FinalizationRegistry,
	'%Function%': $Function,
	'%GeneratorFunction%': needsEval,
	'%Int8Array%': typeof Int8Array === 'undefined' ? undefined : Int8Array,
	'%Int16Array%': typeof Int16Array === 'undefined' ? undefined : Int16Array,
	'%Int32Array%': typeof Int32Array === 'undefined' ? undefined : Int32Array,
	'%isFinite%': isFinite,
	'%isNaN%': isNaN,
	'%IteratorPrototype%': hasSymbols ? getProto(getProto([][Symbol.iterator]())) : undefined,
	'%JSON%': typeof JSON === 'object' ? JSON : undefined,
	'%Map%': typeof Map === 'undefined' ? undefined : Map,
	'%MapIteratorPrototype%': typeof Map === 'undefined' || !hasSymbols ? undefined : getProto(new Map()[Symbol.iterator]()),
	'%Math%': Math,
	'%Number%': Number,
	'%Object%': Object,
	'%parseFloat%': parseFloat,
	'%parseInt%': parseInt,
	'%Promise%': typeof Promise === 'undefined' ? undefined : Promise,
	'%Proxy%': typeof Proxy === 'undefined' ? undefined : Proxy,
	'%RangeError%': RangeError,
	'%ReferenceError%': ReferenceError,
	'%Reflect%': typeof Reflect === 'undefined' ? undefined : Reflect,
	'%RegExp%': RegExp,
	'%Set%': typeof Set === 'undefined' ? undefined : Set,
	'%SetIteratorPrototype%': typeof Set === 'undefined' || !hasSymbols ? undefined : getProto(new Set()[Symbol.iterator]()),
	'%SharedArrayBuffer%': typeof SharedArrayBuffer === 'undefined' ? undefined : SharedArrayBuffer,
	'%String%': String,
	'%StringIteratorPrototype%': hasSymbols ? getProto(''[Symbol.iterator]()) : undefined,
	'%Symbol%': hasSymbols ? Symbol : undefined,
	'%SyntaxError%': $SyntaxError,
	'%ThrowTypeError%': ThrowTypeError,
	'%TypedArray%': TypedArray,
	'%TypeError%': $TypeError,
	'%Uint8Array%': typeof Uint8Array === 'undefined' ? undefined : Uint8Array,
	'%Uint8ClampedArray%': typeof Uint8ClampedArray === 'undefined' ? undefined : Uint8ClampedArray,
	'%Uint16Array%': typeof Uint16Array === 'undefined' ? undefined : Uint16Array,
	'%Uint32Array%': typeof Uint32Array === 'undefined' ? undefined : Uint32Array,
	'%URIError%': URIError,
	'%WeakMap%': typeof WeakMap === 'undefined' ? undefined : WeakMap,
	'%WeakRef%': typeof WeakRef === 'undefined' ? undefined : WeakRef,
	'%WeakSet%': typeof WeakSet === 'undefined' ? undefined : WeakSet
};

var doEval = function doEval(name) {
	var value;
	if (name === '%AsyncFunction%') {
		value = getEvalledConstructor('async function () {}');
	} else if (name === '%GeneratorFunction%') {
		value = getEvalledConstructor('function* () {}');
	} else if (name === '%AsyncGeneratorFunction%') {
		value = getEvalledConstructor('async function* () {}');
	} else if (name === '%AsyncGenerator%') {
		var fn = doEval('%AsyncGeneratorFunction%');
		if (fn) {
			value = fn.prototype;
		}
	} else if (name === '%AsyncIteratorPrototype%') {
		var gen = doEval('%AsyncGenerator%');
		if (gen) {
			value = getProto(gen.prototype);
		}
	}

	INTRINSICS[name] = value;

	return value;
};

var LEGACY_ALIASES = {
	'%ArrayBufferPrototype%': ['ArrayBuffer', 'prototype'],
	'%ArrayPrototype%': ['Array', 'prototype'],
	'%ArrayProto_entries%': ['Array', 'prototype', 'entries'],
	'%ArrayProto_forEach%': ['Array', 'prototype', 'forEach'],
	'%ArrayProto_keys%': ['Array', 'prototype', 'keys'],
	'%ArrayProto_values%': ['Array', 'prototype', 'values'],
	'%AsyncFunctionPrototype%': ['AsyncFunction', 'prototype'],
	'%AsyncGenerator%': ['AsyncGeneratorFunction', 'prototype'],
	'%AsyncGeneratorPrototype%': ['AsyncGeneratorFunction', 'prototype', 'prototype'],
	'%BooleanPrototype%': ['Boolean', 'prototype'],
	'%DataViewPrototype%': ['DataView', 'prototype'],
	'%DatePrototype%': ['Date', 'prototype'],
	'%ErrorPrototype%': ['Error', 'prototype'],
	'%EvalErrorPrototype%': ['EvalError', 'prototype'],
	'%Float32ArrayPrototype%': ['Float32Array', 'prototype'],
	'%Float64ArrayPrototype%': ['Float64Array', 'prototype'],
	'%FunctionPrototype%': ['Function', 'prototype'],
	'%Generator%': ['GeneratorFunction', 'prototype'],
	'%GeneratorPrototype%': ['GeneratorFunction', 'prototype', 'prototype'],
	'%Int8ArrayPrototype%': ['Int8Array', 'prototype'],
	'%Int16ArrayPrototype%': ['Int16Array', 'prototype'],
	'%Int32ArrayPrototype%': ['Int32Array', 'prototype'],
	'%JSONParse%': ['JSON', 'parse'],
	'%JSONStringify%': ['JSON', 'stringify'],
	'%MapPrototype%': ['Map', 'prototype'],
	'%NumberPrototype%': ['Number', 'prototype'],
	'%ObjectPrototype%': ['Object', 'prototype'],
	'%ObjProto_toString%': ['Object', 'prototype', 'toString'],
	'%ObjProto_valueOf%': ['Object', 'prototype', 'valueOf'],
	'%PromisePrototype%': ['Promise', 'prototype'],
	'%PromiseProto_then%': ['Promise', 'prototype', 'then'],
	'%Promise_all%': ['Promise', 'all'],
	'%Promise_reject%': ['Promise', 'reject'],
	'%Promise_resolve%': ['Promise', 'resolve'],
	'%RangeErrorPrototype%': ['RangeError', 'prototype'],
	'%ReferenceErrorPrototype%': ['ReferenceError', 'prototype'],
	'%RegExpPrototype%': ['RegExp', 'prototype'],
	'%SetPrototype%': ['Set', 'prototype'],
	'%SharedArrayBufferPrototype%': ['SharedArrayBuffer', 'prototype'],
	'%StringPrototype%': ['String', 'prototype'],
	'%SymbolPrototype%': ['Symbol', 'prototype'],
	'%SyntaxErrorPrototype%': ['SyntaxError', 'prototype'],
	'%TypedArrayPrototype%': ['TypedArray', 'prototype'],
	'%TypeErrorPrototype%': ['TypeError', 'prototype'],
	'%Uint8ArrayPrototype%': ['Uint8Array', 'prototype'],
	'%Uint8ClampedArrayPrototype%': ['Uint8ClampedArray', 'prototype'],
	'%Uint16ArrayPrototype%': ['Uint16Array', 'prototype'],
	'%Uint32ArrayPrototype%': ['Uint32Array', 'prototype'],
	'%URIErrorPrototype%': ['URIError', 'prototype'],
	'%WeakMapPrototype%': ['WeakMap', 'prototype'],
	'%WeakSetPrototype%': ['WeakSet', 'prototype']
};

var bind = require('function-bind');
var hasOwn = require('has');
var $concat = bind.call(Function.call, Array.prototype.concat);
var $spliceApply = bind.call(Function.apply, Array.prototype.splice);
var $replace = bind.call(Function.call, String.prototype.replace);
var $strSlice = bind.call(Function.call, String.prototype.slice);

/* adapted from https://github.com/lodash/lodash/blob/4.17.15/dist/lodash.js#L6735-L6744 */
var rePropName = /[^%.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\\]|\\.)*?)\2)\]|(?=(?:\.|\[\])(?:\.|\[\]|%$))/g;
var reEscapeChar = /\\(\\)?/g; /** Used to match backslashes in property paths. */
var stringToPath = function stringToPath(string) {
	var first = $strSlice(string, 0, 1);
	var last = $strSlice(string, -1);
	if (first === '%' && last !== '%') {
		throw new $SyntaxError('invalid intrinsic syntax, expected closing `%`');
	} else if (last === '%' && first !== '%') {
		throw new $SyntaxError('invalid intrinsic syntax, expected opening `%`');
	}
	var result = [];
	$replace(string, rePropName, function (match, number, quote, subString) {
		result[result.length] = quote ? $replace(subString, reEscapeChar, '$1') : number || match;
	});
	return result;
};
/* end adaptation */

var getBaseIntrinsic = function getBaseIntrinsic(name, allowMissing) {
	var intrinsicName = name;
	var alias;
	if (hasOwn(LEGACY_ALIASES, intrinsicName)) {
		alias = LEGACY_ALIASES[intrinsicName];
		intrinsicName = '%' + alias[0] + '%';
	}

	if (hasOwn(INTRINSICS, intrinsicName)) {
		var value = INTRINSICS[intrinsicName];
		if (value === needsEval) {
			value = doEval(intrinsicName);
		}
		if (typeof value === 'undefined' && !allowMissing) {
			throw new $TypeError('intrinsic ' + name + ' exists, but is not available. Please file an issue!');
		}

		return {
			alias: alias,
			name: intrinsicName,
			value: value
		};
	}

	throw new $SyntaxError('intrinsic ' + name + ' does not exist!');
};

module.exports = function GetIntrinsic(name, allowMissing) {
	if (typeof name !== 'string' || name.length === 0) {
		throw new $TypeError('intrinsic name must be a non-empty string');
	}
	if (arguments.length > 1 && typeof allowMissing !== 'boolean') {
		throw new $TypeError('"allowMissing" argument must be a boolean');
	}

	var parts = stringToPath(name);
	var intrinsicBaseName = parts.length > 0 ? parts[0] : '';

	var intrinsic = getBaseIntrinsic('%' + intrinsicBaseName + '%', allowMissing);
	var intrinsicRealName = intrinsic.name;
	var value = intrinsic.value;
	var skipFurtherCaching = false;

	var alias = intrinsic.alias;
	if (alias) {
		intrinsicBaseName = alias[0];
		$spliceApply(parts, $concat([0, 1], alias));
	}

	for (var i = 1, isOwn = true; i < parts.length; i += 1) {
		var part = parts[i];
		var first = $strSlice(part, 0, 1);
		var last = $strSlice(part, -1);
		if (
			(
				(first === '"' || first === "'" || first === '`')
				|| (last === '"' || last === "'" || last === '`')
			)
			&& first !== last
		) {
			throw new $SyntaxError('property names with quotes must have matching quotes');
		}
		if (part === 'constructor' || !isOwn) {
			skipFurtherCaching = true;
		}

		intrinsicBaseName += '.' + part;
		intrinsicRealName = '%' + intrinsicBaseName + '%';

		if (hasOwn(INTRINSICS, intrinsicRealName)) {
			value = INTRINSICS[intrinsicRealName];
		} else if (value != null) {
			if (!(part in value)) {
				if (!allowMissing) {
					throw new $TypeError('base intrinsic for ' + name + ' exists, but the property is not available.');
				}
				return void undefined;
			}
			if ($gOPD && (i + 1) >= parts.length) {
				var desc = $gOPD(value, part);
				isOwn = !!desc;

				// By convention, when a data property is converted to an accessor
				// property to emulate a data property that does not suffer from
				// the override mistake, that accessor's getter is marked with
				// an `originalValue` property. Here, when we detect this, we
				// uphold the illusion by pretending to see that original data
				// property, i.e., returning the value rather than the getter
				// itself.
				if (isOwn && 'get' in desc && !('originalValue' in desc.get)) {
					value = desc.get;
				} else {
					value = value[part];
				}
			} else {
				isOwn = hasOwn(value, part);
				value = value[part];
			}

			if (isOwn && !skipFurtherCaching) {
				INTRINSICS[intrinsicRealName] = value;
			}
		}
	}
	return value;
};

},{"function-bind":7,"has":12,"has-symbols":9}],9:[function(require,module,exports){
'use strict';

var origSymbol = typeof Symbol !== 'undefined' && Symbol;
var hasSymbolSham = require('./shams');

module.exports = function hasNativeSymbols() {
	if (typeof origSymbol !== 'function') { return false; }
	if (typeof Symbol !== 'function') { return false; }
	if (typeof origSymbol('foo') !== 'symbol') { return false; }
	if (typeof Symbol('bar') !== 'symbol') { return false; }

	return hasSymbolSham();
};

},{"./shams":10}],10:[function(require,module,exports){
'use strict';

/* eslint complexity: [2, 18], max-statements: [2, 33] */
module.exports = function hasSymbols() {
	if (typeof Symbol !== 'function' || typeof Object.getOwnPropertySymbols !== 'function') { return false; }
	if (typeof Symbol.iterator === 'symbol') { return true; }

	var obj = {};
	var sym = Symbol('test');
	var symObj = Object(sym);
	if (typeof sym === 'string') { return false; }

	if (Object.prototype.toString.call(sym) !== '[object Symbol]') { return false; }
	if (Object.prototype.toString.call(symObj) !== '[object Symbol]') { return false; }

	// temp disabled per https://github.com/ljharb/object.assign/issues/17
	// if (sym instanceof Symbol) { return false; }
	// temp disabled per https://github.com/WebReflection/get-own-property-symbols/issues/4
	// if (!(symObj instanceof Symbol)) { return false; }

	// if (typeof Symbol.prototype.toString !== 'function') { return false; }
	// if (String(sym) !== Symbol.prototype.toString.call(sym)) { return false; }

	var symVal = 42;
	obj[sym] = symVal;
	for (sym in obj) { return false; } // eslint-disable-line no-restricted-syntax, no-unreachable-loop
	if (typeof Object.keys === 'function' && Object.keys(obj).length !== 0) { return false; }

	if (typeof Object.getOwnPropertyNames === 'function' && Object.getOwnPropertyNames(obj).length !== 0) { return false; }

	var syms = Object.getOwnPropertySymbols(obj);
	if (syms.length !== 1 || syms[0] !== sym) { return false; }

	if (!Object.prototype.propertyIsEnumerable.call(obj, sym)) { return false; }

	if (typeof Object.getOwnPropertyDescriptor === 'function') {
		var descriptor = Object.getOwnPropertyDescriptor(obj, sym);
		if (descriptor.value !== symVal || descriptor.enumerable !== true) { return false; }
	}

	return true;
};

},{}],11:[function(require,module,exports){
'use strict';

var hasSymbols = require('has-symbols/shams');

module.exports = function hasToStringTagShams() {
	return hasSymbols() && !!Symbol.toStringTag;
};

},{"has-symbols/shams":10}],12:[function(require,module,exports){
'use strict';

var bind = require('function-bind');

module.exports = bind.call(Function.call, Object.prototype.hasOwnProperty);

},{"function-bind":7}],13:[function(require,module,exports){
if (typeof Object.create === 'function') {
  // implementation from standard node.js 'util' module
  module.exports = function inherits(ctor, superCtor) {
    if (superCtor) {
      ctor.super_ = superCtor
      ctor.prototype = Object.create(superCtor.prototype, {
        constructor: {
          value: ctor,
          enumerable: false,
          writable: true,
          configurable: true
        }
      })
    }
  };
} else {
  // old school shim for old browsers
  module.exports = function inherits(ctor, superCtor) {
    if (superCtor) {
      ctor.super_ = superCtor
      var TempCtor = function () {}
      TempCtor.prototype = superCtor.prototype
      ctor.prototype = new TempCtor()
      ctor.prototype.constructor = ctor
    }
  }
}

},{}],14:[function(require,module,exports){
'use strict';

var hasToStringTag = require('has-tostringtag/shams')();
var callBound = require('call-bind/callBound');

var $toString = callBound('Object.prototype.toString');

var isStandardArguments = function isArguments(value) {
	if (hasToStringTag && value && typeof value === 'object' && Symbol.toStringTag in value) {
		return false;
	}
	return $toString(value) === '[object Arguments]';
};

var isLegacyArguments = function isArguments(value) {
	if (isStandardArguments(value)) {
		return true;
	}
	return value !== null &&
		typeof value === 'object' &&
		typeof value.length === 'number' &&
		value.length >= 0 &&
		$toString(value) !== '[object Array]' &&
		$toString(value.callee) === '[object Function]';
};

var supportsStandardArguments = (function () {
	return isStandardArguments(arguments);
}());

isStandardArguments.isLegacyArguments = isLegacyArguments; // for tests

module.exports = supportsStandardArguments ? isStandardArguments : isLegacyArguments;

},{"call-bind/callBound":2,"has-tostringtag/shams":11}],15:[function(require,module,exports){
'use strict';

var toStr = Object.prototype.toString;
var fnToStr = Function.prototype.toString;
var isFnRegex = /^\s*(?:function)?\*/;
var hasToStringTag = require('has-tostringtag/shams')();
var getProto = Object.getPrototypeOf;
var getGeneratorFunc = function () { // eslint-disable-line consistent-return
	if (!hasToStringTag) {
		return false;
	}
	try {
		return Function('return function*() {}')();
	} catch (e) {
	}
};
var GeneratorFunction;

module.exports = function isGeneratorFunction(fn) {
	if (typeof fn !== 'function') {
		return false;
	}
	if (isFnRegex.test(fnToStr.call(fn))) {
		return true;
	}
	if (!hasToStringTag) {
		var str = toStr.call(fn);
		return str === '[object GeneratorFunction]';
	}
	if (!getProto) {
		return false;
	}
	if (typeof GeneratorFunction === 'undefined') {
		var generatorFunc = getGeneratorFunc();
		GeneratorFunction = generatorFunc ? getProto(generatorFunc) : false;
	}
	return getProto(fn) === GeneratorFunction;
};

},{"has-tostringtag/shams":11}],16:[function(require,module,exports){
(function (global){(function (){
'use strict';

var forEach = require('foreach');
var availableTypedArrays = require('available-typed-arrays');
var callBound = require('call-bind/callBound');

var $toString = callBound('Object.prototype.toString');
var hasToStringTag = require('has-tostringtag/shams')();

var typedArrays = availableTypedArrays();

var $indexOf = callBound('Array.prototype.indexOf', true) || function indexOf(array, value) {
	for (var i = 0; i < array.length; i += 1) {
		if (array[i] === value) {
			return i;
		}
	}
	return -1;
};
var $slice = callBound('String.prototype.slice');
var toStrTags = {};
var gOPD = require('es-abstract/helpers/getOwnPropertyDescriptor');
var getPrototypeOf = Object.getPrototypeOf; // require('getprototypeof');
if (hasToStringTag && gOPD && getPrototypeOf) {
	forEach(typedArrays, function (typedArray) {
		var arr = new global[typedArray]();
		if (!(Symbol.toStringTag in arr)) {
			throw new EvalError('this engine has support for Symbol.toStringTag, but ' + typedArray + ' does not have the property! Please report this.');
		}
		var proto = getPrototypeOf(arr);
		var descriptor = gOPD(proto, Symbol.toStringTag);
		if (!descriptor) {
			var superProto = getPrototypeOf(proto);
			descriptor = gOPD(superProto, Symbol.toStringTag);
		}
		toStrTags[typedArray] = descriptor.get;
	});
}

var tryTypedArrays = function tryAllTypedArrays(value) {
	var anyTrue = false;
	forEach(toStrTags, function (getter, typedArray) {
		if (!anyTrue) {
			try {
				anyTrue = getter.call(value) === typedArray;
			} catch (e) { /**/ }
		}
	});
	return anyTrue;
};

module.exports = function isTypedArray(value) {
	if (!value || typeof value !== 'object') { return false; }
	if (!hasToStringTag) {
		var tag = $slice($toString(value), 8, -1);
		return $indexOf(typedArrays, tag) > -1;
	}
	if (!gOPD) { return false; }
	return tryTypedArrays(value);
};

}).call(this)}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"available-typed-arrays":1,"call-bind/callBound":2,"es-abstract/helpers/getOwnPropertyDescriptor":4,"foreach":5,"has-tostringtag/shams":11}],17:[function(require,module,exports){
"use strict";
/**
 * Request objects hold information for a particular source (see sources for example)
 * This allows us to to use a generic api to make the calls against any source
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.urlEncodeObject = exports.convertTime = exports.Source = void 0;
class Source {
    constructor(cheerio) {
        this.cheerio = cheerio;
    }
    /**
     * @deprecated use {@link Source.getSearchResults getSearchResults} instead
     */
    searchRequest(query, metadata) {
        return this.getSearchResults(query, metadata);
    }
    /**
     * @deprecated use {@link Source.getSearchTags} instead
     */
    async getTags() {
        // @ts-ignore
        return this.getSearchTags?.();
    }
}
exports.Source = Source;
// Many sites use '[x] time ago' - Figured it would be good to handle these cases in general
function convertTime(timeAgo) {
    let time;
    let trimmed = Number((/\d*/.exec(timeAgo) ?? [])[0]);
    trimmed = (trimmed == 0 && timeAgo.includes('a')) ? 1 : trimmed;
    if (timeAgo.includes('minutes')) {
        time = new Date(Date.now() - trimmed * 60000);
    }
    else if (timeAgo.includes('hours')) {
        time = new Date(Date.now() - trimmed * 3600000);
    }
    else if (timeAgo.includes('days')) {
        time = new Date(Date.now() - trimmed * 86400000);
    }
    else if (timeAgo.includes('year') || timeAgo.includes('years')) {
        time = new Date(Date.now() - trimmed * 31556952000);
    }
    else {
        time = new Date(Date.now());
    }
    return time;
}
exports.convertTime = convertTime;
/**
 * When a function requires a POST body, it always should be defined as a JsonObject
 * and then passed through this function to ensure that it's encoded properly.
 * @param obj
 */
function urlEncodeObject(obj) {
    let ret = {};
    for (const entry of Object.entries(obj)) {
        ret[encodeURIComponent(entry[0])] = encodeURIComponent(entry[1]);
    }
    return ret;
}
exports.urlEncodeObject = urlEncodeObject;

},{}],18:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Tracker = void 0;
class Tracker {
    constructor(cheerio) {
        this.cheerio = cheerio;
    }
}
exports.Tracker = Tracker;

},{}],19:[function(require,module,exports){
"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
__exportStar(require("./Source"), exports);
__exportStar(require("./Tracker"), exports);

},{"./Source":17,"./Tracker":18}],20:[function(require,module,exports){
"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
__exportStar(require("./base"), exports);
__exportStar(require("./models"), exports);

},{"./base":19,"./models":63}],21:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });

},{}],22:[function(require,module,exports){
arguments[4][21][0].apply(exports,arguments)
},{"dup":21}],23:[function(require,module,exports){
arguments[4][21][0].apply(exports,arguments)
},{"dup":21}],24:[function(require,module,exports){
arguments[4][21][0].apply(exports,arguments)
},{"dup":21}],25:[function(require,module,exports){
arguments[4][21][0].apply(exports,arguments)
},{"dup":21}],26:[function(require,module,exports){
arguments[4][21][0].apply(exports,arguments)
},{"dup":21}],27:[function(require,module,exports){
arguments[4][21][0].apply(exports,arguments)
},{"dup":21}],28:[function(require,module,exports){
arguments[4][21][0].apply(exports,arguments)
},{"dup":21}],29:[function(require,module,exports){
arguments[4][21][0].apply(exports,arguments)
},{"dup":21}],30:[function(require,module,exports){
arguments[4][21][0].apply(exports,arguments)
},{"dup":21}],31:[function(require,module,exports){
arguments[4][21][0].apply(exports,arguments)
},{"dup":21}],32:[function(require,module,exports){
arguments[4][21][0].apply(exports,arguments)
},{"dup":21}],33:[function(require,module,exports){
arguments[4][21][0].apply(exports,arguments)
},{"dup":21}],34:[function(require,module,exports){
arguments[4][21][0].apply(exports,arguments)
},{"dup":21}],35:[function(require,module,exports){
arguments[4][21][0].apply(exports,arguments)
},{"dup":21}],36:[function(require,module,exports){
arguments[4][21][0].apply(exports,arguments)
},{"dup":21}],37:[function(require,module,exports){
arguments[4][21][0].apply(exports,arguments)
},{"dup":21}],38:[function(require,module,exports){
arguments[4][21][0].apply(exports,arguments)
},{"dup":21}],39:[function(require,module,exports){
"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
__exportStar(require("./Button"), exports);
__exportStar(require("./Form"), exports);
__exportStar(require("./Header"), exports);
__exportStar(require("./InputField"), exports);
__exportStar(require("./Label"), exports);
__exportStar(require("./Link"), exports);
__exportStar(require("./MultilineLabel"), exports);
__exportStar(require("./NavigationButton"), exports);
__exportStar(require("./OAuthButton"), exports);
__exportStar(require("./Section"), exports);
__exportStar(require("./Select"), exports);
__exportStar(require("./Switch"), exports);
__exportStar(require("./WebViewButton"), exports);
__exportStar(require("./FormRow"), exports);
__exportStar(require("./Stepper"), exports);

},{"./Button":24,"./Form":25,"./FormRow":26,"./Header":27,"./InputField":28,"./Label":29,"./Link":30,"./MultilineLabel":31,"./NavigationButton":32,"./OAuthButton":33,"./Section":34,"./Select":35,"./Stepper":36,"./Switch":37,"./WebViewButton":38}],40:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HomeSectionType = void 0;
var HomeSectionType;
(function (HomeSectionType) {
    HomeSectionType["singleRowNormal"] = "singleRowNormal";
    HomeSectionType["singleRowLarge"] = "singleRowLarge";
    HomeSectionType["doubleRow"] = "doubleRow";
    HomeSectionType["featured"] = "featured";
})(HomeSectionType = exports.HomeSectionType || (exports.HomeSectionType = {}));

},{}],41:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LanguageCode = void 0;
var LanguageCode;
(function (LanguageCode) {
    LanguageCode["UNKNOWN"] = "_unknown";
    LanguageCode["BENGALI"] = "bd";
    LanguageCode["BULGARIAN"] = "bg";
    LanguageCode["BRAZILIAN"] = "br";
    LanguageCode["CHINEESE"] = "cn";
    LanguageCode["CZECH"] = "cz";
    LanguageCode["GERMAN"] = "de";
    LanguageCode["DANISH"] = "dk";
    LanguageCode["ENGLISH"] = "gb";
    LanguageCode["SPANISH"] = "es";
    LanguageCode["FINNISH"] = "fi";
    LanguageCode["FRENCH"] = "fr";
    LanguageCode["WELSH"] = "gb";
    LanguageCode["GREEK"] = "gr";
    LanguageCode["CHINEESE_HONGKONG"] = "hk";
    LanguageCode["HUNGARIAN"] = "hu";
    LanguageCode["INDONESIAN"] = "id";
    LanguageCode["ISRELI"] = "il";
    LanguageCode["INDIAN"] = "in";
    LanguageCode["IRAN"] = "ir";
    LanguageCode["ITALIAN"] = "it";
    LanguageCode["JAPANESE"] = "jp";
    LanguageCode["KOREAN"] = "kr";
    LanguageCode["LITHUANIAN"] = "lt";
    LanguageCode["MONGOLIAN"] = "mn";
    LanguageCode["MEXIAN"] = "mx";
    LanguageCode["MALAY"] = "my";
    LanguageCode["DUTCH"] = "nl";
    LanguageCode["NORWEGIAN"] = "no";
    LanguageCode["PHILIPPINE"] = "ph";
    LanguageCode["POLISH"] = "pl";
    LanguageCode["PORTUGUESE"] = "pt";
    LanguageCode["ROMANIAN"] = "ro";
    LanguageCode["RUSSIAN"] = "ru";
    LanguageCode["SANSKRIT"] = "sa";
    LanguageCode["SAMI"] = "si";
    LanguageCode["THAI"] = "th";
    LanguageCode["TURKISH"] = "tr";
    LanguageCode["UKRAINIAN"] = "ua";
    LanguageCode["VIETNAMESE"] = "vn";
})(LanguageCode = exports.LanguageCode || (exports.LanguageCode = {}));

},{}],42:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MangaStatus = void 0;
var MangaStatus;
(function (MangaStatus) {
    MangaStatus[MangaStatus["ONGOING"] = 1] = "ONGOING";
    MangaStatus[MangaStatus["COMPLETED"] = 0] = "COMPLETED";
    MangaStatus[MangaStatus["UNKNOWN"] = 2] = "UNKNOWN";
    MangaStatus[MangaStatus["ABANDONED"] = 3] = "ABANDONED";
    MangaStatus[MangaStatus["HIATUS"] = 4] = "HIATUS";
})(MangaStatus = exports.MangaStatus || (exports.MangaStatus = {}));

},{}],43:[function(require,module,exports){
arguments[4][21][0].apply(exports,arguments)
},{"dup":21}],44:[function(require,module,exports){
arguments[4][21][0].apply(exports,arguments)
},{"dup":21}],45:[function(require,module,exports){
arguments[4][21][0].apply(exports,arguments)
},{"dup":21}],46:[function(require,module,exports){
arguments[4][21][0].apply(exports,arguments)
},{"dup":21}],47:[function(require,module,exports){
arguments[4][21][0].apply(exports,arguments)
},{"dup":21}],48:[function(require,module,exports){
arguments[4][21][0].apply(exports,arguments)
},{"dup":21}],49:[function(require,module,exports){
arguments[4][21][0].apply(exports,arguments)
},{"dup":21}],50:[function(require,module,exports){
arguments[4][21][0].apply(exports,arguments)
},{"dup":21}],51:[function(require,module,exports){
arguments[4][21][0].apply(exports,arguments)
},{"dup":21}],52:[function(require,module,exports){
arguments[4][21][0].apply(exports,arguments)
},{"dup":21}],53:[function(require,module,exports){
arguments[4][21][0].apply(exports,arguments)
},{"dup":21}],54:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SearchOperator = void 0;
var SearchOperator;
(function (SearchOperator) {
    SearchOperator["AND"] = "AND";
    SearchOperator["OR"] = "OR";
})(SearchOperator = exports.SearchOperator || (exports.SearchOperator = {}));

},{}],55:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ContentRating = void 0;
/**
 * A content rating to be attributed to each source.
 */
var ContentRating;
(function (ContentRating) {
    ContentRating["EVERYONE"] = "EVERYONE";
    ContentRating["MATURE"] = "MATURE";
    ContentRating["ADULT"] = "ADULT";
})(ContentRating = exports.ContentRating || (exports.ContentRating = {}));

},{}],56:[function(require,module,exports){
arguments[4][21][0].apply(exports,arguments)
},{"dup":21}],57:[function(require,module,exports){
arguments[4][21][0].apply(exports,arguments)
},{"dup":21}],58:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TagType = void 0;
/**
 * An enumerator which {@link SourceTags} uses to define the color of the tag rendered on the website.
 * Five types are available: blue, green, grey, yellow and red, the default one is blue.
 * Common colors are red for (Broken), yellow for (+18), grey for (Country-Proof)
 */
var TagType;
(function (TagType) {
    TagType["BLUE"] = "default";
    TagType["GREEN"] = "success";
    TagType["GREY"] = "info";
    TagType["YELLOW"] = "warning";
    TagType["RED"] = "danger";
})(TagType = exports.TagType || (exports.TagType = {}));

},{}],59:[function(require,module,exports){
arguments[4][21][0].apply(exports,arguments)
},{"dup":21}],60:[function(require,module,exports){
arguments[4][21][0].apply(exports,arguments)
},{"dup":21}],61:[function(require,module,exports){
arguments[4][21][0].apply(exports,arguments)
},{"dup":21}],62:[function(require,module,exports){
arguments[4][21][0].apply(exports,arguments)
},{"dup":21}],63:[function(require,module,exports){
"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
__exportStar(require("./Chapter"), exports);
__exportStar(require("./HomeSection"), exports);
__exportStar(require("./DynamicUI"), exports);
__exportStar(require("./ChapterDetails"), exports);
__exportStar(require("./Manga"), exports);
__exportStar(require("./MangaTile"), exports);
__exportStar(require("./RequestObject"), exports);
__exportStar(require("./SearchRequest"), exports);
__exportStar(require("./TagSection"), exports);
__exportStar(require("./SourceTag"), exports);
__exportStar(require("./Languages"), exports);
__exportStar(require("./Constants"), exports);
__exportStar(require("./MangaUpdate"), exports);
__exportStar(require("./PagedResults"), exports);
__exportStar(require("./ResponseObject"), exports);
__exportStar(require("./RequestManager"), exports);
__exportStar(require("./RequestHeaders"), exports);
__exportStar(require("./SourceInfo"), exports);
__exportStar(require("./SourceStateManager"), exports);
__exportStar(require("./RequestInterceptor"), exports);
__exportStar(require("./TrackedManga"), exports);
__exportStar(require("./SourceManga"), exports);
__exportStar(require("./TrackedMangaChapterReadAction"), exports);
__exportStar(require("./TrackerActionQueue"), exports);
__exportStar(require("./SearchField"), exports);
__exportStar(require("./RawData"), exports);
__exportStar(require("./SearchFilter"), exports);

},{"./Chapter":21,"./ChapterDetails":22,"./Constants":23,"./DynamicUI":39,"./HomeSection":40,"./Languages":41,"./Manga":42,"./MangaTile":43,"./MangaUpdate":44,"./PagedResults":45,"./RawData":46,"./RequestHeaders":47,"./RequestInterceptor":48,"./RequestManager":49,"./RequestObject":50,"./ResponseObject":51,"./SearchField":52,"./SearchFilter":53,"./SearchRequest":54,"./SourceInfo":55,"./SourceManga":56,"./SourceStateManager":57,"./SourceTag":58,"./TagSection":59,"./TrackedManga":60,"./TrackedMangaChapterReadAction":61,"./TrackerActionQueue":62}],64:[function(require,module,exports){
// shim for using process in browser
var process = module.exports = {};

// cached from whatever global is present so that test runners that stub it
// don't break things.  But we need to wrap it in a try catch in case it is
// wrapped in strict mode code which doesn't define any globals.  It's inside a
// function because try/catches deoptimize in certain engines.

var cachedSetTimeout;
var cachedClearTimeout;

function defaultSetTimout() {
    throw new Error('setTimeout has not been defined');
}
function defaultClearTimeout () {
    throw new Error('clearTimeout has not been defined');
}
(function () {
    try {
        if (typeof setTimeout === 'function') {
            cachedSetTimeout = setTimeout;
        } else {
            cachedSetTimeout = defaultSetTimout;
        }
    } catch (e) {
        cachedSetTimeout = defaultSetTimout;
    }
    try {
        if (typeof clearTimeout === 'function') {
            cachedClearTimeout = clearTimeout;
        } else {
            cachedClearTimeout = defaultClearTimeout;
        }
    } catch (e) {
        cachedClearTimeout = defaultClearTimeout;
    }
} ())
function runTimeout(fun) {
    if (cachedSetTimeout === setTimeout) {
        //normal enviroments in sane situations
        return setTimeout(fun, 0);
    }
    // if setTimeout wasn't available but was latter defined
    if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
        cachedSetTimeout = setTimeout;
        return setTimeout(fun, 0);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedSetTimeout(fun, 0);
    } catch(e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
            return cachedSetTimeout.call(null, fun, 0);
        } catch(e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
            return cachedSetTimeout.call(this, fun, 0);
        }
    }


}
function runClearTimeout(marker) {
    if (cachedClearTimeout === clearTimeout) {
        //normal enviroments in sane situations
        return clearTimeout(marker);
    }
    // if clearTimeout wasn't available but was latter defined
    if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
        cachedClearTimeout = clearTimeout;
        return clearTimeout(marker);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedClearTimeout(marker);
    } catch (e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
            return cachedClearTimeout.call(null, marker);
        } catch (e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
            // Some versions of I.E. have different rules for clearTimeout vs setTimeout
            return cachedClearTimeout.call(this, marker);
        }
    }



}
var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

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
    while(len) {
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

process.nextTick = function (fun) {
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
};

// v8 likes predictible objects
function Item(fun, array) {
    this.fun = fun;
    this.array = array;
}
Item.prototype.run = function () {
    this.fun.apply(null, this.array);
};
process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues
process.versions = {};

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;
process.prependListener = noop;
process.prependOnceListener = noop;

process.listeners = function (name) { return [] }

process.binding = function (name) {
    throw new Error('process.binding is not supported');
};

process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};
process.umask = function() { return 0; };

},{}],65:[function(require,module,exports){
module.exports=[
"ac",
"com.ac",
"edu.ac",
"gov.ac",
"net.ac",
"mil.ac",
"org.ac",
"ad",
"nom.ad",
"ae",
"co.ae",
"net.ae",
"org.ae",
"sch.ae",
"ac.ae",
"gov.ae",
"mil.ae",
"aero",
"accident-investigation.aero",
"accident-prevention.aero",
"aerobatic.aero",
"aeroclub.aero",
"aerodrome.aero",
"agents.aero",
"aircraft.aero",
"airline.aero",
"airport.aero",
"air-surveillance.aero",
"airtraffic.aero",
"air-traffic-control.aero",
"ambulance.aero",
"amusement.aero",
"association.aero",
"author.aero",
"ballooning.aero",
"broker.aero",
"caa.aero",
"cargo.aero",
"catering.aero",
"certification.aero",
"championship.aero",
"charter.aero",
"civilaviation.aero",
"club.aero",
"conference.aero",
"consultant.aero",
"consulting.aero",
"control.aero",
"council.aero",
"crew.aero",
"design.aero",
"dgca.aero",
"educator.aero",
"emergency.aero",
"engine.aero",
"engineer.aero",
"entertainment.aero",
"equipment.aero",
"exchange.aero",
"express.aero",
"federation.aero",
"flight.aero",
"freight.aero",
"fuel.aero",
"gliding.aero",
"government.aero",
"groundhandling.aero",
"group.aero",
"hanggliding.aero",
"homebuilt.aero",
"insurance.aero",
"journal.aero",
"journalist.aero",
"leasing.aero",
"logistics.aero",
"magazine.aero",
"maintenance.aero",
"media.aero",
"microlight.aero",
"modelling.aero",
"navigation.aero",
"parachuting.aero",
"paragliding.aero",
"passenger-association.aero",
"pilot.aero",
"press.aero",
"production.aero",
"recreation.aero",
"repbody.aero",
"res.aero",
"research.aero",
"rotorcraft.aero",
"safety.aero",
"scientist.aero",
"services.aero",
"show.aero",
"skydiving.aero",
"software.aero",
"student.aero",
"trader.aero",
"trading.aero",
"trainer.aero",
"union.aero",
"workinggroup.aero",
"works.aero",
"af",
"gov.af",
"com.af",
"org.af",
"net.af",
"edu.af",
"ag",
"com.ag",
"org.ag",
"net.ag",
"co.ag",
"nom.ag",
"ai",
"off.ai",
"com.ai",
"net.ai",
"org.ai",
"al",
"com.al",
"edu.al",
"gov.al",
"mil.al",
"net.al",
"org.al",
"am",
"co.am",
"com.am",
"commune.am",
"net.am",
"org.am",
"ao",
"ed.ao",
"gv.ao",
"og.ao",
"co.ao",
"pb.ao",
"it.ao",
"aq",
"ar",
"com.ar",
"edu.ar",
"gob.ar",
"gov.ar",
"int.ar",
"mil.ar",
"musica.ar",
"net.ar",
"org.ar",
"tur.ar",
"arpa",
"e164.arpa",
"in-addr.arpa",
"ip6.arpa",
"iris.arpa",
"uri.arpa",
"urn.arpa",
"as",
"gov.as",
"asia",
"at",
"ac.at",
"co.at",
"gv.at",
"or.at",
"au",
"com.au",
"net.au",
"org.au",
"edu.au",
"gov.au",
"asn.au",
"id.au",
"info.au",
"conf.au",
"oz.au",
"act.au",
"nsw.au",
"nt.au",
"qld.au",
"sa.au",
"tas.au",
"vic.au",
"wa.au",
"act.edu.au",
"catholic.edu.au",
"nsw.edu.au",
"nt.edu.au",
"qld.edu.au",
"sa.edu.au",
"tas.edu.au",
"vic.edu.au",
"wa.edu.au",
"qld.gov.au",
"sa.gov.au",
"tas.gov.au",
"vic.gov.au",
"wa.gov.au",
"education.tas.edu.au",
"schools.nsw.edu.au",
"aw",
"com.aw",
"ax",
"az",
"com.az",
"net.az",
"int.az",
"gov.az",
"org.az",
"edu.az",
"info.az",
"pp.az",
"mil.az",
"name.az",
"pro.az",
"biz.az",
"ba",
"com.ba",
"edu.ba",
"gov.ba",
"mil.ba",
"net.ba",
"org.ba",
"bb",
"biz.bb",
"co.bb",
"com.bb",
"edu.bb",
"gov.bb",
"info.bb",
"net.bb",
"org.bb",
"store.bb",
"tv.bb",
"*.bd",
"be",
"ac.be",
"bf",
"gov.bf",
"bg",
"a.bg",
"b.bg",
"c.bg",
"d.bg",
"e.bg",
"f.bg",
"g.bg",
"h.bg",
"i.bg",
"j.bg",
"k.bg",
"l.bg",
"m.bg",
"n.bg",
"o.bg",
"p.bg",
"q.bg",
"r.bg",
"s.bg",
"t.bg",
"u.bg",
"v.bg",
"w.bg",
"x.bg",
"y.bg",
"z.bg",
"0.bg",
"1.bg",
"2.bg",
"3.bg",
"4.bg",
"5.bg",
"6.bg",
"7.bg",
"8.bg",
"9.bg",
"bh",
"com.bh",
"edu.bh",
"net.bh",
"org.bh",
"gov.bh",
"bi",
"co.bi",
"com.bi",
"edu.bi",
"or.bi",
"org.bi",
"biz",
"bj",
"asso.bj",
"barreau.bj",
"gouv.bj",
"bm",
"com.bm",
"edu.bm",
"gov.bm",
"net.bm",
"org.bm",
"bn",
"com.bn",
"edu.bn",
"gov.bn",
"net.bn",
"org.bn",
"bo",
"com.bo",
"edu.bo",
"gob.bo",
"int.bo",
"org.bo",
"net.bo",
"mil.bo",
"tv.bo",
"web.bo",
"academia.bo",
"agro.bo",
"arte.bo",
"blog.bo",
"bolivia.bo",
"ciencia.bo",
"cooperativa.bo",
"democracia.bo",
"deporte.bo",
"ecologia.bo",
"economia.bo",
"empresa.bo",
"indigena.bo",
"industria.bo",
"info.bo",
"medicina.bo",
"movimiento.bo",
"musica.bo",
"natural.bo",
"nombre.bo",
"noticias.bo",
"patria.bo",
"politica.bo",
"profesional.bo",
"plurinacional.bo",
"pueblo.bo",
"revista.bo",
"salud.bo",
"tecnologia.bo",
"tksat.bo",
"transporte.bo",
"wiki.bo",
"br",
"9guacu.br",
"abc.br",
"adm.br",
"adv.br",
"agr.br",
"aju.br",
"am.br",
"anani.br",
"aparecida.br",
"arq.br",
"art.br",
"ato.br",
"b.br",
"barueri.br",
"belem.br",
"bhz.br",
"bio.br",
"blog.br",
"bmd.br",
"boavista.br",
"bsb.br",
"campinagrande.br",
"campinas.br",
"caxias.br",
"cim.br",
"cng.br",
"cnt.br",
"com.br",
"contagem.br",
"coop.br",
"cri.br",
"cuiaba.br",
"curitiba.br",
"def.br",
"ecn.br",
"eco.br",
"edu.br",
"emp.br",
"eng.br",
"esp.br",
"etc.br",
"eti.br",
"far.br",
"feira.br",
"flog.br",
"floripa.br",
"fm.br",
"fnd.br",
"fortal.br",
"fot.br",
"foz.br",
"fst.br",
"g12.br",
"ggf.br",
"goiania.br",
"gov.br",
"ac.gov.br",
"al.gov.br",
"am.gov.br",
"ap.gov.br",
"ba.gov.br",
"ce.gov.br",
"df.gov.br",
"es.gov.br",
"go.gov.br",
"ma.gov.br",
"mg.gov.br",
"ms.gov.br",
"mt.gov.br",
"pa.gov.br",
"pb.gov.br",
"pe.gov.br",
"pi.gov.br",
"pr.gov.br",
"rj.gov.br",
"rn.gov.br",
"ro.gov.br",
"rr.gov.br",
"rs.gov.br",
"sc.gov.br",
"se.gov.br",
"sp.gov.br",
"to.gov.br",
"gru.br",
"imb.br",
"ind.br",
"inf.br",
"jab.br",
"jampa.br",
"jdf.br",
"joinville.br",
"jor.br",
"jus.br",
"leg.br",
"lel.br",
"londrina.br",
"macapa.br",
"maceio.br",
"manaus.br",
"maringa.br",
"mat.br",
"med.br",
"mil.br",
"morena.br",
"mp.br",
"mus.br",
"natal.br",
"net.br",
"niteroi.br",
"*.nom.br",
"not.br",
"ntr.br",
"odo.br",
"ong.br",
"org.br",
"osasco.br",
"palmas.br",
"poa.br",
"ppg.br",
"pro.br",
"psc.br",
"psi.br",
"pvh.br",
"qsl.br",
"radio.br",
"rec.br",
"recife.br",
"ribeirao.br",
"rio.br",
"riobranco.br",
"riopreto.br",
"salvador.br",
"sampa.br",
"santamaria.br",
"santoandre.br",
"saobernardo.br",
"saogonca.br",
"sjc.br",
"slg.br",
"slz.br",
"sorocaba.br",
"srv.br",
"taxi.br",
"tc.br",
"teo.br",
"the.br",
"tmp.br",
"trd.br",
"tur.br",
"tv.br",
"udi.br",
"vet.br",
"vix.br",
"vlog.br",
"wiki.br",
"zlg.br",
"bs",
"com.bs",
"net.bs",
"org.bs",
"edu.bs",
"gov.bs",
"bt",
"com.bt",
"edu.bt",
"gov.bt",
"net.bt",
"org.bt",
"bv",
"bw",
"co.bw",
"org.bw",
"by",
"gov.by",
"mil.by",
"com.by",
"of.by",
"bz",
"com.bz",
"net.bz",
"org.bz",
"edu.bz",
"gov.bz",
"ca",
"ab.ca",
"bc.ca",
"mb.ca",
"nb.ca",
"nf.ca",
"nl.ca",
"ns.ca",
"nt.ca",
"nu.ca",
"on.ca",
"pe.ca",
"qc.ca",
"sk.ca",
"yk.ca",
"gc.ca",
"cat",
"cc",
"cd",
"gov.cd",
"cf",
"cg",
"ch",
"ci",
"org.ci",
"or.ci",
"com.ci",
"co.ci",
"edu.ci",
"ed.ci",
"ac.ci",
"net.ci",
"go.ci",
"asso.ci",
"aéroport.ci",
"int.ci",
"presse.ci",
"md.ci",
"gouv.ci",
"*.ck",
"!www.ck",
"cl",
"aprendemas.cl",
"co.cl",
"gob.cl",
"gov.cl",
"mil.cl",
"cm",
"co.cm",
"com.cm",
"gov.cm",
"net.cm",
"cn",
"ac.cn",
"com.cn",
"edu.cn",
"gov.cn",
"net.cn",
"org.cn",
"mil.cn",
"公司.cn",
"网络.cn",
"網絡.cn",
"ah.cn",
"bj.cn",
"cq.cn",
"fj.cn",
"gd.cn",
"gs.cn",
"gz.cn",
"gx.cn",
"ha.cn",
"hb.cn",
"he.cn",
"hi.cn",
"hl.cn",
"hn.cn",
"jl.cn",
"js.cn",
"jx.cn",
"ln.cn",
"nm.cn",
"nx.cn",
"qh.cn",
"sc.cn",
"sd.cn",
"sh.cn",
"sn.cn",
"sx.cn",
"tj.cn",
"xj.cn",
"xz.cn",
"yn.cn",
"zj.cn",
"hk.cn",
"mo.cn",
"tw.cn",
"co",
"arts.co",
"com.co",
"edu.co",
"firm.co",
"gov.co",
"info.co",
"int.co",
"mil.co",
"net.co",
"nom.co",
"org.co",
"rec.co",
"web.co",
"com",
"coop",
"cr",
"ac.cr",
"co.cr",
"ed.cr",
"fi.cr",
"go.cr",
"or.cr",
"sa.cr",
"cu",
"com.cu",
"edu.cu",
"org.cu",
"net.cu",
"gov.cu",
"inf.cu",
"cv",
"cw",
"com.cw",
"edu.cw",
"net.cw",
"org.cw",
"cx",
"gov.cx",
"cy",
"ac.cy",
"biz.cy",
"com.cy",
"ekloges.cy",
"gov.cy",
"ltd.cy",
"name.cy",
"net.cy",
"org.cy",
"parliament.cy",
"press.cy",
"pro.cy",
"tm.cy",
"cz",
"de",
"dj",
"dk",
"dm",
"com.dm",
"net.dm",
"org.dm",
"edu.dm",
"gov.dm",
"do",
"art.do",
"com.do",
"edu.do",
"gob.do",
"gov.do",
"mil.do",
"net.do",
"org.do",
"sld.do",
"web.do",
"dz",
"com.dz",
"org.dz",
"net.dz",
"gov.dz",
"edu.dz",
"asso.dz",
"pol.dz",
"art.dz",
"ec",
"com.ec",
"info.ec",
"net.ec",
"fin.ec",
"k12.ec",
"med.ec",
"pro.ec",
"org.ec",
"edu.ec",
"gov.ec",
"gob.ec",
"mil.ec",
"edu",
"ee",
"edu.ee",
"gov.ee",
"riik.ee",
"lib.ee",
"med.ee",
"com.ee",
"pri.ee",
"aip.ee",
"org.ee",
"fie.ee",
"eg",
"com.eg",
"edu.eg",
"eun.eg",
"gov.eg",
"mil.eg",
"name.eg",
"net.eg",
"org.eg",
"sci.eg",
"*.er",
"es",
"com.es",
"nom.es",
"org.es",
"gob.es",
"edu.es",
"et",
"com.et",
"gov.et",
"org.et",
"edu.et",
"biz.et",
"name.et",
"info.et",
"net.et",
"eu",
"fi",
"aland.fi",
"fj",
"ac.fj",
"biz.fj",
"com.fj",
"gov.fj",
"info.fj",
"mil.fj",
"name.fj",
"net.fj",
"org.fj",
"pro.fj",
"*.fk",
"fm",
"fo",
"fr",
"asso.fr",
"com.fr",
"gouv.fr",
"nom.fr",
"prd.fr",
"tm.fr",
"aeroport.fr",
"avocat.fr",
"avoues.fr",
"cci.fr",
"chambagri.fr",
"chirurgiens-dentistes.fr",
"experts-comptables.fr",
"geometre-expert.fr",
"greta.fr",
"huissier-justice.fr",
"medecin.fr",
"notaires.fr",
"pharmacien.fr",
"port.fr",
"veterinaire.fr",
"ga",
"gb",
"gd",
"ge",
"com.ge",
"edu.ge",
"gov.ge",
"org.ge",
"mil.ge",
"net.ge",
"pvt.ge",
"gf",
"gg",
"co.gg",
"net.gg",
"org.gg",
"gh",
"com.gh",
"edu.gh",
"gov.gh",
"org.gh",
"mil.gh",
"gi",
"com.gi",
"ltd.gi",
"gov.gi",
"mod.gi",
"edu.gi",
"org.gi",
"gl",
"co.gl",
"com.gl",
"edu.gl",
"net.gl",
"org.gl",
"gm",
"gn",
"ac.gn",
"com.gn",
"edu.gn",
"gov.gn",
"org.gn",
"net.gn",
"gov",
"gp",
"com.gp",
"net.gp",
"mobi.gp",
"edu.gp",
"org.gp",
"asso.gp",
"gq",
"gr",
"com.gr",
"edu.gr",
"net.gr",
"org.gr",
"gov.gr",
"gs",
"gt",
"com.gt",
"edu.gt",
"gob.gt",
"ind.gt",
"mil.gt",
"net.gt",
"org.gt",
"gu",
"com.gu",
"edu.gu",
"gov.gu",
"guam.gu",
"info.gu",
"net.gu",
"org.gu",
"web.gu",
"gw",
"gy",
"co.gy",
"com.gy",
"edu.gy",
"gov.gy",
"net.gy",
"org.gy",
"hk",
"com.hk",
"edu.hk",
"gov.hk",
"idv.hk",
"net.hk",
"org.hk",
"公司.hk",
"教育.hk",
"敎育.hk",
"政府.hk",
"個人.hk",
"个人.hk",
"箇人.hk",
"網络.hk",
"网络.hk",
"组織.hk",
"網絡.hk",
"网絡.hk",
"组织.hk",
"組織.hk",
"組织.hk",
"hm",
"hn",
"com.hn",
"edu.hn",
"org.hn",
"net.hn",
"mil.hn",
"gob.hn",
"hr",
"iz.hr",
"from.hr",
"name.hr",
"com.hr",
"ht",
"com.ht",
"shop.ht",
"firm.ht",
"info.ht",
"adult.ht",
"net.ht",
"pro.ht",
"org.ht",
"med.ht",
"art.ht",
"coop.ht",
"pol.ht",
"asso.ht",
"edu.ht",
"rel.ht",
"gouv.ht",
"perso.ht",
"hu",
"co.hu",
"info.hu",
"org.hu",
"priv.hu",
"sport.hu",
"tm.hu",
"2000.hu",
"agrar.hu",
"bolt.hu",
"casino.hu",
"city.hu",
"erotica.hu",
"erotika.hu",
"film.hu",
"forum.hu",
"games.hu",
"hotel.hu",
"ingatlan.hu",
"jogasz.hu",
"konyvelo.hu",
"lakas.hu",
"media.hu",
"news.hu",
"reklam.hu",
"sex.hu",
"shop.hu",
"suli.hu",
"szex.hu",
"tozsde.hu",
"utazas.hu",
"video.hu",
"id",
"ac.id",
"biz.id",
"co.id",
"desa.id",
"go.id",
"mil.id",
"my.id",
"net.id",
"or.id",
"ponpes.id",
"sch.id",
"web.id",
"ie",
"gov.ie",
"il",
"ac.il",
"co.il",
"gov.il",
"idf.il",
"k12.il",
"muni.il",
"net.il",
"org.il",
"im",
"ac.im",
"co.im",
"com.im",
"ltd.co.im",
"net.im",
"org.im",
"plc.co.im",
"tt.im",
"tv.im",
"in",
"co.in",
"firm.in",
"net.in",
"org.in",
"gen.in",
"ind.in",
"nic.in",
"ac.in",
"edu.in",
"res.in",
"gov.in",
"mil.in",
"info",
"int",
"eu.int",
"io",
"com.io",
"iq",
"gov.iq",
"edu.iq",
"mil.iq",
"com.iq",
"org.iq",
"net.iq",
"ir",
"ac.ir",
"co.ir",
"gov.ir",
"id.ir",
"net.ir",
"org.ir",
"sch.ir",
"ایران.ir",
"ايران.ir",
"is",
"net.is",
"com.is",
"edu.is",
"gov.is",
"org.is",
"int.is",
"it",
"gov.it",
"edu.it",
"abr.it",
"abruzzo.it",
"aosta-valley.it",
"aostavalley.it",
"bas.it",
"basilicata.it",
"cal.it",
"calabria.it",
"cam.it",
"campania.it",
"emilia-romagna.it",
"emiliaromagna.it",
"emr.it",
"friuli-v-giulia.it",
"friuli-ve-giulia.it",
"friuli-vegiulia.it",
"friuli-venezia-giulia.it",
"friuli-veneziagiulia.it",
"friuli-vgiulia.it",
"friuliv-giulia.it",
"friulive-giulia.it",
"friulivegiulia.it",
"friulivenezia-giulia.it",
"friuliveneziagiulia.it",
"friulivgiulia.it",
"fvg.it",
"laz.it",
"lazio.it",
"lig.it",
"liguria.it",
"lom.it",
"lombardia.it",
"lombardy.it",
"lucania.it",
"mar.it",
"marche.it",
"mol.it",
"molise.it",
"piedmont.it",
"piemonte.it",
"pmn.it",
"pug.it",
"puglia.it",
"sar.it",
"sardegna.it",
"sardinia.it",
"sic.it",
"sicilia.it",
"sicily.it",
"taa.it",
"tos.it",
"toscana.it",
"trentin-sud-tirol.it",
"trentin-süd-tirol.it",
"trentin-sudtirol.it",
"trentin-südtirol.it",
"trentin-sued-tirol.it",
"trentin-suedtirol.it",
"trentino-a-adige.it",
"trentino-aadige.it",
"trentino-alto-adige.it",
"trentino-altoadige.it",
"trentino-s-tirol.it",
"trentino-stirol.it",
"trentino-sud-tirol.it",
"trentino-süd-tirol.it",
"trentino-sudtirol.it",
"trentino-südtirol.it",
"trentino-sued-tirol.it",
"trentino-suedtirol.it",
"trentino.it",
"trentinoa-adige.it",
"trentinoaadige.it",
"trentinoalto-adige.it",
"trentinoaltoadige.it",
"trentinos-tirol.it",
"trentinostirol.it",
"trentinosud-tirol.it",
"trentinosüd-tirol.it",
"trentinosudtirol.it",
"trentinosüdtirol.it",
"trentinosued-tirol.it",
"trentinosuedtirol.it",
"trentinsud-tirol.it",
"trentinsüd-tirol.it",
"trentinsudtirol.it",
"trentinsüdtirol.it",
"trentinsued-tirol.it",
"trentinsuedtirol.it",
"tuscany.it",
"umb.it",
"umbria.it",
"val-d-aosta.it",
"val-daosta.it",
"vald-aosta.it",
"valdaosta.it",
"valle-aosta.it",
"valle-d-aosta.it",
"valle-daosta.it",
"valleaosta.it",
"valled-aosta.it",
"valledaosta.it",
"vallee-aoste.it",
"vallée-aoste.it",
"vallee-d-aoste.it",
"vallée-d-aoste.it",
"valleeaoste.it",
"valléeaoste.it",
"valleedaoste.it",
"valléedaoste.it",
"vao.it",
"vda.it",
"ven.it",
"veneto.it",
"ag.it",
"agrigento.it",
"al.it",
"alessandria.it",
"alto-adige.it",
"altoadige.it",
"an.it",
"ancona.it",
"andria-barletta-trani.it",
"andria-trani-barletta.it",
"andriabarlettatrani.it",
"andriatranibarletta.it",
"ao.it",
"aosta.it",
"aoste.it",
"ap.it",
"aq.it",
"aquila.it",
"ar.it",
"arezzo.it",
"ascoli-piceno.it",
"ascolipiceno.it",
"asti.it",
"at.it",
"av.it",
"avellino.it",
"ba.it",
"balsan-sudtirol.it",
"balsan-südtirol.it",
"balsan-suedtirol.it",
"balsan.it",
"bari.it",
"barletta-trani-andria.it",
"barlettatraniandria.it",
"belluno.it",
"benevento.it",
"bergamo.it",
"bg.it",
"bi.it",
"biella.it",
"bl.it",
"bn.it",
"bo.it",
"bologna.it",
"bolzano-altoadige.it",
"bolzano.it",
"bozen-sudtirol.it",
"bozen-südtirol.it",
"bozen-suedtirol.it",
"bozen.it",
"br.it",
"brescia.it",
"brindisi.it",
"bs.it",
"bt.it",
"bulsan-sudtirol.it",
"bulsan-südtirol.it",
"bulsan-suedtirol.it",
"bulsan.it",
"bz.it",
"ca.it",
"cagliari.it",
"caltanissetta.it",
"campidano-medio.it",
"campidanomedio.it",
"campobasso.it",
"carbonia-iglesias.it",
"carboniaiglesias.it",
"carrara-massa.it",
"carraramassa.it",
"caserta.it",
"catania.it",
"catanzaro.it",
"cb.it",
"ce.it",
"cesena-forli.it",
"cesena-forlì.it",
"cesenaforli.it",
"cesenaforlì.it",
"ch.it",
"chieti.it",
"ci.it",
"cl.it",
"cn.it",
"co.it",
"como.it",
"cosenza.it",
"cr.it",
"cremona.it",
"crotone.it",
"cs.it",
"ct.it",
"cuneo.it",
"cz.it",
"dell-ogliastra.it",
"dellogliastra.it",
"en.it",
"enna.it",
"fc.it",
"fe.it",
"fermo.it",
"ferrara.it",
"fg.it",
"fi.it",
"firenze.it",
"florence.it",
"fm.it",
"foggia.it",
"forli-cesena.it",
"forlì-cesena.it",
"forlicesena.it",
"forlìcesena.it",
"fr.it",
"frosinone.it",
"ge.it",
"genoa.it",
"genova.it",
"go.it",
"gorizia.it",
"gr.it",
"grosseto.it",
"iglesias-carbonia.it",
"iglesiascarbonia.it",
"im.it",
"imperia.it",
"is.it",
"isernia.it",
"kr.it",
"la-spezia.it",
"laquila.it",
"laspezia.it",
"latina.it",
"lc.it",
"le.it",
"lecce.it",
"lecco.it",
"li.it",
"livorno.it",
"lo.it",
"lodi.it",
"lt.it",
"lu.it",
"lucca.it",
"macerata.it",
"mantova.it",
"massa-carrara.it",
"massacarrara.it",
"matera.it",
"mb.it",
"mc.it",
"me.it",
"medio-campidano.it",
"mediocampidano.it",
"messina.it",
"mi.it",
"milan.it",
"milano.it",
"mn.it",
"mo.it",
"modena.it",
"monza-brianza.it",
"monza-e-della-brianza.it",
"monza.it",
"monzabrianza.it",
"monzaebrianza.it",
"monzaedellabrianza.it",
"ms.it",
"mt.it",
"na.it",
"naples.it",
"napoli.it",
"no.it",
"novara.it",
"nu.it",
"nuoro.it",
"og.it",
"ogliastra.it",
"olbia-tempio.it",
"olbiatempio.it",
"or.it",
"oristano.it",
"ot.it",
"pa.it",
"padova.it",
"padua.it",
"palermo.it",
"parma.it",
"pavia.it",
"pc.it",
"pd.it",
"pe.it",
"perugia.it",
"pesaro-urbino.it",
"pesarourbino.it",
"pescara.it",
"pg.it",
"pi.it",
"piacenza.it",
"pisa.it",
"pistoia.it",
"pn.it",
"po.it",
"pordenone.it",
"potenza.it",
"pr.it",
"prato.it",
"pt.it",
"pu.it",
"pv.it",
"pz.it",
"ra.it",
"ragusa.it",
"ravenna.it",
"rc.it",
"re.it",
"reggio-calabria.it",
"reggio-emilia.it",
"reggiocalabria.it",
"reggioemilia.it",
"rg.it",
"ri.it",
"rieti.it",
"rimini.it",
"rm.it",
"rn.it",
"ro.it",
"roma.it",
"rome.it",
"rovigo.it",
"sa.it",
"salerno.it",
"sassari.it",
"savona.it",
"si.it",
"siena.it",
"siracusa.it",
"so.it",
"sondrio.it",
"sp.it",
"sr.it",
"ss.it",
"suedtirol.it",
"südtirol.it",
"sv.it",
"ta.it",
"taranto.it",
"te.it",
"tempio-olbia.it",
"tempioolbia.it",
"teramo.it",
"terni.it",
"tn.it",
"to.it",
"torino.it",
"tp.it",
"tr.it",
"trani-andria-barletta.it",
"trani-barletta-andria.it",
"traniandriabarletta.it",
"tranibarlettaandria.it",
"trapani.it",
"trento.it",
"treviso.it",
"trieste.it",
"ts.it",
"turin.it",
"tv.it",
"ud.it",
"udine.it",
"urbino-pesaro.it",
"urbinopesaro.it",
"va.it",
"varese.it",
"vb.it",
"vc.it",
"ve.it",
"venezia.it",
"venice.it",
"verbania.it",
"vercelli.it",
"verona.it",
"vi.it",
"vibo-valentia.it",
"vibovalentia.it",
"vicenza.it",
"viterbo.it",
"vr.it",
"vs.it",
"vt.it",
"vv.it",
"je",
"co.je",
"net.je",
"org.je",
"*.jm",
"jo",
"com.jo",
"org.jo",
"net.jo",
"edu.jo",
"sch.jo",
"gov.jo",
"mil.jo",
"name.jo",
"jobs",
"jp",
"ac.jp",
"ad.jp",
"co.jp",
"ed.jp",
"go.jp",
"gr.jp",
"lg.jp",
"ne.jp",
"or.jp",
"aichi.jp",
"akita.jp",
"aomori.jp",
"chiba.jp",
"ehime.jp",
"fukui.jp",
"fukuoka.jp",
"fukushima.jp",
"gifu.jp",
"gunma.jp",
"hiroshima.jp",
"hokkaido.jp",
"hyogo.jp",
"ibaraki.jp",
"ishikawa.jp",
"iwate.jp",
"kagawa.jp",
"kagoshima.jp",
"kanagawa.jp",
"kochi.jp",
"kumamoto.jp",
"kyoto.jp",
"mie.jp",
"miyagi.jp",
"miyazaki.jp",
"nagano.jp",
"nagasaki.jp",
"nara.jp",
"niigata.jp",
"oita.jp",
"okayama.jp",
"okinawa.jp",
"osaka.jp",
"saga.jp",
"saitama.jp",
"shiga.jp",
"shimane.jp",
"shizuoka.jp",
"tochigi.jp",
"tokushima.jp",
"tokyo.jp",
"tottori.jp",
"toyama.jp",
"wakayama.jp",
"yamagata.jp",
"yamaguchi.jp",
"yamanashi.jp",
"栃木.jp",
"愛知.jp",
"愛媛.jp",
"兵庫.jp",
"熊本.jp",
"茨城.jp",
"北海道.jp",
"千葉.jp",
"和歌山.jp",
"長崎.jp",
"長野.jp",
"新潟.jp",
"青森.jp",
"静岡.jp",
"東京.jp",
"石川.jp",
"埼玉.jp",
"三重.jp",
"京都.jp",
"佐賀.jp",
"大分.jp",
"大阪.jp",
"奈良.jp",
"宮城.jp",
"宮崎.jp",
"富山.jp",
"山口.jp",
"山形.jp",
"山梨.jp",
"岩手.jp",
"岐阜.jp",
"岡山.jp",
"島根.jp",
"広島.jp",
"徳島.jp",
"沖縄.jp",
"滋賀.jp",
"神奈川.jp",
"福井.jp",
"福岡.jp",
"福島.jp",
"秋田.jp",
"群馬.jp",
"香川.jp",
"高知.jp",
"鳥取.jp",
"鹿児島.jp",
"*.kawasaki.jp",
"*.kitakyushu.jp",
"*.kobe.jp",
"*.nagoya.jp",
"*.sapporo.jp",
"*.sendai.jp",
"*.yokohama.jp",
"!city.kawasaki.jp",
"!city.kitakyushu.jp",
"!city.kobe.jp",
"!city.nagoya.jp",
"!city.sapporo.jp",
"!city.sendai.jp",
"!city.yokohama.jp",
"aisai.aichi.jp",
"ama.aichi.jp",
"anjo.aichi.jp",
"asuke.aichi.jp",
"chiryu.aichi.jp",
"chita.aichi.jp",
"fuso.aichi.jp",
"gamagori.aichi.jp",
"handa.aichi.jp",
"hazu.aichi.jp",
"hekinan.aichi.jp",
"higashiura.aichi.jp",
"ichinomiya.aichi.jp",
"inazawa.aichi.jp",
"inuyama.aichi.jp",
"isshiki.aichi.jp",
"iwakura.aichi.jp",
"kanie.aichi.jp",
"kariya.aichi.jp",
"kasugai.aichi.jp",
"kira.aichi.jp",
"kiyosu.aichi.jp",
"komaki.aichi.jp",
"konan.aichi.jp",
"kota.aichi.jp",
"mihama.aichi.jp",
"miyoshi.aichi.jp",
"nishio.aichi.jp",
"nisshin.aichi.jp",
"obu.aichi.jp",
"oguchi.aichi.jp",
"oharu.aichi.jp",
"okazaki.aichi.jp",
"owariasahi.aichi.jp",
"seto.aichi.jp",
"shikatsu.aichi.jp",
"shinshiro.aichi.jp",
"shitara.aichi.jp",
"tahara.aichi.jp",
"takahama.aichi.jp",
"tobishima.aichi.jp",
"toei.aichi.jp",
"togo.aichi.jp",
"tokai.aichi.jp",
"tokoname.aichi.jp",
"toyoake.aichi.jp",
"toyohashi.aichi.jp",
"toyokawa.aichi.jp",
"toyone.aichi.jp",
"toyota.aichi.jp",
"tsushima.aichi.jp",
"yatomi.aichi.jp",
"akita.akita.jp",
"daisen.akita.jp",
"fujisato.akita.jp",
"gojome.akita.jp",
"hachirogata.akita.jp",
"happou.akita.jp",
"higashinaruse.akita.jp",
"honjo.akita.jp",
"honjyo.akita.jp",
"ikawa.akita.jp",
"kamikoani.akita.jp",
"kamioka.akita.jp",
"katagami.akita.jp",
"kazuno.akita.jp",
"kitaakita.akita.jp",
"kosaka.akita.jp",
"kyowa.akita.jp",
"misato.akita.jp",
"mitane.akita.jp",
"moriyoshi.akita.jp",
"nikaho.akita.jp",
"noshiro.akita.jp",
"odate.akita.jp",
"oga.akita.jp",
"ogata.akita.jp",
"semboku.akita.jp",
"yokote.akita.jp",
"yurihonjo.akita.jp",
"aomori.aomori.jp",
"gonohe.aomori.jp",
"hachinohe.aomori.jp",
"hashikami.aomori.jp",
"hiranai.aomori.jp",
"hirosaki.aomori.jp",
"itayanagi.aomori.jp",
"kuroishi.aomori.jp",
"misawa.aomori.jp",
"mutsu.aomori.jp",
"nakadomari.aomori.jp",
"noheji.aomori.jp",
"oirase.aomori.jp",
"owani.aomori.jp",
"rokunohe.aomori.jp",
"sannohe.aomori.jp",
"shichinohe.aomori.jp",
"shingo.aomori.jp",
"takko.aomori.jp",
"towada.aomori.jp",
"tsugaru.aomori.jp",
"tsuruta.aomori.jp",
"abiko.chiba.jp",
"asahi.chiba.jp",
"chonan.chiba.jp",
"chosei.chiba.jp",
"choshi.chiba.jp",
"chuo.chiba.jp",
"funabashi.chiba.jp",
"futtsu.chiba.jp",
"hanamigawa.chiba.jp",
"ichihara.chiba.jp",
"ichikawa.chiba.jp",
"ichinomiya.chiba.jp",
"inzai.chiba.jp",
"isumi.chiba.jp",
"kamagaya.chiba.jp",
"kamogawa.chiba.jp",
"kashiwa.chiba.jp",
"katori.chiba.jp",
"katsuura.chiba.jp",
"kimitsu.chiba.jp",
"kisarazu.chiba.jp",
"kozaki.chiba.jp",
"kujukuri.chiba.jp",
"kyonan.chiba.jp",
"matsudo.chiba.jp",
"midori.chiba.jp",
"mihama.chiba.jp",
"minamiboso.chiba.jp",
"mobara.chiba.jp",
"mutsuzawa.chiba.jp",
"nagara.chiba.jp",
"nagareyama.chiba.jp",
"narashino.chiba.jp",
"narita.chiba.jp",
"noda.chiba.jp",
"oamishirasato.chiba.jp",
"omigawa.chiba.jp",
"onjuku.chiba.jp",
"otaki.chiba.jp",
"sakae.chiba.jp",
"sakura.chiba.jp",
"shimofusa.chiba.jp",
"shirako.chiba.jp",
"shiroi.chiba.jp",
"shisui.chiba.jp",
"sodegaura.chiba.jp",
"sosa.chiba.jp",
"tako.chiba.jp",
"tateyama.chiba.jp",
"togane.chiba.jp",
"tohnosho.chiba.jp",
"tomisato.chiba.jp",
"urayasu.chiba.jp",
"yachimata.chiba.jp",
"yachiyo.chiba.jp",
"yokaichiba.chiba.jp",
"yokoshibahikari.chiba.jp",
"yotsukaido.chiba.jp",
"ainan.ehime.jp",
"honai.ehime.jp",
"ikata.ehime.jp",
"imabari.ehime.jp",
"iyo.ehime.jp",
"kamijima.ehime.jp",
"kihoku.ehime.jp",
"kumakogen.ehime.jp",
"masaki.ehime.jp",
"matsuno.ehime.jp",
"matsuyama.ehime.jp",
"namikata.ehime.jp",
"niihama.ehime.jp",
"ozu.ehime.jp",
"saijo.ehime.jp",
"seiyo.ehime.jp",
"shikokuchuo.ehime.jp",
"tobe.ehime.jp",
"toon.ehime.jp",
"uchiko.ehime.jp",
"uwajima.ehime.jp",
"yawatahama.ehime.jp",
"echizen.fukui.jp",
"eiheiji.fukui.jp",
"fukui.fukui.jp",
"ikeda.fukui.jp",
"katsuyama.fukui.jp",
"mihama.fukui.jp",
"minamiechizen.fukui.jp",
"obama.fukui.jp",
"ohi.fukui.jp",
"ono.fukui.jp",
"sabae.fukui.jp",
"sakai.fukui.jp",
"takahama.fukui.jp",
"tsuruga.fukui.jp",
"wakasa.fukui.jp",
"ashiya.fukuoka.jp",
"buzen.fukuoka.jp",
"chikugo.fukuoka.jp",
"chikuho.fukuoka.jp",
"chikujo.fukuoka.jp",
"chikushino.fukuoka.jp",
"chikuzen.fukuoka.jp",
"chuo.fukuoka.jp",
"dazaifu.fukuoka.jp",
"fukuchi.fukuoka.jp",
"hakata.fukuoka.jp",
"higashi.fukuoka.jp",
"hirokawa.fukuoka.jp",
"hisayama.fukuoka.jp",
"iizuka.fukuoka.jp",
"inatsuki.fukuoka.jp",
"kaho.fukuoka.jp",
"kasuga.fukuoka.jp",
"kasuya.fukuoka.jp",
"kawara.fukuoka.jp",
"keisen.fukuoka.jp",
"koga.fukuoka.jp",
"kurate.fukuoka.jp",
"kurogi.fukuoka.jp",
"kurume.fukuoka.jp",
"minami.fukuoka.jp",
"miyako.fukuoka.jp",
"miyama.fukuoka.jp",
"miyawaka.fukuoka.jp",
"mizumaki.fukuoka.jp",
"munakata.fukuoka.jp",
"nakagawa.fukuoka.jp",
"nakama.fukuoka.jp",
"nishi.fukuoka.jp",
"nogata.fukuoka.jp",
"ogori.fukuoka.jp",
"okagaki.fukuoka.jp",
"okawa.fukuoka.jp",
"oki.fukuoka.jp",
"omuta.fukuoka.jp",
"onga.fukuoka.jp",
"onojo.fukuoka.jp",
"oto.fukuoka.jp",
"saigawa.fukuoka.jp",
"sasaguri.fukuoka.jp",
"shingu.fukuoka.jp",
"shinyoshitomi.fukuoka.jp",
"shonai.fukuoka.jp",
"soeda.fukuoka.jp",
"sue.fukuoka.jp",
"tachiarai.fukuoka.jp",
"tagawa.fukuoka.jp",
"takata.fukuoka.jp",
"toho.fukuoka.jp",
"toyotsu.fukuoka.jp",
"tsuiki.fukuoka.jp",
"ukiha.fukuoka.jp",
"umi.fukuoka.jp",
"usui.fukuoka.jp",
"yamada.fukuoka.jp",
"yame.fukuoka.jp",
"yanagawa.fukuoka.jp",
"yukuhashi.fukuoka.jp",
"aizubange.fukushima.jp",
"aizumisato.fukushima.jp",
"aizuwakamatsu.fukushima.jp",
"asakawa.fukushima.jp",
"bandai.fukushima.jp",
"date.fukushima.jp",
"fukushima.fukushima.jp",
"furudono.fukushima.jp",
"futaba.fukushima.jp",
"hanawa.fukushima.jp",
"higashi.fukushima.jp",
"hirata.fukushima.jp",
"hirono.fukushima.jp",
"iitate.fukushima.jp",
"inawashiro.fukushima.jp",
"ishikawa.fukushima.jp",
"iwaki.fukushima.jp",
"izumizaki.fukushima.jp",
"kagamiishi.fukushima.jp",
"kaneyama.fukushima.jp",
"kawamata.fukushima.jp",
"kitakata.fukushima.jp",
"kitashiobara.fukushima.jp",
"koori.fukushima.jp",
"koriyama.fukushima.jp",
"kunimi.fukushima.jp",
"miharu.fukushima.jp",
"mishima.fukushima.jp",
"namie.fukushima.jp",
"nango.fukushima.jp",
"nishiaizu.fukushima.jp",
"nishigo.fukushima.jp",
"okuma.fukushima.jp",
"omotego.fukushima.jp",
"ono.fukushima.jp",
"otama.fukushima.jp",
"samegawa.fukushima.jp",
"shimogo.fukushima.jp",
"shirakawa.fukushima.jp",
"showa.fukushima.jp",
"soma.fukushima.jp",
"sukagawa.fukushima.jp",
"taishin.fukushima.jp",
"tamakawa.fukushima.jp",
"tanagura.fukushima.jp",
"tenei.fukushima.jp",
"yabuki.fukushima.jp",
"yamato.fukushima.jp",
"yamatsuri.fukushima.jp",
"yanaizu.fukushima.jp",
"yugawa.fukushima.jp",
"anpachi.gifu.jp",
"ena.gifu.jp",
"gifu.gifu.jp",
"ginan.gifu.jp",
"godo.gifu.jp",
"gujo.gifu.jp",
"hashima.gifu.jp",
"hichiso.gifu.jp",
"hida.gifu.jp",
"higashishirakawa.gifu.jp",
"ibigawa.gifu.jp",
"ikeda.gifu.jp",
"kakamigahara.gifu.jp",
"kani.gifu.jp",
"kasahara.gifu.jp",
"kasamatsu.gifu.jp",
"kawaue.gifu.jp",
"kitagata.gifu.jp",
"mino.gifu.jp",
"minokamo.gifu.jp",
"mitake.gifu.jp",
"mizunami.gifu.jp",
"motosu.gifu.jp",
"nakatsugawa.gifu.jp",
"ogaki.gifu.jp",
"sakahogi.gifu.jp",
"seki.gifu.jp",
"sekigahara.gifu.jp",
"shirakawa.gifu.jp",
"tajimi.gifu.jp",
"takayama.gifu.jp",
"tarui.gifu.jp",
"toki.gifu.jp",
"tomika.gifu.jp",
"wanouchi.gifu.jp",
"yamagata.gifu.jp",
"yaotsu.gifu.jp",
"yoro.gifu.jp",
"annaka.gunma.jp",
"chiyoda.gunma.jp",
"fujioka.gunma.jp",
"higashiagatsuma.gunma.jp",
"isesaki.gunma.jp",
"itakura.gunma.jp",
"kanna.gunma.jp",
"kanra.gunma.jp",
"katashina.gunma.jp",
"kawaba.gunma.jp",
"kiryu.gunma.jp",
"kusatsu.gunma.jp",
"maebashi.gunma.jp",
"meiwa.gunma.jp",
"midori.gunma.jp",
"minakami.gunma.jp",
"naganohara.gunma.jp",
"nakanojo.gunma.jp",
"nanmoku.gunma.jp",
"numata.gunma.jp",
"oizumi.gunma.jp",
"ora.gunma.jp",
"ota.gunma.jp",
"shibukawa.gunma.jp",
"shimonita.gunma.jp",
"shinto.gunma.jp",
"showa.gunma.jp",
"takasaki.gunma.jp",
"takayama.gunma.jp",
"tamamura.gunma.jp",
"tatebayashi.gunma.jp",
"tomioka.gunma.jp",
"tsukiyono.gunma.jp",
"tsumagoi.gunma.jp",
"ueno.gunma.jp",
"yoshioka.gunma.jp",
"asaminami.hiroshima.jp",
"daiwa.hiroshima.jp",
"etajima.hiroshima.jp",
"fuchu.hiroshima.jp",
"fukuyama.hiroshima.jp",
"hatsukaichi.hiroshima.jp",
"higashihiroshima.hiroshima.jp",
"hongo.hiroshima.jp",
"jinsekikogen.hiroshima.jp",
"kaita.hiroshima.jp",
"kui.hiroshima.jp",
"kumano.hiroshima.jp",
"kure.hiroshima.jp",
"mihara.hiroshima.jp",
"miyoshi.hiroshima.jp",
"naka.hiroshima.jp",
"onomichi.hiroshima.jp",
"osakikamijima.hiroshima.jp",
"otake.hiroshima.jp",
"saka.hiroshima.jp",
"sera.hiroshima.jp",
"seranishi.hiroshima.jp",
"shinichi.hiroshima.jp",
"shobara.hiroshima.jp",
"takehara.hiroshima.jp",
"abashiri.hokkaido.jp",
"abira.hokkaido.jp",
"aibetsu.hokkaido.jp",
"akabira.hokkaido.jp",
"akkeshi.hokkaido.jp",
"asahikawa.hokkaido.jp",
"ashibetsu.hokkaido.jp",
"ashoro.hokkaido.jp",
"assabu.hokkaido.jp",
"atsuma.hokkaido.jp",
"bibai.hokkaido.jp",
"biei.hokkaido.jp",
"bifuka.hokkaido.jp",
"bihoro.hokkaido.jp",
"biratori.hokkaido.jp",
"chippubetsu.hokkaido.jp",
"chitose.hokkaido.jp",
"date.hokkaido.jp",
"ebetsu.hokkaido.jp",
"embetsu.hokkaido.jp",
"eniwa.hokkaido.jp",
"erimo.hokkaido.jp",
"esan.hokkaido.jp",
"esashi.hokkaido.jp",
"fukagawa.hokkaido.jp",
"fukushima.hokkaido.jp",
"furano.hokkaido.jp",
"furubira.hokkaido.jp",
"haboro.hokkaido.jp",
"hakodate.hokkaido.jp",
"hamatonbetsu.hokkaido.jp",
"hidaka.hokkaido.jp",
"higashikagura.hokkaido.jp",
"higashikawa.hokkaido.jp",
"hiroo.hokkaido.jp",
"hokuryu.hokkaido.jp",
"hokuto.hokkaido.jp",
"honbetsu.hokkaido.jp",
"horokanai.hokkaido.jp",
"horonobe.hokkaido.jp",
"ikeda.hokkaido.jp",
"imakane.hokkaido.jp",
"ishikari.hokkaido.jp",
"iwamizawa.hokkaido.jp",
"iwanai.hokkaido.jp",
"kamifurano.hokkaido.jp",
"kamikawa.hokkaido.jp",
"kamishihoro.hokkaido.jp",
"kamisunagawa.hokkaido.jp",
"kamoenai.hokkaido.jp",
"kayabe.hokkaido.jp",
"kembuchi.hokkaido.jp",
"kikonai.hokkaido.jp",
"kimobetsu.hokkaido.jp",
"kitahiroshima.hokkaido.jp",
"kitami.hokkaido.jp",
"kiyosato.hokkaido.jp",
"koshimizu.hokkaido.jp",
"kunneppu.hokkaido.jp",
"kuriyama.hokkaido.jp",
"kuromatsunai.hokkaido.jp",
"kushiro.hokkaido.jp",
"kutchan.hokkaido.jp",
"kyowa.hokkaido.jp",
"mashike.hokkaido.jp",
"matsumae.hokkaido.jp",
"mikasa.hokkaido.jp",
"minamifurano.hokkaido.jp",
"mombetsu.hokkaido.jp",
"moseushi.hokkaido.jp",
"mukawa.hokkaido.jp",
"muroran.hokkaido.jp",
"naie.hokkaido.jp",
"nakagawa.hokkaido.jp",
"nakasatsunai.hokkaido.jp",
"nakatombetsu.hokkaido.jp",
"nanae.hokkaido.jp",
"nanporo.hokkaido.jp",
"nayoro.hokkaido.jp",
"nemuro.hokkaido.jp",
"niikappu.hokkaido.jp",
"niki.hokkaido.jp",
"nishiokoppe.hokkaido.jp",
"noboribetsu.hokkaido.jp",
"numata.hokkaido.jp",
"obihiro.hokkaido.jp",
"obira.hokkaido.jp",
"oketo.hokkaido.jp",
"okoppe.hokkaido.jp",
"otaru.hokkaido.jp",
"otobe.hokkaido.jp",
"otofuke.hokkaido.jp",
"otoineppu.hokkaido.jp",
"oumu.hokkaido.jp",
"ozora.hokkaido.jp",
"pippu.hokkaido.jp",
"rankoshi.hokkaido.jp",
"rebun.hokkaido.jp",
"rikubetsu.hokkaido.jp",
"rishiri.hokkaido.jp",
"rishirifuji.hokkaido.jp",
"saroma.hokkaido.jp",
"sarufutsu.hokkaido.jp",
"shakotan.hokkaido.jp",
"shari.hokkaido.jp",
"shibecha.hokkaido.jp",
"shibetsu.hokkaido.jp",
"shikabe.hokkaido.jp",
"shikaoi.hokkaido.jp",
"shimamaki.hokkaido.jp",
"shimizu.hokkaido.jp",
"shimokawa.hokkaido.jp",
"shinshinotsu.hokkaido.jp",
"shintoku.hokkaido.jp",
"shiranuka.hokkaido.jp",
"shiraoi.hokkaido.jp",
"shiriuchi.hokkaido.jp",
"sobetsu.hokkaido.jp",
"sunagawa.hokkaido.jp",
"taiki.hokkaido.jp",
"takasu.hokkaido.jp",
"takikawa.hokkaido.jp",
"takinoue.hokkaido.jp",
"teshikaga.hokkaido.jp",
"tobetsu.hokkaido.jp",
"tohma.hokkaido.jp",
"tomakomai.hokkaido.jp",
"tomari.hokkaido.jp",
"toya.hokkaido.jp",
"toyako.hokkaido.jp",
"toyotomi.hokkaido.jp",
"toyoura.hokkaido.jp",
"tsubetsu.hokkaido.jp",
"tsukigata.hokkaido.jp",
"urakawa.hokkaido.jp",
"urausu.hokkaido.jp",
"uryu.hokkaido.jp",
"utashinai.hokkaido.jp",
"wakkanai.hokkaido.jp",
"wassamu.hokkaido.jp",
"yakumo.hokkaido.jp",
"yoichi.hokkaido.jp",
"aioi.hyogo.jp",
"akashi.hyogo.jp",
"ako.hyogo.jp",
"amagasaki.hyogo.jp",
"aogaki.hyogo.jp",
"asago.hyogo.jp",
"ashiya.hyogo.jp",
"awaji.hyogo.jp",
"fukusaki.hyogo.jp",
"goshiki.hyogo.jp",
"harima.hyogo.jp",
"himeji.hyogo.jp",
"ichikawa.hyogo.jp",
"inagawa.hyogo.jp",
"itami.hyogo.jp",
"kakogawa.hyogo.jp",
"kamigori.hyogo.jp",
"kamikawa.hyogo.jp",
"kasai.hyogo.jp",
"kasuga.hyogo.jp",
"kawanishi.hyogo.jp",
"miki.hyogo.jp",
"minamiawaji.hyogo.jp",
"nishinomiya.hyogo.jp",
"nishiwaki.hyogo.jp",
"ono.hyogo.jp",
"sanda.hyogo.jp",
"sannan.hyogo.jp",
"sasayama.hyogo.jp",
"sayo.hyogo.jp",
"shingu.hyogo.jp",
"shinonsen.hyogo.jp",
"shiso.hyogo.jp",
"sumoto.hyogo.jp",
"taishi.hyogo.jp",
"taka.hyogo.jp",
"takarazuka.hyogo.jp",
"takasago.hyogo.jp",
"takino.hyogo.jp",
"tamba.hyogo.jp",
"tatsuno.hyogo.jp",
"toyooka.hyogo.jp",
"yabu.hyogo.jp",
"yashiro.hyogo.jp",
"yoka.hyogo.jp",
"yokawa.hyogo.jp",
"ami.ibaraki.jp",
"asahi.ibaraki.jp",
"bando.ibaraki.jp",
"chikusei.ibaraki.jp",
"daigo.ibaraki.jp",
"fujishiro.ibaraki.jp",
"hitachi.ibaraki.jp",
"hitachinaka.ibaraki.jp",
"hitachiomiya.ibaraki.jp",
"hitachiota.ibaraki.jp",
"ibaraki.ibaraki.jp",
"ina.ibaraki.jp",
"inashiki.ibaraki.jp",
"itako.ibaraki.jp",
"iwama.ibaraki.jp",
"joso.ibaraki.jp",
"kamisu.ibaraki.jp",
"kasama.ibaraki.jp",
"kashima.ibaraki.jp",
"kasumigaura.ibaraki.jp",
"koga.ibaraki.jp",
"miho.ibaraki.jp",
"mito.ibaraki.jp",
"moriya.ibaraki.jp",
"naka.ibaraki.jp",
"namegata.ibaraki.jp",
"oarai.ibaraki.jp",
"ogawa.ibaraki.jp",
"omitama.ibaraki.jp",
"ryugasaki.ibaraki.jp",
"sakai.ibaraki.jp",
"sakuragawa.ibaraki.jp",
"shimodate.ibaraki.jp",
"shimotsuma.ibaraki.jp",
"shirosato.ibaraki.jp",
"sowa.ibaraki.jp",
"suifu.ibaraki.jp",
"takahagi.ibaraki.jp",
"tamatsukuri.ibaraki.jp",
"tokai.ibaraki.jp",
"tomobe.ibaraki.jp",
"tone.ibaraki.jp",
"toride.ibaraki.jp",
"tsuchiura.ibaraki.jp",
"tsukuba.ibaraki.jp",
"uchihara.ibaraki.jp",
"ushiku.ibaraki.jp",
"yachiyo.ibaraki.jp",
"yamagata.ibaraki.jp",
"yawara.ibaraki.jp",
"yuki.ibaraki.jp",
"anamizu.ishikawa.jp",
"hakui.ishikawa.jp",
"hakusan.ishikawa.jp",
"kaga.ishikawa.jp",
"kahoku.ishikawa.jp",
"kanazawa.ishikawa.jp",
"kawakita.ishikawa.jp",
"komatsu.ishikawa.jp",
"nakanoto.ishikawa.jp",
"nanao.ishikawa.jp",
"nomi.ishikawa.jp",
"nonoichi.ishikawa.jp",
"noto.ishikawa.jp",
"shika.ishikawa.jp",
"suzu.ishikawa.jp",
"tsubata.ishikawa.jp",
"tsurugi.ishikawa.jp",
"uchinada.ishikawa.jp",
"wajima.ishikawa.jp",
"fudai.iwate.jp",
"fujisawa.iwate.jp",
"hanamaki.iwate.jp",
"hiraizumi.iwate.jp",
"hirono.iwate.jp",
"ichinohe.iwate.jp",
"ichinoseki.iwate.jp",
"iwaizumi.iwate.jp",
"iwate.iwate.jp",
"joboji.iwate.jp",
"kamaishi.iwate.jp",
"kanegasaki.iwate.jp",
"karumai.iwate.jp",
"kawai.iwate.jp",
"kitakami.iwate.jp",
"kuji.iwate.jp",
"kunohe.iwate.jp",
"kuzumaki.iwate.jp",
"miyako.iwate.jp",
"mizusawa.iwate.jp",
"morioka.iwate.jp",
"ninohe.iwate.jp",
"noda.iwate.jp",
"ofunato.iwate.jp",
"oshu.iwate.jp",
"otsuchi.iwate.jp",
"rikuzentakata.iwate.jp",
"shiwa.iwate.jp",
"shizukuishi.iwate.jp",
"sumita.iwate.jp",
"tanohata.iwate.jp",
"tono.iwate.jp",
"yahaba.iwate.jp",
"yamada.iwate.jp",
"ayagawa.kagawa.jp",
"higashikagawa.kagawa.jp",
"kanonji.kagawa.jp",
"kotohira.kagawa.jp",
"manno.kagawa.jp",
"marugame.kagawa.jp",
"mitoyo.kagawa.jp",
"naoshima.kagawa.jp",
"sanuki.kagawa.jp",
"tadotsu.kagawa.jp",
"takamatsu.kagawa.jp",
"tonosho.kagawa.jp",
"uchinomi.kagawa.jp",
"utazu.kagawa.jp",
"zentsuji.kagawa.jp",
"akune.kagoshima.jp",
"amami.kagoshima.jp",
"hioki.kagoshima.jp",
"isa.kagoshima.jp",
"isen.kagoshima.jp",
"izumi.kagoshima.jp",
"kagoshima.kagoshima.jp",
"kanoya.kagoshima.jp",
"kawanabe.kagoshima.jp",
"kinko.kagoshima.jp",
"kouyama.kagoshima.jp",
"makurazaki.kagoshima.jp",
"matsumoto.kagoshima.jp",
"minamitane.kagoshima.jp",
"nakatane.kagoshima.jp",
"nishinoomote.kagoshima.jp",
"satsumasendai.kagoshima.jp",
"soo.kagoshima.jp",
"tarumizu.kagoshima.jp",
"yusui.kagoshima.jp",
"aikawa.kanagawa.jp",
"atsugi.kanagawa.jp",
"ayase.kanagawa.jp",
"chigasaki.kanagawa.jp",
"ebina.kanagawa.jp",
"fujisawa.kanagawa.jp",
"hadano.kanagawa.jp",
"hakone.kanagawa.jp",
"hiratsuka.kanagawa.jp",
"isehara.kanagawa.jp",
"kaisei.kanagawa.jp",
"kamakura.kanagawa.jp",
"kiyokawa.kanagawa.jp",
"matsuda.kanagawa.jp",
"minamiashigara.kanagawa.jp",
"miura.kanagawa.jp",
"nakai.kanagawa.jp",
"ninomiya.kanagawa.jp",
"odawara.kanagawa.jp",
"oi.kanagawa.jp",
"oiso.kanagawa.jp",
"sagamihara.kanagawa.jp",
"samukawa.kanagawa.jp",
"tsukui.kanagawa.jp",
"yamakita.kanagawa.jp",
"yamato.kanagawa.jp",
"yokosuka.kanagawa.jp",
"yugawara.kanagawa.jp",
"zama.kanagawa.jp",
"zushi.kanagawa.jp",
"aki.kochi.jp",
"geisei.kochi.jp",
"hidaka.kochi.jp",
"higashitsuno.kochi.jp",
"ino.kochi.jp",
"kagami.kochi.jp",
"kami.kochi.jp",
"kitagawa.kochi.jp",
"kochi.kochi.jp",
"mihara.kochi.jp",
"motoyama.kochi.jp",
"muroto.kochi.jp",
"nahari.kochi.jp",
"nakamura.kochi.jp",
"nankoku.kochi.jp",
"nishitosa.kochi.jp",
"niyodogawa.kochi.jp",
"ochi.kochi.jp",
"okawa.kochi.jp",
"otoyo.kochi.jp",
"otsuki.kochi.jp",
"sakawa.kochi.jp",
"sukumo.kochi.jp",
"susaki.kochi.jp",
"tosa.kochi.jp",
"tosashimizu.kochi.jp",
"toyo.kochi.jp",
"tsuno.kochi.jp",
"umaji.kochi.jp",
"yasuda.kochi.jp",
"yusuhara.kochi.jp",
"amakusa.kumamoto.jp",
"arao.kumamoto.jp",
"aso.kumamoto.jp",
"choyo.kumamoto.jp",
"gyokuto.kumamoto.jp",
"kamiamakusa.kumamoto.jp",
"kikuchi.kumamoto.jp",
"kumamoto.kumamoto.jp",
"mashiki.kumamoto.jp",
"mifune.kumamoto.jp",
"minamata.kumamoto.jp",
"minamioguni.kumamoto.jp",
"nagasu.kumamoto.jp",
"nishihara.kumamoto.jp",
"oguni.kumamoto.jp",
"ozu.kumamoto.jp",
"sumoto.kumamoto.jp",
"takamori.kumamoto.jp",
"uki.kumamoto.jp",
"uto.kumamoto.jp",
"yamaga.kumamoto.jp",
"yamato.kumamoto.jp",
"yatsushiro.kumamoto.jp",
"ayabe.kyoto.jp",
"fukuchiyama.kyoto.jp",
"higashiyama.kyoto.jp",
"ide.kyoto.jp",
"ine.kyoto.jp",
"joyo.kyoto.jp",
"kameoka.kyoto.jp",
"kamo.kyoto.jp",
"kita.kyoto.jp",
"kizu.kyoto.jp",
"kumiyama.kyoto.jp",
"kyotamba.kyoto.jp",
"kyotanabe.kyoto.jp",
"kyotango.kyoto.jp",
"maizuru.kyoto.jp",
"minami.kyoto.jp",
"minamiyamashiro.kyoto.jp",
"miyazu.kyoto.jp",
"muko.kyoto.jp",
"nagaokakyo.kyoto.jp",
"nakagyo.kyoto.jp",
"nantan.kyoto.jp",
"oyamazaki.kyoto.jp",
"sakyo.kyoto.jp",
"seika.kyoto.jp",
"tanabe.kyoto.jp",
"uji.kyoto.jp",
"ujitawara.kyoto.jp",
"wazuka.kyoto.jp",
"yamashina.kyoto.jp",
"yawata.kyoto.jp",
"asahi.mie.jp",
"inabe.mie.jp",
"ise.mie.jp",
"kameyama.mie.jp",
"kawagoe.mie.jp",
"kiho.mie.jp",
"kisosaki.mie.jp",
"kiwa.mie.jp",
"komono.mie.jp",
"kumano.mie.jp",
"kuwana.mie.jp",
"matsusaka.mie.jp",
"meiwa.mie.jp",
"mihama.mie.jp",
"minamiise.mie.jp",
"misugi.mie.jp",
"miyama.mie.jp",
"nabari.mie.jp",
"shima.mie.jp",
"suzuka.mie.jp",
"tado.mie.jp",
"taiki.mie.jp",
"taki.mie.jp",
"tamaki.mie.jp",
"toba.mie.jp",
"tsu.mie.jp",
"udono.mie.jp",
"ureshino.mie.jp",
"watarai.mie.jp",
"yokkaichi.mie.jp",
"furukawa.miyagi.jp",
"higashimatsushima.miyagi.jp",
"ishinomaki.miyagi.jp",
"iwanuma.miyagi.jp",
"kakuda.miyagi.jp",
"kami.miyagi.jp",
"kawasaki.miyagi.jp",
"marumori.miyagi.jp",
"matsushima.miyagi.jp",
"minamisanriku.miyagi.jp",
"misato.miyagi.jp",
"murata.miyagi.jp",
"natori.miyagi.jp",
"ogawara.miyagi.jp",
"ohira.miyagi.jp",
"onagawa.miyagi.jp",
"osaki.miyagi.jp",
"rifu.miyagi.jp",
"semine.miyagi.jp",
"shibata.miyagi.jp",
"shichikashuku.miyagi.jp",
"shikama.miyagi.jp",
"shiogama.miyagi.jp",
"shiroishi.miyagi.jp",
"tagajo.miyagi.jp",
"taiwa.miyagi.jp",
"tome.miyagi.jp",
"tomiya.miyagi.jp",
"wakuya.miyagi.jp",
"watari.miyagi.jp",
"yamamoto.miyagi.jp",
"zao.miyagi.jp",
"aya.miyazaki.jp",
"ebino.miyazaki.jp",
"gokase.miyazaki.jp",
"hyuga.miyazaki.jp",
"kadogawa.miyazaki.jp",
"kawaminami.miyazaki.jp",
"kijo.miyazaki.jp",
"kitagawa.miyazaki.jp",
"kitakata.miyazaki.jp",
"kitaura.miyazaki.jp",
"kobayashi.miyazaki.jp",
"kunitomi.miyazaki.jp",
"kushima.miyazaki.jp",
"mimata.miyazaki.jp",
"miyakonojo.miyazaki.jp",
"miyazaki.miyazaki.jp",
"morotsuka.miyazaki.jp",
"nichinan.miyazaki.jp",
"nishimera.miyazaki.jp",
"nobeoka.miyazaki.jp",
"saito.miyazaki.jp",
"shiiba.miyazaki.jp",
"shintomi.miyazaki.jp",
"takaharu.miyazaki.jp",
"takanabe.miyazaki.jp",
"takazaki.miyazaki.jp",
"tsuno.miyazaki.jp",
"achi.nagano.jp",
"agematsu.nagano.jp",
"anan.nagano.jp",
"aoki.nagano.jp",
"asahi.nagano.jp",
"azumino.nagano.jp",
"chikuhoku.nagano.jp",
"chikuma.nagano.jp",
"chino.nagano.jp",
"fujimi.nagano.jp",
"hakuba.nagano.jp",
"hara.nagano.jp",
"hiraya.nagano.jp",
"iida.nagano.jp",
"iijima.nagano.jp",
"iiyama.nagano.jp",
"iizuna.nagano.jp",
"ikeda.nagano.jp",
"ikusaka.nagano.jp",
"ina.nagano.jp",
"karuizawa.nagano.jp",
"kawakami.nagano.jp",
"kiso.nagano.jp",
"kisofukushima.nagano.jp",
"kitaaiki.nagano.jp",
"komagane.nagano.jp",
"komoro.nagano.jp",
"matsukawa.nagano.jp",
"matsumoto.nagano.jp",
"miasa.nagano.jp",
"minamiaiki.nagano.jp",
"minamimaki.nagano.jp",
"minamiminowa.nagano.jp",
"minowa.nagano.jp",
"miyada.nagano.jp",
"miyota.nagano.jp",
"mochizuki.nagano.jp",
"nagano.nagano.jp",
"nagawa.nagano.jp",
"nagiso.nagano.jp",
"nakagawa.nagano.jp",
"nakano.nagano.jp",
"nozawaonsen.nagano.jp",
"obuse.nagano.jp",
"ogawa.nagano.jp",
"okaya.nagano.jp",
"omachi.nagano.jp",
"omi.nagano.jp",
"ookuwa.nagano.jp",
"ooshika.nagano.jp",
"otaki.nagano.jp",
"otari.nagano.jp",
"sakae.nagano.jp",
"sakaki.nagano.jp",
"saku.nagano.jp",
"sakuho.nagano.jp",
"shimosuwa.nagano.jp",
"shinanomachi.nagano.jp",
"shiojiri.nagano.jp",
"suwa.nagano.jp",
"suzaka.nagano.jp",
"takagi.nagano.jp",
"takamori.nagano.jp",
"takayama.nagano.jp",
"tateshina.nagano.jp",
"tatsuno.nagano.jp",
"togakushi.nagano.jp",
"togura.nagano.jp",
"tomi.nagano.jp",
"ueda.nagano.jp",
"wada.nagano.jp",
"yamagata.nagano.jp",
"yamanouchi.nagano.jp",
"yasaka.nagano.jp",
"yasuoka.nagano.jp",
"chijiwa.nagasaki.jp",
"futsu.nagasaki.jp",
"goto.nagasaki.jp",
"hasami.nagasaki.jp",
"hirado.nagasaki.jp",
"iki.nagasaki.jp",
"isahaya.nagasaki.jp",
"kawatana.nagasaki.jp",
"kuchinotsu.nagasaki.jp",
"matsuura.nagasaki.jp",
"nagasaki.nagasaki.jp",
"obama.nagasaki.jp",
"omura.nagasaki.jp",
"oseto.nagasaki.jp",
"saikai.nagasaki.jp",
"sasebo.nagasaki.jp",
"seihi.nagasaki.jp",
"shimabara.nagasaki.jp",
"shinkamigoto.nagasaki.jp",
"togitsu.nagasaki.jp",
"tsushima.nagasaki.jp",
"unzen.nagasaki.jp",
"ando.nara.jp",
"gose.nara.jp",
"heguri.nara.jp",
"higashiyoshino.nara.jp",
"ikaruga.nara.jp",
"ikoma.nara.jp",
"kamikitayama.nara.jp",
"kanmaki.nara.jp",
"kashiba.nara.jp",
"kashihara.nara.jp",
"katsuragi.nara.jp",
"kawai.nara.jp",
"kawakami.nara.jp",
"kawanishi.nara.jp",
"koryo.nara.jp",
"kurotaki.nara.jp",
"mitsue.nara.jp",
"miyake.nara.jp",
"nara.nara.jp",
"nosegawa.nara.jp",
"oji.nara.jp",
"ouda.nara.jp",
"oyodo.nara.jp",
"sakurai.nara.jp",
"sango.nara.jp",
"shimoichi.nara.jp",
"shimokitayama.nara.jp",
"shinjo.nara.jp",
"soni.nara.jp",
"takatori.nara.jp",
"tawaramoto.nara.jp",
"tenkawa.nara.jp",
"tenri.nara.jp",
"uda.nara.jp",
"yamatokoriyama.nara.jp",
"yamatotakada.nara.jp",
"yamazoe.nara.jp",
"yoshino.nara.jp",
"aga.niigata.jp",
"agano.niigata.jp",
"gosen.niigata.jp",
"itoigawa.niigata.jp",
"izumozaki.niigata.jp",
"joetsu.niigata.jp",
"kamo.niigata.jp",
"kariwa.niigata.jp",
"kashiwazaki.niigata.jp",
"minamiuonuma.niigata.jp",
"mitsuke.niigata.jp",
"muika.niigata.jp",
"murakami.niigata.jp",
"myoko.niigata.jp",
"nagaoka.niigata.jp",
"niigata.niigata.jp",
"ojiya.niigata.jp",
"omi.niigata.jp",
"sado.niigata.jp",
"sanjo.niigata.jp",
"seiro.niigata.jp",
"seirou.niigata.jp",
"sekikawa.niigata.jp",
"shibata.niigata.jp",
"tagami.niigata.jp",
"tainai.niigata.jp",
"tochio.niigata.jp",
"tokamachi.niigata.jp",
"tsubame.niigata.jp",
"tsunan.niigata.jp",
"uonuma.niigata.jp",
"yahiko.niigata.jp",
"yoita.niigata.jp",
"yuzawa.niigata.jp",
"beppu.oita.jp",
"bungoono.oita.jp",
"bungotakada.oita.jp",
"hasama.oita.jp",
"hiji.oita.jp",
"himeshima.oita.jp",
"hita.oita.jp",
"kamitsue.oita.jp",
"kokonoe.oita.jp",
"kuju.oita.jp",
"kunisaki.oita.jp",
"kusu.oita.jp",
"oita.oita.jp",
"saiki.oita.jp",
"taketa.oita.jp",
"tsukumi.oita.jp",
"usa.oita.jp",
"usuki.oita.jp",
"yufu.oita.jp",
"akaiwa.okayama.jp",
"asakuchi.okayama.jp",
"bizen.okayama.jp",
"hayashima.okayama.jp",
"ibara.okayama.jp",
"kagamino.okayama.jp",
"kasaoka.okayama.jp",
"kibichuo.okayama.jp",
"kumenan.okayama.jp",
"kurashiki.okayama.jp",
"maniwa.okayama.jp",
"misaki.okayama.jp",
"nagi.okayama.jp",
"niimi.okayama.jp",
"nishiawakura.okayama.jp",
"okayama.okayama.jp",
"satosho.okayama.jp",
"setouchi.okayama.jp",
"shinjo.okayama.jp",
"shoo.okayama.jp",
"soja.okayama.jp",
"takahashi.okayama.jp",
"tamano.okayama.jp",
"tsuyama.okayama.jp",
"wake.okayama.jp",
"yakage.okayama.jp",
"aguni.okinawa.jp",
"ginowan.okinawa.jp",
"ginoza.okinawa.jp",
"gushikami.okinawa.jp",
"haebaru.okinawa.jp",
"higashi.okinawa.jp",
"hirara.okinawa.jp",
"iheya.okinawa.jp",
"ishigaki.okinawa.jp",
"ishikawa.okinawa.jp",
"itoman.okinawa.jp",
"izena.okinawa.jp",
"kadena.okinawa.jp",
"kin.okinawa.jp",
"kitadaito.okinawa.jp",
"kitanakagusuku.okinawa.jp",
"kumejima.okinawa.jp",
"kunigami.okinawa.jp",
"minamidaito.okinawa.jp",
"motobu.okinawa.jp",
"nago.okinawa.jp",
"naha.okinawa.jp",
"nakagusuku.okinawa.jp",
"nakijin.okinawa.jp",
"nanjo.okinawa.jp",
"nishihara.okinawa.jp",
"ogimi.okinawa.jp",
"okinawa.okinawa.jp",
"onna.okinawa.jp",
"shimoji.okinawa.jp",
"taketomi.okinawa.jp",
"tarama.okinawa.jp",
"tokashiki.okinawa.jp",
"tomigusuku.okinawa.jp",
"tonaki.okinawa.jp",
"urasoe.okinawa.jp",
"uruma.okinawa.jp",
"yaese.okinawa.jp",
"yomitan.okinawa.jp",
"yonabaru.okinawa.jp",
"yonaguni.okinawa.jp",
"zamami.okinawa.jp",
"abeno.osaka.jp",
"chihayaakasaka.osaka.jp",
"chuo.osaka.jp",
"daito.osaka.jp",
"fujiidera.osaka.jp",
"habikino.osaka.jp",
"hannan.osaka.jp",
"higashiosaka.osaka.jp",
"higashisumiyoshi.osaka.jp",
"higashiyodogawa.osaka.jp",
"hirakata.osaka.jp",
"ibaraki.osaka.jp",
"ikeda.osaka.jp",
"izumi.osaka.jp",
"izumiotsu.osaka.jp",
"izumisano.osaka.jp",
"kadoma.osaka.jp",
"kaizuka.osaka.jp",
"kanan.osaka.jp",
"kashiwara.osaka.jp",
"katano.osaka.jp",
"kawachinagano.osaka.jp",
"kishiwada.osaka.jp",
"kita.osaka.jp",
"kumatori.osaka.jp",
"matsubara.osaka.jp",
"minato.osaka.jp",
"minoh.osaka.jp",
"misaki.osaka.jp",
"moriguchi.osaka.jp",
"neyagawa.osaka.jp",
"nishi.osaka.jp",
"nose.osaka.jp",
"osakasayama.osaka.jp",
"sakai.osaka.jp",
"sayama.osaka.jp",
"sennan.osaka.jp",
"settsu.osaka.jp",
"shijonawate.osaka.jp",
"shimamoto.osaka.jp",
"suita.osaka.jp",
"tadaoka.osaka.jp",
"taishi.osaka.jp",
"tajiri.osaka.jp",
"takaishi.osaka.jp",
"takatsuki.osaka.jp",
"tondabayashi.osaka.jp",
"toyonaka.osaka.jp",
"toyono.osaka.jp",
"yao.osaka.jp",
"ariake.saga.jp",
"arita.saga.jp",
"fukudomi.saga.jp",
"genkai.saga.jp",
"hamatama.saga.jp",
"hizen.saga.jp",
"imari.saga.jp",
"kamimine.saga.jp",
"kanzaki.saga.jp",
"karatsu.saga.jp",
"kashima.saga.jp",
"kitagata.saga.jp",
"kitahata.saga.jp",
"kiyama.saga.jp",
"kouhoku.saga.jp",
"kyuragi.saga.jp",
"nishiarita.saga.jp",
"ogi.saga.jp",
"omachi.saga.jp",
"ouchi.saga.jp",
"saga.saga.jp",
"shiroishi.saga.jp",
"taku.saga.jp",
"tara.saga.jp",
"tosu.saga.jp",
"yoshinogari.saga.jp",
"arakawa.saitama.jp",
"asaka.saitama.jp",
"chichibu.saitama.jp",
"fujimi.saitama.jp",
"fujimino.saitama.jp",
"fukaya.saitama.jp",
"hanno.saitama.jp",
"hanyu.saitama.jp",
"hasuda.saitama.jp",
"hatogaya.saitama.jp",
"hatoyama.saitama.jp",
"hidaka.saitama.jp",
"higashichichibu.saitama.jp",
"higashimatsuyama.saitama.jp",
"honjo.saitama.jp",
"ina.saitama.jp",
"iruma.saitama.jp",
"iwatsuki.saitama.jp",
"kamiizumi.saitama.jp",
"kamikawa.saitama.jp",
"kamisato.saitama.jp",
"kasukabe.saitama.jp",
"kawagoe.saitama.jp",
"kawaguchi.saitama.jp",
"kawajima.saitama.jp",
"kazo.saitama.jp",
"kitamoto.saitama.jp",
"koshigaya.saitama.jp",
"kounosu.saitama.jp",
"kuki.saitama.jp",
"kumagaya.saitama.jp",
"matsubushi.saitama.jp",
"minano.saitama.jp",
"misato.saitama.jp",
"miyashiro.saitama.jp",
"miyoshi.saitama.jp",
"moroyama.saitama.jp",
"nagatoro.saitama.jp",
"namegawa.saitama.jp",
"niiza.saitama.jp",
"ogano.saitama.jp",
"ogawa.saitama.jp",
"ogose.saitama.jp",
"okegawa.saitama.jp",
"omiya.saitama.jp",
"otaki.saitama.jp",
"ranzan.saitama.jp",
"ryokami.saitama.jp",
"saitama.saitama.jp",
"sakado.saitama.jp",
"satte.saitama.jp",
"sayama.saitama.jp",
"shiki.saitama.jp",
"shiraoka.saitama.jp",
"soka.saitama.jp",
"sugito.saitama.jp",
"toda.saitama.jp",
"tokigawa.saitama.jp",
"tokorozawa.saitama.jp",
"tsurugashima.saitama.jp",
"urawa.saitama.jp",
"warabi.saitama.jp",
"yashio.saitama.jp",
"yokoze.saitama.jp",
"yono.saitama.jp",
"yorii.saitama.jp",
"yoshida.saitama.jp",
"yoshikawa.saitama.jp",
"yoshimi.saitama.jp",
"aisho.shiga.jp",
"gamo.shiga.jp",
"higashiomi.shiga.jp",
"hikone.shiga.jp",
"koka.shiga.jp",
"konan.shiga.jp",
"kosei.shiga.jp",
"koto.shiga.jp",
"kusatsu.shiga.jp",
"maibara.shiga.jp",
"moriyama.shiga.jp",
"nagahama.shiga.jp",
"nishiazai.shiga.jp",
"notogawa.shiga.jp",
"omihachiman.shiga.jp",
"otsu.shiga.jp",
"ritto.shiga.jp",
"ryuoh.shiga.jp",
"takashima.shiga.jp",
"takatsuki.shiga.jp",
"torahime.shiga.jp",
"toyosato.shiga.jp",
"yasu.shiga.jp",
"akagi.shimane.jp",
"ama.shimane.jp",
"gotsu.shimane.jp",
"hamada.shimane.jp",
"higashiizumo.shimane.jp",
"hikawa.shimane.jp",
"hikimi.shimane.jp",
"izumo.shimane.jp",
"kakinoki.shimane.jp",
"masuda.shimane.jp",
"matsue.shimane.jp",
"misato.shimane.jp",
"nishinoshima.shimane.jp",
"ohda.shimane.jp",
"okinoshima.shimane.jp",
"okuizumo.shimane.jp",
"shimane.shimane.jp",
"tamayu.shimane.jp",
"tsuwano.shimane.jp",
"unnan.shimane.jp",
"yakumo.shimane.jp",
"yasugi.shimane.jp",
"yatsuka.shimane.jp",
"arai.shizuoka.jp",
"atami.shizuoka.jp",
"fuji.shizuoka.jp",
"fujieda.shizuoka.jp",
"fujikawa.shizuoka.jp",
"fujinomiya.shizuoka.jp",
"fukuroi.shizuoka.jp",
"gotemba.shizuoka.jp",
"haibara.shizuoka.jp",
"hamamatsu.shizuoka.jp",
"higashiizu.shizuoka.jp",
"ito.shizuoka.jp",
"iwata.shizuoka.jp",
"izu.shizuoka.jp",
"izunokuni.shizuoka.jp",
"kakegawa.shizuoka.jp",
"kannami.shizuoka.jp",
"kawanehon.shizuoka.jp",
"kawazu.shizuoka.jp",
"kikugawa.shizuoka.jp",
"kosai.shizuoka.jp",
"makinohara.shizuoka.jp",
"matsuzaki.shizuoka.jp",
"minamiizu.shizuoka.jp",
"mishima.shizuoka.jp",
"morimachi.shizuoka.jp",
"nishiizu.shizuoka.jp",
"numazu.shizuoka.jp",
"omaezaki.shizuoka.jp",
"shimada.shizuoka.jp",
"shimizu.shizuoka.jp",
"shimoda.shizuoka.jp",
"shizuoka.shizuoka.jp",
"susono.shizuoka.jp",
"yaizu.shizuoka.jp",
"yoshida.shizuoka.jp",
"ashikaga.tochigi.jp",
"bato.tochigi.jp",
"haga.tochigi.jp",
"ichikai.tochigi.jp",
"iwafune.tochigi.jp",
"kaminokawa.tochigi.jp",
"kanuma.tochigi.jp",
"karasuyama.tochigi.jp",
"kuroiso.tochigi.jp",
"mashiko.tochigi.jp",
"mibu.tochigi.jp",
"moka.tochigi.jp",
"motegi.tochigi.jp",
"nasu.tochigi.jp",
"nasushiobara.tochigi.jp",
"nikko.tochigi.jp",
"nishikata.tochigi.jp",
"nogi.tochigi.jp",
"ohira.tochigi.jp",
"ohtawara.tochigi.jp",
"oyama.tochigi.jp",
"sakura.tochigi.jp",
"sano.tochigi.jp",
"shimotsuke.tochigi.jp",
"shioya.tochigi.jp",
"takanezawa.tochigi.jp",
"tochigi.tochigi.jp",
"tsuga.tochigi.jp",
"ujiie.tochigi.jp",
"utsunomiya.tochigi.jp",
"yaita.tochigi.jp",
"aizumi.tokushima.jp",
"anan.tokushima.jp",
"ichiba.tokushima.jp",
"itano.tokushima.jp",
"kainan.tokushima.jp",
"komatsushima.tokushima.jp",
"matsushige.tokushima.jp",
"mima.tokushima.jp",
"minami.tokushima.jp",
"miyoshi.tokushima.jp",
"mugi.tokushima.jp",
"nakagawa.tokushima.jp",
"naruto.tokushima.jp",
"sanagochi.tokushima.jp",
"shishikui.tokushima.jp",
"tokushima.tokushima.jp",
"wajiki.tokushima.jp",
"adachi.tokyo.jp",
"akiruno.tokyo.jp",
"akishima.tokyo.jp",
"aogashima.tokyo.jp",
"arakawa.tokyo.jp",
"bunkyo.tokyo.jp",
"chiyoda.tokyo.jp",
"chofu.tokyo.jp",
"chuo.tokyo.jp",
"edogawa.tokyo.jp",
"fuchu.tokyo.jp",
"fussa.tokyo.jp",
"hachijo.tokyo.jp",
"hachioji.tokyo.jp",
"hamura.tokyo.jp",
"higashikurume.tokyo.jp",
"higashimurayama.tokyo.jp",
"higashiyamato.tokyo.jp",
"hino.tokyo.jp",
"hinode.tokyo.jp",
"hinohara.tokyo.jp",
"inagi.tokyo.jp",
"itabashi.tokyo.jp",
"katsushika.tokyo.jp",
"kita.tokyo.jp",
"kiyose.tokyo.jp",
"kodaira.tokyo.jp",
"koganei.tokyo.jp",
"kokubunji.tokyo.jp",
"komae.tokyo.jp",
"koto.tokyo.jp",
"kouzushima.tokyo.jp",
"kunitachi.tokyo.jp",
"machida.tokyo.jp",
"meguro.tokyo.jp",
"minato.tokyo.jp",
"mitaka.tokyo.jp",
"mizuho.tokyo.jp",
"musashimurayama.tokyo.jp",
"musashino.tokyo.jp",
"nakano.tokyo.jp",
"nerima.tokyo.jp",
"ogasawara.tokyo.jp",
"okutama.tokyo.jp",
"ome.tokyo.jp",
"oshima.tokyo.jp",
"ota.tokyo.jp",
"setagaya.tokyo.jp",
"shibuya.tokyo.jp",
"shinagawa.tokyo.jp",
"shinjuku.tokyo.jp",
"suginami.tokyo.jp",
"sumida.tokyo.jp",
"tachikawa.tokyo.jp",
"taito.tokyo.jp",
"tama.tokyo.jp",
"toshima.tokyo.jp",
"chizu.tottori.jp",
"hino.tottori.jp",
"kawahara.tottori.jp",
"koge.tottori.jp",
"kotoura.tottori.jp",
"misasa.tottori.jp",
"nanbu.tottori.jp",
"nichinan.tottori.jp",
"sakaiminato.tottori.jp",
"tottori.tottori.jp",
"wakasa.tottori.jp",
"yazu.tottori.jp",
"yonago.tottori.jp",
"asahi.toyama.jp",
"fuchu.toyama.jp",
"fukumitsu.toyama.jp",
"funahashi.toyama.jp",
"himi.toyama.jp",
"imizu.toyama.jp",
"inami.toyama.jp",
"johana.toyama.jp",
"kamiichi.toyama.jp",
"kurobe.toyama.jp",
"nakaniikawa.toyama.jp",
"namerikawa.toyama.jp",
"nanto.toyama.jp",
"nyuzen.toyama.jp",
"oyabe.toyama.jp",
"taira.toyama.jp",
"takaoka.toyama.jp",
"tateyama.toyama.jp",
"toga.toyama.jp",
"tonami.toyama.jp",
"toyama.toyama.jp",
"unazuki.toyama.jp",
"uozu.toyama.jp",
"yamada.toyama.jp",
"arida.wakayama.jp",
"aridagawa.wakayama.jp",
"gobo.wakayama.jp",
"hashimoto.wakayama.jp",
"hidaka.wakayama.jp",
"hirogawa.wakayama.jp",
"inami.wakayama.jp",
"iwade.wakayama.jp",
"kainan.wakayama.jp",
"kamitonda.wakayama.jp",
"katsuragi.wakayama.jp",
"kimino.wakayama.jp",
"kinokawa.wakayama.jp",
"kitayama.wakayama.jp",
"koya.wakayama.jp",
"koza.wakayama.jp",
"kozagawa.wakayama.jp",
"kudoyama.wakayama.jp",
"kushimoto.wakayama.jp",
"mihama.wakayama.jp",
"misato.wakayama.jp",
"nachikatsuura.wakayama.jp",
"shingu.wakayama.jp",
"shirahama.wakayama.jp",
"taiji.wakayama.jp",
"tanabe.wakayama.jp",
"wakayama.wakayama.jp",
"yuasa.wakayama.jp",
"yura.wakayama.jp",
"asahi.yamagata.jp",
"funagata.yamagata.jp",
"higashine.yamagata.jp",
"iide.yamagata.jp",
"kahoku.yamagata.jp",
"kaminoyama.yamagata.jp",
"kaneyama.yamagata.jp",
"kawanishi.yamagata.jp",
"mamurogawa.yamagata.jp",
"mikawa.yamagata.jp",
"murayama.yamagata.jp",
"nagai.yamagata.jp",
"nakayama.yamagata.jp",
"nanyo.yamagata.jp",
"nishikawa.yamagata.jp",
"obanazawa.yamagata.jp",
"oe.yamagata.jp",
"oguni.yamagata.jp",
"ohkura.yamagata.jp",
"oishida.yamagata.jp",
"sagae.yamagata.jp",
"sakata.yamagata.jp",
"sakegawa.yamagata.jp",
"shinjo.yamagata.jp",
"shirataka.yamagata.jp",
"shonai.yamagata.jp",
"takahata.yamagata.jp",
"tendo.yamagata.jp",
"tozawa.yamagata.jp",
"tsuruoka.yamagata.jp",
"yamagata.yamagata.jp",
"yamanobe.yamagata.jp",
"yonezawa.yamagata.jp",
"yuza.yamagata.jp",
"abu.yamaguchi.jp",
"hagi.yamaguchi.jp",
"hikari.yamaguchi.jp",
"hofu.yamaguchi.jp",
"iwakuni.yamaguchi.jp",
"kudamatsu.yamaguchi.jp",
"mitou.yamaguchi.jp",
"nagato.yamaguchi.jp",
"oshima.yamaguchi.jp",
"shimonoseki.yamaguchi.jp",
"shunan.yamaguchi.jp",
"tabuse.yamaguchi.jp",
"tokuyama.yamaguchi.jp",
"toyota.yamaguchi.jp",
"ube.yamaguchi.jp",
"yuu.yamaguchi.jp",
"chuo.yamanashi.jp",
"doshi.yamanashi.jp",
"fuefuki.yamanashi.jp",
"fujikawa.yamanashi.jp",
"fujikawaguchiko.yamanashi.jp",
"fujiyoshida.yamanashi.jp",
"hayakawa.yamanashi.jp",
"hokuto.yamanashi.jp",
"ichikawamisato.yamanashi.jp",
"kai.yamanashi.jp",
"kofu.yamanashi.jp",
"koshu.yamanashi.jp",
"kosuge.yamanashi.jp",
"minami-alps.yamanashi.jp",
"minobu.yamanashi.jp",
"nakamichi.yamanashi.jp",
"nanbu.yamanashi.jp",
"narusawa.yamanashi.jp",
"nirasaki.yamanashi.jp",
"nishikatsura.yamanashi.jp",
"oshino.yamanashi.jp",
"otsuki.yamanashi.jp",
"showa.yamanashi.jp",
"tabayama.yamanashi.jp",
"tsuru.yamanashi.jp",
"uenohara.yamanashi.jp",
"yamanakako.yamanashi.jp",
"yamanashi.yamanashi.jp",
"ke",
"ac.ke",
"co.ke",
"go.ke",
"info.ke",
"me.ke",
"mobi.ke",
"ne.ke",
"or.ke",
"sc.ke",
"kg",
"org.kg",
"net.kg",
"com.kg",
"edu.kg",
"gov.kg",
"mil.kg",
"*.kh",
"ki",
"edu.ki",
"biz.ki",
"net.ki",
"org.ki",
"gov.ki",
"info.ki",
"com.ki",
"km",
"org.km",
"nom.km",
"gov.km",
"prd.km",
"tm.km",
"edu.km",
"mil.km",
"ass.km",
"com.km",
"coop.km",
"asso.km",
"presse.km",
"medecin.km",
"notaires.km",
"pharmaciens.km",
"veterinaire.km",
"gouv.km",
"kn",
"net.kn",
"org.kn",
"edu.kn",
"gov.kn",
"kp",
"com.kp",
"edu.kp",
"gov.kp",
"org.kp",
"rep.kp",
"tra.kp",
"kr",
"ac.kr",
"co.kr",
"es.kr",
"go.kr",
"hs.kr",
"kg.kr",
"mil.kr",
"ms.kr",
"ne.kr",
"or.kr",
"pe.kr",
"re.kr",
"sc.kr",
"busan.kr",
"chungbuk.kr",
"chungnam.kr",
"daegu.kr",
"daejeon.kr",
"gangwon.kr",
"gwangju.kr",
"gyeongbuk.kr",
"gyeonggi.kr",
"gyeongnam.kr",
"incheon.kr",
"jeju.kr",
"jeonbuk.kr",
"jeonnam.kr",
"seoul.kr",
"ulsan.kr",
"kw",
"com.kw",
"edu.kw",
"emb.kw",
"gov.kw",
"ind.kw",
"net.kw",
"org.kw",
"ky",
"edu.ky",
"gov.ky",
"com.ky",
"org.ky",
"net.ky",
"kz",
"org.kz",
"edu.kz",
"net.kz",
"gov.kz",
"mil.kz",
"com.kz",
"la",
"int.la",
"net.la",
"info.la",
"edu.la",
"gov.la",
"per.la",
"com.la",
"org.la",
"lb",
"com.lb",
"edu.lb",
"gov.lb",
"net.lb",
"org.lb",
"lc",
"com.lc",
"net.lc",
"co.lc",
"org.lc",
"edu.lc",
"gov.lc",
"li",
"lk",
"gov.lk",
"sch.lk",
"net.lk",
"int.lk",
"com.lk",
"org.lk",
"edu.lk",
"ngo.lk",
"soc.lk",
"web.lk",
"ltd.lk",
"assn.lk",
"grp.lk",
"hotel.lk",
"ac.lk",
"lr",
"com.lr",
"edu.lr",
"gov.lr",
"org.lr",
"net.lr",
"ls",
"ac.ls",
"biz.ls",
"co.ls",
"edu.ls",
"gov.ls",
"info.ls",
"net.ls",
"org.ls",
"sc.ls",
"lt",
"gov.lt",
"lu",
"lv",
"com.lv",
"edu.lv",
"gov.lv",
"org.lv",
"mil.lv",
"id.lv",
"net.lv",
"asn.lv",
"conf.lv",
"ly",
"com.ly",
"net.ly",
"gov.ly",
"plc.ly",
"edu.ly",
"sch.ly",
"med.ly",
"org.ly",
"id.ly",
"ma",
"co.ma",
"net.ma",
"gov.ma",
"org.ma",
"ac.ma",
"press.ma",
"mc",
"tm.mc",
"asso.mc",
"md",
"me",
"co.me",
"net.me",
"org.me",
"edu.me",
"ac.me",
"gov.me",
"its.me",
"priv.me",
"mg",
"org.mg",
"nom.mg",
"gov.mg",
"prd.mg",
"tm.mg",
"edu.mg",
"mil.mg",
"com.mg",
"co.mg",
"mh",
"mil",
"mk",
"com.mk",
"org.mk",
"net.mk",
"edu.mk",
"gov.mk",
"inf.mk",
"name.mk",
"ml",
"com.ml",
"edu.ml",
"gouv.ml",
"gov.ml",
"net.ml",
"org.ml",
"presse.ml",
"*.mm",
"mn",
"gov.mn",
"edu.mn",
"org.mn",
"mo",
"com.mo",
"net.mo",
"org.mo",
"edu.mo",
"gov.mo",
"mobi",
"mp",
"mq",
"mr",
"gov.mr",
"ms",
"com.ms",
"edu.ms",
"gov.ms",
"net.ms",
"org.ms",
"mt",
"com.mt",
"edu.mt",
"net.mt",
"org.mt",
"mu",
"com.mu",
"net.mu",
"org.mu",
"gov.mu",
"ac.mu",
"co.mu",
"or.mu",
"museum",
"academy.museum",
"agriculture.museum",
"air.museum",
"airguard.museum",
"alabama.museum",
"alaska.museum",
"amber.museum",
"ambulance.museum",
"american.museum",
"americana.museum",
"americanantiques.museum",
"americanart.museum",
"amsterdam.museum",
"and.museum",
"annefrank.museum",
"anthro.museum",
"anthropology.museum",
"antiques.museum",
"aquarium.museum",
"arboretum.museum",
"archaeological.museum",
"archaeology.museum",
"architecture.museum",
"art.museum",
"artanddesign.museum",
"artcenter.museum",
"artdeco.museum",
"arteducation.museum",
"artgallery.museum",
"arts.museum",
"artsandcrafts.museum",
"asmatart.museum",
"assassination.museum",
"assisi.museum",
"association.museum",
"astronomy.museum",
"atlanta.museum",
"austin.museum",
"australia.museum",
"automotive.museum",
"aviation.museum",
"axis.museum",
"badajoz.museum",
"baghdad.museum",
"bahn.museum",
"bale.museum",
"baltimore.museum",
"barcelona.museum",
"baseball.museum",
"basel.museum",
"baths.museum",
"bauern.museum",
"beauxarts.museum",
"beeldengeluid.museum",
"bellevue.museum",
"bergbau.museum",
"berkeley.museum",
"berlin.museum",
"bern.museum",
"bible.museum",
"bilbao.museum",
"bill.museum",
"birdart.museum",
"birthplace.museum",
"bonn.museum",
"boston.museum",
"botanical.museum",
"botanicalgarden.museum",
"botanicgarden.museum",
"botany.museum",
"brandywinevalley.museum",
"brasil.museum",
"bristol.museum",
"british.museum",
"britishcolumbia.museum",
"broadcast.museum",
"brunel.museum",
"brussel.museum",
"brussels.museum",
"bruxelles.museum",
"building.museum",
"burghof.museum",
"bus.museum",
"bushey.museum",
"cadaques.museum",
"california.museum",
"cambridge.museum",
"can.museum",
"canada.museum",
"capebreton.museum",
"carrier.museum",
"cartoonart.museum",
"casadelamoneda.museum",
"castle.museum",
"castres.museum",
"celtic.museum",
"center.museum",
"chattanooga.museum",
"cheltenham.museum",
"chesapeakebay.museum",
"chicago.museum",
"children.museum",
"childrens.museum",
"childrensgarden.museum",
"chiropractic.museum",
"chocolate.museum",
"christiansburg.museum",
"cincinnati.museum",
"cinema.museum",
"circus.museum",
"civilisation.museum",
"civilization.museum",
"civilwar.museum",
"clinton.museum",
"clock.museum",
"coal.museum",
"coastaldefence.museum",
"cody.museum",
"coldwar.museum",
"collection.museum",
"colonialwilliamsburg.museum",
"coloradoplateau.museum",
"columbia.museum",
"columbus.museum",
"communication.museum",
"communications.museum",
"community.museum",
"computer.museum",
"computerhistory.museum",
"comunicações.museum",
"contemporary.museum",
"contemporaryart.museum",
"convent.museum",
"copenhagen.museum",
"corporation.museum",
"correios-e-telecomunicações.museum",
"corvette.museum",
"costume.museum",
"countryestate.museum",
"county.museum",
"crafts.museum",
"cranbrook.museum",
"creation.museum",
"cultural.museum",
"culturalcenter.museum",
"culture.museum",
"cyber.museum",
"cymru.museum",
"dali.museum",
"dallas.museum",
"database.museum",
"ddr.museum",
"decorativearts.museum",
"delaware.museum",
"delmenhorst.museum",
"denmark.museum",
"depot.museum",
"design.museum",
"detroit.museum",
"dinosaur.museum",
"discovery.museum",
"dolls.museum",
"donostia.museum",
"durham.museum",
"eastafrica.museum",
"eastcoast.museum",
"education.museum",
"educational.museum",
"egyptian.museum",
"eisenbahn.museum",
"elburg.museum",
"elvendrell.museum",
"embroidery.museum",
"encyclopedic.museum",
"england.museum",
"entomology.museum",
"environment.museum",
"environmentalconservation.museum",
"epilepsy.museum",
"essex.museum",
"estate.museum",
"ethnology.museum",
"exeter.museum",
"exhibition.museum",
"family.museum",
"farm.museum",
"farmequipment.museum",
"farmers.museum",
"farmstead.museum",
"field.museum",
"figueres.museum",
"filatelia.museum",
"film.museum",
"fineart.museum",
"finearts.museum",
"finland.museum",
"flanders.museum",
"florida.museum",
"force.museum",
"fortmissoula.museum",
"fortworth.museum",
"foundation.museum",
"francaise.museum",
"frankfurt.museum",
"franziskaner.museum",
"freemasonry.museum",
"freiburg.museum",
"fribourg.museum",
"frog.museum",
"fundacio.museum",
"furniture.museum",
"gallery.museum",
"garden.museum",
"gateway.museum",
"geelvinck.museum",
"gemological.museum",
"geology.museum",
"georgia.museum",
"giessen.museum",
"glas.museum",
"glass.museum",
"gorge.museum",
"grandrapids.museum",
"graz.museum",
"guernsey.museum",
"halloffame.museum",
"hamburg.museum",
"handson.museum",
"harvestcelebration.museum",
"hawaii.museum",
"health.museum",
"heimatunduhren.museum",
"hellas.museum",
"helsinki.museum",
"hembygdsforbund.museum",
"heritage.museum",
"histoire.museum",
"historical.museum",
"historicalsociety.museum",
"historichouses.museum",
"historisch.museum",
"historisches.museum",
"history.museum",
"historyofscience.museum",
"horology.museum",
"house.museum",
"humanities.museum",
"illustration.museum",
"imageandsound.museum",
"indian.museum",
"indiana.museum",
"indianapolis.museum",
"indianmarket.museum",
"intelligence.museum",
"interactive.museum",
"iraq.museum",
"iron.museum",
"isleofman.museum",
"jamison.museum",
"jefferson.museum",
"jerusalem.museum",
"jewelry.museum",
"jewish.museum",
"jewishart.museum",
"jfk.museum",
"journalism.museum",
"judaica.museum",
"judygarland.museum",
"juedisches.museum",
"juif.museum",
"karate.museum",
"karikatur.museum",
"kids.museum",
"koebenhavn.museum",
"koeln.museum",
"kunst.museum",
"kunstsammlung.museum",
"kunstunddesign.museum",
"labor.museum",
"labour.museum",
"lajolla.museum",
"lancashire.museum",
"landes.museum",
"lans.museum",
"läns.museum",
"larsson.museum",
"lewismiller.museum",
"lincoln.museum",
"linz.museum",
"living.museum",
"livinghistory.museum",
"localhistory.museum",
"london.museum",
"losangeles.museum",
"louvre.museum",
"loyalist.museum",
"lucerne.museum",
"luxembourg.museum",
"luzern.museum",
"mad.museum",
"madrid.museum",
"mallorca.museum",
"manchester.museum",
"mansion.museum",
"mansions.museum",
"manx.museum",
"marburg.museum",
"maritime.museum",
"maritimo.museum",
"maryland.museum",
"marylhurst.museum",
"media.museum",
"medical.museum",
"medizinhistorisches.museum",
"meeres.museum",
"memorial.museum",
"mesaverde.museum",
"michigan.museum",
"midatlantic.museum",
"military.museum",
"mill.museum",
"miners.museum",
"mining.museum",
"minnesota.museum",
"missile.museum",
"missoula.museum",
"modern.museum",
"moma.museum",
"money.museum",
"monmouth.museum",
"monticello.museum",
"montreal.museum",
"moscow.museum",
"motorcycle.museum",
"muenchen.museum",
"muenster.museum",
"mulhouse.museum",
"muncie.museum",
"museet.museum",
"museumcenter.museum",
"museumvereniging.museum",
"music.museum",
"national.museum",
"nationalfirearms.museum",
"nationalheritage.museum",
"nativeamerican.museum",
"naturalhistory.museum",
"naturalhistorymuseum.museum",
"naturalsciences.museum",
"nature.museum",
"naturhistorisches.museum",
"natuurwetenschappen.museum",
"naumburg.museum",
"naval.museum",
"nebraska.museum",
"neues.museum",
"newhampshire.museum",
"newjersey.museum",
"newmexico.museum",
"newport.museum",
"newspaper.museum",
"newyork.museum",
"niepce.museum",
"norfolk.museum",
"north.museum",
"nrw.museum",
"nyc.museum",
"nyny.museum",
"oceanographic.museum",
"oceanographique.museum",
"omaha.museum",
"online.museum",
"ontario.museum",
"openair.museum",
"oregon.museum",
"oregontrail.museum",
"otago.museum",
"oxford.museum",
"pacific.museum",
"paderborn.museum",
"palace.museum",
"paleo.museum",
"palmsprings.museum",
"panama.museum",
"paris.museum",
"pasadena.museum",
"pharmacy.museum",
"philadelphia.museum",
"philadelphiaarea.museum",
"philately.museum",
"phoenix.museum",
"photography.museum",
"pilots.museum",
"pittsburgh.museum",
"planetarium.museum",
"plantation.museum",
"plants.museum",
"plaza.museum",
"portal.museum",
"portland.museum",
"portlligat.museum",
"posts-and-telecommunications.museum",
"preservation.museum",
"presidio.museum",
"press.museum",
"project.museum",
"public.museum",
"pubol.museum",
"quebec.museum",
"railroad.museum",
"railway.museum",
"research.museum",
"resistance.museum",
"riodejaneiro.museum",
"rochester.museum",
"rockart.museum",
"roma.museum",
"russia.museum",
"saintlouis.museum",
"salem.museum",
"salvadordali.museum",
"salzburg.museum",
"sandiego.museum",
"sanfrancisco.museum",
"santabarbara.museum",
"santacruz.museum",
"santafe.museum",
"saskatchewan.museum",
"satx.museum",
"savannahga.museum",
"schlesisches.museum",
"schoenbrunn.museum",
"schokoladen.museum",
"school.museum",
"schweiz.museum",
"science.museum",
"scienceandhistory.museum",
"scienceandindustry.museum",
"sciencecenter.museum",
"sciencecenters.museum",
"science-fiction.museum",
"sciencehistory.museum",
"sciences.museum",
"sciencesnaturelles.museum",
"scotland.museum",
"seaport.museum",
"settlement.museum",
"settlers.museum",
"shell.museum",
"sherbrooke.museum",
"sibenik.museum",
"silk.museum",
"ski.museum",
"skole.museum",
"society.museum",
"sologne.museum",
"soundandvision.museum",
"southcarolina.museum",
"southwest.museum",
"space.museum",
"spy.museum",
"square.museum",
"stadt.museum",
"stalbans.museum",
"starnberg.museum",
"state.museum",
"stateofdelaware.museum",
"station.museum",
"steam.museum",
"steiermark.museum",
"stjohn.museum",
"stockholm.museum",
"stpetersburg.museum",
"stuttgart.museum",
"suisse.museum",
"surgeonshall.museum",
"surrey.museum",
"svizzera.museum",
"sweden.museum",
"sydney.museum",
"tank.museum",
"tcm.museum",
"technology.museum",
"telekommunikation.museum",
"television.museum",
"texas.museum",
"textile.museum",
"theater.museum",
"time.museum",
"timekeeping.museum",
"topology.museum",
"torino.museum",
"touch.museum",
"town.museum",
"transport.museum",
"tree.museum",
"trolley.museum",
"trust.museum",
"trustee.museum",
"uhren.museum",
"ulm.museum",
"undersea.museum",
"university.museum",
"usa.museum",
"usantiques.museum",
"usarts.museum",
"uscountryestate.museum",
"usculture.museum",
"usdecorativearts.museum",
"usgarden.museum",
"ushistory.museum",
"ushuaia.museum",
"uslivinghistory.museum",
"utah.museum",
"uvic.museum",
"valley.museum",
"vantaa.museum",
"versailles.museum",
"viking.museum",
"village.museum",
"virginia.museum",
"virtual.museum",
"virtuel.museum",
"vlaanderen.museum",
"volkenkunde.museum",
"wales.museum",
"wallonie.museum",
"war.museum",
"washingtondc.museum",
"watchandclock.museum",
"watch-and-clock.museum",
"western.museum",
"westfalen.museum",
"whaling.museum",
"wildlife.museum",
"williamsburg.museum",
"windmill.museum",
"workshop.museum",
"york.museum",
"yorkshire.museum",
"yosemite.museum",
"youth.museum",
"zoological.museum",
"zoology.museum",
"ירושלים.museum",
"иком.museum",
"mv",
"aero.mv",
"biz.mv",
"com.mv",
"coop.mv",
"edu.mv",
"gov.mv",
"info.mv",
"int.mv",
"mil.mv",
"museum.mv",
"name.mv",
"net.mv",
"org.mv",
"pro.mv",
"mw",
"ac.mw",
"biz.mw",
"co.mw",
"com.mw",
"coop.mw",
"edu.mw",
"gov.mw",
"int.mw",
"museum.mw",
"net.mw",
"org.mw",
"mx",
"com.mx",
"org.mx",
"gob.mx",
"edu.mx",
"net.mx",
"my",
"com.my",
"net.my",
"org.my",
"gov.my",
"edu.my",
"mil.my",
"name.my",
"mz",
"ac.mz",
"adv.mz",
"co.mz",
"edu.mz",
"gov.mz",
"mil.mz",
"net.mz",
"org.mz",
"na",
"info.na",
"pro.na",
"name.na",
"school.na",
"or.na",
"dr.na",
"us.na",
"mx.na",
"ca.na",
"in.na",
"cc.na",
"tv.na",
"ws.na",
"mobi.na",
"co.na",
"com.na",
"org.na",
"name",
"nc",
"asso.nc",
"nom.nc",
"ne",
"net",
"nf",
"com.nf",
"net.nf",
"per.nf",
"rec.nf",
"web.nf",
"arts.nf",
"firm.nf",
"info.nf",
"other.nf",
"store.nf",
"ng",
"com.ng",
"edu.ng",
"gov.ng",
"i.ng",
"mil.ng",
"mobi.ng",
"name.ng",
"net.ng",
"org.ng",
"sch.ng",
"ni",
"ac.ni",
"biz.ni",
"co.ni",
"com.ni",
"edu.ni",
"gob.ni",
"in.ni",
"info.ni",
"int.ni",
"mil.ni",
"net.ni",
"nom.ni",
"org.ni",
"web.ni",
"nl",
"no",
"fhs.no",
"vgs.no",
"fylkesbibl.no",
"folkebibl.no",
"museum.no",
"idrett.no",
"priv.no",
"mil.no",
"stat.no",
"dep.no",
"kommune.no",
"herad.no",
"aa.no",
"ah.no",
"bu.no",
"fm.no",
"hl.no",
"hm.no",
"jan-mayen.no",
"mr.no",
"nl.no",
"nt.no",
"of.no",
"ol.no",
"oslo.no",
"rl.no",
"sf.no",
"st.no",
"svalbard.no",
"tm.no",
"tr.no",
"va.no",
"vf.no",
"gs.aa.no",
"gs.ah.no",
"gs.bu.no",
"gs.fm.no",
"gs.hl.no",
"gs.hm.no",
"gs.jan-mayen.no",
"gs.mr.no",
"gs.nl.no",
"gs.nt.no",
"gs.of.no",
"gs.ol.no",
"gs.oslo.no",
"gs.rl.no",
"gs.sf.no",
"gs.st.no",
"gs.svalbard.no",
"gs.tm.no",
"gs.tr.no",
"gs.va.no",
"gs.vf.no",
"akrehamn.no",
"åkrehamn.no",
"algard.no",
"ålgård.no",
"arna.no",
"brumunddal.no",
"bryne.no",
"bronnoysund.no",
"brønnøysund.no",
"drobak.no",
"drøbak.no",
"egersund.no",
"fetsund.no",
"floro.no",
"florø.no",
"fredrikstad.no",
"hokksund.no",
"honefoss.no",
"hønefoss.no",
"jessheim.no",
"jorpeland.no",
"jørpeland.no",
"kirkenes.no",
"kopervik.no",
"krokstadelva.no",
"langevag.no",
"langevåg.no",
"leirvik.no",
"mjondalen.no",
"mjøndalen.no",
"mo-i-rana.no",
"mosjoen.no",
"mosjøen.no",
"nesoddtangen.no",
"orkanger.no",
"osoyro.no",
"osøyro.no",
"raholt.no",
"råholt.no",
"sandnessjoen.no",
"sandnessjøen.no",
"skedsmokorset.no",
"slattum.no",
"spjelkavik.no",
"stathelle.no",
"stavern.no",
"stjordalshalsen.no",
"stjørdalshalsen.no",
"tananger.no",
"tranby.no",
"vossevangen.no",
"afjord.no",
"åfjord.no",
"agdenes.no",
"al.no",
"ål.no",
"alesund.no",
"ålesund.no",
"alstahaug.no",
"alta.no",
"áltá.no",
"alaheadju.no",
"álaheadju.no",
"alvdal.no",
"amli.no",
"åmli.no",
"amot.no",
"åmot.no",
"andebu.no",
"andoy.no",
"andøy.no",
"andasuolo.no",
"ardal.no",
"årdal.no",
"aremark.no",
"arendal.no",
"ås.no",
"aseral.no",
"åseral.no",
"asker.no",
"askim.no",
"askvoll.no",
"askoy.no",
"askøy.no",
"asnes.no",
"åsnes.no",
"audnedaln.no",
"aukra.no",
"aure.no",
"aurland.no",
"aurskog-holand.no",
"aurskog-høland.no",
"austevoll.no",
"austrheim.no",
"averoy.no",
"averøy.no",
"balestrand.no",
"ballangen.no",
"balat.no",
"bálát.no",
"balsfjord.no",
"bahccavuotna.no",
"báhccavuotna.no",
"bamble.no",
"bardu.no",
"beardu.no",
"beiarn.no",
"bajddar.no",
"bájddar.no",
"baidar.no",
"báidár.no",
"berg.no",
"bergen.no",
"berlevag.no",
"berlevåg.no",
"bearalvahki.no",
"bearalváhki.no",
"bindal.no",
"birkenes.no",
"bjarkoy.no",
"bjarkøy.no",
"bjerkreim.no",
"bjugn.no",
"bodo.no",
"bodø.no",
"badaddja.no",
"bådåddjå.no",
"budejju.no",
"bokn.no",
"bremanger.no",
"bronnoy.no",
"brønnøy.no",
"bygland.no",
"bykle.no",
"barum.no",
"bærum.no",
"bo.telemark.no",
"bø.telemark.no",
"bo.nordland.no",
"bø.nordland.no",
"bievat.no",
"bievát.no",
"bomlo.no",
"bømlo.no",
"batsfjord.no",
"båtsfjord.no",
"bahcavuotna.no",
"báhcavuotna.no",
"dovre.no",
"drammen.no",
"drangedal.no",
"dyroy.no",
"dyrøy.no",
"donna.no",
"dønna.no",
"eid.no",
"eidfjord.no",
"eidsberg.no",
"eidskog.no",
"eidsvoll.no",
"eigersund.no",
"elverum.no",
"enebakk.no",
"engerdal.no",
"etne.no",
"etnedal.no",
"evenes.no",
"evenassi.no",
"evenášši.no",
"evje-og-hornnes.no",
"farsund.no",
"fauske.no",
"fuossko.no",
"fuoisku.no",
"fedje.no",
"fet.no",
"finnoy.no",
"finnøy.no",
"fitjar.no",
"fjaler.no",
"fjell.no",
"flakstad.no",
"flatanger.no",
"flekkefjord.no",
"flesberg.no",
"flora.no",
"fla.no",
"flå.no",
"folldal.no",
"forsand.no",
"fosnes.no",
"frei.no",
"frogn.no",
"froland.no",
"frosta.no",
"frana.no",
"fræna.no",
"froya.no",
"frøya.no",
"fusa.no",
"fyresdal.no",
"forde.no",
"førde.no",
"gamvik.no",
"gangaviika.no",
"gáŋgaviika.no",
"gaular.no",
"gausdal.no",
"gildeskal.no",
"gildeskål.no",
"giske.no",
"gjemnes.no",
"gjerdrum.no",
"gjerstad.no",
"gjesdal.no",
"gjovik.no",
"gjøvik.no",
"gloppen.no",
"gol.no",
"gran.no",
"grane.no",
"granvin.no",
"gratangen.no",
"grimstad.no",
"grong.no",
"kraanghke.no",
"kråanghke.no",
"grue.no",
"gulen.no",
"hadsel.no",
"halden.no",
"halsa.no",
"hamar.no",
"hamaroy.no",
"habmer.no",
"hábmer.no",
"hapmir.no",
"hápmir.no",
"hammerfest.no",
"hammarfeasta.no",
"hámmárfeasta.no",
"haram.no",
"hareid.no",
"harstad.no",
"hasvik.no",
"aknoluokta.no",
"ákŋoluokta.no",
"hattfjelldal.no",
"aarborte.no",
"haugesund.no",
"hemne.no",
"hemnes.no",
"hemsedal.no",
"heroy.more-og-romsdal.no",
"herøy.møre-og-romsdal.no",
"heroy.nordland.no",
"herøy.nordland.no",
"hitra.no",
"hjartdal.no",
"hjelmeland.no",
"hobol.no",
"hobøl.no",
"hof.no",
"hol.no",
"hole.no",
"holmestrand.no",
"holtalen.no",
"holtålen.no",
"hornindal.no",
"horten.no",
"hurdal.no",
"hurum.no",
"hvaler.no",
"hyllestad.no",
"hagebostad.no",
"hægebostad.no",
"hoyanger.no",
"høyanger.no",
"hoylandet.no",
"høylandet.no",
"ha.no",
"hå.no",
"ibestad.no",
"inderoy.no",
"inderøy.no",
"iveland.no",
"jevnaker.no",
"jondal.no",
"jolster.no",
"jølster.no",
"karasjok.no",
"karasjohka.no",
"kárášjohka.no",
"karlsoy.no",
"galsa.no",
"gálsá.no",
"karmoy.no",
"karmøy.no",
"kautokeino.no",
"guovdageaidnu.no",
"klepp.no",
"klabu.no",
"klæbu.no",
"kongsberg.no",
"kongsvinger.no",
"kragero.no",
"kragerø.no",
"kristiansand.no",
"kristiansund.no",
"krodsherad.no",
"krødsherad.no",
"kvalsund.no",
"rahkkeravju.no",
"ráhkkerávju.no",
"kvam.no",
"kvinesdal.no",
"kvinnherad.no",
"kviteseid.no",
"kvitsoy.no",
"kvitsøy.no",
"kvafjord.no",
"kvæfjord.no",
"giehtavuoatna.no",
"kvanangen.no",
"kvænangen.no",
"navuotna.no",
"návuotna.no",
"kafjord.no",
"kåfjord.no",
"gaivuotna.no",
"gáivuotna.no",
"larvik.no",
"lavangen.no",
"lavagis.no",
"loabat.no",
"loabát.no",
"lebesby.no",
"davvesiida.no",
"leikanger.no",
"leirfjord.no",
"leka.no",
"leksvik.no",
"lenvik.no",
"leangaviika.no",
"leaŋgaviika.no",
"lesja.no",
"levanger.no",
"lier.no",
"lierne.no",
"lillehammer.no",
"lillesand.no",
"lindesnes.no",
"lindas.no",
"lindås.no",
"lom.no",
"loppa.no",
"lahppi.no",
"láhppi.no",
"lund.no",
"lunner.no",
"luroy.no",
"lurøy.no",
"luster.no",
"lyngdal.no",
"lyngen.no",
"ivgu.no",
"lardal.no",
"lerdal.no",
"lærdal.no",
"lodingen.no",
"lødingen.no",
"lorenskog.no",
"lørenskog.no",
"loten.no",
"løten.no",
"malvik.no",
"masoy.no",
"måsøy.no",
"muosat.no",
"muosát.no",
"mandal.no",
"marker.no",
"marnardal.no",
"masfjorden.no",
"meland.no",
"meldal.no",
"melhus.no",
"meloy.no",
"meløy.no",
"meraker.no",
"meråker.no",
"moareke.no",
"moåreke.no",
"midsund.no",
"midtre-gauldal.no",
"modalen.no",
"modum.no",
"molde.no",
"moskenes.no",
"moss.no",
"mosvik.no",
"malselv.no",
"målselv.no",
"malatvuopmi.no",
"málatvuopmi.no",
"namdalseid.no",
"aejrie.no",
"namsos.no",
"namsskogan.no",
"naamesjevuemie.no",
"nååmesjevuemie.no",
"laakesvuemie.no",
"nannestad.no",
"narvik.no",
"narviika.no",
"naustdal.no",
"nedre-eiker.no",
"nes.akershus.no",
"nes.buskerud.no",
"nesna.no",
"nesodden.no",
"nesseby.no",
"unjarga.no",
"unjárga.no",
"nesset.no",
"nissedal.no",
"nittedal.no",
"nord-aurdal.no",
"nord-fron.no",
"nord-odal.no",
"norddal.no",
"nordkapp.no",
"davvenjarga.no",
"davvenjárga.no",
"nordre-land.no",
"nordreisa.no",
"raisa.no",
"ráisa.no",
"nore-og-uvdal.no",
"notodden.no",
"naroy.no",
"nærøy.no",
"notteroy.no",
"nøtterøy.no",
"odda.no",
"oksnes.no",
"øksnes.no",
"oppdal.no",
"oppegard.no",
"oppegård.no",
"orkdal.no",
"orland.no",
"ørland.no",
"orskog.no",
"ørskog.no",
"orsta.no",
"ørsta.no",
"os.hedmark.no",
"os.hordaland.no",
"osen.no",
"osteroy.no",
"osterøy.no",
"ostre-toten.no",
"østre-toten.no",
"overhalla.no",
"ovre-eiker.no",
"øvre-eiker.no",
"oyer.no",
"øyer.no",
"oygarden.no",
"øygarden.no",
"oystre-slidre.no",
"øystre-slidre.no",
"porsanger.no",
"porsangu.no",
"porsáŋgu.no",
"porsgrunn.no",
"radoy.no",
"radøy.no",
"rakkestad.no",
"rana.no",
"ruovat.no",
"randaberg.no",
"rauma.no",
"rendalen.no",
"rennebu.no",
"rennesoy.no",
"rennesøy.no",
"rindal.no",
"ringebu.no",
"ringerike.no",
"ringsaker.no",
"rissa.no",
"risor.no",
"risør.no",
"roan.no",
"rollag.no",
"rygge.no",
"ralingen.no",
"rælingen.no",
"rodoy.no",
"rødøy.no",
"romskog.no",
"rømskog.no",
"roros.no",
"røros.no",
"rost.no",
"røst.no",
"royken.no",
"røyken.no",
"royrvik.no",
"røyrvik.no",
"rade.no",
"råde.no",
"salangen.no",
"siellak.no",
"saltdal.no",
"salat.no",
"sálát.no",
"sálat.no",
"samnanger.no",
"sande.more-og-romsdal.no",
"sande.møre-og-romsdal.no",
"sande.vestfold.no",
"sandefjord.no",
"sandnes.no",
"sandoy.no",
"sandøy.no",
"sarpsborg.no",
"sauda.no",
"sauherad.no",
"sel.no",
"selbu.no",
"selje.no",
"seljord.no",
"sigdal.no",
"siljan.no",
"sirdal.no",
"skaun.no",
"skedsmo.no",
"ski.no",
"skien.no",
"skiptvet.no",
"skjervoy.no",
"skjervøy.no",
"skierva.no",
"skiervá.no",
"skjak.no",
"skjåk.no",
"skodje.no",
"skanland.no",
"skånland.no",
"skanit.no",
"skánit.no",
"smola.no",
"smøla.no",
"snillfjord.no",
"snasa.no",
"snåsa.no",
"snoasa.no",
"snaase.no",
"snåase.no",
"sogndal.no",
"sokndal.no",
"sola.no",
"solund.no",
"songdalen.no",
"sortland.no",
"spydeberg.no",
"stange.no",
"stavanger.no",
"steigen.no",
"steinkjer.no",
"stjordal.no",
"stjørdal.no",
"stokke.no",
"stor-elvdal.no",
"stord.no",
"stordal.no",
"storfjord.no",
"omasvuotna.no",
"strand.no",
"stranda.no",
"stryn.no",
"sula.no",
"suldal.no",
"sund.no",
"sunndal.no",
"surnadal.no",
"sveio.no",
"svelvik.no",
"sykkylven.no",
"sogne.no",
"søgne.no",
"somna.no",
"sømna.no",
"sondre-land.no",
"søndre-land.no",
"sor-aurdal.no",
"sør-aurdal.no",
"sor-fron.no",
"sør-fron.no",
"sor-odal.no",
"sør-odal.no",
"sor-varanger.no",
"sør-varanger.no",
"matta-varjjat.no",
"mátta-várjjat.no",
"sorfold.no",
"sørfold.no",
"sorreisa.no",
"sørreisa.no",
"sorum.no",
"sørum.no",
"tana.no",
"deatnu.no",
"time.no",
"tingvoll.no",
"tinn.no",
"tjeldsund.no",
"dielddanuorri.no",
"tjome.no",
"tjøme.no",
"tokke.no",
"tolga.no",
"torsken.no",
"tranoy.no",
"tranøy.no",
"tromso.no",
"tromsø.no",
"tromsa.no",
"romsa.no",
"trondheim.no",
"troandin.no",
"trysil.no",
"trana.no",
"træna.no",
"trogstad.no",
"trøgstad.no",
"tvedestrand.no",
"tydal.no",
"tynset.no",
"tysfjord.no",
"divtasvuodna.no",
"divttasvuotna.no",
"tysnes.no",
"tysvar.no",
"tysvær.no",
"tonsberg.no",
"tønsberg.no",
"ullensaker.no",
"ullensvang.no",
"ulvik.no",
"utsira.no",
"vadso.no",
"vadsø.no",
"cahcesuolo.no",
"čáhcesuolo.no",
"vaksdal.no",
"valle.no",
"vang.no",
"vanylven.no",
"vardo.no",
"vardø.no",
"varggat.no",
"várggát.no",
"vefsn.no",
"vaapste.no",
"vega.no",
"vegarshei.no",
"vegårshei.no",
"vennesla.no",
"verdal.no",
"verran.no",
"vestby.no",
"vestnes.no",
"vestre-slidre.no",
"vestre-toten.no",
"vestvagoy.no",
"vestvågøy.no",
"vevelstad.no",
"vik.no",
"vikna.no",
"vindafjord.no",
"volda.no",
"voss.no",
"varoy.no",
"værøy.no",
"vagan.no",
"vågan.no",
"voagat.no",
"vagsoy.no",
"vågsøy.no",
"vaga.no",
"vågå.no",
"valer.ostfold.no",
"våler.østfold.no",
"valer.hedmark.no",
"våler.hedmark.no",
"*.np",
"nr",
"biz.nr",
"info.nr",
"gov.nr",
"edu.nr",
"org.nr",
"net.nr",
"com.nr",
"nu",
"nz",
"ac.nz",
"co.nz",
"cri.nz",
"geek.nz",
"gen.nz",
"govt.nz",
"health.nz",
"iwi.nz",
"kiwi.nz",
"maori.nz",
"mil.nz",
"māori.nz",
"net.nz",
"org.nz",
"parliament.nz",
"school.nz",
"om",
"co.om",
"com.om",
"edu.om",
"gov.om",
"med.om",
"museum.om",
"net.om",
"org.om",
"pro.om",
"onion",
"org",
"pa",
"ac.pa",
"gob.pa",
"com.pa",
"org.pa",
"sld.pa",
"edu.pa",
"net.pa",
"ing.pa",
"abo.pa",
"med.pa",
"nom.pa",
"pe",
"edu.pe",
"gob.pe",
"nom.pe",
"mil.pe",
"org.pe",
"com.pe",
"net.pe",
"pf",
"com.pf",
"org.pf",
"edu.pf",
"*.pg",
"ph",
"com.ph",
"net.ph",
"org.ph",
"gov.ph",
"edu.ph",
"ngo.ph",
"mil.ph",
"i.ph",
"pk",
"com.pk",
"net.pk",
"edu.pk",
"org.pk",
"fam.pk",
"biz.pk",
"web.pk",
"gov.pk",
"gob.pk",
"gok.pk",
"gon.pk",
"gop.pk",
"gos.pk",
"info.pk",
"pl",
"com.pl",
"net.pl",
"org.pl",
"aid.pl",
"agro.pl",
"atm.pl",
"auto.pl",
"biz.pl",
"edu.pl",
"gmina.pl",
"gsm.pl",
"info.pl",
"mail.pl",
"miasta.pl",
"media.pl",
"mil.pl",
"nieruchomosci.pl",
"nom.pl",
"pc.pl",
"powiat.pl",
"priv.pl",
"realestate.pl",
"rel.pl",
"sex.pl",
"shop.pl",
"sklep.pl",
"sos.pl",
"szkola.pl",
"targi.pl",
"tm.pl",
"tourism.pl",
"travel.pl",
"turystyka.pl",
"gov.pl",
"ap.gov.pl",
"ic.gov.pl",
"is.gov.pl",
"us.gov.pl",
"kmpsp.gov.pl",
"kppsp.gov.pl",
"kwpsp.gov.pl",
"psp.gov.pl",
"wskr.gov.pl",
"kwp.gov.pl",
"mw.gov.pl",
"ug.gov.pl",
"um.gov.pl",
"umig.gov.pl",
"ugim.gov.pl",
"upow.gov.pl",
"uw.gov.pl",
"starostwo.gov.pl",
"pa.gov.pl",
"po.gov.pl",
"psse.gov.pl",
"pup.gov.pl",
"rzgw.gov.pl",
"sa.gov.pl",
"so.gov.pl",
"sr.gov.pl",
"wsa.gov.pl",
"sko.gov.pl",
"uzs.gov.pl",
"wiih.gov.pl",
"winb.gov.pl",
"pinb.gov.pl",
"wios.gov.pl",
"witd.gov.pl",
"wzmiuw.gov.pl",
"piw.gov.pl",
"wiw.gov.pl",
"griw.gov.pl",
"wif.gov.pl",
"oum.gov.pl",
"sdn.gov.pl",
"zp.gov.pl",
"uppo.gov.pl",
"mup.gov.pl",
"wuoz.gov.pl",
"konsulat.gov.pl",
"oirm.gov.pl",
"augustow.pl",
"babia-gora.pl",
"bedzin.pl",
"beskidy.pl",
"bialowieza.pl",
"bialystok.pl",
"bielawa.pl",
"bieszczady.pl",
"boleslawiec.pl",
"bydgoszcz.pl",
"bytom.pl",
"cieszyn.pl",
"czeladz.pl",
"czest.pl",
"dlugoleka.pl",
"elblag.pl",
"elk.pl",
"glogow.pl",
"gniezno.pl",
"gorlice.pl",
"grajewo.pl",
"ilawa.pl",
"jaworzno.pl",
"jelenia-gora.pl",
"jgora.pl",
"kalisz.pl",
"kazimierz-dolny.pl",
"karpacz.pl",
"kartuzy.pl",
"kaszuby.pl",
"katowice.pl",
"kepno.pl",
"ketrzyn.pl",
"klodzko.pl",
"kobierzyce.pl",
"kolobrzeg.pl",
"konin.pl",
"konskowola.pl",
"kutno.pl",
"lapy.pl",
"lebork.pl",
"legnica.pl",
"lezajsk.pl",
"limanowa.pl",
"lomza.pl",
"lowicz.pl",
"lubin.pl",
"lukow.pl",
"malbork.pl",
"malopolska.pl",
"mazowsze.pl",
"mazury.pl",
"mielec.pl",
"mielno.pl",
"mragowo.pl",
"naklo.pl",
"nowaruda.pl",
"nysa.pl",
"olawa.pl",
"olecko.pl",
"olkusz.pl",
"olsztyn.pl",
"opoczno.pl",
"opole.pl",
"ostroda.pl",
"ostroleka.pl",
"ostrowiec.pl",
"ostrowwlkp.pl",
"pila.pl",
"pisz.pl",
"podhale.pl",
"podlasie.pl",
"polkowice.pl",
"pomorze.pl",
"pomorskie.pl",
"prochowice.pl",
"pruszkow.pl",
"przeworsk.pl",
"pulawy.pl",
"radom.pl",
"rawa-maz.pl",
"rybnik.pl",
"rzeszow.pl",
"sanok.pl",
"sejny.pl",
"slask.pl",
"slupsk.pl",
"sosnowiec.pl",
"stalowa-wola.pl",
"skoczow.pl",
"starachowice.pl",
"stargard.pl",
"suwalki.pl",
"swidnica.pl",
"swiebodzin.pl",
"swinoujscie.pl",
"szczecin.pl",
"szczytno.pl",
"tarnobrzeg.pl",
"tgory.pl",
"turek.pl",
"tychy.pl",
"ustka.pl",
"walbrzych.pl",
"warmia.pl",
"warszawa.pl",
"waw.pl",
"wegrow.pl",
"wielun.pl",
"wlocl.pl",
"wloclawek.pl",
"wodzislaw.pl",
"wolomin.pl",
"wroclaw.pl",
"zachpomor.pl",
"zagan.pl",
"zarow.pl",
"zgora.pl",
"zgorzelec.pl",
"pm",
"pn",
"gov.pn",
"co.pn",
"org.pn",
"edu.pn",
"net.pn",
"post",
"pr",
"com.pr",
"net.pr",
"org.pr",
"gov.pr",
"edu.pr",
"isla.pr",
"pro.pr",
"biz.pr",
"info.pr",
"name.pr",
"est.pr",
"prof.pr",
"ac.pr",
"pro",
"aaa.pro",
"aca.pro",
"acct.pro",
"avocat.pro",
"bar.pro",
"cpa.pro",
"eng.pro",
"jur.pro",
"law.pro",
"med.pro",
"recht.pro",
"ps",
"edu.ps",
"gov.ps",
"sec.ps",
"plo.ps",
"com.ps",
"org.ps",
"net.ps",
"pt",
"net.pt",
"gov.pt",
"org.pt",
"edu.pt",
"int.pt",
"publ.pt",
"com.pt",
"nome.pt",
"pw",
"co.pw",
"ne.pw",
"or.pw",
"ed.pw",
"go.pw",
"belau.pw",
"py",
"com.py",
"coop.py",
"edu.py",
"gov.py",
"mil.py",
"net.py",
"org.py",
"qa",
"com.qa",
"edu.qa",
"gov.qa",
"mil.qa",
"name.qa",
"net.qa",
"org.qa",
"sch.qa",
"re",
"asso.re",
"com.re",
"nom.re",
"ro",
"arts.ro",
"com.ro",
"firm.ro",
"info.ro",
"nom.ro",
"nt.ro",
"org.ro",
"rec.ro",
"store.ro",
"tm.ro",
"www.ro",
"rs",
"ac.rs",
"co.rs",
"edu.rs",
"gov.rs",
"in.rs",
"org.rs",
"ru",
"rw",
"ac.rw",
"co.rw",
"coop.rw",
"gov.rw",
"mil.rw",
"net.rw",
"org.rw",
"sa",
"com.sa",
"net.sa",
"org.sa",
"gov.sa",
"med.sa",
"pub.sa",
"edu.sa",
"sch.sa",
"sb",
"com.sb",
"edu.sb",
"gov.sb",
"net.sb",
"org.sb",
"sc",
"com.sc",
"gov.sc",
"net.sc",
"org.sc",
"edu.sc",
"sd",
"com.sd",
"net.sd",
"org.sd",
"edu.sd",
"med.sd",
"tv.sd",
"gov.sd",
"info.sd",
"se",
"a.se",
"ac.se",
"b.se",
"bd.se",
"brand.se",
"c.se",
"d.se",
"e.se",
"f.se",
"fh.se",
"fhsk.se",
"fhv.se",
"g.se",
"h.se",
"i.se",
"k.se",
"komforb.se",
"kommunalforbund.se",
"komvux.se",
"l.se",
"lanbib.se",
"m.se",
"n.se",
"naturbruksgymn.se",
"o.se",
"org.se",
"p.se",
"parti.se",
"pp.se",
"press.se",
"r.se",
"s.se",
"t.se",
"tm.se",
"u.se",
"w.se",
"x.se",
"y.se",
"z.se",
"sg",
"com.sg",
"net.sg",
"org.sg",
"gov.sg",
"edu.sg",
"per.sg",
"sh",
"com.sh",
"net.sh",
"gov.sh",
"org.sh",
"mil.sh",
"si",
"sj",
"sk",
"sl",
"com.sl",
"net.sl",
"edu.sl",
"gov.sl",
"org.sl",
"sm",
"sn",
"art.sn",
"com.sn",
"edu.sn",
"gouv.sn",
"org.sn",
"perso.sn",
"univ.sn",
"so",
"com.so",
"edu.so",
"gov.so",
"me.so",
"net.so",
"org.so",
"sr",
"ss",
"biz.ss",
"com.ss",
"edu.ss",
"gov.ss",
"net.ss",
"org.ss",
"st",
"co.st",
"com.st",
"consulado.st",
"edu.st",
"embaixada.st",
"gov.st",
"mil.st",
"net.st",
"org.st",
"principe.st",
"saotome.st",
"store.st",
"su",
"sv",
"com.sv",
"edu.sv",
"gob.sv",
"org.sv",
"red.sv",
"sx",
"gov.sx",
"sy",
"edu.sy",
"gov.sy",
"net.sy",
"mil.sy",
"com.sy",
"org.sy",
"sz",
"co.sz",
"ac.sz",
"org.sz",
"tc",
"td",
"tel",
"tf",
"tg",
"th",
"ac.th",
"co.th",
"go.th",
"in.th",
"mi.th",
"net.th",
"or.th",
"tj",
"ac.tj",
"biz.tj",
"co.tj",
"com.tj",
"edu.tj",
"go.tj",
"gov.tj",
"int.tj",
"mil.tj",
"name.tj",
"net.tj",
"nic.tj",
"org.tj",
"test.tj",
"web.tj",
"tk",
"tl",
"gov.tl",
"tm",
"com.tm",
"co.tm",
"org.tm",
"net.tm",
"nom.tm",
"gov.tm",
"mil.tm",
"edu.tm",
"tn",
"com.tn",
"ens.tn",
"fin.tn",
"gov.tn",
"ind.tn",
"intl.tn",
"nat.tn",
"net.tn",
"org.tn",
"info.tn",
"perso.tn",
"tourism.tn",
"edunet.tn",
"rnrt.tn",
"rns.tn",
"rnu.tn",
"mincom.tn",
"agrinet.tn",
"defense.tn",
"turen.tn",
"to",
"com.to",
"gov.to",
"net.to",
"org.to",
"edu.to",
"mil.to",
"tr",
"av.tr",
"bbs.tr",
"bel.tr",
"biz.tr",
"com.tr",
"dr.tr",
"edu.tr",
"gen.tr",
"gov.tr",
"info.tr",
"mil.tr",
"k12.tr",
"kep.tr",
"name.tr",
"net.tr",
"org.tr",
"pol.tr",
"tel.tr",
"tsk.tr",
"tv.tr",
"web.tr",
"nc.tr",
"gov.nc.tr",
"tt",
"co.tt",
"com.tt",
"org.tt",
"net.tt",
"biz.tt",
"info.tt",
"pro.tt",
"int.tt",
"coop.tt",
"jobs.tt",
"mobi.tt",
"travel.tt",
"museum.tt",
"aero.tt",
"name.tt",
"gov.tt",
"edu.tt",
"tv",
"tw",
"edu.tw",
"gov.tw",
"mil.tw",
"com.tw",
"net.tw",
"org.tw",
"idv.tw",
"game.tw",
"ebiz.tw",
"club.tw",
"網路.tw",
"組織.tw",
"商業.tw",
"tz",
"ac.tz",
"co.tz",
"go.tz",
"hotel.tz",
"info.tz",
"me.tz",
"mil.tz",
"mobi.tz",
"ne.tz",
"or.tz",
"sc.tz",
"tv.tz",
"ua",
"com.ua",
"edu.ua",
"gov.ua",
"in.ua",
"net.ua",
"org.ua",
"cherkassy.ua",
"cherkasy.ua",
"chernigov.ua",
"chernihiv.ua",
"chernivtsi.ua",
"chernovtsy.ua",
"ck.ua",
"cn.ua",
"cr.ua",
"crimea.ua",
"cv.ua",
"dn.ua",
"dnepropetrovsk.ua",
"dnipropetrovsk.ua",
"dominic.ua",
"donetsk.ua",
"dp.ua",
"if.ua",
"ivano-frankivsk.ua",
"kh.ua",
"kharkiv.ua",
"kharkov.ua",
"kherson.ua",
"khmelnitskiy.ua",
"khmelnytskyi.ua",
"kiev.ua",
"kirovograd.ua",
"km.ua",
"kr.ua",
"krym.ua",
"ks.ua",
"kv.ua",
"kyiv.ua",
"lg.ua",
"lt.ua",
"lugansk.ua",
"lutsk.ua",
"lv.ua",
"lviv.ua",
"mk.ua",
"mykolaiv.ua",
"nikolaev.ua",
"od.ua",
"odesa.ua",
"odessa.ua",
"pl.ua",
"poltava.ua",
"rivne.ua",
"rovno.ua",
"rv.ua",
"sb.ua",
"sebastopol.ua",
"sevastopol.ua",
"sm.ua",
"sumy.ua",
"te.ua",
"ternopil.ua",
"uz.ua",
"uzhgorod.ua",
"vinnica.ua",
"vinnytsia.ua",
"vn.ua",
"volyn.ua",
"yalta.ua",
"zaporizhzhe.ua",
"zaporizhzhia.ua",
"zhitomir.ua",
"zhytomyr.ua",
"zp.ua",
"zt.ua",
"ug",
"co.ug",
"or.ug",
"ac.ug",
"sc.ug",
"go.ug",
"ne.ug",
"com.ug",
"org.ug",
"uk",
"ac.uk",
"co.uk",
"gov.uk",
"ltd.uk",
"me.uk",
"net.uk",
"nhs.uk",
"org.uk",
"plc.uk",
"police.uk",
"*.sch.uk",
"us",
"dni.us",
"fed.us",
"isa.us",
"kids.us",
"nsn.us",
"ak.us",
"al.us",
"ar.us",
"as.us",
"az.us",
"ca.us",
"co.us",
"ct.us",
"dc.us",
"de.us",
"fl.us",
"ga.us",
"gu.us",
"hi.us",
"ia.us",
"id.us",
"il.us",
"in.us",
"ks.us",
"ky.us",
"la.us",
"ma.us",
"md.us",
"me.us",
"mi.us",
"mn.us",
"mo.us",
"ms.us",
"mt.us",
"nc.us",
"nd.us",
"ne.us",
"nh.us",
"nj.us",
"nm.us",
"nv.us",
"ny.us",
"oh.us",
"ok.us",
"or.us",
"pa.us",
"pr.us",
"ri.us",
"sc.us",
"sd.us",
"tn.us",
"tx.us",
"ut.us",
"vi.us",
"vt.us",
"va.us",
"wa.us",
"wi.us",
"wv.us",
"wy.us",
"k12.ak.us",
"k12.al.us",
"k12.ar.us",
"k12.as.us",
"k12.az.us",
"k12.ca.us",
"k12.co.us",
"k12.ct.us",
"k12.dc.us",
"k12.de.us",
"k12.fl.us",
"k12.ga.us",
"k12.gu.us",
"k12.ia.us",
"k12.id.us",
"k12.il.us",
"k12.in.us",
"k12.ks.us",
"k12.ky.us",
"k12.la.us",
"k12.ma.us",
"k12.md.us",
"k12.me.us",
"k12.mi.us",
"k12.mn.us",
"k12.mo.us",
"k12.ms.us",
"k12.mt.us",
"k12.nc.us",
"k12.ne.us",
"k12.nh.us",
"k12.nj.us",
"k12.nm.us",
"k12.nv.us",
"k12.ny.us",
"k12.oh.us",
"k12.ok.us",
"k12.or.us",
"k12.pa.us",
"k12.pr.us",
"k12.ri.us",
"k12.sc.us",
"k12.tn.us",
"k12.tx.us",
"k12.ut.us",
"k12.vi.us",
"k12.vt.us",
"k12.va.us",
"k12.wa.us",
"k12.wi.us",
"k12.wy.us",
"cc.ak.us",
"cc.al.us",
"cc.ar.us",
"cc.as.us",
"cc.az.us",
"cc.ca.us",
"cc.co.us",
"cc.ct.us",
"cc.dc.us",
"cc.de.us",
"cc.fl.us",
"cc.ga.us",
"cc.gu.us",
"cc.hi.us",
"cc.ia.us",
"cc.id.us",
"cc.il.us",
"cc.in.us",
"cc.ks.us",
"cc.ky.us",
"cc.la.us",
"cc.ma.us",
"cc.md.us",
"cc.me.us",
"cc.mi.us",
"cc.mn.us",
"cc.mo.us",
"cc.ms.us",
"cc.mt.us",
"cc.nc.us",
"cc.nd.us",
"cc.ne.us",
"cc.nh.us",
"cc.nj.us",
"cc.nm.us",
"cc.nv.us",
"cc.ny.us",
"cc.oh.us",
"cc.ok.us",
"cc.or.us",
"cc.pa.us",
"cc.pr.us",
"cc.ri.us",
"cc.sc.us",
"cc.sd.us",
"cc.tn.us",
"cc.tx.us",
"cc.ut.us",
"cc.vi.us",
"cc.vt.us",
"cc.va.us",
"cc.wa.us",
"cc.wi.us",
"cc.wv.us",
"cc.wy.us",
"lib.ak.us",
"lib.al.us",
"lib.ar.us",
"lib.as.us",
"lib.az.us",
"lib.ca.us",
"lib.co.us",
"lib.ct.us",
"lib.dc.us",
"lib.fl.us",
"lib.ga.us",
"lib.gu.us",
"lib.hi.us",
"lib.ia.us",
"lib.id.us",
"lib.il.us",
"lib.in.us",
"lib.ks.us",
"lib.ky.us",
"lib.la.us",
"lib.ma.us",
"lib.md.us",
"lib.me.us",
"lib.mi.us",
"lib.mn.us",
"lib.mo.us",
"lib.ms.us",
"lib.mt.us",
"lib.nc.us",
"lib.nd.us",
"lib.ne.us",
"lib.nh.us",
"lib.nj.us",
"lib.nm.us",
"lib.nv.us",
"lib.ny.us",
"lib.oh.us",
"lib.ok.us",
"lib.or.us",
"lib.pa.us",
"lib.pr.us",
"lib.ri.us",
"lib.sc.us",
"lib.sd.us",
"lib.tn.us",
"lib.tx.us",
"lib.ut.us",
"lib.vi.us",
"lib.vt.us",
"lib.va.us",
"lib.wa.us",
"lib.wi.us",
"lib.wy.us",
"pvt.k12.ma.us",
"chtr.k12.ma.us",
"paroch.k12.ma.us",
"ann-arbor.mi.us",
"cog.mi.us",
"dst.mi.us",
"eaton.mi.us",
"gen.mi.us",
"mus.mi.us",
"tec.mi.us",
"washtenaw.mi.us",
"uy",
"com.uy",
"edu.uy",
"gub.uy",
"mil.uy",
"net.uy",
"org.uy",
"uz",
"co.uz",
"com.uz",
"net.uz",
"org.uz",
"va",
"vc",
"com.vc",
"net.vc",
"org.vc",
"gov.vc",
"mil.vc",
"edu.vc",
"ve",
"arts.ve",
"co.ve",
"com.ve",
"e12.ve",
"edu.ve",
"firm.ve",
"gob.ve",
"gov.ve",
"info.ve",
"int.ve",
"mil.ve",
"net.ve",
"org.ve",
"rec.ve",
"store.ve",
"tec.ve",
"web.ve",
"vg",
"vi",
"co.vi",
"com.vi",
"k12.vi",
"net.vi",
"org.vi",
"vn",
"com.vn",
"net.vn",
"org.vn",
"edu.vn",
"gov.vn",
"int.vn",
"ac.vn",
"biz.vn",
"info.vn",
"name.vn",
"pro.vn",
"health.vn",
"vu",
"com.vu",
"edu.vu",
"net.vu",
"org.vu",
"wf",
"ws",
"com.ws",
"net.ws",
"org.ws",
"gov.ws",
"edu.ws",
"yt",
"امارات",
"հայ",
"বাংলা",
"бг",
"бел",
"中国",
"中國",
"الجزائر",
"مصر",
"ею",
"ευ",
"موريتانيا",
"გე",
"ελ",
"香港",
"公司.香港",
"教育.香港",
"政府.香港",
"個人.香港",
"網絡.香港",
"組織.香港",
"ಭಾರತ",
"ଭାରତ",
"ভাৰত",
"भारतम्",
"भारोत",
"ڀارت",
"ഭാരതം",
"भारत",
"بارت",
"بھارت",
"భారత్",
"ભારત",
"ਭਾਰਤ",
"ভারত",
"இந்தியா",
"ایران",
"ايران",
"عراق",
"الاردن",
"한국",
"қаз",
"ලංකා",
"இலங்கை",
"المغرب",
"мкд",
"мон",
"澳門",
"澳门",
"مليسيا",
"عمان",
"پاکستان",
"پاكستان",
"فلسطين",
"срб",
"пр.срб",
"орг.срб",
"обр.срб",
"од.срб",
"упр.срб",
"ак.срб",
"рф",
"قطر",
"السعودية",
"السعودیة",
"السعودیۃ",
"السعوديه",
"سودان",
"新加坡",
"சிங்கப்பூர்",
"سورية",
"سوريا",
"ไทย",
"ศึกษา.ไทย",
"ธุรกิจ.ไทย",
"รัฐบาล.ไทย",
"ทหาร.ไทย",
"เน็ต.ไทย",
"องค์กร.ไทย",
"تونس",
"台灣",
"台湾",
"臺灣",
"укр",
"اليمن",
"xxx",
"*.ye",
"ac.za",
"agric.za",
"alt.za",
"co.za",
"edu.za",
"gov.za",
"grondar.za",
"law.za",
"mil.za",
"net.za",
"ngo.za",
"nic.za",
"nis.za",
"nom.za",
"org.za",
"school.za",
"tm.za",
"web.za",
"zm",
"ac.zm",
"biz.zm",
"co.zm",
"com.zm",
"edu.zm",
"gov.zm",
"info.zm",
"mil.zm",
"net.zm",
"org.zm",
"sch.zm",
"zw",
"ac.zw",
"co.zw",
"gov.zw",
"mil.zw",
"org.zw",
"aaa",
"aarp",
"abarth",
"abb",
"abbott",
"abbvie",
"abc",
"able",
"abogado",
"abudhabi",
"academy",
"accenture",
"accountant",
"accountants",
"aco",
"actor",
"adac",
"ads",
"adult",
"aeg",
"aetna",
"afamilycompany",
"afl",
"africa",
"agakhan",
"agency",
"aig",
"aigo",
"airbus",
"airforce",
"airtel",
"akdn",
"alfaromeo",
"alibaba",
"alipay",
"allfinanz",
"allstate",
"ally",
"alsace",
"alstom",
"amazon",
"americanexpress",
"americanfamily",
"amex",
"amfam",
"amica",
"amsterdam",
"analytics",
"android",
"anquan",
"anz",
"aol",
"apartments",
"app",
"apple",
"aquarelle",
"arab",
"aramco",
"archi",
"army",
"art",
"arte",
"asda",
"associates",
"athleta",
"attorney",
"auction",
"audi",
"audible",
"audio",
"auspost",
"author",
"auto",
"autos",
"avianca",
"aws",
"axa",
"azure",
"baby",
"baidu",
"banamex",
"bananarepublic",
"band",
"bank",
"bar",
"barcelona",
"barclaycard",
"barclays",
"barefoot",
"bargains",
"baseball",
"basketball",
"bauhaus",
"bayern",
"bbc",
"bbt",
"bbva",
"bcg",
"bcn",
"beats",
"beauty",
"beer",
"bentley",
"berlin",
"best",
"bestbuy",
"bet",
"bharti",
"bible",
"bid",
"bike",
"bing",
"bingo",
"bio",
"black",
"blackfriday",
"blockbuster",
"blog",
"bloomberg",
"blue",
"bms",
"bmw",
"bnpparibas",
"boats",
"boehringer",
"bofa",
"bom",
"bond",
"boo",
"book",
"booking",
"bosch",
"bostik",
"boston",
"bot",
"boutique",
"box",
"bradesco",
"bridgestone",
"broadway",
"broker",
"brother",
"brussels",
"budapest",
"bugatti",
"build",
"builders",
"business",
"buy",
"buzz",
"bzh",
"cab",
"cafe",
"cal",
"call",
"calvinklein",
"cam",
"camera",
"camp",
"cancerresearch",
"canon",
"capetown",
"capital",
"capitalone",
"car",
"caravan",
"cards",
"care",
"career",
"careers",
"cars",
"casa",
"case",
"caseih",
"cash",
"casino",
"catering",
"catholic",
"cba",
"cbn",
"cbre",
"cbs",
"ceb",
"center",
"ceo",
"cern",
"cfa",
"cfd",
"chanel",
"channel",
"charity",
"chase",
"chat",
"cheap",
"chintai",
"christmas",
"chrome",
"church",
"cipriani",
"circle",
"cisco",
"citadel",
"citi",
"citic",
"city",
"cityeats",
"claims",
"cleaning",
"click",
"clinic",
"clinique",
"clothing",
"cloud",
"club",
"clubmed",
"coach",
"codes",
"coffee",
"college",
"cologne",
"comcast",
"commbank",
"community",
"company",
"compare",
"computer",
"comsec",
"condos",
"construction",
"consulting",
"contact",
"contractors",
"cooking",
"cookingchannel",
"cool",
"corsica",
"country",
"coupon",
"coupons",
"courses",
"cpa",
"credit",
"creditcard",
"creditunion",
"cricket",
"crown",
"crs",
"cruise",
"cruises",
"csc",
"cuisinella",
"cymru",
"cyou",
"dabur",
"dad",
"dance",
"data",
"date",
"dating",
"datsun",
"day",
"dclk",
"dds",
"deal",
"dealer",
"deals",
"degree",
"delivery",
"dell",
"deloitte",
"delta",
"democrat",
"dental",
"dentist",
"desi",
"design",
"dev",
"dhl",
"diamonds",
"diet",
"digital",
"direct",
"directory",
"discount",
"discover",
"dish",
"diy",
"dnp",
"docs",
"doctor",
"dog",
"domains",
"dot",
"download",
"drive",
"dtv",
"dubai",
"duck",
"dunlop",
"dupont",
"durban",
"dvag",
"dvr",
"earth",
"eat",
"eco",
"edeka",
"education",
"email",
"emerck",
"energy",
"engineer",
"engineering",
"enterprises",
"epson",
"equipment",
"ericsson",
"erni",
"esq",
"estate",
"esurance",
"etisalat",
"eurovision",
"eus",
"events",
"exchange",
"expert",
"exposed",
"express",
"extraspace",
"fage",
"fail",
"fairwinds",
"faith",
"family",
"fan",
"fans",
"farm",
"farmers",
"fashion",
"fast",
"fedex",
"feedback",
"ferrari",
"ferrero",
"fiat",
"fidelity",
"fido",
"film",
"final",
"finance",
"financial",
"fire",
"firestone",
"firmdale",
"fish",
"fishing",
"fit",
"fitness",
"flickr",
"flights",
"flir",
"florist",
"flowers",
"fly",
"foo",
"food",
"foodnetwork",
"football",
"ford",
"forex",
"forsale",
"forum",
"foundation",
"fox",
"free",
"fresenius",
"frl",
"frogans",
"frontdoor",
"frontier",
"ftr",
"fujitsu",
"fujixerox",
"fun",
"fund",
"furniture",
"futbol",
"fyi",
"gal",
"gallery",
"gallo",
"gallup",
"game",
"games",
"gap",
"garden",
"gay",
"gbiz",
"gdn",
"gea",
"gent",
"genting",
"george",
"ggee",
"gift",
"gifts",
"gives",
"giving",
"glade",
"glass",
"gle",
"global",
"globo",
"gmail",
"gmbh",
"gmo",
"gmx",
"godaddy",
"gold",
"goldpoint",
"golf",
"goo",
"goodyear",
"goog",
"google",
"gop",
"got",
"grainger",
"graphics",
"gratis",
"green",
"gripe",
"grocery",
"group",
"guardian",
"gucci",
"guge",
"guide",
"guitars",
"guru",
"hair",
"hamburg",
"hangout",
"haus",
"hbo",
"hdfc",
"hdfcbank",
"health",
"healthcare",
"help",
"helsinki",
"here",
"hermes",
"hgtv",
"hiphop",
"hisamitsu",
"hitachi",
"hiv",
"hkt",
"hockey",
"holdings",
"holiday",
"homedepot",
"homegoods",
"homes",
"homesense",
"honda",
"horse",
"hospital",
"host",
"hosting",
"hot",
"hoteles",
"hotels",
"hotmail",
"house",
"how",
"hsbc",
"hughes",
"hyatt",
"hyundai",
"ibm",
"icbc",
"ice",
"icu",
"ieee",
"ifm",
"ikano",
"imamat",
"imdb",
"immo",
"immobilien",
"inc",
"industries",
"infiniti",
"ing",
"ink",
"institute",
"insurance",
"insure",
"intel",
"international",
"intuit",
"investments",
"ipiranga",
"irish",
"ismaili",
"ist",
"istanbul",
"itau",
"itv",
"iveco",
"jaguar",
"java",
"jcb",
"jcp",
"jeep",
"jetzt",
"jewelry",
"jio",
"jll",
"jmp",
"jnj",
"joburg",
"jot",
"joy",
"jpmorgan",
"jprs",
"juegos",
"juniper",
"kaufen",
"kddi",
"kerryhotels",
"kerrylogistics",
"kerryproperties",
"kfh",
"kia",
"kim",
"kinder",
"kindle",
"kitchen",
"kiwi",
"koeln",
"komatsu",
"kosher",
"kpmg",
"kpn",
"krd",
"kred",
"kuokgroup",
"kyoto",
"lacaixa",
"lamborghini",
"lamer",
"lancaster",
"lancia",
"land",
"landrover",
"lanxess",
"lasalle",
"lat",
"latino",
"latrobe",
"law",
"lawyer",
"lds",
"lease",
"leclerc",
"lefrak",
"legal",
"lego",
"lexus",
"lgbt",
"lidl",
"life",
"lifeinsurance",
"lifestyle",
"lighting",
"like",
"lilly",
"limited",
"limo",
"lincoln",
"linde",
"link",
"lipsy",
"live",
"living",
"lixil",
"llc",
"llp",
"loan",
"loans",
"locker",
"locus",
"loft",
"lol",
"london",
"lotte",
"lotto",
"love",
"lpl",
"lplfinancial",
"ltd",
"ltda",
"lundbeck",
"lupin",
"luxe",
"luxury",
"macys",
"madrid",
"maif",
"maison",
"makeup",
"man",
"management",
"mango",
"map",
"market",
"marketing",
"markets",
"marriott",
"marshalls",
"maserati",
"mattel",
"mba",
"mckinsey",
"med",
"media",
"meet",
"melbourne",
"meme",
"memorial",
"men",
"menu",
"merckmsd",
"metlife",
"miami",
"microsoft",
"mini",
"mint",
"mit",
"mitsubishi",
"mlb",
"mls",
"mma",
"mobile",
"moda",
"moe",
"moi",
"mom",
"monash",
"money",
"monster",
"mormon",
"mortgage",
"moscow",
"moto",
"motorcycles",
"mov",
"movie",
"msd",
"mtn",
"mtr",
"mutual",
"nab",
"nadex",
"nagoya",
"nationwide",
"natura",
"navy",
"nba",
"nec",
"netbank",
"netflix",
"network",
"neustar",
"new",
"newholland",
"news",
"next",
"nextdirect",
"nexus",
"nfl",
"ngo",
"nhk",
"nico",
"nike",
"nikon",
"ninja",
"nissan",
"nissay",
"nokia",
"northwesternmutual",
"norton",
"now",
"nowruz",
"nowtv",
"nra",
"nrw",
"ntt",
"nyc",
"obi",
"observer",
"off",
"office",
"okinawa",
"olayan",
"olayangroup",
"oldnavy",
"ollo",
"omega",
"one",
"ong",
"onl",
"online",
"onyourside",
"ooo",
"open",
"oracle",
"orange",
"organic",
"origins",
"osaka",
"otsuka",
"ott",
"ovh",
"page",
"panasonic",
"paris",
"pars",
"partners",
"parts",
"party",
"passagens",
"pay",
"pccw",
"pet",
"pfizer",
"pharmacy",
"phd",
"philips",
"phone",
"photo",
"photography",
"photos",
"physio",
"pics",
"pictet",
"pictures",
"pid",
"pin",
"ping",
"pink",
"pioneer",
"pizza",
"place",
"play",
"playstation",
"plumbing",
"plus",
"pnc",
"pohl",
"poker",
"politie",
"porn",
"pramerica",
"praxi",
"press",
"prime",
"prod",
"productions",
"prof",
"progressive",
"promo",
"properties",
"property",
"protection",
"pru",
"prudential",
"pub",
"pwc",
"qpon",
"quebec",
"quest",
"qvc",
"racing",
"radio",
"raid",
"read",
"realestate",
"realtor",
"realty",
"recipes",
"red",
"redstone",
"redumbrella",
"rehab",
"reise",
"reisen",
"reit",
"reliance",
"ren",
"rent",
"rentals",
"repair",
"report",
"republican",
"rest",
"restaurant",
"review",
"reviews",
"rexroth",
"rich",
"richardli",
"ricoh",
"rightathome",
"ril",
"rio",
"rip",
"rmit",
"rocher",
"rocks",
"rodeo",
"rogers",
"room",
"rsvp",
"rugby",
"ruhr",
"run",
"rwe",
"ryukyu",
"saarland",
"safe",
"safety",
"sakura",
"sale",
"salon",
"samsclub",
"samsung",
"sandvik",
"sandvikcoromant",
"sanofi",
"sap",
"sarl",
"sas",
"save",
"saxo",
"sbi",
"sbs",
"sca",
"scb",
"schaeffler",
"schmidt",
"scholarships",
"school",
"schule",
"schwarz",
"science",
"scjohnson",
"scor",
"scot",
"search",
"seat",
"secure",
"security",
"seek",
"select",
"sener",
"services",
"ses",
"seven",
"sew",
"sex",
"sexy",
"sfr",
"shangrila",
"sharp",
"shaw",
"shell",
"shia",
"shiksha",
"shoes",
"shop",
"shopping",
"shouji",
"show",
"showtime",
"shriram",
"silk",
"sina",
"singles",
"site",
"ski",
"skin",
"sky",
"skype",
"sling",
"smart",
"smile",
"sncf",
"soccer",
"social",
"softbank",
"software",
"sohu",
"solar",
"solutions",
"song",
"sony",
"soy",
"spa",
"space",
"sport",
"spot",
"spreadbetting",
"srl",
"stada",
"staples",
"star",
"statebank",
"statefarm",
"stc",
"stcgroup",
"stockholm",
"storage",
"store",
"stream",
"studio",
"study",
"style",
"sucks",
"supplies",
"supply",
"support",
"surf",
"surgery",
"suzuki",
"swatch",
"swiftcover",
"swiss",
"sydney",
"symantec",
"systems",
"tab",
"taipei",
"talk",
"taobao",
"target",
"tatamotors",
"tatar",
"tattoo",
"tax",
"taxi",
"tci",
"tdk",
"team",
"tech",
"technology",
"temasek",
"tennis",
"teva",
"thd",
"theater",
"theatre",
"tiaa",
"tickets",
"tienda",
"tiffany",
"tips",
"tires",
"tirol",
"tjmaxx",
"tjx",
"tkmaxx",
"tmall",
"today",
"tokyo",
"tools",
"top",
"toray",
"toshiba",
"total",
"tours",
"town",
"toyota",
"toys",
"trade",
"trading",
"training",
"travel",
"travelchannel",
"travelers",
"travelersinsurance",
"trust",
"trv",
"tube",
"tui",
"tunes",
"tushu",
"tvs",
"ubank",
"ubs",
"unicom",
"university",
"uno",
"uol",
"ups",
"vacations",
"vana",
"vanguard",
"vegas",
"ventures",
"verisign",
"versicherung",
"vet",
"viajes",
"video",
"vig",
"viking",
"villas",
"vin",
"vip",
"virgin",
"visa",
"vision",
"viva",
"vivo",
"vlaanderen",
"vodka",
"volkswagen",
"volvo",
"vote",
"voting",
"voto",
"voyage",
"vuelos",
"wales",
"walmart",
"walter",
"wang",
"wanggou",
"watch",
"watches",
"weather",
"weatherchannel",
"webcam",
"weber",
"website",
"wed",
"wedding",
"weibo",
"weir",
"whoswho",
"wien",
"wiki",
"williamhill",
"win",
"windows",
"wine",
"winners",
"wme",
"wolterskluwer",
"woodside",
"work",
"works",
"world",
"wow",
"wtc",
"wtf",
"xbox",
"xerox",
"xfinity",
"xihuan",
"xin",
"कॉम",
"セール",
"佛山",
"慈善",
"集团",
"在线",
"大众汽车",
"点看",
"คอม",
"八卦",
"موقع",
"公益",
"公司",
"香格里拉",
"网站",
"移动",
"我爱你",
"москва",
"католик",
"онлайн",
"сайт",
"联通",
"קום",
"时尚",
"微博",
"淡马锡",
"ファッション",
"орг",
"नेट",
"ストア",
"アマゾン",
"삼성",
"商标",
"商店",
"商城",
"дети",
"ポイント",
"新闻",
"工行",
"家電",
"كوم",
"中文网",
"中信",
"娱乐",
"谷歌",
"電訊盈科",
"购物",
"クラウド",
"通販",
"网店",
"संगठन",
"餐厅",
"网络",
"ком",
"亚马逊",
"诺基亚",
"食品",
"飞利浦",
"手表",
"手机",
"ارامكو",
"العليان",
"اتصالات",
"بازار",
"ابوظبي",
"كاثوليك",
"همراه",
"닷컴",
"政府",
"شبكة",
"بيتك",
"عرب",
"机构",
"组织机构",
"健康",
"招聘",
"рус",
"珠宝",
"大拿",
"みんな",
"グーグル",
"世界",
"書籍",
"网址",
"닷넷",
"コム",
"天主教",
"游戏",
"vermögensberater",
"vermögensberatung",
"企业",
"信息",
"嘉里大酒店",
"嘉里",
"广东",
"政务",
"xyz",
"yachts",
"yahoo",
"yamaxun",
"yandex",
"yodobashi",
"yoga",
"yokohama",
"you",
"youtube",
"yun",
"zappos",
"zara",
"zero",
"zip",
"zone",
"zuerich",
"cc.ua",
"inf.ua",
"ltd.ua",
"adobeaemcloud.com",
"adobeaemcloud.net",
"*.dev.adobeaemcloud.com",
"beep.pl",
"barsy.ca",
"*.compute.estate",
"*.alces.network",
"altervista.org",
"alwaysdata.net",
"cloudfront.net",
"*.compute.amazonaws.com",
"*.compute-1.amazonaws.com",
"*.compute.amazonaws.com.cn",
"us-east-1.amazonaws.com",
"cn-north-1.eb.amazonaws.com.cn",
"cn-northwest-1.eb.amazonaws.com.cn",
"elasticbeanstalk.com",
"ap-northeast-1.elasticbeanstalk.com",
"ap-northeast-2.elasticbeanstalk.com",
"ap-northeast-3.elasticbeanstalk.com",
"ap-south-1.elasticbeanstalk.com",
"ap-southeast-1.elasticbeanstalk.com",
"ap-southeast-2.elasticbeanstalk.com",
"ca-central-1.elasticbeanstalk.com",
"eu-central-1.elasticbeanstalk.com",
"eu-west-1.elasticbeanstalk.com",
"eu-west-2.elasticbeanstalk.com",
"eu-west-3.elasticbeanstalk.com",
"sa-east-1.elasticbeanstalk.com",
"us-east-1.elasticbeanstalk.com",
"us-east-2.elasticbeanstalk.com",
"us-gov-west-1.elasticbeanstalk.com",
"us-west-1.elasticbeanstalk.com",
"us-west-2.elasticbeanstalk.com",
"*.elb.amazonaws.com",
"*.elb.amazonaws.com.cn",
"s3.amazonaws.com",
"s3-ap-northeast-1.amazonaws.com",
"s3-ap-northeast-2.amazonaws.com",
"s3-ap-south-1.amazonaws.com",
"s3-ap-southeast-1.amazonaws.com",
"s3-ap-southeast-2.amazonaws.com",
"s3-ca-central-1.amazonaws.com",
"s3-eu-central-1.amazonaws.com",
"s3-eu-west-1.amazonaws.com",
"s3-eu-west-2.amazonaws.com",
"s3-eu-west-3.amazonaws.com",
"s3-external-1.amazonaws.com",
"s3-fips-us-gov-west-1.amazonaws.com",
"s3-sa-east-1.amazonaws.com",
"s3-us-gov-west-1.amazonaws.com",
"s3-us-east-2.amazonaws.com",
"s3-us-west-1.amazonaws.com",
"s3-us-west-2.amazonaws.com",
"s3.ap-northeast-2.amazonaws.com",
"s3.ap-south-1.amazonaws.com",
"s3.cn-north-1.amazonaws.com.cn",
"s3.ca-central-1.amazonaws.com",
"s3.eu-central-1.amazonaws.com",
"s3.eu-west-2.amazonaws.com",
"s3.eu-west-3.amazonaws.com",
"s3.us-east-2.amazonaws.com",
"s3.dualstack.ap-northeast-1.amazonaws.com",
"s3.dualstack.ap-northeast-2.amazonaws.com",
"s3.dualstack.ap-south-1.amazonaws.com",
"s3.dualstack.ap-southeast-1.amazonaws.com",
"s3.dualstack.ap-southeast-2.amazonaws.com",
"s3.dualstack.ca-central-1.amazonaws.com",
"s3.dualstack.eu-central-1.amazonaws.com",
"s3.dualstack.eu-west-1.amazonaws.com",
"s3.dualstack.eu-west-2.amazonaws.com",
"s3.dualstack.eu-west-3.amazonaws.com",
"s3.dualstack.sa-east-1.amazonaws.com",
"s3.dualstack.us-east-1.amazonaws.com",
"s3.dualstack.us-east-2.amazonaws.com",
"s3-website-us-east-1.amazonaws.com",
"s3-website-us-west-1.amazonaws.com",
"s3-website-us-west-2.amazonaws.com",
"s3-website-ap-northeast-1.amazonaws.com",
"s3-website-ap-southeast-1.amazonaws.com",
"s3-website-ap-southeast-2.amazonaws.com",
"s3-website-eu-west-1.amazonaws.com",
"s3-website-sa-east-1.amazonaws.com",
"s3-website.ap-northeast-2.amazonaws.com",
"s3-website.ap-south-1.amazonaws.com",
"s3-website.ca-central-1.amazonaws.com",
"s3-website.eu-central-1.amazonaws.com",
"s3-website.eu-west-2.amazonaws.com",
"s3-website.eu-west-3.amazonaws.com",
"s3-website.us-east-2.amazonaws.com",
"amsw.nl",
"t3l3p0rt.net",
"tele.amune.org",
"apigee.io",
"on-aptible.com",
"user.aseinet.ne.jp",
"gv.vc",
"d.gv.vc",
"user.party.eus",
"pimienta.org",
"poivron.org",
"potager.org",
"sweetpepper.org",
"myasustor.com",
"myfritz.net",
"*.awdev.ca",
"*.advisor.ws",
"b-data.io",
"backplaneapp.io",
"balena-devices.com",
"app.banzaicloud.io",
"betainabox.com",
"bnr.la",
"blackbaudcdn.net",
"boomla.net",
"boxfuse.io",
"square7.ch",
"bplaced.com",
"bplaced.de",
"square7.de",
"bplaced.net",
"square7.net",
"browsersafetymark.io",
"uk0.bigv.io",
"dh.bytemark.co.uk",
"vm.bytemark.co.uk",
"mycd.eu",
"carrd.co",
"crd.co",
"uwu.ai",
"ae.org",
"ar.com",
"br.com",
"cn.com",
"com.de",
"com.se",
"de.com",
"eu.com",
"gb.com",
"gb.net",
"hu.com",
"hu.net",
"jp.net",
"jpn.com",
"kr.com",
"mex.com",
"no.com",
"qc.com",
"ru.com",
"sa.com",
"se.net",
"uk.com",
"uk.net",
"us.com",
"uy.com",
"za.bz",
"za.com",
"africa.com",
"gr.com",
"in.net",
"us.org",
"co.com",
"c.la",
"certmgr.org",
"xenapponazure.com",
"discourse.group",
"discourse.team",
"virtueeldomein.nl",
"cleverapps.io",
"*.lcl.dev",
"*.stg.dev",
"c66.me",
"cloud66.ws",
"cloud66.zone",
"jdevcloud.com",
"wpdevcloud.com",
"cloudaccess.host",
"freesite.host",
"cloudaccess.net",
"cloudcontrolled.com",
"cloudcontrolapp.com",
"cloudera.site",
"trycloudflare.com",
"workers.dev",
"wnext.app",
"co.ca",
"*.otap.co",
"co.cz",
"c.cdn77.org",
"cdn77-ssl.net",
"r.cdn77.net",
"rsc.cdn77.org",
"ssl.origin.cdn77-secure.org",
"cloudns.asia",
"cloudns.biz",
"cloudns.club",
"cloudns.cc",
"cloudns.eu",
"cloudns.in",
"cloudns.info",
"cloudns.org",
"cloudns.pro",
"cloudns.pw",
"cloudns.us",
"cloudeity.net",
"cnpy.gdn",
"co.nl",
"co.no",
"webhosting.be",
"hosting-cluster.nl",
"ac.ru",
"edu.ru",
"gov.ru",
"int.ru",
"mil.ru",
"test.ru",
"dyn.cosidns.de",
"dynamisches-dns.de",
"dnsupdater.de",
"internet-dns.de",
"l-o-g-i-n.de",
"dynamic-dns.info",
"feste-ip.net",
"knx-server.net",
"static-access.net",
"realm.cz",
"*.cryptonomic.net",
"cupcake.is",
"*.customer-oci.com",
"*.oci.customer-oci.com",
"*.ocp.customer-oci.com",
"*.ocs.customer-oci.com",
"cyon.link",
"cyon.site",
"daplie.me",
"localhost.daplie.me",
"dattolocal.com",
"dattorelay.com",
"dattoweb.com",
"mydatto.com",
"dattolocal.net",
"mydatto.net",
"biz.dk",
"co.dk",
"firm.dk",
"reg.dk",
"store.dk",
"*.dapps.earth",
"*.bzz.dapps.earth",
"builtwithdark.com",
"edgestack.me",
"debian.net",
"dedyn.io",
"dnshome.de",
"online.th",
"shop.th",
"drayddns.com",
"dreamhosters.com",
"mydrobo.com",
"drud.io",
"drud.us",
"duckdns.org",
"dy.fi",
"tunk.org",
"dyndns-at-home.com",
"dyndns-at-work.com",
"dyndns-blog.com",
"dyndns-free.com",
"dyndns-home.com",
"dyndns-ip.com",
"dyndns-mail.com",
"dyndns-office.com",
"dyndns-pics.com",
"dyndns-remote.com",
"dyndns-server.com",
"dyndns-web.com",
"dyndns-wiki.com",
"dyndns-work.com",
"dyndns.biz",
"dyndns.info",
"dyndns.org",
"dyndns.tv",
"at-band-camp.net",
"ath.cx",
"barrel-of-knowledge.info",
"barrell-of-knowledge.info",
"better-than.tv",
"blogdns.com",
"blogdns.net",
"blogdns.org",
"blogsite.org",
"boldlygoingnowhere.org",
"broke-it.net",
"buyshouses.net",
"cechire.com",
"dnsalias.com",
"dnsalias.net",
"dnsalias.org",
"dnsdojo.com",
"dnsdojo.net",
"dnsdojo.org",
"does-it.net",
"doesntexist.com",
"doesntexist.org",
"dontexist.com",
"dontexist.net",
"dontexist.org",
"doomdns.com",
"doomdns.org",
"dvrdns.org",
"dyn-o-saur.com",
"dynalias.com",
"dynalias.net",
"dynalias.org",
"dynathome.net",
"dyndns.ws",
"endofinternet.net",
"endofinternet.org",
"endoftheinternet.org",
"est-a-la-maison.com",
"est-a-la-masion.com",
"est-le-patron.com",
"est-mon-blogueur.com",
"for-better.biz",
"for-more.biz",
"for-our.info",
"for-some.biz",
"for-the.biz",
"forgot.her.name",
"forgot.his.name",
"from-ak.com",
"from-al.com",
"from-ar.com",
"from-az.net",
"from-ca.com",
"from-co.net",
"from-ct.com",
"from-dc.com",
"from-de.com",
"from-fl.com",
"from-ga.com",
"from-hi.com",
"from-ia.com",
"from-id.com",
"from-il.com",
"from-in.com",
"from-ks.com",
"from-ky.com",
"from-la.net",
"from-ma.com",
"from-md.com",
"from-me.org",
"from-mi.com",
"from-mn.com",
"from-mo.com",
"from-ms.com",
"from-mt.com",
"from-nc.com",
"from-nd.com",
"from-ne.com",
"from-nh.com",
"from-nj.com",
"from-nm.com",
"from-nv.com",
"from-ny.net",
"from-oh.com",
"from-ok.com",
"from-or.com",
"from-pa.com",
"from-pr.com",
"from-ri.com",
"from-sc.com",
"from-sd.com",
"from-tn.com",
"from-tx.com",
"from-ut.com",
"from-va.com",
"from-vt.com",
"from-wa.com",
"from-wi.com",
"from-wv.com",
"from-wy.com",
"ftpaccess.cc",
"fuettertdasnetz.de",
"game-host.org",
"game-server.cc",
"getmyip.com",
"gets-it.net",
"go.dyndns.org",
"gotdns.com",
"gotdns.org",
"groks-the.info",
"groks-this.info",
"ham-radio-op.net",
"here-for-more.info",
"hobby-site.com",
"hobby-site.org",
"home.dyndns.org",
"homedns.org",
"homeftp.net",
"homeftp.org",
"homeip.net",
"homelinux.com",
"homelinux.net",
"homelinux.org",
"homeunix.com",
"homeunix.net",
"homeunix.org",
"iamallama.com",
"in-the-band.net",
"is-a-anarchist.com",
"is-a-blogger.com",
"is-a-bookkeeper.com",
"is-a-bruinsfan.org",
"is-a-bulls-fan.com",
"is-a-candidate.org",
"is-a-caterer.com",
"is-a-celticsfan.org",
"is-a-chef.com",
"is-a-chef.net",
"is-a-chef.org",
"is-a-conservative.com",
"is-a-cpa.com",
"is-a-cubicle-slave.com",
"is-a-democrat.com",
"is-a-designer.com",
"is-a-doctor.com",
"is-a-financialadvisor.com",
"is-a-geek.com",
"is-a-geek.net",
"is-a-geek.org",
"is-a-green.com",
"is-a-guru.com",
"is-a-hard-worker.com",
"is-a-hunter.com",
"is-a-knight.org",
"is-a-landscaper.com",
"is-a-lawyer.com",
"is-a-liberal.com",
"is-a-libertarian.com",
"is-a-linux-user.org",
"is-a-llama.com",
"is-a-musician.com",
"is-a-nascarfan.com",
"is-a-nurse.com",
"is-a-painter.com",
"is-a-patsfan.org",
"is-a-personaltrainer.com",
"is-a-photographer.com",
"is-a-player.com",
"is-a-republican.com",
"is-a-rockstar.com",
"is-a-socialist.com",
"is-a-soxfan.org",
"is-a-student.com",
"is-a-teacher.com",
"is-a-techie.com",
"is-a-therapist.com",
"is-an-accountant.com",
"is-an-actor.com",
"is-an-actress.com",
"is-an-anarchist.com",
"is-an-artist.com",
"is-an-engineer.com",
"is-an-entertainer.com",
"is-by.us",
"is-certified.com",
"is-found.org",
"is-gone.com",
"is-into-anime.com",
"is-into-cars.com",
"is-into-cartoons.com",
"is-into-games.com",
"is-leet.com",
"is-lost.org",
"is-not-certified.com",
"is-saved.org",
"is-slick.com",
"is-uberleet.com",
"is-very-bad.org",
"is-very-evil.org",
"is-very-good.org",
"is-very-nice.org",
"is-very-sweet.org",
"is-with-theband.com",
"isa-geek.com",
"isa-geek.net",
"isa-geek.org",
"isa-hockeynut.com",
"issmarterthanyou.com",
"isteingeek.de",
"istmein.de",
"kicks-ass.net",
"kicks-ass.org",
"knowsitall.info",
"land-4-sale.us",
"lebtimnetz.de",
"leitungsen.de",
"likes-pie.com",
"likescandy.com",
"merseine.nu",
"mine.nu",
"misconfused.org",
"mypets.ws",
"myphotos.cc",
"neat-url.com",
"office-on-the.net",
"on-the-web.tv",
"podzone.net",
"podzone.org",
"readmyblog.org",
"saves-the-whales.com",
"scrapper-site.net",
"scrapping.cc",
"selfip.biz",
"selfip.com",
"selfip.info",
"selfip.net",
"selfip.org",
"sells-for-less.com",
"sells-for-u.com",
"sells-it.net",
"sellsyourhome.org",
"servebbs.com",
"servebbs.net",
"servebbs.org",
"serveftp.net",
"serveftp.org",
"servegame.org",
"shacknet.nu",
"simple-url.com",
"space-to-rent.com",
"stuff-4-sale.org",
"stuff-4-sale.us",
"teaches-yoga.com",
"thruhere.net",
"traeumtgerade.de",
"webhop.biz",
"webhop.info",
"webhop.net",
"webhop.org",
"worse-than.tv",
"writesthisblog.com",
"ddnss.de",
"dyn.ddnss.de",
"dyndns.ddnss.de",
"dyndns1.de",
"dyn-ip24.de",
"home-webserver.de",
"dyn.home-webserver.de",
"myhome-server.de",
"ddnss.org",
"definima.net",
"definima.io",
"bci.dnstrace.pro",
"ddnsfree.com",
"ddnsgeek.com",
"giize.com",
"gleeze.com",
"kozow.com",
"loseyourip.com",
"ooguy.com",
"theworkpc.com",
"casacam.net",
"dynu.net",
"accesscam.org",
"camdvr.org",
"freeddns.org",
"mywire.org",
"webredirect.org",
"myddns.rocks",
"blogsite.xyz",
"dynv6.net",
"e4.cz",
"en-root.fr",
"mytuleap.com",
"onred.one",
"staging.onred.one",
"enonic.io",
"customer.enonic.io",
"eu.org",
"al.eu.org",
"asso.eu.org",
"at.eu.org",
"au.eu.org",
"be.eu.org",
"bg.eu.org",
"ca.eu.org",
"cd.eu.org",
"ch.eu.org",
"cn.eu.org",
"cy.eu.org",
"cz.eu.org",
"de.eu.org",
"dk.eu.org",
"edu.eu.org",
"ee.eu.org",
"es.eu.org",
"fi.eu.org",
"fr.eu.org",
"gr.eu.org",
"hr.eu.org",
"hu.eu.org",
"ie.eu.org",
"il.eu.org",
"in.eu.org",
"int.eu.org",
"is.eu.org",
"it.eu.org",
"jp.eu.org",
"kr.eu.org",
"lt.eu.org",
"lu.eu.org",
"lv.eu.org",
"mc.eu.org",
"me.eu.org",
"mk.eu.org",
"mt.eu.org",
"my.eu.org",
"net.eu.org",
"ng.eu.org",
"nl.eu.org",
"no.eu.org",
"nz.eu.org",
"paris.eu.org",
"pl.eu.org",
"pt.eu.org",
"q-a.eu.org",
"ro.eu.org",
"ru.eu.org",
"se.eu.org",
"si.eu.org",
"sk.eu.org",
"tr.eu.org",
"uk.eu.org",
"us.eu.org",
"eu-1.evennode.com",
"eu-2.evennode.com",
"eu-3.evennode.com",
"eu-4.evennode.com",
"us-1.evennode.com",
"us-2.evennode.com",
"us-3.evennode.com",
"us-4.evennode.com",
"twmail.cc",
"twmail.net",
"twmail.org",
"mymailer.com.tw",
"url.tw",
"apps.fbsbx.com",
"ru.net",
"adygeya.ru",
"bashkiria.ru",
"bir.ru",
"cbg.ru",
"com.ru",
"dagestan.ru",
"grozny.ru",
"kalmykia.ru",
"kustanai.ru",
"marine.ru",
"mordovia.ru",
"msk.ru",
"mytis.ru",
"nalchik.ru",
"nov.ru",
"pyatigorsk.ru",
"spb.ru",
"vladikavkaz.ru",
"vladimir.ru",
"abkhazia.su",
"adygeya.su",
"aktyubinsk.su",
"arkhangelsk.su",
"armenia.su",
"ashgabad.su",
"azerbaijan.su",
"balashov.su",
"bashkiria.su",
"bryansk.su",
"bukhara.su",
"chimkent.su",
"dagestan.su",
"east-kazakhstan.su",
"exnet.su",
"georgia.su",
"grozny.su",
"ivanovo.su",
"jambyl.su",
"kalmykia.su",
"kaluga.su",
"karacol.su",
"karaganda.su",
"karelia.su",
"khakassia.su",
"krasnodar.su",
"kurgan.su",
"kustanai.su",
"lenug.su",
"mangyshlak.su",
"mordovia.su",
"msk.su",
"murmansk.su",
"nalchik.su",
"navoi.su",
"north-kazakhstan.su",
"nov.su",
"obninsk.su",
"penza.su",
"pokrovsk.su",
"sochi.su",
"spb.su",
"tashkent.su",
"termez.su",
"togliatti.su",
"troitsk.su",
"tselinograd.su",
"tula.su",
"tuva.su",
"vladikavkaz.su",
"vladimir.su",
"vologda.su",
"channelsdvr.net",
"u.channelsdvr.net",
"fastly-terrarium.com",
"fastlylb.net",
"map.fastlylb.net",
"freetls.fastly.net",
"map.fastly.net",
"a.prod.fastly.net",
"global.prod.fastly.net",
"a.ssl.fastly.net",
"b.ssl.fastly.net",
"global.ssl.fastly.net",
"fastpanel.direct",
"fastvps-server.com",
"fhapp.xyz",
"fedorainfracloud.org",
"fedorapeople.org",
"cloud.fedoraproject.org",
"app.os.fedoraproject.org",
"app.os.stg.fedoraproject.org",
"mydobiss.com",
"filegear.me",
"filegear-au.me",
"filegear-de.me",
"filegear-gb.me",
"filegear-ie.me",
"filegear-jp.me",
"filegear-sg.me",
"firebaseapp.com",
"flynnhub.com",
"flynnhosting.net",
"0e.vc",
"freebox-os.com",
"freeboxos.com",
"fbx-os.fr",
"fbxos.fr",
"freebox-os.fr",
"freeboxos.fr",
"freedesktop.org",
"*.futurecms.at",
"*.ex.futurecms.at",
"*.in.futurecms.at",
"futurehosting.at",
"futuremailing.at",
"*.ex.ortsinfo.at",
"*.kunden.ortsinfo.at",
"*.statics.cloud",
"service.gov.uk",
"gehirn.ne.jp",
"usercontent.jp",
"gentapps.com",
"lab.ms",
"github.io",
"githubusercontent.com",
"gitlab.io",
"glitch.me",
"lolipop.io",
"cloudapps.digital",
"london.cloudapps.digital",
"homeoffice.gov.uk",
"ro.im",
"shop.ro",
"goip.de",
"run.app",
"a.run.app",
"web.app",
"*.0emm.com",
"appspot.com",
"*.r.appspot.com",
"blogspot.ae",
"blogspot.al",
"blogspot.am",
"blogspot.ba",
"blogspot.be",
"blogspot.bg",
"blogspot.bj",
"blogspot.ca",
"blogspot.cf",
"blogspot.ch",
"blogspot.cl",
"blogspot.co.at",
"blogspot.co.id",
"blogspot.co.il",
"blogspot.co.ke",
"blogspot.co.nz",
"blogspot.co.uk",
"blogspot.co.za",
"blogspot.com",
"blogspot.com.ar",
"blogspot.com.au",
"blogspot.com.br",
"blogspot.com.by",
"blogspot.com.co",
"blogspot.com.cy",
"blogspot.com.ee",
"blogspot.com.eg",
"blogspot.com.es",
"blogspot.com.mt",
"blogspot.com.ng",
"blogspot.com.tr",
"blogspot.com.uy",
"blogspot.cv",
"blogspot.cz",
"blogspot.de",
"blogspot.dk",
"blogspot.fi",
"blogspot.fr",
"blogspot.gr",
"blogspot.hk",
"blogspot.hr",
"blogspot.hu",
"blogspot.ie",
"blogspot.in",
"blogspot.is",
"blogspot.it",
"blogspot.jp",
"blogspot.kr",
"blogspot.li",
"blogspot.lt",
"blogspot.lu",
"blogspot.md",
"blogspot.mk",
"blogspot.mr",
"blogspot.mx",
"blogspot.my",
"blogspot.nl",
"blogspot.no",
"blogspot.pe",
"blogspot.pt",
"blogspot.qa",
"blogspot.re",
"blogspot.ro",
"blogspot.rs",
"blogspot.ru",
"blogspot.se",
"blogspot.sg",
"blogspot.si",
"blogspot.sk",
"blogspot.sn",
"blogspot.td",
"blogspot.tw",
"blogspot.ug",
"blogspot.vn",
"cloudfunctions.net",
"cloud.goog",
"codespot.com",
"googleapis.com",
"googlecode.com",
"pagespeedmobilizer.com",
"publishproxy.com",
"withgoogle.com",
"withyoutube.com",
"awsmppl.com",
"fin.ci",
"free.hr",
"caa.li",
"ua.rs",
"conf.se",
"hs.zone",
"hs.run",
"hashbang.sh",
"hasura.app",
"hasura-app.io",
"hepforge.org",
"herokuapp.com",
"herokussl.com",
"myravendb.com",
"ravendb.community",
"ravendb.me",
"development.run",
"ravendb.run",
"bpl.biz",
"orx.biz",
"ng.city",
"biz.gl",
"ng.ink",
"col.ng",
"firm.ng",
"gen.ng",
"ltd.ng",
"ngo.ng",
"ng.school",
"sch.so",
"häkkinen.fi",
"*.moonscale.io",
"moonscale.net",
"iki.fi",
"dyn-berlin.de",
"in-berlin.de",
"in-brb.de",
"in-butter.de",
"in-dsl.de",
"in-dsl.net",
"in-dsl.org",
"in-vpn.de",
"in-vpn.net",
"in-vpn.org",
"biz.at",
"info.at",
"info.cx",
"ac.leg.br",
"al.leg.br",
"am.leg.br",
"ap.leg.br",
"ba.leg.br",
"ce.leg.br",
"df.leg.br",
"es.leg.br",
"go.leg.br",
"ma.leg.br",
"mg.leg.br",
"ms.leg.br",
"mt.leg.br",
"pa.leg.br",
"pb.leg.br",
"pe.leg.br",
"pi.leg.br",
"pr.leg.br",
"rj.leg.br",
"rn.leg.br",
"ro.leg.br",
"rr.leg.br",
"rs.leg.br",
"sc.leg.br",
"se.leg.br",
"sp.leg.br",
"to.leg.br",
"pixolino.com",
"ipifony.net",
"mein-iserv.de",
"test-iserv.de",
"iserv.dev",
"iobb.net",
"myjino.ru",
"*.hosting.myjino.ru",
"*.landing.myjino.ru",
"*.spectrum.myjino.ru",
"*.vps.myjino.ru",
"*.triton.zone",
"*.cns.joyent.com",
"js.org",
"kaas.gg",
"khplay.nl",
"keymachine.de",
"kinghost.net",
"uni5.net",
"knightpoint.systems",
"oya.to",
"co.krd",
"edu.krd",
"git-repos.de",
"lcube-server.de",
"svn-repos.de",
"leadpages.co",
"lpages.co",
"lpusercontent.com",
"lelux.site",
"co.business",
"co.education",
"co.events",
"co.financial",
"co.network",
"co.place",
"co.technology",
"app.lmpm.com",
"linkitools.space",
"linkyard.cloud",
"linkyard-cloud.ch",
"members.linode.com",
"nodebalancer.linode.com",
"we.bs",
"loginline.app",
"loginline.dev",
"loginline.io",
"loginline.services",
"loginline.site",
"krasnik.pl",
"leczna.pl",
"lubartow.pl",
"lublin.pl",
"poniatowa.pl",
"swidnik.pl",
"uklugs.org",
"glug.org.uk",
"lug.org.uk",
"lugs.org.uk",
"barsy.bg",
"barsy.co.uk",
"barsyonline.co.uk",
"barsycenter.com",
"barsyonline.com",
"barsy.club",
"barsy.de",
"barsy.eu",
"barsy.in",
"barsy.info",
"barsy.io",
"barsy.me",
"barsy.menu",
"barsy.mobi",
"barsy.net",
"barsy.online",
"barsy.org",
"barsy.pro",
"barsy.pub",
"barsy.shop",
"barsy.site",
"barsy.support",
"barsy.uk",
"*.magentosite.cloud",
"mayfirst.info",
"mayfirst.org",
"hb.cldmail.ru",
"miniserver.com",
"memset.net",
"cloud.metacentrum.cz",
"custom.metacentrum.cz",
"flt.cloud.muni.cz",
"usr.cloud.muni.cz",
"meteorapp.com",
"eu.meteorapp.com",
"co.pl",
"azurecontainer.io",
"azurewebsites.net",
"azure-mobile.net",
"cloudapp.net",
"mozilla-iot.org",
"bmoattachments.org",
"net.ru",
"org.ru",
"pp.ru",
"ui.nabu.casa",
"pony.club",
"of.fashion",
"on.fashion",
"of.football",
"in.london",
"of.london",
"for.men",
"and.mom",
"for.mom",
"for.one",
"for.sale",
"of.work",
"to.work",
"nctu.me",
"bitballoon.com",
"netlify.com",
"4u.com",
"ngrok.io",
"nh-serv.co.uk",
"nfshost.com",
"dnsking.ch",
"mypi.co",
"n4t.co",
"001www.com",
"ddnslive.com",
"myiphost.com",
"forumz.info",
"16-b.it",
"32-b.it",
"64-b.it",
"soundcast.me",
"tcp4.me",
"dnsup.net",
"hicam.net",
"now-dns.net",
"ownip.net",
"vpndns.net",
"dynserv.org",
"now-dns.org",
"x443.pw",
"now-dns.top",
"ntdll.top",
"freeddns.us",
"crafting.xyz",
"zapto.xyz",
"nsupdate.info",
"nerdpol.ovh",
"blogsyte.com",
"brasilia.me",
"cable-modem.org",
"ciscofreak.com",
"collegefan.org",
"couchpotatofries.org",
"damnserver.com",
"ddns.me",
"ditchyourip.com",
"dnsfor.me",
"dnsiskinky.com",
"dvrcam.info",
"dynns.com",
"eating-organic.net",
"fantasyleague.cc",
"geekgalaxy.com",
"golffan.us",
"health-carereform.com",
"homesecuritymac.com",
"homesecuritypc.com",
"hopto.me",
"ilovecollege.info",
"loginto.me",
"mlbfan.org",
"mmafan.biz",
"myactivedirectory.com",
"mydissent.net",
"myeffect.net",
"mymediapc.net",
"mypsx.net",
"mysecuritycamera.com",
"mysecuritycamera.net",
"mysecuritycamera.org",
"net-freaks.com",
"nflfan.org",
"nhlfan.net",
"no-ip.ca",
"no-ip.co.uk",
"no-ip.net",
"noip.us",
"onthewifi.com",
"pgafan.net",
"point2this.com",
"pointto.us",
"privatizehealthinsurance.net",
"quicksytes.com",
"read-books.org",
"securitytactics.com",
"serveexchange.com",
"servehumour.com",
"servep2p.com",
"servesarcasm.com",
"stufftoread.com",
"ufcfan.org",
"unusualperson.com",
"workisboring.com",
"3utilities.com",
"bounceme.net",
"ddns.net",
"ddnsking.com",
"gotdns.ch",
"hopto.org",
"myftp.biz",
"myftp.org",
"myvnc.com",
"no-ip.biz",
"no-ip.info",
"no-ip.org",
"noip.me",
"redirectme.net",
"servebeer.com",
"serveblog.net",
"servecounterstrike.com",
"serveftp.com",
"servegame.com",
"servehalflife.com",
"servehttp.com",
"serveirc.com",
"serveminecraft.net",
"servemp3.com",
"servepics.com",
"servequake.com",
"sytes.net",
"webhop.me",
"zapto.org",
"stage.nodeart.io",
"nodum.co",
"nodum.io",
"pcloud.host",
"nyc.mn",
"nom.ae",
"nom.af",
"nom.ai",
"nom.al",
"nym.by",
"nom.bz",
"nym.bz",
"nom.cl",
"nym.ec",
"nom.gd",
"nom.ge",
"nom.gl",
"nym.gr",
"nom.gt",
"nym.gy",
"nym.hk",
"nom.hn",
"nym.ie",
"nom.im",
"nom.ke",
"nym.kz",
"nym.la",
"nym.lc",
"nom.li",
"nym.li",
"nym.lt",
"nym.lu",
"nom.lv",
"nym.me",
"nom.mk",
"nym.mn",
"nym.mx",
"nom.nu",
"nym.nz",
"nym.pe",
"nym.pt",
"nom.pw",
"nom.qa",
"nym.ro",
"nom.rs",
"nom.si",
"nym.sk",
"nom.st",
"nym.su",
"nym.sx",
"nom.tj",
"nym.tw",
"nom.ug",
"nom.uy",
"nom.vc",
"nom.vg",
"static.observableusercontent.com",
"cya.gg",
"cloudycluster.net",
"nid.io",
"opencraft.hosting",
"operaunite.com",
"skygearapp.com",
"outsystemscloud.com",
"ownprovider.com",
"own.pm",
"ox.rs",
"oy.lc",
"pgfog.com",
"pagefrontapp.com",
"art.pl",
"gliwice.pl",
"krakow.pl",
"poznan.pl",
"wroc.pl",
"zakopane.pl",
"pantheonsite.io",
"gotpantheon.com",
"mypep.link",
"perspecta.cloud",
"on-web.fr",
"*.platform.sh",
"*.platformsh.site",
"dyn53.io",
"co.bn",
"xen.prgmr.com",
"priv.at",
"prvcy.page",
"*.dweb.link",
"protonet.io",
"chirurgiens-dentistes-en-france.fr",
"byen.site",
"pubtls.org",
"qualifioapp.com",
"qbuser.com",
"instantcloud.cn",
"ras.ru",
"qa2.com",
"qcx.io",
"*.sys.qcx.io",
"dev-myqnapcloud.com",
"alpha-myqnapcloud.com",
"myqnapcloud.com",
"*.quipelements.com",
"vapor.cloud",
"vaporcloud.io",
"rackmaze.com",
"rackmaze.net",
"*.on-k3s.io",
"*.on-rancher.cloud",
"*.on-rio.io",
"readthedocs.io",
"rhcloud.com",
"app.render.com",
"onrender.com",
"repl.co",
"repl.run",
"resindevice.io",
"devices.resinstaging.io",
"hzc.io",
"wellbeingzone.eu",
"ptplus.fit",
"wellbeingzone.co.uk",
"git-pages.rit.edu",
"sandcats.io",
"logoip.de",
"logoip.com",
"schokokeks.net",
"gov.scot",
"scrysec.com",
"firewall-gateway.com",
"firewall-gateway.de",
"my-gateway.de",
"my-router.de",
"spdns.de",
"spdns.eu",
"firewall-gateway.net",
"my-firewall.org",
"myfirewall.org",
"spdns.org",
"senseering.net",
"biz.ua",
"co.ua",
"pp.ua",
"shiftedit.io",
"myshopblocks.com",
"shopitsite.com",
"mo-siemens.io",
"1kapp.com",
"appchizi.com",
"applinzi.com",
"sinaapp.com",
"vipsinaapp.com",
"siteleaf.net",
"bounty-full.com",
"alpha.bounty-full.com",
"beta.bounty-full.com",
"stackhero-network.com",
"static.land",
"dev.static.land",
"sites.static.land",
"apps.lair.io",
"*.stolos.io",
"spacekit.io",
"customer.speedpartner.de",
"api.stdlib.com",
"storj.farm",
"utwente.io",
"soc.srcf.net",
"user.srcf.net",
"temp-dns.com",
"applicationcloud.io",
"scapp.io",
"*.s5y.io",
"*.sensiosite.cloud",
"syncloud.it",
"diskstation.me",
"dscloud.biz",
"dscloud.me",
"dscloud.mobi",
"dsmynas.com",
"dsmynas.net",
"dsmynas.org",
"familyds.com",
"familyds.net",
"familyds.org",
"i234.me",
"myds.me",
"synology.me",
"vpnplus.to",
"direct.quickconnect.to",
"taifun-dns.de",
"gda.pl",
"gdansk.pl",
"gdynia.pl",
"med.pl",
"sopot.pl",
"edugit.org",
"telebit.app",
"telebit.io",
"*.telebit.xyz",
"gwiddle.co.uk",
"thingdustdata.com",
"cust.dev.thingdust.io",
"cust.disrec.thingdust.io",
"cust.prod.thingdust.io",
"cust.testing.thingdust.io",
"arvo.network",
"azimuth.network",
"bloxcms.com",
"townnews-staging.com",
"12hp.at",
"2ix.at",
"4lima.at",
"lima-city.at",
"12hp.ch",
"2ix.ch",
"4lima.ch",
"lima-city.ch",
"trafficplex.cloud",
"de.cool",
"12hp.de",
"2ix.de",
"4lima.de",
"lima-city.de",
"1337.pictures",
"clan.rip",
"lima-city.rocks",
"webspace.rocks",
"lima.zone",
"*.transurl.be",
"*.transurl.eu",
"*.transurl.nl",
"tuxfamily.org",
"dd-dns.de",
"diskstation.eu",
"diskstation.org",
"dray-dns.de",
"draydns.de",
"dyn-vpn.de",
"dynvpn.de",
"mein-vigor.de",
"my-vigor.de",
"my-wan.de",
"syno-ds.de",
"synology-diskstation.de",
"synology-ds.de",
"uber.space",
"*.uberspace.de",
"hk.com",
"hk.org",
"ltd.hk",
"inc.hk",
"virtualuser.de",
"virtual-user.de",
"urown.cloud",
"dnsupdate.info",
"lib.de.us",
"2038.io",
"router.management",
"v-info.info",
"voorloper.cloud",
"v.ua",
"wafflecell.com",
"*.webhare.dev",
"wedeploy.io",
"wedeploy.me",
"wedeploy.sh",
"remotewd.com",
"wmflabs.org",
"myforum.community",
"community-pro.de",
"diskussionsbereich.de",
"community-pro.net",
"meinforum.net",
"half.host",
"xnbay.com",
"u2.xnbay.com",
"u2-local.xnbay.com",
"cistron.nl",
"demon.nl",
"xs4all.space",
"yandexcloud.net",
"storage.yandexcloud.net",
"website.yandexcloud.net",
"official.academy",
"yolasite.com",
"ybo.faith",
"yombo.me",
"homelink.one",
"ybo.party",
"ybo.review",
"ybo.science",
"ybo.trade",
"nohost.me",
"noho.st",
"za.net",
"za.org",
"now.sh",
"bss.design",
"basicserver.io",
"virtualserver.io",
"enterprisecloud.nu"
]
},{}],66:[function(require,module,exports){
/*eslint no-var:0, prefer-arrow-callback: 0, object-shorthand: 0 */
'use strict';


var Punycode = require('punycode');


var internals = {};


//
// Read rules from file.
//
internals.rules = require('./data/rules.json').map(function (rule) {

  return {
    rule: rule,
    suffix: rule.replace(/^(\*\.|\!)/, ''),
    punySuffix: -1,
    wildcard: rule.charAt(0) === '*',
    exception: rule.charAt(0) === '!'
  };
});


//
// Check is given string ends with `suffix`.
//
internals.endsWith = function (str, suffix) {

  return str.indexOf(suffix, str.length - suffix.length) !== -1;
};


//
// Find rule for a given domain.
//
internals.findRule = function (domain) {

  var punyDomain = Punycode.toASCII(domain);
  return internals.rules.reduce(function (memo, rule) {

    if (rule.punySuffix === -1){
      rule.punySuffix = Punycode.toASCII(rule.suffix);
    }
    if (!internals.endsWith(punyDomain, '.' + rule.punySuffix) && punyDomain !== rule.punySuffix) {
      return memo;
    }
    // This has been commented out as it never seems to run. This is because
    // sub tlds always appear after their parents and we never find a shorter
    // match.
    //if (memo) {
    //  var memoSuffix = Punycode.toASCII(memo.suffix);
    //  if (memoSuffix.length >= punySuffix.length) {
    //    return memo;
    //  }
    //}
    return rule;
  }, null);
};


//
// Error codes and messages.
//
exports.errorCodes = {
  DOMAIN_TOO_SHORT: 'Domain name too short.',
  DOMAIN_TOO_LONG: 'Domain name too long. It should be no more than 255 chars.',
  LABEL_STARTS_WITH_DASH: 'Domain name label can not start with a dash.',
  LABEL_ENDS_WITH_DASH: 'Domain name label can not end with a dash.',
  LABEL_TOO_LONG: 'Domain name label should be at most 63 chars long.',
  LABEL_TOO_SHORT: 'Domain name label should be at least 1 character long.',
  LABEL_INVALID_CHARS: 'Domain name label can only contain alphanumeric characters or dashes.'
};


//
// Validate domain name and throw if not valid.
//
// From wikipedia:
//
// Hostnames are composed of series of labels concatenated with dots, as are all
// domain names. Each label must be between 1 and 63 characters long, and the
// entire hostname (including the delimiting dots) has a maximum of 255 chars.
//
// Allowed chars:
//
// * `a-z`
// * `0-9`
// * `-` but not as a starting or ending character
// * `.` as a separator for the textual portions of a domain name
//
// * http://en.wikipedia.org/wiki/Domain_name
// * http://en.wikipedia.org/wiki/Hostname
//
internals.validate = function (input) {

  // Before we can validate we need to take care of IDNs with unicode chars.
  var ascii = Punycode.toASCII(input);

  if (ascii.length < 1) {
    return 'DOMAIN_TOO_SHORT';
  }
  if (ascii.length > 255) {
    return 'DOMAIN_TOO_LONG';
  }

  // Check each part's length and allowed chars.
  var labels = ascii.split('.');
  var label;

  for (var i = 0; i < labels.length; ++i) {
    label = labels[i];
    if (!label.length) {
      return 'LABEL_TOO_SHORT';
    }
    if (label.length > 63) {
      return 'LABEL_TOO_LONG';
    }
    if (label.charAt(0) === '-') {
      return 'LABEL_STARTS_WITH_DASH';
    }
    if (label.charAt(label.length - 1) === '-') {
      return 'LABEL_ENDS_WITH_DASH';
    }
    if (!/^[a-z0-9\-]+$/.test(label)) {
      return 'LABEL_INVALID_CHARS';
    }
  }
};


//
// Public API
//


//
// Parse domain.
//
exports.parse = function (input) {

  if (typeof input !== 'string') {
    throw new TypeError('Domain name must be a string.');
  }

  // Force domain to lowercase.
  var domain = input.slice(0).toLowerCase();

  // Handle FQDN.
  // TODO: Simply remove trailing dot?
  if (domain.charAt(domain.length - 1) === '.') {
    domain = domain.slice(0, domain.length - 1);
  }

  // Validate and sanitise input.
  var error = internals.validate(domain);
  if (error) {
    return {
      input: input,
      error: {
        message: exports.errorCodes[error],
        code: error
      }
    };
  }

  var parsed = {
    input: input,
    tld: null,
    sld: null,
    domain: null,
    subdomain: null,
    listed: false
  };

  var domainParts = domain.split('.');

  // Non-Internet TLD
  if (domainParts[domainParts.length - 1] === 'local') {
    return parsed;
  }

  var handlePunycode = function () {

    if (!/xn--/.test(domain)) {
      return parsed;
    }
    if (parsed.domain) {
      parsed.domain = Punycode.toASCII(parsed.domain);
    }
    if (parsed.subdomain) {
      parsed.subdomain = Punycode.toASCII(parsed.subdomain);
    }
    return parsed;
  };

  var rule = internals.findRule(domain);

  // Unlisted tld.
  if (!rule) {
    if (domainParts.length < 2) {
      return parsed;
    }
    parsed.tld = domainParts.pop();
    parsed.sld = domainParts.pop();
    parsed.domain = [parsed.sld, parsed.tld].join('.');
    if (domainParts.length) {
      parsed.subdomain = domainParts.pop();
    }
    return handlePunycode();
  }

  // At this point we know the public suffix is listed.
  parsed.listed = true;

  var tldParts = rule.suffix.split('.');
  var privateParts = domainParts.slice(0, domainParts.length - tldParts.length);

  if (rule.exception) {
    privateParts.push(tldParts.shift());
  }

  parsed.tld = tldParts.join('.');

  if (!privateParts.length) {
    return handlePunycode();
  }

  if (rule.wildcard) {
    tldParts.unshift(privateParts.pop());
    parsed.tld = tldParts.join('.');
  }

  if (!privateParts.length) {
    return handlePunycode();
  }

  parsed.sld = privateParts.pop();
  parsed.domain = [parsed.sld,  parsed.tld].join('.');

  if (privateParts.length) {
    parsed.subdomain = privateParts.join('.');
  }

  return handlePunycode();
};


//
// Get domain.
//
exports.get = function (domain) {

  if (!domain) {
    return null;
  }
  return exports.parse(domain).domain || null;
};


//
// Check whether domain belongs to a known public suffix.
//
exports.isValid = function (domain) {

  var parsed = exports.parse(domain);
  return Boolean(parsed.domain && parsed.listed);
};

},{"./data/rules.json":65,"punycode":67}],67:[function(require,module,exports){
(function (global){(function (){
/*! https://mths.be/punycode v1.4.1 by @mathias */
;(function(root) {

	/** Detect free variables */
	var freeExports = typeof exports == 'object' && exports &&
		!exports.nodeType && exports;
	var freeModule = typeof module == 'object' && module &&
		!module.nodeType && module;
	var freeGlobal = typeof global == 'object' && global;
	if (
		freeGlobal.global === freeGlobal ||
		freeGlobal.window === freeGlobal ||
		freeGlobal.self === freeGlobal
	) {
		root = freeGlobal;
	}

	/**
	 * The `punycode` object.
	 * @name punycode
	 * @type Object
	 */
	var punycode,

	/** Highest positive signed 32-bit float value */
	maxInt = 2147483647, // aka. 0x7FFFFFFF or 2^31-1

	/** Bootstring parameters */
	base = 36,
	tMin = 1,
	tMax = 26,
	skew = 38,
	damp = 700,
	initialBias = 72,
	initialN = 128, // 0x80
	delimiter = '-', // '\x2D'

	/** Regular expressions */
	regexPunycode = /^xn--/,
	regexNonASCII = /[^\x20-\x7E]/, // unprintable ASCII chars + non-ASCII chars
	regexSeparators = /[\x2E\u3002\uFF0E\uFF61]/g, // RFC 3490 separators

	/** Error messages */
	errors = {
		'overflow': 'Overflow: input needs wider integers to process',
		'not-basic': 'Illegal input >= 0x80 (not a basic code point)',
		'invalid-input': 'Invalid input'
	},

	/** Convenience shortcuts */
	baseMinusTMin = base - tMin,
	floor = Math.floor,
	stringFromCharCode = String.fromCharCode,

	/** Temporary variable */
	key;

	/*--------------------------------------------------------------------------*/

	/**
	 * A generic error utility function.
	 * @private
	 * @param {String} type The error type.
	 * @returns {Error} Throws a `RangeError` with the applicable error message.
	 */
	function error(type) {
		throw new RangeError(errors[type]);
	}

	/**
	 * A generic `Array#map` utility function.
	 * @private
	 * @param {Array} array The array to iterate over.
	 * @param {Function} callback The function that gets called for every array
	 * item.
	 * @returns {Array} A new array of values returned by the callback function.
	 */
	function map(array, fn) {
		var length = array.length;
		var result = [];
		while (length--) {
			result[length] = fn(array[length]);
		}
		return result;
	}

	/**
	 * A simple `Array#map`-like wrapper to work with domain name strings or email
	 * addresses.
	 * @private
	 * @param {String} domain The domain name or email address.
	 * @param {Function} callback The function that gets called for every
	 * character.
	 * @returns {Array} A new string of characters returned by the callback
	 * function.
	 */
	function mapDomain(string, fn) {
		var parts = string.split('@');
		var result = '';
		if (parts.length > 1) {
			// In email addresses, only the domain name should be punycoded. Leave
			// the local part (i.e. everything up to `@`) intact.
			result = parts[0] + '@';
			string = parts[1];
		}
		// Avoid `split(regex)` for IE8 compatibility. See #17.
		string = string.replace(regexSeparators, '\x2E');
		var labels = string.split('.');
		var encoded = map(labels, fn).join('.');
		return result + encoded;
	}

	/**
	 * Creates an array containing the numeric code points of each Unicode
	 * character in the string. While JavaScript uses UCS-2 internally,
	 * this function will convert a pair of surrogate halves (each of which
	 * UCS-2 exposes as separate characters) into a single code point,
	 * matching UTF-16.
	 * @see `punycode.ucs2.encode`
	 * @see <https://mathiasbynens.be/notes/javascript-encoding>
	 * @memberOf punycode.ucs2
	 * @name decode
	 * @param {String} string The Unicode input string (UCS-2).
	 * @returns {Array} The new array of code points.
	 */
	function ucs2decode(string) {
		var output = [],
		    counter = 0,
		    length = string.length,
		    value,
		    extra;
		while (counter < length) {
			value = string.charCodeAt(counter++);
			if (value >= 0xD800 && value <= 0xDBFF && counter < length) {
				// high surrogate, and there is a next character
				extra = string.charCodeAt(counter++);
				if ((extra & 0xFC00) == 0xDC00) { // low surrogate
					output.push(((value & 0x3FF) << 10) + (extra & 0x3FF) + 0x10000);
				} else {
					// unmatched surrogate; only append this code unit, in case the next
					// code unit is the high surrogate of a surrogate pair
					output.push(value);
					counter--;
				}
			} else {
				output.push(value);
			}
		}
		return output;
	}

	/**
	 * Creates a string based on an array of numeric code points.
	 * @see `punycode.ucs2.decode`
	 * @memberOf punycode.ucs2
	 * @name encode
	 * @param {Array} codePoints The array of numeric code points.
	 * @returns {String} The new Unicode string (UCS-2).
	 */
	function ucs2encode(array) {
		return map(array, function(value) {
			var output = '';
			if (value > 0xFFFF) {
				value -= 0x10000;
				output += stringFromCharCode(value >>> 10 & 0x3FF | 0xD800);
				value = 0xDC00 | value & 0x3FF;
			}
			output += stringFromCharCode(value);
			return output;
		}).join('');
	}

	/**
	 * Converts a basic code point into a digit/integer.
	 * @see `digitToBasic()`
	 * @private
	 * @param {Number} codePoint The basic numeric code point value.
	 * @returns {Number} The numeric value of a basic code point (for use in
	 * representing integers) in the range `0` to `base - 1`, or `base` if
	 * the code point does not represent a value.
	 */
	function basicToDigit(codePoint) {
		if (codePoint - 48 < 10) {
			return codePoint - 22;
		}
		if (codePoint - 65 < 26) {
			return codePoint - 65;
		}
		if (codePoint - 97 < 26) {
			return codePoint - 97;
		}
		return base;
	}

	/**
	 * Converts a digit/integer into a basic code point.
	 * @see `basicToDigit()`
	 * @private
	 * @param {Number} digit The numeric value of a basic code point.
	 * @returns {Number} The basic code point whose value (when used for
	 * representing integers) is `digit`, which needs to be in the range
	 * `0` to `base - 1`. If `flag` is non-zero, the uppercase form is
	 * used; else, the lowercase form is used. The behavior is undefined
	 * if `flag` is non-zero and `digit` has no uppercase form.
	 */
	function digitToBasic(digit, flag) {
		//  0..25 map to ASCII a..z or A..Z
		// 26..35 map to ASCII 0..9
		return digit + 22 + 75 * (digit < 26) - ((flag != 0) << 5);
	}

	/**
	 * Bias adaptation function as per section 3.4 of RFC 3492.
	 * https://tools.ietf.org/html/rfc3492#section-3.4
	 * @private
	 */
	function adapt(delta, numPoints, firstTime) {
		var k = 0;
		delta = firstTime ? floor(delta / damp) : delta >> 1;
		delta += floor(delta / numPoints);
		for (/* no initialization */; delta > baseMinusTMin * tMax >> 1; k += base) {
			delta = floor(delta / baseMinusTMin);
		}
		return floor(k + (baseMinusTMin + 1) * delta / (delta + skew));
	}

	/**
	 * Converts a Punycode string of ASCII-only symbols to a string of Unicode
	 * symbols.
	 * @memberOf punycode
	 * @param {String} input The Punycode string of ASCII-only symbols.
	 * @returns {String} The resulting string of Unicode symbols.
	 */
	function decode(input) {
		// Don't use UCS-2
		var output = [],
		    inputLength = input.length,
		    out,
		    i = 0,
		    n = initialN,
		    bias = initialBias,
		    basic,
		    j,
		    index,
		    oldi,
		    w,
		    k,
		    digit,
		    t,
		    /** Cached calculation results */
		    baseMinusT;

		// Handle the basic code points: let `basic` be the number of input code
		// points before the last delimiter, or `0` if there is none, then copy
		// the first basic code points to the output.

		basic = input.lastIndexOf(delimiter);
		if (basic < 0) {
			basic = 0;
		}

		for (j = 0; j < basic; ++j) {
			// if it's not a basic code point
			if (input.charCodeAt(j) >= 0x80) {
				error('not-basic');
			}
			output.push(input.charCodeAt(j));
		}

		// Main decoding loop: start just after the last delimiter if any basic code
		// points were copied; start at the beginning otherwise.

		for (index = basic > 0 ? basic + 1 : 0; index < inputLength; /* no final expression */) {

			// `index` is the index of the next character to be consumed.
			// Decode a generalized variable-length integer into `delta`,
			// which gets added to `i`. The overflow checking is easier
			// if we increase `i` as we go, then subtract off its starting
			// value at the end to obtain `delta`.
			for (oldi = i, w = 1, k = base; /* no condition */; k += base) {

				if (index >= inputLength) {
					error('invalid-input');
				}

				digit = basicToDigit(input.charCodeAt(index++));

				if (digit >= base || digit > floor((maxInt - i) / w)) {
					error('overflow');
				}

				i += digit * w;
				t = k <= bias ? tMin : (k >= bias + tMax ? tMax : k - bias);

				if (digit < t) {
					break;
				}

				baseMinusT = base - t;
				if (w > floor(maxInt / baseMinusT)) {
					error('overflow');
				}

				w *= baseMinusT;

			}

			out = output.length + 1;
			bias = adapt(i - oldi, out, oldi == 0);

			// `i` was supposed to wrap around from `out` to `0`,
			// incrementing `n` each time, so we'll fix that now:
			if (floor(i / out) > maxInt - n) {
				error('overflow');
			}

			n += floor(i / out);
			i %= out;

			// Insert `n` at position `i` of the output
			output.splice(i++, 0, n);

		}

		return ucs2encode(output);
	}

	/**
	 * Converts a string of Unicode symbols (e.g. a domain name label) to a
	 * Punycode string of ASCII-only symbols.
	 * @memberOf punycode
	 * @param {String} input The string of Unicode symbols.
	 * @returns {String} The resulting Punycode string of ASCII-only symbols.
	 */
	function encode(input) {
		var n,
		    delta,
		    handledCPCount,
		    basicLength,
		    bias,
		    j,
		    m,
		    q,
		    k,
		    t,
		    currentValue,
		    output = [],
		    /** `inputLength` will hold the number of code points in `input`. */
		    inputLength,
		    /** Cached calculation results */
		    handledCPCountPlusOne,
		    baseMinusT,
		    qMinusT;

		// Convert the input in UCS-2 to Unicode
		input = ucs2decode(input);

		// Cache the length
		inputLength = input.length;

		// Initialize the state
		n = initialN;
		delta = 0;
		bias = initialBias;

		// Handle the basic code points
		for (j = 0; j < inputLength; ++j) {
			currentValue = input[j];
			if (currentValue < 0x80) {
				output.push(stringFromCharCode(currentValue));
			}
		}

		handledCPCount = basicLength = output.length;

		// `handledCPCount` is the number of code points that have been handled;
		// `basicLength` is the number of basic code points.

		// Finish the basic string - if it is not empty - with a delimiter
		if (basicLength) {
			output.push(delimiter);
		}

		// Main encoding loop:
		while (handledCPCount < inputLength) {

			// All non-basic code points < n have been handled already. Find the next
			// larger one:
			for (m = maxInt, j = 0; j < inputLength; ++j) {
				currentValue = input[j];
				if (currentValue >= n && currentValue < m) {
					m = currentValue;
				}
			}

			// Increase `delta` enough to advance the decoder's <n,i> state to <m,0>,
			// but guard against overflow
			handledCPCountPlusOne = handledCPCount + 1;
			if (m - n > floor((maxInt - delta) / handledCPCountPlusOne)) {
				error('overflow');
			}

			delta += (m - n) * handledCPCountPlusOne;
			n = m;

			for (j = 0; j < inputLength; ++j) {
				currentValue = input[j];

				if (currentValue < n && ++delta > maxInt) {
					error('overflow');
				}

				if (currentValue == n) {
					// Represent delta as a generalized variable-length integer
					for (q = delta, k = base; /* no condition */; k += base) {
						t = k <= bias ? tMin : (k >= bias + tMax ? tMax : k - bias);
						if (q < t) {
							break;
						}
						qMinusT = q - t;
						baseMinusT = base - t;
						output.push(
							stringFromCharCode(digitToBasic(t + qMinusT % baseMinusT, 0))
						);
						q = floor(qMinusT / baseMinusT);
					}

					output.push(stringFromCharCode(digitToBasic(q, 0)));
					bias = adapt(delta, handledCPCountPlusOne, handledCPCount == basicLength);
					delta = 0;
					++handledCPCount;
				}
			}

			++delta;
			++n;

		}
		return output.join('');
	}

	/**
	 * Converts a Punycode string representing a domain name or an email address
	 * to Unicode. Only the Punycoded parts of the input will be converted, i.e.
	 * it doesn't matter if you call it on a string that has already been
	 * converted to Unicode.
	 * @memberOf punycode
	 * @param {String} input The Punycoded domain name or email address to
	 * convert to Unicode.
	 * @returns {String} The Unicode representation of the given Punycode
	 * string.
	 */
	function toUnicode(input) {
		return mapDomain(input, function(string) {
			return regexPunycode.test(string)
				? decode(string.slice(4).toLowerCase())
				: string;
		});
	}

	/**
	 * Converts a Unicode string representing a domain name or an email address to
	 * Punycode. Only the non-ASCII parts of the domain name will be converted,
	 * i.e. it doesn't matter if you call it with a domain that's already in
	 * ASCII.
	 * @memberOf punycode
	 * @param {String} input The domain name or email address to convert, as a
	 * Unicode string.
	 * @returns {String} The Punycode representation of the given domain name or
	 * email address.
	 */
	function toASCII(input) {
		return mapDomain(input, function(string) {
			return regexNonASCII.test(string)
				? 'xn--' + encode(string)
				: string;
		});
	}

	/*--------------------------------------------------------------------------*/

	/** Define the public API */
	punycode = {
		/**
		 * A string representing the current Punycode.js version number.
		 * @memberOf punycode
		 * @type String
		 */
		'version': '1.4.1',
		/**
		 * An object of methods to convert from JavaScript's internal character
		 * representation (UCS-2) to Unicode code points, and back.
		 * @see <https://mathiasbynens.be/notes/javascript-encoding>
		 * @memberOf punycode
		 * @type Object
		 */
		'ucs2': {
			'decode': ucs2decode,
			'encode': ucs2encode
		},
		'decode': decode,
		'encode': encode,
		'toASCII': toASCII,
		'toUnicode': toUnicode
	};

	/** Expose `punycode` */
	// Some AMD build optimizers, like r.js, check for specific condition patterns
	// like the following:
	if (
		typeof define == 'function' &&
		typeof define.amd == 'object' &&
		define.amd
	) {
		define('punycode', function() {
			return punycode;
		});
	} else if (freeExports && freeModule) {
		if (module.exports == freeExports) {
			// in Node.js, io.js, or RingoJS v0.8.0+
			freeModule.exports = punycode;
		} else {
			// in Narwhal or RingoJS v0.7.0-
			for (key in punycode) {
				punycode.hasOwnProperty(key) && (freeExports[key] = punycode[key]);
			}
		}
	} else {
		// in Rhino or a web browser
		root.punycode = punycode;
	}

}(this));

}).call(this)}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}],68:[function(require,module,exports){
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

'use strict';

// If obj.hasOwnProperty has been overridden, then calling
// obj.hasOwnProperty(prop) will break.
// See: https://github.com/joyent/node/issues/1707
function hasOwnProperty(obj, prop) {
  return Object.prototype.hasOwnProperty.call(obj, prop);
}

module.exports = function(qs, sep, eq, options) {
  sep = sep || '&';
  eq = eq || '=';
  var obj = {};

  if (typeof qs !== 'string' || qs.length === 0) {
    return obj;
  }

  var regexp = /\+/g;
  qs = qs.split(sep);

  var maxKeys = 1000;
  if (options && typeof options.maxKeys === 'number') {
    maxKeys = options.maxKeys;
  }

  var len = qs.length;
  // maxKeys <= 0 means that we should not limit keys count
  if (maxKeys > 0 && len > maxKeys) {
    len = maxKeys;
  }

  for (var i = 0; i < len; ++i) {
    var x = qs[i].replace(regexp, '%20'),
        idx = x.indexOf(eq),
        kstr, vstr, k, v;

    if (idx >= 0) {
      kstr = x.substr(0, idx);
      vstr = x.substr(idx + 1);
    } else {
      kstr = x;
      vstr = '';
    }

    k = decodeURIComponent(kstr);
    v = decodeURIComponent(vstr);

    if (!hasOwnProperty(obj, k)) {
      obj[k] = v;
    } else if (isArray(obj[k])) {
      obj[k].push(v);
    } else {
      obj[k] = [obj[k], v];
    }
  }

  return obj;
};

var isArray = Array.isArray || function (xs) {
  return Object.prototype.toString.call(xs) === '[object Array]';
};

},{}],69:[function(require,module,exports){
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

'use strict';

var stringifyPrimitive = function(v) {
  switch (typeof v) {
    case 'string':
      return v;

    case 'boolean':
      return v ? 'true' : 'false';

    case 'number':
      return isFinite(v) ? v : '';

    default:
      return '';
  }
};

module.exports = function(obj, sep, eq, name) {
  sep = sep || '&';
  eq = eq || '=';
  if (obj === null) {
    obj = undefined;
  }

  if (typeof obj === 'object') {
    return map(objectKeys(obj), function(k) {
      var ks = encodeURIComponent(stringifyPrimitive(k)) + eq;
      if (isArray(obj[k])) {
        return map(obj[k], function(v) {
          return ks + encodeURIComponent(stringifyPrimitive(v));
        }).join(sep);
      } else {
        return ks + encodeURIComponent(stringifyPrimitive(obj[k]));
      }
    }).join(sep);

  }

  if (!name) return '';
  return encodeURIComponent(stringifyPrimitive(name)) + eq +
         encodeURIComponent(stringifyPrimitive(obj));
};

var isArray = Array.isArray || function (xs) {
  return Object.prototype.toString.call(xs) === '[object Array]';
};

function map (xs, f) {
  if (xs.map) return xs.map(f);
  var res = [];
  for (var i = 0; i < xs.length; i++) {
    res.push(f(xs[i], i));
  }
  return res;
}

var objectKeys = Object.keys || function (obj) {
  var res = [];
  for (var key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) res.push(key);
  }
  return res;
};

},{}],70:[function(require,module,exports){
'use strict';

exports.decode = exports.parse = require('./decode');
exports.encode = exports.stringify = require('./encode');

},{"./decode":68,"./encode":69}],71:[function(require,module,exports){
/*!
 * Copyright (c) 2015, Salesforce.com, Inc.
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are met:
 *
 * 1. Redistributions of source code must retain the above copyright notice,
 * this list of conditions and the following disclaimer.
 *
 * 2. Redistributions in binary form must reproduce the above copyright notice,
 * this list of conditions and the following disclaimer in the documentation
 * and/or other materials provided with the distribution.
 *
 * 3. Neither the name of Salesforce.com nor the names of its contributors may
 * be used to endorse or promote products derived from this software without
 * specific prior written permission.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
 * AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
 * IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE
 * ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE
 * LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR
 * CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF
 * SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS
 * INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN
 * CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE)
 * ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE
 * POSSIBILITY OF SUCH DAMAGE.
 */
"use strict";
const punycode = require("punycode");
const urlParse = require("url").parse;
const util = require("util");
const pubsuffix = require("./pubsuffix-psl");
const Store = require("./store").Store;
const MemoryCookieStore = require("./memstore").MemoryCookieStore;
const pathMatch = require("./pathMatch").pathMatch;
const VERSION = require("./version");
const { fromCallback } = require("universalify");

// From RFC6265 S4.1.1
// note that it excludes \x3B ";"
const COOKIE_OCTETS = /^[\x21\x23-\x2B\x2D-\x3A\x3C-\x5B\x5D-\x7E]+$/;

const CONTROL_CHARS = /[\x00-\x1F]/;

// From Chromium // '\r', '\n' and '\0' should be treated as a terminator in
// the "relaxed" mode, see:
// https://github.com/ChromiumWebApps/chromium/blob/b3d3b4da8bb94c1b2e061600df106d590fda3620/net/cookies/parsed_cookie.cc#L60
const TERMINATORS = ["\n", "\r", "\0"];

// RFC6265 S4.1.1 defines path value as 'any CHAR except CTLs or ";"'
// Note ';' is \x3B
const PATH_VALUE = /[\x20-\x3A\x3C-\x7E]+/;

// date-time parsing constants (RFC6265 S5.1.1)

const DATE_DELIM = /[\x09\x20-\x2F\x3B-\x40\x5B-\x60\x7B-\x7E]/;

const MONTH_TO_NUM = {
  jan: 0,
  feb: 1,
  mar: 2,
  apr: 3,
  may: 4,
  jun: 5,
  jul: 6,
  aug: 7,
  sep: 8,
  oct: 9,
  nov: 10,
  dec: 11
};

const MAX_TIME = 2147483647000; // 31-bit max
const MIN_TIME = 0; // 31-bit min
const SAME_SITE_CONTEXT_VAL_ERR =
  'Invalid sameSiteContext option for getCookies(); expected one of "strict", "lax", or "none"';

function checkSameSiteContext(value) {
  const context = String(value).toLowerCase();
  if (context === "none" || context === "lax" || context === "strict") {
    return context;
  } else {
    return null;
  }
}

const PrefixSecurityEnum = Object.freeze({
  SILENT: "silent",
  STRICT: "strict",
  DISABLED: "unsafe-disabled"
});

// Dumped from ip-regex@4.0.0, with the following changes:
// * all capturing groups converted to non-capturing -- "(?:)"
// * support for IPv6 Scoped Literal ("%eth1") removed
// * lowercase hexadecimal only
var IP_REGEX_LOWERCASE =/(?:^(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]\d|\d)(?:\.(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]\d|\d)){3}$)|(?:^(?:(?:[a-f\d]{1,4}:){7}(?:[a-f\d]{1,4}|:)|(?:[a-f\d]{1,4}:){6}(?:(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]\d|\d)(?:\.(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]\d|\d)){3}|:[a-f\d]{1,4}|:)|(?:[a-f\d]{1,4}:){5}(?::(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]\d|\d)(?:\.(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]\d|\d)){3}|(?::[a-f\d]{1,4}){1,2}|:)|(?:[a-f\d]{1,4}:){4}(?:(?::[a-f\d]{1,4}){0,1}:(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]\d|\d)(?:\.(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]\d|\d)){3}|(?::[a-f\d]{1,4}){1,3}|:)|(?:[a-f\d]{1,4}:){3}(?:(?::[a-f\d]{1,4}){0,2}:(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]\d|\d)(?:\.(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]\d|\d)){3}|(?::[a-f\d]{1,4}){1,4}|:)|(?:[a-f\d]{1,4}:){2}(?:(?::[a-f\d]{1,4}){0,3}:(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]\d|\d)(?:\.(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]\d|\d)){3}|(?::[a-f\d]{1,4}){1,5}|:)|(?:[a-f\d]{1,4}:){1}(?:(?::[a-f\d]{1,4}){0,4}:(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]\d|\d)(?:\.(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]\d|\d)){3}|(?::[a-f\d]{1,4}){1,6}|:)|(?::(?:(?::[a-f\d]{1,4}){0,5}:(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]\d|\d)(?:\.(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]\d|\d)){3}|(?::[a-f\d]{1,4}){1,7}|:)))$)/;

/*
 * Parses a Natural number (i.e., non-negative integer) with either the
 *    <min>*<max>DIGIT ( non-digit *OCTET )
 * or
 *    <min>*<max>DIGIT
 * grammar (RFC6265 S5.1.1).
 *
 * The "trailingOK" boolean controls if the grammar accepts a
 * "( non-digit *OCTET )" trailer.
 */
function parseDigits(token, minDigits, maxDigits, trailingOK) {
  let count = 0;
  while (count < token.length) {
    const c = token.charCodeAt(count);
    // "non-digit = %x00-2F / %x3A-FF"
    if (c <= 0x2f || c >= 0x3a) {
      break;
    }
    count++;
  }

  // constrain to a minimum and maximum number of digits.
  if (count < minDigits || count > maxDigits) {
    return null;
  }

  if (!trailingOK && count != token.length) {
    return null;
  }

  return parseInt(token.substr(0, count), 10);
}

function parseTime(token) {
  const parts = token.split(":");
  const result = [0, 0, 0];

  /* RF6256 S5.1.1:
   *      time            = hms-time ( non-digit *OCTET )
   *      hms-time        = time-field ":" time-field ":" time-field
   *      time-field      = 1*2DIGIT
   */

  if (parts.length !== 3) {
    return null;
  }

  for (let i = 0; i < 3; i++) {
    // "time-field" must be strictly "1*2DIGIT", HOWEVER, "hms-time" can be
    // followed by "( non-digit *OCTET )" so therefore the last time-field can
    // have a trailer
    const trailingOK = i == 2;
    const num = parseDigits(parts[i], 1, 2, trailingOK);
    if (num === null) {
      return null;
    }
    result[i] = num;
  }

  return result;
}

function parseMonth(token) {
  token = String(token)
    .substr(0, 3)
    .toLowerCase();
  const num = MONTH_TO_NUM[token];
  return num >= 0 ? num : null;
}

/*
 * RFC6265 S5.1.1 date parser (see RFC for full grammar)
 */
function parseDate(str) {
  if (!str) {
    return;
  }

  /* RFC6265 S5.1.1:
   * 2. Process each date-token sequentially in the order the date-tokens
   * appear in the cookie-date
   */
  const tokens = str.split(DATE_DELIM);
  if (!tokens) {
    return;
  }

  let hour = null;
  let minute = null;
  let second = null;
  let dayOfMonth = null;
  let month = null;
  let year = null;

  for (let i = 0; i < tokens.length; i++) {
    const token = tokens[i].trim();
    if (!token.length) {
      continue;
    }

    let result;

    /* 2.1. If the found-time flag is not set and the token matches the time
     * production, set the found-time flag and set the hour- value,
     * minute-value, and second-value to the numbers denoted by the digits in
     * the date-token, respectively.  Skip the remaining sub-steps and continue
     * to the next date-token.
     */
    if (second === null) {
      result = parseTime(token);
      if (result) {
        hour = result[0];
        minute = result[1];
        second = result[2];
        continue;
      }
    }

    /* 2.2. If the found-day-of-month flag is not set and the date-token matches
     * the day-of-month production, set the found-day-of- month flag and set
     * the day-of-month-value to the number denoted by the date-token.  Skip
     * the remaining sub-steps and continue to the next date-token.
     */
    if (dayOfMonth === null) {
      // "day-of-month = 1*2DIGIT ( non-digit *OCTET )"
      result = parseDigits(token, 1, 2, true);
      if (result !== null) {
        dayOfMonth = result;
        continue;
      }
    }

    /* 2.3. If the found-month flag is not set and the date-token matches the
     * month production, set the found-month flag and set the month-value to
     * the month denoted by the date-token.  Skip the remaining sub-steps and
     * continue to the next date-token.
     */
    if (month === null) {
      result = parseMonth(token);
      if (result !== null) {
        month = result;
        continue;
      }
    }

    /* 2.4. If the found-year flag is not set and the date-token matches the
     * year production, set the found-year flag and set the year-value to the
     * number denoted by the date-token.  Skip the remaining sub-steps and
     * continue to the next date-token.
     */
    if (year === null) {
      // "year = 2*4DIGIT ( non-digit *OCTET )"
      result = parseDigits(token, 2, 4, true);
      if (result !== null) {
        year = result;
        /* From S5.1.1:
         * 3.  If the year-value is greater than or equal to 70 and less
         * than or equal to 99, increment the year-value by 1900.
         * 4.  If the year-value is greater than or equal to 0 and less
         * than or equal to 69, increment the year-value by 2000.
         */
        if (year >= 70 && year <= 99) {
          year += 1900;
        } else if (year >= 0 && year <= 69) {
          year += 2000;
        }
      }
    }
  }

  /* RFC 6265 S5.1.1
   * "5. Abort these steps and fail to parse the cookie-date if:
   *     *  at least one of the found-day-of-month, found-month, found-
   *        year, or found-time flags is not set,
   *     *  the day-of-month-value is less than 1 or greater than 31,
   *     *  the year-value is less than 1601,
   *     *  the hour-value is greater than 23,
   *     *  the minute-value is greater than 59, or
   *     *  the second-value is greater than 59.
   *     (Note that leap seconds cannot be represented in this syntax.)"
   *
   * So, in order as above:
   */
  if (
    dayOfMonth === null ||
    month === null ||
    year === null ||
    second === null ||
    dayOfMonth < 1 ||
    dayOfMonth > 31 ||
    year < 1601 ||
    hour > 23 ||
    minute > 59 ||
    second > 59
  ) {
    return;
  }

  return new Date(Date.UTC(year, month, dayOfMonth, hour, minute, second));
}

function formatDate(date) {
  return date.toUTCString();
}

// S5.1.2 Canonicalized Host Names
function canonicalDomain(str) {
  if (str == null) {
    return null;
  }
  str = str.trim().replace(/^\./, ""); // S4.1.2.3 & S5.2.3: ignore leading .

  // convert to IDN if any non-ASCII characters
  if (punycode && /[^\u0001-\u007f]/.test(str)) {
    str = punycode.toASCII(str);
  }

  return str.toLowerCase();
}

// S5.1.3 Domain Matching
function domainMatch(str, domStr, canonicalize) {
  if (str == null || domStr == null) {
    return null;
  }
  if (canonicalize !== false) {
    str = canonicalDomain(str);
    domStr = canonicalDomain(domStr);
  }

  /*
   * S5.1.3:
   * "A string domain-matches a given domain string if at least one of the
   * following conditions hold:"
   *
   * " o The domain string and the string are identical. (Note that both the
   * domain string and the string will have been canonicalized to lower case at
   * this point)"
   */
  if (str == domStr) {
    return true;
  }

  /* " o All of the following [three] conditions hold:" */

  /* "* The domain string is a suffix of the string" */
  const idx = str.indexOf(domStr);
  if (idx <= 0) {
    return false; // it's a non-match (-1) or prefix (0)
  }

  // next, check it's a proper suffix
  // e.g., "a.b.c".indexOf("b.c") === 2
  // 5 === 3+2
  if (str.length !== domStr.length + idx) {
    return false; // it's not a suffix
  }

  /* "  * The last character of the string that is not included in the
   * domain string is a %x2E (".") character." */
  if (str.substr(idx-1,1) !== '.') {
    return false; // doesn't align on "."
  }

  /* "  * The string is a host name (i.e., not an IP address)." */
  if (IP_REGEX_LOWERCASE.test(str)) {
    return false; // it's an IP address
  }

  return true;
}

// RFC6265 S5.1.4 Paths and Path-Match

/*
 * "The user agent MUST use an algorithm equivalent to the following algorithm
 * to compute the default-path of a cookie:"
 *
 * Assumption: the path (and not query part or absolute uri) is passed in.
 */
function defaultPath(path) {
  // "2. If the uri-path is empty or if the first character of the uri-path is not
  // a %x2F ("/") character, output %x2F ("/") and skip the remaining steps.
  if (!path || path.substr(0, 1) !== "/") {
    return "/";
  }

  // "3. If the uri-path contains no more than one %x2F ("/") character, output
  // %x2F ("/") and skip the remaining step."
  if (path === "/") {
    return path;
  }

  const rightSlash = path.lastIndexOf("/");
  if (rightSlash === 0) {
    return "/";
  }

  // "4. Output the characters of the uri-path from the first character up to,
  // but not including, the right-most %x2F ("/")."
  return path.slice(0, rightSlash);
}

function trimTerminator(str) {
  for (let t = 0; t < TERMINATORS.length; t++) {
    const terminatorIdx = str.indexOf(TERMINATORS[t]);
    if (terminatorIdx !== -1) {
      str = str.substr(0, terminatorIdx);
    }
  }

  return str;
}

function parseCookiePair(cookiePair, looseMode) {
  cookiePair = trimTerminator(cookiePair);

  let firstEq = cookiePair.indexOf("=");
  if (looseMode) {
    if (firstEq === 0) {
      // '=' is immediately at start
      cookiePair = cookiePair.substr(1);
      firstEq = cookiePair.indexOf("="); // might still need to split on '='
    }
  } else {
    // non-loose mode
    if (firstEq <= 0) {
      // no '=' or is at start
      return; // needs to have non-empty "cookie-name"
    }
  }

  let cookieName, cookieValue;
  if (firstEq <= 0) {
    cookieName = "";
    cookieValue = cookiePair.trim();
  } else {
    cookieName = cookiePair.substr(0, firstEq).trim();
    cookieValue = cookiePair.substr(firstEq + 1).trim();
  }

  if (CONTROL_CHARS.test(cookieName) || CONTROL_CHARS.test(cookieValue)) {
    return;
  }

  const c = new Cookie();
  c.key = cookieName;
  c.value = cookieValue;
  return c;
}

function parse(str, options) {
  if (!options || typeof options !== "object") {
    options = {};
  }
  str = str.trim();

  // We use a regex to parse the "name-value-pair" part of S5.2
  const firstSemi = str.indexOf(";"); // S5.2 step 1
  const cookiePair = firstSemi === -1 ? str : str.substr(0, firstSemi);
  const c = parseCookiePair(cookiePair, !!options.loose);
  if (!c) {
    return;
  }

  if (firstSemi === -1) {
    return c;
  }

  // S5.2.3 "unparsed-attributes consist of the remainder of the set-cookie-string
  // (including the %x3B (";") in question)." plus later on in the same section
  // "discard the first ";" and trim".
  const unparsed = str.slice(firstSemi + 1).trim();

  // "If the unparsed-attributes string is empty, skip the rest of these
  // steps."
  if (unparsed.length === 0) {
    return c;
  }

  /*
   * S5.2 says that when looping over the items "[p]rocess the attribute-name
   * and attribute-value according to the requirements in the following
   * subsections" for every item.  Plus, for many of the individual attributes
   * in S5.3 it says to use the "attribute-value of the last attribute in the
   * cookie-attribute-list".  Therefore, in this implementation, we overwrite
   * the previous value.
   */
  const cookie_avs = unparsed.split(";");
  while (cookie_avs.length) {
    const av = cookie_avs.shift().trim();
    if (av.length === 0) {
      // happens if ";;" appears
      continue;
    }
    const av_sep = av.indexOf("=");
    let av_key, av_value;

    if (av_sep === -1) {
      av_key = av;
      av_value = null;
    } else {
      av_key = av.substr(0, av_sep);
      av_value = av.substr(av_sep + 1);
    }

    av_key = av_key.trim().toLowerCase();

    if (av_value) {
      av_value = av_value.trim();
    }

    switch (av_key) {
      case "expires": // S5.2.1
        if (av_value) {
          const exp = parseDate(av_value);
          // "If the attribute-value failed to parse as a cookie date, ignore the
          // cookie-av."
          if (exp) {
            // over and underflow not realistically a concern: V8's getTime() seems to
            // store something larger than a 32-bit time_t (even with 32-bit node)
            c.expires = exp;
          }
        }
        break;

      case "max-age": // S5.2.2
        if (av_value) {
          // "If the first character of the attribute-value is not a DIGIT or a "-"
          // character ...[or]... If the remainder of attribute-value contains a
          // non-DIGIT character, ignore the cookie-av."
          if (/^-?[0-9]+$/.test(av_value)) {
            const delta = parseInt(av_value, 10);
            // "If delta-seconds is less than or equal to zero (0), let expiry-time
            // be the earliest representable date and time."
            c.setMaxAge(delta);
          }
        }
        break;

      case "domain": // S5.2.3
        // "If the attribute-value is empty, the behavior is undefined.  However,
        // the user agent SHOULD ignore the cookie-av entirely."
        if (av_value) {
          // S5.2.3 "Let cookie-domain be the attribute-value without the leading %x2E
          // (".") character."
          const domain = av_value.trim().replace(/^\./, "");
          if (domain) {
            // "Convert the cookie-domain to lower case."
            c.domain = domain.toLowerCase();
          }
        }
        break;

      case "path": // S5.2.4
        /*
         * "If the attribute-value is empty or if the first character of the
         * attribute-value is not %x2F ("/"):
         *   Let cookie-path be the default-path.
         * Otherwise:
         *   Let cookie-path be the attribute-value."
         *
         * We'll represent the default-path as null since it depends on the
         * context of the parsing.
         */
        c.path = av_value && av_value[0] === "/" ? av_value : null;
        break;

      case "secure": // S5.2.5
        /*
         * "If the attribute-name case-insensitively matches the string "Secure",
         * the user agent MUST append an attribute to the cookie-attribute-list
         * with an attribute-name of Secure and an empty attribute-value."
         */
        c.secure = true;
        break;

      case "httponly": // S5.2.6 -- effectively the same as 'secure'
        c.httpOnly = true;
        break;

      case "samesite": // RFC6265bis-02 S5.3.7
        const enforcement = av_value ? av_value.toLowerCase() : "";
        switch (enforcement) {
          case "strict":
            c.sameSite = "strict";
            break;
          case "lax":
            c.sameSite = "lax";
            break;
          default:
            // RFC6265bis-02 S5.3.7 step 1:
            // "If cookie-av's attribute-value is not a case-insensitive match
            //  for "Strict" or "Lax", ignore the "cookie-av"."
            // This effectively sets it to 'none' from the prototype.
            break;
        }
        break;

      default:
        c.extensions = c.extensions || [];
        c.extensions.push(av);
        break;
    }
  }

  return c;
}

/**
 *  If the cookie-name begins with a case-sensitive match for the
 *  string "__Secure-", abort these steps and ignore the cookie
 *  entirely unless the cookie's secure-only-flag is true.
 * @param cookie
 * @returns boolean
 */
function isSecurePrefixConditionMet(cookie) {
  return !cookie.key.startsWith("__Secure-") || cookie.secure;
}

/**
 *  If the cookie-name begins with a case-sensitive match for the
 *  string "__Host-", abort these steps and ignore the cookie
 *  entirely unless the cookie meets all the following criteria:
 *    1.  The cookie's secure-only-flag is true.
 *    2.  The cookie's host-only-flag is true.
 *    3.  The cookie-attribute-list contains an attribute with an
 *        attribute-name of "Path", and the cookie's path is "/".
 * @param cookie
 * @returns boolean
 */
function isHostPrefixConditionMet(cookie) {
  return (
    !cookie.key.startsWith("__Host-") ||
    (cookie.secure &&
      cookie.hostOnly &&
      cookie.path != null &&
      cookie.path === "/")
  );
}

// avoid the V8 deoptimization monster!
function jsonParse(str) {
  let obj;
  try {
    obj = JSON.parse(str);
  } catch (e) {
    return e;
  }
  return obj;
}

function fromJSON(str) {
  if (!str) {
    return null;
  }

  let obj;
  if (typeof str === "string") {
    obj = jsonParse(str);
    if (obj instanceof Error) {
      return null;
    }
  } else {
    // assume it's an Object
    obj = str;
  }

  const c = new Cookie();
  for (let i = 0; i < Cookie.serializableProperties.length; i++) {
    const prop = Cookie.serializableProperties[i];
    if (obj[prop] === undefined || obj[prop] === cookieDefaults[prop]) {
      continue; // leave as prototype default
    }

    if (prop === "expires" || prop === "creation" || prop === "lastAccessed") {
      if (obj[prop] === null) {
        c[prop] = null;
      } else {
        c[prop] = obj[prop] == "Infinity" ? "Infinity" : new Date(obj[prop]);
      }
    } else {
      c[prop] = obj[prop];
    }
  }

  return c;
}

/* Section 5.4 part 2:
 * "*  Cookies with longer paths are listed before cookies with
 *     shorter paths.
 *
 *  *  Among cookies that have equal-length path fields, cookies with
 *     earlier creation-times are listed before cookies with later
 *     creation-times."
 */

function cookieCompare(a, b) {
  let cmp = 0;

  // descending for length: b CMP a
  const aPathLen = a.path ? a.path.length : 0;
  const bPathLen = b.path ? b.path.length : 0;
  cmp = bPathLen - aPathLen;
  if (cmp !== 0) {
    return cmp;
  }

  // ascending for time: a CMP b
  const aTime = a.creation ? a.creation.getTime() : MAX_TIME;
  const bTime = b.creation ? b.creation.getTime() : MAX_TIME;
  cmp = aTime - bTime;
  if (cmp !== 0) {
    return cmp;
  }

  // break ties for the same millisecond (precision of JavaScript's clock)
  cmp = a.creationIndex - b.creationIndex;

  return cmp;
}

// Gives the permutation of all possible pathMatch()es of a given path. The
// array is in longest-to-shortest order.  Handy for indexing.
function permutePath(path) {
  if (path === "/") {
    return ["/"];
  }
  const permutations = [path];
  while (path.length > 1) {
    const lindex = path.lastIndexOf("/");
    if (lindex === 0) {
      break;
    }
    path = path.substr(0, lindex);
    permutations.push(path);
  }
  permutations.push("/");
  return permutations;
}

function getCookieContext(url) {
  if (url instanceof Object) {
    return url;
  }
  // NOTE: decodeURI will throw on malformed URIs (see GH-32).
  // Therefore, we will just skip decoding for such URIs.
  try {
    url = decodeURI(url);
  } catch (err) {
    // Silently swallow error
  }

  return urlParse(url);
}

const cookieDefaults = {
  // the order in which the RFC has them:
  key: "",
  value: "",
  expires: "Infinity",
  maxAge: null,
  domain: null,
  path: null,
  secure: false,
  httpOnly: false,
  extensions: null,
  // set by the CookieJar:
  hostOnly: null,
  pathIsDefault: null,
  creation: null,
  lastAccessed: null,
  sameSite: "none"
};

class Cookie {
  constructor(options = {}) {
    if (util.inspect.custom) {
      this[util.inspect.custom] = this.inspect;
    }

    Object.assign(this, cookieDefaults, options);
    this.creation = this.creation || new Date();

    // used to break creation ties in cookieCompare():
    Object.defineProperty(this, "creationIndex", {
      configurable: false,
      enumerable: false, // important for assert.deepEqual checks
      writable: true,
      value: ++Cookie.cookiesCreated
    });
  }

  inspect() {
    const now = Date.now();
    const hostOnly = this.hostOnly != null ? this.hostOnly : "?";
    const createAge = this.creation
      ? `${now - this.creation.getTime()}ms`
      : "?";
    const accessAge = this.lastAccessed
      ? `${now - this.lastAccessed.getTime()}ms`
      : "?";
    return `Cookie="${this.toString()}; hostOnly=${hostOnly}; aAge=${accessAge}; cAge=${createAge}"`;
  }

  toJSON() {
    const obj = {};

    for (const prop of Cookie.serializableProperties) {
      if (this[prop] === cookieDefaults[prop]) {
        continue; // leave as prototype default
      }

      if (
        prop === "expires" ||
        prop === "creation" ||
        prop === "lastAccessed"
      ) {
        if (this[prop] === null) {
          obj[prop] = null;
        } else {
          obj[prop] =
            this[prop] == "Infinity" // intentionally not ===
              ? "Infinity"
              : this[prop].toISOString();
        }
      } else if (prop === "maxAge") {
        if (this[prop] !== null) {
          // again, intentionally not ===
          obj[prop] =
            this[prop] == Infinity || this[prop] == -Infinity
              ? this[prop].toString()
              : this[prop];
        }
      } else {
        if (this[prop] !== cookieDefaults[prop]) {
          obj[prop] = this[prop];
        }
      }
    }

    return obj;
  }

  clone() {
    return fromJSON(this.toJSON());
  }

  validate() {
    if (!COOKIE_OCTETS.test(this.value)) {
      return false;
    }
    if (
      this.expires != Infinity &&
      !(this.expires instanceof Date) &&
      !parseDate(this.expires)
    ) {
      return false;
    }
    if (this.maxAge != null && this.maxAge <= 0) {
      return false; // "Max-Age=" non-zero-digit *DIGIT
    }
    if (this.path != null && !PATH_VALUE.test(this.path)) {
      return false;
    }

    const cdomain = this.cdomain();
    if (cdomain) {
      if (cdomain.match(/\.$/)) {
        return false; // S4.1.2.3 suggests that this is bad. domainMatch() tests confirm this
      }
      const suffix = pubsuffix.getPublicSuffix(cdomain);
      if (suffix == null) {
        // it's a public suffix
        return false;
      }
    }
    return true;
  }

  setExpires(exp) {
    if (exp instanceof Date) {
      this.expires = exp;
    } else {
      this.expires = parseDate(exp) || "Infinity";
    }
  }

  setMaxAge(age) {
    if (age === Infinity || age === -Infinity) {
      this.maxAge = age.toString(); // so JSON.stringify() works
    } else {
      this.maxAge = age;
    }
  }

  cookieString() {
    let val = this.value;
    if (val == null) {
      val = "";
    }
    if (this.key === "") {
      return val;
    }
    return `${this.key}=${val}`;
  }

  // gives Set-Cookie header format
  toString() {
    let str = this.cookieString();

    if (this.expires != Infinity) {
      if (this.expires instanceof Date) {
        str += `; Expires=${formatDate(this.expires)}`;
      } else {
        str += `; Expires=${this.expires}`;
      }
    }

    if (this.maxAge != null && this.maxAge != Infinity) {
      str += `; Max-Age=${this.maxAge}`;
    }

    if (this.domain && !this.hostOnly) {
      str += `; Domain=${this.domain}`;
    }
    if (this.path) {
      str += `; Path=${this.path}`;
    }

    if (this.secure) {
      str += "; Secure";
    }
    if (this.httpOnly) {
      str += "; HttpOnly";
    }
    if (this.sameSite && this.sameSite !== "none") {
      const ssCanon = Cookie.sameSiteCanonical[this.sameSite.toLowerCase()];
      str += `; SameSite=${ssCanon ? ssCanon : this.sameSite}`;
    }
    if (this.extensions) {
      this.extensions.forEach(ext => {
        str += `; ${ext}`;
      });
    }

    return str;
  }

  // TTL() partially replaces the "expiry-time" parts of S5.3 step 3 (setCookie()
  // elsewhere)
  // S5.3 says to give the "latest representable date" for which we use Infinity
  // For "expired" we use 0
  TTL(now) {
    /* RFC6265 S4.1.2.2 If a cookie has both the Max-Age and the Expires
     * attribute, the Max-Age attribute has precedence and controls the
     * expiration date of the cookie.
     * (Concurs with S5.3 step 3)
     */
    if (this.maxAge != null) {
      return this.maxAge <= 0 ? 0 : this.maxAge * 1000;
    }

    let expires = this.expires;
    if (expires != Infinity) {
      if (!(expires instanceof Date)) {
        expires = parseDate(expires) || Infinity;
      }

      if (expires == Infinity) {
        return Infinity;
      }

      return expires.getTime() - (now || Date.now());
    }

    return Infinity;
  }

  // expiryTime() replaces the "expiry-time" parts of S5.3 step 3 (setCookie()
  // elsewhere)
  expiryTime(now) {
    if (this.maxAge != null) {
      const relativeTo = now || this.creation || new Date();
      const age = this.maxAge <= 0 ? -Infinity : this.maxAge * 1000;
      return relativeTo.getTime() + age;
    }

    if (this.expires == Infinity) {
      return Infinity;
    }
    return this.expires.getTime();
  }

  // expiryDate() replaces the "expiry-time" parts of S5.3 step 3 (setCookie()
  // elsewhere), except it returns a Date
  expiryDate(now) {
    const millisec = this.expiryTime(now);
    if (millisec == Infinity) {
      return new Date(MAX_TIME);
    } else if (millisec == -Infinity) {
      return new Date(MIN_TIME);
    } else {
      return new Date(millisec);
    }
  }

  // This replaces the "persistent-flag" parts of S5.3 step 3
  isPersistent() {
    return this.maxAge != null || this.expires != Infinity;
  }

  // Mostly S5.1.2 and S5.2.3:
  canonicalizedDomain() {
    if (this.domain == null) {
      return null;
    }
    return canonicalDomain(this.domain);
  }

  cdomain() {
    return this.canonicalizedDomain();
  }
}

Cookie.cookiesCreated = 0;
Cookie.parse = parse;
Cookie.fromJSON = fromJSON;
Cookie.serializableProperties = Object.keys(cookieDefaults);
Cookie.sameSiteLevel = {
  strict: 3,
  lax: 2,
  none: 1
};

Cookie.sameSiteCanonical = {
  strict: "Strict",
  lax: "Lax"
};

function getNormalizedPrefixSecurity(prefixSecurity) {
  if (prefixSecurity != null) {
    const normalizedPrefixSecurity = prefixSecurity.toLowerCase();
    /* The three supported options */
    switch (normalizedPrefixSecurity) {
      case PrefixSecurityEnum.STRICT:
      case PrefixSecurityEnum.SILENT:
      case PrefixSecurityEnum.DISABLED:
        return normalizedPrefixSecurity;
    }
  }
  /* Default is SILENT */
  return PrefixSecurityEnum.SILENT;
}

class CookieJar {
  constructor(store, options = { rejectPublicSuffixes: true }) {
    if (typeof options === "boolean") {
      options = { rejectPublicSuffixes: options };
    }
    this.rejectPublicSuffixes = options.rejectPublicSuffixes;
    this.enableLooseMode = !!options.looseMode;
    this.allowSpecialUseDomain = !!options.allowSpecialUseDomain;
    this.store = store || new MemoryCookieStore();
    this.prefixSecurity = getNormalizedPrefixSecurity(options.prefixSecurity);
    this._cloneSync = syncWrap("clone");
    this._importCookiesSync = syncWrap("_importCookies");
    this.getCookiesSync = syncWrap("getCookies");
    this.getCookieStringSync = syncWrap("getCookieString");
    this.getSetCookieStringsSync = syncWrap("getSetCookieStrings");
    this.removeAllCookiesSync = syncWrap("removeAllCookies");
    this.setCookieSync = syncWrap("setCookie");
    this.serializeSync = syncWrap("serialize");
  }

  setCookie(cookie, url, options, cb) {
    let err;
    const context = getCookieContext(url);
    if (typeof options === "function") {
      cb = options;
      options = {};
    }

    const host = canonicalDomain(context.hostname);
    const loose = options.loose || this.enableLooseMode;

    let sameSiteContext = null;
    if (options.sameSiteContext) {
      sameSiteContext = checkSameSiteContext(options.sameSiteContext);
      if (!sameSiteContext) {
        return cb(new Error(SAME_SITE_CONTEXT_VAL_ERR));
      }
    }

    // S5.3 step 1
    if (typeof cookie === "string" || cookie instanceof String) {
      cookie = Cookie.parse(cookie, { loose: loose });
      if (!cookie) {
        err = new Error("Cookie failed to parse");
        return cb(options.ignoreError ? null : err);
      }
    } else if (!(cookie instanceof Cookie)) {
      // If you're seeing this error, and are passing in a Cookie object,
      // it *might* be a Cookie object from another loaded version of tough-cookie.
      err = new Error(
        "First argument to setCookie must be a Cookie object or string"
      );
      return cb(options.ignoreError ? null : err);
    }

    // S5.3 step 2
    const now = options.now || new Date(); // will assign later to save effort in the face of errors

    // S5.3 step 3: NOOP; persistent-flag and expiry-time is handled by getCookie()

    // S5.3 step 4: NOOP; domain is null by default

    // S5.3 step 5: public suffixes
    if (this.rejectPublicSuffixes && cookie.domain) {
      const suffix = pubsuffix.getPublicSuffix(cookie.cdomain());
      if (suffix == null) {
        // e.g. "com"
        err = new Error("Cookie has domain set to a public suffix");
        return cb(options.ignoreError ? null : err);
      }
    }

    // S5.3 step 6:
    if (cookie.domain) {
      if (!domainMatch(host, cookie.cdomain(), false)) {
        err = new Error(
          `Cookie not in this host's domain. Cookie:${cookie.cdomain()} Request:${host}`
        );
        return cb(options.ignoreError ? null : err);
      }

      if (cookie.hostOnly == null) {
        // don't reset if already set
        cookie.hostOnly = false;
      }
    } else {
      cookie.hostOnly = true;
      cookie.domain = host;
    }

    //S5.2.4 If the attribute-value is empty or if the first character of the
    //attribute-value is not %x2F ("/"):
    //Let cookie-path be the default-path.
    if (!cookie.path || cookie.path[0] !== "/") {
      cookie.path = defaultPath(context.pathname);
      cookie.pathIsDefault = true;
    }

    // S5.3 step 8: NOOP; secure attribute
    // S5.3 step 9: NOOP; httpOnly attribute

    // S5.3 step 10
    if (options.http === false && cookie.httpOnly) {
      err = new Error("Cookie is HttpOnly and this isn't an HTTP API");
      return cb(options.ignoreError ? null : err);
    }

    // 6252bis-02 S5.4 Step 13 & 14:
    if (cookie.sameSite !== "none" && sameSiteContext) {
      // "If the cookie's "same-site-flag" is not "None", and the cookie
      //  is being set from a context whose "site for cookies" is not an
      //  exact match for request-uri's host's registered domain, then
      //  abort these steps and ignore the newly created cookie entirely."
      if (sameSiteContext === "none") {
        err = new Error(
          "Cookie is SameSite but this is a cross-origin request"
        );
        return cb(options.ignoreError ? null : err);
      }
    }

    /* 6265bis-02 S5.4 Steps 15 & 16 */
    const ignoreErrorForPrefixSecurity =
      this.prefixSecurity === PrefixSecurityEnum.SILENT;
    const prefixSecurityDisabled =
      this.prefixSecurity === PrefixSecurityEnum.DISABLED;
    /* If prefix checking is not disabled ...*/
    if (!prefixSecurityDisabled) {
      let errorFound = false;
      let errorMsg;
      /* Check secure prefix condition */
      if (!isSecurePrefixConditionMet(cookie)) {
        errorFound = true;
        errorMsg = "Cookie has __Secure prefix but Secure attribute is not set";
      } else if (!isHostPrefixConditionMet(cookie)) {
        /* Check host prefix condition */
        errorFound = true;
        errorMsg =
          "Cookie has __Host prefix but either Secure or HostOnly attribute is not set or Path is not '/'";
      }
      if (errorFound) {
        return cb(
          options.ignoreError || ignoreErrorForPrefixSecurity
            ? null
            : new Error(errorMsg)
        );
      }
    }

    const store = this.store;

    if (!store.updateCookie) {
      store.updateCookie = function(oldCookie, newCookie, cb) {
        this.putCookie(newCookie, cb);
      };
    }

    function withCookie(err, oldCookie) {
      if (err) {
        return cb(err);
      }

      const next = function(err) {
        if (err) {
          return cb(err);
        } else {
          cb(null, cookie);
        }
      };

      if (oldCookie) {
        // S5.3 step 11 - "If the cookie store contains a cookie with the same name,
        // domain, and path as the newly created cookie:"
        if (options.http === false && oldCookie.httpOnly) {
          // step 11.2
          err = new Error("old Cookie is HttpOnly and this isn't an HTTP API");
          return cb(options.ignoreError ? null : err);
        }
        cookie.creation = oldCookie.creation; // step 11.3
        cookie.creationIndex = oldCookie.creationIndex; // preserve tie-breaker
        cookie.lastAccessed = now;
        // Step 11.4 (delete cookie) is implied by just setting the new one:
        store.updateCookie(oldCookie, cookie, next); // step 12
      } else {
        cookie.creation = cookie.lastAccessed = now;
        store.putCookie(cookie, next); // step 12
      }
    }

    store.findCookie(cookie.domain, cookie.path, cookie.key, withCookie);
  }

  // RFC6365 S5.4
  getCookies(url, options, cb) {
    const context = getCookieContext(url);
    if (typeof options === "function") {
      cb = options;
      options = {};
    }

    const host = canonicalDomain(context.hostname);
    const path = context.pathname || "/";

    let secure = options.secure;
    if (
      secure == null &&
      context.protocol &&
      (context.protocol == "https:" || context.protocol == "wss:")
    ) {
      secure = true;
    }

    let sameSiteLevel = 0;
    if (options.sameSiteContext) {
      const sameSiteContext = checkSameSiteContext(options.sameSiteContext);
      sameSiteLevel = Cookie.sameSiteLevel[sameSiteContext];
      if (!sameSiteLevel) {
        return cb(new Error(SAME_SITE_CONTEXT_VAL_ERR));
      }
    }

    let http = options.http;
    if (http == null) {
      http = true;
    }

    const now = options.now || Date.now();
    const expireCheck = options.expire !== false;
    const allPaths = !!options.allPaths;
    const store = this.store;

    function matchingCookie(c) {
      // "Either:
      //   The cookie's host-only-flag is true and the canonicalized
      //   request-host is identical to the cookie's domain.
      // Or:
      //   The cookie's host-only-flag is false and the canonicalized
      //   request-host domain-matches the cookie's domain."
      if (c.hostOnly) {
        if (c.domain != host) {
          return false;
        }
      } else {
        if (!domainMatch(host, c.domain, false)) {
          return false;
        }
      }

      // "The request-uri's path path-matches the cookie's path."
      if (!allPaths && !pathMatch(path, c.path)) {
        return false;
      }

      // "If the cookie's secure-only-flag is true, then the request-uri's
      // scheme must denote a "secure" protocol"
      if (c.secure && !secure) {
        return false;
      }

      // "If the cookie's http-only-flag is true, then exclude the cookie if the
      // cookie-string is being generated for a "non-HTTP" API"
      if (c.httpOnly && !http) {
        return false;
      }

      // RFC6265bis-02 S5.3.7
      if (sameSiteLevel) {
        const cookieLevel = Cookie.sameSiteLevel[c.sameSite || "none"];
        if (cookieLevel > sameSiteLevel) {
          // only allow cookies at or below the request level
          return false;
        }
      }

      // deferred from S5.3
      // non-RFC: allow retention of expired cookies by choice
      if (expireCheck && c.expiryTime() <= now) {
        store.removeCookie(c.domain, c.path, c.key, () => {}); // result ignored
        return false;
      }

      return true;
    }

    store.findCookies(
      host,
      allPaths ? null : path,
      this.allowSpecialUseDomain,
      (err, cookies) => {
        if (err) {
          return cb(err);
        }

        cookies = cookies.filter(matchingCookie);

        // sorting of S5.4 part 2
        if (options.sort !== false) {
          cookies = cookies.sort(cookieCompare);
        }

        // S5.4 part 3
        const now = new Date();
        for (const cookie of cookies) {
          cookie.lastAccessed = now;
        }
        // TODO persist lastAccessed

        cb(null, cookies);
      }
    );
  }

  getCookieString(...args) {
    const cb = args.pop();
    const next = function(err, cookies) {
      if (err) {
        cb(err);
      } else {
        cb(
          null,
          cookies
            .sort(cookieCompare)
            .map(c => c.cookieString())
            .join("; ")
        );
      }
    };
    args.push(next);
    this.getCookies.apply(this, args);
  }

  getSetCookieStrings(...args) {
    const cb = args.pop();
    const next = function(err, cookies) {
      if (err) {
        cb(err);
      } else {
        cb(
          null,
          cookies.map(c => {
            return c.toString();
          })
        );
      }
    };
    args.push(next);
    this.getCookies.apply(this, args);
  }

  serialize(cb) {
    let type = this.store.constructor.name;
    if (type === "Object") {
      type = null;
    }

    // update README.md "Serialization Format" if you change this, please!
    const serialized = {
      // The version of tough-cookie that serialized this jar. Generally a good
      // practice since future versions can make data import decisions based on
      // known past behavior. When/if this matters, use `semver`.
      version: `tough-cookie@${VERSION}`,

      // add the store type, to make humans happy:
      storeType: type,

      // CookieJar configuration:
      rejectPublicSuffixes: !!this.rejectPublicSuffixes,

      // this gets filled from getAllCookies:
      cookies: []
    };

    if (
      !(
        this.store.getAllCookies &&
        typeof this.store.getAllCookies === "function"
      )
    ) {
      return cb(
        new Error(
          "store does not support getAllCookies and cannot be serialized"
        )
      );
    }

    this.store.getAllCookies((err, cookies) => {
      if (err) {
        return cb(err);
      }

      serialized.cookies = cookies.map(cookie => {
        // convert to serialized 'raw' cookies
        cookie = cookie instanceof Cookie ? cookie.toJSON() : cookie;

        // Remove the index so new ones get assigned during deserialization
        delete cookie.creationIndex;

        return cookie;
      });

      return cb(null, serialized);
    });
  }

  toJSON() {
    return this.serializeSync();
  }

  // use the class method CookieJar.deserialize instead of calling this directly
  _importCookies(serialized, cb) {
    let cookies = serialized.cookies;
    if (!cookies || !Array.isArray(cookies)) {
      return cb(new Error("serialized jar has no cookies array"));
    }
    cookies = cookies.slice(); // do not modify the original

    const putNext = err => {
      if (err) {
        return cb(err);
      }

      if (!cookies.length) {
        return cb(err, this);
      }

      let cookie;
      try {
        cookie = fromJSON(cookies.shift());
      } catch (e) {
        return cb(e);
      }

      if (cookie === null) {
        return putNext(null); // skip this cookie
      }

      this.store.putCookie(cookie, putNext);
    };

    putNext();
  }

  clone(newStore, cb) {
    if (arguments.length === 1) {
      cb = newStore;
      newStore = null;
    }

    this.serialize((err, serialized) => {
      if (err) {
        return cb(err);
      }
      CookieJar.deserialize(serialized, newStore, cb);
    });
  }

  cloneSync(newStore) {
    if (arguments.length === 0) {
      return this._cloneSync();
    }
    if (!newStore.synchronous) {
      throw new Error(
        "CookieJar clone destination store is not synchronous; use async API instead."
      );
    }
    return this._cloneSync(newStore);
  }

  removeAllCookies(cb) {
    const store = this.store;

    // Check that the store implements its own removeAllCookies(). The default
    // implementation in Store will immediately call the callback with a "not
    // implemented" Error.
    if (
      typeof store.removeAllCookies === "function" &&
      store.removeAllCookies !== Store.prototype.removeAllCookies
    ) {
      return store.removeAllCookies(cb);
    }

    store.getAllCookies((err, cookies) => {
      if (err) {
        return cb(err);
      }

      if (cookies.length === 0) {
        return cb(null);
      }

      let completedCount = 0;
      const removeErrors = [];

      function removeCookieCb(removeErr) {
        if (removeErr) {
          removeErrors.push(removeErr);
        }

        completedCount++;

        if (completedCount === cookies.length) {
          return cb(removeErrors.length ? removeErrors[0] : null);
        }
      }

      cookies.forEach(cookie => {
        store.removeCookie(
          cookie.domain,
          cookie.path,
          cookie.key,
          removeCookieCb
        );
      });
    });
  }

  static deserialize(strOrObj, store, cb) {
    if (arguments.length !== 3) {
      // store is optional
      cb = store;
      store = null;
    }

    let serialized;
    if (typeof strOrObj === "string") {
      serialized = jsonParse(strOrObj);
      if (serialized instanceof Error) {
        return cb(serialized);
      }
    } else {
      serialized = strOrObj;
    }

    const jar = new CookieJar(store, serialized.rejectPublicSuffixes);
    jar._importCookies(serialized, err => {
      if (err) {
        return cb(err);
      }
      cb(null, jar);
    });
  }

  static deserializeSync(strOrObj, store) {
    const serialized =
      typeof strOrObj === "string" ? JSON.parse(strOrObj) : strOrObj;
    const jar = new CookieJar(store, serialized.rejectPublicSuffixes);

    // catch this mistake early:
    if (!jar.store.synchronous) {
      throw new Error(
        "CookieJar store is not synchronous; use async API instead."
      );
    }

    jar._importCookiesSync(serialized);
    return jar;
  }
}
CookieJar.fromJSON = CookieJar.deserializeSync;

[
  "_importCookies",
  "clone",
  "getCookies",
  "getCookieString",
  "getSetCookieStrings",
  "removeAllCookies",
  "serialize",
  "setCookie"
].forEach(name => {
  CookieJar.prototype[name] = fromCallback(CookieJar.prototype[name]);
});
CookieJar.deserialize = fromCallback(CookieJar.deserialize);

// Use a closure to provide a true imperative API for synchronous stores.
function syncWrap(method) {
  return function(...args) {
    if (!this.store.synchronous) {
      throw new Error(
        "CookieJar store is not synchronous; use async API instead."
      );
    }

    let syncErr, syncResult;
    this[method](...args, (err, result) => {
      syncErr = err;
      syncResult = result;
    });

    if (syncErr) {
      throw syncErr;
    }
    return syncResult;
  };
}

exports.version = VERSION;
exports.CookieJar = CookieJar;
exports.Cookie = Cookie;
exports.Store = Store;
exports.MemoryCookieStore = MemoryCookieStore;
exports.parseDate = parseDate;
exports.formatDate = formatDate;
exports.parse = parse;
exports.fromJSON = fromJSON;
exports.domainMatch = domainMatch;
exports.defaultPath = defaultPath;
exports.pathMatch = pathMatch;
exports.getPublicSuffix = pubsuffix.getPublicSuffix;
exports.cookieCompare = cookieCompare;
exports.permuteDomain = require("./permuteDomain").permuteDomain;
exports.permutePath = permutePath;
exports.canonicalDomain = canonicalDomain;
exports.PrefixSecurityEnum = PrefixSecurityEnum;

},{"./memstore":72,"./pathMatch":73,"./permuteDomain":74,"./pubsuffix-psl":75,"./store":76,"./version":77,"punycode":67,"universalify":78,"url":79,"util":83}],72:[function(require,module,exports){
/*!
 * Copyright (c) 2015, Salesforce.com, Inc.
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are met:
 *
 * 1. Redistributions of source code must retain the above copyright notice,
 * this list of conditions and the following disclaimer.
 *
 * 2. Redistributions in binary form must reproduce the above copyright notice,
 * this list of conditions and the following disclaimer in the documentation
 * and/or other materials provided with the distribution.
 *
 * 3. Neither the name of Salesforce.com nor the names of its contributors may
 * be used to endorse or promote products derived from this software without
 * specific prior written permission.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
 * AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
 * IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE
 * ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE
 * LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR
 * CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF
 * SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS
 * INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN
 * CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE)
 * ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE
 * POSSIBILITY OF SUCH DAMAGE.
 */
"use strict";
const { fromCallback } = require("universalify");
const Store = require("./store").Store;
const permuteDomain = require("./permuteDomain").permuteDomain;
const pathMatch = require("./pathMatch").pathMatch;
const util = require("util");

class MemoryCookieStore extends Store {
  constructor() {
    super();
    this.synchronous = true;
    this.idx = {};
    if (util.inspect.custom) {
      this[util.inspect.custom] = this.inspect;
    }
  }

  inspect() {
    return `{ idx: ${util.inspect(this.idx, false, 2)} }`;
  }

  findCookie(domain, path, key, cb) {
    if (!this.idx[domain]) {
      return cb(null, undefined);
    }
    if (!this.idx[domain][path]) {
      return cb(null, undefined);
    }
    return cb(null, this.idx[domain][path][key] || null);
  }
  findCookies(domain, path, allowSpecialUseDomain, cb) {
    const results = [];
    if (typeof allowSpecialUseDomain === "function") {
      cb = allowSpecialUseDomain;
      allowSpecialUseDomain = false;
    }
    if (!domain) {
      return cb(null, []);
    }

    let pathMatcher;
    if (!path) {
      // null means "all paths"
      pathMatcher = function matchAll(domainIndex) {
        for (const curPath in domainIndex) {
          const pathIndex = domainIndex[curPath];
          for (const key in pathIndex) {
            results.push(pathIndex[key]);
          }
        }
      };
    } else {
      pathMatcher = function matchRFC(domainIndex) {
        //NOTE: we should use path-match algorithm from S5.1.4 here
        //(see : https://github.com/ChromiumWebApps/chromium/blob/b3d3b4da8bb94c1b2e061600df106d590fda3620/net/cookies/canonical_cookie.cc#L299)
        Object.keys(domainIndex).forEach(cookiePath => {
          if (pathMatch(path, cookiePath)) {
            const pathIndex = domainIndex[cookiePath];
            for (const key in pathIndex) {
              results.push(pathIndex[key]);
            }
          }
        });
      };
    }

    const domains = permuteDomain(domain, allowSpecialUseDomain) || [domain];
    const idx = this.idx;
    domains.forEach(curDomain => {
      const domainIndex = idx[curDomain];
      if (!domainIndex) {
        return;
      }
      pathMatcher(domainIndex);
    });

    cb(null, results);
  }

  putCookie(cookie, cb) {
    if (!this.idx[cookie.domain]) {
      this.idx[cookie.domain] = {};
    }
    if (!this.idx[cookie.domain][cookie.path]) {
      this.idx[cookie.domain][cookie.path] = {};
    }
    this.idx[cookie.domain][cookie.path][cookie.key] = cookie;
    cb(null);
  }
  updateCookie(oldCookie, newCookie, cb) {
    // updateCookie() may avoid updating cookies that are identical.  For example,
    // lastAccessed may not be important to some stores and an equality
    // comparison could exclude that field.
    this.putCookie(newCookie, cb);
  }
  removeCookie(domain, path, key, cb) {
    if (
      this.idx[domain] &&
      this.idx[domain][path] &&
      this.idx[domain][path][key]
    ) {
      delete this.idx[domain][path][key];
    }
    cb(null);
  }
  removeCookies(domain, path, cb) {
    if (this.idx[domain]) {
      if (path) {
        delete this.idx[domain][path];
      } else {
        delete this.idx[domain];
      }
    }
    return cb(null);
  }
  removeAllCookies(cb) {
    this.idx = {};
    return cb(null);
  }
  getAllCookies(cb) {
    const cookies = [];
    const idx = this.idx;

    const domains = Object.keys(idx);
    domains.forEach(domain => {
      const paths = Object.keys(idx[domain]);
      paths.forEach(path => {
        const keys = Object.keys(idx[domain][path]);
        keys.forEach(key => {
          if (key !== null) {
            cookies.push(idx[domain][path][key]);
          }
        });
      });
    });

    // Sort by creationIndex so deserializing retains the creation order.
    // When implementing your own store, this SHOULD retain the order too
    cookies.sort((a, b) => {
      return (a.creationIndex || 0) - (b.creationIndex || 0);
    });

    cb(null, cookies);
  }
}

[
  "findCookie",
  "findCookies",
  "putCookie",
  "updateCookie",
  "removeCookie",
  "removeCookies",
  "removeAllCookies",
  "getAllCookies"
].forEach(name => {
  MemoryCookieStore[name] = fromCallback(MemoryCookieStore.prototype[name]);
});

exports.MemoryCookieStore = MemoryCookieStore;

},{"./pathMatch":73,"./permuteDomain":74,"./store":76,"universalify":78,"util":83}],73:[function(require,module,exports){
/*!
 * Copyright (c) 2015, Salesforce.com, Inc.
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are met:
 *
 * 1. Redistributions of source code must retain the above copyright notice,
 * this list of conditions and the following disclaimer.
 *
 * 2. Redistributions in binary form must reproduce the above copyright notice,
 * this list of conditions and the following disclaimer in the documentation
 * and/or other materials provided with the distribution.
 *
 * 3. Neither the name of Salesforce.com nor the names of its contributors may
 * be used to endorse or promote products derived from this software without
 * specific prior written permission.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
 * AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
 * IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE
 * ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE
 * LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR
 * CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF
 * SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS
 * INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN
 * CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE)
 * ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE
 * POSSIBILITY OF SUCH DAMAGE.
 */
"use strict";
/*
 * "A request-path path-matches a given cookie-path if at least one of the
 * following conditions holds:"
 */
function pathMatch(reqPath, cookiePath) {
  // "o  The cookie-path and the request-path are identical."
  if (cookiePath === reqPath) {
    return true;
  }

  const idx = reqPath.indexOf(cookiePath);
  if (idx === 0) {
    // "o  The cookie-path is a prefix of the request-path, and the last
    // character of the cookie-path is %x2F ("/")."
    if (cookiePath.substr(-1) === "/") {
      return true;
    }

    // " o  The cookie-path is a prefix of the request-path, and the first
    // character of the request-path that is not included in the cookie- path
    // is a %x2F ("/") character."
    if (reqPath.substr(cookiePath.length, 1) === "/") {
      return true;
    }
  }

  return false;
}

exports.pathMatch = pathMatch;

},{}],74:[function(require,module,exports){
/*!
 * Copyright (c) 2015, Salesforce.com, Inc.
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are met:
 *
 * 1. Redistributions of source code must retain the above copyright notice,
 * this list of conditions and the following disclaimer.
 *
 * 2. Redistributions in binary form must reproduce the above copyright notice,
 * this list of conditions and the following disclaimer in the documentation
 * and/or other materials provided with the distribution.
 *
 * 3. Neither the name of Salesforce.com nor the names of its contributors may
 * be used to endorse or promote products derived from this software without
 * specific prior written permission.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
 * AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
 * IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE
 * ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE
 * LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR
 * CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF
 * SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS
 * INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN
 * CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE)
 * ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE
 * POSSIBILITY OF SUCH DAMAGE.
 */
"use strict";
const pubsuffix = require("./pubsuffix-psl");

// Gives the permutation of all possible domainMatch()es of a given domain. The
// array is in shortest-to-longest order.  Handy for indexing.
const SPECIAL_USE_DOMAINS = ["local"]; // RFC 6761
function permuteDomain(domain, allowSpecialUseDomain) {
  let pubSuf = null;
  if (allowSpecialUseDomain) {
    const domainParts = domain.split(".");
    if (SPECIAL_USE_DOMAINS.includes(domainParts[domainParts.length - 1])) {
      pubSuf = `${domainParts[domainParts.length - 2]}.${
        domainParts[domainParts.length - 1]
      }`;
    } else {
      pubSuf = pubsuffix.getPublicSuffix(domain);
    }
  } else {
    pubSuf = pubsuffix.getPublicSuffix(domain);
  }

  if (!pubSuf) {
    return null;
  }
  if (pubSuf == domain) {
    return [domain];
  }

  const prefix = domain.slice(0, -(pubSuf.length + 1)); // ".example.com"
  const parts = prefix.split(".").reverse();
  let cur = pubSuf;
  const permutations = [cur];
  while (parts.length) {
    cur = `${parts.shift()}.${cur}`;
    permutations.push(cur);
  }
  return permutations;
}

exports.permuteDomain = permuteDomain;

},{"./pubsuffix-psl":75}],75:[function(require,module,exports){
/*!
 * Copyright (c) 2018, Salesforce.com, Inc.
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are met:
 *
 * 1. Redistributions of source code must retain the above copyright notice,
 * this list of conditions and the following disclaimer.
 *
 * 2. Redistributions in binary form must reproduce the above copyright notice,
 * this list of conditions and the following disclaimer in the documentation
 * and/or other materials provided with the distribution.
 *
 * 3. Neither the name of Salesforce.com nor the names of its contributors may
 * be used to endorse or promote products derived from this software without
 * specific prior written permission.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
 * AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
 * IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE
 * ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE
 * LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR
 * CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF
 * SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS
 * INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN
 * CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE)
 * ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE
 * POSSIBILITY OF SUCH DAMAGE.
 */
"use strict";
const psl = require("psl");

function getPublicSuffix(domain) {
  return psl.get(domain);
}

exports.getPublicSuffix = getPublicSuffix;

},{"psl":66}],76:[function(require,module,exports){
/*!
 * Copyright (c) 2015, Salesforce.com, Inc.
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are met:
 *
 * 1. Redistributions of source code must retain the above copyright notice,
 * this list of conditions and the following disclaimer.
 *
 * 2. Redistributions in binary form must reproduce the above copyright notice,
 * this list of conditions and the following disclaimer in the documentation
 * and/or other materials provided with the distribution.
 *
 * 3. Neither the name of Salesforce.com nor the names of its contributors may
 * be used to endorse or promote products derived from this software without
 * specific prior written permission.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
 * AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
 * IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE
 * ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE
 * LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR
 * CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF
 * SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS
 * INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN
 * CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE)
 * ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE
 * POSSIBILITY OF SUCH DAMAGE.
 */
"use strict";
/*jshint unused:false */

class Store {
  constructor() {
    this.synchronous = false;
  }

  findCookie(domain, path, key, cb) {
    throw new Error("findCookie is not implemented");
  }

  findCookies(domain, path, allowSpecialUseDomain, cb) {
    throw new Error("findCookies is not implemented");
  }

  putCookie(cookie, cb) {
    throw new Error("putCookie is not implemented");
  }

  updateCookie(oldCookie, newCookie, cb) {
    // recommended default implementation:
    // return this.putCookie(newCookie, cb);
    throw new Error("updateCookie is not implemented");
  }

  removeCookie(domain, path, key, cb) {
    throw new Error("removeCookie is not implemented");
  }

  removeCookies(domain, path, cb) {
    throw new Error("removeCookies is not implemented");
  }

  removeAllCookies(cb) {
    throw new Error("removeAllCookies is not implemented");
  }

  getAllCookies(cb) {
    throw new Error(
      "getAllCookies is not implemented (therefore jar cannot be serialized)"
    );
  }
}

exports.Store = Store;

},{}],77:[function(require,module,exports){
// generated by genversion
module.exports = '4.0.0'

},{}],78:[function(require,module,exports){
'use strict'

exports.fromCallback = function (fn) {
  return Object.defineProperty(function () {
    if (typeof arguments[arguments.length - 1] === 'function') fn.apply(this, arguments)
    else {
      return new Promise((resolve, reject) => {
        arguments[arguments.length] = (err, res) => {
          if (err) return reject(err)
          resolve(res)
        }
        arguments.length++
        fn.apply(this, arguments)
      })
    }
  }, 'name', { value: fn.name })
}

exports.fromPromise = function (fn) {
  return Object.defineProperty(function () {
    const cb = arguments[arguments.length - 1]
    if (typeof cb !== 'function') return fn.apply(this, arguments)
    else fn.apply(this, arguments).then(r => cb(null, r), cb)
  }, 'name', { value: fn.name })
}

},{}],79:[function(require,module,exports){
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

'use strict';

var punycode = require('punycode');
var util = require('./util');

exports.parse = urlParse;
exports.resolve = urlResolve;
exports.resolveObject = urlResolveObject;
exports.format = urlFormat;

exports.Url = Url;

function Url() {
  this.protocol = null;
  this.slashes = null;
  this.auth = null;
  this.host = null;
  this.port = null;
  this.hostname = null;
  this.hash = null;
  this.search = null;
  this.query = null;
  this.pathname = null;
  this.path = null;
  this.href = null;
}

// Reference: RFC 3986, RFC 1808, RFC 2396

// define these here so at least they only have to be
// compiled once on the first module load.
var protocolPattern = /^([a-z0-9.+-]+:)/i,
    portPattern = /:[0-9]*$/,

    // Special case for a simple path URL
    simplePathPattern = /^(\/\/?(?!\/)[^\?\s]*)(\?[^\s]*)?$/,

    // RFC 2396: characters reserved for delimiting URLs.
    // We actually just auto-escape these.
    delims = ['<', '>', '"', '`', ' ', '\r', '\n', '\t'],

    // RFC 2396: characters not allowed for various reasons.
    unwise = ['{', '}', '|', '\\', '^', '`'].concat(delims),

    // Allowed by RFCs, but cause of XSS attacks.  Always escape these.
    autoEscape = ['\''].concat(unwise),
    // Characters that are never ever allowed in a hostname.
    // Note that any invalid chars are also handled, but these
    // are the ones that are *expected* to be seen, so we fast-path
    // them.
    nonHostChars = ['%', '/', '?', ';', '#'].concat(autoEscape),
    hostEndingChars = ['/', '?', '#'],
    hostnameMaxLen = 255,
    hostnamePartPattern = /^[+a-z0-9A-Z_-]{0,63}$/,
    hostnamePartStart = /^([+a-z0-9A-Z_-]{0,63})(.*)$/,
    // protocols that can allow "unsafe" and "unwise" chars.
    unsafeProtocol = {
      'javascript': true,
      'javascript:': true
    },
    // protocols that never have a hostname.
    hostlessProtocol = {
      'javascript': true,
      'javascript:': true
    },
    // protocols that always contain a // bit.
    slashedProtocol = {
      'http': true,
      'https': true,
      'ftp': true,
      'gopher': true,
      'file': true,
      'http:': true,
      'https:': true,
      'ftp:': true,
      'gopher:': true,
      'file:': true
    },
    querystring = require('querystring');

function urlParse(url, parseQueryString, slashesDenoteHost) {
  if (url && util.isObject(url) && url instanceof Url) return url;

  var u = new Url;
  u.parse(url, parseQueryString, slashesDenoteHost);
  return u;
}

Url.prototype.parse = function(url, parseQueryString, slashesDenoteHost) {
  if (!util.isString(url)) {
    throw new TypeError("Parameter 'url' must be a string, not " + typeof url);
  }

  // Copy chrome, IE, opera backslash-handling behavior.
  // Back slashes before the query string get converted to forward slashes
  // See: https://code.google.com/p/chromium/issues/detail?id=25916
  var queryIndex = url.indexOf('?'),
      splitter =
          (queryIndex !== -1 && queryIndex < url.indexOf('#')) ? '?' : '#',
      uSplit = url.split(splitter),
      slashRegex = /\\/g;
  uSplit[0] = uSplit[0].replace(slashRegex, '/');
  url = uSplit.join(splitter);

  var rest = url;

  // trim before proceeding.
  // This is to support parse stuff like "  http://foo.com  \n"
  rest = rest.trim();

  if (!slashesDenoteHost && url.split('#').length === 1) {
    // Try fast path regexp
    var simplePath = simplePathPattern.exec(rest);
    if (simplePath) {
      this.path = rest;
      this.href = rest;
      this.pathname = simplePath[1];
      if (simplePath[2]) {
        this.search = simplePath[2];
        if (parseQueryString) {
          this.query = querystring.parse(this.search.substr(1));
        } else {
          this.query = this.search.substr(1);
        }
      } else if (parseQueryString) {
        this.search = '';
        this.query = {};
      }
      return this;
    }
  }

  var proto = protocolPattern.exec(rest);
  if (proto) {
    proto = proto[0];
    var lowerProto = proto.toLowerCase();
    this.protocol = lowerProto;
    rest = rest.substr(proto.length);
  }

  // figure out if it's got a host
  // user@server is *always* interpreted as a hostname, and url
  // resolution will treat //foo/bar as host=foo,path=bar because that's
  // how the browser resolves relative URLs.
  if (slashesDenoteHost || proto || rest.match(/^\/\/[^@\/]+@[^@\/]+/)) {
    var slashes = rest.substr(0, 2) === '//';
    if (slashes && !(proto && hostlessProtocol[proto])) {
      rest = rest.substr(2);
      this.slashes = true;
    }
  }

  if (!hostlessProtocol[proto] &&
      (slashes || (proto && !slashedProtocol[proto]))) {

    // there's a hostname.
    // the first instance of /, ?, ;, or # ends the host.
    //
    // If there is an @ in the hostname, then non-host chars *are* allowed
    // to the left of the last @ sign, unless some host-ending character
    // comes *before* the @-sign.
    // URLs are obnoxious.
    //
    // ex:
    // http://a@b@c/ => user:a@b host:c
    // http://a@b?@c => user:a host:c path:/?@c

    // v0.12 TODO(isaacs): This is not quite how Chrome does things.
    // Review our test case against browsers more comprehensively.

    // find the first instance of any hostEndingChars
    var hostEnd = -1;
    for (var i = 0; i < hostEndingChars.length; i++) {
      var hec = rest.indexOf(hostEndingChars[i]);
      if (hec !== -1 && (hostEnd === -1 || hec < hostEnd))
        hostEnd = hec;
    }

    // at this point, either we have an explicit point where the
    // auth portion cannot go past, or the last @ char is the decider.
    var auth, atSign;
    if (hostEnd === -1) {
      // atSign can be anywhere.
      atSign = rest.lastIndexOf('@');
    } else {
      // atSign must be in auth portion.
      // http://a@b/c@d => host:b auth:a path:/c@d
      atSign = rest.lastIndexOf('@', hostEnd);
    }

    // Now we have a portion which is definitely the auth.
    // Pull that off.
    if (atSign !== -1) {
      auth = rest.slice(0, atSign);
      rest = rest.slice(atSign + 1);
      this.auth = decodeURIComponent(auth);
    }

    // the host is the remaining to the left of the first non-host char
    hostEnd = -1;
    for (var i = 0; i < nonHostChars.length; i++) {
      var hec = rest.indexOf(nonHostChars[i]);
      if (hec !== -1 && (hostEnd === -1 || hec < hostEnd))
        hostEnd = hec;
    }
    // if we still have not hit it, then the entire thing is a host.
    if (hostEnd === -1)
      hostEnd = rest.length;

    this.host = rest.slice(0, hostEnd);
    rest = rest.slice(hostEnd);

    // pull out port.
    this.parseHost();

    // we've indicated that there is a hostname,
    // so even if it's empty, it has to be present.
    this.hostname = this.hostname || '';

    // if hostname begins with [ and ends with ]
    // assume that it's an IPv6 address.
    var ipv6Hostname = this.hostname[0] === '[' &&
        this.hostname[this.hostname.length - 1] === ']';

    // validate a little.
    if (!ipv6Hostname) {
      var hostparts = this.hostname.split(/\./);
      for (var i = 0, l = hostparts.length; i < l; i++) {
        var part = hostparts[i];
        if (!part) continue;
        if (!part.match(hostnamePartPattern)) {
          var newpart = '';
          for (var j = 0, k = part.length; j < k; j++) {
            if (part.charCodeAt(j) > 127) {
              // we replace non-ASCII char with a temporary placeholder
              // we need this to make sure size of hostname is not
              // broken by replacing non-ASCII by nothing
              newpart += 'x';
            } else {
              newpart += part[j];
            }
          }
          // we test again with ASCII char only
          if (!newpart.match(hostnamePartPattern)) {
            var validParts = hostparts.slice(0, i);
            var notHost = hostparts.slice(i + 1);
            var bit = part.match(hostnamePartStart);
            if (bit) {
              validParts.push(bit[1]);
              notHost.unshift(bit[2]);
            }
            if (notHost.length) {
              rest = '/' + notHost.join('.') + rest;
            }
            this.hostname = validParts.join('.');
            break;
          }
        }
      }
    }

    if (this.hostname.length > hostnameMaxLen) {
      this.hostname = '';
    } else {
      // hostnames are always lower case.
      this.hostname = this.hostname.toLowerCase();
    }

    if (!ipv6Hostname) {
      // IDNA Support: Returns a punycoded representation of "domain".
      // It only converts parts of the domain name that
      // have non-ASCII characters, i.e. it doesn't matter if
      // you call it with a domain that already is ASCII-only.
      this.hostname = punycode.toASCII(this.hostname);
    }

    var p = this.port ? ':' + this.port : '';
    var h = this.hostname || '';
    this.host = h + p;
    this.href += this.host;

    // strip [ and ] from the hostname
    // the host field still retains them, though
    if (ipv6Hostname) {
      this.hostname = this.hostname.substr(1, this.hostname.length - 2);
      if (rest[0] !== '/') {
        rest = '/' + rest;
      }
    }
  }

  // now rest is set to the post-host stuff.
  // chop off any delim chars.
  if (!unsafeProtocol[lowerProto]) {

    // First, make 100% sure that any "autoEscape" chars get
    // escaped, even if encodeURIComponent doesn't think they
    // need to be.
    for (var i = 0, l = autoEscape.length; i < l; i++) {
      var ae = autoEscape[i];
      if (rest.indexOf(ae) === -1)
        continue;
      var esc = encodeURIComponent(ae);
      if (esc === ae) {
        esc = escape(ae);
      }
      rest = rest.split(ae).join(esc);
    }
  }


  // chop off from the tail first.
  var hash = rest.indexOf('#');
  if (hash !== -1) {
    // got a fragment string.
    this.hash = rest.substr(hash);
    rest = rest.slice(0, hash);
  }
  var qm = rest.indexOf('?');
  if (qm !== -1) {
    this.search = rest.substr(qm);
    this.query = rest.substr(qm + 1);
    if (parseQueryString) {
      this.query = querystring.parse(this.query);
    }
    rest = rest.slice(0, qm);
  } else if (parseQueryString) {
    // no query string, but parseQueryString still requested
    this.search = '';
    this.query = {};
  }
  if (rest) this.pathname = rest;
  if (slashedProtocol[lowerProto] &&
      this.hostname && !this.pathname) {
    this.pathname = '/';
  }

  //to support http.request
  if (this.pathname || this.search) {
    var p = this.pathname || '';
    var s = this.search || '';
    this.path = p + s;
  }

  // finally, reconstruct the href based on what has been validated.
  this.href = this.format();
  return this;
};

// format a parsed object into a url string
function urlFormat(obj) {
  // ensure it's an object, and not a string url.
  // If it's an obj, this is a no-op.
  // this way, you can call url_format() on strings
  // to clean up potentially wonky urls.
  if (util.isString(obj)) obj = urlParse(obj);
  if (!(obj instanceof Url)) return Url.prototype.format.call(obj);
  return obj.format();
}

Url.prototype.format = function() {
  var auth = this.auth || '';
  if (auth) {
    auth = encodeURIComponent(auth);
    auth = auth.replace(/%3A/i, ':');
    auth += '@';
  }

  var protocol = this.protocol || '',
      pathname = this.pathname || '',
      hash = this.hash || '',
      host = false,
      query = '';

  if (this.host) {
    host = auth + this.host;
  } else if (this.hostname) {
    host = auth + (this.hostname.indexOf(':') === -1 ?
        this.hostname :
        '[' + this.hostname + ']');
    if (this.port) {
      host += ':' + this.port;
    }
  }

  if (this.query &&
      util.isObject(this.query) &&
      Object.keys(this.query).length) {
    query = querystring.stringify(this.query);
  }

  var search = this.search || (query && ('?' + query)) || '';

  if (protocol && protocol.substr(-1) !== ':') protocol += ':';

  // only the slashedProtocols get the //.  Not mailto:, xmpp:, etc.
  // unless they had them to begin with.
  if (this.slashes ||
      (!protocol || slashedProtocol[protocol]) && host !== false) {
    host = '//' + (host || '');
    if (pathname && pathname.charAt(0) !== '/') pathname = '/' + pathname;
  } else if (!host) {
    host = '';
  }

  if (hash && hash.charAt(0) !== '#') hash = '#' + hash;
  if (search && search.charAt(0) !== '?') search = '?' + search;

  pathname = pathname.replace(/[?#]/g, function(match) {
    return encodeURIComponent(match);
  });
  search = search.replace('#', '%23');

  return protocol + host + pathname + search + hash;
};

function urlResolve(source, relative) {
  return urlParse(source, false, true).resolve(relative);
}

Url.prototype.resolve = function(relative) {
  return this.resolveObject(urlParse(relative, false, true)).format();
};

function urlResolveObject(source, relative) {
  if (!source) return relative;
  return urlParse(source, false, true).resolveObject(relative);
}

Url.prototype.resolveObject = function(relative) {
  if (util.isString(relative)) {
    var rel = new Url();
    rel.parse(relative, false, true);
    relative = rel;
  }

  var result = new Url();
  var tkeys = Object.keys(this);
  for (var tk = 0; tk < tkeys.length; tk++) {
    var tkey = tkeys[tk];
    result[tkey] = this[tkey];
  }

  // hash is always overridden, no matter what.
  // even href="" will remove it.
  result.hash = relative.hash;

  // if the relative url is empty, then there's nothing left to do here.
  if (relative.href === '') {
    result.href = result.format();
    return result;
  }

  // hrefs like //foo/bar always cut to the protocol.
  if (relative.slashes && !relative.protocol) {
    // take everything except the protocol from relative
    var rkeys = Object.keys(relative);
    for (var rk = 0; rk < rkeys.length; rk++) {
      var rkey = rkeys[rk];
      if (rkey !== 'protocol')
        result[rkey] = relative[rkey];
    }

    //urlParse appends trailing / to urls like http://www.example.com
    if (slashedProtocol[result.protocol] &&
        result.hostname && !result.pathname) {
      result.path = result.pathname = '/';
    }

    result.href = result.format();
    return result;
  }

  if (relative.protocol && relative.protocol !== result.protocol) {
    // if it's a known url protocol, then changing
    // the protocol does weird things
    // first, if it's not file:, then we MUST have a host,
    // and if there was a path
    // to begin with, then we MUST have a path.
    // if it is file:, then the host is dropped,
    // because that's known to be hostless.
    // anything else is assumed to be absolute.
    if (!slashedProtocol[relative.protocol]) {
      var keys = Object.keys(relative);
      for (var v = 0; v < keys.length; v++) {
        var k = keys[v];
        result[k] = relative[k];
      }
      result.href = result.format();
      return result;
    }

    result.protocol = relative.protocol;
    if (!relative.host && !hostlessProtocol[relative.protocol]) {
      var relPath = (relative.pathname || '').split('/');
      while (relPath.length && !(relative.host = relPath.shift()));
      if (!relative.host) relative.host = '';
      if (!relative.hostname) relative.hostname = '';
      if (relPath[0] !== '') relPath.unshift('');
      if (relPath.length < 2) relPath.unshift('');
      result.pathname = relPath.join('/');
    } else {
      result.pathname = relative.pathname;
    }
    result.search = relative.search;
    result.query = relative.query;
    result.host = relative.host || '';
    result.auth = relative.auth;
    result.hostname = relative.hostname || relative.host;
    result.port = relative.port;
    // to support http.request
    if (result.pathname || result.search) {
      var p = result.pathname || '';
      var s = result.search || '';
      result.path = p + s;
    }
    result.slashes = result.slashes || relative.slashes;
    result.href = result.format();
    return result;
  }

  var isSourceAbs = (result.pathname && result.pathname.charAt(0) === '/'),
      isRelAbs = (
          relative.host ||
          relative.pathname && relative.pathname.charAt(0) === '/'
      ),
      mustEndAbs = (isRelAbs || isSourceAbs ||
                    (result.host && relative.pathname)),
      removeAllDots = mustEndAbs,
      srcPath = result.pathname && result.pathname.split('/') || [],
      relPath = relative.pathname && relative.pathname.split('/') || [],
      psychotic = result.protocol && !slashedProtocol[result.protocol];

  // if the url is a non-slashed url, then relative
  // links like ../.. should be able
  // to crawl up to the hostname, as well.  This is strange.
  // result.protocol has already been set by now.
  // Later on, put the first path part into the host field.
  if (psychotic) {
    result.hostname = '';
    result.port = null;
    if (result.host) {
      if (srcPath[0] === '') srcPath[0] = result.host;
      else srcPath.unshift(result.host);
    }
    result.host = '';
    if (relative.protocol) {
      relative.hostname = null;
      relative.port = null;
      if (relative.host) {
        if (relPath[0] === '') relPath[0] = relative.host;
        else relPath.unshift(relative.host);
      }
      relative.host = null;
    }
    mustEndAbs = mustEndAbs && (relPath[0] === '' || srcPath[0] === '');
  }

  if (isRelAbs) {
    // it's absolute.
    result.host = (relative.host || relative.host === '') ?
                  relative.host : result.host;
    result.hostname = (relative.hostname || relative.hostname === '') ?
                      relative.hostname : result.hostname;
    result.search = relative.search;
    result.query = relative.query;
    srcPath = relPath;
    // fall through to the dot-handling below.
  } else if (relPath.length) {
    // it's relative
    // throw away the existing file, and take the new path instead.
    if (!srcPath) srcPath = [];
    srcPath.pop();
    srcPath = srcPath.concat(relPath);
    result.search = relative.search;
    result.query = relative.query;
  } else if (!util.isNullOrUndefined(relative.search)) {
    // just pull out the search.
    // like href='?foo'.
    // Put this after the other two cases because it simplifies the booleans
    if (psychotic) {
      result.hostname = result.host = srcPath.shift();
      //occationaly the auth can get stuck only in host
      //this especially happens in cases like
      //url.resolveObject('mailto:local1@domain1', 'local2@domain2')
      var authInHost = result.host && result.host.indexOf('@') > 0 ?
                       result.host.split('@') : false;
      if (authInHost) {
        result.auth = authInHost.shift();
        result.host = result.hostname = authInHost.shift();
      }
    }
    result.search = relative.search;
    result.query = relative.query;
    //to support http.request
    if (!util.isNull(result.pathname) || !util.isNull(result.search)) {
      result.path = (result.pathname ? result.pathname : '') +
                    (result.search ? result.search : '');
    }
    result.href = result.format();
    return result;
  }

  if (!srcPath.length) {
    // no path at all.  easy.
    // we've already handled the other stuff above.
    result.pathname = null;
    //to support http.request
    if (result.search) {
      result.path = '/' + result.search;
    } else {
      result.path = null;
    }
    result.href = result.format();
    return result;
  }

  // if a url ENDs in . or .., then it must get a trailing slash.
  // however, if it ends in anything else non-slashy,
  // then it must NOT get a trailing slash.
  var last = srcPath.slice(-1)[0];
  var hasTrailingSlash = (
      (result.host || relative.host || srcPath.length > 1) &&
      (last === '.' || last === '..') || last === '');

  // strip single dots, resolve double dots to parent dir
  // if the path tries to go above the root, `up` ends up > 0
  var up = 0;
  for (var i = srcPath.length; i >= 0; i--) {
    last = srcPath[i];
    if (last === '.') {
      srcPath.splice(i, 1);
    } else if (last === '..') {
      srcPath.splice(i, 1);
      up++;
    } else if (up) {
      srcPath.splice(i, 1);
      up--;
    }
  }

  // if the path is allowed to go above the root, restore leading ..s
  if (!mustEndAbs && !removeAllDots) {
    for (; up--; up) {
      srcPath.unshift('..');
    }
  }

  if (mustEndAbs && srcPath[0] !== '' &&
      (!srcPath[0] || srcPath[0].charAt(0) !== '/')) {
    srcPath.unshift('');
  }

  if (hasTrailingSlash && (srcPath.join('/').substr(-1) !== '/')) {
    srcPath.push('');
  }

  var isAbsolute = srcPath[0] === '' ||
      (srcPath[0] && srcPath[0].charAt(0) === '/');

  // put the host back
  if (psychotic) {
    result.hostname = result.host = isAbsolute ? '' :
                                    srcPath.length ? srcPath.shift() : '';
    //occationaly the auth can get stuck only in host
    //this especially happens in cases like
    //url.resolveObject('mailto:local1@domain1', 'local2@domain2')
    var authInHost = result.host && result.host.indexOf('@') > 0 ?
                     result.host.split('@') : false;
    if (authInHost) {
      result.auth = authInHost.shift();
      result.host = result.hostname = authInHost.shift();
    }
  }

  mustEndAbs = mustEndAbs || (result.host && srcPath.length);

  if (mustEndAbs && !isAbsolute) {
    srcPath.unshift('');
  }

  if (!srcPath.length) {
    result.pathname = null;
    result.path = null;
  } else {
    result.pathname = srcPath.join('/');
  }

  //to support request.http
  if (!util.isNull(result.pathname) || !util.isNull(result.search)) {
    result.path = (result.pathname ? result.pathname : '') +
                  (result.search ? result.search : '');
  }
  result.auth = relative.auth || result.auth;
  result.slashes = result.slashes || relative.slashes;
  result.href = result.format();
  return result;
};

Url.prototype.parseHost = function() {
  var host = this.host;
  var port = portPattern.exec(host);
  if (port) {
    port = port[0];
    if (port !== ':') {
      this.port = port.substr(1);
    }
    host = host.substr(0, host.length - port.length);
  }
  if (host) this.hostname = host;
};

},{"./util":80,"punycode":67,"querystring":70}],80:[function(require,module,exports){
'use strict';

module.exports = {
  isString: function(arg) {
    return typeof(arg) === 'string';
  },
  isObject: function(arg) {
    return typeof(arg) === 'object' && arg !== null;
  },
  isNull: function(arg) {
    return arg === null;
  },
  isNullOrUndefined: function(arg) {
    return arg == null;
  }
};

},{}],81:[function(require,module,exports){
module.exports = function isBuffer(arg) {
  return arg && typeof arg === 'object'
    && typeof arg.copy === 'function'
    && typeof arg.fill === 'function'
    && typeof arg.readUInt8 === 'function';
}
},{}],82:[function(require,module,exports){
// Currently in sync with Node.js lib/internal/util/types.js
// https://github.com/nodejs/node/commit/112cc7c27551254aa2b17098fb774867f05ed0d9

'use strict';

var isArgumentsObject = require('is-arguments');
var isGeneratorFunction = require('is-generator-function');
var whichTypedArray = require('which-typed-array');
var isTypedArray = require('is-typed-array');

function uncurryThis(f) {
  return f.call.bind(f);
}

var BigIntSupported = typeof BigInt !== 'undefined';
var SymbolSupported = typeof Symbol !== 'undefined';

var ObjectToString = uncurryThis(Object.prototype.toString);

var numberValue = uncurryThis(Number.prototype.valueOf);
var stringValue = uncurryThis(String.prototype.valueOf);
var booleanValue = uncurryThis(Boolean.prototype.valueOf);

if (BigIntSupported) {
  var bigIntValue = uncurryThis(BigInt.prototype.valueOf);
}

if (SymbolSupported) {
  var symbolValue = uncurryThis(Symbol.prototype.valueOf);
}

function checkBoxedPrimitive(value, prototypeValueOf) {
  if (typeof value !== 'object') {
    return false;
  }
  try {
    prototypeValueOf(value);
    return true;
  } catch(e) {
    return false;
  }
}

exports.isArgumentsObject = isArgumentsObject;
exports.isGeneratorFunction = isGeneratorFunction;
exports.isTypedArray = isTypedArray;

// Taken from here and modified for better browser support
// https://github.com/sindresorhus/p-is-promise/blob/cda35a513bda03f977ad5cde3a079d237e82d7ef/index.js
function isPromise(input) {
	return (
		(
			typeof Promise !== 'undefined' &&
			input instanceof Promise
		) ||
		(
			input !== null &&
			typeof input === 'object' &&
			typeof input.then === 'function' &&
			typeof input.catch === 'function'
		)
	);
}
exports.isPromise = isPromise;

function isArrayBufferView(value) {
  if (typeof ArrayBuffer !== 'undefined' && ArrayBuffer.isView) {
    return ArrayBuffer.isView(value);
  }

  return (
    isTypedArray(value) ||
    isDataView(value)
  );
}
exports.isArrayBufferView = isArrayBufferView;


function isUint8Array(value) {
  return whichTypedArray(value) === 'Uint8Array';
}
exports.isUint8Array = isUint8Array;

function isUint8ClampedArray(value) {
  return whichTypedArray(value) === 'Uint8ClampedArray';
}
exports.isUint8ClampedArray = isUint8ClampedArray;

function isUint16Array(value) {
  return whichTypedArray(value) === 'Uint16Array';
}
exports.isUint16Array = isUint16Array;

function isUint32Array(value) {
  return whichTypedArray(value) === 'Uint32Array';
}
exports.isUint32Array = isUint32Array;

function isInt8Array(value) {
  return whichTypedArray(value) === 'Int8Array';
}
exports.isInt8Array = isInt8Array;

function isInt16Array(value) {
  return whichTypedArray(value) === 'Int16Array';
}
exports.isInt16Array = isInt16Array;

function isInt32Array(value) {
  return whichTypedArray(value) === 'Int32Array';
}
exports.isInt32Array = isInt32Array;

function isFloat32Array(value) {
  return whichTypedArray(value) === 'Float32Array';
}
exports.isFloat32Array = isFloat32Array;

function isFloat64Array(value) {
  return whichTypedArray(value) === 'Float64Array';
}
exports.isFloat64Array = isFloat64Array;

function isBigInt64Array(value) {
  return whichTypedArray(value) === 'BigInt64Array';
}
exports.isBigInt64Array = isBigInt64Array;

function isBigUint64Array(value) {
  return whichTypedArray(value) === 'BigUint64Array';
}
exports.isBigUint64Array = isBigUint64Array;

function isMapToString(value) {
  return ObjectToString(value) === '[object Map]';
}
isMapToString.working = (
  typeof Map !== 'undefined' &&
  isMapToString(new Map())
);

function isMap(value) {
  if (typeof Map === 'undefined') {
    return false;
  }

  return isMapToString.working
    ? isMapToString(value)
    : value instanceof Map;
}
exports.isMap = isMap;

function isSetToString(value) {
  return ObjectToString(value) === '[object Set]';
}
isSetToString.working = (
  typeof Set !== 'undefined' &&
  isSetToString(new Set())
);
function isSet(value) {
  if (typeof Set === 'undefined') {
    return false;
  }

  return isSetToString.working
    ? isSetToString(value)
    : value instanceof Set;
}
exports.isSet = isSet;

function isWeakMapToString(value) {
  return ObjectToString(value) === '[object WeakMap]';
}
isWeakMapToString.working = (
  typeof WeakMap !== 'undefined' &&
  isWeakMapToString(new WeakMap())
);
function isWeakMap(value) {
  if (typeof WeakMap === 'undefined') {
    return false;
  }

  return isWeakMapToString.working
    ? isWeakMapToString(value)
    : value instanceof WeakMap;
}
exports.isWeakMap = isWeakMap;

function isWeakSetToString(value) {
  return ObjectToString(value) === '[object WeakSet]';
}
isWeakSetToString.working = (
  typeof WeakSet !== 'undefined' &&
  isWeakSetToString(new WeakSet())
);
function isWeakSet(value) {
  return isWeakSetToString(value);
}
exports.isWeakSet = isWeakSet;

function isArrayBufferToString(value) {
  return ObjectToString(value) === '[object ArrayBuffer]';
}
isArrayBufferToString.working = (
  typeof ArrayBuffer !== 'undefined' &&
  isArrayBufferToString(new ArrayBuffer())
);
function isArrayBuffer(value) {
  if (typeof ArrayBuffer === 'undefined') {
    return false;
  }

  return isArrayBufferToString.working
    ? isArrayBufferToString(value)
    : value instanceof ArrayBuffer;
}
exports.isArrayBuffer = isArrayBuffer;

function isDataViewToString(value) {
  return ObjectToString(value) === '[object DataView]';
}
isDataViewToString.working = (
  typeof ArrayBuffer !== 'undefined' &&
  typeof DataView !== 'undefined' &&
  isDataViewToString(new DataView(new ArrayBuffer(1), 0, 1))
);
function isDataView(value) {
  if (typeof DataView === 'undefined') {
    return false;
  }

  return isDataViewToString.working
    ? isDataViewToString(value)
    : value instanceof DataView;
}
exports.isDataView = isDataView;

// Store a copy of SharedArrayBuffer in case it's deleted elsewhere
var SharedArrayBufferCopy = typeof SharedArrayBuffer !== 'undefined' ? SharedArrayBuffer : undefined;
function isSharedArrayBufferToString(value) {
  return ObjectToString(value) === '[object SharedArrayBuffer]';
}
function isSharedArrayBuffer(value) {
  if (typeof SharedArrayBufferCopy === 'undefined') {
    return false;
  }

  if (typeof isSharedArrayBufferToString.working === 'undefined') {
    isSharedArrayBufferToString.working = isSharedArrayBufferToString(new SharedArrayBufferCopy());
  }

  return isSharedArrayBufferToString.working
    ? isSharedArrayBufferToString(value)
    : value instanceof SharedArrayBufferCopy;
}
exports.isSharedArrayBuffer = isSharedArrayBuffer;

function isAsyncFunction(value) {
  return ObjectToString(value) === '[object AsyncFunction]';
}
exports.isAsyncFunction = isAsyncFunction;

function isMapIterator(value) {
  return ObjectToString(value) === '[object Map Iterator]';
}
exports.isMapIterator = isMapIterator;

function isSetIterator(value) {
  return ObjectToString(value) === '[object Set Iterator]';
}
exports.isSetIterator = isSetIterator;

function isGeneratorObject(value) {
  return ObjectToString(value) === '[object Generator]';
}
exports.isGeneratorObject = isGeneratorObject;

function isWebAssemblyCompiledModule(value) {
  return ObjectToString(value) === '[object WebAssembly.Module]';
}
exports.isWebAssemblyCompiledModule = isWebAssemblyCompiledModule;

function isNumberObject(value) {
  return checkBoxedPrimitive(value, numberValue);
}
exports.isNumberObject = isNumberObject;

function isStringObject(value) {
  return checkBoxedPrimitive(value, stringValue);
}
exports.isStringObject = isStringObject;

function isBooleanObject(value) {
  return checkBoxedPrimitive(value, booleanValue);
}
exports.isBooleanObject = isBooleanObject;

function isBigIntObject(value) {
  return BigIntSupported && checkBoxedPrimitive(value, bigIntValue);
}
exports.isBigIntObject = isBigIntObject;

function isSymbolObject(value) {
  return SymbolSupported && checkBoxedPrimitive(value, symbolValue);
}
exports.isSymbolObject = isSymbolObject;

function isBoxedPrimitive(value) {
  return (
    isNumberObject(value) ||
    isStringObject(value) ||
    isBooleanObject(value) ||
    isBigIntObject(value) ||
    isSymbolObject(value)
  );
}
exports.isBoxedPrimitive = isBoxedPrimitive;

function isAnyArrayBuffer(value) {
  return typeof Uint8Array !== 'undefined' && (
    isArrayBuffer(value) ||
    isSharedArrayBuffer(value)
  );
}
exports.isAnyArrayBuffer = isAnyArrayBuffer;

['isProxy', 'isExternal', 'isModuleNamespaceObject'].forEach(function(method) {
  Object.defineProperty(exports, method, {
    enumerable: false,
    value: function() {
      throw new Error(method + ' is not supported in userland');
    }
  });
});

},{"is-arguments":14,"is-generator-function":15,"is-typed-array":16,"which-typed-array":84}],83:[function(require,module,exports){
(function (process){(function (){
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

var getOwnPropertyDescriptors = Object.getOwnPropertyDescriptors ||
  function getOwnPropertyDescriptors(obj) {
    var keys = Object.keys(obj);
    var descriptors = {};
    for (var i = 0; i < keys.length; i++) {
      descriptors[keys[i]] = Object.getOwnPropertyDescriptor(obj, keys[i]);
    }
    return descriptors;
  };

var formatRegExp = /%[sdj%]/g;
exports.format = function(f) {
  if (!isString(f)) {
    var objects = [];
    for (var i = 0; i < arguments.length; i++) {
      objects.push(inspect(arguments[i]));
    }
    return objects.join(' ');
  }

  var i = 1;
  var args = arguments;
  var len = args.length;
  var str = String(f).replace(formatRegExp, function(x) {
    if (x === '%%') return '%';
    if (i >= len) return x;
    switch (x) {
      case '%s': return String(args[i++]);
      case '%d': return Number(args[i++]);
      case '%j':
        try {
          return JSON.stringify(args[i++]);
        } catch (_) {
          return '[Circular]';
        }
      default:
        return x;
    }
  });
  for (var x = args[i]; i < len; x = args[++i]) {
    if (isNull(x) || !isObject(x)) {
      str += ' ' + x;
    } else {
      str += ' ' + inspect(x);
    }
  }
  return str;
};


// Mark that a method should not be used.
// Returns a modified function which warns once by default.
// If --no-deprecation is set, then it is a no-op.
exports.deprecate = function(fn, msg) {
  if (typeof process !== 'undefined' && process.noDeprecation === true) {
    return fn;
  }

  // Allow for deprecating things in the process of starting up.
  if (typeof process === 'undefined') {
    return function() {
      return exports.deprecate(fn, msg).apply(this, arguments);
    };
  }

  var warned = false;
  function deprecated() {
    if (!warned) {
      if (process.throwDeprecation) {
        throw new Error(msg);
      } else if (process.traceDeprecation) {
        console.trace(msg);
      } else {
        console.error(msg);
      }
      warned = true;
    }
    return fn.apply(this, arguments);
  }

  return deprecated;
};


var debugs = {};
var debugEnvRegex = /^$/;

if (process.env.NODE_DEBUG) {
  var debugEnv = process.env.NODE_DEBUG;
  debugEnv = debugEnv.replace(/[|\\{}()[\]^$+?.]/g, '\\$&')
    .replace(/\*/g, '.*')
    .replace(/,/g, '$|^')
    .toUpperCase();
  debugEnvRegex = new RegExp('^' + debugEnv + '$', 'i');
}
exports.debuglog = function(set) {
  set = set.toUpperCase();
  if (!debugs[set]) {
    if (debugEnvRegex.test(set)) {
      var pid = process.pid;
      debugs[set] = function() {
        var msg = exports.format.apply(exports, arguments);
        console.error('%s %d: %s', set, pid, msg);
      };
    } else {
      debugs[set] = function() {};
    }
  }
  return debugs[set];
};


/**
 * Echos the value of a value. Trys to print the value out
 * in the best way possible given the different types.
 *
 * @param {Object} obj The object to print out.
 * @param {Object} opts Optional options object that alters the output.
 */
/* legacy: obj, showHidden, depth, colors*/
function inspect(obj, opts) {
  // default options
  var ctx = {
    seen: [],
    stylize: stylizeNoColor
  };
  // legacy...
  if (arguments.length >= 3) ctx.depth = arguments[2];
  if (arguments.length >= 4) ctx.colors = arguments[3];
  if (isBoolean(opts)) {
    // legacy...
    ctx.showHidden = opts;
  } else if (opts) {
    // got an "options" object
    exports._extend(ctx, opts);
  }
  // set default options
  if (isUndefined(ctx.showHidden)) ctx.showHidden = false;
  if (isUndefined(ctx.depth)) ctx.depth = 2;
  if (isUndefined(ctx.colors)) ctx.colors = false;
  if (isUndefined(ctx.customInspect)) ctx.customInspect = true;
  if (ctx.colors) ctx.stylize = stylizeWithColor;
  return formatValue(ctx, obj, ctx.depth);
}
exports.inspect = inspect;


// http://en.wikipedia.org/wiki/ANSI_escape_code#graphics
inspect.colors = {
  'bold' : [1, 22],
  'italic' : [3, 23],
  'underline' : [4, 24],
  'inverse' : [7, 27],
  'white' : [37, 39],
  'grey' : [90, 39],
  'black' : [30, 39],
  'blue' : [34, 39],
  'cyan' : [36, 39],
  'green' : [32, 39],
  'magenta' : [35, 39],
  'red' : [31, 39],
  'yellow' : [33, 39]
};

// Don't use 'blue' not visible on cmd.exe
inspect.styles = {
  'special': 'cyan',
  'number': 'yellow',
  'boolean': 'yellow',
  'undefined': 'grey',
  'null': 'bold',
  'string': 'green',
  'date': 'magenta',
  // "name": intentionally not styling
  'regexp': 'red'
};


function stylizeWithColor(str, styleType) {
  var style = inspect.styles[styleType];

  if (style) {
    return '\u001b[' + inspect.colors[style][0] + 'm' + str +
           '\u001b[' + inspect.colors[style][1] + 'm';
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
  // Provide a hook for user-specified inspect functions.
  // Check that value is an object with an inspect function on it
  if (ctx.customInspect &&
      value &&
      isFunction(value.inspect) &&
      // Filter out the util module, it's inspect function is special
      value.inspect !== exports.inspect &&
      // Also filter out any prototype objects using the circular check.
      !(value.constructor && value.constructor.prototype === value)) {
    var ret = value.inspect(recurseTimes, ctx);
    if (!isString(ret)) {
      ret = formatValue(ctx, ret, recurseTimes);
    }
    return ret;
  }

  // Primitive types cannot have properties
  var primitive = formatPrimitive(ctx, value);
  if (primitive) {
    return primitive;
  }

  // Look up the keys of the object.
  var keys = Object.keys(value);
  var visibleKeys = arrayToHash(keys);

  if (ctx.showHidden) {
    keys = Object.getOwnPropertyNames(value);
  }

  // IE doesn't make error fields non-enumerable
  // http://msdn.microsoft.com/en-us/library/ie/dww52sbt(v=vs.94).aspx
  if (isError(value)
      && (keys.indexOf('message') >= 0 || keys.indexOf('description') >= 0)) {
    return formatError(value);
  }

  // Some type of object without properties can be shortcutted.
  if (keys.length === 0) {
    if (isFunction(value)) {
      var name = value.name ? ': ' + value.name : '';
      return ctx.stylize('[Function' + name + ']', 'special');
    }
    if (isRegExp(value)) {
      return ctx.stylize(RegExp.prototype.toString.call(value), 'regexp');
    }
    if (isDate(value)) {
      return ctx.stylize(Date.prototype.toString.call(value), 'date');
    }
    if (isError(value)) {
      return formatError(value);
    }
  }

  var base = '', array = false, braces = ['{', '}'];

  // Make Array say that they are Array
  if (isArray(value)) {
    array = true;
    braces = ['[', ']'];
  }

  // Make functions say that they are functions
  if (isFunction(value)) {
    var n = value.name ? ': ' + value.name : '';
    base = ' [Function' + n + ']';
  }

  // Make RegExps say that they are RegExps
  if (isRegExp(value)) {
    base = ' ' + RegExp.prototype.toString.call(value);
  }

  // Make dates with properties first say the date
  if (isDate(value)) {
    base = ' ' + Date.prototype.toUTCString.call(value);
  }

  // Make error with message first say the error
  if (isError(value)) {
    base = ' ' + formatError(value);
  }

  if (keys.length === 0 && (!array || value.length == 0)) {
    return braces[0] + base + braces[1];
  }

  if (recurseTimes < 0) {
    if (isRegExp(value)) {
      return ctx.stylize(RegExp.prototype.toString.call(value), 'regexp');
    } else {
      return ctx.stylize('[Object]', 'special');
    }
  }

  ctx.seen.push(value);

  var output;
  if (array) {
    output = formatArray(ctx, value, recurseTimes, visibleKeys, keys);
  } else {
    output = keys.map(function(key) {
      return formatProperty(ctx, value, recurseTimes, visibleKeys, key, array);
    });
  }

  ctx.seen.pop();

  return reduceToSingleString(output, base, braces);
}


function formatPrimitive(ctx, value) {
  if (isUndefined(value))
    return ctx.stylize('undefined', 'undefined');
  if (isString(value)) {
    var simple = '\'' + JSON.stringify(value).replace(/^"|"$/g, '')
                                             .replace(/'/g, "\\'")
                                             .replace(/\\"/g, '"') + '\'';
    return ctx.stylize(simple, 'string');
  }
  if (isNumber(value))
    return ctx.stylize('' + value, 'number');
  if (isBoolean(value))
    return ctx.stylize('' + value, 'boolean');
  // For some reason typeof null is "object", so special case here.
  if (isNull(value))
    return ctx.stylize('null', 'null');
}


function formatError(value) {
  return '[' + Error.prototype.toString.call(value) + ']';
}


function formatArray(ctx, value, recurseTimes, visibleKeys, keys) {
  var output = [];
  for (var i = 0, l = value.length; i < l; ++i) {
    if (hasOwnProperty(value, String(i))) {
      output.push(formatProperty(ctx, value, recurseTimes, visibleKeys,
          String(i), true));
    } else {
      output.push('');
    }
  }
  keys.forEach(function(key) {
    if (!key.match(/^\d+$/)) {
      output.push(formatProperty(ctx, value, recurseTimes, visibleKeys,
          key, true));
    }
  });
  return output;
}


function formatProperty(ctx, value, recurseTimes, visibleKeys, key, array) {
  var name, str, desc;
  desc = Object.getOwnPropertyDescriptor(value, key) || { value: value[key] };
  if (desc.get) {
    if (desc.set) {
      str = ctx.stylize('[Getter/Setter]', 'special');
    } else {
      str = ctx.stylize('[Getter]', 'special');
    }
  } else {
    if (desc.set) {
      str = ctx.stylize('[Setter]', 'special');
    }
  }
  if (!hasOwnProperty(visibleKeys, key)) {
    name = '[' + key + ']';
  }
  if (!str) {
    if (ctx.seen.indexOf(desc.value) < 0) {
      if (isNull(recurseTimes)) {
        str = formatValue(ctx, desc.value, null);
      } else {
        str = formatValue(ctx, desc.value, recurseTimes - 1);
      }
      if (str.indexOf('\n') > -1) {
        if (array) {
          str = str.split('\n').map(function(line) {
            return '  ' + line;
          }).join('\n').substr(2);
        } else {
          str = '\n' + str.split('\n').map(function(line) {
            return '   ' + line;
          }).join('\n');
        }
      }
    } else {
      str = ctx.stylize('[Circular]', 'special');
    }
  }
  if (isUndefined(name)) {
    if (array && key.match(/^\d+$/)) {
      return str;
    }
    name = JSON.stringify('' + key);
    if (name.match(/^"([a-zA-Z_][a-zA-Z_0-9]*)"$/)) {
      name = name.substr(1, name.length - 2);
      name = ctx.stylize(name, 'name');
    } else {
      name = name.replace(/'/g, "\\'")
                 .replace(/\\"/g, '"')
                 .replace(/(^"|"$)/g, "'");
      name = ctx.stylize(name, 'string');
    }
  }

  return name + ': ' + str;
}


function reduceToSingleString(output, base, braces) {
  var numLinesEst = 0;
  var length = output.reduce(function(prev, cur) {
    numLinesEst++;
    if (cur.indexOf('\n') >= 0) numLinesEst++;
    return prev + cur.replace(/\u001b\[\d\d?m/g, '').length + 1;
  }, 0);

  if (length > 60) {
    return braces[0] +
           (base === '' ? '' : base + '\n ') +
           ' ' +
           output.join(',\n  ') +
           ' ' +
           braces[1];
  }

  return braces[0] + base + ' ' + output.join(', ') + ' ' + braces[1];
}


// NOTE: These type checking functions intentionally don't use `instanceof`
// because it is fragile and can be easily faked with `Object.create()`.
exports.types = require('./support/types');

function isArray(ar) {
  return Array.isArray(ar);
}
exports.isArray = isArray;

function isBoolean(arg) {
  return typeof arg === 'boolean';
}
exports.isBoolean = isBoolean;

function isNull(arg) {
  return arg === null;
}
exports.isNull = isNull;

function isNullOrUndefined(arg) {
  return arg == null;
}
exports.isNullOrUndefined = isNullOrUndefined;

function isNumber(arg) {
  return typeof arg === 'number';
}
exports.isNumber = isNumber;

function isString(arg) {
  return typeof arg === 'string';
}
exports.isString = isString;

function isSymbol(arg) {
  return typeof arg === 'symbol';
}
exports.isSymbol = isSymbol;

function isUndefined(arg) {
  return arg === void 0;
}
exports.isUndefined = isUndefined;

function isRegExp(re) {
  return isObject(re) && objectToString(re) === '[object RegExp]';
}
exports.isRegExp = isRegExp;
exports.types.isRegExp = isRegExp;

function isObject(arg) {
  return typeof arg === 'object' && arg !== null;
}
exports.isObject = isObject;

function isDate(d) {
  return isObject(d) && objectToString(d) === '[object Date]';
}
exports.isDate = isDate;
exports.types.isDate = isDate;

function isError(e) {
  return isObject(e) &&
      (objectToString(e) === '[object Error]' || e instanceof Error);
}
exports.isError = isError;
exports.types.isNativeError = isError;

function isFunction(arg) {
  return typeof arg === 'function';
}
exports.isFunction = isFunction;

function isPrimitive(arg) {
  return arg === null ||
         typeof arg === 'boolean' ||
         typeof arg === 'number' ||
         typeof arg === 'string' ||
         typeof arg === 'symbol' ||  // ES6 symbol
         typeof arg === 'undefined';
}
exports.isPrimitive = isPrimitive;

exports.isBuffer = require('./support/isBuffer');

function objectToString(o) {
  return Object.prototype.toString.call(o);
}


function pad(n) {
  return n < 10 ? '0' + n.toString(10) : n.toString(10);
}


var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep',
              'Oct', 'Nov', 'Dec'];

// 26 Feb 16:19:34
function timestamp() {
  var d = new Date();
  var time = [pad(d.getHours()),
              pad(d.getMinutes()),
              pad(d.getSeconds())].join(':');
  return [d.getDate(), months[d.getMonth()], time].join(' ');
}


// log is just a thin wrapper to console.log that prepends a timestamp
exports.log = function() {
  console.log('%s - %s', timestamp(), exports.format.apply(exports, arguments));
};


/**
 * Inherit the prototype methods from one constructor into another.
 *
 * The Function.prototype.inherits from lang.js rewritten as a standalone
 * function (not on Function.prototype). NOTE: If this file is to be loaded
 * during bootstrapping this function needs to be rewritten using some native
 * functions as prototype setup using normal JavaScript does not work as
 * expected during bootstrapping (see mirror.js in r114903).
 *
 * @param {function} ctor Constructor function which needs to inherit the
 *     prototype.
 * @param {function} superCtor Constructor function to inherit prototype from.
 */
exports.inherits = require('inherits');

exports._extend = function(origin, add) {
  // Don't do anything if add isn't an object
  if (!add || !isObject(add)) return origin;

  var keys = Object.keys(add);
  var i = keys.length;
  while (i--) {
    origin[keys[i]] = add[keys[i]];
  }
  return origin;
};

function hasOwnProperty(obj, prop) {
  return Object.prototype.hasOwnProperty.call(obj, prop);
}

var kCustomPromisifiedSymbol = typeof Symbol !== 'undefined' ? Symbol('util.promisify.custom') : undefined;

exports.promisify = function promisify(original) {
  if (typeof original !== 'function')
    throw new TypeError('The "original" argument must be of type Function');

  if (kCustomPromisifiedSymbol && original[kCustomPromisifiedSymbol]) {
    var fn = original[kCustomPromisifiedSymbol];
    if (typeof fn !== 'function') {
      throw new TypeError('The "util.promisify.custom" argument must be of type Function');
    }
    Object.defineProperty(fn, kCustomPromisifiedSymbol, {
      value: fn, enumerable: false, writable: false, configurable: true
    });
    return fn;
  }

  function fn() {
    var promiseResolve, promiseReject;
    var promise = new Promise(function (resolve, reject) {
      promiseResolve = resolve;
      promiseReject = reject;
    });

    var args = [];
    for (var i = 0; i < arguments.length; i++) {
      args.push(arguments[i]);
    }
    args.push(function (err, value) {
      if (err) {
        promiseReject(err);
      } else {
        promiseResolve(value);
      }
    });

    try {
      original.apply(this, args);
    } catch (err) {
      promiseReject(err);
    }

    return promise;
  }

  Object.setPrototypeOf(fn, Object.getPrototypeOf(original));

  if (kCustomPromisifiedSymbol) Object.defineProperty(fn, kCustomPromisifiedSymbol, {
    value: fn, enumerable: false, writable: false, configurable: true
  });
  return Object.defineProperties(
    fn,
    getOwnPropertyDescriptors(original)
  );
}

exports.promisify.custom = kCustomPromisifiedSymbol

function callbackifyOnRejected(reason, cb) {
  // `!reason` guard inspired by bluebird (Ref: https://goo.gl/t5IS6M).
  // Because `null` is a special error value in callbacks which means "no error
  // occurred", we error-wrap so the callback consumer can distinguish between
  // "the promise rejected with null" or "the promise fulfilled with undefined".
  if (!reason) {
    var newReason = new Error('Promise was rejected with a falsy value');
    newReason.reason = reason;
    reason = newReason;
  }
  return cb(reason);
}

function callbackify(original) {
  if (typeof original !== 'function') {
    throw new TypeError('The "original" argument must be of type Function');
  }

  // We DO NOT return the promise as it gives the user a false sense that
  // the promise is actually somehow related to the callback's execution
  // and that the callback throwing will reject the promise.
  function callbackified() {
    var args = [];
    for (var i = 0; i < arguments.length; i++) {
      args.push(arguments[i]);
    }

    var maybeCb = args.pop();
    if (typeof maybeCb !== 'function') {
      throw new TypeError('The last argument must be of type Function');
    }
    var self = this;
    var cb = function() {
      return maybeCb.apply(self, arguments);
    };
    // In true node style we process the callback on `nextTick` with all the
    // implications (stack, `uncaughtException`, `async_hooks`)
    original.apply(this, args)
      .then(function(ret) { process.nextTick(cb.bind(null, null, ret)) },
            function(rej) { process.nextTick(callbackifyOnRejected.bind(null, rej, cb)) });
  }

  Object.setPrototypeOf(callbackified, Object.getPrototypeOf(original));
  Object.defineProperties(callbackified,
                          getOwnPropertyDescriptors(original));
  return callbackified;
}
exports.callbackify = callbackify;

}).call(this)}).call(this,require('_process'))
},{"./support/isBuffer":81,"./support/types":82,"_process":64,"inherits":13}],84:[function(require,module,exports){
(function (global){(function (){
'use strict';

var forEach = require('foreach');
var availableTypedArrays = require('available-typed-arrays');
var callBound = require('call-bind/callBound');

var $toString = callBound('Object.prototype.toString');
var hasToStringTag = require('has-tostringtag/shams')();

var typedArrays = availableTypedArrays();

var $slice = callBound('String.prototype.slice');
var toStrTags = {};
var gOPD = require('es-abstract/helpers/getOwnPropertyDescriptor');
var getPrototypeOf = Object.getPrototypeOf; // require('getprototypeof');
if (hasToStringTag && gOPD && getPrototypeOf) {
	forEach(typedArrays, function (typedArray) {
		if (typeof global[typedArray] === 'function') {
			var arr = new global[typedArray]();
			if (!(Symbol.toStringTag in arr)) {
				throw new EvalError('this engine has support for Symbol.toStringTag, but ' + typedArray + ' does not have the property! Please report this.');
			}
			var proto = getPrototypeOf(arr);
			var descriptor = gOPD(proto, Symbol.toStringTag);
			if (!descriptor) {
				var superProto = getPrototypeOf(proto);
				descriptor = gOPD(superProto, Symbol.toStringTag);
			}
			toStrTags[typedArray] = descriptor.get;
		}
	});
}

var tryTypedArrays = function tryAllTypedArrays(value) {
	var foundName = false;
	forEach(toStrTags, function (getter, typedArray) {
		if (!foundName) {
			try {
				var name = getter.call(value);
				if (name === typedArray) {
					foundName = name;
				}
			} catch (e) {}
		}
	});
	return foundName;
};

var isTypedArray = require('is-typed-array');

module.exports = function whichTypedArray(value) {
	if (!isTypedArray(value)) { return false; }
	if (!hasToStringTag) { return $slice($toString(value), 8, -1); }
	return tryTypedArrays(value);
};

}).call(this)}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"available-typed-arrays":1,"call-bind/callBound":2,"es-abstract/helpers/getOwnPropertyDescriptor":4,"foreach":5,"has-tostringtag/shams":11,"is-typed-array":16}],85:[function(require,module,exports){
"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MangaUpdates = exports.MangaUpdatesInfo = void 0;
/* eslint-disable @typescript-eslint/ban-ts-comment */
const paperback_extensions_common_1 = require("paperback-extensions-common");
const session = __importStar(require("./utils/mu-session"));
const mu_source_menu_1 = require("./ui-makers/mu-source-menu");
exports.MangaUpdatesInfo = {
    name: 'MangaUpdates',
    author: 'IntermittentlyRupert',
    contentRating: paperback_extensions_common_1.ContentRating.EVERYONE,
    icon: 'icon.png',
    version: '0.1.0',
    description: 'MangaUpdates Tracker',
    websiteBaseURL: 'https://www.mangaupdates.com',
};
class MangaUpdates extends paperback_extensions_common_1.Tracker {
    constructor() {
        super(...arguments);
        this.stateManager = createSourceStateManager({});
        this.requestManager = createRequestManager({
            requestsPerSecond: 2.5,
            requestTimeout: 20000,
            interceptor: {
                interceptRequest: (request) => session.setCookiesOnRequest(this.stateManager, request),
                interceptResponse: (response) => session.readCookiesFromResponse(this.stateManager, response),
            },
        });
    }
    /** TODO */
    getTrackedManga(mangaId) {
        return __awaiter(this, void 0, void 0, function* () {
            throw new Error('unimplemented');
        });
    }
    /** TODO */
    getMangaForm(mangaId) {
        throw new Error('unimplemented');
    }
    getSourceMenu() {
        return (0, mu_source_menu_1.getSourceMenu)(this.stateManager, this.requestManager);
    }
    /** TODO */
    getSearchResults(query, metadata) {
        return __awaiter(this, void 0, void 0, function* () {
            return createPagedResults({ results: [] });
        });
    }
    /** TODO */
    processActionQueue(actionQueue) {
        return __awaiter(this, void 0, void 0, function* () {
            yield Promise.resolve();
        });
    }
}
exports.MangaUpdates = MangaUpdates;

},{"./ui-makers/mu-source-menu":86,"./utils/mu-session":87,"paperback-extensions-common":20}],86:[function(require,module,exports){
"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSourceMenu = void 0;
const session = __importStar(require("../utils/mu-session"));
function getLoggedInSourceMenu(stateManager, username) {
    return [
        createLabel({
            id: 'userInfo',
            label: 'Logged-in as',
            value: username
        }),
        createButton({
            id: 'logout',
            label: 'Logout',
            value: undefined,
            onTap: () => session.logout(stateManager)
        })
    ];
}
function getLoggedOutSourceMenu(stateManager, requestManager) {
    return [
        createNavigationButton({
            id: 'loginButton',
            label: 'Login',
            value: undefined,
            form: createForm({
                sections: () => Promise.resolve([
                    createSection({
                        id: 'username_section',
                        header: 'Username',
                        footer: 'Enter your MangaUpdates account username',
                        rows: () => Promise.resolve([
                            createInputField({
                                id: 'username',
                                placeholder: 'Username',
                                value: '',
                                maskInput: false
                            })
                        ])
                    }),
                    createSection({
                        id: 'password_section',
                        header: 'Password',
                        footer: 'Enter the password associated with your MangaUpdates account Username',
                        rows: () => Promise.resolve([
                            createInputField({
                                id: 'password',
                                placeholder: 'Password',
                                value: '',
                                maskInput: true
                            })
                        ])
                    })
                ]),
                onSubmit: (values) => __awaiter(this, void 0, void 0, function* () {
                    try {
                        if (!values.username) {
                            throw new Error('Username must not be empty');
                        }
                        if (!values.password) {
                            throw new Error('Password must not be empty');
                        }
                        yield session.login(stateManager, requestManager, values);
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    }
                    catch (e) {
                        console.error(`[source-menu] onSubmit] failed: ${(e === null || e === void 0 ? void 0 : e.stack) || e}`);
                    }
                }),
                validate: () => Promise.resolve(true)
            })
        })
    ];
}
function getSourceMenu(stateManager, requestManager) {
    return __awaiter(this, void 0, void 0, function* () {
        return createSection({
            id: 'sourceMenu',
            header: 'Source Menu',
            rows: () => __awaiter(this, void 0, void 0, function* () {
                const username = yield session.getLoggedInUser(stateManager);
                return (username
                    ? getLoggedInSourceMenu(stateManager, username)
                    : getLoggedOutSourceMenu(stateManager, requestManager));
            })
        });
    });
}
exports.getSourceMenu = getSourceMenu;

},{"../utils/mu-session":87}],87:[function(require,module,exports){
"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.readCookiesFromResponse = exports.setCookiesOnRequest = exports.refreshSession = exports.logout = exports.login = exports.getLoggedInUser = void 0;
const tough_cookie_1 = require("tough-cookie");
const logPrefix = '[cookies]';
const STATE_MU_CREDENTIALS = 'mu_credentials';
const STATE_MU_COOKIES = 'mu_cookies';
function hasActiveSession(jar) {
    return !!jar
        .getCookiesSync('https://www.mangaupdates.com')
        .find(cookie => cookie.key === 'secure_session' && (cookie.expires === 'Infinity' || cookie.expires > new Date()));
}
function validateCredentials(credentials) {
    return (credentials != null
        && typeof credentials === 'object'
        && typeof credentials.username === 'string'
        && typeof credentials.password === 'string');
}
function getCookieJar(stateManager) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const store = yield stateManager.keychain.retrieve(STATE_MU_COOKIES);
            if (typeof store === 'string' && store.length > 0) {
                return new tough_cookie_1.CookieJar(JSON.parse(store));
            }
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        }
        catch (e) {
            console.error(`${logPrefix} failed to initialize from store: ${(e === null || e === void 0 ? void 0 : e.stack) || e}`);
        }
        return new tough_cookie_1.CookieJar();
    });
}
function updateCookieJar(stateManager, url, setCookies) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const jar = yield getCookieJar(stateManager);
            // TODO: read cookie header into the jar
            yield stateManager.keychain.store(STATE_MU_COOKIES, JSON.stringify(jar.toJSON()));
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        }
        catch (e) {
            console.error(`${logPrefix} failed to update store: ${(e === null || e === void 0 ? void 0 : e.stack) || e}`);
        }
    });
}
function getUserCredentials(stateManager) {
    return __awaiter(this, void 0, void 0, function* () {
        const credentialsString = yield stateManager.keychain.retrieve(STATE_MU_CREDENTIALS);
        if (typeof credentialsString !== 'string') {
            return undefined;
        }
        const credentials = JSON.parse(credentialsString);
        if (!validateCredentials(credentials)) {
            console.warn(`${logPrefix} store contains invalid credentials!`);
            return undefined;
        }
        return credentials;
    });
}
function getLoggedInUser(stateManager) {
    return __awaiter(this, void 0, void 0, function* () {
        const [credentials, jar] = yield Promise.all([
            getUserCredentials(stateManager),
            getCookieJar(stateManager)
        ]);
        return credentials && hasActiveSession(jar) ? credentials.username : undefined;
    });
}
exports.getLoggedInUser = getLoggedInUser;
function login(stateManager, requestManager, credentials) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log(`${logPrefix} login starts`);
        if (!validateCredentials(credentials)) {
            console.error(`${logPrefix} tried to store invalid mu_credentials: ${JSON.stringify(credentials)}`);
            throw new Error('tried to store invalid mu_credentials');
        }
        try {
            console.log('HERE 0');
            const response = yield requestManager.schedule(createRequestObject({
                url: 'https://www.mangaupdates.com/login.html',
                method: 'POST',
                headers: { 'content-type': 'application/x-www-form-urlencoded' },
                data: new URLSearchParams(Object.assign({ act: 'login' }, credentials)).toString(),
            }), 0);
            console.log('HERE 1');
            if (response.status > 399 || !response.data.includes(`Welcome back, ${credentials.username}`)) {
                console.error(`${logPrefix} login error (${response.status}): ${response.data}`);
                throw new Error('invalid credentials');
            }
            if (!hasActiveSession(yield getCookieJar(stateManager))) {
                console.error(`${logPrefix} login succeeded but no active session`);
                throw new Error('no session after login');
            }
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        }
        catch (e) {
            console.error(`${logPrefix} failed to log in: ${(e === null || e === void 0 ? void 0 : e.stack) || e}`);
            throw new Error('login failed');
        }
        console.log('HERE 2');
        yield stateManager.keychain.store(STATE_MU_CREDENTIALS, JSON.stringify(credentials));
        console.log(`${logPrefix} login complete`);
    });
}
exports.login = login;
function logout(stateManager) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log(`${logPrefix} logout starts`);
        yield stateManager.keychain.store(STATE_MU_CREDENTIALS, undefined);
        console.log(`${logPrefix} logout complete`);
    });
}
exports.logout = logout;
function refreshSession(stateManager, requestManager, forceRefresh = false) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log(`${logPrefix} refreshSession starts (forceRefresh=${forceRefresh})`);
        if (!forceRefresh && hasActiveSession(yield getCookieJar(stateManager))) {
            console.log(`${logPrefix} found an active session, no need to refresh`);
            return;
        }
        const credentials = yield getUserCredentials(stateManager);
        if (!credentials) {
            console.warn(`${logPrefix} no credentials available, unable to refresh`);
            return;
        }
        yield login(stateManager, requestManager, credentials);
        console.log(`${logPrefix} refreshSession complete`);
    });
}
exports.refreshSession = refreshSession;
function setCookiesOnRequest(stateManager, request) {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
        console.log(`${logPrefix} setCookiesOnRequest starts`);
        const jar = yield getCookieJar(stateManager);
        const cookie = jar.getCookieStringSync(request.url);
        if (cookie.length > 0) {
            // TODO: clean me up
            console.log(`${logPrefix} setting cookie header: ${cookie}`);
            request.headers = Object.assign(Object.assign({}, ((_a = request.headers) !== null && _a !== void 0 ? _a : {})), { cookie });
        }
        console.log(`${logPrefix} setCookiesOnRequest complete`);
        return request;
    });
}
exports.setCookiesOnRequest = setCookiesOnRequest;
function readCookiesFromResponse(stateManager, response) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log(`${logPrefix} readCookiesFromResponse starts`);
        const setCookies = response.headers['set-cookie'] || '';
        if (setCookies) {
            // TODO: clean me up
            console.log(`${logPrefix} received set-cookie header: ${setCookies}`);
            yield updateCookieJar(stateManager, response.request.url, setCookies);
        }
        console.log(`${logPrefix} readCookiesFromResponse complete`);
        return response;
    });
}
exports.readCookiesFromResponse = readCookiesFromResponse;

},{"tough-cookie":71}]},{},[85])(85)
});
