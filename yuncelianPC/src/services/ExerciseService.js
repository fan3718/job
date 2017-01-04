/**
 * 练习相关service
 */
import app from 'app';
import './Toolkit';
export default app.factory('ExerciseService',['$http','$q','Toolkit','CacheService',function($http,$q,Toolkit,CacheService){
		$http.defaults.headers.common['X-TECHU-AUTH'] = Toolkit.getCookie("safeToken");
		var PREFIX_URL = "/ajax/exercise";
		var service = {
				getVideoInfo:function(extId){
					var defer = $q.defer();
					$http.get('/video/'+extId).success(function(result){
						if(result.code == 1){
							defer.resolve(result.video);
						}else{
							defer.reject(result.msg);
						}
					}).error(function(){
						defer.reject('网络发生故障');
					});
					return defer.promise;
				},
				/**
				 *
				 * 获取时间轴
				 */
				getTimeline : function(type,classID){
					var defer = $q.defer();
					if(angular.isUndefined(type)){
						type = 1;
					}
					if(classID){
                        var str="&classID="+classID;
                    }else{
                        var str='';
                    }
					$http.get(PREFIX_URL+'/timeline?type='+type+str).success(function(result){
						if(result.code == 1){
							defer.resolve(result.timeline);
						}else{
							defer.reject(result.msg);
						}
					}).error(function(){
						defer.reject('网络发生故障');
					});

					return defer.promise;
				},
				/**
				 * 筛选作业
				 */
				filterExercise : function(params){
					params = params||{};
					var defer = $q.defer();
					$http.post(PREFIX_URL+'/filter',params).success(function(result){
						if(result.code == 1){
							defer.resolve(result.exercises);
						}else{
							defer.reject(result.msg);
						}
					}).error(function(){
						defer.reject('网络发生故障');
					});
					return defer.promise;
				},
				loadAssignments :function(exerId){
					var defer = $q.defer();
					var promise = defer.promise;
					$http.post('/ajax/exercise/assignment/'+exerId).success(function(result){
						if(result.code == 1){
							//处理没有用户昵称的情况
							var assignments = result.assignments;
							var stuName = null;
							var index = 1;
							angular.forEach(assignments,function(assign){
								stuName = assign.studentName;
								if(angular.isUndefined(stuName) || stuName ==null){
									assign.weight = 2;
									assign.studentName = '新用户'+index;
									index++;
								}else{
									assign.weight = 1;
								}
							});
							defer.resolve(assignments);
						}else{
							defer.reject(result.msg);
						}
					}).error(function(){
						defer.reject('网络发生故障');
					});
					return promise;
				},
				loadExerciseDetail:function(uid,eid){
					var defer = $q.defer();
					var promise = defer.promise;
					$http.get(PREFIX_URL+'/questions/?uid='+uid+'&eid='+eid+'&key="pc"&sign="pc"').success(function(result){
						if(result.code == 1){
							defer.resolve(result);
						}else{
							defer.reject(result.msg);
						}
					}).error(function(){
						defer.reject('网络发生故障');
					});
					return promise;
				},
                loadQuestions:function(assignId){
                    var defer = $q.defer();
                    var promise = defer.promise;
                    $http.get(PREFIX_URL+'/questions/'+assignId+'?key="pc"&sign="pc"').success(function(result){
                        if(result.code == 1){
                            defer.resolve(result);
                        }else{
                            defer.reject(result.msg);
                        }
                    }).error(function(){
                        defer.reject('网络发生故障');
                    });
                    return promise;
                },
                getPaperReport:function(id){
                    var defer = $q.defer();
                    var promise = defer.promise;
                    $http.get(PREFIX_URL+'/report/'+id).success(function(result){
                        if(result.code == 1){
                            defer.resolve(result);
                        }else{
                            defer.reject(result.msg);
                        }
                    }).error(function(){
                        defer.reject('网络发生故障');
                    });
                    return promise;
                },
				assignMessage:function(params){
					params = params||{};
					var defer = $q.defer();
					var promise = defer.promise;

					var abstra = params['abstract'] ||'';

					var pics = params.images || [];
					if(abstra=='' &&pics.length==0){
						defer.reject('请输入消息的内容或插入图片');
						return promise;
					}
					var classIds = params.classIds||[];

					if(classIds.length==0){
						defer.reject('请选择班级');
						return promise;
					}
					var now = new Date().getTime();
					var serverTime = window.__SERVER_TIME__ || now;


					if(params.startTime<now){
						//本地时间大于服务器时间
						if(now>serverTime){
							params.startTime = serverTime;
							params["dueTime"] = serverTime + 259200000;
						}else{
							params.startTime = now;
							params["dueTime"] = now + 259200000;
						}
					}


					//拼接html，兼容之前版本数据
					var html ='';
					angular.forEach(pics,function(pic){
						html +='<span><i><img src="'+pic.url+'" alt="" class="message-img" data-id="'+pic.imgId+'"/></i><em></em></span>\n';
					});
					params.html = html;

					$http.post('/message/assign',params).success(function(result){
						if(result.code == 1){
							defer.resolve(result.exercises);
						}else{
							defer.reject(result.msg);
						}
					}).error(function(){
						defer.reject('网络发生故障');
					});
					return promise;
				},
				assignExercise:function(params){
					params = angular.copy(params||{});
					var defer = $q.defer();
					var promise = defer.promise;

					if(angular.isUndefined(params.name)||params.name ==''){
						defer.reject('请输入练习名称');
						return promise;
					}


					var startTime = new Date(params.startDate +" "+ params.startTime);
					var now = new Date().getTime();
					//5分钟容错
					if(Math.floor(startTime.getTime()/1000/60)<Math.floor((now-5*60*1000)/1000/60)){
						defer.reject('开始时间不能早于当前时间');
						return promise;
					}

					var endTime = new Date(params.endDate +" "+params.endTime);
					if(endTime.getTime()<startTime.getTime()){
						defer.reject('结束时间不能早于开始时间');
						return promise ;
					}
					//时间精确到分钟
					params.startTime = Math.floor(startTime.getTime()/1000/60)*60*1000;
					params.endTime = Math.floor(endTime.getTime()/1000/60)*60*1000;
					$http.post('/exercise/assign',params).success(function(result){
						if(result.code == 1){
							defer.resolve(result.exercises);
						}else{
							defer.reject(result.msg);
						}
					}).error(function(){
						defer.reject('网络发生故障');
					});
					return promise;
				},
				/**
				 * 提醒
				 * @param id
				 * type ==1 为exerciseID
				 * tyoe==2 为Assignment
				 *
				 * @type
				 * 1 代表练习（默认）
				 * 2 代表Assignment
				 */
				remind : function(id,type){
					var defer = $q.defer();
					var promise = defer.promise;
					if(id<=0){
						defer.reject('参数不正确');
						return promise;
					}
					type = type || 1;

					$http.post('/ajax/exercise/remind/'+type+'-'+id).success(function(result){
						if(result.code == 1){
							//返回受影响的条数
							defer.resolve(result.count);
						}else{
							defer.reject(result.msg);
						}
					}).error(function(){
						defer.reject('网络发生故障');
					});

					return promise;
				},
				/**
				 * 批改消息作业
				 */
				correctMessage : function(param){
					var defer = $q.defer();
					var promise = defer.promise;
					$http.post('/message/correct',param).success(function(result){
						if(result.code == 1){
							defer.resolve();
						}else{
							defer.reject(result.msg);
						}
					}).error(function(){
						defer.reject('网络发生故障');
					});
					return promise;
				},
				/**
				 * 改变消息状态
				 */
				changeMessageStatus:function(params){
					params.key='pc';
					params.sign='pc';
					var defer = $q.defer();
					var promise = defer.promise;
					//$http.post('/ajax/exercise/status/change',params);
					$.post('/ajax/exercise/status/change',params);

				},
				/**
				 * 更改时间
				 * @param params
				 * <pre>
				 * {
				 * 	uid:1000,
				 * 	eid:eid,
				 * 	json:"{
				 * 		startDate:100000,
				 * 		dueDate:1000
				 * 	}"
				 * }
				 * </pre>
				 */
				changeTime:function(params){
					params = params || {};
					params.key='pc';
					params.sign='pc';
					var defer = $q.defer();
					var promise = defer.promise;
					$.post('/ajax/exercise/change',params,function(result){
						if(result.code == 1){
							defer.resolve();
						}else{
							defer.reject(result.msg);
						}
					},'json');
					return promise;
				},
				/**
				 * 标记查看微课
				*
				 * @param eid:作业id
				 * @param aid:学生id
				 * @param vid:视频id
				 */
				markVideo:function(eid,aid,vid){
					var params = {};
					params.key='pc';
					params.sign='pc';
					params.aid=aid;
					params.eid=eid;
					params.vid=vid;
					var defer = $q.defer();
					var promise = defer.promise;
					$.post('/ajax/exercise/mark/video',params);
					return promise;
				},
				/**
				 * 识字写字 获取教材版本
				 *
				 * @param subjectId:科目Id
				*/
				getBookversionBySubject: function (subjectId){
					var defer = $q.defer();
					var promise = defer.promise;
					$http.get('/ajax/word/bookversion?key=pc&sign=xxx&subject='+subjectId).success(function(result){
						if(result.code == 1){
							defer.resolve(result);
						}else{
							defer.reject(result.msg);
						}
					}).error(function(){
						defer.reject('网络发生故障');
					});
					return promise;
				},
				/**
				 * 识字写字 获取年级
				 *
				 * @param bookversionId:教材版本Id
				 * @param subjectId:科目Id
				*/
				getGrades: function (bookversionId, subjectId){
					var defer = $q.defer();
					var promise = defer.promise;
					$http.get('/ajax/word/grade/'+bookversionId+'?key=pc&sign=xxx&subject='+subjectId).success(function(result){
						if(result.code == 1){
							defer.resolve(result);
						}else{
							defer.reject(result.msg);
						}
					}).error(function(){
						defer.reject('网络发生故障');
					});
					return promise;
				},
				/**
				 * 识字写字 获取章节
				 *
				 * @param gradeId:年级Id
				 * @param subjectId:科目Id
				*/
				getSections: function (gradeId, subjectId){
					var defer = $q.defer();
					var promise = defer.promise;
					$http.get('/ajax/word/sections/'+gradeId+'?key=pc&sign=xxx&subject='+subjectId).success(function(result){
						if(result.code == 1){
							defer.resolve(result);
						}else{
							defer.reject(result.msg);
						}
					}).error(function(){
						defer.reject('网络发生故障');
					});
					return promise;
				},
				/**
				 * 布置识字写字
				 *
				 * @param data
				*/
				assignQues: function (data){
					var params = angular.copy(data||{});
					var defer = $q.defer();
					var promise = defer.promise;

					if(angular.isUndefined(params.name)||params.name ==''){
						defer.reject('请输入练习名称');
						return promise;
					}


					var startTime = new Date(params.startDate +" "+ params.startTime);
					var now = new Date().getTime();
					//5分钟容错
					if(Math.floor(startTime.getTime()/1000/60)<Math.floor((now-5*60*1000)/1000/60)){
						defer.reject('开始时间不能早于当前时间');
						return promise;
					}

					var endTime = new Date(params.endDate +" "+params.endTime);
					if(endTime.getTime()<startTime.getTime()){
						defer.reject('结束时间不能早于开始时间');
						return promise ;
					}
					//时间精确到分钟
					params.startTime = Math.floor(startTime.getTime()/1000/60)*60*1000;
					params.dueTime = Math.floor(endTime.getTime()/1000/60)*60*1000;

					var str = '?'
					for(var key in params){
						if (params.hasOwnProperty(key)){
							str += key +'='+params[key]+'&';
						}
					}
					$http.post('/ques/ajax/assign'+str.substr(0,str.length-1)).success(function(result){
						if(result.code == 1){
							defer.resolve(result);
						}else{
							defer.reject(result.msg);
						}
					}).error(function(){
						defer.reject('网络发生故障');
					});
					return promise;
				},
				/**
				 * 口算 获取年级
				 *
				*/
				getCalclationGrades: function (){
					var defer = $q.defer();
					var promise = defer.promise;
					$http.get('/ajax/calculation/grades?key=pc&sign=xxx').success(function(result){
						if(result.code == 1){
							defer.resolve(result);
						}else{
							defer.reject(result.msg);
						}
					}).error(function(){
						defer.reject('网络发生故障');
					});
					return promise;
				},
				/**
				 * 口算 获取章节
				 *
				 * @param gradeId:年级Id
				 * @param subjectId:科目Id
				*/
				getCalclationChapters: function (gradeId){
					var defer = $q.defer();
					var promise = defer.promise;
					$http.get('/ajax/calculation/chapters/tree?gid='+gradeId+'&key=pc&sign=xxx').success(function(result){
						if(result.code == 1){
							defer.resolve(result);
						}else{
							defer.reject(result.msg);
						}
					}).error(function(){
						defer.reject('网络发生故障');
					});
					return promise;
				},
				/**
				 * 删除练习
				*/
				deleteExercise: function (uid,eid){
					var defer = $q.defer();
					$http.post(PREFIX_URL+'/delete?uid='+uid+'&eid='+eid+'&key="pc"&sign="pc"').success(function(result){
						if(result.code == 1){
							defer.resolve(result.code);
						}else{
							defer.reject(result.msg);
						}
					}).error(function(){
						defer.reject('网络发生故障');
					});
					return defer.promise;
				},
				/**
				 * 删除练习
				*/
				isExistExercise: function (eid){
					var defer = $q.defer();
					$http.post(PREFIX_URL+'/isExist?eid='+eid+'&key="pc"&sign="pc"').success(function(result){
						if(result.code == 1){
							defer.resolve(result.code);
						}else if(result.code == 0){
							defer.resolve(result.code);
						}else{
							defer.reject(result.msg);
						}
					}).error(function(){
						defer.reject('网络发生故障');
					});
					return defer.promise;
				}
		};

		return service;
	}]);
