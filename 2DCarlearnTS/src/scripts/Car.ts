
export default class Car extends Laya.Script{

    /** @prop {name:speed, tips:"提示文本", type:number} */
    speed = 15;
    sign="";

    constructor()
    {
        super();
        
    }

    onAwake(){
        Laya.timer.frameLoop(1,this,this.frameMove)
    } 

    Init(sign){
        this.sign = sign;
    }

    frameMove(){
        (this.owner as Laya.Sprite).y+=this.speed;
    }


    onTriggerExit(other){
        //检测到碰撞的时候
        if(other.label == "BottomCollider"){
            //将自己移出舞台
            this.owner.removeSelf();
            this.recover();
        }       
    }

    recover(){
        //对象池回收
        Laya.Pool.recover(this.sign,this.owner);
    }
}