const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports = {

  entry: {
    'app': './app/main.ts',
    'polyfills': [
      'core-js/es6/symbol',
      'core-js/es6/object',
      'core-js/es6/function',
      'core-js/es6/parse-int',
      'core-js/es6/parse-float',
      'core-js/es6/number',
      'core-js/es6/math',
      'core-js/es6/string',
      'core-js/es6/date',
      'core-js/es6/array',
      'core-js/es6/regexp',
      'core-js/es6/map',
      'core-js/es6/set',
      'core-js/es6/reflect',
      'core-js/es7/reflect',
      'zone.js/dist/zone'
    ]
  },
  devTools: 'source-map',
  output: {
    path: './dist',
    filename: '[name].bundle.js'
  },
  module: {
    loaders: [
      {test: /\.component.ts$/, loader: 'ts!angular2-template'},
      {test: /\.ts$/, exclude: /\.component.ts$/, loader: 'ts'},
      {test: /\.html$/, loader: 'raw'},
      {test: /\.scss$/, loader: ExtractTextPlugin.extract('css!sass')},
      {test: /\.css$/, loader: 'raw'}
    ]
  },
  resolve: {
    extensions: ['', '.js', '.ts', '.html', '.css', '.scss']
  },
  plugins: [
    new webpack.optimize.CommonsChunkPlugin({
      name: 'polyfills'
    }),
    new HtmlWebpackPlugin({
      template: './app/index.html'
    }),
    new webpack.DefinePlugin({
      app: {
        environment: JSON.stringify(process.env.APP_ENVIRONMENT || 'development')
      }
    })
  ]

}