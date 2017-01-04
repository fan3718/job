/**
 *  教材相关接口
 */

import app from 'app';
import './CacheService';
import './HttpClient';
import './Toolkit';


export default app.factory('ResourceService',['$q','$sce','$http','HttpClient','CacheService','Toolkit',function($q,$sce,$http,HttpClient,CacheService,Toolkit){
		$http.defaults.headers.common['X-TECHU-AUTH'] = Toolkit.getCookie("safeToken");
		function isNotNull(obj){
			return obj != null && angular.isDefined(obj);
		}

		var service = {
				/**
				 * 获取收藏资源
				 * @param code
				 * 
				 */
				listFavorite :function(obj){
					var defer = $q.defer();
					HttpClient.get('/teaching/resource/collect/list',obj).success(function(result){
						if(result.code == 1){
							defer.resolve(result);
						}else{
							defer.reject(result.msg);
						}
					}).error(function(){
						defer.reject('下载失败');
					});
					return defer.promise;
				},
				/**
				 * 取消收藏资源
				 * @param code
				 * 
				 */
				disCollectResource :function(code,subject){
					var defer = $q.defer();
					HttpClient.get('/teaching/resource/collect/remove',{code:code,subject:subject}).success(function(result){
						if(result.code == 1){
							defer.resolve(result);
						}else{
							defer.reject(result.msg);
						}
					}).error(function(){
						defer.reject('下载失败');
					});
					return defer.promise;
				},
				/**
				 * 收藏资源
				 * @param code
				 * 
				 */
				collectResource :function(code,subject){
					var defer = $q.defer();
					HttpClient.get('/teaching/resource/collect',{code:code,subject:subject}).success(function(result){
						if(result.code == 1){
							defer.resolve(result);
						}else{
							defer.reject(result.msg);
						}
					}).error(function(){
						defer.reject('下载失败');
					});
					return defer.promise;
				},
				/**
				 * 预览资源
				 * @param code
				 * 
				 */
				preview :function(code){
					var defer = $q.defer();
					HttpClient.get('/teaching/resource/preview',{code:code}).success(function(result){
						if(result.code == 1){
							defer.resolve(result.data);
						}else{
							defer.reject(result.msg);
						}
					}).error(function(){
						defer.reject('下载失败');
					});
					return defer.promise;
				},
				/**
				 * 搜索资源
				 * @param {}
				 * 
				 */
				search :function(data){
					var defer = $q.defer();
					HttpClient.get('/teaching/resource/search',data).success(function(result){
						if(result.code == 1){
							defer.resolve(result.data);
						}else{
							defer.reject(result.msg);
						}
					}).error(function(){
						defer.reject('获取分类标签失败');
					});
					return defer.promise;
				},
				/**
				 * 获取一级分类标签列表
				 * @param subjectCode 学科编号
				 * 
				 */
				listCates :function(){
					var defer = $q.defer();
					var cates = CacheService.get("cates");
					if(isNotNull(cates)){
						defer.resolve(cates);
					}else{
						HttpClient.get('/teaching/resource/cates').success(function(result){
							if(result.code == 1){
								defer.resolve(result.data);
								CacheService.put("cate",result.data);
							}else{
								defer.reject(result.msg);
							}
						}).error(function(){
							defer.reject('获取分类标签失败');
						});
					}
					return defer.promise;
				},
				/**
				 * 加载教材版本
				 * @param subjectCode 学科编号
				 * 
				 */
				loadBooks :function(subjectCode){
					var defer = $q.defer();
					subjectCode = subjectCode || 20;
					var key = 'res-books'+subjectCode;
					var books = CacheService.get(key);
					if(books ==null || angular.isUndefined(books)){
						HttpClient.get('/teaching/resource/books',{
							subject:subjectCode,
							grades: true
						}).success(function(result){
							if(result.code == 1){
								var tmp = result.data ;
                				tmp.unshift({code: "-1", name: "全部", grades:[{code: "-1", name: "全部"}]}) //增加全部
								CacheService.put(key,tmp);
								defer.resolve(tmp);
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
					var tree = CacheService.get("chapter-res-"+gradeID+"-"+subjectCode); 
					if(isNotNull(tree)){
						defer.resolve(tree);
					}else{
						HttpClient.get('/teaching/resource/chapters',{
							subject:subjectCode,
							gradeCode: gradeID
						}).success(function(result){
							//{"code":1,"msg":"success","tree":[{"children":[{"children":[],"ID":"36706","Name":"第1课 祖国境内的远古居民"},{"children":[],"ID":"36707","Name":"第2课 原始的农耕生活"},{"children":[],"ID":"36708","Name":"第3课 华夏之祖"}],"ID":"36705","Name":"第一单元 中华文明的起源"},{"children":[{"children":[],"ID":"36710","Name":"第4课 夏、商、西周的兴亡"},{"children":[],"ID":"36711","Name":"第5课 灿烂的青铜文化"},{"children":[],"ID":"36712","Name":"第6课 春秋战国的纷争"},{"children":[],"ID":"36713","Name":"第7课 大变革的时代"},{"children":[],"ID":"36714","Name":"第8课 中华文化的勃兴(一)"},{"children":[],"ID":"36715","Name":"第9课 中华文化的勃兴(二)"}],"ID":"36709","Name":"第二单元 国家的产生和社会变革"},{"children":[{"children":[],"ID":"36717","Name":"第10课 “秦王扫六合”"},{"children":[],"ID":"36718","Name":"第11课 “伐无道，诛暴秦”"},{"children":[],"ID":"36719","Name":"第12课 大一统的汉朝"},{"children":[],"ID":"36720","Name":"第13课 两汉经济的发展"},{"children":[],"ID":"36721","Name":"第14课 匈奴的兴起及与汉朝的和战"},{"children":[],"ID":"36722","Name":"第15课 汉通西域和丝绸之路"},{"children":[],"ID":"36723","Name":"第16课 昌盛的秦汉文化（一）"},{"children":[],"ID":"36724","Name":"第17课 昌盛的秦汉文化（二）"}],"ID":"36716","Name":"第三单元 统一国家的建立"},{"children":[{"children":[],"ID":"36726","Name":"第18课 三国鼎立"},{"children":[],"ID":"36727","Name":"第19课 江南地区的开发"},{"children":[],"ID":"36728","Name":"第20课 北方民族大融合"},{"children":[],"ID":"36729","Name":"第21课 承上启下的魏晋南北朝文化（一）"},{"children":[],"ID":"36730","Name":"第22课 承上启下的魏晋南北朝文化（二）"}],"ID":"36725","Name":"第四单元 政权分立与民族融合"}]}
							if(result.code == 1){
								tree = result.data;
								defer.resolve(tree);
								CacheService.put("chapter-res-"+gradeID+"-"+subjectCode,tree);
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
						HttpClient.get('/teaching/resource/knowledges',{
							subject:subjectCode
						}).success(function(result){
							if(result.code == 1){
								tree = result.data;
								defer.resolve(tree);
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
					ps = ps ||200;
					var params = {};
					if(isKnowledge){
						params.knowledge = categoryID;
					}else{
						params.cate = categoryID;
					}
					params.p = p;
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
				 * 下载记录
				 * @param downloadType 下载类型
				 * @param downloadName 下载名称
				 * @param downloadUrl  下载URL
				 */
				downloadRecods : function(downloadType,downloadName,downloadUrl,resultDes,num){
					var defer = $q.defer();
					var params = {};
					params.downloadType = downloadType;
					params.downloadName = downloadName;
					params.downloadUrl = downloadUrl;
					params.result = resultDes || 'success';
					params.downloadNumber = num || 1;
					HttpClient.post('/teacher/downloadRecord/saveOrUpdate',params).success(function(result){
						if(result.code == 1){
							defer.resolve((result));
						}else{
							defer.reject(result.msg);
						}
					}).error(function(){
						defer.reject('添加下载记录失败');
					});
					return defer.promise;
				},
				/**
				 * 获取下载记录列表
				 */
				downloadRecodsList : function(p,ps){
					var defer = $q.defer();
					var params = {p:p, ps:ps};
					HttpClient.get('/teacher/downloadList',params).success(function(result){
						if(result.code == 1){
							defer.resolve((result));
						}else{
							defer.reject(result.msg);
						}
					}).error(function(){
						defer.reject('添加下载记录失败');
					});
					return defer.promise;
				}

		};
		return service;
	}]);