import app from 'app';
import 'services/EvaluationService';
import 'services/Toolkit';

import 'directives/ng-swiper';


/**
	 * 学能评测
	 */
export default app.controller('EvaluationAbilityController',['$scope','$timeout','$filter','EvaluationService','Toolkit',function($scope,$timeout,$filter,EvaluationService,Toolkit){
		
		
		$scope.params = Toolkit.serializeParams();
		
		$scope.showForm = false;
		var evaluationIndex = [3,4,5,2,1];
		$scope.form = {
				gender:1,
				grade:"1"
		};

		if(angular.isDefined($scope.params.id)){
			//加载之前数据
			
			EvaluationService.getEvaluationDetail($scope.params.id,true).then(function(report){
				console.log(report);
				var evaluation = report.evaluation;
				
				
				$scope.form.stuName = evaluation.studentName;
				$scope.form.age = evaluation.age;
				$scope.form.gender = evaluation.gender;
				$scope.form.phone = evaluation.phoneNumber;
				$scope.form.school = evaluation.school;
				$scope.form.grade = evaluation.gradeNo;
				$scope.form.gradeName = evaluation.gradeName;
			});
			
			
		}else{
			
		}
		
		//当前学能评测的类型
		$scope.evaluationType = 1;
		
		$scope.questions = [];
		
		$scope.sections = [];
		
		
		$scope.swiper = null;
		
		function loadAbilityQuestion(){
			EvaluationService.findCompetenceQuestion(evaluationIndex[$scope.evaluationType-1]).then(function(questions){
				$scope.questions = questions;
			},function(msg){
				console.log(msg);
			});
		}
		
		loadAbilityQuestion();
		
		$scope.initSwiper = function(swiper,id){
			$scope.swiper = swiper;
		}
		
		var startTime = 0;
		
		//选择题目答案之后0.5秒跳转到下一题
		$scope.selectOption = function(question,questionIndex,optionIndex){
			question.answerIndex = optionIndex;
			question.userAnswer = $filter('charCode')(optionIndex);
			if(questionIndex == 0){
				startTime = new Date().getTime();
			}
			if(questionIndex < $scope.questions.length - 1){
				$timeout(function(){
					if($scope.swiper != null){
						$scope.swiper.swipeNext();
					}
				},500);
			}else{ //
				//生成Sections
				var section = {};
				section.type = evaluationIndex[$scope.evaluationType-1];
				section.count = $scope.questions.length;
				section.seconds = parseInt((new Date().getTime() -startTime)/1000);
				var quests = [];
				angular.forEach($scope.questions,function(quest){
					var item = {};
					item.id = quest.id;
					item.level = quest.level;
					item.userAnswer = quest.userAnswer;
					item.rightAnswer  = quest.answer;
					quests.push(item);
				});
				section.questions = quests;
				$scope.sections.push(section);
				
				console.log($scope.sections);
				
				
				
				
				$scope.evaluationType ++;
				if($scope.evaluationType <=5 ){
					//弹出对话框
					$scope.msg = "恭喜你！通过了"+EvaluationService.getEvaluationType(evaluationIndex[$scope.evaluationType-1-1])+"开始"+EvaluationService.getEvaluationType(evaluationIndex[$scope.evaluationType-1])+"吧!";
					$scope.showDialog = true;
				}else{
					$scope.showForm = true;
					//$scope.msg ="所有测试都完成";
					//$scope.showDialog = true;
				}
				
			}

		}
		
		$scope.closeDialog = function(){
			$scope.showDialog = false;
			if($scope.evaluationType <=5 ){
				loadAbilityQuestion();
			}else{
				$scope.showForm = true;
			}
			
		} 
		
		$scope.showReport = function(){
			if(angular.isDefined($scope.params.id)){ //更新
				EvaluationService.saveSections($scope.params.id,$scope.sections).then(function(){
					window.location.href="/evaluation/report/ability?id="+$scope.params.id;
				},function(msg){
					
				});
			}else{ //新增
				
				EvaluationService.save($scope.form,$scope.sections).then(function(evaluation){
					window.location.href="/evaluation/report/ability?id="+evaluation.id;
				},function(msg){
					alert(msg);
				});
			}
		}
		
		
	}]);
	

	