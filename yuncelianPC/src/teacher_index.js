import 'es5-shim';
import 'es5-shim/es5-sham';
import 'console-polyfill';
//audio
import  './controllers/AudioController';
//user
import  './controllers/user';
import  './controllers/teacher/ClassCheckBoxController';
//exercise
import  './controllers/teacher/exercise';
//import  './controllers/teacher/exercise/ExerciseAssignController';
//import  './controllers/teacher/exercise/ExerciseCartController';

//exam
import  './controllers/teacher/exam';


//message
import  './controllers/teacher/message';
//import  './controllers/teacher/message/MessageController';
//import  './controllers/teacher/message/MessageDetailController';
//import  './controllers/teacher/message/MessageCorrectController';

//class
import  './controllers/teacher/class';
//import  './controllers/teacher/class/ClassCenterController';
//import  './controllers/teacher/class/ClassManageController';


//report
import  './controllers/teacher/report';
//import  './controllers/teacher/report/ReportController';
//import  './controllers/teacher/report/ReportWrongNoteController';
//import  './controllers/teacher/report/ReportClassController';


//evaluation
//import  './controllers/teacher/evaluation';

//resources
import  './controllers/teacher/resources';
//import  './controllers/teacher/resources/ResourceController';
//import  './controllers/teacher/resources/FavoriteResController';

import './filters/Filters';
import './directives';
import 'directives/MaskBox';
import './directives/pangu';

var url = window.location.href;

function bootstrap(){
	angular.element(document).ready(function() {
		 angular.bootstrap(document,['app']);
	 });
}

if(url.indexOf('class/create')>=0 || url.indexOf('class/join')>=0){
	require('./controllers/teacher/class/ClassCreateController');
	bootstrap();
}else if(url.indexOf('exercise/assign') >=0){
	require('./controllers/teacher/exercise/ExerciseAssignController');
	bootstrap();
}else if(url.indexOf('evaluation')>=0){
	require('./controllers/teacher/evaluation');
	bootstrap();
}else{
	bootstrap();
}


