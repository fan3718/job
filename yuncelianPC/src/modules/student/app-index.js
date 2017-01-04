var progressbar=[];
var ngProgressbar="";
if(document.createElementNS){
    progressbar=['https://cdn.bootcss.com/progressbar.js/0.9.0/progressbar.min','vendors/progressbar'];
    ngProgressbar='directives/ng-progressbar';
}
var jquery=['https://staticfile.qnssl.com/jquery/2.1.4/jquery.min','https://cdn.bootcss.com/jquery/2.1.4/jquery.min','/js/jquery-1.9.1.min'];
var angular=['https://cdn.bootcss.com/angular.js/1.4.7/angular'];
if(window._verBrower=="IE 8.0"){
    jquery=['https://staticfile.qnssl.com/jquery/1.8.3/jquery.min'];
    angular=['https://cdn.bootcss.com/angular.js/1.2.28/angular'];
}
require.config({
    //urlArgs: "r=" + (new Date()).getTime(),
    urlArgs: "r=1.0.6",
    baseUrl:'/js/app',
    paths : {
        jquery : jquery,
        bxslider : 'vendors/jquery.bxslider',
        treeview: 'vendors/jquery.treeview',
        lazyload : 'vendors/lazyload',
        swiper:"vendors/swiper/swiper-3.2.7.min",
        md5:'https://staticfile.qnssl.com/crypto-js/3.1.2/rollups/md5',
        CryptoService:'services/CryptoService',
        AuthCodeService:'services/AuthCodeService',
        angular:angular,
        progressbar :progressbar,
        UserService:'services/UserService',
        WorkTrailService:'services/WorkTrailService',
        ClassService:'services/ClassService',
        HttpClient:'services/HttpClient',
        AudioService:'services/AudioService',
        ExerciseService:'services/ExerciseService',
        ExamService:'services/ExamService',
        MaterialService:'services/MaterialService',
        CacheService:'services/CacheService',
        ReportService:'services/ReportService',
        Filter:'filters/Filters',
        app : 'app',
        Toolkit:'services/Toolkit',
        UserController:'modules/UserController',
        StudentController:'modules/student/StudentCtrl',
        NavigatorController:'modules/student/NavigatorCtrl',
        directives:'directives/directives',
        ngVideoSlider:'directives/ng-video-slider',
        ngProgressBar:ngProgressbar,
        ngLocation:'directives/ng-location',
        Audio5Js:'vendors/audio5js/audio5.min',
        'infinite-scroll':'vendors/ng-infinite-scroll.min',
        'ngFileUpload':['https://cdn.bootcss.com/danialfarid-angular-file-upload/9.0.8/ng-file-upload.min','vendors/ng-file-upload.min'],
        ngSwiper:'directives/ng-swiper',
        echarts:'vendors/echars.min',
        ngEcharts:'directives/ng-echarts',
        ngDynamic:'directives/ng-dynamic'
    },
    shim : {
        angular : {
            exports : 'angular',
            deps:[
                'jquery'
            ]
        },
        'infinite-scroll':{
            exports : 'infinite-scroll',
            deps:[
                'angular'
            ]
        },
        ngFileUpload:{
            exports : 'ngFileUpload',
            deps:[
                'angular'
            ]
        },
        bxslider:{
            exports : 'bxslider',
            deps:[
                'jquery'
            ]
        },lazyload:{
            exports : 'lazyload',
            deps:[
                'angular'
            ]
        },
        treeview:{
            exports : 'treeview',
            deps:[
                'jquery'
            ]
        },
        /*progressbar : {
         exports : 'progressbar',
         deps:[
         'jquery'
         ]
         }*/
    }
});



require(['jquery','angular','infinite-scroll','ngFileUpload','UserController','StudentController','NavigatorController','lazyload'],function($,angular){
    // boot angular framework
    angular.bootstrap(document,["app",'infinite-scroll','ngFileUpload','lazyload']);
});