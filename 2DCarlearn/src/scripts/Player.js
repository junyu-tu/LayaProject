import Car from "./Car";

export default class Player extends Laya.Script{

    constructor()
    {
        super();
        this.playerMinX = 200;
        this.playerMaxX = 880;

        this.isStartGame = false;
        //赛道：X 260  450  640  820  Y 1360
        this.initXArr = [260,450,640,820];
        this.initY = 1360;
    }

    onAwake(){
        Laya.SoundManager.playMusic("res/Sounds/FutureWorld_Dark_Loop_03.ogg",0);
        Laya.stage.on(Laya.Event.MOUSE_DOWN,this,this.mouseDown);
        Laya.stage.on(Laya.Event.MOUSE_UP,this,this.mouseUp);
        Laya.stage.on("StartGame",this,function(){
            this.isStartGame = true;
        });
        Laya.stage.on("Pause",this,function(){
            this.isStartGame = false;
        });
        //获取RigidBody
        this.rig = this.owner.getComponent(Laya.RigidBody);
        //随机小汽车 初始位置
        this.ResetCarPos();
    }

    onUpdate(){
       if(this.owner.x>this.playerMaxX){
           this.owner.x = this.playerMaxX;
       }
       if(this.owner.x<this.playerMinX){
        this.owner.x = this.playerMinX;
       }
    }

    ResetCarPos(){
        //随机小汽车 初始位置
        var index= this.getRandom(0,this.initXArr.length-1);
        this.owner.pos(this.initXArr[index],this.initY);
    }

    mouseDown(){
        if(this.isStartGame == false){
            return;
        }

        //500位置上方的点击  无效
        if(Laya.stage.mouseY<500) {
            return;
        }
        
       var mouseX =  Laya.stage.mouseX;
       var force = 0;
       if(mouseX <Laya.stage.width/2){
           //点击的左边
           console.log("Left");
           force=-1;
       }
       else{
           console.log("right");
           force=1;
       }

       //水平方向给与一个线行速度
       this.rig.linearVelocity = {x:force*8,y:0}; 
       //使用Tween进行旋转动画
       Laya.Tween.to(this.owner,{rotation:force*25},300);
    }

    mouseUp(){
        this.rig.linearVelocity = {x:0,y:0}; 
        Laya.Tween.to(this.owner,{rotation:0},300);
    }

    /**
     * 封装一个随机数
     * @param {*最小值} min 
     * @param {*最大值} max 
     */
    getRandom(min,max){
        var value = Math.random()*(max-min);
        value = Math.round(value);
        return min+value;
    }

    onTriggerEnter(other){
        if(other.label == "Car"){
            Laya.SoundManager.playSound("res/Sounds/CarCrash.ogg",1);
            //游戏结束   发送游戏结束的事件
            Laya.stage.event("GameOver");
            this.isStartGame = false;
        }
        if(other.label == "Coin"){
            Laya.SoundManager.playSound("res/Sounds/Bonus.ogg",1);
            //隐藏金币并回收  
            other.owner.removeSelf();
            other.owner.getComponent(Car).recover();
            //获得加分  TODO
            Laya.stage.event("AddScore",10);
        }
    }
}