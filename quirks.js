var jsnc = new JasmineSNC(this);
var jasmine = jsnc.jasmine;

describe("Rhino 1.5R4 quirks", function() {
  it("the jasmine.isSpy({}) method would not crash the js runtime", function() {
    /*
    in Rhino 1.5R4 the code 'undefined instanceof Object' crashes the runtime
    add the following code to isSpy():
    
    if (j$.util.isUndefined(putativeSpy.and) || j$.util.isUndefined(putativeSpy.calls)) {
      return false;
    }
    
    */
    var obj = {};
    expect(jasmine.isSpy(obj)).toBe(false);
  });
  
  it("the jasmine.matchersUtil.equals(undefined, anObject) method would not crash the js runtime", function() {
    /*
    in Rhino 1.5R4 the code 'undefined instanceof Object' crashes the runtime
    add the following code to eq():
    
    if (j$.util.isUndefined(putativeSpy.and) || j$.util.isUndefined(putativeSpy.calls)) {
      return false;
    }
    
    */
    var obj = {};
    var result = jasmine.matchersUtil.equals(undefined, obj);

    expect(result).toBe(false);
  });
  
  it("the expect().toThrowError() method would not crash the js runtime", function() {
    /*
    in Rhino 1.5R4 the code 'undefined instanceof Object' crashes the runtime.
    
    Change the following code in getJasmineRequireObj().toThrowError():
    
      if (!(thrown instanceof Error)) {
    
    replace with
    
      if ((typeof thrown === 'undefined') || !(thrown instanceof Error)) {
    
    */
    var foo = function() { throw undefined; };
    expect(foo).not.toThrowError();
  });
  
  it("spyStrategy.throwError() method would not crash the js runtime", function() {
    /*
    in Rhino 1.5R4 the code 'undefined instanceof Object' crashes the runtime.
    This causes a Jasmine spec to crash:
     - core/SpyStrategySpec.js
    
    Change the following code in getJasmineRequireObj().SpyStrategy().throwError():
    
      var error = (something instanceof Error) ? something : new Error(something);
    
    replace with
    
      var error = (typeof something !== 'undefined' && something instanceof Error)
        ? something : new Error(something);
    
    */
    var spy = jasmine.createSpy('spy'),
        spyStrategy = new jasmine.SpyStrategy({getSpy: spy});

    spyStrategy.throwError();
    expect(spy).toHaveBeenCalled();
  });
  
  it("MockDate.install() method would not crash the js runtime", function() {
    /*
    in Rhino 1.5R4 the code 'undefined instanceof Object' crashes the runtime.
    This causes a Jasmine spec to crash:
     - core/QueueRunnerSpec.js
    
    Define a global function __safe_instanceof(obj, type).
    
    Change the following code in MockDate.install():
    
      if (mockDate instanceof GlobalDate) {
    
    replace with
    
      if (__safe_instanceof(mockDate, GlobalDate)) {
    
    */
    var mockDate = new jasmine.MockDate({ Date: Date });
    mockDate.install();
    expect(true).toBe(true);
  });
  
  xit("an empty Array object evaluates to true - fix for 'processes a complicated tree with the root specified' spec in core/TreeProcessorSpec.js", function() {
    /*
    In Rhino 1.5R4 the code below wrongly evaluates to true.
    
    var arr = [];
    var result = (!arr);
    
    
    Replace the following code in processNode():
    
      if (!node.children) {
    
    replace with
    
      if (!(typeof node.children === 'object')) {
    
    */
    var arr = [];
    var result = (!arr);
    
    expect(result).toBe(false);
  });
  
  xit("an empty Array object evaluates to true - fix for 'runs a node with no children' spec in core/TreeProcessorSpec.js", function() {
    /*
    In Rhino 1.5R4 the code below wrongly evaluates to true.
    
    var arr = [];
    var result = (!arr);
    
    
    Replace the following code in executeNode():
    
      if (node.children) {
    
    replace with
    
      if (typeof node.children === 'object') {
    
    */
    var arr = [];
    var result = (!arr);
    
    expect(result).toBe(false);
  });
  
  it("The 'toThrowError' matcher correctly shows the typename of the thrown Error", function() {
    /*
    In Rhino 1.5R4 the constructor for all 6 standard subclasses of the Error type is the same: 'function Error() { }'
    This also causes 2 Jasmine specs to fail:
     - core/toThrowErrorSpec.js/fails if thrown is a type of Error and the expected is a different Error
    
    E.g. in the same code (new URIError().constructor).toString() works differently in Rhino and in Node:
    in Rhino: 'function Error() { [native code for Error.Error, arity=1] }'
    in Node: 'function URIError() { [native code] }'
    
    
    Replace the following code in thrownDescription: function(thrown) :
    
      j$.fnNameFor(thrown.constructor)
    
    replace with
    
      j$.fnNameFor(thrown)
    
    */
    
    var util = {
        equals: jasmine.createSpy('delegated-equal').and.returnValue(false)
      },
      matcher = jasmine.matchers.toThrowError(util),
      fn = function() {
        throw new RangeError();
      },
      result;

    result = matcher.compare(fn, TypeError);

    expect(result.pass).toBe(false);
    expect(result.message()).toEqual("Expected function to throw TypeError, but it threw RangeError.");
  });
  
  it("jasmine.isA_('RegExp', /foo/) evaluates to true", function() {
    /*
    In ServiceNow's Rhino 1.5R4 regular expression literals have the type SNRegExp, not RegExp.
    This causes a number Jasmine specs to fail:
     - core/toMatchSpec.js
     - core/StringMatchingSpec.js
    */
    expect(jasmine.isA_('RegExp', /foo/)).toBeTruthy();
    
    /* FIX:
     Add the following code into the isA_() function:
     
     if (typeName === 'RegExp') {
       return (typeof value !== 'undefined') && (value instanceof RegExp);
     }
     
     */
  });
});


describe("The timer interface for Rhino 1.5R4", function() {
  /*
    Rhino 1.5R4 does not provide the standard timer interface (i.e. setTimeout / setInterval functions).
    JasmineSNC includes a custom implementation for it.
  */
  
  var jsnc_under_test,
      j$;
  
  beforeEach(function() {
    jsnc_under_test = new JasmineSNC({});
    j$ = jsnc_under_test.jasmine;
  });
  
  it("different JasmineSNC environments should be independent", function() {
    expect(jasmine.getGlobal()).not.toBe(j$.getGlobal());
  });
  
  it("running one JasmineSNC environment should not execute specs from another", function() {
    jsnc_under_test.run();
    expect(true).toBe(true);
  });
    
  it("The timer interface is defined", function() {
    expect(j$.getGlobal().setTimeout).toBeDefined();
    expect(j$.getGlobal().setInterval).toBeDefined();
    expect(j$.getGlobal().clearTimeout).toBeDefined();
    expect(j$.getGlobal().clearInterval).toBeDefined();
  });
  
  it("setTimeout() works", function(){
    var foo = {
      deferredFn: function() {}
    };
    
    spyOn(foo, 'deferredFn');
    
    // call the setTimeout to setup a deferred function
    j$.getGlobal().setTimeout(function() {
      foo.deferredFn();
    }, 0);
    
    // launch the timer loop to execute the deferred function
    jsnc_under_test.run();
    
    expect(foo.deferredFn).toHaveBeenCalled();
  });
});

jsnc.run();