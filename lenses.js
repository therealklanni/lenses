!function(e){if("object"==typeof exports)module.exports=e();else if("function"==typeof define&&define.amd)define(e);else{var f;"undefined"!=typeof window?f=window:"undefined"!=typeof global?f=global:"undefined"!=typeof self&&(f=self),f.lenses=e()}}(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(_dereq_,module,exports){
/**
 * Lo-Dash 2.4.1 (Custom Build) <http://lodash.com/>
 * Build: `lodash modularize modern exports="npm" -o ./npm/`
 * Copyright 2012-2013 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.5.2 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <http://lodash.com/license>
 */
var createWrapper = _dereq_('lodash._createwrapper');

/**
 * Creates a function which accepts one or more arguments of `func` that when
 * invoked either executes `func` returning its result, if all `func` arguments
 * have been provided, or returns a function that accepts one or more of the
 * remaining `func` arguments, and so on. The arity of `func` can be specified
 * if `func.length` is not sufficient.
 *
 * @static
 * @memberOf _
 * @category Functions
 * @param {Function} func The function to curry.
 * @param {number} [arity=func.length] The arity of `func`.
 * @returns {Function} Returns the new curried function.
 * @example
 *
 * var curried = _.curry(function(a, b, c) {
 *   console.log(a + b + c);
 * });
 *
 * curried(1)(2)(3);
 * // => 6
 *
 * curried(1, 2)(3);
 * // => 6
 *
 * curried(1, 2, 3);
 * // => 6
 */
function curry(func, arity) {
  arity = typeof arity == 'number' ? arity : (+arity || func.length);
  return createWrapper(func, 4, null, null, null, arity);
}

module.exports = curry;

},{"lodash._createwrapper":2}],2:[function(_dereq_,module,exports){
/**
 * Lo-Dash 2.4.1 (Custom Build) <http://lodash.com/>
 * Build: `lodash modularize modern exports="npm" -o ./npm/`
 * Copyright 2012-2013 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.5.2 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <http://lodash.com/license>
 */
var baseBind = _dereq_('lodash._basebind'),
    baseCreateWrapper = _dereq_('lodash._basecreatewrapper'),
    isFunction = _dereq_('lodash.isfunction'),
    slice = _dereq_('lodash._slice');

/**
 * Used for `Array` method references.
 *
 * Normally `Array.prototype` would suffice, however, using an array literal
 * avoids issues in Narwhal.
 */
var arrayRef = [];

/** Native method shortcuts */
var push = arrayRef.push,
    unshift = arrayRef.unshift;

/**
 * Creates a function that, when called, either curries or invokes `func`
 * with an optional `this` binding and partially applied arguments.
 *
 * @private
 * @param {Function|string} func The function or method name to reference.
 * @param {number} bitmask The bitmask of method flags to compose.
 *  The bitmask may be composed of the following flags:
 *  1 - `_.bind`
 *  2 - `_.bindKey`
 *  4 - `_.curry`
 *  8 - `_.curry` (bound)
 *  16 - `_.partial`
 *  32 - `_.partialRight`
 * @param {Array} [partialArgs] An array of arguments to prepend to those
 *  provided to the new function.
 * @param {Array} [partialRightArgs] An array of arguments to append to those
 *  provided to the new function.
 * @param {*} [thisArg] The `this` binding of `func`.
 * @param {number} [arity] The arity of `func`.
 * @returns {Function} Returns the new function.
 */
function createWrapper(func, bitmask, partialArgs, partialRightArgs, thisArg, arity) {
  var isBind = bitmask & 1,
      isBindKey = bitmask & 2,
      isCurry = bitmask & 4,
      isCurryBound = bitmask & 8,
      isPartial = bitmask & 16,
      isPartialRight = bitmask & 32;

  if (!isBindKey && !isFunction(func)) {
    throw new TypeError;
  }
  if (isPartial && !partialArgs.length) {
    bitmask &= ~16;
    isPartial = partialArgs = false;
  }
  if (isPartialRight && !partialRightArgs.length) {
    bitmask &= ~32;
    isPartialRight = partialRightArgs = false;
  }
  var bindData = func && func.__bindData__;
  if (bindData && bindData !== true) {
    // clone `bindData`
    bindData = slice(bindData);
    if (bindData[2]) {
      bindData[2] = slice(bindData[2]);
    }
    if (bindData[3]) {
      bindData[3] = slice(bindData[3]);
    }
    // set `thisBinding` is not previously bound
    if (isBind && !(bindData[1] & 1)) {
      bindData[4] = thisArg;
    }
    // set if previously bound but not currently (subsequent curried functions)
    if (!isBind && bindData[1] & 1) {
      bitmask |= 8;
    }
    // set curried arity if not yet set
    if (isCurry && !(bindData[1] & 4)) {
      bindData[5] = arity;
    }
    // append partial left arguments
    if (isPartial) {
      push.apply(bindData[2] || (bindData[2] = []), partialArgs);
    }
    // append partial right arguments
    if (isPartialRight) {
      unshift.apply(bindData[3] || (bindData[3] = []), partialRightArgs);
    }
    // merge flags
    bindData[1] |= bitmask;
    return createWrapper.apply(null, bindData);
  }
  // fast path for `_.bind`
  var creater = (bitmask == 1 || bitmask === 17) ? baseBind : baseCreateWrapper;
  return creater([func, bitmask, partialArgs, partialRightArgs, thisArg, arity]);
}

module.exports = createWrapper;

},{"lodash._basebind":3,"lodash._basecreatewrapper":12,"lodash._slice":21,"lodash.isfunction":22}],3:[function(_dereq_,module,exports){
/**
 * Lo-Dash 2.4.1 (Custom Build) <http://lodash.com/>
 * Build: `lodash modularize modern exports="npm" -o ./npm/`
 * Copyright 2012-2013 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.5.2 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <http://lodash.com/license>
 */
var baseCreate = _dereq_('lodash._basecreate'),
    isObject = _dereq_('lodash.isobject'),
    setBindData = _dereq_('lodash._setbinddata'),
    slice = _dereq_('lodash._slice');

/**
 * Used for `Array` method references.
 *
 * Normally `Array.prototype` would suffice, however, using an array literal
 * avoids issues in Narwhal.
 */
var arrayRef = [];

/** Native method shortcuts */
var push = arrayRef.push;

/**
 * The base implementation of `_.bind` that creates the bound function and
 * sets its meta data.
 *
 * @private
 * @param {Array} bindData The bind data array.
 * @returns {Function} Returns the new bound function.
 */
function baseBind(bindData) {
  var func = bindData[0],
      partialArgs = bindData[2],
      thisArg = bindData[4];

  function bound() {
    // `Function#bind` spec
    // http://es5.github.io/#x15.3.4.5
    if (partialArgs) {
      // avoid `arguments` object deoptimizations by using `slice` instead
      // of `Array.prototype.slice.call` and not assigning `arguments` to a
      // variable as a ternary expression
      var args = slice(partialArgs);
      push.apply(args, arguments);
    }
    // mimic the constructor's `return` behavior
    // http://es5.github.io/#x13.2.2
    if (this instanceof bound) {
      // ensure `new bound` is an instance of `func`
      var thisBinding = baseCreate(func.prototype),
          result = func.apply(thisBinding, args || arguments);
      return isObject(result) ? result : thisBinding;
    }
    return func.apply(thisArg, args || arguments);
  }
  setBindData(bound, bindData);
  return bound;
}

module.exports = baseBind;

},{"lodash._basecreate":4,"lodash._setbinddata":7,"lodash._slice":21,"lodash.isobject":10}],4:[function(_dereq_,module,exports){
(function (global){/**
 * Lo-Dash 2.4.1 (Custom Build) <http://lodash.com/>
 * Build: `lodash modularize modern exports="npm" -o ./npm/`
 * Copyright 2012-2013 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.5.2 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <http://lodash.com/license>
 */
var isNative = _dereq_('lodash._isnative'),
    isObject = _dereq_('lodash.isobject'),
    noop = _dereq_('lodash.noop');

/* Native method shortcuts for methods with the same name as other `lodash` methods */
var nativeCreate = isNative(nativeCreate = Object.create) && nativeCreate;

/**
 * The base implementation of `_.create` without support for assigning
 * properties to the created object.
 *
 * @private
 * @param {Object} prototype The object to inherit from.
 * @returns {Object} Returns the new object.
 */
function baseCreate(prototype, properties) {
  return isObject(prototype) ? nativeCreate(prototype) : {};
}
// fallback for browsers without `Object.create`
if (!nativeCreate) {
  baseCreate = (function() {
    function Object() {}
    return function(prototype) {
      if (isObject(prototype)) {
        Object.prototype = prototype;
        var result = new Object;
        Object.prototype = null;
      }
      return result || global.Object();
    };
  }());
}

module.exports = baseCreate;
}).call(this,typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"lodash._isnative":5,"lodash.isobject":10,"lodash.noop":6}],5:[function(_dereq_,module,exports){
/**
 * Lo-Dash 2.4.1 (Custom Build) <http://lodash.com/>
 * Build: `lodash modularize modern exports="npm" -o ./npm/`
 * Copyright 2012-2013 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.5.2 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <http://lodash.com/license>
 */

/** Used for native method references */
var objectProto = Object.prototype;

/** Used to resolve the internal [[Class]] of values */
var toString = objectProto.toString;

/** Used to detect if a method is native */
var reNative = RegExp('^' +
  String(toString)
    .replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
    .replace(/toString| for [^\]]+/g, '.*?') + '$'
);

/**
 * Checks if `value` is a native function.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if the `value` is a native function, else `false`.
 */
function isNative(value) {
  return typeof value == 'function' && reNative.test(value);
}

module.exports = isNative;

},{}],6:[function(_dereq_,module,exports){
/**
 * Lo-Dash 2.4.1 (Custom Build) <http://lodash.com/>
 * Build: `lodash modularize modern exports="npm" -o ./npm/`
 * Copyright 2012-2013 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.5.2 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <http://lodash.com/license>
 */

/**
 * A no-operation function.
 *
 * @static
 * @memberOf _
 * @category Utilities
 * @example
 *
 * var object = { 'name': 'fred' };
 * _.noop(object) === undefined;
 * // => true
 */
function noop() {
  // no operation performed
}

module.exports = noop;

},{}],7:[function(_dereq_,module,exports){
/**
 * Lo-Dash 2.4.1 (Custom Build) <http://lodash.com/>
 * Build: `lodash modularize modern exports="npm" -o ./npm/`
 * Copyright 2012-2013 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.5.2 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <http://lodash.com/license>
 */
var isNative = _dereq_('lodash._isnative'),
    noop = _dereq_('lodash.noop');

/** Used as the property descriptor for `__bindData__` */
var descriptor = {
  'configurable': false,
  'enumerable': false,
  'value': null,
  'writable': false
};

/** Used to set meta data on functions */
var defineProperty = (function() {
  // IE 8 only accepts DOM elements
  try {
    var o = {},
        func = isNative(func = Object.defineProperty) && func,
        result = func(o, o, o) && func;
  } catch(e) { }
  return result;
}());

/**
 * Sets `this` binding data on a given function.
 *
 * @private
 * @param {Function} func The function to set data on.
 * @param {Array} value The data array to set.
 */
var setBindData = !defineProperty ? noop : function(func, value) {
  descriptor.value = value;
  defineProperty(func, '__bindData__', descriptor);
};

module.exports = setBindData;

},{"lodash._isnative":8,"lodash.noop":9}],8:[function(_dereq_,module,exports){
module.exports=_dereq_(5)
},{}],9:[function(_dereq_,module,exports){
module.exports=_dereq_(6)
},{}],10:[function(_dereq_,module,exports){
/**
 * Lo-Dash 2.4.1 (Custom Build) <http://lodash.com/>
 * Build: `lodash modularize modern exports="npm" -o ./npm/`
 * Copyright 2012-2013 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.5.2 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <http://lodash.com/license>
 */
var objectTypes = _dereq_('lodash._objecttypes');

/**
 * Checks if `value` is the language type of Object.
 * (e.g. arrays, functions, objects, regexes, `new Number(0)`, and `new String('')`)
 *
 * @static
 * @memberOf _
 * @category Objects
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if the `value` is an object, else `false`.
 * @example
 *
 * _.isObject({});
 * // => true
 *
 * _.isObject([1, 2, 3]);
 * // => true
 *
 * _.isObject(1);
 * // => false
 */
function isObject(value) {
  // check if the value is the ECMAScript language type of Object
  // http://es5.github.io/#x8
  // and avoid a V8 bug
  // http://code.google.com/p/v8/issues/detail?id=2291
  return !!(value && objectTypes[typeof value]);
}

module.exports = isObject;

},{"lodash._objecttypes":11}],11:[function(_dereq_,module,exports){
/**
 * Lo-Dash 2.4.1 (Custom Build) <http://lodash.com/>
 * Build: `lodash modularize modern exports="npm" -o ./npm/`
 * Copyright 2012-2013 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.5.2 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <http://lodash.com/license>
 */

/** Used to determine if values are of the language type Object */
var objectTypes = {
  'boolean': false,
  'function': true,
  'object': true,
  'number': false,
  'string': false,
  'undefined': false
};

module.exports = objectTypes;

},{}],12:[function(_dereq_,module,exports){
/**
 * Lo-Dash 2.4.1 (Custom Build) <http://lodash.com/>
 * Build: `lodash modularize modern exports="npm" -o ./npm/`
 * Copyright 2012-2013 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.5.2 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <http://lodash.com/license>
 */
var baseCreate = _dereq_('lodash._basecreate'),
    isObject = _dereq_('lodash.isobject'),
    setBindData = _dereq_('lodash._setbinddata'),
    slice = _dereq_('lodash._slice');

/**
 * Used for `Array` method references.
 *
 * Normally `Array.prototype` would suffice, however, using an array literal
 * avoids issues in Narwhal.
 */
var arrayRef = [];

/** Native method shortcuts */
var push = arrayRef.push;

/**
 * The base implementation of `createWrapper` that creates the wrapper and
 * sets its meta data.
 *
 * @private
 * @param {Array} bindData The bind data array.
 * @returns {Function} Returns the new function.
 */
function baseCreateWrapper(bindData) {
  var func = bindData[0],
      bitmask = bindData[1],
      partialArgs = bindData[2],
      partialRightArgs = bindData[3],
      thisArg = bindData[4],
      arity = bindData[5];

  var isBind = bitmask & 1,
      isBindKey = bitmask & 2,
      isCurry = bitmask & 4,
      isCurryBound = bitmask & 8,
      key = func;

  function bound() {
    var thisBinding = isBind ? thisArg : this;
    if (partialArgs) {
      var args = slice(partialArgs);
      push.apply(args, arguments);
    }
    if (partialRightArgs || isCurry) {
      args || (args = slice(arguments));
      if (partialRightArgs) {
        push.apply(args, partialRightArgs);
      }
      if (isCurry && args.length < arity) {
        bitmask |= 16 & ~32;
        return baseCreateWrapper([func, (isCurryBound ? bitmask : bitmask & ~3), args, null, thisArg, arity]);
      }
    }
    args || (args = arguments);
    if (isBindKey) {
      func = thisBinding[key];
    }
    if (this instanceof bound) {
      thisBinding = baseCreate(func.prototype);
      var result = func.apply(thisBinding, args);
      return isObject(result) ? result : thisBinding;
    }
    return func.apply(thisBinding, args);
  }
  setBindData(bound, bindData);
  return bound;
}

module.exports = baseCreateWrapper;

},{"lodash._basecreate":13,"lodash._setbinddata":16,"lodash._slice":21,"lodash.isobject":19}],13:[function(_dereq_,module,exports){
arguments[4][4][0].apply(exports,arguments)
},{"lodash._isnative":14,"lodash.isobject":19,"lodash.noop":15}],14:[function(_dereq_,module,exports){
module.exports=_dereq_(5)
},{}],15:[function(_dereq_,module,exports){
module.exports=_dereq_(6)
},{}],16:[function(_dereq_,module,exports){
module.exports=_dereq_(7)
},{"lodash._isnative":17,"lodash.noop":18}],17:[function(_dereq_,module,exports){
module.exports=_dereq_(5)
},{}],18:[function(_dereq_,module,exports){
module.exports=_dereq_(6)
},{}],19:[function(_dereq_,module,exports){
module.exports=_dereq_(10)
},{"lodash._objecttypes":20}],20:[function(_dereq_,module,exports){
module.exports=_dereq_(11)
},{}],21:[function(_dereq_,module,exports){
/**
 * Lo-Dash 2.4.1 (Custom Build) <http://lodash.com/>
 * Build: `lodash modularize modern exports="npm" -o ./npm/`
 * Copyright 2012-2013 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.5.2 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <http://lodash.com/license>
 */

/**
 * Slices the `collection` from the `start` index up to, but not including,
 * the `end` index.
 *
 * Note: This function is used instead of `Array#slice` to support node lists
 * in IE < 9 and to ensure dense arrays are returned.
 *
 * @private
 * @param {Array|Object|string} collection The collection to slice.
 * @param {number} start The start index.
 * @param {number} end The end index.
 * @returns {Array} Returns the new array.
 */
function slice(array, start, end) {
  start || (start = 0);
  if (typeof end == 'undefined') {
    end = array ? array.length : 0;
  }
  var index = -1,
      length = end - start || 0,
      result = Array(length < 0 ? 0 : length);

  while (++index < length) {
    result[index] = array[start + index];
  }
  return result;
}

module.exports = slice;

},{}],22:[function(_dereq_,module,exports){
/**
 * Lo-Dash 2.4.1 (Custom Build) <http://lodash.com/>
 * Build: `lodash modularize modern exports="npm" -o ./npm/`
 * Copyright 2012-2013 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.5.2 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <http://lodash.com/license>
 */

/**
 * Checks if `value` is a function.
 *
 * @static
 * @memberOf _
 * @category Objects
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if the `value` is a function, else `false`.
 * @example
 *
 * _.isFunction(_);
 * // => true
 */
function isFunction(value) {
  return typeof value == 'function';
}

module.exports = isFunction;

},{}],23:[function(_dereq_,module,exports){
var _flatten = function(xs) {
  return xs.reduce(function(a,b){return a.concat(b);}, []);
};

var fmap = function(f, xs) {
  return xs.map(function(x) { return f(x); }); //avoid index
};

var concat = function(xs,ys) { return xs.concat(ys); };

var empty = function() { return []; };

var chain = function(xs, f) { return _flatten(xs.map(f)); };

var of = function(x) { return [x]; };
var ap = function(a1, a2) {
  return _flatten(a1.map(function(f){
    return a2.map(function(a){ return f(a); })
  }));
};


module.exports = { fmap: fmap
                 , of: of
                 , ap: ap
                 , concat: concat
                 , empty: empty
                 , chain: chain
                 }

},{}],24:[function(_dereq_,module,exports){
var Constructor = _dereq_('../util').Constructor;

var Const = Constructor(function(val) {
	this.val = val;
});

var getConst = function(c) { return c.val; };

Const.prototype.map = function(f) {
	return Const(this.val);
};

// is const a monoid?

// only if x is a monoid
Const.prototype.of = function(x) {
	return Const(empty(x));
};

Const.prototype.ap = function(c2) {
	return Const(mappend(this.val, c2.val));
};

// const is not a monad

module.exports = {Const: Const, getConst: getConst}

},{"../util":29}],25:[function(_dereq_,module,exports){
var _K = function(x) { return function(y) { return x; } };

var fmap = function(f, g) {
  return function(x) { return f(g(x)) };
};

var _concat = function(f, g) {
  return function() {
    return concat( f.apply(this, arguments)
                 , g.apply(this, arguments)
                 );
  }
};

var empty = function() {
  return _K({ concat: function(f, g) { return concat(empty(g), g); } });
};

var chain = function(f, g) {
  return function(x) {
    return g(f(x), x);
  };
};

var of = _K;
var ap = function(f, g) {
  return function(x) {
    return f(x)(g(x));
  }
};

module.exports = { fmap: fmap
                 , of: of
                 , ap: ap
                 , concat: _concat
                 , empty: empty
                 , chain: chain
                 }

},{}],26:[function(_dereq_,module,exports){
var Constructor = _dereq_('../util').Constructor;

var Id = Constructor(function(a) {
	this.value = a;
});

Id.prototype.concat = function(b) {
	return new Id(concat(this.value, b.value));
};

var runIdentity = function(i) { return i.value; };

Id.prototype.empty = function() {
	return new Id(empty(this.value));
};

Id.prototype.map = function(f) {
	return new Id(f(this.value));
};

Id.prototype.ap = function(b) {
	return new Id(this.value(b.value));
};

Id.prototype.chain = function(f) {
	return f(this.value);
};

Id.prototype.of = function(a) {
	return new Id(a);
};

module.exports = {Identity: Id, runIdentity: runIdentity};

},{"../util":29}],27:[function(_dereq_,module,exports){
var concat = function(xs,ys) { return xs.concat(ys); };

var empty = function() { return ""; };

module.exports = { concat: concat
                 , empty: empty
                 }

},{}],28:[function(_dereq_,module,exports){
var curry = _dereq_('lodash.curry');

var BUILT_INS = { 'array': _dereq_('./instances/array')
                , 'function': _dereq_('./instances/function')
                , 'string': _dereq_('./instances/string')
                }

var _getNamedType = function(x) {
  return Object.prototype.toString.call( x ).match(/\S+(.*?)]/)[1].substr(1).toLowerCase();
};

var _getInstance = function(fn_name, x) {
  var t = _getNamedType(x);
  return BUILT_INS[t] && BUILT_INS[t][fn_name];
};

var _groupsOf = curry(function(n, xs) {
  if(!xs.length) return [];
  return [xs.slice(0, n)].concat(_groupsOf(n, xs.slice(n, xs.length)));
});

var _compose = curry(function(f,g,x) { return f(g(x)) });

// f . g . h == compose(f, g, h)
var toAssociativeCommaInfix = function(fn) {
  return function() {
    var fns = [].slice.call(arguments)
    return function() {
      return _groupsOf(2, fns).reverse().map(function(g) {      
        return (g.length > 1) ? fn.apply(this,g) : g[0];
      }).reduce(function(x, f) {
        return [f.apply(f,x)];
      }, arguments)[0];
    };    
  };
};

var compose = toAssociativeCommaInfix(_compose);


var Pointy = {};

var id = function(x) { return x; }

var fmap = curry(function(f, u) {
  var builtIn = _getInstance('fmap', u);
  return builtIn ? builtIn(f, u) : (u.fmap && u.fmap(f)) || u.map(f);
});

var of = curry(function(f, a) {
  var builtIn = _getInstance('of', a);
  return builtIn ? builtIn(f, a) : a.of(f);
});

var ap = curry(function(a1, a2) {
  var builtIn = _getInstance('ap', a1)
  return builtIn ? builtIn(a1, a2) : a1.ap(a2);
});

var liftA2 = curry(function(f, x, y) {
	return ap(fmap(f, x), y);
});

var liftA3 = curry(function(f, x, y, z) {
  return ap(ap(fmap(f, x), y), z);
});

var chain = curry(function(mv, f) {
  var builtIn = _getInstance('chain', mv);
  return builtIn ? builtIn(mv, f) : mv.chain(f);
});

var mjoin = function(mmv) {
	return chain(mmv, id);
};

var concat = curry(function(x, y) {
  var builtIn = _getInstance('concat', x);
  return builtIn ? builtIn(x,y) : x.concat(y);
});

var empty = function(x) {
  var builtIn = _getInstance('empty', x);
  return builtIn ? builtIn(x) : x.empty();
};

var mconcat = function(xs) {
	if(!xs[0]) return xs;
  var e = empty(xs[0]);
  return xs.reduce(mappend, e);
};

var expose = function(env) {
  var f;
  for (f in Pointy) {
    if (f !== 'expose' && Pointy.hasOwnProperty(f)) {
      env[f] = Pointy[f];
    }
  }
}

Pointy.id = id;
Pointy.compose = compose;
Pointy.fmap = fmap;
Pointy.of = of;
Pointy.ap = ap;
Pointy.liftA2 = liftA2;
Pointy.liftA3 = liftA3;
Pointy.chain = chain;
Pointy.mbind = chain;
Pointy.mjoin = mjoin;
Pointy.empty = empty;
Pointy.mempty = empty;
Pointy.concat = concat;
Pointy.mappend = concat;
Pointy.mconcat = mconcat;
Pointy.expose = expose;


module.exports = Pointy;

if(typeof window == "object") {
  PointFree = Pointy;
}

},{"./instances/array":23,"./instances/function":25,"./instances/string":27,"lodash.curry":1}],29:[function(_dereq_,module,exports){
"use strict";

var Constructor = function(f) {
  var x = function(){
    if(!(this instanceof x)){
      var inst = new x();
      f.apply(inst, arguments);
      return inst;
    }
    f.apply(this, arguments);
  };

  return x;
};
exports.Constructor = Constructor;
var makeType = function(f) {
  f = f || function(v){ this.val = v; }
  return Constructor(f);
};
exports.makeType = makeType;

var subClass = function(superclass, constructr) {
  var x = makeType();
  x.prototype = new superclass();
  x.prototype.constructor=constructr; 
  return x;
}
exports.subClass = subClass;

var toArray = function(x) {
  return Array.prototype.slice.call(x);
}

var curry = function (fn /* variadic number of args */) {
  var args = Array.prototype.slice.call(arguments, 1);
  var f = function () {
    return fn.apply(this, args.concat(toArray(arguments)));
  };
  return f;
};

var autoCurry = function (fn, numArgs) {
  numArgs = numArgs || fn.length;
  var f = function () {
    if (arguments.length < numArgs) {
      return numArgs - arguments.length > 0 ?
        autoCurry(curry.apply(this, [fn].concat(toArray(arguments))),
            numArgs - arguments.length) :
        curry.apply(this, [fn].concat(toArray(arguments)));
    }
    else {
      return fn.apply(this, arguments);
    }
  };
  f.toString = function(){ return fn.toString(); };
  f.curried = true;
  f.fn = fn;
  f.arity = fn.length;
  return f;
};
exports.autoCurry = autoCurry;
Function.prototype.autoCurry = function(n) {
  return autoCurry(this, n);
}


var K = function(x){return function(){return x;};};
exports.K = K;var I = function(x){return x;};
exports.I = I;
},{}],30:[function(_dereq_,module,exports){
var Id = _dereq_('pointfree-fantasy/instances/identity')
	, Identity = Id.Identity
	, runIdentity = Id.runIdentity
	, Constant = _dereq_('pointfree-fantasy/instances/const')
	, Const = Constant.Const
	, getConst = Constant.getConst
	, Pf = _dereq_('pointfree-fantasy')
	, compose = Pf.compose
	, fmap = Pf.fmap
	, curry = _dereq_('lodash.curry')
	;

//+ _K :: a -> (_ -> a)
var _K = function(x) { return function(y) { return x; } }

	// stolen from http://stackoverflow.com/questions/11299284/javascript-deep-copying-object
  , _clone = function(destination, source) {
      for (var property in source) {
        if (typeof source[property] === "object" && source[property] !== null && destination[property]) { 
          clone(destination[property], source[property]);
        } else {
          destination[property] = source[property];
        }
      }
      return destination;
    }

//+ _insertStr :: Int -> String -> String -> String
  , _insertStr = function (idx, rep, str) {
  	  return str.substr(0,idx) + rep + str.substr(idx+1);
		}

//+ arrayLens :: Int -> Lens
  , arrayLens = function(n, f, xs) {
			var ys = xs.slice(0);
			return fmap(function(x) { ys.splice(n, 1, x); return ys; }, f(xs[n]));
  	}

//+ stringLens :: Int -> Lens
  , stringLens = function(n, f, xs) {
			return fmap(function(x) { return _insertStr(n, x, xs); }, f(xs[n]));
  	}

//+ _makeNLens :: Int -> Lens
	, _makeNLens = function(n) {
			return curry(function(f, xs) {
				return (typeof xs === 'string') ? stringLens(n, f, xs) : arrayLens(n, f, xs);
			});
		}

//+ _makeKeyLens :: String -> Lens
	, _makeKeyLens = function(key) {
			return curry(function(f, x) {
				return fmap(function(val) {
					var new_obj = _clone({}, x);
					new_obj[key] = val;
					return new_obj;
				}, f(x[key]));
			});
		}

//+ makeLenses :: [String] -> {String: Lens}
	, makeLenses = function(keys) {
			return keys.reduce(function(acc, key) {
				acc[key] = _makeKeyLens(key);
				return acc;
			}, {
				_num : _makeNLens
			});
		}

//+ set :: (a -> Identity	b) -> s -> Identity t -> b -> s -> t
	, set = curry(function(lens, val, x) {
			return over(lens, _K(val), x);
		})

//+ view :: (a -> Const	r) -> s -> Const r -> s -> a
	, view = curry(function(lens, x) {
			return compose(getConst, lens(Const))(x);
		})

//+ over :: (a -> Identity b) -> s -> Identity t -> b -> s -> t
	, over = curry(function(lens, f, x) {
			return compose(runIdentity, lens(compose(Identity,f)))(x);
		})

//+ mapped :: (a -> Identity b) -> s -> Identity t
	, mapped = curry(function(f, x) {
		  return Identity(fmap(compose(runIdentity, f), x));
		})
	;

var _Lenses = { makeLenses: makeLenses
						  , set: set
						  , view: view
						  , over: over
						  , mapped: mapped
						  }

_Lenses.expose = function(env) {
  var f;
  for (f in _Lenses) {
    if (f !== 'expose' && _Lenses.hasOwnProperty(f)) {
      env[f] = _Lenses[f];
    }
  }
  return _Lenses;
}

module.exports = _Lenses;
if(typeof window == "object") {
	Lenses = _Lenses;
}

// next up folds and traverses...

},{"lodash.curry":1,"pointfree-fantasy":28,"pointfree-fantasy/instances/const":24,"pointfree-fantasy/instances/identity":26}]},{},[30])
(30)
});