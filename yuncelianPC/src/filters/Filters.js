var app = require('app');

app.filter('timeline', [ '$filter', function($filter) {
	return function(input) {
		var now = new Date().getTime();
		var timeSpan = now - input;
		var time = 0;
		if (timeSpan < 60000) {
			return "刚刚";
		} else if (timeSpan < 3600000) {
			time = Math.floor(timeSpan / 60000);
			return time + "分钟前";
		} else if (timeSpan < 24 * 3600000) {
			time = Math.floor(timeSpan / 3600000);
			return time + "小时前";
		} else if (timeSpan < 7 * 24 * 3600000) {
			time = Math.floor(timeSpan / 24 / 3600000);
			return time + "天前";
		} else if (timeSpan < 30 * 24 * 3600000) {
			time = Math.floor(timeSpan / 7 / 24 / 3600000);
			return time + "星期前";
		} else if (timeSpan < 365 * 24 * 3600000) {
			time = Math.floor(timeSpan / 30 / 24 / 3600000);
			return time + "个月前";
		} else {
			return $filter('date')(input, "yyyy年MM月dd日");
		}
	};
} ]);

app.filter('week', [ function() {

	var weeks = [ '周日', '周一', '周二', '周三', '周四', '周五', '周六' ];

	var days = [ '星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六' ];

	return function(input, type, mode) {
		var date = new Date(input);
		type = type || 'week';
		if (type != 'week' && type != 'day') {
			type = 'week';
		}
		var week = '';
		if (type == 'day') {
			week = days[date.getDay()];
		} else {
			week = weeks[date.getDay()];
		}

		mode = mode || 'short';
		if (mode != 'short') {
			var result = new Array();
			result.push((date.getMonth() + 1) + "/" + date.getDate());
			result.push(week);
			result.push((date.getHours() < 10 ? '0' + date.getHours() : date
					.getHours())
					+ ":"
					+ (date.getMinutes() < 10 ? '0' + date.getMinutes() : date
							.getMinutes()));
			return result.join(' ');
		} else {
			return week;
		}
	}
} ]);

app.filter('className', [ function() {
	return function(input) {
		input = input || '';
		var index = input.indexOf('级');
		if (index > -1) {
			return input.substring(index + 1);
		}
		return input;
	};
} ]);

app.filter('subjectName', [ function() {
	return function(input) {
		input = input || '';

		if (input.length >= 4) {
			return input.substring(2);
		}

		return input;
	};
} ]);

/**
 * 展示html
 */
app.filter('trusted', [
		'$sce',
		function($sce) {
			return function(input, split) {
				input = input || '';
				split = split || '、';
				if ('' == input || input == undefined) {
					return '';
				}

				// 数组
				if (input.indexOf('[') == 0
						&& input.lastIndexOf(']') == input.length - 1) {
					input = JSON.parse(input);
				}

				if (angular.isArray(input)) {
					input = input.join(split);
				}

				if(typeof input === 'string'){
          if(window.INITIAL_DPI__ && window.INITIAL_DPI__ < 160){
            let node = $('<div></div>');
            node.html(input);
            node.find(".latex_view").each(function(){
              var onerror = $(this).attr("onerror");
              var tmpArr = onerror.split("'");
              for (var i = 0; i < tmpArr.length; i++) {
                if (tmpArr[i].indexOf(".png") > 0) {
                  var pngSrc = tmpArr[i].replace("┼","https://img.yuncelian.com/img");
                  $(this).attr("src", pngSrc);
                  break;
                }
              }
            });
            input = node.html();
          }
        }
				return $sce.trustAsHtml(input);
			};
		} ]);

app.filter('trustedUrl', [ '$sce', function($sce) {
	return function(input) {
		input = input || '';
		return $sce.trustAsResourceUrl(input);
	};
} ]);

app.filter('ngRepeatFinish', function($timeout, $rootScope) {
	return function(data) {
		var me = this;
		var flagProperty = '__finishedRendering__';
		if (!data[flagProperty]) {
			Object.defineProperty(data, flagProperty, {
				enumerable : false,
				configurable : true,
				writable : false,
				value : {}
			});
			$timeout(function() {
				delete data[flagProperty];
				$rootScope.$broadcast('ngRepeatFinished');
			}, 0, false);
		}
		return data;
	};
});

app.filter('charCode', function() {
	return function(input) {
		input = parseInt(input) || 0;
		return String.fromCharCode(65 + input);
	};
});

app.filter('numCode', function() {
	return function(input) {
		input = parseInt(input.charCodeAt(0) - 65);
		return input;
	}
})

app.filter('duration', function() {
	return function(input) {
		input = parseInt(input) || 0;
		if (input != 0) {
			var arr = [];
			var minute = parseInt(input / 60);
			var second = parseInt(input % 60);
			if (minute > 0) {
				arr.push(minute);
				arr.push('分');
			}
			if (second > 0) {
				arr.push(second);
				arr.push('秒');
			}
			return arr.join('');
		} else {
			return '0秒';
		}

	}
});

app.filter('percent', [ '$filter', function($filter) {
	return function(input, fractionSize) {
		input = parseFloat(input) || 0;
		fractionSize = fractionSize || 2;
		if (fractionSize < 0) {
			fractionSize = 0;
		}
		if (input <= 0) {
			return '0%';
		}
		var result = $filter('number')(input, fractionSize + 2);
		var percent = parseFloat(result);
		percent = percent * 100;
		result = percent.toFixed(2) + '%';
		return result;
	}
} ]);

app.filter('score', [ '$filter', function($filter) {
	return function(input, fractionSize) {
		input = parseFloat(input) || 0;
		if (input == 0) {
			return '0';
		} else {
			var result = $filter('number')(input, fractionSize);
			if (result.indexOf('.0') != -1) {
				return '' + parseInt(result);
			}
			return result;
		}
	}
} ]);

app.filter('capital', function() {
	var code = [ '', '一', '二', '三', '四', '五', '六', '七', '八', '九', '十' ];
	return function(input) {
		input = parseInt(input) || 1;
	};
});

/**
 * 子串
 */
app.filter('substr', function() {
	return function(input, length, ext) {
		input = input || '';
		length = length || 10;
		ext = ext || '';
		if (typeof (input) == 'string' && (input.length > length)) {
			return input.substring(0, length - 1) + ext;
		}
		return input;
	};
});
app.filter('mathCeil', function() {
	return function(input) {
		input = Math.ceil(input);
		return input;
	};
});
app.filter('termName', function() {
	return function(input) {
		input = parseInt(input) || 0;
		if (input != 0) {
			var year = parseInt(input / 100);
			var code = parseInt(input % 100);
			var arr = [];
			if (code == 1) {
				arr.push('' + (year - 1));
				arr.push('-');
				arr.push('' + parseInt(year % 100));
				arr.push('学年');
				arr.push('下学期');
			} else {
				arr.push('' + (year));
				arr.push('-');
				arr.push('' + parseInt((year + 1) % 100));
				arr.push('学年');
				arr.push('上学期');
			}
			return arr.join('');
		}
		return '';
	};
});

app.filter('resourceTitle', function() {
	return function(title) {
		var index = title.lastIndexOf('.');
		var returnStr = title;
		if (index != -1) {
			returnStr = title.substr(0, index);
		}
		return returnStr;
	};
});

app.filter('downloadType', function() {
	return function(type) {
		var returnStr = '资源';
		var type = ''+type
		if (type === '0') {
			returnStr = '练习';
		} else if (type === '1') {
			returnStr = '试卷';
		}
		return returnStr;
	};
});

app.filter('resourceTypeImg', function() {
	return function(title) {
		var index = title.lastIndexOf('.');
		var postfix = title.substr(index + 1)
		var returnStr = '/img/teacher/doc.png';
		if (index == -1) {
			returnStr = '/img/teacher/vidio.png';
		} else if (postfix == 'pdf') {
			returnStr = '/img/teacher/pdf.png';
		}
		return returnStr;
	};
});

app.filter('stageName', function() {
	return function(stage) {
		var name = '';
		switch (parseInt(stage)) {
		case 1:
			name = '小学';
			break;
		case 2:
			name = '初中';
			break;
		case 3:
			name = '高中';
			break;
		}
		return name;
	};
});

app.filter('subjectName', function() {
	return function(code) {
		var tmp = (code+'').substr(1);
		var name = '';
		switch (parseInt(tmp)) {
		case 0:
			name = '数学';
			break;
		case 1:
			name = '物理';
			break;
		case 2:
			name = '化学';
			break;
		case 3:
			name = '生物';
			break;
		case 4:
			name = '语文';
			break;
		case 5:
			name = '地理';
			break;
		case 6:
			name = '英语';
			break;
		case 7:
			name = '政治';
			break;
		case 8:
			name = '历史';
			break;
		}
		return name;
	};
});
