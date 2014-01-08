# grunt-include-resources

> Includes external resources like CSS or JavaScript into HTML files.


## Getting Started
This plugin requires Grunt `~0.4.2`

If you haven't used [Grunt](http://gruntjs.com/) before, be sure to check out the [Getting Started](http://gruntjs.com/getting-started) guide, as it explains how to create a [Gruntfile](http://gruntjs.com/sample-gruntfile) as well as install and use Grunt plugins. Once you're familiar with that process, you may install this plugin with this command:

```shell
npm install grunt-include-resources --save-dev
```

Once the plugin has been installed, it may be enabled inside your Gruntfile with this line of JavaScript:

```js
grunt.loadNpmTasks('grunt-include-resources');
```


## The "include_resources" task

### Options

#### prefix
Type: `String`
Default value: `'<!-- include: '`

Comment prefix for the include directive.

#### suffix
Type: `String`
Default value: `' -->'`

Comment suffix for the include directive.

#### css
Type: `Object`
Default value: `{}`

Identifier to file path mapping for JavaScript files to include.

#### js
Type: `Object`
Default value: `{}`

Identifier to file path mapping for CSS files to include.



## Usage examples

### Basic include

**Gruntfile:**

```js
grunt.initConfig({

  include_resources: {

    // Production build (use uncompressed resources)
    prod: {
      files: {
        'prod/index.html': 'index.html'
      },
      options: {
        css: {
          style: 'style.css'
        },
        js: {
          loader: 'loader.js'
        }
      }
    },

    // Distribution build (use minified resources)
    dist: {
      files: {
        'dist/index.html': 'index.html'
      },
      options: {
        css: {
          style: 'style.min.css'
        },
        js: {
          loader: 'loader.min.js'
        }
      }
    }

  }

});
```

**index.html:**

```html
<!DOCTYPE html>
<html>
  <head>

    <title>Test</title>

    <!-- include: { type: "css", id: "style" } -->

  </head>
  <body>

    <!-- include: { type: "js", id: "loader" } -->

  </body>
</html>
```

**prod/index.html:** (after execution)

```html
<!DOCTYPE html>
<html>
  <head>

    <title>Test</title>

    <style type="text/css">
      body {
        background-color: #000;
        text-align: center;
      }
    </style>

  </head>
  <body>

    <script type="text/javascript">
      (function () {

        'use strict';

        var Loader = {
          init: function () {
            // ...
          }
        };

        Loader.init();

      }());
    </script>

  </body>
</html>
```

**dist/index.html:** (after execution)

```html
<!DOCTYPE html>
<html>
  <head>

    <title>Test</title>

    <style type="text/css">
      body{background-color:#000;text-align:center}
    </style>

  </head>
  <body>

    <script type="text/javascript">
      (function(){var a={init:function(){}};a.init()}());
    </script>

  </body>
</html>
```


## Release History

 * 2014-01-08   v0.1.1   Added initial documentation.
 * 2014-01-08   v0.1.0   Work in progress, not yet officially released.