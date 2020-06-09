export default class LearnImage extends Laya.Script {
    
    constructor(){
        super();
        this.texture1 = "res/sprite/1.jpg";
        this.texture2 = "res/sprite/2.jpg";
        this.ape = null;
        this.flag = false;
    }

    onAwake(){
        //加载Image
        //this.LoadImage();

        //加载多个图片 进行切换   2.X版本 这里的图片只能加载一个
        Laya.loader.load(this.texture1, Laya.Handler.create(this, this.onAssetsLoaded));

        //​ loadImage()方法可以即时加载外部图片资源，也可以从缓冲区读取图片资源
        //drawTexture()方法则必须先加载完图片后，再绘制添加到舞台中来，因此在示例代码中需要使用到加载（Laya.loader.load()）与回调(Handler.create())的方法
        //drawTexture 可能比较少用 这里不写案例  到时候要看 可以去 https://ldc2.layabox.com/doc/?language=zh&nav=zh-js-1-3-0 看

        //遮罩

        //滤镜
    }

    LoadImage(){
        // 方法1：使用loadImage
        var ape = new Laya.Sprite();
        Laya.stage.addChild(ape);
        ape.loadImage("res/sprite/1.jpg");
   }

   onAssetsLoaded()
   {
       this.ape= new Laya.Sprite();
       Laya.stage.addChild(this.ape);
       this.ape.pivot(55, 72);
       this.ape.pos(200, 200);

       // 显示默认纹理
       this.switchTexture();

       this.ape.on("click", this, this.switchTexture);
   }

   switchTexture()
    {
        var textureUrl = (this.flag = !this.flag) ? this.texture1 : this.texture2;

        // 更换纹理
        this.ape.graphics.clear();
        this.ape.loadImage(textureUrl);
        var texture = Laya.loader.getRes(textureUrl);
    }

}