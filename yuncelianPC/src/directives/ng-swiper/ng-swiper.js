import app from 'app';

import Swiper from 'vendors/swiper/idangerous.swiper.min';
import 'vendors/swiper/idangerous.swiper.min.css';

export default app.directive('swiper',['$timeout','$compile',function($timeout,$compile){
		return {
			restrict: 'EA',
			template: require('./swiper.htm'),
			replace: true,
			transclude: true,
			scope:{
	    			onInit:"&",  // 回调初始化Swiper
	    			swiperId:'@',
	    			onChangeEnd:'&',
	    			ngWidth:'@',
	    			onRepeatFinish:'&',
	    			ngResize:'@',
	    			initialSlide:'@'
			},
		   controller: ['$scope', '$element', '$attrs',function($scope, $element, $attrs) {
			   var placeholder = $element.find('#swiper-placeholder');
			   var initialSlide = parseInt($scope.initialSlide||0);
			   
			   	var swiperWidth = $scope.ngWidth || 980;
				  var newSlides = [];
	      			var mySwiper = null;
	      			var slideCount = 0;
	      			this.addSlide = function(html, needSlide,callback) {
	        			if (mySwiper) {
	        				
	        				var newSlide=mySwiper.createSlide(html);
	        				newSlide.append();
	        				console.log(newSlide);
	        			} else {
	          				newSlides.push({html: html, callback: callback});
	        			}
	        			
	      			};
	      			// 延迟测量高度
	      			function measureHeight(){
    					var active = $element.find('.swiper-slide-active');
                	   	var child = active.children('div');
						var height = child.outerHeight(true);
						active.height(height);
						var wrap = $element.find('.swiper-wrapper');
						wrap.height(height);
						$element.height(height);
    					
    					
    					
	      			}
	      			
	      			
	      			
	      			
                   var swiperOptions = {
                       loop: false,
                       simulateTouch : false,
                       mode: 'horizontal',
                       autoResize:false,
					   calculateHeight:true,
					   initialSlide:initialSlide,
					   // autoHeight:true,
                       onSlideChangeEnd:function(swiper){
                           measureHeight();
                           var imgNum=$('.swiper-slide-active img').length;
                            $('.swiper-slide-active img').load(function(){
                                if(!--imgNum){
                                    measureHeight();
                                }
                            });
                           $scope.onChangeEnd({swiper:swiper,id:$scope.swiperId,index:swiper.activeIndex});
                       },
                       onSlideChangeStart:function(swiper){
                           // $element.css('height','auto');
                       }
                   };
                   if ($attrs.swiper) {
                       angular.extend(swiperOptions, $scope.$eval($attrs.swiper));
                   }
                    this.onRepeatFinish = function(){
	      				$scope.onRepeatFinish();
                        if(window._verBrower=="IE 8.0"){ 
                            $timeout((function(){
                                    mySwiper = new Swiper($element[0],swiperOptions);
                                    mySwiper.invalidate = function(){
                                        $timeout(function(){
                                            measureHeight();
                                        },50);
                                    }
                                    $timeout(function(){
                                        measureHeight();
                                    },50);
                                    var imgNum=$('.swiper-slide-active img').length;
                                    $('.swiper-slide-active img').load(function(){
                                        if(!--imgNum){
                                            measureHeight();
                                        }
                                    });
                                    if(angular.isFunction($scope.onInit)){
                                        $scope.onInit({swiper:mySwiper,id:$scope.swiperId});
                                    }
                            })(),0);
                        }else{
                            $timeout(function(){
                                    mySwiper = new Swiper($element[0],swiperOptions);
                                    mySwiper.invalidate = function(){
                                        $timeout(function(){
                                        measureHeight();
                                        },50);
                                    }
                                    $timeout(function(){
                                        measureHeight();
                                    },50);
                                    var imgNum=$('.swiper-slide-active img').length;
                                    $('.swiper-slide-active img').load(function(){
                                        if(!--imgNum){
                                            measureHeight();
                                        }
                                    });
                                    if(angular.isFunction($scope.onInit)){
                                        $scope.onInit({swiper:mySwiper,id:$scope.swiperId});
                                    }
                            },0);
                        }
                    }
            }]

        }
    }]);