import app from 'app';
import layer from 'layer-dialog'
import 'services/ExamService'
import 'services/MaterialService'
import 'services/Toolkit';
import 'services/DownloadExclService';
import 'services/ResourceService';

export default app.controller('FavoriteController',['$scope','ExamService','MaterialService','Toolkit','DownloadExclService','ResourceService',function($scope,ExamService,MaterialService,Toolkit,DownloadExclService,ResourceService){
		
		$scope.favorite = {

		};
		
		$scope.group = []
		$scope.subjectCode = '' ;
		
		$scope.currentExamPage = 1;
		
		$scope.isShow = true ;
		// 1:试卷收藏 2: 资源收藏
		$scope.currentType = 1
		loadFavoritePapers(true);
		$scope.changeType = function (type) {
			$scope.currentType = type;
		}

		$scope.leftNav = function(action){
			if('center' == action){
				window.location.href="/user/center";
			}else if('account' == action){
				window.location.href="/user/account";
			}else if("favor" == action){
				window.location.href="/user/paperFavor";
			}else if("download" == action){
				window.location.href="/teacher/downloadRecords";
			}
		}


		$scope.showAnalysis = function(question){
			question.showAnalysis = !question.showAnalysis;
		}
		$scope.isDefined = function(obj){
			return angular.isDefined(obj) && obj !=null && obj!='';
		}
		$scope.getAnswer = function(index){
			return $filter('charCode')(index);
		}
		
		/**
		 * 收藏的试卷分页切换方法
		 */
		$scope.changeResPage = function (page) {
            $scope.currentExamPage = page ;
            loadFavoritePapers()
        };
		
		/**
		 * 取消试卷收藏
		 */
		$scope.removeFavorPaper = function (paper) {
			ExamService.removeFavorPaper(paper.id, paper.subjectCode).then(function (info){
				layer.alert('已取消收藏~',{
                    title:'取消收藏'
                });
				loadFavoritePapers(true);
			}, function (){});
		}
		
		var downLoadFlag=true;
		/**
		 * 下载试卷
		 */
        $scope.downLoad=function (paper) {
        	if(downLoadFlag){
        		downLoadFlag = false;
	            var downLoadData={};
				downLoadData['subject']=$scope.subjectCode;
				downLoadData['filetype']=1;
				downLoadData['source']=1;
				downLoadData['paper']={};
				downLoadData['paper']['title']=paper.title;
				downLoadData['paper']['group']=$scope.group;

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
                                    ResourceService.downloadRecods(result.downloadType,downLoadData['paper']['title'],res['filePath'],'success');
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
                    message:'下载正在进行中，请稍候'
                };
                $scope.$emit('alert',data);
            } 
            
        }
		
		
		function loadFavoritePapers(isInitPage){
			var data = {
	            p: $scope.currentResPage-1,
	            ps: 15
	        }
			ExamService.getFavoritePaper(data.p, data.ps).then(function(result){
				$scope.favorite =result;
				if (isInitPage) {
                    $scope.currentExamPage  = 1 ;
                    $scope.examCount = result.count;
                }
			},function(){

			});
		}

		
		$scope.loadPaperDetail = function(paper){
			$scope.isShow = false ;


			ExamService.getDetailById(paper.id,paper.subjectCode).then(function(info){
				$scope.paper = info;
				$scope.subjectCode  = paper.subjectCode ;
				//循环加载每道题的详情
				angular.forEach($scope.paper.groupTypes,function(info){
					var obj = {
						'title':info.title,
						'qids':[]
					}
					angular.forEach($scope.paper.questionTable[info.title],function(question){
						obj.qids.push(question.id);
						loadQuestionInfo(question,paper.subjectCode);
						
					});
					$scope.group.push(obj);
					obj = null;
				});
			},function(){

			});

		}
		/**
		 * 加载每道题的详情
		 */
		function loadQuestionInfo(quest,subjectCode){
			MaterialService.getQuestionById(quest.id,subjectCode).then(function(info){
				quest.isLoaded = true;
				//绑定数据
				for(var key in info){
					quest[key] = info[key];
				}
			},function(msg){

			});
		}

		

	}]);
