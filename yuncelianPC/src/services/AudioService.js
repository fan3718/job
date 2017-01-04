/**
 * 音频服务
 */

import app from 'app';
import Audio5js from 'audio5';

export default app.factory('AudioService',['$q',function($q){
		  var params = {
				    swf_path:require('../vendors/audio5js/audio5js.swf'),
				    throw_errors:true,
				    format_time:true
				  };
		  var audio5js = new Audio5js(params);
		  var service={
				  play : function (src){
					  var defer = $q.defer();
					  audio5js.load(src);
					  audio5js.seek(0);
					  audio5js.play();
					  audio5js.on('timeupdate',function(position, duration){
						  var notify = {};
						  notify.type = 'timeupdate';
						  notify.position = position;
						  notify.duration = duration;
						  defer.notify(notify);
					  });
					  audio5js.on('play',function(){
						  var notify = {};
						  notify.type = 'play';
						  defer.notify(notify);
					  });
					  /*audio5js.on('progress',function(load_percent){
						  var notify = {};
						  notify.type = 'progress';
						  notify.percent = load_percent;
						  defer.notify(notify);
					  });*/
					  audio5js.on('ended',function(load_percent){
						  var notify = {};
						  notify.type = 'ended';
						  defer.resolve(notify);
					  });
					  
					  audio5js.on('error', function (error) {
						  defer.reject(error);
					    });
					  return defer.promise;
				  }
		  };
		  return service;
	}]);