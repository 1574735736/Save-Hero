import ObstacleOBJ from "../game/ObstacleOBJ";
import start from "../load/start";
import MyCicle from "./MyCicle";
import Utils from "./Utils";
import WSize from "./WSize";

/*
工具类，主要用于各种碰撞相交的检测

*/

export default class InterceptUtils
{
    constructor()
    {

    }
    //中心点pos，宽valid_w，高valid_h的矩形，旋转angle后，得到旋转后的多边形点阵列表
    static Get_Valid_Bound_Poly_Pt_List(pos:cc.Vec2, valid_w:number, valid_h:number, angle:number):cc.Vec2[]
    {
        var rc = new cc.Rect(pos.x - valid_w/2,pos.y- valid_h/2,valid_w,valid_h);


        var left_top_pt=  new cc.Vec2(rc.xMin,rc.yMax);
        var right_top_pt=  new cc.Vec2(rc.xMax,rc.yMax);
        var right_bottom_pt=  new cc.Vec2(rc.xMax,rc.yMin);
        var left_bottom_pt=  new cc.Vec2(rc.xMin,rc.yMin);

        var all_pt_list = [];
        all_pt_list.push(left_top_pt);
        all_pt_list.push(right_top_pt);
        all_pt_list.push(right_bottom_pt);
        all_pt_list.push(left_bottom_pt);
    
       var transfer_pt_list =  InterceptUtils.Tranfer_Rotation_PTList(angle,pos,all_pt_list);

       return transfer_pt_list;

    }

    //获得点srcpt围绕centerpt中心点旋转degree度后得到的新位置点
    static Tranfer_PT_Rotate_Center(srcpt:cc.Vec2,centerpt:cc.Vec2,degree:number):cc.Vec2
    {
        var a = srcpt.x - centerpt.x;
        var b = srcpt.y - centerpt.y;


        var newx = a*Math.cos(degree) - b*Math.sin(degree) + centerpt.x;
        var newy = a*Math.sin(degree) + b*Math.cos(degree) + centerpt.y;

  
         
        return new cc.Vec2(newx,newy); 
    }

    //计算得到all_pt_list围绕中心点pos旋转angle得到的新店列表
    static Tranfer_Rotation_PTList( angle:number,center_pos:cc.Vec2,all_pt_list):cc.Vec2[]
    {    
        var degree = angle*Math.PI/180;

        var all_pos_list:cc.Vec2[] = [];
        for(var ff=0;ff<all_pt_list.length;ff++)
        {
            var ff_pos = all_pt_list[ff];
            var tranfer_pos =   InterceptUtils.Tranfer_PT_Rotate_Center(ff_pos,center_pos, degree  );
            all_pos_list.push(tranfer_pos);
        }

        return all_pos_list;
    }

    //判断点outerpt是否在line_pt1和line_pt2之间的线段上 - 这个函数前提是uterpt已经确定在这条直线上
    static Check_Pt_In_Line(outerpt:cc.Vec2 ,line_pt1:cc.Vec2,line_pt2:cc.Vec2)
    {
        var vec1 = new cc.Vec2(line_pt2.x - line_pt1.x,line_pt2.y-  line_pt1.y);
       
        var vec2 = new cc.Vec2(outerpt.x - line_pt1.x,outerpt.y-  line_pt1.y);
       
        var normavec = vec1.normalize();

        //方向不一样，那么就不行
        if(vec1.x > 0 && vec2.x < 0)
        {
            return false;
        }
        
        if(vec1.x < 0 && vec2.x > 0)
        {
            return false;
        }
        if(vec1.y > 0 && vec2.y < 0)
        {
            return false;
        }
        if(vec1.y <  0 && vec2.y  > 0)
        {
            return false;
        }
        
        var ilen1 = vec1.len();
        var ilen2 = vec2.len();


        //超过了
        if(ilen2 > ilen1)
        {
            return false;
        }

        return true;
    }

    //获得开始点为start_rope_pt，结束点为end_role_pt的线段，继续延长add_disntance后的新的终点坐标
    static Get_New_Add_Distance_Pt(start_rope_pt:cc.Vec2,end_role_pt:cc.Vec2,add_disntance:number):cc.Vec2
    {
        var vec = new cc.Vec2(end_role_pt.x-  start_rope_pt.x,end_role_pt.y- start_rope_pt.y);
        vec.normalizeSelf();
        var newx = end_role_pt.x + vec.x*add_disntance;
        var newy = end_role_pt.y + vec.y*add_disntance;


        return new cc.Vec2(newx,newy);
    }
    //判断矩形边上的点在哪条边上，1234代表上下左右四个边
    static Get_LinePt_In_Rc_Line_Type(inter_pt,rc)
    {
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

        return inter_line_type;

    }
    //判断两个值接近
    static MinEqual(x1,x2)
    {
        if(Math.abs(x1-x2) < 0.01)
        {
            return true;
        }

        return false;
    }
        //_pt,绳子起始点，起始点的方位信息
        //1上，2：右上，3：右，4：右下，5：下：6：左下，7：左，8：左上,0:rc中间
    static Get_Pt_In_Rect_Arear(valid_pos:cc.Vec2,rc:cc.Rect)
    {
        var iarea_index = 0;
        

        var min_x = rc.xMin;
        var max_x = rc.xMax;
        var min_y = rc.yMin;
        var max_y = rc.yMax;

 
        if(valid_pos.x < min_x)
        {

            if(valid_pos.y >= max_y)
            {
                iarea_index = 8;
            }
            else if(valid_pos.y <= min_y)
            {
                iarea_index = 6;
            }
            else{
                iarea_index = 7;
            }
        }
        else if(min_x <= valid_pos.x && valid_pos.x <= max_x )
        {
            if(valid_pos.y >= max_y)
            {
                iarea_index = 1;
            }
            else{
                iarea_index = 5;
            }
        }
        else if(max_x < valid_pos.x)
        {
            if(valid_pos.y >= max_y)
            {
                iarea_index = 2;
            }
            else if(valid_pos.y <= min_y)
            {
                iarea_index = 4;
            }
            else{
                iarea_index = 3;
            }
        }

        return iarea_index;
    }

    /** 
        判断线段是否在矩形内 


		 * 先看线段所在直线是否与矩形相交，  
		 * 如果不相交则返回false，  
		 * 如果相交，  
		 * 则看线段的两个点是否在矩形的同一边（即两点的x(y)坐标都比矩形的小x(y)坐标小，或者大）,  
		 * 若在同一边则返回false，  
		 * 否则就是相交的情况。 
		 * @param linePointX1 线段起始点x坐标  
		 * @param linePointY1 线段起始点y坐标  
		 * @param linePointX2 线段结束点x坐标  
		 * @param linePointY2 线段结束点y坐标  
		 * @param rectangleLeftTopX 矩形左上点x坐标  
		 * @param rectangleLeftTopY 矩形左上点y坐标  
		 * @param rectangleRightBottomX 矩形右下点x坐标  
		 * @param rectangleRightBottomY 矩形右下点y坐标  
		 * @return 是否相交 
	*/
    
    isLineIntersectRectangle(linePointX1:number,linePointY1:number,
        linePointX2:number,linePointY2:number,
        rectangleLeftTopX:number,rectangleLeftTopY:number, rectangleRightBottomX:number,rectangleRightBottomY:number):boolean
	{ 
			
        var  lineHeight:number = linePointY1 - linePointY2;
		var lineWidth:number = linePointX2 - linePointX1;  // 计算叉乘  
		var c:number = linePointX1 * linePointY2 - linePointX2 * linePointY1;

			if ((lineHeight * rectangleLeftTopX + lineWidth * rectangleLeftTopY + c >= 0 && lineHeight * rectangleRightBottomX + lineWidth * rectangleRightBottomY + c <= 0)    
				|| (lineHeight * rectangleLeftTopX + lineWidth * rectangleLeftTopY + c <= 0 && lineHeight * rectangleRightBottomX + lineWidth * rectangleRightBottomY + c >= 0)    
				|| (lineHeight * rectangleLeftTopX + lineWidth * rectangleRightBottomY + c >= 0 && lineHeight * rectangleRightBottomX + lineWidth * rectangleLeftTopY + c <= 0)    
				|| (lineHeight * rectangleLeftTopX + lineWidth * rectangleRightBottomY + c <= 0 && lineHeight * rectangleRightBottomX + lineWidth * rectangleLeftTopY + c >= 0)) 
			{ 
 
				if (rectangleLeftTopX > rectangleRightBottomX) {
					var temp:number = rectangleLeftTopX;
					rectangleLeftTopX = rectangleRightBottomX;
					rectangleRightBottomX = temp;   
				}   
				if (rectangleLeftTopY < rectangleRightBottomY) {
					var temp1:number = rectangleLeftTopY;    
					rectangleLeftTopY = rectangleRightBottomY;    
					rectangleRightBottomY = temp1;   }   
				if ((linePointX1 < rectangleLeftTopX && linePointX2 < rectangleLeftTopX)      
					|| (linePointX1 > rectangleRightBottomX && linePointX2 > rectangleRightBottomX)      
					|| (linePointY1 > rectangleLeftTopY && linePointY2 > rectangleLeftTopY)      
					|| (linePointY1 < rectangleRightBottomY && linePointY2 < rectangleRightBottomY)) {    
					return false;   
				} else {    
					return true;   
				}  
			} else {  
				return false;  
			} 
	}

    //获得矩形的顶点在矩形的哪个顶点位置
    //返回值1:左上，2：右上，3：左下。4：右下
    static Get_Edge_Pt_In_Rc_Edgetype(middlept:cc.Vec2,rc:cc.Rect)
    {
        var middle_pt_in_rc_type =  0;

        if(Math.abs(middlept.x - rc.xMin) <= 6 && Math.abs(middlept.y - rc.yMax) <= 6 )
        {
            return 1;
        }

        if(Math.abs(middlept.x - rc.xMax) <= 6 && Math.abs(middlept.y - rc.yMax) <= 6 )
        {
            return 2;
        }

        if(Math.abs(middlept.x - rc.xMin) <= 6 && Math.abs(middlept.y - rc.yMin) <= 6 )
        {
            return 3;
        }

        if(Math.abs(middlept.x - rc.xMax) <= 6 && Math.abs(middlept.y - rc.yMin) <= 6 )
        {
            return 4;
        }


        return 0;
    }
    //middlept是rc的一个顶点，那么获得矩形的其他三个顶点坐标列表
    static Get_RC_Other_Three_Edge_Pt_List(middlept:cc.Vec2,rc:cc.Rect)
    {
        var all_rc_edhge_pt_list = [];
        if( !(Math.abs(middlept.x - rc.xMin) <= 6 && Math.abs(middlept.y - rc.yMax) <= 6 )) 
        {
            all_rc_edhge_pt_list.push([rc.xMin,rc.yMax]);
        }

        if(!( Math.abs(middlept.x - rc.xMax) <= 6 && Math.abs(middlept.y - rc.yMax) <= 6 ) )
        {
            all_rc_edhge_pt_list.push([rc.xMax,rc.yMax]);
        }

        if(!(  Math.abs(middlept.x - rc.xMin) <= 6 && Math.abs(middlept.y - rc.yMin) <= 6 ) )
        {
            all_rc_edhge_pt_list.push([rc.xMin,rc.yMin]);
        }

        if( !( Math.abs(middlept.x - rc.xMax) <= 6 && Math.abs(middlept.y - rc.yMin) <= 6 ) )
        {
            all_rc_edhge_pt_list.push([rc.xMax,rc.yMin]);
        }

        return all_rc_edhge_pt_list;
    }

    //判断从start_pt到middlept，在到end_pt,对于障碍物rope_obstcleinfo来说，middlept是不是还有效了,是不是可以直接从start_pt到end_pt
    //返回true:middlept有效。还需要中间点，false:已经无效了middlept,直接就可以从startpt到endpt
    static Check_Three_Pt_Middle_PT_Not_Valid_Obstacle(start_pt:cc.Vec2,
            middlept:cc.Vec2,end_pt:cc.Vec2,rope_obstcleinfo:ObstacleOBJ,last_middle_obstcleinfo:ObstacleOBJ):boolean
    { 

        var ff_type = rope_obstcleinfo.m_itype;
        var ff_pt = rope_obstcleinfo.m_left_center_pt;
        var ff_vsize = rope_obstcleinfo.m_valid_size;
        var ff_radius = rope_obstcleinfo.m_valid_radius;


        if(ff_type == 1)
        {
            //是个矩形的障碍物
            var ff_rc =  new cc.Rect(ff_pt.x,ff_pt.y,ff_vsize.width,ff_vsize.height);

            var start_pt_pt_in_rc_type =  InterceptUtils.Get_Edge_Pt_In_Rc_Edgetype(start_pt,ff_rc);
            var middle_pt_in_rc_type =  InterceptUtils.Get_Edge_Pt_In_Rc_Edgetype(middlept,ff_rc);

              //1上，2：右上，3：右，4：右下，5：下：6：左下，7：左，8：左上,0:rc中间
            var area_index = InterceptUtils.Get_Pt_In_Rect_Arear(end_pt,ff_rc);

            var bneed_remove_line = 0;


            if(middle_pt_in_rc_type > 0)
            {


              //  if(middle_pt_in_rc_type == 1)

                
                var two_samex = 0;
                var two_samey = 0;

                if(Math.abs(start_pt.x-  middlept.x) <= 5)
                {
                    two_samex = 1;
                }

                if(Math.abs(start_pt.y-  middlept.y) <= 5)
                {
                    two_samey = 1;
                }


                if(two_samey )
                {
                    if(middle_pt_in_rc_type == 1 || middle_pt_in_rc_type == 2)
                    {

                        if(end_pt.y > middlept.y + 50)
                        {
                            bneed_remove_line = 1;
                        }

                    


                    } 
                    
                    
                    if(middle_pt_in_rc_type == 3 || middle_pt_in_rc_type == 4)
                    {
                        if(end_pt.y < middlept.y - 50)
                        {
                            bneed_remove_line = 1;
                        }
                        
                    }
                }
                else if(two_samex)
                {
                    if(middle_pt_in_rc_type == 1 || middle_pt_in_rc_type == 3)
                    {
                        if(end_pt.x < middlept.x - 50)
                        {
                            bneed_remove_line = 1;
                        }

 
                    }
                    if(middle_pt_in_rc_type == 2 || middle_pt_in_rc_type == 4)
                    {
                        if(end_pt.x > middlept.x + 50)
                        {
                            bneed_remove_line = 1;
                        }
                    }
                }
                else{

                    if(start_pt.y > ff_rc.yMax +10 && end_pt.y > ff_rc.yMax +10 && (middle_pt_in_rc_type== 1 || middle_pt_in_rc_type== 2))
                    {
                        bneed_remove_line = 1;
                    }


                    if(start_pt.y < ff_rc.yMin - 10 && end_pt.y < ff_rc.yMin - 10 && (middle_pt_in_rc_type== 3 || middle_pt_in_rc_type== 4))
                    {
                        bneed_remove_line = 1;
                    }


                    if(start_pt.x < ff_rc.xMin - 10 && end_pt.x < ff_rc.xMin - 10 && (middle_pt_in_rc_type== 1 || middle_pt_in_rc_type== 3))
                    {
                        bneed_remove_line = 1;
                    }


                    if(start_pt.x > ff_rc.xMax + 10 && end_pt.x  > ff_rc.xMax + 10 && (middle_pt_in_rc_type== 2 || middle_pt_in_rc_type== 4))
                    {
                        bneed_remove_line = 1;
                    }


                }



                
            }

            
            if(start_pt_pt_in_rc_type > 0 && middle_pt_in_rc_type > 0)
            {
                if(start_pt_pt_in_rc_type == middle_pt_in_rc_type)
                {
                    bneed_remove_line = 1;
                }

                 //1:左上，2：右上，3：左下。4：右下
                if(start_pt_pt_in_rc_type == 1)
                {
                    if(middle_pt_in_rc_type == 2)
                    {
                        if(area_index == 1 || area_index == 2 || area_index == 8)
                        {
                            bneed_remove_line = 1;
                        }
                    }
    
                    if(middle_pt_in_rc_type == 3)
                    {
                        if(area_index == 6 || area_index == 7 || area_index == 8)
                        {
                            bneed_remove_line = 1;
                        }
                    }
                }

                if(start_pt_pt_in_rc_type == 2)
                {
                    if(middle_pt_in_rc_type == 1)
                    {
                        if(area_index == 1 || area_index == 2 || area_index == 8)
                        {
                            bneed_remove_line = 1;
                        }
                    }
    
                    if(middle_pt_in_rc_type == 4)
                    {
                        if(area_index == 2 || area_index == 3 || area_index == 4)
                        {
                            bneed_remove_line = 1;
                        }
                    }
                }


                if(start_pt_pt_in_rc_type == 3)
                {
                    if(middle_pt_in_rc_type == 1)
                    {
                        if(area_index == 6 || area_index == 7 || area_index == 8)
                        {
                            bneed_remove_line = 1;
                        }
                    }
    
                    if(middle_pt_in_rc_type == 4)
                    {
                        if(area_index == 4 || area_index == 5 || area_index == 6)
                        {
                            bneed_remove_line = 1;
                        }
                    }
                }
                
                if(start_pt_pt_in_rc_type == 4)
                {
                    if(middle_pt_in_rc_type == 2)
                    {
                        if(area_index == 2 || area_index == 3 || area_index == 4)
                        {
                            bneed_remove_line = 1;
                        }
                    }
                    if(middle_pt_in_rc_type == 3)
                    {
                        if(area_index == 4 || area_index == 5 || area_index == 6)
                        {
                            bneed_remove_line = 1;
                        }
                    }
                }
            }
          
             

            if(bneed_remove_line)
            {
                return false;
            }


            var check_v1 =  new cc.Vec2(start_pt.x- middlept.x,start_pt.y-middlept.y);
            var check_v2 =  new cc.Vec2(end_pt.x- middlept.x,end_pt.y-middlept.y);
        
            var cangle_11 = check_v1.signAngle(check_v2) *180/Math.PI;

           


         
            //首先判断中间点在矩形的哪个角的位置
            var vec1 = new cc.Vec2(middlept.x- start_pt.x,middlept.y-start_pt.y);
        
            var other_three_pt_list =  InterceptUtils.Get_RC_Other_Three_Edge_Pt_List(middlept,ff_rc);


            var other_three_pt_cangle_list =  [];

            for(var hh=0;hh<other_three_pt_list.length;hh++)
            {
                var hh_pt_arr  = other_three_pt_list[hh];
                var hh_pt_vec = new cc.Vec2(hh_pt_arr[0]- start_pt.x,hh_pt_arr[1]-start_pt.y);
                var hh_angle =  vec1.signAngle(hh_pt_vec)*180/Math.PI ;
                other_three_pt_cangle_list.push(hh_angle);
            }
 

            var vec2 = new cc.Vec2(end_pt.x- start_pt.x,end_pt.y-start_pt.y);

            //判断两个向量的夹角

            var cangle = vec1.signAngle(vec2) *180/Math.PI;

         
            var min_anle=  0;
            var max_angle= 0 ;

            for(var hh=0;hh<other_three_pt_cangle_list.length;hh++)
            {
                var hh_anle=  other_three_pt_cangle_list[hh];

                if(hh_anle > max_angle)
                {
                    max_angle = hh_anle;
                }
                
                
                if(hh_anle < min_anle)
                {
                    min_anle = hh_anle;
                }
            }

            if(max_angle > 0 && min_anle == 0)
            {
                if(cangle < 0)
                {
                    return false;
                }
            }


            if(max_angle == 0 && min_anle < 0)
            {
                if(cangle > 0)
                {
                    return false;
                }
            }
           
           if(min_anle < -0.01 && max_angle > 0.01  )
           {
               if(  cangle > max_angle || cangle < min_anle)
               {
                    return false;
               }
               
           }
          
         

        }
        else if(ff_type == 2)
        {
            //圆形的障碍物
              //是个矩形的障碍物

              var circle_center_pt:cc.Vec2 = new cc.Vec2(ff_pt.x,ff_pt.y);
              var circle_radius:number = ff_radius as number;
           // var ff_cicle =  new MyCicle( new cc.Vec2(ff_pt.x,ff_pt.y) ,ff_rs);

            //圆心到连线的垂直交点
            var crosspt = InterceptUtils.Get_Vertical_CrossPT(start_pt,  end_pt,  circle_center_pt);

            // /垂直距离
            var vert_distance = InterceptUtils. Get_Vertical_Distance(start_pt,  end_pt,  circle_center_pt);

            //不与圆相交了
            if(vert_distance > circle_radius+ 6 )
            {
                return false;
            }

            
            var vec_out1 = new cc.Vec2(middlept.x-  circle_center_pt.x,middlept.y- circle_center_pt.y);
            var vect_out2 = new cc.Vec2(end_pt.x-  middlept.x,end_pt.y- middlept.y);

            var ctange1 = vec_out1.signAngle(vect_out2)*180/Math.PI;
            if(ctange1 > -90 && ctange1< 90)
            {
                //向外
                return false;
            }

             //方向往园内还有一个可能，与原来的线方向是相反的
             var brefversline = false;
             var newvec1 = new cc.Vec2(middlept.x - start_pt.x,middlept.y - start_pt.y);
             var newvec2 = new cc.Vec2(end_pt.x - middlept.x,end_pt.y - middlept.y);
 
             var newanglecc1 = newvec1.signAngle(newvec2)*180/Math.PI;
               
             if(newanglecc1 < -90 || newanglecc1 >  90)
             {
                 brefversline = true;
             }

             //反着的方向
             if(brefversline)
             {
                 return false;
             }
 
            /*
            //判断点crosspt是否在last_start_rope_pt和adjuest_newpint连线的线段上
            var binline = InterceptUtils.Check_Pt_In_Line(crosspt,start_pt,end_pt);

            if(!binline)
            {
                return false;
            }

*/
           
        }

        
        return true;
    }



    //获得点linept1-linept2直线与直线startpt开始点，斜率为fxmove的直线交点列表
    static Get_DLine_Intercept_DLine_Pt(startpt:cc.Vec2,fxmove:cc.Vec2, linept1:cc.Vec2,linept2:cc.Vec2 ):cc.Vec2
    {
        var newpt2 = new cc.Vec2(startpt.x + fxmove.x*100,startpt.y + fxmove.y*100) ;

      
        if(startpt.x == newpt2.x)
        {
            if(linept1.x == linept2.x)//平行，不考虑重合
            {
                return null;
            }

            if(linept1.y == linept2.y)
            {
                var pt1 = new cc.Vec2(startpt.x ,linept2.y);
                return pt1;
            }
              
            var line_vec1  = (linept2.y-  linept1.y)/(linept2.x-linept1.x);

            var newy = linept2.y + line_vec1*(startpt.x  -linept2.x );
            var newx = startpt.x;

            return new cc.Vec2(newx,newy);
        }
        else if(startpt.y == newpt2.y)
        {
            if(linept1.y == linept2.y)//平行，不考虑重合
            {
                return null;
            }

            if(linept1.x == linept2.x)
            {
                var pt1 = new cc.Vec2(linept2.x ,startpt.y);
                return pt1;
            }

            var line_vec2  = (linept2.y-  linept1.y)/(linept2.x-linept1.x);

            var newx = linept2.x + (startpt.y - linept2.y)/line_vec2;
            var newy = startpt.y;

            return new cc.Vec2(newx,newy);
        }
        else{

            if(linept1.x == linept2.x) 
            {
                var line_vec3  = fxmove.y/fxmove.x;

                var newy = startpt.y + line_vec3*(linept1.x  -startpt.x );
                var newx = linept1.x;
    
                return new cc.Vec2(newx,newy);

            }
            else if(linept1.y == linept2.y) 
            {
                var line_vec4  = fxmove.y/fxmove.x;
                var newx = startpt.x + (linept1.y - startpt.y)/line_vec4;
                var newy = linept1.y;
    
                return new cc.Vec2(newx,newy);
            }
        }


        //去掉特殊情况了，目前情况下肯定都有斜率了
        var v1 = fxmove.y/fxmove.x;
        var v2 =  (linept2.y-  linept1.y)/(linept2.x-linept1.x);

        var vdesc = v1-v2;
        if(Math.abs(vdesc) < 0.001)//接近平行线
        {
            return null;
        }
         
        var rightv = v1*startpt.x - startpt.y + linept2.y - v2*linept2.x;

        var newx_d = rightv/vdesc;
        var newy_d = startpt.y + v1*(newx_d- startpt.x);


        return  new cc.Vec2(newx_d,newy_d);
    }

     //获得线段linept1-linept2与直线startpt开始点，斜率为fxmove的射线交点列表
    static Get_Segment_Intercept_SingleFX_Line_Pt(startpt:cc.Vec2,fxmove:cc.Vec2, linept1:cc.Vec2,linept2:cc.Vec2 ):cc.Vec2
    {
        //首先，获得直线与线段所在直线交点列表
        var line_pt = InterceptUtils.Get_DLine_Intercept_DLine_Pt(startpt,fxmove, linept1,linept2 );
        if(!line_pt)
        {
            return null;
        }

        //判断点不在射线同方向上
        var bvalid1 = InterceptUtils.Check_Pt_In_SingleFX_Line(startpt,fxmove, line_pt );
    
        if(!bvalid1)
        {
             return null;
        }


        //判断点在不在线段上
        var addv1 = new cc.Vec2(line_pt.x- linept1.x,line_pt.y-linept1.y);
        var addv2 = new cc.Vec2(linept2.x- linept1.x,linept2.y-linept1.y);

        //超过范围长度了 
        if(addv1.len() > addv2.len())
        {
            return null;
        }

        if(addv1.x == addv2.x)
        {
            if(addv1.y*addv2.y < 0)
            {
                return null;
            }
        }
        else if(addv1.y == addv2.y)
        {
            if(addv1.x*addv2.x < 0)
            {
                return null;
            }
        }
        else{

            var xl1 = addv1.y/addv1.x;
            var xl2 = addv2.y/addv2.x;

            //斜率方向相反
            if(xl1*xl2 < 0)
            {
                return null;
            }
            
        }
        //斜率一致并且点的距离在两者之中，在线段内

         
        return line_pt;
    }

    /*
      功能函数，求出
      startpt开始，方向为fxmove的直线，与ployptlist组成的多边形
      交点列表,没有交点返回空数组


    */
    static Get_PolyPtList_Intercept_Line_PtList(startpt:cc.Vec2,fxmove:cc.Vec2,polyptlist:cc.Vec2[] )
    {
        fxmove.normalizeSelf();
        var intecpet_pt_list = [];
        var newpt2 = new cc.Vec2(startpt.x + fxmove.x*100,startpt.y + fxmove.y*100) ;

        //参数错误
        if(polyptlist.length <= 1)
        {
            return [];
        }


       
        for(var ff=0;ff<polyptlist.length-1;ff++)
        {
            var ff_pt1 = polyptlist[ff];
            var ff_pt2 = polyptlist[ff+1];

            var ff_pt = InterceptUtils.Get_Segment_Intercept_SingleFX_Line_Pt(startpt,fxmove, ff_pt1,ff_pt2 );

            if(ff_pt)
            {
                intecpet_pt_list.push(ff_pt);
            }
             
        }

        var last_pt = InterceptUtils.Get_Segment_Intercept_SingleFX_Line_Pt(startpt,fxmove, polyptlist[polyptlist.length-1],polyptlist[0] );
       
        if(last_pt)
        {
            intecpet_pt_list.push(last_pt);
        }
        

        return intecpet_pt_list;
    }


    //获得开始点为startpt,移动方向为fxmove,这条射线与矩形rc相交的点的坐标列表
    static Get_FX_Line_Intercept_With_Rc_Pt_List(startpt:cc.Vec2,fxmove:cc.Vec2,rc:cc.Rect)
    {

        var polyptlist=  Utils.Get_RC_PolyPtList(rc);
        var intecpet_pt_list =  InterceptUtils.Get_PolyPtList_Intercept_Line_PtList(startpt,fxmove,polyptlist);

        var valid_pt_list=  [];

    
        
        for(var ff=0;ff<intecpet_pt_list.length;ff++)
        {
            var ff_pt:cc.Vec2 = intecpet_pt_list[ff];
 
            //首先，判断方向是否一致
            var bvalid = InterceptUtils.Check_Pt_In_SingleFX_Line(startpt,fxmove, ff_pt );
            

            if(!bvalid)
            {
                continue;
            }

            var bhassame=  false;

            for(var hh=0;hh<valid_pt_list.length;hh++)
            {
                var hh_pt = valid_pt_list[hh];
                if(hh_pt.x == ff_pt.x && hh_pt.y == hh_pt.y)
                {
                    bhassame = true;
                }
            }

            if(bhassame)
            {
                continue;
            }
            valid_pt_list.push(ff_pt);
        }
        return valid_pt_list;
    }

    //得到从startpt出发，方向为fxmove的射线和polyptlist多边形的距离最近的交点
    static Get_PolyPtList_Intercept_Line_Min_Disntance_PT(startpt:cc.Vec2,fxmove:cc.Vec2,polyptlist:cc.Vec2[] ):cc.Vec2
    {
        var intecpet_pt_list =  InterceptUtils.Get_PolyPtList_Intercept_Line_PtList(startpt,fxmove,polyptlist);

        var min_distance_pt =  null;
        var min_distance = 0;

        for(var ff=0;ff<intecpet_pt_list.length;ff++)
        {
            var ff_pt:cc.Vec2 = intecpet_pt_list[ff];

            //首先，判断这个点与射线方向是不是一样
          //  var curvec = new cc.Vec2(ff_pt.x - startpt.x,ff_pt.y-startpt.y);
           // curvec.normalizeSelf();

           // if(curvec.x * fxmove.x < 0 || fxmove.y*curvec.y < 0 )
          //  {
              //  continue;
           // }

            
            //首先，判断方向是否一致
            var bvalid = InterceptUtils.Check_Pt_In_SingleFX_Line(startpt,fxmove, ff_pt );
            

            if(!bvalid)
            {
                continue;
            }



            var ff_distance=  InterceptUtils.Get_Distance(ff_pt,startpt);
            if(min_distance_pt == null)
            {

                min_distance_pt = ff_pt;
                min_distance = ff_distance;
            }else{
                if(min_distance > ff_distance)
                {
                    min_distance_pt = ff_pt;
                    min_distance = ff_distance;
                }
            }

        }


        return min_distance_pt;
    }




    /*
      功能函数，求出
      startpt开始，方向为fxmove的直线，与中心点为circle_center_pt,半径为cicle_radius的圆形
      交点列表,没有交点返回空数组


    */
    static Get_Circle_Intercept_Line_PtList(startpt:cc.Vec2,fxmove:cc.Vec2,circle_center_pt:cc.Vec2,cicle_radius:number)
    {
        //交点列表
        fxmove.normalizeSelf();
        var intecpet_pt_list = [];
        var newpt2 = new cc.Vec2(startpt.x + fxmove.x*100,startpt.y + fxmove.y*100) ;
        var distance = InterceptUtils.Get_Vertical_Distance( startpt,  newpt2,  circle_center_pt) ;

        //垂直距离比圆半径大，显然没有交点
        if(distance > cicle_radius)
        {
            return [];
        }

        //垂直距离和圆半径一样，刚好就是垂直交点一个点
        if(distance == cicle_radius)
        {
            var crosspt = InterceptUtils.Get_Vertical_CrossPT( startpt,  newpt2,  circle_center_pt);
            intecpet_pt_list.push(crosspt);
            return intecpet_pt_list;
        }

        //这里有两个交点,首先，处理下两个特殊情况
        if(Math.abs(startpt.x - newpt2.x)  <= 0.00000001)
        {
           // var newpt = new cc.Vec2(pt1.x,outer_pt.y);
           // return newpt;

           var y1 = circle_center_pt.y + Math.sqrt(cicle_radius*cicle_radius -  (startpt.x- circle_center_pt.x) * (startpt.x- circle_center_pt.x));

           var y2 = circle_center_pt.y - Math.sqrt(cicle_radius*cicle_radius -  (startpt.x- circle_center_pt.x) * (startpt.x- circle_center_pt.x));


           var newpt1 = new cc.Vec2(startpt.x ,y1);
           var newpt2 = new cc.Vec2(startpt.x ,y2);
           intecpet_pt_list.push(newpt1);
           intecpet_pt_list.push(newpt2);
           return intecpet_pt_list;
        }


        if(Math.abs(startpt.y - newpt2.y)  <= 0.00000001 )
        {
            //var newpt = new cc.Vec2(outer_pt.x,pt1.y);
            //return newpt;
            var x1 = circle_center_pt.x + Math.sqrt(cicle_radius*cicle_radius -  (startpt.y- circle_center_pt.y) * (startpt.y- circle_center_pt.y));
            var x2 = circle_center_pt.x - Math.sqrt(cicle_radius*cicle_radius -  (startpt.y- circle_center_pt.y) * (startpt.y- circle_center_pt.y));

            var newpt1 = new cc.Vec2(x1 ,startpt.y);
            var newpt2 = new cc.Vec2(x2 ,startpt.y);
            intecpet_pt_list.push(newpt1);
            intecpet_pt_list.push(newpt2);
            return intecpet_pt_list;
        }


        //直线斜率，由于特殊情况已经处理，斜率肯定有效
        var v1 = fxmove.y/fxmove.x;

        var d1 = v1*v1+1;
        var d2 = 2*v1*startpt.y - 2*v1*circle_center_pt.y - 2*startpt.x*v1*v1 - 2*circle_center_pt.x;
        var d3 = cicle_radius*cicle_radius  - circle_center_pt.x*circle_center_pt.x  -  (startpt.y - circle_center_pt.y - startpt.x*v1)*(startpt.y - circle_center_pt.y - startpt.x*v1);


        var d4 = -d2/(2*d1);
        var d5 = Math.sqrt(   (d3/d1) + (d2*d2)/(4*d1*d1)  );

        var x1 = d4 - d5;

        var y1 = v1*x1 - startpt.x*v1 + startpt.y;


        var x2 = d4 + d5;
        var y2 = v1*x2 - startpt.x*v1 + startpt.y;


        var newpt1 = new cc.Vec2(x1 ,y1);
        var newpt2 = new cc.Vec2(x2 ,y2);
        intecpet_pt_list.push(newpt1);
        intecpet_pt_list.push(newpt2);

        return intecpet_pt_list;
    }

    //判断直线上的点chekcpt是否在startpt，方向为fxmove的射线的同方向上
    static Check_Pt_In_SingleFX_Line(startpt:cc.Vec2,fxmove:cc.Vec2, chekcpt:cc.Vec2 )
    {
        var bvalid = 1;
        fxmove = fxmove.normalize(); 
        var newpt2 = new cc.Vec2(startpt.x + fxmove.x*100,startpt.y + fxmove.y*100) ;
     
        if(Math.abs(startpt.x - newpt2.x)  <= 0.00000001   )
        {
            var addy1 = newpt2.y- startpt.y;
            var addy2 = chekcpt.y- startpt.y;

            if(addy1*addy2 < 0)
            {
                bvalid = 0;
            }
        }
        else if(Math.abs(startpt.y - newpt2.y)  <= 0.00000001    )
        {
            var addx1 = newpt2.x- startpt.x;
            var addx2 = chekcpt.x- startpt.x;

            if(addx1*addx2 < 0)
            {
                bvalid = 0;
            }
        }
        else
        {

            //斜率
            var v2 =  (chekcpt.y - startpt.y)/(chekcpt.x - startpt.x);
            var v1 =  fxmove.y/fxmove.x;
               
            //由于前面都是在同一直线上斜率，所以只是方向正负不一样
            if(v1*v2 < 0 )
            {
                bvalid = 0;
            }

        }

        return bvalid;
    }

    //计算射线和圆的交点有效最近点,首先得到射线所在直线和圆交点，然后去掉无效点，剩下的点最近点,没有有效点返回null
    static Get_Circle_Intercept_SingleFX_Line_MinDisntace_Pt(startpt:cc.Vec2,fxmove:cc.Vec2,circle_center_pt:cc.Vec2,cicle_radius:number):cc.Vec2
    {
        var intecpet_pt_list = InterceptUtils.Get_Circle_Intercept_Line_PtList(startpt,fxmove,circle_center_pt,cicle_radius);
        fxmove.normalizeSelf(); 
        var newpt2 = new cc.Vec2(startpt.x + fxmove.x*100,startpt.y + fxmove.y*100) ;
      
        var mindistance = 0;
        var mindisntance_pt=  null;

        for(var ff=0;ff<intecpet_pt_list.length;ff++)
        {
            var ff_pt = intecpet_pt_list[ff];

            //首先，判断方向是否一致
            var bvalid = InterceptUtils.Check_Pt_In_SingleFX_Line(startpt,fxmove, ff_pt );
            

            if(!bvalid)
            {
                continue;
            }


            var distance = InterceptUtils.Get_Distance(ff_pt,startpt);
            if(mindisntance_pt == null)
            {
                mindisntance_pt = ff_pt;
                mindistance = distance;
            }else{

                if(mindistance > distance)
                {
                    mindisntance_pt = ff_pt;
                    mindistance = distance;
                }
            }


        }
        

        return mindisntance_pt;
    }



    /** @ brief 根据两点求出垂线过第三点的直线的交点
    @ param pt1 直线上的第一个点
    @ param pt2 直线上的第二个点
    @ param pt3 垂线上的点
    @ return 返回点到直线的垂直交点坐标
  */
    static Get_Vertical_CrossPT( pt1:cc.Vec2,  pt2:cc.Vec2,  outer_pt:cc.Vec2):cc.Vec2
    {
        if(pt1.x == pt2.x)
        {
            var newpt = new cc.Vec2(pt1.x,outer_pt.y);
            return newpt;
        }
        if(pt1.y == pt2.y)
        {
            var newpt = new cc.Vec2(outer_pt.x,pt1.y);
            return newpt;
        }


        /*
        var A = (pt1.y-pt2.y)/(pt1.x- pt2.x);
        var B = (pt1.y-A*pt1.y);
        /// > 0 = ax +b -y;  对应垂线方程为 -x -ay + m = 0;(mm为系数)
        /// > A = a; B = b;
        var m = outer_pt.x + A*outer_pt.y;
    
        /// 求两直线交点坐标
        var ptCross = new cc.Vec2();
        ptCross.x = (m-A*B)/(A*A + 1);
        ptCross.y = A*ptCross.x+B;

 
        return ptCross;
        */


        var v1 = (pt2.y-pt1.y)/(pt2.x-pt1.x);
        var left1 = v1*v1 + 1;

        var right = pt1.x*v1*v1 + outer_pt.x + v1*outer_pt.y - v1*pt1.y;


        var x = right/left1;
        var y = pt1.y + v1*(x-pt1.x);

        return new cc.Vec2(x,y);

    }
   /** @ brief 根据两点求出垂线过第三点的直线的交点
    @ param pt1 直线上的第一个点
    @ param pt2 直线上的第二个点
    @ param pt3 垂线上的点
    @ return 返回点到直线的垂直距离
  */
    static Get_Vertical_Distance(pt1:cc.Vec2,  pt2:cc.Vec2,  outer_pt:cc.Vec2):number
    {
        if(pt1.x == pt2.x)
        {
            var distance = Math.abs(outer_pt.x - pt1.x)
            return distance;
        }
        if(pt1.y == pt2.y)
        {
            var distance = Math.abs(outer_pt.y - pt1.y)
            return distance;
        }

        var crosspt = InterceptUtils.Get_Vertical_CrossPT(pt1 ,  pt2 ,  outer_pt);

        var idiantacnemul = (crosspt.x-  outer_pt.x)*(crosspt.x-  outer_pt.x) + (crosspt.y-  outer_pt.y)*(crosspt.y-  outer_pt.y) ;

        var idtsnace = Math.sqrt(idiantacnemul);
        return idtsnace;

       // var A = (pt1.y-pt2.y)/(pt1.x- pt2.x);
        //var B = (pt1.y-A*pt1.y);
        /// > 0 = ax +b -y;
       // return Math.abs(A*outer_pt.x + B -outer_pt.y)/Math.sqrt(A*A + 1);
    }

    static Get_Distance(pt1,pt2)
    {
        var imul = (pt1.x-pt2.x)*(pt1.x-pt2.x) + (pt1.y-pt2.y) * (pt1.y-pt2.y);
        return Math.sqrt(imul) ;
    }


    static Get_Distance_Mul(pt1,pt2)
    {
        var imul = (pt1.x-pt2.x)*(pt1.x-pt2.x) + (pt1.y-pt2.y) * (pt1.y-pt2.y);
        return imul;
    }


    //返回点和圆的两条切线的切点位置
    //设切点为(x0，y0)，圆心坐标为(a,b)，切线过某点(x1,y1)，那么，根据切线和过切点的半径垂直，可得到斜率相乘等于-1，得[(b-y0)/(a-x0)][(y1-y0)/(x1-x0)]=-1，
     //又因为切点在圆上，所以代入圆的方程，就有两个等式，解方程求出切点即可
    static Get_Tangent_Pt_To_Cicle(start_pt,circle_center_pt,circle_radius) 
    {
        //平移坐标系到原中心
        var start_new_pt = new cc.Vec2(start_pt.x - circle_center_pt.x,start_pt.y- circle_center_pt.y);

        var a = start_new_pt.x ;
        var b = start_new_pt.y;

        var r2 = circle_radius*circle_radius;
        var a2b2mul = a*a + b*b;
        var a2b2mul_a2b2mul = a2b2mul*a2b2mul;


        //(y- bcm/(a*a+b*b)) = +- Math.sqrt(        )
        var iallright = ((b*b*r2*r2)/a2b2mul_a2b2mul)   +   ( (a*a - r2)*r2)/a2b2mul;

        var itt = b*r2/a2b2mul;

        var y1 = itt + Math.sqrt(iallright);
        var y2 = itt - Math.sqrt(iallright);


        var x1 = (r2-  b*y1)/a;
        var x2 = (r2-  b*y2)/a;
        
        var pt1 = new cc.Vec2(x1,y1);
        var realpt1 =  new cc.Vec2(x1 + circle_center_pt.x,y1 + circle_center_pt.y);

        var pt2 = new cc.Vec2(x2,y2);
        var realpt2 =  new cc.Vec2(x2 + circle_center_pt.x,y2 + circle_center_pt.y);



        var all_vec = [];
        all_vec.push(realpt1);
        all_vec.push(realpt2);
        return all_vec;

       // var pt1 = new cc.Vec2(x1,y1);
       // var realpt1 =  new cc.Vec2(x1 - circle_center_pt.x,y1 - circle_center_pt.y);

      //  return realpt1;

        //切点方程 
        //a_x*x + b_y*y = circle_radius*circle_radius
        //x*x + y*y = circle_radius*circle_radius


        /*
        var vec1 = new cc.Vec2(circle_center_pt.x - start_pt.x,circle_center_pt.y-  start_pt.y);
        var idiantace_mul = (circle_center_pt.x - start_pt.x)*(circle_center_pt.x - start_pt.x) + (circle_center_pt.y-  start_pt.y)*circle_center_pt.y-  start_pt.y;
        var idistance = Math.sqrt(idiantace_mul);

        var sina = circle_radius/idistance;
        var anlec = Math.asin(sina);


        var anglec_d = anlec*180/Math.PI;

        //切线的长度
        var tanget_disntace= Math.sqrt(idiantace_mul - circle_radius*circle_radius);

        var vec3 = new cc.Vec2(circle_center_pt.x - start_pt.x,0);
        
        var cangle= vec1.signAngle(vec3);

        var ialldushi = anlec + cangle;

        var xdistance = tanget_disntace*Math.cos(ialldushi);
        var ydistance = tanget_disntace*Math.sin(ialldushi);

        var newpt = new cc.Vec2(start_pt.x+xdistance,start_pt.y+ydistance);

        return newpt;
        */

    }

    static Find_Min_Disntance_Pt_InPtList(pt1:cc.Vec2,pt_list):cc.Vec2
    {
        var find_min_pt:cc.Vec2 =  null;

        var min_distance=  0;

        for(var ff=0;ff<pt_list.length;ff++)
        {
            var ff_pt= pt_list[ff];
            var ff_diatance_mul = InterceptUtils.Get_Distance_Mul(ff_pt,pt1);

            if(find_min_pt == null)
            {
                find_min_pt = ff_pt;
                min_distance = ff_diatance_mul;
            }else{

                if(min_distance > ff_diatance_mul)
                {
                    find_min_pt = ff_pt;
                    min_distance = ff_diatance_mul;
                }
            }
        }

        return find_min_pt;
    }


    static FLineLeft(  lnSt:cc.Vec2,   lnEt:cc.Vec2,   Aip:cc.Vec2)  //lnSt为圆心  lnEt为起点  Aip为终点
    {

        var x1=lnSt.x;

        var y1=lnSt.y;

        

        var x2=lnEt.x;

        var y2=lnEt.y;

        

        var x3=Aip.x;

        var y3=Aip.y;

        

        var S=(x1-x3)*(y2-y3)-(y1-y3)*(x2-x3);

        

        if( S > 0 )           //PointF是GDI+类型，你当CPoint类型就行，另外 S==0的话，标明三点共线，既然你说是弧 应该不会有这种情况 

        {

            return true;   //如果在直线左侧返回TRUE，否则返回FALSE

            

        }else{

            

            return false;

        }

    }

    //依次按照碰撞先后顺序排列
    static Find_Obstacle_List_Intercept_By_Distance(startpt:cc.Vec2,endpt:cc.Vec2,fxvec_norm:cc.Vec2,   all_prevenet_shap_list)
    {
        var vec1=  new cc.Vec2(endpt.x -startpt.x,endpt.y-  startpt.y );
        var ilen = vec1.len();

        var intercept_distance_obj_info_list = [];


        for(var ff=0;ff<all_prevenet_shap_list.length;ff++)
        {
            var ff_info  = all_prevenet_shap_list[ff];

            var ff_type=  ff_info[0];
            var ff_pt = ff_info[1];
            var ff_rs = ff_info[2];
            var ff_obj = ff_info[3];

            //圆形
            if(ff_type == 1)
            {
                var wsize1:WSize = ff_rs as WSize;
                var rc1 = new cc.Rect(ff_pt.x,ff_pt.y,wsize1.width,wsize1.height);
                
             
                var rc_pol_pt_list = Utils.Get_RC_PolyPtList(rc1);


                var min_pt =    InterceptUtils.Get_PolyPtList_Intercept_Line_Min_Disntance_PT(startpt,fxvec_norm,rc_pol_pt_list );
                if(min_pt)
                {

                    var addvec2 = new cc.Vec2(min_pt.x-  startpt.x,min_pt.y-startpt.y);
                    var ilen2 = addvec2.len();

                    if(ilen >= ilen2)
                    {
                        var distance = InterceptUtils.Get_Distance(startpt,min_pt);
                        intercept_distance_obj_info_list.push([distance,ff_obj]);
                    }

                   
                }
            }
            else if(ff_type == 2)
            {
                var min_pt = InterceptUtils.Get_Circle_Intercept_SingleFX_Line_MinDisntace_Pt(startpt,fxvec_norm,ff_pt,ff_rs);

                if(min_pt)
                {
                    var addvec2 = new cc.Vec2(min_pt.x-  startpt.x,min_pt.y-startpt.y);
                    var ilen2 = addvec2.len();

                    if(ilen >= ilen2)
                    {
                        var distance = InterceptUtils.Get_Distance(startpt,min_pt);
                        intercept_distance_obj_info_list.push([distance,ff_obj]);
                    }
                }
                
            }
            //[1,leftpt,obj_valid_sizew]
        }

        var order_obj_list= [];

        while(true)
        {
            var min_distance = 0;

            var min_distance_shape_info = null;

            if(intercept_distance_obj_info_list.length <= 0)
            {
                break;
            }
            

            for(var ff=0;ff<intercept_distance_obj_info_list.length;ff++)
            {
                var ff_distance_info = intercept_distance_obj_info_list[ff];
                var ff_distance = ff_distance_info[0];
                var ff_obj = ff_distance_info[1];
                
                if(min_distance_shape_info == null)
                {
                      min_distance = ff_distance;

                      min_distance_shape_info = ff_obj;
        
                }else{

                    if(min_distance > ff_distance)
                    {
                        min_distance = ff_distance;

                        min_distance_shape_info = ff_obj;
                    }
                }
            }


            if(!min_distance_shape_info)
            {
                break;
            }

            order_obj_list.push(min_distance_shape_info);

            for(var ff=0;ff<intercept_distance_obj_info_list.length;ff++)
            {
                var ff_distance_info = intercept_distance_obj_info_list[ff];
                var ff_obj = ff_distance_info[1];
              
                if(ff_obj == min_distance_shape_info)
                {
                    intercept_distance_obj_info_list.splice(ff,1);
                    break;
                }
            }

        }


        return order_obj_list;
    }

    //计算得到开始点为startpt,方向为fxvec_norm,结束点为endpt,与界面中all_prevenet_shap_list对应的形状相交的最近点的坐标
     static Caculate_MinDistance_Valid_Intercept_Pt(startpt:cc.Vec2,fxvec_norm:cc.Vec2,endpt:cc.Vec2,   all_prevenet_shap_list)
     {
         var min_distance_pt = null;
         var min_distance = 0;

         var min_distance_shape_info = null;

         var vecall = new cc.Vec2(endpt.x- startpt.x,endpt.y- startpt.y);

        for(var ff=0;ff<all_prevenet_shap_list.length;ff++)
        {
            var ff_info  = all_prevenet_shap_list[ff];

            var ff_type=  ff_info[0];
            var ff_pt = ff_info[1];
            var ff_rs = ff_info[2];
            var ff_obj = ff_info[3];

            //矩形
            if(ff_type == 1)
            {
                var wsize1:WSize = ff_rs as WSize;
                var rc1 = new cc.Rect(ff_pt.x,ff_pt.y,wsize1.width,wsize1.height);
                
             
                var rc_pol_pt_list = Utils.Get_RC_PolyPtList(rc1);


                var min_pt =    InterceptUtils.Get_PolyPtList_Intercept_Line_Min_Disntance_PT(startpt,fxvec_norm,rc_pol_pt_list );
                if(min_pt)
                {
                    var distance = InterceptUtils.Get_Distance(startpt,min_pt);
                    if(min_distance_pt == null)
                    {
                        min_distance_pt = min_pt;
                        min_distance = distance;
                        min_distance_shape_info = ff_obj;
                    }
                    else{
                        if(min_distance > distance)
                        {
                            min_distance_pt = min_pt;
                            min_distance = distance;
                            min_distance_shape_info = ff_obj;
                        }
                    }
                }
            }
            else if(ff_type == 2)
            {
                 //圆形
                var min_pt = InterceptUtils.Get_Circle_Intercept_SingleFX_Line_MinDisntace_Pt(startpt,fxvec_norm,ff_pt,ff_rs);

                if(min_pt)
                {
                    var distance = InterceptUtils.Get_Distance(startpt,min_pt);
                    if(min_distance_pt == null)
                    {
                        min_distance_pt = min_pt;
                        min_distance = distance;
                        min_distance_shape_info = ff_obj;
                    }
                    else{
                        if(min_distance > distance)
                        {
                            min_distance_pt = min_pt;
                            min_distance = distance;
                            min_distance_shape_info = ff_obj;
                        }
                    }
                }
                
            }
            //[1,leftpt,obj_valid_sizew]

        }

        //超过线段范围了
        if(vecall.len() < min_distance)
        {
              min_distance_pt = null;
              min_distance = 0;
   
              min_distance_shape_info = null;
   
        }



        return [min_distance_pt,min_distance_shape_info,min_distance];

     }


     //edge_index-矩形的顶点位置,last_pt:外部绳子开始点，2：,validpt:鼠标当前点
     ///判断这样的连线是否有效这个顶点能不能卡死这两个点
     static Check_Edge_TwoPt_Valid(edge_index, rc:cc.Rect,last_pt:cc.Vec2,last_role_end_pt:cc.Vec2):boolean
     {

        //左上角
        var bneedremoveline = 0;

        if(edge_index == 1)
        {
             if(last_pt.y > rc.yMax && last_role_end_pt.y > rc.yMax)
             {
                 bneedremoveline = 1;
             }
             if(last_pt.x < rc.xMin && last_role_end_pt.x < rc.xMin)
             {
                 bneedremoveline = 1;
             }


            

        }
        else if(edge_index == 2)
        {
             if(last_pt.y > rc.yMax && last_role_end_pt.y > rc.yMax)
             {
                 bneedremoveline = 1;
             }
             if(last_pt.x > rc.xMax && last_role_end_pt.x > rc.xMax)
             {
                 bneedremoveline = 1;
             }

          


        } else if(edge_index == 3)
        {
             if(last_pt.y < rc.yMin && last_role_end_pt.y < rc.yMin)
             {
                 bneedremoveline = 1;
             }
             if(last_pt.x < rc.xMin && last_role_end_pt.x  < rc.xMin)
             {
                 bneedremoveline = 1;
             }
        }else if(edge_index == 4)
        {
             if(last_pt.y < rc.yMin && last_role_end_pt.y < rc.yMin)
             {
                 bneedremoveline = 1;
             }
             if(last_pt.x > rc.xMax && last_role_end_pt.x  > rc.xMax)
             {
                 bneedremoveline = 1;
             }
        }


        if(bneedremoveline)
        {
            return false;
        }

        return true;
     }
}