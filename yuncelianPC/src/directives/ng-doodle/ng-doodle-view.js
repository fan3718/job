import app from 'app';
export default app.directive('ngDoodleView',['$timeout',function($timeout){
		return {
			restrict: 'A',
			controller:function(){
				var _doodle = null;
				var imageInfo = null;
				this.setDoodle = function(doodle){
					_doodle = doodle;
					if(imageInfo!=null){
						_doodle.setImageUrl(imageInfo.url,imageInfo.height);
					}
					
				}
				this.addImage = function(url,height){
					if(_doodle!=null){
						_doodle.setImageUrl(url,height);
					}else{
						imageInfo = {};
						imageInfo.url = url;
						imageInfo.height = height;
					}
				}

			}
		}
	}]);