
import app from 'app';
import './HttpClient';
import './CryptoService';
import './Toolkit';


	
export default app.factory('ClassService',['$q','$http','HttpClient','CryptoService','Toolkit',function($q,$http,HttpClient,CryptoService,Toolkit){
		$http.defaults.headers.common['X-TECHU-AUTH'] = Toolkit.getCookie("safeToken");
		
		/**
		 * 验证班级名
		 */
		function checkClassName(name){
			return /^[\da-z\u4E00-\u9FA5\uF900-\uFA2D]+$/gi.test(name);
		}
		var service = {
				isClassName:function(name){
					return checkClassName(name);
				},
				/**
				 * 创建及添加班级
				 * @param params
				 * <pre>
				 * {
				 * 	stage:1,
				 * 	grage:1,
				 * 	classNameStr:"1班,2班"
				 * }
				 * </pre>
				 * 
				 * 
				 */
				createAndCheckedJoin:function(params){
					var defer = $q.defer();
					HttpClient.post('/ajax/class/web/create/join',params).success(function(result){
						if(result.code == 1||result.code == 2){
							if(result.existing.length>0 || result.classes.length>0){
								defer.resolve(result);
							}else{
								defer.reject('已经加入该班级，不能重复创建');
							}
						}else{
							defer.reject(result.msg);
						}
					}).error(function(){
						defer.reject("服务器内部错误");
					});
					return defer.promise;
				},
				/**
				 * 加入班级
				 * 
				 * @param params
				 * <pre>
				 * {
				 *		 stage:1,
				 * 	 grage:1,
				 * 	 classIDs:"10010,10086,10000"
				 * }
				 * </pre>
				 * 
				 */
				join:function(params){
					var defer = $q.defer();
					HttpClient.post('/ajax/class/web/join',params).success(function(result){
						if(result.code == 1){
							//var res = {};
							//res.subject = result.subject;
							//res.failedClassIds = result.failedClassIds;
							defer.resolve(result);
						}else{
							defer.reject(result.msg);
						}
					}).error(function(){
						defer.reject("服务器内部错误");
					});
					return defer.promise;
				},
				processTeachers:function(teachers){
					var result =[];
					angular.forEach(teachers,function(teacher){
						teacher.subjectCode = teacher.subject;
						teacher.subject = parseInt(teacher.subject) % 10;
						if(teacher.isBoss){
							result.unshift(teacher);
						}else{
							result.push(teacher);
						}
					});
					return result;
				},
				/**
				 * 获取班级的学生数据 
				 */
				getClassInfoById:function(classId,role){
					var defer = $q.defer();
					role = role || 'student';
					var params = {};
					params.role = role;
					HttpClient.post('/ajax/class/info/'+classId,params).success(function(result){
						if(result.code == 1){
							var res = {};
							res.students = result.students;
							res.studentSize = result.studentSize;
							res.info = result.info;
							res.isBoss = result.isBoss || false;
							
							var teachers =service.processTeachers(result.teachers);
							/*
							angular.forEach(result.teachers,function(teacher){
								teacher.subjectCode = teacher.subject;
								teacher.subject = parseInt(teacher.subject) % 10;
								if(teacher.isBoss){
									teachers.splice(0,1,teacher);
								}else{
									teachers.push(teacher);
								}
							});*/
							res.teachers = teachers;
							
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
				 * 移除班级中的用户
				 * @param classId 班级ID
				 * @param role  student和teacher
				 * @param ids 删除用户的id数组
				 */
				removeUser:function(classId,role,ids,pwd){
					
					
					
					
					var defer = $q.defer();
					pwd = pwd ||'';
					
					//if("student" == role){
						if(Toolkit.trim(pwd)==''){
							defer.reject('请输入登陆密码');
							return defer.promise;
						}
						pwd = CryptoService.encrypt(pwd);
					//}
					
					var params = {};
					params.cid = classId;
					var json = {};
					json.ids = ids;
					params.json = JSON.stringify(json);
					params.pwd = pwd;
					
					HttpClient.post('/ajax/class/web/remove/'+role,params).success(function(result){
						if(result.code == 1){
							defer.resolve(result.count);
						}else{
							defer.reject(result.msg);
						}
					}).error(function(){
						defer.reject("服务器内部错误");
					});
					return defer.promise;
				},
				/**
				 * 设置允许学生加入班级
				 * @param classId  班级Id
				 * @param isAllow 是否允许
				 */
				allowJoin:function(classId,isAllow){
					var defer = $q.defer();
					var params = {};
					params.classId = classId;
					params.allow = isAllow;
					HttpClient.post('/ajax/class/allowJoin',params).success(function(result){
						if(result.code == 1){
							defer.resolve();
						}else{
							defer.reject(result.msg);
						}
					}).error(function(){
						defer.reject("服务器内部错误");
					});
					return defer.promise;
				},
				/**
				 * 更新学生的的姓名
				 * @param classId 班级Id
				 * @param stuId 学生Id
				 * @param name 新名字
				 */
				updateStudentName: function(classId,stuId,name){
					var defer = $q.defer();
					var params = {};
					params.classId = classId;
					params.uid = stuId;
					params.name = name;
					
					HttpClient.post('/ajax/class/update/student',params).success(function(result){
						if(result.code == 1){
							defer.resolve();
						}else{
							defer.reject(result.msg);
						}
					}).error(function(){
						defer.reject("服务器内部错误");
					});
					return defer.promise;
				},
				censorClassName : function(className) {
					var defer = $q.defer();
					var params = {};
					params.text = className;
					HttpClient.post('/ajax/system/censor',params).success(function(result){
						if(result.code == 1){
							defer.resolve();
						} else {
							defer.reject(result.msg);
						}
					}).error(function(){
						defer.reject("网络出错，请重试");
					});
					return defer.promise;
				},
				/**
				 * 获取已经存在的班级
				 * @param stage
				 * @param grade
				 * @param p 
				 * 第一页 为0
				 * @param ps
				 */
				getExistClass : function(stage,grade,p,ps){
					var defer = $q.defer();
					var params = {};
					params.stage = stage;
					params.grade = grade;
					params.p = p || 0;
					params.ps = ps || 20;
					HttpClient.post('/ajax/class/web/exist',params).success(function(result){
						if(result.code == 1){
							defer.resolve(result.classes);
						}else{
							defer.reject(result.msg);
						}
					}).error(function(){
						defer.reject("服务器内部错误");
					});
					return defer.promise;
				},
				getClassInfo : function(classid){
				var defer = $q.defer();
				var params = {};
				HttpClient.get('/ajax/class/'+classid+'/info?detail=true').success(function(result){

					if(result.code == 1){
						defer.resolve(result);
					}else{
						defer.reject(result.msg);
					}
				}).error(function(){
					defer.reject("服务器内部错误");
				});
				return defer.promise;
			}
		};
		return service;
	}]);
	