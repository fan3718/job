
import app from 'app';
import './HttpClient';
import './Toolkit';


    
export default    app.factory('ExerciseNoteService',['$q','$http','$filter','HttpClient','Toolkit',function($q,$http,$filter,HttpClient,Toolkit){
        $http.defaults.headers.common['X-TECHU-AUTH'] = Toolkit.getCookie("safeToken");
        var PREFIX_URL = "/ajax/wrongrecord";
        var service = {
                /**
                 * 获取学生的错题本学科
                 * @param studentId  学生uid
                 * @param subjectId 学科id
                 */
                getNoteSubject:function(uid){
                    var defer = $q.defer();
                    HttpClient.get(PREFIX_URL+'/subjects?uid='+uid).success(function(result){
                        if(result.code==1)  {
                            defer.resolve(result);
                        }else{
                            defer.reject(result.msg);
                        }
                    }).error(function(){
                        defer.reject("服务器内部错误");
                    });
                    return defer.promise;
                },
                /**
                 * 获取学生某个学期的错题本数据
                 * @param studentId  学生id
                 * @param subjectId 学科id
                 * @param term 学期
                 * @param year 年
                 * @param month 月 -1 表示全部
                 * @param page 页码
                 * @param pageSize 每次加载条数
                 */
                getStudentWrongNote:function(studentId,subjectId,term,year,month,page,pageSize){
                    var params = {};
                    params.uid = studentId;
                    params.subjectId = subjectId;
                    params.term = term;
                    var now = new Date();
                    params.year = year || now.getFullYear();
                    params.month = month || -1;
                    params.page = page || 0;
                    params.pageSize = pageSize || 20;
                    var defer = $q.defer();
                    HttpClient.post(PREFIX_URL+'/wrong/note',params).success(function(result){
                        if(result.code ==1){
                            var info = {};
                            //对数据进行分组处理
                            var questions = [];
                            var item = null;
                            var key = '';
                            angular.forEach(result.questions,function(question){
                                var time = $filter('date')(question.assignTime,'yyyy/MM/dd');
                                if(time != key){
                                    key = time;
                                    item = {};
                                    item.date = time;
                                    item.quests = [];
                                }
                                item.quests.push(question);
                                if(questions.indexOf(item)<=-1){
                                    questions.push(item);
                                }
                            });
                            info.groups = questions;
                            info.totalNumber = result.totalNumber;
                            info.wrongCount = result.wrongCount;
                            info.assignCount = result.assignCount;
                            info.exerciseCount = result.questions.length;
                            defer.resolve(info);
                        }else{
                            defer.reject(result.msg);
                        }
                    }).error(function(){
                        defer.reject("服务器内部错误");
                    });
                    return defer.promise;
                },

                loadQuestions:function(knowladgeIds,subjectCode,type,qid){
                    var defer = $q.defer();
                    var promise = defer.promise;
                    var params = {};
                        if(knowladgeIds != ""){
                            params["knowladgeIds"] = knowladgeIds;
                        }
                        params["subjectCode"] = subjectCode;
                        params["type"] = type;
                        if(type == '100'){
                            params["originQid"] = qid;
                        }
                    HttpClient.post(PREFIX_URL+'/getExercise',params).success(function(result){
                        if(result.code == 1){
                            defer.resolve(result);
                        }else{
                            defer.reject(result.msg);
                        }
                    }).error(function(){
                        defer.reject('网络发生故障');
                    });
                    return defer.promise;
                },
                getExerciseReport:function(id){
                    var defer = $q.defer();
                    var promise = defer.promise;
                    var params = {exerciseID:id};
                    HttpClient.post(PREFIX_URL+'/viewReport',params).success(function(result){
                        if(result.code == 1){
                            defer.resolve(result);
                        }else{
                            defer.reject(result.msg);
                        }
                    }).error(function(){
                        defer.reject('网络发生故障');
                    });
                    return promise;
                },
                getAllReport:function(originQid,type,subjectCode){
                    var defer = $q.defer();
                    var promise = defer.promise;
                    var params = {};
                    params["originQid"] = originQid;
                    params["type"] = type;
                    params["subjectCode"] = subjectCode;
                    HttpClient.post(PREFIX_URL+'/viewWholeReport',params).success(function(result){
                        if(result.code == 1){
                            defer.resolve(result);
                        }else{
                            defer.reject(result.msg);
                        }
                    }).error(function(){
                        defer.reject('网络发生故障');
                    }); 
                    return promise;
                },
                getConsolidateReport:function(type,subjectCode,time){
                    var defer = $q.defer();
                    var promise = defer.promise;
                    var params = {};
                    params["type"] = type;
                    params["subjectCode"] = subjectCode;
                    params["practiceTimes"] = time;
                    HttpClient.post(PREFIX_URL+'/viewReportByTimes',params).success(function(result){
                        if(result.code == 1){
                            defer.resolve(result);
                        }else{
                            defer.reject(result.msg);
                        }
                    }).error(function(){
                        defer.reject('网络发生故障');
                    }); 
                    return promise;
                },
                loadExerciseDetail:function(cate,subjectCode,knowledgeList,page,pageSize){
                    var defer = $q.defer();
                    var promise = defer.promise;
                    var params = {};
                    params.categoryId = cate || '';
                    params.knowledgeList = knowledgeList;
                    params.subjectCode = subjectCode;
                    params.p = page || 0;
                    params.ps = pageSize || 20;
                    HttpClient.post(PREFIX_URL+'/readKnowledge',params).success(function(result){
                        if(result.code == 1){
                            defer.resolve(result);
                        }else{
                            defer.reject(result.msg);
                        }
                    }).error(function(){
                        defer.reject('网络发生故障');
                    });
                    return promise;
                }
        };
        return service;
    }]);