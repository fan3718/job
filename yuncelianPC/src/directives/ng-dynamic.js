
import app from 'app';

export default app.directive('ngDynamic',['$parse','$timeout','$interval',function($parse,$timeout,$interval){
		return {
			restrict: 'AC',
			link: function (scope, elem, attrs) {
				$timeout(function(){
					if(scope.$last){
						var parent = elem.parent();
						var ph = parent.height();
						var items = parent.find('.news-item');
						var length=items.length;
						var totalHeight = 0;
						items.each(function(){
							totalHeight += $(this).outerHeight(true);
						});
						var i =length-1;
						if(totalHeight >=ph){
							$interval(function(){
								if(i<0){
									i=length-1;
									items.remove();
									items = parent.find('.news-item-copy');
									items.removeClass('news-item-copy');
								}
								var clone = items.eq(i).clone(true);
								clone.addClass('news-item-copy');
								clone.hide();
								parent.prepend(clone);
								clone.slideDown(500).fadeIn(500);
								i--;
							},2000);
						}
					}
				});
			}
		}
	}]);
	