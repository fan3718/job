import app from 'app';
import 'services/Toolkit';
export default app.directive('ngDoodle',['$parse','$log','$timeout','$rootScope','Toolkit',function($parse,$log,$timeout,$rootScope,Toolkit){
		return {
			scope:{
				//ngDoodle: '='
				ngDoodle: '&',
				ngScore:'@'
			},
			require:'^ngDoodleView',
			link: function (scope, elem, attrs,view) {
				scope.ngScore = scope.ngScore || 0 ;
				scope.id=attrs.id;
				var Doodle = (function(){
					/**
					 * 工作画布
					 */
					var mCanvas;


					var mContext;

					var mHistory = [];
					var mUndoHistory = [];
					var mRedoHistory = [];
					var isMobileDevice = false;


					var isLocked = false;


					var mWidth = 0;
					var mHeight = 0;

					var mCurrentX = null;

					var mCurrentY = null;

					var mImageRect = [];

					var isEditMode = false;

					var undoCallback = null;

					var redoCallback = null;


					var mScoreImages = {};

					var mScoreCircleImage = null;

					var mPlusImage = null;


					var mScore = 0;

					function Doodle(width,height){
						this.initCanvas(width,height);
						//this.initScoreImages();
						this.bindEvent();
					}


					Doodle.prototype.initCanvas = function(width,height){

						this.mWidth = width;
						this.mHeight = height;

						this.mCanvas = document.createElement("canvas");
						this.mCanvas.width = width || 800;
						this.mCanvas.height = height || 600;
						/*
						 this.mContext = this.mCanvas.getContext("2d");
						 this.mContext.lineJoin = "round";
						 this.mContext.strokeStyle = '#FF0000';
						 this.mContext.lineWidth = 2;
						 */
						this.initContext();

						this.mCurrentX = [];
						this.mCurrentY = [];
						this.mUndoHistory = [];
						this.mRedoHistory = [];
						this.mImageRect = [];
						this.isEditMode = false;
						this.mScore = scope.ngScope;
					}
					Doodle.prototype.initContext = function(){
						if(window._verBrower=="IE 8.0"){
							this.mCanvas=window.G_vmlCanvasManager.initElement(this.mCanvas);
						}
						this.mContext = this.mCanvas.getContext("2d");
						this.mContext.lineJoin = "round";
						this.mContext.strokeStyle = '#FF0000';
						this.mContext.lineWidth = 2;
					}

					Doodle.prototype.setWidth = function(width){
						this.mWidth = width;
						this.mCanvas.width = width || 800;
					}

					/*Doodle.prototype.setHeight = function(height){
					 this.mHeight = height;
					 this.mCanvas.height = height || 600;
					 }
					 */
					/**
					 * 初始化分数图片数据
					 */
					Doodle.prototype.initScoreImages = function(){
						this.mScoreImages = {};
						var _self = this;
						for(var i=0;i<10;i++){
							(function(number){
								var image = new Image();
								image.src ='/img/web/'+number+'.png';
								image.onload = function(){
									//console.log('complete:'+image.width+"   "+image.height);
									_self.mScoreImages[number]=image;
								}
							})(i);
						}

						(function(){
							var image = new Image();
							image.src ='/img/web/score-circle.png';
							image.onload = function(){
								console.log('complete:'+image.width+"   "+image.height);
								_self.mScoreCircleImage  = image;
							}
						})();



						(function(){
							var image = new Image();
							image.src ='/img/web/plus.png';
							image.onload = function(){
								console.log('complete:'+image.width+"   "+image.height);
								_self.mPlusImage  = image;
							}
						})();

					}

					/**
					 *	事件绑定
					 */
					Doodle.prototype.bindEvent = function(){
						var _self = this;
                        var windowsNT=Toolkit.detectOS();
						this.isMobileDevice =("createTouch" in document);
                        if(windowsNT=="Win10"){
                            this.isMobileDevice=false;
                        }
						var startEvent = this.isMobileDevice ? "touchstart" : "mousedown";//支持触摸式使用相应的事件替代
						this.mCanvas['on'+startEvent] = function(e){
			                //阻止浏览器默认行为
			                e.preventDefault();
							if(!_self.isEditMode){
								return;
							}
							_self.mCurrentX = [];
							_self.mCurrentY = [];
							var touch=_self.isMobileDevice ? e.touches[0] : e;

							var pos = _self.getPosition(touch);

							var _x=pos.x;//鼠标在画布上的x坐标，以画布左上角为起点
							var _y=pos.y;//

							_self.movePoint(_x,_y);//记录鼠标位置
							_self.drawPoint(_x,_y,false);//绘制路线



							_self.isLocked = true;
						}


						var moveEvent = this.isMobileDevice ? "touchmove" : "mousemove";

						this.mCanvas['on'+moveEvent] = function(e){
							if(!_self.isEditMode){
								return;
							}

							var touch=_self.isMobileDevice ? e.touches[0] : e;
							if(_self.isLocked ){
								var pos = _self.getPosition(touch);
								var _x=pos.x;//鼠标在画布上的x坐标，以画布左上角为起点
								var _y=pos.y;//
								_self.movePoint(_x,_y,true);//记录鼠标位置
								_self.drawPoint(_x,_y,true);//绘制路线
							}

						}


						var endEvent = this.isMobileDevice ? "touchend" : "mouseup";
						this.mCanvas['on'+endEvent] = function(e){
			                //阻止浏览器默认行为
			                e.preventDefault();
							if(!_self.isEditMode){
								return;
							}

							if(_self.mCurrentX.length != 0 && _self.mCurrentY.length!=0){
								_self.addTrail();
								_self.draw();
							}
							_self.isLocked = false;
						}

						if(!isMobileDevice){
							this.mCanvas['onmouseout'] = function(e){
				                //阻止浏览器默认行为
				                e.preventDefault();
								if(_self.mCurrentX.length != 0 && _self.mCurrentY.length!=0){
									_self.addTrail();
									_self.draw();
								}

								_self.isLocked = false;
							}
						}


					}

					Doodle.prototype.addTrail = function (){
						var item = {};
						item.x = this.mCurrentX;
						item.y = this.mCurrentY;
						this.mUndoHistory.push(item);
						this.mCurrentX = [];
						this.mCurrentY =[];
						this.notifyListener();
					}

					Doodle.prototype.movePoint = function(x,y,dragging){
						this.mCurrentX.push(x);
						this.mCurrentY.push(y+32);
					}

					/**
					 * 画点
					 */
					Doodle.prototype.drawPoint = function(x,y,isMove){
						/*this.mContext.save();
						 //for(var i = 0; i<this.mCurrentX.length;i++){
						 if(!isMove){
						 this.mContext.moveTo(x, y);
						 }else{
						 this.mContext.lineTo(x, y);//context.lineTo(x, y) , 将当前点与指定的点用一条笔直的路径连接起来
						 }
						 //}
						 this.mContext.stroke();//context.stroke() , 绘制当前路径

						 this.mContext.restore();
						 */

						this.drawPointSet(this.mCurrentX,this.mCurrentY);
					}

					Doodle.prototype.drawPointSet = function(x,y){
						this.mContext.beginPath();
                        this.mContext.strokeStyle = '#FF0000';
						for(var i = 0; i<x.length;i++){
							if(i==0){
								this.mContext.moveTo(x[i], y[i]);
							}else{
								this.mContext.lineTo(x[i], y[i]);//context.lineTo(x, y) , 将当前点与指定的点用一条笔直的路径连接起来
							}
						}
						this.mContext.stroke();//context.stroke() , 绘制当前路径
					}

					Doodle.prototype.getCanvas = function(){
						return this.mCanvas;
					}

					/**
					 * 设置画笔颜色
					 */
					Doodle.prototype.setPaintColor = function(color){

					}


					Doodle.prototype.setPaintSize = function(width){

					}


					/**
					 * 导出图片
					 */
					Doodle.prototype.exportImage = function(){
						if(this.mUndoHistory.length!=0){
							return this.mCanvas.toDataURL('image/png');
						}
					}

					/**
					 * 获取鼠标在Canvas中的位置
					 */
					Doodle.prototype.getPosition = function(e){
						var _box = this.mCanvas.getBoundingClientRect();//获得cvs元素相对于浏览器圆点的坐标
						return {
							x:e.clientX-_box.left*(this.mCanvas.width/_box.width),
							y:e.clientY-_box.top*(this.mCanvas.height/_box.height)
						}
					}

					Doodle.prototype.draw = function(){
						this.clear();
						for(var i=0;i<this.mUndoHistory.length;i++){
							var item = this.mUndoHistory[i];
							this.drawPointSet(item.x,item.y);
						}
					}

					Doodle.prototype.clear = function(){
						this.mContext.clearRect(0, 0, this.mWidth, this.mHeight);//清除画布，左上角为起点
						//this.mContext.fillStyle="#FFFFFF";
						//this.mContext.fillRect(0, 0, this.mWidth, this.mHeight);
						this.drawImages();
						this.drawScore();
					}
					/**
					 * 绘制图片
					 */
					Doodle.prototype.drawImages = function(){
						var item = null;
						for(var i =0;i<this.mImageRect.length;i++){
							item = this.mImageRect[i];
							//this.mContext.drawImage(item.image,item.sx,item.sy,item.sw,item.sh,item.dx,item.dy,item.dw,item.dh);
						}
					}

					/**
					 * 绘制分数
					 */
					Doodle.prototype.drawScore = function(){
						var score = this.mScore;
						if(score>0){
							var offsetY = 10;
							var circle = this.mScoreCircleImage;
							var offsetX = this.mWidth  -10;
							if(angular.isDefined(circle) && circle!=null){
								offsetX = offsetX - circle.width;
								this.mContext.drawImage(circle,offsetX,offsetY);
								//需要绘制的分数图片数组
								var scoreImages = [];

								var width = 0;
								var height = 36;
								if(score<10){
									var scoreImage = this.mScoreImages[score];
									scoreImages.push(scoreImage);
									width = scoreImage.width;
								}else{
									var str = score+'';
									for(var i=0;i<str.length;i++){
										var number = parseInt(str.charAt(i));
										var scoreImage = this.mScoreImages[number];
										scoreImages.push(scoreImage);
										width += scoreImage.width;
									}
								}


								var plus =  this.mPlusImage;
								var y = offsetY+circle.height/2-plus.height/2;
								if(angular.isDefined(plus) && plus!=null){
									width += plus.width;
									scoreImages.splice(0,0,plus);
								}
								var left = offsetX + (circle.width-width)/2-10;
								for(var i=0;i<scoreImages.length;i++){
									this.mContext.drawImage(scoreImages[i],left,y);
									left += scoreImages[i].width;
								}

							}

						}else{

						}


					}

					Doodle.prototype.setImages = function(imgs){
						var offsetY=0;
						var _self = this;

						var count = 0;
						for(var i =0;i<imgs.length;i++){
							(function(img){
								if(img.src == ''){
									return;
								}
								var rect = {};
								var originImag = new Image();
								originImag.src =img.src;
								originImag.crossOrigin = 'anonymous';
								//originImag.setAttribute('crossOrigin', 'anonymous');
								originImag.onload = function(){
									count++;
									rect.sx = 0;
									rect.sy = 0;
									rect.sw = originImag.width;
									rect.sh = originImag.height;
									rect.dx = (_self.mWidth-img.width)/2;
									rect.dy = offsetY;
									rect.dw =img.width;
									rect.dh = img.height;
									rect.image = originImag;
									rect.src = originImag.src;
									offsetY+=img.height;

									_self.mImageRect.push(rect) ;
									if(count >=imgs.length){
										
										$rootScope.$broadcast('onImageLoaded',scope.id);
										/*if(offsetY > 0 ){
										 _self.mCanvas.height = offsetY;
										 _self.initContext();
										 }*/
										_self.drawImages();
									}
								}
							})(imgs[i]);
						}


					}

					Doodle.prototype.setHeight = function(height){
						this.mHeight = height;
						this.mCanvas.height = height;
						this.initContext();
					}
					Doodle.prototype.getImageUrls = function(){
						var urls = [];
						for(var i = 0;i<this.mImageRect.length;i++){
							urls.push(this.mImageRect[i].src);
						}
						return urls;
					}

					Doodle.prototype.undo = function(){
						var item = this.mUndoHistory.pop();
						if(typeof(item) !='undefined'){
							this.mRedoHistory.push(item);
							this.draw();
						}
						this.notifyListener();
					}

					Doodle.prototype.reset = function(){
						this.mUndoHistory.splice(0,this.mUndoHistory.length);
						this.mRedoHistory.splice(0,this.mRedoHistory.length);
						this.notifyListener();
					}

					Doodle.prototype.redo = function(){
						var item = this.mRedoHistory.pop();
						if(typeof(item) !='undefined'){
							this.mUndoHistory.push(item);
							this.draw();
						}
						this.notifyListener();
					}

					Doodle.prototype.setEditMode = function(mode){
						this.isEditMode = mode;
					}

					Doodle.prototype.addListener = function(undo,redo){
						this.undoCallback = undo;
						this.redoCallback = redo;
					}


					/**
					 * 设置分数
					 */
					Doodle.prototype.setScore = function(score){
						this.mScore = score;


						this.draw();
						//this.drawScore();
					}

					Doodle.prototype.notifyListener = function(){
						if(typeof(this.undoCallback) == 'function'){
							this.undoCallback(this.mUndoHistory.length==0);
						}

						if(typeof(this.redoCallback) == 'function'){
							this.redoCallback(this.mRedoHistory.length==0);
						}
					}
					return Doodle;
				})();

                $timeout(init_Doodle,0);
                function init_Doodle(){
                    var root = $(elem);

                    var images = root.find('img');



                    root.css("position","relative");
                    root.css("text-align","center");
                    var width = root.width();
                    var height = root.height();
                    var minHeight = 	parseInt(root.css('min-height'));
                    height = Math.max(minHeight,height);
                    if(height<=0){
                        height = root.parent().height();
                    }
                    var _Doodle = new Doodle(width,height);
                    var canvas = _Doodle.getCanvas();
                    var jCanvas = $(canvas);
                    jCanvas.css("position","absolute");
                    //jCanvas.css("background-color","#ffffff");
                    jCanvas.css("z-index","100");
                    jCanvas.css("top","0");
                    jCanvas.css("left","0");
                    /*var imgs = [];

                     $timeout(function(){
                     console.log(images.length);
                     images.each(function(){
                     var src = $(this).attr('src');
                     console.log(src);
                     if(src != ''){
                     imgs.push($(this)[0]);
                     }
                     });
                     _Doodle.setImages(imgs);
                     },0);
                     */



                    root.append(jCanvas);

                    var callback = {
                        mUndoHistory:_Doodle.mUndoHistory,
                        mRedoHistory:_Doodle.mRedoHistory,
                        undo : function(){
                            _Doodle.undo();
                        },
                        redo:function(){
                            _Doodle.redo();
                        },
                        exportImage:function(){
                            return _Doodle.exportImage();
                        },
                        setEditMode:function(editable){
                            _Doodle.setEditMode(editable);
                        },
                        addListener:function(undo,redo){
                            _Doodle.addListener(undo,redo);
                        },
                        setScore:function(score){
                            _Doodle.setScore(score);
                        },
                        measure:function(){
                            var width = root.width();
                            var height = root.height();
                            _Doodle.setWidth(width);
                            _Doodle.setHeight(height);
                        },
                        getImageUrls : function(){
                            return _Doodle.getImageUrls();
                        },
                        setImageUrl:function(url,height){
                            var imgs = [];
                            var image = new Image();
                            image.src =url;
                            imgs.push(image);
                            _Doodle.setImages(imgs);
                            _Doodle.setHeight(height);
                        },
                        renderFlag:true
                    };
                    view.setDoodle(callback);
                    //scope{"ngDoodle":'='}
                    /*if(angular.isFunction(scope.ngDoodle)){
                     scope.ngDoodle(callback);
                     }*/
                    //scope{"ngDoodle":'&'}
                    scope.ngDoodle({data:callback,id:attrs.id});
                }
			}
		};
	}]);