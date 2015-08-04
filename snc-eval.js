#!/usr/bin/env node

var fs = require('fs');
var request = require("request");

function PostCode(codestring, callback) {
  var done = function(error, result) {};
  if (typeof callback == 'function') {
    done = callback;
  }
  
  var username = 'jasmine-snc';
  var password = 'jasmine-snc';
  var instance_url = 'https://demo022.service-now.com/';

  request.post(
    {
      baseUrl: instance_url,
      url: '/eval.do',
      form: { script: codestring },
      auth: { user: username, pass: password },
      timeout: 5000
    },
    function(error, response, body) {
      if (error) {
        done(error.toString(), null);
        return;
      }
      
      if (response.statusCode == 200) {
        done(null, body);
      } else {
        done(JSON.stringify(response), null);
      }
    }
  );
}

function SnvEvalFile(filename, callback) {
  var done = function(error, result) {};
  if (typeof callback == 'function') {
    done = callback;
  }
  
  fs.readFile(filename, 'utf-8', function(error, data) {
    if (error) {
      done("FATAL An error occurred trying to read in the file: " + error, null);
    } else if (data) {
      PostCode(data, callback);
    } else {
      done("the input file is empty -> existing", null);
    }
  });
}

// the code below only executes when this file is run directly
// it does not execute when this file is require()'d from another file
// this allows includuing this file as a module to other files
if (require.main === module) {
  console.log("snc-eval - run Javascript code in a ServiceNow backend");
  if (process.argv.length < 3) {
    console.log("no input file is specified -> exiting");
    process.exit(-1);
  }
  
  SnvEvalFile(process.argv[2], function(error, result) {
    if (error) {
      console.log(error);
      process.exit(-2);
    } else {
      console.log(result);
    }
  });
}
