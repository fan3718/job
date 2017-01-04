
import app from 'app';
import md5 from 'md5';


export default app.factory('CryptoService',[function(){
		var salt = 'cloud_homework-';
		var encryptMD5=function(data){
			var saltData = salt + data;
		    var hash = md5(saltData);
		    return hash;
		}
		return {
			encrypt:function(data) {
		        return encryptMD5(data);
		    }
		};
}]);




