import app from 'app';

import './jquery.treeview.css';
import 'styless/treeview.less';

export default app.directive('ngChapterTreeview',['$compile',function($compile){


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
				ngParent:'=',
				ngNotRoot:'@',
				ngChapterId:'='
			},
			template:require('./treeview.htm'),
			compile: function(element){
				return cpl(element, function(scope, iElement, iAttrs, controller, transcludeFn){


					scope.expandChapter = function(chapter){
						chapter.expandable = !chapter.expandable;
					}

					scope.changeChapter = function(chapter,$event){
						$event.stopPropagation();

						if(typeof(scope.ngChapterClick)==='function'){
							scope.ngChapterClick(chapter);
						}
					}

					scope.collapsable = function(chapter){
						return angular.isDefined(chapter) &&!!!chapter.expandable ;
					}

				});
			},
			link : function(scope,element,attrs,ctrl){


			}
		};
	}]);