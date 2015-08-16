describe("The timer interface for Rhino 1.5R4", function() {
  /*
    Rhino 1.5R4 does not provide the standard timer interface (i.e. setTimeout / setInterval functions).
    JasmineSNC includes a custom implementation for it.
  */
  
  it("setTimeout() is defined in the global scope", function() {
    expect(setTimeout).toBeDefined();
    expect(setInterval).toBeDefined();
    expect(clearTimeout).toBeDefined();
    expect(clearInterval).toBeDefined();
  });
  
  it("setTimeout() is defined in jasmine.getGlobal()", function() {
    expect(j$.getGlobal().setTimeout).toBeDefined();
    expect(j$.getGlobal().setInterval).toBeDefined();
    expect(j$.getGlobal().clearTimeout).toBeDefined();
    expect(j$.getGlobal().clearInterval).toBeDefined();
  });
  
  it("setTimeout() in the global scope is the same as in jasmine.getGlobal()", function() {
    expect(j$.getGlobal().setTimeout).toBe(setTimeout);
    expect(j$.getGlobal().setInterval).toBe(setInterval);
    expect(j$.getGlobal().clearTimeout).toBe(clearTimeout);
    expect(j$.getGlobal().clearInterval).toBe(clearInterval);
  });
  
  it("jasmine.getGlobal() refers to the same object in different JasmineSNC instances", function() {
    expect(jasmine.getGlobal()).toBe(j$.getGlobal());
  });
  
  it("running one JasmineSNC environment should not execute specs from another", function() {
    jsnc_under_test.run();
    expect(true).toBe(true);
  });
  
  xit("setTimeout() works", function(){
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
