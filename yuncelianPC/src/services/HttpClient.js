/**
 * HttpClient
 * 自定义POST/GET，兼容jQuery Post请求
 */

import app from 'app';
//import $ from 'jquery';
import './Toolkit';


export default	app.factory('HttpClient',['$http','Toolkit',function($http,Toolkit){
		$http.defaults.headers.common['X-TECHU-AUTH'] = Toolkit.getCookie("safeToken");
		return {
			post:function(url,data){
				var promise = $http({
					method :'POST',
					url:url,
					data:$.param(data),
					headers:{
						"Content-Type" : "application/x-www-form-urlencoded;charset=utf-8",
						transformRequest:function(data){
							/*if(angular.isDefined(data.data)){
								//依赖jQuery
								data.data = $.param(data.data);
								//return result;
							}*/
							return data;
						}
					}
				});
				promise.success(function(data){
						if(data.code==400){
							// var data = {
							// 		message:'登录已超时，请重新登录',
							// 		type:'ok'
							// };
							// $rootScope.$boardcast('alert',data);
							// $rootScope.$on('alertEvent',function(event){
							// 	window.location.href = "/account/login";
							// });
							if(window.confirm("登录已超时，请重新登录")){
								window.location.href = "/account/login";
							}
						}
          });
				return promise;
			},
			get : function(url,params){
				params = params || {};
				var promise = $http({
					method :'GET',
					url:url,
					params:params,
				});
				promise.success(function(data){
						if(data.code==400){
							// var data = {
							// 		message:'登录已超时，请重新登录',
							// 		type:'ok'
							// };
							// $scope.$emit('alert',data);
							// $scope.$on('alertEvent',function(event){
							// 	window.location.href = "/account/login";
							// });
							if(window.confirm("登录已超时，请重新登录")){
								window.location.href = "/account/login";
							}
						}
          });
				return promise;
			}
		};
	}]);
