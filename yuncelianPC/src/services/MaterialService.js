/**
 *  教材相关接口
 */
import app from  'app';
import './CacheService';
import './HttpClient';
import './Toolkit';


export default app.factory('MaterialService',['$q','$sce','$http','HttpClient','CacheService','Toolkit',function($q,$sce,$http,HttpClient,CacheService,Toolkit){
		$http.defaults.headers.common['X-TECHU-AUTH'] = Toolkit.getCookie("safeToken");
		function isNotNull(obj){
			return obj != null && angular.isDefined(obj);
		}

		/**
		 * 记录各个结点的下标
		 */
		function linkChapterPath(chapter){
			if(isNotNull(chapter) && isNotNull(chapter.children) && chapter.children.length>0){
				var child = null;
				var parentPath =  angular.copy(chapter.path||[]);
				var path = null;
				for( var index = 0 ; index < chapter.children.length ; index ++ ){
					child = chapter.children[index];
					path = angular.copy(parentPath);
					path.push(index);
					child.path = path;
					linkChapterPath(child);
				}
			}
		}
		
		function linkChapterTreePath(tree){
			if(isNotNull(tree) && tree.length >0){
				var child = null;
				var path = null;
				for( var index = 0 ; index < tree.length ; index ++ ){
					child = tree[index];
					path = [];
					path.push(index);
					child.path = path;
					linkChapterPath(child);
				}
			}
		}
		
		var service = {
				loadBooks :function(subjectCode){
					var defer = $q.defer();
					subjectCode = subjectCode || 20;
					var key = 'books-v2-'+subjectCode;
					var books = CacheService.get(key);
					if(books ==null || angular.isUndefined(books)){
						HttpClient.get('/catalog/tree/book',{
							subject:subjectCode
						}).success(function(result){
							if(result.code == 1){
								defer.resolve(result.books);
								CacheService.put(key,result.books);
							}else{
								defer.reject(result.msg);
							}
						}).error(function(){
							defer.reject('获取教材失败');
						});
					}else{
						defer.resolve(books);
					}
					return defer.promise;
				},
				/**
				 * 加载教材
				 * @param subject 学科Code
				 */
				loadBookText:function(subjectCode){
					var defer = $q.defer();
					HttpClient.get('/catalog/root',{
						subject:subjectCode
					}).success(function(result){
						//{"code":1,"msg":"success","bookversion":{"3591":"人教版（旧）","37138":"中华书局版","36008":"华师大版","36985":"岳麓版","36876":"人教版《历史与社会》","36703":"人教版","3414":"北师大版（旧）","36196":"冀教版","36516":"鲁教版","36365":"沪教版","35693":"北师大版","35870":"川教版"}}
						if(result.code == 1){
							defer.resolve(result.bookversion);
						}else{
							defer.reject(result.msg);
						}
						
					}).error(function(){
						defer.reject('获取教材失败');
					});
					return defer.promise;
				},
				/**
				 * 加载年级
				 * @param subject 学科
				 * @param textBookID 教材
				 * 
				 */
				loadGrade : function(subjectCode,textBookID){
					var defer = $q.defer();
					HttpClient.get('/catalog/grade/' + textBookID,{
						subject:subjectCode
					}).success(function(result){
						//{"code":1,"msg":"success","grades":[{"ID":"36704","Seq":13,"Name":"七年级上"},{"ID":"36731","Seq":14,"Name":"七年级下"},{"ID":"36757","Seq":15,"Name":"八年级上"},{"ID":"36787","Seq":16,"Name":"八年级下"},{"ID":"36816","Seq":17,"Name":"九年级上"},{"ID":"36848","Seq":18,"Name":"九年级下"}]}
						if(result.code == 1){
							defer.resolve(result.grades);
						}else{
							defer.reject(result.msg);
						}
						
					}).error(function(){
						defer.reject('获取年级失败');
					});
					return defer.promise;
				},
				/**
				 * 加载章节树
				 * @param subjectCode 学科编号
				 * @param gradeID 年级
				 * 
				 */
				loadChapterTree : function(subjectCode,gradeID){
					var defer = $q.defer();
					if(angular.isUndefined(gradeID)||angular.isUndefined(subjectCode)){
						defer.reject('subjectCode AND GradeId cannot not be null or undefined ');
						return defer.promise;
					}
					
					
					var tree = CacheService.get("chapter-"+gradeID+"-"+subjectCode);
					
					if(isNotNull(tree)){
						defer.resolve(tree);
					}else{
						HttpClient.get('/catalog/tree/' + gradeID,{
							subject:subjectCode
						}).success(function(result){
							//{"code":1,"msg":"success","tree":[{"children":[{"children":[],"ID":"36706","Name":"第1课 祖国境内的远古居民"},{"children":[],"ID":"36707","Name":"第2课 原始的农耕生活"},{"children":[],"ID":"36708","Name":"第3课 华夏之祖"}],"ID":"36705","Name":"第一单元 中华文明的起源"},{"children":[{"children":[],"ID":"36710","Name":"第4课 夏、商、西周的兴亡"},{"children":[],"ID":"36711","Name":"第5课 灿烂的青铜文化"},{"children":[],"ID":"36712","Name":"第6课 春秋战国的纷争"},{"children":[],"ID":"36713","Name":"第7课 大变革的时代"},{"children":[],"ID":"36714","Name":"第8课 中华文化的勃兴(一)"},{"children":[],"ID":"36715","Name":"第9课 中华文化的勃兴(二)"}],"ID":"36709","Name":"第二单元 国家的产生和社会变革"},{"children":[{"children":[],"ID":"36717","Name":"第10课 “秦王扫六合”"},{"children":[],"ID":"36718","Name":"第11课 “伐无道，诛暴秦”"},{"children":[],"ID":"36719","Name":"第12课 大一统的汉朝"},{"children":[],"ID":"36720","Name":"第13课 两汉经济的发展"},{"children":[],"ID":"36721","Name":"第14课 匈奴的兴起及与汉朝的和战"},{"children":[],"ID":"36722","Name":"第15课 汉通西域和丝绸之路"},{"children":[],"ID":"36723","Name":"第16课 昌盛的秦汉文化（一）"},{"children":[],"ID":"36724","Name":"第17课 昌盛的秦汉文化（二）"}],"ID":"36716","Name":"第三单元 统一国家的建立"},{"children":[{"children":[],"ID":"36726","Name":"第18课 三国鼎立"},{"children":[],"ID":"36727","Name":"第19课 江南地区的开发"},{"children":[],"ID":"36728","Name":"第20课 北方民族大融合"},{"children":[],"ID":"36729","Name":"第21课 承上启下的魏晋南北朝文化（一）"},{"children":[],"ID":"36730","Name":"第22课 承上启下的魏晋南北朝文化（二）"}],"ID":"36725","Name":"第四单元 政权分立与民族融合"}]}
							if(result.code == 1){
								tree = result.tree;
								linkChapterTreePath(tree);
								defer.resolve(tree);
								CacheService.put("chapter-"+gradeID+"-"+subjectCode,tree);
							}else{
								defer.reject(result.msg);
							}
						}).error(function(){
							defer.reject('获取章节失败');
						});
					}
					
					
					return defer.promise;
				},
				/**
				 * 加载知识点
				 */
				loadKnowledgeTree:function(subjectCode){
					var defer = $q.defer();
					subjectCode = subjectCode || 20;
					var key = 'knowledges-'+subjectCode;
					var tree = CacheService.get(key);
					if(tree ==null || angular.isUndefined(tree)){
						HttpClient.get('/catalog/tree/knowledge',{
							subject:subjectCode
						}).success(function(result){
							if(result.code == 1){
								tree = result.tree;
								linkChapterTreePath(tree);
								defer.resolve(result.tree);
								CacheService.put(key,tree);
							}else{
								defer.reject(result.msg);
							}
						}).error(function(){
							defer.reject('获取知识点失败');
						});
					}else{
						defer.resolve(tree);
					}
					return defer.promise;
				},
				/**
				 * 加载视频
				 * @param subjectCode 学科编号
				 * @param categoryID 章节ID
				 * isKnowledge 为true就是KnowledgeID
				 * @param isKnowledge
				 */
				loadVideos : function(subjectCode,categoryID,isKnowledge,p,ps){
					var defer = $q.defer();
					p = p||1;
					ps = ps ||27;
					var params = {};
					if(isKnowledge){
						params.knowledge = categoryID;
					}else{
						params.cate = categoryID;
					}
					params.p = p-1;
					params.ps = ps;
					params.subject = subjectCode,
					HttpClient.get('/find/videos',params).success(function(result){
						//{"total":3,"quests":[{"html":"http://yangcong345.com/home","video":"http://7xaw4c.com2.z0.glb.qiniucdn.com/%E7%9B%B8%E4%BA%A4%E7%BA%BF%E5%B9%B3%E8%A1%8C%E7%BA%BF_1a_%E5%87%A0%E4%BD%95%E5%AD%A6%E7%9A%84%E5%88%9B%E5%A7%8B%E4%BC%A0%E8%AF%B4_%E6%AC%A7%E5%87%A0%E9%87%8C%E5%BE%97%E5%92%8C%E5%87%A0%E4%BD%95%E5%8E%9F%E6%9C%AC.mp4", "thumbnail":"http://img4.imgtn.bdimg.com/it/u=446512898,775354706&fm=21&gp=0.jpg","title":"洋葱教你做数学题"},{"html":"http://www.jx101.cn/html/cxxxjxsp/9708.html","video":"http://www.56.com/u61/v_MTA4MjEzNzM4.html#fromoutpvid=MTA4MjEzNzM4", "thumbnail":"http://img3.imgtn.bdimg.com/it/u=745984498,248855075&fm=21&gp=0.jpg","title":"野生郭冬临有两条腿..."},{"html":"http://www.jx101.cn/html/cxxxjxsp/2347.html","video":"http://www.56.com/u18/v_NzA3OTYwOTU.html", "thumbnail":"http://img0.imgtn.bdimg.com/it/u=1623134076,4069421452&fm=21&gp=0.jpg","title":"兔儿爷历险记"}]}
						if(result.code == 1){
							defer.resolve((result.quests||[]));
						}else{
							defer.reject(result.msg);
						}
					}).error(function(){
						defer.reject('获取视频失败');
					});
					return defer.promise;
				},
				/**
				 * @param json
				 * <pre>
				 *  {page:'1',"query":[{"count":1,"id":"36733","type":"exercise"},{"count":1,"id":"36734","type":"exercise"},{"count":1,"id":"36735","type":"exercise"},{"count":1,"id":"36736","type":"exercise"},{"count":1,"id":"36737","type":"exercise"},{"count":1,"id":"36738","type":"exercise"},{"count":1,"id":"36742","type":"exercise"},{"count":1,"id":"36743","type":"exercise"},{"count":1,"id":"36744","type":"exercise"},{"count":1,"id":"36745","type":"exercise"},{"count":1,"id":"36749","type":"exercise"},{"count":1,"id":"36750","type":"exercise"},{"count":1,"id":"36751","type":"exercise"}]}
				 * </pre>
				 * 
				 * @return
				 * <pre>
				 * {\"total\":500,\"quests\":[{\"Knowledge\":[{\"Value\":\"比的性质\",\"Key\":\"64\"}],\"Title\":\"2015•长沙\",\"Options\":[\"1.2\",\"2.4\",\"4.8\",\"9.6\"],\"Content\":\"两个数的比值是1.2，如果比的前项扩大2倍，后项缩小两倍，比值是（　　）\",\"Difficulty\":3,\"Type\":1,\"ID\":\"4ecb3a9c-407d-4ede-8625-f5fb6785ab05\"},{\"Knowledge\":[{\"Value\":\"比的意义\",\"Key\":\"61\"}],\"Title\":\"2015•松滋市校级模拟\",\"Options\":[\"1：10\",\"1：11\",\"10：11\"],\"Content\":\"把10克盐溶解在100克水中，盐与盐水的重量比是（　　）\",\"Difficulty\":2,\"Type\":1,\"ID\":\"3fa4fd69-ae6a-4a81-a1a9-431be652dea5\"},{\"Knowledge\":[{\"Value\":\"比的意义\",\"Key\":\"61\"},{\"Value\":\"简单的工程问题\",\"Key\":\"3A\"}],\"Title\":\"2015•重庆校级模拟\",\"Options\":[\"<span class=\\\"MathJye\\\" mathtag=\\\"math\\\" style=\\\"whiteSpace:nowrap;wordSpacing:normal;wordWrap:normal\\\"><table cellpadding=\\\"-1\\\" cellspacing=\\\"-1\\\" style=\\\"margin-right:1px\\\"><tr><td style=\\\"border-bottom:1px solid black\\\">1</td></tr><tr><td>10</td></tr></table></span>﹕<span class=\\\"MathJye\\\" mathtag=\\\"math\\\" style=\\\"whiteSpace:nowrap;wordSpacing:normal;wordWrap:normal\\\"><table cellpadding=\\\"-1\\\" cellspacing=\\\"-1\\\" style=\\\"margin-right:1px\\\"><tr><td style=\\\"border-bottom:1px solid black\\\">1</td></tr><tr><td>12</td></tr></table></span>\",\"12﹕10\",\"5﹕6\"],\"Content\":\"学校到书店，甲用12分钟，乙用10分钟，甲和乙的速度比是（　　）\",\"Difficulty\":3,\"Type\":1,\"ID\":\"0e7a7c40-fa38-433b-8a04-5357eb86b55f\"},{\"Knowledge\":[{\"Value\":\"比例的应用\",\"Key\":\"69\"}],\"Title\":\"2015春•兴国县校级月考\",\"Options\":[\"5：4\",\"<span class=\\\"MathJye\\\" mathtag=\\\"math\\\" style=\\\"whiteSpace:nowrap;wordSpacing:normal;wordWrap:normal\\\"><table cellpadding=\\\"-1\\\" cellspacing=\\\"-1\\\" style=\\\"margin-right:1px\\\"><tr><td style=\\\"border-bottom:1px solid black\\\">1</td></tr><tr><td>5</td></tr></table>：<table cellpadding=\\\"-1\\\" cellspacing=\\\"-1\\\" style=\\\"margin-right:1px\\\"><tr><td style=\\\"border-bottom:1px solid black\\\">1</td></tr><tr><td>4</td></tr></table></span>\",\"4：5\"],\"Content\":\"从甲地到乙地，客车和货车所用的时间比是4：5，那么它们的速度之比是（　　）\",\"Difficulty\":3,\"Type\":1,\"ID\":\"d61ebb67-f581-4b7d-ba66-bda8d69d4cce\"},{\"Knowledge\":[{\"Value\":\"比的意义\",\"Key\":\"61\"},{\"Value\":\"长方体和正方体的体积\",\"Key\":\"AC\"}],\"Title\":\"2015春•盐都区校级期中\",\"Options\":[\"1：2\",\"1：4\",\"1：8\",\"1：16\"],\"Content\":\"两个正方体的棱长之比是1：2，那么，它们的体积之比是（　　）\",\"Difficulty\":2,\"Type\":1,\"ID\":\"26508f89-ca51-45dd-8a49-9df3da4070bd\"},{\"Knowledge\":[{\"Value\":\"比的意义\",\"Key\":\"61\"}],\"Title\":\"2015春•瓯海区校级期中\",\"Options\":[\"<span class=\\\"MathJye\\\" mathtag=\\\"math\\\" style=\\\"whiteSpace:nowrap;wordSpacing:normal;wordWrap:normal\\\"><table cellpadding=\\\"-1\\\" cellspacing=\\\"-1\\\" style=\\\"margin-right:1px\\\"><tr><td style=\\\"border-bottom:1px solid black\\\">2</td></tr><tr><td>5</td></tr></table></span>：<span class=\\\"MathJye\\\" mathtag=\\\"math\\\" style=\\\"whiteSpace:nowrap;wordSpacing:normal;wordWrap:normal\\\"><table cellpadding=\\\"-1\\\" cellspacing=\\\"-1\\\" style=\\\"margin-right:1px\\\"><tr><td style=\\\"border-bottom:1px solid black\\\">3</td></tr><tr><td>4</td></tr></table></span>\",\"8：15\",\"15：8\"],\"Content\":\"甲数的<span class=\\\"MathJye\\\" mathtag=\\\"math\\\" style=\\\"whiteSpace:nowrap;wordSpacing:normal;wordWrap:normal\\\"><table cellpadding=\\\"-1\\\" cellspacing=\\\"-1\\\" style=\\\"margin-right:1px\\\"><tr><td style=\\\"border-bottom:1px solid black\\\">2</td></tr><tr><td>5</td></tr></table></span>等于乙数的<span class=\\\"MathJye\\\" mathtag=\\\"math\\\" style=\\\"whiteSpace:nowrap;wordSpacing:normal;wordWrap:normal\\\"><table cellpadding=\\\"-1\\\" cellspacing=\\\"-1\\\" style=\\\"margin-right:1px\\\"><tr><td style=\\\"border-bottom:1px solid black\\\">3</td></tr><tr><td>4</td></tr></table></span>（甲数、乙数不为0），那么数乙与甲数的比是（　　）\",\"Difficulty\":3,\"Type\":1,\"ID\":\"c089e598-2428-4e45-ac45-89121e585c19\"},{\"Knowledge\":[{\"Value\":\"比的意义\",\"Key\":\"61\"},{\"Value\":\"圆柱的展开图\",\"Key\":\"8N\"}],\"Title\":\"2015春•西安校级期中\",\"Options\":[\"1：π\",\"1：1\",\"1：2π\",\"1：2\"],\"Content\":\"把一个圆柱体的侧面展开后，恰好得到一个正方形，那么这个圆柱体底面半径与高的比是（　　）\",\"Difficulty\":3,\"Type\":1,\"ID\":\"15c9e93d-d92c-4842-9212-1bb485df3733\"},{\"Knowledge\":[{\"Value\":\"比的意义\",\"Key\":\"61\"}],\"Title\":\"2015春•静海县校级期中\",\"Options\":[\"1：10\",\"1：11\",\"10：11\",\"11：10\"],\"Content\":\"把10克糖溶解在100克水里，糖和水的比是（　　）\",\"Difficulty\":4,\"Type\":1,\"ID\":\"7a28e487-68a9-4342-b3df-430c785c1c9f\"},{\"Knowledge\":[{\"Value\":\"比的意义\",\"Key\":\"61\"}],\"Title\":\"2015春•合肥校级期中\",\"Options\":[\"1：9\",\"1：10\",\"1：11\"],\"Content\":\"在10克水中放入1克盐，盐与盐水的克数比是（　　）\",\"Difficulty\":2,\"Type\":1,\"ID\":\"5380528f-ac19-439b-97bb-9d780321aff2\"},{\"Knowledge\":[{\"Value\":\"比例的应用\",\"Key\":\"69\"}],\"Title\":\"2015春•中山期中\",\"Options\":[\"800千米\",\"90千米\",\"900千米\"],\"Content\":\"在比例尺是1：6000000的地图上，量得南京到北京的距离是15厘米，南京到北京的实际距离大约是（　　）千米．\",\"Difficulty\":3,\"Type\":1,\"ID\":\"14ead362-71f0-40a1-8f82-a6bd3aa77195\"}]}
				 * </pre>
				 */
				loadQuestions : function(subjectCode,json,isKnowledge){
					var defer = $q.defer();
					HttpClient.post('/find/ques/'+ subjectCode,{
						json:json,
						isKnowledge:isKnowledge,
						v:2
					}).success(function(result){
						if(result.code == 1){
							defer.resolve(result);
						}else{
							defer.reject(result.msg);
						}
					}).error(function(){
						defer.reject('获取试题失败');
					});
					return defer.promise;
				},
				loadQuestionsDetail:function(qids,subjectCode){
					var defer = $q.defer();
					var params = {};
					params.qids = qids||[];
					params.subjectCode = subjectCode||'';
					$http.post('/find/ques/multi/detail',params).success(function(result){
						if(result.code == 1){
							defer.resolve(result.quests);
						}else{
							defer.reject(result.msg||'未知错误');
						}
					}).error(function(){
						defer.reject('网络故障');
					});
					return defer.promise;
				},
				/**
				 * 获取章节试题
				 */
				loadChapterQuesions:function(subjectCode,cate,type,p,ps){
					var defer = $q.defer();
					p = p||1;
					ps=ps||20;
					
					HttpClient.post('/find/ques',{
						cate:cate,
						type:type,
						subject:subjectCode,
						level:'0',
						p:p-1,
						ps:ps,
						v:2
					}).success(function(result){
						if(result.code == 1){
							defer.resolve(result);
						}else{
							defer.reject(result.msg);
						}
					}).error(function(){
						defer.reject('获取试题失败');
					});
					return defer.promise;
				},
				/**
				 * 处理试题篮
				 * @param action
				 * add
				 * delete
				 * clear
				 * @param quesId 题目ID
				 * @param subjectCode 学科Code
				 * @param section 题目类型
				 */
				handleCart : function (action,quesId,sectionCode,subjectCode,subjectId){
					var defer = $q.defer();
					HttpClient.get('/cart/'+ action,{
						question:quesId,
						subjectCode:subjectCode,
						sectionCode:sectionCode,
						subjectId:subjectId
					}).success(function(result){
						if(result.result == 1){
							defer.resolve(result.size);
						}else{
							defer.reject(action+'操作失败');
						}
					}).error(function(){
						defer.reject('操作失败');
					});
					return defer.promise;
				},
				/**
				 * 添加视频
				 */
				addVideoToCart:function(subjectCode,subjectId,videoInfo){
					var defer = $q.defer();
					videoInfo = videoInfo || {};
					
					var params = {};
					params.subjectCode = subjectCode;
					params.subjectId = subjectId;
					
					params.pageUrl=videoInfo.html;
					params.externalId=videoInfo.ID || videoInfo.id;
					params.rawVideoUrl=videoInfo.video;
					params.previewPicUrl=videoInfo.thumbnail;
					params.title=videoInfo.title;
					
					$http.post('/cart/web/addvideo',params).success(function(result){
						if(result.result == 1){
							defer.resolve(result.size);
						}else{
							defer.reject('添加视频操作失败');
						}
					}).error(function(){
						defer.reject('操作失败');
					});
					return defer.promise;
				},
				getCart:function(){
					var defer = $q.defer();
					HttpClient.get('/cart/info').success(function(result){
						if(result.code == 1){
							
							
							
							
							
							
							
							defer.resolve(result.data);
						}else{
							defer.reject(action+'操作失败');
						}
					}).error(function(){
						defer.reject('操作失败');
					});
					return defer.promise;
				},
				sort:function(action,questId){
					var defer = $q.defer();
					HttpClient.post('/cart/sort',{
						action:action,
						question:questId
					}).success(function(result){
						if(result.result == 1){
							defer.resolve(result.size);
						}else{
							defer.reject('操作失败');
						}
					}).error(function(){
						defer.reject('操作失败');
					});
					return defer.promise;
				},
				/**
				 * 获取某道题的详细数据
				 */
				getQuestionById : function(questId,subjectCode){
					var defer = $q.defer();

					questId = questId || '';

					var question = CacheService.get(questId);

					if(question == null || angular.isUndefined(question)){
						HttpClient.post('/find/ques/detail',{
							qid:questId,
							subject:subjectCode
						}).success(function(result){
							if(result.code ==1){
								question = result.question;
								defer.resolve(question);
								CacheService.put(questId,question);
							}else{
								defer.reject(result.msg);
							}
						}).error(function(){
							defer.reject('获取题目详情失败');
						});
					}else{
						defer.resolve(question);
					}


					return defer.promise;
					
				}
				
		};
		return service;
	}]);