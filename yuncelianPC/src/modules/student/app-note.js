var progressbar=[];
if(document.createElementNS){
    progressbar=['https://cdn.bootcss.com/progressbar.js/0.9.0/progressbar.min','vendors/progressbar'];
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
        swiper:"vendors/swiper/idangerous.swiper",
        md5:'https://staticfile.qnssl.com/crypto-js/3.1.2/rollups/md5',
        angular:angular,
        //ngSanitize:'sanitize',
        AuthCodeService:'services/AuthCodeService',
        lazyload : 'vendors/lazyload',
        progressbar :progressbar,
        MaterialService:'services/MaterialService',
        CryptoService:'services/CryptoService',
        CacheService:'services/CacheService',
        UserService:'services/UserService',
        DownloadExclService:'services/DownloadExclService',
        HttpClient:'services/HttpClient',
        ExerciseNoteService:'services/ExerciseNoteService',
        ExerciseService:'services/ExerciseNoteService',
        ExamService:'services/ExamService',
        ReportService:'services/ReportService',
        Filter:'filters/Filters',
        app : 'app',
        Toolkit:'services/Toolkit',
        UserController:'modules/UserController',
        QuesController:'modules/student/quesCtrl',
        notesReportController:'modules/student/ExerciseNoteCtrl',
        // intensiveReportController:'modules/student/ExerciseNoteCtrl',
        ExerciseDetailController:'modules/student/ExerciseDetailCtrl',
        NavigatorController:'modules/student/NavigatorCtrl',
        directives:'directives/directives',
        ngVideoSlider:'directives/ng-video-slider',
        ngVideo:'directives/ng-video',
        VideoJs:'vendors/videojs/video',
        VideoHelper:'services/VideoHelper',
        'infinite-scroll':'vendors/ng-infinite-scroll.min',
        ngSwiper:'directives/ng-swiper',
        echarts:'vendors/echars.min',
        ngEcharts:'directives/ng-echarts'
    },
    shim : {
        angular : {
            exports : 'angular',
            deps:[
                'jquery'
            ]
        },
        lazyload:{
            exports : 'lazyload',
            deps:[
                'angular'
            ]
        },
        'infinite-scroll':{
            exports : 'infinite-scroll',
            deps:[
                'angular'
            ]
        }
    }
});



require(['jquery','angular','infinite-scroll','ngEcharts','UserController','QuesController','ExerciseDetailController','notesReportController','lazyload'],function($,angular){
    // boot angular framework
    angular.bootstrap(document,["app",'infinite-scroll','lazyload']);
});