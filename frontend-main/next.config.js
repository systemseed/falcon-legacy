const globImporter = require('node-sass-glob-importer');
const webpack = require('webpack');

module.exports = {
  webpack: (config, { dev }) => {
    config.module.rules.push(
      {
        test: /\.(css|scss)/,
        loader: 'emit-file-loader',
        options: {
          name: 'dist/[path][name].[ext]',
        },
      },
      {
        test: /\.css$/,
        use: ['babel-loader', 'raw-loader'],
      },
      {
        test: /\.s(a|c)ss$/,
        use: [
          'babel-loader',
          'raw-loader',
          {
            loader: "sass-loader",
            options: {
              importer: globImporter()
            }
          }
        ],
      }
    );
    // To access process.env.BASE_URL from the frontend. See: https://github.com/zeit/next.js/issues/159#issuecomment-268476743
    config.plugins.push(
      new webpack.DefinePlugin({
        'process.env.BASE_URL': JSON.stringify(process.env.BASE_URL)
      })
    );
    return config;
  },
};
