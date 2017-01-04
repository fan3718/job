
import app from 'app';
import './HttpClient';
import './Toolkit';

	/**
	 * 验证码服务
	 */
export default app.factory('AuthCodeService',['$q','HttpClient','Toolkit',function($q,HttpClient,Toolkit){

		var service = {
				check : function (phone,checkcode){
					var defer = $q.defer();
					var promise = defer.promise;
					HttpClient.post('/authcode/sms/check',{
						'number':phone,
						'code':checkcode
					}).success(function(result){
						if(result.code == 1){
							defer.resolve(checkcode);
						}else{
							defer.reject(result.msg);
						}
					}).error(function(){
						defer.reject('内部错误');
					});
					return promise;
				},
				/**
				 * action：findpwd/regist
				 */
				send : function(action,phone){
					var defer = $q.defer();
					var promise = defer.promise;
					
					if(Toolkit.trim(phone) == ''){
						defer.reject('手机号码不能为空！');
						return promise;
					}
					
					if(!Toolkit.isMobile(phone)){
						defer.reject('手机号码格式不对');
						return promise;
			        }
					HttpClient.post("/authcode/"+action+"/send",{
						'p':phone
					}).success(function(data){
						if (data.code == 1) {
							defer.resolve();
						}else{
							defer.reject(data.msg);
						}
					}).error(function(){
						defer.reject('内部错误');
					});
					return promise;
				},
				checkImageCode:function(code){
					var defer = $q.defer();
					var promise = defer.promise;
					HttpClient.post("/wap/account/checkVerifyCode",{
						'code':code
					}).success(function(data){
						if (data.code == 1) {
							defer.resolve();
						}else{
							defer.reject(data.msg);
						}
					}).error(function(){
						defer.reject('内部错误');
					});
					return promise;
				}
		};
		return service;
	}]);
	
