
export default class UICtrl extends Laya.Script{

    constructor()
    {
        super();
        /** @prop {name:txt_Time, tips:"倒计时提示", type:Node, default:null} */
        this.txt_Time = null;
        /** @prop {name:txt_Score, tips:"分数计时", type:Node, default:null} */
        this.txt_Score = null;
        /** @prop {name:gameoverPanel, tips:"游戏结束", type:Node, default:null} */
        this.gameoverPanel = null;
        /** @prop {name:btn_restart, tips:"重新开始", type:Node, default:null} */
        this.btn_restart = null;

        
        
    }

    onAwake(){
        //监听score事件
        Laya.stage.on("AddScore",this,this.addScore);
        this.score =0;
        this.timer = 0;
        this.time = 60;
        this.btn_restart.on(Laya.Event.CLICK,this,this.restartGame);
    }

    onUpdate(){
        //游戏结束
        if(this.time<+0){
            this.gameover();
        }

        this.timer+=(Laya.timer.delta/1000);
        if(this.timer>1){
            this.timer = 0;
            this.time--;
            this.txt_Time.text = "Time:"+this.time+ " s";
        }
    }

    addScore(){
        this.score++;
        this.txt_Score.text = "Score："+this.score;
    }

    gameover(){
        this.txt_Time.visible = false;
        this.txt_Score.visible = false;
        this.gameoverPanel.visible = true;

        Laya.stage.event("GameOver");
    }

    restartGame(){
        this.txt_Time.visible = true;
        this.txt_Score.visible = true;
        this.gameoverPanel.visible = false;
        this.score =0;
        this.timer = 0;
        this.time = 60;
        this.txt_Time.text = "Time:"+this.time+ " s";
        this.txt_Score.text = "Score："+this.score;

        Laya.stage.event("RestartGame");
    }
}