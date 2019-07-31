const path = require('path')
const createVueLoaderOptions = require('./vue-loader.config')
const VueLoaderPlugin = require('vue-loader/lib/plugin')

const isProd = process.env.NODE_ENV === 'production'

const baseConfig = {
  target: 'web',
  entry: path.join(__dirname, '../client/client-entry.js'),
  output: {
    filename: 'bundle.[hash:8].js',
    path: path.join(__dirname, '../client-dist'),
    publicPath: 'http://127.0.0.1:8080/client-dist/'
  },
  resolve: {
    extensions: ['.vue', '.js', '.json', '.jsx']
  },
  module: {
    rules: [
      {
        test: /\.(vue|js|jsx)$/,
        loader: 'eslint-loader',
        exclude: /node_modules/,
        enforce: 'pre' // 先处理
      },
      {
        test: /\.vue$/,
        loader: 'vue-loader',
        options: createVueLoaderOptions(isProd)
      },
      {
        test: /\.(js|jsx)$/,
        loader: 'babel-loader',
        exclude: /node_modules/
      },
      {
        test: /\.(git|png|jpe?g|svg)$/,
        loader: 'url-loader',
        options: {
          limit: 10240,
          name: '[name].[hash:8].[ext]',
          outputPath: 'images/'
        }
      },
      {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10240,
          name: '[name].[hash:8].[ext]',
          outputPath: 'fonts/'
        }
      },
      {
        test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10240,
          name: '[name].[hash:8].[ext]',
          outputPath: 'media/'
        }
      }
    ]
  },
  plugins: [new VueLoaderPlugin()]
}

module.exports = baseConfig
