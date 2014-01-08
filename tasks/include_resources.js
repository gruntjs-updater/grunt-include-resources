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

        var options = this.options({
                prefix: '<!-- include: ',
                suffix: ' -->'
            }),
            pattern = new RegExp(
                options.prefix +
                '' +
                options.suffix,
                'g'
            );

    });

};