import app from 'app';

export default app.directive('ngEcharts',function(){
		return {
			restrict:'AC',
			scope:{
				ngTotal:'=',
				ngDistribute:'=',
				ngRight:'=',
				ngEcharts:'='
			},
			link:function(scope,element,attrs){
				scope.$watch('ngEcharts',function(newValue,oldValue){
                    if(newValue != oldValue){
                        element[0].innerHTML = "";
                        var chart = echarts.init(element[0]);
                            chart.setOption(scope.ngEcharts);
                    }
                });
				var chart = echarts.init(element[0]);
				if(angular.isDefined(scope.ngEcharts)){
					chart.setOption(scope.ngEcharts);
					return;
				}

				scope.ngRight = scope.ngRight  || '';
				scope.ngTotal = scope.ngTotal || 0;
				scope.ngDistribute = scope.ngDistribute || {};
				var percent = {"A":0,"B":0,"C":0,"D":0};
				var students = {"A":[],"B":[],"C":[],"D":[]};
				//计算各个答案的百分比
				//var total = 0;
				var char = ["A","B","C","D"]
				for(var key in scope.ngDistribute){
					var item = scope.ngDistribute[key] || [];
					for(var i = 0; i<char.length;i++){
						if(key.match(char[i])!=null){
								item.forEach(function(item){
									students[char[i]].push(item);
								})

						}
					}

					//total += item.length;
	            }
						for(var i = 0; i<char.length;i++){
								if(percent[char[i]].length!=0&&scope.ngTotal >0){
									percent[char[i]] = parseFloat((students[char[i]].length*100 / scope.ngTotal).toFixed(1));
								}
							}
				//scope.ngTotal = total;
				  let rightAnswer = scope.ngRight.toUpperCase();

        console.log(rightAnswer);
				//生成对应答案的色值数组
                var colorList = [];
                var answerData = [];
                for(var index=0;index<=3;index++){
                    var key = String.fromCharCode(65+index);
                    var value = percent[key] || 0;
                    if(rightAnswer.indexOf(key) != -1){
                        colorList.push('#68acff');
                    }else{
                        colorList.push('#ffac47');
                    }
                    answerData.push(value);
                }


                 // 指定图表的配置项和数据
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
                            var data = students[key] || [];
                            return params.name + ' . ' + (data.length||0) +'人'+ '<br/>'+data.join('、');
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
                        data: ["A","B","C","D"]
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
                        name:'选项',
                        type:'bar',
                        stack: '总量',
                        label:{
                            normal:{
                                show:true,
                                position:[3,-17],
                                formatter:function(data){
                                    if(data.value == undefined){
                                        data.value = 0;
                                    }
                                    return data.value+'%';
                                }
                            }
                        },
                        itemStyle:{
                            normal:{
                                color:function(params) {
                                        return colorList[params.dataIndex]
                                    }
                            }
                        },
                        barWidth:30,
                        data:answerData
                    }
                ]
                };
                if(window._verBrower=="IE 8.0"){
                    option.tooltip["show"] = false;
                }
                // console.log(option)
                // 使用刚指定的配置项和数据显示图表。
                chart.setOption(option);
            }
        };
    });

    app.directive('ngEchartsRound',function(){
        return {
            restrict:'AC',
            scope:{
                total:'@',
                complete:'@',
                color:'@'
            },
            link:function(scope,element,attrs){

                scope.$watch('complete',function(newValue,oldValue){
                    if(newValue != oldValue){
                        init();
                    }
                });
                init();
                function init(){
                    var _total = scope.total || 0;
                        scope.complement = scope.complement ||false;
                    var _complete = scope.complete|| 0 ;
                    // _complete = 10, _total = 24;
                    var centerData = 0,percent = 100,otherPercent = 0;
                        if(_total != 0){
                            percent = parseFloat((_complete/_total*100).toFixed(2));
                            otherPercent = parseFloat((((_total - _complete)/_total)*100).toFixed(2));
                        }
                    var themeColor = '#ffac47',minColor = "#fff";
                    var littleRadius = [0, 35],bigRadius = [0, 50];
                        if(scope.color == "0"){
                            themeColor = '#ffac47';
                            minColor = 'rgba(255,172,71,0.4)';
                            centerData = _complete+'/'+_total;
                        }else if(scope.color == "1"){
                            themeColor = '#ff8a71';
                            minColor = 'rgba(255,138,113,0.4)';
                            centerData = percent+"%";
                        }else{
                            themeColor = 'rgb(123,222,123)';
                            minColor = 'rgba(123,222,123,0.4)';
                            centerData = _complete+'/'+_total;
                            littleRadius = [0,60];
                            bigRadius = [0, 80]
                        };
                        element[0].innerHTML = "";
                    var chart = echarts.init(element[0]);
                    var option = {
                            title : {
                                text: centerData,
                                x: 'center',
                                y: 'center',
                                textStyle : {
                                    color : 'rgb(255,255,255)',
                                    fontFamily : '微软雅黑',
                                    fontSize : 18,
                                    fontWeight : 'lighter'
                                }
                            },
                            series : [
                                {
                                    name:'1',
                                    type:'pie',
                                    radius : littleRadius,
                                    hoverAnimation : false,
                                    itemStyle : {
                                        normal : {
                                            label: {show:false},
                                            labelLine: {show:false},
                                            color:themeColor
                                        }
                                    },
                                    data:[
                                        {
                                            value:100,
                                            name:'全部'
                                        }
                                    ]
                                },
                                {
                                    name:'2',
                                    type:'pie',
                                    radius : bigRadius,
                                    hoverAnimation : false,
                                    itemStyle : {
                                        normal : {
                                            label: {show:false},
                                            labelLine: {show:false},
                                            color:minColor
                                        }
                                    },
                                    data:[
                                        {
                                            value:percent,
                                            name:'错误'
                                        },
                                        {
                                            value:otherPercent,
                                            name:'invisible',
                                            itemStyle : {
                                                normal : {
                                                    color: 'rgba(0,0,0,0)',
                                                    label: {show:false},
                                                    labelLine: {show:false}
                                                }
                                            }
                                        }
                                    ]
                                }

                            ]
                        };
                    chart.setOption(option);
                }
            }
        };
    });

    app.directive('ngDiagram',['$timeout',function($timeout){
        return {
            link:function(scope,elem,attrs){
                scope.$watch(attrs['ngDiagram'],function(newValue,oldValue){
                    if(angular.isDefined(newValue)){
                        var diagram = echarts.init(elem[0]);
                        var dataTimes=newValue.dataTimes;
                        var completeCounts=newValue.completeCounts;
                        var rightCounts=newValue.rightCounts;
                        var option={
                            legend:{
                                show:'true',
                                orient: 'horizontal',
                                x:'right',
                                y:'top',
                                padding:5,
                                itemGap:10,
                                textStyle:{
                                    color:'#6a9cf0'
                                },
                                data:['正确数量','总数量']
                            },
                            tooltip : {         // Option config. Can be overwrited by series or data
                                trigger: 'axis',
                                //show: true,   //default true
                                showDelay: 20,
                                hideDelay: 0,
                                transitionDuration:0.3,
                                backgroundColor : 'rgba(255,255,255,0)',
                                borderRadius : 0,
                                borderWidth: 0,
                                padding: 10,    // [5, 10, 15, 20]
                                axisPointer:{
                                  type:'none'
                                },
                                position : function(p) {
                                    // 位置回调
                                    // console.log && console.log(p);
                                    return [p[0] - 65, p[1] - 100];
                                },
                                textStyle : {
                                    color: '#fff',
                                    align:'left',
                                    baseline:'middle',
                                    decoration: 'none',
                                    fontFamily: '"Microsoft YaHei", "sans-serif", "Arial", "黑体", "宋体"',
                                    fontSize: 14,
                                    fontStyle: 'normal',
                                    fontWeight: 'normal'
                                },
                                formatter: function (params) {
                                    if(params[0].data==0){
                                        params[0].value=0;
                                    }
                                    if(params[1].data==0){
                                        params[1].value=0;
                                    }
                                    var res = "日期:"+params[0].name+" <br/> 总数量:"+params[1].value+" <br/> 正确数量:"+params[0].value;

                                    return res;
                                }
                                //formatter: "日期:{b} <br/> 总数量:{c1} <br/> 正确数量:{c0} "
                            },
                            xAxis: {
                                type: 'category',
                                position: 'bottom',
                                name: '日期',
                                nameLocation: 'end',
                                nameTextStyle:{
                                    color:'#6a9cf0',
                                    align:'center',
                                    baseline:'bottom',
                                    fontFamily: '"Microsoft YaHei", "sans-serif", "Arial", "黑体", "宋体"',
                                    fontSize: 14,
                                    fontStyle: 'normal',
                                    fontWeight: 'normal'
                                },
                                boundaryGap: false,
                                axisLine: {    // 轴线
                                    show: true,
                                    lineStyle: {
                                        color: '#6a9cf0',
                                        type: 'solid',
                                        width: 1
                                    }
                                },
                                axisTick:{
                                    show:false
                                },
                                axisLabel: {
                                    show: true,
                                    interval: 'auto',    // {number}
                                    rotate: 0,
                                    margin: 20,
                                    formatter:function(value){
                                        return value ;
                                    },
                                    textStyle: {
                                        color: '#6a9cf0',
                                        align:'left',
                                        fontFamily: '"Microsoft YaHei", "sans-serif", "Arial", "黑体", "宋体"',
                                        fontSize: 14,
                                        fontStyle: 'normal',
                                        fontWeight: 'normal'
                                    }
                                },
                                splitLine: {
                                    show: false
                                },
                                data: dataTimes
                            },
                            yAxis:{
                                type: 'value',
                                position: 'left',
                                name: '题量',
                                nameLocation: 'end',
                                nameTextStyle:{
                                    color:'#6a9cf0',
                                    align:'left',
                                    baseline:'bottom',
                                    fontFamily: '"Microsoft YaHei", "sans-serif", "Arial", "黑体", "宋体"',
                                    fontSize: 14,
                                    fontStyle: 'normal',
                                    fontWeight: 'normal'
                                },
                                boundaryGap: false,
                                axisLine: {    // 轴线
                                    show: true,
                                    lineStyle: {
                                        color: '#6a9cf0',
                                        type: 'solid',
                                        width: 1
                                    }
                                },
                                axisTick:{
                                    show:false
                                },
                                axisLabel: {
                                    show: true,
                                    interval: 'auto',    // {number}
                                    rotate: 0,
                                    margin: 20,
                                    formatter:function(value){
                                        return value ;
                                    },
                                    textStyle: {
                                        color: '#6a9cf0',
                                        fontFamily: '"Microsoft YaHei", "sans-serif", "Arial", "黑体", "宋体"',
                                        fontSize: 14,
                                        fontStyle: 'normal',
                                        fontWeight: 'normal'
                                    }
                                },
                                splitLine: {
                                    show: false
                                },
                                data:dataTimes
                            },
                            series:[
                                {
                                    name:'正确数量',
                                    type:'line',
                                    clickAble:false,
                                    xAxisIndex:0,
                                    itemStyle:{
                                        normal:{
                                            color:'#ff9145'
                                        }
                                    },
                                    data:rightCounts
                                },
                                {
                                    name:'总数量',
                                    type:'line',
                                    clickAble:false,
                                    xAxisIndex:0,
                                    itemStyle:{
                                        normal:{
                                            color:'#6a9cf0'
                                        }
                                    },
                                    data:completeCounts
                                }
                            ]

                        };
                        //ie8下提示框有误
                        if(window._verBrower=="IE 8.0"){
                            option.tooltip["show"] = false;
                            option.tooltip["axisPointer"]["type"] = 'cross';
                            option.tooltip["axisPointer"]["axis"] = 'x';
                            option.tooltip["trigger"] = 'axis';
                        }
                        diagram.setOption(option);
                    }
                })

            }
        }
    }])

    /**
     * 雷达图表
     */
    app.directive('ngEchartsRadar',function(){
        return {
            restrict: 'EA',
            scope:{
                ngEchartsRadar:'='
            },
            link:function(scope,element,attrs){
                var radar = echarts.init(element[0]);
                scope.ngRadar = scope.ngEchartsRadar || {};

                var MAX_VALUE = scope.ngRadar.max || 100;
                var data = scope.ngRadar.data|| [];
                // var labels = scope.ngRadar.labels|| [];
                // var labelsData = new Array();
                // for(var i = 0 ; i < labels.lenght; i ++){
                //     var labelsData[i] = new Object();
                // }
                var option = {
                        tooltip: {
                            trigger: 'item',
                            backgroundColor : '#ffac47'
                        },
                        backgroundColor:'#fff',
                        radar: {
                           indicator : [
                               { text: '学习积极性', max: MAX_VALUE},
                               { text: '逻辑思维能力', max: MAX_VALUE},
                               { text: '记忆能力', max: MAX_VALUE},
                               { text: '阅读能力', max: MAX_VALUE},
                               { text: '学习注意力', max: MAX_VALUE}
                            ],
                            name: {
                                textStyle: {
                                    color: '#4a5c7a'
                                }
                            },
                            nameGap :30,
                            axisLine: {
                                lineStyle:{
                                    color:'#ffac47'
                                }
                            },
                            splitLine: {
                                lineStyle:{
                                    color:'#ffac47',
                                    type:'dashed'
                                }
                            },
                            splitArea : {
                                show : true,
                                areaStyle : {
                                    color: ['#fff']
                                }
                            }
                        },
                        series : [
                            {
                                name:'学能测评诊断报告书',
                                type: 'radar',
                                itemStyle: {
                                    normal: {
                                        borderWidth :1,
                                        areaStyle: {color:'rgba(255,172,71,0.4)'}
                                    }
                                },
                                data:[
                                    {
                                        value : data,
                                        symbolSize : 6,
                                        itemStyle: {
                                            normal: {
                                                color:'#ffac47',
                                                borderWidth :1
                                            }
                                        },
                                        lineStyle: {
                                            normal: {
                                                color:'#ffac47',
                                                width:2
                                            }
                                        }

                                    }
                                ]
                            },
                            {
                                name:'全能力值',
                                type: 'pie',
                                markPoint : {
                                    symbol: 'circle',
                                    hoverAnimation : false,
                                    itemStyle: {
                                        normal: {
                                            borderWidth :1,
                                            color:'#ffac47',
                                            shadowColor : '#ffac47',
                                            shadowBlur: 6,
                                            opacity : 0.6
                                        }
                                    },
                                    data : [
                                        {name : MAX_VALUE, x:'50%', y:'9%', symbolSize:10},
                                        {name : MAX_VALUE, x:'29%', y:'37%', symbolSize:10},
                                        {name : MAX_VALUE, x:'37%', y:'83%', symbolSize:10},
                                        {name : MAX_VALUE, x:'63%', y:'83%', symbolSize:10},
                                        {name : MAX_VALUE, x:'71%', y:'37%', symbolSize:10}
                                    ]
                                }
                            }
                        ]
                    };
                    //ie8下提示框有误
                    if(window._verBrower=="IE 8.0"){
                        option.tooltip["show"] = false;
                        option.series[0]["label"] = {normal:{show:true}};
                    }
                radar.setOption(option);
            }
        }
    });
