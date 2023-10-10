const webpack = require("webpack");

exports.onCreateWebpackConfig = ({ actions, plugins, stage }) => {
  if (stage === "build-html" || stage === "develop") {
    actions.setWebpackConfig({
      watchOptions: {
        aggregateTimeout: 200,
        poll: 1000,
      },
      resolve: {
        fallback: {
          fs: false,
          'stream': require.resolve('stream-browserify'),
          'buffer': require.resolve('buffer/'),
          'util': require.resolve('util/'),
          'assert': require.resolve('assert/'),
          'http': require.resolve('stream-http/'),
          'url': require.resolve('url/'),
          'https': require.resolve('https-browserify/'),
          'os': require.resolve('os-browserify/'),
          'crypto': require.resolve("crypto-browserify"),
          'path': require.resolve("path-browserify")

        },
       },
       plugins: [
          new webpack.ProvidePlugin({
                process: 'process/browser',
          })
        ],
    })
  }
}