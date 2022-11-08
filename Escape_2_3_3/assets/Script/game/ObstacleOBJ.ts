import WSize from "../utils/WSize";


//圆形，矩形能能让绳子缠绕的常规障碍物体
export default class ObstacleOBJ 
{
    m_id=  0;

    //类型，1：矩形，2：圆形
    m_itype:number = 0;

    //对应节点
    m_obj_node:cc.Node = null;
    m_gragphic:cc.Graphics = null;
    //矩形的时候，为左上角点，圆形的时候，为圆心点
    m_left_center_pt : cc.Vec2 = new cc.Vec2(0,0);
    //矩形时候有效，为矩形尺寸
    m_valid_size:WSize = new WSize(0,0);
    //圆形有效，为圆半径
    m_valid_radius:number = 0;

    constructor(id)
    {
        this.m_id = id;

    }

    GetID()
    {
        return this.m_id;
    }
    Get_RC()
    {
        if(this.m_itype == 1)
        {
            return new cc.Rect(this.m_left_center_pt.x,this.m_left_center_pt.y,this.m_valid_size.width,this.m_valid_size.height);
        }
        else if(this.m_itype == 2)
        {
            return new cc.Rect(this.m_left_center_pt.x  - this.m_valid_radius/2,this.m_left_center_pt.y- this.m_valid_radius/2,this.m_valid_radius,this.m_valid_radius);
        }
        return new cc.Rect(this.m_left_center_pt.x,this.m_left_center_pt.y,this.m_valid_size.width,this.m_valid_size.height);


    }
    Init(obj_node:cc.Node,obstacle_gragphic:cc.Graphics,itype:number,leftpt:cc.Vec2,obj_valid_sizew_or_radius)
    {
        this.m_itype =itype;
        this.m_obj_node =obj_node;
        this.m_gragphic =obstacle_gragphic;
        this.m_left_center_pt =leftpt;

        if(itype == 1)
        {
            this.m_valid_size =obj_valid_sizew_or_radius as WSize;
 
        }
        else if(itype == 2)
        {
            this.m_valid_radius = obj_valid_sizew_or_radius as number;

        }
        this.RedrawAll();
    }

    RedrawAll()
    {
        /*
        if(this.m_itype == 2)
        {
            this.m_gragphic.circle(this.m_left_center_pt.x,this.m_left_center_pt.y,this.m_valid_radius);

        } 
        else  if(this.m_itype == 1)
        {
            var rc = new cc.Rect(this.m_left_center_pt.x,this.m_left_center_pt.y,this.m_valid_size.width,this.m_valid_size.height);
           
            this.m_gragphic.moveTo(rc.xMin,rc.yMax);
 
            this.m_gragphic.lineTo(rc.xMax,rc.yMax);
            this.m_gragphic.lineTo(rc.xMax,rc.yMin );
            this.m_gragphic.lineTo(rc.xMin,rc.yMin );
            this.m_gragphic.lineTo(rc.xMin,rc.yMax );
      

        }
     
        this.m_gragphic.stroke();
        */
    }

   
    
}