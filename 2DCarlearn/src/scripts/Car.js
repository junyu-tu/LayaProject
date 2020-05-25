
export default class Car extends Laya.Script{

    constructor()
    {
        super();
         /** @prop {name:speed, tips:"提示文本", type:number} */
         this.speed = 15;
    }

    onAwake(){

    } 

    Init(sign){
        this.sign = sign;
    }

    onUpdate(){
        this.owner.y+=this.speed;
    }


    onTriggerExit(other){
        //检测到碰撞的时候
        if(other.label == "BottomCollider"){
            //将自己移出舞台
            this.owner.removeSelf();
            //对象池回收
            Laya.Pool.recover(this.sign,this.owner);
            console.log("0000000");
        }       
    }
}