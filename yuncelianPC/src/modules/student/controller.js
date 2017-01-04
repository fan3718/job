define(['app','UserService','ExerciseService','MaterialService','AudioService','Filter','progressbar','directives','ngVideoSlider','Toolkit','ReportService','ngProgressBar','ngLocation','ngSwiper','ngEcharts','WorkTrailService'],function(app,UserService,ExerciseService,MaterialService,AudioService,WorkTrailService){
	'use strict';
app.controller('StudentController',['$scope','UserService','WorkTrailService','AudioService',function($scope,UserService,WorkTrailService){
	$scope.exers = [];
	$scope.page = 0;
	$scope.pageSize = 10;
	$scope.showLayer = false;
	$scope.subjectID = -1;
	
	$scope.isEnd = false;
	$scope.isLoading = false;
	$scope.error = false;
	$scope.empty = false;
	
	$scope.showSubject =false;
	
	UserService.getUserInfo().then(function(info){
		$scope.userInfo=info;
		$scope.$broadcast('userinfo',info);
	});
	
	$scope.schedules = [];
	UserService.getUserSchedules().then(function(schedules){
		$scope.schedules = schedules;
	});
	
	$scope.zones = [];
	UserService.getClassZone().then(function(zones){
		$scope.zones = zones;
	});
	
	$scope.now = new Date().getTime();
	$scope.logout = function(){
		console.log('clear');
		window.sessionStorage.clear();
		window.location.href="/account/logout";
	}
	
	
	
	
	
	
	function loadWorkTrail(){
		console.log("----------------------jinrule--------------------------------");
		if($scope.isLoading || $scope.isEnd){
			return;
		}
		$scope.isLoading = true;
		
		
		WorkTrailService.getStudentWorkTrail($scope.subjectID,$scope.page,$scope.pageSize).then(function(result){
			var data = result.list;
			if($scope.page == 0){
				$scope.exers = [];
				if(data.length ==0){
					$scope.empty = true;
				}
			}
			for(var index=0;index<data.length;index++){
				$scope.exers.push(data[index]);
			}
			$scope.page++;
			$scope.isLoading = false;
			if(data.length < $scope.pageSize){
				$scope.isEnd = true;
			}
		},function(msg){
			$scope.isLoading = false;
			$scope.msg=msg;
			$scope.error = true;
		});
	}
	$scope.getMsgStatus = function(msg){
		if(msg.status == 5){ //已完成
			if(msg.totalScore != 100){
				//计算总数
				msg.total= msg.wrongCount+msg.rightCount;
				return 2;
			}else{
				return 1;
			}
		}else if(msg.status == 4){ //已截至
			return 3;
		}else{ //开始答题
			return 4;
		}
	}
	
	$scope.loadSubjectWorkTrail=function(subjectID){
		if($scope.subjectID != subjectID){
			$scope.page = 0;
			$scope.subjectID = subjectID;
			$scope.isEnd = false;
			$scope.isLoading = false;
			loadWorkTrail();
		}
	}
	
	$scope.showImage = function(exer){
		return exer.firstImageID != 'undefined' && exer.firstImageID >0;
	}
	
	$scope.showAttachment = function(exer){
		return exer.attachmentCount !='undefined' && exer.attachmentCount > 0;
	}
	/**
	 * 打开菜单
	 */
	$scope.openNav=function(){
		$scope.showLayer = true;
	}
	$scope.loadNext = function(){
		loadWorkTrail();
	}
	
	
	$scope.toggleSubject = function(){
		$scope.showSubject = !$scope.showSubject;
	}
	/**
	 * 首次加载
	 */
	loadWorkTrail();
	/**
	 * 菜单
	 */
	$scope.menus =[{
		url:'/wap/student/index',
		name:'首页',
		icon:'home-icon'
	},{
		url:'/wap/account/v3/report',
		name:'练习报告',
		icon:'report-icon'
	},{
		url:'/wap/student/myShcoolClass',
		name:'我的班级',
		icon:'manage-icon'
	}];

}]);
	
});