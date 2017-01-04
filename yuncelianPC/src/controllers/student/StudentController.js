import app from 'app';
import 'services/UserService';
import 'services/ExerciseService';
import 'services/ClassService';


export default app.controller('StudentController',['$scope','UserService','ExerciseService','ClassService',function($scope,UserService,ExerciseService,ClassService){
        $scope.userInfo = {
            subjects:[]
        };
        $scope.now = new Date();
        $scope.$on("userinfo",function(event,info){
            $scope.userInfo = info;
            UserService.getSubject().then(function(data){
                $scope.userInfo.subjects = data;
            });
            var defaultFilter={
                subjectID:-1,
                p:0,
                ps:5,
                hasMore:false,
                type:-1
            };

            ExerciseService.filterExercise(defaultFilter).then(function(exercises){
                for(var i = 0;i<exercises.length-1;i++){
                    if(!exercises[i].assignmentInfo){
                        var l = exercises.length-1;
                        exercises.splice(i,1);
                        i--;
                    }

                }

                $scope.filterExerciseState =0 ;
                //$scope.exercises.push.apply($scope.exercises,exercises);
                $scope.worktrails = exercises;
                //exercise数据进行分组处理
            });

            ClassService.getClassInfo($scope.userInfo.studentClass.classNumber).then(function(data){
                $scope.classInfo = data;

                angular.forEach($scope.classInfo.teachers,function(e){
                    e.abs = getAbs(e.subject);
                })
                $scope.classTable1 = [];
                $scope.classTable2 = [];
                angular.forEach($scope.classInfo.students,function(e,i){
                    if(i%2==0){
                        $scope.classTable1[$scope.classTable1.length] = e;
                    }else{
                        $scope.classTable2[$scope.classTable2.length] = e;
                    }
                })

            })

            $scope.isShowClassDetail = false;

        });
        var getAbs = function(abs){
            switch(abs){
                case "语文":return 'ch';break;
                case "数学":return 'math';break;
                case "英语":return 'en';break;
                case "物理":return 'phy';break;
                case "化学":return 'chemi';break;
                case "生物":return 'bio';break;
                case "地理":return 'geo';break;
                case "历史":return 'his';break;
                case "政治":return 'gov';break;
            }


        }
        //////////////////////////////////////////////////////////////////



    }]);