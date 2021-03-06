import webpack from 'webpack';
import path from 'path';
import StatsPlugin from 'stats-webpack-plugin';
import HtmlWebpackPlugin from 'html-webpack-plugin';

export default {
  entry: [
    path.join(__dirname, 'src/index.js')
  ],
  output: {
    path: path.join(__dirname, '/bundle/dist'),
    filename: 'bundle.js'
  },
  plugins: [
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.optimize.UglifyJsPlugin({
      compressor: {
        warnings: false,
        screw_ie8: true
      },
      drop_console: true
    }),
    new StatsPlugin('webpack.stats.json', {
      source: false,
      modules: false
    }),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV)
    }),
    new HtmlWebpackPlugin({
      template: 'index.html',
      hash: false,
      filename: '../index.html',
      inject: false
    })
  ],
  module: {
    loaders: [
      {
        test: /\.js$/,
        loader: 'babel',
        exclude: /node_modules/,
        include: path.join(__dirname, 'src')
      },
      {
        test: /\.json?$/,
        loader: 'json'
      },
      {
        test: /\.scss$/,
        loader: 'style!css!sass',
        include: path.join(__dirname, 'src')
      },
      {
        test: /\.css/,
        loader: 'style!css'
      }
    ]
  }
};
