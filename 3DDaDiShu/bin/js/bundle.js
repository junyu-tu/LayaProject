(function () {
    'use strict';

    class MoleCtrl extends Laya.Script{

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

    class EffectAutoDestroy extends Laya.Script{

        constructor()
        {
            super();
        }

        onAwake(){
            Laya.stage.timerOnce(2000,this,function(){
                this.owner.destroy();
            });
        }
    }

    class HummerCtrl extends Laya.Script{

        constructor()
        {
            super();

        }
        //初始化
        Init(camera,scene,effect){
            this.camera = camera;
            this.scene = scene;
            //physicsSimulation  场景中会自带一个 同时场景中不允许存在多个  意思就是说 不能自己创建新的physicsSimulation
            this.physicsSimulation = scene.physicsSimulation;
            this.effect = effect;
        }

        onAwake(){
            //创建射线
            this.ray = new Laya.Ray(new Laya.Vector3(),new Laya.Vector3());
            //射线检测结果
            this.hitResult = new Laya.HitResult();

            //监听鼠标左键按下
            Laya.stage.on(Laya.Event.MOUSE_DOWN,this,this.onDown);
            //监听游戏结束
            Laya.stage.on("GameOver",this,function(){
                this.isGameOver = true;
            });
            Laya.stage.on("RestartGame",this,function(){
                this.isGameOver = false;
            });
        }

        onDown(){
            if(this.isGameOver){
                return;
            }

            //将屏幕坐标转换成射线
            this.camera.viewportPointToRay(new Laya.Vector2(Laya.stage.mouseX,Laya.stage.mouseY),this.ray);

            if(this.physicsSimulation.rayCast(this.ray,this.hitResult)){
                //只要当地鼠的高度大于等于2时 才能触发打击
                if(this.hitResult.collider.owner.transform.localPosition.y>=2){
                    //console.log(this.hitResult.collider.owner.name);
                    //获取当前地鼠 坐标
                    this.targetPos = this.hitResult.collider.owner.transform.position;
                    this.targetPos.y = 0.35;
                    //设置锤子的初始位置   确保锤子直上直下
                    this.owner.transform.position = new Laya.Vector3(this.targetPos.x,7,this.targetPos.z);
                    //锤子下落动画
                    Laya.Tween.to(this.owner.transform,{localPositionX:this.targetPos.x,localPositionY:this.targetPos.y,
                        localPositionZ:this.targetPos.z},100,Laya.Ease.linearIn,Laya.Handler.create(this,this.DiShuHandleFunction),0,true);
                }         
            }
        }

        DiShuHandleFunction(){
            //地鼠被打调用事件
            this.hitResult.collider.owner.getComponent(MoleCtrl).Knock();

            //创建特效
            var temp = Laya.Sprite3D.instantiate(this.effect,this.scene);
            temp.transform.position = this.targetPos;
            //给特效添加 自动销毁脚本
            temp.addComponent(EffectAutoDestroy);

            Laya.stage.event("AddScore");
            //Laya.SoundManager.playSound("res/audio/hit.mp3",1);
            Laya.SoundManager.playSound("https://dadishu.oss-cn-beijing.aliyuncs.com/hit.mp3",1);
            
            //锤子上升动画
            Laya.Tween.to(this.owner.transform,{localPositionX:this.targetPos.x,localPositionY:7,
                localPositionZ:this.targetPos.z},100,Laya.Ease.linearIn,Laya.Handler.create(this,function(){}),0,true);
        }


    }

    class GameRoot extends Laya.Script{

        constructor()
        {
            super();
            // /** @prop {name:car_1, tips:"提示文本", type:prefab, default:null} */
            // this.car_1 = null;
        }

        onAwake(){
            //加载场景
            Laya.Scene3D.load("res/scene/LayaScene_Main/Conventional/Main.ls",Laya.Handler.create(this,this.onLoadSceneFinish));
        }

        //场景加载完成之后的回调方法，参数：加载完成之后的场景
        onLoadSceneFinish(loadScene){

            //Laya.SoundManager.playMusic("res/audio/bgm.mp3",0);
            Laya.SoundManager.playMusic("https://dadishu.oss-cn-beijing.aliyuncs.com/bgm.mp3",0);

            loadScene.zOrder = -1;
            console.log("load Success");
            //把加载的场景放到舞台上
            Laya.stage.addChild(loadScene);
            //找到每个地鼠  并添加一个脚本
            var moles =  loadScene.getChildByName("Moles");
            for(var i=0;i<moles.numChildren;i++){
                moles.getChildAt(i).getChildAt(0).addComponent(MoleCtrl);
            }
            //找到Camera
            var camera = loadScene.getChildByName("Main Camera");
            //获取粒子
            var effect = loadScene.getChildByName("Explosion");
            //将粒子特效做成预制体
            var effectPrefab = Laya.Sprite3D.instantiate(effect);
            effect.active = false;
            //找到锤子 添加脚本
            loadScene.getChildByName("Hummer").addComponent(HummerCtrl).Init(camera,loadScene,effectPrefab);

            
            
            
        }
    }

    class UICtrl extends Laya.Script{

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

    /**This class is automatically generated by LayaAirIDE, please do not make any modifications. */

    class GameConfig {
        static init() {
            //注册Script或者Runtime引用
            let reg = Laya.ClassUtils.regClass;
    		reg("scripts/GameRoot.js",GameRoot);
    		reg("scripts/UICtrl.js",UICtrl);
        }
    }
    GameConfig.width = 1920;
    GameConfig.height = 1080;
    GameConfig.scaleMode ="fixedheight";
    GameConfig.screenMode = "horizontal";
    GameConfig.alignV = "middle";
    GameConfig.alignH = "center";
    GameConfig.startScene = "GameRoot.scene";
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
