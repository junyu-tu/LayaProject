(function () {
    'use strict';

    class AutoMove extends Laya.Script {
        constructor() {
            super();
            this.moveSpeed = 20;
            this.height = 0;
        }
        onAwake() {
            this.height = this.owner.height;
            Laya.timer.frameLoop(1, this, this.frameLoop);
        }
        frameLoop() {
            this.owner.y += this.moveSpeed;
            if (this.owner.y >= this.height) {
                this.owner.y -= this.height * 2;
            }
        }
    }

    class StartPanel extends Laya.Script {
        constructor() {
            super();
            this.btn_Play = null;
            this.btn_AudioOn = null;
            this.btn_AudioOff = null;
            this.owner = this.owner;
        }
        onAwake() {
            this.btn_Play.on(Laya.Event.CLICK, this, this.btnPlayClick);
            this.btn_AudioOn.on(Laya.Event.CLICK, this, this.btnAudioOnClick);
            this.btn_AudioOff.on(Laya.Event.CLICK, this, this.btnAudioOffClick);
            if (Laya.SoundManager.muted) {
                this.btn_AudioOff.visible = true;
                this.btn_AudioOn.visible = false;
            }
            else {
                this.btn_AudioOff.visible = false;
                this.btn_AudioOn.visible = true;
            }
            Laya.stage.on("AudioClick", this, this.audioClick);
        }
        btnPlayClick() {
            Laya.SoundManager.playSound("res/Sounds/ButtonClick.ogg", 1);
            this.owner.visible = false;
            Laya.stage.event("StartGame");
        }
        btnAudioOnClick() {
            Laya.SoundManager.playSound("res/Sounds/ButtonClick.ogg", 1);
            Laya.SoundManager.muted = true;
            Laya.stage.event("AudioClick", true);
        }
        btnAudioOffClick() {
            Laya.SoundManager.playSound("res/Sounds/ButtonClick.ogg", 1);
            Laya.SoundManager.muted = false;
            Laya.stage.event("AudioClick", false);
        }
        homeBtnClick() {
            this.owner.visible = true;
        }
        audioClick(value) {
            if (value) {
                this.btn_AudioOff.visible = true;
                this.btn_AudioOn.visible = false;
            }
            else {
                this.btn_AudioOff.visible = false;
                this.btn_AudioOn.visible = true;
            }
        }
    }

    class Car extends Laya.Script {
        constructor() {
            super();
            this.speed = 15;
            this.sign = "";
        }
        onAwake() {
            Laya.timer.frameLoop(1, this, this.frameMove);
        }
        Init(sign) {
            this.sign = sign;
        }
        frameMove() {
            this.owner.y += this.speed;
        }
        onTriggerExit(other) {
            if (other.label == "BottomCollider") {
                this.owner.removeSelf();
                this.recover();
            }
        }
        recover() {
            Laya.Pool.recover(this.sign, this.owner);
        }
    }

    class Player extends Laya.Script {
        constructor() {
            super();
            this.playerMinX = 200;
            this.playerMaxX = 880;
            this.isStartGame = false;
            this.initXArr = [260, 450, 640, 820];
            this.initY = 1360;
            this.rig = null;
            this.owner = this.owner;
        }
        onAwake() {
            Laya.SoundManager.playMusic("res/Sounds/FutureWorld_Dark_Loop_03.ogg", 0);
            Laya.stage.on(Laya.Event.MOUSE_DOWN, this, this.mouseDown);
            Laya.stage.on(Laya.Event.MOUSE_UP, this, this.mouseUp);
            Laya.stage.on("StartGame", this, function () {
                this.isStartGame = true;
            });
            Laya.stage.on("Pause", this, function () {
                this.isStartGame = false;
            });
            this.rig = this.owner.getComponent(Laya.RigidBody);
            this.ResetCarPos();
        }
        onUpdate() {
            if (this.owner.x > this.playerMaxX) {
                this.owner.x = this.playerMaxX;
            }
            if (this.owner.x < this.playerMinX) {
                this.owner.x = this.playerMinX;
            }
        }
        ResetCarPos() {
            var index = this.getRandom(0, this.initXArr.length - 1);
            this.owner.pos(this.initXArr[index], this.initY);
        }
        mouseDown() {
            if (this.isStartGame == false) {
                return;
            }
            if (Laya.stage.mouseY < 500) {
                return;
            }
            var mouseX = Laya.stage.mouseX;
            var force = 0;
            if (mouseX < Laya.stage.width / 2) {
                console.log("Left");
                force = -1;
            }
            else {
                console.log("right");
                force = 1;
            }
            this.rig.linearVelocity = { x: force * 8, y: 0 };
            Laya.Tween.to(this.owner, { rotation: force * 25 }, 300);
        }
        mouseUp() {
            this.rig.linearVelocity = { x: 0, y: 0 };
            Laya.Tween.to(this.owner, { rotation: 0 }, 300);
        }
        getRandom(min, max) {
            var value = Math.random() * (max - min);
            value = Math.round(value);
            return min + value;
        }
        onTriggerEnter(other) {
            if (other.label == "Car") {
                Laya.SoundManager.playSound("res/Sounds/CarCrash.ogg", 1);
                Laya.stage.event("GameOver");
                this.isStartGame = false;
            }
            if (other.label == "Coin") {
                Laya.SoundManager.playSound("res/Sounds/Bonus.ogg", 1);
                other.owner.removeSelf();
                other.owner.getComponent(Car).recover();
                Laya.stage.event("AddScore", 10);
            }
        }
    }

    class GamePanel extends Laya.Script {
        constructor() {
            super();
            this.score = 0;
            this.txt_Best = null;
            this.txt_Last = null;
            this.txt_Score = null;
        }
        onAwake() {
            this.txt_Best = this.owner.getChildByName("txt_Best");
            this.txt_Last = this.owner.getChildByName("txt_Last");
            this.txt_Score = this.owner.getChildByName("txt_Score");
            this.owner.getChildByName("btn_Pause").on(Laya.Event.CLICK, this, this.pauseBtnClick);
            Laya.loader.load("hemiheadbdit.ttf", Laya.Handler.create(this, function (font) {
                console.log(font);
                this.txt_Best.font = font.fontName;
                this.txt_Last.font = font.fontName;
                this.txt_Score.font = font.fontName;
            }), null, Laya.Loader.TTF);
            this.owner.visible = false;
            Laya.stage.on("StartGame", this, function () {
                this.owner.visible = true;
                this.Init();
            });
            Laya.stage.on("GameOver", this, function () {
                this.owner.visible = false;
            });
            Laya.timer.loop(300, this, this.AddScore);
            Laya.stage.on("AddScore", this, this.AddScore);
        }
        Init() {
            this.txt_Last.text = "Last:" + Number(Laya.LocalStorage.getItem("LastScore"));
            this.txt_Best.text = "Best:" + Number(Laya.LocalStorage.getItem("BestScore"));
            this.txt_Score.text = "0";
            this.score = 0;
        }
        AddScore(score = 1) {
            if (this.owner.visible == false)
                return;
            this.score += score;
            this.txt_Score.text = this.score;
        }
        pauseBtnClick() {
            Laya.SoundManager.playSound("res/Sounds/ButtonClick.ogg", 1);
            Laya.timer.pause();
            this.owner.visible = false;
            Laya.stage.event("Pause");
        }
    }

    class GameMamager extends Laya.Script {
        constructor() {
            super();
            this.carPrefabArr = [];
            this.isStartGame = false;
            this.spawnCarArr = [];
        }
        onAwake() {
            Laya.stage.on("StartGame", this, function () { this.isStartGame = true; });
            Laya.stage.on("GameOver", this, this.gameOver);
            this.loadCarPrefab();
        }
        gameOver() {
            this.isStartGame = false;
            this.spawnCarArr.forEach(element => {
                element.removeSelf();
            });
        }
        homeBtnClick() {
            this.gameOver();
        }
        restartBtnClick() {
            this.spawnCarArr.forEach(element => {
                element.removeSelf();
            });
        }
        loadCarPrefab() {
            var pathArr = [
                "prefab/Car_1.json",
                "prefab/Car_2.json",
                "prefab/Car_3.json",
                "prefab/Car_4.json",
                "prefab/Car_5.json",
                "prefab/Car_6.json",
                "prefab/Coin.json",
            ];
            var infoArr = [];
            for (var i = 0; i < pathArr.length; i++) {
                infoArr.push({ url: pathArr[i], type: Laya.Loader.PREFAB });
            }
            Laya.loader.load(infoArr, Laya.Handler.create(this, function (result) {
                console.log(result);
                for (var i = 0; i < pathArr.length; i++) {
                    this.carPrefabArr.push(Laya.loader.getRes(pathArr[i]));
                }
                console.log(this.carPrefabArr);
                this.ranTime = this.getRandom(500, 1000);
                Laya.timer.loop(this.ranTime, this, function () {
                    this.spawn();
                    this.ranTime = this.getRandom(500, 1000);
                });
            }));
        }
        spawn() {
            if (!this.isStartGame)
                return;
            var arrX = [190, 380, 570, 760];
            var arrY = -300;
            var x = arrX[this.getRandom(0, arrX.length - 1)];
            var carIndex = this.getRandom(0, this.carPrefabArr.length - 1);
            var car = Laya.Pool.getItemByCreateFun(carIndex.toString(), function () {
                return this.carPrefabArr[carIndex].create();
            }, this);
            Laya.stage.getChildAt(0).getChildAt(0).addChild(car);
            car.pos(x, arrY);
            car.getComponent(Car).Init(carIndex.toString());
            this.spawnCarArr.push(car);
        }
        getRandom(min, max) {
            var value = Math.random() * (max - min);
            value = Math.round(value);
            return min + value;
        }
    }

    class PausePanel extends Laya.Script {
        constructor() {
            super();
            this.btn_AudioOn = null;
            this.btn_AudioOff = null;
            this.txt_Pause = null;
        }
        onAwake() {
            this.txt_Pause = this.owner.getChildByName("txt_Pause");
            this.owner.getChildByName("btn_Close").on(Laya.Event.CLICK, this, this.CloseBtnClick);
            this.owner.getChildByName("btn_Home").on(Laya.Event.CLICK, this, this.homeBtnClick);
            this.owner.getChildByName("btn_Restart").on(Laya.Event.CLICK, this, this.restartBtnClick);
            this.btn_AudioOn.on(Laya.Event.CLICK, this, this.audioOnBtnClick);
            this.btn_AudioOff.on(Laya.Event.CLICK, this, this.audioOffBtnClick);
            Laya.loader.load("hemiheadbdit.ttf", Laya.Handler.create(this, function (font) {
                console.log(font);
                this.txt_Pause.font = font.fontName;
            }), null, Laya.Loader.TTF);
            Laya.stage.on("Pause", this, function () {
                this.owner.visible = true;
            });
            Laya.stage.on("AudioClick", this, this.audioClick);
            if (Laya.SoundManager.muted) {
                this.btn_AudioOff.visible = true;
                this.btn_AudioOn.visible = false;
            }
            else {
                this.btn_AudioOff.visible = false;
                this.btn_AudioOn.visible = true;
            }
        }
        CloseBtnClick() {
            Laya.SoundManager.playSound("res/Sounds/ButtonClick.ogg", 1);
            Laya.timer.resume();
            this.owner.visible = false;
            this.owner.parent.getChildByName("GamePanel").visible = true;
            this.owner.parent.getChildByName("Player").getComponent(Player).isStartGame = true;
        }
        homeBtnClick() {
            Laya.SoundManager.playSound("res/Sounds/ButtonClick.ogg", 1);
            Laya.timer.resume();
            this.owner.visible = false;
            this.owner.parent.getChildByName("StartPanel").getComponent(StartPanel).homeBtnClick();
            this.owner.parent.getComponent(GameMamager).homeBtnClick();
            this.owner.parent.getChildByName("Player").getComponent(Player).ResetCarPos();
        }
        restartBtnClick() {
            Laya.SoundManager.playSound("res/Sounds/ButtonClick.ogg", 1);
            Laya.timer.resume();
            this.owner.visible = false;
            this.owner.parent.getComponent(GameMamager).restartBtnClick();
            Laya.stage.event("StartGame");
            this.owner.parent.getChildByName("Player").getComponent(Player).ResetCarPos();
        }
        audioOnBtnClick() {
            Laya.SoundManager.playSound("res/Sounds/ButtonClick.ogg", 1);
            Laya.SoundManager.muted = true;
            Laya.stage.event("AudioClick", true);
        }
        audioOffBtnClick() {
            Laya.SoundManager.playSound("res/Sounds/ButtonClick.ogg", 1);
            Laya.SoundManager.muted = false;
            Laya.stage.event("AudioClick", false);
        }
        audioClick(value) {
            if (value) {
                this.btn_AudioOff.visible = true;
                this.btn_AudioOn.visible = false;
            }
            else {
                this.btn_AudioOff.visible = false;
                this.btn_AudioOn.visible = true;
            }
        }
    }

    class GameOverPanel extends Laya.Script {
        constructor() {
            super();
            this.txt_GameOver = null;
            this.txt_Score = null;
            this.txt_HightScore = null;
        }
        onAwake() {
            this.txt_GameOver = this.owner.getChildByName("txt_GameOver");
            this.txt_Score = this.owner.getChildByName("txt_Score");
            this.txt_HightScore = this.owner.getChildByName("txt_HightScore");
            Laya.loader.load("hemiheadbdit.ttf", Laya.Handler.create(this, function (font) {
                this.txt_Score.font = font.fontName;
                this.txt_HightScore.font = font.fontName;
                this.txt_GameOver.font = font.fontName;
            }), null, Laya.Loader.TTF);
            this.owner.getChildByName("btn_Home").on(Laya.Event.CLICK, this, this.homeBtnClick);
            this.owner.getChildByName("btn_Restart").on(Laya.Event.CLICK, this, this.restartBtnClick);
            Laya.stage.on("GameOver", this, this.gameOver);
        }
        homeBtnClick() {
            this.owner.visible = false;
            this.owner.parent.getChildByName("StartPanel").getComponent(StartPanel).homeBtnClick();
            this.owner.parent.getComponent(GameMamager).homeBtnClick();
            this.owner.parent.getChildByName("Player").getComponent(Player).ResetCarPos();
        }
        restartBtnClick() {
            Laya.SoundManager.playSound("res/Sounds/ButtonClick.ogg", 1);
            this.owner.visible = false;
            this.owner.parent.getComponent(GameMamager).restartBtnClick();
            Laya.stage.event("StartGame");
            this.owner.parent.getChildByName("Player").getComponent(Player).ResetCarPos();
        }
        gameOver() {
            Laya.SoundManager.playSound("res/Sounds/ButtonClick.ogg", 1);
            this.owner.visible = true;
            var curScore = this.owner.parent.getChildByName("GamePanel").getComponent(GamePanel).score;
            this.txt_Score.text = "Score:" + curScore;
            var hightScore = Number(Laya.LocalStorage.getItem("BestScore"));
            if (curScore > hightScore) {
                Laya.LocalStorage.setItem("BestScore", curScore);
                this.txt_HightScore.text = "HightScore:" + curScore;
            }
            else {
                this.txt_HightScore.text = "HightScore:" + hightScore;
            }
            Laya.LocalStorage.setItem("LastScore", curScore);
        }
    }

    class GameConfig {
        constructor() {
        }
        static init() {
            var reg = Laya.ClassUtils.regClass;
            reg("scripts/AutoMove.ts", AutoMove);
            reg("scripts/StartPanel.ts", StartPanel);
            reg("scripts/Player.ts", Player);
            reg("scripts/GamePanel.ts", GamePanel);
            reg("scripts/PausePanel.ts", PausePanel);
            reg("scripts/GameOverPanel.ts", GameOverPanel);
            reg("scripts/GameManager.ts", GameMamager);
            reg("scripts/Car.ts", Car);
        }
    }
    GameConfig.width = 1080;
    GameConfig.height = 1920;
    GameConfig.scaleMode = "showall";
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
            if (window["Laya3D"])
                Laya3D.init(GameConfig.width, GameConfig.height);
            else
                Laya.init(GameConfig.width, GameConfig.height, Laya["WebGL"]);
            Laya["Physics"] && Laya["Physics"].enable();
            Laya["DebugPanel"] && Laya["DebugPanel"].enable();
            Laya.stage.scaleMode = GameConfig.scaleMode;
            Laya.stage.screenMode = GameConfig.screenMode;
            Laya.stage.alignV = GameConfig.alignV;
            Laya.stage.alignH = GameConfig.alignH;
            Laya.URL.exportSceneToJson = GameConfig.exportSceneToJson;
            if (GameConfig.debug || Laya.Utils.getQueryString("debug") == "true")
                Laya.enableDebugPanel();
            if (GameConfig.physicsDebug && Laya["PhysicsDebugDraw"])
                Laya["PhysicsDebugDraw"].enable();
            if (GameConfig.stat)
                Laya.Stat.show();
            Laya.alertGlobalError(true);
            Laya.ResourceVersion.enable("version.json", Laya.Handler.create(this, this.onVersionLoaded), Laya.ResourceVersion.FILENAME_VERSION);
        }
        onVersionLoaded() {
            Laya.AtlasInfoManager.enable("fileconfig.json", Laya.Handler.create(this, this.onConfigLoaded));
        }
        onConfigLoaded() {
            GameConfig.startScene && Laya.Scene.open(GameConfig.startScene);
        }
    }
    new Main();

}());
