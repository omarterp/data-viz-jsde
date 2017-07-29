var path = require('path');
var HtmlWebpackPlugin = require('html-webpack-plugin');


module.exports = {
  devtool: 'inline-source-map',
  entry: [
    path.resolve(__dirname, 'src/main.js')
  ],
  target: 'web',
  output: {
    path: path.resolve(__dirname, 'src'),
    publicPath: '/',
    filename: 'bundle.js'
  },
  plugins: [
    // Create  HTML file that includes reference to bundled JS.
    new HtmlWebpackPlugin({
      template: 'src/index.html',
      inject: true
    })
  ],
  module: {
    loaders: [
      {test: /\.js$/, exclude: /node_modules/, loaders: ['babel-loader']},
      {test: /\.css$/, loaders: ['style', 'css']}
    ]
  }
}
