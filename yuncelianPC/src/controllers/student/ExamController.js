import app from 'app';
import 'services/UserService';
import 'services/ExerciseService';
import 'services/ExamService';
import 'services/HttpClient';

import 'directives/ng-progressbar';

app.controller('ExamController',['$scope','UserService','ExerciseService','ExamService','HttpClient',function($scope,UserService,ExerciseService,ExamService,HttpClient){
    $scope.userInfo = {
        subjects:[]
    };
    var exerType = 2;
    $scope.isStandardNav = true;
    $scope.$on("userinfo",function(event,info){
        $scope.userInfo = info;
        UserService.getSubject().then(function(data){
            $scope.userInfo.subjects = data;
        });
        /*
         * 获取时间线，页面一开始就加载
         *
         */
        ExerciseService.getTimeline(exerType,$scope.userInfo.studentClass.id).then(function(timelines){
            $scope.timelines = timelines;

            if(timelines.length>0){
                var item = timelines[0];
                $scope.filter.month = item.month;
                $scope.filter.term = item.term;
                $scope.filter.start=item.start;
                $scope.filter.end=item.end;
                // $scope.filter.p = 0;
                $scope.filter.classID = $scope.userInfo.studentClass.id;
                angular.forEach(timelines,function(stamp){
                    if(stamp.current){
                        var key = ""+stamp.term+stamp.year+(stamp.month<10?'0':'')+stamp.month;
                        $scope.currentTermMonths.push(key);
                        stamp.key=key;
                    }else{
                        stamp.key=stamp.term+'';
                    }
                });
            }
            //filterExam();
        });

    });
    //////////////////////////////////////////////////////////////////
    $scope.isRadioSelected = function(subjectID){
        return $scope.filter.subjectID==subjectID
    }
    $scope.now = new Date().getTime();
    $scope.groupedExams = {
    };
    $scope.timelines = [];
    $scope.currentTermMonths = [];
    //筛选作业的班级ID
    // ng-repeat 每个对象有自己的scope，因此需要包裹一层，才能实现radio的切换ng-model值也改变
    var endStamp = $scope.now;
    var d = new Date();
    d.setDate(1);d.setHours(0);d.setMinutes(0);d.setSeconds(0);d.setMilliseconds(0);
    var startStamp = Date.parse(d);
    var defaultFilter={
        subjectID:-1,
        p:0,
        ps:15,
        hasMore:true,
        type:2,
        start:startStamp,
        end:endStamp
    };

    $scope.filter = defaultFilter;
    $scope.exams =[];

    $scope.examFilter = function(item){
        if(item.assignmentInfo!=null) {
            return true;
        }
        return false;
    }
    $scope.$watch('filter.subjectID',function(newValue,oldValue){
        if(newValue !=oldValue){

            $scope.filter.subjectID = newValue;
            $scope.filter.p = 0;
            $scope.filter.hasMore=true;
            $scope.exams.splice(0,$scope.exams.length);
            $scope.groupedExams = {

            };
            filterExam();
        }
    });//监听

    /**
     * 过滤练习
     * */
    $scope.filterExamState = 0 ;
    function filterExam(){
        //if(!$scope.filter.hasMore){
        //    return ;
        //}
        if($scope.filterExamState==0){
            $scope.filterExamState =1;
            ExerciseService.filterExercise($scope.filter).then(function(exams){
                for(var i =0;i<exams.length;i++){
                    if(!exams[i].assignmentInfo){
                        var l = exams.length-1;
                        exams.splice(i,1);
                        if(i==l){
                            break;
                        }
                        i--;
                    }
                }
                $scope.filterExamState =0 ;
                $scope.exams.push.apply($scope.exams,exams);
                $scope.filter.p++;
                if(exams.length<$scope.filter.ps){
                    $scope.filter.hasMore = false;
                }else{
                    $scope.filter.hasMore = true;
                }
                //exam数据进行分组处理
                groupExam(exams);
            });
        }
    }
    function groupExam(exams){
        $scope.groupedExams = {};
        angular.forEach(exams,function(exer){
            var date = new Date(exer.createTime);
            var year = date.getFullYear();
            var month = date.getMonth()+1;
            //判断是不是当前学期
            var group = exer.termGroup+''+year+(month<10?'0':'')+month;
            if($scope.currentTermMonths.indexOf(group) == -1){
                group = ''+exer.termGroup;
            }
            var ges = $scope.groupedExams[group];
            if(angular.isUndefined(ges)){
                ges=[];
                $scope.groupedExams[group] = ges;
            }
            ges.push(exer);
        });

    }
    /*
     * 以时间为单位过滤信息，点击时间线筛选信息时候用
     * */
    $scope.filterTime = function(item){
        $scope.exams = [];
        var key = item.term+''+item.year+(item.month<10?'0':'')+item.month;
        if(item.current){
            $scope.filter.month =item.month;
        }else{
            $scope.filter.month =null;
        }
        if($scope.currentTermMonths.indexOf(key) == -1){
            key = ''+item.term;
        }
        var ges = $scope.groupedExams[key];
        if(angular.isUndefined(ges)){
            $scope.filter.p =0;
        }else{
        }
        $scope.filter.term=item.term;
        $scope.filter.start=item.start;
        $scope.filter.end=item.end;
        $scope.filter.p = 0;
        var params = angular.copy($scope.filter);


        $scope.loadExamNext();
    }
    $scope.loadExamNext = function(){
        filterExam();

    }
    $scope.viewDetail = function(exam){
        if(exam.assignmentInfo.status==1||exam.assignmentInfo.status==2){
            $scope.isShowQuickCodeTip=true;
        }
        else if(exam.assignmentInfo.status==3){
            //if((exam.dueDate<$scope.now||exam.assignmentInfo.completeCount==exam.assignStuCount)){
                window.location.href ="/student/examReport?exerId="+exam.id+"&assignId="+exam.assignmentInfo.id;
            /*}else{
                var data = {
                    message:'测试尚未完成，暂不能查看解析!'
                };
                $scope.$emit('alert',data);
            }*/


        }else{
            window.location.href ="/student/examReport?exerId="+exam.id+"&assignId="+exam.assignmentInfo.id;
        }

        //HttpClient.post('/student/examDetail',data);
    }



}]);
