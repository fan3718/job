import app from 'app';
import 'services/MaterialService';
import 'services/CacheService';
import 'services/VideoHelper';
import 'services/Toolkit';

import 'directives/ng-chapter-treeview';
import 'directives/ng-video-slider';
import 'directives/ng-video';
//import 'directives/ng-calendar';

app.config(['$stateProvider','$urlRouterProvider',function($stateProvider, $urlRouterProvider){
	$stateProvider.state('filter',{
	 	url:'/filter',
	 	templateUrl:require('tpls/teacher/filter-chapter.html'),
 	})
 	.state('cart',{
		url:'/cart',
		templateUrl:require('tpls/teacher/cart.html'),
		controller:'CartController'
 	});
	$urlRouterProvider.otherwise('/filter');     //匹配所有不在上面的路由
}]);

export default app.controller('AssignExerciseController',['$scope','$window','$location','$state','$filter','$interval','MaterialService','CacheService','VideoHelper','Toolkit',function($scope,$window,$location,$state,$filter,$interval,MaterialService,CacheService,VideoHelper,Toolkit){

		//每页显示条数
		var DEFAULT_PAGE_SIZE = 10;




		//每隔十分钟请求一下服务器，防止长时间不操作，导致session失效，试题篮中数据丢失
		$interval(function(){
			MaterialService.getCart().then(function(data){
				console.log('update session:'+data);
			});
		},8*60*1000);

		$scope.params = Toolkit.serializeParams();
		$scope.currentGrade = $scope.params.gradeNo;
		$scope.books = [];

		$scope.gradeId = -1;

		$scope.chapterTree = [];
		// 1 同步教材 2 知识点
		$scope.showType = 1;

		$scope.showChapter = false;

		$scope.videos = [];

		$scope.hasChosenGrade  = false;

		$scope.showShareVideoBox = false;

		$scope.isRequestFinished = false;

		$scope.switcher = {
				showChapter:false,
				hasChosenGrade:false,
				showMaterial:true,
				hasOldMaterial:false
		};

		//存储章节知识点简要信息
		var chapterSnapshot = {

		};

		var now = new Date();
		var times = $filter('date')(now,'yyyy/MM/dd HH:mm').split(' ');
		var endTimes = $filter('date')(new Date(now.getFullYear(),now.getMonth(),now.getDate()+3),'yyyy/MM/dd 08:00').split(' ');

		//var classes = (CacheService.get('assign-classes') ||$scope.params.classIds.split(','))|| [];
		var classes = ($scope.params.classIds.split(','))|| [];

		$scope.basket = {
				p:1,
				ps:DEFAULT_PAGE_SIZE,
				total:0,
				maxPage:1,
				//教材
				book:{},
				//年级
				grade:{},
				//章节
				chapter:{},
				//知识点
				catelog:{},
				//题目
				cart:{
					videos:[],
					questions:[]
				},
				knowledge:{

				},
				pagination:[]
		};

		MaterialService.getCart().then(function(data){
			if(data){
				for(var key in data){
					var arr = data[key];
					if(arr){
						var item = null;
						var ID = null;
						if(key=='0'){ //视频
							for(var index=0;index<arr.length;index++){
								item = arr[index];
								if(item && item!=null){
									ID = item.ID||item.id;
								}
								if(ID && ID!=null && $scope.basket.cart.videos.indexOf(ID)<0){
									$scope.basket.cart.videos.push(ID);
								}
							}
						}else{
							item = arr[index];
							if(item && item!=null){
								ID = item.ID||item.id;
							}
							if(ID && ID!=null && $scope.basket.cart.questions.indexOf(ID)<0){
								$scope.basket.cart.questions.push(ID);
							}
						}
					}
				}
			}


		});

		$scope.classForm = {
			grade:-1,
			subjectCode: -1,
			subjectId:-1,
			classes:[]
		};
		$scope.$on('userinfo',function(event,info){
			$scope.userInfo = info;
			$scope.classForm.classes=[];
			var oldMaterial = CacheService.get('material-'+info.uid);
			if(angular.isDefined(oldMaterial)&&oldMaterial!=null){
				$scope.switcher.hasOldMaterial = true;
				$scope.basket.book = oldMaterial.book;
				$scope.basket.grade = oldMaterial.grade;
				$scope.gradeId=$scope.basket.grade.ID;
				$scope.switcher.hasChosenGrade = true;
				$scope.switcher.showMaterial = false;
				$scope.switcher.showChapter  = true;
				loadChapterTree();
			}
			loadBooks();
			angular.forEach($scope.userInfo.classes,function(clazz){
				var index = classes.indexOf(clazz.classId+"");
				if(index >=0){
					clazz.checked = true;
					$scope.classForm.grade = clazz.classGrade;
					$scope.classForm.subjectCode = clazz.subjectCode;
					$scope.classForm.subjectId = clazz.subjectId;
					//var id = clazz.classId+'';
					$scope.classForm.classes.push(clazz);
				}
			});
		});
		$scope.isLabelChecked=function(book,grade){

			$scope.isRadioChecked = $scope.basket.grade.ID==grade.ID && $scope.basket.book.id==book.id;

			return $scope.basket.grade.ID==grade.ID && $scope.basket.book.id==book.id;
		}
		//$scope.$watch(for)
		$scope.form = {
				classes:classes,
				startDate:times[0],
				startTime:times[1],
				subjectCode:$scope.params.subjectCode,
				endDate:endTimes[0],
				endTime:endTimes[1],
				grade:$scope.params.gradeNo
		};
		console.log($scope.form.classes);
		//console.log($scope.form);
		$scope.chapterPath = [];



		$scope.knowledgePath = [];
		//知识结点筛选
		$scope.knowledge = {
				p:1,
				ps:DEFAULT_PAGE_SIZE,
				videos:[],
				questions:[],
				total:0,
				maxPage:1,
				pagination:[],
				input:1
		}

		$scope.getFormData = function(){
			$scope.form.name=getInitExerciseName();
			return $scope.form;
		}

		$scope.setStartTime = function(time){
			var times = $filter('date')(time,'yyyy/MM/dd HH:mm').split(' ');
			$scope.form.startDate=times[0];
			$scope.form.startTime=times[1];
		}

		//loadBooks();

		$scope.disabledCheckbox = function(clazz){
			//班级人数必须不为零，和当前被选中的班级的年级必须一样，
			return clazz.stuCount==0 || ( $scope.classForm.grade != -1&&clazz.classGrade!= $scope.classForm.grade)
		}
		$scope.isSelected = function(clazz){
			if($scope.classForm.classes.length==0){
				return false;
			}
			var index = $scope.classForm.classes.indexOf(clazz);
			if(index!=-1){
				return true;
			}
			return false;
		}
		$scope.toggleSelectClass = function(clazz){
			//alert(window._varBrower);
			clazz.checked =clazz.checked||false;
			if(window._verBrower=="IE 8.0"){

				clazz.checked = !clazz.checked;
				var checked = (clazz.checked)&&(!$scope.disabledCheckbox(clazz));
			}else{
				var checked = !(clazz.checked)&&(!$scope.disabledCheckbox(clazz));
			}
			//console.log(checked+" ====== "+clazz.checked);
			if(checked){
				$scope.classForm.grade = clazz.classGrade;
				$scope.classForm.subjectCode = clazz.subjectCode;
				$scope.classForm.subjectId = clazz.subjectId;
				$scope.classForm.classes.push(clazz);
				$scope.currentGrade = clazz.classGrade;
				console.log($scope.currentGrade);
			}else{
				var index = $scope.classForm.classes.indexOf(clazz);
				console.log($scope.classForm);
				if(index !=-1){

					$scope.classForm.classes.splice(index,1);
				}
				if($scope.classForm.classes.length ==0){
					$scope.classForm.grade = -1;
					$scope.classForm.subjectCode = -1;
					$scope.classForm.subjectId = -1;
				}
			}
			console.log($scope.classForm);

		}
		$scope.$watch('currentGrade',function(newValue,oldValue){
				var classIds = [];
				if(newValue!=oldValue){
					for( var i=0;i< $scope.classForm.classes.length;i++){
						classIds[classIds.length] =$scope.classForm.classes[i].classId;
					}
					window.sessionStorage.clear();
					//console.log('/exercise/assign?classIds='+classIds.join(',')+'&subjectCode='+$scope.params.subjectCode+"&subjectId="+$scope.params.subjectId+"&gradeNo="+newValue);
					$window.location.href='/exercise/assign?classIds='+classIds.join(',')+'&subjectCode='+$scope.classForm.subjectCode+"&subjectId="+$scope.classForm.subjectId+"&gradeNo="+newValue;
				}
		});


		function updateQuestions(quests,isNeedAddCart){
			angular.forEach(quests,function(question){
				if(isNeedAddCart){
					if(question.InCart){
						if($scope.basket.cart.questions.indexOf(question.ID) == -1){
							$scope.basket.cart.questions.push(question.ID);
						}
					}
				}else{
					question.InCart = $scope.basket.cart.questions.indexOf(question.ID) != -1;
				}

			});
		}
		/**
		 * @param total 总数
		 * @param currentPage 当前页码
		 * @return
		 *
		 */
		function initPagination(total,currentPage){
			var info = {};

			var arr = [];
			total = total || 0;
			if(total > 0){

				//计算总共多少页
				var totalPage = Math.ceil( total / DEFAULT_PAGE_SIZE);
				info.maxPage = totalPage;
				//计算当前页码在页码分页所在的页
				var offsetPage = Math.ceil(currentPage / 10);
				//计算当前页前后的位置
				var minPage = Math.max(1,Math.max(1,currentPage-4));
				var maxPage = Math.min(totalPage,Math.min(totalPage,currentPage+3));
				var deltaPage = maxPage - minPage +1;
				//FIXME 应该动态计算每页显示的个数
				var showCount = 8;
				if(deltaPage<showCount && maxPage!=totalPage){
					var tmpPage = maxPage + (showCount-deltaPage);
					maxPage = Math.min(tmpPage,totalPage);
				}
				deltaPage = maxPage - minPage+1;
				if(deltaPage<showCount && minPage!=1){
					var tmpPage = minPage - (showCount-deltaPage);
					minPage = Math.max(tmpPage,1);
				}

				var p = null;

				if(minPage != 1){
					p = {};
					p.type = 1;
					p.code = 1;
					arr.push(p);
					if(minPage != 2){
						p = {};
						p.type =2;
						p.code = '...';
						arr.push(p);
					}
				}

				for(var index = minPage ; index <= maxPage ; index ++){
					p = {};
					p.type = 1;
					p.code = index;
					arr.push(p);
				}

				if(maxPage < totalPage){
					if(maxPage<totalPage-1){
						p = {};
						p.type =2;
						p.code = '...';
						arr.push(p);
					}
					p = {};
					p.type = 1;
					p.code = totalPage;
					arr.push(p);
				}
			}
			info.pagination = arr;
			return info;
		}

		function initExercisePaginator(total,page){
			$scope.basket.pagination.splice(0,$scope.basket.pagination.length);
			var paginator = initPagination(total,page);
			$scope.basket.maxPage = paginator.maxPage;
			$scope.basket.pagination.push.apply($scope.basket.pagination,paginator.pagination);
		}

		function initKnowledgePaginator(total,page){
			$scope.knowledge.pagination.splice(0,$scope.knowledge.pagination.length);
			var paginator = initPagination(total,page);
			$scope.knowledge.maxPage = paginator.maxPage;
			$scope.knowledge.pagination.push.apply($scope.knowledge.pagination,paginator.pagination);
		}

		function showLoading(isShow,isSilent){
			if(!isSilent){
				$scope.$emit('loading',isShow?'show':'hidden');
			}
		}

		/**
		 * 页面跳转
		 */
		$scope.redirect = function(type,action,p){
			var page = 1;
			if('exercise' == type){
				var chapter = $scope.basket.catelog;
				if('first'==action){
					page = 1;
				}else if('prev' == action){
					page = $scope.basket.p-1;
				}else if('next' == action){
					page = $scope.basket.p+1;
				}else if('none' == action){
					page = p.code;
				}else{
					page = parseInt($scope.basket.input);
					if(page>$scope.basket.maxPage){
						var info = {
								message : '输入页码不能大于'+$scope.basket.maxPage
						};
						$scope.$emit('alert',info);
						return;
					}
				}
				if($scope.basket.p == page){
					return;
				}
				var key = chapter.ID+"-"+page;
				var quetes = CacheService.get(key);
				if(angular.isDefined(quetes) && quetes!=null){
					$scope.questions.splice(0,$scope.questions.length);
					updateQuestions(quetes);
					$scope.questions.push.apply($scope.questions,quetes);
					$scope.basket.p = page;
					initExercisePaginator($scope.basket.total,page);
				}else{
					loadChapterQuestions(chapter.ID,page,false);
				}
				//$scope.basket.input = $scope.basket.p;

			}else{
				var page = 1;
				var knowledge = $scope.basket.knowledge;
				if('first'==action){
					page = 1;
				}else if('prev' == action){
					page = $scope.knowledge.p-1;
				}else if('next' == action){
					page = $scope.knowledge.p+1;
				}else if('none' == action){
					page = p.code;
				}else{
					page = parseInt($scope.knowledge.input);
					if(page>$scope.knowledge.maxPage){
						var info = {
								message : '输入页码不能大于'+$scope.knowledge.maxPage
						};
						$scope.$emit('alert',info);
						return;
					}

				}
				if($scope.knowledge.p == page){
					return;
				}
				var key = knowledge.ID+"-"+page;
				var quetes = CacheService.get(key);
				if(angular.isDefined(quetes) && quetes!=null){
					$scope.knowledge.questions.splice(0,$scope.knowledge.questions.length);
					updateQuestions(quetes);
					$scope.knowledge.questions.push.apply($scope.knowledge.questions,quetes);
					$scope.knowledge.p = page;
					initKnowledgePaginator($scope.knowledge.total,page);
				}else{
					loadKnowledgeQuestions(knowledge.ID,page,false);

				}

				//$scope.knowledge.input = $scope.knowledge.p;
				//loadVMKnowledgeQuestions(knowledge.ID);
			}
			$("html,body").scrollTop(0);
		}

		$scope.questions =[];


		function loadBooks(){
			MaterialService.loadBooks($scope.params.subjectCode).then(function(books){
				$scope.books = books;
				if(!$scope.switcher.hasOldMaterial){
					if(!isArrayEmpty(books) && !isArrayEmpty(books[0].grades)){
						$scope.basket.book = books[0];
						$scope.basket.grade = books[0].grades[0];
						$scope.gradeId=$scope.basket.grade.ID;
						loadChapterTree();
					}
				}
			});
		}

		loadKnowledges();

		function loadKnowledges(){
			MaterialService.loadKnowledgeTree($scope.params.subjectCode).then(function(tree){
				$scope.knowledgeTree = tree;
				if(tree !=null ){
					var knowledge = tree[0];
					while(knowledge.children !=null && knowledge.children.length>0){
						knowledge = knowledge.children[0];
					}
					if(knowledge !=null){
						$scope.basket.knowledge =  knowledge;
						loadKnowledgeData(knowledge);
					}

				}
			});
		}

		function loadChapterTree(showLoading){
			MaterialService.loadChapterTree($scope.params.subjectCode,$scope.gradeId).then(function(tree){
				$scope.chapterTree = tree;
				if(tree !=null){

					$scope.basket.chapter =  tree[0];

					var chaperId = "";

					if(tree[0].children.length>0){
						chaperId = tree[0].children[0].ID;
						$scope.basket.catelog =  tree[0].children[0];
					}else{
						chaperId = tree[0].ID;
						$scope.basket.catelog =  tree[0];
					}

					initChapterPath($scope.basket.catelog);

					loadChapterQuestions(chaperId,$scope.basket.p,showLoading?false:true);

					loadVideos(chaperId);
				}
			},function(){

			});
		}

		function loadVideos(chaperId,isKnowledge){
			MaterialService.loadVideos($scope.params.subjectCode,chaperId,isKnowledge).then(function(videos){
				if(!isKnowledge){
					$scope.videos = videos;
				}else{
					$scope.knowledge.videos = videos;
				}
			});
		}
		var isLoadingQuestions = false;

		/**
		 * @param chapterId 章节ID
		 * @param page  页码
		 * @param isSilent 是否后台运行
		 */
		function loadChapterQuestions(chaperId,page,isSilent){
			if(isLoadingQuestions){
				return;
			}
			$scope.isRequestFinished = false;
			if(angular.isUndefined(isSilent)){
				isSilent = true;
			}
			page = page || $scope.basket.p;
			showLoading(true,isSilent);
			isLoadingQuestions = true;
			MaterialService.loadChapterQuesions($scope.params.subjectCode,chaperId,-1,page,DEFAULT_PAGE_SIZE).then(function(data){
				var total = data.count || 0 ;
				$scope.basket.total = total;
				initExercisePaginator(total,page);

				var quetes = data.quests;
				//将不存在的添加的js的Cart
				updateQuestions(quetes,true);

				$scope.questions.splice(0,$scope.questions.length)
				$scope.questions.push.apply($scope.questions,quetes) ;
				$scope.basket.p = page;

				CacheService.put(chaperId+"-"+page,quetes);
				$scope.basket.input = $scope.basket.p;
				isLoadingQuestions = false;
				showLoading(false,isSilent);
				$scope.isRequestFinished = true;
			},function(){
				isLoadingQuestions = false;
				showLoading(false,isSilent);
				$scope.isRequestFinished = true;
			});
		}

		var isLoadingKnowQuestions = false;

		var isHasMoreQuestions  = true;

		function loadKnowledgeQuestions(knowID,page,isSilent){
			if(isLoadingKnowQuestions){
				return;
			}
			$scope.isRequestFinished = false;

			if(angular.isUndefined(isSilent)){
				isSilent = true;
			}
			showLoading(true,isSilent);
			isLoadingKnowQuestions = true;
			var params = {};
			page = page || $scope.knowledge.p;
			params.page = page-1;
			var query = [];
			var item = {};
			item.type = 'exercise';
			item.id = knowID;
			item.count = $scope.knowledge.ps;
			query.push(item);
			params.query = query;
			MaterialService.loadQuestions($scope.params.subjectCode,JSON.stringify(params),true).then(function(data){
				var total = data.count || 0;
				$scope.knowledge.total = total;
				initKnowledgePaginator($scope.knowledge.total,page);
				var quests = data.quests;

				updateQuestions(quests,true);

				$scope.knowledge.questions.splice(0,$scope.knowledge.questions.length)
				CacheService.put(knowID+"-"+page,quests);

				$scope.knowledge.questions.push.apply($scope.knowledge.questions,quests) ;
				$scope.knowledge.p = page;
				isLoadingKnowQuestions = false;
				showLoading(false,isSilent);
				$scope.isRequestFinished = true;
			},function(){
				isLoadingKnowQuestions = false;
				showLoading(false,isSilent);
				$scope.isRequestFinished = true;
			});
		}

		$scope.handleCart=function(question,isKnowledge){



			var action = 'web/add';
			var beforeChecked = question.InCart;
			if(beforeChecked){
				action = 'delete';
			}
			//如果是多选题，则使用单选类型
			var type = question.Type;
			if(type == 3){
				type =1;
			}
			MaterialService.handleCart(action,question.ID,type,$scope.params.subjectCode,$scope.params.subjectId).then(function(){
				if('web/add'==action){
					var index = $scope.basket.cart.questions.indexOf(question.ID);
					if(index == -1){
						$scope.basket.cart.questions.push(question.ID);
					}
					if(isKnowledge){
						angular.forEach($scope.questions,function(ques){
							if(ques.ID == question.ID){
								question.InCart = true;
							}
						});
					}else{
						angular.forEach($scope.knowledge.questions,function(ques){
							if(ques.ID == question.ID){
								question.InCart = true;
							}
						});
					}
				}else{
					var index = $scope.basket.cart.questions.indexOf(question.ID);
					if(index >-1){
						$scope.basket.cart.questions.splice(index,1);
					}

					if(isKnowledge){
						angular.forEach($scope.questions,function(ques){
							if(ques.ID == question.ID){
								question.InCart = false;
							}
						});
					}else{
						angular.forEach($scope.knowledge.questions,function(ques){
							if(ques.ID == question.ID){
								question.InCart = false;
							}
						});
					}
				}
				question.InCart= !beforeChecked;
				handleChapterSnapshot('web/add'==action,isKnowledge);
			},function(msg){
				question.InCart = beforeChecked;
			});

		}


		function handleChapterSnapshot(isAdd,isKnowledge){
			var chapterInfo = null;
			if(isKnowledge){
				chapterInfo= $scope.knowledgePath[$scope.knowledgePath.length-1];
			}else{
				chapterInfo= $scope.chapterPath[$scope.chapterPath.length-1];
			}
			var countInfo = chapterSnapshot[chapterInfo.ID];
			if(angular.isUndefined(countInfo)){
				countInfo = {};
				countInfo.count = 0;
				countInfo.chapter = chapterInfo;
				countInfo.type = isKnowledge?1:0;
			}
			if(isAdd){
				countInfo.count = countInfo.count +1;
			}else{
				countInfo.count = countInfo.count -1;
			}
			chapterSnapshot[chapterInfo.ID] = countInfo;
			if(countInfo.count==0){
				delete chapterSnapshot[chapterInfo.ID];
			}
		}


		/**
		 * 获取默认的名字
		 */
		 function getInitExerciseName(){
			 return Toolkit.calcExerciseName(chapterSnapshot,$scope.chapterTree,$scope.knowledgeTree);
		}

		$scope.toggleMaterial = function(){
			$scope.switcher.showMaterial = !$scope.switcher.showMaterial ;
		}
		$scope.$watchCollection('form.classes',function(){
			CacheService.put('assign-classes',$scope.form.classes);
		});

		/**
		 *
		 */
		$scope.changeChapter = function(chapter){
			if(chapter.ID != $scope.basket.catelog.ID){
				$scope.basket.catelog = chapter;
				$scope.basket.p=1;
				$scope.basket.input=1;
				$scope.basket.maxPage=1;
				$scope.basket.total=0;

				$scope.videos.splice(0,$scope.videos.length);
				$scope.questions.splice(0,$scope.questions.length);

				loadChapterQuestions(chapter.ID,$scope.basket.p,false);


				//if(angular.isUndefined(chapter.children) || chapter.children.length ==0){
					loadVideos(chapter.ID);
				//}
				initChapterPath(chapter);
			}
		}


		$scope.changeKnowledge = function(knowledge){
			if(knowledge.ID != $scope.basket.knowledge.ID){
				$scope.basket.knowledge = knowledge;

				$scope.knowledge.p=1;
				$scope.knowledge.input=1;
				$scope.knowledge.maxPage=1;
				$scope.knowledge.total=0;

				$scope.knowledge.videos.splice(0,$scope.knowledge.videos.length);
				$scope.knowledge.questions.splice(0,$scope.knowledge.questions.length);

				loadKnowledgeData(knowledge);
			}
		}

		function loadKnowledgeData(knowledge){
			//加载视频
			loadVideos(knowledge.ID,true);
			//加载题目
			loadKnowledgeQuestions(knowledge.ID,1,false);

			initKnowledgePath(knowledge);
		}


		/**
		 * 改变年级
		 */
		$scope.changeGrade = function(book,grade){
				$scope.switcher.showChapter = true;
				$scope.switcher.showMaterial = false;
				$scope.switcher.hasChosenGrade = true;
				$scope.basket.book =book;
				$scope.basket.grade = grade;

				//保存选中的book 和grade


				var material = {};

				material.book = book;
				material.grade = grade;

				CacheService.put('material-'+$scope.userInfo.uid,material);


				$scope.basket.p=1;
				$scope.gradeId=grade.ID;
				loadChapterTree(true);
		}

		/**
		 * 更改左边导航展示
		 */
		$scope.changeShowType = function(showType){
			$scope.showType = showType;
			//绑定数据

		}

		function removeCart(quests){
			angular.forEach(quests,function(ques){
				ques.InCart=false;
			});
		}

		$scope.clearCart = function(){
			MaterialService.handleCart('clear').then(function(){
				chapterSnapshot = {};
				$scope.basket.cart.questions.splice(0,$scope.basket.cart.questions.length);
				$scope.basket.cart.videos.splice(0,$scope.basket.cart.videos.length);

				removeCart($scope.questions);
				removeCart($scope.knowledge.questions);
				removeCart($scope.knowledge.videos);
				removeCart($scope.videos);

				if($scope.slider!=null){
					$scope.slider.clear();
				}

			});
		}

		$scope.slider = null;

		$scope.initSlider = function(slider){
			$scope.slider = slider;

			$scope.slider.addCheckedListener(function(index,checked){
				var isKnowledge = $scope.showType == 2;
				var video= null;
				if(isKnowledge){
					video=$scope.knowledge.videos[index];
				}else{
					video=$scope.videos[index];
				}
				if(checked){
					MaterialService.addVideoToCart($scope.params.subjectCode,$scope.params.subjectId,video).then(function(){
						video.InCart = true;
						$scope.basket.cart.videos.push(video);
						if(isKnowledge){
							angular.forEach($scope.videos,function(v){
								if(v.html == video.html){
									v.InCart = true;
								}
							});
						}else{
							angular.forEach($scope.knowledge.videos,function(v){
								if(v.html == video.html){
									v.InCart = true;
								}
							});
						}
						handleChapterSnapshot(true,isKnowledge);
					},function(){
						$scope.slider.toggleVideoChecked(index);
					});
				}else{
					MaterialService.handleCart('delete',video.ID,0,$scope.params.subjectCode,$scope.params.subjectId).then(function(){
						video.InCart = false;
						var index = -1;
						for(var i=0;i<$scope.basket.cart.videos.length;i++){
							var item = $scope.basket.cart.videos[i];
							if(item.html == video.html){
								index = i;
								break;
							}
						}
						if(isKnowledge){
							angular.forEach($scope.videos,function(v){
								if(v.html == video.html){
									v.InCart = false;
								}
							});
						}else{
							angular.forEach($scope.knowledge.videos,function(v){
								if(v.html == video.html){
									v.InCart = false;
								}
							});
						}
						if(index>-1){
							$scope.basket.cart.videos.splice(index,1);
						}
						handleChapterSnapshot(false,isKnowledge);
					},function(){
						$scope.slider.toggleVideoChecked(index);
					});
				}
			});
		}


		$scope.isNull = function (obj){
			return angular.isUndefined(obj) || obj == null || obj =='';
		}

		$scope.goCart = function(){
			$state.go('cart');
		}



		$scope.completeFilter = function(){

			if(isArrayEmpty($scope.basket.cart.questions)&&isArrayEmpty($scope.basket.cart.videos)){
				var data = {
						message:'请选择题目',
				};
				$scope.$emit('alert',data);

				return;
			}
			if(isArrayEmpty($scope.form.classes)){
				var data = {
						message:'请选择班级',
				};
				$scope.$emit('alert',data);
				return;
			}

			$state.go('cart');



		}


		$scope.getQuestionDetail = function(quest){

			if(angular.isUndefined(quest.showAnalysis)){
				MaterialService.getQuestionById(quest.ID,$scope.params.subjectCode).then(function(info){
					quest.Discuss=info.discuss;
					quest.Analysis = info.analysis;
					quest.Answer = info.answer;
					quest.Method = info.method;
					quest.Knowledge = info.knowledge;
					quest.showAnalysis = true;
					try{
						$scope.$digest();
					}catch (e) {

					}
				});
			}else{
				quest.showAnalysis = !quest.showAnalysis;
			}



		}

		$scope.continueFilter = function(){
			$state.go('filter');
		}

		$scope.currentPlayVideo = null;

		/**
		 * 加载下一页
		 */
		$scope.loadFilterNext = function(){
			if($scope.showType ==1){
				loadChapterQuestions($scope.basket.catelog.ID);
			}else{
				loadKnowledgeQuestions($scope.basket.knowledge.ID);
			}
		}

		/**
		 * 播放视频
		 */
		$scope.play = function(info){
			$scope.currentPlayVideo = info;
			var videoUrl = info.video;
			if(angular.isUndefined(videoUrl)||videoUrl==''){
				videoUrl = info.html;
			}
			var index = VideoHelper.isSharedUrl(videoUrl);

			if(index>-1){
				//$scope.videoUrl = VideoHelper.getIFrameUrl(videoUrl,index);
				var videoParams = VideoHelper.getIFrameUrl(videoUrl,index);
				if(typeof(videoParams)=='object'){
						//获得窗口的垂直位置
			           var iTop = (window.screen.availHeight - 30 - videoParams.height) / 2;
			           //获得窗口的水平位置
			           var iLeft = (window.screen.availWidth - 10 - videoParams.width) / 2;
			           window.open(videoParams.url,'video','width='+videoParams.width+',height='+videoParams.height+',top='+iTop+',left='+iLeft+',toolbar=no, menubar=no, scrollbars=no, resizable=no');
			           return;
				}else{
					$scope.videoUrl = videoParams;
				}
			}else{
				$scope.videoUrl = videoUrl;
				$scope.poster=info.thumbnail;
			}
			$scope.showVideoBox = true;
		}

		$scope.closeVideoBox = function(){
			$scope.showShareVideoBox = false;
			$scope.showVideoBox = false;
		}
		/**
		 * 播放视频失败
		 */
		$scope.playVideoError = function(video){

			$scope.closeVideoBox();

			var videoUrl = video.html;
			var index = VideoHelper.isSharedUrl(videoUrl);
			var videoParams = VideoHelper.getIFrameUrl(videoUrl,index);
			if(typeof(videoParams)=='object'){
					//获得窗口的垂直位置
		           var iTop = (window.screen.availHeight - 30 - videoParams.height) / 2;
		           //获得窗口的水平位置
		           var iLeft = (window.screen.availWidth - 10 - videoParams.width) / 2;
		           window.open(videoParams.url,'video','width='+videoParams.width+',height='+videoParams.height+',top='+iTop+',left='+iLeft+',toolbar=no, menubar=no, scrollbars=no, resizable=no');
			}
		}

		/**
		 *	数组非空
		 */
		function isArrayEmpty(obj){
			return obj ==null || obj.length <=0;
		}

		$scope.isDefined = function(obj){
			return angular.isDefined(obj) && obj != '' && obj !=null;
		}

		function initChapterPath(chapter){
			if($scope.chapterPath.length>0){
				$scope.chapterPath.splice(0,$scope.chapterPath.length);
			}
			if($scope.isDefined(chapter)){
				var path = chapter.path;
				if($scope.isDefined(path)&&path.length>0 && $scope.chapterTree.length>0){
					var parent = null;
					for(var i=0;i<path.length;i++){
						if(parent==null){
							parent = $scope.chapterTree[path[i]];
						}else{
							parent=parent.children[path[i]];
						}
						$scope.chapterPath.push(parent);
					}
				}
			}
		}

		function initKnowledgePath(knowledge){
			if($scope.knowledgePath.length>0){
				$scope.knowledgePath.splice(0,$scope.knowledgePath.length);
			}
			if($scope.isDefined(knowledge)){
				var path = knowledge.path;
				if($scope.isDefined(path)&&path.length>0 && $scope.knowledgeTree.length>0){
					var parent = null;
					for(var i=0;i<path.length;i++){
						if(parent==null){
							parent = $scope.knowledgeTree[path[i]];
						}else{
							parent=parent.children[path[i]];
						}
						$scope.knowledgePath.push(parent);
					}
				}
			}
		}


		function updateVideo(videos,video,InCart){
			var index = -1;
			for(var i=0;i<videos.length;i++){
				var item = videos[i];
				if(item.html==video.html){
					index = i;
					item.InCart = InCart;
					break;
				}
			}
			return index;
		}

		function updateQuestion(questions,quest,InCart){
			var index = -1;
			var id = quest.ID || quest.id;
			for(var i=0;i<questions.length;i++){
				var item = questions[i];
				var itemId = item.id || item.ID;
				if(itemId==id){
					index = i;
					item.InCart = InCart;
					break;
				}
			}
			return index;
		}

		$scope.removeJsVideo = function(video){
			//判断slider中是否存在 video 有需要将checkbox取消选择
			var index = -1;
			if($scope.showType ==1){
				index = updateVideo($scope.videos,video,false);
				updateVideo($scope.knowledge.videos,video,false);
			}else{
				index = updateVideo($scope.knowledge.videos,video,false);
				updateVideo($scope.videos,video,false);
			}

			if(index!=-1 && $scope.slider!=null){
				$scope.slider.toggleVideoChecked(index);
			}
			index = -1;
			//移除
			for(var i=0;i<$scope.basket.cart.videos.length;i++){
				$scope.basket.cart.videos[i].InCart = true;
				if($scope.basket.cart.videos[i].html==video.html){
					index = i;
					$scope.basket.cart.videos[i].InCart = false;
					break;
				}
			}
			console.log(index);
			if(index!=-1){
				$scope.basket.cart.videos.splice(index,1);
			}
		}


		$scope.removeJsQuestion = function(question){
			var index = -1;
			var quesId = question.ID || question.id;
			for(var i=0;i<$scope.basket.cart.questions.length;i++){
				if($scope.basket.cart.questions[i] ==  quesId){
					index = i;
					break;
				}
			}

			//index = updateQuestion$scope.basket.cart.questions,question,false);
			if(index != -1){
				$scope.basket.cart.questions.splice(index,1);
			}
			updateQuestion($scope.questions,question,false);
			updateQuestion($scope.knowledge.questions,question,false);
			/*
			angular.forEach($scope.questions,function(item){
				if(item.id == question.id){
					console.log(item);
					item.InCart = false;
				}
			});*/
		}

	}]);
