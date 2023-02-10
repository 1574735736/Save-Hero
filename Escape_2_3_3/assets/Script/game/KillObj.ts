import InterceptUtils from "../utils/InterceptUtils";
import MySprite from "../utils/MySprite";
import WMap from "../utils/WMap";
import WSize from "../utils/WSize";

import Utils from "../utils/Utils";

/*
能杀死小人的物体的信息配置

*/

export default class KillObj 
{

     m_parent_game = null;
     //id
     m_id:number = 0;

     //废弃了
     m_b_grahics = 0;
     //节点
     m_node:cc.Node =  null;


     //物体的在关卡配置中的原始信息
     m_kill_obj_src_info = null;
     //物体类型在对应的archs.json里面对应killobj节点下的对应类型的配置信息
     m_kill_obj_com_define_info = null;



     //是否为能杀死人的
     m_b_kill_obj = 0;

     //绘制grapgic
     m_gragphic:cc.Graphics = null;


    //物体是否是围绕中心点旋转
     m_b_circle_move = 0;
     //围绕中心点旋转的中心点坐标
     m_circle_move_center_pt:cc.Vec2 = null;
     //上一次的坐标点
     m_last_pt:cc.Vec2 = null;

     //如果物体能发射子弹，最近一次发射子弹的时间
     m_last_bullet_send_time:number = 0;

     //如果物体有多个发射点，每个序号对应的发射点发射子弹的时间
     m_index_last_send_bullet_time_map = new WMap();

     //1:移动到终点，2：移动到起点，3：休息
     m_manual_rotate_status = 0;
     //旋转开始时间
     m_manual_rotate_start_tick = 0;
     //旋转开始角度
     m_manual_rotate_start_angle = 0;
     //这次旋转需要的时间
     m_manual_rotate_need_sec = 0;
     //旋转每秒增加的角度
     m_manual_rotate_add_rotate_per_sec = 0;
     //旋转对应的方向
     m_manual_rotate_dest_rotation = 0;
 

     m_valid_fire_line_info_list= [];


     constructor(parentgame,id:number)
     {
         this.m_parent_game = parentgame;
         this.m_id = id;

     }

     GetID()
     {
         return this.m_id;
     }
     //炸弹类型的时候，爆炸删除自己，并且根据配置，显示一个爆炸的特效
     Boomb_Delete(parentnode:cc.Node)
     {
         if(!this.m_node)
         {
             return;
         }
         var pos = this.m_node.getPosition();

         this.m_node.destroy();
         this.m_node=  null;

         var boombinfo = this.m_kill_obj_com_define_info.boombinfo;
         if(!boombinfo)
         {
             return;
         }

         var boombpreab = boombinfo.boombpreab;
         var scale = boombinfo.scale;
         var bomb_radius = boombinfo.bomb_radius;
         //在爆炸的位置显示爆炸特效

         var self = this;
         cc.loader.loadRes(boombpreab,cc.Prefab,(er,pp)=>
         {
             var pnode=  cc.instantiate(pp as cc.Prefab);
             parentnode.addChild(pnode,55);
             pnode.setPosition(pos);
         })         
    }

     //有配置boombinfo信息，为炸弹
     CanBoomb()
     {
         if(this.m_kill_obj_com_define_info.boombinfo)
         {
             return true;
         }

         return false;
     }
     //初始化信息
     Init(b_grahics:number,pnode:cc.Node,killobj_src_info,killonj_com_define_info,kill_graphic:cc.Graphics)
     {
         this.m_b_grahics= b_grahics;
         this.m_node = pnode;
         this.m_kill_obj_src_info  = killobj_src_info;
         this.m_kill_obj_com_define_info = killonj_com_define_info;


         var killinfo = this.m_kill_obj_com_define_info.killinfo;

         this.m_b_kill_obj = 0;
         if(killinfo)
         {
            this.m_b_kill_obj  = 1;
         }

         this.m_gragphic = kill_graphic;

         this.Add_Kill_OBJ_Action();
     }
     //获得序号对应的子弹最后的发射时间
     Get_Index_Last_Bullet_Time(iindex:number)
     {
         if(this.m_index_last_send_bullet_time_map.hasKey(iindex))
         {
            var t = this.m_index_last_send_bullet_time_map.getData(iindex);
            return t;
         }

         var curtick = Date.now();
         this.m_index_last_send_bullet_time_map.putData(iindex,curtick);
         return curtick;

         
     }
     //设置序号子弹发射时间
     Set_Index_Last_Send_Bullet(iindex:number)
     {
        var curtick = Date.now();
        this.m_index_last_send_bullet_time_map.putData(iindex,curtick);
         
     }
     //能发射子弹的，试着发射子弹
     On_Update_Check_Add_Bullet(dt:number,parentgame)
     {
         if(!this.m_kill_obj_com_define_info.bullets)
         {
             return;
         }
         var bullets = this.m_kill_obj_com_define_info.bullets;


         for(var ff=0;ff<bullets.length;ff++)
         {
             var ff_bulletinfo = bullets[ff];
             var speedtime = ff_bulletinfo.speedtime;


             var last_send_bullet_time = this.Get_Index_Last_Bullet_Time(ff);

             if(Date.now() - last_send_bullet_time < speedtime*1000)
             {
                 continue;
             }


             this.Set_Index_Last_Send_Bullet(ff);
    
            this.m_last_bullet_send_time = Date.now();
    
            var config_center_parent_pt = ff_bulletinfo.center_parent_pt;
            var src_offset_pos = ff_bulletinfo.src_offset_pos;
    
            var rotation_add = ff_bulletinfo.rotation_add;
        
            if(!rotation_add)
            {
                rotation_add =0 ;
            }
            
            var parent_obj_centerpt = this.m_node.getPosition();
            var angle = this.m_node.angle;
            var degree = angle*Math.PI/180;
    
            //开始点坐标
            var start_pt = parent_obj_centerpt;
            if(config_center_parent_pt)
            {
         
                var pt1=  new cc.Vec2(config_center_parent_pt[0]+parent_obj_centerpt.x,config_center_parent_pt[1]+parent_obj_centerpt.y);
                start_pt = InterceptUtils.Tranfer_PT_Rotate_Center(pt1,parent_obj_centerpt,degree);
            }
    
    
    
            var bulet_p1:cc.Vec2 =  new cc.Vec2(src_offset_pos[0]+parent_obj_centerpt.x,src_offset_pos[1]+parent_obj_centerpt.y);
    
            //子弹开始位置
            var bullet_start_pt = InterceptUtils.Tranfer_PT_Rotate_Center(bulet_p1,parent_obj_centerpt,degree);
            //子弹角度
            var bullet_angle = angle + rotation_add; 
    
            var obj_pic = ff_bulletinfo.obj_pic;
            var obj_pic_size = ff_bulletinfo.obj_pic_size;
            var anchropt = ff_bulletinfo.anchropt;
            var movespeed = ff_bulletinfo.movespeed;
            if(!movespeed)
            {
                movespeed = 100;
            }
    
            
            var ps_bullet= new MySprite(obj_pic,obj_pic_size[0],obj_pic_size[1]);
            ps_bullet.setPosition(bullet_start_pt);
    
            if(anchropt)
            {
                ps_bullet.setAnchorPoint(anchropt[0],anchropt[1]);
            }
    
            ps_bullet.angle = bullet_angle;
          
            var movevec = new cc.Vec2(bullet_start_pt.x-start_pt.x,bullet_start_pt.y-start_pt.y )
    
            parentgame.Add_Bullet_Kill_OBJ(ps_bullet,movevec,movespeed);
         }


         

     }
     //旋转的物体，进行旋转
     Update_Rotation_Manual(dt)
     {
        if(this.m_kill_obj_src_info.rotate && this.m_manual_rotate_start_tick > 0)
        {

            var initrotation = this.m_kill_obj_src_info.initrotation;
            if(!initrotation)
            {
                initrotation = 0;
            }

            var rotate_info = this.m_kill_obj_src_info.rotate;

            var  rotateing_rate = rotate_info.rotateing_rate;
            

            var  rotate_from = rotate_info.rotate_from;
            var  rotate_to = rotate_info.rotate_to;
         
            var rotate_stay_in_topos_delay_time = rotate_info.rotate_stay_in_topos_delay_time;
        
            
            if(!rotate_stay_in_topos_delay_time)
            {
                rotate_stay_in_topos_delay_time = 0;
            }
            var d2 = Math.abs (rotate_to - rotate_from)/rotateing_rate;

            


            var eplsetick = Date.now() - this.m_manual_rotate_start_tick;
            var iall_eplse_sec=  eplsetick/1000;
            var iaddrotation = eplsetick* this.m_manual_rotate_add_rotate_per_sec/1000;

            //休息中
            if(this.m_manual_rotate_status == 3)
            {
                //移动到起点去
                if(iall_eplse_sec >= this.m_manual_rotate_need_sec)
                {
                    this.m_manual_rotate_status = 2;
                    this.m_manual_rotate_start_tick = Date.now();
                    this.m_manual_rotate_start_angle = this.m_node.angle;
    
                    var new_dest_rotaion = rotate_from;
                 
                    this.m_manual_rotate_need_sec = d2;
                    this.m_manual_rotate_add_rotate_per_sec = (new_dest_rotaion - this.m_node.angle)/d2;
                    this.m_manual_rotate_dest_rotation = new_dest_rotaion;
                }

            }else{

                var newangle = this.m_manual_rotate_start_angle + iaddrotation;

                if(iall_eplse_sec >=  this.m_manual_rotate_need_sec)
                {
                    this.m_node.angle = this.m_manual_rotate_dest_rotation;
    
    
                    if(this.m_node.angle  == rotate_to && rotate_stay_in_topos_delay_time > 0)
                    {
                        //需要停留下
                        this.m_manual_rotate_status = 3;
                  
                        this.m_manual_rotate_start_tick = Date.now();
                        this.m_manual_rotate_start_angle = this.m_manual_rotate_dest_rotation;
             
                        this.m_manual_rotate_need_sec = rotate_stay_in_topos_delay_time;
                  


                    }else{
                        this.m_manual_rotate_status = 2;
                  
                        this.m_manual_rotate_start_tick = Date.now();
                        this.m_manual_rotate_start_angle = this.m_manual_rotate_dest_rotation;
        
                        var new_dest_rotaion = rotate_from;
                        if(rotate_from == this.m_manual_rotate_dest_rotation)
                        {
                            new_dest_rotaion = rotate_to;
                            this.m_manual_rotate_status = 1;
                  
                        }
                        
                        this.m_manual_rotate_need_sec = d2;
                        this.m_manual_rotate_add_rotate_per_sec = (new_dest_rotaion - this.m_manual_rotate_dest_rotation)/d2;
                        this.m_manual_rotate_dest_rotation = new_dest_rotaion;
                    }
    
                   
    
                
    
                }
                else{
                    this.m_node.angle = newangle;
    
                }
    
            }
            
            
    
    
  

        }
     }

     //根据配置文件信息，设置物体的旋转移动，围绕中心点旋等信息
     Add_Kill_OBJ_Action()
     {
         if(!this.m_kill_obj_src_info)
         {
             return;
         }
         if(!this.m_node)
         {
             return;
         }
        if(this.m_kill_obj_src_info.rotate)
        {
            var initrotation = this.m_kill_obj_src_info.initrotation;
      
            var rotateinfo = this.m_kill_obj_src_info.rotate;


            var  rotateing_rate = rotateinfo.rotateing_rate;
            

            var  rotate_from = rotateinfo.rotate_from;
            var  rotate_to = rotateinfo.rotate_to;
            if(!initrotation)
            {
                initrotation = 0;
            }
            this.m_node.angle = initrotation;

            var rotate_stay_in_topos_delay_time = rotateinfo.rotate_stay_in_topos_delay_time;
       
            if(!rotate_stay_in_topos_delay_time)
            {
                rotate_stay_in_topos_delay_time = 0;
            }
            
            if(rotate_from != undefined && rotate_to != undefined)
            {
                //如果是有指定旋转方向的，在定时器里面变化
                var d1 = Math.abs (rotate_to - initrotation)/rotateing_rate;
                var d2 = Math.abs (rotate_to - rotate_from)/rotateing_rate;

                this.m_manual_rotate_status = 1;
                this.m_manual_rotate_start_tick = Date.now();
                this.m_manual_rotate_start_angle = initrotation;
                this.m_manual_rotate_need_sec = d1;
                this.m_manual_rotate_add_rotate_per_sec = (rotate_to - initrotation)/d1;
                this.m_manual_rotate_dest_rotation = rotate_to;
            
 


            }
            else{
                var rotation_action = cc.repeatForever(cc.rotateBy(0.1,rotateing_rate));

                this.m_node.runAction(rotation_action);
            }

         

        }

        var selfnode=  this.m_node;
        var initpos=  this.m_kill_obj_src_info.initpos;

        if(this.m_kill_obj_src_info.move)
        {
            var moveinfo = this.m_kill_obj_src_info.move;
            var  movestart = moveinfo.movestart;
            var  moveend = moveinfo.moveend;
            var  movespeed = moveinfo.movespeed;

            var  move_stay_in_topos_delay_time = moveinfo.move_stay_in_topos_delay_time;
            if(!move_stay_in_topos_delay_time)
            {
                move_stay_in_topos_delay_time = 0.01;
            }

            

            if(!movespeed)
            {
                movespeed = 100;
            }
       

            var distance = InterceptUtils.Get_Distance(new cc.Vec2(initpos[0],initpos[1]),new cc.Vec2(moveend[0],moveend[1]));
            var d1= distance/movespeed;

            var dis2 = InterceptUtils.Get_Distance(new cc.Vec2(movestart[0],movestart[1]),new cc.Vec2(moveend[0],moveend[1]));
            var d2 = dis2/movespeed;

            var firstmoveto_end = cc.moveTo(d1,moveend[0],moveend[1]);

            var moveback1 = cc.moveTo(d2,movestart[0],movestart[1]);
            var moveback2 = cc.moveTo(d2,moveend[0],moveend[1]);

           
           var pseqall = cc.sequence(firstmoveto_end ,
          
            
            cc.callFunc(()=>
           {
                var prepaet = cc.repeatForever(cc.sequence(moveback1,moveback2,  cc.delayTime(move_stay_in_topos_delay_time)));
                selfnode.runAction(prepaet);
           }) );
           selfnode.runAction(pseqall);

        }   
        else if(this.m_kill_obj_src_info.circlemove)
        {
            var circlemove_info = this.m_kill_obj_src_info.circlemove;
            this.m_b_circle_move = 1;
            this.m_circle_move_center_pt = new cc.Vec2(circlemove_info.ciclemove_centerpt[0],circlemove_info.ciclemove_centerpt[1]) ;
            this.m_last_pt = new cc.Vec2(initpos[0],initpos[1]);
       

        }

        

     }

    //每帧移动
     Update_Move_Tick(dt)
     {
         this.Update_Rotation_Manual(dt);

         if(this.m_b_circle_move)
         {
            var circlemove_info = this.m_kill_obj_src_info.circlemove;
        
             var rotateing_rate = circlemove_info.rotateing_rate*dt;

             var degree = rotateing_rate ;
             var newpt = InterceptUtils.Tranfer_PT_Rotate_Center(this.m_last_pt,this.m_circle_move_center_pt,degree);
             this.m_node.setPosition(newpt);
             this.m_last_pt = newpt;
         }


     }

     //[type:1-矩形，2：圆形,pt:矩形左上角，圆形中心点,radiusor size:矩形尺寸或者圆形半径,this]
     //返回自己的形状信息
     Get_Shape_Info()
     {
         var killinfo = this.m_kill_obj_com_define_info.killinfo;
         var valid_killtype = killinfo.valid_killtype;
         var valid_radius = killinfo.valid_radius;
         var valid_w = killinfo.valid_w;
         var valid_h = killinfo.valid_h;

         var pos = this.m_node.getPosition();


         if(valid_killtype == 1)
         {
             var leftpt = new cc.Vec2(pos.x- valid_w/2,pos.y-  valid_h/2);
             return [valid_killtype,leftpt,new WSize(valid_w,valid_h),this]; 
         }


         if(valid_killtype == 2)
         {
            return [valid_killtype,pos,valid_radius,this]; 
  
         }
         var leftpt = new cc.Vec2(pos.x- valid_w/2,pos.y-  valid_h/2);
         return [valid_killtype,leftpt,new WSize(valid_w,valid_h),this]; 
     }
     //判断是不是能遮挡射线子弹的形状，配置文件里面 shapeobj为true并且配置了killinfo的
     IS_Shape_OBJ()
     {
         if(!this.m_kill_obj_com_define_info.shapeobj)
         {
             return false;
         }

         var killinfo = this.m_kill_obj_com_define_info.killinfo;

         if(!killinfo)
         {
             return false;
         }

         return true;
     }
     //射线类型，绘制射线，小人碰到射线会死掉
     Draw_Fire_Lines()
     {
        var firelines = this.m_kill_obj_com_define_info.firelines;
        if(!firelines)
        {
            return;
        }


        var srccolor = this.m_gragphic.strokeColor;

      

        this.m_valid_fire_line_info_list= [];
        for(var ff=0;ff<firelines.length;ff++)
        {
            var ff_fireline = firelines[ff];

            var drawcolor =cc.color(247,247,247);

            if( ff_fireline.color)
            {
                drawcolor = cc.color(ff_fireline.color[0],ff_fireline.color[1],ff_fireline.color[2]);
            } 
            
            this.m_gragphic.strokeColor = drawcolor;

            var config_center_parent_pt = ff_fireline.center_parent_pt;
            var src_offset_pos = ff_fireline.src_offset_pos;
            var parent_obj_centerpt = this.m_node.getPosition();
            var angle = this.m_node.angle;

         
            var degree = angle*Math.PI/180;
    
            //开始点坐标
            var start_pt = parent_obj_centerpt;
            if(config_center_parent_pt)
            {
         
                var pt1=  new cc.Vec2(config_center_parent_pt[0]+parent_obj_centerpt.x,config_center_parent_pt[1]+parent_obj_centerpt.y);
                start_pt = InterceptUtils.Tranfer_PT_Rotate_Center(pt1,parent_obj_centerpt,degree);
            }
    
    
            var fire_p1:cc.Vec2 =  new cc.Vec2(src_offset_pos[0]+parent_obj_centerpt.x,src_offset_pos[1]+parent_obj_centerpt.y);
    
            //子弹开始位置
            var bullet_start_pt = InterceptUtils.Tranfer_PT_Rotate_Center(fire_p1,parent_obj_centerpt,degree);
            
            var fire_vec = new cc.Vec2(bullet_start_pt.x-start_pt.x,bullet_start_pt.y-start_pt.y );
 
    
            this.m_gragphic.moveTo(bullet_start_pt.x,bullet_start_pt.y);
       
            var addvec_norm = fire_vec.normalize();
    
            var iaddx = addvec_norm.x * 3000;
            var iaddy = addvec_norm.y * 3000;
 

            var all_prevenet_shap_list = this.m_parent_game.Get_All_Prevent_FireLine_Shape_Info_List();
            var endpt = new cc.Vec2(bullet_start_pt.x + iaddx,bullet_start_pt.y + iaddy);

            var minpt_info = InterceptUtils.Caculate_MinDistance_Valid_Intercept_Pt(bullet_start_pt,  addvec_norm,endpt,   all_prevenet_shap_list);
            var minpt =  minpt_info[0];
        
          
            if(minpt)
            {
                endpt = minpt;
            }else{
              
                
             
            }
            this.m_gragphic.lineTo(endpt.x,endpt.y);
           
            this.m_valid_fire_line_info_list.push({"startpt":bullet_start_pt,"endpt":endpt})

         //   console.log("bullet_start_pt="+bullet_start_pt+",endpt="+endpt);
           
            this.m_gragphic.stroke();
        }

       
        this.m_gragphic.strokeColor = srccolor;

     }

     //绘制自己的包围盒，正式上线不用
     RedrawGrahics()
     {
          

        this.Draw_Fire_Lines();
         if(!this.m_b_kill_obj)
         {
             
             return;
         }


         /*
         var killinfo = this.m_kill_obj_com_define_info.killinfo;

         var valid_killtype = killinfo.valid_killtype;
         var valid_radius = killinfo.valid_radius;
         var valid_w = killinfo.valid_w;
         var valid_h = killinfo.valid_h;

         var pos = this.m_node.getPosition();

         if(valid_killtype == 1)
         {
            var rc = this.m_node.getBoundingBox();
            this.m_gragphic.moveTo(rc.xMin,rc.yMax);
            this.m_gragphic.lineTo(rc.xMax,rc.yMax);
            this.m_gragphic.lineTo(rc.xMax,rc.yMin);
            this.m_gragphic.lineTo(rc.xMin,rc.yMin);
            this.m_gragphic.lineTo(rc.xMin,rc.yMax);
 

         }
         else if(valid_killtype == 2)
         {

            this.m_gragphic.circle(pos.x,pos.y,valid_radius);
         }
         else if(valid_killtype == 3)
         {
          
           
            var people_poly_pt_list:cc.Vec2[] = InterceptUtils.Get_Valid_Bound_Poly_Pt_List(pos, valid_w, valid_h, this.m_node.angle);
         
      
            this.Draw_Pt_List(people_poly_pt_list);

      
  

         }

         this.m_gragphic.stroke();

         */
     }
     //判断射线类型的物体，对应的射线是否能与这个多边形相交，相交的话就是可以杀死这个小人了
     Check_FireLine_Can_Kill_People( people_poly_pt_list:cc.Vec2[]):boolean
     {

        //射线是不是和用户碰撞了
        for(var ff=0;ff<this.m_valid_fire_line_info_list.length;ff++)
        {
            var ff_info = this.m_valid_fire_line_info_list[ff];
            //{"startpt":bullet_start_pt,"endpt":endpt}
            var startpt:cc.Vec2 = ff_info.startpt;
            var endpt:cc.Vec2 = ff_info.endpt;

            var bhas = cc.Intersection.linePolygon(startpt,endpt,people_poly_pt_list);

            if(bhas)
            {
                return true;
            }

        }

        return false;
     }
     //判断是否能杀死这个小人，小人的区域people_poly_pt_list
     CanKillPeopleInRC( people_poly_pt_list:cc.Vec2[]):boolean
     {
         if(this.Check_FireLine_Can_Kill_People( people_poly_pt_list))
         {
             return true;
         }


         
         if(!this.m_b_kill_obj)
         {
             return false;
         }

         var killinfo = this.m_kill_obj_com_define_info.killinfo;

         var valid_killtype = killinfo.valid_killtype;
         var valid_radius = killinfo.valid_radius;
         var valid_w = killinfo.valid_w;
         var valid_h = killinfo.valid_h;

         var pos = this.m_node.getPosition();

        
         if(valid_killtype == 1)
         {
             //节点包围盒是否与小人相交
            var rc = this.m_node.getBoundingBox();
            
            if(cc.Intersection.rectPolygon(rc,people_poly_pt_list))
            {
                return true;
            }
       
         }else if(valid_killtype== 2)
         {
             //配置的圆形区域是否与小人相交
             var bin =  cc.Intersection.polygonCircle(people_poly_pt_list,{position:pos,radius:valid_radius});
                
             return bin;
         }else if(valid_killtype== 3)
         {
              //配置的矩形区域是否与小人相交
            var kill_poly_pt_list:cc.Vec2[] = InterceptUtils.Get_Valid_Bound_Poly_Pt_List(pos, valid_w, valid_h, this.m_node.angle);
            var bin =   cc.Intersection.polygonPolygon(people_poly_pt_list,kill_poly_pt_list);
            return bin;
         }

         return false;
     }
     //绘制自身的包围盒点阵，正式上线不用
     Draw_Pt_List(transfer_pt_list)
     {

         for(var ff=0;ff<transfer_pt_list.length;ff++)
         {
             var ff_pt = transfer_pt_list[ff];
             if(ff== 0)
             {
                this.m_gragphic.moveTo(ff_pt.x,ff_pt.y);
             }else{
                this.m_gragphic.lineTo(ff_pt.x,ff_pt.y);
             }
         }

        var firstpt = transfer_pt_list[0];

         this.m_gragphic.lineTo(firstpt.x,firstpt.y);
     }

     
}