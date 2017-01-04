
define(['app','UserService','ExerciseService','ExamService','HttpClient','ngProgressBar'],function(app,UserService,ExerciseService,ExamService){
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
    //app.controller('');
    /**
     * 套卷测试报告详情
     */
    app.controller('ExamReportController',['$scope','$location','$anchorScroll','$filter','Toolkit','ExamService','MaterialService',function($scope,$location,$anchorScroll,$filter,Toolkit,ExamService,MaterialService){
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
});