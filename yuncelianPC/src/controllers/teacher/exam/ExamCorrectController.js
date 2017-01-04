import app from 'app';
import 'services/Toolkit';
import 'services/ExamService';
import 'services/MaterialService';


import 'directives/ng-score';
/**
	 * 单次试卷批改
	 */
export default app.controller('ExamCorrectController',['$rootScope','$scope','$location','$timeout','$anchorScroll','$filter','Toolkit','ExamService','MaterialService',function($rootScope,$scope,$location,$timeout,$anchorScroll,$filter,Toolkit,ExamService,MaterialService){

		$scope.params = Toolkit.serializeParams();
		$scope.isEditable=false;
		$scope.canRedo = {};
		$scope.canUndo = {};
		$scope.doodles = {};
		$scope.tab = 0;
		$scope.tabCount = 0;
		$scope.sectionCode = -1;
		$scope.sliderIndex = 0;
		//记录上次swiper位置
		$scope.lastSlideIndexs = [];
		$scope.swiperIndex=0;
		$scope.quesIndex=0;
		$scope.paper = {};
        $scope.renderFlag=false;
		var url = $location.absUrl();


		ExamService.getUserExamReport($scope.params.exerId,$scope.params.assignId,url.indexOf('correct')==-1).then(function(paper){
			$scope.paper =paper;
			$scope.tab = $scope.paper.tabIndex;
			$scope.status=paper.status;

			MaterialService.loadQuestionsDetail(paper.qids,paper.subjectCode).then(function(questMap){
				for(var key in $scope.paper.qidMap){
					var maps = $scope.paper.qidMap[key];
					var quest = groupInfoList[maps.tab]["questions"][maps.index];
					if(quest){
						groupInfoList[maps.tab]["questions"][maps.index] = cloneQuestionInfo(quest,questMap[key]);
					}
				}
				$scope.paper.groupInfoList = groupInfoList;
			});


			$scope.sliderIndex = $scope.paper.unCorrectedIndex;
			var groupInfoList = $scope.paper.groupInfoList;
			$scope.quesList=$scope.paper.groupInfoList;
			$scope.params.subjectCode = $scope.paper.subjectCode;
			$scope.activeDoodleId=''+$scope.tab+'-'+$scope.sliderIndex;
			if(angular.isDefined(groupInfoList) && angular.isArray(groupInfoList) && groupInfoList.length>0){
				$scope.sectionCode = groupInfoList[0].sectionCode;
				var index = 0;
				$scope.tabCount = groupInfoList.length;
				angular.forEach(groupInfoList,function(info){
					if($scope.paper.tabIndex == index){
						$scope.lastSlideIndexs.push($scope.paper.unCorrectedIndex);
					}else{
						$scope.lastSlideIndexs.push(0);
					}
					index++;
					/*angular.forEach(info.questions,function(question){
						loadQuestionInfo(question);
					});*/
				});
			}

		},function(msg){

		});

		var orderCode = ['一','二','三','四','五','六','七','八','九','十'];
		$scope.getOrderNumber = function(index){
			if(index >9){
				index = 9;
			}
			return orderCode[index];
		}

		$scope.containsLetterCode = function(code,answer){
			code = code ||'';
			answer = answer ||'';
			if(code !='' && answer !=''){
				code = code.toUpperCase();
				answer = answer.toUpperCase();
				return answer.indexOf(code) >-1;
			}
			return false;
		}

		$scope.containsLetterIndex = function(index,answer){
			return $scope.containsLetterCode($scope.getAnswerCode(index),answer);
		}

		var newSwiper;
		$scope.initSwiper = function(swiper,id){
			newSwiper=swiper;
		}
		//图片加载完毕,更新
		$scope.$on('onImageLoaded', function(event, msg) {
			if(newSwiper!=null && typeof(newSwiper)!='undefined'){
				newSwiper.invalidate();
			}
		});

		$scope.changeTab = function(info,tab){
			if($scope.status=="3"){
				var flag=false;
				angular.forEach($scope.quesList[$scope.tab].questions,function(question){
					if(!question.report.corrected){
						flag=true;
					}
				})
				if(flag){
					var data = {
						message:'本大题有题目尚未打分，是否跳过?',
						type:'2',
						action:'skipTab'
					};
					$scope.$emit('alert',data);
					$scope.$on('alertEvent',function(event,data){
						if(data.action=='skipTab'){
							skipTab(tab);
						}
					})
				}else{
					skipTab(tab)
				}
			}else{
				skipTab(tab)
			}
		}
		//大题左右滑动
        $scope.tabsStyle = {
        					marginLeft:'51px',
                            transition:'margin-left 0.5s linear'
                        }
		function  skipTab(tab){
			if(tab > 4 && tab < $scope.tabCount - 1){
                $scope.tabsStyle.marginLeft = 51-(145*(tab - 4))+"px";
            }else if(tab < 5){
                $scope.tabsStyle.marginLeft = "51px";
            }
			$scope.tab = tab;
			$scope.sliderIndex = $scope.lastSlideIndexs[parseInt(tab)];
			newSwiper.activeIndex=$scope.sliderIndex;
			$scope.activeDoodleId=''+$scope.tab+'-'+$scope.sliderIndex;
			$scope.slideIndexTag=0;
			$scope.slideStyle={left:'0px',transition:'left 0.5s linear'}
		}
		$scope.tabsLeft = function(info){
            if($scope.tab > 0){
                $scope.changeTab(info,$scope.tab-1);
            }
        }
        $scope.tabsRight = function(info){
            if($scope.tab < $scope.tabCount - 1){
                $scope.changeTab(info,$scope.tab+1);
            }
        }
		$scope.getAnswerCode = function(index){
			return $filter('charCode')(index);
		}

		$scope.isDefined = function(obj){
			return angular.isDefined(obj) && obj !=null && obj!='';
		}


		$scope.showInput = function(question){
			question.showInput = !question.showInput;
		}

		$scope.confirmScore = function(question,swiperIndex,quesIndex){
			scoreAnswer(question,swiperIndex,quesIndex,question.score);
		}
		/**
		 * 题目正确
		 */
		$scope.correctRight= function(question,swiperIndex,quesIndex) {
			scoreAnswer(question,swiperIndex,quesIndex,question.report.points);
		}

		function cloneQuestionInfo(quest,info){
			quest.isLoaded = true;
			quest.score = quest.report.score || 0 ;
			//绑定数据
			for(var key in info){
				quest[key] = info[key];
			}
			return quest;
		}

		$scope.nextSilder = function(swiperIndex,code,isLast,index){
			var question=$scope.quesList[swiperIndex].questions[newSwiper.activeIndex];
			var sectionCode=$scope.quesList[swiperIndex].sectionCode;
			var id=''+swiperIndex+'-'+newSwiper.activeIndex;
			if(question.type!=1&&question.type!=3){
				saveImageData(question,id,question.type);
			}
			if(isLast){
				//$scope.tab = swiperIndex+1;
				swiperIndex=swiperIndex+1;
				$scope.changeTab(null,swiperIndex);
			}else{
				//判断是否批改完成，未批改弹出提示框
				$scope.skipSlider('nextSlider',swiperIndex,question,code);
			}

		}
		/*
		 * 批改图片
		 * */
		function saveImageData(question,doodleId,sectionCode){
			if($scope.status=="3"&&sectionCode!='1'){
				var data={};
				var doodle = $scope.doodles[doodleId];
				data.eqid = question.report.id;
				data.qid = question.report.questionId;
				data.imgUrl = question.report.answer;
				data.imgData = doodle.exportImage();
				if(data.imgData ){
					ExamService.correctImageData($scope.params.exerId,$scope.params.assignId,JSON.stringify(data)).then(function(result){
						if(result.code=='1'){
							console.log(result);
							$scope.doodles[doodleId].addListener(function(flag){
								$scope.canUndo[doodleId] = !flag;
								try{
									$scope.$digest();
								}catch(e){

								}

							},function(flag){
								$scope.canRedo[doodleId] = !flag;
							});

						}
					},function(msg){
						var data = {
							message:msg,
						};
						$scope.$emit('alert',data);
					});
				}
			}
		}

		$scope.onSliderChangeEnd = function(swiper,id,index){
			$scope.sliderIndex = index;

			//强制刷新
			try{
				$scope.lastSlideIndexs[$scope.tab]=index;
				$scope.$digest();
			}catch (e) {

			}


		}

		$scope.prevSilder = function(swiperIndex,code){
			var question=$scope.quesList[swiperIndex].questions[newSwiper.activeIndex];
			var sectionCode=$scope.quesList[swiperIndex].sectionCode;
			var id=''+swiperIndex+'-'+newSwiper.activeIndex;
			if(question.type!=1&&question.type!=3){
				saveImageData(question,id,question.type);
			}
			$scope.skipSlider('prevSlider',swiperIndex,question,code);
		}

		$scope.sliderIndex = 0;

		/**
		 * 设置
		 */
		$scope.setSilder = function(swiperIndex,sliderIndex,question,code){
			var question=$scope.quesList[swiperIndex].questions[newSwiper.activeIndex];
			var sectionCode=$scope.quesList[swiperIndex].sectionCode;
			var id=''+swiperIndex+'-'+newSwiper.activeIndex;
			if(question.type!=1&&question.type!=3){
				saveImageData(question,id,question.type);
			}
			$scope.skipSlider('setSlider',swiperIndex,question,code,sliderIndex);
		}
		$scope.skipSlider=function(type,swiperIndex,question,code,sliderIndex){
			if($scope.status=="3"){
				if(!question.report.corrected){
					var data = {
						message:'本题尚未打分，是否跳过?',
						type:'2',
						action:'set-slide'
					};
					$scope.$emit('alert',data);
				}else{
					actionSlider(type);
				}
			}else{
				actionSlider(type);
			}
			$scope.$on('alertEvent',function(event,data){
				if(data.action=='set-slide'){
					actionSlider(type);
				}
			})
			function actionSlider(type){
				switch (type){
					case 'setSlider':
						setSlider();
						break;
					case 'prevSlider':
						prevSlider();
						break;
					case 'nextSlider':
						nextSlider();
						break;
				}
			}
			function  nextSlider(){
				if(newSwiper){
					newSwiper.swipeNext();
					$scope.activeDoodleId=''+swiperIndex+'-'+newSwiper.activeIndex;
				}
			}
			function prevSlider(){
				if(newSwiper){
					newSwiper.swipePrev();
					$scope.activeDoodleId=''+swiperIndex+'-'+newSwiper.activeIndex;
				}

			}
			function setSlider(){
				if(newSwiper){
					$scope.swiperIndex=swiperIndex;
					$scope.quesIndex=sliderIndex;
					$scope.sliderIndex = sliderIndex;
					newSwiper.swipeTo(sliderIndex,200);
					$scope.activeDoodleId=''+swiperIndex+'-'+sliderIndex;
					if(question.type!=1&&question.type!=3){
						$scope.showDoIcon(question,code);
					}
				}
			}
		}
		$scope.$watch('activeDoodleId+"@"+renderFlag',function(newValue,oldValue){
			if(newValue!=oldValue){
                var idFlagArr=newValue.split('@');
                var activeDoodleId=idFlagArr[0];
                var renderFlag=idFlagArr[1];
                if(renderFlag=='true'){
                    var arr=activeDoodleId.split('-');
                    var question=$scope.quesList[arr[0]].questions[arr[1]];
                    if($scope.status=="3"){
                        $scope.isEditable=false;
                        question.editable=false;
                        if(arr[0]!=0){

                        	var doodle = $scope.doodles[activeDoodleId];
                        	if(doodle){
                        		doodle.setEditMode(question.editable);
                        		doodle.addListener(function(flag){
                                     $scope.canUndo[activeDoodleId] = !flag;
                                     try{
                                         $scope.$digest();
                                     }catch(e){

                                     }
                                 },function(flag){
                                     $scope.canRedo[activeDoodleId] = !flag;
                                 });
                        	}


                        }
                    }
                }
			}
		});
		$scope.showDoIcon=function(question,code){
			if($scope.status=="3"){
				$scope.isEditable=false;
				question.editable=false;
				if(code!=1){
					$scope.doodles[$scope.activeDoodleId].setEditMode(question.editable);
				}
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
		/**
		 * 保存所有doodle
		 */
		$scope.initDoodle = function(data,id){
			$scope.doodles[id]=data;
			$scope.canUndo[id]=false;
			$scope.canRedo[id]=false;
            $scope.renderFlag=data.renderFlag;
		}

		function undoCallback(id){
			$scope.doodles[id].undoCallback()
		}
		$scope.undo = function(swiperIndex,quesIndex){
			$scope.doodles[''+swiperIndex+'-'+quesIndex].undo();
			$scope.doodles[''+swiperIndex+'-'+quesIndex].addListener(function(flag){
				$scope.canUndo[''+swiperIndex+'-'+quesIndex] = !flag;
				try{
					$scope.$digest();
				}catch(e){

				}

			},function(flag){
				$scope.canRedo[''+swiperIndex+'-'+quesIndex] = !flag;
			});

		}
		$scope.redo = function(swiperIndex,quesIndex){
			var info =$scope.doodles[''+swiperIndex+'-'+quesIndex].redo();
			$scope.doodles[''+swiperIndex+'-'+quesIndex].addListener(function(flag){
				$scope.canUndo[''+swiperIndex+'-'+quesIndex] = !flag;
				try{
					$scope.$digest();
				}catch(e){

				}
			},function(flag){
				$scope.canRedo[''+swiperIndex+'-'+quesIndex] = !flag;
			});

		}
		/**
		 * 完成批改
		 */
		$scope.completeCorrect = function(){
			var scoreJson = {};
			scoreJson.count = 0;
			scoreJson.corrects=[];
			var flag=true;
			var skipTabNum,skipIndex;
			for(var i=0;i<$scope.quesList.length;i++){
				for(var j=0;j<$scope.quesList[i].questions.length;j++){
					if(!$scope.quesList[i].questions[j].report.corrected){
						flag=false;
						skipTabNum=i;
						skipIndex=j;
						break;
					}
				}
				if(!flag){
					break;
				}
			}
			if(!flag){
				var data = {
					message:'有题目尚未打分',
					action:'skipQue'
				};
				$scope.$emit('alert',data);
			}else{
				ExamService.correctQuestion($scope.params.exerId,$scope.params.assignId,JSON.stringify(scoreJson),'commit').then(function(){
					var data = {
						message:'批改完成',
						action:'complete-correct'
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
				if(data.action=='complete-correct'){
					window.location.href='/exam/report/user?exerId='+$scope.params.exerId+'&assignId='+$scope.params.assignId;
				}else if(data.action=='skipQue'){
					skipTab(skipTabNum);
					newSwiper.swipeTo(skipIndex,200);
				}
			});
		}

		/**
		 * 开关是否可编辑
		 */
		$scope.toggleEditable = function(swiperIndex,quesIndex,question){
			question.editable = !question.editable;
			$scope.isEditable = !$scope.isEditable;
			$scope.swiperIndex=swiperIndex;
			$scope.quesIndex=quesIndex;
			$scope.doodles[''+swiperIndex+'-'+quesIndex].setEditMode(question.editable);
		}


		/**
		 * 评分
		 */
		function scoreAnswer(question,swiperIndex,quesIndex,score){
			if(score > question.report.points){
				var data = {
					message:'该题最多能给'+question.report.points+'分',
				};
				$scope.$emit('alert',data);
				return;
			}

			var scoreJson = {};

			scoreJson.corrects = [];
			var scoreItem = {};
			scoreItem.eqid = question.report.id;
			scoreItem.qid = question.report.questionId;
			scoreItem.score = score;
			scoreItem.comment = '';
			scoreJson.corrects.push(scoreItem);
			scoreJson.count = 1;
			question.report.score=score;
			question.report.corrected=true;
			ExamService.correctQuestion($scope.params.exerId,$scope.params.assignId,JSON.stringify(scoreJson)).then(function(){
				if(score==0 || score==question.report.points){
					$location.hash(question.id);
					$anchorScroll();
				}
				//$scope.nextSilder();
			},function(msg){
				question.report.score=0;
				question.report.corrected=false;
				var data = {
					message:msg,
				};
				$scope.$emit('alert',data);
			});

		}



		$scope.toggleShowAnswer = function(question){
			question.showAnswer = !question.showAnswer;

			if(newSwiper){
				newSwiper.invalidate();
			}

		}




	}]);
