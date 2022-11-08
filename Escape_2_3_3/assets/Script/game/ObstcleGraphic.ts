import WSize from "../utils/WSize";


/*
障碍物绘制grahic,绘制显示各个障碍物的包围盒，正式上线不用
*/
const {ccclass, property} = cc._decorator;


@ccclass
export default class ObstcleGraphic extends cc.Component {

 
    graphics: cc.Graphics = null;

    m_all_rect_list = [];

    m_all_circle_list = [];
 
    
    onLoad () 
    {
        this.graphics = this.node.getComponent(cc.Graphics);
  

    }
    RedrawAll()
    {
       
        this.graphics.clear(true);
        for(var ff=0;ff<this.m_all_rect_list.length;ff++)
        {
            var ff_rc= this.m_all_rect_list[ff];

            this.graphics.moveTo(ff_rc[0],ff_rc[1]);
 
            this.graphics.lineTo(ff_rc[0] + ff_rc[2],ff_rc[1] );
            this.graphics.lineTo(ff_rc[0] + ff_rc[2],ff_rc[1] + ff_rc[3] );
            this.graphics.lineTo(ff_rc[0],ff_rc[1] + ff_rc[3] );
            this.graphics.lineTo(ff_rc[0] ,ff_rc[1] );
      


        }


        for(var ff=0;ff<this.m_all_circle_list.length;ff++)
        {
            var ff_circle = this.m_all_circle_list[ff];

            this.graphics.circle(ff_circle[0],ff_circle[1],ff_circle[2]);
        }

         this.graphics.stroke();
         


    }
    AddRect(leftpt:cc.Vec2,ccsize:WSize)
    {
        this.m_all_rect_list.push([leftpt.x,leftpt.y,ccsize.width,ccsize.height]);

        this.RedrawAll();

    }
    AddCirCle(centerpt:cc.Vec2,radius:number)
    {
        this.m_all_circle_list.push([centerpt.x,centerpt.y,radius]);
        this.RedrawAll();
    }

}
