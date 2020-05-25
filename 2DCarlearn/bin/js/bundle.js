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
        }

        onUpdate(){
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
            Laya.stage.on(Laya.Event.MOUSE_DOWN,this,this.mouseDown);
            Laya.stage.on(Laya.Event.MOUSE_UP,this,this.mouseUp);
            Laya.stage.on("StartGame",this,function(){
                this.isStartGame = true;
            });
            //获取RigidBody
            this.rig = this.owner.getComponent(Laya.RigidBody);
            //随机小汽车 初始位置
            var index= this.getRandom(0,this.initXArr.length-1);
            this.owner.pos(this.initXArr[index],this.initY);
        }

        onUpdate(){
           if(this.owner.x>this.playerMaxX){
               this.owner.x = this.playerMaxX;
           }
           if(this.owner.x<this.playerMinX){
            this.owner.x = this.playerMinX;
           }
        }

        mouseDown(){
            if(this.isStartGame == false){
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
    }

    class Car extends Laya.Script{

        constructor()
        {
            super();
             /** @prop {name:speed, tips:"提示文本", type:number} */
             this.speed = 15;
        }

        onAwake(){

        } 

        Init(sign){
            this.sign = sign;
        }

        onUpdate(){
            this.owner.y+=this.speed;
        }


        onTriggerExit(other){
            //检测到碰撞的时候
            if(other.label == "BottomCollider"){
                //将自己移出舞台
                this.owner.removeSelf();
                //对象池回收
                Laya.Pool.recover(this.sign,this.owner);
                console.log("0000000");
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

        }

        onAwake(){
            // this.ranTime = this.getRandom(300,800);
            // //这是个根据时间进行循环调用的方法
            // Laya.timer.loop(this.ranTime,this,function(){
            //     this.spawn();
            //     this.ranTime = this.getRandom(300,800);
            // });
            this.loadCarPrefab();
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

                this.ranTime = this.getRandom(300,800);
                //这是个根据时间进行循环调用的方法
                Laya.timer.loop(this.ranTime,this,function(){
                    this.spawn();
                    this.ranTime = this.getRandom(300,800);
                });
            }));
        }

        /** X坐标  190 380 570 760*/
        spawn(){
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
            Laya.stage.addChild(car);
            car.pos(this.x,this.arrY);
            //传递标识符
            car.getComponent(Car).Init(carIndex.toString());

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

    /**This class is automatically generated by LayaAirIDE, please do not make any modifications. */

    class GameConfig {
        static init() {
            //注册Script或者Runtime引用
            let reg = Laya.ClassUtils.regClass;
    		reg("scripts/AutoMove.js",AutoMove);
    		reg("scripts/StartPanel.js",StartPanel);
    		reg("scripts/Player.js",Player);
    		reg("scripts/GameManager.js",GameMamager);
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
