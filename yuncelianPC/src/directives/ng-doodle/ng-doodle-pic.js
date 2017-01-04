import app  from 'app';

export default app.directive('ngDoodlePic',['$timeout',function($timeout){
		return {
			restrict: 'A',
			require:'^ngDoodleView',
			link: function(scope, element, attrs,doodle) {
				$timeout(function(){
					var height = element.height();
					if(height <=0){
						var img = new Image();
						img.src = element.attr('src');
						img.onload = function(){
							height = element.height();
							doodle.addImage(element.attr('src'),height);
						}
					}else{
						//通知doodle 加载图片
						doodle.addImage(element.attr('src'),height);
					}
				},0);
			}
		}
}]);
