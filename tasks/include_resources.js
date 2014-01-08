/*
 * grunt-include-resources
 * https://github.com/dsuckau/grunt-include-resources
 *
 * Copyright (c) 2014 Denis Suckau
 * Licensed under the MIT license.
 */

module.exports = function (grunt) {

    'use strict';

    grunt.registerMultiTask('include_resources', 'Include resources into HTML files.', function() {

        // Default options
        var options = this.options({
                prefix: '<!-- include: ',
                suffix: ' -->',
                css: {},
                js: {}
            }),

            // Regular expression to match include directives
            re = new RegExp(
                options.prefix +
                '({[\\s\\S]*?})' +
                options.suffix,
                'g'
            );

        this.files.forEach(function (file) {

            // Merge all source files
            var src = file.src.filter(function (filepath) {
                    if (!grunt.file.exists(filepath)) {
                        grunt.log.warn('Source file "' + filepath + '" not found.');
                        return false;
                    }
                    return true;
                })
                .map(grunt.file.read)
                .join(grunt.util.normalizelf(grunt.util.linefeed)),
                includes = [],
                match;

            // Match all include directives
            while (match = re.exec(src)) {
                includes.push({
                    directive: match[0],
                    config: JSON.parse(match[1])
                });
            }

            includes.forEach(function (include) {

                var id = include.config.id,
                    type = include.config.type,
                    data = '',
                    filepath,
                    content;

                // Identifier found in options
                if (id in options[type]) {

                    filepath = options[type][id];

                    // Resource file found
                    if (grunt.file.exists(filepath)) {

                        // Read resource file content
                        content = grunt.file.read(filepath);

                        // JavaScript
                        if (type === 'js') {
                            data = [
                                '<script type="text/javascript">',
                                content,
                                '</script>'
                            ].join(grunt.util.normalizelf(grunt.util.linefeed));

                        // CSS
                        } else {
                            data = [
                                '<style type="text/css">',
                                content,
                                '</style>'
                            ].join(grunt.util.normalizelf(grunt.util.linefeed));
                        }

                    // Resource file not found
                    } else {
                        grunt.log.warn('Resource file "' + filepath + '" not found.');
                    }

                // Identifier not found in options
                } else {
                    grunt.log.warn('Identifier "' + id + '" with type "' + type + '" not found.');
                }

                // Replace include directive
                src = src.replace(include.directive, data);

            });

            // Write destination file
            grunt.file.write(file.dest, src);
            grunt.log.writeln('File "' + file.dest + '" created.');

        });

    });

};