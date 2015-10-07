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
    expect(j$.isSpy(obj)).toBe(false);
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
    var result = j$.matchersUtil.equals(undefined, obj);

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
    var mockDate = new j$.MockDate({ Date: Date });
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
  
  xit("long is a valid varibale name - fix for 'should stringify long arrays with properties properly' spec in core/PrettyPrintSpec.js", function() {
    /*
    In Rhino 1.5R4 giving the name 'long' to a variable crashes the js runtime.

    Replace the following code in PrettyPrintSpec.js:
    
      var long = [1,2,3];
    
    replace with
    
      var longArray = [1,2,3];
      
    (and also rename all occurences of the 'long' local variable)
    
    */
    // this code has to be commented out to avoid a crash
    //var long = [1,2,3];
    //expect(long.length).toEqual(3);
  });
  
  it("expected failure test handled RegExps correctly", function() {
    /*
    In ServiceNow Rhino 1.5R4 regexp literals have the type SNRegExp, not RegExp

    Replace the following code in EnvSpec.js:
    
      if (Object.prototype.toString.call(expectedFailure) === '[object RegExp]') {
    
    replace with
    
      if (expectedFailure instanceof RegExp) {
    
    */
    var re = /foo/;
    expect(re instanceof RegExp).toBeTruthy();
    
    var type = Object.prototype.toString.call(re);
    expect(type).toBe('[object SNRegExp]');
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
        equals: j$.createSpy('delegated-equal').and.returnValue(false)
      },
      matcher = j$.matchers.toThrowError(util),
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
    expect(j$.isA_('RegExp', /foo/)).toBeTruthy();
    
    /* FIX:
     Add the following code into the isA_() function:
     
     if (typeName === 'RegExp') {
       return (typeof value !== 'undefined') && (value instanceof RegExp);
     }
     
     */
  });
  
  it("matchersUtil.equals(/foo/, /foo/) evaluates to true", function() {
    /*
    In ServiceNow's Rhino 1.5R4 regular expression literals have the type SNRegExp, not RegExp.
    This causes a number Jasmine specs to fail:
     - core/toMatchSpec.js
     - core/StringMatchingSpec.js
    */
    expect(j$.matchersUtil.equals(/foo/, /foo/)).toBeTruthy();
    
    /* FIX:
     Add the following code into the eq() function:
     
      case '[object SNRegExp]':
     
     just after the line
      
      case '[object RegExp]':
     
     */
  });
  
  it("jasmine.getEnv().ieVersion is less than 9", function() {
    /*
    This is needed to skip the 'should handle objects with null prototype' spec in PrettyPrintSpec.js.
    In ServiceNow's Rhino 1.5R4 Object.create() is not defined.
    */
    expect(j$.getEnv().ieVersion).toBeLessThan(9);
  });
  
  it("for (var key in obj) returns properties in a random order", function() {
    /*
    In ServiceNow's Rhino 1.5R4 the 'for (var key in obj)' loop returns properties in a random order.
    [in Node the properties are returned in the order they were added to the object]
    */
    var alphabetical = {};
    alphabetical.bbb = '';
    alphabetical.aaa = '';
    
    var keys = getProperties(alphabetical)
    expect(keys[0]).toEqual('aaa');
    expect(keys[1]).toEqual('bbb');
    
    
    var nonAlphabetical = {};
    nonAlphabetical.bProp = '';
    nonAlphabetical.aProp = '';
    
    keys = getProperties(nonAlphabetical)
    expect(keys[0]).toEqual('bProp');
    expect(keys[1]).toEqual('aProp');
    
    function getProperties(obj) {
      var keys = [];
      for (var key in obj) {
        keys.push(key);
      }
      return keys;
    }
  });
  
  it('Java exceptions should not crash Jasmine', function(){
    /*
      In ServiceNow's Rhino 1.5R4 accessing the toString method without calling it
      on Java objects crashes the JavaScript evaluator.
    */
    
    env = new j$.Env();
    env.describe('suite for break on exceptions', function() {
      env.it('should break when an exception is thrown', function() {
        throw new Packages.java.lang.String('xxx');
      });
    });
    var spy = jasmine.createSpy('spy');

    expect(function(){
      env.execute();
      spy();
    }).not.toThrow();

    expect(spy).toHaveBeenCalled();

    /* FIX:
    
      Replace the code in theSpec.isPendingSpecException() function:
    
        Spec.isPendingSpecException = function(e) {
          return !!(e && e.toString && e.toString().indexOf(Spec.pendingSpecExceptionMessage) !== -1);
        };
      
      with the code below:
      
        Spec.isPendingSpecException = function(e) {
          if (!e) {
            return false;
          }
          
          // ServiceNow's version of Rhino has a bug (possibly, this one https://bugzilla.mozilla.org/show_bug.cgi?id=220584)
          // Due to this bug trying to access e.toString (not calling the function but just accessing it) causes the Rhino
          // evaluator to throw a Java Runtime exception:
          // java.lang.RuntimeException: org.mozilla.javascript.PropertyException: Constructor for "TypeError" not found
          var hasToString;
          if (__safe_instanceof(e, Packages.java.lang.Object)) {
            // avoid checking e.toString for Java objects
            hasToString = true;
          } else {
            hasToString = !!e.toString;
          }
          
          return !!(hasToString && e.toString().indexOf(Spec.pendingSpecExceptionMessage) !== -1);
        };
    
    */
  });
});
