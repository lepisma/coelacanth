const webpack = require('webpack')
const path = require('path')

const PROD = JSON.parse(process.env.PROD_ENV || '0')

let plugins = []

if (PROD) {
  plugins.push(new webpack.optimize.UglifyJsPlugin({
    compress: {
      warnings: false
    },
    output: {
      comments: false
    }
  }))
}

const config = {
  entry: path.resolve(__dirname, 'src.js'),

  output: {
    filename: PROD ? 'coelacanth.min.js' : 'coelacanth.js',
    path: __dirname,
    library: 'coelacanth',
    libraryTarget: 'umd',
    umdNamedDefine: true
  },

  module: {
    rules: [
      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: /node_modules/,
        options: {
          presets: ['latest']
        }
      }
    ]
  },

  plugins: plugins
}

module.exports = config
