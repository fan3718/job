import app from 'app';
import 'services/EvaluationService';
import 'services/AudioService';
import 'services/Toolkit';
import 'directives/ng-swiper';
export default app.controller('EvaluationKnowledgeController',['$scope','$filter','EvaluationService','AudioService','Toolkit',function($scope,$filter,EvaluationService,AudioService,Toolkit){

		var DEFALULT_LEVEL = 3;

		var MAX_COUNT = 20;



		$scope.params = Toolkit.serializeParams();
		$scope.subjectCode = '20';

		$scope.skipFilter = false;

		$scope.isChangeSwiper = true;

		if(angular.isDefined($scope.params.id)){
			if(angular.isDefined($scope.params.subjectCode)){
				$scope.skipFilter = true;
			}
			EvaluationService.getEvaluationDetail($scope.params.id,true).then(function(report){
				var evaluation = report.evaluation;
				$scope.info.stuName = evaluation.studentName;
				$scope.info.age = evaluation.age;
				$scope.info.gender = evaluation.gender;
				$scope.info.phone = evaluation.phoneNumber;
				$scope.info.school = evaluation.school;
				$scope.info.grade = evaluation.gradeNo;
				$scope.info.gradeName = evaluation.gradeName;

				var gradeInfo = {};

				gradeInfo.code = evaluation.gradeNo;
				gradeInfo.name = evaluation.gradeName;


				$scope.filter.grade = gradeInfo;

				var subjectInfo = {};
				if(angular.isDefined($scope.params.subjectCode)){
					var code = parseInt($scope.params.subjectCode)%10;
					subjectInfo.code =code+'';
					var name= '数学';
					switch(code){
					case 4:
						name='语文';
						break;
					case 6:
						name='英语';
						break;
					}
					subjectInfo.name = name;

					$scope.filter.subject = subjectInfo;
					loadKnowledge();
				}

			});



		}else{

		}
		$scope.questions = [];
		$scope.sections = [];
		var isLoading = false;
		$scope.progress = {
				percent:'0%',
				number:1
		};

		$scope.info = {
				gender:'1'
		}

		$scope.form = {
				level : DEFALULT_LEVEL,
				count:2,
				knowledges:[],
				qids:[],
				knowledgeStr:'',
				qidStr:'',
				rightNum:0,
				wrongNum:0
		};

		$scope.grades = [
		              { code:1, name:'一年级' },
		              { code:2, name:'二年级' },
		              { code:3, name:'三年级' },
		              { code:4, name:'四年级' },
		              { code:5, name:'五年级' },
		              { code:6, name:'六年级' },
		              { code:7, name:'初一' },
		              { code:8, name:'初二' },
		              { code:9, name:'初三' },
		              { code:11, name:'高一' },
		              { code:12, name:'高二' },
		              { code:13, name:'高三' }
		];

		$scope.subjects = [
		                   { code:0,name:'数学' },
		                   { code:4,name:'语文'},
		                   { code:6,name:'英语'}
		];
		$scope.filter = {

		};

		$scope.choseGrade = function(grade){
			$scope.filter.grade = grade;
		}

		$scope.choseSubject = function(subject){
			$scope.filter.subject = subject;
		}


		$scope.loadQuestion = function(){
			loadKnowledge();
		}

		$scope.isDefined = function(obj){
			return angular.isDefined(obj) ;
		}

		var startTime = 0;

		$scope.swiperIndex = 0;

		$scope.difficulties = [1,2,3,4,5];
		$scope.difficulty = DEFALULT_LEVEL;
		/**
		 * 填空题
		 */
		$scope.fillBlank = function(question,value){
			if(startTime == 0){
				startTime = new Date().getTime();
			}
			var answer = Toolkit.trim(value);
			if(answer!=''){
				var isRight = question.answer == answer;
				if(question.done){
					//错误改成正确
					if(isRight&&!question.isOldRight){
						$scope.form.rightNum++;
						$scope.form.wrongNum--;
					}else if(!isRight && question.isOldRight){ //正确改成错误
						$scope.form.rightNum--;
						$scope.form.wrongNum++;
					}
				}else{
					if(isRight){
						$scope.form.rightNum++;
					}else{
						$scope.form.wrongNum++;
					}
				}
				question.done= true;
				question.isOldRight = isRight;
				question.userAnswer = answer;
			}else{
				question.done= false;
				if(question.isOldRight){
					$scope.form.rightNum--;
				}
			}


		}


		$scope.$watchCollection('questions',function(newValue,oldValue){
			$scope.isChangeSwiper = !$scope.isChangeSwiper;
		});
		/**
		 * 选择题
		 */
		$scope.selectOption = function(question,questionIndex,optionIndex){


			if(question.answerIndex != optionIndex){

				var answer =  $filter('charCode')(optionIndex);

				var isRight = answer == question.answer;

				if(question.done){
					//错误改成正确
					if(isRight&&!question.isOldRight){
						$scope.form.rightNum++;
						$scope.form.wrongNum--;
					}else if(!isRight && question.isOldRight){ //正确改成错误
						$scope.form.rightNum--;
						$scope.form.wrongNum++;
					}
				}else{
					if(isRight){
						$scope.form.rightNum++;
					}else{
						$scope.form.wrongNum++;
					}
				}

				question.done = true;
				question.isOldRight = isRight;
				question.answerIndex = optionIndex;
				question.userAnswer = answer;


				if(startTime == 0){
					startTime = new Date().getTime();
				}
				if(questionIndex == MAX_COUNT - 1){
					redirectForm();
				}


			}

		}


		function redirectForm(){
			$scope.submit = true;
			//生成Sections
			var section = {};
			section.type = 200;
			section.count = $scope.questions.length;
			section.subject = $scope.subjectCode;
			section.seconds = parseInt((new Date().getTime() -startTime)/1000);
			var quests = [];
			angular.forEach($scope.questions,function(quest){
				var item = {};
				item.id = quest.id;
				item.level = quest.level;
				item.knowledge = quest.knowledge;
				item.userAnswer = quest.userAnswer;
				item.rightAnswer  = quest.answer;
				quests.push(item);
			});
			section.questions = quests;
			$scope.sections.push(section);
		}


		$scope.onRepeatFinish = function(){
			if($scope.swiper != null){
				//$scope.swiper.slideTo($scope.swiperIndex,0);
			}
		}

		$scope.isNotEmpty = function(obj){
			return angular.isDefined(obj) && obj !='';
		}
		$scope.swiper = null;
		$scope.initSwiper = function(swiper,id,tools){
			$scope.swiper = swiper;
		}

		$scope.onSliderChangeEnd = function(swiper,id,index){

			//判断上个题目是否完成
			var prevIndex = index-1 <0 ? 0 : index-1;
			var quest = $scope.questions[prevIndex];
      if(quest){
        if(quest.done){
          $scope.difficulty = $scope.questions[prevIndex+1].level;
          if(swiper.activeIndex == $scope.questions.length-1){
            fetchMoreQuestions();
          }
        }else{
          swiper.swipePrev();
        }
        //loadKnowledge();
        //$scope.swiperTools.updateSliders();
        $scope.progress.number=$scope.swiper.activeIndex+1;
        $scope.progress.percent = ($scope.progress.number*100/20) +'%';
        try{
          $scope.$digest()
        }catch(e){

        }
      }
		}

		$scope.changeSlider = function(action){
			if($scope.swiper!=null){
				if('prev' == action){
					$scope.swiper.swipePrev();
					$scope.swiperIndex--;
					if($scope.swiperIndex<0){
						$scope.swiperIndex = 0;
					}
				}else if('next' == action){

					var quest = $scope.questions[$scope.swiperIndex];
          if(quest){
            if(!quest.done){
              var data = {
                message:"不能跳过本题"
              };
              $scope.$emit('alert',data);
              return;
            }
            $scope.swiper.swipeNext();
            $scope.swiperIndex++;
            if($scope.swiperIndex>=MAX_COUNT){
              redirectForm();
            }
          }

				}

				//$scope.progress.number=$scope.swiper.activeIndex+1;
				//$scope.progress.percent = ($scope.progress.number*100/20) +'%';
			}
		}


		function fetchMoreQuestions(){

			if($scope.questions.length>=MAX_COUNT){
				return;
			}


			 var knowledgeStr = '';
			 var knowledgeTable = new Object();

			 var knowledges = $scope.form.knowledges;

			 for(var i = 0; i < knowledges.length; i++) {
			        var key = knowledges[i];
			        var count = knowledgeTable[key];
			        if(count == undefined) {
			            count = 0;
			        }
			        count = count + 1;
			        knowledgeTable[key] = count;
			        if(count >= 3) {
			            knowledgeStr += knowledges[i] + ",";
			        }
			    }
			    if(knowledgeStr.length > 0) {
			        knowledgeStr = knowledgeStr.slice(0, -1);
			    }
			    $scope.form.knowledgeStr = knowledgeStr;
			    // avoid duplicate question
			    $scope.form.qidStr =$scope.form.qids.join(',');

			    // dynamic change level and count
			    var count = 2;
			    var rightNum = $scope.form.rightNum;
			    var wrongNum = $scope.form.wrongNum;
			    var level = $scope.form.level;
			    if(rightNum == 1 && wrongNum == 1) {
			        count = 1;
			    } else if(wrongNum == 2 && level > 1) {
			        level -= 1;
			    } else if(rightNum == 2 && level < 5) {
			        level += 1;
			    }

			    $scope.form.level = level;

			    $scope.form.count = Math.min(count,MAX_COUNT-$scope.questions.length);

			    loadKnowledge();
		}


		function loadKnowledge(){
			if(isLoading){
				return;
			}
			if($scope.isDefined($scope.filter.grade)&&$scope.isDefined($scope.filter.subject)){
				isLoading = true;
				var stage = '1';
				if($scope.filter.grade.code<=6){
					stage = '1';
				}else if($scope.filter.grade.code<=9){
					stage = '2';
				}else{
					stage = '3';
				}
				$scope.subjectCode = stage+$scope.filter.subject.code;
				EvaluationService.findSubjectQuestion($scope.subjectCode,$scope.form.level,$scope.filter.grade.code,$scope.form.count,$scope.form.knowledgeStr,$scope.form.qidStr).then(function(questions){
          angular.forEach(questions,function(quest){
            $scope.form.knowledges.push(quest.knowledge);
            $scope.form.qids.push(quest.id);
            $scope.questions.push(quest);

          });
					 if($scope.form.rightNum == 1 && $scope.form.wrongNum == 1) {
			                // fetch only one more question, keep the old right/wrong number
			                // intended do nothing
			            } else {
			            	$scope.form.rightNum = 0;
			            	$scope.form.wrongNum = 0;
			            }
					 isLoading=false;
				},function(msg){
					isLoading = false;
					console.log(msg);
				});
			}else{
				var data = {
						message:'请选择年级和学科！'
				};
				$scope.$emit('alert',data);
			}
		}




		$scope.save = function(){

			if(angular.isDefined($scope.params.id)){
				EvaluationService.saveSections($scope.params.id,$scope.sections).then(function(){
					window.location.href="/evaluation/report/knowledge?id="+$scope.params.id+"&subjectCode="+$scope.subjectCode;;
				},function(msg){
					var data = {
							message:msg
					};
					$scope.$emit('alert',data);
				});
			}else{
				var params = angular.copy($scope.info);
				params.grade = $scope.filter.grade.code;
				params.gradeName = $scope.filter.grade.name;
				EvaluationService.save(params,$scope.sections).then(function(evaluation){
					console.log(evaluation);
					window.location.href="/evaluation/report/knowledge?id="+evaluation.id+"&subjectCode="+$scope.subjectCode;
				},function(msg){
					var data = {
							message:msg
					};
					$scope.$emit('alert',data);
				});
			}


		}
		// 英语音频播放
		$scope.playProgress = '00:00';
		$scope.play = function(src){
			AudioService.play(src).then(function(){},function(){},function(notify){
				 if(notify.type =='timeupdate'){
				 	$scope.playProgress = notify.position;
				 }
			});
		}


	}]);
