import app from 'app';
import 'services/ExerciseService';
import 'directives/ng-progressbar';




export default app.controller('LiteracyController',['$scope','$window','$location','$timeout','ExerciseService','$filter','Toolkit',function($scope,$window,$location,$timeout,ExerciseService,$filter,Toolkit){
		var url = $location.absUrl();
		//$scope.isDisabled = false;
		//$scope.isSelected = false;
		$scope.isRadioSelected = function(classNum){
			if($scope.filter.classId==classNum){
				return true;
			}
			return false;
		}

		$scope.params = Toolkit.serializeParams();
		$scope.currentGrade = $scope.params.gradeNo;

		$scope.now = new Date().getTime();

		$scope.groupedExercises = {

		};
		$scope.timeline = [];
		$scope.subject = 14;
		$scope.currentTermMonths = [];
		$scope.classFilter = function(item){
			return item.homeWorkCount >0;
		}
		//筛选作业的班级ID
		// ng-repeat 每个对象有自己的scope，因此需要包裹一层，才能实现radio的切换ng-model值也改变
		var defaultFilter={
			classId : -1,
			p:0,
			ps:40,
			hasMore:true
		};
		//var filterInfo = window.sessionStorage.getItem("filter")||defaultFilter;
		//$scope.filter= angular.fromJson(filterInfo);
		$scope.filter = defaultFilter;
		//var data = window.sessionStorage.getItem("exercise")||[];
		//$scope.exercises = angular.fromJson(data);
		$scope.exercises =[];
		$scope.isLoaded = false;

		// 获取年级信息
		getGrades();

		$scope.disabledCheckbox = function(clazz){

			//班级人数必须不为零，和当前被选中的班级的年级必须一样，
			return clazz.stuCount==0 || ( $scope.form.grade != -1&&clazz.classGrade!= $scope.form.grade)
		};

		var now = new Date();
		var times = $filter('date')(now,'yyyy/MM/dd HH:mm').split(' ');
		var endTimes = $filter('date')(new Date(now.getFullYear(),now.getMonth(),now.getDate()+3),'yyyy/MM/dd 08:00').split(' ');




		$scope.classForm = {
			grade:-1,
			subjectCode: -1,
			subjectId:-1,
			classes:[]
		};
		$scope.$on('userinfo',function(event,info){
			$scope.userInfo = info;
			$scope.classForm.classes=[];
		});

		$scope.form = {
			teacherID: $scope.userInfo.uid,
			subject:14,
			classes:[],
			grade:-1,
			startDate:times[0],
			startTime:times[1],
			endDate:endTimes[0],
			endTime:endTimes[1],
			key:'PC',
			sign:'xxx'
		};

		$scope.isSelected = function(clazz){
			if($scope.form.classes.length==0){
				return false;
			}
			var index = $scope.form.classes.indexOf(clazz);
			if(index!=-1){
				return true;
			}
			return false;
		};
		$scope.toggleSelectClass = function(clazz){
			clazz.checked =clazz.checked||false;
			if(window._verBrower=="IE 8.0"){
				clazz.checked = !clazz.checked;
				var checked = (clazz.checked)&&(!$scope.disabledCheckbox(clazz));
			}else{
				var checked = !(clazz.checked)&&(!$scope.disabledCheckbox(clazz));
			}
			if(checked){
				$scope.form.grade = clazz.classGrade;
				$scope.form.subjectCode = clazz.subjectCode;
				$scope.form.subjectId = clazz.subjectId;
				$scope.form.classes.push(clazz);
			}else{
				var index = $scope.form.classes.indexOf(clazz);
				if(index !=-1){

					$scope.form.classes.splice(index,1);
				}
				if($scope.form.classes.length ==0){
					$scope.form.grade = -1;
					$scope.form.subjectCode = -1;
					$scope.form.subjectId = -1;
				}
			}

		};

		$scope.selectedClass = function(id){
			var index=$scope.form.classes.indexOf(id)
			if(index<0){
				$scope.form.classes.push(id);
			}else{
				$scope.form.classes.splice(index,1);
			}
			// console.log($scope.form.classes);
		}

		$scope.$watch('filter.classId',function(newValue,oldValue){
			if(newValue !=oldValue){

				$scope.filter.classId = newValue;
				$scope.filter.p = 0;
				$scope.filter.hasMore=true;
				$scope.exercises.splice(0,$scope.exercises.length);
				$scope.groupedExercises = {

				};
			}
		});
		
		$scope.$on('alertEvent',function(event,data){
			if(data.action == 'tab-success'){
				var grade = $scope.clickGrade;
				$scope.sections = [];
				$scope.selGrade = grade ;
				$scope.selSection = {};
				$scope.gradeTrees = {} ;
				grade['item'].forEach(function(item){
					item.expend = false;
				})
				$scope.clearAll();
			}
		});

		$scope.tabGrade = function (grade) {
			if ($scope.selGrade.id != grade.id) {
				$scope.clickGrade = grade ;
				var data = {
					message:'切换年级会清空当前选中的题目，是否继续？',
					action:'tab-success',
					type:2
				};
				$scope.$emit('alert',data);
			}
		};
		$scope.selSection = {};
		$scope.gradeTrees = {};
		$scope.selAllCount = 0 ;
		$scope.selChapterCount = 0;
		$scope.changeSection = function (section,type,el,count) {
			if (type) {
				var key = section.ID+'_'+ type
				if (el.checked) {
					$scope.selSection[key] = {"id":section.ID,'name':section.Name,type:type,count:count};
					$scope.selAllCount += count
				}else{
					if ($scope.selSection[key]){
						if ($scope.selAllCount - count >= 0) {
							$scope.selAllCount -= $scope.selSection[key].count;
						}
						delete $scope.selSection[key];
					}
				}
				$scope.selChapterCount = calcuCount();
			}
		};

		$scope.handlerGradeClick = function (grade){
			if (grade.expend){
				grade.expend = false;
			}else{
				getSections(grade);
			}

		}

		$scope.clearAll = function () {
			$scope.selSection = {};
			$scope.selAllCount = 0 ;
			$scope.selChapterCount = 0;
			// tab-items
			jQuery('.tab-items input[type=checkbox]').each(function(){
				$(this).attr("checked",false);
			});
		}

		$scope.setStartTime = function(time){
			var times = $filter('date')(time,'yyyy/MM/dd HH:mm').split(' ');
			$scope.form.startDate=times[0];
			$scope.form.startTime=times[1];
		}

		$scope.openDialogBox = function(){
			var sections = getObjEntry($scope.selSection);
			if(!$scope.form.classes || $scope.form.classes.length<=0){
				var data = {
					message:'请先选择班级',
				};
				$scope.$emit('alert',data);
				return;
			}
			if(sections.keys<=0){
				var data = {
					message:'请选择题目',
				};
				$scope.$emit('alert',data);
				return;
			}


			var form = $scope.form;
			$scope.form.name = getInitExerciseName(sections.keys);
			$scope.form.json = JSON.stringify({"groups": sections.values});
			var startTime = new Date(form.startDate +" "+ form.startTime);
			var now = new Date();
			if(now.getTime()>=startTime.getTime()){
				$scope.setStartTime(now);
			}
			$scope.showDialog = true;
		}
		$scope.showDialog = false;
		$scope.closeDialogBox = function(){
			$scope.showDialog = false;
		}

		$scope.assign = function(){
			var codes = [];
			angular.forEach($scope.form.classes,function(clazz){
				codes.push(clazz.classNumber);
			});
			var data = $scope.form ;
			data.classes = codes.join(',');
			if(data['grade']) delete data['grade'];
			if(data['subjectCode']) delete data['subjectCode'];
			if(data['subjectId']) delete data['subjectId'];
			data['type'] = 10 ;
			if($scope.form.name.length>40){
				return ;
			}
			ExerciseService.assignQues(data).then(function(result){
				if(result&&result.length!=0){
					var data = {
							message:"作业布置成功"
					};
					$scope.$emit('alert',data);
					$scope.$on('alertEvent',function(event,data){
						//清除本地数据工作
						$window.location.href="/exercise";
					})
				}
			},function(msg){
				var data = {
						message:msg,
				};
				$scope.$emit('alert',data);
			});

		}

		/**
		 * 获取默认的名字
		 */
		 function getInitExerciseName(arr){
			var chapterIds = {}
			var str = '识字写字练习';
			angular.forEach(arr,function(item){
				var tmp = item.split('_');
				chapterIds[tmp[0]] = true;
			});
			var ids = getObjEntry(chapterIds).keys;
			if(ids.length >= 2){
				return  $scope.selGrade.name + str;
			} else {
				var chapter = $scope.selSection[ids[0]+'_10']? $scope.selSection[ids[0]+'_10']:$scope.selSection[ids[0]+'_11']?$scope.selSection[ids[0]+'_11']:$scope.selSection[ids[0]+'_12'];
				return  chapter.name + str
			}
		}

		function  calcuCount() {
			var chapterIds = {}
			angular.forEach(getObjEntry($scope.selSection).keys,function(item){
				var tmp = item.split('_');
				chapterIds[tmp[0]] = true;
			});
			var ids = getObjEntry(chapterIds).keys;
			return ids.length;
		}

		function getObjEntry (obj){
			var keys = [] ;
			var values = [];
			for (var key in obj){
				if (obj.hasOwnProperty(key)){
					keys.push(key);
					values.push(obj[key])
				}
			}
			return {keys:keys,values:values};
		}

		function getGrades () {
			var bookversionId = 'b6827242-c841-384d-8ff3-295729e0ba25' ;
			ExerciseService.getGrades(bookversionId,$scope.subject).then(function (data){
				var grades = {};
				var g = data.grades.forEach(function(item,index){
					var g = parseInt(item.semester/10);
					if(grades[g] && grades[g].item){
						grades[g].item.push(item);
					}else{
						grades[g] = {};
						grades[g].item = [];
						grades[g].item.push(item);
						var name = '一年级';
						switch(g){
							 case 1:
							 	name = '一年级';
							 	break;
							 case 2:
								name = '二年级';
								break;
							 case 3:
								name = '三年级';
								break;
							 case 4:
								name = '四年级';
								break;
							 case 5:
								 name ='五年级';
								 break;
							 case 6:
								 name ='六年级';
								 break;
						}
						grades[g].id = g ;
						grades[g].name = name;
					}
				});

				$scope.grades = grades;
				$scope.selGrade = $scope.grades['1'] ;
				console.info($scope.selGrade)
				// getSections($scope.selGrade.id);
			});
		};

		function getSections (grade) {
			ExerciseService.getSections(grade.id,$scope.subject).then(function (data){
				data.tree[0].expandable = true;
				grade.expend = !grade.expend ;
				$scope.gradeTrees[grade.name] = data.tree;
			});
		};
	}]);
