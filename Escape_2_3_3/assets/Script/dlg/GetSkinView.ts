
const {ccclass, property} = cc._decorator;
import EscapeMng from "../game/EscapeMng";
import { FirebaseReport, FirebaseKey, FireKeys } from "../utils/FirebaseReport";
import SpineManager from "../utils/SpineManager";
import sdkManager from "../game/SdkManager";
import BackGroundSoundUtils from "../utils/BackGroundSoundUtils";

@ccclass
export default class GetSkinView extends cc.Component {

    
    m_plisnter = null;
    curHeroId: number = 0;


    private static _instance: GetSkinView = null;

    public static getInstance(): GetSkinView {
        if (GetSkinView._instance == null) {
            GetSkinView._instance = new GetSkinView();
        }
        return GetSkinView._instance;
    }

    onLoad() {
        GetSkinView._instance = this;
        var frame = this.node.getChildByName("Frame");
        frame.setScale(0, 0);
        frame.runAction(cc.scaleTo(0.3, 1, 1));
    }

    start () {
        var btnSkin = cc.find("Frame/btn_next", this.node);
        btnSkin.on("click", this.OnClickClose.bind(this));

        var anniu = cc.find("Frame/btn_ads", this.node);
        anniu.on("click", this.OnClickAds.bind(this));

        var m_BtnNext = cc.find("Frame/btn_next", this.node);
        var m_Light = cc.find("Frame/img_light", this.node);
       
        m_BtnNext.active = false
        this.scheduleOnce(() => {
            m_BtnNext.active = true;
            m_BtnNext.opacity = 0;
            var pseq = cc.sequence(cc.fadeTo(0.5, 255), cc.callFunc(() => {
            }));
            m_BtnNext.runAction(pseq);
        }, 2);

        var que = cc.repeatForever(cc.rotateBy(3, 360));
        m_Light.runAction(que);
    }

    onInitView(lisnter, iconID) {
        this.m_plisnter = lisnter;
        this.curHeroId = iconID;
        var self = this;
        cc.loader.loadRes("prefab/p" + iconID, cc.Prefab, (err, sp) => {
            var pnode = cc.instantiate(sp as cc.Prefab);
            self.node.addChild(pnode, 60);
            var p = pnode.getChildByName("p");
            p.setScale(1, 1);
            pnode.setPosition(0, -100);
        })
      
    }

    OnClickClose() {
        BackGroundSoundUtils.GetInstance().PlayEffect("effect_button");
        var status = EscapeMng.GetInstance().GetIntAdStatus();
        if (cc.sys.platform === cc.sys.ANDROID && status == true) {
            FirebaseReport.reportKeys(FireKeys.win_SkinNo);
            //FirebaseReport.reportInformation(FirebaseKey.shengli_ad3_skin);

            //let bAdLoaded = jsb.reflection.callStaticMethod("org/cocos2dx/javascript/InterstitialAdManager", "JsCall_hadLoadedAd", "()Z");
            //if (bAdLoaded) {
            //    jsb.reflection.callStaticMethod("org/cocos2dx/javascript/InterstitialAdManager", "JsCall_showAdIfAvailable", "(Ljava/lang/String;)V", "cc['getSkinView'].CallJaveNClosePanel()");
            //}
            //else {
            //    FirebaseReport.reportInformation(FirebaseKey.shengli_ad3_skin_2);
            //    this.onSaveClose();
            //}
            sdkManager.GetInstance().JavaInterstitialAds("shengli_ad3_skin", () => {
                //FirebaseReport.reportInformation(FirebaseKey.shengli_ad3_skin_1);
                GetSkinView.getInstance().OnClose();
            }, null);
        }
        else {
            this.OnClose();
        } 
       
    }

    OnClose() {
        this.m_plisnter.OnGoBack();
        this.node.destroy();
    }

    public static CallJaveNClosePanel() {
        FirebaseReport.reportInformation(FirebaseKey.shengli_ad3_skin_1);
        GetSkinView.getInstance().OnClose();
    }

    OnClickAds() {

        //if (cc.sys.platform === cc.sys.ANDROID) {
        //    FirebaseReport.reportInformation(FirebaseKey.shengli_ad2_skin);
        //    let bAdLoaded = jsb.reflection.callStaticMethod("org/cocos2dx/javascript/RewardedAdManager", "JsCall_hadLoadedAd", "()Z");
        //    if (bAdLoaded) {
        //        jsb.reflection.callStaticMethod("org/cocos2dx/javascript/RewardedAdManager", "JsCall_showAdIfAvailable", "(Ljava/lang/String;)V", "cc['getSkinView'].CallJaveClosePanel()");
        //    }
        //    else {
        //        FirebaseReport.reportInformation(FirebaseKey.shengli_ad2_skin_2);
        //    }
        //}
        //else {
        //    this.onSaveClose();

        //}
        BackGroundSoundUtils.GetInstance().PlayEffect("effect_button");
        FirebaseReport.reportKeys(FireKeys.win_GetSkin);

        sdkManager.GetInstance().JavaRewardedAds("shengli_ad2_skin",()=>{this.onSaveClose();} , null);
    }

    onSaveClose() {
        EscapeMng.GetInstance().Set_HasSkins(this.curHeroId, 0);
        EscapeMng.GetInstance().SetIntAdStatus();
        EscapeMng.GetInstance().Set_Hero(this.curHeroId);
        this.OnClose();
    }

    public static CallJaveClosePanel() {
        FirebaseReport.reportInformation(FirebaseKey.shengli_ad2_skin_1);
        GetSkinView.getInstance().onSaveClose();        
    }
}
