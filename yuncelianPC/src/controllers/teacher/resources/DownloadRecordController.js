import app from 'app';
import layer from 'layer-dialog';

import 'services/ResourceService';
import 'services/CacheService';
import 'services/VideoHelper';


export default app.controller('DownloadRecordController',['$scope','$window','$timeout','ResourceService','CacheService','VideoHelper', function($scope,$window,$timeout,ResourceService,CacheService,VideoHelper){
	
	
	$scope.currentPage = 1;
	
	
	loadRecords(true) ;
	
	
	
	$scope.leftNav = function(action){
		if('center' == action){
			window.location.href="/user/center";
		}else if('account' == action){
			window.location.href="/user/account";
		}else if("favor" == action){
			window.location.href="/user/paperFavor";
		}else if("download" == action){
			window.location.href="/teacher/downloadRecords";
		}
	}
	
	/**
	 * 我的下载分页切换方法
	 */
	$scope.changePage = function (page) {
        $scope.currentPage = page ;
        loadRecords()
    };
	
	function loadRecords (isInitPage) {
		var data = {
            p: $scope.currentPage-1,
            ps: 15
        }
		ResourceService.downloadRecodsList(data.p, data.ps).then(function(data){
            $scope.list = data.downloadList;
            if (isInitPage) {
                $scope.currentPage  = 1 ;
                $scope.listCount = data.count;
            }
        }, function(msg){});
	}
	
}]);