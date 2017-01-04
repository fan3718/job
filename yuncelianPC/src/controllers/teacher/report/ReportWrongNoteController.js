import app from 'app';
import 'services/Toolkit';
import 'services/ReportService';
import 'services/MaterialService';


app.controller('ReportWrongNoteController',['$scope','$location','Toolkit','ReportService','MaterialService',function($scope,$location,Toolkit,ReportService,MaterialService){
		
		$scope.params = Toolkit.serializeParams();
		
		var url = $location.absUrl();
		
		var isClassWrongNote = url.indexOf('/class') >-1;
		
		$scope.filter = {
				time:"-1",
				p:0,
				ps:20,
				timeDesc:'全部'
		}
		
		$scope.result = {};
		
		$scope.isLoaded = false;
		
		loadWrongNote();
		
		
		/**
		 * 获取学生的错题本
		 */
		function loadUserWrongNote(){
			var year = -1;
			var month=-1;
			if($scope.filter.time !="-1"){
				var ts = $scope.filter.time.split("-");
				year = ts[0];
				month = ts[1];
			}
			
			ReportService.getStudentWrongNote($scope.params.uid,$scope.params.subjectId,$scope.params.term,year,month,$scope.filter.p).then(function(result){
				$scope.result = result;
				console.log(result);
				$scope.isLoaded = true;
			},function(msg){
				console.log(msg);
				$scope.isLoaded = true;
			});
		}
		
		
		$scope.toggleShowAnalysis = function(quest){
			quest.showAnalysis = !quest.showAnalysis ;
		}
		
		/**
		 * 加载班级错题数据
		 */
		function loadClassWrongNote(){
			
			var year = -1;
			var month=-1;
			
			if($scope.filter.time !="-1"){
				var ts = $scope.filter.time.split("-");
				year = parseInt(ts[0]);
				month = parseInt(ts[1]);
			}
			
			ReportService.getClassWrongNote($scope.params.classId,$scope.params.term,year,month,$scope.filter.p).then(function(result){
				$scope.result = result;
				console.log(result);
				//加载题目数据
				
				angular.forEach(result.qusReports,function(item){
					angular.forEach(item.reports,function(report){
						MaterialService.getQuestionById(report.questionId,report.subjectCode).then(function(info){
							report.quest = info;
							if(report.sectionCode !=1){
								report.chartOption = createChartOption(report);
							}
							report.loaded = true;
						},function(msg){
							
						});
					});
					
					
					
					
					
					
					
				});
				
				$scope.isLoaded = true;
				
			},function(msg){
				$scope.isLoaded = true;
			});
		}
		
		function createChartOption(report){
			
			
			var total = report.completeStuCount;
			
			var distribute = report.answerDistribution; 
			var rightPercent = '0';
			var wrongPercent = '0';
			if(total !=0){
				if(angular.isDefined(distribute['正确'])){
					var right =parseFloat((distribute['正确'].length*100/total).toFixed(1));
					rightPercent = ''+right;
					wrongPercent = ''+(100 - right);
				}
				//if(angular.isDefined(distribute['错误'])){
					//wrongPercent = ''+Math.ceil(distribute['错误'].length*100/total);
				//}
			}
			
			 var option = {
		                title: {
		                    show:'false',               
		                },
		                tooltip: {
		                    trigger:'item',
		                    position:'right',
		                    backgroundColor:'#ffffff',
		                    borderColor:'#ffac47',
		                    borderWidth:1,
		                    textStyle:{
		                        color:'#ffac47',
		                        fontSize:12,
		                    },
		                    formatter: function (params) {
		                    	var key = params.name;
		                    	var data = distribute[key] || [];
		                        return params.name  + (data.length||0) +'人'+ '<br/>'+data.join('、');
		                    },
		                },
		                grid:{
		                	show: true,
	                        backgroundColor:'rgb(225,238,255)',
	                        borderWidth:0,
		                    left:'26px',
		                    top:'18px',
		                    height:'100px',
		                    width:'185px',
		                },
		                xAxis: {
		                    type:'category',
		                    splitLine:{show:false},
		                    axisTick:{show:false},
		                    axisLine:{
	                            lineStyle:{
	                                width:2,
	                                color:'#68acff'
	                            }
	                        },
		                    axisLabel:{
		                        margin:5,
		                        textStyle:{
		                            color:'#999999',
		                            fontSize:12
		                        }
		                    },                    
		                    data: ["正确","错误"]
		                },
		                yAxis: {
		                    splitLine:{show:false},
		                    axisTick:{show:false},
		                    axisLine:{
	                            lineStyle:{
	                                width:2,
	                                color:'#68acff'
	                            }
	                        },
		                    axisLabel:{
		                        margin:5,
		                        textStyle:{
		                            color:'#999999',
		                            fontSize:12
		                        }
		                    },
		                    type:'value',
		                    min:0,
		                    max:100,
		                    interval:25
		                },
		                series : [
		                {
		                    name:'正确选项',
		                    type:'bar',
		                    stack: '总量',
		                    label:{
		                        normal:{
		                            show:true,
		                            position:[15,-17],
		                            formatter:'{c}%'
		                        }
		                    },
		                    itemStyle:{
		                        normal:{
		                            color:'#68acff',
		                        },
		                        
		                    },
		                    barWidth:50,
		                    data:[rightPercent, '-']
		                },
		                {
		                    name:'错误选项',
		                    type:'bar',
		                    stack: '总量',
		                    label:{
		                        normal: {
		                            show: true, 
		                            position: [15,-17],
		                            formatter:'{c}%'
		                        }
		                    },
		                    itemStyle : { 
		                        normal: {
		                            color:'#ffac47',
		                        }
		                    },  
		                    barWidth:50,
		                    data:['-',wrongPercent]
		                }
		            ]
		      };
			 return option;
		}
		
		$scope.loadPageData = function(p){
			$scope.filter.p = p-1;
			loadWrongNote();
		}
		
		function loadWrongNote(){
			if(isClassWrongNote){
				loadClassWrongNote();
			}else{
				loadUserWrongNote();
			}
		}
		
		$scope.$watch('filter.time',function(newValue,oldValue){
			if(newValue!=oldValue){
				$scope.filter.p = 0;
				if(newValue!="-1"){
					var ts = $scope.filter.time.split("-");
					$scope.filter.timeDesc = ts[0]+'年'+ts[1]+'月';
				}
				loadWrongNote();
			}
		});
		
		
		
		
		
		
		
		
	}]);