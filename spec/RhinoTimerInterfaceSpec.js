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
