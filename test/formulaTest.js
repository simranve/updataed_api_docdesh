const {
  assert
} = require('chai');

const {
  formula
} = require('./../App/helper');


describe('Tmin PR/SE-0.6P)', function () {
  var Tmin = new formula.Tmin(930, 29, 18750, 1);
  it('should return -556.56', function () {
    assert.equal(Tmin.tmin1(), -556.56);
  })
});

describe('Tmin R(exp(P/SE) - 1)', function () {
  var Tmin = new formula.Tmin(930, 29, 18750, 1);
  it('should return 1.47', function () {
    assert.equal(Tmin.tmin2(), 1.47);
  })
});

describe('Tmin PR/SE+0.4P', function () {
  var Tmin = new formula.Tmin(930, 29, 18750, 1);
  it('should return 1.47', function () {
    assert.equal(Tmin.tmin3(), 1.47);
  })
});

describe('Tmin PD/2SE-0.2P', function () {
  var Tmin = new formula.Tmin(930, 29, 18750, 1);
  it('should return 1.47', function () {
    assert.equal(Tmin.tmin4(), 1.47);
  })
});

describe('Tmin PD/2SE+1.8P', function () {
  var Tmin = new formula.Tmin(930, 29, 18750, 1);
  it('should return 1.47', function () {
    assert.equal(Tmin.tmin5(), 1.47);
  })
});

describe('Tmin PD/2(SE+PY)', function () {
  var Tmin = new formula.Tmin(930, 29, 18750, 1);
  it('should return 1.47', function () {
    assert.equal(Tmin.tmin6(), 1.47);
  })
});

// for formula ::