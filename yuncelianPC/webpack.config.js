'use strict';

var webpack = require('webpack');
var path = require('path');
var precss       = require('precss');
var autoprefixer = require('autoprefixer');
let BowerWebpackPlugin = require('bower-webpack-plugin');

const args = require('minimist')(process.argv.slice(2));

let env;
if (args._.length > 0 && args._.indexOf('start') !== -1) {
	  env = 'test';
	} else if (args.env) {
	  env = args.env;
	} else {
	  env = 'dev';
}

let devtool = 'eval-source-map';

let entries = {
		'teacher-index':['./src/teacher_index.js'],
		'student-index':['./src/student-index.js']
};

let plugins = [];
//提供全局的变量，在模块中使用无需用require引入
plugins.push(new webpack.ProvidePlugin({
	//$:'jquery',
	//'jquery':'jquery',
	'window.jquery':'jquery',
	angular : 'angular',
	'window.angular' : 'angular',
	//'window.Swiper' : 'swiper',
	//'Swiper':'swiper'
	})
);
//js文件的压缩
plugins.push(new webpack.optimize.UglifyJsPlugin({ 
	compress: { 
		warnings: false 
	},output: {
        comments: false,  // remove all comments
    },
}));

plugins.push(new webpack.optimize.OccurenceOrderPlugin());
plugins.push(new webpack.NoErrorsPlugin());
plugins.push(new webpack.optimize.CommonsChunkPlugin(/* chunkName= */"commons", /* filename= */"commons.js"));

if(env =='dist'){
	devtool = 'source-map';
	plugins.push(new webpack.optimize.DedupePlugin());
	plugins.push(new webpack.DefinePlugin({
		'process.env.NODE_ENV': '"production"'
    }));
	plugins.push(new BowerWebpackPlugin({
		searchResolveModulesDirectories: false
    }));
	plugins.push(new webpack.optimize.AggressiveMergingPlugin());
}else{
	for(var key in entries){
		entries[key].unshift('webpack-hot-middleware/client');
	}
	plugins.push(new webpack.HotModuleReplacementPlugin());
}


module.exports = {
	//生成sourcemap,便于开发调试
	devtool : devtool,
	//获取项目入口js文件
	entry:entries,
	output:{
		//文件输出目录
		path:path.join(__dirname,'../../../../main/webapp/static'),
		//根据入口文件输出的对应多个文件名
		//filename:'teacher-index.[hash].js',
		filename:'[name].js',
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
				test:/\.(woff|svg|eot|ttf)$/,
				loader:'url?limit=50000&name=fonts/[name].[hash].[ext]'
			},
			{
				test:/\.swf$/,
				loader:'file?name=swf/[name].[hash].[ext]'
			},
			{
				test:/\.less$/,
				loader:'style-loader!css-loader!postcss-loader!less-loader'
			},
			{
				test:/\.css$/,
				loader:'style-loader!css-loader!postcss-loader'
			},{
				test:/.html$/,
				loader:'file?name=tpls/[name].[hash].[ext]'
				//loader:'html-loader'
			},
			{
				test:/\.htm$/,
				loader:'html-loader'
			}
		]
	},
	plugins:plugins,
	resolve:{
		extensions:['','.js','.jsx'],
		alias:{
			app : path.join(__dirname,'./src/app'),
			//angular :path.join(__dirname,'./lib/angular.min.js'),
			services : path.join(__dirname,'./src/services'),
			fliters : path.join(__dirname,'./src/fliters'),
			directives : path.join(__dirname,'./src/directives'),
			modules : path.join(__dirname,'./src/modules'),
			tpls : path.join(__dirname,'./src/tpls'),
			vendors : path.join(__dirname,'./src/vendors'),
			routers : path.join(__dirname,'./src/routers'),
			styles : path.join(__dirname,'./template/css'),
			styless : path.join(__dirname,'./template/css/web'),
		}
	},
	externals:{
    		"window" : "window",
    		"angular" : "angular",
    		//"swiper":"Swiper"
  	},
  	postcss:function(){
  		return [precss,autoprefixer];
  	}
};
