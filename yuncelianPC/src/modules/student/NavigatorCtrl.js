define(['app','UserService'],function(app,UserService){
    'use strict';
    app.controller('NavigatorController',['$scope','UserService',function($scope,UserService){
        $scope.userInfo = {
            classes:[]
        };
        UserService.getUserInfo().then(function(info){
            $scope.userInfo = info;
            $scope.$emit('userinfo',info);
        });

    }]);
    //app.controller('');
});