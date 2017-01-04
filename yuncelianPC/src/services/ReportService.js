
import app from 'app';

import './HttpClient';
import './Toolkit';
export default app.factory('ReportService',['$q','$http','$filter','HttpClient','Toolkit',function($q,$http,$filter,HttpClient,Toolkit){
		$http.defaults.headers.common['X-TECHU-AUTH'] = Toolkit.getCookie("safeToken");
		var service = {
				/**
				 * 获取学期分组报告
				 * @return
				 * <pre>
				 * [
				 * 		{
				 * 			term:201502,
				 * 			termName:"2015年下学期",
				 * 			reports:[
				 * 					{
				 * 							term:201502,
				 * 							termName:"2015年下学期",
				 * 							className:"测试班级",
				 * 							assignTotal:100,
				 * 							avgScore:"100",
				 * 							avgCompletePercent:0.2,
				 * 							avgComplete:"100",
				 * 							avgDuration:100.0,
				 * 							assignStuCount:50,
				 * 							completeStuCount:24,
				 * 							classID:1024,
				 * 							subjectID:8,
				 * 							subjectName:"数学"
				 * 					}
				 * 			]
				 * 		}
				 * 
				 * 
				 * ]
				 * </pre>
				 */
				getTermReports : function(term,offset){
					var params = {};
					
					offset = offset || 5;
					term = term ||0;
					params.offset = offset;
					if(term > 0){
						params.term = term;
					}
					var defer = $q.defer();
					HttpClient.post('/ajax/report/term',params).success(function(result){
						if(result.code ==1){
							var terms = [];
							var infos = [];
							var item = null;
							angular.forEach(result.reports,function(report){
								var term = report.term;
								if(terms.indexOf(term) <0){
									item = {};
									item.term = term;
									item.termName = report.termName;
									item.reports = [];
									terms.push(term);
								}
								item.reports.push(report);
								if(infos.indexOf(item)<0){
									infos.push(item);
								}
							});
							defer.resolve(infos);
						}else{
							defer.reject(result.msg);
						}
					}).error(function(){
						defer.reject("服务器内部错误");
					});
					return defer.promise;
				},
				/**
				 * 获取班级某个学期，某个学科的报告
				 * @param classId
				 * @param subjectId
				 * @param term
				 */
				getClassTermReport : function(classId,subjectId,term){
					var params = {};
					params.classID = classId;
					params.subject = subjectId;
					params.term = term;
					
					var defer = $q.defer();
					HttpClient.post('/ajax/report/class/term/detail',params).success(function(result){
						if(result.code ==1){
							var info = {};
							info.assignTotal = 0;
							info.studentReports = result.studentReports;
							angular.forEach(info.studentReports,function(studentReport){
								if(angular.isDefined(studentReport.reports) && studentReport.reports.length >0){
									studentReport.report = studentReport.reports[0];
									if(info.assignTotal<studentReport.report.assignTotal){
										info.assignTotal = studentReport.report.assignTotal;
									}
									
								}else{
									studentReport.report = {};
								}
							});
							info.studentSize = result.studentSize;
							defer.resolve(info);
						}else{
							defer.reject(result.msg);
						}
					}).error(function(){
						defer.reject("服务器内部错误");
					});
					return defer.promise;
				},
				/**
				 * 获取学生某个学期的错题本数据
				 * @param studentId  学生id
				 * @param subjectId 学科id
				 * @param term 学期
				 * @param year 年
				 * @param month 月 -1 表示全部
				 * @param page 页码
				 * @param pageSize 每次加载条数
				 */
				getStudentWrongNote:function(studentId,subjectId,term,year,month,page,pageSize){
					var params = {};
					params.uid = studentId;
					params.subjectId = subjectId;
					params.term = term;
					var now = new Date();
					params.year = year || now.getFullYear();
					params.month = month || -1;
					params.p = page || 0;
					params.ps = pageSize || 20;
					var defer = $q.defer();
					HttpClient.post('/ajax/report/wrong/note',params).success(function(result){
						if(result.code ==1){
							var info = {};
							//对数据进行分组处理
							var questions = [];
							var item = null;
							var key = '';
							angular.forEach(result.questions,function(question){
								var time = $filter('date')(question.assignTime,'yyyy/MM/dd');
								if(time != key){
									key = time;
									item = {};
									item.date = time;
									item.quests = [];
								}
								item.quests.push(question);
								if(questions.indexOf(item)<=-1){
									questions.push(item);
								}
							});
							info.groups = questions;
							info.totalCount = result.totalCount;
							info.wrongCount = result.wrongCount;
							info.assignCount = result.assignCount;
							defer.resolve(info);
						}else{
							defer.reject(result.msg);
						}
					}).error(function(){
						defer.reject("服务器内部错误");
					});
					return defer.promise;
				},
				/**
				 * 获取班级错题本
				 * 
				 * @param classId 班级ID
				 * @param term 学期
				 * @param p 
				 * @param ps
				 */
				getClassWrongNote:function(classId,term,year,month,p,ps){
					var params = {};
					params.classId = classId;
					params.term = term;
					params.year = year;
					params.month = month;
					params.p =p || 0;
					params.ps =ps || 20;
					var defer = $q.defer();
					HttpClient.post('/ajax/report/class/wrong/note',params).success(function(result){
						if(result.code ==1){
							var info = {};
							info.totalCount = result.questionTotal;
							info.exerciseCount = result.exerciseCount;
							var wrongQuestCount = 0;
							if(angular.isDefined(result.qusReports)){
									//数据按日期合并
									var qusReports = [];
									var item = null;
									var key = '';
									angular.forEach(result.qusReports,function(report){
										var time = $filter('date')(report.assignTime,'yyyy/MM/dd');
										wrongQuestCount++;
										if(time != key){
											key = time;
											item = {};
											item.date = time;
											item.reports = [];
										}
										//计算百分比
										var distribution=report.answerDistribution;
										if(report.sectionCode == 1){
											var total = distribution['A'].length+distribution['B'].length+distribution['C'].length+distribution['D'].length;
											if(total>0){
												var opts = ['A','B','C','D'];
												var distri = [];
												for(var i=0;i<opts.length;i++){
													var info={};
													info.percent = distribution[opts[i]].length/total;
													info.names = distribution[opts[i]].join('、');
													info.count = distribution[opts[i]].length;
													distri.push(info);
												}
												report.distri = distri;
											}
										}else{
											var total = distribution['正确'].length+distribution['错误'].length;
											if(total >0){
												var opts = ['正确','错误'];
												var distri = [];
												for(var i=0;i<opts.length;i++){
													var info={};
													info.percent = distribution[opts[i]].length/total;
													info.names = distribution[opts[i]].join('、');
													info.count = distribution[opts[i]].length;
													distri.push(info);
												}
												report.distri = distri;
											}
										}
										item.reports.push(report);
										if(qusReports.indexOf(item)<=-1){
											qusReports.push(item);
										}
									});
									info.wrongQuestCount = wrongQuestCount;
									info.qusReports = qusReports;
							}
							defer.resolve(info);
						}else{
							defer.reject(result.msg);
						}
					}).error(function(){
						defer.reject("服务器内部错误");
					});
					return defer.promise;
				},
				reportExercise:function(exerId){
					var defer = $q.defer();
					HttpClient.get('/ajax/exercise/report/'+exerId).success(function(result){
						if(result.code==1)	{
							var info = {};
							info.report = result.report;
							
							var assignments = [];
							//完成未批改
							if(angular.isDefined(result.doneList)){
								angular.forEach(result.doneList,function(assign){
									assign.done = true;
									assign.wrongNumberInfo = assign.wrongNumbers.join('、');
									if(assign.status==3){
										assign.weight=3;
									}else{
										assign.weight=1;
									}
									assignments.push(assign);
								});
							}
							
							
							
							//info.finishList = result.doneList;
							
							
							
							//完成已批改
							if(angular.isDefined(result.finishList)){
								angular.forEach(result.finishList,function(assign){
									assign.wrongNumberInfo = assign.wrongNumbers.join('、');
									assign.done = true;
									assign.weight=1;
									assignments.push(assign);
								});
							}
							
							//未完成需要提醒
							//info.unfinishList = result.noDoneList;
							
							if(angular.isDefined(result.noDoneList)){
								var index =1;
								var stuName = null;
								angular.forEach(result.noDoneList,function(assign){
									assign.done = false;
									stuName = assign.studentName;
									if(angular.isUndefined(stuName) || stuName == null){
										assign.weight=3;
										assign.studentName = '新用户'+index;
										index++;
									}else{
										assign.weight=2;
									}
									
									assignments.push(assign);
								});
							}
							info.assignments = assignments;
							defer.resolve(info);
						}else{
							defer.reject(result.msg);
						}
					}).error(function(){
						defer.reject("服务器内部错误");
					});
					return defer.promise;
				},
				/**
				 * 获取单次练习的的错题
				 * @param exerId 练习ID
				 */
				getExerciseWrongNote : function(exerId){
					var defer = $q.defer();
					HttpClient.get('/ajax/report/exercise/wrong/note?exerId='+exerId).success(function(result){
						if(result.code==1)	{
							defer.resolve(result);
						}else{
							defer.reject(result.msg);
						}
					}).error(function(){
						defer.reject("服务器内部错误");
					});
					return defer.promise;
				},
				/**
				 * 获取套卷学生的报告
				 * @param exerId 练习Id
				 * @param assignId  学生id
				 * @param isRaw 是否输出原始参数
				 * false 默认 会将题目的list转换
				 */
				getExamAssignReport:function(exerId,assignId,isRaw){
					var defer = $q.defer();
					isRaw = isRaw|| false;
					HttpClient.get('/ajax/report/web/assignment?exerId='+exerId+"&aid="+assignId).success(function(result){
						if(result.code==1)	{
							if(!isRaw){
								var quests = {};
								angular.forEach(result.questions,function(quest){
									quests[quest.questionId]=quest;
								});
								delete result.questions;
								result.questions = quests;
							}
							defer.resolve(result);
						}else{
							defer.reject(result.msg);
						}
					}).error(function(){
						defer.reject("服务器内部错误");
					});
					
					
					
					
					
					return defer.promise;
				},
				/**
				 * 单次试卷的错题报告
				 */
				getExamWrongNote:function(){
					var defer = $q.defer();
					HttpClient.get('/ajax/report/exercise/wrong/note?exerId='+exerId).success(function(result){
						if(result.code==1)	{
							
							//进行分组处理
							angular.forEach(result.quests,function(quest){
								
								
								
								
								
							});
							
							
							defer.resolve(result);
							
							
							
							
							
							
						}else{
							defer.reject(result.msg);
						}
					}).error(function(){
						defer.reject("服务器内部错误");
					});
					return defer.promise;
				},
                getReportSubject:function(uid){
                    var defer = $q.defer();
                    HttpClient.get('/ajax/report/subjects?uid='+uid).success(function(result){
                        if(result.code==1)	{
                            defer.resolve(result);
                        }else{
                            defer.reject(result.msg);
                        }
                    }).error(function(){
                        defer.reject("服务器内部错误");
                    });
                    return defer.promise;
                },
                getReportStemList:function(role,uid,subject,key,sign){
                    var defer = $q.defer();
                    HttpClient.get('/ajax/report/list/'+role+'?uid='+uid+'&subject='+subject+'&key='+key+'&sign='+sign).success(function(result){
                        result.id=subject;
                        if(result.code==1)	{
                            defer.resolve(result);
                        }else{
                            defer.reject(result.msg);
                        }
                    }).error(function(){
                        defer.reject("服务器内部错误");
                    });
                    return defer.promise;
                },
				getReportDetailHistory:function(data){
                    var defer = $q.defer();
                    var count,startTime,endTime;
                    var url='';
                    if(data['count']){
                         count=data.count;
                         url='/ajax/report/question/history?uid='+data.uid+'&subject='+data.subject+'&count='+count+'&term='+data.term+'&key='+data.key+'&sign='+data.sign;
                    }
                    if(data['startTime'] || data['endTime']){
                        startTime=data.startTime;
                        endTime=data.endTime;
                        url='/ajax/report/question/history?uid='+data.uid+'&subject='+data.subject+'&startTime='+startTime+'&endTime='+endTime+'&term='+data.term+'&key='+data.key+'&sign='+data.sign;
                    }

                    HttpClient.get(url).success(function(result){
                        if(result.code==1)	{
                            result.index=data.index;
                            defer.resolve(result);
                        }else{
                            defer.reject(result.msg);
                        }
                    }).error(function(){
                        defer.reject("服务器内部错误");
                    });
                    return defer.promise;
                }

		};
		return service;
	}]);
	