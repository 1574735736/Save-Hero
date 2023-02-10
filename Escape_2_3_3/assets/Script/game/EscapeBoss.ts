import InterceptUtils from "../utils/InterceptUtils";
const { ccclass, property } = cc._decorator;
import Utils from "../utils/Utils";

@ccclass
export default class EscapeBoss {


    //�˵Ľڵ�
    m_node: cc.Node = null;
    //��ӦBoss��������Ϣ
    m_info = null;

    m_txtBlood: cc.Label = null;
    m_spCom: sp.Skeleton = null;
  
    Init(pnode: cc.Node, pinfo) {
        this.m_node = pnode;
        this.m_info = pinfo;
    }

    //�����ӵ�������ʽ���ߺ���ʹ��
    RedrawValidPoloyRegin(grphic: cc.Graphics) {
        var rc: cc.Rect = this.m_node.getBoundingBox();


        Utils.Draw_RC(rc,grphic);

    }

    //�����ӵ�����ײ����
    GetBoundRC() {
        var rc: cc.Rect = this.m_node.getBoundingBox();
        return rc;
    }

    ////��������ĵ㣬��ʽ���߲���
    //RedrawValidPoloyRegin(grphic: cc.Graphics) {
    //    var pos = this.m_node.getPosition();
    //    var people_poly_pt_list: cc.Vec2[] = InterceptUtils.Get_Valid_Bound_Poly_Pt_List(pos, this.m_info.valid_w, this.m_info.valid_h, this.m_node.angle);


    //    this.Draw_Pt_List(people_poly_pt_list, grphic);
    //}

    ////�������İ�Χ�е��б�,����������������ײ���
    //Get_Valid_Bound_Poly_Pt_List(): cc.Vec2[] {
    //    var polplist = InterceptUtils.Get_Valid_Bound_Poly_Pt_List(this.m_node.getPosition(), this.m_info.valid_w, this.m_info.valid_h, this.m_node.angle);
    //    return polplist;
    //}
    ////��������ĵ㣬��ʽ���߲���
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

    //�������ű���
    SetScale(s: number, index: number = 1) {
        var wnode = this.m_node.getChildByName("b");
        wnode.scale = s;

    }

    //�����˹���������ʾ
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

    //���ý�ɫѪ��
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
