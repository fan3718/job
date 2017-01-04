/**
 * 三方视频工具服务
 */

import app from 'app';

export default	app.factory('VideoHelper',[function(){
		
		//三方分享视频域名
		var shareVideoDomain = ['56.com','iqiyi.com','youku.com','sohu.com'];
		
		var shareIFramePrefix = ['http://www.56.com/iframe/','','http://player.youku.com/embed/'];
		
		var PLAYER_PREFIX_URL = "http://www.zuoyetong.com.cn/video/player?url=";
		
		var SCIRPT_PLAYER_INDEX = 1000;
		
		var SHARED_PLAYER_INDEX = 1001;
		/**
		 * 获取56站点上面视频ID
		 * 
		 */
		function get56VideoId(url){
			url = (url||'');
			var index = url.indexOf('.html');
			if(index >-1){
				url = url.substring(0,index);
				var params = url.split('/');
				if(params.length>0){
					return params[params.length-1].split('v_')[1];
				}
			}
			return url;
		}
		
		function getYoukuVideoId(url){
			url = (url||'');
			var index = url.indexOf('.html');
			if(index >-1){
				url = url.substring(0,index);
				var params = url.split('/');
				if(params.length>0){
					return params[params.length-1].split('id_')[1];
				}
			}
			return url;
		}
		
		var helper = {
				isSharedUrl : function(url){
					url = url||'';
					var tmpUrl= url.toLowerCase();
					
					
					
					if(tmpUrl.indexOf('<script')==0){
						
						return SCIRPT_PLAYER_INDEX;
					}
					if(tmpUrl.indexOf('.mp4')==-1){
						//判断视频文件地址还是三方分享地址
						if(tmpUrl.indexOf('http://') ==0){
							tmpUrl=tmpUrl.substring(7);
						}
						if(tmpUrl.indexOf('https://') ==0){
							tmpUrl=tmpUrl.substring(8);
						}
						var domain = tmpUrl.split('/')[0];
						for(var i=0;i<shareVideoDomain.length;i++){
							if(domain.indexOf(shareVideoDomain[i])>-1){
								return i;
							}
						}
						return SHARED_PLAYER_INDEX;
					}
					return -1;
				},
				getIFrameUrl : function(url,index){
					index=index || this.isSharedUrl(url);
					switch(index){
					case SCIRPT_PLAYER_INDEX:
						var result = {};
						result.width = 840;
						result.height = 470;
						var src = $(url).attr('src');
						var params = {};
						var index = src.indexOf('?');
						if(index != -1){
							var domain = src.substring(0,index);
							//if(window.location.href.indexOf('https://')==0){
								//domain = domain.replace('http://','https://');
							//}
							var query = src.substring(index+1);
							var p = query.split('&');
							for(var i=0;i<p.length;i++){
								var pi = p[i].split('=');
								params[pi[0]] = pi[1];
							}
							//params.width = 840;
							//params.height = 470;
							params.width = '100%';
							params.height = '100%';
							var ps = [];
							for(var key in params){
								ps.push(key+"="+params[key]);
							}
							src=domain+"?"+ps.join('&');
						}
						result.url = PLAYER_PREFIX_URL+encodeURIComponent(src);
						return result;
					case SHARED_PLAYER_INDEX:
						var result = {};
						result.width = 840;
						result.height = 840;
						result.url = url;
						return result;
					case 0:
						return shareIFramePrefix[0]+get56VideoId(url);
					case 2:
						
						return shareIFramePrefix[2]+getYoukuVideoId(url);
					}
					
					return url;
				}
		};
		return helper;
	}]);
	