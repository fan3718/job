/*;(function (factory) {
    if (typeof define === "function" && define.amd) {
        // AMD模式
        define([ "jquery" ], factory);
    } else {
        // 全局模式
        factory(jQuery);
    }
}(function (jQuery) {

*/
jQuery.fn.extend({
	TimePick : function  (options) {
		

		options = jQuery.extend({
			onChanged:function(newValue){
				
			}
		},options);



		var _input;

		if($(this).hasClass('timepick-input') && $(this).is('input')){
			_input = $(this);
		}else{
			_input = $(this).find('.timepick-input');
		}

		var now = new Date();

		var nowTime = formatNumber(now.getHours())+":"+formatNumber(now.getMinutes());
		var val = _input.val();
		if(val==''){
			_input.val(nowTime);
		}
		
		var mPos = -1;

		var keydownCount = 0;

		_input.on('click',function(){
			keydownCount = 0;
			mPos=getPosition($(this)[0]);
			if(mPos<=2){
				setSelection($(this)[0],0,2);
			}else{
				setSelection($(this)[0],3,5);
			}
		}).on('keydown',function(event){
			var code = event.keyCode;
			var val = $(this).val();
			if(code >=48 && code<=57){
					keydownCount ++;
					var result = val;
					if(mPos>2){
						var before = val.substring(0,3);
						var first = val.substring(3,4);
						var second = val.substring(4,5);
						if(keydownCount %2 ==1){
							if(code-48<=5){
								result = before+(code-48)+second;
							}
						}else{
							result = before+first+(code-48);
						}

						$(this).val(result);
						setSelection($(this)[0],3,5);
					}else{
						
						var after = val.substring(2);
						var first = val.substring(0,1);
						var second = val.substring(1,2);
						if(keydownCount %2 ==1){ //改变第一位
							if(code-48<=2){
								result=(code-48)+val.substring(1);
								if(parseInt(second)>3){
									result=(code-48)+'0'+after;
								}
							}
						}else{ //改变第二位
							
							if(parseInt(first)>=2){ //只接受0~3
								if((code-48)<=3){
									result=first+(code-48)+after;
								}
							}else{ 
								result=first+(code-48)+after;
							}

						}
						$(this).val(result);
						setSelection($(this)[0],0,2);
					}
					
					if(typeof(options.onChanged) == 'function'){
						options.onChanged(result);
					}
					
					
			}else{
				return false;
			}

			
		});

		


		function getPosition (input) {
  			var pos = 0;
  			if (document.selection) {
    			input.focus ();
    			var selection = document.selection.createRange ();
    			selection.moveStart ('character', -input.value.length);
    			pos = selection.text.length;
  			}
  			else if (input.selectionStart || typeof(input.selectionStart) == 'number'){
  				pos = input.selectionStart;
  			}
    		
  			return pos;
		}


		 function setSelection(input, startPos, endPos) {
        		input.focus();
        	if (typeof(input.selectionStart) == "number") {
            		input.selectionStart = startPos;
            		input.selectionEnd = endPos;
        	} else if (document.selection && document.selection.createRange) {
            		input.select();
            		var range = document.selection.createRange();
            		range.collapse(true);
            		range.moveEnd("character", endPos);
           			range.moveStart("character", startPos);
            		range.select();
        		}
    	}



    	

    	function formatNumber(number){
    		return (number<10?'0':'')+number;
    	}



    	function addMinute(hour,minute){
			minute++;
			if(minute>=60){
				minute = 0;
				hour = addHour(hour);
			}
			var result = {};
			result.hour = hour;
			result.minute = minute;
			return result;
    	}

    	function addHour(hour){
			hour++;
			if(hour>=24){
				hour=0;
			}
    		return hour;
    	}

    	function subHour(hour){
			hour--;
			if(hour<0){
				hour=23;
			}
    		return hour;
    	}

    	function subMinute(hour,minute){
    		minute--;
			if(minute<0){
				minute = 59;
				hour = subHour(hour);
			}
			var result = {};
			result.hour = hour;
			result.minute = minute;
			return result;
    	}

    	$(this).find('.timepick-up').on('click',function(){

    		var val = _input.val();
			var times = val.split(':');
			var hour = parseInt(times[0]);
			var minute = parseInt(times[1]);
    		if(mPos ==-1){
				var result = addMinute(hour,minute);
				_input.val(formatNumber(result.hour)+':'+formatNumber(result.minute));
				setSelection(_input[0],3,5);
    		}else{
    			if(mPos<=2){
					_input.val(formatNumber(addHour(hour))+':'+formatNumber(minute));
					setSelection(_input[0],0,2);
    			}else{
					var result = addMinute(hour,minute);
					_input.val(formatNumber(result.hour)+':'+formatNumber(result.minute));
					setSelection(_input[0],3,5);
    			}

    		}
    		
    		
    		if(typeof(options.onChanged) == 'function'){
				options.onChanged(_input.val());
			}

    	});


    	$(this).find('.timepick-down').on('click',function(){

    		var val = _input.val();
			var times = val.split(':');
			var hour = parseInt(times[0]);
			var minute = parseInt(times[1]);
    		if(mPos ==-1){
				var result = subMinute(hour,minute);
				_input.val(formatNumber(result.hour)+':'+formatNumber(result.minute));
				setSelection(_input[0],3,5);
    		}else{
    			if(mPos<=2){
					_input.val(formatNumber(subHour(hour))+':'+formatNumber(minute));
					setSelection(_input[0],0,2);
    			}else{
					var result = subMinute(hour,minute);
					_input.val(formatNumber(result.hour)+':'+formatNumber(result.minute));
					setSelection(_input[0],3,5);
    			}
    		}
    		
    		if(typeof(options.onChanged) == 'function'){
				options.onChanged(_input.val());
			}

    	});





	}
});


//}));