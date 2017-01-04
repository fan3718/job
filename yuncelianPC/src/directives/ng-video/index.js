import app from 'app';
import 'services/VideoHelper';

import 'vendors/videojs/video';
import 'vendors/videojs/video-js.min.css';
import 'styless/video.less';

export default app.directive('ngVideoJs',['VideoHelper',function(VideoHelper){

		return {
			restrict:'A',
			replace:true,
			scope:{
				ngVideo:'=',
				ngClose:'&',
				ngPlayError:'=?'
			},
			template: require('./template.htm'),
			link:function(scope,element,attrs){
				var viewport =  element.find('.video-viewport');
				 var setup = {
			                'techOrder': ['html5', 'flash'],
			                'controls': true,
			                'preload': 'auto',
			                'autoplay': true,
			                'height': 480,
			                'width': "100%",
			                'poster': '',
			            };

				var iframe = null;

				var videoElement = null;
				var player = null;
				scope.$watch('ngVideo',function(newValue,oldValue){
					if(angular.isDefined(newValue) && newValue!=null ){
						var videoUrl = newValue.video;
						if(angular.isUndefined(videoUrl)||videoUrl==''){
							videoUrl = newValue.html;
						}
						var index = VideoHelper.isSharedUrl(videoUrl);
						if(index>-1){
							if(iframe==null){
								iframe = $('<iframe width="850" height="480" frameborder="0" allowfullscreen="" ></iframe>');
							}
							iframe.attr('src',VideoHelper.getIFrameUrl(videoUrl,index));
							viewport.append(iframe);
						}else{
							var id = "videojs" + Math.floor(Math.random() * 100);
							if(videoElement == null){
								videoElement=$('<video id="'+id+'" class="video-js vjs-default-skin" controls preload="auto" width="850" height="480" data-setup="{}"></video>');
								viewport.append(videoElement);
							}
							setup.poster = newValue.thumbnail;
							player = videojs(videoElement.attr('id'), setup, function() {
				                this.src({
				                    type: 'video/mp4',
				                    src: videoUrl
				                });

				                try{
					                this.error(function(){
					                	onPlayError(newValue);
					                });
				                }catch (e) {
								}
				                try{
				                	this.on('error',function(){
					                	onPlayError(newValue);
					                });
				                }catch (e) {
				                	//处理异常
								}
				            });
						}
					}
				});


				function onPlayError(video){
					if(angular.isDefined(scope.ngPlayError) && typeof(scope.ngPlayError) === 'function'){
                		scope.ngPlayError(video);
                	}
				}

				//清理
				scope.$on('$destroy',function(){
					if(angular.isDefined(player) && player != null) {
						player.dispose();
					}
				});

				scope.close = function(){
					if(iframe != null){
						iframe.remove();
					}

					if(player !=null){
						player.pause();
					}

					scope.ngClose();
				}

			}
		};

	}]);
