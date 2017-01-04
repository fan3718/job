/**
 * 练习相关service
 */
import app from 'app';

import './HttpClient';
import './ReportService';
import './Toolkit';
export default app.factory('ExamService',['$q','$http','HttpClient','ReportService','Toolkit',function($q,$http,HttpClient,ReportService,Toolkit){
		$http.defaults.headers.common['X-TECHU-AUTH'] = Toolkit.getCookie("safeToken");
		var section = {
				'0':'视频',
				'1':'单选题',
				'2':'填空题',
				'9':'解答题'
		};

		/**
		 * 提取section名字
		 */
		function formatSectionName(rawName){
			//去掉括号中的内容
			//二、填空题（每题3分，共30分） - >二、填空题
			//rawName=rawName.replace(/（.*）/,'')
			var infos = rawName.split(/（.*）/);
			var result =infos[0].split(/、|．/);
			var res = infos[0];
			if(result.length>=2){
				res =  result[1];
			}
			res = res.replace(/[^\u4e00-\u9fa5]/gi,"");

			//if(res.indexOf('：')>-1){
				//res = res.split('：')[0];
			//}

			return res;
		}

		var service = {

				/**
				 * 筛选试卷
				 * @param subjectCode 学科编号
				 * @param areaCode 区域编号
				 * @param year 年份
				 * @param gradeNo 年级
				 * @param paperType 试卷类型
				 * @param page 页码
				 */
				filterExamPaper : function(subjectCode,areaCode,year,gradeNo,paperType,page,ps){
					var defer = $q.defer();
					var param = {};

					param.subject = subjectCode;
					param.area = areaCode || 0;
					param.year = year || 0;
					param.grade = gradeNo || 0;
					param.type = paperType || 0;
					param.p = page || 0;
					param.ps = ps || 20;

					HttpClient.post('/ajax/exam/filter',param).success(function(result){
						if(result.code == 1){
							var res = {};
							res.total = result.total;
							res.papers = result.exams;
							defer.resolve(res);
						}else{
							defer.reject(result.msg);
						}
					}).error(function(){
						defer.reject('网络出现异常');
					});

					return defer.promise;
				},
				/**
				 * 收藏试卷
				 * @param paperId 试卷id
				 * @param subjectCode 学科编号
				 */
				addFavorPaper:function(paperId,subjectCode){
					var defer = $q.defer();
					var params = {};
					params.targetId = paperId;
					params.type=1;
					params.subjectCode = subjectCode;

					HttpClient.post('/ajax/favorite/web/add',params).success(function(result){
						if(result.code == 1){
							defer.resolve(result.isFirst);
						}else{
							defer.reject(result.msg);
						}
					}).error(function(){
						defer.reject('网络出现异常');
					});

					return defer.promise;

				},
				/**
				 * 移除收藏
				 */
				removeFavorPaper:function(paperId,subjectCode){
					var defer = $q.defer();
					var params = {};
					params.targetId = paperId;
					params.type=1;
					params.subjectCode = subjectCode;
					HttpClient.post('/ajax/favorite/web/remove',params).success(function(result){
						if(result.code == 1){
							defer.resolve();
						}else{
							defer.reject(result.msg);
						}
					}).error(function(){
						defer.reject('网络出现异常');
					});
					return defer.promise;
				},
				assign:function(params){
					var defer = $q.defer();
					params = params || {};
					if(angular.isUndefined(params.name)||params.name.trim()==''){
						defer.reject('作业不能为空');
						return defer.promise;
					}
					//校验数据
					$http.post('/ajax/exam/assign',params).success(function(result){
						if(result.code == 1){
							defer.resolve(result);
						}else{
							defer.reject(result.msg);
						}

					}).error(function(){
						defer.reject('网络出现异常');
					});
					return defer.promise;
				},
				/**
				 * 根据练习ID获取试卷详情
				 */
				getDetailByExerId:function(exerId){
					var defer = $q.defer();

					var param = {};
					param.exerId = exerId;
					HttpClient.post('/ajax/exam/web/paper/detail',param).success(function(result){
						if(result.code == 1){
							var info = result.detail;
							if(angular.isDefined(info) && info!=null){
								//是否收藏
								info.isFavor = result.isFavor || false;
								if(angular.isDefined(info.groupTitleList)){
									info.groupTypes = [];
									var item =null;
									info.scores = [];
									var index = 0;
									angular.forEach(info.groupTitleList,function(title){
										item = {};
										item.title = title;
										item.count = info.questionTable[title].length || 0;
										item.type = info.questionTable[title][0].type;
										item.name = section[''+item.type];
										item.name = formatSectionName(title);
										item.selectedCount =  0;
										item.scoreInfos = [];
										item.index=index;
										index++;
										var scoreInfo = null;
										if(item.name.indexOf('选择')>-1 || item.name.indexOf('填空')>-1){
											scoreInfo = {};
											scoreInfo.score = 3;
											scoreInfo.index = -1;
											item.scoreInfos.push(scoreInfo);
											var scoreArr = [];
											for(var i=0;i<item.count;i++){
												scoreArr.push(3);
											}
											info.scores.push(scoreArr);
										}else{
											var scoreArr = [];
											for(var i=0;i<item.count;i++){
												scoreInfo = {};
												scoreInfo.score = 10;
												scoreInfo.index = i;
												scoreArr.push(10);
												item.scoreInfos.push(scoreInfo);
											}
											info.scores.push(scoreArr);
										}
										info.groupTypes.push(item);
									});
								}
							}
							defer.resolve(info);
						}else{
							defer.reject(result.msg);
						}
					}).error(function(){
						defer.reject('网络出现异常');
					});




					return defer.promise;
				},
				/**
				 * 获取试卷详情
				 * @param paperId 试卷id
				 * @param subjectCode 学科编号
				 */
				getDetailById:function(paperId,subjectCode,type){
					var defer = $q.defer();
					var param = {};
					param.subject = subjectCode;
					param.id=paperId;
					param.type = type || 0;

					HttpClient.post('/ajax/exam/web/detail',param).success(function(result){
						if(result.code == 1){
							var info = result.detail;
							if(angular.isDefined(info)&& info !=null){
								var quests = result.quests;
								//是否收藏
								info.isFavor = result.isFavor || false;
								if(angular.isDefined(info.groupTitleList)){
									info.groupTypes = [];
									var item =null;
									info.scores = [];
									var index = 0;

									var questionTable = info.questionTable;

									angular.forEach(info.groupTitleList,function(title){
										item = {};
										item.title = title;
										item.count = info.questionTable[title].length || 0;
										item.type = info.questionTable[title][0].type;
										item.name = section[''+item.type];
										item.name =formatSectionName(title);
										item.selectedCount =  0;
										item.scoreInfos = [];
										item.index=index;
										index++;
										var scoreInfo = null;
										if(item.name.indexOf('选择')>-1 || item.name.indexOf('填空')>-1){
											scoreInfo = {};
											scoreInfo.score = 3;
											scoreInfo.index = -1;
											item.scoreInfos.push(scoreInfo);
											var scoreArr = [];
											for(var i=0;i<item.count;i++){
												scoreArr.push(3);
											}
											info.scores.push(scoreArr);
										}else{
											var scoreArr = [];
											for(var i=0;i<item.count;i++){
												scoreInfo = {};
												scoreInfo.score = 10;
												scoreInfo.index = i;
												scoreArr.push(10);
												item.scoreInfos.push(scoreInfo);
											}
											info.scores.push(scoreArr);
										}
										info.groupTypes.push(item);
										//组装题目
										if(angular.isDefined(quests) && quests!=null){
											angular.forEach(questionTable[title],function(ques){
												var id = ques.id;
												var item = quests[id];
												if(item){
													for(var key in item){
														ques[key]  = item[key];
													}
												}
											});
										}
									});
								}
							}

							defer.resolve(info);
						}else{
							defer.reject(result.msg);
						}
					}).error(function(){
						defer.reject('网络出现异常');
					});

					return defer.promise;
				},
				reportExam:function(exerId){
					var defer = $q.defer();
					HttpClient.get('/ajax/report/web/exam/general?eid='+exerId).success(function(result){
						if(result.code == 1){

							var needLoadPaper = false;

							if(angular.isDefined(result.done)){
								needLoadPaper = result.done.length>0;
							}

							if(!needLoadPaper&&angular.isDefined(result.finished)){
								needLoadPaper = result.finished.length>0;
							}

							if(needLoadPaper){
								var paperId = result.paper.id;
								var qids = result.paper.qids;

								//存储每道题的标号
								var questOrderInfo = {};
								//console.log(qids);
								service.getDetailById(paperId,result.subjectCode).then(function(paper){
									//console.log(paper);
									var assignments = [];
									if(angular.isDefined(paper) && paper!=null){
										var order = 0;
										angular.forEach(paper.groupTitleList,function(title){
											var quests = paper.questionTable[title];
											angular.forEach(quests,function(quest){
												if(qids.indexOf(quest.id)!=-1){
													order++;
													questOrderInfo[quest.id] = order;
												}
											});

										});
									}

									//完成未批改
									if(angular.isDefined(result.done)){
										angular.forEach(result.done,function(assign){
											assign.done = true;
											assign.weight=3;
											//错题标号
											var wrongNumbers = [];
											var isEmpty = true;
											var number =null;
											if(angular.isDefined(assign.scoreJson) &&assign.scoreJson != null){
												var corrects = assign.scoreJson.corrects;
												angular.forEach(corrects,function(correct){
													if(correct.score ==0){
														number = questOrderInfo[correct.qid];
														if(number){
															isEmpty = false;
															wrongNumbers.push(number);
														}
													}
												});
											}
											assign.wrongNumberInfo = isEmpty ?'--':wrongNumbers.join('、');
											assignments.push(assign);
										});
									}
									//完成已批改
									if(angular.isDefined(result.finished)){
										angular.forEach(result.finished,function(assign){
											assign.done = true;
											var corrects = assign.scoreJson.corrects;
											var wrongNumbers = [];
											var isEmpty = true;
											var number =null;
											angular.forEach(corrects,function(correct){
												if(correct.score ==0){
													number = questOrderInfo[correct.qid];
													if(number){
														isEmpty = false;
														wrongNumbers.push(number);
													}
												}
											});
											assign.wrongNumberInfo = isEmpty ?'--':wrongNumbers.join('、');
											assign.weight=1;
											assignments.push(assign);
										});
									}
									if(angular.isDefined(result.notDone)){
										var index = 1;
										var stuName = null;
										angular.forEach(result.notDone,function(assign){
											assign.done = false;
											stuName = assign.studentName;
											if(angular.isUndefined(stuName) || stuName ==null){
												assign.weight=3;
												assign.studentName = '新用户'+index;
												index++;
											}else{
												assign.weight=2;
											}
											assignments.push(assign);
										});
									}
									result.assignments = assignments;
									defer.resolve(result);
								});
							}else{
								var assignments = [];
								//完成未批改
								if(angular.isDefined(result.done)){
									angular.forEach(result.done,function(assign){
										assign.done = true;
										assign.weight=3;
										assign.wrongNumberInfo = assign.wrongNumbers.join('、');
										assignments.push(assign);
									});
								}
								//完成已批改
								if(angular.isDefined(result.finished)){
									angular.forEach(result.finished,function(assign){
										assign.done = true;
										assign.wrongNumberInfo = assign.wrongNumbers.join('、');
										assign.weight=1;
										assignments.push(assign);
									});
								}

								if(angular.isDefined(result.notDone)){
									var index = 1;
									var stuName = null;
									angular.forEach(result.notDone,function(assign){
										assign.done = false;
										stuName = assign.studentName;
										if(angular.isUndefined(stuName) || stuName ==null){
											assign.weight=3;
											assign.studentName = '新用户'+index;
											index++;
										}else{
											assign.weight=2;
										}
										assignments.push(assign);
									});
								}
								result.assignments = assignments;
								defer.resolve(result);
							}
							}else{
								defer.reject(result.msg);
							}

					}).error(function(){
						defer.reject('网络出现异常');
					});
					return defer.promise;
				},
				/**
				 * 获取学生用户的 单次套卷
				 */
				getUserExamReport:function(exerId,assignId,isView){
					var defer = $q.defer();
					isView = isView || false;

					//获取报告

					ReportService.getExamAssignReport(exerId,assignId).then(function(result){

						service.getDetailById(result.examId,result.subjectCode).then(function(paper){
							//整理试卷去掉多余的题目

							var paperInfo = {};
							paperInfo.groupInfoList =[];
							//计算总分
							var paperScore = 0;
							var qidMap = {};
							var qids =[];
							var tabIndex = 0;

							var quesIndex = 0;
							//未批改题目的下标
							var unCorrectedIndex =-1;
							var unCorrectedTabIndex = 0;

							//记录最后一个主观题
							var  lastSubjective = {
									tab:0,
									index:-1
							};
							angular.forEach(paper.groupTitleList,function(title){
								var item = {};
								var quests = paper.questionTable[title];
								var sectionName = formatSectionName(title);
								item.sectionName = sectionName;
								//分数情况
								var scoreInfo = {
										scores:[],
										totalScore:0,
										questionCount:0
								};

								var sectionCode = 0;
								var questions = [];
								var totalScore =0;
								var count = 0;
								//是否是相同分数
								var isSameScore = true;
								var lastScore = -1;
								quesIndex = 0;
								angular.forEach(quests,function(quest){
									//如果该题被选中了，才添加进去
									var report = result.questions[quest.id];
									if(angular.isDefined(report)){
										sectionCode = report.sectionCode;
										var answer = report.answer;
										if(sectionCode ==1 || answer==''  || isView){ //如果是选择题或者答案为空
											report.corrected = true;
											if(answer =='' || angular.isUndefined(report.score)){
												report.score = 0;
											}
										}
										quest.report=report;
										questions.push(quest);
										totalScore+=report.points;
										count++;
										paperScore += (report.score||0);
										if(lastScore <0){
											lastScore = report.points;
										}else{
											if(isSameScore){
												isSameScore = lastScore == report.points;
											}
											lastScore = report.points;
										}

										scoreInfo.scores.push(report.points);
										if(!report.corrected && unCorrectedIndex ==-1){
											unCorrectedIndex = quesIndex;
											unCorrectedTabIndex = tabIndex;
										}
										if(sectionCode != 1){
											lastSubjective = {
													tab:tabIndex,
													index:quesIndex
											};
										}
										qids.push(quest.id);
										qidMap[quest.id] = {
												tab:tabIndex,
												index:quesIndex
										};

										quesIndex++;
									}
								}); //end quests forEach
								item.questions = questions;

								//过滤掉不存在题目的分类

								if(item.questions.length>0){
									item.sectionCode = sectionCode;
									scoreInfo.totalScore =totalScore;
									scoreInfo.questionCount = count;
									scoreInfo.isSameScore = isSameScore;
									item.scoreInfo = scoreInfo;
									paperInfo.groupInfoList.push(item);

									tabIndex ++;
								}

							}); //end groupTitleList forach

							paperInfo.score = paperScore;
							for(var key in result){
								if(key != 'questions'){
									paperInfo[key] = result[key];
								}
							}
							paperInfo.lastSubjective = lastSubjective;
							paperInfo.tabIndex = unCorrectedTabIndex;
							paperInfo.qidMap = qidMap;
							paperInfo.qids = qids;
							paperInfo.unCorrectedIndex = unCorrectedIndex==-1?0:unCorrectedIndex;
							defer.resolve(paperInfo);

						},function(msg){
							defer.reject(msg);
						});
					},function(msg){
						defer.reject(msg);
					});
					return defer.promise;
				},
                /*
                 * 上传批改图片资源
                 * */
                correctImageData:function(exerId,assignId,data){
                    var defer = $q.defer();
                    var params = {};
                    params.eid = exerId;
                    params.aid = assignId;
                    params.data = data;

                    HttpClient.post('/ajax/exam/save/track',params).success(function(result){
                        if(result.code == 1){
                            defer.resolve(result);
                        }else{
                            defer.reject(result.msg);
                        }
                    }).error(function(){
                        defer.reject('网络故障');
                    });
                    return defer.promise;
                },
				/**
				 * 批改题目
				 */
				correctQuestion:function(exerId,assignId,scoreJson,action){
					var defer = $q.defer();
					var params = {};
					params.eid = exerId;
					params.aid = assignId;
					params.scoreJson = scoreJson;
					params.action =action|| 'save';

					HttpClient.post('/ajax/exam/web/correct',params).success(function(result){
						if(result.code == 1){
							defer.resolve();
						}else{
							defer.reject(result.msg);
						}
					}).error(function(){
						defer.reject('网络故障');
					});
					return defer.promise;
				},
				getSectionName:function(name){
					return formatSectionName(name);
				},
				/**
				 * 获取收藏的试卷
				 */
				getFavoritePaper:function(p,ps){
					var defer = $q.defer();
					p = p||0;
					ps=ps ||40;
					HttpClient.get('/ajax/favorite/web/list?type=1&p='+p+'&ps='+ps).success(function(result){
						if(result.code == 1){

							var res = {};
							res.count = result.count;
							//加载试卷数据
							var papers = [];
							console.info(result.favorites)
							angular.forEach(result.favorites,function(favorite){
								service.getDetailById(favorite.targetId,favorite.subjectCode).then(function(paper){
									paper.subjectCode = favorite.subjectCode;
									papers.push(paper);
								},function(msg){
									//defer.reject(msg);
								});
							});
							res.papers = papers;
							defer.resolve(res);
						}else{
							defer.reject(result.msg);
						}
					}).error(function(){
						defer.reject('网络故障');
					});
					return defer.promise;

				}


		};
		return service;
	}]);
