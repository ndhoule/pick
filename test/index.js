'use strict';

var assert = require('assert');
var eql = require('deep-eql');
var pick = require('../');

describe('pick', function() {
  it('should be a function', function() {
    assert(typeof pick === 'function');
  });

  it('should have an arity of 2', function() {
    assert(pick.length === 2);
  });

  it('should return a new object', function() {
    var source = { name: 'tim' };
    var result = pick('name', source);

    assert(typeof result === 'object');
    assert(result !== source);
  });

  it('should return an object including only the specified `keep` property', function() {
    var source = { name: 'tim', occupation: 'enchanter' };
    var expected = { name: 'tim' };

    assert(eql(pick('name', source), expected));
  });

  it('should return an object including only the specified `keep` properties', function() {
    var source = { name: 'tim', occupation: 'enchanter', scaredOf: 'rabbits' };
    var expected = { name: 'tim', scaredOf: 'rabbits' };

    assert(eql(pick(['name', 'scaredOf'], source), expected));
  });

  it('should handle properties that don\'t exist on the target `object`', function() {
    var source = { name: 'tim', occupation: 'enchanter', scaredOf: 'rabbits' };

    assert(eql(pick('nonexistent', source), {}));
    assert(eql(pick(['name', 'keys'], source), { name: 'tim' }));
  });

  it('should handle an empty list of `props`', function() {
    var source = { name: 'tim', occupation: 'enchanter', scaredOf: 'rabbits' };

    assert(eql(pick([], source), {}));
  });

  it('should ignore non-string omissions', function() {
    var source = { name: 'tim', null: 'enchanter', undefined: 'rabbits' };

    assert(eql(pick(null, source), {}));
    assert(eql(pick([null, undefined], source), {}));
    assert(eql(pick([null, 'name', undefined], source), { name: 'tim' }));
  });

  it('should handle non-array/string `omissions` arguments', function() {
    var source = { name: 'tim', occupation: 'enchanter', scaredOf: 'rabbits' };

    assert(eql(pick(null, source), {}));
    assert(eql(pick(undefined, source), {}));
    assert(eql(pick(/name/, source), {}));
    assert(eql(pick(Error, source), {}));
  });

  it('should handle objects with a `.length` property', function() {
    var source = { name: 'tim', occupation: 'enchanter', scaredOf: 'rabbits', length: 100 };
    var expected = { name: 'tim', scaredOf: 'rabbits', length: 100 };

    assert(eql(pick(['name', 'scaredOf', 'length'], source), expected));
  });

  it('should not ignore non-enumerable properties', function() {
    var source = Object.create(null, {
      name: { value: 'tim', enumerable: true },
      occupation: { value: 'enchanter', enumerable: true },
      scaredOf: { value: 'rabbits', enumerable: false }
    });

    assert('scaredOf' in pick('scaredOf', source));
  });

  it('should not ignore inherited properties', function() {
    var parent = { parent: 'parent' };
    var child = Object.create(parent);
    child.child = 'child';
    child.color = 'green';

    assert('parent' in pick('parent', child));
  });

  it('should work on non-plain objects', function() {
    var string = new String('test');
    var result = pick(['0', '1'], string);
    var expected = { '0': 't', '1': 'e' };

    assert(typeof result === 'object');
    assert(eql(result, expected));
    assert(result !== string);
  });

  it('should handle `null` and `undefined` as the `object` parameter', function() {
    assert(eql(pick('whatever', null), {}));
    assert(eql(pick('whatever', undefined), {}));
  });

  it('should return an empty object when passed a primitive value', function() {
    assert(eql(pick('whatever', 'test'), {}));
    assert(eql(pick('whatever', 12), {}));
    assert(eql(pick('whatever', /regex/), {}));
  });
});
