import app from 'app';
import 'services/Toolkit';
import 'services/UserService';
import 'services/ExerciseNoteService';
import 'services/HttpClient';


export default app.controller('ExerciseConsolidateController',['$scope','$filter','$location','Toolkit','UserService','ExerciseNoteService','HttpClient',function($scope,$filter,$location,Toolkit,UserService,ExerciseNoteService,HttpClient){

        // $scope.assignID = assignID;
        $scope.countTime=0;
        $scope.konwName = [];
        $scope.konwledgeIdList = [];
        $scope.qidList = [];
        $scope.visibleStyle={visibility:'hidden'};
        $scope.params = Toolkit.serializeParams();
        if($scope.params.exerciseType == 100){
            $scope.pageName = "专项巩固 ———";
            $scope.exersesName = decodeURI($scope.params.exerciseName);
            if($scope.exersesName.length>42){
                $scope.exersesTitle1 = $scope.exersesName.substring(0,41)+"..."
            }else{
                $scope.exersesTitle1 = $scope.exersesName;
            }
            if($scope.exersesName.length>28){
                $scope.exersesTitle2 = $scope.exersesName.substring(0,28)+"..."
            }else{
                $scope.exersesTitle2 = $scope.exersesName;
            }
        }else{
            $scope.lookReport = "看报告>>"
        }
        showLoading(true);
        function showLoading(isShow){
            $scope.$emit('loading',isShow?'show':'hidden');
        }
        ExerciseNoteService.loadQuestions(knowledgeId,subjectCode,exerciseType,$scope.params.qid).then(function(assignments){
            if(assignments['code']){
                $scope.popMessage={
                    message:assignments
                }
            }
            showLoading(false);
            $scope.visibleStyle={visibility:'visible'};
            $scope.questions=assignments.quests;
            if(angular.isObject(assignments)&&assignments.length!=0){
                $scope.assignments=assignments;
                // $scope.aid=assignments.aid;
                // $scope.duration=assignments.duration;
                if($scope.params.exerciseType == 100){
                    $scope.lookReport = "已完成"+(assignments.completedNum || "0")+"题;看报告>>";
                }else{
                    $scope.exersesName = "强化训练"+Toolkit.getOrderNumber(assignments.practiceTimes);
                    $scope.exersesTitle1 = $scope.exersesName;
                    $scope.exersesTitle2 = $scope.exersesName;
                    $scope.lookReport = "看报告>>"
                }
                angular.forEach($scope.questions,function(value){
                    $scope.qidList.push(value.id);
                    var arr = value.knowledgeID.split(",");
                    for(var i=0; i<arr.length;i ++){
                        $scope.konwledgeIdList.push(arr[i]);
                    }
                    if(value.type=='3'){
                        value.answerArr=[];
                        value.multipleAnswer=true;
                    }else if(value.type==1){
                        value.multipleAnswer=false;
                    }
                    value['checkFlag']=[];
                    value['answerFlag']=false;
                    angular.forEach(value['options'],function(){
                        value.checkFlag.push(false);
                    });
                    value.answer = '';
                    // if(value['answer']&&value.answer!=""){
                    //     var answerCode=$filter('numCode')(value.answer);
                    //     value.checkFlag[answerCode]=true;
                    //     value['answerFlag']=true;
                    // }
                })
            }
        },function(msg){
            showLoading(false);
            $scope.visibleStyle={visibility:'visible'};
            console.log(msg);
        });
        UserService.getUserInfo().then(function(info){
            $scope.userId = info.uid;
        });
        $scope.scrollAct=function(index){
            var obj=angular.element($("ul.ques-list li.single-que")).eq(index);
            angular.element('body,html').animate({scrollTop:parseInt(obj.attr('ngScrolltop'))},500);
        };
        $scope.checkAnswerMul=function(arr,index){
            var flag=true;
            angular.forEach(arr,function(answer,num){
                if(answer==$filter('charCode')(index)){
                    arr.splice(num,1);
                    arr.sort();
                    flag=false;
                }
            })
            return flag;
        }
        $scope.optionCheck=function(index,que){
            if(que.multipleAnswer){
                if(que.answerArr.length>0){
                    var flag=$scope.checkAnswerMul(que.answerArr,index);
                    if(flag){
                        que.checkFlag[index]=true;
                        que.answerFlag=true;
                        que.answerArr.push($filter('charCode')(index));
                        que.answerArr.sort();
                        que.answer=que.answerArr.join(',');
                    }else{
                        que.checkFlag[index]=false;
                        if(que.answerArr.length==0){
                            que.answerFlag=false;
                            que.answer='';
                        }else{
                            que.answerFlag=true;
                            que.answer=que.answerArr.join(',');
                        }
                    }
                }else{
                    que.answerFlag=true;
                    que.checkFlag[index]=true;
                    que.answerArr.push($filter('charCode')(index));
                    que.answer=$filter('charCode')(index);
                }

            }else{
                angular.forEach(que.checkFlag,function(value,index){
                    que.checkFlag[index]=false;
                })
                que.answerFlag=true;
                que.checkFlag[index]=true;
                que.answer=$filter('charCode')(index);
            }
        };
        var commitFlag = true;
        $scope.commitAnswer=function(){
            $scope.answerJson=[];
            $scope.answerAll = true;
            angular.forEach($scope.questions,function(que){
                var data={
                    qid:que.id,
                    answer:que.answer
                }
                if(!que.answer && (que.type == 1 || que.type == 3)){
                    $scope.answerAll = false;
                }
                $scope.answerJson.push(data);
            });
            if(!commitFlag){
                return ;
            }
            if($scope.answerAll){
                commitFlag = false;
                $scope.commitData={
                    userId:$scope.userId,
                    subjectCode:subjectCode,
                    name:$scope.exersesName,
                    type:$scope.params.exerciseType,
                    knowledgeIdListStr:JSON.stringify($scope.konwledgeIdList),
                    questionIdListStr:JSON.stringify($scope.qidList),
                    originQid:$scope.params.qid,
                    answerJson:JSON.stringify( $scope.answerJson)
                }
                var alertData = {
                        message :'作业提交后将不能修改，是否继续？',
                        type:'2'
                    };
                    $scope.$emit('alert',alertData);
                    $scope.$on('alertEvent',function(event,data){
                        HttpClient.post('/ajax/wrongrecord/saveAnswers',$scope.commitData).then(function(data){
                            if(data.data.code==1){
                                if($scope.params.exerciseType == "101"){
                                    window.location.href="/student/consolidationReport?&exerciseType="+exerciseType+'&subjectCode='+$scope.params.subjectCode+'&content='+$scope.assignments.practiceTimes;
                                }else{
                                    window.location.href="/student/consolidationReport?exerciseID="+data.data.exerciseID+'&exerciseType='+exerciseType+'&qid='+$scope.params.qid+'&subjectCode='+$scope.params.subjectCode+'&content=0'+"&exerciseName="+$scope.exersesName;
                                }
                            }else{
                                var alertData = {
                                    message :'作业提交失败',
                                    action :'ok'
                                };
                                $scope.$emit('alert',alertData);
                            }
                            commitFlag = true;
                        });
                    });
            }else{
                var alertData = {
                        message :'有题目未完成'
                    };
                    $scope.$emit('alert',alertData);
            }
            
        }
        $scope.allReport = function(){
            if($scope.assignments.completedNum!=0){
                if($scope.params.exerciseType == "101"){
                    window.location.href='/student/consolidationReport?exerciseType='+exerciseType+'&subjectCode='+$scope.params.subjectCode+'&content=1';  
                }else{
                    window.location.href='/student/consolidationReport?exerciseType='+exerciseType+'&qid='+$scope.params.qid+'&subjectCode='+$scope.params.subjectCode+'&content=all&exerciseName='+$scope.exersesName;  
                }
                
            }
        }
    }]);