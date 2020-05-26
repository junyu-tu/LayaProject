
export default class StartPanel extends Laya.Script{

      /** @prop {name:btn_Play, tips:"提示文本", type:Node, default:null} */
      btn_Play = null;
      /** @prop {name:btn_AudioOn, tips:"提示文本", type:Node, default:null} */
      btn_AudioOn = null;
      /** @prop {name:btn_AudioOff, tips:"提示文本", type:Node, default:null} */
      btn_AudioOff = null;
      //封装一下
    owner =(this.owner as Laya.Sprite)


    constructor()
    {
        super();
      
    }

    onAwake(){
        this.btn_Play.on(Laya.Event.CLICK,this,this.btnPlayClick);
        this.btn_AudioOn.on(Laya.Event.CLICK,this,this.btnAudioOnClick);
        this.btn_AudioOff.on(Laya.Event.CLICK,this,this.btnAudioOffClick);

        if(Laya.SoundManager.muted){
            this.btn_AudioOff.visible = true;
            this.btn_AudioOn.visible = false;
        }else{
            this.btn_AudioOff.visible = false;
            this.btn_AudioOn.visible = true;
        }

        Laya.stage.on("AudioClick",this,this.audioClick);
    } 


    btnPlayClick(){
        Laya.SoundManager.playSound("res/Sounds/ButtonClick.ogg",1);
        //console.log("btnPlayClick");
        this.owner.visible = false;
        //派发事件  事件码：自定义的 string类型
        Laya.stage.event("StartGame");
        
    }

    btnAudioOnClick(){
        Laya.SoundManager.playSound("res/Sounds/ButtonClick.ogg",1);
        //console.log("btnAudioOnClick");
        // this.btn_AudioOff.visible = true;
        // this.btn_AudioOn.visible = false;
        Laya.SoundManager.muted =true;
        Laya.stage.event("AudioClick",true);
    }

    btnAudioOffClick(){
        Laya.SoundManager.playSound("res/Sounds/ButtonClick.ogg",1);
        //console.log("btnAudioOffClick");
        // this.btn_AudioOff.visible = false;
        // this.btn_AudioOn.visible = true;
        Laya.SoundManager.muted =false;
        Laya.stage.event("AudioClick",false);
    }

    homeBtnClick(){
        this.owner.visible = true;
    }

    audioClick(value){
        if(value){
            this.btn_AudioOff.visible = true;
            this.btn_AudioOn.visible = false;
        }else{
            this.btn_AudioOff.visible = false;
            this.btn_AudioOn.visible = true;
        }
    }
}