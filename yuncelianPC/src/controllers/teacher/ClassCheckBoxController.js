import app from 'app';

export default app.controller('ClassCheckBoxController',['$scope',function($scope){
	
		$scope.disabledCheckbox = function(clazz){
			//班级人数必须不为零，和当前被选中的班级的年级必须一样，
			return clazz.stuCount==0 || ( $scope.form.grade != -1&&clazz.classGrade!= $scope.form.grade)
		}

		$scope.form = {
			grade:-1,
			subjectCode: -1,
			subjectId:-1,
			classes:[]
		};
		$scope.isSelected = function(clazz){
			if($scope.form.classes.length==0){
				return false;
			}
			var index = $scope.form.classes.indexOf(clazz);
			if(index!=-1){
				return true;
			}
			return false;
		}
		$scope.toggleSelectClass = function(clazz){
			//alert(window._varBrower);
			clazz.checked =clazz.checked||false;
			if(window._verBrower=="IE 8.0"){

				clazz.checked = !clazz.checked;
				var checked = (clazz.checked)&&(!$scope.disabledCheckbox(clazz));
			}else{
				var checked = !(clazz.checked)&&(!$scope.disabledCheckbox(clazz));
			}
			console.log(checked+" ====== "+clazz.checked);
			if(checked){
				$scope.form.grade = clazz.classGrade;
				$scope.form.subjectCode = clazz.subjectCode;
				$scope.form.subjectId = clazz.subjectId;
				$scope.form.classes.push(clazz);
			}else{
				var index = $scope.form.classes.indexOf(clazz);
				if(index !=-1){

					$scope.form.classes.splice(index,1);
				}
				if($scope.form.classes.length ==0){
					$scope.form.grade = -1;
					$scope.form.subjectCode = -1;
					$scope.form.subjectId = -1;
				}
			}

		}
	}]);