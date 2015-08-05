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