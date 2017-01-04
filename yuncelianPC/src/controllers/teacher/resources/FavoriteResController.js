import app from 'app';
import layer from 'layer-dialog';
import 'services/ResourceService';
import 'services/VideoHelper';

export default app.controller('FavoriteResController',['$scope','ResourceService','VideoHelper',function($scope,ResourceService,VideoHelper){
        $scope.favoritesRes = [];
        $scope.res = [];
        $scope.resCount = 0;
        $scope.currentResPage = 1;

        loadResource(true);

        /**
         * 下载资源
         */
        $scope.download = function (item) {
            if(typeof(window.download_file_iframe)== "undefined"){
                var iframe = document.createElement("iframe");
                window.download_file_iframe = iframe 
                document.body.appendChild(window.download_file_iframe); 
            }
            layer.alert('资源正在下载中，稍后可在下载结果查看',{
                title:'下载'
            })
            window.download_file_iframe.src = '/teaching/resource/download?code=' + item.code; 
            item.download_num = item.download_num + 1
            window.download_file_iframe.style.display = "none";
            var resultDes = 'success';
            ResourceService.downloadRecods(2,item.content.title,window.download_file_iframe.src,resultDes,item.download_num);
            
        }

        /**
         * 取消或者收藏资源
         */
        $scope.collectRes = function (code) {
            var index = layer.confirm('确定要将该试卷从收藏中取消？', {
              btn: ['确定','取消'] ,//按钮,
              title:'取消收藏'
            }, function(){
                var favor = findFavor(code)
                if (favor){
                    ResourceService.disCollectResource(code,favor.subjectCode).then(function(data){
                        loadResource(true);
                        layer.close(index);
                    });
                } else {
                    layer.close(index);
                }
            });
        }

        $scope.isShowDownload = function (title) {
            if (title.lastIndexOf('.') == -1) {
                return false;
            } else {
                return true;
            }
        }

        $scope.isShowDownloadNum = function (title) {
            if (title.lastIndexOf('.') >0) {
                return true;
            } else {
                return false;
            }
        }

        $scope.isNew = function (uploadTime) {
            var now = new Date() ;
            var upload = new Date(uploadTime);
            var diffDay = (now.getTime()- upload.getTime()) / (1000*60*60*24) ;
            if (diffDay <= 30) {
                return true;
            } else {
                return false;
            }
        }

        $scope.isHot = function (viewNum) {
            if (viewNum >= 30 ) {
                return true;
            } else {
                return false;
            }
        }

        /**
        * 预览
        */
        $scope.preview = function (item,title) { 
            var index = title.lastIndexOf('.') ;
            $scope.scrollTop = $(document).scrollTop();
            if (index == -1) { // 视频资源
                var videoUrl = item.content.video
                if(angular.isUndefined(videoUrl)||videoUrl==''){
                    videoUrl = item.content.html;
                }
                var index = VideoHelper.isSharedUrl(videoUrl);
                if(index>-1){
                    var videoParams = VideoHelper.getIFrameUrl(videoUrl,index);
                    if(typeof(videoParams)=='object'){ 
                        $scope.videoUrl = videoParams.url ;
                    } else {
                        $scope.videoUrl = videoParams;
                    }
                } else {
                    $scope.videoUrl = videoUrl;
                }
                var iTop = (window.screen.availHeight - 30 - 620) / 2; 
                //获得窗口的水平位置 
                var iLeft = (window.screen.availWidth - 10 - 1000) / 2; 
                window.open($scope.videoUrl,'video','width='+1000+',height='+620+',top='+iTop+',left='+iLeft+',toolbar=no, menubar=no, scrollbars=no, resizable=no');
            } else {
                 //获得窗口的垂直位置 
                var iTop = (window.screen.availHeight - 30 - 620) / 2; 
                //获得窗口的水平位置 
                var iLeft = (window.screen.availWidth - 10 - 1000) / 2; 
                window.open('/html/preview.html?code='+item.code,'swf','width='+1000+',height='+600+',top='+iTop+',left='+iLeft+',toolbar=no, menubar=no, scrollbars=no, resizable=no');
            }
            item.view_num = item.view_num + 1
        }

        $scope.changeResPage = function (page) {
            $scope.currentResPage = page ;
            loadResource()
        }

        function findFavor(code) { 
            var tmp = $scope.favoritesRes.filter(function(item,index){
                return  item.targetId === code
            });
            if (tmp.length>0){
                return tmp[0]
            } else {
                return null;
            }
        }

        function loadResource(isInitPage){
            var data = {
                p: $scope.currentResPage-1,
                ps: 15
            }
            ResourceService.listFavorite(data).then(function(info){
                
                $scope.favoritesRes = info.favorites;
                if (info.favorites.length >0) { 
                    var orderRes = [] ;
                    info.favorites.forEach(function (item,index){
                        for (var i =0 ;i < info.details.length; i ++ ) {
                            if (item.targetId === info.details[i]["code"]) {
                                orderRes.push(info.details[i]) ;
                                continue;
                            }
                        }
                    });
                    $scope.res = orderRes
                }else {
                	$scope.res = []
                }

                if (isInitPage) {
                    $scope.currentResPage  = 1 ;
                    $scope.resCount = info.count;
                }
                
            },function(msg){

            });
        }
    }]);