import app from 'app';

app.config(['$stateProvider','$urlRouterProvider',function($stateProvider, $urlRouterProvider){
	
	$stateProvider.state('step1',{
	 	url:'/step1',
	 	templateUrl:require('tpls/class/create/first.html'),
 	})
 	.state('step2',{
		url:'/step2',
		templateUrl:require('tpls/class/create/second.html'),
 	})
 	.state('step3',{
		url:'/step3',
		templateUrl:require('tpls/class/create/third.html'),
 	})
 	.state('step4',{
		url:'/step4',
		templateUrl:require('tpls/class/create/forth.html'),
 	})
 	.state('step5',{
		url:'/step3-1',
		templateUrl:require('tpls/class/create/join.html'),
 	});
	
	$urlRouterProvider.otherwise('/step1');     //匹配所有不在上面的路由

}]);