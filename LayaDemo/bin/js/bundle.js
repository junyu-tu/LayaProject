(function () {
   'use strict';

   /**
   *
   * @ author:Hello
   * @ email:838801978@qq.com
   * @ data: 2020-06-05 12:46
   */
   class LearnClip extends Laya.Script {

       constructor() {
           super();
           /** @prop {name:theclip, tips:"提示文本", type:Node, default:null}*/
           this.theclip=null;
           /** @prop {name:thebutton, tips:"提示文本", type:Node, default:null}*/
           this.thebutton=null;
           //设置一个flag 状态值
           this.isPause = false;
       }

       onAwake() {
           //创建一个Clip
           // var clip = new Laya.Clip("res/sprite/clip_num.png",10,1);
           // clip.autoPlay = true;
           // //播放的间隔时间 1000毫秒
           // clip.interval = 1000; 
           // clip.x = 500;
           // clip.y = 500;
           // Laya.stage.addChild(clip);
      
           this.theclip.autoPlay = true;
           this.theclip.interval = 1000;

           this.thebutton.on(Laya.Event.CLICK,this,this.buttonclick);
       }

       buttonclick(){
           this.isPause = !this.isPause;
           if(this.isPause){
               this.thebutton.label = "播放";
               this.index = this.theclip.index;
               //停止播放
               this.theclip.stop(); 
           }else{
               this.thebutton.label = "暂停";
               //继续播放
               this.theclip.play();
               this.theclip.index = this.index;
           }
       }

   }

   /**
   *
   * @ author:Hello
   * @ email:838801978@qq.com
   * @ data: 2020-06-05 17:47
   */
   class LearnList extends Laya.Script {

       constructor() {
           super();
           /** @prop {name:list, tips:"提示文本", type:Node, default:null}*/
           this.list=null;
           /** @prop {name:progressBar, tips:"提示文本", type:Node, default:null}*/
           this.progressBar=null;
       }

       onAwake() {
           //Laya.List  array参数         只增加滚动长度    
           //           renderHandler     单元格渲染处理器
           //           dataSource        每个item里面的数据

           this.list.renderHandler =new Laya.Handler(this,function(cell,index)
           {
               cell.getChildAt(0).skin = cell.dataSource.icon;
               cell.getChildAt(1).text = cell.dataSource.order;
               cell.getChildAt(2).text = cell.dataSource.score;
           });

           //List Item的选中获取  需要将属性selectEnable设置为 true  而不能使默认值
           this.list.selectHandler = new Laya.Handler(this,function(index)
           {
               console.log(index);
           });

           //给List增加10个Item   对List的扩容
           var array = [];
           for(var i=0;i<10;i++){
               var temp = null;
               temp={
                   icon:"res/sprite/1.jpg",
                   order:i+1,
                   score:20
               };
               array.push(temp);
           }
           this.list.array = array;
           
           //这种初始化方案 Text无法初始化
           // var array = []
           // for(var i=0;i<10;i++){
           //     var temp = null;
           //     temp={
           //         a:"res/sprite/1.jpg",
           //         b:111,
           //         c:20,
           //         d:1111111
           //     }
           //     array.push(temp);
           // }
           // this.list.array = array;

           //给List赋初始值  
           // for (var index = 0; index < array.length; index++) {
           //     //getCell  这个方法有个坑 只能获取到在编辑器中设置的item个数   额外的item个数无法正确的赋值  
           //     var box= this.list.getCell(index);  
           //     box.getChildAt(0).skin = array[index].icon;
           //     box.getChildAt(1).text = array[index].order;
           //     box.getChildAt(2).text = array[index].score;
           // }

           //进度条组件
           this.isMouseDown = false;
           Laya.stage.on(Laya.Event.MOUSE_DOWN,this,function(){this.isMouseDown = true;});
       }

       onUpdate(){
           //单元格的处理器
           // this.list.renderHandler = Laya.Handler.create(this,function(cell,index)
           // {
           //     cell.getChildAt(0).skin = cell.dataSource.icon;
           //     cell.getChildAt(1).text = cell.dataSource.order;
           //     cell.getChildAt(2).text = cell.dataSource.score;
           // });

           if(this.isMouseDown){
               this.progressBar.value+=0.01;
               if(this.progressBar.value >=1){
                   this.progressBar.value = 1;
                   this.isMouseDown = false;
               }
           }
       }
   }

   /**
   *
   * @ author:Hello
   * @ email:838801978@qq.com
   * @ data: 2020-06-04 17:19
   */
   class LearnScrollbar extends Laya.Script {

       constructor() {
           super();
           /** @prop {name:txt, tips:"提示文本", type:Node, default:null}*/
           this.txt=null;
           /** @prop {name:scrollBar, tips:"提示文本", type:Node, default:null}*/
           this.scrollBar=null;
           /** @prop {name:othertxt, tips:"提示文本", type:Node, default:null}*/
           this.othertxt=null;
       }

       onAwake() {
           //对ScrollBar上面的两个按钮进行监听   注意 onClick  这个方法名 是Laya的虚方法 用于监听舞台是否被点击  别到时候创建方法名 重名了
           this.scrollBar.upButton.on(Laya.Event.CLICK,this,this.upClick);
           this.scrollBar.downButton.on(Laya.Event.CLICK,this,this.downClick);

           
           //创建位图字体对象
           var bitfontmap = new Laya.BitmapFont();
           //加载位图字体 并注册 然后赋给相关的Text
           bitfontmap.loadFont("Font/nummap.fnt",Laya.Handler.create(this,function(){
               //注册位图字体  第一个参数 是自己定义的位图字体的名字
               Laya.Text.registerBitmapFont("nihao",bitfontmap);
               this.txt.font = "nihao";
           }));

           //加载ttf字体
           Laya.loader.load("Font/BalooBhaina-Regular.ttf",Laya.Handler.create(this,function(res){
               console.log(res);
               this.othertxt.font = res.fontName;
           }),null,Laya.Loader.TTF,0,true);


       }

       upClick(){
           console.log("Up!!");
       }

       downClick(){
           console.log("Down!!");
       }

       onUpdate(){
           //console.log(this.scrollBar.value);
           //使用滚动条的滚动比例 去乘以 文本的横向滚动的最大值  就可以得到当前文本滚动的位置
           //this.txt.scrollX = this.scrollBar.value * this.txt.maxScrollX;

           //通过监听scrollbar的方法也可以 控制文字滑动   (这种使用handler进行监听的方式  必须放在onUpdate里面)
           this.scrollBar.changeHandler = Laya.Handler.create(this,this.onValueChange);
           // Laya.ScrollBar
       }

       onValueChange(value){
           console.log(value);
           this.txt.scrollX = value * this.txt.maxScrollX;
       }

       onDisable(){
           this.scrollBar.upButton.off(Laya.Event.CLICK,this,this.upClick);
           this.scrollBar.downButton.off(Laya.Event.CLICK,this,this.downClick);
       }
   }

   /**
   *
   * @ author:Hello
   * @ email:838801978@qq.com
   * @ data: 2020-06-05 15:28
   */
   class LearnRunTime extends Laya.Image {

       constructor() {
           super();
           this.anchorX = 0.5;
           this.anchorY = 0.5;
       }

       onAwake() {
           this.on(Laya.Event.MOUSE_DOWN,this,this.mouseDown);
           this.on(Laya.Event.MOUSE_UP,this,this.mouseUp);
       }

       mouseDown(){
           Laya.Tween.to(this,{scaleX:0.5,scaleY:0.5},100);
       }

       mouseUp(){
           Laya.Tween.to(this,{scaleX:1,scaleY:1},100);
       }
   }

   class LearnText extends Laya.Script {
       
       constructor(){
           super();
           this.txt = null;
           this.prevX = 0;
           this.prevY = 0;
       }

       onAwake(){
           //创建一个文本
           //createTxt();

           //创建一个InputText
           this.createTextInput();     

           //当文本超过文本域范围  三个种类限制
           //this.createTexts();

           //文本的滚动  
           //this.createTextGun();
     
           
       }

       createTxt(){
           //创建一个基本Text
   		var txt = new Laya.Text();
           txt.text =  "Layabox是HTML5引擎技术提供商与优秀的游戏发行商，面向AS/JS/TS开发者提供HTML5开发技术方案！\n";

   		txt.bgColor = "#555555";//文本域的颜色（背景颜色）
   		txt.color = "#ffffff";  //文字颜色
   		txt.fontSize = 20;      //字体大小
   		txt.bold = true;        //粗体
   		txt.italic = true;      //斜体
           txt.wordWrap = true;    //自动换行
           txt.x = 160;            //Text的x位置
           txt.y= 340;             //Text的y位置
           txt.borderColor = "#ffff00";  //文本边框颜色
           
   		//需要设置文本区域 水平居中和垂直居中才有效果
   		txt.width = 400;    //文本的宽
   		txt.height = 50;    //文本的高
   		txt.align = "center";  //文本水平居中
           txt.valign = "middle"; //文本垂直居中
           //当文本超过文本域范围 相应的处理方式
           //hidden：隐藏文本域外的内容    visible：显示全部内容    scroll：隐藏文本域外的内容，支持文本滑动
           txt.overflow = "scroll"; 
   		//将Text加载到舞台上面
           Laya.stage.addChild(txt);
       }

       createTextInput(){
           //创建一个单行输入textInput
           var textInput = new Laya.TextInput("单行输入");
           textInput.wordWrap = true; 
           textInput.fontSize = 30;
           textInput.x = 0;
           textInput.y = 0;
           textInput.width = 300;
           textInput.height = 200;
           textInput.bgColor = "#aabbcc";
           Laya.stage.addChild(textInput);

           //创建一个多行输入textInput
           var txtInput = new Laya.TextInput("多行输入");
           txtInput.fontSize = 30;
           //这两个属性同时设置 才能进行多行输入
           txtInput.wordWrap = true;
           txtInput.multiline = true;//设置textInput的多行输入
           txtInput.x = 0;
           txtInput.y = 300;
           txtInput.width = 300;
           txtInput.height = 200;
           txtInput.bgColor = "#aabbcc";
           Laya.stage.addChild(txtInput);
       }


       createTexts()
       {
           var t1 = this.createText();
           //overflow   文本超出文本域范围的行为
           t1.overflow = Laya.Text.VISIBLE;   
           t1.pos(10, 10);

           var t2 = this.createText();
           t2.overflow = Laya.Text.SCROLL;
           t2.pos(10, 110);

           var t3 = this.createText();
           t3.overflow = Laya.Text.HIDDEN;
           t3.pos(10, 210);
       }

       createText()
       {
           var txt = new Laya.Text();
           txt.text =
               "Layabox是HTML5引擎技术提供商与优秀的游戏发行商，面向AS/JS/TS开发者提供HTML5开发技术方案！\n" +
               "Layabox是HTML5引擎技术提供商与优秀的游戏发行商，面向AS/JS/TS开发者提供HTML5开发技术方案！\n" +
               "Layabox是HTML5引擎技术提供商与优秀的游戏发行商，面向AS/JS/TS开发者提供HTML5开发技术方案！";

           txt.borderColor = "#FFFF00";
           txt.size(300,50);
           txt.fontSize = 20;
           txt.color = "#ffffff";

           Laya.stage.addChild(txt);
           return txt;
       }

      
       createTextGun()
       {
           this.txt = new Laya.Text();
           this.txt.overflow = Laya.Text.SCROLL;  
           this.txt.text =
               "Layabox是HTML5引擎技术提供商与优秀的游戏发行商，面向AS/JS/TS开发者提供HTML5开发技术方案！\n" +
               "Layabox是HTML5引擎技术提供商与优秀的游戏发行商，面向AS/JS/TS开发者提供HTML5开发技术方案！\n" +
               "Layabox是HTML5引擎技术提供商与优秀的游戏发行商，面向AS/JS/TS开发者提供HTML5开发技术方案！\n" +
               "Layabox是HTML5引擎技术提供商与优秀的游戏发行商，面向AS/JS/TS开发者提供HTML5开发技术方案！\n" +
               "Layabox是HTML5引擎技术提供商与优秀的游戏发行商，面向AS/JS/TS开发者提供HTML5开发技术方案！\n" +
               "Layabox是HTML5引擎技术提供商与优秀的游戏发行商，面向AS/JS/TS开发者提供HTML5开发技术方案！\n" +
               "Layabox是HTML5引擎技术提供商与优秀的游戏发行商，面向AS/JS/TS开发者提供HTML5开发技术方案！\n" +
               "Layabox是HTML5引擎技术提供商与优秀的游戏发行商，面向AS/JS/TS开发者提供HTML5开发技术方案！\n" +
               "Layabox是HTML5引擎技术提供商与优秀的游戏发行商，面向AS/JS/TS开发者提供HTML5开发技术方案！";


           this.txt.size(200, 100);
           this.txt.x = Laya.stage.width - this.txt.width >> 1;
           this.txt.y = Laya.stage.height - this.txt.height >> 1;

           this.txt.borderColor = "#FFFF00";
           this.txt.fontSize = 20;
           this.txt.color = "#ffffff";

           Laya.stage.addChild(this.txt);
           this.txt.on(Laya.Event.MOUSE_DOWN, this, this.startScrollTextGun);
       }



        //开始滚动文本
       startScrollTextGun()
       {
           this.prevX = this.txt.mouseX;
           this.prevY = this.txt.mouseY;

           Laya.stage.on(Laya.Event.MOUSE_MOVE, this, this.scrollTextGun);
           Laya.stage.on(Laya.Event.MOUSE_UP, this, this.finishScrollTextGun);
       }

        //停止滚动文本
       finishScrollTextGun()
       {
           Laya.stage.off(Laya.Event.MOUSE_MOVE, this, this.scrollTextGun);
           Laya.stage.off(Laya.Event.MOUSE_UP, this, this.finishScrollTextGun);
       }

       //鼠标滚动文本
       scrollTextGun()
       {
           var nowX = this.txt.mouseX;
           var nowY = this.txt.mouseY;

           this.txt.scrollX += this.prevX - nowX;
           this.txt.scrollY += this.prevY - nowY;

           this.prevX = nowX;
           this.prevY = nowY;
       }


   }

   /**This class is automatically generated by LayaAirIDE, please do not make any modifications. */

   class GameConfig {
       static init() {
           //注册Script或者Runtime引用
           let reg = Laya.ClassUtils.regClass;
   		reg("scripts/LearnClip.js",LearnClip);
   		reg("scripts/LearnList.js",LearnList);
   		reg("scripts/LearnScrollbar.js",LearnScrollbar);
   		reg("scripts/LearnRunTime.js",LearnRunTime);
   		reg("scripts/LearnText.js",LearnText);
       }
   }
   GameConfig.width = 720;
   GameConfig.height = 1280;
   GameConfig.scaleMode ="showall";
   GameConfig.screenMode = "none";
   GameConfig.alignV = "middle";
   GameConfig.alignH = "center";
   GameConfig.startScene = "Clip.scene";
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
   		//Laya.stage.scaleMode = Laya.Stage.SCALE_SHOWALL;
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

   		console.log("Hello Layabox");
   	}
   }
   //激活启动类
   new Main();

}());
