import app from 'app';

import './jquery.treeview.css';
import 'styless/treeview.less';

export default app.directive('ngCalculationChapterTreeview',['$compile',function($compile){

		function cpl(element, link){
			// Normalize the link parameter
			if(angular.isFunction(link)){
				link = { post: link };
			}

			// Break the recursion loop by removing the contents
			var contents = element.contents().remove();
			var compiledContents;
			return {
				pre: (link && link.pre) ? link.pre : null,
				/**
				 * Compiles and re-adds the contents
				 */
				post: function(scope, element){
					// Compile the contents
					if(!compiledContents){
						compiledContents = $compile(contents);
					}
					// Re-add the compiled contents to the element
					compiledContents(scope, function(clone){
						element.append(clone);
					});

					// Call the post-linking function, if any
					if(link && link.post){
						link.post.apply(null, arguments);
					}
				}
			};
		}


		return {
			restrict: "AE",
			replace:true,
			scope:{
				ngChapters : '=',
				ngChapterClick:'=',
				ngQuestionClick:'=',
				ngParent:'=',
				ngNotRoot:'@',
				ngChapterId:'=',
				ngLiteracy:'='
			},
			template:require('./calculation-treeview.htm'),
			compile: function(element){
				return cpl(element, function(scope, iElement, iAttrs, controller, transcludeFn){
					scope.expandChapter = function(chapter){
						chapter.expandable = !chapter.expandable;
					};

					scope.changeChapter = function(chapter,$event){
						$event.stopPropagation();
						if (scope.ngLiteracy == 'true' || scope.ngLiteracy ) {
							// 加载数据
							chapter.selques = [1,2];
							chapter.ques = [];
							chapter.isShowLiteracy  = !chapter.isShowLiteracy;
						} else {
							if(typeof(scope.ngChapterClick)==='function'){
								scope.ngChapterClick(chapter);
							}
						}
						
					};
					
					scope.checkboxClick=function(chapter, type){
						if(typeof scope.ngChapterClick === 'function'){
							scope.ngChapterClick(chapter,type);
						}
					};

					scope.collapsable = function(chapter){
						return angular.isDefined(chapter) &&!!!chapter.expandable ;
					};
					
				});
			},
			link : function(scope,element,attrs,ctrl){


			}
		};
	}]);