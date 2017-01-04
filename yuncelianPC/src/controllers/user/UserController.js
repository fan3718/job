import app from 'app';
import 'services/UserService'
import 'services/CryptoService'
import 'services/CacheService'
import 'services/Toolkit';
/**
 * 所有Controller的ROOT Controller
 */
export default  app.controller('UserController',['$scope','UserService','CacheService','$timeout','$interval','Toolkit',function($scope,UserService,CacheService,$timeout,$interval,Toolkit){

		$scope.showLoading = false;

		$scope.userInfo = {
				classes:[]
		};

		var LOGOUT_ACTION = 'logout';

		$scope.popMessage = {

		}
		var info = window.__INITIAL_USER__ ;

		if(info){
			if('teacher' == info.role){
				info.mainSubject = info.subject[0];
			}
			if(!info["avatar"] || info["avatar"] ==""){
				info["avatar"] = "/img/web/default-avatar.png";
			}

			$scope.userInfo=info;
			$scope.isUserLoaded = true;
			$timeout(function(){
				$scope.$broadcast('userinfo',info);
			},1000);
			generatorAssignMenu(info.stage, info.subject)
		}else{
			UserService.getUserInfo().then(function(info){
				if(!info["avatar"] || info["avatar"] ==""){
					info["avatar"] = "/img/web/default-avatar.png";
				}
				$scope.userInfo=info;
				$scope.isUserLoaded = true;

				console.info(info);


				$scope.$broadcast('userinfo',info);
			});
		}
		$scope.now = new Date().getTime();
		var _SERVER_TIME = window.__SERVER_TIME__ || new Date().getTime()
		//更新时间
		$interval(function(){
			_SERVER_TIME += 1000;
		},1000);
		//登出
		$scope.logout = function(){
			$scope.popMessage.message = "确定要退出当前账户吗?";
			$scope.popMessage.timeline = new Date().getTime();
			$scope.popMessage.type = 2;
			$scope.popMessage.action = LOGOUT_ACTION;
			//$scope.alert.message = "确定要退出当前账户吗?";
			//$scope.isShowLognoutBox = true;
		}

		$scope.action = function(isOk,data){
			if(isOk){
				if(data.action == LOGOUT_ACTION){
					//清除SessionStorage数据
                    UserService.revokeToken().then(function(result){
                        console.log(result);
                    });
                    //删除用户cookie
                    Toolkit.delCookie('09d50389ae1a656196acda03136e03a1');
                    window.sessionStorage.clear();
                    window.location.href="/account/logout";
				}else if(data.action == "ok"){
					return ;
				}else{
					$scope.$broadcast('alertEvent',data);
				}
			}

		}

		$scope.$on('alert',function(event,data){
			$scope.popMessage.message = data.message ||'参数配置错误';
			$scope.popMessage.timeline = new Date().getTime();
			$scope.popMessage.type = data.type || 1;
			$scope.popMessage.action =data.action || 'none';
		});


		$scope.$on('loading',function(event,data){
			data = data || 'show';
			$scope.showLoading  = data ==='show';
		});


		/**
		 * 更新班级数据
		 * @param data
		 * <pre>
		 * {
		 * 	action:'', //delete,update,add
		 *
		 *
		 * }
		 * </pre>
		 */
		$scope.$on('updateClass',function(event,data){
			var action =data.action;
			if('add' == action){
				$scope.userInfo.classes.push.apply($scope.userInfo.classes,data.classes);
			}else if('update' == action){
				var clazz = data.clazz;
				angular.forEach($scope.userInfo.classes,function(cls){

					if(cls.classId == clazz.id){
						cls.stuCount = clazz.studentSize;
					}
				});
			}
			CacheService.put('user-info',$scope.userInfo);
		});

		$scope.isDefined = function(object){
			return typeof(object)!='undefined' && object!=null;
		}

		$scope.locationInfo = function () {
			window.location = '/user/center' ;
		}


		function generatorAssignMenu(states,subjects){
			var ret =  '' ;

			return ret ;
		}


	}]);
