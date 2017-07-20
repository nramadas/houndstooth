const webpack = require('webpack');
const path = require('path');

const config = {
  entry: './src/index.tsx',
  output: {
    path: path.resolve('./'),
    filename: 'index.js',
  },
  resolve: {
    extensions: [ '.js', '.jsx', '.json', '.ts', '.tsx', '.d.ts' ],
    modules: [
      path.resolve('./src'),
      'node_modules',
    ],
  },
  module: {
    loaders: [{
      test: /\.ts$|\.tsx$|\.d\.ts$/,
      exclude: /node_modules/,
      loader: 'ts-loader',
    }],
  },
};

const compiler = webpack(config);

compiler.watch({}, (err, stats) => {
  if (err) { throw err; }
  console.log(stats.toString({
    colors: true,
    chunks: false,
    version: false,
    children: false,
  }), '\n');
});
