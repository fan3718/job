/**
 * 布置套卷
 */
import app from 'app';
import 'services/ExamService';
import 'services/Toolkit';
import 'services/MaterialService';
import 'services/DownloadExclService';
import 'services/ResourceService';
import 'directives/ng-calendar';

export default app.controller('ExamAssignController',['$scope','$filter','$window','ExamService','Toolkit','MaterialService','DownloadExclService','ResourceService',function($scope,$filter,$window,ExamService,Toolkit,MaterialService,DownloadExclService,ResourceService){


	$scope.assignQuestions = [];

	$scope.params = Toolkit.serializeParams();
	$scope.showFavorite = false;
	//显示答案
	$scope.showAnswer = false;

	//获取班级
	var classes = ($scope.params.classIds.split(','))|| [];



	if(angular.isDefined($scope.params.paperId) && $scope.params.paperId != ''){
		ExamService.getDetailById($scope.params.paperId,$scope.params.subjectCode,1).then(function(info){
			$scope.paper = info;

			$scope.form.name=info.title;
			$scope.isSelectedAll = true;
			$scope.selectAll();


		},function(msg){

		});
	}
	$scope.times = [];
	for(var i=15;i<=150;i=i+15){
		var item = {};
		item.key = i;
		item.value=i;
		$scope.times.push(item);
	}
	$scope.types={};
	$scope.cart = {

	};
	$scope.paper = {};
	var now = new Date();
	var times = $filter('date')(now,'yyyy/MM/dd HH:mm').split(' ');
	var endTimes = $filter('date')(new Date(now.getFullYear(),now.getMonth(),now.getDate()+3),'yyyy/MM/dd 08:00').split(' ');

	$scope.form = {
		startDate:times[0],
		startTime:times[1],
		endDate:endTimes[0],
		endTime:endTimes[1],
		seconds:60,
		classes:classes,
		grade:$scope.params.gradeNo
	};

	$scope.getFormData = function(){
		return $scope.form;
	}

	$scope.showAnalysis = function(question){
		question.showAnalysis = !question.showAnalysis;
	}
	$scope.isDefined = function(obj){
		return angular.isDefined(obj) && obj !=null && obj!='';
	}
	$scope.getAnswer = function(index){
		return $filter('charCode')(index);
	}

	$scope.showAnswer = false;
	$scope.flag = 0;
	$scope.toggleShowAnswer = function(){//这里的ng-click执行了两次，只能做四种状态，定义两种过渡状态
		if((!!window.ActiveXObject)&&(!!document.documentMode)){
			if($scope.flag==0){
				$scope.flag++;
			}else if($scope.flag==1){
				$scope.flag+=2;
				$scope.showAnswer = !$scope.showAnswer;
			}else if($scope.flag==3){
				$scope.flag--;
			}else if($scope.flag==2){
				$scope.showAnswer = !$scope.showAnswer;
				$scope.flag-=2;
			}
		}else{
			$scope.showAnswer = !$scope.showAnswer;
		}
	}


	$scope.updateSecond = function(step){
		var seconds = parseInt($scope.form.seconds);

		var index = 0;
		for(var i = 0;i < $scope.times.length;i++){
			if(seconds == $scope.times[i].value){
				index = i;
				break;
			}
		}

		if(step<0){
			if(index>0){
				index+=step;
			}
		}else{
			if(index <$scope.times.length-1){
				index+=step;
			}
		}
		$scope.form.seconds = $scope.times[index].value;

	}

	$scope.showFavor = function(isShow){
		$scope.showFavorite = isShow;
	}


	//$scope.isSelectedAll = false;
	$scope.toggleSelectedAll = function(){
		$scope.isSelectedAll = !$scope.isSelectedAll;
		$scope.selectAll();
	}

	$scope.selectAll = function(){
		angular.forEach($scope.paper.groupTypes,function(info){
			info.selected =  $scope.isSelectedAll;
			info.scoreInfos.splice(0,info.scoreInfos.length);
			if(info.selected){
				info.selectedCount = info.count;
				var index = info.index;
				if(index<2){
					var scoreInfo = {};
					scoreInfo.index = -1;
					scoreInfo.score = $scope.paper.scores[index][0];
					info.scoreInfos.push(scoreInfo);
				}else{
					for(var i=0;i<info.count;i++){
						var scoreInfo = {};
						scoreInfo.index = i;
						scoreInfo.score = $scope.paper.scores[index][i];
						info.scoreInfos.push(scoreInfo);
					}
				}
			}else{
				info.selectedCount = 0;
			}

			angular.forEach($scope.paper.questionTable[info.title],function(	question){
				question.selected = $scope.isSelectedAll;
			});
		});

		initCart();
	}

	$scope.toggleChangedSelectedAllType = function(index,info){
		//$scope.groupType.selected = !$scope.groupType.selected;
		$scope.paper.groupTypes[index].selected = !$scope.paper.groupTypes[index].selected
		$scope.changedSelectAllType(index,info);

	}

	$scope.setStartTime = function(time){
		var times = $filter('date')(time,'yyyy/MM/dd HH:mm').split(' ');
		$scope.form.startDate=times[0];
		$scope.form.startTime=times[1];
	}


	$scope.changedSelectAllType = function(index,info){
		if(!info.selected){
			$scope.isSelectedAll = false;
			info.selectedCount = 0;
			info.scoreInfos.splice(0,info.scoreInfos.length);
		}else{
			info.selectedCount = info.count;

			if(index<2){
				var item = {};
				item.score=$scope.paper.scores[index][0];
				//info.scoreInfos.splice(index,0,item);
				info.scoreInfos = [item];
			}else{
				for(var i=0;i<info.selectedCount;i++){
					var item = {};
					item.score=$scope.paper.scores[index][i];
					info.scoreInfos.push(item);
				}
			}

			//info.scoreInfos.splice(index,info.scoreInfos.length);
		}
		angular.forEach($scope.paper.questionTable[info.title],function(	question){
			question.selected = info.selected;
		});
		checkSelectedAll();
		initCart();
	}
	$scope.changeSelectQuestion = function(quest,outerIndex,index){
		var groupInfo = $scope.paper.groupTypes[outerIndex];
		if(!quest.selected){
			$scope.isSelectedAll = false;
			groupInfo.selectedCount --;

			if(outerIndex >=2){
				groupInfo.scoreInfos.splice(index,1);
			}else{

			}

		}else{
			groupInfo.selectedCount ++;
			var scoreInfo = {};
			scoreInfo.index=index;
			scoreInfo.score=$scope.paper.scores[outerIndex][index];
			if(outerIndex >=2){
				groupInfo.scoreInfos.splice(index,0,scoreInfo);
			}else{
				groupInfo.scoreInfos = [scoreInfo];
			}
		}
		groupInfo.selected = groupInfo.selectedCount  == groupInfo.count;
		checkSelectedAll();
		initCart();
	}


	$scope.changeScore = function(step,scoreInfo,groupInfo){
		var score = parseInt(scoreInfo.score);
		if(step<0){
			if(score>0){
				scoreInfo.score=score+step;
			}
		}else{
			scoreInfo.score =score+step;
		}
		$scope.calcScore(scoreInfo,groupInfo);
	}

	$scope.calcScore = function(scoreInfo,groupInfo){
		scoreInfo.score = parseInt(scoreInfo.score);
		var groupIndex = groupInfo.index;
		if(scoreInfo.index==-1){
			var len = $scope.paper.scores[groupIndex].length;
			$scope.paper.scores[groupIndex].splice(0,len);
			for(var i=0;i<len;i++){
				$scope.paper.scores[groupIndex].push(scoreInfo.score);
			}
		}else{
			$scope.paper.scores[groupIndex][scoreInfo.index]=scoreInfo.score;
		}
		initCart();
	}


	function checkSelectedAll(){
		var groupInfo = null;
		var isSelectedAll = true;
		for(var i=0;i<$scope.paper.groupTypes.length;i++){
			groupInfo = $scope.paper.groupTypes[i];
			if(!groupInfo.selected){
				isSelectedAll = false;
			}
		}
		$scope.isSelectedAll = isSelectedAll;
		initCart();
	}

	function initCart(){
		var count = 0;
		var totalScore = 0;
		var groupInfo = null;
		for(var i=0;i<$scope.paper.groupTypes.length;i++){
			groupInfo = $scope.paper.groupTypes[i];
			count +=  groupInfo.selectedCount;
			var scoreInfos = groupInfo.scoreInfos;
			for(var k=0;k<scoreInfos.length;k++){
				if(i<2){
					totalScore += groupInfo.selectedCount*scoreInfos[k].score;
				}else{
					totalScore += scoreInfos[k].score;
				}
			}
		}
		$scope.cart.count = count;
		$scope.cart.score = totalScore;
	}


	var downFlag=true;
    $scope.downLoad=function () {
    	if(downFlag){
    		downFlag=false;
    		var downLoadData={};
            var downloadFlag = false;
            downLoadData['subject']=$scope.params.subjectCode;
            downLoadData['filetype']=1;
            downLoadData['source']=1;
            downLoadData['paper']={};
            downLoadData['paper']['title']=$scope.paper.title;
            downLoadData['paper']['group']=[];
            angular.forEach($scope.paper.groupTitleList,function (group,index) {
                var tableData={
                    'title':group,
                    'qids':[]
                }
                tableData['content']=false;
                angular.forEach($scope.paper.questionTable[group],function (question,num) {
                    if(question.selected){
                        tableData.qids.push(question.id);
                        tableData.content=true;
                    }
                })
                if(tableData.content){
                    downLoadData['paper']['group'].push(tableData);
                    downloadFlag = true;
                }
            });
            if(downloadFlag){
                DownloadExclService.downloadExcl(downLoadData,$scope.userInfo.uid).then(function (result) {
                	if(result == 429){
						var data = {
		                        message:'您已达到今天最大下载数，请明天再试'
		                    };
		                    $scope.$emit('alert',data);
		                    downFlag=true;
					}else{
						if(result.code==1){
							result.downloadType = 1;//下载类型0自组1套卷
                            DownloadExclService.getFilePath(result).then(function (res) {
                                if(res['filePath']){
                                    downFlag=true;
                                    ResourceService.downloadRecods(result.downloadType,$scope.paper.title,res['filePath'],'success');
                                    window.location.href=res['filePath'];
                                }else{
                                	var data = {
			                            message:'后台处理超时,请稍候重新下载'
			                        };
			                        $scope.$emit('alert',data);
			                        downFlag=true;
                                }
                            })
	                    }else{
	                        var data = {
	                            message:'下载失败,请重新下载'
	                        };
	                        $scope.$emit('alert',data);
	                        downFlag=true;
	                    }
					}
                })
            }else{
                var data = {
                    message:'没有题目可供下载'
                };
                $scope.$emit('alert',data);
                downFlag=true;
            }
    	}else{
            var data = {
                message:'下载正在进行中，请稍候'
            };
            $scope.$emit('alert',data);
        }
    }

    //确认框
	$scope.confirm = function(){
		$scope.assignQuestions = getPubQuestions() ||[];
		if($scope.assignQuestions.length <=0){
			var data = {
				message:'请先选择要发布的题目!',
			};
			$scope.$emit('alert',data);
			return;
		}
		var form = $scope.getFormData();
		var startTime = new Date(form.startDate +" "+ form.startTime);
		var now = new Date();
		if(now.getTime()>=startTime.getTime()){
			$scope.setStartTime(now);
		}
		$scope.showDialog = true;
	}
	$scope.closeDialogBox = function(){
		$scope.showDialog = false;
	}


	$scope.toggleFavor = function(){

		if(!$scope.paper.isFavor){
			ExamService.addFavorPaper($scope.params.paperId,$scope.params.subjectCode).then(function(){
				$scope.paper.isFavor = true;
			},function(msg){

			});
		}else{
			ExamService.removeFavorPaper($scope.params.paperId,$scope.params.subjectCode).then(function(){
				$scope.paper.isFavor = false;
			},function(msg){
				var data = {
					message:msg,
				};
				$scope.$emit('alert',data);
			});
		}


	}

	//获取发布的题目
	function getPubQuestions(){
		var questions = [];
		var quesItem = null;
		var innerIndex = 0;
		for(var outerIndex=0;outerIndex<$scope.paper.groupTypes.length;outerIndex++){
			var groupType = $scope.paper.groupTypes[outerIndex];
			var questes = $scope.paper.questionTable[groupType.title];
			for(var innerIndex = 0;innerIndex<questes.length;innerIndex++){
				var quest = questes[innerIndex];
				if(quest.selected){
					quesItem = {};
					quesItem.id = quest.id ||'';
					quesItem.type = quest.type || 1;
					quesItem.score = $scope.paper.scores[outerIndex][innerIndex];
					questions.push(quesItem);
				}
			}
		}
		return questions;
	}

	//发布套卷
	$scope.assign = function(){
		var params = {};
		params.subjectCode = $scope.params.subjectCode;
		var data = {};
		var questions = $scope.assignQuestions || [];
		if(questions.length <=0){
			var data = {
				message:'请选择要发布的题目!',
			};
			$scope.$emit('alert',data);
			return;
		}
		data.questions = questions;
		var exam ={};
		exam.id = $scope.params.paperId;
		//转换成秒
		exam.seconds = $scope.form.seconds*60;
		data.exam = exam;
		params.data = data;
		params.startTime = new Date($scope.form.startDate+" "+$scope.form.startTime).getTime();
		params.dueTime = new Date($scope.form.endDate+" "+$scope.form.endTime).getTime();
		//精确到分钟
		params.startTime = Math.floor(params.startTime/1000/60)*60*1000;
		params.endTime = Math.floor(params.dueTime/1000/60)*60*1000;

		params.name=$scope.form.name||"";
		params.classes=$scope.params.classIds.split(',');
		if($scope.form.name.length>40){
			return ;
		}
		ExamService.assign(params).then(function(result){
			if(result&&result.code==1){
				var data = {
						message:"作业布置成功"
				};
				$scope.$emit('alert',data);
				$scope.$on('alertEvent',function(event,data){
					$scope.showDialog = false;
					$window.location.href="/exam";
				})
			}
		},function(msg){
			alert(msg);
		});
	}




}]);
