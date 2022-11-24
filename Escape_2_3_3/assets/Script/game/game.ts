import MyButton from "../utils/MyButton";
import MySprite from "../utils/MySprite";
import EscapeMng from "./EscapeMng";
import ObstcleGraphic from "./ObstcleGraphic";
import RopeGraphic from "./RopeGraphic";
import WSize from "../utils/WSize";
import EscapePeople from "./EscapePeople";
import InterceptUtils from "../utils/InterceptUtils";
import MyCicle from "../utils/MyCicle";

import KillObj from "./KillObj";
import WMap from "../utils/WMap";
import Bullet from "./Bullet";
import Utils from "../utils/Utils";


import ObstacleOBJ from "./ObstacleOBJ";
import EscapeCacu from "../utils/EscapeCacu";
import BackGroundSoundUtils from "../utils/BackGroundSoundUtils";

import {FirebaseReport, FirebaseKey} from "../utils/FirebaseReport";
import vpnConnect from "../dlg/vpnConnect";


const {ccclass, property} = cc._decorator;

@ccclass
export default class game extends cc.Component 
{
    //@property(cc.Prefab)
    //people_type_1: cc.Prefab = null;

    //@property(cc.Prefab)
    //people_type_2: cc.Prefab = null;

    //@property(cc.Prefab)
    //people_type_3: cc.Prefab = null;

    //@property(cc.Prefab)
    //people_type_4: cc.Prefab = null;

    @property(cc.Node)
    tip_cantShowAd: cc.Node = null;

    @property(cc.Prefab)
    peoplePre: cc.Prefab = null;

    curPeople_p = null;


    private static _instance: game = null;
    //展示vpn界面的概率
    public static showVpnProportion = 30;//


    //当前进入关卡
    m_enter_level:number = 0;
    //当前进入关卡配置
    m_enter_level_config=  null;

    //是否开始拖动绳子
    m_b_start_drag:boolean = false;
    //绳子是否已经连接到终点
    m_b_rope_jointed:boolean = false;

    //鼠标移动位置
    m_last_move_pt = null;


    //游戏是否已经初始化
    m_b_game_inited = 0;
    //开始建筑连接点位置
    m_start_joint_pt:cc.Vec2 = null;
    //结束建筑的连接点位置
    m_end_joint_pt:cc.Vec2 = null;

    //移动的圈圈调整位置
    m_last_moveing_joint_pt:cc.Vec2 = new cc.Vec2(0,0); 

    //保存鼠标移动开始和有效位置信息
    m_last_touchu_start_pt:cc.Vec2 = new cc.Vec2(0,0); 
    m_last_touchu_valid_pt:cc.Vec2 = new cc.Vec2(0,0); 

    //移动绳子圈最后的坐标信息
    m_last_end_joint_pt = null;

    //背景
    m_bj:cc.Node = null;

    //绳子绘制节点和grapgic
    m_rope_graphic_node:cc.Node = null;
    m_rope_graphic_com:RopeGraphic = null;

    //障碍物绘制graphic
    m_obstacle_graphic_com:ObstcleGraphic = null;

    //移动的时候跟随的连接圈
    m_move_joint_node:cc.Node =  null;

    //所有障碍物信息
   // m_all_obstacle_info_list =[];

   //所有的障碍物信息
    m_all_obstacle_obj_list =[];

    //死亡的人数
    m_total_killed_people_count:number= 0;
    //初始化人数
    m_init_all_people_count :number= 0;

    //总共营救了的人数
    m_total_rescured_people_count:number=  0;

    //总共需要营救的人数
    m_total_need_rescur_people_count:number=  0;

    //在开始点的地方小人数目
    m_start_arch_people_count:number = 0;

    //在各个障碍物的点上的小人，每个单独一个定义
    //[obstcleinfo,point,itype,peopleh]
    m_all_obstcle_point_people_list = [];

    //所有在开始建筑正在等待解救的小人
    m_all_start_arch_waitfor_resure_people_list = [];

    //在开始建筑以外的外面的小人
    m_all_outer_waitfor_resure_people_list = [];


    //正在解救人的列表，正在绳子上移动到终点去的人列表
    m_rescureing_people_list = [];
    //开始建筑最后一次添加到绳子去营救的开始分组
    m_last_add_arch_start_people_resruing_type = 0;
    
    //营救成功，和失败的人的列表
    m_succesed_people_list = [];
    m_failed_people_list = [];



    //所有会杀死人的物体列表
    m_all_kill_obj_list = [];

    //子弹列表
    m_all_bullet_obj_list = [];


    //是否在营救中
    m_b_in_rescureing = false;
    //最后一次营救的时间
    m_last_rescure_tick = 0;

    //游戏成功和游戏结束标记
    m_b_game_finished = 0;
    m_b_game_successed = 0;


    //killobj绘制的graphic
    m_kill_obj_grapgic :cc.Graphics= null;


 
  
    //开始建筑每个分组最大显示不同位置人数目
    m_people_union_show_count = 5;

    //分成几个组来显示人
    m_split_people_arr_count = 6;
    

    //开始，结束建筑，人数信息节点
    m_arch_start_tip_user_node = null;
    m_arch_end_tip_user_node = null;

    //是否可以点击跳过关卡按钮
    bCanClickSkip = true;
    //是否是通过跳过按钮通关游戏的
    bWinBySkip = false;
    //安卓端第一关进入时间点
    timeOfFirstLevel = 0;

    //营救的间隔时间
    timeInterval: number = 100;


    public static getInstance(): game {
        if (game._instance == null) {
            game._instance = new game();
        }
        return game._instance;
    }

    public static JavaCall_UpdateConfigValue(value: number) {
        game.showVpnProportion = value;
    }

    onLoad () 
    {
        game._instance = this;

        this.node.opacity = 0;
        var pseq = cc.sequence(cc.fadeTo(0.3, 255), cc.callFunc(() => {
        }));
        this.node.runAction(pseq);

        //获取全局单实例中存储的关卡和该关卡的配置信息，保存起来
        this.m_enter_level = EscapeMng.GetInstance().m_enter_level;
        this.m_enter_level_config = EscapeMng.GetInstance().m_enter_level_config;
        //this.InitPeoples();
        
        if (cc.sys.platform === cc.sys.ANDROID) {
            //上报firebase
            //switch(this.m_enter_level) {
            //    case 1:
            //        this.timeOfFirstLevel = (new Date()).getTime();
            //        FirebaseReport.reportInformation(FirebaseKey.game_open_level1);
            //        break;
            //    case 2:
            //        FirebaseReport.reportInformation(FirebaseKey.game_open_level2);
            //        break;
            //    case 3:
            //        FirebaseReport.reportInformation(FirebaseKey.game_open_level3);
            //        break;
            //    default:
            //        break;
            //}
            //展示banner广告
            jsb.reflection.callStaticMethod("org/cocos2dx/javascript/BannerAdManager", "JsCall_showAdIfAvailable", "()V");
            //vpn弹窗
            // let rand = Math.random() * 100;
            // let configPro = game.showVpnProportion;

            // if (rand <= configPro) {
            //     if (!vpnConnect.bConnected) {
            //         var self = this;
            //         cc.loader.loadRes("prefab/vpnView",cc.Prefab, (e, p) => {
            //             let pnode:cc.Node =  cc.instantiate(p as cc.Prefab);
            //             self.node.addChild(pnode,100);
            //         });
            //     }
            // }
        }


        console.log("game.onLoad()");
        

        EscapeMng.GetInstance().m_last_enter_level = this.m_enter_level;




        //获得开始建筑的配置信息
        var archstart_config_info = this.m_enter_level_config.archstart;

        //开始建筑坐标，配置文件里面配置
        var arch_start_pos = archstart_config_info.arch_pos;
        var archstart_info = EscapeMng.GetInstance().Find_Detail_Arch_Info_By_TypeID(archstart_config_info.typeid);
         

        //创建起始的建筑
        var psrite_arch_start = new MySprite(archstart_info.arch_pic,archstart_info.arch_size[0],archstart_info.arch_size[1]);
        psrite_arch_start.setPosition(arch_start_pos[0],arch_start_pos[1]); 
        this.node.addChild(psrite_arch_start,10);


        //创建起始建筑的连接点
        var btn_arch_start_joint = new MySprite(archstart_info.joint_pic,archstart_info.joint_size[0],archstart_info.joint_size[1]);
        btn_arch_start_joint.setPosition(archstart_info.joint_relative_pos[0] + arch_start_pos[0] ,archstart_info.joint_relative_pos[1] + arch_start_pos[1]); 
        this.node.addChild(btn_arch_start_joint,22);

        this.m_start_joint_pt = new cc.Vec2(archstart_info.joint_relative_pos[0] + arch_start_pos[0],archstart_info.joint_relative_pos[1] + arch_start_pos[1]);
        this.m_last_moveing_joint_pt = this.m_start_joint_pt;


        // /初始化两个有效圈和拖动点都为起始连接点位置
        this.m_last_end_joint_pt = this.m_start_joint_pt;
        this.m_last_touchu_valid_pt = this.m_start_joint_pt;

        var archend_config_info = this.m_enter_level_config.archend;
        var arch_end_pos = archend_config_info.arch_pos;
 
        var archend_info =  EscapeMng.GetInstance().Find_Detail_Arch_Info_By_TypeID(archend_config_info.typeid);
         
     
        //创建到达的建筑
        var psrite_arch_end = new MySprite(archend_info.arch_pic,archend_info.arch_size[0],archend_info.arch_size[1]);
        psrite_arch_end.setPosition(arch_end_pos[0],arch_end_pos[1]); 
        this.node.addChild(psrite_arch_end,10);

        this.m_end_joint_pt = new cc.Vec2(archend_info.joint_relative_pos[0] + arch_end_pos[0],archend_info.joint_relative_pos[1] + arch_end_pos[1] );



        //创建到达建筑的链接点
        var btn_arch_end_joint = new MySprite(archend_info.joint_pic,archend_info.joint_size[0],archend_info.joint_size[1]);
        btn_arch_end_joint.setPosition(archend_info.joint_relative_pos[0] + arch_end_pos[0],archend_info.joint_relative_pos[1] + arch_end_pos[1]); 
        this.node.addChild(btn_arch_end_joint,22);



        var btn_addbianji = cc.find("addbianji",this.node);
        btn_addbianji.on("click",this.OnBtnAddBJ.bind(this));
        

        this.m_rope_graphic_node = cc.find("rope_graphic",this.node);
        this.m_rope_graphic_com = this.m_rope_graphic_node.getComponent("RopeGraphic");
        this.m_rope_graphic_node.zIndex = 15;


        //移动的圈圈信息
        var touchmovejoint = this.Get_Touch_Move_Joint_Info();

        //设置移动圈圈的音效半径
        var joint_radius = touchmovejoint.joint_radius;
        this.m_rope_graphic_com.SetJointRadius(joint_radius);
 
        var obstcle_graphic = cc.find("obstcle_graphic",this.node);
        this.m_obstacle_graphic_com = obstcle_graphic.getComponent("ObstcleGraphic");
        obstcle_graphic.zIndex = 14;


         
        //移动的时候跟随的圈
        this.m_move_joint_node=   new MySprite(touchmovejoint.joint_pic,touchmovejoint.joint_size[0],touchmovejoint.joint_size[1]);
        this.node.addChild(this.m_move_joint_node,25);
        this.m_move_joint_node.active = false;



        var backhome = cc.find("backhome",this.node);
        backhome.on("click", this.OnReturnHome.bind(this));

        var btnSkin = cc.find("btn_skin", this.node);
        btnSkin.on("click", this.OnBtnSkin.bind(this));
        
        var btn_skip_level = cc.find("btn_skip_level",this.node);
        btn_skip_level.on("click",this.OnBtnSkipLevel.bind(this));
      
        
        var kill_grap_node=  cc.find("killobj/grap",this.node);
        var kill_graphic:cc.Graphics = kill_grap_node.getComponent(cc.Graphics);

        this.m_kill_obj_grapgic =kill_graphic;
       
        //this.scheduleOnce(this.FD_Init_All_Obstacle.bind(this), 0.1);


     

        this.m_bj = cc.find("bj",this.node); 
        this.m_bj.on(cc.Node.EventType.TOUCH_START, this.onTouchStart, this);
        this.m_bj.on(cc.Node.EventType.TOUCH_MOVE, this.onTouchMove, this);
        this.m_bj.on(cc.Node.EventType.TOUCH_END, this.onTouchEnd, this);
        this.m_bj.on(cc.Node.EventType.TOUCH_CANCEL, this.onTouchCancel, this);


        var level_t =  cc.find("levelinfo/t",this.node);
        level_t.getComponent(cc.Label).string = "Level "+this.m_enter_level;
        if(this.m_enter_level == 0)
        {
            level_t.getComponent(cc.Label).string = "配置显示";
        }
       

        //每12关切换一个背景图片显示
        var bj_name=  "game/bj/1";

        var i_picindex= Math.floor((this.m_enter_level-1)/12) + 1;
        if(i_picindex >= 5)
        {
            i_picindex=  5;
        }
        bj_name=  "game/bj/"+i_picindex;


        var bj_node =  cc.find("bj",this.node);
        bj_node.active = false;
      
        Utils.ShowNodePic(bj_node,bj_name,{cx:1080,cy:2340},()=>
        {
            bj_node.active = true;

        })
     
      
        //结束圈的信息
        var endquan =  cc.find("endquan",this.node);
        endquan.setPosition(this.m_end_joint_pt);
        endquan.runAction(cc.repeatForever(cc.rotateBy(0.1, 10)));
      
        if(this.m_enter_level == 1)
        {
            this.Add_Level_Start_Tip();
        }

        this.FD_Init_All_Obstacle();
        this.scheduleOnce(this.FD_SetBJ_Visible.bind(this),2);
 
    }
    //设置背景显示
    FD_SetBJ_Visible()
    {
        var bj_node =  cc.find("bj",this.node);
        bj_node.active = true;

    }
 
    //拖动到结束点以后的指引
    Add_Touch_Valid_Pos_Action_Tip()
    {
        //if(this.m_arch_start_tip_user_node)
        //{
        //    this.m_arch_start_tip_user_node.active =false;
        //}
        //if(this.m_arch_end_tip_user_node)
        //{
        //    this.m_arch_end_tip_user_node.active =false;
        //}

        //var pnode = new MySprite("game/qipao/t");
        //this.node.addChild(pnode,5);
        //pnode.setPosition(0,-500);
        var row = cc.find("guide/guide_row", this.node);
        row.active = false;
        var dianji = cc.find("guide/guide_dianji", this.node);
        dianji.active = false;
        var light = cc.find("guide/img_light", this.node);
        light.active = false;
        var jiantou = cc.find("guide/guide_jiantou", this.node);
        jiantou.active = false;
        var content = cc.find("guide/Connect", this.node);
        content.active = false;
        var touch = cc.find("guide/Touch", this.node);
        touch.active = true;
        var jiantou2 = cc.find("guide/guide_jiantou2", this.node);
        jiantou2.active = false;
        var dianji2 = cc.find("guide/guide_dianji2", this.node);
        dianji2.active = true;

        
    }
    //添加游戏结束tip
    Add_Level_End_Tip()
    {
        //if(this.m_arch_end_tip_user_node)
        //{
        //    return;
        //}

        //this.m_arch_end_tip_user_node = new MySprite("game/qipao/3");
        //this.node.addChild(this.m_arch_end_tip_user_node,5);
        //this.m_arch_end_tip_user_node.setPosition(this.m_end_joint_pt.x - 160,this.m_end_joint_pt.y + 40);

     
      
        var end_pos = this.m_enter_level_config.archend.arch_pos;
        var archEnd_info = this.Get_Arch_End_Info();//EscapeMng.GetInstance().Find_Detail_Arch_Info_By_TypeID(this.m_enter_level_config.archend.typeid);
        var endX = end_pos[0] + archEnd_info.joint_relative_pos[0];
        var endY = end_pos[1] + archEnd_info.joint_relative_pos[1];
      

        var row = cc.find("guide/guide_row", this.node);
        //row.active = false;
        row.setPosition(endX, endY - 50);
        //var dianji = cc.find("guide/guide_dianji", this.node);
        //dianji.active = false;
        //dianji.setPosition(endX + 100, endY - 100);
        //var light = cc.find("guide/img_light", this.node);
        //light.active = false;

    }
    //添加游戏开始建筑旁边的，救救我们，按下开始等提示
    Add_Level_Start_Tip()
    {
        //var  archstart_config_info = this.m_enter_level_config.archstart;
      
        //var arch_pos =  archstart_config_info.arch_pos;

        //this.m_arch_start_tip_user_node = new cc.Node();
        //this.node.addChild(this.m_arch_start_tip_user_node,5);
   
        ////救救我们提示
        //var ps = new MySprite("game/qipao/1");
        //this.node.addChild(ps,35);
        //ps.setPosition(arch_pos[0] - 50,arch_pos[1] + 200);

        ////按下提示
        //var touchstarttip = new MySprite("game/qipao/2");
        //this.m_arch_start_tip_user_node.addChild(touchstarttip,5);
        //touchstarttip.setPosition(this.m_start_joint_pt.x+180,this.m_start_joint_pt.y + 80);
        //touchstarttip.active = false;

        //var pseq = cc.sequence(cc.delayTime(2),cc.callFunc(()=>
        //{
        //    touchstarttip.active = true;
        //    ps.destroy();
        //}));

        //this.node.runAction(pseq);

        //var config_info = this.m_enter_level_config.archend.arch_pos;

        //var dianji = cc.find("guide_dianji", this.node);
        //var jiantou = cc.find("guide_jiantou", this.node);
        //var row = cc.find("guide_row", this.node);
        //dianji.active = true;
        //jiantou.active = true;
        //row.active = true;
        //dianji.setPosition(config_info[0], config_info[1]);
        //row.setPosition(config_info[0], config_info[1]);
        //jiantou.setPosition(config_info[0], config_info[1] );

        var guide = cc.find("guide", this.node);
        guide.active = true;
        guide.zIndex = 50;

        //var light = cc.find("guide/img_light", this.node);
        //light.active = true;
        //var actionScale = cc.sequence(cc.scaleTo(2, 0.85, 1), cc.callFunc(() => {
        //    light.setScale(0, 1);
        //}));
        //light.runAction(cc.repeatForever(actionScale));
      
        var start_pos = this.m_enter_level_config.archstart.arch_pos;        
        var archStart_info = this.Get_Arch_Start_Info();//EscapeMng.GetInstance().Find_Detail_Arch_Info_By_TypeID(this.m_enter_level_config.archstart.typeid);
        var startX = start_pos[0] + archStart_info.joint_relative_pos[0];
        var startY = start_pos[1] + archStart_info.joint_relative_pos[1];

        var end_pos = this.m_enter_level_config.archend.arch_pos;
        var archEnd_info = this.Get_Arch_End_Info();
        var endX = end_pos[0] + archEnd_info.joint_relative_pos[0];
        var endY = end_pos[1] + archEnd_info.joint_relative_pos[1];

        var row = cc.find("guide/guide_row", this.node);
        row.active = true;        
        row.setPosition(startX, startY - 50);
        var dianji = cc.find("guide/guide_dianji", this.node);
        dianji.active = true;
        dianji.setPosition(startX + 30, startY - 100);
        var anim = dianji.getComponent(sp.Skeleton);
        anim.setToSetupPose();
        anim.setAnimation(0, "dianji", false);
       
        
        var func = cc.sequence(cc.delayTime(1), cc.moveTo(1.5, endX + 30, endY - 100), cc.delayTime(0.5), cc.callFunc(() => {            
            dianji.setPosition(startX + 30, startY - 100);           
            anim.setToSetupPose();
            anim.setAnimation(0, "dianji", false);
        }));
        dianji.runAction(cc.repeatForever(func));

        var jiantou = cc.find("guide/guide_jiantou", this.node);
        jiantou.active = true;
        jiantou.setPosition(endX - 100, endY - 150);
        var content = cc.find("guide/Connect", this.node);
        content.active = true;

        var jiantou2 = cc.find("guide/guide_jiantou2", this.node);
        jiantou2.active = true;
        jiantou2.setPosition(startX + 150, startY + 50);
    }

    //获得移动绳子圈的配置信息。主要是有效半径,也就是按下点在圈中心点多少半径内有效
    Get_Touch_Move_Joint_Info()
    {
        var  touchmovejoint = this.m_enter_level_config.touchmovejoint;
        var typeid = touchmovejoint.typeid;
        var jointinfo =  EscapeMng.GetInstance().Find_Detail_TouchMoveJoint_By_TypeID(typeid);
        return jointinfo;
    }

    //开始建筑信息
    Get_Arch_Start_Info()
    {
        var  archstart_config_info = this.m_enter_level_config.archstart;
      
        var archstart_info =  EscapeMng.GetInstance().Find_Detail_Arch_Info_By_TypeID(archstart_config_info.typeid);
      
        return archstart_info;
    }
    //结束建筑信息
    Get_Arch_End_Info()
    {

        var archend_config_info = this.m_enter_level_config.archend;
      
        var archend_info =  EscapeMng.GetInstance().Find_Detail_Arch_Info_By_TypeID(archend_config_info.typeid);
      
        return archend_info;
    }
    //编辑配置，正式上线不用
    OnBtnAddBJ()
    {
        var self = this;
        cc.loader.loadRes("prefab/addbianji",cc.Prefab,(ee,p)=>
        {
            var pnode:cc.Node =  cc.instantiate(p as cc.Prefab);
            self.node.addChild(pnode,80);
         
        });
        
    }

    OnReturnHome() {
        //if (cc.sys.platform === cc.sys.ANDROID) {
        //    jsb.reflection.callStaticMethod("org/cocos2dx/javascript/InterstitialAdManager", "JsCall_showAdIfAvailable", "(Ljava/lang/String;)V", "cc['gameRun'].JavaCallReturnHome()");
        //}
        //else {
            this.OnBtnExitHome();
        //}
    }

    public static JavaCallReturnHome() {
        game.getInstance().OnBtnExitHome();
    }

    //返回首页
    OnBtnExitHome()
    {
        if (cc.sys.platform === cc.sys.ANDROID) { //&& this.m_enter_level == 1) {
            //let playTime = (new Date).getTime() - this.timeOfFirstLevel;
            //FirebaseReport.reportInformationWithParam(FirebaseKey.game_Level1_time, FirebaseKey.paramDurationKey, playTime);
            FirebaseReport.reportInformation(FirebaseKey.zhandou_shouye);
        }

        var func = (function () {
            cc.director.loadScene("start");
            BackGroundSoundUtils.GetInstance().PlayEffect("dianji"); });
        this.OuGameAni(func);

        //cc.director.loadScene("start");
        //BackGroundSoundUtils.GetInstance().PlayEffect("dianji");
    }

    //跳过关卡
    OnBtnSkipLevel()
    {
        if(this.m_b_game_finished)
        {
            return;
        }
        if (this.bCanClickSkip) {
            this.bCanClickSkip = false;
            this.scheduleOnce(() => {
                this.bCanClickSkip = true;
            }, 0.5);//限制0.5秒点一次
            if (cc.sys.platform === cc.sys.ANDROID) {                
                FirebaseReport.reportInformation(FirebaseKey.zhandou_ad2_skip);//click_skip);
                let bAdLoaded = jsb.reflection.callStaticMethod("org/cocos2dx/javascript/RewardedAdManager", "JsCall_hadLoadedAd", "()Z");
                if (bAdLoaded) {
                    this.bWinBySkip = true;
                    jsb.reflection.callStaticMethod("org/cocos2dx/javascript/RewardedAdManager", "JsCall_showAdIfAvailable", "(Ljava/lang/String;)V",'cc["gameRun"].JavaCall_SkipLevel()');
                }
                else {
                    this.tip_cantShowAd.active = true;
                    this.scheduleOnce(() => {
                        this.tip_cantShowAd.active = false;
                    }, 0.5);
                }
            }
            else {
                this.SkipLevel();
            }
        }
    }

    public static JavaCall_SkipLevel() {
        EscapeMng.GetInstance().SetIntAdStatus();
        game.getInstance().SkipLevel();
    }

    SkipLevel() {
        this.scheduleOnce(this.FD_Success.bind(this),0.1);
        BackGroundSoundUtils.GetInstance().PlayEffect("dianji");
    }
    //初始化生成所有的killobj
    Init_All_Kill_Objs()
    {

        var kill_sp_node=  cc.find("killobj/sp",this.node);
        var kill_grap_node=  cc.find("killobj/grap",this.node);
        var kill_graphic:cc.Graphics = kill_grap_node.getComponent(cc.Graphics);

         
        var killobjs = this.m_enter_level_config.killobjs.objlist;
        if(!killobjs)
        {
            killobjs = [];
        }

        for(var ff=0;ff<killobjs.length;ff++)
        {
            var ff_obj_src_info = killobjs[ff];

            var ff_id = ff_obj_src_info.typeid;
            var initpos = ff_obj_src_info.initpos;
            var initrotation = ff_obj_src_info.initrotation;
            if(!initrotation)
            {
                initrotation = 0;
            }

            //获得在archs,json里面的配置信息
            var ff_kill_info = EscapeMng.GetInstance().Find_Kill_OBJ_Com_Define_Info(ff_id);


            var bgraphic = ff_kill_info.bgraphic;
            var obj_pic = ff_kill_info.obj_pic;
            var anchropt = ff_kill_info.anchropt;
            var obj_pic_size = ff_kill_info.obj_pic_size;

           


            if(bgraphic)
            {
                continue;
            }

            var ps:MySprite = new MySprite(""+obj_pic,obj_pic_size[0],obj_pic_size[1]);
            ps.setPosition(initpos[0],initpos[1]);
            ps.angle =  initrotation;

            kill_sp_node.addChild(ps,10);

            var new_killobj = new KillObj(this,ff+1);
            new_killobj.Init(bgraphic,ps,ff_obj_src_info,ff_kill_info,kill_graphic);

           

            this.m_all_kill_obj_list.push(new_killobj);
        }
   
    }

    //获得所有能挡住子弹和射线的形状
    Get_All_Prevent_FireLine_Shape_Info_List()
    {
        var all_shape_info_list=  [];

        
        for(var ff=0;ff<this.m_all_obstacle_obj_list.length;ff++)
        {
            var ff_obj:ObstacleOBJ  = this.m_all_obstacle_obj_list[ff];
            var ff_type = ff_obj.m_itype;
            var ff_pt = ff_obj.m_left_center_pt;
            var ff_size = ff_obj.m_valid_size;
            var ff_radius= ff_obj.m_valid_radius;


            if(ff_type == 1)
            {
                all_shape_info_list.push([ff_type,ff_pt,ff_size,ff_obj]);
            } 
            else if(ff_type == 2)
            {
                all_shape_info_list.push([ff_type,ff_pt,ff_radius,ff_obj]);
            }
         
            
        }

  
        for(var ff=0;ff<this.m_all_kill_obj_list.length;ff++)
        {
            var killobj:KillObj = this.m_all_kill_obj_list[ff];

            if(!killobj.IS_Shape_OBJ())
            {
                continue;

            }
   
            var shapeinfo = killobj.Get_Shape_Info();
            all_shape_info_list.push(shapeinfo);

      
        }


        return all_shape_info_list;
    }

    //获得所有遮挡子弹或者射线的普通shape形状信息
    Get_All_Obstacle_Shape_InfoList() 
    {
        var all_shape_info_list=  [];

        
        for(var ff=0;ff<this.m_all_obstacle_obj_list.length;ff++)
        {
            var ff_obj:ObstacleOBJ  = this.m_all_obstacle_obj_list[ff];
            var ff_type = ff_obj.m_itype;
            var ff_pt = ff_obj.m_left_center_pt;
            var ff_size = ff_obj.m_valid_size;
            var ff_radius= ff_obj.m_valid_radius;


            if(ff_type == 1)
            {
                all_shape_info_list.push([ff_type,ff_pt,ff_size,ff_obj]);
            } 
            else if(ff_type == 2)
            {
                all_shape_info_list.push([ff_type,ff_pt,ff_radius,ff_obj]);
            }
         
            
        }


   
      


        return all_shape_info_list;

    }

    //直接返回1，全部都是一个人物类型
    Get_Cur_Level_People_Type():number
    {
        //var iy = Math.floor(this.m_enter_level%4 )+1; 
        ///*
        //if(iy >= 4)
        //{
        //    return 4;
        //}

        //if(iy <= 1)
        //{
        //    return 1;
        //}
        //*/
        //return 1;
        return EscapeMng.GetInstance().Get_Hero();
    }

    //InitPeoples() {
    //    if (this.curPeople_p) {
    //        return;
    //    }
    //    var id = EscapeMng.GetInstance().Get_Hero();
    //    cc.loader.loadRes("prefab/obj" + id, cc.Prefab, (e, p) => {
    //        var pnode = cc.instantiate(p as cc.Prefab);
    //        this.curPeople_p = pnode;
    //        pnode.active = false;
    //    });
    //}

    //生成一个这个关卡的人物
    Instace_Level_People(irand_peope_type:number)
    {
        //if(irand_peope_type == 1)
        //{
        //    return cc.instantiate(this.people_type_1);
        //}
        //else if(irand_peope_type == 2)
        //{
        //    return cc.instantiate(this.people_type_2);
        //}
        //else if(irand_peope_type == 3)
        //{
        //    return cc.instantiate(this.people_type_3);
        //}
        //else if(irand_peope_type == 4)
        //{
        //    return cc.instantiate(this.people_type_4);
        //}

        //if (this.curPeople_p) {
        //    var curP = cc.instantiate(this.curPeople_p);
        //    curP.active = true;
        //    return curP;
        //}

        //var self = this;

        //cc.loader.loadRes("prefab/obj" + irand_peope_type, cc.Prefab, (e, p) => {
        //    var pnode = cc.instantiate(p as cc.Prefab);
        //    this.curPeople_p = pnode;
        //    pnode.active = false;
        //});

        var curP = cc.instantiate(this.peoplePre);
       
        curP.active = true;
        for (var i = 0; i < curP.childrenCount; i++) {            
            curP.children[i].active = false;
        }
        curP.getChildByName("p" + irand_peope_type).active = true;
        return curP;
        //return cc.instantiate(this.peoplePre);
    }

    //将开始建筑的人物动画播放anim的动画
    Change_Start_Arch_Peoples_Anim(animname:string)
    {
        var idx = EscapeMng.GetInstance().Get_Hero();
        for(var ff=0;ff<this.m_all_start_arch_waitfor_resure_people_list.length;ff++)
        {
            var ff_people: EscapePeople = this.m_all_start_arch_waitfor_resure_people_list[ff];
            ff_people.Set_Node_Animate(animname, idx);

            ff_people.SetScale(0.3, idx);
        }

    }


    

    //初始化所有逃生的小人
    Init_All_Peoples()
    {
 

        var iid = 0;

        //获得开始建筑坐标信息，所有逃生的人在开始建筑的坐标范围
        var arch_startinfo = this.Get_Arch_Start_Info();
        var arch_start_peoples = arch_startinfo.arch_start_peoples;
        var ff_info = arch_start_peoples;

        var count = this.m_enter_level_config.peopleinfo.arch_start_people_count;

        var arch_start_pos = this.m_enter_level_config.archstart.arch_pos;

       
        var relative_startx = ff_info.relative_startx;
        var relative_endx = ff_info.relative_endx;
        var relative_y = ff_info.relative_y;

        var realy = arch_start_pos[1] + relative_y  ;
        var startx = arch_start_pos[0] + relative_startx;
        var endx = arch_start_pos[0] + relative_endx;
 


        //将人物分成几组，每组 per_arr_people_count人,相同组的人距离很近，这样方便显示
        var per_arr_people_count = Math.floor(count/this.m_split_people_arr_count);
        if(per_arr_people_count == 0)
        {
            per_arr_people_count = 1;
        }
      
        

        for(var hh=0;hh<count;hh++)
        {
            //分配在第几组
            var igroupindex =  Math.floor(hh/per_arr_people_count) + 1;

            if(igroupindex > this.m_split_people_arr_count)
            {
                igroupindex = this.m_split_people_arr_count;
            }
            //该组x起始坐标
            var igroup_start_x = startx + (endx-startx)*igroupindex/(this.m_split_people_arr_count+1);


            var people_id_list = ff_info.people_id_list;
            iid++;

            var irand_peope_type = this.Get_Cur_Level_People_Type();//people_id_list [Math.floor(people_id_list.length*Math.random())];

            var pnode:cc.Node = this.Instace_Level_People(irand_peope_type);

          

            this.node.addChild(pnode,28);



            

            var peopleinfo = new EscapePeople(irand_peope_type,iid);
            peopleinfo.Init(pnode,ff_info);


            var in_group_index = hh - igroupindex*this.m_split_people_arr_count;
            
            var icc = in_group_index;
            if(icc >= this.m_people_union_show_count)
            {
                icc = this.m_people_union_show_count;
            }
            var ix = igroup_start_x - icc*1;

               
            pnode.setPosition(ix,realy);
            peopleinfo.Set_Start_Arch_Type_Pos_Index(igroupindex);
            

            this.m_all_start_arch_waitfor_resure_people_list.push(peopleinfo);



        }

        //设置开始建筑所有人物动画
        this.Change_Start_Arch_Peoples_Anim("daiji")//("move5");


        //在开始点的地方小人数目
        this.m_start_arch_people_count = iid;



        var outer_people_list = this.m_enter_level_config.peopleinfo.outer_people_list;
        if(!outer_people_list)
        {
            outer_people_list = [];
        }


        //关卡peopleinfo节点下outer_people_list节点配置在外面的小人信息
        for(var hh=0;hh<outer_people_list.length;hh++)
        {
            var hh_info =  outer_people_list[hh];
          //  var hh_peopleid =  hh_info.peopleid;

            var hh_peopleid = this.Get_Cur_Level_People_Type();//people_id_list [Math.floor(people_id_list.length*Math.random())];


            var hh_rotation =  hh_info.rotation;
            if(!hh_rotation)
            {
                hh_rotation = 0;
            }
            var hh_pos =  hh_info.pos;
            iid++;

            var pnode2:cc.Node= null;
            //if(hh_peopleid== 2)
            //{
            //    pnode2 = cc.instantiate(this.people_type_2);
            //}else{
            //    pnode2 = cc.instantiate(this.people_type_1);
            //}
            pnode2 = this.Instace_Level_People(hh_peopleid);
            
            this.node.addChild(pnode2,28);
            pnode2.setPosition(hh_pos[0],hh_pos[1]);
            pnode2.angle = hh_rotation;



            var peopleinfo2 = new EscapePeople(hh_peopleid,iid);
            peopleinfo2.Init(pnode2, ff_info);
            peopleinfo2.SetScale(0.3, EscapeMng.GetInstance().Get_Hero());
 
            this.m_all_outer_waitfor_resure_people_list.push(peopleinfo2);
        }
           
     

        //最低需要解救人数和初始化所有人数，以及已经死亡人数
        this.m_total_need_rescur_people_count = this.m_enter_level_config.peopleinfo.need_resure_min_people_count;
        this.m_init_all_people_count = iid;
 
        this.m_total_killed_people_count = 0;


        var archend_config_info = this.m_enter_level_config.archend;
        var arch_end_pos = archend_config_info.arch_pos;
 
        var archend_info =  EscapeMng.GetInstance().Find_Detail_Arch_Info_By_TypeID(archend_config_info.typeid);
         
     

        //设置开始建筑和结束建筑的人物人数信息节点的坐标
        var people_info_pos = archend_info.people_info_relative_pos;
        var countbj = cc.find("countbj",this.node);
        countbj.setPosition(people_info_pos[0] + arch_end_pos[0],people_info_pos[1] + arch_end_pos[1]);
        countbj.zIndex = 27;
 

        var startcountbj_people_info_pos = arch_startinfo.people_info_relative_pos;
        var startcountbj = cc.find("startcountbj",this.node);
        startcountbj.setPosition(startcountbj_people_info_pos[0] + arch_start_pos[0],startcountbj_people_info_pos[1] + arch_start_pos[1]);
        startcountbj.zIndex = 27;




        //刷新人物数目
        this.Refresh_People_Rescure_Count_Info();
    }

    //刷新人物数目
    Refresh_People_Rescure_Count_Info()
    {
        //结束建筑显示营救人数和总共需要营救人数
        var tlabel = cc.find("countbj/t",this.node);
        tlabel.getComponent(cc.Label).string = ""+this.m_total_rescured_people_count+"/"+this.m_total_need_rescur_people_count;

        //开始建筑显示开始建筑里面剩余人数
        var startcountbj_tlabel = cc.find("startcountbj/t",this.node);
        startcountbj_tlabel.getComponent(cc.Label).string = ""+this.m_all_start_arch_waitfor_resure_people_list.length;


    }
    //生成所有障碍物信息
    FD_Init_All_Obstacle()
    {
        this.Init_All_Peoples();
        this.Init_All_Kill_Objs();

        var objlist = this.m_enter_level_config.obstacle.objlist;
        if(!objlist)
        {
            objlist = [];
        }
        
        var obstcle_graphic_node = cc.find("obstcle_graphic",this.node);
        var obstacle_gragphic = obstcle_graphic_node.getComponent(cc.Graphics);
        obstacle_gragphic.clear(true);
       
        //生成所有的障碍物信息
        for(var ff=0;ff<objlist.length;ff++)
        {
            var ff_src_info = objlist[ff];
            var obj_pos = ff_src_info.obj_pos;
            var ff_typeid = ff_src_info.typeid;


            var ff_info = EscapeMng.GetInstance().Find_Obstacle_Detail_Info_By_TypeID(ff_typeid);

            var obj_pic = ff_info.obj_pic;
            var obj_pic_size = ff_info.obj_pic_size;
          
            var obj_type = ff_info.obj_type;

            var obsid = ff+1;

            //
            if(obj_type ==  1)
            {
                var obj_node = new MySprite(obj_pic,obj_pic_size[0],obj_pic_size[1]);
                obj_node.setPosition(obj_pos[0],obj_pos[1]); 
                this.node.addChild(obj_node,11);



        
                var leftpt = new cc.Vec2(ff_info.obj_valid_relative_left_pt[0] + obj_pos[0],ff_info.obj_valid_relative_left_pt[1] + obj_pos[1]);
                var obj_valid_sizew = new WSize(ff_info.obj_valid_size[0],ff_info.obj_valid_size[1]);
    
               // this.m_obstacle_graphic_com.AddRect(leftpt,obj_valid_sizew);
    
    
                //1：矩形，2：圆形
                //this.m_all_obstacle_info_list.push([1,leftpt,obj_valid_sizew]);



                var obj_info  = new ObstacleOBJ(obsid);
                obj_info.Init(obj_node,obstacle_gragphic,1,leftpt,obj_valid_sizew);

                this.m_all_obstacle_obj_list.push(obj_info);

            }
            else if(obj_type ==  2)
            {
                var obj_node = new MySprite(obj_pic,obj_pic_size[0],obj_pic_size[1]);
                obj_node.setPosition(obj_pos[0],obj_pos[1]); 
                this.node.addChild(obj_node,11);

                var centerpt = new cc.Vec2(ff_info.obj_valid_relative_center_pt[0]+ obj_pos[0],ff_info.obj_valid_relative_center_pt[1]+ obj_pos[1]);
                var radius = ff_info.obj_radius;
              
                //this.m_obstacle_graphic_com.AddCirCle(centerpt,radius);
    
                 //1：矩形，2：圆形
                // this.m_all_obstacle_info_list.push([2,centerpt,radius]);
                 var obj_info  = new ObstacleOBJ(obsid);
                 obj_info.Init(obj_node,obstacle_gragphic,2,centerpt,radius);
 
                 this.m_all_obstacle_obj_list.push(obj_info);
 

            }
         
        }

        this.m_b_game_inited = 1;
    }
    //调整显示移动绳子圈圈
    Adjuest_Show_Move_Joint_Node()
    {

        //圈圈的半径
        var touchmonejoint = this.Get_Touch_Move_Joint_Info();
        var joint_radius = touchmonejoint.joint_radius;
 
        this.m_move_joint_node.active = true;

        //设置圈圈坐标
        var jointpos:cc.Vec2 = this.m_rope_graphic_com.Caculate_Move_Joint_Pt(joint_radius);
        this.m_move_joint_node.setPosition(jointpos);


        this.m_last_moveing_joint_pt = jointpos;

    }

    //判断绳子开始点，结束点，与rc相交点的信息[是否相交，相交点]
    Caculate_Line_Intecept_Rc_Pt(start_rope_pt:cc.Vec2,end_rope_pt:cc.Vec2,rc:cc.Rect)
    {
        var vec1 = new cc.Vec2(end_rope_pt.x- start_rope_pt.x,end_rope_pt.y-  start_rope_pt.y);

        var normalize_vec = vec1.normalize();

        if(end_rope_pt.y > rc.yMax && start_rope_pt.y > rc.yMax)
        {
            return [0];
        }
        if(end_rope_pt.y < rc.yMin && start_rope_pt.y < rc.yMin)
        {
            return [0];
        }

        if(end_rope_pt.x > rc.xMax && start_rope_pt.x > rc.xMax)
        {
            return [0];
        }
        if(end_rope_pt.x < rc.xMin && start_rope_pt.x < rc.xMin)
        {
            return [0];
        }


        //首先，判断一种特殊情况，上次的点在矩形的四个顶点上
        var blast_rope_start_pt_in_rc_index = 0;

        //1-左上，2-右上，3-左下，4：右下
        if(Math.abs(rc.xMin - start_rope_pt.x) <= 4 && Math.abs(rc.yMax - start_rope_pt.y) <= 4)
        {
            blast_rope_start_pt_in_rc_index = 1;
        }
        if(Math.abs(rc.xMax - start_rope_pt.x) <= 4 && Math.abs(rc.yMax - start_rope_pt.y) <= 4)
        {
            blast_rope_start_pt_in_rc_index = 2;
        }
        if(Math.abs(rc.xMin - start_rope_pt.x) <= 4 && Math.abs(rc.yMin - start_rope_pt.y) <= 4)
        {
            blast_rope_start_pt_in_rc_index = 3;
        }

        if(Math.abs(rc.xMax - start_rope_pt.x) <= 4 && Math.abs(rc.yMin - start_rope_pt.y) <= 4)
        {
            blast_rope_start_pt_in_rc_index = 4;
        }








        //开始点位置;
        var startpt_area_index =  InterceptUtils.Get_Pt_In_Rect_Arear(start_rope_pt,rc);
        var endpt_area_index =  InterceptUtils.Get_Pt_In_Rect_Arear(end_rope_pt,rc);

    
        //判断竖着的

        var vect_line_rc_pt1 =  null;
        var vect_line_rc_pt2 =  null;

        var vect_line_rc_pt3 =  null;
        var vect_line_rc_pt4 =  null;



         

            if(start_rope_pt.x  < rc.xMin)
            {
                if(end_rope_pt.x >= rc.xMax)
                {
                    vect_line_rc_pt1 = new cc.Vec2(rc.xMin,rc.yMin);
                    vect_line_rc_pt2 = new cc.Vec2(rc.xMin,rc.yMax);
    
    
                    vect_line_rc_pt3 = new cc.Vec2(rc.xMax,rc.yMin);
                    vect_line_rc_pt4 = new cc.Vec2(rc.xMax,rc.yMax);
    
                }
                else if(end_rope_pt.x >= rc.xMin)
                {
                    vect_line_rc_pt1 = new cc.Vec2(rc.xMin,rc.yMin);
                    vect_line_rc_pt2 = new cc.Vec2(rc.xMin,rc.yMax);
                    
                }
            }
            else if(start_rope_pt.x  > rc.xMax)
            {
                if(end_rope_pt.x <= rc.xMin)
                {
                    vect_line_rc_pt1 = new cc.Vec2(rc.xMax,rc.yMin);
                    vect_line_rc_pt2 = new cc.Vec2(rc.xMax,rc.yMax);
    
    
                     vect_line_rc_pt3 = new cc.Vec2(rc.xMin,rc.yMin);
                    vect_line_rc_pt4 = new cc.Vec2(rc.xMin,rc.yMax);
    
                   
                }
                else if(end_rope_pt.x <= rc.xMax)
                {
                    vect_line_rc_pt1 = new cc.Vec2(rc.xMax,rc.yMin);
                    vect_line_rc_pt2 = new cc.Vec2(rc.xMax,rc.yMax);
                    
                }
            }else{
                if(end_rope_pt.x >= rc.xMax)
                {
                    vect_line_rc_pt1 = new cc.Vec2(rc.xMax,rc.yMin);
                    vect_line_rc_pt2 = new cc.Vec2(rc.xMax,rc.yMax);
                    
                }
                else if(end_rope_pt.x <= rc.xMin)
                {
                    vect_line_rc_pt1 = new cc.Vec2(rc.xMin,rc.yMin);
                    vect_line_rc_pt2 = new cc.Vec2(rc.xMin,rc.yMax);
                    
                }
            }


  
         

        //与竖向的边交点
        var inter_pt1:cc.Vec2 = null;
        var v1_len = 0;
        //判断竖向的与线段的交点
        if(vect_line_rc_pt1 && vect_line_rc_pt2)
        {
            var x1 = vect_line_rc_pt1.x;

            var xdistance = x1 - start_rope_pt.x;
            if(normalize_vec.x != 0)
            {
                var ilen = xdistance/normalize_vec.x;
                v1_len = ilen;
                var inewy = start_rope_pt.y + normalize_vec.y*ilen;

                inter_pt1 = new cc.Vec2(x1,inewy);
            }
        }

        if(inter_pt1)
        {
            var bin_rc_line = true;
            //在边外面
            if(inter_pt1.y > vect_line_rc_pt1.y && inter_pt1.y > vect_line_rc_pt2.y)
            {
                bin_rc_line = false;
            }
            if(inter_pt1.y < vect_line_rc_pt1.y && inter_pt1.y < vect_line_rc_pt2.y)
            {
                bin_rc_line = false;
            }

            //交点不在边上
            if(!bin_rc_line)
            {
                //console.log("!bin_rc_line,inter_pt1="+inter_pt1)
                inter_pt1 = null;
            }
        }


        if(!inter_pt1 && vect_line_rc_pt3 && vect_line_rc_pt4)
        {
            if(vect_line_rc_pt3 && vect_line_rc_pt4)
            {
                var x1 = vect_line_rc_pt3.x;

                var xdistance = x1 - start_rope_pt.x;
                if(normalize_vec.x != 0)
                {
                    var ilen = xdistance/normalize_vec.x;
                    v1_len = ilen;
                    var inewy = start_rope_pt.y + normalize_vec.y*ilen;

                    inter_pt1 = new cc.Vec2(x1,inewy);
                }
            }

            if(inter_pt1)
            {
                var bin_rc_line = true;
                //在边外面
                if(inter_pt1.y > vect_line_rc_pt3.y && inter_pt1.y > vect_line_rc_pt4.y)
                {
                    bin_rc_line = false;
                }
                if(inter_pt1.y < vect_line_rc_pt3.y && inter_pt1.y < vect_line_rc_pt4.y)
                {
                    bin_rc_line = false;
                }

                //交点不在边上
                if(!bin_rc_line)
                {
                  //  console.log("!bin_rc_line2,inter_pt1="+inter_pt1)
                    inter_pt1 = null;
                }
            }
        }






        //接下来，与横向的交点
 
 
          vect_line_rc_pt1 =  null;
          vect_line_rc_pt2 =  null;

          vect_line_rc_pt3 =  null;
          vect_line_rc_pt4 =  null;
  
       
        if(start_rope_pt.y  < rc.yMin)
        {
            if(end_rope_pt.y >= rc.yMax)
            {
                vect_line_rc_pt1 = new cc.Vec2(rc.xMin,rc.yMin);
                vect_line_rc_pt2 = new cc.Vec2(rc.xMax,rc.yMin);

                vect_line_rc_pt3 = new cc.Vec2(rc.xMin,rc.yMax);
                vect_line_rc_pt4 = new cc.Vec2(rc.xMax,rc.yMax);

                
                
            }
            else if(end_rope_pt.y >= rc.yMin)
            {
                vect_line_rc_pt1 = new cc.Vec2(rc.xMin,rc.yMin);
                vect_line_rc_pt2 = new cc.Vec2(rc.xMax,rc.yMin);
                
            }

        }
        else if(start_rope_pt.y  > rc.yMax)
        {
            if(end_rope_pt.y <= rc.yMin)
            {
                vect_line_rc_pt1 = new cc.Vec2(rc.xMin,rc.yMax);
                vect_line_rc_pt2 = new cc.Vec2(rc.xMax,rc.yMax);

                vect_line_rc_pt3 = new cc.Vec2(rc.xMin,rc.yMin);
                vect_line_rc_pt4 = new cc.Vec2(rc.xMax,rc.yMin);

            }
            else if(end_rope_pt.y <= rc.yMax)
            {
                vect_line_rc_pt1 = new cc.Vec2(rc.xMin,rc.yMax);
                vect_line_rc_pt2 = new cc.Vec2(rc.xMax,rc.yMax);
                
            }
        }else{
            if(end_rope_pt.y >= rc.yMax)
            {
                vect_line_rc_pt3 = new cc.Vec2(rc.xMin,rc.yMax);
                vect_line_rc_pt4 = new cc.Vec2(rc.xMax,rc.yMax);
                
            }
            else if(end_rope_pt.y <= rc.yMin)
            {
                vect_line_rc_pt3 = new cc.Vec2(rc.xMin,rc.yMin);
                vect_line_rc_pt4 = new cc.Vec2(rc.xMax,rc.yMin);
                
            }
        }


        //与横向的边交点
        var inter_pt2:cc.Vec2 = null;
        var v2_len = 0;


        //判断横向的与线段的交点
        if(vect_line_rc_pt1 && vect_line_rc_pt2)
        {
            var y1 = vect_line_rc_pt1.y;

            var ydistance = y1 - start_rope_pt.y;
            if(normalize_vec.y != 0)
            {
                var ilen = ydistance/normalize_vec.y;
                v2_len = ilen;
                var inewx = start_rope_pt.x + normalize_vec.x*ilen;

                inter_pt2 = new cc.Vec2(inewx,y1);
            }
        }
        
        if(inter_pt2)
        {
            var bin_rc_line = true;
            //在边外面
            if(inter_pt2.x > vect_line_rc_pt1.x && inter_pt2.x > vect_line_rc_pt2.x)
            {
                bin_rc_line = false;
            }
            if(inter_pt2.x < vect_line_rc_pt1.x && inter_pt2.x < vect_line_rc_pt2.x)
            {
                bin_rc_line = false;
            }

            //交点不在边上
            if(!bin_rc_line)
            {
                inter_pt2 = null;
            }
        }

      
        if(!inter_pt2 && vect_line_rc_pt3 && vect_line_rc_pt4)
        {
            //判断横向的与线段的交点
            if(vect_line_rc_pt3 && vect_line_rc_pt4)
            {
                var y1 = vect_line_rc_pt3.y;

                var ydistance = y1 - start_rope_pt.y;
                if(normalize_vec.y != 0)
                {
                    var ilen = ydistance/normalize_vec.y;
                    v2_len = ilen;
                    var inewx = start_rope_pt.x + normalize_vec.x*ilen;

                    inter_pt2 = new cc.Vec2(inewx,y1);
                }
            }

            if(inter_pt2)
            {
                var bin_rc_line = true;
                //在边外面
                if(inter_pt2.x > vect_line_rc_pt3.x && inter_pt2.x > vect_line_rc_pt4.x)
                {
                    bin_rc_line = false;
                }
                if(inter_pt2.x < vect_line_rc_pt3.x && inter_pt2.x < vect_line_rc_pt4.x)
                {
                    bin_rc_line = false;
                }

                //交点不在边上
                if(!bin_rc_line)
                {
                    inter_pt2 = null;
                }
            }

        }
        
 
    

        //接下来，判断真实相交的是哪个
        if(!inter_pt1 && !inter_pt2)
        {
            return [0];
        }
      //  console.log("inter_pt1="+inter_pt1+",inter_pt2="+inter_pt2);

        if(inter_pt1 && !inter_pt2)
        {
            return [1,inter_pt1];
        }

        if(!inter_pt1 && inter_pt2)
        {
            return [1,inter_pt2];
        }


        ///两个边都相交，判断使用哪个

        //向量距离最近的

        if(Math.abs(v1_len) > Math.abs(v2_len))
        {
            return [1,inter_pt1,inter_pt2]
        }

         

        //1上，2：右上，3：右，4：右下，5：下：6：左下，7：左，8：左上,0:rc中间
        

       
        return [1,inter_pt2,inter_pt1];
    }

   //返回【是否相交 ,  是否生成中间点，相交点，中间点 】
   //这个是与圆形的相交判断
    Caculate_Circle_Intercept(obj:ObstacleOBJ, prev_joint_pt:cc.Vec2,last_start_rope_pt:cc.Vec2,valid_pos:cc.Vec2 ,cicle:MyCicle)
    {
        //valid_pos:圈圈最新位置,prev_joint_pt:上次圈圈位置,last_start_rope_pt:绳子上次起始点
        var vec1 = new cc.Vec2(valid_pos.x- last_start_rope_pt.x,valid_pos.y-  last_start_rope_pt.y);

        //距离太近，认为可以直接移动连线
        if(Math.abs(vec1.x ) <=0.01 && Math.abs(vec1.y) <= 0.01)
        {
            return [0,0,new cc.Vec2(0,0),[]];
        }

        var radius = 21; 
    
        var circle_center_pt = cicle.m_center_pt;
        var circle_radius = cicle.m_radius;

        //首先，判断下，上次连接点是不是就在圆形上面啊
        var distance_last_role_pt = Math.sqrt(InterceptUtils.Get_Distance_Mul(last_start_rope_pt,circle_center_pt));


        //是否上次连接点就在圆形上
        var blast_role_in_cicle=  0;
        if(Math.abs(distance_last_role_pt - circle_radius) < 7)
        {
            blast_role_in_cicle  =1;
        }


 
        //首先，判断圆和连接点是不是相交
        var distance_joint = Math.sqrt( (valid_pos.x-  circle_center_pt.x)* (valid_pos.x-  circle_center_pt.x) + 
            (valid_pos.y-  circle_center_pt.y)* (valid_pos.y-  circle_center_pt.y) );

        

        //调整过后，圆球所在的位置
        var adjuested = false;
        var adjuest_newpint = valid_pos;
        //相交接近
        if(distance_joint < radius + circle_radius)
        {
            var reversevec=  new cc.Vec2(valid_pos.x - circle_center_pt.x,valid_pos.y- circle_center_pt.y );
            reversevec.normalizeSelf();

            var addvec = new cc.Vec2(reversevec.x *(radius + circle_radius) ,reversevec.y *(radius + circle_radius)     );

            var newvalidpos = new cc.Vec2(addvec.x + circle_center_pt.x,addvec.y+circle_center_pt.y);
            adjuest_newpint = newvalidpos;
            adjuested = true;
        }

        
        //圆心到连线的垂直交点
        var crosspt = InterceptUtils.Get_Vertical_CrossPT(last_start_rope_pt,  adjuest_newpint,  circle_center_pt);

        //判断点crosspt是否在last_start_rope_pt和adjuest_newpint连线的线段上
        var binline = InterceptUtils.Check_Pt_In_Line(crosspt,last_start_rope_pt,adjuest_newpint);

        if(blast_role_in_cicle)
        {
            //上次的链接点在这个圆形上,

            //判断方向是往圆内还是圆外

            var vec_out1 = new cc.Vec2(last_start_rope_pt.x-  circle_center_pt.x,last_start_rope_pt.y- circle_center_pt.y);
            var vect_out2 = new cc.Vec2(adjuest_newpint.x-  last_start_rope_pt.x,adjuest_newpint.y- last_start_rope_pt.y);

            var ctange1 = vec_out1.signAngle(vect_out2)*180/Math.PI;
            if(ctange1 > -90 && ctange1< 90)
            {
                if(adjuested)
                {
                    //往外
                    return [1,0,adjuest_newpint,[]];
                }
                else{
                    return [0,0,new cc.Vec2(0,0),[]];
                }
            }

             //首先从最新的圈做切线
             var inter_pt_radius_list1 = InterceptUtils.Get_Tangent_Pt_To_Cicle(adjuest_newpint,circle_center_pt,circle_radius+5);
             //找到距离上次连接点最近的切点
             var min_dian_pt1 = InterceptUtils.Find_Min_Disntance_Pt_InPtList(last_start_rope_pt,inter_pt_radius_list1);

             
            //方向往园内还有一个可能，与原来的线方向是相反的
            var brefversline = false;
            var last_middle_center_prev_rope_start_pt = this.m_rope_graphic_com.GetLast_Middle_Center_Prev_Rope_Start_Pt();
            if(last_middle_center_prev_rope_start_pt)
            {
                var last_r_vec = new cc.Vec2(last_start_rope_pt.x - last_middle_center_prev_rope_start_pt.x,last_start_rope_pt.y - last_middle_center_prev_rope_start_pt.y);

                var newanglecc1 = last_r_vec.signAngle(vect_out2)*180/Math.PI;
              
                if(newanglecc1 < -90 || newanglecc1 >  90)
                {
                    brefversline = true;
                }

                var last_midele_obastcale = this.m_rope_graphic_com.Get_Last_Middle_Center_Rope_ObstacleInfo();
                var last_rope_obastcale = this.m_rope_graphic_com.Get_Last_Rope_ObstacleInfo();

                //过去连续两个点都在这个圆形上,所以要判断
                if(last_midele_obastcale == obj && last_rope_obastcale == obj)
                {
                    var vec_1 = new cc.Vec2(last_middle_center_prev_rope_start_pt.x- circle_center_pt.x,last_middle_center_prev_rope_start_pt.y- circle_center_pt.y);
                    var vec_2 = new cc.Vec2(last_start_rope_pt.x- circle_center_pt.x,last_start_rope_pt.y- circle_center_pt.y);
                    var vec_3 = new cc.Vec2(min_dian_pt1.x- circle_center_pt.x,min_dian_pt1.y- circle_center_pt.y);
                    
                    var anglec1 = vec_1.signAngle(vec_2)*180/Math.PI;
                    var anglec2 = vec_2.signAngle(vec_3)*180/Math.PI;
                    
                    var bunvalid = 0;
                    if(anglec1 > 0 && anglec1 < 90)
                    {
                        if(anglec2 > -90 && anglec2 < 0)
                        {
                            bunvalid = 1;
                        }
                    }

                    if(anglec2 > 0 && anglec2 < 90)
                    {
                        if(anglec1 > -90 && anglec1 < 0)
                        {
                            bunvalid = 1;
                        }
                    }

                    if(bunvalid)
                    {
                        //线段是反的
                        brefversline = true;
                    }

                }

          


            }

            //线段是反的
            if(brefversline)
            {
                return [1,0,adjuest_newpint,null];
            }
   
            
           
            return [1,1,adjuest_newpint,[min_dian_pt1]];
        }


        //上次的切点不在这个圆形上




        //计算得到圆心到连线的垂直距离
        var idstance1 = InterceptUtils.Get_Vertical_Distance(last_start_rope_pt,  adjuest_newpint,  circle_center_pt);

        //console.log("idstance1 =" +idstance1)
        if(idstance1 > circle_radius + 4  )
        {
            if(adjuested)
            {
                return [1,0,adjuest_newpint,[]];
            }else{
                return [0,0,new cc.Vec2(0,0),[]];
            }
            
        }



        //不在线段上，说明两个点都在一头
        if(!binline)
        {
            if(adjuested)
            {
                return [1,0,adjuest_newpint,  []];
            }
            else{
                return [0,0,new cc.Vec2(0,0),[]];
            }
        }

        //在线段上，说明通过切线转连

        var inter_pt_radius_list = InterceptUtils.Get_Tangent_Pt_To_Cicle(last_start_rope_pt,circle_center_pt,circle_radius+5);

        var minpt = null;
        var distance_min = 0;

        for(var ff=0;ff<inter_pt_radius_list.length;ff++)
        {
            var ff_pt = inter_pt_radius_list[ff];
            var ff_distance_mul = InterceptUtils.Get_Distance_Mul(ff_pt,crosspt);
            if(minpt == null)
            {
                minpt = ff_pt;
                distance_min = ff_distance_mul;
            }else{
                if(ff_distance_mul < distance_min)
                {
                    minpt = ff_pt;
                    distance_min = ff_distance_mul;
                }
            }
        }

        //var cross_pt:cc.Vec2 = InterceptUtils.Get_Vertical_CrossPT(last_start_rope_pt,  valid_pos,  circle_center_pt);



        var first_pt = InterceptUtils.Find_Min_Disntance_Pt_InPtList(crosspt,inter_pt_radius_list);

        return [1,1,adjuest_newpint,[first_pt]];

    }
    //返回【是否相交 ,  是否生成中间点，相交点，中间点 】
    Caculate_Line_Intercept(prev_joint_pt:cc.Vec2,last_start_rope_pt:cc.Vec2,valid_pos:cc.Vec2,rc:cc.Rect)
    {
        //valid_pos:圈圈最新位置,prev_joint_pt:上次圈圈位置,last_start_rope_pt:绳子上次起始点
        var vec1 = new cc.Vec2(valid_pos.x - last_start_rope_pt.x, valid_pos.y - last_start_rope_pt.y);

        //距离太近，认为可以直接移动连线
        if(Math.abs(vec1.x ) <=0.1 && Math.abs(vec1.y) <= 0.1)
        {
            return [0,0,new cc.Vec2(0,0),[]];
        }

        vec1.normalizeSelf();



        var min_x = rc.xMin;
        var max_x = rc.xMax;
        var min_y = rc.yMin;
        var max_y = rc.yMax;

        var radius = 21;
 
        var irealw = 40;
        //到圈的终点的线段
        var realendpt = valid_pos;



        //last_start_rope_pt,绳子起始点，起始点的方位信息
        //1上，2：右上，3：右，4：右下，5：下：6：左下，7：左，8：左上
        var startpt_area_index =  InterceptUtils.Get_Pt_In_Rect_Arear(valid_pos,rc);
        var endpt_area_index =  InterceptUtils.Get_Pt_In_Rect_Arear(realendpt,rc);





        //绳子起始点和终点都在矩形同一边，肯定可以直接拉线
        if(realendpt.y > rc.yMax+ radius && last_start_rope_pt.y > rc.yMax + radius)
        {
            return [0,0,new cc.Vec2(0,0), []];
        }
        if(realendpt.y < rc.yMin - radius && last_start_rope_pt.y < rc.yMin- radius)
        {
            return [0,0,new cc.Vec2(0,0),[]];
        }

        if(realendpt.x > rc.xMax+ radius && last_start_rope_pt.x > rc.xMax+ radius)
        {
            return [0,0,new cc.Vec2(0,0),[]];
        }
        if(realendpt.x < rc.xMin- radius && last_start_rope_pt.x < rc.xMin- radius)
        {
            return  [0,0,new cc.Vec2(0,0),[]];
        }

        //得到




        var bhasintercept = 0;

        //起始点在上方
        //线段与矩形相交点

        
        //首先，判断这个圈圈是否已经和矩形相交了
        var end_real_use_pt = null;

        //首先，判断是与x还是y距离最近
        var min_x1  = realendpt.x - (rc.xMin - radius ) ;
        var min_x2 =  rc.xMax + radius - realendpt.x;

        var min_y1  = realendpt.y - (rc.yMin - radius ) ;
        var min_y2 =   rc.yMax + radius - realendpt.y;


      

        //首先，判断一种特殊情况，上次的点在矩形的四个顶点上
          //1-左上，2-右上，3-左下，4：右下
        var blast_rope_start_pt_in_rc_index = InterceptUtils.Get_Edge_Pt_In_Rc_Edgetype(last_start_rope_pt,rc);

 

        var last_middle_pt = this.m_rope_graphic_com.GetLast_Middle_Center_Prev_Rope_Start_Pt();
        if(blast_rope_start_pt_in_rc_index > 0 && last_middle_pt)
        {
            //上一个点在这个矩阵上，判断是不是能缠绕起来

            //左上角点
            if(blast_rope_start_pt_in_rc_index == 1)
            {
                if(last_middle_pt.x <= rc.xMin+6 && last_middle_pt.y <= rc.yMax + 6)
                {
                    if(valid_pos.x >= rc.xMax &&  valid_pos.y >= rc.yMin && valid_pos.y <= rc.yMax)
                    {
                        
                        return [1,1,valid_pos,     [ new cc.Vec2(rc.xMax,rc.yMax)]   ];
                    }
                }

                if(last_middle_pt.x >= rc.xMin-6 && last_middle_pt.y >= rc.yMax - 6)
                {
                    if(valid_pos.x >= rc.xMin && valid_pos.x<=rc.xMax && valid_pos.y <= rc.yMin)
                    {
                        
                        return [1,1,valid_pos,     [ new cc.Vec2(rc.xMin,rc.yMin)]   ];
                    }
                }
            }

            //上次顶点在右上角
            if(blast_rope_start_pt_in_rc_index == 2)
            {

                if(last_middle_pt.x <= rc.xMax +6 && last_middle_pt.y >= rc.yMax - 6)
                {
                    if(valid_pos.x >= rc.xMin && valid_pos.x<=rc.xMax && valid_pos.y <= rc.yMin)
                    {
                        
                        return [1,1,valid_pos,     [ new cc.Vec2(rc.xMax,rc.yMin)]   ];
                    }
                }
           
                if(last_middle_pt.x >= rc.xMax -6 && last_middle_pt.y <= rc.yMax + 6)
                {
                    if(valid_pos.x <= rc.xMin && valid_pos.y>=rc.yMin && valid_pos.y <= rc.yMax)
                    {
                        return [1,1,valid_pos,     [ new cc.Vec2(rc.xMin,rc.yMax)]   ];
                    }
                }
            }


            //上次顶点在左下角
            if(blast_rope_start_pt_in_rc_index == 3)
            {

                if(last_middle_pt.x >= rc.xMin -6 && last_middle_pt.y <= rc.yMin + 6)
                {
                    if(valid_pos.x >= rc.xMin && valid_pos.x<=rc.xMax && valid_pos.y >= rc.yMax)
                    {
                        return [1,1,valid_pos,     [ new cc.Vec2(rc.xMin,rc.yMax)]   ];
                    }
                }



                if(last_middle_pt.x <= rc.xMin + 6 && last_middle_pt.y >= rc.yMin - 6)
                {
                    if(valid_pos.x >= rc.xMax && valid_pos.y<=rc.yMax && valid_pos.y >= rc.yMin)
                    {
                        return [1,1,valid_pos,     [ new cc.Vec2(rc.xMax,rc.yMin)]   ];
                    }
                }
            }

            if(blast_rope_start_pt_in_rc_index == 4)
            {

                if(last_middle_pt.x >= rc.xMax -6 && last_middle_pt.y >= rc.yMin - 6)
                {
                    if(valid_pos.x <= rc.xMin && valid_pos.y<=rc.yMax && valid_pos.y >= rc.yMin)
                    {
                        return [1,1,valid_pos,     [ new cc.Vec2(rc.xMin,rc.yMin)]   ];
                    }
                }

                if(last_middle_pt.x <= rc.xMax +6 && last_middle_pt.y <= rc.yMin + 6)
                {
                    if(valid_pos.x <= rc.xMax && valid_pos.y>=rc.xMin && valid_pos.y >= rc.yMax)
                    {
                        return [1,1,valid_pos,     [ new cc.Vec2(rc.xMax,rc.yMax)]   ];
                    }
                }

            }

        }

 
      
        var check_start_pt = last_start_rope_pt;
 
        var inter_pt:cc.Vec2 =  null;
        //得到开始点与矩形的交点
        var inter_rc_valid_pt_list = InterceptUtils.Get_FX_Line_Intercept_With_Rc_Pt_List(check_start_pt,vec1,rc);
        var bdeal_two_pt_in_rc_rope = 0;
        var inter_pt_info = this.Caculate_Line_Intecept_Rc_Pt(last_start_rope_pt,realendpt,rc);
       
       
        //有两个交点
        if( blast_rope_start_pt_in_rc_index > 0 && inter_rc_valid_pt_list.length == 2)
        {
            //前面已经判断过顶点在矩形上，缠绕的情况了。现在不缠绕，交点有两个，显然，我们被挡住了
            inter_pt = check_start_pt;
            bdeal_two_pt_in_rc_rope = 1;
        }
        else{
 
            //判断相交的点在哪一条边上
            if(!inter_pt_info[0])
            {
                //最后的圈已经靠近到矩形内了
            
                return   [0,0,new cc.Vec2(0,0),[]];
            }
            inter_pt  = inter_pt_info[1] as cc.Vec2;
        }

      
 

        //1:上，2:下面，3：左边，4：右边
        var inter_line_type = 0;
        if(InterceptUtils.MinEqual(inter_pt.y,rc.yMin) && rc.xMin <= inter_pt.x && inter_pt.x <= rc.xMax )
        {
            //下面边上
            inter_line_type = 2;
        }
        if(InterceptUtils.MinEqual(inter_pt.y,rc.yMax) && rc.xMin <= inter_pt.x && inter_pt.x <= rc.xMax )
        {
            //上面边上
            inter_line_type = 1;
        }

        if(InterceptUtils.MinEqual(inter_pt.x,rc.xMin) && rc.yMin <= inter_pt.y && inter_pt.y <= rc.yMax )
        {
            //左边
            inter_line_type = 3;
        }
        if(InterceptUtils.MinEqual(inter_pt.x,rc.xMax) && rc.yMin <= inter_pt.y && inter_pt.y <= rc.yMax )
        {
            //右边
            inter_line_type = 4;
        }


        //有两个交点，说明转弯了，并且之前没碰撞，说明是新转过来的
        if(!end_real_use_pt && !bdeal_two_pt_in_rc_rope )
        {
            //圈圈最后的位置也没有与矩形碰撞
            if(inter_pt_info.length >= 3  )
            {
                //以碰撞的两个点的那个角的点作为中间点
                var inter_pt1:cc.Vec2 = inter_pt_info[1] as cc.Vec2;
                var inter_pt2:cc.Vec2 = inter_pt_info[2] as cc.Vec2;
   
                var line_t1 = InterceptUtils.Get_LinePt_In_Rc_Line_Type(inter_pt1,rc);
                var line_t2 = InterceptUtils.Get_LinePt_In_Rc_Line_Type(inter_pt2,rc);
              
                var center_middle_pt = null;
                //上
                if(line_t1 == 1)
                {
                    //左
                    if(line_t2 == 3)
                    {
                        center_middle_pt = new cc.Vec2(rc.xMin,rc.yMax)
                    }
                    else if(line_t2 == 4)
                    {
                        center_middle_pt = new cc.Vec2(rc.xMax,rc.yMax)
                    }
                }  //上
                else if(line_t1 == 2)
                {
                    //左
                    if(line_t2 == 3)
                    {
                        center_middle_pt = new cc.Vec2(rc.xMin,rc.yMin)
                    }
                    else if(line_t2 == 4)
                    {
                        center_middle_pt = new cc.Vec2(rc.xMax,rc.yMin)
                    }
                }else if(line_t1 == 3)
                {
                    //左
                    if(line_t2 == 1)
                    {
                        center_middle_pt = new cc.Vec2(rc.xMin,rc.yMax)
                    }
                    else if(line_t2 == 2)
                    {
                        center_middle_pt = new cc.Vec2(rc.xMin,rc.yMin)
                    }
                }else if(line_t1 == 4)
                {
                    //
                    if(line_t2 == 1)
                    {
                        center_middle_pt = new cc.Vec2(rc.xMax,rc.yMax)
                    }
                    else if(line_t2 == 2)
                    {
                        center_middle_pt = new cc.Vec2(rc.xMax,rc.yMin)
                    }
                }


                //交点
                if(center_middle_pt && blast_rope_start_pt_in_rc_index == 0)
                {
                   
                    var add_distance = 2;
                    var new_real_pt = InterceptUtils.Get_New_Add_Distance_Pt(last_start_rope_pt,center_middle_pt,add_distance);
                   
                    return [1,1,valid_pos,[new_real_pt]];
                }
            }
            else{
            

               //首先，判断一种特殊情况，上次的点在矩形的四个顶点上
            //  var blast_rope_start_pt_in_rc_index = 0;
                //1-左上，2-右上，3-左下，4：右下
               // var binter_same_p
                if(blast_rope_start_pt_in_rc_index == 1)
                {

                }
 
            }
            
        }

 
 

        var radiu_cicle_pos = inter_pt;
        if(inter_line_type == 1)
        {
            radiu_cicle_pos = new cc.Vec2(inter_pt.x,inter_pt.y+radius);
        }
        else if(inter_line_type == 2)
        {
            radiu_cicle_pos = new cc.Vec2(inter_pt.x,inter_pt.y-radius);
        }  
        else if(inter_line_type == 3)
        {
            radiu_cicle_pos = new cc.Vec2(inter_pt.x - radius,inter_pt.y);
        }
        else if(inter_line_type == 4)
        {
            radiu_cicle_pos = new cc.Vec2(inter_pt.x + radius,inter_pt.y);
        }
 


        if(blast_rope_start_pt_in_rc_index == 1)
        {
            if(valid_pos.x >= rc.xMin && valid_pos.y <= rc.yMax)
            {
                return [1,0,radiu_cicle_pos,[]]
            }
        }
        else if(blast_rope_start_pt_in_rc_index == 2)
        {
            if(valid_pos.x <= rc.xMax && valid_pos.y <= rc.yMax)
            {
                return [1,0,radiu_cicle_pos,[]]
            }
        }

        else if(blast_rope_start_pt_in_rc_index == 3)
        {
            if(valid_pos.x >= rc.xMin && valid_pos.y >= rc.yMin)
            {
                return [1,0,radiu_cicle_pos,[]]
            }
        }
        else if(blast_rope_start_pt_in_rc_index == 4)
        {
            if(valid_pos.x <= rc.xMax && valid_pos.y >= rc.yMin)
            {
                return [1,0,radiu_cicle_pos,[]]
            }
        }


        if(Math.abs(inter_pt.x- last_start_rope_pt.x) <= 5 && Math.abs(inter_pt.y- last_start_rope_pt.y) <= 5 && blast_rope_start_pt_in_rc_index > 0)
        {
            //相交的是上次绳子顶点所在的边
                         
            return [1,0,valid_pos, null]
        }

        return [1,0,radiu_cicle_pos,[]]
      



    }

    

    Check_Two_Pt_Can_Line_Not_Throuh_Other_Shape(last_start_rope_pt,last_m_pt,all_obstcle_shap_list)
    {
        return true;
    }



    //判断最近的一个障碍物和绳子的交点信息
    Check_Nearest_Intercept_To_Dest_PT(last_start_rope_pt:cc.Vec2,prev_joint_pt:cc.Vec2,valid_pos:cc.Vec2 )
    {
        var addvec = new cc.Vec2(valid_pos.x-  last_start_rope_pt.x,valid_pos.y- last_start_rope_pt.y);
        var addvec_norm = addvec.normalize();
    
        var all_obstcle_shap_list = this.Get_All_Obstacle_Shape_InfoList();
      
        //反向先得到最近的障碍物
        var nearest_intercept_ionfo = InterceptUtils.Caculate_MinDistance_Valid_Intercept_Pt(valid_pos, new cc.Vec2(-1 * addvec_norm.x, -1 * addvec_norm.y), last_start_rope_pt, all_obstcle_shap_list);
        
        //首先处理特殊情况：同一直线排列的障碍物，拉下来
        if(nearest_intercept_ionfo[0])
        {
            var last_middle_pt = this.m_rope_graphic_com.GetLast_Middle_Center_Prev_Rope_Start_Pt();            
            var chek_prev_pt = last_middle_pt;
            if(!last_middle_pt)
            {
                chek_prev_pt = last_start_rope_pt;
            }
            var near_obj: ObstacleOBJ = nearest_intercept_ionfo[1];
            
            //相交点
            var min_inter_pt = nearest_intercept_ionfo[0];
            

            if(near_obj.m_itype == 1)
            {

             
                //最近的是个矩形障碍物
                var ff_pt = near_obj.m_left_center_pt
                var ff_size = near_obj.m_valid_size;
                var ff_rc =  new cc.Rect(ff_pt.x,ff_pt.y,ff_size.width,ff_size.height);
                
                //var last_end_pt_intercept_info2 = this.Caculate_Line_Intercept(prev_joint_pt,last_start_rope_pt,valid_pos,ff_rc);

               // if(last_end_pt_intercept_info2[0 ]&& last_end_pt_intercept_info2[1])
               // {
                   //  return this.Check_Can_Move_to_Dest_Pos(last_start_rope_pt,prev_joint_pt,valid_pos,0);
                //}
           
                var rc_center_x = ff_rc.xMin + (ff_rc.xMax - ff_rc.xMin)/2;
                var rc_center_y = ff_rc.yMin + (ff_rc.yMax - ff_rc.yMin)/2;

                //判断last_start_rope_pt是不是也在这个矩形上面
                var binrc_edge_type = InterceptUtils.Get_Edge_Pt_In_Rc_Edgetype(last_start_rope_pt,ff_rc);

                var samey = 0;
                var samex = 0;
                var csame_v = 0;
                
                //1:左上，2：右上，3：左下。4：右下
                if(binrc_edge_type == 2)
                {

                    if(  valid_pos.x > ff_rc.xMin && valid_pos.x < ff_rc.xMax && valid_pos.y < ff_rc.yMin &&  (last_start_rope_pt.y > ff_rc.yMin+10) )
                    {

                        if(chek_prev_pt.x <= ff_rc.xMax && chek_prev_pt.y >= ff_rc.yMax)
                        {
                            console.log("binrc_edge_type="+binrc_edge_type);
                            return [1,1,valid_pos,[new cc.Vec2(ff_rc.xMax,ff_rc.yMin )],near_obj];
    
                        }
                     

                    }


                    if(  valid_pos.y > ff_rc.yMin && valid_pos.y < ff_rc.yMax && valid_pos.x < ff_rc.xMin  &&  (last_start_rope_pt.x > ff_rc.xMin+10) )
                    {
                        if(chek_prev_pt.x <= ff_rc.xMin && chek_prev_pt.y <= ff_rc.yMax)
                        {

                            console.log("binrc_edge_type="+binrc_edge_type);
                            return [1,1,valid_pos,[new cc.Vec2(ff_rc.xMin,ff_rc.yMax )],near_obj];
                        }
                    }

                } 
                else if(binrc_edge_type == 1)
                {
                    //1:左上，2：右上，3：左下。4：右下


                    if(  valid_pos.x > ff_rc.xMax && valid_pos.y > ff_rc.yMin  && valid_pos.y < ff_rc.yMax &&  (last_start_rope_pt.x < ff_rc.xMax- 10) )
                    {
                        if(chek_prev_pt.x <= ff_rc.xMin && chek_prev_pt.y <= ff_rc.yMax)
                        {


                            console.log("binrc_edge_type="+binrc_edge_type);
                            return [1,1,valid_pos,[new cc.Vec2(ff_rc.xMax,ff_rc.yMax )],near_obj];

                        }

                    }


                    if(  valid_pos.y < ff_rc.yMin && valid_pos.x  > ff_rc.xMin  && valid_pos.x < ff_rc.xMax   &&  (last_start_rope_pt.y > ff_rc.yMin + 10)  )
                    {
                        if(chek_prev_pt.x >= ff_rc.xMin && chek_prev_pt.y >= ff_rc.yMax)
                        {

                            console.log("binrc_edge_type="+binrc_edge_type);
                            return [1,1,valid_pos,[new cc.Vec2(ff_rc.xMin,ff_rc.yMin )],near_obj];
                        }
                    }
                }
                else if(binrc_edge_type == 3)
                {
                    if(  valid_pos.x > ff_rc.xMin &&   valid_pos.x < ff_rc.xMax &&  valid_pos.y > ff_rc.yMax &&  (last_start_rope_pt.y  < ff_rc.yMax - 10)  )
                    {
                        if(chek_prev_pt.x >= ff_rc.xMin && chek_prev_pt.y <= ff_rc.yMin)
                        {

                            console.log("binrc_edge_type="+binrc_edge_type);
                            return [1,1,valid_pos,[new cc.Vec2(ff_rc.xMin,ff_rc.yMax )],near_obj];
                        }
                        
                    }

                    if(  valid_pos.x > ff_rc.xMax &&  valid_pos.y > ff_rc.yMin &&  valid_pos.y < ff_rc.yMax   &&  (last_start_rope_pt.x  < ff_rc.xMax - 10)  )
                    {

                        if(chek_prev_pt.x <= ff_rc.xMin && chek_prev_pt.y >= ff_rc.yMin)
                        {
                            console.log("binrc_edge_type="+binrc_edge_type);
                            return [1,1,valid_pos,[new cc.Vec2(ff_rc.xMax,ff_rc.yMin )],near_obj];
                        }
                    }
                }  
                else if(binrc_edge_type == 4)
                {
                    if(valid_pos.x  > ff_rc.xMin && valid_pos.x  < ff_rc.xMax && valid_pos.y > ff_rc.yMax   &&  (last_start_rope_pt.y  < ff_rc.yMax - 10))
                    {

                        if(chek_prev_pt.x <= ff_rc.xMax && chek_prev_pt.y <= ff_rc.yMin)
                        {
                            console.log("binrc_edge_type="+binrc_edge_type);
                            return [1,1,valid_pos,[new cc.Vec2(ff_rc.xMax,ff_rc.yMax )],near_obj];
                        }
                        
                    }

                    if(valid_pos.x  < ff_rc.xMin && valid_pos.y > ff_rc.yMin && valid_pos.y < ff_rc.yMax &&  (last_start_rope_pt.y  > ff_rc.yMin + 10))
                    {

                        if(chek_prev_pt.x >= ff_rc.xMax && chek_prev_pt.y >= ff_rc.yMin)
                        {
                            console.log("binrc_edge_type="+binrc_edge_type);
                            return [1,1,valid_pos,[new cc.Vec2(ff_rc.xMin,ff_rc.yMin )],near_obj];
                        }
                        
                    }

                }
                else if(Math.abs(ff_rc.yMax - last_start_rope_pt.y) <= 4)
                {
                    samey = 1;
                    csame_v = ff_rc.yMax;

                    if( (valid_pos.x < ff_rc.xMin - 10) &&  (valid_pos.x < last_start_rope_pt.x - 10) &&   (last_start_rope_pt.x > ff_rc.xMin + 10)
                    
                        && (valid_pos.y > ff_rc.yMin && valid_pos.y < ff_rc.yMax) && ( prev_joint_pt.y > valid_pos.y)
                    )
                    {
                        var last_m_pt =  new cc.Vec2(ff_rc.xMin,ff_rc.yMax );

                        var bcanmpt = 1;
                        if(last_middle_pt )
                        {
                            //线段又绕回去了
                            if(InterceptUtils.Get_Distance(last_middle_pt,last_m_pt) <= 5)
                            {
                                bcanmpt = 0;
                            }

                            if(last_middle_pt.x < valid_pos.x)
                            {
                                bcanmpt = 0;
                            }
                        }

                        if(InterceptUtils.Get_Distance(min_inter_pt,last_m_pt) >= 10)
                        {
                           // bcanmpt = 0;
                        }

                        if(valid_pos.y < rc_center_y)
                        {
                           // bcanmpt = 0;
                        }

                        if(bcanmpt&& this.Check_Two_Pt_Can_Line_Not_Throuh_Other_Shape(last_start_rope_pt,last_m_pt,all_obstcle_shap_list))
                        {

                            return [1,1,valid_pos,[last_m_pt],near_obj];
                        }

                    }

                    if(  (valid_pos.x  > ff_rc.xMax + 10) && (valid_pos.x > last_start_rope_pt.x + 10) &&   (last_start_rope_pt.x < ff_rc.xMax - 10)
                            && (valid_pos.y > ff_rc.yMin && valid_pos.y < ff_rc.yMax) && ( prev_joint_pt.y > valid_pos.y)
                    
                    )
                    {
                        var last_m_pt =  new cc.Vec2(ff_rc.xMax,ff_rc.yMax );
                        var bcanmpt = 1;
                        if(last_middle_pt )
                        {
                            //线段又绕回去了
                            if(InterceptUtils.Get_Distance(last_middle_pt,last_m_pt) <= 5)
                            {
                                bcanmpt = 0;
                            }

                            if(last_middle_pt.x > valid_pos.x)
                            {
                                bcanmpt = 0;
                            }
                        }

                        if(InterceptUtils.Get_Distance(min_inter_pt,last_m_pt) >= 10)
                        {
                            //bcanmpt = 0;
                        }

                        if(valid_pos.y < rc_center_y)
                        {
                           // bcanmpt = 0;
                        }
                      
                        if(bcanmpt && this.Check_Two_Pt_Can_Line_Not_Throuh_Other_Shape(last_start_rope_pt,last_m_pt,all_obstcle_shap_list))
                        {

                            return [1,1,valid_pos,[last_m_pt],near_obj];
                        }

                    }



                }
                else if(Math.abs(ff_rc.yMin - last_start_rope_pt.y) <= 4)
                {
                    samey = 1;
                    csame_v = ff_rc.yMin;

                    if( (valid_pos.x < ff_rc.xMin - 10) && (valid_pos.x < last_start_rope_pt.x - 10) &&    (last_start_rope_pt.x > ff_rc.xMin + 10)
                        && (valid_pos.y > ff_rc.yMin && valid_pos.y < ff_rc.yMax) && ( prev_joint_pt.y < valid_pos.y)
                        
                        )
                    {
                        var last_m_pt =  new cc.Vec2(ff_rc.xMin,ff_rc.yMin );
                        var bcanmpt = 1;
                        if(last_middle_pt )
                        {
                            //线段又绕回去了
                            if(InterceptUtils.Get_Distance(last_middle_pt,last_m_pt) <= 5)
                            {
                                bcanmpt = 0;
                            }

                            if(last_middle_pt.x < valid_pos.x)
                            {
                                bcanmpt = 0;
                            }
                        }

                        if(InterceptUtils.Get_Distance(min_inter_pt,last_m_pt) >= 10)
                        {
                           // bcanmpt = 0;
                        }

                        if(valid_pos.y > rc_center_y)
                        {
                           // bcanmpt = 0;
                        }


                        if(bcanmpt && this.Check_Two_Pt_Can_Line_Not_Throuh_Other_Shape(last_start_rope_pt,last_m_pt,all_obstcle_shap_list))
                        {

                            return [1,1,valid_pos,[last_m_pt],near_obj];
                        }

                    }

                    if( (valid_pos.x  > ff_rc.xMax + 10) && (valid_pos.x > last_start_rope_pt.x + 10) &&    (last_start_rope_pt.x < ff_rc.xMax - 10)
                        && (valid_pos.y > ff_rc.yMin && valid_pos.y < ff_rc.yMax) && ( prev_joint_pt.y < valid_pos.y)
                        )
                    {
                        var last_m_pt =  new cc.Vec2(ff_rc.xMax,ff_rc.yMin );
                        var bcanmpt = 1;
                        if(last_middle_pt )
                        {
                            //线段又绕回去了
                            if(InterceptUtils.Get_Distance(last_middle_pt,last_m_pt) <= 5)
                            {
                                bcanmpt = 0;
                            }


                            if(last_middle_pt.x > valid_pos.x)
                            {
                                bcanmpt = 0;
                            }
                        }

                        if(InterceptUtils.Get_Distance(min_inter_pt,last_m_pt) >= 10)
                        {
                           // bcanmpt = 0;
                        }

                        if(valid_pos.y > rc_center_y)
                        {
                           // bcanmpt = 0;
                        }


                        if(bcanmpt && this.Check_Two_Pt_Can_Line_Not_Throuh_Other_Shape(last_start_rope_pt,last_m_pt,all_obstcle_shap_list))
                        {

                            return [1,1,valid_pos,[last_m_pt],near_obj];
                        }

                    }
                }
                else if(Math.abs(ff_rc.xMin - last_start_rope_pt.x) <= 4)
                {
                    samex = 1;
                    csame_v = ff_rc.xMin;

                    if( (valid_pos.y < ff_rc.yMin - 10) && (valid_pos.y < last_start_rope_pt.y - 10) &&  (last_start_rope_pt.y > ff_rc.yMin + 10)
                        && (valid_pos.x > ff_rc.xMin && valid_pos.x < ff_rc.xMax) && ( prev_joint_pt.x < valid_pos.x)
                        
                        ) 
                    {
                        var last_m_pt =  new cc.Vec2(ff_rc.xMin,ff_rc.yMin );
                        var bcanmpt = 1;
                        if(last_middle_pt )
                        {
                            //线段又绕回去了
                            if(InterceptUtils.Get_Distance(last_middle_pt,last_m_pt) <= 5)
                            {
                                bcanmpt = 0;
                            }


                            if(last_middle_pt.y  < valid_pos.y)
                            {
                                bcanmpt = 0;
                            }
                        }

                        if(InterceptUtils.Get_Distance(min_inter_pt,last_m_pt) >= 10)
                        {
                         //   bcanmpt = 0;
                        }

                        if(valid_pos.x > rc_center_x)
                        {
                         //   bcanmpt = 0;
                        }



                        if(bcanmpt && this.Check_Two_Pt_Can_Line_Not_Throuh_Other_Shape(last_start_rope_pt,last_m_pt,all_obstcle_shap_list))
                        {

                            return [1,1,valid_pos,[last_m_pt],near_obj];
                        }

                    }

                    if( (valid_pos.y > ff_rc.yMax + 10) && (valid_pos.y > last_start_rope_pt.y + 10) &&    (last_start_rope_pt.y < ff_rc.yMax - 10)
                        && (valid_pos.x > ff_rc.xMin && valid_pos.x < ff_rc.xMax) && ( prev_joint_pt.x < valid_pos.x)
                        ) 
                    {
                        var last_m_pt =  new cc.Vec2(ff_rc.xMin,ff_rc.yMax );
                        var bcanmpt = 1;
                        if(last_middle_pt )
                        {
                            //线段又绕回去了
                            if(InterceptUtils.Get_Distance(last_middle_pt,last_m_pt) <= 5)
                            {
                                bcanmpt = 0;
                            }

                            if(last_middle_pt.y  > valid_pos.y)
                            {
                                bcanmpt = 0;
                            }
                        }

                        if(InterceptUtils.Get_Distance(min_inter_pt,last_m_pt) >= 10)
                        {
                          //  bcanmpt = 0;
                        }
                        
                        if(valid_pos.x > rc_center_x)
                        {
                           // bcanmpt = 0;
                        }


                        if(bcanmpt && this.Check_Two_Pt_Can_Line_Not_Throuh_Other_Shape(last_start_rope_pt,last_m_pt,all_obstcle_shap_list))
                        {

                            return [1,1,valid_pos,[last_m_pt],near_obj];
                        }

                    }
                }
                else if(Math.abs(ff_rc.xMax - last_start_rope_pt.x) <= 4)
                {
                    samex = 1;
                    csame_v = ff_rc.xMax;

                    if( (valid_pos.y < ff_rc.yMin - 10) && (valid_pos.y < last_start_rope_pt.y - 10) &&   (last_start_rope_pt.y > ff_rc.yMin + 10)
                        
                        && (valid_pos.x > ff_rc.xMin && valid_pos.x < ff_rc.xMax) && ( prev_joint_pt.x > valid_pos.x)
                        ) 
                    {
                        var last_m_pt =  new cc.Vec2(ff_rc.xMax,ff_rc.yMin );
                        var bcanmpt = 1;
                        if(last_middle_pt )
                        {
                            //线段又绕回去了
                            if(InterceptUtils.Get_Distance(last_middle_pt,last_m_pt) <= 5)
                            {
                                bcanmpt = 0;
                            }

                            if(last_middle_pt.y  <  valid_pos.y)
                            {
                                bcanmpt = 0;
                            }
                        }

                        if(InterceptUtils.Get_Distance(min_inter_pt,last_m_pt) >= 10)
                        {
                          //  bcanmpt = 0;
                        }

                        if(valid_pos.x < rc_center_x)
                        {
                           // bcanmpt = 0;
                        }

                        
                        if(bcanmpt && this.Check_Two_Pt_Can_Line_Not_Throuh_Other_Shape(last_start_rope_pt,last_m_pt,all_obstcle_shap_list))
                        {

                            return [1,1,valid_pos,[last_m_pt],near_obj];
                        }

                    }

                    if( (valid_pos.y > ff_rc.yMax + 10) && (valid_pos.y > last_start_rope_pt.y + 10) &&  ( last_start_rope_pt.y < ff_rc.yMax - 10)
                        && (valid_pos.x > ff_rc.xMin && valid_pos.x < ff_rc.xMax) && ( prev_joint_pt.x > valid_pos.x)
                        ) 
                    {
                        var last_m_pt =  new cc.Vec2(ff_rc.xMax,ff_rc.yMax );
                        var bcanmpt = 1;
                        if(last_middle_pt )
                        {
                            //线段又绕回去了
                            if(InterceptUtils.Get_Distance(last_middle_pt,last_m_pt) <= 5)
                            {
                                bcanmpt = 0;
                            }

                            if(last_middle_pt.y  > valid_pos.y)
                            {
                                bcanmpt = 0;
                            }
                        }

                        if(InterceptUtils.Get_Distance(min_inter_pt,last_m_pt) >= 10)
                        {
                          //  bcanmpt = 0;
                        }

                        if(valid_pos.x < rc_center_x)
                        {
                           // bcanmpt = 0;
                        }

                        if(bcanmpt && this.Check_Two_Pt_Can_Line_Not_Throuh_Other_Shape(last_start_rope_pt,last_m_pt,all_obstcle_shap_list))
                        {

                            return [1,1,valid_pos,[last_m_pt],near_obj];
                        }

                    }
                }


                

            }

        }

   
        return [0,0,null,[]];
    }


    //判断鼠标点最终的有效位置，如果在障碍物里面或者碰撞了障碍物，调整为障碍物边上，否则不变
    //返回[是否调整位置，调整后的位置] 
    Adjuest_Last_Mouse_Pt_To_Valid_PT(src_valid_pos,last_start_rope_pt)
    {
        var all_obstcle_shap_list = this.Get_All_Obstacle_Shape_InfoList();
    
         //相交信息
         var first_inter_info = EscapeCacu.Check_Valid_Pt_Inter_With_Shape_List(src_valid_pos ,last_start_rope_pt ,all_obstcle_shap_list );


         return first_inter_info;
    }
    //返回【是否相交 ,  是否生成中间点，相交点，中间点 , 相交点对应的障碍物】
    Check_Can_Move_to_Dest_Pos(last_start_rope_pt,prev_joint_pt:cc.Vec2,src_valid_pos:cc.Vec2,badjusetedpos,bCanSpecailAddSameXYMiddle = 1)
    {
         //valid_pos:圈圈最新位置,prev_joint_pt:上次圈圈位置,last_start_rope_pt:绳子上次起始点
         var vec1 = new cc.Vec2(src_valid_pos.x- last_start_rope_pt.x,src_valid_pos.y-  last_start_rope_pt.y);

         //距离太近，认为可以直接移动连线
         if(Math.abs(vec1.x ) <=0.1 && Math.abs(vec1.y) <= 0.1)
         {
             return [0,0,new cc.Vec2(0,0),new cc.Vec2(0,0)];
         }

         

         var all_obstcle_shap_list = this.Get_All_Obstacle_Shape_InfoList();
    
        //valid_pos调整为鼠标最终使用的位置，因为如果鼠标到了圆形中间，必须要调整以使得鼠标点不在障碍物里面
        var valid_pos = src_valid_pos;
              
     

        if(bCanSpecailAddSameXYMiddle)
        {
            
           var move_to_info = this.Check_Nearest_Intercept_To_Dest_PT(last_start_rope_pt,prev_joint_pt,valid_pos );

           if(move_to_info[0])
           {
               return move_to_info;
           }
/*
           if(start_adjuest)
           {
               return [1,0,valid_pos,[]]
           }
           return [0,0,new cc.Vec2(0,0),[]]
           */
        }

       
        var addvec = new cc.Vec2(valid_pos.x-  last_start_rope_pt.x,valid_pos.y- last_start_rope_pt.y);
        var addvec_norm = addvec.normalize();
    

        //依次找到
        var all_obj_list =  InterceptUtils.Find_Obstacle_List_Intercept_By_Distance(last_start_rope_pt,valid_pos,  addvec_norm,   all_obstcle_shap_list);

        for(var ff=0;ff<all_obj_list.length;ff++)
        {
            var ff_obj:ObstacleOBJ = all_obj_list[ff];
            var ff_type = ff_obj.m_itype;
            var ff_pt = ff_obj.m_left_center_pt
            var ff_size = ff_obj.m_valid_size;
            var ffvalid_radius = ff_obj.m_valid_radius;

            var blast_shape = 0;
            if(ff == all_obj_list.length - 1)
            {
                blast_shape = 1;
            }

            //矩形
            if(ff_type == 1)
            {
                var ff_rc =  new cc.Rect(ff_pt.x,ff_pt.y,ff_size.width,ff_size.height);


            //  var last_end_pt_intercept_info1 = this.Caculate_Line_Intercept(last_start_rope_pt,last_end_joint_pt,ff_rc);
                var last_end_pt_intercept_info2 = this.Caculate_Line_Intercept(prev_joint_pt,last_start_rope_pt,valid_pos,ff_rc);
                if(!last_end_pt_intercept_info2[0])
                {
                    continue;
                }

                

                //判断障碍物和
                var last_pt = last_end_pt_intercept_info2[2];

                //不是同一个点，说明有障碍物隔开了
                if(InterceptUtils.Get_Distance(last_pt , valid_pos) > 10)
                {
                    last_end_pt_intercept_info2[4] = ff_obj as any;
                    return last_end_pt_intercept_info2;
                }

               
                if(last_end_pt_intercept_info2[1])
                {
                    last_end_pt_intercept_info2[4] = ff_obj as any;
                    return last_end_pt_intercept_info2;
                }

                if(blast_shape)
                {
                  
                    last_end_pt_intercept_info2[4] = ff_obj as any;
                    return last_end_pt_intercept_info2;
                }

             
            }
            else if(ff_type == 2)
            {
                var ff_radius  = new MyCicle(ff_pt,ffvalid_radius);
                var last_end_pt_intercept_info3 = this.Caculate_Circle_Intercept(ff_obj,prev_joint_pt,last_start_rope_pt,valid_pos,ff_radius);

                if(!last_end_pt_intercept_info3[0])
                {
                    continue;
                }


                if(blast_shape)
                {
                    last_end_pt_intercept_info3[4] = ff_obj as any;
                    return last_end_pt_intercept_info3;
                }

                if(last_end_pt_intercept_info3[1])
                {
                    last_end_pt_intercept_info3[4] = ff_obj as any;
                    return last_end_pt_intercept_info3;
                }
                 //判断障碍物和
                 var last_pt3 = last_end_pt_intercept_info3[2];

                 //不是同一个点，说明有障碍物隔开了
                 if(InterceptUtils.Get_Distance(last_pt3 , valid_pos) > 10)
                 {
                     last_end_pt_intercept_info3[4] = ff_obj  as any;
                     return last_end_pt_intercept_info3;
                 }
 

            }

        }

         
        for(var ff=0;ff<this.m_all_obstacle_obj_list.length;ff++)
        {
            var ff_obj :ObstacleOBJ= this.m_all_obstacle_obj_list[ff];

    
            var ff_type = ff_obj.m_itype;
            var ff_pt = ff_obj.m_left_center_pt
            var ff_size = ff_obj.m_valid_size;
            var ffvalid_radius = ff_obj.m_valid_radius;


            //矩形
            if(ff_type == 1)
            {
                var ff_rc =  new cc.Rect(ff_pt.x,ff_pt.y,ff_size.width,ff_size.height);


              //  var last_end_pt_intercept_info1 = this.Caculate_Line_Intercept(last_start_rope_pt,last_end_joint_pt,ff_rc);
                var last_end_pt_intercept_info2 = this.Caculate_Line_Intercept(prev_joint_pt,last_start_rope_pt,valid_pos,ff_rc);

                if(!last_end_pt_intercept_info2[0])
                {
                    continue;
                }

                last_end_pt_intercept_info2[4] = ff_obj as any;
                return last_end_pt_intercept_info2;
  

            }
            else if(ff_type == 2)
            {
                var ff_radius  = new MyCicle(ff_pt,ffvalid_radius);
                var last_end_pt_intercept_info3 = this.Caculate_Circle_Intercept(ff_obj,prev_joint_pt,last_start_rope_pt,valid_pos,ff_radius);

                if(!last_end_pt_intercept_info3[0])
                {
                    continue;
                }

                last_end_pt_intercept_info3[4] = ff_obj as any;
                return last_end_pt_intercept_info3;
            }
        }

 

        return [0,0,null,[]]
    }
    //鼠标按下事件
    onTouchStart(event)
    {
        //鼠标按下位置
        var pos:cc.Vec2 = this.m_bj.convertToNodeSpaceAR(event.getLocation());

        //开始建筑连接点，周边多少像素内按下为有效开始拖动绳子
        var touchmonejoint = this.Get_Touch_Move_Joint_Info();
        var joint_touch_valid_range:number = touchmonejoint.joint_touch_valid_range;


        this.m_b_start_drag = false;
        this.m_last_touchu_start_pt = pos;

        var dist_x:number = Math.abs(this.m_last_moveing_joint_pt.x - pos.x);
        var dist_y:number = Math.abs(this.m_last_moveing_joint_pt.y - pos.y);

        var bvalid:boolean = false;
        if(dist_x < joint_touch_valid_range && dist_y < joint_touch_valid_range)
        {
            bvalid = true;
        }

        //判断下是不是连接点移动到屏幕外面去了，如果是的话，就直接选中
        if(this.m_last_moveing_joint_pt.y > 660 || this.m_last_moveing_joint_pt.y  < -660 || this.m_last_moveing_joint_pt.x > 370 || this.m_last_moveing_joint_pt.x < -370)
        {
            bvalid = true;
        }


        //正在营救中,不能解除绳子
        if(this.m_rescureing_people_list.length > 0)
        {
            bvalid = false;
        }

        //不在附近区域内按下
        if(!bvalid)
        {

            if(this.m_b_rope_jointed)
            {
                this.m_b_in_rescureing = true;
                this.m_last_rescure_tick = Date.now();
            }

            return;
        }

        


        //绳子已经弄完连接上了
        this.m_b_rope_jointed = false;

        this.m_b_start_drag = true;

     
    
           //位置从上次有效的位置开始算
        this.m_last_touchu_valid_pt = this.m_last_end_joint_pt;

     
        this.m_rope_graphic_com.Reset_Touch_Start(this.m_start_joint_pt, this.m_last_touchu_valid_pt);

        this.Adjuest_Show_Move_Joint_Node();
       // this.m_move_joint_node.active = true;
       // this.m_move_joint_node.setPosition(pos);
    
    }
    //确保删除掉移动过程中的无效点,无效点包括重复点，来回移动线段，绳子不足以缠绕线点
    Check_Remvove_Middle_Center_Prev_Pt(valid_pos)
    {

        //删除圆形和矩形的来回缠绕或者重复点
        this.m_rope_graphic_com.Check_Remove_Same_RC_MulLine();
        this.m_rope_graphic_com.Check_Remove_Same_RC_Not_Absorb_Line();

        this.m_rope_graphic_com.Check_Remove_Cicle_Not_Valid_Line();

        var ballvalid = true;

        while(ballvalid)
        {
            ballvalid = false;
            var last_middle_center_prev_rope_start_pt = this.m_rope_graphic_com.GetLast_Middle_Center_Prev_Rope_Start_Pt();
            if(last_middle_center_prev_rope_start_pt)
            {
                var last_rope_start_pt=  this.m_rope_graphic_com.Get_Last_Rope_Start_Pt();
                var last_rope_obstcleinfo:ObstacleOBJ = this.m_rope_graphic_com.Get_Last_Rope_ObstacleInfo();
                var last_middle_obstcleinfo:ObstacleOBJ = this.m_rope_graphic_com.Get_Last_Middle_Center_Rope_ObstacleInfo();
    
                //判断最近的中间点是否还有效
                var bcheck_three_pt_middle_not_valid = InterceptUtils.Check_Three_Pt_Middle_PT_Not_Valid_Obstacle(last_middle_center_prev_rope_start_pt,
                    last_rope_start_pt,valid_pos,last_rope_obstcleinfo,last_middle_obstcleinfo);
    
    
                    //无效删除
                if(!bcheck_three_pt_middle_not_valid)
                {
                    this.m_rope_graphic_com.Remove_Last_Middle_Center_Pt();
                    ballvalid = true;
                } 
    
          
            }
        }
       
    }
    onTouchMove(event) 
    {
        
        if(!this.m_b_start_drag)
        {
            return;
        }

        if(this.m_enter_level == 1)
        {
            this.Add_Level_End_Tip();
        }

        //鼠标移动位置
        var pos:cc.Vec2 = this.m_bj.convertToNodeSpaceAR(event.getLocation());

        

        var valid_pos_x = (pos.x  - this.m_last_touchu_start_pt.x) + this.m_last_touchu_valid_pt.x;
        var valid_pos_y = (pos.y  - this.m_last_touchu_start_pt.y) + this.m_last_touchu_valid_pt.y;
        var src_valid_pos = new cc.Vec2(valid_pos_x,valid_pos_y)

        //绳子上次开始
        var last_start_rope_pt:cc.Vec2 = this.m_rope_graphic_com.Get_Last_Rope_Start_Pt();



        //调整下与障碍物冲突的坐标
        var first_inter_info = this.Adjuest_Last_Mouse_Pt_To_Valid_PT(src_valid_pos,last_start_rope_pt);

        var adjuest_valid_pos = src_valid_pos;
        var badjusetedpos = 0;
        if(first_inter_info[0])
        {
        
            adjuest_valid_pos = first_inter_info[1]; 
            badjusetedpos = 1;
        }
        var valid_pos = adjuest_valid_pos;

        //判断移动到这个地方有没有问题
        var check_move_pos_info = this.Check_Can_Move_to_Dest_Pos(last_start_rope_pt,this.m_last_end_joint_pt,valid_pos,badjusetedpos);


        var real_valid_pos = null; 
        var middle_center_pt = null;
        if(check_move_pos_info[0])
        {
            real_valid_pos = check_move_pos_info[2] as unknown  as cc.Vec2;

            if(check_move_pos_info[1])
            {
                //有个中转点
                var obstacle_info = check_move_pos_info[4];


                var middle_center_pt_list  = check_move_pos_info[3] as []  ;

                for(var ff=0;ff<middle_center_pt_list.length;ff++)
                {
                    var ff_m_pt  = middle_center_pt_list[ff];
                    this.m_rope_graphic_com.Add_Middle_PT(ff_m_pt,obstacle_info);
                }
               
              

            }
            else{
               
            }

            this.Check_Remvove_Middle_Center_Prev_Pt(real_valid_pos);

        }else
        {

           


            this.Check_Remvove_Middle_Center_Prev_Pt(valid_pos);


            real_valid_pos = valid_pos; 
        }

   

        this.m_rope_graphic_com.Set_Touch_Move_Pos(real_valid_pos);

        this.m_last_end_joint_pt = real_valid_pos;

        this.Adjuest_Show_Move_Joint_Node();
        //this.m_move_joint_node.active = true;
        //this.m_move_joint_node.setPosition(pos);
    }



    onTouchEnd(event) 
    {
        //鼠标松开位置
        var pos:cc.Vec2 = this.m_bj.convertToNodeSpaceAR(event.getLocation());

        var valid_pos_x = (pos.x  - this.m_last_touchu_start_pt.x) + this.m_last_touchu_valid_pt.x;
        var valid_pos_y = (pos.y  - this.m_last_touchu_start_pt.y) + this.m_last_touchu_valid_pt.y;

        
        var src_valid_pos = new cc.Vec2(valid_pos_x,valid_pos_y);

        this.m_b_in_rescureing = false;
        this.m_last_rescure_tick = 0;

        if(!this.m_b_start_drag)
        {
            return;
        }
        //绳子上次开始
        var last_start_rope_pt:cc.Vec2 = this.m_rope_graphic_com.Get_Last_Rope_Start_Pt();
        
          //调整下与障碍物冲突的坐标
          var first_inter_info = this.Adjuest_Last_Mouse_Pt_To_Valid_PT(src_valid_pos,last_start_rope_pt);

          var adjuest_valid_pos = src_valid_pos;
          var badjusetedpos = 0;
          if(first_inter_info[0])
          {
          
              adjuest_valid_pos = first_inter_info[1]; 
              badjusetedpos = 1;
          }
          var valid_pos = adjuest_valid_pos;
     
        var valid_pos = adjuest_valid_pos;
        var check_move_pos_info =  this.Check_Can_Move_to_Dest_Pos(last_start_rope_pt,this.m_last_end_joint_pt,valid_pos,badjusetedpos);


        //真实能移动到位置
        var real_valid_pos = null; 
        if(check_move_pos_info[0])
        {
            real_valid_pos = check_move_pos_info[2] as unknown as cc.Vec2;
        }else{
            real_valid_pos = valid_pos; 
        }


        //判断鼠标松开的位置是不是和结束建筑连接点附近
 

        
        // 结束连接点的有效区域range
        var end_arch_info = this.Get_Arch_End_Info();

        var joint_touch_valid_range = end_arch_info.joint_touch_valid_range;
        var joint_radius = end_arch_info.joint_radius;

        var dist_x:number = Math.abs(this.m_end_joint_pt.x - real_valid_pos.x);
        var dist_y:number = Math.abs(this.m_end_joint_pt.y - real_valid_pos.y);

        var bvalid:boolean = false;
        if(dist_x < joint_touch_valid_range && dist_y < joint_touch_valid_range)
        {
            bvalid = true;
        }

        this.m_b_start_drag = false;


        if(bvalid)
        {
            //拖动到了结束点附近
            this.m_b_rope_jointed = true;

           // var end_joint_pt = this.m_rope_graphic_com.Caculate_End_Joint_Role_Pt( this.m_end_joint_pt, joint_radius);


            this.m_rope_graphic_com.Set_Touch_End_Path_Pos(this.m_end_joint_pt);

            this.m_last_end_joint_pt = this.m_end_joint_pt;

            this.m_move_joint_node.active = false; 

            if(this.m_enter_level == 1)
            {
                this.Add_Touch_Valid_Pos_Action_Tip();
            }

        }else{

            //还在中途
            this.m_rope_graphic_com.Set_Touch_Move_Pos(real_valid_pos);
            this.m_last_end_joint_pt = real_valid_pos;

            this.Adjuest_Show_Move_Joint_Node();
        }

        
      
    }

    onTouchCancel(event) 
    {
        if(this.m_b_rope_jointed)
        {
            this.m_b_in_rescureing = false;
            this.m_last_rescure_tick = 0;
            return;
        }

      

        //鼠标移出屏幕位置
        this.m_b_start_drag = false;

        this.m_move_joint_node.active = false; 
        this.m_rope_graphic_com.ClearRope();

    }

    //更新所有的物体区域信息
    Update_Draw_Kill_OBJ(dt:number)
    {
        this.m_kill_obj_grapgic.clear(true);
        for(var ff=0;ff<this.m_all_kill_obj_list.length;ff++)
        {
            var ff_obj:KillObj = this.m_all_kill_obj_list[ff];
            ff_obj.Update_Move_Tick(dt);
            ff_obj.RedrawGrahics();
        }
        var rescuinglist=  this.m_rescureing_people_list.slice(0);
     
        for(var ff=0;ff<rescuinglist.length;ff++)
        {
            var ff_people_info:EscapePeople = rescuinglist[ff];
            ff_people_info.RedrawValidPoloyRegin(this.m_kill_obj_grapgic);
        }

        var bulletlist =  this.m_all_bullet_obj_list.slice(0);
        for(var ff=0;ff<bulletlist.length;ff++)
        {
            var ff_bullet:Bullet = bulletlist[ff];
            ff_bullet.Update_Move_Tick(dt);
            ff_bullet.RedrawValidPoloyRegin(this.m_kill_obj_grapgic);
        }
 
    }
    //判断添加子弹
    Update_Add_Kill_Bullets(dt:number)
    {
        var rescuinglist=  this.m_all_kill_obj_list.slice(0);
        var killobj_sp = cc.find("killobj/sp",this.node);
      
        for(var ff=0;ff<rescuinglist.length;ff++)
        {
            var ff_people_info:KillObj = rescuinglist[ff];
            ff_people_info.On_Update_Check_Add_Bullet(dt,this);
        }
    }

    //增加一枚子弹
    Add_Bullet_Kill_OBJ(bullet:cc.Node,movevec:cc.Vec2,movespeed:number)
    {
        var killobj_sp = cc.find("killobj/sp",this.node);
        killobj_sp.addChild(bullet,40);
     

        var pbullet = new Bullet(this,bullet,movevec);
        pbullet.SetMoveSpeed(movespeed);


        this.m_all_bullet_obj_list.push(pbullet);

    }
    //判断矩形rc是否与障碍物有交点
    Check_Bound_RC_Intercs_Obstacles(rc:cc.Rect)
    {


        for(var ff=0;ff<this.m_all_obstacle_obj_list.length;ff++)
        {
            var ff_obj :ObstacleOBJ= this.m_all_obstacle_obj_list[ff];

         
            var ff_type = ff_obj.m_itype;
            var ff_pt = ff_obj.m_left_center_pt;
            var ff_size = ff_obj.m_valid_size;
            var ff_valid_radius = ff_obj.m_valid_radius;

            //矩形
            if(ff_type == 1)
            {
                var ff_rc =  new cc.Rect(ff_pt.x,ff_pt.y,ff_size.width,ff_size.height);
 
                if(rc.intersects(ff_rc))
                {
                    return true;
                }

            }
            else if(ff_type == 2)
            {
              //  var ff_radius  = new MyCicle(ff_pt,ff_rs);
              //  var last_end_pt_intercept_info3 = this.Caculate_Circle_Intercept(prev_joint_pt,last_start_rope_pt,valid_pos,ff_radius);
 


                if(Utils.IS_RC_Intercept_Cicle(rc,ff_pt,ff_valid_radius))
                {
                    return true;
                }

            }

        }



        return false;
    }
    //删除掉已经无效的子弹
    Check_Remove_UnValid_Bullet()
    {
        var unvalid_bullet_list = [];
        var bullet_list=  this.m_all_bullet_obj_list.slice(0);
        for(var ff=0;ff<bullet_list.length;ff++)
        {
            var ff_obj:Bullet = bullet_list[ff];
            //判断有没有和其他障碍物相交的
        
            var bvalid = ff_obj.Check_IS_In_View_Range_Valid();

            if(bvalid)
            {
                var boundrc:cc.Rect = ff_obj.GetBoundRC();
                var bintersa= this.Check_Bound_RC_Intercs_Obstacles(boundrc);
      
                if(bintersa)//与其他障碍物碰撞了，子弹消失
                {
                    bvalid = false;
                }
            }


            if(!bvalid)
            {
                unvalid_bullet_list.push(ff_obj);
            }
        }



        for(var gg=0;gg<unvalid_bullet_list.length;gg++)
        {
            var gg_obj = unvalid_bullet_list[gg];

            this.On_Bullet_UnValid(gg_obj);
        }

    }



    //子弹无效后，删除子弹
    On_Bullet_UnValid(bulletobj:Bullet)
    {
        for(var ff=0;ff<this.m_all_bullet_obj_list.length;ff++)
        {
            var ff_obj:Bullet = this.m_all_bullet_obj_list[ff];
            if(bulletobj == ff_obj)
            {
                this.m_all_bullet_obj_list.splice(ff,1);
                bulletobj.DeleteSelf();
                break;
            }
            
        }

    }


    //将外面的小人加入营救列表
    Check_Add_Outer_People_To_Resure_List()
    {

        //判断是否和其他的人碰撞了
        var all_outer_people_list = this.m_all_outer_waitfor_resure_people_list.slice(0);

        var add_to_rescur_people_list = [];

        for(var ff=0;ff<all_outer_people_list.length;ff++)
        {
            var ff_people_info:EscapePeople = all_outer_people_list[ff];

            var ff_valid_rc = ff_people_info.Get_Valid_Bound_Poly_Pt_List();

            var find_in_resuring_people:EscapePeople=  null;


            for(var hh=0;hh<this.m_rescureing_people_list.length;hh++)
            {
                var hh_people_info:EscapePeople = this.m_rescureing_people_list[hh];
                var hh_valid_rc = hh_people_info.Get_Valid_Bound_Poly_Pt_List();


                if(cc.Intersection.polygonPolygon(ff_valid_rc,hh_valid_rc))
                {
                    find_in_resuring_people = hh_people_info;
                    break;
                }

            }


            if(find_in_resuring_people)
            {
                add_to_rescur_people_list.push([ff_people_info,find_in_resuring_people]);
            }
        }

        //删除掉营救的


        for(var ff=0;ff<add_to_rescur_people_list.length;ff++)
        {
            var ff_info = add_to_rescur_people_list[ff];
            var src_people_info:EscapePeople  = ff_info[0];
            var dest_collect_people_info :EscapePeople = ff_info[1];

            for(var jj=0;jj<this.m_all_outer_waitfor_resure_people_list.length;jj++)
            {
                var jj_info = this.m_all_outer_waitfor_resure_people_list[jj];
                if(src_people_info.GetID() == jj_info.GetID())
                {
                    this.m_all_outer_waitfor_resure_people_list.splice(jj,1);
                    break;
                }
            }

            src_people_info.ReInitOnAddToResure();
            dest_collect_people_info.ReInitOnAddToResure();

            var node_path_list = dest_collect_people_info.m_node_path_list;
            var people_in_role_index = dest_collect_people_info.m_people_in_role_index;
            var in_role_curve_eplse_dt = dest_collect_people_info.m_in_role_curve_eplse_dt;

            src_people_info.m_in_role_curve_eplse_dt = in_role_curve_eplse_dt;
         
         
            var rate = dest_collect_people_info.Get_In_Cuve_Rate();

            src_people_info.Set_Move_Path_Info(node_path_list,people_in_role_index);
            src_people_info.Caculate_Set_Pos(rate);

            src_people_info.SetScale(0.24, EscapeMng.GetInstance().Get_Hero());//0.15
            src_people_info.Set_Node_Animate("diao", EscapeMng.GetInstance().Get_Hero());
            this.m_rescureing_people_list.push(src_people_info);
        }


    }
    //每帧显示
    update(dt:number)
    {
        if(!this.m_b_game_inited)
        {
            return;
        }

        //将外部的小人加入营救列表
        this.Check_Add_Outer_People_To_Resure_List();
        //判断营救是不是已经结束了
        this.Check_Rescuring_End();
        //判断是否需要增加子弹
        this.Update_Add_Kill_Bullets(dt);
     
        //绘制所有物体
        this.Update_Draw_Kill_OBJ(dt);
      

        //按下鼠标营救中，是否需要把开始建筑的小人加入营救
        if(this.m_b_in_rescureing)
        {
            var ieplsetick = Date.now() - this.m_last_rescure_tick;

            var ineedtick = this.timeInterval;//400
            if(this.m_rescureing_people_list.length == 0)
            {
                ineedtick = 200;
            }

            //每1秒救一个人到绳子上
            if(ieplsetick > ineedtick)
            {
                this.Add_Start_Arch_Resureing_People_To_Rope();
            }
    
        }



        //更新营救中的小人移动显示
        var rescuinglist=  this.m_rescureing_people_list.slice(0);
        for(var ff=0;ff<rescuinglist.length;ff++)
        {
            var ff_people_info:EscapePeople = rescuinglist[ff];
            ff_people_info.Update_Tick(dt,this);
        }


        //判断小人是不是碰到炸弹，killobj等杀死
        this.Check_Kill_Escape_People();
        //删除掉所有作废的子弹
        this.Check_Remove_UnValid_Bullet();
 
    }

    //判断营救是否结束了
    Check_Rescuring_End()
    {
        if(this.m_b_game_finished)
        {
            return;
        }

        if(this.m_rescureing_people_list.length > 0)
        {
            return;
        }

        if(this.m_total_rescured_people_count >= this.m_total_need_rescur_people_count)
        {
            if(!this.m_b_game_finished)
            {
                this.m_b_game_finished = 1;
                this.scheduleOnce(this.FD_Success.bind(this),1);
            }
            
            return;
        }
        

        var ikilledobjcount = this.m_failed_people_list.length;

        var ileftvalidobj = this.m_init_all_people_count - ikilledobjcount - this.m_total_rescured_people_count;

        var bcannot_sucess = 0;

        //已经不可能营救完成了
        if(ileftvalidobj + this.m_total_rescured_people_count < this.m_total_need_rescur_people_count && this.m_rescureing_people_list.length == 0)
        {
            bcannot_sucess = 1;
         
        }

        if(this.m_total_rescured_people_count < this.m_total_need_rescur_people_count && this.m_rescureing_people_list.length == 0 && this.m_all_start_arch_waitfor_resure_people_list.length == 0)
        {
            bcannot_sucess = 1;
        }

        if(bcannot_sucess)
        {
            this.m_b_game_finished = 1;
            this.m_b_game_successed = 0;
             
            this.scheduleOnce(this.FD_Fail_Dlg.bind(this),1);

        }
    }
    //杀死小人
    Check_Kill_Escape_People()
    {
        var rescuinglist=  this.m_rescureing_people_list.slice(0);
    
        var boomb_obj_id_map =new WMap();
        var killed_obj_info = [];

         

        for(var ff=0;ff<rescuinglist.length;ff++)
        {
            var ff_people_info:EscapePeople = rescuinglist[ff];
        
            var people_poly_pt_list:cc.Vec2[] = ff_people_info.Get_Valid_Bound_Poly_Pt_List();
         
            //
            var bkilled = 0;

            for(var hh=0;hh<this.m_all_kill_obj_list.length;hh++)
            {
                var killobj:KillObj = this.m_all_kill_obj_list[hh];

                if(killobj.CanKillPeopleInRC(people_poly_pt_list))
                {
                    bkilled = 1;

                    if(killobj.CanBoomb())
                    {
                        boomb_obj_id_map.putData(killobj.GetID(),1);
                    }

                    break;
                }
            }

            for(var kk=0;kk<this.m_all_bullet_obj_list.length;kk++)
            {
                var kk_bullet:Bullet = this.m_all_bullet_obj_list[kk];

                if(kk_bullet.CanKillPeopleInRC(people_poly_pt_list))
                {
                    bkilled = 1;
                    kk_bullet.SetKilledPeople();

                    break;
                }
            }

            if(bkilled)
            {
                killed_obj_info.push({"id":ff_people_info.GetID(),"people":ff_people_info})
            }
        }


        for(var ff=0;ff<killed_obj_info.length;ff++)
        {
            var ff_info  = killed_obj_info[ff];
            var ff_id= ff_info.id;
            for(var hh=0;hh<this.m_rescureing_people_list.length;hh++)
            {
                var hh_info = this.m_rescureing_people_list[hh];
                if(hh_info.GetID() == ff_id)
                {
                    this.m_rescureing_people_list.splice(hh,1);
                    break;
                }
            }
          
            var people_obj:EscapePeople = ff_info.people;
            people_obj.DeleteSelf();
            this.m_failed_people_list.push(people_obj);

            BackGroundSoundUtils.GetInstance().PlayEffect("kill_p");
        }

        this.m_total_killed_people_count = this.m_failed_people_list.length; 

        var killobj_sp = cc.find("killobj/sp",this.node);
        
        for(var ff=0;ff<boomb_obj_id_map.size();ff++)
        {
            var ff_boomb_id = boomb_obj_id_map.GetKeyByIndex(ff);

            var find_boom_obj = null;
            for(var hh=0;hh<this.m_all_kill_obj_list.length;hh++)
            {
                var killobj:KillObj = this.m_all_kill_obj_list[hh];
                find_boom_obj = killobj;
                if(killobj.GetID() == ff_boomb_id)
                {
                    this.m_all_kill_obj_list.splice(hh,1);
                    break
                }
            }

            if(find_boom_obj)
            { 

                find_boom_obj.Boomb_Delete(killobj_sp);
            }
        }



        this.Check_Rescuring_End();

    }
    //将开始建筑的小人加入到绳子里面营救列表
    Add_Start_Arch_Resureing_People_To_Rope()
    {


        if(this.m_all_start_arch_waitfor_resure_people_list.length == 0)
        {
            return;
        }
        this.m_last_rescure_tick = Date.now();

      


        //加入resuing_peole
        var first_people_info:EscapePeople = null;
        
        
        for(var ff=0;ff<this.m_all_start_arch_waitfor_resure_people_list.length;ff++)
        {
                var ff_people:EscapePeople =  this.m_all_start_arch_waitfor_resure_people_list[ff];
                if(ff_people.Get_Start_Arch_Type_Pos_Index() == this.m_last_add_arch_start_people_resruing_type +1)
                {
                    first_people_info = ff_people;
                    this.m_all_start_arch_waitfor_resure_people_list.splice(ff,1);
                    break;
                }
        }
        if(!first_people_info)
        {
  
            for(var ff=0;ff<this.m_all_start_arch_waitfor_resure_people_list.length;ff++)
            {
                    var ff_people:EscapePeople =  this.m_all_start_arch_waitfor_resure_people_list[ff];
                    if(ff_people.Get_Start_Arch_Type_Pos_Index() == 1)
                    {
                        first_people_info = ff_people;
                        this.m_all_start_arch_waitfor_resure_people_list.splice(ff,1);
                        break;
                    }
            }

        }


        if(!first_people_info)
        {
       
            first_people_info = this.m_all_start_arch_waitfor_resure_people_list[0];
            this.m_all_start_arch_waitfor_resure_people_list.splice(0,1);
    
        }
 
        var node_path_list = this.m_rope_graphic_com.GetAll_Rope_Path_List();
        var people_in_role_index = 0;

        first_people_info.Set_Move_Path_Info(node_path_list,people_in_role_index);

        //this.m_all_start_arch_waitfor_resure_people_list.push({"id":1,"node": pnode , "info:":ff_info});

        first_people_info.SetScale(0.24, EscapeMng.GetInstance().Get_Hero());//0.15
        this.m_rescureing_people_list.push(first_people_info);
        first_people_info.Set_Node_Animate("diao", EscapeMng.GetInstance().Get_Hero());
        this.m_last_add_arch_start_people_resruing_type = first_people_info.Get_Start_Arch_Type_Pos_Index();

       
        this.Refresh_People_Rescure_Count_Info();
    }

    //营救成功后，分组显示营救的人
    ReOrder_Resuing_Success_People(bneedreanim = false)
    {
        
        var arch_end_info = this.Get_Arch_End_Info();
        var arch_success_people_pos = arch_end_info.arch_success_people_pos;

        var arch_end_pos = this.m_enter_level_config.archend.arch_pos;

        var startx = arch_success_people_pos.relative_startx + arch_end_pos[0];
        var endx = arch_success_people_pos.relative_endx + arch_end_pos[0];


        var ix1 = startx + (endx-startx)/4;
        var ix2 = startx + (endx-startx)*3/4;

 
        var iy = arch_success_people_pos.relative_y +arch_end_pos[1];

        


        //将人物分成几组，每组 per_arr_people_count人
        var per_arr_people_count = Math.floor(this.m_succesed_people_list.length/this.m_split_people_arr_count);
        if(per_arr_people_count == 0)
        {
            per_arr_people_count = 1;
        }
      
        
 
          

        for(var ff=0;ff<this.m_succesed_people_list.length;ff++)
        {

            var people :EscapePeople = this.m_succesed_people_list[ff];
            //分配在第几组
            var igroupindex =  Math.floor(ff/per_arr_people_count) + 1;
            if(igroupindex > this.m_split_people_arr_count)
            {
                igroupindex = this.m_split_people_arr_count;
            }
            //该组x起始坐标
            var igroup_start_x = startx + (endx-startx)*igroupindex/(this.m_split_people_arr_count+1);

            var in_group_index = ff - igroupindex*this.m_split_people_arr_count;
            
            var icc = in_group_index;
            if(icc >= this.m_people_union_show_count)
            {
                icc = this.m_people_union_show_count;
            }
            var ix = igroup_start_x - icc*1;



            
            people.SetPosition(ix,iy); 
           

           if(bneedreanim)
           {
               
               people.Set_Node_Animate("move", EscapeMng.GetInstance().Get_Hero());
           }

        }
    }
    //当小人成功到达终点建筑，营救成功时
    On_People_Arrive_At_End(people:EscapePeople)
    {
        var arrive_id = people.GetID();
        for(var  ff=0;ff<this.m_rescureing_people_list.length;ff++)
        {
            var ff_people:EscapePeople =  this.m_rescureing_people_list[ff];
            if(ff_people.GetID() == arrive_id)
            {
                this.m_rescureing_people_list.splice(ff,1);
                break;
            }
        }

        BackGroundSoundUtils.GetInstance().PlayEffect("suceess_rescure");

        this.m_succesed_people_list.push(people);

        var arch_end_info = this.Get_Arch_End_Info();
        var arch_success_people_pos = arch_end_info.arch_success_people_pos;

        var arch_end_pos = this.m_enter_level_config.archend.arch_pos;

        var startx = arch_success_people_pos.relative_startx + arch_end_pos[0];
        var endx = arch_success_people_pos.relative_endx + arch_end_pos[0];



        var ix = startx + (endx - startx)*this.m_succesed_people_list.length/this.m_total_need_rescur_people_count;
        var iy = arch_success_people_pos.relative_y +arch_end_pos[1];

        this.m_total_rescured_people_count++;

        people.SetPosition(ix, iy);
        people.SetScale(0.3, EscapeMng.GetInstance().Get_Hero());


        this.ReOrder_Resuing_Success_People(true);


         
        this.Refresh_People_Rescure_Count_Info();

        if(this.m_total_rescured_people_count >= this.m_total_need_rescur_people_count && this.m_rescureing_people_list.length == 0)
        {
            if(!this.m_b_game_finished)
            {
                this.m_b_game_finished = 1;
                this.scheduleOnce(this.FD_Success.bind(this),1);
            }
            
        }
    }

    onContinueBtnClick():void {
        if (cc.sys.platform == cc.sys.ANDROID) {
            //FirebaseReport.reportInformation(FirebaseKey.click_nextlevel);
            if (this.bWinBySkip) {
                this.bWinBySkip = false;
                this.FD_Success_Next();
            }
            else {
                //let bHadLoadAd = jsb.reflection.callStaticMethod("org/cocos2dx/javascript/InterstitialAdManager", "JsCall_hadLoadedAd", "()Z");
                //if (bHadLoadAd) {
                //    jsb.reflection.callStaticMethod("org/cocos2dx/javascript/InterstitialAdManager", "JsCall_showAdIfAvailable", "(Ljava/lang/String;)V",'cc["gameRun"].JavaCall_EnterNextLevel()');
                //}
                //else {
                //    this.FD_Success_Next();
                //}
                this.FD_Success_Next();
            }
            
        }
        else {
            this.FD_Success_Next();
        }
    }

    public static JavaCall_EnterNextLevel():void {
        game.getInstance().FD_Success_Next();
    }
    //营救成功,进入下一关
    FD_Success_Next(isJinru: boolean = true)
    {
        
        EscapeMng.GetInstance().On_Change_To_Next_Level();

        var ilevel:number = EscapeMng.GetInstance().Get_Last_Enter_Level();
      
        EscapeMng.GetInstance().LoadLevelConfig(ilevel,(error,pobj)=>
        {
            if(error)
            {
                console.log("关卡配置错误");
                return;
            }

            if(!pobj)
            {
                console.log("关卡配置错误");
                return;
            }

            EscapeMng.GetInstance().m_enter_level = ilevel;
            EscapeMng.GetInstance().m_enter_level_config = pobj;
            if (isJinru) {

                var func = (function () { cc.director.loadScene("game"); });
                this.OuGameAni(func);
                //cc.director.loadScene("game");
            }            
        });
    }
    //营救失败，重新开始
    FD_Failed_Next()
    {
        //cc.director.loadScene("game");
        var func = (function () { cc.director.loadScene("game"); });
        this.OuGameAni(func);
    }

    OuGameAni(func) {
        //var pseq = cc.sequence(cc.fadeTo(0.2,0), cc.callFunc(() => {
            func();
        //}));
        //this.node.runAction(pseq);
    }

    FD_Success() {
        this.m_b_game_finished = 1;
        this.m_b_game_successed = 1;

        //if (cc.sys.platform === cc.sys.ANDROID && this.m_enter_level == 1) {
        //    let playTime = (new Date).getTime() - this.timeOfFirstLevel;
        //    FirebaseReport.reportInformationWithParam(FirebaseKey.game_Level1_time, FirebaseKey.paramDurationKey, playTime);
        //}


        var self = this;
        cc.loader.loadRes("prefab/gamewin",cc.Prefab,(ee,p)=>
        {
            var pnode:cc.Node =  cc.instantiate(p as cc.Prefab);
            self.node.addChild(pnode,80);

            var gamewin = pnode.getComponent("gamewin");
            gamewin.setCallBack(this,this.onContinueBtnClick.bind(this));


            gamewin.SetInitInfo(self.m_enter_level,this.m_init_all_people_count,self.m_total_killed_people_count,self.m_total_rescured_people_count,self.m_total_need_rescur_people_count);

        });
    }
    //营救失败，弹框显示
    FD_Fail_Dlg()
    {
        this.m_b_game_finished = 1;
        this.m_b_game_successed = 0;

        //if (cc.sys.platform === cc.sys.ANDROID && this.m_enter_level == 1) {
        //    let playTime = (new Date).getTime() - this.timeOfFirstLevel;
        //    FirebaseReport.reportInformationWithParam(FirebaseKey.game_Level1_time, FirebaseKey.paramDurationKey, playTime);
        //}
        
        var self = this;
        cc.loader.loadRes("prefab/gamefail",cc.Prefab,(ee,p)=>
        {
            var pnode:cc.Node =  cc.instantiate(p as cc.Prefab);
            self.node.addChild(pnode,80);

            var gamefail = pnode.getComponent("gamefail");
            gamefail.setCallBack(this,this.FD_Failed_Next.bind(this));
            gamefail.SetInitInfo(self.m_enter_level,this.m_init_all_people_count,self.m_total_killed_people_count,self.m_total_rescured_people_count,self.m_total_need_rescur_people_count);

        });
    }
    //vpn连接成功回调
    public static JavaCall_ConnectVpnSuccess(): void {
        game.getInstance().connectVpnSuccess();
    }

    private connectVpnSuccess():void {
        vpnConnect.bConnected = true;

        //FirebaseReport.reportInformation(FirebaseKey.game_vpn_conntected);

        let tip = new cc.Node();
        let comp = tip.addComponent(cc.Label);
        comp.string = "CONNECTED";
        comp.fontSize = 40;
        tip.anchorX = 0.5;
        tip.anchorY = 0.5;
        tip.setPosition(0, 0);
        this.node.addChild(tip, 101);
        this.scheduleOnce(() => {
            tip.destroy();
        }, 1);
    }

    onDestroy() {
        console.log("game.onDestroy()");
        //隐藏banner广告
        if (cc.sys.platform == cc.sys.ANDROID) {
            jsb.reflection.callStaticMethod("org/cocos2dx/javascript/BannerAdManager", "JsCall_hideAd", "()V");
        }
    }
    //打开皮肤界面
    OnBtnSkin() {
        if (this.m_rescureing_people_list.length > 0) {
            return;
        }
        var self = this;
        cc.loader.loadRes("prefab/SkinView", cc.Prefab, (e, p) => {
            var pnode = cc.instantiate(p as cc.Prefab);
            self.node.addChild(pnode, 50);

        });
    }
    //切换显示的角色
    onUpdateHero() {
        var idx = EscapeMng.GetInstance().Get_Hero();
        for (var ff = 0; ff < this.m_all_start_arch_waitfor_resure_people_list.length; ff++) {
            var ff_people: EscapePeople = this.m_all_start_arch_waitfor_resure_people_list[ff];
            for (var i = 0; i < ff_people.m_node.childrenCount; i++) {
                ff_people.m_node.children[i].active = false;
            }
            ff_people.m_node.children[idx - 1].active = true;
        }
        this.Change_Start_Arch_Peoples_Anim("daiji")
        for (var ff = 0; ff < this.m_succesed_people_list.length; ff++) {
            var people: EscapePeople = this.m_succesed_people_list[ff];
            for (var i = 0; i < people.m_node.childrenCount; i++) {
                people.m_node.children[i].active = false;
            }
            people.m_node.children[idx - 1].active = true;
            people.SetScale(0.3, idx);
            people.Set_Node_Animate("move", idx);
        }

        //for (var i = 0; i < this.m_rescureing_people_list.length; i++) {
        //    var people: EscapePeople = this.m_succesed_people_list[ff];
        //    for (var i = 0; i < people.m_node.childrenCount; i++) {
        //        people.m_node.children[i].active = false;
        //    }
        //    people.m_node.children[idx - 1].active = true;
        //    people.SetScale(0.15, idx);
        //}
    }
}
