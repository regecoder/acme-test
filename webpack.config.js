const webpack = require('webpack');
const path = require('path');
const nodeExternals = require('webpack-node-externals');
const TerserPlugin = require('terser-webpack-plugin');
const { merge } = require('webpack-merge');

module.exports = (env, argv) => {
  const mode = argv.mode || 'production';

  const commonConfig = {
    mode,

    entry: './src/main.ts',

    output: {
      path: path.resolve(__dirname, 'dist'),
      filename: 'server.js',
      clean: true
    },

    target: 'node',

    externals: [nodeExternals()],

    optimization: {
      minimize: true,
      minimizer: [
        new TerserPlugin({
          extractComments: false
        })
      ]
    },

    resolve: {
      extensions: ['.ts', '.js']
    },

    module: {
      rules: [
        {
          test: /\.(ts|js)$/,
          use: {
            loader: 'babel-loader',
            options: {
              presets: [
                [
                  '@babel/preset-env',
                  {
                    targets: {
                      node: 'current'
                    }
                  }
                ],
                '@babel/preset-typescript'
              ]
            }
          }
        }
      ]
    }
  };

  const devConfig = {
    watch: true,
    // Recommended choice for development builds with high quality SourceMaps
    // devtool: 'eval-source-map',
    // Terser does not support 'eval-source-map'
    devtool: 'source-map',
    plugins: [new webpack.HotModuleReplacementPlugin()]
  };

  const prodConfig = {
    // Recommended choice for production builds with high quality SourceMaps
    devtool: 'source-map'
  };

  let config;
  switch (mode) {
    case 'development':
      config = merge(commonConfig, devConfig);
      break;
    case 'production':
      config = merge(commonConfig, prodConfig);
      break;
    // no default
  }
  return config;
};
