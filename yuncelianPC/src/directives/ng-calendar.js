import app from 'app';

import 'vendors/jquery.calendar';
import 'vendors/jquery.timepick';

import 'styless/calendar.less';
	
app.directive('ngCalendar',[function(){
		return {
			restrict:'A',
			require:'ngModel',
			link:function(scope,element,attrs,ctrl){
				element.calendar({
					format:'yyyy/MM/dd',
					onPicked:function(value){
						ctrl.$setViewValue(value);
					}
				});
			}
		};
	}]);
	
	app.directive('ngTimepick',[function(){
		return {
			restrict:'A',
			require:'ngModel',
			link:function(scope,element,attrs,ctrl){
				element.TimePick({
					onChanged:function(value){
						ctrl.$setViewValue(value);
					}
		        });
			}
		};
	}]);
