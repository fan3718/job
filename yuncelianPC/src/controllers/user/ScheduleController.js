import app from 'app';
import 'services/UserService'
	/**
	 * 待办事项
	 */
export default app.controller('ScheduleController',['$scope','UserService',function($scope,UserService){
		$scope.schedules = [];
		UserService.getUserSchedules().then(function(schedules){
			$scope.schedules = schedules;
		});
}]);