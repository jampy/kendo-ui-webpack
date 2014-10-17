module.exports = {
  entry: {
    main : "./main.js"
  },
  resolve: {
    alias : {
      "kendo": "kendo-ui-webpack"
    }
  },
  module: {
    loaders: [
      { test: /kendo\-ui\-core[\///].*\.js$/, loader: "imports?jQuery=jquery" },
      { test: /\.css$/, loader: 'style!css' },
      { test: /\.(png|jpg|gif)$/, loader: 'url?limit=8192' }
    ]
  },
  output: {
    path: "dist",
    filename: 'build.js'
  }
};