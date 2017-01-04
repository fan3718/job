import app from 'app';
export default app.directive('ngPagination',function(){

	return {
		restrict:'A',
		replace:true,
		scope:{
			ngTotal:'=',
			ngPageSize:'@',
			ngPage:'=',
			ngChangePage:'='
		},
		template:require('./pagination.htm'),
		link:function(scope,element,attrs){

			scope.ngTotal = parseInt(scope.ngTotal ||0);
			scope.ngPageSize = parseInt(scope.ngPageSize || 20);
			if(scope.ngPageSize <=0){
				scope.ngPageSize =20;
			}
			scope.ngPage = parseInt(scope.ngPage || 1);

			var totalPage = Math.ceil(scope.ngTotal/scope.ngPageSize);
			scope.hidePrev = true;
			if(totalPage==1){
				scope.hideNext = true;
			}


			scope.pageItems = [];


			function initPagination(page){

				scope.pageItems.splice(0,scope.pageItems.length);

				var minPage =Math.max(Math.min(Math.abs(page-5),1),page-5);
				if(minPage<=0){
					minPage = 1;
				}
				var maxPage = Math.min(page+5,totalPage);


				if(maxPage - minPage <10){
					if(minPage !=1){
						minPage = Math.max(maxPage-10,1);
					}else{
						maxPage = Math.min(minPage+10,totalPage);
					}

				}

				for(var i=minPage;i<=maxPage;i++){
					var item = {};
					item.code=i;
					item.type=1;
					scope.pageItems.push(item);
				}

				if(maxPage != totalPage){
					var item = {};
					item.code='...';
					item.type=2;
					scope.pageItems.push(item);


					item = {};
					item.code=totalPage;
					item.type=1;
					scope.pageItems.push(item);

				}
			}


			initPagination(scope.ngPage);

			scope.$watch('ngPage',function(newValue,oldValue){
				if(newValue != oldValue && newValue>0){
					$("html,body").scrollTop(0);
				}
			});
			scope.setPage = function(item){
				if( item.type !=2 ){
					scope.ngPage = item.code;
					initPagination(item.code);
					callback(scope.ngPage);

					showIndicator();
				}



			}

			function showIndicator(){
				if(scope.ngPage==totalPage){
					scope.hideNext = true;
				}else{
					scope.hideNext = false;
				}

				if(scope.ngPage==1){
					scope.hidePrev = true;
				}else{
					scope.hidePrev = false;
				}
			}
			scope.next = function(){
				if(scope.ngPage<totalPage){
					scope.ngPage++;
					initPagination(scope.ngPage);
					callback(scope.ngPage);
				}

				showIndicator();
			}

			scope.prev = function(){
				if(scope.ngPage>1){
					scope.ngPage--;

					initPagination(scope.ngPage);
					callback(scope.ngPage);
				}
				showIndicator();
			}

			scope.$watch('ngTotal',function(newValue,oldValue){
				if(newValue != oldValue && newValue>0){
					totalPage = Math.ceil(scope.ngTotal/scope.ngPageSize);
					scope.hidePrev = true;
					if(totalPage==1){
						scope.hideNext = true;
					}
					initPagination(scope.ngPage);
				}
			});

			function callback(index){
				if(typeof(scope.ngChangePage) == 'function'){
					scope.ngChangePage(index);
				}
			}

		}
	};



});
