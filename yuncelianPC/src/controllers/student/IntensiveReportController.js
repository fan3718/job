import app from 'app';

import 'services/Toolkit';
import 'services/UserService';
import 'services/ExerciseNoteService';


export default app.controller('IntensiveReportController',['$scope','$filter','$location','Toolkit','UserService','ExerciseNoteService',function($scope,$filter,$location,Toolkit,UserService,ExerciseNoteService){
        $scope.statusText="";
        /*UserService.getUserInfo().then(function(info){
            $scope.userId = info.uid;
            console.log($scope.userId);
        });*/
        
        function consolidateName(){
            var total = parseInt(practiceTimes);
            var exerciseNameList = new Array();
            for(var i = 1 ; i <= total; i ++){
                exerciseNameList.push({
                    num : i,
                    name:"强化训练"+Toolkit.getOrderNumber(i)
                })
            }
            $scope.exerciseNameList = exerciseNameList;
        }

        $scope.params = Toolkit.serializeParams();
        if($scope.params.exerciseType == "100"){
            $scope.pageName = "专项巩固";
            var name = decodeURI($scope.params.exerciseName);
            if(name.length > 47){
                $scope.exerciseName = name.substring(0,47)+"...";
            }else{
                $scope.exerciseName = name;
            }
            specialInit();
        }else{
            $scope.pageName = "强化训练-练习报告"
             consolidateInit();
             consolidateName();
        }
        function specialInit(){
            $scope.notExercise = true;
            if($scope.params["exerciseID"]){
                $scope.notExercise = false;
            }
            $scope.filter = {
                content:"all",
                reportDesc:'全部练习'
            }
            if($scope.params.content == "all"){
                ExerciseNoteService.getAllReport($scope.params.qid,$scope.params.exerciseType,$scope.params.subjectCode).then(function(result){
                    if(angular.isObject(result)){
                        reportData(result);
                    }
                });
            }else{
                $scope.filter.reportDesc = '本次练习';
                $scope.filter.content = '0';
                ExerciseNoteService.getExerciseReport(exerciseID).then(function(result){
                    if(angular.isObject(result)){
                        reportData(result);
                    }
                });
            }
        }
        function consolidateInit(){
            $scope.filter = {
                content:"1",
                reportDesc:'强化训练 一'
            }
            if($scope.params.content != "1"){
                $scope.filter.reportDesc = '强化训练'+Toolkit.getOrderNumber(parseInt($scope.params.content));
                $scope.filter.content = $scope.params.content;
            }
            ExerciseNoteService.getConsolidateReport($scope.params.exerciseType,$scope.params.subjectCode,$scope.params.content).then(function(result){
                if(angular.isObject(result)){
                    reportData(result);
                }
            });
        }
        $scope.slideIndexTag=0;
        $scope.init=function(result){
            $scope.assignment=result.exercise;
            $scope.assignment.rightCount=result.exercise.totalCount-result.exercise.wrongCount;
            // if(result.assignment.status==5){
                $scope.commitFlag=true;
                $scope.commitTime=result.exercise.createTime.time;
                if(result.exercise.totalCount != 0 && $scope.assignment.rightCount != 0){
                    $scope.rightPercent=Math.round($scope.assignment.rightCount*100/result.exercise.totalCount)+'%';
                }else if(result.exercise.totalCount == $scope.assignment.rightCount){
                    $scope.rightPercent = '100%';
                }else if($scope.assignment.rightCount == 0){
                    $scope.rightPercent = '0%';
                }
                if(result.exercise.totalCount != result.questions.length){
                    $scope.rightName = '客观题答对题数';
                }else{
                    $scope.rightName = '答对题数';
                }
            // }else if(result.assignment.status==4){
            //     $scope.statusText="未完成";
            //     $scope.commitFlag=false;
            // }
        }
        $scope.initJudge=function(arr,vrr){
            var flag=false;
            var num=0;
            if(vrr&&vrr.length>0){
                for(var i=0;i<arr.length;i++){
                    for(var j=0;j<vrr.length;j++){
                        if(vrr[j]==arr[i]){
                            num++;
                        }
                    }
                }
            }
            if(num==arr.length){
                flag=true;
            }
            return flag;
        }
        var newSwiper;
        $scope.initSwiper = function(swiper,id){
            newSwiper=swiper;
            $scope.activeIndex=newSwiper.activeIndex;
            newSwiper.invalidate();
        }
        $scope.setSlider = function(sliderIndex,que){
            if(newSwiper){
                $scope.activeIndex=sliderIndex;
                newSwiper.swipeTo(sliderIndex,200);
            }
        }
        $scope.slideRightFlag=true;
        $scope.$watch('queIndex',function(){
            if(typeof $scope.queIndex=='number'){
                $scope.queIndex=$scope.queIndex;
                if($scope.slideIndexTag+1==$scope.queIndex){
                    $scope.slideRightFlag=false;
                }
            }
        })
        $scope.$watch('filter.content',function(newValue,oldValue){
            if(newValue!=oldValue){
                newSwiper.swipeTo(0);
                $scope.filter.content = newValue;
                if(newValue == "all"){
                    $scope.filter.reportDesc = '全部练习';
                    ExerciseNoteService.getAllReport($scope.params.qid,$scope.params.exerciseType,$scope.params.subjectCode).then(function(result){
                        if(angular.isObject(result)){
                            reportData(result);
                        }
                    });
                }else if(newValue == "0"){
                    $scope.filter.reportDesc = '本次练习';
                    ExerciseNoteService.getExerciseReport(exerciseID).then(function(result){
                    if(angular.isObject(result)){
                            reportData(result);
                        }
                    });
                }else{
                    $scope.filter.reportDesc = '强化训练'+Toolkit.getOrderNumber(parseInt(newValue));
                    ExerciseNoteService.getConsolidateReport($scope.params.exerciseType,$scope.params.subjectCode,newValue).then(function(result){
                        if(angular.isObject(result)){
                            reportData(result);
                        }
                    });
                }
            }
        });
        function reportData(result){
            $scope.result=result;
            if(result.questions){
                $scope.queData=result.questions;
            }
            $scope.quesLength=$scope.queData.length;
            $scope.quesLength=$scope.queData.length;
            $scope.queIndex=Math.ceil($scope.quesLength/11);
            angular.forEach($scope.queData,function(que,index){
                $scope.answerArr=que.answer.split(',');
                if( que.studentAnswer!=""){
                    $scope.studentAnswerArr=que.studentAnswer.split(',');
                }else{
                    $scope.studentAnswerArr=[];
                }
                que.commitFlag = true;
                if(que.type != 1 && que.type != 3){
                    que.commitFlag = false;
                }else{
                    que.answerFlag=$scope.initAnswerFlag($scope.answerArr,que.options.length);
                    que.studentAnswerFlag=$scope.initAnswerFlag($scope.studentAnswerArr,que.options.length);
                    que.judgeFlag=$scope.initJudge($scope.answerArr,$scope.studentAnswerArr);
                }
            })
            $scope.init(result);
            $scope.showStyle={visibility:'visible'};
            $scope.slideStyle={left:'15px',transition:'left 0.5s linear',width:90*($scope.quesLength+10)+'px'};
        }
        $scope.slideLeftFlag=false;
        Toolkit.initQList(0,11);
        $scope.slideRight=function(num){
            var num=num;
            if($scope.slideIndexTag+1==$scope.queIndex){
                return false;
            }else{
                $scope.slideRightFlag=true;
                $scope.slideIndexTag++;
                $scope.slideStyle.left=-$scope.slideIndexTag*860+'px';
            }
            Toolkit.initQList(11*($scope.slideIndexTag),11*($scope.slideIndexTag+1));
        }
        $scope.slideLeft=function(){
            if($scope.slideIndexTag==0){
                $scope.slideLeftFlag=false;
                return false;
            }else{
                $scope.slideLeftFlag=true;
                $scope.slideIndexTag--;
                $scope.slideStyle.left=-$scope.slideIndexTag*860+'px';
            }
            Toolkit.initQList(11*($scope.slideIndexTag),11*($scope.slideIndexTag+1));
        }
        $scope.initAnswerFlag=function(arr,length){
            var answerFlag=[];
            for(var i=0;i<length;i++){
                answerFlag.push(false);
            }
            if(arr.length>0){
                angular.forEach(arr,function(item,index){
                    answerFlag[ $filter('numCode')(item) ]=true;
                })
            }
            return answerFlag;
        }
    }]);