/**
*
* @ author:Hello
* @ email:838801978@qq.com
* @ data: 2020-06-05 12:46
*/
export default class LearnClip extends Laya.Script {

    constructor() {
        super();
        /** @prop {name:theclip, tips:"提示文本", type:Node, default:null}*/
        this.theclip=null;
        /** @prop {name:thebutton, tips:"提示文本", type:Node, default:null}*/
        this.thebutton=null;
        //设置一个flag 状态值
        this.isPause = false;
    }

    onAwake() {
        //创建一个Clip
        // var clip = new Laya.Clip("res/sprite/clip_num.png",10,1);
        // clip.autoPlay = true;
        // //播放的间隔时间 1000毫秒
        // clip.interval = 1000; 
        // clip.x = 500;
        // clip.y = 500;
        // Laya.stage.addChild(clip);
   
        this.theclip.autoPlay = true;
        this.theclip.interval = 1000;

        this.thebutton.on(Laya.Event.CLICK,this,this.buttonclick);
    }

    buttonclick(){
        this.isPause = !this.isPause;
        if(this.isPause){
            this.thebutton.label = "播放";
            this.index = this.theclip.index;
            //停止播放
            this.theclip.stop(); 
        }else{
            this.thebutton.label = "暂停";
            //继续播放
            this.theclip.play();
            this.theclip.index = this.index
        }
    }

}