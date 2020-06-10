import MoleCtrl from "./MoleCtrl";
import EffectAutoDestroy from "./EffectAutoDestroy";

export default class HummerCtrl extends Laya.Script{

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