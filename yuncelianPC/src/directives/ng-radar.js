import app from 'app';

/**
 * 雷达图表
 */
export default app.directive('ngRadar',
				function() {
					// 半径
					var radius = [ 40, 78, 112, 137, 168 ];
					var PI = 3.1415;
					function createElement(name) {
						return document.createElementNS(
								"http://www.w3.org/2000/svg", name);
					}
					function createSvgObject(name, option) {
						var obj = createElement(name);
						if (option != undefined) {
							for ( var key in option) {
								obj.setAttribute(key, option[key]);
							}
						}
						return obj;
					}
					/**
					 * 创建文本
					 */
					function createText(x, y, text, style, anchor) {
						anchor = anchor || 'middle';
						var element = createElement("text");
						element.setAttribute("x", x);
						element.setAttribute("y", y);
						element.setAttribute("style", style);
						element.setAttribute("dy", '0.3em');
						element.textContent = text;
						element.setAttribute('text-anchor', anchor);
						return element;
					}
					/**
					 * 创建线
					 */
					function createLine(x1, y1, x2, y2, style) {
						var line = createElement("line");
						line.setAttribute("x1", x1);
						line.setAttribute("y1", y1);
						line.setAttribute("x2", x2);
						line.setAttribute("y2", y2);
						line.setAttribute("style", style);
						return line;
					}
					/**
					 * 创建多边形
					 */
					function createPolygon(points, style, dasharray) {
						var polygon = createElement("polygon");
						polygon.setAttribute("points", points);
						polygon.setAttribute("style", style);
						if (dasharray != undefined && dasharray != 'undefined') {
							polygon.setAttribute("stroke-dasharray", dasharray);
						}
						return polygon;
					}

					function createCircle(cx, cy, r, style) {
						var circle = document.createElementNS(
								"http://www.w3.org/2000/svg", "circle");
						circle.setAttribute("cx", cx);
						circle.setAttribute("cy", cy);
						circle.setAttribute("r", r);
						circle.setAttribute("style", style);
						return circle;
					}
					return {
						restrict : 'EA',
						scope : {
							ngRadar : '='
						},
						link : function(scope, element, attrs) {

							scope.ngRadar = scope.ngRadar || {};

							console.log(scope.ngRadar);

							var MAX_VALUE = scope.ngRadar.max || 100;
							var data = scope.ngRadar.data || [];
							var labels = scope.ngRadar.labels || [];

							var width = element.width();
							var height = element.height();

							// 中心坐标
							var centerX = width / 2;

							var centerY = height / 2;

							var maxRadius = radius[radius.length - 1];

							var axisRadius = maxRadius + 12;

							var axisPoints = [];

							var svg = createElement('svg');
							svg.setAttribute('width', width);
							svg.setAttribute('height', height);
							var angles = [];
							var points = [];

							var dataPoints = [];

							for (var j = 0; j < radius.length; j++) {
								points.push([]);
							}

							var g = createElement('g');
							for (var i = 0; i < 5; i++) {
								var angle = 3 * PI / 2 + 2 * PI / 5 * i;
								angles.push(angle);

								for (var j = 0; j < radius.length; j++) {
									var r = radius[j];

									var x = centerX
											+ parseInt(r * Math.cos(angle));
									var y = centerY
											+ parseInt(r * Math.sin(angle));
									var point = [];
									point.push(x);
									point.push(y);
									points[j].push(point);
								}

								var x = centerX
										+ parseInt(axisRadius * Math.cos(angle));
								var y = centerY
										+ parseInt(axisRadius * Math.sin(angle));

								var point = [];
								point.push(x);
								point.push(y);
								axisPoints.push(point);

								var r = maxRadius
										* Math.min(data[i] / MAX_VALUE, 1);
								x = centerX + parseInt(r * Math.cos(angle));
								y = centerY + parseInt(r * Math.sin(angle));
								point = [];
								point.push(x);
								point.push(y);
								dataPoints.push(point);

							}

							var maxPoints = points[points.length - 1];

							for (var i = 0; i < maxPoints.length; i++) {

								var line = createLine(centerX, centerY,
										maxPoints[i][0], maxPoints[i][1],
										"stroke:#ffac47;stroke-width:1");
								g.appendChild(line);

								var x = axisPoints[i][0];
								var y = axisPoints[i][1];
								var circle = createCircle(axisPoints[i][0],
										axisPoints[i][1], 7,
										"stroke:#ffe0a8;stroke-width:3;fill:#ffac47");
								g.appendChild(circle);

								var text = null;
								var anchor = 'middle';
								if (x > centerX) {
									anchor = 'start';
									x = x + 8 + 7;
									if (y < centerY) {

									} else {

									}
								} else if (x < centerX) {
									anchor = 'end';
									x = x - 8 - 7;
								} else {
									if (y < centerY) {
										y = y - 8 - 12;
									} else {
										y = y + 8;
									}
								}

								var text = createText(x, y, labels[i],
										"fill:#4a5c7a", anchor);
								g.appendChild(text);

							}
							// 绘制最外层实线
							var polygon = createPolygon(maxPoints,
									'stroke:#ffac47;stroke-width:1;fill:transparent');
							g.appendChild(polygon);
							// 绘制各个虚线区域
							for (var i = 0; i < points.length - 1; i++) {
								var polygon = createPolygon(
										points[i],
										'stroke:#ffac47;stroke-width:1;fill:transparent',
										'5,5');
								g.appendChild(polygon);
							}
							svg.appendChild(g);
							// 绘制数据区域
							g = createElement("g");
							var polygon = createPolygon(dataPoints,
									'stroke:#ffac47;stroke-width:2;fill:rgba(255,172,71,0.4)');
							g.appendChild(polygon);
							// 数据区域各个顶点
							for (var i = 0; i < dataPoints.length; i++) {
								var circle = createCircle(dataPoints[i][0],
										dataPoints[i][1], 4,
										"stroke:#ffac47;stroke-width:2;fill:#ffffff");
								g.appendChild(circle);
							}
							svg.appendChild(g);
							element[0].appendChild(svg);
						}
					};
				});
