import app from 'app';
import 'services/ReportService';


export default app.controller("ReportController",['$scope','$location','ReportService',function($scope,$location,ReportService){
		
		$scope.reportTerms = [];
		$scope.maxTerm = -1;
		$scope.isLoaded = false;
		$scope.form = {
				isLoading:false,
				isEnd:false
		};
		$scope.loadReportNext = function(){
			loadTermReports();
		}
		
		
		loadTermReports();
		
		function loadTermReports(){
			if($scope.form.isLoading || $scope.form.isEnd){
				return;
			}
			$scope.form.isLoading = true;
			ReportService.getTermReports($scope.maxTerm).then(function(items){
				if(items.length>0){
					$scope.reportTerms.push.apply($scope.reportTerms,items);
					$scope.maxTerm = items[items.length-1].term;
				}else{
					$scope.form.isEnd = true;
				}
				$scope.form.isLoading = false;
				$scope.isLoaded = true;
			},function(msg){
				$scope.form.isLoading = false;
			});
		}
		
		
		$scope.showClassReport = function(report){
			window.location.href="/report/class?classId="+report.classID+"&term="+report.term+"&subjectId="+report.subjectID;
		}
		
	}]);