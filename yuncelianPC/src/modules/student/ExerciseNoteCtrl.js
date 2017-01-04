define(['app','UserService','HttpClient','DownloadExclService','ngVideoSlider','VideoHelper','ngVideo'],function(app,UserService,ExerciseNoteService){
    app.controller('notesReportController',['$scope','$timeout','$filter','UserService','ExerciseNoteService','DownloadExclService',function($scope,$timeout,$filter,UserService,ExerciseNoteService,DownloadExclService){
        $scope.subjects= [];
        $scope.groups=[];
        $scope.nowDate=new Date();
        $scope.activeSubjectId='';
        $scope.isLoaded = false;
        $scope.notesCheckOption=true;
        $scope.notesDownload=false;
        $scope.isInitUser = false;
        $scope.quesCheckQid=[];
        $scope.urlData = {};
        $scope.userInfo = null;
        $scope.visibleStyle={visibility:'hidden'};
        $scope.filter = {
            time:"-1",
            p:0,
            ps:20,
            timeDesc:'全部'
        }
        $scope.title=initHtmlTitle($scope.nowDate);
        $scope.$on("userinfo",function(event,info){
        	$scope.userInfo = info;
            $scope.userId = info.uid;
            ExerciseNoteService.getNoteSubject($scope.userId).then(function(result){
                $scope.studentSubject=result.subjects;
                angular.forEach($scope.studentSubject,function(subject,index){
                    var subjectData={
                        subjectID:subject.id,
                        subjectCode:subject.code,
                        subjectName:subject.shortName,
                        subjectCheck:false
                    }
                    if(index==0){
                        subjectData.subjectCheck=true;
                        $scope.activeSubjectId=subject.id;
                        $scope.activeSubjectCode=subject.code;
                    }
                    $scope.subjects.push(subjectData);
                });
                if($scope.studentSubject.length > 0){
                    var termDate=initDate($scope.nowDate);
                    $scope.monthArr=termDate.monthArr;
                    //$scope.isLoaded = true;
                    loadUserWrongNote();  
                    $scope.isInitUser= true;
                }
            })
        })
        $scope.changeSubject=function(index){
            $scope.groups=[];
            $scope.filter.p = 0;
            angular.forEach($scope.subjects,function(subject,index){
                subject.subjectCheck=false;
                // console.log(subject);
            })
            $scope.subjects[index].subjectCheck=true;
            // var termDate=initDate($scope.nowDate);
            $scope.activeSubjectId=$scope.subjects[index].subjectID;
            $scope.activeSubjectCode=$scope.subjects[index].subjectCode;
            loadUserWrongNote();
        };

        $scope.toggleShowAnalysis = function(quest){
            quest.showAnalysis = !quest.showAnalysis ;
        }

        $scope.checkAnswer=function(index,answer){
            var flag=false;
            var answerArr=answer.split(',');
            var option=$filter('charCode')(index);
            for(var i=0;i<answerArr.length;i++){
                if(option==answerArr[i]){
                    flag=true;
                }
            }
            return flag;
        }

        $scope.notesDownloadShow=function(){
        	if(checkVipLevel(3)){
                $scope.notesCheckOption=false;
                $scope.notesDownload=true;
        	}
        }
        $scope.cancelChoose=function(){
            $scope.notesCheckOption=true;
            $scope.notesDownload=false;
            angular.forEach($scope.groups,function(ques,index){
                angular.forEach(ques.quests,function(que,i){
                    que.queCheck = false;
                })
            });
            $scope.notesCheckOption=true;
            $scope.notesDownload=false;
            $scope.quesCheckQid=[];
        }

        $scope.checkQuestion=function(report){
            report.queCheck=!report.queCheck;
            var checkData = checkItem($scope.quesCheckQid,report.id);
            if(report.queCheck){
                if(!checkData.check){
                    $scope.quesCheckQid.push(report.id);
                }
            }else{
                if(checkData.check){
                    $scope.quesCheckQid.splice(checkData.index,1);
                }
            }
            function  checkItem(arr,id) {
                var checkData={
                    check:false,
                    index:''
                };
                if(arr.length>0){
                    for(var i= 0 ; i < arr.length;i++){
                        if(arr[i]==id){
                            checkData.check=true;
                            checkData.index=i;
                        }
                    }
                }
                return checkData;
            }
        }
        var downLoadFlag=true;
        $scope.downLoad=function () {
        	if(!checkVipLevel(3)){
        		return;
        	}
            var downLoadData={};
            if(downLoadFlag){
                downLoadFlag = false;
                downLoadData['subject']=$scope.activeSubjectCode;
                downLoadData['filetype']=1;
                downLoadData['source']=1;
                downLoadData['paper']={};
                downLoadData['paper']['title']='习题笔记'+ $filter('date')($scope.nowDate,'yyyy年MM月dd日');
                downLoadData['paper']['group']=[];
                downLoadData['paper']['group'][0]={
                    'title':'选择题',
                    'qids':$scope.quesCheckQid
                };
                if($scope.quesCheckQid.length>0){
                    var data = {
                        message:'笔记正在生成中，稍后会自动下载'
                    };
                    $scope.$emit('alert',data);
                    $scope.$on('alertEvent',function(event){
                        angular.forEach($scope.groups,function(ques,index){
                            angular.forEach(ques.quests,function(que,i){
                                que.queCheck = false;
                            })
                        });
                        $scope.notesCheckOption=true;
                        $scope.notesDownload=false;
                        $scope.quesCheckQid=[];
                    });
                    DownloadExclService.downloadExcl(downLoadData,$scope.userInfo.uid).then(function (result) {
                        if(result == 429){
                            var data = {
                                    message:'您已达到今天最大下载数，请明天再试'
                                };
                                $scope.$emit('alert',data);
                                downLoadFlag=true;
                        }else{
                            if(result.code==1){
                                result.downloadType = 0;//下载类型0自组1套卷
                                DownloadExclService.getFilePath(result).then(function (res) {
                                    if(res['filePath']){
                                        downLoadFlag=true;
                                        window.location.href=res['filePath'];
                                    }else{
                                        var data = {
                                            message:'后台处理超时,请稍候重新下载'
                                        };
                                        $scope.$emit('alert',data);
                                        downLoadFlag=true;
                                    }
                                })
                            }else{
                                var data = {
                                    message:'下载失败,请重新下载'
                                };
                                $scope.$emit('alert',data);
                                downLoadFlag=true;
                            }
                        }
                    })
                }else{
                    var data = {
                        message:'没有题目可供下载'
                    };
                    $scope.$emit('alert',data);
                    downLoadFlag=true;
                }
            }else{
                var data = {
                    message:'下载正在进行中，请稍候'
                };
                $scope.$emit('alert',data);
                downLoadFlag=true;
            }
            

        }
        $scope.$watch('filter.time',function(newValue,oldValue){
            if(newValue!=oldValue){
                $scope.filter.p = 0;
                $scope.groups=[];
                // var termDate=initDate($scope.nowDate);
                if(newValue!="-1"){
                    var ts = $scope.filter.time.split("-");
                    $scope.filter.timeDesc = ts[0]+'年'+ts[1]+'月';
                }else{
                    $scope.filter.timeDesc = '全部';
                }
                loadUserWrongNote();
            }
        });

        function showLoading(isShow){
            $scope.$emit('loading',isShow?'show':'hidden');
        }

        var isLoading = false;
        
        function loadUserWrongNote(){
        	if(isLoading){
        		return;
        	}
        	isLoading = true;
            //$scope.isLoaded = true;
            var year = $scope.termDate.year;
            var month= -1;
            if($scope.filter.time !="-1"){
                var ts = $scope.filter.time.split("-");
                year = ts[0];
                month = ts[1];
            }
            $scope.urlData.year = year;
            $scope.urlData.month = month;
            showLoading(true);
            ExerciseNoteService.getStudentWrongNote($scope.userId,$scope.activeSubjectId,$scope.termDate.term,year,month,$scope.filter.p,$scope.filter.ps).then(function(result){
                $scope.result = result;
                if(result.groups.length>0){
                    angular.forEach(result.groups,function(item,i){
                        if(result.groups[i]){
                            $scope.groups.push(result.groups[i]);
                        }
                    })
                }
                if(result.exerciseCount<20){
                    $scope.isLoaded = true;
                }
                showLoading(false);
                $scope.visibleStyle={visibility:'visible'};
                isLoading = false;
            },function(msg){
            	isLoading = false;
                showLoading(false);
                $scope.visibleStyle={visibility:'visible'};
                console.log(msg);
            });
        }
        $scope.loadExamNext=function(){
            if($scope.isLoaded ||  !$scope.isInitUser){
                return false;
            }
            $scope.filter.p++;
            loadUserWrongNote();
        }

        function initDate(date){
            var term,termID;
            var month=date.getMonth()+1;
            var year=date.getFullYear();
            var monthArr=[];
            var str='';
            var minTime;
            if(month>=3&&month<=8){
                termID='01';
                term=year+termID;
                for(var i= month;i>=3;i--){
                    str=year+'/'+i;
                    minTime = (new Date(str+"/1") ).getTime();
                    monthArr.push(minTime);
                }
            }else{
                if(month>0&&month<3){
                    termID='02';
                    term=(parseInt(year)-1)+termID;
                    for(var i= month;i>0;i--){
                        str=year+'/'+i;
                        minTime = (new Date(str+"/1") ).getTime();
                        monthArr.push(minTime);
                    }
                    for(var i= 12;i>=9;i--){
                        str=(parseInt(year)-1)+'/'+i;
                        minTime = (new Date(str+"/1") ).getTime();
                        monthArr.push(minTime);
                    }
                }else{
                    termID='02';
                    term=year+termID;
                    for(var i= month;i>=9;i--){
                        str=(parseInt(year)-1)+'/'+i;
                        minTime = (new Date(str+"/1") ).getTime();
                        monthArr.push(minTime);
                    }
                }
            }
            var termDate={
                year:year,
                month:month,
                monthArr:monthArr,
                termId:termID,
                term:term
            }
            $scope.termDate = termDate;
            return termDate;
        }

        function initHtmlTitle(date){
            var title;
            var termDate=initDate(date);
            if(termDate.termId=='01'){
                title=(parseInt(termDate.year)-1)+'-'+termDate.year+"学年下学期错题本";
            }else{
                if(termDate.month>0&&termDate.month<3){
                    title=(parseInt(termDate.year)-1)+'-'+termDate.year+"学年上学期错题本";
                }else{
                    title=termDate.year+'-'+(parseInt(termDate.year)+1)+"学年上学期错题本";
                }
            }
            return title;
        }
        $scope.doExercise = function(item){
            var exerciseName = "";
                angular.forEach(item.knowledge,function(name,index){
                    if(item.knowledge.length==index+1){
                        exerciseName += name;
                    }else{
                        exerciseName += name + "、";
                    }
                });
             window.open('/student/consolidationExercise?subjectCode='+$scope.activeSubjectCode+'&exerciseType=100'+'&knowledgeid='+item.knowledgeID+'&qid='+item.id+"&exerciseName="+exerciseName);
        }
        function checkVipLevel(minLevel){
        	if($scope.userInfo.status<minLevel){
        		var msg = '你当前使用的免费版不支持该功能';
        		if($scope.userInfo.status>0){
        			msg = '你当前会员等级不支持该功能';
        		}
                var alertData = {
                        message :msg,
                    };
                    $scope.$emit('alert',alertData);
                    return false;
        	}
        	return true;
        }
        $scope.doMoreExerses = function(item){
        	if(checkVipLevel(2)){
        		 window.open('/student/consolidationExercise?subjectCode='+$scope.activeSubjectCode+'&exerciseType=101');
        	}
        }
        $scope.readKnowledge = function(item){
             window.open('/student/readKnowledge?subjectCode='+$scope.activeSubjectCode+'&type='+item.type+'&qid='+item.id+'&knowledgeList='+JSON.stringify(item.knowledgeList));
        }

    }]);
    app.controller('readKnowledgeController',['$scope','UserService','Toolkit','ExerciseNoteService','VideoHelper',function($scope,UserService,Toolkit,ExerciseNoteService,VideoHelper){
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
                        var videos = knowledge["videos"];
                        angular.forEach(videos,function(video){
                            if(!localStorage.getItem(video.html)){
                                localStorage.setItem(video.html,0);
                            }
                            video.isWatched = !!parseInt(localStorage.getItem(video.html));
                        });
                        $scope.isHasContent = true;
                    }else if(knowledge.knowledgeDetails.description && knowledge.knowledgeDetails.description != ""){
                        var knowledgeDetails = knowledge["knowledgeDetails"];
                        angular.forEach(knowledgeDetails,function(knowledge){
                            if(knowledge.description!=""){
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
    app.controller('ExerciseController',['$scope','$filter','$location','Toolkit','UserService','ExerciseNoteService','HttpClient',function($scope,$filter,$location,Toolkit,UserService,ExerciseNoteService,HttpClient){

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
    app.controller('intensiveReportController',['$scope','$filter','$location','Toolkit','UserService','ExerciseNoteService',function($scope,$filter,$location,Toolkit,UserService,ExerciseNoteService){
        $scope.statusText="";
        /*UserService.getUserInfo().then(function(info){
            $scope.userId = info.uid;
            console.log($scope.userId);
        });*/
        
        function consolidateName(){
            var total = parseInt(practiceTimes);
            var exerciseNameList = new Array();
            for(var i = 1 ; i <= total; i ++){
                exerciseNameList.push({
                    num : i,
                    name:"强化训练"+Toolkit.getOrderNumber(i)
                })
            }
            $scope.exerciseNameList = exerciseNameList;
        }

        $scope.params = Toolkit.serializeParams();
        if($scope.params.exerciseType == "100"){
            $scope.pageName = "专项巩固";
            var name = decodeURI($scope.params.exerciseName);
            if(name.length > 47){
                $scope.exerciseName = name.substring(0,47)+"...";
            }else{
                $scope.exerciseName = name;
            }
            specialInit();
        }else{
            $scope.pageName = "强化训练-练习报告"
             consolidateInit();
             consolidateName();
        }
        function specialInit(){
            $scope.notExercise = true;
            if($scope.params["exerciseID"]){
                $scope.notExercise = false;
            }
            $scope.filter = {
                content:"all",
                reportDesc:'全部练习'
            }
            if($scope.params.content == "all"){
                ExerciseNoteService.getAllReport($scope.params.qid,$scope.params.exerciseType,$scope.params.subjectCode).then(function(result){
                    if(angular.isObject(result)){
                        reportData(result);
                    }
                });
            }else{
                $scope.filter.reportDesc = '本次练习';
                $scope.filter.content = '0';
                ExerciseNoteService.getExerciseReport(exerciseID).then(function(result){
                    if(angular.isObject(result)){
                        reportData(result);
                    }
                });
            }
        }
        function consolidateInit(){
            $scope.filter = {
                content:"1",
                reportDesc:'强化训练 一'
            }
            if($scope.params.content != "1"){
                $scope.filter.reportDesc = '强化训练'+Toolkit.getOrderNumber(parseInt($scope.params.content));
                $scope.filter.content = $scope.params.content;
            }
            ExerciseNoteService.getConsolidateReport($scope.params.exerciseType,$scope.params.subjectCode,$scope.params.content).then(function(result){
                if(angular.isObject(result)){
                    reportData(result);
                }
            });
        }
        $scope.slideIndexTag=0;
        $scope.init=function(result){
            $scope.assignment=result.exercise;
            $scope.assignment.rightCount=result.exercise.totalCount-result.exercise.wrongCount;
            // if(result.assignment.status==5){
                $scope.commitFlag=true;
                $scope.commitTime=result.exercise.createTime.time;
                if(result.exercise.totalCount != 0 && $scope.assignment.rightCount != 0){
                    $scope.rightPercent=Math.round($scope.assignment.rightCount*100/result.exercise.totalCount)+'%';
                }else if(result.exercise.totalCount == $scope.assignment.rightCount){
                    $scope.rightPercent = '100%';
                }else if($scope.assignment.rightCount == 0){
                    $scope.rightPercent = '0%';
                }
                if(result.exercise.totalCount != result.questions.length){
                    $scope.rightName = '客观题答对题数';
                }else{
                    $scope.rightName = '答对题数';
                }
            // }else if(result.assignment.status==4){
            //     $scope.statusText="未完成";
            //     $scope.commitFlag=false;
            // }
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
        $scope.$watch('filter.content',function(newValue,oldValue){
            if(newValue!=oldValue){
                newSwiper.swipeTo(0);
                $scope.filter.content = newValue;
                if(newValue == "all"){
                    $scope.filter.reportDesc = '全部练习';
                    ExerciseNoteService.getAllReport($scope.params.qid,$scope.params.exerciseType,$scope.params.subjectCode).then(function(result){
                        if(angular.isObject(result)){
                            reportData(result);
                        }
                    });
                }else if(newValue == "0"){
                    $scope.filter.reportDesc = '本次练习';
                    ExerciseNoteService.getExerciseReport(exerciseID).then(function(result){
                    if(angular.isObject(result)){
                            reportData(result);
                        }
                    });
                }else{
                    $scope.filter.reportDesc = '强化训练'+Toolkit.getOrderNumber(parseInt(newValue));
                    ExerciseNoteService.getConsolidateReport($scope.params.exerciseType,$scope.params.subjectCode,newValue).then(function(result){
                        if(angular.isObject(result)){
                            reportData(result);
                        }
                    });
                }
            }
        });
        function reportData(result){
            $scope.result=result;
            if(result.questions){
                $scope.queData=result.questions;
            }
            $scope.quesLength=$scope.queData.length;
            $scope.quesLength=$scope.queData.length;
            $scope.queIndex=Math.ceil($scope.quesLength/11);
            angular.forEach($scope.queData,function(que,index){
                $scope.answerArr=que.answer.split(',');
                if( que.studentAnswer!=""){
                    $scope.studentAnswerArr=que.studentAnswer.split(',');
                }else{
                    $scope.studentAnswerArr=[];
                }
                que.commitFlag = true;
                if(que.type != 1 && que.type != 3){
                    que.commitFlag = false;
                }else{
                    que.answerFlag=$scope.initAnswerFlag($scope.answerArr,que.options.length);
                    que.studentAnswerFlag=$scope.initAnswerFlag($scope.studentAnswerArr,que.options.length);
                    que.judgeFlag=$scope.initJudge($scope.answerArr,$scope.studentAnswerArr);
                }
            })
            $scope.init(result);
            $scope.showStyle={visibility:'visible'};
            $scope.slideStyle={left:'15px',transition:'left 0.5s linear',width:90*($scope.quesLength+10)+'px'};
        }
        $scope.slideLeftFlag=false;
        initQList(0,11);
        $scope.slideRight=function(num){
            var num=num;
            if($scope.slideIndexTag+1==$scope.queIndex){
                return false;
            }else{
                $scope.slideRightFlag=true;
                $scope.slideIndexTag++;
                $scope.slideStyle.left=-$scope.slideIndexTag*860+'px';
            }
            initQList(11*($scope.slideIndexTag),11*($scope.slideIndexTag+1));
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
            initQList(11*($scope.slideIndexTag),11*($scope.slideIndexTag+1));
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
    }])
});