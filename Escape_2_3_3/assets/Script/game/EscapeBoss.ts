import InterceptUtils from "../utils/InterceptUtils";
const { ccclass, property } = cc._decorator;
import Utils from "../utils/Utils";
import SpineManager from "../utils/SpineManager";

@ccclass
export default class EscapeBoss {


    //�˵Ľڵ�
    m_node: cc.Node = null;
    //��ӦBoss��������Ϣ
    m_info = null;

    m_txtBlood: cc.Label = null;
    m_spCom: sp.Skeleton = null;
    m_slider: cc.ProgressBar = null;

    m_blood: number = 0;

    isDeath: boolean = false;

    m_totalBlood: number = 0;

    isBeAss: boolean = false;

    reduceHp: number = 8; //û������Ѫ����һ�ι���
    reduceCount: number = 0; //�ﵽ���ٵ�Ѫ��Ҫ��ͽ��й���

    m_parentFunc = null;


    Init(parentFunc ,pnode: cc.Node, pinfo, strTxt: cc.Label, BossSlider: cc.ProgressBar, totolNum: number ) {
        this.m_node = pnode;
        this.m_info = pinfo;
        this.m_txtBlood = strTxt;
        this.m_slider = BossSlider;
        this.m_totalBlood = totolNum;
        this.m_blood = totolNum;
        this.SetText(this.m_totalBlood);
        this.m_parentFunc = parentFunc;
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

    TurnScale() {
        this.m_node.setScale(-1, 1);
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

    FateAttack() {
        //this.Set_Node_Animate("gongji", 2, () => {
        //    this.Set_Node_Animate("gongji2");
        //});
        this.Set_Node_Animate("gongji", 2, () => {
            this.Set_Node_Animate("daiji");
            this.m_parentFunc.BossEndAttack();
            this.isBeAss = false;
        });
        
    }


    FateDeath() {
        this.Set_Node_Animate("siwang", 2, () => {
            this.m_node.destroy();
            this.m_node = null;
        });
    }

    //�����˹���������ʾ
    Set_Node_Animate(aniname: string, index: number = 1, callBack: Function = null) {
        if (this.m_spCom) {
            this.m_spCom.unscheduleAllCallbacks();
            this.m_spCom.setToSetupPose();
            if (index == 1) {
                this.m_spCom.loop = true;
            }
            else {
                this.m_spCom.loop = false;
            }
            this.m_spCom.setAnimation(0, "" + aniname, index == 1);
            if (callBack) {
                this.m_spCom.setCompleteListener(callBack);
            } 
            return;
        }
        var wnode = this.m_node.getChildByName("b");
        this.m_spCom = wnode.getComponent(sp.Skeleton);
        this.m_spCom.setToSetupPose();

        if (index == 1) {
            this.m_spCom.loop = true;
        }
        else {
            this.m_spCom.loop = false;
        }

        this.m_spCom.unscheduleAllCallbacks();

        if (callBack) {
            this.m_spCom.setCompleteListener(callBack);
        } 

        this.m_spCom.setAnimation(0, "" + aniname, index == 1);
        
    }

    BeAssaulted(blood: number) {
        if (!this.isBeAss) {
            this.isBeAss = true;
            var self = this
            this.m_parentFunc.CoinBossAni();
            this.Set_Node_Animate("shouji", 2, function () {
                self.isBeAss = false;
                self.Set_Node_Animate("daiji")
            });
        }
        //this.reduceCount ++ ;
        //if (this.reduceHp <= this.reduceCount || blood == 0) { // ���й���
        //    var count = this.reduceCount;
        //    this.reduceCount = 0;
        //    this.m_parentFunc.BossAttack(count);
        //    this.FateAttack()
        //}
        this.SetText(blood);
    }

    //���ý�ɫѪ��
    SetText(blood: number) {      

        let num = (blood / this.m_totalBlood);
        this.m_slider.progress = Number(num.toFixed(2));

        if (this.m_txtBlood) {
            this.m_txtBlood.string = "[" + blood + "]";
            return;
        }        
        var wnode = this.m_node.getChildByName("txt_blood");
        this.m_txtBlood = wnode.getComponent(cc.Label);
        this.m_txtBlood.string = "[" + blood + "]";    
    }


    //�ж��Ƿ��������ཻ
    CanKillPeopleInRC(people_poly_pt_list: cc.Vec2[]) {
        var selfrc: cc.Rect = this.GetBoundRC();

        if (cc.Intersection.rectPolygon(selfrc, people_poly_pt_list)) {
            return true;
        }

        return false;
    }



}
