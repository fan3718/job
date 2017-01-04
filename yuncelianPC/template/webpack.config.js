var webpack = require('webpack');
var path = require('path');
var precss       = require('precss');
var autoprefixer = require('autoprefixer');
var ExtractTextPlugin = require("extract-text-webpack-plugin");
module.exports = {
	//生成sourcemap,便于开发调试
	devtool : "source-map",
	//获取项目入口js文件
	entry:{
		teacher : './style.js',
		student : './student_style.js'
	},
	output:{
		//文件输出目录
		path:path.join(__dirname,'dist'),
		//根据入口文件输出的对应多个文件名
		filename:'bundle.js',
		//用于配置文件发布路径，如CDN或本地服务器
		publicPath:'/static/'
	},
	
	module:{
		//各种加载器，即让各种文件格式可用require引用
		loaders:[
			{
				test: /\.(js|jsx)$/,
				loader: 'babel',
				query:{
					presets:['es2015','react','stage-0']
				},
				include: __dirname,
				exclude:/(node_modules|bower_components)/
			},
			{
				test:/\.(gif|jpg|png)$/,
				loader:'url?limit=8192&name=images/[name].[hash].[ext]'
			},
			{
				test:/\.(woff|svg|eot|ttf|ico)$/,
				loader:'url?limit=50000&name=fonts/[name].[hash].[ext]'
			},
			{
				test:/\.less$/,
				loader: ExtractTextPlugin.extract("style-loader", "css-loader!less-loader")
			},
			{
				test:/\.css$/,
				loader:'style-loader!css-loader!postcss-loader'
			}
		]
	},
	plugins:[
		 new ExtractTextPlugin("[name].[hash:8].css"),
		//提供全局的变量，在模块中使用无需用require引入
		new webpack.ProvidePlugin({
    		}),
		//js文件的压缩
		new webpack.optimize.UglifyJsPlugin({ 
			compress: { 
				warnings: false 
			} 
		}),
			new webpack.optimize.CommonsChunkPlugin(/* chunkName= */"commons", /* filename= */"commons.js"),
    		new webpack.optimize.OccurenceOrderPlugin(),
    		new webpack.HotModuleReplacementPlugin(),
    		new webpack.NoErrorsPlugin()
	],
	resolve:{
		extensions:['','.js','.jsx'],
		alias:{
			services : path.join(__dirname,'./src/services'),
			fliters : path.join(__dirname,'./src/fliters'),
			directives : path.join(__dirname,'./src/directives'),
			modules : path.join(__dirname,'./src/modules')
		}
	},
	externals:{
    		"window" : "window"
  	},
  	postcss:function(){
  		return [precss,autoprefixer];
  	}
};
