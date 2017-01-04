
import app from 'app';



define(['app','jquery','qrcode'],function(app){
	'use strict';
	/**
	 * 二维码生成指令
	 */
	app.directive('ngQrcode',[function(){
		/**
		 * 测试中文
		 */
		function toUtf8(str) {   
		    var out, i, len, c;   
		    out = "";   
		    len = str.length;   
		    for(i = 0; i < len; i++) {   
		    	c = str.charCodeAt(i);   
		    	if ((c >= 0x0001) && (c <= 0x007F)) {   
		        	out += str.charAt(i);   
		    	} else if (c > 0x07FF) {   
		        	out += String.fromCharCode(0xE0 | ((c >> 12) & 0x0F));   
		        	out += String.fromCharCode(0x80 | ((c >>  6) & 0x3F));   
		        	out += String.fromCharCode(0x80 | ((c >>  0) & 0x3F));   
		    	} else {   
		        	out += String.fromCharCode(0xC0 | ((c >>  6) & 0x1F));   
		        	out += String.fromCharCode(0x80 | ((c >>  0) & 0x3F));   
		    	}   
		    }   
		    return out;   
		}  

		return {
			restrict: 'AC',
			scope:{
				render:'@', // canvas or table
				text:'=',
				width:'@',
				height:'@'
			},
			link :  function (scope, element, attrs){
				var width = scope.width || 160;
				var height = scope.height || 160;
				var render = scope.render || 'canvas';
				initQrcode(scope.text);
				function initQrcode(text){
					text = text || '';
					$(element).qrcode({
						'render': render,
						'width': width,
						'height':height,
						'text': toUtf8(text)
					});
				}
				scope.$watch('text',function(newValue,oldValue){
					if(newValue !=oldValue){
						$(element).empty();
						initQrcode(newValue);
					}
				});
			}
		};
	}]);
	
	
	
});