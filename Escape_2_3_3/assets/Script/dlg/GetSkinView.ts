
const {ccclass, property} = cc._decorator;
import EscapeMng from "../game/EscapeMng";
import { FirebaseReport, FirebaseKey } from "../utils/FirebaseReport";

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

        var anniu = cc.find("Frame/anniu", this.node);
        anniu.on("click", this.OnClickAds.bind(this));

        var m_BtnNext = cc.find("Frame/btn_next", this.node);
        m_BtnNext.setScale(0, 0, 0);
        var pseq = cc.sequence(cc.delayTime(3), cc.scaleTo(0.5, 1, 1), cc.callFunc(() => {

        }));
        m_BtnNext.runAction(pseq);
    }

    onInitView(lisnter, iconID, iconPos) {
        this.m_plisnter = lisnter;

        var heroNode = cc.find("Frame/img_herobg", this.node);
        this.curHeroId = iconID;//EscapeMng.GetInstance().Get_NoHasHero();
        var iconPath = "game/heroicon/side/" + this.curHeroId;
        cc.loader.loadRes(iconPath, cc.SpriteFrame, (err, sp) => {
            heroNode.getComponent(cc.Sprite).spriteFrame = sp as cc.SpriteFrame;
        })
        heroNode.setPosition(iconPos, 80.788);
    }

    OnClickClose() {
        if (cc.sys.platform === cc.sys.ANDROID) {
            FirebaseReport.reportInformation(FirebaseKey.shengli_ad3_skin);
            let bAdLoaded = jsb.reflection.callStaticMethod("org/cocos2dx/javascript/InterstitialAdManager", "JsCall_hadLoadedAd", "()Z");
            if (bAdLoaded) {
                jsb.reflection.callStaticMethod("org/cocos2dx/javascript/InterstitialAdManager", "JsCall_showAdIfAvailable", "(Ljava/lang/String;)V", "cc['getSkinView'].CallJaveNClosePanel()");
            }
            else {
                FirebaseReport.reportInformation(FirebaseKey.shengli_ad3_skin_2);
            }
        }
        else {
            this.onSaveClose();
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

        if (cc.sys.platform === cc.sys.ANDROID) {
            FirebaseReport.reportInformation(FirebaseKey.shengli_ad2_skin);
            let bAdLoaded = jsb.reflection.callStaticMethod("org/cocos2dx/javascript/RewardedAdManager", "JsCall_hadLoadedAd", "()Z");
            if (bAdLoaded) {
                jsb.reflection.callStaticMethod("org/cocos2dx/javascript/RewardedAdManager", "JsCall_showAdIfAvailable", "(Ljava/lang/String;)V", "cc['getSkinView'].CallJaveClosePanel()");
            }
            else {
                FirebaseReport.reportInformation(FirebaseKey.shengli_ad2_skin_2);
            }            
        }
        else {
            this.onSaveClose();
        }  
    
    }

    onSaveClose() {
        EscapeMng.GetInstance().Set_HasSkins(this.curHeroId, 0);
        this.OnClose();
    }

    public static CallJaveClosePanel() {
        FirebaseReport.reportInformation(FirebaseKey.shengli_ad2_skin_1);
        GetSkinView.getInstance().onSaveClose();
    }
}
