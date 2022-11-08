import ObstacleOBJ from "../game/ObstacleOBJ";
import InterceptUtils from "./InterceptUtils";
import MyCicle from "./MyCicle";
import Utils from "./Utils";

export default class EscapeCacu 
{


    //判断点与圆是否相交
    //[是否相交，相交调整位置]
    static Check_Valid_Pt_Inter_With_Cicle(valid_pos:cc.Vec2,last_start_rope_pt:cc.Vec2, cicle:MyCicle,last_q_radius:number)
    {
        var circle_center_pt = cicle.m_center_pt;
        var circle_radius = cicle.m_radius;

   
        //首先，判断圆和连接点是不是相交
        var distance_joint = Math.sqrt( (valid_pos.x-  circle_center_pt.x)* (valid_pos.x-  circle_center_pt.x) + 
            (valid_pos.y-  circle_center_pt.y)* (valid_pos.y-  circle_center_pt.y) );

        

        //调整过后，圆球所在的位置
        var adjuested = 0;
        var adjuest_newpint = valid_pos;
        //相交接近
        if(distance_joint < last_q_radius + circle_radius)
        {
            var reversevec=  new cc.Vec2(valid_pos.x - circle_center_pt.x,valid_pos.y- circle_center_pt.y );
            reversevec.normalizeSelf();

            var addvec = new cc.Vec2(reversevec.x *(last_q_radius + circle_radius) ,reversevec.y *(last_q_radius + circle_radius)     );

            var newvalidpos = new cc.Vec2(addvec.x + circle_center_pt.x,addvec.y+circle_center_pt.y);
            adjuest_newpint = newvalidpos;
            adjuested = 1;
        }

        return [adjuested,adjuest_newpint];
    }
    //判断点与矩形是否相交
    //[是否相交，相交调整位置]
    static Check_Valid_Pt_Inter_With_RC(valid_pos:cc.Vec2,last_start_rope_pt:cc.Vec2,rc:cc.Rect,radius:number)
    {




        var realendpt=  valid_pos;
        //首先，判断这个圈圈是否已经和矩形相交了
        var end_real_use_pt = null;

        //首先，判断是与x还是y距离最近
        var min_x1  = realendpt.x - (rc.xMin - radius ) ;
        var min_x2 =  rc.xMax + radius - realendpt.x;

        var min_y1  = realendpt.y - (rc.yMin - radius ) ;
        var min_y2 =   rc.yMax + radius - realendpt.y;


    


        if(realendpt.x - radius < rc.xMin && realendpt.x + radius > rc.xMin )
        {
            
            if(realendpt.y - radius < rc.yMin && realendpt.y + radius > rc.yMin )
            {
                    //左下角点,两个都小于才处理
                //x方向靠的更加近
                if(min_x1 > min_y1)
                {
                    end_real_use_pt = new cc.Vec2(rc.xMin - radius,realendpt.y);
                }else{
                    //y方向靠的更加近
                    end_real_use_pt = new cc.Vec2(realendpt.x,rc.yMin -radius);
                }


            } 
            else if(realendpt.y + radius> rc.yMax && realendpt.y - radius < rc.yMax )
            {

                    //x方向靠的更加近
                    if(min_x1 > min_y2)
                    {
                        end_real_use_pt = new cc.Vec2(rc.xMin - radius,realendpt.y);
                    }else{
                        //y方向靠的更加近
                        end_real_use_pt = new cc.Vec2(realendpt.x,rc.yMax+ radius);
                    }
            }
            else if(realendpt.y >= rc.yMin - radius && realendpt.y < rc.yMax + radius)
            {
                end_real_use_pt = new cc.Vec2(rc.xMin - radius,realendpt.y);
            }
        }


        if(realendpt.x + radius > rc.xMax && realendpt.x - radius < rc.xMax )
        {
            if(realendpt.y - radius < rc.yMin && realendpt.y + radius > rc.yMin )
            {
                //x方向靠的更加近
                if(min_x2 > min_y1)
                {
                    end_real_use_pt = new cc.Vec2(rc.xMax - radius,realendpt.y);
                }else{
                    //y方向靠的更加近
                    end_real_use_pt = new cc.Vec2(realendpt.x,rc.yMin - radius);
                }
            } 
            else if(realendpt.y + radius> rc.yMax && realendpt.y - radius < rc.yMax )
            {

                //x方向靠的更加近
                if(min_x2 > min_y2)
                {
                    end_real_use_pt = new cc.Vec2(rc.xMax - radius,realendpt.y);
                }else{
                    //y方向靠的更加近
                    end_real_use_pt = new cc.Vec2(realendpt.x,rc.yMax+ radius);
                }
            }
            else if(realendpt.y >= rc.yMin - radius && realendpt.y < rc.yMax + radius)
            {
                end_real_use_pt = new cc.Vec2(rc.xMax + radius,realendpt.y);
            }
        }




        if(realendpt.y - radius < rc.yMin && realendpt.y + radius > rc.yMin && !end_real_use_pt )
        {
            if(realendpt.x >= rc.xMin - radius && realendpt.x < rc.xMax + radius)
            {
                end_real_use_pt = new cc.Vec2(realendpt.x,rc.yMin - radius);
            }
        }

        if(realendpt.y + radius> rc.yMax && realendpt.y - radius < rc.yMax && !end_real_use_pt)
        {
            if(realendpt.x >= rc.xMin - radius && realendpt.x < rc.xMax + radius)
            {
                end_real_use_pt = new cc.Vec2(realendpt.x,rc.yMax + radius);
            }
        }


        if(end_real_use_pt)
        {
            return [1,end_real_use_pt];
        }
        
        //点在矩形内
        if(rc.contains(valid_pos))
        {
            //首先，获得矩形和射线的
            var rc_xcenter = rc.xMin + (rc.xMax -  rc.xMin)/2
            var rc_ycenter = rc.yMin + (rc.yMax -  rc.yMin)/2
 
        

            if(last_start_rope_pt.x <= rc.xMin && last_start_rope_pt.y >= rc.yMax)
            {
                end_real_use_pt = new cc.Vec2(realendpt.x,rc.yMax + radius);
            }
            else if(last_start_rope_pt.x <= rc.xMin && last_start_rope_pt.y <= rc.yMin)
            {
                end_real_use_pt = new cc.Vec2(realendpt.x,rc.yMin - radius);
            }
            else if(last_start_rope_pt.x <= rc.xMin && last_start_rope_pt.y >= rc.yMin && last_start_rope_pt.y <= rc.yMax)
            {
                end_real_use_pt = new cc.Vec2(rc.xMin - radius,realendpt.y);
            }
            else if(last_start_rope_pt.x >= rc.xMax && last_start_rope_pt.y >= rc.yMax)
            {
                end_real_use_pt = new cc.Vec2(realendpt.x,rc.yMax + radius);
            }
            else if(last_start_rope_pt.x >= rc.xMax && last_start_rope_pt.y <= rc.yMin)
            {
                end_real_use_pt = new cc.Vec2(realendpt.x,rc.yMin - radius);
            }
            else if(last_start_rope_pt.x >= rc.xMax && last_start_rope_pt.y >= rc.yMin && last_start_rope_pt.y <= rc.yMax)
            {
                end_real_use_pt = new cc.Vec2(rc.xMax + radius,realendpt.y);
            }
            else if(last_start_rope_pt.y >= rc.yMax && last_start_rope_pt.x >= rc.xMin && last_start_rope_pt.x <= rc.xMax)
            {
                end_real_use_pt = new cc.Vec2(realendpt.x,rc.yMax + radius);

            }else if(last_start_rope_pt.y <= rc.yMin && last_start_rope_pt.x >= rc.xMin && last_start_rope_pt.x <= rc.xMax)
            {
                end_real_use_pt = new cc.Vec2(realendpt.x,rc.yMin  - radius);

            }


            if(end_real_use_pt)
            {
                return [1,end_real_use_pt];
            }

            /*
            //1:左上，2：右上，3：左下。4：右下
            //上次绳子开始点是否在矩形的四个顶点上

            var last_rope_in_rc_edge= InterceptUtils.Get_Edge_Pt_In_Rc_Edgetype(last_start_rope_pt,rc) ;

            if(valid_pos.x < rc_xcenter && valid_pos.y > rc_ycenter)
            {
                
                end_real_use_pt = new cc.Vec2(realendpt.x,rc.yMax + radius);




            }
            else if(valid_pos.x < rc_xcenter && valid_pos.y < rc_ycenter)
            {
                end_real_use_pt = new cc.Vec2(realendpt.x,rc.yMin - radius);

                
            }
            else if(valid_pos.x > rc_xcenter && valid_pos.y > rc_ycenter)
            {
                end_real_use_pt = new cc.Vec2(rc.xMax,rc.y);
            }
            else if(valid_pos.x > rc_xcenter && valid_pos.y < rc_ycenter)
            {
                end_real_use_pt = new cc.Vec2(rc.xMax,rc.y);
            }

            
            if(last_rope_in_rc_edge == 1)
            {
                end_real_use_pt = new cc.Vec2(realendpt.x,rc.yMax + radius);
            } 
            else if(last_rope_in_rc_edge == 2)
            {
                end_real_use_pt = new cc.Vec2(realendpt.x,rc.yMax + radius);
            }
            else if(last_rope_in_rc_edge == 3)
            {
                end_real_use_pt = new cc.Vec2(realendpt.x,rc.yMin - radius);
            }
            else if(last_rope_in_rc_edge == 4)
            {
                end_real_use_pt = new cc.Vec2(realendpt.x,rc.yMin - radius);
            }

            //var rc_pol_pt_list = Utils.Get_RC_PolyPtList(rc);


            //var vec1=  new cc.Vec2(valid_pos.x - last_start_rope_pt.x,valid_pos.y-last_start_rope_pt.y);
            //var fxvec_norm = vec1.normalize();
           // var min_pt1:cc.Vec2 =    InterceptUtils.Get_PolyPtList_Intercept_Line_Min_Disntance_PT(last_start_rope_pt,fxvec_norm,rc_pol_pt_list );


            if(end_real_use_pt)
            {
                return [1,end_real_use_pt];
            }
            */


            //连线交点

            /*
            if(!min_pt1)
            {
                var adpt1 =  new cc.Vec2(rc.xMin - radius,valid_pos.y);
                return [1,adpt1];
            }

            if(min_pt1.x == rc.xMin)
            {
                var adpt2 =  new cc.Vec2(rc.xMin - radius,min_pt1.y);
                return [1,adpt2];
            }
      
            if(min_pt1.x == rc.xMax)
            {
                var adpt3 =  new cc.Vec2(rc.xMax + radius,min_pt1.y);
                return [1,adpt3];
            }

            if(min_pt1.y == rc.yMin)
            {
                var adpt4 =  new cc.Vec2(min_pt1.x,rc.yMin-radius);
                return [1,adpt4];
            }

            if(min_pt1.y == rc.yMax)
            {
                var adpt5 =  new cc.Vec2(min_pt1.x,rc.yMax + radius);
                return [1,adpt5];
            }

            */

        }

        return [0,null]
    }


    //返回用户鼠标位置和障碍物相交信息 
    //[是否相交，相交调整位置]
    static Check_Valid_Pt_Inter_With_Shape_List(valid_pos:cc.Vec2,last_start_rope_pt:cc.Vec2,all_obstcle_shap_list )
    {
        var bintercept = 0;
        var inter_ajuest_pt = null;
        //到圈的终点的线段
        var realendpt = valid_pos;

        var last_q_radius = 21;
        var intercept_obstacle_info= null;

        for(var ff=0;ff<all_obstcle_shap_list.length;ff++)
        {
            var ff_info =  all_obstcle_shap_list[ff];

            var ff_type = ff_info[0];
            var ff_pt = ff_info[1];
            var ff_radius_size = ff_info[2];
            var ff_obj = ff_info[3];

            //矩形
            if(ff_type == 1)
            {
                var ff_rc =  new cc.Rect(ff_pt.x,ff_pt.y,ff_radius_size.width,ff_radius_size.height);

                var inter_info = EscapeCacu.Check_Valid_Pt_Inter_With_RC(valid_pos,last_start_rope_pt,ff_rc,last_q_radius);

                if(inter_info[0])
                {
                    bintercept = 1;
                    inter_ajuest_pt = inter_info[1];
                    intercept_obstacle_info = ff_info;
                    break;
                }
                
 

            }
            else if(ff_type == 2)
            {
                var ff_cicle  = new MyCicle(ff_pt,ff_radius_size);
                var inter_info_cicle = EscapeCacu.Check_Valid_Pt_Inter_With_Cicle(valid_pos,last_start_rope_pt,ff_cicle,last_q_radius);
                if(inter_info_cicle[0])
                {
                    bintercept = 1;
                    inter_ajuest_pt = inter_info_cicle[1];
                    intercept_obstacle_info = ff_info;
                    break;
                }
            }
 
        }


        return [bintercept,inter_ajuest_pt,intercept_obstacle_info];
    }


    //圆形中障碍物信息列表all_obstcle_shap_list,绳子上次开始点last_start_rope_pt，prev_joint_pt上次鼠标移动有效计算的点，valid_pos当前鼠标移动点
    //返回【是否相交 ,  是否生成中间点，相交点，中间点 , 相交点对应的障碍物】
    static Caculate_Can_Move_to_Dest_Pos(all_obstcle_shap_list ,last_start_rope_pt:cc.Vec2,prev_joint_pt:cc.Vec2,src_valid_pos:cc.Vec2,
        last_middle_center_prev_rope_start_pt:cc.Vec2)
    {
         //valid_pos:圈圈最新位置,prev_joint_pt:上次圈圈位置,last_start_rope_pt:绳子上次起始点
         var vec1 = new cc.Vec2(src_valid_pos.x- last_start_rope_pt.x,src_valid_pos.y-  last_start_rope_pt.y);

         //距离太近，认为可以直接移动连线
         if(Math.abs(vec1.x ) <=0.1 && Math.abs(vec1.y) <= 0.1)
         {
             return [0,0,new cc.Vec2(0,0),new cc.Vec2(0,0)];
         }


         //相交信息
        var first_inter_info = EscapeCacu.Check_Valid_Pt_Inter_With_Shape_List(src_valid_pos ,last_start_rope_pt ,all_obstcle_shap_list );

        //valid_pos调整为鼠标最终使用的位置，因为如果鼠标到了圆形中间，必须要调整以使得鼠标点不在障碍物里面
        var valid_pos = src_valid_pos;
        var start_adjuest = 0;
        if(first_inter_info[0])
        {
            start_adjuest = 1;
            valid_pos = first_inter_info[1];
        }


        //最后的拖动的圈的半径,由于圈圈本身很小21像素，我们配置的时候障碍物之间距离远大于障碍物的半径，所以可以认为圈圈同时在两个障碍物相碰的可能性不存在
        var iradius = 21;

         

        var addvec = new cc.Vec2(valid_pos.x-  last_start_rope_pt.x,valid_pos.y- last_start_rope_pt.y);
        var addvec_norm = addvec.normalize();

 
    

        var minpt_intercept_ionfo = InterceptUtils.Caculate_MinDistance_Valid_Intercept_Pt(last_start_rope_pt,  addvec_norm ,valid_pos,   all_obstcle_shap_list);
        var minpt = minpt_intercept_ionfo[0];
        var min_obj:ObstacleOBJ  = minpt_intercept_ionfo[1];



        //最近的交点
        if(minpt != null)
        {
          
            //首先，判断这个交点是否在线段上
            var ilen  = addvec.len();
            var checklen = ilen + iradius;

            var min_pt_add_vec = new cc.Vec2(minpt.x- last_start_rope_pt.x,minpt.y-  last_start_rope_pt.y );
            var min_pt_len = min_pt_add_vec.len();
        

            //最近的连接点都在线段外
            if(min_pt_len > checklen)
            {
                minpt = null;
            }
           // return [1,0,minpt,new cc.Vec2(0,0),min_obj];
        }

       
        //没有相交的点
        if(minpt == null)
        {
            if(first_inter_info[0])
            {
                return [1,0,first_inter_info[1],null,null];
            }
            return [0,0,null,null,null];
        }


        //首先，判断

        if(min_obj.m_itype == 2)
        {
            //交点为圆形
            var circle_center_pt = min_obj.m_left_center_pt;
            var circle_radius = min_obj.m_valid_radius;
    
            var ropeinfo = EscapeCacu.Caculate_Cicle_Move_to_Dest_Pos_Ajuest_Rope_Info(circle_center_pt,circle_radius,
                all_obstcle_shap_list ,last_start_rope_pt,prev_joint_pt,valid_pos,minpt,last_middle_center_prev_rope_start_pt);

            if(ropeinfo[0])
            {
                ropeinfo[4] = min_obj as any;
                return ropeinfo;
            }
 
           
        }
        




        var add_vec_5 = new cc.Vec2(minpt.x- last_start_rope_pt.x,minpt.y- last_start_rope_pt.y);
        var add_vec_5_norm = add_vec_5.normalize();
        var add_len5 = add_vec_5.len();

    
        var vec5_mid_x = (add_len5 - iradius)*add_vec_5_norm.x;
        var vec5_mid_y = (add_len5 - iradius)*add_vec_5_norm.y;

        var newpt1 = new cc.Vec2(last_start_rope_pt.x+vec5_mid_x,last_start_rope_pt.y+vec5_mid_y);

        //相交信息
        var second_inter_info = EscapeCacu.Check_Valid_Pt_Inter_With_Shape_List(newpt1 ,last_start_rope_pt ,all_obstcle_shap_list );
        if(second_inter_info[0])
        {
            var second_adjuestpt = second_inter_info[1];
            return [1,0,second_adjuestpt,new cc.Vec2(0,0),min_obj];

        }

         
        //有相交的点
        return [1,0,newpt1,new cc.Vec2(0,0),min_obj];



       // return [0,0,null,null,null];

    }
    static Caculate_Cicle_Move_to_Dest_Pos_Ajuest_Rope_Info(circle_center_pt:cc.Vec2,circle_radius:number,
        all_obstcle_shap_list ,last_start_rope_pt:cc.Vec2,prev_joint_pt:cc.Vec2,valid_pos:cc.Vec2,min_interpt:cc.Vec2,last_middle_center_prev_rope_start_pt:cc.Vec2)
    {

        var adjuest_newpint = valid_pos;
          //首先，判断下，上次连接点是不是就在圆形上面啊
          var distance_last_role_pt = Math.sqrt(InterceptUtils.Get_Distance_Mul(last_start_rope_pt,circle_center_pt));
    
    
          //是否上次连接点就在圆形上
          var blast_role_in_cicle=  0;
          if(Math.abs(distance_last_role_pt - circle_radius) < 7)
          {
              blast_role_in_cicle  =1;
          }

          if(blast_role_in_cicle)
          {
              //上次的链接点在这个圆形上,
  
              //判断方向是往圆内还是圆外
  
              var vec_out1 = new cc.Vec2(last_start_rope_pt.x-  circle_center_pt.x,last_start_rope_pt.y- circle_center_pt.y);
              var vect_out2 = new cc.Vec2(adjuest_newpint.x-  last_start_rope_pt.x,adjuest_newpint.y- last_start_rope_pt.y);
  
              var ctange1 = vec_out1.signAngle(vect_out2)*180/Math.PI;
             
              
  
              //方向往园内还有一个可能，与原来的线方向是相反的
              var brefversline = false; 
              if(last_middle_center_prev_rope_start_pt)
              {
                  var last_r_vec = new cc.Vec2(last_start_rope_pt.x - last_middle_center_prev_rope_start_pt.x,last_start_rope_pt.y - last_middle_center_prev_rope_start_pt.y);
  
                  var newanglecc1 = last_r_vec.signAngle(vect_out2)*180/Math.PI;
                
                  if(newanglecc1 < -90 || newanglecc1 >  90)
                  {
                      brefversline = true;
                  }
              }
  
              //线段是反的
              if(brefversline)
              {
                  return [0,0];
              }
     
               
              
              //首先从最新的圈做切线
              var inter_pt_radius_list1 = InterceptUtils.Get_Tangent_Pt_To_Cicle(adjuest_newpint,circle_center_pt,circle_radius+5);
              //找到距离上次连接点最近的切点
              var min_dian_pt1 = InterceptUtils.Find_Min_Disntance_Pt_InPtList(last_start_rope_pt,inter_pt_radius_list1);
  
              return [1,1,adjuest_newpint,min_dian_pt1];
          }


          

            //计算得到圆心到连线的垂直距离
            var idstance1 = InterceptUtils.Get_Vertical_Distance(last_start_rope_pt,  adjuest_newpint,  circle_center_pt);

        //   console.log("idstance1 =" +idstance1)
           if(idstance1 > circle_radius + 4  )
           {
                return [0,0,new cc.Vec2(0,0),new cc.Vec2(0,0)];
               
           }
           //通过切线转连
            //圆心到连线的垂直交点
            var crosspt = InterceptUtils.Get_Vertical_CrossPT(last_start_rope_pt,  adjuest_newpint,  circle_center_pt);

            
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

            return [1,1,adjuest_newpint,first_pt];

    }
}