import app from 'app';

import 'services/UserService';
import 'services/ReportService';

export default app.controller('MarkReportController',['$scope','$timeout','$filter','UserService','ReportService',function($scope,$timeout,$filter,UserService,ReportService){
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
    }]);