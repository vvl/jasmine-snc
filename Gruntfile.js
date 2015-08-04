module.exports = function(grunt) {
  var pkg = require("./package.json");

  grunt.initConfig({
    pkg: pkg,
    wrap: require('./grunt/config/wrap.js')
  });

  require('load-grunt-tasks')(grunt);
  grunt.loadTasks('grunt/tasks');
  
  grunt.registerTask('buildSncEvalSpecs',
    'Copies core and console spec files from Jasmine repo and adds header and footer required by snc-eval',
    [
      'wrap'
    ]
  );
  
  grunt.registerTask('default', ['buildSncEvalSpecs']);
}