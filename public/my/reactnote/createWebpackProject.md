 // 初始化配置文件
npm init -y
// 安装webpack相关包
npm install -D webpack@4.16.0 webpack-cli
// 运行webpack打包文件
npx webpack
node_modules/.bin/webpack
// 配置快捷方式后(package.json的scripts属性)
"build": "webpack --config config/webpack.config.js"
npm run build
// 安装开发环境依赖包
npm install -D clean-webpack-plugin
npm install -D html-webpack-plugin
npm install -D webpack-merge
npm install -D webpack-dev-server
npm install -D style-loader
npm install -D css-loader
npm install -D postcss-loader
npm install -D autoprefixer
// 安装生产环境依赖包
npm install jquery
 
npm install -D babel-loader babel-core babel-preset-env
npm install babel-polyfill
npm install -D babel-plugin-transform-runtime （js编译有问题时注意这个）
npm install babel-runtime
npm install -D babel-plugin-syntax-dynamic-import
 
 
 
 以下为 webpack + bable-loader + css-loader-react + plugin 的 devDependencies
 
 "devDependencies": {
    "autoprefixer": "^9.1.1",
    "babel-core": "^6.26.3",
    "babel-loader": "^7.1.5",
    "babel-plugin-syntax-dynamic-import": "^6.18.0",
    "babel-plugin-transform-runtime": "^6.23.0",
    "babel-preset-env": "^1.7.0",
    "babel-preset-react": "^6.24.1",
    "babel-runtime": "^6.26.0",
    "clean-webpack-plugin": "^0.1.19",
    "css-loader": "^1.0.0",
    "extract-text-webpack-plugin": "^4.0.0-beta.0",
    "html-webpack-plugin": "^3.2.0",
    "less": "^3.8.1",
    "less-loader": "^4.1.0",
    "postcss-loader": "^3.0.0",
    "react": "^16.4.2",
    "react-dom": "^16.4.2",
    "style-loader": "^0.22.1",
    "transform-runtime": "0.0.0",
    "webpack": "^4.16.5",
    "webpack-cli": "^3.1.0",
    "webpack-dev-server": "^3.1.5",
    "webpack-merge": "^4.1.4"
  },
  
  
  webpack.commont.js配置如下
  const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');//引入   
const webpack = require("webpack");

// const miniCssExtractPlugin =require("mini-css-extract-plugin");
const ExtractTextPlugin = require("extract-text-webpack-plugin");
module.exports = {
    entry: {
        index: './src/index.js',
        other: './src/other.js'
    },
    output: {
        filename: '[name].bundle.[chunkhash].js',
        chunkFilename: '[name].[chunkhash].js',
        path: path.resolve(__dirname, '../dist')
    },
    module: {
        rules: [

            {
                test: /\.(js|jsx)$/,
                use: ['babel-loader'],
                exclude: /node_modules/

            },
            {
                test: /\.less$/,
                use: ["style-loader", "css-loader", "less-loader", "postcss-loader"]
            }

        ]
    },

    plugins: [// 对应的插件
        // new webpack.HashedModuleIdsPlugin(),
        new HtmlWebpackPlugin({ //配置
            filename: 'index.html',//输出文件名
            template: 'index.html',//以当前目录下的index.html文件为模板生成dist/index.html文件
            
            minify:{
                removeComments:true
            },
            chunks: ["index","commons"]
        }),
        new HtmlWebpackPlugin({ //配置
            filename: 'target.html',//输出文件名
            template: 'index.html',//以当前目录下的index.html文件为模板生成dist/index.html文件
          
            minify: {
                removeComments: false
            },
            chunks: ["other", "commons"]
        }),
        new CleanWebpackPlugin(['dist'], {
            root: path.resolve(__dirname, '../'),   //根目录
            verbose: true,        　　　　　　　　　　//开启在控制台输出信息
        }),
        new webpack.HotModuleReplacementPlugin(),
        // new ExtractTextPlugin("./css/styles[hash].css")
    ],
 
    resolve: {
        alias: {
            '@': path.resolve(__dirname, "../src")
        },
        extensions: ['.js', '.json', '.jsx', '.less', '.css']
    }
};

webpack.pro.js配置如下
const merge = require('webpack-merge');
const common = require('./webpack.common');
const path = require('path');
module.exports = merge(common, {
    optimization: {
        splitChunks: {
            cacheGroups: {
                commons: {
                    name: 'commons',
                    chunks: 'initial',
                    minChunks: 2
                }
            }
        }
    },
    mode: 'production'
});

webpack.dev.js 配置如下：
const path = require('path');
const merge = require('webpack-merge');
const common = require('./webpack.common');


module.exports = merge(common, {
    devtool: 'inline-source-map',
    devServer: {
        contentBase: path.join(__dirname, '../dist'),
        host: 'localhost',//主机地址
        port: 9090,//端口号
    },
    output: {
        filename: '[name].bundle.[hash].js',
        chunkFilename: '[name].[hash].js',
        path: path.resolve(__dirname, '../dist')
    },
    mode: 'development'
});
