import app from 'app';

import 'services/CacheService';
import 'services/AuthCodeService';
import 'services/Toolkit';
import 'ng-file-upload';

export default app.controller("UpdateController",['$scope','$interval','CacheService','UserService','AuthCodeService','Toolkit','Upload',function($scope,$interval,CacheService,UserService,AuthCodeService,Toolkit,Upload){
		
		$scope.isEditMode = false;
	
		$scope.showAnswer = false;

		$scope.avatar='' ;
		

		$scope.edit = function(){
			$scope.isEditMode = true;
		}
		
		$scope.form = {
				
		};
		
		$scope.account = {};
		
		$scope.save = function(){
			
			UserService.updateBasicInfo($scope.form.nickname,$scope.form.gender,$scope.avatar).then(function(){
				$scope.isEditMode = false;
				$scope.userInfo.nickName = $scope.form.nickname;
				$scope.userInfo.gender=$scope.form.gender;
				$scope.userInfo.avatar = $scope.avatar ;
			},function(msg){
				
			});
			
			
		}
		
		$scope.$on('userinfo',function(event,info){
			$scope.avatar = info["avatar"] || '/img/web/default-avatar.png' ;
			$scope.form.nickname = info.nickName;
			$scope.form.gender = info.gender==0?1:info.gender;
		});
		
		
		$scope.updatePassword = function(){
			if(!!!$scope.form.oldPwdError){
				UserService.updatePassword($scope.form.oldPwd,$scope.form.newPwd,$scope.form.confirmPwd).then(function(result){
                    var data = {
                        message:'密码修改成功!',
                        action:'modify-password'
                    };
                    $scope.$emit('alert',data);
				},function(msg){
                    var data = {
                        message:msg
                    };
                    $scope.$emit('alert',data);
				});
			}
		}
        $scope.$on('alertEvent',function(event,data){
            if(data.action == 'modify-password'){
                window.location.href="/user/account";
            }
        });
		$scope.updatePhone = function(){
			
			UserService.updateMobile($scope.account.phone,$scope.account.code,$scope.account.pwd).then(function(result){
				window.location.href="/user/account";
			},function(msg){
				alert(msg);
			});
			
		}
		
		$scope.checkOldPwd = function(){
			//checkOldPwd();
		}
		
		
		function checkOldPwd(){
			$scope.form.oldPwdIconShow = true;
			$scope.form.oldPwdError = false;
		}
		
		$scope.$watch("form.oldPwd",function(newValue){
			if(angular.isDefined(newValue)&&newValue.length>=6){
				checkOldPwd();
			}else{
				$scope.form.oldPwdIconShow = false;
				$scope.form.oldPwdError = true;
			}
		});
		
		$scope.$watch("form.confirmPwd",function(newValue){
			if(!angular.isDefined(newValue) || newValue.length==0){
				$scope.form.confirmPwdIconShow = false;
				$scope.form.confirmPwdError = true;
				return;
			}
			if(newValue!=$scope.form.newPwd){
				$scope.form.confirmPwdIconShow = true;
				$scope.form.confirmPwdError = true;
			}else{
				if(angular.isDefined(newValue)){
					$scope.form.confirmPwdIconShow = true;
					$scope.form.confirmPwdError = false;	
				}
			}
		});
		
		$scope.$watch("form.newPwd",function(newValue){
			if(!angular.isDefined(newValue) || newValue.length==0){
				$scope.form.newPwdIconShow = false;
				$scope.form.newPwdError = true;
				return;
			}
			if(newValue.length<6){
				$scope.form.newPwdIconShow = true;
				$scope.form.newPwdError = true;
			}else{
				$scope.form.newPwdIconShow = true;
				$scope.form.newPwdError = false;	
			}
		});
		
		
		
		$scope.$watch('account.phone',function(newValue){
			
			if(angular.isDefined(newValue)){
				if(Toolkit.isMobile(Toolkit.trim(newValue))){
					$scope.codeMsg = "" ;
					$scope.account.isFrozen = false;
					$scope.account.isMobile = true;	
				}else{
					$scope.account.isMobile = false;	
				}
			}else{
				$scope.account.isMobile = false;	
			}
		});
		
		
		var timer = null;
		
		var FROZEN_TIME = 60;
		
		var  second = FROZEN_TIME;
		
		$scope.frozenTime = FROZEN_TIME;
		$scope.codeMsg = "";
		/**
		 * 发送验证码
		 */
		$scope.sendCode = function(){
			if($scope.account.isMobile && !$scope.account.isFrozen){
				$scope.account.isFrozen = true;
				
				timer =  $interval(function(){
					second--;
					$scope.frozenTime = second;
					if(second<=0){
						$scope.account.isFrozen = false;
						$interval.cancel(timer);
						second = FROZEN_TIME;
						$scope.frozenTime = second;
					}
			    }, 1000);
				
				AuthCodeService.send('regist',$scope.account.phone).then(function(result){
					$scope.codeMsg = "" ;
				},function(msg){
					$interval.cancel(timer);
					$scope.account.isFrozen = true;
					$scope.codeMsg = msg ;
				});
			}
		}
		/**
		 * 验证码验证
		 */
		$scope.$watch('account.code',function(newValue){
			if(angular.isDefined(newValue)&&newValue.length==6 && $scope.account.isMobile){
				AuthCodeService.check($scope.account.phone,newValue).then(function(code){
					$scope.account.isValidateCode = true;
				},function(){
					$scope.account.isValidateCode = false;
				});
			}else{
				$scope.account.isValidateCode = false;
			}
		});
		
		$scope.saveAccount = function(){
			
			if(Toolkit.trim($scope.account.pwd).length<6){
				var data = {
						message:'密码长度必须大于6位',
				};
				$scope.$emit('alert',data);
				return;
			}
			
			if(!$scope.account.isValidateCode){
				var data = {
						message:'验证码错误',
				};
				$scope.$emit('alert',data);
				return;
			}
			
			UserService.updateMobile(scope.account.phone,scope.account.code,scope.account.pwd).then(function(){
				window.location.href="/user/center";
			},function(msg){
				alert(msg);
			});
			
			
		}
		
		$scope.editAccount = function(action){
			if('account' == action){
				window.location.href="/user/update/account";
			}else if('password' == action){
				window.location.href="/user/update/pwd";
			}
		}
		
		$scope.leftNav = function(action){
			if('center' == action){
				window.location.href="/user/center";
			}else if('account' == action){
				window.location.href="/user/account";
			}else if("favor" == action){
				window.location.href="/user/paperFavor";
			}else if("download" == action){
				window.location.href="/teacher/downloadRecords";
			}
		}
	
		/**
		*	上传头像
		*/
		$scope.upload = function (file) {
	        var upload=Upload.upload({
	            method: 'POST',
	            url: '/upload/img',
	            data: {file: file}
	        }).then(function (resp) {
	        	var result = resp.data;
	        	if(result.code == 1){
	        		$scope.avatar = result.url ;
	        	}else{
	        		alert(result.msg);
	        	}
	        }, function (resp) {
	        	
	        }, function (evt) {
	        });
	    };


	}]);