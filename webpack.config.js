const webpack = require('webpack');
const path = require('path');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');

module.exports = {
    entry: './index.js',
    output: {
        path: path.resolve(__dirname, 'dist'),
        publicPath: '/dist/',
        filename: 'index.js'
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['es2015', 'react']
                    }
                }
            }, {
                test: /\.scss$/,
                use: ExtractTextPlugin.extract({
                    // 在开发环境使用 style-loader
                    fallback: "style-loader",
                    use: [{
                        loader: "css-loader", options: { importLoaders: 1 }
                    }, {
                        loader: "postcss-loader"
                    }, {
                        loader: "sass-loader"
                    }]
                })
            }
        ]
    },
    plugins: [
        new CleanWebpackPlugin(['dist']),//清空dist文件夹
        //把css单独抽取成一个文件
        new ExtractTextPlugin({
            filename: "index.css"
        })
    ],
    devServer: {
        port: 8100,
        compress: true
    }
}