import app from 'app';
import 'services/ExerciseService';
import 'directives/ng-progressbar';

export default app.controller('ExerciseController',['$scope','$window','$location','$timeout','ExerciseService',function($scope,$window,$location,$timeout,ExerciseService){
		var url = $location.absUrl();
		//$scope.isDisabled = false;
		//$scope.isSelected = false;
		var exerType = 0;
		if(url.indexOf('/exam') > -1){
			exerType = 2;
		}
		$scope.isRadioSelected = function(classNum){
			if($scope.filter.classId==classNum){
				return true;
			}
			return false;
		}
		$scope.now = new Date().getTime();

		$scope.groupedExercises = {

		};
		$scope.timeline = [];

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
			hasMore:true,
			type:exerType
		};
		//var filterInfo = window.sessionStorage.getItem("filter")||defaultFilter;
		//$scope.filter= angular.fromJson(filterInfo);
		$scope.filter = defaultFilter;
		//var data = window.sessionStorage.getItem("exercise")||[];
		//$scope.exercises = angular.fromJson(data);
		$scope.exercises =[];
		$scope.isLoaded = false;

		ExerciseService.getTimeline(exerType).then(function(timeline){
			$scope.timeline = timeline;
			if(timeline.length>0){
				var item = timeline[0];
				$scope.filter.month = item.month;
				$scope.filter.term = item.term;

				angular.forEach(timeline,function(stamp){
					if(stamp.current){
						var key = ""+stamp.term+stamp.year+(stamp.month<10?'0':'')+stamp.month;
						$scope.currentTermMonths.push(key);
						stamp.key=key;
					}else{
						stamp.key=stamp.term+'';
					}
				});
			}

			filterExercise();

		});



		$scope.disabledCheckbox = function(clazz){


			//班级人数必须不为零，和当前被选中的班级的年级必须一样，
			return clazz.stuCount==0 || ( $scope.form.grade != -1&&clazz.classGrade!= $scope.form.grade)
		}

		$scope.form = {
			grade:-1,
			subjectCode: -1,
			subjectId:-1,
			classes:[]
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
		}
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

		}

		$scope.assignExercise = function(){

			if($scope.form.classes.length<=0 || $scope.form.subjectCode ==-1 || $scope.form.subjectId ==-1){
				var data = {
					message:'请先选择班级',
				};
				$scope.$emit('alert',data);
				return;
			}

			var ids = [];
			angular.forEach($scope.form.classes,function(clazz){
				ids.push(clazz.classId);
			});

			if(exerType==2){
				$window.location.href='/exam/filter?classIds='+ids.join(',')+'&subjectCode='+$scope.form.subjectCode+"&subjectId="+$scope.form.subjectId+"&gradeNo="+$scope.form.grade;
			}else{
				$window.location.href='/exercise/assign?classIds='+ids.join(',')+'&subjectCode='+$scope.form.subjectCode+"&subjectId="+$scope.form.subjectId+"&gradeNo="+$scope.form.grade;
			}


		}


		$scope.$watch('filter.classId',function(newValue,oldValue){
			if(newValue !=oldValue){

				$scope.filter.classId = newValue;
				$scope.filter.p = 0;
				$scope.filter.hasMore=true;
				$scope.exercises.splice(0,$scope.exercises.length);
				$scope.groupedExercises = {

				};
				filterExercise();
			}
		});

		/**
		 * 查看详情
		 */
		$scope.viewDetail = function(exercise,action){
			// window.location.href = '/'+action+'/report?exerId='+exercise.id;
			if((exercise.dueDate>$scope.now)&&(exercise.completeStuCount<=0)){
				ExerciseService.isExistExercise(exercise.id).then(function(result){
					if(result == 1){
						window.location.href = '/'+action+'/report?exerId='+exercise.id;
					}else if(result == 0){
						var data = {
								message:"作业不存在，请选择其他作业",
								type: "1"
						}
						$scope.$emit('alert',data);
						$scope.$on('alertEvent',function(event,data){
							$scope.exercises.splice(index,1);
						});
					}
				},function(msg){
					var data = {
							message:msg,
							type: "ok"
					};
					$scope.$emit('alert',data);
				});
			}else{
				window.location.href = '/'+action+'/report?exerId='+exercise.id;
			}
		}
		$scope.filterExerciseState = 0 ;
		function filterExercise(){
			if(!$scope.filter.hasMore){
				return ;
			}
			if($scope.filterExerciseState==0){
				$scope.filterExerciseState =1 ;
				ExerciseService.filterExercise($scope.filter).then(function(exercises){
					$scope.isLoaded = true;
					$scope.filterExerciseState =0 ;
					$scope.exercises.push.apply($scope.exercises,exercises);
					$scope.filter.p++;
					if(exercises.length<$scope.filter.ps){
						$scope.filter.hasMore = false;
					}
					//exercise数据进行分组处理
					// groupExercise(exercises);
				});
			}

		}
		function groupExercise(exercises){
			$scope.groupedExercises = {

			};
			angular.forEach(exercises,function(exer){
				var date = new Date(exer.createTime);
				var year = date.getFullYear();
				var month = date.getMonth()+1;
				//判断是不是当前学期
				var group = exer.termGroup+''+year+(month<10?'0':'')+month;
				if($scope.currentTermMonths.indexOf(group) == -1){
					group = ''+exer.termGroup;
				}
				var ges = $scope.groupedExercises[group];
				if(angular.isUndefined(ges)){
					ges=[];
					$scope.groupedExercises[group] = ges;
				}
				ges.push(exer);
			});
		}
		$scope.filterTime = function(item){
			var key = item.term+''+item.year+(item.month<10?'0':'')+item.month;
			if(item.current){
				$scope.filter.month =item.month;
			}else{
				$scope.filter.month =null;
			}
			if($scope.currentTermMonths.indexOf(key) == -1){
				key = ''+item.term;
			}
			var ges = $scope.groupedExercises[key];
			/*if(angular.isUndefined(ges)){
				$scope.filter.p =0;
			}else{
			}*/
			$scope.filter.p =0;
			$scope.filter.term=item.term;

			$scope.filter.start=item.start;
			$scope.filter.end=item.end;


			var params = angular.copy($scope.filter);

			ExerciseService.filterExercise($scope.filter).then(function(exercises){
				$scope.filter.hasMore = true;
				$scope.filter.p++;
				$scope.exercises  = exercises;
				groupExercise(exercises);
				//window.sessionStorage.setItem("exercise",JSON.stringify($scope.exercises));
			});
		}


		$scope.loadExerciseNext = function(){
			filterExercise();
		}


		$scope.remindExercise = function(exercise){
			if(exercise.called){
				return;
			}
			/**
			 * 催作业
			 */
			ExerciseService.remind(exercise.id,1).then(function(result){
				exercise.called = true;
			});
		}
		/**
		 * 删除练习
		 */
		$scope.delExercise = function(exercise,index){
			var data = {
					message:"作业删除后不能恢复，是否继续？",
					type:2
			};
			$scope.$emit('alert',data);
			$scope.$on('alertEvent',function(event,data){
				ExerciseService.deleteExercise($scope.userInfo.uid,exercise.id).then(function(result){
					if(result == 1){
						$scope.exercises.splice(index,1);
					}
				},function(msg){
					var data = {
							message:msg,
							type: "ok"
					};
					$scope.$emit('alert',data);
				});
			})
		}
		$scope.unDelExercise = function(exercise,index){
			var data = {
					message:"已有学生完成作业，不能进行删除操作",
					type:"ok"
			};
			$scope.$emit('alert',data);
		}
	}]);
