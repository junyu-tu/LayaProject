import Car from "./Car";

export default class GameMamager extends Laya.Script{

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
        this.isStartGame = false;
        this.spawnCarArr = []; //存放生成的所有obj
    }

    onAwake(){
        // this.ranTime = this.getRandom(300,800);
        // //这是个根据时间进行循环调用的方法
        // Laya.timer.loop(this.ranTime,this,function(){
        //     this.spawn();
        //     this.ranTime = this.getRandom(300,800);
        // });
        Laya.stage.on("StartGame",this,function(){this.isStartGame = true});
        Laya.stage.on("GameOver",this,this.gameOver);
        this.loadCarPrefab();
    }

    //游戏结束 删除场景中所有已经产生过的 obj
    gameOver(){
        this.isStartGame = false;
        this.spawnCarArr.forEach(element => {
            element.removeSelf();
        });
    }

    homeBtnClick(){
        this.gameOver();
    }

    restartBtnClick(){
        this.spawnCarArr.forEach(element => {
            element.removeSelf();
        });
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
            "prefab/Coin.json",
        ]
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

            this.ranTime = this.getRandom(500,1000);
            //这是个根据时间进行循环调用的方法
            Laya.timer.loop(this.ranTime,this,function(){
                this.spawn();
                this.ranTime = this.getRandom(500,1000);
            });
        }));
    }

    /** X坐标  190 380 570 760*/
    spawn(){
        if(!this.isStartGame) 
            return;

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
        //获取stage下面的scene
        Laya.stage.getChildAt(0).getChildAt(0).addChild(car);
        car.pos(this.x,this.arrY);
        //传递标识符
        car.getComponent(Car).Init(carIndex.toString());

        this.spawnCarArr.push(car);
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