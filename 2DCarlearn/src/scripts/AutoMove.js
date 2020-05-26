
export default class AutoMove extends Laya.Script{

    constructor()
    {
        super();
        this.moveSpeed = 20;
    }

    onAwake(){
        this.height = this.owner.height;
        //按照帧数去调用方法
        Laya.timer.frameLoop(1,this,this.frameLoop)
    }

    frameLoop(){
        this.owner.y+=this.moveSpeed;

        if(this.owner.y >= this.height ){
            this.owner.y -=this.height*2;
        }
    }
}