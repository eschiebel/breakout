var webpack = require('webpack');
var path = require("path");
module.exports = {
    entry: [
        "babel-polyfill",       // babel's es6 environemt
        "./src/js/app.jsx"      // panorama
    ],
    output: {
		path: path.join(__dirname, "/dist"),
		filename: "bundle.js"
    },
	module: {
		loaders: [
            {
                loader: "babel-loader",
                // process only files in src directory
                include: [
                    path.resolve(__dirname, "src")
                ],
                // only run js and jsx files thourgh babel
                test: /\.jsx?/,

                // babel config options
                query: {
                    plugins: ['transform-runtime'],
                    presets: ['es2015', 'react']
                }
            },
            {
				test: /\.css$/,
				loader: 'style-loader?singleton!css-loader?sourceMap'
			}
		]
	},
	resolve: {
		extensions: ['', '.js', '.jsx']
	},
    plugins: [
        function() {
            this.plugin("done", function(stats) {
                if (stats.compilation.errors && stats.compilation.errors.length > 0) {
                    console.log("$$$$ there are " + stats.compilation.errors.length + " errors");
                    console.log(stats.toJson().errors[0]);
                    process.exit(1);
                }
            });
        }
    ]
}
