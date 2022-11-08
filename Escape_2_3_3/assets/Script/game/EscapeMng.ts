import MyLocalStorge from "../utils/MyLocalStorge";
import WMap from "../utils/WMap"; 
//全局单实例变量
export default class EscapeMng 
{
    //全局单实例变量中的成员变量，存储当前进入第几关，以及该关的关卡配置
    m_enter_level:number = 0;
    m_enter_level_config = null;

    //最后玩的关卡数
    m_last_enter_level:number = 1;
    //目前解锁的最高关卡
    m_unlock_level:number = 1;


    m_config_archs_info =  null;

    static _instance = null;
    static GetInstance() 
    {
        if (!EscapeMng._instance) {
            // doSomething
            EscapeMng._instance = new EscapeMng();
             
        }
        return EscapeMng._instance;
    } 

    constructor()
    { 

    }
    //获得上次最新玩的关卡
    Get_Last_Enter_Level():number
    { 

        return this.m_last_enter_level;
    }
    /**获取玩家最大解锁关卡 */
    Get_Unlock_level():number {
        return this.m_unlock_level;
    }
    //下一关逻辑
    On_Change_To_Next_Level():void
    {
        this.m_last_enter_level++;

        if(this.m_last_enter_level >= 61)
        {
            this.m_last_enter_level = 1;
        }
        this.SaveLevelInfo();
        if (this.m_last_enter_level > this.m_unlock_level) {
            this.m_unlock_level = this.m_last_enter_level;
            this.SavaUnlocklevelInfo();
        }
    }
    /**更新最大解锁关卡 */
    On_Change_Unlock_Level(unlockLevel:number):void {
        if (unlockLevel >= 61) {
            this.m_unlock_level = 60;
        }
        else {
            this.m_unlock_level = unlockLevel;
        }
        this.SavaUnlocklevelInfo();
    }
    //ilevel:第几关,加载配置关卡文件
    LoadLevelConfig(ilevel:number,callback):void
    {   
         var strfilename = "comdefine/level_"+ilevel;
        cc.loader.loadRes(strfilename,cc.JsonAsset,(error,json_assert)=>
        {
            if(error)
            {
                callback(error,null);
                return;
            }

            var json_assert_obj:cc.JsonAsset = json_assert as unknown as cc.JsonAsset;

            var level_config_obj = json_assert_obj.json;
    
            callback(null,level_config_obj);
        })
       
    }


    InitLoad_All_Config_Files(callback):void
    {
        var strfilename = "comdefine/archs";
        var self  = this;
        cc.loader.loadRes(strfilename,cc.JsonAsset,(error,json_assert)=>
        {
            if(error)
            {
                callback(error,null);
                return;
            }

            var json_assert_obj:cc.JsonAsset = json_assert as unknown as cc.JsonAsset;

            var config_obj = json_assert_obj.json;
       
            self.m_config_archs_info = config_obj;
        })

    }

    //初始化读取上次游戏的数据
    InitLoadLevelInfo():void
    {
        var iprevlevel = MyLocalStorge.getItem("espace_save_level","");
        if(!iprevlevel)
        {
            iprevlevel = 1;
        }

        this.m_last_enter_level  = Number(iprevlevel); 

        let unlockLevel = MyLocalStorge.getItem("espace_unlock_level","");
        if (!unlockLevel) {
            unlockLevel = 1;
        }
        this.m_unlock_level = Number(unlockLevel);

    }
    //保存信息
    SaveLevelInfo():void
    {
        MyLocalStorge.setItem("espace_save_level",this.m_last_enter_level);  
    }
    //保存最大解锁关卡记录
    SavaUnlocklevelInfo(): void {
        MyLocalStorge.setItem("espace_unlock_level",this.m_unlock_level);  
    }

    //获得配置在archs.json文件里面的建筑信息archtypes节点下
    Find_Detail_Arch_Info_By_TypeID(typeid:number)
    {
        var archtypes = this.m_config_archs_info.archtypes;

        for(var ff=0;ff<archtypes.length;ff++)
        {
            var ff_arch_info  = archtypes[ff];
            if(ff_arch_info.type == typeid)
            {
                return ff_arch_info;
            }
        }

        return null;
    }
    //获得配置在archs.json文件里面的连接点信息touchmovejoints节点下
    Find_Detail_TouchMoveJoint_By_TypeID(typeid:number)
    {
        var touchmovejoints = this.m_config_archs_info.touchmovejoints;

        for(var ff=0;ff<touchmovejoints.length;ff++)
        {
            var ff_info  = touchmovejoints[ff];
            if(ff_info.type == typeid)
            {
                return ff_info;
            }
        }

        return null;
    }
    //获得配置在archs.json文件里面的障碍物点信息obstacles节点下
    Find_Obstacle_Detail_Info_By_TypeID(typeid:number)
    {
        var obstacles = this.m_config_archs_info.obstacles;

        for(var ff=0;ff<obstacles.length;ff++)
        {
            var ff_info  = obstacles[ff];
            if(ff_info.type == typeid)
            {
                return ff_info;
            }
        }

        return null;
    }
    //获得配置在archs.json文件里面的能杀死小人的物体信息killobjs节点下
    Find_Kill_OBJ_Com_Define_Info(typeid:number)
    {
        var killobjs = this.m_config_archs_info.killobjs;

        for(var ff=0;ff<killobjs.length;ff++)
        {
            var ff_info  = killobjs[ff];
            if(ff_info.type == typeid)
            {
                return ff_info;
            }
        }

        return null;
    }


    //金币相关
    m_Gold_Coin: number = 0;
    //保存金币信息
    SaveCoinInfo(): void {
        MyLocalStorge.setItem("m_Gold_Coin", this.m_Gold_Coin);
    }
    //读取金币信息
    InitLoadCoinInfo(): void {
        var coin = MyLocalStorge.getItem("m_Gold_Coin", "");
        if (!coin) {
            coin = 0;
        }

        this.m_Gold_Coin = Number(coin);
    }
    //获取金币信息
    Get_Gold_Coin(): number {
        return this.m_Gold_Coin;
    }

    skinsData = [
        {
            "id":1,
            "type": 1,     //1关卡解锁   2金币解锁   3广告解锁
            "progress": 100,  //当前解锁进度
            "price":0,  //价格
        },
        {
            "id": 2,
            "type": 1,    
            "progress": 0,  
            "price": 0,  
        },
        {
            "id": 3,
            "type": 3,    
            "progress": 0, 
            "price": 0,  
        },
        {
            "id": 4,
            "type": 1,  
            "progress": 0,  
            "price": 5000,  
        },
        {
            "id": 5,
            "type": 1,     
            "progress": 0, 
            "price": 5000, 
        },
        {
            "id": 6,
            "type": 1,  
            "progress": 0, 
            "price": 5000,
        },
    ];
          
}
