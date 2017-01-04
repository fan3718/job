import app from 'app';


// 弹窗指令
export default app.directive('blank',[function(){
		return {
			restrict:'E',
			template:'<span class="blank" style="display: inline-block;width: 0.5em;"></span>',
			replace:true,
			link:function(scope, element, attrs){
				
			}
		}
	}]);