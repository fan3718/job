import 'es5-shim';
import 'es5-shim/es5-sham';
import 'console-polyfill';


//audio
import  './controllers/AudioController';
//user
import  './controllers/user';

//resources
import  './controllers/teacher/resources';


import  './controllers/student/StudentController';
import  './controllers/student/ExerciseController';
import  './controllers/student/ExerciseDetailController';
import './controllers/student/ExerciseConsolidateController';
import  './controllers/student/QuesController';
import  './controllers/student/ReportController';
import  './controllers/student/MarkReportController';
import  './controllers/student/NotesReportController';
import  './controllers/student/IntensiveReportController';
import  './controllers/student/ExamReportController';
import  './controllers/student/ReadKnowledgeController';

import  './controllers/student/ExamController';

import  './controllers/student/MessageController';

import  './controllers/student/NavigatorController';

import './filters/Filters';
import './directives';
import './directives/pangu';
import 'directives/MaskBox';



angular.element(document).ready(function() {
	 angular.bootstrap(document,['app']);
});
