import app from 'app';

import 'services/ExerciseService';
import 'ng-file-upload';



export default app.controller('MessageController',['$scope','$filter','ExerciseService','Upload',function($scope,$filter,ExerciseService,Upload){
	// 筛选作业的班级ID
	// ng-repeat 每个对象有自己的scope，因此需要包裹一层，才能实现radio的切换ng-model值也改变
	$scope.isRadioSelected = function(classNum){
		if($scope.filter.classId==classNum){
			return true;
		}
		return false;
	}
	var PAGE_SIZE = 40;
	var hasMore = true;
	$scope.isLoaded = false;
	$scope.filter={
		classId:-1,
		p:0,
		ps:PAGE_SIZE,
		maxId:-1
	};
	$scope.classFilter = function(item){
		return item.messageCount >0;
	}
	$scope.now = new Date();

	// 编辑模式
	$scope.editMode = 1;


	$scope.form={};
	function initFormData(){
		$scope.form={
			grade:-1,
			subjectCode: -1,
			subjectId:-1,
			isOnlineSubmit:false,
			pics:[],
			dueTime:{

			},
			classes:[]
		};
		$scope.editMode = 1;

		updateTime();
	}


	function updateTime(){
		var now = new Date();
		var needUpdateTime = false;
		if(angular.isUndefined($scope.form.day) || angular.isUndefined($scope.form.hour) ||angular.isUndefined($scope.form.minute)){
			needUpdateTime = true;
		}else{
			var oldTime = new Date($scope.form.day+" "+$scope.form.hour+":"+$scope.form.minute);
			if(parseFloat(oldTime.getTime()/1000)<parseFloat(now.getTime()/1000)){
				needUpdateTime = true;
			}
		}
		$scope.now = now;
		if(needUpdateTime){
			$scope.form.day =$filter('date')($scope.now,'yyyy/MM/dd');
			$scope.form.hour = $scope.now.getHours()<10?"0"+$scope.now.getHours():""+$scope.now.getHours();
			$scope.form.minute = $scope.now.getMinutes()<10?"0"+$scope.now.getMinutes():""+$scope.now.getMinutes();
		}
	}


	$scope.disabledCheckbox = function(clazz){


		// 班级人数必须不为零，和当前被选中的班级的年级必须一样，
		return clazz.stuCount==0 || ( $scope.form.grade != -1&&clazz.classGrade!= $scope.form.grade)
	}
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
	$scope.delPic = function(index,pic){
		$scope.form.pics.splice(index,1);
	}
	$scope.addPic = function(){

	}
	$scope.latestMonth= [];
	for(var i=0;i<30;i++){
		var item = {};
		var time = $scope.now.getTime()+1000*24*60*60*i;
		item.time = time;
		item.name = $filter('date')(time,'yyyy/MM/dd');
		$scope.latestMonth.push(item);
	}

	initFormData();

	$scope.messages = [];

	$scope.messagesState = 0 ;
	function filterExercise(){
		if(!hasMore){
			return;
		}
		if($scope.messagesState == 0){
			$scope.messagesState = 1 ;
			ExerciseService.filterExercise($scope.filter).then(function(messages){
				// $scope.messages = messages;
				$scope.messagesState = 0 ;
				hasMore=messages.length>=PAGE_SIZE;
				if(messages!=null && messages.length>0){
					$scope.messages.push.apply($scope.messages,messages);
					// window.sessionStorage.setItem("exercise",JSON.stringify($scope.messages));
					$scope.filter.maxId=messages[messages.length-1].id;
				}
				$scope.isLoaded =true;
			});
		}

	}


	$scope.$watch('filter.classId',function(newValue,oldValue){
		if(newValue !=oldValue){
			hasMore=true;
			$scope.isLoaded = false;
			$scope.messages = [];
			$scope.filter.maxId=-1;
			filterExercise();
		}
	});

	filterExercise();

	// 定时发送开关
	$scope.toggleAlarm = function(){
		if($scope.editMode != 3){
			// 更新时间
			updateTime();
			$scope.editMode = 3;
		}else{
			$scope.editMode = 1;
		}
	}

	// 图片上传开关
	$scope.toggleUploadPic = function(){
		if($scope.editMode != 2){
			$scope.editMode = 2;
		}else{
			$scope.editMode = 1;
		}
	}

	$scope.upload = function (file) {
		if(file&&file.size>500*1024){
			var data = {
					message:'图片最大不能超过500K',
			};
			$scope.$emit('alert',data);
			return;
		}
		var upload=Upload.upload({
			method: 'POST',
			url: '/upload/img',
			data: {file: file}
		}).then(function (resp) {
			var result = resp.data;
			console.log(result);
			if(result.code == 1){
				var img = {};
				img.url=result.url;
				img.imgId = result.imgId;
				$scope.form.pics.push(img);
			}else{
				var data = {
					message:result.msg,
				};
				$scope.$emit('alert',data);
			}
		}, function (resp) {

		}, function (evt) {
		});
	};

	$scope.send = function(){

		var startTime = new Date($scope.form.day+" "+$scope.form.hour+":"+$scope.form.minute).getTime();
		var params={};
		params['abstract'] = $scope.form.content;
		params.pen = $scope.form.isOnlineSubmit;
		var classIds = [];
		for(var i = 0;i<$scope.form.classes.length;i++){
			classIds[classIds.length]=$scope.form.classes[i].classId;
		}
		params.classIds = classIds;
		params.images = $scope.form.pics;
		// 精确到分
		params.startTime = Math.floor(startTime/60/1000)*60*1000;
		ExerciseService.assignMessage(params).then(function(result){

			if(result&&result.length!=0){
				var data = {
						message:"作业布置成功"
				};
				$scope.$emit('alert',data);
				$scope.$on('alertEvent',function(event,data){
					initFormData();
					for(var i=result.length-1;i>=0;i--){
						$scope.messages.splice(0,0,result[i]);
					}
				})
			}

		},function(msg){
			var data = {
				message:msg,
			};
			$scope.$emit('alert',data);
		});

	}


	$scope.loadMessageNext = function(){
		filterExercise();
	}


	$scope.selectedClass = function(id){
		var index=$scope.form.classes.indexOf(id)
		if(index<0){
			$scope.form.classes.push(id);
		}else{
			$scope.form.classes.splice(index,1);
		}
		// console.log($scope.form.classes);
	}
	/*
	 * 消息通知编辑框，字符限制。
	 */
	$scope.checkText = function () {
		if ($scope.form.content.length > 5) {
			$scope.form.content = $scope.form.content.substr(0, 500);
		}
	}
}]);
