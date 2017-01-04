import app from 'app';
import 'services/ClassService';
import 'services/Toolkit';

/**
	 * 班级学生管理
	 */
export default app.controller('ClassManageController',['$scope','Toolkit','ClassService',function($scope,Toolkit,ClassService){
		
		$scope.params = Toolkit.serializeParams();
		
		
		$scope.classInfo = {};
		$scope.isShowDeleteBox = false;
		$scope.delStuInfo = {};
		$scope.isSelectAll = false;
		$scope.delStudentIds =[];
		
		$scope.allowJoin = true;
		
		$scope.isLoaded = false;
		
		$scope.alert = {
				error:false
		};
		
		/**
		 * 删除模式
		 * 1 单个删除
		 * 2 批量删除
		 */
		$scope.deleteMode = 1;
		ClassService.getClassInfoById($scope.params.classId).then(function(res){
			$scope.classInfo = res;
			$scope.allowJoin = (res.info.allowJoin == 1);
			
			$scope.isLoaded = true;
		},function(msg){
			
		});
		
		
		
		/**
		 * 删除单个学生
		 */
		$scope.deleteStudent = function(student){
			$scope.alert.message = "您确定要删除“"+student.userNickName+"”同学吗?";
			$scope.isShowDeleteBox = true;
			$scope.delStuInfo = student;
			$scope.deleteMode = 1;
		}


		
		/**
		 * 批量删除
		 */
		$scope.batchDel = function(){
			if($scope.delStudentIds.length<=0){
				return;
			}
			$scope.alert.message = "您确定要删除选中学生吗?";
			$scope.isShowDeleteBox = true;
			$scope.deleteMode = 2;
		}
		/**
		 * 处理对话框的两个按钮
		 */
		$scope.handleOption = function(isOk){
			if(isOk){
				var ids = [];
				if($scope.deleteMode ==1){
					ids.push($scope.delStuInfo.id);
				}else{
					ids=$scope.delStudentIds;
				}
				ClassService.removeUser($scope.params.classId,'student',ids,$scope.alert.pwd).then(function(count){
					$scope.isShowDeleteBox = false;
					$scope.alert.pwd = '';
					$scope.alert.error = false;
					$scope.alert.message = '';
					var selectedArr = [];
					if($scope.deleteMode ==1){
						selectedArr.push($scope.delStuInfo);
					}else{
						angular.forEach( $scope.classInfo.students,function(student){
							if(student.selected){
								selectedArr.push(student);
							}
						});
					}
					angular.forEach(selectedArr,function(student){
						var index = $scope.classInfo.students.indexOf(student);
						if(index > -1){
							$scope.classInfo.students.splice(index,1);
						}
					});
					$scope.delStudentIds.splice(0,$scope.delStudentIds.length);
					$scope.isSelectAll = false;
					
					//TODO 通知UserController更新学生数量
					$scope.classInfo.info.studentSize = $scope.classInfo.students.length;
					//$scope.alert.message = "删除成功！";
					//$scope.isShowTipBox = true;
					
					 var data={
		                        message:"删除成功！"
		             }
		            $scope.$emit('alert',data);
					
					
					
					var data = {};
					data.action = 'update';
					data.clazz = $scope.classInfo.info;
					$scope.$emit('updateClass',data);
				},function(msg){
                    /*var data={
                        message:msg
                    }
                    $scope.$emit('alert',data);
                    */
                    $scope.alert.error = true;
				});
			}else{
				$scope.alert.pwd = '';
				$scope.alert.error = false;
				$scope.isShowDeleteBox = false;
			}
			
		}
		
	
		
		/**
		 * 处理批量全选按钮
		 */
		$scope.changSelect = function(){
			var selected = !$scope.isSelectAll;
			angular.forEach($scope.classInfo.students,function(student){
				student.selected = selected;
				if(selected && $scope.delStudentIds.indexOf(student.id)<0){
					$scope.delStudentIds.push(student.id);
				}
			});
			
			if(!selected){
				$scope.delStudentIds.splice(0,$scope.delStudentIds.length);
			}
		}
		
		/**
		 * 处理单个复选框按钮
		 */
		$scope.changeSingle = function(student){
			if(!student.selected){
				$scope.isSelectAll = false;
				var index = $scope.delStudentIds.indexOf(student.id);
				if(index >-1){
					$scope.delStudentIds.splice(index,1);
				}
			}else{
				$scope.delStudentIds.push(student.id);
				if($scope.delStudentIds.length>=$scope.classInfo.students.length){
					$scope.isSelectAll = true;
				}
			}
		}
		
		
		/**
		 * 编辑学生姓名
		 */
		$scope.editStudent = function(student){
			student.rename = student.userNickName;
			student.editMode = true;
		}
		/**
		 * 更改学生学生姓名
		 */
		$scope.handleEditOption = function(student,isOk){
			if(isOk){
				ClassService.updateStudentName($scope.params.classId,student.id,student.rename).then(function(){
					student.userNickName = student.rename;
					student.editMode = false;
				},function(msg){
                    $scope.popMessage={
                        message:msg
                    }
                    var data = {
         				message : msg
         			};
         			$scope.$emit('alert',data);
				});
			}else{
				student.editMode = false;
			}
			
		}
		
		/**
		 * 是否允许学生加入
		 */
		$scope.changeSettings = function(){
			ClassService.allowJoin($scope.params.classId,$scope.allowJoin).then(function(){
				console.log("更改成功:"+$scope.allowJoin);
			},function(){
				$scope.allowJoin = !$scope.allowJoin;
			});
		}
	}]);