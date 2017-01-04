import app from 'app';
import 'services/ReportService';
import 'services/Toolkit';

app.controller('ExerciseNoteController',['$scope','ReportService','Toolkit',function($scope,ReportService,Toolkit){

		$scope.params = Toolkit.serializeParams();
		$scope.report = {};

		ReportService.getExerciseWrongNote($scope.params.exerId).then(function(result){
			$scope.report= result;
		},function(msg){

		});


		$scope.toggleAnalysis = function(question){
			question.showAnalysis = !question.showAnalysis;
		}

	}]);