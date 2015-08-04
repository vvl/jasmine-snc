#!/usr/bin/env node

var fs = require('fs');
var request = require("request");

function PostCode(codestring) {
  var username = 'jasmine-snc';
  var password = 'jasmine-snc';
  var instance_url = 'https://demo022.service-now.com/';

  request.post(
    {
      baseUrl: instance_url,
      url: '/eval.do',
      form: { script: codestring },
      auth: { user: username, pass: password }
    },
    function(error, response, body) {
      if (error) {
        console.log('error: ' + error)
        return;
      }
      
      if (response.statusCode == 200) {
        console.log(body);
      } else {
        console.log(JSON.stringify(response));
      }
    }
  );
}


console.log("snc-eval - run Javascript code in a ServiceNow backend");
if (process.argv.length < 3) {
  console.log("no input file is specified -> exiting");
  process.exit(-1);
}

fs.readFile(process.argv[2], 'utf-8', function(err, data) {
  if (err) {
    console.log("FATAL An error occurred trying to read in the file: " + err);
    process.exit(-2);
  }
  if (data) {
    PostCode(data);
  }
  else {
    console.log("the input file is empty -> existing");
    process.exit(0);
  }
});
