import app from 'app';

import Swiper from 'vendors/swiper/idangerous.swiper.min';
import 'vendors/swiper/idangerous.swiper.min.css';

/**
	 * 基于转变好的DOM初始化Swiper
	 */
export default app.directive('ngDomSwiper', function(){
        return {
            restrict: 'EA',
            scope:{
                ngDomSwiper:'&'
            },
            link: function(scope, element, attrs) {
                if(window._verBrower=="IE 8.0"){
                    var swiperOptions = {
                        loop: false,
                        simulateTouch : false,
                        DOMAnimation:false,
                        autoResize:false,
                        mode: 'horizontal',
                        onSlideChangeEnd:function(swiper){
                          $(".swiper-slide-active").height($(".swiper-slide-active .border-box").height());
													$(".swiper-wrapper").height($(".swiper-slide-active .border-box").height());
                        }
                    };
                }else{
                    var swiperOptions = {
                        loop: false,
                        direction: 'horizontal',
                        height:100,
                        simulateTouch : false,
                        onSlideChangeEnd:function(swiper){
                          $(".swiper-slide-active").height($(".swiper-slide-active .border-box").height());
                          $(".swiper-wrapper").height($(".swiper-slide-active .border-box").height());
                        }
                    };
                }
                var swiper = new Swiper(element[0],swiperOptions);
                scope.ngDomSwiper({swiper:swiper});
            }
        };
    });
