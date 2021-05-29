const { CheckerPlugin } = require('awesome-typescript-loader')

module.exports = {
    entry: "./src/client/js/app.js",
    output: {
        path: require("path").resolve("./src/bin/client/js"),
        library: "app",
        filename: "app.js"
    },
    module: {
        resolve: {
            extensions: ['.js', '.ts', '.tsx']
        },
        loaders: [
            {
                test: /\.jsx?$/,
                exclude: /(node_modules|bower_components)/,
                loader: 'babel',
                options: {
                    presets: [
                        ['commonjs', { 'modules': false }]
                    ],
                    plugins: [

                        "@babel/plugin-transform-regenerator",
                        "@babel/plugin-syntax-async-generators",
                    ]
                },
            },
            {
                test: /\.tsx?$/,
                loader: 'awesome-typescript-loader'
            },
            {
                test: /\.json$/,
                loader: 'json-loader'
            }
        ],
        plugins: [
            new CheckerPlugin()
        ],
    }
};
