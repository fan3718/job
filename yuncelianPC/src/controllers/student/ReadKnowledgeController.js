import app from 'app';

import 'services/UserService';
import 'services/Toolkit';
import 'services/ExerciseNoteService';
import 'services/VideoHelper';

import 'directives/ng-video';

app.controller('ReadKnowledgeController',['$scope','UserService','Toolkit','ExerciseNoteService','VideoHelper',function($scope,UserService,Toolkit,ExerciseNoteService,VideoHelper){
        $scope.userInfo = {
            subjects:[]
        };
        var localStorage = window.localStorage;
        $scope.now = new Date();
        $scope.filter = {
            p:0,
            ps:20
        }
        $scope.params = Toolkit.serializeParams();
        $scope.knowledgeName = decodeURI($scope.params.exerciseName);
        function showLoading(isShow){
            $scope.$emit('loading',isShow?'show':'hidden');
        }
        $scope.isHasContent=false;
        showLoading(true);
        $scope.knowledgeList = decodeURI($scope.params.knowledgeList);
        UserService.getUserInfo().then(function(info){
            $scope.userInfo = info;

            ExerciseNoteService.loadExerciseDetail($scope.params.type,$scope.params.subjectCode,$scope.knowledgeList,$scope.filter.p,$scope.filter.ps).then(function(data){
                //$scope.Exercise = data;
                showLoading(false);
                $scope.knowledges = data.details;
                angular.forEach($scope.knowledges,function(knowledge){
                    if(knowledge["videos"] && knowledge["videos"] != ""){
                        angular.forEach(knowledge["videos"],function(video){
                          console.info(video)
                            if(!localStorage.getItem(video.html)){
                                localStorage.setItem(video.html,0);
                            }
                            video.isWatched = !!parseInt(localStorage.getItem(video.html));
                        });
                        $scope.isHasContent = true;
                    }else if(knowledge.knowledgeDetails&&knowledge.knowledgeDetails[0].description && knowledge.knowledgeDetails[0].description != ""){
                        angular.forEach(knowledge["knowledgeDetails"],function(item){
                          console.info(item)
                            if(item.description&&item.description!=""){
                                $scope.isHasContent = true;
                            }
                        });
                    }
                });
            },function(msg){
                showLoading(false);
                $scope.visibleStyle={visibility:'visible'};
                console.log(msg);
            });

        });
        ////////////////////////////////////////
        var storage = window.localStorage;

        $scope.currentPlayVideo = null;
        /**
         * 播放视频
         */
        $scope.playVideo = function(info){
            if(localStorage.getItem(info.html)==0){
                $scope.unwatched--;
            }
            localStorage.setItem(info.html,parseInt(localStorage.getItem(info.html))+1);
            info.isWatched = true;
            $scope.currentPlayVideo = info;
            var videoUrl = info.video;
            if(angular.isUndefined(videoUrl)||videoUrl==''){
                videoUrl = info.html;
            }
            var index = VideoHelper.isSharedUrl(videoUrl);
            if(index>-1){
                var videoParams = VideoHelper.getIFrameUrl(videoUrl,index);
                if(typeof(videoParams)=='object'){
                    //获得窗口的垂直位置
                   var iTop = (window.screen.availHeight - 30 - videoParams.height) / 2;
                   //获得窗口的水平位置
                   var iLeft = (window.screen.availWidth - 10 - videoParams.width) / 2;
                   window.open(videoParams.url,'video','width='+videoParams.width+',height='+videoParams.height+',innerHeight='+videoParams.height+',innerWidth='+videoParams.width+',top='+iTop+',left='+iLeft+',toolbar=no, menubar=no, scrollbars=no, resizable=no');
                   return;
                }else{
                    $scope.videoUrl = videoParams;
                }
            }else{
                $scope.videoUrl = videoUrl;
                $scope.poster=info.thumbnail;
            }
            $scope.showVideoBox = true;
        }

        $scope.closeVideoBox = function(){
            $scope.showShareVideoBox = false;
            $scope.showVideoBox = false;
        }
        $scope.doExercise = function(knowledge){
            window.location.href = '/student/consolidationExercise?subjectCode='+$scope.params.subjectCode+'&exerciseType=100'+'&knowledgeid='+knowledge.code+'&qid='+$scope.params.qid+"&exerciseName="+knowledge.name;
        }
    }]);
