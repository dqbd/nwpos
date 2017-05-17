const webpack = require('webpack')
const path = require("path")
const WebpackShellPlugin = require('webpack-shell-plugin')

module.exports = {
	context: path.resolve(__dirname),
	entry: [
		"./client/index.jsx",
 		"./client/index.html"
	],
	output: {
		filename: "app.js",
		path: path.resolve(__dirname, "server", "dist")
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
			'process.env': {
				NODE_ENV: JSON.stringify('production'),
				BROWSER: true
			}
		}),
		new webpack.optimize.UglifyJsPlugin({
			compress: { warnings: false }
		}),
		new webpack.optimize.DedupePlugin(),
		new WebpackShellPlugin({
			onBuildEnd: "node ./display/compile.js server/dist"
		})
	]
}