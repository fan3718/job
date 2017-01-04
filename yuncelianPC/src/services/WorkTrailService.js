import app from 'app';
import 'services/Toolkit';
export default app.factory('WorkTrailService',['$http','$q','Toolkit',function($http,$q,Toolkit){
	$http.defaults.headers.common['X-TECHU-AUTH'] = Toolkit.getCookie("safeToken");
	var service = {
		/**
		* @param subjectID :学科ID
		* @param page 页码
		* @param ps 每页加载条数
		*/
		getStudentWorkTrail:function(subjectID,page,ps){
			var param={};
		    param.ps=ps;
		    param.page=page;
		    if(subjectID!="" && subjectID !="-1"){
		        param.subjectID=subjectID;
		    }
			var deferred = $q.defer();
			$http({url:"/wap/student/getWorkTrail",method:'POST',params:param}).success(function(result){
				if(result!=null && result.code==1){
					var res = {};
					res.list = result.list;
					res.subjectID = subjectID;
					deferred.resolve(res);
				}else{
					deferred.reject(result!=null ? result.msg:"服务器内部错误");
				}
			}).error(function(){
				deferred.reject('网络故障');
			});
			return deferred.promise;
		},
		/**
		 * 获取家长首页轨迹
		 * @param childID 孩子ID
		 * @param page 页码
		 * @param ps 每页加载条数
		 */
		getParentChildrenWorkTrail:function(childID,page,ps){
			var param={};
		    param.ps=ps;
		    param.page=page;
		    if(childID!="" && childID !="-1"){
		        param.childID=childID;
		    }
			var deferred = $q.defer();
			$http({url:"/wap/parent/getChildrenWorkTrail",method:'POST',params:param}).success(function(result){
				if(result!=null && result.code==1){
					var res = {};
					res.list = result.list;
					res.childID = childID;
					deferred.resolve(res);
				}else{
					deferred.reject(result!=null ? result.msg:"服务器内部错误");
				}
			}).error(function(){
				deferred.reject('网络故障');
			});
			return deferred.promise;
		},
		/**
		 * 获取老师首页轨迹
		 * @param classID 班级ID
		 * @param page 页码
		 * @param ps 每页加载条数
		 */
		getTeacherAssignWorkTrail:function(classID,page,ps){
			var param={};
		    param.ps=ps;
		    param.page=page;
		    var url = "/wap/teacher/getAssignWorkTrail";
		    if(classID != "" && classID != "-1"){
		        param.classId=classID;
		        url="/wap/teacher/getWorkTrailByClassId";
		    }
			var deferred = $q.defer();
			$http({url:url,method:'POST',params:param}).success(function(result){
				if(result!=null && result.code==1){
					var data = {};
					data.list = result.list;
					data.teacherName = result.teacherName;
					deferred.resolve(data);
				}else{
					deferred.reject(result!=null ? result.msg:"服务器内部错误");
				}
			}).error(function(){
				deferred.reject('网络故障');
			});
			return deferred.promise;
		}
	};
	
	return service;
}]);
