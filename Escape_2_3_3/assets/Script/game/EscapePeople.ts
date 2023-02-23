import InterceptUtils from "../utils/InterceptUtils";

/*
小人信息
*/

export default class EscapePeople 
{
    //人的id
    m_id:number = 0;
    //人的节点
    m_node:cc.Node =  null;
    //对应人的配置信息
    m_info  = null;

    //移动的线段列表
    m_all_curve_info_list = [];
    //移动到终点建筑的路径列表
    m_node_path_list = [];
    //人移动的时候在移动的路径点中的序号
    m_people_in_role_index:number = 0;

    //在一条线段中开始时间
 //   m_in_role_curve_start_tick = 0;

    //在一条线段中流过的时间
    m_in_role_curve_eplse_dt:number = 0;

    //由于人物本身大小尺寸不一样，所以显示的时候实际会在逻辑点的基础上加上xy的偏移，使得显示人的感觉更加切合实际
    m_x_pos_add =0;
    m_y_pos_add = -50;

    //人移动速度
    m_sepeed: number = 500;


    m_JumpSpeed: number = 0;
    m_JumpForwoard: number = 1;

    m_JumpStartX: number = 0;
    m_JumpEndX: number = 0;

    //人在开始建筑的时候，分组序号，开始建筑人分成六组显示
    m_start_arch_people_type_index:number =  0;

    constructor(ipeople_type, iid)
    {
        this.m_id = iid;

    }
    //获得开始建筑区域分组
    Get_Start_Arch_Type_Pos_Index()
    {
        return this.m_start_arch_people_type_index;
    }
    //设置开始区域人的分组
    Set_Start_Arch_Type_Pos_Index(i:number)
    {
        this.m_start_arch_people_type_index = i;
    }

    InitJump(speed: number, forward: number, startX: number, endX: number) {
        this.m_JumpSpeed = speed;
        this.m_JumpForwoard = forward;
        this.m_JumpStartX = startX;
        this.m_JumpEndX = endX;
        
    }

    JumpMove() {

        if (this.m_node.getPosition().x < this.m_JumpStartX) {
            this.m_JumpForwoard = 1;
        }
        else if (this.m_node.getPosition().x > this.m_JumpEndX) {
            this.m_JumpForwoard = -1;
        }

        var speed =  this.m_JumpSpeed *  this.m_JumpForwoard;
        this.Move_X(speed);
    }

    //x方向移动
    Move_X(imovex:number)
    {
        var srcpos = this.m_node.getPosition();

        this.m_node.setPosition(srcpos.x+imovex,srcpos.y);
    }
    //删除
    DeleteSelf()
    {
        if(this.m_node)
        {
            var pnode=  this.m_node;
            this.m_node.parent.runAction(cc.sequence(cc.delayTime(0.05),
            cc.targetedAction(pnode,  cc.moveBy(0.3,0,1000) )
            
            
            ,cc.callFunc(()=>
            {
                pnode.destroy();
            })));
            this.m_node = null;
        }        
    }



    FateDeath() {
        this.Set_Node_Animate("gongji", 2, () => {
            this.m_node.destroy();
            this.m_node = null;
        });
    }

    //绘制自身的点，正式上线不用
    Draw_Pt_List(transfer_pt_list,grphic:cc.Graphics)
    {

         for(var ff=0;ff<transfer_pt_list.length;ff++)
         {
             var ff_pt = transfer_pt_list[ff];
             if(ff== 0)
             {
                grphic.moveTo(ff_pt.x,ff_pt.y);
             }else{
                grphic.lineTo(ff_pt.x,ff_pt.y);
             }
         }

        var firstpt = transfer_pt_list[0];

        grphic.lineTo(firstpt.x,firstpt.y);
        grphic.stroke();
        
     }
     //绘制自身的点，正式上线不用
    RedrawValidPoloyRegin(grphic:cc.Graphics)
    {
        var valid_center_releative_pos = this.m_info.valid_center_releative_pos;
        var pos = this.m_node.getPosition();

        if(valid_center_releative_pos)
        {
            pos.x += valid_center_releative_pos[0];
            pos.y += valid_center_releative_pos[1];
            
        }
        var valid_w = this.m_info.valid_w ;
        var valid_h = this.m_info.valid_h + 30;
        
        var people_poly_pt_list:cc.Vec2[] = InterceptUtils.Get_Valid_Bound_Poly_Pt_List(pos, valid_w, valid_h, this.m_node.angle);
         
      
        this.Draw_Pt_List(people_poly_pt_list,grphic);

    }
    //获得id
    GetID()
    {
        return this.m_id;
    }
    //获得自身的包围盒点列表,用于与其他物体碰撞检测
    Get_Valid_Bound_Poly_Pt_List():cc.Vec2[]
    {
        var polplist = InterceptUtils.Get_Valid_Bound_Poly_Pt_List(this.m_node.getPosition(),this.m_info.valid_w,this.m_info.valid_h + 20,this.m_node.angle);
        return polplist;
    }

    TurnScale() {
        this.m_node.setScale(-1, 1);
    }

    //设置缩放比例
    SetScale(s: number, index: number = 1)
    {
        var wnode = this.m_node.getChildByName("p");//("w");
        wnode.scale  = s;
        
    }
    //设置人骨骼动画显示
    Set_Node_Animate(aniname: string, index: number = 1, endCallBack: Function = null)
    {
        var wnode = this.m_node.getChildByName("p");//("w");
        var sp_com = wnode.getComponent(sp.Skeleton);
        sp_com.setToSetupPose();
        sp_com.loop = index == 1 ? true : false;
        sp_com.setAnimation(0, "" + aniname, true);   

        if (endCallBack) {
            sp_com.setCompleteListener(endCallBack);
        }  
    }

   

    Init(pnode:cc.Node, pinfo)
    {
        this.m_node=  pnode;
        this.m_info  = pinfo;
    }
    //或者两点间的距离
    Get_Len(iroleindex:number, first_pt:cc.Vec2,second_pt:cc.Vec2)
    {
        var distance = Math.sqrt((second_pt.x-first_pt.x)*(second_pt.x-first_pt.x) + (second_pt.y-first_pt.y)*(second_pt.y-first_pt.y));
        return distance;
    }

    //设置人物坐标
    SetPosition(ix:number,iy:number)
    {        
        this.m_node.setPosition(ix,iy);
    }
    //设置人物在当前绳子线段两点间移动的比例，比如两点a,b相距100米，rate，0.3,那么移动到a到b过去30米的样子
    Caculate_Set_Pos(irate)
    {
        var first_pt = this.m_node_path_list[this.m_people_in_role_index];
        var second_pt = this.m_node_path_list[this.m_people_in_role_index+1];
        var curveinfo = this.m_all_curve_info_list[this.m_people_in_role_index];
        var len = curveinfo.len;


        var newpos = new cc.Vec2(this.m_x_pos_add +first_pt.x+  (second_pt.x- first_pt.x)*irate , this.m_y_pos_add+ first_pt.y+  (second_pt.y- first_pt.y)*irate );
      
        this.m_node.setPosition(newpos);

    }


    //获得人物在当前绳子线段两点间移位置动的比例
    Get_In_Cuve_Rate():number
    {
        if(this.m_people_in_role_index >= this.m_node_path_list.length - 1)
        {
            return 0;
        }

        var curveinfo = this.m_all_curve_info_list[this.m_people_in_role_index];
        var len = curveinfo.len;

        var iall_use_tick  = curveinfo.allsec;

       // var eplasetick = Date.now() - this.m_in_role_curve_start_tick;

       // var irate = eplasetick/(1000*iall_use_tick);

       var irate = this.m_in_role_curve_eplse_dt/iall_use_tick;
        return irate;
    }
    //加入到营救队列的时候，将角度调整为0
    ReInitOnAddToResure()
    {
        this.m_node.angle = 0;
    }
    //设置人物营救移动路径信息
    Set_Move_Path_Info(node_path_list,people_in_role_index:number)
    {
        this.m_node_path_list = node_path_list;
        this.m_people_in_role_index = people_in_role_index;
        //this.m_in_role_curve_start_tick = Date.now();

        this.m_in_role_curve_eplse_dt = 0;

        this.m_all_curve_info_list = [];
        for(var ff=0;ff<this.m_node_path_list.length-1;ff++)
        {
            var first_pt = this.m_node_path_list[ff];
            var second_pt = this.m_node_path_list[ff+1];

            var iall_len = this.Get_Len(ff,first_pt,second_pt);
            var iall_use_sec  = iall_len/this.m_sepeed;

            this.m_all_curve_info_list.push({"len":iall_len,"allsec":iall_use_sec});
        }

        this.Caculate_Set_Pos(0);

        this.Set_Node_Animate("huasheng");
    }
    //当前线段已经移动完成，切换到下一条线段
    On_Change_To_Next_Curve(parentgame,ilefttime)
    {
        this.m_people_in_role_index++;
        if(this.m_people_in_role_index >= this.m_node_path_list.length - 1)
        {
            //到达终点了
            parentgame.On_People_Arrive_At_End(this);
            return;
        }
       // this.m_in_role_curve_start_tick = Date.now();

       this.m_in_role_curve_eplse_dt = ilefttime;
        this.Caculate_Set_Pos(0);

        this.Check_Move_Time(ilefttime,parentgame);
    }

    Change_To_Add_Outer_People_Same_Rate()
    {

    }

    //控制角色向左奔跑
    Update_Run(dt: number, parentgame) {

    }
    //在每帧中移动，计算移动路径
    Update_Tick(dt:number,parentgame)
    {
         
        //在当前线段中时间
        this.m_in_role_curve_eplse_dt += dt;

        this.Check_Move_Time(dt,parentgame);

       
    }
    //实际每帧移动
    Check_Move_Time(dt:number,parentgame)
    {
        if(this.m_people_in_role_index >= this.m_node_path_list.length - 1)
        {
            return;
        }
        var curveinfo = this.m_all_curve_info_list[this.m_people_in_role_index];
        var len = curveinfo.len;

        var iall_use_tick  = curveinfo.allsec;

     
       // var eplasetick = Date.now() - this.m_in_role_curve_start_tick;


       if(this.m_in_role_curve_eplse_dt < iall_use_tick)
       {
            var irate = this.m_in_role_curve_eplse_dt/iall_use_tick;
            this.Caculate_Set_Pos(irate);
            return;
       }



        

        var ilefttime = this.m_in_role_curve_eplse_dt - iall_use_tick;

        this.On_Change_To_Next_Curve(parentgame,ilefttime);
        
    }
}