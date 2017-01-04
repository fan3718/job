import app from 'app';
/**
 * 轮播插件
 */
export default app.directive('ngCarousel',[function(){
		return {
			scope:{
				ngCarousel:'&'
			},
			link: function (scope, elem, attrs) {

				var carousel = $(elem);
				// 最大偏移
				var MaxOffsetThumb = 5;

				var list = carousel.find('.pic-list');
				// 图片宽度
				var imageWidth = list.width();
				// 计算真实宽度
				var imageCount = list.find("li").length;
				list.width(imageWidth*imageCount);


				var mListener = undefined;


				var thumbnail_list=carousel.find('.thumbnail-list');

				var thumbWidth=carousel.find('.thumbnails').width();


				var buttons = thumbnail_list.find('.thumbnail');

				var thumListwidth = 0;
				var firstWidth = 0;
				// 左上角位置
				var lefts = [];
				buttons.each(function(){
					lefts.push(thumListwidth);
					thumListwidth+=$(this).outerWidth(true);
					firstWidth = $(this).width();
				});
				thumbnail_list.width(thumListwidth);
				if(firstWidth!=0){
					MaxOffsetThumb = Math.floor(thumbWidth/firstWidth)-1;
				}
				var maxMarginLeft = thumListwidth - thumbWidth;
				var prev = carousel.find('.prev-bar');
				var next = carousel.find('.next-bar');
				var left = carousel.find('.view-left');
				var right = carousel.find('.view-right');
				var showBox = carousel.find('.pictureshow-box');
				var contentBox = carousel.find('.pic-content');
				var index = scope.ngCurrentIndex || 1;
				var len = imageCount;
				var num = 0;
				if(maxMarginLeft>0){
					right.addClass('active');
				}

				if(imageCount>1){
					next.addClass("active");
				}

				function animate(offset,isAnim) {
					var left = parseInt(list.css('left')) + offset;
					if (offset > 0) {
						offset = '+=' + offset;
					} else {
						offset = '-=' + Math.abs(offset);
					}
					list.animate({
						'left': offset
					}, (isAnim==undefined || isAnim) ? 300 : 0);
					// 计算高度
					var img=list.find('li').eq(index-1).find('img');
					var height = img.height();
					if(height<=0){
						var pic = new Image();
						pic.src = img.attr('src');
						pic.onload = function(){
							height = img.height();
							resetBox(height,isAnim);
						}
					}else{
						resetBox(height,isAnim);
					}
					if (index == 1) {
						prev.removeClass("active");
						if(imageCount>1){
							next.addClass("active");
						}
					} else if (index == len) {
						next.removeClass("active");

						if(imageCount>1){
							prev.addClass("active");
						}


					} else {
						prev.addClass("active");
						next.addClass("active");
					}
				}

				function animate_thumb(){
					thumbnail_list.animate({
						'left': -140*num
					}, 300);

					if (num == 0) {
						left.removeClass('active');
					} else if (num == 3) {
						right.removeClass('active');
					} else {
						left.addClass('active');
						right.addClass('active');
					}
				}

				function showButton() {
					buttons.eq(index - 1).addClass('on').siblings().removeClass('on');
				}

				function resetBox(height,isAnim){
					contentBox.animate({
						'height': height
					}, (isAnim==undefined || isAnim) ? 300 : 0);
					showBox.animate({
						'height': height
					}, (isAnim==undefined || isAnim) ? 300 : 0);
				}

				function stop() {
					clearTimeout(timer);
				}
				next.bind('click', function() {
					if (list.is(':animated')) {
						return;
					}
					if (index == len) {
						return;
					} else {
						index += 1;
					}
					animate(-imageWidth);
					showButton();
					showIndicator(index);
				});

				prev.bind('click', function() {
					if (list.is(':animated')) {
						return;
					}
					if (index == 1) {
						return;
					} else {
						index -= 1;
					}
					animate(imageWidth);
					showButton();
					showIndicator(index);
				});


				left.bind('click', function() {
					if(thumbnail_list.is(':animated')){
						return;
					}
					var marginLeft = Math.abs(parseInt(thumbnail_list.css("margin-left")));
					if(marginLeft>0){
						thumbnail_list.animate({
							'margin-left': '+='+marginLeft
						}, 300,indicatorCallback);
					}

				});

				right.bind('click', function() {
					if(thumbnail_list.is(':animated')){
						return;
					}
					var marginLeft = Math.abs(parseInt(thumbnail_list.css("margin-left")));
					if(marginLeft<thumListwidth-thumbWidth){
						var offset=Math.min(Math.abs(thumListwidth-marginLeft-thumbWidth),firstWidth*MaxOffsetThumb)+marginLeft;
						thumbnail_list.animate({
							'margin-left': -offset
						}, 300,indicatorCallback);
					}
				});

				contentBox.bind('click',function(){
					list.css('left','0');
					if(mListener!=undefined){
						mListener();
					}
				});
				function indicatorCallback(){

					var marginLeft = Math.abs(parseInt(thumbnail_list.css("margin-left")));
					if(marginLeft<=0){
						left.removeClass('active');
						right.addClass('active');
					}else if(marginLeft>=maxMarginLeft){
						right.removeClass('active');
						left.addClass('active');
					}else{
						left.addClass('active');
						right.addClass('active');
					}
				}

				function showIndicator(index){
					var marginLeft = Math.abs(parseInt(thumbnail_list.css("margin-left")));
					var item=buttons.eq(index-1);
					var left = lefts[index-1];

					var width = item.outerWidth(true);

					if(marginLeft+thumbWidth<left+width && marginLeft<thumListwidth-thumbWidth ){
						thumbnail_list.animate({
							'margin-left': '-='+(left+width-(marginLeft+thumbWidth))
						}, 300,indicatorCallback);
					}else{
						if(marginLeft !=0){
							if(left<marginLeft){
								thumbnail_list.animate({
									'margin-left': '+='+(marginLeft-left)
								}, 300,indicatorCallback);
							}
						}
					}


				}


				function selectedImage(i){
					var offset = -imageWidth * (i - index);
					index = i;
					animate(offset);
					showIndicator(index);
					showButton();
				}

				buttons.each(function() {
					$(this).bind('click', function() {
						if (list.is(':animated') || $(this).hasClass('class') == 'on') {
							return;
						}
						var myIndex = parseInt($(this).attr('index'));
						selectedImage(myIndex);
					})
				});
				var callback = {
					setIndex:function(i){
						index = i;
						// if(index >1){
						animate(-1*(index-1)*imageWidth,false);
						showButton();
						showIndicator(index);
						// }
					},
					addImageClickListener:function(listener){
						mListener=listener;
					}
				};

				scope.ngCarousel({data:callback});
			}
		};
	}]);