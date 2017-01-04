import app from 'app';


// 弹窗指令
export default app.directive('maskBox',[function(){
		return {
			restrict:'A',
			template:require('./mask-box.htm'),
			replace:true,
			scope:{
				maskBox:'=',
				popAction:'='
			},
			link:function(scope, element, attrs,ngModel){
				scope.isShowTipBox = false;
				scope.maskBox= scope.maskBox ||{};
				scope.$watch('maskBox.timeline',function(newValue,oldValue){
					if(newValue !=oldValue){
						scope.isShowTipBox = true;
					}
				});
				scope.showTip = function(isOk){
					scope.isShowTipBox = false;
					if(typeof(scope.popAction) == 'function'){
						scope.popAction(isOk,scope.maskBox);
					}
				}
			}
		}
	}]);