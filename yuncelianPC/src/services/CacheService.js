/**
 * 缓存服务(支持存储到sessionStorage)
 */

import app from 'app';


export default app.factory('CacheService',['$cacheFactory','$log',function($cacheFactory,$log){
		
		/**
		 * 浏览器是否支持Html5
		 */
		//var isHtml5Model = angular.isDefined(window.sessionStorage);
		/**
		 * sessionStorage
		 */
		var storage = window.sessionStorage; 
		/**
		 * localStorage
		 */
		var lstorage = window.localStorage;
		
		var cache = $cacheFactory('sessionCache');
		
		function isHtml5Mode(){
			return angular.isDefined(window.sessionStorage);
		}
		
		var service = {
				put : function(key,value,isMemory){
					if(angular.isUndefined(isMemory)){
						isMemory = true;
					}
					if(angular.isDefined(key)&&angular.isDefined(value) && value != null){
						cache.put(key,value);
						if(isHtml5Mode() && !isMemory){
							var result = angular.toJson(value);
							storage.setItem(key,result);
							//$log.debug("Save Cache To SessionStorage:key:"+key+"\tvalue:"+result);
						}
					}
				},
				get : function(key,isMemory){
					if(angular.isUndefined(isMemory)){
						isMemory = true;
					}
					var result = cache.get(key);
					if(angular.isUndefined(result)  && !!isMemory ){
						if(isHtml5Mode()){
							result = storage.getItem(key);
							//$log.debug("Load Cache From SessionStorage:key:"+key+"\t value:"+result);
							result = JSON.parse(result);
							if(result!=null && angular.isDefined(result)){
								cache.put(key,result);
							}
						}
					}
					return result;
				},
				remove:function(key){
					if(isHtml5Mode()){
						storage.removeItem(key);
					}
				},
				isNull : function(param){
					return param==null || angular.isUndefined(param);
				}
		};
		return service;
	}]);
