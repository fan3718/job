

import app from 'app';
import './CacheService';
import './CryptoService';
import './Toolkit';
export default	app.factory('UserService',['$http','$q','CacheService','CryptoService','Toolkit',function($http,$q,CacheService,CryptoService,Toolkit){
        $http.defaults.headers.common['X-TECHU-AUTH'] = Toolkit.getCookie("safeToken");
		var prefix = '/user';
		var service = {
				/**
				 * 检测手机号码
				 */
				checkMobile:function(mobile){
					var defer = $q.defer();
					mobile = mobile ||'';
					$http.get(prefix+'/check/mobile?mobile='+mobile).success(function(result){
						if(result.code == 1){
							defer.resolve();
						}else{
							defer.reject(result.msg);
						}
					}).error(function(){
						defer.reject('网络发生故障');
					});
					return defer.promise;
				},
				/**
				 * 获取用户信息
				 */
				getUserInfo : function(){
					var defer = $q.defer();
					
					//var key = 'user-info';
					//var info = CacheService.get(key);
					
					//if(CacheService.isNull(info)){
						$http.get(prefix+'/info').success(function(result){
							if(result.code == 1){
								if('teacher' == result.info.role){
									result.info.mainSubject = result.info.subject[0];
								}
								var info = result.info;
								defer.resolve(info);
								//CacheService.put(key,info);
							}else{
								defer.reject(result.msg);
							}
						}).error(function(){
							defer.reject('网络发生故障');
						});
					//}else{
						//setTimeout(function(){
							//defer.resolve(info);
						//},0);
					//}
					
					return defer.promise;
				},
				/**
				 * 获取用户待办事项
				 */
				getUserSchedules:function(){
					var defer = $q.defer();
					$http.get(prefix+'/schedule').success(function(result){
						if(result.code == 1){
							defer.resolve(result.schedules);
						}else{
							defer.reject(result.msg);
						}
					}).error(function(){
						defer.reject('网络发生故障');
					});
					return defer.promise;
				},
				getClassZone:function(){
					var defer = $q.defer();
					$http.get(prefix+'/classzone').success(function(result){
						if(result.code == 1){
							defer.resolve(result.zones);
						}else{
							defer.reject(result.msg);
						}
					}).error(function(){
						defer.reject('网络发生故障');
					});
					return defer.promise;
				},
				/**
				 * 更新基本信息
				 */
				updateBasicInfo:function(nickname,gender,avatar){
					var defer = $q.defer();
					
					var params = {};
					
					params.nickname = nickname;
					params.gender = gender;
					params.avatar = avatar ;
					params.action='basic';
					
					$http.post(prefix+'/update',params).success(function(result){
						if(result.code == 1){
							defer.resolve();
						}else{
							defer.reject(result.msg);
						}
					}).error(function(){
						defer.reject('网络发生故障');
					});
					return defer.promise;					
				},
				/**
				 * 更新密码
				 */
				updatePassword:function(oldPwd,newPwd,confirmPwd){
					var defer = $q.defer();
					var promise = defer.promise;
					if(oldPwd==''){
						defer.reject("旧密码不能为空");
						return promise;
					}
					if(newPwd !=confirmPwd){
						defer.reject("两次密码不一致");
						return promise;
					}
					var params = {};
					params.oldPwd = oldPwd;
					params.newPwd = newPwd;
					params.confirmPwd = confirmPwd;
					params.action='password';
					$http.post(prefix+'/update',params).success(function(result){
						if(result.code == 1){
							defer.resolve();
						}else{
							defer.reject(result.msg);
						}
					}).error(function(){
						defer.reject('网络发生故障');
					});
					return defer.promise;					
				},
				checkPwd:function(pwd){
					var defer = $q.defer();
					var promise = defer.promise;
					if(pwd ==''){
						var result = {};
						result.code = -1,
						result.msg="密码为空";
						defer.reject(result);
					}
					var params = {};
					params.password = CryptoService.encrypt(pwd);;
					
					$http.post(prefix+'/check/pwd',params).success(function(result){
						if(result.code == 1){
							defer.resolve(result.isRight);
						}else{
							var res = {};
							res.code = 0,
							res.msg=result.msg;
							defer.reject(res);
						}
					}).error(function(){
						var res = {};
						res.code = 500,
						res.msg="网络发生故障";
						defer.reject(res);
					});
					return promise;
				},
				/**
				 * 更新用户手机信息
				 */
				updateMobile:function(phone,code,pwd){
					var defer = $q.defer();
					var promise = defer.promise;
	
					var params = {};
					params.mobile = phone;
					params.code = code;
					params.password = CryptoService.encrypt(pwd);
					params.action='phone';
					$http.post(prefix+'/update',params).success(function(result){
						if(result.code == 1){
							defer.resolve();
						}else{
							defer.reject(result.msg);
						}
					}).error(function(){
						defer.reject('网络出现故障');
					});
					
					return promise;
				},
				/**
				 * 信息补充
				 */
				supply:function(name,mobile,code){
					var defer = $q.defer();
					var params = {};
					params.name = name||'';
					params.mobile = mobile||'';
					params.code = code||'';
					$http.post('/user/supply',params).success(function(result){
						if(result.code == 1){
							defer.resolve(result.info);
						}else{
							defer.reject(result.msg);
						}
					}).error(function(){
						defer.reject('网络发生故障');
					});
					return defer.promise;
				},
				getSubject:function(){
					var defer = $q.defer();
					$http.get('/ajax/class/subjectList').success(function(result){

						if(result.code == 1){
							defer.resolve(result.subjectList);
						}else{
							defer.reject(result.msg);
						}
					}).error(function(){
						defer.reject('网络发生故障');
					});
					return defer.promise;
				},
                revokeToken:function(){
                    var defer = $q.defer();
                    var req={
                        method:'POST',
                        url:'/oauth/revoke_token',
                        headers:{
                            'Content-Type':'application/x-www-form-urlencoded'
                        }
                    }
                    $http(req).success(function(result){
                        var successCode = /^2/;
                        if(successCode.test(result.code)){
                            defer.resolve(result);
                        }else{
                            defer.reject(result);
                        }
                    }).error(function(){
                        defer.reject('网络发生故障');
                    })
                    return defer.promise;
                }

		};
		
		return service;
	}]);