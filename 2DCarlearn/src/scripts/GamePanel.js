export default class GamePanel extends Laya.Script{

    constructor()
    {
        super();
        this.score =0;
    }

    onAwake(){
        //获取相关组件
        this.txt_Best = this.owner.getChildByName("txt_Best");
        this.txt_Last = this.owner.getChildByName("txt_Last");
        this.txt_Score = this.owner.getChildByName("txt_Score");
        this.owner.getChildByName("btn_Pause").on(Laya.Event.CLICK,this,this.pauseBtnClick);

        //加载使用字体
        Laya.loader.load("hemiheadbdit.ttf",Laya.Handler.create(this,function(font){
            console.log(font);
            this.txt_Best.font = font.fontName;
            this.txt_Last.font = font.fontName;
            this.txt_Score.font = font.fontName;
        }),null,Laya.Loader.TTF);

        this.owner.visible = false;
        //监听事件
        Laya.stage.on("StartGame",this,function()
        {
            this.owner.visible = true;
            this.Init();
        });
        Laya.stage.on("GameOver",this,function()
        {
            this.owner.visible = false;
        });

        Laya.timer.loop(300,this,this.AddScore);
        Laya.stage.on("AddScore",this,this.AddScore);

        
    }

    Init(){
        //Laya.LocalStorage.clear();
        this.txt_Last.text = "Last:"+Number(Laya.LocalStorage.getItem("LastScore"));
        this.txt_Best.text = "Best:"+Number(Laya.LocalStorage.getItem("BestScore"));
        this.txt_Score.text = "0";
        this.score =0;

    }

    AddScore(score = 1){
        if(this.owner.visible == false)  return;
        this.score+=score;
        this.txt_Score.text = this.score;
    }

    pauseBtnClick(){
        Laya.SoundManager.playSound("res/Sounds/ButtonClick.ogg",1);
        //对于使用timer的方法进行暂停
        Laya.timer.pause();
        this.owner.visible = false;
        Laya.stage.event("Pause");
    }
}