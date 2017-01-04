import app from 'app';
import layer from 'layer-dialog';

import 'services/ResourceService';
import 'services/CacheService';
import 'services/VideoHelper';
import 'directives/ng-chapter-treeview';
import 'directives/ng-pagination';

export default app.controller('ResourceController',['$scope','$window','$timeout','ResourceService','CacheService','VideoHelper', function($scope,$window,$timeout,ResourceService,CacheService,VideoHelper){
        $scope.books = [];
        $scope.gradeId = -1;
        $scope.chapterTree = [];
        $scope.cates = [];
        $scope.selCate = null,
        // 1 同步教材 2 知识点
        $scope.showType = 1;
        $scope.showChapter = false;
        $scope.videos = [];
        $scope.hasChosenGrade  = false;
        $scope.showShareVideoBox = false;
        $scope.searchVal = '';
        $scope.resCount = 0;
        $scope.switcher = {
            showChapter:false,
            hasChosenGrade:false,
            showMaterial:true,
            hasOldMaterial:false
        };
        $scope.select = {
            grade: null,
            book: null,
            chapter: null,
            knowledge : null,
            cates: null,
        };
        $scope.subject = 20 ;

        $scope.currentPage = 1;

        $scope.showSelStage = false;
        
        $scope.orderField = 'upload_time' ;       

        $scope.IsPreview = false ;
        // 加载一级分类标签
        listCates();
        $scope.isLoaded = false;
        $scope.$on('userinfo',function(event,info){
            $scope.userInfo = info;
            var oldMaterial = CacheService.get('material-'+info.uid);
            if(angular.isDefined(oldMaterial)&&oldMaterial!=null){
                $scope.switcher.hasOldMaterial = true;
                $scope.switcher.hasChosenGrade = true;
                $scope.switcher.showMaterial = false;
                $scope.switcher.showChapter  = true;
                $scope.select.book = oldMaterial.book;
                $scope.select.grade = oldMaterial.grade;
                console.info($scope.select.grade)
                if (oldMaterial.grade.name=='全部') {
                    $scope.toggleMaterial()
                } else {
                    loadChapterTree();
                }
            }

            var stage = info.stage ;
            var obj = {} ;
            stage.forEach(function(item,index){
                obj[item] = true;
            });
            $scope.stage = [] ;
            for(var i in obj ){  
                $scope.stage.push(i);  
            } 
            $scope.selStage = $scope.stage[0];
            $scope.userRole = $scope.userInfo.role;
            var subjectMap = {
            		'1':[{code:'14','name':'语文'},{code:'10','name':'数学'},{code:'16','name':'英语'}],
            		'2':[{code:'24','name':'语文'},
            		     {code:'20','name':'数学'},
            		     {code:'26','name':'英语'},
            		     {code:'21','name':'物理'},
            		     {code:'22','name':'化学'}
            		     /*{code:'23','name':'生物'},
            		     
            		     {code:'25','name':'地理'},
            		     
            		     {code:'27','name':'政治'},
            		     {code:'28','name':'历史'}*/
            		     ],
            		'3':[{code:'34','name':'语文'},
            		     {code:'30','name':'数学'},
            		     {code:'36','name':'英语'},
            		     {code:'31','name':'物理'},
            		     {code:'32','name':'化学'}
            		     /*{code:'33','name':'生物'},
            		     {code:'35','name':'地理'},
            		     {code:'37','name':'政治'},
            		     {code:'38','name':'历史'}*/
            		     ]
            }
            if ($scope.userRole =='student') {
            	$scope.subjects = subjectMap[$scope.selStage];
            	$scope.subject = parseInt($scope.subjects[0]['code']);
            } else {
            	$scope.subject = parseInt($scope.selStage+$scope.userInfo.subject[0]['code'])|| 20;
            }
            
            $scope.showSelStage = false ;
            loadBooks();
            loadKnowledges();
        });
        
        $scope.clearSearchVal = function () {
            $scope.searchVal = '' ;
        }

        $scope.changeShowSelStage = function () {
            $scope.showSelStage = !$scope.showSelStage;
            $scope.isLoaded = false;
        }

        $scope.changeStage = function (stage) {
            $scope.selStage = stage;
            $scope.subject = parseInt($scope.selStage+$scope.userInfo.subject[0]['code']);
            $scope.showSelStage = false;
            $scope.clearSearchVal();
            loadBooks();
            loadKnowledges();
        }
        
        $scope.changeSubject = function (code){
        	$scope.subject = parseInt(code);
        	$scope.showSelStage = false;
        	$scope.isLoaded = false;
        	loadBooks();
            loadKnowledges();
        }

        $scope.toggleMaterial = function(){
            $scope.switcher.showMaterial = !$scope.switcher.showMaterial ;
        }
        /**
         * 更改左边导航展示
         */
        $scope.changeShowType = function(showType){
            $scope.showType = showType;
            $scope.select.chapter = null ;
            $scope.select.knowledge = null ;
            $scope.isLoaded = false;
            initSearch();
        }
        /**
         * 改变年级
         */
        $scope.changeGrade = function(book,grade){
            $scope.switcher.showChapter = true;
            $scope.switcher.showMaterial = false;
            $scope.switcher.hasChosenGrade = true;
            //保存选中的book 和grade
            var material = {};
            material.book = book;
            material.grade = grade;
            CacheService.put('material-'+$scope.userInfo.uid,material);
            $scope.select.book = book;
            $scope.select.grade = grade;
            $scope.isLoaded = false;
            if (grade.name=='全部') {
               $scope.switcher.showMaterial = false;
               $scope.switcher.showChapter = false;
               $scope.select.chapter = null;
            } else {
                loadChapterTree();
            }
            initSearch();
        }

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
            });
            window.download_file_iframe.src = '/teaching/resource/download?code=' + item.code; 
            item.download_num = item.download_num + 1
            window.download_file_iframe.style.display = "none";
            var resultDes = 'success';
            ResourceService.downloadRecods(2,item.content.title,window.download_file_iframe.src,resultDes,item.download_num);
        }

        /**
         * 取消或者收藏资源
         */
        $scope.collectRes = function (item) {
            if(item.favorite_flag) {  
                // 取消
                ResourceService.disCollectResource(item.code,$scope.subject).then(function(data){
                    layer.alert('已取消收藏~',{
                        title:'取消收藏'
                    })
                    item.favorite_num -1 > 0 ? item.favorite_num = item.favorite_num -1 : 0 ;
                });
            } else {
                ResourceService.collectResource(item.code,$scope.subject).then(function(data){
                    layer.alert('收藏成功，你可以到个人中心查看收藏记录哦~',{
                        title:'收藏'
                    })
                    item.favorite_num = item.favorite_num + 1 ;
                });
            }
            item.favorite_flag =  !item.favorite_flag;
        }
        

        $scope.isLabelChecked=function(book,grade){
            $scope.isRadioChecked =  $scope.select.grade.code== grade.code && $scope.select.book.code== book.code; 
            return  $scope.select.grade.code== grade.code &&  $scope.select.book.code==book.code;
        }

        $scope.changeOrderField = function (str) {
            $scope.orderField  =  str ;
            search(true);
        }

        /**
         * 点击章节
         */
        $scope.changeChapter = function(chapter){
            $scope.select.chapter = chapter 
            $scope.isLoaded = false;
            initSearch()
        }

        /**
         * 点击知识点
         */
        $scope.changeKnowledge = function(knowledge){
             $scope.select.knowledge = knowledge 
             $scope.isLoaded = false;
             initSearch()
        }
        
        /**
         * 改变一级分类标签
         */
        $scope.changeCate = function(cate){
            $scope.selCate = cate 
            $scope.isLoaded = false;
            search(true);
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
                /*ResourceService.preview(item.code).then(function(data){
                    layer.open({
                        type: 2,
                        title: '预览页面',
                        shadeClose: false,
                        shade: 0.6,
                        maxmin: true, //开启最大化最小化按钮
                        move:false,
                        area: ['1000px', '620px'],
                        content: ['/html/preview.html','no'],
                        success:function(layero, index){
                            var  iframeWin = window[layero.find('iframe')[0]['name']];
                            item.view_num =  item.view_num + 1 
                            iframeWin.previewDoc(data);
                        },
                        cancel:function(){
                           $scope.IsPreview = false ;
                        }
                    });
                });*/
            }
            item.view_num = item.view_num + 1
        }

        $scope.gradeHover = function (obj) {
            obj.isHover = true;
        }

        $scope.gradeLeave = function (obj) {
            obj.isHover = false;
        }

        $scope.isShowDownload = function (title) {
            if (title.lastIndexOf('.') == -1) {
                return false;
            } else {
                return true;
            }
        }

        $scope.searchByKeyworkd = function () {
            search(true);
        }

        $scope.changePage = function (page) {
            $scope.currentPage = page ;
            search()
        }

        function initSearch () {
            $scope.selCate = $scope.cates[0];
            $scope.searchVal = '' ;
            search(true);            
        }

        function loadBooks(){
            ResourceService.loadBooks($scope.subject).then(function(books){
                $scope.books = books;
                if(!$scope.switcher.hasOldMaterial){
                    if(!isArrayEmpty(books) && !isArrayEmpty(books[0].grades)){
                        $scope.select.book = books[0];
                        $scope.select.grade = books[0].grades[0];
                        search(true);
                        loadChapterTree();
                    }
                }else {
                    material =  CacheService.put('material-'+$scope.userInfo.uid);
                    $scope.select.book = material.book;
                    $scope.select.grade = material.grade;
                }
            });
        }
        
        function loadChapterTree(){
            ResourceService.loadChapterTree($scope.subject,$scope.select.grade.code).then(function(tree){
                $scope.chapterTree = tree;
            },function(){
                
            });
        }

        function loadKnowledges(){
            ResourceService.loadKnowledgeTree($scope.subject).then(function(tree){
                $scope.knowledgeTree  = tree;
            });
        }

        function listCates() {
            ResourceService.listCates().then(function(cates){
            	var tmp = [] ;
                if($scope.userInfo.role == 'student'){
                	tmp = cates.filter(function(item){
                		return  item['top_cate_name'] != '教案';
                	}).reverse();
                }else{
                	tmp = cates;
                }
                tmp.unshift({"top_cate_code":"-1","top_cate_name":"全部"})
                $scope.cates = tmp;
                $scope.selCate = tmp[0];
            });
        }
        /**
        * 查询资源
        */
        function search(isInitPage){
            var data = {} ;
            data["cate"] = $scope.selCate && $scope.selCate.top_cate_code ? $scope.selCate.top_cate_code : '-1';
            data["subject"] = $scope.subject ;
            data["orderfield"] = $scope.orderField;
            if ($scope.showType ==1) {
                data["sourceType"] =  2
                if ($scope.select.book && $scope.select.book.code) {
                    if ( $scope.select.book.code == -1) {   
                        data["bookCode"] = ''
                    } else {
                        data["bookCode"] = $scope.select.book.code
                    }
                } else {
                    data["bookCode"] = ''
                }
                if ($scope.select.chapter && $scope.select.chapter.ID) {
                    data["portfolioId"] = $scope.select.chapter.ID
                }
                if ($scope.select.grade && $scope.select.grade.code) {
                    if ($scope.select.grade.code == -1) {
                        data["gradeCode"] = ''
                    } else {
                        data["gradeCode"] = $scope.select.grade.code
                    }
                }else{
                   data["gradeCode"] = '' 
                } 
               
            } else {
                data["sourceType"] =  1
                if ($scope.select.knowledge && $scope.select.knowledge.ID) {
                    data["portfolioId"] = $scope.select.knowledge.ID;
                }
                
            }
            data["order"] = 1;
            data["keyword"] = window.encodeURIComponent($scope.searchVal);
            isInitPage ? data["page"] = 1 : data["page"] = $scope.currentPage ;

            ResourceService.search(data).then(function(res){
            	$scope.isLoaded = true;
                $scope.res = res.results; 
                if (isInitPage) {
                    $scope.currentPage  = 1 ;
                    $scope.resCount = res.count;
                }
            });
        }

        /**
         *  数组非空
         */
        function isArrayEmpty(obj){
            return obj ==null || obj.length <=0;
        }
        
        $scope.isDefined = function(obj){
            return angular.isDefined(obj) && obj != '' && obj !=null;
        }

    }]);