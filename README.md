promise-catch-listener
----------------------

Install
-------

`npm install --save promise-catch-listener`

Usage
-----

```javascript
var onError = require('promise-catch-listener')({
    chalk: require('chalk')
});

new Promise(function(reject, resolve){
    throw new Error('a funky error');
})
.catch(onError('A value to resolve to after error.'))
.then(console.log.bind(console));
```

Output from the above code should look something like this:

```
Error a funky error {
 1 line# 6 col# 11 in /path/to/my/program.js -- <unknown>
 2 line# 5 col# 5 in /path/to/my/program.js -- Object.<anonymous>
 3 line# 428 col# 26 in module.js -- Module._compile
 4 line# 446 col# 10 in module.js -- Object.Module._extensions..js
 5 line# 353 col# 32 in module.js -- Module.load
 6 line# 308 col# 12 in module.js -- Function.Module._load
 7 line# 469 col# 10 in module.js -- Function.Module.runMain
 8 line# 124 col# 18 in node.js -- startup
 9 line# 882 col# 3 in node.js -- <unknown>
}
A value to resolve to after error.
```

API
---

```javascript
var onErrorFactory = require('promise-catch-listener');
```

### onErrorFactory(options) -> onError

Returns an error handler factory.

#### options.on

Turn on, or off all error tracking using boolean true, or false.

#### options.rethrow

Throw all errors instead of just printing.

If `options.rethrow` is false the error doesn't stop the execution.

#### options.showStack

Print a stack trace if set to true. Print a regular error if `options.showStack` is set to false.

#### options.chalk

Give all error handlers the [chalk](https://www.npmjs.com/package/chalk) module to enable nicely colored error logs. `options.chalk` applies to all errors.

`chalk` is not included by default because this lib might be used in other environments where `chalk` isn't needed.

```javascript
var onError = require('promise-catch-listener')({
    chalk: require('chalk') //Passing in chalk for colors.
});
```

### onError(returnValue, options) -> callback

Returns an error handler to be passed to `promise.catch`.

`returnValue` is the value you want returned from the the `catch` handler. This value will be resolved in the next `then` callback of the promise chain.

`returnValue` should be a javascript value, or a callback function. If you pass a callback the return of that callback will be the return value of the catch handler.

The options for `onError` are the same as the options for `onErrorFactory` except there is no `chalk` option.

These options only work for the current `promise.catch`.

#### options.on

If true the error will caught, and be printed from the current promise.

#### options.rethrow

If true the error will be thrown again from the current promise.

#### options.showStack

If true a stack trace will be printed from the current promise. If false a simple error notification will be printed.

About
-----

I'm always adding a callback to `promise.catch` just to print an error, or prevent an error from stopping the process. I'm getting a little tired of doing that so I thought a module would be a good idea. I also added some extra functionality I thought would be good for more control.
