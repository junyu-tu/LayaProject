
export default class AutoMove extends Laya.Script{

    moveSpeed = 20;
    height =0;

    constructor()
    {
        super();
        
    }

    onAwake(){
        this.height = (this.owner as Laya.Sprite).height;

        //按照帧数去调用方法
        Laya.timer.frameLoop(1,this,this.frameLoop)
    }

    frameLoop(){
        (this.owner as Laya.Sprite).y+=this.moveSpeed;

        if((this.owner as Laya.Sprite).y >= this.height ){
            (this.owner as Laya.Sprite).y -=this.height*2;
        }
    }
}