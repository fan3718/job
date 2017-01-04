import app from 'app';

import 'services/UserService';
import 'services/ExerciseService';
import 'services/Toolkit';

import 'directives/ng-swiper';

export default app.controller('ReportController',['$scope','$filter','$location','UserService','ExerciseService','Toolkit',function($scope,$filter,$location,UserService,ExerciseService,Toolkit){
        $scope.statusText="";
        $scope.hasData = false;
        $scope.notSupported = false;
        /*UserService.getUserInfo().then(function(info){
            $scope.userId = info.uid;
            console.log($scope.userId);
        });*/
        $scope.id=assignID;
        $scope.slideIndexTag=0;
        ExerciseService.getPaperReport($scope.id).then(function(result){
            if(angular.isObject(result)){
                $scope.result=result;

                if(result['1']){
                    $scope.queData=result['1'];
                }
                var queData = new Array();
                var queType = ["1","11","12","13"];
                angular.forEach(queType,function(type,i){
                  if(result[type]&&result[type].length>0){
                    angular.forEach(result[type],function(item,index){
                      item.type = type;
                      queData.push(item);
                    });
                  }
                });
                $scope.queData = queData;
                $scope.quesLength=$scope.queData.length;
                $scope.queIndex=Math.ceil($scope.quesLength/11);
                angular.forEach($scope.queData,function(que,index){
                  if((que.type==1||que.type==3)&&que.answer&&que.answer!=""){
                    $scope.answerArr=que.answer.split(',');
                    if( que.studentAnswer!=""){
                        $scope.studentAnswerArr=que.studentAnswer.split(',');
                    }else{
                        $scope.studentAnswerArr=[];
                    }
                    que.answerFlag=$scope.initAnswerFlag($scope.answerArr,que.options.length);
                    que.studentAnswerFlag=$scope.initAnswerFlag($scope.studentAnswerArr,que.options.length);
                    que.judgeFlag=$scope.initJudge($scope.answerArr,$scope.studentAnswerArr);
                  }else if(que.type==11||que.type==12||que.type==13){
                    if( que.studentAnswer!=""){
                        que.studentAnswerArr=que.studentAnswer.split(';');
                        if(que.correct!=""){
                          que.correct=que.correct.split(';');
                        }
                    }else{
                        que.studentAnswerArr=[];
                    }
                  }
                })
                $scope.init(result);
                $scope.showStyle={visibility:'visible'};
                $scope.slideStyle={left:'15px',transition:'left 0.5s linear',width:90*($scope.quesLength+10)+'px'};
                $scope.hasData = true;
            }
        },function(msg){
            if(msg.indexOf('不支持')!=-1){
                $scope.statusText = msg;
                $scope.notSupported = true;
            }
        });
        $scope.init=function(result){
            $scope.assignment=result.assignment;
            if(result.assignment.status==5){
                $scope.commitFlag=true;
                $scope.commitTime=result.assignment.lastUpdateTime.time;
                $scope.rightPercent=Math.round(result.rightCount*100/result.count)+'%';
            }else if(result.assignment.status==4){
                $scope.statusText="未完成";
                $scope.commitFlag=false;
            }
        }
        $scope.isDefined = function(obj){
          return angular.isDefined(obj) && obj !=null && obj!='';
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
