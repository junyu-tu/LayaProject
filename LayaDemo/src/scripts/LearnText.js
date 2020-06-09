export default class LearnText extends Laya.Script {
    
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
        txt.overflow = "scroll" 
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