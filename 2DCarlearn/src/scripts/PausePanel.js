import StartPanel from "./StartPanel";
import GameManager from "./GameManager";
import Player from "./Player";


export default class PausePanel extends Laya.Script{

    constructor()
    {
        super();
        /** @prop {name:btn_AudioOn, tips:"提示文本", type:Node, default:null} */
        this.btn_AudioOn = null;
        /** @prop {name:btn_AudioOff, tips:"提示文本", type:Node, default:null} */
        this.btn_AudioOff = null;
    }

    onAwake(){
        //获取相关组件
        this.txt_Pause = this.owner.getChildByName("txt_Pause");
        this.owner.getChildByName("btn_Close").on(Laya.Event.CLICK,this,this.CloseBtnClick);
        this.owner.getChildByName("btn_Home").on(Laya.Event.CLICK,this,this.homeBtnClick);
        this.owner.getChildByName("btn_Restart").on(Laya.Event.CLICK,this,this.restartBtnClick);
        this.btn_AudioOn.on(Laya.Event.CLICK,this,this.audioOnBtnClick);
        this.btn_AudioOff.on(Laya.Event.CLICK,this,this.audioOffBtnClick);

        //加载使用字体
        Laya.loader.load("hemiheadbdit.ttf",Laya.Handler.create(this,function(font){
            console.log(font);
            this.txt_Pause.font = font.fontName;
        }),null,Laya.Loader.TTF);

        Laya.stage.on("Pause",this,function(){
            this.owner.visible = true;
        });
        Laya.stage.on("AudioClick",this,this.audioClick);

        
        if(Laya.SoundManager.muted){
            this.btn_AudioOff.visible = true;
            this.btn_AudioOn.visible = false;
        }else{
            this.btn_AudioOff.visible = false;
            this.btn_AudioOn.visible = true;
        }
    }

    //关闭暂停面板
    CloseBtnClick(){
        Laya.SoundManager.playSound("res/Sounds/ButtonClick.ogg",1);
        Laya.timer.resume();
        this.owner.visible = false;
        this.owner.parent.getChildByName("GamePanel").visible = true;
        this.owner.parent.getChildByName("Player").getComponent(Player).isStartGame = true;
    }

    //结束游戏 返回主界面
    homeBtnClick(){
        Laya.SoundManager.playSound("res/Sounds/ButtonClick.ogg",1);
        Laya.timer.resume();
        this.owner.visible = false;
        //显示主界面
        this.owner.parent.getChildByName("StartPanel").getComponent(StartPanel).homeBtnClick();
        //移除界面的所有 汽车
        this.owner.parent.getComponent(GameManager).homeBtnClick();
        this.owner.parent.getChildByName("Player").getComponent(Player).ResetCarPos();
    }

    //重新开始游戏
    restartBtnClick(){
        Laya.SoundManager.playSound("res/Sounds/ButtonClick.ogg",1);
        Laya.timer.resume();
        this.owner.visible = false;
        this.owner.parent.getComponent(GameManager).restartBtnClick();
        Laya.stage.event("StartGame");
        this.owner.parent.getChildByName("Player").getComponent(Player).ResetCarPos();
    }

    audioOnBtnClick(){
        Laya.SoundManager.playSound("res/Sounds/ButtonClick.ogg",1);
        // this.btn_AudioOff.visible = true;
        // this.btn_AudioOn.visible = false;
        Laya.SoundManager.muted =true;
        Laya.stage.event("AudioClick",true);
    }

    audioOffBtnClick(){
        Laya.SoundManager.playSound("res/Sounds/ButtonClick.ogg",1);
        // this.btn_AudioOff.visible = false;
        // this.btn_AudioOn.visible = true;
        Laya.SoundManager.muted =false;
        Laya.stage.event("AudioClick",false);
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