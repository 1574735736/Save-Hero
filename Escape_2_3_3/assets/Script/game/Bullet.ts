import Utils from "../utils/Utils";

/*
子弹类，射出的子弹
*/

export default class Bullet 
{
    //子弹节点
    m_node:cc.Node =  null;
    //子弹移动方向
    m_move_vec:cc.Vec2 =  null;
    //移动速度
    m_move_speed:number = 100;

    m_parent_game = null;

    //是否已经碰到小人了
    m_b_killed_people:number =  0;

    constructor(parentgame, pnode:cc.Node,movevec:cc.Vec2)
    {
        this.m_parent_game=  parentgame;
        this.m_node = pnode;
        this.m_move_vec = movevec;
    }
    //设置移动速度
    SetMoveSpeed(movespeed:number)
    {
        this.m_move_speed = movespeed;
    }
    //删除子弹
    DeleteSelf()
    {
        if(this.m_node)
        {
            this.m_node.destroy();
            this.m_node = null;
        }
    }
    //判断是否与多边形相交
    CanKillPeopleInRC( people_poly_pt_list:cc.Vec2[])
    {
        var selfrc:cc.Rect = this.GetBoundRC();

        if(cc.Intersection.rectPolygon(selfrc,people_poly_pt_list))
        {
            return true;
        }

        return false;
    }
    //设置已经杀死小人标记
    SetKilledPeople()
    {
        this.m_b_killed_people=  1;
    }
    //判断子弹是否已经失效需要删除了，如果杀死小人或者跑出屏幕外都失效
    Check_IS_In_View_Range_Valid():boolean
    {
        var pos=  this.m_node.getPosition();
        var newx = pos.x;
        var newy = pos.y  ;
    
        var bvalid = true;
        if(newx > 1000 || newx< -1000)
        {
            bvalid = false;
        }

        if(newy > 1000 || newy< -1000)
        {
            bvalid = false;
        }

        if(this.m_b_killed_people)
        {
            bvalid = false;
        }

        return bvalid;
    }

    //移动子弹
    Update_Move_Tick(dt:number)
    {
        var pos = this.m_node.getPosition();
        var nov = this.m_move_vec.normalize();

        var newx = pos.x + nov.x * this.m_move_speed *dt ;
        var newy = pos.y + nov.y * this.m_move_speed *dt ;
        this.m_node.setPosition(newx,newy);


     

    }

    //绘制子弹区域，正式上线后不再使用
    RedrawValidPoloyRegin(grphic:cc.Graphics)
    {
         var rc:cc.Rect = this.m_node.getBoundingBox();
 
      //下方绘制
        Utils.Draw_RC(rc,grphic);

    }

    //或者子弹的碰撞区域
    GetBoundRC()
    {
        var rc:cc.Rect = this.m_node.getBoundingBox();

     
        return rc;
    }
}