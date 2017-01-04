import app from 'app';
import 'services/ExamService';
import 'services/Toolkit';
import 'services/MaterialService';
import 'services/DownloadExclService';

import 'directives/ng-pagination';
import 'directives/ng-calendar';

app.controller('ExamController',['$scope','$window','$filter','ExamService','Toolkit','MaterialService','DownloadExclService',function($scope,$window,$filter,ExamService,Toolkit,MaterialService,DownloadExclService){

	$scope.classFilter = function(item){
		return item.examCount >0;
	}

	$scope.params = Toolkit.serializeParams();
	$scope.showFavorite = false;
	$scope.filter = {
		area:0,
		year:0,
		grade:0,
		type:0
	};
	var classes = ($scope.params.classIds.split(','))|| [];
	$scope.form = {
			classes:classes,
			grade:$scope.params.gradeNo
	};
	$scope.total = 0;
	$scope.page =1;
	$scope.papers = [];
	$scope.favorite = {

	};
	loadFavoritePapers();
	$scope.showDialog = false;

	$scope.$on('userinfo',function(event,info){
		$scope.userInfo = info;
		$scope.form.classes=[];
		angular.forEach($scope.userInfo.classes,function(clazz){
			var index = classes.indexOf(clazz.classId+"");
			if(index >=0){
				clazz.checked = true;
				$scope.form.grade = clazz.classGrade;
				$scope.form.subjectCode = clazz.subjectCode;
				$scope.form.subjectId = clazz.subjectId;
				//var id = clazz.classId+'';
				$scope.form.classes.push(clazz);
				//console.log($scope.form.classes);
			}
		});
	});
	$scope.disabledCheckbox = function(clazz){
		//班级人数必须不为零，和当前被选中的班级的年级必须一样，
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
		//alert(window._varBrower);
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
			$scope.currentSubject = clazz.subjectCode;
			console.log($scope.currentGrade);
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
	$scope.$watch('currentSubject',function(newValue,oldValue){
		var classIds = [];
		if(newValue!=oldValue){
			for( var i=0;i< $scope.form.classes.length;i++){
				classIds[classIds.length] =$scope.form.classes[i].classId;
			}
			window.sessionStorage.clear();
			//console.log('/exercise/assign?classIds='+classIds.join(',')+'&subjectCode='+$scope.params.subjectCode+"&subjectId="+$scope.params.subjectId+"&gradeNo="+newValue);
			$window.location.href='/exam/filter?classIds='+classIds.join(',')+'&subjectCode='+$scope.form.subjectCode+"&subjectId="+$scope.form.subjectId+"&gradeNo="+$scope.form.grade;

		}
	});




	$scope.changeArea = function(code){
		$scope.filter.area = code;
		$scope.filter.page = 0;
		$scope.page =1;
		filterExamPaper();
	}

	$scope.showFavor = function(isShow){
		$scope.showFavorite = isShow;
	}

	$scope.changeYear = function(year){
		$scope.filter.year = year;
		$scope.filter.page = 0;
		$scope.page =1;
		filterExamPaper();

	}

	$scope.changeGrade = function(grade){
		$scope.filter.grade = grade;
		$scope.filter.page = 0;
		$scope.page =1;
		filterExamPaper();
	}

	$scope.chagePaperType = function(type){
		$scope.filter.type = type;
		$scope.filter.page = 0;
		$scope.page =1;
		filterExamPaper();
	}


	$scope.changePage = function(index){
		$scope.filter.page = index;
		$scope.page = index;
		filterExamPaper();
	}


	$scope.loadPaperDetail = function(paper){
		if($scope.form.classes.length==0){
			var data = {
				message:'请选择班级',
			};
			$scope.$emit('alert',data);
			return ;
		}
		var aClasses = [];
		for(var i=0;i<$scope.form.classes.length;i++){
			if($scope.form.classes[i].classId == undefined){
				aClasses[aClasses.length]=$scope.form.classes[i];
			}else{
				aClasses[aClasses.length]=$scope.form.classes[i].classId;
			}

		}
		$window.location.href="/exam/assign?classIds="+aClasses.join(',')+"&subjectCode="+$scope.params.subjectCode+"&subjectId="+$scope.params.subjectId+"&paperId="+paper.id;

	}

	$scope.isDefined = function(obj){
		return angular.isDefined(obj) && obj !=null && obj!='';
	}

	function filterExamPaper(){
		ExamService.filterExamPaper($scope.params.subjectCode,$scope.filter.area,$scope.filter.year,$scope.filter.grade,$scope.filter.type,$scope.filter.page-1).then(function(result){
			$scope.papers =result.papers;
			$scope.total = result.total;


		},function(){

		});
	}


	function loadFavoritePapers(){
		ExamService.getFavoritePaper().then(function(result){
			$scope.favorite =result;
		},function(){

		});
	}


	$scope.showMore = false;
	$scope.toggleShowMore = function(){
		$scope.showMore = !$scope.showMore;
	}
	filterExamPaper();
}]);
