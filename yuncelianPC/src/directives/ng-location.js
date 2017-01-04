/**
 * 监控元素位置
 */
import app from 'app';
export default app.directive('ngLocation',function(){
		return {
			restrict:'AC',
			scope:{
				mode:"@",// first、last、center
				callback:"="
			},
			link:function(scope,element,attrs){
				
				
				/**
				 * 监听滚动条(第一个展示)
				 */
				/*
				 * $(window).scroll(function(event){ //获取前一个结点 var prev =
				 * element.prev(); var scrollTop = $(document).scrollTop(); var
				 * offsetY = element.offset().top var deltaY =
				 * offsetY-scrollTop; var height = element.height(); if(deltaY<=0){
				 * element.attr("scroll-state",1);
				 * //console.log(element.html()); if(deltaY <-1*height ){
				 * element.attr("scroll-state",0); } } if(prev.length>0){
				 * if(prev.offset().top+prev.height()-scrollTop >0){
				 * element.attr("scroll-state",0); } } });
				 */
				/**
				 * 监听滚动条(最后一个展示)
				 */
				$(window).scroll(function(event){
					var scrollTop = $(document).scrollTop();
					var offsetY = element.offset().top;
					var winHeight = $(window).height();
					if((offsetY+element.outerHeight(true)) > (scrollTop+winHeight) && (offsetY) < (scrollTop+winHeight)){
						element.attr("scroll-state",1);
					}else{
						element.attr("scroll-state",0);
					}
					
				});
				
				
				
				
			}
		};
		
		
		
	});
