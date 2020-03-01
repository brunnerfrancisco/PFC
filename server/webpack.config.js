module.exports = {
    entry: __dirname + '/src',
    output: {
      path: '/',
      filename: 'bundle.js'
    },
    mode: 'development',
    devtool: 'inline-source-map',
    module:{
      rules: [
        {
          test: /\.js$/,
          loader: 'babel-loader',
          query: {
            // presets are colection of plugins
            compact: false,
            presets: ["es2015", "react"],
            plugins: ['transform-class-properties']
          }
        },
        {
            test: /\.css$/,
            use: ['style-loader', 'css-loader']
        }
      ]
    }
  };