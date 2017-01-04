import app from 'app';
import 'services/Toolkit';
import 'services/ReportService';

export default app.controller('ReportClassController',['$scope','Toolkit','ReportService',function($scope,Toolkit,ReportService){
		
		$scope.params = Toolkit.serializeParams();
		$scope.isLoaded = false;
		$scope.info = {
				assignTotal:-1,
				
		};
		
		ReportService.getClassTermReport($scope.params.classId,$scope.params.subjectId,$scope.params.term).then(function(info){
			$scope.info = info;
			$scope.isLoaded = true;
		},function(msg){
			$scope.isLoaded = true;
		});
		
	}]);