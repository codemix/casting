var expect = require('expect.js');

var Casting = require('../lib'),
    cast = Casting.cast,
    define = Casting.define;

describe('Casting', function () {
  describe('cast()', function () {
    it('should cast arrays', function () {
      cast('array', 123).should.eql([123]);
      cast('array', [123]).should.eql([123]);
      cast(Array, 123).should.eql([123]);
    });
    it('should cast strings', function () {
      cast('string', 123).should.equal('123');
      cast(String, 123).should.equal('123');
    });
    it('should cast numbers', function () {
      cast('number', '123').should.equal(123);
      cast(Number, '123').should.equal(123);
    });
    it('should cast booleans', function () {
      cast('boolean', '1').should.be.true;
      cast('boolean', true).should.be.true;
      cast(Boolean, 1).should.be.true;
      cast(Boolean, 0).should.be.false;
      cast(Boolean, false).should.be.false;
      cast(Boolean, '0').should.be.false;
    });
    it('should cast regular expressions', function () {
      cast('regexp', 'aaa').should.eql(/aaa/);
      cast(RegExp, 'aaa').should.eql(/aaa/);
      cast('regexp', /aaa/).should.eql(/aaa/);
      expect(cast.bind(undefined, RegExp, false)).to.throwError(TypeError);
    });
    it('should cast objects', function () {
      cast('object', 'string').should.eql(String('string'));
      cast(Object, 'string').should.eql(String('string'));
      cast('object', {}).should.eql({});
    });
    it('should cast dates', function () {
      cast('date', '2010-01-01').should.eql(new Date('2010-01-01'));
      cast(Date, '2010-01-01').should.eql(new Date('2010-01-01'));
      cast('date', new Date('2010-01-01')).should.eql(new Date('2010-01-01'));
      expect(cast.bind(undefined, Date, 'invalid date')).to.throwError(TypeError);
    });

    it('should fail to cast values without defined types', function () {
      expect(cast.bind(undefined, 'missing', true)).to.throwError(TypeError);
    });
  });

  describe('forDescriptors()', function () {
    var castAll = Casting.forDescriptors({
      name: {
        type: 'string'
      },
      isActive: {
        type: Boolean
      },
      'other field': {
        type: Object
      },
      untyped: {}
    });
    it('should validate objects', function () {
      castAll({name: 1, isActive: 0, 'other field': {a: 1}}).should.eql({
        name: '1',
        'other field': {a: 1},
        isActive: false
      })
    });
  });

  describe('forDescriptor()', function () {
    it('should cast values', function () {
      Casting.forDescriptor({type: 'string'})(123).should.equal('123');
    });
  });

  describe('define()', function () {
    function User (attributes) {
      var keys = Object.keys(attributes),
          total = keys.length,
          key, i;
      for (i = 0; i < total; i++) {
        key = keys[i];
        this[key] = attributes[key];
      }
    };

    define('User', User);

    it('should cast custom objects', function () {
      var value = cast('User', {name: 'Bob'});
      value.should.be.an.instanceOf(User);
      value.name.should.equal('Bob');
    });

    it('should cast custom objects using the type directly', function () {
      var value = cast(User, {name: 'Bob'});
      value.should.be.an.instanceOf(User);
      value.name.should.equal('Bob');
    });

  });
});

