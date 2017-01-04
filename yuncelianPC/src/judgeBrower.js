function judgeBrower(){
    var browser=navigator.appName
    var b_version=navigator.appVersion
    var version=b_version.split(";");
    var trim_Version = '';
    if(version.length>1){
    	trim_Version=version[1].replace(/[ ]/g,"");
    }
   if(browser=="Microsoft Internet Explorer" && trim_Version=="MSIE8.0")
    {
        version="IE 8.0";
        createJs("/js/app/html5.js");
        createJs("/js/app/ie8.js");
        createJs("/js/excanvas.js","true");
        createJs("/js/app/IE9.js");
        return version;
    }
    return version;
}
function createJs(url,flag){
    var flag=flag?flag:"";
    var script=document.createElement("script");
    var head=document.getElementsByTagName("head")[0];
    script.setAttribute("type","text/javascript");
    if(flag=="true"){
        script.setAttribute("defer","true");
    }
    script.setAttribute("src",url);
    head.appendChild(script);
}
function initQList(num1,num2){
    angular.forEach(angular.element('ul.q-list').find('li'),function(elem,index){
        if(index>=num1&&index<num2){
            $(elem).css('visibility','visible');
        }else{
            $(elem).css('visibility','hidden');
        }
    })
}

function detectOS() {
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
}

var addEvent = function( obj, type, fn ) {
    if (obj.addEventListener){
        obj.addEventListener( type, fn, false );
    } else if (obj.attachEvent) {
        obj["e"+type+fn] = fn;
        obj.attachEvent( "on"+type, function() {
            obj["e"+type+fn].call(obj, window.event);
        } );
    }
};

function getCookie(name) {
    var arr,reg=new RegExp("(^| )"+name+"=([^;]*)(;|$)");
    if(arr=document.cookie.match(reg)){
        return unescape(arr[2]);
    } else{
        return null;
    }
}