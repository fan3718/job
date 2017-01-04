import app from 'app';
import 'services/ClassService';
import 'services/Toolkit';
/**
	 * 班级管理中心
	 * 
	 */
export default app.controller('ClassCenterController',['$scope','$location','ClassService','Toolkit',function($scope,$location,ClassService,Toolkit){
		
		$scope.shareUrl = 'http://www.baidu.com/';
		$scope.classes = [];
		
		
		
	
		
		$scope.isShare = false;
		/**
		 * 分享
		 * 0 分享给学生
		 * 1 分享给老师
		 */
		$scope.shareMode = 0;
		$scope.inviteClass = {};
		
		
		$scope.sharePlatform = 'all';
		
		
		
		$scope.subjectInfo = [
		                      {
		                    	  en:'math',
		                    	  ch:'数学'
		                      },{
		                    	  en:'phy',
		                    	  ch:'物理'
		                      },{
		                    	  en:'chemi',
		                    	  ch:'化学'
		                      },{
		                    	  en:'bio',
		                    	  ch:'生物'
		                      },{
		                    	  en:'ch',
		                    	  ch:'语文'
		                      },{
		                    	  en:'geo',
		                    	  ch:'地理'
		                      },{
		                    	  en:'en',
		                    	  ch:'英语'
		                      },{
		                    	  en:'politics',
		                    	  ch:'政治'
		                      },{
		                    	  en:'history',
		                    	  ch:'历史'
		                      }];
		
		
		if(angular.isDefined($scope.userInfo)){
			
		}else{
			
		}
		
		if(window.__INITIAL_CLASSES__){
			$scope.info = window.__INITIAL_USER__;
			var classes = window.__INITIAL_CLASSES__;
			angular.forEach(classes,function(info){
				
				info.className = info.name;
				info.classId = info.id;
				info.teachers = ClassService.processTeachers(info.teachers);
			});
			$scope.classes = classes;
		}else{
			$scope.$on("userinfo",function(event,info){
				$scope.info = info;
				$scope.classes = info.classes;
				angular.forEach($scope.classes,function(clazz){
					ClassService.getClassInfoById(clazz.classId,'teacher').then(function(res){
						clazz.teachers = res.teachers;
						clazz.isBoss = res.isBoss;
						clazz.stuCount = res.studentSize;
					},function(msg){
						
					});
				});
			});
		}
		$scope.delClassTeacherInfo = null;
		$scope.alert = {
				message:'',
				pwd:'',
				error:false
		};
		
		/**
		 * 删除老师
		 */
		$scope.deleteTeacher = function(clazz,teacher){
			if(clazz.isBoss && $scope.info.uid!=teacher.id){
				$scope.delClassTeacherInfo = {};
				$scope.delClassTeacherInfo.clazz = clazz;
				$scope.delClassTeacherInfo.teacher = teacher;
				$scope.alert.message = "您确定要删除"+teacher.nickName+"老师吗?";
				//弹出对话框
			
				$scope.isShowDeleteBox = true;
			}
		}
		
		$scope.handleOption = function(isOk){
			
			if(isOk && $scope.delClassTeacherInfo != null){
				$scope.alert.error = false;
				var clazz = $scope.delClassTeacherInfo.clazz;
				var teacher = $scope.delClassTeacherInfo.teacher;
				var ids = [];
				ids.push(teacher.id);
				ClassService.removeUser(clazz.classId,'teacher',ids,$scope.alert.pwd).then(function(){
					$scope.alert.pwd = '';
					$scope.isShowDeleteBox = false;
					var index = clazz.teachers.indexOf(teacher);
					if(index >-1){
						clazz.teachers.splice(index,1);
					}
				},function(msg){
					$scope.alert.error = true;
					/*$scope.isShowDeleteBox = false;
	                var data = {
							message:msg,
					};
					$scope.$emit('alert',data);
					*/
				});
			}else{
				$scope.alert.pwd = '';
				$scope.alert.error = false;
				$scope.isShowDeleteBox = false;
			}
		}
		/**
		 * 邀请老师
		 */
		$scope.invite = function(clazz,mode){
			$scope.isShare = true;
			$scope.inviteClass = clazz;
			$scope.shareMode = mode;
		}
		
		
		$scope.closeInvite = function(){
			$scope.isShare = false;
			$scope.sharePlatform='all';
		}
		
		$scope.share = function(platform){
			
			var domain = [];
			var protocol = $location.protocol();
			domain.push(protocol);
			domain.push('://');
			var host = $location.host();
			domain.push(host);
			var port = $location.port();
			
			if(port !='' && port != '80'){
				domain.push(':');
				domain.push(port);
			}
			if($scope.shareMode == 0){
				domain.push('/wap/account/student/regist?');
				domain.push('classNumber='+$scope.inviteClass.classNumber);
			}else{
				//domain.push('/wap/account/teacher/regist');
			}
			
			
			$scope.shareUrl =domain.join('');
				
			if('qzone' == platform){
				shareToQzone();
			}else if('qq' == platform){
				shareToQQ();
			}else{
				$scope.sharePlatform=platform;
			}
			
		}
		
		function shareToQQ(){
			$scope.closeInvite();
			var desc = '我是'+$scope.userInfo.nickName+'老师，现在邀请你加入云测练'+$scope.inviteClass.className+'，班号'+$scope.inviteClass.classNumber+'，可以完成作业并查看报告。';
			if($scope.shareMode != 0){
				desc = '我是'+$scope.userInfo.nickName+'老师，现在邀请你使用云测练，一分钟布置作业，还能自动批改并给出报告。';
			}
			var p = {
				url:$scope.shareUrl,
				desc:desc,/*默认分享理由(可选)*/
				summary:desc,/*分享摘要(可选)*/
				title:'【邀请】加入'+$scope.inviteClass.className,/*分享标题(可选)*/
				site:'云测练',/*分享来源 如：腾讯网(可选)*/
				pics:Toolkit.getDomain()+'/img/logo-512.png', /*分享图片的路径(可选)*/
				};
				var s = [];
				for(var i in p){
				s.push(i + '=' + encodeURIComponent(p[i]||''));
			}
			window.open("http://connect.qq.com/widget/shareqq/index.html?"+s.join('&'));
		}
		
		function shareToQzone(){
				$scope.closeInvite();
				var desc = '我是'+$scope.userInfo.nickName+'老师，现在邀请你加入云测练'+$scope.inviteClass.className+'班级，班号'+$scope.inviteClass.classNumber+'，可以完成作业并查看报告。';
				if($scope.shareMode != 0){
					desc = '我是'+$scope.userInfo.nickName+'老师，现在邀请你使用云测练，一分钟布置作业，还能自动批改并给出报告。';
				}
				var p = {
					url:$scope.shareUrl,
					showcount:'1',/*是否显示分享总数,显示：'1'，不显示：'0' */
					desc:desc,/*默认分享理由(可选)*/
					summary:desc,/*分享摘要(可选)*/
					title:'【邀请】加入'+$scope.inviteClass.className+'班',/*分享标题(可选)*/
					site:'云测练',/*分享来源 如：腾讯网(可选)*/
					pics:Toolkit.getDomain()+'/img/logo-512.png', /*分享图片的路径(可选)*/
					};
					var s = [];
					for(var i in p){
					s.push(i + '=' + encodeURIComponent(p[i]||''));
				}
				window.open("http://sns.qzone.qq.com/cgi-bin/qzshare/cgi_qzshare_onekey?"+s.join('&'));
				//window.location.href="http://sns.qzone.qq.com/cgi-bin/qzshare/cgi_qzshare_onekey?"+s.join('&');
				
		}
		
		
	}]);