import app from 'app';
import 'services/UserService';
import 'services/ExerciseNoteService';
import 'services/DownloadExclService';

export default app.controller('NotesReportController',['$scope','$timeout','$filter','UserService','ExerciseNoteService','DownloadExclService',function($scope,$timeout,$filter,UserService,ExerciseNoteService,DownloadExclService){
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
                    term=parseInt(year)+termID;
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
                        str=parseInt(year)+'/'+i;
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
