import app from 'app';

export default app.directive('slide',['$timeout',function($timeout){
        return {
            restrict: 'EA',
            require: '^swiper',
            /*
			 * scope:{ needSlide:'@' },
			 */
            template: require('./slider.htm'),
            replace: true,
            transclude: true,
            link: function(scope, elem, attrs, swiper) {
               /*
				 * var needSlide = scope.needSlide == 'false'?false:true; if(
				 * window._verBrower=="IE 8.0"){ $timeout(function(){
				 * swiper.addSlide(elem.html(), needSlide,function() {
				 * 
				 * }); }) }else{ swiper.addSlide(elem, needSlide,function() {
				 * 
				 * }); }
				 */
                if(scope.$last){
                    swiper.onRepeatFinish();
                }
            }
        };
    }]);