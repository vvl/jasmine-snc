var jsnc = new JasmineSNC(this);
var jasmine = jsnc.jasmine;

describe("Rhino 1.5R4 quirks", function() {
  it("the jasmine.isSpy() method would not crash the js runtime", function() {
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
});

jsnc.run();