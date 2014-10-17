# Kendo UI Core for Webpack / CommonJS

This is a proxy module for [kendo-ui-core](https://github.com/telerik/kendo-ui-core), 
referencing directly the raw source code (not minified) with all components 
and classes accessible via `require()` calls.

Don't bother where to find a specific class. Don't list the components you 
really need in your Gruntfile (or whatever). Let webpack do the work for you.
It will find automagically all dependencies and happily minify your code, 
resulting in a compact build.
 
## Usage
 
You can still use Kendo components either as jQuery plugins or via markdown. 
In either case you have to `require()` the components you use.
 
A module of your application might look like this:

```javascript
var kendoCalendar = require("kendo-ui-webpack/kendo.ui.Calendar");
var cal = new kendoCalendar($("#my-calendar"));
```

or, as a plugin:

```javascript
require("kendo-ui-webpack/kendo.ui.Calendar");
$("#my-calendar").kendoCalendar();
```

## Module names

All classes can be `require()`d by their name in global namespace. As in the 
example above, the `kendo.ui.Calendar` class (which Kendo also injects into 
the global namespace) can be loaded via 
`require("kendo-ui-webpack/kendo.ui.Calendar")`.

If you want shorter names in the `require()` call, you might use Webpacks 
module alias feature.

For example, having a Webpack config like...

```javascript
  resolve: {
    alias : {
      "kendo": "kendo-ui-webpack"
    }
  },
```

allows a simpler/shorter `require("kendo/kendo.ui.Calendar")`

## How this works

This package mainly consists of a "generator" script that has a internal list
describing all public Kendo classes and the corresponding file that defines it.
At NPM install time, it generates a bunch of tiny .js files that make up the 
modules you can `require()` and themselves `require()` the correct Kendo file.

This basically looks like this (`kendo.ui.Button.js`):

```javascript
module.exports = require("kendo-ui-core/src/kendo.button.js").ui.Button;
```

This allows the Webpack analyzer to find the relevant files and once 
minimized this shouldn't take up much space (much less than including the 
complete Kendo source code) nor have a relevant influence to the runtime speed
of your application.