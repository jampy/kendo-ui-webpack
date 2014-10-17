# Kendo UI Core for Webpack / CommonJS

This is a proxy module for [kendo-ui-core](https://github.com/telerik/kendo-ui-core), 
referencing directly the raw source code (not minified) with all components 
and classes accessible via `require()` calls.

Don't bother where to find a specific class. Don't list the components you 
really need in your Gruntfile (or whatever). Let 
[Webpack](https://webpack.github.io/) do the work for you.

It will find automagically all dependencies and happily minify your code, 
resulting in a compact build.
 
## Advantages

- smaller code base, because only really used widgets are included
- automatic dependency injection - you don't have to manually list the used 
Kendo files in your build
- Webpack friendly - only required static assets (images etc.) are included 
and can be inlined, just the way you want it
- minify / uglify the way *you* want it

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

## Installing

### Dependencies

First, you need to add the required modules:

```
npm install kendo-ui-webpack --save
npm install jquery --save
npm install imports-loader --save
```

The `imports-loader` is a mandatory Webpack loader that helps with a nasty 
Kendo problem. The core library depends on jQuery, but doesn't tell so in the
CommonJS requires. The `imports-loaded` helps to add the dependency and to 
inject the "global variable" `jQuery`, that's expected by Kendo.

For the loader to work, you need to add the following configuration to the 
Webpack config:

```javascript
  module: {
    loaders: {
      { test: /kendo\-ui\-core[\///].*\.js$/, loader: "imports?jQuery=jquery" },
    }
  }
```

Unfortunately, there is no way to automatize this in `kendo-ui-webpack` itself.

### Add CSS theme

Furthermore, you might want add the CSS styles of the Kendo theme you choose to 
use. In the most basic form that means you add the following code at some 
central place (probably the entry point) of your application:

```javascript
require("kendo/styles/web/kendo.common.core.css");
require("kendo/styles/web/kendo.default.css");
```

Or, if you didn't define the alias (see above)...

```javascript
require("kendo-ui-webpack/styles/web/kendo.common.core.css");
require("kendo-ui-webpack/styles/web/kendo.default.css");
```


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