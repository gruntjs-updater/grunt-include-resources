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
            ),
            linefeed = grunt.util.normalizelf(grunt.util.linefeed);

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
                .join(linefeed),
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
                    embedded = true,
                    data = '',
                    filepath,
                    content;

                if (typeof include.config.embedded !== 'undefined') {
                    embedded = include.config.embedded;
                }

                // Identifier found in options
                if (id in options[type]) {

                    filepath = options[type][id];

                    // Embed content of resource file
                    if (embedded) {

                        // Resource file found
                        if (grunt.file.exists(filepath)) {

                            // Read resource file content
                            content = grunt.file.read(filepath);

                            // JavaScript
                            if (type === 'js') {
                                data = [
                                    '<script>',
                                    content,
                                    '</script>'
                                ].join(linefeed);

                            // CSS
                            } else {
                                data = [
                                    '<style>',
                                    content,
                                    '</style>'
                                ].join(linefeed);
                            }

                        // Resource file not found
                        } else {
                            grunt.log.warn('Resource file "' + filepath + '" not found.');
                        }

                    // Do not embed content of resource file, just reference it
                    } else {

                        // JavaScript
                        if (type === 'js') {
                            data = '<script src="' + filepath + '"></script>';

                        // CSS
                        } else {
                            data = '<link rel="stylesheet" href="' + filepath + '">';
                        }

                    }

                // Identifier not found in options
                } else {
                    grunt.log.warn('Identifier "' + id + '" with type "' + type + '" not found.');
                }

                // Replace include directive
                src = src.replace(include.directive, function () {
                    return data;
                });

            });

            // Write destination file
            grunt.file.write(file.dest, src);
            grunt.log.writeln('File "' + file.dest + '" created.');

        });

    });

};