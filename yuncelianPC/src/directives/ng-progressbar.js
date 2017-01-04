/**
 * 进度条
 */

import app from 'app';

import ProgressBar from 'vendors/progressbar/progressbar.min';

//ProgressBar
export default app.directive('ngProgressbar',[function(){
		return {
		  		restrict: 'AC',
		  		scope:{
		  			total:'@',
		  			complete:'@',
		  			textColor:'@',
		  			duration:'@',
		  			strokeWidth:'@',
		  			trailWidth:'@',
		  			trailColor:'@',
		  			color:'@',
		  			showType:'@',
		  			fontSize:'@',
		  			fill:'@',
		  			complement:'@'
		  		},
		  		link: function (scope, elem, attr){
		  			var _total = scope.total || 0;
		  			scope.complement = scope.complement ||false;
		  			elem.css('background-image','none');
		  			var _complete = scope.complete|| 0 ;
		  			var percent = 0;
		  			if(_total != 0){
		  				percent = _complete/_total;
		  			}
		  			
		  			scope.textColor = scope.textColor || '#ffffff';
		  			
		  			scope.duration = scope.duration || 500;
		  			
		  			scope.showType = scope.showType ||1;
		  			
		  			scope.color = scope.color||'#3c7ae3';
		  			
		  			scope.strokeWidth = scope.strokeWidth || 4;
		  			scope.trailWidth = scope.trailWidth || 4;
		  			scope.trailColor = scope.trailColor || '#ffffff';
		  			scope.fontSize = scope.fontSize || '14px';
		  			scope.fill = scope.fill || 'transparent';
		  			var config = {
						color:scope.color,
						strokeWidth: scope.strokeWidth,
						trailWidth: scope.trailWidth,
						trailColor: scope.trailColor,
						duration: scope.duration,
						fill:scope.fill,
						svgStyle: {
							display: 'block',
							width: '100%'
						},
						text:{
							style:{
								color: scope.textColor,
								fontSize:scope.fontSize
							}
						}
		  			};
		  			
		  			config.step = function(state, bar) {
		  				if(scope.showType == 1){
		  					if(scope.complement){
		  						bar.setText((_total-_complete)+'/'+_total);
		  					}else{
		  						bar.setText((_complete)+'/'+_total);
		  					}
		  					
		  				}else if(scope.showType==2){
		  					
		  				}else{
		  					
		  					bar.setText(parseInt(percent*100)+'%');
		  				}
					}
		  			var pbar  = new ProgressBar.Circle(elem[0],config );
		  			pbar.animate(percent);
		  		}
		  	};
	 }]);
