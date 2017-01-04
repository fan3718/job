import app from 'app';
import 'services/EvaluationService';
import 'services/Toolkit';
//<script src="//cdn.bootcss.com/html2canvas/0.4.1/html2canvas.min.js"></script>
export default app.controller('EvaluationReportController',['$scope','$location','EvaluationService','Toolkit',function($scope,$location,EvaluationService,Toolkit){
		
		$scope.evaluations = [];
		
		var evaluationOrder = ['3','4','5','2','1'];
		
		$scope.params = Toolkit.serializeParams();
		
		
		$scope.filter = {
				subjectCode:'0'
		};
		
		
		if(angular.isDefined($scope.params.subjectCode)){
			$scope.filter.subjectCode = (parseInt($scope.params.subjectCode)%10)+'';
		}
		
		$scope.honeycombs = [];
		
		var url = $location.absUrl();
		
		var reportType = 0;
		
		if(url.indexOf('/ability') !=-1){
			reportType = 1;
		}else if(url.indexOf('/knowledge') !=-1){
			reportType = 2;
		}
		
		$scope.report = {
				
		};
		
		
		$scope.$watch('filter.subjectCode',function(newValue,oldValue){
			if(newValue != oldValue){
				var section = $scope.report.subjectMap[newValue];
				parseSection(section);
			}
		});
		
		
		$scope.startEvaluate = function(){
			var evaluation = $scope.report.evaluation;
			var gradeNo = evaluation.gradeNo;
			var stage = '1';
			if(gradeNo<=6){
				stage = '1';
			}else if(gradeNo<=9){
				stage = '2';
			}else{
				stage = '3';
			}
			var subejctCode = stage+$scope.filter.subjectCode;
			window.location.href='/evaluation/knowledge/filter?id='+evaluation.id+"&subjectCode="+subejctCode;
		}
		
		$scope.download = function(){
			html2canvas(document.getElementById('charts')).then(function(canvas) {
			    //document.body.appendChild(canvas);
			    //console.log(canvas.toDataURL());
			    window.location.href=canvas.toDataURL();
			    //var doc = new jsPDF();
			    
			    //doc.addImage(canvas.toDataURL('image/jpeg'), 'JPEG', 15, 40, 180, 180);
			    //doc.output(); 
			});
		}
		
		
		if(url.indexOf('/ability') !=-1 || url.indexOf('/knowledge') !=-1){ //学能报告
			
			
			$scope.isLoaded = false;
			
			if(url.indexOf('/knowledge') !=-1){
				for(var i =0;i<15;i++){
					var honeycombs = {};
					$scope.honeycombs.push(honeycombs);
				}
			}
			EvaluationService.getEvaluationDetail($scope.params.id).then(function(report){
				$scope.report  = report;
				if(reportType ==1){
					$scope.sectionOption = createRadarOption($scope.report.sectionMap);
				}else if(reportType ==2){
					console.log(report);
					var section = report.subjectMap[$scope.filter.subjectCode];
					parseSection(section);
					
				}else{
					
				}
				$scope.isLoaded = true;
				
			},function(msg){
				
			});
			
			
			
			
			
		}else{
			EvaluationService.findEvaluationByUser().then(function(evaluations){
				
				$scope.evaluations = evaluations;
				
				
			});
		}
		
		
		
		function parseSection(section){
			if(angular.isDefined(section)){
				$scope.section = section;
				var knowledgeMap = new Object();
				var keys = new Array();
				angular.forEach(section.knowledgeMap,function(knowledge){
					keys.push(name);
					// var keys = Object.keys(knowledgeMap);
					var index = assignHoneycombIndex(keys.length);
					$scope.honeycombs[index-1] =knowledge;
					knowledgeMap[knowledge.name] = index;
				});
				$scope.sectionOption = createEchartsOption(section.levelsCount);
				
				$scope.isEmpty = false;
			}else{
				$scope.isEmpty = true;
			}
		}
		
		
		function assignHoneycombIndex(knowledgeCount) {       
			switch(knowledgeCount) {        
				case 0:            
						return 7;        
				case 1:           
						return 14;        
				case 2:            
						return 1;        
				case 3:            
						return 13;        
				case 4:            
						return 9;        
				case 5:            
						return 3;        
				case 6:            
						return 5;        
				case 7:            
						return 15;        
				case 8:            
						return 11;        
				case 9:            
						return 2;        
				case 10:            
						return 10;        
				case 11:            
						return 6;        
				case 12:            
						return 12;        
				case 13:            
						return 4;        
				case 14:            
						return 8;       
				}        
			return 8;    
		}
		
		function createRadarOption(map){
			
			var option = {};
			var data = [];
			var labels = [];
			for(var i = 0;i<evaluationOrder.length;i++){
				var key = evaluationOrder[i];
				var name = EvaluationService.getEvaluationType(key);
				
				labels.push(name);
				data.push(map[key].score);
			}
			option.data = data;
			option.labels = labels;
			return option;
			
			
		}
		
		function createEchartsOption(levelsCount){
			
			var data = [];
			for(var i=0;i<levelsCount.length;i++){
				data.push(levelsCount[i]+1);
			}
			
			var option = {
	                title: {
	                    show:'false',               
	                },
	                grid:{
	                    left:'0',
	                    top:'18px',
	                    height:'180px',
	                    width:'420px',
	                },
	                xAxis: {
	                    type:'category',
	                    splitLine:{show:false},
	                    axisTick:{show:false},
	                   	axisLine:{
	                    	lineStyle:{
	                    		color: '#ffac47',
	    						width: 2,
	    						type: 'solid'
	                    	}
	                    },
	                    axisLabel:{
	                        margin:5,
	                        textStyle:{
	                            color:'#4a5c7a',
	                            fontSize:14
	                        }
	                    },                    
	                    data: ["简单","一般","适中","较难","特难"]
	                },
	                yAxis: {
	                    splitLine:{show:false},
	                    axisTick:{show:false},
	                    axisLine:{
	                    	lineStyle:{
	                    		color: '#ffac47',
	    						width: 3,
	    						type: 'solid'
	                    	}
	                    },
	                    axisLabel:{
	                    	show:false,
	                        margin:5,
	                        textStyle:{
	                            color:'#999999',
	                            fontSize:12
	                        }
	                    },
	                    type:'value',
	                    min:0,
	                    max:22,
	                    interval:5
	                },
	                series : [ 
	                {
	                    name:'错误选项',
	                    type:'bar',
	                    stack: '总量',
	                    label:{
	                        normal: {
	                            show: true, 
	                            position: [15,-17],
	                            formatter:function(param){
	                            	return (param.data-1)+"题";
	                            }
	                        }
	                    },
	                    itemStyle : { 
	                        normal: {
	                            color:'#ffac47',
	                        }
	                    },
	                    
	                    barWidth:50,
	                    data:data
	                }
	            ]
	            };
			return option;
		}
		
		
	}]);