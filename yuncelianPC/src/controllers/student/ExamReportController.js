import app from 'app';

import 'services/Toolkit';
import 'services/ExamService';
import 'services/MaterialService';

import 'directives/ng-swiper';
import 'directives/ng-score';

/**
     * 套卷测试报告详情
     */
export default app.controller('ExamReportController',['$scope','$location','$anchorScroll','$filter','Toolkit','ExamService','MaterialService',function($scope,$location,$anchorScroll,$filter,Toolkit,ExamService,MaterialService){
        $scope.params = Toolkit.serializeParams();
        $scope.canRedo = false;
        $scope.canUndo = false;
        $scope.tab = 0;
        $scope.tabCount = 0;
        $scope.sectionCode = -1;
        $scope.sliderIndex = 0;
        //记录上次swiper位置
        $scope.lastSlideIndexs = [];
        $scope.swiperIndex=0;
        $scope.quesIndex=0;
        $scope.paper = {};
        var url = $location.absUrl();
        ExamService.getUserExamReport($scope.params.exerId,$scope.params.assignId,url.indexOf('correct')==-1).then(function(paper){
            $scope.paper =paper;
            $scope.tab = $scope.paper.tabIndex;
            $scope.status=paper.status;
            $scope.sliderIndex = $scope.paper.unCorrectedIndex;
            var groupInfoList = $scope.paper.groupInfoList;
            $scope.params.subjectCode = $scope.paper.subjectCode;
            if(angular.isDefined(groupInfoList) && angular.isArray(groupInfoList) && groupInfoList.length>0){
                $scope.sectionCode = groupInfoList[0].sectionCode;
                var index = 0;
                $scope.tabCount = groupInfoList.length;
                angular.forEach(groupInfoList,function(info){
                    if($scope.paper.tabIndex == index){
                        $scope.lastSlideIndexs.push($scope.paper.unCorrectedIndex);
                    }else{
                        $scope.lastSlideIndexs.push(0);
                    }
                    index++;
                    angular.forEach(info.questions,function(question){
                        //逾期未提交试卷，所有题均为未批改
                        if($scope.paper.status == 4 ){
                            question.report.corrected = false;
                        }else if($scope.paper.status == 3 && info.sectionCode != 1 && info.sectionCode != 3){
                            question.report.corrected = false;
                        }
                        loadQuestionInfo(question);
                    });
                });
            }

        },function(msg){

        });

        var orderCode = ['一','二','三','四','五','六','七','八','九','十'];
        $scope.getOrderNumber = function(index){
            if(index >9){
                index = 9;
            }
            return orderCode[index];
        }


        var newSwiper = null;
        $scope.initSwiper = function(swiper,id){
            newSwiper=swiper;
        }
        $scope.tabsStyle = {
            marginLeft:'51px',
            transition:'margin-left 0.5s linear'
        }
        $scope.changeTab = function(tab){
            if(tab > 4 && tab < $scope.tabCount - 1){
                $scope.tabsStyle.marginLeft = 51-(145*(tab - 4))+"px";
            }else if(tab < 5){
                $scope.tabsStyle.marginLeft = "51px";
            }
            $scope.tab = tab;
            $scope.sliderIndex = $scope.lastSlideIndexs[parseInt(tab)] || 0;
            $scope.slideIndexTag=0;
            $scope.slideStyle={left:'0px',transition:'left 0.5s linear'}
        }
        $scope.tabsLeft = function(){
            if($scope.tab > 0){
                $scope.changeTab($scope.tab-1);
            }
        }
        $scope.tabsRight = function(){
            if($scope.tab < $scope.tabCount - 1){
                $scope.changeTab($scope.tab+1);
            }
        }
        $scope.getAnswerCode = function(index){
            return $filter('charCode')(index);
        }

        $scope.containsLetterCode = function(code,answer){
            code = code ||'';
            answer = answer ||'';
            if(code !='' && answer !=''){
              code = code.toUpperCase();
              answer = answer.toUpperCase();
              return answer.indexOf(code) >-1;
            }
            return false;
        }

        $scope.containsLetterIndex = function(index,answer){
            return $scope.containsLetterCode($scope.getAnswerCode(index),answer);
        }


  $scope.isDefined = function(obj){
            return angular.isDefined(obj) && obj !=null && obj!='';
        }


        $scope.showInput = function(question){
            question.showInput = !question.showInput;
        }

        $scope.confirmScore = function(question,swiperIndex,quesIndex){
            scoreAnswer(question,swiperIndex,quesIndex,question.score);
        }
        /**
         * 题目正确
         */
        $scope.correctRight= function(question,swiperIndex,quesIndex) {
            scoreAnswer(question,swiperIndex,quesIndex,question.report.points);
        }
        /**
         * 加载每道题的详情
         */
        function loadQuestionInfo(quest){
            MaterialService.getQuestionById(quest.id,$scope.params.subjectCode).then(function(info){
                quest.isLoaded = true;
                quest.score = quest.report.score || 0 ;
                //绑定数据
                for(var key in info){
                    quest[key] = info[key];
                }
            },function(msg){

            });
        }
        $scope.nextSilder = function(){
            if(newSwiper){
                newSwiper.swipeNext();
            }
        }

        $scope.onSliderChangeEnd = function(swiper,id,index){
            $scope.sliderIndex = index;

            //强制刷新
            try{
                $scope.lastSlideIndexs[$scope.tab]=index;
                $scope.$digest();
            }catch (e) {

            }


        }

        $scope.prevSilder = function(){
            if(newSwiper){

                newSwiper.swipePrev();
            }
        }

        $scope.sliderIndex = 0;

        /**
         * 设置
         */
        $scope.setSilder = function(swiperIndex,sliderIndex,question,code){
            if(newSwiper){
                $scope.swiperIndex=swiperIndex;
                $scope.quesIndex=sliderIndex;
                $scope.sliderIndex = sliderIndex;
                newSwiper.swipeTo(sliderIndex,200);
            }
        }
        $scope.slideIndexTag=0;
        $scope.slideStyle={left:'0px',transition:'left 0.5s linear'};
        initQList(0,11);
        $scope.slideRight=function(num){
            var num=num;
            var index=Math.ceil(num/11);
            if($scope.slideIndexTag+1==index){
                return false;
            }else{
                $scope.slideIndexTag++;
                $scope.slideStyle.left=-$scope.slideIndexTag*860+'px';
            }
            initQList(11*($scope.slideIndexTag),11*($scope.slideIndexTag+1));

        }
        $scope.slideLeft=function(){
            if($scope.slideIndexTag==0){
                return false;
            }else{
                $scope.slideIndexTag--;
                $scope.slideStyle.left=-$scope.slideIndexTag*860+'px';
            }
            initQList(11*($scope.slideIndexTag),11*($scope.slideIndexTag+1));
        }

        $scope.toggleShowAnswer = function(question){
            question.showAnswer = !question.showAnswer;

            if(newSwiper){
                newSwiper.invalidate();
            }

        }



    }]);
