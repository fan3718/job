
import app from 'app';
import 'services/UserService';
import 'services/AuthCodeService';
import 'services/Toolkit';

/**
	 * 补充信息
	 */
export default app.controller('SupplyController',['$scope','$interval','Toolkit','AuthCodeService','UserService',function($scope,$interval,Toolkit,AuthCodeService,UserService){
		//$scope.userInfo  =null;
		
		$scope.editNameMode = 1;
		
		$scope.editMobileModel = 1;
		var IMAGE_URL = '/wap/account/getVerifyImage';
		
		$scope.form = {
				name:$scope.userInfo.nickName,
				mobile:'',
				imgCode:'',
				mobileCode:''
		};
		
		
		$scope.$on('userinfo',function(event,info){
			//$scope.userInfo = info;
			//$scope.userInfo.isSupplied = true;
			//$scope.form.name=$scope.userInfo.nickName;
			
		});
		
		$scope.eidtName = function($event){
			$scope.editNameMode = 2;
			$event.stopPropagation();
		}
		$scope.inputClick = function($event){
			$event.stopPropagation();
		}
        $scope.nickInputClick = function($event){
            $event.stopPropagation();
            $scope.form.name = "";
        }
		$scope.eidtMobile = function($event){
			$scope.editMobileModel = 2;
		}
		
		$scope.checkName = function(){
			$scope.editNameMode = 1;
		}
		
		$scope.reset = function(){
			if($scope.nameRight){
				//$scope.editNameMode = 1;
			}
		}
		$scope.imgUrl = IMAGE_URL;
		
		$scope.verify = {
				
		};
		$scope.frozen = false;
		$scope.btnText ='获取验证码';
		$scope.resetImage = function(){
			var now = new Date();
			$scope.imgUrl = IMAGE_URL+'?'+'r='+now.getTime();
			$scope.imageChecked = false;
		}
		var timer = null;
		var MAX_SECOND = 60;
		var second = MAX_SECOND;
		$scope.sendCode = function(){
			if($scope.frozen){
				return;
			}
			if(!$scope.mobileChecked||!$scope.mobileRight){
				return;
			}
			if($scope.imageChecked&&$scope.imageRight){
				$scope.frozen = true;
				$scope.btnText ='重试('+second+'s)';
				timer =  $interval(function(){
					second--;
					if(second<=0){
						$scope.frozen = false;
						$scope.btnText ='获取验证码';
						$interval.cancel(timer);
						second = MAX_SECOND;
						timer = null;
					}else{
						$scope.btnText ='重试('+second+'s)';
					}
				},1000);
				
				AuthCodeService.send('regist',$scope.form.mobile).then(function(){
					//$scope.resetImage();
				},function(msg){
					$scope.resetImage();
				});
				
			}
		}
		
		$scope.checkMobile = function(needCheck){
			$scope.mobileRight = false;
			$scope.mobileChecked = false;
			$scope.mobileError = false;
			//验证手机号码
			if(!Toolkit.isMobile($scope.form.mobile) || $scope.userInfo.mobile == $scope.form.mobile){
				$scope.mobileRight = false;
				$scope.mobileChecked = true;
				$scope.mobileError = true;
			}else{
				$scope.mobileChecked = true;
				$scope.mobileRight = true;
				$scope.mobileError = false;
				if(!!needCheck){
					UserService.checkMobile($scope.form.mobile).then(function(){
						$scope.mobileChecked = true;
						$scope.mobileRight = true;
						$scope.mobileError = false;
					},function(){
						$scope.mobileRight = false;
						$scope.mobileChecked = true;
						$scope.mobileError = true;
					});
				}
			}
		}
		$scope.checkImageCode = function(isSimple){
			var imgCode = Toolkit.trim($scope.form.imgCode);
			var len = imgCode.length;
			if(isSimple){
				if(len<4){
					if(len==0){
						$scope.emptyImage = true;
						$scope.imageCodeError = true;
					}else{
						$scope.imageCodeError = true;
						$scope.emptyImage = false;
						$scope.imageChecked = true;
						$scope.imageRight = false;
					}
					return;
				}
				return;
			}
			
			$scope.imageChecked = false;
			$scope.emptyImage = false;
			$scope.imageCodeError = false;
			if(len<4){
					if(len==0){
						$scope.emptyImage = true;
						$scope.imageCodeError = true;
					}else{
						$scope.imageCodeError = true;
						$scope.emptyImage = false;
						$scope.imageChecked = true;
						$scope.imageRight = false;
					}
					return;
			}
			
			AuthCodeService.checkImageCode(imgCode).then(function(){
				$scope.imageChecked = true;
				$scope.imageRight = true;
				$scope.imageCodeError = false;
			},function(){
				$scope.imageCodeError = true;
				$scope.imageChecked = true;
				$scope.imageRight = false;
			});
		}
		
		
		$scope.checkMobileCode = function(isSimple,isBlur){
			var code = Toolkit.trim($scope.form.mobileCode);
			if(isBlur && code==''){
				return;
			}
			var len = code.length;
			if(isSimple){
				if(len<6){
					$scope.codeChecked = true;
					$scope.codeError = true;
					$scope.codeRight = false;
					return;
				}
				return;
			}
			
			$scope.codeChecked = false;
			$scope.codeRight = false;
			$scope.codeError = false;
			if(len<6){
				$scope.codeChecked = true;
				$scope.codeError = true;
				$scope.codeRight = false;
				return;
			}
			AuthCodeService.check($scope.form.mobile,code).then(function(){
				$scope.codeChecked = true;
				$scope.codeError = false;
				$scope.codeRight = true;
			},function(){
				$scope.codeChecked = true;
				$scope.codeError = true;
				$scope.codeRight = false;
			});
		}
		$scope.nameRight = false;
		$scope.nameError = false;
		$scope.nameChecked = false;
		$scope.checkName = function(){
			$scope.nameRight = false;
			$scope.nameError = false;
			$scope.nameChecked = true;
			if(Toolkit.trim($scope.form.name)==''){
				$scope.nameRight = false;
				$scope.nameError = true;
			}else{
				$scope.nameRight = true;
				$scope.nameError = false;
			}
		}
		$scope.supply = function(){
			$scope.checkName();
			if(!$scope.nameRight){
				return;
			}
			if($scope.editMobileModel == 2){
				$scope.checkMobile(false);
				$scope.checkImageCode(true);
				$scope.checkMobileCode(true);
				if(!$scope.codeRight || !$scope.imageRight ||!$scope.mobileRight ){
					if(!$scope.codeRight){
						AuthCodeService.check($scope.form.mobile,$scope.form.mobileCode).then(function(){
							$scope.codeChecked = true;
							$scope.codeError = false;
							$scope.codeRight = true;
							supply();
						},function(){
							$scope.codeChecked = true;
							$scope.codeError = true;
							$scope.codeRight = false;
						});
					}
					return;
				}
			}
			supply();
		}
		$scope.cancel = function(){
		    $scope.userInfo.isSupplied = 1;
		}
		function supply(){
			UserService.supply($scope.form.name,$scope.form.mobile,$scope.form.mobileCode).then(function(info){
				//广播
				$scope.userInfo.nickName = info.nickName;
				$scope.userInfo.mobile = info.mobile;
				$scope.userInfo.isSupplied = info.isSupplied;
				
			},function(msg){
                var data = {
                        message:msg
                    };
                    $scope.$emit('alert',data);
			});
		}
	}]);