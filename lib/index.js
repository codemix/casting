"use strict";

/**
 * The registered casting functions.
 * @type {Array[]}
 */
exports.casters = [];

/**
 * Define a type caster.
 *
 *
 * @param  {String}   name        The name of the type.
 * @param  {Function} Constructor The type class.
 * @param  {Function} caster      The type casting function.
 * @return {exports}              The casting object.
 */
exports.define = function (name, Constructor, caster) {
  if (!caster) {
    caster = function (value) {
      return new Constructor(value);
    };
  }
  exports.casters.push([name, Constructor, caster]);
  return exports;
};


/**
 * Get a function which can cast values to the given type.
 *
 * @param  {String|Function} type The type or name of the type to cast to.
 * @return {mixed}                The casting function, or undefined if none exists.
 */
exports.get = function (type) {
  var casters = exports.casters,
      total = casters.length,
      item, i;

  for (i = 0; i < total; i++) {
    item = casters[i];
    if (type === item[0] || type === item[1]) {
      return item[2];
    }
  }

};

/**
 * Cast a value to the given type.
 *
 * @param  {String|Function} type  The type or name of the type to cast to.
 * @param  {mixed} value           The value to type cast.
 * @return {mixed}                 The type cast value.
 *
 * @throws {TypeError}             If no such type exists.
 */
exports.cast = function (type, value) {
  var caster = exports.get(type);
  if (!caster) {
    throw new TypeError('Cannot cast to unknown type: ' + type);
  }
  return caster(value);
};

/**
 * Create a function which can cast the properties of objects
 * conforming to the given descriptors.
 *
 * @param  {Object} descriptors The descriptors containing the types.
 * @return {Function}           The cast function.
 */
exports.forDescriptors = function (descriptors) {
  var names = Object.keys(descriptors),
      total = names.length,
      lines = [],
      casters = {},
      accessor, descriptor, name, i;

  for (i = 0; i < total; i++) {
    name = names[i];
    descriptor = descriptors[name];
    if (/^([\w|_|$]+)$/.test(name)) {
      accessor = '.' + name;
    }
    else {
      accessor = '["' + name + '"]';
    }
    if (descriptor.type) {
      casters[name] = exports.get(descriptor.type);
      lines.push('if (object' + accessor + ' != null) {',
                 '  object' + accessor + ' = casters' + accessor + '(object' + accessor + ');',
                 '}');
    }
  }
  lines.push('return object;');
  return (new Function('casters', 'object', lines.join('\n'))).bind(undefined, casters); // jshint ignore: line
};

// # Builtin Types


exports.define('array', Array, function (value) {
  if (!Array.isArray(value)) {
    return [value];
  }
  else {
    return value;
  }
});

exports.define('string', String, function (value) {
  return ''+value;
});

exports.define('number', Number, function (value) {
  return +value;
});

exports.define('boolean', Boolean, function (value) {
  return +value ? true : false;
});

exports.define('regexp', RegExp, function (value) {
  if (value instanceof RegExp) {
    return value;
  }
  else if (typeof value === 'string') {
    return new RegExp(value);
  }
  else {
    throw new TypeError('Cannot cast value to RegExp');
  }
});

exports.define('object', Object, function (value) {
  return Object(value);
});

exports.define('date', Date, function (value) {
  if (!(value instanceof Date)) {
    value = new Date(value);
  }
  if (isNaN(value.valueOf())) {
    throw new TypeError('Invalid date value');
  }
  return value;
});