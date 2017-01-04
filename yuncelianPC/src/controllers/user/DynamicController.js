import app from 'app';
import 'services/UserService'
import 'directives/ng-dynamic';
	/**
	 * 动态
	 */
export default app.controller('DynamicController',['$scope','UserService',function($scope,UserService){
		$scope.zones = [];
		UserService.getClassZone().then(function(zones){
			$scope.zones = zones;
		});
	}]);
	