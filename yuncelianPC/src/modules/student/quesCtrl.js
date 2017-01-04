define(['app','UserService','HttpClient','ExerciseService','Filter','directives','Toolkit','ReportService','ngSwiper','ngEcharts'],function(app,UserService) {
    'use strict';
    app.controller('QuesController',['$scope','$filter','$location','UserService','ExerciseService','HttpClient',function($scope,$filter,$location,UserService,ExerciseService,HttpClient){

        $scope.assignID = assignID;
        $scope.countTime=0;
        ExerciseService.loadQuestions($scope.assignID).then(function(assignments){
            if(assignments['code']){
                $scope.popMessage={
                    message:assignments
                }
            }
            if(angular.isObject(assignments)&&assignments.length!=0){
                $scope.assignments=assignments;
                $scope.aid=assignments.aid;
                $scope.duration=assignments.duration;
                angular.forEach(assignments[1],function(value){
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
                    })
                    if(value['answer']&&value.answer!=""){
                        var answerCode=$filter('numCode')(value.answer);
                        value.checkFlag[answerCode]=true;
                        value['answerFlag']=true;
                    }
                })
            }
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
        $scope.saveAnswer=function(){
            $scope.organizeAnswer();
            $scope.commitData={
                uid:$scope.userId,
                aid:$scope.aid,
                answerJson:JSON.stringify( $scope.answerJson),
                duration:$scope.countTime,
                action:'save',
                key:'pc',
                sign:'pc'
            }
            HttpClient.post('/ajax/exercise/commit',$scope.commitData).then(function(data){
                if(data.data.code==1){
                    var alertData = {
                        message :'已回答题目保存成功'
                    };
                    $scope.$emit('alert',alertData);
                }else{
                    var alertData = {
                        message :'已回答题目保存失败'
                    };
                    $scope.$emit('alert',alertData);
                }
            });
        }
        $scope.commitAnswer=function(){
            $scope.organizeAnswer();
            $scope.commitData={
                uid:$scope.userId,
                aid:$scope.aid,
                answerJson:JSON.stringify( $scope.answerJson),
                duration:$scope.countTime,
                action:'commit',
                key:'pc',
                sign:'pc'
            }
            HttpClient.post('/ajax/exercise/commit',$scope.commitData).then(function(data){
                if(data.data.code==1){
                    var alertData = {
                        message :'作业提交后将不能修改，是否继续？',
                        type:'2'
                    };
                    $scope.$on('alertEvent',function(event,data){
                        location.href="/student/exercises";
                    });
                    $scope.$emit('alert',alertData);

                }else{
                    var alertData = {
                        message :'作业提交失败'
                    };
                    $scope.$emit('alert',alertData);
                }
            });
        }
        $scope.organizeAnswer=function(){
            $scope.answerJson={
                sections:[
                    {
                        code:1,
                        questions:[]
                    }
                ]
            }

            angular.forEach($scope.assignments[1],function(que){
                var data={
                    qid:que.eqID,
                    id:que.id,
                    answer:que.answer,
                    seconds:0
                }
                $scope.answerJson.sections[0].questions.push(data);
            })
        }

    }])
})