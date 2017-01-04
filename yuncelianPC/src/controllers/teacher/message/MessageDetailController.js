import app from 'app';
import 'services/ExerciseService';
import 'directives/ng-carousel';

export default app.controller('MessageDetailController',['$scope','$location','ExerciseService',function($scope,$location,ExerciseService){


		var url = $location.absUrl();

		$scope.messageId = url.split('/message/')[1];

		$scope.assignments = [];

		$scope.isShowGallery = false;
		$scope.isReminedAll = false;

		$scope.gallery = undefined;
		$scope.initGallery = function(gallery){
			$scope.gallery = gallery;
			$scope.gallery.addImageClickListener(function(){
				$scope.isShowGallery  = false;
				$scope.$digest();
			});
		}



		$scope.showGallery = function (index){
			if(angular.isDefined($scope.gallery)){
				$scope.gallery.setIndex(index);
			}

			$scope.isShowGallery  = true;
		}


		$scope.remindAll = function(){
			ExerciseService.remind($scope.messageId).then(function(result){
				// 更新所有的assignment
				angular.forEach($scope.assignments,function(assign){
					assign.reminded=true;
				});
				$scope.isReminedAll = true;
			},function(msg){

			});
		}

		$scope.remindOne = function(assign){
			if(assign.reminded){
				return;
			}
			ExerciseService.remind(assign.id,2).then(function(result){
				// 更新assignment
				assign.reminded=true;
			},function(msg){

			});
		}

		$scope.$watch('messageId',function(newVal,oldVal){
			if(newVal!=-1){
				ExerciseService.loadAssignments($scope.messageId).then(function(assignments){
					// console.log(assignments);
					$scope.assignments=assignments;
				});
			}
		});


}]);