import StartPanel from "./StartPanel";
import GameManager from "./GameManager";
import Player from "./Player";
import GamePanel from "./GamePanel";


export default class GameOverPanel extends Laya.Script{

    constructor()
    {
        super();
        
    }

    onAwake(){
        //获取相关组件
        this.txt_GameOver = this.owner.getChildByName("txt_GameOver");
        this.txt_Score = this.owner.getChildByName("txt_Score");
        this.txt_HightScore = this.owner.getChildByName("txt_HightScore");
        //加载使用字体
        Laya.loader.load("hemiheadbdit.ttf",Laya.Handler.create(this,function(font){
            this.txt_Score.font = font.fontName;
            this.txt_HightScore.font = font.fontName;
            this.txt_GameOver.font = font.fontName;
        }),null,Laya.Loader.TTF);

        this.owner.getChildByName("btn_Home").on(Laya.Event.CLICK,this,this.homeBtnClick);
        this.owner.getChildByName("btn_Restart").on(Laya.Event.CLICK,this,this.restartBtnClick);

        Laya.stage.on("GameOver",this,this.gameOver);
    }

       //结束游戏 返回主界面
       homeBtnClick(){
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
        this.owner.visible = false;
        this.owner.parent.getComponent(GameManager).restartBtnClick();
        Laya.stage.event("StartGame");
        this.owner.parent.getChildByName("Player").getComponent(Player).ResetCarPos();
    }

    gameOver(){
        Laya.SoundManager.playSound("res/Sounds/ButtonClick.ogg",1);
        this.owner.visible = true;
        var curScore = this.owner.parent.getChildByName("GamePanel").getComponent(GamePanel).score;
        this.txt_Score.text = "Score:"+curScore;
        var hightScore = Number(Laya.LocalStorage.getItem("BestScore"));
        if(curScore >hightScore){
            Laya.LocalStorage.setItem("BestScore",curScore);
            this.txt_HightScore.text = "HightScore:"+curScore;
        }else{
            this.txt_HightScore.text = "HightScore:"+hightScore;
        }
        Laya.LocalStorage.setItem("LastScore",curScore);
    }
    
    
}