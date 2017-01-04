/**
* 教学资源
*/
var progressbar=[];
var ngProgressbar="";
if(document.createElementNS){
    progressbar=['https://cdn.bootcss.com/progressbar.js/0.9.0/progressbar.min','vendors/progressbar'];
    ngProgressbar='directives/ng-progressbar';
}
var jquery=['https://staticfile.qnssl.com/jquery/2.1.4/jquery.min','https://cdn.bootcss.com/jquery/2.1.4/jquery.min','/js/jquery-1.9.1.min'];
var angular=['https://cdn.bootcss.com/angular.js/1.4.7/angular'];
if(window._verBrower=="IE 8.0"){
    jquery=['https://staticfile.qnssl.com/jquery/1.8.3/jquery.min'];
    angular=['https://cdn.bootcss.com/angular.js/1.2.28/angular'];
}
require.config({
	//urlArgs: "r=" + (new Date()).getTime(),
	urlArgs: "r=1.0.7",
	baseUrl:'/js/app',
	paths : {
		jquery : jquery,
		treeview: 'vendors/jquery.treeview',
		lazyload : 'vendors/lazyload',
		md5:'https://staticfile.qnssl.com/crypto-js/3.1.2/rollups/md5',
		jqueryLayer:'vendors/layer-v2.2/layer/layer',
		CryptoService:'services/CryptoService',
		AuthCodeService:'services/AuthCodeService',
		angular:angular,
		progressbar :progressbar,
		UserService:'services/UserService',
		HttpClient:'services/HttpClient',
		AudioService:'services/AudioService',
		ExerciseService:'services/ExerciseService',
		MaterialService:'services/MaterialService',
		CacheService:'services/CacheService',
		ExamService:'services/ExamService',
		ReportService:'services/ReportService',
		ResourceService:'services/ResourceService',
		Filter:'filters/Filters',
		app : 'app',
		Toolkit:'services/Toolkit',
		UserController:'modules/UserController',
		ResourceController:'modules/teacher/ResourceController',
		directives:'directives/directives',
		VideoHelper:'services/VideoHelper',
		ngPagination:'directives/ng-pagination'
	},
	shim : {
		angular : {
			exports : 'angular',
			deps:[
					'jquery'
			]
		},
		lazyload:{
			exports : 'lazyload',
			deps:[
					'angular'
			]
		},
		treeview:{
			exports : 'treeview',
			deps:[
					'jquery'
			]
		},
		jqueryLayer:{
　　　　　deps: ['jquery'],
　　　　  exports: 'jQuery.fn.layer'
　　　　}
		/*progressbar : {
			exports : 'progressbar',
			deps:[
				'jquery'
			]
		}*/
	}
});



require(['jquery','angular','UserController','lazyload','ResourceController','jqueryLayer','ngPagination'],function($,angular){
	// boot angular framework
	angular.bootstrap(document,["app",'lazyload']);
});