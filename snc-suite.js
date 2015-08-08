var fs = require('fs');
var util = require('util');
var grunt = require("grunt");
var snc_eval = require("./snc-eval");

// Jasmine "runner"
function executeSpecs(specs, done, isVerbose, showColors) {
  var results = [];
  
  function printResultSummary() {
    console.log("\nSummary of " + results.length + " file(s):");
    var totalSpecs = 0,
        totalFailures = 0;
    results.forEach(function(result) {
      var summary = 'CRASHED';
      if (result.status == 'OK') {
        summary = result.counts.specs + ' specs, ' + result.counts.failures + ' failures';
        totalSpecs += parseInt(result.counts.specs);
        totalFailures += parseInt(result.counts.failures);
      }
      console.log(result.filename + ': ' + summary);
    });
    console.log(totalSpecs + " specs, " + totalFailures + " failures");
  }
  
  var filefn = function(idx, next) {
    if (idx == specs.length) {
      printResultSummary();
      done(true);
    } else {
      var filename = specs[idx];
      console.log('running ' + filename);
      snc_eval.SnvEvalFile(filename, function(error, body) {
        if (error) {
          printResultSummary();
          console.log(error);
          done(false);
        } else {
          var result = JSON.parse(body);
          if (result.status == 'OK') {
            console.log(result.output);
            var re = /(\d+) specs?, (\d+) failures?\n*Finished in \d+\.\d+ seconds?\n?$/;
            var matches = re.exec(result.output);
            results.push({filename: filename, status: result.status, counts: { specs: matches[1], failures: matches[2] }});
          } else {
            console.log('ERROR:');
            console.log(result.error);
            console.log("\nOUTPUT:");
            console.log(result.output);
            results.push({filename: filename, status: result.status, counts: null});
          }
          next(idx + 1, next);
        }
      });
    }
  };
  
  filefn(0, filefn);
}

function getFiles(dir, matcher) {
  var allFiles = [];

  if (fs.statSync(dir).isFile() && dir.match(matcher)) {
    allFiles.push(dir);
  } else {
    var files = fs.readdirSync(dir);
    for (var i = 0, len = files.length; i < len; ++i) {
      var filename = dir + '/' + files[i];
      if (fs.statSync(filename).isFile() && filename.match(matcher)) {
        allFiles.push(filename);
      } else if (fs.statSync(filename).isDirectory()) {
        var subfiles = getFiles(filename);
        subfiles.forEach(function(result) {
          allFiles.push(result);
        });
      }
    }
  }
  return allFiles;
}

function getSpecFiles(dir) {
  return getFiles(dir, new RegExp("EnvSpec.js$"));
}

// options from command line
var isVerbose = false;
var showColors = true;
var perfSuite = false;

process.argv.forEach(function(arg) {
  switch (arg) {
    case '--color':
      showColors = true;
      break;
    case '--noColor':
      showColors = false;
      break;
    case '--verbose':
      isVerbose = true;
      break;
    case '--perf':
      perfSuite = true;
      break;
  }
});

specs = [];

if (perfSuite) {
  specs = getFiles(__dirname + '/snc_eval_spec/performance', new RegExp("test.js$"));
} else {
  var consoleSpecs = getSpecFiles(__dirname + "/snc_eval_spec/console"),
      coreSpecs = getSpecFiles(__dirname + "/snc_eval_spec/core"),
      specs = consoleSpecs.concat(coreSpecs);
}

executeSpecs(specs, function(passed) {
  if (passed) {
    process.exit(0);
  } else {
    process.exit(1);
  }
}, isVerbose, showColors);
