import app from 'app';
import 'services/Toolkit';
import 'directives/ng-swiper';
export default app.controller('AssignmentController',['$scope','Toolkit',function($scope,Toolkit){
		$scope.activeIndex = 0;
		$scope.swiper = null;
		$scope.initSwiper = function(swiper){
			$scope.swiper = swiper;
		}
		$scope.changeSilder = function(index){
			if($scope.swiper !=null){
				$scope.activeIndex = index;
				$scope.swiper.swipeTo(index,200);
			}
		}
		$scope.slideIndexTag=0;
		$scope.slideStyle={left:'0px',transition:'left 0.5s linear'};
		Toolkit.initQList(0,11);
		$scope.slideRight=function(num){
			var num=num;
			var index=Math.ceil(num/11);
			if($scope.slideIndexTag+1==index){
				return false;
			}else{
				$scope.slideIndexTag++;
				$scope.slideStyle.left=-$scope.slideIndexTag*860+'px';
			}
			Toolkit.initQList(11*($scope.slideIndexTag),11*($scope.slideIndexTag+1));
		}
		$scope.slideLeft=function(){
			if($scope.slideIndexTag==0){
				return false;
			}else{
				$scope.slideIndexTag--;
				$scope.slideStyle.left=-$scope.slideIndexTag*860+'px';
			}
			Toolkit.initQList(11*($scope.slideIndexTag),11*($scope.slideIndexTag+1));
		}

	}]);