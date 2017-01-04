/**
 * 存放通用的工具类
 */
 import app from 'app';


export default	app.factory('Toolkit',['$window','$location',function($window,$location){
		
		
		/**
		 * 手机号码正则表达式
		 */
		var MOBILE_PATTERN = /^(0|86|17951)?(13[0-9]|15[012356789]|17[0678]|18[0-9]|14[57])[0-9]{8}$/;
		/**
		 * 邮箱正则表达式
		 */
		var EMAIL_PATTERN = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+/;
		
		var orderCode = ['零','一','二','三','四','五','六','七','八','九','十'];
		
		
		var tools = {
				initQList:function(num1,num2){
				    angular.forEach(angular.element('ul.q-list').find('li'),function(elem,index){
				        if(index>=num1&&index<num2){
				            $(elem).css('visibility','visible');
				        }else{
				            $(elem).css('visibility','hidden');
				        }
				    })
				},
				getDomain:function(){
					var domain = [];
					var protocol = $location.protocol();
					domain.push(protocol);
					domain.push('://');
					var host = $location.host();
					domain.push(host);
					var port = $location.port();
					
					if(port !='' && port != '80'){
						domain.push(':');
						domain.push(port);
					}
					return domain.join('');
				},
				detectOS:function(){
				    var sUserAgent = navigator.userAgent;
				    var isWin = (navigator.platform == "Win32") || (navigator.platform == "Windows");
				    if (isWin) {
				        var isWin7 = sUserAgent.indexOf("Windows NT 6.1") > -1 || sUserAgent.indexOf("Windows 7") > -1;
				        if (isWin7) return "Win7";
				        var isWin8 = sUserAgent.indexOf("Windows NT 6.2") > -1 ||sUserAgent.indexOf("Windows NT 6.3") > -1 || sUserAgent.indexOf("Windows 8") > -1;
				        if (isWin8) return "Win8";
				        var isWin10 = sUserAgent.indexOf("Windows NT 10.0") > -1 || sUserAgent.indexOf("Windows 10") > -1;
				        if (isWin10) return "Win10";
				    }
				    return "other";
				},
				getCookie:function (name) {
					    var arr,reg=new RegExp("(^| )"+name+"=([^;]*)(;|$)");
    				    if(arr=document.cookie.match(reg)){
    						return unescape(arr[2]);
    				    } else{
    						return null;
    					}
				},
				//为了删除指定名称的cookie，可以将其过期时间设定为一个过去的时间 
				delCookie:function(name){
					var date = new Date(); 
		            date.setTime(date.getTime() - 10000); 
		            document.cookie = name + "=null; expires=" + date.toGMTString(); 
				},
				/**
				 * 将url种的参数转成json
				 */
				serializeParams:function(){
					var search = $window.location.search;
					if(search.indexOf('?')==0){
						search = search.substring(1);
					}
					var params = search.split('&');
					var result = {};
					angular.forEach(params,function(param){
						var nvp = param.split('=');
						if(nvp.length==2){
							result[nvp[0]]=nvp[1];
						}
					});
					return result;
				},
				trim:function(str){
					return str.replace(/(^\s*)|(\s*$)/g, "");
				},
				isMobile:function(phone){
					if (!MOBILE_PATTERN.test(phone)) {
						return false;
					}
					return true;
				},
				isEmail:function(email){
					if (!EMAIL_PATTERN.test(phone)) {
						return false;
					}
					return true;
				},
				isNotNull:function(obj){
					return angular.isDefined(obj) && obj != null;
				},
				join:function(arr,suffix,split,joinChar){
					arr = arr ||[];
					suffix = suffix ||'';
					split = split || '、';
					joinChar = joinChar || '和';
					var length = arr.length;
					if(length>2){
						return (arr.slice(0,length-1).join(split)+joinChar+arr[length-1]+suffix);
					}else{
						return (arr.join(joinChar)+suffix);
					}
				},
				getOrderNumber:function(index){
		            var num = index;
		            var numArr = num.toString().split("");
		            var exerciseNum = "";
		            if(num <= 10){
		                exerciseNum = orderCode[num];
		            }else if(num > 10 && num <= 99){
		                if(numArr[1]==0){
		                    exerciseNum = orderCode[numArr[0]]+"十";
		                }else{
		                    if(numArr[0]==1){
		                        exerciseNum = "十"+orderCode[numArr[1]];
		                    }else{
		                        exerciseNum = orderCode[numArr[0]]+"十"+orderCode[numArr[1]];
		                    }
		                }
		            }else if(num >= 100 && num <= 999){
		                if(numArr[2]==0){
		                    if(numArr[1]==0){
		                        exerciseNum = orderCode[numArr[0]]+"百";
		                    }else{
		                        exerciseNum = orderCode[numArr[0]]+"百"+orderCode[numArr[1]]+"十";
		                    }
		                }else{
		                    if(numArr[1]==0){
		                        exerciseNum = orderCode[numArr[0]]+"百零"+orderCode[numArr[2]];
		                    }else{
		                        exerciseNum = orderCode[numArr[0]]+"百"+orderCode[numArr[1]]+"十"+orderCode[numArr[2]];
		                    }
		                }
		            }
		            return exerciseNum;
		        },
		        /**
		         * 计算练习名字
		         *  @param chapterSnapshot
		         *  <pre>
		         *  			{
		         *  				'xxxx' :{ //xxxx是ID
		         *  					count : 0, //改章节的题目数
		         *  					type : 1,	// 1是知识点 0是练习
		         *  					chapter : { //存储路径
		         *  						
		         *  					}
		         *  				}
		         *  			}
		         *  </pre>
		         *  @param chapterTree
		         *  <pre>
		         *  		{
		         *  			
		         * 		}
		         *  </pre>
		         */
		        calcExerciseName : function( chapterSnapshot , chapterTree,knowledgeTree){
					var path = [];
					var firstPath = [];
					var lastType = -1;
					var item = null;
					var isComplex = false;
					for(var key in chapterSnapshot){
						item = chapterSnapshot[key];
						if(lastType != -1 && lastType !=item.type){
							isComplex = true;
							break;
						}
						lastType  =item.type;
						var tmpPath  = item.chapter.path;
						if(firstPath.length ==0){
							firstPath = tmpPath;
						}
						if(path.length ==0){
							path = tmpPath;	
						}else{
							var length = Math.min(path.length,tmpPath.length);
							var swiperPath = [];
							for(var i=0;i<length;i++){
								if(path[i]==tmpPath[i]){
									swiperPath.push(path[i]);
								}else{
									break;
								}
							}
							path = swiperPath;
						}
					}
					if(isComplex){
						return '综合练习';
					}
					if(path.length==0){
						if(firstPath.length>0){
							if(lastType==0){
								return chapterTree[firstPath[0]].Name;
							}else{
								return knowledgeTree[firstPath[0]].Name;
							}
						}else{
							return '';
						}
					}else{
						var chapter = null;
						for(var i = 0; i<path.length;i++){
							if(chapter==null){
								if(lastType==0){
									chapter = chapterTree[path[i]];
								}else{
									chapter = knowledgeTree[path[i]];
								}
							}else{
								chapter = chapter.children[path[i]];
							}
						}
						if(chapter!=null){
							return chapter.Name;
						}else{
							return '';
						}
					}
		        }
		};
		return tools;
	}]);