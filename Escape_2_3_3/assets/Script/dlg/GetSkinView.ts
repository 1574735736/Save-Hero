
const {ccclass, property} = cc._decorator;
import EscapeMng from "../game/EscapeMng";

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
        btnSkin.on("click", this.OnClose.bind(this));

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


    OnClose() {
        this.m_plisnter.OnGoBack();
        this.node.destroy();
    }

    OnClickAds() {

        if (cc.sys.platform === cc.sys.ANDROID) {
            jsb.reflection.callStaticMethod("org/cocos2dx/javascript/RewardedAdManager", "JsCall_showAdIfAvailable", "(Ljava/lang/String;)V", "cc['getSkinView'].CallJaveClosePanel()");
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
        GetSkinView.getInstance().onSaveClose();
    }
}
