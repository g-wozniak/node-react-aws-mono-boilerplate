var path = require('path')
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const HtmlReplaceWebpackPlugin = require('html-replace-webpack-plugin')
const CompressionPlugin = require('compression-webpack-plugin')
const BrotliPlugin = require('brotli-webpack-plugin')
const { nanoid } = require('nanoid')

module.exports = env => {
  let plugins = []
  const environment = env.WEBAPP_ENV

  if (!['production', 'development'].includes(environment)) {
    throw new Error('Unknown webapp environment. Choose from `production` and `development`.')
  }

  const isProduction = environment === 'production'
  const compression = isProduction ? 'true' : 'false' // keep strings for definePlugin

  console.log('\n\n webpack: webapp')
  console.log(` webapp_env: ${environment}`)  
  console.log(` webapp_compression: ${compression}\n\n`)
  const entry = path.resolve(__dirname, 'dist', 'webapp', 'index.html')

  plugins.push(
    new HtmlWebpackPlugin({
        hash: true,
        template: path.resolve(__dirname, 'src', 'webapp', `${environment}.html`),
        filename: entry
    })
  )

  plugins.push(
    new webpack.DefinePlugin({
      'process.env.WEBAPP_ENV': JSON.stringify(environment),
      'process.env.WEBAPP_COMPRESSION': JSON.stringify(compression)
    })
  )

  plugins.push(
    new HtmlReplaceWebpackPlugin(
      [
        {
          pattern: '_BUILD_',
          replacement: nanoid(8)
        }
      ]
    )
  )
  
  if (compression === 'true') {
    plugins.push(
      new CompressionPlugin({
        filename: '[path][base].gz[query]',
        algorithm: 'gzip',
        test: /\.js$|\.css$|\.html$/,
        threshold: 10240,
        minRatio: 0.7
      })
    )
    plugins.push(
      new BrotliPlugin({
        filename: '[path].br[query]',
        test: /\.js$|\.css$|\.html$/,
        threshold: 10240,
        minRatio: 0.7
      })
    )
  }

  let config = {
    mode: isProduction ? 'production' : 'development',
    entry: [
      require.resolve(path.resolve(__dirname, 'src', 'webapp', 'polyfills')),
      './src/webapp/bootstrap.tsx'
    ],
    output: {
      publicPath: '/app',
      path: path.resolve(__dirname, 'dist', 'webapp', 'app'),
      filename: 'app.js'
    },
    resolve: {
      extensions: ['.ts', '.tsx', '.js'],
      alias: {
        '@webapp': path.resolve(__dirname, 'src', 'webapp'),
        '@webapp/config': path.resolve(__dirname, 'src', 'webapp', 'config'),
        '@webapp/intf': path.resolve(__dirname, 'src', 'webapp', '__intf')
      }
    },
    module: {
      strictExportPresence: true,
      rules: [
        {
          test: /\.ts|\.tsx$/,
          loader: 'ts-loader',
          exclude: [
            /node_modules/
          ]
        }
      ]
    }
  }

  if (isProduction) {
    config = {
      ...config,
      stats: { 
        children: false,
        warnings: false
      },
      optimization: {
        minimize: true,
        moduleIds: 'hashed'
      }
    }
  } else {
    config = {
      ...config,
      devtool: 'inline-source-map',
      stats: 'errors-only',
    }
  }

  return { ...config, plugins }
}
