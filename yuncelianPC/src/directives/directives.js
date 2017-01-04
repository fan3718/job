import app from 'app';
	app.directive('ngMarquee',[function(){
		return {
			restrict: 'AC',
			link :  function (scope, elem, attr){

			}
		};
	}]);
	//点击列表滚动到对应题目
	app.directive('ngScrolltop',['$timeout',function($timeout){
		return {
			restrict: "CA",
			link:function(scope,elem,attrs){
				var obj=angular.element(elem);
				$timeout(function(){
					obj.attr("ngScrolltop",obj.offset().top);
				})
			}
		}
	}])
	/*app.directive('ngFix',['$timeout','$window',function($timeout,$window){
	 return {
	 restrict: "CA",
	 link:function(scope,elem,attrs){
	 var obj=angular.element(elem);
	 var objAuth=angular.element($window);
	 var top=obj.offset().top;
	 objAuth.scroll(function(){
	 if(objAuth.scrollTop()>top){
	 obj.addClass('fix-box');
	 }else{
	 obj.removeClass('fix-box');
	 }
	 })
	 }
	 }
	 }])*/
	app.directive('countTime',['$timeout',function($timeout){
		return {
			restrict: "CA",
			link:function(scope,elem,attrs){
				scope.$watch('duration',function(){
					if (typeof scope.duration == 'number') {
						var count = parseInt(scope.duration);
						var obj = $(elem);
						setInterval(function () {
							count++;
							var time = getTime(count);
							scope.countTime = count;
							obj.text(time);
						}, 1000);
					}
				})

				function getTime(count){
					var hour=parseInt(count/3600);
					var min=parseInt(count/60);
					if(min>=60){
						min=min%60;
					}
					var second =count % 60;
					if(hour<1){
						var str=min+'分'+second+'秒';
					}else{
						var str=hour+'小时'+min+'分'+second+'秒';
					}
					return str;
				}
			}
		}
	}])
	app.directive("checkboxGroup", function ($log, $parse) {
		return {
			restrict: "A",
			scope: {
				checkboxGroup: '=',
				ngValue: '='
			},
			link: function (scope, elem, attrs) {
				scope.$watchCollection('checkboxGroup', function (arr) {
					arr = arr || [];
					var index = arr.indexOf(getValue());
					elem[0].checked = index > -1;
					elem.change(function () {
						scope.$apply(function (scp) {
							if (scp.checkboxGroup == null) {
								return;
							}
							var index = scp.checkboxGroup.indexOf(getValue());
							// Add if checked
							if (elem[0].checked) {
								if (index === -1) scp.checkboxGroup.push(getValue());
							}
							// Remove if unchecked
							else {
								if (index !== -1) scp.checkboxGroup.splice(index, 1);
							}
						});
					});
				});

				function getValue() {
					var val = attrs.value || scope.ngValue;
					//$log.debug('checkboxGroup value:'+val);
					return val;
				}
			}
		}
	});

	/**
	 * 初始化数据用
	 */
	app.directive('ngDataInit',[function(){
		return {
			require:'ngModel',
			link:function(scope, elem, attrs,controller){
				controller.$render = function() {
					controller.$setViewValue(elem.html());
				}
			}
		};
	}]);


	app.directive('ngRate',[function(){
		return {
			restrict: "A",
			scope :{
				ngDifficulty : '=?',
				ngTotal : '=?',
				ngLabel:'=?'
			},
			link : function(scope,element,attrs){
				scope.ngDifficulty= scope.ngDifficulty || 0 ;
				scope.ngTotal = scope.ngTotal || 5;
				scope.ngLabel = scope.ngLabel || '难度';
				if(scope.ngDifficulty > scope.ngTotal){
					scope.ngDifficulty = scope.ngTotal;
				}
				/*element.append('<span class="tag-name-label">'+scope.ngLabel+' </span>');
				 for(var i=0;i<scope.ngDifficulty;i++){
				 element.append('<span class="icon-difficulty-fill"></span>');
				 }
				 for(var i=0;i<scope.ngTotal - scope.ngDifficulty;i++){
				 element.append('<span class="icon-difficulty-blank"></span>');
				 }*/
				init();
				function init(){
					element.html('');
					element.append('<span class="tag-name-label">'+scope.ngLabel+' </span>');
					for(var i=0;i<scope.ngDifficulty;i++){
						element.append('<span class="icon-difficulty-fill"></span>');
					}
					for(var i=0;i<scope.ngTotal - scope.ngDifficulty;i++){
						element.append('<span class="icon-difficulty-blank"></span>');
					}
				}

				scope.$watch('ngDifficulty',function(newValue,oldValue){
					if(newValue != oldValue){
						init();
					}
				});


			}
		};
	}]);










	/**
	 * Option根据不同长度进行不同的排列
	 * 如果都小于1/4
	 *
	 */
	app.directive('ngResizeOption',['$timeout',function($timeout){
		return {
			restrict: "AE",
			controller: ['$scope', '$element', '$attrs',function($scope, $element, $attrs) {
				var rw = $element.width();
				//1/2
				var halfWidth = rw/2;
				//1/4
				var quartWidth = rw/4;
				//存储子节点
				var children = [];
				this.addChild = function(child){
					children.push(child);
				}
				$timeout(function(){

					//选项排列模式
					var displayMode = 0; //0--->1/4  1--->1/2   2---->1/1

					for(var i=0;i<children.length;i++){
						var width = children[i].outerWidth(true);
						if(width<quartWidth){
							displayMode = Math.max(0,displayMode);
						}else if(width<halfWidth){
							displayMode = Math.max(1,displayMode);
						}else{
							displayMode = Math.max(2,displayMode);
						}
					}

					var width = quartWidth;
					switch (displayMode) {
						case 1:
							width = halfWidth;
							break;
						case 2:
							width = rw;
							break;
						default:
							break;
					}
					for(var i=0;i<children.length;i++){
						var item = children[i];
						item.width(width-parseInt(item.css('padding-left'))-parseInt(item.css('padding-right'))-10);
					}
				}.bind(this));
			}]
		};
	}]);


	app.directive('ngOptionItem',[function(){
		return {
			restrict: "AE",
			require: '^ngResizeOption',
			link:function(scope,element,attrs,ngResizeOption){
				ngResizeOption.addChild(element);
			}
		};
	}]);





	/**
	 * 雷达图表
	 */
	app.directive('ngRadar',function(){

		//半径
		var radius = [40,78,112,137,168];

		var PI = 3.1415;

		function createElement(name){
			return document.createElementNS("http://www.w3.org/2000/svg", name);
		}


		function createSvgObject(name,option){
			var obj = createElement(name);
			if(option!=undefined){
				for(var key in option){
					obj.setAttribute(key,option[key]);
				}
			}
			return obj;
		}
		/**
		 * 创建文本
		 */
		function createText(x,y,text,style,anchor){
			anchor = anchor || 'middle';
			var element =createElement("text");
			element.setAttribute("x", x);
			element.setAttribute("y", y);
			element.setAttribute("style",style);
			element.setAttribute("dy",'0.3em');
			element.textContent=text;
			element.setAttribute('text-anchor',anchor);
			return element;
		}
		/**
		 * 创建线
		 */
		function createLine(x1,y1,x2,y2,style){
			var line = createElement( "line");
			line.setAttribute("x1", x1);
			line.setAttribute("y1", y1);
			line.setAttribute("x2", x2);
			line.setAttribute("y2", y2);
			line.setAttribute("style",style);
			return line;
		}
		/**
		 * 创建多边形
		 */
		function createPolygon(points,style,dasharray){
			var polygon = createElement( "polygon");
			polygon.setAttribute("points", points);
			polygon.setAttribute("style", style);
			if(dasharray!=undefined && dasharray!='undefined'){
				polygon.setAttribute("stroke-dasharray", dasharray);
			}
			return polygon;
		}

		function createCircle(cx,cy,r,style){
			var circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
			circle.setAttribute("cx", cx);
			circle.setAttribute("cy", cy);
			circle.setAttribute("r", r);
			circle.setAttribute("style", style);
			return circle;
		}
		return {
			restrict: 'EA',
			scope:{
				ngRadar:'='
			},
			link:function(scope,element,attrs){

				scope.ngRadar = scope.ngRadar || {};

				console.log(scope.ngRadar);

				var MAX_VALUE = scope.ngRadar.max || 100;
				var data = scope.ngRadar.data|| [];
				var labels = scope.ngRadar.labels|| [];





				var width = element.width();
				var height = element.height();

				//中心坐标
				var centerX = width/2;

				var centerY = height/2;


				var maxRadius = radius[radius.length-1];


				var axisRadius=maxRadius+12;

				var axisPoints = [];

				var svg = createElement('svg');
				svg.setAttribute('width',width);
				svg.setAttribute('height',height);
				var angles =[];
				var points = [];

				var dataPoints = [];


				for(var j=0;j<radius.length;j++){
					points.push([]);
				}

				var g = createElement('g');
				for(var i=0;i<5;i++){
					var angle = 3*PI/2+2*PI/5*i;
					angles.push(angle);

					for(var j=0;j<radius.length;j++){
						var r = radius[j];

						var x=centerX+parseInt(r*Math.cos(angle));
						var y = centerY+parseInt(r*Math.sin(angle));
						var point = [];
						point.push(x);
						point.push(y);
						points[j].push(point);
					}



					var x=centerX+parseInt(axisRadius*Math.cos(angle));
					var y = centerY+parseInt(axisRadius*Math.sin(angle));

					var point = [];
					point.push(x);
					point.push(y);
					axisPoints.push(point);


					var r = maxRadius*Math.min(data[i]/MAX_VALUE,1);
					x=centerX+parseInt(r*Math.cos(angle));
					y=centerY+parseInt(r*Math.sin(angle));
					point = [];
					point.push(x);
					point.push(y);
					dataPoints.push(point);

				}

				var maxPoints = points[points.length-1];

				for(var i=0;i<maxPoints.length;i++){

					var line=createLine(centerX,centerY,maxPoints[i][0],maxPoints[i][1],"stroke:#ffac47;stroke-width:1");
					g.appendChild(line);


					var x = axisPoints[i][0];
					var y = axisPoints[i][1];
					var circle = createCircle(axisPoints[i][0],axisPoints[i][1],7,"stroke:#ffe0a8;stroke-width:3;fill:#ffac47");
					g.appendChild(circle);


					var text = null;
					var anchor = 'middle';
					if(x > centerX){
						anchor = 'start';
						x = x+8+7;
						if(y<centerY){

						}else{

						}
					}else if(x<centerX){
						anchor = 'end';
						x = x-8-7;
					}else{
						if(y<centerY){
							y = y-8-12;
						}else{
							y = y+8;
						}
					}



					var text =  createText(x,y,labels[i],"fill:#4a5c7a",anchor);
					g.appendChild(text);


				}
				//绘制最外层实线
				var polygon = createPolygon(maxPoints,'stroke:#ffac47;stroke-width:1;fill:transparent');
				g.appendChild(polygon);
				//绘制各个虚线区域
				for(var i=0;i<points.length-1;i++){
					var polygon = createPolygon(points[i],'stroke:#ffac47;stroke-width:1;fill:transparent','5,5');
					g.appendChild(polygon);
				}
				svg.appendChild(g);
				//绘制数据区域
				g = createElement("g");
				var polygon = createPolygon(dataPoints,'stroke:#ffac47;stroke-width:2;fill:rgba(255,172,71,0.4)');
				g.appendChild(polygon);
				//数据区域各个顶点
				for(var i=0;i<dataPoints.length;i++){
					var circle = createCircle(dataPoints[i][0],dataPoints[i][1],4,"stroke:#ffac47;stroke-width:2;fill:#ffffff");
					g.appendChild(circle);
				}
				svg.appendChild(g);
				element[0].appendChild(svg);
			}
		};
	});


	app.directive('ngFillBlank',['$timeout',function($timeout){
		return {
			restrict:'AC',
			scope:{
				ngFillBlank:'=',
				callback:'&'
			},
			link:function($scope, $element, $attrs){
				$timeout(function(){
					var input=$element.find('.fill-in-blank');
					var value = '';
					if(angular.isDefined($scope.ngFillBlank)&&angular.isDefined($scope.ngFillBlank.userAnswer)){
						value = $scope.ngFillBlank.userAnswer;
					}
					input.val(value);
					input.bind('blur', function() {
						$scope.callback({question:$scope.ngFillBlank,value:$(this).val()});
					});
				},10);
			}
		};
	}]);


	app.directive('ngNumberInput',[function(){
		return {
			restrict:'A',
			require:'?ngModel',
			scope:{
				ngNumberInput:'@'
			},
			link:function($scope, $element, $attrs,ngModel){
				var maxNumber = parseInt($scope.ngNumberInput || -1);
				function isValidCode(code){
					console.log(code);
					return (code >=48 && code<=57)||code ==8||(code>=37&&code<=40);
				}
				$element.on('keydown',function(event){
					var code = event.keyCode;
					var oldValue = $element.val();
					console.log(oldValue);
					//0~9 || 退格 || 上下左右键
					if(isValidCode(code)){

						if(maxNumber!=-1){
							if(parseInt(oldValue) >maxNumber){
								return false;
							}
						}
						$element.attr('data-old-value',oldValue);
					}else{
						return false;
					}
				}).on('keyup',function(event){
					var code = event.keyCode;
					if(isValidCode(code)){
						var value = $element.val();
						if(value.indexOf('0')==0){
							var newValue = parseInt(value);
							$element.val(newValue);
							$scope.$apply(function() {
								ngModel.$setViewValue(newValue);
							});
						}
						value = $element.val();
						if(maxNumber!=-1){
							if(parseInt(value) >maxNumber){
								var oldValue = $element.attr('data-old-value');
								$element.val(oldValue);
								//$ctrl.$setViewValue(oldValue);
								$scope.$apply(function() {
									ngModel.$setViewValue(oldValue);
								});
								return false;
							}
						}

						if(value ==''){
							$element.removeAttr('data-old-value');
						}
					}
				}).on('blur',function(){
					var value = $element.val();
					if(value==''){
						$element.val('0');
						$scope.$apply(function() {
							ngModel.$setViewValue('0');
						});
					}
					$element.removeAttr('data-old-value');
				});
			}
		};
	}]);

	app.directive('quickCode',['$parse',function($parse){
		return {
			restrict:'A',
			templateUrl:'/js/app/tpls/student/quick-code.html',
			replace:true,
			link:function(scope, element, attrs,ngModel){
				scope.isShowQuickCodeTip = false;
				console.log(scope.isShowQuickCodeTip);

			}
		}
	}]);
	app.directive('ngCar',['$timeout',function($timeout){
		return {
			restrict: 'AC',
			templateUrl:'/js/app/tpls/carousel.html',
			replace:true,
			scope:{
				images:'='
			},
			link :  function (scope, element, attrs){
				scope.index = 0;
				scope.left = 0;
				scope.isCarouselShow = false;
				scope.SliderWidth  = 552*scope.images.length+'px';
				scope.InfoImgsWidth = 150*scope.images.length+'px';
				//scope.SliderHeightNow
				scope.showGallery = function($index){
					scope.isCarouselShow =  true;
					scope.index = $index;
					$timeout(function(){
						var imgs  = jQuery(element[0]).find(".img-box>img");
						var aHeight  = [];
						angular.forEach(imgs,function(img){
							aHeight.push(img.offsetHeight+'px');
						});
						scope.aHeight = aHeight;
						scope.SliderHeightNow = scope.aHeight[scope.index];
					})

				}
				scope.hasMoreNext = true;
				scope.hasMorePrev = false;
				scope.isActive = function ($index) {
					if($index ==scope.index){
						return true;
					}
					return false;
				}
				scope.setIndex=function($index){

					scope.index = $index;
				}
				scope.next = function ($event) {
					scope.index++;
					if(scope.index==scope.images.length){
						scope.index = scope.images.length-1;
					}
					$event.stopPropagation();
				}
				scope.prev = function ($event) {
					scope.index--;
					if(scope.index<0){
						scope.index = 0;
					}
					$event.stopPropagation();
				}
				scope.nextBundle = function ($event) {
					scope.index+=4;
					if(scope.index>=scope.images.length){
						scope.index = scope.images.length-1;
					}
					$event.stopPropagation();
				}
				scope.prevBundle = function ($event) {
					scope.index-=4;

					if(scope.index<0){
						scope.index = 0;
					}
					$event.stopPropagation();
				}
				scope.$watch('index',function(newValue,oldValue){
					if(newValue==0&&scope.images.length==1){
						scope.hasMorePrev = false;
						scope.hasMoreNext = false;
					}else if(newValue==0){
						scope.hasMorePrev = false;
						scope.hasMoreNext =true;
					}else if(newValue==scope.images.length-1){
						scope.hasMorePrev = true;
						scope.hasMoreNext = false;
					}else{
						scope.hasMorePrev = true;
						scope.hasMoreNext = true;
					}

					scope.SliderLeft = -552*scope.index+'px';
					scope.InfoImgsLeft = -(150*4)*(Math.floor((scope.index/4)))+'px';
					console.log(scope.InfoImgsLeft);
					//
					if(scope.aHeight){
						scope.SliderHeightNow = scope.aHeight[scope.index];
						console.log(scope.SliderHeightNow);
					}

				})
				scope.hideGallery = function(){
					scope.isCarouselShow =  false;
				}




			}
		};
	}]);
	app.directive('ngPlaceholder',[function(){
		return {
			restrict: 'A',
			scope:{
				placeholder:'@',
			},
			link:function(scope,element){
				if(!("placeholder" in document.createElement("input"))){
					var that = element,
		            text= scope.placeholder;
		            if(that.val()===""){
		              that.val(text).addClass('placeholder');
		            }
		            that.focus(function(){
		              if(that.val()===text){
		                that.val("").removeClass('placeholder');
		              }
		            })
		            .blur(function(){
		              if(that.val()===""){
		                that.val(text).addClass('placeholder');
		              }
		            })
		            .closest('form').submit(function(){
		              if(that.val() === text){
		                that.val('');
		              }
		            });
				}
			}
		}
	}]);

	app.directive('ngShowAnimate',[function(){
        return{
            restrict: 'A',
            link:function(scope,element,attrs){
                angular.element(element).mouseenter(function(){
                    if(!$(this).parent().find('div.'+attrs.label).is(':animated')){
                        $(this).parent().find('div.'+attrs.label).stop(true,false).animate({
                            'opacity':1,
                            'right':'-75px'
                        },300);
                    }
                }).mouseleave(function(){
                    $(this).parent().find('div.'+attrs.label).stop(true,false).animate({
                        'opacity':0,
                        'right':'-30px'
                    },300);
                })
            }
        }
    }]);
