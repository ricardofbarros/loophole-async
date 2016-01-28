var vm = require('vm')
var trycatch = require('trycatch')
var loophole = require('loophole')

exports.allowAsyncUnsafeEval = function (fn) {
  var previousEval = global['eval']
  var done = function () {
    global['eval'] = previousEval
  }

  trycatch(function () {
    global['eval'] = function (source) {
      return vm.runInThisContext(source)
    }

    fn(done)
  }, function () {
    done()
  })
}

exports.allowAsyncUnsafeNewFunction = function (fn) {
  var previousFunction = global.Function
  var done = function () {
    global.Function = previousFunction
  }

  trycatch(function () {
    global.Function = loophole.Function

    fn(done)
  }, function () {
    done()
  })
}

module.exports = exports
