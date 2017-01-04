
define(['app','UserService','ExerciseService','HttpClient','ngProgressBar'],function(app,UserService,ExerciseService){
    'use strict';
    app.config(['$httpProvider', function($httpProvider) {
        //initialize get if not there
        if (!$httpProvider.defaults.headers.get) {
            $httpProvider.defaults.headers.get = {};
        }

        // Answer edited to include suggestions from comments
        // because previous version of code introduced browser-related errors

        //disable IE ajax request caching
        //alert(!!window.ActiveXObject);
        if (!!window.ActiveXObject||"ActiveXObject" in window){
            $httpProvider.defaults.headers.get['If-Modified-Since'] = 'Mon, 26 Jul 1997 05:00:00 GMT';
            // extra
            $httpProvider.defaults.headers.get['Cache-Control'] = 'no-cache';
            $httpProvider.defaults.headers.get['Pragma'] = 'no-cache';
        }


    }]);
    app.controller('ExerciseController',['$scope','UserService','ExerciseService','HttpClient',function($scope,UserService,ExerciseService,HttpClient){
        $scope.userInfo = {
            subjects:[]
        };
        $scope.$on("userinfo",function(event,info){
            $scope.userInfo = info;
            UserService.getSubject().then(function(data){
                $scope.userInfo.subjects = data;

            });
            ExerciseService.getTimeline(exerType,$scope.userInfo.studentClass.id).then(function(timelines){
                $scope.timelines = timelines;
                if(timelines.length>0){
                    var item = timelines[0];
                    $scope.filter.month = item.month;
                    $scope.filter.term = item.term;
                    $scope.filter.start=item.start;
                    $scope.filter.end=item.end;
                    $scope.filter.p = 0;
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
                //filterExercise();
            });

        });
        //////////////////////////////////////////////////////////////////
        var exerType = 0;
        $scope.isRadioSelected = function(subjectID){
            return $scope.filter.subjectID==subjectID
        }
        $scope.now = new Date().getTime();
        $scope.groupedExercises = {
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
            type:exerType,
            start:startStamp,
            end:endStamp
        };
        $scope.filter = defaultFilter;
        $scope.exercises =[];
        /*
        * 获取时间线，页面一开始就加载
        *
        */

        $scope.exerciseFilter = function(item){
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
                $scope.exercises.splice(0,$scope.exercises.length);
                $scope.groupedExercises = {

                };
                filterExercise();
            }
        });//监听

        /**
         * 过滤练习
         * */
        $scope.filterExerciseState = 0 ;
        function filterExercise(){
            //if(!$scope.filter.hasMore){
            //    return ;
            //}
            if($scope.filterExerciseState==0){
                $scope.filterExerciseState =1;
                ExerciseService.filterExercise($scope.filter).then(function(exercises){
                    for(var i =0;i<exercises.length;i++){
                        if(!exercises[i].assignmentInfo){
                            var l = exercises.length-1;
                            exercises.splice(i,1);
                            if(i==l){
                                break;
                            }
                            i--;
                        }
                    }
                    $scope.filterExerciseState =0 ;
                    $scope.exercises.push.apply($scope.exercises,exercises);
                    $scope.filter.p++;
                    if(exercises.length<$scope.filter.ps){
                        $scope.filter.hasMore = false;
                    }
                    //exercise数据进行分组处理
                    groupExercise(exercises);
                });
            }
        }
        function groupExercise(exercises){
            $scope.groupedExercises = {};
            angular.forEach(exercises,function(exer){
                var date = new Date(exer.createTime);
                var year = date.getFullYear();
                var month = date.getMonth()+1;
                //判断是不是当前学期
                var group = exer.termGroup+''+year+(month<10?'0':'')+month;
                if($scope.currentTermMonths.indexOf(group) == -1){
                    group = ''+exer.termGroup;
                }
                var ges = $scope.groupedExercises[group];
                if(angular.isUndefined(ges)){
                    ges=[];
                    $scope.groupedExercises[group] = ges;
                }
                ges.push(exer);
            });
        }
        /*
        * 以时间为单位过滤信息，点击时间线筛选信息时候用
        * */
        $scope.filterTime = function(item){
            $scope.exercises = [];
            var key = item.term+''+item.year+(item.month<10?'0':'')+item.month;
            if(item.current){
                $scope.filter.month =item.month;
            }else{
                $scope.filter.month =null;
            }
            if($scope.currentTermMonths.indexOf(key) == -1){
                key = ''+item.term;
            }
            var ges = $scope.groupedExercises[key];
            if(angular.isUndefined(ges)){
                $scope.filter.p =0;
            }
            $scope.filter.term=item.term;
            $scope.filter.start=item.start;
            $scope.filter.end=item.end;
            $scope.filter.p = 0;
            var params = angular.copy($scope.filter);
            $scope.loadExerciseNext();
        }
        $scope.loadExerciseNext = function(){
            filterExercise();
        }
        $scope.viewDetail = function(exercise){
            window.location.href = '/student/exerciseDetail?exerID='+exercise.id;
        }



    }]);
});