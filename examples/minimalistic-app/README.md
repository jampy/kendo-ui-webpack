This is just a *very* simple example that demonstrates how to add Kendo 
widgets to a web page, with help of Webpack.
 
# Install

```
npm install
webpack  # optionally with "-p" parameter
```

Then, open "index.html" in your web browser. You should see two identical 
calendar widgets.

# Relevant parts
- The package.json dependencies
- The "loaders" section of `webpack.config.js`, especially the `imports` 
  loader, which is of great importance
- Initialization and usage in `main.js`
