import app from 'app';

import 'styless/slider.less';

export default app.directive('ngVideoSlider',[function(){
		return {
		restrict:'A',
		replace:true,
		scope:{
			sliderWidth: '@',
			minSlides: '@',
            maxSliders: '@',
            sliderMargin: '@',
            ngVideos:'=',
            ngPlay: '=',
            ngSliderInit:'=',
            ngHideCheckbox:'=',
            ngShowDelBox:'=?'
		},
		template:require('./slider.htm'),
		link:function(scope,element,attrs){
			//存储下标对应的数据
			var indexMap = {};
			
			scope.ngVideos = scope.ngVideos || [];
			scope.videos = [];
			scope.sliderMargin = parseFloat(scope.sliderMargin) || 0;
			scope.sliderWidth  = parseFloat(scope.sliderWidth) || 0;
			scope.maxSliders = parseInt(scope.maxSliders)||3;
			scope.ngShowDelBox = scope.ngShowDelBox  || false;
			var maxSliders = parseInt(scope.maxSliders)||3;
			
			var wrapWidth = scope.sliderWidth * maxSliders + scope.sliderMargin*(maxSliders-1);
			element.css('max-width',wrapWidth);

			var listElement = element.find('.slider-list');
			
			var viewport = element.find('.slider-viewport');


			var btnPrev = element.find('.bx-prev');
			var btnNext = element.find('.bx-next');

			scope.pindex = 0;
			
			var totalPage = 0;
			
			var overCount = 0;

			var initOffsetX = 0;

			var hasCloneItem = false;

			if(angular.isArray(scope.ngVideos)){
				init (scope.ngVideos);
			}
			

			scope.setChecked = function(index,checked){
				scope.videos[index].checked = checked;
			}

			var listener =null;
			var removeListener = null;
			var silder = {
				setVideoChecked : function(index,checked){
					if(hasCloneItem){
						var arr = indexMap[index+''];
						if(angular.isDefined(arr)){
							angular.forEach(arr,function(vIndex){
								scope.videos[vIndex].checked = checked;
							});
						}
					}else{
						scope.videos[index].checked = checked;
					}
					
					scope.ngVideos[index].checked = checked;
					
					if(typeof(listener) == 'function'){
						listener(index,checked);
					}
				},
				toggleVideoChecked:function(index){
					var result;
					if(hasCloneItem){
						result = !scope.videos[index+maxSliders].checked;
					}else{
						result = !scope.videos[index].checked;
					}
					this.setVideoChecked(index,result);
				},
				setIndex: function(index){
					setCurrentIndex(index);
				},
				addCheckedListener: function(callback){
					listener = callback;
				},
				clear:function(){
					clearChecked();
				},
				removeListener:function(callback){
					removeListener = callback;
				}
			};

			function init(videos){
					//清空原来的数据
					indexMap = {};
				
					hasCloneItem = false;
					scope.pindex = 0;
					if(scope.videos.length>0){
						scope.videos.splice(0,scope.videos.length);
					}
					//记住原始的下标
					for(var index=0;index<videos.length;index++){
						videos[index].reallyIndex = index;
					}
					
					scope.videos=angular.copy(videos);
					listElement.css('margin-left',"0px"); 
					if(maxSliders>0 && videos.length >maxSliders){
						hasCloneItem = true;
						var clone = null;
						
						for(var i=0;i<maxSliders;i++){
							clone = angular.copy(videos[i]);
							//console.log(clone);
							clone.clone=true;
							scope.videos.push(clone);
							//前面追加
							clone = angular.copy(scope.ngVideos[scope.ngVideos.length-1-i]);
							clone.clone=true;
							scope.videos.splice(0,0,clone);
						}
					}else{

					}
					var otherIndex= 0;
					var indexArr =null;
					angular.forEach(scope.videos,function(video){
						video.checked=video.InCart;
						
						indexArr = indexMap[''+video.reallyIndex];
						if(angular.isUndefined(indexArr) ||indexArr == null){
							indexArr = [];
							indexMap[''+video.reallyIndex] = indexArr;
						}
						indexArr.push(otherIndex);
						otherIndex++;
					});
					var listWidth =  scope.sliderWidth * scope.videos.length + scope.sliderMargin*(scope.videos.length);
					listElement.css('width',listWidth);
					
					//console.log(element.find('.slider').length);
					
					//element.find('.slider').css('margin-right',scope.sliderMargin+'px');
					

					if(maxSliders!=0){
						totalPage = Math.ceil(scope.ngVideos.length/maxSliders);
						overCount = scope.ngVideos.length%maxSliders;
					}



					
					if(totalPage>1){
						btnPrev.show();
						btnNext.show();
						
						if(hasCloneItem){
							initOffsetX = wrapWidth+parseInt(scope.sliderMargin);
							listElement.css('margin-left',"-"+initOffsetX+"px"); 
						}

						scope.pages = [];
						for(var page = 1;page<=totalPage;page++){
							scope.pages.push(page);
						}

					}else{
						scope.pages = [];
						btnPrev.hide();
						btnNext.hide();
					}


					if(typeof(scope.ngSliderInit) == 'function' && angular.isDefined(silder)){
						scope.ngSliderInit(silder);
					}
			}
			
			
			function clearChecked(){
				angular.forEach(scope.ngVideos,function(video){
					video.checked = false;
				});
				angular.forEach(scope.videos,function(video){
					video.checked = false;
				});
			}
	
			/**
			 *	获取真实的index
			 */
			function getRellayIndex(index){
				if(!hasCloneItem){
					return index;
				}
				return scope.videos[index].reallyIndex;
			}

			function setCurrentIndex(index){

				if(listElement.is(':animated') || index == scope.pindex){
					return false;
				}

				if(index >= totalPage){
					scope.pindex = 0;
				}else if(index<0){
					scope.pindex = totalPage -1;
				}else{
					scope.pindex = index;
				}
				var sliderMargin = parseFloat(scope.sliderMargin);
				var offsetX = 0;
				if(index >= totalPage && overCount > 0){
					offsetX = overCount*scope.sliderWidth + (overCount)*sliderMargin + Math.abs(parseFloat(listElement.css('margin-left')));
				}else if(index<0 && overCount>0){
					offsetX = (maxSliders-overCount)*(parseFloat(scope.sliderWidth)+sliderMargin);
				}else{
					offsetX = (wrapWidth+sliderMargin)*(index+1);
				}
				listElement.animate({
					marginLeft:'-'+offsetX+'px'
				},function(){
					if(index>=totalPage){
						listElement.css('margin-left',"-"+initOffsetX+"px"); 
					}else if(index<0){
						offsetX = (totalPage)*(wrapWidth+sliderMargin);
						listElement.css('margin-left',"-"+offsetX+"px"); 
					}
				});
			}

			scope.$watchCollection('ngVideos',function(newValue,oldValue){
				init(newValue);
			});
	

			scope.showPrev = function(){
				var index = scope.pindex -1;
				setCurrentIndex(index);
			};


			scope.showNext = function(){
				var index = scope.pindex +1;
				setCurrentIndex(index);
			};

			scope.removeVideo = function(video,index){
				var reallyIndex = getRellayIndex(index);
				if(removeListener !=null){
					removeListener(reallyIndex,video);
				}
				
			}

			scope.changeIndex = function(index){
				setCurrentIndex(index);
			};

			scope.playVideo = function(index){
				var realIndex = getRellayIndex(index);
				if(typeof(scope.ngPlay) == 'function'){
					scope.ngPlay(scope.ngVideos[realIndex],realIndex);
				}


			}

			scope.change = function(video,index){
				var realIndex = getRellayIndex(index);
				silder.setVideoChecked(realIndex,video.checked);
			}
		}
	};
	
	}]);
