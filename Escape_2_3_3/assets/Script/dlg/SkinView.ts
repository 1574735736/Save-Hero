

const { ccclass, property } = cc._decorator;
import EscapeMng from "../game/EscapeMng";
//import Start from "../load/start";
//import Game from "../game/game";
import { FirebaseReport, FirebaseKey, FireKeys } from "../utils/FirebaseReport";
import sdkManager from "../game/SdkManager";
import BackGroundSoundUtils from "../utils/BackGroundSoundUtils";

@ccclass
export default class SkinView extends cc.Component {   
     
    coinCount: cc.Label = null;
    curClick: number = 1;
    content: cc.Node = null;
    item: cc.Node = null;
    tophero: cc.Node = null;

    m_HeroNote: cc.Node[] = [];

    m_CurPrefab = null;

    private static _instance: SkinView = null;
    curClickId: number = -1;

    public static getInstance(): SkinView {
        if (SkinView._instance == null) {
            SkinView._instance = new SkinView();
        }
        return SkinView._instance;
    }

    onLoad() {
        SkinView._instance = this;
        this.node.setScale(0, 0);
        this.node.runAction(cc.scaleTo(0.5, 1, 1).easing(cc.easeBackOut()));
    }

    start () {

        var jinbi = cc.find("jb/Gold", this.node);
        this.coinCount = jinbi.getComponent(cc.Label)
        this.onUpdateCoin();
        var guangbi = this.node.getChildByName("btn_return");
        guangbi.on("click", this.OnBtnExit.bind(this));
        this.content = cc.find("ScrollView/view/content", this.node);

        this.tophero = cc.find("img_hero", this.node);
        this.tophero.active = false;
        this.onInitScroll();
        this.OnUpdateMenuStatus();
        //this.onUpdateTopHero();        
    }


    onUpdateCoin() {
        var coin = EscapeMng.GetInstance().Get_Gold_Coin();
        this.coinCount.string = "" + coin        
    }

    //onUpdateTopHero() {

    //    var curHiroId = EscapeMng.GetInstance().Get_Hero();
    //    //this.onSetIcon("img_hero", "game/heroicon/noside/" + curHiroId);
               
    //    this.OnUpdateMenuStatus()
    //}
    

    // update (dt) {}

    OnBtnExit() {
        //if (cc.director.getScene().name == "start") {
        //    Start.getInstance().onUpdateHero();
        //    Start.getInstance().onUpdateCoin();
        //}
        //else if (cc.director.getScene().name == "game") {
        //    Game.getInstance().onUpdateHero();
        //}
        BackGroundSoundUtils.GetInstance().PlayEffect("effect_button");
        var actionScale = cc.sequence(cc.scaleTo(0.5, 0, 0).easing(cc.easeBackIn()), cc.callFunc(() => {
            this.node.destroy();
        }));//.easing(cc.easeQuarticActionOut)
        this.node.runAction(actionScale);
        //FirebaseReport.reportInformation(FirebaseKey.skin_ranbui);
        FirebaseReport.reportKeys(FireKeys.skin_BackMain);
    }

    onSetIcon(nodePath: string, iconPath: string) {
        var nt = cc.find(nodePath, this.node).getComponent(cc.Sprite);
        cc.loader.loadRes(iconPath, cc.SpriteFrame, (err, sp) => {
            nt.spriteFrame = sp as cc.SpriteFrame;
        })
    }

    onInitScroll() {
        var curHiroId = EscapeMng.GetInstance().Get_Hero();
        
        for (var i = 1; i <= EscapeMng.GetInstance().m_Skins_Count; i++) {
          
            //var btnSkin = cc.find("ScrollView/view/content/Item" + i + "/btn_change", this.node);
            //btnSkin.on("click", this.OnBtnAction.bind(this,i));

            var Item = cc.find("ScrollView/view/content/Item" + i, this.node);
            this.m_HeroNote.push(Item);
            var btChange = Item.getChildByName("btn_use");
            btChange.on("click", this.OnBtnAction.bind(this, i));
            var btBuy = Item.getChildByName("btn_buy");
            btBuy.on("click", this.OnBtnBuy.bind(this, i));
            var btAds = Item.getChildByName("btn_ads");
            btAds.on("click", this.OnBtnShowAds.bind(this, i));
            var btIcon = Item.getChildByName("frame1");
            btIcon.on("click", this.OnBtnShowBigHero.bind(this, i));
            Item.getChildByName("frame1").active = curHiroId != i;
            Item.getChildByName("frame2").active = curHiroId == i;
            
        }
        this.OnUpdateFrame(curHiroId);
    }

    OnBtnAction(clickID: number) {
        BackGroundSoundUtils.GetInstance().PlayEffect("effect_button");
        this.OnUpdateFrame(clickID);
        EscapeMng.GetInstance().Set_Hero(clickID);
        //this.onUpdateTopHero();
        this.OnUpdateMenuStatus();
    }

    OnBtnShowBigHero(clickID: number) {
        BackGroundSoundUtils.GetInstance().PlayEffect("effect_button");
        this.OnUpdateFrame(clickID);
        if (EscapeMng.GetInstance().Get_SkinStatusHas(clickID)) {
            var curTable: number = EscapeMng.GetInstance().Get_SkinStatusType(clickID);
            if (curTable != 1) {
                this.OnBtnAction(clickID);
                return;
            }
        }        
       // this.onSetIcon("img_hero", "game/heroicon/noside/" + clickID);
    }

    OnBtnBuy(clickID: number) {
        BackGroundSoundUtils.GetInstance().PlayEffect("effect_button");
        FirebaseReport.reportKeys(FireKeys.skin_Goumai);
        this.OnUpdateFrame(clickID);
        var coin = EscapeMng.GetInstance().Get_Gold_Coin()
        if (coin < EscapeMng.GetInstance().m_DefaultBuy_Coin) {
            return;
        }
        coin = coin - EscapeMng.GetInstance().m_DefaultBuy_Coin;
        EscapeMng.GetInstance().Set_Gold_Coin(coin);
        EscapeMng.GetInstance().Set_HasSkins(clickID, 0);
        //this.OnUpdateMenuStatus();
        this.onUpdateCoin();
        FirebaseReport.reportInformation(FirebaseKey.skin_goumai);
        this.OnBtnAction(clickID);
    }

    
    OnBtnShowAds(clikID: number) { 
        BackGroundSoundUtils.GetInstance().PlayEffect("effect_button");
        this.OnUpdateFrame(clikID);
        //if (cc.sys.platform === cc.sys.ANDROID) {
        //    FirebaseReport.reportInformation(FirebaseKey.skin_ad2);
        //    let bAdLoaded = jsb.reflection.callStaticMethod("org/cocos2dx/javascript/RewardedAdManager", "JsCall_hadLoadedAd", "()Z");
        //    if (bAdLoaded) {
        //        jsb.reflection.callStaticMethod("org/cocos2dx/javascript/RewardedAdManager", "JsCall_showAdIfAvailable", "(Ljava/lang/String;)V", "cc['skinView'].CallJaveGetSkin()");
        //    }
        //    else {
        //        FirebaseReport.reportInformation(FirebaseKey.skin_ad2_2);
        //        this.OnChangeAdsShinStatus();
        //    }
        //}
        //else {
        //    this.OnChangeAdsShinStatus();
        //} 
        FirebaseReport.reportKeys(FireKeys.skin_Ad2);
        //FirebaseReport.reportInformation(FirebaseKey.skin_ad2);
        sdkManager.GetInstance().JavaRewardedAds("skin_ad2",()=>{this.OnChangeAdsShinStatus();} , ()=>{this.OnChangeAdsShinStatus();})
    }

    OnChangeAdsShinStatus() {
        EscapeMng.GetInstance().Set_HasSkins(this.curClickId, 0);
        EscapeMng.GetInstance().SetIntAdStatus();
        //this.OnUpdateMenuStatus();
        this.OnBtnAction(this.curClickId);
    }

    public static CallJaveGetSkin() {
        SkinView.getInstance().OnChangeAdsShinStatus();
        if (cc.sys.platform === cc.sys.ANDROID) {
            FirebaseReport.reportInformation(FirebaseKey.skin_ad2_1);
        }
    }

    OnUpdateFrame(click) {
        if (this.curClickId == click) {
            return;
        }
        if (this.m_HeroNote[this.curClickId - 1]) {
            this.m_HeroNote[this.curClickId - 1].getChildByName("frame1").active = true;
            this.m_HeroNote[this.curClickId - 1].getChildByName("frame2").active = false;
        }      
        this.curClickId = click;
        this.m_HeroNote[this.curClickId - 1].getChildByName("frame1").active = false;
        this.m_HeroNote[this.curClickId - 1].getChildByName("frame2").active = true;
        this.OnUpdateHero();
    }

    OnUpdateMenuStatus() {
        var curHiroId = EscapeMng.GetInstance().Get_Hero();
        var coin = EscapeMng.GetInstance().Get_Gold_Coin()

        //var curTable = EscapeMng.GetInstance().Get_SkinStatus();
        //var count = EscapeMng.GetInstance().Get_ShinStatusCount();
  
        for (var i = 0; i < EscapeMng.GetInstance().m_Skins_Count; i++) {
            this.m_HeroNote[i].getChildByName("btn_nobuy").active = false;
            this.m_HeroNote[i].getChildByName("btn_buy").active = false;
            this.m_HeroNote[i].getChildByName("btn_use").active = false;
            this.m_HeroNote[i].getChildByName("btn_ads").active = false;
            
            if (EscapeMng.GetInstance().Get_SkinStatusHas(i + 1)) {
                var curTable: number = EscapeMng.GetInstance().Get_SkinStatusType(i + 1);
                if (curHiroId == i + 1) { //��ǰʹ�õĽ�ɫ
                    //this.m_HeroNote[i].getChildByName("frame2").active = true;
                }
                else {
                    if (curTable == 1) {//���δ����
                        this.m_HeroNote[i].getChildByName("btn_ads").active = true;
                    }
                    else {//����ѽ���
                        this.m_HeroNote[i].getChildByName("btn_use").active = true;
                    }
                }
            }
            else {
                if (coin < EscapeMng.GetInstance().m_DefaultBuy_Coin) {
                    this.m_HeroNote[i].getChildByName("btn_nobuy").active = true;
                }
                else {
                    this.m_HeroNote[i].getChildByName("btn_buy").active = true;
                }
            }          
        }
    }

    OnUpdateHero() {
        if (this.m_CurPrefab != null) {
            console.log("this.curClickId   :" + this.m_CurPrefab.name);
            this.m_CurPrefab.destroy();
        }
        var self = this;        
        cc.loader.loadRes("prefab/p" + this.curClickId, cc.Prefab, (e, p) => {
            var pnode = cc.instantiate(p as cc.Prefab);
            self.node.addChild(pnode, 50);
            pnode.setPosition(this.tophero.position.x, this.tophero.position.y - 180);

            pnode.getChildByName("p").setScale(1, 1);
            this.m_CurPrefab = pnode;           
        });
    }
    
}
