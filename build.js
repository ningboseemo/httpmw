/**
 * Created by huangxinxin on 17/9/19.
 */
const path = require('path')
const webpack = require('webpack')
const pkg = require('./package.json')

module.exports = {
  entry: path.resolve(__dirname, './src/index.js'),
  output: {
    path: path.resolve(__dirname, './dist'),
    filename: 'httpmw.js',
    library: 'HttpMW',
    libraryTarget: 'umd'
  },
  externals: [ 'axios', 'bluebird', 'ajv', 'lodash' ],
  module: {
    rules: [
      {
        test: /\.js?$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: [ 'es2015', 'env' ],
            plugins: [ 'transform-runtime' ]
          }
        }
      }
    ]
  },
  plugins: [
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false,
        drop_console: false
      }
    }),
    new webpack.BannerPlugin({
      banner: [ pkg.name, `Version:${pkg.version}`, `Description:${pkg.description}` ].join('\n'),
      entryOnly: true
    })
  ]
}
