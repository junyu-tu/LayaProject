
export default class StartPanel extends Laya.Script{

    constructor()
    {
        super();
        /** @prop {name:btn_Play, tips:"提示文本", type:Node, default:null} */
        this.btn_Play = null;
        /** @prop {name:btn_AudioOn, tips:"提示文本", type:Node, default:null} */
        this.btn_AudioOn = null;
        /** @prop {name:btn_AudioOff, tips:"提示文本", type:Node, default:null} */
        this.btn_AudioOff = null;
    }

    onAwake(){
        this.btn_Play.on(Laya.Event.CLICK,this,this.btnPlayClick);
        this.btn_AudioOn.on(Laya.Event.CLICK,this,this.btnAudioOnClick);
        this.btn_AudioOff.on(Laya.Event.CLICK,this,this.btnAudioOffClick);
    } 


    btnPlayClick(){
        console.log("btnPlayClick");
        this.owner.visible = false;

        //派发事件  事件码：自定义的 string类型
        Laya.stage.event("StartGame");
    }

    btnAudioOnClick(){
        console.log("btnAudioOnClick");
        this.btn_AudioOff.visible = true;
        this.btn_AudioOn.visible = false;
    }

    btnAudioOffClick(){
        console.log("btnAudioOffClick");
        this.btn_AudioOff.visible = false;
        this.btn_AudioOn.visible = true;
    }
}