import app from 'app';


// 弹窗指令
export default app.directive('tab',[function(){
		return {
			restrict:'E',
			template:'<span class="tab" style="display: inline-block;min-width: 2em;text-align: center;"></span>',
			replace:true,
			link:function(scope, element, attrs){
				
			}
		}
	}]);