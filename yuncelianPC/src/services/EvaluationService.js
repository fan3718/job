
import app from 'app';
import './HttpClient';
import './Toolkit';

export default	app.factory('EvaluationService',['$http','$q','HttpClient','Toolkit',function($http,$q,HttpClient,Toolkit){
		$http.defaults.headers.common['X-TECHU-AUTH'] = Toolkit.getCookie("safeToken");
		
		var evaluationType = ['','逻辑思维能力','记忆能力','学习积极性','学习注意力','阅读能力'];
		
		var evaluationDesc = [
		        //占位置 0
				[],
				//逻辑思维能力 1
				[
				         '你的逻辑思维能力非常差，你关于逻辑思维基本规律的理解都是错误的，你根本不了解逻辑思维的方法也很难将自己的想法清楚明白的表达出来。你迫切需要掌握正确的逻辑推理的基本方法，这对你将来的学习和生活都有非常重要的意义。',
				         '你的逻辑思维能力较差，对逻辑思维的基本规律也知之甚少，你平时可能花了很多时间去学习知识，但是却不能掌握他们之间的关系。另外逻辑思维能力差也会是你的表达很难让人明白，你需要从基础出发，掌握基本的逻辑思维规律，更好的改进自己。',
				         '你的逻辑思维能力中等，对逻辑思维的规律掌握的还不熟练，有些逻辑思维的推导方法也是错误的。你应该有意识的去寻找对合适自己的逻辑思维方法并且加强这方面的训练，掌握逻辑思维能力能够帮你在学习中更好理解知识的关系，提升学习效果。',
				         '你的逻辑思维能力比较好，能够解决比较常见的逻辑问题，但是你可能对一些逻辑思维的方法不太了解，今后可以通过分析与综合、抽象与概括、分类与比较、归纳与演绎等方法强化自己的逻辑思维能力，不断提升自己逻辑能力，更好帮助自己认识客观事物，表达自己思想。',
				         '你的逻辑思维能力非常好，这种能力有助于你正确认识客观事物，帮助你更好地去学习知识和表达自己思想。在逻辑思维中，需要不断用到概念、判断、推理等思维形式和比较、分析、综合、抽象、概括等方法，掌握正确的逻辑思维能力，对你今后的学习会有很大的帮助。'
				],
				//记忆能力 2
				[
				        '你的记忆能力极差，急需改进。你的记忆方法都是错误的或者根本没有意识到记忆方法的重要性，直接导致了你的记忆效果差，学习效率低下。你迫切需要掌握正确的记忆方法与技巧，不能忽视正确的记忆方法及技巧对于学习的重大帮辅意义。',
				        '你的记忆能力较差，需要改进。你的记忆方法不太正确，比如将容易混淆的东西放在一起去记忆，浪费了时间也没取得好的效果；或者是学习之后没能尽早复习巩固记忆，这些都导致你的记忆效果不好，你需要改进自己的记忆方法，尽量多掌握一些记忆技巧。',
				        '你的记忆能力一般。你所运用的记忆方法有些是正确的，有些却是错误的，总体记忆效率低下。你应该有目的有意识的去寻求、分辨适合自己的正确记忆方法，改进那些错误的方法，提高记忆效率，只有这样才能提升你的记忆能力，提高自己的学习效率及成绩。',
				        '你的记忆能力较好，记忆方法基本也是正确的。但可能对一些记忆技巧还不太了解，不能熟练运用到学习、生活当中。如能多掌握一些记忆技巧，并加以训练，以便能够在学习中熟练使用，有的放矢，既能提升记忆能力，也能迅速提高自己的学习成绩。',
				        '你的记忆能力非常好，记忆方法也非常正确：保持兴趣，先理解后记忆，运用归纳法、分部法等，并且擅长关联记忆；不将易混淆的东西放在一块儿记忆；学习之后能保证尽早复习等。掌握并运用正确的记忆方法，往往会促使你在学习之路上事半功倍。'
				],
				//积极性 3
				[
				            '你的学习积极性极低。你几乎从不做课前预习，上课注意力不集中或者只能集中前十几分钟；你很少主动完成老师布置的作业，甚至可能根本不去做；对于自己没兴趣的知识点，更不会费心搞清楚；不在乎成绩差，学习的主动性太低，严重缺乏学习积极性。',
				            '你缺乏学习积极性。你基本不会做课前预习，课下巩固、课后复习就更别提了，甚至老师布置的作业有时你也不能完成；学习时非常容易受干扰，特别容易分心；成绩差也不以为意，没有学习的乐趣，从不独立思考问题，学习积极性急需提升。',
				            '你的学习积极性一般。你有时候能够做到课前预习、课后复习，有时则会因为某些原因中断；你会认真对待老师布置的作业，不打折扣地完成；但你可能不会主动完成老师没有布置的学习任务，遇到难题也会选择搁置或求助于他人，学习的自主性还有待提升。',
				            '你的学习积极性较强。课前你会做好相关准备，上课听讲也比较认真，学习中遇到的难题一般能够解决；基本上可以做到“今日事，今日毕”，并且对第二天的功课提前预习；对有难度的知识点有挑战的兴趣，能够独立解决问题，学习自主性比较强。',
				            '你的学习积极性很强。你认为学习是一件快乐的事，每次课前你都会预习；上课认真听讲，有不明白的问题能及时寻求解决方法；无论遇到什么事情你也不会耽误学习，课下完成作业后你仍会继续学习，挑战更有难度的题目，你学习的主动性很强。'
				],
				//注意力 4
				[
				          '你的学习注意力集中程度极差。你可能在听课、做作业、考试时都很无法集中精力，以致学习表现与成绩一塌糊涂。虽然有天生因素，但对于绝大多数人来说，都是可以克服的。你应该多接受专门老师的指导与训练，把平时的不足补上来。',
				          '你的学习注意力集中程度很差。你可能在听课、做作业、考试时难以集中精力，以致学习表现与成绩很差。对于学习的漫不经心态度，或天生学习注意力稳定性不强等因素，都严重影响着你的学习质量。调整心态，必要时进行一些专门针对注意力的强化训练，也可以向老师请教。',
				          '你的学习注意力集中程度较差。你可能在听课、做作业、考试时较难集中精力，以致学习表现与成绩较差。你的注意力程度还未达到及格线，所以面临两种选择：一是向前走，经过改正会成为良好者中的一员；一是向后退，不以目前的状况为忧，使你的注意力弱化下去。',
				          '你的学习注意力集中程度为较好。除偶尔的走神外，你在听课、做作业、考试时都能集中注意力。如果你能有意识地经常进行一些注意力方面的专业训练，你的学习成绩应该会上一个台阶。',
				          '你集中注意力的能力非常强，在学习、工作中一定以效率高著称。集中注意力会是你以后持续进步并领先他人的宝贵能力，希望你能始终坚持。'
				],
				//阅读能力 5
				[
				         '你的阅读能力极差，急需改进。你没有阅读的兴趣，也没有任何阅读技巧；阅读时你根本没有目的，随意性极强，注意力严重分散；你对阅读内容的结构也没有了解，抓不到阅读内容的重点，记忆力差，导致了你的阅读效率极其低下，急需改进。',
				         '你的阅读能力较差，需要改正。你没能掌握基本的阅读技巧；阅读时也几乎没有目的，随意性较强，注意力自然不会集中；很难判断阅读内容的重点，不能完全领会作者的写作意图；再加上记忆力也许不是很好，导致了阅读效率比较低下，需要改进。',
				         '你的阅读能力一般。你只掌握了少量的阅读技巧，不能特别熟练的运用；阅读目的不是太清晰，因此注意力不是太集中；不能迅速准确的分出阅读内容的结构，造成重点不明确，难以领会作者真正的写作意图；没有自己独立的思考，你的阅读习惯有待改进。',
				         '你的阅读能力较强。你对阅读感兴趣，并掌握了一定的阅读技巧，阅读时拥有一个相对明确的目的，注意力比较集中；基本上能正确判断阅读内容的结构，抓到阅读内容的重点，领会作者的写作意图；头脑中会有针对性的冒出一些问题，阅读效率较高。',
				         '你的阅读能力非常强。你认为阅读是一件快乐的事，并熟练掌握了丰富的阅读技巧；你怀有明确的阅读目的，能够做到全神贯注，可以迅速抓到阅读内容的重点；阅读中能总结不同作者的写作风格；头脑中会有针对性的冒出许多问题，阅读效率非常高。'
				]
				
		];
		
		var levelDesc = ['简单','一般','适中','较难','特难'];
		
		
		var gradeNames = ['','一年级','二年级','三年级','四年级','五年级','六年级','初一','初二','初三','初四','高一','高二','高三'];
		
		function getScoreIndex(score){
			if(score<21){
				return 0;
			}else if(score <41){
				return 1;
			}else if(score < 61){
				return 2;
			}else if(score <81){
				return 3;
			}else{
				return 4;
			}
		}
		
		
		function joinAbilityName(arr,suffix){
			var length = arr.length;
			if(length>2){
				return (arr.slice(0,length-1).join('、')+'和'+arr[length-1]+suffix);
			}else{
				return (arr.join('和')+suffix);
			}
		}
		
		
		return {
			getEvaluationType:function(type){
				return evaluationType[type];
			},
			/**
			 * 查询学能评测试题
			 */
			findCompetenceQuestion:function(type){
				var defer = $q.defer();
				var params = {};
				params.type = type;
				HttpClient.post('/ajax/evaluation/web/find/competence',params).success(function(result){
					if(result.code == 1){
						defer.resolve(result.questions);
					}else{
						defer.reject(result.msg);
					}
				}).error(function(){
					defer.reject('服务器内部错误');
				});
				return defer.promise;
			},
			/**result
			 * 查询学科评测的试题
			 */
			findSubjectQuestion:function(subjectCode,level,grade,count,knowledges,qids){
				var defer = $q.defer();
				
				var params = {};
				params.subject = subjectCode;
				params.level = level;
				params.grade = grade;
				params.count = count;
				
				if(angular.isDefined(knowledges)){
					params.knowledges =knowledges;
				}
				if(angular.isDefined(qids)){
					params.qids =qids;
				}
				HttpClient.post('/ajax/evaluation/web/find/subject',params).success(function(result){
					if(result.code == 1){
						defer.resolve(result.questions);
					}else{
						defer.reject(result.msg);
					}
				}).error(function(){
					defer.reject('服务器内部错误');
				});
				return defer.promise;
			},
			/**
			 * 在已有评测中添加新的评测段
			 */
			saveSections:function(id,sections){
				var defer = $q.defer();
				var promise = defer.promise;
				
				var params = {};
				
				params.evaluationId = id;
				var data = {};
				data.sections = sections;
				
				params.json = angular.toJson(data);
				
				HttpClient.post('/ajax/evaluation/web/save/section',params).success(function(result){
					if(result.code == 1){
						defer.resolve();
					}else{
						defer.reject(result.msg);
					}
				}).error(function(){
					defer.reject('服务器内部错误');
				});
				return promise;
			},
			/**
			 * 
			 */
			save:function(params,sections){
				
				var defer = $q.defer();
				var promise = defer.promise;
				params.stuName = params.stuName || '';
				if(Toolkit.trim(params.stuName) == ''){
					defer.reject('姓名不能为空');
					return promise;
				}
				params.age =  params.age || '';
				if(isNaN(parseInt(params.age))){
					defer.reject('年龄格式不正确');
					return promise;
				}
				params.phone = params.phone || '';
				if(!Toolkit.isMobile(params.phone)){
					defer.reject('手机号码格式不正确');
					return promise;
				}
				
				var grade = params.grade || 1;
				params.gradeName = gradeNames[grade];
				
				var data = {};
				data.sections = sections;
				
				params.json = angular.toJson(data);
				
				HttpClient.post('/ajax/evaluation/web/save',params).success(function(result){
					if(result.code == 1){
						defer.resolve(result.evaluation);
					}else{
						defer.reject(result.msg);
					}
				}).error(function(){
					defer.reject('服务器内部错误');
				});
				return promise;
			},
			/**
			 * 根据老师id查询该老师创建的评测
			 */
			findEvaluationByUser:function(p,ps,phone){
				var defer = $q.defer();
				var params = {};
				params.phone = phone|| '';
				params.p = p|| 0;
				params.ps = ps ||20;
				HttpClient.post('/ajax/evaluation/web/find',params).success(function(result){
					if(result.code == 1){
						defer.resolve(result.evaluations);
					}else{
						defer.reject(result.msg);
					}
				}).error(function(){
					defer.reject('服务器内部错误');
				});
				return defer.promise;
			},
			/**
			 * @param isRaw 
			 */
			getEvaluationDetail : function(id,isRaw){
				var defer = $q.defer();
				var params = {};
				params.eid = id;
				isRaw = isRaw || false;
				HttpClient.post('/ajax/evaluation/web/detail',params).success(function(result){
					if(result.code == 1){
						var report = {};
						report.evaluation = result.evaluation;
						report.sections = result.sections;
						
						var abilityCate = {
								excellent:[],
								good:[],
								poor:[]
						};
						
						var sectionMap = {
								
						};
						
						var subjectMap = {
								
						};
						if(angular.isDefined(report.sections) && !isRaw){
							angular.forEach(report.sections,function(section){
								
								if(section.type!=200){
									section.name = evaluationType[section.type];
									var index = getScoreIndex(section.score);
									section.desc = evaluationDesc[section.type][index];
									if(index<=2){ //较差
										abilityCate.poor.push(section.name);
									}else if(index <=4){ //良好
										abilityCate.good.push(section.name);
									}else{ //优秀
										abilityCate.excellent.push(section.name);
									}
								}else{
									//统计难度等级
									
									var levelsCount = [0,0,0,0,0];
									
									
									var levelInfo = [];
									
									for(var i=0;i<5;i++){
										var info = {};
										
										
										info.count = 0;
										info.rightCount = 0;
										
										levelInfo.push(info);
									}
									
									//知识点map
									var knowledgeMap = {};
									
									var resultJson = JSON.parse(section.resultJson);
									var quesNum = resultJson.count;
									var correctNum = 0;
									angular.forEach(resultJson.questions,function(question){
										
										levelsCount[question.level-1]++;
										
										var info=levelInfo[question.level-1];
										info.count++;
										var item = knowledgeMap[question.knowledge];
										if(angular.isUndefined(item)){
											item = {};
											item.count = 0;
											item.correctCount = 0;
											item.name = question.knowledge;
											knowledgeMap[question.knowledge] = item;
										}
										item.count++;
										if(question.userAnswer == question.rightAnswer){
											item.correctCount++;
											info.rightCount++;
											correctNum++;
										}
										
									});
									
									
									 var maxLevel ={};
								     var maxCount = 0;
								     
								     
								     for(var i=0;i<levelInfo.length;i++){
								    	 var info = levelInfo[i];
								    	 info.level = i;
								    	 if(info.count>=maxCount){
								    		 maxCount =  info.count;
								    		 maxLevel = info;
								    	 }
								     }
								     
								    var levelPercent = Math.round(maxLevel.rightCount / maxLevel.count * 1000)/10;
								    
								    var wrongCount = maxLevel.count - maxLevel.rightCount;
								    var wrongDesc = '';
								    if(wrongCount >0 && wrongCount!=maxLevel.count){
								    	wrongDesc ="仅"+wrongCount+"题错误，";
								    }else{
								    	wrongDesc =wrongCount+"题错误，";
								    }
								    
								    var levelCaption = "学生答题多分布在难度" + levelDesc[maxLevel.level] + "的题目， 共" + maxLevel.count + "道，"+wrongDesc+" 正确率为" + levelPercent + "%。"
								    if(maxLevel.level<4){
								    	var info = levelInfo[maxLevel.level+1];
								    	if(info.count ==0){
								    		levelPercent = Math.round(info.rightCount / info.count * 1000)/10;
									    	wrongCount = info.count - info.rightCount;
									    	 
									       wrongDesc = '';
										    if(wrongCount >0){
										    	wrongDesc ='错误'+wrongCount+"题，";
										    }
										    levelCaption += "在难度"+levelDesc[info.level]+"的题目中，共"+info.count+"题，"+wrongDesc+"正确率为"+levelPercent+"%。";
								    	}
								    	
								    }
								    
									section.levelCaption = levelCaption;
									section.levelsCount = levelsCount;
									section.knowledgeMap = knowledgeMap;
									
									section.questionCount = quesNum;
									section.correctCount = correctNum;
									
									
									
									var knowledgeCount = 0;
									
									var maxPercent = 0;
									var minPercent =0;
									var maxKnowledges = [];
									var minKnowledges = [];
									
									var knowledgePercentMap = {};
									var otherCount = 0;
									for(var knowledge in knowledgeMap){
										knowledgeCount++;
										var item = knowledgeMap[knowledge];
									    var percent = Math.round(item.correctCount / item.count * 1000)/10;
									    item.percent = percent;
									    if(percent>=maxPercent){
									    	maxPercent = percent;
									    	otherCount --;
									    }
									    
									    if(percent <= minPercent ||minPercent==0){
									    	minPercent = percent;
									    	otherCount --;
									    }
									    var percentItem = knowledgePercentMap[''+percent];
									    
									    if(angular.isUndefined(percentItem)){
									    	percentItem = {};
									    	percentItem.knowledges = [];
									    	percentItem.percent = percent;
									    	
									    	 knowledgePercentMap[''+percent]=percentItem;
									    }
									    percentItem.knowledges.push(knowledge);
									}
									
									otherCount += knowledgeCount;
									var knowledgeCaption = '本次测试题目共'+quesNum+'题，分布在'+knowledgeCount+'个知识点。';
									 knowledgeCaption += "其中" + joinAbilityName(knowledgePercentMap[''+maxPercent].knowledges,'')+ "知识点下的题目的准确率" + maxPercent + "%，而" +  joinAbilityName(knowledgePercentMap[''+minPercent].knowledges,'')  + "知识点下题目的准确率" + minPercent
					                    + "%"
					                    if(otherCount > 0){
					                    	knowledgeCaption+="，其他" + otherCount + "个知识点掌握程度一般。";
					                    }else{
					                    	knowledgeCaption+="。";
					                    }
									  knowledgeCaption+="请老师根据学生的弱项，进行针对性指导。";
					                  section.knowledgeCaption = knowledgeCaption;
								}
								
								if(section.type ==200){
									subjectMap[parseInt((section.subjectCode)%10)+""] =section; 
								}else{
									sectionMap[section.type+""] =section; 
								}
								
							});
						}
						
						var arr =[];
						var isHasBefore = false;
						if(abilityCate.excellent.length>0){
							isHasBefore = true;
							arr.push(joinAbilityName(abilityCate.excellent,'优秀'));
						}
						if(abilityCate.good.length>0){
							isHasBefore = true;
							arr.push(joinAbilityName(abilityCate.good,'良好'));
						}
						if(abilityCate.poor.length>0){
							var prefix = '';
							if(isHasBefore){
								prefix = '但是';
							}
							arr.push(prefix+joinAbilityName(abilityCate.poor,'较差')+"，需要提升");
						}
						
						report.evaluation.abstra = arr.join('，');
						report.sectionMap = 	sectionMap;
						report.subjectMap = 	subjectMap;
						defer.resolve(report);
					}else{
						defer.reject(result.msg);
					}
				}).error(function(){
					defer.reject('服务器内部错误');
				});
				return defer.promise;
			}
		};
	}]);