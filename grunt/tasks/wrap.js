var grunt = require("grunt");

// http://stackoverflow.com/questions/12722855/using-grunt-concat-how-would-i-automate-the-concatenation-of-the-same-file-to-m
grunt.registerMultiTask('wrap',
    'Wraps source files with specified header and footer',
    function() {
        var data = this.data,
            path = require('path'),
            dest = grunt.template.process(data.dest),
            files = grunt.file.expand(data.src),
            header = grunt.file.read(grunt.template.process(data.header)),
            footer = grunt.file.read(grunt.template.process(data.footer)),
            sep = grunt.util.linefeed; 

        files.forEach(function(f) {
            var p = dest + '/' + path.basename(f),
                contents = grunt.file.read(f);

            grunt.file.write(p, header + sep + contents + sep + footer);
            grunt.log.writeln('File "' + p + '" created.');
        });
    }
);
