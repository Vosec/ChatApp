const webpack = require('webpack');
module.exports = {
  entry: './src/index.js',
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: ['babel-loader']
      },
	  {
        test: /\.css$/,
        use: ['style-loader', 'css-loader']
      },
	  {
	  test: /\.(png|woff|woff2|eot|ttf|svg)$/,
	  loader: 'url-loader?limit=100000'
	  }
    ]
  },
  resolve: {
    extensions: ['*', '.js', '.jsx', '.css']
  },
  output: {
    path: __dirname + '/dist',
    publicPath: '/',
    filename: 'bundle.js'
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin()
  ],
  devServer: {
    contentBase: './dist',
    hot: true
  }
};