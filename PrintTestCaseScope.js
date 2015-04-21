var jasmine = new JasmineSNC();
(function(obj) { 
    var my = {}; 
    my.getType = function(o) { 
        var type = Object.prototype.toString.call(o); 
        if (type == '[object JavaObject]') { 
            type = '[object ' + o.toString() + ']'; 
        } 
        return type; 
    } 
    my.print = function(msg) { 
        gs.debug(msg, 'VVL'); 
    } 
    my.functions = {}; 
    my.properties = {}; 

    for (prop in obj) { 
        var type = my.getType(obj[prop]); 
            if (type == '[object Function]') { 
            my.functions[prop] = type; 
        } else { 
            my.properties[prop] = type; 
        } 
    } 

    my.print(' -- my.getType(): ' + my.getType(obj)); 
    my.print(' -- FUNCTIONS --'); 
    for (prop in my.functions) { 
        my.print(prop + ': ' + my.functions[prop]); 
    } 
    my.print(' -- PROPERTIES --'); 
    for (prop in my.properties) { 
        my.print(prop + ': ' + my.properties[prop]); 
    } 
})(this);