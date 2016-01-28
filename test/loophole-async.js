var loopholeAsync = require('../loophole-async')

var mocha = require('mocha')
var describe = mocha.describe
var it = mocha.it
var chai = require('chai')
var expect = chai.expect

function isNative (fn) {
  return (/\{\s*\[native code\]\s*\}/).test('' + fn)
}

describe('Loophole Async', function () {
  describe('allowAsyncUnsafeEval', function () {
    var allowAsyncUnsafeEval = loopholeAsync.allowAsyncUnsafeEval

    it('should allow asynchronously evals', function (done) {
      allowAsyncUnsafeEval(newEval)

      function newEval (cb) {
        setTimeout(function () {
          var result = eval('var x = 10; var y = 20; x * y') // eslint-disable-line

          // eval was switched with a wrapper vm.runInThisContext
          expect(isNative(eval)).to.be.false
          expect(result).to.equal(200)

          // When cb is called it gives back to global
          // object the real 'eval'
          cb()
          expect(isNative(eval)).to.be.true

          done()
        }, 100)
      }
    })
  })

  describe('allowAsyncUnsafeNewFunction', function () {
    var allowAsyncUnsafeNewFunction = loopholeAsync.allowAsyncUnsafeNewFunction

    it('should allow asynchronously functions to be created', function (done) {
      allowAsyncUnsafeNewFunction(newFn)

      function newFn (cb) {
        setTimeout(function () {
          var f = new Function('return 1 + 1') // eslint-disable-line

          // Function was switched with the loophole.Function
          expect(isNative(Function)).to.be.false
          expect(f()).to.equal(2)

          // When cb is called it gives back to global
          // object the real 'Function'
          cb()
          expect(isNative(Function)).to.be.true

          done()
        }, 100)
      }
    })
  })
})
