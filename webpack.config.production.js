import webpack from 'webpack';
import ExtractTextPlugin from 'extract-text-webpack-plugin';
import SplitByPathPlugin from 'webpack-split-by-path';
import path from 'path';
import StatsPlugin from 'stats-webpack-plugin';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import HtmlPluginRemove from 'html-webpack-plugin-remove';
import WebpackMd5Hash from 'webpack-md5-hash';

export default {
  entry: [
    path.join(__dirname, 'src/index.js')
  ],
  target: 'web',
  output: {
    path: path.join(__dirname, '/bundle/dist'),
    filename: '[name].[chunkhash].js'
  },
  plugins: [
    new SplitByPathPlugin([
      {
        name: 'vendor',
        path: path.join(__dirname, 'node_modules')
      }
    ], {
        manifest: 'app-entry'
      }),
    new WebpackMd5Hash(),

    new webpack.optimize.UglifyJsPlugin({
      minimize: true,
      sourceMap: true,
      warnings: true,
      mangle: true,
      compress: {
        drop_console: true
      }
    }),
    new StatsPlugin('webpack.stats.json', {
      source: false,
      modules: false
    }),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV)
    }),
    new ExtractTextPlugin('bundle.[contenthash].css'),

    new HtmlWebpackPlugin({
      template: 'index.html',
      filename: '../index.html',
      minify: {
        removeComments: true,
        collapseWhitespace: true,
        removeRedundantAttributes: true,
        useShortDoctype: true,
        removeEmptyAttributes: true,
        removeStyleLinkTypeAttributes: true,
        keepClosingSlash: true,
        minifyJS: true,
        minifyCSS: true,
        minifyURLs: true
      },
      inject: true,
    }),
    new HtmlPluginRemove('<script src="/dist/bundle.js"></script>'),
    new webpack.LoaderOptionsPlugin({
      minimize: true,
      debug: false,
      noInfo: true, // set to false to see a list of every file being bundled.
      options: {
        sassLoader: {
          includePaths: [path.resolve(__dirname, 'src', 'scss')]
        },
        context: '/'
      }
    })
  ],
  module: {
    rules: [
      { test: /\.jsx?$/, exclude: /node_modules/, loader: 'babel-loader' },
      { test: /\.eot(\?v=\d+.\d+.\d+)?$/, loader: 'url-loader?name=[name].[ext]' },
      { test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/, loader: 'url-loader?limit=10000&mimetype=application/font-woff&name=[name].[ext]' },
      { test: /\.[ot]tf(\?v=\d+.\d+.\d+)?$/, loader: 'url-loader?limit=10000&mimetype=application/octet-stream&name=[name].[ext]' },
      { test: /\.svg(\?v=\d+.\d+.\d+)?$/, loader: 'url-loader?limit=10000&mimetype=image/svg+xml&name=[name].[ext]' },
      { test: /\.(jpe?g|png|gif)$/i, loader: 'file-loader?name=[name].[ext]' },
      { test: /\.ico$/, loader: 'file-loader?name=[name].[ext]' },
      { test: /(\.css|\.scss|\.sass)$/, loader: ExtractTextPlugin.extract('css-loader?sourceMap!sass-loader?sourceMap') }
    ]
  }
};
