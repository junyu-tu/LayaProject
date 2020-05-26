(function () {
    'use strict';

    class AutoMove extends Laya.Script{

        constructor()
        {
            super();
            this.moveSpeed = 20;
        }

        onAwake(){
            this.height = this.owner.height;
            //按照帧数去调用方法
            Laya.timer.frameLoop(1,this,this.frameLoop);
        }

        frameLoop(){
            this.owner.y+=this.moveSpeed;

            if(this.owner.y >= this.height ){
                this.owner.y -=this.height*2;
            }
        }
    }

    class StartPanel extends Laya.Script{

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

    class Car extends Laya.Script{

        constructor()
        {
            super();
             /** @prop {name:speed, tips:"提示文本", type:number} */
             this.speed = 15;
        }

        onAwake(){
            Laya.timer.frameLoop(1,this,this.frameMove);
        } 

        Init(sign){
            this.sign = sign;
        }

        frameMove(){
            this.owner.y+=this.speed;
        }


        onTriggerExit(other){
            //检测到碰撞的时候
            if(other.label == "BottomCollider"){
                //将自己移出舞台
                this.owner.removeSelf();
                this.recover();
            }       
        }

        recover(){
            //对象池回收
            Laya.Pool.recover(this.sign,this.owner);
        }
    }

    class Player extends Laya.Script{

        constructor()
        {
            super();
            this.playerMinX = 200;
            this.playerMaxX = 880;

            this.isStartGame = false;
            //赛道：X 260  450  640  820  Y 1360
            this.initXArr = [260,450,640,820];
            this.initY = 1360;
        }

        onAwake(){
            Laya.SoundManager.playMusic("res/Sounds/FutureWorld_Dark_Loop_03.ogg",0);
            Laya.stage.on(Laya.Event.MOUSE_DOWN,this,this.mouseDown);
            Laya.stage.on(Laya.Event.MOUSE_UP,this,this.mouseUp);
            Laya.stage.on("StartGame",this,function(){
                this.isStartGame = true;
            });
            Laya.stage.on("Pause",this,function(){
                this.isStartGame = false;
            });
            //获取RigidBody
            this.rig = this.owner.getComponent(Laya.RigidBody);
            //随机小汽车 初始位置
            this.ResetCarPos();
        }

        onUpdate(){
           if(this.owner.x>this.playerMaxX){
               this.owner.x = this.playerMaxX;
           }
           if(this.owner.x<this.playerMinX){
            this.owner.x = this.playerMinX;
           }
        }

        ResetCarPos(){
            //随机小汽车 初始位置
            var index= this.getRandom(0,this.initXArr.length-1);
            this.owner.pos(this.initXArr[index],this.initY);
        }

        mouseDown(){
            if(this.isStartGame == false){
                return;
            }

            //500位置上方的点击  无效
            if(Laya.stage.mouseY<500) {
                return;
            }
            
           var mouseX =  Laya.stage.mouseX;
           var force = 0;
           if(mouseX <Laya.stage.width/2){
               //点击的左边
               console.log("Left");
               force=-1;
           }
           else{
               console.log("right");
               force=1;
           }

           //水平方向给与一个线行速度
           this.rig.linearVelocity = {x:force*8,y:0}; 
           //使用Tween进行旋转动画
           Laya.Tween.to(this.owner,{rotation:force*25},300);
        }

        mouseUp(){
            this.rig.linearVelocity = {x:0,y:0}; 
            Laya.Tween.to(this.owner,{rotation:0},300);
        }

        /**
         * 封装一个随机数
         * @param {*最小值} min 
         * @param {*最大值} max 
         */
        getRandom(min,max){
            var value = Math.random()*(max-min);
            value = Math.round(value);
            return min+value;
        }

        onTriggerEnter(other){
            if(other.label == "Car"){
                Laya.SoundManager.playSound("res/Sounds/CarCrash.ogg",1);
                //游戏结束   发送游戏结束的事件
                Laya.stage.event("GameOver");
                this.isStartGame = false;
            }
            if(other.label == "Coin"){
                Laya.SoundManager.playSound("res/Sounds/Bonus.ogg",1);
                //隐藏金币并回收  
                other.owner.removeSelf();
                other.owner.getComponent(Car).recover();
                //获得加分  TODO
                Laya.stage.event("AddScore",10);
            }
        }
    }

    class GameMamager extends Laya.Script{

        constructor()
        {
            super();
            // /** @prop {name:car_1, tips:"提示文本", type:prefab, default:null} */
            // this.car_1 = null;
            // /** @prop {name:car_2, tips:"提示文本", type:prefab, default:null} */
            // this.car_2 = null;
            // /** @prop {name:car_3, tips:"提示文本", type:prefab, default:null} */
            // this.car_3 = null;
            // /** @prop {name:car_4, tips:"提示文本", type:prefab, default:null} */
            // this.car_4 = null;
            // /** @prop {name:car_5, tips:"提示文本", type:prefab, default:null} */
            // this.car_5 = null;
            // /** @prop {name:car_6, tips:"提示文本", type:prefab, default:null} */
            // this.car_6 = null;
            //缓存加载出来的prefab
            this.carPrefabArr=[];
            this.isStartGame = false;
            this.spawnCarArr = []; //存放生成的所有obj
        }

        onAwake(){
            // this.ranTime = this.getRandom(300,800);
            // //这是个根据时间进行循环调用的方法
            // Laya.timer.loop(this.ranTime,this,function(){
            //     this.spawn();
            //     this.ranTime = this.getRandom(300,800);
            // });
            Laya.stage.on("StartGame",this,function(){this.isStartGame = true;});
            Laya.stage.on("GameOver",this,this.gameOver);
            this.loadCarPrefab();
        }

        //游戏结束 删除场景中所有已经产生过的 obj
        gameOver(){
            this.isStartGame = false;
            this.spawnCarArr.forEach(element => {
                element.removeSelf();
            });
        }

        homeBtnClick(){
            this.gameOver();
        }

        restartBtnClick(){
            this.spawnCarArr.forEach(element => {
                element.removeSelf();
            });
        }

        /**加载prefab */
        loadCarPrefab(){
            
            //prefab路径
            var pathArr=[
                "prefab/Car_1.json",
                "prefab/Car_2.json",
                "prefab/Car_3.json",
                "prefab/Car_4.json",
                "prefab/Car_5.json",
                "prefab/Car_6.json",
                "prefab/Coin.json",
            ];
            var infoArr = [];
            for(var i=0;i<pathArr.length;i++){
                infoArr.push({url:pathArr[i],type:Laya.Loader.PREFAB});
            }
            
            //加载资源
            Laya.loader.load(infoArr,Laya.Handler.create(this,function(result){
                //当result为true  表示所有的资源加载成功
                console.log(result);
                //怎么获取单个资源：使用getRes方法 参数为对应prefab资源的url
                for(var i=0;i<pathArr.length;i++){
                    this.carPrefabArr.push(Laya.loader.getRes(pathArr[i]));
                }
                console.log(this.carPrefabArr);

                this.ranTime = this.getRandom(500,1000);
                //这是个根据时间进行循环调用的方法
                Laya.timer.loop(this.ranTime,this,function(){
                    this.spawn();
                    this.ranTime = this.getRandom(500,1000);
                });
            }));
        }

        /** X坐标  190 380 570 760*/
        spawn(){
            if(!this.isStartGame) 
                return;

            var arrX = [190,380,570,760];
            this.arrY = -300;
            //获取敌人汽车随机出现的位置
            this.x = arrX[this.getRandom(0,arrX.length-1)];

            var carIndex = this.getRandom(0,this.carPrefabArr.length-1);
            //使用对象池 来管理这些car prefab   根据第一个参数 标识符 在对象池寻找对应的prefab  如果不存在就重新生成一个
            var car= Laya.Pool.getItemByCreateFun(carIndex.toString(),function(){
                return this.carPrefabArr[carIndex].create()
            },this);

            // var carPrefab= this.carPrefabArr[carIndex];
            // var car = carPrefab.create();
            //获取stage下面的scene
            Laya.stage.getChildAt(0).getChildAt(0).addChild(car);
            car.pos(this.x,this.arrY);
            //传递标识符
            car.getComponent(Car).Init(carIndex.toString());

            this.spawnCarArr.push(car);
            //随机敌人汽车
            // var typeArr = [1,2,3,4,5,6];
            // var typeIndex = this.getRandom(0,typeArr.length-1);
            // switch(typeArr[typeIndex]){
            //     case 1:
            //         //Laya.Prefab
            //         this.create(this.car_1);
            //         break;
            //     case 2:
            //         this.create(this.car_2);
            //         break;
            //     case 3:
            //         this.create(this.car_3);
            //         break;
            //     case 4:
            //         this.create(this.car_4);
            //         break;
            //     case 5:
            //         this.create(this.car_5);
            //         break;
            //     case 6:
            //         this.create(this.car_6);
            //         break;
            // }
        }

        /**实例化prefab */
        // create(prefab){
        //     var car = prefab.create();
        //     Laya.stage.addChild(car);
        //     car.pos(this.x,this.arrY);
        // }

          /**
         * 封装一个随机数
         * @param {*最小值} min 
         * @param {*最大值} max 
         */
        getRandom(min,max){
            var value = Math.random()*(max-min);
            value = Math.round(value);
            return min+value;
        }
    }

    class GamePanel extends Laya.Script{

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

    class PausePanel extends Laya.Script{

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
            this.owner.parent.getComponent(GameMamager).homeBtnClick();
            this.owner.parent.getChildByName("Player").getComponent(Player).ResetCarPos();
        }

        //重新开始游戏
        restartBtnClick(){
            Laya.SoundManager.playSound("res/Sounds/ButtonClick.ogg",1);
            Laya.timer.resume();
            this.owner.visible = false;
            this.owner.parent.getComponent(GameMamager).restartBtnClick();
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

    class GameOverPanel extends Laya.Script{

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
            this.owner.parent.getComponent(GameMamager).homeBtnClick();
            this.owner.parent.getChildByName("Player").getComponent(Player).ResetCarPos();
        }

        //重新开始游戏
        restartBtnClick(){
            Laya.SoundManager.playSound("res/Sounds/ButtonClick.ogg",1);
            this.owner.visible = false;
            this.owner.parent.getComponent(GameMamager).restartBtnClick();
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

    /**This class is automatically generated by LayaAirIDE, please do not make any modifications. */

    class GameConfig {
        static init() {
            //注册Script或者Runtime引用
            let reg = Laya.ClassUtils.regClass;
    		reg("scripts/AutoMove.js",AutoMove);
    		reg("scripts/StartPanel.js",StartPanel);
    		reg("scripts/Player.js",Player);
    		reg("scripts/GameManager.js",GameMamager);
    		reg("scripts/GamePanel.js",GamePanel);
    		reg("scripts/PausePanel.js",PausePanel);
    		reg("scripts/GameOverPanel.js",GameOverPanel);
    		reg("scripts/Car.js",Car);
        }
    }
    GameConfig.width = 1080;
    GameConfig.height = 1920;
    GameConfig.scaleMode ="showall";
    GameConfig.screenMode = "none";
    GameConfig.alignV = "middle";
    GameConfig.alignH = "center";
    GameConfig.startScene = "Main.scene";
    GameConfig.sceneRoot = "";
    GameConfig.debug = false;
    GameConfig.stat = false;
    GameConfig.physicsDebug = false;
    GameConfig.exportSceneToJson = true;

    GameConfig.init();

    class Main {
    	constructor() {
    		//根据IDE设置初始化引擎		
    		if (window["Laya3D"]) Laya3D.init(GameConfig.width, GameConfig.height);
    		else Laya.init(GameConfig.width, GameConfig.height, Laya["WebGL"]);
    		Laya["Physics"] && Laya["Physics"].enable();
    		Laya["DebugPanel"] && Laya["DebugPanel"].enable();
    		Laya.stage.scaleMode = GameConfig.scaleMode;
    		Laya.stage.screenMode = GameConfig.screenMode;
    		Laya.stage.alignV = GameConfig.alignV;
    		Laya.stage.alignH = GameConfig.alignH;
    		//兼容微信不支持加载scene后缀场景
    		Laya.URL.exportSceneToJson = GameConfig.exportSceneToJson;

    		//打开调试面板（通过IDE设置调试模式，或者url地址增加debug=true参数，均可打开调试面板）
    		if (GameConfig.debug || Laya.Utils.getQueryString("debug") == "true") Laya.enableDebugPanel();
    		if (GameConfig.physicsDebug && Laya["PhysicsDebugDraw"]) Laya["PhysicsDebugDraw"].enable();
    		if (GameConfig.stat) Laya.Stat.show();
    		Laya.alertGlobalError(true);

    		//激活资源版本控制，version.json由IDE发布功能自动生成，如果没有也不影响后续流程
    		Laya.ResourceVersion.enable("version.json", Laya.Handler.create(this, this.onVersionLoaded), Laya.ResourceVersion.FILENAME_VERSION);
    	}

    	onVersionLoaded() {
    		//激活大小图映射，加载小图的时候，如果发现小图在大图合集里面，则优先加载大图合集，而不是小图
    		Laya.AtlasInfoManager.enable("fileconfig.json", Laya.Handler.create(this, this.onConfigLoaded));
    	}

    	onConfigLoaded() {
    		//加载IDE指定的场景
    		GameConfig.startScene && Laya.Scene.open(GameConfig.startScene);
    	}
    }
    //激活启动类
    new Main();

}());
