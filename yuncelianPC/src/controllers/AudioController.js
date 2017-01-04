import app from 'app';
import 'services/AudioService';

export default app.controller('AudioController',['$scope','AudioService',function($scope,AudioService){
		var prevID = '';
		$scope.play = function(src,id){
			if(prevID != '' && prevID != id){
				$scope.isShowAduio[prevID] = false ;
			}
			prevID = id;
			AudioService.play(src).then(function(notify){
				if(notify.type == 'ended'){
					$scope.isShowAduio[id] = false ;
				}
			});
		}
	}]);