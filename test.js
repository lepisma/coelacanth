/* global it, describe */

const Coelacanth = require('./').default
const assert = require('assert')

describe('Defaults accessors', function () {
  it('should work with flat data provided in constructor', function () {
    let data = {a: {x: 1, y: 'test'}, b: 2}
    let cconf = new Coelacanth(data)
    assert.equal(cconf.b, data.b)
  })

  it('should work with nested data provided in constructor', function () {
    let data = {a: {x: 1, y: 'test'}, b: 2}
    let cconf = new Coelacanth(data)
    assert.equal(cconf.a.x, data.a.x)
    assert.equal(cconf.a.y, data.a.y)
  })

  it('should reproduce original json in defaults getter', function () {
    let data = {a: {x: 1, y: 'test'}, b: 2}
    let cconf = new Coelacanth(data)
    assert.deepEqual(cconf.defaults, data)
  })
})

describe('#overwrite()', function () {
  it('should overwrite flat item', function () {
    let data = {a: {x: 1, y: 'test'}, b: 2}
    let cconf = new Coelacanth(data)
    let oconf = cconf.overwrite({b: 33})
    assert.equal(cconf.b, data.b)
    assert.equal(oconf.b, 33)
  })

  it('should overwrite nested flat item', function () {
    let data = {a: {x: 1, y: 'test'}, b: 2}
    let cconf = new Coelacanth(data)
    let oconf = cconf.overwrite({a: {x: 33}})
    assert.deepEqual(cconf.a.defaults, data.a)
    assert.equal(oconf.a.x, 33)
    assert.deepEqual(oconf.a.defaults, {x: 33, y: 'test'})
  })

  it('should NOT overwrite nested item to flat', function () {
    let data = {a: {x: 1, y: 'test'}, b: 2}
    let cconf = new Coelacanth(data)
    let oconf = cconf.overwrite({a: 33})
    assert.deepEqual(cconf.a.defaults, data.a)
    assert.notEqual(oconf.a, 33)
  })

  it('should NOT overwrite flat item to nested', function () {
    let data = {a: {x: 1, y: 'test'}, b: 2}
    let cconf = new Coelacanth(data)
    let oconf = cconf.overwrite({b: {x: 1, y: 2}})
    assert.deepEqual(cconf.a.defaults, data.a)
    assert.equal(oconf.b, 2)
  })

  it('should create arbitrary new item', function () {
    let data = {a: {x: 1, y: 'test'}, b: 2}
    let cconf = new Coelacanth(data)
    assert.deepEqual(cconf.overwrite({c: {x: 1, y: 2}}).c.defaults, {x: 1, y: 2})
    assert.equal(cconf.overwrite({d: 2}).d, 2)
  })

  it('should overwrite derived item', function () {
    let data = {a: {x: 1, y: 'test'}, b: 2}
    let cconf = new Coelacanth(data)
    cconf.derive('der', conf => conf.b + 32)
    let oconf = cconf.overwrite({der: 33})
    assert.equal(cconf.der, 34)
    assert.equal(oconf.der, 33)
  })
})

describe('#derive()', function () {
  it('should create plain derived values', function () {
    let data = {a: {x: 1, y: 'test'}, b: 2}
    let cconf = new Coelacanth(data)
    cconf.derive('der', conf => conf.b + 32)
    assert.equal(cconf.der, 34)
    cconf = cconf.overwrite({b: 10})
    assert.equal(cconf.der, 42)
  })

  it('should create nested derived values', function () {
    let data = {a: {x: 1, y: 'test'}, b: 2}
    let cconf = new Coelacanth(data)
    cconf.a.derive('der', (conf, root) => conf.x + root.b + 32)
    assert.equal(cconf.a.der, 35)
    cconf = cconf.overwrite({a: {x: 5}, b: 5})
    assert.equal(cconf.a.der, 42)
  })
})
