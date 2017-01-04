import app from 'app';
import 'services/MaterialService';
import 'services/DownloadExclService';
import 'services/ExerciseService';
import 'services/ResourceService';

import 'directives/ng-video-slider';
import 'directives/ng-video';
import 'directives/ng-calendar';


app.controller('CartController',['$scope','$state','$window','$filter','MaterialService','ExerciseService','DownloadExclService','ResourceService',function($scope,$state,$window,$filte,MaterialService,ExerciseService,DownloadExclService,ResourceService){

		$scope.cart = {
				videos:[],
				questions:[]
		};

		$scope.showDialog = false;
		var downLoadFlag=true;
        $scope.downLoad=function () {
        	if(downLoadFlag){
        		downLoadFlag = false;
        		var form = $scope.$parent.getFormData();
	            var downLoadData={};
				downLoadData['subject']=$scope.params.subjectCode;
				downLoadData['filetype']=1;
				downLoadData['source']=1;
				downLoadData['paper']={};
				downLoadData['paper']['title']=form.name;
				downLoadData['paper']['group']=[];
				downLoadData['paper']['group'][0]={
					'title':'选择题',
					'qids':[]
				};
	            if($scope.cart['questions']){
	                angular.forEach($scope.cart['questions'],function (question) {
	                    downLoadData['paper']['group'][0].qids.push(question.id);
	                });
	                DownloadExclService.downloadExcl(downLoadData,$scope.userInfo.uid).then(function (result) {
	                	if(result == 429){
							var data = {
			                        message:'您已达到今天最大下载数，请明天再试'
			                    };
			                    $scope.$emit('alert',data);
			                    downLoadFlag=true;
						}else{
							if(result.code==1){
	                            result.downloadType = 0;//下载类型0自组1套卷
	                            DownloadExclService.getFilePath(result).then(function (res) {
	                                if(res['filePath']){
	                                    downLoadFlag=true;
	                                    ResourceService.downloadRecods(result.downloadType,form.name||'',res['filePath'],'success');
	                                    window.location.href=res['filePath'];

	                                }
	                            })
		                    }else{
		                        var data = {
		                            message:'下载失败,请重新下载'
		                        };
		                        $scope.$emit('alert',data);
		                        downLoadFlag=true;
		                    }
						}
	                })
	            }else{
	                var data = {
	                    message:'没有题目可供下载'
	                };
	                $scope.$emit('alert',data);
	                downLoadFlag=true;
	            }
        	}else{
                var data = {
                    message:'下载正在进行中，请稍候'
                };
                $scope.$emit('alert',data);
            }

        }
		MaterialService.getCart().then(function(data){
			//$scope.cart=data;
			$scope.cart = {
					videos:[],
					questions:[]
			};
			for(var key in data){
				if(key=='0'){
					$scope.cart.videos.push.apply($scope.cart.videos,data[key]);
				}else{
					$scope.cart.questions.push.apply($scope.cart.questions,data[key]);
				}
			}



		});

		$scope.getCarQuestionDetail = function(quest){

			if(angular.isUndefined(quest.showAnalysis)){
				MaterialService.getQuestionById(quest.id,$scope.params.subjectCode).then(function(info){
					quest.showAnalysis = true;
					try{
						$scope.$digest();
					}catch (e) {

					}
				});
			}else{
				quest.showAnalysis = !quest.showAnalysis;
			}
		}


		$scope.isShowTipBox = false;
		$scope.alert = {

		};

		$scope.showTip = function(isOk){
			if(isOk){
				$scope.isShowTipBox = false;
			}
		}

		var swap = function(arr, index1, index2) {
	        arr[index1] = arr.splice(index2, 1, arr[index1])[0];
	        return arr;
	    };

		$scope.up = function(index,question,sectionCode){
			console.log(index+"   "+question);
			if(index == 0){
				return;
			}

			MaterialService.sort('up',question.id).then(function(){
				swap($scope.cart.questions, index, index - 1);
			},function(){

			});


		}
		$scope.down = function(index,question,sectionCode){
			console.log(index+"   "+question.id );
			if(index == $scope.cart.questions.length-1){
				return;
			}

			MaterialService.sort('down',question.id).then(function(){
				swap($scope.cart.questions, index, index + 1);
			},function(){

			});

		}
		$scope.remove = function(index,question,sectionCode){
			MaterialService.handleCart('delete',question.ID ||question.id,question.Type,$scope.params.subjectCode,$scope.params.subjectId).then(function(){
				var index = $scope.basket.cart.questions.indexOf(question.id);
				console.log($scope.basket.cart.questions+'-------'+question.id);
				if(index >-1){
					 $scope.cart.questions.splice(index,1);
					 $scope.basket.cart.questions.splice(index,1);
					 $scope.alert.message = "删除成功！";
					 $scope.isShowTipBox = true;
					 $scope.basket.cart.questions.length = $scope.cart.questions.length;
				}
				$scope.$parent.removeJsQuestion(question);
				toFilter();
			},function(msg){
			});

		}

		$scope.getAnswer = function(index){
			return $filte('charCode')(index);
		}

		$scope.openDialogBox = function(){


			var form = $scope.$parent.getFormData();

			var startTime = new Date(form.startDate +" "+ form.startTime);
			var now = new Date();
			if(now.getTime()>=startTime.getTime()){
				$scope.$parent.setStartTime(now);
			}

			$scope.showDialog = true;
		}

		$scope.closeDialogBox = function(){
			$scope.showDialog = false;
		}

		var mSlider = null;
		$scope.initVideoSlider = function(slider){
			mSlider = slider;
			if(mSlider!=null){
				mSlider.removeListener(function(index,video){
					MaterialService.handleCart('delete',video.externalId || video.ID,0,$scope.params.subjectCode,$scope.params.subjectId).then(function(){
						$scope.cart.videos.splice(index,1);
						$scope.$parent.removeJsVideo(video);
						toFilter();
					});
				});
			}
		}

		function toFilter(){
			var length = 0;
			if(angular.isDefined($scope.cart.videos)){
				length += $scope.cart.videos.length;
			}

			if(angular.isDefined($scope.cart.questions)){
				length += $scope.cart.questions.length
			}
			if(length==0){
				$scope.cart = {};
				$scope.$parent.clearCart();
				$scope.alert.message = "删除成功！";
				$scope.isShowTipBox = true;
				$state.go('filter');
			}
		}
		$scope.assign = function(){
			if($scope.form.name.length>40){
				return ;
			}
			ExerciseService.assignExercise($scope.form).then(function(result){
				if(result&&result.length!=0){
					var data = {
							message:"作业布置成功"
					};
					$scope.$emit('alert',data);
					$scope.$on('alertEvent',function(event,data){
						//清除本地数据工作
						$window.location.href="/exercise";
					})
				}
			},function(msg){
				var data = {
						message:msg,
				};
				$scope.$emit('alert',data);
			});

		}


		$scope.showAnswer = false;
		$scope.toggleShowAnswer = function(){
			$scope.showAnswer = !$scope.showAnswer;
		}


		$scope.clearAll = function(){
			$scope.cart = {};
			$scope.$parent.clearCart();
			$scope.continueFilter();

		}

		$scope.removeFromCart = function(question){
			MaterialService.handleCart('delete',question.ID,question.Type,$scope.params.subjectCode,$scope.params.subjectId).then(function(){
					var index = $scope.cart.questions.indexOf(question.ID);
					if(index >-1){
						 $scope.cart.questions.splice(index,1);
					}
					toFilter();
			},function(msg){
			});
		}



	}]);
