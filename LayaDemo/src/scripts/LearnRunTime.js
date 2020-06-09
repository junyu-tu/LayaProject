/**
*
* @ author:Hello
* @ email:838801978@qq.com
* @ data: 2020-06-05 15:28
*/
export default class LearnRunTime extends Laya.Image {

    constructor() {
        super();
        this.anchorX = 0.5;
        this.anchorY = 0.5;
    }

    onAwake() {
        this.on(Laya.Event.MOUSE_DOWN,this,this.mouseDown);
        this.on(Laya.Event.MOUSE_UP,this,this.mouseUp);
    }

    mouseDown(){
        Laya.Tween.to(this,{scaleX:0.5,scaleY:0.5},100);
    }

    mouseUp(){
        Laya.Tween.to(this,{scaleX:1,scaleY:1},100);
    }
}