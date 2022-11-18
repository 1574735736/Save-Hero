

const { ccclass, property } = cc._decorator;
import EscapeMng from "../game/EscapeMng";
import Start from "../load/start";
import Game from "../game/game";

@ccclass
export default class SkinView extends cc.Component {
   

     
    coinCount: cc.Label = null;
    curClick: number = 1;
    content: cc.Node = null;
    item: cc.Node = null;
    tophero: cc.Node = null;
    iconPos: cc.Vec3[] = [
        new cc.Vec3(94.039, 246.665),
        new cc.Vec3(31.8, 206.209),
        new cc.Vec3(28.021, 266.892),
        new cc.Vec3(16.163, 211.972),
        new cc.Vec3(-42.964, 261.764),
        new cc.Vec3(6.828, 261.764),
        new cc.Vec3(-0.952, 261.764),
        new cc.Vec3(-0.952, 215.084),
        new cc.Vec3(-65.51, 207.179),
        new cc.Vec3(-65.51, 202.839),
    ] 

    m_HeroNote: cc.Node[] = [];

    private static _instance: SkinView = null;

    public static getInstance(): SkinView {
        if (SkinView._instance == null) {
            SkinView._instance = new SkinView();
        }
        return SkinView._instance;
    }

    onLoad() {
        SkinView._instance = this;
        this.node.setScale(0, 0);
        this.node.runAction(cc.scaleTo(0.3, 1, 1));
    }

    start () {

        var jinbi = cc.find("jb/Gold", this.node);
        this.coinCount = jinbi.getComponent(cc.Label)
        this.onUpdateCoin();
        var guangbi = this.node.getChildByName("btn_return");
        guangbi.on("click", this.OnBtnExit.bind(this));
        this.content = cc.find("ScrollView/view/content", this.node);
        this.item = cc.find("Item", this.node)
        this.tophero = cc.find("top/tophero", this.node);
        this.onInitScroll();
        this.onUpdateTopHero();        
    }


    onUpdateCoin() {
        var coin = EscapeMng.GetInstance().Get_Gold_Coin();
        this.coinCount.string = "" + coin        
    }

    onUpdateTopHero() {

        var curHiroId = EscapeMng.GetInstance().Get_Hero();
        this.onSetIcon("top/tophero", "game/heroicon/noside/" + curHiroId);
        this.tophero.position = this.iconPos[curHiroId - 1];
       
        this.OnUpdateMenuStatus()
    }

    // update (dt) {}

    OnBtnExit() {
        if (cc.director.getScene().name == "start") {
            Start.getInstance().onUpdateHero();
            Start.getInstance().onUpdateCoin();
        }        
        else if (cc.director.getScene().name == "game") {
            Game.getInstance().onUpdateHero();
        }
        var actionScale = cc.sequence(cc.scaleTo(0.3, 0, 0), cc.callFunc(() => {
            this.node.destroy();
        }));//.easing(cc.easeQuarticActionOut)
        this.node.runAction(actionScale);
    }

    onSetIcon(nodePath: string, iconPath: string) {
        var nt = cc.find(nodePath, this.node).getComponent(cc.Sprite);
        cc.loader.loadRes(iconPath, cc.SpriteFrame, (err, sp) => {
            nt.spriteFrame = sp as cc.SpriteFrame;
        })
    }

    onInitScroll() {        
        for (var i = 1; i <= 10; i++) {
          
            //var btnSkin = cc.find("ScrollView/view/content/Item" + i + "/btn_change", this.node);
            //btnSkin.on("click", this.OnBtnAction.bind(this,i));

            var Item = cc.find("ScrollView/view/content/Item" + i, this.node);
            this.m_HeroNote.push(Item);
            var btChange = Item.getChildByName("btn_change");
            btChange.on("click", this.OnBtnAction.bind(this, i));
            var btBuy = Item.getChildByName("btn_buy");
            btBuy.on("click", this.OnBtnBuy.bind(this, i));
            var btAds = Item.getChildByName("btn_ads");
            btAds.on("click", this.OnBtnShowAds.bind(this, i));
            
        }
    }

    OnBtnAction(clickID: number) {
        EscapeMng.GetInstance().Set_Hero(clickID);
        this.onUpdateTopHero();
    }

    OnBtnBuy(clickID: number) {
        var coin = EscapeMng.GetInstance().Get_Gold_Coin()
        if (coin < EscapeMng.GetInstance().m_DefaultBuy_Coin) {
            return;
        }
        coin = coin - EscapeMng.GetInstance().m_DefaultBuy_Coin;
        EscapeMng.GetInstance().Set_Gold_Coin(coin);
        EscapeMng.GetInstance().Set_HasSkins(clickID, 0);
        this.OnUpdateMenuStatus();
        this.onUpdateCoin();
    }

    curClickId: number = 0;
    OnBtnShowAds(clikID: number) {
        this.curClickId = clikID;
        if (cc.sys.platform === cc.sys.ANDROID) {
            jsb.reflection.callStaticMethod("org/cocos2dx/javascript/RewardedAdManager", "JsCall_showAdIfAvailable", "(Ljava/lang/String;)V", "cc['skinView'].CallJaveGetSkin()");
        }
        else {
            this.OnChangeAdsShinStatus();
        }       
    }

    OnChangeAdsShinStatus() {
        EscapeMng.GetInstance().Set_HasSkins(this.curClickId, 0);
        this.OnUpdateMenuStatus();
    }

    public static CallJaveGetSkin() {
        SkinView.getInstance().OnChangeAdsShinStatus();
    }

    OnUpdateMenuStatus() {
        var curHiroId = EscapeMng.GetInstance().Get_Hero();
        var coin = EscapeMng.GetInstance().Get_Gold_Coin()

        //var curTable = EscapeMng.GetInstance().Get_SkinStatus();
        var count = EscapeMng.GetInstance().Get_ShinStatusCount();
  
        for (var i = 0; i < EscapeMng.GetInstance().m_Skins_Count; i++) {
            this.m_HeroNote[i].getChildByName("btn_nohave").active = false;
            this.m_HeroNote[i].getChildByName("btn_buy").active = false;
            this.m_HeroNote[i].getChildByName("btn_change").active = false;
            this.m_HeroNote[i].getChildByName("btn_ads").active = false;
            if (EscapeMng.GetInstance().Get_SkinStatusHas(i + 1)) {
                var curTable: number = EscapeMng.GetInstance().Get_SkinStatusType(i + 1);
                if (curHiroId == i + 1) {

                }
                else {
                    if (curTable == 1) {
                        this.m_HeroNote[i].getChildByName("btn_ads").active = true;
                    }
                    else {
                        this.m_HeroNote[i].getChildByName("btn_change").active = true;
                    }
                }
            }
            else {
                if (coin < EscapeMng.GetInstance().m_DefaultBuy_Coin) {
                    this.m_HeroNote[i].getChildByName("btn_nohave").active = true;
                }
                else {
                    this.m_HeroNote[i].getChildByName("btn_buy").active = true;
                }
            }          
        }
    }
    
}
