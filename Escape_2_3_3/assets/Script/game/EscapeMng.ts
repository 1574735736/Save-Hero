import MyLocalStorge from "../utils/MyLocalStorge";
import WMap from "../utils/WMap"; 
import List from "../surface/List";
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


    m_config_archs_info = null;

    //当前皮肤的解锁进度
    m_Skin_Progress: number = 0;
    //每次默认解锁进度
    m_Skin_AddProgress: number = 0.2; 

    //默认每次过关获得的分数
    m_Default_Coin: number = 100;

    //每款皮肤基础价格
    m_DefaultBuy_Coin: number = 5000;

    //当前皮肤种类数量
    m_Skins_Count: number = 10;

    //已经拥有的皮肤
    m_Has_Skins = [];//new List<SkineDataInfo>();

    m_Has_SkinIDs = [];
    m_Has_SkinStatus = [];
    

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

        this.m_last_enter_level = 20;//Number(iprevlevel); 

        let unlockLevel = MyLocalStorge.getItem("espace_unlock_level","");
        if (!unlockLevel) {
            unlockLevel = 1;
        }
        this.m_unlock_level = Number(unlockLevel);

    }
    //保存信息
    SaveLevelInfo():void
    {
        MyLocalStorge.setItem("espace_save_level", this.m_last_enter_level);  
    }
    //保存最大解锁关卡记录
    SavaUnlocklevelInfo(): void {
        MyLocalStorge.setItem("espace_unlock_level", this.m_unlock_level);  
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

    InitAllInfos() {
        this.InitLoadCoinInfo();
        this.InitLoadHeroInfo();
        this.InitLoadProgressInfo();
        this.InitLoadHasSkins();
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
    //设置当前金币信息
    Set_Gold_Coin(count: number) {
        this.m_Gold_Coin = count;
        this.SaveCoinInfo();
    }


    //当前选择的英雄
    m_Cur_Hero: number = 0;
    //保存角色信息
    SaveHeroInfo(): void {
        MyLocalStorge.setItem("save_Hero", this.m_Cur_Hero);
    }
    //读取角色信息
    InitLoadHeroInfo(): void {
        var hero = MyLocalStorge.getItem("save_Hero", "");
        if (!hero) {
            hero = 1;
        }       
        this.m_Cur_Hero = Number(hero);
    }
    //设置当前角色
    Set_Hero(count: number) {
        this.m_Cur_Hero = count;
        this.SaveHeroInfo();
    }
    //获取当前角色
    Get_Hero(): number {      
        return this.m_Cur_Hero;        
    }


    //获取下一个未解锁的皮肤，要是没有就返回最后一个
    Get_NoHasHero(): number{
        //if (this.m_Has_Skins[this.m_Has_Skins.length - 1].id == this.m_Skins_Count) {
        //    return this.m_Skins_Count
        //}
        //return this.m_Has_Skins[this.m_Has_Skins.length - 1].id + 1;
        for (var i = 1; i <= this.m_Skins_Count; i++) {
            if (this.Get_SkinStatusHas(i) == false) {
                return i;
            }
        }
        return this.m_Skins_Count;
    }
    //获取当前解锁进度
    Get_SkinProgress(): number {
        return this.m_Skin_Progress;
    }
    //设置当前解锁进度
    Set_SkinProgress(count: number = 0) {
        if (count == 0) {
            this.m_Skin_Progress = this.m_Skin_Progress + this.m_Skin_AddProgress;
        }
        else {
            this.m_Skin_Progress = count;
        }

        if (this.m_Skin_Progress >= 1) {    //皮肤全部解锁，就是1，没全部，就重新从0循环
            var curSkine = this.Get_NoHasHero();
            if (curSkine < this.m_Skins_Count) {
                this.m_Skin_Progress = 0;
                this.Set_HasSkins(curSkine, 1);
            }
            else {
                if (this.m_Has_Skins.length < this.m_Skins_Count) {
                    this.Set_HasSkins(curSkine, 1);
                }
                this.m_Skin_Progress = 1;
            }
        }

        MyLocalStorge.setItem("SkinProgress", this.m_Skin_Progress + "");
    }
    //初始化当前解锁进度
    InitLoadProgressInfo(): void {
        var pro = MyLocalStorge.getItem("SkinProgress", "");
        if (!pro) {
            pro = 0;
        }
        this.m_Skin_Progress = Number(pro);
    }

    //读取已经拥有的皮肤，已经拥有的类型  0完全拥有，1需要看广告
    InitLoadHasSkins(): void{
        var user = JSON.parse(cc.sys.localStorage.getItem('hasskins'));
        //this.m_Has_Skins.clear();
        if (user) {
            this.m_Has_Skins = user;
        }
        else {
            if (Number(this.m_Has_Skins.length) == 0) {
                this.Set_HasSkins(1, 0);
            }
        }  
    }
    // "0" 完全拥有 "1"广告拥有 
    //存储皮肤数据
    Set_HasSkins(id, type) {
        var has: Boolean = false;
        for (var i = 0; i < this.m_Has_Skins.length; i++) {
            if (id == this.m_Has_Skins[i].id) {
                this.m_Has_Skins[i].type = type;
                has = true;
            }
        }
        if (has == false) {
            var addSkine = new SkineDataInfo();
            addSkine.id = id;
            addSkine.type = type;
            this.m_Has_Skins.push(addSkine);
        }
       
        cc.sys.localStorage.setItem('hasskins', JSON.stringify(this.m_Has_Skins));
    

    }
    //获取皮肤对应的存储状态
    Get_SkinStatusType(id: number): number {
        for (var i = 0; i < this.m_Has_Skins.length; i++) {
            if (id == this.m_Has_Skins[i].id) {
                return this.m_Has_Skins[i].type;
            }
        }
        return 1;
    }
    //判断有没有对应的皮肤
    Get_SkinStatusHas(id: number): boolean {
        for (var i = 0; i < this.m_Has_Skins.length; i++) {
            if (id == this.m_Has_Skins[i].id) {
                return true;
            }
        }
        return false;
    }

    //获取皮肤的数量
    Get_ShinStatusCount(): number {
        return this.m_Has_Skins.length;
    }

}

export class SkineDataInfo {
    public id: number = 0;
    public type: number = 0;    
}