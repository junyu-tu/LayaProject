export default class MoleCtrl extends Laya.Script{

    constructor()
    {
        super();
        this.isUp = false;
        this.isDown = false;
    }

    onAwake(){
        console.log(this.owner.name);
        this.randomUp();
    }

    onUpdate(){
        if(this.isUp){
            //沿着Y轴正方向移动
            this.owner.transform.translate(new Laya.Vector3(0,0.1,0));
            if(this.owner.transform.localPosition.y>=2.5){
                this.isUp = false;
                this.owner.transform.localPosition=new Laya.Vector3(0,2.5,0);
                //延时调用
                Laya.stage.timerOnce(1000,this,function(){this.isDown=true;});
            }
        }
        if(this.isDown){
            this.owner.transform.translate(new Laya.Vector3(0,-0.1,0));
            if(this.owner.transform.localPosition.y<=0){
                this.isDown = false;
                this.owner.transform.localPosition=new Laya.Vector3(0,0,0);
                this.randomUp();
            }
        }
    }

    randomUp(){
        //Laya里面的随机值为0-1之间的值
        var value = Math.random();
        Laya.stage.timerOnce(value*6000,this,function(){this.isUp = true;});
    }

    //当地鼠被敲击之后调用
    Knock(){
        //位置归零
        this.owner.transform.localPosition = new Laya.Vector3();
        this.isUp = false;
        this.isDown = false;
    }

}