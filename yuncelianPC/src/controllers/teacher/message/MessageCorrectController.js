import app from 'app';

import 'services/ExerciseService';

import 'directives/ng-doodle';

app.controller('MessageCorrectController',['$scope','$location','ExerciseService',function($scope,$location,ExerciseService){

		$scope.doodle = undefined;
		$scope.form = {
			imageData:'',
			comment:''
		};
		$scope.isShowAduio = false;
		$scope.isShowGallery = false;
		$scope.currentIndex = 1;

		$scope.$watch('comment',function(newValue){
			if(newValue!=''){
				$scope.form.comment = newValue;
			}
		});

		var url = $location.absUrl();
		var ids ;
		try{
			ids = url.split('/correct/')[1].split('-');
		}catch(e){
			ids = url.split('/view/')[1].split('-');
		}
		$scope.form.messageId = ids[0];
		$scope.form.assignId = ids[1];

		$scope.empty = {
			undo : true,
			redo : true
		};

		$scope.isEdit = false;

		$scope.toggleEdit = function(){
			$scope.isEdit =!$scope.isEdit ;
			$scope.doodle.setEditMode($scope.isEdit);
		}
		$scope.gallery = undefined;
		$scope.initGallery = function(gallery){
			$scope.gallery = gallery;

			$scope.gallery.addImageClickListener(function(){
				console.log("img click");
				$scope.isShowGallery  = false;
				$scope.$digest();
			});

		}

		$scope.initDoodle = function(doodle){
			$scope.doodle = doodle;
			if(angular.isDefined($scope.doodle)){
				$scope.doodle.empty = {};
				$scope.doodle.addListener(function(isUndoEmpty){
					$scope.empty.undo = isUndoEmpty;
					//强制刷新
					try{
						$scope.$digest();
					}catch (e) {

					}


				},function(isRedoEmpty){
					$scope.empty.redo = isRedoEmpty;
					//强制刷新
					try{
						$scope.$digest();
					}catch (e) {
					}
				});
			}
		}


		$scope.undo = function(){
			if(angular.isDefined($scope.doodle)){
				$scope.doodle.undo();
			}
		}


		$scope.redo = function(){
			if(angular.isDefined($scope.doodle)){
				$scope.doodle.redo();
			}
		}

		$scope.showGallery = function (index){
			if(angular.isDefined($scope.gallery)){
				$scope.gallery.setIndex(index);
			}

			$scope.isShowGallery  = true;
		}

		$scope.correct = function(){
			if(angular.isDefined($scope.doodle)){
				var urls = $scope.doodle.getImageUrls();
				if(angular.isDefined(urls) && urls.length >0){
					$scope.form.imageUrl=urls[0];
				}
				$scope.form.imageData=$scope.doodle.exportImage();
			}


			ExerciseService.correctMessage($scope.form).then(function(){
				var data = {
					message:"批改成功",
					action:'correct-message-complete'
				};
				$scope.$emit('alert',data);
			},function(msg){
				var data = {
					message:msg,
				};
				$scope.$emit('alert',data);
			});

		}

		$scope.$on('alertEvent',function(event,data){
			if('correct-message-complete' == data.action){
				window.location.href="/message/view/"+$scope.form.messageId+'-'+$scope.form.assignId;
			}
		});



	}]);