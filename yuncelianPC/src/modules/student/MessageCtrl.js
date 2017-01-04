
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
    app.controller('MessageController',['$scope','UserService','ExerciseService','HttpClient',function($scope,UserService,ExerciseService,HttpClient){
        $scope.userInfo = {
            subjects:[]
        };
        $scope.$on("userinfo",function(event,info){
            $scope.userInfo = info;

            UserService.getSubject().then(function(data){
                $scope.userInfo.subjects = data;
            });

        });
        //////////////////////////////////////////////////////////////////
        var exerType = 1;
        $scope.isRadioSelected = function(subjectID){
            return $scope.filter.subjectID==subjectID
        }
        $scope.now = new Date().getTime();
        $scope.groupedMessages = {
        };
        $scope.timelines = [];
        $scope.currentTermMonths = [];
        //筛选作业的班级ID
        // ng-repeat 每个对象有自己的scope，因此需要包裹一层，才能实现radio的切换ng-model值也改变
        var endStamp = $scope.now;
        var startStamp = new Date().setDate(1);
        var defaultFilter={
            subjectID:-1,
            p:0,
            ps:15,
            hasMore:true,
            type:1

        };
        //$scope.$watch('filter.hasMore',function(newValue,oldValue){
        //    if(new )
        //})
        $scope.filter = defaultFilter;
        $scope.messages =[];

        $scope.messageFilter = function(item){
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
                $scope.messages.splice(0,$scope.messages.length);
                $scope.groupedMessages = {

                };
                filterMessage();
            }
        });//监听

        /**
         * 过滤练习
         * */
        $scope.filterMessageState = 0 ;
        function filterMessage(){
            //if(!$scope.filter.hasMore){
            //    return ;
            //}
            if($scope.filterMessageState==0){
                $scope.filterMessageState =1;
                ExerciseService.filterExercise($scope.filter).then(function(messages){

                    //angular.forEach(messages,function(e){
                    //
                    //})

                    for(var i = 0;i<messages.length;i++){
                        if(!messages[i].assignmentInfo){
                            var l = messages.length-1;
                            messages.splice(i,1);
                            if(i==l){
                                break;
                            }
                            i--;
                            continue;
                        }
                        if(messages[i].usePen === false){
                            messages[i].st = 1;
                        }else if(messages[i].assignmentInfo.status==1||messages[i].assignmentInfo.status==2){
                            messages[i].st = 2;
                        }else if(messages[i].assignmentInfo.status==3){
                            messages[i].st = 3;
                        }else if(messages[i].assignmentInfo.status==5||messages[i].assignmentInfo.status==4){
                            messages[i].st = 5;
                        }
                        if(messages[i].assignmentInfo.answerJson&&messages[i].assignmentInfo.answerJson!=''&&messages[i].assignmentInfo.answerJson.url){
                            messages[i].answerImg = [];
                            //angular.forEach(messages[i].assignmentInfo.answerJson.answers,function(e){
                            //    messages[i].answerImg[$scope.answerImg.length].latestUrl = e.url;
                            //})
                            if(messages[i].assignmentInfo.answerJson.url){
                                var obj = {};
                                obj.latestUrl = messages[i].assignmentInfo.answerJson.url;
                                messages[i].answerImg[messages[i].answerImg.length] =obj;
                            }

                        }

                    }


                    $scope.filterMessageState =0 ;
                    $scope.messages.push.apply($scope.messages,messages);
                    $scope.filter.p++;
                    if(messages.length<$scope.filter.ps){
                        $scope.filter.hasMore = false;
                    }
                    //message数据进行分组处理
                    groupMessage(messages);
                    //$scope.messages.forEach(function(e){
                    //    e.isShow = false;
                    //});
                });
            }
        }
        function groupMessage(messages){
            $scope.groupedMessages = {};
            angular.forEach(messages,function(exer){
                var date = new Date(exer.createTime);
                var year = date.getFullYear();
                var month = date.getMonth()+1;
                //判断是不是当前学期
                var group = exer.termGroup+''+year+(month<10?'0':'')+month;
                if($scope.currentTermMonths.indexOf(group) == -1){
                    group = ''+exer.termGroup;
                }
                var ges = $scope.groupedMessages[group];
                if(angular.isUndefined(ges)){
                    ges=[];
                    $scope.groupedMessages[group] = ges;
                }
                ges.push(exer);
            });
        }

        $scope.loadMessageNext = function(){
            filterMessage();
        }
       $scope.loadMessageNext();
        $scope.viewDetail = function(message){


            //HttpClient.post('/student/messageDetail',data);
        }
        $scope.transfer = function(dueTime){
            var d =new Date(dueTime);
            switch(d.getDay()){
                case 0:return "周日";break;
                case 1:return "周一";break;
                case 2:return "周二";break;
                case 3:return "周三";break;
                case 4:return "周四";break;
                case 5:return "周五";break;
                case 6:return "周六";break;

            }


        }
        //$scope.isShowGallery = false;
        $scope.gallery = undefined;
        $scope.isShowGallery = function(item){
            return item.isShow;
        }
        $scope.initGallery = function(gallery,item){
            $scope.gallery = gallery;
            $scope.gallery.addImageClickListener(function(){
                //$scope.isShowGallery  = false;
                item.isShow = false;
                $scope.$digest();
            });
        }
        $scope.showGallery = function (index,item){
            if(angular.isDefined($scope.gallery)){
                $scope.gallery.setIndex(index);
            }
            item.isShow = true;
            //$scope.isShowGallery  = true;
        }
        $scope.messageStatus = function(index){

            switch (index*1){
                case 1:return "message-status-noreply";break;
                case 2:return "message-status-reply";break;
                case 3:return "message-status-uncheck";break;
                case 5:return "message-status-check";break;
            }
        }
        $scope.changeStatus= function(message){
            var params = {};


            if(message.usePen){
                params.status = 2;
                message.assignmentInfo.status=2;

            }else{
                params.status = 5;
                message.assignmentInfo.status=5;

            }
            params.eid = message.id;
            params.stuId = $scope.userInfo.uid;
            ExerciseService.changeMessageStatus(params);
        }



    }]);

});