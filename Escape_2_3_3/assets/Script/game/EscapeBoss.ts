import InterceptUtils from "../utils/InterceptUtils";
const { ccclass, property } = cc._decorator;
import Utils from "../utils/Utils";

@ccclass
export default class EscapeBoss {


    //人的节点
    m_node: cc.Node = null;
    //对应Boss的配置信息
    m_info = null;

    m_txtBlood: cc.Label = null;
    m_spCom: sp.Skeleton = null;
  
    Init(pnode: cc.Node, pinfo) {
        this.m_node = pnode;
        this.m_info = pinfo;
    }

    //绘制子弹区域，正式上线后不再使用
    RedrawValidPoloyRegin(grphic: cc.Graphics) {
        var rc: cc.Rect = this.m_node.getBoundingBox();


        Utils.Draw_RC(rc,grphic);

    }

    //或者子弹的碰撞区域
    GetBoundRC() {
        var rc: cc.Rect = this.m_node.getBoundingBox();
        return rc;
    }

    ////绘制自身的点，正式上线不用
    //RedrawValidPoloyRegin(grphic: cc.Graphics) {
    //    var pos = this.m_node.getPosition();
    //    var people_poly_pt_list: cc.Vec2[] = InterceptUtils.Get_Valid_Bound_Poly_Pt_List(pos, this.m_info.valid_w, this.m_info.valid_h, this.m_node.angle);


    //    this.Draw_Pt_List(people_poly_pt_list, grphic);
    //}

    ////获得自身的包围盒点列表,用于与其他物体碰撞检测
    //Get_Valid_Bound_Poly_Pt_List(): cc.Vec2[] {
    //    var polplist = InterceptUtils.Get_Valid_Bound_Poly_Pt_List(this.m_node.getPosition(), this.m_info.valid_w, this.m_info.valid_h, this.m_node.angle);
    //    return polplist;
    //}
    ////绘制自身的点，正式上线不用
    //Draw_Pt_List(transfer_pt_list, grphic: cc.Graphics) {

    //    for (var ff = 0; ff < transfer_pt_list.length; ff++) {
    //        var ff_pt = transfer_pt_list[ff];
    //        if (ff == 0) {
    //            grphic.moveTo(ff_pt.x, ff_pt.y);
    //        } else {
    //            grphic.lineTo(ff_pt.x, ff_pt.y);
    //        }
    //    }

    //    var firstpt = transfer_pt_list[0];

    //    grphic.lineTo(firstpt.x, firstpt.y);
    //    grphic.stroke();

    //}

    //设置缩放比例
    SetScale(s: number, index: number = 1) {
        var wnode = this.m_node.getChildByName("b");
        wnode.scale = s;

    }

    //设置人骨骼动画显示
    Set_Node_Animate(aniname: string, index: number = 1) {
        if (this.m_spCom) {
            this.m_spCom.setToSetupPose();
            this.m_spCom.setAnimation(0, "" + aniname, true);
            return;
        }
        var wnode = this.m_node.getChildByName("b");
        this.m_spCom = wnode.getComponent(sp.Skeleton);
        this.m_spCom.setToSetupPose();
        this.m_spCom.setAnimation(0, "" + aniname, true);
  
    }

    //设置角色血量
    SetText(blood: number) {
        if (this.m_txtBlood) {
            this.m_txtBlood.string = "" + blood;
            return;
        }
        var wnode = this.m_node.getChildByName("txt_blood");
        this.m_txtBlood = wnode.getComponent(cc.Label);
        this.m_txtBlood.string = "" + blood;       
    }
    
}
