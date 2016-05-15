# jasmine-snc
Use the Jasmine JavaScript testing framework inside ServiceNow.

## Example
Run the following as a background script. The output will be printed on screen as well as saved in the `JasmineSNC` log source.
```
JasmineSNC.timer.run(function(){
var jsnc = new JasmineSNC().into(this);

describe('test suite', function() {

	it('may contain any Jasmine specs', function() {
		expect(true).toBeTruthy();
	});

	it('async specs are supported as well', function(done) {
	    setTimeout(function() {
	        expect(true).toBeTruthy();
	        done();
	    }, 0);
	});
});

jsnc.run();
}); // end of JasmineSNC.timer.run()
```

## Rationale
> Why does this fork of Jasmine exist?

All versions of ServiceNow up to Fuji (Fuji included) come with the
[Rhino 1.5R4](https://developer.mozilla.org/en-US/docs/Mozilla/Projects/Rhino/Downloads_archive) JavaScript runtime.
That version of Rhino was released in 2003 and by any current standard would be considered old and buggy. It does not
support such language features as Array.indexOf that were introduced in the ES5 specification.

Jasmine is not created to run in such a peculiar runtime environment and so it just silently crashes there. This repo
provides a backport of the Jasmine library onto the old Rhino JS runtime.

## Installation
In your ServiceNow instance create a Script Include with the name `JasmineSNC` and paste the entire contents of the
JasmineSNC.js file there. That's all.

## Usage
There is no automatic test runner for ServiceNow yet (would be nice to have something like Karma there). That means 
that for the time being you have to execute your tests manually every time when you need them. Either run your tests
in the background script console or save them as an 'On Demand' Scheduled Script Excecution and run from there.

The output is saved in the `JasmineSNC` log source. In the case of background script console, it is also displayed on screen.

## Differences from the stock Jasmine
**No functional differences.** All Jasmine functionality is supported. All specs coming with the Jasmine library are passing OK.

## Supported versions
 - Jasmine: 2.3.4
 - ServiceNow: Eureka or below (the work to port this to Helsinki is ongoing)