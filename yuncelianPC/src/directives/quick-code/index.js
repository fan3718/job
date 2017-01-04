import app from 'app';

export default app.directive('quickCode',['$parse',function($parse){
		return {
			restrict:'A',
			template:require('./quick-code.htm'),
			replace:true,
			link:function(scope, element, attrs,ngModel){
				scope.isShowQuickCodeTip = false;
			}
		}
	}]);