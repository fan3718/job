import app from 'app';

export default app.directive('ngScore',[function(){
		return {
			restrict: "AE",
			replace:true,
			scope:{
				ngScore:'=',
				ngMaxScore:'='
			},
			template:require('./ng-score.htm'),
			link:function(scope,element,attrs){
				scope.ngScore =  scope.ngScore || 0;
				scope.ngMaxScore =  scope.ngMaxScore || 0 ;
				//console.log();
				scope.numbers = [];

				scope.$watch('ngScore',function(newValue,oldValue){

					if(newValue>scope.ngMaxScore){
						return;
					}

					if(newValue!=oldValue){
						initNumbers(newValue);
					}
				});

				initNumbers(scope.ngScore);
				function initNumbers(score){
					scope.numbers.splice(0,scope.numbers.length);
					scope.ngVisible = scope.ngScore > 0 && scope.ngScore<scope.ngMaxScore;
					if(score<10){
						scope.numbers.push(score);
					}else{
						var str = score+'';
						for(var i=0;i<str.length;i++){
							var number = parseInt(str.charAt(i));
							scope.numbers.push(number);
						}
					}
				}

			}
		};
	}]);