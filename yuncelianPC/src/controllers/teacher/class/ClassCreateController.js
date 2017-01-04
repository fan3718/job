import app from 'app';
import 'services/ClassService';
import 'services/Toolkit';

app.config(['$stateProvider','$urlRouterProvider',function($stateProvider, $urlRouterProvider){
	$stateProvider.state('step1',{
	 	url:'/step1',
	 	templateUrl:require('tpls/class/create/first.html'),
 	})
 	.state('step2',{
		url:'/step2',
		templateUrl:require('tpls/class/create/second.html'),
 	})
 	.state('step3',{
		url:'/step3',
		templateUrl:require('tpls/class/create/third.html'),
 	})
 	.state('step4',{
		url:'/step4',
		templateUrl:require('tpls/class/create/forth.html'),
 	})
 	.state('step5',{
		url:'/step3-1',
		templateUrl:require('tpls/class/create/join.html'),
 	});
	$urlRouterProvider.otherwise('/step1');     //匹配所有不在上面的路由

}]);

app.controller('ClassCreateController',['$scope','$location','$state','$timeout','$filter','ClassService','CacheService','Toolkit',function($scope,$location,$state,$timeout,$filter,ClassService,CacheService,Toolkit){
	
	var url = $location.absUrl();
	
	var isJoin = url.indexOf('join') >-1;
	
	$scope.grades=[
	               [],
	               [
	                	{
	                		id:1,
	                		name:'一年级'
	                	},{
	                		id:2,
	                		name:'二年级'
	                	},{
	                		id:3,
	                		name:'三年级'
	                	},{
	                		id:4,
	                		name:'四年级'
	                	},{
	                		id:5,
	                		name:'五年级'
	                	},{
	                		id:6,
	                		name:'六年级'
	                	}
	               ],[
	                  {
	                	  id:1,
	                	  name:'初一'
	                  },{
	                	  id:2,
	                	  name:'初二'
	                  },{
	                	  id:3,
	                	  name:'初三'
	                  }/*,{
	                	  id:4,
	                	  name:'初四'
	                  }*/
	               ],[
	                  	{
	                  		id:'1',
	                  		name:'高一'
	                  	},{
	                  		id:'2',
	                  		name:'高二'
	                  	},{
	                  		id:'3',
	                  		name:'高三'
	                  	}
	                ]
	
	];
	
	$scope.alert = {
			show:false,
			msg:''
	};
	var defaultForm = {
			stage:1,
			classes:[],
			defineName:''
	};
	
	$scope.form = defaultForm;
	
	$scope.createResult = {};
	
	$scope.defaultClasses = [];
	$scope.existing = [];
	
	$scope.joinClasses = [];
	
	for(var i=1;i<=24;i++){
		var item = {};
		item.code = i;
		item.name=i+"班";
		item.type=0;
		item.selected=isClassChecked(i);
		$scope.defaultClasses.push(item);
	}
	
	
	$scope.choseStage=function(stage){
		$scope.form.stage=stage;
		$state.go('step2');
	}
	
	
	
	$scope.createClass = function(){
		if($scope.form.classes.length <= 0 ){
			return;
		}
		var params = {};
		params.stage = $scope.form.stage;
		params.grade = $scope.form.grade.id;
		
		var classNames = [];
		angular.forEach($scope.form.classes,function(classInfo){
			classNames.push(classInfo.name);
		});
		
		params.classNameStr = classNames.join(',');
		
		
		
		ClassService.createAndCheckedJoin(params).then(function(result){
			
			//CacheService.remove('class-form');
			
			$scope.createResult = result;
			
			//更新本地UserInfo缓存
			//$scope.form.classes = [];
			angular.forEach($scope.form.classes,function(clazz){
				clazz.selected = true;
			});
			var classes = result.classes;
			
			$scope.existing = [];
			
			if(classes.length >0){
				//异步形式
				//$timeout(function(){
				notifyUpdate(classes);
				//},0);
			}
			
			var existing = result.existing;
			if(angular.isDefined(existing) && existing.length>0){ //需要跳转step4
				
				angular.forEach($scope.createResult.existing,function(clazz){
					clazz.selected = true;
					$scope.existing.push(clazz);
				});
				
				$state.go('step4');
			}else{
				$scope.alert.msg="班级创建成功!";
				$scope.alert.show=true;
				
				
				var data = {
						message:'班级创建成功!',
						action:'create-class-success'
				};
				$scope.$emit('alert',data);
				
			}
		},function(msg){
            var data = {
					message:msg,
			};
			$scope.$emit('alert',data);
		});
		
		
	}
	
	$scope.$on('alertEvent',function(event,data){
		if(data.action == 'create-class-success' || data.action=='join-success'){
			window.location.href="/class";
		}
	});
	

	
	function notifyUpdate(classes){
		var localClasses = [];
		angular.forEach(classes,function(clazz){
			var item = {};
			item.classId = clazz.id;
			item.className = clazz.name;
			item.classNumber = clazz.classNumber;
			item.classGrade = clazz.gradeNo;
			item.stuCount = clazz.studentSize;
			item.subjectId = clazz.subject.id;
			item.subjectName = clazz.subject.name;
			item.subjectCode = clazz.subject.code;
			localClasses.push(item);
		});
		
		var data = {};
		data.action = 'add';
		data.classes = localClasses;
		//通知UserController 更新班级数据
		$scope.$emit('updateClass',data);
	}
	
	$scope.changeJoinClass = function(clazz){
		if(clazz.selected){
			$scope.form.classes.push(clazz);
		}else{
			var index = $scope.form.classes.indexOf(clazz);
			if(index > -1){
				$scope.form.classes.splice(index,1);
			}
		}

	}
    
    $scope.selectedClasses = [];
    
	$scope.joinClass = function(type){
       
		var classes  = [];
		var classIds = [];
		if(type == 1){
			angular.forEach($scope.joinClasses,function(clazz){
				if(clazz.selected){
					classIds.push(clazz.id);
					classes.push(clazz);
				}
			});
		}else{
			angular.forEach($scope.createResult.existing,function(clazz){
				if(clazz.selected){
					classIds.push(clazz.id);
					classes.push(clazz);
				}
			});
		}
		
		if(classes.length<=0){
			return;
		}
		var params = {};
		params.stage = $scope.form.stage;
		params.grade=$scope.form.grade.id;
		params.classIDs = classIds.join(',');
		
		ClassService.join(params).then(function(result){
			
			var subject = result.subject;
			var failedClassIds = result.failedClassIds || [];
			/*if(failedClassIds.length >0){
				var classMap = {};
				angular.forEach(classes,function(clazz){
					classMap[clazz.id] = clazz;
				});
			}
			angular.forEach(failedClassIds,function(classId){
				
			});
			*/
			var failedClassNumbers = [];
			var successClasses = [];
			//更新加入班级信息
			angular.forEach(classes,function(clazz){
				
				var classId = clazz.id;
				
				var index = failedClassIds.indexOf(classId);
				if(index < 0){ //不存在表示加入成功
					clazz.subject = subject;
					successClasses.push(clazz);
				}else{ //加入失败班级
					failedClassNumbers.push($filter('className')(clazz.name));
				}
			});
			
			notifyUpdate(successClasses);
			var msg = "恭喜您，成功加入班级!";
			if(failedClassNumbers.length >0){
				msg = Toolkit.join(failedClassNumbers)+'已经有'+subject.name+'老师，不能加入!';
				if(successClasses.length >0){
					msg +='其他班级加入成功!';
				}
			}
			var data = {
					message : msg,
					action:'join-success'
			};
			$scope.$emit('alert',data);
			//$scope.alert.show=true;
		},function(msg){
			var data = {
					message :msg
			};
			$scope.$emit('alert',data);
		});
		
		
		
	}
	$scope.changeClass = function(clazz,isExisted){
		
		var classes = null;
		if(isExisted){
			classes = $scope.existing;
		}else{
			classes = $scope.form.classes;
		}
		
		if(clazz.checked||clazz.selected){
			 if(classes.length<5){
				 classes.push(clazz);
			 }else{
				 clazz.selected = false;
 				var data = {
 						message : "最多只能添加/加入5个班级"
 				};
 				$scope.$emit('alert',data);
			 }

		}else{
			var index =classes.indexOf(clazz);
			if(index >-1){
				classes.splice(index,1)
			}
		}
        console.log(classes);
		updateLocalCache();
	}
	
	
	function updateLocalCache(){
		CacheService.put('class-form',$scope.form);
	}
	
	function isClassChecked(code){
		for(var i=0;i<$scope.form.classes.length;i++){
			if(code == $scope.form.classes[i].code){
				return true;
			}
		}
	}
	
	$scope.choseGrade = function(grade){
		$scope.form.grade = grade;
		if(!isJoin){
			$state.go('step3');
		}else{
			ClassService.getExistClass( $scope.form.stage, $scope.form.grade.id,0,24).then(function(classes){
				$scope.joinClasses = classes;
				$state.go('step5');
			},function(msg){
				
			});
		}
		updateLocalCache();
	}
	$scope.defineName = '';
	$scope.addClass = function(){
		if($scope.form.defineName != ''){
            if($scope.form.defineName.length>8){
                var data = {
                    message : "请输入小于8位的班级名称"
                };
                $scope.$emit('alert',data);
                return;
            }
			if(!ClassService.isClassName($scope.form.defineName)){
				var data = {
 						message : "班级名称只能是中文、英文、数字"
 				};
 				$scope.$emit('alert',data);
				return;
			}
			if($scope.form.classes.length>=5){
 				var data = {
 						message : "最多只能添加/加入5个班级"
 				};
 				$scope.$emit('alert',data);
				return;
			}
			ClassService.censorClassName($scope.form.defineName).then(function(){
				var item = {};
				item.type=1;
				item.code = new Date().getTime();
				item.name=$scope.form.defineName;
				item.selected = true;
				$scope.form.classes.push(item);
				$scope.form.defineName = '';

				updateLocalCache();
			},function(msg){
				var data = {
 					message : msg
 				};
 				$scope.$emit('alert',data);
				return;
			});
		}
	}
	
}]);