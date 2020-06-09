/**
*
* @ author:Hello
* @ email:838801978@qq.com
* @ data: 2020-06-04 17:19
*/
export default class LearnScrollbar extends Laya.Script {

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
        this.scrollBar.changeHandler = Laya.Handler.create(this,this.onValueChange)
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