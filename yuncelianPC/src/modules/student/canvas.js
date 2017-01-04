function circle(obj,data){
    this.cobj=obj;
    this.x=data.x;
    this.y=data.y;
    this.r=data.r;
    this.num=data.num;
    this.sum=data.sum;
    this.backColor=data.backColor;
    this.prevColor=data.prevColor;
}
circle.prototype={
    init:function(){
        var round=this.num/this.sum;
        this.circle(this.x,this.y,this.r,-Math.PI/2,3*Math.PI/2,this.backColor,false);
        this.circle(this.x,this.y,this.r,-Math.PI/2,(-Math.PI/2+2*Math.PI*round),this.prevColor,false);
        this.context(this.x,this.y,this.num,this.sum,this.backColor);
    },
    circle:function(x,y,r,startAngle,endAngle,color,antiFlag){
        this.cobj.beginPath();
        this.cobj.arc(x,y,r,startAngle,endAngle,antiFlag);
        this.cobj.lineWidth=3;
        this.cobj.strokeStyle=color;
        this.cobj.stroke();
        this.cobj.closePath();
    },
    context:function(x,y,num,sum,color){
        this.cobj.fillStyle=color;
        this.cobj.font="normal 18px 'Microsoft YaHei', sans-serif, Arial";
        this.cobj.textAlign="center";
        this.cobj.textBaseline="middle";
        this.cobj.fillText(this.num+'/'+this.sum,x,y);
    }
}