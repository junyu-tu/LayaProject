/**
*
* @ author:Hello
* @ email:838801978@qq.com
* @ data: 2020-06-05 17:47
*/
export default class LearnList extends Laya.Script {

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
        var array = []
        for(var i=0;i<10;i++){
            var temp = null;
            temp={
                icon:"res/sprite/1.jpg",
                order:i+1,
                score:20
            }
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
        Laya.stage.on(Laya.Event.MOUSE_DOWN,this,function(){this.isMouseDown = true});
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