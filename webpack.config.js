var path = require('path')
var webpack = require('webpack')
var BrowserSyncPlugin = require('browser-sync-webpack-plugin')

// Phaser webpack config
var phaserModule = path.join(__dirname, '/node_modules/phaser-ce/')
var phaser = path.join(phaserModule, 'build/custom/phaser-split.js')
var pixi = path.join(phaserModule, 'build/custom/pixi.js')
var p2 = path.join(phaserModule, 'build/custom/p2.js')

let webpackConfig = (env) => {
  return {
    entry: {
      app: [
        'babel-polyfill',
        path.resolve(__dirname, 'www/game/app.js')
      ],
      vendor: ['pixi', 'p2', 'phaser', 'webfontloader', 'fontfaceobserver']
    },
    devtool: 'cheap-source-map',
    output: {
      pathinfo: true,
      path: path.resolve(__dirname, './www/build'),
      publicPath: './www/build',
      filename: 'bundle.js'
    },
    watch: true,
    plugins: [
      new webpack.DefinePlugin({
        __DEV__: JSON.stringify(JSON.parse(process.env.BUILD_DEV || 'true')),
        __DEBUG__: env && env.DEBUG === 'true' ? true : false
      }),
      new webpack.optimize.CommonsChunkPlugin({ name: 'vendor'/* chunkName= */, filename: 'vendor.bundle.js'/* filename= */}),
      new BrowserSyncPlugin({
        host: process.env.IP || 'localhost',
        port: process.env.PORT || 3000,
        server: {
          baseDir: ['./', './build']
        }
      })
    ],
    module: {
      rules: [
        {
          test: /\.js$/,
          use: ['babel-loader'],
          include: path.join(__dirname, 'src/**/*'),
          exclude: path.join(__dirname, 'src/**/*.test.js')
        },
        {
          test: /pixi\.js/,
          use: ['expose-loader?PIXI']
        },
        {
          test: /phaser-split\.js$/,
          use: ['expose-loader?Phaser']
        },
        {
          test: /p2\.js/,
          use: ['expose-loader?p2']
        }
      ]
    },
    node: {
      fs: 'empty',
      net: 'empty',
      tls: 'empty'
    },
    resolve: {
      alias: {
        'phaser': phaser,
        'pixi': pixi,
        'p2': p2,
        'www': path.resolve('./www')
      }
    }
  };
};

module.exports = webpackConfig;
