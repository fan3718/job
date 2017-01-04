import app from 'app';

import 'services/UserService';

export default app.controller('NavigatorController',['$scope','UserService',function($scope,UserService){
        $scope.userInfo = {
            classes:[]
        };
        UserService.getUserInfo().then(function(info){
            $scope.userInfo = info;
            $scope.$emit('userinfo',info);
        });

    }]);