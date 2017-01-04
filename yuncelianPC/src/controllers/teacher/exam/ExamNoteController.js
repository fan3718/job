'use strict';
import app from 'app';
import 'services/Toolkit';
import 'services/ExamService';
import 'services/ReportService';

/**
     * 单次试卷错题报告
     */
export default app.controller('ExamNoteController',['$scope','$filter','ReportService','ExamService','Toolkit',function($scope,$filter,ReportService,ExamService,Toolkit){

        $scope.params = Toolkit.serializeParams();

        $scope.notes = [];
        $scope.report = {};
        ReportService.getExerciseWrongNote($scope.params.exerId).then(function(result){
            $scope.report = result;
            //对题目进行分类
            /*[
             *  {
             *      sectionCode :1,
             *      sectionName:2,
             *      questions:[
             *      ]
             *  }
             * ]
             */
            //获取试卷题目结构（主要是为了获取题目的sectionName）
            ExamService.getDetailByExerId($scope.params.exerId).then(function(info){
                var questionSet = {};
                if(Toolkit.isNotNull(info) && Toolkit.isNotNull(info.groupTitleList)){
                    angular.forEach(info.groupTitleList,function(title){
                        var quests = info.questionTable[title];
                        angular.forEach(quests,function(question){
                            question.sectionName = ExamService.getSectionName(title);
                            questionSet[question.id] = question;
                        });
                    });
                }
                var tmpInfo = {};
                angular.forEach( result.quests,function(question){

                    if(!Toolkit.isNotNull(info) || (Toolkit.isNotNull(info) &&question.id != info.id)){ //套卷有一道题是存储的 套卷信息的，需要排除

                        var item = tmpInfo[''+question.type];
                        if(angular.isUndefined(item)){
                            item = {};
                            item.sectionCode = question.type;
                            item.sectionName =Toolkit.isNotNull(questionSet[question.id])?questionSet[question.id].sectionName:'未知';
                            item.questions = [];
                            tmpInfo[''+question.type]=item;
                        }


                        var options = question.options;
                        if(angular.isUndefined(options) || options.length <=0){
                            question.chartOption = createChartOption($scope.report.studentCount,question);
                        }

                        item.questions.push(question);
                    }

                });

                $scope.notes = [];
                for(var key in tmpInfo){
                    $scope.notes.push(tmpInfo[key]);
                }
                //delete tmpInfo;
            });

        },function(msg){

        });

        function createChartOption(total,question){

            var distribute = question.answerDistribute;
            var rightPercent = '0';
            var wrongPercent = '0';
            var halfPercent = '0';
            if(total !=0){
                if(angular.isDefined(distribute['正确'])){
                    var right = parseFloat((distribute['正确'].length*100/total).toFixed(2));
                    rightPercent = ''+right;
                }
                if(angular.isDefined(distribute['错误'])){
                    wrongPercent = ''+parseFloat((distribute['错误'].length*100/total).toFixed(2));
                }
                if(angular.isDefined(distribute['半对'])){
                    halfPercent = ''+parseFloat((distribute['半对'].length*100/total).toFixed(2));
                }
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
                    data: ["正确","半对","错误"]
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
                        data:[rightPercent, '-','-']
                    },
                    {
                        name:'半对选项',
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
                                color:'#6899cc',
                            },
                        },
                        barWidth:50,
                        data:['-',halfPercent, '-']
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
                        data:['-','-',wrongPercent]
                    }
                ]
            };
            return option;
        }

        $scope.toggleAnalysis = function(question){
            question.showAnalysis = !question.showAnalysis;
        }

    }]);