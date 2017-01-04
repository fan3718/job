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
	urlArgs: "r=1.0.6",
	baseUrl:'/js/app',
	paths : {
		jquery : jquery,
		angular:angular,
		jqueryLayer:'vendors/layer-v2.2/layer/layer',
		progressbar : progressbar,
		UserService:'services/UserService',
		HttpClient:'services/HttpClient',
		AudioService:'services/AudioService',
		CacheService:'services/CacheService',
		VideoHelper:'services/VideoHelper',
		md5:'https://staticfile.qnssl.com/crypto-js/3.1.2/rollups/md5',
		CryptoService:'services/CryptoService',
		AuthCodeService:'services/AuthCodeService',
		ExamService:'services/ExamService',
		ReportService:'services/ReportService',
		MaterialService:'services/MaterialService',
		ResourceService:'services/ResourceService',
		Filter:'filters/Filters',
		app : 'app',
		Toolkit:'services/Toolkit',
		UserController:'modules/UserController',
		//UserCenterController:'modules/UserCenterController',
		directives:'directives/directives',
		ResourceController:'modules/teacher/ResourceController',
		ngPagination:'directives/ng-pagination',
		ngProgressBar:ngProgressbar,
		'ngFileUpload':['vendors/ng-file-upload.min'],
		'ngFileUploadShim':['vendors/ng-file-upload-shim.min'],
	},
	shim : {
		angular : {
			exports : 'angular',
			deps:[
					'jquery'
			]
		},
		'ngFileUploadShim': {
			exports : 'ngFileUploadShim',
			deps:[
					'angular'
			]
		},
		ngFileUpload:{
			exports : 'ngFileUpload',
			deps:[
					'ngFileUploadShim'
			]
		},
		jqueryLayer:{
　　　　　deps: ['jquery'],
　　　　  exports: 'jQuery.fn.layer'
　　　　}
	}
});



require(['jquery','angular','ngFileUpload','UserController','ngPagination','ResourceService','jqueryLayer','ResourceController'],function($,angular){
	// boot angular framework
	angular.bootstrap(document,["app",'ngFileUpload']);
});