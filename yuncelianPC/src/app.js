import 'ng-file-upload';
import ngInfiniteScroll from 'ng-infinite-scroll';
import 'angular-ui-router';

var app = angular.module('app',['ngFileUpload','ui.router',ngInfiniteScroll]);

app.config(['$httpProvider', function($httpProvider) {
	if (!$httpProvider.defaults.headers.get) {
		$httpProvider.defaults.headers.get = {};
	}
	if (!!window.ActiveXObject||"ActiveXObject" in window){
		$httpProvider.defaults.headers.get['If-Modified-Since'] = 'Mon, 26 Jul 1997 05:00:00 GMT';
		// extra
		$httpProvider.defaults.headers.get['Cache-Control'] = 'no-cache';
		$httpProvider.defaults.headers.get['Pragma'] = 'no-cache';
	}
}]);


module.exports =  app;