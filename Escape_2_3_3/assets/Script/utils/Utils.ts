//工具类
export default class Utils
{
    //设置节点图片尺寸
    static ShowNodePic(pnode,sfilename,size = null,callback= null){
        cc.loader.loadRes(sfilename, cc.SpriteFrame, 
            (err, spriteFrame) =>{
                if(err)
                {
                    if(callback)
                    {
                        callback();
                    }
                   
                    console.log("err:"+err);
                    return;
                }
                
                var psrite = pnode.getComponent(cc.Sprite);
                psrite.spriteFrame = spriteFrame;

                if(size){
                    pnode.width = size.cx;
                    pnode.height = size.cy;
                }

                if(callback)
                {
                    callback();
                }
           });
    }
    //判断矩形是否与圆相交
    static IS_RC_Intercept_Cicle(rc:cc.Rect,center_cicle_pt:cc.Vec2,cicle_radius:number)
    {
        var ptlist = [];
        ptlist.push(new cc.Vec2(rc.xMin,rc.yMax));
        ptlist.push(new cc.Vec2(rc.xMax,rc.yMax));
        ptlist.push(new cc.Vec2(rc.xMax,rc.yMin));
        ptlist.push(new cc.Vec2(rc.xMin,rc.yMin));

        if(cc.Intersection.polygonCircle(ptlist,{position:center_cicle_pt,radius:cicle_radius}))
        {
            return true;
        }

        return false;


    }
    //获得矩形的多边形点列表
    static Get_RC_PolyPtList(rc:cc.Rect)
    {
        var ptlist = [];
        ptlist.push(new cc.Vec2(rc.xMin,rc.yMax));
        ptlist.push(new cc.Vec2(rc.xMax,rc.yMax));
        ptlist.push(new cc.Vec2(rc.xMax,rc.yMin));
        ptlist.push(new cc.Vec2(rc.xMin,rc.yMin));
        ptlist.push(new cc.Vec2(rc.xMin,rc.yMax));
     
        return ptlist;
    }
    //绘制矩形
    static Draw_RC(rc:cc.Rect,grphic:cc.Graphics)
    {
        var ptlist = [];
        ptlist.push(new cc.Vec2(rc.xMin,rc.yMax));
        ptlist.push(new cc.Vec2(rc.xMax,rc.yMax));
        ptlist.push(new cc.Vec2(rc.xMax,rc.yMin));
        ptlist.push(new cc.Vec2(rc.xMin,rc.yMin));
        ptlist.push(new cc.Vec2(rc.xMin,rc.yMax));
     


        Utils.Draw_Pt_List(ptlist,grphic);
    }

    //绘制多边形
    static Draw_Pt_List(transfer_pt_list:cc.Vec2[],grphic:cc.Graphics)
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

    //判断两个点是不是及其相近的两个点
    static TooNearSamePT(pt1,pt2)
    {
        if(  Math.abs(pt1.x - pt2.x) < 0.00000001   )
        {
            if(  Math.abs(pt1.y - pt2.y) < 0.00000001   )
            {
                return true;
            }
        }

        return false;
    }
}