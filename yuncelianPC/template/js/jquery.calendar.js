/**
 * jQuery Calendar plugin
 * version 0.0.1
 *
 */
jQuery.fn.extend({
	
	calendar : function(options){

		var CALENDAR_WIDTH = 290;

		var CALENDAR_CONTWNT_HEIGHT = 245;

		var _self = this;

		var MODE_DAY = 1;
		var MODE_MONTH = 2;
		var MODE_YEAR = 3;
		var MODE_YEAR_RANGE = 4;

		var mode = MODE_DAY;


		options =jQuery.extend({
			minDate:NaN, //日期下限
			maxDate :NaN, ///日期上限
			format:'yyyy/MM/dd', //格式
			render:'',
			speed: 300,
			complement: true,
			onPicked:function(){ //回调

			},
			onError:function(code){

			}
		},options);

		//options.complement =  typeof(options.complement) !=='undefined'? options.complement:true;
		//options.speed = options.speed || 300;
		var today = new Date();


		var text ='';
		if($(this).is('input')){
			text = $(this).val();
			if(text==''){
				$(this).val(this.format(today,options.format));
			}




		}else{
			text = $(this).text();
			if(text==''){
				$(this).val(this.format(today,options.format));
			}
		}


		if(text!=''){
			today = new Date(text);
		}



		var mYear = today.getFullYear();

		var mMonth = today.getMonth();

		var mBtnPrev,mBtnNext; //两个切换按钮

		var mWeekContainer;
		
		var mTitleView,mLargeTitleView;

		var mContent;

		var mCompYear,mCompMonth;

		var mYearView,mYearRange;



		/**
		 *	初始化DOM结点
		 */
		function initDom(container){
			container.empty();
			
			var header = $('<div class="calendar-header"></div>');
			
			mBtnPrev = $('<span class="btn-calendar-prev"></span>');

			mBtnNext = $('<span class="btn-calendar-next"></span>');

			header.append(mBtnPrev);
			header.append(mBtnNext);



			mTitleView = $('<div class="calendar-title"></div>');


			mLargeTitleView = $('<div class="calendar-large-title"></div>');

			mYearView = $('<span class="year"></span>');
			mYearRange = $('<span class="year-range"></span>');

			mLargeTitleView.append(mYearView);
			mLargeTitleView.append(mYearRange);


			mWeekContainer = $('<div class="calendar-week"></div>');

			mWeekContainer.append('<table>'+
					'<tr>'+
						'<td>日</td>'+
						'<td>一</td>'+
						'<td>二</td>'+
						'<td>三</td>'+
						'<td>四</td>'+
						'<td>五</td>'+
						'<td>六</td>'+
					'</tr>'+
				'</table>');


			var group = $('<span></span>');


			mCompMonth = $('<span class="comp-month">'+_self.formatNumber((mMonth+1))+'</span>');


			mCompYear = $('<span class="comp-year">'+mYear+'</span>');

			group.append(mCompMonth);
			group.append('<span> / </span>');
			group.append(mCompYear);

			mTitleView.append(group);

			header.append(mTitleView);
			header.append(mLargeTitleView);
			header.append(mWeekContainer);
			container.append(header);

			mContent = $('<div class="calendar-content"></div>');
			mContent.append('<div class="enabled"></div>');
			mContent.append('<div class="reserve"></div>');

			mContent.find('.enabled').html(getMonthHtml(mYear,mMonth)).css('z-index',1);
			
			bindToolbarEvent();
			bindEvent();



			container.append(mContent);
		}




		function checkDisabledDate(date){
			// 在最小时间范围之前
			// 在最大时间范围之外

			var isBefore = options.minDate != NaN && options.minDate > date && !isSameDay(options.minDate,date);

			var isAfter = options.maxDate != NaN && options.maxDate < date && !isSameDay(options.maxDate,date);

			if(isBefore){
				return -1;
			}

			if(isAfter){
				return -2;
			}

			return 0;
		}


		function checkSelectedDate(date){

			return today.getFullYear() == date.getFullYear() && today.getMonth() == date.getMonth() && today.getDate() == date.getDate();
		}

		function isSameDay(today,date){

			return today.getFullYear() == date.getFullYear() && today.getMonth() == date.getMonth() && today.getDate() == date.getDate();
		}


		function getMonthHtml(year,month){
			//获取上个月的最后一天
			var newDate = new Date(year,month,1);
			console.log('当前日期=========>'+newDate);
			newDate.setDate(0);
			var day = 1;
			//上个月最后一天
			var startDay = newDate.getDate();
			console.log('上个月最后一天=========>'+startDay);
			//当月开始的一天
			newDate.setDate(1);
            newDate.setMonth(newDate.getMonth() + 1);
            //周几
			var week = newDate.getDay();
			console.log('获取当前月第一天是星期=========>'+week+"------->"+newDate);
			if(week == 0){
				week == 7;
			}
			//展示上个月开始的日期
			startDay = startDay - week + 1;
			console.log('上个月展示开始日期=========>'+startDay+"------->"+newDate);
            newDate.setMonth(newDate.getMonth() + 1);
            newDate.setDate(0);

			//获取当前月的最后一天
			var o = newDate.getDate();
			console.log('本月最后一天=========>'+o);
			var nextStyle = '';


			var disabled = '';

			var tmpDate = null;
			
			var current = '';
			var code = 0;

			var html = '<table class="table-date">';
				html += '<tbody>';
				//6 表示6行
				for (var row = 0; row < 6; row++) {
					html += '<tr>';
					//7 列
					for(var col=0;col<7;col++){
						html += '<td>';
						var delta = row * 7 + col + 1 - week;
						tmpDate = new Date(newDate.getFullYear(),newDate.getMonth(),delta);
						code = checkDisabledDate(tmpDate);
						if(code<0){
							disabled = 'data-disabled="'+code+'"';
						}else{
							disabled = '';
						}	

						if(checkSelectedDate(tmpDate)){
							current = 'current'
						}else{
							current = '';
						}
						//上个月
						if(delta<=0){
							html+='<span class="prev-date '+current+'" data-role="day" data-value="'+startDay+'" '+disabled+'>'+startDay+'</span>';
							startDay++;
						}else{//当月

							if(delta==o+1){
								day=1;
								nextStyle = 'next-date';
							}
							
							html+='<span class="'+nextStyle+' '+current+'" data-role="day" data-value="'+day+'" '+disabled+'>'+day+'</span>'
							day++;
						}
						html += '</td> \n';

					}
					html += '</tr>';
				}
				html += '</tbody>';
				html += '</table>';

			return html;

		}


		function getMonthTable(year,month){
			var html = '<table class="table-month">';
			html+='<tbody>';
			var item = 0;
			for(var row = 0;row<3;row++){
				html += '<tr>';
				for(var col=0;col<4;col++){
					html += '<td>';
					item = row*4+col+1;
					if(item == mMonth+1 && year == mYear){
						html += '<span class="current" data-role="month" data-value="'+item+'">'+item+'月</span>';
					}else{
						html += '<span data-role="month" data-value="'+item+'">'+item+'月</span>';
					}
					
					html += '</td>';
				}
				html += '</tr>';
			}
			html+='</tbody>';
			html +='</table>'
			return html;
		}


		

		function getYearTable(year){
			var offset = Math.floor(year/12)*12;
			var html = '<table class="table-year">';
			html+='<tbody>';
			var item = 0;
			for(var row = 0;row<3;row++){
				html += '<tr>';
				for(var col=0;col<4;col++){
					html += '<td>';
					item = row*4+col+offset;
					if(mYear==item){
						html += '<span class="current" data-role="year" data-value="'+item+'">'+item+'</span>';
					}else{
						html += '<span data-role="year" data-value="'+item+'">'+item+'</span>';
					}
					
					html += '</td>';
				}
				html += '</tr>';
			}
			html+='</tbody>';
			html +='</table>'
			return html;
		}


		function getYearRangeTable(year){
			var offset = Math.floor(year/12/12)*12*12;
			var html = '<table class="table-year-range">';
			html+='<tbody>\n';
			var item = 0;
			var style = '';
			for(var row = 0;row<3;row++){
				html += '<tr>\n';
				for(var col=0;col<4;col++){
					html += '<td>';
					item = row*12*4+col*12+offset;
					if(item<=mYear && mYear<=item+11){
						style ='current';	
					}else{
						style = '';
					}
					html += '<span class="'+style+'" data-role="range" data-value="'+item+'-'+(item+11)+'">'+item+'-'+(item+11)+'</span>';
					html += '</td>\n';
				}
				html += '</tr>\n';
			}
			html+='</tbody>';
			html +='</table>'
			return html;
		}

		//var container = $(this);


		function animLeftRight(enabled,reserve,html,isToLeft){
			reserve.css('margin-top','0px');
			reserve.html(html);
			reserve.css('z-index',0);
			enabled.css('z-index',0);
			
			var symbole = '+';
			if(isToLeft){
				symbole = '+';
				reserve.css('margin-left','-'+CALENDAR_WIDTH+'px');
			}else{
				reserve.css('margin-left',CALENDAR_WIDTH+'px');
				symbole = '-';
			}
			
			reserve.animate({
					marginLeft : symbole+'='+CALENDAR_WIDTH+'px'
			},options.speed,function(){
					$(this).removeClass('reserve').addClass('enabled');
			});

			enabled.animate({
					marginLeft : symbole+'='+CALENDAR_WIDTH+'px'
			},options.speed,function(){
				$(this).removeClass('enabled').addClass('reserve');
				$(this).empty();
			});

		}


		function animTopBottom(enabled,reserve,html,mode,isToBottom){

			reserve.css('margin-left','0px');
			reserve.html(html);
			
			

			var symbole = '+';

			if(isToBottom){


				reserve.css('z-index',-1);
				enabled.css('z-index',0);


				symbole = '+';
				reserve.css('margin-top','-'+CALENDAR_CONTWNT_HEIGHT+'px');
			}else{

				reserve.css('z-index',0);
				enabled.css('z-index',-1);


				reserve.css('margin-top',CALENDAR_CONTWNT_HEIGHT+'px');
				symbole = '-';
			}

			reserve.animate({
				marginTop : symbole +'='+CALENDAR_CONTWNT_HEIGHT+'px'
			},options.speed,function(){
				$(this).css('z-index',0);
				$(this).removeClass('reserve').addClass('enabled');
				
			});

			enabled.animate({
				marginTop : symbole +'='+CALENDAR_CONTWNT_HEIGHT+'px'
			},options.speed,function(){
				$(this).css('z-index',0).empty();
				$(this).removeClass('enabled').addClass('reserve');
			});



			switch(mode){

				case MODE_MONTH:
					mYearRange.hide();
					mYearView.show();



					break;

				case MODE_YEAR:
				case MODE_YEAR_RANGE:
					mYearRange.show();
					mYearView.hide();

					

					break;



			}


			if(isToBottom){
				
				mWeekContainer.fadeOut(options.speed);
				mLargeTitleView.fadeIn(options.speed);
				mTitleView.fadeOut(options.speed);

				mBtnNext.animate({
					top:'8px'
				},options.speed);

				mBtnPrev.animate({
					top:'8px'
				},options.speed);

				
			}else{

				if(mode == MODE_DAY){
					mWeekContainer.fadeIn(options.speed);
					mLargeTitleView.fadeOut(options.speed);
					mTitleView.fadeIn(options.speed);

					mBtnNext.animate({
						top:'0px'
					},options.speed);

					mBtnPrev.animate({
						top:'0px'
					},options.speed);
				}

			}



		}

		var renderId = options.render || '';

		var container;

		if(renderId != ''){
			container = $('#'+renderId);
			if(container.length==0){
				if(container.length==0){
					container = $('<div class="calendar"></div>');
					container.attr('id',renderId);
					$('body').append(container);
				}
			}else{
				if(!container.hasClass('calendar')){
					container.addClass('calendar');
				}
			}
		}else{
			container = $('.calendar');
			if(container.length==0){
				container = $('<div class="calendar"></div>');
				$('body').append(container);
			}
		}






		initDom(container);
		

		function bindToolbarEvent(){
			mBtnPrev.on('click',function(){
			var reserve=mContent.find('.reserve');
			if(reserve.is(':animated')){
					return false;
			}
			var enabled = mContent.find('.enabled');
			var html = '';
			switch(mode){
				case MODE_DAY:

					mMonth--;
					if(mMonth<0){
						mMonth = 11;
						mYear --;
					}
					html = getMonthHtml(mYear,mMonth);
					break;
				case MODE_MONTH:
						var year  = parseInt(mYearView.text());
						year--;
						mYearView.html(year+"");
						html = getMonthTable(year,mMonth+1);
						//reserve.html(html);
					break;

				case MODE_YEAR:
					var year  = parseInt(mYearRange.text().split('-')[0])-1;
					var range = _self.calcYearRange(year);
					
					mYearRange.text(range.start+'-'+range.end);

					html = getYearTable(year);


					break;

				case MODE_YEAR_RANGE:

					var year  = parseInt(mYearRange.text().split('-')[0])-1;


					var range = _self.calcLargeYearRange(year);
					

					mYearRange.text(range.start+'-'+range.end);


						html = getYearRangeTable(year);



					break;

			}
			
			mCompMonth.text(_self.formatNumber(mMonth+1));

			mCompYear.text(mYear);
			animLeftRight(enabled,reserve,html,true);

			bindEvent();

			//阻止事件冒泡
			return false;

		});



		mBtnNext.on('click',function(){

			var reserve=mContent.find('.reserve');
			if(reserve.is(':animated')){
					return false;
			
			}
			var enabled = mContent.find('.enabled');

			var html = '';
			switch(mode){
				case MODE_DAY:

						mMonth++;
						if(mMonth>11){
							mMonth = 0;
							mYear ++;
						}
						html = getMonthHtml(mYear,mMonth);
						//reserve.html(html);


					break;
				case MODE_MONTH:

						var year  = parseInt(mYearView.text());
						year++;
						mYearView.html(year+"");
						html = getMonthTable(year,mMonth+1);

					break;
				case MODE_YEAR:

						var year  = parseInt(mYearRange.text().split('-')[1])+1;

						var offset = Math.floor(year/12)*12;

						mYearRange.text(offset+'-'+(offset+11));


						html = getYearTable(year);





					break;
				case MODE_YEAR_RANGE:

					var year  = parseInt(mYearRange.text().split('-')[1])+1;

					var offset = Math.floor(year/12/12)*12*12;

					mYearRange.text(offset+'-'+(offset+12*12-1));


						html = getYearRangeTable(year);


					break;

			}

			mCompMonth.text(_self.formatNumber(mMonth+1));
			mCompYear.text(mYear);


			animLeftRight(enabled,reserve,html);

			bindEvent();



			//阻止事件冒泡
			return false;

		});


	
		
		mCompMonth.on('click',function(){
			var reserve=mContent.find('.reserve');
			if(reserve.is(':animated')){
					return false;
			
			}
			mode = MODE_MONTH;
			var enabled = mContent.find('.enabled');

			mYearView.html(mYear);

			var year =parseInt(mCompYear.text());
			var month = parseInt(mCompMonth.text());
			var html = getMonthTable(year,month);

			animTopBottom(enabled,reserve,html,MODE_MONTH,true);

			bindEvent();


			//阻止事件冒泡
			return false;

		});


		mCompYear.on('click',function(){

			var reserve=mContent.find('.reserve');
			if(reserve.is(':animated')){
					return false;
			
			}
			mode = MODE_YEAR;

			var enabled = mContent.find('.enabled');


			var year =parseInt(mCompYear.text());


			var range = _self.calcYearRange(year);

			mYearRange.text(range.start+'-'+range.end);

			
			var month = parseInt(mCompMonth.text());
			var html =getYearTable(year);

			animTopBottom(enabled,reserve,html,MODE_YEAR,true);


			bindEvent();



			//阻止事件冒泡
			return false;

		});


		mYearRange.on('click',function(){
			if(mode != MODE_YEAR_RANGE){

				var reserve=mContent.find('.reserve');
				if(reserve.is(':animated')){
					return false;
			
				}
				mode = MODE_YEAR_RANGE;

				var enabled = mContent.find('.enabled');


				var year = parseInt(mYearRange.text().split('-')[0]);

				var range = _self.calcLargeYearRange(year);

				mYearRange.text(range.start+'-'+range.end);
			
				var month = parseInt(mCompMonth.text());
				var html = getYearRangeTable(year);
				animTopBottom(enabled,reserve,html,MODE_YEAR_RANGE,true);
				bindEvent();
			}



			//阻止事件冒泡
			return false;

		});
		}

		
		

		
		function bindEvent(){

			mContent.find('span').on('click',function(){


				var role = $(this).attr('data-role');
				var value = $(this).attr('data-value');
				console.log(role+"=====>"+value);
				if('day' == role){
					var disabled = $(this).attr('data-disabled');
					if(disabled == '-1' || disabled=='-2'){
						options.onError.call(this,parseInt(disabled));
						return false;
					}

					mode = MODE_DAY;

					var newDate = null;

					var day = parseInt($(this).html());
					if($(this).hasClass('prev-date')){
						newDate = new Date(mYear,mMonth-1,day);
						
					}else if($(this).hasClass('next-date')){
						
						newDate = new Date(mYear,mMonth+1,day);
					}else{
						newDate = new Date(mYear,mMonth,day);
					}


					var value = _self.format(newDate,options.format);

					if(options.complement){
						if(_self.is('input')){
							_self.val(value);
						}else{
							_self.text(value);
						}	
					}
			
			
					options.onPicked.call(this,_self.format(newDate,options.format));


					container.hide();


					

				}else if('month' == role){
					var reserve=mContent.find('.reserve');
					if(reserve.is(':animated')){
						return false;
			
					}
					mode = MODE_DAY;

					mMonth = parseInt(value)-1;
					
					mCompMonth.text(((mMonth+1<10)?'0':'')+(mMonth+1));

					mYear = parseInt(mYearView.text());

					mCompYear.text(mYear);
					
					var enabled = mContent.find('.enabled');

					var html = getMonthHtml(mYear,mMonth);

					animTopBottom(enabled,reserve,html,MODE_DAY,false);


					bindEvent();
				}else if('year' == role){
					


					var reserve=mContent.find('.reserve');
					if(reserve.is(':animated')){
						return false;
			
					}
					mode = MODE_MONTH;
	
					mYear = parseInt(value);

					mYearView.text(mYear);
					mCompYear.text(mYear);
					
					var enabled = mContent.find('.enabled');
					var html = getMonthHtml(mYear,mMonth);
					animTopBottom(enabled,reserve,html,MODE_DAY,false);

					bindEvent();

				}else if('range' == role){

					var reserve=mContent.find('.reserve');
					if(reserve.is(':animated')){
						return false;
					}

					mode = MODE_YEAR;				
					var year = parseInt(value);
					mYearRange.html(value);
					var enabled = mContent.find('.enabled');
					var html = getYearTable(year);
					animTopBottom(enabled,reserve,html,MODE_YEAR,false);
					bindEvent();


				}



				//阻止事件冒泡
					return false;
			});
		}
		
		




		function render(container,root){
			initDom(container);

			setPosition(root);
		}


		function setPosition(element){

			var top=element.offset().top;
			var height = element.outerHeight();
			container.css('left',element.offset().left);
			container.css('top',top+height);
		}

		
		setPosition($(this));


		$(this).on('click',function(){


		var text ='';
		if($(this).is('input')){
			text = $(this).val();
			if(text==''){
				$(this).val(this.format(today,options.format));
			}




		}else{
			text = $(this).text();
			if(text==''){
				$(this).val(this.format(today,options.format));
			}
		}


		if(text!=''){
			today = new Date(text);
		}
		mYear = today.getFullYear();
		mMonth = today.getMonth();

			render(container,$(this));



			container.show();
			return false;
		});


		$(document).on('click',function(){
			container.hide();
		});


	},
	/**
	 * 格式化数字
	 */
	formatNumber:function(number){
		return (number<10?'0':'')+number;
	},
	/**
	 * 计算12年的区间范围
	 */
	calcYearRange:function(year,count){
		var result = {};
		if(typeof(count) ==='undefined' || count==null || count<=0){
			count = 12;
		}
		var start = Math.floor(year/count)*count;
		result.start = start;
		result.end = start + count -1;
		return result;
	},
	/**
	 *	计算144年的区间范围
	 */
	calcLargeYearRange:function(year){
		return this.calcYearRange(year,12*12);
	},
	format : function(date,fmt){
		date = date || new Date();
		fmt = fmt||'yyyy/MM/dd';
		var o = {         
    			"M+" : date.getMonth()+1, //月份         
    			"d+" : date.getDate(), //日         
    			"h+" : date.getHours()%12 == 0 ? 12 : date.getHours()%12, //小时         
    			"H+" : date.getHours(), //小时         
    			"m+" : date.getMinutes(), //分         
    			"s+" : date.getSeconds(), //秒         
    			"q+" : Math.floor((date.getMonth()+3)/3), //季度         
    			"S" : date.getMilliseconds() //毫秒         
    		};         
    		var week = {         
    			"0" : "/u65e5",         
    			"1" : "/u4e00",         
    			"2" : "/u4e8c",         
    			"3" : "/u4e09",         
    			"4" : "/u56db",         
    			"5" : "/u4e94",         
    			"6" : "/u516d"        
    		};         
    		if(/(y+)/.test(fmt)){         
        		fmt=fmt.replace(RegExp.$1, (date.getFullYear()+"").substr(4 - RegExp.$1.length));         
    		}         
    		if(/(E+)/.test(fmt)){         
        		fmt=fmt.replace(RegExp.$1, ((RegExp.$1.length>1) ? (RegExp.$1.length>2 ? "/u661f/u671f" : "/u5468") : "")+week[date.getDay()+""]);         
    		}         
    		for(var k in o){         
        		if(new RegExp("("+ k +")").test(fmt)){         
            		fmt = fmt.replace(RegExp.$1, (RegExp.$1.length==1) ? (o[k]) : (("00"+ o[k]).substr((""+ o[k]).length)));         
        		}         
    		}         
    		return fmt;    
	}

});