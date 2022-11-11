
const {ccclass, property} = cc._decorator;
import EscapeMng from "../game/EscapeMng";

@ccclass
export default class GetSkinView extends cc.Component {

    
    m_plisnter = null;
    curHeroId: number = 0;

    onLoad() {
        this.node.setScale(0, 0);
        this.node.runAction(cc.scaleTo(0.3, 1, 1));
    }

    start () {
        var btnSkin = cc.find("btn_next", this.node);
        btnSkin.on("click", this.OnClose.bind(this));

        var anniu = cc.find("anniu", this.node);
        anniu.on("click", this.OnClickAds.bind(this));

        var m_BtnNext = cc.find("btn_next", this.node);
        m_BtnNext.setScale(0, 0, 0);
        var pseq = cc.sequence(cc.delayTime(3), cc.scaleTo(0.5, 1, 1), cc.callFunc(() => {

        }));
        m_BtnNext.runAction(pseq);
    }

    onInitView(lisnter, iconID, iconPos) {
        this.m_plisnter = lisnter;

        var heroNode = this.node.getChildByName("img_herobg");
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
        EscapeMng.GetInstance().Set_HasSkins(this.curHeroId, 0);
        this.OnClose();
    }
}
