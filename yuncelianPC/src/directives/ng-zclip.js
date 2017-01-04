define(['app','jquery','zclip'],function(app){
	'use strict';
	
	app.directive('ngZclip',['$timeout',function($timeout){
		return {
			restrict: 'AC',
			scope:{
				ngZclip:'@'
			},
			link :  function (scope, element, attrs){
					$timeout(function(){
						//elment必须要显示才能生效
						element.zclip({
							path:'/js/app/vendors/zclip/ZeroClipboard.swf',
							copy:function(){
								return  $(scope.ngZclip).text();
							},
							beforeCopy:function(){
								console.log('准备复制');
							},
							afterCopy:function(){
								alert("该地址已经复制，你可以使用Ctrl+V 粘贴。");
							}
						});
					},0);
			}
		};
	}]);
});