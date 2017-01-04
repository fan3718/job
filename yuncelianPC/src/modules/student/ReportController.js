define(['app','UserService','ExerciseService','DownloadExclService','ngEcharts','Filter','directives','Toolkit','ReportService','ngSwiper','ngEcharts'],function(app,UserService) {
    'use strict';
    app.controller('ReportController',['$scope','$filter','$location','UserService','ExerciseService',function($scope,$filter,$location,UserService,ExerciseService){
        $scope.statusText="";
        $scope.hasData = false;
        $scope.notSupported = false;
        /*UserService.getUserInfo().then(function(info){
            $scope.userId = info.uid;
            console.log($scope.userId);
        });*/
        $scope.id=assignID;
        $scope.slideIndexTag=0;
        ExerciseService.getPaperReport($scope.id).then(function(result){
            if(angular.isObject(result)){
                $scope.result=result;
                
                if(result['1']){
                    $scope.queData=result['1'];
                }
                $scope.quesLength=$scope.queData.length;
                $scope.queIndex=Math.ceil($scope.quesLength/11);
                angular.forEach($scope.queData,function(que,index){
                    $scope.answerArr=que.answer.split(',');
                    if( que.studentAnswer!=""){
                        $scope.studentAnswerArr=que.studentAnswer.split(',');
                    }else{
                        $scope.studentAnswerArr=[];
                    }
                    que.answerFlag=$scope.initAnswerFlag($scope.answerArr,que.options.length);
                    que.studentAnswerFlag=$scope.initAnswerFlag($scope.studentAnswerArr,que.options.length);
                    que.judgeFlag=$scope.initJudge($scope.answerArr,$scope.studentAnswerArr);
                })
                $scope.init(result);
                $scope.showStyle={visibility:'visible'};
                $scope.slideStyle={left:'15px',transition:'left 0.5s linear',width:90*($scope.quesLength+10)+'px'};
                $scope.hasData = true;
            }
        },function(msg){
            if(msg.indexOf('不支持')!=-1){
                $scope.statusText = msg;
                $scope.notSupported = true;
            }
        });
        $scope.init=function(result){
            $scope.assignment=result.assignment;
            if(result.assignment.status==5){
                $scope.commitFlag=true;
                $scope.commitTime=result.assignment.lastUpdateTime.time;
                $scope.rightPercent=Math.round(result.rightCount*100/result.count)+'%';
            }else if(result.assignment.status==4){
                $scope.statusText="未完成";
                $scope.commitFlag=false;
            }
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
    app.controller('MarkReportController',['$scope','$timeout','$filter','UserService','ReportService',function($scope,$timeout,$filter,UserService,ReportService){
         $scope.notSupported = false;
         $scope.statusText="";
        $scope.subjects=[];
        $scope.filterID=[];
        $scope.activeSubject=[];
        $scope.historyLists=[];
        $scope.leftSlide=[];
        $scope.rightSlide=[];
        $scope.slideNum=0;
        $scope.diagramData=[];
        $scope.activeTermTime=[];
        $scope.nowDate=new Date();
        $scope.termDate={
            1:{
                startMonth:3,
                endMonth:8
            },
            2:{
                startMonth:9,
                endMonth:2
            }
        };
        UserService.getUserInfo().then(function(info){
            $scope.userId = info.uid;
            $scope.className = info.studentClass.name;
            ReportService.getReportSubject($scope.userId).then(function(result){
                $scope.studentSubject=result.subjects;
                $scope.subjectReportData={};
                angular.forEach($scope.studentSubject,function(subject,index){
                    var subjectData={
                        subjectID:subject.id,
                        subjectName:subject.shortName,
                        subjectCheck:false
                    }
                    if(index==0){
                        subjectData.subjectCheck=true;
                    }
                    $scope.subjects.push(subjectData);
                })
                ReportService.getReportStemList('student',$scope.userId,-1,'pc','pc').then(function(result){
                    console.log(result);
                    if(result.code==1){
                        $scope.termReport=[];
                        $scope.termTag=[];
                        $scope.termReportData=result.reports;
                        angular.forEach($scope.termReportData,function(report,index){
                            $scope.termTag.push(parseInt(index));
                        });
                        $scope.termTag.sort(function(a,b){
                            return b-a;
                        });
                        $scope.visibleStyle={visibility:'visible'};
                        //初始化学科报告数据
                        initReportData($scope.termTag,$scope.subjects);

                    }
                });
                function initReportData(termArr,subjectArr){
                    var subjectReport={
                        '0':'',
                        '1':'',
                        '2':'',
                        avgDuration:'',
                        avgScore:'',
                        questionTotal:'',
                        questionWrong:'',
                        subjectName:'',
                        teacherName:'',
                        show:false,
                        term:'',
                        termName:''
                    }
                    for(var i=0;i<termArr.length;i++){
                        $scope.leftSlide[i]=false;
                        $scope.rightSlide[i]=false;
                        var checkDate = $scope.initCheckDate(termArr[i]);
                        var sendData={
                            index:i,
                            uid:$scope.userId,
                            subject:$scope.subjects[0].subjectID,
                            startTime:checkDate.startTime,
                            endTime:checkDate.endTime,
                            term:termArr[i],
                            key:'pc',
                            sign:'pc'
                        };
                        $scope.termReportData[termArr[i]]['selectDate']=checkDate.selectDate;
                        $scope.filterID.push($scope.subjects[0].subjectID);
                        $scope.activeSubject[i]=$scope.subjects[0].subjectID;
                        if(i==0){
                            $scope.nowTerm=termArr[i] % 100;
                            var nowDate=getNowDate($scope.termDate);
                            sendData.startTime=nowDate.all.startTime;
                            sendData.endTime=nowDate.all.endTime;
                            $scope.termReportData[termArr[i]].selectDate=nowDate;
                        }
                        var termTime={
                            startTime:sendData.startTime,
                            endTime:sendData.endTime
                        }
                        $scope.activeTermTime[i]=termTime;
                        ReportService.getReportDetailHistory(sendData).then(function(result){
                            $scope.historyLists=result.history;
                            $scope.historyListsLength=result.history.length;
                            $scope.initHistory(result.history,result.index);
                        });
                        for(var j=0;j<subjectArr.length;j++){
                            if(angular.isDefined($scope.termReportData[termArr[i]][subjectArr[j].subjectID])){
                                $scope.termReportData[termArr[i]]['termName']=$scope.termReportData[termArr[i]][subjectArr[j].subjectID].termName;
                                $scope.termReportData[termArr[i]][subjectArr[j].subjectID]['show']=true;
                                $scope.termReportData[termArr[i]][subjectArr[j].subjectID]=judgeSubjectData($scope.termReportData[termArr[i]][subjectArr[j].subjectID]);
                            }else{
                                subjectReport.subjectName=subjectArr[j].subjectName;
                                subjectReport.term=termArr[i];
                                $scope.termReportData[termArr[i]][subjectArr[j].subjectID]=subjectReport;
                            }
                        }
                    }
                }
            },function(msg){
                if(msg.indexOf('不支持')!=-1){
                    $scope.statusText = msg;
                    $scope.notSupported = true;
                }
            })
        });

        function judgeSubjectData(objData){
            if(angular.isUndefined(objData['0'])){
                objData['0']='0/0';
            }
            if(angular.isUndefined(objData['1'])){
                objData['1']='0/0';
            }
            if(angular.isUndefined(objData['2'])){
                objData['2']='0/0';
            }
            if(angular.isUndefined(objData['teacherName'])){
                objData['teacherName']='暂无老师';
            }
            if(objData['teacherName']==''){
                objData['teacherName']='暂无老师';
            }
            return objData;
        }

        $scope.initHistory=function(historys,index){
            $scope.history=historys;
            $scope.completeCounts=[];
            $scope.rightCounts=[];
            $scope.dataTimes=[];
            $scope.historyFlag=false;
            if(historys.length>0){
                $scope.historyFlag=true;
            }
            historys.sort(function(a,b){
                return a.lastUpdateTime- b.lastUpdateTime;
            })

            if(Math.floor(historys.length/10)>1 || (Math.floor(historys.length/10)==1&&historys.length%10>0) ){
                var resultNum=Math.floor($scope.historyListsLength/10);
                $scope.slideNum = resultNum;
                $scope.leftSlide[index]=true;
                historys=spliceHistory($scope.historyLists,resultNum);
            }
            angular.forEach(historys,function(history,index){
                var time=$filter('date')(history.lastUpdateTime,'yyyy-MM-dd');
                $scope.dataTimes.push(time);
                $scope.completeCounts.push(history.completeCount);
                $scope.rightCounts.push(history.rightCount);
            })
            var diagramData={
                index:index,
                exist:$scope.historyFlag,
                dataTimes:$scope.dataTimes,
                completeCounts:$scope.completeCounts,
                rightCounts:$scope.rightCounts
            }

            $scope.diagramData[index]=diagramData;
        }

        $scope.initCheckDate=function(date){
            var year=Math.round(date/100);
            var startYear=year;
            var endYear=year;
            var term=date%100;
            if(term==2){
                endYear=year+1;
            }
            var startTime=new Date(  parseInt(startYear)+'/'+parseInt($scope.termDate[term].startMonth)+'/'+1).getTime();
            var endTime=new  Date( parseInt(endYear)+'/'+parseInt($scope.termDate[term].endMonth)+'/'+parseInt(getdaysinmonth(year,$scope.termDate[term].endMonth)) ).getTime();
            var checkDate={
                startTime:startTime,
                endTime:endTime,
                selectDate:getSelectDate()
            }

            function getdaysinmonth(year,month){
                month = parseInt(month,10);
                year  = parseInt(year,10);
                var temp = new Date(year,month,0);
                return temp.getDate();
            }

            function  getSelectDate(){
                var selectDate={
                    'oneMonth':{
                        active:false,
                        startTime:0,
                        name:'近一个月',
                        endTime:endTime
                    },
                    'twoMonth':{
                        active:false,
                        startTime:0,
                        name:'近两个月',
                        endTime:endTime
                    },
                    'threeMonth':{
                        active:false,
                        startTime:0,
                        name:'近三个月',
                        endTime:endTime
                    },
                    'all':{
                        active:true,
                        startTime:startTime,
                        name:'本学期',
                        endTime:endTime
                    }
                }
                selectDate.oneMonth.startTime=new  Date( parseInt(endYear)+'/'+parseInt($scope.termDate[term].endMonth)+'/'+1 ).getTime();
                selectDate.twoMonth.startTime=new  Date( parseInt(endYear)+'/'+(parseInt($scope.termDate[term].endMonth)-1)+'/'+1 ).getTime();
                if(term==2){
                    selectDate.threeMonth.startTime=new  Date( (parseInt(endYear)-1)+'/'+12+'/'+1 ).getTime();
                }else{
                    selectDate.threeMonth.startTime=new  Date( parseInt(endYear)+'/'+(parseInt($scope.termDate[term].endMonth)-2)+'/'+1  ).getTime();
                }
                return selectDate;
            }
            return checkDate;
        }

        $scope.slideLeft=function(tIndex){
            if(Math.floor($scope.historyListsLength/10)>1 || (Math.floor($scope.historyListsLength/10)==1&&$scope.historyListsLength%10>0)){
                if($scope.slideNum==0){
                    $scope.leftSlide[tIndex]=false;
                    return false;
                }else{
                    $scope.slideNum--;
                    if($scope.slideNum ==0 || ($scope.historyListsLength%10==0 && $scope.slideNum==1)){
                        $scope.leftSlide[tIndex]=false;
                    }
                    $scope.rightSlide[tIndex]=true;
                    var newHistory=spliceHistory($scope.historyLists,$scope.slideNum);
                    $scope.initHistory(newHistory,tIndex);
                } 
            }
        }
        $scope.slideRight=function(tIndex){
            if(Math.floor($scope.historyListsLength/10)>1 || (Math.floor($scope.historyListsLength/10)==1&&$scope.historyListsLength%10>0) ){
                var resultNum=Math.floor($scope.historyListsLength/10);
                if(resultNum==$scope.slideNum ){
                    $scope.rightSlide[tIndex]=false;
                    return false;
                }else{
                    $scope.slideNum++;
                    if(resultNum==$scope.slideNum){
                        $scope.rightSlide[tIndex]=false;
                    }
                    $scope.leftSlide[tIndex]=true;
                    var newHistory=spliceHistory($scope.historyLists,$scope.slideNum);
                    $scope.initHistory(newHistory,tIndex);
                }
            }
        }

        $scope.isRadioSelected = function(classNum,index){
            if($scope.filterID[index]==classNum){
                return true;
            }
            return false;
        }
        $scope.changeSubject=function(subject,index,tIndex){
            $scope.slideNum=0;
            $scope.filterID[tIndex]=subject.subjectID;
            $scope.activeSubject[tIndex]=subject.subjectID;
            $scope.leftSlide[tIndex]=false;
            $scope.rightSlide[tIndex]=false;
            var sendData={
                index:tIndex,
                uid:$scope.userId,
                subject:subject.subjectID,
                startTime:$scope.activeTermTime[tIndex].startTime,
                endTime:$scope.activeTermTime[tIndex].endTime,
                term:$scope.termTag[tIndex],
                key:'pc',
                sign:'pc'
            };
            ReportService.getReportDetailHistory(sendData).then(function(result){
                $scope.historyLists=result.history;
                $scope.historyListsLength=result.history.length;
                $scope.initHistory(result.history,tIndex);
            });
        }

        $scope.changeTermTime=function(selectDate,termData,tIndex){
            $scope.slideNum=0;
            angular.forEach(selectDate,function(data,num){
                data.active=false;
            })
            termData.active=true;
            $scope.leftSlide[tIndex]=false;
            $scope.rightSlide[tIndex]=false;
            var termTime={
                startTime:termData.startTime,
                endTime:termData.endTime
            }
            var sendData={
                index:tIndex,
                uid:$scope.userId,
                subject:$scope.activeSubject[tIndex],
                startTime:termData.startTime,
                endTime:termData.endTime,
                term:$scope.termTag[tIndex],
                key:'pc',
                sign:'pc'
            };
            $scope.activeTermTime[tIndex]=termTime;
            ReportService.getReportDetailHistory(sendData).then(function(result){
                $scope.historyLists=result.history;
                $scope.historyListsLength=result.history.length;
                $scope.initHistory(result.history,tIndex);
            });
        }
        function spliceHistory(arr,number){
            var number=parseInt(number);
            var length=arr.length;
            var resultNum=Math.floor(length/10);
            var residueNum=length%10;
            // if(resultNum>1 || (resultNum==1&&residueNum>0)){
            //     if(number<resultNum){
            //         arr=arr.slice(10*number,9+10*number);
            //     }else if(number==resultNum){
            //         if((10*number)==(10*number+residueNum-1)){
            //             arr=arr.slice(10*number);
            //         }else{
            //             arr=arr.slice(10*number,10*number+residueNum-1);
            //         }
            //     }

            // }
            if(number!=0){
                arr=arr.slice(length-10*(resultNum-number+1),length-10*(resultNum-number));
            }else if(resultNum>0){
                arr=arr.slice(0,length-10*resultNum)
            }
            return arr;
        }




        function  getNowDate(termDate){
            var endTime=$scope.nowDate.getTime();
            var month=$scope.nowDate.getMonth()+1;
            var year=$scope.nowDate.getFullYear();
            var termStartMonth=termDate[$scope.nowTerm].startMonth;
            var termStartTime=new Date(  parseInt(year)+'/'+parseInt(termStartMonth)+'/'+1).getTime();
            var selectDate={
                'oneMonth':{
                    active:false,
                    startTime:0,
                    name:'近一个月',
                    endTime:endTime
                },
                'twoMonth':{
                    active:false,
                    startTime:0,
                    name:'近两个月',
                    endTime:endTime
                },
                'threeMonth':{
                    active:false,
                    startTime:0,
                    name:'近三个月',
                    endTime:endTime
                },
                'all':{
                    active:true,
                    startTime:termStartTime,
                    name:'本学期',
                    endTime:endTime
                }
            }
            if(termStartMonth == judgeStartMonth(termStartMonth,month) ){
                selectDate.oneMonth.startTime=new Date(  parseInt(year)+'/'+parseInt(termStartMonth)+'/'+1).getTime();
            }else{
                selectDate.oneMonth.startTime=endTime-(24*60*60*1000*30);
            }
            if(termStartMonth == judgeStartMonth(termStartMonth,month-2) ){
                selectDate.twoMonth.startTime=new Date(  parseInt(year)+'/'+parseInt(termStartMonth)+'/'+1).getTime();
            }else{
                selectDate.twoMonth.startTime=endTime-(24*60*60*1000*2*30);
            }
            if(termStartMonth == judgeStartMonth(termStartMonth,month-3) ){
                selectDate.threeMonth.startTime=new Date(  parseInt(year)+'/'+parseInt(termStartMonth)+'/'+1).getTime();
            }else{
                selectDate.threeMonth.startTime=endTime-(24*60*60*1000*3*30);
            }

            return selectDate;
        }

        function judgeStartMonth(termStartMonth,month){

            return  parseInt(termStartMonth) > parseInt(month) ? parseInt(termStartMonth) : parseInt(month);
        }
    }])
    app.controller('notesReportController',['$scope','$timeout','$filter','UserService','ReportService','DownloadExclService',function($scope,$timeout,$filter,UserService,ReportService,DownloadExclService){
        $scope.subjects=[];
        $scope.groups=[];
        $scope.nowDate=new Date();
        $scope.activeSubjectId='';
        $scope.isLoaded = true;
        $scope.notesCheckOption=true;
        $scope.notesDownload=false;
        $scope.quesCheckQid=[];
        $scope.filter = {
            time:"-1",
            p:0,
            ps:5,
            timeDesc:'全部'
        }
        $scope.title=initHtmlTitle($scope.nowDate);
        UserService.getUserInfo().then(function(info){
            $scope.userId = info.uid;
            ReportService.getReportSubject($scope.userId).then(function(result){
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
                })
                var termDate=initDate($scope.nowDate);
                $scope.monthArr=termDate.monthArr;
                loadUserWrongNote();
            })
        })
        $scope.loadExamNext=function(){
            if($scope.isLoaded){
                return false;
            }
            $scope.filter.p++;
            loadUserWrongNote();
        }
        $scope.changeSubject=function(index){
            $scope.groups=[];
            $scope.filter.p = 0;
            $scope.isLoaded = true;
            angular.forEach($scope.subjects,function(subject,index){
                subject.subjectCheck=false;
            })
            $scope.subjects[index].subjectCheck=true;
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
            $scope.notesCheckOption=false;
            $scope.notesDownload=true;
        }
        $scope.cancelChoose=function(){
            $scope.notesCheckOption=true;
            $scope.notesDownload=false;
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
        $scope.downLoad=function () {
            var downLoadData={};
            var downLoadFlag=true;
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
                DownloadExclService.downloadExcl(downLoadData).then(function (result) {
                    if(result.code==1){
                        if(downLoadFlag){
                            downLoadFlag=false;
                            DownloadExclService.getFilePath(result).then(function (res) {
                                if(res['filePath']){
                                    downLoadFlag=true;
                                    window.location.href=res['filePath'];
                                }
                            })
                        }else{
                            var data = {
                                message:'请耐心等待下载'
                            };
                            $scope.$emit('alert',data);
                        }
                    }else{
                        var data = {
                            message:'下载失败,请重新下载'
                        };
                        $scope.$emit('alert',data);
                    }
                })
            }else{
                var data = {
                    message:'没有题目可供下载'
                };
                $scope.$emit('alert',data);
            }

        }
        $scope.$watch('filter.time',function(newValue,oldValue){
            if(newValue!=oldValue){
                $scope.filter.p = 0;
                $scope.groups=[];
                $scope.isLoaded = true;
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
        function loadUserWrongNote(){
            var year = $scope.termDate.year;
            var month= -1;
            if($scope.filter.time !="-1"){
                var ts = $scope.filter.time.split("-");
                year = ts[0];
                month = ts[1];
            }
            ReportService.getStudentWrongNote($scope.userId,$scope.activeSubjectId,$scope.termDate.term,year,month,$scope.filter.p,$scope.filter.ps).then(function(result){
                $scope.result = result;
                if(result.groups.length>0){
                    angular.forEach(result.groups,function(item,i){
                        if(result.groups[i]){
                            $scope.groups.push(result.groups[i]);
                        }
                    })
                    $scope.isLoaded = false;
                }else{
                    $scope.isLoaded = true;
                }
            },function(msg){
                console.log(msg);
            });
            
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
                    minTime = (new Date(str) ).getTime();
                    monthArr.push(minTime);
                }
            }else{
                if(month>0&&month<3){
                    termID='02';
                    term=(parseInt(year)-1)+termID;
                    for(var i= month;i>0;i--){
                        str=year+'/'+i;
                        minTime = (new Date(str) ).getTime();
                        monthArr.push(minTime);
                    }
                    for(var i= 12;i>=9;i--){
                        str=(parseInt(year)-1)+'/'+i;
                        minTime = (new Date(str) ).getTime();
                        monthArr.push(minTime);
                    }
                }else{
                    termID='02';
                    term=year+termID;
                    for(var i= month;i>=9;i--){
                        str=(parseInt(year)-1)+'/'+i;
                        minTime = (new Date(str) ).getTime();
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
    }]);
})