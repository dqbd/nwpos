const webpack = require('webpack')
const path = require("path")

module.exports = {
	context: path.resolve(__dirname),
	entry: [
		"webpack-dev-server/client?http://localhost:8080",
		"webpack/hot/dev-server",
		"./src/index.jsx",
 		"./src/index.html"
	],
	output: {
		filename: "app.js",
		path: path.resolve(__dirname, "dist")
	},
	module: {
		loaders: [
			{
				test: /\.(jsx|js)$/,
				exclude: /node_modules/,
				loader: "babel-loader?presets[]=latest,presets[]=react"
			},
			{
				test: /\.html$/,
				exclude: /node_modules/,
				loader: "file?name=index.html"
			},
			{	
				test: /\.styl$/, 
				exclude: /node_modules/,
				loader: "style-loader!css-loader!stylus-loader"
			}
		]
	},
	plugins: [
		new webpack.DefinePlugin({
			'process.env': { BROWSER: true }
		}),
		new webpack.optimize.OccurenceOrderPlugin(),
		new webpack.HotModuleReplacementPlugin()
	]
}