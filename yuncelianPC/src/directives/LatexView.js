import app from 'app';
app.directive('latex_view',[function(){
  return {
    restrict:'C',
    link:function(scope,element,attrs,ctrl){
      var onerror = element.attr("onerror");
      if(onerror && (window.INITIAL_DPI__ && window.INITIAL_DPI__ < 160)){
        var tmpArr = onerror.split("'");
        for (var i = 0; i < tmpArr.length; i++) {
          if (tmpArr[i].indexOf(".png") > 0) {
            var pngSrc = tmpArr[i].replace("┼","https://img.yuncelian.com/img");
            element.attr("src", pngSrc);
            break;
          }
        }
      }
    }
  };
}]);
