const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
  entry: {
    index: "./src/js/index.js",
  },
  output: {
    filename: "[name].[chunkhash].js",
    path: __dirname + "/dist",
  },
  plugins: [
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      template: "./src/html/index.html",
      inject: true,
      // inject: true => Otomatik olarak build dosyasını script tag'ı olarak eklemeyi sağlar.
    }),
  ],
  module: {
    rules: [
      {
        test: [/.js$/], // test => Hangi dosya tiplerinin işlemden geçeceğini belirttiğimiz property
        exclude: /(node_modules)/, // exclude => Hangi klasörlerin işlemden geçmeyeceğini belirttiğimiz property
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-env"],
          },
        },
      },
      {
        test: [/.css$/],
        use: ["style-loader", "css-loader"],
      },
    ],
  },
};
