
import app from 'app';
import './Toolkit';

export default app.factory('DownloadExclService',['$q','$http','$timeout','Toolkit',function ($q,$http,$timeout,Toolkit) {
        $http.defaults.headers.common['X-TECHU-AUTH'] = Toolkit.getCookie("safeToken");
        var service={
            downloadExcl:function (params,userID) {
                var defer = $q.defer();
                var suffixes = params["subject"].substr(1);
                if(suffixes=='4' || suffixes=='6'){
                    params["source"] = 0;
                }
                $http.defaults.headers.common['userID'] = userID;
                $http.post('/paper/',params).success(function (result) {
                    if(result['id']){
                        result['code']=1;
                        defer.resolve(result);
                    }else{
                        defer.reject(result);
                    }
                }).error(function (result,status) {
                    if(status == 429){
                        defer.resolve(status);
                    }else{
                        defer.reject('网络异常!');
                    }
                })
                return defer.promise;
            },
            pushChannel:function (data) {
                var defer = $q.defer();
                var type =  data.downloadType;
                var subjectCode = data.subject;
                $http.get('/download/channel?downloadType='+type+'&subjectCode='+subjectCode).success(function(result){
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
            getFilePath:function (data) {
                var defer = $q.defer();
                var timer = '';
                var downLoadNum=0;
                getPath();
                function getPath() {
                    $http.get('/paper/'+data.id+'/').success(function (result) {
                        if(result['filepath']!=undefined){
                            if(result['filepath']!=""){
                                if(timer!=''){
                                    $timeout.cancel(timer);
                                }
                                var res = {};
                                res.postCode=data.postCode;
                                res.code=1;
                                res.filePath=result['filepath'];
                                defer.resolve(res);
                                if(roleID == 3){
                                    // 推送渠道平台数据
                                    service.pushChannel(data);
                                }
                            }else{
                                downLoadNum++;
                                if(downLoadNum>120){
                                    defer.resolve('后台处理时间超时!');
                                }else{
                                    timer=$timeout(getPath,1000);
                                }
                            }
                        }else{
                            defer.reject('返回数据错误!');
                        }
                    }).error(function () {
                        defer.reject('网络异常!');
                    });
                }
                return defer.promise;
            }
        };
        return service;
    }]);
