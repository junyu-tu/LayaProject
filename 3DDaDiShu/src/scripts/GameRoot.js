import MoleCtrl from "./MoleCtrl";
import HummerCtrl from "./HummerCtrl";

export default class GameRoot extends Laya.Script{

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