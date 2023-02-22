 
import InterceptUtils from "../utils/InterceptUtils";
import Utils from "../utils/Utils";
import ObstacleOBJ from "./ObstacleOBJ";

/*
绳子的信息graphic,绘制绳子

*/
 
const {ccclass, property} = cc._decorator;

@ccclass
export default class RopeGraphic extends cc.Component {

    graphics: cc.Graphics = null;

    //连接圈的开始位置
    m_start_joint_pt:cc.Vec2 = null;

    //连接圈的半径
    m_joint_radius:number = 0;
    //各个固定的有效坐标列表
    m_all_pt_path_list = [];

    //各个路径点固定点对应的障碍物信息列表
    m_path_dest_obstacle_info_list=  [];


    //鼠标按下移动最后有效点
    m_last_moving_pt:cc.Vec2 = null;

    //绳子最后点位置
    m_last_role_end_pt:cc.Vec2 =  null;

    //是否已经连到结束点了
    m_b_end_finished:boolean = false;


    onLoad () 
    {
        this.graphics = this.node.getComponent(cc.Graphics);
        this.m_path_dest_obstacle_info_list[0] = null;
   
    }

    //获得绳子所有连接点坐标信息
    GetAll_Rope_Path_List():cc.Vec2[]
    {
        var all_path_list:cc.Vec2[] = [];

        for(var ff=0;ff<this.m_all_pt_path_list.length;ff++)
        {
            var ff_pt:cc.Vec2 =  this.m_all_pt_path_list[ff];
            all_path_list.push(ff_pt);
        }
        all_path_list.push(this.m_last_role_end_pt);
        return all_path_list;
    }
    //绳子移动的圈的半径
    SetJointRadius(joint_radius:number)
    {
        this.m_joint_radius = joint_radius;
    }

    //是否存在于最开始点的不一样的中间点
    Has_Middle_Center_PT()
    {
        if(this.m_all_pt_path_list.length >= 2)
        {
            return true;
        }

        return false;
    }
    //删除最近的一个中间点
    Remove_Last_Middle_Center_Pt()
    {
        if(this.m_all_pt_path_list.length <  2)
        {
            return null;

        }

        var iindex=  this.m_all_pt_path_list.length-1;
        this.m_all_pt_path_list.splice(iindex,1);
        this.m_path_dest_obstacle_info_list.splice(iindex,1);
    }


    //判断，如果连续三个点都在同一个圆上，移除来回的点
    //比如 a点为开始点，b点左旋转，b到c右旋转回来又，这种情况就移除掉b点
    Check_Remove_Cicle_Not_Valid_Line()
    {
        for(var ff=0;ff<=3;ff++)
        {
            this.Once_Remove_Cicle_Same_PT_One();
            this.Once_Remove_Cicle_Same_PT_Two();
        }
        for(var ff=0;ff<=3;ff++)
        {
            this.Once_Remove_Cicle_Not_Valid_Line();
        }
    }

    //如果圆形前面两个中间点基本上是一个点，删除一个
    Once_Remove_Cicle_Same_PT_Two()
    {
        if(this.m_all_pt_path_list.length < 3)
        {
            return;
        }
        var sameobstacleinfo:ObstacleOBJ = null;
        var ballsame = 1;

        for(var ff= 0;ff<3;ff++)
        {
            var findex=  this.m_all_pt_path_list.length -ff-1;
            var ff_info  = this.m_all_pt_path_list[findex];
            var ff_obstacle = this.m_path_dest_obstacle_info_list[findex];

            if(sameobstacleinfo == null)
            {
                sameobstacleinfo = ff_obstacle;
            }

            if(sameobstacleinfo == null || sameobstacleinfo!=ff_obstacle)
            {
                ballsame = 0;
            }
        }

        
        if(sameobstacleinfo == null || !ballsame)
        {
            return;
        }

        //必须是圆形
        if(sameobstacleinfo.m_itype != 2)
        {
            return;
        }

        var pt1 = this.m_all_pt_path_list[this.m_all_pt_path_list.length - 1];
        var pt2 = this.m_all_pt_path_list[this.m_all_pt_path_list.length - 2];
        var pt3 = this.m_all_pt_path_list[this.m_all_pt_path_list.length - 3];

        if(Utils.TooNearSamePT(pt3,pt2))
        {
            var iindex=  this.m_all_pt_path_list.length-2;
            this.m_all_pt_path_list.splice(iindex,1);
            this.m_path_dest_obstacle_info_list.splice(iindex,1);
        }
    }
    //圆形上面容易加上很多完全一样的点，去掉
    Once_Remove_Cicle_Same_PT_One()
    {
        if(this.m_all_pt_path_list.length < 2)
        {
            return;
        }
        var sameobstacleinfo:ObstacleOBJ = null;
        var ballsame = 1;

        for(var ff= 0;ff<2;ff++)
        {
            var findex=  this.m_all_pt_path_list.length -ff-1;
            var ff_info  = this.m_all_pt_path_list[findex];
            var ff_obstacle = this.m_path_dest_obstacle_info_list[findex];

            if(sameobstacleinfo == null)
            {
                sameobstacleinfo = ff_obstacle;
            }

            if(sameobstacleinfo == null || sameobstacleinfo!=ff_obstacle)
            {
                ballsame = 0;
            }
        }

        
        if(sameobstacleinfo == null || !ballsame)
        {
            return;
        }

        //必须是圆形
        if(sameobstacleinfo.m_itype != 2)
        {
            return;
        }

        var pt1 = this.m_all_pt_path_list[this.m_all_pt_path_list.length - 2];
        var pt2 = this.m_all_pt_path_list[this.m_all_pt_path_list.length - 1];

        if(Utils.TooNearSamePT(pt1,pt2))
        {
            var iindex=  this.m_all_pt_path_list.length-1;
            this.m_all_pt_path_list.splice(iindex,1);
            this.m_path_dest_obstacle_info_list.splice(iindex,1);
        }

    }
   //如果圆形前面有来回绕的线段，删除掉
    Once_Remove_Cicle_Not_Valid_Line()
    {
        if(this.m_all_pt_path_list.length < 3)
        {
            return;
        }

        var sameobstacleinfo:ObstacleOBJ = null;
        var ballsame = 1;

        for(var ff= 0;ff<3;ff++)
        {
            var findex=  this.m_all_pt_path_list.length -ff-1;
            var ff_info  = this.m_all_pt_path_list[findex];
            var ff_obstacle = this.m_path_dest_obstacle_info_list[findex];

            if(sameobstacleinfo == null)
            {
                sameobstacleinfo = ff_obstacle;
            }

            if(sameobstacleinfo == null || sameobstacleinfo!=ff_obstacle)
            {
                ballsame = 0;
            }
        }

        
        if(sameobstacleinfo == null || !ballsame)
        {
            return;
        }

        //必须是圆形
        if(sameobstacleinfo.m_itype != 2)
        {
            return;
        }

        var circle_centet_pt = sameobstacleinfo.m_left_center_pt;

        var pt1 = this.m_all_pt_path_list[this.m_all_pt_path_list.length - 3];
        var pt2 = this.m_all_pt_path_list[this.m_all_pt_path_list.length - 2];
        var pt3 = this.m_all_pt_path_list[this.m_all_pt_path_list.length - 1];

        var vec1 = new cc.Vec2(pt1.x- circle_centet_pt.x,pt1.y-  circle_centet_pt.y);
        var vec2 = new cc.Vec2(pt2.x- circle_centet_pt.x,pt2.y-  circle_centet_pt.y);
        var vec3 = new cc.Vec2(pt3.x- circle_centet_pt.x,pt3.y-  circle_centet_pt.y);


        var angle1 = vec1.signAngle(vec2) *180/Math.PI;
        var angle2 = vec2.signAngle(vec3) *180/Math.PI;
       

        var bunvalid = 0;
        if(angle1 >0 && angle1 < 90)
        {
            if(angle2 > -90 && angle2 < 0)
            {
                bunvalid = 1;
            }
        }

        if(angle2 > 0 && angle2 < 90)
        {
            if(angle1 > -90 && angle1 < 0)
            {
                bunvalid = 1;
            }
        }


        if(!bunvalid)
        {
            return;
        }

        var iindex=  this.m_all_pt_path_list.length-2;
        this.m_all_pt_path_list.splice(iindex,1);
        this.m_path_dest_obstacle_info_list.splice(iindex,1);

    }
    //判断，前面两个点如果是在同一个矩形上面，如果第三个点不在矩形上面，判断矩形上面这个线段是否吸附有效
    Check_Remove_Same_RC_Not_Absorb_Line()
    {
        if(this.m_all_pt_path_list.length < 3)
        {
            return;
        }
        var sameobstacleinfo:ObstacleOBJ = null;
        var ballsame = 1;

        for(var ff= 0;ff<2;ff++)
        {
            var findex=  this.m_all_pt_path_list.length -ff-1;
            var ff_info  = this.m_all_pt_path_list[findex];
            var ff_obstacle = this.m_path_dest_obstacle_info_list[findex];

            if(sameobstacleinfo == null)
            {
                sameobstacleinfo = ff_obstacle;
            }

            if(sameobstacleinfo == null || sameobstacleinfo!=ff_obstacle)
            {
                ballsame = 0;
            }
        }

        
        if(sameobstacleinfo == null || !ballsame)
        {
            return;
        }

        //必须是矩形
        if(sameobstacleinfo.m_itype != 1)
        {
            return;
        }

        var last_pt_3 = this.m_all_pt_path_list[this.m_all_pt_path_list.length - 3];
        var obstacle_3 = this.m_path_dest_obstacle_info_list[this.m_all_pt_path_list.length - 3];
        if(obstacle_3 == sameobstacleinfo)
        {
            return;
        }
     
        var pt1 = this.m_all_pt_path_list[this.m_all_pt_path_list.length - 1];
        var pt2 = this.m_all_pt_path_list[this.m_all_pt_path_list.length - 2];

        if(Math.abs(pt1.x - last_pt_3.x) <= 5 && Math.abs(pt1.y - last_pt_3.y) <= 5)
        {
            return;
        }

        //前面两个点的线段在矩形上，再往前一个在矩形外面

        var rc = sameobstacleinfo.Get_RC();
        
        //1:左上，2：右上，3：左下。4：右下
        var edge_pt1 = InterceptUtils.Get_Edge_Pt_In_Rc_Edgetype(pt1,rc);
        var edge_pt2 = InterceptUtils.Get_Edge_Pt_In_Rc_Edgetype(pt2,rc);

        var edge_lastpt = InterceptUtils.Get_Edge_Pt_In_Rc_Edgetype(last_pt_3,rc);


        if(edge_pt1 == 0 || edge_pt2 == 0)
        {
            return;
        }

        if(edge_pt1 == edge_pt2)
        {
           
            //上次的有效点不在矩形上面
            if(edge_lastpt == 0)
            {
                var bcheck_angle_ok = InterceptUtils.Check_Edge_TwoPt_Valid(edge_pt1, rc,last_pt_3,this.m_last_role_end_pt);

                if(!bcheck_angle_ok)
                {
                    bneedremoveline = 1;
                }
            }


            //移除掉 重复点
           // var iindex=  this.m_all_pt_path_list.length-1;
            //this.m_all_pt_path_list.splice(iindex,1);
           // this.m_path_dest_obstacle_info_list.splice(iindex,1);
           var bneedremoveline = 0;

           if(edge_pt1 == 1)
           {
                if(last_pt_3.y > rc.yMax && this.m_last_role_end_pt.y > rc.yMax)
                {
                    bneedremoveline = 1;
                }
                if(last_pt_3.x < rc.xMin && this.m_last_role_end_pt.x < rc.xMin)
                {
                    bneedremoveline = 1;
                }


               

           }
           else if(edge_pt1 == 2)
           {
                if(last_pt_3.y > rc.yMax && this.m_last_role_end_pt.y > rc.yMax)
                {
                    bneedremoveline = 1;
                }
                if(last_pt_3.x > rc.xMax && this.m_last_role_end_pt.x > rc.xMax)
                {
                    bneedremoveline = 1;
                }

             


           } else if(edge_pt1 == 3)
           {
                if(last_pt_3.y < rc.yMin && this.m_last_role_end_pt.y < rc.yMin)
                {
                    bneedremoveline = 1;
                }
                if(last_pt_3.x < rc.xMin && this.m_last_role_end_pt.x  < rc.xMin)
                {
                    bneedremoveline = 1;
                }
           }else if(edge_pt1 == 4)
           {
                if(last_pt_3.y < rc.yMin && this.m_last_role_end_pt.y < rc.yMin)
                {
                    bneedremoveline = 1;
                }
                if(last_pt_3.x > rc.xMax && this.m_last_role_end_pt.x  > rc.xMax)
                {
                    bneedremoveline = 1;
                }
           }


           if(bneedremoveline)
           {
                   //移除掉最近两个点
                var iindex=  this.m_all_pt_path_list.length-2;
                this.m_all_pt_path_list.splice(iindex,2);
                this.m_path_dest_obstacle_info_list.splice(iindex,2);
            
           }else{
                var iindex=  this.m_all_pt_path_list.length-1;
                this.m_all_pt_path_list.splice(iindex,1);
                this.m_path_dest_obstacle_info_list.splice(iindex,1);
        
           }
   
       

            return;
        }


        var bneedremoveline = 0;

        if(edge_pt1 == 1)
        {
            if(edge_pt2 == 2)
            {
                if(last_pt_3.y > rc.yMax && this.m_last_role_end_pt.y > rc.yMax)
                {
                    bneedremoveline = 1;
                }
                
            }
            else if(edge_pt2 == 3)
            {
                if(last_pt_3.x < rc.xMin && this.m_last_role_end_pt.x < rc.xMin)
                {
                    bneedremoveline = 1;
                }
                
            } 
        }
        else if(edge_pt1 == 2)
        {
            if(edge_pt2 == 1)
            {
                if(last_pt_3.y > rc.yMax && this.m_last_role_end_pt.y > rc.yMax)
                {
                    bneedremoveline = 1;
                }
                
            } 
            else if(edge_pt2 == 4)
            {
                if(last_pt_3.x > rc.xMax && this.m_last_role_end_pt.x > rc.xMax)
                {
                    bneedremoveline = 1;
                }
            }
        } else if(edge_pt1 == 3)
        {
            if(edge_pt2 == 3)
            {
                if(last_pt_3.x < rc.xMin && this.m_last_role_end_pt.x < rc.xMin)
                {
                    bneedremoveline = 1;
                }
                
            } 
            else if(edge_pt2 == 4)
            {
                if(last_pt_3.y < rc.yMin && this.m_last_role_end_pt.y < rc.yMin)
                {
                    bneedremoveline = 1;
                }
                
            } 

        }
        else if(edge_pt1 == 4)
        {
            if(edge_pt2 == 3)
            {
                if(last_pt_3.y < rc.yMin && this.m_last_role_end_pt.y < rc.yMin)
                {
                    bneedremoveline = 1;
                }
                
            } 
            else if(edge_pt2 == 2)
            {
                if(last_pt_3.x > rc.xMax && this.m_last_role_end_pt.x > rc.xMax)
                {
                    bneedremoveline = 1;
                }
            }


        }
          

        if(!bneedremoveline)
        {
            return;
        }

        //移除掉最近两个点
        var iindex=  this.m_all_pt_path_list.length-2;
        this.m_all_pt_path_list.splice(iindex,2);
        this.m_path_dest_obstacle_info_list.splice(iindex,2);


    }

    //如果前面三个点都在同一个矩形上，判断有没有来回重复线的,比如在顶点左上，再到顶点右上，然后又回来顶点左上，那么就重复线了
    Check_Remove_Same_RC_MulLine()
    {
        if(this.m_all_pt_path_list.length < 3)
        {
            return;
        }

        var sameobstacleinfo = null;
        var ballsame = 1;

        for(var ff= 0;ff<3;ff++)
        {
            var findex=  this.m_all_pt_path_list.length -ff-1;
            var ff_info  = this.m_all_pt_path_list[findex];
            var ff_obstacle = this.m_path_dest_obstacle_info_list[findex];

            if(sameobstacleinfo == null)
            {
                sameobstacleinfo = ff_obstacle;
            }

            if(sameobstacleinfo == null || sameobstacleinfo!=ff_obstacle)
            {
                ballsame = 0;
            }
        }

        if(sameobstacleinfo == null || !ballsame)
        {
            return;
        }

        //必须是矩形
        if(sameobstacleinfo.m_itype != 1)
        {
            return;
        }
        
        var pt11 = this.m_all_pt_path_list[this.m_all_pt_path_list.length - 1];
        var pt12 = this.m_all_pt_path_list[this.m_all_pt_path_list.length - 3];


        var bsamept = 0;
        if(Math.abs(pt11.x - pt12.x) <= 5 && Math.abs(pt11.y - pt12.y) <= 5)
        {
            bsamept = 1;
        }

        if(!bsamept)
        {
            return;
        }


        //这里确定有重复线了，移除掉最近两个点
        var iindex=  this.m_all_pt_path_list.length-2;
        this.m_all_pt_path_list.splice(iindex,2);
        this.m_path_dest_obstacle_info_list.splice(iindex,2);


    }
    //获得倒数第二个中心点
    GetLast_Middle_Center_Prev_Rope_Start_Pt()
    {
        if(this.m_all_pt_path_list.length <  2)
        {
            return null;

        }
        var midlept = this.m_all_pt_path_list[this.m_all_pt_path_list.length - 2];
   
        return midlept;
    }

    //获得倒数第二个中心点对应所在的障碍物信息
    Get_Last_Middle_Center_Rope_ObstacleInfo()
    {
        if(this.m_all_pt_path_list.length <  2)
        {
            return null;

        }
        var objinfo  = this.m_path_dest_obstacle_info_list[this.m_all_pt_path_list.length - 2];
   
        return objinfo;
    }

    //最后一个中间点对应的障碍物信息
    Get_Last_Rope_ObstacleInfo()
    {
        var objinfo = this.m_path_dest_obstacle_info_list[this.m_all_pt_path_list.length - 1];
   
        return objinfo;
    }
    //获得最后一个中间点坐标
    Get_Last_Rope_Start_Pt():cc.Vec2
    {
        var startpos = this.m_all_pt_path_list[this.m_all_pt_path_list.length - 1];
   
        return startpos;
    }
    //添加中间点和中间点对应的障碍物信息
    Add_Middle_PT(middlept:cc.Vec2,obstacle_info)
    {
        this.m_all_pt_path_list.push(middlept);
        this.m_path_dest_obstacle_info_list[this.m_all_pt_path_list.length-1] = obstacle_info;

    }
    //计算在最后的连接点的时候，绳子的最后连接位置
    Caculate_End_Joint_Role_Pt( end_joint_pt:cc.Vec2, joint_radius:number):cc.Vec2
    {
        var startpos = this.m_all_pt_path_list[this.m_all_pt_path_list.length - 1];
        var endpos = end_joint_pt;
        //距离太近了，直接返回
        if(Math.abs(startpos.x - endpos.x) <= 3 && Math.abs(startpos.y - endpos.y) <= 3)
        {
            return endpos;
        }
        //偏移向量
        var vec1:cc.Vec2 = new cc.Vec2(endpos.x - startpos.x,endpos.y - startpos.y);
        //规整化
        vec1.normalizeSelf();


        var range = joint_radius;
        var descvec = new cc.Vec2(range*vec1.x,range*vec1.y);

        var newx = endpos.x - descvec.x;
        var newy = endpos.y - descvec.y;
        
        return new cc.Vec2(newx,newy);

    }


    //计算出来移动的时候。跟随的圈应该显示的位置
    Caculate_Move_Joint_Pt(joint_radius:number):cc.Vec2
    {
        return this.m_last_moving_pt;
        /*
        //最后一段绳子的开始和结束位置,计算出圈圈应该显示的位置
        var startpos = this.m_all_pt_path_list[this.m_all_pt_path_list.length - 1];
        var endpos = this.m_last_moving_pt;

        //距离太近了，直接返回
        if(Math.abs(startpos.x - endpos.x) <= 3 && Math.abs(startpos.y - endpos.y) <= 3)
        {
            return endpos;
        }

        //偏移向量
        var vec1:cc.Vec2 = new cc.Vec2(endpos.x - startpos.x,endpos.y - startpos.y);
        //规整化
        vec1.normalizeSelf();


        var range = joint_radius;
        var descvec = new cc.Vec2(range*vec1.x,range*vec1.y);

        var newx = endpos.x + descvec.x;
        var newy = endpos.y + descvec.y;
       
    

        return new cc.Vec2(newx,newy);
        */
    }


    //重新画线,绘制绳子
    ReDrawRopeLines()
    {
        this.graphics.clear(true);

        if(this.m_b_end_finished)
        {
            this.graphics.strokeColor = cc.color(0,255,0)
        }
        else {
            this.graphics.strokeColor = cc.color(255,215,0);
        }
       
        this.graphics.moveTo(this.m_all_pt_path_list[0].x,this.m_all_pt_path_list[0].y);

        var prev_type =  0;
        var prev_obstcle =  null;
        var prev_pt=  null;

        
        for(var ff=1;ff<this.m_all_pt_path_list.length;ff++)
        {
            var ff_pt:cc.Vec2 = this.m_all_pt_path_list[ff];

            //障碍物信息
            var ff_obstacle_info:ObstacleOBJ = this.m_path_dest_obstacle_info_list[ff];
            var objtype = ff_obstacle_info.m_itype;

            var bdrawcircle=  false;
            if(objtype == 1)
            {
                //矩形
                bdrawcircle = false;
            }
            else if(objtype == 2)//圆形
            {
                //同一个圆形上面
                if(prev_type == 2 && prev_obstcle == ff_obstacle_info)
                {
                    bdrawcircle=  true;
                }

            }

         
           

            //绘制圆弧
            if(bdrawcircle)
            {
                var cicle_centerpt = ff_obstacle_info.m_left_center_pt;
                var cicle_radius = ff_obstacle_info.m_valid_radius+ 4;

 


                var startvec1=  new cc.Vec2(1,0);
                var newpt1 =  new cc.Vec2(prev_pt.x - cicle_centerpt.x,prev_pt.y - cicle_centerpt.y);
                var newpt2 =  new cc.Vec2(ff_pt.x - cicle_centerpt.x,ff_pt.y - cicle_centerpt.y);
                
                var startAngle = startvec1.signAngle(newpt1);
                var endAngle = startvec1.signAngle(newpt2);

                var ang1= startAngle;
                var ange2 = endAngle;
                var bfx =  InterceptUtils.FLineLeft(  cicle_centerpt,   prev_pt,   ff_pt)  

 
                this.graphics.arc(cicle_centerpt.x, cicle_centerpt.y,cicle_radius, ang1, ange2,bfx);		

                

            }else{
                this.graphics.lineTo(ff_pt.x,ff_pt.y);
            }
            
            prev_type = objtype;
            prev_obstcle = ff_obstacle_info;
            prev_pt = ff_pt;

        }


        //最后一个点

        //最后一个点在圆上，我们判断下最后的这个点是不是也要画圆形才合理
        var bdrawlast_circle=  0;
        if(prev_type == 2 && prev_obstcle != null && prev_obstcle.m_itype == 2 && prev_pt)
        {
            var cicle_radius_last = prev_obstcle.m_valid_radius;
            var cicle_centerpt_last = prev_obstcle.m_left_center_pt;
         
            if( (InterceptUtils.Get_Distance(cicle_centerpt_last,this.m_last_role_end_pt) < cicle_radius_last + 11)
            
                && (InterceptUtils.Get_Distance(prev_pt,this.m_last_role_end_pt)  > 25 )
            )
            {
                bdrawlast_circle=  1;
            }

        }


        if(bdrawlast_circle)
        {
            var cicle_centerpt2 = prev_obstcle.m_left_center_pt;
            var cicle_radius2 = prev_obstcle.m_valid_radius+ 4;




            var startvec2 =  new cc.Vec2(1,0);
            var newpt6 =  new cc.Vec2(prev_pt.x - cicle_centerpt2.x,prev_pt.y - cicle_centerpt2.y);
            var newpt7 =  new cc.Vec2(this.m_last_role_end_pt.x - cicle_centerpt2.x,this.m_last_role_end_pt.y - cicle_centerpt2.y);
            
            var startAngle3 = startvec2.signAngle(newpt6);
            var endAngle4 = startvec2.signAngle(newpt7);

            var ang7= startAngle3;
            var ange8  = endAngle4;
            var bfx2 =  InterceptUtils.FLineLeft(  cicle_centerpt2,   prev_pt,   this.m_last_role_end_pt)  


            this.graphics.arc(cicle_centerpt2.x, cicle_centerpt2.y,cicle_radius2, ang7, ange8,bfx2);		
        }
        else{
            this.graphics.lineTo(this.m_last_role_end_pt.x,this.m_last_role_end_pt.y);

        }



     



        this.graphics.stroke();

 



    }
    //重新开始按下画线
    Reset_Touch_Start(startjointpt:cc.Vec2, toush_pos:cc.Vec2)
    {
        this.m_start_joint_pt = startjointpt;
      
        this.m_b_end_finished = false;

        if(this.m_all_pt_path_list.length == 0)
        {
            this.m_all_pt_path_list.push(startjointpt);
        }
 



        this.m_last_moving_pt =  toush_pos;
        
        this.m_last_role_end_pt = this.Caculate_End_Joint_Role_Pt(toush_pos,this.m_joint_radius) ;




        this.ReDrawRopeLines();
        /*
        this.graphics.moveTo(startjointpt.x,startjointpt.y);
        this.graphics.lineTo(toush_pos.x,toush_pos.y);
        this.graphics.stroke();
        */
      
    }
    //鼠标移动画线
    Set_Touch_Move_Pos(move_pos:cc.Vec2)
    { 
        this.m_last_moving_pt = move_pos;
        this.m_last_role_end_pt = this.Caculate_End_Joint_Role_Pt(move_pos,this.m_joint_radius) ;

        this.ReDrawRopeLines();

        /*
        this.graphics.moveTo(this.m_start_joint_pt.x,this.m_start_joint_pt.y);
        this.graphics.lineTo(move_pos.x,move_pos.y);
        this.graphics.stroke();
        */
    }
    //清空数据
    ClearRope()
    {
        this.graphics.clear(true);
        this.m_all_pt_path_list = [];
   
    }

    //鼠标松开最后的路径点
    Set_Touch_End_Path_Pos(pos:cc.Vec2)
    {
        this.m_last_moving_pt = pos;

        this.m_last_role_end_pt = this.Caculate_End_Joint_Role_Pt(pos,this.m_joint_radius) ;

        this.m_b_end_finished = true;
        this.ReDrawRopeLines();

    }
}
